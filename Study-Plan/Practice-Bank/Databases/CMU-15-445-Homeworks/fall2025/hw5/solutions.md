# CMU 15-445 Fall 2025: Homework 5: Official solutions

> Copied from the original: <https://15445.courses.cs.cmu.edu/fall2025/assignments.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CARNEGIE MELLON UNIVERSITY<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;COMPUTER SCIENCE DEPARTMENT<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;15-445/645 – DATABASE SYSTEMS (FALL 2025)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;PROF. ANDY PAVLO

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #5 (by Will) – Solutions<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Due: **Sunday Nov 16, 2025 @ 11:59pm**

**IMPORTANT:**<br>
&emsp;• Enter all of your answers into **Gradescope by 11:59pm on Sunday Nov 16, 2025**.<br>
&emsp;• **Plagiarism**: Homework may be discussed with other students, but all homework is to be<br>
&emsp;&emsp;completed **individually**.<br>
For your information:<br>
&emsp;• Graded out of **100** points; **4** questions total<br>
&emsp;• Rough time estimate: ≈2 - 4 hours (0.5 - 1 hours for each question)<br>
&emsp;• Each part is all or nothing. There is no partial credit.<br>
&emsp;Revision : 2025/11/26 10:29

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Question   Points   Score<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Serializability and 2PL   30<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Hierarchical Locking   30<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Optimistic Concurrency Control   25<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Multi-Version Concurrency Control   15<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Total:   100

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1


---

<a id="page-2"></a>
**Page 2**

15-445/645 (Fall 2025)   Homework #5   Page 2 of 11


### **Question 1: Serializability and 2PL. . . . . . . . . . . . . . . . . . . . . . . . . . . .\[30 points\]**

&emsp;(a) True/False Questions:<br>
&emsp;&emsp;&emsp;i. **\[2 points\]** 2PL is an optimistic concurrency control protocol.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** False. 2PL is considered a pessimistic concurrency control protocol be-<br>
&emsp;&emsp;&emsp;&emsp;cause it uses locks to prevent conflicts before they can occur. By ensuring transac-<br>
&emsp;&emsp;&emsp;&emsp;tions follow a strict locking protocol, 2PL aims to prevent any possible conflicts, in<br>
&emsp;&emsp;&emsp;&emsp;contrast to optimistic protocols which allow conflicts but then resolve them.<br>
&emsp;&emsp;&emsp;ii. **\[2 points\]** Strong strict Two-Phase Locking (2PL) prevents the occurrence of cas-<br>
&emsp;&emsp;&emsp;&emsp;cading aborts and inherently avoids deadlocks without the need for additional pre-<br>
&emsp;&emsp;&emsp;&emsp;vention or detection techniques.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** False. While strict 2PL prevents cascading aborts by holding all the<br>
&emsp;&emsp;&emsp;&emsp;locks until a transaction reaches its commit point, ensuring that other transactions<br>
&emsp;&emsp;&emsp;&emsp;do not see the intermediate, uncommitted data, it does not inherently resolve dead-<br>
&emsp;&emsp;&emsp;&emsp;locks. Deadlocks, which are situations where two or more transactions prevent each<br>
&emsp;&emsp;&emsp;&emsp;other from progressing by holding locks that the other needs, still require specific<br>
&emsp;&emsp;&emsp;&emsp;detection or prevention mechanisms in strict 2PL.<br>
&emsp;&emsp;&emsp;iii. **\[2 points\]** Using regular (i.e., not strong strict) 2PL guarantees a conflict serializ-<br>
&emsp;&emsp;&emsp;&emsp;able schedule.<br>
&emsp;&emsp;&emsp;&emsp;☒ **True**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  False<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** True. Using regular 2PL guarantees a conflict serializable schedule be-<br>
&emsp;&emsp;&emsp;&emsp;cause it generates schedules whose precedence graph is acyclic. This is because<br>
&emsp;&emsp;&emsp;&emsp;this ordering of acquiring resources (via the locks) ensures that there is a order of<br>
&emsp;&emsp;&emsp;&emsp;acquisition precedence.<br>
&emsp;&emsp;&emsp;iv. **\[2 points\]** Every view-serializable schedule is always conflict-equivalent to at least<br>
&emsp;&emsp;&emsp;&emsp;one conflict-serializable schedule.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** False. View-Serializable schedules permits schedules with “blind” writes<br>
&emsp;&emsp;&emsp;&emsp;that may not be conflict-serializable.<br>
&emsp;&emsp;&emsp;v. **\[2 points\]** Conflict-serializable schedules prevent unrepeatable reads and dirty reads.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** False. Conflict-serializability ensures that the schedule is conflict equiv-<br>
&emsp;&emsp;&emsp;&emsp;alent to a serial schedule, thus protecting against unrepeatable reads. However, dirty<br>
&emsp;&emsp;&emsp;&emsp;reads can still occur in conflict-serializable schedules, especially when considering<br>
&emsp;&emsp;&emsp;&emsp;cascading aborts. If a transaction reads data written by another transaction which<br>
&emsp;&emsp;&emsp;&emsp;later gets aborted, then the first transaction has effectively read ”dirty” data.


