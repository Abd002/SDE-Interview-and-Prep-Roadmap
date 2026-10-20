# CMU 15-445 Spring 2024: Homework 2: Official solutions

> Copied from the original: <https://15445.courses.cs.cmu.edu/spring2024/assignments.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CARNEGIE MELLON UNIVERSITY<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;COMPUTER SCIENCE DEPARTMENT<br>
&emsp;&emsp;&emsp;&emsp;&emsp;15-445/645 – DATABASE SYSTEMS (SPRING 2024)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;PROF. JIGNESH PATEL

&emsp;&emsp;&emsp;&emsp;&emsp;Homework #2 (by Shivang and Avery ) – Solutions<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Due: **Friday February 16, 2024 @ 11:59pm**

**IMPORTANT:**<br>
&emsp;• Enter all of your answers into **Gradescope by 11:59pm on Friday February 16, 2024.**<br>
&emsp;• **Plagiarism**: Homework may be discussed with other students, but all homework is to be<br>
&emsp;&emsp;completed **individually**.<br>
For your information:<br>
&emsp;• Graded out of **100** points; **4** questions total<br>
&emsp;• Rough time estimate: ≈4-6 hours (1-1.5 hours for each question)<br>
&emsp;Revision : 2024/02/20 17:29

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

15-445/645 (Spring 2024)   Homework #2   Page 2 of 16


### **Question 1: Storage Models . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . \[24 points\]**

&emsp;**Graded by:**<br>
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


![Figure on page 2](figures/solutions-p02-fig01.png)

&emsp;&emsp;&emsp;i. **\[3 points\]** Suppose the DBMS uses the decomposition storage model (DSM) with<br>
&emsp;&emsp;&emsp;&emsp;implicit offsets. How many pages will the DBMS potentially have to read from disk<br>
&emsp;&emsp;&emsp;&emsp;to answer this query? (Keep in mind our assumption about the contents of `T`!)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **201-300**<br>
&emsp;&emsp;&emsp;&emsp;☐  1-100   ☐  101-200   ☐  301-500   ☐  ≥501   ☐  Not possible<br>
&emsp;&emsp;&emsp;&emsp;to determine

&emsp;&emsp;&emsp;&emsp;**Solution:** 300 pages. There are 100 pages per attribute. 100 pages to find `duration`<br>
&emsp;&emsp;&emsp;&emsp;and another 100 to find `artist` `id` for all tuples. In the worst-case scenario for `T`’s<br>
&emsp;&emsp;&emsp;&emsp;content, `number` `of` `streams` for all tuples must be accessed as well. Hence, an-<br>
&emsp;&emsp;&emsp;&emsp;other 100 pages must be read.<br>
&emsp;&emsp;&emsp;ii. **\[3 points\]** Suppose the DBMS uses the N-ary storage model (NSM). How many<br>
&emsp;&emsp;&emsp;&emsp;pages will the DBMS potentially have to read from disk to answer this query? (Keep<br>
&emsp;&emsp;&emsp;&emsp;in mind our assumption about the contents of `T`!)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **301-500**<br>
&emsp;&emsp;&emsp;&emsp;☐  1-100   ☐  101-200   ☐  201-300   ☐  ≥501   ☐  Not possible<br>
&emsp;&emsp;&emsp;&emsp;to determine

&emsp;&emsp;&emsp;&emsp;**Solution:** 500 pages. To find `duration` and `artist` `id` for all tuples, all pages<br>
&emsp;&emsp;&emsp;&emsp;must be accessed.<br>
&emsp;(b) Now consider the following query:


### Question 1 continues...


---

<a id="page-3"></a>
**Page 3**

15-445/645 (Spring 2024)   Homework #2   Page 3 of 16


![Figure on page 3](figures/solutions-p03-fig02.png)

