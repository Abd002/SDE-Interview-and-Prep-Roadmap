# Application and API Security — OWASP Top 10, Injection, IDOR, XSS, CSRF, SSRF, CORS, Uploads and Abuse Prevention

> **What you'll learn:** the most common ways web apps and APIs get broken and how to **prevent** them: the **OWASP Top 10**, **SQL/NoSQL injection** and parameterized queries, **broken object-level authorization (BOLA/IDOR)**, **XSS** with output encoding and **CSP**, **CSRF, SSRF, open redirects and request smuggling**, **CORS**, **input/schema validation and safe deserialization**, **file uploads**, and **rate limiting, quotas, abuse prevention and audit logs**. Each part shows the vulnerable pattern next to the fix, in runnable C++.
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

#### Modern C++ example — per-account login limits against credential stuffing, a daily quota, and audit records
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <string>
#include <vector>

struct Audit { int t; std::string actor, ip, action, result; };
std::vector<Audit> audit_log;

class LoginGuard {
public:
    std::string attempt(const std::string& user, const std::string& ip, bool password_ok, int t) {
        auto& fails = fails_[user];
        while (!fails.empty() && fails.front() <= t - 900) fails.erase(fails.begin());   // 15-minute window
        auto& ip_fails = ip_fails_[ip];
        while (!ip_fails.empty() && ip_fails.front() <= t - 900) ip_fails.erase(ip_fails.begin());
        std::string result;
        if (fails.size() >= 5 || ip_fails.size() >= 20) result = "429 slow down (MFA/CAPTCHA required)";
        else if (password_ok) { result = "200 ok"; fails.clear(); }
        else { result = "401 invalid credentials"; fails.push_back(t); ip_fails.push_back(t); }   // same message for unknown users
        audit_log.push_back({t, user, ip, "login", result});
        return result;
    }
private:
    std::map<std::string, std::vector<int>> fails_, ip_fails_;
};

class Quota {
public:
    explicit Quota(int per_day) : limit_(per_day) {}
    bool consume(const std::string& tenant) { return ++used_[tenant] <= limit_; }
private:
    int limit_;
    std::map<std::string, int> used_;
};

int main() {
    LoginGuard guard;
    for (int i = 0; i < 7; ++i) guard.attempt("mona", "203.0.113.9", false, i * 10);     // attacker guesses
    std::cout << "real mona, right password, during lockout: " << guard.attempt("mona", "198.51.100.4", true, 80) << '\n';
    std::cout << "real mona, 20 min later:                   " << guard.attempt("mona", "198.51.100.4", true, 80 + 1200) << '\n';

    int blocked = 0;                                                    // stuffing across many accounts from one IP
    for (int i = 0; i < 40; ++i) blocked += guard.attempt("user" + std::to_string(i), "192.0.2.66", false, 2000 + i).rfind("429", 0) == 0;
    std::cout << "one IP trying 40 accounts: " << blocked << " attempts blocked by the per-IP limit\n";

    Quota free_plan(1000);
    int ok = 0;
    for (int i = 0; i < 1200; ++i) ok += free_plan.consume("tenant-a");
    std::cout << "free plan: " << ok << " of 1200 export requests allowed today\n";
    std::cout << "audit records written: " << audit_log.size() << "; last: t=" << audit_log.back().t << ' '
              << audit_log.back().actor << ' ' << audit_log.back().ip << ' ' << audit_log.back().action << " -> " << audit_log.back().result << '\n';
}
```

**Output:**
```text
real mona, right password, during lockout: 429 slow down (MFA/CAPTCHA required)
real mona, 20 min later:                   200 ok
one IP trying 40 accounts: 20 attempts blocked by the per-IP limit
free plan: 1000 of 1200 export requests allowed today
audit records written: 49; last: t=2039 user39 192.0.2.66 login -> 429 slow down (MFA/CAPTCHA required)
```

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

#### Modern C++ example — the IDOR bug, the fix with owner-scoped lookups, and mass-assignment protection
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <optional>
#include <set>
#include <string>

struct Invoice { int id; std::string owner; long cents; };
std::map<int, Invoice> invoices{{1043, {1043, "mona", 250'00}}, {1044, {1044, "omar", 9900'00}}};

std::string get_invoice_vulnerable(const std::string& /*caller*/, int id) {        // authenticated, but no object check
    auto it = invoices.find(id);
    return it == invoices.end() ? "404" : "200 invoice " + std::to_string(id) + " of " + it->second.owner;
}

std::optional<Invoice> find_for(const std::string& caller, int id) {              // scoped lookup: WHERE id=? AND owner=?
    auto it = invoices.find(id);
    if (it == invoices.end() || it->second.owner != caller) return std::nullopt;
    return it->second;
}
std::string get_invoice(const std::string& caller, int id) {
    auto inv = find_for(caller, id);
    return inv ? "200 invoice " + std::to_string(id) + " of " + inv->owner : "404 not found";   // 404 hides existence
}

struct Profile { std::string name, role = "user"; };
void update_profile(Profile& p, const std::map<std::string, std::string>& body) {
    static const std::set<std::string> writable{"name"};                            // allowlist, not "copy everything"
    for (auto& [k, v] : body) if (writable.count(k)) { if (k == "name") p.name = v; }
}

int main() {
    std::cout << "vulnerable: mona asks for 1044 -> " << get_invoice_vulnerable("mona", 1044) << "  (data leak!)\n";
    std::cout << "fixed:      mona asks for 1044 -> " << get_invoice("mona", 1044) << '\n';
    std::cout << "fixed:      mona asks for 1043 -> " << get_invoice("mona", 1043) << '\n';
    Profile p{"Mona"};
    update_profile(p, {{"name", "Mona A."}, {"role", "admin"}});
    std::cout << "PATCH {name, role:admin} -> name=" << p.name << ", role=" << p.role << " (role ignored)\n";
}
```

