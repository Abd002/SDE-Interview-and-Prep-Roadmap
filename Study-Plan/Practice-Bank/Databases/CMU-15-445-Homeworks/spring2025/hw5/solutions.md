# CMU 15-445 Spring 2025: Homework 5: Official solutions

> Copied from the original: <https://15445.courses.cs.cmu.edu/spring2025/assignments.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CARNEGIE MELLON UNIVERSITY<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;COMPUTER SCIENCE DEPARTMENT<br>
&emsp;&emsp;&emsp;&emsp;&emsp;15-445/645 – DATABASE SYSTEMS (SPRING 2025)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;PROF. JIGNESH PATEL

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #5 (by Aditya Bhatnagar) – Solutions<br>
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

15-445/645 (Spring 2025)   Homework #5   Page 2 of 10


### **Question 1: Serializability and 2PL. . . . . . . . . . . . . . . . . . . . . . . . . . . .\[34 points\]**

&emsp;(a) True/False Questions:<br>
&emsp;&emsp;&emsp;i. **\[3 points\]** Strong strict Two-Phase Locking (2PL) prevents the occurrence of cas-<br>
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
&emsp;&emsp;&emsp;ii. **\[3 points\]** Using regular (i.e., not strong strict) 2PL does not guarantee a conflict<br>
&emsp;&emsp;&emsp;&emsp;serializable schedule.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** False. Using regular 2PL guarantees a conflict serializable schedule be-<br>
&emsp;&emsp;&emsp;&emsp;cause it generates schedules whose precedence graph is acyclic. This is because<br>
&emsp;&emsp;&emsp;&emsp;this ordering of acquiring resources (via the locks) ensures that there is a order of<br>
&emsp;&emsp;&emsp;&emsp;acquisition precedence.<br>
&emsp;&emsp;&emsp;iii. **\[3 points\]** Conflict-serializable schedules prevent unrepeatable reads and dirty reads.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** False. Conflict-serializability ensures that the schedule is conflict equiv-<br>
&emsp;&emsp;&emsp;&emsp;alent to a serial schedule, thus protecting against unrepeatable reads. However, dirty<br>
&emsp;&emsp;&emsp;&emsp;reads can still occur in conflict-serializable schedules, especially when considering<br>
&emsp;&emsp;&emsp;&emsp;cascading aborts. If a transaction reads data written by another transaction which<br>
&emsp;&emsp;&emsp;&emsp;later gets aborted, then the first transaction has effectively read ”dirty” data.<br>
&emsp;&emsp;&emsp;iv. **\[3 points\]** 2PL is a pessimistic concurrency control protocol.<br>
&emsp;&emsp;&emsp;&emsp;☒ **True**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  False<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** True. 2PL is considered a pessimistic concurrency control protocol be-<br>
&emsp;&emsp;&emsp;&emsp;cause it uses locks to prevent conflicts before they can occur. By ensuring transac-<br>
&emsp;&emsp;&emsp;&emsp;tions follow a strict locking protocol, 2PL aims to prevent any possible conflicts, in<br>
&emsp;&emsp;&emsp;&emsp;contrast to optimistic protocols which allow conflicts but then resolve them.<br>
&emsp;&emsp;&emsp;v. **\[3 points\]** Every conflict-serializable schedule is always conflict-equivalent to at<br>
&emsp;&emsp;&emsp;&emsp;least one view-serializable schedule.<br>
&emsp;&emsp;&emsp;&emsp;☒ **True**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  False<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** True. Every conflict-serializable schedule is conflict-equivalent to a se-<br>
&emsp;&emsp;&emsp;&emsp;rial schedule. Since all serial schedules are inherently view-serializable, the state-<br>
&emsp;&emsp;&emsp;&emsp;ment holds true.<br>
&emsp;(b) Serializability:


### Question 1 continues...


---

<a id="page-3"></a>
**Page 3**

