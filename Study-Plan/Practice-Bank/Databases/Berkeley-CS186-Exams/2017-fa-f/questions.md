# Berkeley CS186 Fall 2017: Final: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/186>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;CS 186/286 Fall 2017 Final Exam<br>
• Do not turn this page until instructed to start the exam.<br>
• You should receive 1 answer sheet and a 15-page exam packet.<br>
• All answers should be written on the answer sheet. The exam packet will be collected but not graded.<br>
• You have 3 hours to complete the final.<br>
• The midterm has 8 questions, each with multiple parts.<br>
• For each question, place only your final answer on the answer sheet; do not show work.<br>
• For multiple choice questions, please fill in the bubble or box completely, **do not mark the box with**<br>
**an X or checkmark**.<br>
• Use the blank spaces in your exam for scratch paper.<br>
• You are allowed **two** 8.5” × 11” double-sided pages of notes.<br>
• No electronic devices are allowed.


---

<a id="page-2"></a>
**Page 2**

**1**   **Concurrency**<br>
Consider the following schedule of reads and writes to pages.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;1   2   3   4   5   6   7   8   9   10<br>
&emsp;&emsp;&emsp;T1   R(A)   W(A)   R(C)<br>
&emsp;&emsp;&emsp;T2   R(A)   R(C)<br>
&emsp;&emsp;&emsp;T3   R(C)   R(B)   W(B)<br>
&emsp;&emsp;&emsp;T4   R(C)   W(C)

**Conflicts**<br>
1\. (2 points) What edges are included in the **dependency graph** (not waits-for graph) for the above<br>
&emsp;schedule? A reference graph is provided for your convenience. The dotted edges represent all possible


![Figure on page 2](figures/questions-p02-fig01.png)

&emsp;graph of the schedule above.

&emsp;&emsp;&emsp;A. T4, T2, T1, T3<br>
&emsp;&emsp;&emsp;B. T3, T2, T4, T1<br>
&emsp;&emsp;&emsp;C. T3, T4, T2, T1<br>
&emsp;&emsp;&emsp;D. T1, T2, T4, T3<br>
&emsp;&emsp;&emsp;E. T1, T4, T2, T3<br>
&emsp;&emsp;&emsp;F. None of the above<br>
3\. (2.5 points) Mark all statements that are true.

&emsp;&emsp;&emsp;D. Both Strict 2PL and 2PL enforce conflict serializability.<br>
&emsp;&emsp;&emsp;E. All schedules that are conflict serializable are view serializable.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 2 of 15


---

<a id="page-3"></a>
**Page 3**

**Dealing with Deadlock**<br>
For the following sequence of lock requests, assume T1 is older than T2, and T2 is older than T3. The oldest<br>
transaction has the highest priority. No locks are released in the time frame shown. Note that not all requests<br>
may actually be issued—in some cases the transaction is still blocked waiting for a prior request.<br>
&emsp;Consider the following schedule of lock requests:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1   2   3   4   5   6   7   8   9<br>
&emsp;&emsp;&emsp;&emsp;&emsp;T1   X(D)   S(A)   S(C)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;T2   X(A)   S(B)   S(D)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;T3   S(B)   X(B)   S(C)<br>
4\. (1 point) The above schedule could not successfully occur whether one uses deadlock avoidance or not.<br>
&emsp;Suppose we are not using any deadlock avoidance algorithms. List the time steps in the schedule above<br>
&emsp;in which the lock request could not have been made: i.e. timesteps when the requesting transaction would<br>
&emsp;have been blocked waiting for a previous lock request.<br>
5\. (1 point) Assuming we do not use deadlock avoidance, what is the first time step when deadlock will<br>
&emsp;occur?<br>
6\. (1 point) Mark the transactions involved in the first deadlock.<br>
7\. (1 point) If we were using the wound-wait deadlock avoidance algorithm, what would happen at time<br>
&emsp;step 3?<br>
&emsp;&emsp;&emsp;A. The transaction requesting the lock would wait<br>
&emsp;&emsp;&emsp;B. The transaction requesting the lock would abort<br>
&emsp;&emsp;&emsp;C. The transaction that holds the lock would abort

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 3 of 15


---

<a id="page-4"></a>
**Page 4**

**2**   **Recovery**<br>
1\. (0.5 points) Which buffer management policy would allow us to maximize efficiency in terms of speed?

&emsp;&emsp;&emsp;A. STEAL, NO FORCE   C. NO STEAL, FORCE<br>
&emsp;&emsp;&emsp;B. STEAL, FORCE   D. NO STEAL, NO FORCE