**Output:**
```text
vulnerable: mona asks for 1044 -> 200 invoice 1044 of omar  (data leak!)
fixed:      mona asks for 1044 -> 404 not found
fixed:      mona asks for 1043 -> 200 invoice 1043 of mona
PATCH {name, role:admin} -> name=Mona A., role=user (role ignored)
```

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

#### Modern C++ example — a safe CORS decision vs. the reflect-anything bug
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <set>
#include <string>

struct Headers { std::string allow_origin; bool allow_credentials = false; };

Headers cors_vulnerable(const std::string& origin) { return {origin, true}; }           // reflects anything + cookies

Headers cors_safe(const std::string& origin) {
    static const std::set<std::string> allowed{"https://app.example.com", "https://admin.example.com"};
    if (allowed.count(origin)) return {origin, true};                                   // exact match only
    return {"", false};                                                                 // no CORS headers -> browser blocks reads
}

bool sloppy_match(const std::string& origin) {                                          // what NOT to do
    const std::string suffix = "example.com";
    return origin.size() >= suffix.size() && origin.compare(origin.size() - suffix.size(), suffix.size(), suffix) == 0;
}

int main() {
    std::cout << std::boolalpha;
    for (std::string origin : {"https://app.example.com", "https://evil.example.net", "null", "https://evilexample.com"}) {
        auto v = cors_vulnerable(origin), s = cors_safe(origin);
        std::cout << origin << "\n  vulnerable: ACAO=" << v.allow_origin << " creds=" << v.allow_credentials
                  << "\n  safe:       " << (s.allow_origin.empty() ? std::string("no CORS headers (read blocked)") : "ACAO=" + s.allow_origin)
                  << "\n  endsWith(\"example.com\") would allow it: " << sloppy_match(origin) << '\n';
    }
    std::cout << "always send: Vary: Origin\n";
}
```

**Output:**
```text
https://app.example.com
  vulnerable: ACAO=https://app.example.com creds=true
  safe:       ACAO=https://app.example.com
  endsWith("example.com") would allow it: true
https://evil.example.net
  vulnerable: ACAO=https://evil.example.net creds=true
  safe:       no CORS headers (read blocked)
  endsWith("example.com") would allow it: false
null
  vulnerable: ACAO=null creds=true
  safe:       no CORS headers (read blocked)
  endsWith("example.com") would allow it: false
https://evilexample.com
  vulnerable: ACAO=https://evilexample.com creds=true
  safe:       no CORS headers (read blocked)
  endsWith("example.com") would allow it: true
