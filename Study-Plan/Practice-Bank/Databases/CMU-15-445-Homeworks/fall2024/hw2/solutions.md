# CMU 15-445 Fall 2024: Homework 2: Official solutions

> Copied from the original: <https://15445.courses.cs.cmu.edu/fall2024/assignments.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CARNEGIE MELLON UNIVERSITY<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;COMPUTER SCIENCE DEPARTMENT<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;15-445/645 – DATABASE SYSTEMS (FALL 2024)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;PROF. ANDY PAVLO

&emsp;&emsp;&emsp;&emsp;&emsp;Homework #2 (by William and Prashanth ) – Solutions<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Due: **Sunday September 22, 2024 @ 11:59pm**

**IMPORTANT:**<br>
&emsp;• Enter all of your answers into **Gradescope by 11:59pm on Sunday September 22, 2024.**<br>
&emsp;• **Plagiarism**: Homework may be discussed with other students, but all homework is to be<br>
&emsp;&emsp;completed **individually**.<br>
For your information:<br>
&emsp;• Graded out of **100** points; **3** questions total<br>
&emsp;• Rough time estimate: ≈4-6 hours (1-1.5 hours for each question)<br>
&emsp;Revision : 2024/09/28 15:29

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Question   Points   Score<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Slotted Pages and Log-Structured   30<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Storage Models   35<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Database Compression   35<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Total:   100

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1


---

<a id="page-2"></a>
**Page 2**

15-445/645 (Fall 2024)   Homework #2   Page 2 of 8


### **Question 1: Slotted Pages and Log-Structured . . . . . . . . . . . . . . . . . \[30 points\]**

&emsp;**Graded by:**<br>
&emsp;(a) **\[10 points\]** Which problems are associated with the slotted-page storage in a database<br>
&emsp;&emsp;&emsp;system? Select all that apply.<br>
&emsp;&emsp;&emsp;☒ **Fragmentation**<br>
&emsp;&emsp;&emsp;☐  Write Amplification<br>
&emsp;&emsp;&emsp;☒ **Increased Random Writes**<br>
&emsp;&emsp;&emsp;☒ **Increased Random Reads**<br>
&emsp;&emsp;&emsp;☐  None of the above<br>
&emsp;&emsp;&emsp;**Solution:** The Slotted-Page Design often leads to fragmentation, as deletion of tuples<br>
&emsp;&emsp;&emsp;can leave gaps in the pages, making them not fully utilized.<br>
&emsp;&emsp;&emsp;Since tuples can be stored across separate pages, it may increase the amount of random<br>
&emsp;&emsp;&emsp;I/O that the DBMS has to incur when both reading data and when writing out dirty<br>
&emsp;&emsp;&emsp;pages.

&emsp;(b) **\[10 points\]** Which problems are associated with the log-structured storage in a database<br>
&emsp;&emsp;&emsp;system? Select all that apply.<br>
&emsp;&emsp;&emsp;☐  Fragmentation<br>
&emsp;&emsp;&emsp;☒ **Write Amplification**<br>
&emsp;&emsp;&emsp;☐  Increased Random Writes<br>
&emsp;&emsp;&emsp;☐  Increased Random Reads<br>
&emsp;&emsp;&emsp;☐  None of the above<br>
&emsp;&emsp;&emsp;**Solution:** Log-structure storage is particularly beneficial for write-intensive workloads,<br>
&emsp;&emsp;&emsp;such as append-only data. But it incurs write amplification due to compaction.<br>
&emsp;&emsp;&emsp;Although a log-structured DBMS may have to read multiple pages to find a tuple, these<br>
&emsp;&emsp;&emsp;will be sequential I/Os and not random reads.

