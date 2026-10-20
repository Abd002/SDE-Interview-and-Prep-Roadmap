# CMU 15-445 Spring 2025: Homework 3: Official solutions

> Copied from the original: <https://15445.courses.cs.cmu.edu/spring2025/assignments.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CARNEGIE MELLON UNIVERSITY<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;COMPUTER SCIENCE DEPARTMENT<br>
&emsp;&emsp;&emsp;&emsp;&emsp;15-445/645 – DATABASE SYSTEMS (SPRING 2025)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;PROF. JIGNESH PATEL

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #3 (by Ramsey) – Solutions<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Due: **Sunday February 23rd, 2025 @ 11:59pm**

**IMPORTANT:**<br>
&emsp;• Enter all of your answers into **Gradescope by 11:59pm on Sunday February 23rd, 2025.**<br>
&emsp;• **Plagiarism**: Homework may be discussed with other students, but all homework is to be<br>
&emsp;&emsp;completed **individually**.<br>
For your information:<br>
&emsp;• Graded out of **100** points; **5** questions total<br>
&emsp;• Rough time estimate: ≈4-6 hours (1-1.5 hours for each question)<br>
&emsp;Revision : 2025/02/12 15:16

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

15-445/645 (Spring 2025)   Homework #3   Page 2 of 15


### **Question 1: Linear Hashing and Cuckoo Hashing . . . . . . . . . . . . . . \[18 points\]**

&emsp;**Graded by:**<br>
&emsp;For warmup, consider the following Linear Probe Hashing schema:<br>
&emsp;&emsp;1\. The table has a size of 4 slots, each slot can only contain one key-value pair.<br>
&emsp;&emsp;2\. The hashing function is<br>
&emsp;&emsp;&emsp;h1(`x`) = `x` `%` `4`.<br>
&emsp;&emsp;3\. When there is a conflict, it finds the next free slot to insert key-value pairs.<br>
&emsp;&emsp;4\. The original table is empty.<br>
&emsp;&emsp;5\. Uses a tombstone when deleting a key.<br>
&emsp;(a) **\[2 points\]** Insert key/value pairs `(2,C)` and `(6,D)`. For `(2,C)`, “2” is the key and “C” is<br>
&emsp;&emsp;&emsp;the value. Select the value in each entry of the resulting table.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **Empty**<br>
&emsp;&emsp;&emsp;i. Entry 0 (key % 4 = 0) ☐  C   ☐  D<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **Empty**<br>
&emsp;&emsp;&emsp;ii. Entry 1 (key % 4 = 1) ☐  C   ☐  D<br>
&emsp;&emsp;&emsp;iii. Entry 2 (key % 4 = 2) ☒ **C**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  D   ☐  Empty<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **D**<br>
&emsp;&emsp;&emsp;iv. Entry 3 (key % 4 = 3) ☐  C   ☐  Empty<br>
&emsp;&emsp;&emsp;**Solution:** `C` is inserted into Entry 2, and `D` is inserted into Entry 3.

&emsp;(b) **\[2 points\]** After the changes from part **(a)**, delete `(2,` `C)`, insert key-value `(10,` `E)`, and<br>
&emsp;&emsp;&emsp;lastly insert `(14,` `F)`. Select the value in each entry of the resulting table.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **F**<br>
&emsp;&emsp;&emsp;i. Entry 0 (key % 4 = 0) ☐  Tombstone   ☐  C   ☐  D   ☐  E   ☐  Empty<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **Empty**<br>
&emsp;&emsp;&emsp;ii. Entry 1 (key % 4 = 1) ☐  Tombstone   ☐  C   ☐  D   ☐  E   ☐  F<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **E**<br>
&emsp;&emsp;&emsp;iii. Entry 2 (key % 4 = 2) ☐  Tombstone   ☐  C   ☐  D   ☐  F   ☐  Empty<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **D**<br>
&emsp;&emsp;&emsp;iv. Entry 3 (key % 4 = 3) ☐  Tombstone   ☐  C   ☐  E   ☐  F   ☐  Empty<br>
&emsp;&emsp;&emsp;**Solution:** `C` is first deleted, which inserts a tombstone into Entry 2. `E` is then inserted<br>
&emsp;&emsp;&emsp;into Entry 2 (since there is nothing there). Then, `F` is attempted to be inserted into Entry<br>
&emsp;&emsp;&emsp;2, but since it’s occupied by `E`, `F` is inserted into Entry 0 instead.


