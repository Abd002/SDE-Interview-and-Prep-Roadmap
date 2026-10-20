# CMU 15-445 Fall 2025: Homework 5: Questions

> Copied from the original: <https://15445.courses.cs.cmu.edu/fall2025/assignments.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CARNEGIE MELLON UNIVERSITY<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;COMPUTER SCIENCE DEPARTMENT<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;15-445/645 – DATABASE SYSTEMS (FALL 2025)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;PROF. ANDY PAVLO

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #5 (by Will)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Due: **Sunday Nov 16, 2025 @ 11:59pm**

**IMPORTANT:**<br>
&emsp;• Enter all of your answers into **Gradescope by 11:59pm on Sunday Nov 16, 2025**.<br>
&emsp;• **Plagiarism**: Homework may be discussed with other students, but all homework is to be<br>
&emsp;&emsp;completed **individually**.<br>
For your information:<br>
&emsp;• Graded out of **100** points; **4** questions total<br>
&emsp;• Rough time estimate: ≈2 - 4 hours (0.5 - 1 hours for each question)<br>
&emsp;• Each part is all or nothing. There is no partial credit.<br>
&emsp;Revision : 2025/11/13 20:57

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

15-445/645 (Fall 2025)   Homework #5   Page 2 of 8


### **Question 1: Serializability and 2PL. . . . . . . . . . . . . . . . . . . . . . . . . . . .\[30 points\]**

&emsp;(a) True/False Questions:<br>
&emsp;&emsp;&emsp;i. **\[2 points\]** 2PL is an optimistic concurrency control protocol.<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;&emsp;&emsp;ii. **\[2 points\]** Strong strict Two-Phase Locking (2PL) prevents the occurrence of cas-<br>
&emsp;&emsp;&emsp;&emsp;cading aborts and inherently avoids deadlocks without the need for additional pre-<br>
&emsp;&emsp;&emsp;&emsp;vention or detection techniques.<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;&emsp;&emsp;iii. **\[2 points\]** Using regular (i.e., not strong strict) 2PL guarantees a conflict serializ-<br>
&emsp;&emsp;&emsp;&emsp;able schedule.<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;&emsp;&emsp;iv. **\[2 points\]** Every view-serializable schedule is always conflict-equivalent to at least<br>
&emsp;&emsp;&emsp;&emsp;one conflict-serializable schedule.<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;&emsp;&emsp;v. **\[2 points\]** Conflict-serializable schedules prevent unrepeatable reads and dirty reads.<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False


### Question 1 continues...


---

<a id="page-3"></a>
**Page 3**

15-445/645 (Fall 2025)   Homework #5   Page 3 of 8

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
&emsp;&emsp;&emsp;&emsp;☐  Yes   ☐  No<br>
&emsp;&emsp;&emsp;ii. **\[8 points\]** Compute the conflict dependency graph for the schedule in Table 1, se-<br>
&emsp;&emsp;&emsp;&emsp;lecting all edges (and the object that caused the dependency) that appear in the graph.<br>
&emsp;&emsp;&emsp;&emsp;☐  T1 →T2   ☐  T2 →T3   ☐  T2 →T4<br>
&emsp;&emsp;&emsp;&emsp;☐  T2 →T1   ☐  T3 →T2   ☐  T4 →T2<br>
&emsp;&emsp;&emsp;&emsp;☐  T1 →T3   ☐  T1 →T4   ☐  T3 →T4<br>
&emsp;&emsp;&emsp;&emsp;☐  T3 →T1   ☐  T4 →T1   ☐  T4 →T3

