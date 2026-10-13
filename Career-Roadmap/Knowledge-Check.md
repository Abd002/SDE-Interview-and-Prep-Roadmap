# Knowledge check

**What it covers:** everything marked **Done** in the Notion study plan, as **51 multiple-choice questions**. Each has one correct answer, taken from the **main resource of that step** in the plan (linked under each Part).

**How to answer:**
- Reply with the question number and a letter, for example: `1C 2A 3D …`
- If you don't know, write `?` instead of guessing. That shows what to review.
- Don't look anything up. The point is to find the gaps.

**After grading,** this file gets your answers, your score per part and the explanation for every wrong answer. Your level per topic goes into [Progress-Summary.md](Progress-Summary.md) §4 and into Notion.

| Part | Topic | From | Questions |
|---|---|---|---|
| 1 | Relational model + SQL | CMU L01, L02, HW1 | 1–8 |
| 2 | Storage + buffer pool | CMU L03, L04, L05 | 9–20 |
| 3 | Project 0: Count-Min Sketch | CMU P0 | 21–26 |
| 4 | OS: processes, threads, synchronization | Repo guides | 27–36 |
| 5 | Distributed systems | Raft §1–5, DDIA ch. 9, Jepsen | 37–47 |
| 6 | Contest problems | CF Round 1074 A–D | 48–51 |

---

## Part 1: Relational model and SQL

> **Source:** CMU 15-445 Fall 2025 [L01 notes](https://15445.courses.cs.cmu.edu/fall2025/notes/01-relationalmodel.pdf) · [L02 notes](https://15445.courses.cs.cmu.edu/fall2025/notes/02-modernsql.pdf) · [HW1](https://15445.courses.cs.cmu.edu/fall2025/homework1/)

**1. What is the main difference between a relation (relational model) and a table in SQL?**
- A) Relations are ordered; tables are not
- B) Relations allow NULL; tables don't
- C) A relation is a set (no duplicates); a SQL table is a bag, so SQL keeps duplicates unless you use `DISTINCT`
- D) There is no difference

**2. What does "data independence" mean in the relational model?**
- A) The user/application is isolated from how the data is stored; the DBMS can change the layout without changing the queries
- B) Each table lives in its own file
- C) Tables can't reference each other
- D) Data is stored without a schema

**3. What is the difference between `WHERE` and `HAVING`?**
- A) `HAVING` filters rows before grouping; `WHERE` filters after
- B) They do the same thing
- C) `HAVING` sorts the groups
- D) `WHERE` filters rows before grouping; `HAVING` filters groups after aggregation

**4. How is a window function different from `GROUP BY`?**
- A) A window function collapses the rows into one row per group, like `GROUP BY`
- B) It computes a value over related rows (the "window") but keeps every row in the result
- C) It only works in DuckDB
- D) It can't use `ORDER BY`

**5. Table `employee(id, name, dept_id, salary)`. Which query gives, for each department, the employee(s) with the highest salary, including ties?**
- A) `SELECT dept_id, name, MAX(salary) FROM employee GROUP BY dept_id`
- B) `SELECT * FROM employee ORDER BY salary DESC LIMIT 1`
- C) Compute `RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC)` in a sub-query, then keep the rows where the rank = 1
- D) Same as C, but with `ROW_NUMBER()` instead of `RANK()`

**6. When do you need `WITH RECURSIVE`?**
- A) For hierarchies or graphs, for example "all managers above this employee"
- B) For any join
- C) For any aggregation
- D) To create a new table

**7. In a nested query, `x IN (sub-query)` is equivalent to:**
- A) `x = ALL (sub-query)`
- B) `EXISTS (sub-query)` with no condition
- C) `x <> ANY (sub-query)`
- D) `x = ANY (sub-query)`

**8. In `WHERE login LIKE '%@cs'`, what does `%` match?**
- A) Exactly one character
- B) Any substring, including an empty one
- C) Only digits
- D) A literal percent sign

## Part 2: Storage and buffer pool