### Question 1 continues...


---

<a id="page-3"></a>
**Page 3**

15-445/645 (Fall 2025)   Homework #5   Page 3 of 11

&emsp;(b) Serializability:<br>
&emsp;&emsp;&emsp;Consider the schedule of 4 transactions in Table 1. R(·) and W(·) stand for ‘Read’ and<br>
&emsp;&emsp;&emsp;‘Write’, respectively, and time increases from left to right. (This is in contrast to the<br>
&emsp;&emsp;&emsp;diagrams in class, where time proceeded downward.)<br>
&emsp;&emsp;&emsp;&emsp;t1   t2   t3   t4   t5   t6   t7   t8   t9   t10<br>
&emsp;&emsp;T1   W(B)   W(A)<br>
&emsp;&emsp;T2   R(C)   R(A)<br>
&emsp;&emsp;T3   W(B)   W(C)   R(D)<br>
&emsp;&emsp;T4   R(D)   W(B)   W(A)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Table 1: A schedule with 4 transactions<br>
&emsp;&emsp;&emsp;i. **\[3 points\]** Is this schedule serial?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **No**<br>
&emsp;&emsp;&emsp;&emsp;☐  Yes<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** This schedule isn’t serial because this schedule interleaves the actions of<br>
&emsp;&emsp;&emsp;&emsp;different transactions.<br>
&emsp;&emsp;&emsp;ii. **\[8 points\]** Compute the conflict dependency graph for the schedule in Table 1, se-<br>
&emsp;&emsp;&emsp;&emsp;lecting all edges (and the object that caused the dependency) that appear in the graph.<br>
&emsp;&emsp;&emsp;&emsp;☒ T1 →T2   ☒ T2 →T3   ☒ T2 →T4<br>
&emsp;&emsp;&emsp;&emsp;☐  T2 →T1   ☐  T3 →T2   ☐  T4 →T2<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ T1 →T4   ☒ T3 →T4<br>
&emsp;&emsp;&emsp;&emsp;☐  T1 →T3<br>
&emsp;&emsp;&emsp;&emsp;☒ T3 →T1<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  T4 →T1   ☐  T4 →T3

&emsp;&emsp;&emsp;&emsp;**Solution:** The answer is:<br>
&emsp;&emsp;&emsp;&emsp;For A, there are W-R conflict from T1 to T2, R-W conflict from T2 to T4, and W-W<br>
&emsp;&emsp;&emsp;&emsp;conflict from T1 to T4;<br>
&emsp;&emsp;&emsp;&emsp;For B, there are W-W conflict from T3 to T1, T1 to T4, and T3 to T4;<br>
&emsp;&emsp;&emsp;&emsp;For C, there is R-W conflict from T2 to T3;<br>
&emsp;&emsp;&emsp;&emsp;For D, there is no conflict.<br>
&emsp;&emsp;&emsp;iii. **\[3 points\]** Is this schedule conflict serializable?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **No**<br>
&emsp;&emsp;&emsp;&emsp;☐  Yes<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** This schedule isn’t conflict serializable because there is a cycle in its<br>
&emsp;&emsp;&emsp;&emsp;data dependency graph. Moreover, this schedule is not conflict equivalent (every<br>
&emsp;&emsp;&emsp;&emsp;pair of conflicting operations is ordered in the same way) to any serial schedule of<br>
&emsp;&emsp;&emsp;&emsp;transaction execution.<br>
&emsp;&emsp;&emsp;iv. **\[3 points\]** Is this schedule view serializable?<br>
&emsp;&emsp;&emsp;&emsp;☒ **Yes**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  No<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** To determine if the schedule is view serializable, we need to check it<br>
&emsp;&emsp;&emsp;&emsp;against three criteria for view equivalence for original schedule S1 and serial sched-<br>
&emsp;&emsp;&emsp;&emsp;ule S2:


### Question 1 continues...


---

<a id="page-4"></a>
**Page 4**

15-445/645 (Fall 2025)   Homework #5   Page 4 of 11

&emsp;&emsp;&emsp;&emsp;&emsp;1\. If Ti reads the initial value of A in S1, then Ti must also read the initial value<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;of A in S2.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;2\. If Ti reads a value of A written by Tj in S1, then Ti must also read that value<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;of A written by Tj in S2.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;3\. If Ti writes the final value of A in S1, then Ti must also write the final value<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;of A in S2.<br>
&emsp;&emsp;&emsp;&emsp;From our analysis, we found a possible serial schedule that is view-equivalent to<br>
&emsp;&emsp;&emsp;&emsp;the given schedule: T1 →T2 →T3 →T4. This serial schedule fulfills the criteria<br>
&emsp;&emsp;&emsp;&emsp;for view equivalence:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;• T1 writes B and A.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;• T2 reads the initial value of C and the value of A written by T1.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;• T3 write B, writes the final version of C, and reads the initial value of D.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;• T4 reads the initial value of D, writes the final version of B, and writes the<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;final version of A.<br>
&emsp;&emsp;&emsp;&emsp;Therefore, this serial schedule is view-equivalent to the original one, so it is proved<br>
&emsp;&emsp;&emsp;&emsp;to be view-serializable. Importantly, compared to conflict serializability, view se-<br>
&emsp;&emsp;&emsp;&emsp;rializability allows all conflict serializable schedules along with “blind writes”, en-<br>
&emsp;&emsp;&emsp;&emsp;suring database consistency after all transactions are committed.<br>
&emsp;&emsp;&emsp;v. **\[3 points\]** Is this schedule possible under regular 2PL?<br>
&emsp;&emsp;&emsp;&emsp;☐  Yes<br>
&emsp;&emsp;&emsp;&emsp;☒ **No**<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** This schedule is not possible under 2PL because it is not conflict serial-<br>
&emsp;&emsp;&emsp;&emsp;izable, and 2PL is guaranteed to produce conflict serializable schedules.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #5 continues...


---

<a id="page-5"></a>
**Page 5**

15-445/645 (Fall 2025)   Homework #5   Page 5 of 11


### **Question 2: Hierarchical Locking . . . . . . . . . . . . . . . . . . . . . . . . . . . . . \[30 points\]**

&emsp;Consider a database `D` consisting of two tables `C` (which stores information about companies)<br>
&emsp;and `P` (which stores information about products). Specifically:<br>
&emsp;&emsp;• `P(pid,` `name,` `company` `id,` `category,` `status,` `market,` `release` `year,` `units` `sold)`<br>
&emsp;&emsp;• `C(cid,` `name,` `type,` `headquarters,` `ceo` `gender,` `founded` `year)`<br>
&emsp;Table `P` spans 2500 pages, which we denote `P1` to `P2500`. Table `C` spans 150 pages, which we<br>
&emsp;denote `C1` to `C150`. Each page contains 160 records. We use the notation `P3.20` to denote the<br>
&emsp;twentieth record on the third page of table `P`. There are no indexes on these tables.<br>
&emsp;Suppose the database supports shared and exclusive hierarchical intention locks (`S`, `X`, `IS`, `IX`<br>
&emsp;and `SIX`) at four levels of granularity: database-level (`D`), table-level (`P` and `C`), page-level (e.g.,<br>
&emsp;`P10`), and record-level (e.g., `P10.42`). We use the notation `IS(D)` to mean a shared database-<br>
&emsp;level intention lock, and `X(C2.20-C3.80)` to mean a set of exclusive locks on the records from<br>
&emsp;the 20th record on the second page to the 80th record on the third page of table `C`.<br>
&emsp;For each of the following operations below, what sequence of lock requests should be gener-<br>
&emsp;ated to **maximize the potential for concurrency** while guaranteeing correctness?<br>
&emsp;(a) **\[5 points\]** Find the product record that has the largest `units` `sold` where `release_year` `=` `1996`.<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `X(P)`<br>
&emsp;&emsp;&emsp;☒ `IS(D),` `S(P)`<br>
&emsp;&emsp;&emsp;☐  `S(D)`<br>
&emsp;&emsp;&emsp;☐  `IS(D),` `IS(P)`

