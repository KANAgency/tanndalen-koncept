/**
 * Export a self-contained copy of src/tanndalen-koncept for zip/static hosting.
 * - Does NOT modify tanndalen-koncept/ or the local ds → ../design-system symlink.
 * - Replaces ds/ in the export with generated CSS + fonts/ only.
 * Prefer: npm run build in tanndalen-koncept (writes ./dist).
 *
 * Usage:
 *   node scripts/export-testing-demo.mjs [outDir]
 *   DEMO_EXPORT_DIR=/path npm run demo:export
 *
 * Default outDir: ../export/testing-share (sibling of design-system under src/)
 */

import {
  cpSync,
  existsSync,
  mkdirSync,
  rmSync,
  lstatSync,
  readdirSync,
  copyFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DESIGN_SYSTEM = join(__dirname, "..");
const SRC = join(DESIGN_SYSTEM, "..");
const TESTING = join(SRC, "tanndalen-koncept");
const DEFAULT_OUT = join(SRC, "export", "testing-share");

const GENERATED_FILES = ["tokens.css", "fonts-td.css", "typography-td.css"];

const SKIP_DIR_NAMES = new Set([".git", "node_modules", ".DS_Store", "ds"]);

function die(msg) {
  console.error(msg);
  process.exit(1);
}

function copyTestingTree(srcDir, destDir) {
  mkdirSync(destDir, { recursive: true });
  for (const name of readdirSync(srcDir)) {
    if (SKIP_DIR_NAMES.has(name)) continue;
    const from = join(srcDir, name);
    const to = join(destDir, name);
    const st = lstatSync(from);
    if (st.isSymbolicLink()) {
      // Never follow symlinks from tanndalen-koncept/ (e.g. ds) into the export.
      continue;
    }
    if (st.isDirectory()) {
      copyTestingTree(from, to);
    } else if (st.isFile()) {
      copyFileSync(from, to);
    }
  }
}

function main() {
  const outArg = process.argv[2] || process.env.DEMO_EXPORT_DIR || DEFAULT_OUT;
  const outDir = resolve(outArg);

  if (!existsSync(TESTING)) die(`Missing tanndalen-koncept/: ${TESTING}`);
  const generatedDir = join(DESIGN_SYSTEM, "generated");
  const fontsDir = join(DESIGN_SYSTEM, "fonts");
  for (const file of GENERATED_FILES) {
    if (!existsSync(join(generatedDir, file))) {
      die(`Missing ${file} — run tokens:css first.`);
    }
  }
  if (!existsSync(fontsDir)) die(`Missing fonts/: ${fontsDir}`);

  if (existsSync(outDir)) {
    rmSync(outDir, { recursive: true, force: true });
  }
  mkdirSync(outDir, { recursive: true });

  copyTestingTree(TESTING, outDir);

  const dsOut = join(outDir, "ds");
  const dsGenerated = join(dsOut, "generated");
  const dsFonts = join(dsOut, "fonts");
  mkdirSync(dsGenerated, { recursive: true });
  mkdirSync(dsFonts, { recursive: true });

  for (const file of GENERATED_FILES) {
    copyFileSync(join(generatedDir, file), join(dsGenerated, file));
  }
  cpSync(fontsDir, dsFonts, { recursive: true });

  console.log(`Exported self-contained demo → ${outDir}`);
  console.log("Serve:  cd that folder && python3 -m http.server 8000");
  console.log("Paths:  ds/generated/{tokens,fonts-td,typography-td}.css + ds/fonts/");
}

main();