2\. (0.5 points) True or False? In ARIES recovery, after the analysis phase, the recLSN of each page in the<br>
&emsp;dirty page table must be larger than the pageLSN of the corresponding page.<br>
3\. (2 points) Select all the correct statements that are true about ARIES.<br>
&emsp;&emsp;&emsp;A. CLRs are never undone during ARIES recovery.<br>
&emsp;&emsp;&emsp;B. We remove a page from the dirty page table each time we write a CLR to the log.<br>
&emsp;&emsp;&emsp;C. The transaction table and dirty page table in the End Checkpoint record are up-to-date as of<br>
&emsp;&emsp;&emsp;&emsp;the time when the End Checkpoint record was logged.<br>
&emsp;&emsp;&emsp;D. ARIES never causes a database disk page to be overwritten by a page with the same PageLSN.<br>
4\. (0.5 points) True or False: Regardless of the number of times we run recovery, each UPDATE in the log<br>
&emsp;will have at most one matching CLR record in the log.<br>
5\. (1 point) Why would the undoNextLSN field in a CLR be marked null?<br>
&emsp;&emsp;&emsp;A. If the transaction committed.<br>
&emsp;&emsp;&emsp;B. If this CLR corresponds to the lowest UPDATE LSN of the transaction<br>
&emsp;&emsp;&emsp;C. If this CLR corresponds to the highest UPDATE LSN of the transaction<br>
&emsp;&emsp;&emsp;D. If this CLR was the highest LSN flushed at the time of crash.<br>
&emsp;&emsp;&emsp;E. If this CLR corresponds to a page that was flushed before the checkpoint.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 4 of 15


---

<a id="page-5"></a>
**Page 5**

Now consider the following log records which are recovered after a crash.<br>
&emsp;&emsp;&emsp;&emsp;**LSN**   **Record**   **PrevLSN**<br>
&emsp;&emsp;&emsp;&emsp;...   ...   ...<br>
&emsp;&emsp;&emsp;&emsp;40   UPDATE: T3 writes P4   null<br>
&emsp;&emsp;&emsp;&emsp;50   UPDATE: T2 writes P3   null<br>
&emsp;&emsp;&emsp;&emsp;60   Begin Checkpoint   -<br>
&emsp;&emsp;&emsp;&emsp;70   End Checkpoint   -<br>
&emsp;&emsp;&emsp;&emsp;80   UPDATE: T1 writes P1   null<br>
&emsp;&emsp;&emsp;&emsp;90   UPDATE: T3 writes P5   40<br>
&emsp;&emsp;&emsp;&emsp;100   UPDATE: T3 writes P2   90<br>
&emsp;&emsp;&emsp;&emsp;110   UPDATE: T2 writes P1   50<br>
&emsp;&emsp;&emsp;&emsp;120   T3 Commit   100<br>
&emsp;&emsp;&emsp;&emsp;130   T3 End   120<br>
&emsp;&emsp;&emsp;&emsp;140   UPDATE: T1 writes P5   80<br>
&emsp;&emsp;&emsp;&emsp;150   T1 Abort   140<br>
&emsp;&emsp;&emsp;&emsp;160   CLR: Undo write to P5 (T1, LSN 140), undoNextLSN: 80   150<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CRASH!<br>
The following dirty page table and transaction table are read from the checkpoint:<br>
&emsp;&emsp;&emsp;**Transaction Table**   **Dirty Page Table**<br>
&emsp;&emsp;&emsp;&emsp;**Transaction**   **Status**   **lastLSN**   **Page**   **recLSN**<br>
&emsp;&emsp;&emsp;&emsp;T2   Running   50   P4   40<br>
&emsp;&emsp;&emsp;&emsp;T3   Running   40<br>
6\. (1 point) Assume that at the end of the Analysis phase, we convert all Running status to Aborting in the<br>
&emsp;transaction table. For each transaction, give its status in the transaction table at the end of the analysis<br>
&emsp;phase. List its status as “A” if the transaction is Aborting and “C” if the transaction is Committing. If<br>
&emsp;a transaction is **NOT** in the transaction table, list its status as “0”.<br>
7\. (2.5 points) For each page referenced in the log, give its recLSN in the dirty page table at the end of<br>
&emsp;the analysis phase. If a page is **NOT** in the dirty page table, list its recLSN as “0”. Assume the buffer<br>
&emsp;manager does not flush any pages during recovery.<br>
8\. (1 point) Mark the LSNs of the records that will actually be redone in the redo phase (i.e. that will<br>
&emsp;require us to update a database page).<br>
9\. (1 point) Mark the LSNs of the UPDATE records that we write CLRs for during the undo phase.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 5 of 15


