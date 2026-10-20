# Berkeley CS186 Spring 2018: Midterm 2: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/186>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;CS 186/286 Spring 2018 Midterm 2<br>
• Do not turn this page until instructed to start the exam.<br>
• You should receive 1 single-page answer sheet and a 11-page exam packet.<br>
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
&emsp;&emsp;&emsp;C. P ▷◁Q does the same number of I/Os as Q ▷◁P.<br>
2\. (5 points) Next, we consider a Simple Nested Loop Join on three tables: P, Q, and S.<br>
&emsp;&emsp;• Please use \[X\] to denote the number of pages of X, and {X} to denote the number of records in<br>
&emsp;&emsp;X (note the curly braces rather than vertical bars, for legibility).<br>
&emsp;&emsp;• Do not materialize intermediary results into a temporary table. Assume the results of a subplan<br>
&emsp;&emsp;are pipelined to the next operator.<br>
&emsp;&emsp;• Assume P ▷◁Q is foreign key to primary key join, and the following join with S is also a foriegn<br>
&emsp;&emsp;key to primary key join. The (non null) foreign keys are in P, and primary keys are in Q and S.

&emsp;(a) (1 point) What is the I/O cost for P ▷◁Q?<br>
&emsp;(b) (1 point) What is the cardinality of P ▷◁Q?<br>
&emsp;(c) (2 points) What is the I/O cost for (P ▷◁Q) ▷◁S?<br>
&emsp;(d) (1 point) What is the cardinality of (P ▷◁Q) ▷◁S?<br>
3\. (1 point) Which one of the following options is true about the IO cost of a self join (i.e. joining a table<br>
&emsp;with itself)? Assume B ≫3 where B is the pages of memory available.<br>
&emsp;&emsp;&emsp;A. IO(SNLJ) \> IO(PNLJ) ≥IO(BNLJ)<br>
&emsp;&emsp;&emsp;B. IO(SNLJ) ≤IO(PNLJ) ≤IO(BNLJ)<br>
&emsp;&emsp;&emsp;C. IO(SNLJ) ≥IO(PNLJ) ≥IO(BNLJ)<br>
&emsp;&emsp;&emsp;D. IO(PNLJ) ≤IO(SNLJ) ≤IO(BNLJ)<br>
4\. (3 points) Suppose there are two tables: R with 40 pages and S with 75 pages. What is the cost of<br>
&emsp;sort-merge join between tables R and S? Assume the operator has 6 pages of RAM, and it is not writing<br>
&emsp;the output to disk. Use the optimization from lecture if possible.<br>
5\. (10 points) Suppose there are two tables: P and Q. Table P has 1,200 pages and 35 records per page.<br>
&emsp;Table Q has 100 pages and 50 records per page. In this question, we consider an equality join P ▷◁Q.<br>
&emsp;Assume that join key values are widely and uniformly distributed. That is, there is no skew. Also assume<br>
&emsp;that although the join operator allocates 1 buffer for the output, it does not write the output to disk.

&emsp;(a) (1 point) What is the I/O cost of a grace hash join? Assume the join has 11 buffer pages of memory<br>
&emsp;&emsp;available.<br>
&emsp;(b) (1 point) If we use a hybrid hash join, how many pages will be allocated for the hash table in<br>
&emsp;&emsp;the first phase assuming a fill factor of 0.9? Also assume the join has 32 buffer pages of memory<br>
&emsp;&emsp;available.<br>
&emsp;(c) (3 points) How many I/Os will the first pass of the hybrid hash join incur?

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 2 of 11


---

<a id="page-3"></a>
**Page 3**

(d) (3 points) How many I/Os will the second pass of the hybrid hash join incur?<br>
(e) (2 points) Suppose we have an index on Q with a compound key whose prefix is the join key. It is<br>
&emsp;an alternative 2 clustered index with 40 leaf pages total. Assume that the upper levels of the tree<br>
&emsp;are cached with a few spare (extra) buffer pages in the cache. Also assume that the query needs no<br>
&emsp;additional columns from Q. Assume that the join key is a primary key in Q.<br>
&emsp;How many I/Os does INLJ take?

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 3 of 11


---

