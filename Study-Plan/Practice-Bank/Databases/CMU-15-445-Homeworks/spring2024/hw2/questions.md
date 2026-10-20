# CMU 15-445 Spring 2024: Homework 2: Questions

> Copied from the original: <https://15445.courses.cs.cmu.edu/spring2024/assignments.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CARNEGIE MELLON UNIVERSITY<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;COMPUTER SCIENCE DEPARTMENT<br>
&emsp;&emsp;&emsp;&emsp;&emsp;15-445/645 – DATABASE SYSTEMS (SPRING 2024)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;PROF. JIGNESH PATEL

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #2 (by Shivang and Avery )<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Due: **Friday February 16, 2024 @ 11:59pm**

**IMPORTANT:**<br>
&emsp;• Enter all of your answers into **Gradescope by 11:59pm on Friday February 16, 2024.**<br>
&emsp;• **Plagiarism**: Homework may be discussed with other students, but all homework is to be<br>
&emsp;&emsp;completed **individually**.<br>
For your information:<br>
&emsp;• Graded out of **100** points; **4** questions total<br>
&emsp;• Rough time estimate: ≈4-6 hours (1-1.5 hours for each question)<br>
&emsp;Revision : 2024/02/05 15:08

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Question   Points   Score<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Storage Models   24<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Linear Hashing and Cuckoo Hashing   24<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Extendible Hashing   20<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;B+Tree   32<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Total:   100

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1


---

<a id="page-2"></a>
**Page 2**

15-445/645 (Spring 2024)   Homework #2   Page 2 of 14


### **Question 1: Storage Models . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . \[24 points\]**

&emsp;Consider a database with a single table `T(song` `id,song` `name,artist` `id,duration`<br>
&emsp;`number` `of` `streams)`, where `song` `id` is the primary key, and all attributes are the same fixed<br>
&emsp;width. Suppose `T` has 10,000 tuples that fit into 500 pages, Ignore any additional storage<br>
&emsp;overhead for the table (e.g., page headers, tuple headers). Additionally, you should make the<br>
&emsp;following assumptions:<br>
&emsp;&emsp;• The DBMS does not have any additional meta-data (e.g., sort order, zone maps).<br>
&emsp;&emsp;• `T` does not have any indexes (including for primary key `song` `id`).<br>
&emsp;&emsp;• None of `T`’s pages are already in the buffer pool. The DMBS has an infinite buffer pool.<br>
&emsp;&emsp;• Content-wise, the tuples of `T` will always make each query run the longest possible and<br>
&emsp;&emsp;&emsp;do the most page accesses.<br>
&emsp;&emsp;• The tuples of `T` can be in any order ( keep this in mind when computing minimum versus<br>
&emsp;&emsp;&emsp;maximum number of pages that the DBMS will potentially have to read and think of all<br>
&emsp;&emsp;&emsp;possible orderings)

&emsp;(a) Consider the following query:


![Figure on page 2](figures/questions-p02-fig01.png)

&emsp;&emsp;&emsp;i. **\[3 points\]** Suppose the DBMS uses the decomposition storage model (DSM) with<br>
&emsp;&emsp;&emsp;&emsp;implicit offsets. How many pages will the DBMS potentially have to read from disk<br>
&emsp;&emsp;&emsp;&emsp;to answer this query? (Keep in mind our assumption about the contents of `T`!)<br>
&emsp;&emsp;&emsp;&emsp;☐  1-100   ☐  101-200   ☐  201-300   ☐  301-500   ☐  ≥501   ☐  Not possible<br>
&emsp;&emsp;&emsp;&emsp;to determine

&emsp;&emsp;&emsp;ii. **\[3 points\]** Suppose the DBMS uses the N-ary storage model (NSM). How many<br>
&emsp;&emsp;&emsp;&emsp;pages will the DBMS potentially have to read from disk to answer this query? (Keep<br>
&emsp;&emsp;&emsp;&emsp;in mind our assumption about the contents of `T`!)<br>
&emsp;&emsp;&emsp;&emsp;☐  1-100   ☐  101-200   ☐  201-300   ☐  301-500   ☐  ≥501   ☐  Not possible<br>
&emsp;&emsp;&emsp;&emsp;to determine

&emsp;(b) Now consider the following query:


![Figure on page 2](figures/questions-p02-fig02.png)

