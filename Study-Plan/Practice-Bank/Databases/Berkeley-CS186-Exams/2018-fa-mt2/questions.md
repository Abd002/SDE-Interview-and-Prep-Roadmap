# Berkeley CS186 Fall 2018: Midterm 2: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/186>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;CS W186 Fall 2018 Midterm 2

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Do not turn this page until instructed to start the exam.**

**Contents:**<br>
&emsp;• You should receive one double-sided answer sheet and a 12-page exam packet.<br>
&emsp;• The midterm has 5 questions, each with multiple parts.<br>
&emsp;• The midterm is worth a total of 61 points.

**Taking the exam:**<br>
&emsp;• You have 80 minutes to complete the midterm.<br>
&emsp;• All answers should be written on the answer sheet. The exam packet will be collected but not graded.<br>
&emsp;• For each question, place only your final answer on the answer sheet; do not show work.<br>
&emsp;• For multiple choice questions, please fill in the bubble or box completely as shown on the left below.<br>
&emsp;Do not mark the box with an X or checkmark.


![Figure on page 1](figures/questions-p01-fig01.png)

&emsp;• Use the blank spaces in your exam for scratch paper.

**Aids:**<br>
&emsp;• You are allowed **two** 8.5” × 11” double-sided pages of notes.<br>
&emsp;• The **only** electronic devices allowed are basic scientific calculators with simple numeric readout. No<br>
&emsp;graphing calculators, tablets, cellphones, smartwatches, laptops, etc.


---

<a id="page-2"></a>
**Page 2**

**1**   **Iterators and Joins (15 points)**<br>
1\. (5 points) For each of the following five questions, mark True or False.<br>
&emsp;&emsp;&emsp;A. Chunk Nested Loops join will always perform at least as well as Page Nested Loops Join when<br>
&emsp;&emsp;&emsp;&emsp;it comes to minimizing I/Os.<br>
&emsp;&emsp;&emsp;B. Grace hash join is usually the best algorithm for joins in which the join condition includes an<br>
&emsp;&emsp;&emsp;&emsp;inequality (i.e. col1 \< col2).<br>
&emsp;&emsp;&emsp;C. In choosing a join order for nested loops join to minimize I/Os, it is best to make the smaller<br>
&emsp;&emsp;&emsp;&emsp;relation the “outer” part of the loop.<br>
&emsp;&emsp;&emsp;D. Suppose we are joining two tables that are very different in size. In choosing a join order for<br>
&emsp;&emsp;&emsp;&emsp;index nested loops join to minimize I/Os, if both relations have indexes on their join column,<br>
&emsp;&emsp;&emsp;&emsp;it is best to query the index of the smaller relation.<br>
&emsp;&emsp;&emsp;E. If we can call the next() method on an iterator, then we are using a streaming (on-the-fly)<br>
&emsp;&emsp;&emsp;&emsp;algorithm.

&emsp;In the next five questions, assume we have the following two database tables with the corresponding<br>
&emsp;details below.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`Students:`   `(sid,` `sname,` `syear)`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`Enrolled:`   `(sid,` `cid,` `semester)`

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**variable**   **symbol**   **value**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;pages of `Students` table   \[S\]   200<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;tuples per `Students` page   pS   10<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;pages of `Enrolled` table   \[E\]   100<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;tuples per `Enrolled` page   pE   60<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;pages in memory to perform the join   B   7<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;I/Os needed to access the leaf of a B+tree   L   2

&emsp;We want to join `Students` and `Enrolled` on `Students.sid` `=` `Enrolled.sid`.   Attribute `sid` is the<br>
&emsp;primary key for table `Students`. For every tuple in `Students`, assume there are 3 matching tuples in<br>
&emsp;`Enrolled`. There is an unclustered B+tree index on `E.sid`.<br>
&emsp;**Note:** For these questions, do **NOT** include the cost of writing matching output, but **DO** include for<br>
&emsp;the cost of scanning the tables.<br>
2\. (2 points) How many **I/Os** will a **grace hash join** take? Assume perfect hash functions, and be sure<br>
&emsp;to choose the best relation for “building” to minimize cost.

3\. (2 points) What is the **minimum** number of total **pages** in RAM that it would take to reduce the<br>
&emsp;number of I/Os for **grace hash join**?

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 2 of 12


---

<a id="page-3"></a>
**Page 3**

4\. (2 points) How many disk **I/Os** are needed to perform an **index nested loops join** using the B+tree<br>
on `E.sid`?

5\. (2 points) After examining the data, you realize that both the `Students` table and `Enrolled` table are<br>
sorted by `sid`. To account for this, you want to use **Sort Merge Join**. How many **I/Os** will this join<br>
take?

