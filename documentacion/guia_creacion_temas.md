# Guía de Creación de Temas Premium para Magic Life Counter

Esta guía describe el blueprint técnico para crear e integrar nuevos temas interactivos y visualmente impresionantes en la aplicación **Magic Life Counter**, maximizando el uso de la extensión de generación de imágenes y la arquitectura dinámica de la PWA.

---

## 1. Generación de Fondos con la Extensión (`flow-image-generator`)

Para que un tema se sienta de primer nivel, los fondos de los jugadores deben estar diseñados de forma que no interfieran con la legibilidad de los números de vida y los botones.

### Requisitos de Aspect Ratio y Composición
- **Relación de Aspecto**: Siempre utilizar `--ar 4:3` (Horizontal).
- **Composición del Sujeto**: Los sujetos principales (personajes, objetos clave, monstruos) deben estar situados en los **extremos izquierdo y derecho**.
- **Centro despejado**: El centro de la imagen debe ser liso, oscuro, o de color neutro y sólido, ya que ahí se dibuja el marcador de vidas gigante.
- **Estructura de Carpetas**: La extensión descargará las imágenes en la carpeta `Flow_Generations/<Prefijo_Tema>/`.
  - Jugador 1 (Oponente/Arriba): Debe renombrarse como `top.webp`.
  - Jugador 2 (Local/Abajo): Debe renombrarse como `bottom.webp`.

### Plantilla de Prompts Recomendada
> `[Personaje/Tema] on the left and right sides of the screen, central area is dark and empty, minimal details in the center, cinematic lighting, fantasy art style, 8k resolution, MTG card style, dark fantasy --ar 4:3`

---

## 2. Integración en el Motor JavaScript (`engine.js`)

Para registrar tu tema de forma dinámica y que aparezca tanto en el carrusel de bienvenida como en el modal de ajustes, debes actualizar dos variables clave en `engine.js`:

### A. Registro de Metadatos (`THEME_METADATA`)
Añade un objeto para tu tema en el array `THEME_METADATA`:

```javascript
{
  id: 'mi_tema', // Identificador único usado para el atributo data-theme
  name: 'Nombre del Tema',
  icon: '🔮', // Emoji representativo
  desc: 'Descripción corta del tema',
  badge: 'CATEGORÍA', // E.g. SCI-FI, ANIME, RETRO, FANTASY
  bg: './themes/mi_tema/bottom.webp' // Imagen para la miniatura
}
```

### B. Frases de Combate (`THEMES`)
Registra las frases interactivas (las que flotan cuando cambia la vida) en el objeto principal `THEMES`:

```javascript
mi_tema: {
  name: 'Nombre del Tema',
  p1Dmg: [
    "¡Frase de daño jugador 1!",
    "¡Poder elemental desatado!"
  ],
  p1Heal: [
    "¡Recuperando energía sagrada!"
  ],
  p2Dmg: [
    "¡Frase de daño jugador 2!"
  ],
  p2Heal: [
    "¡Sanación completada!"
  ]
}
```

---

## 3. Efectos de Audio Retro y Personalizados

Coloca los archivos de audio en la carpeta del tema: `themes/mi_tema/`. Se cargan automáticamente bajo demanda:
- `dmg.mp3`: Sonido que se reproduce cuando un jugador recibe daño.
- `heal.mp3`: Sonido para la ganancia de vida o reinicios ("Continue").
- `victory.mp3`: Fanfarria o marcha triunfal cuando un jugador gana la partida o un overlay especial se activa.

---

## 4. Personalización y Estilos CSS (`style.css`)

El cuerpo del documento tendrá el atributo `data-theme="mi_tema"` cuando el tema esté seleccionado. Puedes definir reglas de CSS específicas usando selectores de atributo:

### A. Fondos de Pantalla de los Jugadores
Para el jugador superior (P1), solemos rotar la imagen 180 grados para que el oponente la vea en su orientación nativa si jugamos cara a cara:

```css
/* Jugador 1 (Arriba) */
body[data-theme="mi_tema"] #p1::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url('./themes/mi_tema/top.webp') !important;
  background-position: center center !important;
  background-size: cover !important;
  transform: rotate(180deg);
  z-index: -2;
  pointer-events: none;
}

/* Jugador 2 (Abajo) */
body[data-theme="mi_tema"] #p2 {
  background-image: url('./themes/mi_tema/bottom.webp') !important;
  background-position: center center !important;
  background-size: cover !important;
}
```

### B. Tipografías y Colores Personalizados
Para crear una estética premium, cambia la tipografía del marcador de vida o los botones de control:

```css
body[data-theme="mi_tema"] .life-num {
  font-family: 'Outfit', sans-serif;
  color: #ffd700;
  text-shadow: 0 0 15px rgba(255, 215, 0, 0.6);
}
```

### C. Personalización Premium de Botones
El motor del juego utiliza variables CSS para los colores de los botones táctiles de vida. Puedes definirlas a nivel de `:root` o del cuerpo:

```css
body[data-theme="mi_tema"] {
  --p1-btn-bg: linear-gradient(145deg, #1b0a2a, #0c0415);
  --p1-btn-border-plus: rgba(157, 0, 255, 0.4);
  --p1-btn-text-plus: #d18aff;
  
  --p2-btn-bg: linear-gradient(145deg, #2a0a0a, #150404);
  --p2-btn-border-plus: rgba(255, 0, 0, 0.4);
  --p2-btn-text-plus: #ff8a8a;
}
```

---

## 5. Implementación de Mecánicas Tipo Minijuego (Avanzado)

Si deseas añadir mecánicas interactivas avanzadas (como las barras de vida de Street Fighter o agujas/alarmas de Los Simpsons), sigue este patrón de integración JS:

1. **Detección de Vidas**: Modifica `renderLife(p, v)` para comprobar si tu tema está activo (`document.body.dataset.theme === 'mi_tema'`).
2. **Control de Elementos**: Crea contenedores específicos en `contador.html` con la visibilidad controlada por CSS (`display: none` por defecto, `display: block` bajo tu selector `body[data-theme="mi_tema"]`).
3. **Animación/Feedback**: Usa bibliotecas de animación como `anime.js` (ya integrada en el núcleo) para animar elementos en base a los incrementos y decrementos reales de vida.
