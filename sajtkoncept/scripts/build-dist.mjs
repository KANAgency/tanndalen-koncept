/**
 * Build a self-contained static share folder.
 * Usage:
 *   node scripts/build-dist.mjs              → dist/ (TD, legacy)
 *   node scripts/build-dist.mjs --site=td    → dist/td/
 *   node scripts/build-dist.mjs --site=og    → dist/og/
 */

import {
  cpSync,
  existsSync,
  mkdirSync,
  rmSync,
  readdirSync,
  lstatSync,
  copyFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SHARED_JS = resolve(ROOT, "shared/js");
const SHARED_CONFIG = resolve(ROOT, "shared/config");
const DS = resolve(ROOT, "shared/design-system");

const siteArg = (process.argv.find((a) => a.startsWith("--site=")) || "").slice(7);
const SITE = siteArg === "og" || siteArg === "td" ? siteArg : "td";
const DESKTOP = resolve(ROOT, SITE, "desktop");
const OUT = siteArg ? join(ROOT, "dist", SITE) : join(ROOT, "dist");

const SKIP_NAMES = new Set([
  ".git",
  ".cursor",
  ".DS_Store",
  "node_modules",
  "dist",
  "ds",
  "tests",
  "regression",
  "scripts",
  "package.json",
  "package-lock.json",
  "playwright.config.js",
  "playwright.backup.config.js",
  "beslut.md",
  "STRUKTUR.md",
  "shared",
  "test-results",
  "intro-changelog.md",
  ".gitignore",
  "staticwebapp.config.json",
]);

const GENERATED_FILES = [
  "tokens.css",
  "fonts-td.css",
  "fonts-og.css",
  "typography-td.css",
  "typography-og.css",
  "breakpoints.mjs",
];

function die(msg) {
  console.error(msg);
  process.exit(1);
}

function shouldSkipName(name) {
  return SKIP_NAMES.has(name) || /\.bak($|-|\.)/.test(name) || name.endsWith(".bak");
}

function copyTree(srcDir, destDir, { skipName } = {}) {
  mkdirSync(destDir, { recursive: true });
  for (const name of readdirSync(srcDir)) {
    if (skipName?.(name) || name === ".DS_Store") continue;
    if (/\.bak($|-|\.)/.test(name) || name.endsWith(".bak")) continue;
    const from = join(srcDir, name);
    const to = join(destDir, name);
    const st = lstatSync(from);
    if (st.isSymbolicLink()) continue;
    if (st.isDirectory()) {
      copyTree(from, to, { skipName });
    } else if (st.isFile()) {
      copyFileSync(from, to);
    }
  }
}

function refreshTokens() {
  if (!existsSync(join(DS, "package.json"))) {
    console.warn("shared/design-system/package.json saknas — hoppar tokens:css");
    return;
  }
  const result = spawnSync("npm", ["run", "tokens:css"], {
    cwd: DS,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.status !== 0) die("tokens:css misslyckades");
}

function rewriteAbsoluteToRelative(filePath) {
  if (!existsSync(filePath) || !filePath.endsWith(".html") && !filePath.endsWith(".js") && !filePath.endsWith(".css")) {
    return;
  }
  // Dist is served as site root: /ds and /shared stay absolute and work.
}

function main() {
  if (!existsSync(join(DESKTOP, "index.html"))) die(`Saknar index.html i ${DESKTOP}`);
  if (!existsSync(DS)) die(`Saknar design-system: ${DS}`);

  refreshTokens();

  const generatedDir = join(DS, "generated");
  const fontsDir = join(DS, "fonts");
  const componentsDir = join(DS, "components");
  for (const file of GENERATED_FILES) {
    if (!existsSync(join(generatedDir, file))) {
      die(`Saknar ${file} — kör tokens:css i shared/design-system.`);
    }
  }
  if (!existsSync(fontsDir)) die(`Saknar fonts/: ${fontsDir}`);
  if (!existsSync(componentsDir)) die(`Saknar components/: ${componentsDir}`);

  if (existsSync(OUT)) rmSync(OUT, { recursive: true, force: true });
  mkdirSync(OUT, { recursive: true });

  copyTree(DESKTOP, OUT, { skipName: shouldSkipName });
  if (existsSync(SHARED_JS)) copyTree(SHARED_JS, join(OUT, "shared/js"), { skipName: shouldSkipName });
  if (existsSync(SHARED_CONFIG)) {
    copyTree(SHARED_CONFIG, join(OUT, "shared/config"), { skipName: shouldSkipName });
  }

  const dsOut = join(OUT, "ds");
  mkdirSync(join(dsOut, "generated"), { recursive: true });
  for (const file of GENERATED_FILES) {
    copyFileSync(join(generatedDir, file), join(dsOut, "generated", file));
  }
  cpSync(fontsDir, join(dsOut, "fonts"), { recursive: true });
  copyTree(componentsDir, join(dsOut, "components"));

  // Site HTML uses absolute /ds and /shared — fine when dist is served at /.
  void rewriteAbsoluteToRelative;

  console.log(`dist klar → ${OUT} (site=${SITE})`);
  console.log(
    siteArg
      ? `Förhandsvisa:  npm run preview:${SITE}`
      : "Förhandsvisa:  npm run preview  →  http://127.0.0.1:5180/"
  );
}

main();
