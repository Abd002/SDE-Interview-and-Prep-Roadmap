# CMU 15-445 Spring 2024: Homework 3: Questions

> Copied from the original: <https://15445.courses.cs.cmu.edu/spring2024/assignments.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CARNEGIE MELLON UNIVERSITY<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;COMPUTER SCIENCE DEPARTMENT<br>
&emsp;&emsp;&emsp;&emsp;&emsp;15-445/645 – DATABASE SYSTEMS (SPRING 2024)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;PROF. JIGNESH PATEL

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #3 (by Yuchen and Ruijie)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Due: **Sunday, Feb 25, 2024 @ 11:59pm**

**IMPORTANT:**<br>
&emsp;• Enter all of your answers into **Gradescope by 11:59pm on Sunday, Feb 25, 2024**.<br>
&emsp;• **Plagiarism**: Homework may be discussed with other students, but all homework is to be<br>
&emsp;&emsp;completed **individually**.<br>
For your information:<br>
&emsp;• Graded out of **100** points; **3** questions total<br>
&emsp;• Rough time estimate: ≈2 - 3 hours (0.5 - 1 hours for each question)<br>
&emsp;Revision : 2024/02/20 13:55

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Question   Points   Score<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Sorting Algorithms   36<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Join Algorithms   43<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Bloom Filter   21<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Total:   100

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1


---

<a id="page-2"></a>
**Page 2**

15-445/645 (Spring 2024)   Homework #3   Page 2 of 6


### **Question 1: Sorting Algorithms . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . \[36 points\]**

&emsp;We have a database file with 1 million pages (N = 1,000,000 pages), and we want to sort it<br>
&emsp;using external merge sort. Assume that the DBMS is not using double buffering or blocked<br>
&emsp;I/O, and that it uses quicksort for in-memory sorting. Let B denote the number of buffers.<br>
&emsp;(a) **\[6 points\]** Assume that the DBMS has 30 buffers. How many sorted runs are generated?<br>
&emsp;&emsp;&emsp;Note that the final sorted file does not count towards the sorted run count.<br>
&emsp;&emsp;&emsp;☐  34521   ☐  34524   ☐  34525   ☐  34526   ☐  34528

&emsp;(b) **\[6 points\]** Again, assuming that the DBMS has 30 buffers. How many passes does the<br>
&emsp;&emsp;&emsp;DBMS need to perform in order to sort the file?<br>
&emsp;&emsp;&emsp;☐  1   ☐  2   ☐  3   ☐  4   ☐  5