&emsp;(c) **\[10 points\]** You are asked to compare log-structured storage to slotted-page storage for<br>
&emsp;&emsp;&emsp;a new system. Ignore any indexes and overhead from metadata. Select all true statements.<br>
&emsp;&emsp;&emsp;☐  Log-structured storage requires less disk space.<br>
&emsp;&emsp;&emsp;☐  Only log-structured storage supports variable length tuples.<br>
&emsp;&emsp;&emsp;☒ **For an append-only workload, both achieve comparable performance.**<br>
&emsp;&emsp;&emsp;☐  After lots of insert/update/deletes, only log-structured benefits from maintenance.<br>
&emsp;&emsp;&emsp;☐  Log-structured storage is not suitable for systems with limited memory.<br>
&emsp;&emsp;&emsp;☐  None of the above are true.<br>
&emsp;&emsp;&emsp;**Solution:** In absence of indexes + metadata, then slotted-page for append-only work-<br>
&emsp;&emsp;&emsp;load becomes the log-structured storage architecture. Hence, this is the only correct<br>
&emsp;&emsp;&emsp;statement.<br>
&emsp;&emsp;&emsp;After lots of inserts/updates/deletes, slotted-page may also benefit from maintenance to<br>
&emsp;&emsp;&emsp;reclaim any empty space or compact partially empty pages.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #2 continues...


---

<a id="page-3"></a>
**Page 3**

15-445/645 (Fall 2024)   Homework #2   Page 3 of 8


### **Question 2: Storage Models . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . \[35 points\]**

&emsp;**Graded by:**<br>
&emsp;Consider a database with a single table `E(event` `id,event` `name,host` `id,duration`<br>
&emsp;`number` `of` `events)`, where `event` `id` is the primary key, and all attributes are the same fixed<br>
&emsp;width. Suppose `E` has 10,000 tuples that fit into 100 pages. You should ignore any additional<br>
&emsp;storage overhead for the table (e.g., page headers, tuple headers). Additionally, you should<br>
&emsp;make the following assumptions:<br>
&emsp;&emsp;• The DBMS does not have any additional meta-data.<br>
&emsp;&emsp;• `E` does not have any indexes (including for primary key `event` `id`).<br>
&emsp;&emsp;• None of `E`’s pages are already in memory. The DBMS can store an infinite number of<br>
&emsp;&emsp;&emsp;pages in memory.<br>
&emsp;&emsp;• Content-wise, the tuples of `E` will always make each query run the longest possible and<br>
&emsp;&emsp;&emsp;do the most page accesses.<br>
&emsp;&emsp;• The tuples of `E` can be in any order ( keep this in mind when computing minimum versus<br>
&emsp;&emsp;&emsp;maximum number of pages that the DBMS will potentially have to read and think of all<br>
&emsp;&emsp;&emsp;possible orderings)

&emsp;(a) Consider the following query:


![Figure on page 3](figures/solutions-p03-fig01.png)

&emsp;&emsp;&emsp;i. **\[5 points\]** Suppose the DBMS uses the decomposition storage model (DSM) with<br>
&emsp;&emsp;&emsp;&emsp;implicit offsets. How many pages will the DBMS potentially have to read from disk<br>
&emsp;&emsp;&emsp;&emsp;to answer this query?<br>
&emsp;&emsp;&emsp;&emsp;Be sure to keep in mind the assumption about the contents of `E`.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **41-60**<br>
&emsp;&emsp;&emsp;&emsp;☐  1-40   ☐  61-80   ☐  81-100   ☐  ≥101   ☐  Not possible to<br>
&emsp;&emsp;&emsp;&emsp;determine

&emsp;&emsp;&emsp;&emsp;**Solution:** 60 pages. There are 20 pages per attribute. 20 pages to find `duration`<br>
&emsp;&emsp;&emsp;&emsp;and another 20 to find `host` `id` for all tuples. In the worst-case scenario for `E`’s<br>
&emsp;&emsp;&emsp;&emsp;content, `number` `of` `events` for all tuples must be accessed as well. Hence, another<br>
&emsp;&emsp;&emsp;&emsp;20 pages must be read.<br>
&emsp;&emsp;&emsp;ii. **\[5 points\]** Suppose the DBMS uses the N-ary storage model (NSM). How many<br>
&emsp;&emsp;&emsp;&emsp;pages will the DBMS potentially have to read from disk to answer this query?<br>
&emsp;&emsp;&emsp;&emsp;Be sure to keep in mind the assumption about the contents of `E`.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **81-100**<br>
&emsp;&emsp;&emsp;&emsp;☐  1-40   ☐  41-60   ☐  61-80   ☐  ≥101   ☐  Not possible to<br>
&emsp;&emsp;&emsp;&emsp;determine


