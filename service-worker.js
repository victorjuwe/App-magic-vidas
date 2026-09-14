// Service Worker — Magic BO3 Counter
// Rutas relativas para que funcione bajo cualquier subpath de GitHub Pages.
//
// Estrategia (v100):
//   · Shell (html/css/js)  → cache-first + revalidación en segundo plano  ⇒ arranque instantáneo
//   · Imágenes             → cache-first, se llenan al usarlas            ⇒ sin descargas repetidas
//   · Audio/vídeo          → cache-first + soporte Range (iOS Safari)     ⇒ sin descargar 5MB al instalar
//   · Resto (CDN, fuentes) → cache-first con red de respaldo
//
// El install ya NO precachea los 86 MP3 (5,1 MB): cada tema cachea sus sonidos
// la primera vez que se selecciona/reproduce. Instalación más rápida y, sobre todo,
// tolerante a fallos: un archivo que falte ya no tumba el Service Worker entero.

const CACHE = 'magic-bo3-v100';

// ── Nivel 1: shell mínimo imprescindible. Bloquea el install. ──────────────
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
  './icon-180.png',
  './icon-192.png',
  './icon-512.png'
];

// ── Nivel 2: previews del lobby. Best-effort, NO bloquea el install. ───────
const THEME_IDS = [
  'bleach', 'bttf', 'demonslayer', 'dragonball', 'mario',
  'naruto', 'onepiece', 'rickmorty', 'simpsons', 'streetfighter'
];
const PREVIEW_ASSETS = THEME_IDS.map(id => `./themes/${id}/preview.webp`);

// ── Nivel 3: CDN. Best-effort. ────────────────────────────────────────────
const CDN_ASSETS = [
  'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js',
  'https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Cinzel+Decorative:wght@900&family=Lilita+One&family=Orbitron:wght@500;800;900&family=Outfit:wght@300;400;600;800&family=Permanent+Marker&family=Pirata+One&family=Press+Start+2P&family=Russo+One&family=Shojumaru&family=VT323&display=swap'
];

// Añade sin dejar que un fallo aislado rompa la instalación completa.
async function addAllTolerant(cache, urls) {
  const results = await Promise.allSettled(urls.map(u => cache.add(u)));
  const failed = results
    .map((r, i) => (r.status === 'rejected' ? urls[i] : null))
    .filter(Boolean);
  if (failed.length) console.warn('[SW] No se pudieron cachear:', failed);
  return failed;
}

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await addAllTolerant(cache, CORE_ASSETS);
    self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();

    // Previews y CDN en segundo plano: la app ya es usable mientras esto baja.
    const cache = await caches.open(CACHE);
    addAllTolerant(cache, PREVIEW_ASSETS);
    Promise.all(CDN_ASSETS.map(url =>
      fetch(url, { mode: 'no-cors' })
        .then(res => cache.put(url, res))
        .catch(() => {})
    ));
  })());
});

// Busca en caché ignorando el ?v=NN de cache-busting, para que style.css?v=100
// encuentre el './style.css' precacheado sin tener que volver a descargarlo.
async function matchCache(req) {
  const cache = await caches.open(CACHE);
  return (await cache.match(req)) || (await cache.match(req, { ignoreSearch: true }));
}

// Refresca en segundo plano sin hacer esperar al usuario.
function revalidate(req) {
  fetch(req)
    .then(res => {
      if (res && res.status === 200 && res.type !== 'opaqueredirect') {
        caches.open(CACHE).then(c => c.put(req, res.clone())).catch(() => {});
      }
    })
    .catch(() => {});
}

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  if (!req.url.startsWith('http')) return;

  const isAudioOrVideo =
    req.destination === 'video' ||
    req.destination === 'audio' ||
    /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(req.url);

  // ── Audio y vídeo: cache-first + Range para iOS Safari ──────────────────
  if (isAudioOrVideo) {
    event.respondWith((async () => {
      const cached = await matchCache(req);
      if (cached) return handleRangeRequest(req, cached);
      try {
        const fresh = await fetch(req);
        if (fresh && fresh.status === 200) {
          const cache = await caches.open(CACHE);
          cache.put(req, fresh.clone()).catch(() => {});
        }
        return fresh;
      } catch (err) {
        return new Response('Offline', { status: 503 });
      }
    })());
    return;
  }

  const isImage =
    req.destination === 'image' ||
    /\.(webp|png|jpe?g|gif|svg|avif)(\?.*)?$/i.test(req.url);

  // ── Imágenes: cache-first puro, se llenan al usarlas ────────────────────
  if (isImage) {
    event.respondWith((async () => {
      const cached = await matchCache(req);
      if (cached) return cached;
      try {
        const fresh = await fetch(req);
        if (fresh && fresh.status === 200) {
          const cache = await caches.open(CACHE);
          cache.put(req, fresh.clone()).catch(() => {});
        }
        return fresh;
      } catch (err) {
        return new Response('', { status: 503 });
      }
    })());
    return;
  }

  // ── Shell y resto: cache-first con revalidación en segundo plano ────────
  event.respondWith((async () => {
    const cached = await matchCache(req);
    if (cached) {
      revalidate(req);          // se actualizará para la próxima carga
      return cached;            // pintado inmediato, sin esperar a la red
    }
    try {
      const fresh = await fetch(req);
      if (fresh && fresh.status === 200 && fresh.type !== 'opaqueredirect') {
        const cache = await caches.open(CACHE);
        cache.put(req, fresh.clone()).catch(() => {});
      }
      return fresh;
    } catch (err) {
      if (req.mode === 'navigate') {
        const shell = await matchCache(new Request('./contador.html'));
        if (shell) return shell;
      }
      return new Response('Offline', { status: 503, statusText: 'Offline' });
    }
  })());
});

// Manejador de Range Requests para archivos binarios de audio/vídeo en caché
async function handleRangeRequest(request, cachedResponse) {
  const rangeHeader = request.headers.get('range');
  if (!rangeHeader) return cachedResponse;

  try {
    const arrayBuffer = await cachedResponse.arrayBuffer();
    const parts = rangeHeader.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : arrayBuffer.byteLength - 1;

    if (start >= arrayBuffer.byteLength || end >= arrayBuffer.byteLength) {
      return new Response('', {
        status: 416,
        statusText: 'Range Not Satisfiable',
        headers: { 'Content-Range': `bytes */${arrayBuffer.byteLength}` }
      });
    }

    const sliced = arrayBuffer.slice(start, end + 1);
    const contentType = cachedResponse.headers.get('content-type') || 'audio/mp3';
    return new Response(sliced, {
      status: 206,
      statusText: 'Partial Content',
      headers: {
        'Content-Type': contentType,
        'Content-Range': `bytes ${start}-${end}/${arrayBuffer.byteLength}`,
        'Content-Length': sliced.byteLength.toString(),
        'Accept-Ranges': 'bytes'
      }
    });
  } catch (err) {
    return cachedResponse;
  }
}
