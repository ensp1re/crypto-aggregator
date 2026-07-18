# CardStats UI/UX blueprint

## Design posture

The interface should feel like a calm financial research tool: precise, transparent, fast, and humane. It should not look like a crypto exchange, neon trading terminal, casino, or generic SaaS dashboard.

This direction applies the UI-UX-PRO-MAX methodology—mobile-first hierarchy, accessibility, responsive comparison patterns, purposeful chart choice, and restrained motion—while deliberately rejecting a cyberpunk visual recommendation that would weaken the product's trust posture.

## Experience principles

1. **Start with context.** Residency and intended use precede reward browsing.
2. **Show the decision, then the database.** Default to a useful shortlist; make exhaustive details available progressively.
3. **Conditions travel with claims.** “Up to 8%” never appears without tier/cap/asset/time context.
4. **Evidence is one action away.** Source inspection is normal interaction, not a legal appendix.
5. **Unknown is designed.** Unknown, conflicting, stale, and not offered are visually and verbally distinct.
6. **Comparison works on a phone.** Do not compress a 20-column desktop table into horizontal chaos.
7. **No false authority.** Scores are decomposed, assumptions editable, and “none” is a valid result.
8. **Fast paths and deep paths coexist.** Beginners get explanations; experts can expand full terms and source artifacts.

## Sitemap

### Public

- Home
- Explore cards
- Find my card
- Compare
- Countries
  - Country detail
- Use cases
  - Travel
  - Everyday spending
  - High spend
  - Self-custody/DeFi
  - Beginners
  - Business beta, later
- Card program
  - Regional offering/plan context
- Issuer/provider
- Analytics
  - Availability
  - Fees and rewards
  - Infrastructure
  - Changes
  - Data quality
- Guides and glossary
- Methodology
- Data coverage/status
- Corrections
- About, editorial policy, affiliate disclosure, authors
- Legal/privacy/terms

### Account, V1

- Saved comparisons and scenarios
- Watchlist and alerts
- Review evidence/status
- Privacy and data controls

### Private admin

- Research inbox
- Source registry
- Program/offering editor
- Evidence and conflict review
- Entity merge/split
- Change publication preview
- Corrections and issuer submissions
- Data quality dashboard
- Audit and access log

## Primary user flows

### Country-first finder

1. Ask residency explicitly; explain why and distinguish it from current location.
2. Ask funding preference: exchange balance, stablecoin account, wallet/onchain, or crypto-backed credit; include “not sure.”
3. Ask primary use: local everyday, travel/FX, ATM, high spend/rewards, or business.
4. Ask only scenario inputs that change results: monthly spend range, foreign spend, ATM use, custody tolerance, and optional stake/subscription.
5. Apply hard eligibility/lifecycle filters.
6. Return 3–6 options with “why it fits,” principal tradeoff, evidence confidence, and effective-value range.
7. Show excluded near-matches and why.
8. Let users adjust assumptions, compare, open the current source, save, or choose none.

Target: useful result in under three minutes and no more than five mandatory questions.

### Expert browse

1. Land on country-aware catalog without forced wizard.
2. Filter through compact, searchable facets.
3. Switch between decision cards and dense table on desktop.
4. Add up to four offerings to a persistent comparison tray.
5. Inspect region/plan in place; never compare mismatched defaults silently.

### Compare

1. Select two to four card programs; never duplicate a program because it has multiple plans.
2. Choose the relevant plan inside each program column before comparing plan-dependent values.
3. Keep card and plan choices in the URL so the comparison can be shared and restored.
4. Toggle “differences only.”
5. Group rows: access, funding/custody, cost, rewards, requirements, benefits, and limits.
6. Remove/add alternatives or switch a plan without losing the other selections.

### Program, plan, and benefit model

- The catalog contains one entry per card program. Ready Lite and Ready Metal appear as Ready Card, not two cards.
- A plan selector sits directly below the profile header and updates fees, rewards, limits, material, and benefits together.
- The comparison table keeps one column per program and places a compact plan switch inside that column header.
- “Benefits & perks” is the stable consumer label. Travel rates, subscription rebates, partner offers, rewards, and wallet support are benefit types.
- A promotion is a time-bound benefit with dates and conditions. Do not use “promotion” as the catch-all label for permanent plan features.
- Do not offer a plan selector until plan-specific values are available. A list of tier names without comparable terms is not useful.

### Evidence and correction

