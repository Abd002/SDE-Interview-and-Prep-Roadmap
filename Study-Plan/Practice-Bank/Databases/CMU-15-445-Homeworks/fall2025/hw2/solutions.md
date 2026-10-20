# CMU 15-445 Fall 2025: Homework 2: Official solutions

> ⚠️ Study plan: don't open these solutions before **step 26** (self-grade).

> Copied from the original: <https://15445.courses.cs.cmu.edu/fall2025/assignments.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CARNEGIE MELLON UNIVERSITY<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;COMPUTER SCIENCE DEPARTMENT<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;15-445/645 – DATABASE SYSTEMS (FALL 2025)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;PROF. ANDY PAVLO

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #2 (by Will) – Solutions<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Due: **Sunday Sept 21, 2025 @ 11:59pm**

**IMPORTANT:**<br>
&emsp;• Enter all of your answers into **Gradescope by 11:59pm on Sunday Sept 21, 2025.**<br>
&emsp;• **Plagiarism**: Homework may be discussed with other students, but all homework is to be<br>
&emsp;&emsp;completed **individually**.<br>
For your information:<br>
&emsp;• Graded out of **100** points; **3** questions total<br>
&emsp;• Rough time estimate: ≈4-6 hours (1-1.5 hours for each question)<br>
&emsp;• Each part is all or nothing. There is no partial credit.<br>
&emsp;Revision : 2025/09/26 19:30

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Question   Points   Score<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Slotted Pages and Log-Structured   30<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Storage Models   35<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Database Compression   35<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Total:   100

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1


---

<a id="page-2"></a>
**Page 2**

15-445/645 (Fall 2025)   Homework #2   Page 2 of 7


### **Question 1: Slotted Pages and Log-Structured . . . . . . . . . . . . . . . . . \[30 points\]**

&emsp;**Graded by:**<br>
&emsp;(a) **\[10 points\]** Which problems are associated with the log-structured storage in a database<br>
&emsp;&emsp;&emsp;system? Select all that apply.<br>
&emsp;&emsp;&emsp;☒ **Write Amplification**<br>
&emsp;&emsp;&emsp;☐  Increased Random Writes<br>
&emsp;&emsp;&emsp;☐  Increased Random Reads<br>
&emsp;&emsp;&emsp;☐  Fragmentation<br>
&emsp;&emsp;&emsp;☐  None of the above<br>
&emsp;&emsp;&emsp;**Solution:** Log-structure storage is particularly beneficial for write-intensive workloads,<br>
&emsp;&emsp;&emsp;such as append-only data. But it incurs write amplification due to compaction.<br>
&emsp;&emsp;&emsp;Although a log-structured DBMS may have to read multiple pages to find a tuple, these<br>
&emsp;&emsp;&emsp;will be sequential I/Os and not random reads.

&emsp;(b) **\[10 points\]** Which problems are associated with the slotted-page storage in a database<br>
&emsp;&emsp;&emsp;system? Select all that apply.<br>
&emsp;&emsp;&emsp;☐  Write Amplification<br>
&emsp;&emsp;&emsp;☒ **Increased Random Reads**<br>
&emsp;&emsp;&emsp;☒ **Increased Random Writes**<br>
&emsp;&emsp;&emsp;☒ **Fragmentation**<br>
&emsp;&emsp;&emsp;☐  None of the above<br>
&emsp;&emsp;&emsp;**Solution:** The Slotted-Page Design often leads to fragmentation, as deletion of tuples<br>
&emsp;&emsp;&emsp;can leave gaps in the pages, making them not fully utilized.<br>
&emsp;&emsp;&emsp;Since tuples can be stored across separate pages, it may increase the amount of random<br>
&emsp;&emsp;&emsp;I/O that the DBMS has to incur when both reading data and when writing out dirty<br>
&emsp;&emsp;&emsp;pages.

