import { describe, expect, it } from "vitest";
import { comparisonHref, normalizeComparisonSlugs } from "@/modules/catalog/comparison";

const available = ["metamask-card", "etherfi-card", "gnosis-card", "coinbase-card", "nexo-card"];

describe("comparison selection", () => {
  it("preserves requested order while removing duplicates and unavailable slugs", () => {
    expect(normalizeComparisonSlugs(
      ["GNOSIS-CARD", "missing-card", "metamask-card", "gnosis-card"],
      available,
    )).toEqual(["gnosis-card", "metamask-card"]);
  });

  it("enforces the four-card comparison boundary", () => {
    expect(normalizeComparisonSlugs(available, available)).toEqual(available.slice(0, 4));
  });

  it("builds a shareable URL with repeated card parameters", () => {
    expect(comparisonHref(["metamask-card", "etherfi-card"]))
      .toBe("/compare?cards=metamask-card&cards=etherfi-card");
  });
});
