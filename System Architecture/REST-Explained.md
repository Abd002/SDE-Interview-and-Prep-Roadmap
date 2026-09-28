# RESTful Architecture — Explained for Beginners

> **What you'll learn:** what REST is, its six architectural **constraints**, how to design a clean REST API (resources, URLs, HTTP methods, status codes, idempotency, pagination, versioning, HATEOAS), how REST compares to RPC/gRPC and GraphQL, and a small C++ REST-style router.
>
> **Prerequisites:** [HTTP](../Networking/HTTP.md) (methods and status codes). A longer reference: [RESTfulArchitecture.md](../System%20Design/RESTfulArchitecture.md).

## Table of Contents
1. [What is REST?](#1-what-is-rest)
2. [The six REST constraints](#2-the-six-rest-constraints)
3. [Designing a REST API](#3-designing-a-rest-api)
4. [Modern C++ example: a REST-style router](#4-modern-c-example-a-rest-style-router)
5. [REST vs. RPC/gRPC vs. GraphQL](#5-rest-vs-rpcgrpc-vs-graphql)
6. [Cheat sheet](#cheat-sheet)

---

## 1. What is REST?

**In one sentence:** REST (**RE**presentational **S**tate **T**ransfer) is an architectural style for web APIs in which everything is a **resource** identified by a URL, and clients manipulate resources through **standard HTTP methods**, exchanging **representations** (usually JSON).

### In plain words
Think of a website as a big library catalog where **every item has an address** (`/books/42`). You don't call special functions like `getBookDetailsById(42)` or `removeBookFromShelf(42)`; you use a few universal verbs everyone understands: **GET** it, **POST** a new one, **PUT/PATCH** to change it, **DELETE** it. Any client that speaks HTTP — browser, phone, script — already knows how to talk to it.

- **Resource:** a thing (user, order, photo) — a noun.
- **Representation:** the resource's current state in some format (JSON, XML, HTML).
- **State transfer:** the client gets and sends representations to read and change state.

Coined by Roy Fielding in his 2000 PhD dissertation; it describes how the web itself works.

---

## 2. The six REST constraints

**In one sentence:** an API is truly RESTful when it follows six constraints — client-server, statelessness, cacheability, uniform interface, layered system, and (optionally) code on demand.

### How it works
| Constraint | Meaning | Why it matters |
|---|---|---|
| **1. Client–server** | UI and data storage are separated | Each evolves independently |
| **2. Stateless** | Every request contains everything needed (auth token, IDs); the server keeps **no session state between requests** | Any server instance can handle any request → easy scaling and failover |
| **3. Cacheable** | Responses say whether/how long they can be cached (`Cache-Control`, `ETag`) | Fewer requests, lower latency |
| **4. Uniform interface** | Resources identified by URIs; manipulated via representations; **self-descriptive messages** (methods, status codes, media types); **HATEOAS** (responses include links to related actions) | Generic clients, loose coupling |
| **5. Layered system** | Client can't tell if it talks to the server or an intermediary (load balancer, cache, gateway) | Add CDNs, proxies, security layers transparently |
| **6. Code on demand** (optional) | Server can send executable code (JavaScript) | Extend clients dynamically |

**HATEOAS** (Hypermedia As The Engine Of Application State) example — the response tells the client what it can do next:
```json
{
  "id": 42, "status": "pending", "total": 59.99,
  "links": {
    "self":   { "href": "/orders/42" },
    "pay":    { "href": "/orders/42/payment", "method": "POST" },
    "cancel": { "href": "/orders/42", "method": "DELETE" }
  }
}
```
(Few real-world APIs implement HATEOAS fully; most are "REST-ish" — resource-oriented HTTP + JSON. The **Richardson Maturity Model** rates APIs from level 0 (one endpoint, RPC over HTTP) to level 3 (HATEOAS).)

---

## 3. Designing a REST API

### URLs: nouns, plural, hierarchical
```
GET    /users                  list users
POST   /users                  create a user            -> 201 Created + Location: /users/7
GET    /users/7                get one user              -> 200 / 404
PUT    /users/7                replace user 7            -> 200 / 204
PATCH  /users/7                partially update user 7   -> 200
DELETE /users/7                delete user 7             -> 204
GET    /users/7/orders         orders of user 7 (sub-resource)
GET    /orders?status=paid&sort=-created_at&limit=20      filtering, sorting, pagination
```
Avoid verbs in URLs (`/getUser`, `/deleteOrder`); the **method** is the verb. For actions that aren't CRUD, model them as resources (`POST /orders/42/refunds`) or, sparingly, sub-actions (`POST /orders/42:cancel`).

### Methods, status codes and idempotency
- Use methods by meaning; GET must be **safe**; PUT and DELETE must be **idempotent** (repeat-safe). POST isn't — support an `Idempotency-Key` header for payments so retries don't double-charge.
- Return accurate **status codes**: 200, 201 (+ `Location`), 204, 400/422 validation, 401 vs 403, 404, 409 conflict, 429 rate limited, 5xx server errors. Details in [HTTP](../Networking/HTTP.md#2-status-codes).
- Consistent **error body**, e.g. RFC 9457 "problem details": `{"type": "...", "title": "Invalid email", "status": 422, "detail": "..."}`.

### Pagination
| Style | Request | Pros / cons |
|---|---|---|
| Offset | `?limit=20&offset=40` | Simple; slow for deep pages; duplicates/skips when data changes |
| **Cursor / keyset** | `?limit=20&after=eyJpZCI6NDB9` | Stable and fast at any depth; no "jump to page 57" |

### Versioning
`/v1/users` (URL — most common and explicit), `Accept: application/vnd.example.v2+json` (header), or never break clients (additive changes only). Never remove or rename fields in place.

### Other good practices
- **Filtering/sorting/field selection** via query params (`?fields=id,name`).
- **Caching:** `ETag` + `If-None-Match` → `304 Not Modified`; `Cache-Control`.
- **Concurrency:** `If-Match` with ETag to avoid lost updates → `412 Precondition Failed`.
- **Security:** HTTPS only, OAuth2/JWT bearer tokens, rate limiting, input validation.
- **Documentation:** OpenAPI (Swagger) spec.

---

## 4. Modern C++ example: a REST-style router

A tiny in-memory REST API for `/books`: path parameters, methods, status codes, `Location`, `ETag`/conditional GET, and cursor pagination.

```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <format>
#include <functional>
#include <iostream>
#include <map>
#include <optional>
#include <string>

struct Request  { std::string method, path, body, if_none_match; std::map<std::string, std::string> query; };
struct Response { int status; std::string body; std::map<std::string, std::string> headers; };

class BooksApi {
public:
    Response handle(const Request& r) {
        if (r.path == "/books" && r.method == "GET")  return list(r);
        if (r.path == "/books" && r.method == "POST") return create(r);
        if (auto id = id_from(r.path)) {
            if (r.method == "GET")    return get(*id, r);
            if (r.method == "PUT")    return replace(*id, r);
            if (r.method == "DELETE") return books_.erase(*id) ? Response{204, "", {}} : Response{404, R"({"error":"not found"})", {}};
            return {405, R"({"error":"method not allowed"})", {{"Allow", "GET, PUT, DELETE"}}};
        }
        return {404, R"({"error":"no such resource"})", {}};
    }
private:
    static std::optional<int> id_from(const std::string& path) {          // "/books/7" -> 7
        if (!path.starts_with("/books/")) return std::nullopt;
        try { return std::stoi(path.substr(7)); } catch (...) { return std::nullopt; }
    }
    static std::string etag(const std::string& body) { return '"' + std::to_string(std::hash<std::string>{}(body) % 100000) + '"'; }

    Response create(const Request& r) {
        int id = next_id_++;
        books_[id] = r.body;
        return {201, std::format(R"({{"id":{},"title":"{}"}})", id, r.body), {{"Location", "/books/" + std::to_string(id)}}};
    }
    Response get(int id, const Request& r) {
        auto it = books_.find(id);
        if (it == books_.end()) return {404, R"({"error":"not found"})", {}};
        std::string body = std::format(R"({{"id":{},"title":"{}"}})", id, it->second);
        std::string tag = etag(body);
        if (r.if_none_match == tag) return {304, "", {{"ETag", tag}}};      // client's copy is still fresh
        return {200, body, {{"ETag", tag}}};
    }
    Response replace(int id, const Request& r) {
        bool existed = books_.contains(id);
        books_[id] = r.body;                                               // idempotent full replace
        return {existed ? 200 : 201, std::format(R"({{"id":{},"title":"{}"}})", id, r.body), {}};
    }
    Response list(const Request& r) {                                      // cursor pagination: ?after=ID&limit=N
        int after = r.query.contains("after") ? std::stoi(r.query.at("after")) : 0;
        int limit = r.query.contains("limit") ? std::stoi(r.query.at("limit")) : 2;
        std::string items;
        int last = after, count = 0;
        for (auto it = books_.upper_bound(after); it != books_.end() && count < limit; ++it, ++count) {
            items += (count ? "," : "") + std::format(R"({{"id":{},"title":"{}"}})", it->first, it->second);
            last = it->first;
        }
        bool more = books_.upper_bound(last) != books_.end();
        std::string next = more ? std::format(R"("/books?after={}&limit={}")", last, limit) : "null";
        return {200, std::format(R"({{"items":[{}],"next":{}}})", items, next), {}};
    }
    std::map<int, std::string> books_;
    int next_id_ = 1;
};

void show(const std::string& call, const Response& r) {
    std::cout << call << "\n  -> " << r.status << ' ' << r.body;
    for (const auto& [k, v] : r.headers) std::cout << "  [" << k << ": " << v << ']';
    std::cout << '\n';
}

int main() {
    BooksApi api;
    for (const char* t : {"Dune", "Emma", "Ulysses"}) api.handle({"POST", "/books", t, "", {}});

    show("POST /books  body=Hamlet", api.handle({"POST", "/books", "Hamlet", "", {}}));
    auto first = api.handle({"GET", "/books/1", "", "", {}});
    show("GET /books/1", first);
    show("GET /books/1  If-None-Match: <etag>", api.handle({"GET", "/books/1", "", first.headers["ETag"], {}}));
    show("GET /books?limit=2", api.handle({"GET", "/books", "", "", {{"limit", "2"}}}));
    show("GET /books?after=2&limit=2", api.handle({"GET", "/books", "", "", {{"after", "2"}, {"limit", "2"}}}));
    show("PATCH /books/1", api.handle({"PATCH", "/books/1", "x", "", {}}));
    show("DELETE /books/2", api.handle({"DELETE", "/books/2", "", "", {}}));
    show("GET /books/2", api.handle({"GET", "/books/2", "", "", {}}));
}
```

**Output (may vary):**
```text
POST /books  body=Hamlet
  -> 201 {"id":4,"title":"Hamlet"}  [Location: /books/4]
GET /books/1
  -> 200 {"id":1,"title":"Dune"}  [ETag: "94549"]
GET /books/1  If-None-Match: <etag>
  -> 304   [ETag: "94549"]
GET /books?limit=2
  -> 200 {"items":[{"id":1,"title":"Dune"},{"id":2,"title":"Emma"}],"next":"/books?after=2&limit=2"}
GET /books?after=2&limit=2
  -> 200 {"items":[{"id":3,"title":"Ulysses"},{"id":4,"title":"Hamlet"}],"next":null}
PATCH /books/1
  -> 405 {"error":"method not allowed"}  [Allow: GET, PUT, DELETE]
DELETE /books/2
  -> 204 
GET /books/2
  -> 404 {"error":"not found"}
```
(The ETag value depends on your standard library's hash function.)

---

## 5. REST vs. RPC/gRPC vs. GraphQL

| | REST | RPC / gRPC | GraphQL |
|---|---|---|---|
| Model | Resources (nouns) + HTTP verbs | Actions/procedures (`CreateOrder`) | One endpoint; client queries a typed graph |
| Format | JSON (text) | Protobuf (binary), strongly typed contracts | JSON |
| Transport | HTTP/1.1–3 | HTTP/2 (streaming) | HTTP |
| Caching | Excellent (HTTP caches, ETags) | Harder | Harder (usually POST) |
| Over/under-fetching | Common | Precise per method | Solved — client picks fields |
| Browser friendly | Yes | Needs gRPC-Web proxy | Yes |
| Best for | Public APIs, CRUD, web | Internal service-to-service, low latency, streaming | Many client types with different data needs |

### Interview answer
"REST is an architectural style where resources are identified by URIs and manipulated through a uniform interface of standard HTTP methods and representations, under constraints of client-server separation, statelessness, cacheability, layered systems, a uniform interface including HATEOAS, and optional code on demand. Good REST APIs use plural nouns, correct methods and status codes, idempotency, cursor pagination, versioning, ETags and OpenAPI docs. I use REST for public CRUD APIs, gRPC for internal low-latency calls, and GraphQL when many clients need differently shaped data."

---

## Cheat sheet

| Topic | Rule of thumb |
|---|---|
| URLs | Plural nouns, hierarchy: `/users/7/orders` |
| Methods | GET read, POST create, PUT replace, PATCH partial, DELETE remove |
| Stateless | Every request self-contained (token, IDs) |
| Status codes | 200/201/204, 400/401/403/404/409/422/429, 5xx |
| Idempotency | PUT/DELETE repeat-safe; POST + Idempotency-Key |
| Pagination | Cursor/keyset for large or changing data |
| Caching | Cache-Control, ETag + If-None-Match → 304 |
| Versioning | `/v1/...` or media-type; only additive changes in place |
| HATEOAS | Responses include links to next actions |