&emsp;&emsp;&emsp;i. Suppose the DBMS uses the decomposition storage model (DSM) with implicit off-<br>
&emsp;&emsp;&emsp;&emsp;sets.<br>
&emsp;&emsp;&emsp;&emsp;α) **\[3 points\]** What is the minimum number of pages that the DBMS will poten-<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;tially have to read from disk to answer this query?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **2-4**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  1   ☐  5-100   ☐  101-200   ☐  201-500   ☐  ≥501<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  Not possible to determine

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Solution:** 3 pages. Suppose all three primary keys appear on the first page.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Since all attributes are of the same fixed width, each attribute of `song` `id=15445`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;and `song` `id=15645` will also appear on the same page. We’ll thus need to read<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1 page to find the three primary keys and read 2 pages to access `song` `name`,<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`artist` `id` at their corresponding offsets.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;β) **\[3 points\]** What is the maximum number of pages that the DBMS will poten-<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;tially have to read from disk to answer this query?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **101-200**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  1   ☐  2-4   ☐  5-100   ☐  201-500   ☐  ≥501<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  Not possible to determine

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Solution:** 106 pages. There are 100 pages per attribute. In the worst case, we<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;scan through all 100 pages to find the three primary keys. In the worst case,<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;three two primary keys will be located on different pages. Since all attributes<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;are of the same fixed width, each attribute of `song` `id=15445`, `song` `id=15645`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;and `song` `id=15721` will also appear on different pages. Hence we must read<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3 pages to access each attribute at their corresponding offsets. Thus, we read 6<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;pages in total to access `song` `name`, `artist` `id`.<br>
&emsp;&emsp;&emsp;ii. Suppose the DBMS uses the N-ary storage model (NSM).<br>
&emsp;&emsp;&emsp;&emsp;α) **\[3 points\]** What is the minimum number of pages that the DBMS will poten-<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;tially have to read from disk to answer this query?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **1**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  2-4   ☐  5-100   ☐  101-200   ☐  201-500   ☐  ≥501<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  Not possible to determine

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Solution:** We find the tuples of all three primary keys on the first page. No<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;need to look in other pages since all attributes are stored together.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;β) **\[3 points\]** What is the maximum number of pages that the DBMS will poten-<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;tially have to read from disk to answer this query?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **201-500**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  1   ☐  2-4   ☐  5-100   ☐  101-200   ☐  ≥501<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  Not possible to determine


### Question 1 continues...


---

<a id="page-4"></a>
**Page 4**

15-445/645 (Spring 2024)   Homework #2   Page 4 of 16

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Solution:** 500 pages. At least one tuple with matching primary key is located<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;on the last page. We must thus scan through every page.<br>
&emsp;(c) Finally consider the following query:


![Figure on page 4](figures/solutions-p04-fig03.png)

&emsp;&emsp;&emsp;Suppose the DBMS uses the decomposition storage model (DSM) with implicit offsets.<br>
&emsp;&emsp;&emsp;i. **\[3 points\]** What is the minimum number of pages that the DBMS will potentially<br>
&emsp;&emsp;&emsp;&emsp;have to read from disk to answer this query?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ ≥300<br>
&emsp;&emsp;&emsp;&emsp;☐  1   ☐  2-5   ☐  100-200   ☐  201-299   ☐  Not possible to<br>
&emsp;&emsp;&emsp;&emsp;determine

&emsp;&emsp;&emsp;&emsp;**Solution:** 300 pages. 100 pages for the inner select, and 100 pages to get the<br>
&emsp;&emsp;&emsp;&emsp;`song` `id` and `number` `of` `streams` since the buffer pool will have the `duration`<br>
&emsp;&emsp;&emsp;&emsp;pages from the inner select. Remember content-wise the tuples make the queries<br>
&emsp;&emsp;&emsp;&emsp;always run for the longest time, you can only consider different orderings of the<br>
&emsp;&emsp;&emsp;&emsp;tuples.<br>
&emsp;&emsp;&emsp;ii. **\[3 points\]** What is the maximum number of pages that the DBMS will potentially<br>
&emsp;&emsp;&emsp;&emsp;have to read from disk to answer this query?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ ≥300<br>
&emsp;&emsp;&emsp;&emsp;☐  1   ☐  2-5   ☐  100-200   ☐  201-299   ☐  Not possible to<br>
&emsp;&emsp;&emsp;&emsp;determine

