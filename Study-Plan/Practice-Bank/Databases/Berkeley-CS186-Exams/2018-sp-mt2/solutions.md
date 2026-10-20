# Berkeley CS186 Spring 2018: Midterm 2: Official solutions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/186>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;CS 186/286 Spring 2018 Midterm 2<br>
• Do not turn this page until instructed to start the exam.<br>
• You should receive 1 single-page answer sheet and a 15-page exam packet.<br>
• All answers should be written on the answer sheet. The exam packet will be collected but not graded.<br>
• You have 80 minutes to complete the midterm.<br>
• The midterm has 4 questions, each with multiple parts.<br>
• The midterm is worth a total of 60 points.<br>
• For each question, place only your final answer on the answer sheet; do not show work.<br>
• For multiple choice questions, please fill in the bubble or box completely, **do not mark the box with**<br>
**an X or checkmark**.<br>
• Use the blank spaces in your exam for scratch paper.<br>
• You are allowed **one** 8.5” × 11” double-sided page of notes.<br>
• No electronic devices are allowed.


---

<a id="page-2"></a>
**Page 2**

**1**   **Joins (20 points)**

Note: Assume that when we write X ▷◁Y , X (on the left) is the outer, and Y (on the right) is the inner for<br>
the remainder of these questions.<br>
1\. (1 point) Suppose we do a Page-oriented Nested Loop Join on two tables, P and Q. We are told that<br>
&emsp;the same amount of pages are required to store P and Q, but Q has three times more records per page<br>
&emsp;than P, on average. Which one of the following options is true:<br>
&emsp;&emsp;&emsp;A. P ▷◁Q does fewer I/Os than Q ▷◁P.<br>
&emsp;&emsp;&emsp;B. Q ▷◁P does fewer I/Os than P ▷◁Q.<br>
&emsp;&emsp;&emsp;**C.** P ▷◁Q **does the same number of I/Os as** Q ▷◁P**.**

&emsp;**Solution:** What is the cost for PNLJ on P ▷◁Q? \[P\] ∗\[Q\] + \[P\].<br>
&emsp;What is the cost for PNLJ on Q ▷◁P? \[Q\] ∗\[P\] + \[Q\].<br>
&emsp;But we are told that \[P\] == \[Q\].<br>
&emsp;Therefore C.

2\. (5 points) Next, we consider a Simple Nested Loop Join on three tables: P, Q, and S.<br>
&emsp;&emsp;• Please use \[X\] to denote the number of pages of X, and {X} to denote the number of records in<br>
&emsp;&emsp;X (note the curly braces rather than vertical bars, for legibility).<br>
&emsp;&emsp;• Do not materialize intermediary results into a temporary table. Assume the results of a subplan<br>
&emsp;&emsp;are pipelined to the next operator.<br>
&emsp;&emsp;• Assume P ▷◁Q is foreign key to primary key join, and the following join with S is also a foriegn<br>
&emsp;&emsp;key to primary key join. The (non null) foreign keys are in P, and primary keys are in Q and S.

&emsp;(a) (1 point) What is the I/O cost for P ▷◁Q?

&emsp;&emsp;&emsp;**Solution:** {P} ∗\[Q\] + \[P\]

&emsp;(b) (1 point) What is the cardinality of P ▷◁Q?

&emsp;&emsp;&emsp;**Solution:** Every record in P has a single matching record in Q because of the foreign key to<br>
&emsp;&emsp;&emsp;primary key constraint. Thus, the result size is simply {P}.

&emsp;(c) (2 points) What is the I/O cost for (P ▷◁Q) ▷◁S?

&emsp;&emsp;&emsp;**Solution:** {P} ∗(\[Q\] + \[S\]) + \[P\]<br>
&emsp;&emsp;&emsp;This is the cost of P ▷◁Q plus {P ▷◁Q} ∗\[S\].<br>
&emsp;&emsp;&emsp;Using the result from above, this implies {P} ∗\[Q\] + \[P\] plus {P} ∗\[S\].<br>
&emsp;&emsp;&emsp;Therefore, {P} ∗(\[Q\] + \[S\]) + \[P\].

&emsp;(d) (1 point) What is the cardinality of (P ▷◁Q) ▷◁S?

&emsp;&emsp;&emsp;**Solution:** Every record in (P ▷◁Q) has a single matching record in S because of the foreign<br>
&emsp;&emsp;&emsp;key to primary key constraint between P and Q. Thus, the result size is {P}.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 2 of 15


---

<a id="page-3"></a>
**Page 3**

