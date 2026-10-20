# CMU 15-445 Fall 2024: Homework 6: Official solutions

> Copied from the original: <https://15445.courses.cs.cmu.edu/fall2024/assignments.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CARNEGIE MELLON UNIVERSITY<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;COMPUTER SCIENCE DEPARTMENT<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;15-445/645 – DATABASE SYSTEMS (FALL 2024)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;PROF. ANDY PAVLO

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #6 (by William ) – Solutions<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Due: **Monday Dec 9, 2024 @ 11:59pm**

**IMPORTANT:**<br>
&emsp;• Enter all of your answers into **Gradescope by 11:59pm on Monday Dec 9, 2024**.<br>
&emsp;• **Plagiarism**: Homework may be discussed with other students, but all homework is to be<br>
&emsp;&emsp;completed **individually**.<br>
&emsp;• **You have to use this PDF for all of your answers.**<br>
For your information:<br>
&emsp;• Graded out of **100** points; **4** questions total<br>
&emsp;Revision : 2024/12/12 21:18

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

15-445/645 (Fall 2024)   Homework #6   Page 2 of 10


### **Question 1: ARIES . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . \[28 points\]**

&emsp;RusTub uses ARIES recovery with fuzzy checkpoints. It also has a background thread that<br>
&emsp;may arbitrarily flush a dirty bufferpool page to disk at any time.<br>
&emsp;For this question, assume objects `A`, `B`, `C` reside in three different pages `A`, `B`, `C`, respectively.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**LSN**   **WAL Record**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1   `<T1,` `BEGIN>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2   `<T2,` `BEGIN>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3   `<T3,` `BEGIN>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4   `<T3,` `UPDATE,` `prev=3,` `C,` `1000`→`2000>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;5`<T2,` `UPDATE,` `prev=2,` `A,` `10`→`20>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;6   `<T2,` `COMMIT,` `prev=5>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;7`<T1,` `UPDATE,` `prev=1,` `B,` `100`→`200>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;8   `<CHECKPOINT` `BEGIN>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;9`<T1,` `UPDATE,` `prev=7,` `A,` `20`→`30>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;10   `<CHECKPOINT` `END,` `ATT=`{`T1,` `T2,` `T3`}`,` `DPT=`{`C`}`>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;11`<T3,` `UPDATE,` `prev=4,` `C,` `2000`→`3000>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;12   `<T2,` `TXN-END>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;13   `<CHECKPOINT` `BEGIN>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;14   `<T1,` `COMMIT,` `prev=9>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;15   `<T4,` `BEGIN>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;16`<CHECKPOINT` `END,` `ATT=`{`T1,` `T3`}`,` `DPT=`{`?`}`>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;17   `<T3,` `COMMIT,` `prev=11>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;18`<T4,` `UPDATE,` `prev=15,` `B,` `200`→`300>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;19   `<T4,` `UPDATE,` `prev=18,` `A,` `30`→`40>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;20`<T4,` `ABORT,` `prev=19>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;21   `<T4,` `CLR,` `prev=20,` `A,` `40`→`30,` `undoNext=18>`

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Figure 1: WAL

&emsp;(a) Suppose the system crashes and, when it recovers, the WAL contains the first 10 records<br>
&emsp;&emsp;&emsp;(up to `<CHECKPOINT` `END,` `ATT=`{`T1,` `T2,` `T3`}`,` `DPT=`{`C`}`>`). Of the object states below,<br>
&emsp;&emsp;&emsp;which states are possibly stored on disk before recovery starts? Select all that apply.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ `A=20`   ☒ `A=30`<br>
&emsp;&emsp;&emsp;i. **\[4 points\]** ☐  `A=10`   ☐  `A=40`   ☐  Cannot be determined<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ `B=200`<br>
&emsp;&emsp;&emsp;ii. **\[4 points\]** ☐  `B=100`   ☐  `B=300`   ☐  Cannot be determined<br>
&emsp;&emsp;&emsp;iii. **\[4 points\]** ☒ `C=1000`   ☒ `C=2000`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  `C=3000`   ☐  Cannot be determined<br>
&emsp;&emsp;&emsp;**Solution:** Page A is not logged as dirty in the checkpoint record, so the value can’t be<br>
&emsp;&emsp;&emsp;10\. But LSN 9 changes page A, so it can be either 20 or 30. Page B is not logged as<br>
&emsp;&emsp;&emsp;dirty in the checkpoint record, and there is no followup updates between LSN 8 and<br>
&emsp;&emsp;&emsp;LSN 10, so its value should be 200. Page C is logged as dirty in the checkpoint. It’s<br>
&emsp;&emsp;&emsp;uncertain whether it hasn’t been flushed at all or if it has been flushed at some stage, so<br>
&emsp;&emsp;&emsp;its value can be 1000 or 2000. Pages on disk will not contain any updates later than the<br>
&emsp;&emsp;&emsp;last flushed log record.


