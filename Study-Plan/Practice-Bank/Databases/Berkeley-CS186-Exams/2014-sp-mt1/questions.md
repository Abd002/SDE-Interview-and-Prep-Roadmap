# Berkeley CS186 Spring 2014: Midterm 1: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/186>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**University of California, Berkeley**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;CS 186 Introduction to Databases, Spring 2014, Prof. Dan Olteanu<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**MIDTERM**

• This is a closed book examination   but you are allowed one 8.5” x 11” sheet of notes (double<br>
sided).<br>
• No cell phones/calculators/electronic devices of any sort are allowed.<br>
• Please display your student ID card.<br>
• You should answer as many questions as possible. You should read all of the questions before<br>
starting the exam, as some of the questions are substantially more time-consuming than others.<br>
• There are 100 points in total distributed over five questions.<br>
• Write all of your answers in the designated space provided with each question. We will be grading<br>
only answers written in the designated space.<br>
• You must put your CS 186 class account at the top of each page before you start the exam.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**GOOD LUCK!**


---

<a id="page-2"></a>
**Page 2**

CS186 class account:


### **Question 1.**\[Potpourri\]   Minimum points: 0. Maximum points: 20.

&emsp;For each of the following statements under **A**, **B**, and **C** below, each correct tick is worth 1 point,<br>
each wrong tick is worth -1 point, and no tick is worth 0 points.

&emsp;**A.** Tick the correct TRUE/FALSE boxes for each of the following statements.   **TRUE**   **FALSE**

&emsp;1\. Multiple indexes can be maintained for a single table.

&emsp;2\. An unclustered index can be sparse.

&emsp;3\. Physical data independence is an important database concept and deals<br>
&emsp;&emsp;with hiding the details of the storage structure from user applications.

&emsp;4\. UB-Trees are equivalent to B+-Trees over composite keys.

&emsp;5\. One-dimensional Point Quad Trees are unbalanced binary search trees.

&emsp;6\. Data entries in R-Trees are themselves regions.

&emsp;7\. When a node splits in a k-d tree index, it is along each of the k dimensions.

&emsp;8\. Division can be expressed in Relational Algebra using universal quantification.

&emsp;9\. Disk space management and buffer management in Database Systems<br>
&emsp;&emsp;are very similar to file management and virtual memory in Operating Systems.

&emsp;10\. A record id (rid) is a pair of page id and offset within the page.

&emsp;11\. On record deletion, the space taken by the record on the page<br>
&emsp;&emsp;is reclaimed and the page is compacted if necessary.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2


---

<a id="page-3"></a>
**Page 3**

CS186 class account:

&emsp;**B.** Consider relations R and S, with sizes \|R\| = N and \|S\| = M respectively, and N \> M. Both<br>
relations have a primary key sid. Also consider the following table definitions:<br>
&emsp;&emsp;&emsp;`CREATE` `TABLE` `A` `AS` `SELECT` `*` `FROM` `R` `INNER` `JOIN` `S` `ON` `R.sid=S.sid;`

&emsp;&emsp;&emsp;`CREATE` `TABLE` `B` `AS` `SELECT` `*` `FROM` `R` `LEFT` `OUTER` `JOIN` `S` `ON` `R.sid=S.sid;`

&emsp;&emsp;&emsp;`CREATE` `TABLE` `C` `AS` `SELECT` `*` `FROM` `R` `RIGHT` `OUTER` `JOIN` `S` `ON` `R.sid=S.sid;`

&emsp;&emsp;&emsp;`CREATE` `TABLE` `D` `AS` `SELECT` `*` `FROM` `R` `FULL` `OUTER` `JOIN` `S` `ON` `R.sid=S.sid;`<br>
&emsp;Tick the correct TRUE/FALSE boxes for each of the following statements.   **TRUE**   **FALSE**

