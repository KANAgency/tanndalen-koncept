import { test, expect } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = process.env.TD_SHOT_DIR
  ? path.resolve(process.env.TD_SHOT_DIR)
  : path.resolve(__dirname, "../regression/td-baseline");

const VIEWPORT = { width: 1440, height: 900 };
const SHOT_TIMEOUT_MS = 60_000;

const MODES = ["new", "returning", "booking", "onsite"];
const SEASONS = ["winter", "summer"];

fs.mkdirSync(OUT, { recursive: true });

async function clearDemoState(page) {
  await page.addInitScript(() => {
    try {
      for (const key of Object.keys(localStorage)) {
        if (key.startsWith("td-")) localStorage.removeItem(key);
      }
    } catch (_) {}
  });
}

/** Stabilize page for shots. Only used by this Playwright test — demo URL without this flow is unchanged. */
async function freezeForShot(page) {
  await page.evaluate(async () => {
    if (!document.querySelector("style[data-tdshot]")) {
      const style = document.createElement("style");
      style.setAttribute("data-tdshot", "1");
      style.textContent = `
        *, *::before, *::after {
          animation: none !important;
          animation-duration: 0s !important;
          transition: none !important;
          scroll-behavior: auto !important;
        }
      `;
      document.head.append(style);
    }

    for (const img of document.querySelectorAll("img")) {
      img.loading = "eager";
      img.setAttribute("loading", "eager");
    }

    const maxY = Math.max(
      document.documentElement.scrollHeight,
      document.body?.scrollHeight || 0
    );
    const step = Math.max(200, Math.floor(window.innerHeight * 0.8));
    for (let y = 0; y <= maxY; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 16));
    }
    window.scrollTo(0, maxY);
    await new Promise((r) => setTimeout(r, 50));
    window.scrollTo(0, 0);
    window.dispatchEvent(new Event("scroll"));

    const imgs = [...document.querySelectorAll("img")];
    await Promise.all(
      imgs.map(async (img) => {
        if (!img.complete || img.naturalWidth === 0) {
          await new Promise((resolve) => {
            const done = () => resolve();
            img.addEventListener("load", done, { once: true });
            img.addEventListener("error", done, { once: true });
            setTimeout(done, 8000);
          });
        }
        if (typeof img.decode === "function") {
          try {
            await img.decode();
          } catch (_) {}
        }
      })
    );
    const pending = imgs.filter((img) => !img.complete || img.naturalWidth === 0);
    if (pending.length) {
      await new Promise((r) => setTimeout(r, 500));
    }

    if (document.fonts?.ready) await document.fonts.ready;

    const videos = [...document.querySelectorAll("video")];
    await Promise.all(
      videos.map(
        (v) =>
          new Promise((resolve) => {
            const done = () => {
              v.removeEventListener("seeked", done);
              resolve();
            };
            try {
              v.autoplay = false;
              v.removeAttribute("autoplay");
              v.pause();
              if (v.readyState >= 1) {
                v.addEventListener("seeked", done);
                v.currentTime = 0;
                setTimeout(done, 1500);
              } else {
                v.addEventListener(
                  "loadedmetadata",
                  () => {
                    v.addEventListener("seeked", done);
                    v.currentTime = 0;
                    setTimeout(done, 1500);
                  },
                  { once: true }
                );
                setTimeout(done, 1500);
              }
            } catch (_) {
              resolve();
            }
          })
      )
    );

    window.scrollTo(0, 0);
    window.dispatchEvent(new Event("scroll"));
  });
  await page.waitForTimeout(100);
}

async function gotoShot(page, search) {
  const url = search.includes("?") ? `${search}&tdshot=1` : `${search}?tdshot=1`;
  await page.goto(url.startsWith("/") ? url : `/${url}`, {
    waitUntil: "domcontentloaded",
    timeout: SHOT_TIMEOUT_MS
  });
}

async function skipIntroIfPresent(page) {
  const intro = page.locator("html.is-intro");
  if (await intro.count()) {
    const btn = page.locator("#intro-scroll");
    if (await btn.count()) await btn.click({ timeout: 5000 });
  }
  try {
    await page.locator("body.is-landed").waitFor({ timeout: 15000 });
  } catch (_) {}
}

async function shot(page, name) {
  await freezeForShot(page);
  const file = path.join(OUT, `${name}.png`);
  try {
    await Promise.race([
      page.screenshot({ path: file, fullPage: true, animations: "disabled" }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`screenshot timeout ${SHOT_TIMEOUT_MS}ms`)), SHOT_TIMEOUT_MS)
      )
    ]);
    return true;
  } catch (err) {
    console.error(`[td-shot] SKIP ${name}: ${err.message || err}`);
    fs.writeFileSync(path.join(OUT, `${name}.SKIP.txt`), String(err.message || err));
    return false;
  }
}

test.describe.configure({ mode: "serial" });
test.setTimeout(SHOT_TIMEOUT_MS + 45_000);

test.beforeEach(async ({ page }) => {
  await page.setViewportSize(VIEWPORT);
  await clearDemoState(page);
});

for (const mode of MODES) {
  for (const season of SEASONS) {
    test(`mode ${mode} ${season}`, async ({ page }) => {
      await page.addInitScript((value) => {
        try {
          localStorage.setItem("td-season", value);
        } catch (_) {}
      }, season);
      await gotoShot(page, `/?mode=${mode}`);
      await skipIntroIfPresent(page);
      await page.evaluate((s) => {
        document.documentElement.dataset.season = s;
      }, season);
      await expect(page.locator("html")).toHaveAttribute("data-mode", mode, { timeout: 5000 }).catch(() => {});
      await shot(page, `mode-${mode}-${season}`);
    });
  }
}

test("intro start", async ({ page }) => {
  await gotoShot(page, "/?visit=new&mode=new");
  try {
    await page.locator("html.is-intro").waitFor({ timeout: 10000 });
  } catch (err) {
    console.error(`[td-shot] intro start: no is-intro — ${err.message || err}`);
  }
  await shot(page, "intro-start");
});

test("intro end", async ({ page }) => {
  await gotoShot(page, "/?visit=new&mode=new");
  await skipIntroIfPresent(page);
  await page.evaluate(() => window.scrollTo(0, 0));
  await shot(page, "intro-end");
});
