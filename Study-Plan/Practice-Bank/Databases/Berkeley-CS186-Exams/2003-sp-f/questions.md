# Berkeley CS186 Spring 2003: Final: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/186>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**


![Figure on page 1](figures/questions-p01-fig01.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Name \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Class Account \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;UNIVERISTY OF CALIFORNIA, BERKELEY<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;College of Engineering<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Department of EECS, Computer Science Division<br>
CS186   J. Hellerstein<br>
Spring 2003   Final Exam

&emsp;&emsp;&emsp;&emsp;**Final Exam: Introduction to Database Systems**<br>
This exam has seven problems, each worth a different amount of points. Each problem is<br>
made up of multiple questions.  You should read through the exam quickly and plan your<br>
time-management accordingly.  Before beginning to answer a question, be sure to read it<br>
carefully and to answer all parts of every question!  Please **do not spend time**<br>
**explaining your answers unless we explicitly ask that you do so**.  We will not be<br>
giving extra or partial credit for explanations unless we ask for them.


![Figure on page 1](figures/questions-p01-fig02.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Good luck!

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1


---

<a id="page-2"></a>
**Page 2**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Name \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

1\. **Recovery \[20 points\]**<br>
&emsp;In this question we explore the interplay between buffer management and<br>
&emsp;recovery.  We present four scenarios below.  For each scenario, you must follow<br>
&emsp;the following guidelines:<br>
&emsp;— Choose a maximally **efficient** protocol!<br>
&emsp;— Among all protocols with the same level of efficiency, choose the **simplest**.

&emsp;Each scenario corresponds to exactly one of the four quadrants in the chart at the<br>
&emsp;bottom of the page.  **Place the letter of each scenario (a, b, c, d) in the**<br>
&emsp;**appropriate quadrant.**  Note that while each letter goes in only one quadrant, it<br>
&emsp;is possible that some quadrants will have more or less than one letter in them!  **\[5**<br>
&emsp;**points each\]**

&emsp;&emsp;a. **Scenario: Traditional ARIES.**  You have been told to implement the<br>
&emsp;&emsp;&emsp;ARIES recovery protocol as discussed in class.<br>
&emsp;&emsp;b. **Scenario: Buffer Pool Bigger than Database.**  Modern servers ship with<br>
&emsp;&emsp;&emsp;as much as 32GB of RAM.  Hence for many customers, their databases<br>
&emsp;&emsp;&emsp;will never be larger than available RAM.  You have a startup company<br>
&emsp;&emsp;&emsp;that is designing a special-purpose DBMS for these customers.<br>
&emsp;&emsp;c. **Scenario: Before-Image Logging.**  In order to keep your logs more<br>
&emsp;&emsp;&emsp;compact, you store only the “before-image” of the data in update log<br>
&emsp;&emsp;&emsp;records, and not the “after-image”.  (Recall that the before-image has the<br>
&emsp;&emsp;&emsp;state of the page before the update; the after-image would have also shown<br>
&emsp;&emsp;&emsp;the state of the page after the update.)<br>
&emsp;&emsp;d. **Scenario: Untrusted Buffer Manager.**  No matter how many times you<br>
&emsp;&emsp;&emsp;explain it, the engineers implementing the buffer manager cannot<br>
&emsp;&emsp;&emsp;understand the log manager.  So you’re going to have to choose a protocol<br>
&emsp;&emsp;&emsp;that can handle any mix of page replacement decisions.


![Figure on page 2](figures/questions-p02-fig03.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Force

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;No Force

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2


---

<a id="page-3"></a>
**Page 3**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Name \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

&emsp;2\. **ARIES \[20 points\]**<br>
&emsp;&emsp;Consider the following log where the DPT represents the Dirty Page Table and<br>
&emsp;&emsp;TT represents the Transaction Table


![Figure on page 3](figures/questions-p03-fig04.png)

&emsp;&emsp;Answer the following questions:<br>
&emsp;&emsp;a. What is the smallest LSN accessed during the Analysis phase.  **\[2 points\]**

&emsp;&emsp;b. Fill in the contents of the **Dirty Page Table** and the **Transaction Table** at the<br>
&emsp;&emsp;&emsp;end of the Analysis phase.  (you may not need all the space we give you) **\[10**<br>
&emsp;&emsp;&emsp;**points\]**


![Figure on page 3](figures/questions-p03-fig05.png)


![Figure on page 3](figures/questions-p03-fig06.png)

&emsp;&emsp;c. At which LSN does the Redo phase begin?  **\[2 points\]**

&emsp;&emsp;d. What entries (specify only LSNs) do get undone as part of the Undo phase? **\[6**<br>
&emsp;&emsp;&emsp;**points\]**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3


---

<a id="page-4"></a>
**Page 4**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Name \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

3\. **Functional Dependencies and Normalization  \[20 points\]**<br>
&emsp;Consider the relation schema R = (A, B, C, D, E, F) and the set of functional<br>
&emsp;dependencies F: **A-\>B, A-\>C, BC-\>E,  BC-\>D, E-\>F, BC-\>F**

&emsp;Note that in all the following, you will never have to compute F+, the closure of<br>
&emsp;F!<br>
&emsp;&emsp;a. List the minimal candidate key(s) for R.  Write ‘none’ if you think there<br>
&emsp;&emsp;&emsp;are no candidate keys. **\[2 points\]**

&emsp;&emsp;b. List the FDs in F that violate BCNF. (Hint: There are four) **\[4 points\]**

&emsp;&emsp;c. Is R in 3NF (yes or no)? **\[2 points\]**

&emsp;&emsp;d. Is F a minimal cover?  **\[2 points\]**

&emsp;&emsp;&emsp;(continued)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4


---

<a id="page-5"></a>
**Page 5**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Name \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

e. Suppose we decompose R into the following tables:<br>
&emsp;R1 = (B, C, E)<br>
&emsp;R2 = (B, C, F)<br>
&emsp;R3 = (B, C, D) and<br>
&emsp;R4 = (A, B, C).<br>
&emsp;This decomposed schema is indeed in BCNF (you can trust us on this!)

&emsp;Unfortunately, this decomposition is not dependency-preserving; in<br>
&emsp;particular, the dependency E-\>F cannot be checked on a single table. A<br>
&emsp;CHECK ASSERTION can be used to enforce E-\>F.

&emsp;Complete the following SQL statement for this particular CHECK<br>
&emsp;ASSERTION needed to guarantee E-\>F. **\[8 points\]**

&emsp;CREATE ASSERTION checkDep<br>
&emsp;CHECK ( NOT EXISTS<br>
&emsp;( SELECT \* FROM  R1, R2

&emsp;WHERE \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

&emsp;GROUP BY \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

&emsp;HAVING COUNT(\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_)\_\_\_\_\_\_\_\_\_\_))

f. Why might the ASSERTION in (e) be expensive? **\[2 points\]**<br>
&emsp;&emsp;i. Updates to R1 and R2 are frequent<br>
&emsp;&emsp;ii. Inserts to R1 and R2 are frequent<br>
&emsp;&emsp;iii. Insertions to R2 are frequent; R1 rarely changes.<br>
&emsp;&emsp;iv. Reads to R1 and R2 are frequent<br>
&emsp;&emsp;v. (i) and (ii)<br>
&emsp;&emsp;vi. (i), (ii), (iii)<br>
&emsp;&emsp;vii. All of the above

&emsp;&emsp;&emsp;Answer (choose one):  \_\_\_\_\_\_\_\_\_\_\_

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;5


---

<a id="page-6"></a>
**Page 6**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Name \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

4\. **Database Tuning  \[14 points\]**<br>
&emsp;Consider the following BCNF relational

&emsp;Apartment (aid, capacity)<br>
&emsp;GraduateStudent (SID, age, sex, dept, GPA, aid)

&emsp;— GraduateStudent.aid is a foreign key referencing Apartment.<br>
&emsp;— There are very few “single” apartments (i.e. where capacity=1)<br>
&emsp;— 50% of the Graduate Students are males.

&emsp;&emsp;a. You are told that the following three queries are the most common. For<br>
&emsp;&emsp;&emsp;each of these queries, we have listed three different indexes as possible<br>
&emsp;&emsp;&emsp;access methods. Pick the access method that would benefit the query **most**<br>
&emsp;&emsp;&emsp;in terms of I/O performance. Assume that these queries occur much more<br>
&emsp;&emsp;&emsp;frequently than updates.  **\[3 points each\]**

&emsp;&emsp;&emsp;Query 1: List aids of apartments with capacity=1<br>
&emsp;&emsp;&emsp;&emsp;&emsp;i. Clustered B+Tree index for Apartment on aid field<br>
&emsp;&emsp;&emsp;&emsp;&emsp;ii. Unclustered B+Tree index for Apartment on capacity field<br>
&emsp;&emsp;&emsp;&emsp;iii. Clustered B+Tree index for Apartment on capacity field.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Answer (choose one):  \_\_\_\_\_\_\_\_\_\_\_

&emsp;&emsp;&emsp;Query 2: List SIDs of male graduate students<br>
&emsp;&emsp;&emsp;&emsp;&emsp;i. No indexes.  Use a file scan on GraduateStudent.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;ii. Unclustered B+Tree index for GraduateStudent on sex<br>
&emsp;&emsp;&emsp;&emsp;iii. Clustered B+Tree index for GraduateStudent on SID

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Answer (choose one):  \_\_\_\_\_\_\_\_\_\_\_

&emsp;&emsp;&emsp;Query 3: List depts of graduate students staying in apartment aid=4.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;i. Clustered B+Tree index for GraduateStudent on aid<br>
&emsp;&emsp;&emsp;&emsp;&emsp;ii. No indexes. Use a file scan on GraduateStudent table.<br>
&emsp;&emsp;&emsp;&emsp;iii. Unclustered B+Tree index for GraduateStudent on \<aid, dept\>

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Answer (choose one):  \_\_\_\_\_\_\_\_\_\_\_

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;continued

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;6


---

<a id="page-7"></a>
**Page 7**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Name \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

b. The database is still running very slowly even after you recommended the<br>
&emsp;right indexes in part (a)! A careful workload study reveals that in practice,<br>
&emsp;the following two transactions are extremely frequent (far more than any<br>
&emsp;other queries or updates):

&emsp;\- **T1:** Find the average age of all graduate students group by aid<br>
&emsp;\- **T2:** Update the GPA of graduate student g (the value of g may be<br>
&emsp;different each time T2 is run)

&emsp;Traces show that the above two queries resulted in concurrency control<br>
&emsp;bottlenecks, due to lock contention on the GraduateStudent table. Tuple<br>
&emsp;granularity locks are obtained.

&emsp;The following solutions have been proposed to alleviate the problem.<br>
&emsp;Choose the **single** letter that gives the most correct options; if no correct<br>
&emsp;options are listed, choose (ix).  **\[5 points\]**<br>
&emsp;i. Vertically partition (i.e. decompose) the GraduateStudent table into<br>
&emsp;&emsp;two separate tables such that (SID,age,aid) is in one table, and (SID,<br>
&emsp;&emsp;sex, dept, GPA) is in another.<br>
&emsp;ii. Horizontally partition the GraduateStudent table according to aid field.<br>
&emsp;&emsp;Graduate Students who stay in even numbered apartments are stored in<br>
&emsp;&emsp;a different table from those that are odd numbered.<br>
&emsp;iii. Make use of page granularity locks<br>
&emsp;iv. Use non-strict two-phase locking (2PL)<br>
&emsp;v. Create an unclustered B+Tree index for GraduateStudent on \<aid,<br>
&emsp;&emsp;age\><br>
&emsp;vi. Either (i) or (ii) would work<br>
vii. Either (i) or (v) would work<br>
viii. Either (iii) or (iv) would work<br>
&emsp;ix. None of the above.

&emsp;&emsp;Answer (choose one):  \_\_\_\_\_\_\_\_\_\_\_

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;7


---

<a id="page-8"></a>
**Page 8**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Name \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

**5. Query Optimization  \[15 points\]**<br>
Consider the following relational schema and SQL query:<br>
Student (SID, DID, Enroll\_Year, Nationality)<br>
Department (DID, Name, Building\_Num, Telephone, FID)<br>
Finance (FID, Budget, Expenses, …)

SELECT D.Name, F.Budget<br>
FROM Student S, Department D, Finance F<br>
WHERE S.DID = D.DID and D.FID = F.FID AND<br>
D.Building\_Num \> 5 AND D.Building\_Num \<=10 AND<br>
&emsp;S.Enroll\_Year = 2000 OR S.Enroll\_Year = 2001;

Here are some statistics:<br>
— Building Numbers range from 1 to 20 inclusive (i.e. 1 and 20 are both valid numbers).<br>
— Each building has the same number of departments<br>
— Students’ enrollment year (Student.Enroll\_Year) ranges from 1997 to 2002, and is<br>
distributed according to the following table:


![Figure on page 8](figures/questions-p08-fig07.png)

— Number of Tuples (pages) per relation:<br>
\- Student: 20000 (2000 pages)<br>
\- Department: 100 (10 pages)<br>
\- Finance: 100 (10 pages)

(continued)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;8


---

<a id="page-9"></a>
**Page 9**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Name \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

a) Consider the following query plan.  Each of the leaf nodes is a sequential scan.  Each<br>
&emsp;of the joins is a naïve nested loops join.  In the **three dotted boxes**, write down the<br>
&emsp;expected number of tuples generated by the subtree below the associated tree edge.<br>
&emsp;In the **two dotted ovals,** write down the expected number of I/Os performed by the<br>
&emsp;associated join.  (You can assume that projections are done as early as possible.)  **\[12**<br>
&emsp;**points\]**


![Figure on page 9](figures/questions-p09-fig08.png)

b) Would a query optimizer like the one we studied in class choose the following plan?<br>
&emsp;(Again, assume that projections are done as early as possible.)  **Briefly** explain your<br>
&emsp;answer! **\[3 points\]**


![Figure on page 9](figures/questions-p09-fig09.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;9


---

<a id="page-10"></a>
**Page 10**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Name \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

**6. Concurrency control  \[16 points\]**<br>
&emsp;a) Consider the following modified definition of serializability:<br>
&emsp;&emsp;&emsp;A schedule S is serializable iff it produces the same database state as a serial<br>
&emsp;&emsp;&emsp;schedule T, where the transactions in T are exactly those in S, and are ordered<br>
&emsp;&emsp;&emsp;in T according to their first appearance in S.<br>
&emsp;&emsp;&emsp;Is this definition:    **\[3 points\]**<br>
&emsp;&emsp;i.    Correct?<br>
&emsp;&emsp;ii.     Overly restrictive: i.e. there are some serializable schedules not covered by<br>
&emsp;&emsp;&emsp;&emsp;this definition?<br>
&emsp;&emsp;iii.     Overly permissive: i.e. there are some unserializable schedules that are<br>
&emsp;&emsp;&emsp;&emsp;covered by this definition?<br>
&emsp;&emsp;iv.     (ii) and (iii)

&emsp;&emsp;&emsp;&emsp;Answer (choose one):  \_\_\_\_\_\_\_\_\_\_\_

&emsp;b) Bob and Anne share a bank account for their business.  Today they went to the<br>
&emsp;&emsp;&emsp;bank at the same time.  Draw the dependency graph for the schedule below.<br>
&emsp;&emsp;&emsp;You do not need to label any edges in the graph.  **\[3 points\]**<br>
T\_Bob   T\_Anne


