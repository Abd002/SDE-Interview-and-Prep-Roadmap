# CMU 15-445 Fall 2024: Homework 5: Official solutions

> Copied from the original: <https://15445.courses.cs.cmu.edu/fall2024/assignments.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CARNEGIE MELLON UNIVERSITY<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;COMPUTER SCIENCE DEPARTMENT<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;15-445/645 – DATABASE SYSTEMS (FALL 2024)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;PROF. ANDY PAVLO

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #5 (by William) – Solutions<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Due: **Sunday November 17, 2024 @ 11:59pm**

**IMPORTANT:**<br>
&emsp;• Enter all of your answers into **Gradescope by 11:59pm on Sunday November 17, 2024**.<br>
&emsp;• **Plagiarism**: Homework may be discussed with other students, but all homework is to be<br>
&emsp;&emsp;completed **individually**.<br>
For your information:<br>
&emsp;• Graded out of **100** points; **3** questions total<br>
&emsp;• Rough time estimate: ≈2 - 4 hours (0.5 - 1 hours for each question)<br>
&emsp;Revision : 2024/11/16 13:07

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Question   Points   Score<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Serializability, 2PL, Deadlock Prevention   42<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Hierarchical Locking   28<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Optimistic Concurrency Control   30<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Total:   100

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1


---

<a id="page-2"></a>
**Page 2**

15-445/645 (Fall 2024)   Homework #5   Page 2 of 13


### **Question 1: Serializability, 2PL, Deadlock Prevention . . . . . . . . . . \[42 points\]**

&emsp;(a) True/False Questions:<br>
&emsp;&emsp;&emsp;i. **\[2 points\]** Cascading aborts is possible under Strong strict Two-Phase Locking (2PL).<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** False. Strict 2PL prevents cascading aborts by holding all the locks until<br>
&emsp;&emsp;&emsp;&emsp;a transaction reaches its commit point, ensuring that other transactions do not see<br>
&emsp;&emsp;&emsp;&emsp;the intermediate, uncommitted data.<br>
&emsp;&emsp;&emsp;ii. **\[2 points\]** Using 2PL guarantees a conflict-serializable schedule.<br>
&emsp;&emsp;&emsp;&emsp;☒ **True**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  False<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** True. Using regular 2PL guarantees a conflict-serializable schedule be-<br>
&emsp;&emsp;&emsp;&emsp;cause it generates schedules whose precedence graph is acyclic. This is because<br>
&emsp;&emsp;&emsp;&emsp;this ordering of acquiring resources (via the locks) ensures that there is a order of<br>
&emsp;&emsp;&emsp;&emsp;acquisition precedence.<br>
&emsp;&emsp;&emsp;iii. **\[2 points\]** For a schedule following strong strict 2PL, the dependency graph is guar-<br>
&emsp;&emsp;&emsp;&emsp;anteed to be acyclic.<br>
&emsp;&emsp;&emsp;&emsp;☒ **True**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  False<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** True. Using regular 2PL guarantees a conflict-serializable schedule, and<br>
&emsp;&emsp;&emsp;&emsp;a schedule provided by strong strict 2PL has an even stronger guarantee which<br>
&emsp;&emsp;&emsp;&emsp;means it also avoids the formation of cycles in the dependency graph.<br>
&emsp;&emsp;&emsp;iv. **\[2 points\]** A schedule that is view-serializable is also conflict-serializable.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** False.   There exists view-serializable schedules that are not conflict-<br>
&emsp;&emsp;&emsp;&emsp;serializable.<br>
&emsp;&emsp;&emsp;v. **\[2 points\]** Dirty reads are possible under conflict-serializable schedules.<br>
&emsp;&emsp;&emsp;&emsp;☒ **True**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  False<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** True. Conflict-serializability ensures that the schedule is conflict equiva-<br>
&emsp;&emsp;&emsp;&emsp;lent to a serial schedule. However, dirty reads can still occur in conflict-serializable<br>
&emsp;&emsp;&emsp;&emsp;schedules, especially when considering cascading aborts. If a transaction reads data<br>
&emsp;&emsp;&emsp;&emsp;written by another transaction which later gets aborted, then the first transaction has<br>
&emsp;&emsp;&emsp;&emsp;effectively read “dirty” data.


### Question 1 continues...


