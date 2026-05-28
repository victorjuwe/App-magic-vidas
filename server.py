import os
import re
import sys
import json
import time
import random
import socket
import threading
import subprocess
import urllib.request
import urllib.parse
from http.server import SimpleHTTPRequestHandler, HTTPServer
from PIL import Image
import io

# Port configuration
PORT = 8000
COMFYUI_PORT = 8188

# Global state for theme generation
state_lock = threading.Lock()
generation_state = {
    "generation_status": "idle",  # "idle", "generating", "success", "error"
    "progress": 0,
    "status_text": "No generation running",
    "preview_top": "",
    "preview_bottom": "",
    "prompt_id": None
}

# Default workflow for SDXL models (e.g. DreamShaperXL_Lightning)
DEFAULT_WORKFLOW = {
  "3": {
    "inputs": {
      "ckpt_name": "DreamShaperXL_Lightning.safetensors"
    },
    "class_type": "CheckpointLoaderSimple"
  },
  "4": {
    "inputs": {
      "width": 1024,
      "height": 768,
      "batch_size": 1
    },
    "class_type": "EmptyLatentImage"
  },
  "6": {
    "inputs": {
      "text": "positive prompt",
      "clip": ["3", 1]
    },
    "class_type": "CLIPTextEncode"
  },
  "7": {
    "inputs": {
      "text": "negative prompt",
      "clip": ["3", 1]
    },
    "class_type": "CLIPTextEncode"
  },
  "8": {
    "inputs": {
      "seed": 0,
      "steps": 6,
      "cfg": 2.0,
      "sampler_name": "dpmpp_2m_sde",
      "scheduler": "karras",
      "denoise": 1.0,
      "model": ["3", 0],
      "positive": ["6", 0],
      "negative": ["7", 0],
      "latent_image": ["4", 0]
    },
    "class_type": "KSampler"
  },
  "9": {
    "inputs": {
      "samples": ["8", 0],
      "vae": ["3", 2]
    },
    "class_type": "VAEDecode"
  },
  "10": {
    "inputs": {
      "images": ["9", 0],
      "filename_prefix": "MTGTheme"
    },
    "class_type": "SaveImage"
  }
}

def log(msg):
    print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] {msg}", flush=True)

def is_comfy_running():
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(1.0)
    try:
        s.connect(('127.0.0.1', COMFYUI_PORT))
        s.close()
        return True
    except Exception:
        return False

def find_source_clip_text_encode(workflow, node_id):
    node = workflow.get(str(node_id))
    if not node:
        return None
    if node.get("class_type") == "CLIPTextEncode":
        return node_id
    # Trace inputs to find conditioning sources
    for input_name, input_val in node.get("inputs", {}).items():
        if isinstance(input_val, list) and len(input_val) == 2:
            source_id = input_val[0]
            res = find_source_clip_text_encode(workflow, source_id)
            if res:
                return res
    return None

def inject_workflow_data(workflow, positive_prompt, negative_prompt, seed):
    # Find KSampler node
    ksampler_node = None
    ksampler_id = None
    for nid, node in workflow.items():
        if node.get("class_type") in ("KSampler", "KSamplerAdvanced"):
            ksampler_node = node
            ksampler_id = nid
            break
            
    if not ksampler_node:
        # Fallback: set seed on any node that has it
        for nid, node in workflow.items():
            if "inputs" in node and "seed" in node["inputs"]:
                node["inputs"]["seed"] = seed
        # Fallback for CLIPTextEncode
        clip_nodes = [node for node in workflow.values() if node.get("class_type") == "CLIPTextEncode"]
        if len(clip_nodes) >= 2:
            clip_nodes[0]["inputs"]["text"] = positive_prompt
            clip_nodes[1]["inputs"]["text"] = negative_prompt
        elif len(clip_nodes) == 1:
            clip_nodes[0]["inputs"]["text"] = positive_prompt
        return workflow

    # Inject seed
    ksampler_node["inputs"]["seed"] = seed
    
    # Trace conditioning inputs
    pos_id = ksampler_node["inputs"].get("positive", [None])[0]
    neg_id = ksampler_node["inputs"].get("negative", [None])[0]
    
    pos_clip_id = find_source_clip_text_encode(workflow, pos_id) if pos_id else None
    neg_clip_id = find_source_clip_text_encode(workflow, neg_id) if neg_id else None
    
    if pos_clip_id:
        workflow[str(pos_clip_id)]["inputs"]["text"] = positive_prompt
    if neg_clip_id:
        workflow[str(neg_clip_id)]["inputs"]["text"] = negative_prompt
        
    # Standard resolution: if it's default, we also check EmptyLatentImage
    # (no need for custom workflow unless they want to keep resolution)
    
    # Fallback to count-based matching of CLIPTextEncodes if tracing failed
    all_clip_nodes = [(nid, node) for nid, node in workflow.items() if node.get("class_type") == "CLIPTextEncode"]
    if not pos_clip_id or not neg_clip_id:
        if len(all_clip_nodes) == 2:
            if neg_clip_id and str(all_clip_nodes[0][0]) == str(neg_clip_id):
                workflow[str(all_clip_nodes[1][0])]["inputs"]["text"] = positive_prompt
            elif neg_clip_id and str(all_clip_nodes[1][0]) == str(neg_clip_id):
                workflow[str(all_clip_nodes[0][0])]["inputs"]["text"] = positive_prompt
            elif pos_clip_id and str(all_clip_nodes[0][0]) == str(pos_clip_id):
                workflow[str(all_clip_nodes[1][0])]["inputs"]["text"] = negative_prompt
            elif pos_clip_id and str(all_clip_nodes[1][0]) == str(pos_clip_id):
                workflow[str(all_clip_nodes[0][0])]["inputs"]["text"] = negative_prompt
            else:
                workflow[str(all_clip_nodes[0][0])]["inputs"]["text"] = positive_prompt
                workflow[str(all_clip_nodes[1][0])]["inputs"]["text"] = negative_prompt
        elif len(all_clip_nodes) == 1:
            workflow[str(all_clip_nodes[0][0])]["inputs"]["text"] = positive_prompt
            
    return workflow

