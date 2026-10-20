# Berkeley CS186 Spring 2008: Midterm 1: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/186>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Class Account: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;UNIVERSITY OF CALIFORNIA<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Department of EECS, Computer Science Division<br>
CS186<br>
Bohannon/Cooper<br>
Spring 2008<br>
&emsp;&emsp;&emsp;&emsp;**First Exam: Introduction to Database Systems**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**February 26, 2008**<br>
**Instructions:**<br>
&emsp;1\. Write your name on each page.<br>
&emsp;2\. Turn in your notes page with your test.<br>
&emsp;3\. There are 100 points total.<br>
&emsp;4\. Please read over the test and plan your time.  Best to skip and go<br>
&emsp;&emsp;back if you are stuck on a question.

**Entity Relationship Graphs (14 pts)**

You have just been hired as a consultant for a big airplane manufacturer.<br>
Impressed by your background in databases, they want you to<br>
completely redesign their database system. Talking with the people in<br>
the company, you get the following information.<br>
&emsp;•   The database contains information about employees, factories and<br>
&emsp;&emsp;parts.<br>
&emsp;•   Each employee has a social security number (SSN), name and<br>
&emsp;&emsp;salary. An employee is uniquely identified by his or her SSN.<br>
&emsp;•   Each factory has an id, name and a budget. The id uniquely<br>
&emsp;&emsp;identifies a project.<br>
&emsp;•   Each part has an id and a name. The id uniquely identifies a part.<br>
&emsp;•   Each employee reports to at most one other employee.<br>
&emsp;•   Each employee works in at least one factory.<br>
&emsp;•   Each part is manufactured in exactly one factory. Each part is a<br>
&emsp;&emsp;component of zero or more other parts.<br>
A partial Entity-Relationship diagram for the above application is shown<br>
on the next page.<br>
&emsp;•   add attributes of **parts**


---

<a id="page-2"></a>
**Page 2**

2Name:\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

&emsp;•   add missing relationships<br>
&emsp;•   add keys of entity sets<br>
&emsp;•   capture key and participation constraints on relationships


---

<a id="page-3"></a>
**Page 3**

3Name:\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_


![Figure on page 3](figures/questions-p03-fig01.png)


![Figure on page 3](figures/questions-p03-fig02.png)


---

<a id="page-4"></a>
**Page 4**

4Name:\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

**File Organization and Structure (12 pts)**

&emsp;a) (6 pts) Consider a large table of students.  You need to build an index for<br>
&emsp;&emsp;the table that best suits a given workload.  Recall the 3 data entry<br>
&emsp;&emsp;alternatives for implementing an index, and the type of data structures<br>
&emsp;&emsp;that we have available<br>
&emsp;&emsp;&emsp;1\. If 95% of the workload is a query requesting several pieces of<br>
&emsp;&emsp;&emsp;&emsp;&emsp;information about students whose last name begins with a<br>
&emsp;&emsp;&emsp;&emsp;&emsp;particular letter, and 5% of the workload is adding a new student,<br>
&emsp;&emsp;&emsp;&emsp;&emsp;but the additions only occur on Saturday. what storage option is<br>
&emsp;&emsp;&emsp;&emsp;&emsp;appropriate for ‘Students’.

&emsp;&emsp;&emsp;2\. If the percentage of the workload distribution is reversed and<br>
&emsp;&emsp;&emsp;&emsp;&emsp;additions could occur any time, would the storage option change?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Why?

&emsp;b) (6 pts) Operating systems provide default file system management.<br>
&emsp;&emsp;Name two features that DBMS systems require that are not provided by


---

<a id="page-5"></a>
**Page 5**

5Name:\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

&emsp;&emsp;the default OS mechanisms, and specify whether they are provided at<br>
&emsp;&emsp;the file-layer or record-layer.


---

<a id="page-6"></a>
**Page 6**

6Name:\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

**B+ Trees (12 pts)**<br>
This is an initial state of an index represented using a B+ tree.  In this<br>
tree, under-full nodes are refilled from adjacent nodes if possible,<br>
otherwise a merge is done.   Draw the B+ tree after the following<br>
operations have been completed. (Only the final B+ tree is needed but<br>
intermediate trees are needed for partial credit).  Also, there is no need<br>
to draw the entire tree, you need to only redraw the nodes that are<br>
affected (label unchanged nodes with same Nx labels used in the<br>
picture.)<br>
&emsp;a) Insert record 40\*<br>
&emsp;b) Delete record 7\*<br>
&emsp;c) Delete record 9\*<br>
&emsp;d) Delete record 15\*<br>
&emsp;e) Delete record 18\*


![Figure on page 6](figures/questions-p06-fig03.png)


---

<a id="page-7"></a>
**Page 7**

7Name:\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

(space for drawing B+Trees)


---

<a id="page-8"></a>
**Page 8**

8Name:\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

**Sorting (14 pts)**

