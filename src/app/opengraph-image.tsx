import { ImageResponse } from "next/og";

export const alt = "CardStats — compare crypto cards, fees, rewards, and tiers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px", background: "#f2f0e8", color: "#151515", fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "22px", fontSize: 34, fontWeight: 800 }}>
        <div style={{ width: 72, height: 72, display: "flex", alignItems: "center", justifyContent: "center", background: "#c7ff2f", fontSize: 28 }}>CS</div>
        <div style={{ display: "flex" }}>CardStats</div>
      </div>
      <div style={{ maxWidth: 980, display: "flex", flexDirection: "column", gap: "24px" }}>
        <div style={{ display: "flex", fontSize: 76, fontWeight: 800, lineHeight: 1.02, letterSpacing: "-3px" }}>Compare crypto cards with the plan included.</div>
        <div style={{ display: "flex", fontSize: 29, lineHeight: 1.35, color: "#55544f" }}>Fees, rewards, funding models, regions, tiers, and benefits in one independent global index.</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "2px solid #151515", paddingTop: "24px", fontSize: 22, fontWeight: 700 }}>
        <div style={{ display: "flex" }}>cardstats.xyz</div><div style={{ display: "flex", color: "#234ee8" }}>Crypto card intelligence</div>
      </div>
    </div>,
    size,
  );
}