def register_in_style_css(filepath, theme_id):
    css_rule = (
        f'\nbody[data-theme="{theme_id}"] #p1 {{ '
        f"background-image: url('./themes/{theme_id}/top.png') !important; "
        f"background-position: center center !important; "
        f"background-size: cover !important; "
        f"}}\n"
        f'body[data-theme="{theme_id}"] #p2 {{ '
        f"background-image: url('./themes/{theme_id}/bottom.png') !important; "
        f"background-position: center center !important; "
        f"background-size: cover !important; "
        f"}}\n"
    )
    
    with open(filepath, 'r', encoding='utf-8') as f:
        css_content = f.read()
        
    if f'body[data-theme="{theme_id}"]' in css_content:
        log(f"[CSS] Theme {theme_id} already registered in style.css. Skipping write.")
        return
        
    with open(filepath, 'a', encoding='utf-8') as f:
        f.write(css_rule)
    log(f"[CSS] Appended CSS rules for theme {theme_id} to style.css")

def update_engine_js(filepath, theme_id, theme_name, dmg_phrases=None, heal_phrases=None):
    if not dmg_phrases:
        dmg_phrases = ["¡Daño crítico!", "¡Siente el impacto!", "¡Cuidado!"]
    if not heal_phrases:
        heal_phrases = ["¡Restaurando energía!", "¡Curación divina!", "¡Recuperando fuerzas!"]
        
    # Format list values safely
    dmg_clean = [p.strip().replace('"', '\\"') for p in dmg_phrases if p.strip()]
    dmg_formatted = ",\n          ".join([f'"{p}"' for p in dmg_clean])
    
    heal_clean = [p.strip().replace('"', '\\"') for p in heal_phrases if p.strip()]
    heal_formatted = ",\n          ".join([f'"{p}"' for p in heal_clean])

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    themes_start_idx = content.find("const THEMES = {")
    if themes_start_idx == -1:
        raise ValueError("Could not find const THEMES in engine.js")
        
    brace_start = content.find("{", themes_start_idx)
    
    brace_count = 0
    brace_end = -1
    in_string = False
    string_char = None
    i = brace_start
    while i < len(content):
        char = content[i]
        if char in ['"', "'", '`'] and (i == 0 or content[i-1] != '\\'):
            if not in_string:
                in_string = True
                string_char = char
            elif string_char == char:
                in_string = False
        if not in_string:
            if char == '{':
                brace_count += 1
            elif char == '}':
                brace_count -= 1
                if brace_count == 0:
                    brace_end = i
                    break
        i += 1
        
    if brace_end == -1:
        raise ValueError("Unbalanced braces in engine.js THEMES definition")
        
    themes_block = content[brace_start + 1 : brace_end]
    
    # Remove existing theme entry if it exists to avoid duplication
    pattern_str = r'\b' + re.escape(theme_id) + r'\s*:\s*\{'
    match = re.search(pattern_str, themes_block)
    if match:
        entry_start = match.start()
        entry_brace_start = match.end() - 1
        entry_brace_count = 0
        entry_brace_end = -1
        entry_in_string = False
        entry_string_char = None
        j = entry_brace_start
        while j < len(themes_block):
            char = themes_block[j]
            if char in ['"', "'", '`'] and (j == 0 or themes_block[j-1] != '\\'):
                if not entry_in_string:
                    entry_in_string = True
                    entry_string_char = char
                elif entry_string_char == char:
                    entry_in_string = False
            if not entry_in_string:
                if char == '{':
                    entry_brace_count += 1
                elif char == '}':
                    entry_brace_count -= 1
                    if entry_brace_count == 0:
                        entry_brace_end = j
                        break
            j += 1
        
        if entry_brace_end != -1:
            entry_to_remove = themes_block[entry_start : entry_brace_end + 1]
            after_entry = themes_block[entry_brace_end + 1:]
            comma_match = re.match(r'^\s*,\s*', after_entry)
            if comma_match:
                themes_block = themes_block[:entry_start] + after_entry[comma_match.end():]
            else:
                themes_block = themes_block[:entry_start] + after_entry
                
    # Prepare the new theme entry code
    new_entry = f"""\n      {theme_id}: {{
        name: '{theme_name}',
        dmg: [
          {dmg_formatted}
        ],
        heal: [
          {heal_formatted}
        ]
      }},"""
      
    new_themes_block = new_entry + themes_block
    final_content = content[:brace_start + 1] + new_themes_block + content[brace_end:]
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(final_content)
    log(f"[JS] Successfully added theme {theme_id} to engine.js THEMES constant.")

