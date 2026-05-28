const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 8080;
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
};

const server = http.createServer((req, res) => {
  // Evitar rutas maliciosas fuera del workspace
  let safePath = path.normalize(req.url).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\' || safePath.startsWith('/?')) {
    safePath = '/contador.html';
  }

  const filePath = path.join(__dirname, '..', safePath);
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        console.warn(`[404] No encontrado: ${req.url}`);
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Archivo no encontrado');
      } else {
        console.error(`[500] Error leyendo ${req.url}: ${error.code}`);
        res.writeHead(500);
        res.end('Error interno del servidor: ' + error.code);
      }
    } else {
      console.log(`[200] OK: ${req.url}`);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

// Detectar dirección IP local del ordenador en la red Wi-Fi
const interfaces = os.networkInterfaces();
let localIP = 'localhost';
for (const devName in interfaces) {
  const iface = interfaces[devName];
  for (let i = 0; i < iface.length; i++) {
    const alias = iface[i];
    if (alias.family === 'IPv4' && !alias.internal) {
      localIP = alias.address;
      break;
    }
  }
}

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  SERVIDOR INICIADO: MTG Counter Premium Mobile Test`);
  console.log(`=======================================================`);
  console.log(`\n* En tu ordenador puedes abrir:`);
  console.log(`  http://localhost:${PORT}/`);
  console.log(`\n* Para probar en tu MÓVIL/TABLET:`);
  console.log(`  1. Asegúrate de estar en la misma red Wi-Fi.`);
  console.log(`  2. Abre el navegador de tu móvil e introduce la dirección:`);
  console.log(`     http://${localIP}:${PORT}/`);
  console.log(`\n=======================================================`);
});
