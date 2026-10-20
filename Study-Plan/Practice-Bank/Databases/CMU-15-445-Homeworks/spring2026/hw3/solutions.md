# CMU 15-445 Spring 2026: Homework 3: Official solutions

> Copied from the original: <https://15445.courses.cs.cmu.edu/spring2026/assignments.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CARNEGIE MELLON UNIVERSITY<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;COMPUTER SCIENCE DEPARTMENT<br>
&emsp;&emsp;&emsp;&emsp;&emsp;15-445/645 – DATABASE SYSTEMS (SPRING 2026)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;PROF. ANDY PAVLO AND JIGNESH PATEL

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #3 (by Saransh) – Solutions<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Due: **Sunday Feb 22nd, 2026 @ 11:59pm**

**IMPORTANT:**<br>
&emsp;• Enter all of your answers into **Gradescope by 11:59pm on Sunday Feb 22nd, 2026.**<br>
&emsp;• **Plagiarism**: Homework may be discussed with other students, but all homework is to be<br>
&emsp;&emsp;completed **individually**.<br>
For your information:<br>
&emsp;• Graded out of **100** points; **5** questions total<br>
&emsp;• Rough time estimate: ≈4-6 hours (1-1.5 hours for each question)<br>
&emsp;Revision : 2026/02/23 12:54

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

15-445/645 (Spring 2026)   Homework #3   Page 2 of 17


### **Question 1: Linear Hashing and Cuckoo Hashing . . . . . . . . . . . . . . \[18 points\]**

&emsp;**Graded by:**<br>
&emsp;For warmup, consider the following Linear Probe Hashing schema:<br>
&emsp;&emsp;1\. The table has a size of 4 slots, each slot can only contain one key-value pair.<br>
&emsp;&emsp;2\. The hashing function is<br>
&emsp;&emsp;&emsp;h1(`x`) = `x` `%` `4`.<br>
&emsp;&emsp;3\. When there is a conflict, it finds the next free slot to insert key-value pairs.<br>
&emsp;&emsp;4\. The original table is empty.<br>
&emsp;&emsp;5\. Uses a tombstone when deleting a key.<br>
&emsp;(a) **\[2 points\]** Insert key/value pairs `(1,C)` and `(7,D)`. For `(1,C)`, “1” is the key and “C” is<br>
&emsp;&emsp;&emsp;the value. Select the value in each entry of the resulting table.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **Empty**<br>
&emsp;&emsp;&emsp;i. Entry 0 (key % 4 = 0) ☐  C   ☐  D<br>
&emsp;&emsp;&emsp;ii. Entry 1 (key % 4 = 1) ☒ **C**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  D   ☐  Empty<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **Empty**<br>
&emsp;&emsp;&emsp;iii. Entry 2 (key % 4 = 2) ☐  C   ☐  D<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **D**<br>
&emsp;&emsp;&emsp;iv. Entry 3 (key % 4 = 3) ☐  C   ☐  Empty<br>
&emsp;&emsp;&emsp;**Solution:** `C` is inserted into Entry 1, and `D` is inserted into Entry 3.

&emsp;(b) **\[2 points\]** After the changes from part **(a)**, delete `(7,` `D)`, insert key-value `(0,` `E)`,<br>
&emsp;&emsp;&emsp;insert `(4,` `F)`, and lastly delete `(1,` `C)`. Select the value in each entry of the resulting<br>
&emsp;&emsp;&emsp;table.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **E**<br>
&emsp;&emsp;&emsp;i. Entry 0 (key % 4 = 0) ☐  Tombstone   ☐  C   ☐  D   ☐  F   ☐  Empty<br>
&emsp;&emsp;&emsp;ii. Entry 1 (key % 4 = 1) ☒ **Tombstone**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  C   ☐  D   ☐  E   ☐  F   ☐  Empty<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **F**<br>
&emsp;&emsp;&emsp;iii. Entry 2 (key % 4 = 2) ☐  Tombstone   ☐  C   ☐  D   ☐  E   ☐  Empty<br>
&emsp;&emsp;&emsp;iv. Entry 3 (key % 4 = 3) ☒ **Tombstone**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  C   ☐  D   ☐  E   ☐  F   ☐  Empty<br>
&emsp;&emsp;&emsp;**Solution:** `D` is first deleted, which inserts a tombstone into Entry 3. `E` is then inserted<br>
&emsp;&emsp;&emsp;into Entry 0 (since there is nothing there). Then, `F` is attempted to be inserted into Entry<br>
&emsp;&emsp;&emsp;0, but since it’s occupied by `E`, and Entry 1 is occupied by `C`, `F` is inserted into Entry 2<br>
&emsp;&emsp;&emsp;instead. Finally `C` is deleted which leaves a tombstone in Entry 1.


