# CMU 15-445 Fall 2023: Homework 3: Questions

> Copied from the original: <https://15445.courses.cs.cmu.edu/fall2023/assignments.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CARNEGIE MELLON UNIVERSITY<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;COMPUTER SCIENCE DEPARTMENT<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;15-445/645 – DATABASE SYSTEMS (FALL 2023)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;PROF. ANDY PAVLO AND JIGNESH PATEL

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #3 (by Anurag Choudhary)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Due: **Sunday, Oct 08, 2023 @ 11:59pm**

**IMPORTANT:**<br>
&emsp;• Enter all of your answers into **Gradescope by 11:59pm on Sunday, Oct 08, 2023**.<br>
&emsp;• **Plagiarism**: Homework may be discussed with other students, but all homework is to be<br>
&emsp;&emsp;completed **individually**.<br>
For your information:<br>
&emsp;• Graded out of **100** points; **3** questions total<br>
&emsp;• Rough time estimate: ≈1 - 2 hours (0.5 - 1 hours for each question)<br>
&emsp;Revision : 2023/09/29 19:08

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Question   Points   Score<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Sorting Algorithms   36<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Join Algorithms   43<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Bloom Filters   21<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Total:   100

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1


---

<a id="page-2"></a>
**Page 2**

15-445/645 (Fall 2023)   Homework #3   Page 2 of 7


### **Question 1: Sorting Algorithms . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . \[36 points\]**

&emsp;We have a database file with nine million pages (N = 9,000,000 pages), and we want to sort<br>
&emsp;it using external merge sort. Assume that the DBMS is not using double buffering or blocked<br>
&emsp;I/O, and that it uses quicksort for in-memory sorting. Let B denote the number of buffers.<br>
&emsp;(a) **\[6 points\]** Assume that the DBMS has fifty buffers. How many sorted runs are gener-<br>
&emsp;&emsp;&emsp;ated? Note that the final sorted file does not count towards the sorted run count.<br>
&emsp;&emsp;&emsp;☐  183,673   ☐  183,674   ☐  183,750   ☐  183,751   ☐  187,501   ☐  187,502

