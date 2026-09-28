# Memory Management — Explained for Beginners

> **What you'll learn:** how the OS hands out RAM, what paging and page faults are, the **page replacement algorithms** (FIFO, LRU, Clock, plus Optimal for comparison), **memory-mapped files**, and **buddy memory allocation** — each with runnable C++.
>
> **Prerequisites:** [Processes](./Processes.md) (memory layout). For a deeper look at virtual memory see [Virtual Memory](../Programming%20Languages%20and%20Concepts/Virtual-Memory.md).

## Table of Contents
0. [Memory management basics: pages, frames and page faults](#0-memory-management-basics-pages-frames-and-page-faults)
1. [Page replacement algorithms (FIFO, LRU, Clock, Optimal)](#1-page-replacement-algorithms-fifo-lru-clock-optimal)
2. [Memory-mapped files](#2-memory-mapped-files)
3. [Buddy memory allocation](#3-buddy-memory-allocation)
4. [Cheat sheet](#cheat-sheet)

---

## 0. Memory management basics: pages, frames and page faults

**In one sentence:** the OS splits memory into fixed-size blocks called **pages**, gives each process the illusion of its own huge private memory, and moves pages between RAM and disk as needed.

### In plain words
Imagine a library with a small reading room (RAM) and a huge basement archive (disk). Every reader believes they have their own full bookshelf. In reality, a librarian keeps only the books currently in use on the reading-room tables, and fetches others from the basement when asked. When the tables are full, the librarian must return some book to the basement to make room — deciding *which* book is the page replacement problem.

### How it works
- **Physical memory** (RAM) is divided into **frames**, typically 4 KB each.
- Each process's **virtual memory** (the addresses the program sees) is divided into **pages** of the same size.
- A **page table** per process maps *page number → frame number* (or "not in RAM").
- The **MMU** (Memory Management Unit — hardware in the CPU) translates every address using the page table. A small cache of recent translations is the **TLB** (Translation Lookaside Buffer).
- If a program touches a page that isn't in RAM → **page fault**: the OS pauses the process, loads the page from disk into a free frame (evicting another page if needed), updates the page table, and resumes.

```
Virtual address = [ page number | offset ]
                        |
                   page table lookup
                        v
Physical address = [ frame number | offset ]
```
Example: with 4 KB pages, virtual address 8200 = page 2 (8200 / 4096), offset 8 (8200 % 4096).

- **Fragmentation:** *external* = free memory is split into small holes (fixed by paging); *internal* = wasted space inside an allocated block (e.g. you asked for 5 KB, got two 4 KB pages → 3 KB wasted).

### Modern C++ example — translating an address
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <cstdint>
#include <format>
#include <iostream>
#include <optional>
#include <unordered_map>

constexpr std::uint64_t kPageSize = 4096;

class PageTable {
    std::unordered_map<std::uint64_t, std::uint64_t> page_to_frame_;
public:
    void map(std::uint64_t page, std::uint64_t frame) { page_to_frame_[page] = frame; }

    std::optional<std::uint64_t> translate(std::uint64_t virtual_addr) const {
        std::uint64_t page = virtual_addr / kPageSize;
        std::uint64_t offset = virtual_addr % kPageSize;
        auto it = page_to_frame_.find(page);
        if (it == page_to_frame_.end()) return std::nullopt;     // PAGE FAULT
        return it->second * kPageSize + offset;
    }
};

int main() {
    PageTable pt;
    pt.map(0, 5);   // virtual page 0 lives in physical frame 5
    pt.map(2, 1);   // virtual page 2 lives in physical frame 1

    for (std::uint64_t va : {100ULL, 8200ULL, 5000ULL}) {
        if (auto pa = pt.translate(va))
            std::cout << std::format("virtual {:5} -> physical {:5}\n", va, *pa);
        else
            std::cout << std::format("virtual {:5} -> PAGE FAULT (page {} not in RAM)\n",
                                     va, va / kPageSize);
    }
}
```

**Output:**
```text
virtual   100 -> physical 20580
virtual  8200 -> physical  4104
virtual  5000 -> PAGE FAULT (page 1 not in RAM)
```

### Interview answer
"The OS uses paging: virtual address spaces are divided into pages mapped by per-process page tables to physical frames, translated by the MMU with the TLB as a cache. Accessing an unmapped page triggers a page fault, and the OS loads it from disk, possibly evicting another page using a replacement policy."

---

## 1. Page replacement algorithms (FIFO, LRU, Clock, Optimal)

**In one sentence:** when RAM is full and a new page is needed, a page replacement algorithm chooses which page to kick out, aiming to cause as few future page faults as possible.

### In plain words
Your desk fits only 3 books. You need a 4th. Which one do you put back on the shelf?
- **FIFO (First-In, First-Out):** the one that's been on the desk longest — even if you use it constantly.
- **LRU (Least Recently Used):** the one you haven't *touched* for the longest time. Usually a great guess.
- **Clock (Second Chance):** walk around the books in a circle; each book has a sticky note "used recently?". If yes, remove the note and move on (second chance). If no, put that book away. A cheap approximation of LRU.
- **Optimal (Bélády's):** the one you won't need for the longest time in the *future*. Perfect but impossible in practice (we can't see the future) — used as a benchmark.

### How it works
We test algorithms with a **reference string** — the sequence of page numbers a program accesses — and count page faults.

| Algorithm | Evicts | Cost | Notes |
|---|---|---|---|
| FIFO | Oldest loaded | Very cheap (queue) | Suffers **Bélády's anomaly**: more frames can cause *more* faults! |
| LRU | Least recently used | Needs to track every access (expensive in hardware) | Close to optimal in practice |
| Clock | First page with reference bit = 0 | Cheap: one bit per page + a pointer | What real OSes use (variants) |
| Optimal | Used farthest in future | Needs future knowledge | Lower bound for comparison |

### Modern C++ example — all four simulators
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <cstddef>
#include <deque>
#include <format>
#include <iostream>
#include <list>
#include <unordered_map>
#include <vector>

using Refs = std::vector<int>;

int fifo(const Refs& refs, std::size_t frames) {
    std::deque<int> q;
    int faults = 0;
    for (int page : refs) {
        if (std::ranges::find(q, page) != q.end()) continue;   // hit
        ++faults;
        if (q.size() == frames) q.pop_front();                 // evict oldest
        q.push_back(page);
    }
    return faults;
}

int lru(const Refs& refs, std::size_t frames) {
    std::list<int> order;                                      // front = most recent
    std::unordered_map<int, std::list<int>::iterator> where;
    int faults = 0;
    for (int page : refs) {
        if (auto it = where.find(page); it != where.end()) {  // hit: move to front
            order.splice(order.begin(), order, it->second);
            continue;
        }
        ++faults;
        if (order.size() == frames) {                          // evict least recent (back)
            where.erase(order.back());
            order.pop_back();
        }
        order.push_front(page);
        where[page] = order.begin();
    }
    return faults;
}

int clock_algo(const Refs& refs, std::size_t frames) {
    std::vector<int> page(frames, -1);
    std::vector<bool> referenced(frames, false);
    std::size_t hand = 0;
    int faults = 0;
    for (int p : refs) {
        if (auto it = std::ranges::find(page, p); it != page.end()) {
            referenced[it - page.begin()] = true;              // hit: set the "used" bit
            continue;
        }
        ++faults;
        while (referenced[hand]) {                             // give second chances
            referenced[hand] = false;
            hand = (hand + 1) % frames;
        }
        page[hand] = p;                                        // replace the victim
        referenced[hand] = true;
        hand = (hand + 1) % frames;
    }
    return faults;
}

int optimal(const Refs& refs, std::size_t frames) {
    std::vector<int> mem;
    int faults = 0;
    for (std::size_t i = 0; i < refs.size(); ++i) {
        if (std::ranges::find(mem, refs[i]) != mem.end()) continue;
        ++faults;
        if (mem.size() < frames) { mem.push_back(refs[i]); continue; }
        // evict the page whose next use is farthest away (or never)
        auto next_use = [&](int page) {
            auto it = std::find(refs.begin() + i + 1, refs.end(), page);
            return it - refs.begin();
        };
        auto victim = std::ranges::max_element(mem, {}, next_use);
        *victim = refs[i];
    }
    return faults;
}

int main() {
    const Refs refs{7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1};
    std::cout << "3 frames, 20 references\n";
    std::cout << std::format("FIFO    faults: {}\n", fifo(refs, 3));
    std::cout << std::format("LRU     faults: {}\n", lru(refs, 3));
    std::cout << std::format("Clock   faults: {}\n", clock_algo(refs, 3));
    std::cout << std::format("Optimal faults: {}\n", optimal(refs, 3));

    // Belady's anomaly: FIFO with MORE frames causes MORE faults on this string
    const Refs anomaly{1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5};
    std::cout << std::format("\nBelady's anomaly (FIFO): 3 frames -> {} faults, 4 frames -> {} faults\n",
                             fifo(anomaly, 3), fifo(anomaly, 4));
}
```

**Output:**
```text
3 frames, 20 references
FIFO    faults: 15
LRU     faults: 12
Clock   faults: 14
Optimal faults: 9

Belady's anomaly (FIFO): 3 frames -> 9 faults, 4 frames -> 10 faults
```

### Common mistakes
- Thinking LRU is what OSes literally implement. True LRU needs a timestamp on every memory access — far too slow. OSes use Clock-like approximations (Linux uses two lists, "active" and "inactive").
- Forgetting **dirty pages**: a page that was modified must be written back to disk before eviction, so evicting clean pages is cheaper.
- **Thrashing:** if the processes' working sets don't fit in RAM, the system spends all its time swapping pages and almost none doing work.

### Interview answer
"FIFO evicts the oldest page and can show Bélády's anomaly; LRU evicts the least recently used page and approximates optimal well but is costly to implement exactly; Clock approximates LRU with a reference bit and a circular pointer; Optimal evicts the page used farthest in the future and serves as a theoretical lower bound. The LRU cache itself — hash map plus doubly linked list — is also a classic coding question."

---

## 2. Memory-mapped files

**In one sentence:** memory mapping makes a file appear as if it were an array in your program's memory, so reading/writing the array reads/writes the file.

### In plain words
Normally reading a file is like ordering pages by mail: "please send me bytes 1000–2000" (`read`), then copying them into your notebook. Memory mapping is like the librarian giving you a magic window: you look at your desk and the file's contents are just *there*. The OS quietly fetches each page from disk the first time you look at it (a page fault), and writes changes back later.

### How it works
1. `mmap(file)` reserves a range of virtual addresses and records "these pages come from this file".
2. Nothing is read yet. Touching an address triggers a page fault → the OS loads that 4 KB page from the file.
3. Writes mark pages **dirty**; the OS writes them back eventually (or when you call `msync`).
4. `munmap` removes the mapping.

Why use it?
- **Speed:** no extra copy from a kernel buffer into your buffer; great for large files and random access (databases like LMDB and SQLite can use it).
- **Sharing:** two processes mapping the same file with `MAP_SHARED` share the same physical pages — a form of IPC.
- **Loading programs:** the OS maps executable files and shared libraries this way.

Downsides: errors show up as crashes (`SIGBUS`) instead of return codes, and it's awkward for files that grow.

### Modern C++ example (Linux/macOS)
We wrap `mmap` in a small RAII class so the mapping is always released.

```cpp
// g++ -std=c++20 main.cpp && ./a.out      (Linux/macOS)
#include <cctype>
#include <fcntl.h>      // open
#include <fstream>
#include <iostream>
#include <span>
#include <stdexcept>
#include <string>
#include <sys/mman.h>   // mmap, munmap
#include <sys/stat.h>   // fstat
#include <unistd.h>     // close

class MappedFile {
public:
    explicit MappedFile(const char* path) {
        int fd = open(path, O_RDWR);
        if (fd < 0) throw std::runtime_error("open failed");
        struct stat st{};
        fstat(fd, &st);
        size_ = static_cast<std::size_t>(st.st_size);
        void* p = mmap(nullptr, size_, PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0);
        close(fd);                                   // the mapping stays valid after close
        if (p == MAP_FAILED) throw std::runtime_error("mmap failed");
        data_ = static_cast<char*>(p);
    }
    ~MappedFile() { munmap(data_, size_); }         // RAII: always unmapped
    MappedFile(const MappedFile&) = delete;
    MappedFile& operator=(const MappedFile&) = delete;

    std::span<char> bytes() { return {data_, size_}; }

private:
    char* data_ = nullptr;
    std::size_t size_ = 0;
};

int main() {
    std::ofstream("demo.txt") << "hello memory mapped world\n";

    {
        MappedFile file("demo.txt");
        for (char& c : file.bytes())                 // edit the FILE like an array
            c = static_cast<char>(std::toupper(static_cast<unsigned char>(c)));
    }                                                // unmapped; changes go to the file

    std::string line;
    std::getline(std::ifstream("demo.txt"), line);
    std::cout << line << '\n';
}
```

**Output:**
```text
HELLO MEMORY MAPPED WORLD
```

> **Windows note:** the equivalent API is `CreateFileMapping` + `MapViewOfFile`. Boost.Interprocess offers a portable wrapper.

### Common mistakes
- Mapping a file and then truncating it from another process → accessing the missing part crashes with `SIGBUS`.
- Assuming writes are on disk immediately. Call `msync` if you need durability at a specific point.

### Interview answer
"`mmap` maps a file into the virtual address space; pages are loaded lazily on page faults and dirty pages are written back by the kernel. It avoids copies between kernel and user buffers, enables shared memory between processes, and is how executables and shared libraries are loaded."

---

## 3. Buddy memory allocation

**In one sentence:** the buddy system hands out memory in power-of-two sized blocks, splitting big blocks in half to satisfy small requests and merging free "buddy" halves back together.

### In plain words
You have one big chocolate bar of 16 squares. Someone asks for 3 squares. You break the bar in half (8 + 8), break one half again (4 + 4), and give them a 4-piece (the smallest power of two ≥ 3). When they give it back, if its twin 4-piece (its **buddy**) is also unused, you glue them back into an 8, and so on up. Breaking and gluing are very fast because you always cut exactly in half.

### How it works
1. Memory starts as one block of size 2^N.
2. Request of size S → round up to the next power of two, k.
3. Find the smallest free block ≥ k. While it's bigger than k, **split** it into two halves (buddies); keep one, put the other on the free list.
4. **Free:** a block's buddy address is `address XOR size` (flip one bit!). If the buddy is free and the same size, **merge** them; repeat upward.

Pros: fast allocation/free, cheap merging (less external fragmentation). Cons: **internal fragmentation** — asking for 33 KB gives you 64 KB.

Linux uses a buddy allocator for physical pages (`cat /proc/buddyinfo` shows free blocks of each size).

### Modern C++ example
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <bit>
#include <cstddef>
#include <format>
#include <iostream>
#include <map>
#include <optional>
#include <set>

class BuddyAllocator {
public:
    explicit BuddyAllocator(std::size_t total) : total_(total) { free_[total].insert(0); }

    std::optional<std::size_t> allocate(std::size_t request) {
        std::size_t size = std::bit_ceil(request);            // round up to a power of two
        // find the smallest free block that is big enough
        auto it = free_.lower_bound(size);
        while (it != free_.end() && it->second.empty()) ++it;
        if (it == free_.end()) return std::nullopt;           // out of memory

        std::size_t block_size = it->first;
        std::size_t addr = *it->second.begin();
        it->second.erase(it->second.begin());

        while (block_size > size) {                           // split until it fits
            block_size /= 2;
            free_[block_size].insert(addr + block_size);      // right half becomes free buddy
        }
        used_[addr] = size;
        return addr;
    }

    void release(std::size_t addr) {
        std::size_t size = used_.at(addr);
        used_.erase(addr);
        while (size < total_) {
            std::size_t buddy = addr ^ size;                  // the buddy trick
            auto& list = free_[size];
            if (!list.contains(buddy)) break;                 // buddy busy: stop merging
            list.erase(buddy);
            addr = std::min(addr, buddy);                     // merged block starts at the lower one
            size *= 2;
        }
        free_[size].insert(addr);
    }

    void print() const {
        std::cout << "  free blocks:";
        for (const auto& [size, addrs] : free_)
            for (auto a : addrs) std::cout << std::format(" [{}..{})", a, a + size);
        std::cout << '\n';
    }

private:
    std::size_t total_;
    std::map<std::size_t, std::set<std::size_t>> free_;       // size -> start addresses
    std::map<std::size_t, std::size_t> used_;                 // start -> size
};

int main() {
    BuddyAllocator heap(64);
    auto a = heap.allocate(10);   // rounds to 16
    auto b = heap.allocate(5);    // rounds to 8
    std::cout << std::format("a at {}, b at {}\n", *a, *b);
    heap.print();

    heap.release(*a);
    heap.release(*b);             // b's buddy is free -> merge all the way back to 64
    std::cout << "after freeing both:\n";
    heap.print();
}
```

**Output:**
```text
a at 0, b at 16
  free blocks: [24..32) [32..64)
after freeing both:
  free blocks: [0..64)
```

### Common mistakes
- Forgetting that the buddy of a block depends on its **size** (`addr ^ size`); two neighbouring blocks of the same size are not necessarily buddies.

### Interview answer
"The buddy allocator manages memory in power-of-two blocks. Allocation splits larger blocks in half until the size fits; freeing merges a block with its buddy, found by XOR-ing the address with the block size, whenever the buddy is free. It's fast and limits external fragmentation at the cost of internal fragmentation, and Linux uses it for page frames."

---

## Cheat sheet

| Concept | One-liner |
|---|---|
| Page / Frame | Fixed-size chunk of virtual / physical memory (often 4 KB) |
| Page table | Per-process map from page → frame |
| TLB | Hardware cache of recent translations |
| Page fault | Accessed page not in RAM → OS loads it |
| FIFO | Evict oldest; Bélády's anomaly |
| LRU | Evict least recently used; hash map + linked list |
| Clock | Circular pointer + reference bit; approximates LRU |
| Optimal | Evict page used farthest in future; theoretical bound |
| Thrashing | Too little RAM for working sets → constant paging |
| `mmap` | File appears as memory; lazy loading, zero-copy |
| Buddy allocator | Power-of-two split/merge; buddy = `addr ^ size` |

**Next:** [File Systems](./File-Systems.md).
