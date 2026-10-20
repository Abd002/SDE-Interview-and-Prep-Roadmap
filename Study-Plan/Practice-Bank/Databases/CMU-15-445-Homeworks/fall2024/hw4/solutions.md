# CMU 15-445 Fall 2024: Homework 4: Official solutions

> Copied from the original: <https://15445.courses.cs.cmu.edu/fall2024/assignments.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CARNEGIE MELLON UNIVERSITY<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;COMPUTER SCIENCE DEPARTMENT<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;15-445/645 – DATABASE SYSTEMS (FALL 2024)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;PROF. ANDY PAVLO

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #4 (by William) – Solutions<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Due: **Sunday, Nov 3, 2024 @ 11:59pm**

**IMPORTANT:**<br>
&emsp;• Enter all of your answers into **Gradescope by 11:59pm on Sunday, Nov 3, 2024**.<br>
&emsp;• **Plagiarism**: Homework may be discussed with other students, but all homework is to be<br>
&emsp;&emsp;completed **individually**.<br>
For your information:<br>
&emsp;• Graded out of **100** points; **3** questions total<br>
&emsp;• Rough time estimate: ≈2 - 3 hours (0.5 - 1 hours for each question)<br>
&emsp;Revision : 2024/11/19 17:11

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Question   Points   Score<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Sorting Algorithms   32<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Join Algorithms   44<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Query Execution, Planning, and Optimization   24<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Total:   100

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1


---

<a id="page-2"></a>
**Page 2**

15-445/645 (Fall 2024)   Homework #4   Page 2 of 10


### **Question 1: Sorting Algorithms . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . \[32 points\]**

&emsp;**Graded by:**<br>
&emsp;We have a database file with 6 million pages (N = 6,000,000 pages), and we want to sort it<br>
&emsp;using external merge sort. Assume that the DBMS is not using double buffering or blocked<br>
&emsp;I/O, and that it uses quicksort for in-memory sorting. Let B denote the number of buffers.<br>
&emsp;(a) **\[4 points\]** Assume that the DBMS has 80 buffers. How many sorted runs are generated?<br>
&emsp;&emsp;&emsp;Note that the final sorted file does not count towards the sorted run count.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **75963**<br>
&emsp;&emsp;&emsp;☐  75949   ☐  75950   ☐  75961   ☐  75962   ☐  75964<br>
&emsp;&emsp;&emsp;**Solution:**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;6, 000, 000      75, 000      950   <br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\+   +   = 75963<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;80   79   79

&emsp;(b) **\[4 points\]** Again, assuming that the DBMS has 80 buffers. How many passes does the<br>
&emsp;&emsp;&emsp;DBMS need to perform in order to sort the file?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **4**<br>
&emsp;&emsp;&emsp;☐  1   ☐  2   ☐  3   ☐  5<br>
&emsp;&emsp;&emsp;**Solution:**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;   N   <br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1 +   logB−1   = 1 + ⌈log79 (⌈6, 000, 000/80⌉)⌉<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;B<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;= 1 + 3 = 4

