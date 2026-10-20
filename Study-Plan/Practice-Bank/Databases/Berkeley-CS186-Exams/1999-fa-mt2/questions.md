# Berkeley CS186 Fall 1999: Midterm 2: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/186>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS 186, Midterm 2, Fall 1999<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**CS 186, Fall 1999**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Midterm 2**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Professor Hawthorn**

REFERENCE DATABASE. This is the Reference Database referred to in this exam.

There are four tables. SALESPERSON contains the names, ids, regions & quotas for the salespeople. Ids are<br>
unique, names are not, and there is only one salesperson per region. PRODUCTS contains the product names,<br>
product ids, and prices for the products. The product ids are unique.

&emsp;**SALESPERSON**


![Figure on page 1](figures/questions-p01-fig01.png)

**PRODUCTS**


![Figure on page 1](figures/questions-p01-fig02.png)

CUSTOMERS contains the customer names, customer ids, and regions for the customers (customer ids are<br>
unique), and ORDERS contains the customer id, the product id, and the product ordered per customer.


![Figure on page 1](figures/questions-p01-fig03.png)


![Figure on page 1](figures/questions-p01-fig04.png)

CS 186, Fall 1999 Midterm 2 Professor Hawthorn   1


---

<a id="page-2"></a>
**Page 2**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS 186, Midterm 2, Fall 1999


![Figure on page 2](figures/questions-p02-fig05.png)

**Problem #1**<br>
Which of the following queries shows the Sids of the salespeople and the total sales that they have made?<br>
**(Only one answer is correct)**

A. SELECT S.Sid, SUM (P.Price \* O.Quantity)<br>
&emsp;FROM Salesperson S, Orders O, Customers C, Products P<br>
&emsp;GROUP BY S.Sid<br>
&emsp;HAVING P.Pid = O.Pid AND O.Cid = C.Cid AND S.Region = C.Region<br>
B. SELECT S.Sid, SUM (P.Price \* O.Quantity)<br>
&emsp;FROM Salesperson S, Orders O, Customers C, Products P<br>
&emsp;WHERE P.Pid = O.Pid AND O.Cid = C.Cid AND S.Region = C.Region<br>
&emsp;GROUP BY S.Sid<br>
C. SELECT S.Sid, Temp1.Sum1<br>
&emsp;FROM Salesperson S, (SELECT( SUM (P.Price \* O.Quantity) AS Sum1)<br>
&emsp;FROM Orders O, Customers C, Products P<br>
&emsp;WHERE P.Pid = O.Pid AND O.Cid = C.Cid AND S.Region = C.Region) AS Temp1<br>
D. SELECT S.Sid, SUM (P.Price \* O.Quantity)<br>
&emsp;FROM Salesperson S, Orders O, Customers C, Products P<br>
&emsp;WHERE P.Pid = O.Pid AND O.Cid = C.Cid AND S.Region = C.Region<br>
E. NONE OF THE ABOVE

**Problem #2**<br>
Which of the following queries finds the regions for which there are no customers? **(Only one answer is**<br>
**correct!)**

A. SELECT S.Region<br>
&emsp;FROM Customers C, Salesperson S<br>
&emsp;WHERE S. Region NOT EQUAL C.Region<br>
B. SELECT C.Region, COUNT (C.Region)<br>
&emsp;FROM Customers C<br>
&emsp;GROUP BY C.Region<br>
&emsp;HAVING COUNT (C.Region) = NULL<br>
C. SELECT C.Region<br>
&emsp;FROM Customers C<br>
&emsp;WHERE C.Region NOT IN<br>
&emsp;SELECT \* FROM Salesperson

Problem #1   2


---

<a id="page-3"></a>
**Page 3**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS 186, Midterm 2, Fall 1999<br>
D. SELECT S.Region<br>
&emsp;FROM Salesperson S<br>
&emsp;WHERE NOT EXISTS<br>
&emsp;(SELECT \* FROM Customers C<br>
&emsp;WHERE C.Region = S.Region)<br>
E. NONE OF THE ABOVE

