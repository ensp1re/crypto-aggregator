import { describe, expect, it } from "vitest";
import { SITE_DESCRIPTION, SITE_URL, absoluteUrl, compactDescription, pageMetadata, serializeJsonLd } from "@/lib/seo";

describe("SEO helpers", () => {
  it("builds canonical URLs on the public www host", () => {
    expect(absoluteUrl("/cards/ready-card")).toBe(`${SITE_URL}/cards/ready-card`);
    expect(absoluteUrl("https://issuer.example/card")).toBe("https://issuer.example/card");
  });

  it("creates indexable canonical and social metadata", () => {
    const metadata = pageMetadata({ title: "Compare cards", description: "Compare card details.", path: "/compare" });
    expect(metadata.alternates).toEqual({ canonical: "/compare" });
    expect(metadata.robots).toMatchObject({ index: true, follow: true });
    expect(metadata.openGraph).toMatchObject({ url: "/compare", title: "Compare cards" });
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });
  });

  it("keeps descriptions compact and JSON-LD safe", () => {
    expect(SITE_DESCRIPTION.length).toBeLessThanOrEqual(160);
    expect(SITE_DESCRIPTION).toContain("source-linked card details");
    const description = compactDescription("word ".repeat(80));
    expect(description.length).toBeLessThanOrEqual(160);
    expect(serializeJsonLd({ value: "</script><script>alert(1)</script>" })).not.toContain("<script>");
    expect(serializeJsonLd({ value: "</script>" })).toContain("\\u003c/script>");
  });
});
