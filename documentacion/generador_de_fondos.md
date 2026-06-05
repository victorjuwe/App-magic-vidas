# Habilidad: Generador de Prompts para Fondos de Magic Counter (9:16)

Esta habilidad contiene el conocimiento de maquetación de la interfaz táctil del contador de vidas de MTG. Se utiliza para generar **prompts de inteligencia artificial (DALL-E, Midjourney, Stable Diffusion)** que creen los marcos y fondos ideales sin obstruir los contadores numéricos ni las botoneras interactivas.

---

## 1. Planilla de Maquetación y Zonas de la Interfaz

Para que un fondo sea perfecto, debe respetar la estructura de pantalla del teléfono en orientación vertical **(Relación de aspecto 9:16, resolución ideal: 1080x1920 px o superior)**:

```
+---------------------------------------------+  <- Top de pantalla (Notch / Dynamic Island)
|               JUGADOR 1 (OPONENTE)           |
|            (Rotado 180° simétricamente)      |
|  [Barra Rondas]       [Mulligans] [Notas SB] |  <- Zona alta (interactiva)
|                                             |
|               [ CONTADOR GRANDE ]           |  <- Zona central-superior (gran visibilidad)
|                   (160px - 200px)           |
|                                             |
|        [-5]    [-1]    [+1]    [+5]         |  <- Botones de Vida (60px de alto, anchos)
|                                             |
+─────────────────────────────────────────────+
|       DIVISOR CENTRAL - RELOJ DE TORNEO     |  <- Línea de corte de 65px de alto
|  [Reloj]   [Botón Primero]    [Herramientas]|  <- Fondo oscuro sólido/semitransparente
+─────────────────────────────────────────────+
|        [-5]    [-1]    [+1]    [+5]         |  <- Botones de Vida (Jugador Local)
|                                             |
|               [ CONTADOR GRANDE ]           |  <- Zona central-inferior (gran visibilidad)
|                                             |
|  [Barra Rondas]       [Mulligans] [Notas SB] |  <- Zona baja (interactiva)
|               JUGADOR 2 (LOCAL)             |
+---------------------------------------------+  <- Bottom de pantalla (Home Indicator)
```

### Reglas Clave de Diseño para los Fondos:
1.  **División en Espejo:** El diseño debe ser simétrico en el eje Y (superior vs inferior) pero con el superior invertido o con una temática complementaria, ya que la parte superior de la interfaz está completamente rotada 180° para que el rival la vea derecha.
2.  **Divisor Central:** Se aconseja colocar una franja divisoria o un punto de luz/energía en el centro horizontal exacto para fusionarse con el panel de control del torneo (65px de alto).
3.  **Contraste Óscuro:** El color base de fondo debe ser extremadamente oscuro (como `#07070e` o `#1c1d22`) para asegurar la legibilidad del texto de vida en color blanco y neones.
4.  **Huecos para Números:** Las áreas donde van los números de vida centrales deben estar limpias de detalles complejos, texturas ruidosas u objetos brillantes. Idealmente, deben tener una base difuminada oscura.

---

## 2. Generador de Prompts (Plantilla Maestra)

Para crear imágenes con estas características, utiliza la siguiente estructura en Midjourney o DALL-E:

> **[Tema/Estilo] border frame for a 2D mobile game interface, vertical 9:16 layout, symmetrical composition divided in the center by a dark divider bar. The upper half is mirrored/rotated 180 degrees. Two clean rectangular slots in the upper-middle and lower-middle areas with solid dark backgrounds for UI text overlay. Glowing neon runes and [detalles específicos del tema] detailed borders on the sides, high contrast, dark atmosphere, photorealistic, cinematic lighting, 8k resolution, flat game UI asset --ar 9:16 --v 6.0**

---

## 3. Catálogo de Prompts Específicos por Temas

### A. Tema Bleach (Energía Shinigami)
> **Anime Shinigami soul energy border frame for a mobile game interface, vertical 9:16 layout, symmetrical composition split in the center by a dark black line. Two clean, rectangular dark hollow areas in the upper-middle and lower-middle for UI text. Epic black sword katana silhouettes, glowing neon purple and bright orange spiritual energy fire flames (reiatsu) on the left and right borders. Shinto shrines runes, dark moody atmosphere, highly detailed anime vector style, cinematic lighting --ar 9:16 --v 6.0**

### B. Tema Phyrexia (Aceite Oscuro y Biomecánico - MTG)
> **Phyrexian biomechanical copper and dark metal border frame for a mobile card game UI, vertical 9:16, symmetrical layout split in the center. Two clean, glowing dark green oily rectangular slots in the upper and lower halves for numbers. Creepy biomechanical wires, glowing green toxic runes, phyrexian emblem subtly detailed on borders, porcelain white plates mixed with black metal, dark horror atmosphere, high contrast --ar 9:16 --v 6.0**

### C. Tema Regreso al Futuro (Laboratorio de Doc / Industrial Analógico)
> **80s analog synthesizer retro-futuristic border frame for a mobile application interface, vertical 9:16 layout, symmetrical composition split in the center by a dark metal bar. Clean dark grey dashboard panels in the upper-middle and lower-middle sections for text. Glowing neon orange and neon cyan wires, dynamic blue lightning, flux capacitor metallic details, copper coils on the side borders, industrial analog style, photorealistic, 8k --ar 9:16 --v 6.0**

### D. Tema Kamigawa Neon (Cyberpunk Ninja - MTG)
> **Cyberpunk Kamigawa neon ninja border frame for a game interface, vertical 9:16 layout, split in the middle. Clean dark violet rectangular slots in the upper-middle and lower-middle sections. Glowing electric cyan and hot pink neon grids, hologram sakura leaves, digital glitch lines, kanji futuristic runes on the borders, dark street cyberpunk style --ar 9:16 --v 6.0**

### E. Tema Los Simpsons (Estilo Cómic y Escenarios de Springfield)
> **Bright yellow 90s cartoon style layout frame for a mobile app, vertical 9:16 aspect ratio. Symmetrical composition divided in the center. Top half shows a yellow cartoon town, nuclear cooling tower, skateboard, soda can. Bottom half shows a cartoon living room with a brown sofa and retro TV. Two clean dark rectangular slots with neon borders in the middle. Bright yellow, pink, and blue colors, flat vector illustration, cartoon comic book art style --ar 9:16 --v 6.0**

### F. Tema Rick y Morty (Estilo Portal y Laboratorio de Ciencia Ficción)
> **Cosmic green sci-fi cartoon style layout frame for a mobile app, vertical 9:16 aspect ratio. Symmetrical composition split in the center. Top half shows futuristic spaceships, alien planets, green glowing portal fluid swirls. Bottom half shows a cartoon science laboratory desk with bubbling flasks, wires, laser guns. Two clean dark rectangular slots with neon green borders in the middle. Saturated green, neon cyan and dark grey colors, flat vector illustration, detailed comic art --ar 9:16 --v 6.0**

---

## 4. Instrucción para el Usuario
Cuando desees generar un nuevo fondo:
1. Copia uno de los prompts del catálogo.
2. Inrodúcelo en un generador de imágenes por IA (por ejemplo, Midjourney con el parámetro `--ar 9:16`).
3. Guarda el resultado con el nombre `frame.png` en `themes/<nombre_tema>/` y configúralo en la aplicación.
