# Cryptography and Data Protection — Classification, Encryption, Hashing, MACs, Signatures, Keys and TLS

> **What you'll learn:** how to **classify and minimize** data and handle **retention and deletion**; the difference between **symmetric and asymmetric** encryption and how **key exchange** works; **encryption at rest vs. in transit** and **envelope encryption**; **hashing** and **password hashing** (Argon2, bcrypt, salts, pepper); **HMAC, digital signatures and authenticated encryption**; **KMS, secrets managers and key/certificate lifecycles**; and the **TLS handshake, certificates, CAs and mTLS**. The C++ examples include a real **SHA-256** and **HMAC-SHA256** checked against official test vectors; anything marked *toy* only illustrates the idea.
>
> ⚠️ **Never implement cryptography yourself in production.** Use vetted libraries: libsodium, OpenSSL/BoringSSL, Google Tink, your platform's crypto APIs, and your cloud KMS.
>
> **Prerequisites:** [Core Security Principles](./Core-Security-Principles.md), [TCP/IP stack](../Networking/TCP-IP-Stack.md).

## Table of Contents
1. [Data classification, minimization, retention, and deletion](#1-data-classification-minimization-retention-and-deletion)
2. [Encryption at rest vs. in transit and envelope encryption](#2-encryption-at-rest-vs-in-transit-and-envelope-encryption)
3. [Hashing, password hashing (Argon2/bcrypt), salts, and pepper](#3-hashing-password-hashing-argon2bcrypt-salts-and-pepper)
4. [HMAC, digital signatures, and authenticated encryption](#4-hmac-digital-signatures-and-authenticated-encryption)
5. [KMS, secrets managers, certificate rotation, and key lifecycles](#5-kms-secrets-managers-certificate-rotation-and-key-lifecycles)
6. [Symmetric vs. asymmetric encryption; key-exchange basics](#6-symmetric-vs-asymmetric-encryption-key-exchange-basics)
7. [TLS handshake, certificates, certificate authorities, and mTLS](#7-tls-handshake-certificates-certificate-authorities-and-mtls)
8. [Cheat sheet](#cheat-sheet)

---

## 1. Data classification, minimization, retention, and deletion

**In one sentence:** label data by **sensitivity** (public, internal, confidential, restricted) so each class gets the right controls, **collect and keep only what you need**, define **how long** each kind is retained, and make **deletion** real — including backups, logs, caches and replicas.

### In plain words
Don't keep every receipt forever in an unlocked drawer. Sort papers into "anyone can see", "staff only" and "locked safe", throw away what you don't need, shred old ones on schedule — and remember the copies you made.

### How it works
| Class | Examples | Typical controls |
|---|---|---|
| **Public** | marketing pages, docs | integrity only |
| **Internal** | internal wikis, metrics | authentication, basic access control |
| **Confidential** | customer PII (name, email, phone, address), contracts | encryption, need-to-know access, audit logs, masking in non-prod |
| **Restricted** | passwords, card data (PCI), health data, national IDs, secrets, private keys | strongest controls, field-level encryption or tokenization, strict access, minimal copies |

- **Minimization (GDPR principle):** don't collect what you don't need (birth date vs. "over 18" flag), **truncate/mask** (last 4 card digits), **tokenize** (card number → provider token), **pseudonymize** (replace IDs with keyed hashes for analytics), aggregate.
- **Retention:** each data type has a period and a legal basis ("invoices 10 years for tax law", "logs 30 days", "inactive accounts deleted after 2 years"); automate deletion jobs and **TTLs**.
- **Deletion:** "right to erasure" requests; delete from primary stores **and** search indexes, caches, analytics, logs, backups (or let backups expire on schedule). **Crypto-shredding:** encrypt each user's data with their own key; deleting the key makes all copies unreadable.
- Know **where** data lives: a **data inventory** / catalogue and data-flow maps; data loss prevention (DLP) scanning for PII in unexpected places (logs, tickets, buckets).

#### Modern C++ example — field classification, masking for non-production, and a retention purge
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <string>
#include <vector>

enum class Class { Public, Internal, Confidential, Restricted };
const std::map<std::string, Class> schema{
    {"user_id", Class::Internal}, {"display_name", Class::Public}, {"email", Class::Confidential},
    {"phone", Class::Confidential}, {"card_number", Class::Restricted}, {"password", Class::Restricted},
};

std::string mask(const std::string& field, const std::string& v) {
    switch (schema.at(field)) {
        case Class::Public: case Class::Internal: return v;
        case Class::Confidential: return v.substr(0, 1) + std::string(v.size() > 2 ? v.size() - 2 : 0, '*') + v.substr(v.size() - 1);
        case Class::Restricted: return field == "card_number" ? "**** **** **** " + v.substr(v.size() - 4) : "[REMOVED]";
    }
    return "";
}

struct Record { std::string kind; int age_days; };

int main() {
    std::map<std::string, std::string> row{{"user_id", "u-81"}, {"display_name", "Mona"}, {"email", "mona@example.com"},
                                           {"phone", "+201001234567"}, {"card_number", "4111111111111111"}, {"password", "hunter2"}};
    std::cout << "copy for the staging database (masked):\n";
    for (auto& [k, v] : row) std::cout << "  " << k << " = " << mask(k, v) << '\n';

    const std::map<std::string, int> retention_days{{"access_log", 30}, {"support_chat", 365}, {"invoice", 3650}};
    std::vector<Record> store{{"access_log", 12}, {"access_log", 45}, {"support_chat", 400}, {"invoice", 2000}, {"support_chat", 20}};
    int purged = 0;
    std::erase_if(store, [&](const Record& r) { bool old = r.age_days > retention_days.at(r.kind); purged += old; return old; });
    std::cout << "retention job: purged " << purged << " records, kept " << store.size() << '\n';
}
```

**Output:**
```text
copy for the staging database (masked):
  card_number = **** **** **** 1111
  display_name = Mona
  email = m**************m
  password = [REMOVED]
  phone = +***********7
  user_id = u-81
retention job: purged 2 records, kept 3
```

### Interview answer
"I classify data — public, internal, confidential, restricted — and attach controls to each class, from basic access control up to field-level encryption or tokenization. I minimize what we collect and store: masks, tokens, pseudonymous IDs, flags instead of raw values. Each data type has a retention period with automated deletion, and erasure requests must reach caches, search indexes, analytics, logs and backups — crypto-shredding with per-user keys makes that practical. A data inventory and DLP scanning tell us where sensitive data actually lives."

---

## 2. Encryption at rest vs. in transit and envelope encryption

**In one sentence:** **in transit** encryption (TLS) protects data moving over networks; **at rest** encryption protects stored data (disks, databases, backups, object storage); **envelope encryption** encrypts data with a fresh **data key (DEK)** and encrypts that DEK with a **key-encryption key (KEK)** held in a KMS/HSM — so the master key never leaves the KMS and rotation is cheap.

### In plain words
In transit: an armoured van between banks. At rest: the vault. Envelope encryption: each document is locked in its own small box with its own key; all the small keys are locked in one master safe that never leaves the bank. To change the master safe's combination you only re-lock the small keys, not every document.

### How it works
**In transit:** TLS 1.2+ (prefer 1.3) for every hop — browser→CDN, CDN→origin, service→service (mTLS), service→DB; HSTS for websites; no plaintext internal traffic ("the internal network is not trusted").

**At rest — layers**
| Layer | Protects against | Doesn't protect against |
|---|---|---|
| **Full-disk / volume** (EBS, LUKS, BitLocker) | stolen disks, decommissioned hardware | anyone with OS/DB access |
| **Database / storage-level** (TDE, S3 SSE-KMS) | stolen files, snapshots, backups | DB users and the app (they see plaintext) |
| **Application / field-level** (encrypt specific columns) | DB admins, SQL injection dumps, backup leaks | the app itself if compromised |

**Envelope encryption**
1. Ask KMS for a new DEK: KMS returns the **plaintext DEK** and the **DEK encrypted under the KEK**.
2. Encrypt data locally with the plaintext DEK (AES-256-GCM), then **wipe** the plaintext DEK from memory.
3. Store ciphertext **+ encrypted DEK** together.
4. To decrypt: send the encrypted DEK to KMS (authorized + audited) → plaintext DEK → decrypt locally.
- **Benefits:** large data never goes to KMS; KEK never leaves the HSM; **rotating the KEK** only re-wraps small DEKs; per-tenant/per-user DEKs enable crypto-shredding; every decrypt is an auditable KMS call.

#### Modern C++ example — envelope encryption with per-record DEKs and cheap KEK rotation (toy cipher)
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <cstdint>
#include <cstring>
#include <iostream>
#include <map>
#include <random>
#include <string>

// TOY cipher for illustration only (XOR with a keystream from a seeded PRNG). Real code: AES-256-GCM via a vetted library.
std::string toy_xor(const std::string& data, std::uint64_t key) {
    std::mt19937_64 ks(key);
    std::string out = data;
    for (auto& c : out) c ^= static_cast<char>(ks() & 0xFF);
    return out;
}

class Kms {                                           // the KEK never leaves this class
public:
    std::pair<std::uint64_t, std::string> generate_data_key(int& kek_version) {
        std::uint64_t dek = rng_();
        kek_version = current_;
        return {dek, wrap(dek, current_)};
    }
    std::uint64_t decrypt_data_key(const std::string& wrapped, int version) { ++audit_calls; return unwrap(wrapped, version); }
    std::string rewrap(const std::string& wrapped, int old_v, int& new_v) { new_v = current_; return wrap(unwrap(wrapped, old_v), current_); }
    void rotate() { keks_[++current_] = rng_(); }
    int audit_calls = 0;
private:
    std::string wrap(std::uint64_t dek, int v) { return toy_xor(std::string(reinterpret_cast<char*>(&dek), 8), keks_[v]); }
    std::uint64_t unwrap(const std::string& w, int v) { std::string p = toy_xor(w, keks_[v]); std::uint64_t d; std::memcpy(&d, p.data(), 8); return d; }
    std::mt19937_64 rng_{7};
    int current_ = 1;
    std::map<int, std::uint64_t> keks_{{1, 0x1234'5678'9abc'def0ull}};
};

struct StoredRecord { std::string ciphertext, wrapped_dek; int kek_version; };

int main() {
    Kms kms;
    std::map<std::string, StoredRecord> db;
    for (auto [id, text] : {std::pair{"r1", "Mona's medical note"}, std::pair{"r2", "Omar's passport scan"}}) {
        int v;
        auto [dek, wrapped] = kms.generate_data_key(v);
        db[id] = {toy_xor(text, dek), wrapped, v};       // plaintext DEK is dropped after this line
    }
    std::cout << "stored ciphertext is unreadable: " << (db["r1"].ciphertext.find("Mona") == std::string::npos ? "yes" : "no") << '\n';

    kms.rotate();                                        // KEK rotation: re-wrap 8-byte DEKs, not the data
    for (auto& [id, r] : db) { int nv; r.wrapped_dek = kms.rewrap(r.wrapped_dek, r.kek_version, nv); r.kek_version = nv; }
    std::cout << "after KEK rotation all records use KEK v" << db["r1"].kek_version << " (data untouched)\n";

    auto& r = db["r2"];
    std::uint64_t dek = kms.decrypt_data_key(r.wrapped_dek, r.kek_version);
    std::cout << "decrypt r2: " << toy_xor(r.ciphertext, dek) << " (KMS decrypt calls audited: " << kms.audit_calls << ")\n";
}
```

**Output:**
```text
stored ciphertext is unreadable: yes
after KEK rotation all records use KEK v2 (data untouched)
decrypt r2: Omar's passport scan (KMS decrypt calls audited: 1)
```

### Interview answer
"In transit I use TLS 1.3 on every hop including internal service-to-service traffic with mTLS. At rest I layer disk or storage encryption, which covers stolen media and backups, with field-level encryption for the most sensitive columns, which also covers database admins and dumps. Keys are managed with envelope encryption: each object gets a data key used locally with AES-GCM, and only the data key is encrypted by a KMS-held master key — so the master key never leaves the HSM, rotation just re-wraps small keys, every decrypt is audited, and per-tenant keys allow crypto-shredding."

---

## 3. Hashing, password hashing (Argon2/bcrypt), salts, and pepper

**In one sentence:** a **cryptographic hash** (SHA-256, SHA-3, BLAKE3) is a fast one-way fingerprint for **integrity**, but passwords need a **deliberately slow, memory-hard password hash** (**Argon2id**, scrypt, bcrypt, PBKDF2) with a **unique random salt** per user, optionally plus a secret **pepper** stored outside the database.

### In plain words
A fingerprint identifies a person but can't rebuild them (one-way). For passwords, the danger is someone stealing the fingerprint list and trying billions of guesses. Make each guess **slow and expensive** (password hash), and give every user a unique "pinch of salt" so a guess against one user doesn't work for all.

### How it works
**Cryptographic hash properties:** deterministic, fixed output size, **preimage resistance** (can't find input from output), **second-preimage** and **collision resistance**, avalanche. **MD5 and SHA-1 are broken** for collisions — don't use them for security. Uses: integrity checks, content addressing (Git), commitments, building blocks for HMAC and signatures.

**Why not SHA-256 for passwords:** GPUs compute **billions** of SHA-256 per second; leaked unsalted hashes fall to **rainbow tables** and dictionary attacks.

| Password hash | Notes | Typical parameters (OWASP Password Storage Cheat Sheet) |
|---|---|---|
| **Argon2id** (2015 PHC winner) | memory-hard, best default | m = 19 MiB, t = 2, p = 1 (or more memory) |
| **scrypt** | memory-hard | N = 2¹⁷, r = 8, p = 1 |
| **bcrypt** | widely available; 72-byte input limit | cost ≥ 10 |
| **PBKDF2-HMAC-SHA256** | FIPS-approved; not memory-hard | ≥ 600,000 iterations |

- **Salt:** random (≥ 16 bytes), unique per password, stored next to the hash — defeats rainbow tables and identical-password detection.
- **Pepper:** a secret key (in a KMS/secrets manager, **not** the DB) mixed in via HMAC — a database-only leak isn't enough to crack.
- **Verify** in **constant time**; store the algorithm and parameters with the hash (e.g. `$argon2id$v=19$m=19456,t=2,p=1$<salt>$<hash>`) so you can **upgrade** parameters on next login.
- Also: block breached passwords (Have I Been Pwned k-anonymity API), rate-limit logins, prefer passkeys.

#### Modern C++ example — a real SHA-256, salted PBKDF2-style stretching, pepper, and constant-time verification
```cpp
// g++ -std=c++20 -O2 main.cpp && ./a.out
#include <array>
#include <cstdint>
#include <iomanip>
#include <iostream>
#include <random>
#include <sstream>
#include <string>

// ---- SHA-256 (FIPS 180-4) ----
using Digest = std::array<std::uint8_t, 32>;
Digest sha256(const std::string& msg) {
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
    Digest out;
    for (int i = 0; i < 8; ++i) for (int j = 0; j < 4; ++j) out[4 * i + j] = static_cast<std::uint8_t>(h[i] >> (24 - 8 * j));
    return out;
}
std::string hex(const Digest& d) { std::ostringstream o; for (auto b : d) o << std::hex << std::setw(2) << std::setfill('0') << int(b); return o.str(); }
std::string raw(const Digest& d) { return std::string(d.begin(), d.end()); }

// ---- password stretching (illustration of PBKDF2's idea: iterate a keyed hash many times) ----
std::string stretch(const std::string& password, const std::string& salt, const std::string& pepper, int iterations) {
    std::string x = raw(sha256(pepper + salt + password));
    for (int i = 1; i < iterations; ++i) x = raw(sha256(x + salt));      // each guess now costs `iterations` hashes
    return hex(sha256(x));
}
bool constant_time_equal(const std::string& a, const std::string& b) {
    if (a.size() != b.size()) return false;
    unsigned char diff = 0;
    for (std::size_t i = 0; i < a.size(); ++i) diff |= static_cast<unsigned char>(a[i] ^ b[i]);   // no early exit
    return diff == 0;
}

int main() {
    std::cout << "sha256(\"abc\") = " << hex(sha256("abc")) << '\n';
    std::cout << "matches the FIPS 180-4 test vector: " << std::boolalpha
              << (hex(sha256("abc")) == "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad") << '\n';
    std::cout << "one letter changes everything: sha256(\"abd\") = " << hex(sha256("abd")).substr(0, 16) << "...\n";

    std::mt19937_64 rng(99);                                   // real code: a CSPRNG (getrandom, libsodium randombytes)
    auto new_salt = [&] { std::string s(16, '\0'); for (auto& c : s) c = static_cast<char>(rng()); return s; };
    const std::string pepper = "from-the-secrets-manager";
    const int iterations = 20000;
    std::string salt_a = new_salt(), salt_b = new_salt();
    std::string stored_a = stretch("Summer2026!", salt_a, pepper, iterations);
    std::string stored_b = stretch("Summer2026!", salt_b, pepper, iterations);
    std::cout << "two users, same password, different salts -> different hashes: " << (stored_a != stored_b) << '\n';
    std::cout << "login with right password: " << constant_time_equal(stretch("Summer2026!", salt_a, pepper, iterations), stored_a) << '\n';
    std::cout << "login with wrong password: " << constant_time_equal(stretch("summer2026!", salt_a, pepper, iterations), stored_a) << '\n';
    std::cout << "attacker with the DB but not the pepper: " << constant_time_equal(stretch("Summer2026!", salt_a, "", iterations), stored_a) << '\n';
}
```

**Output:**
```text
sha256("abc") = ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad
matches the FIPS 180-4 test vector: true
one letter changes everything: sha256("abd") = a52d159f262b2c6d...
two users, same password, different salts -> different hashes: true
login with right password: true
login with wrong password: false
attacker with the DB but not the pepper: false
```

The `stretch` function only shows the *idea* of PBKDF2 (iterated hashing); use a real Argon2id implementation (libsodium `crypto_pwhash`) in practice.

### Interview answer
"Cryptographic hashes like SHA-256 are fast one-way fingerprints for integrity — MD5 and SHA-1 are broken for collisions. Passwords need a slow, memory-hard password hash, ideally Argon2id with OWASP parameters, or bcrypt/scrypt/PBKDF2 with a high work factor, plus a unique random salt per user stored with the hash. A pepper kept in a secrets manager means a database leak alone isn't crackable. I verify in constant time, store algorithm and parameters to upgrade on login, and add breached-password checks, rate limiting and MFA."

---

## 4. HMAC, digital signatures, and authenticated encryption

**In one sentence:** an **HMAC** proves a message came from someone holding a **shared secret** and wasn't modified; a **digital signature** proves it with a **private key** that anyone can verify with the **public key** (adding non-repudiation); **authenticated encryption** (AES-GCM, ChaCha20-Poly1305) gives **confidentiality and integrity together**.

### In plain words
- HMAC: a wax seal made with a stamp that only you and the bank own — the bank knows the letter is from you and untouched.
- Signature: your handwritten signature that **anyone** can compare against your public sample, but only you can produce.
- Authenticated encryption: a locked box with a tamper-evident seal — nobody can read it, and you'll know if anyone tried to change it.

### How it works
**HMAC** = `H((K ⊕ opad) ‖ H((K ⊕ ipad) ‖ message))` (RFC 2104). Use for API request signing, **webhook signatures** (Stripe, GitHub), signed cookies, JWT `HS256`. Verify with a **constant-time compare**, include a **timestamp** and reject old messages to prevent **replay**. Don't use `H(key ‖ message)` — length-extension attacks break it for SHA-256.

**Digital signatures:** Ed25519 (fast, modern default), ECDSA P-256, RSA-PSS (RSA ≥ 2048 bits). Uses: TLS certificates, JWT `RS256/ES256/EdDSA`, code signing and package signing (Sigstore), Git commits, software updates. Sign with the private key (kept in an HSM/KMS), verify with the public key.

| | HMAC | Signature |
|---|---|---|
| Keys | one shared secret | private (sign) + public (verify) |
| Who can verify | only holders of the secret | anyone |
| Non-repudiation | no (both sides could have made it) | yes |
| Speed | very fast | slower |

**Authenticated encryption (AEAD):** AES-256-GCM, ChaCha20-Poly1305 (fast without AES hardware), AES-GCM-SIV/XChaCha20 (nonce-misuse resistant / large nonces). Inputs: key, **unique nonce**, plaintext, **associated data** (authenticated but not encrypted — e.g. a header or record ID). **Never reuse a nonce with the same key** in GCM — it breaks both confidentiality and integrity. Plain AES-CBC/CTR without a MAC is malleable — don't use unauthenticated encryption.

#### Modern C++ example — HMAC-SHA256 (RFC 4231 test vector), a signed webhook with replay protection, and tamper detection
```cpp
// g++ -std=c++20 -O2 main.cpp && ./a.out
#include <array>
#include <cstdint>
#include <iomanip>
#include <iostream>
#include <sstream>
#include <string>

using Digest = std::array<std::uint8_t, 32>;
Digest sha256(const std::string& msg) {                                // same FIPS 180-4 implementation as section 3
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
    Digest out;
    for (int i = 0; i < 8; ++i) for (int j = 0; j < 4; ++j) out[4 * i + j] = static_cast<std::uint8_t>(h[i] >> (24 - 8 * j));
    return out;
}
std::string hex(const Digest& d) { std::ostringstream o; for (auto b : d) o << std::hex << std::setw(2) << std::setfill('0') << int(b); return o.str(); }

std::string hmac_sha256(std::string key, const std::string& msg) {                // RFC 2104
    if (key.size() > 64) { auto d = sha256(key); key.assign(d.begin(), d.end()); }
    key.resize(64, '\0');
    std::string ipad(64, '\0'), opad(64, '\0');
    for (int i = 0; i < 64; ++i) { ipad[i] = static_cast<char>(key[i] ^ 0x36); opad[i] = static_cast<char>(key[i] ^ 0x5c); }
    auto inner = sha256(ipad + msg);
    return hex(sha256(opad + std::string(inner.begin(), inner.end())));
}
bool ct_equal(const std::string& a, const std::string& b) {
    if (a.size() != b.size()) return false;
    unsigned char d = 0;
    for (std::size_t i = 0; i < a.size(); ++i) d |= static_cast<unsigned char>(a[i] ^ b[i]);
    return d == 0;
}

// Webhook receiver: signature over "timestamp.body", reject if older than 5 minutes.
std::string receive(const std::string& secret, long now, long ts, const std::string& body, const std::string& sig) {
    if (now - ts > 300) return "rejected: too old (replay?)";
    if (!ct_equal(hmac_sha256(secret, std::to_string(ts) + "." + body), sig)) return "rejected: bad signature";
    return "accepted";
}

int main() {
    std::string tv = hmac_sha256("Jefe", "what do ya want for nothing?");
    std::cout << "HMAC-SHA256 RFC 4231 test case 2: " << tv << "\nmatches: " << std::boolalpha
              << (tv == "5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843") << '\n';

    const std::string secret = "whsec_shared_with_partner";
    long t = 1'760'000'000;
    std::string body = R"({"order":81,"status":"paid","amount":250})";
    std::string sig = hmac_sha256(secret, std::to_string(t) + "." + body);
    std::cout << "genuine webhook:   " << receive(secret, t + 20, t, body, sig) << '\n';
    std::string tampered = R"({"order":81,"status":"paid","amount":1})";
    std::cout << "tampered amount:   " << receive(secret, t + 20, t, tampered, sig) << '\n';
    std::cout << "replayed next day: " << receive(secret, t + 86400, t, body, sig) << '\n';
    std::cout << "wrong secret:      " << receive("guess", t + 20, t, body, sig) << '\n';
}
```

**Output:**
```text
HMAC-SHA256 RFC 4231 test case 2: 5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843
matches: true
genuine webhook:   accepted
tampered amount:   rejected: bad signature
replayed next day: rejected: too old (replay?)
wrong secret:      rejected: bad signature
```

### Interview answer
"HMAC gives integrity and authenticity with a shared secret — I use it for webhooks and request signing over the timestamp plus body, verified in constant time with a freshness window against replays. Digital signatures like Ed25519 or ECDSA use a private key to sign and a public key anyone can verify, so they add non-repudiation and suit certificates, tokens and code signing. For encryption I always use an AEAD like AES-GCM or ChaCha20-Poly1305, which encrypts and authenticates together, with a unique nonce per key — never unauthenticated CBC or CTR."

---

## 5. KMS, secrets managers, certificate rotation, and key lifecycles

**In one sentence:** keep **keys** in a **KMS/HSM** (cloud KMS, HashiCorp Vault Transit, CloudHSM) where they're used but never exported, keep **secrets** (DB passwords, API tokens) in a **secrets manager** with access control, audit and **rotation**, and manage every key and certificate through a **lifecycle**: generate → distribute → use → rotate → revoke → destroy.

### In plain words
Keys are like the master key of a building: it stays in the security office (KMS); you hand them a lock and they lock it for you. Secrets are like the Wi-Fi password: stored in a locked cabinet, given only to those who need it, changed regularly — and changed immediately if someone leaves with it.

### How it works
**KMS (AWS KMS, Google Cloud KMS, Azure Key Vault, Vault Transit)**
- Operations: `Encrypt/Decrypt` small data, `GenerateDataKey` ([envelope](#2-encryption-at-rest-vs-in-transit-and-envelope-encryption)), `Sign/Verify`; keys are **non-exportable**, backed by HSMs (FIPS 140-2/3).
- **Key policies + IAM** decide which roles can use which key; every use is **audited** (CloudTrail).
- **Rotation:** new key **version** each year (or more often); old versions stay available for **decrypting** old data; new data uses the new version.

**Secrets managers (AWS Secrets Manager, GCP Secret Manager, Vault, Azure Key Vault)**
- Apps fetch secrets at startup or via sidecars/CSI drivers; **never** in code, images or plain env files committed to Git.
- **Rotation:** automatic for DB passwords (two-user/alternating strategy so there's no downtime); **dynamic secrets** (Vault issues short-lived DB credentials per app instance) are best.
- Prefer **no secrets at all**: workload identities and short-lived tokens ([service identity](./Authentication-and-Authorization.md#6-service-to-service-authentication-and-workload-identities)).

**Certificates**
- Short lifetimes (Let's Encrypt 90 days, internal mesh certs hours/days) + **automated renewal** (ACME, cert-manager, AWS ACM). Monitor expiry — expired certificates cause major outages.
- **Revocation:** CRL/OCSP (unreliable in browsers), so short lifetimes are the practical answer.

**Key lifecycle:** generation (CSPRNG, in HSM) → activation → use (limit purpose: one key, one job) → rotation → suspension/revocation on compromise → destruction (with crypto-shredding consequences understood). Document **ownership** and **compromise procedures**.

#### Modern C++ example — versioned keys with rotation, old-data decryption, and certificate expiry monitoring
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <string>
#include <vector>

struct KeyVersion { int version; int created_day; bool enabled; };

class ManagedKey {                                         // what a KMS keeps per key alias
public:
    void rotate(int day) { versions_.push_back({static_cast<int>(versions_.size()) + 1, day, true}); }
    int primary() const { return versions_.back().version; }
    bool can_decrypt(int v) const { for (auto& k : versions_) if (k.version == v) return k.enabled; return false; }
    void disable(int v) { for (auto& k : versions_) if (k.version == v) k.enabled = false; }
private:
    std::vector<KeyVersion> versions_{{1, 0, true}};
};

struct Cert { std::string name; int not_after_day; bool auto_renew; };

int main() {
    ManagedKey k;
    std::map<std::string, int> blobs{{"invoice-2024.pdf", k.primary()}};      // encrypted under v1
    k.rotate(365);                                                           // yearly rotation
    blobs["invoice-2025.pdf"] = k.primary();
    std::cout << "new data uses key v" << k.primary() << "; old blob (v" << blobs["invoice-2024.pdf"] << ") still decrypts: "
              << std::boolalpha << k.can_decrypt(blobs["invoice-2024.pdf"]) << '\n';
    k.disable(1);                                                            // suspected compromise of v1
    std::cout << "after disabling v1: old blob decrypts = " << k.can_decrypt(1) << " -> re-encrypt it under v2 first next time!\n";

    const int today = 1000;
    std::vector<Cert> certs{{"api.example.com", 1060, true}, {"legacy-partner.example.com", 1012, false}, {"payments mTLS client", 998, false}};
    for (auto& c : certs) {
        int left = c.not_after_day - today;
        std::string status = left < 0 ? "EXPIRED - outage risk now" : left <= 14 && !c.auto_renew ? "expires in " + std::to_string(left) + " days, no auto-renew -> ALERT"
                           : "ok (" + std::to_string(left) + " days" + (c.auto_renew ? ", auto-renew)" : ")");
        std::cout << c.name << ": " << status << '\n';
    }
}
```

**Output:**
```text
new data uses key v2; old blob (v1) still decrypts: true
after disabling v1: old blob decrypts = false -> re-encrypt it under v2 first next time!
api.example.com: ok (60 days, auto-renew)
legacy-partner.example.com: expires in 12 days, no auto-renew -> ALERT
payments mTLS client: EXPIRED - outage risk now
```

### Interview answer
"Keys live in a KMS or HSM, are non-exportable, scoped by key policy and IAM, and every use is audited; I use envelope encryption with data keys and rotate master keys by version so old data still decrypts while new data uses the new version. Secrets go in a secrets manager — never code, images or Git — with automatic rotation, ideally dynamic short-lived credentials or no secrets at all via workload identity. Certificates are short-lived and renewed automatically with ACME or cert-manager, with expiry monitoring, and every key has an owner and a documented compromise and destruction procedure."

---

## 6. Symmetric vs. asymmetric encryption; key-exchange basics

**In one sentence:** **symmetric** encryption uses **one shared key** for encrypting and decrypting (fast: AES, ChaCha20), **asymmetric** encryption uses a **public/private key pair** (slow: RSA, elliptic curves), and **key exchange** (Diffie–Hellman / ECDHE) lets two parties agree on a shared symmetric key over an open network — real systems use asymmetric crypto to **set up** a symmetric key, then symmetric crypto for the data.

### In plain words
- Symmetric: both of you have a copy of the same house key. Fast, but how do you get the copy to your friend safely?
- Asymmetric: you hand out open padlocks (public key) to anyone; only you have the key that opens them (private key).
- Diffie–Hellman: you and a friend each mix a secret paint colour into a shared public colour, swap the mixes, and add your own secret again — you both end up with the same final colour, while an observer who only saw the mixes can't make it.

### How it works
| | Symmetric | Asymmetric |
|---|---|---|
| Keys | 1 shared secret | public + private |
| Examples | AES-128/256-GCM, ChaCha20-Poly1305 | RSA-2048/3072, ECDSA/ECDH P-256, X25519, Ed25519 |
| Speed | very fast (GB/s with AES-NI) | 100–1000× slower |
| Used for | bulk data | key exchange, signatures, encrypting small keys |
| Key distribution problem | yes | solved (publish the public key) — but you must trust it's the right one (certificates) |

**Key exchange**
- **Diffie–Hellman:** public `p, g`; Alice picks secret `a`, sends `A = gᵃ mod p`; Bob picks `b`, sends `B = gᵇ mod p`; both compute `s = Bᵃ = Aᵇ = gᵃᵇ mod p`. Today: **ECDHE with X25519**.
- **Ephemeral** keys (new per session) give **forward secrecy**: stealing the server's long-term key later can't decrypt recorded sessions. TLS 1.3 requires it.
- DH alone doesn't prove **who** you're talking to (man-in-the-middle) — so the exchange is **authenticated** with signatures/certificates.
- **Hybrid encryption:** encrypt a random AES key with the recipient's public key (or derive it via ECDH — e.g. HPKE, age, PGP), then encrypt data with AES-GCM.
- **Post-quantum:** NIST standardized **ML-KEM (Kyber)** and **ML-DSA (Dilithium)** in 2024; browsers already use hybrid **X25519 + ML-KEM** key exchange.

#### Modern C++ example — toy Diffie–Hellman and toy RSA with textbook numbers (never use these sizes)
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <cstdint>
#include <iostream>

std::uint64_t modpow(std::uint64_t base, std::uint64_t exp, std::uint64_t mod) {
    std::uint64_t r = 1; base %= mod;
    while (exp) { if (exp & 1) r = r * base % mod; base = base * base % mod; exp >>= 1; }
    return r;
}

int main() {
    // Diffie-Hellman with p = 23, g = 5 (textbook). Real: X25519 with 255-bit keys.
    const std::uint64_t p = 23, g = 5;
    std::uint64_t a = 6, b = 15;                                // private, never sent
    std::uint64_t A = modpow(g, a, p), B = modpow(g, b, p);     // public, sent over the network
    std::cout << "DH: Alice sends A=" << A << ", Bob sends B=" << B << '\n';
    std::cout << "    Alice computes " << modpow(B, a, p) << ", Bob computes " << modpow(A, b, p) << " -> same shared secret\n";

    // RSA with p = 61, q = 53 (textbook). Real: 2048+ bit keys with OAEP padding.
    const std::uint64_t n = 61 * 53, e = 17, d = 2753;          // d = e^-1 mod (60*52)
    std::uint64_t message = 65;
    std::uint64_t cipher = modpow(message, e, n);               // anyone can encrypt with the public key (n, e)
    std::cout << "RSA: public key (n=" << n << ", e=" << e << "), encrypt 65 -> " << cipher
              << ", private key decrypts -> " << modpow(cipher, d, n) << '\n';
    std::uint64_t signature = modpow(message, d, n);            // only the private key holder can sign
    std::cout << "RSA signature of 65 = " << signature << ", anyone verifies with (n, e): " << modpow(signature, e, n) << '\n';
}
```

**Output:**
```text
DH: Alice sends A=8, Bob sends B=19
    Alice computes 2, Bob computes 2 -> same shared secret
RSA: public key (n=3233, e=17), encrypt 65 -> 2790, private key decrypts -> 65
RSA signature of 65 = 588, anyone verifies with (n, e): 65
```

### Interview answer
"Symmetric encryption like AES-GCM uses one shared key and is fast, so it encrypts the data; asymmetric crypto like RSA or elliptic curves uses a key pair, is much slower, and is used for key exchange and signatures. Diffie–Hellman, today ECDHE with X25519, lets two parties derive a shared secret over an open channel; using fresh ephemeral keys per session gives forward secrecy, and the exchange is authenticated with certificates to stop man-in-the-middle. So TLS and tools like HPKE are hybrid: asymmetric to agree on a key, symmetric for the data, with post-quantum hybrids like X25519 plus ML-KEM rolling out now."

---

## 7. TLS handshake, certificates, certificate authorities, and mTLS

**In one sentence:** **TLS** creates an encrypted, authenticated channel: in the **handshake** the client and server agree on algorithms, perform an **ECDHE key exchange**, and the server proves its identity with a **certificate** chained to a trusted **certificate authority (CA)**; with **mTLS** the client presents a certificate too, so **both** sides are authenticated.

### In plain words
Calling your bank: first you check the caller ID is really the bank (certificate signed by a trusted phone company — the CA), then you agree on a secret code language for the call (key exchange). With mTLS, the bank also checks **your** ID card before talking.

### How it works
**TLS 1.3 handshake (1 round trip)**
```text
Client                                              Server
ClientHello: versions, cipher suites, key share (X25519 public), SNI, ALPN  --->
                     <---  ServerHello: chosen suite + its key share
                           {EncryptedExtensions}
                           {Certificate chain}            (encrypted from here on)
                           {CertificateVerify: signature over the handshake}
                           {Finished: MAC over the handshake}
{Finished}  --->
<========== application data, encrypted with keys derived (HKDF) from the ECDHE secret ==========>
```
- Cipher suites in 1.3: `TLS_AES_128_GCM_SHA256`, `TLS_AES_256_GCM_SHA384`, `TLS_CHACHA20_POLY1305_SHA256`. Forward secrecy always; 0-RTT resumption exists but its data can be **replayed** (only for idempotent requests).
- Disable SSL, TLS 1.0 and 1.1; TLS 1.2 only with ECDHE + AEAD suites.

**Certificate validation (what the client checks)**
1. The **chain**: leaf → intermediate(s) → a **root** in the trust store; each signature valid.
2. **Validity period** (`notBefore` ≤ now ≤ `notAfter`).
3. **Hostname** matches a **Subject Alternative Name** (wildcards cover **one** label: `*.example.com` matches `api.example.com`, not `a.b.example.com` or `example.com`).
4. **Key usage / extended key usage** (serverAuth / clientAuth), **basic constraints** (only CAs may sign certs).
5. Revocation (OCSP stapling) and **Certificate Transparency** logs (browsers require SCTs; monitor CT for certs issued for your domains).

**CAs:** public CAs (Let's Encrypt, DigiCert) for internet-facing services; a **private CA** (AWS Private CA, Vault PKI, cert-manager, SPIFFE/SPIRE) for internal mTLS. Domain validation via **ACME** challenges.

**mTLS:** the server requests a client certificate and validates it against the private CA; the service identity comes from the certificate (e.g. SPIFFE ID `spiffe://example.org/ns/payments/sa/api`). Service meshes (Istio, Linkerd) automate certificate issuance and rotation. **Pinning** is risky — prefer short-lived certs and CT monitoring.

#### Modern C++ example — validating a certificate chain, hostname and dates, and an mTLS client check
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <set>
#include <string>
#include <vector>

struct Cert { std::string subject, issuer; std::vector<std::string> sans; int not_before, not_after; bool is_ca; std::string eku; };

bool host_matches(const std::string& pattern, const std::string& host) {
    if (pattern == host) return true;
    if (pattern.rfind("*.", 0) != 0) return false;
    auto dot = host.find('.');                                    // wildcard covers exactly one label
    return dot != std::string::npos && host.substr(dot + 1) == pattern.substr(2) && dot > 0;
}

std::string validate(const std::vector<Cert>& chain, const std::set<std::string>& trusted_roots,
                     const std::string& host, int now, const std::string& usage) {
    const Cert& leaf = chain.front();
    if (now < leaf.not_before || now > leaf.not_after) return "invalid: leaf expired or not yet valid";
    if (leaf.eku != usage) return "invalid: certificate not valid for " + usage;
    if (!host.empty()) {
        bool ok = false;
        for (auto& s : leaf.sans) ok = ok || host_matches(s, host);
        if (!ok) return "invalid: hostname " + host + " not in SANs";
    }
    for (std::size_t i = 0; i + 1 < chain.size(); ++i) {           // each cert must be issued by the next (a CA)
        if (chain[i].issuer != chain[i + 1].subject || !chain[i + 1].is_ca) return "invalid: broken chain at " + chain[i].subject;
        if (now > chain[i + 1].not_after) return "invalid: " + chain[i + 1].subject + " expired";
    }
    if (!trusted_roots.count(chain.back().issuer) && !trusted_roots.count(chain.back().subject)) return "invalid: untrusted root";
    return "valid";
}

int main() {
    std::set<std::string> roots{"Example Root CA"};
    Cert root{"Example Root CA", "Example Root CA", {}, 0, 9000, true, ""};
    Cert inter{"Example Issuing CA 1", "Example Root CA", {}, 100, 5000, true, ""};
    Cert leaf{"api.example.com", "Example Issuing CA 1", {"api.example.com", "*.cdn.example.com"}, 1000, 1090, false, "serverAuth"};
    const int now = 1050;
    std::vector<Cert> chain{leaf, inter, root};
    for (std::string host : {"api.example.com", "img.cdn.example.com", "a.b.cdn.example.com", "example.com", "evil.example.org"})
        std::cout << host << ": " << validate(chain, roots, host, now, "serverAuth") << '\n';
    std::cout << "same chain checked on day 1200: " << validate(chain, roots, "api.example.com", 1200, "serverAuth") << '\n';
    Cert self_signed{"api.example.com", "api.example.com", {"api.example.com"}, 1000, 1090, true, "serverAuth"};
    std::cout << "self-signed cert: " << validate({self_signed}, roots, "api.example.com", now, "serverAuth") << '\n';

    // mTLS: the server validates the CLIENT's certificate against the internal CA and reads its identity.
    std::set<std::string> internal_roots{"Internal Mesh CA"};
    Cert mesh{"Internal Mesh CA", "Internal Mesh CA", {}, 0, 9000, true, ""};
    Cert client{"spiffe://example.org/ns/payments/sa/api", "Internal Mesh CA", {}, 1049, 1051, false, "clientAuth"};
    std::string r = validate({client, mesh}, internal_roots, "", now, "clientAuth");
    std::cout << "mTLS client " << client.subject << ": " << r << (r == "valid" ? " -> authorize by identity" : "") << '\n';
}
```

**Output:**
```text
api.example.com: valid
img.cdn.example.com: valid
a.b.cdn.example.com: invalid: hostname a.b.cdn.example.com not in SANs
example.com: invalid: hostname example.com not in SANs
evil.example.org: invalid: hostname evil.example.org not in SANs
same chain checked on day 1200: invalid: leaf expired or not yet valid
self-signed cert: invalid: untrusted root
mTLS client spiffe://example.org/ns/payments/sa/api: valid -> authorize by identity
```

The mesh client certificate lives for only 2 days — short lifetimes plus automatic rotation make revocation much less important.

### Interview answer
"In a TLS 1.3 handshake the client sends supported suites and an ECDHE key share, the server replies with its share, then — already encrypted — its certificate chain, a signature over the handshake proving it owns the key, and a Finished MAC; both derive session keys from the ECDHE secret, which gives forward secrecy in one round trip. The client validates the chain to a trusted root, the dates, the hostname against the SANs with one-label wildcards, and the key usage. With mTLS the server also validates a client certificate from a private CA and authorizes the identity inside it, typically SPIFFE IDs issued and rotated automatically by a mesh."

---

## Cheat sheet

| Topic | Remember |
|---|---|
| Classification | public / internal / confidential / restricted → controls per class |
| Minimization | don't collect; mask, tokenize, pseudonymize; flags instead of raw values |
| Retention & deletion | period per data type; automated purges; erase everywhere incl. backups; crypto-shredding |
| In transit | TLS 1.3 everywhere, incl. internal (mTLS); HSTS |
| At rest | disk/storage encryption + field-level for the most sensitive data |
| Envelope encryption | DEK encrypts data locally; KMS-held KEK wraps DEK; rotation re-wraps; audited decrypts |
| Hashes | SHA-256/SHA-3/BLAKE3 for integrity; MD5/SHA-1 broken |
| Passwords | Argon2id (or bcrypt/scrypt/PBKDF2 600k); unique salt; pepper in a secrets manager; constant-time compare |
| HMAC | shared-secret integrity; webhooks/request signing; timestamp + replay window; not H(key‖msg) |
| Signatures | Ed25519 / ECDSA / RSA-PSS; private signs, public verifies; non-repudiation |
| AEAD | AES-GCM / ChaCha20-Poly1305; unique nonce per key; no unauthenticated CBC/CTR |
| KMS & secrets | non-exportable keys, IAM + audit, versioned rotation; secrets manager, dynamic secrets, workload identity |
| Certificates | short-lived + auto-renew (ACME, cert-manager); monitor expiry; CT monitoring |
| Symmetric vs. asymmetric | fast shared key for data / key pair for exchange + signatures; hybrid in practice |
| Key exchange | ECDHE X25519; ephemeral → forward secrecy; authenticate it; ML-KEM hybrids |
| TLS 1.3 | 1-RTT; ECDHE; cert + CertificateVerify + Finished; AEAD suites; 0-RTT replay risk |
| Validation | chain to trusted root, dates, SAN hostname (one-label wildcard), EKU, CA flag |
| mTLS | both sides present certs; private CA; identity (SPIFFE) → authorization |
