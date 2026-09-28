# SQL DDL, DCL and TCL — Structure, Permissions and Transactions

> **What you'll learn:** the SQL commands that **define structure** (DDL: `CREATE`, `ALTER`, `DROP`), **control access** (DCL: `GRANT`, `REVOKE`) and **control transactions** (TCL: `COMMIT`, `ROLLBACK`, plus `SAVEPOINT`). Each comes with SQL and a C++ model of what the database keeps track of.
>
> **Prerequisites:** [SQL DML](./SQL-DML.md) (you know INSERT/UPDATE/SELECT).

## Table of Contents
**Data Definition Language (DDL)**
1. [CREATE statement](#1-create-statement)
2. [ALTER statement](#2-alter-statement)
3. [DROP statement](#3-drop-statement)

**Data Control Language (DCL)**

4. [GRANT statement](#4-grant-statement)
5. [REVOKE statement](#5-revoke-statement)

**Transaction Control (TCL)**

6. [COMMIT statement](#6-commit-statement)
7. [ROLLBACK statement (and SAVEPOINT)](#7-rollback-statement-and-savepoint)
8. [Cheat sheet](#cheat-sheet)

---

## 1. CREATE statement

**In one sentence:** `CREATE` defines a new database object — most often a **table** (its columns, types and rules), but also indexes, views, schemas, users and more.

### In plain words
Before you can store anything, you design the **form**: "every customer card has a number (required, unique), a name (required, text up to 100 letters), and an email (unique)." `CREATE TABLE` is printing that blank form and the drawer to keep the cards in.

### How it works
```sql
CREATE TABLE customers (
    id         INTEGER      PRIMARY KEY,               -- unique row identifier
    name       VARCHAR(100) NOT NULL,                  -- must have a value
    email      VARCHAR(255) UNIQUE,                    -- no duplicates
    country    CHAR(2)      DEFAULT 'US',              -- used when not provided
    created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    CHECK (length(name) > 0)                           -- custom rule
);

CREATE TABLE orders (
    id          INTEGER PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id),   -- foreign key
    total       NUMERIC(10, 2) NOT NULL CHECK (total >= 0)
);

CREATE INDEX idx_orders_customer ON orders(customer_id);     -- speeds up lookups/joins
CREATE VIEW big_orders AS SELECT * FROM orders WHERE total > 100;
CREATE TABLE IF NOT EXISTS logs (msg TEXT);                  -- no error if it already exists
```
Key choices when creating a table:
- **Data types:** `INTEGER`/`BIGINT`, `NUMERIC(p,s)` for money (never `FLOAT`), `VARCHAR(n)`/`TEXT`, `DATE`/`TIMESTAMP`, `BOOLEAN`, `JSON`.
- **Constraints:** primary key, foreign key, unique, not null, check, default — see [Constraints](./Constraints.md).
- **Indexes** for columns you search/join on — see [Indexing](./Indexing.md).

### Modern C++ example — a schema catalog
Databases store table definitions in a **system catalog** (e.g. `information_schema`). Here's a tiny one.

```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <optional>
#include <stdexcept>
#include <string>
#include <vector>

struct Column {
    std::string name, type;
    bool not_null = false, primary_key = false;
    std::optional<std::string> default_value{};
};

class Catalog {
public:
    void create_table(const std::string& name, std::vector<Column> cols, bool if_not_exists = false) {
        if (tables_.contains(name)) {
            if (if_not_exists) return;
            throw std::runtime_error("relation \"" + name + "\" already exists");
        }
        tables_[name] = std::move(cols);
    }
    void describe(const std::string& name) const {
        std::cout << "Table " << name << ":\n";
        for (const auto& c : tables_.at(name))
            std::cout << "  " << c.name << ' ' << c.type << (c.primary_key ? " PRIMARY KEY" : "")
                      << (c.not_null ? " NOT NULL" : "")
                      << (c.default_value ? " DEFAULT " + *c.default_value : "") << '\n';
    }
private:
    std::map<std::string, std::vector<Column>> tables_;
};

int main() {
    Catalog db;
    db.create_table("customers", {
        {.name = "id", .type = "INTEGER", .not_null = true, .primary_key = true},
        {.name = "name", .type = "VARCHAR(100)", .not_null = true},
        {.name = "country", .type = "CHAR(2)", .default_value = "'US'"},
    });
    db.describe("customers");
    db.create_table("customers", {}, /*if_not_exists=*/true);          // silently ignored
    try { db.create_table("customers", {}); }
    catch (const std::exception& e) { std::cout << "ERROR: " << e.what() << '\n'; }
}
```

**Output:**
```text
Table customers:
  id INTEGER PRIMARY KEY NOT NULL
  name VARCHAR(100) NOT NULL
  country CHAR(2) DEFAULT 'US'
ERROR: relation "customers" already exists
```

### Interview answer
"CREATE defines schema objects — tables with column types and constraints, indexes, views, schemas, users. Good table design picks precise types, declares primary and foreign keys and NOT NULL/CHECK constraints, and adds indexes for access paths."

---

## 2. ALTER statement

**In one sentence:** `ALTER` changes the structure of an existing object — add, rename or drop columns, change types, add or remove constraints — without recreating it.

### In plain words
Your customer form needs a new "phone number" field. You don't throw away the drawer and re-enter every card — you **add a field** to the form (and existing cards get it empty or with a default).

### How it works
```sql
ALTER TABLE customers ADD COLUMN phone VARCHAR(20);                -- new column (NULL for old rows)
ALTER TABLE customers ADD COLUMN vip BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE customers RENAME COLUMN phone TO phone_number;
ALTER TABLE customers ALTER COLUMN name TYPE VARCHAR(200);         -- PostgreSQL (MySQL: MODIFY COLUMN)
ALTER TABLE customers DROP COLUMN phone_number;
ALTER TABLE orders ADD CONSTRAINT positive_total CHECK (total >= 0);
ALTER TABLE customers RENAME TO clients;
```
**On a large production table, some ALTERs are dangerous:**
- Changing a column type or adding a column with a volatile default can **rewrite the entire table** and **lock it** for minutes/hours.
- Safe migration pattern ("expand/contract"): add the new nullable column → backfill in batches → switch the application → add constraints → drop the old column later.
- Tools: Flyway, Liquibase, Alembic, `gh-ost`/`pt-online-schema-change` for MySQL online changes.

### Modern C++ example — ALTER on a table that already has rows
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <string>
#include <vector>

using Row = std::map<std::string, std::string>;       // column -> value ("NULL" if missing)

struct Table {
    std::vector<std::string> columns;
    std::vector<Row> rows;

    void add_column(const std::string& col, const std::string& default_value = "NULL") {
        columns.push_back(col);
        for (auto& r : rows) r[col] = default_value;   // existing rows get the default
    }
    void rename_column(const std::string& from, const std::string& to) {
        for (auto& c : columns) if (c == from) c = to;
        for (auto& r : rows) { r[to] = r[from]; r.erase(from); }
    }
    void drop_column(const std::string& col) {
        std::erase(columns, col);
        for (auto& r : rows) r.erase(col);
    }
    void print() const {
        for (const auto& c : columns) std::cout << c << '\t';
        std::cout << '\n';
        for (const auto& r : rows) {
            for (const auto& c : columns) std::cout << r.at(c) << '\t';
            std::cout << '\n';
        }
    }
};

int main() {
    Table customers{{"id", "name"}, {{{"id", "1"}, {"name", "Ana"}}, {{"id", "2"}, {"name", "Ben"}}}};
    customers.add_column("phone");                      // ADD COLUMN phone
    customers.add_column("vip", "false");               // ADD COLUMN vip ... DEFAULT FALSE
    customers.rename_column("phone", "phone_number");   // RENAME COLUMN
    customers.drop_column("phone_number");              // DROP COLUMN
    customers.print();
}
```

**Output:**
```text
id	name	vip	
1	Ana	false	
2	Ben	false	
```

### Interview answer
"ALTER modifies existing schema objects: adding, renaming, retyping or dropping columns and constraints. On large tables some operations rewrite or lock the table, so production changes use expand-and-contract migrations, batched backfills and online schema-change tools."

---

## 3. DROP statement

**In one sentence:** `DROP` permanently deletes a database object — the table's **structure and all its data** — from the database.

### In plain words
`DELETE` empties cards out of a drawer. `TRUNCATE` swaps in an empty drawer. `DROP` **throws away the whole cabinet**, drawer, labels and all. There's no undo button (except restoring a backup — or a transaction in databases that support transactional DDL, like PostgreSQL).

### How it works
```sql
DROP TABLE IF EXISTS old_logs;          -- no error if missing
DROP TABLE customers;                   -- fails if orders.customer_id references it...
DROP TABLE customers CASCADE;           -- PostgreSQL: also drops dependent views/foreign keys
DROP INDEX idx_orders_customer;
DROP VIEW big_orders;
DROP DATABASE shop;                     -- everything!
```
| | DELETE | TRUNCATE | DROP |
|---|---|---|---|
| Removes | Some/all rows | All rows | The table itself + rows + indexes + triggers |
| Structure kept? | Yes | Yes | **No** |
| WHERE | Yes | No | No |
| Rollback | Yes | Depends on DB | PostgreSQL/SQL Server: yes inside a transaction; MySQL/Oracle: no |

### Modern C++ example — DROP with dependency checking (RESTRICT vs CASCADE)
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <set>
#include <string>

class Catalog {
public:
    void create(const std::string& obj, std::set<std::string> depends_on = {}) {
        objects_.insert(obj);
        for (const auto& d : depends_on) dependents_[d].insert(obj);
    }
    bool drop(const std::string& obj, bool cascade) {
        if (!objects_.contains(obj)) { std::cout << "  (does not exist)\n"; return false; }
        auto& deps = dependents_[obj];
        if (!deps.empty() && !cascade) {
            std::cout << "  ERROR: cannot drop " << obj << ": other objects depend on it\n";
            return false;
        }
        for (auto d : std::set<std::string>(deps)) drop(d, true);    // CASCADE
        objects_.erase(obj);
        dependents_.erase(obj);
        std::cout << "  dropped " << obj << '\n';
        return true;
    }
private:
    std::set<std::string> objects_;
    std::map<std::string, std::set<std::string>> dependents_;
};

int main() {
    Catalog db;
    db.create("customers");
    db.create("orders", {"customers"});           // FK -> customers
    db.create("big_orders_view", {"orders"});     // view over orders

    std::cout << "DROP TABLE customers;  (RESTRICT, the default)\n";
    db.drop("customers", false);
    std::cout << "DROP TABLE customers CASCADE;\n";
    db.drop("customers", true);
}
```

**Output:**
```text
DROP TABLE customers;  (RESTRICT, the default)
  ERROR: cannot drop customers: other objects depend on it
DROP TABLE customers CASCADE;
  dropped big_orders_view
  dropped orders
  dropped customers
```
(Real PostgreSQL `CASCADE` drops dependent *views and foreign-key constraints*, not the other tables themselves; the model simplifies this.)

### Interview answer
"DROP removes a schema object and all its data, indexes and triggers. It's RESTRICT by default, failing if dependents exist; CASCADE removes the dependents. Unlike DELETE it removes structure, and whether it can be rolled back depends on the database's support for transactional DDL."

---

## 4. GRANT statement

**In one sentence:** `GRANT` gives a user or role a **privilege** (like SELECT, INSERT, UPDATE, DELETE) on a database object.

### In plain words
The office manager hands out keys: "Ana gets a key to *read* the customer cabinet; the accounting team gets keys to *read and update* invoices." Nobody gets keys they don't need.

### How it works
```sql
CREATE ROLE analyst;                                     -- a group of permissions
GRANT SELECT ON customers, orders TO analyst;            -- read-only
GRANT SELECT, INSERT, UPDATE ON orders TO order_service; -- an application's account
GRANT analyst TO ana;                                    -- ana inherits analyst's privileges
GRANT SELECT (name, country) ON customers TO support;    -- column-level (PostgreSQL)
GRANT SELECT ON orders TO lead WITH GRANT OPTION;        -- lead may grant it to others
```
Best practices:
- **Principle of least privilege:** each app/user gets only what it needs. The web app shouldn't be able to `DROP TABLE`.
- Grant to **roles**, then assign roles to users (easier to manage).
- Separate accounts for migrations (DDL) vs. the running application (DML only).
- Some databases add **row-level security** (PostgreSQL `CREATE POLICY`) for "users only see their own rows".

### Modern C++ example — a role-based permission checker
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <set>
#include <string>
#include <tuple>

class AccessControl {
public:
    void grant(const std::string& who, const std::string& priv, const std::string& table) {
        privileges_.insert({who, priv, table});
    }
    void grant_role(const std::string& role, const std::string& user) { roles_[user].insert(role); }

    bool allowed(const std::string& user, const std::string& priv, const std::string& table) const {
        if (privileges_.contains({user, priv, table})) return true;
        if (auto it = roles_.find(user); it != roles_.end())
            for (const auto& role : it->second)
                if (privileges_.contains({role, priv, table})) return true;
        return false;                                     // default: DENY
    }
private:
    std::set<std::tuple<std::string, std::string, std::string>> privileges_;
    std::map<std::string, std::set<std::string>> roles_;
};

int main() {
    AccessControl acl;
    acl.grant("analyst", "SELECT", "orders");            // GRANT SELECT ON orders TO analyst;
    acl.grant_role("analyst", "ana");                    // GRANT analyst TO ana;
    acl.grant("order_service", "INSERT", "orders");

    std::cout << std::boolalpha;
    std::cout << "ana SELECT orders?           " << acl.allowed("ana", "SELECT", "orders") << '\n';
    std::cout << "ana DELETE orders?           " << acl.allowed("ana", "DELETE", "orders") << '\n';
    std::cout << "order_service INSERT orders? " << acl.allowed("order_service", "INSERT", "orders") << '\n';
}
```

**Output:**
```text
ana SELECT orders?           true
ana DELETE orders?           false
order_service INSERT orders? true
```

### Interview answer
"GRANT assigns privileges such as SELECT, INSERT, UPDATE, DELETE or EXECUTE on objects to users or roles, optionally WITH GRANT OPTION. I follow least privilege, grant to roles rather than individuals, and keep separate accounts for schema migrations and application access."

---

## 5. REVOKE statement

**In one sentence:** `REVOKE` takes back privileges previously granted.

### In plain words
Ana moved to another team, so the manager takes back her key to the customer cabinet.

### How it works
```sql
REVOKE INSERT, UPDATE ON orders FROM intern;
REVOKE analyst FROM ana;                         -- remove a role membership
REVOKE ALL PRIVILEGES ON customers FROM PUBLIC;  -- PUBLIC = every user
REVOKE SELECT ON orders FROM lead CASCADE;       -- also revoke from those 'lead' granted it to
```
- If a user also has the privilege **through a role**, revoking the direct grant isn't enough.
- SQL Server additionally has `DENY`, which overrides any grant.
- Audit periodically: list who has what (`information_schema.role_table_grants`, `\dp` in psql).

### Modern C++ example — revoking a direct grant vs. a role
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <set>
#include <string>

int main() {
    std::map<std::string, std::set<std::string>> direct{{"ana", {"SELECT orders"}}};
    std::map<std::string, std::set<std::string>> role_privs{{"analyst", {"SELECT orders"}}};
    std::map<std::string, std::set<std::string>> member_of{{"ana", {"analyst"}}};

    auto can = [&](const std::string& user, const std::string& priv) {
        if (direct[user].contains(priv)) return true;
        for (const auto& role : member_of[user]) if (role_privs[role].contains(priv)) return true;
        return false;
    };

    std::cout << std::boolalpha;
    direct["ana"].erase("SELECT orders");                     // REVOKE SELECT ON orders FROM ana;
    std::cout << "after revoking the direct grant: " << can("ana", "SELECT orders")
              << "  <- still allowed via role 'analyst'\n";
    member_of["ana"].erase("analyst");                        // REVOKE analyst FROM ana;
    std::cout << "after revoking the role:         " << can("ana", "SELECT orders") << '\n';
}
```

**Output:**
```text
after revoking the direct grant: true  <- still allowed via role 'analyst'
after revoking the role:         false
```

### Interview answer
"REVOKE removes previously granted privileges or role memberships; CASCADE also removes grants that depended on them. Effective permissions are the union of direct and role grants, so revoking one path may not remove access."

---

## 6. COMMIT statement

**In one sentence:** `COMMIT` ends a transaction and makes all of its changes **permanent and visible** to other users.

### In plain words
Clicking **Save** on a document after a series of edits. Until you save, others see the old version; after saving, everyone sees the new version, and it survives a power cut.

### How it works
```sql
BEGIN;
INSERT INTO orders (id, customer_id, total) VALUES (500, 1, 99.00);
UPDATE products SET stock = stock - 1 WHERE id = 7;
COMMIT;            -- both changes become durable and visible atomically
```
What happens on COMMIT:
1. The database writes a **commit record** to its **write-ahead log (WAL)** and flushes it to disk (**durability**).
2. The changes become visible to other transactions (depending on [isolation levels](./Transactions-and-Isolation.md)).
3. Locks held by the transaction are released.

After `COMMIT`, the changes can't be rolled back — only undone by new changes.

### Modern C++ example — changes are invisible until COMMIT
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <string>
#include <vector>

class Database {
public:
    std::map<std::string, int> committed{{"stock:pen", 100}};   // what everyone sees
    std::vector<std::string> wal;                                // write-ahead log (durable)

    class Transaction {
    public:
        explicit Transaction(Database& db) : db_(db) {}
        void set(const std::string& k, int v) { pending_[k] = v; }       // private to this tx
        void commit() {
            for (const auto& [k, v] : pending_) db_.wal.push_back("SET " + k + "=" + std::to_string(v));
            db_.wal.push_back("COMMIT");                                  // 1) log first (durability)
            for (const auto& [k, v] : pending_) db_.committed[k] = v;     // 2) then make visible
            pending_.clear();
        }
    private:
        Database& db_;
        std::map<std::string, int> pending_;
    };
};

int main() {
    Database db;
    Database::Transaction tx(db);
    tx.set("stock:pen", 99);
    std::cout << "other users see before COMMIT: " << db.committed["stock:pen"] << '\n';
    tx.commit();
    std::cout << "other users see after COMMIT:  " << db.committed["stock:pen"] << '\n';
    std::cout << "WAL:";
    for (const auto& rec : db.wal) std::cout << " [" << rec << ']';
    std::cout << '\n';
}
```

**Output:**
```text
other users see before COMMIT: 100
other users see after COMMIT:  99
WAL: [SET stock:pen=99] [COMMIT]
```

### Interview answer
"COMMIT ends a transaction successfully: the commit record is flushed to the write-ahead log for durability, the changes become visible to other transactions according to the isolation level, and the transaction's locks are released."

---

## 7. ROLLBACK statement (and SAVEPOINT)

**In one sentence:** `ROLLBACK` cancels a transaction and undoes **all** its changes since `BEGIN` (or since a named `SAVEPOINT`).

### In plain words
Closing the document **without saving** — every edit since the last save disappears. A **savepoint** is like an intermediate checkpoint in a video game: if you die, you restart from the checkpoint, not from the very beginning.

### How it works
```sql
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
SAVEPOINT after_withdraw;
UPDATE accounts SET balance = balance + 100 WHERE id = 99;   -- oops, wrong account
ROLLBACK TO SAVEPOINT after_withdraw;                        -- undo only the second update
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;                                                      -- withdraw + correct deposit
-- or: ROLLBACK;  -- undo everything since BEGIN
```
- Errors in the middle of a transaction usually require a rollback (PostgreSQL refuses further commands until you roll back).
- Internally, the database uses its **undo log** (or keeps old row versions — MVCC) to restore the previous state.
- DDL rollback: PostgreSQL and SQL Server can roll back `CREATE/ALTER/DROP` inside a transaction; MySQL and Oracle commit DDL implicitly.

### Modern C++ example — COMMIT, ROLLBACK and SAVEPOINT with an undo log
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <stdexcept>
#include <string>
#include <vector>

class Database {
public:
    std::map<int, int> balances{{1, 500}, {2, 100}};

    void begin() { in_tx_ = true; undo_.clear(); savepoints_.clear(); }
    void update(int id, int delta) {
        if (!balances.contains(id)) throw std::runtime_error("no account " + std::to_string(id));
        if (in_tx_) undo_.push_back({id, balances[id]});        // remember old value
        balances[id] += delta;
    }
    void savepoint(const std::string& name) { savepoints_[name] = undo_.size(); }
    void rollback_to(const std::string& name) { undo_until(savepoints_.at(name)); }
    void rollback() { undo_until(0); in_tx_ = false; }
    void commit() { undo_.clear(); in_tx_ = false; }             // changes become permanent

    void print(const char* label) const {
        std::cout << label << ": acct1=" << balances.at(1) << " acct2=" << balances.at(2) << '\n';
    }
private:
    void undo_until(std::size_t mark) {                          // replay the undo log backwards
        while (undo_.size() > mark) {
            auto [id, old] = undo_.back();
            balances[id] = old;
            undo_.pop_back();
        }
    }
    struct Undo { int id, old_value; };
    bool in_tx_ = false;
    std::vector<Undo> undo_;
    std::map<std::string, std::size_t> savepoints_;
};

int main() {
    Database db;
    db.begin();
    db.update(1, -100);
    db.savepoint("after_withdraw");
    db.update(2, +999);                       // a mistake
    db.print("before ROLLBACK TO  ");
    db.rollback_to("after_withdraw");         // undo just the mistake
    db.update(2, +100);
    db.commit();
    db.print("after COMMIT        ");

    db.begin();
    db.update(1, -500);
    db.rollback();                            // cancel the whole transaction
    db.print("after full ROLLBACK ");
}
```

**Output:**
```text
before ROLLBACK TO  : acct1=400 acct2=1099
after COMMIT        : acct1=400 acct2=200
after full ROLLBACK : acct1=400 acct2=200
```

### Interview answer
"COMMIT durably records the transaction in the log, makes its changes visible and releases locks. ROLLBACK undoes all changes since BEGIN using undo information or old MVCC versions, and ROLLBACK TO SAVEPOINT undoes only the work after a named savepoint while keeping the transaction open."

---

## Cheat sheet

| Family | Command | Purpose |
|---|---|---|
| DDL | `CREATE` | New table/index/view/schema/role |
| DDL | `ALTER` | Change structure (add/rename/drop columns, constraints) |
| DDL | `DROP` | Delete the object and its data (RESTRICT / CASCADE) |
| DCL | `GRANT` | Give privileges to users/roles (least privilege) |
| DCL | `REVOKE` | Take privileges back (check role inheritance) |
| TCL | `COMMIT` | Make the transaction permanent + visible |
| TCL | `ROLLBACK` | Undo the whole transaction |
| TCL | `SAVEPOINT` / `ROLLBACK TO` | Partial undo inside a transaction |