### Question 2 continues...


---

<a id="page-4"></a>
**Page 4**

15-445/645 (Fall 2024)   Homework #2   Page 4 of 8

&emsp;&emsp;&emsp;&emsp;**Solution:** 100 pages. To find `duration` and `host` `id` for all tuples, all pages must<br>
&emsp;&emsp;&emsp;&emsp;be accessed.


### Question 2 continues...


---

<a id="page-5"></a>
**Page 5**

15-445/645 (Fall 2024)   Homework #2   Page 5 of 8

&emsp;(b) Now consider the following query:


![Figure on page 5](figures/solutions-p05-fig02.png)

&emsp;&emsp;&emsp;i. Suppose the DBMS uses the decomposition storage model (DSM) with implicit off-<br>
&emsp;&emsp;&emsp;&emsp;sets.<br>
&emsp;&emsp;&emsp;&emsp;α) **\[5 points\]** What is the minimum number of pages that the DBMS will poten-<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;tially have to read from disk to answer this query?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **1-3**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  4-6   ☐  7-9   ☐  10-100   ☐  ≥101   ☐  Not possible to<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;determine

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Solution:** 3 pages. Suppose all two primary keys appear on the first page.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Since all attributes are of the same fixed width, each attribute of `event` `id=15445`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;and `event` `id=15645` will also appear on the same page. We’ll thus need to<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;read 1 page to find the two primary keys and read 2 pages to access `event` `name`,<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`host` `id` at their corresponding offsets.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;β) **\[5 points\]** What is the maximum number of pages that the DBMS will poten-<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;tially have to read from disk to answer this query?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **21-40**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  1-20   ☐  41-60   ☐  61-80   ☐  81-100   ☐  ≥101<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  Not possible to determine

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Solution:** 24 pages. There are 20 pages per attribute. In the worst case, we<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;scan through all 20 pages to find the two primary keys. In the worst case, the<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;two primary keys will be located on different pages. Since all attributes are of<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;the same fixed width, each attribute of `event` `id=15445` and `event` `id=15645`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;will also appear on different pages. Hence we must read 2 pages to access each<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;attribute at their corresponding offsets. Thus, we read 4 pages in total to access<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`event` `name`, `host` `id`.<br>
&emsp;&emsp;&emsp;ii. Suppose the DBMS uses the N-ary storage model (NSM).<br>
&emsp;&emsp;&emsp;&emsp;α) **\[5 points\]** What is the minimum number of pages that the DBMS will poten-<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;tially have to read from disk to answer this query?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **1**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  2-3   ☐  4-6   ☐  7-9   ☐  10-100   ☐  ≥101   ☐  Not possible<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;to determine

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Solution:** We find the tuples of all two primary keys on the first page. No need<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;to look in other pages since all attributes are stored together.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;β) **\[5 points\]** What is the maximum number of pages that the DBMS will poten-<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;tially have to read from disk to answer this query?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **10-100**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  1   ☐  2-3   ☐  4-6   ☐  7-9   ☐  ≥101   ☐  Not possible<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;to determine


### Question 2 continues...


---

<a id="page-6"></a>
**Page 6**

15-445/645 (Fall 2024)   Homework #2   Page 6 of 8

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Solution:** 100 pages. At least one tuple with matching primary key is located<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;on the last page. We must thus scan through every page.<br>
&emsp;(c) Finally consider the following query:


![Figure on page 6](figures/solutions-p06-fig03.png)

