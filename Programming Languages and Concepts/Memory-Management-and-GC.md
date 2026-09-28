# Memory Management and Garbage Collection — Explained for Beginners

> **What you'll learn:** the **stack vs. the heap**, **manual vs. automatic** memory management, and how **garbage collectors** work: **tracing vs. reference counting**, **mark-and-sweep**, and **generational GC**. We'll build a tiny mark-and-sweep and a generational collector in C++ so you can see exactly what Java, C#, Go and Python do behind the scenes.
>
> **Prerequisites:** basic C++ (pointers, classes). For where these regions live in memory, see [Memory Layout](./Memory-Layout.md).

## Table of Contents
1. [Stack vs. Heap](#1-stack-vs-heap)
2. [Manual vs. Automatic memory management](#2-manual-vs-automatic-memory-management)
3. [Tracing vs. Reference counting](#3-tracing-vs-reference-counting)
4. [Mark and Sweep](#4-mark-and-sweep)
5. [Generational GC](#5-generational-gc)
6. [Cheat sheet](#cheat-sheet)

---

## 1. Stack vs. Heap

**In one sentence:** the **stack** is a small, super-fast, automatically managed memory area for a function's local variables; the **heap** is a large, flexible area for data whose size or lifetime isn't known in advance.

### In plain words
- **Stack = a stack of plates in a cafeteria.** Each time you call a function, you put a plate on top with that function's local variables. When the function returns, you remove its plate. Only the top plate is ever added or removed — extremely quick and tidy. But the stack is small, and a plate disappears as soon as its function ends.
- **Heap = a big warehouse.** You can ask for a shelf of any size at any time and keep it as long as you like. But someone has to find a free shelf (slower), and someone has to give it back when done — or the warehouse fills up with junk.

### How it works
| | Stack | Heap |
|---|---|---|
| Allocation | Move a pointer (1 CPU instruction) | Search for a free block (allocator) |
| Freed | Automatically when the function returns | Manually (`delete`) or by RAII / GC |
| Size | Small (often 1–8 MB per thread) | Large (up to available RAM) |
| Lifetime | Tied to the function call | Whatever you choose |
| Typical content | Local variables, function arguments, return addresses | `new`/`make_unique` objects, `std::vector`/`std::string` contents |
| Errors | **Stack overflow** (too deep recursion, huge local arrays) | Leaks, dangling pointers, fragmentation |

Note: a `std::vector<int> v;` local variable itself (3 pointers) is on the **stack**, but the elements it holds are on the **heap**.

### Modern C++ example
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <memory>
#include <vector>

struct Point { int x, y; };

std::unique_ptr<Point> make_point_on_heap() {
    return std::make_unique<Point>(3, 4);      // survives after the function returns
}

Point make_point_on_stack() {
    Point p{1, 2};                              // lives in this function's stack frame...
    return p;                                   // ...so we return a COPY (cheap here)
}

int main() {
    Point a = make_point_on_stack();            // on main's stack
    auto b = make_point_on_heap();              // pointer on the stack, Point on the heap
    std::vector<int> v(1000, 7);                // vector object on stack, 1000 ints on heap

    std::cout << "a = (" << a.x << ',' << a.y << ")\n";
    std::cout << "b = (" << b->x << ',' << b->y << ")\n";
    std::cout << "v has " << v.size() << " elements stored on the heap\n";
}   // a, b and v are destroyed here: b frees its Point, v frees its elements
```

**Output:**
```text
a = (1,2)
b = (3,4)
v has 1000 elements stored on the heap
```

### Common mistakes
- Returning a pointer or reference to a local variable (it lives on a plate that's about to be removed):
  ```c++
  int* bad() { int x = 5; return &x; }   // dangling pointer! x dies when bad() returns
  ```
- Putting a huge array on the stack (`int big[10'000'000];`) → stack overflow. Use `std::vector`.

### Interview answer
"The stack holds function frames — locals, arguments, return addresses — allocated and freed in LIFO order by moving the stack pointer, so it's very fast but small and lifetime-bound. The heap supports dynamic size and lifetime, but allocation is slower and memory must be freed explicitly or by RAII/GC, risking leaks and fragmentation."

---

## 2. Manual vs. Automatic memory management

**In one sentence:** with **manual** management the programmer explicitly frees every heap allocation; with **automatic** management the language (via RAII, reference counting or a garbage collector) frees memory for you.

### In plain words
- **Manual:** borrowing library books with no reminders. You must remember to return every single one. Forget → **leak** (books never come back). Return one twice → chaos (**double free**). Keep reading a book after you returned it → someone else's scribbles (**use-after-free**).
- **Automatic:** the library has a system that notices when you no longer need a book and returns it for you.

### How it works
| Approach | Who frees? | Languages | Pros | Cons |
|---|---|---|---|---|
| Manual `malloc/free`, `new/delete` | Programmer | C, old-style C++ | Full control, no runtime overhead | Leaks, double-free, use-after-free |
| **RAII** + smart pointers | Destructor, deterministically at scope end | Modern C++, Rust (ownership) | Deterministic, no GC pauses, also frees files/locks | Must think about ownership; cycles with `shared_ptr` |
| Reference counting | Runtime, when count hits 0 | Swift, Python (plus a cycle collector), `shared_ptr` | Immediate reclamation | Count updates cost; cycles leak |
| Tracing GC | Runtime, periodically | Java, C#, Go, JavaScript | Handles cycles, easy to use | Pauses, extra memory, non-deterministic timing |

**RAII** ("Resource Acquisition Is Initialization") is *the* C++ idea: tie a resource's lifetime to an object; the constructor acquires it, the destructor releases it. When the object goes out of scope — even because of an exception — the resource is released.

Modern C++ rule: **never write `new`/`delete` yourself**. Use:
- `std::unique_ptr<T>` — sole owner; zero overhead.
- `std::shared_ptr<T>` — shared ownership via reference counting.
- `std::weak_ptr<T>` — non-owning observer of a `shared_ptr` (breaks cycles).
- Containers (`std::vector`, `std::string`, `std::map`) — own their elements.

### Modern C++ example — manual vs. RAII
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <memory>
#include <stdexcept>

struct Buffer {
    Buffer()  { std::cout << "  Buffer acquired\n"; }
    ~Buffer() { std::cout << "  Buffer released\n"; }
};

void risky() { throw std::runtime_error("something failed"); }

void manual_style() {
    Buffer* b = new Buffer;            // manual
    try {
        risky();                       // throws...
        delete b;                      // ...so this line never runs
    } catch (...) {
        std::cout << "  (manual: forgot to delete on the error path -> LEAK)\n";
        throw;
    }
}

void raii_style() {
    auto b = std::make_unique<Buffer>();   // RAII: owned by 'b'
    risky();                               // throws -> 'b' is destroyed anyway
}

int main() {
    std::cout << "manual:\n";
    try { manual_style(); } catch (const std::exception&) {}
    std::cout << "RAII:\n";
    try { raii_style(); } catch (const std::exception&) {}
}
```

**Output:**
```text
manual:
  Buffer acquired
  (manual: forgot to delete on the error path -> LEAK)
RAII:
  Buffer acquired
  Buffer released
```

### Common mistakes
- Mixing raw owning pointers and smart pointers for the same object → double delete.
- Using `shared_ptr` everywhere "to be safe". Prefer `unique_ptr`; share only when ownership is really shared.

### Interview answer
"Manual management gives control but invites leaks, double frees and use-after-free. Automatic approaches include RAII (deterministic destruction at scope exit, used by C++ and Rust), reference counting and tracing garbage collection. In modern C++ I express ownership with `unique_ptr`, `shared_ptr` and `weak_ptr` and never call `delete` directly."

---

## 3. Tracing vs. Reference counting

**In one sentence:** **reference counting** frees an object the moment nothing points to it anymore; **tracing** GC periodically finds everything *reachable* from the program's roots and frees everything else.

### In plain words
- **Reference counting:** every balloon has a counter of how many kids are holding its string. When the last kid lets go (count = 0), the balloon floats away immediately. Problem: two balloons tied *to each other* but held by no kid keep each other's counter at 1 — they never float away (**cycle leak**).
- **Tracing:** once in a while, a teacher starts from the kids (the **roots**) and follows every string. Any balloon not connected to a kid, directly or indirectly, is garbage — even balloons tied to each other.

### How it works
**Reference counting**
- Every object stores a count; copying a reference does `++`, dropping one does `--`; at 0, free it (and decrement everything it references).
- ✅ Immediate, predictable reclamation; memory is freed smoothly with no big pauses.
- ❌ Every copy updates a counter (atomically, if multithreaded → slow); **cycles leak** unless you use weak references or add a cycle detector (Python does this).

**Tracing**
- **Roots** = global variables, local variables on every thread's stack, CPU registers.
- Starting from roots, follow every pointer; everything reached is **live**; the rest is garbage.
- ✅ Handles cycles; no per-assignment cost.
- ❌ Needs to pause or coordinate with the program; memory is freed later, not immediately; needs extra headroom.

### Modern C++ example — a `shared_ptr` cycle leak, and the `weak_ptr` fix
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <memory>
#include <string>

struct Person {
    std::string name;
    std::shared_ptr<Person> best_friend;      // strong (owning) reference
    std::weak_ptr<Person> weak_friend;        // non-owning reference
    explicit Person(std::string n) : name(std::move(n)) {}
    ~Person() { std::cout << "  " << name << " freed\n"; }
};

int main() {
    std::cout << "strong cycle:\n";
    {
        auto a = std::make_shared<Person>("Alice");
        auto b = std::make_shared<Person>("Bob");
        a->best_friend = b;                    // Alice -> Bob
        b->best_friend = a;                    // Bob -> Alice  (cycle!)
        std::cout << "  Alice ref count = " << a.use_count() << '\n';
    }   // a and b go out of scope, but each is still held by the other: count stays 1
    std::cout << "  (nothing freed -> memory leak)\n";

    std::cout << "weak back-reference:\n";
    {
        auto a = std::make_shared<Person>("Carol");
        auto b = std::make_shared<Person>("Dave");
        a->best_friend = b;                    // strong one way
        b->weak_friend = a;                    // weak the other way: doesn't add to the count
        if (auto f = b->weak_friend.lock())    // temporarily get a shared_ptr if still alive
            std::cout << "  Dave's friend is " << f->name << '\n';
    }
}
```

**Output:**
```text
strong cycle:
  Alice ref count = 2
  (nothing freed -> memory leak)
weak back-reference:
  Dave's friend is Carol
  Carol freed
  Dave freed
```

### Interview answer
"Reference counting reclaims objects immediately when their count drops to zero but pays on every reference copy and cannot collect cycles without weak references or a backup cycle collector. Tracing GC starts from roots, marks reachable objects and reclaims the rest, handling cycles naturally at the cost of pauses and less predictable timing."

---

## 4. Mark and Sweep

**In one sentence:** the simplest tracing garbage collector: **mark** everything reachable from the roots, then **sweep** through all objects and free the unmarked ones.

### In plain words
Cleaning up after a party: (1) walk around and put a sticker on everything that belongs to someone who's still there (and anything attached to those things); (2) walk through the whole house and throw away everything **without** a sticker; remove all stickers for next time.

### How it works
1. **Mark phase:** for each root, depth-first (or with a work list) visit every object reachable via pointers; set its `marked` bit.
2. **Sweep phase:** iterate over the list of *all* allocated objects. Unmarked → free. Marked → clear the bit.
3. Classic version is **stop-the-world**: the program pauses during collection.
4. Improvements you may hear about:
   - **Tri-color marking** (white/gray/black) enables **incremental/concurrent** GC that runs alongside the program (Go, modern JVM collectors).
   - **Mark-compact:** after marking, slide live objects together to remove fragmentation.
   - **Copying GC:** copy live objects to a fresh area; everything left behind is garbage (fast when most objects die).

### Modern C++ example — a tiny mark-and-sweep heap
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <memory>
#include <string>
#include <vector>

struct Object {
    std::string name;
    std::vector<Object*> refs;       // pointers to other objects
    bool marked = false;
};

class Heap {
public:
    Object* allocate(std::string name) {
        objects_.push_back(std::make_unique<Object>(Object{std::move(name), {}, false}));
        return objects_.back().get();
    }
    void add_root(Object* o) { roots_.push_back(o); }
    void remove_root(Object* o) { std::erase(roots_, o); }

    void collect() {
        for (Object* r : roots_) mark(r);                    // 1) MARK
        std::erase_if(objects_, [](const std::unique_ptr<Object>& o) {  // 2) SWEEP
            if (!o->marked) { std::cout << "  sweep: free " << o->name << '\n'; return true; }
            o->marked = false;                               // reset for next cycle
            return false;
        });
    }
    std::size_t size() const { return objects_.size(); }

private:
    void mark(Object* o) {
        if (o->marked) return;                               // already visited (handles cycles!)
        o->marked = true;
        for (Object* child : o->refs) mark(child);
    }
    std::vector<std::unique_ptr<Object>> objects_;          // every allocated object
    std::vector<Object*> roots_;                            // "global/stack variables"
};

int main() {
    Heap heap;
    Object* list = heap.allocate("list");
    Object* item1 = heap.allocate("item1");
    Object* item2 = heap.allocate("item2");
    Object* temp = heap.allocate("temp");
    Object* cycA = heap.allocate("cycleA");
    Object* cycB = heap.allocate("cycleB");

    list->refs = {item1, item2};
    cycA->refs = {cycB};
    cycB->refs = {cycA};                  // a cycle: reference counting would leak this
    (void)temp;

    heap.add_root(list);                  // only 'list' is reachable from the program

    std::cout << "GC #1 (objects: " << heap.size() << ")\n";
    heap.collect();
    std::cout << "live objects: " << heap.size() << '\n';

    heap.remove_root(list);               // the program no longer uses the list
    std::cout << "GC #2\n";
    heap.collect();
    std::cout << "live objects: " << heap.size() << '\n';
}
```

**Output:**
```text
GC #1 (objects: 6)
  sweep: free temp
  sweep: free cycleA
  sweep: free cycleB
live objects: 3
GC #2
  sweep: free list
  sweep: free item1
  sweep: free item2
live objects: 0
```
The cycle was collected — something reference counting alone can't do.

### Common mistakes
- Thinking GC means "no memory leaks ever". If you keep a reference in a long-lived list or cache, the object stays *reachable* and is never collected — a **logical leak**.

### Interview answer
"Mark-and-sweep marks all objects reachable from roots, then sweeps the heap and frees unmarked objects. It handles cycles, but the naive version stops the world and fragments memory; mark-compact and copying collectors fix fragmentation, and tri-color marking enables incremental and concurrent collection."

---

## 5. Generational GC

**In one sentence:** a generational collector splits the heap into a **young** generation (new objects) and an **old** generation (survivors), and collects the young one very often and the old one rarely — because most objects die young.

### In plain words
In a city, most paper cups are thrown away minutes after use, while furniture lasts years. A smart cleaning service empties the **small street bins** (young generation) every hour — quick, because almost everything there is trash — and only occasionally does a big **house clean-out** (old generation). Anything that survives several street-bin cleanings is probably furniture, so it's moved into the house (**promoted**).

### How it works
- **Weak generational hypothesis:** most objects die young (temporary strings, iterators, request objects).
- **Young generation** (Java: "Eden" + two "survivor" spaces): new objects go here. A **minor GC** collects only this small area — very fast since few objects are alive, and usually uses a **copying** collector.
- Objects surviving N minor collections are **promoted** to the **old generation**.
- **Major/full GC** collects the old generation — slower, less frequent.
- **Write barrier / remembered set:** if an old object points to a young one, that pointer must be treated as a root during minor GC; the runtime records such pointers when they're written.
- Used by: Java HotSpot (G1, Parallel), .NET (gens 0/1/2), V8 JavaScript, Python (3 generations for its cycle collector), Ruby.

### Modern C++ example — a tiny generational collector
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <format>
#include <iostream>
#include <list>
#include <string>
#include <vector>

struct Obj { std::string name; bool reachable; int survived = 0; };

class GenerationalHeap {
public:
    void allocate(std::string name, bool long_lived) {
        young_.push_back({std::move(name), long_lived});
    }
    void minor_gc() {                                   // only scans the YOUNG generation
        int freed = 0, promoted = 0, scanned = 0;
        for (auto it = young_.begin(); it != young_.end();) {
            ++scanned;
            if (!it->reachable) { it = young_.erase(it); ++freed; continue; }
            if (++it->survived >= kPromoteAfter) {       // old enough: promote
                old_.splice(old_.end(), young_, it++);
                ++promoted;
                continue;
            }
            ++it;
        }
        std::cout << std::format("minor GC: scanned {}, freed {}, promoted {} | young={} old={}\n",
                                 scanned, freed, promoted, young_.size(), old_.size());
    }
private:
    static constexpr int kPromoteAfter = 2;
    std::list<Obj> young_, old_;
};

int main() {
    GenerationalHeap heap;
    for (int round = 1; round <= 3; ++round) {
        // Each "request" creates 1 long-lived object (e.g. a cache entry)
        // and 9 temporaries that are garbage by the time GC runs.
        heap.allocate(std::format("cache{}", round), true);
        for (int i = 0; i < 9; ++i) heap.allocate(std::format("tmp{}_{}", round, i), false);
        heap.minor_gc();
    }
}
```

**Output:**
```text
minor GC: scanned 10, freed 9, promoted 0 | young=1 old=0
minor GC: scanned 11, freed 9, promoted 1 | young=1 old=1
minor GC: scanned 11, freed 9, promoted 1 | young=1 old=2
```
Each minor GC only looks at ~10 objects even as the old generation grows — that's why generational GC is fast.

### Common mistakes
- Creating lots of medium-lived objects (they survive a few young collections, get promoted, then die) — this fills the old generation and triggers expensive full GCs.

### Interview answer
"Generational GC exploits the observation that most objects die young. It allocates in a small young generation collected frequently, often with a copying collector, and promotes survivors to an old generation collected rarely. Write barriers maintain remembered sets for old-to-young pointers so minor collections don't need to scan the old generation."

---

## Cheat sheet

| Concept | One-liner |
|---|---|
| Stack | Fast LIFO frames for locals; auto-freed; small |
| Heap | Flexible dynamic memory; must be freed by someone |
| Manual | `new`/`delete` — leaks, double free, use-after-free |
| RAII | Destructor releases the resource at scope exit |
| `unique_ptr` / `shared_ptr` / `weak_ptr` | Sole owner / ref-counted shared owner / non-owning observer |
| Reference counting | Free at count 0; immediate; cycles leak |
| Tracing | Reachable from roots = live; handles cycles; pauses |
| Mark & sweep | Mark reachable, sweep the rest |
| Generational | Young collected often, old rarely; promote survivors |

**See also:** [Memory Layout](./Memory-Layout.md), [Virtual Memory](./Virtual-Memory.md).
