# Berkeley CS186 Fall 2005: Midterm 1: Official solutions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/186>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;UNIVERSITY OF CALIFORNIA<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Department of EECS, Computer Science Division<br>
CS186    Garofalakis/Hellerstein<br>
Fall 2005    Midterm Solutions

&emsp;&emsp;&emsp;&emsp;**Midterm Solutions: Introduction to Database Systems**


### Problem 1: B+trees

(A)  (3 points)<br>
Node affected: N7


![Figure on page 1](figures/solutions-p01-fig01.png)

New Node:

(B)  (6 points)


![Figure on page 1](figures/solutions-p01-fig02.png)

(C)<br>
a. (5 points)<br>
1\. Merge N3 and N4.  (Move 519 to N3)<br>
2\. Merge N10 and N11, and move it to child of N3.<br>
b. (1 point)<br>
Insert any value in \[520,600)


---

<a id="page-2"></a>
**Page 2**


### Problem 2: Query Languages

&emsp;&emsp;&emsp;a.    \[4 points\] Find blog entries posted by an author with realname ‘Ted’, and return the title,<br>
&emsp;&emsp;&emsp;&emsp;&emsp;timestamp and body of the entry.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`SELECT e.title, e.timestamp, e.body`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`FROM entries e, authors a`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`WHERE e.authorid = a.authorid`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`AND a.realname = ‘Ted’`<br>
&emsp;&emsp;&emsp;b. \[6 points\] For each entry in the blog, return the same fields as in part (a), for those entries<br>
&emsp;&emsp;&emsp;&emsp;&emsp;with more than 2 comments.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`SELECT e.title, e.timestamp, e.body`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`FROM blogdb_entries e`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`WHERE e.id IN`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`(SELECT c.entry_id`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`FROM blogdb_comments c`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`GROUP BY c.entry_id`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`HAVING count(*) > 2);`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;OR<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`SELECT e.title, e.timestamp, e.body`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`FROM blogdb_entries e, blogdb_comments c`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`WHERE e.id = c.entry_id`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`GROUP BY e.id, e.title, e.timestamp, e.body`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`HAVING count(*) > 2);`

&emsp;&emsp;&emsp;c.    \[6 points\] The “parent\_id” field in the comments table tracks the nesting of “comments<br>
&emsp;&emsp;&emsp;&emsp;&emsp;on comments”: when a new comment is posted in response to an old comment, the<br>
&emsp;&emsp;&emsp;&emsp;&emsp;parent\_id of the new comment is the id of the old comment. (You may assume that<br>
&emsp;&emsp;&emsp;&emsp;&emsp;comments made directly on blog entries have parent\_id = 0).<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Find the id of each comment and the id of its “grandparent” comment; if it does not have<br>
&emsp;&emsp;&emsp;&emsp;&emsp;a grandparent, omit it from the answer.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`SELECT kid.id, parent.parent_id`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`FROM comments kid, comments parent`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`WHERE kid.parent_id = parent.id`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`AND parent.parent_id <> 0`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;OR<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`SELECT kid.id, grand.id`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`FROM comments kid, comments parent,`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`comments grand`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`WHERE kid.parent_id = parent.id`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`AND parent.parent_id = grand.id;`

&emsp;B. XML<br>
&emsp;&emsp;&emsp;**a.** \[4 points\] Write an XPATH query that returns all comments associated with entries<br>
&emsp;&emsp;&emsp;&emsp;&emsp;entitled “Midterm”.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`//entry[@title=”Midterm”]/comment`


---

<a id="page-3"></a>
**Page 3**

&emsp;&emsp;&emsp;`b.` \[4 points\] Write an XPATH query to find all comments that are a “grandparent” of some<br>
&emsp;&emsp;&emsp;&emsp;&emsp;other comment.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`//comment[comment/comment]`

&emsp;&emsp;&emsp;c.    \[6 points\] Using the XQuery language, write a FLWOR query that returns entries that<br>
&emsp;&emsp;&emsp;&emsp;&emsp;have more than 5 comments (nested or otherwise) and an author name containing<br>
&emsp;&emsp;&emsp;&emsp;&emsp;"Michael".

&emsp;&emsp;&emsp;&emsp;&emsp;`FOR $e IN /entry[contains(./author, "Michael")]`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`LET $c := $e//comment`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`WHERE count($c) > 5`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`RETURN $e`


---

<a id="page-4"></a>
**Page 4**

`3.` **Sorting.** \[8 points\]<br>
We would like to sort the tuples of a relation R(column1, column2, column3, column4) on a the sort key<br>
(column1, column2, column4).  The following information is known about the relation.<br>
· The relation R contains 100,000 tuples.<br>
· The size of a block on disk is 4000 bytes.<br>
· The size of each R tuple is 400 bytes.<br>
· The size of each field in R is 4 bytes.<br>
· A record pointer is 4 bytes.

