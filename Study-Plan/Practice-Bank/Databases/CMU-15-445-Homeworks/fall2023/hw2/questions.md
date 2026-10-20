# CMU 15-445 Fall 2023: Homework 2: Questions

> Copied from the original: <https://15445.courses.cs.cmu.edu/fall2023/assignments.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CARNEGIE MELLON UNIVERSITY<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;COMPUTER SCIENCE DEPARTMENT<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;15-445/645 – DATABASE SYSTEMS (FALL 2023)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;PROF. ANDY PAVLO AND JIGNESH PATEL

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #2 (by Wiam Eddahri)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Due: **Sunday September 24 2023 @ 11:59pm**

**IMPORTANT:**<br>
&emsp;• Enter all of your answers into **Gradescope by 11:59pm on Sunday September 24 2023.**<br>
&emsp;• **Plagiarism**: Homework may be discussed with other students, but all homework is to be<br>
&emsp;&emsp;completed **individually**.<br>
For your information:<br>
&emsp;• Graded out of **100** points; **3** questions total<br>
&emsp;• Rough time estimate: ≈4-6 hours (1-1.5 hours for each question)<br>
&emsp;Revision : 2023/09/15 10:33

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Question   Points   Score<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Storage Models   16<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Extendible Hashing   19<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;B+Tree   65<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Total:   100

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1


---

<a id="page-2"></a>
**Page 2**

15-445/645 (Fall 2023)   Homework #2   Page 2 of 11


### **Question 1: Storage Models . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . \[16 points\]**

&emsp;Consider a database with a single table `T(andrew` `id,full` `name,graduation` `year,`<br>
&emsp;`department,gpa)`, where `andrew` `id` is the primary key, and all attributes are the same fixed<br>
&emsp;width. Suppose `T` has 5,000 tuples that fit into 500 pages, Ignore any additional storage over-<br>
&emsp;head for the table (e.g., page headers, tuple headers). Additionally, you should make the<br>
&emsp;following assumptions:<br>
&emsp;&emsp;• The DBMS does not have any additional meta-data (e.g., sort order, zone maps).<br>
&emsp;&emsp;• `T` does not have any indexes (including for primary key `andrew` `id`)<br>
&emsp;&emsp;• None of `T`’s pages are already in the buffer pool.<br>
&emsp;&emsp;• Content-wise, the tuples of `T` will make each query run the longest possible (this assump-<br>
&emsp;&emsp;&emsp;tion is critical for solving part **(a)**)<br>
&emsp;&emsp;• The tuples of `T` can be in any order (this assumption is critical for solving part **(b)** when<br>
&emsp;&emsp;&emsp;you compute the minimum versus maximum number of pages that the DBMS will poten-<br>
&emsp;&emsp;&emsp;tially have to read)

&emsp;(a) Consider the following query:


![Figure on page 2](figures/questions-p02-fig01.png)

&emsp;&emsp;&emsp;i. **\[4 points\]** Suppose the DBMS uses the decomposition storage model (DSM) with<br>
&emsp;&emsp;&emsp;&emsp;implicit offsets. How many pages will the DBMS potentially have to read from disk<br>
&emsp;&emsp;&emsp;&emsp;to answer this query? (Keep in mind our assumption about the contents of `T`!)<br>
&emsp;&emsp;&emsp;&emsp;☐  1-100   ☐  101-200   ☐  201-300   ☐  301-500   ☐  ≥501   ☐  Not possible<br>
&emsp;&emsp;&emsp;&emsp;to determine

&emsp;&emsp;&emsp;ii. **\[4 points\]** Suppose the DBMS uses the N-ary storage model (NSM). How many<br>
&emsp;&emsp;&emsp;&emsp;pages will the DBMS potentially have to read from disk to answer this query? (Keep<br>
&emsp;&emsp;&emsp;&emsp;in mind our assumption about the contents of `T`!)<br>
&emsp;&emsp;&emsp;&emsp;☐  1-200   ☐  201-300   ☐  301-400   ☐  401-500   ☐  ≥501   ☐  Not possible<br>
&emsp;&emsp;&emsp;&emsp;to determine

&emsp;(b) Now consider the following query:


