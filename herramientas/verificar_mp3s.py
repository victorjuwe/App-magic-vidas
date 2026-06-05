import os

paths = [
    "themes/naruto/dmg.mp3",
    "themes/naruto/heal.mp3",
    "themes/naruto/victory.mp3",
    "themes/onepiece/dmg.mp3",
    "themes/onepiece/heal.mp3",
    "themes/onepiece/victory.mp3",
    "themes/dragonball/dmg.mp3",
    "themes/dragonball/heal.mp3",
    "themes/dragonball/victory.mp3"
]

print("Verificando cabeceras de archivos MP3...")
for p in paths:
    if os.path.exists(p):
        size = os.path.getsize(p)
        with open(p, 'rb') as f:
            header = f.read(100)
        # Check for HTML
        is_html = b"<html" in header.lower() or b"<!doctype" in header.lower()
        if is_html:
            print(f"- {p}: [CORRUPTO / HTML] (Size: {size} bytes) - Comienza con: {header[:30]}")
        else:
            print(f"- {p}: [OK / MP3] (Size: {size} bytes) - Comienza con: {header[:15]}")
    else:
        print(f"- {p}: [NO EXISTE]")
