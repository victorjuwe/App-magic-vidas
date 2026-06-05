const http = require('http');
const fs   = require('fs');
const path = require('path');
const os   = require('os');

const PORT = 8081;

const MIME = {
  '.html'  : 'text/html; charset=utf-8',
  '.css'   : 'text/css',
  '.js'    : 'text/javascript',
  '.json'  : 'application/json',
  '.png'   : 'image/png',
  '.jpg'   : 'image/jpeg',
  '.jpeg'  : 'image/jpeg',
  '.gif'   : 'image/gif',
  '.webp'  : 'image/webp',
  '.svg'   : 'image/svg+xml',
  '.mp4'   : 'video/mp4',         // ← crítico para iOS
  '.webm'  : 'video/webm',
  '.mp3'   : 'audio/mpeg',
  '.wav'   : 'audio/wav',
  '.woff'  : 'font/woff',
  '.woff2' : 'font/woff2',
  '.ttf'   : 'font/ttf',
  '.ico'   : 'image/x-icon',
};

const ROOT = path.join(__dirname, '..');

const server = http.createServer((req, res) => {
  // Solo GET/HEAD
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405); res.end(); return;
  }

  // Sanitizar ruta
  let urlPath = req.url.split('?')[0].split('#')[0];
  urlPath = decodeURIComponent(urlPath);
  if (urlPath === '/' || urlPath === '') urlPath = '/contador.html';

  const filePath = path.normalize(path.join(ROOT, urlPath));

  // Seguridad: no salir del ROOT (añadir barra inclinada del sistema para evitar carpetas hermanas)
  const ROOT_SAFE = ROOT.endsWith(path.sep) ? ROOT : ROOT + path.sep;
  if (!filePath.startsWith(ROOT_SAFE) && filePath !== ROOT) {
    res.writeHead(403); res.end('Forbidden'); return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME[ext] || 'application/octet-stream';
  const isVideo = contentType.startsWith('video/');

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      console.warn(`[404] ${req.url}`);
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
      return;
    }

    const total = stat.size;
    const rangeHeader = req.headers['range'];

    // ── Range request (necesario para video en iOS/Android) ──
    if (isVideo && rangeHeader) {
      const parts = rangeHeader.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end   = parts[1] ? parseInt(parts[1], 10) : total - 1;
      const chunkSize = end - start + 1;

      res.writeHead(206, {
        'Content-Range'  : `bytes ${start}-${end}/${total}`,
        'Accept-Ranges'  : 'bytes',
        'Content-Length' : chunkSize,
        'Content-Type'   : contentType,
        'Cache-Control'  : 'no-store',
      });
      const stream = fs.createReadStream(filePath, { start, end });
      stream.pipe(res);
      console.log(`[206] ${req.url} bytes=${start}-${end}`);
    } else {
      // Respuesta normal
      const headers = {
        'Content-Type'   : contentType,
        'Content-Length' : total,
        'Accept-Ranges'  : 'bytes',
        'Cache-Control'  : isVideo ? 'public, max-age=3600' : 'no-store, no-cache, must-revalidate',
      };
      res.writeHead(200, headers);
      if (req.method === 'HEAD') { res.end(); return; }
      fs.createReadStream(filePath).pipe(res);
      console.log(`[200] ${req.url}`);
    }
  });
});

// Detectar IP local
const interfaces = os.networkInterfaces();
let localIP = 'localhost';
for (const devName in interfaces) {
  for (const alias of interfaces[devName]) {
    if (alias.family === 'IPv4' && !alias.internal) {
      localIP = alias.address; break;
    }
  }
}

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n╔═══════════════════════════════════════╗`);
  console.log(`║   MTG Counter — Servidor Premium       ║`);
  console.log(`╠═══════════════════════════════════════╣`);
  console.log(`║  PC:   http://localhost:${PORT}           ║`);
  console.log(`║  MOVIL: http://${localIP}:${PORT}  ║`);
  console.log(`╚═══════════════════════════════════════╝\n`);
  console.log('✅ Soporte Range requests (video iOS/Android) ACTIVO');
});
