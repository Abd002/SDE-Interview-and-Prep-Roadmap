# CMU 15-445 Spring 2026: Homework 2: Official solutions

> Copied from the original: <https://15445.courses.cs.cmu.edu/spring2026/assignments.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CARNEGIE MELLON UNIVERSITY<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;COMPUTER SCIENCE DEPARTMENT<br>
&emsp;&emsp;&emsp;&emsp;&emsp;15-445/645 – DATABASE SYSTEMS (SPRING 2026)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;PROF. ANDY PAVLO AND JIGNESH PATEL

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #2 (by Saransh) – Solutions<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Due: **Sunday Feb 8, 2026 @ 11:59pm**

**IMPORTANT:**<br>
&emsp;• Enter all of your answers into **Gradescope by 11:59pm on Sunday Feb 8, 2026.**<br>
&emsp;• **Plagiarism**: Homework may be discussed with other students, but all homework is to be<br>
&emsp;&emsp;completed **individually**.<br>
For your information:<br>
&emsp;• Graded out of **100** points; **3** questions total<br>
&emsp;• Rough time estimate: ≈4-6 hours (1-1.5 hours for each question)<br>
&emsp;Revision : 2026/02/18 16:48

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Question   Points   Score<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Slotted Pages and Log-Structured   30<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Storage Models   35<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Database Compression   35<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Total:   100

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1


---

<a id="page-2"></a>
**Page 2**

15-445/645 (Spring 2026)   Homework #2   Page 2 of 8


### **Question 1: Slotted Pages and Log-Structured . . . . . . . . . . . . . . . . . \[30 points\]**

&emsp;**Graded by:**<br>
&emsp;(a) **\[10 points\]** Which of the following statements are true for database systems using log-<br>
&emsp;&emsp;&emsp;structured storage? Select all that apply.<br>
&emsp;&emsp;&emsp;☒ **Log structured storage can cause write amplification**<br>
&emsp;&emsp;&emsp;☐  Log structured storage requires the DBMS to check previous records on update oper-<br>
&emsp;&emsp;&emsp;ations<br>
&emsp;&emsp;&emsp;☐  Log structured storage can cause fragmentation<br>
&emsp;&emsp;&emsp;☒ **In leveled compaction, SSTables within a level (except Level 0) are non-overlapping**<br>
&emsp;&emsp;&emsp;**on key ranges**<br>
&emsp;&emsp;&emsp;☐  None of the above

&emsp;&emsp;&emsp;**Solution:** Log-structure storage incurs write amplification due to compaction.<br>
&emsp;&emsp;&emsp;Log-structured storage does not require the DBMS to check previous log records on<br>
&emsp;&emsp;&emsp;updates, instead the DBMS simply appends log records to the end of the file.<br>
&emsp;&emsp;&emsp;Fragmentation is a problem typically associated with slotted-page storage due to tuple<br>
&emsp;&emsp;&emsp;deletion in a page leaving holes. This is not associated with log-structured storage.<br>
&emsp;&emsp;&emsp;Levelled compaction has non-overlapping key-ranges for SSTables on each level below<br>
&emsp;&emsp;&emsp;the 0th level.

&emsp;(b) **\[10 points\]** Which of the following statements are true for database systems using slotted-<br>
&emsp;&emsp;&emsp;page storage? Select all that apply.<br>
&emsp;&emsp;&emsp;☐  Slotted-page storage can cause write amplification<br>
&emsp;&emsp;&emsp;☐  Applications should treat RIDs in slotted-page storage systems as stable identifiers<br>
&emsp;&emsp;&emsp;and may rely on them<br>
&emsp;&emsp;&emsp;☒ **Slotted-page storage can increase random reads and writes**<br>
&emsp;&emsp;&emsp;☐  Slotted-page storage does not allow variable length tuples<br>
&emsp;&emsp;&emsp;☐  None of the above

