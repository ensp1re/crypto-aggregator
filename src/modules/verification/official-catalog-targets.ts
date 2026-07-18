export type OfficialCatalogTarget = {
  key: string;
  name: string;
  issuer: string;
  officialUrl: string;
};

// This is collector configuration, not a public catalog. The collector persists
// these targets and their source observations to PostgreSQL; publication still
// requires normalized claims and independent approval.
export const officialCatalogTargets: OfficialCatalogTarget[] = [
  { key: "solflare-card", name: "Solflare Card", issuer: "Solflare", officialUrl: "https://www.solflare.com/crypto-card/" },
  { key: "trustee-plus-card", name: "Trustee Plus Card", issuer: "Trustee Plus", officialUrl: "https://trustee.io/" },
  { key: "kraken-card", name: "Kraken Card", issuer: "Kraken", officialUrl: "https://www.kraken.com/features/crypto-card" },
  { key: "okx-card", name: "OKX Card", issuer: "OKX", officialUrl: "https://www.okx.com/en-eu/learn/okx-card-europe-explained" },
  { key: "kucard", name: "KuCard", issuer: "KuCoin", officialUrl: "https://www.kucoin.com/support/33128183226777" },
  { key: "gate-card", name: "Gate Card", issuer: "Gate", officialUrl: "https://www.gate.com/card" },
  { key: "uphold-card", name: "Uphold Card", issuer: "Uphold", officialUrl: "https://uphold.com/en-us/products/debit-card" },
  { key: "bit2me-card", name: "Bit2Me Card", issuer: "Bit2Me", officialUrl: "https://www.bit2me.com/card" },
  { key: "tangem-pay", name: "Tangem Pay", issuer: "Tangem", officialUrl: "https://tangem.com/en/tangem-pay/" },
  { key: "revolut-crypto-card", name: "Revolut Crypto Card", issuer: "Revolut", officialUrl: "https://www.revolut.com/crypto/crypto-card/" },
  { key: "xapo-card", name: "Xapo Bank Card", issuer: "Xapo Bank", officialUrl: "https://www.xapobank.com/card" },
  { key: "coinjar-card", name: "CoinJar Card", issuer: "CoinJar", officialUrl: "https://www.coinjar.com/global/card" },
  { key: "coinspot-card", name: "CoinSpot Mastercard", issuer: "CoinSpot", officialUrl: "https://www.coinspot.com.au/card" },
  { key: "coinzoom-card", name: "CoinZoom Visa Card", issuer: "CoinZoom", officialUrl: "https://www.coinzoom.com/en/cards" },
  { key: "swissborg-card", name: "SwissBorg Card", issuer: "SwissBorg", officialUrl: "https://swissborg.com/blog/the-swissborg-card-is-here" },
  { key: "mexc-card", name: "MEXC Card", issuer: "MEXC", officialUrl: "https://www.mexc.com/en-GB/buy-crypto/mexc-card" },
  { key: "kolo-card", name: "Kolo Card", issuer: "Kolo", officialUrl: "https://kolo.xyz/" },
  { key: "mercuryo-spend", name: "Mercuryo Spend Card", issuer: "Mercuryo", officialUrl: "https://mercuryo.io/spend" },
  { key: "bybit-card", name: "Bybit Card", issuer: "Bybit", officialUrl: "https://www.bybit.com/en/cards" },
  { key: "kast-card", name: "KAST Card", issuer: "KAST", officialUrl: "https://www.kast.xyz/crypto-cards" },
];

export const officialCatalogTargetByKey = new Map(
  officialCatalogTargets.map((target) => [target.key, target]),
);
