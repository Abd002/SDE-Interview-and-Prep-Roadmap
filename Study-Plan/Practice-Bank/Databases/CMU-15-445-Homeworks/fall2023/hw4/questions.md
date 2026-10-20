# CMU 15-445 Fall 2023: Homework 4: Questions

> Copied from the original: <https://15445.courses.cs.cmu.edu/fall2023/assignments.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CARNEGIE MELLON UNIVERSITY<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;COMPUTER SCIENCE DEPARTMENT<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;15-445/645 – DATABASE SYSTEMS (FALL 2023)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;PROF. ANDY PAVLO AND JIGNESH PATEL

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #4 (by Aolei Zhou)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Due: **Sunday November 12, 2023 @ 11:59pm**

**IMPORTANT:**<br>
&emsp;• Enter all of your answers into **Gradescope by 11:59pm on Sunday November 12, 2023**.<br>
&emsp;• **Plagiarism**: Homework may be discussed with other students, but all homework is to be<br>
&emsp;&emsp;completed **individually**.<br>
For your information:<br>
&emsp;• Graded out of **100** points; **4** questions total<br>
&emsp;• Rough time estimate: ≈2 - 4 hours (0.5 - 1 hours for each question)<br>
&emsp;Revision : 2023/10/27 23:23

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Question   Points   Score<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Query Execution, Planning, and Optimization   24<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Serializability and 2PL   26<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Hierarchical Locking   24<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Optimistic Concurrency Control   26<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Total:   100

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1


---

<a id="page-2"></a>
**Page 2**

15-445/645 (Fall 2023)   Homework #4   Page 2 of 8


### **Question 1: Query Execution, Planning, and Optimization . . . . . \[24 points\]**

&emsp;(a) **\[3 points\]** For a query that involves a range condition, zone maps can help in determin-<br>
&emsp;&emsp;&emsp;ing if a block contains any relevant data.<br>
&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;(b) **\[3 points\]** For OLAP queries, which often involve complex operations on vast datasets,<br>
&emsp;&emsp;&emsp;intra-query parallelism is typically not preferred to optimize performance.<br>
&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;(c) **\[3 points\]** The process per DBMS worker approach provides better fault isolation than<br>
&emsp;&emsp;&emsp;the thread per DBMS worker approach.<br>
&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;(d) **\[3 points\]** In OLAP workload, the vectorized model’s performance improvements come<br>
&emsp;&emsp;&emsp;mainly from the reduction in the number of disk I/O operations.<br>
&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;(e) **\[3 points\]** For a table with a well-maintained B-Tree index, an index scan will always<br>
&emsp;&emsp;&emsp;be faster than a sequential scan because of fewer I/O operations and faster run-time.<br>
&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;(f) **\[3 points\]** The query optimizer in a database management system always guarantees the<br>
&emsp;&emsp;&emsp;generation of an optimal execution plan by exhaustively evaluating all possible plans to<br>
&emsp;&emsp;&emsp;ensure the lowest cost for query execution.<br>
&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;(g) **\[3 points\]** Predicate pushdown involves moving filter conditions closer to the node where<br>
&emsp;&emsp;&emsp;the data is stored, while projection pushdown involves transferring only the necessary<br>
&emsp;&emsp;&emsp;columns of the data.<br>
&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;(h) **\[3 points\]** In the context of query optimization, where accurate statistics are crucial for<br>
&emsp;&emsp;&emsp;plan choices, sampling requires examining every row in a table to compute these vital<br>
&emsp;&emsp;&emsp;statistics.<br>
&emsp;&emsp;&emsp;☐  True   ☐  False

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #4 continues...


---

<a id="page-3"></a>
**Page 3**

15-445/645 (Fall 2023)   Homework #4   Page 3 of 8


### **Question 2: Serializability and 2PL. . . . . . . . . . . . . . . . . . . . . . . . . . . .\[26 points\]**