### Question 1 continues...


---

<a id="page-3"></a>
**Page 3**

15-445/645 (Spring 2026)   Homework #3   Page 3 of 17

&emsp;Consider the following Cuckoo Hashing schema:<br>
&emsp;&emsp;1\. Both tables have a size of 4.<br>
&emsp;&emsp;2\. The hashing function of the first table returns the fourth and third least significant bits:<br>
&emsp;&emsp;&emsp;h1(`x`) = `(x` `>>` `2)` `&` `0b11`.<br>
&emsp;&emsp;3\. The hashing function of the second table returns the least significant two bits:<br>
&emsp;&emsp;&emsp;h2(`x`) = `x` `&` `0b11`.<br>
&emsp;&emsp;4\. When inserting, try table 1 first.<br>
&emsp;&emsp;5\. When replacement is necessary, first select an element in the first table.<br>
&emsp;&emsp;6\. The original entries in the table are shown below.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Table 1**   **Entry 0**   **Entry 1**   **Entry 2**   **Entry 3**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Keys   -   -   -   12<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Table 2**   **Entry 0**   **Entry 1**   **Entry 2**   **Entry 3**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Keys   -   -   62   -<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Figure 1: Initial contents of the hash tables.

&emsp;(a) **\[2 points\]** Select the sequence of insert operations that results in the initial state.<br>
&emsp;&emsp;&emsp;☒ **Insert 12, Insert 62**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  Insert 62, Insert 12   ☐  None of the above<br>
&emsp;&emsp;&emsp;**Solution:** 12 is inserted into Table 1 `0b11` based on h1, and 62 experiences a collision<br>
&emsp;&emsp;&emsp;and is hashed to Table 2 `0b10` based on h2.


### Question 1 continues...


---

<a id="page-4"></a>
**Page 4**

15-445/645 (Spring 2026)   Homework #3   Page 4 of 17

&emsp;(b) Starting from the initial contents, insert key `190` and then insert `789`. Select the values in<br>
&emsp;&emsp;&emsp;the resulting two tables.<br>
&emsp;&emsp;&emsp;i. Table 1<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **Empty**<br>
&emsp;&emsp;&emsp;&emsp;α) **\[1 point\]** Entry 0 (`0b00`) ☐  12   ☐  62   ☐  190   ☐  789<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **789**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;β) **\[1 point\]** Entry 1 (`0b01`) ☐  12   ☐  62   ☐  190   ☐  Empty<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **Empty**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;γ) **\[1 point\]** Entry 2 (`0b10`) ☐  12   ☐  62   ☐  190   ☐  789<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **190**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;δ) **\[1 point\]** Entry 3 (`0b11`) ☐  12   ☐  62   ☐  789   ☐  Empty

&emsp;&emsp;&emsp;ii. Table 2<br>
&emsp;&emsp;&emsp;&emsp;α) **\[1 point\]** Entry 0 (`0b00`) ☒ **12**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  62   ☐  190   ☐  789   ☐  Empty<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **Empty**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;β) **\[1 point\]** Entry 1 (`0b01`) ☐  12   ☐  62   ☐  190   ☐  789<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **62**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;γ) **\[1 point\]** Entry 2 (`0b10`) ☐  12   ☐  190   ☐  789   ☐  Empty<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **Empty**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;δ) **\[1 point\]** Entry 3 (`0b11`) ☐  12   ☐  62   ☐  190   ☐  789