**Problem #3**<br>
Which is the correct answer below for the following query:

SELECT S.Sid, S.Region, C.Cname,<br>
FROM Salesperson S LEFT OUTER JOIN Customers C<br>
ON C.Region = S.Region


![Figure on page 3](figures/questions-p03-fig06.png)

B.


![Figure on page 3](figures/questions-p03-fig07.png)

NullWIDavidC.


![Figure on page 3](figures/questions-p03-fig08.png)

D.


![Figure on page 3](figures/questions-p03-fig09.png)

Problem #2   3


---

<a id="page-4"></a>
**Page 4**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS 186, Midterm 2, Fall 1999<br>
89 FL   Lin<br>
NullWIDavidE.NONE OF THE ABOVE

**Problem #4**<br>
Which of the following queries finds most expensive part? **(Only one answer is correct!)**

A. SELECT P.Pid<br>
&emsp;FROM Products P<br>
&emsp;WHERE P.Pprice = MAX (P.Pprice)<br>
B. SELECT P.Pid, MAX (P.Pprice)<br>
&emsp;FROM Products P<br>
&emsp;GROUP BY P.Pid<br>
C. SELECT P.Pid<br>
&emsp;FROM Products P1, Products P2<br>
&emsp;WHERE P1.Pprice \> P2.Pprice<br>
D. SELECT P.Pid<br>
&emsp;FROM Products P<br>
&emsp;WHERE P.Pprice = (SELECT MAX (P.Pprice)<br>
&emsp;FROM Products P)<br>
E. NONE OF THE ABOVE

**Problem #5**<br>
**Given the query:**<br>
SELECT C.Cname<br>
FROM Customers C, Orders O<br>
WHERE C.Cid = O.Cid and O.Pid IN<br>
SELECT O.Pid<br>
GROUP BY O.Pid<br>
HAVING COUNT (\*) \> 1

What is the result?


![Figure on page 4](figures/questions-p04-fig10.png)

Problem #3   4


---

<a id="page-5"></a>
**Page 5**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS 186, Midterm 2, Fall 1999


![Figure on page 5](figures/questions-p05-fig11.png)

E. NONE OF THE ABOVE

**Problem #6**<br>
What does the following query do (select one answer)?

SELECT Sname FROM Salesperson<br>
WHERE Region IN (SELECT Region FROM Customers WHERE Cid = ANY<br>
(SELECT Cid FROM Orders)<br>
GROUP BY Cid<br>
HAVING COUNT (\*) = (SELECT MAX (cnt)<br>
FROM (SELECT COUNT (\*) as cnt<br>
FROM Orders<br>
GROUP BY Cid)))

A. Finds the names of the salespeople for the customers who have the maximum number of orders.

B. Finds the names of all the salespeople who have the maximum number of customers.

C. Finds the names of all the salespeople who have more than one region.

D. Finds the names of all the salespeople who have any orders.

E. NONE OF THE ABOVE

**Problem #7**<br>
Assume that Customers and Salesperson are much larger than pictured on Page 1; that Customers has 100<br>
pages, 10 records per page, and that Salesperson has 50 pages, 5 records per page. Assume that the only<br>
indexes are: Salesperson has a clustered B-tree index on Sid, and a Hash index on Sname and Customers has a<br>
clustered B-tree index on Cid. Assume there are 10 buffer pages available.

What is the lowest cost query plan for the query: SELECT C.Cname FROM Customers C, Salesperson S<br>
WHERE S.Region = C.Region AND S.Sid = "25"?

Problem #5   5


---

<a id="page-6"></a>
**Page 6**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS 186, Midterm 2, Fall 1999


![Figure on page 6](figures/questions-p06-fig12.png)

A.

B.

C.

Problem #7   6


---

<a id="page-7"></a>
**Page 7**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS 186, Midterm 2, Fall 1999<br>
**Problem #8**<br>
The new DBA for the Reference Database has been given the following advice. Which one statement is<br>
always true?

