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
