# Berkeley CS186 Fall 2018: Midterm 2: Official solutions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/186>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;CS W186 Fall 2018 Midterm 2

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Do not turn this page until instructed to start the exam.**

**Contents:**<br>
&emsp;• You should receive one double-sided answer sheet and a 17-page exam packet.<br>
&emsp;• The midterm has 5 questions, each with multiple parts.<br>
&emsp;• The midterm is worth a total of 61 points.

**Taking the exam:**<br>
&emsp;• You have 80 minutes to complete the midterm.<br>
&emsp;• All answers should be written on the answer sheet. The exam packet will be collected but not graded.<br>
&emsp;• For each question, place only your final answer on the answer sheet; do not show work.<br>
&emsp;• For multiple choice questions, please fill in the bubble or box completely as shown on the left below.<br>
&emsp;Do not mark the box with an X or checkmark.


![Figure on page 1](figures/solutions-p01-fig01.png)

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

&emsp;**Solution:** A. C<br>
&emsp;Explanation:<br>
&emsp;A. True - Chunk Nested Loops Join turns into PNLJ when B=2. Otherwise the cost model is strictly<br>
&emsp;less: \[R\] + \[R\] ∗\[S\] vs \[R\] + \[R/(B −2)\] ∗\[S\]<br>
&emsp;B. False - A hash join requires an Equijoin which cannot happen when an inequality is involved.<br>
&emsp;C. True - Consider the cost model for PNLJ, where O = outer, I = inner. \[O\] + \[O\]\[I\]. The \[O\]\[I\]<br>
&emsp;will be there no matter what order we choose, so we want to minimize the other term (the cost of<br>
&emsp;scanning the outer relation), so we make the outer relation smaller.<br>
&emsp;D. False - Consider the cost model for INLJ, where L = larger and S = smaller. If we query S, the<br>
&emsp;cost is \[L\] + \|L\|∗(cost to lookup in S), whereas if we query L the cost is \[S\] + \|S\|∗(cost to lookup<br>
&emsp;in L). The cost to lookup in an index wont change much even if one table is much bigger but the<br>
&emsp;number of records can change drastically, so you want to lookup in the larger table.<br>
&emsp;E. False - It might result in blocking (batch), which means the function does not produce output<br>
&emsp;until it consumes its entire input (consider sort merge join).

&emsp;In the next five questions, assume we have the following two database tables with the corresponding<br>
&emsp;details below.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`Students:`   `(sid,` `sname,` `syear)`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`Enrolled:`   `(sid,` `cid,` `semester)`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**variable**   **symbol**   **value**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;pages of `Students` table   \[S\]   200<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;tuples per `Students` page   pS   10<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;pages of `Enrolled` table   \[E\]   100<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;tuples per `Enrolled` page   pE   60<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;pages in memory to perform the join   B   7<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;I/Os needed to access the leaf of a B+tree   L   2

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 2 of 17


---

<a id="page-3"></a>
**Page 3**

We want to join `Students` and `Enrolled` on `Students.sid` `=` `Enrolled.sid`.   Attribute `sid` is the<br>
primary key for table `Students`. For every tuple in `Students`, assume there are 3 matching tuples in<br>
`Enrolled`. There is an unclustered B+tree index on `E.sid`.<br>
**Note:** For these questions, do **NOT** include the cost of writing matching output, but **DO** include for<br>
the cost of scanning the tables.<br>
2\. (2 points) How many **I/Os** will a **grace hash join** take? Assume perfect hash functions, and be sure<br>
to choose the best relation for “building” to minimize cost.

&emsp;**Solution:** 1500<br>
&emsp;Explanation:<br>
&emsp;We want to first partition E (the smaller table) until it fits into B-2 = 5 pages. Number of partitioning<br>
&emsp;passes: 2 because 100/6 \> 5, but 100/6/6 \< 5.<br>
&emsp;We then build the hash table based on E and probe S to generate the final matching pairs.<br>
&emsp;2 ∗2 ∗(100 + 200) + 100 + 200 = 1500 I/Os

3\. (2 points) What is the **minimum** number of total **pages** in RAM that it would take to reduce the<br>
number of I/Os for **grace hash join**?

&emsp;**Solution:** 12 Pages<br>
&emsp;Explanation:<br>
&emsp;We can only afford 1 partitioning pass then.<br>
&emsp;100 / B-1 ≤B-2<br>
&emsp;Try B = 11: 100 / 10 = 10 which is \> 9.<br>
&emsp;Try B = 12: 100 / 11 \< 10<br>
&emsp;12 Pages