A. Always put relations into third normal form

B. Always put hash indexes on fields used in equality selections

C. Never use two queries for something that can be expressed in one query

D. Always understand the workload on the system

**Problem #9**<br>
Let us assume that Customers and Salesperson are much larger than pictured on Page 1, and in addition that<br>
Orders is much larger than pictured on Page 1. Assume that the only indexes are: Salesperson has a clustered<br>
B-Tree index on Sid, and a Hash index on Sname; Orders has a clustered B-tree index on (Cid, Pid) and<br>
Customers has a clustered B-tree index on Cid.

Consider the query:<br>
SELECT S.Sname<br>
FROM Salesperson S, Customers C, Orders O<br>
WHERE S.Region = C.Region AND C.Cid = O.Cid and O.Pid = 152

Select the one statement below which is true.

A. No matter what the size of the relations, doing the selection O.Pid = 152 first will always be part of an<br>
&emsp;optimal plan.<br>
B. No matter what the size of the relations, an optimal plan will always need to scan Salesperson more than<br>
&emsp;once.<br>
C. No plan can use both keys in the (Cid, Pid) index.<br>
D. If Orders is very much larger than Customers, using the (Cid, Pid) index to join Orders and Customers<br>
&emsp;will cost less than a sort-merge join

**Problem #10**<br>
A new DBA has been hired for the Reference Database. They have done a worload analysis and determined<br>
that the most important and frequent query is the Sum\_orders query which sums up the dollar amount of each<br>
customer's order per day. To optimize this query, they decided that instead of having two different relations<br>
named Parts and Orders, there will be only relation:

Parts\_Orders, with fields Pname, Pid, Pprice, Cid, Quantity, Order\_Date. The Pid (Product ID) and is unique,<br>
and a single customer cannot order the same part twice on the same day. Select the one statement below which

Problem #8   7


---

<a id="page-8"></a>
**Page 8**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS 186, Midterm 2, Fall 1999<br>
is true.

A. The new design will always result in running the Sum\_orders query faster than having two tables.<br>
B. The Parts\_Orders table has two functional dependencies: Pid -\> (Pname, Pprice) and (Cid, Pid,<br>
&emsp;Order\_Date) -\> Quantity<br>
C. The Parts\_Orders table is invalid because it is in first normal form.<br>
D. The Parts\_Orders table is invalid because it has two keys.

**Problem #11**<br>
The following expression is in the where clause of a query:

((3 = 3) or (7 null)) and (3 null)

What does the above expression evaluate to (under 3 value logic)? \[ means not equal to\]

A. True

B. False

C. Unknown

D. None of the above

**Problem #12**<br>
We have two relations, A and B. A has 1000 tuples in 50 pages. A and B both have a clustered index on id;<br>
also id is a key for reach relation. If the query is

SELECT A. Name<br>
FROM A, B<br>
WHERE A.id = B.id

And we have two join methods, Block Nested Loop and Index Nested Loop, under what circumstances will<br>
Index Nested Loop result in dramatically fewer I/Os than Block Nested Loop?

A. If B has 100 tuples in 5 pages, and there are 25 buffers available, in addition to enough buffers to assure<br>
&emsp;that the indices are in the buffers (if needed).<br>
B. If B has 1000 tuples in 50 pages and there are 55 buffers available, in addition to enough buffers to assure<br>
&emsp;that the indices are in the buffers (if needed).<br>
C. If B has 10,000 tuples in 500 pages and there are 25 buffers available, in addition to enough buffers to<br>
&emsp;assure that that the indices are in the buffers (if needed).<br>
D.

Problem #10   8


---

<a id="page-9"></a>
**Page 9**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS 186, Midterm 2, Fall 1999<br>
&emsp;If B has 10,000 tuples in 500 pages and there are 502 buffers available, in addition to enough buffers to<br>
&emsp;assure that the indices are in the buffers (if needed).