---

<a id="page-3"></a>
**Page 3**

15-445/645 (Fall 2024)   Homework #5   Page 3 of 13

&emsp;(b) Serializability:<br>
&emsp;&emsp;&emsp;Consider the schedule of 4 transactions in Table 1. R(·) and W(·) stand for ‘Read’ and<br>
&emsp;&emsp;&emsp;‘Write’, respectively, and time increases from left to right. (This is in contrast to the<br>
&emsp;&emsp;&emsp;diagrams in class, where time proceeded downward.)<br>
&emsp;&emsp;&emsp;&emsp;t1   t2   t3   t4   t5   t6   t7   t8   t9   t10<br>
&emsp;&emsp;T1   R(A)   R(B)   W(B)<br>
&emsp;&emsp;T2   R(E)   W(E)   R(D)   W(C)   W(A)<br>
&emsp;&emsp;T3   R(B)   W(C)   W(A)<br>
&emsp;&emsp;T4   R(B)   R(D)   W(D)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Table 1: A schedule with 4 transactions<br>
&emsp;&emsp;&emsp;i. **\[2 points\]** Is this schedule serial?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **No**<br>
&emsp;&emsp;&emsp;&emsp;☐  Yes<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** This schedule isn’t serial because this schedule interleaves the actions of<br>
&emsp;&emsp;&emsp;&emsp;different transactions.<br>
&emsp;&emsp;&emsp;ii. **\[6 points\]** Compute the conflict dependency graph for the schedule in Table 1, se-<br>
&emsp;&emsp;&emsp;&emsp;lecting all edges that appear in the graph.<br>
&emsp;&emsp;&emsp;&emsp;☒ T1 →T2   ☒ T3 →T1   ☒ T4 →T1<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  T2 →T1<br>
&emsp;&emsp;&emsp;&emsp;☒ T1 →T3   ☒ T3 →T2   ☒ T4 →T2<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  T2 →T3<br>
&emsp;&emsp;&emsp;&emsp;☐  T1 →T4   ☐  T2 →T4   ☐  T3 →T4   ☐  T4 →T3

&emsp;&emsp;&emsp;&emsp;**Solution:** The answer is:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;• T1 →T2(A), T1 →T3(A)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;• T3 →T1(B), T3 →T2(A, C)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;• T4 →T1(B), T4 →T2(D)<br>
&emsp;&emsp;&emsp;iii. **\[2 points\]** Is this schedule conflict-serializable?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **No**<br>
&emsp;&emsp;&emsp;&emsp;☐  Yes<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** This schedule is not conflict-serializable because there are cycles in its<br>
&emsp;&emsp;&emsp;&emsp;data dependency graph.<br>
&emsp;&emsp;&emsp;iv. **\[2 points\]** Is this schedule possible under regular 2PL?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **No**<br>
&emsp;&emsp;&emsp;&emsp;☐  Yes<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** This schedule is not possible under 2PL because it is not conflict serial-<br>
&emsp;&emsp;&emsp;&emsp;izable, and 2PL is guaranteed to produce conflict serializable schedules.<br>
&emsp;&emsp;&emsp;v. **\[4 points\]** Is this schedule view-serializable?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **No**<br>
&emsp;&emsp;&emsp;&emsp;☐  Yes


### Question 1 continues...


---

<a id="page-4"></a>
**Page 4**

15-445/645 (Fall 2024)   Homework #5   Page 4 of 13

&emsp;&emsp;&emsp;&emsp;**Solution:** This schedule isn’t view serializable because this schedule is not view<br>
&emsp;&emsp;&emsp;&emsp;equivalent to any serial schedule of transaction execution.


### Question 1 continues...


---

<a id="page-5"></a>
**Page 5**

15-445/645 (Fall 2024)   Homework #5   Page 5 of 13

&emsp;(c) **Deadlock Prevention:**<br>
&emsp;&emsp;&emsp;Consider the following lock requests in Table 2.<br>
&emsp;&emsp;&emsp;Like before,<br>
&emsp;&emsp;&emsp;• S(·) and X(·) stand for ‘shared lock’ and ‘exclusive lock’, respectively.<br>
&emsp;&emsp;&emsp;• T1, T2, T3, and T4 represent four transactions.<br>
&emsp;&emsp;&emsp;• LM represents a ‘lock manager’.<br>
&emsp;&emsp;&emsp;• Transactions will never release a granted lock.