always send: Vary: Origin
```

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

#### Modern C++ example — context-aware encoding and a URL scheme allowlist
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <cctype>
#include <iostream>
#include <string>

std::string html_escape(const std::string& s) {
    std::string out;
    for (char c : s) {
        switch (c) {
            case '&': out += "&amp;"; break;
            case '<': out += "&lt;"; break;
            case '>': out += "&gt;"; break;
            case '"': out += "&quot;"; break;
            case '\'': out += "&#x27;"; break;
            default: out += c;
        }
    }
    return out;
}

std::string safe_href(const std::string& url) {                 // allow only http(s) links
    std::string lower = url;
    std::transform(lower.begin(), lower.end(), lower.begin(), [](unsigned char c) { return std::tolower(c); });
    lower.erase(std::remove_if(lower.begin(), lower.end(), [](unsigned char c) { return std::isspace(c); }), lower.end());
    if (lower.rfind("https://", 0) == 0 || lower.rfind("http://", 0) == 0) return html_escape(url);
    return "#";                                                  // javascript:, data:, vbscript: ... rejected
}

int main() {
    std::string bio = "<script>steal(document.cookie)</script>";
    std::string name = "\" onmouseover=\"alert(1)";
    std::string site = " JavaScript:alert(1)";

    std::cout << "UNSAFE: <p>" << bio << "</p>\n";
    std::cout << "SAFE:   <p>" << html_escape(bio) << "</p>\n";
    std::cout << "SAFE:   <input value=\"" << html_escape(name) << "\">\n";
    std::cout << "SAFE:   <a href=\"" << safe_href(site) << "\">website</a>\n";
    std::cout << "SAFE:   <a href=\"" << safe_href("https://mona.dev/?q=a&b") << "\">website</a>\n";
    std::cout << "header: Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-...'; object-src 'none'\n";
}
```

**Output:**
```text
UNSAFE: <p><script>steal(document.cookie)</script></p>
SAFE:   <p>&lt;script&gt;steal(document.cookie)&lt;/script&gt;</p>
SAFE:   <input value="&quot; onmouseover=&quot;alert(1)">
SAFE:   <a href="#">website</a>
SAFE:   <a href="https://mona.dev/?q=a&amp;b">website</a>
header: Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-...'; object-src 'none'
```

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

#### Modern C++ example — CSRF token check, an SSRF guard for private IP ranges, and a safe redirect
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <cstdint>
#include <iostream>
#include <sstream>
#include <string>
#include <vector>

bool csrf_ok(const std::string& session_token, const std::string& form_token, const std::string& sec_fetch_site) {
    if (sec_fetch_site == "cross-site") return false;                           // browser says it came from another site
    return !session_token.empty() && session_token == form_token;               // (use constant-time compare in real code)
}

bool parse_ipv4(const std::string& s, std::uint32_t& ip) {
    std::istringstream in(s); int a, b, c, d; char x, y, z;
    if (!(in >> a >> x >> b >> y >> c >> z >> d) || x != '.' || y != '.' || z != '.') return false;
    for (int v : {a, b, c, d}) if (v < 0 || v > 255) return false;
    ip = (std::uint32_t(a) << 24) | (b << 16) | (c << 8) | d;
    return true;
}
bool is_internal(std::uint32_t ip) {
    auto in = [&](std::uint32_t net, int bits) { return (ip >> (32 - bits)) == (net >> (32 - bits)); };
    return in(0x0A000000, 8) || in(0xAC100000, 12) || in(0xC0A80000, 16) || in(0x7F000000, 8) || in(0xA9FE0000, 16) || ip == 0;
}
std::string fetch_guard(const std::string& resolved_ip) {                      // check the IP AFTER DNS resolution
    std::uint32_t ip;
    if (!parse_ipv4(resolved_ip, ip)) return "blocked (not a valid public IPv4)";
    return is_internal(ip) ? "blocked (internal address)" : "allowed";
}

std::string safe_redirect(const std::string& next) {
    if (next.size() > 1 && next[0] == '/' && next[1] != '/' && next[1] != '\\') return next;   // relative path only
    return "/home";
}