&emsp;&emsp;&emsp;&emsp;**Solution:** 300 pages. 100 pages for the inner select, and 100 pages to get the<br>
&emsp;&emsp;&emsp;&emsp;`song` `id` and `number` `of` `streams` since the buffer pool will have the `duration`<br>
&emsp;&emsp;&emsp;&emsp;pages from the inner select. Remember content-wise the tuples make the queries<br>
&emsp;&emsp;&emsp;&emsp;always run for the longest time, you can only consider different orderings of the<br>
&emsp;&emsp;&emsp;&emsp;tuples

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #2 continues...


---

<a id="page-5"></a>
**Page 5**

15-445/645 (Spring 2024)   Homework #2   Page 5 of 16


### **Question 2: Linear Hashing and Cuckoo Hashing . . . . . . . . . . . . . . \[24 points\]**

&emsp;**Graded by:**   Consider the following linear probe hashing schema:<br>
&emsp;&emsp;1\. The table have a size of 4 slots, each slot can only contain one key value pair.<br>
&emsp;&emsp;2\. The hashing function is<br>
&emsp;&emsp;&emsp;h1(`x`) = `x` `%` `4`.<br>
&emsp;&emsp;3\. When there is conflict, it finds the next free slot to insert key value pairs.<br>
&emsp;&emsp;4\. The original table is empty.<br>
&emsp;(a) Insert key value pair (3, A) and (4, B). (for (3,A), 3 is the key and A is the value) Select<br>
&emsp;&emsp;&emsp;the value in each entry of the resulting table.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **B**<br>
&emsp;&emsp;&emsp;i. **\[1 point\]** Entry 0 (key % 4 = 0) ☐  A   ☐  Empty<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **Empty**<br>
&emsp;&emsp;&emsp;ii. **\[1 point\]** Entry 1 (key % 4 = 1) ☐  A   ☐  B<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **Empty**<br>
&emsp;&emsp;&emsp;iii. **\[1 point\]** Entry 2 (key % 4 = 2) ☐  A   ☐  B<br>
&emsp;&emsp;&emsp;iv. **\[1 point\]** Entry 3 (key % 4 = 3) ☒ **A**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  B   ☐  Empty<br>
&emsp;&emsp;&emsp;**Solution:** A is inserted into Entry 3, B is inserted into Entry 0.<br>
&emsp;(b) After the changes from part **(a)**, insert key value pair (8, C) and then (9, D). Select the<br>
&emsp;&emsp;&emsp;value in each entry of the resulting table.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **B**<br>
&emsp;&emsp;&emsp;i. **\[1 point\]** Entry 0 (key % 4 = 0) ☐  A   ☐  C   ☐  D   ☐  Empty<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **C**<br>
&emsp;&emsp;&emsp;ii. **\[1 point\]** Entry 1 (key % 4 = 1) ☐  A   ☐  B   ☐  D   ☐  Empty<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **D**<br>
&emsp;&emsp;&emsp;iii. **\[1 point\]** Entry 2 (key % 4 = 2) ☐  A   ☐  B   ☐  C   ☐  Empty<br>
&emsp;&emsp;&emsp;iv. **\[1 point\]** Entry 3 (key % 4 = 3) ☒ **A**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  B   ☐  C   ☐  D   ☐  Empty<br>
&emsp;&emsp;&emsp;**Solution:** C is tried to be inserted into entry 0, but due to the conflict, it is inserted into<br>
&emsp;&emsp;&emsp;the next free slot which is entry 1. D is tried to be inserted into entry 1, but as it is<br>
&emsp;&emsp;&emsp;occupied by C, D is inserted into entry 2.


