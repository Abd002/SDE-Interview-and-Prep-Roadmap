# Knowledge check

An exam on everything marked **Done** in the Notion study plan, one topic per round. After each round, this file records:
- the questions;
- a short version of your answers;
- the grade;
- the model answer for anything you missed.

The levels go into [Progress-Summary.md](Progress-Summary.md) §4.

**Rules:**
- Answer in your own words; short is fine.
- "I don't know" is a good answer when it's true: it shows what to review.
- No looking things up during a round. The point is to find the gaps.

| Round | Topic | Steps | Status |
|---|---|---|---|
| 1 | Relational model + SQL | L01, L02, HW1 | **Asked** |
| 2 | Storage + buffer pool | L03, L04, L05 | Next |
| 3 | Project 0: Count-Min Sketch | P0 | |
| 4 | OS: processes, threads, synchronization | Repo guides | |
| 5 | Distributed: Raft, linearizability, consensus | Raft §1–5, DDIA ch. 9, Jepsen | |
| 6 | Contest problems | CF Round 1074 A–D | |

---

## Round 1: relational model and SQL (asked 12 Oct 2026)

1. A **relation** in the relational model and a **table** in SQL are almost the same thing. What is the one big difference? What does SQL do because of it?
2. Name the basic **relational algebra** operators. How can you build a **join** from two of the others?
3. What's the difference between **WHERE** and **HAVING**? When does each one run?
4. What is a **window function**? How is it different from `GROUP BY`? Give an example.
5. Tables: `employee(id, name, dept_id, salary)`. Write a query that returns, **for each department, the employee(s) with the highest salary**. Ties should all be returned.
6. What does `WITH` (a **CTE**) do? When would you need `WITH RECURSIVE`?
7. What's the difference between `IN` and `EXISTS`? What goes wrong with `NOT IN` when the sub-query returns a `NULL`?
8. HW1 used **DuckDB**. What kind of database is it, and how is it different from PostgreSQL?

**Answers:** _(to fill in)_

**Grade:** _(to fill in)_
