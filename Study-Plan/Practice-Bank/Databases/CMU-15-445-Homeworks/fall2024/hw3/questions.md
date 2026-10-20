# CMU 15-445 Fall 2024: Homework 3: Questions

> Copied from the original: <https://15445.courses.cs.cmu.edu/fall2024/assignments.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CARNEGIE MELLON UNIVERSITY<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;COMPUTER SCIENCE DEPARTMENT<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;15-445/645 – DATABASE SYSTEMS (FALL 2024)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;PROF. ANDY PAVLO

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #3 (by William )<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Due: **Sunday October 6th, 2024 @ 11:59pm**

**IMPORTANT:**<br>
&emsp;• Enter all of your answers into **Gradescope by 11:59pm on Sunday October 6th, 2024.**<br>
&emsp;• **Plagiarism**: Homework may be discussed with other students, but all homework is to be<br>
&emsp;&emsp;completed **individually**.<br>
For your information:<br>
&emsp;• Graded out of **100** points; **5** questions total<br>
&emsp;• Rough time estimate: ≈4-6 hours (1-1.5 hours for each question)<br>
&emsp;Revision : 2024/09/26 21:43

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Question   Points   Score<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Linear Hashing and Cuckoo Hashing   18<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Extendible Hashing   20<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;B+Tree   27<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Bloom Filter   20<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Alternate Index Structures   15<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Total:   100

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1


---

<a id="page-2"></a>
**Page 2**

15-445/645 (Fall 2024)   Homework #3   Page 2 of 12


### **Question 1: Linear Hashing and Cuckoo Hashing . . . . . . . . . . . . . . \[18 points\]**

&emsp;For warmup, consider the following Linear Probe Hashing schema:<br>
&emsp;&emsp;1\. The table have a size of 4 slots, each slot can only contain one key value pair.<br>
&emsp;&emsp;2\. The hashing function is<br>
&emsp;&emsp;&emsp;h1(`x`) = `x` `%` `4`.<br>
&emsp;&emsp;3\. When there is conflict, it finds the next free slot to insert key value pairs.<br>
&emsp;&emsp;4\. The original table is empty.<br>
&emsp;&emsp;5\. Uses a tombstone when deleting a key.<br>
&emsp;(a) **\[2 points\]** Insert key/value pair `(1,A)` and `(7,B)`. For `(1,A)`, “1” is the key and “A” is<br>
&emsp;&emsp;&emsp;the value. Select the value in each entry of the resulting table.<br>
&emsp;&emsp;&emsp;i. Entry 0 (key % 4 = 0) ☐  A   ☐  B   ☐  Empty<br>
&emsp;&emsp;&emsp;ii. Entry 1 (key % 4 = 1) ☐  A   ☐  B   ☐  Empty<br>
&emsp;&emsp;&emsp;iii. Entry 2 (key % 4 = 2) ☐  A   ☐  B   ☐  Empty<br>
&emsp;&emsp;&emsp;iv. Entry 3 (key % 4 = 3) ☐  A   ☐  B   ☐  Empty

&emsp;(b) **\[2 points\]** After the changes from part **(a)**, delete `(1,` `A)`, insert key value `(5,` `D)`, and<br>
&emsp;&emsp;&emsp;lastly insert `(9,` `C)`. Select the value in each entry of the resulting table.<br>
&emsp;&emsp;&emsp;i. Entry 0 (key % 4 = 0) ☐  Tombstone   ☐  A   ☐  B   ☐  C   ☐  D   ☐  Empty<br>
&emsp;&emsp;&emsp;ii. Entry 1 (key % 4 = 1) ☐  Tombstone   ☐  A   ☐  B   ☐  C   ☐  D   ☐  Empty<br>
&emsp;&emsp;&emsp;iii. Entry 2 (key % 4 = 2) ☐  Tombstone   ☐  A   ☐  B   ☐  C   ☐  D   ☐  Empty<br>
&emsp;&emsp;&emsp;iv. Entry 3 (key % 4 = 3) ☐  Tombstone   ☐  A   ☐  B   ☐  C   ☐  D   ☐  Empty


