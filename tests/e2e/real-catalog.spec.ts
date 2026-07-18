import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

async function expectNoOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);
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
  const compareButton = page.getByRole("button", { name: "Compare", exact: true });
  await compareButton.click();
  const dialog = page.getByRole("dialog", { name: "Compare MetaMask Card" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("checkbox", { name: /MetaMask Card/ })).toBeChecked();
  await expect(dialog.getByRole("checkbox", { name: /MetaMask Card/ })).toBeDisabled();
  expect((await new AxeBuilder({ page }).include("dialog").analyze()).violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(compareButton).toBeFocused();
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

test("profile picker creates a shareable multi-card comparison", async ({ page }) => {
  await page.goto("/cards/metamask-card");
  await page.getByRole("button", { name: "Compare", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Compare MetaMask Card" });
  await dialog.getByRole("checkbox", { name: /Ether.fi Cash/ }).check();
  await dialog.getByRole("checkbox", { name: /Gnosis Pay/ }).check();
  await dialog.getByRole("button", { name: "Compare 3 cards" }).click();
  await expect(page).toHaveURL(/cards=metamask-card&cards=etherfi-card&cards=gnosis-card/);
  await expect(page.getByRole("table", { name: "Crypto card comparison" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: /MetaMask Card/ })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: /Ether.fi Cash/ })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: /Gnosis Pay/ })).toBeVisible();
});

test("real comparison uses a contained semantic table on mobile", async ({ page }, testInfo) => {
  await page.goto("/compare?cards=metamask-card&cards=etherfi-card&cards=gnosis-card");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("without a fake winner");
  await expect(page.getByRole("table", { name: "Crypto card comparison" })).toBeVisible();
  await expect(page.getByRole("checkbox", { name: "Differences only" })).toBeVisible();
  await expect(page.getByText("Unverified observation")).toHaveCount(0);
  await expectNoOverflow(page);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  if (testInfo.project.name === "mobile-chromium") {
    const tableScroll = page.locator(".compare-table-scroll");
    expect(await tableScroll.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
    await page.getByRole("button", { name: "Scroll comparison right" }).click();
    expect(await tableScroll.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
    await page.setViewportSize({ width: 812, height: 375 });
    await expectNoOverflow(page);
    await page.setViewportSize({ width: 375, height: 812 });
    await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
    await expectNoOverflow(page);
  }
});
