# Microservices Architecture — Explained for Beginners

> **What you'll learn:** what microservices are, and the roadmap topics: **choreography vs. orchestration**, the **API gateway**, the **circuit breaker** pattern, the **saga** pattern, **caching**, and **load balancing** (DNS load balancing, CDNs, anycast routing, adaptive algorithms) — each with a C++ model.
>
> **Prerequisites:** [Client-server architecture](../System%20Architecture/Client-Server-Architecture.md), [HTTP](../Networking/HTTP.md). A longer reference with 76 interview questions: [Microservices.md](./Microservices.md).

## Table of Contents
0. [Monolith vs. microservices](#0-monolith-vs-microservices)
1. [Choreography vs. Orchestration](#1-choreography-vs-orchestration)
2. [API gateway](#2-api-gateway)
3. [Circuit Breaker pattern](#3-circuit-breaker-pattern)
4. [Saga pattern](#4-saga-pattern)
5. [Load balancing](#5-load-balancing)
   - [DNS load balancing](#51-dns-load-balancing) · [Content Delivery Networks (CDNs)](#52-content-delivery-networks-cdns) · [Anycast routing](#53-anycast-routing) · [Adaptive load balancing algorithms](#54-adaptive-load-balancing-algorithms)
6. [Caching strategies](#6-caching-strategies)
7. [Cheat sheet](#cheat-sheet)

---

## 0. Monolith vs. microservices

**In one sentence:** a **monolith** is one application deployed as a single unit; **microservices** split the application into many small, independently deployable services, each owning one business capability and its own data.

### In plain words
A **monolith** is a big department store under one roof: one building, one electricity bill, easy to walk between departments — but renovating the shoe section means closing the whole store. **Microservices** are a shopping mall of small independent shops: each shop can renovate, change hours or hire staff on its own; but now you need corridors, signs, security at the entrance, and shops must coordinate deliveries.

### How it works
| | Monolith | Microservices |
|---|---|---|
| Deploy | Everything together | Each service independently |
| Scale | Whole app | Only the busy services |
| Data | One shared database | **Database per service** |
| Communication | In-process function calls | Network: HTTP/gRPC, messages |
| Team structure | One codebase for all | Small teams own services end to end |
| Failures | One bug can crash everything | Isolated — if you design for it |
| Complexity | In the code | In the **distributed system** (network, consistency, observability) |

Rule of thumb: start with a well-structured (modular) monolith; split into services when team size, scaling or deployment independence actually require it.

---

## 1. Choreography vs. Orchestration

**In one sentence:** in **orchestration** a central coordinator tells each service what to do and when; in **choreography** there's no coordinator — each service reacts to **events** published by others.

### In plain words
- **Orchestration = an orchestra with a conductor.** The conductor (an "order workflow" service) says: "payment, charge now… inventory, reserve now… shipping, go".
- **Choreography = dancers at a party.** No one is in charge; each dancer reacts to the music and to the others: when "OrderPlaced" is announced, payment charges; when "PaymentCompleted" is announced, inventory reserves; and so on.

### How it works
| | Orchestration | Choreography |
|---|---|---|
| Control | Central orchestrator (e.g. Temporal, AWS Step Functions, Camunda) | Distributed, event-driven (Kafka, RabbitMQ) |
| Coupling | Orchestrator knows every step | Services only know events |
| Visibility | The whole flow is in one place — easy to understand/monitor | Flow is implicit, spread across services — needs tracing |
| Changes | Edit the orchestrator | Add a new subscriber without touching others |
| Risk | Orchestrator becomes a bottleneck / "god service" | Hard to see the big picture; cyclic event chains |
| Good for | Complex workflows with many steps, timeouts, compensation | Simple flows, highly decoupled domains, fan-out |

### Modern C++ example — the same order flow both ways
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <functional>
#include <iostream>
#include <map>
#include <queue>
#include <string>
#include <vector>

// "Services"
void charge_payment(int order)    { std::cout << "    payment: charged order " << order << '\n'; }
void reserve_inventory(int order) { std::cout << "    inventory: reserved items for " << order << '\n'; }
void ship(int order)              { std::cout << "    shipping: shipped order " << order << '\n'; }

// ---------- Orchestration: one coordinator calls each step explicitly ----------
void order_orchestrator(int order) {
    charge_payment(order);
    reserve_inventory(order);
    ship(order);
}

// ---------- Choreography: services subscribe to events on a bus ----------
class EventBus {
public:
    void subscribe(const std::string& event, std::function<void(int)> handler) { subs_[event].push_back(std::move(handler)); }
    void publish(const std::string& event, int order) { queue_.push({event, order}); }
    void run() {
        while (!queue_.empty()) {
            auto [event, order] = queue_.front(); queue_.pop();
            std::cout << "  event: " << event << '\n';
            for (auto& h : subs_[event]) h(order);
        }
    }
private:
    std::map<std::string, std::vector<std::function<void(int)>>> subs_;
    std::queue<std::pair<std::string, int>> queue_;
};

int main() {
    std::cout << "ORCHESTRATION:\n";
    order_orchestrator(1);

    std::cout << "CHOREOGRAPHY:\n";
    EventBus bus;
    // Each service only knows which event it reacts to and which event it emits.
    bus.subscribe("OrderPlaced",       [&](int o) { charge_payment(o);    bus.publish("PaymentCompleted", o); });
    bus.subscribe("PaymentCompleted",  [&](int o) { reserve_inventory(o); bus.publish("InventoryReserved", o); });
    bus.subscribe("InventoryReserved", [&](int o) { ship(o); });
    bus.subscribe("OrderPlaced",       [](int o) { std::cout << "    analytics: counted order " << o << '\n'; }); // added freely
    bus.publish("OrderPlaced", 2);
    bus.run();
}
```

**Output:**
```text
ORCHESTRATION:
    payment: charged order 1
    inventory: reserved items for 1
    shipping: shipped order 1
CHOREOGRAPHY:
  event: OrderPlaced
    payment: charged order 2
    analytics: counted order 2
  event: PaymentCompleted
    inventory: reserved items for 2
  event: InventoryReserved
    shipping: shipped order 2
```

### Interview answer
"Orchestration uses a central coordinator that invokes services and holds the workflow state, making complex flows explicit and observable but centralizing logic. Choreography has services react to each other's events with no coordinator, maximizing decoupling and extensibility but making the overall flow implicit and harder to trace. Many systems mix them: orchestrate complex business workflows, choreograph simple reactions."

---

## 2. API gateway

**In one sentence:** an API gateway is the **single entry point** in front of all your microservices that routes requests to the right service and handles cross-cutting concerns like authentication, rate limiting and response aggregation.

### In plain words
A hotel **reception desk**. Guests don't wander into the kitchen, laundry or maintenance rooms; they ask reception, which checks who they are (room key), sends the request to the right department, and may combine answers ("your breakfast is booked and your taxi is at 8").

### How it works
Responsibilities:
- **Routing:** `/users/*` → user-service, `/orders/*` → order-service (and API versioning).
- **Authentication / authorization:** verify JWT/OAuth tokens once, at the edge.
- **Rate limiting & throttling**, IP allow/deny lists, WAF.
- **Aggregation ("backend for frontend", BFF):** one client call → several service calls → one combined response (fewer round trips for mobile).
- **Protocol translation:** public REST/JSON outside, gRPC inside.
- **TLS termination, caching, compression, request/response transformation, logging, tracing headers.**

Examples: Kong, NGINX, Envoy, AWS API Gateway, Azure API Management, Spring Cloud Gateway, Apigee.
Pitfalls: a **single point of failure** (run several instances behind a load balancer), a potential bottleneck, and a place where business logic shouldn't accumulate.

### Modern C++ example — routing, auth, rate limiting and aggregation
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <functional>
#include <iostream>
#include <map>
#include <string>

using Service = std::function<std::string(const std::string& path)>;

class ApiGateway {
public:
    void route(const std::string& prefix, Service s) { routes_[prefix] = std::move(s); }

    std::string handle(const std::string& path, const std::string& token) {
        if (token != "valid-jwt") return "401 Unauthorized";                         // auth at the edge
        if (++requests_[token] > 3) return "429 Too Many Requests";                   // rate limit
        if (path == "/dashboard")                                                     // aggregation (BFF)
            return "200 {" + routes_.at("/users")("/users/me") + ", " + routes_.at("/orders")("/orders?mine") + "}";
        for (const auto& [prefix, service] : routes_)                                 // routing
            if (path.starts_with(prefix)) return "200 " + service(path);
        return "404 Not Found";
    }
private:
    std::map<std::string, Service> routes_;
    std::map<std::string, int> requests_;
};

int main() {
    ApiGateway gw;
    gw.route("/users",  [](const std::string&) { return std::string("\"user\":\"ana\""); });
    gw.route("/orders", [](const std::string&) { return std::string("\"orders\":[1,2]"); });

    std::cout << gw.handle("/users/me", "valid-jwt") << '\n';
    std::cout << gw.handle("/dashboard", "valid-jwt") << '\n';
    std::cout << gw.handle("/orders", "stolen-token") << '\n';
    std::cout << gw.handle("/payments", "valid-jwt") << '\n';
    std::cout << gw.handle("/users/me", "valid-jwt") << '\n';     // 4th request from this token
}
```

**Output:**
```text
200 "user":"ana"
200 {"user":"ana", "orders":[1,2]}
401 Unauthorized
404 Not Found
429 Too Many Requests
```

### Interview answer
"An API gateway is the single entry point for clients: it routes requests to services and centralizes cross-cutting concerns — authentication, rate limiting, TLS termination, caching, logging and tracing — and can aggregate multiple service calls into one response, the backend-for-frontend pattern. It must be highly available and should stay free of business logic."

---

## 3. Circuit Breaker pattern

**In one sentence:** a circuit breaker **stops calling a failing service** for a while after too many errors, returning a fast failure or fallback instead — then carefully tests whether the service has recovered.

### In plain words
The **electrical breaker** in your house: when there's a short circuit, it trips and cuts power, preventing a fire. After you fix the problem, you flip it back on. In software, if the payment service is down, hammering it with thousands of requests (each waiting 30 seconds to time out) wastes threads, slows everything, and keeps the struggling service from recovering. The breaker "trips" and fails fast.

### How it works
Three states:
```
          failures ≥ threshold                   cool-down elapsed
 CLOSED ───────────────────────────> OPEN ─────────────────────────> HALF-OPEN
 (calls pass through,                (calls fail immediately,        (let a few trial calls through)
  failures counted)                   use fallback)                      │            │
    ^                                                                success       failure
    └────────────────────────────────────────────────────────────────────┘            └──> OPEN
```
- **Closed:** normal; count consecutive failures (or error rate in a window).
- **Open:** reject calls instantly for a **cool-down** period (e.g. 30 s).
- **Half-open:** allow a trial request; success → Closed, failure → Open again.
- Combine with **timeouts**, **retries** (inside the breaker, with backoff), **fallbacks** (cached data, default response) and **bulkheads**.
- Libraries: Resilience4j (Java), Polly (.NET), Hystrix (retired), Envoy/Istio outlier detection at the service-mesh level.

### Modern C++ example
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <chrono>
#include <functional>
#include <iostream>
#include <optional>
#include <string>

using Clock = std::chrono::steady_clock;
using namespace std::chrono_literals;

class CircuitBreaker {
public:
    enum class State { Closed, Open, HalfOpen };
    CircuitBreaker(int threshold, std::chrono::seconds cooldown) : threshold_(threshold), cooldown_(cooldown) {}

    std::optional<std::string> call(const std::function<std::optional<std::string>()>& op, Clock::time_point now) {
        if (state_ == State::Open) {
            if (now - opened_at_ < cooldown_) return std::nullopt;     // fail fast, don't even try
            state_ = State::HalfOpen;                                   // cool-down over: allow a trial
        }
        auto result = op();
        if (result) { failures_ = 0; state_ = State::Closed; return result; }
        if (state_ == State::HalfOpen || ++failures_ >= threshold_) { state_ = State::Open; opened_at_ = now; }
        return std::nullopt;
    }
    std::string state() const {
        return state_ == State::Closed ? "CLOSED" : state_ == State::Open ? "OPEN" : "HALF-OPEN";
    }
private:
    int threshold_, failures_ = 0;
    std::chrono::seconds cooldown_;
    State state_ = State::Closed;
    Clock::time_point opened_at_{};
};

int main() {
    CircuitBreaker breaker(3, 30s);
    bool service_up = false;
    int real_calls = 0;
    auto payment_service = [&]() -> std::optional<std::string> {
        ++real_calls;
        if (!service_up) return std::nullopt;
        return "payment ok";
    };

    auto t0 = Clock::now();
    auto attempt = [&](int second) {
        auto r = breaker.call(payment_service, t0 + std::chrono::seconds(second));
        std::cout << "t=" << second << "s: " << (r ? *r : "failed -> fallback") << "  [breaker "
                  << breaker.state() << ", real calls so far: " << real_calls << "]\n";
    };

    for (int s : {0, 1, 2, 3, 4, 10}) attempt(s);     // service down: trips after 3 failures
    service_up = true;                                 // the service recovers
    attempt(35);                                       // half-open trial succeeds -> closed
    attempt(36);
}
```

**Output:**
```text
t=0s: failed -> fallback  [breaker CLOSED, real calls so far: 1]
t=1s: failed -> fallback  [breaker CLOSED, real calls so far: 2]
t=2s: failed -> fallback  [breaker OPEN, real calls so far: 3]
t=3s: failed -> fallback  [breaker OPEN, real calls so far: 3]
t=4s: failed -> fallback  [breaker OPEN, real calls so far: 3]
t=10s: failed -> fallback  [breaker OPEN, real calls so far: 3]
t=35s: payment ok  [breaker CLOSED, real calls so far: 4]
t=36s: payment ok  [breaker CLOSED, real calls so far: 5]
```
While open, the failing service received **zero** extra calls — giving it room to recover, and giving users an instant fallback instead of a 30-second hang.

### Interview answer
"A circuit breaker wraps calls to a dependency and tracks failures. In the closed state calls pass through; when failures exceed a threshold it opens and fails fast or serves a fallback for a cool-down period; then it goes half-open and lets trial calls through, closing on success or reopening on failure. It prevents cascading failures and resource exhaustion, and pairs with timeouts, retries with backoff and bulkheads."

---

## 4. Saga pattern

**In one sentence:** a saga manages a business transaction that spans several services as a **sequence of local transactions**, where each step has a **compensating action** that undoes it if a later step fails.

### In plain words
Booking a trip: book the flight, then the hotel, then the rental car. If the car rental fails, you can't "roll back" the airline's database — it belongs to another company. Instead you **cancel** the hotel and **cancel** the flight (compensations). The trip ends up either fully booked or fully cancelled — eventually.

### How it works
- Each service commits its own **local ACID transaction** (it owns its database — no distributed lock or 2PC across services).
- On failure at step *k*, run compensations for steps *k−1 … 1* in **reverse order**.
- Compensations are **semantic undos** (refund, cancel reservation, send apology email), not database rollbacks — and must be **idempotent** (safe to retry).
- Two styles (see section 1): **orchestrated saga** (a saga coordinator drives steps and compensations) or **choreographed saga** (services react to events like `PaymentFailed`).
- Consequences: no isolation — other transactions can see intermediate states ("hotel booked, flight pending"), so design for it (pending states, semantic locks).
- Contrast with **two-phase commit (2PC)**: 2PC gives atomicity across databases but blocks and couples services; sagas trade isolation for availability.

### Modern C++ example — orchestrated saga with compensations
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <functional>
#include <iostream>
#include <string>
#include <vector>

struct Step {
    std::string name;
    std::function<bool()> action;           // local transaction in one service
    std::function<void()> compensate;       // semantic undo
};

bool run_saga(const std::vector<Step>& steps) {
    std::vector<const Step*> done;
    for (const auto& s : steps) {
        if (s.action()) { std::cout << "  ok:   " << s.name << '\n'; done.push_back(&s); continue; }
        std::cout << "  FAIL: " << s.name << " -> compensating\n";
        for (auto it = done.rbegin(); it != done.rend(); ++it) (*it)->compensate();   // reverse order
        return false;
    }
    return true;
}

int main() {
    for (bool car_available : {true, false}) {
        std::cout << (car_available ? "Trip where everything works:\n" : "Trip where the car rental fails:\n");
        bool ok = run_saga({
            {"book flight", [] { return true; }, [] { std::cout << "  undo: cancel flight (refund)\n"; }},
            {"book hotel",  [] { return true; }, [] { std::cout << "  undo: cancel hotel\n"; }},
            {"rent car",    [=] { return car_available; }, [] { std::cout << "  undo: cancel car\n"; }},
        });
        std::cout << "  => trip " << (ok ? "CONFIRMED" : "CANCELLED, all steps compensated") << "\n";
    }
}
```

**Output:**
```text
Trip where everything works:
  ok:   book flight
  ok:   book hotel
  ok:   rent car
  => trip CONFIRMED
Trip where the car rental fails:
  ok:   book flight
  ok:   book hotel
  FAIL: rent car -> compensating
  undo: cancel hotel
  undo: cancel flight (refund)
  => trip CANCELLED, all steps compensated
```

### Interview answer
"A saga implements a cross-service business transaction as a sequence of local transactions, each with a compensating transaction executed in reverse order when a later step fails, giving eventual consistency without distributed locks or 2PC. It can be orchestrated by a coordinator or choreographed via events; compensations must be idempotent, and since there's no isolation, intermediate states must be handled explicitly."

---

## 5. Load balancing

**In one sentence:** a load balancer **distributes incoming requests across multiple servers** so no single server is overwhelmed, and routes around servers that are unhealthy.

### In plain words
A supermarket manager directing customers to checkout lanes: "lane 3 is free!" Without the manager, everyone queues at lane 1 while lanes 2–8 sit idle. If a cashier goes on break (server down), the manager stops sending people there.

### How it works
- **Layer 4 (transport)** load balancers route TCP/UDP connections by IP/port — very fast (AWS NLB, LVS, Maglev).
- **Layer 7 (application)** load balancers understand HTTP — route by path, header, cookie; terminate TLS (NGINX, HAProxy, Envoy, AWS ALB).
- **Health checks** remove failed servers; **session affinity** ("sticky sessions") pins a user to a server (better to keep servers stateless).
- Classic static algorithms:
  | Algorithm | Picks | Good when |
  |---|---|---|
  | Round robin | Next server in turn | Similar servers, similar requests |
  | Weighted round robin | In proportion to capacity | Mixed server sizes |
  | Least connections | Server with fewest active connections | Long/variable requests |
  | IP/consistent hash | `hash(client or key)` | Stickiness, cache locality ([Consistent Hashing](./Scalability.md#2-consistent-hashing)) |
  | Random / power of two choices | Best of 2 random servers | Large fleets, simple and robust |

The load balancer itself must be redundant (active–passive pairs, or DNS/anycast in front — next sections).

### 5.1 DNS load balancing

**In one sentence:** the DNS server returns **different IP addresses** (or a rotating list) for the same hostname, spreading clients across servers or data centers.

#### In plain words
Calling a company's single phone number and being routed to different call centers depending on the time or your region — except the routing happens when you look up the number.

#### How it works
- **Round-robin DNS:** `api.example.com` has several A records; the order rotates on each response.
- **GeoDNS / latency-based:** answer with the IP of the nearest or fastest data center (AWS Route 53, Cloudflare, NS1).
- **Weighted / failover records:** send 10% to a canary region; stop returning IPs of an unhealthy region.
- Limits: clients and resolvers **cache** answers for the TTL, so changes and failover are slow and uneven; DNS doesn't know real server load; clients may keep using a dead IP. That's why DNS is used for **coarse, global** balancing, with real load balancers inside each region.

#### Modern C++ example — round-robin and geo-aware DNS answers
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <string>
#include <vector>

class DnsLoadBalancer {
public:
    std::map<std::string, std::vector<std::string>> regions{
        {"eu", {"185.1.1.1", "185.1.1.2"}}, {"us", {"34.2.2.1", "34.2.2.2", "34.2.2.3"}}};
    std::map<std::string, bool> region_healthy{{"eu", true}, {"us", true}};

    // Answer with the client's nearest healthy region, rotating the IPs (round robin).
    std::string resolve(const std::string& client_region) {
        std::string region = region_healthy[client_region] ? client_region : fallback(client_region);
        auto& ips = regions[region];
        auto& i = cursor_[region];
        return ips[i++ % ips.size()] + " (" + region + ")";
    }
private:
    std::string fallback(const std::string& r) { return r == "eu" ? "us" : "eu"; }
    std::map<std::string, std::size_t> cursor_;
};

int main() {
    DnsLoadBalancer dns;
    for (int i = 0; i < 3; ++i) std::cout << "EU client -> " << dns.resolve("eu") << '\n';
    dns.region_healthy["eu"] = false;                         // EU data center down
    std::cout << "EU down, EU client -> " << dns.resolve("eu") << '\n';
}
```

**Output:**
```text
EU client -> 185.1.1.1 (eu)
EU client -> 185.1.1.2 (eu)
EU client -> 185.1.1.1 (eu)
EU down, EU client -> 34.2.2.1 (us)
```

#### Interview answer
"DNS load balancing returns different addresses for one name — round robin, weighted, geo or latency-based — to spread users across servers or regions. It's simple and global but coarse: TTL caching delays changes and failover, and DNS is unaware of real load, so it's combined with regional L4/L7 load balancers."

### 5.2 Content Delivery Networks (CDNs)

**In one sentence:** a CDN is a worldwide network of **edge servers** that cache copies of your content close to users, so most requests are served nearby instead of from your origin server.

#### In plain words
Instead of every customer in the world ordering books from one warehouse in Seattle, a publisher stocks popular books in **local bookshops** everywhere. Customers get them in minutes, and the Seattle warehouse only handles the rare titles.

#### How it works
1. Users are routed to the nearest **edge PoP** (point of presence) via DNS or anycast.
2. **Cache hit:** the edge returns the content immediately.
3. **Cache miss:** the edge fetches from the **origin** (or a mid-tier "shield" cache), stores it, and returns it.
4. Freshness via `Cache-Control: max-age`, `ETag`, and explicit **purge/invalidation**. Versioned file names (`app.3f9c.js`) make caching safe forever.
- Benefits: lower latency, less origin load/bandwidth cost, absorbs traffic spikes and **DDoS** attacks, TLS at the edge.
- Content: images, video (streaming segments), JS/CSS, downloads; increasingly dynamic content and **edge compute** (Cloudflare Workers, Lambda@Edge).
- Providers: Cloudflare, Akamai, Fastly, Amazon CloudFront, Google Cloud CDN.

#### Modern C++ example — edge caches in front of an origin
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <string>
#include <vector>

struct Origin {
    int requests = 0;
    std::string fetch(const std::string& path) { ++requests; return "<content of " + path + ">"; }
};

class EdgeServer {
public:
    EdgeServer(std::string city, Origin& origin) : city_(std::move(city)), origin_(origin) {}
    std::string get(const std::string& path) {
        if (auto it = cache_.find(path); it != cache_.end()) { ++hits_; return it->second; }  // served locally
        ++misses_;
        return cache_[path] = origin_.fetch(path);                                             // go to origin once
    }
    void report() const { std::cout << "  edge " << city_ << ": " << hits_ << " hits, " << misses_ << " misses\n"; }
private:
    std::string city_;
    Origin& origin_;
    std::map<std::string, std::string> cache_;
    int hits_ = 0, misses_ = 0;
};

int main() {
    Origin origin;
    std::vector<EdgeServer> edges{{"Paris", origin}, {"Tokyo", origin}, {"Sao Paulo", origin}};
    for (int user = 0; user < 3000; ++user)                      // 3000 users, 1000 per city
        edges[user % 3].get(user % 2 ? "/logo.png" : "/app.js");
    for (const auto& e : edges) e.report();
    std::cout << "origin handled " << origin.requests << " of 3000 requests\n";
}
```

**Output:**
```text
  edge Paris: 998 hits, 2 misses
  edge Tokyo: 998 hits, 2 misses
  edge Sao Paulo: 998 hits, 2 misses
origin handled 6 of 3000 requests
```

#### Interview answer
"A CDN caches content on geographically distributed edge servers; users are routed to a nearby PoP by DNS or anycast, hits are served locally and misses are fetched from the origin. It cuts latency and origin load, absorbs spikes and DDoS, and relies on Cache-Control headers, versioned URLs and purges for freshness; modern CDNs also run edge compute."

### 5.3 Anycast routing

**In one sentence:** with anycast, **many servers in different locations announce the same IP address**, and the Internet's routing (BGP) automatically delivers each user's packets to the **nearest** one.

#### In plain words
An emergency number like **911/112**: everyone dials the same number, but your call reaches the *local* emergency center, not one in another country. Anycast does this for IP addresses.

#### How it works
- **Unicast:** one IP = one machine. **Anycast:** one IP = many machines; routers pick the "closest" by BGP path.
- If a location goes down, it **withdraws its route** and traffic automatically flows to the next-nearest site — fast failover with no DNS TTL delays.
- Great for **short, stateless** exchanges: DNS (all 13 root server identities are anycast), CDNs (Cloudflare), DDoS mitigation (attack traffic is split across all sites), public resolvers like 1.1.1.1 and 8.8.8.8.
- Caveat: a routing change mid-connection can send a long TCP connection to a different site; CDNs handle this with careful engineering.
- "Nearest" means fewest network hops by routing policy, not always lowest latency.

#### Modern C++ example — routing to the nearest site announcing the same IP
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <limits>
#include <map>
#include <string>

struct Site { std::string name; bool announcing = true; };

// BGP-like choice: among sites announcing 1.1.1.1, pick the one with the shortest path from the user.
std::string route(const std::map<std::string, int>& hops_from_user, const std::map<std::string, Site>& sites) {
    std::string best = "unreachable";
    int best_hops = std::numeric_limits<int>::max();
    for (const auto& [id, site] : sites)
        if (site.announcing && hops_from_user.at(id) < best_hops) { best_hops = hops_from_user.at(id); best = site.name; }
    return best;
}

int main() {
    std::map<std::string, Site> sites{{"fra", {"Frankfurt"}}, {"sin", {"Singapore"}}, {"iad", {"Virginia"}}};
    std::map<std::string, int> berlin_user{{"fra", 2}, {"sin", 9}, {"iad", 6}};
    std::map<std::string, int> tokyo_user{{"fra", 10}, {"sin", 3}, {"iad", 8}};

    std::cout << "Berlin user -> 1.1.1.1 served by " << route(berlin_user, sites) << '\n';
    std::cout << "Tokyo user  -> 1.1.1.1 served by " << route(tokyo_user, sites) << '\n';
    sites["fra"].announcing = false;                           // Frankfurt fails: route withdrawn
    std::cout << "Frankfurt down, Berlin user -> " << route(berlin_user, sites) << '\n';
}
```

**Output:**
```text
Berlin user -> 1.1.1.1 served by Frankfurt
Tokyo user  -> 1.1.1.1 served by Singapore
Frankfurt down, Berlin user -> Virginia
```

#### Interview answer
"Anycast advertises the same IP prefix from multiple locations via BGP, so the network delivers each client to the topologically nearest site, with automatic failover when a site withdraws its route. It's ideal for stateless, short-lived traffic like DNS and CDN edges and spreads DDoS load, but route changes can disrupt long-lived connections."

### 5.4 Adaptive load balancing algorithms

**In one sentence:** adaptive load balancers choose a server using **live feedback** — latency, error rate, active requests, CPU — instead of a fixed rotation, so traffic flows away from slow or overloaded servers automatically.

#### In plain words
A smart supermarket manager who doesn't just rotate lanes but watches **how fast each lane is moving**: a slow trainee cashier gets fewer customers; a lane where the card reader keeps failing gets none.

#### How it works
Common adaptive strategies:
| Strategy | Signal used |
|---|---|
| **Least connections / least outstanding requests** | Active requests per server |
| **Least response time / EWMA latency** | Exponentially weighted moving average of recent latencies |
| **Power of two choices (P2C)** | Pick 2 random servers, send to the less loaded — near-optimal and cheap |
| **Peak EWMA** (Finagle, Linkerd) | Latency × outstanding requests, reacts fast to spikes |
| **Weighted by health / error rate / CPU** | Server-reported load, outlier ejection |

An **EWMA** (exponentially weighted moving average) is `avg = α × latest + (1 − α) × avg` — recent measurements count more, old ones fade away.
Pitfall: **herding** — if every balancer sends everything to the single "best" server, it becomes the worst. Randomization (P2C) avoids this.

#### Modern C++ example — round robin vs. EWMA-latency with power of two choices
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <format>
#include <iostream>
#include <random>
#include <string>
#include <vector>

struct Server {
    std::string name;
    double true_latency_ms;      // hidden truth (one server is degraded)
    double ewma = 50;            // what the balancer has learned
    int requests = 0;
};

double serve(Server& s) {                                   // send a request, observe latency
    ++s.requests;
    s.ewma = 0.2 * s.true_latency_ms + 0.8 * s.ewma;        // EWMA update
    return s.true_latency_ms;
}

int main() {
    auto fresh = [] { return std::vector<Server>{{"a", 20}, {"b", 25}, {"c", 400}}; };  // c is slow
    constexpr int kRequests = 3000;

    // Round robin: ignores feedback
    auto rr = fresh();
    double rr_total = 0;
    for (int i = 0; i < kRequests; ++i) rr_total += serve(rr[i % rr.size()]);

    // Adaptive: pick 2 random servers, send to the one with the lower EWMA latency
    auto ad = fresh();
    std::mt19937 rng(7);
    std::uniform_int_distribution<std::size_t> pick(0, ad.size() - 1);
    double ad_total = 0;
    for (int i = 0; i < kRequests; ++i) {
        std::size_t x = pick(rng), y = pick(rng);
        while (y == x) y = pick(rng);                      // two DIFFERENT candidates
        ad_total += serve(ad[x].ewma <= ad[y].ewma ? ad[x] : ad[y]);
    }

    auto report = [](const char* name, const std::vector<Server>& s, double total) {
        std::cout << std::format("{:<22} avg latency {:6.1f} ms | requests a={} b={} c={}\n",
                                 name, total / kRequests, s[0].requests, s[1].requests, s[2].requests);
    };
    report("round robin:", rr, rr_total);
    report("adaptive (EWMA + P2C):", ad, ad_total);
}
```

**Output (may vary):**
```text
round robin:           avg latency  148.3 ms | requests a=1000 b=1000 c=1000
adaptive (EWMA + P2C): avg latency   21.8 ms | requests a=1999 b=1000 c=1
```
After a single slow response the adaptive balancer learns that server `c` is degraded and stops sending it traffic — nobody had to configure that. (Server `b` still gets traffic whenever it's paired with `c`; that randomness is what prevents every request from piling onto the single fastest server.)

#### Interview answer
"Adaptive load balancing uses live feedback such as outstanding requests, EWMA latency or error rates to route traffic, unlike static round robin. Techniques include least outstanding requests, least response time, peak-EWMA and power-of-two-choices, which samples two servers and picks the less loaded one to avoid herding. Combined with outlier ejection, it routes around degraded instances automatically."

---

## 6. Caching strategies

Caching in microservices (cache-aside, write-through, write-behind, and cache stampede prevention) is covered in its own guide: **[Caching Strategies](./Caching-Strategies.md)**.

---

## Cheat sheet

| Topic | Key idea |
|---|---|
| Microservices | Small, independently deployable services, each with its own data |
| Orchestration vs choreography | Central conductor vs services reacting to events |
| API gateway | Single entry: routing, auth, rate limiting, aggregation (BFF) |
| Circuit breaker | Closed → Open (fail fast) → Half-open (trial) |
| Saga | Local transactions + compensations in reverse order |
| Load balancing | L4/L7, health checks; RR, weighted, least-conn, hashing |
| DNS LB | Different IPs per lookup; geo/latency; TTL-limited |
| CDN | Edge caches near users; origin offload |
| Anycast | Same IP from many sites; BGP picks nearest |
| Adaptive LB | Route by live latency/load; EWMA, P2C |