### Question 2 continues...


---

<a id="page-6"></a>
**Page 6**

15-445/645 (Spring 2024)   Homework #2   Page 6 of 16

&emsp;Consider the following cuckoo hashing schema:<br>
&emsp;&emsp;1\. Both tables have a size of 4.<br>
&emsp;&emsp;2\. The hashing function of the first table returns the fourth and third least significant bits:<br>
&emsp;&emsp;&emsp;h1(`x`) = `(x` `>>` `2)` `&` `0b11`.<br>
&emsp;&emsp;3\. The hashing function of the second table returns the least significant two bits:<br>
&emsp;&emsp;&emsp;h2(`x`) = `x` `&` `0b11`.<br>
&emsp;&emsp;4\. When inserting, try table 1 first.<br>
&emsp;&emsp;5\. When replacement is necessary, first select an element in the second table.<br>
&emsp;&emsp;6\. The original entries in the table are shown in the figure below.


![Figure on page 6](figures/solutions-p06-fig04.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Figure 1: Initial contents of the hash tables.

&emsp;(a) Insert key 32 and then delete 16. Select the value in each entry of the resulting two tables.

&emsp;&emsp;&emsp;i. Table 1<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **Empty**<br>
&emsp;&emsp;&emsp;&emsp;α) **\[1 point\]** Entry 0 (`0b00`) ☐  32   ☐  16<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **Empty**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;β) **\[1 point\]** Entry 1 (`0b01`) ☐  32   ☐  16<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **Empty**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;γ) **\[1 point\]** Entry 2 (`0b10`) ☐  32   ☐  16<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **Empty**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;δ) **\[1 point\]** Entry 3 (`0b11`) ☐  32   ☐  16

&emsp;&emsp;&emsp;ii. Table 2<br>
&emsp;&emsp;&emsp;&emsp;α) **\[1 point\]** Entry 0 (`0b00`) ☒ **32**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  3   ☐  Empty<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **Empty**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;β) **\[1 point\]** Entry 1 (`0b01`) ☐  32   ☐  3<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **Empty**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;γ) **\[1 point\]** Entry 2 (`0b10`) ☐  32   ☐  3<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **3**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;δ) **\[1 point\]** Entry 3 (`0b11`) ☐  32   ☐  Empty


### Question 2 continues...


---

<a id="page-7"></a>
**Page 7**

15-445/645 (Spring 2024)   Homework #2   Page 7 of 16

&emsp;&emsp;&emsp;**Solution:** 32 tries to insert into table 1 first but due to the conflict, it inserts into the first<br>
&emsp;&emsp;&emsp;entry of table 2. 16 is then deleted makes table 1 an empty table.<br>
&emsp;(b) After the changes from part **(a)**, insert key 27, then delete 3, then insert key 8. Select the<br>
&emsp;&emsp;&emsp;value in each entry of the resulting two tables.

&emsp;&emsp;&emsp;i. Table 1<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **32**<br>
&emsp;&emsp;&emsp;&emsp;α) **\[1 point\]** Entry 0 (`0b00`) ☐  8   ☐  27   ☐  Empty<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **Empty**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;β) **\[1 point\]** Entry 1 (`0b01`) ☐  8   ☐  32   ☐  27<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **27**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;γ) **\[1 point\]** Entry 2 (`0b10`) ☐  8   ☐  32   ☐  Empty<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **Empty**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;δ) **\[1 point\]** Entry 3 (`0b11`) ☐  8   ☐  32   ☐  27

&emsp;&emsp;&emsp;ii. Table 2<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **8**<br>
&emsp;&emsp;&emsp;&emsp;α) **\[1 point\]** Entry 0 (`0b00`) ☐  32   ☐  27   ☐  Empty<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **Empty**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;β) **\[1 point\]** Entry 1 (`0b01`) ☐  32   ☐  8   ☐  27<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **Empty**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;γ) **\[1 point\]** Entry 2 (`0b10`) ☐  32   ☐  8   ☐  27<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **Empty**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;δ) **\[1 point\]** Entry 3 (`0b11`) ☐  32   ☐  8   ☐  27

