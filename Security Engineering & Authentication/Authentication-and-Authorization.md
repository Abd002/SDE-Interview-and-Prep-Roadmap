# Authentication and Authorization — Sessions, JWT, OAuth 2.0, OIDC, Access Control, Service Identity, SSO and MFA

> **What you'll learn:** the difference between **authentication** and **authorization**, and between **identity** and **sessions**; secure **cookies and sessions** (SameSite, HttpOnly, Secure, CSRF); **JWT** structure and **validation** with key rotation; **OAuth 2.0** roles, the **authorization code flow with PKCE**, scopes and refresh tokens; how **OpenID Connect** adds login on top; **RBAC vs. ABAC vs. policy-based** access control; **service-to-service** authentication and **workload identities**; and **SSO, SAML, MFA and passkeys/WebAuthn**. Each part has a runnable C++ example; the JWT and PKCE examples reproduce official test vectors.
>
> **Prerequisites:** [Core Security Principles](./Core-Security-Principles.md), [Cryptography → HMAC and signatures](./Cryptography-and-Data-Protection.md#4-hmac-digital-signatures-and-authenticated-encryption).

## Table of Contents
1. [Authentication vs. authorization; identity vs. session management](#1-authentication-vs-authorization-identity-vs-session-management)
2. [JWT structure, claims, signature validation, and key rotation](#2-jwt-structure-claims-signature-validation-and-key-rotation)
3. [OAuth 2.0 roles, authorization code + PKCE, scopes, and refresh tokens](#3-oauth-20-roles-authorization-code--pkce-scopes-and-refresh-tokens)
4. [OpenID Connect (OIDC) vs. OAuth 2.0](#4-openid-connect-oidc-vs-oauth-20)
5. [RBAC vs. ABAC vs. policy-based access control](#5-rbac-vs-abac-vs-policy-based-access-control)
6. [Service-to-service authentication and workload identities](#6-service-to-service-authentication-and-workload-identities)
7. [Sessions, cookies, SameSite, HttpOnly, Secure, and CSRF protection](#7-sessions-cookies-samesite-httponly-secure-and-csrf-protection)
8. [SSO, SAML basics, MFA, and passkeys/WebAuthn](#8-sso-saml-basics-mfa-and-passkeyswebauthn)
9. [Cheat sheet](#cheat-sheet)

---

## 1. Authentication vs. authorization; identity vs. session management

**In one sentence:** **authentication (AuthN)** proves **who** you are, **authorization (AuthZ)** decides **what** you may do; **identity** is the long-lived account (user, service) with its credentials, while a **session** is the short-lived proof that an authenticated identity is still behind the current requests.

### In plain words
At an airport, the passport check proves who you are (authentication). Your boarding pass decides which plane and seat you may use (authorization). The passport lasts years (identity); the boarding pass is only valid for today's flight (session).

### How it works
| | Authentication | Authorization |
|---|---|---|
| Question | who are you? | are you allowed to do this? |
| Inputs | password, passkey, OTP, certificate, SSO assertion | identity + roles/attributes + resource + action + context |
| Failure code | 401 Unauthorized ("unauthenticated") | 403 Forbidden (or 404 to hide existence) |
| Happens | once per login (plus step-up) | on **every** request / action |

**Identity management:** registration, verification (email/phone/KYC), credentials (password hashes, passkeys, MFA factors), account recovery (a classic weak point — make it as strong as login), lifecycle (disable on offboarding — SCIM provisioning), federation (SSO).

**Session management:** after login, issue a **session** — a random opaque ID in a cookie (server-side session store) or a signed **token** (JWT). Rules:
- **Regenerate** the session ID at login and privilege change (prevents **session fixation**).
- **Idle and absolute timeouts**; re-authenticate for sensitive actions (**step-up**).
- **Server-side revocation** on logout, password change, MFA reset — easy with opaque sessions, harder with long-lived JWTs (keep them short).
- Bind to context where useful (device, risk signals); show users their active sessions.

#### Modern C++ example — login creates a session, every request checks it (AuthN) and then the action (AuthZ)
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <optional>
#include <random>
#include <set>
#include <string>

struct Session { std::string user; long created, last_seen; };

class SessionStore {
public:
    std::string create(const std::string& user, long now) {
        std::string id;
        for (int i = 0; i < 32; ++i) id += "0123456789abcdef"[rng_() % 16];   // real code: 128+ bits from a CSPRNG
        sessions_[id] = {user, now, now};
        return id;
    }
    std::optional<std::string> authenticate(const std::string& id, long now) {
        auto it = sessions_.find(id);
        if (it == sessions_.end()) return std::nullopt;
        if (now - it->second.last_seen > 30 * 60 || now - it->second.created > 12 * 3600) { sessions_.erase(it); return std::nullopt; }
        it->second.last_seen = now;
        return it->second.user;
    }
    void revoke_all(const std::string& user) { std::erase_if(sessions_, [&](auto& kv) { return kv.second.user == user; }); }
private:
    std::mt19937_64 rng_{1};
    std::map<std::string, Session> sessions_;
};

const std::map<std::string, std::set<std::string>> permissions{{"mona", {"orders:read"}}, {"lina", {"orders:read", "orders:refund"}}};

std::string handle(SessionStore& s, const std::string& cookie, const std::string& action, long now) {
    auto user = s.authenticate(cookie, now);
    if (!user) return "401 please log in";                                         // AuthN failed
    if (!permissions.at(*user).count(action)) return "403 " + *user + " may not " + action;   // AuthZ failed
    return "200 " + *user + " did " + action;
}

int main() {
    SessionStore store;
    std::string mona = store.create("mona", 0), lina = store.create("lina", 0);
    std::cout << handle(store, mona, "orders:read", 60) << '\n'
              << handle(store, mona, "orders:refund", 120) << '\n'
              << handle(store, lina, "orders:refund", 180) << '\n'
              << handle(store, "forged-cookie", "orders:read", 200) << '\n'
              << handle(store, mona, "orders:read", 200 + 31 * 60) << "  (idle timeout)\n";
    store.revoke_all("lina");                                                      // password changed
    std::cout << handle(store, lina, "orders:read", 300) << "  (revoked after password change)\n";
}
```

**Output:**
```text
200 mona did orders:read
403 mona may not orders:refund
200 lina did orders:refund
401 please log in
401 please log in  (idle timeout)
401 please log in  (revoked after password change)
```

### Interview answer
"Authentication establishes who the caller is — password, passkey, MFA, certificate or SSO — and returns 401 when it fails; authorization decides on every request whether that identity may perform this action on this resource, returning 403 or 404. Identity is the long-lived account with its credentials and lifecycle; a session is the short-lived proof afterwards. I regenerate session IDs at login, enforce idle and absolute timeouts, require step-up for sensitive actions, and make sessions revocable on logout, password change or offboarding."

---

## 2. JWT structure, claims, signature validation, and key rotation

**In one sentence:** a **JWT** is `base64url(header).base64url(payload).base64url(signature)` — a signed (not encrypted) set of **claims** — and you must **validate** it fully: allowed **algorithm**, **signature** with the right key (`kid`), **issuer**, **audience**, **expiry/not-before**, and rotate signing keys via a published **JWKS**.

### In plain words
A JWT is a concert wristband with printed details (name, date, which stage) and a hologram (signature). Anyone can **read** the print, so don't put secrets on it. The hologram proves it's genuine — but the guard must also check the date, the venue and the stage, not just the hologram.

### How it works
- **Header:** `{"alg":"RS256","typ":"JWT","kid":"2026-10"}`. **Payload (claims):** registered claims `iss` (issuer), `sub` (subject/user), `aud` (audience — which API it's for), `exp`, `nbf`, `iat`, `jti` (unique ID), plus custom claims (`scope`, `roles`, `tenant`).
- **Signed, not encrypted** (that's JWS). Anyone can base64-decode the payload; for confidentiality use JWE or keep data server-side.
- **Algorithms:** asymmetric `RS256`/`PS256`/`ES256`/`EdDSA` when many services verify (only the issuer holds the private key); `HS256` (HMAC) only when the same trusted party signs and verifies.

**Validation checklist (every request)**
1. **Pin the allowed algorithm(s)** — reject `alg: none` and **algorithm confusion** (an RS256 public key used as an HS256 secret).
2. Find the key by `kid` in your **trusted JWKS** (from the issuer's `jwks_uri`, cached) — never trust a key or URL embedded in the token (`jwk`, `jku`, `x5u` headers).
3. Verify the **signature** (constant time).
4. Check `iss` equals your issuer, `aud` contains **your** API, `exp` > now and `nbf` ≤ now (small clock skew allowance), then scopes/roles.
5. Keep access tokens **short-lived** (5–15 min) — revocation is hard; use refresh tokens and a denylist (`jti`) only when needed.

**Key rotation:** publish the new key in JWKS **before** signing with it, sign new tokens with the new `kid`, keep the old public key until all tokens signed by it expire, then remove it.

#### Modern C++ example — HS256 JWT signing and full validation (reproduces the jwt.io example token)
```cpp
// g++ -std=c++20 -O2 main.cpp && ./a.out
#include <array>
#include <cstdint>
#include <iostream>
#include <map>
#include <optional>
#include <string>

std::array<std::uint8_t, 32> sha256(const std::string& msg) {           // FIPS 180-4 (see the Cryptography guide)
    static constexpr std::uint32_t K[64] = {
        0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,
        0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
        0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,
        0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
        0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,
        0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2};
    std::uint32_t h[8] = {0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19};
    std::string m = msg;
    std::uint64_t bits = static_cast<std::uint64_t>(msg.size()) * 8;
    m += static_cast<char>(0x80);
    while (m.size() % 64 != 56) m += '\0';
    for (int i = 7; i >= 0; --i) m += static_cast<char>((bits >> (i * 8)) & 0xFF);
    auto rotr = [](std::uint32_t x, int n) { return (x >> n) | (x << (32 - n)); };
    for (std::size_t off = 0; off < m.size(); off += 64) {
        std::uint32_t w[64];
        for (int i = 0; i < 16; ++i)
            w[i] = (std::uint32_t(std::uint8_t(m[off + 4 * i])) << 24) | (std::uint32_t(std::uint8_t(m[off + 4 * i + 1])) << 16) |
                   (std::uint32_t(std::uint8_t(m[off + 4 * i + 2])) << 8) | std::uint32_t(std::uint8_t(m[off + 4 * i + 3]));
        for (int i = 16; i < 64; ++i) {
            std::uint32_t s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >> 3);
            std::uint32_t s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >> 10);
            w[i] = w[i - 16] + s0 + w[i - 7] + s1;
        }
        std::uint32_t a = h[0], b = h[1], c = h[2], d = h[3], e = h[4], f = h[5], g = h[6], hh = h[7];
        for (int i = 0; i < 64; ++i) {
            std::uint32_t t1 = hh + (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) + ((e & f) ^ (~e & g)) + K[i] + w[i];
            std::uint32_t t2 = (rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) + ((a & b) ^ (a & c) ^ (b & c));
            hh = g; g = f; f = e; e = d + t1; d = c; c = b; b = a; a = t1 + t2;
        }
        h[0] += a; h[1] += b; h[2] += c; h[3] += d; h[4] += e; h[5] += f; h[6] += g; h[7] += hh;
    }
    std::array<std::uint8_t, 32> out;
    for (int i = 0; i < 8; ++i) for (int j = 0; j < 4; ++j) out[4 * i + j] = static_cast<std::uint8_t>(h[i] >> (24 - 8 * j));
    return out;
}
std::string hmac(std::string key, const std::string& msg) {
    if (key.size() > 64) { auto d = sha256(key); key.assign(d.begin(), d.end()); }
    key.resize(64, '\0');
    std::string ip(64, 0), op(64, 0);
    for (int i = 0; i < 64; ++i) { ip[i] = static_cast<char>(key[i] ^ 0x36); op[i] = static_cast<char>(key[i] ^ 0x5c); }
    auto in = sha256(ip + msg);
    auto out = sha256(op + std::string(in.begin(), in.end()));
    return {out.begin(), out.end()};
}
std::string b64url(const std::string& in) {
    static const char* t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
    std::string out; int val = 0, bits = -6;
    for (unsigned char c : in) { val = (val << 8) + c; bits += 8; while (bits >= 0) { out += t[(val >> bits) & 0x3F]; bits -= 6; } }
    if (bits > -6) out += t[((val << 8) >> (bits + 8)) & 0x3F];
    return out;                                                          // no '=' padding in JWTs
}
std::string b64url_decode(const std::string& in) {
    std::string out; int val = 0, bits = -8;
    for (char c : in) {
        int d = c >= 'A' && c <= 'Z' ? c - 'A' : c >= 'a' && c <= 'z' ? c - 'a' + 26 : c >= '0' && c <= '9' ? c - '0' + 52 : c == '-' ? 62 : c == '_' ? 63 : -1;
        if (d < 0) break;
        val = (val << 6) + d; bits += 6;
        if (bits >= 0) { out += static_cast<char>((val >> bits) & 0xFF); bits -= 8; }
    }
    return out;
}
std::string claim(const std::string& json, const std::string& k) {        // tiny extractor for this demo
    auto p = json.find("\"" + k + "\":"); if (p == std::string::npos) return "";
    p += k.size() + 3; bool q = json[p] == '"'; if (q) ++p;
    auto e = json.find_first_of(q ? "\"" : ",}", p); return json.substr(p, e - p);
}

std::map<std::string, std::string> jwks{{"k1", "your-256-bit-secret"}};    // kid -> key (trusted key set)

std::string validate(const std::string& token, long now, const std::string& expected_aud) {
    auto d1 = token.find('.'), d2 = token.find('.', d1 + 1);
    if (d1 == std::string::npos || d2 == std::string::npos) return "reject: malformed";
    std::string header = b64url_decode(token.substr(0, d1)), payload = b64url_decode(token.substr(d1 + 1, d2 - d1 - 1));
    if (claim(header, "alg") != "HS256") return "reject: algorithm " + claim(header, "alg") + " not allowed";
    std::string kid = claim(header, "kid").empty() ? "k1" : claim(header, "kid");
    auto key = jwks.find(kid);
    if (key == jwks.end()) return "reject: unknown kid";
    if (b64url(hmac(key->second, token.substr(0, d2))) != token.substr(d2 + 1)) return "reject: bad signature";
    if (!claim(payload, "exp").empty() && std::stol(claim(payload, "exp")) <= now) return "reject: expired";
    if (!expected_aud.empty() && claim(payload, "aud") != expected_aud) return "reject: wrong audience";
    return "accept sub=" + claim(payload, "sub");
}

std::string sign(const std::string& header, const std::string& payload, const std::string& key) {
    std::string input = b64url(header) + "." + b64url(payload);
    return input + "." + b64url(hmac(key, input));
}

int main() {
    std::string t = sign(R"({"alg":"HS256","typ":"JWT"})", R"({"sub":"1234567890","name":"John Doe","iat":1516239022})", "your-256-bit-secret");
    std::cout << t << "\nmatches the jwt.io example: " << std::boolalpha
              << (t == "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c") << '\n';

    long now = 1'760'000'000;
    std::string good = sign(R"({"alg":"HS256","kid":"k1"})", R"({"sub":"mona","aud":"orders-api","exp":1760000600})", "your-256-bit-secret");
    std::cout << "valid token:        " << validate(good, now, "orders-api") << '\n'
              << "other API's token:  " << validate(good, now, "billing-api") << '\n'
              << "after expiry:       " << validate(good, now + 3600, "orders-api") << '\n';
    std::string payload_part = good.substr(good.find('.') + 1, good.rfind('.') - good.find('.') - 1);
    std::string forged = good.substr(0, good.find('.') + 1) + b64url(R"({"sub":"admin","aud":"orders-api","exp":1760000600})") + good.substr(good.rfind('.'));
    std::cout << "edited payload:     " << validate(forged, now, "orders-api") << '\n';
    std::string none = b64url(R"({"alg":"none"})") + "." + payload_part + ".";
    std::cout << "alg=none:           " << validate(none, now, "orders-api") << '\n';
    jwks["k2"] = "new-rotated-secret-2026-10";                                   // rotation: add k2 first, then sign with it
    std::string rotated = sign(R"({"alg":"HS256","kid":"k2"})", R"({"sub":"omar","aud":"orders-api","exp":1760000600})", "new-rotated-secret-2026-10");
    std::cout << "signed with new kid:" << ' ' << validate(rotated, now, "orders-api") << " (old k1 tokens still valid until they expire)\n";
}
```

**Output:**
```text
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
matches the jwt.io example: true
valid token:        accept sub=mona
other API's token:  reject: wrong audience
after expiry:       reject: expired
edited payload:     reject: bad signature
alg=none:           reject: algorithm none not allowed
signed with new kid: accept sub=omar (old k1 tokens still valid until they expire)
```

In production use a maintained library (jwt-cpp, libjwt, or your framework's) and asymmetric algorithms (RS256/ES256/EdDSA) with keys from the issuer's JWKS.

### Interview answer
"A JWT is a base64url header, payload of claims, and signature — signed, not encrypted, so no secrets inside. On every request I pin the allowed algorithms, rejecting `none` and algorithm confusion, select the key by `kid` only from the issuer's trusted JWKS, verify the signature, then check issuer, audience, expiry and not-before with small clock skew, and finally scopes. Access tokens stay short-lived because revocation is hard. To rotate, I publish the new key in the JWKS first, start signing with its kid, and remove the old key only after its tokens have expired."

---

## 3. OAuth 2.0 roles, authorization code + PKCE, scopes, and refresh tokens

**In one sentence:** **OAuth 2.0** lets a **client** app get **limited, delegated access** (an **access token** with **scopes**) to a user's resources on a **resource server**, approved by the **resource owner** at an **authorization server** — for apps the right flow is **authorization code + PKCE**, with **refresh tokens** to get new short-lived access tokens.

### In plain words
A hotel **valet key**: you (resource owner) give the valet (client app) a special key from the front desk (authorization server) that only drives the car a few kilometres and can't open the trunk (scopes). You never hand over your house keys (password).

### How it works
**Roles:** resource owner (user), client (the app), authorization server (Google, Auth0, Keycloak, Entra ID, Cognito), resource server (the API).

**Authorization code + PKCE (RFC 6749 + RFC 7636; required for all clients in OAuth 2.1)**
1. Client makes a random `code_verifier`, computes `code_challenge = BASE64URL(SHA256(code_verifier))`, and a random `state`.
2. Redirects the browser to `/authorize?response_type=code&client_id=…&redirect_uri=…&scope=orders:read&state=…&code_challenge=…&code_challenge_method=S256`.
3. User logs in and **consents**; the AS redirects back to the **exact registered** `redirect_uri` with `?code=…&state=…`. Client checks `state` (CSRF).
4. Client POSTs to `/token` with the `code` **and** the `code_verifier` (+ client secret for confidential clients). AS checks `SHA256(verifier) == challenge` — a stolen code is useless without the verifier.
5. AS returns `access_token` (short-lived), optional `refresh_token`, `expires_in`, `scope`.

**Other grants:** **client credentials** (machine-to-machine, no user), **device code** (TVs/CLIs). **Deprecated:** implicit grant and resource-owner password grant.

**Scopes** describe **what** the client may do (`orders:read`, `profile`); the API still applies its own authorization (scope **and** user permissions). Ask for the **minimum** scopes.

**Refresh tokens:** long-lived, stored securely (server-side for web apps); **rotation** — each use returns a new refresh token and invalidates the old one; reuse of an old one signals theft → revoke the whole family. Bind tokens to the client (DPoP / mTLS-bound tokens) for high-security APIs.

**Where to keep tokens in browser apps:** prefer a **backend-for-frontend (BFF)** that holds tokens server-side and gives the browser an HttpOnly session cookie; avoid `localStorage` (readable by XSS).

#### Modern C++ example — PKCE S256 (RFC 7636 test vector), state check, and refresh-token rotation with reuse detection
```cpp
// g++ -std=c++20 -O2 main.cpp && ./a.out
#include <array>
#include <cstdint>
#include <iostream>
#include <map>
#include <set>
#include <string>

std::array<std::uint8_t, 32> sha256(const std::string& msg) {           // FIPS 180-4 (see the Cryptography guide)
    static constexpr std::uint32_t K[64] = {
        0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,
        0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
        0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,
        0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
        0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,
        0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2};
    std::uint32_t h[8] = {0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19};
    std::string m = msg;
    std::uint64_t bits = static_cast<std::uint64_t>(msg.size()) * 8;
    m += static_cast<char>(0x80);
    while (m.size() % 64 != 56) m += '\0';
    for (int i = 7; i >= 0; --i) m += static_cast<char>((bits >> (i * 8)) & 0xFF);
    auto rotr = [](std::uint32_t x, int n) { return (x >> n) | (x << (32 - n)); };
    for (std::size_t off = 0; off < m.size(); off += 64) {
        std::uint32_t w[64];
        for (int i = 0; i < 16; ++i)
            w[i] = (std::uint32_t(std::uint8_t(m[off + 4 * i])) << 24) | (std::uint32_t(std::uint8_t(m[off + 4 * i + 1])) << 16) |
                   (std::uint32_t(std::uint8_t(m[off + 4 * i + 2])) << 8) | std::uint32_t(std::uint8_t(m[off + 4 * i + 3]));
        for (int i = 16; i < 64; ++i) {
            std::uint32_t s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >> 3);
            std::uint32_t s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >> 10);
            w[i] = w[i - 16] + s0 + w[i - 7] + s1;
        }
        std::uint32_t a = h[0], b = h[1], c = h[2], d = h[3], e = h[4], f = h[5], g = h[6], hh = h[7];
        for (int i = 0; i < 64; ++i) {
            std::uint32_t t1 = hh + (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) + ((e & f) ^ (~e & g)) + K[i] + w[i];
            std::uint32_t t2 = (rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) + ((a & b) ^ (a & c) ^ (b & c));
            hh = g; g = f; f = e; e = d + t1; d = c; c = b; b = a; a = t1 + t2;
        }
        h[0] += a; h[1] += b; h[2] += c; h[3] += d; h[4] += e; h[5] += f; h[6] += g; h[7] += hh;
    }
    std::array<std::uint8_t, 32> out;
    for (int i = 0; i < 8; ++i) for (int j = 0; j < 4; ++j) out[4 * i + j] = static_cast<std::uint8_t>(h[i] >> (24 - 8 * j));
    return out;
}
std::string b64url(const std::string& in) {
    static const char* t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
    std::string out; int val = 0, bits = -6;
    for (unsigned char c : in) { val = (val << 8) + c; bits += 8; while (bits >= 0) { out += t[(val >> bits) & 0x3F]; bits -= 6; } }
    if (bits > -6) out += t[((val << 8) >> (bits + 8)) & 0x3F];
    return out;
}
std::string s256(const std::string& verifier) { auto d = sha256(verifier); return b64url(std::string(d.begin(), d.end())); }

class AuthorizationServer {
public:
    void authorize(const std::string& code, const std::string& challenge) { codes_[code] = challenge; }
    std::string token(const std::string& code, const std::string& verifier) {
        auto it = codes_.find(code);
        if (it == codes_.end()) return "invalid_grant (unknown or used code)";
        bool ok = s256(verifier) == it->second;
        codes_.erase(it);                                              // codes are single-use
        if (!ok) return "invalid_grant (PKCE verifier mismatch)";
        return issue_refresh("family-1");
    }
    std::string refresh(const std::string& rt) {
        auto it = live_.find(rt);
        if (it == live_.end()) {
            if (used_.count(rt)) { revoked_.insert(used_[rt]); return "REUSE DETECTED: family " + used_[rt] + " revoked"; }
            return "invalid_grant";
        }
        std::string fam = it->second;
        if (revoked_.count(fam)) return "invalid_grant (family revoked)";
        used_[rt] = fam; live_.erase(it);
        return issue_refresh(fam);                                     // rotation: new RT each time
    }
private:
    std::string issue_refresh(const std::string& fam) { std::string rt = "rt" + std::to_string(++n_); live_[rt] = fam; return "access_token(15 min) + " + rt; }
    std::map<std::string, std::string> codes_, live_, used_;
    std::set<std::string> revoked_;
    int n_ = 0;
};

int main() {
    std::string verifier = "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk";            // RFC 7636 Appendix B
    std::string challenge = s256(verifier);
    std::cout << "code_challenge = " << challenge << "\nmatches RFC 7636: " << std::boolalpha
              << (challenge == "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM") << '\n';

    std::string sent_state = "xyz-random-123", returned_state = "xyz-random-123";
    std::cout << "state matches (no login CSRF): " << (sent_state == returned_state) << '\n';

    AuthorizationServer as;
    as.authorize("code-abc", challenge);
    std::cout << "attacker with stolen code, no verifier: " << as.token("code-abc", "guess") << '\n';
    as.authorize("code-def", challenge);
    std::cout << "client with verifier: " << as.token("code-def", verifier) << '\n';
    std::cout << "refresh rt1: " << as.refresh("rt1") << '\n';
    std::cout << "attacker replays stolen rt1: " << as.refresh("rt1") << '\n';
    std::cout << "legit client uses rt2: " << as.refresh("rt2") << '\n';
}
```

**Output:**
```text
code_challenge = E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM
matches RFC 7636: true
state matches (no login CSRF): true
attacker with stolen code, no verifier: invalid_grant (PKCE verifier mismatch)
client with verifier: access_token(15 min) + rt1
refresh rt1: access_token(15 min) + rt2
attacker replays stolen rt1: REUSE DETECTED: family family-1 revoked
legit client uses rt2: invalid_grant (family revoked)
```

The legitimate client also loses access after the reuse — the safe choice: the user simply logs in again, and the thief is locked out.

### Interview answer
"OAuth 2.0 is delegated authorization: the resource owner lets a client get a scoped access token from an authorization server to call a resource server, without sharing their password. For any app I use the authorization code flow with PKCE: the client sends a SHA-256 challenge of a random verifier, the code comes back to an exact registered redirect URI with a state check, and the token exchange requires the verifier, so a stolen code is useless. Access tokens are short-lived with minimal scopes; refresh tokens rotate on every use and reuse revokes the family. Browser apps should keep tokens in a backend-for-frontend, not localStorage. Implicit and password grants are deprecated."

---

## 4. OpenID Connect (OIDC) vs. OAuth 2.0

**In one sentence:** **OAuth 2.0** is for **authorization** (an access token to call an API), while **OpenID Connect** is a thin layer on top that adds **authentication** — an **ID token** (a signed JWT saying *who logged in*), the `openid` scope, a **UserInfo** endpoint and standard **discovery** — so "Log in with Google" is OIDC, not plain OAuth.

### In plain words
OAuth gives the valet a key to drive your car — it says nothing about who you are. OIDC adds a signed name badge: "this is Mona, she logged in at 10:02 with MFA". Using an OAuth access token as proof of login is like trusting someone because they hold a car key.

### How it works
| | OAuth 2.0 | OIDC |
|---|---|---|
| Purpose | delegated access to APIs | user login (identity) + OAuth |
| Main artifact | **access token** (for the API; opaque or JWT) | **ID token** (JWT for the **client**) |
| Audience | the resource server | the client app (`aud` = client_id) |
| Scopes | app-defined (`orders:read`) | `openid` (+ `profile`, `email`, …) |
| Extras | — | UserInfo endpoint, `/.well-known/openid-configuration` discovery, JWKS, `nonce`, standard claims |

**ID token claims & checks:** `iss`, `sub` (stable user ID — use this, not email, as the key), `aud` = your client ID, `exp`, `iat`, `nonce` (must equal the value you sent → stops replay), `auth_time`, `acr`/`amr` (how strong the login was, e.g. MFA), `email` + `email_verified`.

**Common mistakes**
- Using an **access token as proof of identity** in the client (it may be for another audience).
- Accepting an ID token **as an API credential** (it's meant for the client).
- Linking accounts by **unverified email**.
- Skipping `nonce`/`state` checks.

#### Modern C++ example — validating an ID token's claims for login (after signature verification)
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <string>

using Claims = std::map<std::string, std::string>;

std::string login(const Claims& id, const std::string& client_id, const std::string& sent_nonce, long now, bool need_mfa) {
    if (id.at("iss") != "https://accounts.example.com") return "reject: wrong issuer";
    if (id.at("aud") != client_id) return "reject: ID token was issued to another client";
    if (std::stol(id.at("exp")) <= now) return "reject: expired";
    if (id.at("nonce") != sent_nonce) return "reject: nonce mismatch (replayed token?)";
    if (need_mfa && id.at("amr").find("mfa") == std::string::npos) return "step-up: MFA required for this app";
    std::string email_note = id.at("email_verified") == "true" ? "" : " (email NOT verified: don't link accounts by it)";
    return "logged in as sub=" + id.at("sub") + email_note;
}

int main() {
    Claims token{{"iss", "https://accounts.example.com"}, {"sub", "248289761001"}, {"aud", "orders-web"}, {"exp", "1760000600"},
                 {"nonce", "n-0S6_WzA2Mj"}, {"amr", "pwd,mfa"}, {"email", "mona@example.com"}, {"email_verified", "true"}};
    const long now = 1'760'000'000;
    std::cout << login(token, "orders-web", "n-0S6_WzA2Mj", now, true) << '\n';
    std::cout << login(token, "billing-web", "n-0S6_WzA2Mj", now, false) << '\n';
    std::cout << login(token, "orders-web", "n-DIFFERENT", now, false) << '\n';
    token["amr"] = "pwd"; token["email_verified"] = "false";
    std::cout << login(token, "orders-web", "n-0S6_WzA2Mj", now, true) << '\n';
    std::cout << login(token, "orders-web", "n-0S6_WzA2Mj", now, false) << '\n';
}
```

**Output:**
```text
logged in as sub=248289761001
reject: ID token was issued to another client
reject: nonce mismatch (replayed token?)
step-up: MFA required for this app
logged in as sub=248289761001 (email NOT verified: don't link accounts by it)
```

### Interview answer
"OAuth 2.0 is about authorization — an access token, scoped for a resource server, says what the client may call, not who the user is. OpenID Connect adds authentication on top: request the `openid` scope and you get an ID token, a signed JWT meant for the client, with issuer, subject, audience equal to your client ID, expiry, nonce and how the user authenticated. I validate those claims, key users by `sub` rather than email, never use access tokens as login proof or ID tokens as API credentials, and use discovery and JWKS for configuration and keys."

---

## 5. RBAC vs. ABAC vs. policy-based access control

**In one sentence:** **RBAC** grants permissions through **roles** (admin, editor, viewer); **ABAC** decides from **attributes** of the user, resource, action and context (department, owner, region, time, risk); **policy-based access control** puts those rules in a **central policy engine** (OPA/Rego, Cedar, Zanzibar-style ReBAC) evaluated consistently by every service.

### In plain words
- RBAC: job titles. "All nurses can read patient charts."
- ABAC: details matter. "A nurse can read a chart **if** the patient is on **her ward** and it's **her shift**."
- Policy-based: a single hospital rulebook every door and computer consults, instead of each department writing its own rules.

### How it works
| Model | Decision based on | Strengths | Weaknesses |
|---|---|---|---|
| **ACL** | per-object list of users | simple per object | doesn't scale; hard to audit |
| **RBAC** | user → roles → permissions | easy to understand and audit; maps to org | role explosion ("EU-read-only-billing-temp"), coarse |
| **ABAC** | attributes + rules | fine-grained, context-aware (ownership, tenant, time, MFA) | harder to reason about and test |
| **ReBAC** (Google Zanzibar, SpiceDB, OpenFGA) | relationships graph (user —member→ team —owner→ folder) | sharing, hierarchies, docs/folders | needs a dedicated service |
| **Policy engine** (OPA, Cedar, Casbin) | policies as code, evaluated centrally or as a library | consistent, testable, versioned, auditable | latency/availability of the engine (cache or embed) |

- Most real systems are **hybrid**: RBAC for coarse permissions + ABAC/ReBAC rules for ownership and tenancy.
- **PEP/PDP:** the **policy enforcement point** (your API or gateway) asks the **policy decision point** (engine) "may subject S do action A on resource R in context C?" → allow/deny + reasons.
- **Deny by default**, explicit denies override allows, test policies like code, log decisions.

#### Modern C++ example — RBAC, ABAC and a tiny policy engine making the same decisions differently
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <functional>
#include <iostream>
#include <map>
#include <set>
#include <string>
#include <vector>

struct Subject { std::string id, role, dept, tenant; bool mfa; };
struct Resource { std::string id, owner, dept, tenant; bool confidential; };
struct Ctx { int hour; };

bool rbac(const Subject& s, const std::string& action) {
    static const std::map<std::string, std::set<std::string>> perms{{"viewer", {"read"}}, {"editor", {"read", "write"}}, {"admin", {"read", "write", "delete"}}};
    return perms.at(s.role).count(action);
}

bool abac(const Subject& s, const Resource& r, const std::string& action, const Ctx& c) {
    if (s.tenant != r.tenant) return false;                                    // tenant isolation, always
    if (action == "read") return s.dept == r.dept || s.id == r.owner;
    if (action == "write") return s.id == r.owner && c.hour >= 8 && c.hour < 20;
    return false;
}

struct Policy { std::string name; bool deny; std::function<bool(const Subject&, const Resource&, const std::string&, const Ctx&)> when; };

std::pair<bool, std::string> decide(const std::vector<Policy>& ps, const Subject& s, const Resource& r, const std::string& a, const Ctx& c) {
    std::string allowed_by;
    for (auto& p : ps) {
        if (!p.when(s, r, a, c)) continue;
        if (p.deny) return {false, "denied by " + p.name};                      // explicit deny wins
        if (allowed_by.empty()) allowed_by = p.name;
    }
    return allowed_by.empty() ? std::pair{false, std::string("no policy allows it (default deny)")} : std::pair{true, "allowed by " + allowed_by};
}

int main() {
    Subject mona{"mona", "editor", "finance", "acme", false};
    Resource report{"q3-report", "omar", "finance", "acme", true};
    Resource other{"bills", "zed", "finance", "globex", false};
    Ctx day{14};

    std::cout << std::boolalpha << "RBAC: editor may write anything?      " << rbac(mona, "write") << " (too coarse)\n";
    std::cout << "ABAC: mona writes omar's report?      " << abac(mona, report, "write", day) << '\n';
    std::cout << "ABAC: mona reads her dept's report?   " << abac(mona, report, "read", day) << '\n';
    std::cout << "ABAC: mona reads another tenant's?    " << abac(mona, other, "read", day) << '\n';

    std::vector<Policy> policies{
        {"tenant-isolation", true, [](auto& s, auto& r, auto&, auto&) { return s.tenant != r.tenant; }},
        {"confidential-needs-mfa", true, [](auto& s, auto& r, auto&, auto&) { return r.confidential && !s.mfa; }},
        {"dept-can-read", false, [](auto& s, auto& r, auto& a, auto&) { return a == "read" && s.dept == r.dept; }},
        {"owner-can-write", false, [](auto& s, auto& r, auto& a, auto&) { return a == "write" && s.id == r.owner; }},
    };
    auto [ok1, why1] = decide(policies, mona, report, "read", day);
    std::cout << "policy engine, read without MFA:      " << ok1 << " (" << why1 << ")\n";
    mona.mfa = true;
    auto [ok2, why2] = decide(policies, mona, report, "read", day);
    std::cout << "policy engine, read with MFA:         " << ok2 << " (" << why2 << ")\n";
    auto [ok3, why3] = decide(policies, mona, report, "delete", day);
    std::cout << "policy engine, delete:                " << ok3 << " (" << why3 << ")\n";
}
```

**Output:**
```text
RBAC: editor may write anything?      true (too coarse)
ABAC: mona writes omar's report?      false
ABAC: mona reads her dept's report?   true
ABAC: mona reads another tenant's?    false
policy engine, read without MFA:      false (denied by confidential-needs-mfa)
policy engine, read with MFA:         true (allowed by dept-can-read)
policy engine, delete:                false (no policy allows it (default deny))
```

### Interview answer
"RBAC maps users to roles and roles to permissions — simple and auditable, but coarse and prone to role explosion. ABAC evaluates attributes of the subject, resource, action and context — ownership, tenant, department, time, MFA — for fine-grained decisions, and ReBAC models relationships for sharing and hierarchies. In practice I combine coarse roles with attribute or relationship rules, and put them in a policy engine like OPA or Cedar so every service enforces the same tested, versioned policies, with default deny, explicit denies winning, and decisions logged."

---

## 6. Service-to-service authentication and workload identities

**In one sentence:** services must authenticate **each other** too — with **mTLS** certificates or **signed short-lived tokens** tied to a **workload identity** (SPIFFE IDs, Kubernetes service accounts, cloud IAM roles) — instead of long-lived shared API keys, and then **authorize** each call by the calling service's identity.

### In plain words
Inside a company building, staff still wear badges and doors still check them — being "inside the network" doesn't mean you're allowed into the server room. Badges are reissued every day automatically, so a lost one is useless tomorrow.

### How it works
- **Zero trust:** don't trust the network location; authenticate and authorize **every** call ([zero trust](./Infrastructure-Cloud-and-Supply-Chain-Security.md#4-network-segmentation-zero-trust-architecture-and-private-access)).
- **mTLS with workload certificates:** each workload gets a short-lived X.509 cert with an identity like `spiffe://prod.example/ns/payments/sa/api` (SPIFFE/SPIRE, Istio, Linkerd); the receiving side checks the peer identity against an **authorization policy** ("only `checkout` may call `payments:charge`").
- **Token-based:** OAuth **client credentials** grant, or **workload identity federation** — the platform issues a signed identity token (Kubernetes projected service-account token, GitHub Actions OIDC token, GCP/Azure metadata token) that's **exchanged** for cloud credentials (AWS IAM Roles for Service Accounts / `AssumeRoleWithWebIdentity`, GCP Workload Identity Federation). **No static secrets to leak.**
- **Propagating the user:** when service A calls B **on behalf of a user**, pass a token with the user's identity **and** A's identity (token exchange RFC 8693, or a signed internal header the edge creates) — B checks both, avoiding the **confused deputy** problem ([details](./Security-Operations-and-Design-Interviews.md#5-model-replay-attacks-confused-deputy-issues-and-privilege-boundaries)).
- Audience-restrict tokens (`aud` = target service) so a token for B can't be replayed to C.

#### Modern C++ example — identity-based service authorization with short-lived credentials and audience checks
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <set>
#include <string>

struct WorkloadToken { std::string spiffe_id, audience; long expires_at; };

class Issuer {                                                    // e.g. SPIRE / cloud metadata / K8s token projection
public:
    WorkloadToken issue(const std::string& id, const std::string& aud, long now) { return {id, aud, now + 600}; }   // 10 minutes
};

class PaymentsService {
public:
    std::string handle(const WorkloadToken& t, const std::string& action, long now) const {
        if (t.expires_at <= now) return "401 credential expired";
        if (t.audience != "spiffe://prod.example/ns/payments/sa/api") return "401 token not meant for payments";
        static const std::map<std::string, std::set<std::string>> allow{
            {"spiffe://prod.example/ns/checkout/sa/api", {"charge"}},
            {"spiffe://prod.example/ns/support/sa/api", {"refund"}},
        };
        auto it = allow.find(t.spiffe_id);
        if (it == allow.end() || !it->second.count(action)) return "403 " + t.spiffe_id + " may not " + action;
        return "200 " + action + " by " + t.spiffe_id;
    }
};

int main() {
    Issuer iss;
    PaymentsService pay;
    const std::string payments = "spiffe://prod.example/ns/payments/sa/api";
    long now = 1000;
    auto checkout = iss.issue("spiffe://prod.example/ns/checkout/sa/api", payments, now);
    auto analytics = iss.issue("spiffe://prod.example/ns/analytics/sa/job", payments, now);
    auto for_inventory = iss.issue("spiffe://prod.example/ns/checkout/sa/api", "spiffe://prod.example/ns/inventory/sa/api", now);
    std::cout << pay.handle(checkout, "charge", now + 5) << '\n'
              << pay.handle(checkout, "refund", now + 5) << '\n'
              << pay.handle(analytics, "charge", now + 5) << '\n'
              << pay.handle(for_inventory, "charge", now + 5) << "  (replayed to the wrong service)\n"
              << pay.handle(checkout, "charge", now + 601) << "  (stolen token is useless after 10 min)\n";
}
```

**Output:**
```text
200 charge by spiffe://prod.example/ns/checkout/sa/api
403 spiffe://prod.example/ns/checkout/sa/api may not refund
403 spiffe://prod.example/ns/analytics/sa/job may not charge
401 token not meant for payments  (replayed to the wrong service)
401 credential expired  (stolen token is useless after 10 min)
```

### Interview answer
"Inside the network I still authenticate every call, using workload identities rather than shared API keys: mTLS with short-lived SPIFFE certificates from a mesh or SPIRE, or platform-issued identity tokens exchanged for cloud credentials through workload identity federation, so there are no static secrets. Each service authorizes callers by identity — only checkout may charge — and tokens are audience-restricted and short-lived. When acting for a user I propagate both the user and the calling service identity, so downstream services can check both and avoid confused-deputy problems."

---

## 7. Sessions, cookies, SameSite, HttpOnly, Secure, and CSRF protection

**In one sentence:** for browser sessions, store a **random, opaque session ID** in a cookie with **`Secure`** (HTTPS only), **`HttpOnly`** (not readable by JavaScript), **`SameSite=Lax` or `Strict`** (not sent on most cross-site requests), a tight **`Path`/no `Domain`**, the **`__Host-`** prefix, and add **CSRF tokens** for state-changing requests.

### In plain words
The session cookie is your cloakroom ticket. `Secure`: only handed over through the secure window. `HttpOnly`: pickpockets (malicious scripts) can't grab it. `SameSite`: the cloakroom ignores tickets presented by strangers on your behalf.

### How it works
| Attribute | Effect | Recommendation |
|---|---|---|
| `Secure` | sent only over HTTPS | always |
| `HttpOnly` | invisible to `document.cookie` | always for session cookies |
| `SameSite=Lax` | not sent on cross-site subresource requests or cross-site POSTs; sent on top-level GET navigation | default for sessions |
| `SameSite=Strict` | never sent cross-site (even link clicks) | high-security apps (banking) |
| `SameSite=None; Secure` | always sent (third-party contexts) | only when required (embeds, SSO iframes) |
| `Domain` | omit → host-only cookie | don't share with all subdomains unless needed |
| `__Host-` prefix | requires Secure, Path=/, no Domain | use for session cookies |
| `Max-Age`/`Expires` | persistence | session cookies or short lifetimes |

**CSRF protection** (defence in depth on top of SameSite): synchronizer token stored server-side in the session and sent in a hidden form field or header; or **double-submit** cookie (random token in a cookie and a header, compared server-side, ideally HMAC-signed); verify `Origin`/`Sec-Fetch-Site`; never change state on GET.

**Session hygiene:** ≥ 128 bits of randomness, regenerate on login/privilege change, server-side expiry and revocation, logout clears server state, no session IDs in URLs.

#### Modern C++ example — building a hardened Set-Cookie header and checking a request's CSRF defences
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <string>

std::string session_cookie(const std::string& id) {
    return "Set-Cookie: __Host-session=" + id + "; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=43200";
}

struct Request { std::string method, sec_fetch_site, origin; std::map<std::string, std::string> cookies, headers; };

std::string check(const Request& r, const std::map<std::string, std::string>& server_csrf_by_session) {
    if (r.method == "GET") return "safe method, no state change";
    auto sid = r.cookies.find("__Host-session");
    if (sid == r.cookies.end()) return "401 no session";
    if (r.sec_fetch_site == "cross-site" || (!r.origin.empty() && r.origin != "https://app.example.com")) return "403 cross-site request blocked";
    auto expected = server_csrf_by_session.find(sid->second);
    auto sent = r.headers.find("X-CSRF-Token");
    if (expected == server_csrf_by_session.end() || sent == r.headers.end() || sent->second != expected->second) return "403 missing/invalid CSRF token";
    return "200 state change allowed";
}

int main() {
    std::cout << session_cookie("4f8c2e9a1b7d6c3e5a0f9b8c7d6e5f4a") << '\n';
    std::map<std::string, std::string> csrf{{"s1", "c-7a9f"}};
    Request legit{"POST", "same-origin", "https://app.example.com", {{"__Host-session", "s1"}}, {{"X-CSRF-Token", "c-7a9f"}}};
    Request forged{"POST", "cross-site", "https://evil.example", {{"__Host-session", "s1"}}, {}};
    Request no_token{"POST", "same-origin", "https://app.example.com", {{"__Host-session", "s1"}}, {}};
    std::cout << "legit form post:   " << check(legit, csrf) << '\n'
              << "forged cross-site: " << check(forged, csrf) << '\n'
              << "missing token:     " << check(no_token, csrf) << '\n';
}
```

**Output:**
```text
Set-Cookie: __Host-session=4f8c2e9a1b7d6c3e5a0f9b8c7d6e5f4a; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=43200
legit form post:   200 state change allowed
forged cross-site: 403 cross-site request blocked
missing token:     403 missing/invalid CSRF token
```

### Interview answer
"I keep browser sessions as random opaque IDs in a `__Host-` cookie with Secure, HttpOnly, SameSite Lax or Strict, Path=/ and no Domain, regenerated at login, expired and revocable server-side, and never put in URLs. SameSite blocks most CSRF, but I still require a CSRF token — synchronizer or signed double-submit — on state-changing requests, check Origin or Sec-Fetch-Site, and never change state on GET. HttpOnly also limits what an XSS bug can steal."

---

## 8. SSO, SAML basics, MFA, and passkeys/WebAuthn

**In one sentence:** **SSO** lets users log in once at an **identity provider (IdP)** and access many apps (**service providers**) via **SAML 2.0** (XML assertions, common in enterprises) or **OIDC**; **MFA** adds a second factor, and **passkeys (WebAuthn/FIDO2)** replace passwords with **phishing-resistant** public-key credentials bound to the site's origin.

### In plain words
- SSO: one wristband at a festival gets you into every stage.
- MFA: a bank card **and** a PIN — stealing one isn't enough.
- Passkeys: your phone holds a unique key for each website and only answers the **real** website — a fake look-alike site gets nothing.

### How it works
**SAML 2.0 (SP-initiated flow)**
1. User visits the SP (app) → SP redirects to the IdP with an `AuthnRequest`.
2. User authenticates at the IdP (Okta, Entra ID, Google Workspace, Keycloak).
3. IdP POSTs a **signed XML assertion** (subject, attributes, audience, validity, `InResponseTo`) to the SP's Assertion Consumer Service URL.
4. SP validates: **signature** with the IdP's certificate (beware **XML signature wrapping** — use a mature library), `Audience`, `Destination`, `NotBefore/NotOnOrAfter`, `InResponseTo`, one-time use (replay), then creates its own session.
- OIDC does the same job with JSON/JWTs and is simpler for new apps; SAML remains common for enterprise SSO. **SCIM** handles user provisioning/deprovisioning.

**MFA factors (weakest → strongest):** SMS/voice OTP (SIM swap, phishing) → email codes → TOTP apps (RFC 6238, phishable) → push approvals (**MFA fatigue** — use number matching) → **FIDO2 security keys / passkeys** (phishing-resistant). Protect enrollment and recovery as strongly as login; offer backup codes.

**Passkeys / WebAuthn**
- **Registration:** the authenticator (phone, laptop TPM, security key) creates a **key pair per site** (relying party ID = domain); the server stores the **public key** and credential ID.
- **Login:** server sends a random **challenge**; the authenticator checks the **origin**, asks for user verification (biometric/PIN), and **signs** the challenge + origin data; server verifies with the stored public key and checks the **signature counter**.
- **Phishing-resistant** because the browser binds the signature to the real origin; nothing reusable is stored on the server (a database leak exposes only public keys). Synced passkeys (iCloud Keychain, Google Password Manager) solve device loss.

#### Modern C++ example — TOTP (RFC 6238 structure, toy hash) and a WebAuthn-style origin-bound challenge check
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <cstdint>
#include <iomanip>
#include <iostream>
#include <map>
#include <sstream>
#include <string>

// TOY keyed hash standing in for HMAC-SHA1 so the example stays short. Real TOTP: HMAC-SHA1/SHA256 (RFC 6238).
std::uint64_t toy_mac(const std::string& key, std::uint64_t counter) {
    std::uint64_t h = 1469598103934665603ull;
    for (char c : key + std::to_string(counter)) { h ^= static_cast<unsigned char>(c); h *= 1099511628211ull; }
    return h;
}
std::string totp(const std::string& secret, long unix_time) {
    std::uint64_t step = static_cast<std::uint64_t>(unix_time / 30);       // 30-second time step
    std::ostringstream o;
    o << std::setw(6) << std::setfill('0') << toy_mac(secret, step) % 1'000'000;
    return o.str();
}
bool verify_totp(const std::string& secret, const std::string& code, long now) {
    for (int drift : {-1, 0, 1}) if (totp(secret, now + drift * 30) == code) return true;   // allow +/- one step of clock skew
    return false;
}

// WebAuthn idea: the authenticator signs (challenge, origin) with a per-site private key; the server checks both.
struct Assertion { std::string challenge, origin; std::uint64_t signature; };
std::uint64_t sign(const std::string& priv, const std::string& challenge, const std::string& origin) { return toy_mac(priv, std::hash<std::string>{}(challenge + "|" + origin)); }

std::string verify_passkey(const Assertion& a, const std::string& expected_challenge, const std::string& stored_key) {
    if (a.origin != "https://bank.example") return "reject: signed for origin " + a.origin + " (phishing site)";
    if (a.challenge != expected_challenge) return "reject: stale or replayed challenge";
    if (a.signature != sign(stored_key, a.challenge, a.origin)) return "reject: bad signature";
    return "login ok";
}

int main() {
    const std::string secret = "JBSWY3DPEHPK3PXP";
    long now = 1'760'000'000;
    std::string code = totp(secret, now);
    std::cout << "TOTP code now: " << code << " | valid now: " << std::boolalpha << verify_totp(secret, code, now)
              << " | valid 20 s later: " << verify_totp(secret, code, now + 20) << " | valid 5 min later: " << verify_totp(secret, code, now + 300) << '\n';
    std::cout << "but a phishing site can relay a TOTP code within its 30 s window -> TOTP is phishable\n";

    const std::string device_key = "per-site-key-bank.example";            // public/private pair in reality; toy here
    std::string challenge = "chal-91f2";
    Assertion real{challenge, "https://bank.example", sign(device_key, challenge, "https://bank.example")};
    Assertion phished{challenge, "https://bank-example.login.evil", sign(device_key, challenge, "https://bank-example.login.evil")};
    std::cout << "passkey on the real site:  " << verify_passkey(real, challenge, device_key) << '\n'
              << "passkey via phishing page: " << verify_passkey(phished, challenge, device_key) << '\n'
              << "replayed old assertion:    " << verify_passkey(real, "chal-NEW", device_key) << '\n';
}
```

**Output:**
```text
TOTP code now: 063707 | valid now: true | valid 20 s later: true | valid 5 min later: false
but a phishing site can relay a TOTP code within its 30 s window -> TOTP is phishable
passkey on the real site:  login ok
passkey via phishing page: reject: signed for origin https://bank-example.login.evil (phishing site)
replayed old assertion:    reject: stale or replayed challenge
```

### Interview answer
"SSO centralizes login at an identity provider — SAML 2.0 with signed XML assertions for many enterprise apps, or OIDC for newer ones — where the service provider validates signature, audience, destination, validity and InResponseTo, prevents replay, and then creates its own session, with SCIM for provisioning. For MFA, SMS and TOTP help but are phishable and push needs number matching against fatigue attacks; passkeys based on WebAuthn are phishing-resistant because the authenticator signs a fresh challenge bound to the real origin with a per-site key, and the server only stores public keys. Recovery flows must be as strong as login."

---

## Cheat sheet

| Topic | Remember |
|---|---|
| AuthN vs. AuthZ | who you are (401) vs. what you may do (403/404); authz on every request |
| Sessions | random opaque IDs, regenerate at login, idle + absolute timeouts, revocable, step-up for sensitive actions |
| JWT | header.payload.signature; signed not encrypted; pin alg (no `none`), kid → trusted JWKS, verify iss/aud/exp/nbf; short-lived |
| Key rotation | publish new key → sign with new kid → retire old after expiry |
| OAuth 2.0 | delegated authz; owner, client, AS, RS; auth code + PKCE (S256) + state; minimal scopes |
| Refresh tokens | rotate on use; reuse → revoke family; BFF for browser apps; no localStorage |
| OIDC | ID token for the client (aud = client_id), `openid` scope, nonce, sub as user key, discovery + JWKS |
| RBAC / ABAC / ReBAC | roles / attributes + context / relationships; hybrid; policy engine (OPA, Cedar), default deny |
| Service-to-service | workload identity (SPIFFE mTLS, federated tokens), no static keys, authorize by identity, audience-bound, propagate user + service |
| Cookies | `__Host-`, Secure, HttpOnly, SameSite=Lax/Strict, no Domain; CSRF tokens + Origin checks |
| SSO / SAML | IdP signs assertions; SP validates signature, audience, time, InResponseTo, replay; SCIM |
| MFA | SMS < TOTP < push w/ number matching < FIDO2/passkeys |
| Passkeys | per-site key pair, origin-bound signed challenge, phishing-resistant, server stores only public keys |
