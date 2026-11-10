#!/usr/bin/env node
/**
 * Run full test:td only when TD, shared/, design-system/, or TD test/scripts changed
 * vs origin/main. No pre-push hook — invoke via npm run test:td:if-changed.
 */
import { spawnSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const konceptRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = resolve(konceptRoot, "..");

const PATHS = [
  "tanndalen-koncept/koncept/sites/td/",
  "tanndalen-koncept/koncept/shared/",
  "design-system/",
  "tanndalen-koncept/tests/td-screenshots.spec.js",
  "tanndalen-koncept/scripts/td-shot-diff.mjs",
  "tanndalen-koncept/scripts/td-promote.mjs",
  "tanndalen-koncept/scripts/td-if-changed.mjs",
  "tanndalen-koncept/playwright.config.js",
  "tanndalen-koncept/package.json"
];

function run(cmd, args, opts = {}) {
  return spawnSync(cmd, args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    ...opts
  });
}

const base = "origin/main";
const fetchCheck = run("git", ["rev-parse", "--verify", base], { cwd: repoRoot });
if (fetchCheck.status !== 0) {
  console.error(`Saknar ${base}. Kör git fetch och försök igen.`);
  process.exit(1);
}

const diff = run(
  "git",
  ["diff", "--name-only", `${base}...HEAD`, "--", ...PATHS],
  { cwd: repoRoot }
);
if (diff.status !== 0) {
  console.error(diff.stderr || "git diff misslyckades");
  process.exit(diff.status ?? 1);
}

const files = (diff.stdout || "")
  .split("\n")
  .map((l) => l.trim())
  .filter(Boolean);

if (files.length === 0) {
  console.log(`test:td:if-changed — inga relevanta ändringar mot ${base}, hoppar över.`);
  process.exit(0);
}

console.log(`test:td:if-changed — ${files.length} relevant(a) fil(er) mot ${base}:`);
for (const f of files) console.log(`  ${f}`);
console.log("Kör npm run test:td …");

const test = spawnSync("npm", ["run", "test:td"], {
  cwd: konceptRoot,
  encoding: "utf8",
  stdio: "inherit",
  shell: process.platform === "win32"
});
process.exit(test.status ?? 1);
