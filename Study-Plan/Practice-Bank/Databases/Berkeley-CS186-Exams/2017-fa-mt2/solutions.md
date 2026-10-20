# Berkeley CS186 Fall 2017: Midterm 2: Official solutions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/186>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;CS 186/286 Fall 2017 Midterm 2<br>
• Do not turn this page until instructed to start the exam.<br>
• You should receive 1 single-sided answer sheet and a 16-page exam packet.<br>
• All answers should be written on the answer sheet. The exam packet will be collected but not graded.<br>
• You have 80 minutes to complete the midterm.<br>
• The midterm has 6 questions, each with multiple parts.<br>
• For each question, place only your final answer on the answer sheet; do not show work.<br>
• Use the blank spaces in your exam for scratch paper.<br>
• You are allowed one 8.5” × 11” double-sided page of notes.<br>
• No electronic devices are allowed.


---

<a id="page-2"></a>
**Page 2**

**1**   **Relational Algebra**<br>
For the following relational algebra questions, please use the schema defined below.

Students(sid, sname, year)<br>
Companies(cid, cname, valuation)<br>
Recruitment(sid, cid, position, salary, status)

&emsp;For each question, indicate which of the expressions gives the desired output. Note that the following<br>
table abbreviations are being used: Students →S, Companies →C, Recruitment →R. Also note that some<br>
of the expressions are invalid, in which case they should definitely not be marked in your answer.<br>
1\. (2 points) Find the names of all students who have received at least one recruitment offer. Note that if<br>
&emsp;a student has received an offer, the status field in the Recruitment table will be the text “offer”. Mark<br>
&emsp;all that apply.<br>
&emsp;&emsp;&emsp;A. πsname(σstatus=“offer′′(S ▷◁R))<br>
&emsp;&emsp;&emsp;B. πsname(S ▷◁(σstatus=“offer′′(R)))<br>
&emsp;&emsp;&emsp;C. σstatus=“offer′′((πsname(S)) ▷◁R)<br>
&emsp;&emsp;&emsp;D. πsname(σstatus=“offer′′(S ▷◁(πsid(R))))

&emsp;**Solution:** A, B

2\. (2 points) Find the names of all students who have not received an offer from any company. Mark all<br>
&emsp;that apply.<br>
&emsp;&emsp;&emsp;A. πsname((σstatus=“offer′′(πsid(S) −πsid(R))) ▷◁S)<br>
&emsp;&emsp;&emsp;B. πsname((πsid(S) −πsid(σstatus=“offer′′(R))) ▷◁S)<br>
&emsp;&emsp;&emsp;C. πsname(S) −πsname(σstatus=“offer′′(R ▷◁S))<br>
&emsp;&emsp;&emsp;D. σstatus=“offer′′((πsname(πsid(S) −πsid(R))) ▷◁S)

&emsp;**Solution:** B

3\. (2 points) For every record in Recruitment, output the name of the student, name of the company he/she<br>
&emsp;is being recruited for, and the position the student is being recruited for. Mark all that apply.<br>
&emsp;&emsp;&emsp;A. (πsname(S)) ▷◁(πcname(C)) ▷◁(πposition(R))<br>
&emsp;&emsp;&emsp;B. πsname,cname,position(S ▷◁C ▷◁R)<br>
&emsp;&emsp;&emsp;C. πsname,cname,position((πsid,sname(S)) ▷◁(πcid,cname(C)) ▷◁(πposition(R)))<br>
&emsp;&emsp;&emsp;D. πsname,cname,position(S ▷◁C ▷◁(πsid,cid,position(R)))

&emsp;**Solution:** B, D

4\. (1.5 points) Apple is an American computing company.   Orange is a European telecommunications<br>
&emsp;company. Consider the following two expressions:

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 2 of 16


---

<a id="page-3"></a>
**Page 3**

ρ(Apples(1 →sid), πsid(σcname=′Apple′(C ▷◁R)))<br>
ρ(Oranges(1 →sid), πsid(σcname=′Orange′(C ▷◁R)))<br>
Using those expressions, which of the expressions on the answer sheet computes the sids of students<br>
being recruited by both companies? Mark all that apply.<br>
&emsp;&emsp;&emsp;&emsp;√Apples ▷◁Oranges   √Apples ∩Oranges<br>
**Solution:**   ⃝Apples −Oranges   ⃝Apples ∪<br>
&emsp;&emsp;&emsp;&emsp;√Apples −(Apples −Oranges)<br>
Oranges   ⃝Oranges −(Apples −Oranges)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 3 of 16


---

