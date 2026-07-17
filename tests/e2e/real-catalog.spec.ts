import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

async function expectNoOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
}

test("home and catalog expose real discovery coverage without false verification", async ({ page }, testInfo) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Compare the card");
  await expect(page.getByText("Programs discovered")).toBeVisible();
  await expect(page.getByText("Officially verified fields")).toBeVisible();
  await page.getByRole("link", { name: /Explore 42 programs/ }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Forty-two programs");
  await expect(page.getByText("42 of 42 programs")).toBeVisible();
  await expect(page.getByText("Unverified", { exact: true })).toHaveCount(0);
  const fundingControl = page.getByRole("combobox", { name: /Funding control/ });
  await fundingControl.focus();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("listbox", { name: "Funding control" })).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.keyboard.press("s");
  await page.keyboard.press("Enter");
  await expect(fundingControl).toContainText("Self-Custody");
  await page.getByRole("button", { name: /Apply/ }).click();
  await expect(page).toHaveURL(/custody=Self-Custody/);
  await expectNoOverflow(page);

  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations).toEqual([]);

  if (testInfo.project.name === "mobile-chromium") {
    const undersizedTargets = await page.locator("a, button, input, select, textarea").evaluateAll((elements) =>
      elements.filter((element) => {
        const root = element.getRootNode();
        if (root instanceof ShadowRoot && root.host.tagName.toLowerCase() === "nextjs-portal") return false;
        const rect = element.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && (rect.width < 44 || rect.height < 44);
      }).map((element) => element.textContent?.trim() || element.getAttribute("aria-label") || element.tagName),
    );
    expect(undersizedTargets).toEqual([]);
  }
});

test("program detail keeps observed terms and official confirmation distinct", async ({ page }) => {
  await page.goto("/cards/metamask-card");
  await expect(page.getByRole("heading", { level: 1, name: "MetaMask Card" })).toBeVisible();
  await expect(page.getByAltText("MetaMask fox symbol")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Observations awaiting independent review" })).toBeVisible();
  await expect(page.getByText("8 observations")).toBeVisible();
  await expect(page.getByText(/New U.S. and U.K. sign-ups temporarily paused/)).toBeVisible();
  await expect(page.getByText("Unverified", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("link", { name: /Confirm with issuer/ })).toHaveAttribute("href", /^https:/);
  await expectNoOverflow(page);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test("analytics provides accessible custody data and an explicit licensed-data boundary", async ({ page }) => {
  await page.goto("/analytics");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("keeps users in control");
  await expect(page.getByRole("heading", { name: "Funding control labels" })).toBeVisible();
  await expect(page.getByRole("table", { name: "Funding control labels data" })).toBeVisible();
  await expect(page.getByText("Payment volume is not imported yet.")).toBeVisible();
  await expectNoOverflow(page);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test("real comparison stacks cleanly on mobile and declares uncertainty", async ({ page }, testInfo) => {
  await page.goto("/compare");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("without a fake winner");
  await expect(page.getByRole("table", { name: "Crypto card comparison" })).toBeVisible();
  await expect(page.getByText("Unverified observation")).toHaveCount(0);
  await expectNoOverflow(page);
  if (testInfo.project.name === "mobile-chromium") {
    await page.setViewportSize({ width: 812, height: 375 });
    await expectNoOverflow(page);
    await page.setViewportSize({ width: 375, height: 812 });
    await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
    await expectNoOverflow(page);
  }
});
