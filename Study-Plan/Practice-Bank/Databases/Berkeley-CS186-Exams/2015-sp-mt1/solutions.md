# Berkeley CS186 Spring 2015: Midterm 1: Official solutions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/186>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**


![Figure on page 1](figures/solutions-p01-fig01.png)

**Midterm 1: CS186, Spring 2015**<br>
Prof. J. Hellerstein

You should receive a double-sided answer sheet and a 7-page exam. Mark your name and login on **both**<br>
sides of the answer sheet, and in the blanks above. For each question, place **only your final answer** on<br>
the answer sheet—do not show work or formulas there.  You may use the backs of the questions for<br>
scratch paper, but **do not tear off any pages**.We will ask you to turn in your question sheets as well as<br>
your answers.

**I. Query Processing \[24 points + 5 extra credit\]**<br>
Frank Underwood wants to collect opinion survey data to reassure citizens that he’s listening.<br>
The database system used by Underwood is configured so that **100 pages** are available for<br>
each operator (sort, hash, join, etc.) that is used in a query plan. For the `SurveyResponse`<br>
table described below, there are **2000 records** per page. Each page access is an I/O.

`SurveyResponse(`<br>
`response_id int,`<br>
`district text,`<br>
`state text,`<br>
`comments text,`<br>
`...`<br>
`)`

1\. \[4 points\] After collecting survey results for the first month, the survey data file has grown to<br>
&emsp;**9,500 pages**.  Assuming we are using external merge sort to sort the survey results by<br>
&emsp;district and that you must **include the cost of writing the output to disk,** are the following<br>
&emsp;statements **True** or **False**?  (Remember to put your answers on the **answer sheet!)**


