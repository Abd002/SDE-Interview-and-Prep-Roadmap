# Berkeley CS186 Spring 2016: Midterm 2: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/186>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Name:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_<br>
**Midterm 2: CS186, Spring 2016**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Class Login:** cs186- \_\_\_\_ \_\_\_\_ \_\_\_\_

11You should receive 1 double-sided answer sheet and an    -page exam. Mark your name and login on<br>
**both sides of the answer sheet**, **and in the blanks above**. For each question, place **only your final**<br>
**answer** on the answer sheet—do not show work or formulas there.  You may use the blank spaces for<br>
scratch paper, but **do not tear off any pages**. You will **turn in both question and answer sheets**.

I. Locking and Serializability \[35 points\]

1\.   \[8 points\] For the following statements, list the true statement(s) in alphabetical order.

&emsp;A. Schedules that are conflict serializable are also view serializable.<br>
&emsp;B. Under two-phase locking, once a transaction releases a lock, it can no longer acquire<br>
&emsp;&emsp;any new locks.<br>
&emsp;C. Schedules that are conflict serializable have to be produced by two-phase locking.<br>
&emsp;D. Schedules produced by two-phase locking are guaranteed to prevent cascading aborts.<br>
&emsp;E. Strict two-phase locking is both necessary and sufficient to guarantee conflict<br>
&emsp;&emsp;serializability.<br>
&emsp;F.   Wound-wait and wait-die algorithms are pessimistic deadlock avoidance algorithms and<br>
&emsp;&emsp;can cause more transaction aborts than needed.<br>
&emsp;G. Under multi-granularity locking, locks should be acquired and released from the top level<br>
&emsp;&emsp;to the bottom level.<br>
&emsp;H. Under multi-granularity locking, when a transaction T1 is holding an ‘IX’ lock on page A,<br>
&emsp;&emsp;it is possible for transaction T2 to hold a ‘S’ lock on record B of page A.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;111Page " of


---

<a id="page-2"></a>
**Page 2**

Consider the following schedule consisting purely of reads and writes on the tuple level<br>
({A, B, C} are tuples). The meanings of operations are shown below:

W(A): transaction writes tuple A.<br>
R(A): transaction reads tuple A.<br>
COM: transaction commits.

&emsp;&emsp;&emsp;**1**   **2**   **3**   **4**   **5**   **6**   **7**   **8**   **9**   **10**   **11**   **12**   **13**

**T1**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;W(A)   W(A)   COM

**T2**<br>
&emsp;&emsp;&emsp;R(A)   R(B)   W(C)   COM

**T3**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;R(B)   W(C)   COM

**T4**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;R(C)   W(B)   COM

2\.   \[4 points\] Draw the dependency graph for this schedule.

3\.   \[4 points\] Of the following, list all conflict equivalent serial orderings of this schedule in<br>
&emsp;alphabetical order:<br>
&emsp;&emsp;A. T2 T1 T4 T3<br>
&emsp;&emsp;B. T2 T3 T4 T1<br>
&emsp;&emsp;C. T2 T1 T3 T4<br>
&emsp;&emsp;D. T2 T4 T1 T3

4\.   \[2 point\] List one read that could occur between timestep 9 and 10 that would make this<br>
&emsp;schedule not conflict serializable. For example, if T1 reading A is an answer, write “T1: R(A)”

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;112Page " of


---

<a id="page-3"></a>
**Page 3**

Consider the following schedule. The meanings of operations are the same as in the previous<br>
problem. You may assume that locks could have been acquired or released at any time in<br>
between timesteps, and the scheduler may know all operations of transactions ahead of time.

&emsp;&emsp;&emsp;&emsp;**1**   **2**   **3**   **4**   **5**   **6**   **7**   **8**   **9**   **10**<br>
**T1**   W(A)   R(B)   W(C)   COM<br>
**T2**   W(A)   R(B)   COM<br>
**T3**   R(B)   W(B)   COM

5\.   \[3 points\] For the following statements, list the true statement(s) in alphabetical order.

&emsp;A. It is possible for this schedule to be produced by two-phase locking.<br>
&emsp;B. It is possible for this schedule to be produced by strict two-phase locking.<br>
&emsp;C. This schedule is guaranteed not to have cascading aborts.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;113Page " of


---