> **Source:** CMU 15-445 Fall 2025 [L03 notes](https://15445.courses.cs.cmu.edu/fall2025/notes/03-storage1.pdf) · [L04 notes](https://15445.courses.cs.cmu.edu/fall2025/notes/04-bufferpool.pdf) · [L05 notes](https://15445.courses.cs.cmu.edu/fall2025/notes/05-storage2.pdf) (+ the slides with the same numbers)

**9. Why do most database systems avoid `mmap`?**
- A) The OS can write dirty pages to disk at any time, page faults stall threads, and errors are hard to handle
- B) `mmap` can't read database files
- C) `mmap` only works on Windows
- D) `mmap` uses too little memory

**10. What is a slotted page?**
- A) Every tuple must be the same size
- B) Each page holds one tuple only
- C) A slot array at the start maps slot numbers to tuple offsets; tuples are added from the end
- D) The slot array is stored on a separate page

**11. A record ID is made of:**
- A) Table name + primary key
- B) A hash of the tuple
- C) A byte offset in the file, only
- D) Page ID + slot number

**12. What is the difference between the page table and the page directory?**
- A) Both are stored on disk
- B) Page table: page ID → frame in memory (not saved on disk). Page directory: page ID → place on disk (saved on disk)
- C) They are the same thing
- D) The page directory is kept in memory only

**13. A page's pin count is greater than 0. What does that mean?**
- A) The page is in use and can't be evicted
- B) The page is dirty
- C) A transaction holds a lock on the page
- D) The page is only on disk

**14. What is "sequential flooding"?**
- A) Too many writes at once
- B) The disk is full
- C) A big sequential scan fills the buffer pool and pushes out useful pages under LRU or CLOCK
- D) Too many locks

**15. How does the CLOCK replacement policy work?**
- A) It keeps a timestamp per page and evicts the oldest
- B) Each page has a reference bit; the clock hand turns 1s into 0s and evicts the first page with 0
- C) It evicts a random page
- D) It counts how often each page is used

**16. What is the difference between locks and latches?**
- A) They are the same
- B) Latches are for transactions; locks are for internal data structures
- C) Locks only exist in the OS
- D) Locks protect database contents between transactions and can roll back; latches protect internal data structures for a short time

**17. In an LSM tree (log-structured storage), where does a write go first?**
- A) Into an in-memory MemTable. When it's full, it is sorted and written to disk as an immutable SSTable
- B) Directly into sorted pages on disk, in place
- C) Into B+Tree leaves
- D) Into a log that is never sorted

**18. What does compaction do in an LSM tree?**
- A) It makes writes free
- B) It deletes the MemTable
- C) It merges SSTables and keeps only the newest version of each key: faster reads and less space, but extra writes (write amplification)
- D) It compresses pages with zip

**19. What does a Bloom filter tell you in an LSM tree?**
- A) The exact location of a key
- B) "Definitely not in this file" (no false negatives), or "maybe in this file" (false positives are possible)
- C) The keys in sorted order
- D) It can miss keys that are really there

**20. What does `O_DIRECT` do?**
- A) Makes networking faster
- B) Turns on DMA hardware
- C) Turns off `fsync`
- D) Bypasses the OS page cache, so pages aren't cached twice and the DBMS controls eviction

## Part 3: Project 0, Count-Min Sketch

> **Source:** [P0 C++ Primer page](https://15445.courses.cs.cmu.edu/fall2025/project0/)

**21. How does `Count(item)` estimate the count?**
- A) The sum of the item's counters over all rows
- B) The minimum of the item's counters over all rows
- C) The maximum
- D) The average

**22. What kind of error can a Count-Min Sketch make?**
- A) It never counts lower than the true count, but it can count higher
- B) It can count lower than the true count
- C) It is always exact
- D) It can be randomly higher or lower

**23. What happens if you make the sketch wider (more columns)?**
- A) It uses more hash functions
- B) It uses less memory
- C) Fewer collisions in each row, so smaller overestimates
- D) Nothing changes

**24. What is the depth of the sketch?**
- A) The number of columns
- B) The number of items
- C) The number of threads
- D) The number of rows, each with its own hash function

