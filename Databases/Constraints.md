# Database Constraints — Primary Key, Foreign Key, Unique, Check and Default

> **What you'll learn:** what constraints are and why they're your database's "bodyguards", then each of the five in detail — **primary key, foreign key, unique, check, default** — with SQL.
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
