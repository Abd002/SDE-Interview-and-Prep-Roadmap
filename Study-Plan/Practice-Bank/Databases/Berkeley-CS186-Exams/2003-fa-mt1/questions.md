# Berkeley CS186 Fall 2003: Midterm 1: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/186>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;UNIVERSITY OF CALIFORNIA<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;College of Engineering<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Department of EECS, Computer Science Division<br>
CS186                                                                                                                 Eben Haber<br>
Fall 2003                                                                                                                Midterm<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**Midterm Exam: Introduction to Database Systems**<br>
This exam has seven problems, worth different amounts of points each. Each problem is<br>
made up of multiple questions. You should read through the exam quickly and plan your<br>
time-management accordingly. Before beginning to answer a question, be sure to read it<br>
carefully and to answer all parts of every question!


![Figure on page 1](figures/questions-p01-fig01.png)

Good luck!


![Figure on page 1](figures/questions-p01-fig02.png)


---

<a id="page-2"></a>
**Page 2**

CS 186 – Fall 2003                                                                         Login \_\_\_\_\_\_\_\_\_\_\_\_\_

**I. Query Languages (30 points).**<br>
Given the following database tables, choose all queries in SQL, Relational Algebra or<br>
Tuple Relational Calculus that return the proper answer to the corresponding question.<br>
Note that each question may have more than one correct answers. Circle all that apply.

Primary keys are underlined. Note that the driver involved in a car accident may not<br>
always be the owner of the car. Assume that accident\_date is of type integer, and<br>
represents a year (e.g. 1980). Year is also of type integer. We assume that a car cannot<br>
get involved in more than one accident at a certain date.

Person(SSN, name, address)<br>
Car(license, year, model)<br>
Accident(license, accident\_date, driver, damage\_amount)<br>
Owns(SSN, license)

1\. (4 points) Find the SSN of every person who owns one or more cars, none of which<br>
has ever been involved in a car accident.<br>
A. SELECT O.SSN<br>
FROM Owns O<br>
WHERE O.license NOT IN (SELECT A.license<br>
FROM Accident A)


![Figure on page 2](figures/questions-p02-fig03.png)

D. None of the above

2\. (4 points) Find the SSN of every person, who owns a TOYOTA or a DODGE<br>
A. SELECT O.SSN<br>
FROM Owns O, Car C<br>
WHERE O.license=C.license AND<br>
(C.model=’TOYOTA’ OR<br>
C.model=’DODGE’)


![Figure on page 2](figures/questions-p02-fig04.png)

D. None of the above


---

<a id="page-3"></a>
**Page 3**

CS 186 – Fall 2003                                                                            Login \_\_\_\_\_\_\_\_\_\_\_\_\_

3\. (4 points) Find the SSN of all persons who have had all of their cars involved in an<br>
accident.<br>
A. SELECT O.SSN<br>
FROM Owns O, Accident A<br>
WHERE O.license=A.license<br>
EXCEPT<br>
SELECT O.SSN<br>
FROM Owns O<br>
WHERE O.license NOT IN (SELECT A.licens<br>
FROM Accident A)


![Figure on page 3](figures/questions-p03-fig05.png)

D. None of the above.

4\. (4 points) Who is the driver who participated in the most costly accident? Return the<br>
driver and the amount of damage.<br>
A. SELECT driver, damage\_amount<br>
FROM Accident<br>
WHERE damage\_amount IN (SELECT MAX(damage\_amount)<br>
FROM Accident)<br>
B. SELECT driver, damage\_amount<br>
FROM Accident<br>
WHERE damage\_amount=MAX(damage\_amount)

C. (SELECT driver, damage\_amount FROM Accident)<br>
EXCEPT<br>
(SELECT a1.driver, a1.damage\_amount<br>
FROM Accident a1, Accident a2<br>
WHERE a1.damage\_amount\<a2.damage\_amount AND a1.driver\<\>a2.driver)

D. None of the above.

5\. (4 points) Find the license number of all cars that had an accident in less than 5 years<br>
after their production. Return the license number and the number of years<br>
A. SELECT c.license<br>
FROM Car c, Accident a<br>
WHERE a.accident\_date-c.year\<5


![Figure on page 3](figures/questions-p03-fig06.png)


---

<a id="page-4"></a>
**Page 4**

CS 186 – Fall 2003                                                                            Login \_\_\_\_\_\_\_\_\_\_\_\_\_


![Figure on page 4](figures/questions-p04-fig07.png)

D. None of the above

6\. (4 points) Find the accident with the smallest cost and return the corresponding owner<br>
of the car, his/her address and the amount of damage.<br>
A. SELECT O.SSN, P.address, MIN(A.damage\_amount)<br>
FROM Accident A, Owns O, Person P<br>
WHERE O.license=A.license AND O.SSN=P.SSN<br>
GROUP BY O.SSN, P.address

