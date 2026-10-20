# Berkeley CS186 Fall 1998: Midterm 1: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/186>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS 186, Midterm #1 Fall 1998<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Name\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Section You Usually Attend\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**UNIVERSITY OF CALIFORNIA**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**College of Engineering**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Department of EECS, Computer Science Division**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**Midterm Exam: Introduction to Database Systems**<br>
This exam has four problems, each worth 25 points.  There is also 10 points of extra credit available.  Each<br>
problem is made up of multiple questions.   You should read through the exam quickly and plan your<br>
time-management accordingly.   Before beginning to answer a question, be sure to read it carefully and to<br>
answer all parts of every question!


![Figure on page 1](figures/questions-p01-fig01.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Good luck!

**1. Sorting \[25 points\]**<br>
To receive full credit for this problem you **must** write down relevant formulas and show your work.

We are trying to sort a file containing 250,000 blocks with only 250 buffers available in the buffer pool for<br>
sorting.  The file contains fixed length tuples.

&emsp;&emsp;a) \[5 points\] How many initial runs will be generated if quicksort is used to sort tuples in<br>
&emsp;&emsp;memory?

&emsp;&emsp;b) \[5 points\] How many total I/O will the sort perform, including the cost of writing out the<br>
&emsp;&emsp;output?

In the following questions, assume that the average time to locate a random block (seek and rotational delay)<br>
takes 10 ms, while the time to transfer a block takes 5 ms.

&emsp;&emsp;c) \[5 points\] During our sort, if we merge runs a block at a time (in memory we set aside one<br>
&emsp;&emsp;buffer frame per input run for merging) what percent of the total disk bandwidth are we<br>
&emsp;&emsp;utilizing?

&emsp;&emsp;d) \[5 points\] Suppose we want to achieve a disk bandwidth utilization of 90%.   How many<br>
&emsp;&emsp;buffer frames per run should we set aside in our buffer pool?

&emsp;&emsp;e) \[5 points\] What is the tradeoff in setting aside aside more buffer frames (i.e. higher disk<br>
&emsp;&emsp;bandwidth utilization) per run?<br>
**2. Indexes \[25 points\]**

1Name\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ Section You Usually Attend\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_exam #professor (e.g.,


---

<a id="page-2"></a>
**Page 2**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS 186, Midterm #1 Fall 1998


![Figure on page 2](figures/questions-p02-fig02.png)

**Hash Indexes**

&emsp;&emsp;a) \[5 points\] Fill in the<br>
&emsp;&emsp;global depth and local depth<br>
&emsp;&emsp;for each bucket in the<br>
&emsp;&emsp;extendible hashing index<br>
&emsp;&emsp;shown to the right.

&emsp;&emsp;b) \[5 points\] What is the<br>
&emsp;&emsp;minimum number of entries<br>
&emsp;&emsp;that needed to be inserted to<br>
&emsp;&emsp;cause the creation of a new<br>
&emsp;&emsp;bucket?

&emsp;&emsp;c) \[5 points\] Give an<br>
&emsp;&emsp;example for such a<br>
&emsp;&emsp;sequence of entries.

**B+ Tress**

&emsp;&emsp;d) \[5 points\] What is the<br>
&emsp;&emsp;maximum height of a<br>
&emsp;&emsp;B+-tree with N data entries and fanout k?

&emsp;&emsp;e) \[5 points\] Consider the bulk-loading algorithm we studied in class.  Assume there are N<br>
&emsp;&emsp;data entries, k entries fit on a leaf node, and the internal nodes have fanout k.  Ignoring the<br>
&emsp;&emsp;effects of buffer management, explain briefly why bulk-loading is more or less efficient than<br>
&emsp;&emsp;building the tree via multiple insertions.

