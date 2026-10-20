# CMU 15-445 Spring 2025: Homework 5: Questions

> Copied from the original: <https://15445.courses.cs.cmu.edu/spring2025/assignments.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CARNEGIE MELLON UNIVERSITY<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;COMPUTER SCIENCE DEPARTMENT<br>
&emsp;&emsp;&emsp;&emsp;&emsp;15-445/645 – DATABASE SYSTEMS (SPRING 2025)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;PROF. JIGNESH PATEL

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #5 (by Aditya Bhatnagar)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Due: **Sunday April 06, 2025 @ 11:59pm**

**IMPORTANT:**<br>
&emsp;• Enter all of your answers into **Gradescope by 11:59pm on Sunday April 06, 2025**.<br>
&emsp;• **Plagiarism**: Homework may be discussed with other students, but all homework is to be<br>
&emsp;&emsp;completed **individually**.<br>
For your information:<br>
&emsp;• Graded out of **100** points; **3** questions total<br>
&emsp;• Rough time estimate: ≈2 - 4 hours (0.5 - 1 hours for each question)<br>
&emsp;Revision : 2025/03/25 10:50

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Question   Points   Score<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Serializability and 2PL   34<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Hierarchical Locking   30<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Optimistic Concurrency Control   36<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Total:   100

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1


---

<a id="page-2"></a>
**Page 2**

15-445/645 (Spring 2025)   Homework #5   Page 2 of 7


### **Question 1: Serializability and 2PL. . . . . . . . . . . . . . . . . . . . . . . . . . . .\[34 points\]**

&emsp;(a) True/False Questions:<br>
&emsp;&emsp;&emsp;i. **\[3 points\]** Strong strict Two-Phase Locking (2PL) prevents the occurrence of cas-<br>
&emsp;&emsp;&emsp;&emsp;cading aborts and inherently avoids deadlocks without the need for additional pre-<br>
&emsp;&emsp;&emsp;&emsp;vention or detection techniques.<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;&emsp;&emsp;ii. **\[3 points\]** Using regular (i.e., not strong strict) 2PL does not guarantee a conflict<br>
&emsp;&emsp;&emsp;&emsp;serializable schedule.<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;&emsp;&emsp;iii. **\[3 points\]** Conflict-serializable schedules prevent unrepeatable reads and dirty reads.<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;&emsp;&emsp;iv. **\[3 points\]** 2PL is a pessimistic concurrency control protocol.<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;&emsp;&emsp;v. **\[3 points\]** Every conflict-serializable schedule is always conflict-equivalent to at<br>
&emsp;&emsp;&emsp;&emsp;least one view-serializable schedule.<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;(b) Serializability:<br>
&emsp;&emsp;&emsp;Consider the schedule of 4 transactions in Table 1. R(·) and W(·) stand for ‘Read’ and<br>
&emsp;&emsp;&emsp;‘Write’, respectively, and time increases from left to right. (This is in contrast to the<br>
&emsp;&emsp;&emsp;diagrams in class, where time proceeded downward.)<br>
&emsp;&emsp;&emsp;&emsp;t1   t2   t3   t4   t5   t6   t7   t8   t9   t10<br>
&emsp;&emsp;T1   W(B)   W(C)   R(D)<br>
&emsp;&emsp;T2   W(A)   W(B)<br>
&emsp;&emsp;T3   R(C)   R(A)<br>
&emsp;&emsp;T4   W(B)   R(D)   W(A)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Table 1: A schedule with 4 transactions<br>
&emsp;&emsp;&emsp;i. **\[3 points\]** Is this schedule serial?<br>
&emsp;&emsp;&emsp;&emsp;☐  Yes   ☐  No<br>
&emsp;&emsp;&emsp;ii. **\[3 points\]** Is this schedule conflict serializable?<br>
&emsp;&emsp;&emsp;&emsp;☐  Yes   ☐  No<br>
&emsp;&emsp;&emsp;iii. **\[3 points\]** Is this schedule view serializable?<br>
&emsp;&emsp;&emsp;&emsp;☐  Yes   ☐  No<br>
&emsp;&emsp;&emsp;iv. **\[7 points\]** Compute the conflict dependency graph for the schedule in Table 1, se-<br>
&emsp;&emsp;&emsp;&emsp;lecting all edges (and the object that caused the dependency) that appear in the graph.<br>
&emsp;&emsp;&emsp;&emsp;☐  T1 →T2   ☐  T2 →T3   ☐  T2 →T4<br>
&emsp;&emsp;&emsp;&emsp;☐  T2 →T1   ☐  T3 →T2   ☐  T4 →T2<br>
&emsp;&emsp;&emsp;&emsp;☐  T1 →T3   ☐  T1 →T4   ☐  T3 →T4<br>
&emsp;&emsp;&emsp;&emsp;☐  T3 →T1   ☐  T4 →T1   ☐  T4 →T3