<a id="page-4"></a>
**Page 4**

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
&emsp;&emsp;&emsp;C. 0.8 \* \[P\] \* T<br>
&emsp;&emsp;&emsp;D. 0.2\*\[P\]\*T<br>
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
&emsp;&emsp;&emsp;D. 1 + ⌈logB−1(⌈\[S\]<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3B ⌉)⌉

&emsp;Now assume that the order introduces a new table called `padawans`, which tracks apprentice Jedi who<br>
&emsp;aspire to (but are not yet) be Knights. Each Padawan has one master who trains them. The schema for<br>
&emsp;padawans is as follows:

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`padawans` `(name,` `age,` `master)`

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 4 of 11


---

<a id="page-5"></a>
**Page 5**

**Assume this table is round-robin partitioned across the 3 machines**. Now, assume that **60%**<br>
**of all padawans in the table have ”Yoda” as their master**. We wish to run the following query<br>
on the table:

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`SELECT` `*` `FROM` `padawans` `WHERE` `master` `=` `"Yoda"`

3\. (1 point) What is the time taken for the above query to complete, if each machine has B buffer pages<br>
and `padawans` has \[P\] pages in total? Let T denote the time taken for 1 I/O.<br>
&emsp;&emsp;3\*\[P\]\*TA.1<br>
&emsp;&emsp;B. 0.6\*\[P\]\*T<br>
&emsp;&emsp;C. \[P\]\*T<br>
&emsp;&emsp;D. 0.6\* \[P \]<br>
&emsp;&emsp;&emsp;&emsp;&emsp;B \*T<br>
4\. (1 point) If we wanted to sort padawans by the age key, whose values are uniformly distributed, what<br>
partitioning scheme would result in the fewest I/Os?<br>
&emsp;&emsp;A. Hash Partitioning on age<br>
&emsp;&emsp;B. Hash Partitioning on name<br>
&emsp;&emsp;C. Range Partitioning on name<br>
&emsp;&emsp;D. Range Partitioning on age<br>
5\. (1.5 points) Suppose we have time series of all monitoring events from all our fighter ships for the last<br>
2 years:

&emsp;&emsp;&emsp;`events(event` `time,` `event` `type,` `duration,` `ship` `id,` `pilot` `name,` `pilot` `rating)`

These records tell us what is going on with our fighter fleet. To keep the fleet fighting aggressively, our<br>
engineers are constantly running queries over the latest data and for a specific event – the low fuel alert.<br>
Which partitioning scheme and physical design will achieve the best average latency if we have many<br>
engineers querying concurrently ?<br>
&emsp;&emsp;A. Hash partition on `event` `type` and clustered index on `event` `time`<br>
&emsp;&emsp;B. Range partition on `event` `time` and unclustered index on `event` `type`<br>
&emsp;&emsp;C. Hash partition on `(ship` `id,` `pilot` `name)` and clustered index on `(event` `time,` `event` `type)`<br>
&emsp;&emsp;D. Range partition on `duration` and unclustered index on `event` `time`<br>
6\. (2 points) True or False. Mark all of the true answers and leave all of the false ones blank.<br>
&emsp;&emsp;A. If we partition data using the round robin scheme and then perform some operations on the<br>
&emsp;&emsp;&emsp;data, every machine is guaranteed to have the same number of records ± 1 record.<br>
&emsp;&emsp;B. Range partitioning keeps data stored in sorted order on each machine.<br>
&emsp;&emsp;C. A join over two tables that requires an asymmetric shuffle will incur fewer network I/Os than<br>
&emsp;&emsp;&emsp;one that requires a symmetric shuffle.<br>
&emsp;&emsp;D. If data is partitioned using round robin, when searching for a record, we have to perform<br>
&emsp;&emsp;&emsp;broadcast lookup to only a subset of the machines.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 5 of 11


---

<a id="page-6"></a>
**Page 6**

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

1\. (1 point) What is the estimate for the number of records output from this query?<br>
2\. (1 point) If we build an unclustered alternative 2 B+-tree index of height 2 on Item.price and use an<br>
&emsp;index scan to process this query, what is the number of IOs incurred? Assume that that we only need<br>
&emsp;to read at most one leaf node and assume that we can cache the index.<br>
3\. (1 point) True or False: If we build a clustered alternative 2 B+-tree index of height 2 on Item.price<br>
&emsp;and use an index scan to process this query, the number of IOs is less than the number of IOs required<br>
&emsp;for a sequential scan. Assume that that we only need to read at most one leaf node and assume that we<br>
&emsp;can cache the index.<br>
&emsp;&emsp;&emsp;A. True<br>
&emsp;&emsp;&emsp;B. False

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 6 of 11


