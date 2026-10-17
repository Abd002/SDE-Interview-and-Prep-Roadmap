# Hash Tables — Hash Functions, Collisions, Robin Hood, Cuckoo, Perfect Hashing, Bloom Filters and Count-Min Sketch

> **What you'll learn:** how a **hash function** turns a key into an array index, the two ways to handle **collisions** (chaining and open addressing), two clever open-addressing schemes (**Robin Hood** and **cuckoo hashing**), **perfect hashing** for fixed key sets, and two **probabilistic** structures built on hashing (**Bloom filters** and **Count-Min Sketch**). Each part has a runnable C++ example.
>
> **Prerequisites:** [Arrays](./Arrays.md) and [Linked Lists](./LinkedList.md).

## Table of Contents
0. [What is a hash table?](#0-what-is-a-hash-table)
1. [Hash functions](#1-hash-functions)
2. [Collision resolution techniques (chaining, open addressing)](#2-collision-resolution-techniques-chaining-open-addressing)
3. [Robin Hood Hashing](#3-robin-hood-hashing)
4. [Cuckoo Hashing](#4-cuckoo-hashing)
5. [Perfect Hashing](#5-perfect-hashing)
6. [Bloom Filters](#6-bloom-filters)
7. [Count-Min Sketch](#7-count-min-sketch)
8. [Cheat sheet](#cheat-sheet)

---

## 0. What is a hash table?

**In one sentence:** a hash table stores key → value pairs in an array and uses a **hash function** to compute **which slot** a key belongs in, so insert, lookup and delete take **O(1) on average**.

### In plain words
A coat check. You hand over your coat and get ticket #37; the attendant hangs it on hook 37. Later, ticket #37 takes them straight to the hook — no searching through every coat. The hash function is the rule that turns "your coat" into "hook 37".

### How it works
1. `index = hash(key) % number_of_buckets`.
2. Two different keys can land on the same index — a **collision**. Every hash table needs a plan for that (section 2).
3. **Load factor** α = items / buckets. As α grows, collisions grow. When α passes a limit (often 0.75, or 1.0 for chaining), the table **resizes** (usually doubles) and **rehashes** every item. Resizing is O(n) but rare, so inserts stay **amortized O(1)**.
4. **Worst case** is O(n) if many keys collide (bad hash or an attacker choosing keys).

In C++: `std::unordered_map` / `std::unordered_set` (chaining). Faster open-addressing tables: Abseil `flat_hash_map`, `boost::unordered_flat_map`, `ankerl::unordered_dense`.

| | Hash table | Balanced BST (`std::map`) |
|---|---|---|
| Lookup / insert | O(1) average, O(n) worst | O(log n) worst |
| Ordered iteration, range queries | no | yes |
| Needs | a hash + equality | a `<` comparison |

---

## 1. Hash functions

**In one sentence:** a hash function maps a key of any size to a fixed-size number, and a good one is **fast**, **deterministic**, and spreads keys **uniformly** so similar keys land far apart.

### In plain words
A blender for data. Put in "cat" and you always get the same smoothie number. Put in "cau" — one letter different — and you get a completely different number.

### How it works
**What makes a good hash for a hash table**
- **Deterministic:** same key → same hash, always (within one run at least).
- **Uniform:** each bucket is about equally likely.
- **Avalanche:** changing one input bit flips about half the output bits.
- **Fast:** it runs on every lookup.
- **Consistent with equality:** if `a == b`, then `hash(a) == hash(b)`.

**Common hash functions**
| Type | Examples | Use |
|---|---|---|
| Simple non-cryptographic | **FNV-1a**, polynomial rolling hash (`h = h*31 + c`) | teaching, small tables, Rabin–Karp |
| Fast non-cryptographic | **MurmurHash3**, **xxHash**, **wyhash**, CityHash | hash tables, Bloom filters |
| Keyed (anti-DoS) | **SipHash** (Python, Rust's default `HashMap`) | tables that take untrusted keys |
| Cryptographic | **SHA-256**, BLAKE3 | integrity, signatures — too slow for tables |

**From hash to bucket index**
- **Modulo a prime:** `h % p` hides patterns in weak hashes.
- **Power-of-two table + mask:** `h & (size − 1)` is faster, but it only uses the **low bits**, so the hash must mix well (identity hashing of integers multiples of 8 would leave buckets empty).
- **Fibonacci / multiplicative hashing:** `(h * 11400714819323198485) >> (64 − bits)` — uses the high bits and mixes well.

**Hash flooding:** if an attacker knows your hash function, they can send keys that all collide and turn O(1) into O(n) (a denial-of-service attack). The fix is a **random seed** per process (SipHash, seeded wyhash).

> **Note:** libstdc++'s `std::hash<int>` is the **identity** function, so `std::unordered_map<int, …>` relies on a prime bucket count to spread keys.

#### Modern C++ example — FNV-1a, avalanche, and why masking needs a mixing step
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <bit>
#include <cstdint>
#include <iostream>
#include <set>
#include <string_view>

std::uint64_t fnv1a(std::string_view s) {
    std::uint64_t h = 14695981039346656037ull;          // FNV offset basis
    for (unsigned char c : s) { h ^= c; h *= 1099511628211ull; }   // FNV prime
    return h;
}

std::uint64_t mix(std::uint64_t x) {                     // splitmix64 finalizer: strong avalanche
    x ^= x >> 30; x *= 0xbf58476d1ce4e5b9ull;
    x ^= x >> 27; x *= 0x94d049bb133111ebull;
    return x ^ (x >> 31);
}

int main() {
    std::cout << std::hex << "fnv1a(\"cat\") = " << fnv1a("cat") << "\nfnv1a(\"cau\") = " << fnv1a("cau") << std::dec << '\n';
    std::cout << "bits that differ, FNV-1a alone:   " << std::popcount(fnv1a("cat") ^ fnv1a("cau")) << " of 64\n";
    std::cout << "bits that differ, FNV-1a + mix:   " << std::popcount(mix(fnv1a("cat")) ^ mix(fnv1a("cau"))) << " of 64\n";

    // Keys 0, 8, 16, ... (e.g. aligned pointers) into 16 buckets with "identity hash & 15".
    std::set<std::uint64_t> identity_buckets, mixed_buckets;
    for (std::uint64_t k = 0; k < 1000 * 8; k += 8) {
        identity_buckets.insert(k & 15);
        mixed_buckets.insert(mix(k) & 15);
    }
    std::cout << "identity hash uses " << identity_buckets.size() << " of 16 buckets\n";
    std::cout << "mixed hash uses    " << mixed_buckets.size() << " of 16 buckets\n";
}
```

**Output:**
```text
fnv1a("cat") = f5e307190ce4a327
fnv1a("cau") = f5e306190ce4a174
bits that differ, FNV-1a alone:   6 of 64
bits that differ, FNV-1a + mix:   33 of 64
identity hash uses 2 of 16 buckets
mixed hash uses    16 of 16 buckets
```

FNV-1a alone flips only 6 bits when the **last** letter changes — its avalanche is weak for the final bytes. A **finalizer** (the `mix` step) brings it to about half of the bits, and it also fixes the "aligned keys use only 2 buckets" problem.

### Interview answer
"A hash function maps a key to a fixed-size integer; for a table it must be deterministic, consistent with equality, fast and uniform with good avalanche. I'd use something like xxHash or wyhash, or a seeded SipHash when keys come from untrusted users, to prevent hash-flooding attacks. With a power-of-two table I'd mix the hash before masking, because masking keeps only the low bits."

---

## 2. Collision resolution techniques (chaining, open addressing)

**In one sentence:** **separate chaining** keeps a small list per bucket, while **open addressing** stores everything in the array itself and **probes** other slots until it finds a free one.

### In plain words
Two people get the same hook number at the coat check.
- **Chaining:** hang both coats on the same hook, one behind the other.
- **Open addressing:** hook 37 is taken, so try hook 38, then 39… until you find an empty one. To find your coat later, follow the same path.

### How it works
**Separate chaining**
- Each bucket holds a linked list (or a small vector) of entries.
- Average chain length = α, so lookup is O(1 + α). Works even with α > 1.
- Delete is easy. `std::unordered_map` uses chaining (it promises stable references to elements, which forces node-based storage).
- Costs: a pointer and a heap allocation per entry, poor cache locality.

**Open addressing**
- One flat array of slots; α must stay **< 1** (usually ≤ 0.7–0.9).
- **Probing sequences** for the i-th attempt:
  - **Linear probing:** `h + i` — best cache behaviour, but creates **primary clustering** (long runs of full slots).
  - **Quadratic probing:** `h + i²` (or triangular numbers `h + i(i+1)/2` with a power-of-two size) — less clustering.
  - **Double hashing:** `h₁ + i·h₂` — the step size depends on the key; least clustering.
- **Delete** can't just empty a slot, because that would break other keys' probe paths. Use a **tombstone** ("deleted, keep probing") or **backward-shift deletion** (linear probing).
- Expected probes for an **unsuccessful** search with linear probing ≈ ½(1 + 1/(1−α)²): about 2.5 at α = 0.5 but **50.5 at α = 0.9**.

#### Modern C++ example — chaining vs. linear probing, with probe counts and tombstones
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <cstdint>
#include <iostream>
#include <list>
#include <optional>
#include <string>
#include <vector>

std::uint64_t mix(std::uint64_t x) {
    x ^= x >> 30; x *= 0xbf58476d1ce4e5b9ull; x ^= x >> 27; x *= 0x94d049bb133111ebull; return x ^ (x >> 31);
}

class ChainingMap {
public:
    explicit ChainingMap(std::size_t buckets) : b_(buckets) {}
    void put(std::uint64_t k, std::string v) {
        auto& chain = b_[mix(k) % b_.size()];
        for (auto& [key, val] : chain) if (key == k) { val = std::move(v); return; }
        chain.emplace_back(k, std::move(v));
    }
    std::optional<std::string> get(std::uint64_t k) const {
        for (const auto& [key, val] : b_[mix(k) % b_.size()]) if (key == k) return val;
        return std::nullopt;
    }
    std::size_t longest_chain() const {
        std::size_t m = 0;
        for (const auto& c : b_) m = std::max(m, c.size());
        return m;
    }
private:
    std::vector<std::list<std::pair<std::uint64_t, std::string>>> b_;
};

class LinearProbingSet {
    enum State : char { EMPTY, FULL, DELETED };
public:
    explicit LinearProbingSet(std::size_t cap) : keys_(cap), state_(cap, EMPTY) {}
    void insert(std::uint64_t k) {
        std::size_t i = mix(k) % keys_.size();
        std::optional<std::size_t> reuse;
        while (state_[i] != EMPTY) {
            if (state_[i] == FULL && keys_[i] == k) return;
            if (state_[i] == DELETED && !reuse) reuse = i;       // remember the first tombstone
            i = (i + 1) % keys_.size();
        }
        std::size_t slot = reuse.value_or(i);
        keys_[slot] = k; state_[slot] = FULL;
    }
    bool contains(std::uint64_t k, int* probes = nullptr) const {
        std::size_t i = mix(k) % keys_.size();
        int p = 1;
        while (state_[i] != EMPTY) {                             // tombstones keep the search going
            if (state_[i] == FULL && keys_[i] == k) { if (probes) *probes = p; return true; }
            i = (i + 1) % keys_.size(); ++p;
        }
        if (probes) *probes = p;
        return false;
    }
    void erase(std::uint64_t k) {
        std::size_t i = mix(k) % keys_.size();
        while (state_[i] != EMPTY) {
            if (state_[i] == FULL && keys_[i] == k) { state_[i] = DELETED; return; }
            i = (i + 1) % keys_.size();
        }
    }
private:
    std::vector<std::uint64_t> keys_;
    std::vector<State> state_;
};

int main() {
    ChainingMap m(8);
    for (std::uint64_t k = 1; k <= 20; ++k) m.put(k, "user" + std::to_string(k));
    std::cout << "chaining: 20 keys in 8 buckets (load 2.5), get(7) = " << *m.get(7)
              << ", longest chain = " << m.longest_chain() << '\n';

    for (double load : {0.5, 0.9}) {
        const std::size_t cap = 10000;
        LinearProbingSet s(cap);
        auto n = static_cast<std::uint64_t>(load * cap);
        for (std::uint64_t k = 0; k < n; ++k) s.insert(k);
        long total = 0;
        for (std::uint64_t k = 1'000'000; k < 1'010'000; ++k) { int p; s.contains(k, &p); total += p; }
        std::cout << "linear probing at load " << load << ": average probes for a miss = " << total / 10000.0 << '\n';
    }

    LinearProbingSet s(16);
    for (std::uint64_t k : {1, 2, 3, 4, 5}) s.insert(k);
    s.erase(3);
    std::cout << std::boolalpha << "after erase(3): contains 3? " << s.contains(3)
              << ", contains 5? " << s.contains(5) << " (tombstone keeps probe paths intact)\n";
}
```

**Output:**
```text
chaining: 20 keys in 8 buckets (load 2.5), get(7) = user7, longest chain = 5
linear probing at load 0.5: average probes for a miss = 2.5305
linear probing at load 0.9: average probes for a miss = 50.738
after erase(3): contains 3? false, contains 5? true (tombstone keeps probe paths intact)
```

### Interview answer
"With separate chaining each bucket holds a list, so lookups are O(1 + α), the load factor can exceed 1 and deletes are simple, but there's a pointer and allocation per entry. Open addressing keeps everything in one array and probes — linear, quadratic or double hashing — which is much more cache-friendly, but the load factor must stay well below 1 because probe counts explode near full, and deletes need tombstones or backward shifting. Either way I resize and rehash past a load-factor threshold so operations stay amortized O(1)."

---

## 3. Robin Hood Hashing

**In one sentence:** Robin Hood hashing is linear probing where, during insert, a key that has travelled **far from its home slot** may **take the slot of a key that is closer to home** ("take from the rich, give to the poor"), which keeps all probe lengths short and similar.

### In plain words
At a cinema, everyone wants to sit near their ticket's seat number. If you've had to walk 5 seats past yours and you find someone only 1 seat from theirs, you take their seat and **they** keep walking. Nobody ends up very far from their seat.

### How it works
- Each entry stores (or can compute) its **probe distance**: how far it sits from its home slot `hash(key) % size`.
- **Insert:** walk from the home slot. At each full slot, compare distances. If the resident's distance is **smaller** than yours, **swap**: you take the slot and continue inserting the evicted resident.
- **Lookup can stop early:** if you reach a slot whose resident's distance is **smaller than the distance you have walked**, your key can't be further on — it would have taken this slot.
- **Delete with backward shift:** remove the entry and move the following entries back one slot until you hit an empty slot or an entry at distance 0. No tombstones.
- **Result:** the average probe length is similar to linear probing, but the **variance and the maximum** are much smaller, so tables can run at high load (0.9+) safely. Used in Rust's old `HashMap`, many game engines, and `robin_hood::unordered_map`.

#### Modern C++ example — Robin Hood insert, early-exit lookup and backward-shift delete
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <cstdint>
#include <iostream>
#include <utility>
#include <vector>

std::uint64_t mix(std::uint64_t x) {
    x ^= x >> 30; x *= 0xbf58476d1ce4e5b9ull; x ^= x >> 27; x *= 0x94d049bb133111ebull; return x ^ (x >> 31);
}

class RobinHoodSet {
    struct Slot { std::uint64_t key; int dist = -1; };          // dist -1 = empty
public:
    explicit RobinHoodSet(std::size_t cap) : s_(cap) {}
    void insert(std::uint64_t key) {
        Slot cur{key, 0};
        std::size_t i = home(key);
        while (true) {
            if (s_[i].dist < 0) { s_[i] = cur; return; }
            if (s_[i].key == cur.key) return;
            if (s_[i].dist < cur.dist) std::swap(s_[i], cur);     // rob the richer resident
            i = (i + 1) % s_.size();
            ++cur.dist;
        }
    }
    bool contains(std::uint64_t key) const {
        std::size_t i = home(key);
        for (int d = 0; s_[i].dist >= d; ++d, i = (i + 1) % s_.size())   // early exit
            if (s_[i].key == key) return true;
        return false;
    }
    void erase(std::uint64_t key) {
        std::size_t i = home(key);
        for (int d = 0; s_[i].dist >= d; ++d, i = (i + 1) % s_.size()) {
            if (s_[i].key != key) continue;
            std::size_t next = (i + 1) % s_.size();
            while (s_[next].dist > 0) {                             // backward shift
                s_[i] = s_[next];
                --s_[i].dist;
                i = next;
                next = (next + 1) % s_.size();
            }
            s_[i].dist = -1;
            return;
        }
    }
    int max_dist() const { int m = 0; for (const auto& x : s_) m = std::max(m, x.dist); return m; }
    double avg_dist() const {
        long sum = 0, n = 0;
        for (const auto& x : s_) if (x.dist >= 0) { sum += x.dist; ++n; }
        return double(sum) / n;
    }
private:
    std::size_t home(std::uint64_t k) const { return mix(k) % s_.size(); }
    std::vector<Slot> s_;
};

// Plain linear probing for comparison (distance from home only).
std::pair<double, int> linear_stats(std::size_t cap, std::size_t n) {
    std::vector<int> dist(cap, -1);
    for (std::uint64_t k = 0; k < n; ++k) {
        std::size_t i = mix(k) % cap; int d = 0;
        while (dist[i] >= 0) { i = (i + 1) % cap; ++d; }
        dist[i] = d;
    }
    long sum = 0; int mx = 0;
    for (int d : dist) if (d >= 0) { sum += d; mx = std::max(mx, d); }
    return {double(sum) / n, mx};
}

int main() {
    const std::size_t cap = 10000, n = 9000;                       // load factor 0.9
    RobinHoodSet rh(cap);
    for (std::uint64_t k = 0; k < n; ++k) rh.insert(k);
    auto [lin_avg, lin_max] = linear_stats(cap, n);
    std::cout << "load 0.9, plain linear probing: avg distance " << lin_avg << ", max " << lin_max << '\n';
    std::cout << "load 0.9, Robin Hood:           avg distance " << rh.avg_dist() << ", max " << rh.max_dist() << '\n';

    rh.erase(42);
    std::cout << std::boolalpha << "after erase(42): contains 42? " << rh.contains(42)
              << ", contains 43? " << rh.contains(43) << ", contains 123456? " << rh.contains(123456) << '\n';
}
```

**Output:**
```text
load 0.9, plain linear probing: avg distance 4.11567, max 270
load 0.9, Robin Hood:           avg distance 4.11567, max 27
after erase(42): contains 42? false, contains 43? true, contains 123456? false
```

The **average** is the same (Robin Hood only reorders keys inside each cluster), but the **worst** probe length drops sharply — that's the whole point.

### Interview answer
"Robin Hood hashing is linear probing with a swap rule: when inserting, if the resident is closer to its home slot than I am to mine, I take its slot and keep inserting the resident. That equalizes probe lengths, so the maximum and variance drop a lot even at 90% load. Lookups stop early once the resident's distance is smaller than how far I've walked, and deletes use backward shifting, so there are no tombstones."

---

## 4. Cuckoo Hashing

**In one sentence:** cuckoo hashing gives every key **exactly two possible slots** (from two hash functions), so a lookup checks **at most two places — O(1) worst case**; an insert that finds both taken **kicks out** one resident, which moves to its other slot, and so on.

### In plain words
A cuckoo bird lays its egg in another bird's nest and pushes the old egg out. Here, a new key pushes an old key out of its nest, and the old key flies to its **other** nest — maybe pushing someone else out there.

### How it works
- Two tables `T1`, `T2` and two hash functions `h1`, `h2`. Key `k` can only live at `T1[h1(k)]` or `T2[h2(k)]`.
- **Lookup / delete:** check both slots. **Worst case O(1).** This is the big win.
- **Insert:** put `k` in `T1[h1(k)]`. If someone `x` was there, move `x` to `T2[h2(x)]`; if that evicts `y`, move `y` to `T1[h1(y)]`, and so on.
- If evictions go on too long (a **cycle**), **rehash** everything with new hash functions (or grow the tables).
- With 2 tables and 1 key per slot, the load factor must stay **below about 50%**. Variants push this up: **4-way buckets** reach about 95%, and 3+ hash functions help too.
- Used in network switches and routers (fixed lookup time in hardware), **cuckoo filters** (a Bloom-filter alternative that supports delete), and some GPU hash tables.

#### Modern C++ example — cuckoo hash set with eviction and rehash
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <cstdint>
#include <iostream>
#include <optional>
#include <utility>
#include <vector>

class CuckooSet {
public:
    explicit CuckooSet(std::size_t cap) : t_{std::vector<std::optional<std::uint64_t>>(cap),
                                            std::vector<std::optional<std::uint64_t>>(cap)} {}
    bool contains(std::uint64_t k) const {
        return t_[0][slot(0, k)] == k || t_[1][slot(1, k)] == k;          // at most 2 probes
    }
    void insert(std::uint64_t k) {
        if (contains(k)) return;
        std::uint64_t cur = k;
        int table = 0;
        for (int kicks = 0; kicks < 32; ++kicks) {
            auto& cell = t_[table][slot(table, cur)];
            if (!cell) { cell = cur; return; }
            std::swap(cur, *cell);                                        // evict the resident
            ++evictions_;
            table ^= 1;                                                   // it goes to its other table
        }
        rehash();                                                         // probably a cycle
        insert(cur);
    }
    long evictions() const { return evictions_; }
    int rehashes() const { return rehashes_; }
private:
    std::size_t slot(int table, std::uint64_t k) const {
        std::uint64_t x = k + seed_ * (table + 1) * 0x9e3779b97f4a7c15ull;
        x ^= x >> 30; x *= 0xbf58476d1ce4e5b9ull; x ^= x >> 27; x *= 0x94d049bb133111ebull; x ^= x >> 31;
        return x % t_[table].size();
    }
    void rehash() {
        ++rehashes_;
        ++seed_;                                                          // new hash functions
        std::vector<std::uint64_t> all;
        for (auto& t : t_) for (auto& c : t) if (c) { all.push_back(*c); c.reset(); }
        for (auto k : all) insert(k);
    }
    std::vector<std::optional<std::uint64_t>> t_[2];
    std::uint64_t seed_ = 1;
    long evictions_ = 0;
    int rehashes_ = 0;
};

int main() {
    CuckooSet s(1000);                                                    // 2000 slots in total
    for (std::uint64_t k = 0; k < 900; ++k) s.insert(k * 7919);           // load 0.45
    int found = 0;
    for (std::uint64_t k = 0; k < 900; ++k) found += s.contains(k * 7919);
    std::cout << "inserted 900 keys into 2x1000 slots: found " << found
              << ", evictions " << s.evictions() << ", rehashes " << s.rehashes() << '\n';
    std::cout << std::boolalpha << "contains 7919? " << s.contains(7919) << ", contains 7920? " << s.contains(7920)
              << " (each lookup checks 2 slots)\n";
}
```

**Output:**
```text
inserted 900 keys into 2x1000 slots: found 900, evictions 544, rehashes 0
contains 7919? true, contains 7920? false (each lookup checks 2 slots)
```

### Interview answer
"Cuckoo hashing gives each key two candidate slots from two hash functions, so lookups and deletes are worst-case O(1). Inserting into an occupied slot evicts the resident to its alternate slot, which may cascade; if it loops, we rehash with new functions. The trade-off is a lower load factor — under 50% for the basic two-table version, up to about 95% with 4-slot buckets — and inserts that are only expected O(1)."

---

## 5. Perfect Hashing

**In one sentence:** perfect hashing builds, **for a fixed set of keys known in advance**, a hash function with **no collisions at all**, so every lookup is **one probe, worst case O(1)**.

### In plain words
If you know the exact guest list for a wedding, you can print a seat number on every invitation so that no two guests share a seat. You can't do that for strangers who show up later — but for the known list, finding a seat is instant.

### How it works
- **Static set only:** the keys don't change (keywords of a programming language, a dictionary on a phone, a router's fixed table, file extensions).
- **FKS two-level scheme** (Fredman, Komlós and Szemerédi, 1984):
  1. Hash n keys into n buckets with a random universal hash.
  2. For a bucket with b keys, build a second-level table of size **b²** with its own random hash, retrying until it has no collisions (with size b², a random hash is collision-free with probability ≥ ½).
  3. Total expected space is **O(n)**, lookup is two hashes → O(1) worst case.
- **Minimal perfect hash function (MPHF):** maps n keys to exactly **0 … n−1** with no gaps. Modern builders (CHD, BBHash, RecSplit, PTHash) need only about **2–4 bits per key**.
- **gperf** is a tool that generates a perfect hash function in C/C++ for a keyword list; compilers use similar tables for reserved words.
- A lookup of a key **not** in the set still lands somewhere, so store the key (or a fingerprint) and compare.

#### Modern C++ example — a "hash and displace" minimal perfect hash for keywords
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <cstdint>
#include <iostream>
#include <optional>
#include <string>
#include <string_view>
#include <vector>

std::uint64_t h(std::string_view s, std::uint64_t seed) {
    std::uint64_t x = 14695981039346656037ull ^ (seed * 0x9e3779b97f4a7c15ull);
    for (unsigned char c : s) { x ^= c; x *= 1099511628211ull; }
    x ^= x >> 31; x *= 0xbf58476d1ce4e5b9ull; x ^= x >> 29;
    return x;
}

// Hash-and-displace: bucket keys by h(k,0); for each bucket (largest first) find a seed
// that sends all its keys to free slots. Lookup = slot of h(k, seed[bucket(k)]).
class MinimalPerfectHash {
public:
    explicit MinimalPerfectHash(const std::vector<std::string>& keys) : n_(keys.size()), seed_(keys.size()), keys_(keys.size()) {
        std::vector<std::vector<std::string>> buckets(n_);
        for (const auto& k : keys) buckets[h(k, 0) % n_].push_back(k);
        std::vector<std::size_t> order(n_);
        for (std::size_t i = 0; i < n_; ++i) order[i] = i;
        std::sort(order.begin(), order.end(), [&](auto a, auto b) { return buckets[a].size() > buckets[b].size(); });
        std::vector<bool> used(n_);
        for (std::size_t b : order) {
            if (buckets[b].empty()) continue;
            for (std::uint64_t s = 1;; ++s) {
                std::vector<std::size_t> slots;
                bool ok = true;
                for (const auto& k : buckets[b]) {
                    std::size_t slot = h(k, s) % n_;
                    if (used[slot] || std::find(slots.begin(), slots.end(), slot) != slots.end()) { ok = false; break; }
                    slots.push_back(slot);
                }
                if (!ok) continue;
                seed_[b] = s;
                for (std::size_t i = 0; i < slots.size(); ++i) { used[slots[i]] = true; keys_[slots[i]] = buckets[b][i]; }
                break;
            }
        }
    }
    std::optional<std::size_t> index(std::string_view key) const {          // one probe, worst case
        std::size_t slot = h(key, seed_[h(key, 0) % n_]) % n_;
        if (keys_[slot] == key) return slot;                              // confirm: key may be a stranger
        return std::nullopt;
    }
private:
    std::size_t n_;
    std::vector<std::uint64_t> seed_;
    std::vector<std::string> keys_;
};

int main() {
    std::vector<std::string> keywords{"if", "else", "for", "while", "return", "class",
                                      "struct", "switch", "case", "break", "continue", "template"};
    MinimalPerfectHash mph(keywords);
    std::vector<bool> taken(keywords.size());
    for (const auto& k : keywords) taken[*mph.index(k)] = true;
    std::cout << "12 keywords -> 12 distinct slots: " << std::boolalpha
              << std::all_of(taken.begin(), taken.end(), [](bool b) { return b; }) << '\n';
    for (const char* w : {"while", "template", "banana"}) {
        auto i = mph.index(w);
        std::cout << w << " -> " << (i ? "slot " + std::to_string(*i) : std::string("not a keyword")) << '\n';
    }
}
```

**Output:**
```text
12 keywords -> 12 distinct slots: true
while -> slot 7
template -> slot 11
banana -> not a keyword
```

### Interview answer
"Perfect hashing applies when the key set is static: you build a function with no collisions, so each lookup is one probe, O(1) worst case. The classic FKS scheme uses two levels — the second level for a bucket of size b has b² slots — for O(n) expected space. A minimal perfect hash maps n keys onto exactly 0..n−1 using just a few bits per key; tools like gperf generate them for keyword tables. You still store the key to reject inputs that aren't in the set."

---

## 6. Bloom Filters

**In one sentence:** a Bloom filter is a tiny **bit array + k hash functions** that answers "is x in the set?" with **"definitely not"** or **"probably yes"** — no false negatives, a tunable rate of false positives.

### In plain words
A bouncer with a very small notebook. For each guest, they mark a few boxes. When someone arrives, if **any** of their boxes is unmarked, they were **definitely not** invited. If all are marked, they **probably** were — but the boxes could have been marked by other guests.

### How it works
- `m` bits, all 0. `k` hash functions.
- **Add x:** set bits `h1(x) … hk(x)` to 1.
- **Query x:** if any of those bits is 0 → **definitely not present**. If all are 1 → **probably present**.
- **No delete** (clearing a bit could remove other items). A **counting Bloom filter** (small counters instead of bits) or a **cuckoo filter** supports delete.
- **False-positive rate** after n inserts ≈ **(1 − e^(−kn/m))^k**. Best k = (m/n)·ln 2. About **9.6 bits per item gives 1%**, 14.4 bits gives 0.1% — no matter how big the items are.
- **Double hashing trick:** compute two hashes once and use `g_i = h1 + i·h2` for the k functions.
- **Used by:** LSM-tree databases (**RocksDB, Cassandra, HBase, LevelDB**) to skip disk reads for keys that aren't in an SSTable; web caches (Akamai: only cache "one-hit wonders" on the second request); Chrome's old Safe Browsing list; Bitcoin SPV clients; spell checkers.

#### Modern C++ example — Bloom filter with measured vs. predicted false-positive rate
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <cmath>
#include <cstdint>
#include <iomanip>
#include <iostream>
#include <vector>

class BloomFilter {
public:
    BloomFilter(std::size_t bits, int k) : bits_(bits), k_(k) {}
    void add(std::uint64_t x) { for (int i = 0; i < k_; ++i) bits_[index(x, i)] = true; }
    bool might_contain(std::uint64_t x) const {
        for (int i = 0; i < k_; ++i) if (!bits_[index(x, i)]) return false;     // definitely not
        return true;                                                          // probably yes
    }
private:
    static std::uint64_t mix(std::uint64_t x) {
        x ^= x >> 30; x *= 0xbf58476d1ce4e5b9ull; x ^= x >> 27; x *= 0x94d049bb133111ebull; return x ^ (x >> 31);
    }
    std::size_t index(std::uint64_t x, int i) const {                         // double hashing
        std::uint64_t h1 = mix(x), h2 = mix(h1) | 1;
        return (h1 + static_cast<std::uint64_t>(i) * h2) % bits_.size();
    }
    std::vector<bool> bits_;
    int k_;
};

int main() {
    const std::size_t n = 10000, m = 96000;                        // 9.6 bits per item
    const int k = static_cast<int>(std::round(double(m) / n * std::log(2.0)));   // optimal k = 7
    BloomFilter bf(m, k);
    for (std::uint64_t x = 0; x < n; ++x) bf.add(x);

    int false_negatives = 0;
    for (std::uint64_t x = 0; x < n; ++x) false_negatives += !bf.might_contain(x);
    int false_positives = 0;
    const int trials = 100000;
    for (std::uint64_t x = 1'000'000; x < 1'000'000 + trials; ++x) false_positives += bf.might_contain(x);

    double predicted = std::pow(1 - std::exp(-double(k) * n / m), k);
    std::cout << "bits=" << m << " (" << m / 8 / 1024 << " KiB) items=" << n << " k=" << k << '\n';
    std::cout << "false negatives: " << false_negatives << '\n';
    std::cout << std::fixed << std::setprecision(2)
              << "false positives: " << 100.0 * false_positives / trials << "% (formula predicts "
              << 100 * predicted << "%)\n";
}
```

**Output:**
```text
bits=96000 (11 KiB) items=10000 k=7
false negatives: 0
false positives: 1.06% (formula predicts 1.00%)
```

### Interview answer
"A Bloom filter is an m-bit array with k hash functions: adding sets k bits, a query that finds any 0 bit is definitely absent, and all 1s means probably present. There are no false negatives, and the false-positive rate is about (1 − e^(−kn/m))^k — roughly 10 bits per item for 1%. It can't delete; counting Bloom filters or cuckoo filters can. Databases like RocksDB and Cassandra keep one per SSTable to avoid disk reads for missing keys."

---

## 7. Count-Min Sketch

**In one sentence:** a Count-Min Sketch is a small **2-D array of counters** (d rows × w columns, one hash per row) that estimates **how many times each item appeared** in a huge stream, **never under-counting** and over-counting by at most a small, bounded amount.

### In plain words
Counting how often every word appears in all of Twitter would need a gigantic table. Instead, keep a few rows of tally boxes. Each word adds one tally in one box per row. Different words sometimes share a box, so each box may be a bit too high — so you take the **smallest** of the word's boxes as the answer.

### How it works
- **Update(x, c):** for each row i, `table[i][h_i(x)] += c`.
- **Estimate(x):** `min over rows of table[i][h_i(x)]`. Collisions only **add**, so the estimate is **≥ the true count**.
- **Guarantee:** with w = ⌈e/ε⌉ and d = ⌈ln(1/δ)⌉, the estimate ≤ true + ε·N (N = total count) with probability ≥ 1 − δ. Memory is **O((1/ε)·log(1/δ))**, independent of how many distinct items exist.
- **Conservative update:** only increase the counters that equal the current minimum — reduces over-counting.
- **Used for:** **heavy hitters / top-k** (with a small heap), network traffic monitoring (which IP sends the most packets?), rate limiting by key, query frequency in search engines, and approximate counts in stream processors (Apache Flink, Spark, Redis's `CMS.*` commands in Redis Stack).
- Sibling structures: **HyperLogLog** counts **distinct** items; Bloom filters answer **membership**; Count-Min answers **frequency**.

#### Modern C++ example — Count-Min Sketch for heavy hitters in a stream
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <cmath>
#include <cstdint>
#include <iostream>
#include <map>
#include <string>
#include <vector>

class CountMinSketch {
public:
    CountMinSketch(double eps, double delta)
        : w_(static_cast<std::size_t>(std::ceil(std::exp(1.0) / eps))),
          d_(static_cast<std::size_t>(std::ceil(std::log(1 / delta)))),
          t_(d_, std::vector<std::uint32_t>(w_)) {}
    void add(const std::string& x, std::uint32_t c = 1) { for (std::size_t i = 0; i < d_; ++i) t_[i][col(x, i)] += c; }
    std::uint32_t estimate(const std::string& x) const {
        std::uint32_t m = UINT32_MAX;
        for (std::size_t i = 0; i < d_; ++i) m = std::min(m, t_[i][col(x, i)]);
        return m;
    }
    std::size_t width() const { return w_; }
    std::size_t depth() const { return d_; }
private:
    std::size_t col(const std::string& s, std::size_t row) const {
        std::uint64_t h = 14695981039346656037ull ^ (row * 0x9e3779b97f4a7c15ull);
        for (unsigned char c : s) { h ^= c; h *= 1099511628211ull; }
        h ^= h >> 33; h *= 0xff51afd7ed558ccdull; h ^= h >> 33;
        return h % w_;
    }
    std::size_t w_, d_;
    std::vector<std::vector<std::uint32_t>> t_;
};

int main() {
    CountMinSketch cms(0.001, 0.01);              // error <= 0.1% of the stream, 99% of the time
    std::map<std::string, std::uint32_t> exact;   // only for checking the answer

    std::uint64_t state = 12345;                  // deterministic pseudo-random stream
    auto next = [&] { state = state * 6364136223846793005ull + 1442695040888963407ull; return state >> 33; };
    const int N = 200000;
    for (int i = 0; i < N; ++i) {
        std::uint64_t r = next() % 100;
        std::string ip = r < 30 ? "10.0.0.1" : r < 45 ? "10.0.0.2" : r < 50 ? "10.0.0.3"
                                              : "192.168." + std::to_string(next() % 256) + "." + std::to_string(next() % 256);
        cms.add(ip);
        ++exact[ip];
    }
    std::cout << "sketch: " << cms.depth() << " rows x " << cms.width() << " counters = "
              << cms.depth() * cms.width() * 4 / 1024 << " KiB; distinct IPs in stream: " << exact.size() << '\n';
    for (const char* ip : {"10.0.0.1", "10.0.0.2", "10.0.0.3", "192.168.1.1"}) {
        std::uint32_t est = cms.estimate(ip), real = exact.count(ip) ? exact[ip] : 0;
        std::cout << ip << ": estimate " << est << ", exact " << real
                  << (est >= real ? " (never under)" : " (UNDER!)") << '\n';
    }
}
```

**Output:**
```text
sketch: 5 rows x 2719 counters = 53 KiB; distinct IPs in stream: 51392
10.0.0.1: estimate 59963, exact 59943 (never under)
10.0.0.2: estimate 29829, exact 29806 (never under)
10.0.0.3: estimate 10090, exact 10075 (never under)
192.168.1.1: estimate 30, exact 4 (never under)
```

The heavy hitters are almost exact. The rare IP is over-counted by a few dozen — well inside the bound ε·N = 0.001 × 200,000 = 200 — and it is **never** under-counted. A sketch of 53 KiB replaced an exact table of 51,000+ keys.

### Interview answer
"A Count-Min Sketch is d rows of w counters with one hash per row. Each update increments one counter per row, and the estimate is the minimum across rows, so it never under-counts and over-counts by at most ε times the stream size with probability 1 − δ, using O((1/ε) log(1/δ)) memory regardless of how many distinct keys there are. I'd pair it with a small heap to track heavy hitters in network or click streams."

---

## Cheat sheet

| Topic | Remember |
|---|---|
| Hash table | `hash(key) % buckets`; O(1) average, O(n) worst; resize at a load-factor limit |
| Hash function | deterministic, uniform, avalanche, fast; seed it (SipHash) against hash flooding |
| Power-of-two size | mask keeps low bits → mix the hash first |
| Chaining | list per bucket; α can exceed 1; easy delete; `std::unordered_map` |
| Open addressing | probe in one array; α < 1; tombstones or backward shift for delete |
| Linear / quadratic / double hashing | best cache / less clustering / least clustering |
| Robin Hood | swap with residents closer to home; same average, much lower max; early-exit lookup |
| Cuckoo | 2 candidate slots → O(1) worst-case lookup; insert evicts; rehash on cycles; load < 50% (2-way) |
| Perfect hashing | static key set, no collisions; FKS two-level (b² second level); MPHF ≈ 2–4 bits/key; gperf |
| Bloom filter | bits + k hashes; "definitely not" / "probably yes"; ~9.6 bits per item for 1%; no delete |
| Count-Min Sketch | d × w counters; estimate = min; never under-counts; error ≤ εN with prob 1 − δ |
