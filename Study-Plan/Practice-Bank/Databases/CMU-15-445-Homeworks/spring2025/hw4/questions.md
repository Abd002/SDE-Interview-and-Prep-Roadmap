# CMU 15-445 Spring 2025: Homework 4: Questions

> Copied from the original: <https://15445.courses.cs.cmu.edu/spring2025/assignments.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CARNEGIE MELLON UNIVERSITY<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;COMPUTER SCIENCE DEPARTMENT<br>
&emsp;&emsp;&emsp;&emsp;&emsp;15-445/645 – DATABASE SYSTEMS (SPRING 2025)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;PROF. JIGNESH PATEL

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #4 (by Chris and Yuchen)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Due: **Sunday, March 23, 2025 @ 11:59pm**

**IMPORTANT:**<br>
&emsp;• Enter all of your answers into **Gradescope by 11:59pm on Sunday, March 23, 2025**.<br>
&emsp;• **Plagiarism**: Homework may be discussed with other students, but all homework is to be<br>
&emsp;&emsp;completed **individually**.<br>
For your information:<br>
&emsp;• Graded out of **100** points; **3** questions total<br>
&emsp;• Rough time estimate: ≈2 - 3 hours (0.5 - 1 hours for each question)<br>
&emsp;Revision : 2025/03/12 15:13

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Question   Points   Score<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Sorting Algorithms   32<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Join Algorithms   44<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Query Execution, Planning, and Optimization   24<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Total:   100

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1


---

<a id="page-2"></a>
**Page 2**

15-445/645 (Spring 2025)   Homework #4   Page 2 of 9


### **Question 1: Sorting Algorithms . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . \[32 points\]**

&emsp;We have a database file with 4 million pages (N = 4,000,000 pages), and we want to sort it<br>
&emsp;using external merge sort. Assume that the DBMS is not using double buffering or blocked<br>
&emsp;I/O, and that it uses quicksort for in-memory sorting. Let B denote the number of buffers.<br>
&emsp;(a) **\[4 points\]** Assume that the DBMS has 50 buffers. How many sorted runs are generated?<br>
&emsp;&emsp;&emsp;Note that the final sorted file does not count towards the sorted run count.<br>
&emsp;&emsp;&emsp;☐  34   ☐  1,633   ☐  80,000   ☐  81,667   ☐  81,670   ☐  81,671

&emsp;(b) **\[4 points\]** Again, assuming that the DBMS has 50 buffers. How many passes does the<br>
&emsp;&emsp;&emsp;DBMS need to perform in order to sort the file?<br>
&emsp;&emsp;&emsp;☐  2   ☐  3   ☐  4   ☐  5   ☐  6

