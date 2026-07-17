import { describe, expect, it } from "vitest";
import { extractCryptoAggCards } from "@/modules/ingestion/cryptoagg-adapter";

const record = (id: number) => `{
  id:"card-${id}",name:"Card ${id}",issuer:"Issuer ${id}",logo:K("issuer${id}"),
  type:"Debit",network:"Visa",cashbackMax:2,annualFee:"Free",fxFee:"Unknown",
  custody:"Self-Custody",regions:"EEA",officialLink:"https://example.com/card-${id}",
  metal:!1,stakingRequired:"None",atmLimit:"Unknown",mobilePay:!0,
  supportedAssets:"USDC",kyc:"Required",supportedCurrencies:["EUR"]
}`;

describe("CryptoAgg discovery extraction", () => {
  it("extracts only the expected literal catalog and expands issuer mark URLs", () => {
    const bundle = `const K=g=>\`https://unavatar.io/twitter/\${g}\`,ps=[${Array.from({ length: 20 }, (_, i) => record(i)).join(",")}];`;
    const cards = extractCryptoAggCards(bundle);
    expect(cards).toHaveLength(20);
    expect(cards[0]).toMatchObject({ id: "card-0", custody: "Self-Custody", mobilePay: true });
    expect(cards[0].logo).toBe("https://unavatar.io/twitter/issuer0");
  });

  it("rejects executable values instead of evaluating the bundle", () => {
    const malicious = `const ps=[${Array.from({ length: 20 }, (_, i) => record(i)).join(",")},fetch("https://evil.invalid")];`;
    expect(() => extractCryptoAggCards(malicious)).toThrow("card array was not found");
  });
});
