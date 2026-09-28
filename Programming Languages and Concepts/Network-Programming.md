# Network Programming — Sockets, Client-Server, TCP/UDP and RPC

> **What you'll learn:** how programs talk over a network using **sockets**, how the **client-server** model works, how to use **TCP and UDP** from code (including message framing), and how **Remote Procedure Calls (RPC)** make a network call look like a normal function call — all with runnable C++ (POSIX sockets).
>
> **Prerequisites:** [TCP/IP Stack](../Networking/TCP-IP-Stack.md) (what TCP, UDP, IP and ports are).
>
> Examples use POSIX sockets: **Linux/macOS** (on Windows use WSL, or Winsock which is very similar). Each program runs its server and client in the same process over `127.0.0.1`, so it works without any setup.

## Table of Contents
1. [Sockets](#1-sockets)
2. [Client-server architecture](#2-client-server-architecture)
3. [Protocols (TCP, UDP) in code](#3-protocols-tcp-udp-in-code)
4. [Remote Procedure Call (RPC)](#4-remote-procedure-call-rpc)
5. [Cheat sheet](#cheat-sheet)

---

## 1. Sockets

**In one sentence:** a socket is an **endpoint** for network communication — a handle your program gets from the OS, which you read from and write to much like a file, but the bytes travel to another program (possibly on another computer).

### In plain words
A socket is a **telephone** for your program.
- The **server** installs a phone with a known number (**IP address + port**), and waits for calls (`listen`/`accept`).
- The **client** picks up its phone and dials that number (`connect`).
- Once connected, both can talk (`send`) and listen (`recv`) until someone hangs up (`close`).

### How it works
The TCP socket lifecycle:
```
        SERVER                                   CLIENT
   socket()   create the phone
   bind()     give it a number (IP:port)
   listen()   start accepting calls
   accept()   <── waits ──────────────────── socket()
              <─────── 3-way handshake ────── connect()  dial
   recv()/send()  <═══════ data ══════════>   send()/recv()
   close()                                    close()
```
Key facts:
- A socket is identified by the 5-tuple **(protocol, local IP, local port, remote IP, remote port)** — so one server port can have thousands of simultaneous connections.
- On Unix a socket is a **file descriptor** (a small integer).
- `accept` returns a **new** socket for each client; the listening socket keeps listening.
- Calls like `accept`/`recv` **block** by default. Servers handle many clients with threads, or with non-blocking sockets + an event loop (`epoll` on Linux, `kqueue` on macOS, IOCP on Windows — used by libraries like Boost.Asio).
- **Byte order:** network protocols use big-endian; convert with `htons`/`htonl` (host-to-network) and back with `ntohs`/`ntohl`.

### Modern C++ example — an RAII socket and a multi-client echo server
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
#include <utility>
#include <vector>

// RAII wrapper: the socket is always closed, even on errors/exceptions.
class Socket {
public:
    explicit Socket(int fd = -1) : fd_(fd) {}
    ~Socket() { if (fd_ >= 0) ::close(fd_); }
    Socket(Socket&& o) noexcept : fd_(std::exchange(o.fd_, -1)) {}
    Socket& operator=(Socket&& o) noexcept { std::swap(fd_, o.fd_); return *this; }
    int fd() const { return fd_; }
private:
    int fd_;
};

sockaddr_in loopback(std::uint16_t port) {
    sockaddr_in a{};
    a.sin_family = AF_INET;
    a.sin_port = htons(port);
    a.sin_addr.s_addr = htonl(INADDR_LOOPBACK);
    return a;
}

int main() {
    // --- server: socket -> bind -> listen ---
    Socket listener(::socket(AF_INET, SOCK_STREAM, 0));
    sockaddr_in addr = loopback(0);                          // port 0: OS picks a free port
    ::bind(listener.fd(), reinterpret_cast<sockaddr*>(&addr), sizeof addr);
    socklen_t len = sizeof addr;
    ::getsockname(listener.fd(), reinterpret_cast<sockaddr*>(&addr), &len);
    ::listen(listener.fd(), 16);
    std::cout << "server listening on 127.0.0.1:" << ntohs(addr.sin_port) << '\n';

    std::jthread server([&] {
        std::vector<std::jthread> handlers;
        for (int i = 0; i < 3; ++i) {                        // serve 3 clients, one thread each
            Socket conn(::accept(listener.fd(), nullptr, nullptr));
            handlers.emplace_back([c = std::move(conn)] {
                std::array<char, 256> buf{};
                ssize_t n = ::recv(c.fd(), buf.data(), buf.size(), 0);
                std::string reply = "echo: " + std::string(buf.data(), n);
                ::send(c.fd(), reply.data(), reply.size(), 0);
            });
        }
    });

    // --- clients: socket -> connect -> send -> recv ---
    std::vector<std::string> replies(3);
    {
        std::vector<std::jthread> clients;
        for (int i = 0; i < 3; ++i) {
            clients.emplace_back([&, i] {
                Socket s(::socket(AF_INET, SOCK_STREAM, 0));
                ::connect(s.fd(), reinterpret_cast<sockaddr*>(&addr), sizeof addr);
                std::string msg = "hello from client " + std::to_string(i);
                ::send(s.fd(), msg.data(), msg.size(), 0);
                std::array<char, 256> buf{};
                ssize_t n = ::recv(s.fd(), buf.data(), buf.size(), 0);
                replies[i] = std::string(buf.data(), n);
            });
        }
    }
    for (const auto& r : replies) std::cout << r << '\n';
}
```

**Output (may vary):**
```text
server listening on 127.0.0.1:40123
echo: hello from client 0
echo: hello from client 1
echo: hello from client 2
```
(The port number changes each run.)

### Common mistakes
- Forgetting `htons` on the port → you're listening on a different port than you think.
- Ignoring return values: `send` may send **fewer** bytes than asked; `recv` returns `0` when the peer closed and `-1` on error.
- "Address already in use" after restarting a server — set `SO_REUSEADDR` before `bind`.

### Interview answer
"A socket is an OS handle for a communication endpoint. A TCP server calls socket, bind, listen and accept, getting a new connected socket per client; a client calls socket and connect. Connections are identified by the 5-tuple. Blocking I/O is simple but needs a thread per connection; scalable servers use non-blocking sockets with epoll/kqueue/IOCP event loops."

---

## 2. Client-server architecture

**In one sentence:** in the client-server model, **servers** provide a service and wait for requests, and **clients** initiate requests and consume the responses.

### In plain words
A restaurant: the **kitchen (server)** stays in one place, has the ingredients and skills, and serves many customers. **Customers (clients)** come, place orders and leave. Customers don't talk to each other; they all talk to the kitchen. (Compare **peer-to-peer**, like BitTorrent, where every participant is both client and server.)

### How it works
- **Server:** long-running, well-known address, handles many clients concurrently, owns shared data/resources.
- **Client:** starts the conversation, usually short-lived per request (browser, mobile app, CLI tool, another service).
- **Protocol:** the agreed message format — HTTP, gRPC, SQL wire protocols, or your own.
- **Stateless vs. stateful servers:** stateless (each request self-contained, e.g. REST) scale by adding servers behind a load balancer; stateful (e.g. game servers, DB sessions) must route clients to the right server.
- **Tiers:** 2-tier (client ↔ database), 3-tier (client ↔ app server ↔ database), n-tier. See [Client-Server Architecture](../System%20Architecture/Client-Server-Architecture.md) for the system-design view.

**Framing:** TCP is a *byte stream*, so an application protocol must define where one message ends. Common options: a delimiter (`\n`, like Redis/SMTP/HTTP headers) or a **length prefix** (like gRPC/HTTP/2 frames).

### Modern C++ example — a key-value server with a line-based protocol
A mini "Redis": the client sends lines like `SET name Ana`, the server replies with one line.

```cpp
// g++ -std=c++20 -pthread main.cpp && ./a.out      (Linux/macOS)
#include <arpa/inet.h>
#include <iostream>
#include <map>
#include <netinet/in.h>
#include <sstream>
#include <string>
#include <sys/socket.h>
#include <thread>
#include <unistd.h>

// Read bytes until '\n' (one protocol message). Returns false if the peer closed.
bool read_line(int fd, std::string& out) {
    out.clear();
    char c;
    while (::recv(fd, &c, 1, 0) == 1) {
        if (c == '\n') return true;
        out += c;
    }
    return false;
}
void write_line(int fd, const std::string& s) {
    std::string msg = s + "\n";
    ::send(fd, msg.data(), msg.size(), 0);
}

int main() {
    int listener = ::socket(AF_INET, SOCK_STREAM, 0);
    sockaddr_in addr{};
    addr.sin_family = AF_INET;
    addr.sin_addr.s_addr = htonl(INADDR_LOOPBACK);
    ::bind(listener, reinterpret_cast<sockaddr*>(&addr), sizeof addr);
    socklen_t len = sizeof addr;
    ::getsockname(listener, reinterpret_cast<sockaddr*>(&addr), &len);
    ::listen(listener, 1);

    std::jthread server([listener] {                          // SERVER: owns the data
        std::map<std::string, std::string> store;
        int c = ::accept(listener, nullptr, nullptr);
        std::string line;
        while (read_line(c, line)) {
            std::istringstream in(line);
            std::string cmd, key, value;
            in >> cmd >> key >> value;
            if (cmd == "SET")      { store[key] = value; write_line(c, "OK"); }
            else if (cmd == "GET") { write_line(c, store.contains(key) ? store[key] : "(nil)"); }
            else                   { write_line(c, "ERR unknown command"); }
        }
        ::close(c);
    });

    int client = ::socket(AF_INET, SOCK_STREAM, 0);          // CLIENT: sends requests
    ::connect(client, reinterpret_cast<sockaddr*>(&addr), sizeof addr);
    for (const char* request : {"SET name Ana", "GET name", "GET age", "FLY away"}) {
        write_line(client, request);
        std::string reply;
        read_line(client, reply);
        std::cout << "> " << request << "\n< " << reply << '\n';
    }
    ::close(client);                                          // server's read_line sees EOF
    server.join();
    ::close(listener);
}
```

**Output:**
```text
> SET name Ana
< OK
> GET name
< Ana
> GET age
< (nil)
> FLY away
< ERR unknown command
```

### Interview answer
"In client-server architecture, servers expose a service at a known address and clients initiate requests over a defined protocol. Servers centralize data and logic; stateless servers scale horizontally behind load balancers. Because TCP is a byte stream, the application protocol must frame messages with delimiters or length prefixes."

---

## 3. Protocols (TCP, UDP) in code

**In one sentence:** in code, TCP is a **connected, reliable byte stream** (`SOCK_STREAM`: `connect`/`send`/`recv`), while UDP is **independent datagrams** (`SOCK_DGRAM`: `sendto`/`recvfrom`) with no connection or delivery guarantee.

### In plain words
TCP is a **phone call**: dial first, then talk; words arrive in order; if you drop out, you know. UDP is **sending postcards**: no dialing; each postcard is separate; some may get lost or arrive out of order, but it's quick and cheap. (Theory is in [TCP vs. UDP](../Networking/TCP-IP-Stack.md#3-tcp-vs-udp).)

### How it works
| Programming aspect | TCP (`SOCK_STREAM`) | UDP (`SOCK_DGRAM`) |
|---|---|---|
| Setup | `listen`/`accept` + `connect` | Just `bind` (server) — no connection |
| Send/receive | `send` / `recv` | `sendto(addr)` / `recvfrom(&addr)` |
| Message boundaries | **None** — must frame messages yourself | Each datagram = one message |
| Partial I/O | `send`/`recv` may transfer fewer bytes → loop | Whole datagram or nothing |
| Reliability/order | Guaranteed by the OS | Your job (sequence numbers, ACKs, timeouts) if needed |
| Max message | Unlimited (stream) | ~64 KB (practically keep ≤ ~1400 bytes to avoid fragmentation) |

A robust TCP program therefore needs **`send_all`/`recv_exact` loops** and a **framing** scheme. The most common is a **length prefix**: send a 4-byte big-endian length, then the payload.

### Modern C++ example — length-prefixed framing over TCP (and why it's needed)
```cpp
// g++ -std=c++20 -pthread main.cpp && ./a.out      (Linux/macOS)
#include <arpa/inet.h>
#include <cstdint>
#include <iostream>
#include <netinet/in.h>
#include <optional>
#include <string>
#include <sys/socket.h>
#include <thread>
#include <unistd.h>

// send() may send only part of the buffer: loop until everything is out.
bool send_all(int fd, const void* data, std::size_t n) {
    auto* p = static_cast<const char*>(data);
    while (n > 0) {
        ssize_t sent = ::send(fd, p, n, 0);
        if (sent <= 0) return false;
        p += sent; n -= static_cast<std::size_t>(sent);
    }
    return true;
}
// recv() may return fewer bytes than asked: loop until exactly n bytes arrived.
bool recv_exact(int fd, void* data, std::size_t n) {
    auto* p = static_cast<char*>(data);
    while (n > 0) {
        ssize_t got = ::recv(fd, p, n, 0);
        if (got <= 0) return false;
        p += got; n -= static_cast<std::size_t>(got);
    }
    return true;
}

// Frame = [4-byte big-endian length][payload]
bool send_message(int fd, const std::string& msg) {
    std::uint32_t len = htonl(static_cast<std::uint32_t>(msg.size()));
    return send_all(fd, &len, sizeof len) && send_all(fd, msg.data(), msg.size());
}
std::optional<std::string> recv_message(int fd) {
    std::uint32_t len;
    if (!recv_exact(fd, &len, sizeof len)) return std::nullopt;
    std::string msg(ntohl(len), '\0');
    if (!recv_exact(fd, msg.data(), msg.size())) return std::nullopt;
    return msg;
}

int main() {
    int fds[2];
    ::socketpair(AF_UNIX, SOCK_STREAM, 0, fds);   // two connected stream sockets (like TCP)

    std::jthread sender([&] {
        // Three messages written back-to-back: on the wire it's one continuous stream.
        for (const char* m : {"first", "second message", "3"}) send_message(fds[0], m);
        ::close(fds[0]);
    });

    while (auto msg = recv_message(fds[1]))       // framing recovers the boundaries
        std::cout << "received message: \"" << *msg << "\" (" << msg->size() << " bytes)\n";
    ::close(fds[1]);
}
```

**Output:**
```text
received message: "first" (5 bytes)
received message: "second message" (14 bytes)
received message: "3" (1 bytes)
```
(`socketpair` gives us a connected stream pair without needing a port; the framing code is identical for real TCP sockets. A UDP example is in [TCP vs. UDP](../Networking/TCP-IP-Stack.md#3-tcp-vs-udp).)

### Common mistakes
- Assuming one `send` = one `recv` on TCP. It works on localhost in tests, then fails in production when messages get split or merged.
- Using UDP for data that must all arrive, without adding your own acknowledgements.

### Interview answer
"TCP sockets give a reliable ordered byte stream, so applications need send/recv loops for partial I/O and a framing scheme such as a length prefix. UDP sockets exchange individual datagrams with boundaries preserved but no reliability, ordering or congestion control — the application adds whatever it needs."

---

## 4. Remote Procedure Call (RPC)

**In one sentence:** RPC lets a program call a function that runs on **another machine** as if it were a normal local function call — the RPC framework packs the arguments into a message, sends it, runs the function remotely, and sends the result back.

### In plain words
Calling a pizza place: you say "one large margherita to 12 Rose Street" (function name + arguments). The shop does the work and you get a pizza back (the return value). You don't care how their kitchen works. RPC is that, for code: `int total = cart_service.add_item(user_id, "book");` — but `cart_service` lives on a different server.

### How it works
```
 Client code                                                          Server code
 add(2, 3) ─> [client stub] ─ serialize ─> network ─> [server stub] ─ deserialize ─> add(2,3)
          <─                ─ deserialize <─ network <─              ─ serialize   <─  returns 5
```
1. **Interface definition (IDL):** describe the functions and types once, e.g. a `.proto` file for gRPC.
2. **Code generation:** tools generate a **client stub** (looks like a local function) and a **server skeleton** (you fill in the implementation).
3. **Serialization (marshalling):** arguments → bytes (Protocol Buffers, Thrift, JSON, MessagePack).
4. **Transport:** usually TCP; gRPC uses HTTP/2.
5. **Dispatch:** the server looks up the function by name/ID and calls it.

Popular frameworks: **gRPC** (Google, Protobuf over HTTP/2; the most common in microservices), Apache Thrift, Cap'n Proto, JSON-RPC, Java RMI (old).

**RPC is *not* really a local call** — the "fallacies of distributed computing" apply:
- The call can **fail halfway** (did the server run it or not?) → use **timeouts/deadlines**, **retries** only for **idempotent** calls, or idempotency keys.
- **Latency** is 1000×+ a local call → avoid chatty APIs; batch.
- **Versioning:** client and server evolve separately → use schemas with backward-compatible fields (Protobuf field numbers).

**RPC vs. REST:** RPC exposes **actions** (`CreateOrder(...)`); REST exposes **resources** (`POST /orders`). gRPC is faster (binary, HTTP/2 streaming) and strongly typed; REST/JSON is simpler, human-readable and browser-friendly. See [REST](../System%20Architecture/REST-Explained.md).

### Modern C++ example — a minimal RPC framework
A "stub" that looks like a normal function call, a tiny serialization format, and a server that dispatches by function name — over a real socket pair.

```cpp
// g++ -std=c++20 -pthread main.cpp && ./a.out      (Linux/macOS)
#include <functional>
#include <iostream>
#include <map>
#include <sstream>
#include <stdexcept>
#include <string>
#include <sys/socket.h>
#include <thread>
#include <unistd.h>
#include <vector>

// ---- transport: newline-framed messages over a stream socket ----
void send_line(int fd, const std::string& s) { std::string m = s + '\n'; ::send(fd, m.data(), m.size(), 0); }
bool recv_line(int fd, std::string& out) {
    out.clear(); char c;
    while (::recv(fd, &c, 1, 0) == 1) { if (c == '\n') return true; out += c; }
    return false;
}

// ---- serialization: "name arg1 arg2 ..." (real systems use Protobuf/JSON) ----
std::string serialize_call(const std::string& fn, const std::vector<long>& args) {
    std::ostringstream out; out << fn;
    for (long a : args) out << ' ' << a;
    return out.str();
}

// ---- server side: a registry of callable functions ----
class RpcServer {
public:
    void register_fn(const std::string& name, std::function<long(const std::vector<long>&)> fn) {
        registry_[name] = std::move(fn);
    }
    void serve(int fd) {
        std::string request;
        while (recv_line(fd, request)) {
            std::istringstream in(request);
            std::string name; in >> name;
            std::vector<long> args; long a;
            while (in >> a) args.push_back(a);
            auto it = registry_.find(name);
            send_line(fd, it == registry_.end() ? "ERR no such function: " + name
                                                : "OK " + std::to_string(it->second(args)));
        }
    }
private:
    std::map<std::string, std::function<long(const std::vector<long>&)>> registry_;
};

// ---- client side: the STUB makes a remote call look local ----
class CalculatorStub {
public:
    explicit CalculatorStub(int fd) : fd_(fd) {}
    long add(long a, long b)      { return call("add", {a, b}); }
    long multiply(long a, long b) { return call("multiply", {a, b}); }
    long call(const std::string& fn, const std::vector<long>& args) {
        send_line(fd_, serialize_call(fn, args));          // marshal + send
        std::string reply; recv_line(fd_, reply);          // wait for the response
        if (reply.rfind("OK ", 0) != 0) throw std::runtime_error(reply);
        return std::stol(reply.substr(3));                 // unmarshal
    }
private:
    int fd_;
};

int main() {
    int fds[2];
    ::socketpair(AF_UNIX, SOCK_STREAM, 0, fds);            // stands in for a TCP connection

    std::jthread server_thread([&] {
        RpcServer server;
        server.register_fn("add", [](const std::vector<long>& a) { return a[0] + a[1]; });
        server.register_fn("multiply", [](const std::vector<long>& a) { return a[0] * a[1]; });
        server.serve(fds[1]);
        ::close(fds[1]);
    });

    CalculatorStub calc(fds[0]);
    std::cout << "add(2, 3)       = " << calc.add(2, 3) << "   <- looks local, ran 'remotely'\n";
    std::cout << "multiply(6, 7)  = " << calc.multiply(6, 7) << '\n';
    try { calc.call("divide", {1, 0}); }
    catch (const std::exception& e) { std::cout << "remote error: " << e.what() << '\n'; }
    ::close(fds[0]);                                       // server sees EOF and stops
}
```

**Output:**
```text
add(2, 3)       = 5   <- looks local, ran 'remotely'
multiply(6, 7)  = 42
remote error: ERR no such function: divide
```
With gRPC, the `.proto` file would generate the equivalent of `CalculatorStub` and the dispatch table for you:
```protobuf
service Calculator {
  rpc Add (Pair) returns (Result);
  rpc Multiply (Pair) returns (Result);
}
message Pair   { int64 a = 1; int64 b = 2; }
message Result { int64 value = 1; }
```

### Common mistakes
- Treating remote calls like local ones: no timeouts, calls in tight loops, retrying non-idempotent operations.
- Breaking compatibility by renumbering/removing Protobuf fields.

### Interview answer
"RPC abstracts a remote call as a local function call: an IDL defines the interface, generated stubs marshal arguments, a transport carries them, and the server dispatches to the implementation and returns the marshalled result. gRPC uses Protobuf over HTTP/2 with streaming and deadlines. Because the network can fail or be slow, RPC clients need deadlines, retries for idempotent calls and backward-compatible schemas."

---

## Cheat sheet

| Topic | Key calls / ideas |
|---|---|
| TCP server | `socket` → `bind` → `listen` → `accept` → `recv`/`send` → `close` |
| TCP client | `socket` → `connect` → `send`/`recv` → `close` |
| UDP | `socket(SOCK_DGRAM)` → `bind` (server) → `sendto`/`recvfrom` |
| Byte order | `htons`/`htonl`/`ntohs`/`ntohl` |
| Framing | Delimiter (`\n`) or length prefix; loop on partial `send`/`recv` |
| Scaling | Thread per connection → thread pool → event loop (`epoll`/`kqueue`/IOCP, Boost.Asio) |
| Client-server | Server provides, client initiates; stateless servers scale out |
| RPC | IDL → stubs → serialize → transport → dispatch; gRPC = Protobuf + HTTP/2 |