&emsp;&emsp;&emsp;**Solution:** 27 is inserted into table 1 `0b10` based on h2. 3 is deleted. 8 tries to insert into<br>
&emsp;&emsp;&emsp;table 1 `0b10` but there’s conflict. 8 is then inserted into table 2 `0b00`. 32 is replaced and<br>
&emsp;&emsp;&emsp;rehashed to table 1 `0b00`.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #2 continues...


---

<a id="page-8"></a>
**Page 8**

15-445/645 (Spring 2024)   Homework #2   Page 8 of 16


### **Question 3: Extendible Hashing. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .\[20 points\]**

&emsp;**Graded by:**<br>
&emsp;Consider an extendible hashing structure such that:<br>
&emsp;&emsp;• Each bucket can hold up to two records.<br>
&emsp;&emsp;• The hashing function uses the lowest g bits, where g is the global depth.<br>
&emsp;&emsp;• A new extendible hashing structure is initialized with g = 0 and one empty bucket<br>
&emsp;&emsp;• If multiple keys are provided in a question, assume they are inserted one after the other<br>
&emsp;&emsp;&emsp;from left to right.<br>
&emsp;(a) Starting from an empty table, insert keys 0, 3.<br>
&emsp;&emsp;&emsp;i. **\[1 point\]** What is the global depth of the resulting table?<br>
&emsp;&emsp;&emsp;&emsp;☒ **0**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  1   ☐  2   ☐  3   ☐  4   ☐  None of the above<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** No split has occurred yet because the first bucket (on initialization) can<br>
&emsp;&emsp;&emsp;&emsp;hold 2 arbitrary values. Thus global depth is same as its initial value of 0.<br>
&emsp;&emsp;&emsp;ii. **\[1 point\]** What is the local depth of the bucket containing 0?<br>
&emsp;&emsp;&emsp;&emsp;☒ **0**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  1   ☐  2   ☐  3   ☐  4   ☐  None of the above<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** There is only one bucket (created on initialization), and it holds both 0<br>
&emsp;&emsp;&emsp;&emsp;and 3. Since no split has occurred yet, the bucket has local depth d = 0.<br>
&emsp;(b) Starting from the result in **(a)**, you insert keys 23, 33.<br>
&emsp;&emsp;&emsp;i. **\[2 points\]** What is the global depth of the resulting table?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **2**<br>
&emsp;&emsp;&emsp;&emsp;☐  0   ☐  1   ☐  3   ☐  4   ☐  None of the above<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** Two total splits occurred when inserting 23 and 33. After these splits:<br>
&emsp;&emsp;&emsp;&emsp;The table looks like the following:<br>
&emsp;&emsp;&emsp;&emsp;Global depth = 2<br>
&emsp;&emsp;&emsp;&emsp;`b0,b2` = 0 // at local depth 1<br>
&emsp;&emsp;&emsp;&emsp;`b1` = 33 // at local depth 2<br>
&emsp;&emsp;&emsp;&emsp;`b3` = 3,23 // at local depth 2

&emsp;&emsp;&emsp;ii. **\[1 point\]** What is the local depth of the bucket containing 0?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **1**<br>
&emsp;&emsp;&emsp;&emsp;☐  0   ☐  2   ☐  3   ☐  4   ☐  None of the above<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** See the above table.<br>
&emsp;(c) Starting from the result in **(b)**, you insert keys 13, 27.<br>
&emsp;&emsp;&emsp;i. **\[2 points\]** What is the global depth of the resulting table?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **3**<br>
&emsp;&emsp;&emsp;&emsp;☐  0   ☐  1   ☐  2   ☐  4   ☐  None of the above<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** 13 inserts into `b1` without causing a split. 27 causes a split in `b3`. The<br>
&emsp;&emsp;&emsp;&emsp;updated table looks as follows: Global depth = 3<br>
&emsp;&emsp;&emsp;&emsp;`b0,b2,b4,b6` = 0 // at local depth 1<br>
&emsp;&emsp;&emsp;&emsp;`b1,b5` = 33,13 // at local depth 2