### Question 1 continues...


---

<a id="page-3"></a>
**Page 3**

15-445/645 (Spring 2025)   Homework #3   Page 3 of 15

&emsp;Consider the following Cuckoo Hashing schema:<br>
&emsp;&emsp;1\. Both tables have a size of 4.<br>
&emsp;&emsp;2\. The hashing function of the first table returns the fourth and third least significant bits:<br>
&emsp;&emsp;&emsp;h1(`x`) = `(x` `>>` `2)` `&` `0b11`.<br>
&emsp;&emsp;3\. The hashing function of the second table returns the least significant two bits:<br>
&emsp;&emsp;&emsp;h2(`x`) = `x` `&` `0b11`.<br>
&emsp;&emsp;4\. When inserting, try table 1 first.<br>
&emsp;&emsp;5\. When replacement is necessary, first select an element in the second table.<br>
&emsp;&emsp;6\. The original entries in the table are shown below.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Table 1**   **Entry 0**   **Entry 1**   **Entry 2**   **Entry 3**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Keys   -   20   -   -<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Table 2**   **Entry 0**   **Entry 1**   **Entry 2**   **Entry 3**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Keys   -   -   -   7<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Figure 1: Initial contents of the hash tables.

&emsp;(a) **\[2 points\]** Select the sequence of insert operations that results in the initial state.<br>
&emsp;&emsp;&emsp;☒ **Insert 20, Insert 7**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  Insert 7, Insert 20   ☐  None of the above<br>
&emsp;&emsp;&emsp;**Solution:** 20 is inserted into Table 1 `0b01` based on h1, and 7 experiences a collision<br>
&emsp;&emsp;&emsp;and is hashed to Table 2 `0b11` based on h2.


### Question 1 continues...


---

<a id="page-4"></a>
**Page 4**

15-445/645 (Spring 2025)   Homework #3   Page 4 of 15

&emsp;(b) Starting from the initial contents, insert key `22` and then insert `38`. Select the values in the<br>
&emsp;&emsp;&emsp;resulting two tables.<br>
&emsp;&emsp;&emsp;i. Table 1<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **Empty**<br>
&emsp;&emsp;&emsp;&emsp;α) **\[1 point\]** Entry 0 (`0b00`) ☐  20   ☐  7   ☐  22   ☐  38<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **22**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;β) **\[1 point\]** Entry 1 (`0b01`) ☐  20   ☐  7   ☐  38   ☐  Empty<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **Empty**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;γ) **\[1 point\]** Entry 2 (`0b10`) ☐  20   ☐  7   ☐  22   ☐  38<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **Empty**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;δ) **\[1 point\]** Entry 3 (`0b11`) ☐  20   ☐  7   ☐  22   ☐  38

&emsp;&emsp;&emsp;ii. Table 2<br>
&emsp;&emsp;&emsp;&emsp;α) **\[1 point\]** Entry 0 (`0b00`) ☒ **20**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  7   ☐  22   ☐  38   ☐  Empty<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **Empty**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;β) **\[1 point\]** Entry 1 (`0b01`) ☐  20   ☐  7   ☐  22   ☐  38<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **38**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;γ) **\[1 point\]** Entry 2 (`0b10`) ☐  20   ☐  7   ☐  22   ☐  Empty<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **7**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;δ) **\[1 point\]** Entry 3 (`0b11`) ☐  20   ☐  22   ☐  38   ☐  Empty

