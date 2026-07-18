"use client";

import { useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { IssuerMark } from "./issuer-mark";
import { CustomSelect } from "./custom-select";
import { comparisonHref } from "@/modules/catalog/comparison";
import type { DiscoveryCard } from "@/modules/catalog/discovery";
import {
  benefitSummary,
  getCardFact,
  getProgramName,
  selectionKey,
  type BenefitKind,
  type CardFactKey,
} from "@/modules/catalog/program-details";

const groups = [
  { label: "Access", rows: [["Regions", "regions"], ["KYC", "kyc"]] },
  { label: "Funding and card model", rows: [["Funding model", "custody"], ["Funding or top-up fee", "fundingFee"], ["Card model", "type"], ["Network", "network"], ["Supported assets", "supportedAssets"]] },
  { label: "Cost and access limits", rows: [["Annual fee", "annualFee"], ["FX fee", "fxFee"], ["ATM limit", "atmLimit"]] },
  { label: "Rewards and requirements", rows: [["Rewards", "cashbackMax"], ["Requirements", "stakingRequired"]] },
  { label: "Benefits and perks", rows: [["Travel", "travel"], ["Subscriptions", "subscriptions"], ["Partner offers", "partner"], ["Mobile wallets", "wallet"]] },
] as const;

type ComparisonKey = CardFactKey | Exclude<BenefitKind, "rewards">;

export function ComparisonTable({ cards, plans }: { cards: DiscoveryCard[]; plans: Record<string, string> }) {
  const router = useRouter();
  const [localPlans, setLocalPlans] = useState(plans);
  const [differencesOnly, setDifferencesOnly] = useState(false);
  const [activeCard, setActiveCard] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollId = useId();
  const visibleGroups = useMemo(() => groups.map((group) => ({
    ...group,
    rows: group.rows.filter(([, key]) => {
      const values = cards.map((card) => displayValue(card, key, localPlans));
      if (isBenefitKey(key) && values.every((value) => value === "Not disclosed")) return false;
      return !differencesOnly || new Set(values).size > 1;
    }),
  })).filter((group) => group.rows.length > 0), [cards, differencesOnly, localPlans]);
  const visibleRowCount = visibleGroups.reduce((total, group) => total + group.rows.length, 0);

  const changePlan = (cardSlug: string, dimensionId: string, optionId: string) => {
    const nextPlans = { ...localPlans, [selectionKey(cardSlug, dimensionId)]: optionId };
    setLocalPlans(nextPlans);
    router.replace(comparisonHref(cards.map((item) => item.slug), nextPlans), { scroll: false });
  };

  const scrollTable = (direction: -1 | 1) => {
    const container = scrollRef.current;
    if (!container) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cardColumn = container.querySelector<HTMLTableCellElement>("thead th:nth-child(2)");
    container.scrollBy({ left: direction * (cardColumn?.getBoundingClientRect().width ?? 240), behavior: reduceMotion ? "auto" : "smooth" });
  };

  const trackCard = () => {
    const container = scrollRef.current;
    const cardColumn = container?.querySelector<HTMLTableCellElement>("thead th:nth-child(2)");
    if (!container || !cardColumn) return;
    setActiveCard(Math.min(cards.length - 1, Math.max(0, Math.round(container.scrollLeft / cardColumn.getBoundingClientRect().width))));
  };

  return (
    <section className="comparison-surface" aria-labelledby="comparison-table-title">
      <div className="comparison-toolbar">
        <div><p className="kicker">Card details / {visibleRowCount} factors</p><h2 id="comparison-table-title">Compare every factor</h2></div>
        <label className="difference-toggle"><input type="checkbox" checked={differencesOnly} onChange={(event) => setDifferencesOnly(event.target.checked)} /> <span>Differences only</span></label>
      </div>
      <div className="mobile-table-guide">
        <p><strong>{cards[activeCard]?.name}</strong><span>{activeCard + 1} of {cards.length}</span></p>
        <div>
          <button type="button" aria-label="Scroll comparison left" aria-controls={scrollId} onClick={() => scrollTable(-1)}><ChevronLeft aria-hidden="true" size={19} /></button>
          <button type="button" aria-label="Scroll comparison right" aria-controls={scrollId} onClick={() => scrollTable(1)}><ChevronRight aria-hidden="true" size={19} /></button>
        </div>
      </div>
      <div ref={scrollRef} id={scrollId} className="compare-table-scroll" tabIndex={0} aria-label="Scrollable card comparison" onScroll={trackCard}>
        <span className="sr-only" aria-live="polite">Comparison values update when a card option changes.</span>
        <table className="compare-table" style={{ minWidth: `${160 + cards.length * 240}px` }}>
          <caption>Crypto card comparison</caption>
          <colgroup><col className="factor-col" />{cards.map((card) => <col className="card-col" key={card.id} />)}</colgroup>
          <thead>
            <tr>
              <th className="factor-column" scope="col">Decision factor</th>
              {cards.map((card) => {
                const remainingCards = cards.filter((item) => item.slug !== card.slug);
                const remainingPlans = Object.fromEntries(Object.entries(localPlans).filter(([key]) => !key.startsWith(`${card.slug}.`)));
                const name = getProgramName(card);
                return <th id={`card-${card.slug}`} scope="col" key={card.id}>
                  <div className="compare-card-heading">
                    <IssuerMark issuer={card.issuer} src={card.logo} alt={card.media?.alt} size={42} />
                    <span className="compare-card-copy"><strong><Link href={`/cards/${card.slug}`}>{name}</Link></strong><small>{card.issuer}</small>
                      {card.dimensions.map((dimension) => <div className="compare-plan-control" key={dimension.id}>
                        <span>{dimension.label}</span>
                        <CustomSelect
                          compact
                          hideLabel
                          label={`${name} ${dimension.label}`}
                          options={dimension.options.map((option) => ({ label: option.name, value: option.id }))}
                          value={localPlans[selectionKey(card.slug, dimension.id)] ?? dimension.options[0]?.id}
                          onValueChange={(optionId) => changePlan(card.slug, dimension.id, optionId)}
                        />
                      </div>)}
                    </span>
                    <span className="compare-card-actions">
                      <Link href={comparisonHref(remainingCards.map((item) => item.slug), remainingPlans)} aria-label={`Remove ${name} from comparison`}><X aria-hidden="true" size={16} /></Link>
                    </span>
                  </div>
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
                {cards.map((card) => <td headers={`${rowId} card-${card.slug}`} key={card.id}><span className="compare-value">{displayValue(card, key, localPlans)}</span></td>)}
              </tr>;
            })}
          </tbody>)}
        </table>
        {visibleGroups.length === 0 ? <p className="compare-no-differences">These selected cards match on every currently visible factor.</p> : null}
      </div>
    </section>
  );
}

function displayValue(card: DiscoveryCard, key: ComparisonKey, plans: Record<string, string>) {
  if (isBenefitKey(key)) {
    return benefitSummary(card, plans, key);
  }
  return getCardFact(card, key, plans);
}

function isBenefitKey(key: ComparisonKey): key is Exclude<BenefitKind, "rewards"> {
  return key === "travel" || key === "subscriptions" || key === "partner" || key === "wallet";
}