3\. (1 point) Which one of the following options is true about the IO cost of a self join (i.e. joining a table<br>
with itself)? Assume B ≫3 where B is the pages of memory available.<br>
&emsp;&emsp;A. IO(SNLJ) \> IO(PNLJ) ≥IO(BNLJ)<br>
&emsp;&emsp;B. IO(SNLJ) ≤IO(PNLJ) ≤IO(BNLJ)<br>
&emsp;&emsp;**C. IO(SNLJ)** ≥**IO(PNLJ)** ≥**IO(BNLJ)**<br>
&emsp;&emsp;D. IO(PNLJ) ≤IO(SNLJ) ≤IO(BNLJ)

&emsp;**Solution:** C. The I/O cost of BNLJ is guaranteed to be at least as good as PNLJ and SNLJ. PNLJ<br>
&emsp;is guaranteed to be at least as good as SNLJ.

4\. (3 points) Suppose there are two tables: R with 40 pages and S with 75 pages. What is the cost of<br>
sort-merge join between tables R and S? Assume the operator has 6 pages of RAM, and it is not writing<br>
the output to disk. Use the optimization from lecture if possible.

&emsp;**Solution:** After the first sorting pass —<br>
&emsp;There are 7 runs of R, 6 of 6 pages and 1 of 4 pages.<br>
&emsp;There are 13 runs of S, 12 of 6 pages and 1 of 3 pages.<br>
&emsp;After the second sorting pass –<br>
&emsp;There are 2 runs of R, 1 of 30 pages and 1 of 10 pages.<br>
&emsp;There are 3 runs of S, 2 of 30 pages and 1 of 15 pages.<br>
&emsp;Then —<br>
&emsp;We can merge R and S in the final pass because there are 5 total runs and 5 input buffers.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2 ∗2 ∗(\[R\] + \[S\]) + (\[R\] + \[S\]) = 4 ∗115 + 115 = 575

5\. (10 points) Suppose there are two tables: P and Q. Table P has 1,200 pages and 35 records per page.<br>
Table Q has 100 pages and 50 records per page. In this question, we consider an equality join P ▷◁Q.<br>
Assume that join key values are widely and uniformly distributed. That is, there is no skew. Also assume<br>
that although the join operator allocates 1 buffer for the output, it does not write the output to disk.

&emsp;(a) (1 point) What is the I/O cost of a grace hash join? Assume the join has 11 buffer pages of memory<br>
&emsp;&emsp;available.

&emsp;&emsp;&emsp;**Solution:** After pass 1, Q has 10 partitions of 10 pages each. There are only 9 pages for the<br>
&emsp;&emsp;&emsp;hash table, so it needs to do another pass over the data. Each pass is 2 ∗(\[Q\] + \[P\]) and the<br>
&emsp;&emsp;&emsp;last pass (build and probe) does not write to disk.<br>
&emsp;&emsp;&emsp;So, total I/O cost is: 5 ∗(\[Q\] + \[P\]) = 1300 ∗5 = 6500 I/Os.

&emsp;(b) (1 point) If we use a hybrid hash join, how many pages will be allocated for the hash table in<br>
&emsp;&emsp;the first phase assuming a fill factor of 0.9? Also assume the join has 32 buffer pages of memory<br>
&emsp;&emsp;available.

&emsp;&emsp;&emsp;**Solution:**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;k = (100 −(32 −2) ∗0.9)/(32 −.9 −2) = ceil(73/29.1) = 3<br>
&emsp;&emsp;&emsp;number of pages for the hash table = B-k-2 = 32-3-2 = 27

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 3 of 15


---

<a id="page-4"></a>
**Page 4**

(c) (3 points) How many I/Os will the first pass of the hybrid hash join incur?

&emsp;**Solution:** 2275 I/Os.<br>
&emsp;To read in P and Q, it will take 1200 + 100 = 1300 I/Os. Roughly, 1/4 of the data will hash<br>
&emsp;into memory, and the remainder into the 3 spilled partitions. So, 75 IOs to write 3 Q runs, and<br>
&emsp;900 to write 3 P runs.<br>
&emsp;The total cost of the first phase is 1300 + 900 + 75 = 2275 I/Os.

&emsp;Or —

&emsp;It starts with 1300 IOs.   If they used the method taught in section, .73 of the buffers will<br>
&emsp;spill to disk. So, 73 IOs to write 3 Q runs and 876 to write 3 R runs. Total = 2249 I/Os.

(d) (3 points) How many I/Os will the second pass of the hybrid hash join incur?

&emsp;**Solution:** 975 I/Os<br>
&emsp;To read in and join the remaining partitions on disk is 3 ∗25 = 75 IOs for Q, and 3 ∗300 = 900<br>
&emsp;for P. Thus, the total is 975 I/Os.

