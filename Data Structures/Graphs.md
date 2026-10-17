# Graphs — Representations, Traversal, Directed, Acyclic, Weighted, Bipartite, Spanning Trees and Special Graphs

> **What you'll learn:** graph vocabulary, the four ways to **store** a graph (adjacency matrix, adjacency list, edge list, incidence matrix), **DFS and BFS**, **directed** and **acyclic** graphs (DAGs, topological sort, cycle detection), **weighted** graphs (Dijkstra), **bipartite** graphs, **minimum and maximum spanning trees** (Kruskal, Prim), and graphs with **special properties** (Eulerian, Hamiltonian, planar). Each part has a runnable C++ example.
>
> **Prerequisites:** [Queues](./Queues.md), [Stacks](./Stacks.md) and [Trees](./Trees.md).

## Table of Contents
0. [Graph vocabulary](#0-graph-vocabulary)
1. [Representations (adjacency matrix, adjacency list)](#1-representations-adjacency-matrix-adjacency-list) — [edge list](#11-edge-list), [incidence matrix](#12-incidence-matrix)
2. [Traversal algorithms (DFS, BFS)](#2-traversal-algorithms-dfs-bfs)
3. [Directed graphs](#3-directed-graphs)
4. [Acyclic graphs](#4-acyclic-graphs)
5. [Weighted graphs](#5-weighted-graphs)
6. [Bipartite graphs](#6-bipartite-graphs)
7. [Spanning trees (Minimum Spanning Tree, Maximum Spanning Tree)](#7-spanning-trees-minimum-spanning-tree-maximum-spanning-tree)
8. [Graphs with special properties (e.g., planar graphs, Eulerian graphs)](#8-graphs-with-special-properties-eg-planar-graphs-eulerian-graphs)
9. [Cheat sheet](#cheat-sheet)

---

## 0. Graph vocabulary

**In one sentence:** a graph G = (V, E) is a set of **vertices** (nodes) connected by **edges**, and it models anything with relationships: roads, friendships, web links, task dependencies, networks.

### In plain words
A map of cities (vertices) and roads (edges). A tree is a special graph with no loops; a general graph can have loops, one-way roads, and roads with lengths.

| Word | Meaning |
|---|---|
| **V, E** | number of vertices, number of edges |
| **Undirected / directed** | edges go both ways / edges have a direction (u → v) |
| **Weighted** | each edge has a number (distance, cost, latency) |
| **Degree** | number of edges at a vertex (directed: **in-degree** and **out-degree**) |
| **Path** | a sequence of vertices joined by edges; **simple** if no vertex repeats |
| **Cycle** | a path that starts and ends at the same vertex |
| **Connected** | every vertex can reach every other (directed: **strongly connected** if both ways) |
| **Component** | a maximal connected piece |
| **Sparse / dense** | E ≈ V / E ≈ V² |
| **Tree** | connected and acyclic; exactly V − 1 edges |

**Handshake lemma:** the sum of all degrees = 2E (each edge has two ends).

---

## 1. Representations (adjacency matrix, adjacency list)

**In one sentence:** an **adjacency matrix** is a V×V table saying whether u–v is an edge (fast edge checks, O(V²) memory); an **adjacency list** keeps, for each vertex, the list of its neighbours (O(V + E) memory, fast iteration) — the default for sparse graphs.

### In plain words
- **Matrix:** a mileage chart in a road atlas. Every city pair has a box, even when there's no road.
- **List:** each city's page lists only the roads that leave it.

### How it works
| | Adjacency matrix | Adjacency list | Edge list | Incidence matrix |
|---|---|---|---|---|
| Memory | O(V²) | O(V + E) | O(E) | O(V · E) |
| Is (u, v) an edge? | **O(1)** | O(deg u) | O(E) | O(E) |
| Iterate neighbours of u | O(V) | **O(deg u)** | O(E) | O(E) |
| Add an edge | O(1) | O(1) | O(1) | O(V) (new column) |
| Best for | dense graphs, Floyd–Warshall, bit tricks | most algorithms (BFS, DFS, Dijkstra) | Kruskal, Bellman–Ford, input format | theory, hypergraphs, circuits |

A popular fast form of the adjacency list is **CSR (compressed sparse row)**: one array of all neighbours plus an offset array — cache-friendly and used in graph libraries and GPUs.

### 1.1 Edge list
Just a list of `(u, v)` or `(u, v, weight)` triples. It's the simplest format and how graphs usually arrive (files, databases, input). Algorithms that look at **all edges in some order** use it directly: **Kruskal's MST** (sort the edges by weight) and **Bellman–Ford** (relax every edge V − 1 times).

### 1.2 Incidence matrix
A V × E table: for an undirected graph, `M[v][e] = 1` if vertex v is an end of edge e. For a directed graph, use `−1` at the tail (where the edge leaves) and `+1` at the head. Each column has exactly two non-zeros. It's large and rarely used in code, but it appears in **network flow** formulations, **electrical circuits** (Kirchhoff's laws), and **hypergraphs** (an edge can touch more than two vertices).

#### Modern C++ example — one graph, four representations
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <vector>

struct Edge { int u, v; };

int main() {
    const int V = 4;
    const std::vector<Edge> edges{{0, 1}, {0, 2}, {1, 2}, {2, 3}};   // 1. edge list (undirected)

    std::vector<std::vector<int>> matrix(V, std::vector<int>(V, 0));  // 2. adjacency matrix
    std::vector<std::vector<int>> adj(V);                              // 3. adjacency list
    std::vector<std::vector<int>> incidence(V, std::vector<int>(edges.size(), 0));   // 4. incidence matrix
    for (std::size_t e = 0; e < edges.size(); ++e) {
        auto [u, v] = edges[e];
        matrix[u][v] = matrix[v][u] = 1;
        adj[u].push_back(v);
        adj[v].push_back(u);
        incidence[u][e] = incidence[v][e] = 1;
    }

    std::cout << "edge list:";
    for (auto [u, v] : edges) std::cout << " (" << u << ',' << v << ')';
    std::cout << "\nadjacency matrix:\n";
    for (const auto& row : matrix) { for (int x : row) std::cout << ' ' << x; std::cout << '\n'; }
    std::cout << "adjacency list:\n";
    for (int u = 0; u < V; ++u) {
        std::cout << "  " << u << ':';
        for (int v : adj[u]) std::cout << ' ' << v;
        std::cout << "  (degree " << adj[u].size() << ")\n";
    }
    std::cout << "incidence matrix (rows = vertices, columns = edges e0..e3):\n";
    for (const auto& row : incidence) { for (int x : row) std::cout << ' ' << x; std::cout << '\n'; }
    std::cout << "is 1-3 an edge? matrix says " << matrix[1][3] << " in O(1)\n";
}
```

**Output:**
```text
edge list: (0,1) (0,2) (1,2) (2,3)
adjacency matrix:
 0 1 1 0
 1 0 1 0
 1 1 0 1
 0 0 1 0
adjacency list:
  0: 1 2  (degree 2)
  1: 0 2  (degree 2)
  2: 0 1 3  (degree 3)
  3: 2  (degree 1)
incidence matrix (rows = vertices, columns = edges e0..e3):
 1 1 0 0
 1 0 1 0
 0 1 1 1
 0 0 0 1
is 1-3 an edge? matrix says 0 in O(1)
```

### Interview answer
"I'd default to an adjacency list — O(V + E) memory and O(deg) neighbour iteration, which is what BFS, DFS and Dijkstra need. An adjacency matrix costs O(V²) but answers 'is u–v an edge?' in O(1), so it suits dense graphs or Floyd–Warshall. An edge list is the input format and what Kruskal and Bellman–Ford iterate over. An incidence matrix is V by E; it's mostly for theory, flows and hypergraphs."

---

## 2. Traversal algorithms (DFS, BFS)

**In one sentence:** **BFS** explores **level by level** with a queue (shortest paths in unweighted graphs), while **DFS** goes **as deep as possible** before backtracking with a stack or recursion (cycles, components, topological order); both are **O(V + E)**.

### In plain words
- **BFS:** dropping a stone in a pond — first everything 1 step away, then 2 steps, then 3.
- **DFS:** exploring a maze by always taking the next unexplored corridor and walking back only at a dead end.

### How it works
| | BFS | DFS |
|---|---|---|
| Data structure | queue | stack / recursion |
| Visit order | by distance from the start | deep first |
| Finds | **shortest path (fewest edges)**, levels, bipartiteness | cycles, topological order, connected / strongly connected components, bridges, articulation points |
| Memory | O(width) | O(depth) |
| Time | O(V + E) | O(V + E) |

- Mark a vertex **visited when you push it** (BFS) to avoid pushing it twice.
- To find **connected components**, start a traversal from every vertex not yet visited; each start is a new component.
- Recursive DFS on a huge graph can overflow the call stack; use an explicit stack.

#### Modern C++ example — BFS distances and path, DFS order, connected components
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <iostream>
#include <queue>
#include <vector>

using Graph = std::vector<std::vector<int>>;

void add(Graph& g, int u, int v) { g[u].push_back(v); g[v].push_back(u); }

std::vector<int> bfs(const Graph& g, int s, std::vector<int>& parent) {
    std::vector<int> dist(g.size(), -1);
    parent.assign(g.size(), -1);
    std::queue<int> q;
    dist[s] = 0; q.push(s);
    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (int v : g[u])
            if (dist[v] == -1) { dist[v] = dist[u] + 1; parent[v] = u; q.push(v); }
    }
    return dist;
}

void dfs(const Graph& g, int u, std::vector<bool>& seen, std::vector<int>& order) {
    seen[u] = true;
    order.push_back(u);
    for (int v : g[u]) if (!seen[v]) dfs(g, v, seen, order);
}

int main() {
    Graph g(9);
    for (auto [u, v] : std::vector<std::pair<int, int>>{{0, 1}, {0, 2}, {1, 3}, {2, 3}, {3, 4}, {4, 5}, {6, 7}})
        add(g, u, v);                                    // vertex 8 is alone

    std::vector<int> parent;
    auto dist = bfs(g, 0, parent);
    std::cout << "BFS distances from 0:";
    for (std::size_t v = 0; v < g.size(); ++v) std::cout << ' ' << v << '=' << dist[v];
    std::vector<int> path;
    for (int v = 5; v != -1; v = parent[v]) path.push_back(v);
    std::reverse(path.begin(), path.end());
    std::cout << "\nshortest path 0 -> 5:";
    for (int v : path) std::cout << ' ' << v;

    std::vector<bool> seen(g.size());
    std::vector<int> order;
    dfs(g, 0, seen, order);
    std::cout << "\nDFS order from 0:";
    for (int v : order) std::cout << ' ' << v;

    std::fill(seen.begin(), seen.end(), false);
    int components = 0;
    for (std::size_t s = 0; s < g.size(); ++s)
        if (!seen[s]) { std::vector<int> part; dfs(g, static_cast<int>(s), seen, part); ++components; }
    std::cout << "\nconnected components: " << components << '\n';
}
```

**Output:**
```text
BFS distances from 0: 0=0 1=1 2=1 3=2 4=3 5=4 6=-1 7=-1 8=-1
shortest path 0 -> 5: 0 1 3 4 5
DFS order from 0: 0 1 3 2 4 5
connected components: 3
```

### Interview answer
"BFS uses a queue and visits vertices in order of distance, so in an unweighted graph the first time I reach a vertex is via a shortest path; I keep parents to rebuild it. DFS uses recursion or a stack and is the basis for cycle detection, topological sort and component algorithms. Both are O(V + E) with an adjacency list. Running a traversal from every unvisited vertex counts the connected components."

---

## 3. Directed graphs

**In one sentence:** in a directed graph (digraph) each edge has a **direction u → v**, so reachability is one-way, and we talk about **in-degree / out-degree**, **directed cycles** and **strongly connected components**.

### In plain words
One-way streets. You can drive from A to B but maybe not back. Twitter "follows", web links, function calls and task dependencies are all directed.

### How it works
- **In-degree** = edges coming in; **out-degree** = edges going out. Sum of in-degrees = sum of out-degrees = E.
- **Strongly connected component (SCC):** a maximal set where **every vertex reaches every other**. Contracting each SCC into one node always gives a DAG.
- **Finding SCCs in O(V + E):**
  - **Kosaraju:** DFS to get finish order; reverse all edges; DFS again in decreasing finish order — each tree is one SCC.
  - **Tarjan:** one DFS with discovery times and "low-link" values.
- **Cycle detection:** DFS with three colours — white (unvisited), grey (on the current path), black (done). An edge to a **grey** vertex is a **back edge** = a directed cycle.
- Uses: deadlock detection (wait-for graphs, see [Deadlocks](../Operating%20Systems/Deadlocks.md)), dependency resolution, web crawling, 2-SAT, finding "communities" of mutually reachable pages.

#### Modern C++ example — in/out degree, cycle detection and Kosaraju's SCCs
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <iostream>
#include <vector>

using Graph = std::vector<std::vector<int>>;

bool has_cycle(const Graph& g, int u, std::vector<int>& color) {        // 0 white, 1 grey, 2 black
    color[u] = 1;
    for (int v : g[u]) {
        if (color[v] == 1) return true;                                  // back edge
        if (color[v] == 0 && has_cycle(g, v, color)) return true;
    }
    color[u] = 2;
    return false;
}

void order_dfs(const Graph& g, int u, std::vector<bool>& seen, std::vector<int>& finish) {
    seen[u] = true;
    for (int v : g[u]) if (!seen[v]) order_dfs(g, v, seen, finish);
    finish.push_back(u);                                                 // post-order = finish time
}

void collect(const Graph& rg, int u, std::vector<bool>& seen, std::vector<int>& comp) {
    seen[u] = true;
    comp.push_back(u);
    for (int v : rg[u]) if (!seen[v]) collect(rg, v, seen, comp);
}

int main() {
    const int V = 8;
    Graph g(V), rg(V);
    for (auto [u, v] : std::vector<std::pair<int, int>>{{0, 1}, {1, 2}, {2, 0}, {2, 3}, {3, 4}, {4, 5}, {5, 3}, {6, 5}, {6, 7}}) {
        g[u].push_back(v);
        rg[v].push_back(u);                                              // reversed graph
    }
    std::cout << "vertex: in/out ->";
    for (int u = 0; u < V; ++u) std::cout << ' ' << u << ':' << rg[u].size() << '/' << g[u].size();

    bool cycle = false;
    std::vector<int> color(V, 0);
    for (int u = 0; u < V && !cycle; ++u) if (!color[u]) cycle = has_cycle(g, u, color);
    std::cout << "\nhas a directed cycle? " << std::boolalpha << cycle << '\n';

    std::vector<bool> seen(V);
    std::vector<int> finish;
    for (int u = 0; u < V; ++u) if (!seen[u]) order_dfs(g, u, seen, finish);
    std::fill(seen.begin(), seen.end(), false);
    std::cout << "strongly connected components:";
    for (auto it = finish.rbegin(); it != finish.rend(); ++it) {
        if (seen[*it]) continue;
        std::vector<int> comp;
        collect(rg, *it, seen, comp);
        std::sort(comp.begin(), comp.end());
        std::cout << " {";
        for (std::size_t i = 0; i < comp.size(); ++i) std::cout << (i ? "," : "") << comp[i];
        std::cout << '}';
    }
    std::cout << '\n';
}
```

**Output:**
```text
vertex: in/out -> 0:1/1 1:1/1 2:1/2 3:2/1 4:1/1 5:2/1 6:0/2 7:1/0
has a directed cycle? true
strongly connected components: {6} {7} {0,1,2} {3,4,5}
```

### Interview answer
"In a digraph edges are one-way, so I track in- and out-degree and reachability separately. To detect a cycle I run DFS with white-grey-black colouring; an edge to a grey vertex is a back edge. Strongly connected components — sets where everyone reaches everyone — come from Kosaraju's two DFS passes on the graph and its reverse, or Tarjan's single pass, both O(V + E); collapsing SCCs gives a DAG."

---

## 4. Acyclic graphs

**In one sentence:** an acyclic graph has **no cycles** — undirected acyclic graphs are **forests (trees)**, and directed acyclic graphs (**DAGs**) can always be put in a **topological order** where every edge points forward.

### In plain words
Getting dressed: socks before shoes, underwear before trousers, trousers before shoes. There's no loop ("shoes before socks before shoes"), so you can always find an order that respects every rule.

### How it works
- **Undirected acyclic** = a **forest**; connected + acyclic = a **tree** (exactly V − 1 edges).
- **Topological sort** (only for DAGs), O(V + E):
  - **Kahn's algorithm:** repeatedly take a vertex with in-degree 0, output it, and decrease its neighbours' in-degrees. If you output fewer than V vertices, there **is a cycle**.
  - **DFS:** output vertices in **reverse finish order**.
- **DP on a DAG** in topological order: longest path (the **critical path** in project scheduling), counting paths, shortest paths with negative weights — all O(V + E). Longest path is NP-hard in general graphs, but easy on DAGs.
- **Where DAGs appear:** build systems (Make, Bazel), package managers, spreadsheet cell dependencies, course prerequisites, task schedulers (Airflow, CI pipelines), **Git commit history**, compiler instruction scheduling, Bayesian networks, and [agent planning graphs](<../Agentic AI, LLM Engineering, and AI System Design/Agent Fundamentals and Decision-Making/Planning: task breakdown, dependency graphs and replanning.md>).

#### Modern C++ example — Kahn's topological sort, cycle detection and the critical path
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <iostream>
#include <queue>
#include <string>
#include <vector>

struct Task { std::string name; int hours; };

int main() {
    std::vector<Task> t{{"design", 3}, {"backend", 5}, {"frontend", 4}, {"tests", 2}, {"docs", 1}, {"release", 1}};
    std::vector<std::pair<int, int>> deps{{0, 1}, {0, 2}, {1, 3}, {2, 3}, {0, 4}, {3, 5}, {4, 5}};   // u must finish before v
    const int V = static_cast<int>(t.size());
    std::vector<std::vector<int>> g(V);
    std::vector<int> indeg(V, 0);
    for (auto [u, v] : deps) { g[u].push_back(v); ++indeg[v]; }

    std::queue<int> ready;
    for (int u = 0; u < V; ++u) if (indeg[u] == 0) ready.push(u);
    std::vector<int> order, finish(V, 0);
    while (!ready.empty()) {
        int u = ready.front(); ready.pop();
        order.push_back(u);
        finish[u] += t[u].hours;                       // earliest finish = latest prerequisite + own time
        for (int v : g[u]) {
            finish[v] = std::max(finish[v], finish[u]);
            if (--indeg[v] == 0) ready.push(v);
        }
    }
    std::cout << "topological order:";
    for (int u : order) std::cout << ' ' << t[u].name;
    std::cout << "\nproject length (critical path): " << *std::max_element(finish.begin(), finish.end()) << " hours\n";

    g[5].push_back(0);                                 // add release -> design: now there's a cycle
    std::fill(indeg.begin(), indeg.end(), 0);
    for (int u = 0; u < V; ++u) for (int v : g[u]) ++indeg[v];
    int emitted = 0;
    std::queue<int> q;
    for (int u = 0; u < V; ++u) if (indeg[u] == 0) q.push(u);
    while (!q.empty()) { int u = q.front(); q.pop(); ++emitted; for (int v : g[u]) if (--indeg[v] == 0) q.push(v); }
    std::cout << "after adding release->design: emitted " << emitted << " of " << V
              << " -> " << (emitted < V ? "cycle, no valid order" : "DAG") << '\n';
}
```

**Output:**
```text
topological order: design backend frontend docs tests release
project length (critical path): 11 hours
after adding release->design: emitted 0 of 6 -> cycle, no valid order
```

### Interview answer
"An undirected acyclic graph is a forest; a directed one is a DAG, and every DAG has a topological order. I'd use Kahn's algorithm — repeatedly remove in-degree-zero vertices — which also detects cycles when fewer than V vertices come out. On a DAG, DP in topological order solves longest path, which gives the critical path of a project, in O(V + E). Build systems, package managers and schedulers are all DAGs."

---

## 5. Weighted graphs

**In one sentence:** in a weighted graph every edge has a **cost**, so the "shortest" path is the one with the **smallest total weight**, found with **Dijkstra** (non-negative weights), **Bellman–Ford** (negative weights allowed) or **Floyd–Warshall** (all pairs).

### In plain words
Google Maps doesn't count roads, it adds up minutes. A route with 5 short streets can beat one with 2 long highways. BFS can't handle that — it only counts edges.

### How it works
| Algorithm | Handles | Time | Idea |
|---|---|---|---|
| **BFS** | all weights equal | O(V + E) | fewest edges |
| **0-1 BFS** | weights 0 or 1 | O(V + E) | deque (see [Queues](./Queues.md#12-double-ended-queue-deque)) |
| **Dijkstra** | **non-negative** weights | O((V + E) log V) with a heap | always settle the closest unsettled vertex |
| **Bellman–Ford** | negative weights; **detects negative cycles** | O(V · E) | relax every edge V − 1 times |
| **Floyd–Warshall** | all pairs, negatives OK | O(V³) | DP over intermediate vertices |
| **A\*** | non-negative + a heuristic | often far fewer visits | Dijkstra guided toward the goal |

- **Relaxation:** if `dist[u] + w(u, v) < dist[v]`, update `dist[v]`. Every algorithm above is a different order of relaxations.
- **Why Dijkstra fails with negative edges:** it assumes a settled vertex can't get cheaper later; a negative edge can break that.
- Dijkstra with `std::priority_queue`: push `(dist, vertex)`; when popped, skip it if the distance is stale ("lazy deletion").
- Used in routing protocols (OSPF uses Dijkstra; RIP is distance-vector, Bellman–Ford style — see [Routing Algorithms](../Networking/Routing-Algorithms.md)), maps, games, and network latency planning.

#### Modern C++ example — Dijkstra with path, and Bellman–Ford detecting a negative cycle
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <climits>
#include <functional>
#include <iostream>
#include <queue>
#include <string>
#include <vector>

struct Edge { int to; long w; };

int main() {
    const std::vector<std::string> city{"A", "B", "C", "D", "E"};
    std::vector<std::vector<Edge>> g(5);
    auto road = [&](int u, int v, long w) { g[u].push_back({v, w}); g[v].push_back({u, w}); };
    road(0, 1, 4); road(0, 2, 1); road(2, 1, 2); road(1, 3, 1); road(2, 3, 5); road(3, 4, 3);

    std::vector<long> dist(5, LONG_MAX);
    std::vector<int> parent(5, -1);
    using Item = std::pair<long, int>;
    std::priority_queue<Item, std::vector<Item>, std::greater<Item>> pq;
    dist[0] = 0; pq.push({0, 0});
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue;                              // stale entry
        for (auto [v, w] : g[u])
            if (dist[u] + w < dist[v]) { dist[v] = dist[u] + w; parent[v] = u; pq.push({dist[v], v}); }
    }
    for (int target : {3, 4}) {
        std::vector<std::string> path;
        for (int v = target; v != -1; v = parent[v]) path.push_back(city[v]);
        std::reverse(path.begin(), path.end());
        std::cout << "A -> " << city[target] << ": cost " << dist[target] << " via";
        for (const auto& c : path) std::cout << ' ' << c;
        std::cout << '\n';
    }

    // Bellman-Ford on a directed graph with a negative cycle 1 -> 2 -> 3 -> 1 (total -1).
    struct DEdge { int u, v; long w; };
    std::vector<DEdge> edges{{0, 1, 2}, {1, 2, 1}, {2, 3, -3}, {3, 1, 1}, {3, 4, 2}};
    std::vector<long> bf(5, LONG_MAX);
    bf[0] = 0;
    for (int i = 0; i < 5 - 1; ++i)
        for (auto [u, v, w] : edges) if (bf[u] != LONG_MAX && bf[u] + w < bf[v]) bf[v] = bf[u] + w;
    bool negative_cycle = false;
    for (auto [u, v, w] : edges) if (bf[u] != LONG_MAX && bf[u] + w < bf[v]) negative_cycle = true;
    std::cout << "Bellman-Ford: negative cycle reachable? " << std::boolalpha << negative_cycle << '\n';
}
```

**Output:**
```text
A -> D: cost 4 via A C B D
A -> E: cost 7 via A C B D E
Bellman-Ford: negative cycle reachable? true
```

### Interview answer
"With weights, shortest means smallest total weight, so BFS no longer works. For non-negative weights I'd use Dijkstra with a min-heap — O((V + E) log V) — skipping stale heap entries. With negative edges I'd use Bellman–Ford, which relaxes all edges V − 1 times and finds negative cycles on one extra pass, at O(VE). For all pairs on a small graph, Floyd–Warshall in O(V³)."

---

## 6. Bipartite graphs

**In one sentence:** a graph is bipartite if its vertices can be split into **two groups** so that **every edge goes between the groups**; equivalently, it has **no odd-length cycle**, and you test it by **2-colouring** with BFS or DFS.

### In plain words
Students and courses: every edge is "student X takes course Y". No edge connects two students or two courses. If you can paint every vertex red or blue so that each edge has one red end and one blue end, the graph is bipartite.

### How it works
- **Test:** BFS from each uncoloured vertex, colour it 0, colour its neighbours 1, their neighbours 0, … If an edge ever joins two vertices of the **same** colour, it's **not** bipartite. O(V + E).
- **Odd cycle theorem (Kőnig):** bipartite ⇔ no cycle of odd length. A triangle is the smallest non-bipartite graph. Trees and even cycles are bipartite.
- **Maximum bipartite matching:** pair up as many left vertices with right vertices as possible (jobs ↔ workers, students ↔ projects). Kuhn's augmenting-path algorithm is O(V · E); **Hopcroft–Karp** is O(E √V).
- **Kőnig's theorem:** in a bipartite graph, maximum matching size = minimum vertex cover size.
- Uses: matching problems, scheduling (exams with no common students in the same slot is a colouring problem), recommendation graphs (users ↔ items), "is this conflict graph 2-colourable?" interview questions.

#### Modern C++ example — 2-colouring test and Kuhn's maximum matching
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <functional>
#include <iostream>
#include <queue>
#include <string>
#include <vector>

bool bipartite(const std::vector<std::vector<int>>& g, std::vector<int>& color) {
    color.assign(g.size(), -1);
    for (std::size_t s = 0; s < g.size(); ++s) {
        if (color[s] != -1) continue;
        std::queue<int> q;
        color[s] = 0; q.push(static_cast<int>(s));
        while (!q.empty()) {
            int u = q.front(); q.pop();
            for (int v : g[u]) {
                if (color[v] == -1) { color[v] = 1 - color[u]; q.push(v); }
                else if (color[v] == color[u]) return false;          // same colour on one edge
            }
        }
    }
    return true;
}

int main() {
    auto undirected = [](int n, std::vector<std::pair<int, int>> es) {
        std::vector<std::vector<int>> g(n);
        for (auto [u, v] : es) { g[u].push_back(v); g[v].push_back(u); }
        return g;
    };
    std::vector<int> color;
    std::cout << std::boolalpha
              << "square 0-1-2-3-0 bipartite? " << bipartite(undirected(4, {{0, 1}, {1, 2}, {2, 3}, {3, 0}}), color) << '\n'
              << "triangle 0-1-2-0 bipartite? " << bipartite(undirected(3, {{0, 1}, {1, 2}, {2, 0}}), color) << '\n';

    // Maximum matching: workers (left) -> jobs they can do (right).
    std::vector<std::string> worker{"Ali", "Bea", "Chen", "Dina"}, job{"backend", "frontend", "devops", "QA"};
    std::vector<std::vector<int>> can{{0, 1}, {0}, {1, 2}, {2}};             // Dina can only do devops
    std::vector<int> job_owner(job.size(), -1);
    std::function<bool(int, std::vector<bool>&)> try_assign = [&](int w, std::vector<bool>& seen) {
        for (int j : can[w]) {
            if (seen[j]) continue;
            seen[j] = true;
            if (job_owner[j] == -1 || try_assign(job_owner[j], seen)) { job_owner[j] = w; return true; }   // augment
        }
        return false;
    };
    int matched = 0;
    for (std::size_t w = 0; w < worker.size(); ++w) { std::vector<bool> seen(job.size()); matched += try_assign(static_cast<int>(w), seen); }
    std::cout << "maximum matching = " << matched << ":";
    for (std::size_t j = 0; j < job.size(); ++j) if (job_owner[j] != -1) std::cout << ' ' << worker[job_owner[j]] << "->" << job[j];
    std::cout << '\n';
}
```

**Output:**
```text
square 0-1-2-3-0 bipartite? true
triangle 0-1-2-0 bipartite? false
maximum matching = 3: Bea->backend Ali->frontend Chen->devops
```

Nobody can do QA, so at most 3 of the 4 workers can get a job. Chen and Dina both want devops; the algorithm gave it to Chen, and Dina waits.

### Interview answer
"A graph is bipartite if its vertices split into two sides with every edge crossing, which is equivalent to having no odd cycle. I test it by BFS 2-colouring in O(V + E) and fail on an edge with equal colours. The classic follow-up is maximum bipartite matching — Kuhn's augmenting paths in O(VE), or Hopcroft–Karp in O(E√V)."

---

## 7. Spanning trees (Minimum Spanning Tree, Maximum Spanning Tree)

**In one sentence:** a spanning tree connects **all V vertices with exactly V − 1 edges and no cycles**; the **minimum spanning tree (MST)** is the one with the **smallest total weight** (Kruskal or Prim), and the **maximum spanning tree** is the one with the largest.

### In plain words
You must connect 6 villages with power lines and each possible line has a cost. You want every village powered, no wasted loops, and the lowest total cost. That's an MST.

### How it works
- **Cut property:** for any split of the vertices into two groups, the **cheapest edge crossing the split** is in some MST. Both algorithms rely on it.
- **Kruskal:** sort edges by weight; add each edge if it **doesn't create a cycle**, checked with a **union-find (disjoint set union)**. O(E log E). Works on the edge list.
- **Prim:** grow one tree from a start vertex; always add the cheapest edge leaving the tree (min-heap). O(E log V). Good for dense graphs and adjacency lists.
- **Maximum spanning tree:** same algorithms, edges sorted **descending** (or negate the weights). Used for "widest path / maximum bottleneck" problems: the path in a maximum spanning tree between two vertices maximizes its smallest edge.
- Uses: network and cable design, clustering (remove the k − 1 heaviest MST edges to get k clusters), approximation for the travelling salesman problem (MST-based 2-approximation), image segmentation.
- If all edge weights are distinct, the MST is **unique**.

#### Modern C++ example — Kruskal with union-find (minimum and maximum) and Prim
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <functional>
#include <iostream>
#include <numeric>
#include <queue>
#include <vector>

struct Edge { int u, v, w; };

class DSU {
public:
    explicit DSU(int n) : p_(n), rank_(n, 0) { std::iota(p_.begin(), p_.end(), 0); }
    int find(int x) { return p_[x] == x ? x : p_[x] = find(p_[x]); }           // path compression
    bool unite(int a, int b) {
        a = find(a); b = find(b);
        if (a == b) return false;                                              // would form a cycle
        if (rank_[a] < rank_[b]) std::swap(a, b);
        p_[b] = a;
        if (rank_[a] == rank_[b]) ++rank_[a];
        return true;
    }
private:
    std::vector<int> p_, rank_;
};

int kruskal(int V, std::vector<Edge> edges, bool maximum, std::vector<Edge>& chosen) {
    std::sort(edges.begin(), edges.end(), [&](const Edge& a, const Edge& b) { return maximum ? a.w > b.w : a.w < b.w; });
    DSU dsu(V);
    int total = 0;
    for (const auto& e : edges)
        if (dsu.unite(e.u, e.v)) { chosen.push_back(e); total += e.w; }
    return total;
}

int prim(int V, const std::vector<Edge>& edges) {
    std::vector<std::vector<std::pair<int, int>>> g(V);
    for (auto [u, v, w] : edges) { g[u].push_back({w, v}); g[v].push_back({w, u}); }
    std::vector<bool> in_tree(V);
    std::priority_queue<std::pair<int, int>, std::vector<std::pair<int, int>>, std::greater<>> pq;
    pq.push({0, 0});
    int total = 0;
    while (!pq.empty()) {
        auto [w, u] = pq.top(); pq.pop();
        if (in_tree[u]) continue;
        in_tree[u] = true;
        total += w;
        for (auto [wv, v] : g[u]) if (!in_tree[v]) pq.push({wv, v});
    }
    return total;
}

int main() {
    const int V = 6;
    std::vector<Edge> edges{{0, 1, 4}, {0, 2, 3}, {1, 2, 1}, {1, 3, 2}, {2, 3, 4},
                            {3, 4, 2}, {4, 5, 6}, {3, 5, 5}, {2, 4, 7}};
    std::vector<Edge> mst, maxst;
    int min_total = kruskal(V, edges, false, mst);
    std::cout << "Kruskal MST (" << mst.size() << " edges, total " << min_total << "):";
    for (auto [u, v, w] : mst) std::cout << ' ' << u << '-' << v << '(' << w << ')';
    std::cout << "\nPrim MST total: " << prim(V, edges) << '\n';
    int max_total = kruskal(V, edges, true, maxst);
    std::cout << "maximum spanning tree total " << max_total << ":";
    for (auto [u, v, w] : maxst) std::cout << ' ' << u << '-' << v << '(' << w << ')';
    std::cout << '\n';
}
```

**Output:**
```text
Kruskal MST (5 edges, total 13): 1-2(1) 1-3(2) 3-4(2) 0-2(3) 3-5(5)
Prim MST total: 13
maximum spanning tree total 25: 2-4(7) 4-5(6) 3-5(5) 0-1(4) 0-2(3)
```

### Interview answer
"A spanning tree connects all vertices with V − 1 edges and no cycle; the MST minimizes total weight. Kruskal sorts edges and adds each one unless union-find says its ends are already connected — O(E log E). Prim grows a single tree with a min-heap of crossing edges — O(E log V). Both are correct because of the cut property. For a maximum spanning tree I sort descending; it's useful for maximum-bottleneck paths and for clustering by cutting the heaviest edges of an MST."

---

## 8. Graphs with special properties (e.g., planar graphs, Eulerian graphs)

**In one sentence:** some graph families have properties that make hard questions easy (or prove them impossible): **Eulerian** graphs have a walk using **every edge once**, **Hamiltonian** graphs have a cycle through **every vertex once**, **planar** graphs can be drawn **without crossing edges**, plus **complete**, **regular** and **tree** graphs.

### In plain words
- **Eulerian:** can you draw the shape without lifting your pen and without tracing any line twice? (The famous "Seven Bridges of Königsberg" puzzle — Euler proved in 1736 that it's impossible.)
- **Hamiltonian:** can a salesperson visit every city exactly once and come home?
- **Planar:** can you draw the subway map on paper with no lines crossing?

### How it works
| Property | Definition | Test / key fact |
|---|---|---|
| **Eulerian circuit** | closed walk using every edge once | connected (ignoring isolated vertices) and **every degree is even**; directed: in = out everywhere |
| **Eulerian path** | walk using every edge once | **exactly 0 or 2** vertices with odd degree; start at an odd one |
| **Hamiltonian cycle** | cycle visiting every vertex once | **NP-complete** to decide; sufficient condition (Dirac): every degree ≥ V/2 |
| **Planar** | drawable without crossings | **Euler's formula V − E + F = 2**; so **E ≤ 3V − 6** (for V ≥ 3); Kuratowski: no K₅ or K₃,₃ subdivision; linear-time tests exist (Hopcroft–Tarjan) |
| **Complete Kₙ** | every pair connected | n(n−1)/2 edges |
| **k-regular** | every degree = k | E = kV/2 |
| **Tree / forest** | connected acyclic / acyclic | E = V − 1 / E = V − components |

- **Hierholzer's algorithm** finds an Eulerian circuit in O(E): walk until stuck, then splice in sub-tours from vertices that still have unused edges.
- **Four colour theorem:** every planar graph can be coloured with **at most 4 colours** so neighbours differ (map colouring).
- Uses: Eulerian paths in DNA sequencing (de Bruijn graphs), route inspection for snow ploughs and postmen (Chinese postman problem); planarity in chip and circuit-board layout; Hamiltonian cycles behind the travelling salesman problem.

#### Modern C++ example — Eulerian check + Hierholzer, and the planar edge bound
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <iostream>
#include <stack>
#include <vector>

struct Graph {
    int V;
    std::vector<std::pair<int, int>> edges;
    std::vector<std::vector<std::pair<int, int>>> adj;           // (neighbour, edge id)
    Graph(int v, std::vector<std::pair<int, int>> es) : V(v), edges(std::move(es)), adj(v) {
        for (int i = 0; i < static_cast<int>(edges.size()); ++i) {
            adj[edges[i].first].push_back({edges[i].second, i});
            adj[edges[i].second].push_back({edges[i].first, i});
        }
    }
    int odd_vertices() const {
        return static_cast<int>(std::count_if(adj.begin(), adj.end(), [](const auto& a) { return a.size() % 2 == 1; }));
    }
};

std::vector<int> hierholzer(const Graph& g, int start) {
    std::vector<bool> used(g.edges.size());
    std::vector<std::size_t> next(g.V, 0);
    std::stack<int> st;
    std::vector<int> tour;
    st.push(start);
    while (!st.empty()) {
        int u = st.top();
        while (next[u] < g.adj[u].size() && used[g.adj[u][next[u]].second]) ++next[u];
        if (next[u] == g.adj[u].size()) { tour.push_back(u); st.pop(); continue; }   // stuck: emit
        auto [v, id] = g.adj[u][next[u]];
        used[id] = true;
        st.push(v);
    }
    std::reverse(tour.begin(), tour.end());
    return tour;
}

int main() {
    Graph konigsberg(4, {{0, 1}, {0, 1}, {0, 2}, {0, 2}, {0, 3}, {1, 3}, {2, 3}});   // 7 bridges, 4 land masses
    std::cout << "Konigsberg: " << konigsberg.odd_vertices() << " odd-degree vertices -> no Eulerian path\n";

    Graph house(5, {{0, 1}, {1, 2}, {2, 3}, {3, 0}, {0, 2}, {1, 3}, {2, 4}, {3, 4}});   // "house of Nikolaus"
    int odd = house.odd_vertices();
    int start = 0;
    for (int v = 0; v < house.V; ++v) if (house.adj[v].size() % 2) { start = v; break; }
    std::cout << "house: " << odd << " odd-degree vertices -> Eulerian path from " << start << ":";
    for (int v : hierholzer(house, start)) std::cout << ' ' << v;
    std::cout << '\n';

    for (int n : {4, 5}) {
        int V = n, E = n * (n - 1) / 2;
        std::cout << "K" << n << ": E=" << E << ", planar bound 3V-6=" << 3 * V - 6
                  << (E <= 3 * V - 6 ? " -> may be planar" : " -> NOT planar") << '\n';
    }
}
```

**Output:**
```text
Konigsberg: 4 odd-degree vertices -> no Eulerian path
house: 2 odd-degree vertices -> Eulerian path from 0: 0 1 2 3 0 2 4 3 1
K4: E=6, planar bound 3V-6=6 -> may be planar
K5: E=10, planar bound 3V-6=9 -> NOT planar
```

### Interview answer
"An Eulerian circuit uses every edge once and exists exactly when the graph is connected and all degrees are even; with exactly two odd vertices there's an Eulerian path between them, and Hierholzer's algorithm finds it in O(E). A Hamiltonian cycle visits every vertex once and is NP-complete. Planar graphs can be drawn without crossings; Euler's formula V − E + F = 2 gives E ≤ 3V − 6, which proves K₅ isn't planar, and by Kuratowski a graph is planar iff it has no K₅ or K₃,₃ subdivision."

---

## Cheat sheet

| Topic | Remember |
|---|---|
| Representations | list O(V+E) default · matrix O(V²), O(1) edge check · edge list for Kruskal / Bellman–Ford · incidence V×E |
| BFS | queue; shortest path by edges; O(V + E) |
| DFS | stack/recursion; cycles, topo sort, SCCs; O(V + E) |
| Directed | in/out degree; grey-vertex back edge = cycle; SCCs via Kosaraju / Tarjan |
| DAG | topological order exists; Kahn's algorithm (in-degree 0) also detects cycles; DP for longest path |
| Weighted | Dijkstra (≥ 0, heap) · Bellman–Ford (negatives, detects negative cycles) · Floyd–Warshall (all pairs) |
| Bipartite | 2-colourable ⇔ no odd cycle; BFS test; matching: Kuhn / Hopcroft–Karp |
| MST | V − 1 edges; Kruskal (sort + union-find) · Prim (heap); cut property; max ST = sort descending |
| Eulerian | circuit: all degrees even · path: 0 or 2 odd vertices; Hierholzer O(E) |
| Hamiltonian | every vertex once; NP-complete |
| Planar | V − E + F = 2; E ≤ 3V − 6; no K₅ / K₃,₃; 4 colours suffice |