4\. (2 points) How many disk **I/Os** are needed to perform an **index nested loops join** using the B+tree<br>
on `E.sid`?

&emsp;**Solution:** 10200<br>
&emsp;Explanation:<br>
&emsp;We probe on the index on E: \[S\]+\[S\]∗pS∗(cost to find matching E tuples) = 200+200∗10∗(2+3) =<br>
&emsp;10200 I/Os

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 3 of 17


---

<a id="page-4"></a>
**Page 4**

5\. (2 points) After examining the data, you realize that both the `Students` table and `Enrolled` table are<br>
sorted by `sid`. To account for this, you want to use **Sort Merge Join**. How many **I/Os** will this join<br>
take?

&emsp;**Solution:** 300<br>
&emsp;Explanation:<br>
&emsp;Cost to sort = 0 for both, so the total cost is just 100 + 200 = 300 I/Os.

6\. (2 points) Suppose that I wanted to do a **Chunk Nested Loops Join** in at most 1100 I/Os. What is<br>
the **minimum** number of **pages** in RAM I would need to accomplish this?

&emsp;**Solution:** 22<br>
&emsp;Explanation:<br>
&emsp;100 + (100/\[B-2\]) \* 200 ≤1100<br>
&emsp;20000/\[B-2\] ≤1000<br>
&emsp;20000 ≤1000(B - 2)<br>
&emsp;20 ≤B - 2<br>
&emsp;B ≤22

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 4 of 17


---

<a id="page-5"></a>
**Page 5**

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

&emsp;**Solution:** s \* (\[P\] + \[C\]) = 4KB \* (128 + 4) = 528 KB – we will, in the worst case, have to send<br>
&emsp;over every single tuple because we need to range partition.

2\. (2 points) Assuming the `Players` relation starts out hash-partitioned on the `position` key across the<br>
&emsp;4 machines, and that 75% of `Players` gets mapped to one machine, how long **in ms** will it take to<br>
&emsp;complete a parallel scan of `Players`?

&emsp;**Solution:** t \* 0.75 \* \[P\] = 5 \* 0.75 \* 128 = 5 \* 96 = 480 ms

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 5 of 17


---

<a id="page-6"></a>
**Page 6**

Suppose we add another table with the following schema: `Fans` `(name,` `team)`, which has 40,000 pages<br>
and is round-robin partitioned across 4 **new** machines with only this data.<br>
Questions 3-4 deal with the following query:<br>
`Select` `f.name,` `c.name` `from` `Coaches` `c,` `Fans` `f` `where` `f.team` `=` `c.team`<br>
3\. (2 points) What is the **name** of the join strategy that provides lowest possible network cost (amount of<br>
data shipped) to execute the query above?

&emsp;**Solution:** Broadcast join. Symmetric shuffle and asymmetric shuffle would cost more because we<br>
&emsp;would have to re-partition Fans.

4\. (2 points) What is the amount of data shipped **in KB** to execute that join strategy?

&emsp;**Solution:** s \* 4 \* 4 = 4 KB \* 4 \* 4 = 64 KB (perform a broadcast join - send over the entire<br>
&emsp;Coaches table to each machine.)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 6 of 17


---

<a id="page-7"></a>
**Page 7**

**3**   **Query Optimization (11 points)**<br>
1\. (2.5 points) For each of the following assertions about left-deep plans, answer True or False.<br>
&emsp;&emsp;&emsp;A. Two left-deep plans can differ in the order of relations and produce the same output.<br>
&emsp;&emsp;&emsp;B. Two left-deep plans can differ in the access method for each leaf operator and produce the<br>
&emsp;&emsp;&emsp;&emsp;same output.<br>
&emsp;&emsp;&emsp;C. Two left-deep plans can differ in the join method for each join operator and produce the same<br>
&emsp;&emsp;&emsp;&emsp;output.<br>
&emsp;&emsp;&emsp;D. The cheapest plan will always be among the left-deep plans.<br>
&emsp;&emsp;&emsp;E. The concept of “interesting” orders is not relevant for left-deep plans.

&emsp;**Solution:** A, B, C

2\. (2 points) For each of the following assertions about the System R algorithm, answer True or False.<br>
&emsp;&emsp;&emsp;A. System R never considers plans with cartesian products because they are suboptimal<br>
&emsp;&emsp;&emsp;B. System R only explores left deep plans<br>
&emsp;&emsp;&emsp;C. System R doesn’t keep track of interesting orders as they do not reduce I/O cost<br>
&emsp;&emsp;&emsp;D. The running time of the System R algorithm is at least exponential in the number of tables