&emsp;Or —

&emsp;If we consider the method taught in section, it will be the time to process the remaining<br>
&emsp;partitions on disk. This is 876 + 73 = 949 I/Os.

(e) (2 points) Suppose we have an index on Q with a compound key whose prefix is the join key. It is<br>
&emsp;an alternative 2 clustered index with 40 leaf pages total. Assume that the upper levels of the tree<br>
&emsp;are cached with a few spare (extra) buffer pages in the cache. Also assume that the query needs no<br>
&emsp;additional columns from Q. Assume that the join key is a primary key in Q.<br>
&emsp;How many I/Os does INLJ take?

&emsp;**Solution:** This will be an index only plan. Each record in P will fetch a leaf page. There are<br>
&emsp;1200 ∗35 = 42, 000 records. So, this will take 1200 + 42, 000 = 43200 I/Os.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 4 of 15


---

<a id="page-5"></a>
**Page 5**

**2**   **Parallel Queries (8 points)**

The Jedi Order decides to create a database tracking all the Fighter Pilots, Sith Lords, and Jedi Masters<br>
throughout history. The order creates the following relations:<br>
&emsp;• `Jedi` (name, planet, padawan)<br>
&emsp;• `Sith` (name, planet, apprentice)<br>
&emsp;• `Pilot`(name, droid, plane, num fighters destroyed)<br>
And they are partitioned across 3 machines, each with B pages of memory in the following manner (note<br>
that the Jedi Order –mistakenly–assumes a uniform distribution for all values when partitioning):<br>
&emsp;• `Jedi`: Hash-partitioned on padawan over machines 1, 2, 3.<br>
&emsp;• `Sith`: Hash-partitioned on apprentice over machines 1, 2, 3.<br>
&emsp;• `Pilot`: Range-partitioned on num fighters destroyed over machines 1, 2, 3.<br>
1\. (1 point) The Jedi Order realizes its pilots are woefully inexperienced - 80% of them have<br>
&emsp;num fighters destroyed = 0, because they have never had any combat experience! Let us say that we<br>
&emsp;wish to do a parallel scan on this table. Let \[P\] denote the number of pages in `Pilot` and let T denote<br>
&emsp;the time taken for one I/O. How long will it take for a parallel scan to complete?<br>
&emsp;&emsp;&emsp;A. 1/3\*\[P\]\*T<br>
&emsp;&emsp;&emsp;B. \[P\]\*T<br>
&emsp;&emsp;&emsp;**C. 0.8 \* \[P\] \* T**<br>
&emsp;&emsp;&emsp;D. 0.2\*\[P\]\*T

&emsp;**Solution:** Because 80% of records will end up on the same machine, the longest time taken for<br>
&emsp;one of the machines to do a scan on its portion of the table will be 0.8 \* \[P\] \* T. Then, this is the<br>
&emsp;bottleneck, so it will take 0.8 \* \[P\] \* T time for the scan to complete

&emsp;The order knows that many of the Sith used to be Jedi, and so they decide to perform a hash-based join<br>
&emsp;on the `Jedi` and `Sith` tables to find who exactly is both Jedi and Sith. Assume that we join **only** on<br>
&emsp;the name field, that we are using perfect hash functions and that the distribution of name values is not<br>
&emsp;skewed for both `Jedi` and `Sith`. Let \[J\] be the number of pages in `Jedi` and \[S\] be the number of pages<br>
&emsp;in `Sith`, with \[S\] \< \[J\].<br>
2\. (1.5 points) Suppose we first wanted to remove duplicate entries in `Sith` using hashing. What is the<br>
&emsp;number of passes required to re-partition `Sith` across all 3 machines and de-duplicate the Sith records?<br>
&emsp;Include the shuffle phase in your calculations. Assume we are using the optimized variant of parallel<br>
&emsp;hashing in which shuffling the records is pipelined into the hashing operator. Assume the operator has<br>
&emsp;B buffer pages of available memory.<br>
&emsp;&emsp;&emsp;A. 2 + ⌈logB−1(⌈\[S\]<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;B ⌉)⌉<br>
&emsp;&emsp;&emsp;B. 2 + ⌈logB−1(⌈\[S\]<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3B ⌉)⌉<br>
&emsp;&emsp;&emsp;C. 1 + ⌈logB−1(⌈\[S\]<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;B ⌉)⌉<br>
&emsp;&emsp;&emsp;**D.** 1 + ⌈logB−1(⌈\[S\]<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3B ⌉)⌉

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 5 of 15


---

<a id="page-6"></a>
**Page 6**

