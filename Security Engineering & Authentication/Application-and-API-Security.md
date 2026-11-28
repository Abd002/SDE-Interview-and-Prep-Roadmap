# Application and API Security — OWASP Top 10, Injection, IDOR, XSS, CSRF, SSRF, CORS, Uploads and Abuse Prevention

> **What you'll learn:** the most common ways web apps and APIs get broken and how to **prevent** them: the **OWASP Top 10**, **SQL/NoSQL injection** and parameterized queries, **broken object-level authorization (BOLA/IDOR)**, **XSS** with output encoding and **CSP**, **CSRF, SSRF, open redirects and request smuggling**, **CORS**, **input/schema validation and safe deserialization**, **file uploads**, and **rate limiting, quotas, abuse prevention and audit logs**. Each part shows the vulnerable pattern next to the fix.
>
> **Prerequisites:** [Core Security Principles](./Core-Security-Principles.md), [HTTP](../Networking/HTTP.md).
>
> ⚠️ Examples are deliberately tiny and simulated for learning **defence**. Only test systems you own or are authorized to test.

## Table of Contents
1. [API rate limiting, quotas, abuse prevention, and audit logs](#1-api-rate-limiting-quotas-abuse-prevention-and-audit-logs)
2. [Broken object-level authorization (BOLA/IDOR)](#2-broken-object-level-authorization-bolaidor)
3. [CORS behavior and common misconfigurations](#3-cors-behavior-and-common-misconfigurations)
4. [Cross-site scripting (XSS), output encoding, and CSP](#4-cross-site-scripting-xss-output-encoding-and-csp)
5. [CSRF, SSRF, open redirects, and request smuggling basics](#5-csrf-ssrf-open-redirects-and-request-smuggling-basics)
6. [File upload validation and malware scanning](#6-file-upload-validation-and-malware-scanning)
7. [Input validation, schema validation, and safe deserialization](#7-input-validation-schema-validation-and-safe-deserialization)
8. [OWASP Top 10 and common exploitation paths](#8-owasp-top-10-and-common-exploitation-paths)
9. [SQL/NoSQL injection and parameterized queries](#9-sqlnosql-injection-and-parameterized-queries)
10. [Cheat sheet](#cheat-sheet)

---

## 1. API rate limiting, quotas, abuse prevention, and audit logs

**In one sentence:** protect APIs from overload and abuse with **rate limits** (requests per second per key/user/IP), **quotas** (requests or cost per day/month per plan), **abuse detection** (credential stuffing, scraping, enumeration, bots), and keep **audit logs** of security-relevant actions to investigate and prove what happened.

### In plain words
A buffet with a sign "max 3 plates per visit" (rate limit) and a monthly membership with 20 visits (quota). Staff watch for someone sneaking food out in bags (abuse), and the till records who came in and what they paid (audit log).

### How it works
- **Rate limits** at several levels: edge (CDN/WAF per IP), API gateway (per API key / user / tenant), and per **sensitive endpoint** (login, password reset, OTP, search, export) — those get much **stricter** limits. Algorithms: token bucket, sliding window ([details](../Low-Level%20Design%20%26%20Object-Oriented%20Design/Classic-LLD-Problems.md#9-design-a-rate-limiter-strategy-interfaces-pluggable-algorithms)). Respond **429** with `Retry-After`.
- **Quotas** per plan/tenant (requests, tokens, storage, exports); hard and soft limits; usage headers.
- **Abuse prevention:**
  - **Credential stuffing:** per-account *and* per-IP failure limits, breached-password checks, MFA, bot detection, progressive delays — avoid locking real users out permanently.
  - **Enumeration:** same response and timing for "user exists" vs. "doesn't"; unguessable IDs.
  - **Scraping / bots:** behavioural signals, device fingerprints, CAPTCHA or proof-of-work for suspicious traffic, WAF bot rules.
  - **Resource exhaustion:** limits on body size, page size, query complexity (GraphQL depth/cost), upload size, regex timeouts.
- **Audit logs:** who (user, service, IP, client), did what (action, resource), when, from where, result (allowed/denied) — for logins, permission changes, data exports, admin actions, payments. Append-only, protected, retained per policy ([tamper-evident logs](./Security-Operations-and-Design-Interviews.md#1-centralized-security-logging-and-tamper-evident-audit-trails)); never log secrets.

### Interview answer
"I rate-limit at the edge per IP, at the gateway per API key, user and tenant, and much more strictly on sensitive endpoints like login, OTP and password reset, returning 429 with Retry-After. Quotas cap usage per plan. Against credential stuffing I combine per-account and per-IP failure limits with MFA, breached-password checks and step-up challenges, and avoid enumeration by giving identical responses. I bound request sizes and query cost, and write append-only audit logs for logins, permission changes, exports and admin actions — without secrets."

---

## 2. Broken object-level authorization (BOLA/IDOR)

**In one sentence:** **BOLA** (OWASP API Security #1), also called **IDOR** (insecure direct object reference), happens when an API uses an ID from the request (`/invoices/1043`) **without checking that the caller may access that object** — so changing the number exposes someone else's data.

### In plain words
A hotel that opens any room for whoever says the room number. You're in room 312; you say "313" and the door opens. The fix: the key card works **only** for your room.

### How it works
- Authentication ("who are you?") is not enough — every request needs **object-level authorization** ("may **this** user act on **this** object?").
- **Fix pattern:** load the object **scoped to the caller** (`WHERE id = ? AND owner_id = ?` or tenant ID), or load it and check ownership/permissions with a central policy function — in **every** handler, including update, delete, export, and nested objects (`/orders/7/items/3`).
- Return **404** (not 403) for objects the user may not see, to avoid confirming they exist.
- **Unguessable IDs** (UUIDv4/v7) make enumeration harder but are **not** a fix on their own.
- Related: **BFLA** (broken function-level authorization — normal users calling admin endpoints) and **mass assignment** (client sets `"role":"admin"` or `"owner_id"` in a JSON body — use explicit allowlists of writable fields).
- Test it: for every endpoint, request another user's/tenant's object in automated tests.

### Interview answer
"BOLA, or IDOR, is when an endpoint trusts an object ID from the request without checking that the caller may access that specific object, so changing the ID leaks or modifies other users' data. The fix is object-level authorization on every operation — scope queries by owner or tenant, or call a central policy check — returning 404 for objects the caller can't see. Unguessable IDs only slow enumeration. I also prevent mass assignment with allowlists of writable fields and add automated cross-user tests for every endpoint."

---

## 3. CORS behavior and common misconfigurations

**In one sentence:** browsers' **same-origin policy** stops a page on one origin (scheme + host + port) from **reading** responses from another; **CORS** headers let a server **relax** that for specific origins — and misconfiguring them (reflecting any origin with credentials, `null` origin, sloppy suffix matching) lets malicious sites read users' private data.

### In plain words
Your browser is a careful messenger: a website from `evil.example` can *send* letters to your bank, but the messenger won't hand the bank's *reply* back to it — unless the bank says "it's fine to show this reply to evil.example". CORS is the bank saying who may read replies. Saying "anyone may, including with your login cookie" is the classic mistake.

### How it works
- **Simple requests** (GET/POST with simple headers) are sent directly; the browser checks `Access-Control-Allow-Origin` on the response before exposing it to JavaScript.
- **Preflight:** for other methods/headers (PUT, DELETE, `Content-Type: application/json`, `Authorization`) the browser first sends `OPTIONS` with `Origin`, `Access-Control-Request-Method/Headers`; the server answers with allowed methods/headers and `Access-Control-Max-Age`.
- **Credentials** (cookies, HTTP auth): need `Access-Control-Allow-Credentials: true` **and** an exact origin — `*` is not allowed with credentials.
- **Common misconfigurations**
  - reflecting the request's `Origin` back for any value, with credentials;
  - allowing `null` (sandboxed iframes and local files send it);
  - matching with `endsWith("example.com")` (allows `evilexample.com`) or regex without anchors;
  - allowing all subdomains when one subdomain can host user content or has XSS;
  - forgetting `Vary: Origin` so caches serve one origin's CORS headers to another.
- **CORS is not access control for your API** — non-browser clients ignore it. It's about protecting **users' browsers**. Authentication and authorization still apply.

### Interview answer
"The same-origin policy stops other sites' JavaScript from reading our responses; CORS headers selectively relax it, with a preflight OPTIONS for non-simple requests. I allow an exact allowlist of origins, never reflect arbitrary Origin values or accept `null` with credentials, avoid loose suffix or unanchored regex matching, send `Vary: Origin`, and remember that CORS only protects browsers — the API still needs real authentication and authorization."

---

## 4. Cross-site scripting (XSS), output encoding, and CSP

**In one sentence:** **XSS** happens when untrusted data is put into a page **as code** instead of text, letting an attacker's script run in victims' browsers (stealing sessions, acting as them); prevent it with **context-aware output encoding**, safe templating/DOM APIs, **HTML sanitization** for rich text, and a strict **Content Security Policy** as a second layer.

### In plain words
If a shop prints customers' notes on the price board without checking, someone writes a note that says "everything is free" in the shop's official font. The fix is to always print notes as plain text — and to have a rule that only the manager's official stickers can change prices (CSP).

### How it works
| Type | How the payload arrives | Example |
|---|---|---|
| **Stored** | saved in the DB, shown to other users | profile bio, comment |
| **Reflected** | in the request, echoed in the response | search term in the results page |
| **DOM-based** | client-side JS puts data into the DOM unsafely | `element.innerHTML = location.hash` |

**Defences**
1. **Encode output for its context** (OWASP XSS Prevention Cheat Sheet):
   - HTML body: `& < > " '` → `&amp; &lt; &gt; &quot; &#x27;`;
   - HTML attributes: always quote and encode;
   - JavaScript, CSS and URL contexts have their **own** encoders (URL: percent-encode, and allow only `http(s):` schemes — block `javascript:`).
2. Use frameworks that **auto-escape** (React JSX, Angular, Jinja2 autoescape); avoid `dangerouslySetInnerHTML`, `innerHTML`, `v-html`, `|safe` with untrusted data. Use `textContent`.
3. **Sanitize** rich HTML with an allowlist sanitizer (DOMPurify, bleach) — never with home-made regexes.
4. **Content Security Policy:** `Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-r4nd0m'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'` — blocks inline and third-party scripts even if an injection slips through. Prefer **nonces/hashes** over `'unsafe-inline'`.
5. **HttpOnly** session cookies so scripts can't read them (limits damage), plus Trusted Types in modern browsers.

### Interview answer
"XSS is untrusted data rendered as code — stored, reflected or DOM-based. My main defence is context-aware output encoding through auto-escaping templates and safe DOM APIs like textContent, with separate encoders for HTML, attributes, URLs and JavaScript, and scheme allowlists for links. Rich text goes through an allowlist sanitizer like DOMPurify. Then a strict CSP with nonces blocks injected scripts as a second layer, and HttpOnly cookies limit what a successful injection can steal."

---

## 5. CSRF, SSRF, open redirects, and request smuggling basics

**In one sentence:** **CSRF** tricks a logged-in user's browser into sending a request they didn't intend; **SSRF** tricks your **server** into fetching an attacker-chosen URL (often internal services or cloud metadata); **open redirects** let attackers use your domain to send users to malicious sites; **request smuggling** abuses disagreements between proxies and servers about where one HTTP request ends.

### In plain words
- CSRF: someone slips a signed blank cheque from your chequebook into the bank's inbox — it's your signature (cookie), but not your intent.
- SSRF: you ask the office receptionist to "fetch this document", and they fetch the boss's private safe because the address pointed inside the building.
- Open redirect: a fake signpost with your company's logo pointing to a scam shop.
- Smuggling: two clerks count pages differently, so a hidden page slips through as a separate letter.

### How it works
**CSRF**
- Works because browsers attach cookies automatically to cross-site requests.
- Defences: **SameSite=Lax/Strict** cookies (default Lax in modern browsers), **anti-CSRF tokens** (synchronizer or double-submit) for state-changing requests, check `Origin`/`Sec-Fetch-Site` headers, never change state on GET, re-authenticate for sensitive actions. APIs using `Authorization: Bearer` headers (not cookies) aren't CSRF-prone.

**SSRF** (OWASP Top 10 A10:2021)
- Features like "import from URL", webhooks, PDF/image renderers, link previews.
- Targets: `http://169.254.169.254/` (cloud metadata → credentials), `localhost` admin ports, internal services.
- Defences: **allowlist** destinations where possible; resolve DNS and **block private/loopback/link-local ranges** (10/8, 172.16/12, 192.168/16, 127/8, 169.254/16, ::1, fc00::/7) **after** resolution and on every redirect (DNS rebinding); disable unneeded schemes (`file:`, `gopher:`); egress firewall / proxy; **IMDSv2** on AWS.

**Open redirects:** `/login?next=https://evil.example` — only allow **relative paths** or an allowlist of hosts; reject `//evil.example` and backslash tricks.

**Request smuggling:** front-end and back-end disagree on `Content-Length` vs. `Transfer-Encoding: chunked`; an attacker hides a second request inside the first. Defences: use HTTP/2 end-to-end where possible, normalize/reject ambiguous requests (both headers, malformed chunking) at the edge, keep proxies and servers patched and consistent.

### Interview answer
"CSRF abuses automatically attached cookies, so I use SameSite cookies, anti-CSRF tokens for state-changing requests, Origin or Sec-Fetch-Site checks and no state changes on GET. SSRF makes our server fetch attacker-chosen URLs, so I allowlist destinations, block private, loopback and metadata ranges after DNS resolution and on every redirect, disable odd schemes, use IMDSv2 and restrict egress. Open redirects get relative-path-only or allowlisted targets. Request smuggling comes from proxies disagreeing on request length, so I normalize or reject ambiguous requests at the edge and prefer HTTP/2 end to end."

---

## 6. File upload validation and malware scanning

**In one sentence:** treat every uploaded file as hostile: **limit size**, **check the real type by content** (magic bytes), **rename** it, store it **outside the web root** (object storage) and serve it from a **separate domain** with safe headers, strip metadata, **scan for malware**, and process risky formats in a **sandbox**.

### In plain words
A post office accepting parcels: weigh it (size), X-ray it rather than trusting the label (content type), give it a tracking number instead of the sender's name, keep it in a back room, and send suspicious parcels to a special inspection room.

### How it works
- **Size limits** at the edge and in the app; limits on image dimensions (decompression bombs) and archive expansion (zip bombs) and nesting.
- **Type validation:** allowlist of types; check **magic bytes** (`%PDF`, `\x89PNG`, `\xFF\xD8\xFF` for JPEG), not the extension or the client's `Content-Type`.
- **Storage:** random server-side names (no user-controlled paths → no `../` traversal or overwrite), object storage (S3/GCS) with private ACLs, served via **pre-signed URLs** or a separate **user-content domain** (so an HTML/SVG upload can't run scripts on your main origin). Headers: `Content-Disposition: attachment`, `X-Content-Type-Options: nosniff`, correct `Content-Type`.
- **Re-encode** images (decode and re-save) to strip metadata (EXIF GPS!) and hidden payloads; be careful with SVG (it's XML with scripts — sanitize or rasterize).
- **Malware scanning:** ClamAV, cloud scanners (Amazon GuardDuty Malware Protection for S3, Microsoft Defender), commercial multi-engine APIs — **quarantine until scanned**, scan asynchronously, rescan on signature updates.
- **Processing in a sandbox:** document converters, image libraries and archive extractors have had many CVEs — run them in isolated, resource-limited workers with no network.

### Interview answer
"I treat uploads as hostile: enforce size and decompression limits, check the real type from magic bytes against an allowlist, store under random names in private object storage — never using the client's filename as a path — and serve from a separate user-content domain with Content-Disposition attachment and nosniff. Images are re-encoded to strip metadata, SVGs sanitized, everything is quarantined until a malware scan passes, and risky parsers run in sandboxed, resource-limited workers."

---

## 7. Input validation, schema validation, and safe deserialization

**In one sentence:** validate every input at the **trust boundary** against a **strict schema** (types, ranges, lengths, formats, allowed fields — **allowlist**, reject the rest), and never **deserialize** untrusted data into arbitrary objects with formats that can execute code (Java native serialization, Python `pickle`, PHP `unserialize`, unsafe YAML).

### In plain words
A form with clearly defined boxes: age must be a number from 0 to 130, the email must look like an email, and you can't attach extra pages. And you never accept a parcel labelled "assemble yourself" that builds a machine inside your office — that's unsafe deserialization.

### How it works
**Validation**
- Validate **server-side** (client-side is only UX). Do it **once at the boundary**, then pass typed objects inward ([parse, don't validate](../Low-Level%20Design%20%26%20Object-Oriented%20Design/API-Persistence-and-Concurrency-Design.md#6-validation-domain-errors-exceptions-and-failure-handling)).
- **Allowlist** (what's allowed) beats denylist (what's forbidden). Check type, length, range, format, enum values, and **reject unknown fields** (prevents mass assignment).
- **Schemas:** JSON Schema, OpenAPI request validation, Protobuf, Pydantic, Zod; validate at the API gateway and/or framework layer.
- **Canonicalize before validating** (Unicode normalization, URL decoding once) to avoid double-encoding bypasses; limit sizes and nesting depth.
- Validation **reduces** injection risk but is **not** a substitute for parameterized queries or output encoding.

**Safe deserialization**
- Danger: deserializers that instantiate **arbitrary classes** can trigger "gadget chains" → remote code execution (CVE-2015-4852 Apache Commons Collections, Log4Shell-style JNDI lookups, Python pickle, Ruby Marshal, .NET `BinaryFormatter`).
- Use **data-only formats** (JSON, Protobuf) mapped to **explicit types**; disable polymorphic type handling (Jackson default typing), use `yaml.safe_load`; never unpickle untrusted data; sign/encrypt anything you must round-trip (e.g. state in cookies) and verify before parsing.

### Interview answer
"I validate every input server-side at the trust boundary against a strict schema — types, lengths, ranges, formats, enums — using allowlists and rejecting unknown fields, after canonicalizing, and then pass typed objects inward. Validation reduces risk but doesn't replace parameterized queries or output encoding. For deserialization I only use data formats like JSON or Protobuf mapped to explicit types, never native object serialization or pickle on untrusted input, disable polymorphic typing, and sign anything I have to round-trip through clients."

---

## 8. OWASP Top 10 and common exploitation paths

**In one sentence:** the **OWASP Top 10** (2021 edition) ranks the most critical web application risks — led by **broken access control**, **cryptographic failures** and **injection** — and real attacks usually **chain** several small weaknesses into one serious breach.

### In plain words
A list of the ten most common ways burglars get into houses, ranked by how often they work. Knowing the list tells you which doors and windows to check first.

### How it works
| # (2021) | Risk | Typical example | Key defences |
|---|---|---|---|
| A01 | **Broken Access Control** | IDOR, missing function-level checks, CORS misconfig | deny by default, object-level checks, tests |
| A02 | **Cryptographic Failures** | plaintext data, weak hashing, no TLS | TLS everywhere, Argon2/bcrypt, AES-GCM, KMS |
| A03 | **Injection** (incl. XSS) | SQL/NoSQL/OS command injection, XSS | parameterized queries, encoding, safe APIs |
| A04 | **Insecure Design** | no rate limit on OTP, missing business rules | threat modeling, abuse cases |
| A05 | **Security Misconfiguration** | default creds, debug on, open buckets, verbose errors | hardened baselines, IaC scanning |
| A06 | **Vulnerable and Outdated Components** | unpatched library with a known CVE | SCA, SBOM, patch SLAs |
| A07 | **Identification and Authentication Failures** | credential stuffing, weak session handling | MFA, rate limits, secure sessions |
| A08 | **Software and Data Integrity Failures** | unsigned updates, unsafe deserialization, CI compromise | signatures, SLSA, safe formats |
| A09 | **Security Logging and Monitoring Failures** | breach unnoticed for months | audit logs, alerts, incident response |
| A10 | **Server-Side Request Forgery** | fetching cloud metadata via a URL feature | egress allowlists, IP checks, IMDSv2 |

There's also the **OWASP API Security Top 10 (2023)**: BOLA, broken authentication, broken object property-level authorization (mass assignment / excessive data exposure), unrestricted resource consumption, BFLA, unrestricted access to sensitive business flows, SSRF, misconfiguration, improper inventory management, unsafe consumption of third-party APIs.

**Common exploitation paths (chains)**
- Leaked API key in a public repo → over-privileged cloud role → read every S3 bucket.
- Stored XSS in a support ticket → staff member's session → admin panel → data export.
- SSRF in an image-from-URL feature → cloud metadata credentials → lateral movement.
- Outdated library with a public exploit (e.g. Log4Shell, CVE-2021-44228) → remote code execution.
- Weak password reset (predictable token / no expiry) → account takeover.

Breaking **any** link stops the chain — that's why defence in depth works.

### Interview answer
"The OWASP Top 10 for 2021 is led by broken access control, cryptographic failures and injection, followed by insecure design, misconfiguration, vulnerable components, authentication failures, integrity failures like unsafe deserialization or unsigned updates, logging and monitoring failures, and SSRF; for APIs there's a separate list led by BOLA. Real breaches chain weaknesses — a leaked key plus an over-privileged role, or SSRF to cloud metadata — so I use the list as a checklist for layered controls, knowing that breaking any link stops the chain."

---

## 9. SQL/NoSQL injection and parameterized queries

**In one sentence:** **injection** happens when user input is **concatenated into a query or command** so it changes the query's **structure**; the fix is **parameterized queries / prepared statements** (input is always data, never code), safe query builders/ORMs, strict typing for NoSQL operators, and least-privilege database accounts.

### In plain words
If a bank teller reads your note aloud as an instruction — "give me my balance; also give me everyone's balance" — and follows it, that's injection. With parameters, the teller only ever fills in **the account number box**; whatever you write there is just an account number.

### How it works
- **Vulnerable:** `"SELECT * FROM users WHERE name = '" + name + "'"` — input `' OR '1'='1` returns every row; other inputs can read other tables or modify data.
- **Fix:** `SELECT * FROM users WHERE name = ?` with `name` **bound** as a parameter — the database parses the query **before** seeing the value, so the value can't change the structure.
- Identifiers (table/column names, `ORDER BY` direction) **can't** be parameters — map user choices to an **allowlist** of fixed strings.
- ORMs are safe **when used normally**; raw-SQL escape hatches (`raw()`, string-formatted `where`) reintroduce the bug.
- **NoSQL injection:** MongoDB queries accept objects, so `{"password": {"$ne": null}}` in JSON can bypass a login; enforce **types** (password must be a string), reject keys starting with `$`, use the driver's typed APIs.
- Same family: **OS command injection** (use argument arrays like `execve`, never a shell string), **LDAP**, **XPath**, **template injection (SSTI)**, **log injection**.
- **Defence in depth:** least-privilege DB user (no DDL, no access to other schemas), WAF rules, error messages that don't leak SQL.

In real code, use the driver's prepared statements — e.g. SQLite's `sqlite3_prepare_v2` + `sqlite3_bind_text`, libpq's `PQexecParams`, or a library like SOCI/sqlpp11.

### Interview answer
"Injection happens when input is concatenated into a query or command and changes its structure. The fix is parameterized queries or prepared statements — the database parses the statement before binding values, so input stays data — and safe ORM or query-builder usage, with allowlists for identifiers like sort columns that can't be parameters. For NoSQL I enforce types and reject operator keys like `$ne`; for OS commands I pass argument arrays without a shell. A least-privilege database user and non-leaky error messages limit damage if something slips."

---

## Cheat sheet

| Topic | Remember |
|---|---|
| Rate limits / quotas | edge + gateway + strict on login/OTP/reset; 429 + Retry-After; per-account and per-IP; no enumeration |
| Audit logs | who, what, when, where, result; append-only; no secrets |
| BOLA / IDOR | object-level authz on every operation; scope by owner/tenant; 404; allowlist writable fields |
| CORS | exact origin allowlist; no reflect/null with credentials; `Vary: Origin`; not API auth |
| XSS | context-aware encoding, auto-escaping, textContent, sanitizer for rich text, CSP with nonces, HttpOnly |
| CSRF | SameSite cookies, CSRF tokens, Origin/Sec-Fetch checks, no state change on GET |
| SSRF | allowlist; block private/metadata IPs after DNS + on redirects; IMDSv2; egress control |
| Open redirect | relative paths or allowlisted hosts only |
| Smuggling | CL vs. TE disagreement; normalize/reject at the edge; HTTP/2 |
| Uploads | size limits, magic bytes, random names, private storage, separate domain, nosniff, re-encode, scan, sandbox |
| Validation | server-side schema, allowlist, reject unknown fields, canonicalize, size/depth limits |
| Deserialization | data-only formats + explicit types; never pickle / native serialization of untrusted data |
| OWASP Top 10 (2021) | A01 access control, A02 crypto, A03 injection, A04 design, A05 misconfig, A06 components, A07 auth, A08 integrity, A09 logging, A10 SSRF |
| Injection | parameterized queries; allowlist identifiers; typed NoSQL; no shell strings; least-privilege DB user |