&emsp;&emsp;&emsp;Suppose the DBMS uses the decomposition storage model (DSM) with implicit offsets.<br>
&emsp;&emsp;&emsp;i. **\[5 points\]** What is the minimum number of pages that the DBMS will potentially<br>
&emsp;&emsp;&emsp;&emsp;have to **read from disk** to answer this query?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **21-40**<br>
&emsp;&emsp;&emsp;&emsp;☐  1-20   ☐  41-60   ☐  61-80   ☐  81-100   ☐  ≥101   ☐  Not<br>
&emsp;&emsp;&emsp;&emsp;possible to determine

&emsp;&emsp;&emsp;&emsp;**Solution:** 40 pages. 20 pages for the inner select, and 20 pages to get the `event` `id`<br>
&emsp;&emsp;&emsp;&emsp;since the buffer pool will have the `duration` pages from the inner select. Remember<br>
&emsp;&emsp;&emsp;&emsp;content-wise the tuples make the queries always run for the longest time, you can<br>
&emsp;&emsp;&emsp;&emsp;only consider different orderings of the tuples.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #2 continues...


---

<a id="page-7"></a>
**Page 7**

15-445/645 (Fall 2024)   Homework #2   Page 7 of 8


### **Question 3: Database Compression. . . . . . . . . . . . . . . . . . . . . . . . . . . .\[35 points\]**

&emsp;**Graded by:**<br>
&emsp;(a) **\[5 points\]** Suppose that the DBMS has a `VARCHAR` column storing the following values:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`[Museum` `of` `Art,` `Andy` `Warhol` `Museum,` `Museum` `of` `Natural`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`History,` `Children’s` `Museum,` `Solders` `&` `Sailors]`<br>
&emsp;&emsp;&emsp;Which of the following are valid encodings (`uint32`) for this column under dictionary<br>
&emsp;&emsp;&emsp;compression as discussed in lecture that will support both point queries and range queries?<br>
&emsp;&emsp;&emsp;Select **all** the valid encodings.<br>
&emsp;&emsp;&emsp;☒ `[3,1,4,2,5]`<br>
&emsp;&emsp;&emsp;☐  `[10,20,30,40,50]`<br>
&emsp;&emsp;&emsp;☐  `[31,15,92,32,196]`<br>
&emsp;&emsp;&emsp;☒ `[32,15,92,31,196]`<br>
&emsp;&emsp;&emsp;☒ `[30,10,40,20,50]`

&emsp;&emsp;&emsp;**Solution:** To support range queries, the DBMS must use an order-preserving encoding<br>
&emsp;&emsp;&emsp;scheme. The values of the dictionary codes do not matter as long as they preserve the<br>
&emsp;&emsp;&emsp;same ordering of the original data.

&emsp;(b) **\[15 points\]** Suppose the DBMS wants to compresses a table `R(a)` using columnar com-<br>
&emsp;&emsp;&emsp;pression. Which of the following compression schemes **will not benefit** from sorting the<br>
&emsp;&emsp;&emsp;table before compressing column `a`? Select **all** that apply.<br>
&emsp;&emsp;&emsp;Hint: “Benefit” means that the efficacy of the compression scheme improves on sorted<br>
&emsp;&emsp;&emsp;data. You should not make any assumptions about the column type or its distribution of<br>
&emsp;&emsp;&emsp;values.<br>
&emsp;&emsp;&emsp;☐  Run-length Encoding<br>
&emsp;&emsp;&emsp;☒ **Bit-packing Encoding**<br>
&emsp;&emsp;&emsp;☒ **Mostly Encoding**<br>
&emsp;&emsp;&emsp;☒ **Bitmap Encoding**<br>
&emsp;&emsp;&emsp;☐  Delta Encoding<br>
&emsp;&emsp;&emsp;☒ **Dictionary Encoding**<br>
&emsp;&emsp;&emsp;☐  All of the above will not benefit.<br>
&emsp;&emsp;&emsp;**Solution:** Sorting only benefits Run-length encoding and Delta encoding for the below<br>
&emsp;&emsp;&emsp;reasons. All other encodings do not benefit from sorting the table first.