&emsp;&emsp;&emsp;**Solution:** The correct choice is `IS(D),` `S(P)`. The query needs to scan all records in `P`<br>
&emsp;&emsp;&emsp;to find the product with the largest units sold. So, it requires a shared lock on `P`.<br>
&emsp;&emsp;&emsp;&emsp;• `S(D)` is incorrect because it doesn’t acquire the intended parent locks necessary to<br>
&emsp;&emsp;&emsp;&emsp;&emsp;obtain the `S(P)` lock for reading the table `P`.<br>
&emsp;&emsp;&emsp;&emsp;• `IS(D),` `IS(P)` is incorrect because it only states the intention to read-access the<br>
&emsp;&emsp;&emsp;&emsp;&emsp;table P but doesn’t actually acquire the lock to perform the read.<br>
&emsp;&emsp;&emsp;&emsp;• `IX(D),` `X(P)` is incorrect because it accesses an intended exclusive lock, which is<br>
&emsp;&emsp;&emsp;&emsp;&emsp;not needed for a read-only query.<br>
&emsp;(b) **\[4 points\]** Update the `type` of all companies in table C with the `name` `=` `'MegaCorp'` to<br>
&emsp;&emsp;&emsp;`'Conglomerate'`<br>
&emsp;&emsp;&emsp;☐  `X(D)`<br>
&emsp;&emsp;&emsp;☐  `SIX(D),` `X(C)`<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `IX(C)`<br>
&emsp;&emsp;&emsp;☒ `IX(D),` `X(C)`


### Question 2 continues...


---

<a id="page-6"></a>
**Page 6**

15-445/645 (Fall 2025)   Homework #5   Page 6 of 11

&emsp;&emsp;&emsp;**Solution:** The correct answer choice is `IX(D),` `X(C)`. This is because we potentially<br>
&emsp;&emsp;&emsp;need to modify records in table C where the company’s name is `'MegaCorp'`, and this<br>
&emsp;&emsp;&emsp;choice accesses the intended exclusive parent lock to get the exclusive lock on those<br>
&emsp;&emsp;&emsp;specific rows in table `C`.<br>
&emsp;&emsp;&emsp;&emsp;• `X(D)` is incorrect because it gains an exclusive lock on the entire database `D` when<br>
&emsp;&emsp;&emsp;&emsp;&emsp;it only needs to modify specific rows in table `C`.<br>
&emsp;&emsp;&emsp;&emsp;• `SIX(D),` `X(C)` is incorrect because it gains a shared intention lock on the database<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`D` when it has no need to read the contents of `D`.<br>
&emsp;&emsp;&emsp;&emsp;• `IX(D),` `IX(C)` is incorrect because it does not gain the exclusive lock on the<br>
&emsp;&emsp;&emsp;&emsp;&emsp;specific rows in table `C` that match the condition, which it needs to modify the<br>
&emsp;&emsp;&emsp;&emsp;&emsp;type of those companies.<br>
&emsp;(c) **\[5 points\]** Increment the units sold for the 5th record on `P2450`.<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `IX(P),` `IX(P2450),` `IX(P2450.5)`<br>
&emsp;&emsp;&emsp;☐  `SIX(D),` `SIX(P),` `SIX(P2450),` `X(P2450.5)`<br>
&emsp;&emsp;&emsp;☒ `IX(D),` `IX(P),` `IX(P2450),` `X(P2450.5)`<br>
&emsp;&emsp;&emsp;☐  `IS(D),` `IS(P),` `IS(P2450),` `X(P2450.5)`<br>
&emsp;&emsp;&emsp;**Solution:** The correct choice is `IX(D),` `IX(P),` `IX(P2450),` `X(P2450.5))`. This<br>
&emsp;&emsp;&emsp;choice is correct because it accesses all intended exclusive locks for all parent levels<br>
&emsp;&emsp;&emsp;necessary, and then accesses the exclusive lock for the particular record.<br>
&emsp;&emsp;&emsp;&emsp;• `IX(D),` `IX(P),` `IX(P2450),` `IX(P2450.5)` is incorrect because it only gets the<br>
&emsp;&emsp;&emsp;&emsp;&emsp;intention exclusive lock for the record.<br>
&emsp;&emsp;&emsp;&emsp;• `SIX(D),` `SIX(P),` `SIX(P2450),` `X(P2450.5)` is incorrect because the DBMS<br>
&emsp;&emsp;&emsp;&emsp;&emsp;only intends to write to a tuple, not read any data. Therefore it should not grab the<br>
&emsp;&emsp;&emsp;&emsp;&emsp;shared-exclusive intention locks.<br>
&emsp;&emsp;&emsp;&emsp;• `IS(D),` `IS(P),` `IS(P2450),` `X(P2450.5)` is incorrect because the DBMS intends<br>
&emsp;&emsp;&emsp;&emsp;&emsp;to write to a tuple, so it should not grab the shared intention parent locks.<br>
&emsp;(d) **\[5 points\]** Delete records in `C` if type = ’Shell’.<br>
&emsp;&emsp;&emsp;☐  `SIX(D),` `SIX(C)`<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `IX(C)`<br>
&emsp;&emsp;&emsp;☐  `SIX(D),` `X(C)`<br>
&emsp;&emsp;&emsp;☒ `IX(D),` `X(C)`

