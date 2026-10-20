# CMU 15-445 Spring 2025: Homework 6: Official solutions

> Copied from the original: <https://15445.courses.cs.cmu.edu/spring2025/assignments.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CARNEGIE MELLON UNIVERSITY<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;COMPUTER SCIENCE DEPARTMENT<br>
&emsp;&emsp;&emsp;&emsp;&emsp;15-445/645 – DATABASE SYSTEMS (SPRING 2025)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;PROF. JIGNESH PATEL

&emsp;&emsp;&emsp;&emsp;&emsp;Homework #6 (by Alexis and Hyoungjoo ) – Solutions<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Due: **Wednesday April 20, 2025 @ 11:59pm**

**IMPORTANT:**<br>
&emsp;• Enter all of your answers into **Gradescope by 11:59pm on Wednesday April 20, 2025**.<br>
&emsp;• **Plagiarism**: Homework may be discussed with other students, but all homework is to be<br>
&emsp;&emsp;completed **individually**.<br>
&emsp;• **You have to use this PDF for all of your answers.**<br>
For your information:<br>
&emsp;• Graded out of **100** points; **4** questions total<br>
&emsp;Revision : 2025/04/22 21:47

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

15-445/645 (Spring 2025)   Homework #6   Page 2 of 10


### **Question 1: ARIES . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . \[28 points\]**

&emsp;RusTub uses ARIES recovery with fuzzy checkpoints. It also has a background thread that<br>
&emsp;may arbitrarily flush a dirty bufferpool page to disk at any time.<br>
&emsp;For this question, assume objects `X`, `Y`, `Z` reside in three different pages `X`, `Y`, `Z`, respectively.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**LSN**   **WAL Record**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1   `<T1,` `BEGIN>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2   `<T2,` `BEGIN>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3   `<T3,` `BEGIN>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4   `<T1,` `UPDATE,` `prev=1,` `X,` `5`→`15>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;5`<T3,` `UPDATE,` `prev=3,` `Z,` `700`→`800>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;6   `<T3,` `COMMIT,` `prev=5>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;7`<CHECKPOINT` `BEGIN>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;8   `<T2,` `UPDATE,` `prev=2,` `Y,` `30`→`50>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;9`<T1,` `UPDATE,` `prev=4,` `Z,` `800`→`900>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;10   `<CHECKPOINT` `END,` `ATT=`{`T1,` `T2,` `T3`}`,` `DPT=`{`Z`}`>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;11`<T2,` `UPDATE,` `prev=8,` `Y,` `50`→`60>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;12   `<T3,` `TXN-END>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;13   `<CHECKPOINT` `BEGIN>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;14   `<T1,` `COMMIT,` `prev=9>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;15   `<CHECKPOINT` `END,` `ATT=`{`T1,` `T2`}`,` `DPT=`{`?`}`>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;16`<T2,` `UPDATE,` `prev=11,` `X,` `15`→`25>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;17   `<T2,` `UPDATE,` `prev=16,` `Y,` `60`→`70>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;18`<T2,` `ABORT,` `prev=19>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;19   `<T2,` `CLR,` `prev=18,` `Y,` `70`→`60,` `undoNext=16>`

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Figure 1: WAL