&emsp;&emsp;&emsp;iii. **\[3 points\]** Is this schedule conflict serializable?<br>
&emsp;&emsp;&emsp;&emsp;☐  Yes   ☐  No<br>
&emsp;&emsp;&emsp;iv. **\[3 points\]** Is this schedule view serializable?<br>
&emsp;&emsp;&emsp;&emsp;☐  Yes   ☐  No<br>
&emsp;&emsp;&emsp;v. **\[3 points\]** Is this schedule possible under regular 2PL?<br>
&emsp;&emsp;&emsp;&emsp;☐  Yes<br>
&emsp;&emsp;&emsp;&emsp;☐  No

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #5 continues...


---

<a id="page-4"></a>
**Page 4**

15-445/645 (Fall 2025)   Homework #5   Page 4 of 8


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
&emsp;&emsp;&emsp;☐  `IS(D),` `S(P)`<br>
&emsp;&emsp;&emsp;☐  `S(D)`<br>
&emsp;&emsp;&emsp;☐  `IS(D),` `IS(P)`

&emsp;(b) **\[4 points\]** Update the `type` of all companies in table C with the `name` `=` `'MegaCorp'` to<br>
&emsp;&emsp;&emsp;`'Conglomerate'`<br>
&emsp;&emsp;&emsp;☐  `X(D)`<br>
&emsp;&emsp;&emsp;☐  `SIX(D),` `X(C)`<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `IX(C)`<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `X(C)`<br>
&emsp;(c) **\[5 points\]** Increment the units sold for the 5th record on `P2450`.<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `IX(P),` `IX(P2450),` `IX(P2450.5)`<br>
&emsp;&emsp;&emsp;☐  `SIX(D),` `SIX(P),` `SIX(P2450),` `X(P2450.5)`<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `IX(P),` `IX(P2450),` `X(P2450.5)`<br>
&emsp;&emsp;&emsp;☐  `IS(D),` `IS(P),` `IS(P2450),` `X(P2450.5)`<br>
&emsp;(d) **\[5 points\]** Delete records in `C` if type = ’Shell’.<br>
&emsp;&emsp;&emsp;☐  `SIX(D),` `SIX(C)`<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `IX(C)`<br>
&emsp;&emsp;&emsp;☐  `SIX(D),` `X(C)`<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `X(C)`


### Question 2 continues...


---

<a id="page-5"></a>
**Page 5**

15-445/645 (Fall 2025)   Homework #5   Page 5 of 8<br>
&emsp;(e) **\[5 points\]** Scan all records between `P30` and `P260` and modify the 5th record on `P75`<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `SIX(P),` `IX(P75),` `X(P75.5)`<br>
&emsp;&emsp;&emsp;☐  `IS(D),` `S(P),` `IX(P75.5)`<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `IX(P),` `IX(P30-P260),` `IX(P75),` `X(P75.5)`<br>
&emsp;&emsp;&emsp;☐  `IS(D),` `SIX(P),` `X(P75)`<br>
&emsp;(f) **\[6 points\]** Two users are trying to access data. User C is scanning all the records in `P` to<br>
&emsp;&emsp;&emsp;read, while User B is trying to modify the 7th record in `C16`. Which of the following sets<br>
&emsp;&emsp;&emsp;of locks are most suitable for this scenario?<br>
&emsp;&emsp;&emsp;☐  `User` `C:` `IS(D),` `S(P),` `User` `B:` `IX(D),` `IX(C),` `IX(C16),` `X(C16.7)`<br>
&emsp;&emsp;&emsp;☐  `User` `C:` `SIX(D),` `S(P),` `User` `B:` `SIX(D),` `IX(C),` `IX(C16),` `X(C16.7)`<br>
&emsp;&emsp;&emsp;☐  `User` `C:` `S(D),` `User` `B:` `X(D)`<br>
&emsp;&emsp;&emsp;☐  `User` `C:` `IS(D),` `S(P),` `User` `B:` `SIX(D),` `IX(C),` `IX(C16),` `X(C16.7)`

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #5 continues...


---

<a id="page-6"></a>
**Page 6**

