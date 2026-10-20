# Berkeley CS186 Fall 2000: Midterm 1: Official solutions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/186>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**University of California, Berkeley**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**College of Engineering**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Computer Science Division – EECS**<br>
Fall  2000                                            Prof. Michael J. Franklin<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Midterm Exam - SOLUTIONS**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;October 18, 2000<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS 186 Introduction to Database Systems

**NAME**: \_\_\_\_J. Bond\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_    **STUDENT ID:\_\_\_\_007\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

`Circle the last two letters of your class account:`<br>
`cs186 a b c d e f g h i j k l m n o p q r s t u v w x y z`<br>
`a b c d e f g h i j k l m n o p q r s t u v w x y z`

`DISCUSSION SECTION DAY & TIME: Saturday 10pm TA NAME: E.F. Codd`<br>
General Information:<br>
This is a **closed book** examination – but you are allowed one 8.5” x 11” sheet of notes (double<br>
sided).  You have 1 hour and 30 minutes to answer as many questions as possible.  Partial credit<br>
will be given.  There are 100 points in all.  You should read **all** of the questions before starting<br>
the exam, as some of the questions are substantially more time-consuming than others.<br>
Write all of your answers directly on this paper.  Be sure to **clearly indicate** your final answer<br>
for each question.  Also, be sure to state any assumptions that you are making in your answers.<br>
Please try to be as **concise as possible**.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**GOOD LUCK!!!**


![Figure on page 1](figures/solutions-p01-fig01.png)


---

<a id="page-2"></a>
**Page 2**

Name:\_J. Bond\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_                  SID:\_\_ 007\_\_\_\_\_\_\_\_\_\_\_\_\_\_


### **Question 1 \[3 parts, 20 points total\]:  Data Models**

**a)  (10  points)**  Draw a (simple) E-R diagram that results in a primary key/foreign key constraint<br>
to be created between tables.  Show the SQL statements that create the tables including the<br>
foreign key and primary key indications.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CREATE TABLE Customers (<br>
cid CHAR(10),


![Figure on page 2](figures/solutions-p02-fig02.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;primary key (cid))<br>
CREATE TABLE Products (<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;pid CHAR(10),<br>
primary key (pid))<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CREATE TABLE Orders (<br>
cid CHAR(10),<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;pid CHAR(10),<br>
PRIMARY KEY (cid, pid),<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;FOREIGN KEY (cid) REFERENCES Customers,<br>
FOREIGN KEY (pid) REFERENCES Products)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CREATE TABLE Salespersons (


![Figure on page 2](figures/solutions-p02-fig03.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;sid CHAR(10),<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;primary key (sid))<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CREATE TABLE Customers(<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;cid CHAR(10),<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;sid CHAR(10),<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;PRIMARY KEY (cid),<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;FOREIGN KEY (sid) REFERENCES Salespersons)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CREATE TABLE Customers (


![Figure on page 2](figures/solutions-p02-fig04.png)

cid CHAR(10),<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;primary key (cid))<br>
CREATE TABLE Orders (<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;cid CHAR(10),<br>
pid CHAR(10),<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;PRIMARY KEY (cid, pid),<br>
FOREIGN KEY (cid) REFERENCES Customers)

**b)  (5  points)** For the relational tables you generated in question 1(a), Describe which **insert**<br>
and **delete** operations in this database must be checked to ensure that referential integrity is not<br>
violated for that foreign key.  Please state specifically which operations on which relations can<br>
cause problems.<br>
Many to Many:<br>
On insert(Order)          -\> exists(Customers) and exist(Products);<br>
On delete(Customers)  -\> delete(Orders) or not allowed;<br>
On delete(Products)      -\> delete(Orders) or not allowed;<br>
One to Many:<br>
On insert(Customers)  -\> exists(Salespersons);<br>
On delete(Salespersons) -\> delete(Customers) or not allowed if the foreign key can not be null.<br>
Otherwise set\_default(Customers).<br>
Weak entity:<br>
On insert(Order)          -\> exists(Customers);<br>
On delete(Customers)  -\> delete(Orders) or not allowed;

CS 186 Midterm - SOLUTIONS     October 18, 2000        Page 2 of 10


---

<a id="page-3"></a>
**Page 3**

Name:\_J. Bond\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_                  SID:\_\_ 007\_\_\_\_\_\_\_\_\_\_\_\_\_\_

**c) (5 points)**  Consider a database of employees in which we need to record information about<br>
employees’ addresses.  Name one condition which would cause you to make “address” an  **entity**<br>
**set** of its own rather than an **attribute** of the employee entity set.<br>
There are several conditions.<br>
&emsp;•    An employee may have more than one address and all of them are supposed to be stored<br>
&emsp;&emsp;in the database.<br>
&emsp;•    Attribute address is composed of street, city, state, etc. Components of an address may<br>
&emsp;&emsp;also be interesting to some queries.<br>
Address of an employee may be shared by another entity.

