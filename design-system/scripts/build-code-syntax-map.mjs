/**
 * Builds tokens/code-syntax-map.json + code-syntax-figma.json from
 * live Figma variable list (embedded) + generated/tokens.css.
 * TD-only. Re-run after generate-css-vars.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const TOKENS = join(ROOT, "tokens");
const CSS_PATH = join(ROOT, "generated", "tokens.css");

/** Live TD dump 2026-10-02 (126 vars). radius/xs kept here until deleted in Figma — map omits if absent in CSS. */
const FIGMA_VARS = [
  { name: "bp/lg", collection: "Shared / Primitives" },
  { name: "bp/md", collection: "Shared / Primitives" },
  { name: "bp/sm", collection: "Shared / Primitives" },
  { name: "color/accent", collection: "Semantic" },
  { name: "color/accent", collection: "Shared / Primitives" },
  { name: "color/bg-base", collection: "Semantic" },
  { name: "color/bg-inverted", collection: "Semantic" },
  { name: "color/bg-overlay", collection: "Semantic" },
  { name: "color/cta", collection: "Shared / Primitives" },
  { name: "color/cta-on-dark", collection: "Semantic" },
  { name: "color/cta-primary", collection: "Semantic" },
  { name: "color/day", collection: "Shared / Primitives" },
  { name: "color/error", collection: "Semantic" },
  { name: "color/error", collection: "Shared / Primitives" },
  { name: "color/frost", collection: "Semantic" },
  { name: "color/frost-active", collection: "Semantic" },
  { name: "color/frost-hover", collection: "Semantic" },
  { name: "color/neutral", collection: "Shared / Primitives" },
  { name: "color/neutral-muted", collection: "Shared / Primitives" },
  { name: "color/neutral-strong", collection: "Shared / Primitives" },
  { name: "color/neutral-subtle", collection: "Shared / Primitives" },
  { name: "color/neutral-highlight", collection: "Shared / Primitives" },
  { name: "color/neutral-subtlest", collection: "Shared / Primitives" },
  { name: "color/night", collection: "Shared / Primitives" },
  { name: "color/on-error", collection: "Semantic" },
  { name: "color/on-error", collection: "Shared / Primitives" },
  { name: "color/season-autumn", collection: "Semantic" },
  { name: "color/season-autumn", collection: "Shared / Primitives" },
  { name: "color/season-spring", collection: "Semantic" },
  { name: "color/season-spring", collection: "Shared / Primitives" },
  { name: "color/season-summer", collection: "Semantic" },
  { name: "color/season-summer", collection: "Shared / Primitives" },
  { name: "color/season-winter", collection: "Semantic" },
  { name: "color/season-winter", collection: "Shared / Primitives" },
  { name: "color/snow", collection: "Shared / Primitives" },
  { name: "color/status/error-dark", collection: "Shared / Primitives" },
  { name: "color/status/success", collection: "Shared / Primitives" },
  { name: "color/status/success-dark", collection: "Shared / Primitives" },
  { name: "color/status/warning", collection: "Shared / Primitives" },
  { name: "color/status/warning-dark", collection: "Shared / Primitives" },
  { name: "color/text-inverted", collection: "Semantic" },
  { name: "color/text-primary", collection: "Semantic" },
  { name: "contrast/on-accent", collection: "Semantic" },
  { name: "contrast/on-cta", collection: "Semantic" },
  { name: "contrast/on-cta-on-dark", collection: "Semantic" },
  { name: "contrast/on-day", collection: "Semantic" },
  { name: "contrast/on-night", collection: "Semantic" },
  { name: "contrast/on-season-autumn", collection: "Semantic" },
  { name: "contrast/on-season-spring", collection: "Semantic" },
  { name: "contrast/on-season-summer", collection: "Semantic" },
  { name: "contrast/on-season-winter", collection: "Semantic" },
  { name: "contrast/on-snow", collection: "Semantic" },
  { name: "font/family/TD/primary", collection: "Shared / Primitives" },
  { name: "font/family/TD/secondary", collection: "Shared / Primitives" },
  { name: "font/leading/normal", collection: "Shared / Primitives" },
  { name: "font/leading/relaxed", collection: "Shared / Primitives" },
  { name: "font/leading/snug", collection: "Shared / Primitives" },
  { name: "font/leading/tight", collection: "Shared / Primitives" },
  { name: "font/leading/title", collection: "Shared / Primitives" },
  { name: "font/size/2xl", collection: "Shared / Primitives" },
  { name: "font/size/3xl", collection: "Shared / Primitives" },
  { name: "font/size/4xl", collection: "Shared / Primitives" },
  { name: "font/size/5xl", collection: "Shared / Primitives" },
  { name: "font/size/6xl", collection: "Shared / Primitives" },
  { name: "font/size/88", collection: "Shared / Primitives" },
  { name: "font/size/112", collection: "Shared / Primitives" },
  { name: "font/size/base", collection: "Shared / Primitives" },
  { name: "font/size/lg", collection: "Shared / Primitives" },
  { name: "font/size/md", collection: "Shared / Primitives" },
  { name: "font/size/sm", collection: "Shared / Primitives" },
  { name: "font/size/xl", collection: "Shared / Primitives" },
  { name: "font/size/xs", collection: "Shared / Primitives" },
  { name: "font/style/primary/bold", collection: "Shared / Primitives" },
  { name: "font/style/primary/regular", collection: "Shared / Primitives" },
  { name: "font/style/secondary/bold", collection: "Shared / Primitives" },
  { name: "font/style/secondary/regular", collection: "Shared / Primitives" },
  { name: "font/tracking/compressed", collection: "Shared / Primitives" },
  { name: "font/tracking/fine", collection: "Shared / Primitives" },
  { name: "font/tracking/normal", collection: "Shared / Primitives" },
  { name: "font/tracking/snug", collection: "Shared / Primitives" },
  { name: "font/tracking/tight", collection: "Shared / Primitives" },
  { name: "font/tracking/tighter", collection: "Shared / Primitives" },
  { name: "font/tracking/tightest", collection: "Shared / Primitives" },
  { name: "font/tracking/wide", collection: "Shared / Primitives" },
  { name: "motion/duration-fast", collection: "Shared / Primitives" },
  { name: "motion/duration-normal", collection: "Shared / Primitives" },
  { name: "motion/duration-slow", collection: "Shared / Primitives" },
  { name: "motion/easing-standard", collection: "Shared / Primitives" },
  { name: "opacity/disabled", collection: "Semantic" },
  { name: "radius/full", collection: "Shared / Primitives" },
  { name: "radius/lg", collection: "Shared / Primitives" },
  { name: "radius/md", collection: "Shared / Primitives" },
  { name: "radius/sm", collection: "Shared / Primitives" },
  { name: "size/control-lg", collection: "Shared / Primitives" },
  { name: "size/control-md", collection: "Shared / Primitives" },
  { name: "size/control-sm", collection: "Shared / Primitives" },
  { name: "size/control-xs", collection: "Shared / Primitives" },
  { name: "space-2xl", collection: "Spacing" },
  { name: "space-3xl", collection: "Spacing" },
  { name: "space-4xl", collection: "Spacing" },
  { name: "space-5xl", collection: "Spacing" },
  { name: "space-6xl", collection: "Spacing" },
  { name: "space-7xl", collection: "Spacing" },
  { name: "space-8xl", collection: "Spacing" },
  { name: "space-lg", collection: "Spacing" },
  { name: "space-md", collection: "Spacing" },
  { name: "space-sm", collection: "Spacing" },
  { name: "space-xl", collection: "Spacing" },
  { name: "space-xs", collection: "Spacing" },
  { name: "status-closed", collection: "Semantic" },
  { name: "status-closed-dark", collection: "Semantic" },
  { name: "status-error", collection: "Semantic" },
  { name: "status-error-dark", collection: "Semantic" },
  { name: "status-limited", collection: "Semantic" },
  { name: "status-limited-dark", collection: "Semantic" },
  { name: "status-open", collection: "Semantic" },
  { name: "status-open-dark", collection: "Semantic" },
  { name: "stroke/0-5", collection: "Shared / Primitives" },
  { name: "stroke/1", collection: "Shared / Primitives" },
  { name: "stroke/1-5", collection: "Shared / Primitives" },
  { name: "stroke/2", collection: "Shared / Primitives" },
  { name: "stroke/2-5", collection: "Shared / Primitives" },
  { name: "stroke/3", collection: "Shared / Primitives" },
  { name: "z/base", collection: "Shared / Primitives" },
  { name: "z/dropdown", collection: "Shared / Primitives" },
  { name: "z/modal", collection: "Shared / Primitives" },
  { name: "z/sticky", collection: "Shared / Primitives" },
  { name: "z/toast", collection: "Shared / Primitives" },
];