15-445/645 (Spring 2025)   Homework #5   Page 3 of 10

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
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **No**<br>
&emsp;&emsp;&emsp;&emsp;☐  Yes<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** This schedule isn’t serial because this schedule interleaves the actions of<br>
&emsp;&emsp;&emsp;&emsp;different transactions.<br>
&emsp;&emsp;&emsp;ii. **\[3 points\]** Is this schedule conflict serializable?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **No**<br>
&emsp;&emsp;&emsp;&emsp;☐  Yes<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** This schedule isn’t conflict serializable because there is a cycle in its<br>
&emsp;&emsp;&emsp;&emsp;data dependency graph. Moreover, this schedule is not conflict equivalent (every<br>
&emsp;&emsp;&emsp;&emsp;pair of conflicting operations is ordered in the same way) to any serial schedule of<br>
&emsp;&emsp;&emsp;&emsp;transaction execution.<br>
&emsp;&emsp;&emsp;iii. **\[3 points\]** Is this schedule view serializable?<br>
&emsp;&emsp;&emsp;&emsp;☒ **Yes**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  No<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** To determine if the schedule is view serializable, we need to check it<br>
&emsp;&emsp;&emsp;&emsp;against three criteria for view equivalence for original schedule S1 and serial sched-<br>
&emsp;&emsp;&emsp;&emsp;ule S2:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;1\. If T3 reads the initial value of A in S1, then T3 must also read the initial value<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;of A in S2.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;2\. If T3 reads a value of A written by T4 in S1, then T3 must also read that value<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;of A written by T4 in S2.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;3\. If T3 writes the final value of A in S1, then T3 must also write the final value<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;of A in S2.<br>
&emsp;&emsp;&emsp;&emsp;From our analysis, we found a possible serial schedule that is view-equivalent to<br>
&emsp;&emsp;&emsp;&emsp;the given schedule: T2 →T3 →T1 →T4. This serial schedule fulfills the criteria<br>
&emsp;&emsp;&emsp;&emsp;for view equivalence:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;• T2 writes A and B.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;• T3 reads the initial value of C and the value of A written by T2.


### Question 1 continues...


---

<a id="page-4"></a>
**Page 4**

15-445/645 (Spring 2025)   Homework #5   Page 4 of 10

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;• T1 writes B, writes the final version of C, and reads the initial value of D.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;• T4 writes the final version of B, reads the initial version of D, and writes the<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;final version of A.<br>
&emsp;&emsp;&emsp;&emsp;Therefore, this serial schedule is view-equivalent to the original one, so it is proved<br>
&emsp;&emsp;&emsp;&emsp;to be view-serializable. Importantly, compared to conflict serializability, view se-<br>
&emsp;&emsp;&emsp;&emsp;rializability allows all conflict serializable schedules along with ”blind writes”, en-<br>
&emsp;&emsp;&emsp;&emsp;suring database consistency after all transactions are committed.<br>
&emsp;&emsp;&emsp;iv. **\[7 points\]** Compute the conflict dependency graph for the schedule in Table 1, se-<br>
&emsp;&emsp;&emsp;&emsp;lecting all edges (and the object that caused the dependency) that appear in the graph.<br>
&emsp;&emsp;&emsp;&emsp;☒ T1 →T2   ☒ T2 →T3   ☒ T2 →T4<br>
&emsp;&emsp;&emsp;&emsp;☐  T2 →T1   ☐  T3 →T2   ☐  T4 →T2<br>
&emsp;&emsp;&emsp;&emsp;☒ T1 →T3   ☒ T1 →T4   ☒ T3 →T4<br>
&emsp;&emsp;&emsp;&emsp;☒ T3 →T1<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  T4 →T1   ☐  T4 →T3

&emsp;&emsp;&emsp;&emsp;**Solution:** The answer is:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;• T3 →T4(A), T3 →T1(C)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;• T1 →T4(B), T3 →T2(B)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;• T2 →T4(A, B), T2 →T3(A)<br>
&emsp;&emsp;&emsp;&emsp;For A, there are W-R conflict from T2 to T3, R-W conflict from T3 to T4, and W-W<br>
&emsp;&emsp;&emsp;&emsp;conflict from T2 to T4;<br>
&emsp;&emsp;&emsp;&emsp;For B, there are W-W conflict from T1 to T4, W-W conflict from T2 to T4 and W-W<br>
&emsp;&emsp;&emsp;&emsp;conflict from T1 to T2;<br>
&emsp;&emsp;&emsp;&emsp;For C, there is R-W conflict from T3 to T1;<br>
&emsp;&emsp;&emsp;&emsp;For D, there is no conflict.<br>
&emsp;&emsp;&emsp;v. **\[3 points\]** Is this schedule possible under regular 2PL?<br>
&emsp;&emsp;&emsp;&emsp;☐  Yes<br>
&emsp;&emsp;&emsp;&emsp;☒ **No**<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** This schedule is not possible under 2PL because it is not conflict serial-<br>
&emsp;&emsp;&emsp;&emsp;izable, and 2PL is guaranteed to produce conflict serializable schedules.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #5 continues...


