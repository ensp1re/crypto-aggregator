# Milestones, gates, and success criteria

## Summary timeline

| Milestone | Timing | Primary outcome |
|---|---:|---|
| M0: Scope and taxonomy locked | End week 2 | Ten gold records and validated decision model |
| M1: Research system can publish manually | End week 5 | Auditable claims and usable design foundation |
| M2: Core consumer journey works | End week 9 | 25-card country/finder/compare experience |
| M3: Freshness operations work | End week 12 | Automated detection + human publication, 40–60 cards |
| M4: Private beta accepted | End week 14 | Security, accessibility, data, and recovery gates pass |
| M5: Public beta | End week 16 | Limited-country launch with transparent coverage |
| M6: Retention proof | Months 5–8 | Alerts and scenario value create repeat use |
| M7: Data-business proof | Months 9–12 | Three paid/design data partners and API requirements |

## M0 — scope and taxonomy locked

### Deliverables

- Inclusion/lifecycle and priority-country policy.
- Ten independently researched gold programs.
- Program/offering/plan/entity/evidence schema proposal.
- Source rights and artifact-retention opinion from counsel.
- Tested finder/comparison/evidence prototype.
- Initial metric definitions and commercial neutrality policy.

### Gate

- At least two complex regional/tier programs fit without copying facts or destructive exceptions.
- Five usability participants can identify eligible scope and source evidence.
- No unresolved legal issue makes planned acquisition method untenable.
- Team agrees what “verified” and “critical claim” mean.

**Stop/reframe condition:** if official sources cannot reliably establish key fields for at least 70% of target programs, reposition as a narrower editorial research product before automating.

## M1 — manual publication system

### Deliverables

- Canonical database and current projections.
- Source/artifact/evidence workflow.
- Admin creation, review, second approval, and audit history.
- Core design system and accessible components.
- Environment, migration, backup, logging, and secrets baseline.

### Gate

- Ten gold records can be rebuilt and yield the reviewed public representation.
- Critical known claims cannot publish without evidence.
- Correction creates a new history event rather than erasing the old one.
- Database restore succeeds in staging.
- Keyboard and mobile checks pass core components.

## M2 — consumer decision MVP

### Deliverables

- Catalog/search/filter, country context, card/issuer pages.
- Guided finder and comparison.
- Evidence and correction interactions.
- Basic market/data-quality analytics.
- 25 verified programs.
- Technical SEO and explicit product analytics.

### Gate

- ≥80% moderated eligibility and cost tasks are correct.
- Median shortlist time under three minutes.
- Zero known ineligible default recommendations in test scenarios.
- Core Web Vitals budgets pass on representative mobile profiles.
- WCAG audit has no critical blockers.
- All pages show data revision/cutoff and official confirmation.

## M3 — sustainable freshness

### Deliverables

- Source registry, safe fetch, artifacts, parsers, diff/validation/anomaly detection.
- Queue, retry/dead-letter, review console, atomic publication/outbox.
- Public change history and emergency status path.
- 40–60 launch programs across 15–20 priority countries.

### Gate

- ≥90% of critical claims have Tier A/B evidence.
- 100% of launch offerings meet critical completeness or explicit-unknown policy.
- Top 20 programs verified ≤7 days; remainder ≤14 days.
- Critical source-change drill detected within 24 hours and published after review within SLA.
- Reviewed candidate precision ≥90% for deterministic parsers; model suggestions measured separately.
- No unresolved critical conflict is presented as verified.

## M4 — private beta acceptance

### Deliverables

- 50–100 cross-country testers.
- Security/SSRF/admin penetration test.
- Accessibility audit with assistive technology.
- Load, restore, credential-rotation, source-outage, and integrity incident drills.
- Reviewed policies and launch-country disclosures.

### Gate

- No open severity-critical security, privacy, legal, or integrity defect.
- No more than agreed small number of high issues with owned near-term fixes.
- ≥85% of testers understand eligibility and core funding model.
- ≥70% can explain why the top result fits and name its main tradeoff.
- Correction intake and issuer response process complete end to end.
- Queue oldest critical item and freshness budgets within target for two consecutive weeks.

## M5 — public beta

### Deliverables

- Controlled launch by country cohort.
- Public methodology, coverage, data-quality, correction, editorial, affiliate, privacy, and legal pages.
- Original launch report and change digest.
- Incident/status channel and quality dashboard.

### First 30-day targets

- 1,000+ qualified decision completions—not a vanity traffic target.
- ≥20% of QDC sessions inspect evidence or limitations.
- <1 confirmed critical factual error per 1,000 published critical claims, with all corrected transparently.
- ≥15% return rate among users who create alerts/saves once available.
- Partner/nonpartner ordering and freshness parity audit passes.
- Direct/referral/community acquisition begins; no single channel >80% of QDC.

Targets are initial hypotheses and should be adjusted from beta baselines, not gamed.

## M6 — retention proof

### Deliverables

- Material-change alerts and watchlists.
- Versioned effective-value/tier calculator.
- 100+ verified programs if research capacity supports it.
- Country/use-case pages that pass the index quality gate.
- Accounts and saved scenarios with privacy controls.

### Gate

- Alert four-week retained engagement ≥25% among activated users.
- Scenario changes materially alter a default shortlist in a meaningful share of sessions, proving personalization value.
- Repeat QDC rate improves versus no-alert cohort without increasing false confidence.
- Research cost per maintained offering is stable or falling without quality loss.

## M7 — data-business proof

### Deliverables

- Three to five design partners, versioned API/feed prototype, rights matrix, SLA/error policy, and pricing tests.
- Historical change dataset and coverage documentation.
- Issuer submission pilot with signed attestations.

### Gate

- At least three organizations integrate or pay for ongoing data.
- Customers identify recurring workflow value beyond a one-time export.
- API provenance and revisions are consumed, not ignored.
- Revenue does not require exclusivity or degradation of free consumer truth.

## Quality scorecard reviewed weekly

| Domain | Metric | Launch target |
|---|---|---:|
| Accuracy | Confirmed critical correction rate | <1/1,000 critical claims |
| Evidence | Tier A/B critical coverage | ≥90% |
| Freshness | Top 20 within 7 days | 100% |
| Conflict | Critical conflict shown as verified | 0 |
| Operations | Critical review oldest age | Within published SLA |
| UX | Eligibility task success | ≥85% by private beta |
| UX | Mobile compare completion | ≥80% in tests |
| Accessibility | Critical WCAG defects | 0 |
| Performance | Mobile p75 LCP | <2.5s |
| Neutrality | Partner rank input/access | 0 / parity pass |
| Growth | Qualified decision completions | North star |

## Scope levers when behind

Reduce in this order:

1. Number of countries and cards.
2. Basic analytics breadth.
3. Editorial page count.
4. Advanced finder inputs.
5. Visual polish beyond system quality.

Do not reduce evidence requirements, regional correctness, accessibility, scraper isolation, admin security, backups, or publication auditability.