&emsp;&emsp;&emsp;&emsp;&emsp;timet1   t2   t3   t4   t5   t6   t7   t8<br>
&emsp;&emsp;&emsp;&emsp;&emsp;T1   X(A)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;T2   X(C)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;T3   X(A)   S(C)   X(B)   X(D)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;T4   S(B)   X(C)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;LM   g<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Table 2: Lock requests of four transactions

&emsp;&emsp;&emsp;i. To prevent deadlock, we use a lock manager (LM) that adopts the Wait-Die policy.<br>
&emsp;&emsp;&emsp;&emsp;We assume that in terms of priority: T1 \> T2 \> T3 \> T4. Here, T1 \> T2 because T1<br>
&emsp;&emsp;&emsp;&emsp;is older than T2 (i.e., older transactions have higher priority). Determine whether the<br>
&emsp;&emsp;&emsp;&emsp;lock request is granted (‘g’), blocked (‘b’), aborted (‘a’), or already dead(‘–’).<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **b**<br>
&emsp;&emsp;&emsp;&emsp;α) **\[1 point\]** At t2:   ☐  g   ☐  a   ☐  –<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Solution:** T3 already holds exclusive lock on A. T1 is older than T3 so it waits.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **g**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;β) **\[1 point\]** At t3:   ☐  b   ☐  a   ☐  –<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **b**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;γ) **\[1 point\]** At t4:   ☐  g   ☐  a   ☐  –<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Solution:** T3 already holds shared lock on C. T2 is older than T3 so it waits.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **g**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;δ) **\[1 point\]** At t5:   ☐  b   ☐  a   ☐  –<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **a**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;ϵ) **\[1 point\]** At t6:   ☐  g   ☐  b   ☐  –<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Solution:** T3 already holds exclusive lock on B. T4 is younger than T3 so it<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;aborts.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **–**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;ζ) **\[1 point\]** At t7:   ☐  g   ☐  b   ☐  a<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Solution:** T4 is already dead since it got aborted at t6.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **g**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;η) **\[1 point\]** At t8:☐  b   ☐  a   ☐  –<br>
&emsp;&emsp;&emsp;ii. Now we use a lock manager (LM) that adopts the Wound-Wait policy. We assume<br>
&emsp;&emsp;&emsp;&emsp;that in terms of priority: T1 \> T2 \> T3 \> T4. Here, T1 \> T2 because T1 is older than<br>
&emsp;&emsp;&emsp;&emsp;T2 (i.e., older transactions have higher priority). Determine whether the lock request<br>
&emsp;&emsp;&emsp;&emsp;is granted (‘g’), blocked (‘b’), granted by aborting another transaction (‘k’), or the<br>
&emsp;&emsp;&emsp;&emsp;requester is already dead(‘–’). Follow the same format as the previous question.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **k**<br>
&emsp;&emsp;&emsp;&emsp;α) **\[1 point\]** At t2:☐  g   ☐  b   ☐  –


### Question 1 continues...


---

<a id="page-6"></a>
**Page 6**

15-445/645 (Fall 2024)   Homework #5   Page 6 of 13

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Solution:** T3 already holds exclusive lock on A. T1 is older than T3 so it causes<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;T3 to abort.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **–**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;β) **\[1 point\]** At t3:   ☐  g   ☐  b   ☐  k<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **g**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;γ) **\[1 point\]** At t4:   ☐  b   ☐  k   ☐  –<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **–**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;δ) **\[1 point\]** At t5:   ☐  g   ☐  b   ☐  k<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Solution:** T3 was aborted at t2.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **g**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;ϵ) **\[1 point\]** At t6:   ☐  b   ☐  k   ☐  –<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **b**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;ζ) **\[1 point\]** At t7:   ☐  g   ☐  k   ☐  –<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Solution:** T2 already holds exclusive lock on C. T4 is younger than T2 so it<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;waits.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **–**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;η) **\[1 point\]** At t8:   ☐  g   ☐  b   ☐  k<br>
&emsp;&emsp;&emsp;iii. **\[2 points\]** If a transaction is aborted because of the DBMS’s deadlock prevention<br>
&emsp;&emsp;&emsp;&emsp;policy, then that transaction keeps its original timestamp when restarting.<br>
&emsp;&emsp;&emsp;&emsp;☒ **True**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  False<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** True. A txn is always executed with the same timestamp it was originally<br>
&emsp;&emsp;&emsp;&emsp;assigned. Otherwise it could get starved out by other txns that keep arriving.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #5 continues...


