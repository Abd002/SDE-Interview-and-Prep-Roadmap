# CMU 15-445 Spring 2024: Homework 4: Official solutions

> Copied from the original: <https://15445.courses.cs.cmu.edu/spring2024/assignments.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CARNEGIE MELLON UNIVERSITY<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;COMPUTER SCIENCE DEPARTMENT<br>
&emsp;&emsp;&emsp;&emsp;&emsp;15-445/645 – DATABASE SYSTEMS (SPRING 2024)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;PROF. JIGNESH PATEL

&emsp;Homework #4 (by Amy Cheng, Ritu Pathak, Shivang Dalal) – Solutions<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Due: **Saturday April 6, 2024 @ 11:59pm**

**IMPORTANT:**<br>
&emsp;• Enter all of your answers into **Gradescope by 11:59pm on Saturday April 6, 2024**.<br>
&emsp;• **Plagiarism**: Homework may be discussed with other students, but all homework is to be<br>
&emsp;&emsp;completed **individually**.<br>
For your information:<br>
&emsp;• Graded out of **100** points; **4** questions total<br>
&emsp;• Rough time estimate: ≈2 - 4 hours (0.5 - 1 hours for each question)<br>
&emsp;Revision : 2024/04/04 13:56

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

15-445/645 (Spring 2024)   Homework #4   Page 2 of 12


### **Question 1: Query Execution, Planning, and Optimization . . . . . \[24 points\]**

&emsp;**Graded by:**<br>
&emsp;(a) **\[3 points\]** The zone map optimization is more effective in speeding up OLAP queries<br>
&emsp;&emsp;&emsp;as opposed to OLTP queries.<br>
&emsp;&emsp;&emsp;☒ **True**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  False<br>
&emsp;&emsp;&emsp;**Solution:** Recall that the zone map optimization pre-computes aggregations for each<br>
&emsp;&emsp;&emsp;tuple attribute in a page. Since OLAP DBMSs (which store columns of data contigu-<br>
&emsp;&emsp;&emsp;ously) are typically the DBMS of choice when running aggregate queries, zone maps<br>
&emsp;&emsp;&emsp;are more useful for speeding up OLAP queries.<br>
&emsp;(b) **\[3 points\]** For OLAP queries, which often involve complex operations on vast datasets,<br>
&emsp;&emsp;&emsp;intra-query parallelism is typically not preferred to optimize performance.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;**Solution:** False. OLAP queries, characterized by their complex operations on large<br>
&emsp;&emsp;&emsp;volumes of data, can greatly benefit from intra-query parallelism. By executing the<br>
&emsp;&emsp;&emsp;operations of a single query in parallel, it helps in significantly decreasing the latency,<br>
&emsp;&emsp;&emsp;thus optimizing the performance of these types of queries.<br>
&emsp;(c) **\[3 points\]** The process per DBMS worker approach provides better fault isolation than<br>
&emsp;&emsp;&emsp;the thread per DBMS worker approach.<br>
&emsp;&emsp;&emsp;☒ **True**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  False<br>
&emsp;&emsp;&emsp;**Solution:** True. In the process per DBMS worker approach, each worker runs in its<br>
&emsp;&emsp;&emsp;process, meaning that if one process fails, it doesn’t directly affect the others. Whereas<br>
&emsp;&emsp;&emsp;in a thread per DBMS worker approach, all threads share the same process address<br>
&emsp;&emsp;&emsp;space, so a fault in one thread could potentially impact others.<br>
&emsp;(d) **\[3 points\]** In OLAP workload, the vectorized model’s performance improvements come<br>
&emsp;&emsp;&emsp;mainly from the reduction in the number of disk I/O operations.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;**Solution:** False. While the Vectorized Model can reduce some I/O operations due to<br>
&emsp;&emsp;&emsp;its batch processing, its primary advantage is from reducing CPU overhead, optimizing<br>
&emsp;&emsp;&emsp;cache utilization, and leveraging SIMD instructions.<br>
&emsp;(e) **\[3 points\]** An index scan is always better (fewer I/O operations, faster run-time) than a<br>
&emsp;&emsp;&emsp;sequential scan if the query contains an `ORDER` `BY` clause matching the index key.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;**Solution:** An index scan may require multiple I/O operations per result tuple (to look up<br>
&emsp;&emsp;&emsp;the row in the index, then retrieve additional attributes in the heap) whereas a sequential<br>
&emsp;&emsp;&emsp;scan will just go through the heap. Moreover, a sequential heap scan may benefit more<br>
&emsp;&emsp;&emsp;from pre-fetching pages. PostgreSQL’s optimizer defaults to picking sequential scans<br>
&emsp;&emsp;&emsp;over index scans if it thinks that you’re asking for more than (very approximately) 10%<br>
&emsp;&emsp;&emsp;of all rows in the table. Note that based on the number of expected returned tuples,


