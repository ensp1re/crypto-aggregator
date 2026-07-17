import type { ValueState } from "@/generated/prisma/enums";

export type PublishedClaimView = {
  planId: string | null;
  field: string;
  valueState: ValueState;
  displayValue: string;
  observedAt: Date;
  publishedAt: Date;
  claim: {
    evidence: Array<{
      artifact: {
        locator: string;
        rightsStatus: string;
        source: { title: string; authorityTier: string; sourceType: string };
      };
    }>;
  };
};

export type AtlasProgramView = {
  name: string;
  offerings: Array<{
    id: string;
    slug: string;
    label: string;
    countryCode: string;
    lifecycle: string;
    network: string;
    cardType: string;
    settlementModel: string;
    issuer: { name: string };
    plans: Array<{
      id: string;
      name: string;
      tierOrder: number;
      qualification: string;
    }>;
    publishedClaims: PublishedClaimView[];
  }>;
};
