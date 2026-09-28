# Memory Layout — Where Your Program's Data Lives

> **What you'll learn:** how a running C++ program's memory is divided, how **stack and heap allocation** actually work under the hood, and the difference between the **data segment** and the **code (text) segment** (plus BSS and read-only data).
>
> **Prerequisites:** [Memory Management and GC → Stack vs. Heap](./Memory-Management-and-GC.md#1-stack-vs-heap) explains *when* to use each; this page explains *how* they work.

## Table of Contents
0. [The big picture](#0-the-big-picture)
1. [Stack vs. Heap memory allocation](#1-stack-vs-heap-memory-allocation)
2. [Data segment vs. Code segment](#2-data-segment-vs-code-segment)
3. [Cheat sheet](#cheat-sheet)

---

## 0. The big picture

**In one sentence:** when a program runs, the OS gives it a private range of addresses split into regions — code, read-only data, initialized data, zeroed data (BSS), heap and stack — each with its own rules.

### In plain words
Think of a house:
- **Code segment** = the instruction manual bolted to the wall (you can read it, not rewrite it).
- **Read-only data** = framed posters (text constants like `"Hello"`) — look, don't touch.
- **Data / BSS** = the permanent furniture (global variables) that exists as long as the house does.
- **Heap** = the garage where you store things of any size, for as long as you want.
- **Stack** = the kitchen counter: you put stuff down while cooking a dish and clear it when the dish is done.

```
 high addresses ┌────────────────────────────┐
                │ Stack  (grows ↓)           │  locals, return addresses, one per thread
                │            ↓               │
                │   (unused gap)             │
                │            ↑               │
                │ Heap   (grows ↑)           │  new / malloc / containers
                ├────────────────────────────┤
                │ BSS    (zero-initialized)  │  int counter;  static int cache[1000];
                │ Data   (initialized)       │  int limit = 42;
                │ Rodata (read-only)         │  "string literals", const tables
                │ Text   (code, read-only)   │  compiled machine instructions
 low addresses  └────────────────────────────┘
```

---

## 1. Stack vs. Heap memory allocation

**In one sentence:** stack allocation is just moving one CPU register (the stack pointer) — almost free; heap allocation asks an **allocator** library to find a suitable free block — much slower and may involve the OS.

### In plain words
- **Stack:** a notepad where you always write on the next empty line. "Allocating" = moving your pen down 3 lines. "Freeing" = moving it back up. No searching, ever.
- **Heap:** a parking garage. To park (allocate) an attendant must find a free space big enough for your vehicle; when you leave, the space is marked free. With many cars of different sizes coming and going, free spaces get scattered (**fragmentation**).

### How it works
**Stack allocation**
1. When a function is called, the CPU pushes the **return address**; the function then reserves a **stack frame** by subtracting its size from the **stack pointer** register (`sp`/`rsp`).
2. Locals live at fixed offsets inside that frame. Sizes must be known at compile time.
3. On return, the stack pointer is restored — every local vanishes at once.
4. Each thread has its own stack (commonly 8 MB on Linux main thread, less for others).

**Heap allocation** (`new`, `malloc`, `std::vector` growth)
1. `operator new` calls the allocator (e.g. glibc `malloc`, jemalloc, tcmalloc, mimalloc).
2. The allocator keeps **free lists** of blocks by size; it picks a block (first-fit / best-fit / size classes), maybe splitting a larger one.
3. If it has no free memory, it asks the OS for more (`brk`/`sbrk` or `mmap` on Linux, `VirtualAlloc` on Windows).
4. `delete` returns the block to the free list (possibly merging with neighbors).
5. Modern allocators keep **per-thread caches** to avoid locking.

Performance tip: avoid heap allocations in hot loops — reuse buffers, `reserve()` vector capacity, or use arena allocators (`std::pmr`).

### Modern C++ example — count heap allocations and use an arena
We replace global `operator new` to count allocations, then compare a growing vector, a vector with `reserve`, and a `std::pmr` vector using a stack-based arena (no heap at all).

```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <array>
#include <cstddef>
#include <cstdlib>
#include <iostream>
#include <memory_resource>
#include <new>
#include <vector>

static int g_heap_allocations = 0;

void* operator new(std::size_t size) {             // every heap allocation goes through here
    ++g_heap_allocations;
    if (void* p = std::malloc(size)) return p;
    throw std::bad_alloc{};
}
void operator delete(void* p) noexcept { std::free(p); }
void operator delete(void* p, std::size_t) noexcept { std::free(p); }

int main() {
    int local = 0;                                   // stack: no allocator involved
    (void)local;

    g_heap_allocations = 0;
    {
        std::vector<int> v;
        for (int i = 0; i < 1000; ++i) v.push_back(i);   // grows: reallocates several times
    }
    std::cout << "push_back 1000 ints:            " << g_heap_allocations << " heap allocations\n";

    g_heap_allocations = 0;
    {
        std::vector<int> v;
        v.reserve(1000);                                  // one allocation up front
        for (int i = 0; i < 1000; ++i) v.push_back(i);
    }
    std::cout << "reserve(1000) then push_back:   " << g_heap_allocations << " heap allocation\n";

    g_heap_allocations = 0;
    {
        std::array<std::byte, 8192> buffer;               // memory on the STACK
        std::pmr::monotonic_buffer_resource arena(buffer.data(), buffer.size(),
                                                  std::pmr::null_memory_resource());
        std::pmr::vector<int> v(&arena);                  // allocates from the arena
        v.reserve(1000);
        for (int i = 0; i < 1000; ++i) v.push_back(i);
    }
    std::cout << "pmr vector on a stack arena:    " << g_heap_allocations << " heap allocations\n";
}
```

**Output:**
```text
push_back 1000 ints:            11 heap allocations
reserve(1000) then push_back:   1 heap allocation
pmr vector on a stack arena:    0 heap allocations
```
(The first number depends on the standard library's growth factor — libstdc++ doubles the capacity; MSVC grows by 1.5×.)

### Common mistakes
- Believing "the heap is slow, so never use it". Modern allocators are fast; the problem is *many tiny* allocations in hot paths.
- Deep or unbounded recursion → stack overflow (see [Recursion](./Recursion.md)).

### Interview answer
"Stack allocation adjusts the stack pointer to reserve a frame whose layout is fixed at compile time, so it's essentially free and freed in LIFO order. Heap allocation goes through an allocator that manages free lists and requests pages from the OS via brk/mmap; it's slower, can fragment, and needs explicit or RAII-based freeing. Reserving capacity or using arena allocators reduces heap traffic."

---

## 2. Data segment vs. Code segment

**In one sentence:** the **code (text) segment** holds the program's compiled instructions and is read-only and executable; the **data segment** holds global and static variables that have an initial value, and is readable and writable.

### In plain words
- **Code segment:** the pages of a script actors perform from. Everyone reads it; nobody scribbles on it during the play. Because it never changes, if you run the same program 10 times, the OS can share **one copy** of its code between all 10 processes.
- **Data segment:** each actor's personal props that start in a known position (e.g. a cup placed on the table at the start). Each running copy gets its own.

### How it works
| Segment | Contains | Permissions | Stored in the executable file? |
|---|---|---|---|
| **Text (code)** | Machine instructions of functions | Read + Execute | Yes |
| **Rodata** | String literals, `const`/`constexpr` tables, vtables | Read only | Yes |
| **Data** | Globals/statics with non-zero initial values (`int x = 5;`) | Read + Write | Yes (the initial values) |
| **BSS** | Globals/statics that are zero-initialized (`int y;`, `static char buf[4096];`) | Read + Write | **No** — only its size; the OS zero-fills it at load time |

Why the split matters:
- **Security:** code is not writable and data is not executable (**W^X / NX bit**), which blocks many attacks that inject code into data.
- **Sharing:** read-only segments are shared between processes running the same program or library.
- **File size:** a huge zero-initialized array costs nothing on disk (it's in BSS).

You can inspect segments with `size ./a.out` or `objdump -h ./a.out` on Linux.

### Modern C++ example
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <cstdint>
#include <iostream>

int initialized_global = 42;          // .data
int zero_global;                      // .bss
static char big_buffer[1 << 20];      // .bss: 1 MB that does NOT make the executable 1 MB bigger
const char* const greeting = "hi";    // the pointer is const data; "hi" itself is in .rodata

int add(int a, int b) { return a + b; }   // .text

int main() {
    auto addr = [](const void* p) { return reinterpret_cast<std::uintptr_t>(p); };
    std::cout << std::boolalpha;
    std::cout << "text  < rodata ? " << (addr(reinterpret_cast<const void*>(&add)) < addr(greeting)) << '\n';
    std::cout << "rodata< data   ? " << (addr(greeting) < addr(&initialized_global)) << '\n';
    std::cout << "data  < bss    ? " << (addr(&initialized_global) < addr(&zero_global)) << '\n';
    std::cout << "bss starts zeroed? " << (zero_global == 0 && big_buffer[12345] == 0) << '\n';

    // Trying to modify a string literal is undefined behavior: it lives in read-only memory.
    // char* p = const_cast<char*>(greeting); p[0] = 'H';   // would typically crash (SIGSEGV)
    std::cout << add(initialized_global, 1) << '\n';
}
```

**Output:**
```text
text  < rodata ? true
rodata< data   ? true
data  < bss    ? true
bss starts zeroed? true
43
```
(This ordering is typical for Linux/ELF executables; other platforms may differ.)

### Common mistakes
- Modifying a string literal through a cast — it's read-only memory; the program crashes.
- Relying on the initialization *order* of globals in different `.cpp` files (the "static initialization order fiasco"). Use function-local statics instead.

### Interview answer
"The text segment holds executable code and is read-only and shareable; rodata holds constants and literals; the data segment holds initialized globals and statics and is writable; BSS holds zero-initialized globals and occupies no space in the file. Separating writable data from executable code enables W^X protection and page sharing between processes."

---

## Cheat sheet

| Region | Holds | Lifetime | Notes |
|---|---|---|---|
| Text | Code | Whole program | Read + execute; shared |
| Rodata | Literals, constants | Whole program | Read only |
| Data | Initialized globals/statics | Whole program | Values stored in the file |
| BSS | Zero-initialized globals/statics | Whole program | Zero-filled at load |
| Heap | Dynamic allocations | Until freed | Allocator + free lists; fragmentation |
| Stack | Function frames | Until function returns | Move the stack pointer; one per thread |