**25. How do you merge two sketches?**
- A) Add them cell by cell. Both must have the same width, depth and hash functions
- B) Take the maximum of each cell
- C) Put the rows one after another
- D) You can't merge them

**26. P0 required `Insert` to be thread-safe and faster than a single-threaded version. What does that?**
- A) One global mutex around `Insert`
- B) No synchronization at all
- C) Atomic counters (`fetch_add`) or one latch per row, so threads rarely wait for each other
- D) Sleeping between inserts

## Part 4: OS, processes, threads and synchronization

> **Source:** repo guides [Processes](../Operating%20Systems/Processes.md) · [Threads](../Operating%20Systems/Threads.md) · [Thread synchronization](../Operating%20Systems/Thread-Synchronization.md)

**27. What do threads of the same process share?**
- A) Their stacks
- B) The heap, global variables and open files
- C) Their registers
- D) Their program counters

**28. What does `fork()` return?**
- A) The PID, in both processes
- B) 0 in the parent
- C) Nothing
- D) 0 in the child and the child's PID in the parent (−1 on error)

**29. What does `exec()` do?**
- A) Replaces the current program with a new one; the PID stays the same
- B) Creates a new process
- C) Waits for a child
- D) Kills the process

**30. What is a zombie process?**
- A) A process whose parent died
- B) A process in an infinite loop
- C) A child that has finished, but its parent hasn't called `wait()` yet
- D) A sleeping process

**31. What is a context switch?**
- A) Changing the logged-in user
- B) Saving the state of the running task and loading another's; it's overhead
- C) Moving a process to another computer
- D) Something that costs nothing

**32. A semaphore starts at 3. What does that mean?**
- A) At most 3 threads can be inside at the same time
- B) Exactly 3 threads must wait
- C) It's a mutex
- D) It waits 3 seconds

**33. What is the difference between a mutex and a binary semaphore?**
- A) There is none
- B) A semaphore is always faster
- C) A mutex counts
- D) A mutex has an owner (only the thread that locked it should unlock it); a semaphore can be released by any thread

**34. Why do you wait on a condition variable inside a loop (or with a predicate)?**
- A) It's faster
- B) Because of spurious wake-ups, and the condition can be false again by the time the thread runs
- C) The compiler requires it
- D) It prevents all deadlocks

**35. What is the difference between `std::jthread` and `std::thread`?**
- A) `jthread` is a process
- B) `jthread` is always faster
- C) `jthread` joins automatically in its destructor and supports `stop_token`
- D) There is no difference

**36. What simple rule prevents deadlocks when you need several locks?**
- A) Always take the locks in the same global order
- B) Use more threads
- C) Sleep before locking
- D) Use bigger stacks

## Part 5: Distributed systems (Raft, DDIA ch. 9, Jepsen)

> **Source:** [Raft paper](https://raft.github.io/raft.pdf) §1–5 (Q37–41) · [Jepsen consistency models](https://jepsen.io/consistency/models) (Q42, Q46, Q47) · *DDIA* ch. 9 (Q43–45; a paid book, so these were not checked against an online copy)

**37. Why is Raft's election timeout random?**
- A) To save power
- B) For security
- C) To order the log
- D) So two followers rarely time out together, which stops split votes from repeating

**38. When is a log entry committed in Raft?**
- A) When the leader writes it to its own log
- B) When it's stored on a majority of servers
- C) When it's stored on all servers
- D) When the client acknowledges it

**39. What is a term in Raft?**
- A) Wall-clock time
- B) A log index
- C) A logical clock number; each term has at most one leader
- D) The number of nodes

**40. What is the election restriction?**
- A) A server votes only for a candidate whose log is at least as up to date as its own (higher last term, or the same last term and at least as long)
- B) The oldest server becomes leader
- C) The server with the most votes ever wins
- D) The leader is chosen at random

**41. How many failed servers can a 5-node Raft cluster tolerate?**
- A) 1
- B) 2
- C) 3
- D) 4

