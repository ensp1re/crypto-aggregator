import { describe, expect, it } from "vitest";
import { officialContentHash } from "@/modules/verification/collect-priority-official";
import { getOfficialObservations } from "@/modules/catalog/official-observations";
import { priorityOfficialSources } from "@/modules/verification/priority-official-sources";

const allowedHosts = new Set(["support.metamask.io", "help.ether.fi", "help.gnosispay.com"]);

describe("priority official-source definitions", () => {
  it("uses unique, allowlisted HTTPS sources and evidence keys", () => {
    const slugs = priorityOfficialSources.map(({ slug }) => slug);
    expect(new Set(slugs).size).toBe(slugs.length);

    const evidenceKeys: string[] = [];
    for (const source of priorityOfficialSources) {
      const url = new URL(source.url);
      expect(url.protocol).toBe("https:");
      expect(allowedHosts.has(url.hostname)).toBe(true);
      expect(source.facts.length).toBeGreaterThan(0);

      for (const fact of source.facts) {
        expect(fact.displayValue.trim()).not.toBe("");
        expect(fact.requiredTerms.length).toBeGreaterThan(0);
        expect(Object.keys(fact.scopeJson).length).toBeGreaterThan(0);
        evidenceKeys.push(`${source.candidateKey}:${source.slug}:${fact.fieldKey}`);
      }
    }

    expect(new Set(evidenceKeys).size).toBe(evidenceKeys.length);
  });

  it("keeps the initial batch limited to the three selected candidates", () => {
    const candidates = new Set(priorityOfficialSources.map(({ candidateKey }) => candidateKey));
    expect(candidates).toEqual(new Set(["metamask-card", "etherfi-card", "gnosis-card"]));
  });

  it("uses normalized verified text rather than volatile page markup for artifact identity", () => {
    const verifiedText = "Annual fee: zero. Network: Visa.";
    expect(officialContentHash(" Annual fee: zero.\nNetwork:   Visa. ")).toBe(officialContentHash(verifiedText));
    expect(officialContentHash(verifiedText)).not.toBe(officialContentHash(`${verifiedText} Changed.`));
  });

  it("builds a review-pending public projection without typographic range dashes", () => {
    expect(getOfficialObservations("metamask-card")).toHaveLength(8);
    expect(getOfficialObservations("etherfi-card")).toHaveLength(7);
    expect(getOfficialObservations("gnosis-card")).toHaveLength(9);
    for (const observation of getOfficialObservations("gnosis-card")) {
      expect(observation.value).not.toMatch(/[—–]/);
      expect(new URL(observation.sourceUrl).protocol).toBe("https:");
    }
  });
});
