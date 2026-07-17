# Decision 0002: Phase 0 product and launch baseline

Status: **accepted by founder — 17 July 2026**

Date: 17 July 2026

Owner: founder

This record resolves the ten pre-coding decisions in the
[product contract](../product-contract.md#decisions-required-before-coding). Approval authorizes only
the representative vertical slice defined there. It does not authorize scraping, production
deployment, affiliate activation, or public launch.

## Proposed decisions

1. **Countries and catalog boundary.** Use Germany, France, Spain, Italy, the Netherlands, Belgium,
   Austria, Ireland, Portugal, Poland, Czechia, Romania, Sweden, Denmark, and Finland as the initial
   research candidate set. Publish an offering in a country only when consumer availability,
   residency eligibility, responsible legal entity, lifecycle, and critical terms are verified.
   Exclude business-only, invitation-only without public terms, unverifiable, and merely announced
   products. A program may remain in research without becoming publicly discoverable.
2. **Critical fields and entity splits.** Critical fields are lifecycle, country/residency
   eligibility, responsible issuer relationship, card type, funding/custody model, issuance and
   recurring fees, transaction/FX/ATM fees, reward rate/asset/cap/qualification, and material limits.
   Split an offering when issuer, eligibility, fee schedule, network, card type, or settlement model
   materially differs. Split a plan when subscription, stake, qualification, benefits, fees, or
   rewards differ. Never infer a plan from artwork or color.
3. **Evidence, publication, and artifacts.** Agreements, fee schedules, issuer/regulatory records,
   and other scoped official terms outrank marketing and third-party discovery sources. A known
   critical claim requires accepted evidence; critical publication requires independent second
   approval. Target at least 90% Tier A/B official evidence and explicitly qualify every remainder.
   Retain only rights-permitted private artifacts or the minimum locator, excerpt hash, metadata, and
   content hash needed for reproducibility; legal/rights status controls byte retention.
4. **Ranking and commercial neutrality.** Apply hard eligibility, availability, lifecycle,
   critical-freshness, and funding-compatibility filters before ranking. Rank by transparent fit,
   attainable net value, evidence quality/freshness, and explicit user preferences. Optional benefits
   default to zero until valued by the user. Affiliate/partner data remains structurally inaccessible
   to rank inputs, official confirmation is always available, and partner/nonpartner parity is tested.
5. **Roles and privileged actions.** Use researcher, senior verifier/publisher, administrator, and
   commercial operator roles with default-deny RBAC. An actor cannot approve their own critical
   change. Critical publication, role changes, entity merge/split, exports, and destructive actions
   require re-authentication, reason capture, immutable audit evidence, and a recovery or
   forward-correction path.
6. **Architecture.** Accept [ADR 0001](0001-architecture-baseline.md): one Next.js TypeScript
   request-plane application backend, one isolated TypeScript ingestion worker, PostgreSQL as the
   canonical store, Prisma ORM/Migrate for ordinary access and migration orchestration, reviewed
   PostgreSQL-native SQL where required, PostgreSQL-backed jobs initially, and private S3-compatible
   artifact storage.
7. **Hosting, recovery, and ownership.** For the representative slice, use local application
   processes and the founder-owned self-hosted PostgreSQL development database already configured in
   ignored environment state; do not treat it as staging or production. Founder owns backup/restore.
   Development targets daily backup, RPO 24 hours, and RTO 8 hours. Before public beta, select
   EU-region processors and infrastructure, verify TLS and restricted network access, use
   least-privilege runtime/migration roles and deployment-appropriate pooling, add encrypted offsite
   backups, and demonstrate production targets of RPO 1 hour and RTO 4 hours. Initial infrastructure
   budget envelope is EUR 750/month excluding staff, legal work, and exceptional usage.
8. **Accessibility, browsers, and performance.** Target WCAG 2.2 AA. Support the current and previous
   major versions of Chrome, Edge, Firefox, and Safari, plus current iOS Safari and Android Chrome;
   degrade accessibly outside that baseline. Test 375, 768, 1024, and 1440 pixel layouts, keyboard,
   VoiceOver/NVDA, zoom/text spacing, reduced motion, and contrast. Public-beta targets remain p75 LCP
   under 2.5 seconds and p95 cached catalog response under 500 milliseconds.
9. **Representative slice acceptance.** Approve the product contract's synthetic/license-safe slice:
   one program, two regional offerings, two tiers, candidate claims, evidence, review/publication,
   indexable detail, and two-offering comparison. Require domain/unit tests, publication and
   authorization integration tests, one browser journey, accessibility checks, and an audit-history
   assertion. Exclude scraping, accounts, affiliates, and production infrastructure.
10. **Legal review.** Before collecting live artifacts or publishing in a jurisdiction, obtain scoped
    review for source terms/database rights, artifact and excerpt retention, privacy/processors,
    financial promotions and affiliate disclosures, trademarks/brand use, correction handling, and
    jurisdiction-specific consumer disclosures. Synthetic fixtures and internal prototypes may
    proceed without representing legal clearance for launch.

## Approval

The founder approved this record on 17 July 2026. ADR 0001 and the product contract are accepted for
the representative vertical slice, which may now begin with synthetic fixtures only.