&emsp;&emsp;&emsp;**Solution:** Write amplification is a problem typically associated with log-structured stor-<br>
&emsp;&emsp;&emsp;age, not slotted-page storage.<br>
&emsp;&emsp;&emsp;RIDs should never be relied on as a stable identifier, since they are simply used by the<br>
&emsp;&emsp;&emsp;DBMS to locate a tuple on disk.<br>
&emsp;&emsp;&emsp;Since tuples can be stored across separate pages, it may increase the amount of random<br>
&emsp;&emsp;&emsp;I/O that the DBMS has to incur when both reading data and when writing out dirty<br>
&emsp;&emsp;&emsp;pages.<br>
&emsp;&emsp;&emsp;Slotted page storage does allow for variable length tuples, by simply storing the start<br>
&emsp;&emsp;&emsp;byte of a tuple in the slot array.

&emsp;(c) **\[10 points\]** You are asked to compare log-structured storage to slotted-page storage for


### Question 1 continues...


---

<a id="page-3"></a>
**Page 3**

15-445/645 (Spring 2026)   Homework #2   Page 3 of 8

&emsp;&emsp;&emsp;a new system. Ignore any indexes and overhead from metadata. Select all true statements.<br>
&emsp;&emsp;&emsp;☐  Both storage systems update tuples in-place to avoid extra I/O<br>
&emsp;&emsp;&emsp;☒ **For an append-only workload, both achieve comparable performance**<br>
&emsp;&emsp;&emsp;☐  Slotted-page requires storing schema metadata with the tuple, while log-storage does<br>
&emsp;&emsp;&emsp;not<br>
&emsp;&emsp;&emsp;☒ **Both designs may require background maintenance to reclaim space after nu-**<br>
&emsp;&emsp;&emsp;**merous inserts/updates/deletes**<br>
&emsp;&emsp;&emsp;☐  Log-structured storage requires less disk space than slotted-page storage<br>
&emsp;&emsp;&emsp;☐  None of the above are true

&emsp;&emsp;&emsp;**Solution:** Log-structured storage does not update tuples in-place, and always inserts a<br>
&emsp;&emsp;&emsp;new tuple to the log.<br>
&emsp;&emsp;&emsp;In absence of indexes + metadata, then slotted-page for append-only workload becomes<br>
&emsp;&emsp;&emsp;the log-structured storage architecture. They achieve similar performance.<br>
&emsp;&emsp;&emsp;Neither format requires storing schema metadata with the tuple<br>
&emsp;&emsp;&emsp;After lots of inserts/updates/deletes, slotted-page storage may benefit from maintenance<br>
&emsp;&emsp;&emsp;to reclaim any empty space or compact partially empty pages. Log-structured storage<br>
&emsp;&emsp;&emsp;may benefit from compaction.<br>
&emsp;&emsp;&emsp;Log structured storage requires more disk space in workloads that are not append-only.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #2 continues...


---

<a id="page-4"></a>
**Page 4**

15-445/645 (Spring 2026)   Homework #2   Page 4 of 8


### **Question 2: Storage Models . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . \[35 points\]**

&emsp;**Graded by:**<br>
&emsp;Consider a database with a single table `G(game` `id,dev` `id,total` `sales,player` `count`),<br>
&emsp;where `game` `id` is the primary key, and all attributes are the same fixed width. Suppose `G`<br>
&emsp;has 10,000 tuples that fit into 400 pages. You should ignore any additional storage overhead<br>
&emsp;for the table (e.g., page headers, tuple headers). Additionally, you should make the following<br>
&emsp;assumptions:<br>
&emsp;&emsp;• The DBMS does not have any additional meta-data.<br>
&emsp;&emsp;• `G` does not have any indexes (including for primary key `game` `id`).<br>
&emsp;&emsp;• None of `G`’s pages are already in memory. The DBMS can store an infinite number of<br>
&emsp;&emsp;&emsp;pages in memory.<br>
&emsp;&emsp;• Content-wise, the tuples of `G` will always make each query run the longest possible and<br>
&emsp;&emsp;&emsp;do the most page accesses. Always consider what the worst-case content/values for each<br>
&emsp;&emsp;&emsp;column can be.<br>
&emsp;&emsp;• Order-wise, the tuples of `G` can be in any order. Keep this in mind when computing min-<br>
&emsp;&emsp;&emsp;imum versus maximum number of pages that the DBMS will potentially have to read.<br>
&emsp;&emsp;&emsp;Think of all possible orderings, but always for the worst-case content of data

