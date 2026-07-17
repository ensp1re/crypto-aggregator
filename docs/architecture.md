# CardStats system architecture

## Architecture goals

- Publish fast, indexable, accessible research pages.
- Keep collection of untrusted remote content away from user requests.
- Preserve source artifacts and every material claim revision.
- Make critical publication transactional, reviewable, and reversible by a new correction—not destructive editing.
- Scale research jobs and public reads independently without premature services.
- Degrade honestly: stale or conflicting data is labeled, not silently served as current.

## High-level architecture

```text
Users / search engines
          |
      CDN / WAF
          |
   Next.js web + application backend/BFF --> PostHog (explicit events)
          |
    read projections
          |
   Managed PostgreSQL <----------------- Admin research console
       |       ^                              |
       | jobs  | candidates/publications     | review + approval
       v       |
   Scheduler + worker fleet -----------------+
       |         |
       |         +--> Private object storage (source artifacts)
       |
       +--> Allowlisted official issuer / network / regulatory sources
```

The deployment has two execution planes:

- **Request plane:** one Next.js deployment containing public web, server-only application/domain modules, read API, finder, compare, and protected admin UI.
- **Research plane:** scheduler, collectors, parsers, normalizers, validators, diff engine, and notifications.

They share PostgreSQL but use different roles, connection pools, network policies, and resource budgets.

## Service boundaries

### Web experience

Responsibilities: server-rendered discovery and detail pages, comparison state, finder questions, transparent ranking explanations, source/evidence display, corrections form, metadata, sitemaps, accessibility, authenticated mutations, and externally consumed HTTP endpoints.

It reads published projections, not extraction candidates. Public requests never start a scrape. Server Components call server-only application services directly; Route Handlers are reserved for browser/public endpoints, webhooks, callbacks, and exports rather than internal server-to-server calls. Most catalog pages can be revalidated after a publication event; scenario calculations use versioned domain logic.

### Domain/application layer

Responsibilities: eligibility resolution, value scenarios, lifecycle logic, claim-state semantics, ranking explanations, publication policies, and affiliate-neutral ordering. These modules live inside the Next.js application codebase but do not depend on React, Route Handler request objects, Prisma-generated persistence types, browser automation, or source-specific parsing logic.

Modules should align to stable concepts: catalog, eligibility, economics, evidence, verification, analytics, corrections, reviews, and commercial links.

### Ingestion workers

Responsibilities: fetch registered sources, store artifacts, extract candidates, normalize units, validate, detect semantic differences, assign severity/confidence, and create review tasks.

Collectors are isolated by source domain and resource class. A Playwright pool is separate from lightweight HTTP workers. Workers can write raw artifacts, candidate claims, and job state but cannot publish critical claims directly.

### Admin research console

Responsibilities: source registry, queue triage, side-by-side artifact/diff view, evidence locator, conflict resolution, entity merge/split, second approval, corrections, publication preview, and audit trail.

The admin is a product, not an afterthought. Research throughput and error rates depend on its UX.

### Analytics

Product analytics receives an explicit event taxonomy and no card application secrets or wallet data. Market analytics are computed from published claims and clearly separated from behavioral analytics. Later, an analytical store may ingest append-only events through an outbox.

## Data flow

### Research-to-publication

```text
Source registry
  -> due job
  -> robots/rights/policy check
  -> safe fetch
  -> immutable artifact + hash
  -> deterministic extraction / assisted suggestion
  -> typed normalization
  -> validation and cross-source reconciliation
  -> semantic diff + severity
  -> human review (two reviewers for critical changes)
  -> atomic claim revision + change event + read projection refresh
  -> page revalidation + subscriber notification
```

At every stage, lineage points backward. A normalized claim without an artifact and evidence locator cannot become verified.

### User decision

```text
Residency + use-case assumptions
  -> hard eligibility/status filters
  -> funding/card-type compatibility
  -> scenario calculations and uncertainty range
  -> dimension-level ordering
  -> explained shortlist + excluded alternatives
  -> evidence inspection / save / issuer confirmation
```

Finder inputs are kept client-side for anonymous users unless server computation is necessary. Saving requires explicit account consent.

### Correction

```text
User/issuer submission
  -> abuse and malware checks
  -> deduplicate against open tasks
  -> research queue, never direct mutation
  -> source validation
  -> accept/reject with reason
  -> publication event and submitter notification
```

Issuer identity improves provenance but does not bypass review.

## Data consistency and publication

- Extraction candidates and published claims live in distinct states.
- Critical changes publish in one transaction: close previous valid/current record, insert revision, record verification, write change event, update outbox.
- Consumers read a `current_offering_facts` projection or materialized view built only from publishable claims.
- Publication events invalidate affected pages and enqueue alerts through an outbox, preventing database/message inconsistency.
- Corrections append a new observation; do not rewrite audit history.
- Every mutation includes actor, reason, request/correlation ID, and before/after hashes.

## Caching

- CDN-cache public editorial and catalog pages with event-driven revalidation.
- Keep lifecycle/critical status at a short freshness window and support emergency purge.
- Cache finder reference data, not personalized scenario results across users.
- Include data revision identifiers in API responses and exported comparisons.
- Do not add Redis until cache invalidation or distributed quota needs are measured.