&emsp;&emsp;f) \[Extra Credit: 10 points\] In addition to range and equality selection queries, we would like<br>
&emsp;&emsp;to efficiently support queries of the form "how many tuples fall in the range of x to y".<br>
&emsp;&emsp;Describe how you would augment a B+-tree to support such queries.  Outline how these<br>
&emsp;&emsp;"count" queries would be evaluated in your tree.  Also outline the steps involved in inserting<br>
&emsp;&emsp;a new entry.  Your augmented B+-tree should be able to support such count queries at much<br>
&emsp;&emsp;lower cost than normal B+-tree.<br>
**3. Disk, Indexes and Buffer Management \[25 points\]**<br>
&emsp;&emsp;a) \[5 points\] List the three major components of disk delay, organized from most to least<br>
&emsp;&emsp;time consuming.\]

&emsp;&emsp;b) \[5 points\] We discussed two possible formats for variable-length records: one with<br>
&emsp;&emsp;delimiters, and another with pointers.  Explain which one is preferable and why.

&emsp;&emsp;c) \[5 points\] Explain why you cannot have a sparse, unclustered index.  You may want to<br>
&emsp;&emsp;illustrate with a example.

&emsp;&emsp;d) \[5 points\] Assume you have a buffer pool with 3 frames and a file with four pages (A, B,<br>
&emsp;&emsp;C, D).  Assuming that the buffer pool starts out empty, give an access pattern of 8 page<br>
&emsp;&emsp;accesses that makes LRU do an I/O for each page access.

2\. Indexes \[25 points\]   2


---

<a id="page-3"></a>
**Page 3**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS 186, Midterm #1 Fall 1998<br>
&emsp;&emsp;e) \[5 points\] Given the access pattern ABCDACACDC, and an empty buffer pool with 3<br>
&emsp;&emsp;frames, count the number of disk reads necessary for each of LRU, MRU, and LRU-2.  If a<br>
&emsp;&emsp;"tie" occurs in LRU-2, replace the lowest-numbered frame.<br>
**4. Formal Query Languages \[25 points\]**<br>
The World Organization of Furry Friends (WOOFF) has asked you to answer some questions for them.  They<br>
have a database with the following schema.  **Breeders** are people who raise and sell **Pets**.  Pets belong to<br>
different **Breeds** (e.g. "Scmauzer", "Poodle", "Siamese", etc.)  The **Pedigree** of the pet identifies the pet's<br>
breeder and breed.  If a pet is of mixed breed, it's considered to belong to multiple breeds - that is, that pet<br>
(and its breeder) will appear many times in the Pedigree table.  You may assume that pets have only one<br>
breeder.  Primary keys are underlined.

Breeders(brdr\_id: integer, brdr\_name: text, age: integer)<br>
Pets(pid: integer, pname: text, weight: float)<br>
Breeds(br\_id: integer, br\_name: text, friendliness: int)<br>
Pedigree(brdr\_id: integer, pid: integer, br\_id: integer)

&emsp;&emsp;a) \[5 points\] Give a relational calculus query to find the weights of all pets named 'Tiny'.

&emsp;&emsp;b) \[5 points\] Give a relational calculus query to find the br\_id, breed name and friendliness of<br>
&emsp;&emsp;all breeds raised by Breeder Bob.

&emsp;&emsp;c) \[5 points\] Give a relational algebra query to find the breed name and friendliness of all<br>
&emsp;&emsp;breeds for which Breeder Bob raised a pet named 'Killer'.  Please draw a "tree" for your<br>
&emsp;&emsp;algebra, rather than a parenthesized expression.

&emsp;&emsp;d) \[5 points\] Give a relational algebra tree to find the names of Breeders who have bred dogs<br>
&emsp;&emsp;in the breeds "Doberman" and "Chihuahua".  (In your answer, you should count breeders<br>
&emsp;&emsp;who raised Doberman/Chihuahua mixes.)

&emsp;&emsp;e) \[5 points\] Give a relational calculus query **or** relational algebra tree (you can choose<br>
&emsp;&emsp;either!) to find the names of pets who belong to all the same breeds as a pet named 'Icky'.

Note: you may use the DRC or TRC, whichever you prefer.

&emsp;**Posted by HKN (Electrical Engineering and Computer Science Honor Society)**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**University of California at Berkeley**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**If you have any questions about these online exams**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**please contact examfile@hkn.eecs.berkeley.edu.**

3\. Disk, Indexes and Buffer Management \[25 points\]   3