&emsp;(a) Consider the following query:


![Figure on page 4](figures/solutions-p04-fig01.png)

&emsp;&emsp;&emsp;i. **\[5 points\]** Suppose the DBMS uses the N-ary storage model (NSM). How many<br>
&emsp;&emsp;&emsp;&emsp;pages will the DBMS potentially have to read from disk to answer this query?<br>
&emsp;&emsp;&emsp;&emsp;Be sure to keep in mind the assumption about the contents of `G`.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **301-400**<br>
&emsp;&emsp;&emsp;&emsp;☐  1-100   ☐  101-200   ☐  201-300   ☐  \> 400   ☐  Not possible<br>
&emsp;&emsp;&emsp;&emsp;to determine

&emsp;&emsp;&emsp;&emsp;**Solution:** 400 pages. To find `player` `count` and `dev` `id` for all tuples, all pages<br>
&emsp;&emsp;&emsp;&emsp;must be accessed.<br>
&emsp;&emsp;&emsp;ii. **\[5 points\]** Suppose the DBMS uses the decomposition storage model (DSM) with<br>
&emsp;&emsp;&emsp;&emsp;implicit offsets. How many pages will the DBMS potentially have to read from disk<br>
&emsp;&emsp;&emsp;&emsp;to answer this query?<br>
&emsp;&emsp;&emsp;&emsp;Be sure to keep in mind the assumption about the contents of `G`.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **101-200**<br>
&emsp;&emsp;&emsp;&emsp;☐  1-100   ☐  201-300   ☐  301-400   ☐  \> 400   ☐  Not possible<br>
&emsp;&emsp;&emsp;&emsp;to determine

&emsp;&emsp;&emsp;&emsp;**Solution:** 200 pages. There are 100 pages per attribute. 100 pages to find `dev` `id`<br>
&emsp;&emsp;&emsp;&emsp;for all tuples. In the worst-case scenario for `G`’s content, `player` `count` for all tuples<br>
&emsp;&emsp;&emsp;&emsp;must be accessed as well. Hence, another 100 pages must be read.


### Question 2 continues...


---

<a id="page-5"></a>
**Page 5**

15-445/645 (Spring 2026)   Homework #2   Page 5 of 8

&emsp;(b) Now consider the following query:


![Figure on page 5](figures/solutions-p05-fig02.png)

&emsp;&emsp;&emsp;i. Suppose the DBMS uses the N-ary storage model (NSM).<br>
&emsp;&emsp;&emsp;&emsp;α) **\[5 points\]** What is the minimum number of pages that the DBMS will poten-<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;tially have to read from disk to answer this query?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **1**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  2-9   ☐  10-100   ☐  101-200   ☐  201-300   ☐  301-400<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  \> 400   ☐  Not possible to determine

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Solution:** We find the tuples of all two primary keys on the first page. No need<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;to look in other pages since all attributes are stored together.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;β) **\[5 points\]** What is the maximum number of pages that the DBMS will poten-<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;tially have to read from disk to answer this query?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **301-400**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  1   ☐  2-9   ☐  10-100   ☐  101-200   ☐  201-300<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  \> 400   ☐  Not possible to determine

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Solution:** 400 pages. At least one tuple with matching primary key is located<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;on the last page. We must thus scan through every page.<br>
&emsp;&emsp;&emsp;ii. Suppose the DBMS uses the decomposition storage model (DSM) with implicit off-<br>
&emsp;&emsp;&emsp;&emsp;sets.<br>
&emsp;&emsp;&emsp;&emsp;α) **\[5 points\]** What is the minimum number of pages that the DBMS will poten-<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;tially have to read from disk to answer this query?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **2-9**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  1   ☐  10-100   ☐  101-200   ☐  201-300   ☐  301-400<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  \> 400   ☐  Not possible to determine

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Solution:** 3 pages. Suppose all two primary keys appear on the first page.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Since all attributes are of the same fixed width, each attribute of `game` `id=1`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;and `game` `id=999` will also appear on the same page. We’ll thus need to read 1<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;page to find both primary keys and read 2 pages to access `player` `count` and<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`dev` `id` at their corresponding offsets.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;β) **\[5 points\]** What is the maximum number of pages that the DBMS will poten-<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;tially have to read from disk to answer this query?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **101-200**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  1   ☐  2-9   ☐  10-100   ☐  201-300   ☐  301-400<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  \> 400   ☐  Not possible to determine

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Solution:** 104 pages. There are 100 pages per attribute. In the worst case,<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;we scan through all 100 pages to find both primary keys. In the worst case,<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;the primary keys will be located on different pages. Since all attributes are of<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;the same fixed width, each attribute of `game` `id=1` and `game` `id=999` will also


