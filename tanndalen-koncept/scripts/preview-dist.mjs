/**
 * Serve ./dist over HTTP. ES modules do not load via file:// in Chrome.
 * Usage: npm run preview
 */

import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn, spawnSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = join(ROOT, "dist");
const PORT = Number(process.env.PORT) || 5180;

if (!existsSync(join(DIST, "index.html"))) {
  console.log("dist/ saknas — kör build först…");
  const built = spawnSync("npm", ["run", "build"], {
    cwd: ROOT,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (built.status !== 0) process.exit(built.status ?? 1);
}

console.log(`dist/ på http://127.0.0.1:${PORT}/`);
console.log("Öppna den URL:en — inte filen i Finder (file:// bryter ES-moduler).");

const child = spawn("python3", [join(ROOT, "scripts", "dev-server.py"), String(PORT)], {
  cwd: DIST,
  stdio: "inherit",
});

child.on("exit", (code) => process.exit(code ?? 0));