def execute_comfy_generation(workflow_data, progress_start, progress_end, status_prefix):
    global generation_state
    
    prompt_payload = {
        "prompt": workflow_data
    }
    
    data_bytes = json.dumps(prompt_payload).encode('utf-8')
    req = urllib.request.Request(
        f"http://127.0.0.1:{COMFYUI_PORT}/prompt",
        data=data_bytes,
        headers={'Content-Type': 'application/json'}
    )
    
    with urllib.request.urlopen(req) as response:
        res_data = json.loads(response.read().decode('utf-8'))
        
    prompt_id = res_data.get("prompt_id")
    if not prompt_id:
        raise Exception("ComfyUI no devolvió un prompt_id. Errores: " + str(res_data.get("node_errors")))
        
    log(f"[{status_prefix}] Petición enviada. prompt_id: {prompt_id}")
    
    with state_lock:
        generation_state.update({
            "prompt_id": prompt_id,
            "progress": progress_start,
            "status_text": f"{status_prefix}: Petición encolada..."
        })
        
    # Poll status
    max_retries = 3
    missing_count = 0
    
    while True:
        time.sleep(1.5)
        
        # Check history
        history_url = f"http://127.0.0.1:{COMFYUI_PORT}/history/{prompt_id}"
        try:
            with urllib.request.urlopen(history_url) as resp:
                history = json.loads(resp.read().decode('utf-8'))
        except Exception as e:
            log(f"[{status_prefix}] Error comprobando historial: {e}")
            continue
            
        if prompt_id in history:
            log(f"[{status_prefix}] ¡Generación de ComfyUI completada!")
            break
            
        # Check queue status
        queue_url = f"http://127.0.0.1:{COMFYUI_PORT}/queue"
        try:
            with urllib.request.urlopen(queue_url) as resp:
                queue_data = json.loads(resp.read().decode('utf-8'))
        except Exception as e:
            log(f"[{status_prefix}] Error comprobando cola: {e}")
            continue
            
        queue_running = queue_data.get("queue_running", [])
        queue_pending = queue_data.get("queue_pending", [])
        
        is_running = any(item[1] == prompt_id for item in queue_running)
        is_pending = any(item[1] == prompt_id for item in queue_pending)
        
        if is_running:
            missing_count = 0
            with state_lock:
                generation_state.update({
                    "progress": progress_start + int((progress_end - progress_start) * 0.7),
                    "status_text": f"{status_prefix}: Generando imagen en ComfyUI local..."
                })
        elif is_pending:
            missing_count = 0
            position = 1
            for idx, item in enumerate(queue_pending):
                if item[1] == prompt_id:
                    position = idx + 1
                    break
            with state_lock:
                generation_state.update({
                    "progress": progress_start + int((progress_end - progress_start) * 0.2),
                    "status_text": f"{status_prefix}: En cola de espera (Posición {position})..."
                })
        else:
            missing_count += 1
            log(f"[{status_prefix}] Prompt ID no encontrado en cola o historial. Intento: {missing_count}")
            if missing_count >= max_retries:
                time.sleep(2.0)
                with urllib.request.urlopen(history_url) as resp:
                    history = json.loads(resp.read().decode('utf-8'))
                if prompt_id in history:
                    break
                raise Exception(f"{status_prefix}: La petición desapareció de la cola de ComfyUI.")
                
    # Process completed generation
    prompt_output = history[prompt_id]
    outputs = prompt_output.get("outputs", {})
    
    images = []
    for node_id, node_output in outputs.items():
        if "images" in node_output:
            for img in node_output["images"]:
                images.append(img)
                
    if not images:
        raise Exception(f"{status_prefix}: No se encontraron imágenes en el resultado.")
        
    log(f"[{status_prefix}] Descargando imagen: {images[0]['filename']}")
    target_img = images[0]
    filename = target_img["filename"]
    subfolder = target_img["subfolder"]
    img_type = target_img["type"]
    
    view_url = f"http://127.0.0.1:{COMFYUI_PORT}/view?filename={urllib.parse.quote(filename)}&subfolder={urllib.parse.quote(subfolder)}&type={urllib.parse.quote(img_type)}"
    
    with urllib.request.urlopen(view_url) as resp:
        image_bytes = resp.read()
        
    return Image.open(io.BytesIO(image_bytes))

