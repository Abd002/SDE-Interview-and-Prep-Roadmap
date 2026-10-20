# Berkeley CS186 Spring 1996: Midterm 1: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/186>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS 186, Midterm#1, Spring 1996<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**CS 186 , Spring 1996**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Midterm#1 (2/8/96)**

There are 7 questions to this exam. All count equally. Each question is worth 6 points.

Queries expressed in relational algebra and relational calculus must follow the syntax used in<br>
class. Queries expressed in SQL must follow the syntaxused in class or in the Sybase Manual. All<br>
SQL queriesshould contain NO duplicates in their outputs. It is not necessary to short the outputs<br>
in any order.

For each of the mutiple choice questions, you should choose ONLY ONE answer. If you choose<br>
more than one answer or the wrong answer, you will lose more points than if you do not answer<br>
the question. For example, fore question(1), you will receive all 6 pointes if you choose the correct<br>
answer, 0 points if you choose no answer, and -2 points if you choose mutiple answers or the<br>
wrong answer.

**Problem #1**<br>
Consider the database schema used in HW #2:

&emsp;&emsp;DEPT(dname,location)<br>
&emsp;&emsp;EMP<br>
&emsp;&emsp;PROJECT(pname,budget,manager)<br>
&emsp;&emsp;JOBS(emp\_no,pname)

This database stores the current research projects at UC Berkeley. People from different depart-<br>
ments works together on projects. Each project has a unique name and one manager. It is possible<br>
that an employee is working on or managing multiple projects. We assume that every employee<br>
has a unique emp\_no. Employee names are also unique. The manager field of PROJECT stores<br>
the emp\_no(not the name) of project managers.<br>
There are three options in enforcing referential integrity: reject, cascade, and nullify. Suppose an<br>
employee is deleted from the EMP relation, circle the statment below which is correct.

&emsp;a. If reject is chosen, the delete should be rejected if the employee manages one or more projects.<br>
&emsp;b. If reject is chosen, the delete should be rejected if the employee's department has other employees.<br>
&emsp;c. If cascade is chosen, the projects that the employee works on should also be deleted, so are the<br>
&emsp;&emsp;managers of these projects.<br>
&emsp;d. If nullify is chosen, the employee's dname attribute should be set to null.<br>
&emsp;e. None of above.<br>
**Problem #2**<br>
Consider the following relational database schema which is used for examples in class:

&emsp;&emsp;DEPT(dname,location)<br>
&emsp;&emsp;STUDENT(name,regno,gpa,level,dept)<br>
&emsp;&emsp;COURSE(cno,cname,dept)

CS 186 , Spring 1996 Midterm#1 (2/8/96)   1


---

<a id="page-2"></a>
**Page 2**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS 186, Midterm#1, Spring 1996<br>
&emsp;&emsp;TAKE(regno,cno)

The following relational algebra queries are supposed to return the names of the students from the<br>
Math department who are taking CS course. Please circle the correct answer.

&emsp;a. (STUDENT where dept = "Math")\[name, regno\] join TAKE join ((COURSE where dept =<br>
&emsp;&emsp;"CS")\[cno\])<br>
&emsp;b. ((STDUENT where dept = "Math") join TAKE join (COURSE where dept = "CS") )\[name\]<br>
&emsp;c. ((STUDENT where dept = "Math")\[name, regno\] join TAKE join ((COURSE where dept =<br>
&emsp;&emsp;"CS")\[cno\]) )\[name\]<br>
&emsp;d. ((STUDENT where dept = "Math")\[name, regno, dept\] join TAKE join ((COURSE where dept =<br>
&emsp;&emsp;"CS")\[cno, dept\]) )\[name\]<br>
&emsp;e. None of above<br>
**Problem #3**<br>
Consider the following relational database schema which is the same as in(2):

&emsp;&emsp;DEPT(dname,location)<br>
&emsp;&emsp;STUDENT(name,regno,gpa,level,dept)<br>
&emsp;&emsp;COURSE(cno,cname,dept)<br>
&emsp;&emsp;TAKE(regno,cno)