<a id="page-4"></a>
**Page 4**

**2**   **Joins**<br>
**2.1**   **T/F Questions**<br>
1\. (2 points) Mark the statements that are true.<br>
&emsp;&emsp;&emsp;A. Grace Hash Join will always perform better than Sort Merge Join<br>
&emsp;&emsp;&emsp;**B. It is possible that a hash function will not partition data evenly during the building**<br>
&emsp;&emsp;&emsp;&emsp;**phase.**<br>
&emsp;&emsp;&emsp;**C. If one of the joining relations fits in RAM, Naive Hash Join can outperform Grace**<br>
&emsp;&emsp;&emsp;&emsp;**Hash Join.**<br>
&emsp;&emsp;&emsp;D. A two-pass Grace Hash join requires memory equivalent to the square root of the larger input<br>
&emsp;&emsp;&emsp;&emsp;relation.

&emsp;**Solution:** F,T,T,F

&emsp;**2.2**   **Young Justice**<br>
&emsp;For the following questions in this section, assume that we are streaming our query output to a terminal.<br>
&emsp;(Do not consider the cost of writing the final output)

&emsp;`CREATE` `TABLE` `JusticeLeague` `{`<br>
&emsp;&emsp;`member_id` `INTEGER` `PRIMARY` `KEY,`<br>
&emsp;&emsp;`code_name` `CHAR(33),`<br>
&emsp;&emsp;`birth_planet` `CHAR(20),`<br>
&emsp;&emsp;`power_level` `INTEGER,`<br>
&emsp;`}`

&emsp;`CREATE` `TABLE` `Teaches` `{`<br>
&emsp;&emsp;`member_id` `INTEGER` `PRIMARY` `KEY,`<br>
&emsp;&emsp;`teacher_id` `INTEGER` `REFERENCES` `JusticeLeague`<br>
&emsp;&emsp;`since` `DATE`<br>
&emsp;`}`

&emsp;We assume that<br>
&emsp;&emsp;• JusticeLeague has \[J\] = 100 pages<br>
&emsp;&emsp;• Teaches has \[T\] = 200 pages<br>
&emsp;&emsp;• Buffer size = 12 pages<br>
&emsp;&emsp;• Half the JusticeLeague records have `birth` `planet` `=` `’Earth’`<br>
2\. (2 points) What is the best possible I/O cost of using Page Nested Loops Join to perform a natural join<br>
&emsp;of Teaches and JusticeLeague? Consider both join orders!

&emsp;**Solution:**<br>
&emsp;\[J\] + \[T\]\[J\] = 100 + 100\*200 = 20100 I/Os ←This is the optimal.<br>
&emsp;\[T\] + \[T\]\[J\] = 200 + 100\*200 = 20200 I/Os

3\. (3 points) Consider the following query:

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 4 of 16


---

<a id="page-5"></a>
**Page 5**

`--` `Find` `all` `members` `who` `have` `a` `earth-born` `teacher.`<br>
`SELECT` `T.member_id`<br>
&emsp;`FROM` `JusticeLeague` `J,` `Teaches` `T`<br>
&emsp;`WHERE` `T.teacher_id` `=` `J.member_id`<br>
&emsp;&emsp;`AND` `J.birth_planet` `=` `’Earth’;`

Given the fact that half of the JusticeLeague members are earth-born, what is the best possible I/O cost<br>
to evaluate the query using Block Nested Loop Join? Assume you evaluate the selection operator on the<br>
fly (no materialization). Consider both scanT ▷◁BNLJ (σ(scanJ)) and (σ(scanJ)) ▷◁BNLJ scanT .

&emsp;**Solution:** Notice we will read in \[J\] amount of JusticeLeague no matter what. However, if we were<br>
&emsp;to evaluate J.birth planet=’Earth’ before performing the join, we will only need to save half of the<br>
&emsp;original number of pages into the buffer.<br>
&emsp;\[J\] + 1/2 \* \[T\]\[J\]/(10) = 100 + 100\*200/(2\*10) = 1100 I/Os ⇐This is the optimal.<br>
&emsp;\[T\] + \[T\]\[J\]/(10) = 200 + 10\*200 = 2200 I/Os

4\. (3 points) What is the optimal I/O cost to evaluate the previous query using Grace Hash Join, again<br>
considering both join orders with selection on the fly?

&emsp;**Solution:**

