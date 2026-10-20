# Berkeley CS186 Spring 2000: Final: Official solutions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/186>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;UNIVERSITY OF CALIFORNIA<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Department of EECS, Computer Science Division<br>
CS186    Final Exam<br>
May 16, 2000<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**Final Exam: Introduction to Database Systems**<br>
This exam has seven sections, each with one or more problems.  Each problem may be made up of multiple<br>
questions.  You should read through the exam quickly and plan your time-management accordingly.  Before<br>
beginning to answer a question, be sure to read it carefully and to answer all parts of every question!


![Figure on page 1](figures/solutions-p01-fig01.png)

REFERENCE DATABASE . This is the Reference Database referred to in some of the questions.<br>
&emsp;&emsp;There are six tables describing a company, describing employees, departments, buildings,  which<br>
&emsp;&emsp;department(s) an employee works in (and a percentage of the time for each),  department managers<br>
&emsp;&emsp;(possibly more than one per department), and in which building an employee works (an employee may<br>
&emsp;&emsp;have more than one office). The primary key of each table is the attribute(s) in capitals.  Other<br>
&emsp;&emsp;attributes are not necessarily unique.


![Figure on page 1](figures/solutions-p01-fig02.png)

&emsp;&emsp;&emsp;**EMP – 100,000 tuples, 1,000 pages**


![Figure on page 1](figures/solutions-p01-fig03.png)

&emsp;&emsp;&emsp;**EID** values range from 1 to 100,000<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**IN\_BUILDING – 110.000 tuples, 550 pages**


![Figure on page 1](figures/solutions-p01-fig04.png)

&emsp;&emsp;&emsp;**BUILDING – 2,000 tuples, 10 pages**


![Figure on page 1](figures/solutions-p01-fig05.png)

&emsp;&emsp;&emsp;**BID** values range from 1 to 2,000

&emsp;&emsp;&emsp;&emsp;**DEPT – 1,000 tuples, 5 pages**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**MANAGES\_DEPT – 800 tuples, 4 pages**


![Figure on page 1](figures/solutions-p01-fig06.png)


![Figure on page 1](figures/solutions-p01-fig07.png)

&emsp;&emsp;&emsp;**DID** values range from 1 to 1000


---

<a id="page-2"></a>
**Page 2**

**Name\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_      Login\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

I. **SQL** – All queries are based on the sample schema shown on the first page.  Assume<br>
&emsp;that the tables have many more rows than are shown there.  15 Points.<br>
&emsp;1\. Which of the following queries finds the names of buildings where more than 50 employees work?<br>
&emsp;&emsp;**(Circle as many as are correct.) (5 points)**<br>
&emsp;&emsp;&emsp;a.    SELECT Bname<br>
&emsp;&emsp;&emsp;&emsp;FROM IN\_BUILDING<br>
&emsp;&emsp;&emsp;&emsp;GROUP\_BY BID<br>
&emsp;&emsp;&emsp;&emsp;WHERE Count(\*) \> 50


![Figure on page 2](figures/solutions-p02-fig08.png)

&emsp;&emsp;&emsp;c.    SELECT Bname<br>
&emsp;&emsp;&emsp;&emsp;FROM Building B, In\_Building I<br>
&emsp;&emsp;&emsp;&emsp;WHERE B.BID = I.BID<br>
&emsp;&emsp;&emsp;&emsp;GROUP BY B.BID<br>
&emsp;&emsp;&emsp;&emsp;HAVING Count(\*) \> 50


![Figure on page 2](figures/solutions-p02-fig09.png)

&emsp;2\. Which of the following queries finds the name of Departments where no employees work?  **(Circle**<br>
&emsp;&emsp;**as many as are correct.) (5 points)**<br>
&emsp;&emsp;&emsp;a.    SELECT Dname<br>
&emsp;&emsp;&emsp;&emsp;FROM Dept<br>
&emsp;&emsp;&emsp;&emsp;WHERE DID IN (SELECT I.DID FROM In\_Dept I<br>
&emsp;&emsp;&emsp;&emsp;GROUP BY I.DID HAVING COUNT(\*) = 0)<br>
&emsp;&emsp;&emsp;b. SELECT Dname<br>
&emsp;&emsp;&emsp;&emsp;FROM Dept D, In\_Dept I, Emp E<br>
&emsp;&emsp;&emsp;&emsp;WHERE I.EID = E.EID and D.DID = I.DID and Count(E.EID) = 0