### Question 1 continues...


---

<a id="page-3"></a>
**Page 3**

15-445/645 (Spring 2024)   Homework #4   Page 3 of 12

&emsp;&emsp;&emsp;clustered indexes will perform very well. Unclustered indexes however will not be as<br>
&emsp;&emsp;&emsp;helpful.<br>
&emsp;(f) **\[3 points\]** The query optimizer in a database management system always guarantees the<br>
&emsp;&emsp;&emsp;generation of an optimal execution plan by exhaustively evaluating all possible plans to<br>
&emsp;&emsp;&emsp;ensure the lowest cost for query execution.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;**Solution:** No, it is usually not necessary to estimate the cost of every plan for a query<br>
&emsp;&emsp;&emsp;via a cost model. In this case, the time it would take to enumerate every plan and then<br>
&emsp;&emsp;&emsp;filter out the plans to pick the most optimal one would introduce too high of an overhead<br>
&emsp;&emsp;&emsp;compared to the query time itself. Usually, DBMSs will use rule-based optimizations<br>
&emsp;&emsp;&emsp;(or heuristics) first, transforming the plan into a more simple one.<br>
&emsp;(g) **\[3 points\]** Predicate pushdown involves moving filter conditions closer to the node where<br>
&emsp;&emsp;&emsp;the data is stored, while projection pushdown involves transferring only the necessary<br>
&emsp;&emsp;&emsp;columns of the data.<br>
&emsp;&emsp;&emsp;☒ **True**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  False<br>
&emsp;&emsp;&emsp;**Solution:** True. Predicate pushdown is an optimization technique that moves the predi-<br>
&emsp;&emsp;&emsp;cate (i.e., the WHERE clause conditions) to execute on the data node where the relevant<br>
&emsp;&emsp;&emsp;data is stored. This filters out irrelevant data at the source, reducing data transfer. Sim-<br>
&emsp;&emsp;&emsp;ilarly, projection pushdown ensures that only required columns are retrieved, further<br>
&emsp;&emsp;&emsp;optimizing data movement and query performance.<br>
&emsp;(h) **\[3 points\]** The vectorized query processing model (which uses SIMD instructions to<br>
&emsp;&emsp;&emsp;parallelize operations) is an example of intra-query parallelism.<br>
&emsp;&emsp;&emsp;☒ **True**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  False<br>
&emsp;&emsp;&emsp;**Solution:** This is true. Intra-query parallelism is when the DBMS executes the op-<br>
&emsp;&emsp;&emsp;erations of a single query in parallel. Therefore, using SIMD instructions within a<br>
&emsp;&emsp;&emsp;vectorized processing model to execute a query would be an example of intra-query<br>
&emsp;&emsp;&emsp;parallelism.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #4 continues...


---

<a id="page-4"></a>
**Page 4**

15-445/645 (Spring 2024)   Homework #4   Page 4 of 12