### Question 2 continues...


---

<a id="page-6"></a>
**Page 6**

15-445/645 (Spring 2026)   Homework #2   Page 6 of 8

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;appear on different pages. Hence we must read 2 pages to access each attribute<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;at their corresponding offsets. Thus, we read 4 pages in total to access `dev` `id`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;and `player` `count`.<br>
&emsp;(c) Finally consider the following query:


![Figure on page 6](figures/solutions-p06-fig03.png)

&emsp;&emsp;&emsp;Suppose the DBMS uses the decomposition storage model (DSM) with implicit offsets.<br>
&emsp;&emsp;&emsp;i. **\[5 points\]** What is the minimum number of pages that the DBMS will potentially<br>
&emsp;&emsp;&emsp;&emsp;have to **read from disk** to answer this query?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **101-200**<br>
&emsp;&emsp;&emsp;&emsp;☐  1   ☐  2-9   ☐  10-100   ☐  201-300   ☐  301-400   ☐  \> 400<br>
&emsp;&emsp;&emsp;&emsp;☐  Not possible to determine

&emsp;&emsp;&emsp;&emsp;**Solution:** 200 pages. 100 pages for the inner select, and 100 pages to get the<br>
&emsp;&emsp;&emsp;&emsp;`game` `id` since the buffer pool will have the `player` `count` pages from the inner se-<br>
&emsp;&emsp;&emsp;&emsp;lect. Remember content-wise the tuples make the queries always run for the longest<br>
&emsp;&emsp;&emsp;&emsp;time, you can only consider different orderings of the tuples.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #2 continues...


---

<a id="page-7"></a>
**Page 7**

15-445/645 (Spring 2026)   Homework #2   Page 7 of 8


### **Question 3: Database Compression. . . . . . . . . . . . . . . . . . . . . . . . . . . .\[35 points\]**

&emsp;**Graded by:**<br>
&emsp;(a) **\[5 points\]** Suppose that the DBMS has a `VARCHAR` column storing the following values:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`[Gates-Hillman` `Complex,` `Porter` `Hall,` `Doherty` `Hall,` `Wean`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`Hall,` `Hunt` `Library]`<br>
&emsp;&emsp;&emsp;Which of the following are valid encodings (`uint32`) for this column under dictionary<br>
&emsp;&emsp;&emsp;compression as discussed in lecture that will support both point queries and range queries?<br>
&emsp;&emsp;&emsp;Select **all** the valid encodings.<br>
&emsp;&emsp;&emsp;☐  `[1,2,3,4,5]`<br>
&emsp;&emsp;&emsp;☒ `[2,4,1,5,3]`<br>
&emsp;&emsp;&emsp;☐  `[0,12,32,33,31]`<br>
&emsp;&emsp;&emsp;☐  `[50,40,20,10,30]`<br>
&emsp;&emsp;&emsp;☒ `[10,34,8,67,17]`<br>
&emsp;&emsp;&emsp;☐  `[49,9,29,19,39]`