---

<a id="page-7"></a>
**Page 7**

15-445/645 (Fall 2024)   Homework #5   Page 7 of 13


### **Question 2: Hierarchical Locking . . . . . . . . . . . . . . . . . . . . . . . . . . . . . \[28 points\]**

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
&emsp;(a) **\[4 points\]** Edit the `begin_date_year` for the 24th record on `A40`.<br>
&emsp;&emsp;&emsp;☒ `IX(D),` `IX(A),` `IX(A40),` `X(A40.24)`<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `IX(A),` `SIX(A40),` `X(A40.24)`<br>
&emsp;&emsp;&emsp;☐  `IS(D),` `IS(A),` `IS(A40),` `S(A40.24)`<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `IX(A),` `S(A40),` `X(A40.24)`<br>
&emsp;&emsp;&emsp;**Solution:** The correct choice is `IX(D),` `IX(A),` `IX(A40),` `X(A40.24)`. This choice<br>
&emsp;&emsp;&emsp;is correct because it accesses all intention locks and the exclusive lock on `A40.24`, so it<br>
&emsp;&emsp;&emsp;can perform both a read and write while holding this exclusive lock.<br>
&emsp;&emsp;&emsp;&emsp;• `IX(D),` `IX(A),` `SIX(A40),` `X(A40.24)` is incorrect because it gains a shared<br>
&emsp;&emsp;&emsp;&emsp;&emsp;intention lock for `A40` when it only needs to read `A40.24`, thus limiting potential<br>
&emsp;&emsp;&emsp;&emsp;&emsp;for concurrency.<br>
&emsp;&emsp;&emsp;&emsp;• `IS(D),` `IS(A),` `IS(A40),` `S(A40.24)` is incorrect because we plan on modifying<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`A40.24`, but we are only gaining a shared lock on `A40.24`, which isn’t sufficient.<br>
&emsp;&emsp;&emsp;&emsp;• `IX(D),` `IX(A),` `S(A40),` `X(A40.24)` is incorrect because while it gains a intention-<br>
&emsp;&emsp;&emsp;&emsp;&emsp;exclusive locks for `R` and the database, it then gains a shared lock on `A40` which is<br>
&emsp;&emsp;&emsp;&emsp;&emsp;not sufficient to gain the exclusive lock on `A40.24`.<br>
&emsp;(b) **\[4 points\]** Fetch the records of all releases in `R` with `genre` `=` `'Metal'`.<br>
&emsp;&emsp;&emsp;☐  `SIX(D),` `S(R)`<br>
&emsp;&emsp;&emsp;☒ `IS(D),` `S(R)`<br>
&emsp;&emsp;&emsp;☐  `S(D)`<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `S(R)`


### Question 2 continues...


---

<a id="page-8"></a>
**Page 8**

15-445/645 (Fall 2024)   Homework #5   Page 8 of 13

