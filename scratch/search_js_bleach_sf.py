import sys
sys.stdout.reconfigure(encoding='utf-8')

with open("engine.js", "r", encoding="utf-8") as f:
    for i, line in enumerate(f, 1):
        if "streetfighter" in line.lower() or "bleach" in line.lower():
            if "if" in line or "else" in line or "function" in line or "audio" in line or "sound" in line or "play" in line:
                print(f"L{i}: {line.strip()}")