&emsp;**Solution:** B, D

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 7 of 17


---

<a id="page-8"></a>
**Page 8**

Suppose the System R assumptions about uniformity and independence from lecture hold. Assume that<br>
costs are estimated as a number of I/Os, without differentiating random and sequential I/O cost.<br>
Consider the following relational schema:


![Figure on page 8](figures/solutions-p08-fig02.png)

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

3\. (1 point) What will be the selectivity for the predicate `c.name` `=` `p.customer` `name`?

&emsp;max(50,90) =max(distinct vals c.name,distinct vals p.customer name) =**Solution:** The selectivity is1   1   1<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;90

4\. (1 point) What will be the selectivity of `c.happiness` ≥`2` `AND` `c.happiness` \< `7`?

&emsp;**Solution:** We know that we want happiness to be between 2 and 7. The selectivity is therefore<br>
&emsp;.1 + .15 = .25

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 8 of 17


---

<a id="page-9"></a>
**Page 9**

5\. (1 point) How many tuples do we estimate to be in the output of the query? Choose one of the options<br>
below.<br>
&emsp;&emsp;A. (answer to q3) ∗(answer to q4) ∗\|`Customers`\| ∗\|`Purchases`\|<br>
&emsp;&emsp;B. (selectivity of `c.happiness` ≥2) ∗(selectivity of `c.happiness` \< 7) ∗\|`Customers`\|∗\|`Purchases`\|<br>
&emsp;&emsp;C. (answer to q3) ∗(selectivity of `c.happiness` ≥2)<br>
&emsp;&emsp;&emsp;∗(selectivity of `c.happiness` \< 7) ∗\|`Customers`\| ∗\|`Purchases`\|

&emsp;**Solution:**<br>
&emsp;&emsp;&emsp;A. is correct as it has the correct selectivity clauses<br>
&emsp;&emsp;&emsp;B. is incorrect as c.happiness ≥2 and c.happiness \< 7 are not independent and is missing<br>
&emsp;&emsp;&emsp;&emsp;the column equality<br>
&emsp;&emsp;&emsp;C. is incorrect as c.happiness ≥2 and c.happiness \< 7 are not independent

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 9 of 17


---

<a id="page-10"></a>
**Page 10**

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

&emsp;**Solution:** B, D<br>
&emsp;&emsp;&emsp;A. is not an interesting order because happiness is never used again after c.happiness \< 2<br>
&emsp;&emsp;&emsp;B. id is an interesting order because id is used again for c.id = p.customer id and r.customer id<br>
&emsp;&emsp;&emsp;&emsp;= c.id and the ORDER BY clause<br>
&emsp;&emsp;&emsp;C. A full table scan doesn’t output the tuples in any particular order so there is no interesting<br>
&emsp;&emsp;&emsp;&emsp;order<br>
&emsp;&emsp;&emsp;D. order id is an interesting order because order id is used again for r.customer id = r.order id<br>
&emsp;&emsp;&emsp;E. return id is not an interesting order because it is not present in the where clause

7\. (1 point) True or False: Consider the SQL query above question 6. System R will choose to do a full<br>
table scan rather than an index scan for the Customers table.

&emsp;**Solution:** False.   A full table scan will cost 10 I/Os while an index scan on happiness for the<br>
&emsp;Customer table will cost 3 I/Os (2 IOs to traverse the tree and 1 IOs to get the records (0.05 \* 10)).

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 10 of 17


---

<a id="page-11"></a>
**Page 11**

**4**   **ER Diagrams(14 points)**<br>
For questions 1-6, you will use the following ER Diagram, which represents the commitments that teachers<br>
and students have during the semester. (Hint: You might want to fill the diagram while you read these<br>
requirements here).<br>
• Students may lead multiple clubs, and every club has one student leader.<br>
• Students can also participate in multiple clubs, and every club has at least one student member.<br>
• Every teacher has multiple office hours, and one teacher leads each office hour.


![Figure on page 11](figures/solutions-p11-fig03.png)

1\. (1 point) Which edge should we draw to connect the **Clubs** entity with the **leads** relationship set?<br>
&emsp;&emsp;&emsp;A. Thin Arrow<br>
&emsp;&emsp;&emsp;B. Thick Arrow<br>
&emsp;&emsp;&emsp;C. Thin Line<br>
&emsp;&emsp;&emsp;D. Thick Line

