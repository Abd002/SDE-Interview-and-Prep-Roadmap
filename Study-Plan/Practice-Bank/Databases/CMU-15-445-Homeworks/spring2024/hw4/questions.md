# CMU 15-445 Spring 2024: Homework 4: Questions

> Copied from the original: <https://15445.courses.cs.cmu.edu/spring2024/assignments.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CARNEGIE MELLON UNIVERSITY<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;COMPUTER SCIENCE DEPARTMENT<br>
&emsp;&emsp;&emsp;&emsp;&emsp;15-445/645 – DATABASE SYSTEMS (SPRING 2024)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;PROF. JIGNESH PATEL

&emsp;&emsp;&emsp;&emsp;Homework #4 (by Amy Cheng, Ritu Pathak, Shivang Dalal)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Due: **Saturday April 6, 2024 @ 11:59pm**

**IMPORTANT:**<br>
&emsp;• Enter all of your answers into **Gradescope by 11:59pm on Saturday April 6, 2024**.<br>
&emsp;• **Plagiarism**: Homework may be discussed with other students, but all homework is to be<br>
&emsp;&emsp;completed **individually**.<br>
For your information:<br>
&emsp;• Graded out of **100** points; **4** questions total<br>
&emsp;• Rough time estimate: ≈2 - 4 hours (0.5 - 1 hours for each question)<br>
&emsp;Revision : 2024/04/02 09:42

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

15-445/645 (Spring 2024)   Homework #4   Page 2 of 7


### **Question 1: Query Execution, Planning, and Optimization . . . . . \[24 points\]**

&emsp;(a) **\[3 points\]** The zone map optimization is more effective in speeding up OLAP queries<br>
&emsp;&emsp;&emsp;as opposed to OLTP queries.<br>
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
&emsp;(e) **\[3 points\]** An index scan is always better (fewer I/O operations, faster run-time) than a<br>
&emsp;&emsp;&emsp;sequential scan if the query contains an `ORDER` `BY` clause matching the index key.<br>
&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;(f) **\[3 points\]** The query optimizer in a database management system always guarantees the<br>
&emsp;&emsp;&emsp;generation of an optimal execution plan by exhaustively evaluating all possible plans to<br>
&emsp;&emsp;&emsp;ensure the lowest cost for query execution.<br>
&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;(g) **\[3 points\]** Predicate pushdown involves moving filter conditions closer to the node where<br>
&emsp;&emsp;&emsp;the data is stored, while projection pushdown involves transferring only the necessary<br>
&emsp;&emsp;&emsp;columns of the data.<br>
&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;(h) **\[3 points\]** The vectorized query processing model (which uses SIMD instructions to<br>
&emsp;&emsp;&emsp;parallelize operations) is an example of intra-query parallelism.<br>
&emsp;&emsp;&emsp;☐  True   ☐  False

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #4 continues...


---

<a id="page-3"></a>
**Page 3**

15-445/645 (Spring 2024)   Homework #4   Page 3 of 7


### **Question 2: Serializability and 2PL. . . . . . . . . . . . . . . . . . . . . . . . . . . .\[26 points\]**

