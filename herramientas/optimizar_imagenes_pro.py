import os
import re
from PIL import Image

def optimize_image(file_path, output_path=None, quality=75, max_size=None):
    """
    Optimizes an image by converting it to true WebP format.
    If output_path is not specified, it overwrites the original file (useful for in-place webp fixes).
    """
    if output_path is None:
        output_path = file_path
        
    try:
        orig_size = os.path.getsize(file_path)
        with Image.open(file_path) as im:
            # If we need to resize extremely large images, we can do it here.
            # But let's stick to compression first unless they are ridiculously large.
            # Convert RGBA to RGB if saving to WebP without transparency, or keep RGBA if it has alpha channel.
            # WebP supports RGBA, so we can preserve transparency.
            mode = im.mode
            fmt = im.format
            
            # Temporary file to avoid corruption during self-overwrite
            temp_path = output_path + ".temp"
            im.save(temp_path, 'WEBP', quality=quality)
            
        # Verify the temp file exists and has size > 0
        if os.path.exists(temp_path) and os.path.getsize(temp_path) > 0:
            new_size = os.path.getsize(temp_path)
            
            # If we are overwriting or converting, and the new file is indeed valid, swap it
            if os.path.exists(output_path) and output_path != file_path:
                os.remove(output_path)
            if output_path == file_path:
                os.remove(file_path) # Delete original to replace it
                
            os.rename(temp_path, output_path)
            
            # If we converted a non-webp file, delete the original
            if file_path != output_path and os.path.exists(file_path):
                os.remove(file_path)
                
            savings = (orig_size - new_size) / 1024
            pct = (orig_size - new_size) / orig_size * 100
            print(f"Optimized: {os.path.basename(file_path)} ({fmt}/{mode}) -> {os.path.basename(output_path)} | "
                  f"Size: {orig_size/1024:.1f}KB -> {new_size/1024:.1f}KB | Saved: {savings:.1f}KB ({pct:.1f}%)")
            return True, orig_size, new_size
    except Exception as e:
        print(f"Error optimizing {file_path}: {e}")
        if 'temp_path' in locals() and os.path.exists(temp_path):
            os.remove(temp_path)
    return False, 0, 0

