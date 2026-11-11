/**
 * Build a self-contained static share folder at ./dist
 * — prototype runtime + materialized design-system (no symlink).
 *
 * Usage: npm run build
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
const DESKTOP = resolve(ROOT, "koncept/sites/td/desktop");
const SHARED = resolve(ROOT, "koncept/shared");
const OUT = join(ROOT, "dist");
const DS = resolve(ROOT, "..", "design-system");

const SKIP_ROOT_NAMES = new Set([
  ".git",
  ".cursor",
  ".DS_Store",
  "node_modules",
  "dist",
  "ds",
  "tests",
  "scripts",
  "package.json",
  "package-lock.json",
  "playwright.config.js",
  "beslut.md",
  "koncept",
  "shared",
  "test-results",
  "intro-changelog.md",
  ".gitignore",
]);

const GENERATED_FILES = ["tokens.css", "fonts-td.css", "typography-td.css", "breakpoints.mjs"];

function die(msg) {
  console.error(msg);
  process.exit(1);
}

function shouldSkipName(name) {
  return SKIP_ROOT_NAMES.has(name) || /\.bak($|-|\.)/.test(name) || name.endsWith(".bak");
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
    console.warn("design-system/package.json saknas — hoppar tokens:css");
    return;
  }
  const result = spawnSync("npm", ["run", "tokens:css"], {
    cwd: DS,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.status !== 0) die("tokens:css misslyckades");
}

function main() {
  if (!existsSync(join(ROOT, "index.html"))) die(`Saknar index.html i ${ROOT}`);
  if (!existsSync(DS)) die(`Saknar design-system: ${DS}`);

  refreshTokens();

  const generatedDir = join(DS, "generated");
  const fontsDir = join(DS, "fonts");
  const componentsDir = join(DS, "components");
  for (const file of GENERATED_FILES) {
    if (!existsSync(join(generatedDir, file))) {
      die(`Saknar ${file} — kör tokens:css i design-system.`);
    }
  }
  if (!existsSync(fontsDir)) die(`Saknar fonts/: ${fontsDir}`);
  if (!existsSync(componentsDir)) die(`Saknar components/: ${componentsDir}`);

  if (existsSync(OUT)) rmSync(OUT, { recursive: true, force: true });
  mkdirSync(OUT, { recursive: true });

  copyTree(DESKTOP, OUT, { skipName: shouldSkipName });
  copyTree(SHARED, join(OUT, "shared"), { skipName: shouldSkipName });

  const dsOut = join(OUT, "ds");
  mkdirSync(join(dsOut, "generated"), { recursive: true });
  for (const file of GENERATED_FILES) {
    copyFileSync(join(generatedDir, file), join(dsOut, "generated", file));
  }
  cpSync(fontsDir, join(dsOut, "fonts"), { recursive: true });
  copyTree(componentsDir, join(dsOut, "components"));

  console.log(`dist/ klar → ${OUT}`);
  console.log("Förhandsvisa:  npm run preview  →  http://127.0.0.1:5180/");
  console.log("Öppna inte index.html via Finder (file:// blockerar ES-moduler i Chrome).");
}

main();