&emsp;&emsp;&emsp;i. Suppose the DBMS uses the decomposition storage model (DSM) with implicit off-<br>
&emsp;&emsp;&emsp;&emsp;sets.<br>
&emsp;&emsp;&emsp;&emsp;α) **\[3 points\]** What is the minimum number of pages that the DBMS will poten-<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;tially have to read from disk to answer this query?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  1   ☐  2-4   ☐  5-100   ☐  101-200   ☐  201-500   ☐  ≥501


### Question 1 continues...


---

<a id="page-3"></a>
**Page 3**

15-445/645 (Spring 2024)   Homework #2   Page 3 of 14

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  Not possible to determine

&emsp;&emsp;&emsp;&emsp;&emsp;β) **\[3 points\]** What is the maximum number of pages that the DBMS will poten-<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;tially have to read from disk to answer this query?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  1   ☐  2-4   ☐  5-100   ☐  101-200   ☐  201-500   ☐  ≥501<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  Not possible to determine

&emsp;&emsp;&emsp;ii. Suppose the DBMS uses the N-ary storage model (NSM).<br>
&emsp;&emsp;&emsp;&emsp;α) **\[3 points\]** What is the minimum number of pages that the DBMS will poten-<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;tially have to read from disk to answer this query?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  1   ☐  2-4   ☐  5-100   ☐  101-200   ☐  201-500   ☐  ≥501<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  Not possible to determine

&emsp;&emsp;&emsp;&emsp;&emsp;β) **\[3 points\]** What is the maximum number of pages that the DBMS will poten-<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;tially have to read from disk to answer this query?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  1   ☐  2-4   ☐  5-100   ☐  101-200   ☐  201-500   ☐  ≥501<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  Not possible to determine

&emsp;(c) Finally consider the following query:


![Figure on page 3](figures/questions-p03-fig03.png)

&emsp;&emsp;&emsp;Suppose the DBMS uses the decomposition storage model (DSM) with implicit offsets.<br>
&emsp;&emsp;&emsp;i. **\[3 points\]** What is the minimum number of pages that the DBMS will potentially<br>
&emsp;&emsp;&emsp;&emsp;have to read from disk to answer this query?<br>
&emsp;&emsp;&emsp;&emsp;☐  1   ☐  2-5   ☐  100-200   ☐  201-299   ☐  ≥300   ☐  Not possible to<br>
&emsp;&emsp;&emsp;&emsp;determine

&emsp;&emsp;&emsp;ii. **\[3 points\]** What is the maximum number of pages that the DBMS will potentially<br>
&emsp;&emsp;&emsp;&emsp;have to read from disk to answer this query?<br>
&emsp;&emsp;&emsp;&emsp;☐  1   ☐  2-5   ☐  100-200   ☐  201-299   ☐  ≥300   ☐  Not possible to<br>
&emsp;&emsp;&emsp;&emsp;determine

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #2 continues...


---

<a id="page-4"></a>
**Page 4**

15-445/645 (Spring 2024)   Homework #2   Page 4 of 14


### **Question 2: Linear Hashing and Cuckoo Hashing . . . . . . . . . . . . . . \[24 points\]**

&emsp;Consider the following linear probe hashing schema:<br>
&emsp;&emsp;1\. The table have a size of 4 slots, each slot can only contain one key value pair.<br>
&emsp;&emsp;2\. The hashing function is<br>
&emsp;&emsp;&emsp;h1(`x`) = `x` `%` `4`.<br>
&emsp;&emsp;3\. When there is conflict, it finds the next free slot to insert key value pairs.<br>
&emsp;&emsp;4\. The original table is empty.<br>
&emsp;(a) Insert key value pair (3, A) and (4, B). (for (3,A), 3 is the key and A is the value) Select<br>
&emsp;&emsp;&emsp;the value in each entry of the resulting table.

&emsp;&emsp;&emsp;i. **\[1 point\]** Entry 0 (key % 4 = 0) ☐  A   ☐  B   ☐  Empty<br>
&emsp;&emsp;&emsp;ii. **\[1 point\]** Entry 1 (key % 4 = 1) ☐  A   ☐  B   ☐  Empty<br>
&emsp;&emsp;&emsp;iii. **\[1 point\]** Entry 2 (key % 4 = 2) ☐  A   ☐  B   ☐  Empty<br>
&emsp;&emsp;&emsp;iv. **\[1 point\]** Entry 3 (key % 4 = 3) ☐  A   ☐  B   ☐  Empty<br>
&emsp;(b) After the changes from part **(a)**, insert key value pair (8, C) and then (9, D). Select the<br>
&emsp;&emsp;&emsp;value in each entry of the resulting table.