&emsp;(a) Suppose the system crashes and, when it recovers, the WAL contains the first 10 records<br>
&emsp;&emsp;&emsp;(up to `<CHECKPOINT` `END,` `ATT=`{`T1,` `T2,` `T3`}`,` `DPT=`{`Z`}`>`). Of the object states below,<br>
&emsp;&emsp;&emsp;which states are possibly stored on disk before recovery starts? Select all that apply.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ `X=15`<br>
&emsp;&emsp;&emsp;i. **\[4 points\]** ☐  `X=5`   ☐  `X=25`   ☐  `X=35`   ☐  Cannot be determined<br>
&emsp;&emsp;&emsp;ii. **\[4 points\]** ☒ `Y=30`   ☒ `Y=50`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  `Y=60`   ☐  Cannot be determined<br>
&emsp;&emsp;&emsp;iii. **\[4 points\]** ☒ `Z=700`   ☒ `Z=800`   ☒ `Z=900`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  Cannot be determined<br>
&emsp;&emsp;&emsp;**Solution:** Page X was not in the DPT at LSN=10. Hence A=15. Page Y was not in the<br>
&emsp;&emsp;&emsp;DPT at LSN=10, but there has been a change after the checkpoint start. Hence Y=30 or<br>
&emsp;&emsp;&emsp;Y=50. Page Z was in the DPT at LSN=10. Hence it can be any value.<br>
&emsp;(b) **\[4 points\]** Select all possible values of DPT in record 15.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☒ `Y`   ☒ `Z`   ☒ `Y,` `Z`   ☒ **Empty**<br>
&emsp;&emsp;&emsp;☐  `X`   ☐  `X,` `Y`   ☐  `X,` `Z`   ☐  `X,` `Y,` `Z`<br>
&emsp;&emsp;&emsp;**Solution:** Dirty pages at LSN=15: Y and Z (we know X was clean). Since the system<br>
&emsp;&emsp;&emsp;can flush dirty pages at any time, any subset of Y, Z is possible.


### Question 1 continues...


---

<a id="page-3"></a>
**Page 3**

15-445/645 (Spring 2025)   Homework #6   Page 3 of 10

&emsp;(c) **\[4 points\]** For the next 3 questions, assume that the database restarts and finds all log<br>
&emsp;&emsp;&emsp;records up to LSN 19 in the WAL. Also assume the DPT is {`Z` `(recLSN=5)`} at LSN 15.<br>
&emsp;&emsp;&emsp;According to the ARIES recovery protocol, which **log records** need to be redone during<br>
&emsp;&emsp;&emsp;the **redo phase** of recovery? Select all that apply.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ `[LSN` `5]` `<T3,` `UPDATE,` `Z,` `700`→`800>`<br>
&emsp;&emsp;&emsp;☐  `[LSN` `4]` `<T1,` `UPDATE,` `X,` `5`→`15>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ `[LSN` `9]` `<T1,` `UPDATE,` `Z,` `800`→`900>`<br>
&emsp;&emsp;&emsp;☐  `[LSN` `8]` `<T2,` `UPDATE,` `Y,` `30`→`50>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ `[LSN` `16]` `<T2,` `UPDATE,` `X,` `15`→`25>`<br>
&emsp;&emsp;&emsp;☐  `[LSN` `11]` `<T2,` `UPDATE,` `Y,` `50`→`60>`<br>
&emsp;&emsp;&emsp;☒ `[LSN` `17]` `<T2,` `UPDATE,` `Y,` `60`→`70>`   ☒ `[LSN` `19]` `<T2,` `CLR,` `Y,` `70`→`60>`<br>
&emsp;&emsp;&emsp;**Solution:** After building the DPT, we get the following state: {`X` `(recLSN=16)`}`,` {`Y`<br>
&emsp;&emsp;&emsp;`(recLSN=17)`}`,` {`Z` `(recLSN=5)`} We redo all LSNs ≥16 for X, LSNs ≥17 for Y, and<br>
&emsp;&emsp;&emsp;LSNs ≥5 for Z.<br>
&emsp;(d) **\[4 points\]** Select all transactions that should be undone during recovery.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ `T2`<br>
&emsp;&emsp;&emsp;☐  `T1`   ☐  `T3`   ☐  None of them<br>
&emsp;&emsp;&emsp;**Solution:** T2 was aborted but not ended, so it will be undone during recovery.<br>
&emsp;(e) **\[4 points\]** How many new CLR records will be appended to the WAL after the database<br>
&emsp;&emsp;&emsp;fully recovers?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **3**<br>
&emsp;&emsp;&emsp;☐  0   ☐  1   ☐  2   ☐  4   ☐  5   ☐  6<br>
&emsp;&emsp;&emsp;**Solution:** LSNs 16, 11, and 8 still need to be undone.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #6 continues...


---

<a id="page-4"></a>
**Page 4**

15-445/645 (Spring 2025)   Homework #6   Page 4 of 10


### **Question 2: Two-Phase Commit . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . \[24 points\]**

