import { describe, expect, it } from "vitest";
import { comparisonHref, normalizeComparisonSlugs } from "@/modules/catalog/comparison";
import { getProgramPlan, resolveProgramPlans } from "@/modules/catalog/program-details";

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
    expect(comparisonHref(["metamask-card", "ready-lite"], { "ready-lite": "metal" }))
      .toBe("/compare?cards=metamask-card&cards=ready-lite&plans=ready-lite%3Ametal");
  });

  it("keeps a program as one card while resolving its selected plan", () => {
    expect(getProgramPlan("ready-lite")?.name).toBe("Lite");
    expect(getProgramPlan("ready-lite", "metal")?.name).toBe("Metal");
    expect(resolveProgramPlans(["ready-lite", "wirex-card"], ["ready-lite:metal", "wirex-card:unknown"]))
      .toEqual({ "ready-lite": "metal" });
  });
});
