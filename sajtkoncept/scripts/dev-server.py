#!/usr/bin/env python3
"""Local static server with path maps. Cache-Control: no-cache.

  /td/      → td/desktop/
  /og/      → og/desktop/
  /ds/      → shared/design-system/
  /shared/  → shared/   (js/, config/; not design-system — use /ds)
  /         → project root (sidväljare i etapp 4)
"""
from __future__ import annotations

import os
import re
import socket
import sys
from pathlib import Path
from urllib.parse import unquote, urlparse
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = Path(__file__).resolve().parent.parent
TD = ROOT / "td" / "desktop"
OG = ROOT / "og" / "desktop"
SHARED = ROOT / "shared"
DS = SHARED / "design-system"


def _under(root: Path, rest: str) -> Path:
    target = (root / rest).resolve()
    root_res = root.resolve()
    if target != root_res and root_res not in target.parents:
        raise PermissionError(f"path escapes root: {rest}")
    return target


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache")
        self.send_header("Accept-Ranges", "bytes")
        super().end_headers()

    # iOS Safari spelar bara video om servern svarar 206 på Range-anrop.
    def send_head(self):
        rng = self.headers.get("Range")
        m = re.fullmatch(r"bytes=(\d*)-(\d*)", rng.strip()) if rng else None
        if not m:
            return super().send_head()
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            return super().send_head()
        try:
            f = open(path, "rb")
        except OSError:
            self.send_error(404, "File not found")
            return None
        size = os.fstat(f.fileno()).st_size
        a, b = m.groups()
        if a == "":
            start, end = max(0, size - int(b or 0)), size - 1
        else:
            start, end = int(a), min(int(b) if b else size - 1, size - 1)
        if start >= size or start > end:
            f.close()
            self.send_response(416)
            self.send_header("Content-Range", f"bytes */{size}")
            self.end_headers()
            return None
        self.send_response(206)
        self.send_header("Content-Type", self.guess_type(path))
        self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
        self.send_header("Content-Length", str(end - start + 1))
        self.end_headers()
        f.seek(start)
        self._range_left = end - start + 1
        return f

    def copyfile(self, source, outputfile):
        left = getattr(self, "_range_left", None)
        if left is None:
            return super().copyfile(source, outputfile)
        self._range_left = None
        while left > 0:
            chunk = source.read(min(64 * 1024, left))
            if not chunk:
                break
            outputfile.write(chunk)
            left -= len(chunk)

    # Webbläsaren avbryter videoladdningar hela tiden: inget att logga.
    def handle(self):
        try:
            super().handle()
        except (BrokenPipeError, ConnectionResetError):
            pass

    def translate_path(self, path: str) -> str:
        raw = unquote(urlparse(path).path)
        try:
            for prefix, site in (("/td", TD), ("/og", OG)):
                if raw == prefix or raw.startswith(prefix + "/"):
                    rest = "" if raw in (prefix, prefix + "/") else raw[len(prefix) + 1 :]
                    if rest == "ds" or rest.startswith("ds/"):
                        ds_rest = "" if rest == "ds" else rest[len("ds/") :]
                        return str(_under(DS, ds_rest))
                    if rest == "shared" or rest.startswith("shared/"):
                        sh_rest = "" if rest == "shared" else rest[len("shared/") :]
                        return str(_under(SHARED, sh_rest))
                    return str(_under(site, rest))
            if raw == "/ds" or raw.startswith("/ds/"):
                rest = "" if raw in ("/ds", "/ds/") else raw[len("/ds/") :]
                return str(_under(DS, rest))
            if raw == "/shared" or raw.startswith("/shared/"):
                rest = "" if raw in ("/shared", "/shared/") else raw[len("/shared/") :]
                return str(_under(SHARED, rest))
        except PermissionError:
            return str(ROOT / "__denied__")
        return super().translate_path(path)


def _lan_ip() -> str:
    """Macens adress på det lokala nätet (inget skickas: UDP-connect väljer bara gränssnitt)."""
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("10.255.255.255", 1))
        return s.getsockname()[0]
    except OSError:
        return "127.0.0.1"
    finally:
        s.close()


def main() -> None:
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    lan = "--lan" in sys.argv[1:]
    port = int(args[0]) if args else 4173
    host = "0.0.0.0" if lan else "127.0.0.1"
    print(f"Serving {ROOT} on http://127.0.0.1:{port}/")
    if lan:
        print(f"  LAN (telefon på samma Wi-Fi): http://{_lan_ip()}:{port}/td/?mode=new")
    print(f"  /td/ → {TD}")
    print(f"  /og/ → {OG}")
    print(f"  /ds/ → {DS}")
    print(f"  /shared/ → {SHARED}")
    ThreadingHTTPServer((host, port), Handler).serve_forever()


if __name__ == "__main__":
    main()