&emsp;(c) **\[10 points\]** You are asked to compare log-structured storage to slotted-page storage for<br>
&emsp;&emsp;&emsp;a new system. Ignore any indexes and overhead from metadata. Select all true statements.<br>
&emsp;&emsp;&emsp;☒ **Both support variable length tuples.**<br>
&emsp;&emsp;&emsp;☐  Log-structured storage requires less disk space.<br>
&emsp;&emsp;&emsp;☒ **For an append-only workload, both achieve comparable performance.**<br>
&emsp;&emsp;&emsp;☐  Slotted-page requires storing schema metadata with the tuple.<br>
&emsp;&emsp;&emsp;☐  After lots of insert/update/deletes, only log-structured benefits from maintenance.<br>
&emsp;&emsp;&emsp;☐  None of the above are true.<br>
&emsp;&emsp;&emsp;**Solution:** In absence of indexes + metadata, then slotted-page for append-only work-<br>
&emsp;&emsp;&emsp;load becomes the log-structured storage architecture.<br>
&emsp;&emsp;&emsp;After lots of inserts/updates/deletes, slotted-page may also benefit from maintenance to<br>
&emsp;&emsp;&emsp;reclaim any empty space or compact partially empty pages.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #2 continues...


---

<a id="page-3"></a>
**Page 3**

15-445/645 (Fall 2025)   Homework #2   Page 3 of 7


### **Question 2: Storage Models . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . \[35 points\]**

&emsp;**Graded by:**<br>
&emsp;Consider a database with a single table `P(player` `id,team` `id,G` `all,HR`), where `player` `id`<br>
&emsp;is the primary key, and all attributes are the same fixed width. Suppose `P` has 20,000 tuples<br>
&emsp;that fit into 200 pages. You should ignore any additional storage overhead for the table (e.g.,<br>
&emsp;page headers, tuple headers). Additionally, you should make the following assumptions:<br>
&emsp;&emsp;• The DBMS does not have any additional meta-data.<br>
&emsp;&emsp;• `P` does not have any indexes (including for primary key `player` `id`).<br>
&emsp;&emsp;• None of `P`’s pages are already in memory. The DBMS can store an infinite number of<br>
&emsp;&emsp;&emsp;pages in memory.<br>
&emsp;&emsp;• Content-wise, the tuples of `P` will always make each query run the longest possible and<br>
&emsp;&emsp;&emsp;do the most page accesses.<br>
&emsp;&emsp;• The tuples of `P` can be in any order ( keep this in mind when computing minimum versus<br>
&emsp;&emsp;&emsp;maximum number of pages that the DBMS will potentially have to read and think of all<br>
&emsp;&emsp;&emsp;possible orderings)

&emsp;(a) Consider the following query:


![Figure on page 3](figures/solutions-p03-fig01.png)

&emsp;&emsp;&emsp;i. **\[5 points\]** Suppose the DBMS uses the N-ary storage model (NSM). How many<br>
&emsp;&emsp;&emsp;&emsp;pages will the DBMS potentially have to read from disk to answer this query?<br>
&emsp;&emsp;&emsp;&emsp;Be sure to keep in mind the assumption about the contents of `P`.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **151-200**<br>
&emsp;&emsp;&emsp;&emsp;☐  1-50   ☐  51-100   ☐  101-150   ☐  ≥201   ☐  Not possible to<br>
&emsp;&emsp;&emsp;&emsp;determine

&emsp;&emsp;&emsp;&emsp;**Solution:** 200 pages. To find `HR` and `team` `id` for all tuples, all pages must be<br>
&emsp;&emsp;&emsp;&emsp;accessed.<br>
&emsp;&emsp;&emsp;ii. **\[5 points\]** Suppose the DBMS uses the decomposition storage model (DSM) with<br>
&emsp;&emsp;&emsp;&emsp;implicit offsets. How many pages will the DBMS potentially have to read from disk<br>
&emsp;&emsp;&emsp;&emsp;to answer this query?<br>
&emsp;&emsp;&emsp;&emsp;Be sure to keep in mind the assumption about the contents of `P`.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **51-100**<br>
&emsp;&emsp;&emsp;&emsp;☐  1-50   ☐  101-150   ☐  151-200   ☐  ≥201   ☐  Not possible to<br>
&emsp;&emsp;&emsp;&emsp;determine