&emsp;(c) **\[4 points\]** Again, assuming that the DBMS has 80 buffers. How many pages does each<br>
&emsp;&emsp;&emsp;sorted run have after the second pass (i.e. Note: this is Pass #1 if you start counting from<br>
&emsp;&emsp;&emsp;Pass #0)?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **6320**<br>
&emsp;&emsp;&emsp;☐  79   ☐  80   ☐  81   ☐  6400   ☐  6480<br>
&emsp;&emsp;&emsp;**Solution:** On the first pass, B buffer pages will be used to create the sorted runs. From<br>
&emsp;&emsp;&emsp;the second pass onward, B-1 runs will be sorted through a K-way merge.<br>
&emsp;&emsp;&emsp;First pass: 80 pages for each sorted run. Second pass: 80 ∗79 = 6, 320 pages for each<br>
&emsp;&emsp;&emsp;sorted run.

&emsp;(d) **\[4 points\]** Again, assuming that the DBMS has 80 buffers. What is the total I/O cost to<br>
&emsp;&emsp;&emsp;sort the file?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **48,000,000**<br>
&emsp;&emsp;&emsp;☐  6,000,000   ☐  12,000,000   ☐  24,000,000   ☐  96,000,000<br>
&emsp;&emsp;&emsp;**Solution:** Cost = 2N × #passes = 2 × 6, 000, 000 × 4 = 48, 000, 000

&emsp;(e) **\[4 points\]** What is the smallest number of buffers B such that the DBMS can sort the<br>
&emsp;&emsp;&emsp;target file using only three passes?


### Question 1 continues...


---

<a id="page-3"></a>
**Page 3**

15-445/645 (Fall 2024)   Homework #4   Page 3 of 10<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **183**<br>
&emsp;&emsp;&emsp;☐  181   ☐  182   ☐  184   ☐  185<br>
&emsp;&emsp;&emsp;**Solution:** We want the smallest integer B such that N ≤B × (B −1)2. If B = 183,<br>
&emsp;&emsp;&emsp;then 6, 000, 000 ≤183 × 1822 = 6, 061, 692; any smaller value for B would fail.

&emsp;(f) **\[4 points\]** Suppose the DBMS has 107 buffers. What is the largest database file (ex-<br>
&emsp;&emsp;&emsp;pressed in terms of the number of pages) that can be sorted with external merge sort<br>
&emsp;&emsp;&emsp;using three passes?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **1,202,252**<br>
&emsp;&emsp;&emsp;☐  11,342   ☐  11,449   ☐  1,213,594   ☐  1,225,043<br>
&emsp;&emsp;&emsp;**Solution:** We want the largest integer N such that N ≤B ×(B −1)2. The largest such<br>
&emsp;&emsp;&emsp;value is B × (B −1)2 itself, which is 107 × 1062 = 1, 202, 252<br>
&emsp;(g) For each of the following statements about sorting, pick True or False.<br>
&emsp;&emsp;&emsp;i. **\[4 points\]** The DBMS receives a query that requires sorting. Assume that the sort<br>
&emsp;&emsp;&emsp;&emsp;order is a prefix of the index key. Under which scenario(s) will using an unclustered<br>
&emsp;&emsp;&emsp;&emsp;B+Tree index have comparable performance to a clustered B+Tree index:<br>
&emsp;&emsp;&emsp;&emsp;☐  The sort order exactly matches the index key.<br>
&emsp;&emsp;&emsp;&emsp;☒ **Query contains a LIMIT 1, and the first tuple answers the query.**<br>
&emsp;&emsp;&emsp;&emsp;☒ **All attributes accessed by the query are contained in the index.**<br>
&emsp;&emsp;&emsp;&emsp;☐  Using unclustered index will always perform worse than using clustered index.<br>
&emsp;&emsp;&emsp;&emsp;☐  None of the above.<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** If the query contains a LIMIT 1 and the first tuple answers the query,<br>
&emsp;&emsp;&emsp;&emsp;then both unclustered/clustered will make a single heap I/O. Hence, this is correct.

&emsp;&emsp;&emsp;&emsp;When all attributes accessed by the query are contained in the index, the DBMS can<br>
&emsp;&emsp;&emsp;&emsp;perform an index-only or covering scan and avoid accessing the heap. Hence, this<br>
&emsp;&emsp;&emsp;&emsp;is also correct.

&emsp;&emsp;&emsp;ii. **\[2 points\]** The DBMS can implement all aggregates discussed in lecture (i.e., “DIS-<br>
&emsp;&emsp;&emsp;&emsp;TINCT”, “GROUP BY”) with a sorting aggregate.<br>
&emsp;&emsp;&emsp;&emsp;☒ **True**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  False<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** All aggregates can be implemented as some form of (1) sort to form<br>
&emsp;&emsp;&emsp;&emsp;groups and (2) additional processing to then produce the answer.

&emsp;&emsp;&emsp;iii. **\[2 points\]** The DBMS should always use a hashing aggregate.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** If the aggregation query then has a further “ORDER BY”, the DBMS<br>
&emsp;&emsp;&emsp;&emsp;may benefit from using a sort aggregate instead.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #4 continues...


---

<a id="page-4"></a>
**Page 4**

15-445/645 (Fall 2024)   Homework #4   Page 4 of 10


### **Question 2: Join Algorithms . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . \[44 points\]**

&emsp;**Graded by:**<br>
&emsp;Consider relations `X(a,` `b)`, `Y(a,` `c,` `d)`, and `Z(a,` `e,` `f)` to be joined on the common<br>
&emsp;attribute `a`. Assume that there are no indexes available on the tables to speed up the join<br>
&emsp;algorithms.<br>
&emsp;&emsp;• There are B = 245 pages in the buffer<br>
&emsp;&emsp;• Table `X` spans M = 1,950 pages with 300 tuples per page<br>
&emsp;&emsp;• Table `Y` spans N = 150 pages with 600 tuples per page<br>
&emsp;&emsp;• Table `Z` spans O = 1,200 pages with 180 tuples per page<br>
&emsp;&emsp;• The join result of `Y` and `Z` spans P = 90 pages<br>
&emsp;For the following questions, assume a simple cost model where pages are read and written one<br>
&emsp;at a time. Also assume that one buffer block is needed for the evolving output block and one<br>
&emsp;input block is needed for the current input block of the inner relation. You may ignore the cost<br>
&emsp;of the writing of the final results.

&emsp;(a) **\[2 points\]** What is the I/O cost of a simple nested loop join with `Y` as the outer relation<br>
&emsp;&emsp;&emsp;and `X` as the inner relation?<br>
&emsp;&emsp;&emsp;☐  292,650<br>
&emsp;&emsp;&emsp;☐  585,150<br>
&emsp;&emsp;&emsp;☐  1,170,150<br>
&emsp;&emsp;&emsp;☐  54,000,150<br>
&emsp;&emsp;&emsp;☐  87,750,150<br>
&emsp;&emsp;&emsp;☒ **175,500,150**<br>
&emsp;&emsp;&emsp;**Solution:** N + n × M = 150 + 150 × 600 × 1, 950 = 175, 500, 150

&emsp;(b) **\[2 points\]** What is the I/O cost of a block nested loop join with `Y` as the outer relation<br>
&emsp;&emsp;&emsp;and `Z` as the inner relation?<br>
&emsp;&emsp;&emsp;☐  750<br>
&emsp;&emsp;&emsp;☐  1,200<br>
&emsp;&emsp;&emsp;☒ **1,350**<br>
&emsp;&emsp;&emsp;☐  1,800<br>
&emsp;&emsp;&emsp;☐  1,950<br>
&emsp;&emsp;&emsp;☐  2,100<br>
&emsp;&emsp;&emsp;☐  2,550<br>
&emsp;&emsp;&emsp;243⌉× 1, 200 = 150 + 1, 200 = 1, 350B−2⌉× O = 150 + ⌈150**Solution:** N + ⌈N

&emsp;(c) **\[2 points\]** What is the I/O cost of a block nested loop join with `Z` as the outer relation<br>
&emsp;&emsp;&emsp;and `Y` as the inner relation?


### Question 2 continues...


---

<a id="page-5"></a>
**Page 5**

15-445/645 (Fall 2024)   Homework #4   Page 5 of 10

&emsp;&emsp;&emsp;☐  750<br>
&emsp;&emsp;&emsp;☐  1,200<br>
&emsp;&emsp;&emsp;☐  1,350<br>
&emsp;&emsp;&emsp;☐  1,800<br>
&emsp;&emsp;&emsp;☒ **1,950**<br>
&emsp;&emsp;&emsp;☐  2,100<br>
&emsp;&emsp;&emsp;☐  2,550<br>
&emsp;&emsp;&emsp;243 ⌉× 150 = 1, 200 + 750 = 1, 950**Solution:** O + ⌈OB−2⌉× N = 1, 200 + ⌈1,200

&emsp;(d) For a sort-merge join with `Z` as the outer relation and `X` as the inner relation:<br>
&emsp;&emsp;&emsp;i. **\[3 points\]** What is the cost of sorting the tuples in `X` on attribute `a`?<br>
&emsp;&emsp;&emsp;&emsp;☐  1,950<br>
&emsp;&emsp;&emsp;&emsp;☐  3,900<br>
&emsp;&emsp;&emsp;&emsp;☐  4,800<br>
&emsp;&emsp;&emsp;&emsp;☒ **7,800**<br>
&emsp;&emsp;&emsp;&emsp;☐  15,600<br>
&emsp;&emsp;&emsp;&emsp;245 ⌉)⌉= 1 + 1 = 2B ⌉)⌉= 1 + ⌈log244(⌈1,950**Solution:** passes = 1 + ⌈logB−1(⌈M<br>
&emsp;&emsp;&emsp;&emsp;2M × passes = 2 × 1, 950 × 2 = 7, 800

&emsp;&emsp;&emsp;ii. **\[3 points\]** What is the cost of sorting the tuples in `Z` on attribute `a`?<br>
&emsp;&emsp;&emsp;&emsp;☐  2,400<br>
&emsp;&emsp;&emsp;&emsp;☒ **4,800**<br>
&emsp;&emsp;&emsp;&emsp;☐  7,200<br>
&emsp;&emsp;&emsp;&emsp;☐  9,600<br>
&emsp;&emsp;&emsp;&emsp;☐  14,400<br>
&emsp;&emsp;&emsp;&emsp;245 ⌉)⌉= 1 + 1 = 2**Solution:** passes = 1 + ⌈logB−1(⌈OB⌉)⌉= 1 + ⌈log244(⌈1,200<br>
&emsp;&emsp;&emsp;&emsp;2O × passes = 2 × 1, 200 × 2 = 4, 800

&emsp;&emsp;&emsp;iii. **\[3 points\]** What is the cost of the merge phase in the worst-case scenario?<br>
&emsp;&emsp;&emsp;&emsp;☐  1,200<br>
&emsp;&emsp;&emsp;&emsp;☐  1,950<br>
&emsp;&emsp;&emsp;&emsp;☐  3,150<br>
&emsp;&emsp;&emsp;&emsp;☐  180,000<br>
&emsp;&emsp;&emsp;&emsp;☐  292,500<br>
&emsp;&emsp;&emsp;&emsp;☐  2,046,000<br>
&emsp;&emsp;&emsp;&emsp;☒ **2,340,000**<br>
&emsp;&emsp;&emsp;&emsp;☐  2,634,000<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** O × M = 1, 200 × 1, 950 = 2, 340, 000

&emsp;&emsp;&emsp;iv. **\[3 points\]** What is the cost of the merge phase assuming there are no duplicates in


### Question 2 continues...


---

<a id="page-6"></a>
**Page 6**

15-445/645 (Fall 2024)   Homework #4   Page 6 of 10

&emsp;&emsp;&emsp;&emsp;the join attribute?<br>
&emsp;&emsp;&emsp;&emsp;☐  1,200<br>
&emsp;&emsp;&emsp;&emsp;☐  1,950<br>
&emsp;&emsp;&emsp;&emsp;☒ **3,150**<br>
&emsp;&emsp;&emsp;&emsp;☐  180,000<br>
&emsp;&emsp;&emsp;&emsp;☐  292,500<br>
&emsp;&emsp;&emsp;&emsp;☐  2,046,000<br>
&emsp;&emsp;&emsp;&emsp;☐  2,340,000<br>
&emsp;&emsp;&emsp;&emsp;☐  2,634,000<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** O + M = 1, 200 + 1, 950 = 3, 150

&emsp;&emsp;&emsp;v. **\[3 points\]** Now consider joining `Y`, `Z` and then joining the result with `X`. What is the<br>
&emsp;&emsp;&emsp;&emsp;cost of the final merge phase assuming there are no duplicates in the join attribute?<br>
&emsp;&emsp;&emsp;&emsp;☐  240<br>
&emsp;&emsp;&emsp;&emsp;☐  1,290<br>
&emsp;&emsp;&emsp;&emsp;☐  2,000<br>
&emsp;&emsp;&emsp;&emsp;☒ **2,040**<br>
&emsp;&emsp;&emsp;&emsp;☐  13,500<br>
&emsp;&emsp;&emsp;&emsp;☐  108,000<br>
&emsp;&emsp;&emsp;&emsp;☐  175,500<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** P + X = 90 + 1, 950 = 2, 040

&emsp;(e) **\[2 points\]** Consider a hash join with `Y` as the outer relation and `X` as the inner relation.<br>
&emsp;&emsp;&emsp;You may ignore recursive partitioning and partially filled blocks. What is the cost of the<br>
&emsp;&emsp;&emsp;combined probe and partition phases?<br>
&emsp;&emsp;&emsp;☐  2,100<br>
&emsp;&emsp;&emsp;☐  2,700<br>
&emsp;&emsp;&emsp;☐  4,050<br>
&emsp;&emsp;&emsp;☐  4,200<br>
&emsp;&emsp;&emsp;☒ **6,300**<br>
&emsp;&emsp;&emsp;☐  9,450<br>
&emsp;&emsp;&emsp;**Solution:** 3(N + M) = 6, 300

&emsp;(f) **\[3 points\]** Assume that the tables do not fit in main memory and that a large number of<br>
&emsp;&emsp;&emsp;distinct values hash to the same bucket using hash function h1. Which of the following<br>
&emsp;&emsp;&emsp;approaches works the best?<br>
&emsp;&emsp;&emsp;☐  Create two hashtables half the size of the original one, run the same hash join algorithm<br>
&emsp;&emsp;&emsp;on the tables, and then merge the hashtables together.<br>
&emsp;&emsp;&emsp;☒ **Create hashtables for the inner and outer relation using** h1 **and rehash into an**<br>
&emsp;&emsp;&emsp;**embedded hash table using** h2 **!=** h1 **for large buckets.**<br>
&emsp;&emsp;&emsp;☐  Use linear probing for collisions and page in and out parts of the hashtable needed at


### Question 2 continues...


---

<a id="page-7"></a>
**Page 7**

15-445/645 (Fall 2024)   Homework #4   Page 7 of 10

&emsp;&emsp;&emsp;a given time.<br>
&emsp;&emsp;&emsp;☐  Create hashtables for the inner and outer relation using h1 and rehash into an embedded<br>
&emsp;&emsp;&emsp;hash table using h1 for large buckets.

&emsp;&emsp;&emsp;**Solution:** Use Grace hash join with recursive partitioning, which is what the correct<br>
&emsp;&emsp;&emsp;option describes.

&emsp;(g) For each of the following statements about joins, pick True or False.<br>
&emsp;&emsp;&emsp;i. **\[2 points\]** If both tables in a simple nested loop join fit entirely in memory, the order<br>
&emsp;&emsp;&emsp;&emsp;of inner and outer tables does not significantly affect I/O costs.<br>
&emsp;&emsp;&emsp;&emsp;☒ **True**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  False<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** If both tables fit entirely in memory, then they can be read just once and<br>
&emsp;&emsp;&emsp;&emsp;therefore the order would not be very important.

&emsp;&emsp;&emsp;ii. **\[2 points\]** If neither table fits entirely in memory, I/O costs would be lower if we<br>
&emsp;&emsp;&emsp;&emsp;process both tables on a per-block basis rather than per-tuple basis.<br>
&emsp;&emsp;&emsp;&emsp;☒ **True**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  False<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** A block nested loop join has fewer disk accesses when compared to a<br>
&emsp;&emsp;&emsp;&emsp;simple nested loop join.

&emsp;&emsp;&emsp;iii. **\[3 points\]** A sort-merge join is faster than a hash join on all circumstances.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** Sort merge join can be just as fast as hash join under specific circum-<br>
&emsp;&emsp;&emsp;&emsp;stances. For example, if the sort merge is performed on already-sorted data (i.e.<br>
&emsp;&emsp;&emsp;&emsp;sort cost is 0 and overall cost is M+N), and the hash join is perform on data can fit<br>
&emsp;&emsp;&emsp;&emsp;entirely in memory where overall cost is M+N.

&emsp;&emsp;&emsp;iv. **\[3 points\]** An index nested loop join requires an index on the outer- and inner- ta-<br>
&emsp;&emsp;&emsp;&emsp;bles.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** An index nested loop join only requires the inner- table to have an index.<br>
&emsp;&emsp;&emsp;v. **\[3 points\]** For a hash join to work, the inner table (or its partitions) need to fit into<br>
&emsp;&emsp;&emsp;&emsp;memory.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** The inner table can be any size. Only outer table (or its partitions) need<br>
&emsp;&emsp;&emsp;&emsp;to fit in memory.<br>
&emsp;&emsp;&emsp;vi. **\[5 points\]** A nested loop join can output a sorted stream of tuples under the follow-<br>
&emsp;&emsp;&emsp;&emsp;ing condition:<br>
&emsp;&emsp;&emsp;&emsp;☐  All nested loop joins can output a sorted stream.


### Question 2 continues...


---

<a id="page-8"></a>
**Page 8**

15-445/645 (Fall 2024)   Homework #4   Page 8 of 10

&emsp;&emsp;&emsp;&emsp;☐  No intra-operator parallelism.<br>
&emsp;&emsp;&emsp;&emsp;☐  Outer- table (or data) is already sorted.<br>
&emsp;&emsp;&emsp;&emsp;☒ **Outer- table (or data) is sorted and no intra-operator parallelism.**<br>
&emsp;&emsp;&emsp;&emsp;☐  Inner- table (or data) is already sorted.<br>
&emsp;&emsp;&emsp;&emsp;☐  Inner- table (or data) is sorted and no intra-operator parallelism.<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** With no intra-operator parallelism, a nested loop join sequentially iter-<br>
&emsp;&emsp;&emsp;&emsp;ates through the outer- table to find matching tuples from the inner- table. If the<br>
&emsp;&emsp;&emsp;&emsp;outer- table is already sorted, the nested loop join will preserve its order.<br>
&emsp;&emsp;&emsp;&emsp;Grading Note: Due to ambiguity and the question being underspecified, all students<br>
&emsp;&emsp;&emsp;&emsp;were given credit for this question.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #4 continues...


---

<a id="page-9"></a>
**Page 9**

15-445/645 (Fall 2024)   Homework #4   Page 9 of 10


### **Question 3: Query Execution, Planning, and Optimization . . . . . \[24 points\]**

&emsp;**Graded by:**<br>
&emsp;(a) **\[3 points\]** Assume that the DBMS zone maps are up to date. The DBMS can use these<br>
&emsp;&emsp;&emsp;zone maps to answer specific queries without reading any actual table heap tuples:<br>
&emsp;&emsp;&emsp;☒ **True**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  False<br>
&emsp;&emsp;&emsp;**Solution:** True. If the zone maps are up-to-date, the DBMS could answer queries asking<br>
&emsp;&emsp;&emsp;for the minimum value of a given attribute (amongst others) by only looking at zone<br>
&emsp;&emsp;&emsp;maps.<br>
&emsp;(b) **\[3 points\]** Assuming a query with multiple `OR` predicates. Using a multi-index scan will<br>
&emsp;&emsp;&emsp;always perform better than a sequential scan.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;**Solution:** False. If the `OR` predicates cover enough of the table, it may be more perfor-<br>
&emsp;&emsp;&emsp;mant to use a sequential scan.<br>
&emsp;(c) **\[3 points\]** For OLAP queries, which often involve complex operations on vast datasets,<br>
&emsp;&emsp;&emsp;intra-query parallelism is typically not preferred to optimize performance.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;**Solution:** False. OLAP queries, characterized by their complex operations on large<br>
&emsp;&emsp;&emsp;volumes of data, can greatly benefit from intra-query parallelism. By executing the<br>
&emsp;&emsp;&emsp;operations of a single query in parallel, it helps in significantly decreasing the latency,<br>
&emsp;&emsp;&emsp;thus optimizing the performance of these types of queries.<br>
&emsp;(d) **\[3 points\]** The process per DBMS worker approach provides better fault isolation and<br>
&emsp;&emsp;&emsp;scheduling control than the thread per DBMS worker approach.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;**Solution:** False. While the process per DBMS worker approach does provide better<br>
&emsp;&emsp;&emsp;fault isolation, thread per worker gives the DBMS finer control over scheduling.<br>
&emsp;(e) **\[3 points\]** In OLAP workload, the vectorized model’s performance improvements come<br>
&emsp;&emsp;&emsp;mainly from the reduction in the number of disk I/O operations.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;**Solution:** False. While the Vectorized Model can reduce some I/O operations due to<br>
&emsp;&emsp;&emsp;its batch processing, its primary advantage is from reducing CPU overhead, optimizing<br>
&emsp;&emsp;&emsp;cache utilization, and leveraging SIMD instructions.<br>
&emsp;(f) **\[3 points\]** The query optimizer in a database management system always guarantees the<br>
&emsp;&emsp;&emsp;generation of an optimal execution plan by exhaustively evaluating all possible plans to<br>
&emsp;&emsp;&emsp;ensure the lowest cost for query execution.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;☐  True


### Question 3 continues...


---

<a id="page-10"></a>
**Page 10**

15-445/645 (Fall 2024)   Homework #4   Page 10 of 10

&emsp;&emsp;&emsp;**Solution:** No, it is usually not necessary to estimate the cost of every plan for a query<br>
&emsp;&emsp;&emsp;via a cost model. In this case, the time it would take to enumerate every plan and then<br>
&emsp;&emsp;&emsp;filter out the plans to pick the most optimal one would introduce too high of an overhead<br>
&emsp;&emsp;&emsp;compared to the query time itself. Usually, DBMSs will use rule-based optimizations<br>
&emsp;&emsp;&emsp;(or heuristics) first, transforming the plan into a more simple one.<br>
&emsp;(g) **\[3 points\]** Predicate and projection pushdown will always improve query performance.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;**Solution:** False. If the predicate/projection being pushed down involves an expensive<br>
&emsp;&emsp;&emsp;function call (i.e., UDF), the query may benefit from deferring it to later.<br>
&emsp;(h) **\[3 points\]** Sampling statistics requires evaluating each tuple in the entire table.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;**Solution:** False. Sampling only needs to look at a subset (or representative sample) of<br>
&emsp;&emsp;&emsp;the table.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;End of Homework #4