![Figure on page 1](figures/solutions-p01-fig02.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1


---

<a id="page-2"></a>
**Page 2**


![Figure on page 2](figures/solutions-p02-fig03.png)

(1 + log\_{11 - 1} ( 11000 / 11)) \* 2 (11000) = (1 + log\_{10} (1000)) \* 2 \* 11000 = **88,000 I/O’s**

**(Query Processing, continued)**<br>
Underwood wants to better utilize the survey responses so that he can reach out to local<br>
representatives to discuss important and relevant issues. In addition to the previous **11,000-**<br>
**page** `SurveyResponse` table, there exists another table called `Representative` that<br>
contains each local official’s full name; it consists of **500 pages** with **5000 records per page**.<br>
`Representative(`<br>
`rep_id int,`<br>
`full_name text,`<br>
`district text,`<br>
`state text,`<br>
`...`<br>
`)`<br>
3\. \[5 points\] Assume that we once again make **100 pages** available to each query operator.<br>
&emsp;How many I/O’s are required to perform a simple, “unoptimized” sort-merge join between the<br>
&emsp;`Representative` and `SurveyResponse` relations on the `district` and `state` attributes?<br>
&emsp;Again, **include the cost of writing the output.**<br>
&emsp;(To clarify what we mean by “unoptimized” sort merge join, the algorithm is as follows. First,<br>
&emsp;completely sort each relation on its join attribute, writing the results to disk.  Then, merge the<br>
&emsp;two sorted relations together, and include the cost of writing the resulting output to disk. You<br>
&emsp;should assume that the number of records with duplicate district and state attributes is<br>
&emsp;negligibly small, so no pathological “nested loops” I/O behavior occurs during merge.)<br>
2 passes to sort 500 pages<br>
3 passes to sort 11,000 pages<br>
cost to sort SurveyResponse + cost to sort Representative + cost to join<br>
= 2\*500 \* 2 + 2 \* 11000 \* 3 + 11000 + 500 = **79500 I/O’s**

4\. \[5 points\] Assume we want to optimize our join from the previous question as we discussed<br>
&emsp;in class—combining the last phase of sorting with the merge join. If the `Representative`<br>
&emsp;relation is of size **L pages** and the `SurveyResponse` relation is of size **S pages**, **how**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2


---

<a id="page-3"></a>
**Page 3**

&emsp;**many pages (B)** do you need for your buffer to perform a sort-merge join between<br>
&emsp;`Representative` and `SurveyResponse` in just **2 passes**? Please **write the expression**<br>
&emsp;that describes the number of buffer pages B in terms of L and S. **You do not need to solve**<br>
&emsp;**for B**; please just write the expression.

During the merge & join phase, we have B-1 input buffers to work with. If we wanted to have all<br>
the runs that were generated fit in one go, we can only have at most B - 1 sorted runs after pass<br>
0\. B - 1 must be equivalent to the number of sorted runs, which is equivalent to L / B + S / B.

**Hence, L / B + S / B \<= B - 1   or   L + S \<= (B - 1 ) \* B**

**(Query Processing, continued)**<br>
For the remainder of this question, assume that:<br>
&emsp;● The size of the relation Messages is **20000 pages**.<br>
&emsp;● You have **102 pages** available in memory for your query processing algorithms<br>
&emsp;● I/O cost refers to the number of disk reads and writes required by your procedure.<br>
&emsp;● You **do** need to account for the cost to read the relations in from disk.<br>
&emsp;● You **do** need to account for the cost to write your final output to disk.<br>
Please disregard any caching effects of the buffer pool—assume that any memory that is used<br>
is controlled explicitly by the join algorithms.<br>
You work for the NSA a secure messaging app trying to gather some statistics to collect<br>
intelligence improve your service.<br>
You have the following table:<br>
`Messages(message_id int,`<br>
`sender_id int,`<br>
`receiver_id int,`<br>
`encrypted_content text,`<br>
`timestamp date,`<br>
`...)`<br>
You want to make a graph of people who have talked to each other. In other words, the pair (A,<br>
B) should show up in our output if person A has sent person B at least one message and person<br>
B has sent person A at least one message. You send your system this query:<br>
`SELECT M1.sender_id, M2.sender_id`<br>
`FROM Messages M1, Messages M2`<br>
`WHERE M1.sender_id = M2.receiver_id`<br>
`AND M1.receiver_id = M2.sender_id;`<br>
Assume that `sender_id` and `receiver_id` are foreign keys pointing to some other table that<br>
uniquely identifies people using our service.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3


---

<a id="page-4"></a>
**Page 4**

5\. \[5 points\] What is the cost of a hash join of Messages with itself? Use the `receiver_id` of<br>
&emsp;the first instance of `Messages` and the `sender_id` of the second instance of Messages as<br>
&emsp;your hash key. Assume we have hash functions that distribute these keys perfectly.  Use the<br>
&emsp;hash join algorithm from class; do not attempt to invent any special optimizations for self-<br>
&emsp;joins.<br>
&emsp;&emsp;200,000 I/Os (we need two full passes of Messages)<br>
6\. **Extra Credit \[5 points\]:**  Now you want to optimize hash join for the special case of this<br>
&emsp;particular self-join. In particular, you want to hash `Messages` only once.<br>
&emsp;&emsp;a. What should be the input to the hash function? Accepted any answer that produced<br>
&emsp;&emsp;&emsp;a symmetric hash (hash(sender, receiver) = hash(receiver, sender))<br>
&emsp;&emsp;b. What is the cost of this optimized hash join?<br>
&emsp;&emsp;&emsp;100,000 I/Os (half of 5.)<br>
**II. File Organization + Indexes \[9 points\]**<br>
Consider the following table:<br>
`CREATE TABLE Students (`<br>
`sid INT PRIMARY KEY,`<br>
`name VARCHAR(20),`<br>
`email VARCHAR(20),`<br>
`gpa FLOAT,`<br>
`years_enrolled INT,`<br>
`);`<br>
Consider the following three queries:<br>
(A) `SELECT * FROM Students WHERE years_enrolled >= 2`;<br>
(B) `DELETE FROM Students WHERE id = 123456;`<br>
(C) `INSERT INTO Students VALUES (9999, 'Joe', 'j@b.com', 4.0, 2);`<br>
1\. \[6 points\] For this question, assume there are not any indexes, and we **leave each page**<br>
&emsp;**about 2/3 full**. Order these queries in **ascending order by the total number of I/Os**<br>
&emsp;**required** to execute them; ties can be listed in any order.<br>
&emsp;&emsp;a. If `Students` table is arranged in a heap file, what is the order of the queries?<br>
&emsp;&emsp;&emsp;C, B, A<br>
&emsp;&emsp;b. If `Students` table is arranged in a sorted file, sorted on SID, what is the order of<br>
&emsp;&emsp;&emsp;queries?<br>
&emsp;&emsp;&emsp;B, C, A or C, B, A<br>
&emsp;&emsp;c. What would be the size of a single tuple using fixed length records? Assume that all<br>
&emsp;&emsp;&emsp;numeric types are 4 bytes long.<br>
&emsp;&emsp;&emsp;4 + 20 + 20 + 4 + 4 = 52 bytes<br>
Now, consider the following query: `SELECT * FROM Students WHERE SID=2357777`.<br>
Assume that we could build:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4


---

<a id="page-5"></a>
**Page 5**

&emsp;&emsp;&emsp;i.    An alternative 1 B+-tree on SID<br>
&emsp;&emsp;&emsp;ii.    An alternative 2, clustered B+-tree on SID<br>
&emsp;&emsp;&emsp;iii.    An alternative 3, clustered B+-tree on SID<br>
&emsp;&emsp;&emsp;iv.    An alternative 2 unclustered B+-tree on SID

2\. \[2 points\] Please mark each of the following statements True or False on the answer sheet<br>
&emsp;&emsp;a. Index (ii) can provide better performance for this query than Index (iv), due to the<br>
&emsp;&emsp;&emsp;potential for improved spatial locality in a clustered index.<br>
&emsp;&emsp;&emsp;False - Since SID is a primary key, only one tuple will match<br>
&emsp;&emsp;b. Index (i) may be taller than Index (ii).<br>
&emsp;&emsp;&emsp;True - In Alternative 1, data lives in the index, so data pages are index pages<br>
3\. \[1 point\] For which of the five fields (`sid, name, email, gpa, years_enrolled`)<br>
&emsp;would you most expect an alternative 3 index to be more space efficient than an alternative<br>
&emsp;2 index?<br>
&emsp;years\_enrolled - the field with the most duplicates (aka the least cardinality)<br>
**III. Buffer Replacement \[12 points\]**<br>
1\. \[2 points\] Given 4 buffer pages and an access pattern of pages:<br>
&emsp;I, L, O, V, E, D, B, Y, I, P, P, E<br>
&emsp;Which pages are in the buffer pool at the end if we used an MRU cache policy?<br>
&emsp;ELOY

2\. \[2 points\] Given 4 buffer pages and an access pattern of pages:<br>
&emsp;A, B, T, P, H, A, C, N, M, O, A, A, D, E, A, B, C, B, E, A, F, G, H, A, C, N, M, O, A, T, P, H,<br>
&emsp;(Hint: you don't need to draw out a chart with every page access!)<br>
&emsp;Which pages are in the buffer pool at the end if we used an LRU cache policy?<br>
&emsp;ATPH - the last four page requests will necessarily be in the buffer pool with LRU

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;5


---

<a id="page-6"></a>
**Page 6**

3\. \[2 points\] Given that we are using a clock replacement policy, the state of which is shown<br>
&emsp;below.  On the next replacement request, the first frame to be considered is the one where<br>
&emsp;the clock hand is currently pointing.


![Figure on page 6](figures/solutions-p06-fig04.png)

&emsp;&emsp;b. What is the reference bit of the frame holding E after E is unpinned? 1

4\. \[6 points\] Assume that we have a database workload that repeatedly scans a single relation<br>
&emsp;R, which is much bigger than the buffer pool. We learned in class that LRU replacement<br>
&emsp;performs poorly in this case.  Consider the following replacement policies:<br>
&emsp;&emsp;i.    Least-Recently Used (LRU): replace the page in the least-recently unpinned frame.<br>
&emsp;&emsp;ii.    Most-Recently Used (MRU): replace the page in the most-recently unpinned frame.<br>
&emsp;iii.    Pin All But One (PABO): Given B buffers, pin the first B-1 pages that you access into<br>
&emsp;&emsp;&emsp;B-1 frames, and always replace the page in the remaining frame.<br>
&emsp;iv.    Random: Choose the page to replace randomly among the unpinned pages.

&emsp;a. Which of the five protocols performs optimally for this workload? (Note: the correct<br>
&emsp;&emsp;answer may be zero, one, or more than one of the above!)<br>
&emsp;&emsp;(ii) MRU

&emsp;&emsp;Note: this question is tricky! It’s tempting to say PABO as well, but a small example<br>
&emsp;&emsp;shows MRU outperforms PABO for sequential flooding:

&emsp;&emsp;Sequential flooding over ABCDEF (6 pages) with 4 page buffer

&emsp;&emsp;MRU:<br>
&emsp;&emsp;Pass0: buffer is now ABCF<br>
Pass1: buffer is now ABEF (hits: ABCF, misses: DE), hit rate: 4/6<br>
&emsp;&emsp;Pass2: buffer is now ADEF (hits: ADEF, misses: BC), hit rate: 4/6<br>
…

&emsp;&emsp;PABO:<br>
&emsp;&emsp;Pass0: buffer is now ABCF<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;6


---

<a id="page-7"></a>
**Page 7**

&emsp;&emsp;Pass1: buffer is now ABCF (hits: ABC, misses: DEF), hit rate: 3/6<br>
&emsp;&emsp;Pass2: buffer is now ABCF (hits: ABC, misses: DEF), hit rate: 3/6

&emsp;b. Which of the five protocols performs pessimally (as badly as possible) for this workload?<br>
&emsp;&emsp;(Again, could be zero, one, or more than one!)<br>
&emsp;&emsp;(i) LRU

&emsp;c. Which of the five protocols is worse than Random (again: could be 0, 1, or more!)<br>
&emsp;&emsp;(i) LRU

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;7


---

<a id="page-8"></a>
**Page 8**

**IV B+-Trees \[14 points\]**<br>
Assume we have the following B+-Tree of order 1. Each index node must have either 1 or 2<br>
keys (2 or 3 pointers), and the leaf nodes can hold up to 2 entries.


![Figure on page 8](figures/solutions-p08-fig05.png)

1\. \[5 points\] What is the maximum number of keys you could insert that would NOT change the<br>
&emsp;height of the above tree?<br>
12<br>
A possible insertion pattern is: 12, 25, 42, 73, 41, 40, 74, 71, 39, 38, 70, 69<br>
2\. \[5 points\] What is the minimum number of keys you could insert to change the height of this<br>
&emsp;tree?<br>
3<br>
A possible insertion pattern is: 1, 4, 5<br>
Assume that the following B+-Tree is an unclustered, alternative-2 index on gpa. The actual<br>
data is laid out in a separate heap file as shown below, where each record is depicted by its<br>
key, followed by an asterisk to represent the rest of the record. There are pointers (not shown)<br>
from the leaf pages of the B+-tree to the corresponding tuples in the heap file.<br>
3\. \[2 point\] How many **leaf index pages** would be read by the following query?<br>
&emsp;`SELECT * FROM Students WHERE gpa >= 1.4 AND  gpa <= 3.5`<br>
4<br>
Labeling each leaf index page from 0 to 5 from left to right, the following leaf pages would<br>
be read: 1, 2, 3, 4<br>
4\. \[2 point\] How many **heap file page** reads would you read if you simply followed the record<br>
&emsp;ids in the index data entries as soon as you see them (i.e., if you did not sort the record ids<br>
&emsp;first)? Assume you can only hold one heap file page in memory at any time.<br>
9<br>
Labeling each heap file page from 0 to 4 from left to right, here is the access pattern for<br>
the heap file page reads: 0, 1, 2, 3, 2, 4, 0, 4, 3

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;8


---

<a id="page-9"></a>
**Page 9**


![Figure on page 9](figures/solutions-p09-fig06.png)

0                          1                     2                        3                       4                        5<br>
**Heap File:**


![Figure on page 9](figures/solutions-p09-fig07.png)

0                              1                             2                           3                            4

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;9


---

<a id="page-10"></a>
**Page 10**

**V Query Languages \[15 points\]**<br>
1\. \[3 points\] Consider two relations with the same schema: R(A,B) and S(A,B). Which one of the


![Figure on page 10](figures/solutions-p10-fig08.png)

&emsp;&emsp;d. They are all equivalent.<br>
Everyone was given credit on this question.<br>
The correct answer is b:<br>
A counter example is R(A, B) = {(1,2), (1,3)}, S(A, B) = {(1,2)}. a and c will have size 1,<br>
while b will have size 0.

The CS 186 TAs have decided to go into real estate! All of the information we need is described<br>
by the following schema, where the primary key of each table is underlined:<br>
`Homes(home_id int, city text, bedrooms int, bathrooms int,`<br>
`area int)`<br>
`Transactions(home_id int, buyer_id int, seller_id int,`<br>
`transaction_date date, sale_price int)`<br>
`Buyers(buyer_id int, name text)`<br>
`Sellers(seller_id int, name text)`

For the query language questions below, **fill in the blanks on the answer sheet** to complete<br>
the query. For each SQL query and nested subquery, please **start a new line when you reach**<br>
**a SQL keyword** (SELECT, WHERE, AND, etc.). However, do not start a new line for aggregate<br>
functions (COUNT, SUM, etc.), and comparisons (LIKE, AS, IN, NOT IN, EXISTS, NOT<br>
EXISTS, ANY, or ALL.)

2\. \[2 points\] Fill in the blanks in the SQL query to find the duplicate-free set of id's of all homes<br>
&emsp;in Berkeley with at least 6 bedrooms and at least 2 bathrooms that were bought by "Bobby<br>
&emsp;Tables".<br>
&emsp;SELECT DISTINCT H.home\_id<br>
&emsp;FROM Homes H, Transactions T, Buyers B<br>
&emsp;WHERE H.home\_id=T.home\_id<br>
&emsp;AND T.buyer\_id=B.buyer\_id<br>
&emsp;AND H.city="Berkeley"<br>
&emsp;AND H.bedrooms\>=6<br>
&emsp;AND H.bathrooms\>=2<br>
&emsp;AND B.name="Bobby Tables"<br>
&emsp;;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;10


---

<a id="page-11"></a>
**Page 11**

3\. \[2 points\] Now for the same Query as question 2, fill in the blanks for the given relational<br>
&emsp;algebra plan. Note: blanks for relations are **bold**; blanks for subscripts are subscripted and<br>
&emsp;not bold.<br>
&emsp;πhome\_id (<br>
&emsp;σname="Bobby Tables" (<br>
&emsp;((σcity="Berkeley" AND bedrooms\>=6 AND bathrooms\>=2 Homes)<br>
&emsp;⋈ Transactions) ⋈ Buyers))

&emsp;An alternate solution was to perform the selection on the Buyers table first.<br>
&emsp;πhome\_id (<br>
&emsp;σcity="Berkeley" and bedrooms\>=6 and bathrooms\>=2 (<br>
&emsp;((σname="Bobby Tables" Buyers)<br>
&emsp;⋈ Transactions) ⋈ Homes))

4\. \[3 points\] Fill in the blanks in the SQL query that finds, for each home in Berkeley, the id of<br>
&emsp;the home and the price for which it was sold. If the home has not been sold yet, **the price**<br>
&emsp;**should be NULL**.<br>
&emsp;SELECT H.home\_id, T.sale\_price<br>
&emsp;FROM Homes H<br>
&emsp;LEFT OUTER JOIN Transactions T<br>
&emsp;ON H.home\_id=T.home\_id<br>
&emsp;WHERE H.city="Berkeley"<br>
&emsp;;

&emsp;An alternate solution was to use Transactions in the FROM clause and perform a RIGHT<br>
&emsp;OUTER JOIN with Homes.<br>
&emsp;SELECT H.home\_id, T.sale\_price<br>
&emsp;FROM Transactions T<br>
&emsp;RIGHT OUTER JOIN Homes H<br>
&emsp;ON H.home\_id=T.home\_id<br>
&emsp;WHERE H.city="Berkeley"<br>
&emsp;;

5\. \[5 points\] Fill in the blanks in the SQL query to find the name of the city with the highest<br>
&emsp;number of homes that have not yet been sold. **Include the number of unsold homes in**<br>
&emsp;**your output.**<br>
&emsp;The most common solution was to check that home\_id was NOT IN the result of the<br>
&emsp;subquery:<br>
&emsp;SELECT H.city, COUNT(\*) AS cnt<br>
&emsp;FROM Homes H<br>
&emsp;WHERE H.home\_id NOT IN (<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;11


---

<a id="page-12"></a>
**Page 12**

&emsp;SELECT DISTINCT T.home\_id<br>
&emsp;FROM Transactions T<br>
&emsp;)<br>
&emsp;GROUP BY H.city<br>
&emsp;ORDER BY cnt DESC<br>
&emsp;LIMIT 1<br>
&emsp;;

&emsp;Another solution used NOT EXISTS with a correlated subquery:<br>
&emsp;SELECT H.city, COUNT(\*) AS cnt<br>
&emsp;FROM Homes H<br>
&emsp;WHERE NOT EXISTS (<br>
&emsp;SELECT DISTINCT T.home\_id<br>
&emsp;FROM Transactions T<br>
&emsp;WHERE H.home\_id=T.home\_id<br>
&emsp;)<br>
&emsp;GROUP BY H.city<br>
&emsp;ORDER BY cnt DESC<br>
&emsp;LIMIT 1;

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;12

