import sys
sys.stdout.reconfigure(encoding='utf-8')

with open("style.css", "r", encoding="utf-8") as f:
    for i, line in enumerate(f, 1):
        if "lobby-screen" in line.lower() or "lobby-container" in line.lower() or "theme-slider" in line.lower():
            print(f"L{i}: {line.strip()}")