&emsp;(b) **\[6 points\]** Again, assuming that the DBMS has fifty buffers. How many pages (in gen-<br>
&emsp;&emsp;&emsp;eral) does each sorted run have after the third pass (i.e. Note: this is Pass #2 if you start<br>
&emsp;&emsp;&emsp;counting from Pass #0)?<br>
&emsp;&emsp;&emsp;☐  49   ☐  50   ☐  2,450   ☐  2,451   ☐  2,452   ☐  120,050   ☐  120,051<br>
&emsp;&emsp;&emsp;☐  120,052

&emsp;(c) **\[6 points\]** Again, assuming that the DBMS has fifty buffers. How many passes does the<br>
&emsp;&emsp;&emsp;DBMS need to perform in order to sort the file?<br>
&emsp;&emsp;&emsp;☐  1   ☐  2   ☐  3   ☐  4   ☐  5

&emsp;(d) **\[6 points\]** Suppose the DBMS has 100 buffers. What is the total I/O cost to sort the file?<br>
&emsp;&emsp;&emsp;☐  18,000,000   ☐  36,000,000   ☐  54,000,000   ☐  72,000,000   ☐  90,000,000

&emsp;(e) **\[6 points\]** What is the smallest number of buffers B such that the DBMS can sort the<br>
&emsp;&emsp;&emsp;target file using only three passes?<br>
&emsp;&emsp;&emsp;☐  55   ☐  56   ☐  208   ☐  209   ☐  3,000   ☐  3,001

&emsp;(f) **\[6 points\]** Suppose the DBMS has twenty-three buffers. What is the largest database<br>
&emsp;&emsp;&emsp;file (expressed in terms of the number of pages) that can be sorted with external merge<br>
&emsp;&emsp;&emsp;sort using four passes?<br>
&emsp;&emsp;&emsp;☐  10,648   ☐  11,132   ☐  12,167   ☐  234,256   ☐  244,904   ☐  279,841<br>
&emsp;&emsp;&emsp;☐  5,153,632   ☐  5,387,888   ☐  6,436,343   ☐  118,533,536

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #3 continues...


---

<a id="page-3"></a>
**Page 3**

15-445/645 (Fall 2023)   Homework #3   Page 3 of 7


### **Question 2: Join Algorithms . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . \[43 points\]**

&emsp;Consider relations `X(a,` `c)`, `Y(a,` `b,` `e)`, and `Z(a,` `d,` `f)` to be joined on the common<br>
&emsp;attribute `a`. Assume that there are no indexes available on the tables to speed up the join<br>
&emsp;algorithms.<br>
&emsp;&emsp;• There are B = 750 pages in the buffer<br>
&emsp;&emsp;• Table `X` spans M = 2,500 pages with 80 tuples per page<br>
&emsp;&emsp;• Table `Y` spans N = 600 pages with 300 tuples per page<br>
&emsp;&emsp;• Table `Z` spans O = 1,500 pages with 150 tuples per page<br>
&emsp;&emsp;• The join result of `X` and `Y` spans P = 500 pages<br>
&emsp;For the following questions, assume a simple cost model where pages are read and written one<br>
&emsp;at a time. Also assume that one buffer block is needed for the evolving output block and one<br>
&emsp;input block is needed for the current input block of the inner relation. You may ignore the cost<br>
&emsp;of the writing of the final results.

&emsp;(a) **\[3 points\]** What is the I/O cost of a simple nested loop join with `X` as the outer relation<br>
&emsp;&emsp;&emsp;and `Y` as the inner relation?<br>
&emsp;&emsp;&emsp;☐  50,500   ☐  200,600   ☐  202,500   ☐  1,502,500   ☐  120,000,600<br>
&emsp;&emsp;&emsp;☐  120,002,500   ☐  300,002,500

&emsp;(b) **\[3 points\]** What is the I/O cost of a block nested loop join with `Z` as the outer relation<br>
&emsp;&emsp;&emsp;and `Y` as the inner relation?<br>
&emsp;&emsp;&emsp;☐  1,500   ☐  2,100   ☐  2,700   ☐  3,000   ☐  3,300   ☐  3,600   ☐  3,900<br>
&emsp;&emsp;&emsp;☐  5,100

&emsp;(c) **\[3 points\]** What is the I/O cost of a block nested loop join with `Y` as the outer relation<br>
&emsp;&emsp;&emsp;and `Z` as the inner relation?<br>
&emsp;&emsp;&emsp;☐  1,500   ☐  2,100   ☐  2,700   ☐  3,000   ☐  3,300   ☐  3,600   ☐  3,900<br>
&emsp;&emsp;&emsp;☐  5,100

&emsp;(d) For a sort-merge join with `X` as the outer relation and `Z` as the inner relation:<br>
&emsp;&emsp;&emsp;i. **\[3 points\]** What is the cost of sorting the tuples in `X` on attribute `a`?<br>
&emsp;&emsp;&emsp;&emsp;☐  2,000   ☐  4,000   ☐  6,000   ☐  8,000   ☐  10,000   ☐  12,000

&emsp;&emsp;&emsp;ii. **\[3 points\]** What is the cost of sorting the tuples in `Z` on attribute `a`?<br>
&emsp;&emsp;&emsp;&emsp;☐  2,000   ☐  4,000   ☐  6,000   ☐  8,000   ☐  10,000   ☐  12,000

&emsp;&emsp;&emsp;iii. **\[3 points\]** What is the cost of the merge phase in the worst-case scenario?<br>
&emsp;&emsp;&emsp;&emsp;☐  1,500   ☐  2,000   ☐  2,500   ☐  4,000   ☐  900,000   ☐  2,000,000<br>
&emsp;&emsp;&emsp;&emsp;☐  3,250,000   ☐  3,750,000   ☐  4,500,000   ☐  5,000,000


### Question 2 continues...


---

<a id="page-4"></a>
**Page 4**

15-445/645 (Fall 2023)   Homework #3   Page 4 of 7

&emsp;&emsp;&emsp;iv. **\[3 points\]** What is the cost of the merge phase assuming there are no duplicates in<br>
&emsp;&emsp;&emsp;&emsp;the join attribute?<br>
&emsp;&emsp;&emsp;&emsp;☐  1,500   ☐  2,000   ☐  2,500   ☐  4,000   ☐  900,000   ☐  2,000,000<br>
&emsp;&emsp;&emsp;&emsp;☐  3,250,000   ☐  3,750,000   ☐  4,500,000   ☐  5,000,000

&emsp;&emsp;&emsp;v. **\[3 points\]** Now consider joining X, Y and then joining the result with Z. What is the<br>
&emsp;&emsp;&emsp;&emsp;cost of the final merge phase assuming there are no duplicates in the join attribute?<br>
&emsp;&emsp;&emsp;&emsp;☐  1,000   ☐  2,000   ☐  3,000   ☐  5,000   ☐  1,000,000

&emsp;(e) Consider a hash join with `Y` as the outer relation and `Z` as the inner relation. You may<br>
&emsp;&emsp;&emsp;ignore recursive partitioning and partially filled blocks.<br>
&emsp;&emsp;&emsp;i. **\[3 points\]** What is the cost of the probe phase?<br>
&emsp;&emsp;&emsp;&emsp;☐  1,000   ☐  2,000   ☐  2,100   ☐  4,200   ☐  6,400   ☐  7,200   ☐  10,000

&emsp;&emsp;&emsp;ii. **\[3 points\]** What is the cost of the partition phase?<br>
&emsp;&emsp;&emsp;&emsp;☐  1,000   ☐  2,000   ☐  2,100   ☐  4,200   ☐  6,400   ☐  7,200   ☐  10,000

&emsp;(f) **\[3 points\]** Assume that the tables do not fit in main memory and that a large number of<br>
&emsp;&emsp;&emsp;distinct values hash to the same bucket using hash function h1. Which of the following<br>
&emsp;&emsp;&emsp;approaches works the best?<br>
&emsp;&emsp;&emsp;☐  Create hashtables for the inner and outer relation using h1 and rehash into an embed-<br>
&emsp;&emsp;&emsp;ded hash table using h1 for large buckets.<br>
&emsp;&emsp;&emsp;☐  Use linear probing for collisions and page in and out parts of the hashtable needed at<br>
&emsp;&emsp;&emsp;a given time.<br>
&emsp;&emsp;&emsp;☐  Create hashtables for the inner and outer relation using h1 and rehash into an embed-<br>
&emsp;&emsp;&emsp;ded hash table using h2 != h1 for large buckets.<br>
&emsp;&emsp;&emsp;☐  Create two hashtables half the size of the original one, run the same hash join algo-<br>
&emsp;&emsp;&emsp;rithm on the tables, and then merge the hashtables together.

&emsp;(g) For each of the following statements about nested loop joins, pick True or False.<br>
&emsp;&emsp;&emsp;i. **\[2 points\]** In a simple nested loop join where both tables fit entirely in memory, the<br>
&emsp;&emsp;&emsp;&emsp;choice of which table to use as the inner/outer table significantly affects I/O costs.<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False

&emsp;&emsp;&emsp;ii. **\[2 points\]** In a simple nested loop join where one of the tables fits entirely in mem-<br>
&emsp;&emsp;&emsp;&emsp;ory, it is beneficial to use that table as the inner table.<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False

&emsp;&emsp;&emsp;iii. **\[2 points\]** If neither table fits entirely in memory, I/O costs would be lower if we<br>
&emsp;&emsp;&emsp;&emsp;process both tables on a per-block basis rather than per-tuple basis.<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False


### Question 2 continues...


---

<a id="page-5"></a>
**Page 5**

15-445/645 (Fall 2023)   Homework #3   Page 5 of 7

&emsp;&emsp;&emsp;iv. **\[2 points\]** For a block nested loop join, in the worst case, each block in the inner<br>
&emsp;&emsp;&emsp;&emsp;table has to be read once for each tuple in the outer table.<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False

&emsp;&emsp;&emsp;v. **\[2 points\]** In an index nested loop join where only one of the tables has an index on<br>
&emsp;&emsp;&emsp;&emsp;the join attribute, the choice of inner/outer tables should be made based on the table<br>
&emsp;&emsp;&emsp;&emsp;sizes.<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #3 continues...


---

<a id="page-6"></a>
**Page 6**

15-445/645 (Fall 2023)   Homework #3   Page 6 of 7


### **Question 3: Bloom Filters. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .\[21 points\]**

&emsp;Assume that we have a bloom filter that is used to register names. The filter uses two hash<br>
&emsp;functions h1 and h2 which hash the following strings to the following values:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;input   h1   h2<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;“Nas”   1973   1994<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;“Cole”   1985   2014<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;“Kendrick”   1987   2015<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;“Rocky”   1988   2013<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;“JID”   1990   2022<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;“Denzel”   1995   2018

&emsp;(a) **\[4 points\]** Suppose the filter has 6 bits initially set to 0:

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;bit 0   bit 1   bit 2   bit 3   bit 4   bit 5<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;0   0   0   0   0   0

&emsp;&emsp;&emsp;Which bits will be set to 1 after “Cole” and “JID” have been inserted?<br>
&emsp;&emsp;&emsp;☐  0   ☐  1   ☐  2   ☐  3   ☐  4   ☐  5

&emsp;(b) **\[3 points\]** If “Denzel” is inserted next, which bits will now be set to 1 (including those<br>
&emsp;&emsp;&emsp;already set in part (a))?<br>
&emsp;&emsp;&emsp;☐  0   ☐  1   ☐  2   ☐  3   ☐  4   ☐  5

&emsp;(c) **\[3 points\]** What will the filter return if we now lookup “Nas”?<br>
&emsp;&emsp;&emsp;☐  True   ☐  False

&emsp;(d) **\[3 points\]** Suppose the filter has 6 bits set to the following values:

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;bit 0   bit 1   bit 2   bit 3   bit 4   bit 5<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;0   1   0   1   0   1

&emsp;&emsp;&emsp;What will the filter return if we lookup “Rocky”?<br>
&emsp;&emsp;&emsp;☐  True   ☐  False

&emsp;(e) **\[3 points\]** What will the filter from part (d) return if we lookup “Kendrick”?<br>
&emsp;&emsp;&emsp;☐  True   ☐  False


### Question 3 continues...


---

<a id="page-7"></a>
**Page 7**

15-445/645 (Fall 2023)   Homework #3   Page 7 of 7

&emsp;(f) **\[5 points\]** Suppose the filter has 6 bits set to the following values:

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;bit 0   bit 1   bit 2   bit 3   bit 4   bit 5<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;0   0   1   1   0   1

&emsp;&emsp;&emsp;Which names are guaranteed to have NOT been inserted?<br>
&emsp;&emsp;&emsp;☐  “Nas”   ☐  “Cole”   ☐  “Kendrick”   ☐  “Rocky”   ☐  “JID”   ☐  “Denzel”

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;End of Homework #3

