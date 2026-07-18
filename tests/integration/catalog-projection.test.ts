import { describe, expect, it } from "vitest";
import { getDiscoverySnapshot } from "@/modules/catalog/discovery";

describe("database catalog projection", () => {
  it("loads every catalog program and structured option from PostgreSQL", async () => {
    const { cards } = await getDiscoverySnapshot();
    expect(cards).toHaveLength(60);
    expect(cards.map(({ slug }) => slug)).toEqual(expect.arrayContaining([
      "solflare-card",
      "trustee-plus-card",
      "kraken-card",
      "bybit-card",
      "ready-card",
    ]));
    expect(cards.some(({ slug }) => slug === "ready-lite")).toBe(false);

    const ready = cards.find(({ slug }) => slug === "ready-card");
    expect(ready?.name).toBe("Ready Card");
    expect(ready?.dimensions[0].options.map(({ name }) => name)).toEqual(["Lite", "Metal"]);

    const bybit = cards.find(({ slug }) => slug === "bybit-card");
    expect(bybit?.dimensions[0].options.map(({ name }) => name)).toEqual(["Base", "Beta", "Alpha", "Apex", "Omega", "Infinite"]);
    expect(bybit?.dimensions[0].options.map(({ facts }) => facts.cashbackMax)).toEqual([
      "Base: $0 spend; 2%; $5 monthly cap",
      "Beta: VIP 1-2 or $500 spend; 2%; $50 monthly cap",
      "Alpha: VIP 3 or $3,500 spend; 4%; $150 monthly cap",
      "Apex: VIP 4/PRO 1 or $9,500 spend; 6%; $250 monthly cap",
      "Omega: VIP 5/PRO 2 or $12,500 spend; 8%; $400 monthly cap",
      "Infinite: Supreme/PRO 3-5 or $25,000 spend; 10%; $600 monthly cap",
    ]);
    expect(bybit?.dimensions[0].options[0].benefits).toHaveLength(0);
    expect(bybit?.dimensions[0].options[1].benefits.map(({ title }) => title)).toEqual(["AI Subscriptions", "Media Subscriptions"]);

    const wirex = cards.find(({ slug }) => slug === "wirex-card");
    expect(wirex?.dimensions.map(({ id, combinable }) => [id, combinable])).toEqual([
      ["subscription", true],
      ["loyalty_tier", true],
    ]);
  });
});