---

<a id="page-6"></a>
**Page 6**

**3**   **Two-Phase Commit**


![Figure on page 6](figures/questions-p06-fig02.png)

Our database runs on 4 machines and uses Two-Phase Commit.   Ma-<br>
chine 1 is the Coordinator, while Machines 2, 3, and 4 are Partici-<br>
pants.

Suppose our machines are connected such that the time it takes to send<br>
a message from Machine i to Machine j is 100·max(i, j) milliseconds (see<br>
graph). Assume these communication latencies are symmetric: it takes<br>
the same amount of time to send from i to j as it takes to send from j<br>
to i. For example, sending a message between Machine 2 and Machine 4<br>
takes 400 milliseconds in either direction.

Assume that the transaction will commit (i.e. all subordinates vote yes),<br>
and that everything is instantaneous except for the time spent sending<br>
messages between two machines.<br>
1\. (0.25 points) What is the first message Machine 1 sends?

&emsp;&emsp;&emsp;A. VOTE YES   B. PREPARE   C. COMMIT   D. None of these

2\. (0.25 points) What is the second message Machine 1 sends?

&emsp;&emsp;&emsp;A. VOTE YES   B. PREPARE   C. COMMIT   D. None of these

3\. (1 point) How much time passes from when Machine 1 sends its first message to when Machine 1 sends<br>
&emsp;its second message?<br>
4\. (0.25 points) What is the first message Machine 2 sends?

&emsp;&emsp;&emsp;A. VOTE YES   B. PREPARE   C. COMMIT   D. None of these

5\. (0.25 points) What is the second message Machine 2 sends?

&emsp;&emsp;&emsp;A. VOTE YES   B. PREPARE   C. COMMIT   D. None of these

6\. (1 point) How much time passes from when Machine 2 sends its first message to when Machine 2 sends<br>
&emsp;its second message?<br>
7\. (0.5 points) True or False. A transaction is considered committed even if over half of the participants<br>
&emsp;do not acknowledge the commit.<br>
Now suppose that our implementation of 2-Phase Commit has an off-by-one bug where the Coordinator<br>
receives, but does not use, Machine 4’s vote. That is, Machine 4’s vote does not affect whether or not the<br>
transaction commits or aborts.<br>
8\. (0.5 points) True or False. A transaction that should normally commit may be aborted instead.<br>
9\. (0.5 points) True or False. A transaction that should normally abort may be committed instead.<br>
10\. (0.5 points) True or False. A transaction that should normally commit may be committed properly.<br>
11\. (0.5 points) True or False. A transaction that should normally abort may be aborted properly.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 6 of 15


---

<a id="page-7"></a>
**Page 7**

**4**   **Joins**<br>
**4.1**   **Young Justice... again**<br>
For the following questions in this section, assume that we are streaming our query output to a terminal.<br>
(Do not consider the cost of writing the final output)

`CREATE` `TABLE` `JusticeLeague` `(`<br>
&emsp;`member_id` `INTEGER` `PRIMARY` `KEY,`<br>
&emsp;`code_name` `CHAR(33),`<br>
&emsp;`birth_planet` `CHAR(20),`<br>
&emsp;`power_level` `INTEGER`<br>
`);`

`CREATE` `TABLE` `Teaches` `(`<br>
&emsp;`member_id` `INTEGER` `PRIMARY` `KEY` `REFERENCES` `JusticeLeague,`<br>
&emsp;`teacher_id` `INTEGER` `REFERENCES` `JusticeLeague,`<br>
&emsp;`since` `DATE`<br>
`);`<br>
&emsp;We assume that<br>
&emsp;• JusticeLeague has \[J\] = 100 pages<br>
&emsp;• JusticeLeague has \|J\| = 1000 members<br>
&emsp;• Teaches has \[T\] = 200 pages<br>
&emsp;• Teaches has \|T\| = 2000 members<br>
&emsp;• Buffer size = 12 pages<br>
&emsp;• An Alternative-1 B+ tree for Teaches indexed on `T.member` `id` has the height 2. In this problem, we<br>
&emsp;interpret height as the number of I/Os it takes to travel from the root to the leaf page.<br>
1\. (2 points) What is the I/O cost of using Index Nested Loop Join to perform a natural join of Teaches and<br>
&emsp;JusticeLeague? Consider table JusticeLeague as the outer relation. Note that we want the actual cost<br>
&emsp;in I/O requests, not a Selinger-style estimate. Treat each I/O request the same, regardless of whether<br>
&emsp;you think the request will hit in the buffer pool. Your answer must be a single integer.<br>
2\. (2 points) Assume we introduce an Alternative 2, clustered B+ tree for JusticeLeague indexed on<br>
&emsp;`member` `id` with height 2. What is the I/O cost of using Index Nested Loop Join to perform a nat-<br>
&emsp;ural join of Teaches and JusticeLeague? This time consider table Teaches as the outer relation. Your<br>
&emsp;answer must be a single integer.<br>
3\. (1 point) If the previous question’s B+ tree for JusticeLeague had used an unclustered index, would the<br>
&emsp;I/O cost have been different? (Answer only in Yes or No)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 7 of 15


