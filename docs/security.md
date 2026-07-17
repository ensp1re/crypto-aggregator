# CardStats security, privacy, abuse, and legal considerations

## Security posture

The product does not initially custody funds or collect card applications, but it still handles financially consequential content, privileged publishing access, untrusted internet documents, correction submissions, and commercially sensitive analytics. Its biggest risks are data integrity and scraper isolation—not payment-card storage.

Use [OWASP API Security](https://owasp.org/API-Security/) and relevant [REST security guidance](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html) as baselines, adapted to the actual architecture.

## Assets and threat actors

### Assets

- Published facts, ranking/calculator logic, and historical audit trail.
- Admin identities, roles, sessions, and approvals.
- Source artifacts, issuer contacts, correction attachments, and user contact data.
- Database credentials, worker/browser secrets, affiliate credentials, and API keys.
- Availability of public pages and source monitors.
- Brand trust and commercial/editorial separation.

### Threat actors

- Opportunistic web attackers and credential stuffers.
- Malicious issuers or affiliates attempting to alter rank/facts.
- Fake reviewers, competitors, spammers, and extortion attempts.
- Compromised or hostile source websites targeting crawlers.
- Insiders with excessive publishing or commercial access.
- Automated clients exhausting search/API/correction resources.
- Well-meaning researchers making high-impact mistakes.

## Scraper threat model

### SSRF and network pivoting

Admin/source URLs are high-risk input. Follow [OWASP SSRF prevention](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html):

- allowlist registered HTTPS origins;
- normalize URLs and reject credentials/unusual ports;
- resolve DNS then block private, loopback, link-local, multicast, metadata, and reserved ranges for IPv4/IPv6;
- revalidate every redirect and DNS result;
- restrict worker egress at network level;
- never expose cloud metadata credentials;
- disable local file and non-HTTP protocols.

### Malicious content

- Limit compressed and decompressed size, redirects, execution time, and MIME types.
- Treat HTML/PDF/images as hostile; parse in isolated, patched containers with resource limits.
- Playwright uses ephemeral contexts, no shared admin cookies, downloads disabled or quarantined, and no internal-network access.
- Never inject fetched HTML into the admin origin. Render sanitized text or a separately sandboxed artifact viewer.
- Scan attachments/documents; strip active content and metadata where appropriate.
- Pin and monitor browser/parser dependencies.

### Crawl conduct and rights

Identify the crawler, publish contact, respect robots and source-specific limits, use conditional fetches, and maintain takedown/escalation. Robots rules are not access permission. Avoid bypassing authentication, CAPTCHAs, geo controls, or technical restrictions. Obtain permission or use manual/issuer feeds when access is unclear.

## Application security

### Authentication and authorization

- Public research requires no account.
- Admin uses separate identity tenancy/role, phishing-resistant passkeys or SSO plus MFA, short sessions, and re-authentication for publication, role change, exports, and destructive entity operations.
- RBAC roles: researcher, senior verifier, publisher, admin, commercial-readonly, auditor. Default deny.
- Two-person approval for critical term/status/entity changes; an actor cannot approve their own critical change.
- Periodic access review and immediate offboarding.

### Session and browser controls

Secure, HttpOnly, SameSite cookies; CSRF tokens/Origin checks for mutations; CSP with strict script origins and nonces; HSTS; frame denial; MIME sniffing disabled; permissions policy; dependency integrity. Affiliate redirects are validated against active allowlisted destinations.

### API controls

- Schema and allowlist validation at boundaries; see [OWASP input validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html).
- Resource-level authorization on every admin object.
- Parameterized queries and constrained sorting/filter fields.
- Pagination, response-size, query-complexity, and execution limits.
- Per-IP/session/key token buckets with stricter anonymous write limits.
- Idempotency keys for corrections/publications where applicable.
- Consistent errors that do not expose internals.
- Versioned public API and scoped, hashed API keys with quotas and rotation.

### Supply chain and delivery

- Lock dependencies, automated vulnerability/license scanning, minimal containers, signed build artifacts/SBOM where practical.
- Protected branches, required review, CI identity with least privilege, no long-lived cloud keys.
- Secrets in managed stores, separate by environment and service, rotated after exposure/role changes.
- Database migrations reviewed and rehearsed; production console access logged and exceptional.

## Data integrity controls

- Published claims require evidence and workflow state, enforced by database/application policy.
- Immutable verification and change logs with actor/reason/before/after hashes.
- Separation between candidate and public schemas/views.
- Critical batch anomaly quarantine.
- Partner tables inaccessible to rank calculation service/module.
- Public data revision included in results and exports.
- Daily integrity checks for orphan evidence, overlapping claims, unauthorized rank inputs, and broken source links.
- Emergency correction preserves history and records incident rationale.

Integrity incidents require the same rigor as breaches because inaccurate eligibility or fee data can cause financial harm.

## Abuse prevention

### Public forms

Use rate limits, progressive challenges after suspicious behavior, honeypots, attachment/type/size limits, URL allow/deny checks, duplicate detection, and moderation queues. Do not force CAPTCHAs on every legitimate correction.

### Reviews

The V1 review pilot needs evidence of experience, region/date, incentive and employee/issuer affiliation disclosure, anomalous-account/link analysis, rate limits, duplicate detection, and appealable moderation. Never reward only positive sentiment or suppress negative reviews to improve ratings.

The US FTC's [Consumer Reviews and Testimonials Rule](https://www.ftc.gov/business-guidance/resources/consumer-reviews-testimonials-rule-questions-answers) prohibits specified fake-review and review-suppression practices. Review law varies by market; obtain counsel before launch.

### API and scraping of our site

Publish reasonable robots rules and API terms, cache public responses, apply quotas, and offer a licensed API. Do not degrade accessibility or normal use with aggressive bot challenges. Protect costly filter/export paths separately from cached pages.

## Privacy

### Data minimization

Do not collect wallet addresses, balances, transaction history, identity documents, or precise location for MVP discovery. Residency is user-selected and can remain session-local. Scenario amounts can be rounded/client-side unless saved explicitly.

Correction and issuer contact data are separated from public claims, encrypted in transit/at rest, access-limited, and deleted on a defined schedule. Analytics exclude free text and sensitive values.

### Analytics

Use explicit events, autocapture off, consent where required, IP settings minimized, session replay off by default, and documented retention. Honor access/deletion/objection rights. Do not sell behavioral profiles or expose issuer-level user intent.

### Privacy program

Maintain data inventory, purposes/legal bases, processor agreements, international-transfer assessment, retention schedule, data subject request process, breach plan, and DPIA where high-risk processing warrants it. Public personal information remains regulated; avoid collecting people from issuer pages or forums.

## Legal considerations

### Data collection and intellectual property

- Review site terms, copyright, database rights, access controls, and rate policies per source.
- Facts may be uncopyrightable while prose, images, selection/arrangement, and databases can be protected.
- Do not copy card artwork, competitor prose, rankings, taxonomy, or source snapshots into public pages without rights.
- Store only the minimum artifact/excerpt needed for verification and enforce rights-based access/retention.
- License proprietary APIs and analytics; do not infer republication permission from access.

See [data-pipeline.md](data-pipeline.md) for the CryptoAgg decision and legal sources.

### Financial promotions and consumer protection

Descriptions, rankings, and affiliate links may constitute or support financial promotions depending on jurisdiction. Claims must be fair, clear, and not misleading; eligibility and material risks appear near calls to action. UK-targeted crypto promotions require specific review under the [FCA regime](https://www.fca.org.uk/firms/cryptoassets/marketing-uk-consumers).

Avoid unsubstantiated “safe,” “regulated,” “guaranteed,” “zero fee,” and “best” claims. Disclose affiliate/sponsorship relationships clearly. Card and issuer trademarks are nominative references subject to brand-use review.

### Tax and advice boundary

Spending assets can have jurisdiction-specific tax consequences. Link to authoritative local guidance and recommend qualified advice. Do not calculate individualized liability or imply a tax result without a reviewed local methodology.

### Sanctions and prohibited use

The product can compare lawful eligibility but must not help bypass KYC, residency, sanctions, access controls, or issuer restrictions. B2B customers and paid users may require sanctions/export-control screening proportionate to counsel's advice.

## Incident response

Classify incidents:

- **Security:** unauthorized access, data disclosure, credential or dependency compromise.
- **Integrity:** false critical publication, ranking bias, corrupted history, affiliate/editorial breach.
- **Availability:** public outage, source-monitor outage, queue blockage.
- **Legal/privacy:** rights complaint, unlawful content, data subject request failure.

For each: detect, contain, preserve evidence, assess users/claims, correct transparently, notify as required, rotate/revoke, restore, and conduct blameless root-cause review with owners/dates. Material integrity incidents should receive a public correction note.

## Security launch checklist

- Threat model reviewed against deployed topology.
- External penetration test focused on admin, API authorization, SSRF, and artifact rendering.
- Restore and credential-compromise exercises completed.
- Admin MFA/RBAC/two-person publication tested.
- WAF/rate limits and log redaction validated.
- No production secrets in preview/local environments.
- Source egress and redirect controls independently tested.
- Privacy/terms/affiliate/editorial/correction policies reviewed by counsel.
- Dependency and container patch process assigned.
- Security contact and vulnerability disclosure channel published.