Answer the following questions based on the information above.<br>
**A.** \[4 points\] If we want to sort in two passes (using only Phase 0 and Phase 1), we need to know the<br>
minimum number of blocks B of main memory required.  Provide (i) a formula for computing B correctly,<br>
and (ii) also give an integer value of B that guarantees a 2-pass sort.<br>
Part i:<br>
2 points: either solutions received full credit<br>
B(B-1) \<= 10000<br>
Or<br>
1 + logB-1(10000/B) = 2<br>
1 point for minor errors (e.g., forgot the ceiling, # pages did not appear anywhere ).<br>
Part ii:<br>
2 points:<br>
B = 101

**B.** \[4 points\] Assume we have sufficient memory to perform the sort in two passes. What is the cost, in<br>
terms of number of disk I/Os, of sorting relation R? Include the cost of the writing the sorted file to the disk<br>
in the end in your calculations.<br>
`4 points:`<br>
`2 passes, read in and write out 10000 pages during each pass.`<br>
`4 * 10000 = 40,000 I/Os`


---

<a id="page-5"></a>
**Page 5**


### Problem 4: ER Diagrams


![Figure on page 5](figures/solutions-p05-fig03.png)

Teaches - a given Faculty member will only be able to teach a given Class during<br>
one semester.<br>
Classes - Classes with the same department and course number are no longer<br>
distinct over different semesters.<br>
Enrolled - a give Student will only be able to take a given Class during one<br>
semester.

Recall that the primary keys of entities taken all together become primary keys in<br>
the relation!


---

<a id="page-6"></a>
**Page 6**


### Problem 5: Query Optimization

**Answer 5(a):**<br>
**Since fromUrl is a foreign-key reference, the number of tuples in the join result (without any**<br>
**selections applied) is \|L\| (referential integrity); thus, the selectivity of the join operator is \|L\|/(\|P\|\*\|L\|)**<br>
**= 1/\|P\| = 1/106.**<br>
**Assuming uniformity (for both the pagesize and author attributes), the selectivities for the pagesize**<br>
**and author conditions in the query are  (5000-0)/(20000-0) = ¼  and  1/104, respectively.**<br>
**Thus, assuming independence for the conditions, the overall selectivity is:**<br>
&emsp;&emsp;&emsp;L\|\|500001<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;!<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;!251012<br>
&emsp;&emsp;&emsp;&emsp;&emsp;##="<br>
&emsp;&emsp;P" L\|\|\|\|200000104<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;!

**Answer 5(b):**<br>
**The complete scan of webpages costs 10^5  page IOs. Assuming uniformity over pagesizes, the**<br>
**number of webpages tuples that satisfy the pagesize condition in the query is:**<br>
&emsp;&emsp;K20000   K<br>
&emsp;&emsp;&emsp;&emsp;"<br>
101()1066<br>
&emsp;!="!<br>
&emsp;&emsp;2000020000<br>
**Similarly, the number of relevant index pages that must be scanned during the index scan is  (1-**<br>
**K/20000)\*10^3. Since we have an unclustered index and get no benefit from buffering, we must do a**<br>
**data-page IO for each qualifying webpages tuple.  Thus, the crossover value of K is determined by**<br>
**the equation:**<br>
&emsp;&emsp;K<br>
1()(1010)10635<br>
"!+=<br>
&emsp;20000<br>
**which gives K = 18002. Thus, for K\>18002 the unclustered index scan solution is better (and vice**<br>
**versa).**

**Answer (Extra Credit):**<br>
**Consider the n=2 case. Assuming we evaluate selection 1 before selection 2, the overall CPU cost**<br>
**(since the predicates are independent) is: \|R\|\*c1 + \|R\|\*s1\*c2. (This is because only \|R\|\*s1 tuples**<br>
**“survive” selection 1.)  Similarly, for the plan that evaluates selection 2 before selection 1, the cost is:**<br>
**\|R\|\*c2 + \|R\|\*s2\*c1.  Thus, evaluating selection 1 first is a better strategy, iff**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;cc21<br>
csccsc221112      **or**<br>
&emsp;+!\>+!   \><br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;ss1211<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;!!<br>
**In the general case, the optimal strategy is to evaluate the n selections in increasing order of the ci/(1-**<br>
**si) ratio. Intuitively, this rule says we should evaluate selections in order of their cost/benefit ratio,**<br>
**where cost is the per tuple cost , and benefit is the percentage of tuples they filter out (i.e. 1-**<br>
**selectivity).**