function loadJson(name) {
  return JSON.parse(readFileSync(join(TOKENS, name), "utf8"));
}

function props(blockText) {
  return Object.fromEntries(
    [...blockText.matchAll(/(--[a-zA-Z0-9-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]),
  );
}

function block(css, selector) {
  const m = css.match(new RegExp(`${selector.replace(".", "\\.")} \\{(.*?)\\n\\}`, "s"));
  return m ? m[1] : "";
}

function hasCss(root, td, name) {
  return name in root || name in td;
}

function mapFigmaToCss(name, collection, root, td, tdPalette, sharedColors) {
  if (name.startsWith("bp/")) return null;
  if (name.startsWith("font/style/")) return null;

  if (name.startsWith("space-")) {
    const css = `--${name}`;
    return hasCss(root, td, css) ? { css, emittedIn: ".theme-TD" } : null;
  }
  if (name.startsWith("radius/")) {
    const css = `--radius-${name.slice("radius/".length)}`;
    return hasCss(root, td, css) ? { css, emittedIn: ":root" } : null;
  }
  if (name.startsWith("z/")) {
    const css = `--z-${name.slice("z/".length)}`;
    return hasCss(root, td, css) ? { css, emittedIn: ":root" } : null;
  }
  if (name.startsWith("size/")) {
    const css = `--size-${name.slice("size/".length)}`;
    return hasCss(root, td, css) ? { css, emittedIn: ":root" } : null;
  }
  if (name.startsWith("opacity/")) {
    const css = `--opacity-${name.slice("opacity/".length)}`;
    return hasCss(root, td, css) ? { css, emittedIn: ":root" } : null;
  }
  if (name.startsWith("stroke/")) {
    const css = `--stroke-${name.slice("stroke/".length)}`;
    return hasCss(root, td, css) ? { css, emittedIn: ":root" } : null;
  }
  if (name.startsWith("motion/")) {
    const css = `--motion-${name.slice("motion/".length)}`;
    return hasCss(root, td, css) ? { css, emittedIn: ":root" } : null;
  }
  if (name.startsWith("font/size/")) {
    const css = `--font-size-${name.slice("font/size/".length)}`;
    return hasCss(root, td, css) ? { css, emittedIn: ":root" } : null;
  }
  if (name.startsWith("font/leading/")) {
    const css = `--font-leading-${name.slice("font/leading/".length)}`;
    return hasCss(root, td, css) ? { css, emittedIn: ":root" } : null;
  }
  if (name.startsWith("font/tracking/")) {
    const css = `--font-tracking-${name.slice("font/tracking/".length)}`;
    return hasCss(root, td, css) ? { css, emittedIn: ":root" } : null;
  }
  if (name.startsWith("font/family/TD/")) {
    const css = `--font-family-TD-${name.split("/").pop()}`;
    return hasCss(root, td, css) ? { css, emittedIn: ":root" } : null;
  }
  if (name.startsWith("contrast/")) {
    const css = `--contrast-${name.slice("contrast/".length)}`;
    return hasCss(root, td, css) ? { css, emittedIn: ".theme-TD" } : null;
  }
  if (name.startsWith("status-")) {
    const css = `--status-${name.slice("status-".length)}`;
    return hasCss(root, td, css) ? { css, emittedIn: ".theme-TD" } : null;
  }
  if (name.startsWith("color/status/")) {
    const css = `--color-status-${name.slice("color/status/".length)}`;
    return hasCss(root, td, css) ? { css, emittedIn: ":root" } : null;
  }
  if (name.startsWith("color/") && collection === "Semantic") {
    const css = `--color-${name.slice("color/".length)}`;
    return hasCss(root, td, css) ? { css, emittedIn: ".theme-TD" } : null;
  }
  if (name.startsWith("color/") && collection === "Shared / Primitives") {
    const token = name.slice("color/".length);
    if (tdPalette.has(token)) {
      const css = `--color-TD-${token}`;
      return hasCss(root, td, css) ? { css, emittedIn: ":root" } : null;
    }
    if (sharedColors.has(token)) {
      const css = `--color-shared-${token}`;
      return hasCss(root, td, css) ? { css, emittedIn: ":root" } : null;
    }
  }
  return null;
}

function reasonFor(name) {
  if (name.startsWith("bp/")) return "bp/* — referens only; CSS vars invalid in @media";
  if (name.startsWith("font/style/")) return "Figma STRING style name; CSS uses --font-weight-*";
  return "not emitted by generate-css-vars.mjs";
}

function main() {
  const css = readFileSync(CSS_PATH, "utf8");
  const primitives = loadJson("primitives.json");
  const root = props(block(css, ":root"));
  const td = props(block(css, ".theme-TD"));

  const tdPalette = new Set(
    Object.entries(primitives.color.TD)
      .filter(([k, v]) => !k.startsWith("$") && v && typeof v === "object" && "value" in v)
      .map(([k]) => k),
  );
  const sharedColors = new Set(
    Object.entries(primitives.color.shared)
      .filter(([k, v]) => !k.startsWith("$") && v && typeof v === "object" && "value" in v)
      .map(([k]) => k),
  );

  const mapRows = [];
  const figmaWithoutCss = [];
  for (const v of FIGMA_VARS) {
    const mapped = mapFigmaToCss(v.name, v.collection, root, td, tdPalette, sharedColors);
    if (!mapped) {
      figmaWithoutCss.push({ figma: v.name, collection: v.collection, reason: reasonFor(v.name) });
      continue;
    }
    const example = mapped.emittedIn === ".theme-TD" ? td[mapped.css] : root[mapped.css];
    mapRows.push({
      figma: v.name,
      collection: v.collection,
      css: mapped.css,
      web: `var(${mapped.css})`,
      emittedIn: mapped.emittedIn,
      valueExample: example,
    });
  }

  const expectedPrefixes = ["bp/", "font/style/"];
  const unexpected = figmaWithoutCss.filter(
    (x) => !expectedPrefixes.some((p) => x.figma.startsWith(p)),
  );

  const out = {
    $description:
      "TD: Figma-variabelnamn → CSS custom property som generate-css-vars.mjs faktiskt producerar. Applicera som WEB codeSyntax i Figma.",
    $generatedAt: "2026-10-02",
    $fileKey: "HW7ZST3CotlOepEcjNI5LC",
    $source: {
      figmaVariables: "live use_figma dump 2026-10-02 (126 vars)",
      css: "generated/tokens.css",
      generator: "scripts/generate-css-vars.mjs",
    },
    map: mapRows.sort((a, b) => a.collection.localeCompare(b.collection) || a.figma.localeCompare(b.figma)),
    notEmittedByGenerateCssVars: [
      { figma: "bp/*", css: null, note: "Referens only (generated/breakpoints.mjs). CSS custom properties cannot be used in @media." },
      { figma: "font/style/*", css: null, note: "Figma STRING (Regular/Book/Bold); CSS uses --font-weight-*" },
    ],
    checks: {
      figmaWithoutCss,
      unexpectedFigmaWithoutCss: unexpected,
      radiusXsRemovedFromTokens: true,
      radiusXsRemovedFromFigma: true,
    },
  };

  writeFileSync(join(TOKENS, "code-syntax-map.json"), `${JSON.stringify(out, null, 2)}\n`, "utf8");

  const nameCounts = {};
  for (const r of mapRows) nameCounts[r.figma] = (nameCounts[r.figma] || 0) + 1;
  const flat = {};
  for (const r of [...mapRows].sort((a, b) => a.figma.localeCompare(b.figma) || a.collection.localeCompare(b.collection))) {
    const key = nameCounts[r.figma] === 1 ? r.figma : `${r.collection} › ${r.figma}`;
    flat[key] = r.web;
  }
  writeFileSync(join(TOKENS, "code-syntax-figma.json"), `${JSON.stringify(flat, null, 2)}\n`, "utf8");

  console.log(`map ${mapRows.length}`);
  console.log(`figma flat ${Object.keys(flat).length}`);
  console.log(`figma without css ${figmaWithoutCss.length}`);
  for (const x of figmaWithoutCss) console.log(`  - ${x.collection}: ${x.figma}`);
  if (unexpected.length) {
    console.error("UNEXPECTED gaps:", unexpected);
    process.exit(1);
  }
}

main();