&emsp;&emsp;&emsp;**Solution:** The correct answer choice is `IS(D),` `S(R)`. We need to scan records in table<br>
&emsp;&emsp;&emsp;R to find records where `genre` `=` `'Metal'`. This choice is correct because it accesses<br>
&emsp;&emsp;&emsp;the intended shared parent lock to get the shared lock on table `R`.<br>
&emsp;&emsp;&emsp;&emsp;• `SIX(D),` `S(R)` is incorrect because it gains a shared+intention-exclusive lock on<br>
&emsp;&emsp;&emsp;&emsp;&emsp;the database `D` when it only needs to read from `R` and has no intention of modifying<br>
&emsp;&emsp;&emsp;&emsp;&emsp;any records.<br>
&emsp;&emsp;&emsp;&emsp;• `S(D)` is incorrect because it gains a shared lock on the entire database `D` when it<br>
&emsp;&emsp;&emsp;&emsp;&emsp;only needs to fetch rows in table `R`.<br>
&emsp;&emsp;&emsp;&emsp;• `IX(D),` `S(R)` is incorrect because it gains an intention-exclusive lock when it has<br>
&emsp;&emsp;&emsp;&emsp;&emsp;no intention of modifying.<br>
&emsp;(c) **\[4 points\]** Update the `status` for all release records with `year` `=` `2023` to `'Finished'`.<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `IX(R)`<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `SIX(R)`<br>
&emsp;&emsp;&emsp;☒ `IX(D),` `X(R)`<br>
&emsp;&emsp;&emsp;☐  `SIX(D),` `X(R)`<br>
&emsp;&emsp;&emsp;**Solution:** The correct answer choice is `IX(D),` `X(R)`. This choice is correct because<br>
&emsp;&emsp;&emsp;it accesses all intended locks and the exclusive lock on `R`, since we potentially need to<br>
&emsp;&emsp;&emsp;modify all records in `R`.<br>
&emsp;&emsp;&emsp;&emsp;• `IX(D),` `IX(R)` is incorrect because it does not gain an exclusive lock for the<br>
&emsp;&emsp;&emsp;&emsp;&emsp;records of `R` it needs to delete.<br>
&emsp;&emsp;&emsp;&emsp;• `IX(D),` `SIX(R)` is incorrect because it does not gain an exclusive lock for the<br>
&emsp;&emsp;&emsp;&emsp;&emsp;records of `R` it needs to delete.<br>
&emsp;&emsp;&emsp;&emsp;• `SIX(D),` `X(R)` is incorrect because it gains a shared intention parent lock for `D`,<br>
&emsp;&emsp;&emsp;&emsp;&emsp;when it only needs to read from `R`.<br>
&emsp;(d) **\[4 points\]** Modify the 29th record on `R42`.<br>
&emsp;&emsp;&emsp;☐  `IS(D),` `IS(R),` `IS(R42),` `X(R42.29)`<br>
&emsp;&emsp;&emsp;☐  `SIX(D),` `IX(R),` `IX(R42),` `X(R42.29)`<br>
&emsp;&emsp;&emsp;☒ `IX(D),` `IX(R),` `IX(R42),` `X(R42.29)`<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `IX(R),` `IX(R42),` `IX(R42.29)`<br>
&emsp;&emsp;&emsp;**Solution:** The correct choice is `IX(D),` `IX(R),` `IX(R42),` `X(R42.29)`. This choice<br>
&emsp;&emsp;&emsp;is correct because it accesses all intended exclusive locks for all parent levels necessary,<br>
&emsp;&emsp;&emsp;and then accesses the exclusive lock for the particular record.<br>
&emsp;&emsp;&emsp;&emsp;• `IS(D),` `IS(R),` `IS(R42),` `X(R42.29)` is incorrect because the DBMS intends to<br>
&emsp;&emsp;&emsp;&emsp;&emsp;write to a tuple, so it should not grab the shared intention parent locks.<br>
&emsp;&emsp;&emsp;&emsp;• `SIX(D),` `IX(R),` `IX(R42),` `X(R42.29)` is incorrect because the DBMS only


### Question 2 continues...


---

<a id="page-9"></a>
**Page 9**

15-445/645 (Fall 2024)   Homework #5   Page 9 of 13