---

<a id="page-8"></a>
**Page 8**

**4.2**   **General Join Algorithm Questions**

4\. (2 points) In this question, we explore the strengths and weaknesses of various join algorithms. Assume<br>
throughout that we are joining two tables R and S, and we have B buffers of memory for our join. Do<br>
not assume any additional information about the tables that is not explicitly provided.<br>
&emsp;(a) (1 point) We are performing an equijoin. \[R\] \< B, \[S\] \> B3. Which join algorithm will provide<br>
&emsp;&emsp;the correct answer with the fewest I/Os:<br>
&emsp;&emsp;&emsp;&emsp;A. Block Nested Loops Join<br>
&emsp;&emsp;&emsp;&emsp;B. Grace Hash Join<br>
&emsp;&emsp;&emsp;&emsp;C. Sort-Merge Join<br>
&emsp;(b) (1 point) We are performing an equijoin. B \< \[R\] \< (B −1)2, and B \< \[S\] \< (B −1)2. Both R<br>
&emsp;&emsp;and S have only 2 distinct values in the join key column. Which join algorithm will provide the<br>
&emsp;&emsp;correct answer with the fewest I/Os:<br>
&emsp;&emsp;&emsp;&emsp;A. Block Nested Loops Join<br>
&emsp;&emsp;&emsp;&emsp;B. Grace Hash Join<br>
&emsp;&emsp;&emsp;&emsp;C. Sort-Merge Join<br>
5\. (2 points) Consider the following “Index On Demand” join algorithm. Given an equijoin on tables R<br>
and S (with \[R\] \< \[S\]), but no indexes on the join columns initially, the algorithm will (a) bulk-load an<br>
Alternative-1 B+-tree on R, (b) perform an Index Nested Loops Join on S ▷◁R using the index, and<br>
(c) delete the index on R. Mark all of the following that you believe to be true for joining R and S,<br>
assuming B \< \[R\] \< \[S\] \< (B −1)2:<br>
&emsp;&emsp;A. This algorithm generates more I/Os than Grace Hash Join (without recursive partitioning).<br>
&emsp;&emsp;B. This algorithm generates more I/Os than a 2-pass Sort-Merge join.<br>
&emsp;&emsp;C. This algorithm generates more random I/Os than Block Nested Loops Join.<br>
&emsp;&emsp;D. If we omit step (c), this algorithm might be of interest for its benefits on subsequent queries,<br>
&emsp;&emsp;&emsp;even though it could be sub-optimal for the current query.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 8 of 15


---

<a id="page-9"></a>
**Page 9**

**5**   **Query Optimization**<br>
For the following questions, assume the following:<br>
&emsp;• The System R assumptions about uniformity and independence from lecture hold<br>
&emsp;• We use System R defaults when selectivity estimation is not possible<br>
&emsp;• Primary key IDs are sequential in each table, starting from 1, and there are no gaps in the ID sequence<br>
&emsp;in any table<br>
&emsp;• Our system implements only implements Grace Hash Join. It allocates 5 pages of memory for the join<br>
&emsp;operator.<br>
&emsp;• Assume all indices are alternative 3 indices.<br>
&emsp;• Assume the optimizer statistics are fully accurate w.r.t. the current content of the database.