---

<a id="page-5"></a>
**Page 5**

15-445/645 (Spring 2025)   Homework #5   Page 5 of 10


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
&emsp;&emsp;&emsp;☒ `IX(D),` `X(A)`<br>
&emsp;&emsp;&emsp;☐  `SIX(D),` `X(A)`<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `IX(A)`<br>
&emsp;&emsp;&emsp;**Solution:** The correct answer choice is `IX(D),` `X(A)`. This is because we potentially<br>
&emsp;&emsp;&emsp;need to modify records in table A where the artist’s name is `'Eminem'`, and this choice<br>
&emsp;&emsp;&emsp;accesses the intended exclusive parent lock to get the exclusive lock on those specific<br>
&emsp;&emsp;&emsp;rows in table `A`.<br>
&emsp;&emsp;&emsp;&emsp;• `X(D)` is incorrect because it gains an exclusive lock on the entire database `D` when<br>
&emsp;&emsp;&emsp;&emsp;&emsp;it only needs to modify specific rows in table `A`.<br>
&emsp;&emsp;&emsp;&emsp;• `SIX(D),` `X(A)` is incorrect because it gains a shared intention lock on the database<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`D` when it has no need to read the contents of `D`.<br>
&emsp;&emsp;&emsp;&emsp;• `IX(D),` `IX(A)` is incorrect because it does not gain the exclusive lock on the<br>
&emsp;&emsp;&emsp;&emsp;&emsp;specific rows in table `A` that match the condition (artist name is `'Eminem'`), which<br>
&emsp;&emsp;&emsp;&emsp;&emsp;it needs to modify the type of those artists.<br>
&emsp;(b) **\[5 points\]** Find the release record whose `year` equals the oldest year in all releases.<br>
&emsp;&emsp;&emsp;☐  `S(D)`<br>
&emsp;&emsp;&emsp;☐  `IS(D),` `IS(R)`<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `X(R)`<br>
&emsp;&emsp;&emsp;☒ `IS(D),` `S(R)`


### Question 2 continues...


---

<a id="page-6"></a>
**Page 6**

15-445/645 (Spring 2025)   Homework #5   Page 6 of 10