![Figure on page 2](figures/solutions-p02-fig10.png)

&emsp;&emsp;&emsp;e.    None of the above

CS186 March 6  Midterm    Page 2<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Points for this page: \_\_\_\_\_\_\_\_\_\_\_


---

<a id="page-3"></a>
**Page 3**

**Name\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_      Login\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

Which of the following queries finds the name of the Department(s) where the highest paid employee<br>
works?  **(Circle as many as are correct.) (5 points)**<br>
&emsp;&emsp;f.    SELECT D.Dname<br>
&emsp;&emsp;&emsp;FROM Dept D<br>
&emsp;&emsp;&emsp;WHERE D.DID IN (SELECT T.DID, MAX(Salary) FROM Dept T, In\_Dept I, Emp E<br>
&emsp;&emsp;&emsp;WHERE T.DID = I.DID and E.EID = I.EID)<br>
&emsp;&emsp;g. SELECT Dname<br>
&emsp;&emsp;&emsp;FROM Dept D, In\_Dept I, Emp E<br>
&emsp;&emsp;&emsp;WHERE D.DID = I.DID and E.EID = I.EID and E.Salary = MAX(Salary)


![Figure on page 3](figures/solutions-p03-fig11.png)

&emsp;&emsp;**j.**    None of the above

CS186 March 6  Midterm    Page 3<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Points for this page: \_\_\_\_\_\_\_\_\_\_\_


---

<a id="page-4"></a>
**Page 4**

**Name\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_      Login\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

**Implementation of Relational Operators – 18 points**<br>
Consider the schema on the first page, and the number of tuples and pages for each<br>
relation shown there.  Let “×” be the join operator, and “A×B” means join with A as the<br>
outer relation and B as the inner.<br>
As we did in class, when computing the cost for join algorithms, you may ignore output<br>
cost (since this is the same for all algorithms).<br>
**Note**: you have 9 pages of main memory to work with in these problems.

&emsp;1\. Consider the operation: σ **(EID \< 5000)EMP** (2 points)<br>
&emsp;&emsp;&emsp;a) What is the I/O cost of this operation?**1000**<br>
&emsp;&emsp;&emsp;b) What is the reduction factor? **0.05 = 1/20**

&emsp;**2.** Consider the join: **In\_Dept** × **Dept**  (4 points)<br>
&emsp;&emsp;&emsp;a) What is the I/O cost of  this using Blocked Nested Loops?  \_\_\_\_<br>
&emsp;&emsp;&emsp;**945 = 550 + Ceiling(550/7)\*5**<br>
&emsp;&emsp;&emsp;b) What is the I/O cost of this using Index Nested Loops, with a Hash index on Dept.DID?<br>
&emsp;&emsp;&emsp;**242,550 = 550 + 110,000 \* 2.2**<br>
&emsp;**3.** Consider the join: **Dept** × **In\_Dept** (4 points)<br>
&emsp;&emsp;&emsp;**a)** What is the I/O cost of this using Blocked Nested Loops?<br>
&emsp;&emsp;&emsp;**555 = 5 + Ceiling(5/7)\*550**<br>
&emsp;&emsp;&emsp;**b)** What is the I/O cost of this using Index Nested Loops, with a Hash index on<br>
&emsp;&emsp;&emsp;&emsp;&emsp;In\_Dept.DID?   **I accepted both:**<br>
&emsp;&emsp;&emsp;**2205 = 5 + 1000\*2.2**<br>
&emsp;&emsp;&emsp;**242,005 = 5 + 1000 \* 2.2 \* 110  (the approx #matches is 110)**<br>
&emsp;**4.** Consider the join**: EMP** × **In\_Building (**8 points)<br>
&emsp;&emsp;&emsp;**a)** What is the I/O cost of this using Blocked Nested Loops?<br>
&emsp;&emsp;&emsp;**79650 = 1000 + Ceiling(1000/7)\*550**<br>
&emsp;&emsp;&emsp;**b)** What is the I/O cost to sort EMP?<br>
&emsp;&emsp;&emsp;**8000 = 2\*1000(Ceiling(Log8(1000/9)) + 1)**<br>
&emsp;&emsp;&emsp;**c)** What is the I/O cost to sort In\_Building?<br>
&emsp;&emsp;&emsp;**3300 = 2\*550(Ceiling(Log8(550/9)) + 1)**<br>
&emsp;&emsp;&emsp;**d)** What is the total I/O cost to do this using Sort/Merge join?<br>
&emsp;&emsp;&emsp;**12850 = 8000 + 3300 + 1000 + 550**