int main() {
    std::cout << std::boolalpha << "CSRF same-site form with token: " << csrf_ok("t0k3n", "t0k3n", "same-origin")
              << "\nCSRF forged cross-site post:    " << csrf_ok("t0k3n", "", "cross-site") << '\n';
    for (std::string ip : {"93.184.216.34", "169.254.169.254", "10.0.3.7", "127.0.0.1", "192.168.1.10"})
        std::cout << "SSRF fetch " << ip << " -> " << fetch_guard(ip) << '\n';
    for (std::string n : {"/orders/7", "https://evil.example", "//evil.example", "/\\evil.example"})
        std::cout << "redirect next=" << n << " -> " << safe_redirect(n) << '\n';
}
```

**Output:**
```text
CSRF same-site form with token: true
CSRF forged cross-site post:    false
SSRF fetch 93.184.216.34 -> allowed
SSRF fetch 169.254.169.254 -> blocked (internal address)
SSRF fetch 10.0.3.7 -> blocked (internal address)
SSRF fetch 127.0.0.1 -> blocked (internal address)
SSRF fetch 192.168.1.10 -> blocked (internal address)
redirect next=/orders/7 -> /orders/7
redirect next=https://evil.example -> /home
redirect next=//evil.example -> /home
redirect next=/\evil.example -> /home
```

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

#### Modern C++ example — upload validation by magic bytes, size and safe naming
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <random>
#include <string>
#include <vector>

struct Upload { std::string client_name, client_type; std::string bytes; };

std::string sniff(const std::string& b) {
    if (b.rfind("%PDF-", 0) == 0) return "application/pdf";
    if (b.rfind("\x89PNG\r\n\x1a\n", 0) == 0) return "image/png";
    if (b.size() >= 3 && static_cast<unsigned char>(b[0]) == 0xFF && static_cast<unsigned char>(b[1]) == 0xD8 && static_cast<unsigned char>(b[2]) == 0xFF) return "image/jpeg";
    if (b.rfind("MZ", 0) == 0) return "application/x-msdownload";
    return "unknown";
}

std::string accept(const Upload& u, std::mt19937_64& rng) {
    const std::size_t max_bytes = 5 * 1024 * 1024;
    if (u.bytes.size() > max_bytes) return "rejected: too large";
    std::string real = sniff(u.bytes);
    if (real != "application/pdf" && real != "image/png" && real != "image/jpeg")
        return "rejected: content is " + real + " (client claimed " + u.client_type + ")";
    char id[17];
    std::snprintf(id, sizeof id, "%016llx", static_cast<unsigned long long>(rng()));
    return "quarantined as uploads/" + std::string(id) + " (" + real + "), awaiting malware scan; original name kept only as metadata";
}

int main() {
    std::mt19937_64 rng(2026);
    std::vector<Upload> ups{
        {"cv.pdf", "application/pdf", "%PDF-1.7 ..."},
        {"avatar.png", "image/png", std::string("\x89PNG\r\n\x1a\n", 8) + "..."},
        {"invoice.pdf", "application/pdf", "MZ\x90\x00 this is really an .exe"},
        {"../../etc/passwd", "image/jpeg", "\xFF\xD8\xFF\xE0 jpeg data"},
        {"huge.png", "image/png", std::string(6 * 1024 * 1024, 'x')},
    };
    for (auto& u : ups) std::cout << u.client_name << " -> " << accept(u, rng) << '\n';
}
```

**Output:**
```text
cv.pdf -> quarantined as uploads/51476d3fdc77712d (application/pdf), awaiting malware scan; original name kept only as metadata
avatar.png -> quarantined as uploads/a783f53ec67dcc08 (image/png), awaiting malware scan; original name kept only as metadata
invoice.pdf -> rejected: content is application/x-msdownload (client claimed application/pdf)
../../etc/passwd -> quarantined as uploads/7c0e89f018c6aad1 (image/jpeg), awaiting malware scan; original name kept only as metadata
huge.png -> rejected: too large
```

The traversal attempt in the filename is harmless because the server never uses the client's name as a path.

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

#### Modern C++ example — strict schema validation with unknown-field rejection, and a type-allowlisted decoder
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <optional>
#include <regex>
#include <set>
#include <string>
#include <vector>

using Json = std::map<std::string, std::string>;          // flat stand-in for parsed JSON

struct CreateUser { std::string email; int age; std::string plan; };