### Question 1 continues...


---

<a id="page-3"></a>
**Page 3**

15-445/645 (Fall 2024)   Homework #3   Page 3 of 12

&emsp;Consider the following Cuckoo Hashing schema:<br>
&emsp;&emsp;1\. Both tables have a size of 4.<br>
&emsp;&emsp;2\. The hashing function of the first table returns the fourth and third least significant bits:<br>
&emsp;&emsp;&emsp;h1(`x`) = `(x` `>>` `2)` `&` `0b11`.<br>
&emsp;&emsp;3\. The hashing function of the second table returns the least significant two bits:<br>
&emsp;&emsp;&emsp;h2(`x`) = `x` `&` `0b11`.<br>
&emsp;&emsp;4\. When inserting, try table 1 first.<br>
&emsp;&emsp;5\. When replacement is necessary, first select an element in the second table.<br>
&emsp;&emsp;6\. The original entries in the table are shown in the figure below.


![Figure on page 3](figures/questions-p03-fig01.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Figure 1: Initial contents of the hash tables.

&emsp;(a) **\[2 points\]** Select the sequence of insert operations that results in the initial state.<br>
&emsp;&emsp;&emsp;☐  Insert 20, Insert 7   ☐  Insert 7, Insert 20   ☐  None of the above


### Question 1 continues...


---

<a id="page-4"></a>
**Page 4**

15-445/645 (Fall 2024)   Homework #3   Page 4 of 12

&emsp;(b) Starting from the initial contents, insert key `22` and then insert `38`. Select the values in the<br>
&emsp;&emsp;&emsp;resulting two tables.<br>
&emsp;&emsp;&emsp;i. Table 1<br>
&emsp;&emsp;&emsp;&emsp;α) **\[1 point\]** Entry 0 (`0b00`) ☐  20   ☐  7   ☐  22   ☐  38   ☐  Empty<br>
&emsp;&emsp;&emsp;&emsp;&emsp;β) **\[1 point\]** Entry 1 (`0b01`) ☐  20   ☐  7   ☐  22   ☐  38   ☐  Empty<br>
&emsp;&emsp;&emsp;&emsp;&emsp;γ) **\[1 point\]** Entry 2 (`0b10`) ☐  20   ☐  7   ☐  22   ☐  38   ☐  Empty<br>
&emsp;&emsp;&emsp;&emsp;&emsp;δ) **\[1 point\]** Entry 3 (`0b11`) ☐  20   ☐  7   ☐  22   ☐  38   ☐  Empty

&emsp;&emsp;&emsp;ii. Table 2<br>
&emsp;&emsp;&emsp;&emsp;α) **\[1 point\]** Entry 0 (`0b00`) ☐  20   ☐  7   ☐  22   ☐  38   ☐  Empty<br>
&emsp;&emsp;&emsp;&emsp;&emsp;β) **\[1 point\]** Entry 1 (`0b01`) ☐  20   ☐  7   ☐  22   ☐  38   ☐  Empty<br>
&emsp;&emsp;&emsp;&emsp;&emsp;γ) **\[1 point\]** Entry 2 (`0b10`) ☐  20   ☐  7   ☐  22   ☐  38   ☐  Empty<br>
&emsp;&emsp;&emsp;&emsp;&emsp;δ) **\[1 point\]** Entry 3 (`0b11`) ☐  20   ☐  7   ☐  22   ☐  38   ☐  Empty

&emsp;(c) **\[4 points\]** Consider completely empty tables using the same two hash functions. Select<br>
&emsp;&emsp;&emsp;which sequence of insertions below will cause an infinite loop.<br>
&emsp;&emsp;&emsp;☐  `[0,` `4,` `17,` `20]`<br>
&emsp;&emsp;&emsp;☐  `[0,` `4,` `16,` `20]`<br>
&emsp;&emsp;&emsp;☐  `[1,` `4,` `16,` `20]`<br>
&emsp;&emsp;&emsp;☐  `[1,` `5,` `17,` `22]`<br>
&emsp;&emsp;&emsp;☐  None of the above

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #3 continues...