&emsp;(a) True/False Questions:<br>
&emsp;&emsp;&emsp;i. **\[3 points\]** Strong strict Two-Phase Locking (2PL) prevents the occurrence of cas-<br>
&emsp;&emsp;&emsp;&emsp;cading aborts and inherently avoids deadlocks without the need for additional pre-<br>
&emsp;&emsp;&emsp;&emsp;vention or detection techniques.<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;&emsp;&emsp;ii. **\[3 points\]** For a schedule following strong strict 2PL, the dependency graph is guar-<br>
&emsp;&emsp;&emsp;&emsp;anteed to be acyclic.<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;&emsp;&emsp;iii. **\[2 points\]** Using 2PL guaruntees a conflict-serializable schedule.<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;&emsp;&emsp;iv. **\[2 points\]** Conflict-serializable schedules prevent unrepeatable reads and dirty reads.<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;&emsp;&emsp;v. **\[2 points\]** A schedule that is view-serializable is also conflict-serializable.<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;(b) Serializability:<br>
&emsp;&emsp;&emsp;Consider the schedule of 4 transactions in Table 1. R(·) and W(·) stand for ‘Read’ and<br>
&emsp;&emsp;&emsp;‘Write’, respectively, and time increases from left to right. (This is in contrast to the<br>
&emsp;&emsp;&emsp;diagrams in class, where time proceeded downward.)<br>
&emsp;&emsp;&emsp;&emsp;t1   t2   t3   t4   t5   t6   t7   t8   t9   t10<br>
&emsp;&emsp;T1   R(B)   W(C)   W(A)<br>
&emsp;&emsp;T2   W(E)   R(E)   W(C)   R(D)   W(A)<br>
&emsp;&emsp;T3   R(A)   W(B)   R(B)<br>
&emsp;&emsp;T4   R(D)   R(B)   W(D)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Table 1: A schedule with 4 transactions<br>
&emsp;&emsp;&emsp;i. **\[3 points\]** Is this schedule serial?<br>
&emsp;&emsp;&emsp;&emsp;☐  Yes   ☐  No<br>
&emsp;&emsp;&emsp;ii. **\[3 points\]** Is this schedule conflict-serializable?<br>
&emsp;&emsp;&emsp;&emsp;☐  Yes   ☐  No<br>
&emsp;&emsp;&emsp;iii. **\[5 points\]** Compute the conflict dependency graph for the schedule in Table 1, se-<br>
&emsp;&emsp;&emsp;&emsp;lecting all edges (and the object that caused the dependency) that appear in the graph.<br>
&emsp;&emsp;&emsp;&emsp;☐  T1 →T2   ☐  T2 →T3   ☐  T2 →T4<br>
&emsp;&emsp;&emsp;&emsp;☐  T2 →T1   ☐  T3 →T2   ☐  T4 →T2<br>
&emsp;&emsp;&emsp;&emsp;☐  T1 →T3   ☐  T1 →T4   ☐  T3 →T4<br>
&emsp;&emsp;&emsp;&emsp;☐  T3 →T1   ☐  T4 →T1   ☐  T4 →T3

&emsp;&emsp;&emsp;iv. **\[3 points\]** Is this schedule possible under regular 2PL?<br>
&emsp;&emsp;&emsp;&emsp;☐  Yes<br>
&emsp;&emsp;&emsp;&emsp;☐  No

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #4 continues...


---

<a id="page-4"></a>
**Page 4**

15-445/645 (Spring 2024)   Homework #4   Page 4 of 7


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
&emsp;(a) **\[4 points\]** Fetch the records of all musical artists in `A` with `type` `=` `'Orchestra'`.<br>
&emsp;&emsp;&emsp;☐  `SIX(D),` `S(A)`<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `S(A)`<br>
&emsp;&emsp;&emsp;☐  `IS(D),` `S(A)`<br>
&emsp;&emsp;&emsp;☐  `S(D)`<br>
&emsp;(b) **\[4 points\]** Update the `genre` for all release records with `language` `=` `'English'` to<br>
&emsp;&emsp;&emsp;`'Musical` `theatre'`.<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `X(R)`<br>
&emsp;&emsp;&emsp;☐  `SIX(D),` `X(R)`<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `IX(R)`<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `SIX(R)`<br>
&emsp;(c) **\[4 points\]** Modify the 7th record on `R80`.<br>
&emsp;&emsp;&emsp;☐  `IS(D),` `IS(R),` `IS(R80),` `X(R80.7)`<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `IX(R),` `IX(R80),` `IX(R80.7)`<br>
&emsp;&emsp;&emsp;☐  `SIX(D),` `IX(R),` `IX(R80),` `X(R80.7)`<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `IX(R),` `IX(R80),` `X(R80.7)`<br>
&emsp;(d) **\[4 points\]** Increment the `number_sold` for the 6th record on `R999`.<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `IX(R),` `SIX(R999),` `X(R999.6)`<br>
&emsp;&emsp;&emsp;☐  `IS(D),` `IS(R),` `IS(R999),` `S(R999.6)`<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `IX(R),` `S(R999),` `X(R999.6)`<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `IX(R),` `IX(R999),` `X(R999.6)`<br>
&emsp;(e) **\[4 points\]** Scan all records on pages `A10` to `A50` and modify the 20th record on `A14`.<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `S(A),` `X(A14)`<br>
&emsp;&emsp;&emsp;☐  `SIX(D),` `IX(A),` `IX(A14),` `X(A14.20)`