### **Question 2: Serializability and 2PL. . . . . . . . . . . . . . . . . . . . . . . . . . . .\[26 points\]**

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
&emsp;&emsp;&emsp;ii. **\[3 points\]** For a schedule following strong strict 2PL, the dependency graph is guar-<br>
&emsp;&emsp;&emsp;&emsp;anteed to be acyclic.<br>
&emsp;&emsp;&emsp;&emsp;☒ **True**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  False<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** True. Using regular 2PL guarantees a conflict-serializable schedule, and<br>
&emsp;&emsp;&emsp;&emsp;a schedule provided by strong strict 2PL has an even stronger guarantee which<br>
&emsp;&emsp;&emsp;&emsp;means it also avoids the formation of cycles in the dependency graph.<br>
&emsp;&emsp;&emsp;iii. **\[2 points\]** Using 2PL guaruntees a conflict-serializable schedule.<br>
&emsp;&emsp;&emsp;&emsp;☒ **True**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  False<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** True. Using regular 2PL guarantees a conflict-serializable schedule be-<br>
&emsp;&emsp;&emsp;&emsp;cause it generates schedules whose precedence graph is acyclic. This is because<br>
&emsp;&emsp;&emsp;&emsp;this ordering of acquiring resources (via the locks) ensures that there is a order of<br>
&emsp;&emsp;&emsp;&emsp;acquisition precedence.<br>
&emsp;&emsp;&emsp;iv. **\[2 points\]** Conflict-serializable schedules prevent unrepeatable reads and dirty reads.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** False. Conflict-serializability ensures that the schedule is conflict equiv-<br>
&emsp;&emsp;&emsp;&emsp;alent to a serial schedule, thus protecting against unrepeatable reads. However, dirty<br>
&emsp;&emsp;&emsp;&emsp;reads can still occur in conflict-serializable schedules, especially when considering<br>
&emsp;&emsp;&emsp;&emsp;cascading aborts. If a transaction reads data written by another transaction which<br>
&emsp;&emsp;&emsp;&emsp;later gets aborted, then the first transaction has effectively read ”dirty” data.<br>
&emsp;&emsp;&emsp;v. **\[2 points\]** A schedule that is view-serializable is also conflict-serializable.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** False.   There exists view-serializable schedules that are not conflict-<br>
&emsp;&emsp;&emsp;&emsp;serializable.<br>
&emsp;(b) Serializability:<br>
&emsp;&emsp;&emsp;Consider the schedule of 4 transactions in Table 1. R(·) and W(·) stand for ‘Read’ and<br>
&emsp;&emsp;&emsp;‘Write’, respectively, and time increases from left to right. (This is in contrast to the<br>
&emsp;&emsp;&emsp;diagrams in class, where time proceeded downward.)


### Question 2 continues...


---

<a id="page-5"></a>
**Page 5**

15-445/645 (Spring 2024)   Homework #4   Page 5 of 12

&emsp;&emsp;&emsp;&emsp;t1   t2   t3   t4   t5   t6   t7   t8   t9   t10<br>
&emsp;&emsp;T1   R(B)   W(C)   W(A)<br>
&emsp;&emsp;T2   W(E)   R(E)   W(C)   R(D)   W(A)<br>
&emsp;&emsp;T3   R(A)   W(B)   R(B)<br>
&emsp;&emsp;T4   R(D)   R(B)   W(D)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Table 1: A schedule with 4 transactions

&emsp;&emsp;&emsp;i. **\[3 points\]** Is this schedule serial?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **No**<br>
&emsp;&emsp;&emsp;&emsp;☐  Yes<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** This schedule isn’t serial because this schedule interleaves the actions of<br>
&emsp;&emsp;&emsp;&emsp;different transactions.<br>
&emsp;&emsp;&emsp;ii. **\[3 points\]** Is this schedule conflict-serializable?<br>
&emsp;&emsp;&emsp;&emsp;☒ **Yes**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  No<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** This schedule is conflict-serializable because there are no cycles in its<br>
&emsp;&emsp;&emsp;&emsp;data dependency graph. Moreover, this schedule is conflict equivalent (every pair of<br>
&emsp;&emsp;&emsp;&emsp;conflicting operations is ordered in the same way) to a serial schedule of transaction<br>
&emsp;&emsp;&emsp;&emsp;execution.<br>
&emsp;&emsp;&emsp;iii. **\[5 points\]** Compute the conflict dependency graph for the schedule in Table 1, se-<br>
&emsp;&emsp;&emsp;&emsp;lecting all edges (and the object that caused the dependency) that appear in the graph.<br>
&emsp;&emsp;&emsp;&emsp;☒ T1 →T2<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  T2 →T3   ☐  T2 →T4<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ T3 →T2   ☒ T4 →T2<br>
&emsp;&emsp;&emsp;&emsp;☐  T2 →T1<br>
&emsp;&emsp;&emsp;&emsp;☒ T1 →T3<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  T1 →T4   ☐  T3 →T4<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ T4 →T3<br>
&emsp;&emsp;&emsp;&emsp;☐  T3 →T1   ☐  T4 →T1