&emsp;Consider a distributed transaction T operating under the two-phase commit protocol with the<br>
&emsp;**early acknowledgement optimization**. Let N0 be the coordinator node, and N1, N2, N3 be the<br>
&emsp;participant nodes. Let the C be the client application issuing the transaction request. Assume<br>
&emsp;that the client communicates directly with the coordinator node. Assume that the coordinator<br>
&emsp;will treat a node that has failed to respond after **three** “`Phase1:PREPARE`” as dead.<br>
&emsp;The following messages have been sent:

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;time   message<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1C to N0: “`REQUEST:COMMIT`”<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2   N0 to N1: “`Phase1:PREPARE`”<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3N0 to N3: “`Phase1:PREPARE`”<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4   N0 to N2: “`Phase1:PREPARE`”<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;5   N3 to N0: “`OK`”<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;6   N0 to N1: “`Phase1:PREPARE`”<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;7   N1 to N0: “`OK`”<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;8N0 to N2: “`Phase1:PREPARE`”<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;9   N0 to N2: “`Phase1:PREPARE`”<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Figure 2: Two-Phase Commit messages for transaction T

&emsp;(a) **\[6 points\]** Who should send message(s) next at time 10 in Figure 2? Select all the<br>
&emsp;&emsp;&emsp;possible answers.<br>
&emsp;&emsp;&emsp;☐  C<br>
&emsp;&emsp;&emsp;☒ N0<br>
&emsp;&emsp;&emsp;☐  N1<br>
&emsp;&emsp;&emsp;☒ N2<br>
&emsp;&emsp;&emsp;☐  N3<br>
&emsp;&emsp;&emsp;☐  It is not possible to determine<br>
&emsp;&emsp;&emsp;**Solution:** There are two possible options. If N2 is alive, N2 needs to respond to N0<br>
&emsp;&emsp;&emsp;with a “`OK`” or “`ABORT`” message. Alternatively, N0 will decide T is dead and proceed to<br>
&emsp;&emsp;&emsp;the “`ABORT`” procedure.<br>
&emsp;(b) **\[6 points\]** Assume N2 responds “`OK`” at time 10, who does N0 send messages to at time<br>
&emsp;&emsp;&emsp;11? Select all the possible answers.<br>
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

15-445/645 (Spring 2025)   Homework #6   Page 5 of 10

&emsp;&emsp;&emsp;decision to commit. At this time N0 should also notify the client application since the<br>
&emsp;&emsp;&emsp;protocol is running with the early acknowledgement optimization.<br>
&emsp;(c) **\[6 points\]** Suppose that N0 decides to abort the transaction at time 10 in Figure 2. What<br>
&emsp;&emsp;&emsp;should happen under the two-phase commit protocol in this scenario? Select all that<br>
&emsp;&emsp;&emsp;applies.<br>
&emsp;&emsp;&emsp;☐  N0 resends “`Phase1:PREPARE`” to all of the participant nodes<br>
&emsp;&emsp;&emsp;☐  N0 sends “`ABORT`” to only N1 and N3<br>
&emsp;&emsp;&emsp;☒ N0 **sends “**`ABORT`**” to the client**<br>
&emsp;&emsp;&emsp;☒ N0 **sends “**`ABORT`**” to all of the participant nodes**<br>
&emsp;&emsp;&emsp;☐  N0 resends “`Phase1:PREPARE`” to N2<br>
&emsp;&emsp;&emsp;☐  N1 sends “`ABORT`” to N0<br>
&emsp;&emsp;&emsp;☐  It is not possible to determine<br>
&emsp;&emsp;&emsp;**Solution:** The coordinator (N0) will mark the transaction as aborted and send “`ABORT`”<br>
&emsp;&emsp;&emsp;message to the client and all of the participant nodes.<br>
&emsp;(d) **\[6 points\]** Again, suppose that N0 decides to abort the transaction at time 10, but N1<br>
&emsp;&emsp;&emsp;crashes before any further messages are delivered. What would N1 decide about the<br>
&emsp;&emsp;&emsp;status of the transaction T when it comes back on-line?<br>
&emsp;&emsp;&emsp;☐  T’s status is committed<br>
&emsp;&emsp;&emsp;☒ T**’s status is aborted**<br>
&emsp;&emsp;&emsp;☒ **It is not possible to determine**<br>
&emsp;&emsp;&emsp;**Solution:** Once the coordinator (N0) decides to abort the transaction, then the trans-<br>
&emsp;&emsp;&emsp;action is considered to be aborted even though a node may crash during the second<br>
&emsp;&emsp;&emsp;phase. In this example, N1 would consult the coordinator and finds out it should abort<br>
&emsp;&emsp;&emsp;T. NOTE: Another unintended interpretation of the question is that N1 needs to wait<br>
&emsp;&emsp;&emsp;until N0 comes back online to determine the status of T (hence, the answer would be “It<br>
&emsp;&emsp;&emsp;is not possible to determine”).

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #6 continues...