**Table Schema**   **Records**   **Pages**   **Indices**<br>
`CREATE` `TABLE` `User` `(`<br>
&emsp;`uid` `INTEGER` `PRIMARY` `KEY,`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1,000   100   None<br>
&emsp;`fullname` `VARCHAR(32),`<br>
&emsp;`country` `VARCHAR(4))`<br>
`)`<br>
`CREATE` `TABLE` `Item` `(`<br>
&emsp;`sku` `INTEGER` `PRIMARY` `KEY,`   • Index 0: Unclustered Index on sku.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;10,000   1,000<br>
&emsp;`itemname` `VARCHAR(32),`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;• Index 1: Clustered Index price Low 0, High 100<br>
&emsp;`price` `NUMERIC`<br>
`)`<br>
`CREATE` `TABLE` `Order` `(`<br>
&emsp;`uid` `INTEGER` `REFERENCES` `User,`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;100,000   5,000   • Index 2: Clustered Index on uid<br>
&emsp;`sku` `INTEGER` `REFERENCES` `Item,`<br>
&emsp;`quantity`   `INTEGER)`<br>
`)`<br>
`CREATE` `TABLE` `Tax` `(`<br>
&emsp;`sku` `INTEGER` `PRIMARY` `KEY`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;10,000   1,000   None<br>
&emsp;&emsp;`REFERENCES` `Item,`<br>
&emsp;`taxrate` `NUMERIC`<br>
`)`

1\. (1 point) After applying the System R optimizer, which query has a lower estimated final cost for the<br>
&emsp;optimal query plan.

&emsp;&emsp;&emsp;A. `SELECT` `*`   B. `SELECT` `*`<br>
&emsp;&emsp;&emsp;&emsp;`FROM` `Item`   `FROM` `Item`<br>
&emsp;&emsp;&emsp;&emsp;`WHERE` `Item.itemname` `=` `’WidgetA’`   `WHERE` `Item.price` `<` `3`

2\. (1 point) After applying the System R optimizer, which query has a lower estimated final cost for the<br>
&emsp;optimal query plan.

&emsp;&emsp;&emsp;A. `SELECT` `*`   B. `SELECT` `*`<br>
&emsp;&emsp;&emsp;&emsp;`FROM` `Item`   `FROM` `Tax`<br>
&emsp;&emsp;&emsp;&emsp;`ORDER` `BY` `Item.price`   `ORDER` `BY` `Tax.taxrate`

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 9 of 15


---

<a id="page-10"></a>
**Page 10**

3\. (0.5 points) (True or False) The System R optimizer will apply a projection to the Tax table that<br>
preserves only the `taxrate` attribute before performing a join for the following query:<br>
&emsp;`SELECT` `taxrate`<br>
&emsp;`FROM` `Item,` `Tax`<br>
&emsp;`WHERE` `Tax.sku` `=` `Item.sku`

4\. (0.5 points) (True or False) For the following query, one can determine the cardinality of the join result<br>
(i.e the number of tuples in the result) exactly:<br>
&emsp;`SELECT` `taxrate`<br>
&emsp;`FROM` `Item,` `Tax`<br>
&emsp;`WHERE` `Tax.sku` `=` `Item.sku`

5\. (0.5 points) (True or False) In general, even if an eligible index exists, a sequential scan can be selected<br>
rather than an index scan.<br>
6\. (1.5 points) Consider the following query:<br>
&emsp;`SELECT` `*`<br>
&emsp;`FROM` `User,` `Order`<br>
&emsp;`WHERE` `User.uid` `=` `Order.uid` `AND`<br>
&emsp;&emsp;&emsp;`User.country` `=` `’USA’`<br>
During Pass 2 of the System R Optimizer, what is the estimated cost of executing the query using a<br>
Grace hash join? Be sure to include the cost of the heap scans and any other upstream operators.<br>
7\. (1 point) Consider the following query:<br>
&emsp;`SELECT` `*`<br>
&emsp;`FROM` `User,` `Order,` `Tax,` `Item`<br>
&emsp;`WHERE` `User.uid` `=` `Order.uid` `AND`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`Item.sku` `=` `Order.sku` `AND`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`Tax.sku` `=` `Item.sku` `AND`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`Tax.sku` `=` `Order.sku`<br>
Without making assumptions about costs and selectivities, which of the following join orders could<br>
**NEVER** be considered by the System R optimizer to answer this query? Mark all that apply<br>
&emsp;&emsp;A. (((User ▷◁Order) ▷◁Item) ▷◁Tax)<br>
&emsp;&emsp;B. (User ▷◁Order) ▷◁(Item ▷◁Tax)<br>
&emsp;&emsp;C. (((User ▷◁Item) ▷◁Order) ▷◁Tax)<br>
&emsp;&emsp;D. (((User ▷◁Order) ▷◁Tax) ▷◁Item)<br>
&emsp;&emsp;E. (((Tax ▷◁Item) ▷◁Order) ▷◁User)<br>
&emsp;&emsp;F. None of the above<br>
8\. (0.5 points) (True or False) Ignoring order by statements, group by statements, and nested queries, the<br>
System R optimizer is guaranteed to return the left-deep query plan with the lowest IO cost with respect<br>
to the estimated costs.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 10 of 15


