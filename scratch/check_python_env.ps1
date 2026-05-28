$pythonPath = "C:\Users\Víctor Sanguino\AppData\Roaming\uv\python\cpython-3.14-windows-x86_64-none\python.exe"
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
try:
    import websocket
    print('websocket: OK')
except ImportError:
    print('websocket: Missing')
"
