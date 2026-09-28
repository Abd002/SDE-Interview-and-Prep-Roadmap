# The TCP/IP Stack — OSI Layers, TCP and UDP

> **What you'll learn:** how data travels from one computer to another, what "layers" and "protocols" mean, the **OSI model's 7 layers**, the real-world **TCP/IP stack**, and the difference between **TCP and UDP** — with C++ programs that build packets and send real data over sockets.
>
> **Prerequisites:** none.

## Table of Contents
0. [What is a network protocol, and why layers?](#0-what-is-a-network-protocol-and-why-layers)
1. [OSI model layers](#1-osi-model-layers)
2. [The TCP/IP stack (what the Internet really uses)](#2-the-tcpip-stack-what-the-internet-really-uses)
3. [TCP vs. UDP](#3-tcp-vs-udp)
4. [Cheat sheet](#cheat-sheet)

---

## 0. What is a network protocol, and why layers?

**In one sentence:** a protocol is an agreed set of rules for how two machines talk, and networking splits the job into **layers** so each layer solves one problem and relies on the layer below.

### In plain words
Sending a gift to a friend abroad:
1. You write a **letter** in a language your friend understands (the *application*).
2. You put it in a **box** and write the name of the person (which *program* should get it).
3. The post office writes the **address** (which *computer*).
4. A truck/plane physically **carries** it (the *wires and radio waves*).

You don't care whether it goes by plane or truck; the pilot doesn't care what's in your letter. Each layer does one job and trusts the others. That independence is exactly why networks are built in layers.

### How it works
- **Encapsulation:** as data goes *down* the layers on the sender, each layer wraps it with its own **header** (an envelope with its own info). On the receiver it goes *up* the layers, and each layer removes its header.
- **Addresses at each layer:**
  - **Port** (e.g. 443) → which *program* on the machine.
  - **IP address** (e.g. 142.250.74.14) → which *machine* on the Internet.
  - **MAC address** (e.g. 3c:22:fb:…) → which *network card* on the local network.

```
Application data:                             [ "GET /index.html" ]
+ Transport header (ports):             [TCP][ "GET /index.html" ]          = segment
+ Network header (IP addresses):    [IP][TCP][ "GET /index.html" ]          = packet
+ Link header/trailer (MAC):    [Eth][IP][TCP][ "GET /index.html" ][FCS]    = frame
→ Physical: bits on a wire / radio waves
```

### Modern C++ example — encapsulation and decapsulation
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <string>
#include <vector>

// Each layer adds its header on the way down...
std::string wrap(const std::string& header, const std::string& payload) {
    return "[" + header + "]" + payload;
}
// ...and strips it on the way up.
std::string unwrap(const std::string& data) {
    return data.substr(data.find(']') + 1);
}

int main() {
    std::string msg = "GET /index.html";
    const std::vector<std::string> headers{
        "TCP src=51000 dst=80",               // transport: ports
        "IP src=10.0.0.5 dst=93.184.216.34",  // network: IP addresses
        "ETH src=aa:aa dst=bb:bb",            // link: MAC addresses
    };

    std::cout << "SENDER (going down):\n";
    for (const auto& h : headers) {
        msg = wrap(h, msg);
        std::cout << "  " << msg << '\n';
    }

    std::cout << "RECEIVER (going up):\n";
    for (std::size_t i = 0; i < headers.size(); ++i) {
        msg = unwrap(msg);
        std::cout << "  " << msg << '\n';
    }
}
```

**Output:**
```text
SENDER (going down):
  [TCP src=51000 dst=80]GET /index.html
  [IP src=10.0.0.5 dst=93.184.216.34][TCP src=51000 dst=80]GET /index.html
  [ETH src=aa:aa dst=bb:bb][IP src=10.0.0.5 dst=93.184.216.34][TCP src=51000 dst=80]GET /index.html
RECEIVER (going up):
  [IP src=10.0.0.5 dst=93.184.216.34][TCP src=51000 dst=80]GET /index.html
  [TCP src=51000 dst=80]GET /index.html
  GET /index.html
```

### Interview answer
"Networking is layered so each layer provides a service to the one above and hides the details below. Data is encapsulated with a header per layer on the way down and decapsulated on the way up. Ports identify applications, IP addresses identify hosts, and MAC addresses identify interfaces on a local link."

---

## 1. OSI model layers

**In one sentence:** the OSI (Open Systems Interconnection) model is a 7-layer *reference* model used to talk about where a networking feature or problem belongs.

### In plain words
The OSI model is like a floor plan of a 7-storey building where each floor has a specific department. Nobody builds networks *exactly* like it anymore, but everyone uses its floor numbers when they talk: "that's a layer-7 load balancer", "it's a layer-2 problem, check the switch".

Memory trick (top to bottom): **A**ll **P**eople **S**eem **T**o **N**eed **D**ata **P**rocessing.

### How it works
| # | Layer | Job | Unit of data | Examples | Device |
|---|---|---|---|---|---|
| 7 | **Application** | What the user's app speaks | Data | HTTP, DNS, SMTP, FTP, SSH | L7 load balancer, proxy |
| 6 | **Presentation** | Formats, encoding, encryption | Data | TLS encryption, JSON/UTF-8, JPEG, compression | — |
| 5 | **Session** | Open/keep/close conversations | Data | Session setup, RPC sessions, TLS sessions | — |
| 4 | **Transport** | Process-to-process delivery; reliability | Segment (TCP) / Datagram (UDP) | TCP, UDP, QUIC | L4 load balancer, firewall |
| 3 | **Network** | Host-to-host delivery across networks; routing | Packet | IP (IPv4/IPv6), ICMP (ping) | **Router** |
| 2 | **Data Link** | Node-to-node on the same local network | Frame | Ethernet, Wi-Fi (802.11), ARP | **Switch** |
| 1 | **Physical** | Bits as electrical/optical/radio signals | Bit | Cables, fiber, radio, voltages | Hub, cable, repeater |

Key ideas:
- A **router** looks at IP addresses (layer 3) to move packets *between* networks.
- A **switch** looks at MAC addresses (layer 2) to move frames *within* a local network.
- **ARP** (Address Resolution Protocol) finds the MAC address for an IP address on the local network.
- In the real TCP/IP world, layers 5–7 are usually merged into "Application".

### Modern C++ example — classify protocols by layer
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <array>
#include <format>
#include <iostream>
#include <map>
#include <string>
#include <string_view>

enum class Layer { Physical = 1, DataLink, Network, Transport, Session, Presentation, Application };

constexpr std::array<std::string_view, 8> kNames{
    "", "Physical", "Data Link", "Network", "Transport", "Session", "Presentation", "Application"};

int main() {
    const std::map<std::string, Layer> protocols{
        {"HTTP", Layer::Application}, {"DNS", Layer::Application},
        {"TLS", Layer::Presentation}, {"TCP", Layer::Transport},
        {"UDP", Layer::Transport},    {"IP", Layer::Network},
        {"ICMP", Layer::Network},     {"Ethernet", Layer::DataLink},
        {"ARP", Layer::DataLink},     {"Fiber", Layer::Physical},
    };
    for (const auto& [name, layer] : protocols) {
        int n = static_cast<int>(layer);
        std::cout << std::format("{:9} -> L{} {}\n", name, n, kNames[n]);
    }
}
```

**Output:**
```text
ARP       -> L2 Data Link
DNS       -> L7 Application
Ethernet  -> L2 Data Link
Fiber     -> L1 Physical
HTTP      -> L7 Application
ICMP      -> L3 Network
IP        -> L3 Network
TCP       -> L4 Transport
TLS       -> L6 Presentation
UDP       -> L4 Transport
```
(Where TLS "belongs" is debated — it's often placed between layers 4 and 7. Interviewers mostly care that you know it provides encryption above TCP.)

### Common mistakes
- Thinking the Internet literally implements 7 separate layers. OSI is a *reference* model; the Internet runs the 4-layer TCP/IP stack.
- Mixing up routers (L3, IP) and switches (L2, MAC).

### Interview answer
"OSI has seven layers: physical, data link, network, transport, session, presentation and application. Routers work at layer 3 with IP, switches at layer 2 with MAC addresses, TCP/UDP at layer 4, and HTTP/DNS at layer 7. It's mainly a vocabulary for locating functionality and problems."

---

## 2. The TCP/IP stack (what the Internet really uses)

**In one sentence:** the TCP/IP stack is the practical 4-layer model the Internet runs on: Link, Internet, Transport and Application.

### How it works
| TCP/IP layer | Matching OSI layers | Protocols |
|---|---|---|
| Application | 5, 6, 7 | HTTP, HTTPS, DNS, SMTP, SSH, FTP |
| Transport | 4 | TCP, UDP (QUIC runs on UDP) |
| Internet | 3 | IPv4, IPv6, ICMP |
| Link (Network Access) | 1, 2 | Ethernet, Wi-Fi, ARP |

What happens when you type `https://example.com`:
1. **DNS** turns `example.com` into an IP address (see [DNS](./DNS.md)).
2. **TCP** opens a connection to that IP on port 443 (the 3-way handshake, below).
3. **TLS** sets up encryption.
4. **HTTP** sends `GET /` and receives the page (see [HTTP](./HTTP.md)).
5. **IP** routes every packet across many routers (see [Routing Algorithms](./Routing-Algorithms.md)).
6. **Ethernet/Wi-Fi** carries each packet hop by hop.

### Modern C++ example
The socket API *is* the doorway from your program into the transport layer. The example in the next section shows it; here's the smallest possible taste — asking the OS to turn a name into IP addresses (application → network layers).

```cpp
// g++ -std=c++20 main.cpp && ./a.out      (Linux/macOS)
#include <arpa/inet.h>
#include <iostream>
#include <netdb.h>

int main() {
    addrinfo hints{};
    hints.ai_family = AF_INET;                 // IPv4 only, to keep the output simple
    addrinfo* result = nullptr;
    if (getaddrinfo("localhost", nullptr, &hints, &result) != 0) return 1;

    char ip[INET_ADDRSTRLEN];
    auto* addr = reinterpret_cast<sockaddr_in*>(result->ai_addr);
    inet_ntop(AF_INET, &addr->sin_addr, ip, sizeof ip);
    std::cout << "localhost -> " << ip << '\n';
    freeaddrinfo(result);
}
```

**Output:**
```text
localhost -> 127.0.0.1
```

### Interview answer
"The Internet uses the four-layer TCP/IP model: link, internet (IP), transport (TCP/UDP) and application. OSI layers 5–7 collapse into the application layer."

---

## 3. TCP vs. UDP

**In one sentence:** **TCP** is a reliable, ordered, connection-based stream (like a phone call); **UDP** is a fast, connectionless "fire-and-forget" message service with no delivery guarantees (like postcards).

### In plain words
- **TCP = registered mail with tracking.** You first call to confirm the other person is home (handshake). Every page is numbered; the receiver confirms each one; lost pages are resent; pages are put back in order. Reliable, but slower.
- **UDP = throwing postcards.** No setup, no confirmation. Most arrive, some get lost, some arrive out of order. Very fast and simple. Great when *fresh* data matters more than *every* data — a live video call doesn't want a 2-second-old frame resent.

### How it works
**TCP features**
1. **3-way handshake** to open a connection:
   ```
   Client ── SYN (seq=x) ──────────────> Server     "Can we talk?"
   Client <── SYN-ACK (seq=y, ack=x+1) ── Server     "Yes, can you hear me?"
   Client ── ACK (ack=y+1) ────────────> Server     "Yes. Let's go."
   ```
2. **Sequence numbers + acknowledgments (ACKs):** every byte is numbered; the receiver acknowledges what it got.
3. **Retransmission:** if an ACK doesn't come back in time, resend.
4. **Ordering:** out-of-order segments are reordered before the app sees them.
5. **Flow control:** the receiver advertises a *window* ("I can take 64 KB more") so a fast sender doesn't overwhelm a slow receiver.
6. **Congestion control:** the sender slows down when the network looks congested (slow start, AIMD, CUBIC, BBR).
7. **4-way close:** FIN / ACK in each direction.
8. It's a **byte stream**: message boundaries are *not* preserved (two `send`s may arrive as one `recv`).

**UDP features**
- 8-byte header: source port, destination port, length, checksum. That's all.
- No connection, no ACKs, no retransmission, no ordering, no congestion control.
- **Message-oriented**: each `sendto` arrives as exactly one datagram (or not at all).
- Supports broadcast/multicast.

| | TCP | UDP |
|---|---|---|
| Connection | Yes (handshake) | No |
| Reliability | Guaranteed delivery or error | Best effort |
| Ordering | In order | Any order |
| Boundaries | Byte stream | Message (datagram) |
| Header | 20–60 bytes | 8 bytes |
| Speed / latency | Higher overhead | Lower overhead |
| Used by | HTTP/1.1, HTTP/2, SSH, email, databases | DNS, video calls, online games, VoIP, **QUIC/HTTP/3** |

Note: **QUIC** (the base of HTTP/3) builds reliability, encryption and multiplexing *on top of UDP* in user space.

### Modern C++ example — real TCP and UDP over localhost (Linux/macOS)
A single program starts a server thread and a client for each protocol. A tiny RAII class makes sure every socket is closed.

```cpp
// g++ -std=c++20 -pthread main.cpp && ./a.out      (Linux/macOS)
#include <arpa/inet.h>
#include <array>
#include <iostream>
#include <netinet/in.h>
#include <string>
#include <string_view>
#include <sys/socket.h>
#include <thread>
#include <unistd.h>

class Socket {                                        // RAII: closes the descriptor
public:
    explicit Socket(int type) : fd_(::socket(AF_INET, type, 0)) {}
    explicit Socket(int fd, bool) : fd_(fd) {}
    ~Socket() { if (fd_ >= 0) ::close(fd_); }
    Socket(const Socket&) = delete;
    Socket& operator=(const Socket&) = delete;
    int fd() const { return fd_; }
private:
    int fd_;
};

sockaddr_in local_addr(std::uint16_t port) {
    sockaddr_in a{};
    a.sin_family = AF_INET;
    a.sin_port = htons(port);                         // host-to-network byte order
    a.sin_addr.s_addr = htonl(INADDR_LOOPBACK);       // 127.0.0.1
    return a;
}

// Bind to port 0 = "OS, pick any free port"; then read back which port we got.
std::uint16_t bind_any(const Socket& s) {
    sockaddr_in a = local_addr(0);
    ::bind(s.fd(), reinterpret_cast<sockaddr*>(&a), sizeof a);
    socklen_t len = sizeof a;
    ::getsockname(s.fd(), reinterpret_cast<sockaddr*>(&a), &len);
    return ntohs(a.sin_port);
}

void tcp_demo() {
    Socket listener(SOCK_STREAM);
    std::uint16_t port = bind_any(listener);
    ::listen(listener.fd(), 1);

    std::jthread server([&] {
        Socket conn(::accept(listener.fd(), nullptr, nullptr), true);  // handshake completes
        std::array<char, 64> buf{};
        ssize_t n = ::recv(conn.fd(), buf.data(), 10, MSG_WAITALL);   // wait for exactly 10 bytes
        std::string reply = "TCP echo: " + std::string(buf.data(), n);
        ::send(conn.fd(), reply.data(), reply.size(), 0);
    });

    Socket client(SOCK_STREAM);
    sockaddr_in addr = local_addr(port);
    ::connect(client.fd(), reinterpret_cast<sockaddr*>(&addr), sizeof addr); // SYN, SYN-ACK, ACK
    ::send(client.fd(), "hello", 5, 0);               // two sends...
    ::send(client.fd(), "world", 5, 0);               // ...one byte STREAM
    std::array<char, 64> buf{};
    ssize_t n = ::recv(client.fd(), buf.data(), buf.size(), MSG_WAITALL); // until server closes
    std::cout << std::string_view(buf.data(), n) << '\n';
}

void udp_demo() {
    Socket server(SOCK_DGRAM);
    std::uint16_t port = bind_any(server);
    Socket client(SOCK_DGRAM);
    sockaddr_in addr = local_addr(port);

    // No connection, no handshake: just send datagrams.
    for (std::string_view m : {"postcard-1", "postcard-2"})
        ::sendto(client.fd(), m.data(), m.size(), 0, reinterpret_cast<sockaddr*>(&addr), sizeof addr);

    for (int i = 0; i < 2; ++i) {
        std::array<char, 64> buf{};
        ssize_t n = ::recvfrom(server.fd(), buf.data(), buf.size(), 0, nullptr, nullptr);
        std::cout << "UDP got one datagram: " << std::string_view(buf.data(), n) << '\n';
    }
}

int main() {
    tcp_demo();
    udp_demo();
}
```

**Output:**
```text
TCP echo: helloworld
UDP got one datagram: postcard-1
UDP got one datagram: postcard-2
```
Notice: TCP merged `hello` + `world` into one stream (`helloworld`) — no message boundaries. UDP kept each datagram separate. (On localhost UDP loss is extremely unlikely, so the demo is reliable; across the Internet it isn't.)

### Common mistakes
- Assuming one TCP `send` = one `recv`. You must **frame** messages yourself (length prefix or delimiter).
- Using UDP and forgetting you must handle loss, duplicates and reordering yourself if you care.
- Saying "UDP is always faster". For bulk transfers TCP's congestion control often gives better real throughput and fairness.

### Interview answer
"TCP is connection-oriented, reliable and ordered, with flow and congestion control, exposing a byte stream — used by HTTP, SSH and databases. UDP is connectionless and best-effort with an 8-byte header, preserving message boundaries — used for DNS, real-time media and games, and as the base of QUIC/HTTP/3, which rebuilds reliability in user space."

---

## Cheat sheet

| Term | One-liner |
|---|---|
| Protocol | Agreed rules for communication |
| Encapsulation | Each layer adds a header going down, removes it going up |
| OSI 7 layers | Physical, Data Link, Network, Transport, Session, Presentation, Application |
| TCP/IP 4 layers | Link, Internet, Transport, Application |
| Router / Switch | L3 (IP) / L2 (MAC) |
| TCP | Reliable, ordered stream; handshake; flow + congestion control |
| UDP | Fast, connectionless datagrams; no guarantees |
| Port | Identifies an application on a host (HTTP 80, HTTPS 443, DNS 53, SSH 22) |

**Next:** [HTTP](./HTTP.md).