&emsp;&emsp;&emsp;**Solution:** 190 tries to insert into both tables but conflicts with both, so 190 inserts into<br>
&emsp;&emsp;&emsp;Entry 3 of Table 1, replacing 12. 12 is then rehashed into Table 2 Entry 0. 789 then<br>
&emsp;&emsp;&emsp;inserts into Table 1 Entry 1.<br>
&emsp;(c) **\[4 points\]** Consider completely empty tables using the same two hash functions. Select<br>
&emsp;&emsp;&emsp;which sequence of insertions below will cause an infinite loop.<br>
&emsp;&emsp;&emsp;☐  `[1,` `5,` `9,` `13]`<br>
&emsp;&emsp;&emsp;☒ `[1,` `9,` `17,` `25]`<br>
&emsp;&emsp;&emsp;☐  `[2,` `7,` `10,` `14]`<br>
&emsp;&emsp;&emsp;☐  `[4,` `10,` `11,` `15]`<br>
&emsp;&emsp;&emsp;☐  None of the above<br>
&emsp;&emsp;&emsp;**Solution:** The sequence `[1,` `9,` `17,` `25]` will cause an infinite loop because 4 keys<br>
&emsp;&emsp;&emsp;map to 3 entries.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #3 continues...


---

<a id="page-5"></a>
**Page 5**

15-445/645 (Spring 2026)   Homework #3   Page 5 of 17


### **Question 2: Extendible Hashing. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .\[20 points\]**

&emsp;**Graded by:**<br>
&emsp;Consider an extendible hashing structure such that:<br>
&emsp;&emsp;• Each bucket can hold up to two records.<br>
&emsp;&emsp;• The hashing function uses the lowest g bits, where g is the global depth.<br>
&emsp;&emsp;• A new extendible hashing structure is initialized with g = 0 and one empty bucket<br>
&emsp;&emsp;• If multiple keys are provided in a question, assume they are inserted one after the other<br>
&emsp;&emsp;&emsp;from left to right.<br>
&emsp;(a) Starting from an empty table, insert keys 1, 7.<br>
&emsp;&emsp;&emsp;i. **\[1 point\]** What is the global depth of the resulting table?<br>
&emsp;&emsp;&emsp;&emsp;☒ **0**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  1   ☐  2   ☐  3   ☐  4   ☐  None of the above<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** No split has occurred yet because the first bucket (on initialization) can<br>
&emsp;&emsp;&emsp;&emsp;hold 2 arbitrary values. Thus global depth is same as its initial value of 0.<br>
&emsp;&emsp;&emsp;ii. **\[1 point\]** What is the local depth of the bucket containing 7?<br>
&emsp;&emsp;&emsp;&emsp;☒ **0**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  1   ☐  2   ☐  3   ☐  4   ☐  None of the above<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** There is only one bucket (created on initialization), and it holds both 1<br>
&emsp;&emsp;&emsp;&emsp;and 7. Since no split has occurred yet, the bucket has local depth d = 0.<br>
&emsp;(b) Starting from the result in **(a)**, you insert keys 3, 4.<br>
&emsp;&emsp;&emsp;i. **\[2 points\]** What is the global depth of the resulting table?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **2**<br>
&emsp;&emsp;&emsp;&emsp;☐  0   ☐  1   ☐  3   ☐  4   ☐  None of the above<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** After the inserts and splits, the table looks like the following:<br>
&emsp;&emsp;&emsp;&emsp;Global depth = 2<br>
&emsp;&emsp;&emsp;&emsp;`Bucket` `0` = {4} // at local depth 1<br>
&emsp;&emsp;&emsp;&emsp;`Bucket` `01` = {1} // at local depth 2<br>
&emsp;&emsp;&emsp;&emsp;`Bucket` `11` = {3,7} // at local depth 2