---

<a id="page-5"></a>
**Page 5**

15-445/645 (Fall 2024)   Homework #3   Page 5 of 12


### **Question 2: Extendible Hashing. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .\[20 points\]**

&emsp;Consider an extendible hashing structure such that:<br>
&emsp;&emsp;• Each bucket can hold up to two records.<br>
&emsp;&emsp;• The hashing function uses the lowest g bits, where g is the global depth.<br>
&emsp;&emsp;• A new extendible hashing structure is initialized with g = 0 and one empty bucket<br>
&emsp;&emsp;• If multiple keys are provided in a question, assume they are inserted one after the other<br>
&emsp;&emsp;&emsp;from left to right.<br>
&emsp;(a) Starting from an empty table, insert keys 1, 2.<br>
&emsp;&emsp;&emsp;i. **\[1 point\]** What is the global depth of the resulting table?<br>
&emsp;&emsp;&emsp;&emsp;☐  0   ☐  1   ☐  2   ☐  3   ☐  4   ☐  None of the above<br>
&emsp;&emsp;&emsp;ii. **\[1 point\]** What is the local depth of the bucket containing 2?<br>
&emsp;&emsp;&emsp;&emsp;☐  0   ☐  1   ☐  2   ☐  3   ☐  4   ☐  None of the above<br>
&emsp;(b) Starting from the result in **(a)**, you insert keys 9, 11.<br>
&emsp;&emsp;&emsp;i. **\[2 points\]** What is the global depth of the resulting table?<br>
&emsp;&emsp;&emsp;&emsp;☐  0   ☐  1   ☐  2   ☐  3   ☐  4   ☐  None of the above<br>
&emsp;&emsp;&emsp;ii. **\[2 points\]** What are the local depths of the buckets for each key?<br>
&emsp;&emsp;&emsp;&emsp;☐  1 (Depth 1), 2 (Depth 1), 9 (Depth 1), 11 (Depth 1)<br>
&emsp;&emsp;&emsp;&emsp;☐  1 (Depth 3), 2 (Depth 1), 9 (Depth 3), 11 (Depth 3)<br>
&emsp;&emsp;&emsp;&emsp;☐  1 (Depth 2), 2 (Depth 1), 9 (Depth 2), 11 (Depth 2)<br>
&emsp;&emsp;&emsp;&emsp;☐  1 (Depth 3), 2 (Depth 1), 9 (Depth 3), 11 (Depth 2)<br>
&emsp;&emsp;&emsp;&emsp;☐  1 (Depth 2), 2 (Depth 2), 9 (Depth 2), 11 (Depth 2)<br>
&emsp;&emsp;&emsp;&emsp;☐  None of the above<br>
&emsp;(c) Starting from the result in **(b)**, you insert keys 13, 27.<br>
&emsp;&emsp;&emsp;i. **\[2 points\]** What is the global depth of the resulting table?<br>
&emsp;&emsp;&emsp;&emsp;☐  0   ☐  1   ☐  2   ☐  3   ☐  4   ☐  None of the above<br>
&emsp;&emsp;&emsp;ii. **\[2 points\]** What are the local depths of the buckets for each new key?<br>
&emsp;&emsp;&emsp;&emsp;☐  13 (Depth 1), 27 (Depth 1)<br>
&emsp;&emsp;&emsp;&emsp;☐  13 (Depth 1), 27 (Depth 2)<br>
&emsp;&emsp;&emsp;&emsp;☐  13 (Depth 2), 27 (Depth 2)<br>
&emsp;&emsp;&emsp;&emsp;☐  13 (Depth 3), 27 (Depth 2)<br>
&emsp;&emsp;&emsp;&emsp;☐  13 (Depth 3), 27 (Depth 3)<br>
&emsp;&emsp;&emsp;&emsp;☐  None of the above<br>
&emsp;(d) **\[3 points\]** Starting from **(c)**’s result, which **key(s)**, if inserted next, will **not** cause a split?<br>
&emsp;&emsp;&emsp;☐  5   ☐  17   ☐  43   ☐  8   ☐  None of the above<br>
&emsp;(e) **\[3 points\]** Starting from the result in **(c)**, which **key(s)**, if inserted next, will cause a split<br>
&emsp;&emsp;&emsp;and increase the table’s global depth?<br>
&emsp;&emsp;&emsp;☐  0   ☐  3   ☐  5   ☐  17   ☐  None of the above<br>
&emsp;(f) **\[4 points\]** Starting from an empty table, insert keys 32, 64, 128, 512. What is the global<br>
&emsp;&emsp;&emsp;depth of the resulting table?<br>
&emsp;&emsp;&emsp;☐  4   ☐  5   ☐  6   ☐  7   ☐  8   ☐  ≥9

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #3 continues...


