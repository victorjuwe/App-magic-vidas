# 🔮 Contador de Vidas MTG — Multiverso Premium (PWA)

Aplicación contador de vidas para **Magic: The Gathering** (formato **BO3 / Torneo** y **Commander**), instalable como PWA con soporte offline. Pensada para iPhone 17 Pro Max pero funciona en cualquier móvil moderno.

---

## ✨ Características principales

- **🎮 Multimodo** — partidas Commander (40 vidas) o BO3 competitivo (20 vidas, 2 dots, sideboard automático).
- **🎨 Temas del multiverso** — cada tema cambia por completo interfaz, sonidos, tipografía y diálogos:
  - **🌌 Nebula** (estándar) — fondo galáctico WebGL reactivo a la diferencia de vidas
  - **🕹️ Street Fighter II** — recreativa de 16 bits, botones arcade, voces del announcer
  - **🌀 Rick y Morty** — panel sci-fi verde con portales
  - **🍩 Los Simpsons** — central nuclear de Springfield, alarmas reactivas
  - **🚗 Regreso al Futuro** — DeLorean, condensador de fluzo
  - **⚔️ Bleach** — Reiatsu, katanas, mariposas infernales
  - **🍥 Naruto Shippuden** — chakra, sharingan, Konoha
  - **🏴‍☠️ One Piece** — Thousand Sunny, Jolly Roger
  - **⚡ Dragon Ball Z** — scouter, ki, Super Saiyan
- **💬 Diálogos de combate** — frases icónicas por tema (¡Hadouken!, ¡D'oh!, ¡Gran Scott!, ¡Bankai!), opcionalmente potenciados con la API de Gemini para diálogo dinámico.
- **🔊 Audio dual** — MP3 de alta fidelidad por tema + sintetizadores AudioContext para fallback offline.
- **📱 PWA offline** — Service Worker con cache-first, instalable como app nativa.
- **⚙️ Reloj torneo + sideboard automático** — 50:00 con alertas a 10 y 5 minutos, fase de sideboard intermedia con cronómetro de 3 minutos.

---

## 📂 Estructura del proyecto

```
contador/
├── contador.html              ← App principal (single-file PWA)
├── engine.js                  ← Lógica de juego
├── style.css                  ← Estilos y temas
├── manifest.json              ← Configuración PWA
├── service-worker.js          ← Caché offline
├── server.py                  ← Servidor local de desarrollo (con Range Requests)
├── subir.bat                  ← Script de despliegue a GitHub Pages
│
├── temas → themes/            ← Assets por tema (imágenes, audio, prompts.json)
├── recursos → assets/         ← Logos globales
├── marca → brand/             ← Identidad visual
├── ejemplos/                  ← Capturas y referencias visuales
│
├── documentacion/             ← Toda la documentación
│   └── README.md              ← Índice de documentación
│
└── herramientas/              ← Scripts de mantenimiento (no usados en producción)
    └── README.md              ← Índice de herramientas
```

---

## 🚀 Cómo arrancar en local

```bash
# Servidor Python (recomendado, soporta vídeo en iOS)
python server.py

# Acceso: http://localhost:8000
# Móvil en la misma red: http://<tu-ip>:8000
```

Para subir cambios a GitHub Pages: doble click en `subir.bat`.

---

## 🛡️ Seguridad

- La **API Key de Gemini** nunca se commitea. Se pide al usuario y se guarda en `localStorage` del navegador.
- Diálogos dinámicos se inyectan con `textContent`, no `innerHTML` (sin XSS).
- Dependencias y scripts internos excluidos vía `.gitignore`.

---

## 🎨 Creación y Generación de Temas

Para crear, editar o generar un nuevo tema interactivo del multiverso (por ejemplo, el tema de Super Mario Retro recientemente integrado), consulta nuestra guía especializada en formato Skill:
- 📖 **[Manual de Creación de Temas (SKILL.md)](skills/mtg-theme-master/SKILL.md)**: Detalla la estructura de archivos, prompts de IA recomendados (Midjourney, DALL-E, Flow), registros en `engine.js`, inyecciones CSS y el mapeo en el generador de la extensión.

---

## 📋 Estado y roadmap

- Cosas pendientes: ver [`PENDIENTES.md`](PENDIENTES.md)
- Ideas premium futuras: ver [`documentacion/hoja_ruta_temas_futuros.md`](documentacion/hoja_ruta_temas_futuros.md)