&emsp;(a) True/False Questions:<br>
&emsp;&emsp;&emsp;i. **\[2 points\]** Strong strict Two-Phase Locking (2PL) prevents the occurrence of cas-<br>
&emsp;&emsp;&emsp;&emsp;cading aborts and inherently avoids deadlocks without the need for additional pre-<br>
&emsp;&emsp;&emsp;&emsp;vention or detection techniques.<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;&emsp;&emsp;ii. **\[2 points\]** For a schedule following strong strict 2PL, the dependency graph is guar-<br>
&emsp;&emsp;&emsp;&emsp;anteed to be acyclic.<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;&emsp;&emsp;iii. **\[2 points\]** Using regular (i.e., not strong strict) 2PL does not guarantee a conflict<br>
&emsp;&emsp;&emsp;&emsp;serializable schedule.<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;&emsp;&emsp;iv. **\[2 points\]** Conflict serializable schedules prevent unrepeatable reads and dirty reads,<br>
&emsp;&emsp;&emsp;&emsp;even in the event of cascading aborts.<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;&emsp;&emsp;v. **\[2 points\]** 2PL is a pessimistic concurrency control protocol.<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;&emsp;&emsp;vi. **\[2 points\]** Every conflict-serializable schedule is always conflict-equivalent to at<br>
&emsp;&emsp;&emsp;&emsp;least one view-serializable schedule.<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;(b) Serializability:<br>
&emsp;&emsp;&emsp;Consider the schedule of 4 transactions in Table 1. R(·) and W(·) stand for ‘Read’ and<br>
&emsp;&emsp;&emsp;‘Write’, respectively, and time increases from left to right. (This is in contrast to the<br>
&emsp;&emsp;&emsp;diagrams in class, where time proceeded downward.)<br>
&emsp;&emsp;&emsp;&emsp;t1   t2   t3   t4   t5   t6   t7   t8   t9   t10<br>
&emsp;&emsp;T1   R(C)   R(A)<br>
&emsp;&emsp;T2   W(A)   R(D)   W(B)<br>
&emsp;&emsp;T3   W(B)   W(C)   R(D)<br>
&emsp;&emsp;T4   W(B)   W(A)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Table 1: A schedule with 4 transactions<br>
&emsp;&emsp;&emsp;i. **\[2 points\]** Is this schedule serial?<br>
&emsp;&emsp;&emsp;&emsp;☐  Yes   ☐  No<br>
&emsp;&emsp;&emsp;ii. **\[2 points\]** Is this schedule conflict serializable?<br>
&emsp;&emsp;&emsp;&emsp;☐  Yes   ☐  No<br>
&emsp;&emsp;&emsp;iii. **\[2 points\]** Is this schedule view serializable?<br>
&emsp;&emsp;&emsp;&emsp;☐  Yes   ☐  No<br>
&emsp;&emsp;&emsp;iv. **\[6 points\]** Compute the conflict dependency graph for the schedule in Table 1, se-<br>
&emsp;&emsp;&emsp;&emsp;lecting all edges (and the object that caused the dependency) that appear in the graph.


### Question 2 continues...


---

<a id="page-4"></a>
**Page 4**

15-445/645 (Fall 2023)   Homework #4   Page 4 of 8

&emsp;&emsp;&emsp;&emsp;☐  T1 →T2   ☐  T2 →T3   ☐  T2 →T4<br>
&emsp;&emsp;&emsp;&emsp;☐  T2 →T1   ☐  T3 →T2   ☐  T4 →T2<br>
&emsp;&emsp;&emsp;&emsp;☐  T1 →T3   ☐  T1 →T4   ☐  T3 →T4<br>
&emsp;&emsp;&emsp;&emsp;☐  T3 →T1   ☐  T4 →T1   ☐  T4 →T3

&emsp;&emsp;&emsp;v. **\[2 points\]** Is this schedule possible under regular 2PL?<br>
&emsp;&emsp;&emsp;&emsp;☐  Yes<br>
&emsp;&emsp;&emsp;&emsp;☐  No

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #4 continues...


---

<a id="page-5"></a>
**Page 5**

15-445/645 (Fall 2023)   Homework #4   Page 5 of 8


### **Question 3: Hierarchical Locking . . . . . . . . . . . . . . . . . . . . . . . . . . . . . \[24 points\]**