&emsp;&emsp;• Pass 1 read: \[J\] + \[T\]<br>
&emsp;&emsp;• Pass 1 write partitions: \[J\]/2 + \[T\]<br>
&emsp;&emsp;• Pass 2 build: \[J\]/2<br>
&emsp;&emsp;• Pass 2 probe: \[T\]<br>
&emsp;&emsp;• Total = 2\[J\] + 3\[T\] = 200 + 600 = 800 I/O

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 5 of 16


---

<a id="page-6"></a>
**Page 6**

&emsp;**3**   **Parallel Query Evaluation**<br>
&emsp;A local animal shelter that houses dogs, cats, and ducks maintains a database of their animals in the following<br>
&emsp;relations:

&emsp;Dogs(dog id, name, birthyear)<br>
&emsp;Cats(cat id, name, birthyear)<br>
&emsp;Ducks(duck id, name id, birthyear)<br>
&emsp;Names(name id, name)

&emsp;These relations are distributed across 3 different machines as follows:<br>
&emsp;&emsp;• Dogs is stored solely on Machine 1.<br>
&emsp;&emsp;• Cats is range-partitioned on birthyear over Machines 2 and 3.<br>
&emsp;&emsp;• Ducks is hash-partitioned on name id over Machines 1, 2, and 3.<br>
&emsp;&emsp;• Names is round-robin partitioned over Machines 1, 2, and 3.<br>
&emsp;The network our database uses supports only “point-to-point” (“unicast”) messages. That is, for Machine 1<br>
&emsp;to send the same message m of b bytes to each of Machines 2 and 3, it must send m to Machine 2, and then<br>
&emsp;separately send m to Machine 3; a total of 2b bytes sent.

&emsp;The following questions consider the following SQL query to get the names of all dogs, cats, and ducks:<br>
1`(SELECT` `name` `FROM` `Dogs`<br>
2`UNION` `ALL`<br>
3`SELECT` `name` `FROM` `Cats)`<br>
4`UNION`<br>
5`(SELECT` `name`<br>
6`FROM` `Names` `INNER` `JOIN` `Ducks`<br>
7`ON` `Ducks.name_id` `=` `Names.name_id)`

&emsp;1\. (2 points) Which of the following operations can be pipeline breakers in this query? Assume that we<br>
&emsp;&emsp;have very little memory relative to the amount of data. Mark all that apply.<br>
&emsp;&emsp;&emsp;&emsp;A. Full Table Scan on Dogs (line 1)<br>
&emsp;&emsp;&emsp;&emsp;**B. Parallel Hash Join (lines 6, 7)**<br>
&emsp;&emsp;&emsp;&emsp;C. `UNION` `ALL` of Dogs and Cats (line 2)<br>
&emsp;&emsp;&emsp;&emsp;**D.** `UNION` **of the two subqueries (line 4)**

&emsp;&emsp;**Solution:** The union between the two subqueries is a pipeline breaker: UNION filters out duplicates,<br>
&emsp;&emsp;and because we are memory-constrained, we cannot filter duplicates by keeping track of previously<br>
&emsp;&emsp;seen values, and must resort to external sorting or hashing.<br>
&emsp;&emsp;The parallel hash join is a pipeline breaker: we have little memory and therefore a symmetric<br>
&emsp;&emsp;hash join will not work and we must first partition/hash our data locally, which means reading in<br>
&emsp;&emsp;everything before returning a tuple.<br>
&emsp;&emsp;The union between Dogs and Cats is not a pipeline breaker since UNION ALL does not filter<br>
&emsp;&emsp;duplicates, so we can just immediately yield any record obtained from scanning either Dogs or Cats.<br>
&emsp;&emsp;The full table scans are not pipeline breakers, since they yield records immediately and do not<br>
&emsp;&emsp;require everything to be read in first.

&emsp;2\. (1 point) Using parallel Grace hash join, what is the lowest network cost (the number of bytes sent over<br>
&emsp;&emsp;the network by any node) possible while performing the join of Names and Ducks?

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 6 of 16


---

<a id="page-7"></a>
**Page 7**

\[N\] denotes the number of pages in Names and \[D\] denotes the number of pages in Ducks. Each page is<br>
4KB.<br>
&emsp;&emsp;A. \[N\] \* 4KB<br>
&emsp;&emsp;B. \[D\] \* 4KB<br>
&emsp;&emsp;3 (\[N\] + \[D\]) \* 4KBC.1<br>
&emsp;&emsp;3 (\[N\] + \[D\]) \* 4KBD.2<br>
&emsp;&emsp;E. (\[N\] + \[D\]) \* 4KB<br>
&emsp;&emsp;3 **\[N\] \* 4KBF.**2<br>
&emsp;&emsp;G. None of the above

