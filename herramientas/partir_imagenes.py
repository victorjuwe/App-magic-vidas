import os
from PIL import Image

themes_to_process = [
    {
        "src": "ejemplos/Bleach cartaa.png",
        "dest_dir": "themes/bleach"
    },
    {
        "src": "ejemplos/Street fithers carta.png",
        "dest_dir": "themes/streetfighter"
    },
    {
        "src": "ejemplos/regreso al futuro carta.png",
        "dest_dir": "themes/bttf"
    }
]

for theme in themes_to_process:
    src_path = theme["src"]
    dest_dir = theme["dest_dir"]
    
    if not os.path.exists(src_path):
        print(f"Archivo no encontrado: {src_path}")
        continue
        
    print(f"Procesando {src_path}...")
    img = Image.open(src_path)
    w, h = img.size
    half_h = h // 2
    
    # Recortar mitad superior (top)
    top_img = img.crop((0, 0, w, half_h))
    
    # Recortar mitad inferior (bottom)
    bottom_img = img.crop((0, half_h, w, h))
    
    # Asegurar que el directorio de destino existe
    os.makedirs(dest_dir, exist_ok=True)
    
    # Guardar como WebP optimizado
    top_path = os.path.join(dest_dir, "top.webp")
    bottom_path = os.path.join(dest_dir, "bottom.webp")
    
    top_img.save(top_path, "WEBP", quality=90)
    bottom_img.save(bottom_path, "WEBP", quality=90)
    
    print(f"Guardado exitoso: {top_path} y {bottom_path}")
