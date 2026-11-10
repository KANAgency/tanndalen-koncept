import { test, expect } from "@playwright/test";

const paths = ["/", "/?visit=new"];
const widths = [1280, 390];
const seasons = ["winter", "summer"];

for (const path of paths) {
  for (const width of widths) {
    for (const season of seasons) {
      test(`init ${path} ${width}px ${season}`, async ({ page }) => {
        const problems = [];
        page.on("pageerror", (error) => problems.push(String(error)));
        page.on("console", (message) => {
          if (message.type() === "error") problems.push(message.text());
        });
        page.on("response", (response) => {
          if (response.status() === 404) problems.push(`404 ${response.url()}`);
        });
        await page.addInitScript((value) => {
          localStorage.setItem("td-season", value);
        }, season);
        await page.setViewportSize({ width, height: 800 });
        await page.goto(path, { waitUntil: "domcontentloaded" });
        if (await page.locator("html.is-intro").count()) {
          await page.locator("#intro-scroll").click();
        }
        await page.locator("body.is-landed").waitFor();
        await page.evaluate(() => {
          window.scrollTo(0, 24);
          window.dispatchEvent(new Event("scroll"));
        });
        await expect(page.locator(".top")).toHaveClass(/is-scrolled/);
        await expect.poll(() => page.locator(".top-glass").evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
        expect(problems, problems.join("\n")).toEqual([]);
      });
    }
  }
}
