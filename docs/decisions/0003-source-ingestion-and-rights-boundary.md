# ADR 0003: Real-source ingestion and rights boundary

- **Status:** Accepted by founder instruction on 17 July 2026
- **Decision owners:** Founder and engineering
- **Applies to:** Real catalog ingestion, public discovery, and adoption analytics

## Context

The synthetic representative slice proved publication and deployment mechanics but did not represent
the intended product. The founder directed CardStats to build a real crypto-card discovery and
analytics product informed by CryptoAgg and PaymentScan, with materially better evidence, structure,
and interface design.

## Decision

1. CryptoAgg may be collected only into a discovery quarantine. Retain source URL, observation time,
   import run, and rights basis. Do not copy its prose, identifiers, ranking, layout, fake card art, or
   creative presentation. Publicly visible discovery observations must be labelled unverified and may
   never be presented as CardStats-verified facts.
2. Critical terms such as eligibility, fees, rewards, limits, lifecycle, and custody are promoted to
   verified publication only after independent evidence from official issuer, network, program
   manager, regulatory, or licensed sources.
3. CryptoAgg issuer-avatar URLs are discovery observations, not card artwork. CardStats will use
   official issuer media with recorded provenance when available and must not invent product images.
4. PaymentScan data is ingested only through its documented bearer-token API with an active license.
   Public projections additionally require documented republication rights. CardStats will not call
   private frontend server functions, bypass authentication, or scrape paid analytics.
5. The request plane never collects sources. Operators run collectors separately; public pages read a
   checked projection containing explicit verification and coverage states.
6. Market metrics preserve event definition, onchain/offchain basis, included top-ups, covered chains,
   observation time, revisions, and license basis. Address counts are never labelled user counts.

## Consequences

- The first real catalog can show broad discovery coverage while making verification gaps visible.
- Official verification proceeds program by program without contaminating canonical claims.
- PaymentScan adoption panels remain unavailable until credentials and republication rights are
  configured; absence is explicit rather than replaced by synthetic numbers.
- The source adapters are replaceable and cannot determine the public ontology.