### Question 1 continues...


---

<a id="page-3"></a>
**Page 3**

15-445/645 (Fall 2024)   Homework #6   Page 3 of 10

&emsp;(b) **\[4 points\]** Select all possible values of DPT in record 16.<br>
&emsp;&emsp;&emsp;☒ `A`   ☒ `C`   ☒ `A,` `C`   ☒ **None of them**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  `B`   ☐  `A,` `B`   ☐  `B,` `C`   ☐  `A,` `B,` `C`

&emsp;&emsp;&emsp;**Solution:** Dirty pages can be flushed to disks at any time arbitrarily. But LSN 10 en-<br>
&emsp;&emsp;&emsp;sures that the value stored in disk for Page B has already been updated from 100 to 200,<br>
&emsp;&emsp;&emsp;and there is no followup updates, so B cannot appear in the DPT. Both Page A and C<br>
&emsp;&emsp;&emsp;may be present in the DPT due to the following updates after LSN 8 (not to mention C<br>
&emsp;&emsp;&emsp;has already been logged dirty at the last checkpoint).<br>
&emsp;&emsp;&emsp;Grading Note: Although not origianlly intended, “None of them” is also a valid answer<br>
&emsp;&emsp;&emsp;since the background thread could have aggressively flushed dirty data.<br>
&emsp;(c) **\[4 points\]** For next 3 questions, assume that the database restarts and finds all log records<br>
&emsp;&emsp;&emsp;up to LSN 21 in the WAL. Also assume the DPT is {C} for LSN 16. According to the<br>
&emsp;&emsp;&emsp;lecture, which pages the analysis phase may select to be redone? Select all that apply.<br>
&emsp;&emsp;&emsp;☒ `A`   ☒ `B`   ☒ `C`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  None of them<br>
&emsp;&emsp;&emsp;**Solution:** We redo all pages in the DPT and those modified after LSN 13.<br>
&emsp;(d) **\[4 points\]** Select all transactions that should be undone during recovery.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ `T4`<br>
&emsp;&emsp;&emsp;☐  `T1`   ☐  `T2`   ☐  `T3`   ☐  None of them<br>
&emsp;&emsp;&emsp;**Solution:** All uncommitted or explicitly aborted transactions should be undone.<br>
&emsp;(e) **\[4 points\]** How many new CLR records will be appended to the WAL after the database<br>
&emsp;&emsp;&emsp;fully recovers?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☒ **1**<br>
&emsp;&emsp;&emsp;☐  0   ☐  2   ☐  3   ☐  4   ☐  5   ☐  6<br>
&emsp;&emsp;&emsp;**Solution:** `T4` will produce 1 more CLR record.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #6 continues...


---

<a id="page-4"></a>
**Page 4**

