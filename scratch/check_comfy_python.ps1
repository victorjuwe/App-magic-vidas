$pythonPath = "C:\IA\Data\Packages\ComfyUI\venv\Scripts\python.exe"
if (Test-Path $pythonPath) {
    Write-Output "ComfyUI Python exists!"
    & $pythonPath -c "
import sys
print('Python version:', sys.version)
try:
    import PIL
    print('PIL: OK')
except ImportError:
    print('PIL: Missing')
try:
    import requests
    print('requests: OK')
except ImportError:
    print('requests: Missing')
"
} else {
    Write-Output "ComfyUI Python not found at $pythonPath"
}
