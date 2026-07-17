import { describe, expect, it } from "vitest";
import { isResearchWorkbenchAvailable } from "@/lib/research-access";
import { getAtlasProgram } from "@/modules/catalog/queries";

describe("research workbench deployment boundary", () => {
  it("is available for the local synthetic workflow", () => {
    expect(isResearchWorkbenchAvailable({ VERCEL: undefined })).toBe(true);
  });

  it("fails closed on Vercel", () => {
    expect(isResearchWorkbenchAvailable({ VERCEL: "1" })).toBe(false);
  });

  it("serves the complete read-only synthetic snapshot without a hosted database", async () => {
    const original = process.env.VERCEL;
    process.env.VERCEL = "1";
    try {
      const program = await getAtlasProgram();
      expect(program.offerings).toHaveLength(2);
      expect(program.offerings.flatMap((offering) => offering.publishedClaims)).toHaveLength(24);
    } finally {
      if (original === undefined) delete process.env.VERCEL;
      else process.env.VERCEL = original;
    }
  });
});