&emsp;**Solution:** The join between Names and Ducks is a hash join with asymmetric shuffle, since Ducks<br>
&emsp;is already partitioned over the join key (name id). We therefore do not need to partition Ducks.<br>
&emsp;3 \* \[N\] \* 4KB, since we have to send 2The network cost of shuffling Names over the machines is 2<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3<br>
&emsp;of the entire relation over the network once, and since we only send data over the network while<br>
&emsp;3 factor comes from the fact that a third of all theshuffling, this is the total network cost. The 2<br>
&emsp;data will be partitioned to the machine it is already on (since we have 3 machines), and therefore is<br>
&emsp;not sent over the network.

3\. (0.5 points) True or False? There is an extra disk I/O cost for parallel Grace Hash Join due to reparti-<br>
tioning (shuffling) the data across machines.

&emsp;**Solution:** False. Tuples are streamed from the full table scans into the local hash join operators<br>
&emsp;on each of the machines, so the repartitioning does not incur any additional disk I/O cost (there is<br>
&emsp;a network cost, as calculated in the previous question, but no additional disk I/O cost).

4\. (1 point) Suppose we range-partition cats by birthyear, so that Machine 2 stores cats born before 1950,<br>
and Machine 3 stores cats born 1950 or later. Assume both machines perform scans at the same rate.<br>
If 40% of cats in our data were born before 1950, how long will it take for a parallel scan of cats to<br>
complete?<br>
\[C\] denotes the number of pages in Cats, and D represents the time taken to perform a single I/O.<br>
&emsp;&emsp;A. 1/3 \* \[C\] \* D<br>
&emsp;&emsp;B. 0.4 \* \[C\] \* D<br>
&emsp;&emsp;**C. 0.6 \* \[C\] \* D**<br>
&emsp;&emsp;D. \[C\] \* D<br>
&emsp;&emsp;E. None of the above

&emsp;**Solution:** Machine 1 has no pages of Cats and does nothing.<br>
&emsp;Machine 2 performs just a full table scan on the 0.4 \* \[C\] pages of cats it has.<br>
&emsp;Machine 3 performs just a full table scan on the 0.6 \* \[C\] pages of cats it has.<br>
&emsp;The scans Machine 2 and 3 perform run in parallel, so we are finished once the longer scan finishes,<br>
&emsp;which is 0.6 \* \[C\] \* r.

5\. (2 points) Now suppose we wish to compare cats and dogs with the same name, and perform the following<br>
query:

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 7 of 16


---

<a id="page-8"></a>
**Page 8**

&emsp;&emsp;&emsp;`SELECT` `*` `FROM` `Cats` `INNER` `JOIN` `Dogs` `ON` `Cats.name` `=` `Dogs.name`

Assuming that \[Dogs\] = 10 pages and \[Cats\] = 1000 pages, what is the least number of pages that must<br>
be transferred across the network to perform this join?

&emsp;**Solution:** We can perform a broadcast join since Dogs is a small table. We send all of Dogs to<br>
&emsp;Machines 2 and 3, and then we join Dogs and Cats locally, resulting in a network cost of 2 \* \[Dogs\]<br>
&emsp;= 20 pages.

6\. (1.5 points) In the following questions, select the correct choice to fill in the blank.<br>
&emsp;(a) (0.5 points) The term   captures the improvement in throughput as the parallelism<br>
&emsp;&emsp;(number of machines) is increased.<br>
&emsp;&emsp;&emsp;&emsp;**A. speedup**<br>
&emsp;&emsp;&emsp;&emsp;B. scaleup<br>
&emsp;(b) (0.5 points) The term   captures the ability to maintain throughput as both the<br>
&emsp;&emsp;parallelism and the size of the data are increased.<br>
&emsp;&emsp;&emsp;&emsp;A. speedup<br>
&emsp;&emsp;&emsp;&emsp;**B. scaleup**<br>
&emsp;(c) (0.5 points) Given: 50% of the Ducks in our database all share the same name id. Suppose we run<br>
&emsp;&emsp;a series of experiments, each time increasing the number of machines over which we hash-partition<br>
&emsp;&emsp;the Ducks table, and measuring the time to complete a parallel scan of Ducks each time. Across<br>
&emsp;&emsp;experiments, the completion time for parallel scan will be a   function of the number<br>
&emsp;&emsp;of machines used.<br>
&emsp;&emsp;&emsp;&emsp;**A. constant**<br>
&emsp;&emsp;&emsp;&emsp;B. logarithmic<br>
&emsp;&emsp;&emsp;&emsp;C. linear<br>
&emsp;&emsp;&emsp;&emsp;D. exponential

