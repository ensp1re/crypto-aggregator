import { describe, expect, it } from "vitest";
import { comparisonHref, normalizeComparisonSlugs } from "@/modules/catalog/comparison";
import { getProgramPlan, resolveProgramPlans, selectionKey } from "@/modules/catalog/program-details";
import type { DiscoveryCard } from "@/modules/catalog/discovery";

const available = ["metamask-card", "etherfi-card", "gnosis-card", "coinbase-card", "nexo-card"];

function card(slug: string, dimensions: DiscoveryCard["dimensions"]): DiscoveryCard {
  return { slug, dimensions } as DiscoveryCard;
}

const ready = card("ready-card", [{
  id: "card_plan",
  label: "Card plan",
  kind: "CARD_PLAN",
  combinable: false,
  options: [
    { id: "lite", name: "Lite", summary: "Lite", tierOrder: 1, facts: {}, benefits: [] },
    { id: "metal", name: "Metal", summary: "Metal", tierOrder: 2, facts: {}, benefits: [] },
  ],
}]);
const wirex = card("wirex-card", [
  { id: "subscription", label: "Subscription", kind: "SUBSCRIPTION", combinable: true, options: [{ id: "standard", name: "Standard", summary: "Standard", tierOrder: 1, facts: {}, benefits: [] }] },
  { id: "loyalty_tier", label: "Loyalty tier", kind: "LOYALTY_TIER", combinable: true, options: [{ id: "entry", name: "Entry", summary: "Entry", tierOrder: 1, facts: {}, benefits: [] }] },
]);

describe("comparison selection", () => {
  it("preserves requested order while removing duplicates and unavailable slugs", () => {
    expect(normalizeComparisonSlugs(["GNOSIS-CARD", "missing-card", "metamask-card", "gnosis-card"], available))
      .toEqual(["gnosis-card", "metamask-card"]);
  });

  it("enforces the four-card comparison boundary", () => {
    expect(normalizeComparisonSlugs(available, available)).toEqual(available.slice(0, 4));
  });

  it("builds a shareable URL with card and dimension selections", () => {
    expect(comparisonHref(["metamask-card", "ready-card"], { "ready-card.card_plan": "metal" }))
      .toBe("/compare?cards=metamask-card&cards=ready-card&plans=ready-card%3Acard_plan%3Ametal");
  });

  it("keeps one program column while resolving independent dimensions", () => {
    expect(getProgramPlan(ready)?.name).toBe("Lite");
    expect(getProgramPlan(ready, "metal")?.name).toBe("Metal");
    expect(resolveProgramPlans([ready, wirex], ["ready-card:card_plan:metal", "wirex-card:loyalty_tier:entry"]))
      .toEqual({
        [selectionKey("ready-card", "card_plan")]: "metal",
        [selectionKey("wirex-card", "subscription")]: "standard",
        [selectionKey("wirex-card", "loyalty_tier")]: "entry",
      });
  });
});