&emsp;12\. \|A\| \< \|B\| \< \|C\| \< \|D\|<br>
&emsp;13\. M ≤\|A\| ≤N<br>
&emsp;14\. \|B\| = N<br>
&emsp;15\. \|D\| = M

&emsp;**C.** Consider the Elevator Algorithm with the following parameters:<br>
&emsp;• Seek time formula: 1 + X/1000 ms, where X is the number of cylinders traversed in transit;<br>
&emsp;• Average rotational delay is 4.75ms and the constant transfer time is 0.25ms.<br>
&emsp;We start at cylinder 0 and receive the following requests:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Request Name   Request (cylinder)   Time request arrives (ms)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;A   5000   0<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;B   4000   8<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;C   3000   9<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;D   9000   9<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;E   8000   20

&emsp;Tick the correct TRUE/FALSE boxes for each of the following statements on the relative order of<br>
processing times for the above requests.   **TRUE**   **FALSE**<br>
&emsp;16\. C before D<br>
&emsp;17\. C before B<br>
&emsp;18\. D before E<br>
&emsp;19\. D before B<br>
&emsp;20\. Request D begins transferring data at 18.75 ms.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3


---

<a id="page-4"></a>
**Page 4**

CS186 class account:


### **Question 2.**\[Buffer Management\]   Maximum points: 16.

&emsp;Consider a buffer manager that has a buffer pool large enough to hold 3 pages, and consider a file<br>
of 20 pages. Assume that the buffer pool is initially empty.<br>
&emsp;1\. Is there a sequence of pin and unpin requests on at least 8 distinct pages such that the state of the<br>
&emsp;&emsp;buffer after completion of the sequence of requests is the same for all three replacement strategies<br>
&emsp;&emsp;CLOCK, LRU (Least Recently Used), FIFO (First In First Out)? If yes, write down the sequence<br>
&emsp;&emsp;(e.g., pin 1 unpin 1, pin 2, and so on), otherwise explain why not.   (8 points)

Your request sequence is:

&emsp;2\. Give a sequence of pin and unpin requests such that the number of disk accesses is different for<br>
&emsp;&emsp;LRU and FIFO. For each policy, show the state of the buffer pool after each request.   (8 points)

Your request sequence is:

&emsp;&emsp;Show the state of the buffer pool (i.e., state all its pages, its pinned pages, which page is at the<br>
&emsp;&emsp;head of the eviction queue) after requests in the following table:

&emsp;&emsp;Requests   FIFO   LRU

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4


---

<a id="page-5"></a>
**Page 5**

CS186 class account:


### **Question 3.**\[B+-tree Indexing\]   Maximum points: 18.

&emsp;Consider a B+-tree of order 2 that is designed to index integer values. The index is initially empty (it<br>
holds no index entries). Assume that on overflow, you always split, and that on underflow, you always<br>
choose redistribution over merging if both options are available.<br>
&emsp;The sequence of integers 1 to 20 is first inserted into the B+-tree and then all the prime numbers are<br>
deleted from the B+-tree (from largest to smallest).<br>
&emsp;1\. Draw the resulting B+-tree after inserting 1 to 20. If you only show the index after some of the<br>
insertions, then please indicate exactly which integers in the sequence 1 to 20 you inserted. (10 points)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;5


---

<a id="page-6"></a>
**Page 6**

CS186 class account:

&emsp;2\. Draw the resulting B+-tree after deleting 19, 17, 13, 11, 7, 5, 3, and 2. If you did not complete the<br>
previous task, then start with any B+-tree index of order 2 with keys 1 to 20 at leaves. Indicate your<br>
initial B+-tree for this task. Also, if you only show the index after some of the deletions, then please<br>
indicate which integers in the given sequence are deleted from your final index.   (8 points)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;6


---

<a id="page-7"></a>
**Page 7**

CS186 class account:


### **Question 4.**\[Hash-based Indexing\]   Maximum points: 16.