![Figure on page 2](figures/questions-p02-fig02.png)

&emsp;&emsp;&emsp;i. Suppose the DBMS uses the decomposition storage model (DSM) with implicit off-<br>
&emsp;&emsp;&emsp;&emsp;sets.<br>
&emsp;&emsp;&emsp;&emsp;α) **\[4 points\]** What is the minimum number of pages that the DBMS will poten-<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;tially have to read from disk to answer this query?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  1   ☐  2-5   ☐  100-200   ☐  201-299   ☐  ≥300   ☐  Not possible to


### Question 1 continues...


---

<a id="page-3"></a>
**Page 3**

15-445/645 (Fall 2023)   Homework #2   Page 3 of 11

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;determine

&emsp;&emsp;&emsp;&emsp;&emsp;β) **\[4 points\]** What is the maximum number of pages that the DBMS will poten-<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;tially have to read from disk to answer this query?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  1   ☐  2-5   ☐  100-200   ☐  201-299   ☐  ≥300   ☐  Not possible to<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;determine

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #2 continues...


---

<a id="page-4"></a>
**Page 4**

15-445/645 (Fall 2023)   Homework #2   Page 4 of 11


### **Question 2: Extendible Hashing. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .\[19 points\]**

&emsp;Consider an extendible hashing structure such that:<br>
&emsp;&emsp;• Each bucket can hold up to four records.<br>
&emsp;&emsp;• The hashing function uses the lowest g bits, where g is the global depth.<br>
&emsp;&emsp;• A new extendible hashing structure is initialized with g = 0 and one empty bucket<br>
&emsp;(a) Starting from an empty table, insert keys 0, 1, 4, 5.<br>
&emsp;&emsp;&emsp;i. **\[2 points\]** What is the global depth of the resulting table?<br>
&emsp;&emsp;&emsp;&emsp;☐  0   ☐  1   ☐  2   ☐  3   ☐  4   ☐  None of the above<br>
&emsp;&emsp;&emsp;ii. **\[2 points\]** What is the local depth of the bucket containing 5?<br>
&emsp;&emsp;&emsp;&emsp;☐  0   ☐  1   ☐  2   ☐  3   ☐  4   ☐  None of the above<br>
&emsp;(b) Starting from the result in **(a)**, you insert keys 10, 11, 12, 13.<br>
&emsp;&emsp;&emsp;i. **\[2 points\]** What is the global depth of the resulting table?<br>
&emsp;&emsp;&emsp;&emsp;☐  0   ☐  1   ☐  2   ☐  3   ☐  4   ☐  None of the above<br>
&emsp;&emsp;&emsp;ii. **\[2 points\]** What is the local depth of the bucket containing 11?<br>
&emsp;&emsp;&emsp;&emsp;☐  0   ☐  1   ☐  2   ☐  3   ☐  4   ☐  None of the above<br>
&emsp;(c) Starting from the result in **(c)**, you insert keys 2 and 14.<br>
&emsp;&emsp;&emsp;i. **\[2 points\]** What is the global depth of the resulting table?<br>
&emsp;&emsp;&emsp;&emsp;☐  0   ☐  1   ☐  2   ☐  3   ☐  4   ☐  None of the above<br>
&emsp;&emsp;&emsp;ii. **\[3 points\]** Starting from the result in **(c)**, you insert keys 15, 3 and 7, what is the<br>
&emsp;&emsp;&emsp;&emsp;global depth?<br>
&emsp;&emsp;&emsp;&emsp;☐  0   ☐  1   ☐  2   ☐  3   ☐  4   ☐  None of the above<br>
&emsp;&emsp;&emsp;iii. **\[3 points\]** Which value, if inserted, will hash to the same bucket as the bucket con-<br>
&emsp;&emsp;&emsp;&emsp;taining key 1?<br>
&emsp;&emsp;&emsp;&emsp;☐  3   ☐  7   ☐  11   ☐  All of the above   ☐  None of the above<br>
&emsp;(d) **\[3 points\]** Starting from the result in **(c)**, which **key(s)**, if inserted next, will cause a split<br>
&emsp;&emsp;&emsp;that doubles the table’s size?<br>
&emsp;&emsp;&emsp;☐  33   ☐  64   ☐  29   ☐  61   ☐  All of the above   ☐  None of the above

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #2 continues...


