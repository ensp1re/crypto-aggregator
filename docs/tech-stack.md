# CardStats recommended technology stack

## Executive recommendation

Use Next.js as the complete request-plane application backend and frontend, with one separately deployed TypeScript ingestion worker. Do not add a standalone API service for the MVP. Use Prisma for ordinary typed data access and migration orchestration, while PostgreSQL and reviewed SQL remain authoritative for temporal constraints, projections, specialized indexes, and complex reads. Use HTTP collection first and Playwright only for sources that require a browser.

The stack optimizes for a small team that must spend more time on data correctness than distributed-systems maintenance.

## Decision criteria

Choices are evaluated on speed to a reliable product, conceptual simplicity, operational burden, typed developer experience, cost at low traffic, graceful scale, vendor reversibility, and fitness for evidence-heavy temporal data.

## Frontend

### Next.js + React + TypeScript — recommended

[Next.js App Router](https://nextjs.org/docs/app) provides server rendering and route-level data fetching for indexable catalog pages, while [server and client components](https://nextjs.org/docs/app/getting-started/server-and-client-components) allow interactive comparison to remain a client island. TypeScript lets domain types span UI, API, extraction, and validation.

Why:

- Card, country, issuer, and methodology pages require fast HTML and structured metadata.
- The finder and comparison need rich state without turning the entire site into a client application.
- One language reduces context switching and staffing complexity.
- Next can be deployed as a standard container if Vercel economics or constraints change.

Risks:

- Framework caching semantics are easy to misuse. Treat database data as dynamic and revalidate deliberately after publication.
- React server/client boundaries can create accidental bundles. Define client islands and bundle budgets.
- Avoid depending on proprietary Vercel-only primitives for core business logic.

### Tailwind CSS — recommended with constraints

Tailwind speeds responsive, stateful UI work, but utility sprawl can erase design consistency. Use semantic tokens, owned component variants, and a lint/review standard. [Tailwind v4 targets modern browsers](https://tailwindcss.com/docs/compatibility); validate the supported-browser policy before locking it.

### shadcn/ui — source primitives, not a theme

[shadcn/ui](https://ui.shadcn.com/docs) supplies accessible component source the team owns. Use primitives such as dialog, popover, tooltip, tabs, and command; restyle them into the product system. Do not ship the default template aesthetic or accept accessibility claims without testing.

### TanStack Table — recommended

[TanStack Table](https://tanstack.com/table/latest) is headless and supports sorting, filtering, pagination, and controlled state without dictating markup. This is important because desktop comparison and catalog tables must transform into different mobile structures. Use server-driven queries and URL state. Add virtualization only when measured DOM volume requires it.

Do not use a heavy grid product for the MVP; its desktop-first assumptions fight the mobile comparison design.

## Backend and API

### Next.js application backend — recommended

Keep public reads, finder logic, ranking explanations, admin mutations, source registry, and publication orchestration in the Next.js codebase with explicit server-only application and domain modules. This is a modular monolith inside the Next.js deployment, not business logic embedded in React components.

Server Components call application services and repositories directly; they must not call the app's own Route Handlers and pay an unnecessary HTTP round trip. Use Server Actions for UI-scoped mutations after authorization and input validation. Use Route Handlers for public/client-side endpoints, webhooks, callbacks, exports, and the future versioned REST API. Do not treat Route Handlers as a durable job runner or shared in-memory process: some hosts execute them as functions with filesystem, timeout, and connection-lifetime limits. Next.js documents both the [Backend for Frontend pattern and its deployment caveats](https://nextjs.org/docs/app/guides/backend-for-frontend).

Run ingestion in a separate containerized process because scheduling, Playwright, hostile remote content, retries, long execution, and controlled egress have different security and scaling needs. A standalone Express/Fastify/Nest API is deferred until a non-web client, independent scaling requirement, or security/ownership boundary demonstrates that the Next.js backend is insufficient.

Use REST for externally consumed APIs. Resources are clear, cache semantics matter, and GraphQL would add schema, authorization, query-cost, and caching complexity without a demonstrated client need. Introduce `/api/v1` when the API becomes a product.

### Node.js vs Go

Choose Node.js/TypeScript initially. Parsing, browser automation, web rendering, and shared validation dominate; Go's concurrency and binary efficiency do not offset a second language. A future isolated high-throughput indexer may justify Go only after profiling shows CPU, memory, or concurrency constraints that cannot be solved in the existing worker.

## Database and data access

### PostgreSQL — recommended

The domain is deeply relational and temporal. PostgreSQL supports constraints, transactions, JSON for exceptional conditions, range/time queries, materialized views, [full-text search](https://www.postgresql.org/docs/current/textsearch.html), trigram similarity, and mature operations.

Use it for:

- canonical entities and time-bound claims;
- verification workflow and audit logs;
- product reads through current-value projections;
- initial faceted search;
- job queue and scheduler metadata;
- aggregated market snapshots at early scale.

PostgreSQL is not the correct home for immutable source binaries, raw screenshots, or eventually billions of onchain events.

### Prisma ORM and Prisma Migrate — selected

[Prisma ORM](https://www.prisma.io/docs/orm) is the default application data-access layer. It provides a productive typed client for ordinary entity, relationship, workflow, and transaction operations across both the Next.js backend and TypeScript worker. This is a team productivity choice, not permission to reduce the domain to whatever Prisma Schema Language can express.

[Prisma Migrate](https://docs.prisma.io/docs/orm/prisma-migrate) produces versioned SQL migrations that can be reviewed and customized. Generate migrations with a create-only/review step whenever native PostgreSQL features or data-preserving changes are involved. Use [TypedSQL or parameterized raw queries](https://www.prisma.io/docs/orm/prisma-client/using-raw-sql) for current-value projections, complex temporal reads, full-text/trigram search, reporting, and queries whose plans need direct control.

Rules:

- PostgreSQL constraints are the final integrity boundary; use database foreign keys rather than Prisma-emulated referential integrity.
- Prisma schema models the application-facing portion of the database. Migration SQL, views, extensions, indexes, and constraints are also first-class reviewed source.
- Migrations are reviewed artifacts. `prisma db push` is limited to disposable prototyping before the shared migration baseline exists and is never used against shared, staging, or production databases.
- Generate a draft migration, inspect and customize its SQL, test it against production-like data, then apply it through the delivery pipeline.
- Prefer Prisma Client for normal queries, TypedSQL for owned complex SQL, and unsafe raw methods only as an exceptional reviewed path with parameterization and tests.
- Complex reads have query-plan tests and measured indexes.
- JSON is reserved for source-specific conditions that cannot yet be normalized, not used as the default schema.

### Connections and credentials

Do not assume a direct PostgreSQL URL is safe for a function-style Next.js deployment. The runtime connection must use an approved pooler or a deliberately capped connection strategy; migration and administrative commands need a separately controlled direct connection when the pooler cannot support them. Current Prisma versions configure connection URLs in `prisma.config.ts`, so the implementation must pin a tested Prisma major and follow that version's configuration model rather than copying an older `directUrl` example.

Use separate least-privilege roles for the public/request plane, worker candidates/jobs, migrations, and later publication/admin operations. Require TLS verification, network allowlisting or private networking, rotated credentials, connection/time limits, monitored saturation, automated backups, and a restore drill before any remote database is treated as staging or production. Never commit connection strings; keep a redacted `.env.example` when implementation begins.

### Search — PostgreSQL first

Combine weighted full-text fields with `pg_trgm` for names, aliases, issuers, countries, assets, and benefits. Structured filters remain relational. Add Typesense or Meilisearch only when typo-tolerant multilingual search, facet latency, or index scale cannot meet targets. A practical trigger is >100,000 searchable documents or sustained p95 search above 150 ms after query/index tuning.

Elasticsearch/OpenSearch is not justified for a sub-thousand-card catalog.

### Redis — defer

Do not introduce Redis for generic caching. CDN/server caching and PostgreSQL handle the initial workload. Add Redis only for a measured use such as high-rate distributed quotas, ephemeral coordination, or queue throughput that PostgreSQL cannot satisfy.

## Jobs and scraping

### pg-boss — recommended initially

[pg-boss](https://github.com/timgit/pg-boss) provides PostgreSQL-backed durable jobs, retries, scheduling, and transactional enqueueing. It avoids a second stateful service and fits low-to-moderate scheduled collection volume.

Jobs must be idempotent, leased, bounded, backoff-aware, and dead-lettered. A scheduler enqueues work; it does not perform long fetches itself. Move to BullMQ/Redis, a managed queue, or cloud-native messaging only when job volume or database contention is observed.

### Fetch stack

1. Standards-compliant HTTP client with conditional requests, timeouts, compression limits, and content-type validation.
2. Deterministic HTML/JSON/PDF parsers per source family.
3. [Playwright](https://playwright.dev/docs/actionability) only where JavaScript rendering or interaction is genuinely necessary.
4. Optional crawler framework later if domain scheduling and session management outgrow the custom registry.

Browser collection is slower, more fragile, and a larger security surface. Never use it just because it is convenient.

## Infrastructure

### Recommended launch topology

- **Vercel:** Next.js web and lightweight request handlers.
- **Railway:** Dockerized collection/normalization worker and scheduler.
- **Managed PostgreSQL:** provider selected after TLS, regional, pooling, backup, restore, and operational-ownership gates; Supabase remains a viable option rather than a hard dependency.
- **Cloudflare R2:** private immutable source artifacts, PDFs, and screenshots.
- **PostHog Cloud EU:** explicit product analytics and feature flags.

This is more vendors than a single Railway deployment, but responsibilities are clear and each component is replaceable. Review vendor count and data-processing agreements before procurement.

Use Docker as the deployment contract for the worker and as a supported path for the web application. It makes browser/parser dependencies reproducible and preserves portability between Railway, Fly.io, and self-hosted containers. Local Compose is for development and integration; production still needs managed secrets, health checks, immutable images, backups, and service supervision. [Docker documents production-specific Compose considerations](https://docs.docker.com/compose/how-tos/production/).

### Why not deploy everything to Vercel?

Serverless limits have improved—see [Vercel function limits](https://vercel.com/changelog/higher-defaults-and-limits-for-vercel-functions-running-fluid-compute)—but browser collection needs stable containers, predictable concurrency, egress control, and long job supervision. Keep it off the request plane.

### PostgreSQL provider decision

The project may use Supabase, Railway, another managed PostgreSQL provider, or an existing hardened instance. A reachable server is not an approved production database. Selection requires TLS verification, restricted ingress/private networking, a pooler compatible with the Next.js deployment model, point-in-time or equivalent recovery, encrypted offsite logical backups, monitoring, upgrade ownership, and a successful restore drill. Authentication is evaluated separately and must not force the database provider choice.

### Why R2?

[Cloudflare R2](https://developers.cloudflare.com/r2/how-r2-works/) is S3-compatible, strongly consistent, and avoids egress charges under its model. Store content-addressed artifacts privately; retain metadata and hashes in PostgreSQL. It can be replaced by S3-compatible storage.

### Simpler fallback

If vendor coordination delays launch, deploy web, worker, and PostgreSQL to Railway and retain R2. This sacrifices some managed web/database conveniences but reduces contracts. Do not choose architecture by logo count; choose based on team operating competence and restore tests.

### Infrastructure alternatives

| Option | Where it fits | Why it is not the default |
|---|---|---|
| Cloudflare CDN/WAF in front of an origin | Global cache, DDoS/WAF, custom cache rules | Vercel already supplies the first web edge; adding another proxy needs a concrete security/cache requirement. [Cloudflare documents static and rule-driven dynamic caching](https://developers.cloudflare.com/cache/get-started/). R2 remains useful independently. |
| Fly.io Machines | Regional containerized web/worker placement and private networking | More infrastructure ownership than Vercel/Railway; useful if egress geography or long-running regional workers matter. [Fly Apps group Machines and private-networked resources](https://fly.io/docs/apps/overview/). |
| Fly managed/self-managed Postgres | Co-location with Fly apps | Managed Postgres can be evaluated at procurement; self-managed Fly Postgres/volumes make the team responsible for replication, backups, recovery, and scaling, as [Fly's resilience guidance](https://fly.io/docs/apps/app-availability/) states. |
| Single VPS/Hetzner-style self-host | Lowest raw compute cost and maximum control | Founder time, patching, monitoring, HA, backups, egress security, and incident response dominate savings. Acceptable for a prototype, not the recommended public trust product with a tiny team. |
| Fully self-hosted platform layer | Regulatory/control-driven deployment later | Operating Postgres, queue, object storage, auth, analytics, and observability recreates managed services before product-market fit. Keep containers, SQL, and S3 interfaces portable instead. |

Choose Fly.io over Railway when multi-region worker placement, private container networking, or machine lifecycle control is a validated need. Choose self-hosting only when a named operator owns patching and recovery and restore/failover tests meet the same gates as managed infrastructure.

## Analytics stack

Use [PostHog product analytics](https://posthog.com/docs/product-analytics) in the EU region with autocapture disabled, explicit events, IP handling configured, and sensitive text never recorded. [Session replay](https://posthog.com/docs/session-replay) is off by default; enable only after consent, redaction tests, and a demonstrated research need.

Plausible is a reasonable alternative if the MVP needs only aggregate acquisition analytics. Do not deploy both.

ClickHouse is deferred. It becomes justified when the system stores tens of millions of analytics/onchain events, materialized PostgreSQL aggregates still exceed a 2-second p95, or analytical scans affect transactional workloads. ClickHouse is designed for large analytical/time-series workloads; that strength is irrelevant before the data exists.

## CMS and admin

Build a protected domain-specific research console in the same Next application. Generic CMS tools are optimized for prose, not scoped claims, source locators, conflicts, temporal validity, two-person review, and atomic publication.

Use a conventional headless CMS later only for editorial guide workflows if authoring volume warrants it. It must not own card truth.

## Cost and scaling posture

Plan for roughly low hundreds of dollars per month during a real beta, excluding people and legal costs. Exact vendor prices change and should be quoted during procurement. The largest true cost is research labor.

Scale in this order:

1. CDN and server-rendered read caching.
2. Optimized current-value projections and indexes.
3. Worker concurrency partitioned by source domain.
4. Database connection pooling and read replica.
5. Dedicated search or analytics store after measured thresholds.
6. Split services only where security, ownership, or scaling boundaries are durable.

## Rejected-by-default technology

| Technology | Why not now | Revisit when |
|---|---|---|
| Microservices/Kubernetes | Operations and consistency cost | Multiple teams and independently scaling domains |
| Separate Express/Fastify/Nest API | Duplicates the Next.js request plane and creates an internal network boundary without a present need | Independent clients, scaling, deployment, or security ownership requires it |
| Go backend | Second language without bottleneck | Profiled worker CPU/concurrency constraint |
| GraphQL | Query/security/caching complexity | Multiple rich external clients require composition |
| Redis | Another stateful system | PostgreSQL queue/cache is measured insufficient |
| Elasticsearch/OpenSearch | Oversized for catalog | Search scale/language/relevance exceeds Postgres |
| ClickHouse | No event volume to justify it | Analytical thresholds above are crossed |
| Generic CMS for card data | Cannot model verification semantics | Never; use only for prose if needed |
| AI auto-publish | Hallucination and semantic-change risk | No critical fields; still human-reviewed |

## Architecture decision gates

Every major addition needs an ADR documenting the measured problem, alternatives, cost, migration path, security implications, and reversal condition. Benchmark with production-like data before adding infrastructure. Trendiness is not evidence.