&emsp;&emsp;&emsp;**Solution:** The correct choice is `IX(D),` `X(C)`.This choice is correct because it accesses<br>
&emsp;&emsp;&emsp;all intended locks and the exclusive lock on `C`, since we potentially need to modify all<br>
&emsp;&emsp;&emsp;records in `C`.<br>
&emsp;&emsp;&emsp;&emsp;• `SIX(D),` `SIX(C)` is incorrect because it gains a shared intention parent lock for


### Question 2 continues...


---

<a id="page-7"></a>
**Page 7**

15-445/645 (Fall 2025)   Homework #5   Page 7 of 11

&emsp;&emsp;&emsp;&emsp;&emsp;both `D` and `C`, when it does not need to read any contents, and it does not gain the<br>
&emsp;&emsp;&emsp;&emsp;&emsp;exclusive lock for the records of `C` it needs to delete..<br>
&emsp;&emsp;&emsp;&emsp;• `IX(D),` `IX(C)` is incorrect because it does not gain an exclusive lock for the<br>
&emsp;&emsp;&emsp;&emsp;&emsp;records of `C` it needs to delete.<br>
&emsp;&emsp;&emsp;&emsp;• `SIX(D),` `X(C)` is incorrect because it gains a shared lock for the database, when<br>
&emsp;&emsp;&emsp;&emsp;&emsp;it does not need to read any contents.<br>
&emsp;(e) **\[5 points\]** Scan all records between `P30` and `P260` and modify the 5th record on `P75`<br>
&emsp;&emsp;&emsp;☒ `IX(D),` `SIX(P),` `IX(P75),` `X(P75.5)`<br>
&emsp;&emsp;&emsp;☐  `IS(D),` `S(P),` `IX(P75.5)`<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `IX(P),` `IX(P30-P260),` `IX(P75),` `X(P75.5)`<br>
&emsp;&emsp;&emsp;☐  `IS(D),` `SIX(P),` `X(P75)`<br>
&emsp;&emsp;&emsp;**Solution:** The correct choice is `IX(D),` `SIX(P),` `IX(P75),` `X(P75.5)`. This choice is<br>
&emsp;&emsp;&emsp;correct because it accesses all intended locks and the exclusive lock `X(P75.5)`. It also<br>
&emsp;&emsp;&emsp;gains a shared intention lock on `P`, so it can read and modify records in `P`.<br>
&emsp;&emsp;&emsp;&emsp;• `IS(D),` `S(P),` `IX(P75.5)` is incorrect because it accesses an intended shared<br>
&emsp;&emsp;&emsp;&emsp;&emsp;parent lock for both `D` and `P`, when we plan to modify a record in `P`.<br>
&emsp;&emsp;&emsp;&emsp;• `IX(D),` `IX(P),` `IX(P30-P260),` `IX(P75),` `X(P75.5)` is incorrect because we do<br>
&emsp;&emsp;&emsp;&emsp;&emsp;plan on reading and modifying in relation `P`, but we are only gaining a exclusive<br>
&emsp;&emsp;&emsp;&emsp;&emsp;lock on the whole `P` table, which is too much.<br>
&emsp;&emsp;&emsp;&emsp;• `IS(D),` `SIX(P),` `X(P75)` is incorrect because while it gains a shared intention<br>
&emsp;&emsp;&emsp;&emsp;&emsp;lock for `P` and the database, it tries to exclusively lock the whole page `P4` instead<br>
&emsp;&emsp;&emsp;&emsp;&emsp;of just the specific record.<br>
&emsp;(f) **\[6 points\]** Two users are trying to access data. User C is scanning all the records in `P` to<br>
&emsp;&emsp;&emsp;read, while User B is trying to modify the 7th record in `C16`. Which of the following sets<br>
&emsp;&emsp;&emsp;of locks are most suitable for this scenario?<br>
&emsp;&emsp;&emsp;☒ `User` `C:` `IS(D),` `S(P),` `User` `B:` `IX(D),` `IX(C),` `IX(C16),` `X(C16.7)`<br>
&emsp;&emsp;&emsp;☐  `User` `C:` `SIX(D),` `S(P),` `User` `B:` `SIX(D),` `IX(C),` `IX(C16),` `X(C16.7)`<br>
&emsp;&emsp;&emsp;☐  `User` `C:` `S(D),` `User` `B:` `X(D)`<br>
&emsp;&emsp;&emsp;☐  `User` `C:` `IS(D),` `S(P),` `User` `B:` `SIX(D),` `IX(C),` `IX(C16),` `X(C16.7)`<br>
&emsp;&emsp;&emsp;**Solution:** The correct choice is `User` `C:` `IS(D),` `S(P),` `User` `B:` `IX(D),` `IX(C),`<br>
&emsp;&emsp;&emsp;`IX(C16),` `X(C16.7)`. This choice is correct because:<br>
&emsp;&emsp;&emsp;&emsp;• User C only intends to read all records in `P`. Thus, he acquires an intention shared<br>
&emsp;&emsp;&emsp;&emsp;&emsp;lock on the database `D` and a shared lock on the table `P`.<br>
&emsp;&emsp;&emsp;&emsp;• User B intends to modify a specific record in table `C`. He acquires an intention<br>
&emsp;&emsp;&emsp;&emsp;&emsp;exclusive lock on the database `D`, an intention exclusive lock on the table `C` and<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`C16`, and then an exclusive lock on the specific record `C16.7`.


