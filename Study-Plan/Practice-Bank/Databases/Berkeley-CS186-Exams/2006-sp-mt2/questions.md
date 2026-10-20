# Berkeley CS186 Spring 2006: Midterm 2: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/186>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**University of California, Berkeley**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**College of Engineering**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Computer Science Division – EECS**<br>
Spring 2006    Prof. Michael J. Franklin<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**MIDTERM II**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS 186 Introduction to Database Systems


### **Question 1 – SQL \[6 parts, 40 points total\]**

Consider the following basketball schema with four relations (primary keys are<br>
underlined):<br>
**Player** (pid: integer, pname: varchar(50), team: varchar(30))<br>
Each player plays for only one team.  The team field is a foreign key to Team.<br>
**Team** (tname: varchar(30), city: varchar(20))<br>
There can be multiple teams from the same city.<br>
**Game** (gameid: integer, homeTeam: varchar(30), awayTeam: varchar(30),<br>
&emsp;&emsp;homeScore: integer, awayScore: integer)<br>
homeTeam and awayTeam are foreign keys to Team.  Two teams may play each other<br>
multiple times each season.  The homeTeam and awayTeam are always different.  Ties<br>
are not allowed.<br>
**Stats** (pid: integer, gameid: integer, points: integer, assists: integer, rebounds:<br>
&emsp;&emsp;integer)<br>
**Stats** records the performance statistics of a player within a game.  If a player does not<br>
play in a particular game, they will not have any statistics recorded for that game.<br>
gameid is a foreign key to Games.  pid is a foreign key to Player.<br>
Write **SQL** queries for the following.  **All of these are doable without creating views or**<br>
**temporary tables.  You may do so if you feel it is necessary but we’ll take off some**<br>
**points if you do.  We will also take off points for doing unnecessary joins, distincts,**<br>
**etc.**:<br>
**a) \[3 points\]**  How many different players have scored more than 50 points in a game?

**b) \[5 points\]**  For all the Players who have played in at least one game, list their pid and<br>
the total number of points they have scored.  Return the list in descending order of the<br>
total number of points.


---

<a id="page-2"></a>
**Page 2**


### **Question 1 – SQL continued**

Recall the schema:<br>
Player (pid, pname, team)<br>
Team (tname, city)<br>
Game (gameid, homeTeam, awayTeam, homeScore, awayScore)<br>
Stats (pid, gameid, points, assists, rebounds)<br>
**c) \[5 points\]**  A “triple double” is when a player’s number of assists, rebounds, and points<br>
in a game are all 10 or more.  For each triple double, list the name (pname) and team<br>
(tname) of the player who got it, and the city where the game was played.

**d) \[7 points\]**  List the names of teams who never lost a game at home.


---

<a id="page-3"></a>
**Page 3**


### **Question 1 – SQL continued**

Recall the schema:<br>
Player (pid, pname, team)<br>
Team (tname, city)<br>
Game (gameid, homeTeam, awayTeam, homeScore, awayScore)<br>
Stats (pid, gameid, points, assists, rebounds)<br>
**e) \[10 points\]**  List the name of each team that won more games at home than they lost at<br>
home.

**f) \[10 points\]**  List the name of each team and a count of the number of games the team<br>
has won overall (i.e., regardless of whether they were the home team or away team).


---

<a id="page-4"></a>
**Page 4**


### **Question 2 – Hashing \[4 parts, 15 points total\]**

Consider a relation containing information about university students:<br>
Students (sid: integer, sname: varchar(50), street: varchar(50), city: varchar(30),<br>
&emsp;&emsp;age: integer)<br>
consisting of 250,000 tuples, where there are 100 tuples per block (i.e., the students file is<br>
2500 blocks long).<br>
**a) (2 points)**  Consider a simple, 2-pass disk-based hashing strategy as described in<br>
lecture, where in the first pass the file is partitioned and in the second pass each of the<br>
partitions is hashed (i.e., not hybrid hashing!).  Ignoring any space overhead for building<br>
hash tables and assuming a perfect hash function, what is the minimum number of<br>
memory pages (same size as file blocks) required to hash the Students relation in 2<br>
passes?

**b) (3 points)**  In part (a) above, how many I/Os will be required?  Assume that the<br>
relation is originally on disk and that the result of the hashing operation must also be<br>
written to disk.

**c) (5 points)**  Now, suppose that the hash function used for part (a) does not work very<br>
well.  Describe briefly why 2 passes may not be sufficient and how a complete algorithm<br>
would solve this problem.