&emsp;&emsp;&emsp;i. **\[1 point\]** Entry 0 (key % 4 = 0) ☐  A   ☐  B   ☐  C   ☐  D   ☐  Empty<br>
&emsp;&emsp;&emsp;ii. **\[1 point\]** Entry 1 (key % 4 = 1) ☐  A   ☐  B   ☐  C   ☐  D   ☐  Empty<br>
&emsp;&emsp;&emsp;iii. **\[1 point\]** Entry 2 (key % 4 = 2) ☐  A   ☐  B   ☐  C   ☐  D   ☐  Empty<br>
&emsp;&emsp;&emsp;iv. **\[1 point\]** Entry 3 (key % 4 = 3) ☐  A   ☐  B   ☐  C   ☐  D   ☐  Empty


### Question 2 continues...


---

<a id="page-5"></a>
**Page 5**

15-445/645 (Spring 2024)   Homework #2   Page 5 of 14

&emsp;Consider the following cuckoo hashing schema:<br>
&emsp;&emsp;1\. Both tables have a size of 4.<br>
&emsp;&emsp;2\. The hashing function of the first table returns the fourth and third least significant bits:<br>
&emsp;&emsp;&emsp;h1(`x`) = `(x` `>>` `2)` `&` `0b11`.<br>
&emsp;&emsp;3\. The hashing function of the second table returns the least significant two bits:<br>
&emsp;&emsp;&emsp;h2(`x`) = `x` `&` `0b11`.<br>
&emsp;&emsp;4\. When inserting, try table 1 first.<br>
&emsp;&emsp;5\. When replacement is necessary, first select an element in the second table.<br>
&emsp;&emsp;6\. The original entries in the table are shown in the figure below.


![Figure on page 5](figures/questions-p05-fig04.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Figure 1: Initial contents of the hash tables.<br>
&emsp;(a) Insert key 32 and then delete 16. Select the value in each entry of the resulting two tables.

&emsp;&emsp;&emsp;i. Table 1<br>
&emsp;&emsp;&emsp;&emsp;α) **\[1 point\]** Entry 0 (`0b00`) ☐  32   ☐  16   ☐  Empty<br>
&emsp;&emsp;&emsp;&emsp;&emsp;β) **\[1 point\]** Entry 1 (`0b01`) ☐  32   ☐  16   ☐  Empty<br>
&emsp;&emsp;&emsp;&emsp;&emsp;γ) **\[1 point\]** Entry 2 (`0b10`) ☐  32   ☐  16   ☐  Empty<br>
&emsp;&emsp;&emsp;&emsp;&emsp;δ) **\[1 point\]** Entry 3 (`0b11`) ☐  32   ☐  16   ☐  Empty

&emsp;&emsp;&emsp;ii. Table 2<br>
&emsp;&emsp;&emsp;&emsp;α) **\[1 point\]** Entry 0 (`0b00`) ☐  32   ☐  3   ☐  Empty<br>
&emsp;&emsp;&emsp;&emsp;&emsp;β) **\[1 point\]** Entry 1 (`0b01`) ☐  32   ☐  3   ☐  Empty<br>
&emsp;&emsp;&emsp;&emsp;&emsp;γ) **\[1 point\]** Entry 2 (`0b10`) ☐  32   ☐  3   ☐  Empty<br>
&emsp;&emsp;&emsp;&emsp;&emsp;δ) **\[1 point\]** Entry 3 (`0b11`) ☐  32   ☐  3   ☐  Empty

&emsp;(b) After the changes from part **(a)**, insert key 27, then delete 3, then insert key 8. Select the<br>
&emsp;&emsp;&emsp;value in each entry of the resulting two tables.


### Question 2 continues...


---

<a id="page-6"></a>
**Page 6**

15-445/645 (Spring 2024)   Homework #2   Page 6 of 14

