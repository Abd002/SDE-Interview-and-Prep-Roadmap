# Client-Server Architecture — Basics and Communication Protocols

> **What you'll learn:** what the client-server model is, its variations (thin/thick clients, 2-tier/3-tier/n-tier, stateless vs. stateful servers), how it compares to peer-to-peer, and the main **communication protocols** clients and servers use (HTTP/REST, WebSockets, gRPC, GraphQL, message queues, raw TCP/UDP) — with C++ models.
>
> **Prerequisites:** none. For the socket-level programming view see [Network Programming](../Programming%20Languages%20and%20Concepts/Network-Programming.md#2-client-server-architecture).

## Table of Contents
1. [Basics](#1-basics)
2. [Communication protocols](#2-communication-protocols)
3. [Cheat sheet](#cheat-sheet)

---

## 1. Basics

**In one sentence:** in the client-server architecture, **clients** (browsers, apps, other services) send requests, and **servers** — centralized programs that own the data and logic — process them and send back responses.

### In plain words
A **library**: readers (clients) come with requests ("I'd like this book"); the librarian (server) owns the collection, enforces the rules (you need a library card), and hands out books. Readers never walk into the storage room themselves, and there can be thousands of readers but one well-organized library.

### How it works
**Roles**
- **Client:** initiates communication, presents data to the user, may do some validation. Examples: web browser, mobile app, CLI, another microservice.
- **Server:** listens at a known address, handles many clients concurrently, enforces security and business rules, owns shared data.

**Variations**
| Concept | Meaning |
|---|---|
| **Thin client** | Minimal logic; the server does most work (classic web pages, terminals) |
| **Thick (fat) client** | Much logic runs on the client (desktop apps, SPAs, games) |
| **2-tier** | Client ↔ database server (old desktop apps talking to a DB directly) |
| **3-tier** | Client (presentation) ↔ application server (business logic) ↔ database (data) — the web standard; see [Layered Architecture](./Layered-Architecture.md) |
| **n-tier** | More tiers: CDN, load balancer, API gateway, caches, microservices, queues… |
| **Stateless server** | Each request carries everything needed (tokens, IDs); any server instance can answer → easy horizontal scaling |
| **Stateful server** | Server remembers per-client state (game sessions, WebSocket chats) → needs sticky routing or shared state |

**Client-server vs. peer-to-peer (P2P)**
| | Client-server | Peer-to-peer |
|---|---|---|
| Roles | Fixed: client asks, server serves | Every node is both |
| Control | Centralized (easy security, consistency, updates) | Decentralized |
| Scaling | Add server capacity | Grows with the number of peers |
| Failure | Server is a critical point (mitigated by replication) | No single point of failure |
| Examples | Web, email, banking, databases | BitTorrent, blockchain, some video calls |

Advantages of client-server: centralized data and security, easier maintenance/updates, clear separation of concerns. Disadvantages: the server can become a bottleneck or single point of failure (solved with load balancing, replication, caching), and network dependency.

### Modern C++ example — a stateless server handling many clients
```cpp
// g++ -std=c++20 -pthread main.cpp && ./a.out
#include <atomic>
#include <iostream>
#include <map>
#include <mutex>
#include <string>
#include <thread>
#include <vector>

struct Request  { std::string client, auth_token, path; };
struct Response { int status; std::string body; };

class Server {                                           // owns the data and the rules
public:
    Response handle(const Request& r) {
        ++handled_;
        if (r.auth_token != "token-" + r.client) return {401, "unauthorized"};        // security centralized
        std::scoped_lock l(m_);
        if (r.path == "/balance") return {200, std::to_string(balances_[r.client])};
        return {404, "not found"};
    }
    int handled() const { return handled_; }
private:
    std::mutex m_;
    std::map<std::string, int> balances_{{"ana", 120}, {"ben", 40}};
    std::atomic<int> handled_ = 0;
};

int main() {
    Server server;
    std::vector<Response> answers(3);
    {
        std::vector<std::jthread> clients;                   // several clients at the same time
        clients.emplace_back([&] { answers[0] = server.handle({"ana", "token-ana", "/balance"}); });
        clients.emplace_back([&] { answers[1] = server.handle({"ben", "token-ben", "/balance"}); });
        clients.emplace_back([&] { answers[2] = server.handle({"eve", "stolen", "/balance"}); });
    }
    const char* names[] = {"ana", "ben", "eve"};
    for (int i = 0; i < 3; ++i) std::cout << names[i] << " <- " << answers[i].status << ' ' << answers[i].body << '\n';
    std::cout << "server handled " << server.handled() << " requests; each request was self-contained (stateless)\n";
}
```

**Output:**
```text
ana <- 200 120
ben <- 200 40
eve <- 401 unauthorized
server handled 3 requests; each request was self-contained (stateless)
```

### Interview answer
"In client-server architecture, clients initiate requests and centralized servers provide services, own data and enforce rules. Common forms are 2-, 3- and n-tier; stateless servers scale horizontally behind load balancers while stateful ones need sticky routing or shared state. It centralizes control and security at the cost of a potential bottleneck, which replication, caching and load balancing address; peer-to-peer is the decentralized alternative."

---

## 2. Communication protocols

**In one sentence:** clients and servers talk using agreed **protocols** — from general web protocols (HTTP/REST, GraphQL) to real-time channels (WebSockets, SSE), efficient RPC (gRPC) and asynchronous messaging (AMQP, Kafka) — each with different trade-offs in speed, direction and simplicity.

### In plain words
Different ways to communicate with a company: **letters** (request/response, HTTP), a **phone call that stays open** (WebSocket — both sides can talk any time), a **newsletter** (server pushes updates, SSE), an internal **direct phone line with a strict script** (gRPC), or a **mailroom** where messages are dropped off and picked up later (message queues).

### How it works
| Protocol | Style | Transport | Direction | Best for |
|---|---|---|---|---|
| **HTTP/1.1, HTTP/2, HTTP/3** | Request/response | TCP (HTTP/3: QUIC/UDP) | Client → server | Everything web ([HTTP](../Networking/HTTP.md)) |
| **REST** | Resource-oriented style over HTTP + JSON | HTTP | Client → server | Public APIs, CRUD ([REST](./REST-Explained.md)) |
| **GraphQL** | Client specifies exactly which fields it wants, one endpoint | HTTP | Client → server (+ subscriptions) | Varied frontends, avoiding over/under-fetching |
| **gRPC** | RPC with Protobuf, typed contracts, streaming | HTTP/2 | Unary + client/server/bidirectional streams | Internal microservice calls, low latency ([RPC](../Programming%20Languages%20and%20Concepts/Network-Programming.md#4-remote-procedure-call-rpc)) |
| **WebSocket** | Persistent full-duplex connection (starts as HTTP `Upgrade`) | TCP | **Both ways**, anytime | Chat, multiplayer games, collaborative editing, live trading |
| **Server-Sent Events (SSE)** | Server streams events over one HTTP response | HTTP | Server → client | Live notifications, dashboards, LLM token streaming |
| **Long polling** | Client asks; server holds the request until data exists | HTTP | Server → client (emulated) | Fallback for push |
| **AMQP / MQTT / Kafka protocol** | Asynchronous messaging via a broker | TCP | Producer → broker → consumer | Decoupled services, IoT (MQTT), event streaming ([Message Queuing](./Message-Queuing.md)) |
| **Raw TCP / UDP** | Custom binary protocols | TCP/UDP | Any | Databases, games, streaming media ([TCP vs UDP](../Networking/TCP-IP-Stack.md#3-tcp-vs-udp)) |

Choosing: public API → REST (or GraphQL for flexible clients); internal service-to-service → gRPC; real-time bidirectional → WebSocket; server push only → SSE; decoupled/asynchronous work → a message broker.

Also important: **serialization format** (JSON = readable; Protobuf/Avro/MessagePack = compact, schema-based), **TLS** for encryption, and **timeouts/retries/idempotency** on every call.

### Modern C++ example — request/response vs. polling vs. push (the difference in messages)
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <functional>
#include <iostream>
#include <string>
#include <vector>

// A stock price that changes at a few moments during 10 seconds.
const std::vector<int> price_changes_at{3, 7};

int count_polling(int every_seconds) {               // client repeatedly asks "anything new?"
    int requests = 0;
    for (int t = 0; t < 10; t += every_seconds) ++requests;
    return requests;
}

class PushChannel {                                   // WebSocket/SSE style: server sends when data changes
public:
    void on_message(std::function<void(int)> f) { handler_ = std::move(f); }
    void server_update(int t) { ++messages_; handler_(t); }
    int messages() const { return messages_; }
private:
    std::function<void(int)> handler_;
    int messages_ = 0;
};

int main() {
    std::cout << "polling every 1s:  " << count_polling(1) << " requests, updates seen up to 1s late\n";
    std::cout << "polling every 5s:  " << count_polling(5) << " requests, updates seen up to 5s late\n";

    PushChannel ws;
    ws.on_message([](int t) { std::cout << "  push received at t=" << t << "s (instantly)\n"; });
    for (int t : price_changes_at) ws.server_update(t);
    std::cout << "push (WebSocket/SSE): " << ws.messages() << " messages, zero delay\n";
}
```

**Output:**
```text
polling every 1s:  10 requests, updates seen up to 1s late
polling every 5s:  2 requests, updates seen up to 5s late
  push received at t=3s (instantly)
  push received at t=7s (instantly)
push (WebSocket/SSE): 2 messages, zero delay
```

### Interview answer
"Client-server communication is usually HTTP request/response — REST for resource APIs, GraphQL for client-shaped queries, gRPC with Protobuf over HTTP/2 for efficient typed internal calls. For real-time needs, WebSockets provide full-duplex persistent connections and SSE provides server push, replacing inefficient polling. Asynchronous, decoupled communication goes through message brokers using AMQP, MQTT or Kafka. The choice depends on direction, latency, payload efficiency and coupling."

---

## Cheat sheet

| Term | One-liner |
|---|---|
| Client / server | Initiates requests / serves and owns data |
| Thin vs thick client | Logic on server vs on client |
| 2/3/n-tier | Number of separated layers (client, app, DB, …) |
| Stateless server | Scales horizontally; state in tokens/DB/cache |
| P2P | Every node both client and server |
| REST / GraphQL / gRPC | Resources over HTTP / query language / typed RPC over HTTP/2 |
| WebSocket / SSE | Bidirectional persistent / server → client stream |
| Message broker | Asynchronous, decoupled communication |