### Question 3 continues...


---

<a id="page-9"></a>
**Page 9**

15-445/645 (Spring 2024)   Homework #2   Page 9 of 16

&emsp;&emsp;&emsp;&emsp;`b3` = 3,27 // at local depth 3<br>
&emsp;&emsp;&emsp;&emsp;`b7` = 23 // at local depth 3

&emsp;&emsp;&emsp;ii. **\[2 points\]** What is the local depth of the bucket containing 13?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **2**<br>
&emsp;&emsp;&emsp;&emsp;☐  0   ☐  1   ☐  3   ☐  4   ☐  None of the above<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** See the above table.<br>
&emsp;&emsp;&emsp;iii. **\[1 point\]** What is the local depth of the bucket containing 3?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **3**<br>
&emsp;&emsp;&emsp;&emsp;☐  0   ☐  1   ☐  2   ☐  4   ☐  None of the above<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** See the above table.<br>
&emsp;&emsp;&emsp;iv. **\[1 point\]** Which value, if inserted, will hash to the same bucket as the bucket con-<br>
&emsp;&emsp;&emsp;&emsp;taining key 27?<br>
&emsp;&emsp;&emsp;&emsp;☒ **43**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  4   ☐  21   ☐  13   ☐  None of the above<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** Only 43 will hash to `b3`.<br>
&emsp;(d) **\[3 points\]** Starting from the result in **(c)**, which **key(s)**, if inserted next, will **not** cause a<br>
&emsp;&emsp;&emsp;split?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **16**<br>
&emsp;&emsp;&emsp;☐  35   ☐  9   ☐  17   ☐  41   ☐  None of the above<br>
&emsp;&emsp;&emsp;**Solution:** To avoid a split in the current table the value must map to one of the follow-<br>
&emsp;&emsp;&emsp;ing: `b0,b2,b4,b6,b7`. Out of the options provided only 16 hashs to one of these.<br>
&emsp;(e) **\[3 points\]** Starting from the result in **(c)**, which **key(s)**, if inserted next, will cause a split<br>
&emsp;&emsp;&emsp;and increase the table’s global depth?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **51**<br>
&emsp;&emsp;&emsp;☐  0   ☐  2   ☐  9   ☐  1   ☐  None of the above<br>
&emsp;&emsp;&emsp;**Solution:** To cause a split while doubling the table size, one must insert a key that<br>
&emsp;&emsp;&emsp;hashes to `b3`, since it is the only full bucket whose local depth is equal to the global<br>
&emsp;&emsp;&emsp;depth. Out of the options only 51 maps to this bucket.<br>
&emsp;(f) **\[3 points\]** Starting from an empty table, insert keys 64, 128, 256, 512. What is the<br>
&emsp;&emsp;&emsp;global depth of the resulting table?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **8**<br>
&emsp;&emsp;&emsp;☐  4   ☐  5   ☐  6   ☐  7   ☐  ≥9<br>
&emsp;&emsp;&emsp;**Solution:** Since each bucket can hold at most two keys, three or more keys cannot hash<br>
&emsp;&emsp;&emsp;to the same bucket without causing splits. Keys 128, 256 and 512 share the same lower<br>
&emsp;&emsp;&emsp;7 bits. Hence, the table will split until global depth reaches g = 8. When g = 8, 128<br>
&emsp;&emsp;&emsp;will no longer be hashed to the same bucket as 512 and 256.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #2 continues...


---

<a id="page-10"></a>
**Page 10**

15-445/645 (Spring 2024)   Homework #2   Page 10 of 16


