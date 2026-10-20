# Berkeley CS186 Fall 2006: Midterm 1: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/186>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Name\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Class Account: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;UNIVERSITY OF CALIFORNIA<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Department of EECS, Computer Science Division<br>
CS186    Hellerstein/Olston<br>
Fall 2006    Midterm Exam

&emsp;&emsp;&emsp;&emsp;&emsp;**Midterm Exam: Introduction to Database Systems**<br>
This exam has four problems and one extra credit question, worth different amounts of points each.  Each<br>
problem is made up of multiple questions.  You should read through the exam quickly and plan your time-<br>
management accordingly.  Before beginning to answer a problem, be sure to read it carefully and to answer<br>
all parts of every problem!


![Figure on page 1](figures/questions-p01-fig01.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Good luck!<br>
**1. Relational Query Languages \[20 points\]**<br>
Recently, Bob the Builder coded up a Relational Query Language Translator (RQLT) and passed<br>
it along to his lesser-known colleague, Ted the Software Test Engineer, for testing. Fortunately<br>
for Ted, the RQLT is simple and only operates on a single schema:<br>
Tool(tid, brand, cost)<br>
Jobsite(location, compensation, task)<br>
Toolbox(tbid, location) – location is a foreign key to Jobsite<br>
Holds(tbid, tid) – tbid is a foreign key to Toolbox, tid is a foreign key to Tool.<br>
&emsp;a. (5 points) Ted sets the RQLT to translate the following SQL query to Relational Algebra:<br>
&emsp;&emsp;SELECT T.tid<br>
&emsp;&emsp;FROM Tool T, Holds H, Toolbox B, Jobsite J<br>
&emsp;&emsp;WHERE T.tid = H.tid AND H.tbid = B.tbid<br>
&emsp;&emsp;AND B.location = J.location AND J.task = ’Plumbing’

&emsp;&emsp;Which of the following would be an equivalent Relational Algebra query?<br>
&emsp;&emsp;&emsp;1\. πtid(Tool     Holds     Toolbox     σtask = ‘Plumbing’ (Jobsite))<br>
&emsp;&emsp;&emsp;2\. πtid(σtask = ‘Plumbing’ (Tool     (Holds     Toolbox)     Jobsite))<br>
&emsp;&emsp;&emsp;3\. σtask = ‘Plumbing’ (πtid (Tool)     Holds     Toolbox     Jobsite)<br>
&emsp;&emsp;&emsp;4\. 1 and 2<br>
&emsp;&emsp;&emsp;5\. 1, 2, and 3<br>
&emsp;&emsp;&emsp;6\. None of the above<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;YOUR ANSWER HERE (1a): \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\- 1 -


---

<a id="page-2"></a>
**Page 2**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Name\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

b. (10 points) Ted switches the RQLT to translate Relational Algebra into Relational<br>
&emsp;Calculus and passes in:<br>
&emsp;πtbid(Toolbox) – πtbid(   ( πtbid(Toolbox) × πbrand(Tool) )<br>
&emsp;– πtbid,brand(Holds     Tool)          )<br>
&emsp;Fill in the blanks to complete the equivalent Relational Calculus Query.  Note: the<br>
&emsp;correct answer may not require all blanks to be filled in.<br>
&emsp;{ B1  \|  B ∈ Toolbox  \_\_\_\_\_\_\_\_\_\_\_ B.tbid = B1.tbid \_\_\_\_\_\_\_\_\_\_\_

&emsp;\_\_\_\_\_\_\_\_\_\_\_  T ∈ Tool

&emsp;(\_\_\_\_\_\_\_\_\_\_ H ∈ Holds (T.tid = H.tid \_\_\_\_\_\_\_\_\_\_ H.tbid = B.tbid)) }

c. (5 points) Ted thinks that he has found a bug in the RQLT.  It translates the<br>
&emsp;following Relational Calculus query:<br>
&emsp;{ H1 \| H ∈ Holds ∧ H1.tbid = H.tbid ∧<br>
&emsp;∀ Τ ∈ Tool ( (H.tid = T.tid)<br>
&emsp;⇒ (T.brand = ‘Craftsman’ ∨ T.brand = ‘Channellock’)) }<br>
&emsp;into the following incorrect SQL query (marked with line numbers for the purpose<br>
&emsp;of this question):<br>
&emsp;&emsp;1\. SELECT H.tbid<br>
&emsp;&emsp;2\.   FROM Tool T, Holds H<br>
&emsp;&emsp;3\.  WHERE T.tid = H.tid AND T.brand = ‘Craftsman’<br>
&emsp;&emsp;4\. INTERSECT<br>
&emsp;&emsp;5\. SELECT H1.tbid<br>
&emsp;&emsp;6\.   FROM Tool T1, Holds H1<br>
&emsp;&emsp;7\.  WHERE T1.tid = H1.tid AND T1.brand = ‘Channellock’;<br>
&emsp;Fix this SQL query to match the Relational Calculus query by changing exactly<br>
&emsp;ONE line:<br>
&emsp;Answer: Change line \_\_\_\_\_\_\_  into:

&emsp;\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\- 2 -


---

<a id="page-3"></a>
**Page 3**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Name\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

2\. **B+ Trees \[23 points\]**<br>
Consider the following B+ tree index of order 1:


![Figure on page 3](figures/questions-p03-fig02.png)

&emsp;a. (3 points) Circle all nodes (not index entries, but entire nodes) in the above figure<br>
&emsp;&emsp;that must be fetched to satisfy the query "Get all records with search key greater<br>
&emsp;&emsp;than or equal to 7 and less than 15".<br>
&emsp;b. (15 points) Assume we modify the B+ tree by adding the following keys **in the**<br>
&emsp;&emsp;**following order**:         **20, 27, 18, 30, 19**<br>
&emsp;&emsp;In the answer-boxes below, each row refers to a key being inserted in order, and<br>
&emsp;&emsp;each column asks if the insertion of that key results in a split of particular nodes.<br>
&emsp;&emsp;Assume that when splitting up an odd number of entries, the left node gets one<br>
&emsp;&emsp;more than the right.  Place a check mark  (✓) in each box whose answer is “Yes”.<br>
&emsp;&emsp;Blank boxes will be interpreted as “No”.  You may want to use the back of the<br>
&emsp;&emsp;previous page for scratch space.


![Figure on page 3](figures/questions-p03-fig03.png)

&emsp;**c.** (5 points) Suppose we were to insert all integers in the range 26 to 4112 inclusive<br>
&emsp;&emsp;(i.e. 26, 27, 28 ... , 4111, 4112) into the tree in part (a), one at a time. At most how<br>
&emsp;&emsp;many levels would the resulting B+-tree have? (Hint: You should not need to<br>
&emsp;&emsp;draw a B+-tree to figure this out!)<br>
YOUR ANSWER HERE (2c):  \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\- 3 -


---

<a id="page-4"></a>
**Page 4**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Name\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

**3. Query Optimization \[32 points\]**<br>
Consider the following schema:<br>
Guitars (gid, brand, price)<br>
Players (pid, name, age)<br>
LastPlayed (gid, pid, date)<br>
And the following query:<br>
SELECT P.name<br>
FROM Guitars G, Played P, LastPlayed L<br>
WHERE G.gid = L.gid AND P.pid = L.pid<br>
AND P.age \< 25 AND G.brand = ‘Gibson’<br>
AND G.price \> 3000;<br>
In the schema, Guitars.gid is the primary key of Guitars, Players.pid is the primary key<br>
of Players, and LastPlayed.gid and LastPlayed.pid are foreign keys referencing the<br>
primary keys of Guitars and Players (respectively).  Assume that the data is evenly<br>
distributed, and that the following properties hold:<br>
Players.age ranges from 10 to 85<br>
Guitars.brand has 10 distinct values<br>
Guitars.price ranges from 1,000 to 5,000<br>
Guitars.gid has 1,000 distinct values<br>
Players.pid has 1,000 distinct values<br>
a. (5 points) Compute the selectivity for each individual term in the WHERE clause.<br>
&emsp;You must fill in each blank below!<br>
&emsp;G.gid = L.gid      :   \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

&emsp;P.pid = L.pid      :  \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

&emsp;P.age \< 25        :  \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

&emsp;G.brand = ‘Gibson’ :  \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

&emsp;G.price \> 3000 :  \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\- 4 -


---

<a id="page-5"></a>
**Page 5**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Name\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**


![Figure on page 5](figures/questions-p05-fig04.png)

&emsp;b. (5 points)<br>
&emsp;&emsp;&emsp;According to the<br>
&emsp;&emsp;&emsp;System R query<br>
&emsp;&emsp;&emsp;optimizer that we<br>
&emsp;&emsp;&emsp;studied, circle all<br>
&emsp;&emsp;&emsp;the following join<br>
&emsp;&emsp;&emsp;orders that would<br>
&emsp;&emsp;&emsp;be considered:

&emsp;c. (12 points) Now consider the following.  There is a B+ tree index on Guitars.gid –<br>
&emsp;&emsp;&emsp;it is unclustered and it uses Alternative 2 to represent data entries.  Assume that,<br>
&emsp;&emsp;&emsp;on average, it takes 3 I/Os to retrieve a given data entry in a leaf of the index, and<br>
&emsp;&emsp;&emsp;that the following properties hold:<br>
&emsp;&emsp;&emsp;Guitars         40 bytes/tuple, 100 tuples/page, 10 pages<br>
&emsp;&emsp;&emsp;Players          80 bytes/tuple, 50 tuples/page, 20 pages<br>
&emsp;&emsp;&emsp;Lastplayed     20 bytes/tuple, 200 tuples/page, 100 pages<br>
&emsp;&emsp;&emsp;Assuming no buffering occurs, fill in the three blanks in the diagram below.


![Figure on page 5](figures/questions-p05-fig05.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**π P.name**  (on the fly)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**σ G.brand = ‘Gibson’ ^ G.price \> 3,000**  (on the fly)


![Figure on page 5](figures/questions-p05-fig06.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**L.gid = G.gid**  (index nested loops)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Guitars**  (B+tree on gid)

&emsp;&emsp;&emsp;&emsp;&emsp;**Players**  (file scan)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\- 5 -


---

<a id="page-6"></a>
**Page 6**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Name\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

d. (10 points) Consider the plan from part (c) again.  For each of the following<br>
&emsp;changes to it, mark the line “Y” (yes) or “N” (no) depending on whether it could<br>
&emsp;have led to a further reduction in the number of I/Os.  Consider each change<br>
&emsp;individually! Assume that any cost associated with setting up the described<br>
&emsp;change is not included in the execution cost, and that buffering is now being used.

&emsp;\_\_\_\_\_\_\_ Pushing down the selection on G.brand and G.price below the join

&emsp;\_\_\_\_\_\_\_ Creating a temporary file to store the results of the selection on P.age

&emsp;\_\_\_\_\_\_\_ Having the index on Guitars.gid be clustered

&emsp;\_\_\_\_\_\_\_ Projecting out P.age before the join

&emsp;\_\_\_\_\_\_\_ Changing the first join to block-oriented nested loops join.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\- 6 -


---

<a id="page-7"></a>
**Page 7**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Name\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

&emsp;**4. Query Execution \[25 points\]**<br>
&emsp;You have been hired to advise a major hot-dog vending franchise called “Dunce<br>
&emsp;Dog” to tune their database server installation.  They run a commercial DBMS called<br>
&emsp;Tentacle version 9y.  One of the startup parameters in Tentacle is called<br>
&emsp;query\_space; it tells Tentacle how many disk-blocks worth of RAM it should<br>
&emsp;allocate to use for sorting and hash joins.  Note that memory used for query\_space<br>
&emsp;is separate from the Tentacle buffer pool.<br>
&emsp;Dunce Dog is having problems running one of their monthly reporting queries.  It<br>
&emsp;uses the following tables:<br>
&emsp;Store(sid, location, owner)<br>
&emsp;ItemsForSale(iid, name, description, cost, price)<br>
&emsp;DetailedSales(receiptno, iid, sid)<br>
&emsp;The query is:<br>
&emsp;SELECT S.sid, S.location, SUM(I.price – I.cost) AS PROFIT<br>
&emsp;FROM Stores S, ItemsForSale I, DetailedSales D<br>
&emsp;WHERE S.sid = D.sid and D.iid = I.iid<br>
&emsp;GROUP BY S.sid, S.location<br>
&emsp;You determine that the query plan that Tentacle chooses is:


![Figure on page 7](figures/questions-p07-fig07.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\- 7 -


---

<a id="page-8"></a>
**Page 8**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Name\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

&emsp;a) (5 points) Tentacle performs aggressive projection – that is, it discards any<br>
&emsp;&emsp;attributes that it does not need as soon as possible.  For each edge in the query<br>
&emsp;&emsp;plan, write down the smallest list of attributes that needs to be retained (i.e. not<br>
&emsp;&emsp;discarded) on the corresponding dotted line.<br>
&emsp;b) (5 points) Assume that the result of the scan and projection of ItemsForSale fits in<br>
&emsp;&emsp;1000 pages, and the result of the scan and projection of DetailedSales fits in<br>
&emsp;&emsp;10,000 pages. Approximately how many blocks of query\_space should<br>
&emsp;&emsp;Tentacle need at minimum to perform the sort-merge join of ItemsForSale and<br>
&emsp;&emsp;DetailedSales in two passes? Feel free to round up or down by as many as 2<br>
&emsp;&emsp;blocks in any equations that you use, but if you do so, show your equations!

&emsp;c) (5 points) Assume that the result of the first join fits in 2,500 pages, and the result<br>
&emsp;&emsp;of the scan of Stores fits in 400 pages.  Approximating and showing work as in<br>
&emsp;&emsp;part (b), estimate the number of blocks of query\_space that Tentacle should<br>
&emsp;&emsp;need to perform the second join in the plan in two passes.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\- 8 -


---

<a id="page-9"></a>
**Page 9**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Name\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

&emsp;d)  (5 points) How much memory should Tentacle’s MAGICAGG operator need to<br>
&emsp;&emsp;perform GROUP BY and aggregation without I/O?  Again, feel free to round up<br>
&emsp;&emsp;or down by as many as 2 blocks.