&emsp;&emsp;&emsp;&emsp;**Solution:** The answer is:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;• T1 →T2(A, C), T1 →T3(A, B)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;• T3 →T2(A)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;• T4 →T2(D), T4 →T3(B)<br>
&emsp;&emsp;&emsp;&emsp;For A, there is a W-W conflict from T1 to T2, a W-R conflict from T1 to T3, and a<br>
&emsp;&emsp;&emsp;&emsp;R-W conflict from T3 to T2;<br>
&emsp;&emsp;&emsp;&emsp;For B, there is a R-W conflict from T1 to T3 and a R-W conflict from T4 to T3;<br>
&emsp;&emsp;&emsp;&emsp;For C, there is a W-W conflict from T1 to T2;<br>
&emsp;&emsp;&emsp;&emsp;For D, there is a W-R conflict from T4 to T2.<br>
&emsp;&emsp;&emsp;&emsp;For E, there are no conflicts.<br>
&emsp;&emsp;&emsp;iv. **\[3 points\]** Is this schedule possible under regular 2PL?<br>
&emsp;&emsp;&emsp;&emsp;☒ **Yes**<br>
&emsp;&emsp;&emsp;&emsp;☐  No


### Question 2 continues...


---

<a id="page-6"></a>
**Page 6**

15-445/645 (Spring 2024)   Homework #4   Page 6 of 12

&emsp;&emsp;&emsp;&emsp;**Solution:** This schedule is possible under 2PL because it is conflict-serializable,<br>
&emsp;&emsp;&emsp;&emsp;and 2PL is guaranteed to produce conflict serializable schedules.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #4 continues...


---

<a id="page-7"></a>
**Page 7**

15-445/645 (Spring 2024)   Homework #4   Page 7 of 12


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
&emsp;&emsp;&emsp;☒ `IS(D),` `S(A)`<br>
&emsp;&emsp;&emsp;☐  `S(D)`<br>
&emsp;&emsp;&emsp;**Solution:** The correct answer choice is `IS(D),` `S(A)`. We need to scan records in table<br>
&emsp;&emsp;&emsp;A to find records where `type` `=` `'Orchestra'`. This choice is correct because it accesses<br>
&emsp;&emsp;&emsp;the intended shared parent lock to get the shared lock on table `A`.<br>
&emsp;&emsp;&emsp;&emsp;• `SIX(D),` `S(A)` is incorrect because it gains a shared+intention-exclusive lock on<br>
&emsp;&emsp;&emsp;&emsp;&emsp;the database `D` when it only needs to read from `A` and has no intention of modifying<br>
&emsp;&emsp;&emsp;&emsp;&emsp;any records.<br>
&emsp;&emsp;&emsp;&emsp;• `IX(D),` `S(A)` is incorrect because it gains an intention-exclusive lock when it has<br>
&emsp;&emsp;&emsp;&emsp;&emsp;no intention of modifying.<br>
&emsp;&emsp;&emsp;&emsp;• `S(D)` is incorrect because it gains a shared lock on the entire database `D` when it<br>
&emsp;&emsp;&emsp;&emsp;&emsp;only needs to fetch rows in table `A`.<br>
&emsp;(b) **\[4 points\]** Update the `genre` for all release records with `language` `=` `'English'` to<br>
&emsp;&emsp;&emsp;`'Musical` `theatre'`.<br>
&emsp;&emsp;&emsp;☒ `IX(D),` `X(R)`<br>
&emsp;&emsp;&emsp;☐  `SIX(D),` `X(R)`<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `IX(R)`<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `SIX(R)`


### Question 3 continues...


---

<a id="page-8"></a>
**Page 8**

15-445/645 (Spring 2024)   Homework #4   Page 8 of 12