<a id="page-4"></a>
**Page 4**

Suppose that we have a table Y, with pages {A, B, C}, and tuples {A1, A2, A3, …} in page A, and<br>
tuples {B1, B2, B3, …} in page B, and tuples {C1, C2, C3, …} in page C. Below is a schedule that<br>
correctly follows strict two-phase locking and multi-granularity locking protocols. For clarity,<br>
operations that are blocked (because of failing to acquire the lock) are italicized and underlined.

&emsp;&emsp;&emsp;&emsp;**1**   **2**   **3**   **4**   **5**   **6**   **7**   **8**   **9**<br>
T1   W(B1)   R(A)   W(C)<br>
T2   R(B2)   W(B)<br>
T3   W(C2)<br>
T4   R(C1)   R(A1)   W(A1)

For the following problems, assume that all transactions are still active (i.e. they have not yet<br>
committed/aborted) at timestep 9.

6\.   \[4 points\] What locks have been acquired on table Y at timestep 9? For each lock, list the<br>
&emsp;transaction it belongs to, and its type. Do not list locks that are on the wait queue, and use<br>
&emsp;locks with minimal privilege. For example, if T1 has an S lock, and T2 has an X lock, write<br>
&emsp;“T1:S, T2:X”.

7\.   \[2 points\] What locks have been acquired on page B at timestep 9? For each lock, list the<br>
&emsp;transaction it belongs to, and its type. Do not list locks that are on the wait queue, and use<br>
&emsp;locks with minimal privilege.

8\.   \[6 points\] There is a deadlock in this schedule (i.e. it is waiting indefinitely for locks).<br>
&emsp;8.1. Draw the waits-for graph for this schedule.

&emsp;8.2. Which transactions are involved in the deadlock?

&emsp;8.3. Circle all true statements (on the answer sheet):<br>
&emsp;&emsp;A. We can resolve this deadlock by aborting any transaction involved in the deadlock.<br>
&emsp;&emsp;B. No transaction can proceed until this deadlock is resolved.

9\.   \[2 points\] Suppose T1 wishes to scan page B between timestep 8 and 9. Which locks are<br>
&emsp;upgraded at this time? For example, if an S lock on A1 is upgraded to an X lock, write “S(A1)<br>
&emsp;→ X(A1)”. If there are no upgrades, or if all upgrades are placed on the wait queue, write<br>
&emsp;“None”.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;114Page " of


---

<a id="page-5"></a>
**Page 5**

This space left intentionally blank for scratch work.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;115Page " of


---

<a id="page-6"></a>
**Page 6**

II. Query Optimization \[26 points\]

1\.   \[6 points\] Write down letters for all the correct statements (in alphabetical order)

&emsp;A. When evaluating potential query plans, the set of left deep join plans are always<br>
&emsp;&emsp;guaranteed to contain the best plan.<br>
&emsp;B. As a heuristic, the System R optimizer avoids cross-products if possible.<br>
&emsp;C. Considering all join orders and join methods, there are n! ways to join n tables.<br>
&emsp;D. A plan can result in an interesting order if it involves a sort-merge join.<br>
&emsp;E. The System R algorithm is greedy because for each pass, it only keeps the lowest cost<br>
&emsp;&emsp;plan for each combination of tables.<br>
&emsp;F.   If the statistics needed to compute the result size of a table are missing, the System R<br>
&emsp;&emsp;optimizer aborts.

For the following question, assume the following:<br>
\- the System R assumptions about uniformity and independence from lecture hold<br>
**- primary key IDs are sequential, starting from 1**<br>
\- all of our tables are stored as heap files

We have the following schema:<br>
`CREATE TABLE Flight (`    **NTuples:** 100K, **NPages:** 50<br>
`fid INTEGER` `PRIMARY KEY``,`    **Index:**<br>
`from_id INTEGER` `REFERENCES City``,`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;(I) unclustered B+-tree on aid. 20 pages.<br>
`to_id INTEGER` `REFERENCES City,`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;(II) clustered B+-tree on (from\_cid, fid). 10 pages.<br>
`aid INTEGER` `REFERENCES Airline``)`<br>
`CREATE TABLE City (`    **NTuples:** 50K, **NPages:** 20<br>
`cid INTEGER` `PRIMARY KEY``,`     **Index:**<br>
`name VARCHAR(16),`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;(III) clustered B+-tree on population. 10 pages.<br>
`state VARCHAR(16),`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;(IV) unclustered index on cid. 5 pages.<br>
`population INTEGER)`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Statistics:**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;state in \[1, 50\],<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;population in \[106, 8\*106\]<br>
`CREATE TABLE Airline (`    **NTuples:** 5K, **NPages:** 2<br>
`aid INTEGER` `PRIMARY KEY``,`<br>
`hq_cid INTEGER` `REFERENCES City``,`<br>
`name VARCHAR(16))`

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;116Page " of