&emsp;e) (5 points)  Using the variables b, c and d to represent your answers to parts (b), (c)<br>
&emsp;&emsp;and (d) respectively, which of the following represents the minimum value of<br>
&emsp;&emsp;query\_space that your client should use:<br>
&emsp;&emsp;&emsp;a. SUM(b, c, d)<br>
&emsp;&emsp;&emsp;b. MAX(b, c, d)<br>
&emsp;&emsp;&emsp;c. MIN(sqrt(b), sqrt(c), d)<br>
&emsp;&emsp;&emsp;d. logquery\_space MAX(b, c, d)

&emsp;&emsp;&emsp;&emsp;&emsp;YOUR ANSWER HERE (4e):  \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\- 9 -


---

<a id="page-10"></a>
**Page 10**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Name\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

**EXTRA CREDIT: The Disk Whisperer** (10 points)<br>
It’s exhausting being a disk drive, constantly seeking, scanning, transferring…  Since you<br>
are a sensitive Berkeley person, you are able to talk to your disk drive and it confides in<br>
you about how tough life is.<br>
Recently, your disk drive told you that it’s really tired of doing sort-merge joins.  You<br>
offered to let it do hash joins all the time, even when the optimizer used to choose sort-<br>
merge join.  Your disk responded, “Who cares – same stuff, different order.”<br>
Explain why your disk drive said that.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\- 10 -


---

<a id="page-11"></a>
**Page 11**

**Name\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

&emsp;&emsp;&emsp;\- 11 -


---

<a id="page-12"></a>
**Page 12**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Name\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\- 12 -

