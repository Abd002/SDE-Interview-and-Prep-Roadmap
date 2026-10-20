# Berkeley CS186 Fall 1994: Midterm 1: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/186>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS 186, MIDTERM, FALL 1994<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**CS 186**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**MIDTERM**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**FALL 1994**<br>
**There are 9 questions to this exam. All count equally.**<br>
**Queries expressed in relational algebra and relational calculus must follow**<br>
**the syntax used in class. Queries expreseed in SQL must follow the syntax**<br>
**used in class or in the INGRES Manual. All SQL queries should contain NO**<br>
**duplicates in their outputs. It is not necessary to sort the outputs in any**<br>
**order.**<br>
**You are not allowed to use views for any questions expect question 7.**<br>
**Use the following relational database schema for all the questions except**<br>
**question 1:**<br>
**DEPT (dname, location)**<br>
**STUDENT (name, regno, gpa, level, dept)**<br>
**COURSE (cno, cname, dept)**<br>
**TAKE (regno, cno)**<br>
**None of the columns can have null values.**

**Problem #1**<br>
Suppose there are two relations A (a1, a2, a3) and B (b1, b2, b3). A has two candidate keys and its primary<br>
key is (a1, a2). B has only one candidate key and its primary key is (b2, b3). How many candidate keys will<br>
the relation A times B have? How many primary keys will the relation A times B have? Please state your<br>
reasoning in support of your conclusion.

**Problem #2**<br>
Express in relational algebra the names of the EECS students who are taking any EECS courses.

**Problem #3**<br>
Express in relational calculus the names of the departments which either have no students or have at least one<br>
student taking each EECS course.

CS 186MIDTERMFALL 1994professor (e.g., Professor J. Wawrzynek)   1


---

<a id="page-2"></a>
**Page 2**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS 186, MIDTERM, FALL 1994<br>
**Problem #4**<br>
Express in SQL the names and department names of the students who are from departments not located in<br>
Evans Hall.

**Problem #5**<br>
Express in SQL the names of the students who are not taking any EECS courses.

**Problem #6**<br>
Express in SQL the names of the departments which have the largest number of students taking EECS<br>
courses.

**Problem #7**<br>
Suppose we have the following view definition in the database for all CS students:

create view cs\_student<br>
as<br>
select s.name, s.regno, s.gpa, s.level<br>
from STUDENT s<br>
where s.dept = 'CS'

Suppose we have the following INGRES table level integrity constraints:<br>
create integrity on STUDENT is gpa \> 0

Usually the DBMS query modifier converts a query involving views into an equivalent query on the<br>
underlying base tables. The query is then modified according to the table level integrity constraints existing<br>
on the base tables.

Modify the following query according to the view definition and table level integrity constraint defined<br>
above:<br>
update cs\_student<br>
set gpa = gpa - 1.0<br>
where level = 4

**Problem #8**<br>
Write the rules (and the associated stored procedures) to enforce the integrity constraint: No students can take<br>
more than 3 courses from the same department. You may assume that the department of a course will nver<br>
change.

Problem #4   2


---

<a id="page-3"></a>
**Page 3**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS 186, MIDTERM, FALL 1994

**Problem #9**<br>
Please point out the mistakes in the following ESQL/C program. List the mistakes clearly one by one.

exec sql include sqlca;<br>
exec sql include sqlda;<br>
IISQLDA \*sqlda;

main()<br>
{<br>
int regno;

regno = 305;

exec sql update STUDENT<br>
set gpa = :gpa<br>
where regno = :regno;<br>
}

&emsp;**Posted by HKN (Electrical Engineering and Computer Science Honor Society)**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**University of California at Berkeley**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**If you have any questions about these online exams**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**please contact**  **examfile@hkn.eecs.berkeley.edu.**

Problem #8   3