Answer the following questions about external merge sorts.<br>
&emsp;a. (3 pts) Consider an external sort of a large file that does not fit in<br>
&emsp;&emsp;memory. What is the main impact of increasing the amount of<br>
&emsp;&emsp;memory available to the sort process?<br>
&emsp;i.   The sort will likely proceed faster because the sort will read less<br>
&emsp;&emsp;&emsp;data on each pass.<br>
&emsp;ii.   The sort will likely proceed faster because the sort will<br>
&emsp;&emsp;&emsp;potentially do fewer passes.<br>
&emsp;iii.   The speed of the sort will not be affected.<br>
&emsp;iv.   The sort will likely proceed slower because of the need to read<br>
&emsp;&emsp;&emsp;more data on each pass.<br>
ANSWER: \_\_\_\_\_\_\_<br>
&emsp;b. (3 pts) The primary benefit of double buffering is:<br>
&emsp;i.   The ability to sort two files at once.<br>
&emsp;ii.   The ability to merge two runs at once.<br>
&emsp;iii.   The ability to reduce the number of passes in the sort.<br>
&emsp;iv.   The ability to overlap computation and I/O.<br>
ANSWER: \_\_\_\_\_\_\_<br>
&emsp;c. (4 pts) After each pass (except pass 0) of a 2-way external merge<br>
&emsp;&emsp;sort, we have:<br>
&emsp;i.   Half as many runs of data as before the pass, but each run is<br>
&emsp;&emsp;&emsp;twice as large<br>
&emsp;ii.   Twice as many runs of data as before the pass, and each run is<br>
&emsp;&emsp;&emsp;the same size<br>
&emsp;iii.   The same number of runs of data as before the pass, and each<br>
&emsp;&emsp;&emsp;run is the same size<br>
&emsp;iv.   Half as many runs of data as before the pass, and each run is<br>
&emsp;&emsp;&emsp;half as large<br>
ANSWER: \_\_\_\_\_\_\_


---

<a id="page-9"></a>
**Page 9**

9Name:\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

&emsp;d.   (4 pts) Consider a system with 1 kilobyte pages. If we devote 1<br>
&emsp;&emsp;&emsp;gigabyte of memory space for input buffers, and we do not use<br>
&emsp;&emsp;&emsp;double buffering, what is the largest file we can sort in two<br>
&emsp;&emsp;&emsp;passes? (Remember 1 KB = 210 bytes, 1 MB = 220 bytes, 1 GB =<br>
&emsp;&emsp;&emsp;230 bytes, 1 TB = 240 bytes, and 1 PB = 250 bytes)<br>
&emsp;i.   1 GB<br>
&emsp;ii.   100 GB<br>
&emsp;iii.   1 TB<br>
&emsp;iv.   1 PB<br>
ANSWER: **\_\_\_\_\_\_\_**

**Relational Algebra**

Consider the following relations for a sales database for a chain of<br>
hardware stores:<br>
Products


![Figure on page 9](figures/questions-p09-fig04.png)

Stores


![Figure on page 9](figures/questions-p09-fig05.png)

Sales


![Figure on page 9](figures/questions-p09-fig06.png)


---

<a id="page-10"></a>
**Page 10**

10Name:\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_


![Figure on page 10](figures/questions-p10-fig07.png)

For the following queries, we have supplied some of the values for the<br>
results of the query. Fill in the missing values. Assume set semantics.<br>
a πNAME,QUANTITY (σCATEGORY=’Nails’ ( Products       Sales ) )   (4<br>
pts)


![Figure on page 10](figures/questions-p10-fig08.png)

b. πNAME,MANAGER,MSRP,PRICE (σMSRP\>PRICE( Products       Sales      Stores ) )   ( 5pts)


![Figure on page 10](figures/questions-p10-fig09.png)

c. πMANAGER ( ( πSTORE\_ID (Stores) - πSTORE\_ID (Sales) )       Stores )             (4 pts)


![Figure on page 10](figures/questions-p10-fig10.png)

d.    (5 pts)<br>
S1 = ρ (Sales1(DATE1, PRODUCT\_ID1, STORE\_ID1, QUANTITY1,<br>
PRICE1),Sales)<br>
S2 = ρ (Sales2(DATE2, PRODUCT\_ID2, STORE\_ID2, QUANTITY2,<br>
PRICE2),Sales)<br>
πPRODUCTID1,PRICE1,PRICE2 ( σDATE1 \<\> DATE2 ( σPRODUCT\_ID1=PRODUCT\_ID2 S1 × S2 ) )


![Figure on page 10](figures/questions-p10-fig11.png)


---

<a id="page-11"></a>
**Page 11**

11Name:\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_


![Figure on page 11](figures/questions-p11-fig12.png)

**Relational Calculus**

In this section, Assume there is an additional table, Manager, with a<br>
single attribute, NAME, and that there is foreign key constraint from<br>
Store.MANAGER to Manager.NAME.<br>
a.  (4 pts)<br>
Write a (tuple) Relational Calculus expression to return Sales tuples<br>
indicating that the Shady Lane, Austin store sold more than 50<br>
Hammers.  Your answer can use the values shown above to get<br>
PRODUCT\_ID and STORE\_ID and avoid joins.

b.  (4 pts)<br>
Complete the following expression to return managers that only manage<br>
stores in the “WEST” region

M \| M∈ Manager ∧ ∀\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

c.  (8 pts)<br>
Write a Relational Calculus expression to find managers whose stores all<br>
either 1) sold more than 1000 of some (single) “Nail” product on some<br>
day or 2) sold a power tool costing over $100.


---

<a id="page-12"></a>
**Page 12**

12Name:\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

**XML**


![Figure on page 12](figures/questions-p12-fig13.png)

a.  (4 pts)<br>
Provide the declaration of the **eco** tag in a DTD:

**eco**  **\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

b.  (4 pts)<br>
Write an XPath to give the name of species that live in the same region<br>
as a strictly vegetarian species.  (Hint: only types of food are “animal”<br>
and “vegetable”).


---

<a id="page-13"></a>
**Page 13**

13Name:\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

c. (6 pts)<br>
Complete the following XQuery that lists species that competes for food<br>
with an endangered species in a region.<br>
\<results\><br>
{<br>
for $r in doc/eco/region, $s  in $r/species<br>
where $s/eats/animal =<br>
$r/species\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_<br>
or $s/eats/vegetable =<br>
$r/species\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_<br>
return { $s/@name }<br>
}<br>
\</results\>