6\. (2 points) Suppose that I wanted to do a **Chunk Nested Loops Join** in at most 1100 I/Os. What is<br>
the **minimum** number of **pages** in RAM I would need to accomplish this?

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 3 of 12


---

<a id="page-4"></a>
**Page 4**

**2**   **Parallel Query Processing (10 points)**<br>
For the following questions, assume that you have access to the following relations:<br>
`Players` `(name,` `team,` `position,` `salary,` `agent)`<br>
`Coaches` `(name,` `team,` `salary)`<br>
Important parameters for this question are summarized in this table:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**variable**   **symbol**   **value**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Number of machines   M   4<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Size of Page   s   4 KB<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Pages in RAM per machine for joins   B   8 pages<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Size of `Players`   \[P\]   128 pages<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Size of `Coaches`   \[C\]   4 pages<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Time for each I/O   t   5 ms<br>
Assume we have 4 machines, each with 8 pages in memory for joins. We will need to measure time, so assume<br>
that an I/O takes 5ms. For the following questions, when we ask for execution time we are only concerned<br>
with the time associated with I/Os (e.g. assume CPU and other costs are negligible). Assume that we can<br>
send individual tuples over the network with no overhead in terms of network cost.

Questions 1 and 2 will deal with the following query:<br>
`SELECT` `p.name,` `c.name` `FROM` `Players` `p,` `Coaches` `c` `WHERE` `c.team` `=` `p.team`<br>
1\. (4 points) Assuming the `Players` and `Coaches` relations are both round-robin partitioned across 4 ma-<br>
&emsp;chines by an adversary who is trying to maximize our network costs, what is the largest amount of data<br>
&emsp;we ship across the network, **in KB**, of the query above, assuming we execute a sort-merge join?

2\. (2 points) Assuming the `Players` relation starts out hash-partitioned on the `position` key across the<br>
&emsp;4 machines, and that 75% of `Players` gets mapped to one machine, how long **in ms** will it take to<br>
&emsp;complete a parallel scan of `Players`?

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 4 of 12


---

<a id="page-5"></a>
**Page 5**

Suppose we add another table with the following schema: `Fans` `(name,` `team)`, which has 40,000 pages<br>
and is round-robin partitioned across 4 **new** machines with only this data.<br>
Questions 3-4 deal with the following query:<br>
`Select` `f.name,` `c.name` `from` `Coaches` `c,` `Fans` `f` `where` `f.team` `=` `c.team`<br>
3\. (2 points) What is the **name** of the join strategy that provides lowest possible network cost (amount of<br>
data shipped) to execute the query above?

4\. (2 points) What is the amount of data shipped **in KB** to execute that join strategy?

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 5 of 12


---

<a id="page-6"></a>
**Page 6**

**3**   **Query Optimization (11 points)**<br>
1\. (2.5 points) For each of the following assertions about left-deep plans, answer True or False.<br>
&emsp;&emsp;&emsp;A. Two left-deep plans can differ in the order of relations and produce the same output.<br>
&emsp;&emsp;&emsp;B. Two left-deep plans can differ in the access method for each leaf operator and produce the<br>
&emsp;&emsp;&emsp;&emsp;same output.<br>
&emsp;&emsp;&emsp;C. Two left-deep plans can differ in the join method for each join operator and produce the same<br>
&emsp;&emsp;&emsp;&emsp;output.<br>
&emsp;&emsp;&emsp;D. The cheapest plan will always be among the left-deep plans.<br>
&emsp;&emsp;&emsp;E. The concept of “interesting” orders is not relevant for left-deep plans.

2\. (2 points) For each of the following assertions about the System R algorithm, answer True or False.<br>
&emsp;&emsp;&emsp;A. System R never considers plans with cartesian products because they are suboptimal<br>
&emsp;&emsp;&emsp;B. System R only explores left deep plans<br>
&emsp;&emsp;&emsp;C. System R doesn’t keep track of interesting orders as they do not reduce I/O cost<br>
&emsp;&emsp;&emsp;D. The running time of the System R algorithm is at least exponential in the number of tables

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 6 of 12


---

<a id="page-7"></a>
**Page 7**

Suppose the System R assumptions about uniformity and independence from lecture hold. Assume that<br>
costs are estimated as a number of I/Os, without differentiating random and sequential I/O cost.<br>
Consider the following relational schema:


![Figure on page 7](figures/questions-p07-fig02.png)

Assume the distribution on `Customers.happiness` is as shown in Figure 1. Each bin is inclusive of the<br>
min and exclusive of the max, \[min, max).

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[1-2)   \[2-5)   \[5-7)   \[7-9)   ≥9<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;5%   15%   10%   30%   40%<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Figure 1: Histogram on `Customers.happiness`

