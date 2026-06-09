import os
import re
import sys
import mimetypes
import urllib.parse
from http.server import SimpleHTTPRequestHandler, HTTPServer

PORT = 8000

# Asegurar tipos MIME correctos para vídeo y assets modernos
mimetypes.add_type('video/mp4', '.mp4')
mimetypes.add_type('video/webm', '.webm')
mimetypes.add_type('image/webp', '.webp')
mimetypes.add_type('audio/mpeg', '.mp3')


class MTGStaticHandler(SimpleHTTPRequestHandler):
    """Servidor estático con soporte HTTP Range Requests (HTTP 206).

    Necesario para que <video> en iOS Safari pueda buscar/reproducir vídeos.
    """

    def do_GET(self):
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path

        # Dejar que index.html maneje la limpieza de caché en el cliente
        pass

        range_header = self.headers.get('Range')
        if range_header:
            self._serve_range(range_header)
        else:
            super().do_GET()

    def _serve_range(self, range_header):
        path = self.translate_path(self.path)
        if not os.path.isfile(path):
            self.send_error(404, "File not found")
            return

        file_size = os.path.getsize(path)
        match = re.match(r'bytes=(\d*)-(\d*)', range_header.strip())
        if not match:
            self.send_error(416, "Invalid Range header")
            return

        start_str, end_str = match.group(1), match.group(2)
        if start_str == '' and end_str == '':
            self.send_error(416, "Invalid Range header")
            return

        if start_str == '':
            # Sufijo: últimos N bytes
            length = int(end_str)
            start = max(0, file_size - length)
            end = file_size - 1
        else:
            start = int(start_str)
            end = int(end_str) if end_str else file_size - 1

        if start >= file_size or end >= file_size or start > end:
            self.send_response(416)
            self.send_header('Content-Range', f'bytes */{file_size}')
            self.end_headers()
            return

        length = end - start + 1
        ctype = self.guess_type(path)

        self.send_response(206)
        self.send_header('Content-Type', ctype)
        self.send_header('Accept-Ranges', 'bytes')
        self.send_header('Content-Range', f'bytes {start}-{end}/{file_size}')
        self.send_header('Content-Length', str(length))
        self.end_headers()

        try:
            with open(path, 'rb') as f:
                f.seek(start)
                remaining = length
                chunk_size = 64 * 1024
                while remaining > 0:
                    chunk = f.read(min(chunk_size, remaining))
                    if not chunk:
                        break
                    self.wfile.write(chunk)
                    remaining -= len(chunk)
        except (ConnectionResetError, BrokenPipeError, ConnectionAbortedError):
            # Conexión cerrada abruptamente por el cliente (común en iOS al pausar/desplazar vídeo/audio)
            pass
        except OSError as e:
            # Capturar errores específicos de sockets en Windows (WSAECONNRESET/WSAECONNABORTED)
            if getattr(e, 'winerror', None) in (10053, 10054):
                pass
            else:
                raise

    def end_headers(self):
        # Anunciar siempre soporte de Range para que iOS Safari lo intente
        self.send_header('Accept-Ranges', 'bytes')
        super().end_headers()


def run_server():
    # Asegurar que el directorio de trabajo es el de este script
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, MTGStaticHandler)
    print(f"Servidor estático de MTG ejecutándose en el puerto {PORT}...")
    print(f"Accede en tu ordenador: http://localhost:{PORT}")

    # Intentar obtener la IP local para mostrar el enlace de móvil
    try:
        import socket
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()
        print(f"Accede en tu móvil:    http://{local_ip}:{PORT}")
    except Exception:
        pass

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nDeteniendo servidor...")
        httpd.server_close()


if __name__ == '__main__':
    run_server()