&emsp;**Solution:** In the **optimized** version each machine will get \[S\]/3 pages. If S/3 is ≤B, we are done<br>
&emsp;with only 1 pass. Otherwise, we apply the single-machine hashing formula to a relation with \[S\]<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3B<br>
&emsp;pages to then get our answer of 1 + ⌈logB−1(⌈\[S\]<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3B ⌉)⌉

Now assume that the order introduces a new table called `padawans`, which tracks apprentice Jedi who<br>
aspire to (but are not yet) be Knights. Each Padawan has one master who trains them. The schema for<br>
padawans is as follows:

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`padawans` `(name,` `age,` `master)`

**Assume this table is round-robin partitioned across the 3 machines**. Now, assume that **60%**<br>
**of all padawans in the table have ”Yoda” as their master**. We wish to run the following query<br>
on the table:

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`SELECT` `*` `FROM` `padawans` `WHERE` `master` `=` `"Yoda"`

3\. (1 point) What is the time taken for the above query to complete, if each machine has B buffer pages<br>
and `padawans` has \[P\] pages in total? Let T denote the time taken for 1 I/O.<br>
&emsp;&emsp;3**\*\[P\]\*TA.**1<br>
&emsp;&emsp;B. 0.6\*\[P\]\*T<br>
&emsp;&emsp;C. \[P\]\*T<br>
&emsp;&emsp;D. 0.6\* \[P \]<br>
&emsp;&emsp;&emsp;&emsp;&emsp;B \*T

&emsp;**Solution:** Because this is round-robin partitioning and we are only dealing with a single table<br>
&emsp;lookup, we can just run the query locally on each of the 3 machines and concatenate the results.<br>
&emsp;Key skew will not be an issue because round-robin partitioning evenly distributes records across<br>
&emsp;machines irrespective of key skew.

4\. (1 point) If we wanted to sort padawans by the age key, whose values are uniformly distributed, what<br>
partitioning scheme would result in the fewest I/Os?<br>
&emsp;&emsp;A. Hash Partitioning on age<br>
&emsp;&emsp;B. Hash Partitioning on name<br>
&emsp;&emsp;C. Range Partitioning on name<br>
&emsp;&emsp;**D. Range Partitioning on age**

&emsp;**Solution:** Range partitioning will be the best for this, because we can individually sort on each of<br>
&emsp;the machines and concatenate the runs together at the end by appending one onto the other instead<br>
&emsp;of having to merge them like in another sorting pass.

5\. (1.5 points) Suppose we have time series of all monitoring events from all our fighter ships for the last<br>
2 years:

&emsp;&emsp;&emsp;`events(event` `time,` `event` `type,` `duration,` `ship` `id,` `pilot` `name,` `pilot` `rating)`

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 6 of 15


---

<a id="page-7"></a>
**Page 7**

These records tell us what is going on with our fighter fleet. To keep the fleet fighting aggressively, our<br>
engineers are constantly running queries over the latest data and for a specific event – the low fuel alert.<br>
Which partitioning scheme and physical design will achieve the best average latency if we have many<br>
engineers querying concurrently ?<br>
&emsp;&emsp;A. Hash partition on `event` `type` and clustered index on `event` `time`<br>
&emsp;&emsp;B. Range partition on `event` `time` and unclustered index on `event` `type`<br>
&emsp;&emsp;**C. Hash partition on** `(ship` `id,` `pilot` `name)` **and clustered index on** `(event` `time,` `event` `type)`

&emsp;&emsp;D. Range partition on `duration` and unclustered index on `event` `time`

&emsp;**Solution:** The queries will be spread across all machines, and they will quickly find the latest data.

6\. (2 points) True or False. Mark all of the true answers and leave all of the false ones blank.<br>
&emsp;&emsp;A. If we partition data using the round robin scheme and then perform some operations on the<br>
&emsp;&emsp;&emsp;data, every machine is guaranteed to have the same number of records ± 1 record.

&emsp;&emsp;&emsp;&emsp;**Solution:** False, deletes could remove from mainly one machine and we did not say they<br>
&emsp;&emsp;&emsp;&emsp;had to stay balanced

&emsp;&emsp;B. Range partitioning keeps data stored in sorted order on each machine.

&emsp;&emsp;&emsp;&emsp;**Solution:** False, data is partitioned according to range, but not stored in sorted order

&emsp;&emsp;C. A join over two tables that requires an asymmetric shuffle will incur fewer network I/Os than<br>
&emsp;&emsp;&emsp;one that requires a symmetric shuffle.

&emsp;&emsp;&emsp;&emsp;**Solution:** True

