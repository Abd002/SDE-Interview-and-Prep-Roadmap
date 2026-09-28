# Routing Algorithms — How Packets Find Their Way

> **What you'll learn:** what routers do, what a routing table is, how the "best path" is chosen, and the two classic **shortest path algorithms** used by routing protocols: **Dijkstra's** (link-state routing, e.g. OSPF) and **Bellman-Ford** (distance-vector routing, e.g. RIP). Each has a runnable C++ implementation that builds a real routing table.
>
> **Prerequisites:** [TCP/IP Stack](./TCP-IP-Stack.md) (IP addresses, routers). A *graph* here just means "dots (routers) connected by lines (links)".

## Table of Contents
0. [Routing basics: routers, routing tables, forwarding](#0-routing-basics-routers-routing-tables-forwarding)
1. [Shortest path algorithms: the idea](#1-shortest-path-algorithms-the-idea)
2. [Dijkstra's algorithm (link-state routing, OSPF)](#2-dijkstras-algorithm-link-state-routing-ospf)
3. [Bellman-Ford (distance-vector routing, RIP)](#3-bellman-ford-distance-vector-routing-rip)
4. [Link-state vs. distance-vector, and BGP](#4-link-state-vs-distance-vector-and-bgp)
5. [Cheat sheet](#cheat-sheet)

---

## 0. Routing basics: routers, routing tables, forwarding

**In one sentence:** a router receives a packet, looks up the destination IP in its **routing table**, and sends the packet to the **next hop** — the neighbor that's one step closer to the destination.

### In plain words
You're driving to a city you've never been to, with no map. At every intersection there's a sign: "Paris → turn left", "everything else → straight". You don't know the whole route; you just follow the sign at each intersection. Routers are the intersections; the **routing table** is the sign; the **next hop** is "turn left".

### How it works
- **Routing** = *building* the table (the "brain", done by routing protocols and algorithms, often every few seconds or on changes).
- **Forwarding** = *using* the table for each packet (the "hands", done millions of times per second in hardware).
- Routing table entries look like `destination prefix → next hop, interface, cost`:
  ```
  10.1.0.0/16    via 192.168.0.2   eth1   cost 20
  10.1.5.0/24    via 192.168.0.3   eth2   cost 10
  0.0.0.0/0      via 203.0.113.1   eth0             <- default route: "everything else"
  ```
- `/16` means "the first 16 bits must match" (a **prefix**, CIDR notation).
- **Longest prefix match:** if several entries match, the most specific (longest prefix) wins. `10.1.5.7` matches both `/16` and `/24` → use `/24`.

### Modern C++ example — longest prefix match
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <cstdint>
#include <format>
#include <iostream>
#include <sstream>
#include <string>
#include <vector>

std::uint32_t parse_ip(const std::string& s) {
    std::istringstream in(s);
    std::uint32_t ip = 0;
    for (int i = 0; i < 4; ++i) {
        int part; char dot;
        in >> part;
        if (i < 3) in >> dot;
        ip = (ip << 8) | static_cast<std::uint32_t>(part);
    }
    return ip;
}

struct Route { std::string prefix; int length; std::string next_hop; };

std::string lookup(const std::vector<Route>& table, const std::string& dest) {
    std::uint32_t ip = parse_ip(dest);
    const Route* best = nullptr;
    for (const auto& r : table) {
        std::uint32_t mask = r.length == 0 ? 0 : ~std::uint32_t{0} << (32 - r.length);
        bool matches = (ip & mask) == (parse_ip(r.prefix) & mask);
        if (matches && (!best || r.length > best->length)) best = &r;  // longest prefix wins
    }
    return best ? std::format("{}/{} via {}", best->prefix, best->length, best->next_hop)
                : "no route";
}

int main() {
    std::vector<Route> table{
        {"10.1.0.0", 16, "192.168.0.2"},
        {"10.1.5.0", 24, "192.168.0.3"},
        {"0.0.0.0", 0, "203.0.113.1"},             // default route
    };
    for (const char* dest : {"10.1.5.7", "10.1.9.9", "8.8.8.8"})
        std::cout << std::format("{:9} -> {}\n", dest, lookup(table, dest));
}
```

**Output:**
```text
10.1.5.7  -> 10.1.5.0/24 via 192.168.0.3
10.1.9.9  -> 10.1.0.0/16 via 192.168.0.2
8.8.8.8   -> 0.0.0.0/0 via 203.0.113.1
```
(Real routers use a **trie** or special hardware (TCAM) to do this in nanoseconds instead of a linear scan.)

### Interview answer
"Routers forward packets hop by hop using a routing table keyed by destination prefix, choosing the longest matching prefix and sending to that entry's next hop. Routing protocols build the table by computing least-cost paths through the network."

---

## 1. Shortest path algorithms: the idea

**In one sentence:** model the network as a **weighted graph** (routers = nodes, links = edges, link cost = weight), and find the path with the smallest total cost to every destination.

### In plain words
A map of towns connected by roads, each road labeled with minutes to drive. "Shortest path" = the route with the fewest total minutes, not necessarily the fewest roads.

### How it works
- **Cost** can be anything: 1 per hop (RIP), inverse of bandwidth (OSPF: faster links are cheaper), latency, money.
- A router only needs the **first step** (next hop) of each shortest path, not the whole path.
- Two families:
  | | Link-state (Dijkstra) | Distance-vector (Bellman-Ford) |
  |---|---|---|
  | What each router knows | The **whole map** | Only what its **neighbors tell it** |
  | Protocols | OSPF, IS-IS | RIP, (BGP is a "path-vector" relative) |

The example network used below:
```
        A
      1/ \4
      B---C       B–C cost 2
     5|   |1
      D---E       D–E cost 3
```

---

## 2. Dijkstra's algorithm (link-state routing, OSPF)

**In one sentence:** starting from yourself, repeatedly "lock in" the closest not-yet-finalized router and update the distances of its neighbors, until every router's shortest distance is known.

### In plain words
Water spreading from a spring: it reaches the nearest spots first, then the next nearest, and so on. The moment water first reaches a spot, you know that's the fastest way there — nothing arriving later can be faster (because road costs are never negative).

In a **link-state protocol** like OSPF:
1. Every router discovers its direct neighbors and link costs ("hello" messages).
2. It **floods** this info (a Link-State Advertisement) to every router in the area.
3. Now every router has the **same full map**, and each runs Dijkstra *with itself as the start*.
4. From the result, it writes the **next hop** for each destination into its routing table.

### How it works
1. `dist[start] = 0`, every other `dist = ∞`.
2. Put `start` in a **priority queue** (min-heap ordered by distance).
3. Pop the router `u` with the smallest distance. If already finalized, skip it.
4. For each neighbor `v` with link cost `w`: if `dist[u] + w < dist[v]`, update `dist[v]` and remember how we got there (the first hop), then push `v`.
5. Repeat until the queue is empty.

Time: **O((V + E) log V)** with a binary heap. Requires **non-negative** costs (always true for links).

### Modern C++ example — compute router A's routing table
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <format>
#include <functional>
#include <iostream>
#include <limits>
#include <map>
#include <queue>
#include <string>
#include <utility>
#include <vector>

using Graph = std::map<char, std::vector<std::pair<char, int>>>;   // node -> (neighbor, cost)

void add_link(Graph& g, char a, char b, int cost) {
    g[a].push_back({b, cost});
    g[b].push_back({a, cost});
}

struct RouteEntry { int cost; char next_hop; };

std::map<char, RouteEntry> dijkstra(const Graph& g, char source) {
    constexpr int kInf = std::numeric_limits<int>::max();
    std::map<char, RouteEntry> table;
    for (const auto& [node, _] : g) table[node] = {kInf, '-'};
    table[source] = {0, source};

    using Item = std::pair<int, char>;                                  // (distance, node)
    std::priority_queue<Item, std::vector<Item>, std::greater<>> pq;   // min-heap
    pq.push({0, source});

    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();
        if (d > table[u].cost) continue;                                // stale queue entry
        for (auto [v, w] : g.at(u)) {
            if (d + w < table[v].cost) {
                // next hop: if u is the source, the next hop is v itself;
                // otherwise we inherit u's next hop (the first step never changes)
                char hop = (u == source) ? v : table[u].next_hop;
                table[v] = {d + w, hop};
                pq.push({d + w, v});
            }
        }
    }
    return table;
}

int main() {
    Graph g;
    add_link(g, 'A', 'B', 1);
    add_link(g, 'A', 'C', 4);
    add_link(g, 'B', 'C', 2);
    add_link(g, 'B', 'D', 5);
    add_link(g, 'C', 'E', 1);
    add_link(g, 'D', 'E', 3);

    std::cout << "Routing table of A (Dijkstra):\n";
    for (const auto& [dest, e] : dijkstra(g, 'A'))
        std::cout << std::format("  to {}: cost {}, next hop {}\n", dest, e.cost, e.next_hop);
}
```

**Output:**
```text
Routing table of A (Dijkstra):
  to A: cost 0, next hop A
  to B: cost 1, next hop B
  to C: cost 3, next hop B
  to D: cost 6, next hop B
  to E: cost 4, next hop B
```
Even though A is directly connected to C (cost 4), the path A→B→C (cost 3) is cheaper, so traffic to C goes via B.

### Common mistakes
- Using Dijkstra with negative edge weights — it can give wrong answers. (Links never have negative cost, but other graph problems might; use Bellman-Ford then.)
- Forgetting to skip stale entries in the priority queue (the `if (d > …) continue;` line).

### Interview answer
"Link-state protocols such as OSPF flood link-state advertisements so every router has the full topology, then each runs Dijkstra from itself to build a shortest-path tree and derive next hops. Dijkstra greedily finalizes the closest unvisited node using a min-heap, in O((V+E) log V), and requires non-negative weights. It converges fast and avoids loops but needs more memory and CPU."

---

## 3. Bellman-Ford (distance-vector routing, RIP)

**In one sentence:** each router repeatedly tells its neighbors "here's how far I am from every destination", and each router picks, for every destination, the neighbor that offers the cheapest total (`link cost + neighbor's distance`).

### In plain words
No one has a map. Every day, each town's mayor phones their neighboring mayors and shares a list: "From here it's 3 hours to Paris, 5 to Rome." You add the drive time to that neighbor and keep the best offer: "Via Lyon it's 1 + 3 = 4 hours to Paris; via Dijon it's 2 + 5 = 7; so I go via Lyon." After a few days of phone calls, everyone knows the best route to everywhere — without anyone ever seeing the full map.

### How it works
The **Bellman-Ford equation**:
```
D_x(y) = min over neighbors v of { cost(x, v) + D_v(y) }
```
1. Initially each router knows only distance 0 to itself and the costs of direct links.
2. Periodically (RIP: every 30 s) or on change, each router sends its **distance vector** to its neighbors.
3. Each router recomputes its distances with the equation above.
4. Repeat until nothing changes (**convergence**). At most V−1 rounds are needed.

Centralized Bellman-Ford (the textbook version) relaxes every edge V−1 times — **O(V·E)** — and, unlike Dijkstra, works with negative weights and can detect negative cycles.

**The count-to-infinity problem:** when a link breaks, neighbors may keep pointing at each other with ever-increasing distances ("I can reach X via you" / "and I can reach X via you"), slowly counting up. Fixes: a maximum distance (**RIP: 16 = infinity**), **split horizon** (don't advertise a route back to the neighbor you learned it from), **poison reverse** (advertise it back as infinity).

### Modern C++ example — distributed distance-vector simulation
Each router only uses its neighbors' vectors. We print how many rounds it takes to converge.

```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <format>
#include <iostream>
#include <limits>
#include <map>
#include <vector>

constexpr int kInf = 1'000'000;
struct Link { char to; int cost; };
struct Entry { int cost = kInf; char next_hop = '-'; };
using DistanceVector = std::map<char, Entry>;

int main() {
    std::map<char, std::vector<Link>> links;
    auto add = [&](char a, char b, int c) { links[a].push_back({b, c}); links[b].push_back({a, c}); };
    add('A', 'B', 1); add('A', 'C', 4); add('B', 'C', 2);
    add('B', 'D', 5); add('C', 'E', 1); add('D', 'E', 3);

    // Each router starts knowing only itself.
    std::map<char, DistanceVector> dv;
    for (const auto& [r, _] : links)
        for (const auto& [dest, __] : links)
            dv[r][dest] = (r == dest) ? Entry{0, r} : Entry{};

    int round = 0;
    bool changed = true;
    while (changed) {
        changed = false;
        ++round;
        auto snapshot = dv;                              // everyone sends their CURRENT vector
        for (const auto& [router, neighbors] : links) {
            for (const auto& [dest, _] : links) {
                for (const auto& [nbr, cost] : neighbors) {
                    int offer = cost + snapshot[nbr][dest].cost;    // Bellman-Ford equation
                    if (offer < dv[router][dest].cost) {
                        dv[router][dest] = {offer, nbr};
                        changed = true;
                    }
                }
            }
        }
    }
    std::cout << "converged after " << round - 1 << " rounds of exchanges\n";
    std::cout << "Routing table of A (distance-vector):\n";
    for (const auto& [dest, e] : dv['A'])
        std::cout << std::format("  to {}: cost {}, next hop {}\n", dest, e.cost, e.next_hop);
}
```

**Output:**
```text
converged after 3 rounds of exchanges
Routing table of A (distance-vector):
  to A: cost 0, next hop A
  to B: cost 1, next hop B
  to C: cost 3, next hop B
  to D: cost 6, next hop B
  to E: cost 4, next hop B
```
Same answer as Dijkstra — but computed without any router seeing the whole map. (The final "no change" round confirms convergence and isn't counted.)

### Common mistakes
- Updating vectors in place during a round and thinking that's how a real network behaves — real routers only see neighbors' **previous** advertisements (that's why we copy a `snapshot`).
- Forgetting count-to-infinity when explaining distance-vector's weaknesses.

### Interview answer
"Distance-vector protocols like RIP run a distributed Bellman-Ford: each router advertises its distance to every destination to its neighbors and updates its own table with min over neighbors of link cost plus the neighbor's distance. It's simple and uses little memory but converges slowly and suffers count-to-infinity, mitigated by a max hop count of 16, split horizon and poison reverse."

---

## 4. Link-state vs. distance-vector, and BGP

| | Link-state (OSPF, IS-IS) | Distance-vector (RIP) |
|---|---|---|
| Algorithm | Dijkstra | Bellman-Ford |
| Knowledge | Full topology | Neighbors' distances only |
| Messages | Flood link info to everyone on change | Send whole table to neighbors periodically |
| Convergence | Fast | Slow; count-to-infinity |
| Resources | More memory/CPU | Light |
| Scale | Large networks (with areas) | Small networks (max 15 hops) |

**Between organizations** the Internet uses **BGP (Border Gateway Protocol)**, a **path-vector** protocol: routes are advertised with the full list of networks (Autonomous Systems) they pass through, which prevents loops and lets operators apply **policy** ("never send my traffic through competitor X"), not just shortest cost.

---

## Cheat sheet

| Term | One-liner |
|---|---|
| Routing vs forwarding | Build the table vs use it per packet |
| Longest prefix match | Most specific matching route wins |
| Dijkstra | Greedy + min-heap; non-negative weights; O((V+E) log V) |
| Link-state (OSPF) | Flood topology, everyone runs Dijkstra |
| Bellman-Ford | Relax all edges V−1 times; handles negative weights; O(V·E) |
| Distance-vector (RIP) | Share vectors with neighbors; count-to-infinity; max 15 hops |
| BGP | Path-vector, policy-based routing between ASes |

**Back to:** [README](../README.md)
