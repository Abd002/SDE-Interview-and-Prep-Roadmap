# Database Constraints — Primary Key, Foreign Key, Unique, Check and Default

> **What you'll learn:** what constraints are and why they're your database's "bodyguards", then each of the five in detail — **primary key, foreign key, unique, check, default** — with SQL and a C++ model that enforces the same rule.
>
> **Prerequisites:** [CREATE TABLE](./SQL-DDL-DCL-TCL.md#1-create-statement), [INSERT](./SQL-DML.md#2-insert-statement).

## Table of Contents
0. [What is a constraint?](#0-what-is-a-constraint)
1. [Primary key](#1-primary-key)
2. [Foreign key](#2-foreign-key)
3. [Unique constraint](#3-unique-constraint)
4. [Check constraint](#4-check-constraint)
5. [Default constraint](#5-default-constraint)
6. [Cheat sheet](#cheat-sheet)

---

## 0. What is a constraint?

**In one sentence:** a constraint is a rule declared on a table that the database **enforces on every insert and update**, rejecting any change that would break it.

### In plain words
A form at the bank with rules printed on it: "Account number: required and unique", "Age: must be 18 or more", "Country: if empty, we'll write 'US'". The clerk refuses any form that breaks the rules. Constraints are those rules, and the database is a clerk that **never gets tired or forgets**.

### Why use constraints instead of checking in application code?
- **Every** writer is checked — your app, a script, a data migration, a colleague in a SQL console.
- They're **race-free**: two concurrent requests can't both insert the same email; app-level "check first" logic can race.
- They document the data model.
- The optimizer can use them (e.g. unique → at most one row).

Application validation is still useful for friendly error messages — but the database constraint is the final safety net.

---

## 1. Primary key

**In one sentence:** a primary key is the column (or set of columns) that **uniquely identifies each row**; it must be unique and never NULL, and a table has at most one.

### In plain words
Your national ID number: no two people share it, everyone has one, and it's how every government office finds *you* — even if you change your name or address.

### How it works
```sql
CREATE TABLE users (
    id    BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,   -- auto-increment (PostgreSQL); MySQL: AUTO_INCREMENT
    email TEXT NOT NULL
);

CREATE TABLE enrollments (                                   -- composite primary key
    student_id INT,
    course_id  INT,
    PRIMARY KEY (student_id, course_id)
);
```
- Primary key = **UNIQUE + NOT NULL**, and the database automatically creates an index for it (in MySQL InnoDB and SQL Server by default, the table is physically stored in primary-key order — a *clustered index*).
- **Natural key** (real-world value like email, ISBN) vs. **surrogate key** (meaningless generated ID like `id` or a UUID). Surrogate keys are usually preferred: natural values change (people change emails).
- Auto-increment IDs are compact and ordered; **UUIDs** are globally unique (good for distributed systems) but bigger and random (UUIDv7 is time-ordered, which helps index locality).

### Modern C++ example
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <optional>
#include <stdexcept>
#include <string>

class UsersTable {
public:
    // id is generated (surrogate key); callers can't choose it
    long insert(const std::string& email) {
        long id = next_id_++;
        rows_.emplace(id, email);
        return id;
    }
    // Inserting with an explicit key must respect uniqueness and NOT NULL
    void insert_with_id(std::optional<long> id, const std::string& email) {
        if (!id) throw std::runtime_error("null value in column \"id\" violates not-null constraint");
        if (!rows_.emplace(*id, email).second)
            throw std::runtime_error("duplicate key value violates unique constraint \"users_pkey\"");
    }
    const std::string& find(long id) const { return rows_.at(id); }   // O(log n) via the key index
private:
    std::map<long, std::string> rows_;     // ordered by primary key, like a clustered index
    long next_id_ = 1;
};

int main() {
    UsersTable users;
    long ana = users.insert("ana@example.com");
    users.insert("ben@example.com");
    std::cout << "user " << ana << " = " << users.find(ana) << '\n';
    for (auto bad : {std::optional<long>{1}, std::optional<long>{}}) {
        try { users.insert_with_id(bad, "x@example.com"); }
        catch (const std::exception& e) { std::cout << "ERROR: " << e.what() << '\n'; }
    }
}
```

**Output:**
```text
user 1 = ana@example.com
ERROR: duplicate key value violates unique constraint "users_pkey"
ERROR: null value in column "id" violates not-null constraint
```

### Interview answer
"A primary key uniquely identifies rows: it's unique and not null, one per table, possibly composite, and automatically indexed — often clustered. I usually prefer immutable surrogate keys (identity or UUIDv7) over natural keys that can change."

---

## 2. Foreign key

**In one sentence:** a foreign key is a column that **must match a primary (or unique) key in another table**, guaranteeing that references always point to something that exists (**referential integrity**).

### In plain words
Every order form has a "customer number" box. The foreign key rule says: **you can only write a customer number that actually exists** in the customer book. And you can't tear a customer's page out of the book while orders still point to them — unless you've decided what should happen to those orders.

### How it works
```sql
CREATE TABLE orders (
    id          INT PRIMARY KEY,
    customer_id INT NOT NULL
        REFERENCES customers(id)
        ON DELETE RESTRICT          -- default-ish: refuse to delete a customer who has orders
        ON UPDATE CASCADE           -- if customers.id changes, update orders too
);
```
Actions when the **parent** row is deleted/updated:
| Action | Effect on child rows |
|---|---|
| `RESTRICT` / `NO ACTION` (default) | Refuse the parent delete/update |
| `CASCADE` | Delete/update the children too (deleting a user deletes their comments) |
| `SET NULL` | Set the child's foreign key to NULL |
| `SET DEFAULT` | Set it to the column's default |

Notes:
- **Index your foreign key columns** (`CREATE INDEX ON orders(customer_id)`) — joins and parent deletes need it; PostgreSQL doesn't create it automatically.
- A self-referencing FK models hierarchies: `employees.manager_id REFERENCES employees(id)`.
- Some high-scale systems drop FKs for write speed or sharding and enforce integrity in the app — a conscious trade-off.

### Modern C++ example — enforcing a foreign key with RESTRICT and CASCADE
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <set>
#include <stdexcept>
#include <string>

enum class OnDelete { Restrict, Cascade };

class Shop {
public:
    std::set<int> customers{1, 2};
    std::map<int, int> orders;          // order_id -> customer_id (the foreign key)
    OnDelete policy = OnDelete::Restrict;

    void insert_order(int order_id, int customer_id) {
        if (!customers.contains(customer_id))
            throw std::runtime_error("insert violates foreign key: customer " +
                                     std::to_string(customer_id) + " does not exist");
        orders[order_id] = customer_id;
    }
    void delete_customer(int id) {
        bool has_children = false;
        for (auto& [oid, cid] : orders) has_children = has_children || cid == id;
        if (has_children && policy == OnDelete::Restrict)
            throw std::runtime_error("delete violates foreign key: orders still reference customer " + std::to_string(id));
        std::erase_if(orders, [id](const auto& kv) { return kv.second == id; });   // CASCADE
        customers.erase(id);
    }
};

int main() {
    Shop shop;
    shop.insert_order(100, 1);
    try { shop.insert_order(101, 42); }
    catch (const std::exception& e) { std::cout << "ERROR: " << e.what() << '\n'; }

    try { shop.delete_customer(1); }
    catch (const std::exception& e) { std::cout << "ERROR: " << e.what() << '\n'; }

    shop.policy = OnDelete::Cascade;
    shop.delete_customer(1);
    std::cout << "after ON DELETE CASCADE: customers=" << shop.customers.size()
              << " orders=" << shop.orders.size() << '\n';
}
```

**Output:**
```text
ERROR: insert violates foreign key: customer 42 does not exist
ERROR: delete violates foreign key: orders still reference customer 1
after ON DELETE CASCADE: customers=1 orders=0
```

### Interview answer
"A foreign key requires values in the child column to exist in the referenced parent key, enforcing referential integrity on inserts, updates and parent deletes. Referential actions — RESTRICT, CASCADE, SET NULL, SET DEFAULT — define what happens to children. FK columns should be indexed; some large-scale systems relax FKs for sharding and enforce integrity in application code."

---

## 3. Unique constraint

**In one sentence:** a unique constraint guarantees that no two rows have the same value in a column (or combination of columns).

### In plain words
Two people can't register with the same email or the same username. Unlike the primary key, a table can have **many** unique constraints, and a unique column may be NULL (because "unknown" isn't equal to anything).

### How it works
```sql
CREATE TABLE users (
    id       BIGINT PRIMARY KEY,
    email    TEXT UNIQUE,                       -- column-level
    username TEXT NOT NULL,
    team_id  INT,
    CONSTRAINT uq_team_username UNIQUE (team_id, username)   -- combination must be unique
);

-- Case-insensitive uniqueness (PostgreSQL): a unique index on an expression
CREATE UNIQUE INDEX uq_users_email_lower ON users (LOWER(email));

-- Partial uniqueness: only one ACTIVE subscription per user
CREATE UNIQUE INDEX one_active_sub ON subscriptions(user_id) WHERE status = 'active';
```
| | Primary key | Unique |
|---|---|---|
| How many per table | One | Many |
| NULLs | Not allowed | Allowed (usually multiple NULLs are OK; SQL Server allows only one; PostgreSQL 15 has `NULLS NOT DISTINCT`) |
| Purpose | Row identity | Business rule (email, username) |
| Index | Created automatically | Created automatically |

Unique constraints are what make [UPSERT](./SQL-DML.md#7-upsert-operations) and race-free "register if not taken" possible.

### Modern C++ example — unique email (case-insensitive) and NULL handling
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <cctype>
#include <iostream>
#include <optional>
#include <set>
#include <stdexcept>
#include <string>

std::string lower(std::string s) {
    std::ranges::transform(s, s.begin(), [](unsigned char c) { return std::tolower(c); });
    return s;
}

class Users {
public:
    void insert(std::optional<std::string> email) {
        if (!email) { ++rows_; return; }                           // NULLs never conflict
        if (!emails_.insert(lower(*email)).second)                 // UNIQUE (LOWER(email))
            throw std::runtime_error("duplicate key value violates unique constraint \"uq_users_email_lower\"");
        ++rows_;
    }
    int rows() const { return rows_; }
private:
    std::set<std::string> emails_;                                 // the unique index
    int rows_ = 0;
};

int main() {
    Users users;
    users.insert("Ana@Example.com");
    users.insert(std::nullopt);
    users.insert(std::nullopt);                                    // two NULLs: allowed
    try { users.insert("ana@example.COM"); }
    catch (const std::exception& e) { std::cout << "ERROR: " << e.what() << '\n'; }
    std::cout << "rows: " << users.rows() << '\n';
}
```

**Output:**
```text
ERROR: duplicate key value violates unique constraint "uq_users_email_lower"
rows: 3
```

### Interview answer
"A unique constraint prevents duplicate values in a column or column combination and is backed by a unique index. Unlike a primary key there can be several per table and they usually allow NULLs. Expression and partial unique indexes handle case-insensitive or conditional uniqueness, and unique constraints are what make upserts and race-free registration work."

---

## 4. Check constraint

**In one sentence:** a check constraint is a custom **true/false rule** on a row's values that every insert and update must satisfy.

### In plain words
"Price can't be negative." "End date must be after start date." "Status must be one of: pending, paid, shipped." The clerk checks the rule on each form; a form that breaks it is rejected.

### How it works
```sql
CREATE TABLE products (
    id       INT PRIMARY KEY,
    price    NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    discount NUMERIC(3,2)  CHECK (discount BETWEEN 0 AND 1),
    status   TEXT NOT NULL CHECK (status IN ('draft', 'active', 'retired'))
);

CREATE TABLE bookings (
    starts_on DATE NOT NULL,
    ends_on   DATE NOT NULL,
    CONSTRAINT valid_range CHECK (ends_on > starts_on)       -- multi-column rule
);
```
- A check passes if the expression is TRUE **or NULL** (unknown) — combine with `NOT NULL` when needed.
- Checks see only the **current row**; rules across rows/tables ("total stock of all warehouses ≥ 0") need triggers or application logic.
- `NOT NULL` is itself a special, very common constraint.
- MySQL ignored CHECK constraints before 8.0.16 — be aware on old versions.

### Modern C++ example — a row validator
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <functional>
#include <iostream>
#include <set>
#include <stdexcept>
#include <string>
#include <vector>

struct Product { int id; double price; double discount; std::string status; };

struct Check { std::string name; std::function<bool(const Product&)> rule; };

const std::vector<Check> checks{
    {"price_non_negative", [](const Product& p) { return p.price >= 0; }},
    {"discount_range",     [](const Product& p) { return p.discount >= 0 && p.discount <= 1; }},
    {"status_valid",       [](const Product& p) {
         static const std::set<std::string> ok{"draft", "active", "retired"};
         return ok.contains(p.status); }},
};

void insert(std::vector<Product>& table, const Product& p) {
    for (const auto& c : checks)
        if (!c.rule(p)) throw std::runtime_error("new row violates check constraint \"" + c.name + "\"");
    table.push_back(p);
}

int main() {
    std::vector<Product> products;
    for (const auto& p : {Product{1, 9.99, 0.1, "active"}, Product{2, -5, 0, "active"},
                          Product{3, 5, 1.5, "draft"}, Product{4, 5, 0, "deleted"}}) {
        try { insert(products, p); std::cout << "product " << p.id << ": inserted\n"; }
        catch (const std::exception& e) { std::cout << "product " << p.id << ": ERROR " << e.what() << '\n'; }
    }
}
```

**Output:**
```text
product 1: inserted
product 2: ERROR new row violates check constraint "price_non_negative"
product 3: ERROR new row violates check constraint "discount_range"
product 4: ERROR new row violates check constraint "status_valid"
```

### Interview answer
"A CHECK constraint enforces a boolean condition on each row during inserts and updates; it passes when the expression is true or unknown, so it's often combined with NOT NULL. It's limited to the current row — cross-row or cross-table rules need triggers, exclusion constraints or application logic."

---

## 5. Default constraint

**In one sentence:** a default constraint supplies a value for a column **when an INSERT doesn't provide one**.

### In plain words
A form where "Country" is pre-filled with "US" and "Created on" with today's date. If you leave the box empty, the pre-filled value is used; you can still write something else.

### How it works
```sql
CREATE TABLE orders (
    id         INT PRIMARY KEY,
    status     TEXT      NOT NULL DEFAULT 'pending',
    quantity   INT       NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,   -- evaluated at insert time
    public_id  UUID      DEFAULT gen_random_uuid()             -- PostgreSQL 13+
);

INSERT INTO orders (id) VALUES (1);                           -- status='pending', quantity=1, created_at=now
INSERT INTO orders (id, status) VALUES (2, 'paid');           -- explicit value wins
INSERT INTO orders (id, status) VALUES (3, DEFAULT);          -- ask for the default explicitly
INSERT INTO orders (id, status) VALUES (4, NULL);             -- ERROR: explicit NULL is NOT "missing"!
```
- The default applies only when the column is **omitted** (or `DEFAULT` is written) — an explicit `NULL` is stored as NULL (or rejected by `NOT NULL`).
- Defaults also fill existing rows when you `ALTER TABLE ... ADD COLUMN ... DEFAULT ...`.
- Useful for timestamps, status flags, counters, generated IDs.

### Modern C++ example — defaults vs. explicit NULL
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <optional>
#include <stdexcept>
#include <string>

struct Order { int id; std::string status; int quantity; };

// A column value in an INSERT can be: omitted (use DEFAULT), NULL, or a value.
template <class T> using Col = std::optional<std::optional<T>>;   // outer: provided? inner: NULL?

Order insert(int id, Col<std::string> status = std::nullopt, Col<int> quantity = std::nullopt) {
    auto resolve = [](auto col, auto def, const char* name) {
        if (!col) return def;                                     // omitted -> DEFAULT
        if (!*col) throw std::runtime_error(std::string("null value in column \"") + name +
                                            "\" violates not-null constraint");
        return **col;                                             // explicit value wins
    };
    return {id, resolve(status, std::string("pending"), "status"), resolve(quantity, 1, "quantity")};
}

int main() {
    auto print = [](const Order& o) {
        std::cout << "order " << o.id << ": status=" << o.status << " quantity=" << o.quantity << '\n';
    };
    print(insert(1));                                             // both defaults
    print(insert(2, std::optional<std::string>("paid")));         // explicit status
    try { insert(4, std::optional<std::string>(std::nullopt)); }  // explicit NULL
    catch (const std::exception& e) { std::cout << "order 4: ERROR " << e.what() << '\n'; }
}
```

**Output:**
```text
order 1: status=pending quantity=1
order 2: status=paid quantity=1
order 4: ERROR null value in column "status" violates not-null constraint
```

### Interview answer
"A DEFAULT supplies a column value when an INSERT omits it or specifies DEFAULT; it can be a constant or an expression evaluated at insert time, like CURRENT_TIMESTAMP. An explicit NULL is not the same as omitting the column, so defaults are typically paired with NOT NULL."

---

## Cheat sheet

| Constraint | Guarantees | Per table | NULL? | Index created |
|---|---|---|---|---|
| PRIMARY KEY | Unique row identity | 1 | No | Yes (often clustered) |
| FOREIGN KEY | Value exists in parent table | Many | Allowed unless NOT NULL | No (add one yourself!) |
| UNIQUE | No duplicates | Many | Usually allowed | Yes |
| CHECK | Row satisfies a condition | Many | NULL passes | No |
| DEFAULT | Value when omitted | 1 per column | — | No |
| NOT NULL | Value is present | 1 per column | No | No |