&emsp;**Solution:**<br>
&emsp;B<br>
&emsp;Explanation:<br>
&emsp;One club has exactly one student leader.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 11 of 17


---

<a id="page-12"></a>
**Page 12**

2\. (1 point) Which edge should we draw to connect the **Students** entity with the **leads** relationship set?<br>
&emsp;&emsp;A. Thin Arrow<br>
&emsp;&emsp;B. Thick Arrow<br>
&emsp;&emsp;C. Thin Line<br>
&emsp;&emsp;D. Thick Line

&emsp;**Solution:**<br>
&emsp;C<br>
&emsp;Explanation:<br>
&emsp;One student can lead zero, one or more clubs.

3\. (1 point) Which edge should we draw to connect the **Clubs** entity with the **participates** relationship<br>
set?<br>
&emsp;&emsp;A. Thin Arrow<br>
&emsp;&emsp;B. Thick Arrow<br>
&emsp;&emsp;C. Thin Line<br>
&emsp;&emsp;D. Thick Line

&emsp;**Solution:**<br>
&emsp;D<br>
&emsp;Explanation:<br>
&emsp;One club has at least one student who participates in it.

4\. (1 point) Which edge should we draw to connect the **Office Hours** entity with the **have** relationship<br>
set?<br>
&emsp;&emsp;A. Thin Arrow<br>
&emsp;&emsp;B. Thick Arrow<br>
&emsp;&emsp;C. Thin Line<br>
&emsp;&emsp;D. Thick Line

&emsp;**Solution:**<br>
&emsp;B<br>
&emsp;Explanation:<br>
&emsp;One office hour has exactly one teacher who leads it.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 12 of 17


---

<a id="page-13"></a>
**Page 13**

5\. (1 point) Which edge should we draw to connect the **Teachers** entity with the **have** relationship set?<br>
&emsp;&emsp;A. Thin Arrow<br>
&emsp;&emsp;B. Thick Arrow<br>
&emsp;&emsp;C. Thin Line<br>
&emsp;&emsp;D. Thick Line

&emsp;**Solution:**<br>
&emsp;D<br>
&emsp;Explanation:<br>
&emsp;Each teacher has multiple office hours.<br>
&emsp;The correct ER Diagram to represent the relationship should look like this


![Figure on page 13](figures/solutions-p13-fig04.png)

6\. (1 point) True or False: Can a class be taught by multiple teachers?<br>
&emsp;&emsp;A. True<br>
&emsp;&emsp;B. False

&emsp;**Solution:** True<br>
&emsp;Explanation:<br>
&emsp;A teacher can teach exactly one class, but classes can be taught by multiple teachers.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 13 of 17


---

<a id="page-14"></a>
**Page 14**


![Figure on page 14](figures/solutions-p14-fig05.png)

7\. (4 points) Above are two alternative schemata1 that represent pet adoptions. For each of the following<br>
assertions, mark True or False.<br>
&emsp;&emsp;A. In schema 1, a family can adopt at most one pet.<br>
&emsp;&emsp;B. In schema 2, if there are k agencies, a family can adopt at most k times.<br>
&emsp;&emsp;C. In schema 2, there is no record of which pet was adopted by which family.<br>
&emsp;&emsp;D. In schema 1, a family can adopt a pet without an agency being involved.

&emsp;**Solution:** A, B, C<br>
&emsp;Explanation: A is true because of the arrow from Family to Adopts. B is true because relationship<br>
&emsp;sets are unique, so each (family, agency) pair in Adopts can be recorded at most once. C is true<br>
&emsp;because the Adopts and Provides relationship sets are independent: if we record that the Browns<br>
&emsp;adopt from Daisy Hill Agency, and Daisy Hill provides both Snoopy and Spike, we cannot tell if the<br>
&emsp;Browns adopt Snoopy or Spike. D is false because a relationship by definition involves an entity<br>
&emsp;from each associated entity set.


![Figure on page 14](figures/solutions-p14-fig06.png)

8\. (4 points) To capture the ER Diagram above, we create three relations: Pet, Adopts and Family. For<br>
each of the following assertions, mark True or False.<br>
&emsp;&emsp;A. The Pet table’s primary key includes the column fid.<br>
&emsp;&emsp;B. The Adopts table’s primary key includes the column pname.<br>
1“Schemata” is the plural of schema.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 14 of 17


---