---

<a id="page-11"></a>
**Page 11**

**6**   **SQL**<br>
Consider a table `Friend` representing a social network.   Each record of the Friend table consists of two<br>
integers corresponding to a friendship relationship between two users (identified by the id number). Assume<br>
that no person is friends with themselves.

`CREATE` `TABLE` `Friend(`<br>
&emsp;&emsp;`id1` `INTEGER,`<br>
&emsp;&emsp;`id2` `INTEGER,`<br>
&emsp;&emsp;`PRIMARY` `KEY` `(id1,id2));`<br>
1\. (1.5 points) Some of the friendship relationships in this table are not reciprocated, i.e., `(id1=a,id2=b)`<br>
&emsp;exists in the table but `(id1=b,id2=a)` does not exist. Which of the following SQL queries identifies all<br>
&emsp;tuples where the reciprocal relationship does not exist in the table. Mark all that apply.<br>
&emsp;&emsp;&emsp;A. `SELECT` `*`<br>
&emsp;&emsp;&emsp;&emsp;`FROM` `Friend` `f1`<br>
&emsp;&emsp;&emsp;&emsp;`WHERE` `NOT` `EXISTS` `(SELECT` `*`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`FROM` `Friend` `f2`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`WHERE` `f1.id1` `=` `f2.id2` `AND` `f1.id2` `=` `f2.id1)`

&emsp;&emsp;&emsp;B. `SELECT` `t.id1,` `t.id2`<br>
&emsp;&emsp;&emsp;&emsp;`FROM` `(`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`(SELECT` `id1,` `id2`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`FROM` `Friend` `f1)`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`UNION` `ALL`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`(SELECT` `f2.id2` `as` `id1,` `f2.id1` `as` `id2`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`FROM` `Friend` `f2)`<br>
&emsp;&emsp;&emsp;&emsp;`)` `as` `t`<br>
&emsp;&emsp;&emsp;&emsp;`GROUP` `BY` `t.id1,` `t.id2`<br>
&emsp;&emsp;&emsp;&emsp;`HAVING` `count(*)`   `<`   `2`

&emsp;&emsp;&emsp;C. `SELECT` `t.id1,` `t.id2`<br>
&emsp;&emsp;&emsp;&emsp;`FROM` `(`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`SELECT` `f2.id2` `as` `id1,` `f2.id1` `as` `id2`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`FROM` `Friend` `f2`<br>
&emsp;&emsp;&emsp;&emsp;`)` `as` `t` `FULL` `OUTER` `JOIN` `Friend`<br>
&emsp;&emsp;&emsp;&emsp;`ON` `t.id1` `=` `Friend.id1` `AND` `t.id2` `=` `Friend.id2` `AND` `Friend.id1` `<>` `NULL`<br>
&emsp;&emsp;&emsp;D. None of the above<br>
2\. (1 point) Consider the same table, but without the primary key constraint. Continue to assume that<br>
&emsp;no person is friends with themselves.<br>
&emsp;`CREATE` `TABLE` `Friend(`<br>
&emsp;&emsp;&emsp;`id1` `INTEGER,`<br>
&emsp;&emsp;&emsp;`id2` `INTEGER);`<br>
&emsp;This table can contain multiple copies of the same friendship relationship, e.g., two tuples with `(id1=a,id2=b)`.<br>
&emsp;Therefore, each distinct `(id1=a,id2=b)` pair will have a count of the number of times it occurs in the<br>
&emsp;relation. We want to write a query that finds all distinct pairs where the count of `(id1=a,id2=b)` is not<br>
&emsp;equal to the count of `(id1=b,id2=a)`. Mark all that apply.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 11 of 15


---

<a id="page-12"></a>
**Page 12**

&emsp;&emsp;A. `SELECT` `id1,` `id2,` `count(*)`   C. `(SELECT` `id1,` `id2,` `count(*)`<br>
&emsp;&emsp;&emsp;`FROM` `Friend`   `FROM` `Friend`<br>
&emsp;&emsp;&emsp;`GROUP` `BY` `id1,` `id2`   `GROUP` `BY` `id1,` `id2`

&emsp;&emsp;&emsp;`EXCEPT`   `EXCEPT`

