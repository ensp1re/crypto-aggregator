"use client";

import { useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { IssuerMark } from "./issuer-mark";
import { comparisonHref } from "@/modules/catalog/comparison";
import type { DiscoveryCard } from "@/modules/catalog/discovery";
import {
  benefitSummary,
  getCardFact,
  getProgramDetails,
  getProgramName,
  getProgramPlan,
  type BenefitKind,
  type CardFactKey,
} from "@/modules/catalog/program-details";

const groups = [
  { label: "Access", rows: [["Current status", "availability"], ["Product scope", "scope"], ["Regions", "regions"], ["KYC", "kyc"]] },
  { label: "Funding and card model", rows: [["Funding model", "custody"], ["Funding or top-up fee", "fundingFee"], ["Card model", "type"], ["Network", "network"], ["Supported assets", "supportedAssets"]] },
  { label: "Cost and access limits", rows: [["Annual fee", "annualFee"], ["FX fee", "fxFee"], ["ATM limit", "atmLimit"]] },
  { label: "Rewards and requirements", rows: [["Rewards", "cashbackMax"], ["Requirements", "stakingRequired"]] },
  { label: "Benefits and perks", rows: [["Travel", "travel"], ["Subscriptions", "subscriptions"], ["Partner offers", "partner"], ["Mobile wallets", "wallet"]] },
] as const;

type ComparisonKey = CardFactKey | Exclude<BenefitKind, "rewards"> | "availability" | "scope";

export function ComparisonTable({ cards, plans }: { cards: DiscoveryCard[]; plans: Record<string, string> }) {
  const [differencesOnly, setDifferencesOnly] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollId = useId();
  const visibleGroups = useMemo(() => groups.map((group) => ({
    ...group,
    rows: group.rows.filter(([, key]) => {
      const values = cards.map((card) => displayValue(card, key, plans[card.slug]));
      if (isBenefitKey(key) && values.every((value) => value === "No details yet")) return false;
      return !differencesOnly || new Set(values).size > 1;
    }),
  })).filter((group) => group.rows.length > 0), [cards, differencesOnly, plans]);

  const scrollTable = (direction: -1 | 1) => {
    const container = scrollRef.current;
    if (!container) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    container.scrollBy({ left: direction * Math.max(240, container.clientWidth * 0.7), behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <section className="comparison-surface" aria-labelledby="comparison-table-title">
      <div className="comparison-toolbar">
        <div><p className="kicker">Card details</p><h2 id="comparison-table-title">Compare every factor</h2></div>
        <label className="difference-toggle"><input type="checkbox" checked={differencesOnly} onChange={(event) => setDifferencesOnly(event.target.checked)} /> <span>Differences only</span></label>
      </div>
      <div className="mobile-table-guide">
        <p>Scroll the table horizontally to inspect every selected card.</p>
        <div>
          <button type="button" aria-label="Scroll comparison left" aria-controls={scrollId} onClick={() => scrollTable(-1)}><ChevronLeft aria-hidden="true" size={19} /></button>
          <button type="button" aria-label="Scroll comparison right" aria-controls={scrollId} onClick={() => scrollTable(1)}><ChevronRight aria-hidden="true" size={19} /></button>
        </div>
      </div>
      <div ref={scrollRef} id={scrollId} className="compare-table-scroll" tabIndex={0} aria-label="Scrollable card comparison">
        <table className="compare-table" style={{ minWidth: `${11 + cards.length * 13}rem` }}>
          <caption>Crypto card comparison</caption>
          <thead>
            <tr>
              <th className="factor-column" scope="col">Decision factor</th>
              {cards.map((card) => {
                const details = getProgramDetails(card.slug);
                const selectedPlan = getProgramPlan(card.slug, plans[card.slug]);
                const remainingCards = cards.filter((item) => item.slug !== card.slug);
                const remainingPlans = Object.fromEntries(Object.entries(plans).filter(([slug]) => slug !== card.slug));
                const name = getProgramName(card);
                return <th id={`card-${card.slug}`} scope="col" key={card.id}>
                  <div className="compare-card-heading">
                    <IssuerMark issuer={card.issuer} src={card.logo} alt={card.media?.alt} size={42} />
                    <span><strong><Link href={`/cards/${card.slug}${selectedPlan ? `?plan=${selectedPlan.id}` : ""}`}>{name}</Link></strong><small>{selectedPlan?.name ?? card.issuer}</small></span>
                    <span className="compare-card-actions">
                      <Link href={comparisonHref(remainingCards.map((item) => item.slug), remainingPlans)} aria-label={`Remove ${name} from comparison`}><X aria-hidden="true" size={16} /></Link>
                    </span>
                  </div>
                  {details?.plans?.length ? <div className="compare-plan-tabs" aria-label={`${name} ${details.selectionLabel ?? "card option"}`}>
                    {details.plans.map((plan) => <Link
                      aria-current={selectedPlan?.id === plan.id ? "true" : undefined}
                      href={comparisonHref(cards.map((item) => item.slug), { ...plans, [card.slug]: plan.id })}
                      key={plan.id}
                    >{plan.name}</Link>)}
                  </div> : null}
                </th>;
              })}
            </tr>
          </thead>
          {visibleGroups.map((group) => <tbody key={group.label}>
            <tr className="compare-group"><th colSpan={cards.length + 1}>{group.label}</th></tr>
            {group.rows.map(([label, key]) => {
              const rowId = `factor-${key}`;
              return <tr key={key}>
                <th id={rowId} className="factor-column" scope="row">{label}</th>
                {cards.map((card) => <td headers={`${rowId} card-${card.slug}`} key={card.id}>{displayValue(card, key, plans[card.slug])}</td>)}
              </tr>;
            })}
          </tbody>)}
        </table>
      </div>
    </section>
  );
}

function displayValue(card: DiscoveryCard, key: ComparisonKey, planId?: string) {
  if (key === "availability" || key === "scope") {
    return getProgramDetails(card.slug)?.[key] ?? "Details unavailable";
  }
  if (isBenefitKey(key)) {
    return benefitSummary(card.slug, planId, key);
  }
  return getCardFact(card, key, planId);
}

function isBenefitKey(key: ComparisonKey): key is Exclude<BenefitKind, "rewards"> {
  return key === "travel" || key === "subscriptions" || key === "partner" || key === "wallet";
}
