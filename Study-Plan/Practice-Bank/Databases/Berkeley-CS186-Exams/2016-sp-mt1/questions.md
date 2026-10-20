# Berkeley CS186 Spring 2016: Midterm 1: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/186>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Name:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_<br>
**Midterm 1: CS186, Spring 2016**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Class Login:** cs186- \_\_\_\_ \_\_\_\_ \_\_\_\_

11You should receive 1 double-sided answer sheet and an    -page exam. Mark your name and login on<br>
**both sides of the answer sheet**, **and in the blanks above**. For each question, place **only your final**<br>
**answer** on the answer sheet—do not show work or formulas there.  You may use the blank spaces for<br>
scratch paper, but **do not tear off any pages**.  You will **turn in both question and answer sheets**.

I. Storage: Disk, Files, Buffers \[11 points\]

1\.   \[3 points\] Write down the letters of true statements in alphabetical order. (If none are true,<br>
&emsp;write ∅.)<br>
&emsp;A. When querying for a 16 byte record, exactly 16 bytes of data is read from disk.<br>
&emsp;B. Writing to an SSD drive is more costly than reading from an SSD drive.<br>
&emsp;C. In a heap file, all pages must be filled to capacity except the last page.<br>
&emsp;D. If the file size is smaller than the number of buffer frames, a sequential scan of the file<br>
&emsp;&emsp;using either MRU or LRU (starting with an empty buffer pool) will have the same hit rate.<br>
&emsp;E. Assuming integers take 4 bytes and pointers take 4 bytes, a slot directory that is 256<br>
&emsp;&emsp;bytes can address 64 records in a page.<br>
&emsp;F.   In a page containing fixed-length records with no nullable fields, the size of the bitmap<br>
&emsp;&emsp;never changes.

2\.   \[2 points\] Write down the true benefits of using a record header for **variable** length records<br>
&emsp;in alphabetical order (or if none are true benefits, write ∅.)<br>
&emsp;A. Does not need delimiter character to separate fields in the records.<br>
&emsp;B. Always matches or beats space cost when compared to fixed-length record format.<br>
&emsp;C. Can access any field without scanning the entire record.<br>
&emsp;D. Has compact representation of null values

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;111Page " of


---

<a id="page-2"></a>
**Page 2**

3\.   \[6 points\] Assume we have 4 empty buffer frames and the following access pattern, in which<br>
&emsp;pages are immediately unpinned.

&emsp;&emsp;&emsp;&emsp;&emsp;`T A M E T E A M M A T E M E A T L I D`

Use the replacement policy listed, and list the four pages in the buffer pool at the end, in<br>
alphabetical order. Hint: you don’t need to draw a big chart for every access — look for patterns.<br>
&emsp;A. MRU<br>
&emsp;B. LRU<br>
&emsp;C. Clock. (Assume the clock hand starts on the first buffer and does not move unless a<br>
&emsp;&emsp;page needs to be replaced.)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;This space left intentionally blank for scratch work.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;112Page " of


---

<a id="page-3"></a>
**Page 3**

II. Joins \[12 points\]

1.\[4 points\] Alphabetically, write down the letters of statements that apply (or write ∅.)<br>
&emsp;A. Sometimes, adding more memory to our system **will not** reduce I/O costs for a sort-<br>
&emsp;&emsp;merge join.<br>
&emsp;B. A Grace hash join will always perform better than a naïve hash join.<br>
&emsp;C. Sometimes, replacing an Alternative 2 index with an Alternative 1 index on the same key<br>
&emsp;&emsp;will speed up an index-nested-loops join.<br>
&emsp;D. A Grace hash join can often complete in 2 passes if the size of the smaller relation is<br>
&emsp;&emsp;less than roughly the square of the number of buffers available for the join.

For the following questions in this section (Joins), assume that we are streaming our join output<br>
to a terminal. **Consider the cost of the initial table scan, but do not consider the cost of**<br>
**writing the final output**.

We have the following schema:<br>
`CREATE TABLE Cheesemakers (`    `CREATE TABLE Products (`<br>
`cm_id INTEGER` `PRIMARY KEY``,`    `cheese_id INTEGER` `PRIMARY KEY``,`<br>
`name VARCHAR(33),`     `cm_id INTEGER` `REFERENCES Cheesemakers``,`<br>
`ranking INTEGER,`     `ctype VARCHAR(16),`<br>
`skill_level INTEGER)`   `smelliness INTEGER,`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`cheesiness INTEGER)`

Until instructed otherwise, assume that:<br>
•   Cheesemakers has **\[C\] = 500 pages**<br>
•   Products has **\[P\] = 2000 pages**<br>
•   we fix **B = 102 pages** of memory for computing joins.

