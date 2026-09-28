# Virtual Memory — Explained for Beginners

> **What you'll learn:** what virtual memory is and why every modern OS uses it, how addresses are translated, **demand paging** (loading pages only when needed), and **page replacement algorithms (FIFO, LRU, Optimal)** — with C++ you can run.
>
> **Prerequisites:** [Memory Layout](./Memory-Layout.md). The OS-side view, including the Clock algorithm, is in [Operating Systems → Memory Management](../Operating%20Systems/Memory-Management.md).

## Table of Contents
0. [What is virtual memory?](#0-what-is-virtual-memory)
1. [Demand paging](#1-demand-paging)
2. [Page replacement algorithms (FIFO, LRU, Optimal)](#2-page-replacement-algorithms-fifo-lru-optimal)
3. [Cheat sheet](#cheat-sheet)

---

## 0. What is virtual memory?

**In one sentence:** virtual memory gives every process the illusion of its own large, private, contiguous memory, while the OS and CPU quietly map those "virtual" addresses to real RAM (or disk) behind the scenes.

### In plain words
A hotel where every guest is told "your room number is 101". Everyone has room "101" — but the front desk (the **MMU** + **page table**) secretly maps Ana's 101 to physical room 512 and Ben's 101 to physical room 37. Guests never see real room numbers, can't walk into each other's rooms, and the hotel can even move a guest's luggage to storage (disk) when they're out, bringing it back when they return.

### How it works
- Memory is split into fixed-size **pages** (virtual) and **frames** (physical), typically 4 KB.
- Each process has a **page table**: virtual page number → physical frame (+ flags: present, writable, executable, dirty, accessed).
- The CPU's **MMU** translates every memory access; the **TLB** caches recent translations.
- If a page isn't in RAM → **page fault** → the OS fetches it and retries the instruction.

Why it's worth it:
| Benefit | How |
|---|---|
| **Isolation / security** | A process can only reach pages in *its* table |
| **Simplicity** | Every program sees the same clean layout starting near address 0 |
| **More memory than RAM** | Rarely used pages live on disk (**swap**) |
| **Sharing** | Two page tables can point to the same frame (shared libraries, `mmap`) |
| **Efficient `fork`** | **Copy-on-write**: parent and child share pages until one writes |
| **Lazy loading** | Pages are loaded only when touched (demand paging) |

### Modern C++ example — two "processes" with the same virtual address
```cpp
// g++ -std=c++20 main.cpp && ./a.out      (Linux/macOS)
#include <iostream>
#include <sys/wait.h>
#include <unistd.h>

int value = 1;   // a global: same VIRTUAL address in parent and child

int main() {
    std::cout << std::flush;
    pid_t pid = fork();                      // child gets a copy-on-write copy of our memory
    if (pid == 0) {
        value = 999;                         // write -> OS gives the child its own physical copy
        std::cout << "child : &value=" << &value << " value=" << value << std::endl;
        _exit(0);
    }
    waitpid(pid, nullptr, 0);
    std::cout << "parent: &value=" << &value << " value=" << value << '\n';
    std::cout << "same virtual address, different physical memory!\n";
}
```

**Output (may vary):**
```text
child : &value=0x55d0c6e4c010 value=999
parent: &value=0x55d0c6e4c010 value=1
same virtual address, different physical memory!
```

### Interview answer
"Virtual memory decouples the addresses a process uses from physical memory. Per-process page tables, walked by the MMU and cached in the TLB, map virtual pages to frames, giving isolation, a uniform address space, sharing, copy-on-write and the ability to use disk as backing store."

---

## 1. Demand paging

**In one sentence:** with demand paging, the OS loads a page into RAM **only when the program first touches it**, instead of loading the whole program up front.

### In plain words
Streaming a movie instead of downloading it all first. You start watching immediately; each next chunk is fetched when you get to it. Scenes you skip are never downloaded. A 2 GB program can start in milliseconds because only the few pages it actually uses get loaded.

### How it works
1. When a program starts (or calls `mmap`/allocates memory), the OS just creates page table entries marked **not present** — nothing is loaded.
2. The first access to a page causes a **page fault**.
3. The OS's fault handler:
   - checks the access is legal (otherwise → segmentation fault),
   - finds a free frame (or evicts one — see page replacement below),
   - loads the page's content (from the executable, a file, swap) or zero-fills it for new memory,
   - updates the page table entry to **present**, and
   - restarts the instruction, which now succeeds.
4. **Minor fault:** page already in RAM (e.g. shared or cached), just needs mapping — cheap (~µs). **Major fault:** must read from disk — expensive (~ms on HDD, ~100 µs on SSD).

Performance measure: **effective access time** = (1 − p) × memory time + p × fault time. Even a tiny fault rate p dominates, because disk is ~100,000× slower than RAM.

Related ideas: **pre-paging** (load neighbors too), **working set** (the pages a process actively uses), **thrashing** (working sets don't fit → constant faulting).

### Modern C++ example — watching page faults happen (Linux)
We reserve 100 MB, then touch only a few pages, and count **minor page faults** using `getrusage`.

```cpp
// g++ -std=c++20 main.cpp && ./a.out      (Linux)
#include <cstddef>
#include <iostream>
#include <sys/mman.h>
#include <sys/resource.h>

long minor_faults() {
    rusage usage{};
    getrusage(RUSAGE_SELF, &usage);
    return usage.ru_minflt;
}

int main() {
    constexpr std::size_t kSize = 100 * 1024 * 1024;       // 100 MB
    constexpr std::size_t kPage = 4096;

    long before = minor_faults();
    auto* mem = static_cast<char*>(mmap(nullptr, kSize, PROT_READ | PROT_WRITE,
                                        MAP_PRIVATE | MAP_ANONYMOUS, -1, 0));
    long after_reserve = minor_faults();

    for (std::size_t i = 0; i < 10; ++i) mem[i * kPage] = 1;   // touch exactly 10 pages
    long after_touch = minor_faults();

    std::cout << "faults while reserving 100 MB: " << after_reserve - before << '\n';
    std::cout << "faults after touching 10 pages: " << after_touch - after_reserve << '\n';
    munmap(mem, kSize);
}
```

**Output (may vary):**
```text
faults while reserving 100 MB: 0
faults after touching 10 pages: 10
```
Reserving 100 MB cost nothing; memory was only really provided page by page as we touched it.

### Common mistakes
- Assuming `malloc(1 GB)` succeeding means you have 1 GB of RAM. With demand paging (and Linux overcommit), the failure can come later, when you touch the pages (the OOM killer).

### Interview answer
"Demand paging loads pages lazily: page table entries start not-present, the first access traps into the OS, which allocates a frame, fills it from the backing file, swap or zeros, updates the mapping and restarts the instruction. It makes startup fast and memory usage proportional to the working set, but a high fault rate — thrashing — destroys performance."

---

## 2. Page replacement algorithms (FIFO, LRU, Optimal)

**In one sentence:** when RAM is full and a new page must be loaded, a page replacement algorithm picks which resident page to evict, trying to minimize future page faults.

### In plain words
Your backpack fits 3 books. You need a 4th. Which one goes back to your locker?
- **FIFO:** the one you put in first — even if you're reading it right now.
- **LRU (Least Recently Used):** the one you haven't opened for the longest time — the past predicts the future.
- **Optimal:** the one you won't need for the longest time in the future — perfect, but requires a crystal ball. Used only as a yardstick.

### How it works
| Algorithm | Evicts | Pros | Cons |
|---|---|---|---|
| **FIFO** | Page loaded earliest | Trivial (a queue) | Ignores usage; **Bélády's anomaly** (more frames can mean more faults) |
| **LRU** | Page unused for longest | Good in practice (locality) | Exact tracking is expensive → approximations (Clock, aging) |
| **Optimal (OPT/MIN, Bélády)** | Page used farthest in the future | Fewest possible faults | Impossible online; benchmark only |

**Locality of reference** is why LRU works: programs reuse recently used data (temporal locality) and nearby data (spatial locality).

### Modern C++ example — a generic simulator with a pluggable policy
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <cstddef>
#include <format>
#include <functional>
#include <iostream>
#include <string>
#include <vector>

using Refs = std::vector<int>;
// A policy picks which index in 'frames' to evict, given the current time step.
using Policy = std::function<std::size_t(const std::vector<int>& frames, std::size_t now,
                                         const std::vector<std::size_t>& loaded_at,
                                         const std::vector<std::size_t>& last_used,
                                         const Refs& refs)>;

int simulate(const Refs& refs, std::size_t capacity, const Policy& pick_victim, std::string& trace) {
    std::vector<int> frames;
    std::vector<std::size_t> loaded_at, last_used;
    int faults = 0;
    for (std::size_t t = 0; t < refs.size(); ++t) {
        int page = refs[t];
        auto it = std::ranges::find(frames, page);
        if (it != frames.end()) {                                  // HIT
            last_used[it - frames.begin()] = t;
            trace += '.';
            continue;
        }
        ++faults;                                                  // FAULT
        trace += 'F';
        if (frames.size() < capacity) {
            frames.push_back(page); loaded_at.push_back(t); last_used.push_back(t);
        } else {
            std::size_t v = pick_victim(frames, t, loaded_at, last_used, refs);
            frames[v] = page; loaded_at[v] = t; last_used[v] = t;
        }
    }
    return faults;
}

int main() {
    const Refs refs{7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1};

    Policy fifo = [](auto&, auto, auto& loaded_at, auto&, auto&) {
        return std::size_t(std::ranges::min_element(loaded_at) - loaded_at.begin());
    };
    Policy lru = [](auto&, auto, auto&, auto& last_used, auto&) {
        return std::size_t(std::ranges::min_element(last_used) - last_used.begin());
    };
    Policy optimal = [](const std::vector<int>& frames, std::size_t now, auto&, auto&, const Refs& r) {
        auto next_use = [&](int page) {
            auto it = std::find(r.begin() + now + 1, r.end(), page);
            return it - r.begin();                                 // r.size() if never used again
        };
        return std::size_t(std::ranges::max_element(frames, {}, next_use) - frames.begin());
    };

    std::cout << "refs:    ";
    for (int p : refs) std::cout << p;
    std::cout << "\n(F = page fault, . = hit, 3 frames)\n";
    for (auto& [name, policy] : std::vector<std::pair<std::string, Policy>>{
             {"FIFO", fifo}, {"LRU", lru}, {"Optimal", optimal}}) {
        std::string trace;
        int faults = simulate(refs, 3, policy, trace);
        std::cout << std::format("{:<8} {}  -> {} faults\n", name, trace, faults);
    }
}
```

**Output:**
```text
refs:    70120304230321201701
(F = page fault, . = hit, 3 frames)
FIFO     FFFF.FFFFFF..FF..FFF  -> 15 faults
LRU      FFFF.F.FFFF..F.F.F..  -> 12 faults
Optimal  FFFF.F.F..F..F...F..  -> 9 faults
```

### Common mistakes
- Saying OSes use exact LRU. They use cheap approximations (Clock/second-chance, active/inactive lists) — see [OS Memory Management](../Operating%20Systems/Memory-Management.md#1-page-replacement-algorithms-fifo-lru-clock-optimal).

### Interview answer
"On a fault with no free frame, the OS evicts a victim page. FIFO evicts the oldest-loaded page and suffers Bélády's anomaly; LRU evicts the least recently used and approximates optimal thanks to locality, but is approximated in practice with Clock; Optimal evicts the page whose next use is farthest away, which is unimplementable but gives the lower bound. On the classic 20-reference string with 3 frames they give 15, 12 and 9 faults."

---

## Cheat sheet

| Term | One-liner |
|---|---|
| Virtual memory | Per-process illusion of private memory, mapped by page tables |
| MMU / TLB | Hardware translator / its cache |
| Page fault | Access to a non-present page; OS fixes it and retries |
| Demand paging | Load pages only on first access |
| Minor vs major fault | Mapping only vs disk read |
| Copy-on-write | Share pages until someone writes |
| Thrashing | Working set > RAM → constant faults |
| FIFO / LRU / Optimal | Oldest loaded / least recently used / used farthest in future |
