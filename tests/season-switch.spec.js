import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("td-season", "winter");
    localStorage.setItem("td-startsida-seen", "1");
    const tally = { listeners: 0, intervals: 0 };
    window.__seasonTally = tally;
    const add = EventTarget.prototype.addEventListener;
    const remove = EventTarget.prototype.removeEventListener;
    EventTarget.prototype.addEventListener = function (...args) {
      tally.listeners += 1;
      return add.apply(this, args);
    };
    EventTarget.prototype.removeEventListener = function (...args) {
      tally.listeners = Math.max(0, tally.listeners - 1);
      return remove.apply(this, args);
    };
    const setInterval = window.setInterval;
    const clearInterval = window.clearInterval;
    window.setInterval = function (...args) {
      tally.intervals += 1;
      return setInterval.apply(this, args);
    };
    window.clearInterval = function (...args) {
      tally.intervals = Math.max(0, tally.intervals - 1);
      return clearInterval.apply(this, args);
    };
  });
});

async function assertSeason(page, season) {
  await expect(page.locator("html")).toHaveAttribute("data-season", season);
  await expect(page.locator("body")).toHaveAttribute("data-season", season);
  const panels = ["alpint", "langd", "sommar"];
  for (const name of panels) {
    await expect(page.locator(`[data-gren-panel="${name}"]`)).toHaveCount(1);
  }
  const summer = page.locator('[data-gren-panel="sommar"]');
  const toggle = page.locator(".just-nu .td-segmented");
  if (season === "summer") {
    await expect(summer).toBeVisible();
    await expect(page.locator('[data-gren-panel="alpint"]')).toBeHidden();
    await expect(page.locator('[data-gren-panel="langd"]')).toBeHidden();
    await expect(toggle).toBeHidden();
    await expect(page.getByText("Paddla 1 000 meter över havet")).toBeVisible();
    await expect(page.getByText("Fast och snabbt i morse", { exact: false })).toBeHidden();
  } else {
    await expect(summer).toBeHidden();
    await expect(toggle).toBeVisible();
    await expect(page.getByText("Paddla 1 000 meter över havet")).toBeHidden();
  }
  await expect(page.locator("#fraga-card")).toHaveCount(1);
  await expect(page.locator("#fraga-layer")).toHaveCount(1);
  await expect(page.locator(".boka-menu")).toHaveCount(1);
}

async function exercise(page) {
  const stack = page.locator(".td-just-nu-stack:visible").first();
  const dot = stack.locator(".td-just-nu-pager-dot").nth(1);
  await dot.dispatchEvent("click");
  await expect(dot).toHaveAttribute("aria-current", "true");
  await stack.dispatchEvent("keydown", { key: "ArrowDown" });
  await page.locator("#fraga-card").dispatchEvent("click");
  await expect(page.locator("#fraga-layer")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("#fraga-layer")).toBeHidden();
  await page.locator(".boka-menu > a").dispatchEvent("click");
  await expect(page.locator(".boka-menu")).toHaveClass(/is-open/);
  await page.keyboard.press("Escape");
  await expect(page.locator(".boka-menu")).not.toHaveClass(/is-open/);
}

test("säsongen växlar utan blandat läge", async ({ page }) => {
  test.setTimeout(120000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  const logs = [];
  page.on("console", (msg) => {
    if (msg.type() === "error" || msg.type() === "warning") logs.push(msg.text());
  });
  page.on("pageerror", (error) => logs.push(error.message));

  for (const viewport of [
    { width: 1280, height: 800 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/index.html");
    await page.addStyleTag({ content: "*, *::before, *::after { animation: none !important; transition: none !important; }" });
    await assertSeason(page, "winter");
    const tally = await page.evaluate(() => ({ ...window.__seasonTally }));
    const suffix = viewport.width < 1024 ? "mobile" : "desktop";

    for (let i = 0; i < 12; i += 1) {
      const season = i % 2 === 0 ? "summer" : "winter";
      await page.locator(".menu-control-icon").click();
      await page.locator(".td-season-toggle-option", { hasText: season === "summer" ? "Sommar" : "Vinter" }).click();
      await page.keyboard.press("Escape");
      await assertSeason(page, season);
      const next = await page.evaluate(() => ({ ...window.__seasonTally }));
      expect(next.listeners).toBe(tally.listeners);
      expect(next.intervals).toBe(tally.intervals);
      if (i < 2) {
        await expect(page.locator(".just-nu-head")).toHaveScreenshot(`just-nu-head-${season}-${suffix}.png`, {
          animations: "disabled",
          timeout: 8000,
        });
      }
      await exercise(page);
    }
  }

  const unexpected = logs.filter((line) => !/boende\/omrade|Failed to load resource|404/.test(line));
  expect(unexpected).toEqual([]);
});
