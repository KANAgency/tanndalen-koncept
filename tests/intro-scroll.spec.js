import { test, expect } from "@playwright/test";

async function stubMedia(page) {
  await page.route(/\.(mp4|webm|mov)(\?|$)/, (route) => route.fulfill({
    status: 200,
    contentType: "video/mp4",
    body: Buffer.alloc(0),
  }));
}

test("zoom point, scale curve and coverage", async ({ browser }) => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await stubMedia(page);
  await page.addInitScript(() => localStorage.removeItem("td-startsida-seen"));
  await page.goto("/?visit=new", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#intro-lock")).toBeVisible();
  const meta = await page.evaluate(() => ({
    inside: document.getElementById("intro-runway").dataset.originInside,
    svg: document.getElementById("intro-runway").dataset.originSvg,
    edge: document.getElementById("intro-runway").dataset.edgePx,
    sMax: Number(document.getElementById("intro-runway").dataset.sMax),
    start: Number(document.getElementById("intro-runway").dataset.zoomStart),
    length: Number(document.getElementById("intro-runway").dataset.zoomLength),
  }));
  expect(meta.inside).toBe("1");
  expect(meta.sMax).toBeGreaterThan(1);
  expect(meta.sMax).toBeLessThanOrEqual(80);
  const samples = [0, 0.25, 0.5, 1];
  const scales = [];
  for (const fraction of samples) {
    await page.evaluate((fraction) => {
      const runway = document.getElementById("intro-runway");
      const y = Number(runway.dataset.zoomStart) + Number(runway.dataset.zoomLength) * fraction;
      scrollTo(0, y);
      window.dispatchEvent(new Event("scroll"));
    }, fraction);
    await expect.poll(() => page.evaluate(() => Number(document.getElementById("intro-runway").dataset.zoomP))).toBeCloseTo(fraction, 1);
    scales.push(Number(await page.evaluate(() => document.getElementById("intro-runway").dataset.zoomS)));
  }
  expect(scales[0]).toBeCloseTo(1, 1);
  expect(scales[3]).toBeCloseTo(meta.sMax, 1);
  const covered = await page.evaluate(() => {
    const runway = document.getElementById("intro-runway");
    scrollTo(0, Number(runway.dataset.zoomStart) + Number(runway.dataset.zoomLength));
    window.dispatchEvent(new Event("scroll"));
    return getComputedStyle(document.getElementById("intro-lock")).visibility;
  });
  expect(covered).toBe("hidden");
  await page.close();
  test.info().annotations.push({ type: "zoom", description: JSON.stringify({ ...meta, scales }) });
  console.log(JSON.stringify({ ...meta, scales }));
});

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 1024, height: 768 },
  { width: 393, height: 852 },
]) {
  test(`hole covers viewport at sMax ${viewport.width}`, async ({ page }) => {
    await stubMedia(page);
    await page.setViewportSize(viewport);
    await page.addInitScript(() => localStorage.removeItem("td-startsida-seen"));
    await page.goto("/?visit=new", { waitUntil: "domcontentloaded" });
    const result = await page.evaluate(() => {
      const runway = document.getElementById("intro-runway");
      const sMax = Number(runway.dataset.sMax);
      const lock = document.getElementById("intro-lock");
      const origin = lock.style.transformOrigin.split(" ").map(parseFloat);
      const path = new Path2D(document.getElementById("intro-plate-path").getAttribute("d").replace(/^M0 0H[\d.]+V[\d.]+H0Z/, ""));
      const probe = document.createElement("canvas").getContext("2d");
      const w = innerWidth;
      const h = innerHeight;
      const samples = [[1, 1], [w - 1, 1], [1, h - 1], [w - 1, h - 1], [w / 2, 1], [w / 2, h - 1], [1, h / 2], [w - 1, h / 2]];
      const hits = samples.map(([x, y]) => probe.isPointInPath(path, origin[0] + (x - origin[0]) / sMax, origin[1] + (y - origin[1]) / sMax));
      return { sMax, start: Number(runway.dataset.zoomStart), length: Number(runway.dataset.zoomLength), hits, inside: runway.dataset.originInside };
    });
    expect(result.inside).toBe("1");
    expect(result.hits.every(Boolean)).toBe(true);
    console.log(viewport.width, JSON.stringify(result));
  });
}

test("skip, heading, pause and season line", async ({ page }) => {
  await stubMedia(page);
  await page.addInitScript(() => {
    localStorage.setItem("td-season", "winter");
    localStorage.removeItem("td-startsida-seen");
  });
  await page.goto("/?visit=new", { waitUntil: "domcontentloaded" });
  const h1 = page.locator("h1");
  await expect(h1).toHaveText("Tänndalen. Älskat av skidåkare.");
  const box = await h1.boundingBox();
  expect(box.width).toBeLessThan(2);
  await expect(page.locator("#intro-copy")).toHaveText("Tänndalen");
  await expect(page.locator("#intro-copy")).toHaveText("Älskat av skidåkare.", { timeout: 2500 });
  const first = await page.evaluate(() => document.querySelector("button, a, input, select, textarea")?.id);
  expect(first).toBe("intro-scroll");
  const pause = page.locator("#pause");
  await pause.click();
  await expect.poll(() => page.evaluate(() => document.getElementById("hero-video").paused)).toBe(true);
  await page.locator("#play").click();
  await page.locator("#intro-scroll").click();
  await expect(h1).toBeFocused();
  await expect.poll(() => page.evaluate(() => document.documentElement.classList.contains("is-past-intro"))).toBe(true);
});

test("summer line", async ({ page }) => {
  await stubMedia(page);
  await page.addInitScript(() => {
    localStorage.setItem("td-season", "summer");
    localStorage.removeItem("td-startsida-seen");
  });
  await page.goto("/?visit=new", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#intro-copy")).toHaveText("Älskat av fjällvandrare.", { timeout: 2500 });
});

test("returning and reduced motion skip the runway", async ({ browser }) => {
  const returning = await browser.newPage();
  await stubMedia(returning);
  await returning.addInitScript(() => localStorage.setItem("td-startsida-seen", "1"));
  await returning.goto("/?visit=returning", { waitUntil: "domcontentloaded" });
  await expect(returning.locator(".intro-runway")).toBeHidden();
  const lock = await returning.evaluate(() => getComputedStyle(document.getElementById("intro-lock")).transform);
  expect(lock === "none" || lock === "matrix(1, 0, 0, 1, 0, 0)").toBe(true);
  await expect(returning.locator(".top")).toBeVisible();
  await returning.close();

  const reduced = await browser.newPage();
  await stubMedia(reduced);
  await reduced.emulateMedia({ reducedMotion: "reduce" });
  await reduced.addInitScript(() => localStorage.removeItem("td-startsida-seen"));
  await reduced.goto("/?visit=new", { waitUntil: "domcontentloaded" });
  await expect(reduced.locator(".intro-runway")).toBeHidden();
  await expect(reduced.locator("#hero-play")).toBeVisible();
  await reduced.close();
});
