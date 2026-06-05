---
name: mtg-theme-master
description: "Expert in generating, developing, and integrating high-end themes (styles, sounds, dialogs, AI prompts) for the MTG Life Counter application."
---

# 🎨 MTG Theme Master: Manual de Creación e Integración de Temas

Esta es la especificación técnica definitiva y la guía de desarrollo (Skill) para integrar un tema interactivo y visualmente espectacular en la aplicación de contador de vidas de MTG. Define la arquitectura del tema, el flujo de carga, los estándares de diseño de la IA y el mapeo en los archivos de la PWA y de la extensión.

---

## 📁 1. Estructura de Archivos del Tema (`themes/<theme_id>/`)

Cada tema cuenta con su propio directorio modularizado con los siguientes archivos:
*   `top.webp`: Fondo para la mitad del Jugador 1 (Oponente / Cabecera), normalmente rotado 180° por CSS.
*   `bottom.webp`: Fondo para la mitad del Jugador 2 (Local / Pie), en orientación normal.
*   `preview.webp` (9:16 vertical): Imagen de portada para el carrusel de selección y modal de temas. Si no existiera, se cae en `top.webp` como fallback.
*   `loading.webp` (9:16 vertical): Imagen del crossover jugando a Magic. Si no existiera, se cae en `top.webp` como fallback.
*   `dmg.mp3` / `p1_dmg.mp3` y `p2_dmg.mp3` (Opcional): Sonidos asimétricos al recibir daño (duración < 4s con fade-out).
*   `heal.mp3` / `p1_heal.mp3` y `p2_heal.mp3` (Opcional): Sonidos asimétricos al ganar vida / continue (duración < 4s con fade-out).
*   `victory.mp3`: Marcha triunfal al iniciar o ganar la partida (duración < 4s con fade-out).
*   `prompts.json`: Fichero que registra los prompts detallados de Midjourney/Flow para generar los fondos, loader y sprites de interfaz (`ui/`).

---

## ⚙️ 2. Guía de prompts para la Inteligencia Artificial (DALL-E / Flow)

Para que las imágenes generadas por IA encajen a la perfección con la interfaz táctil móvil de la aplicación, debes cumplir estas directivas de composición y proporciones:

### A. Fondos de Combate (`top.webp` y `bottom.webp`)
*   **Aspect Ratio (Crucial):** Generar en formato **cuadrado 1:1** (`--ar 1:1`). Como la pantalla móvil se divide horizontalmente a la mitad, cada jugador tiene un panel casi cuadrado (cerca de `9:8`). Al usar imágenes cuadradas, evitamos que el navegador haga un zoom excesivo lateral con `background-size: cover`, previniendo que los personajes se corten.
*   **Composición Lateral Despejada:** Los personajes principales u objetos icónicos del tema deben situarse en los **bordes laterales izquierdo y derecho**.
*   **Centro Vacío y Oscuro:** La franja central del panel (donde se renderizan los números gigantes de vida y la botonera) debe ser un fondo plano, liso, opaco y extremadamente oscuro (gris carbón, negro o azul medianoche) con transiciones suaves para garantizar un alto contraste de los neones de la interfaz.

### B. Imagen del Cargador (`loading.webp`)
*   **Aspect Ratio:** Estricto **9:16** (Vertical). Dado que la pantalla de carga ocupa todo el alto de la pantalla del móvil, la imagen debe ser vertical.
*   **Composición Centrada:** Los dos personajes principales jugando a Magic deben estar sentados y agrupados en una composición vertical compacta en el centro del encuadre para evitar recortes en teléfonos de pantalla ultra alargada (como `9:19.5`).

### C. Previsualización del Lobby (`preview.webp`)
*   **Aspect Ratio:** Estricto **9:16** (Vertical).
*   **Narrativa:** Un plano general o vista aérea impresionante del mundo temático (ej. Springfield, Seireitei, Hill Valley). Debe incluir algún Easter Egg sutil o elemento humorístico pero **sin personajes en primer plano** y **sin texto**.

---

## 💻 3. Integración en el Motor JavaScript (`engine.js`)

