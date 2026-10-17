# Classic Low-Level Design Interview Problems — 12 Worked Designs in C++

> **What you'll learn:** a repeatable way to solve LLD problems, applied to the 12 most-asked ones: **LRU/LFU cache, chess / tic-tac-toe, in-memory file system, library management, logging framework, movie ticket booking, notification framework, parking lot, rate limiter, Splitwise, vending machine and elevator**. Each has the clarified scope, the core classes, the key decisions, and a compact runnable C++ core.
>
> **Prerequisites:** [OOD Fundamentals](./OOD-Fundamentals.md), [Requirements and Domain Modeling](./Requirements-and-Domain-Modeling.md), [Design Patterns in Practice](./Design-Patterns-in-Practice.md), [Implementation and Review](./Implementation-and-Review.md).

## Table of Contents
0. [The approach for every problem](#0-the-approach-for-every-problem)
1. [Design a cache with LRU/LFU eviction](#1-design-a-cache-with-lrulfu-eviction)
2. [Design a chess or tic-tac-toe engine (rules, turns, extensibility)](#2-design-a-chess-or-tic-tac-toe-engine-rules-turns-extensibility)
3. [Design a file system / in-memory directory tree](#3-design-a-file-system--in-memory-directory-tree)
4. [Design a library management system (loans, reservations, fines)](#4-design-a-library-management-system-loans-reservations-fines)
5. [Design a logging framework (appenders, levels, concurrency)](#5-design-a-logging-framework-appenders-levels-concurrency)
6. [Design a movie ticket booking system (seat locking, expiry)](#6-design-a-movie-ticket-booking-system-seat-locking-expiry)
7. [Design a notification framework with channels and retries](#7-design-a-notification-framework-with-channels-and-retries)
8. [Design a parking lot (spots, pricing, tickets, concurrency)](#8-design-a-parking-lot-spots-pricing-tickets-concurrency)
9. [Design a rate limiter (strategy interfaces, pluggable algorithms)](#9-design-a-rate-limiter-strategy-interfaces-pluggable-algorithms)
10. [Design a splitwise-style expense sharing system](#10-design-a-splitwise-style-expense-sharing-system)
11. [Design a vending machine (inventory, payment, state transitions)](#11-design-a-vending-machine-inventory-payment-state-transitions)
12. [Design an elevator system (scheduling, requests, states)](#12-design-an-elevator-system-scheduling-requests-states)
13. [Cheat sheet](#cheat-sheet)

---

## 0. The approach for every problem

1. **Clarify** (3–5 min): actors, core use cases, rules with numbers, concurrency, out of scope.
2. **Model** (5–7 min): entities, value objects, relationships, states; name the **extension points** the prompt hints at.
3. **Code the core** (20–25 min): types → one service → main flows → a quick `main`/asserts.
4. **Review** (5 min): edge cases, invariants, concurrency, failures.
5. **Trade-offs + follow-up** (5 min): complexity, what you'd change at scale, absorb the new requirement.

Most problems hinge on **one or two key ideas** — knowing them is what separates a strong answer:

| Problem | The key idea |
|---|---|
| LRU / LFU cache | hash map + doubly linked list (LRU); frequency buckets (LFU) — all O(1) |
| Chess / tic-tac-toe | `Piece` polymorphism or rule strategy; `Board` + `Game` with turns and a win checker; O(1) tic-tac-toe win check |
| File system | composite tree (`Directory` contains `Node`s); path parsing |
| Library | Copy vs. Title; loan/reservation queues; fine policy strategy |
| Logging | level filter + appender interface + async queue |
| Movie booking | **temporary seat holds with expiry**, atomic hold of several seats |
| Notifications | channel strategy + template + retry with backoff + dedupe |
| Parking lot | spot types, assignment strategy, pricing strategy, atomic allocation |
| Rate limiter | strategy interface: token bucket, sliding window, fixed window |
| Splitwise | split strategies + net balances + debt simplification |
| Vending machine | state pattern + inventory + change making |
| Elevator | request queues per direction, SCAN/LOOK scheduling, elevator state |

---

## 1. Design a cache with LRU/LFU eviction

**In one sentence:** a fixed-capacity key→value cache where `get` and `put` are **O(1)**, and when full it evicts the **least recently used** (LRU) or **least frequently used** (LFU) entry.

### In plain words
Your desk holds 5 books. When you need a 6th, one goes back to the shelf: the one you haven't touched the longest (LRU), or the one you've used the fewest times (LFU).

### Clarify
- Capacity in entries (or bytes?). `get` miss returns nothing. `put` on an existing key updates and counts as a use.
- Thread-safe? (mention a mutex or sharding). Pluggable eviction policy? (→ strategy).
- LFU tie-break: among equal frequencies evict the **least recent**.

### Core design
- **LRU:** `std::list<pair<K,V>>` ordered by recency (front = most recent) + `unordered_map<K, list::iterator>`. `get` = find + `splice` to front. `put` = insert at front; if over capacity, erase `back()`.
- **LFU:** `unordered_map<K, Node{value, freq, iterator}>` + `unordered_map<freq, list<K>>` + `min_freq`. Use moves a key from list `f` to list `f+1`; eviction takes the back of the `min_freq` list. All O(1).
- **Extension:** `EvictionPolicy` interface (`touch`, `insert`, `victim`, `erase`) so LRU/LFU/FIFO/TTL plug in.

#### Modern C++ example — O(1) LRU and O(1) LFU
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <list>
#include <optional>
#include <string>
#include <unordered_map>

template <class K, class V>
class LRUCache {
public:
    explicit LRUCache(std::size_t cap) : cap_(cap) {}
    std::optional<V> get(const K& k) {
        auto it = map_.find(k);
        if (it == map_.end()) return std::nullopt;
        items_.splice(items_.begin(), items_, it->second);          // mark most recent, O(1)
        return it->second->second;
    }
    void put(const K& k, V v) {
        if (auto it = map_.find(k); it != map_.end()) {
            it->second->second = std::move(v);
            items_.splice(items_.begin(), items_, it->second);
            return;
        }
        if (items_.size() == cap_) {                                 // evict least recent
            std::cout << "  LRU evicts " << items_.back().first << '\n';
            map_.erase(items_.back().first);
            items_.pop_back();
        }
        items_.emplace_front(k, std::move(v));
        map_[k] = items_.begin();
    }
private:
    std::size_t cap_;
    std::list<std::pair<K, V>> items_;
    std::unordered_map<K, typename std::list<std::pair<K, V>>::iterator> map_;
};

template <class K, class V>
class LFUCache {
    struct Node { V value; int freq; typename std::list<K>::iterator pos; };
public:
    explicit LFUCache(std::size_t cap) : cap_(cap) {}
    std::optional<V> get(const K& k) {
        auto it = nodes_.find(k);
        if (it == nodes_.end()) return std::nullopt;
        bump(k, it->second);
        return it->second.value;
    }
    void put(const K& k, V v) {
        if (cap_ == 0) return;
        if (auto it = nodes_.find(k); it != nodes_.end()) { it->second.value = std::move(v); bump(k, it->second); return; }
        if (nodes_.size() == cap_) {                                 // evict: lowest freq, least recent among them
            K victim = buckets_[min_freq_].back();
            std::cout << "  LFU evicts " << victim << '\n';
            buckets_[min_freq_].pop_back();
            nodes_.erase(victim);
        }
        buckets_[1].push_front(k);
        nodes_[k] = {std::move(v), 1, buckets_[1].begin()};
        min_freq_ = 1;
    }
private:
    void bump(const K& k, Node& n) {
        buckets_[n.freq].erase(n.pos);
        if (buckets_[n.freq].empty() && min_freq_ == n.freq) ++min_freq_;
        ++n.freq;
        buckets_[n.freq].push_front(k);
        n.pos = buckets_[n.freq].begin();
    }
    std::size_t cap_;
    int min_freq_ = 0;
    std::unordered_map<K, Node> nodes_;
    std::unordered_map<int, std::list<K>> buckets_;                  // freq -> keys, most recent first
};

int main() {
    std::cout << "LRU(2):\n";
    LRUCache<std::string, int> lru(2);
    lru.put("a", 1); lru.put("b", 2);
    lru.get("a");                                                   // a is now most recent
    lru.put("c", 3);                                                // evicts b
    std::cout << "  get b: " << (lru.get("b") ? "hit" : "miss") << ", get a: " << *lru.get("a") << '\n';

    std::cout << "LFU(2):\n";
    LFUCache<std::string, int> lfu(2);
    lfu.put("a", 1); lfu.put("b", 2);
    lfu.get("a"); lfu.get("a"); lfu.get("b");                        // a: freq 3, b: freq 2
    lfu.put("c", 3);                                                // evicts b (lower frequency)
    lfu.put("d", 4);                                                // evicts c (freq 1)
    std::cout << "  get a: " << *lfu.get("a") << ", get b: " << (lfu.get("b") ? "hit" : "miss") << '\n';
}
```

**Output:**
```text
LRU(2):
  LRU evicts b
  get b: miss, get a: 1
LFU(2):
  LFU evicts b
  LFU evicts c
  get a: 1, get b: miss
```

### Interview answer
"LRU is a hash map from key to a node in a doubly linked list ordered by recency; get splices the node to the front and put evicts from the back, so both are O(1). LFU keeps per-frequency lists plus the current minimum frequency; a use moves the key to the next frequency list and eviction takes the least recent key of the minimum frequency, also O(1). I'd put the policy behind an interface and add a mutex or shards for concurrency."

---

## 2. Design a chess or tic-tac-toe engine (rules, turns, extensibility)

**In one sentence:** model a **Board**, **Players** and a **Game** that enforces **turns**, validates **moves** through rules, detects **win/draw**, and is extensible to new pieces, board sizes or variants.

### In plain words
The board is the table; the game is the referee. The referee checks whose turn it is, whether the move is legal, and whether someone has won — the board just holds the pieces.

### Clarify
- Tic-tac-toe: N×N board, K in a row to win? Two humans, or a bot? Undo?
- Chess: full rules (castling, en passant, promotion, check/checkmate) or piece movement only? Usually: movement + captures + turns, and *discuss* check detection.

### Core design
| Class | Responsibility |
|---|---|
| `Board` | cells, bounds, place/move, `at(pos)` |
| `Piece` (chess) | `virtual bool can_move(from, to, board)` per type — polymorphism, or a move-generator table |
| `Player` | name, symbol/color; `HumanPlayer` / `BotPlayer` with a `next_move()` strategy |
| `Game` | turn order, `play(move)`, status (`InProgress`, `Won`, `Draw`), move history (Command → undo) |
| `WinChecker` | strategy: K-in-a-row, chess checkmate |

- **O(1) win check for tic-tac-toe:** keep counters per row, column and both diagonals; add +1 for X and −1 for O. A counter reaching ±N means a win.
- **Chess pieces:** sliding pieces (rook, bishop, queen) share a "walk in direction until blocked" helper — composition over deep hierarchies.

#### Modern C++ example — N×N tic-tac-toe with O(1) win detection, and chess piece rules
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <cstdlib>
#include <iostream>
#include <memory>
#include <optional>
#include <string>
#include <vector>

class TicTacToe {
public:
    enum class Status { InProgress, XWins, OWins, Draw };
    explicit TicTacToe(int n) : n_(n), cells_(n * n, '.'), rows_(n), cols_(n) {}
    std::optional<std::string> play(int r, int c) {                       // error or nullopt
        if (status_ != Status::InProgress) return "game over";
        if (r < 0 || r >= n_ || c < 0 || c >= n_) return "off the board";
        if (cells_[r * n_ + c] != '.') return "cell taken";
        char sym = x_turn_ ? 'X' : 'O';
        int d = x_turn_ ? 1 : -1;
        cells_[r * n_ + c] = sym;
        rows_[r] += d; cols_[c] += d;
        if (r == c) diag_ += d;
        if (r + c == n_ - 1) anti_ += d;
        if (std::abs(rows_[r]) == n_ || std::abs(cols_[c]) == n_ || std::abs(diag_) == n_ || std::abs(anti_) == n_)
            status_ = x_turn_ ? Status::XWins : Status::OWins;           // O(1) win check
        else if (++moves_ == n_ * n_) status_ = Status::Draw;
        x_turn_ = !x_turn_;
        return std::nullopt;
    }
    Status status() const { return status_; }
    void print() const { for (int r = 0; r < n_; ++r) std::cout << "  " << std::string(cells_.begin() + r * n_, cells_.begin() + (r + 1) * n_) << '\n'; }
private:
    int n_;
    std::vector<char> cells_;
    std::vector<int> rows_, cols_;
    int diag_ = 0, anti_ = 0, moves_ = 0;
    bool x_turn_ = true;
    Status status_ = Status::InProgress;
};

// Chess: each piece type knows its own movement rule.
struct Pos { int r, c; };
class ChessBoard;
class Piece {
public:
    virtual ~Piece() = default;
    virtual bool can_move(Pos from, Pos to, const ChessBoard& b) const = 0;
    virtual char symbol() const = 0;
};
class ChessBoard {
public:
    bool empty(Pos p) const { return !grid_[p.r][p.c]; }
    void put(Pos p, std::unique_ptr<Piece> piece) { grid_[p.r][p.c] = std::move(piece); }
    const Piece* at(Pos p) const { return grid_[p.r][p.c].get(); }
    bool path_clear(Pos a, Pos b) const {                                  // shared by sliding pieces
        int dr = (b.r > a.r) - (b.r < a.r), dc = (b.c > a.c) - (b.c < a.c);
        for (Pos p{a.r + dr, a.c + dc}; p.r != b.r || p.c != b.c; p.r += dr, p.c += dc) if (!empty(p)) return false;
        return true;
    }
private:
    std::unique_ptr<Piece> grid_[8][8];
};
class Rook : public Piece {
    bool can_move(Pos a, Pos b, const ChessBoard& bd) const override { return (a.r == b.r || a.c == b.c) && bd.path_clear(a, b); }
    char symbol() const override { return 'R'; }
};
class Bishop : public Piece {
    bool can_move(Pos a, Pos b, const ChessBoard& bd) const override { return std::abs(a.r - b.r) == std::abs(a.c - b.c) && bd.path_clear(a, b); }
    char symbol() const override { return 'B'; }
};
class Knight : public Piece {
    bool can_move(Pos a, Pos b, const ChessBoard&) const override { int dr = std::abs(a.r - b.r), dc = std::abs(a.c - b.c); return dr * dc == 2; }
    char symbol() const override { return 'N'; }
};

int main() {
    TicTacToe g(3);
    for (auto [r, c] : std::vector<std::pair<int, int>>{{0, 0}, {1, 1}, {0, 1}, {0, 1}, {2, 2}, {0, 2}, {2, 0}, {1, 0}, {2, 1}}) {
        if (auto err = g.play(r, c)) std::cout << "move (" << r << ',' << c << ") rejected: " << *err << '\n';
        if (g.status() != TicTacToe::Status::InProgress) break;
    }
    g.print();
    std::cout << "status: " << (g.status() == TicTacToe::Status::XWins ? "X wins" : g.status() == TicTacToe::Status::OWins ? "O wins" : "other") << '\n';

    ChessBoard b;
    b.put({0, 0}, std::make_unique<Rook>());
    b.put({0, 3}, std::make_unique<Bishop>());
    b.put({7, 1}, std::make_unique<Knight>());
    std::cout << std::boolalpha
              << "rook a8->a1 (clear file): " << b.at({0, 0})->can_move({0, 0}, {7, 0}, b) << '\n'
              << "rook a8->h8 (bishop in the way): " << b.at({0, 0})->can_move({0, 0}, {0, 7}, b) << '\n'
              << "knight b1->c3: " << b.at({7, 1})->can_move({7, 1}, {5, 2}, b) << '\n';
}
```

**Output:**
```text
move (0,1) rejected: cell taken
  XXX
  .O.
  ..O
status: X wins
rook a8->a1 (clear file): true
rook a8->h8 (bishop in the way): false
knight b1->c3: true
```

### Interview answer
"I separate the Board, which stores pieces, from the Game, which enforces turns, validates moves and tracks status and history. For tic-tac-toe I check wins in O(1) with signed counters per row, column and diagonal. For chess each piece type implements its own movement rule, with sliding pieces sharing a path-clear helper; check detection asks whether any enemy piece can move to the king. Players are a strategy so humans and bots plug in, and moves as Commands give undo."

---

## 3. Design a file system / in-memory directory tree

**In one sentence:** an in-memory tree of **directories and files** supporting `mkdir -p`, `ls`, create/read/append files, `rm`, sizes and paths — the textbook **Composite pattern**.

### In plain words
Folders inside folders, with files as leaves. A folder's size is the sum of everything inside it.

### Clarify
- Operations: `mkdir(path)`, `ls(path)` (sorted?), `write/append(path, data)`, `read`, `rm` (recursive?), `size`. Absolute paths only? Permissions, links? (usually out of scope)

### Core design
- `Node` (abstract: name, parent, `size()`), `File` (content), `Directory` (`std::map<string, unique_ptr<Node>>` — sorted children for `ls`).
- `FileSystem` parses paths (`/a/b/c` → tokens) and walks the tree; `mkdir -p` creates missing directories.
- Errors: path not found, file where a directory is expected, name clash.
- **Extensions:** permissions (owner + mode on `Node`), symlinks (a `Link` node), search by name/extension (visitor or DFS).

#### Modern C++ example — composite tree with mkdir -p, ls, write, size and rm
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <memory>
#include <sstream>
#include <stdexcept>
#include <string>
#include <vector>

class Node {
public:
    explicit Node(std::string name) : name(std::move(name)) {}
    virtual ~Node() = default;
    virtual std::size_t size() const = 0;
    virtual bool is_dir() const = 0;
    std::string name;
};
class File : public Node {
public:
    using Node::Node;
    std::size_t size() const override { return data.size(); }
    bool is_dir() const override { return false; }
    std::string data;
};
class Directory : public Node {
public:
    using Node::Node;
    std::size_t size() const override { std::size_t s = 0; for (auto& [n, c] : children) s += c->size(); return s; }   // composite
    bool is_dir() const override { return true; }
    std::map<std::string, std::unique_ptr<Node>> children;                // sorted for ls
};

class FileSystem {
public:
    void mkdir(const std::string& path) { walk(path, true); }
    void write(const std::string& path, const std::string& data, bool append = false) {
        auto [dir, name] = split(path);
        Directory& d = walk(dir, true);
        auto& slot = d.children[name];
        if (!slot) slot = std::make_unique<File>(name);
        if (slot->is_dir()) throw std::runtime_error(path + " is a directory");
        auto& f = static_cast<File&>(*slot);
        f.data = append ? f.data + data : data;
    }
    std::string read(const std::string& path) {
        auto [dir, name] = split(path);
        auto& d = walk(dir, false);
        auto it = d.children.find(name);
        if (it == d.children.end() || it->second->is_dir()) throw std::runtime_error("no such file " + path);
        return static_cast<File&>(*it->second).data;
    }
    std::vector<std::string> ls(const std::string& path) {
        std::vector<std::string> out;
        for (auto& [n, c] : walk(path, false).children) out.push_back(n + (c->is_dir() ? "/" : ""));
        return out;
    }
    std::size_t du(const std::string& path) { return walk(path, false).size(); }
    void rm(const std::string& path) {
        auto [dir, name] = split(path);
        if (!walk(dir, false).children.erase(name)) throw std::runtime_error("no such path " + path);
    }
private:
    static std::vector<std::string> tokens(const std::string& p) {
        std::vector<std::string> t; std::stringstream ss(p); std::string part;
        while (std::getline(ss, part, '/')) if (!part.empty()) t.push_back(part);
        return t;
    }
    static std::pair<std::string, std::string> split(const std::string& p) {
        auto i = p.find_last_of('/');
        return {p.substr(0, i), p.substr(i + 1)};
    }
    Directory& walk(const std::string& path, bool create) {
        Directory* d = &root_;
        for (const auto& part : tokens(path)) {
            auto& slot = d->children[part];
            if (!slot) {
                if (!create) { d->children.erase(part); throw std::runtime_error("no such directory " + path); }
                slot = std::make_unique<Directory>(part);
            }
            if (!slot->is_dir()) throw std::runtime_error(part + " is a file");
            d = static_cast<Directory*>(slot.get());
        }
        return *d;
    }
    Directory root_{""};
};

int main() {
    FileSystem fs;
    fs.mkdir("/home/mona/projects");
    fs.write("/home/mona/notes.txt", "hello");
    fs.write("/home/mona/notes.txt", " world", true);
    fs.write("/home/mona/projects/main.cpp", "int main(){}");
    auto print = [](const std::vector<std::string>& v) { for (auto& s : v) std::cout << ' ' << s; std::cout << '\n'; };
    std::cout << "ls /home/mona:"; print(fs.ls("/home/mona"));
    std::cout << "cat notes.txt: " << fs.read("/home/mona/notes.txt") << '\n';
    std::cout << "du /home: " << fs.du("/home") << " bytes\n";
    fs.rm("/home/mona/projects");
    std::cout << "after rm projects:"; print(fs.ls("/home/mona"));
    for (auto bad : {"/home/mona/notes.txt/x", "/nope/file"})
        try { fs.read(bad); } catch (const std::exception& e) { std::cout << "error: " << e.what() << '\n'; }
}
```

**Output:**
```text
ls /home/mona: notes.txt projects/
cat notes.txt: hello world
du /home: 23 bytes
after rm projects: notes.txt
error: notes.txt is a file
error: no such directory /nope
```

### Interview answer
"It's the Composite pattern: an abstract Node with File and Directory, where a directory owns its children in a sorted map so `ls` is ordered and `size` recurses. A FileSystem class parses paths and walks the tree, creating directories for `mkdir -p`, and returns clear errors when a path is missing or a file sits where a directory is expected. Permissions, links and search are extensions on the Node type or a visitor."

---

## 4. Design a library management system (loans, reservations, fines)

**In one sentence:** members **borrow** physical **copies** of **titles**, **reserve** titles with no free copy (a FIFO queue per title), **return** them, and pay **fines** for late returns, with limits per member.

### In plain words
The library owns 3 copies of the same book. When all are out, you join that book's waiting line. When a copy comes back, the first person in line gets it held for them. Late? You owe a fine.

### Clarify
- Title (ISBN, author) vs. **Copy** (barcode, status). Max loans per member, loan period, fine per day and cap, reservation hold time. Librarian vs. member actions.

### Core design
| Class | Responsibility |
|---|---|
| `Title`, `Copy` | catalog vs. physical item (`Available`, `Lent`, `OnHold`, `Lost`) |
| `Member` | limits, active loans, unpaid fines |
| `Loan` | copy, member, due date |
| `ReservationQueue` | FIFO of members per ISBN |
| `FinePolicy` | strategy: per day, capped, grace days |
| `LibraryService` | `borrow`, `return_copy`, `reserve`; enforces rules; uses a `Clock` |

- On return: compute the fine; if someone is waiting for that title, put the copy **OnHold** for them instead of Available.
- Concurrency: one lock per title (two members racing for the last copy).

#### Modern C++ example — loans, a reservation queue and capped fines
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <deque>
#include <functional>
#include <iostream>
#include <map>
#include <optional>
#include <string>
#include <vector>

enum class CopyState { Available, Lent, OnHold };
struct Copy { std::string barcode, isbn; CopyState state = CopyState::Available; std::string holder = {}; };
struct Member { std::string id; int loans = 0; long fines = 0; };
struct Loan { std::string barcode, member; int due; };

class Library {
public:
    Library(std::function<long(int)> fine_policy, int max_loans) : fine_(std::move(fine_policy)), max_loans_(max_loans) {}
    void add_copy(std::string barcode, std::string isbn) { copies_[barcode] = {barcode, isbn}; }
    Member& member(const std::string& id) { auto& m = members_[id]; m.id = id; return m; }

    std::string borrow(const std::string& who, const std::string& isbn, int today) {
        Member& m = member(who);
        if (m.loans >= max_loans_) return "limit reached";
        if (m.fines > 0) return "unpaid fines";
        for (auto& [bc, c] : copies_) {
            bool mine_on_hold = c.state == CopyState::OnHold && c.holder == who;
            if (c.isbn == isbn && (c.state == CopyState::Available || mine_on_hold)) {
                c.state = CopyState::Lent; c.holder = who; ++m.loans;
                loans_[bc] = {bc, who, today + 14};
                return "lent " + bc + ", due day " + std::to_string(today + 14);
            }
        }
        auto& q = waiting_[isbn];
        if (std::find(q.begin(), q.end(), who) == q.end()) q.push_back(who);
        return "no copy free; reserved, position " + std::to_string(q.size());
    }
    std::string return_copy(const std::string& barcode, int today) {
        Loan loan = loans_.at(barcode);
        loans_.erase(barcode);
        Member& m = member(loan.member);
        --m.loans;
        long fine = fine_(std::max(0, today - loan.due));
        m.fines += fine;
        Copy& c = copies_.at(barcode);
        auto& q = waiting_[c.isbn];
        std::string out = loan.member + " returned " + barcode + (fine ? ", fine " + std::to_string(fine / 100) : "");
        if (!q.empty()) { c.state = CopyState::OnHold; c.holder = q.front(); q.pop_front(); out += "; held for " + c.holder; }
        else { c.state = CopyState::Available; c.holder.clear(); }
        return out;
    }
private:
    std::function<long(int)> fine_;
    int max_loans_;
    std::map<std::string, Copy> copies_;
    std::map<std::string, Member> members_;
    std::map<std::string, Loan> loans_;
    std::map<std::string, std::deque<std::string>> waiting_;
};

int main() {
    auto capped = [](int days_late) { return std::min<long>(days_late * 5'00, 50'00); };   // FinePolicy strategy
    Library lib(capped, 2);
    lib.add_copy("B1", "ddia");
    std::cout << lib.borrow("ali", "ddia", 0) << '\n';
    std::cout << lib.borrow("bea", "ddia", 1) << '\n';
    std::cout << lib.borrow("chen", "ddia", 2) << '\n';
    std::cout << lib.return_copy("B1", 30) << '\n';                    // 16 days late -> capped fine
    std::cout << lib.borrow("chen", "ddia", 31) << '\n';               // not chen's turn
    std::cout << lib.borrow("bea", "ddia", 31) << '\n';                // bea's hold
    std::cout << lib.borrow("ali", "ddia", 31) << '\n';                // ali owes a fine
}
```

**Output:**
```text
lent B1, due day 14
no copy free; reserved, position 1
no copy free; reserved, position 2
ali returned B1, fine 50; held for bea
no copy free; reserved, position 1
lent B1, due day 45
unpaid fines
```

### Interview answer
"I separate Title from Copy, give copies a state machine — available, lent, on hold, lost — and keep a FIFO reservation queue per title. On return the service computes the fine through a pluggable policy and, if someone is waiting, puts the copy on hold for the first in line. Member limits and unpaid fines are checked on borrow, and in a concurrent version I'd lock per title so two members can't take the last copy."

---

## 5. Design a logging framework (appenders, levels, concurrency)

**In one sentence:** a logger with **levels** (DEBUG < INFO < WARN < ERROR), pluggable **appenders** (console, file, network) and **formatters**, that's **thread-safe** and doesn't slow the caller down (**async** queue).

### In plain words
Every part of the app shouts messages. The logger decides which are important enough (level), what they look like (format), and where they go (screen, file, monitoring), without making the shouting code wait.

### Clarify
- Per-logger levels (`"db"` at DEBUG, root at INFO)? Several appenders per logger? Sync or async? What if the queue is full — block or drop? Flush on shutdown.

### Core design
- `LogRecord{level, logger, message, timestamp, thread}`.
- `Appender` interface (`append(record)`), `Formatter` interface; console/file/memory appenders.
- `Logger` checks the level **first** (cheap early exit), then hands the record to an `AsyncDispatcher`: a bounded queue + one background thread that calls appenders (Producer–Consumer).
- `LoggerRegistry` (factory) returns named loggers; configuration sets levels and appenders.
- On shutdown, the destructor **drains** the queue.

#### Modern C++ example — levels, two appenders and an async, thread-safe dispatcher
```cpp
// g++ -std=c++20 -pthread main.cpp && ./a.out
#include <condition_variable>
#include <iostream>
#include <map>
#include <memory>
#include <mutex>
#include <queue>
#include <string>
#include <thread>
#include <vector>

enum class Level { Debug, Info, Warn, Error };
const char* name(Level l) { return l == Level::Debug ? "DEBUG" : l == Level::Info ? "INFO" : l == Level::Warn ? "WARN" : "ERROR"; }
struct Record { Level level; std::string logger, msg; };

class Appender { public: virtual ~Appender() = default; virtual void append(const Record&) = 0; };
class ConsoleAppender : public Appender {
public:
    void append(const Record& r) override { std::cout << "[" << name(r.level) << "] " << r.logger << ": " << r.msg << '\n'; }
};
class CountingAppender : public Appender {                 // e.g. metrics: records per level
public:
    void append(const Record& r) override { ++count[name(r.level)]; }
    std::map<std::string, int> count;
};
class MemoryAppender : public Appender {                   // e.g. for tests, or an "errors only" sink
public:
    explicit MemoryAppender(Level min) : min_(min) {}
    void append(const Record& r) override { if (r.level >= min_) lines.push_back(r.msg); }
    std::vector<std::string> lines;
private:
    Level min_;
};

class AsyncDispatcher {                                     // producer-consumer: callers never block on I/O
public:
    explicit AsyncDispatcher(std::vector<std::shared_ptr<Appender>> a) : appenders_(std::move(a)), worker_([this] { run(); }) {}
    ~AsyncDispatcher() { { std::scoped_lock l(m_); stop_ = true; } cv_.notify_one(); worker_.join(); }   // drains first
    void submit(Record r) { { std::scoped_lock l(m_); q_.push(std::move(r)); } cv_.notify_one(); }
private:
    void run() {
        while (true) {
            std::unique_lock l(m_);
            cv_.wait(l, [&] { return stop_ || !q_.empty(); });
            if (q_.empty() && stop_) return;
            Record r = std::move(q_.front()); q_.pop();
            l.unlock();
            for (auto& a : appenders_) a->append(r);       // only the worker touches appenders
        }
    }
    std::vector<std::shared_ptr<Appender>> appenders_;
    std::mutex m_; std::condition_variable cv_; std::queue<Record> q_; bool stop_ = false;
    std::thread worker_;
};

class Logger {
public:
    Logger(std::string name, Level level, AsyncDispatcher& d) : name_(std::move(name)), level_(level), d_(d) {}
    void log(Level l, std::string msg) { if (l >= level_) d_.submit({l, name_, std::move(msg)}); }   // cheap filter first
    void set_level(Level l) { level_ = l; }
private:
    std::string name_; Level level_; AsyncDispatcher& d_;
};

int main() {
    auto errors = std::make_shared<MemoryAppender>(Level::Error);
    auto counter = std::make_shared<CountingAppender>();
    {
        AsyncDispatcher dispatcher({std::make_shared<ConsoleAppender>(), errors, counter});
        Logger db("db", Level::Debug, dispatcher), http("http", Level::Warn, dispatcher);
        db.log(Level::Debug, "connection pool ready");
        http.log(Level::Info, "GET /health");                 // filtered: below WARN
        http.log(Level::Warn, "slow request 1200ms");
        db.log(Level::Error, "deadlock detected, retrying");
        std::vector<std::jthread> workers;                     // many threads logging at once
        for (int t = 0; t < 4; ++t)
            workers.emplace_back([&, t] { http.log(Level::Info, "request " + std::to_string(t)); db.log(Level::Warn, "slow query"); });
        workers.clear();
    }                                                          // dispatcher drains and joins here
    std::cout << "errors captured: " << errors->lines.size() << " -> " << errors->lines.at(0) << '\n';
    std::cout << "counted: " << counter->count["DEBUG"] << " DEBUG, " << counter->count["WARN"] << " WARN, "
              << counter->count["ERROR"] << " ERROR, " << counter->count["INFO"] << " INFO (filtered out)\n";
}
```

**Output:**
```text
[DEBUG] db: connection pool ready
[WARN] http: slow request 1200ms
[ERROR] db: deadlock detected, retrying
[WARN] db: slow query
[WARN] db: slow query
[WARN] db: slow query
[WARN] db: slow query
errors captured: 1 -> deadlock detected, retrying
counted: 1 DEBUG, 5 WARN, 1 ERROR, 0 INFO (filtered out)
```

The four worker threads log concurrently without corrupting anything; their INFO lines are dropped by the level check before they ever reach the queue.

### Interview answer
"A Logger filters by level first so disabled logs cost almost nothing, then hands a record to a dispatcher with a queue and a background thread — callers never block on I/O and only one thread touches the appenders, so they don't need their own locks. Appenders and formatters are interfaces, so console, file and network sinks plug in, each with its own minimum level. On shutdown the dispatcher drains the queue; for a bounded queue I'd choose between blocking and dropping debug logs."

---

## 6. Design a movie ticket booking system (seat locking, expiry)

**In one sentence:** users browse **shows**, pick **seats**, and the system **temporarily holds** them (e.g. 5 minutes) while the user pays; **payment confirms** the booking, **timeout releases** the seats, and **no seat is ever sold twice**.

### In plain words
At the counter, the cashier puts a "reserved" card on your seats while you find your wallet. If you take too long, the cards are removed and others can buy them.

### Clarify
- Cinema → screens → shows (movie, time); seat map per show; seat types and prices. Hold duration. Several seats in one hold, **all-or-nothing**. Many users at once.

### Core design
| Class | Responsibility |
|---|---|
| `Show` | seat states for one screening (`Free`, `Held{hold_id, expires}`, `Booked`) |
| `Hold` | id, user, seats, expiry |
| `BookingService` | `hold(show, seats, user)`, `confirm(hold_id, payment)`, `release_expired(now)` |
| `PricingStrategy` | seat type / time-of-day pricing |
| `Clock` | injected (tests move time forward) |

- **Atomic multi-seat hold:** under the show's lock, check **all** seats first, then mark all — never half a hold.
- Expired holds count as free (lazy expiry) and a sweeper cleans them.
- In a database: a unique constraint on `(show_id, seat_id)` in the bookings table, or `SELECT … FOR UPDATE`, or optimistic version checks.

#### Modern C++ example — all-or-nothing seat holds with expiry and confirmation
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <mutex>
#include <optional>
#include <string>
#include <vector>

struct SeatState { enum Kind { Free, Held, Booked } kind = Free; int hold_id = 0; int expires = 0; };

class Show {
public:
    Show(std::vector<std::string> seats) { for (auto& s : seats) seats_[s]; }
    std::optional<int> hold(const std::vector<std::string>& wanted, int now, int ttl) {
        std::scoped_lock l(m_);
        for (auto& s : wanted) if (!is_free(seats_.at(s), now)) return std::nullopt;   // check ALL first
        int id = ++next_hold_;
        for (auto& s : wanted) seats_[s] = {SeatState::Held, id, now + ttl};          // then take all
        holds_[id] = wanted;
        return id;
    }
    bool confirm(int hold_id, int now) {
        std::scoped_lock l(m_);
        auto it = holds_.find(hold_id);
        if (it == holds_.end()) return false;
        for (auto& s : it->second) {
            auto& st = seats_[s];
            if (st.kind != SeatState::Held || st.hold_id != hold_id || st.expires <= now) { holds_.erase(it); return false; }
        }
        for (auto& s : it->second) seats_[s].kind = SeatState::Booked;
        holds_.erase(it);
        return true;
    }
    std::string map(int now) const {
        std::scoped_lock l(m_);
        std::string out;
        for (auto& [name, st] : seats_) out += name + (st.kind == SeatState::Booked ? "=X " : is_free(st, now) ? "=. " : "=h ");
        return out;
    }
private:
    static bool is_free(const SeatState& s, int now) { return s.kind == SeatState::Free || (s.kind == SeatState::Held && s.expires <= now); }
    mutable std::mutex m_;
    std::map<std::string, SeatState> seats_;
    std::map<int, std::vector<std::string>> holds_;
    int next_hold_ = 0;
};

int main() {
    Show show({"A1", "A2", "A3", "A4"});
    const int ttl = 300;                                                  // 5 minutes
    auto h1 = show.hold({"A1", "A2"}, 0, ttl);
    std::cout << "user1 holds A1,A2: " << (h1 ? "ok" : "failed") << " | " << show.map(0) << '\n';
    auto h2 = show.hold({"A2", "A3"}, 10, ttl);                           // A2 taken -> nothing held
    std::cout << "user2 holds A2,A3: " << (h2 ? "ok" : "failed (all-or-nothing)") << " | " << show.map(10) << '\n';
    std::cout << "user1 pays at t=400 (expired): " << (show.confirm(*h1, 400) ? "booked" : "too late") << " | " << show.map(400) << '\n';
    auto h3 = show.hold({"A2", "A3"}, 400, ttl);
    std::cout << "user2 retries: " << (h3 ? "ok" : "failed") << ", pays at t=450: " << (show.confirm(*h3, 450) ? "booked" : "too late")
              << " | " << show.map(450) << '\n';
}
```

**Output:**
```text
user1 holds A1,A2: ok | A1=h A2=h A3=. A4=. 
user2 holds A2,A3: failed (all-or-nothing) | A1=h A2=h A3=. A4=. 
user1 pays at t=400 (expired): too late | A1=. A2=. A3=. A4=. 
user2 retries: ok, pays at t=450: booked | A1=. A2=X A3=X A4=. 
```

### Interview answer
"The core is a temporary hold: under the show's lock I check every requested seat and only then mark them all held with an expiry, so a multi-seat hold is all-or-nothing. Payment confirms only if the hold is still valid; expired holds count as free and a sweeper cleans them. In a database I'd back this with a unique constraint on show and seat, or row locks, so two servers can never sell the same seat."

---

## 7. Design a notification framework with channels and retries

**In one sentence:** a service that sends a message to a user over **channels** (email, SMS, push), using **templates** and **user preferences**, with **retries with backoff**, **fallback channels**, and **deduplication**.

### In plain words
"Your order shipped!" should reach the user once — by push if they allow it, or by email — and if the email server is down for a minute, it tries again later instead of losing the message.

### Clarify
- Which channels? Per-user preferences / opt-out? Templates with variables? Priority (OTP now vs. newsletter later)? Retry policy? Rate limits per user? Delivery tracking?

### Core design
| Class | Responsibility |
|---|---|
| `Channel` interface | `send(user, rendered)` → ok / transient error / permanent error |
| `TemplateEngine` | `"Hi {name}, order {id} shipped"` + variables |
| `PreferenceStore` | which channels a user accepts, in order |
| `RetryPolicy` | max attempts, backoff |
| `NotificationService` | renders, picks channels, retries transient errors, falls back, dedupes by `notification_id` |

- **Transient vs. permanent:** retry timeouts; don't retry "invalid phone number" — fall back to the next channel.
- In production, sends go through a **queue** (async, at-least-once), so **dedupe** by an idempotency key.

#### Modern C++ example — templates, preferences, retries with backoff and fallback
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <memory>
#include <set>
#include <string>
#include <vector>

enum class SendResult { Ok, Transient, Permanent };

class Channel {
public:
    virtual ~Channel() = default;
    virtual SendResult send(const std::string& user, const std::string& text) = 0;
    virtual std::string name() const = 0;
};
class FlakyEmail : public Channel {                           // fails twice, then works
public:
    SendResult send(const std::string& u, const std::string& t) override {
        if (++calls_ <= 2) return SendResult::Transient;
        std::cout << "  email to " << u << ": " << t << '\n'; return SendResult::Ok;
    }
    std::string name() const override { return "email"; }
private:
    int calls_ = 0;
};
class Sms : public Channel {
public:
    SendResult send(const std::string& u, const std::string& t) override {
        if (u == "bea") return SendResult::Permanent;          // no phone number on file
        std::cout << "  sms to " << u << ": " << t << '\n'; return SendResult::Ok;
    }
    std::string name() const override { return "sms"; }
};

std::string render(std::string tpl, const std::map<std::string, std::string>& vars) {
    for (auto& [k, v] : vars) {
        std::string key = "{" + k + "}";
        for (auto pos = tpl.find(key); pos != std::string::npos; pos = tpl.find(key)) tpl.replace(pos, key.size(), v);
    }
    return tpl;
}

class NotificationService {
public:
    void add_channel(std::shared_ptr<Channel> c) { channels_[c->name()] = std::move(c); }
    void set_preferences(const std::string& user, std::vector<std::string> order) { prefs_[user] = std::move(order); }
    bool notify(const std::string& id, const std::string& user, const std::string& tpl, const std::map<std::string, std::string>& vars) {
        if (!sent_.insert(id).second) { std::cout << "  duplicate " << id << " ignored\n"; return true; }
        std::string text = render(tpl, vars);
        for (const auto& ch : prefs_[user]) {                  // fallback order = user preference
            int backoff = 1;
            for (int attempt = 1; attempt <= 3; ++attempt, backoff *= 2) {
                SendResult r = channels_.at(ch)->send(user, text);
                if (r == SendResult::Ok) return true;
                if (r == SendResult::Permanent) { std::cout << "  " << ch << " permanent failure, falling back\n"; break; }
                std::cout << "  " << ch << " transient failure, retry in " << backoff << "s\n";
            }
        }
        std::cout << "  all channels failed for " << id << '\n';
        return false;
    }
private:
    std::map<std::string, std::shared_ptr<Channel>> channels_;
    std::map<std::string, std::vector<std::string>> prefs_;
    std::set<std::string> sent_;                               // dedupe by notification id
};

int main() {
    NotificationService svc;
    svc.add_channel(std::make_shared<FlakyEmail>());
    svc.add_channel(std::make_shared<Sms>());
    svc.set_preferences("ali", {"email", "sms"});
    svc.set_preferences("bea", {"sms", "email"});
    const std::string tpl = "Hi {name}, order {order} shipped";
    std::cout << "n1 (ali):\n"; svc.notify("n1", "ali", tpl, {{"name", "Ali"}, {"order", "#81"}});
    std::cout << "n2 (bea):\n"; svc.notify("n2", "bea", tpl, {{"name", "Bea"}, {"order", "#82"}});
    std::cout << "n1 again:\n"; svc.notify("n1", "ali", tpl, {{"name", "Ali"}, {"order", "#81"}});
}
```

**Output:**
```text
n1 (ali):
  email transient failure, retry in 1s
  email transient failure, retry in 2s
  email to ali: Hi Ali, order #81 shipped
n2 (bea):
  sms permanent failure, falling back
  email to bea: Hi Bea, order #82 shipped
n1 again:
  duplicate n1 ignored
```

### Interview answer
"Channels are a strategy interface returning ok, transient or permanent failure. The service renders a template, walks the user's preferred channels in order, retries transient errors with exponential backoff, falls back on permanent ones, and dedupes by notification ID because delivery through a queue is at-least-once. In production sends are asynchronous through a queue, with per-user rate limits and delivery tracking."

---

## 8. Design a parking lot (spots, pricing, tickets, concurrency)

**In one sentence:** vehicles **enter**, get a **ticket** and a **spot that fits** (motorcycle / car / truck), **exit** and **pay** by a **pricing strategy**, with several gates working **concurrently** without giving one spot to two cars.

### In plain words
A smart garage: the gate prints a ticket and tells you "level 2, spot 14". When you leave, it calculates the fee from your parking time.

### Clarify
- Levels, spot sizes, which vehicle fits where (motorcycle fits anywhere? car in large spots?). Pricing per hour, per vehicle type, daily cap. Multiple entry/exit gates. Display of free spots.

### Core design
| Class | Responsibility |
|---|---|
| `Vehicle` (plate, type), `Spot` (id, size, free) | value types / entities |
| `SpotAssignmentStrategy` | nearest free, smallest fitting, by level |
| `PricingStrategy` | hourly, flat, first hour free (see [Strategy](./Design-Patterns-in-Practice.md#11-strategy-for-configurable-behavior)) |
| `Ticket` | id, plate, spot, entry time |
| `ParkingLot` | `park(vehicle, now)`, `leave(ticket, now)`; owns spots; one mutex for allocation |

- **Smallest fitting spot first** keeps big spots for trucks.
- For speed: a free-list (set) per spot size instead of scanning all spots.
- Concurrency: allocation (find + mark) under one lock; per-level locks if it gets busy.

#### Modern C++ example — size-aware allocation, tickets, pricing and concurrent gates
```cpp
// g++ -std=c++20 -pthread main.cpp && ./a.out
#include <atomic>
#include <functional>
#include <iostream>
#include <map>
#include <mutex>
#include <optional>
#include <set>
#include <string>
#include <thread>
#include <vector>

enum class Size { Small = 0, Medium = 1, Large = 2 };           // motorcycle, car, truck
struct Ticket { int id; std::string plate; int spot; Size spot_size; int entered; };

class ParkingLot {
public:
    ParkingLot(std::map<Size, int> counts, std::function<long(int minutes)> pricing) : pricing_(std::move(pricing)) {
        int id = 0;
        for (auto [size, n] : counts) for (int i = 0; i < n; ++i) free_[size].insert(id++);
    }
    std::optional<Ticket> park(const std::string& plate, Size vehicle, int now) {
        std::scoped_lock l(m_);                                   // find + take = one atomic step
        for (int s = static_cast<int>(vehicle); s <= 2; ++s) {   // smallest spot that fits
            auto& pool = free_[static_cast<Size>(s)];
            if (pool.empty()) continue;
            int spot = *pool.begin();
            pool.erase(pool.begin());
            return Ticket{++next_ticket_, plate, spot, static_cast<Size>(s), now};
        }
        return std::nullopt;                                      // lot full for this vehicle
    }
    long leave(const Ticket& t, int now) {
        std::scoped_lock l(m_);
        free_[t.spot_size].insert(t.spot);
        return pricing_(now - t.entered);
    }
    int free_count() { std::scoped_lock l(m_); int n = 0; for (auto& [s, p] : free_) n += static_cast<int>(p.size()); return n; }
private:
    std::mutex m_;
    std::map<Size, std::set<int>> free_;
    std::function<long(int)> pricing_;
    int next_ticket_ = 0;
};

int main() {
    auto hourly_capped = [](int minutes) { return std::min<long>(((minutes + 59) / 60) * 15'00, 100'00); };
    ParkingLot lot({{Size::Small, 1}, {Size::Medium, 2}, {Size::Large, 1}}, hourly_capped);

    auto moto = lot.park("MOTO-1", Size::Small, 0);
    auto car1 = lot.park("CAR-1", Size::Medium, 0);
    auto truck = lot.park("TRUCK-1", Size::Large, 0);
    auto moto2 = lot.park("MOTO-2", Size::Small, 0);              // small full -> takes a medium spot
    auto car2 = lot.park("CAR-2", Size::Medium, 0);               // medium and large full -> rejected
    std::cout << "moto spot " << moto->spot << ", car spot " << car1->spot << ", truck spot " << truck->spot
              << ", moto2 spot " << moto2->spot << " (medium), car2: " << (car2 ? "parked" : "lot full") << '\n';
    std::cout << "car1 leaves after 130 min, pays " << lot.leave(*car1, 130) / 100 << " EGP\n";
    std::cout << "truck leaves after 1 day, pays " << lot.leave(*truck, 24 * 60) / 100 << " EGP (cap)\n";

    std::atomic<int> parked{0};                                   // 6 gates race for the 2 free spots
    {
        std::vector<std::jthread> gates;
        for (int g = 0; g < 6; ++g) gates.emplace_back([&, g] { if (lot.park("G" + std::to_string(g), Size::Medium, 200)) ++parked; });
    }
    std::cout << "concurrent gates parked " << parked << " cars, free spots left: " << lot.free_count() << '\n';
}
```

**Output:**
```text
moto spot 0, car spot 1, truck spot 3, moto2 spot 2 (medium), car2: lot full
car1 leaves after 130 min, pays 45 EGP
truck leaves after 1 day, pays 100 EGP (cap)
concurrent gates parked 2 cars, free spots left: 0
```

### Interview answer
"Spots have sizes and the lot keeps a free set per size, so assignment takes the smallest spot that fits in O(log n); a ticket records the spot and entry time, and exit returns the spot and asks a pricing strategy for the fee. Finding and taking a spot happen under one lock so concurrent gates can't double-assign; with many levels I'd lock per level. Assignment and pricing are strategies, so 'nearest to the elevator' or 'first hour free' are new classes."

---

## 9. Design a rate limiter (strategy interfaces, pluggable algorithms)

**In one sentence:** decide for each request whether a **client (key)** is **within its quota** (e.g. 100 requests/minute), with **pluggable algorithms** — token bucket, fixed window, sliding window log/counter — behind one interface.

### In plain words
A nightclub bouncer with a counter: each guest group may enter at most N times per hour. Different clubs count differently, but the bouncer's job — "yes or no" — is the same.

### Clarify
- Limit per user / IP / API key? Burst allowed? Exactness vs. memory? Single process or distributed (Redis)? What to return when limited (HTTP 429 + `Retry-After`)?

### Core design
| Algorithm | How | Pros | Cons |
|---|---|---|---|
| **Fixed window** | counter per (key, minute) | tiny memory | 2× burst at window edges |
| **Sliding window log** | timestamps of recent requests | exact | memory O(limit) per key |
| **Sliding window counter** | current + previous window, weighted | close to exact, small | approximation |
| **Token bucket** | tokens refill at rate r up to capacity b; each request takes one | allows bursts up to b, smooth average | two parameters to tune |
| **Leaky bucket** | queue drains at a fixed rate | smooth output | adds latency |

- `RateLimiter` interface: `bool allow(key, now)`; one class per algorithm (Strategy); a `Clock` injected.
- Per-key state in a map (+ cleanup of idle keys); a mutex (or per-key locks / atomics).
- Distributed: the same algorithms in Redis with Lua scripts or atomic `INCR` + `EXPIRE`.

#### Modern C++ example — three algorithms behind one interface, compared on the same burst
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <deque>
#include <iostream>
#include <map>
#include <memory>
#include <mutex>
#include <string>
#include <vector>

class RateLimiter {
public:
    virtual ~RateLimiter() = default;
    virtual bool allow(const std::string& key, double now_s) = 0;
    virtual std::string name() const = 0;
};

class FixedWindow : public RateLimiter {
public:
    FixedWindow(int limit, double window) : limit_(limit), window_(window) {}
    bool allow(const std::string& key, double now) override {
        std::scoped_lock l(m_);
        auto& [win, count] = state_[key];
        long w = static_cast<long>(now / window_);
        if (w != win) { win = w; count = 0; }
        return count < limit_ ? (++count, true) : false;
    }
    std::string name() const override { return "fixed window  "; }
private:
    int limit_; double window_; std::mutex m_; std::map<std::string, std::pair<long, int>> state_;
};

class SlidingLog : public RateLimiter {
public:
    SlidingLog(int limit, double window) : limit_(limit), window_(window) {}
    bool allow(const std::string& key, double now) override {
        std::scoped_lock l(m_);
        auto& log = logs_[key];
        while (!log.empty() && log.front() <= now - window_) log.pop_front();
        if (static_cast<int>(log.size()) >= limit_) return false;
        log.push_back(now); return true;
    }
    std::string name() const override { return "sliding log   "; }
private:
    int limit_; double window_; std::mutex m_; std::map<std::string, std::deque<double>> logs_;
};

class TokenBucket : public RateLimiter {
public:
    TokenBucket(double capacity, double per_second) : cap_(capacity), rate_(per_second) {}
    bool allow(const std::string& key, double now) override {
        std::scoped_lock l(m_);
        auto& [tokens, last] = state_.try_emplace(key, cap_, now).first->second;
        tokens = std::min(cap_, tokens + (now - last) * rate_);        // refill since last request
        last = now;
        return tokens >= 1 ? (tokens -= 1, true) : false;
    }
    std::string name() const override { return "token bucket  "; }
private:
    double cap_, rate_; std::mutex m_; std::map<std::string, std::pair<double, double>> state_;
};

int main() {
    // Limit: 5 requests per 10 s. Traffic: 5 requests at t=9.0..9.4 and 5 more at t=10.0..10.4.
    std::vector<double> times;
    for (int i = 0; i < 5; ++i) times.push_back(9.0 + i * 0.1);
    for (int i = 0; i < 5; ++i) times.push_back(10.0 + i * 0.1);
    std::vector<std::unique_ptr<RateLimiter>> limiters;
    limiters.push_back(std::make_unique<FixedWindow>(5, 10.0));
    limiters.push_back(std::make_unique<SlidingLog>(5, 10.0));
    limiters.push_back(std::make_unique<TokenBucket>(5, 0.5));      // burst 5, refill 0.5/s = 5 per 10 s
    for (auto& rl : limiters) {
        int ok = 0;
        std::string marks;
        for (double t : times) { bool a = rl->allow("user-1", t); ok += a; marks += a ? '+' : '-'; }
        std::cout << rl->name() << marks << "  allowed " << ok << " of 10 within ~1.4 s\n";
    }
}
```

**Output:**
```text
fixed window  ++++++++++  allowed 10 of 10 within ~1.4 s
sliding log   +++++-----  allowed 5 of 10 within ~1.4 s
token bucket  +++++-----  allowed 5 of 10 within ~1.4 s
```

The fixed window lets **10** requests through in 1.4 seconds because they straddle the boundary at t = 10 — the classic edge-burst problem.

### Interview answer
"I'd define a RateLimiter interface — allow(key, now) — and implement algorithms as strategies: fixed window is cheapest but allows double bursts at window edges, a sliding log is exact but stores timestamps, a sliding window counter approximates it cheaply, and a token bucket allows controlled bursts with a smooth average rate. State is per key behind a lock with idle-key cleanup; for many servers I'd move the same logic into Redis with atomic scripts, and reject with 429 and Retry-After."

---

## 10. Design a splitwise-style expense sharing system

**In one sentence:** users add **expenses** paid by one person and **split** among a group (**equally, exactly, or by percentage**); the system tracks **who owes whom** and can **simplify debts** into the fewest payments.

### In plain words
Four friends on a trip: Ali paid for dinner, Bea paid for the taxi. At the end, instead of everyone paying everyone, the app says "Chen pays Ali 150, Dina pays Bea 40" — done.

### Clarify
- Split types: equal, exact amounts, percentages, shares. Groups? Currency (single)? Rounding (who gets the leftover cent)? Settle-up payments? History.

### Core design
| Class | Responsibility |
|---|---|
| `Split` strategy | `EqualSplit`, `ExactSplit`, `PercentSplit` → map user → amount owed; validates (exact sums must equal the total, percentages must sum to 100) |
| `Expense` | payer, total, participants, split result |
| `Ledger` | **net balance** per user (+ is owed, − owes) |
| `DebtSimplifier` | greedy: match the biggest creditor with the biggest debtor → at most n − 1 payments |

- Store **integer cents**; give leftover cents to the first participants (deterministic rounding).
- Net balances always **sum to zero** — an invariant to assert.

#### Modern C++ example — split strategies, net balances and debt simplification
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <iostream>
#include <map>
#include <memory>
#include <numeric>
#include <queue>
#include <stdexcept>
#include <string>
#include <vector>

using Shares = std::map<std::string, long>;                    // user -> cents owed for this expense

class SplitStrategy { public: virtual ~SplitStrategy() = default; virtual Shares split(long total, const std::vector<std::string>& who) const = 0; };
class EqualSplit : public SplitStrategy {
public:
    Shares split(long total, const std::vector<std::string>& who) const override {
        Shares s;
        long base = total / static_cast<long>(who.size()), extra = total % static_cast<long>(who.size());
        for (std::size_t i = 0; i < who.size(); ++i) s[who[i]] = base + (static_cast<long>(i) < extra ? 1 : 0);   // leftover cents
        return s;
    }
};
class PercentSplit : public SplitStrategy {
public:
    explicit PercentSplit(std::vector<int> pct) : pct_(std::move(pct)) {
        if (std::accumulate(pct_.begin(), pct_.end(), 0) != 100) throw std::invalid_argument("percentages must sum to 100");
    }
    Shares split(long total, const std::vector<std::string>& who) const override {
        Shares s; long given = 0;
        for (std::size_t i = 0; i < who.size(); ++i) { s[who[i]] = total * pct_[i] / 100; given += s[who[i]]; }
        s[who[0]] += total - given;                             // rounding remainder
        return s;
    }
private:
    std::vector<int> pct_;
};

class Ledger {
public:
    void add_expense(const std::string& payer, long total, const std::vector<std::string>& who, const SplitStrategy& how) {
        Shares shares = how.split(total, who);
        balance_[payer] += total;                               // payer is owed the total...
        for (auto& [u, amount] : shares) balance_[u] -= amount; // ...minus everyone's share (incl. their own)
    }
    std::vector<std::string> settle() const {                   // greedy debt simplification
        using Entry = std::pair<long, std::string>;
        std::priority_queue<Entry> creditors, debtors;
        long sum = 0;
        for (auto& [u, b] : balance_) { sum += b; if (b > 0) creditors.push({b, u}); else if (b < 0) debtors.push({-b, u}); }
        if (sum != 0) throw std::logic_error("balances must sum to zero");
        std::vector<std::string> payments;
        while (!creditors.empty()) {
            auto [c, cu] = creditors.top(); creditors.pop();
            auto [d, du] = debtors.top(); debtors.pop();
            long x = std::min(c, d);
            payments.push_back(du + " pays " + cu + " " + std::to_string(x / 100) + "." + (x % 100 < 10 ? "0" : "") + std::to_string(x % 100));
            if (c > x) creditors.push({c - x, cu});
            if (d > x) debtors.push({d - x, du});
        }
        return payments;
    }
    long balance(const std::string& u) const { auto it = balance_.find(u); return it == balance_.end() ? 0 : it->second; }
private:
    std::map<std::string, long> balance_;
};

int main() {
    Ledger trip;
    std::vector<std::string> all{"ali", "bea", "chen", "dina"};
    trip.add_expense("ali", 1000'00, all, EqualSplit{});                          // dinner
    trip.add_expense("bea", 100'00, {"bea", "chen", "dina"}, EqualSplit{});       // taxi, 3 people
    trip.add_expense("chen", 400'00, {"ali", "chen"}, PercentSplit({25, 75}));    // hotel extra
    for (auto& u : all) std::cout << u << ": " << trip.balance(u) / 100.0 << '\n';
    std::cout << "settle up:\n";
    for (auto& p : trip.settle()) std::cout << "  " << p << '\n';
    try { PercentSplit bad({50, 40}); } catch (const std::exception& e) { std::cout << "rejected: " << e.what() << '\n'; }
}
```

**Output:**
```text
ali: 650
bea: -183.34
chen: -183.33
dina: -283.33
settle up:
  dina pays ali 283.33
  bea pays ali 183.34
  chen pays ali 183.33
rejected: percentages must sum to 100
```

The taxi (100 split 3 ways) doesn't divide evenly: Bea, first in the list, takes the leftover cent (33.34), so her balance is −183.34 and Chen's −183.33. Rounding rules must be explicit. Four people settle in three payments (n − 1).

### Interview answer
"Each expense uses a split strategy — equal, exact or percentage — that validates its input and returns integer-cent shares with a deterministic rule for leftover cents. The ledger keeps one net balance per user, which must always sum to zero. To settle up I greedily match the largest creditor with the largest debtor using two heaps, which needs at most n − 1 payments; truly minimal settlement is NP-hard, so greedy is the practical answer."

---

## 11. Design a vending machine (inventory, payment, state transitions)

**In one sentence:** a machine with **slots of products**, that accepts **coins/notes**, lets the user **select** a product, **dispenses** it with **change**, and refuses invalid actions depending on its **state** (idle, has money, dispensing, out of service).

### In plain words
Put money in, press B3, get a soda and your change. Press B3 without enough money and it asks for more; press "cancel" and you get your money back.

### Clarify
- Accepted denominations; can the machine run out of change (then refuse or only accept exact money)? Admin restock. One product per transaction?

### Core design
- **State pattern** (or `enum` + transitions): `Idle → HasMoney → (Dispense) → Idle`, plus `OutOfService`. See the [State pattern example](./Design-Patterns-in-Practice.md#10-state-pattern-for-workflow-transitions).
- `Inventory`: slot → product, price, count.
- `CoinBank`: coins inside the machine; **change making** with a greedy algorithm (works for canonical coin systems like 1/2/5/10) and a check that change is possible **before** dispensing.
- `cancel()` refunds the inserted coins.

#### Modern C++ example — inventory, coin bank with change-making, and guarded transitions
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <optional>
#include <string>

class CoinBank {
public:
    void add(int coin, int n = 1) { coins_[coin] += n; }
    std::optional<std::map<int, int>> make_change(int amount) const {   // greedy, largest coin first
        std::map<int, int> out;
        for (auto it = coins_.rbegin(); it != coins_.rend() && amount > 0; ++it) {
            int use = std::min(amount / it->first, it->second);
            if (use) { out[it->first] = use; amount -= use * it->first; }
        }
        if (amount != 0) return std::nullopt;
        return out;
    }
    void take(const std::map<int, int>& c) { for (auto [coin, n] : c) coins_[coin] -= n; }
private:
    std::map<int, int> coins_;                                 // denomination -> count
};

struct Slot { std::string product; int price; int count; };

class VendingMachine {
public:
    enum class State { Idle, HasMoney };
    void stock(const std::string& code, Slot s) { slots_[code] = std::move(s); }
    void load_change(int coin, int n) { bank_.add(coin, n); }
    void insert(int coin) {
        if (coin != 1 && coin != 5 && coin != 10) { std::cout << "rejected coin " << coin << '\n'; return; }
        inserted_ += coin; bank_.add(coin); state_ = State::HasMoney;
        std::cout << "balance " << inserted_ << '\n';
    }
    void select(const std::string& code) {
        if (state_ != State::HasMoney) { std::cout << "insert money first\n"; return; }
        auto it = slots_.find(code);
        if (it == slots_.end() || it->second.count == 0) { std::cout << code << " sold out\n"; return; }
        Slot& s = it->second;
        if (inserted_ < s.price) { std::cout << "need " << s.price - inserted_ << " more\n"; return; }
        auto change = bank_.make_change(inserted_ - s.price);
        if (!change) { std::cout << "cannot make change, please use exact money\n"; return; }   // check BEFORE dispensing
        bank_.take(*change);
        --s.count;
        std::cout << "dispensed " << s.product << ", change:";
        for (auto [coin, n] : *change) std::cout << ' ' << n << 'x' << coin;
        std::cout << '\n';
        inserted_ = 0; state_ = State::Idle;
    }
    void cancel() {
        if (state_ == State::Idle) return;
        auto refund = bank_.make_change(inserted_);
        bank_.take(*refund);
        std::cout << "refunded " << inserted_ << '\n';
        inserted_ = 0; state_ = State::Idle;
    }
private:
    std::map<std::string, Slot> slots_;
    CoinBank bank_;
    int inserted_ = 0;
    State state_ = State::Idle;
};

int main() {
    VendingMachine vm;
    vm.stock("A1", {"water", 7, 2});
    vm.stock("B3", {"soda", 12, 1});
    vm.load_change(1, 2);
    vm.select("A1");
    vm.insert(10); vm.select("B3");
    vm.insert(5); vm.select("B3");                             // 15 - 12 = 3, but only two 1s -> refuse
    vm.cancel();
    vm.insert(10); vm.insert(1); vm.insert(1); vm.select("B3");   // exact money
    vm.insert(10); vm.select("B3");
    vm.insert(3);
}
```

**Output:**
```text
insert money first
balance 10
need 2 more
balance 15
cannot make change, please use exact money
refunded 15
balance 10
balance 11
balance 12
dispensed soda, change:
balance 10
B3 sold out
rejected coin 3
```

### Interview answer
"The machine is a state machine — idle, has money, and out of service — where each state accepts only some actions. Inventory maps slots to product, price and count, and a coin bank holds the coins and computes change greedily, which works for canonical coin systems. The key detail is checking that change is possible before dispensing; otherwise ask for exact money or refund. Cancel refunds the inserted amount, and with many states I'd move to the State pattern."

---

## 12. Design an elevator system (scheduling, requests, states)

**In one sentence:** one or more elevators serve **hall calls** (floor + direction) and **car calls** (buttons inside), each elevator has a **state** (idle, moving up/down, doors open), and a **scheduler** decides which elevator takes a call and in what order floors are visited (**SCAN/LOOK**).

### In plain words
Like a bus going up a street then back down: it keeps going in one direction, stopping wherever someone wants to get on or off, and only turns around when nobody further ahead needs it.

### Clarify
- Number of elevators and floors; capacity; hall call buttons up/down; priorities (fire mode, VIP)? Goal: minimize wait time or travel? Simulation in discrete time steps is fine for an interview.

### Core design
| Class | Responsibility |
|---|---|
| `Request` | floor, direction (hall) or target (car) |
| `Elevator` | current floor, direction, state, `std::set<int>` stops up / down; `step()` moves one floor |
| `Dispatcher` (strategy) | picks an elevator for a hall call: nearest one **moving toward** the floor in the same direction, else nearest idle |
| `ElevatorSystem` | receives requests, calls the dispatcher, ticks all elevators |

- **LOOK** algorithm: serve all stops in the current direction (sorted set), reverse only when no stops remain ahead — avoids starvation and zig-zagging (the same idea as disk scheduling).
- States: `Idle`, `MovingUp`, `MovingDown`, `DoorsOpen`, `Maintenance`.

#### Modern C++ example — LOOK scheduling with two elevators and a dispatcher
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <climits>
#include <cstdlib>
#include <iostream>
#include <set>
#include <string>
#include <vector>

enum class Dir { Idle, Up, Down };

class Elevator {
public:
    Elevator(std::string name, int floor) : name(std::move(name)), floor(floor) {}
    void add_stop(int f) { if (f != floor) stops.insert(f); else log_.push_back(floor); }
    void step() {                                                    // one time unit
        if (stops.empty()) { dir = Dir::Idle; return; }
        if (dir == Dir::Idle) dir = *stops.begin() > floor ? Dir::Up : Dir::Down;
        bool ahead = dir == Dir::Up ? stops.upper_bound(floor) != stops.end() : stops.lower_bound(floor) != stops.begin();
        if (!ahead) dir = dir == Dir::Up ? Dir::Down : Dir::Up;      // LOOK: reverse only when nothing ahead
        floor += dir == Dir::Up ? 1 : -1;
        if (stops.erase(floor)) log_.push_back(floor);              // stop: doors open
    }
    int cost(int f, Dir d) const {                                   // dispatcher heuristic
        int dist = std::abs(floor - f);
        if (dir == Dir::Idle) return dist;
        bool on_the_way = (dir == Dir::Up && d == Dir::Up && f >= floor) || (dir == Dir::Down && d == Dir::Down && f <= floor);
        return on_the_way ? dist : dist + 20;                       // penalty: must finish its sweep first
    }
    std::string name;
    int floor;
    Dir dir = Dir::Idle;
    std::set<int> stops;
    const std::vector<int>& log() const { return log_; }
private:
    std::vector<int> log_;
};

class ElevatorSystem {
public:
    void add(Elevator e) { cars_.push_back(std::move(e)); }
    void hall_call(int floor, Dir d) {
        Elevator* best = nullptr; int best_cost = INT_MAX;
        for (auto& e : cars_) if (int c = e.cost(floor, d); c < best_cost) { best_cost = c; best = &e; }
        best->add_stop(floor);
        std::cout << "hall call floor " << floor << (d == Dir::Up ? " up" : " down") << " -> " << best->name << '\n';
    }
    void car_call(const std::string& car, int floor) { for (auto& e : cars_) if (e.name == car) e.add_stop(floor); }
    void tick(int n) { for (int i = 0; i < n; ++i) for (auto& e : cars_) e.step(); }
    void report() const {
        for (auto& e : cars_) {
            std::cout << e.name << " at floor " << e.floor << ", stopped at:";
            for (int f : e.log()) std::cout << ' ' << f;
            std::cout << '\n';
        }
    }
private:
    std::vector<Elevator> cars_;
};

int main() {
    ElevatorSystem sys;
    sys.add(Elevator("E1", 0));
    sys.add(Elevator("E2", 10));
    sys.hall_call(3, Dir::Up);              // E1 is closer
    sys.car_call("E1", 8);                  // rider at 3 presses 8 (simplified: known upfront)
    sys.tick(2);                            // E1 now moving up at floor 2
    sys.hall_call(5, Dir::Up);              // on E1's way up
    sys.hall_call(9, Dir::Down);            // E2 (idle at 10) is nearer
    sys.car_call("E1", 1);                  // someone in E1 wants floor 1: served after the up sweep
    sys.tick(15);
    sys.report();
}
```

**Output:**
```text
hall call floor 3 up -> E1
hall call floor 5 up -> E1
hall call floor 9 down -> E2
E1 at floor 1, stopped at: 3 5 8 1
E2 at floor 9, stopped at: 9
```

### Interview answer
"Each elevator holds its floor, direction and a sorted set of stops, and moves with LOOK: keep serving stops in the current direction and reverse only when nothing is ahead, which avoids starvation. A dispatcher strategy assigns hall calls to the elevator with the lowest cost — one already moving toward the floor in the same direction, otherwise the nearest idle one — and car calls go straight to that car. States like doors open or maintenance gate what an elevator accepts, and the dispatcher is pluggable for peak-hour policies."

---

## Cheat sheet

| Problem | Classes | Key decision / trap |
|---|---|---|
| LRU / LFU | map + list / freq buckets | O(1) both; LFU tie-break by recency |
| Chess / tic-tac-toe | Board, Piece, Player, Game, WinChecker | O(1) tic-tac-toe win counters; per-piece move rules |
| File system | Node, File, Directory (composite) | path parsing; `mkdir -p`; file vs. directory errors |
| Library | Title, Copy, Member, Loan, queue, FinePolicy | hold returned copy for first in line |
| Logging | Logger, Appender, Formatter, async dispatcher | level filter first; drain on shutdown |
| Movie booking | Show, Seat, Hold, BookingService | all-or-nothing hold + expiry; DB unique (show, seat) |
| Notifications | Channel, Template, Preferences, RetryPolicy | transient retry vs. permanent fallback; dedupe IDs |
| Parking lot | Spot, Ticket, assignment + pricing strategies | smallest fitting spot; allocate under one lock |
| Rate limiter | RateLimiter strategies | fixed-window edge burst; token bucket for bursts |
| Splitwise | SplitStrategy, Ledger, simplifier | integer cents + rounding; balances sum to zero; greedy ≤ n − 1 payments |
| Vending machine | Inventory, CoinBank, states | check change **before** dispensing |
| Elevator | Elevator, Dispatcher, Request | LOOK scheduling; cost = on-the-way vs. idle |