&emsp;&emsp;D. If data is partitioned using round robin, when searching for a record, we have to perform<br>
&emsp;&emsp;&emsp;broadcast lookup to only a subset of the machines.

&emsp;&emsp;&emsp;&emsp;**Solution:** False, must do it to all machines

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 7 of 15


---

<a id="page-8"></a>
**Page 8**

**3**   **Query Optimization (20 points)**

For this section, remember that **the height of a one level tree is defined to be 0, the height of a**<br>
**tree with two levels is defined to be 1, and so on.**

&emsp;Suppose the System R assumptions about uniformity and independence from lecture hold.   Assume<br>
&emsp;that costs are estimated as a number of I/Os, without differentiating random and sequential I/O cost.<br>
&emsp;Consider the following relational schema:<br>
&emsp;`Item` `(iid,` `name,` `price,` `popularity)`<br>
&emsp;`Store` `(sid,` `zip,` `city)`<br>
&emsp;`Sales` `(iid,` `sid,` `quantity)`

&emsp;Consider the following query:

&emsp;`SELECT` `name`<br>
&emsp;`FROM` `Item`<br>
&emsp;`WHERE` `price` `>=` `100` `AND` `price` `<` `200`

&emsp;Suppose we have the following statistics on table Item:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**tuples:** 5000, **tuples/page:** 100, **total pages:** 50, **price range:** 0 −4999

1\. (1 point) What is the estimate for the number of records output from this query?

&emsp;**Solution:** The selectivity factor for the prices in the range \[100,200) is 100/5000 = 1/50. So the<br>
&emsp;number of matching tuples in the table becomes 100/5000 × 5000 = 100 tuples.

2\. (1 point) If we build an unclustered alternative 2 B+-tree index of height 2 on Item.price and use an<br>
&emsp;index scan to process this query, what is the number of IOs incurred? Assume that that we only need<br>
&emsp;to read at most one leaf node and assume that we can cache the index.

&emsp;**Solution:** If we use the unclustered B+ tree index, it takes one IO to retrieve each tuple. Thus the<br>
&emsp;total IO cost is 3 + 100 = 103 I/Os.

3\. (1 point) True or False: If we build a clustered alternative 2 B+-tree index of height 2 on Item.price<br>
&emsp;and use an index scan to process this query, the number of IOs is less than the number of IOs required<br>
&emsp;for a sequential scan. Assume that that we only need to read at most one leaf node and assume that we<br>
&emsp;can cache the index.<br>
&emsp;&emsp;&emsp;**A. True**<br>
&emsp;&emsp;&emsp;B. False

&emsp;**Solution:** True. The number of matching tuples for the predicate is still 100 as above. However,<br>
&emsp;since we are using a clustered B+ tree index, it takes 1 IO to retrieve a page of sequential tuples.<br>
&emsp;Thus the total IO cost is 3+100/100 = 4 IOs, which is less than the 50 IOs required for a sequential<br>
&emsp;table scan.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 8 of 15


---

<a id="page-9"></a>
**Page 9**

Consider the following query with a histogram on Sales.quantity:

`SELECT` `name,` `price`<br>
`FROM` `Item,` `Store,` `Sales`<br>
`WHERE` `Item.iid` `=` `Sales.iid` `AND` `Store.sid` `=` `Sales.sid` `AND` `Sales.quantity` `>=` `100`<br>
`ORDER` `BY` `price`

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;0-100   100-200   200-300   300-400   400-500<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;15%   20%   20%   15%   30%<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Figure 1: Histogram on Sales.quantity.

4\. (1 point) True or False: Assume a sale always has a corresponding item and store. Applying a filter<br>
using the histogram on Sales.quantity before joining always yields a cheaper plan for this query.<br>
&emsp;&emsp;A. True<br>
&emsp;&emsp;**B. False**

&emsp;**Solution:** If Sales is the inner table when it is joined, then pushing the select down would not<br>
&emsp;reduce the I/O cost unless we materialized the results.

5\. (1 point) Based on the histogram on Sales.quantity, what is the selectivity for Sales.quantity \>= 100 ?<br>
Assume that the histogram boundaries are left inclusive and right exclusive.

&emsp;**Solution:** 1 −.15 = .85.

6\. (1 point) True or False: The reason System R optimizer will not consider joining two tables with no<br>
join predicate (i.e. performing a Cartesian product) is because these plans will always be suboptimal.<br>
&emsp;&emsp;A. True<br>
&emsp;&emsp;**B. False**

&emsp;**Solution:** False. Sometimes a Cartesian product does result in an optimal plan. For the most part,<br>
&emsp;however, it doesn’t so Selinger optimizer prunes these plans to reduce search space.