Para registrar el tema de forma dinámica e interactiva en la aplicación, debes actualizar tres áreas en [`engine.js`](file:///c:/TRABAJOS%20IA/MAGIC%20THE%20GATHERING/contador/engine.js):

### A. Registro de Metadatos (`THEME_METADATA`)
Añade un objeto descriptivo con el ID único que actuará como el atributo `data-theme`:
```javascript
const THEME_METADATA = [
  ...
  { 
    id: 'mario', 
    name: 'Super Mario Retro', 
    icon: '🍄', 
    desc: 'Mundo 1-1 y Castillo de Bowser', 
    badge: 'RETRO', 
    bg: './themes/mario/top.webp' // Fallback a top.webp si no tiene preview.webp dedicada
  }
];
```

### B. Banco de Diálogos y Sonidos Asimétricos (`THEMES`)
Define el banco de frases graciosas y audios personalizados. Puedes mapear diálogos individuales para el Jugador 1 (Héroe) y el Jugador 2 (Rival):
```javascript
mario: {
  name: 'Super Mario Retro',
  p1Dmg: ["¡Mamma mia! 🍄", "¡Ouch!"],
  p1Heal: ["¡Super Mushroom! 🍄", "¡1-UP!"],
  p2Dmg: ["¡GRAAAWR! [Rugido]", "¡Maldito fontanero!"],
  p2Heal: ["¡Tu princesa está en otro castillo!", "¡Bowser Cóptero!"]
}
```

### C. Frases en la Pantalla de Carga
Registra en el objeto `phrases` dentro de la función de inicio las 4 frases correspondientes a la progresión del loader (0-25%, 25-55%, 55-85%, 85-100%):
```javascript
const phrases = {
  ...
  mario: ["VIAJANDO AL REINO CHAMPIÑÓN...", "RECOLECTANDO MONEDAS...", "BUSCANDO A LA PRINCESA PEACH...", "¡HERE WE GO!"],
  default: [...]
};
```

---

## 🎨 4. Estilos en la Hoja de Estilo (`style.css`)

El cuerpo del documento adquiere el atributo `body[data-theme="mi_tema"]`. Usa selectores modulares para inyectar los fondos e iluminaciones:

```css
/* Inyección de Fondos de Combate */
body[data-theme="mario"] #p1::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url('./themes/mario/top.webp') !important;
  background-position: center center !important;
  background-size: cover !important;
  transform: rotate(180deg); /* Invierte la perspectiva del oponente */
  z-index: -2;
  pointer-events: none;
}
body[data-theme="mario"] #p2 {
  background-image: url('./themes/mario/bottom.webp') !important;
  background-position: center center !important;
  background-size: cover !important;
}

/* Customización Premium de Botones mediante Variables */
body[data-theme="mario"] {
  --p1-btn-bg: linear-gradient(145deg, #2a0000, #150000);
  --p1-btn-border-plus: rgba(255, 0, 0, 0.4);
  --p1-btn-text-plus: #ff4d4d;
  
  --p2-btn-bg: linear-gradient(145deg, #002200, #001100);
  --p2-btn-border-plus: rgba(0, 255, 0, 0.4);
  --p2-btn-text-plus: #4dff4d;
}
```

---

## 🔌 5. Registro de Plantillas en la Extensión de Chrome (`flow-image-generator`)

Para facilitar la generación automática de los assets por IA mediante la extensión, añade la plantilla del tema en el array `TEMPLATES` dentro de [`App.tsx`](file:///c:/TRABAJOS%20IA/MAGIC%20THE%20GATHERING/flow-image-generator/entrypoints/popup/App.tsx):

```typescript
const TEMPLATES: Template[] = [
  ...
  {
    id: 'mario',
    name: 'Super Mario Retro',
    emoji: '🍄',
    batchName: 'mario',
    prompts: [
      { label: 'preview', prompt: "A breathtaking vertical establishing shot of Peach's Castle... --ar 9:16" },
      { label: 'loader', prompt: "Humorous flat 2D scene of Mario and Bowser playing Magic... --ar 9:16" },
      { label: 'top', prompt: "High-quality 2D World 1-1 style illustration, Mario saltando a la izquierda... --ar 9:16" },
      { label: 'bottom', prompt: "High-quality 2D Bowser Castle style, Bowser gigante a la izquierda... --ar 9:16" }
    ]
  }
];
```

Y si cuenta con elementos UI customizados (como champiñones, flores, estrellas o caparazones), regístralos en el array `UI_SPRITE_TEMPLATES` de la pestaña **Sprites UI**.
