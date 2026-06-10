#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import sys
import urllib.request
import urllib.parse
import re
import subprocess

THEMES_DIR = "c:/TRABAJOS IA/MAGIC THE GATHERING/contador/themes"
SW_FILE = "c:/TRABAJOS IA/MAGIC THE GATHERING/contador/service-worker.js"

THEME_REQUIRED_FILES = {
    "simpsons": ["+1.mp3", "+5.mp3", "-1.mp3", "-5.mp3", "dmg.mp3", "heal.mp3", "intro.mp3", "victory.mp3"],
    "rickmorty": ["-1.mp3", "dmg.mp3", "heal.mp3", "intro.mp3", "victory.mp3"],
    "bttf": ["+1.mp3", "+5.mp3", "-1.mp3", "-5.mp3", "dmg.mp3", "heal.mp3", "loading song.mp3", "victory.mp3"],
    "bleach": ["+5.mp3", "-1.mp3", "dmg.mp3", "heal.mp3", "intro.mp3", "victory.mp3"],
    "onepiece": ["dmg.mp3", "heal.mp3", "intro.mp3", "victory.mp3"],
    "naruto": ["+1.mp3", "+5.mp3", "-1.mp3", "-5.mp3", "dmg.mp3", "heal.mp3", "intro.mp3", "victory.mp3"],
    "dragonball": ["+1.mp3", "-1.mp3", "-5.mp3", "dmg.mp3", "heal.mp3", "intro.mp3", "victory.mp3"],
    "mario": ["+1.mp3", "+5.mp3", "-1.mp3", "-5.mp3", "dmg.mp3", "heal.mp3", "intro.mp3", "victory.mp3"],
    "demonslayer": ["+1.mp3", "dmg.mp3", "heal.mp3", "intro.mp3", "victory.mp3"],
    "streetfighter": ["coin.mp3", "dmg.mp3", "fight.mp3", "gameover.mp3", "hadouken.mp3", "heal.mp3", "intro.mp3", "perfect.mp3", "shoryuken.mp3", "tatsumaki.mp3", "victory.mp3"]
}

def print_help():
    print("=" * 60)
    print("      GESTOR DE SONIDOS - PWA MAGIC COUNTER")
    print("=" * 60)
    print("Comandos disponibles:")
    print("  python herramientas/gestionar_audios.py auditar")
    print("      Audita los sonidos de todos los temas en el proyecto.")
    print("\n  python herramientas/gestionar_audios.py buscar \"<término>\"")
    print("      Busca un efecto de sonido en MyInstants y muestra sus slugs.")
    print("\n  python herramientas/gestionar_audios.py descargar <tema> <archivo> <slug>")
    print("      Descarga un sonido de MyInstants y lo guarda en el tema.")
    print("      Ejemplo: descargar naruto -1 naruto-substitution-sound")
    print("\n  python herramientas/gestionar_audios.py recortar <tema> <archivo> <duración_segundos>")
    print("      Recorta un sonido usando ffmpeg localmente.")
    print("      Ejemplo: recortar naruto -1 1.6")
    print("\n  python herramientas/gestionar_audios.py actualizar")
    print("      Incrementa la versión de caché en el Service Worker.")
    print("=" * 60)

def get_headers():
    return {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Referer': 'https://www.myinstants.com/'
    }

def command_auditar():
    print("\n=== AUDITORIA DE ARCHIVOS DE AUDIO ===")
    all_ok = True
    for theme, files in THEME_REQUIRED_FILES.items():
        print(f"\n[TEMA] {theme.upper()}")
        theme_path = os.path.join(THEMES_DIR, theme)
        if not os.path.exists(theme_path):
            print(f"  [ERROR] Directorio del tema no existe: {theme_path}")
            all_ok = False
            continue
            
        for f in files:
            file_path = os.path.join(theme_path, f)
            if not os.path.exists(file_path):
                print(f"  [FALTA] {f}")
                all_ok = False
            else:
                size_kb = os.path.getsize(file_path) / 1024.0
                if size_kb < 1.0:
                    print(f"  [VACIO/DIMINUTO] {f} ({size_kb:.1f} KB)")
                    all_ok = False
                else:
                    print(f"  [OK] {f:<20} ({size_kb:5.1f} KB)")
                    
    if all_ok:
        print("\n[EXITO] ¡Todos los audios criticos estan presentes y son validos!")
    else:
        print("\n[FALLO] Se detectaron fallos o ausencias de archivos en la auditoria.")

