# Integración de Efectos Visuales Premium (Todos los Temas)

Este plan detalla cómo integraremos los efectos visuales, auras y dinámicas premium en todos los temas de la aplicación, sin comprometer el rendimiento, utilizando inyecciones DOM ligeras y CSS3.

> [!NOTE]
> Dado que la app debe mantenerse rápida (offline PWA), priorizaremos animaciones CSS en lugar de canvas WebGL pesado para estos micro-efectos. Usaremos la misma estructura que ya probamos con éxito en el efecto de la katana de *Bleach* (`triggerSwordSlash`).

## Open Questions

> [!IMPORTANT]
> **Preguntas para el usuario antes de empezar:**
> 1. Para los efectos de **Audio** (ej: sonido de moneda de Mario, alarma de Simpsons), ¿tienes los archivos de audio listos o quieres que generemos sonidos sintetizados con la Web Audio API (como hicimos con los *beeps* retro)?
> 2. Hay muchos temas. ¿Te parece bien si hacemos todo el CSS y JS en una sola fase de implementación masiva, o prefieres que lo dividamos en dos fases para que puedas probar la primera tanda más rápido?

## Proposed Changes

A continuación, el detalle de lo que se añadirá por tema:

---

### 1. Los Simpsons (Central Nuclear)
- **CSS (`style.css`):** Creación de `@keyframes nuclearAlarm` (sombras rojas y amarillas intermitentes). Se activará cuando un jugador entre en estado `danger` (vida <= 5).
- **JS (`engine.js`):** Modificar la interfaz de victorias para que, al detectar el tema `simpsons`, diga "Días sin accidentes: X" en lugar de rondas ganadas.

### 2. Rick & Morty (Ciencia Loca)
- **CSS (`style.css`):** Efecto `.acid-melt` para el estado `danger`. Animación `@keyframes portalTransition` para cubrir la pantalla de verde flúor al cargar.
- **JS (`engine.js`):** Inyección de un div temporal `.meeseeks-pop` al sumar vidas de forma múltiple.

### 3. Regreso al Futuro (BTTF)
- **CSS (`style.css`):** Efecto `.bttf-fade` para parpadear la opacidad (borrado de la existencia) en estado `danger`.
- **CSS (`style.css`):** Animación de marcas de fuego cruzando el panel (`.fire-trails`) al entrar en estado `dead`.

### 4. Dragon Ball (Ki y Super Saiyan)
- **CSS (`style.css`):** Añadir un resplandor interior `.ssj-aura` dorado y pulsante si el jugador supera las 20 vidas (por curación). Si la vida baja a `danger`, cambia a rojo.
- **CSS (`style.css`):** Efecto `.crater-bg` que simula grietas sobre el fondo cuando la vida llega a 0.

### 5. Super Mario (Arcade)
- **CSS (`style.css`):** Animación de la moneda de 8-bits saltando (`.mario-coin-anim`) y el botón rebotando (`.block-bounce`).
- **JS (`engine.js`):** Instanciar temporalmente un `<div class="mario-coin"></div>` al clicar el botón `+`.

### Prompts para Vídeos Omni (Para tu Experto en IA)

Necesitamos vídeos de unos 4 segundos de duración. **Pídele al experto que se enfoque en transmitir una sensación clara de "DERROTA", "DESTRUCCIÓN" o "GAME OVER"**, dejando espacio visual en el centro para nuestro texto.

Aquí tienes los **Prompts Extendidos, de nivel experto y alta dirección de arte:**

### 1. Dragon Ball (`themes/dragonball/ko.mp4`)
> **Prompt:** *A hyper-realistic cinematic 3D anime sequence showing utter defeat. In the extreme foreground, a shattered, glowing Saiyan scouter lies on cracked, scorched earth. In the background, a massive, planet-destroying purple energy sphere (like Frieza's Death Ball) slowly descends, engulfing the landscape. The screen shakes violently, rocks float upwards due to anti-gravity energy, and the blinding light of the explosion washes out the center of the frame in pure white and intense yellow heat. 4K resolution, spectacular VFX, dramatic lighting, epic anime finisher.*

### 2. Street Fighter (`themes/streetfighter/ko.mp4`)
> **Prompt:** *A highly stylized, modern 3D rendition of a cinematic 'Game Over' sequence. In the foreground, a bloodied red martial arts headband falls slowly to the wet concrete floor in slow motion under heavy, dramatic pouring rain. Flickering neon street signs illuminate the dark alleyway. Suddenly, a massive glowing blood-red kanji character flashes violently onto the screen, accompanied by aggressive dark purple electric sparks, simulating a fatal blow that shatters the camera lens. Dark, moody, high-tension atmosphere.*

### 3. Demon Slayer (`themes/demonslayer/ko.mp4`)
> **Prompt:** *A breathtaking, high-budget 3D anime cinematic render representing a devastating loss. The camera angle is from the ground looking up. A broken Nichirin katana blade is stuck deep in the snow, its metal reflecting a giant, ominous blood-red moon. Suddenly, a relentless flurry of high-contrast fiery slashes (sun breathing style) rips across the entire screen from multiple angles, followed immediately by a rush of dark demonic ink-like tentacles that engulf the camera. High contrast, dynamic flying embers, dramatic depth of field.*

### 4. Naruto (`themes/naruto/ko.mp4`)
> **Prompt:** *A terrifying, immersive cinematic loop of a psychological Genjutsu nightmare. The camera rapidly pulls back from a spinning red Mangekyou Sharingan eye, instantly transitioning the world into a nightmarish landscape where the sky is blood-red and the moon is pitch black. Suddenly, an explosion of hundreds of black crows rushes aggressively directly at the camera, filling the screen with dark feathers. A massive ethereal purple sword (Susanoo) crashes down, leaving the screen in deep shadows. Ominous, psychological horror anime aesthetic, 8K render.*

### 6. One Piece (Wanted y Haki)
- **CSS (`style.css`):** Rediseño sutil de la fuente del jugador a estilo "Wanted".
- **CSS (`style.css`):** Creación de `.haki-pulse` (animación de halo negro/rojo profundo) que oscurece el panel del rival cuando ganas el juego.

### 7. Naruto (Chakra y Kunai)
- **CSS (`style.css`):** Añadir aura de burbujas rojas (`.kyuubi-aura`) para `danger`.
- **JS (`engine.js`):** Inyectar animación `.kunai-slash` similar a la de la espada de Bleach al recibir más de 3 puntos de daño simultáneos.

### 8. Bleach (Bankai)
- **CSS (`style.css`):** Ya cuenta con `triggerSwordSlash`. Añadiremos inversión de colores (blanco a negro/rojo) para simular la presión espiritual intensa cuando ambos jugadores estén en `danger`.

### 9. Default / Nebula (Holográfico)
- **CSS (`style.css`):** Capa interactiva de mezcla (mix-blend-mode) con gradientes tipo arcoíris que responde levemente a animaciones lentas para simular el brillo "Foil" de una carta real.

## Verification Plan

### Manual Verification
1. Seleccionar cada tema desde el lobby.
2. Sumar y restar vidas para ver en acción los efectos de curación (monedas, auras) y daño (kunais, parpadeos).
3. Bajar la vida a <= 5 para desencadenar el estado `danger` en cada tema y comprobar que la alarma (Simpsons), opacidad (BTTF) o chakra (Naruto) se muestran bien y no rompen la UI.
4. Llevar la vida a 0 para verificar animaciones K.O. (Cráteres, fuego, Haki).
