# Trees — Binary Trees, BSTs, Balanced Trees, Heaps, B-Trees, Tries and Radix Trees

> **What you'll learn:** the vocabulary of trees, the **binary tree** shapes (full, complete, perfect), **binary search trees** and why they need **balancing**, the self-balancing family (**AVL**, **red-black**, **splay**, **scapegoat**, **tango**), **heaps**, **B-trees** (what databases use), and the string trees (**trie** and **radix tree**). Each part has a runnable C++ example.
>
> **Prerequisites:** [Linked Lists](./LinkedList.md), [Queues](./Queues.md) and [Recursion](../Programming%20Languages%20and%20Concepts/Recursion.md).

## Table of Contents
0. [Tree vocabulary](#0-tree-vocabulary)
1. [Binary Trees](#1-binary-trees) — [full](#11-full-binary-tree), [complete](#12-complete-binary-tree), [perfect](#13-perfect-binary-tree)
2. [Binary Search Trees (BST)](#2-binary-search-trees-bst)
3. [Self-balancing BST](#3-self-balancing-bst) — [scapegoat tree](#31-scapegoat-tree), [tango tree](#32-tango-tree)
4. [AVL Trees](#4-avl-trees)
5. [Red-Black Trees](#5-red-black-trees)
6. [Heap Trees (min-heap, max-heap)](#6-heap-trees-min-heap-max-heap)
7. [B-Trees](#7-b-trees)
8. [Splay Trees](#8-splay-trees)
9. [Trie](#9-trie)
10. [Radix Trees](#10-radix-trees)
11. [Cheat sheet](#cheat-sheet)

---

## 0. Tree vocabulary

**In one sentence:** a tree is a set of **nodes** connected by edges, with one **root** at the top, where every other node has exactly **one parent** and there are no cycles.

### In plain words
A family tree drawn upside down, or the folders on your computer: one top folder, each folder inside exactly one parent folder.

| Word | Meaning |
|---|---|
| **Root** | the top node (no parent) |
| **Parent / child** | a node directly above / below another |
| **Leaf** | a node with no children |
| **Internal node** | a node with at least one child |
| **Depth** of a node | number of edges from the root to it (root depth = 0) |
| **Height** of a tree | the largest depth of any leaf (one node → 0; empty → −1 by convention) |
| **Subtree** | a node plus everything below it |
| **Binary tree** | each node has **at most 2** children: left and right |

A tree with n nodes has exactly **n − 1 edges**.

---

## 1. Binary Trees

**In one sentence:** a binary tree is a tree where each node has at most a **left** and a **right** child, and you visit it with **preorder, inorder, postorder** (depth-first) or **level-order** (breadth-first) traversal.

### In plain words
Every node is a fork in a road with at most two branches. You can walk it by always going deep first (DFS), or floor by floor (BFS).

### How it works
| Traversal | Order | Typical use |
|---|---|---|
| **Preorder** | node, left, right | copy / serialize a tree |
| **Inorder** | left, node, right | a BST in **sorted** order |
| **Postorder** | left, right, node | delete a tree, evaluate an expression tree |
| **Level-order** | level by level with a [queue](./Queues.md) | shortest depth, "print by level" |

Recursion depth equals the tree height, so a very tall (unbalanced) tree can overflow the call stack; use an explicit stack in that case.

### 1.1 Full binary tree
Every node has **0 or 2** children — never exactly one. In a full binary tree, **leaves = internal nodes + 1**. Expression trees (`(3+4)*2`) and Huffman trees are full.

### 1.2 Complete binary tree
Every level is completely filled **except possibly the last**, and the last level is filled **from the left**. This shape fits in an **array with no gaps**: the children of index `i` are `2i+1` and `2i+2`, the parent is `(i−1)/2`. That is why **heaps** are complete trees. Height is ⌊log₂ n⌋.

### 1.3 Perfect binary tree
Every internal node has 2 children **and** all leaves are at the **same depth**. A perfect tree of height h has **2^(h+1) − 1** nodes and **2^h** leaves. Every perfect tree is both full and complete.

```text
   Full, not complete     Complete, not full     Perfect
          1                      1                   1
         / \                    / \                 / \
        2   3                  2   3               2   3
           / \                /                   / \ / \
          4   5              4                   4  5 6  7
```

#### Modern C++ example — traversals and shape checks
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <memory>
#include <queue>
#include <vector>

struct Node {
    int val;
    std::unique_ptr<Node> left, right;
    explicit Node(int v) : val(v) {}
};

void preorder(const Node* n)  { if (!n) return; std::cout << n->val << ' '; preorder(n->left.get()); preorder(n->right.get()); }
void inorder(const Node* n)   { if (!n) return; inorder(n->left.get()); std::cout << n->val << ' '; inorder(n->right.get()); }
void postorder(const Node* n) { if (!n) return; postorder(n->left.get()); postorder(n->right.get()); std::cout << n->val << ' '; }

void level_order(const Node* root) {
    std::queue<const Node*> q;
    if (root) q.push(root);
    while (!q.empty()) {
        auto level = q.size();
        std::cout << "[";
        while (level--) {
            const Node* n = q.front(); q.pop();
            std::cout << ' ' << n->val;
            if (n->left) q.push(n->left.get());
            if (n->right) q.push(n->right.get());
        }
        std::cout << " ] ";
    }
}

int height(const Node* n) { return n ? 1 + std::max(height(n->left.get()), height(n->right.get())) : -1; }
int count(const Node* n) { return n ? 1 + count(n->left.get()) + count(n->right.get()) : 0; }

bool is_full(const Node* n) {
    if (!n) return true;
    if (!n->left != !n->right) return false;            // exactly one child
    return is_full(n->left.get()) && is_full(n->right.get());
}

bool is_complete(const Node* root) {                     // BFS: after the first gap, no more nodes
    std::queue<const Node*> q;
    q.push(root);
    bool gap = false;
    while (!q.empty()) {
        const Node* n = q.front(); q.pop();
        if (!n) { gap = true; continue; }
        if (gap) return false;
        q.push(n->left.get());
        q.push(n->right.get());
    }
    return true;
}

bool is_perfect(const Node* n) { return count(n) == (1 << (height(n) + 1)) - 1; }

int main() {
    // Tree used below (level by level): 1 | 2 3 | 4 5 6
    auto root = std::make_unique<Node>(1);
    root->left = std::make_unique<Node>(2);
    root->right = std::make_unique<Node>(3);
    root->left->left = std::make_unique<Node>(4);
    root->left->right = std::make_unique<Node>(5);
    root->right->left = std::make_unique<Node>(6);

    std::cout << "preorder:    "; preorder(root.get()); std::cout << '\n';
    std::cout << "inorder:     "; inorder(root.get()); std::cout << '\n';
    std::cout << "postorder:   "; postorder(root.get()); std::cout << '\n';
    std::cout << "level-order: "; level_order(root.get()); std::cout << '\n';
    std::cout << "height=" << height(root.get()) << " nodes=" << count(root.get()) << '\n';
    std::cout << std::boolalpha << "full=" << is_full(root.get()) << " complete=" << is_complete(root.get())
              << " perfect=" << is_perfect(root.get()) << '\n';

    root->right->right = std::make_unique<Node>(7);      // now every level is filled
    std::cout << "after adding 7: full=" << is_full(root.get()) << " complete=" << is_complete(root.get())
              << " perfect=" << is_perfect(root.get()) << '\n';
}
```

**Output:**
```text
preorder:    1 2 4 5 3 6 
inorder:     4 2 5 1 6 3 
postorder:   4 5 2 6 3 1 
level-order: [ 1 ] [ 2 3 ] [ 4 5 6 ] 
height=2 nodes=6
full=false complete=true perfect=false
after adding 7: full=true complete=true perfect=true
```

### Interview answer
"A binary tree node has at most two children. Full means every node has zero or two children; complete means all levels are filled except the last, which fills from the left — that's what lets a heap live in an array; perfect means all internal nodes have two children and all leaves are at the same depth, so it has 2^(h+1)−1 nodes. I traverse with preorder, inorder and postorder recursively, or level-order with a queue."

---

## 2. Binary Search Trees (BST)

**In one sentence:** a BST is a binary tree where, for every node, **everything in the left subtree is smaller** and **everything in the right subtree is larger**, so search, insert and delete follow one path from the root.

### In plain words
Guessing a number between 1 and 100: "Is it bigger than 50?" Each answer throws away half of what's left. A BST stores that game: at each node you go left if smaller, right if larger.

### How it works
- **Search / insert:** compare with the node, go left or right, repeat. Cost = O(height).
- **Delete** has three cases: a leaf (just remove it), one child (replace the node with the child), two children (copy the **inorder successor** — the smallest node in the right subtree — into it, then delete the successor).
- **Inorder traversal** gives the keys in **sorted order**.
- **The catch:** height depends on insert order. Random inserts give height ≈ O(log n), but inserting sorted data (1, 2, 3, …) builds a **linked list** of height n − 1, so every operation becomes O(n). That's why we need **self-balancing** trees.
- `std::set` / `std::map` are BSTs (red-black trees in all major standard libraries).

#### Modern C++ example — BST insert, search, delete, and the sorted-input problem
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <memory>

struct Node {
    int key;
    std::unique_ptr<Node> left, right;
    explicit Node(int k) : key(k) {}
};

void insert(std::unique_ptr<Node>& n, int key) {
    if (!n) { n = std::make_unique<Node>(key); return; }
    if (key < n->key) insert(n->left, key);
    else if (key > n->key) insert(n->right, key);     // duplicates ignored
}

bool contains(const Node* n, int key) {
    while (n) {
        if (key == n->key) return true;
        n = key < n->key ? n->left.get() : n->right.get();
    }
    return false;
}

void erase(std::unique_ptr<Node>& n, int key) {
    if (!n) return;
    if (key < n->key) { erase(n->left, key); return; }
    if (key > n->key) { erase(n->right, key); return; }
    if (!n->left) { n = std::move(n->right); return; }         // 0 or 1 child
    if (!n->right) { n = std::move(n->left); return; }
    Node* succ = n->right.get();                                // 2 children: inorder successor
    while (succ->left) succ = succ->left.get();
    n->key = succ->key;
    erase(n->right, succ->key);
}

void inorder(const Node* n) { if (!n) return; inorder(n->left.get()); std::cout << n->key << ' '; inorder(n->right.get()); }
int height(const Node* n) { return n ? 1 + std::max(height(n->left.get()), height(n->right.get())) : -1; }

int main() {
    std::unique_ptr<Node> root;
    for (int k : {50, 30, 70, 20, 40, 60, 80}) insert(root, k);
    std::cout << "sorted: "; inorder(root.get()); std::cout << '\n';
    std::cout << std::boolalpha << "contains 60? " << contains(root.get(), 60)
              << ", contains 65? " << contains(root.get(), 65) << '\n';
    erase(root, 50);                                            // root with two children
    std::cout << "after erase(50): root=" << root->key << ", sorted: "; inorder(root.get()); std::cout << '\n';
    std::cout << "height (balanced input) = " << height(root.get()) << '\n';

    std::unique_ptr<Node> chain;
    for (int k = 1; k <= 1000; ++k) insert(chain, k);           // sorted input
    std::cout << "height after inserting 1..1000 in order = " << height(chain.get()) << '\n';
}
```

**Output:**
```text
sorted: 20 30 40 50 60 70 80 
contains 60? true, contains 65? false
after erase(50): root=60, sorted: 20 30 40 60 70 80 
height (balanced input) = 2
height after inserting 1..1000 in order = 999
```

### Interview answer
"A BST keeps left < node < right, so search, insert and delete are O(h). Delete with two children swaps in the inorder successor. Inorder traversal is sorted. The weakness is that h can be n — sorted inserts make a linked list — so in practice we use self-balancing trees like AVL or red-black, which guarantee O(log n)."

---

## 3. Self-balancing BST

**In one sentence:** a self-balancing BST **automatically keeps its height O(log n)** after every insert and delete, usually with **rotations**, so operations never degrade to O(n).

### In plain words
A BST that tidies itself. When one side gets too tall, it "rotates" a few nodes to move weight to the other side — like rebalancing a mobile hanging from the ceiling.

### How it works
- **Rotation** is the basic move: it changes the shape but keeps the left < node < right order. A right rotation at `y` makes its left child `x` the new subtree root; `x`'s right subtree becomes `y`'s left subtree. It is O(1).

```text
        y                x
       / \   rotate     / \
      x   C  right →   A   y
     / \     ← left       / \
    A   B                B   C
```

| Tree | How it stays balanced | Guarantee |
|---|---|---|
| **AVL** | heights of the two children differ by ≤ 1 | strict; height ≤ 1.44 log₂ n |
| **Red-black** | color rules: equal number of black nodes on every path | height ≤ 2 log₂(n+1); fewer rotations than AVL |
| **Splay** | moves each accessed node to the root | **amortized** O(log n) |
| **Scapegoat** | no per-node data; rebuilds an unbalanced subtree | amortized O(log n) |
| **Treap** | random priorities kept in heap order | expected O(log n) |
| **Tango** | built for a **sequence** of searches | O(log log n)-competitive |

### 3.1 Scapegoat tree

#### In plain words
It lets the tree get a bit messy and doesn't store any balance info in the nodes. When an insert lands **too deep**, it walks back up, finds the node where things went wrong (the **scapegoat**), and **rebuilds that whole subtree** into a perfectly balanced one.

#### How it works
- Pick α between 0.5 and 1 (for example 0.7). A node is **α-weight-balanced** if each child's subtree size ≤ α × the node's size.
- After an insert, if the new node's depth > log₁/α(n), walk up to find the first ancestor that is **not** α-weight-balanced — the scapegoat.
- Rebuild: flatten the scapegoat's subtree into a sorted array (inorder), then build a perfectly balanced tree from the middle out. O(size of that subtree).
- Rebuilds are rare, so inserts are **amortized O(log n)**, searches are **worst-case O(log n)**, and nodes need no color or height field.

#### Modern C++ example — scapegoat insert with subtree rebuild
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <cmath>
#include <iostream>
#include <memory>
#include <vector>

struct Node {
    int key;
    std::unique_ptr<Node> left, right;
    explicit Node(int k) : key(k) {}
};

class ScapegoatTree {
public:
    void insert(int key) {
        std::vector<std::unique_ptr<Node>*> path;          // links from the root down to the new node
        std::unique_ptr<Node>* link = &root_;
        while (*link) { path.push_back(link); link = key < (*link)->key ? &(*link)->left : &(*link)->right; }
        *link = std::make_unique<Node>(key);
        path.push_back(link);
        ++n_;
        int depth = static_cast<int>(path.size()) - 1;
        if (depth <= std::log(n_) / std::log(1 / kAlpha)) return;     // still shallow enough
        for (int i = static_cast<int>(path.size()) - 2; i >= 0; --i) {   // walk up: find the scapegoat
            Node* node = path[i]->get();
            int total = size(node);
            if (size(node->left.get()) > kAlpha * total || size(node->right.get()) > kAlpha * total) {
                std::vector<std::unique_ptr<Node>> nodes;
                flatten(std::move(*path[i]), nodes);
                *path[i] = build(nodes, 0, static_cast<int>(nodes.size()));
                ++rebuilds_;
                return;
            }
        }
    }
    int height() const { return height(root_.get()); }
    int rebuilds() const { return rebuilds_; }
private:
    static constexpr double kAlpha = 0.7;
    static int size(const Node* n) { return n ? 1 + size(n->left.get()) + size(n->right.get()) : 0; }
    static int height(const Node* n) { return n ? 1 + std::max(height(n->left.get()), height(n->right.get())) : -1; }
    static void flatten(std::unique_ptr<Node> n, std::vector<std::unique_ptr<Node>>& out) {
        if (!n) return;
        flatten(std::move(n->left), out);
        auto right = std::move(n->right);
        out.push_back(std::move(n));
        flatten(std::move(right), out);
    }
    static std::unique_ptr<Node> build(std::vector<std::unique_ptr<Node>>& v, int lo, int hi) {
        if (lo >= hi) return nullptr;
        int mid = (lo + hi) / 2;
        auto n = std::move(v[mid]);
        n->left = build(v, lo, mid);
        n->right = build(v, mid + 1, hi);
        return n;
    }
    std::unique_ptr<Node> root_;
    int n_ = 0, rebuilds_ = 0;
};

int main() {
    ScapegoatTree t;
    for (int k = 1; k <= 1000; ++k) t.insert(k);           // worst case for a plain BST
    std::cout << "inserted 1..1000 in order: height=" << t.height()
              << " (plain BST: 999), rebuilds=" << t.rebuilds() << '\n';
}
```

**Output:**
```text
inserted 1..1000 in order: height=17 (plain BST: 999), rebuilds=375
```

The height stays below log₁/₀.₇(1000) ≈ 19.4. Sorted input is the worst case, so it rebuilds often here, but most rebuilds are small subtrees; the total work is still amortized O(log n) per insert.

### 3.2 Tango tree

#### In plain words
A tango tree is a research data structure designed to be fast for a **whole sequence of lookups**, not just one. It remembers which child of each node was used **most recently** and keeps those "preferred paths" glued together in small balanced trees.

#### How it works
- Picture a perfect reference BST over the keys. For each node, the **preferred child** is the side whose subtree was accessed most recently. Following preferred children gives **preferred paths**.
- Each preferred path is stored as an auxiliary **red-black tree** keyed by depth; these auxiliary trees are linked together.
- A search costs O((k + 1) · log log n), where k is the number of preferred-child changes the search causes.
- Result (Demaine, Harmon, Iacono and Pătraşcu, 2004): tango trees are **O(log log n)-competitive** — never more than O(log log n) times slower than the best possible BST for that access sequence. It was the first such result toward the **dynamic optimality conjecture**.
- **For interviews:** know the name, the idea (preferred paths + auxiliary trees), and the O(log log n)-competitive result. It is rarely implemented in practice; nobody will ask you to code it.

### Interview answer
"Self-balancing BSTs restore O(log n) height after updates, mostly with O(1) rotations that keep the BST order. AVL is strictly balanced by height, red-black is looser but needs fewer rotations, splay trees move accessed nodes to the root for amortized bounds, and scapegoat trees store nothing extra and rebuild an unbalanced subtree when an insert goes too deep. Tango trees are a theory result: O(log log n)-competitive with the optimal BST for any access sequence."

---

## 4. AVL Trees

**In one sentence:** an AVL tree (Adelson-Velsky and Landis, 1962) is a BST where, at every node, the **heights of the left and right subtrees differ by at most 1**, restored with rotations after each update.

### In plain words
Each node keeps its height. After inserting, walk back up; if one side of a node is 2 taller than the other, rotate to fix it.

### How it works
- **Balance factor** = height(left) − height(right) ∈ {−1, 0, +1}.
- After an insert, the first unbalanced ancestor falls into one of 4 cases:

| Case | Shape | Fix |
|---|---|---|
| **LL** | inserted in the left child's left subtree | one right rotation |
| **RR** | right child's right subtree | one left rotation |
| **LR** | left child's right subtree | left-rotate the child, then right-rotate the node |
| **RL** | right child's left subtree | right-rotate the child, then left-rotate the node |

- Height is at most about **1.44 log₂ n**, so lookups are very fast — good for **read-heavy** workloads. Inserts and deletes do more rotations than a red-black tree.

#### Modern C++ example — AVL insert with the four rotation cases
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <iostream>
#include <memory>

struct Node {
    int key, h = 0;                                   // height of this subtree (leaf = 0)
    std::unique_ptr<Node> left, right;
    explicit Node(int k) : key(k) {}
};
using Ptr = std::unique_ptr<Node>;

int h(const Ptr& n) { return n ? n->h : -1; }
void update(Ptr& n) { n->h = 1 + std::max(h(n->left), h(n->right)); }
int balance(const Ptr& n) { return h(n->left) - h(n->right); }

void rotate_right(Ptr& y) {                          // y's left child becomes the subtree root
    Ptr x = std::move(y->left);
    y->left = std::move(x->right);
    update(y);
    x->right = std::move(y);
    update(x);
    y = std::move(x);
}
void rotate_left(Ptr& x) {
    Ptr y = std::move(x->right);
    x->right = std::move(y->left);
    update(x);
    y->left = std::move(x);
    update(y);
    x = std::move(y);
}

int rotations = 0;
void insert(Ptr& n, int key) {
    if (!n) { n = std::make_unique<Node>(key); return; }
    if (key < n->key) insert(n->left, key);
    else if (key > n->key) insert(n->right, key);
    else return;
    update(n);
    int b = balance(n);
    if (b > 1 && key < n->left->key)  { rotate_right(n); ++rotations; }                                   // LL
    else if (b < -1 && key > n->right->key) { rotate_left(n); ++rotations; }                              // RR
    else if (b > 1)  { rotate_left(n->left); rotate_right(n); rotations += 2; }                           // LR
    else if (b < -1) { rotate_right(n->right); rotate_left(n); rotations += 2; }                          // RL
}

void print(const Ptr& n) {
    if (!n) return;
    std::cout << '(';
    print(n->left);
    std::cout << ' ' << n->key << ' ';
    print(n->right);
    std::cout << ')';
}

int main() {
    Ptr root;
    for (int k : {10, 20, 30}) insert(root, k);             // RR case
    std::cout << "after 10,20,30: "; print(root); std::cout << '\n';
    for (int k : {25, 28}) insert(root, k);                 // creates an RL case under 30
    std::cout << "after 25,28:    "; print(root); std::cout << '\n';

    Ptr big;
    rotations = 0;
    for (int k = 1; k <= 1000; ++k) insert(big, k);
    std::cout << "1..1000 in order: height=" << h(big) << ", rotations=" << rotations << '\n';
}
```

**Output:**
```text
after 10,20,30: (( 10 ) 20 ( 30 ))
after 25,28:    (( 10 ) 20 (( 25 ) 28 ( 30 )))
1..1000 in order: height=9, rotations=990
```

### Interview answer
"An AVL tree stores a height in each node and keeps every balance factor in −1..1. After an insert I walk back up, and the first unbalanced node is one of four cases: LL and RR need one rotation, LR and RL need two. Height stays below about 1.44 log n, so it's great for lookup-heavy workloads; red-black trees are preferred when there are many writes."

---

## 5. Red-Black Trees

**In one sentence:** a red-black tree is a BST where every node is **red or black** and color rules guarantee that **no path is more than twice as long as any other**, so the height is ≤ 2 log₂(n + 1).

### In plain words
Instead of measuring heights exactly like AVL, it uses a cheaper rule: count only the **black** nodes, and make that count the same on every path. Red nodes are "extra" nodes that are allowed between black ones, but never two reds in a row. So the longest path (alternating red/black) is at most twice the shortest (all black).

### How it works
**The rules**
1. Every node is red or black.
2. The root is black.
3. Every leaf (`nullptr`) counts as black.
4. A red node has **no red child**.
5. Every path from a node down to its leaves has the **same number of black nodes** (the black-height).

**Insert:** add the node as in a BST and color it **red** (this can't break rule 5). If its parent is also red, fix it:
- **Uncle is red** → recolor: parent and uncle black, grandparent red; move up to the grandparent and repeat.
- **Uncle is black** → one or two **rotations** plus a recolor; then it's done.
- Finally color the root black.

At most **2 rotations per insert** and **3 per delete** — that's why red-black trees are used where writes are frequent: `std::map`/`std::set`, Java `TreeMap`, the Linux kernel's `rbtree` (used by the CFS scheduler, epoll and virtual memory areas).

#### Modern C++ example — red-black insert (CLRS style) with a rule checker
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <vector>

enum Color { RED, BLACK };
struct Node { int key; Color color; Node *left, *right, *parent; };

class RedBlackTree {
public:
    ~RedBlackTree() { for (Node* n : all_) delete n; }
    void insert(int key) {
        Node* z = new Node{key, RED, nullptr, nullptr, nullptr};
        all_.push_back(z);
        Node *y = nullptr, *x = root_;
        while (x) { y = x; x = key < x->key ? x->left : x->right; }
        z->parent = y;
        if (!y) root_ = z; else if (key < y->key) y->left = z; else y->right = z;
        fix_insert(z);
    }
    int height() const { return height(root_); }
    int black_height_or_minus1() const { return check(root_); }  // -1 if any rule is broken
    int rotations() const { return rotations_; }
private:
    void rotate_left(Node* x) {
        Node* y = x->right;
        x->right = y->left;
        if (y->left) y->left->parent = x;
        y->parent = x->parent;
        if (!x->parent) root_ = y; else if (x == x->parent->left) x->parent->left = y; else x->parent->right = y;
        y->left = x; x->parent = y;
        ++rotations_;
    }
    void rotate_right(Node* x) {
        Node* y = x->left;
        x->left = y->right;
        if (y->right) y->right->parent = x;
        y->parent = x->parent;
        if (!x->parent) root_ = y; else if (x == x->parent->right) x->parent->right = y; else x->parent->left = y;
        y->right = x; x->parent = y;
        ++rotations_;
    }
    static bool red(const Node* n) { return n && n->color == RED; }
    void fix_insert(Node* z) {
        while (red(z->parent)) {
            Node* g = z->parent->parent;
            bool parent_is_left = z->parent == g->left;
            Node* uncle = parent_is_left ? g->right : g->left;
            if (red(uncle)) {                                   // case 1: recolor and move up
                z->parent->color = BLACK; uncle->color = BLACK; g->color = RED;
                z = g;
                continue;
            }
            if (parent_is_left) {
                if (z == z->parent->right) { z = z->parent; rotate_left(z); }    // case 2 -> case 3
                z->parent->color = BLACK; g->color = RED; rotate_right(g);       // case 3
            } else {
                if (z == z->parent->left) { z = z->parent; rotate_right(z); }
                z->parent->color = BLACK; g->color = RED; rotate_left(g);
            }
        }
        root_->color = BLACK;
    }
    static int height(const Node* n) { return n ? 1 + std::max(height(n->left), height(n->right)) : -1; }
    static int check(const Node* n) {                           // returns black-height, or -1 on violation
        if (!n) return 1;
        if (red(n) && (red(n->left) || red(n->right))) return -1;
        int l = check(n->left), r = check(n->right);
        if (l == -1 || r == -1 || l != r) return -1;
        return l + (n->color == BLACK ? 1 : 0);
    }
    Node* root_ = nullptr;
    std::vector<Node*> all_;
    int rotations_ = 0;
};

int main() {
    RedBlackTree t;
    for (int k = 1; k <= 1000; ++k) t.insert(k);
    std::cout << "1..1000 in order: height=" << t.height()
              << ", black-height=" << t.black_height_or_minus1()
              << ", rotations=" << t.rotations() << '\n';
    std::cout << "rules hold: " << std::boolalpha << (t.black_height_or_minus1() != -1) << '\n';
}
```

**Output:**
```text
1..1000 in order: height=16, black-height=10, rotations=983
rules hold: true
```

### AVL vs. red-black
| | AVL | Red-black |
|---|---|---|
| Balance | strict (heights differ ≤ 1) | loose (black-height equal) |
| Height | ≤ 1.44 log₂ n | ≤ 2 log₂(n+1) |
| Lookups | slightly faster | slightly slower |
| Rotations per insert / delete | up to O(log n) on delete | ≤ 2 / ≤ 3 |
| Used in | read-heavy indexes, some databases | `std::map`, Java `TreeMap`, Linux kernel |

### Interview answer
"A red-black tree colors nodes so that no red node has a red child and every root-to-leaf path has the same number of black nodes; that bounds the height at 2 log(n+1). New nodes are inserted red; a red-red conflict is fixed by recoloring when the uncle is red, or by at most two rotations when it's black. It's looser than AVL, so lookups are a bit slower, but updates need fewer rotations — that's why `std::map` and the Linux kernel use it."

---

## 6. Heap Trees (min-heap, max-heap)

**In one sentence:** a heap is a **complete binary tree** where every parent is **≤ its children (min-heap)** or **≥ its children (max-heap)**, so the smallest (or largest) item is always at the root.

### In plain words
A company org chart where every boss is more senior than the people below them. You can always find the most senior person instantly — they're at the top. You don't know the order among people on the same level, and you don't need to.

### How it works
- Stored in an **array** (it's complete): children of `i` are `2i+1`, `2i+2`; parent is `(i−1)/2`.
- `push`: append and **sift up** — O(log n). `pop`: move the last item to the root and **sift down** — O(log n). `top`: O(1).
- **Build a heap from n items in O(n)** (Floyd's method): sift down every non-leaf from the last one back to the root. Most nodes are near the bottom and move very little.
- **Heapsort:** build a max-heap, then repeatedly swap the root to the end and sift down. O(n log n), in place, not stable.
- A heap is **not** a BST: there's no left/right order, so searching for an arbitrary key is O(n).
- Used for priority queues ([Queues → Priority queue](./Queues.md#14-priority-queue)), Dijkstra, top-k, median of a stream (two heaps) and merging k sorted lists.

#### Modern C++ example — heapify, heapsort, top-k and running median
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <functional>
#include <iostream>
#include <queue>
#include <vector>

void sift_down(std::vector<int>& a, std::size_t i, std::size_t n) {         // max-heap
    while (true) {
        std::size_t l = 2 * i + 1, r = l + 1, big = i;
        if (l < n && a[l] > a[big]) big = l;
        if (r < n && a[r] > a[big]) big = r;
        if (big == i) return;
        std::swap(a[i], a[big]);
        i = big;
    }
}

void heapsort(std::vector<int>& a) {
    for (std::size_t i = a.size() / 2; i-- > 0;) sift_down(a, i, a.size());  // O(n) build
    for (std::size_t end = a.size(); end-- > 1;) {
        std::swap(a[0], a[end]);                                             // max goes to the end
        sift_down(a, 0, end);
    }
}

std::vector<int> top_k(const std::vector<int>& a, std::size_t k) {         // keep a min-heap of size k
    std::priority_queue<int, std::vector<int>, std::greater<int>> h;
    for (int x : a) { h.push(x); if (h.size() > k) h.pop(); }
    std::vector<int> out;
    while (!h.empty()) { out.push_back(h.top()); h.pop(); }
    std::reverse(out.begin(), out.end());
    return out;
}

int main() {
    std::vector<int> a{4, 10, 3, 5, 1, 8, 7};
    heapsort(a);
    std::cout << "heapsort:";
    for (int x : a) std::cout << ' ' << x;

    std::cout << "\ntop 3 of {5,12,3,18,7,9,15}:";
    for (int x : top_k({5, 12, 3, 18, 7, 9, 15}, 3)) std::cout << ' ' << x;

    // Running median: max-heap for the lower half, min-heap for the upper half.
    std::priority_queue<int> low;
    std::priority_queue<int, std::vector<int>, std::greater<int>> high;
    std::cout << "\nrunning median:";
    for (int x : {5, 15, 1, 3, 8}) {
        if (low.empty() || x <= low.top()) low.push(x); else high.push(x);
        if (low.size() > high.size() + 1) { high.push(low.top()); low.pop(); }
        if (high.size() > low.size())     { low.push(high.top()); high.pop(); }
        double median = low.size() > high.size() ? low.top() : (low.top() + high.top()) / 2.0;
        std::cout << ' ' << median;
    }
    std::cout << '\n';
}
```

**Output:**
```text
heapsort: 1 3 4 5 7 8 10
top 3 of {5,12,3,18,7,9,15}: 18 15 12
running median: 5 10 5 4 5
```

### Interview answer
"A heap is a complete binary tree with the heap property — parents are smaller in a min-heap, larger in a max-heap — stored in an array with children at 2i+1 and 2i+2. Push and pop are O(log n) with sift-up and sift-down, peek is O(1), and building from n items is O(n). It's the standard priority queue; I'd use a size-k min-heap for top-k and two heaps for a running median."

---

## 7. B-Trees

**In one sentence:** a B-tree is a **wide, shallow, always-balanced** search tree where each node holds **many sorted keys** and has many children, designed so that each node fits one **disk page** and a lookup reads only a few pages.

### In plain words
A library catalogue cabinet. The top drawer tells you "A–F is cabinet 1, G–M is cabinet 2…". Each cabinet has drawers that split it further. With hundreds of entries per drawer, you reach any book in 3–4 drawer openings even among millions of books. Opening a drawer = reading one disk page, which is slow, so you want very few.

### How it works
- **Minimum degree t** (t ≥ 2): every node except the root has **t−1 to 2t−1 keys**; an internal node with k keys has **k+1 children**.
- All leaves are at the **same depth**, so the tree is perfectly balanced in height.
- **Search:** inside a node, binary-search the keys, then go to the right child. O(log n) total, but the number of **disk reads** is the height ≈ log_t(n).
- **Insert:** always into a leaf. If a node is **full** (2t−1 keys), **split** it: the middle key moves up into the parent, and the two halves become siblings. The tree grows **at the root** — that's how it stays balanced.
- **Delete:** borrow from a sibling or merge with it when a node gets too small.
- With t = 500 (a 16 KB page), a tree of height 3 can hold about 1 billion keys.
- **B+ tree** (what databases really use): all values live in the **leaves**, internal nodes hold only keys for routing, and leaves are **linked**, so range scans are fast. See [Databases → Indexing](../Databases/Indexing.md#2-b-tree). Used by MySQL InnoDB, PostgreSQL, SQLite, and file systems like NTFS, Btrfs and XFS.

#### Modern C++ example — B-tree insert with node splitting (t = 2, a "2-3-4 tree")
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <iostream>
#include <memory>
#include <vector>

constexpr int T = 2;                                   // nodes hold 1..3 keys, 2..4 children

struct Node {
    std::vector<int> keys;
    std::vector<std::unique_ptr<Node>> kids;           // empty for a leaf
    bool leaf() const { return kids.empty(); }
};

class BTree {
public:
    void insert(int key) {
        if (!root_) { root_ = std::make_unique<Node>(); }
        if (root_->keys.size() == 2 * T - 1) {          // full root: grow the tree upward
            auto new_root = std::make_unique<Node>();
            new_root->kids.push_back(std::move(root_));
            split_child(*new_root, 0);
            root_ = std::move(new_root);
        }
        insert_nonfull(*root_, key);
    }
    bool contains(int key) const {
        const Node* n = root_.get();
        while (n) {
            auto it = std::lower_bound(n->keys.begin(), n->keys.end(), key);
            if (it != n->keys.end() && *it == key) return true;
            if (n->leaf()) return false;
            n = n->kids[it - n->keys.begin()].get();
        }
        return false;
    }
    void print() const { print(root_.get(), 0); }
private:
    static void split_child(Node& parent, std::size_t i) {     // parent.kids[i] is full
        Node& full = *parent.kids[i];
        auto right = std::make_unique<Node>();
        int middle = full.keys[T - 1];
        right->keys.assign(full.keys.begin() + T, full.keys.end());
        full.keys.resize(T - 1);
        if (!full.leaf()) {
            for (std::size_t c = T; c < full.kids.size(); ++c) right->kids.push_back(std::move(full.kids[c]));
            full.kids.resize(T);
        }
        parent.keys.insert(parent.keys.begin() + i, middle);   // middle key moves up
        parent.kids.insert(parent.kids.begin() + i + 1, std::move(right));
    }
    static void insert_nonfull(Node& n, int key) {
        std::size_t i = std::upper_bound(n.keys.begin(), n.keys.end(), key) - n.keys.begin();
        if (n.leaf()) { n.keys.insert(n.keys.begin() + i, key); return; }
        if (n.kids[i]->keys.size() == 2 * T - 1) {              // split on the way down
            split_child(n, i);
            if (key > n.keys[i]) ++i;
        }
        insert_nonfull(*n.kids[i], key);
    }
    static void print(const Node* n, int depth) {
        if (!n) return;
        std::cout << std::string(depth * 4, ' ') << '[';
        for (std::size_t i = 0; i < n->keys.size(); ++i) std::cout << (i ? " " : "") << n->keys[i];
        std::cout << "]\n";
        for (const auto& k : n->kids) print(k.get(), depth + 1);
    }
    std::unique_ptr<Node> root_;
};

int main() {
    BTree t;
    for (int k : {10, 20, 5, 6, 12, 30, 7, 17}) t.insert(k);
    t.print();
    std::cout << std::boolalpha << "contains 12? " << t.contains(12) << ", contains 13? " << t.contains(13) << '\n';
}
```

**Output:**
```text
[10 20]
    [5 6 7]
    [12 17]
    [30]
contains 12? true, contains 13? false
```

### Interview answer
"A B-tree is a balanced multi-way search tree: each node holds between t−1 and 2t−1 sorted keys and all leaves are at the same depth. Nodes are sized to a disk page, so the height — the number of page reads — is about log base t of n, which is 3 or 4 even for billions of rows. Inserts go into leaves and split full nodes, pushing the middle key up, so the tree grows at the root. Databases use the B+ tree variant, where data is only in linked leaves, which makes range scans cheap."

---

## 8. Splay Trees

**In one sentence:** a splay tree is a BST that, after every access, **moves the accessed node to the root** with rotations ("splaying"), giving **amortized O(log n)** per operation and making **recently used keys very fast** to reach again.

### In plain words
A pile of papers on your desk: whenever you use a paper, you put it on top. Papers you use often stay near the top, papers you never use sink. No paper ever stores any balance info.

### How it works
- **Splay(x)** repeats one of three steps until x is the root:
  - **Zig:** x's parent is the root → one rotation.
  - **Zig-zig:** x and its parent are both left children (or both right) → rotate the **grandparent first**, then the parent.
  - **Zig-zag:** x is a left child of a right child (or the reverse) → rotate x up twice.
- Search, insert and delete all end with a splay. A single operation can cost O(n), but any sequence of m operations costs **O(m log n)** — amortized O(log n).
- **Working-set property:** accessing a key that was used recently is cheap. Good for caches, and used in some memory allocators, network routers and the GCC and Windows NT internals.
- **Downsides:** even **reads modify the tree** (bad for concurrent readers), and a single operation can be slow.

#### Modern C++ example — splay to root and the "recently used is fast" effect
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <memory>

struct Node {
    int key;
    Node *left = nullptr, *right = nullptr;
    explicit Node(int k) : key(k) {}
};

Node* rotate_right(Node* x) { Node* y = x->left; x->left = y->right; y->right = x; return y; }
Node* rotate_left(Node* x)  { Node* y = x->right; x->right = y->left; y->left = x; return y; }

// Recursive splay: brings `key` (or the last node on its search path) to the root.
Node* splay(Node* root, int key) {
    if (!root || root->key == key) return root;
    if (key < root->key) {
        if (!root->left) return root;
        if (key < root->left->key) {                                   // zig-zig
            root->left->left = splay(root->left->left, key);
            root = rotate_right(root);
        } else if (key > root->left->key) {                            // zig-zag
            root->left->right = splay(root->left->right, key);
            if (root->left->right) root->left = rotate_left(root->left);
        }
        return root->left ? rotate_right(root) : root;                 // zig
    }
    if (!root->right) return root;
    if (key > root->right->key) {
        root->right->right = splay(root->right->right, key);
        root = rotate_left(root);
    } else if (key < root->right->key) {
        root->right->left = splay(root->right->left, key);
        if (root->right->left) root->right = rotate_right(root->right);
    }
    return root->right ? rotate_left(root) : root;
}

Node* insert(Node* root, int key) {
    if (!root) return new Node(key);
    root = splay(root, key);
    if (root->key == key) return root;
    Node* n = new Node(key);
    if (key < root->key) { n->right = root; n->left = root->left; root->left = nullptr; }
    else                 { n->left = root; n->right = root->right; root->right = nullptr; }
    return n;                                                         // new key is the root
}

int depth(const Node* n, int key) {
    int d = 0;
    while (n && n->key != key) { n = key < n->key ? n->left : n->right; ++d; }
    return d;
}
void destroy(Node* n) { if (!n) return; destroy(n->left); destroy(n->right); delete n; }

int main() {
    Node* root = nullptr;
    for (int k = 1; k <= 7; ++k) root = insert(root, k);
    std::cout << "root after inserting 1..7: " << root->key << '\n';
    std::cout << "depth of key 1 before access: " << depth(root, 1) << '\n';
    root = splay(root, 1);
    std::cout << "after accessing 1: root=" << root->key << ", depth of 1 = " << depth(root, 1) << '\n';
    root = splay(root, 4);
    std::cout << "after accessing 4: root=" << root->key << ", depth of 1 = " << depth(root, 1) << '\n';
    destroy(root);
}
```

**Output:**
```text
root after inserting 1..7: 7
depth of key 1 before access: 6
after accessing 1: root=1, depth of 1 = 0
after accessing 4: root=4, depth of 1 = 1
```

Notice the first splay of the deep key 1 also roughly halved the depth of the other nodes on its path — that's where the amortized bound comes from.

### Interview answer
"A splay tree is a self-adjusting BST: every access splays the node to the root using zig, zig-zig and zig-zag rotations. It stores no balance data, a single operation can be O(n), but any sequence is amortized O(log n), and frequently or recently used keys stay near the top. The trade-off is that reads mutate the tree, which hurts concurrency."

---

## 9. Trie

**In one sentence:** a trie (prefix tree) stores strings **character by character along paths from the root**, so looking up a word or **all words with a prefix** costs O(length of the word), no matter how many words are stored.

### In plain words
A phone's autocomplete. Type "ca": you follow the "c" branch, then the "a" branch, and everything below that point — "cat", "car", "card" — is a suggestion.

### How it works
- Each node has up to |alphabet| children (26 for lowercase letters) and an **end-of-word** flag.
- `insert(word)`, `contains(word)`, `starts_with(prefix)`: walk one node per character — **O(L)**.
- Words that share a prefix share nodes, which saves space when there are many common prefixes.
- **Memory:** an array of 26 pointers per node is fast but wasteful; use a hash map or a sorted vector of children for big alphabets, or compress chains into a [radix tree](#10-radix-trees).
- Used for autocomplete, spell checkers, IP routing (binary tries over address bits), word games (Boggle), and the "maximum XOR of two numbers" interview problem (bitwise trie).

#### Modern C++ example — trie with autocomplete
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <array>
#include <iostream>
#include <memory>
#include <string>
#include <vector>

class Trie {
    struct Node {
        std::array<std::unique_ptr<Node>, 26> next{};
        bool end = false;
    };
public:
    void insert(const std::string& w) {
        Node* n = &root_;
        for (char c : w) {
            auto& child = n->next[c - 'a'];
            if (!child) child = std::make_unique<Node>();
            n = child.get();
        }
        n->end = true;
    }
    bool contains(const std::string& w) const { const Node* n = find(w); return n && n->end; }
    std::vector<std::string> complete(const std::string& prefix) const {
        std::vector<std::string> out;
        std::string cur = prefix;
        if (const Node* n = find(prefix)) collect(n, cur, out);
        return out;
    }
private:
    const Node* find(const std::string& s) const {
        const Node* n = &root_;
        for (char c : s) { n = n->next[c - 'a'].get(); if (!n) return nullptr; }
        return n;
    }
    static void collect(const Node* n, std::string& cur, std::vector<std::string>& out) {
        if (n->end) out.push_back(cur);
        for (int i = 0; i < 26; ++i)
            if (n->next[i]) { cur.push_back(char('a' + i)); collect(n->next[i].get(), cur, out); cur.pop_back(); }
    }
    Node root_;
};

int main() {
    Trie t;
    for (const char* w : {"car", "card", "care", "cat", "dog", "do"}) t.insert(w);
    std::cout << std::boolalpha << "contains car? " << t.contains("car") << ", contains ca? " << t.contains("ca") << '\n';
    for (const char* p : {"car", "ca", "d", "x"}) {
        std::cout << "complete(\"" << p << "\"):";
        for (const auto& w : t.complete(p)) std::cout << ' ' << w;
        std::cout << '\n';
    }
}
```

**Output:**
```text
contains car? true, contains ca? false
complete("car"): car card care
complete("ca"): car card care cat
complete("d"): do dog
complete("x"):
```

### Interview answer
"A trie stores strings as root-to-node paths, one character per edge, with an end-of-word flag. Insert, lookup and prefix checks are O(L) in the word length, independent of how many words there are, and prefix queries are natural — autocomplete is a DFS under the prefix node. The cost is memory, which I'd reduce with map-based children or a compressed radix tree."

---

## 10. Radix Trees

**In one sentence:** a radix tree (also **compressed trie** or **Patricia tree**) is a trie where every **chain of single-child nodes is merged into one edge labelled with a whole string**, so it uses far fewer nodes.

### In plain words
In a plain trie, "romane" and "romanus" share the nodes r → o → m → a → n, one letter each. A radix tree stores that shared part as **one** edge "roman", then splits into "e" and "us".

### How it works
- Every internal node (except the root) has **at least 2 children**, so there are at most 2n − 1 nodes for n keys.
- **Lookup:** at each node, find the child edge whose label is a prefix of the remaining key, consume it, continue. O(L).
- **Insert:** walk down; if the key diverges **in the middle of an edge**, **split** that edge at the divergence point.
- Used in the **Linux kernel** (the page cache used a radix tree, now the XArray), **IP routing tables** (longest-prefix match), **Redis** (radix trees store stream entries and cluster slots), **HTTP routers** (Go's httprouter, many web frameworks), and Ethereum's Merkle-Patricia trie.

#### Modern C++ example — radix tree insert with edge splitting
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <memory>
#include <string>

class RadixTree {
    struct Node {
        std::map<char, std::pair<std::string, std::unique_ptr<Node>>> edges;   // first char -> (label, child)
        bool end = false;
    };
public:
    void insert(std::string key) {
        Node* n = &root_;
        while (true) {
            if (key.empty()) { n->end = true; return; }
            auto it = n->edges.find(key[0]);
            if (it == n->edges.end()) {                                    // no edge: add the rest as one label
                auto leaf = std::make_unique<Node>();
                leaf->end = true;
                n->edges[key[0]] = {key, std::move(leaf)};
                return;
            }
            auto& [label, child] = it->second;
            std::size_t common = 0;
            while (common < label.size() && common < key.size() && label[common] == key[common]) ++common;
            if (common < label.size()) {                                   // split the edge
                auto mid = std::make_unique<Node>();
                mid->edges[label[common]] = {label.substr(common), std::move(child)};
                label = label.substr(0, common);
                child = std::move(mid);
            }
            n = child.get();
            key = key.substr(common);
        }
    }
    bool contains(std::string key) const {
        const Node* n = &root_;
        while (!key.empty()) {
            auto it = n->edges.find(key[0]);
            if (it == n->edges.end()) return false;
            const auto& [label, child] = it->second;
            if (key.compare(0, label.size(), label) != 0) return false;
            key = key.substr(label.size());
            n = child.get();
        }
        return n->end;
    }
    void print() const { print(&root_, 0); }
    int nodes() const { return count(&root_); }
private:
    static void print(const Node* n, int depth) {
        for (const auto& [c, edge] : n->edges) {
            std::cout << std::string(depth * 2, ' ') << '"' << edge.first << '"' << (edge.second->end ? " *" : "") << '\n';
            print(edge.second.get(), depth + 1);
        }
    }
    static int count(const Node* n) {
        int total = 1;
        for (const auto& [c, edge] : n->edges) total += count(edge.second.get());
        return total;
    }
    Node root_;
};

int main() {
    RadixTree t;
    for (const char* w : {"romane", "romanus", "romulus", "rubens", "ruber", "rubicon", "rubicundus"}) t.insert(w);
    t.print();
    std::cout << "nodes: " << t.nodes() << " (a plain trie needs 33)\n";
    std::cout << std::boolalpha << "contains ruber? " << t.contains("ruber")
              << ", contains rub? " << t.contains("rub") << '\n';
}
```

**Output:**
```text
"r"
  "om"
    "an"
      "e" *
      "us" *
    "ulus" *
  "ub"
    "e"
      "ns" *
      "r" *
    "ic"
      "on" *
      "undus" *
nodes: 14 (a plain trie needs 33)
contains ruber? true, contains rub? false
```

`*` marks the end of a stored word.

### Interview answer
"A radix tree is a compressed trie: chains of single-child nodes collapse into one edge labelled with a string, so every internal node branches and there are at most 2n−1 nodes. Lookup is still O(L). Inserting a key that diverges in the middle of an edge splits that edge. It's used for IP longest-prefix match, HTTP routers, Redis streams and the Linux page cache."

---

## Cheat sheet

| Tree | Key idea | Search | Insert / delete | Notes |
|---|---|---|---|---|
| Binary tree | ≤ 2 children | O(n) | — | pre/in/post/level order |
| Full / complete / perfect | 0 or 2 kids / filled left-to-right / all leaves same depth | — | — | complete → array; perfect has 2^(h+1)−1 nodes |
| BST | left < node < right | O(h) | O(h) | h = n on sorted input |
| AVL | heights differ ≤ 1 | O(log n) | O(log n) | 4 cases: LL, RR, LR, RL |
| Red-black | no red-red; equal black-height | O(log n) | O(log n), ≤ 2 rotations per insert | `std::map`, Linux kernel |
| Splay | accessed node → root | amortized O(log n) | amortized O(log n) | reads mutate the tree |
| Scapegoat | rebuild unbalanced subtree | O(log n) worst | amortized O(log n) | no per-node balance data |
| Tango | preferred paths in aux trees | O(log log n)-competitive | — | theory; dynamic optimality |
| Heap | parent ≤ / ≥ children, complete | top O(1); find O(n) | O(log n); build O(n) | priority queues, heapsort |
| B-tree | many keys per node, all leaves same depth | O(log n), ~log_t n page reads | split / merge | B+ tree in databases |
| Trie | one char per edge | O(L) | O(L) | prefix search, autocomplete |
| Radix tree | compressed trie | O(L) | O(L) + edge split | ≤ 2n−1 nodes; routers, IP tables |
