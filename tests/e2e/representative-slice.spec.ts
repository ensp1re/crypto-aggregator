import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("public detail exposes scope, explicit unknowns, and accessible evidence", async ({ page }, testInfo) => {
  await page.goto("/programs/atlas-card");
  await expect(page.getByRole("heading", { level: 1, name: "Atlas Card" })).toBeVisible();
  await expect(page.getByText("Residents of Germany", { exact: true })).toBeVisible();
  await expect(page.getByText("Residents of France", { exact: true })).toBeVisible();
  await expect(page.getByText("Issuer did not disclose")).toBeVisible();
  await page.getByText("Inspect evidence").first().click();
  await expect(page.getByText("Tier A · synthetic official terms").first()).toBeVisible();

  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations).toEqual([]);
  if (testInfo.project.name === "mobile-chromium") {
    const undersizedTargets = await page.locator("a, button, summary, input, select, textarea").evaluateAll((elements) =>
      elements.filter((element) => {
        const root = element.getRootNode();
        if (root instanceof ShadowRoot && root.host.tagName.toLowerCase() === "nextjs-portal") return false;
        const rect = element.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && (rect.width < 44 || rect.height < 44);
      }).map((element) => element.textContent?.trim() || element.tagName),
    );
    expect(undersizedTargets).toEqual([]);
  }
});

test("comparison remains within responsive viewports and preserves unknown values", async ({ page }, testInfo) => {
  await page.goto("/compare");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Germany Plus vs France Plus");
  await expect(page.getByText("Issuer did not disclose")).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(overflow).toBe(false);
  if (testInfo.project.name === "mobile-chromium") {
    await page.setViewportSize({ width: 812, height: 375 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
    await page.setViewportSize({ width: 375, height: 812 });
    await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
  }
});

test("researcher candidate reaches reviewed public projection", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "Workflow mutates the shared synthetic fixture once.");
  await page.goto("/research");
  const candidate = page.getByRole("article").filter({ hasText: "2.25% from 1 August" });
  await candidate.getByRole("button", { name: /Approve as/ }).click();
  await expect(page.getByRole("status")).toContainText("independently approved");
  await page.getByRole("article").filter({ hasText: "2.25% from 1 August" }).getByRole("button", { name: "Publish approved claim" }).click();
  await expect(page.getByRole("status")).toContainText("published");
  await page.goto("/programs/atlas-card");
  await expect(page.getByText("2.25% from 1 August")).toBeVisible();
});