---

<a id="page-7"></a>
**Page 7**

Consider the following query with a histogram on Sales.quantity:<br>
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
&emsp;&emsp;B. False<br>
5\. (1 point) Based on the histogram on Sales.quantity, what is the selectivity for Sales.quantity \>= 100 ?<br>
Assume that the histogram boundaries are left inclusive and right exclusive.<br>
6\. (1 point) True or False: The reason System R optimizer will not consider joining two tables with no<br>
join predicate (i.e. performing a Cartesian product) is because these plans will always be suboptimal.<br>
&emsp;&emsp;A. True<br>
&emsp;&emsp;B. False<br>
7\. (2 points) Suppose we have the following list of 2 table subplans and their costs. Mark the letters of<br>
the plans that will be chosen by the optimizer. Ignore interesting orders.<br>
&emsp;&emsp;A. Item ▷◁Sales (2,000 IO)<br>
&emsp;&emsp;B. Sales ▷◁Item (1,500 IO)<br>
&emsp;&emsp;C. Store ▷◁Sales (3,000 IO)<br>
&emsp;&emsp;D. Sales ▷◁Store (4,000 IO)<br>
8\. (4 points) Based on the plans that were retained in the last pass (the previous question), now suppose we<br>
have the following list of 3 table access plans and their costs. Mark the letters for all 3 table access plans<br>
that would be considered by the optimizer and write down the letter of the final query plan that will<br>
be chosen. (Cost given are cumulative for the full query. Again, ignore interesting orders in formulating<br>
your answer.)<br>
&emsp;&emsp;A. (Item ▷◁Sales) ▷◁Store (2,500,000 IO)<br>
&emsp;&emsp;B. (Sales ▷◁Item) ▷◁Store (2,000,000 IO)<br>
&emsp;&emsp;C. Store ▷◁(Item ▷◁Sales) (1,800,000 IO)<br>
&emsp;&emsp;D. Store ▷◁(Sales ▷◁Item) (1,500,000 IO)<br>
&emsp;&emsp;E. (Sales ▷◁Store) ▷◁Item (4,500,000 IO)<br>
&emsp;&emsp;F. (Store ▷◁Sales) ▷◁Item (3,500,000 IO)<br>
&emsp;&emsp;G. Item ▷◁(Sales ▷◁Store) (3,000,000 IO)<br>
&emsp;&emsp;H. Item ▷◁(Store ▷◁Sales) (2,800,000 IO)<br>
9\. (1 point) True or False: If we have an unclustered B+-tree index on Sales.quantity, the System R<br>
optimizer may consider the index scan due to interesting order even if a sequential scan is cheaper.<br>
&emsp;&emsp;A. True<br>
&emsp;&emsp;B. False

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 7 of 11


---

<a id="page-8"></a>
**Page 8**

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

11\. (2 points) What is the selectivity for the predicate:

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;(Item.price \>= 50 and Item.price \< 700) OR (Item.popularity \>= 7)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 8 of 11


---

<a id="page-9"></a>
**Page 9**

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
&emsp;&emsp;&emsp;B. Plan 2<br>
13\. (1 point) Suppose we observe that the actual IO is 2,000,000 for plan 1. If we rerun the same query,<br>
&emsp;which plan will the optimizer choose this time?<br>
&emsp;&emsp;&emsp;A. Plan 1<br>
&emsp;&emsp;&emsp;B. Plan 2<br>
14\. (1 point) True or False: With this feedback mechanism, the optimizer will eventually find the optimal<br>
&emsp;execution plan (in terms of the actual IO, not estimated IO) after running the same query over and over<br>
&emsp;again.<br>
&emsp;&emsp;&emsp;A. True<br>
&emsp;&emsp;&emsp;B. False

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 9 of 11


---

<a id="page-10"></a>
**Page 10**

**4**   **Transactions and Concurrency Control (12 points)**

