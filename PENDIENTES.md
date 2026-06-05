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

### 3. Integración Realizada: Super Mario Retro (`mario`)
*   **Estado**: Totalmente integrado en el código del motor de juego (`engine.js`, `style.css` y la extensión de Chrome `flow-image-generator`).
*   **Pendiente**: Generación mediante la extensión y colocación de sus assets reales en el directorio `themes/mario/`:
    *   `top.webp` (Fondo P1: Mundo 1-1, Mario saltando a la izquierda) -> Relación de aspecto vertical 9:16.
    *   `bottom.webp` (Fondo P2: Castillo de lava, Bowser gigante a la izquierda) -> Relación de aspecto vertical 9:16.
    *   `preview.webp` (Lobby: Castillo de Peach con bloque `?` flotando, sin texto) -> Relación de aspecto vertical 9:16.
    *   `loading.webp` (Pantalla de Carga: Mario y Bowser jugando a MTG de forma cómica) -> Relación de aspecto vertical 9:16.
    *   `sfx` (Efectos y voces): `dmg.mp3` (encogimiento de Mario / quejido retro), `heal.mp3` (sonido de moneda / champiñón 1UP) y `victory.mp3` (asta de bandera de fin de fase).
    *   `sprites_ui` (en `themes/mario/ui/`): Champiñón rojo (`super_mushroom.webp`), champiñón venenoso morado (`poison_mushroom.webp`), flor de fuego (`fire_flower.webp`) y estrella de poder (`super_star.webp`).
    *   *Nota*: El motor reproducirá diálogos de juego asimétricos con el toque gracioso y épico leve de Mario ("¡Mamma mia! 🍄", "¡Ouch! ¡He encogido!") y Bowser ("¡GRAAAWR! ¡Ese golpe quemó mi caparazón!", "¡Tu princesa está en otro castillo! 🏰") que ya están configurados en el motor.
