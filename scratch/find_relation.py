import os
from PIL import Image

def test():
    base_dir = "c:/TRABAJOS IA/MAGIC THE GATHERING/contador/themes/rickmorty"
    frame_path = os.path.join(base_dir, "frame.png")
    top_path = os.path.join(base_dir, "top.png")
    bottom_path = os.path.join(base_dir, "bottom.png")
    
    frame = Image.open(frame_path).convert('RGB')
    top = Image.open(top_path).convert('RGB')
    bottom = Image.open(bottom_path).convert('RGB')
    
    # Let's resize frame to see if we can find top.png or bottom.png inside it
    # Since top.png is 1024x1024, maybe it's the top half of frame.png resized to 1024x1024, or crop-resized.
    # The top half of frame.png (576x1024) is 576x512.
    # Let's crop the top half of frame.png:
    frame_top = frame.crop((0, 0, frame.width, frame.height // 2)) # 576x512
    # Let's crop the bottom half:
    frame_bottom = frame.crop((0, frame.height // 2, frame.width, frame.height)) # 576x512
    
    print(f"frame_top: {frame_top.width}x{frame_top.height}")
    
    # If they are from the same image, let's see if we resize frame_top to 1024x1024 (ignoring aspect ratio or padding)
    frame_top_resized = frame_top.resize((1024, 1024))
    # Compare average color diff
    diffs = 0
    for x in range(0, 1024, 50):
        for y in range(0, 1024, 50):
            p1 = frame_top_resized.getpixel((x, y))
            p2 = top.getpixel((x, y))
            diffs += sum(abs(a - b) for a, b in zip(p1, p2))
    avg_diff = diffs / ((1024 // 50) ** 2 * 3)
    print("Avg pixel diff for top.png:", avg_diff)

    # Let's see if top.png is just a square crop of the top part (preserving aspect ratio)
    # If we crop a square from the top part of frame.png:
    # frame.width is 576, so a square of 576x576 from top would be (0, 0, 576, 576).
    frame_top_square = frame.crop((0, 0, 576, 576)).resize((1024, 1024))
    diffs_sq = 0
    for x in range(0, 1024, 50):
        for y in range(0, 1024, 50):
            p1 = frame_top_square.getpixel((x, y))
            p2 = top.getpixel((x, y))
            diffs_sq += sum(abs(a - b) for a, b in zip(p1, p2))
    avg_diff_sq = diffs_sq / ((1024 // 50) ** 2 * 3)
    print("Avg pixel diff for top.png (square crop):", avg_diff_sq)

test()
