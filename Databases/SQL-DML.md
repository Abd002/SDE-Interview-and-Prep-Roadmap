# SQL Data Manipulation Language (DML) — Explained for Beginners

> **What you'll learn:** the statements that **read and change data** — `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `MERGE`, `TRUNCATE`, **UPSERT** — plus **explicit vs. implicit transactions** and **control-of-flow** (`CASE`, `IF-ELSE`). Each has the SQL, its result, and a C++ model of what the database does.
>
> **Prerequisites:** know what a table is. The other SQL families are in [DDL, DCL & TCL](./SQL-DDL-DCL-TCL.md) and [DQL (queries)](./SQL-DQL.md).
>
> SQL here works in PostgreSQL and SQLite unless marked otherwise. Try it online at any "SQL fiddle" site, or with `sqlite3` on your machine.

## Table of Contents
0. [The SQL families at a glance](#0-the-sql-families-at-a-glance)
1. [SELECT statement](#1-select-statement)
2. [INSERT statement](#2-insert-statement)
3. [UPDATE statement](#3-update-statement)
4. [DELETE statement](#4-delete-statement)
5. [MERGE statement](#5-merge-statement)
6. [TRUNCATE statement](#6-truncate-statement)
7. [UPSERT operations](#7-upsert-operations)
8. [Explicit vs. Implicit transactions](#8-explicit-vs-implicit-transactions)
9. [Control-of-flow language (CASE, IF-ELSE)](#9-control-of-flow-language-case-if-else)
10. [Cheat sheet](#cheat-sheet)

Example table used throughout:
```sql
CREATE TABLE products (
    id    INTEGER PRIMARY KEY,
    name  TEXT    NOT NULL,
    price REAL    NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0
);
```

---

## 0. The SQL families at a glance

**In one sentence:** SQL commands are grouped by purpose: **DDL** defines structure, **DML** changes data, **DQL** queries data, **DCL** controls permissions, and **TCL** controls transactions.

| Family | Stands for | Commands | Analogy |
|---|---|---|---|
| DDL | Data Definition Language | CREATE, ALTER, DROP | Building the filing cabinet |
| **DML** | **Data Manipulation Language** | INSERT, UPDATE, DELETE, MERGE (and SELECT in many books) | Putting papers in / changing / removing them |
| DQL | Data Query Language | SELECT | Looking things up |
| DCL | Data Control Language | GRANT, REVOKE | Who gets a key to the cabinet |
| TCL | Transaction Control Language | COMMIT, ROLLBACK, SAVEPOINT | "Save" / "Undo" for a batch of changes |

---

## 1. SELECT statement

**In one sentence:** `SELECT` reads rows from tables, choosing **which columns** to show, **which rows** to keep, and **in what order**.

### In plain words
It's asking a librarian: "Show me the **title and price** (columns) of books **under $10** (filter), **most expensive first** (order)." The librarian never changes the books — `SELECT` only reads.

### How it works
```sql
SELECT name, price           -- which columns (* = all)
FROM products                -- which table
WHERE price < 10             -- which rows (filter)
ORDER BY price DESC          -- sort
LIMIT 10;                    -- at most 10 rows (SQL Server: TOP 10; standard: FETCH FIRST 10 ROWS ONLY)
```
| name | price |
|---|---|
| notebook | 4.00 |
| pen | 1.50 |

Logical order in which the database *evaluates* the clauses (not the order you write them):
`FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT`.
That's why you can't use a `SELECT` alias inside `WHERE`.

More advanced querying (subqueries, aggregates, GROUP BY, window functions) is in [DQL](./SQL-DQL.md).

### Modern C++ example — SELECT as filter + sort + project
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <format>
#include <iostream>
#include <string>
#include <vector>

struct Product { int id; std::string name; double price; int stock; };

int main() {
    const std::vector<Product> products{{1, "pen", 1.50, 100}, {2, "notebook", 4.00, 20},
                                        {3, "backpack", 35.00, 0}};

    // FROM products WHERE price < 10
    std::vector<Product> result;
    std::ranges::copy_if(products, std::back_inserter(result), [](const Product& p) { return p.price < 10; });
    // ORDER BY price DESC
    std::ranges::sort(result, std::greater<>{}, &Product::price);
    // SELECT name, price
    for (const auto& p : result) std::cout << std::format("{:<9} {:.2f}\n", p.name, p.price);
}
```

**Output:**
```text
notebook  4.00
pen       1.50
```

### Interview answer
"SELECT retrieves data: FROM chooses the source, WHERE filters rows, SELECT projects columns, ORDER BY sorts and LIMIT restricts the count. Logically the engine evaluates FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, then LIMIT."

---

## 2. INSERT statement

**In one sentence:** `INSERT` adds new rows to a table.

### In plain words
Filling out a new index card and putting it in the drawer.

### How it works
```sql
-- One row, naming the columns (always name them: safer if the table changes)
INSERT INTO products (id, name, price, stock) VALUES (1, 'pen', 1.50, 100);

-- Several rows at once (much faster than many single inserts)
INSERT INTO products (id, name, price, stock)
VALUES (2, 'notebook', 4.00, 20),
       (3, 'backpack', 35.00, 0);

-- Missing columns get their DEFAULT (stock = 0 here)
INSERT INTO products (id, name, price) VALUES (5, 'eraser', 0.80);

-- Copy rows from a query
INSERT INTO archived_products (id, name) SELECT id, name FROM products WHERE stock = 0;

-- Get back generated values (PostgreSQL, SQLite 3.35+)
INSERT INTO products (name, price) VALUES ('ruler', 2.00) RETURNING id;
```
The insert **fails** if it violates a constraint (duplicate primary key, NOT NULL, CHECK, foreign key) — see [Constraints](./Constraints.md).

### Modern C++ example — INSERT with a primary key and default values
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <optional>
#include <stdexcept>
#include <string>

struct Product { std::string name; double price; int stock; };

class ProductsTable {
public:
    void insert(int id, std::string name, double price, std::optional<int> stock = std::nullopt) {
        if (rows_.contains(id))
            throw std::runtime_error("duplicate key value violates PRIMARY KEY (id=" + std::to_string(id) + ")");
        rows_.emplace(id, Product{std::move(name), price, stock.value_or(0)});   // DEFAULT 0
    }
    std::size_t count() const { return rows_.size(); }
    const Product& at(int id) const { return rows_.at(id); }
private:
    std::map<int, Product> rows_;      // primary key -> row
};

int main() {
    ProductsTable products;
    products.insert(1, "pen", 1.50, 100);
    products.insert(5, "eraser", 0.80);                          // stock uses DEFAULT
    std::cout << "rows: " << products.count() << ", eraser stock: " << products.at(5).stock << '\n';
    try {
        products.insert(1, "another pen", 2.00, 1);
    } catch (const std::exception& e) {
        std::cout << "ERROR: " << e.what() << '\n';
    }
}
```

**Output:**
```text
rows: 2, eraser stock: 0
ERROR: duplicate key value violates PRIMARY KEY (id=1)
```

### Interview answer
"INSERT adds rows, either from a VALUES list or from a SELECT. Unspecified columns get defaults, constraints are checked on every row, and multi-row inserts or bulk-load commands are much faster than row-by-row inserts."

---

## 3. UPDATE statement

**In one sentence:** `UPDATE` changes values in existing rows that match a condition.

### In plain words
Crossing out a price on a card and writing the new one — on **every card that matches your description**. Forget the description (`WHERE`) and you change *every card in the drawer*.

### How it works
```sql
UPDATE products
SET price = price * 1.10          -- new value, can use the old value
WHERE name = 'notebook';           -- WHICH rows (omit = ALL rows!)
```
| id | name | price (before → after) |
|---|---|---|
| 2 | notebook | 4.00 → 4.40 |

- Several columns: `SET price = 5, stock = stock - 1`.
- Update using another table (PostgreSQL): `UPDATE products p SET price = n.price FROM new_prices n WHERE p.id = n.id;`
- The database reports "N rows affected" — check it in application code.

### Modern C++ example
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <functional>
#include <iostream>
#include <string>
#include <vector>

struct Product { int id; std::string name; double price; int stock; };

// UPDATE products SET <change> WHERE <condition>; returns "rows affected"
int update(std::vector<Product>& table,
           const std::function<bool(const Product&)>& where,
           const std::function<void(Product&)>& set) {
    int affected = 0;
    for (auto& row : table)
        if (where(row)) { set(row); ++affected; }
    return affected;
}

int main() {
    std::vector<Product> products{{1, "pen", 1.50, 100}, {2, "notebook", 4.00, 20}, {3, "backpack", 35.00, 0}};

    int n = update(products, [](const Product& p) { return p.name == "notebook"; },
                             [](Product& p) { p.price *= 1.10; });
    std::cout << n << " row(s) updated; notebook now costs " << products[1].price << '\n';

    // Forgetting the WHERE clause = condition that is always true:
    n = update(products, [](const Product&) { return true; }, [](Product& p) { p.stock = 0; });
    std::cout << "oops: " << n << " row(s) updated (every product is now out of stock)\n";
}
```

**Output:**
```text
1 row(s) updated; notebook now costs 4.4
oops: 3 row(s) updated (every product is now out of stock)
```

### Common mistakes
- Running `UPDATE` without `WHERE`. Habit: write the `WHERE` first, test it as a `SELECT`, and run updates inside a transaction so you can `ROLLBACK`.

### Interview answer
"UPDATE modifies columns of rows matching the WHERE clause, can reference current values and other tables, and returns the number of affected rows. Without WHERE it updates every row, so I test the predicate with SELECT first and run it inside a transaction."

---

## 4. DELETE statement

**In one sentence:** `DELETE` removes rows that match a condition.

### In plain words
Pulling matching cards out of the drawer and shredding them. Without a description (`WHERE`), you shred all of them.

### How it works
```sql
DELETE FROM products WHERE stock = 0;       -- removes 'backpack'
DELETE FROM products;                       -- removes EVERY row (table structure stays)
```
- Each deleted row is logged individually (so it can be rolled back) and fires `DELETE` triggers.
- Foreign keys may **block** the delete, or **cascade** it to child rows (`ON DELETE CASCADE`) — see [Constraints](./Constraints.md).
- Many apps use **soft delete** instead: `UPDATE ... SET deleted_at = now()` to keep history.

### Modern C++ example
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <string>
#include <vector>

struct Product { int id; std::string name; int stock; };

int main() {
    std::vector<Product> products{{1, "pen", 100}, {2, "notebook", 20}, {3, "backpack", 0}};

    // DELETE FROM products WHERE stock = 0;
    auto removed = std::erase_if(products, [](const Product& p) { return p.stock == 0; });
    std::cout << removed << " row(s) deleted; remaining:";
    for (const auto& p : products) std::cout << ' ' << p.name;
    std::cout << '\n';
}
```

**Output:**
```text
1 row(s) deleted; remaining: pen notebook
```

### Interview answer
"DELETE removes rows matching a predicate, logging each row, firing triggers and honoring foreign-key actions, so it's transactional and can be rolled back. For removing all rows quickly, TRUNCATE is cheaper; for auditability, soft deletes are common."

---

## 5. MERGE statement

**In one sentence:** `MERGE` compares a **source** (new data) with a **target** table and, in one statement, **updates** rows that match, **inserts** rows that don't, and optionally **deletes** some.

### In plain words
You receive the supplier's new price list and reconcile it with your catalog:
- product already in the catalog → **update** its price,
- new product → **insert** it,
- (optionally) product discontinued → **delete** it.
`MERGE` does all of that in one pass.

### How it works
Standard SQL (SQL Server, Oracle, PostgreSQL 15+, Snowflake…):
```sql
MERGE INTO products AS t
USING supplier_feed AS s
   ON t.id = s.id
WHEN MATCHED AND s.discontinued THEN
    DELETE
WHEN MATCHED THEN
    UPDATE SET price = s.price, stock = s.stock
WHEN NOT MATCHED THEN
    INSERT (id, name, price, stock) VALUES (s.id, s.name, s.price, s.stock);
```
- Common in data warehousing / ETL ("sync this staging table into the main table").
- MySQL and SQLite don't have `MERGE`; use UPSERT syntax instead (next sections).
- Under concurrency, `MERGE` can still race (two sessions inserting the same new key) — you may need locking or retries.

### Modern C++ example
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <string>
#include <vector>

struct Product { std::string name; double price; int stock; };
struct FeedRow { int id; std::string name; double price; int stock; bool discontinued; };

int main() {
    std::map<int, Product> target{{1, {"pen", 1.50, 100}}, {2, {"notebook", 4.00, 20}}, {3, {"backpack", 35.0, 0}}};
    std::vector<FeedRow> source{
        {1, "pen", 1.60, 80, false},        // matched      -> UPDATE
        {3, "backpack", 0, 0, true},        // matched + discontinued -> DELETE
        {4, "ruler", 2.00, 10, false},      // not matched  -> INSERT
    };

    int updated = 0, inserted = 0, deleted = 0;
    for (const auto& s : source) {
        auto it = target.find(s.id);                               // ON t.id = s.id
        if (it != target.end() && s.discontinued) { target.erase(it); ++deleted; }
        else if (it != target.end()) { it->second.price = s.price; it->second.stock = s.stock; ++updated; }
        else { target.emplace(s.id, Product{s.name, s.price, s.stock}); ++inserted; }
    }
    std::cout << "updated " << updated << ", inserted " << inserted << ", deleted " << deleted << '\n';
    for (const auto& [id, p] : target) std::cout << "  " << id << ' ' << p.name << ' ' << p.price << '\n';
}
```

**Output:**
```text
updated 1, inserted 1, deleted 1
  1 pen 1.6
  2 notebook 4
  4 ruler 2
```

### Interview answer
"MERGE synchronizes a target table with a source in one statement, with WHEN MATCHED clauses to update or delete and WHEN NOT MATCHED to insert. It's standard in SQL Server, Oracle and PostgreSQL 15+, and widely used in ETL; under concurrency it may still need locking or retry logic."

---

## 6. TRUNCATE statement

**In one sentence:** `TRUNCATE` instantly removes **all** rows from a table by deallocating its storage, instead of deleting rows one by one.

### In plain words
`DELETE FROM table` is shredding every card one at a time (and writing each shredding in a logbook). `TRUNCATE` is throwing away the whole drawer and putting in an empty one.

### How it works
```sql
TRUNCATE TABLE staging_orders;                      -- PostgreSQL, MySQL, SQL Server, Oracle
TRUNCATE TABLE staging_orders RESTART IDENTITY;     -- PostgreSQL: also reset auto-increment
-- SQLite has no TRUNCATE; "DELETE FROM t;" is optimized into a truncate internally.
```
| | DELETE (no WHERE) | TRUNCATE |
|---|---|---|
| Speed on big tables | Slow (row by row) | Very fast (drops data pages) |
| WHERE clause | Yes | No — always everything |
| Triggers | Fires DELETE triggers | Does not fire row triggers |
| Rollback | Yes | PostgreSQL & SQL Server: yes inside a transaction; **MySQL/Oracle: no (implicit commit, it's DDL)** |
| Auto-increment counter | Kept | Usually reset |
| Foreign keys referencing it | Checked per row | Usually refused (PostgreSQL: `TRUNCATE ... CASCADE`) |
| Classified as | DML | Often DDL |

### Modern C++ example — why TRUNCATE is fast
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <string>
#include <vector>

struct Table {
    std::vector<std::string> rows;
    std::vector<std::string> undo_log;       // DELETE records every removed row
    long next_id = 1;
};

void delete_all(Table& t) {                  // DELETE FROM t;
    for (auto& r : t.rows) t.undo_log.push_back(r);   // O(n) logging, one row at a time
    t.rows.clear();
}
void truncate(Table& t) {                    // TRUNCATE TABLE t RESTART IDENTITY;
    std::vector<std::string>().swap(t.rows); // just drop the storage: O(1) bookkeeping
    t.next_id = 1;                           // counter reset
}

int main() {
    Table a{std::vector<std::string>(100'000, "row"), {}, 100'001};
    Table b = a;
    delete_all(a);
    truncate(b);
    std::cout << "DELETE:   rows=" << a.rows.size() << " log entries=" << a.undo_log.size()
              << " next_id=" << a.next_id << '\n';
    std::cout << "TRUNCATE: rows=" << b.rows.size() << " log entries=" << b.undo_log.size()
              << " next_id=" << b.next_id << '\n';
}
```

**Output:**
```text
DELETE:   rows=0 log entries=100000 next_id=100001
TRUNCATE: rows=0 log entries=0 next_id=1
```

### Interview answer
"TRUNCATE removes all rows by deallocating data pages with minimal logging, so it's much faster than DELETE, but it has no WHERE clause, doesn't fire row triggers, typically resets identity counters, is blocked by referencing foreign keys, and in some databases such as MySQL and Oracle it's DDL that commits implicitly."

---

## 7. UPSERT operations

**In one sentence:** an **upsert** ("update or insert") inserts a row, or — if a row with the same key already exists — updates it instead, **atomically**.

### In plain words
Updating your contacts: "Save Ana's number. If Ana is already in my contacts, just replace the number; otherwise create a new contact." Doing it as "check, then insert or update" in two steps can go wrong if two people do it at once (both see "not there" and both insert → duplicate key error). Upsert does it as one safe operation.

### How it works
Syntax differs by database:
```sql
-- PostgreSQL & SQLite
INSERT INTO products (id, name, price, stock) VALUES (2, 'notebook', 4.40, 5)
ON CONFLICT (id) DO UPDATE SET stock = products.stock + excluded.stock;  -- 'excluded' = the new row

-- MySQL
INSERT INTO products (id, name, price, stock) VALUES (2, 'notebook', 4.40, 5)
ON DUPLICATE KEY UPDATE stock = stock + VALUES(stock);

-- SQL Server / Oracle / PostgreSQL 15+: use MERGE (section 5)
-- "Insert if missing, otherwise ignore":  ... ON CONFLICT (id) DO NOTHING;
```
Result, starting with notebook stock 20: the row exists, so stock becomes 25. Upserting `(4, 'ruler', 2.00, 10)` inserts a new row.

Requirements: a **unique constraint or primary key** on the conflict column(s) — that's how the database detects the conflict.

### Modern C++ example — upsert in one atomic step
```cpp
// g++ -std=c++20 -pthread main.cpp && ./a.out
#include <iostream>
#include <map>
#include <mutex>
#include <string>
#include <thread>
#include <vector>

struct Product { std::string name; double price; int stock; };

class ProductsTable {
public:
    // INSERT ... ON CONFLICT (id) DO UPDATE SET stock = stock + excluded.stock
    void upsert(int id, const Product& p) {
        std::scoped_lock lock(m_);                    // check + write happen as ONE step
        auto [it, inserted] = rows_.try_emplace(id, p);
        if (!inserted) it->second.stock += p.stock;   // conflict -> update
    }
    int stock(int id) const { std::scoped_lock lock(m_); return rows_.at(id).stock; }
    std::size_t size() const { std::scoped_lock lock(m_); return rows_.size(); }
private:
    mutable std::mutex m_;
    std::map<int, Product> rows_;
};

int main() {
    ProductsTable t;
    t.upsert(2, {"notebook", 4.00, 20});
    t.upsert(2, {"notebook", 4.40, 5});               // exists -> stock 25
    t.upsert(4, {"ruler", 2.00, 10});                 // new -> inserted
    std::cout << "notebook stock: " << t.stock(2) << ", rows: " << t.size() << '\n';

    // 8 concurrent "requests" upserting the same new key: no duplicates, no lost updates
    {
        std::vector<std::jthread> ts;
        for (int i = 0; i < 8; ++i) ts.emplace_back([&] { t.upsert(9, {"stapler", 7.0, 1}); });
    }
    std::cout << "stapler stock after 8 concurrent upserts: " << t.stock(9) << '\n';
}
```

**Output:**
```text
notebook stock: 25, rows: 2
stapler stock after 8 concurrent upserts: 8
```

### Interview answer
"An upsert atomically inserts a row or updates the existing one when a unique key conflicts — `INSERT ... ON CONFLICT DO UPDATE` in PostgreSQL/SQLite, `ON DUPLICATE KEY UPDATE` in MySQL, or MERGE elsewhere. It avoids the race in check-then-insert and requires a unique constraint on the conflict target."

---

## 8. Explicit vs. Implicit transactions

**In one sentence:** in an **implicit** (auto-commit) transaction, each statement is committed on its own automatically; in an **explicit** transaction, you group several statements between `BEGIN` and `COMMIT` so they succeed or fail **together**.

### In plain words
- **Implicit (auto-commit):** every sentence you type in a document is saved the instant you finish it.
- **Explicit:** you write a whole paragraph, then click **Save** (`COMMIT`) — or **Discard** (`ROLLBACK`) if you change your mind. Nobody else sees a half-written paragraph.

### How it works
```sql
-- Implicit / auto-commit (the default in PostgreSQL, MySQL, SQLite, SQL Server):
UPDATE accounts SET balance = balance - 100 WHERE id = 1;   -- committed immediately
UPDATE accounts SET balance = balance + 100 WHERE id = 2;   -- if this fails, the first is already done!

-- Explicit transaction:
BEGIN;                                                      -- START TRANSACTION (MySQL), BEGIN TRAN (SQL Server)
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;                                                     -- both, or (on error) ROLLBACK -> neither
```
- Explicit transactions give **atomicity** for multi-statement work (see [ACID](./ACID.md)).
- Oracle (and SQL Server's `IMPLICIT_TRANSACTIONS ON` mode) works differently: a transaction starts automatically with the first statement and stays open until you `COMMIT` — beware of forgetting it.
- Keep explicit transactions **short**: they hold locks.
- In application code, drivers expose this as `conn.begin()/commit()/rollback()` or an RAII/`with` block.

### Modern C++ example — an RAII transaction that rolls back unless committed
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <stdexcept>

using Accounts = std::map<int, int>;

class Transaction {                                  // explicit transaction
public:
    explicit Transaction(Accounts& db) : db_(db), snapshot_(db) {}   // BEGIN
    void commit() { committed_ = true; }                              // COMMIT
    ~Transaction() { if (!committed_) db_ = snapshot_; }             // otherwise ROLLBACK
private:
    Accounts& db_;
    Accounts snapshot_;
    bool committed_ = false;
};

void withdraw(Accounts& db, int id, int amount) {
    if (db.at(id) < amount) throw std::runtime_error("insufficient funds");
    db[id] -= amount;
}
void deposit(Accounts& db, int id, int amount) {
    if (!db.contains(id)) throw std::runtime_error("no such account");
    db[id] += amount;
}

int main() {
    Accounts db{{1, 500}, {2, 100}};

    // Implicit (auto-commit): each statement stands alone.
    try { withdraw(db, 1, 100); deposit(db, 99, 100); }
    catch (const std::exception& e) { std::cout << "auto-commit error: " << e.what() << '\n'; }
    std::cout << "  -> account 1 = " << db[1] << " (100 vanished!)\n";

    // Explicit: both statements or neither.
    try {
        Transaction tx(db);
        withdraw(db, 1, 100);
        deposit(db, 99, 100);            // throws -> tx destructor rolls back
        tx.commit();
    } catch (const std::exception& e) { std::cout << "explicit tx error: " << e.what() << '\n'; }
    std::cout << "  -> account 1 = " << db[1] << " (rolled back, nothing lost)\n";
}
```

**Output:**
```text
auto-commit error: no such account
  -> account 1 = 400 (100 vanished!)
explicit tx error: no such account
  -> account 1 = 400 (rolled back, nothing lost)
```

### Interview answer
"In auto-commit mode each statement is its own implicit transaction. An explicit transaction groups statements between BEGIN and COMMIT/ROLLBACK so they are atomic and isolated together. Some systems, like Oracle, implicitly open a transaction that must be committed explicitly. Transactions should be short because they hold locks."

---

## 9. Control-of-flow language (CASE, IF-ELSE)

**In one sentence:** control-of-flow lets SQL make decisions: `CASE` chooses a **value** inside a query, while `IF-ELSE` / loops choose which **statements** run inside procedural SQL (stored procedures, scripts).

### In plain words
- `CASE` is like a **label maker** that prints a different label depending on the item: "if stock is 0, label it *sold out*; if under 20, *low*; else *ok*."
- `IF-ELSE` is like a **recipe step**: "if the oven is hot, bake; otherwise preheat first."

### How it works
**CASE** — standard SQL, works in every database, in SELECT/WHERE/ORDER BY/UPDATE:
```sql
SELECT name, stock,
       CASE
           WHEN stock = 0  THEN 'sold out'
           WHEN stock < 20 THEN 'low'
           ELSE 'ok'
       END AS status
FROM products;
```
| name | stock | status |
|---|---|---|
| pen | 100 | ok |
| notebook | 25 | ok |
| ruler | 10 | low |

**IF-ELSE, WHILE** — procedural extensions (syntax varies):
```sql
-- SQL Server (T-SQL)
IF (SELECT stock FROM products WHERE id = 1) = 0
    PRINT 'Reorder pens';
ELSE
    PRINT 'Pens in stock';

-- PostgreSQL (PL/pgSQL), inside a function or DO block
DO $$
BEGIN
    IF (SELECT stock FROM products WHERE id = 1) = 0 THEN
        RAISE NOTICE 'Reorder pens';
    ELSE
        RAISE NOTICE 'Pens in stock';
    END IF;
END $$;
```
Related helpers: `COALESCE(a, b)` (first non-NULL), `NULLIF(a, b)`, MySQL's `IF(cond, a, b)`, SQL Server's `IIF`.

### Modern C++ example — CASE as a value expression
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <format>
#include <iostream>
#include <string>
#include <string_view>
#include <vector>

struct Product { std::string name; int stock; };

// CASE WHEN stock = 0 THEN 'sold out' WHEN stock < 20 THEN 'low' ELSE 'ok' END
constexpr std::string_view status(int stock) {
    if (stock == 0) return "sold out";
    if (stock < 20) return "low";
    return "ok";
}

int main() {
    const std::vector<Product> products{{"pen", 100}, {"notebook", 25}, {"ruler", 10}, {"backpack", 0}};
    for (const auto& p : products)
        std::cout << std::format("{:<9} {:>3}  {}\n", p.name, p.stock, status(p.stock));

    // IF-ELSE as a statement (like a stored procedure step):
    if (products.back().stock == 0) std::cout << "Reorder " << products.back().name << '\n';
    else                            std::cout << products.back().name << " in stock\n";
}
```

**Output:**
```text
pen       100  ok
notebook   25  ok
ruler      10  low
backpack    0  sold out
Reorder backpack
```

### Interview answer
"CASE is a standard SQL expression returning a value based on conditions, usable anywhere an expression is allowed. IF-ELSE, WHILE and similar statements belong to procedural dialects like T-SQL and PL/pgSQL, used in stored procedures and scripts. COALESCE and NULLIF are compact special cases."

---

## Cheat sheet

| Statement | Does | Watch out |
|---|---|---|
| `SELECT` | Read rows | Logical order: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY |
| `INSERT` | Add rows | Name the columns; bulk insert multiple rows |
| `UPDATE` | Change rows | Never forget `WHERE` |
| `DELETE` | Remove rows | Row-by-row, logged, fires triggers |
| `MERGE` | Update/insert/delete by matching a source | Not in MySQL/SQLite |
| `TRUNCATE` | Remove all rows fast | No WHERE; may auto-commit (MySQL/Oracle) |
| UPSERT | Insert or update on key conflict | Needs a unique key; syntax varies |
| Explicit tx | `BEGIN ... COMMIT/ROLLBACK` | Keep it short |
| `CASE` | Conditional value | Standard SQL |
| `IF-ELSE` | Conditional statements | Procedural SQL only |