7\. (2 points) Suppose we have the following list of 2 table subplans and their costs. Mark the letters of<br>
the plans that will be chosen by the optimizer. Ignore interesting orders.<br>
&emsp;&emsp;A. Item ▷◁Sales (2,000 IO)<br>
&emsp;&emsp;**B. Sales** ▷◁**Item (1,500 IO)**<br>
&emsp;&emsp;**C. Store** ▷◁**Sales (3,000 IO)**<br>
&emsp;&emsp;D. Sales ▷◁Store (4,000 IO)

&emsp;**Solution:** Plans B and C will be chosen. Since Plans A and B both join the same sets of tables,<br>
&emsp;we retain B over A because it has a cheaper IO cost. The same reasoning applies when we decide<br>
&emsp;to retain Plan C over Plan D.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 9 of 15


---

<a id="page-10"></a>
**Page 10**

8\. (4 points) Based on the plans that were retained in the last pass (the previous question), now suppose we<br>
have the following list of 3 table access plans and their costs. Mark the letters for all 3 table access plans<br>
that would be considered by the optimizer and write down the letter of the final query plan that will<br>
be chosen. (Cost given are cumulative for the full query. Again, ignore interesting orders in formulating<br>
your answer.)<br>
&emsp;&emsp;A. (Item ▷◁Sales) ▷◁Store (2,500,000 IO)<br>
&emsp;&emsp;**B. (Sales** ▷◁**Item)** ▷◁**Store (2,000,000 IO)**<br>
&emsp;&emsp;C. Store ▷◁(Item ▷◁Sales) (1,800,000 IO)<br>
&emsp;&emsp;D. Store ▷◁(Sales ▷◁Item) (1,500,000 IO)<br>
&emsp;&emsp;E. (Sales ▷◁Store) ▷◁Item (4,500,000 IO)<br>
&emsp;&emsp;**F. (Store** ▷◁**Sales)** ▷◁**Item (3,500,000 IO)**<br>
&emsp;&emsp;G. Item ▷◁(Sales ▷◁Store) (3,000,000 IO)<br>
&emsp;&emsp;H. Item ▷◁(Store ▷◁Sales) (2,800,000 IO)

&emsp;**Solution:** Plans B and F will be considered (System R doesn’t consider right-deep plans, and only<br>
&emsp;(Store ▷◁Sales) and (Sales ▷◁Item) are retained from the last pass, eliminating all other choices).<br>
&emsp;B will be picked because it is the cheapest of the two remaining plans.

9\. (1 point) True or False: If we have an unclustered B+-tree index on Sales.quantity, the System R<br>
optimizer may consider the index scan due to interesting order even if a sequential scan is cheaper.<br>
&emsp;&emsp;A. True<br>
&emsp;&emsp;**B. False**

&emsp;**Solution:** False. since quantity is not used in the query downstream, it is not an interesting order.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 10 of 15


---

<a id="page-11"></a>
**Page 11**

&emsp;Consider the above histogram for Sales.quantity and the additional histograms below on Item.price and<br>
&emsp;Item.popularity. Assume that all histogram boundaries are left inclusive and right exclusive. (Simplify<br>
&emsp;all your answers, and use 2 significant digits.)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;0-100   100-300   300-900   900-2000   2000-4999<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;50%   25%   15%   7%   3%<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Figure 2: Histogram on Item.price.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;0-4   4-6   6-8   8-9   9-10<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;10%   20%   40%   25%   5%<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Figure 3: Histogram on Item.popularity.

10\. (2 points) What is the selectivity for the predicate:

&emsp;&emsp;&emsp;&emsp;&emsp;Sales.quantity \>= 225 AND Item.popularity \>= 2 AND Item.popularity \< 6

&emsp;**Solution:** Using independence and uniformity in the bins: (.15 + .15 + 0.3) \* (.05 + 0.20) =<br>
&emsp;(.6)\*(.25) = .15.

11\. (2 points) What is the selectivity for the predicate:

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;(Item.price \>= 50 and Item.price \< 700) OR (Item.popularity \>= 7)

&emsp;**Solution:** Again, using uniformity and independence assumptions<br>
&emsp;the first part of disjunct: .25 + .25 + .10 = 0.60.<br>
&emsp;the Second part of disjunct: .20 + .25 + .05 = 0.5<br>
&emsp;Overall = 0.60 + 0.50 - (0.50)\*(0.60) = .80

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 11 of 15


---

<a id="page-12"></a>
**Page 12**

&emsp;Consider the same query above. Suppose the optimizer has narrowed the candidate plans to the following<br>
&emsp;two:

