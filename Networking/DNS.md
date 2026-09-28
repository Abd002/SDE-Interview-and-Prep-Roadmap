# DNS (Domain Name System) — Explained for Beginners

> **What you'll learn:** what DNS is, how domain names are organized, the common record types, and — the roadmap topic — the **resolution process**: exactly what happens, step by step, when your computer looks up `www.example.com`. You'll build a working DNS resolver simulator with caching in C++.
>
> **Prerequisites:** [TCP/IP Stack](./TCP-IP-Stack.md) (IP addresses, UDP).

## Table of Contents
0. [What DNS is and how names are organized](#0-what-dns-is-and-how-names-are-organized)
1. [DNS record types](#1-dns-record-types)
2. [Resolution process](#2-resolution-process)
3. [Caching and TTL](#3-caching-and-ttl)
4. [Cheat sheet](#cheat-sheet)

---

## 0. What DNS is and how names are organized

**In one sentence:** DNS is the Internet's phone book — it translates human-friendly names like `google.com` into the numeric IP addresses computers use to connect.

### In plain words
You remember your friend's *name*, not their phone number. Your phone's contacts app translates "Mom" into `+1-555-0100`. DNS is the world's shared contacts app: you type `wikipedia.org`, DNS answers `198.35.26.96`, and your browser calls that number.

No single computer could hold the whole world's phone book, so DNS is **distributed** and **hierarchical**, like the address on an envelope read from right to left: country → city → street → house.

### How it works
A domain name is read **right to left**:
```
            www . example . com .
             │       │       │   └─ root (the invisible final dot)
             │       │       └───── TLD: top-level domain (.com, .org, .uk, .dev)
             │       └───────────── second-level domain (registered by a company/person)
             └───────────────────── subdomain (chosen by the owner)
```
Different organizations are responsible for different parts (**zones**):
- **Root servers** (13 named root server identities, a.root-servers.net … m.root-servers.net, served by hundreds of machines worldwide via anycast) know where each **TLD** is.
- **TLD servers** (e.g. run by Verisign for `.com`) know which servers are authoritative for each domain.
- **Authoritative name servers** (e.g. Cloudflare, Route 53, your company) hold the actual records for a domain.

DNS normally uses **UDP port 53** (fast, small messages); it falls back to **TCP** for big answers and zone transfers. Modern privacy variants: **DoH** (DNS over HTTPS) and **DoT** (DNS over TLS).

### Interview answer
"DNS is a distributed, hierarchical naming system that maps names to records such as IP addresses. The namespace is a tree: root, TLDs, second-level domains and subdomains, with each zone served by authoritative name servers. Queries usually go over UDP port 53."

---

## 1. DNS record types

**In one sentence:** DNS stores several kinds of records — not just IP addresses — each type answering a different question about a domain.

### How it works
| Type | Question it answers | Example |
|---|---|---|
| **A** | IPv4 address of this name? | `example.com. A 93.184.216.34` |
| **AAAA** | IPv6 address? | `example.com. AAAA 2606:2800:220:1::248` |
| **CNAME** | This name is an alias of which name? | `www.example.com. CNAME example.com.` |
| **MX** | Which server receives email for this domain? | `example.com. MX 10 mail.example.com.` |
| **NS** | Which name servers are authoritative for this zone? | `example.com. NS ns1.provider.net.` |
| **TXT** | Arbitrary text (domain verification, SPF/DKIM email security) | `"v=spf1 include:_spf.google.com ~all"` |
| **SOA** | Zone admin info, serial number, default timers | — |
| **PTR** | Reverse lookup: IP → name | `34.216.184.93.in-addr.arpa. PTR example.com.` |
| **SRV** | Host and port of a service | `_sip._tcp.example.com. SRV 10 5 5060 sip.example.com.` |

Every record also has a **TTL** (time to live, in seconds): how long others may cache it.

---

## 2. Resolution process

**In one sentence:** your computer asks a **recursive resolver**, which (if it doesn't already know) asks a root server, then a TLD server, then the domain's authoritative server, and returns the final answer to you — caching everything along the way.

### In plain words
You want the phone number of "Dr. Smith at City Hospital, Springfield".
1. You ask **your assistant** (the recursive resolver) to find it.
2. The assistant checks their **notebook** (cache). Not there.
3. They call the **national directory** (root): "I don't know Dr. Smith, but here's the number for the *Springfield* directory" (TLD).
4. They call the **Springfield directory** (TLD): "I don't know Dr. Smith, but here's *City Hospital's* front desk" (authoritative server).
5. They call **City Hospital** (authoritative): "Dr. Smith is at extension 555-0199."
6. The assistant tells you the number **and writes it in the notebook** for next time.

Notice that the root and TLD servers never give the final answer — they give **referrals** ("ask them instead").

### How it works
```
 ┌─────────┐ 1. www.example.com?   ┌──────────────────────┐ 2. ?   ┌──────────────┐
 │ Browser │ ────────────────────> │ Recursive resolver   │ ─────> │ Root server  │
 │ (stub   │                       │ (ISP, 8.8.8.8,       │ <───── │ "ask .com"   │
 │resolver)│                       │  1.1.1.1)            │ 3.     └──────────────┘
 │         │                       │                      │ 4. ?   ┌──────────────┐
 │         │                       │                      │ ─────> │ .com TLD     │
 │         │                       │                      │ <───── │ "ask ns1.    │
 │         │                       │                      │ 5.     │ example.com" │
 │         │                       │                      │ 6. ?   ┌──────────────┐
 │         │ 8. 93.184.216.34      │                      │ ─────> │Authoritative │
 │         │ <──────────────────── │  (caches everything) │ <───── │ "93.184..."  │
 └─────────┘                       └──────────────────────┘ 7.     └──────────────┘
```
Step by step:
1. **Browser cache** → **OS cache** → the `hosts` file (`/etc/hosts`). If found, done.
2. The OS's **stub resolver** sends a **recursive query** to the configured resolver ("give me the final answer").
3. The resolver checks its cache. On a miss it performs **iterative queries**:
   - asks a **root server** → referral to `.com` TLD servers,
   - asks a **`.com` server** → referral to `example.com`'s authoritative servers (the **NS** records, plus their IPs as "glue"),
   - asks the **authoritative server** → the final **A** record.
4. If the answer is a **CNAME**, the resolver starts again with the target name.
5. The resolver caches every answer and referral for its TTL and replies to the client.

**Recursive vs. iterative:** the client→resolver query is *recursive* ("do all the work for me"); resolver→root/TLD/authoritative queries are *iterative* ("tell me what you know, I'll ask the next one").

### Modern C++ example — a DNS resolver simulator (with CNAME following and caching)
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <optional>
#include <string>
#include <variant>
#include <vector>

// A server's reply is either the final answer, an alias, or a referral to another server.
struct Answer   { std::string ip; };
struct Alias    { std::string target; };        // CNAME
struct Referral { std::string next_server; };   // "ask them instead"
using Reply = std::variant<Answer, Alias, Referral>;

// Each "server" is a tiny table: which names it knows (by suffix) and what it replies.
using Server = std::map<std::string, Reply>;

std::map<std::string, Server> internet{
    {"root",            {{".com", Referral{"com-tld"}}, {".org", Referral{"org-tld"}}}},
    {"com-tld",         {{"example.com", Referral{"ns1.example.com"}}}},
    {"ns1.example.com", {{"www.example.com", Alias{"example.com"}},
                         {"example.com", Answer{"93.184.216.34"}}}},
};

bool ends_with(const std::string& name, const std::string& suffix) {
    return name.size() >= suffix.size() &&
           name.compare(name.size() - suffix.size(), suffix.size(), suffix) == 0;
}

class RecursiveResolver {
public:
    std::optional<std::string> resolve(std::string name) {
        for (int hops = 0; hops < 10; ++hops) {                     // guard against CNAME loops
            if (auto it = cache_.find(name); it != cache_.end()) {
                std::cout << "  cache hit for " << name << '\n';
                return it->second;
            }
            std::string server = "root";                           // always start at the root
            while (true) {
                std::cout << "  ask " << server << " about " << name << '\n';
                const Reply* reply = lookup(server, name);
                if (!reply) return std::nullopt;                   // NXDOMAIN
                if (auto* a = std::get_if<Answer>(reply)) {
                    cache_[name] = a->ip;
                    for (auto& alias : pending_aliases_) cache_[alias] = a->ip;
                    pending_aliases_.clear();
                    return a->ip;
                }
                if (auto* c = std::get_if<Alias>(reply)) {
                    std::cout << "  " << name << " is an alias (CNAME) of " << c->target << '\n';
                    pending_aliases_.push_back(name);
                    name = c->target;                              // restart with the target
                    break;
                }
                server = std::get<Referral>(*reply).next_server;   // follow the referral
            }
        }
        return std::nullopt;
    }

private:
    static const Reply* lookup(const std::string& server, const std::string& name) {
        const Reply* best = nullptr;
        std::size_t best_len = 0;
        for (const auto& [suffix, reply] : internet.at(server))    // longest matching suffix
            if (ends_with(name, suffix) && suffix.size() > best_len) {
                best = &reply;
                best_len = suffix.size();
            }
        return best;
    }
    std::map<std::string, std::string> cache_;
    std::vector<std::string> pending_aliases_;
};

int main() {
    RecursiveResolver resolver;
    for (const auto& [title, name] : {std::pair{"first lookup", "www.example.com"},
                                      std::pair{"second lookup", "www.example.com"},
                                      std::pair{"unknown name", "nothing.net"}}) {
        std::cout << title << ":\n";
        auto ip = resolver.resolve(name);          // resolve first, so its log prints first
        std::cout << "=> " << ip.value_or("NXDOMAIN") << "\n\n";
    }
}
```

**Output:**
```text
first lookup:
  ask root about www.example.com
  ask com-tld about www.example.com
  ask ns1.example.com about www.example.com
  www.example.com is an alias (CNAME) of example.com
  ask root about example.com
  ask com-tld about example.com
  ask ns1.example.com about example.com
=> 93.184.216.34

second lookup:
  cache hit for www.example.com
=> 93.184.216.34

unknown name:
  ask root about nothing.net
=> NXDOMAIN

```
(A real resolver would also cache the referrals, so the second part of the CNAME chase would jump straight to `ns1.example.com`.)

### Common mistakes
- Thinking the root servers know every domain. They only know who runs each TLD.
- Forgetting the CNAME rule: a name with a CNAME can't have other records, so you can't CNAME the bare domain (`example.com`) in standard DNS — providers offer "ALIAS/ANAME" workarounds.

### Interview answer
"The browser and OS check their caches and hosts file, then the stub resolver sends a recursive query to a recursive resolver. On a cache miss the resolver iteratively queries a root server, which refers it to the TLD servers, which refer it to the domain's authoritative servers, which return the record. CNAMEs are followed, and every response is cached for its TTL before the answer returns to the client."

---

## 3. Caching and TTL

**In one sentence:** every DNS answer carries a TTL (time to live) saying how many seconds it may be cached, trading freshness for speed and load.

### In plain words
Milk has an expiry date. You can keep using the carton in your fridge (cache) until the date passes; then you must buy a fresh one (re-query). A long TTL means fewer trips to the store but you might keep drinking old milk after the recipe changed (stale IP after a server move).

### How it works
- Caches exist in the browser, OS, home router, and recursive resolver.
- **Short TTL** (30–300 s): fast failover/migration, more DNS traffic.
- **Long TTL** (hours/days): fewer lookups, slower to change.
- Before a planned migration, lower the TTL *days in advance*, move, then raise it again.
- **Negative caching:** "this name doesn't exist" (NXDOMAIN) is cached too, per the SOA record.

### Modern C++ example — a TTL cache
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <chrono>
#include <iostream>
#include <map>
#include <optional>
#include <string>

using Clock = std::chrono::steady_clock;
using namespace std::chrono_literals;

class DnsCache {
public:
    void put(const std::string& name, const std::string& ip, std::chrono::seconds ttl,
             Clock::time_point now) {
        entries_[name] = {ip, now + ttl};
    }
    std::optional<std::string> get(const std::string& name, Clock::time_point now) {
        auto it = entries_.find(name);
        if (it == entries_.end()) return std::nullopt;
        if (now >= it->second.expires) {            // expired: forget it
            entries_.erase(it);
            return std::nullopt;
        }
        return it->second.ip;
    }
private:
    struct Entry { std::string ip; Clock::time_point expires; };
    std::map<std::string, Entry> entries_;
};

int main() {
    DnsCache cache;
    const auto t0 = Clock::now();                   // we pass "now" in, so we can fake time
    cache.put("example.com", "93.184.216.34", 300s, t0);

    for (auto elapsed : {10s, 299s, 300s}) {
        auto hit = cache.get("example.com", t0 + elapsed);
        std::cout << "after " << elapsed.count() << "s: "
                  << (hit ? "cached " + *hit : std::string("expired -> ask the resolver again"))
                  << '\n';
    }
}
```

**Output:**
```text
after 10s: cached 93.184.216.34
after 299s: cached 93.184.216.34
after 300s: expired -> ask the resolver again
```
Passing the current time as a parameter (instead of calling the clock inside) is a great habit — it makes time-based code easy to test.

### Interview answer
"DNS answers are cached at every layer for their TTL. Short TTLs enable fast changes and failover at the cost of more queries; long TTLs reduce load and latency but slow down changes. Negative answers are cached too. Before migrations you lower the TTL in advance."

---

## Cheat sheet

| Term | One-liner |
|---|---|
| DNS | Distributed phone book: names → records |
| Root → TLD → Authoritative | The chain of referrals |
| Recursive resolver | Does the whole lookup for clients and caches (ISP, 8.8.8.8, 1.1.1.1) |
| Recursive vs iterative query | "Give me the answer" vs "tell me who to ask next" |
| A / AAAA / CNAME / MX / NS / TXT | IPv4 / IPv6 / alias / mail / name servers / text |
| TTL | How long an answer may be cached |
| Port | UDP 53 (TCP 53 for large answers), DoH 443, DoT 853 |

**Next:** [Routing Algorithms](./Routing-Algorithms.md).
