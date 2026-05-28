# ⚜️ Guía de Identidad de Marca: jUwE LM (App Life Magic)

Esta guía establece los fundamentos visuales y comerciales de **jUwE LM**, el contador de vidas premium y portal cibernético de torneos para juegos de cartas coleccionables.

---

## 🎨 Especificación de Colores Oficiales

Nuestra marca utiliza una combinación de alto contraste que evoca poder, tensión y dinamismo mecánico:

| Color | Código HEX | Código HSL | Uso Principal |
| :--- | :--- | :--- | :--- |
| **jUwE Void** | `#040406` | `hsl(240, 20%, 2%)` | Fondos de pantalla, modales y capas de respaldo OLED. |
| **jUwE Obsidian** | `#0a0a0f` | `hsl(240, 20%, 5%)` | Contenedores con efecto glassmorphic (esmerilado). |
| **jUwE Red Neón** | `#ff1a40` | `hsl(350, 100%, 55%)` | Acentuación activa, jugador principal, botón Start. |
| **jUwE Orange** | `#ff6a00` | `hsl(25, 100%, 50%)` | Resplandores secundarios, orbes de vida, indicadores. |
| **Ember Glow** | `#ffb700` | `hsl(43, 100%, 50%)` | Toques de victoria, realce y textos informativos. |

---

## 🔱 Logotipo Oficial: jUwE Core SVG

El logotipo está construido en SVG puro para garantizar una resolución infinita a 60fps sin sobrecargar la memoria de dispositivos móviles.

### Estructura Vectorial y Diseño Rúnico
El logo consta de tres capas concéntricas animadas:
1. **Órbita Exterior (`.outer-orbit`)**: Anillo en degradado Naranja-Rojo que gira en sentido horario.
2. **Órbita Central (`.mid-hex`)**: Polígono hexagonal discontinuo que gira en sentido antihorario.
3. **Monograma central (`.core-monogram`)**: Fusión de las letras **J** y **W** dibujadas con vectores de trazo grueso y resplandor neón naranja.

### Código SVG Integrado
```xml
<svg class="juwe-logo-svg" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Gradiente de Éter de Naranja a Rojo -->
    <linearGradient id="juwe-grad-main" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff6a00" />
      <stop offset="100%" stop-color="#ff1a40" />
    </linearGradient>
    <linearGradient id="juwe-grad-glow" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff003c" />
      <stop offset="100%" stop-color="#ffb700" />
    </linearGradient>
    <!-- Filtro de Resplandor Neón -->
    <filter id="juwe-neon-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="5" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
  
  <!-- Órbita Exterior Giratoria (Naranja-Rojo) -->
  <circle cx="80" cy="80" r="72" stroke="url(#juwe-grad-main)" stroke-width="2" fill="none" 
          stroke-dasharray="120 40" class="juwe-orbit-outer" />
          
  <!-- Órbita Interna de Puntos Giratoria (Rojo-Oro) -->
  <circle cx="80" cy="80" r="56" stroke="url(#juwe-grad-glow)" stroke-width="1.5" fill="none" 
          stroke-dasharray="6 14" class="juwe-orbit-inner" />
          
  <!-- Núcleo Central: Monograma Estilizado J+W -->
  <g class="juwe-monogram" filter="url(#juwe-neon-glow)">
    <!-- Letra J lateralizada -->
    <path d="M 68 45 L 68 95 C 68 112, 50 112, 50 98" 
          stroke="#ff1a40" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
    <!-- Letra W central e inclinada que se cruza con J -->
    <path d="M 74 48 L 86 102 L 98 62 L 110 102 L 122 48" 
          stroke="#ff6a00" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
    <!-- Runas/Puntos de Control de Energía -->
    <circle cx="80" cy="80" r="3" fill="#ffb700" />
    <circle cx="50" cy="48" r="2.5" fill="#ff1a40" />
    <circle cx="122" cy="48" r="2.5" fill="#ff6a00" />
  </g>
</svg>
```

---

## 📢 Propuesta de Marketing de Guerrilla (Attraction Plan)

Para atraer a jugadores a la plataforma, utilizaremos un enfoque basado en resolver problemas reales del formato (anuncios molestos, consumo excesivo de batería, interfaces aburridas) mediante publicaciones de alto impacto visual.

### 🌐 Pitch de Venta (USP - Unique Selling Proposition)
> **"La app de contador de vidas que parece sacada de un torneo oficial de eSports, funciona 100% offline y te permite crear temas con IA local desde tu PC."**

### ✍️ Plantilla de Lanzamiento para Reddit (r/magicTCG, r/pwa, r/IndieDev)
*   **Título sugerido**: `Presentando jUwE LM - Un contador de vidas premium y táctico para BO3 [Sin anuncios, PWA offline y compatible con temas personalizados]`
*   **Contenido**:
    > ¡Hola a todos! 
    > Cansado de usar contadores web lentos, llenos de publicidad y que devoran la batería de mi móvil durante los torneos BO3, he creado **jUwE LM** (App Life Magic).
    > 
    > ✨ **Características Clave**:
    > * **Cero Anuncios**: Código abierto y optimizado para iOS/Android como PWA (instalar y jugar).
    > * **Diseño Cyber-Fantasy**: Interfaz oscura OLED ultra limpia con animaciones fluidas a 60fps.
    > * **Temas Inmersivos**: Cambia entre escenarios inspirados en pop-culture (Bleach, Street Fighter, Simpsons, Regreso al Futuro) que incluyen efectos de sonido y voces en japonés.
    > * **IA Local**: Genera tus propios fondos en espejo a resolución 4:3 enlazando la app con tu propia GPU local a través de ComfyUI.
    >
    > Me encantaría que la probarais en vuestros próximos duelos y me dierais vuestro feedback. 

### 📸 Pautas para Capturas y Vídeos
1. **Vídeo de Introducción**: Grabar la pantalla de carga de la app (con su terminal cibernética escribiendo comandos) y la transición suave hacia el Lobby Selector.
2. **Foto de Duelo**: Tomar una captura horizontal que muestre la app abierta en el centro de la mesa entre dos barajas reales, destacando el contraste del tema OLED con la mesa física.