### Question 3 continues...


---

<a id="page-5"></a>
**Page 5**

15-445/645 (Spring 2024)   Homework #4   Page 5 of 7

&emsp;&emsp;&emsp;☐  `IX(D),` `IX(A),` `IX(A10-A50),` `IX(A14),` `X(A14.20)`<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `SIX(A),` `IX(A14),` `X(A14.20)`<br>
&emsp;(f) **\[4 points\]** Delete records in `A` if `type='Band'`.<br>
&emsp;&emsp;&emsp;☐  `SIX(D),` `SIX(A)`<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `X(A)`<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `IX(A)`<br>
&emsp;&emsp;&emsp;☐  `SIX(D),` `X(A)`

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #4 continues...


---

<a id="page-6"></a>
**Page 6**

15-445/645 (Spring 2024)   Homework #4   Page 6 of 7


### **Question 4: Optimistic Concurrency Control . . . . . . . . . . . . . . . . . . \[26 points\]**

&emsp;Consider the following set of transactions accessing a database with object A, B, C, D. You<br>
&emsp;should make the following assumptions:<br>
&emsp;&emsp;• The transaction manager is using **optimistic concurrency control** (OCC).<br>
&emsp;&emsp;• A transaction begins its read phase with its first operation and switches from the READ<br>
&emsp;&emsp;&emsp;phase immediately into the VALIDATION phase after its last operation executes.<br>
&emsp;&emsp;• The DBMS is using the serial validation protocol discussed in class where only one<br>
&emsp;&emsp;&emsp;transaction can be in the validation phase at a time.<br>
&emsp;&emsp;• Each transaction is doing **forward validation** (i.e. Each transaction, when validating,<br>
&emsp;&emsp;&emsp;checks whether it intersects its read/write sets with any active transactions that have not<br>
&emsp;&emsp;&emsp;committed yet).<br>
&emsp;&emsp;• There are no other transactions in addition to the ones shown below.<br>
&emsp;Note: VALIDATION may or may not succeed for each transaction. If validation fails, the<br>
&emsp;transaction will get immediately aborted.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;timeT1   T2   T3<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1   READ(A)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2   READ(B)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3   WRITE(B)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4   READ(A)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;5   READ(D)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;6   READ(B)   WRITE(C)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;7   READ(D)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;8   VALIDATE?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;9   READ(C)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;10   WRITE?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;11   VALIDATE?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;12   WRITE?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;13   WRITE(D)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;14   WRITE(C)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;15   VALIDATE?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;16   WRITE?

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Figure 1: An execution schedule

&emsp;(a) **\[4 points\]** When is each transaction’s timestamp assigned in the transaction process?<br>
&emsp;&emsp;&emsp;☐  The start of the write phase.<br>
&emsp;&emsp;&emsp;☐  Timestamps are not necessary for OCC.<br>
&emsp;&emsp;&emsp;☐  The start of the validation phase.<br>
&emsp;&emsp;&emsp;☐  The start of the read phase.<br>
&emsp;(b) **\[4 points\]** When time = 9, will T1 read C written by T3?<br>
&emsp;&emsp;&emsp;☐  Yes   ☐  No


### Question 4 continues...


---

<a id="page-7"></a>
**Page 7**

15-445/645 (Spring 2024)   Homework #4   Page 7 of 7

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

