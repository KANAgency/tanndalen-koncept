#!/usr/bin/env python3
"""Local static server. Sends Cache-Control: no-cache so dev assets are not reused."""
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()

port = int(sys.argv[1]) if len(sys.argv) > 1 else 4173
ThreadingHTTPServer(("127.0.0.1", port), Handler).serve_forever()
