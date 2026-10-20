# CMU 15-445 Fall 2023: Homework 5: Questions

> Copied from the original: <https://15445.courses.cs.cmu.edu/fall2023/assignments.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CARNEGIE MELLON UNIVERSITY<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;COMPUTER SCIENCE DEPARTMENT<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;15-445/645 – DATABASE SYSTEMS (FALL 2023)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;PROF. ANDY PAVLO AND JIGNESH PATEL

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #5 (by Fernando Lisboa)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Due: **Sunday Dec 3, 2023 @ 11:59pm**

**IMPORTANT:**<br>
&emsp;• **Upload this PDF** with your answers to **Gradescope by 11:59pm on Sunday Dec 3, 2023**.<br>
&emsp;• **Plagiarism**: Homework may be discussed with other students, but all homework is to be<br>
&emsp;&emsp;completed **individually**.<br>
&emsp;• **You have to use this PDF for all of your answers.**<br>
For your information:<br>
&emsp;• Graded out of **100** points; **4** questions total<br>
&emsp;Revision : 2023/11/13 17:39

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Question   Points   Score<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Write-Ahead Logging   25<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Two-Phase Commit   18<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Distributed Query Plan   27<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Miscellaneous   30<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Total:   100

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1


---

<a id="page-2"></a>
**Page 2**

15-445/645 (Fall 2023)   Homework #5   Page 2 of 10


### **Question 1: Write-Ahead Logging. . . . . . . . . . . . . . . . . . . . . . . . . . . . .\[25 points\]**

&emsp;Consider a DBMS using write-ahead logging with physical log records with the STEAL and<br>
&emsp;NO-FORCE buffer pool management policy. Assume the DBMS executes a non-fuzzy check-<br>
&emsp;point where all dirty pages are written to disk.<br>
&emsp;Its transaction recovery log contains log records of the following form:<br>
&emsp;&emsp;`<txnId,` `objectId,` `beforeValue,` `afterValue>`<br>
&emsp;The log also contains checkpoint, transaction begin, and transaction commit records.<br>
&emsp;The database contains three objects (i.e., A, B, and C).<br>
&emsp;The DBMS sees records as in Figure 1 in the WAL on disk after a crash.<br>
&emsp;Assume the DBMS uses ARIES as described in class to recover from failures.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**LSN**   **WAL Record**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1`<T1` `BEGIN>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2   `<T1,` `A,` `12,` `55>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3`<T1,` `B,` `42,` `8>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4   `<T2` `BEGIN>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;5`<T2,` `A,` `55,` `62>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;6   `<T1` `COMMIT>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;7`<T2,` `C,` `0,` `35>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;8   `<T3` `BEGIN>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;9   `<T3,` `B,` `8,` `81>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;10   `<T2,` `A,` `62,` `67>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;11   `<``CHECKPOINT``>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;12`<T3,` `B,` `81,` `45>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;13   `<T2,` `A,` `67,` `13>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;14`<T3` `COMMIT>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;15   `<T2,` `C,` `35,` `66>`

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Figure 1: WAL

&emsp;(a) **\[6 points\]** What are the values of A, B, and C in the database stored on disk before the<br>
&emsp;&emsp;&emsp;DBMS recovers the state of the database?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  A=67, B=81, C=35<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  A=13, B=45, C=66<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  A=13, B=45, C=Not possible to determine<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  A=55, B=8, C=35<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  A=Not possible to determine, B:42, C=0<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  A=12, B=42, C=Not possible to determine<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  A=Not possible to determine, B=Not possible to determine, C:66<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  A=Not possible to determine, B=81, C=Not possible to determine<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  A=13, B=Not possible to determine C=35


### Question 1 continues...


---

<a id="page-3"></a>
**Page 3**

15-445/645 (Fall 2023)   Homework #5   Page 3 of 10

&emsp;&emsp;&emsp;&emsp;&emsp;☐  A,B,C=Not possible to determine<br>
&emsp;(b) **\[3 points\]** What should be the correct action on T1 when recovering the database from<br>
&emsp;&emsp;&emsp;WAL?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  redo all of T1’s changes<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  undo all of T1’s changes<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  do nothing to T1

&emsp;(c) **\[3 points\]** What should be the correct action on T2 when recovering the database from<br>
&emsp;&emsp;&emsp;WAL?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  redo all of T2’s changes<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  undo all of T2’s changes<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  do nothing to T2

&emsp;(d) **\[3 points\]** What should be the correct action on T3 when recovering the database from<br>
&emsp;&emsp;&emsp;WAL?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  redo all of T3’s changes<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  undo all of T3’s changes<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  do nothing to T3