**42. What is linearizability?**
- A) Eventual consistency
- B) The same as serializability
- C) Causal consistency
- D) The system acts as if there is one copy of the data; each operation takes effect at one instant between its start and its end

**43. What do Lamport timestamps give you?**
- A) A total order that respects causality
- B) Synchronized wall clocks
- C) Linearizability
- D) A way to detect that two operations were concurrent

**44. Total order broadcast is equivalent to:**
- A) Gossip
- B) Two-phase commit
- C) Consensus
- D) Caching

**45. What is the main problem with two-phase commit (2PC)?**
- A) It's too fast
- B) It blocks if the coordinator crashes after the participants voted "yes"
- C) It needs a majority
- D) It has no log

**46. CAP: during a network partition, you must choose between:**
- A) CPU and memory
- B) Nothing; you always get both
- C) Nothing; partitions can't happen
- D) Consistency (linearizability) and availability

**47. What is the difference between serializable and linearizable (Jepsen map)?**
- A) They are the same
- B) Serializable is about one object; linearizable is about transactions
- C) Serializable: transactions behave as if they ran one at a time, in some order. Linearizable: recency for single objects. Strict serializable gives both
- D) Neither one guarantees anything

## Part 6: Contest problems (CF Round 1074, Div. 4)

> **Source:** [CF Round 1074 PDF with the official hints](../Contest-Practice/Codeforces/CF-2185-Div4-Round1074.pdf)

**48. A. Perfect Root: x is a perfect root if √y = x for some integer y. What is a valid answer for n?**
- A) 1, 2, …, n, because every x = √(x²)
- B) Only perfect squares
- C) Only primes
- D) Only powers of 2

**49. B. Prefix Max: what is the best value you can get with at most one swap?**
- A) The sum of the array
- B) Sort descending, then the sum of all elements
- C) The maximum plus the sum
- D) n × max(a), by swapping the maximum to the front

**50. C. Shifted MEX: what is the answer?**
- A) The number of distinct values
- B) The longest run of consecutive distinct values
- C) max − min + 1
- D) n

**51. D. OutOfMemoryError: how do you do the resets fast?**
- A) Copy the whole array back at every crash, O(n·m)
- B) Sort the operations
- C) Remember which indices changed since the last reset and restore only those: O(n + m) in total
- D) Binary search

---

## Results

**Round 1, 13 Oct 2026** (no revision before the test). Answered Parts 2, 4 and 5. Parts 1, 3 and 6 were skipped: you solved them long ago and don't remember them.

| Part | Score | Level |
|---|---|---|
| 1 Relational model + SQL | not answered | — |
| 2 Storage + buffer pool | **10/12** | OK |
| 3 Project 0: Count-Min Sketch | not answered | — |
| 4 OS: processes, threads, synchronization | **10/10** | Strong |
| 5 Distributed systems | **8/10** answered, Q45 skipped | OK |
| 6 Contest problems | not answered | — |
| **Total** | **28/32 = 88%** of the questions you answered | |

<details><summary>Every answer</summary>

| Q | You | Right | |
|---|---|---|---|
| 9 | A | A | ✅ |
| 10 | C | C | ✅ |
| 11 | D | D | ✅ |
| 12 | B | B | ✅ |
| 13 | A | A | ✅ |
| 14 | C | C | ✅ |
| 15 | B | B | ✅ |
| 16 | D | D | ✅ |
| 17 | A | A | ✅ |
| 18 | C | C | ✅ |
| 19 | A | B | ❌ |
| 20 | C | D | ❌ |
| 27 | B | B | ✅ |
| 28 | D | D | ✅ |
| 29 | A | A | ✅ |
| 30 | C | C | ✅ |
| 31 | B | B | ✅ |
| 32 | A | A | ✅ |
| 33 | D | D | ✅ |
| 34 | B | B | ✅ |
| 35 | C | C | ✅ |
| 36 | A | A | ✅ |
| 37 | D | D | ✅ |
| 38 | B | B | ✅ |
| 39 | C | C | ✅ |
| 40 | A | A | ✅ |
| 41 | B | B | ✅ |
| 42 | D | D | ✅ |
| 43 | B | A | ❌ |
| 44 | A | C | ❌ |
| 45 | — | B | skipped |
| 46 | D | D | ✅ |
| 47 | C | C | ✅ |

