# CMU 15-445 Spring 2025: Homework 2: Questions

> Copied from the original: <https://15445.courses.cs.cmu.edu/spring2025/assignments.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CARNEGIE MELLON UNIVERSITY<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;COMPUTER SCIENCE DEPARTMENT<br>
&emsp;&emsp;&emsp;&emsp;&emsp;15-445/645 – DATABASE SYSTEMS (SPRING 2025)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;PROF. JIGNESH PATEL

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #2 (by Joe & Aditya)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Due: **Sunday Feb 09, 2025 @ 11:59pm**

**IMPORTANT:**<br>
&emsp;• Enter all of your answers into **Gradescope by 11:59pm on Sunday Feb 09, 2025.**<br>
&emsp;• **Plagiarism**: Homework may be discussed with other students, but all homework is to be<br>
&emsp;&emsp;completed **individually**.<br>
For your information:<br>
&emsp;• Graded out of **100** points; **3** questions total<br>
&emsp;• Rough time estimate: ≈4-6 hours (1-1.5 hours for each question)<br>
&emsp;Revision : 2025/01/30 12:57

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Question   Points   Score<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Slotted Pages and Log-Structured   30<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Storage Models   35<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Database Compression   35<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Total:   100

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1


---

<a id="page-2"></a>
**Page 2**

15-445/645 (Spring 2025)   Homework #2   Page 2 of 5


### **Question 1: Slotted Pages and Log-Structured . . . . . . . . . . . . . . . . . \[30 points\]**

&emsp;(a) **\[10 points\]** Which problems are associated with the slotted-page storage in a database<br>
&emsp;&emsp;&emsp;system? Select all that apply.<br>
&emsp;&emsp;&emsp;☐  Increased Random Writes<br>
&emsp;&emsp;&emsp;☐  Write Amplification<br>
&emsp;&emsp;&emsp;☐  Fragmentation<br>
&emsp;&emsp;&emsp;☐  Increased Random Reads<br>
&emsp;&emsp;&emsp;☐  None of the above

&emsp;(b) **\[10 points\]** Which problems are associated with the log-structured storage in a database<br>
&emsp;&emsp;&emsp;system? Select all that apply.<br>
&emsp;&emsp;&emsp;☐  Write Amplification<br>
&emsp;&emsp;&emsp;☐  Increased Random Writes<br>
&emsp;&emsp;&emsp;☐  Increased Random Reads<br>
&emsp;&emsp;&emsp;☐  Fragmentation<br>
&emsp;&emsp;&emsp;☐  None of the above

&emsp;(c) **\[10 points\]** You are asked to compare log-structured storage to slotted-page storage for<br>
&emsp;&emsp;&emsp;a new system. Ignore any indexes and overhead from metadata. Select all true statements.<br>
&emsp;&emsp;&emsp;☐  Log-structured storage requires less disk space.<br>
&emsp;&emsp;&emsp;☐  Only log-structured storage supports variable length tuples.<br>
&emsp;&emsp;&emsp;☐  For an append-only workload, both achieve comparable performance.<br>
&emsp;&emsp;&emsp;☐  After lots of insert/update/deletes, only log-structured benefits from maintenance.<br>
&emsp;&emsp;&emsp;☐  Log-structured storage is not suitable for systems with limited memory.<br>
&emsp;&emsp;&emsp;☐  None of the above are true.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #2 continues...


---

<a id="page-3"></a>
**Page 3**

15-445/645 (Spring 2025)   Homework #2   Page 3 of 5


### **Question 2: Storage Models . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . \[35 points\]**