&emsp;&emsp;&emsp;ii. **\[2 points\]** What are the local depths of the buckets for each key?<br>
&emsp;&emsp;&emsp;&emsp;☒ **1 (Depth 2), 3 (Depth 2), 4 (Depth 1), 7 (Depth 2)**<br>
&emsp;&emsp;&emsp;&emsp;☐  1 (Depth 1), 3 (Depth 3), 4 (Depth 3), 7 (Depth 3)<br>
&emsp;&emsp;&emsp;&emsp;☐  1 (Depth 3), 3 (Depth 1), 4 (Depth 3), 7 (Depth 2)<br>
&emsp;&emsp;&emsp;&emsp;☐  1 (Depth 1), 3 (Depth 2), 4 (Depth 2), 7 (Depth 2)<br>
&emsp;&emsp;&emsp;&emsp;☐  1 (Depth 2), 3 (Depth 2), 4 (Depth 2), 7 (Depth 2)<br>
&emsp;&emsp;&emsp;&emsp;☐  None of the above<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** See the previous solution for an explanation.<br>
&emsp;(c) Starting from the result in **(b)**, you insert keys 11, 19.<br>
&emsp;&emsp;&emsp;i. **\[2 points\]** What is the global depth of the resulting table?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **4**<br>
&emsp;&emsp;&emsp;&emsp;☐  0   ☐  1   ☐  2   ☐  3   ☐  None of the above


### Question 2 continues...


---

<a id="page-6"></a>
**Page 6**

15-445/645 (Spring 2026)   Homework #3   Page 6 of 17

&emsp;&emsp;&emsp;&emsp;**Solution:** 11 inserts into `Bucket` `11` and causes a split. 19 inserts into `Bucket` `011`<br>
&emsp;&emsp;&emsp;&emsp;and causes a split. The updated table looks as follows: Global depth = 4<br>
&emsp;&emsp;&emsp;&emsp;`Bucket` `0` = {4} // at local depth 1<br>
&emsp;&emsp;&emsp;&emsp;`Bucket` `01` = {1} // at local depth 2<br>
&emsp;&emsp;&emsp;&emsp;`Bucket` `0011` = {3,19} // at local depth 4<br>
&emsp;&emsp;&emsp;&emsp;`Bucket` `1011` = {11} // at local depth 4<br>
&emsp;&emsp;&emsp;&emsp;`Bucket` `111` = {7} // at local depth 3

&emsp;&emsp;&emsp;ii. **\[2 points\]** What are the local depths of the buckets for each new key?<br>
&emsp;&emsp;&emsp;&emsp;☐  11 (Depth 3), 19 (Depth 3)<br>
&emsp;&emsp;&emsp;&emsp;☒ **11 (Depth 4), 19 (Depth 4)**<br>
&emsp;&emsp;&emsp;&emsp;☐  11 (Depth 4), 19 (Depth 3)<br>
&emsp;&emsp;&emsp;&emsp;☐  11 (Depth 3), 19 (Depth 4)<br>
&emsp;&emsp;&emsp;&emsp;☐  11 (Depth 2), 19 (Depth 4)<br>
&emsp;&emsp;&emsp;&emsp;☐  None of the above<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** See the previous solution for an explanation.<br>
&emsp;(d) **\[3 points\]** Starting from **(c)**’s result, which **key(s)**, if inserted next, will **not** cause a split?<br>
&emsp;&emsp;&emsp;Treat each key individually.<br>
&emsp;&emsp;&emsp;☒ **15**   ☒ **38**   ☒ **5**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  51   ☐  None of the above<br>
&emsp;&emsp;&emsp;**Solution:** Only the selected values hash to buckets from **c** that are not full.<br>
&emsp;(e) **\[3 points\]** Starting from the result in **(c)**, which **key(s)**, if inserted next, will cause a split<br>
&emsp;&emsp;&emsp;and increase the table’s global depth? Treat each key individually.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **51**<br>
&emsp;&emsp;&emsp;☐  15   ☐  38   ☐  5   ☐  None of the above<br>
&emsp;&emsp;&emsp;**Solution:** The values must hash to **Bucket 0011**, since it is the only full bucket whose<br>
&emsp;&emsp;&emsp;local depth is equal to the global depth.<br>
&emsp;(f) **\[4 points\]** Starting from an empty table, insert keys 32, 64, 128, 256. What is the global<br>
&emsp;&emsp;&emsp;depth of the resulting table?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **7**<br>
&emsp;&emsp;&emsp;☐  4   ☐  5   ☐  6   ☐  8   ☐  ≥9<br>
&emsp;&emsp;&emsp;**Solution:** Since each bucket can hold at most two keys, three or more keys cannot hash<br>
&emsp;&emsp;&emsp;to the same bucket without causing splits. When g = 7, 32 and 64 will each be mapped<br>
&emsp;&emsp;&emsp;to their own bin. 128 and 256 will share the same bin.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #3 continues...