def command_buscar(query):
    print(f"\n=== BUSCANDO EN MYINSTANTS: '{query}' ===")
    encoded_query = urllib.parse.quote_plus(query)
    url = f"https://www.myinstants.com/en/search/?name={encoded_query}"
    
    req = urllib.request.Request(url, headers=get_headers())
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            html = response.read().decode('utf-8')
    except Exception as e:
        print(f"Error al conectar con MyInstants: {e}")
        return
        
    instants = re.findall(r"play\('([^']+)'[^>]*>.*?href=\"/en/instant/([^/]+)/\"[^>]*>([^<]+)</a>", html, re.DOTALL)
    if not instants:
        # Intentar fallback de búsqueda sin idioma
        url = f"https://www.myinstants.com/search/?name={encoded_query}"
        req = urllib.request.Request(url, headers=get_headers())
        try:
            with urllib.request.urlopen(req, timeout=10) as response:
                html = response.read().decode('utf-8')
            instants = re.findall(r"play\('([^']+)'[^>]*>.*?href=\"/en/instant/([^/]+)/\"[^>]*>([^<]+)</a>", html, re.DOTALL)
        except Exception:
            pass
            
    if not instants:
        print("No se encontraron resultados para tu búsqueda.")
        return
        
    print(f"\nResultados encontrados (máximo 10):")
    print("-" * 75)
    for idx, (sound, slug, title) in enumerate(instants[:10], 1):
        clean_title = title.strip().replace('&#x27;', "'").replace('&amp;', '&')
        print(f"{idx:>2}. Título: {clean_title}")
        print(f"    Slug:   {slug}")
        print(f"    Sonido: {sound.split('/')[-1]}")
        print("-" * 75)

def command_descargar(theme, filename, slug):
    # Validar que el tema existe en nuestra lista
    if theme not in THEME_REQUIRED_FILES:
        print(f"Error: El tema '{theme}' no está registrado en el motor de audios.")
        print("Temas válidos:", ", ".join(THEME_REQUIRED_FILES.keys()))
        return
        
    # Validar extensión del archivo
    if not filename.endswith('.mp3'):
        filename += '.mp3'
        
    theme_path = os.path.join(THEMES_DIR, theme)
    if not os.path.exists(theme_path):
        os.makedirs(theme_path)
        
    dest_path = os.path.join(theme_path, filename)
    
    # 1. Intentar resolver el slug cargando su página de detalles
    sound_url = None
    print(f"\nResolviendo slug '{slug}'...")
    for lang_prefix in ["/en/instant/", "/instant/", "/es/instant/"]:
        detail_url = f"https://www.myinstants.com{lang_prefix}{slug}/"
        req = urllib.request.Request(detail_url, headers=get_headers())
        try:
            with urllib.request.urlopen(req, timeout=10) as response:
                html = response.read().decode('utf-8')
            match = re.search(r"play\('([^']+)'", html)
            if match:
                sound_url = f"https://www.myinstants.com{match.group(1)}"
                break
        except Exception:
            continue
            
    if not sound_url:
        # Fallback si no se puede resolver el slug
        print("No se pudo resolver el slug desde su pagina de detalles. Intentando descarga directa...")
        sound_url = f"https://www.myinstants.com/media/sounds/{slug}.mp3"
        
    print(f"Descargando desde: {sound_url}")
    
    req = urllib.request.Request(sound_url, headers=get_headers())
    try:
        tmp_path = dest_path + ".tmp"
        with urllib.request.urlopen(req, timeout=15) as response:
            with open(tmp_path, 'wb') as out_file:
                out_file.write(response.read())
                
        size = os.path.getsize(tmp_path)
        if size < 5000:
            print(f"Error: El archivo descargado es demasiado pequeño ({size} bytes).")
            if os.path.exists(tmp_path):
                os.remove(tmp_path)
            return
            
        if os.path.exists(dest_path):
            os.remove(dest_path)
        os.rename(tmp_path, dest_path)
        print(f"[OK] Descarga completada con exito! Tamano: {size/1024.0:.1f} KB")
        print(f"Guardado en: {dest_path}")
        
    except Exception as e:
        print(f"Error al descargar: {e}")
        if os.path.exists(dest_path + ".tmp"):
            os.remove(dest_path + ".tmp")