&emsp;Consider a database with a single table `E(player` `id,games` `played,room` `id,total` `points`),<br>
&emsp;where `player` `id` is the primary key, and all attributes are the same fixed width. Suppose `E`<br>
&emsp;has 20,000 tuples that fit into 100 pages. You should ignore any additional storage overhead<br>
&emsp;for the table (e.g., page headers, tuple headers). Additionally, you should make the following<br>
&emsp;assumptions:<br>
&emsp;&emsp;• The DBMS does not have any additional meta-data.<br>
&emsp;&emsp;• `E` does not have any indexes (including for primary key `player` `id`).<br>
&emsp;&emsp;• None of `E`’s pages are already in memory. The DBMS can store an infinite number of<br>
&emsp;&emsp;&emsp;pages in memory.<br>
&emsp;&emsp;• Content-wise, the tuples of `E` will always make each query run the longest possible and<br>
&emsp;&emsp;&emsp;do the most page accesses.<br>
&emsp;&emsp;• The tuples of `E` can be in any order ( keep this in mind when computing minimum versus<br>
&emsp;&emsp;&emsp;maximum number of pages that the DBMS will potentially have to read and think of all<br>
&emsp;&emsp;&emsp;possible orderings)

&emsp;(a) Consider the following query:


![Figure on page 3](figures/questions-p03-fig01.png)

&emsp;&emsp;&emsp;i. **\[5 points\]** Suppose the DBMS uses the decomposition storage model (DSM) with<br>
&emsp;&emsp;&emsp;&emsp;implicit offsets. How many pages will the DBMS potentially have to read from disk<br>
&emsp;&emsp;&emsp;&emsp;to answer this query?<br>
&emsp;&emsp;&emsp;&emsp;Be sure to keep in mind the assumption about the contents of `E`.<br>
&emsp;&emsp;&emsp;&emsp;☐  1-25   ☐  26-50   ☐  51-75   ☐  76-100   ☐  ≥101   ☐  Not possible to<br>
&emsp;&emsp;&emsp;&emsp;determine

&emsp;&emsp;&emsp;ii. **\[5 points\]** Suppose the DBMS uses the N-ary storage model (NSM). How many<br>
&emsp;&emsp;&emsp;&emsp;pages will the DBMS potentially have to read from disk to answer this query?<br>
&emsp;&emsp;&emsp;&emsp;Be sure to keep in mind the assumption about the contents of `E`.<br>
&emsp;&emsp;&emsp;&emsp;☐  1-40   ☐  41-60   ☐  61-80   ☐  81-100   ☐  ≥101   ☐  Not possible to<br>
&emsp;&emsp;&emsp;&emsp;determine


### Question 2 continues...


---

<a id="page-4"></a>
**Page 4**

15-445/645 (Spring 2025)   Homework #2   Page 4 of 5

&emsp;(b) Now consider the following query:


![Figure on page 4](figures/questions-p04-fig02.png)

&emsp;&emsp;&emsp;i. Suppose the DBMS uses the decomposition storage model (DSM) with implicit off-<br>
&emsp;&emsp;&emsp;&emsp;sets.<br>
&emsp;&emsp;&emsp;&emsp;α) **\[5 points\]** What is the minimum number of pages that the DBMS will poten-<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;tially have to read from disk to answer this query?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  1-3   ☐  4-6   ☐  7-9   ☐  10-100   ☐  ≥101   ☐  Not possible to<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;determine

&emsp;&emsp;&emsp;&emsp;&emsp;β) **\[5 points\]** What is the maximum number of pages that the DBMS will poten-<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;tially have to read from disk to answer this query?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  1-20   ☐  21-40   ☐  41-60   ☐  61-80   ☐  81-100   ☐  ≥101<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  Not possible to determine

&emsp;&emsp;&emsp;ii. Suppose the DBMS uses the N-ary storage model (NSM).<br>
&emsp;&emsp;&emsp;&emsp;α) **\[5 points\]** What is the minimum number of pages that the DBMS will poten-<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;tially have to read from disk to answer this query?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  1   ☐  2-3   ☐  4-6   ☐  7-9   ☐  10-100   ☐  ≥101   ☐  Not possible<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;to determine

&emsp;&emsp;&emsp;&emsp;&emsp;β) **\[5 points\]** What is the maximum number of pages that the DBMS will poten-<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;tially have to read from disk to answer this query?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  1   ☐  2-3   ☐  4-6   ☐  7-9   ☐  10-100   ☐  ≥101   ☐  Not possible<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;to determine

&emsp;(c) Finally consider the following query:


![Figure on page 4](figures/questions-p04-fig03.png)

&emsp;&emsp;&emsp;Suppose the DBMS uses the decomposition storage model (DSM) with implicit offsets.<br>
&emsp;&emsp;&emsp;i. **\[5 points\]** What is the minimum number of pages that the DBMS will potentially<br>
&emsp;&emsp;&emsp;&emsp;have to **read from disk** to answer this query?<br>
&emsp;&emsp;&emsp;&emsp;☐  1-20   ☐  21-40   ☐  41-60   ☐  61-80   ☐  81-100   ☐  ≥101   ☐  Not<br>
&emsp;&emsp;&emsp;&emsp;possible to determine

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #2 continues...


---

<a id="page-5"></a>
**Page 5**

15-445/645 (Spring 2025)   Homework #2   Page 5 of 5


### **Question 3: Database Compression. . . . . . . . . . . . . . . . . . . . . . . . . . . .\[35 points\]**

&emsp;(a) **\[5 points\]** Suppose that the DBMS has a `VARCHAR` column storing the following values:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`[Woody,`   `Buzz`   `Lightyear,`   `Mike`   `Wazowski,`   `Lightning`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`McQueen,` `Lightning` `Storm]`<br>
&emsp;&emsp;&emsp;Which of the following are valid encodings (`uint32`) for this column under dictionary<br>
&emsp;&emsp;&emsp;compression as discussed in lecture that will support both point queries and range queries?<br>
&emsp;&emsp;&emsp;Select **all** the valid encodings.<br>
&emsp;&emsp;&emsp;☐  `[5,1,4,2,3]`<br>
&emsp;&emsp;&emsp;☐  `[79,12,32,15,33]`<br>
&emsp;&emsp;&emsp;☐  `[79,12,33,15,32]`<br>
&emsp;&emsp;&emsp;☐  `[50,10,40,20,30]`<br>
&emsp;&emsp;&emsp;☐  `[10,20,30,40,50]`

&emsp;(b) **\[15 points\]** Suppose the DBMS wants to compresses a table `R(a)` using columnar com-<br>
&emsp;&emsp;&emsp;pression. Which of the following compression schemes **will not benefit** from sorting the<br>
&emsp;&emsp;&emsp;table before compressing column `a`? Select **all** that apply.<br>
&emsp;&emsp;&emsp;Hint: “Benefit” means that the efficacy of the compression scheme improves on sorted<br>
&emsp;&emsp;&emsp;data. You should not make any assumptions about the column type or its distribution of<br>
&emsp;&emsp;&emsp;values.<br>
&emsp;&emsp;&emsp;☐  Run-length Encoding<br>
&emsp;&emsp;&emsp;☐  Bit-packing Encoding<br>
&emsp;&emsp;&emsp;☐  Mostly Encoding<br>
&emsp;&emsp;&emsp;☐  Bitmap Encoding<br>
&emsp;&emsp;&emsp;☐  Delta Encoding<br>
&emsp;&emsp;&emsp;☐  Dictionary Encoding<br>
&emsp;&emsp;&emsp;☐  All of the above will not benefit.

&emsp;(c) **\[15 points\]** A colleague approaches with a list of true and false statements about run-<br>
&emsp;&emsp;&emsp;length encoding, delta encoding, bitmap encoding, and dictionary encoding. The col-<br>
&emsp;&emsp;&emsp;league wants your assistance in identifying the true statements. Select **all** that apply.<br>
&emsp;&emsp;&emsp;☐  Run-length Encoding is effective for compressing any integer column.<br>
&emsp;&emsp;&emsp;☐  Bitmap Encoding on high cardinality columns hurts inserts and updates.<br>
&emsp;&emsp;&emsp;☐  Delta Encoding is good at compressing large text values.<br>
&emsp;&emsp;&emsp;☐  For point lookup-only workload, order-preserving dictionary encoding is unnecessary.<br>
&emsp;&emsp;&emsp;☐  For a heavy update workload, dictionary performs better than delta encoding.<br>
&emsp;&emsp;&emsp;☐  None of the above.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;End of Homework #2