&emsp;Plan 1: (Item ▷◁Sales) ▷◁Store) Estimated total IO: 2,500,000

&emsp;Plan 2: (Sales ▷◁Store) ▷◁Item) Estimated total IO: 4,500,000

&emsp;In this case, the optimizer will choose plan 1 as its estimated IO is less than that of plan 2. In the<br>
&emsp;lecture, we have been making assumptions that the data distribution is uniform and the columns are<br>
&emsp;independent of each other. However, these assumptions rarely hold in real life. Consequently, the actual<br>
&emsp;IO might differ significantly from the estimated IO.<br>
&emsp;One way to potentially improve the plan selection is to incorporate feedback; after executing the query<br>
&emsp;using plan 1 and observing the actual IO of this plan, we can feed this information back to the optimizer<br>
&emsp;to let it better optimize executions of the same query in the future.<br>
12\. (1 point) Suppose we observe that the actual IO is 5,000,000 for plan 1. If we rerun the same query,<br>
&emsp;which plan will the optimizer choose this time?<br>
&emsp;&emsp;&emsp;A. Plan 1<br>
&emsp;&emsp;&emsp;**B. Plan 2**

&emsp;**Solution:** Plan 2, since its estimated IO cost is cheaper than the actual IO cost for Plan 1.

13\. (1 point) Suppose we observe that the actual IO is 2,000,000 for plan 1. If we rerun the same query,<br>
&emsp;which plan will the optimizer choose this time?<br>
&emsp;&emsp;&emsp;**A. Plan 1**<br>
&emsp;&emsp;&emsp;B. Plan 2

&emsp;**Solution:** Plan 1, since its actual IO cost is cheaper than the estimated IO cost for Plan 2.

14\. (1 point) True or False: With this feedback mechanism, the optimizer will eventually find the optimal<br>
&emsp;execution plan (in terms of the actual IO, not estimated IO) after running the same query over and over<br>
&emsp;again.<br>
&emsp;&emsp;&emsp;A. True<br>
&emsp;&emsp;&emsp;**B. False**

&emsp;**Solution:** False. Consider the case where Plan 1 has an estimated IO cost of 2,500,000 and an<br>
&emsp;actual cost of 2,000,000, while Plan 2 has an estimated IO cost of 4,500,000 and an actual IO cost<br>
&emsp;of 1,500,000. The optimizer will always choose Plan 1 since both its actual and estimated IO costs<br>
&emsp;are lower than Plan 2’s estimated IO cost, when in reality Plan 2 has a cheaper actual IO cost.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 12 of 15


---

<a id="page-13"></a>
**Page 13**

**4**   **Transactions and Concurrency Control (12 points)**

1\. (1.5 points) Fill in the corresponding box on the answer sheet if True.<br>
&emsp;&emsp;&emsp;**A. If only the last two operations out of many in a committed transaction do not take**<br>
&emsp;&emsp;&emsp;&emsp;**effect, it is a violation of the Atomicity principle.**<br>
&emsp;&emsp;&emsp;B. Interleaving transactions is always faster than doing them one at a time.<br>
&emsp;&emsp;&emsp;C. All conflict serializable are also serial schedules.<br>
&emsp;&emsp;&emsp;D. Transaction A reads from relation W, and Transaction B reads from relation W concurrently.<br>
&emsp;&emsp;&emsp;&emsp;They may possibly read any or all of W. This is considered a conflict.<br>
&emsp;&emsp;&emsp;**E. Transaction A writes to relation W, and Transaction B writes to relation W con-**<br>
&emsp;&emsp;&emsp;&emsp;**currently. They may possibly write to any or all of W. This is considered a conflict.**

&emsp;**Solution:**<br>
&emsp;A is a violation of the Atomicity principle.<br>
&emsp;For B, there could be no conflicts and since interleaving has a significant overhead cost, interleaving<br>
&emsp;could actually run slower.<br>
&emsp;C is false because a serial schedule is one in which each transactions runs from start to finish without<br>
&emsp;any interweaving whereas conflict serializable schedules can have interweaving.<br>
&emsp;D is false because a conflict requires at least one operation to be a write and both operations here<br>
&emsp;are reads.<br>
&emsp;E is a definition of a conflict

&emsp;Use the schedule below for the next two questions. Assume both A and B have a value of 100 before T1<br>
&emsp;begins.


![Figure on page 13](figures/solutions-p13-fig01.png)

2\. (1 point) Suppose T1 successfully commits.<br>
&emsp;(a) What is the final value of A?

&emsp;&emsp;&emsp;**Solution:** 600