&emsp;&emsp;&emsp;&emsp;**Solution:** 100 pages. There are 50 pages per attribute. 50 pages to find `team` `id`<br>
&emsp;&emsp;&emsp;&emsp;for all tuples. In the worst-case scenario for `P`’s content, `HR` for all tuples must be<br>
&emsp;&emsp;&emsp;&emsp;accessed as well. Hence, another 50 pages must be read.


### Question 2 continues...


---

<a id="page-4"></a>
**Page 4**

15-445/645 (Fall 2025)   Homework #2   Page 4 of 7

&emsp;(b) Now consider the following query:


![Figure on page 4](figures/solutions-p04-fig02.png)

&emsp;&emsp;&emsp;i. Suppose the DBMS uses the N-ary storage model (NSM).<br>
&emsp;&emsp;&emsp;&emsp;α) **\[5 points\]** What is the minimum number of pages that the DBMS will poten-<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;tially have to read from disk to answer this query?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **1**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  2-3   ☐  4-6   ☐  7-9   ☐  10-100   ☐  101-200   ☐  ≥201<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  Not possible to determine

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Solution:** We find the tuples of all two primary keys on the first page. No need<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;to look in other pages since all attributes are stored together.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;β) **\[5 points\]** What is the maximum number of pages that the DBMS will poten-<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;tially have to read from disk to answer this query?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **101-200**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  1   ☐  2-3   ☐  4-6   ☐  7-9   ☐  10-100   ☐  ≥201<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  Not possible to determine

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Solution:** 200 pages. At least one tuple with matching primary key is located<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;on the last page. We must thus scan through every page.<br>
&emsp;&emsp;&emsp;ii. Suppose the DBMS uses the decomposition storage model (DSM) with implicit off-<br>
&emsp;&emsp;&emsp;&emsp;sets.<br>
&emsp;&emsp;&emsp;&emsp;α) **\[5 points\]** What is the minimum number of pages that the DBMS will poten-<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;tially have to read from disk to answer this query?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **1-3**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  4-6   ☐  7-9   ☐  10-100   ☐  101-200   ☐  ≥201   ☐  Not<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;possible to determine

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Solution:** 3 pages. Suppose all two primary keys appear on the first page.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Since all attributes are of the same fixed width, each attribute of `player` `id=1`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;and `player` `id=999` will also appear on the same page. We’ll thus need to read<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1 page to find both primary keys and read 2 pages to access `HR` and `team` `id` at<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;their corresponding offsets.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;β) **\[5 points\]** What is the maximum number of pages that the DBMS will poten-<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;tially have to read from disk to answer this query?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **41-60**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  1-20   ☐  21-40   ☐  61-80   ☐  81-100   ☐  ≥101<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  Not possible to determine

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Solution:** 54 pages. There are 50 pages per attribute. In the worst case, we<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;scan through all 50 pages to find both primary keys. In the worst case, the<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;primary keys will be located on different pages. Since all attributes are of the<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;same fixed width, each attribute of `player` `id=1` and `player` `id=999` will also


### Question 2 continues...


---

<a id="page-5"></a>
**Page 5**

15-445/645 (Fall 2025)   Homework #2   Page 5 of 7

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;appear on different pages. Hence we must read 2 pages to access each attribute<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;at their corresponding offsets. Thus, we read 4 pages in total to access `team` `id`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;and `HR`.<br>
&emsp;(c) Finally consider the following query:


![Figure on page 5](figures/solutions-p05-fig03.png)

&emsp;&emsp;&emsp;Suppose the DBMS uses the decomposition storage model (DSM) with implicit offsets.<br>
&emsp;&emsp;&emsp;i. **\[5 points\]** What is the minimum number of pages that the DBMS will potentially<br>
&emsp;&emsp;&emsp;&emsp;have to **read from disk** to answer this query?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **51-100**<br>
&emsp;&emsp;&emsp;&emsp;☐  1-50   ☐  101-150   ☐  151-200   ☐  ≥201   ☐  Not possible to<br>
&emsp;&emsp;&emsp;&emsp;determine

&emsp;&emsp;&emsp;&emsp;**Solution:** 100 pages. 50 pages for the inner select, and 50 pages to get the `player` `id`<br>
&emsp;&emsp;&emsp;&emsp;since the buffer pool will have the `HR` pages from the inner select. Remember<br>
&emsp;&emsp;&emsp;&emsp;content-wise the tuples make the queries always run for the longest time, you can<br>
&emsp;&emsp;&emsp;&emsp;only consider different orderings of the tuples.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #2 continues...


---

<a id="page-6"></a>
**Page 6**

15-445/645 (Fall 2025)   Homework #2   Page 6 of 7


### **Question 3: Database Compression. . . . . . . . . . . . . . . . . . . . . . . . . . . .\[35 points\]**

&emsp;**Graded by:**<br>
&emsp;(a) **\[5 points\]** Suppose that the DBMS has a `VARCHAR` column storing the following values:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`[Milwaukee` `Braves,` `Baltimore` `Orioles,` `Buffalo` `Blues,`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`Brooklyn` `Gladiators,` `Chicago` `Cubs]`<br>
&emsp;&emsp;&emsp;Which of the following are valid encodings (`uint32`) for this column under dictionary<br>
&emsp;&emsp;&emsp;compression as discussed in lecture that will support both point queries and range queries?<br>
&emsp;&emsp;&emsp;Select **all** the valid encodings.<br>
&emsp;&emsp;&emsp;☐  `[1,2,3,4,5]`<br>
&emsp;&emsp;&emsp;☒ `[4,0,2,1,3]`<br>
&emsp;&emsp;&emsp;☐  `[79,12,32,33,31]`<br>
&emsp;&emsp;&emsp;☐  `[50,40,20,10,30]`<br>
&emsp;&emsp;&emsp;☐  `[79,12,33,15,32]`<br>
&emsp;&emsp;&emsp;☒ `[49,9,29,19,39]`

&emsp;&emsp;&emsp;**Solution:** To support range queries, the DBMS must use an order-preserving encoding<br>
&emsp;&emsp;&emsp;scheme. The values of the dictionary codes do not matter as long as they preserve the<br>
&emsp;&emsp;&emsp;same ordering of the original data.

&emsp;(b) **\[15 points\]** Suppose the DBMS wants to compresses a table `R(a)` using columnar com-<br>
&emsp;&emsp;&emsp;pression. Which of the following compression schemes **will benefit** (when considering<br>
&emsp;&emsp;&emsp;space efficiency) from sorting the table before compressing column `a`? Select **all** that<br>
&emsp;&emsp;&emsp;apply.<br>
&emsp;&emsp;&emsp;Hint: “Benefit” means that the efficacy of the compression scheme improves on sorted<br>
&emsp;&emsp;&emsp;data. You should not make any assumptions about the column type or its distribution of<br>
&emsp;&emsp;&emsp;values.<br>
&emsp;&emsp;&emsp;☐  Bit-packing Encoding<br>
&emsp;&emsp;&emsp;☒ **Run-length Encoding**<br>
&emsp;&emsp;&emsp;☐  Mostly Encoding<br>
&emsp;&emsp;&emsp;☐  Bitmap Encoding<br>
&emsp;&emsp;&emsp;☐  Dictionary Encoding<br>
&emsp;&emsp;&emsp;☒ **Delta Encoding**<br>
&emsp;&emsp;&emsp;☐  None of the above will benefit.<br>
&emsp;&emsp;&emsp;**Solution:** Sorting only benefits Run-length encoding and Delta encoding for the below<br>
&emsp;&emsp;&emsp;reasons. All other encodings do not benefit from sorting the table first.<br>
&emsp;&emsp;&emsp;&emsp;• **Run-length Encoding:** Sorting improves the potential compression ratio for RLE<br>
&emsp;&emsp;&emsp;&emsp;&emsp;because there could potentially be more consecutive values in a column.<br>
&emsp;&emsp;&emsp;&emsp;• **Delta Encoding:** For numeric data types with a small range of values, the differ-<br>
&emsp;&emsp;&emsp;&emsp;&emsp;ence between consecutive values in the column after sorting could be smaller than<br>
&emsp;&emsp;&emsp;&emsp;&emsp;the original value. Therefore, the compression ratio could improve.