&emsp;&emsp;&emsp;**Solution:** Ducks is hash-partitioned on name id, so a single machine will get every record with<br>
&emsp;&emsp;&emsp;the popular name id. As we increase the number of machines, we remain bottlenecked by the<br>
&emsp;&emsp;&emsp;single machine with the popular name id (which always has to scan half the records), so the<br>
&emsp;&emsp;&emsp;completion time is constant.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 8 of 16


---

<a id="page-9"></a>
**Page 9**

**4**   **Query Optimization**<br>
For the following questions, assume the following:<br>
&emsp;• The System R assumptions about uniformity and independence from lecture hold<br>
&emsp;• We use System R defaults when selectivity estimation is not possible<br>
&emsp;• Primary key IDs are sequential, starting from 1<br>
&emsp;• Our optimizer does not consider interesting orders

**Table Schema**   **Records**   **Pages**   **Indices**<br>
`CREATE` `TABLE` `Student` `(`   • Index 1:   Clustered(`major`).   There are 130<br>
&emsp;`sid` `INTEGER` `PRIMARY` `KEY,`   unique majors<br>
&emsp;`name` `VARCHAR(32),`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;25,000   500<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;• Index 2:   Unclustered(`semesters` `completed`).<br>
&emsp;`major` `VARCHAR(64)),`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;There are **11 unique values** in the range<br>
&emsp;`semesters_completed` `INTEGER`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**\[0, 10\]**<br>
`)`<br>
`CREATE` `TABLE` `Application` `(`<br>
&emsp;`sid` `INTEGER` `REFERENCES` `Student,`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;• Index 3: Clustered(cid, sid).<br>
&emsp;`cid` `INTEGER` `REFERENCES` `Company,`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;100,000   10,000<br>
&emsp;`status` `TEXT,`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;• Given: `status` has **10 unique values**<br>
&emsp;`(sid,` `cid)` `PRIMARY` `KEY`<br>
`)`<br>
`CREATE` `TABLE` `Company` `(`   • Index 4: Unclustered(cid)<br>
&emsp;`cid` `INTEGER` `PRIMARY` `KEY,`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;500   100<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;• Index 5:   Clustered(`open` `roles`).   There are<br>
&emsp;`open_roles`   `INTEGER)`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**500 unique values** in the range **\[1, 500\]**<br>
`)`

&emsp;`SELECT` `Student.name,` `Company.open_roles,` `Application.referral`<br>
&emsp;&emsp;`FROM` `Student,` `Application,` `Company`<br>
&emsp;`WHERE` `Student.sid` `=` `Application.sid`   -- (Selectivity 1)<br>
&emsp;&emsp;`AND` `Application.cid` `=` `Company.cid`   -- (Selectivity 2)<br>
&emsp;&emsp;`AND` `Student.semesters_completed` `>` `6`   -- (Selectivity 3)<br>
&emsp;&emsp;`AND` `(Student.major=’EECS’` `OR` `Company.open_roles` `<=` `50)`   -- (Selectivity 4)<br>
&emsp;&emsp;`AND` `NOT` `Application.status` `=` `’limbo’`   -- (Selectivity 5)<br>
&emsp;`ORDER` `BY` `Company.open_roles;`<br>
&emsp;For the first 5 questions, write the reduction factor for each clause in the answer box as a fully-reduced<br>
fraction. For example, 1/2 should be written as:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1   /   2<br>
**Note:** Answers that are not reduced fractions or are formatted incorrectly will receive 0 points.<br>
1\. (0.5 points) `Student.sid` `=` `Application.sid`

&emsp;**Solution:**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1   1<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;max(25000, 25000) =<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;25, 000<br>
&emsp;There are exactly 25000 values in Student.sid, and due to the foreign key, there are at most 25000<br>
&emsp;values in Application.sid.

2\. (0.5 points) `Application.cid` `=` `Company.cid`

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 9 of 16


---

<a id="page-10"></a>
**Page 10**

&emsp;**Solution:**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1   1<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;max(500, 500) =<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;500<br>
&emsp;There are exactly 500 values in Company.cid, and due to the foreign key, there are at most 500<br>
&emsp;values in Application.cid

3\. (0.5 points) `Student.semesters` `completed` `>` `6`

&emsp;**Solution:**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;10 −0 + 1 = 410 −6<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;11<br>
&emsp;We have a histogram with 11 unique values. Therefore we use the equation for less than or equal to<br>
&emsp;which is (high key - value) / (high key - low key + 1).