![Figure on page 10](figures/questions-p10-fig10.png)


![Figure on page 10](figures/questions-p10-fig11.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;10


---

<a id="page-11"></a>
**Page 11**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Name \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

c) Is the schedule in (b) conflict serializable?  If so, give an equivalent serial<br>
&emsp;schedule.  If not, enumerate all the serial schedules, and explain how Bob and<br>
&emsp;Anne’s experience would be changed in each.  **\[5 points\]**

d) Suppose that the database system at the bank implemented strict 2-phase locking<br>
&emsp;as we studied in class.  Assume that Bob and Anne’s requests for actions arrive<br>
&emsp;in the same order as in (b), but if either of them is blocked while waiting for a<br>
&emsp;lock, their actions stop arriving until they acquire the lock (after which time they<br>
&emsp;continue as fast as they can).  Describe what happens in that scenario: a few<br>
&emsp;words should suffice.  **\[5 points\]**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;11


---

<a id="page-12"></a>
**Page 12**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Name \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

7\. **Sorting and Hashing  \[12 points\]**<br>
&emsp;Consider the following query:

&emsp;SELECT g, COUNT(\*) FROM T GROUP BY g

&emsp;Assume that table T is of size N disk blocks, and the buffer pool has (B+1) frames<br>
&emsp;available for this grouping operation.