---

<a id="page-6"></a>
**Page 6**

15-445/645 (Fall 2024)   Homework #3   Page 6 of 12


### **Question 3: B+Tree. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .\[27 points\]**

&emsp;Consider the following B+tree.


![Figure on page 6](figures/questions-p06-fig02.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Figure 2: B+ Tree of order d = 4 and height h = 2.

&emsp;When answering the following questions, be sure to follow the procedures described in class<br>
&emsp;and in your textbook. You can make the following assumptions:<br>
&emsp;&emsp;• A left pointer in an internal node guides towards keys \< than its corresponding key, while<br>
&emsp;&emsp;&emsp;a right pointer guides towards keys ≥.<br>
&emsp;&emsp;2 ⌉.• A leaf node underflows when the number of **keys** goes below ⌈d−1<br>
&emsp;&emsp;2⌉.• An internal node underflows when the number of **pointers** goes below ⌈d

&emsp;Note that B+ tree diagrams for this problem omit leaf pointers for convenience. The leaves of<br>
&emsp;actual B+ trees are linked together via pointers, forming a singly linked list allowing for quick<br>
&emsp;traversal through all keys.


### Question 3 continues...


---

<a id="page-7"></a>
**Page 7**

15-445/645 (Fall 2024)   Homework #3   Page 7 of 12

&emsp;(a) **\[4 points\]** Insert 0∗into the B+tree. Select the resulting tree.<br>
&emsp;&emsp;&emsp;☐  A)


![Figure on page 7](figures/questions-p07-fig03.png)

&emsp;&emsp;&emsp;☐  B)


![Figure on page 7](figures/questions-p07-fig04.png)

&emsp;&emsp;&emsp;☐  C)


![Figure on page 7](figures/questions-p07-fig05.png)

&emsp;&emsp;&emsp;☐  D)


![Figure on page 7](figures/questions-p07-fig06.png)


### Question 3 continues...


---

<a id="page-8"></a>
**Page 8**

15-445/645 (Fall 2024)   Homework #3   Page 8 of 12

&emsp;(b) **\[5 points\]** Starting with the tree that results from **(a)**, insert 35∗and then 45∗. Select the<br>
&emsp;&emsp;&emsp;resulting tree.<br>
&emsp;&emsp;&emsp;☐  A)


![Figure on page 8](figures/questions-p08-fig07.png)

&emsp;&emsp;&emsp;☐  B)


![Figure on page 8](figures/questions-p08-fig08.png)

&emsp;&emsp;&emsp;☐  C)


![Figure on page 8](figures/questions-p08-fig09.png)

&emsp;&emsp;&emsp;☐  D)


![Figure on page 8](figures/questions-p08-fig10.png)


### Question 3 continues...


---

<a id="page-9"></a>
**Page 9**

15-445/645 (Fall 2024)   Homework #3   Page 9 of 12