&emsp;(c) **\[4 points\]** Again, assuming that the DBMS has 50 buffers. How many pages does each<br>
&emsp;&emsp;&emsp;sorted run have after the third pass (i.e. Note: this is Pass #2 if you start counting from<br>
&emsp;&emsp;&emsp;Pass #0)?<br>
&emsp;&emsp;&emsp;☐  49   ☐  50   ☐  2,450   ☐  2,500   ☐  117,649   ☐  120,050   ☐  125,000

&emsp;(d) **\[4 points\]** Again, assuming that the DBMS has 50 buffers. What is the total I/O cost to<br>
&emsp;&emsp;&emsp;sort the file?<br>
&emsp;&emsp;&emsp;☐  4,000,000   ☐  16,000,000   ☐  32,000,000   ☐  64,000,000   ☐  96,000,000

&emsp;(e) **\[4 points\]** Suppose the DBMS has 67 buffers. What is the largest database file (ex-<br>
&emsp;&emsp;&emsp;pressed in terms of the number of pages) that can be sorted with external merge sort<br>
&emsp;&emsp;&emsp;using three passes?<br>
&emsp;&emsp;&emsp;☐  11,342   ☐  120,050   ☐  278,852   ☐  291,852   ☐  300,763<br>
&emsp;(f) **\[4 points\]** What is the smallest number of buffers B such that the DBMS can sort the<br>
&emsp;&emsp;&emsp;target file using only three passes?<br>
&emsp;&emsp;&emsp;☐  157   ☐  158   ☐  159   ☐  160   ☐  161

&emsp;(g) For each of the following statements about sorting, pick True or False.<br>
&emsp;&emsp;&emsp;i. **\[4 points\]** The DBMS receives a query that requires sorting. Assume that the sort<br>
&emsp;&emsp;&emsp;&emsp;order is a prefix of the index key. Under which scenario(s) will using an unclustered<br>
&emsp;&emsp;&emsp;&emsp;B+Tree index have comparable performance to a clustered B+Tree index:<br>
&emsp;&emsp;&emsp;&emsp;☐  The sort order exactly matches the index key.<br>
&emsp;&emsp;&emsp;&emsp;☐  Query contains a LIMIT 1, and the first tuple answers the query.<br>
&emsp;&emsp;&emsp;&emsp;☐  All attributes accessed by the query are contained in the index.<br>
&emsp;&emsp;&emsp;&emsp;☐  Using unclustered index will always perform worse than using clustered index.<br>
&emsp;&emsp;&emsp;&emsp;☐  None of the above.

&emsp;&emsp;&emsp;ii. **\[2 points\]** Sort aggregation cannot handle **can not** be used for all aggregates dis-<br>
&emsp;&emsp;&emsp;&emsp;cussed in lecture (i.e., “DISTINCT”, “GROUP BY”). For some of them, we have to<br>
&emsp;&emsp;&emsp;&emsp;use hash aggregation.<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False


### Question 1 continues...


---

<a id="page-3"></a>
**Page 3**

15-445/645 (Spring 2025)   Homework #4   Page 3 of 9

&emsp;&emsp;&emsp;iii. **\[2 points\]** It is always more efficient for a DBMS to use a hash aggregate than a<br>
&emsp;&emsp;&emsp;&emsp;sort aggregate.<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #4 continues...


---

<a id="page-4"></a>
**Page 4**

15-445/645 (Spring 2025)   Homework #4   Page 4 of 9


### **Question 2: Join Algorithms . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . \[44 points\]**

&emsp;Consider relations `X(a,` `b)`, `Y(a,` `c,` `e)`, and `Z(a,` `d,` `f)` to be joined on the common<br>
&emsp;attribute `a`. Assume that there are no indexes available on the tables to speed up the join<br>
&emsp;algorithms.<br>
&emsp;&emsp;• There are B = 450 pages in the buffer<br>
&emsp;&emsp;• Table `X` spans M = 1,500 pages with 200 tuples per page<br>
&emsp;&emsp;• Table `Y` spans N = 250 pages with 450 tuples per page<br>
&emsp;&emsp;• Table `Z` spans O = 2,000 pages with 140 tuples per page<br>
&emsp;&emsp;• The join result of `Y` and `Z` spans P = 170 pages<br>
&emsp;For the following questions, assume a simple cost model where pages are read and written one<br>
&emsp;at a time. Also assume that one buffer block is needed for the evolving output block and one<br>
&emsp;input block is needed for the current input block of the inner relation. You may ignore the cost<br>
&emsp;of the writing of the final results.

&emsp;(a) **\[2 points\]** What is the I/O cost of a simple nested loop join with `Y` as the outer relation<br>
&emsp;&emsp;&emsp;and `X` as the inner relation?<br>
&emsp;&emsp;&emsp;☐  300,250<br>
&emsp;&emsp;&emsp;☐  375,250<br>
&emsp;&emsp;&emsp;☐  675,250<br>
&emsp;&emsp;&emsp;☐  27,050,000<br>
&emsp;&emsp;&emsp;☐  60,750,250<br>
&emsp;&emsp;&emsp;☐  168,750,250

&emsp;(b) **\[2 points\]** What is the I/O cost of a block nested loop join with `Y` as the outer relation<br>
&emsp;&emsp;&emsp;and `Z` as the inner relation?<br>
&emsp;&emsp;&emsp;☐  1,650<br>
&emsp;&emsp;&emsp;☐  1,900<br>
&emsp;&emsp;&emsp;☐  2,100<br>
&emsp;&emsp;&emsp;☐  2,250<br>
&emsp;&emsp;&emsp;☐  2,700<br>
&emsp;&emsp;&emsp;☐  3,250<br>
&emsp;&emsp;&emsp;☐  3,450

&emsp;(c) **\[2 points\]** What is the I/O cost of a block nested loop join with `Z` as the outer relation<br>
&emsp;&emsp;&emsp;and `Y` as the inner relation?<br>
&emsp;&emsp;&emsp;☐  1,650<br>
&emsp;&emsp;&emsp;☐  1,900<br>
&emsp;&emsp;&emsp;☐  2,100<br>
&emsp;&emsp;&emsp;☐  2,250<br>
&emsp;&emsp;&emsp;☐  2,700


### Question 2 continues...


---

<a id="page-5"></a>
**Page 5**

15-445/645 (Spring 2025)   Homework #4   Page 5 of 9

&emsp;&emsp;&emsp;☐  3,250<br>
&emsp;&emsp;&emsp;☐  3,450

&emsp;(d) For a sort-merge join with `Z` as the outer relation and `X` as the inner relation:<br>
&emsp;&emsp;&emsp;i. **\[3 points\]** What is the cost of sorting the tuples in `X` on attribute `a`?<br>
&emsp;&emsp;&emsp;&emsp;☐  1,500<br>
&emsp;&emsp;&emsp;&emsp;☐  3,000<br>
&emsp;&emsp;&emsp;&emsp;☐  6,000<br>
&emsp;&emsp;&emsp;&emsp;☐  8,000<br>
&emsp;&emsp;&emsp;&emsp;☐  12,000

&emsp;&emsp;&emsp;ii. **\[3 points\]** What is the cost of sorting the tuples in `Z` on attribute `a`?<br>
&emsp;&emsp;&emsp;&emsp;☐  2,000<br>
&emsp;&emsp;&emsp;&emsp;☐  4,000<br>
&emsp;&emsp;&emsp;&emsp;☐  6,000<br>
&emsp;&emsp;&emsp;&emsp;☐  8,000<br>
&emsp;&emsp;&emsp;&emsp;☐  16,000

&emsp;&emsp;&emsp;iii. **\[3 points\]** What is the cost of the merge phase in the worst-case scenario?<br>
&emsp;&emsp;&emsp;&emsp;☐  340<br>
&emsp;&emsp;&emsp;&emsp;☐  1,640<br>
&emsp;&emsp;&emsp;&emsp;☐  3,500<br>
&emsp;&emsp;&emsp;&emsp;☐  28,000<br>
&emsp;&emsp;&emsp;&emsp;☐  210,000<br>
&emsp;&emsp;&emsp;&emsp;☐  2,800,000<br>
&emsp;&emsp;&emsp;&emsp;☐  3,000,000<br>
&emsp;&emsp;&emsp;&emsp;☐  3,250,000

&emsp;&emsp;&emsp;iv. **\[3 points\]** What is the cost of the merge phase assuming there are no duplicates in<br>
&emsp;&emsp;&emsp;&emsp;the join attribute?<br>
&emsp;&emsp;&emsp;&emsp;☐  340<br>
&emsp;&emsp;&emsp;&emsp;☐  1,640<br>
&emsp;&emsp;&emsp;&emsp;☐  3,500<br>
&emsp;&emsp;&emsp;&emsp;☐  28,000<br>
&emsp;&emsp;&emsp;&emsp;☐  210,000<br>
&emsp;&emsp;&emsp;&emsp;☐  2,800,000<br>
&emsp;&emsp;&emsp;&emsp;☐  3,000,000<br>
&emsp;&emsp;&emsp;&emsp;☐  3,250,000

&emsp;&emsp;&emsp;v. **\[3 points\]** Now consider joining `Y`, `Z` and then joining the result with `X`. What is the<br>
&emsp;&emsp;&emsp;&emsp;cost of the final merge phase assuming there are no duplicates in the join attribute?<br>
&emsp;&emsp;&emsp;&emsp;☐  420<br>
&emsp;&emsp;&emsp;&emsp;☐  1,670<br>
&emsp;&emsp;&emsp;&emsp;☐  1,920


### Question 2 continues...


---

<a id="page-6"></a>
**Page 6**

15-445/645 (Spring 2025)   Homework #4   Page 6 of 9

&emsp;&emsp;&emsp;&emsp;☐  2,170<br>
&emsp;&emsp;&emsp;&emsp;☐  28,000<br>
&emsp;&emsp;&emsp;&emsp;☐  63,000<br>
&emsp;&emsp;&emsp;&emsp;☐  90,000

&emsp;(e) **\[2 points\]** Consider a hash join with `Y` as the outer relation and `X` as the inner relation.<br>
&emsp;&emsp;&emsp;You may ignore recursive partitioning and partially filled blocks. What is the cost of the<br>
&emsp;&emsp;&emsp;combined probe and partition phases?<br>
&emsp;&emsp;&emsp;☐  2,250<br>
&emsp;&emsp;&emsp;☐  3,500<br>
&emsp;&emsp;&emsp;☐  5,000<br>
&emsp;&emsp;&emsp;☐  5,250<br>
&emsp;&emsp;&emsp;☐  6,750<br>
&emsp;&emsp;&emsp;☐  10,500

&emsp;(f) **\[3 points\]** Assume that the tables do not fit in main memory and that a large number of<br>
&emsp;&emsp;&emsp;distinct values hash to the same bucket using hash function h1. Which of the following<br>
&emsp;&emsp;&emsp;approaches works the best?<br>
&emsp;&emsp;&emsp;☐  Create two hashtables half the size of the original one, run the same hash join algo-<br>
&emsp;&emsp;&emsp;rithm on the tables, and then merge the hashtables together.<br>
&emsp;&emsp;&emsp;☐  Create hashtables for the inner and outer relation using h1 and rehash into an embed-<br>
&emsp;&emsp;&emsp;ded hash table using h2 != h1 for large buckets.<br>
&emsp;&emsp;&emsp;☐  Use linear probing for collisions and page in and out parts of the hashtable needed at<br>
&emsp;&emsp;&emsp;a given time.<br>
&emsp;&emsp;&emsp;☐  Create hashtables for the inner and outer relation using h1 and rehash into an embed-<br>
&emsp;&emsp;&emsp;ded hash table using h1 for large buckets.

&emsp;(g) For each of the following statements about joins, pick True or False.<br>
&emsp;&emsp;&emsp;i. **\[2 points\]** If both tables in a simple nested loop join fit entirely in memory, the order<br>
&emsp;&emsp;&emsp;&emsp;of inner and outer tables does not significantly affect I/O costs.<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False

&emsp;&emsp;&emsp;ii. **\[2 points\]** If neither table fits entirely in memory, I/O costs would be lower if we<br>
&emsp;&emsp;&emsp;&emsp;process both tables on a per-block basis rather than per-tuple basis.<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False

&emsp;&emsp;&emsp;iii. **\[3 points\]** A sort-merge join is faster than a hash join on all circumstances.<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False

&emsp;&emsp;&emsp;iv. **\[3 points\]** An index nested loop join requires an index on the outer- and inner- ta-<br>
&emsp;&emsp;&emsp;&emsp;bles.<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False


### Question 2 continues...


---

<a id="page-7"></a>
**Page 7**

15-445/645 (Spring 2025)   Homework #4   Page 7 of 9

&emsp;&emsp;&emsp;v. **\[3 points\]** For a hash join to work, the inner table (or its partitions) need to fit into<br>
&emsp;&emsp;&emsp;&emsp;memory.<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;&emsp;&emsp;vi. **\[5 points\]** A nested loop join can output a sorted stream of tuples under the follow-<br>
&emsp;&emsp;&emsp;&emsp;ing condition:<br>
&emsp;&emsp;&emsp;&emsp;☐  All nested loop joins can output a sorted stream.<br>
&emsp;&emsp;&emsp;&emsp;☐  No intra-operator parallelism.<br>
&emsp;&emsp;&emsp;&emsp;☐  Outer- table (or data) is already sorted.<br>
&emsp;&emsp;&emsp;&emsp;☐  Outer- table (or data) is sorted and no intra-operator parallelism.<br>
&emsp;&emsp;&emsp;&emsp;☐  Inner- table (or data) is already sorted.<br>
&emsp;&emsp;&emsp;&emsp;☐  Inner- table (or data) is sorted and no intra-operator parallelism.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #4 continues...


---

<a id="page-8"></a>
**Page 8**

15-445/645 (Spring 2025)   Homework #4   Page 8 of 9


### **Question 3: Query Execution, Planning, and Optimization . . . . . \[24 points\]**

&emsp;(a) **\[2 points\]** The iterator model allows tuples to continously flow through the entire se-<br>
&emsp;&emsp;&emsp;quence of operators in the execution plan before retrieving the next tuple.<br>
&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;(b) **\[2 points\]** Assume that the DBMS zone maps are up to date. The DBMS can use these<br>
&emsp;&emsp;&emsp;zone maps to answer specific queries without reading any actual table heap tuples:<br>
&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;(c) **\[2 points\]** Assuming a query with multiple `OR` predicates. Using a multi-index scan will<br>
&emsp;&emsp;&emsp;always perform better than a sequential scan.<br>
&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;(d) **\[2 points\]** For OLAP queries, which often involve complex operations on vast datasets,<br>
&emsp;&emsp;&emsp;intra-query parallelism is typically not preferred to optimize performance.<br>
&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;(e) **\[2 points\]** The process per DBMS worker approach provides better fault isolation and<br>
&emsp;&emsp;&emsp;scheduling control than the thread per DBMS worker approach.<br>
&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;(f) **\[2 points\]** In OLAP workload, the vectorized model’s performance improvements come<br>
&emsp;&emsp;&emsp;mainly from the reduction in the number of disk I/O operations.<br>
&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;(g) **\[2 points\]** The query optimizer in a database management system always guarantees the<br>
&emsp;&emsp;&emsp;generation of an optimal execution plan by exhaustively evaluating all possible plans to<br>
&emsp;&emsp;&emsp;ensure the lowest cost for query execution.<br>
&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;(h) **\[2 points\]** Predicate and projection pushdown will always improve query performance.<br>
&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;(i) **\[2 points\]** The execution plan with the lowest cost is guaranteed to be the most efficient<br>
&emsp;&emsp;&emsp;among all execution plans enumerated by the query optimizer.<br>
&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;(j) **\[2 points\]** Sampling statistics requires evaluating each tuple in the entire table.<br>
&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;(k) **\[2 points\]** Equi-depth histogram maintains counts for a group of values instead of each<br>
&emsp;&emsp;&emsp;unique key to reduce memory footprint and uses the same range size for each bucket.<br>
&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;(l) A database contains a single table: `University(id,name,state,city)`. You need to<br>
&emsp;&emsp;&emsp;estimate the cardinality of the following query:<br>
&emsp;&emsp;&emsp;`SELECT` `*` `FROM` `University WHERE` `state` `=` `‘PA’` `AND` `city` `=` `‘Pittsburgh’`<br>
&emsp;&emsp;&emsp;For the following questions, assume `University` has 5,000 rows with 6% having `state`<br>
&emsp;&emsp;&emsp;`=` `‘PA’`, and 0.6% having `city` `=` `‘Pittsburgh’`.


### Question 3 continues...


---

<a id="page-9"></a>
**Page 9**

15-445/645 (Spring 2025)   Homework #4   Page 9 of 9

&emsp;&emsp;&emsp;i. **\[1 point\]** Under uniform data assumption and independent predicates assumption,<br>
&emsp;&emsp;&emsp;&emsp;what is the estimated cardinality c of this query? Take ⌈c⌉of the result.<br>
&emsp;&emsp;&emsp;&emsp;☐  1   ☐  2   ☐  10   ☐  30   ☐  300

&emsp;&emsp;&emsp;ii. **\[1 point\]** Is the result from previous question an overestimate or underestimate of<br>
&emsp;&emsp;&emsp;&emsp;the true cardinality?<br>
&emsp;&emsp;&emsp;&emsp;☐  Overestimate   ☐  Underestimate

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;End of Homework #4