def generation_worker(theme_id, theme_name, prompt_top, prompt_bottom, negative_prompt, workflow_template, dmg_phrases=None, heal_phrases=None):
    global generation_state
    
    try:
        repo_dir = os.path.dirname(os.path.abspath(__file__))
        theme_dir = os.path.join(repo_dir, 'themes', theme_id)
        os.makedirs(theme_dir, exist_ok=True)
        
        # ----------------------------------------------------------------------
        # PASO 1: Generar Fondo Superior (Top)
        # ----------------------------------------------------------------------
        log(f"[Worker] Iniciando generación de Fondo Superior para {theme_id}")
        workflow_top = json.loads(json.dumps(workflow_template))
        seed_top = random.randint(0, 2**32 - 1)
        workflow_top = inject_workflow_data(workflow_top, prompt_top, negative_prompt, seed_top)
        
        top_pil_img = execute_comfy_generation(
            workflow_data=workflow_top,
            progress_start=5,
            progress_end=45,
            status_prefix="Fondo Superior (P1)"
        )
        
        # Save top.png
        top_pil_img = top_pil_img.convert("RGB")
        top_pil_img.save(os.path.join(theme_dir, 'top.png'), 'PNG')
        log(f"[Worker] Fondo Superior guardado como top.png")
        
        with state_lock:
            generation_state.update({
                "progress": 50,
                "status_text": "Fondo Superior guardado. Iniciando Fondo Inferior..."
            })
            
        # ----------------------------------------------------------------------
        # PASO 2: Generar Fondo Inferior (Bottom)
        # ----------------------------------------------------------------------
        log(f"[Worker] Iniciando generación de Fondo Inferior para {theme_id}")
        workflow_bottom = json.loads(json.dumps(workflow_template))
        seed_bottom = random.randint(0, 2**32 - 1)
        workflow_bottom = inject_workflow_data(workflow_bottom, prompt_bottom, negative_prompt, seed_bottom)
        
        bottom_pil_img = execute_comfy_generation(
            workflow_data=workflow_bottom,
            progress_start=50,
            progress_end=90,
            status_prefix="Fondo Inferior (P2)"
        )
        
        # Save bottom.png
        bottom_pil_img = bottom_pil_img.convert("RGB")
        bottom_pil_img.save(os.path.join(theme_dir, 'bottom.png'), 'PNG')
        log(f"[Worker] Fondo Inferior guardado como bottom.png")
        
        with state_lock:
            generation_state.update({
                "progress": 95,
                "status_text": "Ambos fondos guardados. Registrando tema en la app..."
            })
            
        # ----------------------------------------------------------------------
        # REGISTRO EN EL SISTEMA
        # ----------------------------------------------------------------------
        # Registrar CSS
        style_path = os.path.join(repo_dir, 'style.css')
        register_in_style_css(style_path, theme_id)
        
        # Registrar JS
        engine_path = os.path.join(repo_dir, 'engine.js')
        update_engine_js(engine_path, theme_id, theme_name, dmg_phrases, heal_phrases)
        
        with state_lock:
            generation_state.update({
                "generation_status": "success",
                "progress": 100,
                "status_text": "¡Tema generado e integrado exitosamente!",
                "preview_top": f"/themes/{theme_id}/top.png",
                "preview_bottom": f"/themes/{theme_id}/bottom.png"
            })
            
    except Exception as e:
        log(f"[Worker] Error en generación: {e}")
        with state_lock:
            generation_state.update({
                "generation_status": "error",
                "status_text": f"Error: {str(e)}",
                "progress": 100
            })