std::optional<CreateUser> validate(const Json& in, std::vector<std::string>& errors) {
    static const std::set<std::string> allowed{"email", "age", "plan"};
    for (auto& [k, v] : in) if (!allowed.count(k)) errors.push_back("unknown field '" + k + "'");
    auto get = [&](const char* k) -> std::optional<std::string> { auto it = in.find(k); if (it == in.end()) { errors.push_back(std::string("missing '") + k + "'"); return {}; } return it->second; };
    auto email = get("email"), age = get("age"), plan = get("plan");
    if (email && (email->size() > 254 || !std::regex_match(*email, std::regex(R"([^@\s]+@[^@\s]+\.[a-z]{2,})")))) errors.push_back("email invalid");
    int age_v = -1;
    if (age) { if (age->empty() || age->size() > 3 || age->find_first_not_of("0123456789") != std::string::npos) errors.push_back("age must be an integer");
               else if ((age_v = std::stoi(*age)) < 13 || age_v > 130) errors.push_back("age out of range 13..130"); }
    if (plan && *plan != "free" && *plan != "pro") errors.push_back("plan must be free|pro");
    if (!errors.empty()) return std::nullopt;
    return CreateUser{*email, age_v, *plan};
}

// Safe decoding: only types on the allowlist can be constructed; no "class name from the input" magic.
std::string decode(const Json& msg) {
    static const std::set<std::string> types{"OrderPlaced", "OrderShipped"};
    auto t = msg.find("type");
    if (t == msg.end() || !types.count(t->second)) return "rejected: type not allowed";
    return "decoded " + t->second;
}

int main() {
    std::vector<Json> requests{
        {{"email", "mona@example.com"}, {"age", "29"}, {"plan", "pro"}},
        {{"email", "mona@example.com"}, {"age", "29"}, {"plan", "pro"}, {"is_admin", "true"}},
        {{"email", "not-an-email"}, {"age", "-5"}, {"plan", "enterprise"}},
    };
    for (auto& r : requests) {
        std::vector<std::string> errs;
        auto u = validate(r, errs);
        if (u) std::cout << "200 created " << u->email << " age " << u->age << " plan " << u->plan << '\n';
        else { std::cout << "400:"; for (auto& e : errs) std::cout << " [" << e << ']'; std::cout << '\n'; }
    }
    std::cout << decode({{"type", "OrderPlaced"}}) << '\n'
              << decode({{"type", "java.lang.Runtime"}}) << '\n';
}
```

**Output:**
```text
200 created mona@example.com age 29 plan pro
400: [unknown field 'is_admin']
400: [email invalid] [age must be an integer] [plan must be free|pro]
decoded OrderPlaced
rejected: type not allowed
```

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

#### Modern C++ example — scoring an app's controls against the Top 10 categories
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <string>
#include <vector>

struct Category { std::string id, name; std::vector<std::pair<std::string, bool>> checks; };

int main() {
    std::vector<Category> top10{
        {"A01", "Broken Access Control", {{"object-level authz on every endpoint", true}, {"deny-by-default routes", true}}},
        {"A02", "Cryptographic Failures", {{"TLS 1.2+ everywhere", true}, {"passwords hashed with Argon2id", false}}},
        {"A03", "Injection", {{"parameterized queries only", true}, {"auto-escaping templates", true}}},
        {"A05", "Security Misconfiguration", {{"debug disabled in prod", true}, {"no public buckets", false}}},
        {"A06", "Vulnerable Components", {{"SCA in CI with patch SLA", false}}},
        {"A07", "Auth Failures", {{"MFA for admins", true}, {"login rate limiting", true}}},
        {"A09", "Logging & Monitoring", {{"audit log for admin actions", true}, {"alerts on auth anomalies", false}}},
        {"A10", "SSRF", {{"egress allowlist for URL fetchers", true}}},
    };
    int gaps = 0;
    for (auto& c : top10) {
        std::vector<std::string> missing;
        for (auto& [check, ok] : c.checks) if (!ok) missing.push_back(check);
        std::cout << c.id << ' ' << c.name << ": " << (missing.empty() ? "covered" : "GAP");
        for (auto& m : missing) { std::cout << " - " << m; ++gaps; }
        std::cout << '\n';
    }
    std::cout << gaps << " gaps -> add them to the risk register with owners\n";
}
```