&emsp;&emsp;&emsp;**Solution:** To support range queries, the DBMS must use an order-preserving encoding<br>
&emsp;&emsp;&emsp;scheme. The values of the dictionary codes do not matter as long as they preserve the<br>
&emsp;&emsp;&emsp;same ordering of the original data.

&emsp;(b) **\[15 points\]** Suppose the DBMS wants to compresses a table `R(a)` using columnar com-<br>
&emsp;&emsp;&emsp;pression. Which of the following compression schemes **will benefit** (when considering<br>
&emsp;&emsp;&emsp;space efficiency) from sorting the table before compressing column `a`? Select **all** that<br>
&emsp;&emsp;&emsp;apply.<br>
&emsp;&emsp;&emsp;Hint: “Benefit” means that the efficacy of the compression scheme may improve on sorted<br>
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

<a id="page-8"></a>
**Page 8**

15-445/645 (Spring 2026)   Homework #2   Page 8 of 8

&emsp;(c) **\[15 points\]** A colleague approaches with a list of true and false statements about run-<br>
&emsp;&emsp;&emsp;length encoding, delta encoding, bitmap encoding, and dictionary encoding. The col-<br>
&emsp;&emsp;&emsp;league wants your assistance in identifying the true statements. Select **all** that apply.<br>
&emsp;&emsp;&emsp;☒ **Run-length Encoding is effective for compressing a low cardinality integer col-**<br>
&emsp;&emsp;&emsp;**umn.**<br>
&emsp;&emsp;&emsp;☐  Delta Encoding is good at compressing large text values.<br>
&emsp;&emsp;&emsp;☐  For point lookup-only workload, order-preserving dictionary encoding is required.<br>
&emsp;&emsp;&emsp;☒ **If dictionary codes are order-preserving and you insert a new distinct value that**<br>
&emsp;&emsp;&emsp;**falls between two existing values, you may need to reassign codes.**<br>
&emsp;&emsp;&emsp;☐  Run Length Encoding is most effective on unsorted uniformly random data.<br>
&emsp;&emsp;&emsp;☐  None of the above.<br>
&emsp;&emsp;&emsp;**Solution:**

&emsp;&emsp;&emsp;&emsp;• Run-length Encoding is effective for compressing a low cardinality integer col-<br>
&emsp;&emsp;&emsp;&emsp;&emsp;umn: **T**. With low cardinality columns, we will often have runs of data with the<br>
&emsp;&emsp;&emsp;&emsp;&emsp;same value, which may benefit from RLE<br>
&emsp;&emsp;&emsp;&emsp;• Delta Encoding is good at compressing large text values: **F**. Large text values<br>
&emsp;&emsp;&emsp;&emsp;&emsp;in theory have large differences; hence delta encoding may not be an effective<br>
&emsp;&emsp;&emsp;&emsp;&emsp;choice.<br>
&emsp;&emsp;&emsp;&emsp;• For point lookup-only workload, order-preserving dictionary encoding is required:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**F**. Since we are only looking up an exact value, we only require the dictionary’s<br>
&emsp;&emsp;&emsp;&emsp;&emsp;hash properties.<br>
&emsp;&emsp;&emsp;&emsp;• If dictionary codes are order-preserving and you insert a new distinct value that<br>
&emsp;&emsp;&emsp;&emsp;&emsp;falls between two existing values, you may need to reassign codes: **T**. Since we<br>
&emsp;&emsp;&emsp;&emsp;&emsp;would need the new value between the two existing values, if the two existing<br>
&emsp;&emsp;&emsp;&emsp;&emsp;values are contiguous, they will need to be reassigned.<br>
&emsp;&emsp;&emsp;&emsp;• Run Length Encoding is most effective on unsorted uniformly random data: **F**.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;RLE relies on repeated values in the column, and randomness reduces its efficacy.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;End of Homework #2

