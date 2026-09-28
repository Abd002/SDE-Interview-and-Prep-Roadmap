# Stored Procedures, Functions, Triggers and Views

> **What you'll learn:** how to put logic **inside the database**: **stored procedures and functions** (creation, execution, parameters), **triggers** (BEFORE/AFTER types and execution order), and **views** (regular vs. materialized, advantages and use cases) — with SQL (PostgreSQL syntax, with notes for MySQL/SQL Server) and C++ models of how each behaves.
>
> **Prerequisites:** [SQL DML](./SQL-DML.md), [SQL DQL](./SQL-DQL.md).

## Table of Contents
1. [Stored procedures and functions](#1-stored-procedures-and-functions)
   - [Creation](#11-creation) · [Execution](#12-execution) · [Parameters](#13-parameters)
2. [Triggers](#2-triggers)
   - [Types of triggers (BEFORE, AFTER)](#21-types-of-triggers-before-after) · [Trigger execution order](#22-trigger-execution-order)
3. [Views](#3-views)
   - [Materialized views vs. regular views](#31-materialized-views-vs-regular-views) · [Advantages and use cases](#32-advantages-and-use-cases)
4. [Cheat sheet](#cheat-sheet)

---

## 1. Stored procedures and functions

**In one sentence:** a stored procedure (or function) is a named block of SQL + procedural logic **saved inside the database** that you can call by name, like a function in a programming language.

### In plain words
Instead of phoning the bank and dictating ten separate instructions ("check balance, subtract 100, add 100 to Ben, write a log entry…"), you say one phrase: **"run the Transfer procedure: from Ana to Ben, 100"**. The bank already knows the steps. It's faster (one call instead of ten), consistent (everyone uses the same steps), and the bank can let you run *Transfer* without giving you direct access to the ledgers.

### Procedure vs. function
| | Function | Procedure |
|---|---|---|
| Returns | A value (or table) | Nothing required; may have OUT parameters |
| Use inside a query | ✅ `SELECT tax(price) FROM ...` | ❌ called with `CALL` / `EXEC` |
| Transaction control (COMMIT inside) | ❌ | ✅ (PostgreSQL 11+, SQL Server, MySQL) |
| Typical use | Calculations, reusable expressions | Multi-step business operations, batch jobs |

Pros: fewer network round trips, logic close to the data, security (grant `EXECUTE` without table access), reuse across apps.
Cons: harder to version/test/debug than app code, vendor-specific languages (PL/pgSQL, T-SQL, PL/SQL), scaling the DB is harder than scaling app servers. Many teams keep business logic in the application and use procedures selectively.

### 1.1 Creation
```sql
-- PostgreSQL: a FUNCTION (returns a value, usable in queries)
CREATE OR REPLACE FUNCTION price_with_tax(price NUMERIC, rate NUMERIC DEFAULT 0.2)
RETURNS NUMERIC
LANGUAGE sql IMMUTABLE
AS $$ SELECT round(price * (1 + rate), 2) $$;

-- PostgreSQL: a PROCEDURE (multi-step, can COMMIT)
CREATE OR REPLACE PROCEDURE transfer(from_id INT, to_id INT, amount NUMERIC)
LANGUAGE plpgsql
AS $$
BEGIN
    IF amount <= 0 THEN
        RAISE EXCEPTION 'amount must be positive';
    END IF;
    UPDATE accounts SET balance = balance - amount WHERE id = from_id;
    UPDATE accounts SET balance = balance + amount WHERE id = to_id;
    INSERT INTO audit_log(action, detail) VALUES ('transfer', from_id || '->' || to_id || ': ' || amount);
END;
$$;
```
MySQL uses `DELIMITER //` + `CREATE PROCEDURE ... BEGIN ... END //`; SQL Server uses `CREATE PROCEDURE dbo.Transfer @FromId INT, ... AS BEGIN ... END`.

### 1.2 Execution
```sql
SELECT name, price_with_tax(price) FROM products;   -- function inside a query
SELECT price_with_tax(10);                          -- 12.00 (default rate)
CALL transfer(1, 2, 100);                           -- PostgreSQL / MySQL
-- EXEC dbo.Transfer @FromId = 1, @ToId = 2, @Amount = 100;   -- SQL Server
GRANT EXECUTE ON PROCEDURE transfer TO teller_app;  -- run it without direct table rights
```
The database parses and plans the body once and can **cache the execution plan**, which makes repeated calls cheap (watch for "parameter sniffing" in SQL Server, where a plan cached for one parameter value is bad for another).

### 1.3 Parameters
Parameter modes:
| Mode | Direction | Example |
|---|---|---|
| `IN` (default) | Caller → procedure | `amount NUMERIC` |
| `OUT` | Procedure → caller | `OUT new_balance NUMERIC` |
| `INOUT` | Both | `INOUT counter INT` |
```sql
CREATE PROCEDURE withdraw(IN acc INT, IN amount NUMERIC, OUT new_balance NUMERIC)
LANGUAGE plpgsql AS $$
BEGIN
    UPDATE accounts SET balance = balance - amount WHERE id = acc
    RETURNING balance INTO new_balance;
END; $$;

CALL withdraw(1, 50, NULL);      -- PostgreSQL returns new_balance as a result row
```
**Parameters protect against SQL injection**: values are passed as data, never glued into SQL text (unless you build dynamic SQL with string concatenation inside the procedure — don't).

### Modern C++ example — a procedure registry with IN/OUT parameters, defaults and atomic execution
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <functional>
#include <iostream>
#include <map>
#include <stdexcept>
#include <string>
#include <vector>

struct Database {
    std::map<int, double> accounts{{1, 500}, {2, 100}};
    std::vector<std::string> audit_log;
};

// FUNCTION: pure calculation with a default parameter, usable "inside a query"
constexpr double price_with_tax(double price, double rate = 0.2) { return price * (1 + rate); }

// PROCEDURE: multi-step, IN params (from, to, amount) and an OUT param (new balance).
// Runs atomically: on any error the database is restored (like an implicit transaction).
void transfer(Database& db, int from, int to, double amount, double& out_new_balance) {
    Database backup = db;                                    // BEGIN
    try {
        if (amount <= 0) throw std::invalid_argument("amount must be positive");
        if (db.accounts.at(from) < amount) throw std::runtime_error("insufficient funds");
        db.accounts.at(from) -= amount;
        db.accounts.at(to) += amount;                        // .at() throws for unknown ids
        db.audit_log.push_back(std::to_string(from) + "->" + std::to_string(to));
        out_new_balance = db.accounts.at(from);              // OUT parameter
    } catch (...) {
        db = backup;                                         // ROLLBACK
        throw;
    }
}

int main() {
    std::cout << "SELECT price_with_tax(10)      -> " << price_with_tax(10) << '\n';
    std::cout << "SELECT price_with_tax(10, 0.1) -> " << price_with_tax(10, 0.1) << '\n';

    // A registry: the app calls procedures by NAME, like CALL transfer(...)
    Database db;
    std::map<std::string, std::function<void(int, int, double, double&)>> procedures{
        {"transfer", [&](int f, int t, double a, double& out) { transfer(db, f, t, a, out); }}};

    double new_balance = 0;
    procedures.at("transfer")(1, 2, 100, new_balance);
    std::cout << "CALL transfer(1, 2, 100)  -> OUT new_balance = " << new_balance << '\n';

    try { procedures.at("transfer")(1, 99, 50, new_balance); }
    catch (const std::exception&) { std::cout << "CALL transfer(1, 99, 50)  -> ERROR, rolled back; "; }
    std::cout << "account 1 = " << db.accounts[1] << ", audit entries = " << db.audit_log.size() << '\n';
}
```

**Output:**
```text
SELECT price_with_tax(10)      -> 12
SELECT price_with_tax(10, 0.1) -> 11
CALL transfer(1, 2, 100)  -> OUT new_balance = 400
CALL transfer(1, 99, 50)  -> ERROR, rolled back; account 1 = 400, audit entries = 1
```

### Interview answer
"Stored procedures and functions are named routines stored in the database. Functions return values and can be used in queries; procedures are invoked with CALL/EXEC, can manage transactions and return data via OUT parameters. They reduce round trips, centralize logic and enable EXECUTE-only security, but are vendor-specific and harder to test and scale, so I use them selectively."

---

## 2. Triggers

**In one sentence:** a trigger is a procedure the database **runs automatically** when a specific event (INSERT, UPDATE, DELETE) happens on a table.

### In plain words
A motion-sensor light: you don't press a switch; walking in (the event) turns it on automatically. A trigger is "whenever someone changes a price, automatically write the old and new price into a history table" — no application code needs to remember to do it.

### 2.1 Types of triggers (BEFORE, AFTER)
**By timing:**
| Timing | Runs | Typical use |
|---|---|---|
| **BEFORE** | Before the row is written | Validate or **modify the incoming row** (normalize an email, set `updated_at`), or cancel the change |
| **AFTER** | After the row is written (and constraints checked) | **Side effects** that need the final row: audit logs, updating summary tables, notifications |
| **INSTEAD OF** | Replaces the operation (on **views**) | Make a complex view "writable" |

**By granularity:**
- `FOR EACH ROW` — runs once per affected row; can see `OLD` (before) and `NEW` (after) values.
- `FOR EACH STATEMENT` — runs once per SQL statement, however many rows it touched.

```sql
-- PostgreSQL: 1) the trigger function
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at := now();          -- modify the row BEFORE it is saved
    RETURN NEW;                       -- returning NULL would cancel the change
END; $$;

CREATE OR REPLACE FUNCTION log_price_change() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    IF NEW.price <> OLD.price THEN
        INSERT INTO price_history(product_id, old_price, new_price, changed_at)
        VALUES (OLD.id, OLD.price, NEW.price, now());
    END IF;
    RETURN NULL;                      -- ignored for AFTER triggers
END; $$;

-- 2) attach them to the table
CREATE TRIGGER trg_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_products_price_audit AFTER UPDATE OF price ON products
    FOR EACH ROW EXECUTE FUNCTION log_price_change();
```
(MySQL: `CREATE TRIGGER ... BEFORE UPDATE ON products FOR EACH ROW SET NEW.updated_at = NOW();` — SQL Server has only AFTER and INSTEAD OF triggers, with `inserted`/`deleted` pseudo-tables.)

### 2.2 Trigger execution order
For a single `UPDATE` of one row in PostgreSQL, the sequence is:
```
1. BEFORE STATEMENT triggers
2. For each row:
     a. BEFORE ROW triggers   (may change NEW, or skip the row by returning NULL)
     b. the row is written; CHECK / NOT NULL / UNIQUE / FK constraints are verified
     c. AFTER ROW triggers    (queued, run at end of statement; or at COMMIT if DEFERRED)
3. AFTER STATEMENT triggers
```
When several triggers share the same event and timing:
- **PostgreSQL:** alphabetical order by trigger name (so naming like `trg_10_...`, `trg_20_...` controls order).
- **MySQL 5.7+:** creation order, adjustable with `FOLLOWS` / `PRECEDES`.
- **SQL Server:** undefined except you can set first/last with `sp_settriggerorder`.
- **Oracle:** `FOLLOWS` clause.

A trigger failing (raising an error) **aborts the whole statement** and rolls it back.

**Trigger pitfalls:** hidden "magic" behavior surprises developers; cascades of triggers firing other triggers (even recursively); slower bulk writes (row triggers run per row); hard to test. Good uses: auditing, `updated_at`, enforcing complex invariants, maintaining denormalized counters.

### Modern C++ example — BEFORE/AFTER row triggers and their order
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <functional>
#include <iostream>
#include <map>
#include <optional>
#include <stdexcept>
#include <string>
#include <vector>

struct Product { int id; std::string name; double price; long updated_at = 0; };
struct PriceChange { int id; double old_price, new_price; };

class ProductsTable {
public:
    using Before = std::function<std::optional<Product>(const Product& old_row, Product new_row)>;
    using After  = std::function<void(const Product& old_row, const Product& new_row)>;

    // Triggers are kept sorted by name, like PostgreSQL does.
    void create_before_trigger(std::string name, Before f) { before_[std::move(name)] = std::move(f); }
    void create_after_trigger(std::string name, After f)   { after_[std::move(name)] = std::move(f); }

    void insert(Product p) { rows_[p.id] = p; }

    void update(int id, const std::function<void(Product&)>& set) {
        const Product old_row = rows_.at(id);
        Product new_row = old_row;
        set(new_row);
        for (auto& [name, trig] : before_) {                         // BEFORE ROW, by name
            std::cout << "  BEFORE trigger " << name << '\n';
            auto result = trig(old_row, new_row);
            if (!result) { std::cout << "  -> row skipped\n"; return; }
            new_row = *result;
        }
        if (new_row.price < 0) throw std::runtime_error("CHECK price >= 0 violated");   // constraints
        rows_[id] = new_row;                                          // write the row
        std::cout << "  row written\n";
        for (auto& [name, trig] : after_) {                          // AFTER ROW, by name
            std::cout << "  AFTER trigger " << name << '\n';
            trig(old_row, new_row);
        }
    }
    const Product& get(int id) const { return rows_.at(id); }

private:
    std::map<int, Product> rows_;
    std::map<std::string, Before> before_;
    std::map<std::string, After> after_;
};

int main() {
    ProductsTable products;
    std::vector<PriceChange> price_history;
    long clock = 1000;

    products.create_before_trigger("trg_10_updated_at", [&](const Product&, Product row) {
        row.updated_at = ++clock;                                      // modify NEW
        return std::optional(row);
    });
    products.create_before_trigger("trg_20_round_price", [](const Product&, Product row) {
        row.price = static_cast<long>(row.price * 100 + 0.5) / 100.0;  // normalize input
        return std::optional(row);
    });
    products.create_after_trigger("trg_price_audit", [&](const Product& o, const Product& n) {
        if (o.price != n.price) price_history.push_back({o.id, o.price, n.price});
    });

    products.insert({1, "pen", 1.50});
    std::cout << "UPDATE products SET price = 1.999 WHERE id = 1;\n";
    products.update(1, [](Product& p) { p.price = 1.999; });

    const auto& p = products.get(1);
    std::cout << "result: price=" << p.price << " updated_at=" << p.updated_at << '\n';
    std::cout << "price_history: " << price_history.size() << " entry (" << price_history[0].old_price
              << " -> " << price_history[0].new_price << ")\n";
}
```

**Output:**
```text
UPDATE products SET price = 1.999 WHERE id = 1;
  BEFORE trigger trg_10_updated_at
  BEFORE trigger trg_20_round_price
  row written
  AFTER trigger trg_price_audit
result: price=2 updated_at=1001
price_history: 1 entry (1.5 -> 2)
```

### Interview answer
"Triggers are routines fired automatically on INSERT, UPDATE or DELETE. BEFORE row triggers can validate or modify NEW or skip the row; AFTER triggers see the final row and are used for auditing and maintaining derived data; INSTEAD OF triggers make views writable. Order is: BEFORE statement, BEFORE row, write plus constraint checks, AFTER row, AFTER statement; same-event triggers run alphabetically in PostgreSQL or in creation order in MySQL. They're powerful but hidden, so I keep them small and well documented."

---

## 3. Views

**In one sentence:** a view is a **saved query** that you can use like a table; a **materialized view** additionally **stores the query's result** on disk so reading it is fast.

### In plain words
- **Regular view = a window.** Looking through it always shows the *current* state of the room behind it; nothing is stored in the window itself. Every time you look, the database runs the query again.
- **Materialized view = a photograph.** You take a picture of the room; looking at the photo is instant, but it shows the room *as it was when you took it*. To update it you take a new photo (`REFRESH`).

### 3.1 Materialized views vs. regular views
```sql
-- Regular view: just a stored query
CREATE VIEW active_customers AS
SELECT id, name, email FROM customers WHERE status = 'active';

SELECT * FROM active_customers WHERE name LIKE 'A%';   -- the view's query is inlined and optimized

-- Materialized view: stores the result (PostgreSQL, Oracle; SQL Server has "indexed views")
CREATE MATERIALIZED VIEW sales_by_month AS
SELECT date_trunc('month', ordered_at) AS month, SUM(total) AS revenue, COUNT(*) AS orders
FROM orders
GROUP BY 1;

CREATE UNIQUE INDEX ON sales_by_month(month);           -- you can index it like a table
REFRESH MATERIALIZED VIEW CONCURRENTLY sales_by_month;  -- recompute (e.g. every hour via a scheduler)
```
| | Regular view | Materialized view |
|---|---|---|
| Stores data? | No, only the query | Yes, the result |
| Freshness | Always current | Stale until refreshed |
| Read speed | Same as running the query | Fast (like reading a table) |
| Write cost | None | Refresh cost; extra storage |
| Indexable | No (indexes on base tables are used) | Yes |
| Updatable | Simple views yes (single table, no aggregates); otherwise via INSTEAD OF triggers | No (read-only) |
| Best for | Simplifying/securing queries | Expensive aggregations, dashboards, reports |

### 3.2 Advantages and use cases
**Advantages of views:**
1. **Simplicity:** hide complex joins behind a simple name (`customer_order_summary`).
2. **Security:** grant access to a view that exposes only some columns/rows (hide salaries, show only a tenant's rows) instead of the whole table.
3. **Stable interface:** the underlying tables can be refactored while the view keeps the same shape for applications.
4. **Consistency:** everyone uses the same business definition ("active customer").

**Extra advantages of materialized views:**
5. **Performance:** pre-computed aggregations for dashboards and reports.
6. **Reduced load:** expensive queries run once per refresh instead of once per page view.

**Use cases:** reporting dashboards, analytics rollups, search pages over joined data, data-warehouse summary tables, exposing a limited slice of data to another team or service.

**Watch out:** views stacked on views on views become slow and hard to debug; materialized views need a refresh strategy (schedule, trigger, or incremental maintenance) and can serve stale data.

### Modern C++ example — a view (computed on demand) vs. a materialized view (cached + refresh)
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <string>
#include <vector>

struct Order { std::string month; double total; };

// Regular VIEW: a stored query, re-run on every read -> always fresh
class SalesByMonthView {
public:
    explicit SalesByMonthView(const std::vector<Order>& orders) : orders_(orders) {}
    std::map<std::string, double> read() const {
        ++executions;
        std::map<std::string, double> result;
        for (const auto& o : orders_) result[o.month] += o.total;   // GROUP BY month
        return result;
    }
    mutable int executions = 0;
private:
    const std::vector<Order>& orders_;
};

// MATERIALIZED VIEW: stores the result; fast reads, stale until refresh()
class SalesByMonthMaterialized {
public:
    explicit SalesByMonthMaterialized(const std::vector<Order>& orders) : view_(orders) { refresh(); }
    void refresh() { cached_ = view_.read(); }                     // REFRESH MATERIALIZED VIEW
    const std::map<std::string, double>& read() const { return cached_; }   // no recomputation
private:
    SalesByMonthView view_;
    std::map<std::string, double> cached_;
};

int main() {
    std::vector<Order> orders{{"2024-01", 100}, {"2024-01", 50}, {"2024-02", 70}};
    SalesByMonthView view(orders);
    SalesByMonthMaterialized mview(orders);

    orders.push_back({"2024-02", 30});                              // new order arrives

    std::cout << "view     Feb = " << view.read().at("2024-02") << "  (fresh)\n";
    std::cout << "mat.view Feb = " << mview.read().at("2024-02") << "  (stale)\n";
    mview.refresh();
    std::cout << "mat.view Feb = " << mview.read().at("2024-02") << "  (after REFRESH)\n";

    for (int i = 0; i < 1000; ++i) { (void)view.read(); (void)mview.read(); }   // a busy dashboard
    std::cout << "query executions for 1000 reads: view=" << view.executions
              << ", materialized view=2 (initial + refresh)\n";
}
```

**Output:**
```text
view     Feb = 100  (fresh)
mat.view Feb = 70  (stale)
mat.view Feb = 100  (after REFRESH)
query executions for 1000 reads: view=1001, materialized view=2 (initial + refresh)
```

### Interview answer
"A view is a named stored query, expanded at query time, so it's always current and is used to simplify queries, provide a stable interface and restrict access to columns or rows. A materialized view persists the result, can be indexed and reads fast, but is stale until refreshed and costs storage and refresh time — ideal for expensive aggregations behind dashboards and reports."

---

## Cheat sheet

| Object | What it is | Key points |
|---|---|---|
| Function | Stored routine returning a value | Usable in queries; `SELECT f(x)` |
| Procedure | Stored multi-step routine | `CALL`/`EXEC`; IN/OUT/INOUT params; can COMMIT |
| BEFORE trigger | Runs before the write | Modify/validate `NEW`; return NULL to skip |
| AFTER trigger | Runs after the write | Audit, derived data; sees final row |
| INSTEAD OF trigger | Replaces the operation | Makes views writable |
| Trigger order | BEFORE stmt → BEFORE row → write + constraints → AFTER row → AFTER stmt | Same-event: alphabetical (PG), creation/FOLLOWS (MySQL) |
| View | Saved query | Always fresh; security + simplicity |
| Materialized view | Saved result | Fast, indexable, stale until REFRESH |