&emsp;&emsp;&emsp;**Solution:** 22 tries to insert into Table 1 first but due to conflict, it inserts into Entry 2 of<br>
&emsp;&emsp;&emsp;Table 2. 38 tries to insert into both tables but conflicts with both, so 38 inserts into Entry<br>
&emsp;&emsp;&emsp;2 of Table 2, replacing 22. 22 is then rehashed into Table 1 Entry 1, replacing 20. 20 is<br>
&emsp;&emsp;&emsp;then rehashed into Table 2 Entry 0.<br>
&emsp;(c) **\[4 points\]** Consider completely empty tables using the same two hash functions. Select<br>
&emsp;&emsp;&emsp;which sequence of insertions below will cause an infinite loop.<br>
&emsp;&emsp;&emsp;☐  `[1,` `5,` `9,` `13]`<br>
&emsp;&emsp;&emsp;☒ `[0,` `8,` `16,` `24]`<br>
&emsp;&emsp;&emsp;☐  `[2,` `6,` `10,` `14]`<br>
&emsp;&emsp;&emsp;☐  `[3,` `7,` `11,` `15]`<br>
&emsp;&emsp;&emsp;☐  None of the above<br>
&emsp;&emsp;&emsp;**Solution:** The sequence `[0,` `8,` `16,` `24]` will cause an infinite loop because 4 keys<br>
&emsp;&emsp;&emsp;map to a to 3 entries.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #3 continues...


---

<a id="page-5"></a>
**Page 5**

15-445/645 (Spring 2025)   Homework #3   Page 5 of 15


### **Question 2: Extendible Hashing. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .\[20 points\]**

&emsp;**Graded by:**<br>
&emsp;Consider an extendible hashing structure such that:<br>
&emsp;&emsp;• Each bucket can hold up to two records.<br>
&emsp;&emsp;• The hashing function uses the lowest g bits, where g is the global depth.<br>
&emsp;&emsp;• A new extendible hashing structure is initialized with g = 0 and one empty bucket<br>
&emsp;&emsp;• If multiple keys are provided in a question, assume they are inserted one after the other<br>
&emsp;&emsp;&emsp;from left to right.<br>
&emsp;(a) Starting from an empty table, insert keys 1, 2.<br>
&emsp;&emsp;&emsp;i. **\[1 point\]** What is the global depth of the resulting table?<br>
&emsp;&emsp;&emsp;&emsp;☒ **0**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  1   ☐  2   ☐  3   ☐  4   ☐  None of the above<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** No split has occurred yet because the first bucket (on initialization) can<br>
&emsp;&emsp;&emsp;&emsp;hold 2 arbitrary values. Thus global depth is same as its initial value of 0.<br>
&emsp;&emsp;&emsp;ii. **\[1 point\]** What is the local depth of the bucket containing 2?<br>
&emsp;&emsp;&emsp;&emsp;☒ **0**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  1   ☐  2   ☐  3   ☐  4   ☐  None of the above<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** There is only one bucket (created on initialization), and it holds both 1<br>
&emsp;&emsp;&emsp;&emsp;and 2. Since no split has occurred yet, the bucket has local depth d = 0.<br>
&emsp;(b) Starting from the result in **(a)**, you insert keys 9, 11.<br>
&emsp;&emsp;&emsp;i. **\[2 points\]** What is the global depth of the resulting table?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **2**<br>
&emsp;&emsp;&emsp;&emsp;☐  0   ☐  1   ☐  3   ☐  4   ☐  None of the above<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** After the inserts and splits, the table looks like the following:<br>
&emsp;&emsp;&emsp;&emsp;Global depth = 2<br>
&emsp;&emsp;&emsp;&emsp;`b0,b2` = 2 // at local depth 1<br>
&emsp;&emsp;&emsp;&emsp;`b1` = 1,9 // at local depth 2<br>
&emsp;&emsp;&emsp;&emsp;`b3` = 11 // at local depth 2

