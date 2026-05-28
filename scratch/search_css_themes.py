import sys
sys.stdout.reconfigure(encoding='utf-8')

with open("style.css", "r", encoding="utf-8") as f:
    for i, line in enumerate(f, 1):
        if "body[data-theme=" in line:
            print(f"L{i}: {line.strip()}")