### **Question 4: B+Tree. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .\[32 points\]**

&emsp;**Graded by:**<br>
&emsp;Consider the following B+tree.


![Figure on page 10](figures/solutions-p10-fig05.png)

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

<a id="page-11"></a>
**Page 11**

15-445/645 (Spring 2024)   Homework #2   Page 11 of 16

&emsp;(a) **\[4 points\]** Insert 24∗into the B+tree. Select the resulting tree.<br>
&emsp;&emsp;&emsp;☒ **A)**


![Figure on page 11](figures/solutions-p11-fig06.png)

&emsp;&emsp;&emsp;☐  B)


![Figure on page 11](figures/solutions-p11-fig07.png)

&emsp;&emsp;&emsp;☐  C)


![Figure on page 11](figures/solutions-p11-fig08.png)

&emsp;&emsp;&emsp;☐  D)


![Figure on page 11](figures/solutions-p11-fig09.png)

&emsp;&emsp;&emsp;**Solution:** Inserting 24∗adds one element in the right-most leaf, as d = 4, it should not<br>
&emsp;&emsp;&emsp;cause any splits or merges.


### Question 4 continues...


---

<a id="page-12"></a>
**Page 12**

15-445/645 (Spring 2024)   Homework #2   Page 12 of 16

&emsp;(b) **\[4 points\]** Starting with the tree that results from **(a)**, insert 15∗. Select the resulting<br>
&emsp;&emsp;&emsp;tree.<br>
&emsp;&emsp;&emsp;☐  A)


![Figure on page 12](figures/solutions-p12-fig10.png)

&emsp;&emsp;&emsp;☐  B)


![Figure on page 12](figures/solutions-p12-fig11.png)

&emsp;&emsp;&emsp;☒ **C)**


![Figure on page 12](figures/solutions-p12-fig12.png)

&emsp;&emsp;&emsp;☐  D)


![Figure on page 12](figures/solutions-p12-fig13.png)

&emsp;&emsp;&emsp;**Solution:** Inserting 15∗causes the right-most leaf node to split. And as the root level<br>
&emsp;&emsp;&emsp;node still have space, it should not cause recursive splits.


### Question 4 continues...


---

<a id="page-13"></a>
**Page 13**

15-445/645 (Spring 2024)   Homework #2   Page 13 of 16

&emsp;(c) **\[5 points\]** Starting with the tree that results from **(b)**, insert 16∗and then insert 17∗.<br>
&emsp;&emsp;&emsp;Select the resulting tree (the result after inserting 17∗).<br>
&emsp;&emsp;&emsp;☐  A)


![Figure on page 13](figures/solutions-p13-fig14.png)

&emsp;&emsp;&emsp;☐  B)


![Figure on page 13](figures/solutions-p13-fig15.png)

&emsp;&emsp;&emsp;☐  C)


![Figure on page 13](figures/solutions-p13-fig16.png)

&emsp;&emsp;&emsp;☒ **D)**


![Figure on page 13](figures/solutions-p13-fig17.png)

&emsp;&emsp;&emsp;**Solution:** Inserting 16∗fills in the remaining space of the right-most leaf node. After<br>
&emsp;&emsp;&emsp;inserting 16∗, inserting 17∗causes the right-most leaf node to split and as the root-level<br>
&emsp;&emsp;&emsp;node is full, it causes recursive splits.


### Question 4 continues...


---

<a id="page-14"></a>
**Page 14**

15-445/645 (Spring 2024)   Homework #2   Page 14 of 16

&emsp;(d) **\[5 points\]** Starting with the tree that results from **(c)**, deletes 5∗. Select the resulting<br>
&emsp;&emsp;&emsp;tree.<br>
&emsp;&emsp;&emsp;☐  A)


![Figure on page 14](figures/solutions-p14-fig18.png)

&emsp;&emsp;&emsp;☐  B)


![Figure on page 14](figures/solutions-p14-fig19.png)