&emsp;Consider a hash index that uses the hash function h(x) = x and in which each hash bucket can hold<br>
two data items. The index is initially empty (it holds no index entries) but consists of four buckets, and<br>
it initially uses the last two bits of the hash value h(x). Consider the following sequence of insertions:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;79 = 1 0 0 1 1 1 12<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;95 = 1 0 1 1 1 1 12<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;40 = 0 1 0 1 0 0 02<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;16 = 0 0 1 0 0 0 02<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;31 = 0 0 1 1 1 1 12<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;47 = 0 1 0 1 1 1 12<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;32 = 0 1 0 0 0 0 02<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;56 = 0 1 1 1 0 0 02<br>
&emsp;1\. Consider that the index uses extendible hashing. Show the final state of the index after the<br>
insertions, including the directory, bucket entries, global and local depths in your diagram. If you only<br>
show the index after some of the insertions in the above sequence, then please state so. Assume that no<br>
overflow chains are allowed (so keep splitting until they are gone).   (8 points)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;7


---

<a id="page-8"></a>
**Page 8**

CS186 class account:

&emsp;2\. Now consider that the index uses linear hashing. Initially, the “next” pointer points to the first<br>
bucket. A bucket split is triggered whenever an overflow page is created. Show the final state of the<br>
index after the insertions, including the bucket entries, index level, and the “next” pointer. If you only<br>
show the index after some of the insertions in the above sequence, then please state so.   (8 points)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;8


---

<a id="page-9"></a>
**Page 9**

CS186 class account:


### **Question 5.**\[Query Languages\]   Maximum points: 30.

&emsp;Consider the following relational database with information about applications, developers, and users<br>
(relation keys are underlined, types and column constraints are inlined in the definitions of relations):

&emsp;`Apps(aid` `(int),` `did` `(int)` `foreign` `key` `reference` `Developer,`<br>
&emsp;&emsp;&emsp;`name` `(text),` `released` `(date))`<br>
&emsp;`Developers(did` `(int),` `name` `(text),` `city` `(text))`<br>
&emsp;`Users(uid` `(int),` `name` `(text),` `joined` `(date),` `city` `(text),` `device` `(text))`<br>
&emsp;`AppUsers(uid` `(int)` `foreign` `key` `references` `Users,`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`aid` `(int)` `foreign` `key` `references` `Apps,` `downloaded` `(date))`<br>
&emsp;Express each of the following natural language query in SQL and RA (relational algebra). Follow<br>
the exact notation that was specified for the Query Languages Homework.<br>
&emsp;1\. Find the names of Developers who have created at least an App that has at least a User from<br>
London.   (6 points)

SQL:

RA:

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;9


---

<a id="page-10"></a>
**Page 10**

CS186 class account:

&emsp;2\. Find the names of Developers with the most used Apps.   (6 points)

SQL:

RA:

&emsp;3\. How many Users have downloaded an App within a week of its release? Assume that the `date` type<br>
is closed under basic arithmetic operations and comparisons, in which days have the finest granularity.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;(6 points)

SQL:

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;10


---

<a id="page-11"></a>
**Page 11**

CS186 class account:

RA:

&emsp;4\. Return the cities with the most number of Users.   (6 points)

SQL:

RA:

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;11


---

<a id="page-12"></a>
**Page 12**

CS186 class account:

&emsp;5\. How many developers are listed as users of their own application? (You may assume that names<br>
are unique.)   (6 points)

SQL:

RA:

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**End of Exam Paper.**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;12


---

<a id="page-13"></a>
**Page 13**

CS186 class account:

&emsp;**Extra Page for Scratch Work (to be discarded and not graded)**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;13


---

<a id="page-14"></a>
**Page 14**

CS186 class account:

&emsp;**Extra Page for Scratch Work (to be discarded and not graded)**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;14


---

<a id="page-15"></a>
**Page 15**

CS186 class account:

&emsp;**Extra Page for Scratch Work (to be discarded and not graded)**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;15