&emsp;&emsp;&emsp;ii. **\[2 points\]** What are the local depths of the buckets for each key?<br>
&emsp;&emsp;&emsp;&emsp;☐  1 (Depth 1), 2 (Depth 1), 9 (Depth 1), 11 (Depth 1)<br>
&emsp;&emsp;&emsp;&emsp;☐  1 (Depth 3), 2 (Depth 1), 9 (Depth 3), 11 (Depth 3)<br>
&emsp;&emsp;&emsp;&emsp;☒ **1 (Depth 2), 2 (Depth 1), 9 (Depth 2), 11 (Depth 2)**<br>
&emsp;&emsp;&emsp;&emsp;☐  1 (Depth 3), 2 (Depth 1), 9 (Depth 3), 11 (Depth 2)<br>
&emsp;&emsp;&emsp;&emsp;☐  1 (Depth 2), 2 (Depth 2), 9 (Depth 2), 11 (Depth 2)<br>
&emsp;&emsp;&emsp;&emsp;☐  None of the above<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** See the previous solution for an explanation.<br>
&emsp;(c) Starting from the result in **(b)**, you insert keys 13, 27.<br>
&emsp;&emsp;&emsp;i. **\[2 points\]** What is the global depth of the resulting table?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **3**<br>
&emsp;&emsp;&emsp;&emsp;☐  0   ☐  1   ☐  2   ☐  4   ☐  None of the above


### Question 2 continues...


---

<a id="page-6"></a>
**Page 6**

15-445/645 (Spring 2025)   Homework #3   Page 6 of 15

&emsp;&emsp;&emsp;&emsp;**Solution:** 13 inserts into `b1` and causes a split. 27 inserts into `b3` without a split.<br>
&emsp;&emsp;&emsp;&emsp;The updated table looks as follows: Global depth = 3<br>
&emsp;&emsp;&emsp;&emsp;`b0,b2,b4,b6` = 2 // at local depth 1<br>
&emsp;&emsp;&emsp;&emsp;`b1` = 1,9 // at local depth 3<br>
&emsp;&emsp;&emsp;&emsp;`b5` = 13 // at local depth 3<br>
&emsp;&emsp;&emsp;&emsp;`b3,b7` = 11,27 // at local depth 2

&emsp;&emsp;&emsp;ii. **\[2 points\]** What are the local depths of the buckets for each new key?<br>
&emsp;&emsp;&emsp;&emsp;☐  13 (Depth 1), 27 (Depth 1)<br>
&emsp;&emsp;&emsp;&emsp;☐  13 (Depth 1), 27 (Depth 2)<br>
&emsp;&emsp;&emsp;&emsp;☐  13 (Depth 2), 27 (Depth 2)<br>
&emsp;&emsp;&emsp;&emsp;☒ **13 (Depth 3), 27 (Depth 2)**<br>
&emsp;&emsp;&emsp;&emsp;☐  13 (Depth 3), 27 (Depth 3)<br>
&emsp;&emsp;&emsp;&emsp;☐  None of the above<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** See the previous solution for an explanation.<br>
&emsp;(d) **\[3 points\]** Starting from **(c)**’s result, which **key(s)**, if inserted next, will **not** cause a split?<br>
&emsp;&emsp;&emsp;☒ **5**   ☒ **8**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  17   ☐  43   ☐  None of the above<br>
&emsp;&emsp;&emsp;**Solution:** To avoid a split in the current table the value must map to one of the fol-<br>
&emsp;&emsp;&emsp;lowing: `b0,b2,b4,b6,b5`. Out of the options provided only 5 and 8 hash to one of<br>
&emsp;&emsp;&emsp;those.<br>
&emsp;(e) **\[3 points\]** Starting from the result in **(c)**, which **key(s)**, if inserted next, will cause a split<br>
&emsp;&emsp;&emsp;and increase the table’s global depth?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☒ **3**   ☒ **17**<br>
&emsp;&emsp;&emsp;☐  0   ☐  5   ☐  None of the above<br>
&emsp;&emsp;&emsp;**Solution:** There are two options. The first is to insert a key that hashes to `b1`, since it<br>
&emsp;&emsp;&emsp;is the only full bucket whose local depth is equal to the global depth. **17** maps to this<br>
&emsp;&emsp;&emsp;bucket.<br>
&emsp;&emsp;&emsp;The other option is **3**. 3 maps to bucket (b3,b7). Inserting **3** causes a local depth increase<br>
&emsp;&emsp;&emsp;to (depth = 3). However, 3, 11, and 27 all re-hash to the same bucket. This results in<br>
&emsp;&emsp;&emsp;another split that increases the global depth.<br>
&emsp;(f) **\[4 points\]** Starting from an empty table, insert keys 32, 64, 128, 512. What is the global<br>
&emsp;&emsp;&emsp;depth of the resulting table?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **7**<br>
&emsp;&emsp;&emsp;☐  4   ☐  5   ☐  6   ☐  8   ☐  ≥9<br>
&emsp;&emsp;&emsp;**Solution:** Since each bucket can hold at most two keys, three or more keys cannot hash<br>
&emsp;&emsp;&emsp;to the same bucket without causing splits. When g = 7, 32 and 64 will each be mapped<br>
&emsp;&emsp;&emsp;to their own bin. 128 and 512 will share the same bin.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #3 continues...