&emsp;&emsp;&emsp;`SELECT` `id2,` `id1,` `count(*)`   `SELECT` `id2,` `id1,` `count(*)`<br>
&emsp;&emsp;&emsp;`FROM` `Friend`   `FROM` `Friend`<br>
&emsp;&emsp;&emsp;`GROUP` `BY` `id1,` `id2`   `GROUP` `BY` `id1,` `id2)`

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`UNION` `ALL`

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`(SELECT` `id2,` `id1,` `count(*)`<br>
&emsp;&emsp;B. `SELECT` `id1,` `id2,` `count(*)`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`FROM` `Friend`<br>
&emsp;&emsp;&emsp;`FROM` `Friend`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`GROUP` `BY` `id1,` `id2`<br>
&emsp;&emsp;&emsp;`GROUP` `BY` `id1,` `id2`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`EXCEPT`<br>
&emsp;&emsp;&emsp;`EXCEPT` `ALL`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`SELECT` `id1,` `id2,` `count(*)`<br>
&emsp;&emsp;&emsp;`SELECT` `id2,` `id1,` `count(*)`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`FROM` `Friend`<br>
&emsp;&emsp;&emsp;`FROM` `Friend`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`GROUP` `BY` `id1,` `id2)`<br>
&emsp;&emsp;&emsp;`GROUP` `BY` `id1,` `id2`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;D. None of the above

3\. (1.5 points) Assume the following `Friend` table with the primary key constraint.<br>
&emsp;`CREATE` `TABLE` `Friend(`<br>
&emsp;&emsp;&emsp;`id1` `INTEGER,`<br>
&emsp;&emsp;&emsp;`id2` `INTEGER,`<br>
&emsp;&emsp;&emsp;`PRIMARY` `KEY` `(id1,id2));`<br>
A “triangle” of friends is defined as Person a is friends with Person b, Person b is friends with Person c,<br>
and Person c is friends with Person a. Which of the following queries lists of all of the distinct triangles<br>
output in alphabetical order—i.e., if a, b, c is in the result then c, a, b should not be in the result. Mark<br>
all that apply.

&emsp;&emsp;A. `SELECT` `f1.id1,` `f2.id1,` `f3.id1`   C. `SELECT` `f1.id1,` `f2.id1,` `f3.id1`<br>
&emsp;&emsp;&emsp;`FROM` `Friend` `f1,` `Friend` `f2,` `Friend`   `FROM` `Friend` `f1,` `Friend` `f2,` `Friend`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`f3`   `f3`<br>
&emsp;&emsp;&emsp;`WHERE` `f1.id2` `=` `f2.id1` `AND`   `WHERE` `f1.id2` `=` `f2.id1` `AND`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`f2.id2` `=` `f3.id1` `AND`   `f2.id2` `=` `f3.id1` `AND`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`f3.id2` `=` `f1.id1` `AND`   `f3.id2` `=` `f1.id1` `AND`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`f1.id1` `<` `f2.id1` `AND`   `f1.id1` `<` `f2.id1` `AND`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`f2.id1` `>` `f3.id1`   `f2.id1` `<` `f3.id1`<br>
&emsp;&emsp;B. `SELECT` `f1.id1,` `f2.id1,` `f3.id1`   D. None of the above<br>
&emsp;&emsp;&emsp;`FROM` `Friend` `f1,` `Friend` `f2,` `Friend`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`f3`<br>
&emsp;&emsp;&emsp;`WHERE` `f1.id2` `=` `f2.id1` `AND`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`f2.id2` `=` `f3.id1` `AND`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`f3.id2` `=` `f1.id1`

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 12 of 15


---

<a id="page-13"></a>
**Page 13**

**7**   **Replication**<br>
1\. (3 points) Which of the following are reasons to replicate data:<br>
&emsp;&emsp;&emsp;A. To increase the odds that some node will be able to respond to any request at any given time<br>
&emsp;&emsp;&emsp;B. To allow multiple nodes to split up the work for a large volume of requests.<br>
&emsp;&emsp;&emsp;C. To reduce latency by allowing clients to fetch data from a nearby server<br>
&emsp;&emsp;&emsp;D. To handle ever-increasing database sizes.<br>
&emsp;&emsp;&emsp;E. To hide transient performance problems.<br>
&emsp;&emsp;&emsp;F. To recover from failures.<br>
2\. (2 points) Consider a single-master system that performs 2PC upon transaction commit. Which of the<br>
&emsp;following problems could occur in a single-master system, but are prevented by 2PC?<br>
&emsp;&emsp;&emsp;A. The standby node may have an older value for some key than the master.<br>
&emsp;&emsp;&emsp;B. Transactions could commit while the standby node has failed.<br>
&emsp;&emsp;&emsp;C. The standby node may have processed an update that conflicts with the master node.<br>
&emsp;&emsp;&emsp;D. The master node may fail and block progress.<br>
3\. (2 points) Which of the following drawbacks are true of 2PC-controlled replication?<br>
&emsp;&emsp;&emsp;A. If it is not strict 2PC, you could get cascading aborts.<br>
&emsp;&emsp;&emsp;B. A failed participant node can cause live nodes to abort.<br>
&emsp;&emsp;&emsp;C. A failed coordinator node can freeze up the entire system indefinitely.<br>
&emsp;&emsp;&emsp;D. Message latency for 2PC across wide-area networks can be high, and lead to slow transaction<br>
&emsp;&emsp;&emsp;&emsp;performance.<br>
4\. (0.5 points) True or False: In multi-master replication, it is possible for the system to get “split brain”:<br>
&emsp;two nodes may disagree about the value associated with some key.<br>
5\. (0.5 points) True or False: In the absence of 2PC, multi-master replication is a high-bandwidth approach<br>
&emsp;because many nodes can service writes to the same key in parallel, without sending each other messages.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 13 of 15