&emsp;&emsp;&emsp;**Solution:** The correct choice is `IS(D),` `S(R)`. The query needs to scan all records in<br>
&emsp;&emsp;&emsp;`R` to find the release with the oldest year and scan all records again to find the release<br>
&emsp;&emsp;&emsp;records that satisfy the equation condition. So, it requires a shared lock on `R`.<br>
&emsp;&emsp;&emsp;&emsp;• `S(D)` is incorrect because it doesn’t acquire the intended parent locks necessary to<br>
&emsp;&emsp;&emsp;&emsp;&emsp;obtain the `S(R)` lock for reading the table `R`.<br>
&emsp;&emsp;&emsp;&emsp;• `IS(D),` `IS(R)` is incorrect because it only states the intention to read-access the<br>
&emsp;&emsp;&emsp;&emsp;&emsp;table R but doesn’t actually acquire the lock to perform the read.<br>
&emsp;&emsp;&emsp;&emsp;• `IX(D),` `X(R)` is incorrect because it accesses an intended exclusive lock, which is<br>
&emsp;&emsp;&emsp;&emsp;&emsp;not needed for a read-only query.<br>
&emsp;(c) **\[5 points\]** Increment the number sold for the 10th record on `R1999`.<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `IX(R),` `IX(R1999),` `IX(R1999.10)`<br>
&emsp;&emsp;&emsp;☒ `IX(D),` `IX(R),` `IX(R1999),` `X(R1999.10)`<br>
&emsp;&emsp;&emsp;☐  `SIX(D),` `SIX(R),` `SIX(R1999),` `X(R1999.10)`<br>
&emsp;&emsp;&emsp;☐  `IS(D),` `IS(R),` `IS(R1999),` `X(R1999.10)`<br>
&emsp;&emsp;&emsp;**Solution:** The correct choice is `IX(D),` `IX(R),` `IX(R1999),` `X(R1999.10))`. This<br>
&emsp;&emsp;&emsp;choice is correct because it accesses all intended exclusive locks for all parent levels<br>
&emsp;&emsp;&emsp;necessary, and then accesses the exclusive lock for the particular record.<br>
&emsp;&emsp;&emsp;&emsp;• `IX(D),` `IX(R),` `IX(R1999),` `IX(R1999.10)` is incorrect because it only gets the<br>
&emsp;&emsp;&emsp;&emsp;&emsp;intention exclusive lock for the record.<br>
&emsp;&emsp;&emsp;&emsp;• `SIX(D),` `SIX(R),` `SIX(R1999),` `X(R1999.10)` is incorrect because the DBMS<br>
&emsp;&emsp;&emsp;&emsp;&emsp;only intends to write to a tuple, not read any data. Therefore it should not grab the<br>
&emsp;&emsp;&emsp;&emsp;&emsp;shared-exclusive intention locks.<br>
&emsp;&emsp;&emsp;&emsp;• `IS(D),` `IS(R),` `IS(R1999),` `X(R1999.10)` is incorrect because the DBMS in-<br>
&emsp;&emsp;&emsp;&emsp;&emsp;tends to write to a tuple, so it should not grab the shared intention parent locks.<br>
&emsp;(d) **\[5 points\]** Scan all records between `R10` and `R100` and modify the 2nd record on `R50`<br>
&emsp;&emsp;&emsp;☒ `IX(D),` `SIX(R),` `IX(R50),` `X(R50.2)`<br>
&emsp;&emsp;&emsp;☐  `IS(D),` `S(R),` `IX(R50.2)`<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `IX(R),` `IX(R10-R100),` `IX(R50),` `X(R50.2)`<br>
&emsp;&emsp;&emsp;☐  `IS(D),` `SIX(R),` `X(R50)`<br>
&emsp;&emsp;&emsp;**Solution:** The correct choice is `IX(D),` `SIX(R),` `IX(R50),` `X(R50.2)`. This choice is<br>
&emsp;&emsp;&emsp;correct because it accesses all intended locks and the exclusive lock `X(R50.2)`. It also<br>
&emsp;&emsp;&emsp;gains a shared intention lock on `R`, so it can read and modify records in `R`.<br>
&emsp;&emsp;&emsp;&emsp;• `IS(D),` `S(R),` `IX(R50.2)` is incorrect because it accesses an intended shared<br>
&emsp;&emsp;&emsp;&emsp;&emsp;parent lock for both `D` and `R`, when we plan to modify a record in `R`.<br>
&emsp;&emsp;&emsp;&emsp;• `IX(D),` `IX(R),` `IX(R10-R100),` `IX(R50),` `X(R50.2)` is incorrect because we do


### Question 2 continues...


---

<a id="page-7"></a>
**Page 7**

15-445/645 (Spring 2025)   Homework #5   Page 7 of 10