---

<a id="page-7"></a>
**Page 7**

2\.   Consider the following query:

&emsp;&emsp;`SELECT *`<br>
&emsp;&emsp;`FROM Flight F, City C, Airline A`<br>
&emsp;&emsp;`WHERE F.to_cid = C.cid AND F.aid = A.aid`<br>
&emsp;&emsp;`AND F.aid >= 2500`<br>
&emsp;&emsp;`AND C.population > 5e6`<br>
&emsp;&emsp;`AND C.state = 'California';`

&emsp;2.1. \[4 points\] Considering each predicate in the WHERE clause separately, what is the<br>
&emsp;&emsp;reduction factor for each?

&emsp;&emsp;i.    R1 = C.state='California'    \_\_\_\_\_/\_\_\_\_\_\_<br>
&emsp;&emsp;ii.   R2 = F.to\_cid = C.cid        \_\_\_\_\_/\_\_\_\_\_\_<br>
&emsp;&emsp;iii.  R3 = F.aid \>= 2500           \_\_\_\_\_/\_\_\_\_\_\_<br>
&emsp;&emsp;iv.  R4 = C.population \> 5 \* 106   \_\_\_\_\_/\_\_\_\_\_\_

&emsp;2.2. \[5 points\] For each blank in the our System R DP table for Pass 1, choose the letter<br>
&emsp;&emsp;corresponding to the correct solution (Assume this is before the optimizer discards any<br>
&emsp;&emsp;rows it isn’t interested in keeping).

Table(s)   Plans   Interesting Orders from Plan   Cost (I/Os)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;(N/A if none)

Flight   Index (I)    \_\_\_\_\_\_\_\_\_\_(i)\_\_\_\_\_\_\_\_   \_\_\_\_\_\_(ii)\_\_\_\_\_

City   Filescan   \_\_\_\_\_\_\_\_\_\_(iii)\_\_\_\_\_\_\_\_\_   \_\_\_\_\_\_(iv)\_\_\_\_\_<br>
City   Index (III)                 population   \_\_\_\_\_\_(v)\_\_\_\_\_

i.   A.  N/A   B.  aid    C. from\_cid   D. to\_cid<br>
ii.   A. 100020\*R2   B. 100020\*(R2\*R3)   C. 70\*(R2\*R3)   D. 70\*R3<br>
iii.   A. N/A   B. state   C. cid   D. population<br>
iv.   A. 50020\*(R1\*R4)   B. 30\*(R1\*R4)   C. 30\*R4   D. 20<br>
v.   A. 50020\*(R1\*R4)   B. 30\*(R1\*R4)   C. 30\*R4   D. 20

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;117Page " of


---

<a id="page-8"></a>
**Page 8**

2.3.\[3 points\] For simplicity, let’s assume each individual reduction factor (Ri) is 1/2. Then,<br>
&emsp;what is the **READ** I/O cost of (City \[Index (III)\] JOIN Flights \[File Scan\]), using Page<br>
&emsp;Nested Loops Join?

2.4.\[3 points\] After Pass 2, which of the following plans could be in the DP table?

&emsp;A. City \[Index(III)\] JOIN Airline \[File scan\]<br>
&emsp;B. City \[Index (III)\] JOIN Flight \[Index (I)\]<br>
&emsp;C. Flight \[Index (II)\] JOIN City \[Index (III)\]

2.5.\[5 points\] Suppose we want to optimize for queries similar to the query in #2, which of<br>
&emsp;the following suggestions could reduce I/O cost?<br>
&emsp;A. Maintain a more detailed histogram of Cities.population<br>
&emsp;B. Change Index (III) to be unclustered<br>
&emsp;C. Reduce the size of Airline.name field using string compression<br>
&emsp;D. Add a hash index on Flights.aid<br>
&emsp;E. Store City as a sorted file on population

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;118Page " of


