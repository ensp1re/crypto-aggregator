import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { officialIssuerMedia } from "@/modules/catalog/official-media";

const allowedHosts = new Set(["metamask.io", "images.ctfassets.net", "www.ether.fi", "gnosispay.com", "framerusercontent.com"]);

describe("official issuer media", () => {
  it("pins the three priority marks to their observed official bytes and sources", () => {
    expect(Object.keys(officialIssuerMedia).sort()).toEqual(["etherfi-card", "gnosis-card", "metamask-card"]);

    for (const media of Object.values(officialIssuerMedia)) {
      const pageUrl = new URL(media.sourcePage);
      const assetUrl = new URL(media.sourceAsset);
      expect(pageUrl.protocol).toBe("https:");
      expect(assetUrl.protocol).toBe("https:");
      expect(allowedHosts.has(pageUrl.hostname)).toBe(true);
      expect(allowedHosts.has(assetUrl.hostname)).toBe(true);
      expect(media.width).toBeGreaterThan(0);
      expect(media.height).toBeGreaterThan(0);

      const bytes = readFileSync(new URL(`../../public${media.path}`, import.meta.url));
      expect(`sha256:${createHash("sha256").update(bytes).digest("hex")}`).toBe(media.contentHash);
    }
  });
});