&emsp;(b) What is the final value of B?

&emsp;&emsp;&emsp;**Solution:** 400

3\. (2 points) Suppose T1 starts and its execution is **not** atomic. (You may mark none or more than one<br>
&emsp;for the choices below.)<br>
&emsp;(a) Which of the following are possible final states of A?<br>
&emsp;&emsp;&emsp;&emsp;**A. 100**<br>
&emsp;&emsp;&emsp;&emsp;**B. 200**<br>
&emsp;&emsp;&emsp;&emsp;C. 600<br>
&emsp;(b) Which of the following are possible final states of B?

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 13 of 15


---

<a id="page-14"></a>
**Page 14**

&emsp;&emsp;&emsp;&emsp;**A. 100**<br>
&emsp;&emsp;&emsp;&emsp;**B. 300**<br>
&emsp;&emsp;&emsp;&emsp;**C. 400**

4\. (4.5 points) Use the schedule below for this question. (You may mark none or more than one for the<br>
choices below.)


![Figure on page 14](figures/solutions-p14-fig02.png)

&emsp;(a) What transactions is T1 pointing to in the conflict graph for the schedule above?<br>
&emsp;&emsp;&emsp;&emsp;**A. T2**<br>
&emsp;&emsp;&emsp;&emsp;**B. T3**<br>
&emsp;&emsp;&emsp;&emsp;**C. T4**


![Figure on page 14](figures/solutions-p14-fig03.png)

&emsp;&emsp;&emsp;**Solution:**

&emsp;(b) What transactions is T2 pointing to in the dependency graph for the schedule above?<br>
&emsp;&emsp;&emsp;&emsp;A. T1<br>
&emsp;&emsp;&emsp;&emsp;**B. T3**<br>
&emsp;&emsp;&emsp;&emsp;**C. T4**<br>
&emsp;(c) What transactions is T3 pointing to in the dependency graph for the schedule above?<br>
&emsp;&emsp;&emsp;&emsp;A. T1<br>
&emsp;&emsp;&emsp;&emsp;B. T2<br>
&emsp;&emsp;&emsp;&emsp;**C. T4**<br>
&emsp;(d) What transactions is T4 pointing to in the dependency graph for the schedule above?<br>
&emsp;&emsp;&emsp;&emsp;A. T1<br>
&emsp;&emsp;&emsp;&emsp;B. T2<br>
&emsp;&emsp;&emsp;&emsp;C. T3

&emsp;&emsp;&emsp;**Solution:** None of these are the correct answers.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 14 of 15


---

<a id="page-15"></a>
**Page 15**

&emsp;(e) True or False: The schedule above is conflict serializable.

&emsp;&emsp;&emsp;**Solution:** True. There are no cycles in the dependency graph.

&emsp;(f) Which of the following schedules below are conflict equivalent to the schedule above?<br>
&emsp;&emsp;&emsp;&emsp;A. T2, T1, T4, T3<br>
&emsp;&emsp;&emsp;&emsp;B. T2, T1, T3, T4<br>
&emsp;&emsp;&emsp;&emsp;**C. T1, T2, T3, T4**<br>
&emsp;&emsp;&emsp;&emsp;D. T1, T2, T4, T3

&emsp;&emsp;&emsp;**Solution:** C is the correct choice. If you were to do a topological sort on the dependency<br>
&emsp;&emsp;&emsp;graph, C is the only ordering which is possible. T2 depends on T1 to finish so that eliminates<br>
&emsp;&emsp;&emsp;A and B and T4 depends on T3 to finish so D is eliminated.

5\. (3 points) Consider the following schedule, with A = 90 and B = 90 at the start. Mark the statements<br>
below that are True.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;T1   T2<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;read(A)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;read(B)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**if** (A\>100) **then** B=A+B<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;read(B)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;read(A)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**if** (B\>100) **then** A=A+B<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**else** A=A+10<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;write(A)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**else** B=B+10<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;write(B)

&emsp;&emsp;**A. The schedule is serializable.**<br>
&emsp;&emsp;B. The schedule is view serializable.<br>
&emsp;&emsp;**C. The schedule is not conflict serializable**

&emsp;**Solution:** A and C are the correct choices. In this case, A and B are never larger than 100. So<br>
&emsp;there is no real conflict between T1 and T2. However, both conflict and view serializable definitions<br>
&emsp;disallow it. There is a cycle between T1 and T2 because of read(B) →write(B) and read(A) →<br>
&emsp;write(A), it’s not conflict serializable. In a serial schedule, one of the two would read the write from<br>
&emsp;the other, so it’s not view serializable.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 15 of 15