15-445/645 (Fall 2025)   Homework #5   Page 6 of 8


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
&emsp;&emsp;&emsp;☐  The start of the validation phase.<br>
&emsp;&emsp;&emsp;☐  The start of the read phase.<br>
&emsp;(b) **\[3 points\]** Will T1 abort?<br>
&emsp;&emsp;&emsp;☐  Yes<br>
&emsp;&emsp;&emsp;☐  No


### Question 3 continues...


---

<a id="page-7"></a>
**Page 7**

15-445/645 (Fall 2025)   Homework #5   Page 7 of 8

&emsp;(c) **\[3 points\]** Will T2 abort?<br>
&emsp;&emsp;&emsp;☐  Yes<br>
&emsp;&emsp;&emsp;☐  No<br>
&emsp;(d) **\[3 points\]** Will T3 abort?<br>
&emsp;&emsp;&emsp;☐  Yes<br>
&emsp;&emsp;&emsp;☐  No<br>
&emsp;(e) **\[3 points\]** When time = 14, will T3 read A written by T1?<br>
&emsp;&emsp;&emsp;☐  Yes   ☐  No<br>
&emsp;(f) **\[2 points\]** OCC works best when concurrent transactions access disjoint subsets of data<br>
&emsp;&emsp;&emsp;in a database.<br>
&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;(g) **\[2 points\]** Aborts due to OCC are wasteful because they happen after a transaction has<br>
&emsp;&emsp;&emsp;already finished executing.<br>
&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;(h) **\[2 points\]** Transactions can suffer from unrepeatable reads in OCC.<br>
&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;(i) **\[2 points\]** Transactions can suffer from phantom reads in OCC.<br>
&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;(j) **\[2 points\]** All Objects in the read-set of a transaction are read as a whole when the<br>
&emsp;&emsp;&emsp;transaction starts.<br>
&emsp;&emsp;&emsp;☐  True   ☐  False

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #5 continues...


---

<a id="page-8"></a>
**Page 8**

15-445/645 (Fall 2025)   Homework #5   Page 8 of 8


### **Question 4: Multi-Version Concurrency Control . . . . . . . . . . . . . . . \[15 points\]**

&emsp;Mark either **True** or **False** for each of the following statements.<br>
&emsp;Assume that the DBMS in each scenario supports multi-versioning of tuples.<br>
&emsp;(a) Consider a MVCC DBMS using **append-only** version storage.<br>
&emsp;&emsp;&emsp;i. **\[3 points\]** Newest-to-oldest (N2O) version chain ordering is faster than oldest-to-<br>
&emsp;&emsp;&emsp;&emsp;newest (O2N) for queries that need to read the latest version using an index scan on<br>
&emsp;&emsp;&emsp;&emsp;the primary key.<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;&emsp;&emsp;ii. **\[3 points\]** The DBMS can use cooperative garbage collection with oldest-to-newest<br>
&emsp;&emsp;&emsp;&emsp;(O2N) version chain ordering only if it also uses logical pointers for secondary in-<br>
&emsp;&emsp;&emsp;&emsp;dexes.<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False

&emsp;(b) Consider a MVCC DBMS using **delta** version storage.<br>
&emsp;&emsp;&emsp;i. **\[3 points\]** Background vacuuming will only remove delta records for old versions<br>
&emsp;&emsp;&emsp;&emsp;and never tuples from the main table.<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;&emsp;&emsp;ii. **\[3 points\]** If the DBMS uses newest-to-oldest (N2O) version chain ordering, all<br>
&emsp;&emsp;&emsp;&emsp;reclaimable versions will be found in the delta storage area.<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;&emsp;&emsp;iii. **\[3 points\]** When a transaction modifies an existing tuple’s primary key attributes,<br>
&emsp;&emsp;&emsp;&emsp;the DBMS must delete the tuple and then re-insert it (with its new primary key)<br>
&emsp;&emsp;&emsp;&emsp;regardless of the version chain ordering.<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;End of Homework #5