---

<a id="page-7"></a>
**Page 7**

15-445/645 (Spring 2025)   Homework #3   Page 7 of 15


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

15-445/645 (Spring 2025)   Homework #3   Page 8 of 15

&emsp;(a) **\[4 points\]** Insert 0∗into the B+tree. Select the resulting tree.<br>
&emsp;&emsp;&emsp;☐  A)


![Figure on page 8](figures/solutions-p08-fig02.png)

&emsp;&emsp;&emsp;☐  B)


![Figure on page 8](figures/solutions-p08-fig03.png)

&emsp;&emsp;&emsp;☒ **C)**


![Figure on page 8](figures/solutions-p08-fig04.png)

&emsp;&emsp;&emsp;☐  D)


![Figure on page 8](figures/solutions-p08-fig05.png)

&emsp;&emsp;&emsp;**Solution:** Inserting 0∗adds one element in the left-most leaf. It should not cause any<br>
&emsp;&emsp;&emsp;splits or merges.


### Question 3 continues...


---

<a id="page-9"></a>
**Page 9**

15-445/645 (Spring 2025)   Homework #3   Page 9 of 15

&emsp;(b) **\[5 points\]** Starting with the tree that results from **(a)**, insert 35∗and then 45∗. Select the<br>
&emsp;&emsp;&emsp;resulting tree.<br>
&emsp;&emsp;&emsp;☐  A)


![Figure on page 9](figures/solutions-p09-fig06.png)

&emsp;&emsp;&emsp;☐  B)


![Figure on page 9](figures/solutions-p09-fig07.png)

&emsp;&emsp;&emsp;☐  C)


![Figure on page 9](figures/solutions-p09-fig08.png)

&emsp;&emsp;&emsp;☒ **D)**


![Figure on page 9](figures/solutions-p09-fig09.png)

&emsp;&emsp;&emsp;**Solution:** Inserting 35∗fills in the remaining space of the second leaf node (from the<br>
&emsp;&emsp;&emsp;left). After inserting 45∗, the second leaf node splits. As the root-level node is full, the<br>
&emsp;&emsp;&emsp;root-level also splits.


### Question 3 continues...


---

<a id="page-10"></a>
**Page 10**

15-445/645 (Spring 2025)   Homework #3   Page 10 of 15

&emsp;(c) **\[8 points\]** Starting with the tree that results from **(b)**, deletes 80∗and then 20∗. Select<br>
&emsp;&emsp;&emsp;the resulting tree.<br>
&emsp;&emsp;&emsp;☐  A)


![Figure on page 10](figures/solutions-p10-fig10.png)

&emsp;&emsp;&emsp;☒ **B)**


![Figure on page 10](figures/solutions-p10-fig11.png)

&emsp;&emsp;&emsp;☐  C)


![Figure on page 10](figures/solutions-p10-fig12.png)

&emsp;&emsp;&emsp;☐  D)


![Figure on page 10](figures/solutions-p10-fig13.png)

&emsp;&emsp;&emsp;**Solution:** Deleting 80∗causes the third leaf node to underflow and causes the right two<br>
&emsp;&emsp;&emsp;leaf nodes to merge. After merging, the right internal node underflows, which triggers<br>
&emsp;&emsp;&emsp;recursive merging.<br>
&emsp;&emsp;&emsp;Then deleting 20∗causes the second leaf node to underflow. This leads the second and<br>
&emsp;&emsp;&emsp;third leaf node to then merge into (30, 35, 45).


### Question 3 continues...


---

<a id="page-11"></a>
**Page 11**

15-445/645 (Spring 2025)   Homework #3   Page 11 of 15