**Output:**
```text
A01 Broken Access Control: covered
A02 Cryptographic Failures: GAP - passwords hashed with Argon2id
A03 Injection: covered
A05 Security Misconfiguration: GAP - no public buckets
A06 Vulnerable Components: GAP - SCA in CI with patch SLA
A07 Auth Failures: covered
A09 Logging & Monitoring: GAP - alerts on auth anomalies
A10 SSRF: covered
4 gaps -> add them to the risk register with owners
```

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

#### Modern C++ example — a toy query engine showing concatenation vs. parameter binding, and a NoSQL operator check
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <string>
#include <vector>

struct User { std::string name, email; };
const std::vector<User> users{{"mona", "mona@x.com"}, {"omar", "omar@x.com"}, {"lina", "lina@x.com"}};

// The toy "database" understands: SELECT WHERE name = '<lit>' [OR '<a>'='<b>']
std::vector<User> run_sql(const std::string& sql) {
    std::vector<User> out;
    auto q1 = sql.find('\''), q2 = sql.find('\'', q1 + 1);
    std::string literal = sql.substr(q1 + 1, q2 - q1 - 1);
    bool always_true = sql.find("OR '1'='1'", q2) != std::string::npos ||          // what the parser now sees
                       sql.find("OR '1'='1", q2) != std::string::npos;
    for (auto& u : users) if (u.name == literal || always_true) out.push_back(u);
    return out;
}

std::vector<User> find_vulnerable(const std::string& name) {
    return run_sql("SELECT * FROM users WHERE name = '" + name + "'");               // input becomes code
}

std::vector<User> find_parameterized(const std::string& name) {                    // "prepared": structure fixed first
    std::vector<User> out;
    for (auto& u : users) if (u.name == name) out.push_back(u);                    // the value is only compared, never parsed
    return out;
}

std::string order_by(const std::string& user_choice) {                              // identifiers: allowlist mapping
    static const std::map<std::string, std::string> cols{{"name", "name"}, {"newest", "created_at DESC"}};
    auto it = cols.find(user_choice);
    return "ORDER BY " + (it == cols.end() ? std::string("name") : it->second);
}

bool mongo_login_vulnerable(const std::map<std::string, std::string>& password_field) {
    return password_field.count("$ne") > 0 || (password_field.count("eq") && password_field.at("eq") == "s3cret");  // {$ne: null} matches!
}
bool mongo_login_safe(const std::map<std::string, std::string>& password_field) {
    for (auto& [k, v] : password_field) if (!k.empty() && k[0] == '$') return false;                                 // reject operators
    return password_field.count("eq") && password_field.at("eq") == "s3cret";
}

int main() {
    std::string attack = "x' OR '1'='1";
    std::cout << "concatenated query:  SELECT * FROM users WHERE name = '" << attack << "'\n";
    std::cout << "vulnerable returns " << find_vulnerable(attack).size() << " users (all of them)\n";
    std::cout << "parameterized returns " << find_parameterized(attack).size() << " users\n";
    std::cout << "normal lookup: " << find_parameterized("omar").at(0).email << '\n';
    std::cout << "sort=newest -> " << order_by("newest") << "; sort=\"name; DROP TABLE users\" -> " << order_by("name; DROP TABLE users") << '\n';
    std::cout << std::boolalpha << "NoSQL login with {\"$ne\": null}: vulnerable=" << mongo_login_vulnerable({{"$ne", ""}})
              << ", safe=" << mongo_login_safe({{"$ne", ""}}) << '\n';
}
```

**Output:**
```text
concatenated query:  SELECT * FROM users WHERE name = 'x' OR '1'='1'
vulnerable returns 3 users (all of them)
parameterized returns 0 users
normal lookup: omar@x.com
sort=newest -> ORDER BY created_at DESC; sort="name; DROP TABLE users" -> ORDER BY name
NoSQL login with {"$ne": null}: vulnerable=true, safe=false
```

In real C++ code, use the driver's prepared statements — e.g. SQLite's `sqlite3_prepare_v2` + `sqlite3_bind_text`, libpq's `PQexecParams`, or a library like SOCI/sqlpp11.

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