&emsp;**NOTE:** We assume that ÷N is a little **more** than B+1.  (Think about this!)

&emsp;We will consider both hash-based and sort-based implementations of grouping.  For<br>
&emsp;hash-based grouping, we will use the scheme you implemented for homework 2.  For<br>
&emsp;sort-based grouping, we will use the scheme described in class, with **heapsort** (also<br>
&emsp;known as **tournament sort**) as our in-memory sorting algorithm.

&emsp;Note that we are **not** writing out the final result of sorting or hashing, but we **do**<br>
&emsp;include the cost of initially scanning table T!!

&emsp;For each technique in the table below, write down the letter of the correct cost<br>
&emsp;solution (a – f).  Each technique has exactly one matching cost, but a given solution<br>
&emsp;may appear 0, 1 or many times in the table.  **\[3 points each\]**

&emsp;Possible solutions include the following costs:<br>
&emsp;a) N I/Os<br>
&emsp;b) 3N I/Os<br>
&emsp;c) 5N I/Os<br>
&emsp;d) 6N I/Os<br>
&emsp;e) 7N I/Os<br>
&emsp;f)    B I/Os


![Figure on page 12](figures/questions-p12-fig12.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;12


---

<a id="page-13"></a>
**Page 13**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Name \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

**SCRATCH**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;13


---

<a id="page-14"></a>
**Page 14**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Name \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

**SCRATCH**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;14