&emsp;&emsp;&emsp;i. Table 1<br>
&emsp;&emsp;&emsp;&emsp;α) **\[1 point\]** Entry 0 (`0b00`) ☐  8   ☐  32   ☐  27   ☐  Empty<br>
&emsp;&emsp;&emsp;&emsp;&emsp;β) **\[1 point\]** Entry 1 (`0b01`) ☐  8   ☐  32   ☐  27   ☐  Empty<br>
&emsp;&emsp;&emsp;&emsp;&emsp;γ) **\[1 point\]** Entry 2 (`0b10`) ☐  8   ☐  32   ☐  27   ☐  Empty<br>
&emsp;&emsp;&emsp;&emsp;&emsp;δ) **\[1 point\]** Entry 3 (`0b11`) ☐  8   ☐  32   ☐  27   ☐  Empty

&emsp;&emsp;&emsp;ii. Table 2<br>
&emsp;&emsp;&emsp;&emsp;α) **\[1 point\]** Entry 0 (`0b00`) ☐  32   ☐  8   ☐  27   ☐  Empty<br>
&emsp;&emsp;&emsp;&emsp;&emsp;β) **\[1 point\]** Entry 1 (`0b01`) ☐  32   ☐  8   ☐  27   ☐  Empty<br>
&emsp;&emsp;&emsp;&emsp;&emsp;γ) **\[1 point\]** Entry 2 (`0b10`) ☐  32   ☐  8   ☐  27   ☐  Empty<br>
&emsp;&emsp;&emsp;&emsp;&emsp;δ) **\[1 point\]** Entry 3 (`0b11`) ☐  32   ☐  8   ☐  27   ☐  Empty

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #2 continues...


---

<a id="page-7"></a>
**Page 7**

15-445/645 (Spring 2024)   Homework #2   Page 7 of 14


### **Question 3: Extendible Hashing. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .\[20 points\]**

&emsp;Consider an extendible hashing structure such that:<br>
&emsp;&emsp;• Each bucket can hold up to two records.<br>
&emsp;&emsp;• The hashing function uses the lowest g bits, where g is the global depth.<br>
&emsp;&emsp;• A new extendible hashing structure is initialized with g = 0 and one empty bucket<br>
&emsp;&emsp;• If multiple keys are provided in a question, assume they are inserted one after the other<br>
&emsp;&emsp;&emsp;from left to right.<br>
&emsp;(a) Starting from an empty table, insert keys 0, 3.<br>
&emsp;&emsp;&emsp;i. **\[1 point\]** What is the global depth of the resulting table?<br>
&emsp;&emsp;&emsp;&emsp;☐  0   ☐  1   ☐  2   ☐  3   ☐  4   ☐  None of the above<br>
&emsp;&emsp;&emsp;ii. **\[1 point\]** What is the local depth of the bucket containing 0?<br>
&emsp;&emsp;&emsp;&emsp;☐  0   ☐  1   ☐  2   ☐  3   ☐  4   ☐  None of the above<br>
&emsp;(b) Starting from the result in **(a)**, you insert keys 23, 33.<br>
&emsp;&emsp;&emsp;i. **\[2 points\]** What is the global depth of the resulting table?<br>
&emsp;&emsp;&emsp;&emsp;☐  0   ☐  1   ☐  2   ☐  3   ☐  4   ☐  None of the above<br>
&emsp;&emsp;&emsp;ii. **\[1 point\]** What is the local depth of the bucket containing 0?<br>
&emsp;&emsp;&emsp;&emsp;☐  0   ☐  1   ☐  2   ☐  3   ☐  4   ☐  None of the above<br>
&emsp;(c) Starting from the result in **(b)**, you insert keys 13, 27.<br>
&emsp;&emsp;&emsp;i. **\[2 points\]** What is the global depth of the resulting table?<br>
&emsp;&emsp;&emsp;&emsp;☐  0   ☐  1   ☐  2   ☐  3   ☐  4   ☐  None of the above<br>
&emsp;&emsp;&emsp;ii. **\[2 points\]** What is the local depth of the bucket containing 13?<br>
&emsp;&emsp;&emsp;&emsp;☐  0   ☐  1   ☐  2   ☐  3   ☐  4   ☐  None of the above<br>
&emsp;&emsp;&emsp;iii. **\[1 point\]** What is the local depth of the bucket containing 3?<br>
&emsp;&emsp;&emsp;&emsp;☐  0   ☐  1   ☐  2   ☐  3   ☐  4   ☐  None of the above<br>
&emsp;&emsp;&emsp;iv. **\[1 point\]** Which value, if inserted, will hash to the same bucket as the bucket con-<br>
&emsp;&emsp;&emsp;&emsp;taining key 27?<br>
&emsp;&emsp;&emsp;&emsp;☐  43   ☐  4   ☐  21   ☐  13   ☐  None of the above<br>
&emsp;(d) **\[3 points\]** Starting from the result in **(c)**, which **key(s)**, if inserted next, will **not** cause a<br>
&emsp;&emsp;&emsp;split?<br>
&emsp;&emsp;&emsp;☐  35   ☐  9   ☐  17   ☐  41   ☐  16   ☐  None of the above<br>
&emsp;(e) **\[3 points\]** Starting from the result in **(c)**, which **key(s)**, if inserted next, will cause a split<br>
&emsp;&emsp;&emsp;and increase the table’s global depth?<br>
&emsp;&emsp;&emsp;☐  0   ☐  2   ☐  51   ☐  9   ☐  1   ☐  None of the above<br>
&emsp;(f) **\[3 points\]** Starting from an empty table, insert keys 64, 128, 256, 512. What is the<br>
&emsp;&emsp;&emsp;global depth of the resulting table?<br>
&emsp;&emsp;&emsp;☐  4   ☐  5   ☐  6   ☐  7   ☐  8   ☐  ≥9

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #2 continues...


