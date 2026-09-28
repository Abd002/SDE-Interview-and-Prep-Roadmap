# HTTP — The Language of the Web

> **What you'll learn:** what HTTP is, what a request and a response look like, the **request methods** (GET, POST, PUT, PATCH, DELETE, …) and the **status codes** (200, 404, 500, …). You'll also build a tiny working HTTP server and client in C++.
>
> **Prerequisites:** [TCP/IP Stack](./TCP-IP-Stack.md) (what TCP is).

## Table of Contents
0. [HTTP basics: requests, responses and headers](#0-http-basics-requests-responses-and-headers)
1. [Request methods (GET, POST, etc.)](#1-request-methods-get-post-etc)
2. [Status codes](#2-status-codes)
3. [HTTP versions and HTTPS in one page](#3-http-versions-and-https-in-one-page)
4. [Cheat sheet](#cheat-sheet)

---

## 0. HTTP basics: requests, responses and headers

**In one sentence:** HTTP (HyperText Transfer Protocol) is a simple text-based conversation where a **client** sends a **request** ("please give me this page") and a **server** sends back a **response** ("here it is" or "not found").

### In plain words
Ordering at a restaurant counter:
- **You (client/browser):** "I'd like *(method: GET)* the menu item *(path: /pizza)*. By the way, I'm allergic to nuts *(header)*."
- **Waiter (server):** "Here you go *(status: 200 OK)*. It's hot *(header)*." — and hands you the pizza *(body)*.

Each order is independent: the waiter doesn't remember you between orders. That's what **stateless** means. Websites remember you (like a login) using **cookies** — a ticket number you show with every request.

### How it works
A request, as it literally travels over TCP:
```http
POST /api/users HTTP/1.1          <- request line: METHOD  PATH  VERSION
Host: example.com                 <- headers: "Name: value" lines
Content-Type: application/json
Content-Length: 27
                                  <- empty line = end of headers
{"name":"Ana","age":30}           <- body (optional)
```
A response:
```http
HTTP/1.1 201 Created              <- status line: VERSION  CODE  REASON
Content-Type: application/json
Location: /api/users/42
Content-Length: 9

{"id":42}
```
Important parts:
- **URL:** `https://example.com:443/api/users?page=2#top` = scheme `https`, host `example.com`, port `443`, path `/api/users`, query string `page=2`, fragment `#top` (fragment never leaves the browser).
- **Headers** you'll see often: `Host`, `Content-Type`, `Content-Length`, `Authorization`, `Cookie` / `Set-Cookie`, `Cache-Control`, `Accept`, `User-Agent`.
- **Body:** the actual data (HTML, JSON, image bytes…).

### Modern C++ example — a real mini HTTP server and client (Linux/macOS)
```cpp
// g++ -std=c++20 -pthread main.cpp && ./a.out      (Linux/macOS)
#include <arpa/inet.h>
#include <array>
#include <iostream>
#include <netinet/in.h>
#include <string>
#include <sys/socket.h>
#include <thread>
#include <unistd.h>

std::string read_all(int fd) {
    std::string data;
    std::array<char, 1024> buf{};
    ssize_t n;
    while ((n = ::recv(fd, buf.data(), buf.size(), 0)) > 0) {
        data.append(buf.data(), n);
        if (data.find("\r\n\r\n") != std::string::npos) break;   // got all headers (no body here)
    }
    return data;
}

int main() {
    int listener = ::socket(AF_INET, SOCK_STREAM, 0);
    sockaddr_in addr{};
    addr.sin_family = AF_INET;
    addr.sin_addr.s_addr = htonl(INADDR_LOOPBACK);
    addr.sin_port = 0;                                            // any free port
    ::bind(listener, reinterpret_cast<sockaddr*>(&addr), sizeof addr);
    socklen_t len = sizeof addr;
    ::getsockname(listener, reinterpret_cast<sockaddr*>(&addr), &len);
    ::listen(listener, 1);

    std::jthread server([&] {
        int conn = ::accept(listener, nullptr, nullptr);
        std::string request = read_all(conn);
        std::string first_line = request.substr(0, request.find("\r\n"));
        std::cout << "[server] got request line: " << first_line << '\n';

        std::string body = "<h1>Hello from C++</h1>";
        std::string response = "HTTP/1.1 200 OK\r\n"
                               "Content-Type: text/html\r\n"
                               "Content-Length: " + std::to_string(body.size()) + "\r\n"
                               "Connection: close\r\n\r\n" + body;
        ::send(conn, response.data(), response.size(), 0);
        ::close(conn);
    });

    int client = ::socket(AF_INET, SOCK_STREAM, 0);
    ::connect(client, reinterpret_cast<sockaddr*>(&addr), sizeof addr);
    std::string request = "GET /hello HTTP/1.1\r\nHost: localhost\r\n\r\n";
    ::send(client, request.data(), request.size(), 0);

    server.join();                                                // response fully sent
    std::string response;
    std::array<char, 1024> buf{};
    ssize_t n;
    while ((n = ::recv(client, buf.data(), buf.size(), 0)) > 0) response.append(buf.data(), n);
    std::cout << "[client] status line: " << response.substr(0, response.find("\r\n")) << '\n';
    std::cout << "[client] body: " << response.substr(response.find("\r\n\r\n") + 4) << '\n';
    ::close(client);
    ::close(listener);
}
```

**Output:**
```text
[server] got request line: GET /hello HTTP/1.1
[client] status line: HTTP/1.1 200 OK
[client] body: <h1>Hello from C++</h1>
```
That's all a web server fundamentally is. Real servers (nginx, Boost.Beast, Drogon) add parsing, concurrency, TLS and much more.

### Common mistakes
- Forgetting HTTP lines end with `\r\n` (carriage return + line feed), not just `\n`.
- Thinking HTTP "remembers" users. Sessions are built on top with cookies/tokens.

### Interview answer
"HTTP is a stateless, request/response application-layer protocol, traditionally over TCP. A request has a method, a target, headers and an optional body; a response has a status code, headers and a body. State such as login sessions is layered on top with cookies or tokens."

---

## 1. Request methods (GET, POST, etc.)

**In one sentence:** the method (or "verb") says *what you want to do* with the resource at the URL — read it, create something, replace it, change part of it, or delete it.

### In plain words
Think of a library catalog entry `/books/42`:
- **GET** — "Show me book 42." (just looking)
- **POST** — "Here's a new book, please add it to the collection." (the library picks its number)
- **PUT** — "Put *this exact book* at slot 42, replacing whatever is there."
- **PATCH** — "In book 42, just fix the title."
- **DELETE** — "Remove book 42."
- **HEAD** — "Tell me about book 42 (size, date) but don't give me the book itself."
- **OPTIONS** — "What am I allowed to do with book 42?"

### How it works
Two properties interviewers love:
- **Safe:** the request doesn't change anything on the server (read-only).
- **Idempotent:** doing it once or ten times has the **same effect** on the server. Important because networks fail and clients *retry*.

| Method | Purpose | Safe | Idempotent | Has body? |
|---|---|---|---|---|
| GET | Read a resource | ✅ | ✅ | No (in practice) |
| HEAD | Like GET but headers only | ✅ | ✅ | No |
| OPTIONS | Ask which methods are allowed (used by CORS "preflight") | ✅ | ✅ | Rarely |
| POST | Create / trigger an action | ❌ | ❌ | Yes |
| PUT | Create or **fully replace** at a known URL | ❌ | ✅ | Yes |
| PATCH | **Partially** update | ❌ | ❌ (not guaranteed) | Yes |
| DELETE | Remove | ❌ | ✅ | Usually no |

Why is DELETE idempotent even though the second call returns 404? Because the *server state* after one or many DELETEs is the same: the item is gone.

Why is POST not idempotent? Sending "create an order" twice creates **two** orders. APIs fix this with an **idempotency key** header so retries are recognized.

### Modern C++ example — a tiny REST-style router
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <format>
#include <iostream>
#include <map>
#include <string>

struct Response { int status; std::string body; };

class BookApi {
public:
    Response handle(const std::string& method, int id, const std::string& body = "") {
        if (method == "GET") {
            auto it = books_.find(id);
            if (it == books_.end()) return {404, "not found"};
            return {200, it->second};
        }
        if (method == "POST") {                       // server chooses the id
            int new_id = next_id_++;
            books_[new_id] = body;
            return {201, std::format("created /books/{}", new_id)};
        }
        if (method == "PUT") {                        // client chooses the id; full replace
            bool existed = books_.contains(id);
            books_[id] = body;
            return {existed ? 200 : 201, "stored"};
        }
        if (method == "PATCH") {
            auto it = books_.find(id);
            if (it == books_.end()) return {404, "not found"};
            it->second += " " + body;                 // partial change (append a note)
            return {200, it->second};
        }
        if (method == "DELETE") {
            return books_.erase(id) ? Response{204, ""} : Response{404, "not found"};
        }
        return {405, "method not allowed"};
    }
    std::size_t size() const { return books_.size(); }

private:
    std::map<int, std::string> books_;
    int next_id_ = 1;
};

void show(const std::string& call, const Response& r) {
    std::cout << std::format("{:<22} -> {} {}\n", call, r.status, r.body);
}

int main() {
    BookApi api;
    show("POST /books Dune", api.handle("POST", 0, "Dune"));
    show("POST /books Dune", api.handle("POST", 0, "Dune"));    // NOT idempotent: 2 books now
    show("PUT /books/7 Emma", api.handle("PUT", 7, "Emma"));
    show("PUT /books/7 Emma", api.handle("PUT", 7, "Emma"));    // idempotent: still 1 book at 7
    show("PATCH /books/7 (2nd ed)", api.handle("PATCH", 7, "(2nd ed)"));
    show("GET /books/7", api.handle("GET", 7));
    show("DELETE /books/7", api.handle("DELETE", 7));
    show("DELETE /books/7", api.handle("DELETE", 7));          // same final state: gone
    show("TRACE /books/1", api.handle("TRACE", 1));
    std::cout << "books stored: " << api.size() << '\n';
}
```

**Output:**
```text
POST /books Dune       -> 201 created /books/1
POST /books Dune       -> 201 created /books/2
PUT /books/7 Emma      -> 201 stored
PUT /books/7 Emma      -> 200 stored
PATCH /books/7 (2nd ed) -> 200 Emma (2nd ed)
GET /books/7           -> 200 Emma (2nd ed)
DELETE /books/7        -> 204
DELETE /books/7        -> 404 not found
TRACE /books/1         -> 405 method not allowed
books stored: 2
```

### Common mistakes
- Using GET to change data (`GET /deleteUser?id=5`). Crawlers, prefetchers and caches assume GET is safe and will happily "click" it.
- Confusing PUT (full replacement) with PATCH (partial update).
- Putting sensitive data in GET query strings — they end up in logs and browser history.

### Interview answer
"GET, HEAD and OPTIONS are safe; GET, HEAD, OPTIONS, PUT and DELETE are idempotent; POST is neither, and PATCH isn't guaranteed idempotent. PUT replaces a resource at a client-known URI, POST creates under a collection or triggers processing, PATCH applies a partial update. Idempotency matters because clients and proxies retry."

---

## 2. Status codes

**In one sentence:** a status code is a 3-digit number in every response that tells the client, at a glance, whether the request worked and if not, whose fault it was.

### In plain words
The first digit is the category — like a traffic light with five colors:
- **1xx — "Hold on…"** (informational)
- **2xx — "Done! ✅"** (success)
- **3xx — "It's over there ➡️"** (redirect)
- **4xx — "You made a mistake 🙋"** (client error)
- **5xx — "We made a mistake 🔥"** (server error)

### How it works
The ones worth memorizing:
| Code | Name | When |
|---|---|---|
| 100 | Continue | Server says "go ahead, send the (large) body" |
| 101 | Switching Protocols | Upgrading to WebSocket |
| **200** | OK | Success with a body |
| **201** | Created | POST/PUT created something (often with a `Location` header) |
| 202 | Accepted | Accepted for later processing (async job) |
| **204** | No Content | Success, nothing to return (common for DELETE) |
| **301** | Moved Permanently | URL changed forever (browsers/SEO update) |
| **302** | Found | Temporary redirect |
| **304** | Not Modified | Your cached copy is still fresh (conditional GET with `If-None-Match`/ETag) |
| 307 / 308 | Temporary / Permanent Redirect | Like 302/301 but the method must not change |
| **400** | Bad Request | Malformed request / invalid JSON / validation failed |
| **401** | Unauthorized | You're not **authenticated** (who are you? — log in) |
| **403** | Forbidden | Authenticated, but not **allowed** (you can't do this) |
| **404** | Not Found | No such resource |
| 405 | Method Not Allowed | e.g. DELETE on a read-only resource |
| **409** | Conflict | Clashes with current state (duplicate username, version conflict) |
| 422 | Unprocessable Content | Syntax OK but semantically invalid |
| **429** | Too Many Requests | Rate limited — slow down (see `Retry-After`) |
| **500** | Internal Server Error | Generic server bug/crash |
| **502** | Bad Gateway | A proxy/load balancer got a bad response from the server behind it |
| **503** | Service Unavailable | Overloaded or down for maintenance |
| **504** | Gateway Timeout | The proxy waited too long for the server behind it |

**Retry rule of thumb:** 4xx → fix the request, don't blindly retry (except 408/429). 5xx (especially 502/503/504) → retry with exponential backoff, if the method is idempotent.

### Modern C++ example — classify codes and decide whether to retry
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <format>
#include <iostream>
#include <string_view>

enum class Category { Informational, Success, Redirect, ClientError, ServerError, Invalid };

constexpr Category categorize(int code) {
    switch (code / 100) {
        case 1: return Category::Informational;
        case 2: return Category::Success;
        case 3: return Category::Redirect;
        case 4: return Category::ClientError;
        case 5: return Category::ServerError;
        default: return Category::Invalid;
    }
}

constexpr std::string_view name(Category c) {
    switch (c) {
        case Category::Informational: return "informational";
        case Category::Success: return "success";
        case Category::Redirect: return "redirect";
        case Category::ClientError: return "client error";
        case Category::ServerError: return "server error";
        case Category::Invalid: return "invalid";
    }
    return "?";
}

constexpr bool should_retry(int code) {
    return code == 408 || code == 429 || code == 502 || code == 503 || code == 504;
}

static_assert(categorize(404) == Category::ClientError);   // checked at compile time!

int main() {
    for (int code : {200, 201, 304, 401, 403, 404, 429, 500, 503}) {
        std::cout << std::format("{} -> {:<13} retry: {}\n",
                                 code, name(categorize(code)), should_retry(code) ? "yes" : "no");
    }
}
```

**Output:**
```text
200 -> success       retry: no
201 -> success       retry: no
304 -> redirect      retry: no
401 -> client error  retry: no
403 -> client error  retry: no
404 -> client error  retry: no
429 -> client error  retry: yes
500 -> server error  retry: no
503 -> server error  retry: yes
```
(500 usually means a bug; retrying rarely helps, though some clients do retry once.)

### Common mistakes
- Returning `200 OK` with `{"error": "..."}` in the body. Clients, monitoring and caches rely on the status code.
- Mixing up **401** (not logged in) and **403** (logged in but not allowed).
- Returning 500 for bad user input — that's a 400/422.

### Interview answer
"Status codes are grouped by first digit: 1xx informational, 2xx success, 3xx redirection, 4xx client errors, 5xx server errors. Key ones are 200, 201, 204, 301/302/304, 400, 401 vs 403, 404, 409, 429, 500, 502, 503, 504. Clients should retry idempotent requests on 429/502/503/504 with backoff, not on most 4xx."

---

## 3. HTTP versions and HTTPS in one page

| Version | Big idea |
|---|---|
| HTTP/1.0 | One request per TCP connection |
| HTTP/1.1 | **Keep-alive** (reuse connections), `Host` header, chunked transfer; but one request at a time per connection (**head-of-line blocking**) |
| HTTP/2 | Binary framing, **multiplexing** many requests over one TCP connection, header compression (HPACK), server push (now rarely used) |
| HTTP/3 | Runs on **QUIC over UDP**: no TCP head-of-line blocking, faster connection setup (0-RTT/1-RTT), built-in TLS 1.3, survives network changes (Wi-Fi → 4G) |

**HTTPS** = HTTP inside **TLS**. TLS gives:
1. **Encryption** — eavesdroppers see gibberish.
2. **Integrity** — tampering is detected.
3. **Authentication** — a **certificate** signed by a trusted Certificate Authority proves the server really is `example.com`.

---

## Cheat sheet

| Topic | Remember |
|---|---|
| Request | `METHOD /path HTTP/1.1` + headers + blank line + body |
| Response | `HTTP/1.1 CODE Reason` + headers + blank line + body |
| Safe methods | GET, HEAD, OPTIONS |
| Idempotent | GET, HEAD, OPTIONS, PUT, DELETE |
| PUT vs PATCH | Full replacement vs partial update |
| 2xx/3xx/4xx/5xx | Success / redirect / your fault / server's fault |
| 401 vs 403 | Not authenticated vs not authorized |
| Stateless | Each request stands alone; cookies/tokens add sessions |

**Next:** [DNS](./DNS.md) — how `example.com` becomes an IP address.
