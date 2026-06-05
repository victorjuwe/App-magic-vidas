# 🛠️ Herramientas de desarrollo

Scripts auxiliares para mantener la app. **No se usan en producción**, solo para tareas de desarrollo y mantenimiento de assets.

| Script | Para qué sirve |
|---|---|
| `servidor_node_dev.js` | Servidor Node alternativo a `server.py` (Range Requests para iOS). Deprecado desde que `server.py` soporta HTTP 206. |
| `package.json` | Dependencias del servidor Node anterior. Solo necesario si usas `servidor_node_dev.js`. |
| `convertir_imagenes.py` | Convierte imágenes `.jfif/.jpeg/.png` a `.webp` optimizado. Útil tras generar nuevos assets con IA. |
| `optimizar_assets.py` | Reduce el peso de imágenes y audios del proyecto (`themes/`). |
| `verificar_mp3s.py` | Comprueba que los archivos `.mp3` de los temas son válidos y reproducibles. |
| `partir_imagenes.py` | Divide una imagen vertical en dos mitades (útil cuando IA devuelve top+bottom juntos). |
| `recortar_imagen.ps1` | Recorta una imagen al aspect ratio deseado (PowerShell, Windows). |

## Cómo ejecutar

```bash
# Scripts Python
python herramientas/convertir_imagenes.py

# Servidor Node (si lo usas en vez de server.py)
cd herramientas && npm install && node servidor_node_dev.js

# PowerShell
powershell -File herramientas/recortar_imagen.ps1
```
