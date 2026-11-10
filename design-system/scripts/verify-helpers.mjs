import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export function loadJson(name) {
  return JSON.parse(readFileSync(join(__dirname, "..", "tokens", name), "utf8"));
}