&emsp;(e) **\[10 points\]** Assume that the DBMS flushes all dirty pages when the recovery process<br>
&emsp;&emsp;&emsp;finishes. What are the values of A, B, and C after the DBMS recovers the state of the<br>
&emsp;&emsp;&emsp;database from the WAL in Figure 1?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  A=33, B=6, C=42<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  A=13, B=66, C=55<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  A=13, B=45, C=66<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  A=13, B=7, C=67<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  A=12, B=42, C=0<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  A=33, B=42, C=100<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  A=55, B=45, C=0<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  A=13, B=42, C=67<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  A=33, B=20, C=43<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  A=55, B=45, C=66<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  A=55, B=12, C=66<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  Not possible to determine

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #5 continues...


---

<a id="page-4"></a>
**Page 4**

15-445/645 (Fall 2023)   Homework #5   Page 4 of 10


### **Question 2: Two-Phase Commit . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . \[18 points\]**

&emsp;Consider a distributed transaction T operating under the two-phase commit protocol with the<br>
&emsp;**early acknowledgement optimization**. Let N0 be the coordinator node, and N1, N2, N3 be the<br>
&emsp;participant nodes. Let the C be the client application issuing the transaction request. Assume<br>
&emsp;that the client communicates directly with the coordinator node.<br>
&emsp;The following messages have been sent:

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;time   message<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1   C to N0: “`REQUEST:COMMIT`”<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2N0 to N2: “`Phase1:PREPARE`”<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3   N2 to N0: “`OK`”<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4   N0 to N1: “`Phase1:PREPARE`”<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;5   N0 to N3: “`Phase1:PREPARE`”<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;6   N1 to N0: “`OK`”<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;7N3 to N0: “`OK`”<br>
&emsp;&emsp;&emsp;&emsp;Figure 2: Two-Phase Commit messages for transaction T for parts (a), (b)

&emsp;(a) **\[6 points\]** Who should send a message next at time 8 in Figure 2? Select all the possible<br>
&emsp;&emsp;&emsp;answers.<br>
&emsp;&emsp;&emsp;☐  C<br>
&emsp;&emsp;&emsp;☐  N0<br>
&emsp;&emsp;&emsp;☐  N1<br>
&emsp;&emsp;&emsp;☐  N2<br>
&emsp;&emsp;&emsp;☐  N3<br>
&emsp;&emsp;&emsp;☐  It is not possible to determine

&emsp;(b) **\[6 points\]** To whom? Again, select all the possible answers.<br>
&emsp;&emsp;&emsp;☐  C<br>
&emsp;&emsp;&emsp;☐  N0<br>
&emsp;&emsp;&emsp;☐  N1<br>
&emsp;&emsp;&emsp;☐  N2<br>
&emsp;&emsp;&emsp;☐  N3<br>
&emsp;&emsp;&emsp;☐  It is not possible to determine

&emsp;(c) **\[6 points\]** Now suppose that the two-phase commit protocol is incorrectly implemented<br>
&emsp;&emsp;&emsp;in our system, and we instead have the message log shown in Figure 3 (below). C, N0,<br>
&emsp;&emsp;&emsp;N1, N2, and N3 all play the same roles as they did in the previous parts.<br>
&emsp;&emsp;&emsp;At what timestep(s) is the two-phase commit protocol violated? Select all that apply.<br>
&emsp;&emsp;&emsp;☐  2<br>
&emsp;&emsp;&emsp;☐  3<br>
&emsp;&emsp;&emsp;☐  4<br>
&emsp;&emsp;&emsp;☐  5


### Question 2 continues...


---

<a id="page-5"></a>
**Page 5**

15-445/645 (Fall 2023)   Homework #5   Page 5 of 10

&emsp;&emsp;&emsp;☐  6<br>
&emsp;&emsp;&emsp;☐  7<br>
&emsp;&emsp;&emsp;☐  8<br>
&emsp;&emsp;&emsp;☐  9

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;time   message<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1   C to N0: “`REQUEST:COMMIT`”<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2N0 to N2: “`Phase1:PREPARE`”<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3   N0 to N1: “`Phase1:PREPARE`”<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4N0 to N3: “`Phase1:PREPARE`”<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;5   N2 to N0: “`ABORT`”<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;6   N1 to N0: “`OK`”<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;7N3 to N0: “`OK`”<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;8   N0 to N1: “`Phase2:COMMIT`”<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;9N0 to N3: “`Phase2:COMMIT`”<br>
&emsp;&emsp;&emsp;Figure 3: Incorrect Two-Phase Commit messages for transaction T for part (c)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #5 continues...


---

<a id="page-6"></a>
**Page 6**

15-445/645 (Fall 2023)   Homework #5   Page 6 of 10


### **Question 3: Distributed Query Plan . . . . . . . . . . . . . . . . . . . . . . . . . . . \[27 points\]**

