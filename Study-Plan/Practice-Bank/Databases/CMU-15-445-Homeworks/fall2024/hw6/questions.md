# CMU 15-445 Fall 2024: Homework 6: Questions

> Copied from the original: <https://15445.courses.cs.cmu.edu/fall2024/assignments.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CARNEGIE MELLON UNIVERSITY<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;COMPUTER SCIENCE DEPARTMENT<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;15-445/645 – DATABASE SYSTEMS (FALL 2024)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;PROF. ANDY PAVLO

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #6 (by William )<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Due: **Monday Dec 9, 2024 @ 11:59pm**

**IMPORTANT:**<br>
&emsp;• Enter all of your answers into **Gradescope by 11:59pm on Monday Dec 9, 2024**.<br>
&emsp;• **Plagiarism**: Homework may be discussed with other students, but all homework is to be<br>
&emsp;&emsp;completed **individually**.<br>
&emsp;• **You have to use this PDF for all of your answers.**<br>
For your information:<br>
&emsp;• Graded out of **100** points; **4** questions total<br>
&emsp;Revision : 2024/12/04 12:08

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Question   Points   Score<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;ARIES   28<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Two-Phase Commit   24<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Distributed Query Plan   18<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Miscellaneous   30<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Total:   100

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1


---

<a id="page-2"></a>
**Page 2**

15-445/645 (Fall 2024)   Homework #6   Page 2 of 9


### **Question 1: ARIES . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . \[28 points\]**

&emsp;RusTub uses ARIES recovery with fuzzy checkpoints. It also has a background thread that<br>
&emsp;may arbitrarily flush a dirty bufferpool page to disk at any time.<br>
&emsp;For this question, assume objects `A`, `B`, `C` reside in three different pages `A`, `B`, `C`, respectively.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**LSN**   **WAL Record**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1`<T1,` `BEGIN>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2   `<T2,` `BEGIN>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3   `<T3,` `BEGIN>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4   `<T3,` `UPDATE,` `prev=3,` `C,` `1000`→`2000>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;5   `<T2,` `UPDATE,` `prev=2,` `A,` `10`→`20>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;6`<T2,` `COMMIT,` `prev=5>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;7   `<T1,` `UPDATE,` `prev=1,` `B,` `100`→`200>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;8`<CHECKPOINT` `BEGIN>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;9   `<T1,` `UPDATE,` `prev=7,` `A,` `20`→`30>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;10`<CHECKPOINT` `END,` `ATT=`{`T1,` `T2,` `T3`}`,` `DPT=`{`C`}`>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;11   `<T3,` `UPDATE,` `prev=4,` `C,` `2000`→`3000>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;12   `<T2,` `TXN-END>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;13   `<CHECKPOINT` `BEGIN>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;14   `<T1,` `COMMIT,` `prev=9>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;15`<T4,` `BEGIN>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;16   `<CHECKPOINT` `END,` `ATT=`{`T1,` `T3`}`,` `DPT=`{`?`}`>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;17`<T3,` `COMMIT,` `prev=11>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;18   `<T4,` `UPDATE,` `prev=15,` `B,` `200`→`300>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;19`<T4,` `UPDATE,` `prev=18,` `A,` `30`→`40>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;20   `<T4,` `ABORT,` `prev=19>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;21`<T4,` `CLR,` `prev=20,` `A,` `40`→`30,` `undoNext=18>`

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Figure 1: WAL

