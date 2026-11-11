/**
 * Serve a built dist over HTTP.
 * Usage:
 *   npm run preview           → dist/ on :5180
 *   npm run preview:td        → dist/td/ on :5181
 *   npm run preview:og        → dist/og/ on :5182
 */

import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn, spawnSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const siteArg = (process.argv.find((a) => a.startsWith("--site=")) || "").slice(7);
const SITE = siteArg === "og" || siteArg === "td" ? siteArg : "";
const DIST = SITE ? join(ROOT, "dist", SITE) : join(ROOT, "dist");
const PORT = Number(process.env.PORT) || (SITE === "og" ? 5182 : SITE === "td" ? 5181 : 5180);
const BUILD = SITE ? `build:${SITE}` : "build";

if (!existsSync(join(DIST, "index.html"))) {
  console.log(`${DIST} saknas — kör ${BUILD} först…`);
  const built = spawnSync("npm", ["run", BUILD], {
    cwd: ROOT,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (built.status !== 0) process.exit(built.status ?? 1);
}

console.log(`Serving ${DIST} on http://127.0.0.1:${PORT}/`);
console.log("Öppna den URL:en — inte filen i Finder (file:// bryter ES-moduler).");

/* Dist is self-contained (ds/ + shared/ as real folders); plain static server is enough. */
const child = spawn(
  "python3",
  ["-c", `
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import os
os.chdir(${JSON.stringify(DIST)})
class H(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()
ThreadingHTTPServer(("127.0.0.1", ${PORT}), H).serve_forever()
`],
  { stdio: "inherit" }
);

child.on("exit", (code) => process.exit(code ?? 0));