---

<a id="page-7"></a>
**Page 7**

15-445/645 (Spring 2026)   Homework #3   Page 7 of 17


### **Question 3: B+Tree. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .\[27 points\]**

&emsp;**Graded by:**<br>
&emsp;Consider the following B+tree.


![Figure on page 7](figures/solutions-p07-fig01.png)

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

<a id="page-8"></a>
**Page 8**

15-445/645 (Spring 2026)   Homework #3   Page 8 of 17

&emsp;(a) **\[4 points\]** Insert 135∗into the B+tree. Select the resulting tree.<br>
&emsp;&emsp;&emsp;☒ **A)**


![Figure on page 8](figures/solutions-p08-fig02.png)

&emsp;&emsp;&emsp;☐  B)


![Figure on page 8](figures/solutions-p08-fig03.png)

&emsp;&emsp;&emsp;☐  C)


![Figure on page 8](figures/solutions-p08-fig04.png)

&emsp;&emsp;&emsp;☐  D)


![Figure on page 8](figures/solutions-p08-fig05.png)

&emsp;&emsp;&emsp;**Solution:** Inserting 135∗adds one element in the third-from-left leaf. It should not<br>
&emsp;&emsp;&emsp;cause any splits or merges.


### Question 3 continues...


---

<a id="page-9"></a>
**Page 9**

15-445/645 (Spring 2026)   Homework #3   Page 9 of 17

&emsp;(b) **\[5 points\]** Starting with the tree that results from **(a)**, insert 35∗and then 45∗. Select the<br>
&emsp;&emsp;&emsp;resulting tree.<br>
&emsp;&emsp;&emsp;☐  A)


![Figure on page 9](figures/solutions-p09-fig06.png)

&emsp;&emsp;&emsp;☐  B)


![Figure on page 9](figures/solutions-p09-fig07.png)

&emsp;&emsp;&emsp;☒ **C)**


![Figure on page 9](figures/solutions-p09-fig08.png)

&emsp;&emsp;&emsp;☐  D)


### Question 3 continues...


---

<a id="page-10"></a>
**Page 10**

15-445/645 (Spring 2026)   Homework #3   Page 10 of 17


![Figure on page 10](figures/solutions-p10-fig09.png)

&emsp;&emsp;&emsp;**Solution:** Inserting 35∗causes the second-from-left leaf to split. As the root-level node<br>
&emsp;&emsp;&emsp;is full, the root-node also splits. The 45∗is inserted without any splits or merges.


### Question 3 continues...


---

<a id="page-11"></a>
**Page 11**

15-445/645 (Spring 2026)   Homework #3   Page 11 of 17

&emsp;(c) **\[8 points\]** Starting with the tree that results from **(b)**, delete 190∗and then 60∗. Select<br>
&emsp;&emsp;&emsp;the resulting tree.<br>
&emsp;&emsp;&emsp;☐  A)


![Figure on page 11](figures/solutions-p11-fig10.png)

&emsp;&emsp;&emsp;☒ **B)**


![Figure on page 11](figures/solutions-p11-fig11.png)

&emsp;&emsp;&emsp;☐  C)


![Figure on page 11](figures/solutions-p11-fig12.png)

&emsp;&emsp;&emsp;☐  D)


### Question 3 continues...


---

<a id="page-12"></a>
**Page 12**

15-445/645 (Spring 2026)   Homework #3   Page 12 of 17


![Figure on page 12](figures/solutions-p12-fig13.png)

&emsp;&emsp;&emsp;**Solution:** For both deletions, the node underflows and needs to borrow from its neigh-<br>
&emsp;&emsp;&emsp;bor.


### Question 3 continues...


---

<a id="page-13"></a>
**Page 13**

15-445/645 (Spring 2026)   Homework #3   Page 13 of 17