### Question 3 continues...


---

<a id="page-7"></a>
**Page 7**

15-445/645 (Fall 2025)   Homework #2   Page 7 of 7

&emsp;(c) **\[15 points\]** A colleague approaches with a list of true and false statements about run-<br>
&emsp;&emsp;&emsp;length encoding, delta encoding, bitmap encoding, and dictionary encoding. The col-<br>
&emsp;&emsp;&emsp;league wants your assistance in identifying the true statements. Select **all** that apply.<br>
&emsp;&emsp;&emsp;☐  Delta Encoding is good at compressing large text values.<br>
&emsp;&emsp;&emsp;☐  Inserts and updates on high cardinality columns with bitmap encoding has no over-<br>
&emsp;&emsp;&emsp;head.<br>
&emsp;&emsp;&emsp;☐  For point lookup-only workload, order-preserving dictionary encoding is required.<br>
&emsp;&emsp;&emsp;☐  For a heavy update workload, dictionary encoding and delta encoding always require<br>
&emsp;&emsp;&emsp;re-encoding.<br>
&emsp;&emsp;&emsp;☒ **Run-length Encoding is effective for compressing low cardinality integer column.**<br>
&emsp;&emsp;&emsp;☐  None of the above.<br>
&emsp;&emsp;&emsp;**Solution:**

&emsp;&emsp;&emsp;&emsp;• Delta Encoding is good at compressing large text values: **F**. Large text values<br>
&emsp;&emsp;&emsp;&emsp;&emsp;in theory have large differences; hence delta encoding may not be an effective<br>
&emsp;&emsp;&emsp;&emsp;&emsp;choice.<br>
&emsp;&emsp;&emsp;&emsp;• Inserts and updates on high cardinality columns with bitmap encoding has no over-<br>
&emsp;&emsp;&emsp;&emsp;&emsp;head: **F**. On high cardinality columns with bitmap encoding, each insert/update<br>
&emsp;&emsp;&emsp;&emsp;&emsp;would need to edit all the bitmaps which would generate extra writes.<br>
&emsp;&emsp;&emsp;&emsp;• For point lookup-only workload, order-preserving dictionary encoding is required:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**F**. Since we are only looking up an exact value, we only require the dictionary’s<br>
&emsp;&emsp;&emsp;&emsp;&emsp;hash properties.<br>
&emsp;&emsp;&emsp;&emsp;• For a heavy update workload, dictionary encoding and delta encoding always re-<br>
&emsp;&emsp;&emsp;&emsp;&emsp;quire re-encoding: **F**. If update values are already in the dictionary, no re-encoding<br>
&emsp;&emsp;&emsp;&emsp;&emsp;is needed.<br>
&emsp;&emsp;&emsp;&emsp;• Run-length Encoding is effective for compressing low cardinality integer column:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**T**.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;End of Homework #2

