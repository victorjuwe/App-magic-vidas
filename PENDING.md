# 📋 Pendientes de Desarrollo - Roadmap Futuro

Este documento detalla el estado actual del proyecto, las mejoras implementadas y las tareas técnicas recomendadas para continuar evolucionando el contador de vidas MTG Premium.

---

## ✅ Logros Alcanzados Hoy
1. **Compatibilidad con iPhone**: La pantalla de carga ahora es 100% responsiva (se adapta perfectamente en vertical y horizontal en cualquier modelo de iPhone).
2. **Corrección de Errores de Interfaz**: Se solventaron las congelaciones táctiles eliminando el bloqueador de `touchmove` y se corrigió el `TypeError` de Mulligans al reiniciar partidas.
3. **Subida Segura a GitHub**: El proyecto está configurado en GitHub en la rama `main` y purgado de archivos pesados históricos.
4. **Despliegue GitHub Pages**: Configurado con el archivo de redirección `index.html` y el bypass `.nojekyll` para un funcionamiento estable y despliegue automático.
5. **Automatización de Actualizaciones**: Añadido el script `subir.bat` para subir cualquier cambio a GitHub con un solo clic.
6. **Contenido de Temas Optimizado**:
   - Nuevos fondos personalizados generados por IA y recortados/optimizados a formato WebP ligero (reduciendo el peso de las imágenes un 97%).
   - Añadidos sonidos en formato MP3 para el tema de Bleach, Street Fighter y Rick y Morty (con eructos graciosos y efectos láser libres de derechos).

---

## 🛠️ Tareas Pendientes para el Futuro

### 1. Consolidación de Servidor Local Único (`server.py`)
*   **Estado actual**: Para desarrollo con soporte de vídeos en iOS se usa el servidor de Node (`scratch/server.js`) ya que implementa Range Requests (HTTP 206), mientras que `server.py` se usa para la orquestación con la IA de ComfyUI pero no tiene soporte de vídeos en iPhones por limitaciones del HTTP handler nativo de Python.
*   **Roadmap**: Agregar soporte nativo de Range Requests en el handler `do_GET` de `server.py` utilizando Python para unificar todo en un solo comando de arranque.

### 2. Derrota Automática por Veneno (10 contadores)
*   **Estado actual**: Alcanzar 10 contadores de veneno se registra en los historiales y resalta en rojo, pero no termina la partida.
*   **Roadmap**: Modificar `changePoison()` en `engine.js` para que evalúe si un jugador llegó a 10 de veneno y lance automáticamente la fase de Sideboard o la Victoria del Match, respetando las reglas oficiales de Magic: The Gathering.

### 3. Decisión Final sobre el Contador de Mulligans
*   **Estado actual**: La lógica de Mulligans en JavaScript funciona y está protegida contra errores, pero no hay botones ni textos en `contador.html` para controlarlos.
*   **Roadmap**:
    - *Opción A*: Añadir dos botones sutiles en la interfaz del juego (ej: un icono `🃏` o caja numérica) para poder restar/sumar mulligans manualmente en cada partida.
    - *Opción B*: Limpiar por completo el código de Mulligans en `engine.js` si es una función que no se desea usar.

### 4. Configurar la Gemini API Key desde la Interfaz del Lobby
*   **Estado actual**: La variable `geminiApiKey` está vacía en `engine.js` por seguridad.
*   **Roadmap**: Crear un pequeño botón de engranaje o sección en el lobby que abra un modal e introduzca la API Key guardándola en el `localStorage` del navegador. Esto te permitirá usar la IA de Gemini sin tener que editar el archivo de código ni arriesgarte a subir tu clave privada a un repositorio público de GitHub.

### 5. Modularización de Configuración de ComfyUI
*   **Estado actual**: Las rutas de inicio de ComfyUI están escritas de forma fija (hardcoded) en `server.py` con las rutas de tu ordenador local.
*   **Roadmap**: Mover las rutas absolutas a un archivo `config.json` (añadido al `.gitignore` para no compartirse) para que el servidor de Python sea modular si se ejecuta en otros ordenadores.