&emsp;&emsp;&emsp;**Solution:** The correct answer choice is `IX(D),` `X(R)`. This choice is correct because<br>
&emsp;&emsp;&emsp;it accesses all intended locks and the exclusive lock on `R`, since we potentially need to<br>
&emsp;&emsp;&emsp;modify all records in `R`.<br>
&emsp;&emsp;&emsp;&emsp;• `SIX(D),` `X(R)` is incorrect because it gains a shared intention parent lock for `D`,<br>
&emsp;&emsp;&emsp;&emsp;&emsp;when it only needs to read from `R`.<br>
&emsp;&emsp;&emsp;&emsp;• `IX(D),` `IX(R)` is incorrect because it does not gain an exclusive lock for the<br>
&emsp;&emsp;&emsp;&emsp;&emsp;records of `R` it needs to delete.<br>
&emsp;&emsp;&emsp;&emsp;• `IX(D),` `SIX(R)` is incorrect because it does not gain an exclusive lock for the<br>
&emsp;&emsp;&emsp;&emsp;&emsp;records of `R` it needs to delete.<br>
&emsp;(c) **\[4 points\]** Modify the 7th record on `R80`.<br>
&emsp;&emsp;&emsp;☐  `IS(D),` `IS(R),` `IS(R80),` `X(R80.7)`<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `IX(R),` `IX(R80),` `IX(R80.7)`<br>
&emsp;&emsp;&emsp;☐  `SIX(D),` `IX(R),` `IX(R80),` `X(R80.7)`<br>
&emsp;&emsp;&emsp;☒ `IX(D),` `IX(R),` `IX(R80),` `X(R80.7)`<br>
&emsp;&emsp;&emsp;**Solution:** The correct choice is `IX(D),` `IX(R),` `IX(R80),` `X(R80.7)`. This choice is<br>
&emsp;&emsp;&emsp;correct because it accesses all intended exclusive locks for all parent levels necessary,<br>
&emsp;&emsp;&emsp;and then accesses the exclusive lock for the particular record.<br>
&emsp;&emsp;&emsp;&emsp;• `IS(D),` `IS(R),` `IS(R80),` `X(R80.7)` is incorrect because the DBMS intends to<br>
&emsp;&emsp;&emsp;&emsp;&emsp;write to a tuple, so it should not grab the shared intention parent locks.<br>
&emsp;&emsp;&emsp;&emsp;• `IX(D),` `IX(R),` `IX(R80),` `IX(R80.7)` is incorrect because it only gets the inten-<br>
&emsp;&emsp;&emsp;&emsp;&emsp;tion exclusive lock for the record.<br>
&emsp;&emsp;&emsp;&emsp;• `SIX(D),` `IX(R),` `IX(R80),` `X(R80.7)` is incorrect because the DBMS only in-<br>
&emsp;&emsp;&emsp;&emsp;&emsp;tends to write to a tuple, not read any data. Therefore it should not grab the<br>
&emsp;&emsp;&emsp;&emsp;&emsp;shared-exclusive intention lock.<br>
&emsp;(d) **\[4 points\]** Increment the `number_sold` for the 6th record on `R999`.<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `IX(R),` `SIX(R999),` `X(R999.6)`<br>
&emsp;&emsp;&emsp;☐  `IS(D),` `IS(R),` `IS(R999),` `S(R999.6)`<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `IX(R),` `S(R999),` `X(R999.6)`<br>
&emsp;&emsp;&emsp;☒ `IX(D),` `IX(R),` `IX(R999),` `X(R999.6)`<br>
&emsp;&emsp;&emsp;**Solution:** The correct choice is `IX(D),` `IX(R),` `IX(R999),` `X(R999.6)`. This choice<br>
&emsp;&emsp;&emsp;is correct because it accesses all intention locks and the exclusive lock on `R999.6`, so it<br>
&emsp;&emsp;&emsp;can perform both a read and write while holding this exclusive lock.<br>
&emsp;&emsp;&emsp;&emsp;• `IX(D),` `IX(R),` `SIX(R999),` `X(R999.6)` is incorrect because it gains a shared<br>
&emsp;&emsp;&emsp;&emsp;&emsp;intention lock for `R999` when it only needs to read `R999.6`, thus limiting potential<br>
&emsp;&emsp;&emsp;&emsp;&emsp;for concurrency.


### Question 3 continues...


---

<a id="page-9"></a>
**Page 9**

15-445/645 (Spring 2024)   Homework #4   Page 9 of 12