&emsp;&emsp;&emsp;&emsp;&emsp;plan on reading and modifying in relation `R`, but we are only gaining a exclusive<br>
&emsp;&emsp;&emsp;&emsp;&emsp;lock on the whole `R` table, which is too much.<br>
&emsp;&emsp;&emsp;&emsp;• `IS(D),` `SIX(R),` `X(R50)` is incorrect because while it gains a shared intention<br>
&emsp;&emsp;&emsp;&emsp;&emsp;lock for `R` and the database, it tries to exclusively lock the whole page `R4` instead<br>
&emsp;&emsp;&emsp;&emsp;&emsp;of just the specific record.<br>
&emsp;(e) **\[5 points\]** Delete records in `A` if type = ’Band’.<br>
&emsp;&emsp;&emsp;☐  `SIX(D),` `SIX(A)`<br>
&emsp;&emsp;&emsp;☒ `IX(D),` `X(A)`<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `IX(A)`<br>
&emsp;&emsp;&emsp;☐  `SIX(D),` `X(A)`<br>
&emsp;&emsp;&emsp;**Solution:** The correct choice is `IX(D),` `X(A)`.This choice is correct because it accesses<br>
&emsp;&emsp;&emsp;all intended locks and the exclusive lock on `A`, since we potentially need to modify all<br>
&emsp;&emsp;&emsp;records in `A`.<br>
&emsp;&emsp;&emsp;&emsp;• `SIX(D),` `SIX(A)` is incorrect because it gains a shared intention parent lock for<br>
&emsp;&emsp;&emsp;&emsp;&emsp;both `D` and `A`, when it does not need to read any contents, and it does not gain the<br>
&emsp;&emsp;&emsp;&emsp;&emsp;exclusive lock for the records of `A` it needs to delete..<br>
&emsp;&emsp;&emsp;&emsp;• `IX(D),` `IX(A)` is incorrect because it does not gain an exclusive lock for the<br>
&emsp;&emsp;&emsp;&emsp;&emsp;records of `A` it needs to delete.<br>
&emsp;&emsp;&emsp;&emsp;• `SIX(D),` `X(A)` is incorrect because it gains a shared lock for the database, when<br>
&emsp;&emsp;&emsp;&emsp;&emsp;it does not need to read any contents.<br>
&emsp;(f) **\[6 points\]** Two users are trying to access data. User A is scanning all the records in `R`<br>
&emsp;&emsp;&emsp;to read, while User B is trying to modify the 15th record in `A10`. Which of the following<br>
&emsp;&emsp;&emsp;sets of locks are most suitable for this scenario?<br>
&emsp;&emsp;&emsp;☐  `User` `A:` `SIX(D),` `S(R),` `User` `B:` `SIX(D),` `IX(A),` `X(A10.15)`<br>
&emsp;&emsp;&emsp;☐  `User` `A:` `S(D),` `User` `B:` `X(D)`<br>
&emsp;&emsp;&emsp;☒ `User` `A:` `IS(D),` `S(R),` `User` `B:` `IX(D),` `IX(A),` `X(A10.15)`<br>
&emsp;&emsp;&emsp;☐  `User` `A:` `IS(D),` `S(R),` `User` `B:` `SIX(D),` `IX(A),` `X(A10.15)`<br>
&emsp;&emsp;&emsp;**Solution:** The correct choice is `User` `A:` `IS(D),` `S(R),` `User` `B:` `IX(D),` `IX(A),`<br>
&emsp;&emsp;&emsp;`X(A10.15)`. This choice is correct because:<br>
&emsp;&emsp;&emsp;&emsp;• User A only intends to read all records in `R`. Thus, he acquires an intention shared<br>
&emsp;&emsp;&emsp;&emsp;&emsp;lock on the database `D` and a shared lock on the table `R`.<br>
&emsp;&emsp;&emsp;&emsp;• User B intends to modify a specific record in table `A`. He acquires an intention<br>
&emsp;&emsp;&emsp;&emsp;&emsp;exclusive lock on the database `D`, an intention exclusive lock on the table `A`, and<br>
&emsp;&emsp;&emsp;&emsp;&emsp;then an exclusive lock on the specific record `A10.15`.

&emsp;&emsp;&emsp;Other choices are incorrect because:


### Question 2 continues...


---

<a id="page-8"></a>
**Page 8**

15-445/645 (Spring 2025)   Homework #5   Page 8 of 10