Assume GPA values are unique, express in relational algebra the regno of the student who has the<br>
highest GPA.<br>
**Problem #4**<br>
Consider the following relational database schema which is the same as in(2):

&emsp;&emsp;DEPT(dname,location)<br>
&emsp;&emsp;STUDENT(name,regno,gpa,level,dept)<br>
&emsp;&emsp;COURSE(cno,cname,dept)<br>
&emsp;&emsp;TAKE(regno,cno)

Assume GPA values are unique, express in relational calculus the regno of the student who has<br>
the second highest GPA. Circle the correct answer.

&emsp;a. s.regno where exists s1 (s1.sid s.sid and s1.gpa \> s.gpa) and not exists s2 (s2.sid s.sid and s2.gpa \><br>
&emsp;&emsp;s.gpa)<br>
&emsp;b. s.regno where exists s1 (s1.gpa \> s.gpa and not exists s2 (s2.sid s1.sid and s2.gpa \> s.gpa))<br>
&emsp;c. s.regno where exists s1 ((forall s2 (s1.gpa \> s2.gpa)) and s.gpa \< s1.gpa)<br>
&emsp;d. s.regno where exists s1 (forall s2 (s1.gpa \> s2.gpa)) and not exists s3 (s3.gpa \> s.gpa)<br>
&emsp;e. None of above<br>
**Problem #5**<br>
Cnsider the following relational database schema which is the same as in (2):

&emsp;&emsp;DEPT(dname,location)<br>
&emsp;&emsp;STUDENT(name,regno,gpa,level,dept)<br>
&emsp;&emsp;COURSE(cno,cname,dept)

Problem #2   2


---

<a id="page-3"></a>
**Page 3**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS 186, Midterm#1, Spring 1996<br>
&emsp;&emsp;TAKE(regno,cno)

Express in SQL the names of the students who take exactly the same courses as Doug takes.<br>
**Problem #6**<br>
Consider the following relational database schema which is the same as in(2):

&emsp;&emsp;DEPT(dname,location)<br>
&emsp;&emsp;STUDENT(name,regno,gpa,level,dept)<br>
&emsp;&emsp;COURSE(cno,cname,dept)<br>
&emsp;&emsp;TAKE(regno,cno)

Express in SQL the names and departments of the students who take the largest number of<br>
courses among students in their departments. Students without a department should not<br>
be considered.<br>
**Problem #7**<br>
Consider the following relational database schema which is the same as in(2):

&emsp;&emsp;DEPT(dname,location)<br>
&emsp;&emsp;STUDENT(name, regno, gpa, level, dept)<br>
&emsp;&emsp;COURSE(cno,cname,dept)<br>
&emsp;&emsp;TAKE(regno,cno)

Rewrite the following SQL query in relational algebra:

`select distinct s.name`<br>
`from STUDENT s`<br>
`where s.level = 4 and`<br>
`not exists`<br>
`(select c.*`<br>
`from COURSE c`<br>
`where c.dept = 'CS' and`<br>
`not exists (`<br>
`select t.*`<br>
`from TAKE t`<br>
`where t.regno = s.regno`<br>
`and t.cno = c.cno)`

Circle the correct answer:

&emsp;a. ((STUDENT where level 4) \> join TAKE join (COURSE where dept "CS") )\[name\]<br>
&emsp;b. (((STUDENT where level = 4) join TAKE)\[name,cno\]) divideby (COURSE where dept =<br>
&emsp;&emsp;"CS")\[cno\]<br>
&emsp;c. ((STUDENT where level = 4) minus (STUDENT join TAKE join COURSE where dept "CS")<br>
&emsp;&emsp;)\[name\]<br>
&emsp;d. (((STUDENT where level = 4) join TAKE) divideby (COURSE where dept = "CS")\[cno\] )\[name\]<br>
&emsp;e. None of above

Problem #5   3


---

<a id="page-4"></a>
**Page 4**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS 186, Midterm#1, Spring 1996

&emsp;**Posted by HKN (Electrical Engineering and Computer Science Honor Society)**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**University of California at Berkeley**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**If you have any questions about these online exams**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**please contact**  **examfile@hkn.eecs.berkeley.edu.**

Problem #7   4