---

<a id="page-9"></a>
**Page 9**

This space left intentionally blank for scratch work.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;119Page " of


---

<a id="page-10"></a>
**Page 10**

III. Recovery \[24 points\]<br>
1\.   \[6 points\] List all the true statements in alphabetical order:<br>
&emsp;A. When a transaction commits, any modified buffer pages must be written to durable<br>
&emsp;&emsp;storage.<br>
&emsp;B. When aborting a transaction, it may be necessary to modify pages on disk.<br>
&emsp;C. During recovery, the ARIES protocol may redo aborted transactions.<br>
&emsp;D. The pageLSN contains the LSN of the last operation to modify the page.<br>
&emsp;E. The tail of the log is always flushed after every update operation.<br>
&emsp;F.   A system that uses a FORCE, STEAL policy does not need to undo any operations after<br>
&emsp;&emsp;a crash.

Questions 2 through 7 use the log below. Our database system is using ARIES for recovery.<br>
Some of the information for update and CLR log records is omitted for brevity. Adjacent log<br>
records are spaced exactly 10 LSN's apart. The system crashes after the last log record is<br>
written.

&emsp;&emsp;&emsp;&emsp;**LSN**   **Record**   **prevLSN**<br>
&emsp;&emsp;&emsp;&emsp;0   update: T1 writes P1   null<br>
&emsp;&emsp;&emsp;&emsp;10   update: T2 writes P2   null<br>
&emsp;&emsp;&emsp;&emsp;20   update: T3 writes P1   null<br>
&emsp;&emsp;&emsp;&emsp;30   update: T2 writes P3   10<br>
&emsp;&emsp;&emsp;&emsp;40   begin\_checkpoint   -<br>
&emsp;&emsp;&emsp;&emsp;50   update: T1 writes P4   0<br>
&emsp;&emsp;&emsp;&emsp;60   update: T2 writes P5   30<br>
&emsp;&emsp;&emsp;&emsp;70   end\_checkpoint   -<br>
&emsp;&emsp;&emsp;&emsp;80   commit: T2   60<br>
&emsp;&emsp;&emsp;&emsp;90   update: T3 writes P5   20<br>
&emsp;&emsp;&emsp;&emsp;100   T2 end   80<br>
&emsp;&emsp;&emsp;&emsp;110   T1 abort   50<br>
&emsp;&emsp;&emsp;&emsp;120   CLR: T1 LSN 50   110

Transaction Table and Dirty Page Table recorded at end\_checkpoint (LSN 70).<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**Transaction Table**   **Dirty Page Table**<br>
&emsp;&emsp;**Xact**    **lastLSN**   **Status**   **PageID**   **recLSN**<br>
&emsp;&emsp;T1   0   Running   P1   20<br>
&emsp;&emsp;T2   30   Running   P3   30<br>
&emsp;&emsp;T3   20   Running

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1110Page     of


---

<a id="page-11"></a>
**Page 11**

2\.   \[1 point\] The page updated by LSN 0 has been written to disk when the system starts<br>
&emsp;recovering from the crash.

&emsp;A. True<br>
&emsp;B. False<br>
&emsp;C. Not enough information

3\.   \[1 point\] The page updated by LSN 60 has been written to disk when the system starts<br>
&emsp;recovering from the crash.

&emsp;A. True<br>
&emsp;B. False<br>
&emsp;C. Not enough information

4\.   \[1 point\] What is the undoNextLSN of the CLR at LSN 120?

5\.   \[6 points\] Fill in the transaction table and dirty page table after Analysis. Do not add any<br>
&emsp;transactions to the transaction table (it should only contain T1 and T3). You may not need to<br>
&emsp;use all rows provided in the dirty page table.

6\.   \[3 points\] List the LSN’s of the actions that are redone during REDO.  Assume that nothing<br>
&emsp;in the buffer pool was flushed to disk between begin checkpoint and the time of crash.

7\.   \[6 points\] What log records are written during UNDO? Fill in the remaining columns for the<br>
&emsp;records below. You may not need to use all rows in the table.<br>
&emsp;Hint: T1 and T3 are the only "loser" transactions.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;This space left intentionally blank for scratch work.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1111Page     of