&emsp;&emsp;&emsp;&emsp;&emsp;intends to write to a tuple, not read any data. Therefore it should not grab the<br>
&emsp;&emsp;&emsp;&emsp;&emsp;shared-exclusive intention lock.<br>
&emsp;&emsp;&emsp;&emsp;• `IX(D),` `IX(R),` `IX(R42),` `IX(R42.29)` is incorrect because it only gets the<br>
&emsp;&emsp;&emsp;&emsp;&emsp;intention exclusive lock for the record.<br>
&emsp;(e) **\[4 points\]** Scan all records on pages `R1` to `R10` and modify the 12th record on `R17`.<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `S(R),` `X(R17)`<br>
&emsp;&emsp;&emsp;☐  `SIX(D),` `IX(R),` `IX(R17),` `X(R17.12)`<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `IX(R),` `IX(R1-R10),` `IX(R17),` `X(R17.12)`<br>
&emsp;&emsp;&emsp;☒ `IX(D),` `SIX(R),` `IX(R17),` `X(R17.12)`<br>
&emsp;&emsp;&emsp;**Solution:** The correct choice is `IX(D),` `SIX(R),` `IX(R17),` `X(R17.12)`. This choice<br>
&emsp;&emsp;&emsp;is correct because it accesses all intended locks and the exclusive lock `X(R17.12)`. It<br>
&emsp;&emsp;&emsp;also gains a shared lock on `R`, so it can read pages `R1` to `R10`.<br>
&emsp;&emsp;&emsp;&emsp;• `IX(D),` `S(R),` `X(R17)` is incorrect because it fails to gain a intention-exclusive<br>
&emsp;&emsp;&emsp;&emsp;&emsp;lock for `R`.<br>
&emsp;&emsp;&emsp;&emsp;• `SIX(D),` `IX(R),` `IX(R17),` `X(R17.12)` is incorrect because it gains a shared<br>
&emsp;&emsp;&emsp;&emsp;&emsp;intention lock for the database `D` when it only needs to read from `R`.<br>
&emsp;&emsp;&emsp;&emsp;• `IX(D),` `IX(R),` `IX(R1-R10),` `IX(R17),` `X(R17.12)` is incorrect because it fails<br>
&emsp;&emsp;&emsp;&emsp;&emsp;to gain shared locks to read from `R1-R10`.<br>
&emsp;(f) **\[4 points\]** Two users are trying to access data. User A is scanning all the records in `A` to<br>
&emsp;&emsp;&emsp;read, while User B is trying to modify the 27th record in `R3`. Which of the following sets<br>
&emsp;&emsp;&emsp;of locks are most suitable for this scenario?<br>
&emsp;&emsp;&emsp;☐  `User` `A:` `SIX(D),` `S(A),` `User` `B:` `SIX(D),` `IX(R),` `IX(R3),` `X(R3.27)`<br>
&emsp;&emsp;&emsp;☐  `User` `A:` `S(D),` `User` `B:` `X(D)`<br>
&emsp;&emsp;&emsp;☐  `User` `A:` `IS(D),` `S(A),` `User` `B:` `SIX(D),` `IX(R),` `IX(R3),` `X(R3.27)`<br>
&emsp;&emsp;&emsp;☒ `User` `A:` `IS(D),` `S(A),` `User` `B:` `IX(D),` `IX(R),` `IX(R3),` `X(R3.27)`<br>
&emsp;&emsp;&emsp;**Solution:** The correct choice is `User` `A:` `IS(D),` `S(A)` `and` `User` `B:` `IX(D),` `IX(R),`<br>
&emsp;&emsp;&emsp;`IX(R3),` `X(R3.27)`. This choice is correct because:<br>
&emsp;&emsp;&emsp;&emsp;• User A only intends to read all records in `R`. Thus, he acquires an intention shared<br>
&emsp;&emsp;&emsp;&emsp;&emsp;lock on the database `D` and a shared lock on the table `R`.<br>
&emsp;&emsp;&emsp;&emsp;• User B intends to modify a specific record in table `A`. He acquires an intention<br>
&emsp;&emsp;&emsp;&emsp;&emsp;exclusive lock on the database `D`, an intention exclusive lock on the table `R`, and<br>
&emsp;&emsp;&emsp;&emsp;&emsp;then an exclusive lock on the specific record `R3.27`.

&emsp;&emsp;&emsp;Other choices are incorrect because:<br>
&emsp;&emsp;&emsp;&emsp;• `User` `A:` `SIX(D),` `S(A)` `and` `User` `B:` `SIX(D),` `IX(R),` `IX(R3),` `X(R3.27)`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;is incorrect because User A doesn’t need to acquire shared intention exclusive


### Question 2 continues...


---

<a id="page-10"></a>
**Page 10**

15-445/645 (Fall 2024)   Homework #5   Page 10 of 13