&emsp;(c) **\[8 points\]** Starting with the tree that results from **(b)**, deletes 80∗and then 20∗. Select<br>
&emsp;&emsp;&emsp;the resulting tree.<br>
&emsp;&emsp;&emsp;☐  A)


![Figure on page 9](figures/questions-p09-fig11.png)

&emsp;&emsp;&emsp;☐  B)


![Figure on page 9](figures/questions-p09-fig12.png)

&emsp;&emsp;&emsp;☐  C)


![Figure on page 9](figures/questions-p09-fig13.png)

&emsp;&emsp;&emsp;☐  D)


![Figure on page 9](figures/questions-p09-fig14.png)


### Question 3 continues...


---

<a id="page-10"></a>
**Page 10**

15-445/645 (Fall 2024)   Homework #3   Page 10 of 12

&emsp;(d)   i. **\[2 points\]** Under optimistic latch crabbing, read-only thread can drop its latch on<br>
&emsp;&emsp;&emsp;&emsp;the current page before acquiring the latch on the next page (e.g., child, sibling).<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;&emsp;&emsp;ii. **\[2 points\]** Under optimistic latch coupling, write threads never take the write latch<br>
&emsp;&emsp;&emsp;&emsp;on the root to avoid contention.<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;&emsp;&emsp;iii. **\[2 points\]** Threads can release their latches in any order.<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;&emsp;&emsp;iv. **\[2 points\]** “No-Wait” mode for acquiring sibling latches prevents deadlock by al-<br>
&emsp;&emsp;&emsp;&emsp;lowing a read thread to inspect what another thread is doing.<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;&emsp;&emsp;v. **\[2 points\]** For OLTP-style queries, a DBMS will not benefit from using two sepa-<br>
&emsp;&emsp;&emsp;&emsp;rate buffer pools for inner node and leaf pages.<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #3 continues...


---

<a id="page-11"></a>
**Page 11**

15-445/645 (Fall 2024)   Homework #3   Page 11 of 12


### **Question 4: Bloom Filter. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .\[20 points\]**

&emsp;Assume that we have a bloom filter that is used to register names. The filter uses two hash<br>
&emsp;functions h1 and h2 which hash the following strings to the following values:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;inputh1   h2<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;“DataBootX”   1749   8327<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;“QueryOptimizeR”   4123   9681<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;“FilterStream”   5076   2310<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;“ProtoBloom”   6598   9842

&emsp;(a) **\[6 points\]** Suppose the filter has 8 bits initially set to 0:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;bit 0   bit 1   bit 2   bit 3   bit 4   bit 5   bit 6   bit 7<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;0   0   0   0   0   0   0   0

&emsp;&emsp;&emsp;Which bits will be set to 1 after “DataBootX” and “ProtoBloom” have been inserted?<br>
&emsp;&emsp;&emsp;☐  0   ☐  1   ☐  2   ☐  3   ☐  4   ☐  5   ☐  6   ☐  7<br>
&emsp;(b) Suppose the filter has 8 bits set to the following values:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;bit 0   bit 1   bit 2   bit 3   bit 4   bit 5   bit 6   bit 7<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;0   1   0   1   1   1   0   0

&emsp;&emsp;&emsp;i. **\[4 points\]** What will we learn using the above filter if we lookup “FilterStream”?<br>
&emsp;&emsp;&emsp;&emsp;☐  FilterStream has been inserted<br>
&emsp;&emsp;&emsp;&emsp;☐  FilterStream has not been inserted<br>
&emsp;&emsp;&emsp;&emsp;☐  FilterStream may have been inserted<br>
&emsp;&emsp;&emsp;&emsp;☐  Not possible to know

&emsp;&emsp;&emsp;ii. **\[4 points\]** What will we learn if we lookup “QueryOptimizeR”?<br>
&emsp;&emsp;&emsp;&emsp;☐  QueryOptimizeR has been inserted<br>
&emsp;&emsp;&emsp;&emsp;☐  QueryOptimizeR has not been inserted<br>
&emsp;&emsp;&emsp;&emsp;☐  QueryOptimizeR may have been inserted<br>
&emsp;&emsp;&emsp;&emsp;☐  Not possible to know