### Question 1 continues...


---

<a id="page-3"></a>
**Page 3**

15-445/645 (Spring 2025)   Homework #5   Page 3 of 7

&emsp;&emsp;&emsp;v. **\[3 points\]** Is this schedule possible under regular 2PL?<br>
&emsp;&emsp;&emsp;&emsp;☐  Yes<br>
&emsp;&emsp;&emsp;&emsp;☐  No

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #5 continues...


---

<a id="page-4"></a>
**Page 4**

15-445/645 (Spring 2025)   Homework #5   Page 4 of 7


### **Question 2: Hierarchical Locking . . . . . . . . . . . . . . . . . . . . . . . . . . . . . \[30 points\]**

&emsp;Consider a database `D` consisting of two tables `A` (which stores information about musical<br>
&emsp;artists) and `R` (which stores information about the artists’ releases). Specifically:<br>
&emsp;&emsp;• `R(rid,` `name,` `artist` `credit,` `language,` `status,` `genre,` `year,` `number` `sold)`<br>
&emsp;&emsp;• `A(id,` `name,` `type,` `area,` `gender,` `begin` `date` `year)`<br>
&emsp;Table `R` spans 2000 pages, which we denote `R1` to `R2000`. Table `A` spans 100 pages, which we<br>
&emsp;denote `A1` to `A100`. Each page contains 200 records. We use the notation `R3.20` to denote the<br>
&emsp;twentieth record on the third page of table `R`. There are no indexes on these tables.<br>
&emsp;Suppose the database supports shared and exclusive hierarchical intention locks (`S`, `X`, `IS`, `IX`<br>
&emsp;and `SIX`) at four levels of granularity: database-level (`D`), table-level (`R` and `A`), page-level (e.g.,<br>
&emsp;`R10`), and record-level (e.g., `R10.42`). We use the notation `IS(D)` to mean a shared database-<br>
&emsp;level intention lock, and `X(A2.20-A3.80)` to mean a set of exclusive locks on the records from<br>
&emsp;the 20th record on the second page to the 80th record on the third page of table `A`.<br>
&emsp;For each of the following operations below, what sequence of lock requests should be gener-<br>
&emsp;ated to **maximize the potential for concurrency** while guaranteeing correctness?<br>
&emsp;(a) **\[4 points\]** Update the `type` of all musical artists in table A with the `name` `=` `'Eminem'`<br>
&emsp;&emsp;&emsp;to `'Slim` `Shady'`<br>
&emsp;&emsp;&emsp;☐  `X(D)`<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `X(A)`<br>
&emsp;&emsp;&emsp;☐  `SIX(D),` `X(A)`<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `IX(A)`<br>
&emsp;(b) **\[5 points\]** Find the release record whose `year` equals the oldest year in all releases.<br>
&emsp;&emsp;&emsp;☐  `S(D)`<br>
&emsp;&emsp;&emsp;☐  `IS(D),` `IS(R)`<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `X(R)`<br>
&emsp;&emsp;&emsp;☐  `IS(D),` `S(R)`<br>
&emsp;(c) **\[5 points\]** Increment the number sold for the 10th record on `R1999`.<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `IX(R),` `IX(R1999),` `IX(R1999.10)`<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `IX(R),` `IX(R1999),` `X(R1999.10)`<br>
&emsp;&emsp;&emsp;☐  `SIX(D),` `SIX(R),` `SIX(R1999),` `X(R1999.10)`<br>
&emsp;&emsp;&emsp;☐  `IS(D),` `IS(R),` `IS(R1999),` `X(R1999.10)`<br>
&emsp;(d) **\[5 points\]** Scan all records between `R10` and `R100` and modify the 2nd record on `R50`<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `SIX(R),` `IX(R50),` `X(R50.2)`<br>
&emsp;&emsp;&emsp;☐  `IS(D),` `S(R),` `IX(R50.2)`<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `IX(R),` `IX(R10-R100),` `IX(R50),` `X(R50.2)`<br>
&emsp;&emsp;&emsp;☐  `IS(D),` `SIX(R),` `X(R50)`<br>
&emsp;(e) **\[5 points\]** Delete records in `A` if type = ’Band’.<br>
&emsp;&emsp;&emsp;☐  `SIX(D),` `SIX(A)`<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `X(A)`