CS 186 Midterm - SOLUTIONS     October 18, 2000        Page 3 of 10


---

<a id="page-4"></a>
**Page 4**

Name:\_J. Bond\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_                  SID:\_\_ 007\_\_\_\_\_\_\_\_\_\_\_\_\_\_


### **Question 2 \[3 parts, 15 points total\]:  Pure Relational Languages**

Consider the following schema for an airline database (primary key attributes are in **bold**):<br>
&emsp;&emsp;&emsp;&emsp;FLIGHTS (**flight\_num**, source\_city, destination\_city)<br>
&emsp;&emsp;&emsp;&emsp;DEPARTURES (**flight\_num, date,** plane\_type)<br>
&emsp;&emsp;&emsp;&emsp;PASSENGERS (**passenger\_id**, passenger\_name, passenger\_address)<br>
&emsp;&emsp;&emsp;&emsp;BOOKINGS( **passenger\_id**, **flight\_num, date**, seat\_number)<br>
Express the following queries in **one of**  (your choice): relational algebra or relational calculus.<br>
Feel free to use different languages for different querires and to abbreviate relation and attribute<br>
names:<br>
**a)  (5  points)**  Find the cities that have direct (non-stop) flights to both Honolulu and Newark.<br>
πsource\_city(σdestination\_city = “Honolulu”(FLIGHTS))∩ πsource\_city(σdestination\_city = “Newark”(FLIGHTS))

{P\|∃ F∈ FLIGHTS, ∃ G ∈ FLIGHT ( P.source\_city = F.source\_city ∧ P.source\_city =<br>
G.source\_city ∧ F.destination\_city = “Honolulu” ∧ G.destination\_city = “Newark”)}

**b)  (5  points)**  Find the passenger\_name of all passengers who have a seat booked on at least<br>
one plane of  **every**  type.<br>
π passenger\_name, plane\_type(PASSENGERS ∞ BOOKINGS ∞ DEPARTURES) /<br>
πplane\_type(DEPARTURES)

{P\|∃ P1∈PASSENGERS (∀D1∈DEPARTURES (∃ B∈BOOKINGS, ∃D2∈DEPARTURES (<br>
P.passenger\_name = P1.passenger\_name ∧ P1.passenger\_id = B.passenger\_id ∧ B.flight\_num =<br>
D2.flight\_num ∧B.date = D2.date ∧D1.plane\_type = D2.plane\_type)))}

**c)  (5  points)** Find the flight\_num and date of all flights for which there are no reservations.<br>
πflight\_num, date(DEPARTURES) - πflight\_num, date(BOOKINGS)

{P\|∃ D ∈ DEPARTURES (P.flight\_num = D.flight\_num ∧P.date = D.date ∧∀B∈ BOOKINGS<br>
(D.flight\_num \<\> B.flight\_num ∨ D.date \<\> B.date))}

CS 186 Midterm - SOLUTIONS     October 18, 2000        Page 4 of 10


---

<a id="page-5"></a>
**Page 5**

Name:\_J. Bond\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_                  SID:\_\_ 007\_\_\_\_\_\_\_\_\_\_\_\_\_\_


### **Question 3 \[4 parts, 25 points total\]: SQL**

Consider the relational schema of question 2.  Express the following queries in SQL (feel free to<br>
abbreviate relation and  attribute names and to use INTERSECT and EXCEPT if you need to):<br>
**a)  (5  points)**  Find the cities that have direct (non-stop) flights to both Honolulu and Newark

&emsp;&emsp;`SELECT DISTINCT source_city`<br>
&emsp;&emsp;`FROM Flights F`<br>
&emsp;&emsp;`WHERE F.dest_city = “Honolulu”`<br>
&emsp;&emsp;`AND F.source_city IN`<br>
&emsp;&emsp;`(SELECT source_city`<br>
&emsp;&emsp;`FROM Flights F2`<br>
&emsp;&emsp;`WHERE dest_city = “Newark”)`

Could also be done with a self join on Flights, or with INTERSECT, or…, just can’t use a simple<br>
selction with “AND” in the Where clause --- this would return no tuples

