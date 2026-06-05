import os
from PIL import Image

themes_dir = r"c:\TRABAJOS IA\MAGIC THE GATHERING\contador\themes"

mapping = {
    "streetfighter": {
        "bottom_4_3_v1.jfif": "bottom_4_3.webp",
        "top_4_3_v2.jfif": "top_4_3.webp"
    },
    "onepiece": {
        "bottom_4_3_v3.jfif": "bottom.webp",
        "top_4_3_v3.jfif": "top.webp"
    },
    "naruto": {
        "bottom_4_3_v5.jfif": "bottom.webp",
        "top_4_3_v1 (1).jfif": "top.webp"
    },
    "dragonball": {
        "top_4_3_v5.jfif": "top.webp",
        "High-quality,_official_90s_hand-drawn_cel-shaded_202606031320.jpeg": "bottom.webp"
    }
}

for theme, files in mapping.items():
    theme_path = os.path.join(themes_dir, theme)
    print(f"Processing theme: {theme}...")
    for src_name, dest_name in files.items():
        src_path = os.path.join(theme_path, src_name)
        dest_path = os.path.join(theme_path, dest_name)
        
        if os.path.exists(src_path):
            try:
                with Image.open(src_path) as img:
                    # Convert to RGB if it has transparency/alpha or index mode
                    if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
                        # Some formats need conversion
                        img = img.convert('RGB')
                    img.save(dest_path, 'WEBP', quality=85)
                    print(f"  Converted {src_name} -> {dest_name}")
                # Optional: remove original file to keep workspace clean
                os.remove(src_path)
                print(f"  Removed source {src_name}")
            except Exception as e:
                print(f"  Error converting {src_name}: {e}")
        else:
            print(f"  Source file not found: {src_path}")

print("Image conversion completed!")
