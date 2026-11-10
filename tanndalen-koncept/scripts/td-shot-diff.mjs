#!/usr/bin/env node
/**
 * Diff TD regression shots. Scale = 1 (CSS px == shot px for layout).
 * Prefers *.masks.json written during capture; falls back to live DOM reloads.
 * Does not mask static images.
 */
import { mkdirSync, existsSync, writeFileSync, readdirSync, readFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { chromium } from "playwright";

const root = resolve(fileURLToPath(import.meta.url), "../..");
const beforeDir = resolve(root, process.env.TD_BEFORE || "regression/td-baseline");
const afterDir = resolve(root, process.env.TD_AFTER || "regression/td-after");
const diffDir = resolve(root, process.env.TD_DIFF || "regression/td-diff");
const baseURL = process.env.TD_DIFF_BASE_URL || "http://127.0.0.1:4173";

const ALL_MODE_SHOTS = {
  "mode-new-winter.png": ["new", "winter"],
  "mode-new-summer.png": ["new", "summer"],
  "mode-returning-winter.png": ["returning", "winter"],
  "mode-returning-summer.png": ["returning", "summer"],
  "mode-booking-winter.png": ["booking", "winter"],
  "mode-booking-summer.png": ["booking", "summer"],
  "mode-onsite-winter.png": ["onsite", "winter"],
  "mode-onsite-summer.png": ["onsite", "summer"],
  "intro-start.png": ["new", "winter", { visit: "new", keepIntro: true }],
  "intro-end.png": ["new", "winter", { visit: "new" }]
};

const ONLY = new Set(
  (process.env.TD_ONLY || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => (s.endsWith(".png") ? s : `${s}.png`))
);

const MODE_SHOTS =
  ONLY.size === 0
    ? ALL_MODE_SHOTS
    : Object.fromEntries(Object.entries(ALL_MODE_SHOTS).filter(([name]) => ONLY.has(name)));

function names(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((n) => n.endsWith(".png")).sort();
}

async function videoMasksFor(page, mode, season, opts = {}) {
  await page.addInitScript((s) => {
    try {
      for (const k of Object.keys(localStorage)) if (k.startsWith("td-")) localStorage.removeItem(k);
      localStorage.setItem("td-season", s);
    } catch {}
  }, season);
  let url = `/?mode=${mode}`;
  if (opts.visit) url += `&visit=${opts.visit}`;
  await page.goto(new URL(url, baseURL).href, { waitUntil: "domcontentloaded", timeout: 30000 });
  if (!opts.keepIntro) {
    if (await page.locator("html.is-intro").count()) {
      await page.locator("#intro-scroll").click().catch(() => {});
    }
    await page.locator("body.is-landed").waitFor({ timeout: 15000 }).catch(() => {});
  }
  await page.evaluate((s) => {
    document.documentElement.dataset.season = s;
    window.scrollTo(0, 0);
  }, season);
  return page.evaluate(() =>
    [...document.querySelectorAll("video")]
      .map((v) => {
        const r = v.getBoundingClientRect();
        return {
          x: Math.floor(r.x),
          y: Math.floor(r.y + scrollY),
          w: Math.ceil(r.width),
          h: Math.ceil(r.height),
          src: (v.currentSrc || v.src || "").split("/").pop() || ""
        };
      })
      .filter((r) => r.w > 1 && r.h > 1)
  );
}

async function collectMasks() {
  let browser;
  try {
    browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
    try {
      await page.goto(baseURL, { waitUntil: "domcontentloaded", timeout: 15000 });
    } catch (err) {
      const msg = err?.message || String(err);
      console.error(`Kunde inte nå servern på ${baseURL}: ${msg}`);
      console.error("Starta den via Playwright webServer (npm run test:td) eller manuellt på :4173.");
      process.exit(1);
    }
    const masks = {};
    for (const [name, spec] of Object.entries(MODE_SHOTS)) {
      const [mode, season, opts] = spec;
      masks[name] = await videoMasksFor(page, mode, season, opts || {});
    }
    const overflow = await page.evaluate(() => {
      const vw = window.innerWidth;
      const hits = [];
      for (const el of document.querySelectorAll("body *")) {
        const r = el.getBoundingClientRect();
        if (r.width < 2) continue;
        if (r.right > vw + 1 || r.left < -1) {
          const cs = getComputedStyle(el);
          hits.push({
            tag: el.tagName,
            id: el.id || null,
            className: typeof el.className === "string" ? el.className.slice(0, 80) : null,
            left: r.left,
            right: r.right,
            width: r.width,
            position: cs.position
          });
        }
      }
      hits.sort((a, b) => b.right - a.right);
      return {
        innerWidth: vw,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        top: hits.slice(0, 12)
      };
    });
    return { masks, overflow };
  } finally {
    if (browser) await browser.close();
  }
}

function runPillow(masks) {
  const masksJson = JSON.stringify(masks);
  const py = `
from pathlib import Path
from PIL import Image, ImageChops, ImageDraw
import json, sys

before = Path(${JSON.stringify(beforeDir)})
after = Path(${JSON.stringify(afterDir)})
diff_dir = Path(${JSON.stringify(diffDir)})
diff_dir.mkdir(parents=True, exist_ok=True)
masks = json.loads(${JSON.stringify(masksJson)})

MAX_RATIO = 0.0001  # 0.01 %
MAX_BLOB = 50       # no contiguous deviation larger than 50×50

def apply_masks(im, rects):
    draw = ImageDraw.Draw(im)
    for r in rects or []:
        x,y,w,h = r['x'], r['y'], r['w'], r['h']
        draw.rectangle([x, y, x+w, y+h], fill=(0,0,0))
    return im

def max_component_bbox(mask_img):
    """Largest connected-component bbox (4-connected) among non-zero mask pixels."""
    outer = mask_img.getbbox()
    if not outer:
        return None
    x0, y0, x1, y1 = outer
    crop = mask_img.crop(outer)
    cw, ch = crop.size
    pix = crop.load()
    seen = set()
    max_box = None
    max_area = 0
    for yy in range(ch):
        for xx in range(cw):
            if pix[xx, yy] == 0 or (xx, yy) in seen:
                continue
            stack = [(xx, yy)]
            seen.add((xx, yy))
            minx = maxx = xx
            miny = maxy = yy
            while stack:
                x, y = stack.pop()
                if x < minx: minx = x
                if x > maxx: maxx = x
                if y < miny: miny = y
                if y > maxy: maxy = y
                for nx, ny in ((x-1,y),(x+1,y),(x,y-1),(x,y+1)):
                    if 0 <= nx < cw and 0 <= ny < ch and pix[nx, ny] and (nx, ny) not in seen:
                        seen.add((nx, ny))
                        stack.append((nx, ny))
            bw, bh = maxx - minx + 1, maxy - miny + 1
            area = bw * bh
            if area > max_area:
                max_area = area
                max_box = [x0 + minx, y0 + miny, bw, bh]
    return max_box

only = set(${JSON.stringify([...ONLY])})
print(f"{'name':<32} {'status':<8} {'ratio':>10} {'bbox':>36} {'max_blob':>16}")
fail = 0
report = {}
for name in sorted(p.name for p in before.glob('*.png')):
    if only and name not in only:
        continue
    b, a = before/name, after/name
    if not a.exists():
        print(f"{name:<32} MISSING")
        fail += 1
        report[name] = {'ratio': None, 'status': 'MISSING'}
        continue
    ib = Image.open(b).convert('RGB')
    ia = Image.open(a).convert('RGB')
    if ib.size != ia.size:
        print(f"{name:<32} SIZE {ib.size}->{ia.size}")
        fail += 1
        report[name] = {'status': 'SIZE', 'sizes': [ib.size, ia.size]}
        continue
    rects = masks.get(name, [])
    ib2, ia2 = ib.copy(), ia.copy()
    apply_masks(ib2, rects)
    apply_masks(ia2, rects)
    mask = ImageChops.difference(ib2, ia2).convert('L').point(lambda p: 255 if p else 0)
    bbox = mask.getbbox()
    hist = mask.histogram()
    changed = hist[255] if len(hist) > 255 else 0
    total = ib.size[0] * ib.size[1]
    ratio = changed / total if total else 0
    blob = max_component_bbox(mask) if changed else None
    if bbox:
        x,y,r,b2 = bbox
        bb = [x,y,r-x,b2-y]
        bbox_s = f"x={x} y={y} w={r-x} h={b2-y}"
    else:
        bb = None
        bbox_s = "—"
    blob_s = "—" if not blob else f"{blob[2]}×{blob[3]}"
    blob_ok = (not blob) or (blob[2] <= MAX_BLOB and blob[3] <= MAX_BLOB)
    ratio_ok = ratio <= MAX_RATIO
    status = 'PASS' if (ratio_ok and blob_ok) else 'FAIL'
    if status == 'FAIL':
        fail += 1
        ov = ia.copy()
        red = Image.new('RGB', ib.size, (255,0,0))
        ov.paste(red, mask=mask)
        ov.save(diff_dir/name)
    print(f"{name:<32} {status:<8} {ratio*100:>9.4f}% {bbox_s:>36} {blob_s:>16}")
    report[name] = {
        'ratio': ratio, 'bbox': bb, 'maxBlob': blob, 'status': status,
        'videosMasked': rects, 'ratioOk': ratio_ok, 'blobOk': blob_ok
    }
print(f"RESULT fail={fail} (tolerance ratio<=0.01% and blob<=50x50)")
Path('/tmp/td-masked-diff-report.json').write_text(json.dumps(report))
sys.exit(1 if fail else 0)
`;
  const r = spawnSync("python3", ["-c", py], { encoding: "utf8", cwd: root, maxBuffer: 20 * 1024 * 1024 });
  process.stdout.write(r.stdout || "");
  process.stderr.write(r.stderr || "");
  return r.status ?? 1;
}

function loadCaptureMasks() {
  const masks = {};
  let missing = 0;
  for (const name of Object.keys(MODE_SHOTS)) {
    const base = name.replace(/\.png$/, "");
    const file = join(afterDir, `${base}.masks.json`);
    if (!existsSync(file)) {
      missing += 1;
      continue;
    }
    try {
      masks[name] = JSON.parse(readFileSync(file, "utf8"));
    } catch {
      missing += 1;
    }
  }
  return { masks, missing };
}

mkdirSync(diffDir, { recursive: true });
if (!existsSync(beforeDir) || names(beforeDir).length === 0) {
  console.error(`Saknar baseline-bilder i ${beforeDir}`);
  process.exit(1);
}
if (!existsSync(afterDir) || names(afterDir).length === 0) {
  console.error(`Saknar capture-bilder i ${afterDir}`);
  process.exit(1);
}

const fromCapture = loadCaptureMasks();
let masks = fromCapture.masks;
let overflow = null;
if (fromCapture.missing === 0 && Object.keys(masks).length === Object.keys(MODE_SHOTS).length) {
  console.log(`Video masks from capture (${Object.keys(masks).length} files). Skipping live reload.`);
} else {
  console.log(
    `Capture masks incomplete (have ${Object.keys(masks).length}, missing ${fromCapture.missing}) — live DOM fallback.`
  );
  const live = await collectMasks();
  masks = live.masks;
  overflow = live.overflow;
  console.log("Video masks collected. Overflow probe:", JSON.stringify(overflow, null, 2));
}
writeFileSync("/tmp/td-video-masks.json", JSON.stringify({ masks, overflow, source: fromCapture.missing === 0 ? "capture" : "live" }, null, 2));
const status = runPillow(masks);
process.exit(status);
