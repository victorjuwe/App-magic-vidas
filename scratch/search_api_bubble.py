import sys
sys.stdout.reconfigure(encoding='utf-8')

for filename in ("contador.html", "engine.js"):
    print(f"=== {filename} ===")
    with open(filename, "r", encoding="utf-8") as f:
        for i, line in enumerate(f, 1):
            if "speech" in line.lower() or "bocadillo" in line.lower() or "bubble" in line.lower() or "api" in line.lower():
                if "class" in line or "id" in line or "const" in line or "let" in line or "function" in line or "display" in line:
                    print(f"L{i}: {line.strip()}")
