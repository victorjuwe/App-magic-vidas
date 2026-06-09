// Service Worker — Magic BO3 Counter
// Rutas relativas para que funcione bajo cualquier subpath de GitHub Pages.

const CACHE = 'magic-bo3-v81';

// Activos críticos para arrancar 100% offline
const CORE_ASSETS = [
  './',
  './contador.html',
  './style.css',
  './engine.js',
  './manifest.json',
  './assets/logo.webp',
  './assets/lobby_bg.webp',
  './assets/mode_bo3.webp',
  './assets/mode_commander.webp',
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

  // Manejo de Audio y Video con soporte de Range Requests para iOS Safari offline
  const isAudioOrVideo = req.destination === 'video' || req.destination === 'audio' || req.url.match(/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i);
  if (isAudioOrVideo) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      const cached = await cache.match(req);
      if (cached) {
        return handleRangeRequest(req, cached);
      }
      try {
        const fresh = await fetch(req);
        if (fresh && fresh.status === 200) {
          cache.put(req, fresh.clone()).catch(() => {});
        }
        return fresh;
      } catch (err) {
        return new Response('Offline', { status: 503 });
      }
    })());
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

// Manejador de Range Requests para archivos binarios de audio/video en caché
async function handleRangeRequest(request, cachedResponse) {
  const rangeHeader = request.headers.get('range');
  if (!rangeHeader) return cachedResponse;

  try {
    const arrayBuffer = await cachedResponse.arrayBuffer();
    const parts = rangeHeader.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : arrayBuffer.byteLength - 1;

    if (start >= arrayBuffer.byteLength || end >= arrayBuffer.byteLength) {
      return new Response("", {
        status: 416,
        statusText: "Range Not Satisfiable",
        headers: { "Content-Range": `bytes */${arrayBuffer.byteLength}` }
      });
    }

    const sliced = arrayBuffer.slice(start, end + 1);
    const contentType = cachedResponse.headers.get("content-type") || "audio/mp3";
    return new Response(sliced, {
      status: 206,
      statusText: "Partial Content",
      headers: {
        "Content-Type": contentType,
        "Content-Range": `bytes ${start}-${end}/${arrayBuffer.byteLength}`,
        "Content-Length": sliced.byteLength.toString(),
        "Accept-Ranges": "bytes"
      }
    });
  } catch (err) {
    return cachedResponse;
  }
}
