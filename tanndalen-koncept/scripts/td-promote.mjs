#!/usr/bin/env node
/**
 * Explicitly replace regression/td-baseline with regression/td-after.
 * Never runs as part of npm run test:td.
 */
import { existsSync, mkdirSync, copyFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(import.meta.url), "../..");
const afterDir = resolve(root, process.env.TD_AFTER || "regression/td-after");
const baselineDir = resolve(root, "regression/td-baseline");
const confirmed =
  process.argv.includes("--confirm") || process.env.TD_PROMOTE_CONFIRM === "1";

if (!confirmed) {
  console.error("Vägrar ersätta baseline utan bekräftelse.");
  console.error("Kör: npm run test:td:promote -- --confirm");
  process.exit(1);
}

if (!existsSync(afterDir)) {
  console.error(`Saknar capture-mapp: ${afterDir}`);
  process.exit(1);
}

const pngs = readdirSync(afterDir).filter((n) => n.endsWith(".png")).sort();
if (pngs.length === 0) {
  console.error(`Inga PNG i ${afterDir}. Kör npm run test:td först.`);
  process.exit(1);
}

console.log(`ERSÄTTER baseline: ${afterDir} → ${baselineDir} (${pngs.length} filer)`);
mkdirSync(baselineDir, { recursive: true });
for (const name of pngs) {
  copyFileSync(join(afterDir, name), join(baselineDir, name));
  console.log(`  ← ${name}`);
}
console.log("Baseline ersatt.");
