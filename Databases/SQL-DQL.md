# SQL Data Query Language (DQL) — Subqueries, Aggregates, GROUP BY/HAVING and Window Functions

> **What you'll learn:** the four query tools that take you from "list some rows" to real reporting: **subqueries**, **aggregate functions** (SUM, AVG, COUNT…), **GROUP BY and HAVING**, and **window functions** (RANK, ROW_NUMBER, running totals). Every query is shown with its result and re-implemented in C++ so you can see exactly what the database computes.
>
> **Prerequisites:** [SELECT basics](./SQL-DML.md#1-select-statement).

Example table (salaries in thousands):
```sql
CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, dept TEXT, salary INTEGER);
INSERT INTO employees VALUES
  (1,'Ana','Eng',120), (2,'Ben','Eng',100), (3,'Cara','Eng',100), (4,'Gia','Eng',90),
  (5,'Dan','Sales',70), (6,'Eve','Sales',90), (7,'Finn','HR',60);
```

## Table of Contents
1. [Subqueries](#1-subqueries)
2. [Aggregate functions (SUM, AVG, COUNT…)](#2-aggregate-functions-sum-avg-count)
3. [GROUP BY and HAVING clauses](#3-group-by-and-having-clauses)
4. [Window functions](#4-window-functions)
5. [Cheat sheet](#cheat-sheet)

---

## 1. Subqueries

**In one sentence:** a subquery is a query **inside** another query, whose result is used by the outer query as a value, a list, or a table.

### In plain words
"Who earns more than the average?" is really two questions: (1) *what is the average?* (2) *who earns more than that?* A subquery lets you ask the inner question in brackets and plug its answer into the outer question — like a calculator where you first compute `(a + b)` and then use it.

### How it works
Kinds of subqueries:
| Kind | Returns | Example use |
|---|---|---|
| **Scalar** | One value | `WHERE salary > (SELECT AVG(salary) FROM employees)` |
| **List** (with `IN`) | One column, many rows | `WHERE dept IN (SELECT ...)` |
| **Table / derived table** | A whole table in `FROM` | `FROM (SELECT ...) AS t` |
| **Correlated** | Re-evaluated **per outer row**, references the outer row | "more than *their own department's* average" |
| **EXISTS** | True/false: does the subquery return any row? | "departments that have employees" |

**Scalar subquery** — earns more than the company average (90):
```sql
SELECT name, salary FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);
```
| name | salary |
|---|---|
| Ana | 120 |
| Ben | 100 |
| Cara | 100 |

**Correlated subquery** — earns more than *their own department's* average:
```sql
SELECT e.name, e.dept, e.salary FROM employees e
WHERE e.salary > (SELECT AVG(x.salary) FROM employees x WHERE x.dept = e.dept);
```
| name | dept | salary |
|---|---|---|
| Ana | Eng | 120 |
| Eve | Sales | 90 |

(Eng average = 102.5, Sales average = 80, HR's only employee equals its own average.)

**IN / EXISTS:**
```sql
SELECT name FROM employees
WHERE dept IN (SELECT dept FROM employees GROUP BY dept HAVING COUNT(*) >= 2);   -- everyone except Finn

SELECT d.name FROM departments d
WHERE EXISTS (SELECT 1 FROM employees e WHERE e.dept = d.name);                 -- depts with staff
```
Tips:
- `NOT IN` with a subquery that can return `NULL` returns **no rows** (because `x <> NULL` is unknown). Prefer `NOT EXISTS`.
- Correlated subqueries can be slow (conceptually one inner query per row); modern optimizers often rewrite them as joins. **CTEs** (`WITH avg_by_dept AS (...) SELECT ...`) make complex subqueries readable.

### Modern C++ example — scalar vs. correlated subquery
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <numeric>
#include <string>
#include <vector>

struct Employee { int id; std::string name, dept; int salary; };

const std::vector<Employee> employees{
    {1, "Ana", "Eng", 120}, {2, "Ben", "Eng", 100}, {3, "Cara", "Eng", 100}, {4, "Gia", "Eng", 90},
    {5, "Dan", "Sales", 70}, {6, "Eve", "Sales", 90}, {7, "Finn", "HR", 60}};

// (SELECT AVG(salary) FROM employees x WHERE <filter>)
template <class Filter>
double avg_salary(Filter filter) {
    int sum = 0, count = 0;
    for (const auto& x : employees) if (filter(x)) { sum += x.salary; ++count; }
    return count ? double(sum) / count : 0.0;
}

int main() {
    // Scalar subquery: computed ONCE, then used for every row.
    const double company_avg = avg_salary([](const Employee&) { return true; });
    std::cout << "above company average (" << company_avg << "):";
    for (const auto& e : employees) if (e.salary > company_avg) std::cout << ' ' << e.name;
    std::cout << '\n';

    // Correlated subquery: re-evaluated for EACH outer row, using that row's dept.
    std::cout << "above own department average:";
    for (const auto& e : employees)
        if (e.salary > avg_salary([&](const Employee& x) { return x.dept == e.dept; }))
            std::cout << ' ' << e.name;
    std::cout << '\n';
}
```

**Output:**
```text
above company average (90): Ana Ben Cara
above own department average: Ana Eve
```

### Interview answer
"A subquery is a nested SELECT used as a scalar, a list for IN, a derived table in FROM, or an EXISTS test. Correlated subqueries reference the outer row and are logically evaluated per row, so optimizers often rewrite them as joins. I avoid NOT IN over nullable columns in favor of NOT EXISTS, and use CTEs for readability."

---

## 2. Aggregate functions (SUM, AVG, COUNT…)

**In one sentence:** aggregate functions take **many rows** and squash them into **one value** — a total, an average, a count, a minimum or a maximum.

### In plain words
At the end of the day a cashier doesn't read every receipt aloud; they report *"57 sales, $3,200 total, average $56, biggest $400"*. Those are aggregates.

### How it works
```sql
SELECT COUNT(*)    AS employees,       -- 7   (counts rows)
       SUM(salary) AS payroll,         -- 630
       AVG(salary) AS avg_salary,      -- 90
       MIN(salary) AS lowest,          -- 60
       MAX(salary) AS highest          -- 120
FROM employees;
```
**NULL rules (a favorite interview topic):**
- `COUNT(*)` counts rows; `COUNT(column)` counts **non-NULL** values; `COUNT(DISTINCT column)` counts distinct non-NULL values.
- `SUM`, `AVG`, `MIN`, `MAX` **ignore NULLs**. `AVG` of (10, NULL, 20) is 15, not 10.
- `SUM` of zero rows is `NULL`, not 0 → use `COALESCE(SUM(x), 0)`.
- Watch integer division: in some databases `AVG` of integers returns an integer (SQL Server), in others a decimal.

Other aggregates: `STRING_AGG` / `GROUP_CONCAT` (join strings), `ARRAY_AGG`, `STDDEV`, `PERCENTILE_CONT` (median).

### Modern C++ example — aggregates with NULLs (`std::optional`)
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <format>
#include <iostream>
#include <limits>
#include <optional>
#include <ranges>
#include <vector>

int main() {
    // A column where one value is NULL (e.g. a bonus not decided yet)
    const std::vector<std::optional<int>> bonus{10, std::nullopt, 20, 30};

    std::size_t count_star = bonus.size();                                   // COUNT(*)
    auto non_null = bonus | std::views::filter([](auto& v) { return v.has_value(); })
                          | std::views::transform([](auto& v) { return *v; });
    int count_col = 0, sum = 0;
    int mn = std::numeric_limits<int>::max(), mx = std::numeric_limits<int>::min();
    for (int v : non_null) { ++count_col; sum += v; mn = std::min(mn, v); mx = std::max(mx, v); }

    std::cout << std::format("COUNT(*)     = {}\n", count_star);
    std::cout << std::format("COUNT(bonus) = {}   (NULL not counted)\n", count_col);
    std::cout << std::format("SUM(bonus)   = {}\n", sum);
    std::cout << std::format("AVG(bonus)   = {}   (60 / 3, not 60 / 4)\n", double(sum) / count_col);
    std::cout << std::format("MIN / MAX    = {} / {}\n", mn, mx);
}
```

**Output:**
```text
COUNT(*)     = 4
COUNT(bonus) = 3   (NULL not counted)
SUM(bonus)   = 60
AVG(bonus)   = 20   (60 / 3, not 60 / 4)
MIN / MAX    = 10 / 30
```

### Interview answer
"Aggregates collapse a set of rows into one value: COUNT, SUM, AVG, MIN, MAX and others. They ignore NULLs except COUNT(*), SUM over no rows returns NULL, and COUNT(column) differs from COUNT(*) when the column has NULLs."

---

## 3. GROUP BY and HAVING clauses

**In one sentence:** `GROUP BY` splits rows into groups that share a value and computes aggregates **per group**; `HAVING` then filters **the groups** (while `WHERE` filters rows *before* grouping).

### In plain words
Sorting receipts into piles by department, then writing a sticky note on each pile: "Eng: 4 people, total 410". `HAVING` is then saying "only keep piles whose average is above 75". `WHERE` would be throwing away individual receipts *before* you make the piles.

### How it works
```sql
SELECT dept,
       COUNT(*)    AS headcount,
       SUM(salary) AS payroll,
       AVG(salary) AS avg_salary
FROM employees
GROUP BY dept
ORDER BY payroll DESC;
```
| dept | headcount | payroll | avg_salary |
|---|---|---|---|
| Eng | 4 | 410 | 102.5 |
| Sales | 2 | 160 | 80 |
| HR | 1 | 60 | 60 |

```sql
SELECT dept, AVG(salary) AS avg_salary
FROM employees
WHERE salary >= 0              -- filters ROWS (before grouping)
GROUP BY dept
HAVING AVG(salary) > 75;       -- filters GROUPS (after grouping) -> Eng, Sales
```
Rules:
- Every column in `SELECT` must be either in `GROUP BY` or inside an aggregate (otherwise: "which employee's name should the Eng row show?").
- Evaluation order: `FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY`.
- Filtering on an aggregate requires `HAVING`; filtering on plain columns should use `WHERE` (it's faster — fewer rows to group).

### Modern C++ example — GROUP BY as a hash map of accumulators
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <format>
#include <iostream>
#include <map>
#include <string>
#include <vector>

struct Employee { std::string name, dept; int salary; };
struct Group { int count = 0; int sum = 0; double avg() const { return double(sum) / count; } };

int main() {
    const std::vector<Employee> employees{
        {"Ana", "Eng", 120}, {"Ben", "Eng", 100}, {"Cara", "Eng", 100}, {"Gia", "Eng", 90},
        {"Dan", "Sales", 70}, {"Eve", "Sales", 90}, {"Finn", "HR", 60}};

    std::map<std::string, Group> groups;                        // GROUP BY dept
    for (const auto& e : employees) {
        auto& g = groups[e.dept];
        ++g.count;                                              // COUNT(*)
        g.sum += e.salary;                                      // SUM(salary)
    }

    std::vector<std::pair<std::string, Group>> rows(groups.begin(), groups.end());
    std::ranges::sort(rows, std::greater<>{}, [](auto& r) { return r.second.sum; });  // ORDER BY payroll DESC

    std::cout << "dept  | headcount | payroll | avg\n";
    for (const auto& [dept, g] : rows)
        std::cout << std::format("{:<5} | {:>9} | {:>7} | {}\n", dept, g.count, g.sum, g.avg());

    std::cout << "HAVING AVG(salary) > 75:";
    for (const auto& [dept, g] : groups) if (g.avg() > 75) std::cout << ' ' << dept;
    std::cout << '\n';
}
```

**Output:**
```text
dept  | headcount | payroll | avg
Eng   |         4 |     410 | 102.5
Sales |         2 |     160 | 80
HR    |         1 |      60 | 60
HAVING AVG(salary) > 75: Eng Sales
```

### Interview answer
"GROUP BY partitions rows by key and computes aggregates per group; HAVING filters groups after aggregation, whereas WHERE filters rows before it. Non-aggregated SELECT columns must appear in GROUP BY. Engines implement grouping with hash aggregation or by sorting."

---

## 4. Window functions

**In one sentence:** a window function computes a value **across a set of related rows** (the "window") **without collapsing them** — every row stays, and gains an extra column like its rank, a running total, or its department's total.

### In plain words
With `GROUP BY` you get one sticky note *per pile* and lose the individual receipts. With a window function, **every receipt keeps its place**, and you write on each one: "this is the 2nd-highest in its pile" or "the pile's total is 410". It's like looking through a window at your neighbors while staying in your own row.

### How it works
```sql
function(...) OVER (
    PARTITION BY dept        -- which rows form the window (like GROUP BY, but no collapsing)
    ORDER BY salary DESC     -- order inside the window (needed for rankings / running totals)
    ROWS BETWEEN ...         -- optional frame: e.g. last 3 rows for a moving average
)
```
Common window functions:
| Function | Gives |
|---|---|
| `ROW_NUMBER()` | 1, 2, 3, 4 — unique numbers, ties broken arbitrarily |
| `RANK()` | 1, 2, 2, **4** — ties share a rank, then a gap |
| `DENSE_RANK()` | 1, 2, 2, **3** — ties share a rank, no gap |
| `SUM/AVG/COUNT(...) OVER (...)` | Group totals or running totals on every row |
| `LAG(col)` / `LEAD(col)` | The previous / next row's value |
| `FIRST_VALUE`, `LAST_VALUE`, `NTILE(n)` | First/last in window, bucket number |

**Ranking within each department:**
```sql
SELECT name, dept, salary,
       ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary DESC) AS row_num,
       RANK()       OVER (PARTITION BY dept ORDER BY salary DESC) AS rnk,
       DENSE_RANK() OVER (PARTITION BY dept ORDER BY salary DESC) AS dense_rnk,
       SUM(salary)  OVER (PARTITION BY dept)                      AS dept_total
FROM employees WHERE dept = 'Eng';
```
| name | dept | salary | row_num | rnk | dense_rnk | dept_total |
|---|---|---|---|---|---|---|
| Ana | Eng | 120 | 1 | 1 | 1 | 410 |
| Ben | Eng | 100 | 2 | 2 | 2 | 410 |
| Cara | Eng | 100 | 3 | 2 | 2 | 410 |
| Gia | Eng | 90 | 4 | **4** | **3** | 410 |

**Running total and previous value:**
```sql
SELECT name, salary,
       SUM(salary) OVER (ORDER BY id) AS running_total,
       LAG(salary) OVER (ORDER BY id) AS previous_salary
FROM employees;
```
| name | salary | running_total | previous_salary |
|---|---|---|---|
| Ana | 120 | 120 | NULL |
| Ben | 100 | 220 | 120 |
| Cara | 100 | 320 | 100 |
| Gia | 90 | 410 | 100 |
| Dan | 70 | 480 | 90 |
| Eve | 90 | 570 | 70 |
| Finn | 60 | 630 | 90 |

**Classic interview query — top earner per department:**
```sql
SELECT dept, name, salary FROM (
    SELECT *, ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary DESC) AS rn
    FROM employees
) t
WHERE rn = 1;          -- Eng: Ana, HR: Finn, Sales: Eve
```
(Window functions are computed after `WHERE`/`GROUP BY`/`HAVING`, so you can't filter on them directly — wrap them in a subquery or CTE as above.)

### Modern C++ example — PARTITION BY + ORDER BY: ROW_NUMBER, RANK, DENSE_RANK, running total
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <format>
#include <iostream>
#include <map>
#include <string>
#include <vector>

struct Employee { int id; std::string name, dept; int salary; };
struct Ranked { Employee e; int row_num, rank, dense_rank, dept_total; };

int main() {
    const std::vector<Employee> employees{
        {1, "Ana", "Eng", 120}, {2, "Ben", "Eng", 100}, {3, "Cara", "Eng", 100}, {4, "Gia", "Eng", 90},
        {5, "Dan", "Sales", 70}, {6, "Eve", "Sales", 90}, {7, "Finn", "HR", 60}};

    // PARTITION BY dept
    std::map<std::string, std::vector<Employee>> partitions;
    for (const auto& e : employees) partitions[e.dept].push_back(e);

    std::vector<Ranked> out;
    for (auto& [dept, rows] : partitions) {
        std::ranges::stable_sort(rows, std::greater<>{}, &Employee::salary);   // ORDER BY salary DESC
        int total = 0;
        for (const auto& r : rows) total += r.salary;                          // SUM() OVER (PARTITION BY dept)
        int rank = 0, dense = 0;
        for (std::size_t i = 0; i < rows.size(); ++i) {
            bool tie = i > 0 && rows[i].salary == rows[i - 1].salary;
            if (!tie) { rank = static_cast<int>(i) + 1; ++dense; }             // ties keep previous rank
            out.push_back({rows[i], static_cast<int>(i) + 1, rank, dense, total});
        }
    }

    std::cout << "name dept  sal row rank dense total\n";
    for (const auto& r : out)
        if (r.e.dept == "Eng")
            std::cout << std::format("{:<4} {:<5} {:>3} {:>3} {:>4} {:>5} {:>5}\n", r.e.name, r.e.dept,
                                     r.e.salary, r.row_num, r.rank, r.dense_rank, r.dept_total);

    std::cout << "top earner per dept:";
    for (const auto& r : out) if (r.row_num == 1) std::cout << ' ' << r.e.dept << '=' << r.e.name;
    std::cout << '\n';

    std::cout << "running total:";                                            // SUM() OVER (ORDER BY id)
    int running = 0;
    for (const auto& e : employees) std::cout << ' ' << (running += e.salary);
    std::cout << '\n';
}
```

**Output:**
```text
name dept  sal row rank dense total
Ana  Eng   120   1    1     1   410
Ben  Eng   100   2    2     2   410
Cara Eng   100   3    2     2   410
Gia  Eng    90   4    4     3   410
top earner per dept: Eng=Ana HR=Finn Sales=Eve
running total: 120 220 320 410 480 570 630
```

### Common mistakes
- Using `ROW_NUMBER` when ties matter ("top 3 salaries" should often use `DENSE_RANK`).
- Forgetting `ORDER BY` inside `OVER` for running totals → you get the partition total instead.

### Interview answer
"Window functions compute over a window of rows defined by PARTITION BY, ORDER BY and an optional frame, without collapsing rows like GROUP BY. ROW_NUMBER gives unique sequence numbers, RANK leaves gaps after ties, DENSE_RANK doesn't; aggregates OVER give per-partition or running totals, and LAG/LEAD access neighboring rows. They're evaluated after WHERE and GROUP BY, so filtering on them needs a subquery or CTE — the standard top-N-per-group pattern."

---

## Cheat sheet

| Tool | Use | Remember |
|---|---|---|
| Scalar subquery | Plug in one computed value | Must return one row |
| Correlated subquery | Per-row comparison with related rows | Can be slow; often rewritten as join |
| `IN` / `EXISTS` | Membership / existence | Prefer `NOT EXISTS` over `NOT IN` with NULLs |
| Aggregates | Many rows → one value | Ignore NULLs (except `COUNT(*)`) |
| `GROUP BY` | Aggregates per group | Non-aggregated columns must be grouped |
| `HAVING` | Filter groups | `WHERE` = rows before, `HAVING` = groups after |
| Window functions | Per-row values over a window | Rows are kept; `ROW_NUMBER`/`RANK`/`DENSE_RANK`, running totals, `LAG`/`LEAD` |
