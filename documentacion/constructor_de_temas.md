# Habilidad: Diseñador e Integrador de Temas Épicos (Theme Builder Blueprint)

Esta es la guía técnica y metodológica definitiva para integrar un tema completo en la aplicación de contador de vidas de MTG. Define la arquitectura del tema, el flujo de carga, y los estándares de diseño para adaptar fondos, botoneras, videos de carga y efectos de sonido en futuros temas (como Los Simpsons, Rick & Morty, Regreso al Futuro, Bleach, etc.).

---

## 📁 1. Estructura de Directorios y Assets

Cada tema debe tener su propio directorio bajo `themes/<theme_id>/` con la siguiente estructura de archivos:

```text
themes/
└── <theme_id>/
    ├── top.jpg         # Fondo superior (Jugador 1 - Cabecera) en formato 4:3.
    ├── bottom.jpg      # Fondo inferior (Jugador 2 - Pie) en formato 4:3.
    ├── loading.mp4     # Video de carga de 4 segundos en formato 9:16 (Crossover MTG).
    ├── dmg.mp3         # Efecto de sonido al recibir daño.
    ├── heal.mp3        # Efecto de sonido al ganar vida / curarse.
    └── victory.mp3     # Efecto de sonido al iniciar/ganar la partida.
```

---

## 🎨 2. Estrategia de Composición Lateral y Fondos (top.jpg / bottom.jpg)

Para evitar la oclusión de los contadores y las botoneras por el arte del fondo, implementamos la **Regla de Composición Espacial Lateral**:
1.  **Diseño Símétrico en Eje Y (en espejo):** El fondo superior (`top.jpg`) está rotado 180° (o su composición está diseñada para que el Jugador 1, sentado enfrente, la lea correctamente).
2.  **Distribución de Elementos en Extremos:** Todos los objetos representativos de los temas (personajes, objetos icónicos, portales, etc.) deben colocarse estrictamente en el **extremo izquierdo y derecho** del lienzo (formato 4:3).
3.  **Área Central Limpia y Oscura:** El centro exacto (donde se sitúan los números gigantes de vida y la botonera de control) debe ser un fondo de color liso y oscuro (gris carbón, negro o azul medianoche texturizado) con difuminados suaves para asegurar la legibilidad del texto en neón.

---

## 🕹️ 3. Adaptación de Botoneras en CSS (`style.css`)

El selector de temas aplica un atributo `data-theme="<theme_id>"` en el elemento `body`. Esto permite modificar los estilos de forma modular:

```css
/* Configuración de Fondos de Jugador */
body[data-theme="mi_tema"] #p1 {
  background-image: url('./themes/mi_tema/top.jpg') !important;
}
body[data-theme="mi_tema"] #p2 {
  background-image: url('./themes/mi_tema/bottom.jpg') !important;
}

/* Rediseño de Botonera (.lifebtn) */
body[data-theme="mi_tema"] .lifebtn {
  /* Estilo base personalizado (ej: botones de recreativa cóncavos, botones táctiles sci-fi) */
  border-radius: 50%;
  border: 3px solid var(--border-color);
  box-shadow: 0 4px 0 var(--shadow-color);
  transition: transform 75ms ease, box-shadow 75ms ease;
}

/* Efecto Mecánico de Pulsación (:active) */
body[data-theme="mi_tema"] .lifebtn:active {
  transform: translateY(4px); /* Desplazamiento hacia abajo */
  box-shadow: 0 0 0 0 transparent; /* Desaparece la sombra 3D */
}
```

---

## 🎬 4. Video de Carga de 4 Segundos (`loading.mp4`)

La pantalla de carga previa a la batalla simula una carga de 4 segundos:
1.  **Video Loop Crossover:** El video debe representar un bucle en 9:16 que combine el universo del tema con elementos de Magic: The Gathering (ejemplo: cartas de Magic flotando dentro del portal de Rick & Morty o sobre el salpicadero de Street Fighter).
2.  **Textos de Carga Personalizados (`engine.js`):** En la función de inicio de partida, se define una lista de 4 frases correspondientes a las fases de carga del tema (0-25%, 25-55%, 55-85%, 85-100%).
3.  **Colores del Loader:** Personalizar en CSS la barra de progreso y el logotipo de "VS" para cada tema para que combine con su paleta de colores.