&emsp;&emsp;&emsp;&emsp;• **Run-length Encoding:** Sorting improves the potential compression ratio for RLE<br>
&emsp;&emsp;&emsp;&emsp;&emsp;because there could potentially be more consecutive values in a column.<br>
&emsp;&emsp;&emsp;&emsp;• **Delta Encoding:** For numeric data types with a small range of values, the differ-<br>
&emsp;&emsp;&emsp;&emsp;&emsp;ence between consecutive values in the column after sorting could be smaller than<br>
&emsp;&emsp;&emsp;&emsp;&emsp;the original value. Therefore, the compression ratio could improve.


### Question 3 continues...


---

<a id="page-8"></a>
**Page 8**

15-445/645 (Fall 2024)   Homework #2   Page 8 of 8

&emsp;(c) **\[15 points\]** A colleague approaches with a list of true and false statements about run-<br>
&emsp;&emsp;&emsp;length encoding, delta encoding, bitmap encoding, and dictionary encoding. The col-<br>
&emsp;&emsp;&emsp;league wants your assistance in identifying the true statements. Select **all** that apply.<br>
&emsp;&emsp;&emsp;☐  Run-length Encoding is effective for compressing any integer column.<br>
&emsp;&emsp;&emsp;☒ **Bitmap Encoding on high cardinality columns hurts inserts and updates.**<br>
&emsp;&emsp;&emsp;☐  Delta Encoding is good at compressing large text values.<br>
&emsp;&emsp;&emsp;☒ **For point lookup-only workload, order-preserving dictionary encoding is unnec-**<br>
&emsp;&emsp;&emsp;**essary.**<br>
&emsp;&emsp;&emsp;☒ **For a heavy update workload, dictionary performs better than delta encoding.**<br>
&emsp;&emsp;&emsp;☐  None of the above.<br>
&emsp;&emsp;&emsp;**Solution:**

&emsp;&emsp;&emsp;&emsp;• Run-length Encoding is effective for compressing any integer column: **F**. Run-<br>
&emsp;&emsp;&emsp;&emsp;&emsp;length encoding is not effective for high cardinality values that vary significantly<br>
&emsp;&emsp;&emsp;&emsp;&emsp;(e.g., primary key, stock ticker data).<br>
&emsp;&emsp;&emsp;&emsp;• Bitmap Encoding on high cardinality columns hurts inserts and updates: **T**. On<br>
&emsp;&emsp;&emsp;&emsp;&emsp;high cardinality columns with bitmap encoding, each insert/update would need to<br>
&emsp;&emsp;&emsp;&emsp;&emsp;edit all the bitmaps which would generate extra writes.<br>
&emsp;&emsp;&emsp;&emsp;• Delta Encoding is good at compressing large text values: **F**. Large text values<br>
&emsp;&emsp;&emsp;&emsp;&emsp;in theory have large differences; hence delta encoding may not be an effective<br>
&emsp;&emsp;&emsp;&emsp;&emsp;choice.<br>
&emsp;&emsp;&emsp;&emsp;• For point lookup-only workload, order-preserving dictionary encoding is unnec-<br>
&emsp;&emsp;&emsp;&emsp;&emsp;essary: **T**. Since we are only looking up an exact value, we only require the dic-<br>
&emsp;&emsp;&emsp;&emsp;&emsp;tionary’s hash properties.<br>
&emsp;&emsp;&emsp;&emsp;• For a heavy update workload, dictionary performs better than delta encoding: **T**.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;In the worst case, order-preserving dictionary encoding and delta encoding both<br>
&emsp;&emsp;&emsp;&emsp;&emsp;require re-encoding the entire column. However, for non order-preserving dictio-<br>
&emsp;&emsp;&emsp;&emsp;&emsp;nary encodings, you don’t have to re-encode.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;In the case where the new value is different, delta encoding will have to re-encode,<br>
&emsp;&emsp;&emsp;&emsp;&emsp;whereas order-preserving dictionary may not (i.e., dictionary already contains the<br>
&emsp;&emsp;&emsp;&emsp;&emsp;target value or can assign an encoding without re-computing).

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;End of Homework #2