CS186 March 6  Midterm    Page 4<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Points for this page: \_\_\_\_\_\_\_\_\_\_\_


---

<a id="page-5"></a>
**Page 5**

**Name\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_      Login\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

&emsp;**II. Query Optimization – 13 points**<br>
Consider the schema shown on the first page and especially the number of tuples and<br>
pages for each relation.<br>
Consider the following query:<br>
&emsp;&emsp;Select  Bname<br>
&emsp;&emsp;From EMP E, Building B, In\_Building I<br>
&emsp;&emsp;Where E.EID \< 500 and E.EID = I.EID and B.BID = I.BID<br>
&emsp;1\. Write this query in relational algebra. (3 points)<br>
&emsp;Π **Bname** σ **(EID \< 500) (Emp** × **In\_Building** × **Building)**

&emsp;2\. If the database has an unclustered B-Tree index on EMP.EID, what is the best plan you can find to<br>
&emsp;&emsp;execute this query?  Do your work on the additional pages at the back of the exam, and show the<br>
&emsp;&emsp;query plan here, including the costs for each step and the total cost. (10 points)

&emsp;**This was graded such that I looked for a plan tree, computation of costs at each**<br>
&emsp;**step, and some consideration of reduction factors.**

CS186 March 6  Midterm    Page 5<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Points for this page: \_\_\_\_\_\_\_\_\_\_\_


---

<a id="page-6"></a>
**Page 6**

&emsp;**Name\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_      Login\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

**III. Normalization – 15 points**<br>
&emsp;Consider the follow attributes and functional dependencies:<br>
&emsp;A B C D E F H<br>
&emsp;A→ D<br>
&emsp;AE → H<br>
&emsp;DF → BC<br>
&emsp;E → C<br>
&emsp;H → E

&emsp;&emsp;&emsp;1\. List all keys (**not** superkeys): (3 points)

&emsp;**AEF**<br>
&emsp;**AFH**

&emsp;&emsp;&emsp;2\. Which of the following dependencies are implied by those above: (4 points)