&emsp;(d)   i. **\[2 points\]** Under optimistic latch crabbing, read-only thread can drop its latch on<br>
&emsp;&emsp;&emsp;&emsp;the current page before acquiring the latch on the next page (e.g., child, sibling).<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** During traversal, a reader temporarily needs to hold a latch on both the<br>
&emsp;&emsp;&emsp;&emsp;parent and child (or two siblings in a leaf node scan) before releasing the latch on<br>
&emsp;&emsp;&emsp;&emsp;the parent page.<br>
&emsp;&emsp;&emsp;ii. **\[2 points\]** Under optimistic latch coupling, write threads never take the write latch<br>
&emsp;&emsp;&emsp;&emsp;on the root to avoid contention.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** Using the optimistic latch coupling/crabbing scheme that we discussed<br>
&emsp;&emsp;&emsp;&emsp;in class, the thread will have to take a write latch on the root if it needs to restart.<br>
&emsp;&emsp;&emsp;iii. **\[2 points\]** Threads can release their latches in any order.<br>
&emsp;&emsp;&emsp;&emsp;☒ **True**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  False<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** Threads can release latches in any order.<br>
&emsp;&emsp;&emsp;iv. **\[2 points\]** “No-Wait” mode for acquiring sibling latches prevents deadlock by al-<br>
&emsp;&emsp;&emsp;&emsp;lowing a read thread to inspect what another thread is doing.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** The “No-Wait” mode does not enable inspecting another thread. Rather,<br>
&emsp;&emsp;&emsp;&emsp;a “no-wait” mode prevents threads from getting stuck.<br>
&emsp;&emsp;&emsp;v. **\[2 points\]** For OLTP-style queries, a DBMS will not benefit from using two sepa-<br>
&emsp;&emsp;&emsp;&emsp;rate buffer pools for inner node and leaf pages.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** Because the DBMS is aware of whether a page is for a leaf or an inner<br>
&emsp;&emsp;&emsp;&emsp;node, and because B+Tree transformations never change a leaf into an inner node or<br>
&emsp;&emsp;&emsp;&emsp;vice- versa, it’s straightforward for a DMBS to use a different buffer pool for inner<br>
&emsp;&emsp;&emsp;&emsp;node pages than for leaf node pages. Such a configuration would help prevent index<br>
&emsp;&emsp;&emsp;&emsp;leaf scans from sequentially flooding the buffer pool and harming the performance<br>
&emsp;&emsp;&emsp;&emsp;of OLTP-style queries on the same index.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #3 continues...


---

<a id="page-12"></a>
**Page 12**

15-445/645 (Spring 2025)   Homework #3   Page 12 of 15


### **Question 4: Bloom Filter. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .\[20 points\]**

&emsp;**Graded by:**<br>
&emsp;Assume that we have a bloom filter that is used to register words relating to common DBMS<br>
&emsp;data structures. The filter uses two hash functions h1 and h2 which hash the following words<br>
&emsp;to the following values:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;inputh1   h2<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;“Bloom”   2847   7391<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;“Hash”   5123   8642<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;“B+tree”   6078   3210<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;“Cuckoo”   7598   9845

&emsp;(a) **\[6 points\]** Suppose the filter has 8 bits initially set to 0:

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;bit 0   bit 1   bit 2   bit 3   bit 4   bit 5   bit 6   bit 7<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;0   0   0   0   0   0   0   0

&emsp;&emsp;&emsp;Which bits will be set to 1 after “Bloom” and “Cuckoo” have been inserted?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **5**   ☒ **6**   ☒ **7**<br>
&emsp;&emsp;&emsp;☐  0   ☐  1   ☐  2   ☐  3   ☐  4<br>
&emsp;&emsp;&emsp;**Solution:** Because the filter has 8 bits, we take the modulo of the hashed output and 8.<br>
&emsp;&emsp;&emsp;2847 mod 8 = 7; 7391 mod 8 = 7; 7598 mod 8 = 6; 9845 mod 8 = 5<br>
&emsp;(b) Suppose the filter has 8 bits set to the following values:

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;bit 0   bit 1   bit 2   bit 3   bit 4   bit 5   bit 6   bit 7<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;0   0   1   1   1   1   0   0