&emsp;(a) Suppose the system crashes and, when it recovers, the WAL contains the first 10 records<br>
&emsp;&emsp;&emsp;(up to `<CHECKPOINT` `END,` `ATT=`{`T1,` `T2,` `T3`}`,` `DPT=`{`C`}`>`). Of the object states below,<br>
&emsp;&emsp;&emsp;which states are possibly stored on disk before recovery starts? Select all that apply.<br>
&emsp;&emsp;&emsp;i. **\[4 points\]** ☐  `A=10`   ☐  `A=20`   ☐  `A=30`   ☐  `A=40`   ☐  Cannot be determined<br>
&emsp;&emsp;&emsp;ii. **\[4 points\]** ☐  `B=100`   ☐  `B=200`   ☐  `B=300`   ☐  Cannot be determined<br>
&emsp;&emsp;&emsp;iii. **\[4 points\]** ☐  `C=1000`   ☐  `C=2000`   ☐  `C=3000`   ☐  Cannot be determined<br>
&emsp;(b) **\[4 points\]** Select all possible values of DPT in record 16.<br>
&emsp;&emsp;&emsp;☐  `A`   ☐  `B`   ☐  `C`   ☐  `A,` `B`   ☐  `A,` `C`   ☐  `B,` `C`   ☐  `A,` `B,` `C`   ☐  None of them<br>
&emsp;(c) **\[4 points\]** For next 3 questions, assume that the database restarts and finds all log records<br>
&emsp;&emsp;&emsp;up to LSN 21 in the WAL. Also assume the DPT is {C} for LSN 16. According to the<br>
&emsp;&emsp;&emsp;lecture, which pages the analysis phase may select to be redone? Select all that apply.<br>
&emsp;&emsp;&emsp;☐  `A`   ☐  `B`   ☐  `C`   ☐  None of them<br>
&emsp;(d) **\[4 points\]** Select all transactions that should be undone during recovery.<br>
&emsp;&emsp;&emsp;☐  `T1`   ☐  `T2`   ☐  `T3`   ☐  `T4`   ☐  None of them


### Question 1 continues...


---

<a id="page-3"></a>
**Page 3**

15-445/645 (Fall 2024)   Homework #6   Page 3 of 9

&emsp;(e) **\[4 points\]** How many new CLR records will be appended to the WAL after the database<br>
&emsp;&emsp;&emsp;fully recovers?<br>
&emsp;&emsp;&emsp;☐  0   ☐  1   ☐  2   ☐  3   ☐  4   ☐  5   ☐  6

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #6 continues...


---

<a id="page-4"></a>
**Page 4**

15-445/645 (Fall 2024)   Homework #6   Page 4 of 9


### **Question 2: Two-Phase Commit . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . \[24 points\]**

&emsp;Consider a distributed transaction T operating under the two-phase commit protocol with the<br>
&emsp;**early acknowledgement optimization**. Let N0 be the coordinator node, and N1, N2, N3 be the<br>
&emsp;participant nodes. Let the C be the client application issuing the transaction request. Assume<br>
&emsp;that the client communicates directly with the coordinator node. Assume that the coordinator<br>
&emsp;will treat a node that has failed to respond after **three** “`Phase1:PREPARE`” as dead.<br>
&emsp;The following messages have been sent:

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;time   message<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1C to N0: “`REQUEST:COMMIT`”<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2   N0 to N2: “`Phase1:PREPARE`”<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3N0 to N3: “`Phase1:PREPARE`”<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4   N2 to N0: “`OK`”<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;5   N0 to N1: “`Phase1:PREPARE`”<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;6   N0 to N1: “`Phase1:PREPARE`”<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;7   N3 to N0: “`OK`”<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;8N0 to N1: “`Phase1:PREPARE`”<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Figure 2: Two-Phase Commit messages for transaction T

&emsp;(a) **\[6 points\]** Who should send message(s) next at time 9 in Figure 2? Select all the possible<br>
&emsp;&emsp;&emsp;answers.<br>
&emsp;&emsp;&emsp;☐  C<br>
&emsp;&emsp;&emsp;☐  N0<br>
&emsp;&emsp;&emsp;☐  N1<br>
&emsp;&emsp;&emsp;☐  N2<br>
&emsp;&emsp;&emsp;☐  N3<br>
&emsp;&emsp;&emsp;☐  It is not possible to determine<br>
&emsp;(b) **\[6 points\]** Assume N1 responds “`OK`” at time 9, who does N0 send messages to at time<br>
&emsp;&emsp;&emsp;10? Select all the possible answers.<br>
&emsp;&emsp;&emsp;☐  C<br>
&emsp;&emsp;&emsp;☐  N0<br>
&emsp;&emsp;&emsp;☐  N1<br>
&emsp;&emsp;&emsp;☐  N2<br>
&emsp;&emsp;&emsp;☐  N3<br>
&emsp;&emsp;&emsp;☐  It is not possible to determine<br>
&emsp;(c) **\[6 points\]** Suppose that N0 decides to abort the transaction at time 9 in Figure 2. What<br>
&emsp;&emsp;&emsp;should happen under the two-phase commit protocol in this scenario?<br>
&emsp;&emsp;&emsp;☐  N0 resends “`Phase1:PREPARE`” to all of the participant nodes<br>
&emsp;&emsp;&emsp;☐  N0 sends “`Phase2:COMMIT`” to all of the participant nodes<br>
&emsp;&emsp;&emsp;☐  N0 sends “`ABORT`” to only the client<br>
&emsp;&emsp;&emsp;☐  N0 sends “`ABORT`” to all of the participant nodes and the client<br>
&emsp;&emsp;&emsp;☐  N0 resends “`Phase1:PREPARE`” to N2