---

<a id="page-14"></a>
**Page 14**

**8**   **B+ Trees**<br>
**8.1**   **True/False**<br>
1\. (3 points) Mark all statements that are true.<br>
&emsp;&emsp;&emsp;A. A B+ tree is always balanced-height<br>
&emsp;&emsp;&emsp;B. The keys on an internal node are always in sorted order<br>
&emsp;&emsp;&emsp;C. A B+ tree built using bulk loading is always more bushy than a B+ trees built from standard<br>
&emsp;&emsp;&emsp;&emsp;insert operations<br>
&emsp;&emsp;&emsp;D. Alternative 3 is always better than alternative 2<br>
&emsp;&emsp;&emsp;E. The number of records in the table must be known before performing bulk loading<br>
&emsp;&emsp;&emsp;F. A leaf node can be a root node

**8.2**   **Best and Worst Case IOs**<br>
Consider an alternative 2 B+ tree index of height h = 3 and order d = 4. In this problem, the height of<br>
a tree corresponds to the number of I/Os to traverse to a leaf. Assume that the index key is the primary<br>
key of the table. Note that index pages include both leaf and non-leaf pages. The maximum number of leaf<br>
pages that can exist in this index is (2d + 1)3 = 729. The minimum number of leaf pages that can exist in<br>
this index is (d + 1)3 = 125.<br>
2\. (0.5 points) In the **worst case**, what is the **largest** number of index pages that will be **read** in an<br>
&emsp;equality search?

&emsp;&emsp;&emsp;A. 0   C. 3   E. 729   G. 732<br>
&emsp;&emsp;&emsp;B. 1   D. 4   F. 731   H. none of the above

3\. (0.5 points) In the **best case**, what is **fewest** number of index pages that will be **read** in an equality<br>
&emsp;search?

&emsp;&emsp;&emsp;A. 0   C. 3   E. 125   G. 128<br>
&emsp;&emsp;&emsp;B. 1   D. 4   F. 127   H. none of the above

4\. (0.5 points) In the **worst case**, what is the **largest** number of index pages that you will **write to**<br>
&emsp;during an insert? Include both existing index pages that are written to and index pages that are created<br>
&emsp;as part of the write in your answer.

&emsp;&emsp;&emsp;A. 2   C. 4   E. 6   G. 8<br>
&emsp;&emsp;&emsp;B. 3   D. 5   F. 7   H. none of the above

5\. (0.5 points) In the **best case**, what is the **fewest** number of index pages that you will **write to** during<br>
&emsp;an insert? Include both existing index pages that are written to and index pages that are created as<br>
&emsp;part of the write in your answer.

&emsp;&emsp;&emsp;A. 0   C. 2   E. 4   G. 6<br>
&emsp;&emsp;&emsp;B. 1   D. 3   F. 5   H. none of the above

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 14 of 15


---

<a id="page-15"></a>
**Page 15**

6\. (0.5 points) In the **worst case**, what is the **largest** number of index pages that will be **read** during a<br>
range search that returns exactly 7 records?

&emsp;&emsp;A. 2   C. 4   E. 6   G. 8<br>
&emsp;&emsp;B. 3   D. 5   F. 7   H. none of the above

7\. (0.5 points) In the **best case**, what is the **fewest** number of index pages that will be **read** during a<br>
range search that returns exactly 7 records?

&emsp;&emsp;A. 2   C. 4   E. 6   G. 8<br>
&emsp;&emsp;B. 3   D. 5   F. 7   H. none of the above

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 15 of 15

