/**
 * Build static share folders.
 * Usage:
 *   node scripts/build-dist.mjs              → dist/ hub (/ + /td/ + /og/ + /ds + /shared)
 *   node scripts/build-dist.mjs --site=td    → dist/td/ (self-contained, for preview:td)
 *   node scripts/build-dist.mjs --site=og    → dist/og/ (self-contained, for preview:og)
 *
 * Hub mirrors local URL:er (dev-server): absolute /ds and /shared stay at site root.
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
const HUB = siteArg !== "og" && siteArg !== "td";
const SITE = HUB ? null : siteArg;
const OUT = HUB ? join(ROOT, "dist") : join(ROOT, "dist", SITE);

const SKIP_NAMES = new Set([
  ".git",
  ".cursor",
  ".claude",
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

function assertGenerated() {
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
  return { generatedDir, fontsDir, componentsDir };
}

function materializeDsShared(outRoot, { generatedDir, fontsDir, componentsDir }) {
  if (existsSync(SHARED_JS)) copyTree(SHARED_JS, join(outRoot, "shared/js"), { skipName: shouldSkipName });
  if (existsSync(SHARED_CONFIG)) {
    copyTree(SHARED_CONFIG, join(outRoot, "shared/config"), { skipName: shouldSkipName });
  }

  const dsOut = join(outRoot, "ds");
  mkdirSync(join(dsOut, "generated"), { recursive: true });
  for (const file of GENERATED_FILES) {
    copyFileSync(join(generatedDir, file), join(dsOut, "generated", file));
  }
  cpSync(fontsDir, join(dsOut, "fonts"), { recursive: true });
  copyTree(componentsDir, join(dsOut, "components"));
}

function copySiteDesktop(site, dest) {
  const desktop = resolve(ROOT, site, "desktop");
  if (!existsSync(join(desktop, "index.html"))) die(`Saknar index.html i ${desktop}`);
  copyTree(desktop, dest, { skipName: shouldSkipName });
}

function buildHub(paths) {
  if (existsSync(OUT)) rmSync(OUT, { recursive: true, force: true });
  mkdirSync(OUT, { recursive: true });

  const selector = join(ROOT, "index.html");
  if (!existsSync(selector)) die(`Saknar sidväljare: ${selector}`);
  copyFileSync(selector, join(OUT, "index.html"));

  const swa = join(ROOT, "staticwebapp.config.json");
  if (existsSync(swa)) copyFileSync(swa, join(OUT, "staticwebapp.config.json"));

  copySiteDesktop("td", join(OUT, "td"));
  copySiteDesktop("og", join(OUT, "og"));
  materializeDsShared(OUT, paths);

  console.log(`dist klar → ${OUT} (hub: / /td/ /og/)`);
  console.log("Förhandsvisa:  npm run preview  →  http://127.0.0.1:5180/");
}

function buildSite(paths) {
  const desktop = resolve(ROOT, SITE, "desktop");
  if (!existsSync(join(desktop, "index.html"))) die(`Saknar index.html i ${desktop}`);

  if (existsSync(OUT)) rmSync(OUT, { recursive: true, force: true });
  mkdirSync(OUT, { recursive: true });

  copyTree(desktop, OUT, { skipName: shouldSkipName });
  materializeDsShared(OUT, paths);

  console.log(`dist klar → ${OUT} (site=${SITE})`);
  console.log(`Förhandsvisa:  npm run preview:${SITE}`);
}

function main() {
  if (!existsSync(DS)) die(`Saknar design-system: ${DS}`);

  refreshTokens();
  const paths = assertGenerated();

  if (HUB) buildHub(paths);
  else buildSite(paths);
}

main();
