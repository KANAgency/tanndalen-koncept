#!/usr/bin/env python3
"""Local static server with path maps. Cache-Control: no-cache.

Maps (etapp 1+; physical layout may still be legacy under koncept/sites):
  /td/      → koncept/sites/td/desktop/   (later: td/desktop/)
  /og/      → koncept/sites/og/desktop/   (later: og/desktop/)
  /ds/      → ../design-system/           (later: shared/design-system/)
  /shared/  → koncept/shared/            (later: shared/)
  /         → cwd (legacy TD skyltar until etapp 2)
"""
from __future__ import annotations

import sys
from pathlib import Path
from urllib.parse import unquote, urlparse
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = Path(__file__).resolve().parent.parent
REPO_SRC = ROOT.parent

# Prefer post-move layout; fall back to legacy koncept/sites paths.
TD = ROOT / "td" / "desktop"
OG = ROOT / "og" / "desktop"
SHARED = ROOT / "shared"
DS = SHARED / "design-system"

if not TD.is_dir():
    TD = ROOT / "koncept" / "sites" / "td" / "desktop"
if not OG.is_dir():
    OG = ROOT / "koncept" / "sites" / "og" / "desktop"
if not (SHARED / "js").is_dir() and (ROOT / "koncept" / "shared").is_dir():
    SHARED = ROOT / "koncept" / "shared"
if not DS.is_dir():
    DS = REPO_SRC / "design-system"


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
        super().end_headers()

    def translate_path(self, path: str) -> str:
        raw = unquote(urlparse(path).path)
        try:
            # Site-relative ds/shared (href="ds/…") resolve under /td/ or /og/ until
            # HTML uses absolute /ds and /shared (etapp 2). Symlinks inside desktop
            # point outside the site root — map those prefixes explicitly.
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


def main() -> None:
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 4173
    print(f"Serving {ROOT} on http://127.0.0.1:{port}/")
    print(f"  /td/ → {TD}")
    print(f"  /og/ → {OG}")
    print(f"  /ds/ → {DS}")
    print(f"  /shared/ → {SHARED}")
    ThreadingHTTPServer(("127.0.0.1", port), Handler).serve_forever()


if __name__ == "__main__":
    main()