### Question 2 continues...


---

<a id="page-8"></a>
**Page 8**

15-445/645 (Fall 2025)   Homework #5   Page 8 of 11

&emsp;&emsp;&emsp;Other choices are incorrect because:<br>
&emsp;&emsp;&emsp;&emsp;• `User` `C:` `SIX(D),` `S(P)` `and` `User` `B:` `SIX(D),` `IX(C),` `IX(C16),` `X(C16.7)`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;is incorrect because User C doesn’t need to acquire shared intention exclusive<br>
&emsp;&emsp;&emsp;&emsp;&emsp;locks for a mere read operation, and neither does User B for a specific record<br>
&emsp;&emsp;&emsp;&emsp;&emsp;modification.<br>
&emsp;&emsp;&emsp;&emsp;• `User` `C:` `S(D)` `and` `User` `B:` `X(D)` is problematic as it locks the entire database<br>
&emsp;&emsp;&emsp;&emsp;&emsp;either in shared mode or exclusive mode, preventing concurrent operations.<br>
&emsp;&emsp;&emsp;&emsp;• `User` `C:` `IS(D),` `S(P)` `and` `User` `B:` `SIX(D),` `IX(C),` `IX(C16),` `X(C16.7)` is<br>
&emsp;&emsp;&emsp;&emsp;&emsp;incorrect because while User C’s locks are appropriate for his read operation, User<br>
&emsp;&emsp;&emsp;&emsp;&emsp;B does not need a shared intention exclusive lock on the database for modifying a<br>
&emsp;&emsp;&emsp;&emsp;&emsp;specific record.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #5 continues...


