import os
from PIL import Image

src = r"C:\Users\Víctor Sanguino\.gemini\antigravity\brain\2b9fe21c-c931-4fbe-95f2-85df4fb2b15c\rickmorty_pickle_theme_1779976558977.png"
dest_dir = r"c:\TRABAJOS IA\MAGIC THE GATHERING\contador\themes\rickmorty"

img = Image.open(src)
w, h = img.size
half_h = h // 2

# Recortar en dos mitades
top_img = img.crop((0, 0, w, half_h))
bottom_img = img.crop((0, half_h, w, h))

# Guardar en la carpeta del tema
top_img.save(os.path.join(dest_dir, "top.webp"), "WEBP", quality=90)
bottom_img.save(os.path.join(dest_dir, "bottom.webp"), "WEBP", quality=90)
print("¡Recorte y conversión completados para el tema de Rick y Morty!")