&emsp;&emsp;&emsp;&emsp;• `IS(D),` `IS(R),` `IS(R999),` `S(R999.6)` is incorrect because we plan on mod-<br>
&emsp;&emsp;&emsp;&emsp;&emsp;ifying `R999.6`, but we are only gaining a shared lock on `R999.6`, which isn’t<br>
&emsp;&emsp;&emsp;&emsp;&emsp;sufficient.<br>
&emsp;&emsp;&emsp;&emsp;• `IX(D),` `IX(R),` `S(R999),` `X(R999.6)` is incorrect because while it gains a<br>
&emsp;&emsp;&emsp;&emsp;&emsp;intention-exclusive locks for `R` and the database, it then gains a shared lock on<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`R999` which is not sufficient to gain the exclusive lock on `R999.6`.<br>
&emsp;(e) **\[4 points\]** Scan all records on pages `A10` to `A50` and modify the 20th record on `A14`.<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `S(A),` `X(A14)`<br>
&emsp;&emsp;&emsp;☐  `SIX(D),` `IX(A),` `IX(A14),` `X(A14.20)`<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `IX(A),` `IX(A10-A50),` `IX(A14),` `X(A14.20)`<br>
&emsp;&emsp;&emsp;☒ `IX(D),` `SIX(A),` `IX(A14),` `X(A14.20)`<br>
&emsp;&emsp;&emsp;**Solution:** The correct choice is `IX(D),` `SIX(A),` `IX(A14),` `X(A14.20)`. This choice<br>
&emsp;&emsp;&emsp;is correct because it accesses all intended locks and the exclusive lock `X(A14.20)`. It<br>
&emsp;&emsp;&emsp;also gains a shared lock on `A`, so it can read pages `A10` to `A50`.<br>
&emsp;&emsp;&emsp;&emsp;• `IX(D),` `S(A),` `X(A14)` is incorrect because it fails to gain a intention-exclusive<br>
&emsp;&emsp;&emsp;&emsp;&emsp;lock for `A`.<br>
&emsp;&emsp;&emsp;&emsp;• `SIX(D),` `IX(A),` `IX(A14),` `X(A14.20)` is incorrect because it gains a shared<br>
&emsp;&emsp;&emsp;&emsp;&emsp;intention lock for the database `D` when it only needs to read from `A`.<br>
&emsp;&emsp;&emsp;&emsp;• `IX(D),` `IX(A),` `IX(A10-A50),` `IX(A14),` `X(A14.20)` is incorrect because it<br>
&emsp;&emsp;&emsp;&emsp;&emsp;fails to gain shared locks to read from `A10-A15`.<br>
&emsp;(f) **\[4 points\]** Delete records in `A` if `type='Band'`.<br>
&emsp;&emsp;&emsp;☐  `SIX(D),` `SIX(A)`<br>
&emsp;&emsp;&emsp;☒ `IX(D),` `X(A)`<br>
&emsp;&emsp;&emsp;☐  `IX(D),` `IX(A)`<br>
&emsp;&emsp;&emsp;☐  `SIX(D),` `X(A)`<br>
&emsp;&emsp;&emsp;**Solution:** The correct choice is `IX(D),` `X(A)`. This choice is correct because it accesses<br>
&emsp;&emsp;&emsp;all intended locks and the exclusive lock on `A`, since we potentially need to modify all<br>
&emsp;&emsp;&emsp;records in `A`.<br>
&emsp;&emsp;&emsp;&emsp;• `SIX(D),` `SIX(A)` is incorrect because it gains a shared intention parent lock for<br>
&emsp;&emsp;&emsp;&emsp;&emsp;both `D` and `A`, when it does not need to read any contents, and it does not gain the<br>
&emsp;&emsp;&emsp;&emsp;&emsp;exclusive lock for the records of `A` it needs to delete.<br>
&emsp;&emsp;&emsp;&emsp;• `IX(D),` `IX(A)` is incorrect because it does not gain an exclusive lock for the<br>
&emsp;&emsp;&emsp;&emsp;&emsp;records of `A` it needs to delete.<br>
&emsp;&emsp;&emsp;&emsp;• `SIX(D),` `X(A)` is incorrect because it gains a shared lock for the database, when<br>
&emsp;&emsp;&emsp;&emsp;&emsp;it does not need to read any contents.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #4 continues...


---

<a id="page-10"></a>
**Page 10**