---

<a id="page-5"></a>
**Page 5**

15-445/645 (Fall 2023)   Homework #2   Page 5 of 11


### **Question 3: B+Tree. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .\[65 points\]**

&emsp;Consider the following B+tree.


![Figure on page 5](figures/questions-p05-fig03.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Figure 1: B+ Tree of order d = 5 and height h = 3.

&emsp;When answering the following questions, be sure to follow the procedures described in class<br>
&emsp;and in your textbook. You can make the following assumptions:<br>
&emsp;&emsp;• A left pointer in an internal node guides towards keys \< than its corresponding key, while<br>
&emsp;&emsp;&emsp;a right pointer guides towards keys ≥.<br>
&emsp;&emsp;2 ⌉.• A leaf node underflows when the number of **keys** goes below ⌈d−1<br>
&emsp;&emsp;2⌉.• An internal node underflows when the number of **pointers** goes below ⌈d

&emsp;&emsp;• You should always consider redistribution before trying to merge two nodes.<br>
&emsp;Note that B+ tree diagrams for this problem omit leaf pointers for convenience. The leaves of<br>
&emsp;actual B+ trees are linked together via pointers, forming a singly linked list allowing for quick<br>
&emsp;traversal through all keys.


### Question 3 continues...


---

<a id="page-6"></a>
**Page 6**

15-445/645 (Fall 2023)   Homework #2   Page 6 of 11

&emsp;(a) **\[5 points\]** How many tree nodes must be fetched to answer the following query: Get all<br>
&emsp;&emsp;&emsp;records with search key smaller than 42.<br>
&emsp;&emsp;&emsp;☐  6   ☐  7   ☐  5<br>
&emsp;&emsp;&emsp;☐  4   ☐  None


### Question 3 continues...


---

<a id="page-7"></a>
**Page 7**

15-445/645 (Fall 2023)   Homework #2   Page 7 of 11

&emsp;(b) **\[5 points\]** Insert 40∗into the B+tree. Select the resulting tree.<br>
&emsp;&emsp;&emsp;☐  A)


![Figure on page 7](figures/questions-p07-fig04.png)

&emsp;&emsp;&emsp;☐  B)


![Figure on page 7](figures/questions-p07-fig05.png)

&emsp;&emsp;&emsp;☐  C)


![Figure on page 7](figures/questions-p07-fig06.png)

&emsp;&emsp;&emsp;☐  D)


![Figure on page 7](figures/questions-p07-fig07.png)


### Question 3 continues...


---

<a id="page-8"></a>
**Page 8**

15-445/645 (Fall 2023)   Homework #2   Page 8 of 11

&emsp;(c) **\[5 points\]** Starting with the intial tree, delete 49∗. Select the resulting tree.<br>
&emsp;&emsp;&emsp;☐  A)


![Figure on page 8](figures/questions-p08-fig08.png)

&emsp;&emsp;&emsp;☐  B)


![Figure on page 8](figures/questions-p08-fig09.png)

&emsp;&emsp;&emsp;☐  C)


![Figure on page 8](figures/questions-p08-fig10.png)

&emsp;&emsp;&emsp;☐  D)


![Figure on page 8](figures/questions-p08-fig11.png)


### Question 3 continues...


---

<a id="page-9"></a>
**Page 9**

15-445/645 (Fall 2023)   Homework #2   Page 9 of 11

&emsp;(d) **\[5 points\]** Starting with the intial tree, delete 62∗and delete 68∗. Select the resulting<br>
&emsp;&emsp;&emsp;tree.<br>
&emsp;&emsp;&emsp;☐  A)


![Figure on page 9](figures/questions-p09-fig12.png)

&emsp;&emsp;&emsp;☐  B)


![Figure on page 9](figures/questions-p09-fig13.png)

&emsp;&emsp;&emsp;☐  C)


![Figure on page 9](figures/questions-p09-fig14.png)

&emsp;&emsp;&emsp;☐  D)


![Figure on page 9](figures/questions-p09-fig15.png)


### Question 3 continues...


---