&emsp;(d)   i. **\[2 points\]** Threads must release their latches in the order they were acquired (i.e.,<br>
&emsp;&emsp;&emsp;&emsp;FIFO).<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** Threads can release latches in any order.<br>
&emsp;&emsp;&emsp;ii. **\[2 points\]** Under optimistic latch coupling, write threads only take the write latch<br>
&emsp;&emsp;&emsp;&emsp;on the root when they restart.<br>
&emsp;&emsp;&emsp;&emsp;☒ **True**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  False<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** Using the optimistic latch coupling/crabbing scheme that we discussed<br>
&emsp;&emsp;&emsp;&emsp;in class, the thread will take a write latch on the root if it needs to restart.<br>
&emsp;&emsp;&emsp;iii. **\[2 points\]** A DBMS primarily executes OLTP queries but periodically will execute<br>
&emsp;&emsp;&emsp;&emsp;OLAP style queries (e.g., analytics, book-keeping). The DBMS will benefit from<br>
&emsp;&emsp;&emsp;&emsp;using one buffer pool for inner node pages and a different buffer pool for leaf pages<br>
&emsp;&emsp;&emsp;&emsp;/ table pages.<br>
&emsp;&emsp;&emsp;&emsp;☒ **True**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  False<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** Because the DBMS is aware of whether a page is for a leaf or an inner<br>
&emsp;&emsp;&emsp;&emsp;node, and because B+Tree transformations never change a leaf into an inner node or<br>
&emsp;&emsp;&emsp;&emsp;vice- versa, it’s straightforward for a DBMS to use a different buffer pool for inner<br>
&emsp;&emsp;&emsp;&emsp;node pages than for leaf node pages. Such a configuration would help prevent index<br>
&emsp;&emsp;&emsp;&emsp;leaf scans from sequentially flooding the buffer pool and harming the performance<br>
&emsp;&emsp;&emsp;&emsp;of OLTP-style queries on the same index.<br>
&emsp;&emsp;&emsp;iv. **\[2 points\]** Under optimistic latch crabbing, read-only thread can drop its latch on<br>
&emsp;&emsp;&emsp;&emsp;the current page before acquiring the latch on the next page (e.g., child, sibling).<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** During traversal, a reader temporarily needs to hold a latch on both the<br>
&emsp;&emsp;&emsp;&emsp;parent and child (or two siblings in a leaf node scan) before releasing the latch on<br>
&emsp;&emsp;&emsp;&emsp;the parent page.<br>
&emsp;&emsp;&emsp;v. **\[2 points\]** “No-Wait” mode for acquiring sibling latches prevents deadlock by al-<br>
&emsp;&emsp;&emsp;&emsp;lowing the acquirer to fail if another reader already owns the lock.<br>
&emsp;&emsp;&emsp;&emsp;☒ **True**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  False<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** A “no-wait” mode prevents threads from getting stuck.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #3 continues...


---

<a id="page-14"></a>
**Page 14**

15-445/645 (Spring 2026)   Homework #3   Page 14 of 17


### **Question 4: Bloom Filter. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .\[20 points\]**

&emsp;**Graded by:**<br>
&emsp;Assume that we have a bloom filter that is used to register words relating to Middle Earth.<br>
&emsp;The filter uses two hash functions h1 and h2 which hash the following words to the following<br>
&emsp;values:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;input   h1   h2<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;“Elves”   2031   7380<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;“Hobbits”   9021   1922<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;“Wizards”   7455   2876<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;“Orcs”   1107   6850

&emsp;(a) **\[6 points\]** Suppose the filter has 8 bits initially set to 0:

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;bit 0   bit 1   bit 2   bit 3   bit 4   bit 5   bit 6   bit 7<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;0   0   0   0   0   0   0   0

&emsp;&emsp;&emsp;Which bits will be set to 1 after “Hobbits” and “Elves” have been inserted?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **2**   ☒ **4**   ☒ **5**   ☒ **7**<br>
&emsp;&emsp;&emsp;☐  0   ☐  1   ☐  3   ☐  6<br>
&emsp;&emsp;&emsp;**Solution:** Because the filter has 8 bits, we take the modulo of the hashed output and 8.<br>
&emsp;(b) Suppose the filter has 8 bits set to the following values:

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;bit 0   bit 1   bit 2   bit 3   bit 4   bit 5   bit 6   bit 7<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;0   0   1   1   1   1   0   0