![Figure on page 6](figures/solutions-p06-fig12.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;a.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;c.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;e.

&emsp;&emsp;&emsp;3\. Consider the decomposition into 4 relations: (AEH)  (ABCF)  (AD)  (CE).  Is this<br>
&emsp;&emsp;&emsp;&emsp;&emsp;decomposition in (circle all that apply): (4 points)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;a.    BCNF<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;b. 3NF<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;c.    1NF<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;d. None of the above

&emsp;&emsp;&emsp;4\. Consider the decomposition into 3 relations: (AD)  (EC)  (ABEFH).  Is this decomposition in<br>
&emsp;&emsp;&emsp;&emsp;&emsp;(circle all that apply): (4 points)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;a.    BCNF<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;b. 3NF<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;c.    1NF<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;d. None of the above

&emsp;CS186 March 6  Midterm    Page 6<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Points for this page: \_\_\_\_\_\_\_\_\_\_\_


---

<a id="page-7"></a>
**Page 7**

&emsp;**Name\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_      Login\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

**IV. Concurrency Control and Crash Recovery: LOCKING – 15 Points**<br>
&emsp;Locking is the most popular concurrency control technique implemented by commercial database<br>
&emsp;management systems.<br>
&emsp;&emsp;&emsp;1\. Consider a database that is read-only (i.e., no transactions change any data in the database,<br>
&emsp;&emsp;&emsp;&emsp;&emsp;data may be loaded into the database when the database is off-line).  Suppose serializability<br>
&emsp;&emsp;&emsp;&emsp;&emsp;needs to be supported.  Please circle all correct statements: (5 points)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;a.    No locking is necessary.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;b. Only read locks are necessary and they need to be held until end of transaction.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;c.    Only read locks are necessary but they can be released as soon as the read is<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;complete.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;d. Both read and write locks are necessary and locking must be done in two phases.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;e.    None of the above.<br>
&emsp;Consider the following database schema:<br>
&emsp;&emsp;&emsp;STUDENT(name, sid, gpa, level, dept)<br>
&emsp;&emsp;&emsp;Suppose the following two transactions are executed concurrently:<br>
&emsp;&emsp;&emsp;T1:    begin tran<br>
&emsp;&emsp;&emsp;update STUDENT set gpa = 4.0 where dept = 'CS'<br>
&emsp;&emsp;commit tran<br>
&emsp;&emsp;&emsp;T2:    begin tran<br>
&emsp;&emsp;insert into STUDENT values ('Mihut', 101, 3.9, 4, 'CS')<br>
&emsp;&emsp;insert into STUDENT values ('Sirish', 102, 3.9, 3, 'CS')<br>
&emsp;&emsp;commit tran

&emsp;&emsp;&emsp;2\. Assume Mihut and Sirish were not in the STUDENT table before the start of T1 or T2.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Suppose read locks are released immediately after the read is done and write locks are held<br>
&emsp;&emsp;&emsp;&emsp;&emsp;until end of transaction.  Can it ever happen that after both T1 and T2 have committed, Mihut<br>
&emsp;&emsp;&emsp;&emsp;&emsp;and Sirish have different gpa values?  Please state your reasoning in support of your<br>
&emsp;&emsp;&emsp;&emsp;&emsp;conclusion.  If your answer depends on locking granularity, access methods or indexing,<br>
&emsp;&emsp;&emsp;&emsp;&emsp;please analyze the possibilities. (10 points)<br>
&emsp;&emsp;&emsp;**This was an example of the Phantom Problem.  If you only have row-level**<br>
&emsp;&emsp;&emsp;**locking, Mihut & Sirish may end up with different GPAs.  If you have table-level**<br>
&emsp;&emsp;&emsp;**locking, they will end up with the same GPA.**

&emsp;CS186 March 6  Midterm    Page 7<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Points for this page: \_\_\_\_\_\_\_\_\_\_\_


---

<a id="page-8"></a>
**Page 8**

**Name\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_      Login\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

&emsp;**Concurrency Control and Crash Recovery: WRITE-AHEAD LOGGING – 12**<br>
&emsp;**points**<br>
&emsp;Write-ahead logging is the most popular recovery technique.<br>
&emsp;&emsp;1\. Checkpoint is a technique that can reduce recovery time after a crash.  Please circle the correct<br>
&emsp;&emsp;&emsp;statements: (4 points)<br>
&emsp;&emsp;&emsp;a.    After a soft crash (which does not affect data on hard drives), the log only needs to be<br>
&emsp;&emsp;&emsp;&emsp;&emsp;scanned back until the last checkpoint is found.  The log beyond the last checkpoint will<br>
&emsp;&emsp;&emsp;&emsp;&emsp;not be read during the recovery process.<br>
&emsp;&emsp;&emsp;b. Once a checkpoint is done, the log can be truncated.<br>
&emsp;&emsp;&emsp;c.    Checkpoint is automatically performed after every transaction commit.<br>
&emsp;&emsp;&emsp;d. Checkpoints should be done after every update to the database.<br>
&emsp;&emsp;&emsp;e.    None of the above.<br>
&emsp;&emsp;2\. This question deals with when updated data pages (dirty pages) must be written to disk.<br>
&emsp;&emsp;&emsp;Please circle the correct statements: (4 points)<br>
&emsp;&emsp;&emsp;a.    Updated pages must be written to disk immediately after the update.<br>
&emsp;&emsp;&emsp;b. Dirty pages must be written to disk at transaction commit time but before the transaction<br>
&emsp;&emsp;&emsp;&emsp;&emsp;log is written to disk.<br>
&emsp;&emsp;&emsp;c.    Dirty pages must be written to disk at transaction commit time but after the transaction<br>
&emsp;&emsp;&emsp;&emsp;&emsp;log is written to disk.<br>
&emsp;&emsp;&emsp;d. A dirty page must be written to disk when it is replaced from the buffer pool.<br>
&emsp;&emsp;&emsp;e.    None of the above.<br>
&emsp;&emsp;3\. Since a database log can grow without limits, the log should be truncated at some point.<br>
&emsp;&emsp;&emsp;Where can the log be truncated? (4 points)

&emsp;&emsp;**Mihut will provide the key to this question.**

CS186 March 6  Midterm    Page 8<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Points for this page: \_\_\_\_\_\_\_\_\_\_\_


---

<a id="page-9"></a>
**Page 9**

**Name\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_      Login\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

**V. Concurrency Control and Crash Recovery: RECOVERY – 12 points**

&emsp;&emsp;1\. If the buffer pool is large enough that uncommited data are never forced to disk, is UNDO still<br>
&emsp;&emsp;&emsp;necessary?  How about REDO? (4 points)<br>
&emsp;&emsp;&emsp;UNDO<br>
&emsp;&emsp;&emsp;&emsp;a) YES<br>
&emsp;&emsp;&emsp;&emsp;b) NO<br>
&emsp;&emsp;&emsp;REDO<br>
&emsp;&emsp;&emsp;&emsp;c) YES<br>
&emsp;&emsp;&emsp;&emsp;d) NO