&emsp;The CMUDB group is working on a brand new shared-nothing distributed database system<br>
&emsp;called BusTub\*\*\*. They are developing the distributed query engine.<br>
&emsp;Given the following schema:

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`CREATE` `TABLE` `t1(PARTITION` `KEY` `v1` `int,` `v2` `int);`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`CREATE` `TABLE` `t2(PARTITION` `KEY` `v3` `int,` `v4` `int);`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`CREATE` `TABLE` `t3(PARTITION` `KEY` `v5` `int,` `v6` `int);`

&emsp;The database system partitions the tables by key range. That is to say, each node in the system<br>
&emsp;manages rows of the table within a non-overlapping range of keys.<br>
&emsp;Given the following query:


![Figure on page 6](figures/questions-p06-fig01.png)

&emsp;Assume that the query optimizer doesn’t know the ranges of data stored on each node and only<br>
&emsp;knows the tables are sharded by some keys, and it generates the following plan:


![Figure on page 6](figures/questions-p06-fig02.png)


### Question 3 continues...


---

<a id="page-7"></a>
**Page 7**

15-445/645 (Fall 2023)   Homework #5   Page 7 of 10

&emsp;Note that this query plan is missing some expressions in the Shuffle and HashJoin operators,<br>
&emsp;corresponding to the following question parts. Fill in the missing parts to this query plan.<br>
&emsp;(a) **\[3 points\]** In the Shuffle from fragment 1 to fragment 3, which column should be used<br>
&emsp;&emsp;&emsp;to shuffle the outputted rows of the **t1** scan?<br>
&emsp;&emsp;&emsp;☐  v1<br>
&emsp;&emsp;&emsp;☐  v2<br>
&emsp;&emsp;&emsp;☐  v3<br>
&emsp;&emsp;&emsp;☐  v4<br>
&emsp;&emsp;&emsp;☐  v5<br>
&emsp;&emsp;&emsp;☐  v6<br>
&emsp;(b) **\[3 points\]** In the Shuffle from fragment 2 to fragment 3, which column should be used<br>
&emsp;&emsp;&emsp;to shuffle the outputted rows of the **t2** scan?<br>
&emsp;&emsp;&emsp;☐  v1<br>
&emsp;&emsp;&emsp;☐  v2<br>
&emsp;&emsp;&emsp;☐  v3<br>
&emsp;&emsp;&emsp;☐  v4<br>
&emsp;&emsp;&emsp;☐  v5<br>
&emsp;&emsp;&emsp;☐  v6<br>
&emsp;(c) **\[2 points\]** How are tables **t1** and **t2** being joined in the fragment 3 HashJoin?<br>
&emsp;&emsp;&emsp;☐  v1 = v2<br>
&emsp;&emsp;&emsp;☐  v2 = v3<br>
&emsp;&emsp;&emsp;☐  v1 = v3<br>
&emsp;&emsp;&emsp;☐  v2 = v4<br>
&emsp;&emsp;&emsp;☐  v3 = v5<br>
&emsp;&emsp;&emsp;☐  v4 = v5<br>
&emsp;(d) **\[3 points\]** In the Shuffle from fragment 3 to fragment 5, which column should be used<br>
&emsp;&emsp;&emsp;to shuffle the outputted rows of the HashJoin?<br>
&emsp;&emsp;&emsp;☐  v1<br>
&emsp;&emsp;&emsp;☐  v2<br>
&emsp;&emsp;&emsp;☐  v3<br>
&emsp;&emsp;&emsp;☐  v4<br>
&emsp;&emsp;&emsp;☐  v5<br>
&emsp;&emsp;&emsp;☐  v6<br>
&emsp;(e) **\[3 points\]** In the Shuffle from fragment 4 to fragment 5, which column should be used<br>
&emsp;&emsp;&emsp;to shuffle the outputted rows of the **t3** scan?<br>
&emsp;&emsp;&emsp;☐  v1<br>
&emsp;&emsp;&emsp;☐  v2<br>
&emsp;&emsp;&emsp;☐  v3<br>
&emsp;&emsp;&emsp;☐  v4<br>
&emsp;&emsp;&emsp;☐  v5<br>
&emsp;&emsp;&emsp;☐  v6<br>
&emsp;(f) **\[3 points\]** How are the input tables being joined in the fragment 5 HashJoin?


### Question 3 continues...


---

<a id="page-8"></a>
**Page 8**

15-445/645 (Fall 2023)   Homework #5   Page 8 of 10