15-445/645 (Fall 2024)   Homework #6   Page 4 of 10


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
&emsp;&emsp;&emsp;☒ N0<br>
&emsp;&emsp;&emsp;☒ N1<br>
&emsp;&emsp;&emsp;☐  N2<br>
&emsp;&emsp;&emsp;☐  N3<br>
&emsp;&emsp;&emsp;☐  It is not possible to determine<br>
&emsp;&emsp;&emsp;**Solution:** There are two possible options. If N1 is alive, N1 needs to respond to N0<br>
&emsp;&emsp;&emsp;with a “`OK`” or “`ABORT`” message. Alternatively, N0 will decide T1 is dead and proceed<br>
&emsp;&emsp;&emsp;to the “`ABORT`” procedure.<br>
&emsp;(b) **\[6 points\]** Assume N1 responds “`OK`” at time 9, who does N0 send messages to at time<br>
&emsp;&emsp;&emsp;10? Select all the possible answers.<br>
&emsp;&emsp;&emsp;☒ C<br>
&emsp;&emsp;&emsp;☐  N0<br>
&emsp;&emsp;&emsp;☒ N1<br>
&emsp;&emsp;&emsp;☒ N2<br>
&emsp;&emsp;&emsp;☒ N3<br>
&emsp;&emsp;&emsp;☐  It is not possible to determine<br>
&emsp;&emsp;&emsp;**Solution:** At the time when all participant nodes have responded with “`OK`”, T is con-<br>
&emsp;&emsp;&emsp;sidered to be committed. N0 must notify the participant nodes N1, N2, and N3 of the


### Question 2 continues...


---

<a id="page-5"></a>
**Page 5**

15-445/645 (Fall 2024)   Homework #6   Page 5 of 10

&emsp;&emsp;&emsp;decision to commit. At this time N0 should also notify the client application since the<br>
&emsp;&emsp;&emsp;protocol is running with the early acknowledgement optimization.<br>
&emsp;(c) **\[6 points\]** Suppose that N0 decides to abort the transaction at time 9 in Figure 2. What<br>
&emsp;&emsp;&emsp;should happen under the two-phase commit protocol in this scenario?<br>
&emsp;&emsp;&emsp;☐  N0 resends “`Phase1:PREPARE`” to all of the participant nodes<br>
&emsp;&emsp;&emsp;☐  N0 sends “`Phase2:COMMIT`” to all of the participant nodes<br>
&emsp;&emsp;&emsp;☐  N0 sends “`ABORT`” to only the client<br>
&emsp;&emsp;&emsp;☒ N0 **sends “**`ABORT`**” to all of the participant nodes and the client**<br>
&emsp;&emsp;&emsp;☐  N0 resends “`Phase1:PREPARE`” to N2<br>
&emsp;&emsp;&emsp;☐  N1 sends “`OK`” to N0<br>
&emsp;&emsp;&emsp;☐  It is not possible to determine<br>
&emsp;&emsp;&emsp;**Solution:** The coordinator (N0) will mark the transaction as aborted. 2PC requires that<br>
&emsp;&emsp;&emsp;all participants respond with “`OK`”.<br>
&emsp;(d) **\[6 points\]** Suppose that N0 successfully receives all of the “`OK`” messages from the par-<br>
&emsp;&emsp;&emsp;ticipants from the first phase. It then sends the “`Phase2:COMMIT`” message to all of the<br>
&emsp;&emsp;&emsp;participants but N1 and N3 crash before they receives this message. What is the status of<br>
&emsp;&emsp;&emsp;the transaction T when N1 comes back on-line?<br>
&emsp;&emsp;&emsp;☒ T**’s status is committed**<br>
&emsp;&emsp;&emsp;☐  T’s status is aborted<br>
&emsp;&emsp;&emsp;☐  It is not possible to determine<br>
&emsp;&emsp;&emsp;**Solution:** Once the coordinator (N0) gets a “`OK`” message from all participants, then<br>
&emsp;&emsp;&emsp;the transaction is considered to be committed even though a node may crash during the<br>
&emsp;&emsp;&emsp;second phase. In this example, N1 and N3 would have restore T when it comes back<br>
&emsp;&emsp;&emsp;on-line.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #6 continues...


---

<a id="page-6"></a>
**Page 6**

15-445/645 (Fall 2024)   Homework #6   Page 6 of 10


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
&emsp;&emsp;&emsp;&emsp;&emsp;☒ **Replicate** `partsupp`**,** `supplier`**, and** `nation` **tables across all nodes, and par-**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**tition** `part` **table by** `p` `partkey`**.**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☒ **Replicate** `supplier` **and** `nation` **table across all nodes, and partition** `part`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**and** `partsupp` **tables by** `p` `partkey` **and** `ps` `partkey` **respectively.**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  Partition all tables by their primary key.