**b)  (5  points)** Find the passenger\_id of all passengers who have a seat booked on a plane of type<br>
\`\`747'' from San Francisco to Washington.  **Do not return any duplicate values.**

&emsp;&emsp;`SELECT DISTINCT B.passenger_id`<br>
&emsp;&emsp;`FROM Flights F, Departures D, Bookings B`<br>
&emsp;&emsp;`WHERE B.flight_num = D.flight_num`<br>
&emsp;&emsp;`AND B.date = D.date`<br>
&emsp;&emsp;`AND F.flight_num = D.flight_num`<br>
&emsp;&emsp;`AND F.source_city = “San Francisco”`<br>
&emsp;&emsp;`AND F.destination_city = “Washington”`<br>
&emsp;&emsp;`AND D.plane_type = “747”`

Since key of Departures is flight\_num and date, you need both of these to do the join and find out<br>
what type of plane the passenger is booked on.

CS 186 Midterm - SOLUTIONS     October 18, 2000        Page 5 of 10


---

<a id="page-6"></a>
**Page 6**

Name:\_J. Bond\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_                  SID:\_\_ 007\_\_\_\_\_\_\_\_\_\_\_\_\_\_

**c)  (7 points)**   Find the passenger\_name of all passengers who have a seat booked on at least one<br>
plane of  **every**  type.

&emsp;&emsp;`SELECT DISTINCT passenger_name`<br>
&emsp;&emsp;`FROM Passengers P`<br>
&emsp;&emsp;`WHERE`<br>
&emsp;&emsp;`(SELECT COUNT(DISTINCT D.plane_type)`<br>
&emsp;&emsp;`FROM Departures D, Bookings B`<br>
&emsp;&emsp;`WHERE D.flight_num = B.flight_num`<br>
&emsp;&emsp;`AND D.date = B.date`<br>
&emsp;&emsp;`AND B.passenger_id = P.passenger_id)`<br>
&emsp;&emsp;`=`<br>
&emsp;&emsp;`(SELECT COUNT(DISTINCT D.plane_type)`<br>
&emsp;&emsp;`FROM Departures D)`

Alternatively:<br>
&emsp;&emsp;`SELECT DISTINCT P.passenger_name`<br>
&emsp;&emsp;`FROM Passengers P`<br>
&emsp;&emsp;`WHERE NOT EXISTS`<br>
&emsp;&emsp;`(SELECT D.plane_type`<br>
&emsp;&emsp;`FROM Departures D`<br>
&emsp;&emsp;`WHERE NOT EXITS`<br>
&emsp;&emsp;&emsp;&emsp;`(SELECT *`<br>
&emsp;&emsp;`FROM Departures D2, Bookings B`<br>
&emsp;&emsp;`WHERE D2.flight_num = B.flight_num`<br>
&emsp;&emsp;`AND D2.date = B.date`<br>
&emsp;&emsp;`AND B.passenger_id = P.passenger_id`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`AND D.plane_type = D2.plane_type))`

The first one is easier and does it by counting the number of plane types(we used a similar<br>
technique in class).  The second is trickier but is similar to the technique used in the book.

CS 186 Midterm - SOLUTIONS     October 18, 2000        Page 6 of 10


---

<a id="page-7"></a>
**Page 7**

Name:\_J. Bond\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_                  SID:\_\_ 007\_\_\_\_\_\_\_\_\_\_\_\_\_\_

**d)  (8  points)**  Print an ordered list of all source cities and the number of  distinct destination<br>
cities that they have direct (non-stop) flights to.  The list should be ordered in decreasing number<br>
of destinations and should contain **only those source cities that have flights to 25 or more**<br>
**distinct destinations**.<br>
For example, the output should look like:<br>
&emsp;&emsp;Source\_City           NumDestinations<br>
&emsp;&emsp;Chicago                120<br>
&emsp;&emsp;Atlanta                  106<br>
&emsp;&emsp;Boston              97<br>
&emsp;&emsp;...                        ...<br>
&emsp;&emsp;Austin                   25

&emsp;&emsp;`SELECT source_city,`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`COUNT(DISTINCT destination_city) AS NumDestinations`<br>
&emsp;&emsp;`FROM Flights F`<br>
&emsp;&emsp;`GROUP BY source_city`<br>
&emsp;&emsp;`HAVING NumDestinations >= 25`<br>
&emsp;&emsp;`ORDER BY NumDestinations DESC`

CS 186 Midterm - SOLUTIONS     October 18, 2000        Page 7 of 10


---

<a id="page-8"></a>
**Page 8**

Name:\_J. Bond\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_                  SID:\_\_ 007\_\_\_\_\_\_\_\_\_\_\_\_\_\_


### **Question 4 \[3 parts, 15  points total\]:  Disks and Buffer Management**

**a)  (3  points)**  The main components of the cost of performing a disk read are **seek time,**<br>
**rotational delay**, and **transfer time**. For each of these three components state whether or not it<br>
is reduced by doing  **sequential** reads rather than **random** reads:


![Figure on page 8](figures/solutions-p08-fig05.png)

**b) (2  points)** For the question above, which of the three is likely to result in the largest savings<br>
when comparing sequential reads to random reads?  (No explanation necessary)<br>
Seek Time<br>
**c) (10  points)**  Consider a page reference pattern that performs **three**  consecutive scans over a<br>
set of **five** pages. Assume you start with an empty buffer pool of **three** frames.  1) How many<br>
page faults will be incurred with an **LRU** page replacement policy, and  2) how many will be<br>
incurred with an **MRU** page replacement policy?<br>
1\) 15 page faults


![Figure on page 8](figures/solutions-p08-fig06.png)

2\) 9 Page faults


![Figure on page 8](figures/solutions-p08-fig07.png)

CS 186 Midterm - SOLUTIONS     October 18, 2000        Page 8 of 10


---

<a id="page-9"></a>
**Page 9**

Name:\_J. Bond\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_                  SID:\_\_ 007\_\_\_\_\_\_\_\_\_\_\_\_\_\_


### **Question 5 \[4 parts, 25  points total\]:  Indexes and File Organization**

**a)  (5  points)**  Suppose that you have a file that is already **sorted** in key order and you want to<br>
construct a dense, clustered B+ tree index on this file using \<key, RID\> pairs for data entries. A<br>
simple way to accomplish this is to create a B+tree, and then sequentially scan the file, inserting<br>
an index entry for each record using the normal B+tree insertion routine.  What **performance**<br>
**and storage utilization problems** are there with this approach?

Performance and storage utilization problem: Most leaf nodes are half full as a result of inserting<br>
sorted key values and splitting nodes at the leaf level in a way that each of the two nodes is half<br>
full. So utilization is roughly 50%. Also because the tree is large, the performance is not good.

Another performance problem is that to insert each key, the B+ tree is traversed from root to the<br>
leaf.

**b)  (4  points)  Briefly** describe a change to the B+tree insertion routine that would solve the<br>
problems you identified in part 5(a).<br>
Two solutions:<br>
&emsp;•    One is to change the splitting method. When a leaf node is split, do not move half key<br>
&emsp;&emsp;values to the newly created node. Just move the last key to the new node so that the left<br>
&emsp;&emsp;node is still full.<br>
&emsp;•    Bulk loading. That is to build B+ tree bottom up from sorted key values.

**c) (6 points) Circle** the basic file organization (heap, sorted, or hash) that is best for a large file<br>
where the most frequent operations are as follows (answer each separately – no explanation<br>
needed):<br>
&emsp;&emsp;1\) Search for records based on a range of field values.


![Figure on page 9](figures/solutions-p09-fig08.png)

&emsp;&emsp;&emsp;&emsp;**HEAP**         **HASH**

&emsp;&emsp;2\) Perform inserts and scans where the order of records does not matter.


![Figure on page 9](figures/solutions-p09-fig09.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**SORTED**         **HASH**

&emsp;&emsp;3\) Search for a record based on a particular field value.


![Figure on page 9](figures/solutions-p09-fig10.png)

&emsp;&emsp;&emsp;&emsp;&emsp;**HEAP**         **SORTED**

CS 186 Midterm - SOLUTIONS     October 18, 2000        Page 9 of 10


---

<a id="page-10"></a>
**Page 10**

Name:\_J. Bond\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_                  SID:\_\_ 007\_\_\_\_\_\_\_\_\_\_\_\_\_\_

**d)  (10  points)**  Create  a B+tree where each node can hold at most 3 pointers and 2 keys<br>
when the following keys are inserted in the following order:<br>
1, 10, 2, 11, 3, 4, 8, 5, 7<br>
Tree 1:


![Figure on page 10](figures/solutions-p10-fig11.png)

Tree 2:


![Figure on page 10](figures/solutions-p10-fig12.png)

Tree 3:


![Figure on page 10](figures/solutions-p10-fig13.png)

Tree 4 (different search algorithm):


![Figure on page 10](figures/solutions-p10-fig14.png)

CS 186 Midterm - SOLUTIONS     October 18, 2000        Page 10 of 10