&emsp;&emsp;&emsp;i. **\[4 points\]** What will we learn using the above filter if we lookup “Orcs”?<br>
&emsp;&emsp;&emsp;&emsp;☐  Orcs has been inserted<br>
&emsp;&emsp;&emsp;&emsp;☐  Orcs has not been inserted<br>
&emsp;&emsp;&emsp;&emsp;☒ **Orcs may have been inserted**<br>
&emsp;&emsp;&emsp;&emsp;☐  Not possible to know

&emsp;&emsp;&emsp;&emsp;**Solution:** 1107 mod 8 = 3; 6850 mod 8 = 2<br>
&emsp;&emsp;&emsp;&emsp;Because both bits are 1, the filter will return true, meaning Orcs may have been<br>
&emsp;&emsp;&emsp;&emsp;inserted.<br>
&emsp;&emsp;&emsp;ii. **\[4 points\]** What will we learn if we lookup “Wizards”?<br>
&emsp;&emsp;&emsp;&emsp;☐  Wizards has been inserted<br>
&emsp;&emsp;&emsp;&emsp;☒ **Wizards has not been inserted**<br>
&emsp;&emsp;&emsp;&emsp;☐  Wizards may have been inserted<br>
&emsp;&emsp;&emsp;&emsp;☐  Not possible to know


### Question 4 continues...


---

<a id="page-15"></a>
**Page 15**

15-445/645 (Spring 2026)   Homework #3   Page 15 of 17

&emsp;&emsp;&emsp;&emsp;**Solution:** 7455 mod 8 = 7; 2876 mod 8 = 4<br>
&emsp;&emsp;&emsp;&emsp;Because bit 7 is 0, the filter will return false, so Wizards has not been inserted.<br>
&emsp;(c) **\[6 points\]** A colleague is interviewing a candidate and would like to first test your<br>
&emsp;&emsp;&emsp;knowledge of bloom filters. The colleague has a list of prepared statements and would<br>
&emsp;&emsp;&emsp;like you to identify which of them are true. Select all true statements.<br>
&emsp;&emsp;&emsp;☒ **A Bloom filter may return a false positive, but never a false negative.**<br>
&emsp;&emsp;&emsp;☐  Using more hash functions will always lower a bloom filter’s false positive rate.<br>
&emsp;&emsp;&emsp;☐  Increasing the size of the bit array has no effect on the false positive rate.<br>
&emsp;&emsp;&emsp;☒ **Add and lookup operations on bloom filters are parallelizable.**<br>
&emsp;&emsp;&emsp;☐  All of the above.

&emsp;&emsp;&emsp;**Solution:** False negatives are impossible with bloom filters since the bits must be set if<br>
&emsp;&emsp;&emsp;an element is added to the filter.<br>
&emsp;&emsp;&emsp;Using more hash functions can increase the likelihood of false positives due to overlap-<br>
&emsp;&emsp;&emsp;ping bits.<br>
&emsp;&emsp;&emsp;Increasing the size of the bit array can reduce false positives as elements hash to more<br>
&emsp;&emsp;&emsp;distinct values.<br>
&emsp;&emsp;&emsp;It is possible to parallelize these operations.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #3 continues...


---

<a id="page-16"></a>
**Page 16**

15-445/645 (Spring 2026)   Homework #3   Page 16 of 17


### **Question 5: Alternate Index Structures . . . . . . . . . . . . . . . . . . . . . . . . \[15 points\]**