**d) (5 points)**  Now, consider a combined Hash/Aggregation operator using “hybrid<br>
hash”, such as the one you implemented in HW 2 and the query “**SELECT COUNT(\*)**<br>
**FROM Students GROUP BY age**”.  Given a relatively small amount of memory (say,<br>
20 pages or so), would you expect the hybrid hash approach to perform better than the<br>
regular two-pass hashing approach on this query?  Why or why not? (state any<br>
assumptions you are making and answer concisely)


---

<a id="page-5"></a>
**Page 5**


### **Question 3 – Query Optimization \[4 parts, 25 points total\]**

Consider the following relational schema (with primary keys underlined):<br>
**STUDENTS** (sid, s\_name, street, city, age)<br>
**COURSES** (cid, c\_name, prof\_name)<br>
**REGISTERED** (sid, cid, credits)<br>
Where sid and cid are foreign keys referencing STUDENTS and COURSES<br>
&emsp;&emsp;respectively.<br>
With the following characteristics:<br>
&emsp;• The **STUDENTS** relation has 10,000 tuples<br>
&emsp;• 20 tuples of **STUDENTS** fit in one disk block<br>
&emsp;• NKeys(city) for **STUDENTS** is 200 (i.e., there are 200 distinct values for city)<br>
&emsp;• NKeys(age) for **STUDENTS** is 50<br>
&emsp;• The **REGISTERED** relation has 40,000 tuples<br>
&emsp;• 50 tuples of **REGISTERED** fit in one disk block<br>
&emsp;• The **COURSES** relation has 500 tuples<br>
&emsp;• 40 tuples of **COURSES** fit in one disk block<br>
and the following indexes:<br>
&emsp;• A hash index is defined on sid for **STUDENTS**<br>
&emsp;• A clustered B+Tree index is defined on the city attribute for **STUDENTS**<br>
&emsp;• An unclustered B+Tree index is defined on the age attribute for **STUDENTS**<br>
For parts **a, b, and c**, state an efficient method for answering this query and state how<br>
many disk accesses will have to be made in order to answer the query using this method.<br>
Be sure to state which index(es) if any you are using.  State any assumptions you are<br>
making.  Note, you cannot assume that any of the relations fit in memory.  Part of your<br>
grade will depend on how efficient a solution you choose.<br>
**a) \[5 points\]**   SELECT \*<br>
FROM STUDENTS<br>
WHERE city = ‘Berkeley’ and age = 30;


---

<a id="page-6"></a>
**Page 6**


### **Question 3 – Query Optimization** (continued)

**b) \[5 points\]**   SELECT \*<br>
FROM STUDENTS<br>
WHERE city = ‘Berkeley’ and sid = 123456789;

**c) \[7 points\]**  Assuming there are five (5) pages of memory available for use in by the<br>
join, there are no indexes on **REGISTERED** or **COURSES**, and they are not currently<br>
sorted, choose an efficient method for computing the join of these two relations and<br>
estimate the number of disk I/Os it would incur.  Be sure to state the join method you<br>
have chosen, and which relation is inner or outer if appropriate.

**d) \[8 points\]**  Consider the three way join between **STUDENTS**, **COURSES**, and<br>
**REGISTERED**.  Show an efficient join ordering (no need to specify a join method for<br>
this question) and estimate the number of tuples that will be in the result of each of the<br>
joins.


---

<a id="page-7"></a>
**Page 7**


### **Question 4 – More Query Optimization \[5 parts, 20 points total\]**

Recall the Basketball schema from Question 1:<br>
**Player** (pid, pname, team);  **Team** (tname, city)<br>
**Game** (gameid, homeTeam, awayTeam, homeScore, awayScore)<br>
**Stats** (pid, gameid, points, assists, rebounds)<br>
**a) \[5 points\]**  Consider the four-way join of these relations.  Give one join ordering that a<br>
System-R optimizer would **NOT** consider, and briefly state why it would not consider it.

**b) \[3 points\]**  Write a SQL SELECT statement that could take advantage of a composite<br>
B+tree index on Stats using the composite key (points, assists, rebounds) but could **not**<br>
take advantage of a composite B+tree index using (assists, rebounds, points).

**c) \[3 points\]**  Write a SQL SELECT statement that could take advantage of a B+tree<br>
index on Stats using the key (points) but could **not** take advantage of a Hash index using<br>
the key (points).

**d) \[5 points\]**  Assume that in the Stats relation, there are 10,000 tuples with 50 unique<br>
values for “points” and 20 unique values for “rebounds”.  What is the expected<br>
cardinality computed by a System R-style optimizer for the predicate “points = rebounds”<br>
on the Stats relation?

**e) \[4 points\]**  Consider the “points” attribute of the Stats relation.  Why might a query<br>
optimizer that maintains histograms over values of points provide better query plans than<br>
one that uses the System R approach of keeping only the high-low values and the number<br>
of distinct values?