### Question 2 continues...


---

<a id="page-5"></a>
**Page 5**

15-445/645 (Spring 2025)   Homework #5   Page 5 of 7

&emsp;&emsp;&emsp;☐  `IX(D),` `IX(A)`<br>
&emsp;&emsp;&emsp;☐  `SIX(D),` `X(A)`<br>
&emsp;(f) **\[6 points\]** Two users are trying to access data. User A is scanning all the records in `R`<br>
&emsp;&emsp;&emsp;to read, while User B is trying to modify the 15th record in `A10`. Which of the following<br>
&emsp;&emsp;&emsp;sets of locks are most suitable for this scenario?<br>
&emsp;&emsp;&emsp;☐  `User` `A:` `SIX(D),` `S(R),` `User` `B:` `SIX(D),` `IX(A),` `X(A10.15)`<br>
&emsp;&emsp;&emsp;☐  `User` `A:` `S(D),` `User` `B:` `X(D)`<br>
&emsp;&emsp;&emsp;☐  `User` `A:` `IS(D),` `S(R),` `User` `B:` `IX(D),` `IX(A),` `X(A10.15)`<br>
&emsp;&emsp;&emsp;☐  `User` `A:` `IS(D),` `S(R),` `User` `B:` `SIX(D),` `IX(A),` `X(A10.15)`

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #5 continues...


---

<a id="page-6"></a>
**Page 6**

15-445/645 (Spring 2025)   Homework #5   Page 6 of 7


### **Question 3: Optimistic Concurrency Control . . . . . . . . . . . . . . . . . . \[36 points\]**

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
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1   READ(A)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2   READ(A)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4   WRITE(A)   WRITE(A)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;5   WRITE(B)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;6   WRITE(C)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;7   VALIDATE?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;8   READ(B)   WRITE?   READ(C)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;9   VALIDATE?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;10   WRITE?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;11<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;12<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;13   WRITE(C)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;14<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;15   READ(D)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;16   WRITE(D)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;17   VALIDATE?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;18   WRITE?

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Figure 1: An execution schedule

&emsp;(a) **\[5 points\]** When is each transaction’s timestamp assigned in the transaction process?<br>
&emsp;&emsp;&emsp;☐  The start of the write phase.<br>
&emsp;&emsp;&emsp;☐  Timestamps are not necessary for OCC.<br>
&emsp;&emsp;&emsp;☐  The start of the validation phase.<br>
&emsp;&emsp;&emsp;☐  The start of the read phase.<br>
&emsp;(b) **\[5 points\]** When time = 8, will T3 read C written by T2?<br>
&emsp;&emsp;&emsp;☐  Yes   ☐  No


### Question 3 continues...


---

<a id="page-7"></a>
**Page 7**

15-445/645 (Spring 2025)   Homework #5   Page 7 of 7

&emsp;(c) **\[5 points\]** Will T1 abort?<br>
&emsp;&emsp;&emsp;☐  Yes<br>
&emsp;&emsp;&emsp;☐  No<br>
&emsp;(d) **\[5 points\]** Will T2 abort?<br>
&emsp;&emsp;&emsp;☐  Yes<br>
&emsp;&emsp;&emsp;☐  No<br>
&emsp;(e) **\[5 points\]** Will T3 abort?<br>
&emsp;&emsp;&emsp;☐  Yes<br>
&emsp;&emsp;&emsp;☐  No

&emsp;(f) **\[3 points\]** OCC works best when concurrent transactions access the same subset of data<br>
&emsp;&emsp;&emsp;in a database.<br>
&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;(g) **\[3 points\]** Transactions can suffer from phantom reads in OCC.<br>
&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;(h) **\[3 points\]** Aborts due to OCC are wasteful because they happen after a transaction has<br>
&emsp;&emsp;&emsp;already finished executing.<br>
&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;(i) **\[2 points\]** All Objects in the read-set of a transaction are read as a whole when the<br>
&emsp;&emsp;&emsp;transaction starts.<br>
&emsp;&emsp;&emsp;☐  True   ☐  False

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;End of Homework #5