**Problem #13**<br>
Assume we have a relation A that has 10,000 tuples, the values of its attribute x range from 7 to 80. And there<br>
are 50 distinct values of x. We also have relation B, which has 20 tuples, and the values of its attribute y range<br>
from 10 to 50. There are 2000 pages in A and 5 pages in B, and there are at least 10 buffer pages available.<br>
Consider the join

`SELECT A.x`<br>
`FROM A,B`<br>
`WHERE A.x = B.y`

Now suppose that y is a candidate key for relation B. If attribute x is not a candidate key, and A is already<br>
clustered on a different key, x is uniformaly distributed, which one statement below is true to assure the<br>
lowest cost for this query?

A. A good DBA will put a B-tree index on A.x but B.y does not need an index because it fits in memory.<br>
B. A good DBA will put a hash index on A.x and a hash index on B.y.<br>
C. A good DBA will put a B-tree index on A.x and a clustered index on B.y.<br>
D. A good DBA will put a hash index on A.x and a clustered index on B.y.

**Problem #14**<br>
The new DBA for the Reference Database needs to make sure that the salesperson cannot change their own<br>
quotas. There is a group Snums which defines the system ids of the salespeople, and the salespeople alreayd<br>
cannot delete anything in the Salesperson relation. Which of the following SQL statements should be used?

A. REVOKE UPDATE ON Salesperson(Quota) FROM Snums<br>
B. REVOKE INSERT, UPDATE ON Salesperson(Quota) FROM Salesperson.Sid where Salesperson.Sid IN<br>
&emsp;Snums<br>
C. REVOKE SELECT ON Salesperson(Quota) FROM Snums<br>
D. ON INSERT INTO Salesperson CHECK Salesperson.Sid NOT EQUAL Snum

**Problem #15**<br>
Given the following sequence of events

&emsp;•   Joe created a table called Customers for his database class.

Problem #12   9


---

<a id="page-10"></a>
**Page 10**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS 186, Midterm 2, Fall 1999<br>
&emsp;•   Joe gave his project partner Cathy Select privilege on Customers with the option of granting Select<br>
&emsp;&emsp;permission.<br>
&emsp;•   Joe gave his other project partner Dennis Select privilege on Customers with the option of granting<br>
&emsp;&emsp;Select permission.<br>
&emsp;•   Dennis in turn decided to give select privileges to his friends Peter, and Mary (to show off his cool<br>
&emsp;&emsp;tables he created).<br>
&emsp;•   Cathy also being a friend of Peter, also decided to give Peter select privileges to the Customer's table.<br>
&emsp;•   After the 3rd week of classes, Dennis decided to drop the class, and so Joe revoked Dennis' privileges<br>
&emsp;&emsp;with the cascade option.

Which of the following is a list of people who still have SELECT privileges from the Customer table?

A. Cathy and Joe<br>
B. Joe ONLY<br>
C. Joe, Cathy, Peter, Mary<br>
D. Joe, Cathy, Peter<br>
E. Joe, Cathy, Mary

**Problem #16**<br>
Given the following Query

SELECT \*<br>
FROM Salesperson S, Customers C, Orders O, Products P<br>
WHERE S.region = C.region AND O.cid = C.cid AND O.pid = P.pid AND O.cid = 5

Assume that there are no indexes on any of the tables. Which of the following join orders will have the least<br>
I/O cost.

A. (((S, P) C) O)<br>
B. (((C, S) P) O)<br>
C. (((O, C) P) S)<br>
D. (((C, S) O) P)<br>
E. (((O, S) C) P)

Clarification: Choice A means we first join S and P, then join that result with C, and finally join that result<br>
with O.

&emsp;**Posted by HKN (Electrical Engineering and Computer Science Honor Society)**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**University of California at Berkeley**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**If you have any questions about these online exams**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**please contact**  **examfile@hkn.eecs.berkeley.edu.**

Problem #15   10