4\. (1 point) `Student.major` `=` `’EECS’` `OR` `Company.open` `roles` `<=` `50`

&emsp;**Solution:**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1300 = 1391300 + 130130 ∗110) −( 1130 + 1( 1   10   1<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;10\) =   1300 −<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1300<br>
&emsp;We can find the selectivity that they are an EECS major by using the equation 1/distinct values.<br>
&emsp;Next, we find the selectivity that open positions are less than or equal to 50 using the equation<br>
&emsp;(v - low key) / ((high key - low key + 1) + (1 / number distinct)). Lastly we combine these two<br>
&emsp;selectivities using S(p1) + S(p2) - S(p1)S(p2) to determine the selectivity of having one or the other.

5\. (0.5 points) `NOT` `Application.status` `=` `’limbo’`

&emsp;**Solution:**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;10 = 91 −1<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;10<br>
&emsp;10, so we can use the equation forGiven 10 unique values, the non-negated predicate has selectivity1<br>
&emsp;NOT which is 1 - selectivity of the predicate.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 10 of 16


---

<a id="page-11"></a>
**Page 11**

6\. (2.5 points) For each predicate, mark the first pass of Selinger’s algorithm that uses its selectivity to<br>
estimate output size.<br>
&emsp;(a) Selectivity 1: Pass 1, Pass 2, or Pass 3.<br>
&emsp;(b) Selectivity 2: Pass 1, Pass 2, or Pass 3.<br>
&emsp;(c) Selectivity 3: Pass 1, Pass 2, or Pass 3.<br>
&emsp;(d) Selectivity 4: Pass 1, Pass 2, or Pass 3.<br>
&emsp;(e) Selectivity 5: Pass 1, Pass 2, or Pass 3.

&emsp;**Solution:** Pass 2, Pass 2, Pass 1, Pass 3, Pass 1. Note that (d)—the OR predicate—is over 2 tables<br>
&emsp;that have no associated join predicate, so the selection is postponed along with the cross-product,<br>
&emsp;until after 3-way joins are done.

7\. (1 point) Mark the choices for all access plans that would be considered in pass 2 of the Selinger algo-<br>
rithm.<br>
&emsp;&emsp;A. Student ▷◁Application (800 IOs)<br>
&emsp;&emsp;B. Application ▷◁Student (750 IOs)<br>
&emsp;&emsp;C. Student ▷◁Company (470 IOs)<br>
&emsp;&emsp;D. Company ▷◁Student (525 IOs)<br>
&emsp;&emsp;E. Application ▷◁Company (600 IOs)<br>
&emsp;&emsp;F. Company ▷◁Application (575 IOs)

&emsp;**Solution:** A, B, E, and F will be considered because they are not cross products.

8\. (1 point) Mark the choices from the previous question for all access plans that would be chosen at the<br>
end of pass 2 of the Selinger algorithm.

&emsp;**Solution:** B and F will be chosen because they have the lower cost for joining the two tables tables.

9\. (1 point) Mark the choices for all plans that would be considered in pass 3. Note carefully the nested<br>
expressions: you may want to draw them out.<br>
&emsp;&emsp;A. Company ▷◁(Application ▷◁Student) (175,000 IOs)<br>
&emsp;&emsp;B. Company ▷◁(Student ▷◁Application) (150,000 IOs)<br>
&emsp;&emsp;C. Application ▷◁(Company ▷◁Student) (155,000 IOs)<br>
&emsp;&emsp;D. Application ▷◁(Company ▷◁Student) (160,000 IOs)<br>
&emsp;&emsp;E. Student ▷◁(Company ▷◁Application) (215,000 IOs)<br>
&emsp;&emsp;F. (Company ▷◁Application) ▷◁Student (180,000 IOs)<br>
&emsp;&emsp;G. (Application ▷◁Company) ▷◁Student (200,000 IOs)<br>
&emsp;&emsp;H. (Application ▷◁Student) ▷◁Company (194,000 IOs)<br>
&emsp;&emsp;&emsp;I. (Student ▷◁Application) ▷◁Company (195,000 IOs)<br>
&emsp;&emsp;&emsp;J. (Student ▷◁Company) ▷◁Application (165,000 IOs)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 11 of 16


---

<a id="page-12"></a>
**Page 12**

&emsp;**Solution:** Considers F, H

10\. (1 point) Mark the choices from the previous question for all plans that would be chosen at the end of<br>
&emsp;pass 3.

&emsp;**Solution:** Chooses F.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 12 of 16


---

<a id="page-13"></a>
**Page 13**

**5**   **Database Design**<br>
**5.1**   **ER Diagrams**<br>
Consider the following ER diagrams labelled i, ii, and iii.


![Figure on page 13](figures/solutions-p13-fig01.png)


![Figure on page 13](figures/solutions-p13-fig02.png)


![Figure on page 13](figures/solutions-p13-fig03.png)

(i)   (ii)   (iii)

1\. (0.5 points) Which ER diagram do the following SQL statements correspond to? Note that there is<br>
&emsp;exactly one correct answer.<br>
&emsp;&emsp;`CREATE` `TABLE` `S(s` `INT,` `PRIMARY` `KEY` `(s));`<br>
&emsp;&emsp;`CREATE` `TABLE` `R(r` `INT,` `s` `INT` `REFERENCES` `S,` `PRIMARY` `KEY` `(r));`

&emsp;**Solution:** (ii). By embedding a reference to `S` in the `R` relation, we ensure that every tuple in `R` can<br>
&emsp;only be linked to at most one tuple in `S`. Because `R.s` can be `NULL`, it is also possible that a tuple<br>
&emsp;in `R` doesn’t link any tuple in `S`.<br>
&emsp;This question was graded all or nothing. The correct answer received 0.5 points; every other answer<br>
&emsp;received 0 points.

2\. (0.5 points) Which ER diagram do the following SQL statements correspond to? Note that there is<br>
&emsp;exactly one correct answer.<br>
&emsp;&emsp;`CREATE` `TABLE` `R(r` `INT,` `PRIMARY` `KEY` `(r));`<br>
&emsp;&emsp;`CREATE` `TABLE` `S(s` `INT,` `PRIMARY` `KEY` `(s));`<br>
&emsp;&emsp;`CREATE` `TABLE` `L(r` `INT` `REFERENCES` `R,` `s` `INT` `REFERENCES` `S);`

&emsp;**Solution:** (i). By creating a third `L` relation, a tuple in `R` can match many tuples in `S`, and a tuple<br>
&emsp;in `S` can match many tuples in `R`. Moreover, it’s possible that tuples in `R` and tuples in `S` don’t link<br>
&emsp;with any other tuple.<br>
&emsp;This question was graded all or nothing. The correct answer received 0.5 points; every other answer<br>
&emsp;received 0 points.

3\. (0.5 points) Which ER diagram do the following SQL statements correspond to? Note that there is<br>
&emsp;exactly one correct answer.<br>
&emsp;&emsp;`CREATE` `TABLE` `S(s` `INT,` `PRIMARY` `KEY` `(s));`<br>
&emsp;&emsp;`CREATE` `TABLE` `R(r` `INT,` `s` `INT` `NOT` `NULL` `REFERENCES` `S,` `PRIMARY` `KEY` `(r));`

&emsp;**Solution:** (iii). By embedding a reference to `S` in the `R` relation, we ensure that every tuple in `R`<br>
&emsp;can only be linked to at most one tuple in `S`. Because `R.s` is marked `NOT` `NULL`, every tuple is also<br>
&emsp;guaranteed to be linked to some tuple in `S`.<br>
&emsp;This question was graded all or nothing. The correct answer received 0.5 points; every other answer<br>
&emsp;received 0 points.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 13 of 16


---

<a id="page-14"></a>
**Page 14**

**5.2**   **Functional Dependencies and Normalization**<br>
4\. (1 point) True or False? For all sets of functional dependencies F and G, F + ∪G+ = (F ∪G)+. That<br>
&emsp;is, closure is homomorphic.

&emsp;**Solution:** False. Consider a relation with three attributes x, y, and z. Let X = {x}, Y = {y}, and<br>
&emsp;Z = {z}. Let F = {X →Y }, and let G = {Y →Z}. X →Z /∈F + and X →Z /∈G+, but by<br>
&emsp;transitivity X →Z ∈(F ∪G)+. Thus, F + ∪G+̸ = (F ∪G)+.<br>
&emsp;This question was graded all or nothing. The correct answer received 1 point; every other answer<br>
&emsp;received 0 points.

5\. (2 points) Which of the following functional dependencies are in the closure of {T →UV, TV   →<br>
&emsp;WX, UX →Y }? Mark all that apply.

&emsp;&emsp;• UX →W   • V →X   • T →X   • T →Y

&emsp;**Solution:** UX →W /∈F + and V →X /∈F +. T →UV and TV →WX, so T →WX. Thus, by<br>
&emsp;decomposition, T →X. Moreover, UX →Y , so T →Y .<br>
&emsp;This question was graded as 4 independent true/false questions, each worth 0.5 points. That is, you<br>
&emsp;got 0.5 points for every correct choice that you selected and 0.5 points for every incorrect choice<br>
&emsp;that you did not select.

6\. (2 points) Given the relation R and functional dependencies above, which of the following attribute sets<br>
&emsp;are superkeys? Mark all that apply.

&emsp;&emsp;• T   • UV   • TV   • UX

&emsp;**Solution:** An attribute set X is a superkey if X+ = R. T + = TUV WXY , so T is a superkey.<br>
&emsp;(UV )+ = UV , so UV is not a superkey. TV + = TUV WXY , so it is a superkey, and UX+ = UXY ,<br>
&emsp;so UX is not a superkey.<br>
&emsp;This question was graded as 4 independent true/false questions, each worth 0.5 points. That is, you<br>
&emsp;got 0.5 points for every correct choice that you selected and 0.5 points for every incorrect choice<br>
&emsp;that you did not select.

7\. (1 point) Given the relation R and functional dependencies above, which of the following attribute sets<br>
&emsp;are candidate keys? Mark all that apply.

&emsp;&emsp;• T   • UV   • TV   • UX

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 14 of 16


---

<a id="page-15"></a>
**Page 15**

&emsp;**Solution:** An attribute set is a candidate key if it is a minimal superkey. T + = TUV WXY , and<br>
&emsp;T is minimal, so T is a candidate key. (UV )+ = UV , so UV is not a superkey. TV + = TUV WXY<br>
&emsp;but TV is not minimal, so it is a superkey but not a candidate key, and UX+ = UXY , so UX is<br>
&emsp;not a superkey.<br>
&emsp;This question was graded as 4 independent true/false questions, each worth 0.25 points. That is,<br>
&emsp;you got 0.25 points for every correct choice that you selected and 0.25 points for every incorrect<br>
&emsp;choice that you did not select.

8\. (1 point) Is R in BCNF?

&emsp;**Solution:** No. UX is not a superkey, so the non-trivial dependency UX →Y violates BCNF.<br>
&emsp;This question was graded all or nothing. The correct answer received 1 point; every other answer<br>
&emsp;received 0 points.

9\. (2 points) Which of the following are lossless-join decompositions of R? Mark all that apply.<br>
&emsp;&emsp;&emsp;A. TV W and UXY<br>
&emsp;&emsp;&emsp;B. T and UV WXY<br>
&emsp;&emsp;&emsp;**C.** TUV WX **and** UXY<br>
&emsp;&emsp;&emsp;**D.** TUV WX **and** TUXY

&emsp;**Solution:** A and B are not lossless-join decompositions.<br>
&emsp;C is produced by following the decomposition algorithm presented in class. We use the UX →Y<br>
&emsp;functional dependency to separate TUV WXY into TUV WXY −Y and UX ∪Y . This is a lossless-<br>
&emsp;join decomposition.<br>
&emsp;D is a lossless join decomposition because both TUV WX and TUXY contain T which is a candidate<br>
&emsp;key.<br>
&emsp;This question was graded as 4 independent true/false questions, each worth 0.5 points. That is, you<br>
&emsp;got 0.5 points for every correct choice that you selected and 0.5 points for every incorrect choice<br>
&emsp;that you did not select.

10\. (1 point) Which of the following are lossless-join decompositions of R into BCNF? Mark all that apply.<br>
&emsp;&emsp;&emsp;A. TV W and UXY<br>
&emsp;&emsp;&emsp;B. T and UV WXY<br>
&emsp;&emsp;&emsp;**C.** TUV WX **and** UXY<br>
&emsp;&emsp;&emsp;D. TUV WX and TUXY

&emsp;**Solution:** A and B are not lossless-join decompositions.<br>
&emsp;C is produced by following the decomposition algorithm presented in class. We use the UX →Y<br>
&emsp;functional dependency to separate TUV WXY into TUV WXY −Y and UX ∪Y . This is a lossless-<br>
&emsp;join decomposition. Moreover, both TUV W and UXY are in BCNF.<br>
&emsp;D is a lossless join decomposition because both TUV WX and TUXY contain T which is a candidate<br>
&emsp;key. However, TUXY is not in BCNF because UX is not a superkey in TUXY , but UX →Y .

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 15 of 16


---

<a id="page-16"></a>
**Page 16**

This question was graded as 4 independent true/false questions, each worth 0.25 points. That is,<br>
you got 0.25 points for every correct choice that you selected and 0.25 points for every incorrect<br>
choice that you did not select.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 16 of 16