&emsp;(c) **\[6 points\]** Again, assuming that the DBMS has 30 buffers. How many pages does each<br>
&emsp;&emsp;&emsp;sorted run have after the third pass (i.e. Note: this is Pass #2 if you start counting from<br>
&emsp;&emsp;&emsp;Pass #0)?<br>
&emsp;&emsp;&emsp;☐  29   ☐  30   ☐  31   ☐  841   ☐  870   ☐  900   ☐  24389   ☐  25230

&emsp;(d) **\[6 points\]** Again, assuming that the DBMS has 30 buffers. What is the total I/O cost to<br>
&emsp;&emsp;&emsp;sort the file?<br>
&emsp;&emsp;&emsp;☐  2,000,000   ☐  5,000,000   ☐  10,000,000   ☐  20,000,000   ☐  100,000,000

&emsp;(e) **\[6 points\]** What is the smallest number of buffers B such that the DBMS can sort the<br>
&emsp;&emsp;&emsp;target file using only three passes?<br>
&emsp;&emsp;&emsp;☐  97   ☐  98   ☐  99   ☐  100   ☐  101   ☐  102   ☐  103

&emsp;(f) **\[6 points\]** Suppose the DBMS has 410 buffers. What is the largest database file (ex-<br>
&emsp;&emsp;&emsp;pressed in terms of the number of pages) that can be sorted with external merge sort<br>
&emsp;&emsp;&emsp;using three passes?<br>
&emsp;&emsp;&emsp;☐  167,281   ☐  167,690   ☐  168,100   ☐  68,417,929   ☐  68,585,210<br>
&emsp;&emsp;&emsp;☐  68,752,900   ☐  68,921,000   ☐  28,051,350,890   ☐  28,119,936,100

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #3 continues...


---

<a id="page-3"></a>
**Page 3**

15-445/645 (Spring 2024)   Homework #3   Page 3 of 6


### **Question 2: Join Algorithms . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . \[43 points\]**

&emsp;Consider relations `X(a,` `b)`, `Y(a,` `c,` `d)`, and `Z(a,` `e,` `f)` to be joined on the common<br>
&emsp;attribute `a`. Assume that there are no indexes available on the tables to speed up the join<br>
&emsp;algorithms.<br>
&emsp;&emsp;• There are B = 645 pages in the buffer<br>
&emsp;&emsp;• Table `X` spans M = 2,400 pages with 60 tuples per page<br>
&emsp;&emsp;• Table `Y` spans N = 500 pages with 240 tuples per page<br>
&emsp;&emsp;• Table `Z` spans O = 1,800 pages with 100 tuples per page<br>
&emsp;&emsp;• The join result of `Y` and `Z` spans P = 300 pages<br>
&emsp;For the following questions, assume a simple cost model where pages are read and written one<br>
&emsp;at a time. Also assume that one buffer block is needed for the evolving output block and one<br>
&emsp;input block is needed for the current input block of the inner relation. You may ignore the cost<br>
&emsp;of the writing of the final results.

&emsp;(a) **\[3 points\]** What is the I/O cost of a simple nested loop join with `Y` as the outer relation<br>
&emsp;&emsp;&emsp;and `X` as the inner relation?<br>
&emsp;&emsp;&emsp;☐  200,600   ☐  576,500   ☐  1,200,500   ☐  72,002,400   ☐  120,000,600<br>
&emsp;&emsp;&emsp;☐  288,000,500

&emsp;(b) **\[3 points\]** What is the I/O cost of a block nested loop join with `Y` as the outer relation<br>
&emsp;&emsp;&emsp;and `Z` as the inner relation?<br>
&emsp;&emsp;&emsp;☐  1,500   ☐  1,900   ☐  2,300   ☐  3,000   ☐  3,300   ☐  3,600   ☐  3,900<br>
&emsp;&emsp;&emsp;☐  5,100

&emsp;(c) **\[3 points\]** What is the I/O cost of a block nested loop join with `Z` as the outer relation<br>
&emsp;&emsp;&emsp;and `Y` as the inner relation?<br>
&emsp;&emsp;&emsp;☐  1,500   ☐  1,900   ☐  2,300   ☐  3,000   ☐  3,300   ☐  3,600   ☐  3,900<br>
&emsp;&emsp;&emsp;☐  5,100

&emsp;(d) For a sort-merge join with `Z` as the outer relation and `X` as the inner relation:<br>
&emsp;&emsp;&emsp;i. **\[3 points\]** What is the cost of sorting the tuples in `X` on attribute `a`?<br>
&emsp;&emsp;&emsp;&emsp;☐  2,400   ☐  4,800   ☐  7,200   ☐  9,600   ☐  14,400

&emsp;&emsp;&emsp;ii. **\[3 points\]** What is the cost of sorting the tuples in `Z` on attribute `a`?<br>
&emsp;&emsp;&emsp;&emsp;☐  2,400   ☐  4,800   ☐  7,200   ☐  9,600   ☐  14,400

&emsp;&emsp;&emsp;iii. **\[3 points\]** What is the cost of the merge phase in the worst-case scenario?<br>
&emsp;&emsp;&emsp;&emsp;☐  1,500   ☐  2,000   ☐  2,500   ☐  4,200   ☐  900,000   ☐  2,000,000<br>
&emsp;&emsp;&emsp;&emsp;☐  3,250,000   ☐  3,750,000   ☐  4,320,000   ☐  5,000,000


### Question 2 continues...


---

<a id="page-4"></a>
**Page 4**

15-445/645 (Spring 2024)   Homework #3   Page 4 of 6

&emsp;&emsp;&emsp;iv. **\[3 points\]** What is the cost of the merge phase assuming there are no duplicates in<br>
&emsp;&emsp;&emsp;&emsp;the join attribute?<br>
&emsp;&emsp;&emsp;&emsp;☐  1,500   ☐  2,000   ☐  2,500   ☐  4,200   ☐  900,000   ☐  2,000,000<br>
&emsp;&emsp;&emsp;&emsp;☐  3,250,000   ☐  3,750,000   ☐  4,500,000   ☐  5,000,000

&emsp;&emsp;&emsp;v. **\[3 points\]** Now consider joining `Y`, `Z` and then joining the result with `X`. What is the<br>
&emsp;&emsp;&emsp;&emsp;cost of the final merge phase assuming there are no duplicates in the join attribute?<br>
&emsp;&emsp;&emsp;&emsp;☐  1,000   ☐  2,000   ☐  2,700   ☐  4,700   ☐  4,320,000

&emsp;(e) Consider a hash join with `Y` as the outer relation and `X` as the inner relation. You may<br>
&emsp;&emsp;&emsp;ignore recursive partitioning and partially filled blocks.<br>
&emsp;&emsp;&emsp;i. **\[3 points\]** What is the cost of the probe phase?<br>
&emsp;&emsp;&emsp;&emsp;☐  2,000   ☐  2,700   ☐  2,800   ☐  2,900   ☐  3,000   ☐  5,400   ☐  10,000

&emsp;&emsp;&emsp;ii. **\[3 points\]** What is the cost of the partition phase?<br>
&emsp;&emsp;&emsp;&emsp;☐  2,000   ☐  2,400   ☐  2,900   ☐  5,800   ☐  6,000   ☐  8,700   ☐  10,000

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
&emsp;&emsp;&emsp;i. **\[2 points\]** In a simple nested loop join where one of the tables fits entirely in mem-<br>
&emsp;&emsp;&emsp;&emsp;ory, it is beneficial to use that table as the inner table.<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False

&emsp;&emsp;&emsp;ii. **\[2 points\]** If neither table fits entirely in memory, I/O costs would be lower if we<br>
&emsp;&emsp;&emsp;&emsp;process both tables on a per-block basis rather than per-tuple basis.<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False

&emsp;&emsp;&emsp;iii. **\[2 points\]** For a block nested loop join, in the worst case, each block in the inner<br>
&emsp;&emsp;&emsp;&emsp;table has to be read once for each tuple in the outer table.<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False


### Question 2 continues...


---

<a id="page-5"></a>
**Page 5**

15-445/645 (Spring 2024)   Homework #3   Page 5 of 6

&emsp;&emsp;&emsp;iv. **\[2 points\]** A sort-merge join is slower than a hash join on all circumstances.<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False

&emsp;&emsp;&emsp;v. **\[2 points\]** For a hash join to work, the inner table (or its partitions) need to fit into<br>
&emsp;&emsp;&emsp;&emsp;memory.<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #3 continues...


---

<a id="page-6"></a>
**Page 6**

15-445/645 (Spring 2024)   Homework #3   Page 6 of 6


### **Question 3: Bloom Filter. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .\[21 points\]**

&emsp;Assume that we have a bloom filter that is used to register database names. The filter uses two<br>
&emsp;hash functions h1 and h2 which hash the following strings to the following values:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;input   h1   h2<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;“ChiDB”   999   996<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;“YourSQL”   233   666<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;“RusTub”   235   468<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;“GooseDB”   721   445

&emsp;(a) **\[7 points\]** Suppose the filter has 7 bits initially set to 0:

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;bit 0   bit 1   bit 2   bit 3   bit 4   bit 5   bit 6<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;0   0   0   0   0   0   0

&emsp;&emsp;&emsp;Which bits will be set to 1 after “ChiDB” and “YourSQL” have been inserted?<br>
&emsp;&emsp;&emsp;☐  0   ☐  1   ☐  2   ☐  3   ☐  4   ☐  5   ☐  6<br>
&emsp;(b) **\[7 points\]** Suppose the filter has 7 bits set to the following values:

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;bit 0   bit 1   bit 2   bit 3   bit 4   bit 5   bit 6<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;0   1   0   0   1   1   1

&emsp;&emsp;&emsp;What will we learn if we lookup “RusTub”?<br>
&emsp;&emsp;&emsp;☐  RusTub has been inserted   ☐  RusTub has not been inserted<br>
&emsp;&emsp;&emsp;☐  RusTub may have been inserted<br>
&emsp;(c) **\[7 points\]** What will we learn using the filter from part (b) if we lookup “GooseDB”?<br>
&emsp;&emsp;&emsp;☐  GooseDB has been inserted   ☐  GooseDB has not been inserted<br>
&emsp;&emsp;&emsp;☐  GooseDB may have been inserted

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;End of Homework #3