Suppose you’re executing the following query:

`SELECT` `id,` `name`<br>
`FROM` `Customers` `c,` `Purchases` `p`<br>
`WHERE` `c.happiness` `>=` `2`<br>
&emsp;&emsp;`AND` `c.name` `=` `p.customer_name`<br>
&emsp;&emsp;`AND` `c.happiness` `<` `7`

3\. (1 point) What will be the selectivity for the predicate `c.name` `=` `p.customer` `name`?<br>
4\. (1 point) What will be the selectivity of `c.happiness` ≥`2` `AND` `c.happiness` \< `7`?<br>
5\. (1 point) How many tuples do we estimate to be in the output of the query? Choose one of the options<br>
below.<br>
&emsp;&emsp;A. (answer to q3) ∗(answer to q4) ∗\|`Customers`\| ∗\|`Purchases`\|<br>
&emsp;&emsp;B. (selectivity of `c.happiness` ≥2) ∗(selectivity of `c.happiness` \< 7) ∗\|`Customers`\|∗\|`Purchases`\|<br>
&emsp;&emsp;C. (answer to q3) ∗(selectivity of `c.happiness` ≥2)<br>
&emsp;&emsp;&emsp;∗(selectivity of `c.happiness` \< 7) ∗\|`Customers`\| ∗\|`Purchases`\|

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 7 of 12


---

<a id="page-8"></a>
**Page 8**

For problems 6-7, refer to the following query:

`SELECT` `c.id,` `r.` `return_id,` `p.order_id`<br>
`FROM` `Customers` `c,` `Purchases` `p,` `Returns` `r`<br>
`WHERE` `c.id` `=` `p.customer_id`<br>
&emsp;&emsp;`AND` `p.order_id` `=` `r.order_id`<br>
&emsp;&emsp;`AND` `r.customer_id` `=` `c.id`<br>
&emsp;&emsp;`AND` `c.happiness` `<` `2`<br>
`ORDER` `BY` `c.id`

6\. (2.5 points) Which of these table scans will output an interesting order? Mark True for correct answers<br>
and False for incorrect answers.<br>
&emsp;&emsp;A. Index scan on `happiness` for `Customers`<br>
&emsp;&emsp;B. Index scan on `id` for `Customers`<br>
&emsp;&emsp;C. Full table scan on `Customers`<br>
&emsp;&emsp;D. Index scan on `order` `id` for `Purchases`<br>
&emsp;&emsp;E. Index scan on `return` `id` for `Returns`

7\. (1 point) True or False: Consider the SQL query above question 6. System R will choose to do a full<br>
table scan rather than an index scan for the Customers table.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 8 of 12


---

<a id="page-9"></a>
**Page 9**

**4**   **ER Diagrams(14 points)**<br>
For questions 1-6, you will use the following ER Diagram, which represents the commitments that teachers<br>
and students have during the semester. (Hint: You might want to fill the diagram while you read these<br>
requirements here).<br>
• Students may lead multiple clubs, and every club has one student leader.<br>
• Students can also participate in multiple clubs, and every club has at least one student member.<br>
• Every teacher has multiple office hours, and one teacher leads each office hour.


![Figure on page 9](figures/questions-p09-fig03.png)

1\. (1 point) Which edge should we draw to connect the **Clubs** entity with the **leads** relationship set?<br>
&emsp;&emsp;&emsp;A. Thin Arrow<br>
&emsp;&emsp;&emsp;B. Thick Arrow<br>
&emsp;&emsp;&emsp;C. Thin Line<br>
&emsp;&emsp;&emsp;D. Thick Line

2\. (1 point) Which edge should we draw to connect the **Students** entity with the **leads** relationship set?<br>
&emsp;&emsp;&emsp;A. Thin Arrow<br>
&emsp;&emsp;&emsp;B. Thick Arrow<br>
&emsp;&emsp;&emsp;C. Thin Line<br>
&emsp;&emsp;&emsp;D. Thick Line

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 9 of 12


---

<a id="page-10"></a>
**Page 10**

3\. (1 point) Which edge should we draw to connect the **Clubs** entity with the **participates** relationship<br>
set?<br>
&emsp;&emsp;A. Thin Arrow<br>
&emsp;&emsp;B. Thick Arrow<br>
&emsp;&emsp;C. Thin Line<br>
&emsp;&emsp;D. Thick Line

4\. (1 point) Which edge should we draw to connect the **Office Hours** entity with the **have** relationship<br>
set?<br>
&emsp;&emsp;A. Thin Arrow<br>
&emsp;&emsp;B. Thick Arrow<br>
&emsp;&emsp;C. Thin Line<br>
&emsp;&emsp;D. Thick Line

