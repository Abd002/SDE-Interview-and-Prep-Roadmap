# Queues — Implementations (Circular Queue, Deque, Priority Queue) and Applications

> **What you'll learn:** what a queue is, how to build one on an **array** (the **circular queue**), on a **linked list**, as a **double-ended queue (deque)** and as a **priority queue** (binary heap), and where queues are used — **BFS** and **job scheduling**. Each part has a runnable C++ example.
>
> **Prerequisites:** [Arrays](./Arrays.md), [Linked Lists](./LinkedList.md) and [Stacks](./Stacks.md).

## Table of Contents
1. [What is a queue?](#0-what-is-a-queue)
2. [Implementations (e.g., array-based, linked list-based, priority queues)](#1-implementations-eg-array-based-linked-list-based-priority-queues)
   - [Circular queue](#11-circular-queue)
   - [Double-ended queue (Deque)](#12-double-ended-queue-deque)
   - [Linked list-based queue](#13-linked-list-based-queue)
   - [Priority queue](#14-priority-queue)
3. [Applications (e.g., BFS, job scheduling)](#2-applications-eg-bfs-job-scheduling)
4. [Cheat sheet](#cheat-sheet)

---

## 0. What is a queue?

**In one sentence:** a queue is a collection where the **first item you put in is the first one you take out** (FIFO: First In, First Out).

### In plain words
A line at a bank. New people join at the **back**; the teller serves the person at the **front**. Nobody jumps the line.

### How it works
| Operation | What it does | Cost |
|---|---|---|
| `push(x)` / `enqueue(x)` | add `x` at the back | O(1) |
| `pop()` / `dequeue()` | remove the front item | O(1) |
| `front()` / `peek()` | read the front item | O(1) |
| `empty()` / `size()` | how many items | O(1) |

In C++: `std::queue<T>` (an adapter over `std::deque<T>` by default), `std::deque<T>` for both ends, and `std::priority_queue<T>` for "most important first".

**Why not a plain array with "erase the first element"?** Removing index 0 shifts every other item left — O(n) per dequeue. The circular queue fixes that.

---

## 1. Implementations (e.g., array-based, linked list-based, priority queues)

**In one sentence:** a FIFO queue sits on a **ring buffer** (array) or a **linked list with head and tail pointers**; a **deque** allows both ends; a **priority queue** is usually a **binary heap**.

### 1.1 Circular queue

#### In plain words
Picture the array bent into a ring. Keep two positions: `head` (front) and `tail` (where the next item goes). When either reaches the end of the array, it wraps around to index 0. Nothing ever shifts.

#### How it works
- `push`: `buf[tail] = x; tail = (tail + 1) % capacity; ++count;`
- `pop`: `head = (head + 1) % capacity; --count;`
- **Full vs. empty:** if `head == tail`, the queue is either empty or full. Keep a `count` (as below) or leave one slot unused.
- **Fixed capacity** version (a "ring buffer") is used in drivers, audio, network cards and logging, because it never allocates. If you need growth, copy into a bigger array **in order** starting from `head`.
- Using a power-of-two capacity lets you replace `% capacity` with `& (capacity - 1)`.

#### Modern C++ example — fixed-size circular queue (ring buffer)
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <array>
#include <iostream>
#include <optional>

template <typename T, std::size_t N>
class RingQueue {
public:
    bool push(const T& value) {
        if (full()) return false;                    // caller decides: drop, block or overwrite
        buf_[tail_] = value;
        tail_ = (tail_ + 1) % N;
        ++count_;
        return true;
    }
    std::optional<T> pop() {
        if (empty()) return std::nullopt;
        T value = buf_[head_];
        head_ = (head_ + 1) % N;
        --count_;
        return value;
    }
    bool empty() const { return count_ == 0; }
    bool full() const { return count_ == N; }
    std::size_t head() const { return head_; }
    std::size_t tail() const { return tail_; }
private:
    std::array<T, N> buf_{};
    std::size_t head_ = 0, tail_ = 0, count_ = 0;
};

int main() {
    RingQueue<int, 4> q;
    for (int i = 1; i <= 5; ++i)
        std::cout << "push " << i << (q.push(i) ? " ok" : " rejected (full)") << '\n';
    std::cout << "pop " << *q.pop() << ", pop " << *q.pop() << '\n';
    q.push(6); q.push(7);                            // these wrap around to index 0 and 1
    std::cout << "head=" << q.head() << " tail=" << q.tail() << '\n';
    std::cout << "drain:";
    while (auto v = q.pop()) std::cout << ' ' << *v;
    std::cout << '\n';
}
```

**Output:**
```text
push 1 ok
push 2 ok
push 3 ok
push 4 ok
push 5 rejected (full)
pop 1, pop 2
head=2 tail=2
drain: 3 4 6 7
```

### 1.2 Double-ended queue (Deque)

#### In plain words
A line where people can join or leave at **both** ends. It can act as a queue (push back, pop front) **and** as a stack (push back, pop back).

#### How it works
- Operations: `push_front`, `push_back`, `pop_front`, `pop_back`, `front`, `back` — all O(1).
- A **circular buffer** with a movable head gives a deque directly: `push_front` moves `head` one step back (with wrap-around).
- `std::deque` is built from **fixed-size blocks** plus an index of blocks, so it grows at both ends without moving existing elements, and still allows O(1) random access `d[i]`.
- **Classic use — sliding window maximum:** keep a deque of indexes whose values are decreasing. The front is always the max of the current window. Each index enters and leaves once, so the whole pass is O(n).
- **0-1 BFS:** in a graph whose edges weigh 0 or 1, push 0-edges to the front and 1-edges to the back; you get shortest paths in O(V + E).

#### Modern C++ example — deque as a queue and a stack, and sliding window maximum
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <deque>
#include <iostream>
#include <vector>

std::vector<int> window_max(const std::vector<int>& a, std::size_t k) {
    std::deque<std::size_t> dq;                       // indexes; a[dq] is decreasing
    std::vector<int> out;
    for (std::size_t i = 0; i < a.size(); ++i) {
        if (!dq.empty() && dq.front() + k <= i) dq.pop_front();          // left the window
        while (!dq.empty() && a[dq.back()] <= a[i]) dq.pop_back();       // can never be the max again
        dq.push_back(i);
        if (i + 1 >= k) out.push_back(a[dq.front()]);
    }
    return out;
}

int main() {
    std::deque<int> d;
    d.push_back(2); d.push_back(3); d.push_front(1); d.push_front(0);
    std::cout << "deque:";
    for (int x : d) std::cout << ' ' << x;
    std::cout << "\nfront=" << d.front() << " back=" << d.back() << " d[2]=" << d[2] << '\n';
    d.pop_front(); d.pop_back();
    std::cout << "after pop_front + pop_back:";
    for (int x : d) std::cout << ' ' << x;
    std::cout << '\n';

    std::cout << "window max (k=3):";
    for (int m : window_max({1, 3, -1, -3, 5, 3, 6, 7}, 3)) std::cout << ' ' << m;
    std::cout << '\n';
}
```

**Output:**
```text
deque: 0 1 2 3
front=0 back=3 d[2]=2
after pop_front + pop_back: 1 2
window max (k=3): 3 3 5 5 6 7
```

### 1.3 Linked list-based queue

#### In plain words
A chain of nodes. Keep a pointer to the **first** node (to remove) and to the **last** node (to add). Adding links a new node after the last one; removing moves the first pointer forward.

#### How it works
- `push`: `tail->next = node; tail = node;` (if empty, `head = tail = node`). O(1).
- `pop`: `head = head->next;` (if it becomes empty, also clear `tail`). O(1).
- Never full, never copies — but one allocation per item and poor cache locality.
- The same shape is the base of many **concurrent queues** (for example the Michael–Scott lock-free queue).

#### Modern C++ example — linked list queue
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <memory>
#include <optional>
#include <string>

template <typename T>
class ListQueue {
    struct Node { T value; std::unique_ptr<Node> next; };
public:
    ~ListQueue() { while (head_) head_ = std::move(head_->next); }
    void push(T value) {
        auto node = std::make_unique<Node>(Node{std::move(value), nullptr});
        Node* raw = node.get();
        if (tail_) tail_->next = std::move(node);       // the old tail owns the new node
        else head_ = std::move(node);
        tail_ = raw;
        ++size_;
    }
    std::optional<T> pop() {
        if (!head_) return std::nullopt;
        T value = std::move(head_->value);
        head_ = std::move(head_->next);
        if (!head_) tail_ = nullptr;
        --size_;
        return value;
    }
    std::size_t size() const { return size_; }
private:
    std::unique_ptr<Node> head_;                        // owns the chain
    Node* tail_ = nullptr;                              // non-owning pointer to the last node
    std::size_t size_ = 0;
};

int main() {
    ListQueue<std::string> printer;
    printer.push("report.pdf");
    printer.push("photo.png");
    printer.push("notes.txt");
    std::cout << printer.size() << " jobs waiting\n";
    while (auto job = printer.pop()) std::cout << "printing " << *job << '\n';
}
```

**Output:**
```text
3 jobs waiting
printing report.pdf
printing photo.png
printing notes.txt
```

### 1.4 Priority queue

#### In plain words
A hospital emergency room. Patients are not served in arrival order but by **how urgent** they are. The most urgent one is always next.

#### How it works
- Operations: `push(x)` O(log n), `top()` O(1), `pop()` O(log n).
- The usual implementation is a **binary heap** stored in an array: the children of index `i` are `2i+1` and `2i+2`, and every parent is ≥ its children (max-heap). See [Trees → Heap trees](./Trees.md#6-heap-trees-min-heap-max-heap).
  - `push`: add at the end, then **sift up** (swap with the parent while bigger).
  - `pop`: move the last element to the root, then **sift down** (swap with the bigger child).
- `std::priority_queue<T>` is a **max-heap**. For a min-heap use `std::priority_queue<T, std::vector<T>, std::greater<T>>`.
- Equal priorities come out in **no guaranteed order**. Add a sequence number if you need FIFO among ties.
- Used in Dijkstra's shortest paths, Prim's MST, top-k problems, merging k sorted lists, event simulation and OS schedulers.

#### Modern C++ example — a binary heap by hand, then `std::priority_queue`
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <functional>
#include <iostream>
#include <queue>
#include <utility>
#include <vector>

class MaxHeap {
public:
    void push(int x) {
        a_.push_back(x);
        std::size_t i = a_.size() - 1;
        while (i > 0 && a_[(i - 1) / 2] < a_[i]) {          // sift up
            std::swap(a_[(i - 1) / 2], a_[i]);
            i = (i - 1) / 2;
        }
    }
    int top() const { return a_.front(); }
    void pop() {
        a_.front() = a_.back();
        a_.pop_back();
        std::size_t i = 0;
        while (true) {                                         // sift down
            std::size_t l = 2 * i + 1, r = l + 1, big = i;
            if (l < a_.size() && a_[l] > a_[big]) big = l;
            if (r < a_.size() && a_[r] > a_[big]) big = r;
            if (big == i) break;
            std::swap(a_[i], a_[big]);
            i = big;
        }
    }
    bool empty() const { return a_.empty(); }
private:
    std::vector<int> a_;
};

int main() {
    MaxHeap h;
    for (int x : {5, 1, 8, 3, 9, 2}) h.push(x);
    std::cout << "hand-made max-heap:";
    while (!h.empty()) { std::cout << ' ' << h.top(); h.pop(); }
    std::cout << '\n';

    // Min-heap of (urgency, patient): smallest urgency number = most urgent.
    using Patient = std::pair<int, std::string>;
    std::priority_queue<Patient, std::vector<Patient>, std::greater<Patient>> er;
    er.push({3, "sprained ankle"});
    er.push({1, "heart attack"});
    er.push({2, "broken arm"});
    while (!er.empty()) {
        std::cout << "treat (urgency " << er.top().first << "): " << er.top().second << '\n';
        er.pop();
    }
}
```

**Output:**
```text
hand-made max-heap: 9 8 5 3 2 1
treat (urgency 1): heart attack
treat (urgency 2): broken arm
treat (urgency 3): sprained ankle
```

### Interview answer
"For a FIFO queue I'd use a circular buffer: head and tail indexes that wrap modulo the capacity, with a count to tell full from empty, so enqueue and dequeue are O(1) with no shifting. A linked list with head and tail pointers also gives O(1) and never fills, at the cost of an allocation per item. A deque supports O(1) at both ends — `std::deque` uses blocks so it grows at both ends without moving elements. A priority queue is a binary heap in an array: push and pop are O(log n) via sift-up and sift-down, and `std::priority_queue` is a max-heap by default."

---

## 2. Applications (e.g., BFS, job scheduling)

**In one sentence:** use a queue when items must be handled **in the order they arrived** — exploring a graph level by level, or giving work to workers fairly.

### In plain words
- **BFS** is like ripples in water: first you visit everything 1 step away, then everything 2 steps away, and so on. The queue holds "the next ripple".
- **Job scheduling** is a to-do line: jobs wait in a queue and workers take the next one. A **priority queue** lets urgent jobs jump ahead; **round-robin** gives each job a short time slice and puts it back at the end of the line.

### How it works
| Application | What the queue holds |
|---|---|
| **Breadth-first search (BFS)** | nodes discovered but not processed yet; gives **shortest paths in unweighted graphs** |
| **Level-order tree traversal** | the nodes of the next level |
| **Round-robin CPU scheduling** | ready processes; each runs one time slice, then goes to the back (see [Scheduling](../Operating%20Systems/Scheduling.md)) |
| **Producer–consumer / thread pools** | tasks waiting for a worker (a thread-safe queue) |
| **Message queues** | messages between services (see [Message Queuing](../System%20Architecture/Message-Queuing.md)) |
| **Buffers** | keyboard input, network packets, print jobs, audio samples |
| **Cache eviction (FIFO)** and **rate limiting** (sliding window of timestamps) | items in arrival order |

#### Modern C++ example — BFS shortest path, round-robin scheduling and a thread-pool task queue
```cpp
// g++ -std=c++20 -pthread main.cpp && ./a.out
#include <condition_variable>
#include <functional>
#include <iostream>
#include <mutex>
#include <queue>
#include <string>
#include <thread>
#include <vector>

// BFS: fewest moves from S to E in a grid ('#' = wall).
int bfs_steps(const std::vector<std::string>& g) {
    int rows = static_cast<int>(g.size()), cols = static_cast<int>(g[0].size());
    std::vector<std::vector<int>> dist(rows, std::vector<int>(cols, -1));
    std::queue<std::pair<int, int>> q;
    q.push({0, 0});
    dist[0][0] = 0;
    const int dr[] = {1, -1, 0, 0}, dc[] = {0, 0, 1, -1};
    while (!q.empty()) {
        auto [r, c] = q.front(); q.pop();
        if (g[r][c] == 'E') return dist[r][c];
        for (int d = 0; d < 4; ++d) {
            int nr = r + dr[d], nc = c + dc[d];
            if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
            if (g[nr][nc] == '#' || dist[nr][nc] != -1) continue;
            dist[nr][nc] = dist[r][c] + 1;               // first time seen = shortest distance
            q.push({nr, nc});
        }
    }
    return -1;
}

// Round-robin: each job runs at most `quantum` units, then goes to the back.
void round_robin(std::queue<std::pair<std::string, int>> ready, int quantum) {
    int clock = 0;
    while (!ready.empty()) {
        auto [name, left] = ready.front(); ready.pop();
        int run = std::min(quantum, left);
        clock += run;
        left -= run;
        if (left > 0) ready.push({name, left});
        else std::cout << "  " << name << " finished at t=" << clock << '\n';
    }
}

// A tiny thread pool: a mutex + condition variable around a std::queue of tasks.
class ThreadPool {
public:
    explicit ThreadPool(int n) {
        for (int i = 0; i < n; ++i)
            workers_.emplace_back([this] {
                while (true) {
                    std::function<void()> task;
                    {
                        std::unique_lock l(m_);
                        cv_.wait(l, [this] { return stop_ || !tasks_.empty(); });
                        if (stop_ && tasks_.empty()) return;
                        task = std::move(tasks_.front());
                        tasks_.pop();
                    }
                    task();
                }
            });
    }
    ~ThreadPool() {
        { std::scoped_lock l(m_); stop_ = true; }
        cv_.notify_all();
    }                                                     // jthreads join here
    void submit(std::function<void()> f) {
        { std::scoped_lock l(m_); tasks_.push(std::move(f)); }
        cv_.notify_one();
    }
private:
    std::mutex m_;
    std::condition_variable cv_;
    std::queue<std::function<void()>> tasks_;
    bool stop_ = false;
    std::vector<std::jthread> workers_;                   // declared last: destroyed (joined) first
};

int main() {
    std::vector<std::string> grid{
        "S..#",
        ".#..",
        "...#",
        "#..E",
    };
    std::cout << "BFS: fewest moves S->E = " << bfs_steps(grid) << '\n';

    std::cout << "Round-robin (quantum 2):\n";
    round_robin(std::queue<std::pair<std::string, int>>({{"A", 5}, {"B", 2}, {"C", 3}}), 2);

    std::mutex out;
    int done = 0;
    {
        ThreadPool pool(3);
        for (int i = 1; i <= 6; ++i)
            pool.submit([&, i] { std::scoped_lock l(out); done += i; });
    }                                                     // pool drains the queue, then joins
    std::cout << "thread pool ran 6 tasks, sum of ids = " << done << '\n';
}
```

**Output:**
```text
BFS: fewest moves S->E = 6
Round-robin (quantum 2):
  B finished at t=4
  C finished at t=9
  A finished at t=10
thread pool ran 6 tasks, sum of ids = 21
```

### Interview answer
"BFS uses a FIFO queue so nodes are processed in order of distance; the first time you reach a node is the shortest path in an unweighted graph, giving O(V + E). For scheduling, a FIFO ready queue gives first-come-first-served, re-queuing after a time slice gives round-robin, and a priority queue lets urgent jobs go first. In a thread pool, the task queue is protected by a mutex and a condition variable so workers sleep until there's work."

---

## Cheat sheet

| Topic | Remember |
|---|---|
| Queue | FIFO; enqueue at back, dequeue at front, both O(1) |
| Circular queue | head/tail indexes wrap with `% capacity`; keep a count to tell full from empty; no shifting |
| Linked list queue | head pointer (pop) + tail pointer (push); O(1); never full |
| Deque | O(1) at both ends; `std::deque` = blocks + index, O(1) `d[i]` |
| Sliding window max | deque of indexes with decreasing values → O(n) |
| Priority queue | binary heap; push/pop O(log n), top O(1); `std::priority_queue` is a max-heap |
| Min-heap in C++ | `priority_queue<T, vector<T>, greater<T>>` |
| BFS | queue → shortest path in unweighted graphs, O(V + E) |
| 0-1 BFS | deque: 0-weight edges to the front, 1-weight edges to the back |
| Scheduling | FIFO = FCFS; re-queue after a slice = round-robin; heap = priority scheduling |
| Thread pool | queue + mutex + condition variable |