---

<a id="page-6"></a>
**Page 6**

15-445/645 (Spring 2025)   Homework #6   Page 6 of 10


### **Question 3: Distributed Query Plan . . . . . . . . . . . . . . . . . . . . . . . . . . . \[18 points\]**

&emsp;The CMU-DB team is optimizing distributed databases for aggregations and joins in their<br>
&emsp;new project, AutoDist. This project aims to enable efficient computation of distributed joins<br>
&emsp;followed by aggregations.<br>
&emsp;Given the following schema:

&emsp;&emsp;&emsp;&emsp;`CREATE` `TABLE` `artist(PRIMARY` `KEY` `a` `id` `INT,` `a` `name` `VARCHAR,`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`a` `nation` `INT);`<br>
&emsp;&emsp;&emsp;&emsp;`CREATE` `TABLE` `release(PRIMARY` `KEY` `r` `id` `INT,` `r` `name` `VARCHAR,`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`r` `artist` `INT,` `r` `year` `INT,` `r` `qty` `INT);`<br>
&emsp;&emsp;&emsp;&emsp;`CREATE` `TABLE` `nation(PRIMARY` `KEY` `n` `id` `INT,` `n` `name` `VARCHAR);`

&emsp;AutoDist partitions these tables across nodes based on the partition key. Consider the follow-<br>
&emsp;ing query:

&emsp;`SELECT` `nation.n` `name,` `SUM(release.r` `qty)`<br>
&emsp;`FROM` `artist`<br>
&emsp;`JOIN` `release` `ON` `artist.a` `id` `=` `release.r` `artist`<br>
&emsp;`JOIN` `nation` `ON` `artist.a` `nation` `=` `nation.n` `id`<br>
&emsp;`WHERE` `release.r` `year` `=` `2025`<br>
&emsp;`GROUP` `BY` `nation.n` `name;`

&emsp;You can make the following assumptions:<br>
&emsp;&emsp;1\. There are 8 nodes in the system. Each node can store up to 10,000 rows.<br>
&emsp;&emsp;2\. The `artist` table contains 20,000 rows.<br>
&emsp;&emsp;3\. The `release` table contains 40,000 rows, of which 8,000 are released in year 2025.<br>
&emsp;&emsp;4\. The `nation` table contains 100 rows.<br>
&emsp;(a) **\[5 points\]** Which data distribution strategy minimizes the total network data transfer for<br>
&emsp;&emsp;&emsp;the given query? Assume that if we choose to partition a table, its rows are distributed<br>
&emsp;&emsp;&emsp;evenly across the nodes.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  Partition `artist` table by `a` `id`, `release` table by `r` `id`, and `nation` table by<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`n` `id`.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  Partition `artist` table by `a` `id`, `release` table by `r` `artist`, and `nation` table<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;by `n` `id`.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  Partition `artist` table by `a` `id` and `release` table by `r` `id`, and replicate `nation`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;table across all nodes.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☒ **Partition** `artist` **table by** `a` `id` **and** `release` **table by** `r` `artist`**, and repli-**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**cate** `nation` **table across all nodes.**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  Partition `release` table by `r` `id`, and replicate `artist` and `nation` tables across<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;all nodes.


### Question 3 continues...


---

<a id="page-7"></a>
**Page 7**

