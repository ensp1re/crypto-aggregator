export type OfficialIssuerMedia = {
  path: string;
  alt: string;
  width: number;
  height: number;
  sourcePage: string;
  sourceAsset: string;
  observedAt: string;
  contentHash: `sha256:${string}`;
  rightsBasis: string;
};

export const officialIssuerMedia: Record<string, OfficialIssuerMedia> = {
  "metamask-card": {
    path: "/issuer-marks/metamask.svg",
    alt: "MetaMask fox symbol",
    width: 142,
    height: 137,
    sourcePage: "https://metamask.io/en-GB/assets",
    sourceAsset: "https://images.ctfassets.net/clixtyxoaeas/1ezuBGezqfIeifWdVtwU4c/d970d4cdf13b163efddddd5709164d2e/MetaMask-icon-Fox.svg",
    observedAt: "2026-07-17",
    contentHash: "sha256:5ddcb06dbeba86fc593af5d50032c6839088f3fb21c6e66514b8f16f210d8d0a",
    rightsBasis: "Official brand asset used for nominative editorial identification",
  },
  "etherfi-card": {
    path: "/issuer-marks/etherfi.png",
    alt: "ether.fi symbol",
    width: 167,
    height: 167,
    sourcePage: "https://www.ether.fi/cash",
    sourceAsset: "https://www.ether.fi/images/favicon/apple-touch-icon-167x167.png",
    observedAt: "2026-07-17",
    contentHash: "sha256:5e5dfada129fe12b77c1b33b10e7d05c965439461ec4a0d1290548c4c420a4c4",
    rightsBasis: "Official site asset used for nominative editorial identification",
  },
  "gnosis-card": {
    path: "/issuer-marks/gnosis-pay.png",
    alt: "Gnosis Pay owl symbol",
    width: 512,
    height: 512,
    sourcePage: "https://gnosispay.com/card",
    sourceAsset: "https://framerusercontent.com/images/IiZmjYZkRmMpfDkowhO3HU2bcY.png",
    observedAt: "2026-07-17",
    contentHash: "sha256:431b3d3883b4473902c991b6d5d124f3ebc270e49b2d204234886d424883d42c",
    rightsBasis: "Official site asset used for nominative editorial identification",
  },
};