### Question 2 continues...


---

<a id="page-5"></a>
**Page 5**

15-445/645 (Fall 2024)   Homework #6   Page 5 of 9

&emsp;&emsp;&emsp;☐  N1 sends “`OK`” to N0<br>
&emsp;&emsp;&emsp;☐  It is not possible to determine<br>
&emsp;(d) **\[6 points\]** Suppose that N0 successfully receives all of the “`OK`” messages from the par-<br>
&emsp;&emsp;&emsp;ticipants from the first phase. It then sends the “`Phase2:COMMIT`” message to all of the<br>
&emsp;&emsp;&emsp;participants but N1 and N3 crash before they receives this message. What is the status of<br>
&emsp;&emsp;&emsp;the transaction T when N1 comes back on-line?<br>
&emsp;&emsp;&emsp;☐  T’s status is committed<br>
&emsp;&emsp;&emsp;☐  T’s status is aborted<br>
&emsp;&emsp;&emsp;☐  It is not possible to determine

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #6 continues...


---

<a id="page-6"></a>
**Page 6**

15-445/645 (Fall 2024)   Homework #6   Page 6 of 9


### **Question 3: Distributed Query Plan . . . . . . . . . . . . . . . . . . . . . . . . . . . \[18 points\]**

&emsp;The CMU-DB team is optimizing distributed databases for aggregations and joins in their<br>
&emsp;new project, AutoOpt. This project aims to enable efficient computation of distributed joins<br>
&emsp;followed by aggregations.<br>
&emsp;Given the following schema:

&emsp;`CREATE` `TABLE` `part(PRIMARY` `KEY` `p` `partkey` `INT,` `p` `type` `VARCHAR);`<br>
&emsp;`CREATE` `TABLE` `partsupp(ps` `partkey` `int,` `ps` `suppkey` `int,` `ps` `cost` `DECIMAL,`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`PRIMARY` `KEY` `(ps` `partkey,` `ps` `suppkey));`<br>
&emsp;`CREATE` `TABLE` `supplier(PRIMARY` `KEY` `s` `suppkey` `INT,` `s` `nationkey` `INT);`<br>
&emsp;`CREATE` `TABLE` `nation(PRIMARY` `KEY` `n` `nationkey` `INT,` `n` `name` `VARCHAR);`

&emsp;AutoOpt partitions these tables across nodes based on the partition key. Consider the follow-<br>
&emsp;ing query:

&emsp;`SELECT` `n` `name,` `MIN(partsupp.ps` `cost)`<br>
&emsp;`FROM` `part`<br>
&emsp;`JOIN` `partsupp` `ON` `part.p` `partkey` `=` `partsupp.ps` `partkey`<br>
&emsp;`JOIN` `supplier` `ON` `supplier.s` `suppkey` `=` `partsupp.ps` `suppkey`<br>
&emsp;`JOIN` `nation` `ON` `nation.n` `nationkey` `=` `supplier.s` `nationkey`<br>
&emsp;`WHERE` `part.p` `type` `LIKE` `’%BRASS’`<br>
&emsp;`GROUP` `BY` `n` `name;`

&emsp;You can make the following assumptions:<br>
&emsp;&emsp;1\. There are 4 nodes in the system.<br>
&emsp;&emsp;2\. The `part` table contains 20,000 rows, of which 4,000 satisfy the `p_type` predicate.<br>
&emsp;&emsp;3\. The `partsupp` table contains 80,000 rows.<br>
&emsp;&emsp;4\. The `supplier` table contains 10 rows.<br>
&emsp;&emsp;5\. The `nation` table contains 25 rows.<br>
&emsp;(a) **\[5 points\]** Which data distribution strategy minimizes the total network data transfer for<br>
&emsp;&emsp;&emsp;the given query?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  Partition all tables randomly without any specific range or replication strategy.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  Replicate `partsupp`, `supplier`, and `nation` tables across all nodes, and parti-<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;tion `part` table by `p` `partkey`.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  Replicate `supplier` and `nation` table across all nodes, and partition `part` and<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`partsupp` tables by `p` `partkey` and `ps` `partkey` respectively.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  Partition all tables by their primary key.<br>
&emsp;(b) **\[5 points\]** Assuming the selected strategy from question (a) is implemented, what is the<br>
&emsp;&emsp;&emsp;estimated total data transferred over the network for the **join** operation? Assume that only<br>
&emsp;&emsp;&emsp;the central node can perform aggregations.