15-445/645 (Spring 2025)   Homework #6   Page 7 of 10

&emsp;&emsp;&emsp;**Solution:** This strategy minimizes cross-node data transfer by localizing joins involving<br>
&emsp;&emsp;&emsp;`artist` and `release` to individual nodes and avoiding the need to transfer `nation` rows<br>
&emsp;&emsp;&emsp;across nodes by replicating them everywhere. Note that replicating the `artist` table is<br>
&emsp;&emsp;&emsp;impossible as it exceeds the capacity of each node. NOTE: This question was glitched<br>
&emsp;&emsp;&emsp;on Gradescope, so we gave full credit to everyone.<br>
&emsp;(b) **\[5 points\]** Assuming the selected strategy from question (a) is implemented, what is the<br>
&emsp;&emsp;&emsp;estimated total data transferred over the network for the given query? Assume that only<br>
&emsp;&emsp;&emsp;the central node can perform aggregations.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  Less than 5,000 rows<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☒ **Between 5,001 to 25,000 rows**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  Between 25,001 to 100,000 rows<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  More than 100,000 rows<br>
&emsp;&emsp;&emsp;**Solution:** Given that `nation` data are replicated across all nodes and joins are localized,<br>
&emsp;&emsp;&emsp;the data transfer will be the result of all local joins. Worst case scenario is the max<br>
&emsp;&emsp;&emsp;cardinality of the join output: 8,000 rows. If the local join results are distributed evenly,<br>
&emsp;&emsp;&emsp;the number becomes 7,000 rows.<br>
&emsp;(c) **\[5 points\]** If AutoDist introduces a feature that allows each node to compute a partial<br>
&emsp;&emsp;&emsp;aggregation before sending it to the central node for final aggregation, what is the new<br>
&emsp;&emsp;&emsp;estimated total network data transfer?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☒ **Less than 5,000 rows**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  Between 5,001 to 25,000 rows<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  Between 25,001 to 100,000 rows<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  More than 100,000 rows<br>
&emsp;&emsp;&emsp;**Solution:** Here, the only data transfer will be the result of local aggregations needing<br>
&emsp;&emsp;&emsp;to be combined at a central node for final computation. Since we have 8 nodes and 100<br>
&emsp;&emsp;&emsp;rows in `nation`, this translates into an upper bound of 800 row transfers.<br>
&emsp;(d) **\[3 points\]** What are the primary drawbacks of implementing a feature that allows for<br>
&emsp;&emsp;&emsp;intermediate aggregation results to be computed on each node before sending these results<br>
&emsp;&emsp;&emsp;to a central node for final aggregation? Consider the impact on system resources. Select<br>
&emsp;&emsp;&emsp;all that apply.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☒ **It increases the computational load on each node.**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☒ **It increases the memory usage on each node for storing the intermediate**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**results.**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  It increases the total disk usage for storing the persistent tables.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  It increases the amount of data transferred over the network.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  It decreases the overall system performance.


### Question 3 continues...


---

<a id="page-8"></a>
**Page 8**

15-445/645 (Spring 2025)   Homework #6   Page 8 of 10

&emsp;&emsp;&emsp;**Solution:** Performing intermediate aggregations locally increases each node’s compu-<br>
&emsp;&emsp;&emsp;tational load and memory usage, as they must handle and store aggregation results.<br>
&emsp;&emsp;&emsp;This method reduces network traffic but demands more computational and memory re-<br>
&emsp;&emsp;&emsp;sources.<br>
&emsp;&emsp;&emsp;The third option is incorrect since the amount of persistent data is determined by the<br>
&emsp;&emsp;&emsp;partitioning strategy, not by the intermediate aggregation feature. The fourth option is<br>
&emsp;&emsp;&emsp;incorrect since the goal is to decrease data transfer. The last option is too general; local<br>
&emsp;&emsp;&emsp;aggregations often enhance performance by easing network demands.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #6 continues...


---

<a id="page-9"></a>
**Page 9**

15-445/645 (Spring 2025)   Homework #6   Page 9 of 10


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

15-445/645 (Spring 2025)   Homework #6   Page 10 of 10<br>
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

