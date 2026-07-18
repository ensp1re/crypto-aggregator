import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

async function expectNoOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);
}

test("home and catalog expose the full card index", async ({ page }, testInfo) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Compare the card");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /^https:\/\/www\.cardstats\.xyz\/?$/,
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /opengraph-image/);
  expect(await page.locator('script[type="application/ld+json"]').count()).toBeGreaterThan(0);
  await expect(page.getByText("Cards indexed")).toBeVisible();
  await expect(page.getByText("Official sources collected")).toBeVisible();
  await page.getByRole("link", { name: /Explore 60 cards/ }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("60 cards");
  await expect(page.getByText("60 of 60 cards")).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://www.cardstats.xyz/cards");
  await expect(page.getByText("Unverified", { exact: true })).toHaveCount(0);
  const network = page.getByRole("combobox", { name: /Network/ });
  await network.focus();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("listbox", { name: "Network" })).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.keyboard.press("v");
  await page.keyboard.press("Enter");
  await expect(network).toContainText("Visa");
  await expect(page).toHaveURL(/network=Visa/);
  await network.click();
  await page.getByRole("option", { name: "All networks" }).click();
  await page.getByRole("searchbox", { name: "Search cards" }).fill("MetaMask");
  await expect(page.getByText("1 of 60 cards")).toBeVisible();
  await expect(page.getByRole("heading", { name: "MetaMask Card" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Apply/ })).toHaveCount(0);
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
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://www.cardstats.xyz/cards/metamask-card");
  const schemaTypes = await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) => scripts.flatMap((script) => {
    const value = JSON.parse(script.textContent ?? "{}");
    return value["@graph"]?.map((item: { "@type"?: string }) => item["@type"]) ?? [value["@type"]];
  }));
  expect(schemaTypes).toContain("FinancialProduct");
  expect(schemaTypes).toContain("BreadcrumbList");
  await expect(page.getByAltText("MetaMask fox symbol")).toBeVisible();
  await page.getByText(/Review \d+ sourced details/).click();
  await expect(page.getByRole("heading", { name: "Latest card details" })).toBeVisible();
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

test("crawler discovery endpoints expose only canonical public routes", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  const robotsText = await robots.text();
  expect(robotsText).toContain("Sitemap: https://www.cardstats.xyz/sitemap.xml");
  for (const agent of ["OAI-SearchBot", "Claude-SearchBot", "PerplexityBot", "Google-Extended", "bingbot"]) {
    expect(robotsText).toContain(`User-Agent: ${agent}`);
  }

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const sitemapText = await sitemap.text();
  expect(sitemapText).toContain("https://www.cardstats.xyz/cards/metamask-card");
  expect(sitemapText).not.toContain("/research");

  const llms = await request.get("/llms.txt");
  expect(llms.status()).toBe(200);
  expect(await llms.text()).toContain("CardStats is an independent global crypto-card catalog");

  const fullCatalog = await request.get("/llms-full.txt");
  expect(fullCatalog.status()).toBe(200);
  expect(fullCatalog.headers()["content-type"]).toContain("text/markdown");
  expect(await fullCatalog.text()).toContain("## MetaMask Card");

  const catalogApi = await request.get("/api/catalog");
  expect(catalogApi.status()).toBe(200);
  const agentCatalog = await catalogApi.json();
  expect(agentCatalog.cardCount).toBe(52);
  expect(agentCatalog.cards.some(({ canonicalUrl }: { canonicalUrl: string }) => canonicalUrl.endsWith("/metamask-card"))).toBe(true);

  const socialImage = await request.get("/opengraph-image");
  expect(socialImage.status()).toBe(200);
  expect(socialImage.headers()["content-type"]).toContain("image/png");
});

test("analytics provides accessible catalog data and an explicit licensed-data boundary", async ({ page }) => {
  await page.goto("/analytics");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("current catalog structured");
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
  await dialog.getByRole("checkbox", { name: /Ether\.fi Cash/i }).check();
  await dialog.getByRole("checkbox", { name: /Gnosis Pay/ }).check();
  await dialog.getByRole("button", { name: "Compare 3 cards" }).click();
  await expect(page).toHaveURL(/cards=metamask-card&cards=etherfi-card&cards=gnosis-card/);
  await expect(page.getByRole("table", { name: "Crypto card comparison" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: /MetaMask Card/ })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: /Ether\.fi Cash/i })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: /Gnosis Pay/ })).toBeVisible();
});

test("one Ready Card profile controls Lite and Metal plan details", async ({ page }) => {
  await page.goto("/cards/ready-card");
  await expect(page.getByRole("heading", { level: 1, name: "Ready Card" })).toBeVisible();
  const profilePlan = page.getByRole("combobox", { name: /Card plan/ });
  await expect(profilePlan).toContainText("Lite");
  await profilePlan.click();
  await page.getByRole("option", { name: "Metal" }).click();
  await expect(page).toHaveURL(/plans=card_plan%3Ametal/);
  await expect(page.getByRole("heading", { name: "Benefits & perks / Metal" })).toBeVisible();
  await expect(page.getByText(/Metal: \$120\/year/).first()).toBeVisible();
  await expect(page.getByText(/Metal partner offers/).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Visit website" })).toHaveAttribute("href", "https://www.ready.co/card");
  await page.getByRole("button", { name: "Compare", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Compare Ready Card" });
  await dialog.getByRole("checkbox", { name: /MetaMask Card/ }).check();
  await dialog.getByRole("button", { name: "Compare 2 cards" }).click();
  await expect(page).toHaveURL(/plans=ready-card%3Acard_plan%3Ametal/);
  const comparePlan = page.locator("#card-ready-card").getByRole("combobox", { name: /Ready Card Card plan/ });
  await expect(comparePlan).toContainText("Metal");
  await expect(page.getByText("$120/year", { exact: true })).toBeVisible();
  await expect(page.getByText("No issuer FX fee", { exact: true })).toBeVisible();
  await expect(page.getByText("$800/month without issuer ATM fees", { exact: true })).toBeVisible();
  await comparePlan.click();
  await page.locator("#card-ready-card").getByRole("option", { name: "Lite" }).click();
  await expect(page.getByText("$120/year", { exact: true })).toHaveCount(0);
  await expect(page.getByText("$800/month without issuer ATM fees", { exact: true })).toHaveCount(0);
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
