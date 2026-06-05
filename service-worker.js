// Service Worker — Magic BO3 Counter
// Rutas relativas para que funcione bajo cualquier subpath de GitHub Pages.

const CACHE = 'magic-bo3-v53';

// Activos críticos para arrancar 100% offline
const CORE_ASSETS = [
  './',
  './contador.html',
  './style.css',
  './engine.js',
  './manifest.json',
  './assets/logo.webp',
  './assets/lobby_bg.png',
  './assets/mode_bo3.png',
  './assets/mode_commander.png',
  './icon-192.png',
  './icon-512.png'
];

// Activos CDN — cache opportunista (no bloqueamos install si fallan)
const CDN_ASSETS = [
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js',
  'https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Cinzel+Decorative:wght@900&family=Lilita+One&family=Orbitron:wght@500;800;900&family=Outfit:wght@300;400;600;800&family=Permanent+Marker&family=Pirata+One&family=Press+Start+2P&family=Russo+One&family=Shojumaru&family=VT323&display=swap'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(CORE_ASSETS);
    // CDN: best-effort (cdnjs/Google Fonts pueden bloquear no-cors según política)
    await Promise.all(CDN_ASSETS.map(url =>
      fetch(url, { mode: 'no-cors' })
        .then(res => cache.put(url, res))
        .catch(() => {})
    ));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

// Estrategia: Network-First (con fallback a caché si no hay conexión)
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // Evitar interceptar esquemas no HTTP/HTTPS (como extensiones del navegador)
  if (!req.url.startsWith('http')) return;

  // Evitar interceptar vídeos o audios para prevenir fallos con Range Requests en iOS Safari
  if (
    req.destination === 'video' ||
    req.destination === 'audio' ||
    req.url.match(/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i)
  ) {
    return;
  }

  event.respondWith((async () => {
    try {
      // Intentar primero obtener de la red
      const fresh = await fetch(req);
      
      // Si la respuesta es válida, actualizar la caché en segundo plano
      if (fresh && fresh.status === 200 && fresh.type !== 'opaqueredirect') {
        const cache = await caches.open(CACHE);
        cache.put(req, fresh.clone()).catch(() => {});
      }
      return fresh;
    } catch (err) {
      // Si falla la red (offline), buscar en la caché
      const cached = await caches.match(req);
      if (cached) return cached;
      
      // Si no está en caché y es una navegación de página, servir contador.html
      if (req.mode === 'navigate') {
        const shell = await caches.match('./contador.html');
        if (shell) return shell;
      }
      return new Response('Offline', { status: 503, statusText: 'Offline' });
    }
  })());
});