&emsp;Consider a database `D` consisting of two tables `A` (which stores information about musical<br>
&emsp;artists) and `R` (which stores information about the artists’ releases). Specifically:<br>
&emsp;&emsp;• `R(rid,` `name,` `artist` `credit,` `language,` `status,` `genre,` `year,` `number` `sold)`<br>
&emsp;&emsp;• `A(id,` `name,` `type,` `area,` `gender,` `begin` `date` `year)`<br>
&emsp;Table `R` spans 1000 pages, which we denote `R1` to `R1000`. Table `A` spans 50 pages, which we<br>
&emsp;denote `A1` to `A50`. Each page contains 100 records. We use the notation `R3.20` to denote the<br>
&emsp;twentieth record on the third page of table `R`. There are no indexes on these tables.<br>
&emsp;Suppose the database supports shared and exclusive hierarchical intention locks (`S`, `X`, `IS`, `IX`<br>
&emsp;and `SIX`) at four levels of granularity: database-level (`D`), table-level (`R` and `A`), page-level (e.g.,<br>
&emsp;`R10`), and record-level (e.g., `R10.42`). We use the notation `IS(D)` to mean a shared database-<br>
&emsp;level intention lock, and `X(A2.20-A3.80)` to mean a set of exclusive locks on the records from<br>
&emsp;the 20th record on the second page to the 80th record on the third page of table `A`.<br>
&emsp;For each of the following operations below, what sequence of lock requests should be gener-<br>
&emsp;ated to **maximize the potential for concurrency** while guaranteeing correctness?<br>
&emsp;(a) **\[4 points\]** Update the `type` of all musical artists in table A with the `name` `=` `'Lunar` `Echoes'`<br>
&emsp;&emsp;&emsp;to `'Band'`<br>
&emsp;&emsp;&emsp;☐  `X(D)`<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `X(A)`<br>
&emsp;&emsp;&emsp;☐  `SIX(D),` `X(A)`<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `IX(A)`<br>
&emsp;(b) **\[4 points\]** Find the release record whose `year` equals the most recent year in all releases.<br>
&emsp;&emsp;&emsp;☐  `S(D)`<br>
&emsp;&emsp;&emsp;☐  `IS(D),` `IS(R)`<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `X(R)`<br>
&emsp;&emsp;&emsp;☐  `IS(D),` `S(R)`<br>
&emsp;(c) **\[4 points\]** Modify the 30th record on `A12`.<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `IX(A),` `IX(A12),` `IX(A12.30)`<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `IX(A),` `IX(A12),` `X(A12.30)`<br>
&emsp;&emsp;&emsp;☐  `SIX(D),` `SIX(A),` `SIX(A12),` `X(A12.30)`<br>
&emsp;&emsp;&emsp;☐  `IS(D),` `IS(A),` `IS(A12),` `X(A12.30)`<br>
&emsp;(d) **\[4 points\]** Scan all records in `R` and modify the 3rd record on `R4`<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `SIX(R),` `IX(R4),` `X(R4.3)`<br>
&emsp;&emsp;&emsp;☐  `IS(D),` `S(R),` `IX(R4.3)`<br>
&emsp;&emsp;&emsp;☐  `S(D),` `IX(R),` `X(R4.3)`<br>
&emsp;&emsp;&emsp;☐  `IS(D),` `SIX(R),` `X(R4)`<br>
&emsp;(e) **\[4 points\]** Scan all records in `R` and modify the 23rd record on `R7`.<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `SIX(R),` `IX(R7),` `X(R7.23)`<br>
&emsp;&emsp;&emsp;☐  `IS(D),` `IS(R),` `IS(R7),` `X(R7.23)`


### Question 3 continues...


---

<a id="page-6"></a>
**Page 6**

15-445/645 (Fall 2023)   Homework #4   Page 6 of 8

