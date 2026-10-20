# CMU 15-445 Spring 2024: Homework 5: Questions

> Copied from the original: <https://15445.courses.cs.cmu.edu/spring2024/assignments.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CARNEGIE MELLON UNIVERSITY<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;COMPUTER SCIENCE DEPARTMENT<br>
&emsp;&emsp;&emsp;&emsp;&emsp;15-445/645 – DATABASE SYSTEMS (SPRING 2024)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;PROF. JIGNESH PATEL

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #5 (by Alexis Schlomer & Lan Lou)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Due: **Saturday Apr 20, 2024 @ 11:59pm**

**IMPORTANT:**<br>
&emsp;• Enter all of your answers into **Gradescope by 11:59pm on Saturday Apr 20, 2024**.<br>
&emsp;• **Plagiarism**: Homework may be discussed with other students, but all homework is to be<br>
&emsp;&emsp;completed **individually**.<br>
&emsp;• **You have to use this PDF for all of your answers.**<br>
For your information:<br>
&emsp;• Graded out of **100** points; **4** questions total<br>
&emsp;Revision : 2024/04/17 13:27

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

15-445/645 (Spring 2024)   Homework #5   Page 2 of 9


### **Question 1: ARIES . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . \[28 points\]**

&emsp;RusTub uses ARIES recovery with fuzzy checkpoints. It also has a background thread that<br>
&emsp;may arbitrarily flush a dirty bufferpool page to disk at any time.<br>
&emsp;For this question, assume objects `A`, `B`, `C` reside in three different pages `A`, `B`, `C`, respectively.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**LSN**   **WAL Record**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1   `<T1,` `BEGIN>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2`<T1,` `UPDATE,` `prev=1,` `B,` `20`→`30>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3   `<T2,` `BEGIN>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4   `<T3,` `BEGIN>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;5`<T3,` `UPDATE,` `prev=4,` `C,` `30`→`40>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;6   `<T2,` `UPDATE,` `prev=3,` `A,` `10`→`20>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;7`<T2,` `COMMIT,` `prev=6>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;8   `<CHECKPOINT` `BEGIN>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;9`<T1,` `UPDATE,` `prev=2,` `A,` `20`→`30>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;10   `<CHECKPOINT` `END,` `ATT=`{`T1,` `T2,` `T3`}`,` `DPT=`{`C`}`>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;11`<T3,` `UPDATE,` `prev=5,` `C,` `40`→`50>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;12   `<T2,` `TXN-END>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;13   `<CHECKPOINT` `BEGIN>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;14   `<T1,` `COMMIT,` `prev=9>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;15   `<T4,` `BEGIN>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;16`<CHECKPOINT` `END,` `ATT=`{`T1,` `T3`}`,` `DPT=`{`?`}`>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;17   `<T4,` `UPDATE,` `prev=15,` `B,` `30`→`20>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;18`<T4,` `UPDATE,` `prev=17,` `A,` `30`→`20>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;19   `<T4,` `ABORT,` `prev=18>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;20`<T4,` `CLR,` `prev=19,` `A,` `20`→`30,` `undoNext=17>`

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Figure 1: WAL

&emsp;(a) Suppose the system crashes and, when it recovers, the WAL contains the first 10 records<br>
&emsp;&emsp;&emsp;(up to `<CHECKPOINT` `END,` `ATT=`{`T1,` `T2,` `T3`}`,` `DPT=`{`C`}`>`). Of the object states below,<br>
&emsp;&emsp;&emsp;which states are possibly stored on disk before recovery starts? Select all that apply.<br>
&emsp;&emsp;&emsp;i. **\[4 points\]** ☐  `A=10`   ☐  `A=20`   ☐  `A=30`<br>
&emsp;&emsp;&emsp;ii. **\[4 points\]** ☐  `B=20`   ☐  `B=30`<br>
&emsp;&emsp;&emsp;iii. **\[4 points\]** ☐  `C=30`   ☐  `C=40`<br>
&emsp;(b) **\[4 points\]** Select all possible values of DPT in record 16.<br>
&emsp;&emsp;&emsp;☐  `A`   ☐  `B`   ☐  `C`   ☐  `A,` `B`   ☐  `A,` `C`   ☐  `B,` `C`   ☐  `A,` `B,` `C`   ☐  None of them<br>
&emsp;(c) **\[4 points\]** For next 3 questions, assume that the database restarts and finds all log records<br>
&emsp;&emsp;&emsp;up to LSN 20 in the WAL. Also assume the DPT is {C} for LSN 16. According to the<br>
&emsp;&emsp;&emsp;lecture, which pages the analysis phase may select to be redone? Select all that apply.<br>
&emsp;&emsp;&emsp;☐  `A`   ☐  `B`   ☐  `C`   ☐  None of them<br>
&emsp;(d) **\[4 points\]** Select all transactions that should be undone during recovery.<br>
&emsp;&emsp;&emsp;☐  `T1`   ☐  `T2`   ☐  `T3`   ☐  `T4`   ☐  None of them


### Question 1 continues...


---

<a id="page-3"></a>
**Page 3**

15-445/645 (Spring 2024)   Homework #5   Page 3 of 9

&emsp;(e) **\[4 points\]** How many new CLR records will be appended to the WAL after the database<br>
&emsp;&emsp;&emsp;fully recovers?<br>
&emsp;&emsp;&emsp;☐  0   ☐  1   ☐  2   ☐  3   ☐  4   ☐  5   ☐  6

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #5 continues...


---

<a id="page-4"></a>
**Page 4**

15-445/645 (Spring 2024)   Homework #5   Page 4 of 9


### **Question 2: Two-Phase Commit . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . \[24 points\]**

&emsp;Consider a distributed transaction T operating under the two-phase commit protocol with the<br>
&emsp;**early acknowledgement optimization**. Let N0 be the coordinator node, and N1, N2, N3 be the<br>
&emsp;participant nodes. Let the C be the client application issuing the transaction request. Assume<br>
&emsp;that the client communicates directly with the coordinator node.<br>
&emsp;The following messages have been sent:

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;time   message<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1   C to N0: “`REQUEST:COMMIT`”<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2N0 to N2: “`Phase1:PREPARE`”<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3   N0 to N3: “`Phase1:PREPARE`”<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4   N2 to N0: “`OK`”<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;5   N0 to N1: “`Phase1:PREPARE`”<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;6   N1 to N0: “`OK`”<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;7N3 to N0: “`OK`”<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Figure 2: Two-Phase Commit messages for transaction T

&emsp;(a) **\[6 points\]** Who should send message(s) next at time 8 in Figure 2? Select all the possible<br>
&emsp;&emsp;&emsp;answers.<br>
&emsp;&emsp;&emsp;☐  C<br>
&emsp;&emsp;&emsp;☐  N0<br>
&emsp;&emsp;&emsp;☐  N1<br>
&emsp;&emsp;&emsp;☐  N2<br>
&emsp;&emsp;&emsp;☐  N3<br>
&emsp;&emsp;&emsp;☐  It is not possible to determine<br>
&emsp;(b) **\[6 points\]** To whom? Again, select all the possible answers.<br>
&emsp;&emsp;&emsp;☐  C<br>
&emsp;&emsp;&emsp;☐  N0<br>
&emsp;&emsp;&emsp;☐  N1<br>
&emsp;&emsp;&emsp;☐  N2<br>
&emsp;&emsp;&emsp;☐  N3<br>
&emsp;&emsp;&emsp;☐  It is not possible to determine<br>
&emsp;(c) **\[6 points\]** Suppose that N0 received the “`ABORT`” response from N3 at time 7 in Figure 2.<br>
&emsp;&emsp;&emsp;What should happen under the two-phase commit protocol in this scenario?<br>
&emsp;&emsp;&emsp;☐  N0 resends “`Phase1:PREPARE`” to N2<br>
&emsp;&emsp;&emsp;☐  N1 resends “`OK`” to N0<br>
&emsp;&emsp;&emsp;☐  N0 sends “`Phase2:COMMIT`” all of the participant nodes<br>
&emsp;&emsp;&emsp;☐  N0 sends “`ABORT`” all of the participant nodes<br>
&emsp;&emsp;&emsp;☐  N0 resends “`Phase1:PREPARE`” to all of the participant nodes<br>
&emsp;&emsp;&emsp;☐  It is not possible to determine<br>
&emsp;(d) **\[6 points\]** Suppose that N0 successfully receives all of the “`OK`” messages from the par-<br>
&emsp;&emsp;&emsp;ticipants from the first phase. It then sends the “`Phase2:COMMIT`” message to all of the


### Question 2 continues...


---

<a id="page-5"></a>
**Page 5**

15-445/645 (Spring 2024)   Homework #5   Page 5 of 9

&emsp;&emsp;&emsp;participants but N1 and N3 crash before they receives this message. What is the status of<br>
&emsp;&emsp;&emsp;the transaction T when N1 comes back on-line?<br>
&emsp;&emsp;&emsp;☐  T’s status is aborted<br>
&emsp;&emsp;&emsp;☐  T’s status is committed<br>
&emsp;&emsp;&emsp;☐  It is not possible to determine

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #5 continues...


---

<a id="page-6"></a>
**Page 6**

15-445/645 (Spring 2024)   Homework #5   Page 6 of 9


### **Question 3: Distributed Query Plan . . . . . . . . . . . . . . . . . . . . . . . . . . . \[18 points\]**

&emsp;The CMU-DB team is optimizing distributed databases for aggregations and joins in their<br>
&emsp;new project, AutoLoo. This project aims to enable efficient computation of distributed joins<br>
&emsp;followed by aggregations.<br>
&emsp;Given the following schema:

`CREATE` `TABLE` `cust(PRIMARY` `KEY` `cust` `id` `int,` `name` `VARCHAR,` `loc` `id` `int);`<br>
`CREATE` `TABLE` `txn(PRIMARY` `KEY` `txn` `id` `int,` `cust` `id` `int,` `amount` `DECIMAL,` `year` `int);`<br>
`CREATE` `TABLE` `loc(PRIMARY` `KEY` `loc` `id` `int,` `region` `name` `VARCHAR);`

&emsp;AutoLoo partitions these tables across nodes based on the partition key. Consider the query<br>
&emsp;for analyzing total spending per customer region for the year 2024:

&emsp;`SELECT` `l.region` `name,` `SUM(t.amount)` `AS` `total` `spending`<br>
&emsp;`FROM` `txn` `t`<br>
&emsp;`JOIN` `cust` `c` `ON` `t.cust` `id` `=` `c.cust` `id`<br>
&emsp;`JOIN` `loc` `l` `ON` `c.loc` `id` `=` `l.loc` `id`<br>
&emsp;`WHERE` `t.year` `=` `2024`<br>
&emsp;`GROUP` `BY` `l.region` `name;`

&emsp;You can make the following assumptions:<br>
&emsp;&emsp;1\. There are 5 nodes in the system.<br>
&emsp;&emsp;2\. The `customer` table contains 20,000 rows.<br>
&emsp;&emsp;3\. The `transaction` table contains 50,000 rows for the year 2024.<br>
&emsp;&emsp;4\. The `location` table contains 500 rows.<br>
&emsp;(a) **\[5 points\]** Which data distribution strategy minimizes the total network data transfer for<br>
&emsp;&emsp;&emsp;the given query?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  A) Partition `customer` and `transaction` tables by `customer` `id` range, and<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;replicate `location` table across all nodes.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  B) Partition `transaction` table by `transaction` `id` range, and `customer` and<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`location` tables by `location` `id` range.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  C) Replicate `customer` and `location` tables across all nodes, and partition<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`transaction` table by `customer` `id`.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  D) Partition all tables randomly without any specific range or replication strat-<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;egy.<br>
&emsp;(b) **\[5 points\]** Assuming the selected strategy from question (a) is implemented, what is the<br>
&emsp;&emsp;&emsp;estimated total data transferred over the network for the **join** operation? **Hint:** Only the<br>
&emsp;&emsp;&emsp;central node can perform aggregations.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  A) Less than 5,000 rows


### Question 3 continues...


---

<a id="page-7"></a>
**Page 7**

15-445/645 (Spring 2024)   Homework #5   Page 7 of 9

&emsp;&emsp;&emsp;&emsp;&emsp;☐  B) Between 5,001 to 25,000 rows<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  C) Between 25,001 to 100,000 rows<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  D) More than 100,000 rows<br>
&emsp;(c) **\[5 points\]** If AutoLoo introduces a feature that allows for intermediate aggregation re-<br>
&emsp;&emsp;&emsp;sults to be computed on each node before being sent to a central node for final aggrega-<br>
&emsp;&emsp;&emsp;tion, how will this impact the total network data transfer?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  A) Less than 5,000 rows<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  B) Between 5,001 to 25,000 rows<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  C) Between 25,001 to 100,000 rows<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  D) More than 100,000 rows<br>
&emsp;(d) **\[3 points\]** What are the primary drawbacks of implementing a feature that allows for<br>
&emsp;&emsp;&emsp;intermediate aggregation results to be computed on each node before sending these results<br>
&emsp;&emsp;&emsp;to a central node for final aggregation? Consider the impact on system resources. Select<br>
&emsp;&emsp;&emsp;all that apply.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  A) It significantly increases the amount of data transferred over the network.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  B) It increases the computational load on each node.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  C) It increases the memory usage on each node due to the storage of interme-<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;diate results.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  D) It decreases the overall system performance.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #5 continues...


---

<a id="page-8"></a>
**Page 8**

15-445/645 (Spring 2024)   Homework #5   Page 8 of 9


### **Question 4: Miscellaneous . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . \[30 points\]**

&emsp;(a) **\[3 points\]** A distributed DBMS can commit transactions and automatically compensate<br>
&emsp;&emsp;&emsp;for network partitioning without any loss of data consistency.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  False

&emsp;(b) **\[3 points\]** ARIES employs a single pass of the log during the recovery process to handle<br>
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

15-445/645 (Spring 2024)   Homework #5   Page 9 of 9

&emsp;(h) **\[3 points\]** Fuzzy checkpoints need to block the execution of all transactions while a<br>
&emsp;&emsp;&emsp;consistent snapshot is written to disk.<br>
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