class MTGOrchestrationHandler(SimpleHTTPRequestHandler):
    def send_json(self, data, status_code=200):
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path
        
        if path == '/api/status':
            running = is_comfy_running()
            with state_lock:
                response = {
                    "comfy_running": running,
                    "generation_status": generation_state["generation_status"],
                    "progress": generation_state["progress"],
                    "status_text": generation_state["status_text"],
                    "preview_top": generation_state["preview_top"],
                    "preview_bottom": generation_state["preview_bottom"]
                }
            self.send_json(response)
        elif path in ('/', '/index.html'):
            self.path = '/contador.html'
            super().do_GET()
        else:
            super().do_GET()

    def do_POST(self):
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path
        
        if path == '/api/start-comfy':
            if is_comfy_running():
                self.send_json({"status": "already_running"})
                return
            try:
                cmd = [
                    r"C:\IA\Data\Packages\ComfyUI\venv\Scripts\python.exe",
                    r"C:\IA\Data\Packages\ComfyUI\main.py",
                    "--listen", "127.0.0.1",
                    "--port", "8188"
                ]
                log(f"Starting ComfyUI process: {' '.join(cmd)}")
                subprocess.Popen(cmd, creationflags=0x00000010, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                self.send_json({"status": "success"})
            except Exception as e:
                log(f"Failed to start ComfyUI: {e}")
                self.send_json({"status": "error", "error": str(e)}, 500)
                
        elif path == '/api/generate':
            global generation_state
            
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length).decode('utf-8')
            try:
                data = json.loads(body)
            except Exception as e:
                self.send_json({"status": "error", "error": "Invalid JSON"}, 400)
                return
                
            theme_id = data.get('theme_id')
            theme_name = data.get('theme_name') or (theme_id.capitalize() if theme_id else None)
            prompt_top = data.get('prompt_top')
            prompt_bottom = data.get('prompt_bottom')
            negative_prompt = data.get('negative_prompt', 'blurry, low quality, distorted')
            workflow_json_str = data.get('workflow_json')
            
            if not theme_id or not re.match(r'^[a-zA-Z0-9_]+$', theme_id):
                self.send_json({"status": "error", "error": "El ID de tema es inválido (usa letras, números y guiones bajos solamente)."}, 400)
                return
                
            if not prompt_top or not prompt_bottom:
                self.send_json({"status": "error", "error": "Ambos prompts positivos (superior e inferior) son requeridos."}, 400)
                return
                
            if not is_comfy_running():
                self.send_json({"status": "error", "error": "ComfyUI no está activo. Inícialo antes de generar."}, 503)
                return
                
            with state_lock:
                if generation_state["generation_status"] == "generating":
                    self.send_json({"status": "error", "error": "Ya hay una generación en curso."}, 409)
                    return
                
                # Set initial state
                generation_state.update({
                    "generation_status": "generating",
                    "progress": 5,
                    "status_text": "Configurando workflow...",
                    "preview_top": "",
                    "preview_bottom": "",
                    "prompt_id": None
                })
                
            try:
                if workflow_json_str:
                    workflow_template = json.loads(workflow_json_str)
                else:
                    workflow_template = json.loads(json.dumps(DEFAULT_WORKFLOW))
            except Exception as e:
                with state_lock:
                    generation_state.update({
                        "generation_status": "error",
                        "status_text": f"Error en workflow: {str(e)}",
                        "progress": 100
                    })
                self.send_json({"status": "error", "error": f"Error en workflow: {str(e)}"}, 400)
                return
                
            # Start background generation thread
            t = threading.Thread(
                target=generation_worker,
                args=(theme_id, theme_name, prompt_top, prompt_bottom, negative_prompt, workflow_template, data.get('dmg', []), data.get('heal', [])),
                daemon=True
            )
            t.start()
            
            self.send_json({"status": "queued"})
        else:
            self.send_error(404, "Endpoint no encontrado")

def run_server():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, MTGOrchestrationHandler)
    log(f"Orchestration server running on port {PORT}...")
    log(f"Access the client UI at http://localhost:{PORT}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        log("Server stopping...")
        httpd.server_close()

if __name__ == '__main__':
    run_server()
