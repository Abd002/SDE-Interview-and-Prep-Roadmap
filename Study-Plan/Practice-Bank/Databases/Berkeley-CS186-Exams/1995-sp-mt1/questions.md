# Berkeley CS186 Spring 1995: Midterm 1: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/186>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS 186, Midterm, Spring 1995<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**CS 186, Spring 1995**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Midterm**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Professor Wang**

There are a total of 8 questions. Credits for each question are indicated in brackets. There are a total of 45<br>
points.<br>
Queries expressed in relational algebra and relational calculus must follow the syntax used in class. Queries<br>
expressed in SQL must follow the syntax used in class or in the INGRES Manual. All SQL queries should<br>
contain NO duplicated in their outputs. It is not necessary to sort the outputs in any order.<br>
You are NOT allowed to use views for any questions<br>
**Problem #1**<br>
(1) \[5\] Given a relation with 3 attributes, at most how many candidate keys can it have at any given time? At<br>
least how many candidate keys does it have? Please state your reasoning in support of your answer.

**Problem #2**<br>
(2) Consider the following relational database schema:

`DEPT (dname, location)`<br>
`STUDENT (name, regno, gpa, level, dept)`<br>
`COURSE (cno, cname, dept)`<br>
`TAKE (regno, cno)`

None of the columns can have null values.

**Problem #2a**<br>
(2a)\[5\] Express in relational algebra the names of the departments which have at least one student who does<br>
not take any courses offered by the 'EECS' department.

**Problem #2b**<br>
(2b) \[5\] Express in relational calculus the names of the courses such that everyone taking them is an EECS<br>
senior.

**Problem #3**<br>
(3) \[5\] Consider the following relational database schema:

`DEPT (dname, location)`<br>
`STUDENT (name, regno, gpa, level, dept)`<br>
`COURSE (cno, cname, dept)`<br>
`TAKE (regno, cno)`

None of the columns can have null values.<br>
Express in SQL the names of the departments which have at least one student who does not take any courses<br>
offered by the 'EECS' department.

CS 186, Spring 1995 Midterm Professor Wang   1


---

<a id="page-2"></a>
**Page 2**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS 186, Midterm, Spring 1995<br>
**Problem #4**<br>
(4) \[5\] Consider the following relational database schema:

`dname``, location)`                `DEPT (`<br>
`emp_no``, salary, dname)`                `EMP (name,`<br>
`pname``, budget, manager)`                `PROJECT (`<br>
`emp_no, pname``)`                `JOBS (`

For each relation, the attributes in italics are the primary key. None of the columns can have null values.<br>
Express in SQL the names of the projects which have the largest number of employees from the EECS<br>
department.

**Problem #5**<br>
(5) \[5\] Consider the following relational database schema:

`dname``, location)`                `DEPT (`<br>
`regno``, gpa, level, dept)`                `STUDENT (name,`

For each relation, the attributes in italics are the primary key. Only the gpa and dept attributes in STUDENT<br>
can have null values. You may assume the non-null gpa values are unique.<br>
Express in SQL the name of the students who have the 4th highest gpa in their deparments.

**Problem #6**<br>
(6) \[5\] Consider the following relational database schema:

`dname``, location)`                `DEPT (`<br>
`regno``, gpa, level, dept)`                `STUDENT (name,`<br>
`cno``, cname, dept)`                `COURSE (`<br>
`regno, cno``)`                `TAKE (`

For each relation, the attributes in italics are the primary key. Only the gpa and dept attributes in STUDENT<br>
can have null values.<br>
Express in SQL the names of the departments such that every senior from these departments is taking all the<br>
EECS courses offered.

**Problem #7**<br>
(7) \[5\] Consider the following relational database schema:

`dname``, location)`                `DEPT (`<br>
`regno``, gpa, level, dept)`                `STUDENT (name,`<br>
`cno``, cname, units, dept)`                `COURSE (`<br>
`regno, cno``)`                `TAKE (`

For each relation, the attributes in italics are the primary key. Only the gpa and dept attributes in STUDENT<br>
can have null values. You may assume that the DEPT, STUDENT, and COURSE tables are not changed.<br>
Updates, inserts, and deletes are allowed on the TAKE table.<br>
Write the rules and the associated stored procedures to enforce the following integrity constraints: - If a<br>
student has a gpa lower than 2.0, s/he is not allowed to take more than 12 units. - If a student does not have a<br>
gpa, s/he is not allowed to take more than 15 units.

Problem #3   2


---

<a id="page-3"></a>
**Page 3**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS 186, Midterm, Spring 1995

**Problem #8**<br>
(8) \[5\] What are the different types of integrity constrains? Which of them cannot be implemented by using<br>
INGRES rules and stored in procedures? Please state your reasoning in support of your conclusions.

&emsp;**Posted by HKN (Electrical Engineering and Computer Science Honor Society)**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**University of California at Berkeley**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**If you have any questions about these online exams**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**please contact**  **examfile@hkn.eecs.berkeley.edu.**

Problem #7   3