## Search architecture

PostgreSQL owns structured filters and weighted text search. Create a denormalized search document per published offering containing canonical name, aliases, issuer, countries, chains, assets, benefits, and controlled glossary terms. Query structured eligibility before text relevance.

Search must distinguish no results from no verified eligible results and offer a correction/coverage path. Dedicated search remains an interchangeable downstream projection, never the source of truth.

## Scheduling and queues

- A short scheduler run claims due source checks and enqueues idempotent jobs.
- Domain budgets enforce crawl delay, concurrency, and retry ceilings.
- Conditional HTTP requests reduce load.
- Exponential backoff with jitter handles transient failures; permanent access changes create a research task.
- Leases and heartbeats recover abandoned work.
- Dead-letter jobs include artifact/log references and require disposition.
- Overlapping schedule invocations are harmless; job uniqueness prevents duplication.

Railway cron may skip overlapping executions, so cron is only a trigger. Database due-times and leases are authoritative.

## Deployment architecture

### Environments

- **Local:** synthetic/license-safe fixtures, local PostgreSQL and object-storage emulator, network fetch off by default. Local secrets are ignored and remote shared databases are not required.
- **Preview:** ephemeral web build against a sanitized shared or branch dataset; no production source credentials.
- **Staging:** production topology, test sources/accounts, migration and restore validation.
- **Production:** isolated database/project, private artifacts, strict egress and admin access.

### Delivery

- Trunk-based development with short branches and protected production deployments.
- Schema checks and migration rehearsal before application release.
- Expand/migrate/contract for incompatible schema changes.
- Worker and web versions declare compatible schema/data-contract ranges.
- Feature flags separate deploy from release.
- Critical ranking/economics logic uses golden scenarios reviewed by product and research.

## Security boundaries

- Public web role is read-only for published views except narrow form procedures.
- Admin mutations require MFA, RBAC, CSRF protection, re-authentication for critical actions, and audit logs.
- Worker egress allows only registered HTTPS sources; private, link-local, metadata, and internal addresses are blocked before and after redirects.
- Fetched content is untrusted bytes: size/type limits, sandboxed parsers, no script execution except isolated browser containers, malware scanning for documents.
- Artifact bucket is private; public evidence links point to official origins, not raw internal snapshots unless rights permit.
- Secrets are per-service and rotated; previews never receive production secrets.

See [security.md](security.md) for the threat model.

## Reliability and observability

### Service targets for public beta

- Public read availability: 99.9% monthly target.
- p75 LCP under 2.5 seconds on representative mobile connections.
- p95 cached catalog response under 500 ms; uncached data endpoint under 1 second.
- Critical source-change detection within 24 hours for monitored top programs.
- No unresolved critical conflict shown as verified.

### Telemetry

Track request latency/error by route, database latency/pool saturation, queue depth/age, source success and block rate, artifact storage failures, extraction/validation errors, review SLA, publication latency, revalidation failures, and notification outcomes.

Alerts should be actionable: queue oldest age, critical source inaccessible, projection lag, backup failure, admin anomalous action, and stale-claim budget—not generic CPU noise alone.

### Recovery

- Provider database backups plus encrypted offsite logical backups.
- Versioned object storage or retained immutable content hashes.
- Quarterly restore drill with recorded recovery time and data-loss window.
- Publication can be superseded quickly but never erased from audit history.
- Static/error-safe public pages should continue showing the last known revision with a freshness warning during research-plane outages.

## Scaling strategy

### Stage 1: launch

Single Next.js web/application-backend deployment, one lightweight worker pool, one browser worker, primary PostgreSQL with deployment-appropriate pooling, and private object storage. Optimize queries and cache reads.

### Stage 2: growth

Separate worker queues by fetch type/domain, add a database read replica for public traffic, precompute country/filter facets, and introduce an API quota store if necessary.

### Stage 3: data platform

Stream append-only publication events to a dedicated analytics system, deploy independent API capacity, introduce a dedicated search index for multilingual/relevance needs, and isolate B2B workloads.

### Split criteria

Split a module into a service only when it needs a distinct security boundary, ownership team, availability target, data store, or scaling curve. Line-count growth is not sufficient.

## Failure modes and product behavior

| Failure | System behavior |
|---|---|
| Official source unreachable | Retain last fact, age it, show freshness warning, open task |
| Conflicting official sources | Mark field conflicting; do not choose silently |
| Extractor changes many claims | Quarantine batch and require review |
| Worker outage | Public reads continue; freshness alerts fire |
| Projection refresh fails | Transaction rolls back or previous projection remains |
| Analytics unavailable | Core comparison works without analytics scripts |
| Affiliate redirect fails | Official provider link remains available |
| Program suddenly pauses | Emergency reviewed status update and cache purge |

## Architecture risks

The initial multi-vendor topology adds contracts and incident boundaries. The selected PostgreSQL provider plus Vercel Next.js and Railway workers must be tested for TLS, connection latency, pooling, connection exhaustion, backups, restore, and regional alignment. If function-style database access is operationally awkward, consolidate the Next.js app and worker on Railway or another container platform; PostgreSQL compatibility and container portability preserve that option. A separate request-plane API service is not added unless a measured client, scaling, deployment, or security boundary requires it.