<a id="page-15"></a>
**Page 15**

&emsp;C. The Adopts table’s primary key includes the column fid.<br>
&emsp;D. The Adopts table’s column fid can be declared NOT NULL.

**Solution:** B, D. A is false because fid is not a column of the Pet table whatsoever. B is true because<br>
each adoption needs to identify a specific pet. C is false, because if we include fid in the primary<br>
key with pname, then each pet could be adopted more than once. D is true: if we want to identify<br>
a Pet with 0 adoptions we can exclude it from the Adopts table completely (it is recorded in the<br>
Pets table); if we want to identify a Pet with 1 adoption it will have a non-NULL fid.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 15 of 17


---

<a id="page-16"></a>
**Page 16**

**5**   **Text Search (11 points)**<br>
1\. (5 points) For each assertion, fill in the corresponding bubble True or False.<br>
&emsp;&emsp;&emsp;A. A postings list is a heap file of docIDs for a term.<br>
&emsp;&emsp;&emsp;B. In IR’s “bag of words” model, the word “running” is converted to “run”, so “running” is an<br>
&emsp;&emsp;&emsp;&emsp;example of a stop word.<br>
&emsp;&emsp;&emsp;**C. IR is used mostly with unstructured text data.**<br>
&emsp;&emsp;&emsp;D. Inverted files are so named because they are structured with document IDs ordered in descend-<br>
&emsp;&emsp;&emsp;&emsp;ing order.<br>
&emsp;&emsp;&emsp;**E. In general, relational DBMSs are faster at handling individual updates and deletes**<br>
&emsp;&emsp;&emsp;&emsp;**than Text Search Engines.**

&emsp;**Solution:** C, E<br>
&emsp;Explanation:<br>
&emsp;A is wrong. Should be a B+-tree / hash index.<br>
&emsp;B is wrong. Should be stemming.<br>
&emsp;D is wrong. Inverted File means we match from terms to docIDs.

Questions 2 to 6 refer to finding all docs matching the following Boolean expression:<br>
&emsp;`"Berkeley"` `AND` `("Database"` `OR` `"Computer")` `AND` `NOT` `"Stanford"`<br>
Assume all term searches use index scans. Assume no optimizations are applied.<br>
2\. (1 point) How many index scans will be done to perform this search? Choose one.<br>
&emsp;&emsp;&emsp;A. 1<br>
&emsp;&emsp;&emsp;B. 2<br>
&emsp;&emsp;&emsp;C. 3<br>
&emsp;&emsp;&emsp;D. 4

&emsp;**Solution:** D<br>
&emsp;Explanation:<br>
&emsp;One index scan for every term.

3\. (1 point) How many unions are performed? **Answer in a nonnegative integer.**

&emsp;**Solution:** 1<br>
&emsp;Explanation:<br>
&emsp;AND = union

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 16 of 17


---

<a id="page-17"></a>
**Page 17**

4\. (1 point) How many intersections are performed? **Answer in a nonnegative integer.**

&emsp;**Solution:** 1<br>
&emsp;Explanation:<br>
&emsp;OR = intersection

5\. (1 point) How many set subtractions are performed? **Answer in a nonnegative integer.**

&emsp;**Solution:** 1<br>
&emsp;Explanation:<br>
&emsp;AND NOT = set subtraction

6\. (2 points) Mark True or False for each of the following assertions regarding the efficiency of IR queries.<br>
&emsp;&emsp;A. To perform set operations we can use hash joins without the partitioning phase because post-<br>
&emsp;&emsp;&emsp;ings lists are already hash partitioned.<br>
&emsp;&emsp;**B. To perform set operations we can use merge joins without sorting because posting**<br>
&emsp;&emsp;&emsp;**lists are already sorted.**<br>
&emsp;&emsp;**C. Performing a set operation on two postings lists requires no more than 3 I/O**<br>
&emsp;&emsp;&emsp;**buffers in memory: two for input to the operation, one for output.**<br>
&emsp;&emsp;D. The B+-tree containing the postings lists is perfectly clustered: that is, the heap file it points<br>
&emsp;&emsp;&emsp;to is organized by (`term`, `docId`).

&emsp;**Solution:** B, C.<br>
&emsp;The postings list is stored in order by docId, so A is false and B is true. The postings lists can be<br>
&emsp;merged directly, which requires at most 3 buffers, so C is true. The postings lists is stored in the<br>
&emsp;leaves of the B+-tree; there is no heap file. So D is false

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 17 of 17