&emsp;&emsp;&emsp;i. **\[4 points\]** What will we learn using the above filter if we lookup “B+tree”?<br>
&emsp;&emsp;&emsp;&emsp;☐  B+tree has been inserted<br>
&emsp;&emsp;&emsp;&emsp;☒ **B+tree has not been inserted**<br>
&emsp;&emsp;&emsp;&emsp;☐  B+tree may have been inserted<br>
&emsp;&emsp;&emsp;&emsp;☐  Not possible to know

&emsp;&emsp;&emsp;&emsp;**Solution:** 6078 mod 8 = 6; 3210 mod 8 = 2<br>
&emsp;&emsp;&emsp;&emsp;Because bit 6 is 0, the filter will return false, so B+tree has not been inserted.<br>
&emsp;&emsp;&emsp;ii. **\[4 points\]** What will we learn if we lookup “Hash”?<br>
&emsp;&emsp;&emsp;&emsp;☐  Hash has been inserted<br>
&emsp;&emsp;&emsp;&emsp;☐  Hash has not been inserted<br>
&emsp;&emsp;&emsp;&emsp;☒ **Hash may have been inserted**<br>
&emsp;&emsp;&emsp;&emsp;☐  Not possible to know


### Question 4 continues...


---

<a id="page-13"></a>
**Page 13**

15-445/645 (Spring 2025)   Homework #3   Page 13 of 15

&emsp;&emsp;&emsp;&emsp;**Solution:** 5123 mod 8 = 3; 8642 mod 8 = 2<br>
&emsp;&emsp;&emsp;&emsp;Because both bits are 1, the filter will return true, meaning Hash may have been<br>
&emsp;&emsp;&emsp;&emsp;inserted.<br>
&emsp;(c) **\[6 points\]** A colleague is interviewing a candidate and would like to first test your<br>
&emsp;&emsp;&emsp;knowledge of bloom filters. The colleague has a list of prepared statements and would<br>
&emsp;&emsp;&emsp;like you to identify which of them are true. Select all true statements.<br>
&emsp;&emsp;&emsp;☒ **Bloom filters can eliminate unnecessary disk I/Os.**<br>
&emsp;&emsp;&emsp;☐  We can lower a bloom filter’s false positive rate by using more hash functions.<br>
&emsp;&emsp;&emsp;☐  Bloom filters are effective for exact-match (or lookup) queries.<br>
&emsp;&emsp;&emsp;☒ **Add and lookup operations on bloom filters are parallelizable.**<br>
&emsp;&emsp;&emsp;☐  All of the above.

&emsp;&emsp;&emsp;**Solution:** Using more hash functions can increase the likelihood of false positives due<br>
&emsp;&emsp;&emsp;to overlapping bits.<br>
&emsp;&emsp;&emsp;For exact-match queries, query execution is better off using a hash index.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #3 continues...


---

<a id="page-14"></a>
**Page 14**

15-445/645 (Spring 2025)   Homework #3   Page 14 of 15


### **Question 5: Alternate Index Structures . . . . . . . . . . . . . . . . . . . . . . . . \[15 points\]**

&emsp;**Graded by:**<br>
&emsp;(a) **\[5 points\]** Your team is considering using a **Radix Tree** for indexing in a new database<br>
&emsp;&emsp;&emsp;system. They consulted a large language model for some factual statements about Radix<br>
&emsp;&emsp;&emsp;Trees but are unsure about the accuracy of the model’s responses. They have asked you<br>
&emsp;&emsp;&emsp;to identify all factually correct statements.<br>
&emsp;&emsp;&emsp;☒ **Radix Trees are efficient for prefix queries.**<br>
&emsp;&emsp;&emsp;☐  Radix Trees require re-balancing after every insertion or deletion.<br>
&emsp;&emsp;&emsp;☒ **Radix Trees can be more space-efficient than B+Trees for certain datasets.**<br>
&emsp;&emsp;&emsp;☐  Radix Trees support efficient substring searches (e.g., LIKE “%?%”).<br>
&emsp;&emsp;&emsp;☐  Each level in a Radix Tree must have exactly twice the number of nodes as the level<br>
&emsp;&emsp;&emsp;above it.<br>
&emsp;&emsp;&emsp;☐  None of the above.<br>
&emsp;&emsp;&emsp;**Solution:** Radix Trees are indeed efficient for prefix queries and can be more space-<br>
&emsp;&emsp;&emsp;efficient than B+Trees for certain datasets, especially when keys share common prefixes.<br>
&emsp;&emsp;&emsp;Radix Trees do not require re-balancing like balanced trees (e.g., AVL or Red-Black<br>
&emsp;&emsp;&emsp;Trees).<br>
&emsp;&emsp;&emsp;Radix Trees do not support efficient substring searches; they are optimized for prefix<br>
&emsp;&emsp;&emsp;matching.<br>
&emsp;&emsp;&emsp;There is no requirement that each level in a Radix Tree must have exactly twice the<br>
&emsp;&emsp;&emsp;number of nodes as the level above it.