Consider the following query:<br>
&emsp;&emsp;`SELECT C.name, C.ranking, P.ctype, P.smelliness, P.cheesiness`<br>
&emsp;&emsp;`FROM Cheesemakers C, Products P`<br>
&emsp;&emsp;`WHERE C.cm_id = P.cm_id`

2\.   \[4 points\] Using the smaller relation as the “outer” one, what is the I/O cost of using a block<br>
&emsp;nested loops join to evaluate the query above?  Please provide the final number.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;113Page " of


---

<a id="page-4"></a>
**Page 4**

3\.   \[4 points\] What is the I/O cost of using a sort-merge join to evaluate the query above?<br>
&emsp;Please provide the final number. (Remember to take advantage of the “important<br>
&emsp;refinement” discussed in lecture for merge-joining partitions during the last pass of sort!)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;This space left intentionally blank for scratch work.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;114Page " of


---

<a id="page-5"></a>
**Page 5**

III. Sort/Hash \[16 points\]<br>
For this question, consider our table of Products from the previous Joins section, but assume:<br>
•   **\[P\] = 2000 pages**<br>
•**pc = 100 tuples/page**<br>
•   **B = 40 pages** of buffer<br>
•   In all parts, we’ll use **QuickSort** for our internal sort algorithm.<br>
•   **Include the cost of the initial scan and cost of writing output in your I/O calculations.**

1.\[3 points\] Alphabetically, write down the letters of statements that apply (or write ∅.)<br>
&emsp;A. Given a buffer of size B, the largest file you can sort in a single pass is B.<br>
&emsp;B. All files can be externally sorted, whereas not all files can be externally hashed.<br>
&emsp;C. For sort-merge joins, quicksort is always a better choice than heapsort for the internal<br>
&emsp;&emsp;sort algorithm.

2\.   \[6 points\] First, let’s sort our table of Products (P) using the external algorithm we learned in<br>
&emsp;lecture.<br>
&emsp;A. How many passes are needed to sort this file?<br>
&emsp;B. What is the I/O cost (in pages) of sorting this file?<br>
&emsp;C. Suppose we want to decrease the I/O cost of sorting this file, but we want to add the<br>
&emsp;&emsp;minimum number of buffer pages possible.  Among the numbers on the answer sheet<br>
&emsp;&emsp;(1, 5, 10, 50) circle the smallest number of additional buffers to add that decreases the<br>
&emsp;&emsp;I/O cost.

3\.   \[4 points\] Given the resources at the top of Question III, answer the following two questions.<br>
&emsp;Do not bother to simplify arithmetic expressions over constants, like 247\*(363+log(4)).<br>
&emsp;A. What is the largest file size (in pages) that we can sort in 3 passes?<br>
&emsp;B. What is the smallest file size (in pages) that will require 3 passes to sort?

4\.   \[3 points\] Suppose I want to eliminate duplicates from our (unsorted) table of Products,<br>
&emsp;using external hashing. Write down the letters of true statements. (If none are true, write ∅.)<br>
&emsp;A. Deduplicating the file using hashing can have a higher IO cost than sorting the file<br>
&emsp;&emsp;(without deduplicating).<br>
&emsp;B. Deduplicating the file using hashing can have a lower IO cost than sorting the file<br>
&emsp;&emsp;(without deduplicating).<br>
&emsp;C. If external hashing recursively partitions on one partition, it will do so on all partitions.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;115Page " of


---

<a id="page-6"></a>
**Page 6**

This space left intentionally blank for scratch work.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;116Page " of


---

<a id="page-7"></a>
**Page 7**

IV. Indexes and B+ Trees \[12 points\]<br>
Note: for  B+ tree page splits with an odd number of items, assume that the majority of the items<br>
is placed on the right-hand page after the split.<br>
1.\[4 points\] Alphabetically, write down the letters of statements that apply (or write ∅.)<br>
&emsp;A. All internal keys in a B+ tree also appear in its leaf nodes.<br>
&emsp;B. The height of a B+ tree increases whenever any node splits.<br>
&emsp;C. An ISAM index is similar to a B+ tree, but does not allow for insertion of new values.<br>
&emsp;D. The column(s) we select for our index key must have a unique value for every row in the<br>
&emsp;&emsp;table.<br>
&emsp;E. An Alternative 1 index may be either clustered or unclustered.

2\.   \[5 points\] The following B+ Tree has order 1 (max fanout of 3) and each leaf node can hold<br>
&emsp;up to 2 entries. Answer each of the follow questions **independently of each other**.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`2``4`<br>
&emsp;&emsp;height = 1

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`1``2``3``4``5`

&emsp;A. What value(s) would be in the root node if we were to insert 0?<br>
&emsp;B. What value(s) would be in the root node if we were to insert 6?<br>
&emsp;C. Starting with the height 1 tree in the picture above, suppose we start inserting keys 6, 7,<br>
&emsp;&emsp;8, … and so on. After inserting what key will the height of the tree become 3?

