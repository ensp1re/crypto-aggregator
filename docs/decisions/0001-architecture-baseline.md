# ADR 0001: CardStats architecture baseline

Status: **proposed — Next.js backend and Prisma selected; remaining launch decisions require founder approval**

Date: 17 July 2026

Owners: founder and engineering lead

## Context

CardStats must serve fast public research while ingesting hostile, fast-changing source material and
preserving scoped, temporal evidence. The initial team is small, catalog scale is modest, and research
quality is a larger constraint than raw request throughput. The architecture must remain reversible
without introducing distributed-system operations before product-market fit.

## Proposed decision

- Use one Next.js TypeScript deployment for the public web, application/domain backend, protected
  research console, publication orchestration, Server Actions, and required Route Handler REST/BFF
  endpoints. Do not create a separate request-plane API service for the MVP.
- Deploy collection and normalization as a separate TypeScript worker process because it has distinct
  egress, resource, retry, browser, and trust boundaries.
- Use PostgreSQL as the canonical relational and temporal store, initial faceted/text search engine,
  scheduler/job store, audit log, and source of published read projections.
- Use Prisma ORM for ordinary typed data access and Prisma Migrate for migration orchestration.
  Customize and review migration SQL; PostgreSQL constraints, views, extensions, indexes, and
  specialized queries remain first-class. Use TypedSQL or parameterized raw SQL when Prisma Client is
  not the correct expression of a temporal, search, projection, or performance-sensitive query.
- Use PostgreSQL-backed `pg-boss` jobs initially. Add Redis or another queue only after measured
  contention or throughput failure.
- Use private S3-compatible object storage for immutable artifacts; never place raw binaries in
  PostgreSQL or expose private snapshots by default.
- Keep the request plane read-only against published projections. Workers may create artifacts,
  candidates, and job state but cannot directly publish critical claims.
- Use REST/resource APIs and version public contracts when the API becomes a product.
- Launch topology recommendation: Vercel Next.js, Railway worker/scheduler, an approved managed
  PostgreSQL provider, Cloudflare R2 artifacts, and consent-controlled PostHog EU explicit events.
  Database selection requires TLS, restricted network access, deployment-appropriate pooling,
  least-privilege roles, backups, monitoring, and a successful restore drill.
- Keep Docker as the deployment contract and preserve the option to consolidate web, worker, and
  PostgreSQL on Railway if cross-provider operations fail validation.

Detailed component, data-flow, consistency, recovery, and security behavior remains normative in
[architecture.md](../architecture.md), [database-design.md](../database-design.md), and
[security.md](../security.md).

## Dependency direction

UI and transport layers depend on application/domain contracts; domain modules do not depend on
React, Next.js request objects, Prisma-generated persistence types, source parsers, Playwright,
analytics, or affiliate integrations. Collection adapters
produce typed candidates. Publication services validate candidates and write append-only revisions.
Read projections depend on published canonical facts, and public rendering depends only on those
projections and versioned scenario logic.

## Alternatives considered

- **One deployment for web and collectors:** simpler topology but violates the untrusted-content and
  resource-isolation boundary.
- **Separate Express/Fastify/Nest request API:** duplicates the Next.js backend and adds an internal
  network/deployment boundary before an independent client or scaling/security need exists.
- **Go backend/worker:** efficient but adds a second language before a measured CPU or concurrency
  bottleneck.
- **Microservices/Kubernetes:** adds ownership, delivery, and consistency cost without multiple teams
  or independent scaling requirements.
- **GraphQL:** adds authorization, query-cost, caching, and tooling complexity without multiple rich
  clients.
- **Redis/BullMQ, dedicated search, or ClickHouse at launch:** each adds stateful operations before
  catalog, queue, search, or analytics thresholds justify it.
- **Generic CMS for card truth:** cannot enforce scoped temporal claims, evidence, conflicts,
  two-person review, or atomic publication.

## Consequences

The team gains one primary language, one request-plane deployable, productive typed database access,
transactional publication, low infrastructure complexity, and a clear ingestion trust boundary. It
accepts that Prisma is not the complete database specification: engineers must review SQL and own
PostgreSQL-native constraints, projections, indexes, and plans. Cross-provider latency, pooling,
connection exhaustion, backups, identity, and failure ownership must be proven in staging rather than
assumed.

## Approval conditions

Before changing this ADR to `accepted`, record the chosen launch countries, data residency and
processor constraints, recovery objectives, named backup/restore owner, supported browser baseline,
and budget envelope. Run a small connection/pooling and restore spike against the intended regions.

## Revisit triggers

- sustained search p95 above 150 ms after query/index tuning or more than 100,000 documents;
- PostgreSQL job contention or worker throughput that misses source-change SLAs;
- analytical scans affecting transactional workloads or tens of millions of analytical events;
- a durable service needs a distinct team, security boundary, availability target, store, or scaling
  curve;
- cross-provider latency, incident ownership, cost, or compliance fails the launch gate;
- profiling demonstrates a worker bottleneck that TypeScript cannot reasonably resolve.