---

<a id="page-8"></a>
**Page 8**

15-445/645 (Spring 2024)   Homework #2   Page 8 of 14


### **Question 4: B+Tree. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .\[32 points\]**

&emsp;Consider the following B+tree.


![Figure on page 8](figures/questions-p08-fig05.png)

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


### Question 4 continues...


---

<a id="page-9"></a>
**Page 9**

15-445/645 (Spring 2024)   Homework #2   Page 9 of 14

&emsp;(a) **\[4 points\]** Insert 24∗into the B+tree. Select the resulting tree.<br>
&emsp;&emsp;&emsp;☐  A)


![Figure on page 9](figures/questions-p09-fig06.png)

&emsp;&emsp;&emsp;☐  B)


![Figure on page 9](figures/questions-p09-fig07.png)

&emsp;&emsp;&emsp;☐  C)


![Figure on page 9](figures/questions-p09-fig08.png)

&emsp;&emsp;&emsp;☐  D)


![Figure on page 9](figures/questions-p09-fig09.png)


### Question 4 continues...


---

<a id="page-10"></a>
**Page 10**

15-445/645 (Spring 2024)   Homework #2   Page 10 of 14

&emsp;(b) **\[4 points\]** Starting with the tree that results from **(a)**, insert 15∗. Select the resulting<br>
&emsp;&emsp;&emsp;tree.<br>
&emsp;&emsp;&emsp;☐  A)


![Figure on page 10](figures/questions-p10-fig10.png)

&emsp;&emsp;&emsp;☐  B)


![Figure on page 10](figures/questions-p10-fig11.png)

&emsp;&emsp;&emsp;☐  C)


![Figure on page 10](figures/questions-p10-fig12.png)

&emsp;&emsp;&emsp;☐  D)


![Figure on page 10](figures/questions-p10-fig13.png)


### Question 4 continues...


---

<a id="page-11"></a>
**Page 11**

15-445/645 (Spring 2024)   Homework #2   Page 11 of 14

&emsp;(c) **\[5 points\]** Starting with the tree that results from **(b)**, insert 16∗and then insert 17∗. Se-<br>
&emsp;&emsp;&emsp;lect the resulting tree (the result after inserting 17∗).<br>
&emsp;&emsp;&emsp;☐  A)


![Figure on page 11](figures/questions-p11-fig14.png)

&emsp;&emsp;&emsp;☐  B)


![Figure on page 11](figures/questions-p11-fig15.png)

&emsp;&emsp;&emsp;☐  C)


![Figure on page 11](figures/questions-p11-fig16.png)

&emsp;&emsp;&emsp;☐  D)


![Figure on page 11](figures/questions-p11-fig17.png)


### Question 4 continues...


---

<a id="page-12"></a>
**Page 12**

15-445/645 (Spring 2024)   Homework #2   Page 12 of 14

&emsp;(d) **\[5 points\]** Starting with the tree that results from **(c)**, deletes 5∗. Select the resulting<br>
&emsp;&emsp;&emsp;tree.<br>
&emsp;&emsp;&emsp;☐  A)