&emsp;(c) **\[6 points\]** A colleague is interviewing a candidate and would like to first test your<br>
&emsp;&emsp;&emsp;knowledge of bloom filters. The colleague has a list of prepared statements and would<br>
&emsp;&emsp;&emsp;like you to identify which of them are true. Select all true statements.<br>
&emsp;&emsp;&emsp;☐  Bloom filters can eliminate unnecessary disk I/Os.<br>
&emsp;&emsp;&emsp;☐  We can lower a bloom filter’s false positive rate by using more hash functions.<br>
&emsp;&emsp;&emsp;☐  Bloom filters are effective for exact-match (or lookup) queries.<br>
&emsp;&emsp;&emsp;☐  Add and lookup operations on bloom filters are parallelizable.<br>
&emsp;&emsp;&emsp;☐  All of the above.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #3 continues...


---

<a id="page-12"></a>
**Page 12**

15-445/645 (Fall 2024)   Homework #3   Page 12 of 12


### **Question 5: Alternate Index Structures . . . . . . . . . . . . . . . . . . . . . . . . \[15 points\]**

&emsp;(a) **\[5 points\]** Your manager is thinking of utilizing a skip list index. They asked a large<br>
&emsp;&emsp;&emsp;language model for some factual statements about skip lists but are uncertain about<br>
&emsp;&emsp;&emsp;the model’s response. They would like you to identify all factually correct statements.<br>
&emsp;&emsp;&emsp;☐  Multiple threads can scan, insert, and delete from skip-lists without latches.<br>
&emsp;&emsp;&emsp;☐  Skip Lists require re-balancing.<br>
&emsp;&emsp;&emsp;☐  Single-Linked Skip Lists support finding (keys ≤X) and (keys ≥X).<br>
&emsp;&emsp;&emsp;☐  When inserting a key into a skip list, the number of towers is a function of the key.<br>
&emsp;&emsp;&emsp;☐  Each level (i) of a skip list must have half the nodes as the level below (i+1).<br>
&emsp;&emsp;&emsp;☐  None of the above

&emsp;(b) **\[5 points\]** You are interviewing for a company. The team lead is asking you to compare<br>
&emsp;&emsp;&emsp;B+Trees, Skip Lists, Radix Trees, and Inverted Indexes. Select all the true statements.<br>
&emsp;&emsp;&emsp;☐  Both Skip Lists and B+Tree guarantee logarithmic complexity for lookups.<br>
&emsp;&emsp;&emsp;☐  Radix Trees and Inverted Indexes are both efficient at substring predicates.<br>
&emsp;&emsp;&emsp;☐  B+Tree performs better than Radix Trees for prefix queries.<br>
&emsp;&emsp;&emsp;☐  Update overhead is generally Inverted Index \> Skip Lists \> B+Tree.<br>
&emsp;&emsp;&emsp;☐  None of the above.

&emsp;(c) **\[5 points\]** Suppose you are trying to run the following query:<br>
&emsp;&emsp;&emsp;`SELECT` `*` `FROM` `PEOPLE` `WHERE` `name` `NOT` `LIKE` `‘%WuTang%’;`<br>
&emsp;&emsp;&emsp;Assume that there is a non-clustering B+Tree index on `name`. Your query takes too long.<br>
&emsp;&emsp;&emsp;Which of the following choices (if any) would make this query go faster?<br>
&emsp;&emsp;&emsp;☐  Replace non-clustering B+Tree with a clustering B+Tree index on `name`.<br>
&emsp;&emsp;&emsp;☐  Replace the index with a hash index on `name`.<br>
&emsp;&emsp;&emsp;☐  Drop the index and build a bloom filter on `name`.<br>
&emsp;&emsp;&emsp;☐  Replace the index with a trie or radix tree on `name`.<br>
&emsp;&emsp;&emsp;☐  None of the above.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;End of Homework #3

