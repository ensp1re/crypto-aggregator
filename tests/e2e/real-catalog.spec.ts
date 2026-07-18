import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

async function expectNoOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);
}

test("home and catalog expose the full card index", async ({ page }, testInfo) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Compare the card");
  await expect(page.getByText("Cards indexed")).toBeVisible();
  await expect(page.getByText("Card profiles")).toBeVisible();
  await page.getByRole("link", { name: /Explore 42 cards/ }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Forty-two cards");
  await expect(page.getByText("42 of 42 cards")).toBeVisible();
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

test("program detail exposes card details and the card website", async ({ page }) => {
  await page.goto("/cards/metamask-card");
  await expect(page.getByRole("heading", { level: 1, name: "MetaMask Card" })).toBeVisible();
  await expect(page.getByAltText("MetaMask fox symbol")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Latest card details" })).toBeVisible();
  await expect(page.getByText("8 details")).toBeVisible();
  await expect(page.getByText(/New U.S. and U.K. sign-ups temporarily paused/)).toBeVisible();
  await expect(page.getByText("Unverified", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("link", { name: /Visit website/ })).toHaveAttribute("href", /^https:/);
  await expect(page.locator("body")).not.toContainText(/reported|confirm with issuer/i);
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
  await expect(page.getByRole("heading", { level: 1 })).toContainText("keep users in control");
  await expect(page.getByRole("heading", { name: "Funding models" })).toBeVisible();
  await expect(page.getByRole("table", { name: "Funding models data" })).toBeVisible();
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

test("one Ready Card profile controls Lite and Metal plan details", async ({ page }) => {
  await page.goto("/cards/ready-lite");
  await expect(page.getByRole("heading", { level: 1, name: "Ready Card" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Lite", exact: true })).toHaveAttribute("aria-current", "page");
  await page.getByRole("link", { name: "Metal", exact: true }).click();
  await expect(page).toHaveURL(/plan=metal/);
  await expect(page.getByRole("heading", { name: "Benefits & perks / Metal" })).toBeVisible();
  await expect(page.getByText("120 USDC for the first year")).toBeVisible();
  await expect(page.getByText("Ready Travel", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Subscription savings/ })).toBeVisible();
  await expect(page.getByRole("link", { name: "Visit website" })).toHaveAttribute("href", "https://www.ready.co/card");
  await page.getByRole("button", { name: "Compare", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Compare Ready Card" });
  await dialog.getByRole("checkbox", { name: /MetaMask Card/ }).check();
  await dialog.getByRole("button", { name: "Compare 2 cards" }).click();
  await expect(page).toHaveURL(/plans=ready-lite%3Ametal/);
  await expect(page.getByRole("link", { name: "Metal", exact: true })).toHaveAttribute("aria-current", "true");
  await expect(page.getByText("120 USDC for the first year")).toBeVisible();
});

test("real comparison uses a contained semantic table on mobile", async ({ page }, testInfo) => {
  await page.goto("/compare?cards=metamask-card&cards=etherfi-card&cards=gnosis-card");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Compare cards side by side");
  await expect(page.getByRole("table", { name: "Crypto card comparison" })).toBeVisible();
  await expect(page.getByRole("checkbox", { name: "Differences only" })).toBeVisible();
  await expect(page.locator("body")).not.toContainText(/reported|regional offerings are not normalized|eligibility and verified economics/i);
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