![Figure on page 12](figures/questions-p12-fig18.png)

&emsp;&emsp;&emsp;☐  B)


![Figure on page 12](figures/questions-p12-fig19.png)

&emsp;&emsp;&emsp;☐  C)


![Figure on page 12](figures/questions-p12-fig20.png)

&emsp;&emsp;&emsp;☐  D)


![Figure on page 12](figures/questions-p12-fig21.png)


### Question 4 continues...


---

<a id="page-13"></a>
**Page 13**

15-445/645 (Spring 2024)   Homework #2   Page 13 of 14


![Figure on page 13](figures/questions-p13-fig22.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Figure 3: B+tree with violations

&emsp;(e) The B+Tree shown in Figure 3 is invalid. That is, its nodes violate the correctness prop-<br>
&emsp;&emsp;&emsp;erties of B+Trees that we discussed in class. If the tree is invalid, select all the properties<br>
&emsp;&emsp;&emsp;that are violated for each node. If the node is valid, then select ‘None’. There will be **no**<br>
&emsp;&emsp;&emsp;partial credit for missing violations.<br>
&emsp;&emsp;&emsp;Note:<br>
&emsp;&emsp;&emsp;• If a node’s subtrees are not the same height, the balance property is violated at that<br>
&emsp;&emsp;&emsp;&emsp;node only.<br>
&emsp;&emsp;&emsp;• If a node’s subtrees contain values not in the range specified by the node’s separator<br>
&emsp;&emsp;&emsp;&emsp;keys (e.g. internal node has separator keys as 5,10,18, then the first pointer pointed<br>
&emsp;&emsp;&emsp;&emsp;leaf node values should be less than 5, the second one should be in the range of \[5,<br>
&emsp;&emsp;&emsp;&emsp;10), etc. The logic also applies to any upper level internal node or root node. If the<br>
&emsp;&emsp;&emsp;&emsp;values in the leaf node satisfies its parent node’s separator key property but violates<br>
&emsp;&emsp;&emsp;&emsp;the root node’s, mark root node as separator key violation and not its parent node.),<br>
&emsp;&emsp;&emsp;&emsp;the separator keys property is violated at that node.

&emsp;&emsp;&emsp;i. **\[2 points\]** Which properties are violated by **Leaf A**?<br>
&emsp;&emsp;&emsp;&emsp;☐  Key order property   ☐  Half-full property   ☐  Balance property<br>
&emsp;&emsp;&emsp;&emsp;☐  Separator keys   ☐  None<br>
&emsp;&emsp;&emsp;ii. **\[2 points\]** Which properties are violated by **LeafB**?<br>
&emsp;&emsp;&emsp;&emsp;☐  Key order property   ☐  Half-full property   ☐  Balance property<br>
&emsp;&emsp;&emsp;&emsp;☐  Separator keys   ☐  None<br>
&emsp;&emsp;&emsp;iii. **\[2 points\]** Which properties are violated by **Internal Node**?<br>
&emsp;&emsp;&emsp;&emsp;☐  Key order property   ☐  Half-full property   ☐  Balance property<br>
&emsp;&emsp;&emsp;&emsp;☐  Separator keys   ☐  None<br>
&emsp;&emsp;&emsp;iv. **\[2 points\]** Which properties are violated by **Root**?<br>
&emsp;&emsp;&emsp;&emsp;☐  Key order property   ☐  Half-full property   ☐  Balance property<br>
&emsp;&emsp;&emsp;&emsp;☐  Separator keys   ☐  None


### Question 4 continues...


---

<a id="page-14"></a>
**Page 14**

15-445/645 (Spring 2024)   Homework #2   Page 14 of 14

&emsp;(f)   i. **\[2 points\]** A read-only thread needs to hold at most one latches at the same time.<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;&emsp;&emsp;ii. **\[2 points\]** A write thread needs to hold at most two write latches at the same time<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False<br>
&emsp;&emsp;&emsp;iii. **\[2 points\]** A write thread must release its latches in the order they were acquired<br>
&emsp;&emsp;&emsp;&emsp;(i.e., FIFO) to prevent concurrency errors.<br>
&emsp;&emsp;&emsp;&emsp;☐  True   ☐  False

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;End of Homework #2