&emsp;&emsp;&emsp;☐  `SIX(D),` `SIX(R),` `IX(R_7),` `X(R7.23)`<br>
&emsp;&emsp;&emsp;☐  `IS(D),` `SIX(R),` `X(R7.23)`<br>
&emsp;(f) **\[4 points\]** Two users are trying to access data. User A is scanning all the records in `R` to<br>
&emsp;&emsp;&emsp;read, while User B is trying to modify the 23th record in `A1`. Which of the following sets<br>
&emsp;&emsp;&emsp;of locks are most suitable for this scenario?<br>
&emsp;&emsp;&emsp;☐  `User` `A:` `SIX(D),` `S(R),` `User` `B:` `SIX(D),` `IX(A),` `X(A1.23)`<br>
&emsp;&emsp;&emsp;☐  `User` `A:` `S(D),` `User` `B:` `X(D)`<br>
&emsp;&emsp;&emsp;☐  `User` `A:` `IS(D),` `S(R),` `User` `B:` `IX(D),` `IX(A),` `X(A1.23)`<br>
&emsp;&emsp;&emsp;☐  `User` `A:` `IS(D),` `S(R),` `User` `B:` `SIX(D),` `IX(A),` `X(A1.23)`

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #4 continues...


---

<a id="page-7"></a>
**Page 7**

15-445/645 (Fall 2023)   Homework #4   Page 7 of 8


### **Question 4: Optimistic Concurrency Control . . . . . . . . . . . . . . . . . . \[26 points\]**

&emsp;Consider the following set of transactions accessing a database with object A, B, C, D. The<br>
&emsp;questions below assume that the transaction manager is using **optimistic concurrency control**<br>
&emsp;(OCC). Assume that a transaction begins its read phase with its first operation and switches<br>
&emsp;from the READ phase immediately into the VALIDATION phase after its last operation exe-<br>
&emsp;cutes.<br>
&emsp;Note: VALIDATION may or may not succeed for each transaction. If validation fails, the<br>
&emsp;transaction will get immediately aborted.<br>
&emsp;You can assume that the DBMS is using the serial validation protocol discussed in class where<br>
&emsp;only one transaction can be in the validation phase at a time, and each transaction is doing<br>
&emsp;backward validation (i.e. Each transaction, when validating, checks whether it intersects its<br>
&emsp;read/write sets with any transactions that have already committed. You may assume there are<br>
&emsp;no other transactions in addition to the ones shown below. )

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;time   T1   T2   T3<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1   READ(A)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2   WRITE(A)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3   READ(A)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4   WRITE(A)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;5   READ(C)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;6   READ(B)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;7   READ(E)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;8   VALIDATE?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;9   WRITE(B)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;10   WRITE?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;11   WRITE(C)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;12   VALIDATE?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;13   WRITE(C)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;14   WRITE?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;15   READ(D)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;16   WRITE(D)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;17   VALIDATE?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;18   WRITE?

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Figure 1: An execution schedule

&emsp;(a) **\[4 points\]** When is each transaction’s timestamp assigned in the transaction process?<br>
&emsp;&emsp;&emsp;☐  The start of the write phase.<br>
&emsp;&emsp;&emsp;☐  Timestamps are not necessary for OCC.<br>
&emsp;&emsp;&emsp;☐  The start of the validation phase.<br>
&emsp;&emsp;&emsp;☐  The start of the read phase.<br>
&emsp;(b) **\[4 points\]** When time = 3, will T1 read A written by T2?<br>
&emsp;&emsp;&emsp;☐  Yes   ☐  No


### Question 4 continues...


---

<a id="page-8"></a>
**Page 8**

15-445/645 (Fall 2023)   Homework #4   Page 8 of 8

&emsp;(c) **\[4 points\]** Will T1 abort?<br>
&emsp;&emsp;&emsp;☐  Yes<br>
&emsp;&emsp;&emsp;☐  No<br>
&emsp;(d) **\[4 points\]** Will T2 abort?<br>
&emsp;&emsp;&emsp;☐  Yes<br>
&emsp;&emsp;&emsp;☐  No<br>
&emsp;(e) **\[4 points\]** Will T3 abort?<br>
&emsp;&emsp;&emsp;☐  Yes<br>
&emsp;&emsp;&emsp;☐  No

&emsp;(f) **\[2 points\]** OCC works best when concurrent transactions access the same subset of data<br>
&emsp;&emsp;&emsp;in a database.<br>
&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;(g) **\[2 points\]** Transactions can suffer from phantom reads in OCC.<br>
&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;(h) **\[2 points\]** Aborts due to OCC are wasteful because they happen after a transaction has<br>
&emsp;&emsp;&emsp;already finished executing.<br>
&emsp;&emsp;&emsp;☐  True   ☐  False

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;End of Homework #4