</details>

### What to re-read (the 5 missed concepts)
| Q | The right answer, and why | Re-read |
|---|---|---|
| 19 Bloom filter | **B.** A Bloom filter answers only "is this key possibly in this file?". "No" is always right (no false negatives); "yes" can be wrong (false positives). It never tells you *where* the key is. That is the job of the SSTable's sorted keys and min/max keys. | [L05 notes](https://15445.courses.cs.cmu.edu/fall2025/notes/05-storage2.pdf) §3 "Log-Structured Storage" (the SummaryTable keeps a key filter, e.g. a Bloom filter, per level). The notes only name it; the false-positive rule is from the Bloom-filter video linked on the [P0 page](https://15445.courses.cs.cmu.edu/fall2025/project0/). |
| 20 `O_DIRECT` | **D.** `O_DIRECT` makes reads and writes bypass the OS page cache, so pages aren't cached twice and the DBMS controls eviction itself. It does **not** turn off `fsync`; you still need `fsync` for durability. PostgreSQL is the exception that uses the OS cache. | [L04 notes](https://15445.courses.cs.cmu.edu/fall2025/notes/04-bufferpool.pdf) §5 "Disk I/O and OS Cache" (Direct I/O) |
| 43 Lamport timestamps | **A.** Each node keeps a counter (and its node ID). It sends the counter with every message and takes the max on receive. Comparing (counter, node ID) gives a **total order that is consistent with causality**. They are **not** wall clocks, and they can't tell you whether two operations were concurrent (that needs version vectors). | *DDIA* ch. 9, "Sequence Number Ordering → Lamport timestamps" |
| 44 Total order broadcast | **C.** Delivering every message to every node in the same order is **equivalent to consensus**: each one can be built from the other. Raft's replicated log is exactly a total order broadcast. | *DDIA* ch. 9, "Total Order Broadcast"; [Raft paper](https://raft.github.io/raft.pdf) §2 (replicated state machines) |
| 45 2PC (skipped) | **B.** In two-phase commit, after a participant votes "yes" it must wait for the coordinator's decision. If the coordinator crashes then, the participant is **"in doubt" and blocked**: it can neither commit nor abort on its own. Raft avoids this with a majority instead of a single coordinator. | *DDIA* ch. 9, "Atomic Commit and Two-Phase Commit (2PC)" |

**Next round:** Parts 1, 3 and 6 (none answered yet), plus 5 new questions on these 5 concepts. Do it after re-reading the table above.

**Answer key changed on 13 Oct:** the sources check (below) found that 3 Part 1 questions were not taught in the step's main resource (join from product + selection, `NOT IN` with `NULL`, what kind of database DuckDB is). Q2, Q7 and Q8 were replaced with questions from the L01 and L02 notes. You hadn't answered Part 1, so no score changed.

### Sources check (13 Oct 2026)
Every right answer was checked against the main resource of its step in the Notion plan (the Link and Notes of each Done step):
- **Parts 1–3:** CMU 15-445 Fall 2025 lecture notes and slides 01–05, the P0 page and the HW1 page. All match. Q19's "no false negatives" detail is only in the P0 page's linked video, not in the L05 notes.
- **Part 4:** the repo's Processes, Threads and Thread-Synchronization guides. All match (Q36: Thread-Synchronization, "Common mistakes" under Mutex).
- **Part 5:**
  - Q37–41 match the Raft paper (§5.1 terms, §5.2 random timeouts, §5.3 majority commit, §5.4.1 election restriction, "five servers can tolerate two failures").
  - Q42, Q46 and Q47 match the Jepsen pages ("linearizable … cannot be totally available"; "strict serializable implies both serializability and linearizability").
  - Q43–45 come from *DDIA* ch. 9, which isn't online, so they were not checked against the text.
- **Part 6:** the round's problem statements and official hints in `Contest-Practice/`.