&emsp;&emsp;&emsp;&emsp;&emsp;locks for a mere read operation, and neither does User B for a specific record<br>
&emsp;&emsp;&emsp;&emsp;&emsp;modification.<br>
&emsp;&emsp;&emsp;&emsp;• `User` `A:` `S(D)` `and` `User` `B:` `X(D)` is problematic as it locks the entire database<br>
&emsp;&emsp;&emsp;&emsp;&emsp;either in shared mode or exclusive mode, preventing concurrent operations.<br>
&emsp;&emsp;&emsp;&emsp;• `User` `A:` `IS(D),` `S(A)` `and` `User` `B:` `SIX(D),` `IX(R),` `IX(R3),` `X(R3.27)` is<br>
&emsp;&emsp;&emsp;&emsp;&emsp;incorrect because while User A’s locks are appropriate for his read operation, User<br>
&emsp;&emsp;&emsp;&emsp;&emsp;B does not need a shared intention exclusive lock on the database for modifying a<br>
&emsp;&emsp;&emsp;&emsp;&emsp;specific record.<br>
&emsp;(g) **\[4 points\]** Delete records in `A` if `type='Orchestra'`.<br>
&emsp;&emsp;&emsp;☒ `IX(D),` `X(A)`<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `IX(A)`<br>
&emsp;&emsp;&emsp;☐  `SIX(D),` `X(A)`<br>
&emsp;&emsp;&emsp;☐  `SIX(D),` `SIX(A)`<br>
&emsp;&emsp;&emsp;**Solution:** The correct choice is `IX(D),` `X(A)`. This choice is correct because it accesses<br>
&emsp;&emsp;&emsp;all intended locks and the exclusive lock on `A`, since we potentially need to modify all<br>
&emsp;&emsp;&emsp;records in `A`.<br>
&emsp;&emsp;&emsp;&emsp;• `IX(D),` `IX(A)` is incorrect because it does not gain an exclusive lock for the<br>
&emsp;&emsp;&emsp;&emsp;&emsp;records of `A` it needs to delete.<br>
&emsp;&emsp;&emsp;&emsp;• `SIX(D),` `X(A)` is incorrect because it gains a shared lock for the database, when<br>
&emsp;&emsp;&emsp;&emsp;&emsp;it does not need to read any contents.<br>
&emsp;&emsp;&emsp;&emsp;• `SIX(D),` `SIX(A)` is incorrect because it gains a shared intention parent lock for<br>
&emsp;&emsp;&emsp;&emsp;&emsp;both `D` and `A`, when it does not need to read any contents, and it does not gain the<br>
&emsp;&emsp;&emsp;&emsp;&emsp;exclusive lock for the records of `A` it needs to delete.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #5 continues...


---

<a id="page-11"></a>
**Page 11**

15-445/645 (Fall 2024)   Homework #5   Page 11 of 13


### **Question 3: Optimistic Concurrency Control . . . . . . . . . . . . . . . . . . \[30 points\]**

&emsp;Consider the following set of transactions accessing a database with object A, B, C, D. You<br>
&emsp;should make the following assumptions:<br>
&emsp;&emsp;• The transaction manager is using **optimistic concurrency control** (OCC).<br>
&emsp;&emsp;• A transaction begins its read phase with its first operation and switches from the READ<br>
&emsp;&emsp;&emsp;phase immediately into the VALIDATION phase after its last operation executes.<br>
&emsp;&emsp;• The DBMS is using the serial validation protocol discussed in class where only one<br>
&emsp;&emsp;&emsp;transaction can be in the validation phase at a time.<br>
&emsp;&emsp;• Each transaction is doing **backwards validation** (i.e. Each transaction, when validating,<br>
&emsp;&emsp;&emsp;checks whether it intersects its read/write sets with any transactions that have already<br>
&emsp;&emsp;&emsp;committed).<br>
&emsp;&emsp;• There are no other transactions in addition to the ones shown below.<br>
&emsp;Note: VALIDATION may or may not succeed for each transaction. If validation fails, the<br>
&emsp;transaction will get immediately aborted.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;time   T1   T2   T3<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1   READ(C)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2   READ(A)   READ(A)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3   WRITE(B)   WRITE(A)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4   WRITE(C)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;5   READ(C)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;6   WRITE(B)   READ(D)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;7<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;8   VALIDATE?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;9   WRITE?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;10   WRITE(D)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;11   VALIDATE?   WRITE(C)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;12   WRITE?   VALIDATE?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;13   WRITE?

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Figure 1: An execution schedule