&emsp;&emsp;&emsp;☐  v1 = v2<br>
&emsp;&emsp;&emsp;☐  v2 = v3<br>
&emsp;&emsp;&emsp;☐  v1 = v3<br>
&emsp;&emsp;&emsp;☐  v2 = v4<br>
&emsp;&emsp;&emsp;☐  v3 = v5<br>
&emsp;&emsp;&emsp;☐  v4 = v5<br>
&emsp;(g) **\[5 points\]** Assume there are 3 nodes in the system and the data ranges in each node are<br>
&emsp;&emsp;&emsp;as follows:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;t1.v1   t2.v3   t3.v5<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Node 1   0 - 999   0 - 999   0 - 999<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Node 2   1000 - 1999   1000 - 1999   1000 - 1999<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Node 3   2000 - 2999   2000 - 2999   2000 - 2999<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Table 1: Data distribution for table t1 to t3

&emsp;&emsp;&emsp;Assume that t2.v4 also has all values across 0-2999, except that they are uniformly ran-<br>
&emsp;&emsp;&emsp;domly distributed across the three nodes (i.e., the table is not partitioned by v4 and so any<br>
&emsp;&emsp;&emsp;value of v4 could be in any node).

&emsp;&emsp;&emsp;Given the data ranges on each node and our query plan from earlier **assume that our sys-**<br>
&emsp;&emsp;&emsp;**tem has generated the best possible execution schedule** (i.e., the optimal scheduling of<br>
&emsp;&emsp;&emsp;scan/join partitions on nodes within fragments which minimizes the worst case amount<br>
&emsp;&emsp;&emsp;of data transferred over the network).

&emsp;&emsp;&emsp;What is the worst case number of rows that need to be shuffled from fragments 1 and 2 to<br>
&emsp;&emsp;&emsp;fragment 3 across the network in this schedule?<br>
&emsp;&emsp;&emsp;☐  0<br>
&emsp;&emsp;&emsp;☐  1000<br>
&emsp;&emsp;&emsp;☐  2000<br>
&emsp;&emsp;&emsp;☐  3000<br>
&emsp;(h) **\[5 points\]** With same assumptions as the previous part, what is the worst case number<br>
&emsp;&emsp;&emsp;of rows that need to be shuffled from fragments 3 and 4 to fragment 5 across the network<br>
&emsp;&emsp;&emsp;in this schedule?<br>
&emsp;&emsp;&emsp;☐  0<br>
&emsp;&emsp;&emsp;☐  1000<br>
&emsp;&emsp;&emsp;☐  2000<br>
&emsp;&emsp;&emsp;☐  3000

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #5 continues...


---

<a id="page-9"></a>
**Page 9**

15-445/645 (Fall 2023)   Homework #5   Page 9 of 10


### **Question 4: Miscellaneous . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . \[30 points\]**

&emsp;(a) **\[3 points\]** Both PAXOS and Two-Phase Commit protocols can be used to implement<br>
&emsp;&emsp;&emsp;distributed transactions.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  False

&emsp;(b) **\[3 points\]** A DBMS implementing transactions via shadow paging never has to undo or<br>
&emsp;&emsp;&emsp;redo any actions of a transaction.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  False

&emsp;(c) **\[3 points\]** In reference to recovery algorithms that use a write-ahead log (WAL). Under<br>
&emsp;&emsp;&emsp;NO-STEAL + FORCE policy, a DBMS will need to redo the changes of a committed<br>
&emsp;&emsp;&emsp;transaction during recovery.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  False

&emsp;(d) **\[3 points\]** In reference to recovery algorithms that use a write-ahead log (WAL). Under<br>
&emsp;&emsp;&emsp;NO-STEAL + FORCE policy, a DBMS will have to undo the changes of an aborted<br>
&emsp;&emsp;&emsp;transaction during recovery.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  False

&emsp;(e) **\[3 points\]** Fuzzy checkpoints need to block the execution of all transactions while a<br>
&emsp;&emsp;&emsp;consistent snapshot is written to disk.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  False

&emsp;(f) **\[3 points\]** For a DBMS that uses ARIES, all updated pages must be flushed to disk for<br>
&emsp;&emsp;&emsp;a transaction to commit.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  False

&emsp;(g) **\[3 points\]** During the undo phase of ARIES, all transactions that committed after the<br>
&emsp;&emsp;&emsp;last checkpoint are undone.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  False


### Question 4 continues...


---

<a id="page-10"></a>
**Page 10**

15-445/645 (Fall 2023)   Homework #5   Page 10 of 10

&emsp;(h) **\[3 points\]** In ARIES, only transactions that commit will have an associated “TXN-<br>
&emsp;&emsp;&emsp;END” record in the log.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  False

&emsp;(i) **\[3 points\]** With consistent hashing, if a node fails then all keys must be reshuffled among<br>
&emsp;&emsp;&emsp;the remaining nodes.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  False

&emsp;(j) **\[3 points\]** In a system with strong consistency requirements, it is best for the DBMS to<br>
&emsp;&emsp;&emsp;implement active-passive replication with asynchronous replication and continuous log<br>
&emsp;&emsp;&emsp;streaming.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  False

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;End of Homework #5