---

<a id="page-9"></a>
**Page 9**

15-445/645 (Fall 2025)   Homework #5   Page 9 of 11


### **Question 3: Optimistic Concurrency Control . . . . . . . . . . . . . . . . . . \[25 points\]**

&emsp;Consider the following set of transactions accessing a database with object A, B, C, D. The<br>
&emsp;questions below assume that the transaction manager is using **optimistic concurrency control**<br>
&emsp;(OCC). Assume that a transaction begins its read phase with its first operation and switches<br>
&emsp;from the READ phase immediately into the VALIDATION phase after its last operation exe-<br>
&emsp;cutes.<br>
&emsp;Note: VALIDATION may or may not succeed for each transaction. If validation fails, the<br>
&emsp;transaction will get immediately **aborted**.<br>
&emsp;You can assume that the DBMS is using the serial validation protocol discussed in class where<br>
&emsp;only one transaction can be in the validation phase at a time, and each transaction is doing<br>
&emsp;**backward validation** (i.e. Each transaction, when validating, checks whether it intersects its<br>
&emsp;read/write sets with any transactions that have already committed. You may assume there are<br>
&emsp;no other transactions in addition to the ones shown below. )

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;time   T1   T2   T3<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1   WRITE(B)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2   READ(A)   READ(C)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3   WRITE(C)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4   WRITE(A)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;5<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;6   READ(A)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;7   READ(B)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;8   VALIDATE?   WRITE(C)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;9   WRITE?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;10<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;11   WRITE(A)   READ(D)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;12   VALIDATE?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;13   WRITE?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;14   READ(A)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;15<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;16   WRITE(D)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;17   VALIDATE?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;18   WRITE?

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Figure 1: An execution schedule

&emsp;(a) **\[3 points\]** When is each transaction’s timestamp assigned in the transaction process?<br>
&emsp;&emsp;&emsp;☐  The start of the write phase.<br>
&emsp;&emsp;&emsp;☐  Timestamps are not necessary for OCC.<br>
&emsp;&emsp;&emsp;☒ **The start of the validation phase.**<br>
&emsp;&emsp;&emsp;☐  The start of the read phase.<br>
&emsp;&emsp;&emsp;**Solution:** Each transaction’s timestamp is assigned at the beginning of the validation<br>
&emsp;&emsp;&emsp;phase.


### Question 3 continues...


---

<a id="page-10"></a>
**Page 10**

15-445/645 (Fall 2025)   Homework #5   Page 10 of 11

&emsp;(b) **\[3 points\]** Will T1 abort?<br>
&emsp;&emsp;&emsp;☐  Yes<br>
&emsp;&emsp;&emsp;☒ **No**<br>
&emsp;&emsp;&emsp;**Solution:** T1 will not abort because T1’s read set does not intersect with any other trans-<br>
&emsp;&emsp;&emsp;actions read-write set before T1 commits in backward validation.<br>
&emsp;(c) **\[3 points\]** Will T2 abort?<br>
&emsp;&emsp;&emsp;☒ **Yes**<br>
&emsp;&emsp;&emsp;☐  No<br>
&emsp;&emsp;&emsp;**Solution:** T2 will abort because T2 should have read the value of A written by T1.<br>
&emsp;(d) **\[3 points\]** Will T3 abort?<br>
&emsp;&emsp;&emsp;☐  Yes<br>
&emsp;&emsp;&emsp;☒ **No**<br>
&emsp;&emsp;&emsp;**Solution:** T3 won’t abort because the write sets between T3 and T1 do not overlap.

