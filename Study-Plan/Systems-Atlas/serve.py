#!/usr/bin/env python3
"""Run the Computer Systems Atlas locally.

    python3 serve.py            # http://localhost:8000
    python3 serve.py 9000       # another port

Serves this folder and wraps index.html in a full HTML document
(index.html holds only the page body, the way the artifact publisher wants it).
Needs only Python 3, no packages. Stop it with Ctrl+C.
"""
import http.server
import os
import socketserver
import sys
import webbrowser

HERE = os.path.dirname(os.path.abspath(__file__))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
HEAD = ('<!doctype html><html lang="en"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
        '<style>body{margin:0}[hidden]{display:none!important}</style></head><body>')
TAIL = '</body></html>'


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=HERE, **kwargs)

    def do_GET(self):
        if self.path.split('?')[0] in ('/', '/index.html'):
            with open(os.path.join(HERE, 'index.html'), encoding='utf-8') as f:
                body = (HEAD + f.read() + TAIL).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        else:
            super().do_GET()

    def log_message(self, fmt, *args):
        pass


socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(('127.0.0.1', PORT), Handler) as httpd:
    url = 'http://localhost:%d/' % PORT
    print('Computer Systems Atlas running at ' + url + '  (Ctrl+C to stop)')
    try:
        webbrowser.open(url)
    except Exception:
        pass
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print('\nStopped.')