&emsp;&emsp;&emsp;&emsp;• `User` `A:` `SIX(D),` `S(R)` `and` `User` `B:` `SIX(D),` `IX(A),` `X(A10.15)` is incorrect<br>
&emsp;&emsp;&emsp;&emsp;&emsp;because User A doesn’t need to acquire shared intention exclusive locks for a mere<br>
&emsp;&emsp;&emsp;&emsp;&emsp;read operation, and neither does User B for a specific record modification.<br>
&emsp;&emsp;&emsp;&emsp;• `User` `A:` `S(D)` `and` `User` `B:` `X(D)` is problematic as it locks the entire database<br>
&emsp;&emsp;&emsp;&emsp;&emsp;either in shared mode or exclusive mode, preventing concurrent operations.<br>
&emsp;&emsp;&emsp;&emsp;• `User` `A:` `IS(D),` `S(R)` `and` `User` `B:` `SIX(D),` `IX(A),` `X(A10.15)` is incorrect<br>
&emsp;&emsp;&emsp;&emsp;&emsp;because while User A’s locks are appropriate for his read operation, User B does<br>
&emsp;&emsp;&emsp;&emsp;&emsp;not need a shared intention exclusive lock on the database for modifying a specific<br>
&emsp;&emsp;&emsp;&emsp;&emsp;record.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #5 continues...


---

<a id="page-9"></a>
**Page 9**

15-445/645 (Spring 2025)   Homework #5   Page 9 of 10


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
&emsp;&emsp;&emsp;☒ **The start of the validation phase.**<br>
&emsp;&emsp;&emsp;☐  The start of the read phase.<br>
&emsp;&emsp;&emsp;**Solution:** Each transaction’s timestamp is assigned at the beginning of the validation<br>
&emsp;&emsp;&emsp;phase.


### Question 3 continues...


---

<a id="page-10"></a>
**Page 10**

15-445/645 (Spring 2025)   Homework #5   Page 10 of 10

&emsp;(b) **\[5 points\]** When time = 8, will T3 read C written by T2?<br>
&emsp;&emsp;&emsp;☒ **Yes**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  No<br>
&emsp;&emsp;&emsp;**Solution:** Yes. In OCC, when a transaction commits then the write set is written to the<br>
&emsp;&emsp;&emsp;global database and when a transaction wants to read and bring the value of a object<br>
&emsp;&emsp;&emsp;in its private workspace it picks the value up from the global database at the time of<br>
&emsp;&emsp;&emsp;reading. So, T3 will read C at 8 which was written by T2.<br>
&emsp;(c) **\[5 points\]** Will T1 abort?<br>
&emsp;&emsp;&emsp;☒ **Yes**<br>
&emsp;&emsp;&emsp;☐  No<br>
&emsp;&emsp;&emsp;**Solution:** T1 has not read the value of A written by T2 at timestamp = 4. Hence, the<br>
&emsp;&emsp;&emsp;validation phase of T1 fails and hence it aborts.<br>
&emsp;(d) **\[5 points\]** Will T2 abort?<br>
&emsp;&emsp;&emsp;☐  Yes<br>
&emsp;&emsp;&emsp;☒ **No**<br>
&emsp;&emsp;&emsp;**Solution:** T2 will not abort because T2’s read set does not intersect with any other trans-<br>
&emsp;&emsp;&emsp;actions read-write set before T2 commits in backward validation.<br>
&emsp;(e) **\[5 points\]** Will T3 abort?<br>
&emsp;&emsp;&emsp;☐  Yes<br>
&emsp;&emsp;&emsp;☒ **No**<br>
&emsp;&emsp;&emsp;**Solution:** T3 won’t abort because T3’s read and write set doesn’t intersect with T2’s read<br>
&emsp;&emsp;&emsp;and write set.

&emsp;(f) **\[3 points\]** OCC works best when concurrent transactions access the same subset of data<br>
&emsp;&emsp;&emsp;in a database.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;**Solution:** OCC is good to use when the number of conflicts is low.

&emsp;(g) **\[3 points\]** Transactions can suffer from phantom reads in OCC.<br>
&emsp;&emsp;&emsp;☒ **True**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  False<br>
&emsp;(h) **\[3 points\]** Aborts due to OCC are wasteful because they happen after a transaction has<br>
&emsp;&emsp;&emsp;already finished executing.<br>
&emsp;&emsp;&emsp;☒ **True**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  False<br>
&emsp;(i) **\[2 points\]** All Objects in the read-set of a transaction are read as a whole when the<br>
&emsp;&emsp;&emsp;transaction starts.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;☐  True

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;End of Homework #5