1\. (1.5 points) Fill in the corresponding box on the answer sheet if True.<br>
&emsp;&emsp;&emsp;A. If only the last two operations out of many in a committed transaction do not take effect, it is<br>
&emsp;&emsp;&emsp;&emsp;a violation of the Atomicity principle.<br>
&emsp;&emsp;&emsp;B. Interleaving transactions is always faster than doing them one at a time.<br>
&emsp;&emsp;&emsp;C. All conflict serializable are also serial schedules.<br>
&emsp;&emsp;&emsp;D. Transaction A reads from relation W, and Transaction B reads from relation W concurrently.<br>
&emsp;&emsp;&emsp;&emsp;They may possibly read any or all of W. This is considered a conflict.<br>
&emsp;&emsp;&emsp;E. Transaction A writes to relation W, and Transaction B writes to relation W concurrently.<br>
&emsp;&emsp;&emsp;&emsp;They may possibly write to any or all of W. This is considered a conflict.<br>
&emsp;Use the schedule below for the next two questions. Assume both A and B have a value of 100 before T1<br>
&emsp;begins.


![Figure on page 10](figures/questions-p10-fig01.png)

2\. (1 point) Suppose T1 successfully commits.<br>
&emsp;(a) What is the final value of A?<br>
&emsp;(b) What is the final value of B?<br>
3\. (2 points) Suppose T1 starts and its execution is **not** atomic. (You may mark none or more than one<br>
&emsp;for the choices below.)<br>
&emsp;(a) Which of the following are possible final states of A?<br>
&emsp;&emsp;&emsp;&emsp;A. 100<br>
&emsp;&emsp;&emsp;&emsp;B. 200<br>
&emsp;&emsp;&emsp;&emsp;C. 600<br>
&emsp;(b) Which of the following are possible final states of B?<br>
&emsp;&emsp;&emsp;&emsp;A. 100<br>
&emsp;&emsp;&emsp;&emsp;B. 300<br>
&emsp;&emsp;&emsp;&emsp;C. 400

4\. (4.5 points) Use the schedule below for this question. (You may mark none or more than one for the<br>
&emsp;choices below.)


![Figure on page 10](figures/questions-p10-fig02.png)

&emsp;(a) What transactions is T1 pointing to in the conflict graph for the schedule above?

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 10 of 11


---

<a id="page-11"></a>
**Page 11**

&emsp;&emsp;&emsp;&emsp;A. T2<br>
&emsp;&emsp;&emsp;&emsp;B. T3<br>
&emsp;&emsp;&emsp;&emsp;C. T4<br>
&emsp;(b) What transactions is T2 pointing to in the dependency graph for the schedule above?<br>
&emsp;&emsp;&emsp;&emsp;A. T1<br>
&emsp;&emsp;&emsp;&emsp;B. T3<br>
&emsp;&emsp;&emsp;&emsp;C. T4<br>
&emsp;(c) What transactions is T3 pointing to in the dependency graph for the schedule above?<br>
&emsp;&emsp;&emsp;&emsp;A. T1<br>
&emsp;&emsp;&emsp;&emsp;B. T2<br>
&emsp;&emsp;&emsp;&emsp;C. T4<br>
&emsp;(d) What transactions is T4 pointing to in the dependency graph for the schedule above?<br>
&emsp;&emsp;&emsp;&emsp;A. T1<br>
&emsp;&emsp;&emsp;&emsp;B. T2<br>
&emsp;&emsp;&emsp;&emsp;C. T3<br>
&emsp;(e) True or False: The schedule above is conflict serializable.<br>
&emsp;(f) Which of the following schedules below are conflict equivalent to the schedule above?<br>
&emsp;&emsp;&emsp;&emsp;A. T2, T1, T4, T3<br>
&emsp;&emsp;&emsp;&emsp;B. T2, T1, T3, T4<br>
&emsp;&emsp;&emsp;&emsp;C. T1, T2, T3, T4<br>
&emsp;&emsp;&emsp;&emsp;D. T1, T2, T4, T3<br>
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

&emsp;&emsp;A. The schedule is serializable.<br>
&emsp;&emsp;B. The schedule is view serializable.<br>
&emsp;&emsp;C. The schedule is **not** conflict serializable

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 11 of 11

