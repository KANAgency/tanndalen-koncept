import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../assets/icons/", import.meta.url));
const allowed = new Set(["#24272A", "#F4F1EA", "#BF6A15", "#2B211D", "#F6B73C", "none", "currentColor", "white", "black"]);
const problems = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (path.includes(".bak-")) continue;
    if (statSync(path).isDirectory()) walk(path);
    else if (name.endsWith(".svg")) check(path);
  }
}

function pathNumbers(text) {
  const values = [];
  for (const d of text.matchAll(/\bd="([^"]*)"/g)) {
    for (const n of d[1].match(/-?\d*\.?\d+(?:e[+-]?\d+)?/gi) || []) values.push(Math.abs(Number(n)));
  }
  return values;
}

function check(path) {
  const text = readFileSync(path, "utf8");
  const fail = (reason) => problems.push(`${path} ${reason}`);
  const frame = /#1E1E1E|#454545/.test(text) || pathNumbers(text).some((n) => n > 1000);
  if (frame) {
    if (/<rect\b/.test(text)) fail("<rect>");
    if (/<g\b/.test(text)) fail("<g>");
    if (/transform=/.test(text)) fail("transform");
    if (/clipPath/.test(text)) fail("clipPath");
    if (/\bmask=/.test(text) || /<mask\b/.test(text)) fail("mask");
    if (/\bfilter=/.test(text) || /<filter\b/.test(text)) fail("filter");
    if (/<defs>[\s\S]*?\S[\s\S]*?<\/defs>/.test(text)) fail("defs");
    if (pathNumbers(text).some((n) => n > 64)) fail("path number > 64");
  }
  for (const colour of text.matchAll(/\b(?:fill|stroke)="([^"]+)"/g)) {
    const value = colour[1];
    if (!allowed.has(value) && !/^url\(/.test(value)) fail(`colour ${value}`);
  }
  const folder = path.match(/\/(24|32|48)\//);
  if (folder) {
    const size = folder[1];
    const width = text.match(/\bwidth="(\d+)"/);
    const height = text.match(/\bheight="(\d+)"/);
    if (!width || width[1] !== size || !height || height[1] !== size) {
      fail(`size ${width?.[1]}x${height?.[1]}, folder ${size}`);
    }
  }
}

walk(root);
if (problems.length) {
  console.log(problems.join("\n"));
  console.log(`${problems.length} problems`);
  process.exit(1);
}
console.log("0 problems");