&emsp;(a) **\[4 points\]** When is each transaction’s timestamp assigned in the transaction process?<br>
&emsp;&emsp;&emsp;☐  The start of the read phase.<br>
&emsp;&emsp;&emsp;☒ **The start of the validation phase.**<br>
&emsp;&emsp;&emsp;☐  The start of the write phase.<br>
&emsp;&emsp;&emsp;☐  Timestamps are not necessary for OCC.<br>
&emsp;&emsp;&emsp;**Solution:** Each transaction’s timestamp is assigned at the beginning of the validation<br>
&emsp;&emsp;&emsp;phase.<br>
&emsp;(b) **\[4 points\]** When time = 5, will T2 read C written by T1?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **No**<br>
&emsp;&emsp;&emsp;☐  Yes


### Question 3 continues...


---

<a id="page-12"></a>
**Page 12**

15-445/645 (Fall 2024)   Homework #5   Page 12 of 13

&emsp;&emsp;&emsp;**Solution:** In OCC, each transaction maintains a private workspace that is invisible to<br>
&emsp;&emsp;&emsp;other transactions until its write phase is completed. Only transactions that start after<br>
&emsp;&emsp;&emsp;T1’s write phase can see the value of C written by T2, provided T1 commits successfully.<br>
&emsp;&emsp;&emsp;Hence, T2 at time = 5 will read the original C, that isn’t written by T1.<br>
&emsp;(c) **\[4 points\]** Will T1 abort?<br>
&emsp;&emsp;&emsp;☒ **Yes**<br>
&emsp;&emsp;&emsp;☐  No<br>
&emsp;&emsp;&emsp;**Solution:** T1 will abort since it should end up reading the value written by T2.<br>
&emsp;(d) **\[4 points\]** Will T2 abort?<br>
&emsp;&emsp;&emsp;☐  Yes<br>
&emsp;&emsp;&emsp;☒ **No**<br>
&emsp;&emsp;&emsp;**Solution:** T2 does not need to abort because no other transactions have been committed<br>
&emsp;&emsp;&emsp;yet.<br>
&emsp;(e) **\[4 points\]** Will T3 abort?<br>
&emsp;&emsp;&emsp;☐  Yes<br>
&emsp;&emsp;&emsp;☒ **No**<br>
&emsp;&emsp;&emsp;**Solution:** T3 will not abort since it does not read anything in T2’s write set.

&emsp;(f) **\[3 points\]** OCC works best when concurrent transactions access disjoint sets of data in<br>
&emsp;&emsp;&emsp;a database.<br>
&emsp;&emsp;&emsp;☒ **True**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  False<br>
&emsp;&emsp;&emsp;**Solution:** OCC is good to use when the number of conflicts is low.

&emsp;(g) **\[3 points\]** Transactions can suffer from phantom reads in OCC.<br>
&emsp;&emsp;&emsp;☒ **True**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  False<br>
&emsp;&emsp;&emsp;**Solution:** Considering the following sequence of events for table A and transactions T1<br>
&emsp;&emsp;&emsp;and T2:<br>
&emsp;&emsp;&emsp;&emsp;• T1 reads all tuples of A.<br>
&emsp;&emsp;&emsp;&emsp;• T2 inserts a new tuple into A.<br>
&emsp;&emsp;&emsp;&emsp;• T2 enters validation phase. Note T2’s write set contains the new tuple whereas<br>
&emsp;&emsp;&emsp;&emsp;&emsp;T2’s read set only contains the initial existing tuples. So T2’s write set does not<br>
&emsp;&emsp;&emsp;&emsp;&emsp;intersect T1’s read set, and T2 validation succeeds.<br>
&emsp;&emsp;&emsp;&emsp;• T2 completes the write phase.<br>
&emsp;&emsp;&emsp;&emsp;• T1 reads all tuples of A again, now including the tuple added by T2.


### Question 3 continues...


---

<a id="page-13"></a>
**Page 13**

15-445/645 (Fall 2024)   Homework #5   Page 13 of 13

&emsp;(h) **\[2 points\]** Aborts are less wasteful in OCC than under 2PL.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;**Solution:** Under OCC, a transaction only aborts after the read and validation phase. In<br>
&emsp;&emsp;&emsp;contrast, a transaction can abort much earlier in 2PL.<br>
&emsp;(i) **\[2 points\]** Transactions can perform dirty reads in OCC.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;**Solution:** One txn cannot see the private workspace of another concurrent txns, so<br>
&emsp;&emsp;&emsp;therefore it can **never** see dirty reads.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;End of Homework #5