5\. (1 point) Which edge should we draw to connect the **Teachers** entity with the **have** relationship set?<br>
&emsp;&emsp;A. Thin Arrow<br>
&emsp;&emsp;B. Thick Arrow<br>
&emsp;&emsp;C. Thin Line<br>
&emsp;&emsp;D. Thick Line

6\. (1 point) True or False: Can a class be taught by multiple teachers?<br>
&emsp;&emsp;A. True<br>
&emsp;&emsp;B. False

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 10 of 12


---

<a id="page-11"></a>
**Page 11**


![Figure on page 11](figures/questions-p11-fig04.png)

7\. (4 points) Above are two alternative schemata1 that represent pet adoptions. For each of the following<br>
assertions, mark True or False.<br>
&emsp;&emsp;A. In schema 1, a family can adopt at most one pet.<br>
&emsp;&emsp;B. In schema 2, if there are k agencies, a family can adopt at most k times.<br>
&emsp;&emsp;C. In schema 2, there is no record of which pet was adopted by which family.<br>
&emsp;&emsp;D. In schema 1, a family can adopt a pet without an agency being involved.


![Figure on page 11](figures/questions-p11-fig05.png)

8\. (4 points) To capture the ER Diagram above, we create three relations: Pet, Adopts and Family. For<br>
each of the following assertions, mark True or False.<br>
&emsp;&emsp;A. The Pet table’s primary key includes the column fid.<br>
&emsp;&emsp;B. The Adopts table’s primary key includes the column pname.<br>
&emsp;&emsp;C. The Adopts table’s primary key includes the column fid.<br>
&emsp;&emsp;D. The Adopts table’s column fid can be declared NOT NULL.

1“Schemata” is the plural of schema.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 11 of 12


---

<a id="page-12"></a>
**Page 12**

**5**   **Text Search (11 points)**<br>
1\. (5 points) For each assertion, fill in the corresponding bubble True or False.<br>
&emsp;&emsp;&emsp;A. A postings list is a heap file of docIDs for a term.<br>
&emsp;&emsp;&emsp;B. In IR’s “bag of words” model, the word “running” is converted to “run”, so “running” is an<br>
&emsp;&emsp;&emsp;&emsp;example of a stop word.<br>
&emsp;&emsp;&emsp;C. IR is used mostly with unstructured text data.<br>
&emsp;&emsp;&emsp;D. Inverted files are so named because they are structured with document IDs ordered in descend-<br>
&emsp;&emsp;&emsp;&emsp;ing order.<br>
&emsp;&emsp;&emsp;E. In general, relational DBMSs are faster at handling individual updates and deletes than Text<br>
&emsp;&emsp;&emsp;&emsp;Search Engines.

Questions 2 to 6 refer to finding all docs matching the following Boolean expression:

&emsp;`"Berkeley"` `AND` `("Database"` `OR` `"Computer")` `AND` `NOT` `"Stanford"`<br>
Assume all term searches use index scans. Assume no optimizations are applied.<br>
2\. (1 point) How many index scans will be done to perform this search? Choose one.<br>
&emsp;&emsp;&emsp;A. 1<br>
&emsp;&emsp;&emsp;B. 2<br>
&emsp;&emsp;&emsp;C. 3<br>
&emsp;&emsp;&emsp;D. 4<br>
3\. (1 point) How many unions are performed? **Answer in a nonnegative integer.**

4\. (1 point) How many intersections are performed? **Answer in a nonnegative integer.**

5\. (1 point) How many set subtractions are performed? **Answer in a nonnegative integer.**

6\. (2 points) Mark True or False for each of the following assertions regarding the efficiency of IR queries.<br>
&emsp;&emsp;&emsp;A. To perform set operations we can use hash joins without the partitioning phase because post-<br>
&emsp;&emsp;&emsp;&emsp;ings lists are already hash partitioned.<br>
&emsp;&emsp;&emsp;B. To perform set operations we can use merge joins without sorting because posting lists are<br>
&emsp;&emsp;&emsp;&emsp;already sorted.<br>
&emsp;&emsp;&emsp;C. Performing a set operation on two postings lists requires no more than 3 I/O buffers in memory:<br>
&emsp;&emsp;&emsp;&emsp;two for input to the operation, one for output.<br>
&emsp;&emsp;&emsp;D. The B+-tree containing the postings lists is perfectly clustered: that is, the heap file it points<br>
&emsp;&emsp;&emsp;&emsp;to is organized by (`term`, `docId`).

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 12 of 12

