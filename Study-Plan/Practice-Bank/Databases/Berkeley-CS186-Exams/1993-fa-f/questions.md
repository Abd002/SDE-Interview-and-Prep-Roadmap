# Berkeley CS186 Fall 1993: Final: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/186>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS186, Final, Fall 93

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**CS 186, Fall 93**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Final**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Professor Unknown

There are 10 questions to this exam. Credits for each question is indicated in brackets. There are a total of 100<br>
points.

Queries expressed in relational algebra and relational calculus must follow syntax used in class. Queries<br>
expressed in SQL must follow the syntax used in class or in the INGRES Manual. All SQL queries should<br>
contain NO duplicates in their outputs. It is not necessary to sort the outputs in any order.

You are not allowed to use views for any questions.

**Problem #1**<br>
Consider the following relational database schema:<br>
&emsp;&emsp;STUDENT(name, regno, gpa, level, dept)<br>
&emsp;&emsp;COURSE(cno, cname, dept)<br>
&emsp;&emsp;TAKE(regno, cno)

(1a)\[5\] Express in relational algebra the names of students who are taking a course offered by the EECS<br>
department.<br>
(1b)\[5\] Express in relational calculus the names of the students who are not taking any courses offered by the<br>
EECS department.

**Problem #2**<br>
Consider the following relational database schema:<br>
&emsp;&emsp;DEPT(dname, location)<br>
&emsp;&emsp;STUDENT(name, regno, gpa, level, dept)<br>
&emsp;&emsp;COURSE(cno, cname, dept)<br>
&emsp;&emsp;TAKE(regno, cno)

(2a)\[5\] Express in SQL the names f the courses taken by any student who is from a department located in<br>
'Evans Hall'.<br>
(2b)\[5\] Express in SQL the names of the departments which have no students with gpa better than 3.5 taking<br>
less than 4 courses.

**Problem #3**<br>
\[10\] Consider the following relational database schema:<br>
&emsp;&emsp;DEPT(dname, location)<br>
&emsp;&emsp;STUDENT(name, regno, gpa, level, dept)

Express in SQL the names of the departments that satisfy the following condition: the average gpa of all the<br>
students in the department is better than the average gpa of all the students from departments located in the<br>
same building as the department.

course, semester/year CS 186, Fall 93exam # Finalprofessor (e.g., Professor J. Wawrzynek)   1


---

<a id="page-2"></a>
**Page 2**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS186, Final, Fall 93

**Problem #4**<br>
\[10\] Consider the following relational database schema:<br>
&emsp;&emsp;DEPT(dname, location)<br>
&emsp;&emsp;STUDENT(name, regno, gpa, level, dept)<br>
&emsp;&emsp;COURSE(cno, cname, dept)<br>
&emsp;&emsp;TAKE(regno, cno)

Write the rule(s) and the associated stored procedure(s) to make sure no student takes more than 5 courses.

**Problem #5**<br>
\[10\] Consider a table with data records stored in a heap structure Suppose there are 1,048,576 fixed length<br>
records stored in this table, each record has 64 bytes. Now we want to build a B+ tree secondary index on it.<br>
The key field on which the secondary index will be built has a fixed length of 12 bytes. Each record id (rid) is<br>
6 bytes. A page number is 4 bytes long. Each page is 1024 bytes(of which 1000 bytes can be used, the rest is<br>
used to store page header information).

(5a)\[5\] How many levels (including the root and leaf level) at most is necessary in the B+ tree index? Please<br>
state your reasoning in support of your conclusion.<br>
(5b)\[5\] At most how many page splits will occur in the process of building this index? Please state your<br>
reasoning in support of your conclusion.

**Problem #6**<br>
Suppose there are two tables: EMP and DEPT. EMP is stored in a B+-tree, the key is its dept field. The<br>
DEPT table is stored in a heap structure. EMP has 50,000 records, occupying 25,000 data pages. DEPT has<br>
500 records, occupying 500 pages. The dname attribute in DEPT has unique values. Assume uniform<br>
distribution. Consider the query:

select e.name from EMP e, DEPT d where e.dept = d.dname

Suppose the DBMS has only implemented iterative substitution and hash join. Neither the EMP table nor the<br>
DEPT table fits into memory. However, the number of memory pages available for processing the query is<br>
26\. Assume the parameter w = 20.

(6a)\[10\] Choose an optimal strategy to evaluate the above query and give the cost for this strategy. Please<br>
state your reasoning in support of this conclusion.<br>
(6b)\[5\] If the above query is processed using the hash join algorithm, what is the number of hash buckets that<br>
should be used? Please state your reasoning in support of your conclusion.

**Problem #7**<br>
Consider the following two transactions:

T1:<br>
&emsp;&emsp;begin xact<br>
&emsp;&emsp;write C<br>
&emsp;&emsp;read B<br>
&emsp;&emsp;write C<br>
&emsp;&emsp;commit xact

Problem #3   2


---

<a id="page-3"></a>
**Page 3**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS186, Final, Fall 93<br>
T2:<br>
&emsp;&emsp;begin xact<br>
&emsp;&emsp;write B<br>
&emsp;&emsp;read C<br>
&emsp;&emsp;read C<br>
&emsp;&emsp;commit xact

(7a)\[10\] In a DBMS using the two-phase locking algorithm, whether transactions will cause deadlocks<br>
depends on how they are executed. If the above two transactions are executed concurrently, under what<br>
situations can a deadlock occur?<br>
(7b)\[5\] In a DBMS that has not implemented any concurrency control algorithms, can non-repeatable reads<br>
occur if the above two transactions are executed concurrently? State your reasoning in support of your<br>
conclusion.

**Problem #8**<br>
\[5\] In a DBMS using the write-ahead log technique, after a soft crash, the transaction log is processed to redo<br>
the changes of all committed transactions and to undo the changes of all uncommitted transactions. In the<br>
redo process, the transaction log is scanned forward and log records are redone in the order that they were<br>
written into the log. In the undo process, the transaction log is scanned backward and log records are undone<br>
in the reverse order that they were written into the log. If in the undo process, the transaction log was scanned<br>
forward and the log records were undone in the order that they were written into the log, give an example of a<br>
transaction that would be undone incorrectly.

**Problem #9**<br>
We have discussed two techniques that have the phrase "two-phase" in them: two-phase locking and<br>
two-phase commit.

(9a)\[5\] What are the similarities and differences between two-phase locking and two-phase commit?

(9b)\[5\] What are the two phases in each of the two techniques?

**Problem #10**<br>
\[5\] In a parallel DBMS running on a multiprocessor system, when the number of processors increases, the<br>
performances of the DBMS should also improve. The performance improvement is usually measured by<br>
"speed up" and "scale up". What is the difference between the two measurements?

&emsp;**Posted by HKN (Electrical Engineering and Computer Science Honor Society)**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**University of California at Berkeley**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**If you have any questions about these online exams**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**please contact**  **examfile@hkn.eecs.berkeley.edu.**

Problem #7   3

