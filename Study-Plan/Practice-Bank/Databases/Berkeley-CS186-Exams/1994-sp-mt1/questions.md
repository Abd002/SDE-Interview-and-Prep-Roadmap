# Berkeley CS186 Spring 1994: Midterm 1: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/186>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS 186, Midterm, Spring 1994<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**CS 186 Spring 1994**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Midterm**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Professor Gunther A. Vahdat**

**Problem #1 (15 Credits)**<br>
Suppose you are database administrator at a large university that is (still) using a hierarchical database<br>
system. You have chosen the following scheme to represent information about its faculty, students,<br>
departments, and courses.


![Figure on page 1](figures/questions-p01-fig01.png)

**Problem #2 (15 Credits)**<br>
Let R denote a relational database scheme and F a set of functional dependencies defined on R. Furthermore,<br>
let G denote a minimal cover of F.<br>
(a) Prove that any attribute that does not appear in any functional dependency in G belongs to every key of R.<br>
(b) Prove that if there is a functional dependency in the minimal cover G in which all attributes of R appear,<br>
then R is in third normal form with respect to F.

**Problem #3 (15 Credits)**<br>
Give an example for a relational database scheme R and a set F of functional dependencies defined on R,<br>
such that<br>
(i) R is not in third normal form (3NF) with respect to F, and<br>
(ii) there are at least two ways to decompose R into a minimum number of relations R1,...,Rk such that each Ri<br>
is in 3NF with respect to the corresponding projection of F, and the decomposition has a lossless join and<br>
preserves dependencies.<br>
Give at least two of the possible 3NF-decompositions.

**Problem #4 (15 Credits)**<br>
Consider the relational database scheme R = ABCD with a set of functional dependencies F:={AB -\> C, BC<br>
-\> D}.<br>
(a) Give all candidate keys for R (with respect to F).<br>
(b) Show that R is not in 3NF (with respect to F).<br>
(c) Find a 3NF-decomposition of R that has a lossless join, preserves dependencies, and consists of a

CS 186 Spring 1994 Midterm Professor Gunther A. Vahdat   1


---

<a id="page-2"></a>
**Page 2**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS 186, Midterm, Spring 1994<br>
minimum number of relations.<br>
(d) Is G:={AB -\> C, AB -\> D} a minimal cover of F? Prove your answer.

**Problem #5 (10 Credits)**<br>
Give an example of a view built on the relation EMP(name, salary, age, dept, manager) and two updates for<br>
that view which cannot be unambiguously translated to updates on the underlying base relation. Credit will<br>
be awarded proportional to the complexity of your examples.

**Problem #6 (20 Credits)**<br>
Consider the relations

HOUSE(house-id, h-address, h-age)<br>
PERSON(person-id, p-name, p-age)<br>
OWNS(house-id, person-id)<br>
LIVES-IN(house-id, person-id)

with the condition that a person can live in and own multiple houses. Write SQL queries for the following<br>
tasks. Credit will be awarded inversely proportional to the complexity of your queries.<br>
(a) Find the names of people who are part or full owners of at least one of the houses in which they live.<br>
(b) Find the name of the person who owns the most houses.<br>
(c) Find the names of the people who do not live anywhere.<br>
(d) Find the names of all people who live in a house which is the same age as the person's age.

&emsp;**Posted by HKN (Electrical Engineering and Computer Science Honor Society)**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Univeristy of California at Berkeley**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**If you have any questions about these online exams**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**please contact**  **examfile@hkn.eecs.berkeley.edu.**

Problem #4 (15 Credits)   2

