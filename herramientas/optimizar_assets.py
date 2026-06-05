import os
import re
from PIL import Image

def convert_to_webp(file_path):
    try:
        im = Image.open(file_path)
        base_path = os.path.splitext(file_path)[0]
        webp_path = base_path + '.webp'
        
        # Save as webp with quality=80
        im.save(webp_path, 'WEBP', quality=80)
        
        # Verify it exists and has size > 0
        if os.path.exists(webp_path) and os.path.getsize(webp_path) > 0:
            orig_size = os.path.getsize(file_path)
            new_size = os.path.getsize(webp_path)
            savings = (orig_size - new_size) / (1024 * 1024)
            pct = (orig_size - new_size) / orig_size * 100
            print(f"Converted: {file_path} -> {webp_path} | Saved: {savings:.2f}MB ({pct:.1f}%)")
            
            # Delete original
            os.remove(file_path)
            return True
    except Exception as e:
        print(f"Error converting {file_path}: {e}")
    return False

def optimize_directory(directory):
    converted_any = False
    for root, dirs, files in os.walk(directory):
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in ['.png', '.jpg', '.jpeg']:
                file_path = os.path.join(root, file)
                # Skip service worker icons or other critical root files just in case
                if "icon-" in file or "preview-" in file:
                    continue
                if convert_to_webp(file_path):
                    converted_any = True
    return converted_any

def update_code_references():
    replacements = [
        (r'\.png\b', '.webp'),
        (r'\.jpg\b', '.webp'),
        (r'\.jpeg\b', '.webp')
    ]
    
    files_to_update = [
        'style.css',
        'contador.html',
        'service-worker.js',
        'engine.js'
    ]
    
    for file_name in files_to_update:
        if not os.path.exists(file_name):
            continue
            
        with open(file_name, 'r', encoding='utf-8') as f:
            content = f.read()
            
        original_content = content
        
        # Replace only paths inside themes or assets
        # E.g. url('./themes/simpsons/top.png') -> url('./themes/simpsons/top.webp')
        # We can do a regex find to be safe, replacing extension inside quotes or paths
        # Let's do a targeted replace for paths containing themes/ or assets/
        def replace_path(match):
            path = match.group(0)
            for ext, rep in [('.png', '.webp'), ('.jpg', '.webp'), ('.jpeg', '.webp')]:
                path = path.replace(ext, rep)
            return path
            
        # Regex to match paths starting with ./themes or themes/ or ./assets or assets/ and ending in image extensions
        pattern = r'(\.?\/?themes\/[^\'"\)\s]+\.(?:png|jpg|jpeg))|(\.?\/?assets\/[^\'"\)\s]+\.(?:png|jpg|jpeg))'
        content = re.sub(pattern, replace_path, content, flags=re.IGNORECASE)
        
        if content != original_content:
            with open(file_name, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated image references in {file_name}")

if __name__ == '__main__':
    print("Starting assets optimization to WebP...")
    
    # 1. Convert themes folder
    print("\n--- Optimizing themes/ ---")
    optimize_directory('themes')
    
    # 2. Convert assets folder
    print("\n--- Optimizing assets/ ---")
    optimize_directory('assets')
    
    # 3. Update references in code
    print("\n--- Updating Code References ---")
    update_code_references()
    
    print("\nOptimization completed successfully!")