### Question 3 continues...


---

<a id="page-7"></a>
**Page 7**

15-445/645 (Fall 2024)   Homework #6   Page 7 of 10

&emsp;&emsp;&emsp;**Solution:** This strategy minimizes cross-node data transfer by localizing joins involving<br>
&emsp;&emsp;&emsp;`part` and `partsupp` to individual nodes and avoids the need to transfer `supplier` and<br>
&emsp;&emsp;&emsp;`nation` data across nodes because it is replicated everywhere. In addition, this strategy<br>
&emsp;&emsp;&emsp;avoids the need to transfer the entire `partsupp` table everywhere.<br>
&emsp;&emsp;&emsp;Grading Note: Question originally intended to account for replication costs (which would<br>
&emsp;&emsp;&emsp;make (b) worse than (c) due to needing to move `partsupp` to all nodes. Due to ambigu-<br>
&emsp;&emsp;&emsp;ity, both (b) and (c) are correct.<br>
&emsp;(b) **\[5 points\]** Assuming the selected strategy from question (a) is implemented, what is the<br>
&emsp;&emsp;&emsp;estimated total data transferred over the network for the **join** operation? Assume that only<br>
&emsp;&emsp;&emsp;the central node can perform aggregations.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  Less than 5,000 rows<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  Between 5,001 to 25,000 rows<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☒ **Between 25,001 to 100,000 rows**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  More than 100,000 rows<br>
&emsp;&emsp;&emsp;**Solution:** Given that `supplier` and `nation` data are replicated across all nodes and<br>
&emsp;&emsp;&emsp;joins are localized, the data transfer will be the result of all local joins. Worst case<br>
&emsp;&emsp;&emsp;scenario is the max cardinality of the join output: 40,000 rows.<br>
&emsp;(c) **\[5 points\]** If AutoOpt introduces a feature that allows each node to compute a partial<br>
&emsp;&emsp;&emsp;aggregation before sending it to the central node for final aggregation, what is the new<br>
&emsp;&emsp;&emsp;estimated total network data transfer?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☒ **Less than 5,000 rows**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  Between 5,001 to 25,000 rows<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  Between 25,001 to 100,000 rows<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  More than 100,000 rows<br>
&emsp;&emsp;&emsp;**Solution:** Here, the only data transfer will be the result of local aggregations needing<br>
&emsp;&emsp;&emsp;to be combined at a central node for final computation. Since we have 4 nodes and 25<br>
&emsp;&emsp;&emsp;rows in `nation`, this translates into an upper bound of 100 row transfers.<br>
&emsp;(d) **\[3 points\]** What are the primary drawbacks of implementing a feature that allows for<br>
&emsp;&emsp;&emsp;intermediate aggregation results to be computed on each node before sending these results<br>
&emsp;&emsp;&emsp;to a central node for final aggregation? Consider the impact on system resources. Select<br>
&emsp;&emsp;&emsp;all that apply.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  It significantly increases the amount of data transferred over the network.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  It requires more data to be shuffled between nodes.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☒ **It increases the computational load on each node.**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☒ **It increases the memory usage on each node due to the storage of interme-**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**diate results.**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  It decreases the overall system performance.


### Question 3 continues...


---

<a id="page-8"></a>
**Page 8**

15-445/645 (Fall 2024)   Homework #6   Page 8 of 10

&emsp;&emsp;&emsp;**Solution:** Performing intermediate aggregations locally increases each node’s compu-<br>
&emsp;&emsp;&emsp;tational load and memory usage, as they must handle and store aggregation results.<br>
&emsp;&emsp;&emsp;This method reduces network traffic but demands more computational and memory re-<br>
&emsp;&emsp;&emsp;sources.<br>
&emsp;&emsp;&emsp;First option is incorrect since the goal is to decrease data transfer. The second option is<br>
&emsp;&emsp;&emsp;incorrect since it does not necessarily require more data to be shuffled between nodes.<br>
&emsp;&emsp;&emsp;The last option is too general; local aggregations often enhance performance by easing<br>
&emsp;&emsp;&emsp;network demands.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #6 continues...


---

<a id="page-9"></a>
**Page 9**

15-445/645 (Fall 2024)   Homework #6   Page 9 of 10


### **Question 4: Miscellaneous . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . \[30 points\]**

&emsp;(a) **\[3 points\]** A distributed DBMS can immediately commit a transaction under network<br>
&emsp;&emsp;&emsp;partitioning without any loss of data consistency.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;**Solution:** False. This is a violation of the CAP theorem.

&emsp;(b) **\[3 points\]** ARIES employs two passes of the log during the recovery process to handle<br>
&emsp;&emsp;&emsp;both redo and undo operations.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;**Solution:** ARIES is a three phase algorithm and requires at most three passes over the<br>
&emsp;&emsp;&emsp;log.

&emsp;(c) **\[3 points\]** The CAP theorem implies that a distributed system cannot simultaneously<br>
&emsp;&emsp;&emsp;guarantee consistency, availability, and partition tolerance.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☒ **True**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  False<br>
&emsp;&emsp;&emsp;**Solution:** By definition.

&emsp;(d) **\[3 points\]** In ARIES, only transactions that commit will have an associated “TXN-<br>
&emsp;&emsp;&emsp;END” record in the log.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;**Solution:** Transactions will commit when the COMMIT log is written, TXN-END is an<br>
&emsp;&emsp;&emsp;optimization in the ARIES protocol that indicates it can be removed from the transaction<br>
&emsp;&emsp;&emsp;table.

&emsp;(e) **\[3 points\]** In the context of distributed DBMS, data replication increases availability but<br>
&emsp;&emsp;&emsp;can lead to challenges in maintaining data consistency across nodes.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☒ **True**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  False<br>
&emsp;&emsp;&emsp;**Solution:** CAP limitations.

&emsp;(f) **\[3 points\]** Both PAXOS and Two-Phase Commit protocols can be used to implement<br>
&emsp;&emsp;&emsp;distributed transactions.


### Question 4 continues...


---

<a id="page-10"></a>
**Page 10**

15-445/645 (Fall 2024)   Homework #6   Page 10 of 10<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☒ **True**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  False<br>
&emsp;&emsp;&emsp;**Solution:** 2PC is a degenerate case of Paxos, which is a consensus protocol for dis-<br>
&emsp;&emsp;&emsp;tributed transactions.

&emsp;(g) **\[3 points\]** In reference to recovery algorithms that use a write-ahead log (WAL). Under<br>
&emsp;&emsp;&emsp;NO-STEAL + FORCE policy, a DBMS will have to undo the changes of an aborted<br>
&emsp;&emsp;&emsp;transaction during recovery.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;**Solution:** The FORCE policy guarantees that all changes from committed transactions<br>
&emsp;&emsp;&emsp;are immediately written to disk, ensuring durability, while it is the NO-STEAL policy<br>
&emsp;&emsp;&emsp;that prevents changes by uncommitted transactions from being written to disk, avoiding<br>
&emsp;&emsp;&emsp;the need for undo operations on disk for those transactions.

&emsp;(h) **\[3 points\]** Fuzzy checkpoints need to block the execution of all transactions while a<br>
&emsp;&emsp;&emsp;consistent snapshot is written to disk.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;**Solution:** See motivation of checkpointing.

&emsp;(i) **\[3 points\]** With consistent hashing, if a node fails, then only a subset and not all keys<br>
&emsp;&emsp;&emsp;will be reshuffled among the remaining nodes.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☒ **True**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  False<br>
&emsp;&emsp;&emsp;**Solution:** See motivation of consistent hashing.

&emsp;(j) **\[3 points\]** In a system with strong consistency requirements, it is best for the DBMS<br>
&emsp;&emsp;&emsp;to implement active-passive replication with synchronous replication and continuous log<br>
&emsp;&emsp;&emsp;streaming.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☒ **True**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  False<br>
&emsp;&emsp;&emsp;**Solution:** Synchronous replication can ensure strong consistency.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;End of Homework #6