&emsp;(e) **\[3 points\]** When time = 14, will T3 read A written by T1?<br>
&emsp;&emsp;&emsp;☒ **Yes**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  No<br>
&emsp;&emsp;&emsp;**Solution:** Yes. In OCC, when a transaction commits then the write set is written to the<br>
&emsp;&emsp;&emsp;global database and when a transaction wants to read and bring the value of a object<br>
&emsp;&emsp;&emsp;in its private workspace it picks the value up from the global database at the time of<br>
&emsp;&emsp;&emsp;reading. So, T3 will read A at 14 which was written by T1.<br>
&emsp;(f) **\[2 points\]** OCC works best when concurrent transactions access disjoint subsets of data<br>
&emsp;&emsp;&emsp;in a database.<br>
&emsp;&emsp;&emsp;☒ **True**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  False<br>
&emsp;&emsp;&emsp;**Solution:** OCC is good to use when the number of conflicts is low.<br>
&emsp;(g) **\[2 points\]** Aborts due to OCC are wasteful because they happen after a transaction has<br>
&emsp;&emsp;&emsp;already finished executing.<br>
&emsp;&emsp;&emsp;☒ **True**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  False<br>
&emsp;(h) **\[2 points\]** Transactions can suffer from unrepeatable reads in OCC.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;☐  True<br>
&emsp;(i) **\[2 points\]** Transactions can suffer from phantom reads in OCC.<br>
&emsp;&emsp;&emsp;☒ **True**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  False<br>
&emsp;(j) **\[2 points\]** All Objects in the read-set of a transaction are read as a whole when the<br>
&emsp;&emsp;&emsp;transaction starts.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;☐  True

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #5 continues...


---

<a id="page-11"></a>
**Page 11**

15-445/645 (Fall 2025)   Homework #5   Page 11 of 11


### **Question 4: Multi-Version Concurrency Control . . . . . . . . . . . . . . . \[15 points\]**

&emsp;Mark either **True** or **False** for each of the following statements.<br>
&emsp;Assume that the DBMS in each scenario supports multi-versioning of tuples.<br>
&emsp;(a) Consider a MVCC DBMS using **append-only** version storage.<br>
&emsp;&emsp;&emsp;i. **\[3 points\]** Newest-to-oldest (N2O) version chain ordering is faster than oldest-to-<br>
&emsp;&emsp;&emsp;&emsp;newest (O2N) for queries that need to read the latest version using an index scan on<br>
&emsp;&emsp;&emsp;&emsp;the primary key.<br>
&emsp;&emsp;&emsp;&emsp;☒ **True**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  False<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** True. When the DBMS does a look-up on the primary key index, the<br>
&emsp;&emsp;&emsp;&emsp;index will point to the head of the version chain for a tuple which will be the newest<br>
&emsp;&emsp;&emsp;&emsp;version.<br>
&emsp;&emsp;&emsp;ii. **\[3 points\]** The DBMS can use cooperative garbage collection with oldest-to-newest<br>
&emsp;&emsp;&emsp;&emsp;(O2N) version chain ordering only if it also uses logical pointers for secondary in-<br>
&emsp;&emsp;&emsp;&emsp;dexes.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** False. The secondary index scheme does not preclude the DBMS from<br>
&emsp;&emsp;&emsp;&emsp;using cooperative garbage collection, since workers will be able to remove older<br>
&emsp;&emsp;&emsp;&emsp;versions during the version chain scan. It doesn’t matter how the worker got to the<br>
&emsp;&emsp;&emsp;&emsp;version chain.

&emsp;(b) Consider a MVCC DBMS using **delta** version storage.<br>
&emsp;&emsp;&emsp;i. **\[3 points\]** Background vacuuming will only remove delta records for old versions<br>
&emsp;&emsp;&emsp;&emsp;and never tuples from the main table.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** False. The vacuum can also remove deleted tuples from the main table.<br>
&emsp;&emsp;&emsp;ii. **\[3 points\]** If the DBMS uses newest-to-oldest (N2O) version chain ordering, all<br>
&emsp;&emsp;&emsp;&emsp;reclaimable versions will be found in the delta storage area.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** False. A tuple with only one version will only be found in the main table<br>
&emsp;&emsp;&emsp;&emsp;storage.<br>
&emsp;&emsp;&emsp;iii. **\[3 points\]** When a transaction modifies an existing tuple’s primary key attributes,<br>
&emsp;&emsp;&emsp;&emsp;the DBMS must delete the tuple and then re-insert it (with its new primary key)<br>
&emsp;&emsp;&emsp;&emsp;regardless of the version chain ordering.<br>
&emsp;&emsp;&emsp;&emsp;☒ **True**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  False<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** True. Any update to a tuple’s primary key has to be treated as a DELETE/IN-<br>
&emsp;&emsp;&emsp;&emsp;SERT because the DBMS has to maintain two pointers in the primary key index (one<br>
&emsp;&emsp;&emsp;&emsp;to the original tuple, one to the new tuple).

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;End of Homework #5

