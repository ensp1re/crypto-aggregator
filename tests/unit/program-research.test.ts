import { describe, expect, it } from "vitest";
import type { DiscoveryCard } from "@/modules/catalog/discovery";
import { getCardFact, getProgramBenefits, selectionKey } from "@/modules/catalog/program-details";

const card = {
  slug: "wirex-card",
  facts: { annualFee: "Base fee" },
  benefits: [{ kind: "wallet", title: "Mobile wallets", description: "Apple Pay and Google Pay" }],
  dimensions: [
    {
      id: "subscription",
      label: "Subscription",
      kind: "SUBSCRIPTION",
      combinable: true,
      options: [{ id: "premium", name: "Premium", summary: "Premium", tierOrder: 1, facts: { annualFee: "€9.99/month" }, benefits: [], }],
    },
    {
      id: "loyalty_tier",
      label: "Loyalty tier",
      kind: "LOYALTY_TIER",
      combinable: true,
      options: [{ id: "enhanced", name: "Enhanced", summary: "Enhanced", tierOrder: 1, facts: { cashbackMax: "2%" }, benefits: [{ kind: "rewards", title: "Enhanced rewards", description: "2%" }] }],
    },
  ],
} as DiscoveryCard;

const selections = {
  [selectionKey("wirex-card", "subscription")]: "premium",
  [selectionKey("wirex-card", "loyalty_tier")]: "enhanced",
};

describe("database-backed program projection", () => {
  it("combines independent selected dimensions", () => {
    expect(getCardFact(card, "annualFee", selections)).toBe("€9.99/month");
    expect(getCardFact(card, "cashbackMax", selections)).toBe("2%");
  });

  it("combines program and selected-option benefits", () => {
    expect(getProgramBenefits(card, selections).map(({ title }) => title)).toEqual(["Mobile wallets", "Enhanced rewards"]);
  });
});
