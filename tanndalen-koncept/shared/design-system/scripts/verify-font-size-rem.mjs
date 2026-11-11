/**
 * Ensures font-size CSS vars match px/16 rem conversion (identical computed px at 16px root).
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadJson } from "./verify-helpers.mjs";
import { pxToRem, REM_BASE_PX } from "./generate-css-vars.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const cssPath = join(__dirname, "..", "generated", "tokens.css");

const primitives = loadJson("primitives.json");
const css = readFileSync(cssPath, "utf8");

const errors = [];
const sizeKeys = Object.keys(primitives.font.size);

for (const [key, px] of Object.entries(primitives.font.size)) {
  const wantRem = pxToRem(px);

  const re = new RegExp(`--font-size-${key.replace(".", "\\.")}:\\s*([^;]+);`);
  const match = css.match(re);
  if (!match) {
    errors.push(`Missing --font-size-${key} in generated CSS`);
    continue;
  }
  const actual = match[1].trim();
  if (actual !== wantRem) {
    errors.push(`--font-size-${key}: got ${actual}, want ${wantRem}`);
  }

  const remNum = parseFloat(wantRem);
  const computedPx = remNum * REM_BASE_PX;
  if (computedPx !== px) {
    errors.push(`${key}: ${wantRem} * ${REM_BASE_PX} = ${computedPx}, want ${px}px rendered`);
  }
}

if (!css.includes("html {") || !css.includes("font-size: 100%")) {
  errors.push("generated/tokens.css must include html { font-size: 100%; }");
}

if (errors.length) {
  console.error("verify-font-size-rem failed:\n" + errors.map((e) => `  - ${e}`).join("\n"));
  process.exit(1);
}

console.log(`verify-font-size-rem: OK (${sizeKeys.length} sizes, html 100%, computed px unchanged at 16px root)`);