def run_optimization():
    themes_dir = 'themes'
    assets_dir = 'assets'
    
    total_orig = 0
    total_new = 0
    conversions = {} # original_rel_path -> new_rel_path
    
    # 1. Special case: BTTF load.jpg -> loading.webp
    bttf_load = os.path.join(themes_dir, 'bttf', 'load.jpg')
    bttf_loading = os.path.join(themes_dir, 'bttf', 'loading.webp')
    if os.path.exists(bttf_load):
        success, o, n = optimize_image(bttf_load, bttf_loading, quality=75)
        if success:
            total_orig += o
            total_new += n
            conversions['themes/bttf/load.jpg'] = 'themes/bttf/loading.webp'
            conversions['themes/bttf/load.jpeg'] = 'themes/bttf/loading.webp'
            
    # 2. Iterate themes and assets
    for directory in [themes_dir, assets_dir]:
        if not os.path.exists(directory):
            continue
        for root, dirs, files in os.walk(directory):
            for file in files:
                file_path = os.path.join(root, file)
                ext = os.path.splitext(file)[1].lower()
                rel_path = os.path.relpath(file_path).replace('\\', '/')
                
                # Skip media files like mp3 or mp4
                if ext in ['.mp3', '.mp4', '.json', '.bat', '.py', '.temp']:
                    continue
                    
                # A. Handle PNG, JPG, JPEG, JFIF conversions
                if ext in ['.png', '.jpg', '.jpeg', '.jfif']:
                    # Special skip for service worker icons
                    if "icon-" in file:
                        continue
                        
                    output_file = os.path.splitext(file_path)[0] + '.webp'
                    output_rel = os.path.relpath(output_file).replace('\\', '/')
                    
                    success, o, n = optimize_image(file_path, output_file, quality=75)
                    if success:
                        total_orig += o
                        total_new += n
                        conversions[rel_path] = output_rel
                        
                # B. Handle WEBP optimization (false-WEBP or oversized webp)
                elif ext == '.webp':
                    try:
                        file_size = os.path.getsize(file_path)
                        needs_opt = False
                        fmt = ""
                        with Image.open(file_path) as img:
                            fmt = img.format
                            
                        # If it's a JPEG/PNG named as .webp, or it's a true webp but > 200 KB
                        if fmt != 'WEBP' or file_size > 200 * 1024:
                            needs_opt = True
                            
                        if needs_opt:
                            success, o, n = optimize_image(file_path, quality=75)
                            if success:
                                total_orig += o
                                total_new += n
                        else:
                            # Keep track of already optimal files
                            total_orig += file_size
                            total_new += file_size
                    except Exception as e:
                        print(f"Error checking webp {file_path}: {e}")
                        
    # 3. Update references in code
    print("\n--- Updating Code References ---")
    files_to_update = ['style.css', 'contador.html', 'service-worker.js', 'engine.js']
    
    # We will build replacement maps for specific assets
    # E.g., assets/lobby_bg.png -> assets/lobby_bg.webp
    # themes/simpsons/donut.png -> themes/simpsons/donut.webp
    # themes/dragonball/1star.png -> themes/dragonball/1star.webp
    # themes/dragonball/5star.png -> themes/dragonball/5star.webp
    
    for file_name in files_to_update:
        if not os.path.exists(file_name):
            continue
            
        with open(file_name, 'r', encoding='utf-8') as f:
            content = f.read()
            
        original_content = content
        
        # Apply specific conversions
        for orig, new in conversions.items():
            # Match variants: './themes/...' or 'themes/...' or '/themes/...'
            # We can replace both with and without leading dot/slash
            orig_variants = [
                orig,
                orig.replace('themes/', './themes/').replace('assets/', './assets/'),
                '/' + orig
            ]
            for var in orig_variants:
                content = content.replace(var, new if './' not in var else './' + new)
                
        # Also let's do a general regex replacement for any leftover .png/.jpg/.jpeg inside themes/ or assets/
        # to ensure that we didn't miss anything.
        def replace_general(match):
            path = match.group(0)
            for ext, rep in [('.png', '.webp'), (('.jpg', '.webp')), (('.jpeg', '.webp')), (('.jfif', '.webp'))]:
                path = path.replace(ext, rep)
            return path
            
        pattern = r'(\.?\/?themes\/[^\'"\)\s]+\.(?:png|jpg|jpeg|jfif))|(\.?\/?assets\/[^\'"\)\s]+\.(?:png|jpg|jpeg|jfif))'
        content = re.sub(pattern, replace_general, content, flags=re.IGNORECASE)
        
        # Special case for service-worker.js version bump
        if file_name == 'service-worker.js':
            # Find magic-bo3-vXX and increment it
            match = re.search(r"const CACHE = 'magic-bo3-v(\d+)'", content)
            if match:
                current_ver = int(match.group(1))
                new_ver = current_ver + 1
                content = content.replace(f"const CACHE = 'magic-bo3-v{current_ver}'", f"const CACHE = 'magic-bo3-v{new_ver}'")
                print(f"Bumped cache version to v{new_ver} in service-worker.js")
                
        if content != original_content:
            with open(file_name, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated references in {file_name}")
            
    # Print summary
    saved_total = (total_orig - total_new) / (1024 * 1024)
    pct_total = (total_orig - total_new) / total_orig * 100 if total_orig > 0 else 0
    print(f"\n--- OPTIMIZATION SUMMARY ---")
    print(f"Original Size: {total_orig / (1024*1024):.2f} MB")
    print(f"Optimized Size: {total_new / (1024*1024):.2f} MB")
    print(f"Total Space Saved: {saved_total:.2f} MB ({pct_total:.1f}% reduction)")

if __name__ == '__main__':
    run_optimization()