---

## 💬 5. Banco de Diálogos y Frases (`engine.js`)

Para admitir el funcionamiento offline (cuando no hay clave de Gemini API configurada), cada tema en `THEMES` debe registrar su propio banco de frases típicas en español, divididas por jugador. El Jugador 1 (P1) y el Jugador 2 (P2) representan personajes complementarios, rivales o facciones según la franquicia (ejemplo: Héroes vs Villanos en Street Fighter, Marty McFly vs Doc Brown en Regreso al Futuro, o Rick vs Morty en Rick y Morty):

```javascript
const THEMES = {
  mi_tema: {
    name: 'Nombre del Tema',
    // P1 (Personaje 1 / Héroe / Protagonista)
    p1Dmg: ["¡Frase de daño del personaje 1!", "¡Frase de daño del personaje 1!"],
    p1Heal: ["¡Frase de cura del personaje 1!", "¡Frase de cura del personaje 1!"],
    // P2 (Personaje 2 / Villano / Antagonista o Acompañante)
    p2Dmg: ["¡Frase de daño del personaje 2!", "¡Frase de daño del personaje 2!"],
    p2Heal: ["¡Frase de cura del personaje 2!", "¡Frase de cura del personaje 2!"]
  }
};
```

---

## 🔊 6. Audio y Sintetizador Fallback

Al recibir daño (`dmg`), curarse (`heal`) o empezar partida (`victory`), se intenta reproducir el archivo de audio local. Si la carga del archivo MP3 falla (o está en Nebula estándar), se ejecuta un sintetizador alternativo mediante la **Web Audio API**:

```javascript
// En playSynthSound(type):
if (currentTheme === 'mi_tema' && (type === 'dmg' || type === 'heal')) {
  const audio = new Audio(`./themes/${currentTheme}/${type}.mp3`);
  audio.play().catch(() => {
    triggerSynthFallback(currentTheme, type, audioCtx.currentTime);
  });
  return;
}
```

---

## ⚙️ 7. Pasos para Integrar un Nuevo Tema (Checklist de Desarrollo)

Para añadir un nuevo tema a la aplicación, sigue este orden exacto:

1.  **Generar e Integrar Assets:**
    *   Generar los fondos modularizados (`top.jpg`, `bottom.jpg`) en formato 4:3 aplicando la estrategia lateral.
    *   Generar el clip `loading.mp4` de 4 segundos con crossover de MTG.
    *   Descargar o sintetizar los audios `dmg.mp3`, `heal.mp3` y `victory.mp3`.
    *   Guardar todos estos assets en `themes/<theme_id>/`.
2.  **Registrar el Tema en `contador.html`:**
    *   Añadir el botón del tema en la barra deslizadora del Lobby (`.theme-slider`).
    *   Añadir el botón del tema en la rejilla del modal de cambio de tema (`#theme-modal`).
3.  **Configurar Frases e Hilo en `engine.js`:**
    *   Añadir la clave en el objeto global `THEMES` con sus frases personalizadas de Daño y Cura.
    *   Agregar las 4 frases de carga en la constante `phrases` dentro de la función del click de `btnStartGame`.
    *   Configurar el contexto del personaje en `triggerGeminiPhrase` (para cuando se active el modo IA de Gemini).
4.  **Maquetar y Ajustar Estilos en `style.css`:**
    *   Crear los selectores `body[data-theme="<theme_id>"]` para inyectar fondos.
    *   Personalizar las fuentes retro del tema (Google Fonts).
    *   Dar estilo tridimensional y mecánicamente sensible a las botoneras (`.lifebtn.lplus` y `.lifebtn.lminus`).
    *   Configurar las burbujas de diálogo y popups de delta con los colores y efectos característicos del tema.