&emsp;(b) **\[5 points\]** You are discussing index structures with a colleague. They want to compare<br>
&emsp;&emsp;&emsp;**B+Trees**, **Skip Lists**, **Radix Trees**, and **Inverted Indexes**. Select all the true statements.<br>
&emsp;&emsp;&emsp;☐  B+Trees and Skip Lists both guarantee logarithmic complexity for lookups.<br>
&emsp;&emsp;&emsp;☐  Radix Trees and Inverted Indexes are both efficient at handling range queries.<br>
&emsp;&emsp;&emsp;☐  Skip Lists perform better than B+Trees for range queries.<br>
&emsp;&emsp;&emsp;☐  Update overhead is generally Inverted Index \> Skip Lists \> B+Tree.<br>
&emsp;&emsp;&emsp;☒ **None of the above.**<br>
&emsp;&emsp;&emsp;**Solution:** All of the above statements are false.<br>
&emsp;&emsp;&emsp;Skip Lists have **approximate** logarithmic complexity for lookups, but it is not guaran-<br>
&emsp;&emsp;&emsp;teed.<br>
&emsp;&emsp;&emsp;Radix Trees are efficient for prefix queries, but they are not designed for range queries.<br>
&emsp;&emsp;&emsp;Inverted Indexes are not efficient for range queries either.<br>
&emsp;&emsp;&emsp;B+Trees generally perform better than Skip Lists for range queries due to their sequen-<br>
&emsp;&emsp;&emsp;tial access patterns.<br>
&emsp;&emsp;&emsp;Inverted Indexes are expensive to update, but B+Trees are generally more expensive to<br>
&emsp;&emsp;&emsp;update than Skip Lists due to the need for node splits and merges.

&emsp;(c) **\[5 points\]** Suppose you are trying to run the following query:


### Question 5 continues...


---

<a id="page-15"></a>
**Page 15**

15-445/645 (Spring 2025)   Homework #3   Page 15 of 15

&emsp;&emsp;&emsp;`SELECT`   `*`   `FROM`   `PRODUCTS`   `WHERE`   `description`   `NOT`   `LIKE`<br>
&emsp;&emsp;&emsp;`‘%organic%’;`<br>
&emsp;&emsp;&emsp;Assume that there is a non-clustering B+Tree index on `description`. Your query is<br>
&emsp;&emsp;&emsp;running slowly. Which of the following choices (if any) would make this query go faster?<br>
&emsp;&emsp;&emsp;☐  Replace the non-clustering B+Tree with a **clustering** B+Tree index on `description`.<br>
&emsp;&emsp;&emsp;☐  Replace the index with a **hash index** on `description`.<br>
&emsp;&emsp;&emsp;☐  Drop the index and build a **bloom filter** on `description`.<br>
&emsp;&emsp;&emsp;☐  Replace the index with a **trie or radix tree** on `description`.<br>
&emsp;&emsp;&emsp;☒ **None of the above.**<br>
&emsp;&emsp;&emsp;**Solution:** All of these options would not substantially speed up the query. If such<br>
&emsp;&emsp;&emsp;queries dominate the workload, the best approach would be to invest in an **inverted**<br>
&emsp;&emsp;&emsp;**index**, which is specifically designed for text-based searches like the one in the query.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;End of Homework #3

