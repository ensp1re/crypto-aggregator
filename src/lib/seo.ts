import type { Metadata } from "next";

export const SITE_NAME = "CardStats";
export const SITE_URL = "https://www.cardstats.xyz";
export const SITE_DESCRIPTION = "Compare crypto cards by eligibility, fees, rewards, funding model, and available plans. Check source-linked card details before you apply.";
export const SOCIAL_IMAGE = "/opengraph-image";

type PageMetadataInput = {
  description: string;
  index?: boolean;
  path: string;
  title: string;
};

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

export function pageMetadata({ description, index = true, path, title }: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    robots: {
      index,
      follow: true,
      googleBot: {
        index,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: SITE_NAME,
      title,
      description,
      url: path,
      images: [{ url: SOCIAL_IMAGE, width: 1200, height: 630, alt: "CardStats crypto card comparison" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [SOCIAL_IMAGE],
    },
  };
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function compactDescription(value: string, maxLength = 160) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  const clipped = normalized.slice(0, maxLength - 1);
  const boundary = clipped.lastIndexOf(" ");
  return `${clipped.slice(0, boundary > maxLength * 0.7 ? boundary : undefined).replace(/[,:;.-]+$/, "")}…`;
}

export function organizationReference() {
  return { "@id": `${SITE_URL}/#organization` };
}