&emsp;&emsp;2\. If updates are always forced to disk when a transaction commits, is UNDO still necessary?  How<br>
&emsp;&emsp;&emsp;about REDO? (4 points)<br>
&emsp;&emsp;&emsp;UNDO<br>
&emsp;&emsp;&emsp;&emsp;a) YES<br>
&emsp;&emsp;&emsp;&emsp;b) NO

&emsp;&emsp;&emsp;REDO<br>
&emsp;&emsp;&emsp;&emsp;c) YES<br>
&emsp;&emsp;&emsp;&emsp;d) NO

&emsp;&emsp;3\. With checkpoint, after a softcrash, where in the log should REDO start?  Where should UNDO<br>
&emsp;&emsp;&emsp;start? (4 points)<br>
&emsp;&emsp;&emsp;&emsp;a) REDO:<br>
&emsp;&emsp;&emsp;&emsp;**At the smallest recLSN in the dirty page table.**

&emsp;&emsp;&emsp;&emsp;b) UNDO:<br>
&emsp;&emsp;&emsp;&emsp;**At the last LSN for each transaction to be undone.**

CS186 March 6  Midterm    Page 9<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Points for this page: \_\_\_\_\_\_\_\_\_\_\_


---

<a id="page-10"></a>
**Page 10**

**Name\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_      Login\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

&emsp;&emsp;&emsp;Extra Credit – 8 points<br>
&emsp;•    **Broadbase: Data Marts & OLAP (2 points)** - The presenter from BroadBase described how<br>
&emsp;&emsp;&emsp;their database uses “Cubes”, pre-computed indexes of aggregate information.  In 15 words or<br>
&emsp;&emsp;&emsp;less, what aspect of the workload allows them to use “Cubes”?<br>
&emsp;**A read-only workload allows them to use cubes, which otherwise would be very**<br>
&emsp;**expensive.**

&emsp;•    **Evite: Managing data at a Web Site (5 points)** - The presenter from E-Vite expressed opinions<br>
&emsp;&emsp;&emsp;on the following topics w.r.t. their DBMS.  In 10 words or less, what were her opinions of:<br>
&emsp;&emsp;&emsp;&emsp;i. Primary Keys<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**They don’t use them because they slow the database.**<br>
&emsp;&emsp;&emsp;&emsp;ii. Integrity Constraints<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**They don’t use them because they slow the database.**<br>
&emsp;&emsp;&emsp;&emsp;iii. Blobs<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**They keep them separate because they slow the database.**<br>
&emsp;&emsp;&emsp;&emsp;iv. Indexes<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**Very important for making the database fast.**<br>
&emsp;&emsp;E-vite uses the log for an interesting purpose not discussed in the book.  In 15 words or less, what<br>
&emsp;&emsp;unusual thing do they do with the log?<br>
&emsp;**They copy the log from one machine to another to keep a backup DBMS always**<br>
&emsp;**running, ready, and up-to-date.**<br>
&emsp;•    **MineSet: Data Mining (1 point)** - Name a data mining algorithm mentioned in the guest lecture<br>
&emsp;&emsp;on Data Mining:<br>
&emsp;**Decision Trees, Clustering, Neural Nets**

CS186 March 6  Midterm    Page 10<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Points for this page: \_\_\_\_\_\_\_\_\_\_\_

