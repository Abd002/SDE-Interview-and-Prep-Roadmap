# Client-Server Architecture — Basics and Communication Protocols

> **What you'll learn:** what the client-server model is, its variations (thin/thick clients, 2-tier/3-tier/n-tier, stateless vs. stateful servers), how it compares to peer-to-peer, and the main **communication protocols** clients and servers use (HTTP/REST, WebSockets, gRPC, GraphQL, message queues, raw TCP/UDP).
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
