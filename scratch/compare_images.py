import os
from PIL import Image

def analyze():
    base_dir = "c:/TRABAJOS IA/MAGIC THE GATHERING/contador/themes/rickmorty"
    frame_path = os.path.join(base_dir, "frame.png")
    top_path = os.path.join(base_dir, "top.png")
    bottom_path = os.path.join(base_dir, "bottom.png")
    
    if not os.path.exists(frame_path):
        print("frame.png not found")
        return
        
    frame = Image.open(frame_path)
    print(f"frame.png: {frame.width}x{frame.height}")
    
    if os.path.exists(top_path):
        top = Image.open(top_path)
        print(f"top.png: {top.width}x{top.height}")
    if os.path.exists(bottom_path):
        bottom = Image.open(bottom_path)
        print(f"bottom.png: {bottom.width}x{bottom.height}")

analyze()