B. SELECT O.SSN, P.address, (SELECT MIN(damage\_amount) FROM Accident)<br>
FROM Owns O, Person P, Accident A<br>
WHERE O.SSN=P.SSN AND A.license=O.license

C. SELECT O.SSN, P.address, A.damage\_amount<br>
FROM Owns O, Person P, Accident A<br>
WHERE O.SSN=P.SSN AND A.damage\_amount=(SELECT MIN(damage\_amount)<br>
FROM Accident)<br>
D. None of the above.

7\. (4 points) Find the license number of all cars that have been involved in more than one<br>
accident. (DO NOT RETURN DUPLICATES)<br>
A. SELECT A1.license<br>
FROM Accident A1, Accident A2<br>
WHERE A1.license=A2.license AND A1.accident\_date\<\>a2.accident\_date

B. SELECT DISTINCT A1.license<br>
FROM Accident A1<br>
WHERE A1.license IN (SELECT A2.license<br>
FROM Accident A2<br>
WHERE A1.accident\_date\<\>A2.accident\_date)<br>
C. SELECT license<br>
FROM Accident<br>
GROUP BY license<br>
HAVING COUNT(accident\_date)\>1<br>
D. None of the above

8\. (2 points) Explain, in English, what the following Relational Calculus query expresses:


![Figure on page 4](figures/questions-p04-fig08.png)


---

<a id="page-5"></a>
**Page 5**

CS 186 – Fall 2003                                                                          Login \_\_\_\_\_\_\_\_\_\_\_\_\_

**II. External Sorting (10 points)**<br>
1\. (6 points) Suppose we wish to sort the following values:<br>
84, 22, 19, 11, 60, 68, 31, 29, 58, 23, 45, 93, 48, 31, 7<br>
Assume that:<br>
&emsp;• you have three pages of memory for sorting<br>
&emsp;• you will use an external sorting algorithm with a 2-way merge<br>
&emsp;• a page only holds two values<br>
For each sorting pass, show the contents of all temporary files.

2\. (2 points) If you have 100 pages of data, and 10 pages of memory, what is the<br>
minimum number of passes required to sort the data.

3\. (2 points) If you have 500,000 pages of data, what is the minimum number of pages of<br>
memory required to sort the data in 3 passes?


---

<a id="page-6"></a>
**Page 6**

CS 186 – Fall 2003                                                                            Login \_\_\_\_\_\_\_\_\_\_\_\_\_

.<br>
**III. Join Algorithms (6 points)**<br>
Consider a relation R with attributes (x,y) and a relation S with attributes (y, z). Column<br>
y in S is a key and the set of values of y in R are the same as the set of values of y in S.<br>
Assume that there are no indexes available and that there are 25 pages in the buffer<br>
available. Table R is 1,500 pages with 50 tuples per page. Table S is 400 with 100 tuples<br>
per page.

Compute the I/O costs for the following joins. Assume the simplest cost model, where<br>
pages are read and written one at a time.

A. Block nested loops join with R as the outer relation and S as the inner relation

B. Block nested loops join with S as the outer relation and R as the inner relation

C. Sort merge join with R as the outer relation and S as the inner relation

D. Sort merge join with S as the outer relation and R as the inner relation

E. Hash join with S as the outer relation and R as the inner relation


---

<a id="page-7"></a>
**Page 7**

CS 186 – Fall 2003                                                                            Login \_\_\_\_\_\_\_\_\_\_\_\_\_

**IV Query Optimization**

Consider the following schema

Sailors(sid, sname, rating, age)<br>
Reserves(sid, did, day)<br>
Boats(bid, bname, size)

Reserves.sid is a foreign key to Sailors and Reserves.bid is a foreign key to Boats.bid.

We are given the following information about the database:<br>
Reserves contains 10,000 records with 40 records per page.<br>
Sailors contains 1000 records with 20 records per page.<br>
Boats contains 100 records with 10 records per page.<br>
There are 50 values for Reserves.bid.<br>
There are 10 values for Sailors.rating (1...10)<br>
There are 10 values for Boat.size<br>
There are 500 values for Reserves.day

Consider the following query

SELECT S.sid, S.sname, B.bname<br>
FROM Sailors S, Reserves R, Boats B<br>
WHERE S.sid = R.sid AND R.bid = B.bid AND<br>
B.size \> 5 AND R.day = 'July 4, 2003';

(a) Assuming uniform distribution of values and column independence, estimate the<br>
number of tuples returned by this query.

Consider the following query

SELECT S.sid, S.sname, B.bname<br>
FROM Sailors S, Reserves R, Boats B<br>
WHERE S.sid = R.sid AND R.bid = B.bid<br>
(b) Draw all possible left-deep query plans for this query:


---

<a id="page-8"></a>
**Page 8**

