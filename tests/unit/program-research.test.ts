import { describe, expect, it } from "vitest";
import snapshot from "@/modules/catalog/discovery-snapshot.json";
import { getProgramBenefits, getProgramDetails } from "@/modules/catalog/program-details";
import { programResearch } from "@/modules/catalog/program-research";

describe("official card program research", () => {
  it("covers every catalog program with a direct source and explicit scope", () => {
    expect(Object.keys(programResearch)).toHaveLength(42);
    for (const card of snapshot.cards) {
      const research = programResearch[card.id.toLowerCase()];
      expect(research, card.id).toBeDefined();
      if (card.id !== "tapx-card") {
        expect(research.officialUrl).toMatch(/^https:\/\//);
        expect(research.sourceUrl).toMatch(/^https:\/\//);
      }
      expect(research.availability.length).toBeGreaterThan(5);
      expect(research.scope.length).toBeGreaterThan(20);
    }
  });

  it("uses program names instead of duplicating plans as cards", () => {
    expect(programResearch.kripicard.name).toBe("Kripicard");
    expect(programResearch["ready-lite"].name).toBe("Ready Card");
    expect(programResearch["whitebit-card"].name).toBe("WhiteBIT Nova");
  });

  it("publishes selectors only for source-backed one-dimensional choices", () => {
    expect(getProgramDetails("ready-lite")?.selectionLabel).toBe("plan");
    expect(getProgramDetails("fold-card")?.selectionLabel).toBe("membership");
    expect(getProgramDetails("redotpay-card")?.selectionLabel).toBe("subscription");
    expect(getProgramDetails("fiat24-card")?.selectionLabel).toBe("account tier");
    expect(getProgramDetails("plutus-card")?.plans).toBeUndefined();
    expect(getProgramDetails("coca-card")?.plans).toBeUndefined();
  });

  it("keeps future and dated benefits visibly qualified", () => {
    expect(getProgramBenefits("ready-lite").find((benefit) => benefit.status === "coming-soon")?.title)
      .toBe("Subscription savings");
    expect(getProgramBenefits("gnosis-card").find((benefit) => benefit.status === "time-limited")?.validUntil)
      .toBe("30 September 2026");
  });
});
