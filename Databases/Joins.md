# SQL Joins — Inner, Outer (Left, Right, Full) and Cross

> **What you'll learn:** what a join is, and exactly what **inner joins**, **outer joins (left, right, full)** and **cross joins** return — with the SQL, the result tables, and a C++ program that implements each join from scratch so you see what the database does internally (nested-loop and hash joins).
>
> **Prerequisites:** [SQL basics (SELECT)](./SQL-DQL.md), what a primary/foreign key is ([Constraints](./Constraints.md)).

## Table of Contents
0. [What is a join?](#0-what-is-a-join)
1. [Inner joins](#1-inner-joins)
2. [Outer joins (left, right, full)](#2-outer-joins-left-right-full)
3. [Cross joins](#3-cross-joins)
4. [How databases execute joins](#4-how-databases-execute-joins)
5. [Cheat sheet](#cheat-sheet)

The same two tables are used everywhere:

`customers`
| id | name |
|---|---|
| 1 | Ana |
| 2 | Ben |
| 3 | Cara |

`orders`
| order_id | customer_id | amount |
|---|---|---|
| 101 | 1 | 30 |
| 102 | 1 | 20 |
| 103 | 2 | 50 |
| 104 | 4 | 10 |

Notice: **Cara has no orders**, and **order 104 belongs to customer 4, who doesn't exist** (in a real schema a foreign key would prevent that; it's here to show what outer joins do).

```sql
CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT);
CREATE TABLE orders    (order_id INTEGER PRIMARY KEY, customer_id INTEGER, amount INTEGER);
INSERT INTO customers VALUES (1,'Ana'), (2,'Ben'), (3,'Cara');
INSERT INTO orders    VALUES (101,1,30), (102,1,20), (103,2,50), (104,4,10);
```

---

## 0. What is a join?

**In one sentence:** a join combines rows from two tables into one result by **matching** them on a condition, usually "this table's foreign key equals that table's primary key".

### In plain words
You have a guest list (customers) and a pile of receipts (orders). Each receipt has a customer number on it. A join is you sitting down and **stapling each receipt to the matching guest's card**. The different join types answer: "What do I do with guests who have no receipts, and receipts with no matching guest?"

| Join type | Guests with receipts | Guests with no receipts (Cara) | Receipts with no guest (order 104) |
|---|---|---|---|
| INNER | ✅ | ❌ | ❌ |
| LEFT | ✅ | ✅ | ❌ |
| RIGHT | ✅ | ❌ | ✅ |
| FULL OUTER | ✅ | ✅ | ✅ |

### How it works
- Syntax: `FROM a JOIN b ON <condition>`.
- The condition is usually equality on keys (an **equi-join**), but it can be any boolean expression (`ON a.x < b.y`).
- Use **table aliases** (`customers c`) to keep queries short.
- Missing matches in outer joins are filled with **NULL**.

---

## 1. Inner joins

**In one sentence:** an inner join returns **only the pairs of rows that match** the condition in both tables.

### In plain words
Only guests **with** receipts, and only receipts **with** a known guest. Cara (no orders) and order 104 (unknown customer) disappear.

### How it works
```sql
SELECT c.name, o.order_id, o.amount
FROM customers c
INNER JOIN orders o ON o.customer_id = c.id     -- "JOIN" alone means INNER JOIN
ORDER BY o.order_id;
```
| name | order_id | amount |
|---|---|---|
| Ana | 101 | 30 |
| Ana | 102 | 20 |
| Ben | 103 | 50 |

- A row can appear **multiple times** if it matches several rows (Ana has 2 orders → 2 result rows).
- Typical use: "orders with customer details", "employees with their department names".

### Modern C++ example — inner join as a hash join
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <format>
#include <iostream>
#include <string>
#include <unordered_map>
#include <vector>

struct Customer { int id; std::string name; };
struct Order    { int order_id, customer_id, amount; };

int main() {
    std::vector<Customer> customers{{1, "Ana"}, {2, "Ben"}, {3, "Cara"}};
    std::vector<Order> orders{{101, 1, 30}, {102, 1, 20}, {103, 2, 50}, {104, 4, 10}};

    // 1) BUILD: hash table on the join key of the smaller table
    std::unordered_map<int, const Customer*> by_id;
    for (const auto& c : customers) by_id[c.id] = &c;

    // 2) PROBE: for each order, look up its customer; keep only matches
    std::cout << "name | order_id | amount\n";
    for (const auto& o : orders) {
        if (auto it = by_id.find(o.customer_id); it != by_id.end())
            std::cout << std::format("{:4} | {:8} | {}\n", it->second->name, o.order_id, o.amount);
    }
}
```

**Output:**
```text
name | order_id | amount
Ana  |      101 | 30
Ana  |      102 | 20
Ben  |      103 | 50
```

### Interview answer
"An inner join returns only row pairs satisfying the join predicate; unmatched rows from either side are excluded, and a row matching several rows appears several times."

---

## 2. Outer joins (left, right, full)

**In one sentence:** outer joins return the matches **plus** the unmatched rows from one side (left/right) or both sides (full), filling the missing side with NULLs.

### In plain words
- **LEFT JOIN:** "every guest, with their receipts if they have any." Cara appears with empty receipt fields.
- **RIGHT JOIN:** "every receipt, with its guest if known." Order 104 appears with an empty name.
- **FULL OUTER JOIN:** "every guest *and* every receipt" — nobody is left out.

### How it works
**Left join** — all rows of the left table:
```sql
SELECT c.name, o.order_id, o.amount
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id;
```
| name | order_id | amount |
|---|---|---|
| Ana | 101 | 30 |
| Ana | 102 | 20 |
| Ben | 103 | 50 |
| Cara | NULL | NULL |

**Right join** — all rows of the right table:
```sql
SELECT c.name, o.order_id, o.amount
FROM customers c
RIGHT JOIN orders o ON o.customer_id = c.id;
```
| name | order_id | amount |
|---|---|---|
| Ana | 101 | 30 |
| Ana | 102 | 20 |
| Ben | 103 | 50 |
| NULL | 104 | 10 |

A right join is just a left join with the tables swapped; most people write left joins for readability.

**Full outer join** — all rows of both:
```sql
SELECT c.name, o.order_id, o.amount
FROM customers c
FULL OUTER JOIN orders o ON o.customer_id = c.id;
```
| name | order_id | amount |
|---|---|---|
| Ana | 101 | 30 |
| Ana | 102 | 20 |
| Ben | 103 | 50 |
| Cara | NULL | NULL |
| NULL | 104 | 10 |

(MySQL has no `FULL OUTER JOIN`; emulate it with `LEFT JOIN ... UNION ... RIGHT JOIN`.)

**Anti-join pattern** — "customers with **no** orders":
```sql
SELECT c.name
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.order_id IS NULL;          -- → Cara
```

**The classic trap:** a condition on the right table in `WHERE` turns a left join back into an inner join:
```sql
-- WRONG: removes Cara, because NULL > 25 is not true
SELECT c.name, o.amount FROM customers c LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.amount > 25;
-- RIGHT: filter inside ON keeps every customer
SELECT c.name, o.amount FROM customers c LEFT JOIN orders o
  ON o.customer_id = c.id AND o.amount > 25;
```

### Modern C++ example — left, right and full joins with `std::optional` as NULL
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <format>
#include <iostream>
#include <optional>
#include <set>
#include <string>
#include <vector>

struct Customer { int id; std::string name; };
struct Order    { int order_id, customer_id, amount; };

std::string show(const std::optional<std::string>& v) { return v.value_or("NULL"); }
std::string show(const std::optional<int>& v) { return v ? std::to_string(*v) : "NULL"; }

void print(std::optional<std::string> name, std::optional<int> id, std::optional<int> amount) {
    std::cout << std::format("  {:4} | {:4} | {}\n", show(name), show(id), show(amount));
}

int main() {
    const std::vector<Customer> customers{{1, "Ana"}, {2, "Ben"}, {3, "Cara"}};
    const std::vector<Order> orders{{101, 1, 30}, {102, 1, 20}, {103, 2, 50}, {104, 4, 10}};

    auto join = [&](bool keep_left, bool keep_right) {
        std::set<int> matched_orders;
        for (const auto& c : customers) {                    // nested-loop join
            bool matched = false;
            for (const auto& o : orders) {
                if (o.customer_id == c.id) {
                    print(c.name, o.order_id, o.amount);
                    matched = true;
                    matched_orders.insert(o.order_id);
                }
            }
            if (!matched && keep_left) print(c.name, std::nullopt, std::nullopt);   // NULL-extend
        }
        if (keep_right)
            for (const auto& o : orders)
                if (!matched_orders.contains(o.order_id)) print(std::nullopt, o.order_id, o.amount);
    };

    std::cout << "LEFT JOIN:\n";        join(true, false);
    std::cout << "RIGHT JOIN:\n";       join(false, true);
    std::cout << "FULL OUTER JOIN:\n";  join(true, true);
}
```

**Output:**
```text
LEFT JOIN:
  Ana  | 101  | 30
  Ana  | 102  | 20
  Ben  | 103  | 50
  Cara | NULL | NULL
RIGHT JOIN:
  Ana  | 101  | 30
  Ana  | 102  | 20
  Ben  | 103  | 50
  NULL | 104  | 10
FULL OUTER JOIN:
  Ana  | 101  | 30
  Ana  | 102  | 20
  Ben  | 103  | 50
  Cara | NULL | NULL
  NULL | 104  | 10
```

### Common mistakes
- Filtering the optional side in `WHERE` (see the trap above).
- `COUNT(*)` after a left join counts the NULL row too — use `COUNT(o.order_id)` to count real orders (Cara → 0).

### Interview answer
"A left outer join returns all left rows plus matching right rows, NULL-filling when there's no match; a right join is the mirror; a full outer join keeps unmatched rows from both. A left join with `WHERE right.key IS NULL` is the anti-join pattern, and predicates on the optional side belong in the ON clause to avoid turning it into an inner join."

---

## 3. Cross joins

**In one sentence:** a cross join returns **every combination** of rows from the two tables — the **Cartesian product** — with no matching condition.

### In plain words
A T-shirt shop with sizes {S, M} and colors {red, blue}. A cross join lists every product variant: S-red, S-blue, M-red, M-blue. 2 × 2 = 4 rows.

### How it works
```sql
SELECT s.size, c.color
FROM sizes s
CROSS JOIN colors c;
```
| size | color |
|---|---|
| S | red |
| S | blue |
| M | red |
| M | blue |

- Result size = rows(A) × rows(B). 10,000 × 10,000 = 100 million rows — dangerous by accident!
- Old syntax `FROM a, b` with a forgotten `WHERE` creates an accidental cross join.
- Legit uses: generating combinations (product variants, calendar × employees for a schedule grid), pairing every row with a single-row table of constants.

### Modern C++ example
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <string>
#include <vector>

int main() {
    const std::vector<std::string> sizes{"S", "M"};
    const std::vector<std::string> colors{"red", "blue"};

    int rows = 0;
    for (const auto& s : sizes)            // every row of A...
        for (const auto& c : colors) {     // ...with every row of B
            std::cout << s << '-' << c << '\n';
            ++rows;
        }
    std::cout << rows << " rows = " << sizes.size() << " x " << colors.size() << '\n';
}
```

**Output:**
```text
S-red
S-blue
M-red
M-blue
4 rows = 2 x 2
```

### Interview answer
"A cross join produces the Cartesian product, |A|×|B| rows, with no join predicate. It's useful for generating combinations but is usually a bug when it happens implicitly through a missing join condition."

---

## 4. How databases execute joins

The query planner picks an algorithm based on table sizes, indexes and sort order (see it with `EXPLAIN`):
| Algorithm | How | Best when | Cost |
|---|---|---|---|
| **Nested loop** | For each row of A, scan B (or use an **index** on B) | A is small, B has an index on the join key | O(n·m), or O(n log m) with index |
| **Hash join** | Build a hash table on the smaller input, probe with the other | Large unsorted inputs, equality joins | O(n + m), needs memory |
| **Merge join** | Sort both on the key, walk them together | Inputs already sorted/indexed | O(n log n + m log m), O(n + m) if sorted |

**Tip:** index your foreign-key columns (`orders.customer_id`) — it makes nested-loop joins fast. See [Indexing](./Indexing.md).

---

## Cheat sheet

| Join | Returns | Unmatched rows |
|---|---|---|
| INNER | Matching pairs only | Dropped |
| LEFT OUTER | All left rows + matches | Right side NULL |
| RIGHT OUTER | All right rows + matches | Left side NULL |
| FULL OUTER | All rows from both | Missing side NULL |
| CROSS | Every combination (|A|×|B|) | N/A — no condition |

Anti-join: `LEFT JOIN ... WHERE right.key IS NULL`. Put optional-side filters in `ON`, not `WHERE`.
