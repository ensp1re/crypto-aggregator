import { describe, expect, it } from "vitest";
import { officialContentHash } from "@/modules/verification/collect-priority-official";
import { priorityOfficialSources } from "@/modules/verification/priority-official-sources";
import { officialCatalogTargets } from "@/modules/verification/official-catalog-targets";
import { legacyTierCandidateKeys } from "@/modules/verification/legacy-tier-sources";
import { remainingCatalogCandidateKeys } from "@/modules/verification/remaining-catalog-sources";
import { finalCatalogCandidateKeys, officialCatalogResearchBlockers } from "@/modules/verification/final-catalog-sources";
import { normalizeCandidatePlanResearch } from "@/modules/verification/candidate-plan-normalizer";

const allowedHosts = new Set([
  "support.metamask.io",
  "help.ether.fi",
  "help.gnosispay.com",
  "www.solflare.com",
  "trustee.io",
  "www.kraken.com",
  "www.kast.xyz",
  "concierge.kast.xyz",
  "www.bybit.com",
  "www.okx.com",
  "www.kucoin.com",
  "miniapp.gate.com",
  "support.uphold.com",
  "legal.bit2me.com",
  "tangem.com",
  "support.coinjar.com",
  "www.coinspot.com.au",
  "support.coinzoom.com",
  "swissborg.com",
  "www.mexc.com",
  "kolo.xyz",
  "help.mercuryo.io",
  "mercuryo.io",
  "nexo.com",
  "help.coinbase.com",
  "help.crypto.com",
  "help.ready.co",
  "www.plutus.it",
  "help.wirexapp.com",
  "support.bitpanda.com",
  "help.whitebit.com",
  "helpcenter.redotpay.com",
  "shop.ledger.com",
  "web3.bitget.com",
  "www.bitrefill.com",
  "help.bitrefill.com",
  "www.bleap.finance",
  "brighty.app",
  "docs.coca.xyz",
  "cypherhq.io",
  "docs.fiat24.com",
  "foldapp.com",
  "www.gemini.com",
  "www.oobit.com",
  "www.safepal.com",
  "help.tokenpocket.pro",
  "support.token.im",
  "docs.tria.so",
  "tuyo.com",
  "www.thorwallet.org",
  "venmo.com",
  "help.wayex.com",
  "docs.avici.money",
  "www.revolut.com",
  "savepay.gitbook.io",
  "ur.app",
  "legal.xapobank.com",
  "help.zypto.com",
]);

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

  it("covers the selected deep-verification candidates", () => {
    const candidates = new Set(priorityOfficialSources.map(({ candidateKey }) => candidateKey));
    expect(priorityOfficialSources).toHaveLength(64);
    expect(priorityOfficialSources.reduce((total, source) => total + source.facts.length, 0)).toBe(280);
    expect(candidates.size).toBe(52);
    expect(new Set([...candidates, ...officialCatalogResearchBlockers.map(({ candidateKey }) => candidateKey)]).size).toBe(60);
    expect(candidates).toEqual(new Set([
      ...officialCatalogTargets
        .filter(({ key }) => key !== "revolut-crypto-card" && key !== "xapo-card")
        .map(({ key }) => key),
      "metamask-card",
      "etherfi-card",
      "gnosis-card",
      ...legacyTierCandidateKeys,
      ...remainingCatalogCandidateKeys,
      ...finalCatalogCandidateKeys,
    ]));
  });

  it("records every uncollectable legacy candidate as an explicit blocker", () => {
    expect(officialCatalogResearchBlockers.map(({ candidateKey }) => candidateKey).sort()).toEqual([
      "Kripicard",
      "binance-card",
      "bitpay-card",
      "coinbase-card",
      "deblock-card",
      "revolut-crypto-card",
      "tapx-card",
      "xapo-card",
    ]);
    for (const blocker of officialCatalogResearchBlockers) {
      expect(new URL(blocker.officialUrl).protocol).toBe("https:");
      expect(blocker.reason.length).toBeGreaterThan(40);
    }
  });

  it("normalizes composable card plans, subscriptions, and reward tiers without splitting programs", () => {
    const profiles = normalizeCandidatePlanResearch(
      priorityOfficialSources,
      new Set(officialCatalogResearchBlockers.map(({ candidateKey }) => candidateKey)),
    );
    const profile = (candidateKey: string) => profiles.find((item) => item.candidateKey === candidateKey);
    const options = (candidateKey: string, dimension: string) => profile(candidateKey)?.dimensions
      .find(({ slug }) => slug === dimension)?.options.map(({ name }) => name);

    expect(options("ready-lite", "card_plan")).toEqual(["Lite", "Metal"]);
    expect(options("metamask-card", "card_plan")).toEqual(["Virtual", "Metal"]);
    expect(options("etherfi-card", "card_plan")).toEqual(["Core", "Luxe", "Pinnacle", "VIP"]);
    expect(options("bybit-card", "reward_tier")).toEqual(["Base", "Beta", "Alpha", "Apex", "Omega", "Infinite"]);
    expect(options("coca-card", "membership_level")).toEqual(["Starter", "Standard", "Standard+", "Premium", "Premium+", "Elite"]);
    expect(options("wirex-card", "subscription")).toEqual(["Standard", "Premium", "Elite"]);
    expect(options("wirex-card", "loyalty_tier")).toEqual(["Entry", "Enhanced", "Ultimate"]);
    expect(profile("wirex-card")?.dimensions.every(({ combinable }) => combinable)).toBe(true);
    expect(profiles.filter(({ status }) => status === "STRUCTURED")).toHaveLength(30);
    expect(profiles.filter(({ status }) => status === "PARTIAL").map(({ candidateKey }) => candidateKey).sort()).toEqual([
      "brighty-card",
      "safepal-card",
      "swissborg-card",
      "whitebit-card",
    ]);
  });

  it("uses normalized verified text rather than volatile page markup for artifact identity", () => {
    const verifiedText = "Annual fee: zero. Network: Visa.";
    expect(officialContentHash(" Annual fee: zero.\nNetwork:   Visa. ")).toBe(officialContentHash(verifiedText));
    expect(officialContentHash(verifiedText)).not.toBe(officialContentHash(`${verifiedText} Changed.`));
  });

});
