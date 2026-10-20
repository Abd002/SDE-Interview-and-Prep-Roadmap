# CMU 15-445 Fall 2025: Homework 4: Official solutions

> Copied from the original: <https://15445.courses.cs.cmu.edu/fall2025/assignments.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CARNEGIE MELLON UNIVERSITY<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;COMPUTER SCIENCE DEPARTMENT<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;15-445/645 – DATABASE SYSTEMS (FALL 2025)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;PROF. ANDY PAVLO

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #4 (by Will) – Solutions<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Due: **Sunday, Nov 2, 2025 @ 11:59pm**

**IMPORTANT:**<br>
&emsp;• Enter all of your answers into **Gradescope by 11:59pm on Sunday, Nov 2, 2025**.<br>
&emsp;• **Plagiarism**: Homework may be discussed with other students, but all homework is to be<br>
&emsp;&emsp;completed **individually**.<br>
For your information:<br>
&emsp;• Graded out of **100** points; **3** questions total<br>
&emsp;• Rough time estimate: ≈2 - 3 hours (0.5 - 1 hours for each question)<br>
&emsp;• Each part is all or nothing. There is no partial credit.<br>
&emsp;Revision : 2025/11/09 20:54

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Question   Points   Score<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Join Algorithms   45<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Query Execution, Planning, and Optimization   30<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Cardinality Estimation   25<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Total:   100

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1


---

<a id="page-2"></a>
**Page 2**

15-445/645 (Fall 2025)   Homework #4   Page 2 of 9


### **Question 1: Join Algorithms . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . \[45 points\]**

&emsp;**Graded by:**<br>
&emsp;Consider relations `X(a,` `b)`, `Y(a,` `c,` `e)`, and `Z(a,` `d,` `f)` to be joined on the common<br>
&emsp;attribute `a`. Assume that there are no indexes available on the tables to speed up the join<br>
&emsp;algorithms.<br>
&emsp;&emsp;• There are B = 100 pages in the buffer<br>
&emsp;&emsp;• Table `X` spans M = 1,000 pages with 100 tuples per page<br>
&emsp;&emsp;• Table `Y` spans N = 500 pages with 1,000 tuples per page<br>
&emsp;&emsp;• Table `Z` spans O = 3,000 pages with 3000 tuples per page<br>
&emsp;&emsp;• The join result of `Y` and `Z` spans P = 200 pages<br>
&emsp;For the following questions, assume a simple cost model where pages are read and written one<br>
&emsp;at a time. Also assume that one buffer block is needed for the evolving output block and one<br>
&emsp;input block is needed for the current input block of the inner relation. You may ignore the cost<br>
&emsp;of the writing of the final results.

&emsp;(a) **\[2 points\]** What is the I/O cost of a simple nested loop join with `Y` as the outer relation<br>
&emsp;&emsp;&emsp;and `X` as the inner relation?<br>
&emsp;&emsp;&emsp;☐  51,000<br>
&emsp;&emsp;&emsp;☐  101,000<br>
&emsp;&emsp;&emsp;☐  675,250<br>
&emsp;&emsp;&emsp;☐  500,550<br>
&emsp;&emsp;&emsp;☐  50,001,000<br>
&emsp;&emsp;&emsp;☒ **500,000,500**<br>
&emsp;&emsp;&emsp;**Solution:** N + n × M = 500 + 500 × 1, 000 × 1, 000 = 500, 000, 500

&emsp;(b) **\[2 points\]** What is the I/O cost of a block nested loop join with `Y` as the outer relation<br>
&emsp;&emsp;&emsp;and `Z` as the inner relation?<br>
&emsp;&emsp;&emsp;☐  1,650<br>
&emsp;&emsp;&emsp;☐  3,250<br>
&emsp;&emsp;&emsp;☐  15,500<br>
&emsp;&emsp;&emsp;☒ **18,500**<br>
&emsp;&emsp;&emsp;☐  21,250<br>
&emsp;&emsp;&emsp;☐  96,000<br>
&emsp;&emsp;&emsp;98 ⌉× 3, 000 = 500 + 6 × 3, 000 = 18, 500B−2⌉× O = 500 + ⌈500**Solution:** N + ⌈N

