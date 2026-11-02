import { readFileSync, writeFileSync } from "node:fs";

const args = process.argv.slice(2);
const white = (args.find((arg) => arg.startsWith("--white=")) || "--white=#F4F1EA").split("=")[1];
const files = args.filter((arg) => !arg.startsWith("--"));
if (!files.length) {
  console.error("usage: node scripts/clean-icons.mjs <svg>...");
  process.exit(1);
}

function numbers(d) {
  return (d.match(/-?\d*\.?\d+(?:e[+-]?\d+)?/gi) || []).map(Number);
}

for (const file of files) {
  const src = readFileSync(file, "utf8");
  const paths = [...src.matchAll(/<path\b[^>]*>/g)].map((m) => m[0]);
  const kept = paths.filter((tag) => {
    const d = tag.match(/\bd="([^"]*)"/);
    if (!d) return false;
    if (/\bstroke=/.test(tag)) return false;
    const fill = tag.match(/\bfill="([^"]*)"/);
    if (!fill || fill[1] === "none") return false;
    return numbers(d[1]).every((n) => Math.abs(n) <= 34);
  }).map((tag) => tag.replace(/fill="white"/g, `fill="${white}"`));
  const body = kept.map((tag) => tag.endsWith("/>") ? tag : tag.replace(/>$/, "/>")).join("\n");
  const svg = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\n${body}\n</svg>\n`;
  writeFileSync(file, svg);
  console.log(`${file} ${kept.length}`);
}