15-445/645 (Spring 2024)   Homework #4   Page 10 of 12


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
&emsp;&emsp;&emsp;☒ **The start of the validation phase.**<br>
&emsp;&emsp;&emsp;☐  The start of the read phase.


### Question 4 continues...


---

<a id="page-11"></a>
**Page 11**

15-445/645 (Spring 2024)   Homework #4   Page 11 of 12

&emsp;&emsp;&emsp;**Solution:** Each transaction’s timestamp is assigned at the beginning of the validation<br>
&emsp;&emsp;&emsp;phase.<br>
&emsp;(b) **\[4 points\]** When time = 9, will T1 read C written by T3?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **No**<br>
&emsp;&emsp;&emsp;☐  Yes<br>
&emsp;&emsp;&emsp;**Solution:** In OCC, each transaction maintains a private workspace that is invisible to<br>
&emsp;&emsp;&emsp;other transactions until its write phase is completed. Only transactions that start after<br>
&emsp;&emsp;&emsp;T3’s write phase can see the value of A written by T3, provided T3 commits successfully.<br>
&emsp;&emsp;&emsp;Hence, T1 at time = 9 will read the original C, that isn’t written by T3.<br>
&emsp;(c) **\[4 points\]** Will T1 abort?<br>
&emsp;&emsp;&emsp;☐  Yes<br>
&emsp;&emsp;&emsp;☒ **No**<br>
&emsp;&emsp;&emsp;**Solution:** T1 does not do any writes, so T1’s write set does not intersect T2’s read set.<br>
&emsp;(d) **\[4 points\]** Will T2 abort?<br>
&emsp;&emsp;&emsp;☐  Yes<br>
&emsp;&emsp;&emsp;☒ **No**<br>
&emsp;&emsp;&emsp;**Solution:** No other transactions will be committed in the future, so there are no con-<br>
&emsp;&emsp;&emsp;flicts.<br>
&emsp;(e) **\[4 points\]** Will T3 abort?<br>
&emsp;&emsp;&emsp;☒ **Yes**<br>
&emsp;&emsp;&emsp;☐  No<br>
&emsp;&emsp;&emsp;**Solution:** T3’s write set intersects T1’s read set.

&emsp;(f) **\[2 points\]** OCC works best when concurrent transactions access the same subset of data<br>
&emsp;&emsp;&emsp;in a database.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;**Solution:** OCC is good to use when the number of conflicts is low.

&emsp;(g) **\[2 points\]** Transactions can suffer from phantom reads in OCC.<br>
&emsp;&emsp;&emsp;☒ **True**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  False<br>
&emsp;&emsp;&emsp;**Solution:** Considering the following sequence of events for table A and transactions T1<br>
&emsp;&emsp;&emsp;and T2:<br>
&emsp;&emsp;&emsp;&emsp;• T1 reads all tuples of A.<br>
&emsp;&emsp;&emsp;&emsp;• T2 inserts a new tuple into A.<br>
&emsp;&emsp;&emsp;&emsp;• T2 enters validation phase. Note T2’s write set contains the new tuple whereas<br>
&emsp;&emsp;&emsp;&emsp;&emsp;T2’s read set only contains the initial existing tuples. So T2’s write set does not<br>
&emsp;&emsp;&emsp;&emsp;&emsp;intersect T1’s read set, and T2 validation succeeds.


### Question 4 continues...


---

<a id="page-12"></a>
**Page 12**

15-445/645 (Spring 2024)   Homework #4   Page 12 of 12

&emsp;&emsp;&emsp;&emsp;• T2 completes the write phase.<br>
&emsp;&emsp;&emsp;&emsp;• T1 reads all tuples of A again, now including the tuple added by T2.<br>
&emsp;(h) **\[2 points\]** Aborts due to OCC are wasteful because they happen after a transaction has<br>
&emsp;&emsp;&emsp;already finished executing.<br>
&emsp;&emsp;&emsp;☒ **True**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  False<br>
&emsp;&emsp;&emsp;**Solution:** During the read phase, a transaction will execute operations on its private<br>
&emsp;&emsp;&emsp;workspace. It is only after the read phase and validation phase that a transaction may<br>
&emsp;&emsp;&emsp;abort.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;End of Homework #4