1. Select a fact's source indicator.
2. Open a side sheet with normalized value, scope, source authority/type, relevant location, observed/reviewed/effective dates, limitations, and official link.
3. If wrong, launch a prefilled correction form for that field.
4. Ask for region, proposed value, effective date, and source. Do not require an account.
5. Confirm queue status and optional notification without implying acceptance.

## Page hierarchy and wireframe descriptions

### Home

**Hero:** “Find a crypto card that is actually available to you.” Country selector and primary finder action. Secondary action opens the catalog. Avoid reward-rate carousels.

**Trust strip:** verified program count, countries with verified coverage, critical evidence coverage, and research cutoff—with definitions.

**How it works:** three steps—set context, compare true cost, inspect evidence.

**Market snapshot:** small original chart and recent material changes, each with coverage caveat.

**Use-case entry points:** traveler, everyday, high spender, self-custody, beginner.

**Method/neutrality:** concise source and affiliate promise plus correction link.

### Catalog

Desktop: left or top filter panel, results summary, sort with explanation, decision cards by default and optional table. Mobile: filter bottom sheet, applied-filter chips, one-column cards, sticky comparison tray.

Each result card prioritizes:

1. program + scoped region/plan and lifecycle;
2. eligibility result;
3. card/funding model;
4. scenario cost/reward or core economics;
5. main condition/caveat;
6. evidence freshness/conflict;
7. compare and detail actions.

Generic plastic-card art is optional and secondary. Do not show fake card numbers or let artwork dominate data.

### Program detail

Header: program, issuer/network, card website action, and compare action. A plan selector follows immediately when the program has multiple plans.

Next: eligibility callout and “how money moves” diagram. Then a sticky in-page section navigation.

Sections: overview; plan options; fees and conversion; rewards/caps/exclusions; limits; assets/chains/wallets; benefits and perks; support; and sources.

Critical warnings stay near affected terms. Affiliate actions cannot visually outrank the direct card website action.

### Country page

Title and eligibility definition, coverage cutoff, live/waitlist/paused counts, a short decision guide, sortable eligible offerings, scenario comparison, local considerations, recent changes, and methodology. A map is optional context, never primary navigation.

### Analytics

Start with one question and plain-language answer. Controls for period, geography, lifecycle, method, and unit appear before the chart. Show coverage/quality panel, visualization, accessible table, interpretation, methodology, and revision notes. Do not create a wall of KPI tiles.

### Admin review

Three-pane desktop workspace: queue; normalized before/after and scope; safe artifact/evidence viewer. Critical actions show downstream impact and require reason plus second approval. Keyboard shortcuts improve throughput but never bypass confirmation.

## Mobile comparison pattern

Never use an unreadably scaled matrix. On mobile:

- a bottom comparison tray shows up to three selected programs;
- the semantic comparison table keeps readable column widths inside one localized horizontal scroller;
- the decision-factor column stays visible while card columns move, and visible 44px controls supplement touch scrolling;
- section accordions reduce length while preserving headings;
- “differences only” hides equal rows but exposes a count and reset;
- unknown/conflicting values have text labels and explanation;
- source actions are at least 44×44px;
- no essential content requires horizontal page scrolling, and comparison data never becomes a card grid.

Desktop can use sticky column headers and a matrix for up to four offerings. Preserve program/context labels while scrolling.

## Information language

### Preferred terms

- “Eligible for residents of …” rather than “available in …”
- “Verified explicit zero” rather than merely “free”
- “Issuer did not disclose” rather than “N/A”
- “Crypto is converted at purchase” rather than “debit” alone
- “Evidence confidence” rather than “trust score”
- “Observed 12 July; issuer says effective 1 August” when dates differ
- “Maximum advertised reward” and “scenario reward” as separate values

### Value-state presentation

| State | Label | Treatment |
|---|---|---|
| Known/current | Verified | Normal text + source action |
| Not offered | Not offered | Neutral explicit label |
| Not disclosed | Undisclosed | Dashed/info treatment |
| Not applicable | Not applicable | Muted with reason |
| Conflicting | Sources conflict | Amber warning + both sources |
| Stale | Needs recheck | Amber clock + last observation |

Do not communicate any state by color alone.

## Design system

### Visual direction

Light-first neutral canvas with optional dark mode. Use deep slate/ink for content, a restrained blue or teal action color, green only for verified positive states, amber for stale/conflict, and red for critical/error. Test every semantic combination to WCAG AA; never make “verified” low-contrast pastel text.

