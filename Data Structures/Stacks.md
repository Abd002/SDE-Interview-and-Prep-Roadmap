# Stacks — Implementations, Applications and Priority Stacks

> **What you'll learn:** what a stack is, how to build one on an **array** and on a **linked list**, the classic **applications** (expression evaluation, bracket matching, undo, backtracking, monotonic stacks), and what a **priority stack** is. Each part has a runnable C++ example.
>
> **Prerequisites:** [Arrays](./Arrays.md) and [Linked Lists](./LinkedList.md).

## Table of Contents
1. [What is a stack?](#0-what-is-a-stack)
2. [Implementations using arrays and linked lists](#1-implementations-using-arrays-and-linked-lists)
   - [Array-based stack](#11-array-based-stack)
   - [Linked list-based stack](#12-linked-list-based-stack)
3. [Applications (e.g., expression evaluation, backtracking)](#2-applications-eg-expression-evaluation-backtracking)
4. [Priority stacks](#3-priority-stacks)
5. [Cheat sheet](#cheat-sheet)

---

## 0. What is a stack?

**In one sentence:** a stack is a collection where the **last item you put in is the first one you take out** (LIFO: Last In, First Out).

### In plain words
A pile of plates. You put a clean plate **on top**, and you take a plate **from the top**. You never pull one from the middle.

### How it works
| Operation | What it does | Cost |
|---|---|---|
| `push(x)` | put `x` on top | O(1) (amortized O(1) for a growing array) |
| `pop()` | remove the top item | O(1) |
| `top()` / `peek()` | read the top item without removing it | O(1) |
| `empty()` / `size()` | check how many items there are | O(1) |

There is no search and no access by index. That limit is the point: it makes every operation O(1) and the code easy to reason about.

In C++ you normally use `std::stack<T>`, an **adapter** that wraps a container (`std::deque<T>` by default; `std::vector<T>` also works).

---

## 1. Implementations using arrays and linked lists

**In one sentence:** a stack can sit on a **growing array** (top = last element) or on a **singly linked list** (top = head node); both give O(1) push and pop.

### 1.1 Array-based stack

#### In plain words
Keep the items in an array and remember how many there are. The top is the last used slot. When the array is full, get a bigger one (usually twice the size) and copy the items over.

#### How it works
- `push`: write at index `size`, then `size++`. If `size == capacity`, grow first.
- `pop`: `size--`. The old value is simply ignored (or destroyed).
- Growth by **doubling** means copying happens rarely, so the average (amortized) cost of `push` is still O(1).
- **Pros:** items sit next to each other in memory, so it is cache-friendly and fast. **Cons:** an occasional O(n) copy when it grows, and wasted space if it stays half empty.

#### Modern C++ example — array-based stack
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <memory>
#include <stdexcept>

template <typename T>
class ArrayStack {
public:
    void push(const T& value) {
        if (size_ == capacity_) grow();
        data_[size_++] = value;
    }
    void pop() {
        if (empty()) throw std::out_of_range("pop on empty stack");
        --size_;
    }
    const T& top() const {
        if (empty()) throw std::out_of_range("top on empty stack");
        return data_[size_ - 1];
    }
    bool empty() const { return size_ == 0; }
    std::size_t size() const { return size_; }
    std::size_t capacity() const { return capacity_; }

private:
    void grow() {
        std::size_t new_cap = capacity_ == 0 ? 1 : capacity_ * 2;
        auto bigger = std::make_unique<T[]>(new_cap);
        for (std::size_t i = 0; i < size_; ++i) bigger[i] = std::move(data_[i]);
        data_ = std::move(bigger);
        capacity_ = new_cap;
    }
    std::unique_ptr<T[]> data_;
    std::size_t size_ = 0, capacity_ = 0;
};

int main() {
    ArrayStack<int> s;
    for (int i = 1; i <= 5; ++i) {
        s.push(i * 10);
        std::cout << "push " << i * 10 << "  size=" << s.size() << " capacity=" << s.capacity() << '\n';
    }
    while (!s.empty()) { std::cout << "pop " << s.top() << '\n'; s.pop(); }
    try { s.pop(); } catch (const std::out_of_range& e) { std::cout << "error: " << e.what() << '\n'; }
}
```

**Output:**
```text
push 10  size=1 capacity=1
push 20  size=2 capacity=2
push 30  size=3 capacity=4
push 40  size=4 capacity=4
push 50  size=5 capacity=8
pop 50
pop 40
pop 30
pop 20
pop 10
error: pop on empty stack
```

### 1.2 Linked list-based stack

#### In plain words
Each item is a node that points to the item below it. The stack only remembers the top node. To push, make a new node that points to the old top. To pop, move the top to the next node down.

#### How it works
- `push`: `new_node->next = head; head = new_node;` — O(1), never copies.
- `pop`: `head = head->next;` — O(1).
- **Pros:** no big copy when it grows; it only uses the memory it needs. **Cons:** one heap allocation per push, an extra pointer per item, and nodes scattered in memory (slower in practice).
- With `std::unique_ptr` links, destroying the stack frees everything. A very long list freed recursively can overflow the call stack, so the destructor below frees nodes in a loop.

#### Modern C++ example — linked list-based stack
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <memory>
#include <stdexcept>
#include <string>

template <typename T>
class ListStack {
    struct Node {
        T value;
        std::unique_ptr<Node> next;
    };
public:
    ~ListStack() { while (head_) head_ = std::move(head_->next); }   // iterative, no deep recursion
    void push(T value) {
        head_ = std::make_unique<Node>(Node{std::move(value), std::move(head_)});
        ++size_;
    }
    void pop() {
        if (!head_) throw std::out_of_range("pop on empty stack");
        head_ = std::move(head_->next);
        --size_;
    }
    const T& top() const {
        if (!head_) throw std::out_of_range("top on empty stack");
        return head_->value;
    }
    bool empty() const { return !head_; }
    std::size_t size() const { return size_; }

private:
    std::unique_ptr<Node> head_;
    std::size_t size_ = 0;
};

int main() {
    ListStack<std::string> history;          // browser "back" history
    for (const char* page : {"home", "search", "product", "cart"}) history.push(page);
    std::cout << "current page: " << history.top() << " (" << history.size() << " pages)\n";
    history.pop();
    std::cout << "after Back:   " << history.top() << '\n';
    history.pop();
    std::cout << "after Back:   " << history.top() << '\n';

    ListStack<int> big;
    for (int i = 0; i < 1'000'000; ++i) big.push(i);
    std::cout << "pushed " << big.size() << " ints; top = " << big.top() << '\n';
}   // the destructor frees a million nodes without recursion
```

**Output:**
```text
current page: cart (4 pages)
after Back:   product
after Back:   search
pushed 1000000 ints; top = 999999
```

### Array vs. linked list — which one?
| | Array-based | Linked list-based |
|---|---|---|
| push / pop | amortized O(1) | O(1) always |
| Memory | contiguous, may have spare capacity | one node + one pointer per item |
| Speed in practice | faster (cache-friendly, few allocations) | slower (an allocation per push) |
| Good when | almost always — default choice | you need strict O(1) with no copy spikes, or nodes already exist |

### Interview answer
"A stack is LIFO with O(1) push, pop and top. On an array, the top is the last element and the array doubles when full, so push is amortized O(1) and it's cache-friendly. On a singly linked list, the top is the head node, so every operation is O(1) with no copying, but there's an allocation and a pointer per element. In practice I'd use `std::stack` over `std::vector` or `std::deque`."

---

## 2. Applications (e.g., expression evaluation, backtracking)

**In one sentence:** use a stack whenever the **most recent unfinished thing** must be handled first — nested brackets, function calls, undo, and going back after a dead end.

### In plain words
A stack remembers "where I was" in the right order. When you open a bracket, you push it; when you close one, the most recent open bracket must match. When you walk into a maze and hit a dead end, you step back to the **last** junction you passed.

### How it works
| Application | What goes on the stack |
|---|---|
| **Balanced brackets** | each opening bracket; a closing bracket must match the top |
| **Expression evaluation** (shunting-yard by Dijkstra, then postfix evaluation) | operators waiting for their operands; then numbers |
| **Function calls** (the call stack) | return address, parameters and local variables of each active call |
| **Undo / redo, browser Back** | each previous state or action |
| **Backtracking / iterative DFS** | the path or the nodes still to explore |
| **Monotonic stack** (next greater element, largest rectangle in histogram) | indexes whose answer is not known yet |

**Expression evaluation in two steps**
1. **Infix → postfix** (shunting-yard): read tokens left to right. Numbers go straight to the output. An operator first pops operators with **higher or equal** precedence (for left-associative operators) to the output, then is pushed. `(` is pushed; `)` pops until the matching `(`.
2. **Evaluate postfix:** push numbers; on an operator, pop two numbers, apply it, push the result.

`3 + 4 * 2 - ( 1 + 1 )` → postfix `3 4 2 * + 1 1 + -` → `9`.

#### Modern C++ example — brackets, expression evaluation, backtracking and a monotonic stack
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <cctype>
#include <iostream>
#include <map>
#include <stack>
#include <string>
#include <vector>

bool balanced(const std::string& s) {
    std::stack<char> open;
    const std::map<char, char> match{{')', '('}, {']', '['}, {'}', '{'}};
    for (char c : s) {
        if (c == '(' || c == '[' || c == '{') open.push(c);
        else if (match.contains(c)) {
            if (open.empty() || open.top() != match.at(c)) return false;
            open.pop();
        }
    }
    return open.empty();
}

// Shunting-yard: infix with + - * / and parentheses -> postfix tokens.
std::vector<std::string> to_postfix(const std::string& expr) {
    auto prec = [](char op) { return (op == '*' || op == '/') ? 2 : 1; };
    std::vector<std::string> out;
    std::stack<char> ops;
    for (std::size_t i = 0; i < expr.size(); ++i) {
        char c = expr[i];
        if (std::isspace(static_cast<unsigned char>(c))) continue;
        if (std::isdigit(static_cast<unsigned char>(c))) {
            std::string num;
            while (i < expr.size() && std::isdigit(static_cast<unsigned char>(expr[i]))) num += expr[i++];
            --i;
            out.push_back(num);
        } else if (c == '(') {
            ops.push(c);
        } else if (c == ')') {
            while (ops.top() != '(') { out.push_back(std::string(1, ops.top())); ops.pop(); }
            ops.pop();                                            // drop '('
        } else {                                                  // + - * /
            while (!ops.empty() && ops.top() != '(' && prec(ops.top()) >= prec(c)) {
                out.push_back(std::string(1, ops.top())); ops.pop();
            }
            ops.push(c);
        }
    }
    while (!ops.empty()) { out.push_back(std::string(1, ops.top())); ops.pop(); }
    return out;
}

long eval_postfix(const std::vector<std::string>& tokens) {
    std::stack<long> st;
    for (const auto& t : tokens) {
        if (std::isdigit(static_cast<unsigned char>(t[0]))) { st.push(std::stol(t)); continue; }
        long b = st.top(); st.pop();
        long a = st.top(); st.pop();
        switch (t[0]) {
            case '+': st.push(a + b); break;
            case '-': st.push(a - b); break;
            case '*': st.push(a * b); break;
            case '/': st.push(a / b); break;
        }
    }
    return st.top();
}

// Backtracking with an explicit stack: find a path through a grid maze ('#' = wall).
std::vector<std::pair<int, int>> solve_maze(const std::vector<std::string>& g) {
    int rows = static_cast<int>(g.size()), cols = static_cast<int>(g[0].size());
    std::vector<std::vector<bool>> seen(rows, std::vector<bool>(cols));
    std::vector<std::pair<int, int>> path{{0, 0}};                 // the stack IS the current path
    seen[0][0] = true;
    const int dr[] = {0, 1, 0, -1}, dc[] = {1, 0, -1, 0};
    while (!path.empty()) {
        auto [r, c] = path.back();
        if (r == rows - 1 && c == cols - 1) return path;
        bool moved = false;
        for (int d = 0; d < 4 && !moved; ++d) {
            int nr = r + dr[d], nc = c + dc[d];
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && g[nr][nc] == '.' && !seen[nr][nc]) {
                seen[nr][nc] = true;
                path.push_back({nr, nc});                          // go deeper
                moved = true;
            }
        }
        if (!moved) path.pop_back();                               // dead end: backtrack
    }
    return {};
}

// Monotonic stack: for each day, how many days until a warmer temperature?
std::vector<int> days_until_warmer(const std::vector<int>& t) {
    std::vector<int> ans(t.size(), 0);
    std::stack<std::size_t> waiting;                               // indexes, temperatures decreasing
    for (std::size_t i = 0; i < t.size(); ++i) {
        while (!waiting.empty() && t[waiting.top()] < t[i]) {
            ans[waiting.top()] = static_cast<int>(i - waiting.top());
            waiting.pop();
        }
        waiting.push(i);
    }
    return ans;
}

int main() {
    for (const std::string s : {"{[()()]}", "([)]", "(("})
        std::cout << s << " balanced? " << std::boolalpha << balanced(s) << '\n';

    std::string expr = "3 + 4 * 2 - (1 + 1)";
    auto post = to_postfix(expr);
    std::cout << "postfix:";
    for (const auto& t : post) std::cout << ' ' << t;
    std::cout << "\n" << expr << " = " << eval_postfix(post) << '\n';

    std::vector<std::string> maze{
        "..#.",
        "#...",
        "..#.",
        ".#..",
    };
    std::cout << "maze path:";
    for (auto [r, c] : solve_maze(maze)) std::cout << " (" << r << ',' << c << ')';
    std::cout << '\n';

    std::cout << "days until warmer:";
    for (int d : days_until_warmer({73, 74, 75, 71, 69, 72, 76, 73})) std::cout << ' ' << d;
    std::cout << '\n';
}
```

**Output:**
```text
{[()()]} balanced? true
([)] balanced? false
(( balanced? false
postfix: 3 4 2 * + 1 1 + -
3 + 4 * 2 - (1 + 1) = 9
maze path: (0,0) (0,1) (1,1) (1,2) (1,3) (2,3) (3,3)
days until warmer: 1 1 4 2 1 1 0 0
```

### Interview answer
"I reach for a stack when the most recent open item must be closed first. Bracket matching pushes openers and checks each closer against the top. Expression evaluation uses shunting-yard to turn infix into postfix with an operator stack, then evaluates postfix with a value stack. Backtracking keeps the current path on a stack and pops on a dead end — that's iterative DFS. And a monotonic stack answers 'next greater element' questions in O(n), because each index is pushed and popped once."

---

## 3. Priority stacks

**In one sentence:** a priority stack pops the item with the **highest priority** first, and among items with the **same** priority it pops the **most recently pushed** one (LIFO tie-break).

### In plain words
An inbox where urgent letters always come out first, but among letters with the same urgency you read the newest one first. A normal stack is a priority stack where every item has the same priority.

### How it works
- It is a **priority queue** with a LIFO tie-break. A normal priority queue (heap) does not promise any order for equal priorities.
- Implementation: store `(priority, sequence_number, value)` in a max-heap, where `sequence_number` grows with every push. Compare by priority first, then by sequence number (bigger = newer = first). `push` and `pop` are O(log n).
- A related interview question is the **min-stack / max-stack**: a normal stack that also answers "what is the current minimum (or maximum)?" in O(1). Keep a second stack where each entry is the min so far.
- Where it shows up: schedulers that run the newest task first within a priority level, and undo systems with "important" actions.

#### Modern C++ example — priority stack and a min-stack
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <iostream>
#include <queue>
#include <stack>
#include <string>
#include <tuple>
#include <vector>

class PriorityStack {
    using Entry = std::tuple<int, long, std::string>;              // priority, sequence, value
public:
    void push(std::string value, int priority) { heap_.emplace(priority, seq_++, std::move(value)); }
    std::string pop() {
        std::string v = std::get<2>(heap_.top());
        heap_.pop();
        return v;
    }
    bool empty() const { return heap_.empty(); }
private:
    std::priority_queue<Entry> heap_;   // max-heap: higher priority first, then higher (newer) sequence
    long seq_ = 0;
};

class MinStack {
public:
    void push(int x) {
        values_.push(x);
        mins_.push(mins_.empty() ? x : std::min(x, mins_.top()));
    }
    void pop() { values_.pop(); mins_.pop(); }
    int top() const { return values_.top(); }
    int min() const { return mins_.top(); }                        // O(1)
private:
    std::stack<int> values_, mins_;
};

int main() {
    PriorityStack tasks;
    tasks.push("write report", 1);
    tasks.push("fix prod bug", 3);
    tasks.push("reply to email", 1);
    tasks.push("security patch", 3);
    tasks.push("lunch", 2);
    while (!tasks.empty()) std::cout << tasks.pop() << '\n';

    MinStack ms;
    for (int x : {5, 3, 7, 2, 8}) { ms.push(x); std::cout << "push " << x << " -> min " << ms.min() << '\n'; }
    ms.pop(); ms.pop();
    std::cout << "after two pops: top " << ms.top() << ", min " << ms.min() << '\n';
}
```

**Output:**
```text
security patch
fix prod bug
lunch
reply to email
write report
push 5 -> min 5
push 3 -> min 3
push 7 -> min 3
push 2 -> min 2
push 8 -> min 2
after two pops: top 7, min 3
```

### Interview answer
"A priority stack is a priority queue that breaks ties LIFO. I store a sequence number with each item and use a heap ordered by (priority, sequence), so push and pop are O(log n). If the interviewer means a min-stack, I keep a second stack of running minimums, so push, pop and min are all O(1)."

---

## Cheat sheet

| Topic | Remember |
|---|---|
| Stack | LIFO; push, pop, top are O(1); no search, no indexing |
| Array-based | top = last element; doubling gives amortized O(1); cache-friendly; default choice |
| Linked list-based | top = head; O(1) always; one allocation and pointer per item |
| `std::stack` | adapter over `std::deque` (default) or `std::vector` |
| Brackets | push openers; a closer must match the top; stack empty at the end |
| Expressions | shunting-yard (infix → postfix), then evaluate postfix with a value stack |
| Backtracking | the stack is the current path; pop on a dead end (iterative DFS) |
| Monotonic stack | "next greater/smaller element" in O(n); each index pushed and popped once |
| Priority stack | heap on (priority, sequence) → highest priority first, newest first on ties; O(log n) |
| Min-stack | second stack of running minimums → O(1) `min()` |
| Call stack | each call pushes a frame; too-deep recursion → stack overflow |