&emsp;&emsp;&emsp;☒ **C)**


![Figure on page 14](figures/solutions-p14-fig20.png)

&emsp;&emsp;&emsp;☐  D)


![Figure on page 14](figures/solutions-p14-fig21.png)

&emsp;&emsp;&emsp;**Solution:** Deleting 5∗causes the left-most leaf node underflow and merging of the first<br>
&emsp;&emsp;&emsp;two leaf nodes. After merging, the number of pointers in the left internal node is less<br>
&emsp;&emsp;&emsp;than 2. It causes recursive merging then.


### Question 4 continues...


---

<a id="page-15"></a>
**Page 15**

15-445/645 (Spring 2024)   Homework #2   Page 15 of 16


![Figure on page 15](figures/solutions-p15-fig22.png)

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
&emsp;&emsp;&emsp;&emsp;☒ **Key order property**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  Half-full property   ☐  Balance property<br>
&emsp;&emsp;&emsp;&emsp;☐  Separator keys   ☐  None<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** Keys should be in the order of 17, 18, 21.<br>
&emsp;&emsp;&emsp;ii. **\[2 points\]** Which properties are violated by **LeafB**?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **Half-full property**<br>
&emsp;&emsp;&emsp;&emsp;☐  Key order property   ☐  Balance property<br>
&emsp;&emsp;&emsp;&emsp;☐  Separator keys   ☐  None<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** There must be at least 2 keys.<br>
&emsp;&emsp;&emsp;iii. **\[2 points\]** Which properties are violated by **Internal Node**?<br>
&emsp;&emsp;&emsp;&emsp;☐  Key order property   ☐  Half-full property   ☐  Balance property<br>
&emsp;&emsp;&emsp;&emsp;☒ **Separator keys**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  None


### Question 4 continues...


---

<a id="page-16"></a>
**Page 16**

15-445/645 (Spring 2024)   Homework #2   Page 16 of 16

&emsp;&emsp;&emsp;&emsp;**Solution:** The node’s middle child contains 21. According to the node’s separa-<br>
&emsp;&emsp;&emsp;&emsp;tor keys, the middle child can only contain values between 15 (inclusive) and 20<br>
&emsp;&emsp;&emsp;&emsp;(exclusive).<br>
&emsp;&emsp;&emsp;iv. **\[2 points\]** Which properties are violated by **Root**?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **Balance property**<br>
&emsp;&emsp;&emsp;&emsp;☐  Key order property   ☐  Half-full property<br>
&emsp;&emsp;&emsp;&emsp;☒ **Separator keys**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  None<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** The root is imbalanced, as it has both Leaf Node and Internal Node as<br>
&emsp;&emsp;&emsp;&emsp;its children. The root’s subtree containing the second Leaf Node contains the value<br>
&emsp;&emsp;&emsp;&emsp;8,9,10, violating the root’s separator keys.<br>
&emsp;(f)i. **\[2 points\]** A read-only thread needs to hold at most one latches at the same time.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** A reader needs a latch on the parent and child (or two siblings in a leaf<br>
&emsp;&emsp;&emsp;&emsp;node scan) at most.<br>
&emsp;&emsp;&emsp;ii. **\[2 points\]** A write thread needs to hold at most two write latches at the same time<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** A thread may need to hold an arbitrarily large number of write latches,<br>
&emsp;&emsp;&emsp;&emsp;for every node from the root to a leaf (plus potentially siblings of nodes along the<br>
&emsp;&emsp;&emsp;&emsp;path), in circumstances where the write might cause a rebalancing of the root<br>
&emsp;&emsp;&emsp;iii. **\[2 points\]** A write thread must release its latches in the order they were acquired<br>
&emsp;&emsp;&emsp;&emsp;(i.e., FIFO) to prevent concurrency errors.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** Threads can release latches in any order, although FIFO is best for per-<br>
&emsp;&emsp;&emsp;&emsp;formance.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;End of Homework #2

