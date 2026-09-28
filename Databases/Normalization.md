# Database Normalization — 1NF, 2NF, 3NF and BCNF for Beginners

> **What you'll learn:** why badly designed tables cause bugs (**anomalies**), what **keys** and **functional dependencies** are, and how the normal forms **1NF, 2NF, 3NF and BCNF** fix those problems step by step. Every step shows the SQL tables *and* a small C++ program that detects the problem and fixes it.
>
> **Prerequisites:** know what a table, row and column are. Basic C++ (`struct`, `std::vector`, `std::map`).
>
> A longer reference with more interview Q&A: [database-interview-prep-guide.md](./database-interview-prep-guide.md#7-normalization).

## Table of Contents
0. [Why normalize? Redundancy and anomalies](#0-why-normalize-redundancy-and-anomalies)
1. [Keys and functional dependencies (the vocabulary)](#1-keys-and-functional-dependencies-the-vocabulary)
2. [First Normal Form (1NF)](#2-first-normal-form-1nf)
3. [Second Normal Form (2NF)](#3-second-normal-form-2nf)
4. [Third Normal Form (3NF)](#4-third-normal-form-3nf)
5. [Boyce-Codd Normal Form (BCNF)](#5-boyce-codd-normal-form-bcnf)
6. [When to denormalize](#6-when-to-denormalize)
7. [Cheat sheet](#cheat-sheet)

---

## 0. Why normalize? Redundancy and anomalies

**In one sentence:** normalization is the process of organizing tables so that **each fact is stored in exactly one place**, which prevents contradictory data.

### In plain words
Imagine a school keeps one giant spreadsheet where every row is "student, course, teacher's phone number". Teacher Smith's phone number is copied into 200 rows. When Smith changes phones, someone must update all 200 rows. Miss one, and now the spreadsheet says Smith has two different phone numbers — which is right? Normalization splits the spreadsheet into smaller tables (students, courses, teachers) so Smith's phone number lives in **one** row.

### How it works
Storing the same fact many times (**redundancy**) causes three **anomalies**:
| Anomaly | Meaning | Example |
|---|---|---|
| **Update** | Changing a fact requires changing many rows; missing one creates contradictions | Smith's phone in 200 rows |
| **Insert** | You can't record a fact without an unrelated fact | Can't add a new teacher until some student enrolls in their course |
| **Delete** | Deleting one fact accidentally deletes another | The last student drops the course → Smith's phone is gone too |

The **normal forms** are a ladder of rules; each level removes a specific kind of redundancy:
```
1NF  →  2NF  →  3NF  →  BCNF  (→ 4NF, 5NF: rarely needed)
atomic   no partial   no transitive   every determinant
values   dependency   dependency      is a key
```
Each form includes all the previous ones (a table in 3NF is also in 2NF and 1NF).

---

## 1. Keys and functional dependencies (the vocabulary)

**In one sentence:** a **functional dependency** `A → B` means "if you know A, you know B for sure", and a **key** is a set of columns that determines every other column in a row.

### In plain words
- Your **student ID** determines your **name**: two rows with the same student ID must have the same name. So `student_id → name`.
- Your **name** does *not* determine your student ID (two students can both be "Ana Silva").

### How it works
- **Functional dependency (FD)** `X → Y`: any two rows that agree on X also agree on Y. X is the **determinant**.
- **Superkey:** a set of columns that determines *all* columns (uniquely identifies a row).
- **Candidate key:** a *minimal* superkey (remove any column and it stops being a key).
- **Primary key:** the candidate key you choose as the main identifier.
- **Prime attribute:** a column that is part of *some* candidate key.
- **Composite key:** a key made of several columns, e.g. `(student_id, course_id)`.

### Modern C++ example — checking whether a functional dependency holds
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <string>
#include <vector>

using Row = std::map<std::string, std::string>;       // column name -> value
using Table = std::vector<Row>;

// Does X -> Y hold? (Every pair of rows with the same X-values has the same Y-value.)
bool fd_holds(const Table& t, const std::vector<std::string>& X, const std::string& Y) {
    std::map<std::vector<std::string>, std::string> seen;   // X-values -> Y-value
    for (const auto& row : t) {
        std::vector<std::string> key;
        for (const auto& col : X) key.push_back(row.at(col));
        auto [it, inserted] = seen.emplace(key, row.at(Y));
        if (!inserted && it->second != row.at(Y)) return false;   // same X, different Y
    }
    return true;
}

int main() {
    Table students{
        {{"student_id", "1"}, {"name", "Ana Silva"}, {"city", "Lisbon"}},
        {{"student_id", "2"}, {"name", "Ana Silva"}, {"city", "Porto"}},
        {{"student_id", "3"}, {"name", "Ben Lee"},   {"city", "Lisbon"}},
    };
    std::cout << std::boolalpha;
    std::cout << "student_id -> name ? " << fd_holds(students, {"student_id"}, "name") << '\n';
    std::cout << "name -> student_id ? " << fd_holds(students, {"name"}, "student_id") << '\n';
    std::cout << "name -> city       ? " << fd_holds(students, {"name"}, "city") << '\n';
}
```

**Output:**
```text
student_id -> name ? true
name -> student_id ? false
name -> city       ? false
```
(Real FDs come from the *meaning* of the data, not just the current rows — but checking rows is a great way to catch violations.)

---

## 2. First Normal Form (1NF)

**In one sentence:** a table is in 1NF if every cell holds a **single, atomic value** (no lists, no repeating groups) and every row is unique.

### In plain words
A cell is like a box that should hold **one** thing. Stuffing "555-1234, 555-9876" into one phone box is like putting two letters in one envelope addressed to two people — sorting and searching become a mess ("find everyone with phone 555-9876" now needs text searching).

### How it works
Violations:
- **Multi-valued cells:** `phones = "555-1234, 555-9876"`.
- **Repeating groups:** columns `phone1, phone2, phone3`.
- **No way to tell rows apart** (no key).

Fix: put each value in its own row, usually in a **separate table** linked by a key.

**Before (not 1NF):**
| customer_id | name | phones |
|---|---|---|
| 1 | Ana | 555-1234, 555-9876 |
| 2 | Ben | 555-1111 |

**After (1NF):**
`customers`
| customer_id | name |
|---|---|
| 1 | Ana |
| 2 | Ben |

`customer_phones` (primary key: `customer_id, phone`)
| customer_id | phone |
|---|---|
| 1 | 555-1234 |
| 1 | 555-9876 |
| 2 | 555-1111 |

```sql
CREATE TABLE customers       (customer_id INTEGER PRIMARY KEY, name TEXT NOT NULL);
CREATE TABLE customer_phones (customer_id INTEGER REFERENCES customers(customer_id),
                              phone TEXT,
                              PRIMARY KEY (customer_id, phone));
SELECT customer_id FROM customer_phones WHERE phone = '555-9876';   -- now trivial
```

### Modern C++ example — splitting multi-valued cells into rows
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <ranges>
#include <string>
#include <string_view>
#include <vector>

struct CustomerRaw { int id; std::string name; std::string phones; };   // NOT 1NF
struct Customer    { int id; std::string name; };                        // 1NF
struct Phone       { int customer_id; std::string phone; };              // 1NF

std::string trim(std::string_view s) {
    while (!s.empty() && s.front() == ' ') s.remove_prefix(1);
    while (!s.empty() && s.back() == ' ') s.remove_suffix(1);
    return std::string(s);
}

int main() {
    std::vector<CustomerRaw> raw{{1, "Ana", "555-1234, 555-9876"}, {2, "Ben", "555-1111"}};

    std::vector<Customer> customers;
    std::vector<Phone> phones;
    for (const auto& r : raw) {
        customers.push_back({r.id, r.name});
        for (auto part : r.phones | std::views::split(','))          // one row per value
            phones.push_back({r.id, trim(std::string_view(part.begin(), part.end()))});
    }

    std::cout << "customer_phones:\n";
    for (const auto& p : phones) std::cout << "  " << p.customer_id << " | " << p.phone << '\n';

    // The query that was painful before is now a simple filter:
    for (const auto& p : phones)
        if (p.phone == "555-9876") std::cout << "555-9876 belongs to customer " << p.customer_id << '\n';
}
```

**Output:**
```text
customer_phones:
  1 | 555-1234
  1 | 555-9876
  2 | 555-1111
555-9876 belongs to customer 1
```

### Interview answer
"1NF requires atomic column values, no repeating groups and a way to uniquely identify rows. Multi-valued attributes move to a child table with one row per value."

---

## 3. Second Normal Form (2NF)

**In one sentence:** a table is in 2NF if it's in 1NF and **no non-key column depends on only part of a composite key** (no *partial dependencies*).

### In plain words
In an `enrollments` table keyed by `(student_id, course_id)`, the **grade** depends on *both* (a student's grade in a specific course). But the **student's name** depends only on `student_id` — it has nothing to do with the course. So the name is repeated in every course the student takes. That's a partial dependency: it only "half-belongs" in this table.

### How it works
- Only matters for tables with a **composite** key (a single-column key can't be "partly" depended on).
- Fix: move the partially dependent columns into a table keyed by the part they depend on.

**Before (1NF but not 2NF)** — key `(student_id, course_id)`:
| student_id | course_id | student_name | course_title | grade |
|---|---|---|---|---|
| 1 | DB101 | Ana | Databases | A |
| 1 | OS201 | Ana | Operating Systems | B |
| 2 | DB101 | Ben | Databases | C |

FDs: `student_id → student_name` (partial!), `course_id → course_title` (partial!), `(student_id, course_id) → grade`.

**After (2NF):**
- `students(student_id PK, student_name)`
- `courses(course_id PK, course_title)`
- `enrollments(student_id, course_id, grade, PK(student_id, course_id))`

### Modern C++ example — detect partial dependencies and decompose
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <set>
#include <string>
#include <tuple>
#include <vector>

struct Enrollment { int student_id; std::string course_id, student_name, course_title; char grade; };

int main() {
    std::vector<Enrollment> rows{
        {1, "DB101", "Ana", "Databases", 'A'},
        {1, "OS201", "Ana", "Operating Systems", 'B'},
        {2, "DB101", "Ben", "Databases", 'C'},
    };

    // Evidence of a partial dependency: the same student_name repeated across courses.
    std::map<int, int> name_copies;
    for (const auto& r : rows) ++name_copies[r.student_id];
    std::cout << "copies of Ana's name before 2NF: " << name_copies[1] << '\n';

    // Decompose: each fact goes to the table keyed by what it depends on.
    std::map<int, std::string> students;                      // student_id -> name
    std::map<std::string, std::string> courses;               // course_id -> title
    std::set<std::tuple<int, std::string, char>> enrollments; // (student, course) -> grade
    for (const auto& r : rows) {
        students[r.student_id] = r.student_name;
        courses[r.course_id] = r.course_title;
        enrollments.insert({r.student_id, r.course_id, r.grade});
    }

    students[1] = "Ana Silva";                                // rename: ONE place to change
    std::cout << "after 2NF: " << students.size() << " students, " << courses.size()
              << " courses, " << enrollments.size() << " enrollments\n";
    for (const auto& [sid, cid, grade] : enrollments)         // "join" back when needed
        std::cout << "  " << students[sid] << " took " << courses[cid] << ": " << grade << '\n';
}
```

**Output:**
```text
copies of Ana's name before 2NF: 2
after 2NF: 2 students, 2 courses, 3 enrollments
  Ana Silva took Databases: A
  Ana Silva took Operating Systems: B
  Ben took Databases: C
```

### Interview answer
"2NF is 1NF plus no partial dependencies: every non-prime attribute must depend on the whole of every candidate key, not a subset of it. Partially dependent attributes are moved to their own table keyed by the subset they depend on."

---

## 4. Third Normal Form (3NF)

**In one sentence:** a table is in 3NF if it's in 2NF and **no non-key column depends on another non-key column** (no *transitive dependencies*).

### In plain words
An `employees` table has `emp_id, name, dept_id, dept_name`. The department's name doesn't describe the *employee*; it describes the *department*. It's only in the table because it tags along with `dept_id`: `emp_id → dept_id → dept_name`. That chain is a **transitive dependency**. Rename the department and you must update every employee row in it.

Memory trick (Bill Kent): *"Every non-key attribute must provide a fact about **the key, the whole key, and nothing but the key** — so help me Codd."* (1NF: the key; 2NF: the whole key; 3NF: nothing but the key.)

### How it works
- Look for `key → A → B` where A is **not** a key: B depends on the key only *through* A.
- Fix: move `A → B` into its own table keyed by A.

**Before (2NF but not 3NF):**
| emp_id | name | dept_id | dept_name |
|---|---|---|---|
| 10 | Ana | D1 | Engineering |
| 11 | Ben | D1 | Engineering |
| 12 | Cara | D2 | Sales |

**After (3NF):**
- `employees(emp_id PK, name, dept_id FK)`
- `departments(dept_id PK, dept_name)`

```sql
UPDATE departments SET dept_name = 'R&D' WHERE dept_id = 'D1';   -- one row, no anomaly
```

### Modern C++ example — the update anomaly, before and after
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <set>
#include <string>
#include <vector>

struct EmployeeFlat { int emp_id; std::string name, dept_id, dept_name; };   // not 3NF

int main() {
    std::vector<EmployeeFlat> flat{
        {10, "Ana", "D1", "Engineering"}, {11, "Ben", "D1", "Engineering"}, {12, "Cara", "D2", "Sales"}};

    // A buggy update touches only ONE row of department D1:
    flat[0].dept_name = "R&D";
    std::set<std::string> names_for_d1;
    for (const auto& e : flat) if (e.dept_id == "D1") names_for_d1.insert(e.dept_name);
    std::cout << "before 3NF, D1 has " << names_for_d1.size() << " different names -> inconsistent!\n";

    // 3NF: department facts live in exactly one place.
    struct Employee { int emp_id; std::string name, dept_id; };
    std::vector<Employee> employees{{10, "Ana", "D1"}, {11, "Ben", "D1"}, {12, "Cara", "D2"}};
    std::map<std::string, std::string> departments{{"D1", "Engineering"}, {"D2", "Sales"}};

    departments["D1"] = "R&D";                       // one update, impossible to be inconsistent
    for (const auto& e : employees)
        std::cout << "  " << e.name << " works in " << departments.at(e.dept_id) << '\n';
}
```

**Output:**
```text
before 3NF, D1 has 2 different names -> inconsistent!
  Ana works in R&D
  Ben works in R&D
  Cara works in Sales
```

### Interview answer
"3NF is 2NF plus no transitive dependencies: non-key attributes must depend only on keys, not on other non-key attributes. Formally, for every FD X → A, either X is a superkey or A is a prime attribute. Transitively dependent attributes move to a table keyed by their determinant."

---

## 5. Boyce-Codd Normal Form (BCNF)

**In one sentence:** a table is in BCNF if **for every functional dependency X → Y, X is a superkey** — a slightly stricter version of 3NF.

### In plain words
3NF has a small loophole: it allows a dependency whose right side is part of a key. BCNF closes it with one simple rule: **only keys may determine things.** If some non-key column decides the value of another column, that relationship deserves its own table.

Classic example: each **instructor teaches exactly one course**, and a student takes each course with one instructor.

| student | course | instructor |
|---|---|---|
| Ana | Databases | Dr. Kim |
| Ben | Databases | Dr. Kim |
| Ana | Networks | Dr. Roy |
| Cara | Databases | Dr. Lee |

- Candidate keys: `(student, course)` and `(student, instructor)`.
- FD `instructor → course` — but `instructor` alone is **not** a superkey. → **Not BCNF.**
- It *is* in 3NF, because `course` is a prime attribute (part of a candidate key) — that's the loophole.
- Anomaly: "Dr. Kim teaches Databases" is repeated for every student; if Dr. Kim has no students, we can't record which course they teach.

**After (BCNF):**
- `instructors(instructor PK, course)`
- `enrollments(student, instructor, PK(student, instructor))`

Trade-off: BCNF decompositions are always **lossless** (you can join back to the original), but occasionally **not dependency-preserving** — here, the rule "a student takes each course with only one instructor" can no longer be enforced by a single table's key. That's why 3NF is sometimes chosen instead.

### Modern C++ example — find FDs whose determinant isn't a key
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <set>
#include <string>
#include <vector>

struct Row { std::string student, course, instructor; };

int main() {
    std::vector<Row> rows{
        {"Ana", "Databases", "Dr. Kim"}, {"Ben", "Databases", "Dr. Kim"},
        {"Ana", "Networks", "Dr. Roy"},  {"Cara", "Databases", "Dr. Lee"}};

    // Does instructor -> course hold?
    std::map<std::string, std::set<std::string>> courses_of;
    for (const auto& r : rows) courses_of[r.instructor].insert(r.course);
    bool fd = true;
    for (const auto& [ins, cs] : courses_of) fd = fd && cs.size() == 1;

    // Is instructor a superkey? (Does it identify a single row?)
    std::map<std::string, int> rows_per_instructor;
    for (const auto& r : rows) ++rows_per_instructor[r.instructor];
    bool superkey = true;
    for (const auto& [ins, n] : rows_per_instructor) superkey = superkey && n == 1;

    std::cout << std::boolalpha << "instructor -> course holds: " << fd
              << ", instructor is a superkey: " << superkey << '\n';
    if (fd && !superkey) std::cout << "=> violates BCNF: decompose\n";

    // Decompose into (instructor -> course) and (student, instructor)
    std::map<std::string, std::string> instructors;
    std::set<std::pair<std::string, std::string>> enrollments;
    for (const auto& r : rows) {
        instructors[r.instructor] = r.course;
        enrollments.insert({r.student, r.instructor});
    }
    // Lossless: joining back reproduces every original row.
    int rebuilt = 0;
    for (const auto& [student, ins] : enrollments)
        for (const auto& r : rows)
            if (r.student == student && r.instructor == ins && r.course == instructors[ins]) ++rebuilt;
    std::cout << "instructors table: " << instructors.size() << " rows, enrollments: "
              << enrollments.size() << " rows, rebuilt " << rebuilt << "/" << rows.size() << " original rows\n";
}
```

**Output:**
```text
instructor -> course holds: true, instructor is a superkey: false
=> violates BCNF: decompose
instructors table: 3 rows, enrollments: 4 rows, rebuilt 4/4 original rows
```

### Interview answer
"BCNF requires that for every non-trivial functional dependency X → Y, X is a superkey. It's stricter than 3NF, which also allows Y to be prime. BCNF decomposition is always lossless but may not preserve all dependencies, so 3NF is the pragmatic target when dependency preservation matters."

---

## 6. When to denormalize

Normalization optimizes for **correctness and easy writes**. Reading data then needs **joins**. For read-heavy systems (analytics, dashboards, feeds) you may deliberately **denormalize** — store copies or pre-computed results — to avoid expensive joins:
- Cached counters (`posts.comment_count`).
- Star schemas in data warehouses.
- [Materialized views](./Stored-Procedures-Triggers-Views.md#3-views).
- Document databases that embed related data ([NoSQL](./NoSQL.md)).

Rule of thumb: **normalize first (to 3NF/BCNF), denormalize on purpose** where measurements show a need — and keep the copies in sync (triggers, application code, or change-data-capture). More in [Database Design and Optimization](../System%20Design/Database-Design-and-Optimization.md).

---

## Cheat sheet

| Normal form | Rule | Removes |
|---|---|---|
| 1NF | Atomic values, no repeating groups, unique rows | Lists in cells |
| 2NF | 1NF + no partial dependency on a composite key | Facts about part of the key |
| 3NF | 2NF + no transitive dependency (non-key → non-key) | Facts about non-key columns |
| BCNF | Every determinant is a superkey | 3NF's prime-attribute loophole |

**"The key (1NF), the whole key (2NF), and nothing but the key (3NF)."**