CS 186 – Fall 2003                                                                            Login \_\_\_\_\_\_\_\_\_\_\_\_\_

(c) For the first join in each query plan (the one at the bottom of the tree, what join<br>
algorithm would work best? Assume that you have 50 pages of memory. There are no<br>
indexes, so indexed nested loops is not an option.


---

<a id="page-9"></a>
**Page 9**

CS 186 – Fall 2003                                                                            Login \_\_\_\_\_\_\_\_\_\_\_\_\_

**V Buffer Management (10 points total)**

In this exercise, you will compare the LRU, MRU, and CLOCK buffer management<br>
algorithms for a given workload (just as you did in the first part of homework 1). Here<br>
are the assumptions you must make:<br>
&emsp;• Assume there are four page slots your buffer manager must manage: P1, P2, P3,<br>
&emsp;&emsp;and P4.<br>
&emsp;• All four slots are empty to start.<br>
&emsp;• When the buffer pool has unused slots (such as at the beginning, when all four<br>
&emsp;&emsp;slots are empty), it will put newly read data in the leftmost empty slot (e.g., if<br>
&emsp;&emsp;slots 2 and 3 are free, it will use slot 2).<br>
&emsp;• The pages to be read from disk are labelled A through G.<br>
&emsp;• For each access the page is pinned, and then immediately unpinned.<br>
Below are three tables for describing the contents of the buffer pool at each time step. A<br>
page is read at the beginning of each time step. You should record, in the table, the<br>
contents of each Buffer Page after the new page has been read in.


![Figure on page 9](figures/questions-p09-fig09.png)


---

<a id="page-10"></a>
**Page 10**

CS 186 – Fall 2003                                                                            Login \_\_\_\_\_\_\_\_\_\_\_\_\_

**VI. Functional Dependencies and Normalization (20 points total)**<br>
Consider the attributes A B C D E F G which have the following functional<br>
dependencies:<br>
AD à F<br>
AE à G<br>
DF à BC<br>
E à C<br>
G à E

1\. List all candidate keys (not superkeys): (5 points)

2\. Which of the following dependencies are implied by those above: (5 points)<br>
a. (IS) (IS NOT) G à C<br>
b. (IS) (IS NOT) A à G<br>
c. (IS) (IS NOT) ADF à E<br>
d. (IS) (IS NOT) ADC à B<br>
e. (IS) (IS NOT) AGF à E

3\. Consider the decomposition into 4 relations: (ADF) (CE) (EG) (ABDG).<br>
This decomposition: (5 points)<br>
a. (IS) (IS NOT) in BCNF<br>
b. (IS) (IS NOT) in 3NF<br>
c. (IS) (IS NOT) in 1NF<br>
d. (IS) (IS NOT) Dependency Preserving<br>
e. (IS) (IS NOT) Lossless

4\. Consider the decomposition into 3 relations: (ADF) (EC) (ABDEG).<br>
This decomposition: (5 points)<br>
a. (IS) (IS NOT) in BCNF<br>
b. (IS) (IS NOT) in 3NF<br>
c. (IS) (IS NOT) 1NF<br>
d. (IS) (IS NOT) Dependency Preserving<br>
e. (IS) (IS NOT) Lossless


---

<a id="page-11"></a>
**Page 11**

CS 186 – Fall 2003                                                                            Login \_\_\_\_\_\_\_\_\_\_\_\_\_<br>
**VII. Entity-Relational Model (20 Points)**<br>
a) (10 points) Draw an E-R diagram for the following situation:<br>
&emsp;• This is a simplified model for reserving baseball tickets.<br>
&emsp;• There are teams, which are identified by the team name. Teams are also located<br>
&emsp;&emsp;in a city.<br>
&emsp;• Teams play each other in games, which occur on a particular date at a particular<br>
&emsp;&emsp;time. Games are identified by a game ID, and each game has exactly two teams<br>
&emsp;&emsp;that play in it.<br>
&emsp;• A game is played in exactly one stadium.<br>
&emsp;• A stadium is identified by its name, and is also located in a city.<br>
&emsp;• Stadiums have seats, which have a section number, a row number, and a seat<br>
&emsp;&emsp;number.<br>
&emsp;• Ticket holders reserve seats for a game. Ticket holders are identified by their<br>
&emsp;&emsp;name.<br>
&emsp;• Some ticket holders are students (students get discounts, but we are not including<br>
&emsp;&emsp;that in the model).


---

<a id="page-12"></a>
**Page 12**


![Page 12 (scanned)](figures/questions-p12-page.png)


---

<a id="page-13"></a>
**Page 13**

CS 186 – Fall 2003                                                                            Login \_\_\_\_\_\_\_\_\_\_\_\_\_

b) (10 points) Using SQL, convert the following ER diagram to the relational model.<br>
Hint: You do not need CHECK constraints.


![Figure on page 13](figures/questions-p13-fig11.png)