&emsp;(c) **\[2 points\]** What is the I/O cost of a block nested loop join with `Z` as the outer relation<br>
&emsp;&emsp;&emsp;and `Y` as the inner relation?<br>
&emsp;&emsp;&emsp;☐  17,500


### Question 1 continues...


---

<a id="page-3"></a>
**Page 3**

15-445/645 (Fall 2025)   Homework #4   Page 3 of 9

&emsp;&emsp;&emsp;☐  18,000<br>
&emsp;&emsp;&emsp;☒ **18,500**<br>
&emsp;&emsp;&emsp;☐  19,000<br>
&emsp;&emsp;&emsp;☐  19,500<br>
&emsp;&emsp;&emsp;98 ⌉× 500 = 3, 000 + 31 × 500 = 18, 500**Solution:** O + ⌈OB−2⌉× N = 3, 000 + ⌈3,000

&emsp;(d) For a sort-merge join with `Z` as the outer relation and `X` as the inner relation:<br>
&emsp;&emsp;&emsp;i. **\[3 points\]** What is the cost of sorting the tuples in `X` on attribute `a`?<br>
&emsp;&emsp;&emsp;&emsp;☐  1,000<br>
&emsp;&emsp;&emsp;&emsp;☐  2,000<br>
&emsp;&emsp;&emsp;&emsp;☒ **4,000**<br>
&emsp;&emsp;&emsp;&emsp;☐  6,000<br>
&emsp;&emsp;&emsp;&emsp;☐  8,000<br>
&emsp;&emsp;&emsp;&emsp;100 ⌉)⌉= 1 + 1 = 2**Solution:** passes = 1 + ⌈logB−1(⌈MB ⌉)⌉= 1 + ⌈log99(⌈1,000<br>
&emsp;&emsp;&emsp;&emsp;2M × passes = 2 × 1, 000 × 2 = 4, 000

&emsp;&emsp;&emsp;ii. **\[3 points\]** What is the cost of sorting the tuples in `Z` on attribute `a`?<br>
&emsp;&emsp;&emsp;&emsp;☐  3,000<br>
&emsp;&emsp;&emsp;&emsp;☐  6,000<br>
&emsp;&emsp;&emsp;&emsp;☒ **12,000**<br>
&emsp;&emsp;&emsp;&emsp;☐  18,000<br>
&emsp;&emsp;&emsp;&emsp;☐  24,000<br>
&emsp;&emsp;&emsp;&emsp;100 ⌉)⌉= 1 + 1 = 2B⌉)⌉= 1 + ⌈log99(⌈3,000**Solution:** passes = 1 + ⌈logB−1(⌈O<br>
&emsp;&emsp;&emsp;&emsp;2O × passes = 2 × 3, 000 × 2 = 12, 000

&emsp;&emsp;&emsp;iii. **\[3 points\]** What is the cost of the merge phase in the worst-case scenario?<br>
&emsp;&emsp;&emsp;&emsp;☐  1,000<br>
&emsp;&emsp;&emsp;&emsp;☐  3,000<br>
&emsp;&emsp;&emsp;&emsp;☐  4,000<br>
&emsp;&emsp;&emsp;&emsp;☐  300,000<br>
&emsp;&emsp;&emsp;&emsp;☒ **3,000,000**

&emsp;&emsp;&emsp;&emsp;**Solution:** O × M = 3, 000 × 1, 000 = 3, 000, 000

&emsp;&emsp;&emsp;iv. **\[3 points\]** What is the cost of the merge phase assuming there are no duplicates in<br>
&emsp;&emsp;&emsp;&emsp;the join attribute?<br>
&emsp;&emsp;&emsp;&emsp;☐  1,000<br>
&emsp;&emsp;&emsp;&emsp;☐  3,000<br>
&emsp;&emsp;&emsp;&emsp;☒ **4,000**<br>
&emsp;&emsp;&emsp;&emsp;☐  300,000


### Question 1 continues...


---

<a id="page-4"></a>
**Page 4**

15-445/645 (Fall 2025)   Homework #4   Page 4 of 9

&emsp;&emsp;&emsp;&emsp;☐  3,000,000<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** O + M = 3, 000 + 1, 000 = 4, 000

&emsp;&emsp;&emsp;v. **\[3 points\]** Now consider joining `Y`, `Z` and then joining the result with `X`. What is the<br>
&emsp;&emsp;&emsp;&emsp;cost of the final merge phase assuming there are no duplicates in the join attribute?<br>
&emsp;&emsp;&emsp;&emsp;☐  700<br>
&emsp;&emsp;&emsp;&emsp;☒ **1,200**<br>
&emsp;&emsp;&emsp;&emsp;☐  3,200<br>
&emsp;&emsp;&emsp;&emsp;☐  100,000<br>
&emsp;&emsp;&emsp;&emsp;☐  200,000<br>
&emsp;&emsp;&emsp;&emsp;☐  600,000<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** P + X = 200 + 1, 000 = 1, 200

&emsp;(e) **\[2 points\]** Consider a hash join with `Y` as the outer relation and `X` as the inner relation.<br>
&emsp;&emsp;&emsp;You may ignore recursive partitioning and partially filled blocks. What is the cost of the<br>
&emsp;&emsp;&emsp;combined probe and partition phases?<br>
&emsp;&emsp;&emsp;☐  3,000<br>
&emsp;&emsp;&emsp;☒ **4,500**<br>
&emsp;&emsp;&emsp;☐  6,000<br>
&emsp;&emsp;&emsp;☐  9,000<br>
&emsp;&emsp;&emsp;☐  12,000

&emsp;&emsp;&emsp;**Solution:** 3(N + M) = 4, 500

&emsp;(f) **\[4 points\]** Assume that the tables do not fit in main memory and that a large number of<br>
&emsp;&emsp;&emsp;distinct values hash to the same bucket using hash function h1. Which of the following<br>
&emsp;&emsp;&emsp;approaches works the best?<br>
&emsp;&emsp;&emsp;☒ **Create hashtables for the inner and outer relation using** h1 **and rehash into an**<br>
&emsp;&emsp;&emsp;**embedded hash table using** h2 **!=** h1 **for large buckets.**<br>
&emsp;&emsp;&emsp;☐  Create two hashtables half the size of the original one, run the same hash join algorithm<br>
&emsp;&emsp;&emsp;on the tables, and then merge the hashtables together.<br>
&emsp;&emsp;&emsp;☐  Create hashtables for the inner and outer relation using h1 and rehash into an embedded<br>
&emsp;&emsp;&emsp;hash table using h1 for large buckets.<br>
&emsp;&emsp;&emsp;☐  Use linear probing for collisions and page in and out parts of the hashtable needed at<br>
&emsp;&emsp;&emsp;a given time.

&emsp;&emsp;&emsp;**Solution:** Use Grace hash join with recursive partitioning, which is what the correct<br>
&emsp;&emsp;&emsp;option describes.

&emsp;(g) For each of the following statements about joins, pick True or False.


### Question 1 continues...


---

<a id="page-5"></a>
**Page 5**

15-445/645 (Fall 2025)   Homework #4   Page 5 of 9

&emsp;&emsp;&emsp;i. **\[2 points\]** If neither table fits entirely in memory, I/O costs would be lower if we<br>
&emsp;&emsp;&emsp;&emsp;process both tables on a per-tuple rather than per-block basis.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** A block nested loop join has fewer disk accesses when compared to a<br>
&emsp;&emsp;&emsp;&emsp;simple nested loop join.

&emsp;&emsp;&emsp;ii. **\[2 points\]** If both tables in a simple nested loop join fit entirely in memory, the order<br>
&emsp;&emsp;&emsp;&emsp;of inner and outer tables does not significantly affect I/O costs.<br>
&emsp;&emsp;&emsp;&emsp;☒ **True**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  False<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** If both tables fit entirely in memory, then they can be read just once and<br>
&emsp;&emsp;&emsp;&emsp;therefore the order would not be very important.

&emsp;&emsp;&emsp;iii. **\[3 points\]** An index nested loop join requires an index on only the inner- table.<br>
&emsp;&emsp;&emsp;&emsp;☒ **True**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  False<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** An index nested loop join only requires the inner- table to have an index.<br>
&emsp;&emsp;&emsp;iv. **\[3 points\]** A sort-merge join is faster than a hash join on all circumstances.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** Sort merge join can be just as fast as hash join under specific circum-<br>
&emsp;&emsp;&emsp;&emsp;stances. For example, if the sort merge is performed on already-sorted data (i.e.<br>
&emsp;&emsp;&emsp;&emsp;sort cost is 0 and overall cost is M+N), and the hash join is perform on data can fit<br>
&emsp;&emsp;&emsp;&emsp;entirely in memory where overall cost is M+N.

&emsp;&emsp;&emsp;v. **\[3 points\]** For a hash join to work, the inner table (or its partitions) need to fit into<br>
&emsp;&emsp;&emsp;&emsp;memory.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** The inner table can be any size. Only outer table (or its partitions) need<br>
&emsp;&emsp;&emsp;&emsp;to fit in memory.<br>
&emsp;&emsp;&emsp;vi. **\[5 points\]** Select all true statements about joins:<br>
&emsp;&emsp;&emsp;&emsp;☐  Each tuple is scanned exactly once in a naive nested loop join.<br>
&emsp;&emsp;&emsp;&emsp;☐  Hash Joins are always preferred over a Sort-Merge Join when both relations are<br>
&emsp;&emsp;&emsp;&emsp;already sorted on the join key.<br>
&emsp;&emsp;&emsp;&emsp;☐  Sort-Merge Join requires both input relations to be pre-sorted.<br>
&emsp;&emsp;&emsp;&emsp;☒ **For block nested loop joins, increasing the buffer pool could reduce the num-**<br>
&emsp;&emsp;&emsp;&emsp;**ber of disk I/Os.**<br>
&emsp;&emsp;&emsp;&emsp;☐  Index Nested Loop Join requires pre-sorting the inner relation.<br>
&emsp;&emsp;&emsp;&emsp;☐  None of the above.<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** Only (D) is true.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #4 continues...


---

<a id="page-6"></a>
**Page 6**

15-445/645 (Fall 2025)   Homework #4   Page 6 of 9


### **Question 2: Query Execution, Planning, and Optimization . . . . . \[30 points\]**

&emsp;**Graded by:**<br>
&emsp;(a) **\[3 points\]** Assume that the DBMS zone maps are up to date. The DBMS can use these<br>
&emsp;&emsp;&emsp;zone maps to answer specific queries without reading any actual table heap tuples:<br>
&emsp;&emsp;&emsp;☒ **True**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  False<br>
&emsp;&emsp;&emsp;**Solution:** True. If the zone maps are up-to-date, the DBMS could answer queries asking<br>
&emsp;&emsp;&emsp;for the minimum value of a given attribute (amongst others) by only looking at zone<br>
&emsp;&emsp;&emsp;maps.<br>
&emsp;(b) **\[3 points\]** Assume a query with multiple `OR` predicates with high selectivity (i.e., re-<br>
&emsp;&emsp;&emsp;trieves a few tuples). Using a multi-index scan is preferred over a sequential scan for<br>
&emsp;&emsp;&emsp;extremely large tables (i.e., \>1,000,000 tuples).<br>
&emsp;&emsp;&emsp;☒ **True**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  False<br>
&emsp;&emsp;&emsp;**Solution:** True.<br>
&emsp;(c) **\[3 points\]** The iterator model allows tuples to continously flow through the entire se-<br>
&emsp;&emsp;&emsp;quence of operators in the execution plan before retrieving the next tuple.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;**Solution:** False. The statement is true only for a single pipeline, but a query can have<br>
&emsp;&emsp;&emsp;multiple pipelines. If an operator is a pipeline breaker (e.g. build-side of hash join,<br>
&emsp;&emsp;&emsp;subqueries, order-by), it cannot emit tuples until all its children emit all their tuples.<br>
&emsp;(d) **\[3 points\]** The process per DBMS worker approach provides better fault isolation and<br>
&emsp;&emsp;&emsp;scheduling control than the thread per DBMS worker approach.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;**Solution:** False. While the process per DBMS worker approach does provide better<br>
&emsp;&emsp;&emsp;fault isolation, thread per worker gives the DBMS finer control over scheduling.<br>
&emsp;(e) **\[3 points\]** For OLAP queries, which often involve complex operations on vast datasets,<br>
&emsp;&emsp;&emsp;intra-query parallelism can improve performance.<br>
&emsp;&emsp;&emsp;☒ **True**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  False<br>
&emsp;&emsp;&emsp;**Solution:** True. OLAP queries, characterized by their complex operations on large<br>
&emsp;&emsp;&emsp;volumes of data, can greatly benefit from intra-query parallelism. By executing the<br>
&emsp;&emsp;&emsp;operations of a single query in parallel, it helps in significantly decreasing the latency,<br>
&emsp;&emsp;&emsp;thus optimizing the performance of these types of queries.<br>
&emsp;(f) **\[3 points\]** In OLAP workload, the vectorized model’s performance improvements come<br>
&emsp;&emsp;&emsp;mainly from the reduction in the number of disk I/O operations.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;**Solution:** False. While the Vectorized Model can reduce some I/O operations due to<br>
&emsp;&emsp;&emsp;its batch processing, its primary advantage is from reducing CPU overhead, optimizing<br>
&emsp;&emsp;&emsp;cache utilization, and leveraging SIMD instructions.


### Question 2 continues...


---

<a id="page-7"></a>
**Page 7**

15-445/645 (Fall 2025)   Homework #4   Page 7 of 9

&emsp;(g) **\[2 points\]** The execution plan with the lowest cost is guaranteed to be the most efficient<br>
&emsp;&emsp;&emsp;among all execution plans enumerated by the query optimizer.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;**Solution:** False. The execution plan is not guaranteed to be the most efficient, as the<br>
&emsp;&emsp;&emsp;statistics used to compute cardinality might be stale and the cost model may not accu-<br>
&emsp;&emsp;&emsp;rately reflect the actual performance of the plan (e.g. assume all predicates in a conjunc-<br>
&emsp;&emsp;&emsp;tion is indepedent, while there might be some correlation).<br>
&emsp;(h) **\[3 points\]** Predicate and projection pushdown will always improve query performance.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;**Solution:** False. If the predicate/projection being pushed down involves an expensive<br>
&emsp;&emsp;&emsp;function call (i.e., UDF), the query may benefit from deferring it to later.<br>
&emsp;(i) **\[2 points\]** Sampling statistics requires evaluating a subset of the table’s tuples.<br>
&emsp;&emsp;&emsp;☒ **True**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  False<br>
&emsp;&emsp;&emsp;**Solution:** True. Sampling only needs to look at a subset (or representative sample) of<br>
&emsp;&emsp;&emsp;the table.<br>
&emsp;(j) **\[2 points\]** Equi-depth histogram maintains counts for a group of values instead of each<br>
&emsp;&emsp;&emsp;unique key to reduce memory footprint and uses the same range size for each bucket.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;**Solution:** False. Equi-depth histogram varies the range size of buckets so that the total<br>
&emsp;&emsp;&emsp;number of occurrences for each bucket is roughly the same.<br>
&emsp;(k) **\[3 points\]** Consider two options to estimate the selectivity of a selection predicate: a<br>
&emsp;&emsp;&emsp;histogram built on the selection column or using sampling to estimate the predicate se-<br>
&emsp;&emsp;&emsp;lectivity. Which of the following statements is true? Select all that apply.<br>
&emsp;&emsp;&emsp;☐  Histograms are more accurate than sampling for skewed data distributions<br>
&emsp;&emsp;&emsp;☒ **Sampling can adapt better to arbitrary predicates than histograms**<br>
&emsp;&emsp;&emsp;☐  Sampling always provides faster estimates than histograms<br>
&emsp;&emsp;&emsp;☐  Histograms are generally more effective for columns with floating-point values than<br>
&emsp;&emsp;&emsp;for columns with integer values

&emsp;&emsp;&emsp;**Solution:** Histograms often struggle with skewed data – you have to get the bin bound-<br>
&emsp;&emsp;&emsp;aries right, which is difficult. Sampling can generally adapt better to arbitrary predicates<br>
&emsp;&emsp;&emsp;as it does not rely on pre-defined bins, and can estimate selectivity for any predicate,<br>
&emsp;&emsp;&emsp;accurately provided the sample is representative of the actual data. Sampling is slower<br>
&emsp;&emsp;&emsp;than histograms, though. All this holds regardless of the data type of the column.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #4 continues...


---

<a id="page-8"></a>
**Page 8**

15-445/645 (Fall 2025)   Homework #4   Page 8 of 9


### **Question 3: Cardinality Estimation . . . . . . . . . . . . . . . . . . . . . . . . . . . \[25 points\]**

&emsp;**Graded by:**<br>
&emsp;(a) A database contains a single table: `University(id,name,state,city)`. You need to<br>
&emsp;&emsp;&emsp;estimate the cardinality of the following query:<br>
&emsp;&emsp;&emsp;`SELECT` `*` `FROM` `University WHERE` `state` `=` `‘PA’` `AND` `city` `=` `‘Pittsburgh’`<br>
&emsp;&emsp;&emsp;For the following questions, assume `University` has 10,000 rows with 10% having<br>
&emsp;&emsp;&emsp;`state` `=` `‘PA’`, and 0.5% having `city` `=` `‘Pittsburgh’`.<br>
&emsp;&emsp;&emsp;i. **\[4 points\]** Under uniform data assumption and independent predicates assumption,<br>
&emsp;&emsp;&emsp;&emsp;what is the estimated cardinality c of this query? Take ⌈c⌉of the result.<br>
&emsp;&emsp;&emsp;&emsp;☒ **5**<br>
&emsp;&emsp;&emsp;&emsp;☐  25<br>
&emsp;&emsp;&emsp;&emsp;☐  50<br>
&emsp;&emsp;&emsp;&emsp;☐  100<br>
&emsp;&emsp;&emsp;&emsp;☐  500<br>
&emsp;&emsp;&emsp;&emsp;☐  1,000

&emsp;&emsp;&emsp;&emsp;**Solution:** ⌈10, 000 × 0.1 × 0.005⌉= ⌈5⌉= 5.

&emsp;&emsp;&emsp;ii. **\[2 points\]** Is the result from previous question likely an overestimate or underesti-<br>
&emsp;&emsp;&emsp;&emsp;mate of the true cardinality?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **Underestimate**<br>
&emsp;&emsp;&emsp;&emsp;☐  Overestimate<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** It is likely an underestimate of the true cardinality since the state and city<br>
&emsp;&emsp;&emsp;&emsp;are not independent attributes - they are highly correlated.<br>
&emsp;(b) Consider the following schema and statistics:<br>
&emsp;&emsp;&emsp;• N1=4,000 tuples in R1(A, B), with<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**–** V (A, R1)= 250 distinct values of A<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**–** V (B, R1)= 500 distinct values of B<br>
&emsp;&emsp;&emsp;• N2=8,000 tuples in R2(B, C)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**–** V (B, R2)= 500 distinct values of B<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**–** V (C, R2)= 800 distinct values of C<br>
&emsp;&emsp;&emsp;• N3=16,000 tuples in R3(C, D, FOREIGN KEY (D) REFERENCES R4(D))<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**–** V (C, R3)= 800 distinct values of C<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**–** V (D, R3)= 900 distinct values of D<br>
&emsp;&emsp;&emsp;• N4=4,000 tuples in R4(D PRIMARY KEY , E)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**–** V (D, R4)= 4,000 distinct values of D<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**–** V (E, R4)= 1,200 distinct values of E<br>
&emsp;&emsp;&emsp;Assume that:<br>
&emsp;&emsp;&emsp;• Uniformity: the values are uniformly distributed in each table.<br>
&emsp;&emsp;&emsp;• Perfect overlap: the distinct values of B in R1 are the same as the distinct values of<br>
&emsp;&emsp;&emsp;&emsp;B in R2 (and ditto for C, etc).


### Question 3 continues...


---

<a id="page-9"></a>
**Page 9**

15-445/645 (Fall 2025)   Homework #4   Page 9 of 9

&emsp;&emsp;&emsp;i. **\[1 point\]** Estimate the number of tuples for the query σD=100(R4).<br>
&emsp;&emsp;&emsp;&emsp;☒ **1**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  900   ☐  1,200   ☐  4,000   ☐  None of the above<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** R4.D is a primary key. Thus, a query optimizer would estimate that 1<br>
&emsp;&emsp;&emsp;&emsp;tuple exists.<br>
&emsp;&emsp;&emsp;ii. **\[1 point\]** Estimate the number of tuples for the natural join query A = R3 1 R4.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **None of the above**<br>
&emsp;&emsp;&emsp;&emsp;☐  1   ☐  800   ☐  900   ☐  1,200   ☐  4,000<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** R3.D is a foreign key reference to R4.D and R4.D is a primary key, so<br>
&emsp;&emsp;&emsp;&emsp;each tuple in R3 will join with exactly one tuple in R4.<br>
&emsp;&emsp;&emsp;iii. **\[2 points\]** Estimate the number of tuples for the query σA=5(R1).<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **16**<br>
&emsp;&emsp;&emsp;&emsp;☐  1   ☐  8   ☐  250   ☐  4,000   ☐  None of the above<br>
&emsp;&emsp;&emsp;&emsp;**Solution:**   N1/V (A, R1) = 4000/250 = 16<br>
&emsp;&emsp;&emsp;iv. **\[2 points\]** Estimate the number of tuples for the query σC̸=99(R3).<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **15,980**<br>
&emsp;&emsp;&emsp;&emsp;☐  1   ☐  20   ☐  800   ☐  16,000   ☐  None of the above<br>
&emsp;&emsp;&emsp;&emsp;**Solution:**N2 −(N2/V (C, R3)) = 16, 000 −(16, 000/800) = 15, 980<br>
&emsp;&emsp;&emsp;v. **\[4 points\]** Estimate the number of tuples for the query σB=2∧C=2(R2)<br>
&emsp;&emsp;&emsp;&emsp;☒ **0.02**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  10   ☐  16   ☐  8,000   ☐  None of the above<br>
&emsp;&emsp;&emsp;&emsp;**Solution:**   N2 × (1/V (B, R2)) × (1/V (C, R2)) = 8, 000/500/800 = 0.02<br>
&emsp;&emsp;&emsp;vi. **\[4 points\]** Estimate the number of tuples for the natural join query A = R1 1 R2.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **64,000**<br>
&emsp;&emsp;&emsp;&emsp;☐  4,000   ☐  8,000   ☐  40,000   ☐  128,000   ☐  None of the<br>
&emsp;&emsp;&emsp;&emsp;above<br>
&emsp;&emsp;&emsp;&emsp;**Solution:**N1 × N2/V (B, R1) = 4000 × 8, 000/500 = 64, 000<br>
&emsp;&emsp;&emsp;vii. **\[5 points\]** Estimate the number of qualifying tuples for the natural join query B =<br>
&emsp;&emsp;&emsp;&emsp;R1 1 R2 1 R3. Assume that the number of distinct values of C is always 800.<br>
&emsp;&emsp;&emsp;&emsp;☐  16,000<br>
&emsp;&emsp;&emsp;&emsp;☐  64,000<br>
&emsp;&emsp;&emsp;&emsp;☐  800,000<br>
&emsp;&emsp;&emsp;&emsp;☒ **1,280,000**<br>
&emsp;&emsp;&emsp;&emsp;☐  2,048,000<br>
&emsp;&emsp;&emsp;&emsp;☐  2,560,000<br>
&emsp;&emsp;&emsp;&emsp;☐  None of the above<br>
&emsp;&emsp;&emsp;&emsp;**Solution:**\|R1 1 R2\| × N3/V (C, R2) = 64, 000 × 16, 000/800 = 1, 280, 000

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;End of Homework #4

