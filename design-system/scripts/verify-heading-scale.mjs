/**
 * Locks the shared heading scale (Figma ↔ code).
 * Sizes px + line-height must match the approved scale.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TOKENS = join(ROOT, "tokens");

/** @param {string} name */
function loadJson(name) {
  return JSON.parse(readFileSync(join(TOKENS, name), "utf8"));
}

/** Expected heading steps: size key → [px, line-height] */
const HEADING_SCALE = {
  "heading-xxxl": { sizeKey: "112", px: 112, leading: 1.1 },
  "heading-xxxl-regular": { sizeKey: "112", px: 112, leading: 1.1 },
  "heading-xxl": { sizeKey: "88", px: 88, leading: 1.1 },
  "heading-xxl-regular": { sizeKey: "88", px: 88, leading: 1.1 },
  "heading-xl": { sizeKey: "5xl", px: 60, leading: 1.1 },
  "heading-xl-regular": { sizeKey: "5xl", px: 60, leading: 1.1 },
  "heading-lg": { sizeKey: "4xl", px: 48, leading: 1.1 },
  "heading-lg-regular": { sizeKey: "4xl", px: 48, leading: 1.1 },
  "heading-md": { sizeKey: "3xl", px: 36, leading: 1.15 },
  "heading-md-regular": { sizeKey: "3xl", px: 36, leading: 1.15 },
  "heading-sm": { sizeKey: "32", px: 32, leading: 1.15 },
  "heading-sm-regular": { sizeKey: "32", px: 32, leading: 1.15 },
  "heading-xs": { sizeKey: "xl", px: 24, leading: 1.2 },
  "heading-xs-regular": { sizeKey: "xl", px: 24, leading: 1.2 },
  "heading-xxs": { sizeKey: "lg", px: 20, leading: 1.3 },
  "heading-xxs-regular": { sizeKey: "lg", px: 20, leading: 1.3 },
  "heading-xxxs": { sizeKey: "base", px: 16, leading: 1.4 },
  "heading-xxxs-regular": { sizeKey: "base", px: 16, leading: 1.4 },
};

const EXPECTED_PX = [112, 88, 60, 48, 36, 32, 24, 20, 16];

function main() {
  const primitives = loadJson("primitives.json");
  const styles = loadJson("typography-styles-tanndalen.json");
  const sizes = primitives.font.size;
  const errors = [];

  if (sizes["7xl"] != null) {
    errors.push("font.size.7xl must be removed (was 96)");
  }

  for (const px of EXPECTED_PX) {
    const hit = Object.entries(sizes).find(([, v]) => v === px);
    if (!hit) errors.push(`Missing font.size entry for ${px}px`);
  }

  for (const [name, expect] of Object.entries(HEADING_SCALE)) {
    const def = styles[name];
    if (!def || def.alias) {
      errors.push(`Missing style ${name}`);
      continue;
    }
    if (def.size !== expect.sizeKey) {
      errors.push(`${name}.size: got ${def.size}, want ${expect.sizeKey}`);
    }
    if (def.leading !== expect.leading) {
      errors.push(`${name}.leading: got ${def.leading}, want ${expect.leading}`);
    }
    if (sizes[expect.sizeKey] !== expect.px) {
      errors.push(
        `font.size.${expect.sizeKey}: got ${sizes[expect.sizeKey]}, want ${expect.px}`
      );
    }
  }

  const tokensCss = readFileSync(join(ROOT, "generated/tokens.css"), "utf8");
  if (tokensCss.includes("--font-size-7xl")) {
    errors.push("generated/tokens.css still has --font-size-7xl");
  }
  if (!tokensCss.includes("--font-size-88: 5.5rem")) {
    errors.push("generated/tokens.css missing --font-size-88: 5.5rem");
  }
  if (!tokensCss.includes("--font-size-112: 7rem")) {
    errors.push("generated/tokens.css missing --font-size-112: 7rem");
  }

  if (errors.length) {
    console.error("verify-heading-scale: FAIL");
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }
  console.log(
    `verify-heading-scale: OK (${EXPECTED_PX.join("/")} + leadings)`
  );
}

main();
