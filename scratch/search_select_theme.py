import sys
sys.stdout.reconfigure(encoding='utf-8')

with open("engine.js", "r", encoding="utf-8") as f:
    lines = f.readlines()
    
for i, line in enumerate(lines, 1):
    if "function selecttheme" in line.lower() or "const selecttheme" in line.lower():
        start = i - 1
        end = start + 50
        for idx in range(start, min(end, len(lines))):
            print(f"L{idx+1}: {lines[idx].strip()}")
        break
