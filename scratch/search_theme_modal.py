import sys
sys.stdout.reconfigure(encoding='utf-8')

with open("engine.js", "r", encoding="utf-8") as f:
    for i, line in enumerate(f, 1):
        if "theme-modal" in line.lower():
            print(f"L{i}: {line.strip()}")