<a id="page-10"></a>
**Page 10**

15-445/645 (Fall 2023)   Homework #2   Page 10 of 11


![Figure on page 10](figures/questions-p10-fig16.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Figure 2: B+tree with violations

&emsp;(e) The B+Tree shown in Figure 2 is invalid. That is, its nodes violate the correctness prop-<br>
&emsp;&emsp;&emsp;erties of B+Trees that we discussed in class. If the tree is invalid, select all the properties<br>
&emsp;&emsp;&emsp;that are violated for each node. If the node is valid, then select ‘None’. There will be **no**<br>
&emsp;&emsp;&emsp;partial credit for missing violations.<br>
&emsp;&emsp;&emsp;Note:<br>
&emsp;&emsp;&emsp;• If a node’s subtrees are not the same height, the balance property is violated at that<br>
&emsp;&emsp;&emsp;&emsp;node only.<br>
&emsp;&emsp;&emsp;• If a node’s subtrees contain values not in the range specified by the node’s separator<br>
&emsp;&emsp;&emsp;&emsp;keys, the separator keys property is violated at that node.

&emsp;&emsp;&emsp;i. **\[2 points\]** Which properties are violated by **Leaf 3**?<br>
&emsp;&emsp;&emsp;&emsp;☐  Key order property   ☐  Half-full property   ☐  Balance property<br>
&emsp;&emsp;&emsp;&emsp;☐  Separator keys   ☐  None<br>
&emsp;&emsp;&emsp;ii. **\[2 points\]** Which properties are violated by **Leaf 1**?<br>
&emsp;&emsp;&emsp;&emsp;☐  Key order property   ☐  Half-full property   ☐  Balance property<br>
&emsp;&emsp;&emsp;&emsp;☐  Separator keys   ☐  None<br>
&emsp;&emsp;&emsp;iii. **\[2 points\]** Which properties are violated by **Internal Node 1**?<br>
&emsp;&emsp;&emsp;&emsp;☐  Key order property   ☐  Half-full property   ☐  Balance property<br>
&emsp;&emsp;&emsp;&emsp;☐  Separator keys   ☐  None<br>
&emsp;&emsp;&emsp;iv. **\[2 points\]** Which properties are violated by **Internal Node 2**?<br>
&emsp;&emsp;&emsp;&emsp;☐  Key order property   ☐  Half-full property   ☐  Balance property<br>
&emsp;&emsp;&emsp;&emsp;☐  Separator keys   ☐  None<br>
&emsp;&emsp;&emsp;v. **\[2 points\]** Which properties are violated by **Root**?<br>
&emsp;&emsp;&emsp;&emsp;☐  Key order property   ☐  Half-full property   ☐  Balance property<br>
&emsp;&emsp;&emsp;&emsp;☐  Separator keys   ☐  None<br>
&emsp;(f)i. **\[5 points\]** A DBMS may potentially use separate buffer pools for a B+Tree’s inner<br>
&emsp;&emsp;&emsp;&emsp;node pages and for its leaf node pages.<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;&emsp;&emsp;ii. **\[5 points\]** A read-only thread needs to hold at most two latches at the same time.<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False


### Question 3 continues...


---

<a id="page-11"></a>
**Page 11**

15-445/645 (Fall 2023)   Homework #2   Page 11 of 11

&emsp;&emsp;&emsp;iii. **\[5 points\]** A write thread needs to hold at most three write latches at the same time<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;&emsp;&emsp;iv. **\[5 points\]** A write thread might hold only one write latch (Consider a tree that has<br>
&emsp;&emsp;&emsp;&emsp;more than one leaf node)<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;&emsp;&emsp;v. **\[5 points\]** A read thread must release its latches in the order they were acquired<br>
&emsp;&emsp;&emsp;&emsp;(i.e., FIFO) to prevent concurrency errors.<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;&emsp;&emsp;vi. **\[5 points\]** A write thread must release its latches in the order they were acquired<br>
&emsp;&emsp;&emsp;&emsp;(i.e., FIFO) to prevent concurrency errors.<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;&emsp;&emsp;vii. **\[5 points\]** The minimum space utilization for a B+ tree index is 50 percent.<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;End of Homework #2