def command_recortar(theme, filename, duration_str):
    if not filename.endswith('.mp3'):
        filename += '.mp3'
        
    file_path = os.path.join(THEMES_DIR, theme, filename)
    if not os.path.exists(file_path):
        print(f"Error: El archivo de origen no existe: {file_path}")
        return
        
    try:
        duration = float(duration_str)
    except ValueError:
        print(f"Error: Duración inválida '{duration_str}'. Debe ser un número decimal.")
        return
        
    temp_path = file_path + ".trim.mp3"
    print(f"\nRecortando '{file_path}' a {duration} segundos...")
    
    # Ejecutar ffmpeg localmente de forma segura
    try:
        cmd = ["ffmpeg", "-y", "-i", file_path, "-ss", "0", "-t", str(duration), "-c", "copy", temp_path]
        result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if result.returncode == 0 and os.path.exists(temp_path) and os.path.getsize(temp_path) > 1000:
            old_size = os.path.getsize(file_path)
            new_size = os.path.getsize(temp_path)
            os.remove(file_path)
            os.rename(temp_path, file_path)
            print(f"[OK] Recorte exitoso! Reemplazado {filename} ({old_size/1024.0:.1f} KB -> {new_size/1024.0:.1f} KB)")
        else:
            print("Error al recortar. Asegúrate de que ffmpeg está instalado y en el PATH de tu sistema.")
            print("Detalles del error:", result.stderr.decode('utf-8', errors='ignore'))
            if os.path.exists(temp_path):
                os.remove(temp_path)
    except FileNotFoundError:
        print("Error: No se encontró 'ffmpeg' en el sistema. Instálalo para poder recortar audios de forma automática.")
    except Exception as e:
        print(f"Excepción al recortar: {e}")
        if os.path.exists(temp_path):
            os.remove(temp_path)

def command_actualizar():
    if not os.path.exists(SW_FILE):
        print(f"Error: No se encontró el archivo del service worker: {SW_FILE}")
        return
        
    print("\nActualizando caché del Service Worker...")
    try:
        with open(SW_FILE, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Buscar la versión de caché actual (ej: magic-bo3-v93)
        match = re.search(r"const CACHE = 'magic-bo3-v(\d+)';", content)
        if match:
            curr_ver = int(match.group(1))
            next_ver = curr_ver + 1
            new_content = re.sub(
                r"const CACHE = 'magic-bo3-v\d+';",
                f"const CACHE = 'magic-bo3-v{next_ver}';",
                content
            )
            with open(SW_FILE, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"[OK] Cache del Service Worker incrementada de v{curr_ver} a v{next_ver}.")
        else:
            print("No se pudo encontrar el patrón 'const CACHE = 'magic-bo3-vXX'' en el Service Worker.")
    except Exception as e:
        print(f"Error al actualizar el Service Worker: {e}")

def main():
    if len(sys.argv) < 2:
        print_help()
        sys.exit(1)
        
    cmd = sys.argv[1].lower()
    
    if cmd == "auditar":
        command_auditar()
    elif cmd == "buscar":
        if len(sys.argv) < 3:
            print("Error: Debes proporcionar un término de búsqueda.")
            print("Ejemplo: python herramientas/gestionar_audios.py buscar \"naruto\"")
            sys.exit(1)
        command_buscar(sys.argv[2])
    elif cmd == "descargar":
        if len(sys.argv) < 5:
            print("Error: Parámetros insuficientes.")
            print("Uso: python herramientas/gestionar_audios.py descargar <tema> <archivo> <slug>")
            sys.exit(1)
        command_descargar(sys.argv[2], sys.argv[3], sys.argv[4])
    elif cmd == "recortar":
        if len(sys.argv) < 5:
            print("Error: Parámetros insuficientes.")
            print("Uso: python herramientas/gestionar_audios.py recortar <tema> <archivo> <segundos>")
            sys.exit(1)
        command_recortar(sys.argv[2], sys.argv[3], sys.argv[4])
    elif cmd == "actualizar":
        command_actualizar()
    else:
        print(f"Comando desconocido: {cmd}")
        print_help()
        sys.exit(1)

if __name__ == "__main__":
    main()