### Question 3 continues...


---

<a id="page-7"></a>
**Page 7**

15-445/645 (Fall 2024)   Homework #6   Page 7 of 9

&emsp;&emsp;&emsp;&emsp;&emsp;☐  Less than 5,000 rows<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  Between 5,001 to 25,000 rows<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  Between 25,001 to 100,000 rows<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  More than 100,000 rows<br>
&emsp;(c) **\[5 points\]** If AutoOpt introduces a feature that allows each node to compute a partial<br>
&emsp;&emsp;&emsp;aggregation before sending it to the central node for final aggregation, what is the new<br>
&emsp;&emsp;&emsp;estimated total network data transfer?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  Less than 5,000 rows<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  Between 5,001 to 25,000 rows<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  Between 25,001 to 100,000 rows<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  More than 100,000 rows<br>
&emsp;(d) **\[3 points\]** What are the primary drawbacks of implementing a feature that allows for<br>
&emsp;&emsp;&emsp;intermediate aggregation results to be computed on each node before sending these results<br>
&emsp;&emsp;&emsp;to a central node for final aggregation? Consider the impact on system resources. Select<br>
&emsp;&emsp;&emsp;all that apply.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  It significantly increases the amount of data transferred over the network.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  It requires more data to be shuffled between nodes.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  It increases the computational load on each node.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  It increases the memory usage on each node due to the storage of intermediate<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;results.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  It decreases the overall system performance.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #6 continues...


---

<a id="page-8"></a>
**Page 8**

15-445/645 (Fall 2024)   Homework #6   Page 8 of 9


### **Question 4: Miscellaneous . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . \[30 points\]**

&emsp;(a) **\[3 points\]** A distributed DBMS can immediately commit a transaction under network<br>
&emsp;&emsp;&emsp;partitioning without any loss of data consistency.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  False

&emsp;(b) **\[3 points\]** ARIES employs two passes of the log during the recovery process to handle<br>
&emsp;&emsp;&emsp;both redo and undo operations.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  False

&emsp;(c) **\[3 points\]** The CAP theorem implies that a distributed system cannot simultaneously<br>
&emsp;&emsp;&emsp;guarantee consistency, availability, and partition tolerance.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  False

&emsp;(d) **\[3 points\]** In ARIES, only transactions that commit will have an associated “TXN-<br>
&emsp;&emsp;&emsp;END” record in the log.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  False

&emsp;(e) **\[3 points\]** In the context of distributed DBMS, data replication increases availability but<br>
&emsp;&emsp;&emsp;can lead to challenges in maintaining data consistency across nodes.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  False

&emsp;(f) **\[3 points\]** Both PAXOS and Two-Phase Commit protocols can be used to implement<br>
&emsp;&emsp;&emsp;distributed transactions.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  False

&emsp;(g) **\[3 points\]** In reference to recovery algorithms that use a write-ahead log (WAL). Under<br>
&emsp;&emsp;&emsp;NO-STEAL + FORCE policy, a DBMS will have to undo the changes of an aborted<br>
&emsp;&emsp;&emsp;transaction during recovery.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  False


### Question 4 continues...


---

<a id="page-9"></a>
**Page 9**

15-445/645 (Fall 2024)   Homework #6   Page 9 of 9

&emsp;(h) **\[3 points\]** Fuzzy checkpoints need to block the execution of all transactions while a<br>
&emsp;&emsp;&emsp;consistent snapshot is written to disk.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  False

&emsp;(i) **\[3 points\]** With consistent hashing, if a node fails, then only a subset and not all keys<br>
&emsp;&emsp;&emsp;will be reshuffled among the remaining nodes.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  False

&emsp;(j) **\[3 points\]** In a system with strong consistency requirements, it is best for the DBMS<br>
&emsp;&emsp;&emsp;to implement active-passive replication with synchronous replication and continuous log<br>
&emsp;&emsp;&emsp;streaming.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  False

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;End of Homework #6