3\.   \[3 points\] Assume we are trying to construct a B+ Tree of order 2 (max fanout of 5). Each<br>
&emsp;leaf node can hold up to 4 entries. We insert a total of 16 unique keys via bulk loading, with<br>
&emsp;a fill factor of ¾.<br>
&emsp;A. How many leaf nodes will there be?<br>
&emsp;B. How many internal (non-leaf) nodes will there be?<br>
&emsp;C. How many internal (non-leaf) nodes do we traverse to do an equality search?

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;117Page " of


---

<a id="page-8"></a>
**Page 8**

This space left intentionally blank for scratch work.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;118Page " of


---

<a id="page-9"></a>
**Page 9**

V. SQL \[ 17 points\]

Consider the following schema:<br>
`CREATE TABLE Location (`    `CREATE TABLE People(`<br>
`lname TEXT,`     `id INTEGER` `PRIMARY KEY``,`<br>
`areacode INTEGER` `PRIMARY KEY``)`   `pname TEXT,`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`areacode INTEGER` `REFERENCES Location``)`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`CREATE TABLE Calls(`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`cid INTEGER` `PRIMARY KEY``,`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`date DATETIME,`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`from INTEGER` `REFERENCES People``,`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`to INTEGER` `REFERENCES People``,`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`duration INTEGER)`

You should assume that referential integrity is being enforced, and no NULL values appear.

For parts 1 and 2, fill in the blanks in the SQL queries.<br>
1\.   \[7 points\] Names of pairs of people who called each other on 2014-12-25

2\.   \[7 points\] Find the location to which the most phone calls have been made, and return its<br>
&emsp;location name as well as the number of calls made to it.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;119Page " of


---

<a id="page-10"></a>
**Page 10**

3\.   \[3 points\] On the answer sheet, alphabetically write down letters of the statement(s) that find<br>
&emsp;the name of the location of the person who made the longest call. (If none match, write ∅.)

A.`WITH (SELECT P.areacode AS areacode, C.duration AS duration`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`FROM calls C, People P`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`WHERE C.from =  P.id) AS DC,`<br>
&emsp;&emsp;`SELECT L.lname`<br>
&emsp;&emsp;`FROM DC, Location L`<br>
&emsp;&emsp;`WHERE L.areacode = DC.areacode`<br>
&emsp;&emsp;`ORDER BY DC.duration DESC`<br>
&emsp;&emsp;`LIMIT 1;`

B.`SELECT L.lname`<br>
&emsp;&emsp;`FROM Location L, (SELECT P.areacode AS areacode,`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`C.duration AS duration`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`FROM Calls C, People P`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`WHERE C.from = P.id) AS DC`<br>
&emsp;&emsp;`WHERE L.areacode = DC.areacode`<br>
&emsp;&emsp;`ORDER BY DC.duration ASC;`

C.   `WITH (SELECT L.lname AS lname, L.areacode AS LAC, P.id AS pid`<br>
&emsp;&emsp;`FROM Location L FULL OUTER JOIN People P`<br>
&emsp;&emsp;`ON L.areacode = P.areacode) AS Names,`<br>
&emsp;&emsp;`SELECT Names.lname`<br>
&emsp;&emsp;`FROM Names, Calls C`<br>
&emsp;&emsp;`WHERE C.cid = Names.pid`<br>
&emsp;&emsp;`ORDER BY C.duration DESC`<br>
&emsp;&emsp;`LIMIT 1;`

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1110Page     of


---

<a id="page-11"></a>
**Page 11**

VI. Relational Algebra \[8 points\]<br>
Consider the schema from the SQL question, but with the relation names shortened:<br>
\- Location → L<br>
\- People → P<br>
\- Calls → C

1\.   To answer the following two questions, put one relational algebra operator or relation name<br>
&emsp;in each blank:<br>
&emsp;a.   \[3 points\] Areacodes to which no call has ever been made.<br>
&emsp;b.   \[3 points\] Names of people who live in the location “City of Joe”

&emsp;\[2 points\] The equivalence relation ≣ means that two expressions produce the same results<br>
2.<br>
&emsp;on all possible databases.  Write down the letters of the equivalences below that are true. (If<br>
&emsp;none are true, write ∅.)

A.  𝜌(Temp1(1**→**id), (𝜋id(P) ∪ 𝜋from(C))<br>
𝜌(Temp2(1**→**id), ((𝜎id=5(P) ⨝id=from C))

𝜎id=5(Temp1) ≣ 𝜋id(Temp2)

B.  𝜋areacode(P) — 𝜋areacode(𝜎areacode=415(P ⨝ L))<br>
≣ 𝜋areacode(P) — 𝜋areacode(𝜎areacode=415(𝜋areacode(P)∩ 𝜋areacode(L)))

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;This space left intentionally blank.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1111Page     of