&emsp;**Graded by:**<br>
&emsp;(a) **\[5 points\]** Your team is considering using a **Radix Tree** for indexing in a new database<br>
&emsp;&emsp;&emsp;system. They consulted a large language model for some factual statements about Radix<br>
&emsp;&emsp;&emsp;Trees but are unsure about the accuracy of the model’s responses. They have asked you<br>
&emsp;&emsp;&emsp;to identify all factually correct statements.<br>
&emsp;&emsp;&emsp;☒ **Radix Trees are efficient for prefix queries.**<br>
&emsp;&emsp;&emsp;☐  Radix Trees support efficient substring searches (e.g., LIKE “%?%”).<br>
&emsp;&emsp;&emsp;☒ **Search time in a radix tree depends on the length of the key being searched.**<br>
&emsp;&emsp;&emsp;☒ **Two keys with a long common prefix will share a path in a radix tree.**<br>
&emsp;&emsp;&emsp;☒ **For datasets with lots of common prefixes, radix trees can use less space than**<br>
&emsp;&emsp;&emsp;**B+Trees.**<br>
&emsp;&emsp;&emsp;☐  None of the above.<br>
&emsp;&emsp;&emsp;**Solution:** Radix Trees are indeed efficient for prefix queries.<br>
&emsp;&emsp;&emsp;Radix Trees do not support efficient substring searches; they are optimized for prefix<br>
&emsp;&emsp;&emsp;matching.<br>
&emsp;&emsp;&emsp;Search time does depend on the length of the key being searched, since we may need to<br>
&emsp;&emsp;&emsp;traverse more nodes for a longer key.<br>
&emsp;&emsp;&emsp;Keys with long common prefixes will share a path until their first character of diver-<br>
&emsp;&emsp;&emsp;gence.<br>
&emsp;&emsp;&emsp;They can be more space-efficient than B+Trees for certain datasets, especially when<br>
&emsp;&emsp;&emsp;keys share common prefixes.

&emsp;(b) **\[5 points\]** You are discussing index structures with a colleague. They want to compare<br>
&emsp;&emsp;&emsp;**B+Trees**, **Skip Lists**, **Radix Trees**, and **Inverted Indexes**. Select all the true statements.<br>
&emsp;&emsp;&emsp;☒ **It is on average cheaper to update skip lists than B+Trees.**<br>
&emsp;&emsp;&emsp;☐  B+Trees and Skip Lists both guarantee logarithmic complexity for lookups.<br>
&emsp;&emsp;&emsp;☐  B+Trees and Inverted Indexes are both efficient at handling substring (e.g., LIKE<br>
&emsp;&emsp;&emsp;“%?%”) queries.<br>
&emsp;&emsp;&emsp;☐  Skip Lists perform better than B+Trees for range queries.<br>
&emsp;&emsp;&emsp;☐  None of the above.<br>
&emsp;&emsp;&emsp;**Solution:** B+Trees are generally more expensive to update than Skip Lists due to the<br>
&emsp;&emsp;&emsp;need for node splits and merges.<br>
&emsp;&emsp;&emsp;Skip Lists have **approximate** logarithmic complexity for lookups, but it is not guaran-<br>
&emsp;&emsp;&emsp;teed.<br>
&emsp;&emsp;&emsp;B+Trees are not efficient for substring queries.<br>
&emsp;&emsp;&emsp;B+Trees generally perform better than Skip Lists for range queries due to their sequen-<br>
&emsp;&emsp;&emsp;tial access patterns.


### Question 5 continues...


---

<a id="page-17"></a>
**Page 17**

15-445/645 (Spring 2026)   Homework #3   Page 17 of 17

&emsp;(c) **\[5 points\]** Suppose you are trying to run the following query:<br>
&emsp;&emsp;&emsp;`SELECT` `*` `FROM` `PRODUCTS` `WHERE` `description` `LIKE` `‘%laptop%’;`<br>
&emsp;&emsp;&emsp;Assume that there is a non-clustering B+Tree index on `description`. Your query is<br>
&emsp;&emsp;&emsp;running slowly. Which of the following choices (if any) would make this query go faster?<br>
&emsp;&emsp;&emsp;☐  Drop the index and build a **bloom filter** on `description`.<br>
&emsp;&emsp;&emsp;☐  Replace the index with a **hash index** on `description`.<br>
&emsp;&emsp;&emsp;☐  Replace the non-clustering B+Tree with a **clustering** B+Tree index on `description`.<br>
&emsp;&emsp;&emsp;☐  Replace the index with a **radix tree** on `description`.<br>
&emsp;&emsp;&emsp;☒ **None of the above.**<br>
&emsp;&emsp;&emsp;**Solution:** All of these options would not substantially speed up the query. If such<br>
&emsp;&emsp;&emsp;queries dominate the workload, the best approach would be to invest in an **inverted**<br>
&emsp;&emsp;&emsp;**index**, which is specifically designed for text-based searches like the one in the query.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;End of Homework #3