Avoid purple gradients, token-logo wallpaper, glassmorphism, neon glows, and financial candlestick aesthetics. The brand can feel modern through typography, data density, and small precise details.

### Typography

One high-quality variable sans family such as Inter or Geist is sufficient. Use 16px minimum body text, clear heading scale, 1.45–1.6 body line height, and tabular numerals for money/rates. Avoid novelty display fonts in core research UI.

### Layout and spacing

- Mobile baseline 375px; validate 320px edge cases.
- Principal breakpoints around 768, 1024, and 1440px based on content, not device names.
- 8px spacing rhythm with 4px fine adjustments.
- Reading measure 65–75 characters for editorial text.
- Dense tables remain scannable through row grouping, alignment, whitespace, and sticky context—not tiny type.

### Motion

Use 150–300ms transitions for state changes, comparison tray, sheets, and filter feedback. No looping ornamental motion, parallax, animated counters, or hover movement that shifts layout. Honor `prefers-reduced-motion` and provide immediate state updates.

### Iconography

Use one SVG set such as Lucide. Pair ambiguous icons with text. No emoji as product controls. Country flags do not substitute for country names and can misrepresent residency/jurisdiction.

## Component inventory

### Navigation and framing

Global header, mobile navigation sheet, breadcrumbs, country-context selector, page tabs, sticky section nav, trust/coverage bar, footer disclosures.

### Discovery

Search command, filter group, range/enum filter, applied chip, sort menu with explanation, result count/coverage, result card, dense result row, no-results recovery, comparison tray.

### Comparison and economics

Offering selector, scoped plan selector, comparison matrix/stack, difference toggle, scenario input, assumption summary, cost waterfall, break-even chart, cap progress, value range, excluded-option row.

### Evidence and trust

Evidence badge, freshness indicator, source sheet, claim state, conflict alert, limitation callout, provider relationship diagram, change timeline, methodology note, correction form/status.

### Analytics

Metric definition header, coverage panel, chart controls, accessible line/bar/dot/box/bullet/map components, raw data table, annotation, download/citation action.

### Feedback and account

Save/watch action, alert rule, correction flow, review evidence upload, moderation status, privacy controls, toast/inline status.

### Admin

Research queue, diff viewer, safe source viewer, scope editor, evidence locator, entity resolver, validation list, publication impact preview, approval dialog, audit timeline.

## Accessibility requirements

- WCAG 2.2 AA target from the first component.
- Semantic landmarks, heading order, skip link, descriptive page titles, and meaningful link text.
- Complete keyboard operation and visible focus indicators.
- Minimum 44×44px touch targets with adequate separation.
- Text contrast at least 4.5:1; UI/focus contrast validated.
- Errors identified in text, linked to fields, and preserved after submission.
- Dialog/sheet focus containment and return; no keyboard traps.
- Tables have captions, row/column headers, and responsive alternatives.
- Charts include summary, values table, labeled series, keyboard-accessible data, and non-color encoding.
- Live regions only for meaningful asynchronous changes.
- Reduced motion, zoom to 200%, text spacing, high contrast, and screen-reader testing.

Automated checks are necessary but not sufficient. Run keyboard and screen-reader tests with VoiceOver and NVDA and include disabled/low-vision participants in research.

## Performance budgets

- p75 mobile LCP <2.5s, INP <200ms, CLS <0.1.
- Primary card/country content server-rendered.
- Initial route JavaScript budget defined and enforced; chart and admin code loaded on demand.
- No autoplay media; optimize issuer logos and avoid decorative card renders.
- Filters give immediate UI feedback and complete within 300ms for local state or show clear progress.
- Analytics failure never blocks content or interaction.

## Content and interaction quality checklist

Before a surface ships, verify: exact country/plan scope; readable mobile comparison; explicit unknowns; source access; no commercial rank input; keyboard completion; responsive chart fallback; meaningful empty/error states; issuer confirmation; correction route; analytics/data revision; performance budget; and comprehension test.

## UX success measures

- Eligibility task accuracy.
- Effective-cost comparison accuracy.
- Custody/funding comprehension.
- Time to defensible shortlist.
- Evidence interaction without increased abandonment.
- Qualified decision completions, including “none.”
- Comparison success at mobile widths.
- Correction discoverability and quality.
- Confidence calibration: users should be less certain when evidence is conflicting.
