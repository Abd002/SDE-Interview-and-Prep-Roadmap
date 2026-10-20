# Berkeley CS186 Spring 2016: Final: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/186>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Name: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Account: CS186 - \_\_ \_\_ \_\_

CS186 Final Exam                                  Spring 2016

You should receive 1 double-sided answer sheet and a **21-page** exam. There are a total of **147 Points**.<br>
Mark your name and login on both sides of the answer sheet, and in the blanks above. For each question,<br>
place only your final answer on the answer sheet—do not show work or formulas there.  You may use the<br>
blank spaces for scratch paper, but do not tear off any pages. You will turn in both question and answer<br>
sheets.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1


---

<a id="page-2"></a>
**Page 2**

I. BASICS \[14 POINTS\]<br>
For each image on the next page, select the letter corresponding to the best description.<br>
&emsp;a) Left Deep Tree    h) Slotted Page<br>
&emsp;b) Key Compression    i)    Variable Length Tuple<br>
&emsp;c) B+Tree    j)    Fixed Length Tuple<br>
&emsp;d) ISAM    k) Buffer Frame<br>
&emsp;e) Nested Loops Join    l)    Sort based group by<br>
&emsp;f) Sort Merge Join    m) mapPartitions<br>
&emsp;g) Indexed Nested Loop Join    n) Tournament Sort

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;This space is intentionally blank; exam continues on next page.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2


---

<a id="page-3"></a>
**Page 3**


![Figure on page 3](figures/questions-p03-fig01.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3


---

<a id="page-4"></a>
**Page 4**

II. CONCURRENCY \[13 POINTS\]

&emsp;1\. **\[3 Points\]** For the following statements, mark the boxes for all true statement(s), or mark<br>
&emsp;&emsp;∅ if none are true.<br>
&emsp;&emsp;&emsp;a) In a system that uses two-phase locking, a transaction may perform writes after<br>
&emsp;&emsp;&emsp;&emsp;&emsp;the first lock has been released.<br>
&emsp;&emsp;&emsp;b) An SIX lock is compatible with another SIX lock on the same resource.<br>
&emsp;&emsp;&emsp;c) In a system that uses the wound-wait protocol, there can be two disjoint deadlock<br>
&emsp;&emsp;&emsp;&emsp;&emsp;cycles at the same time.<br>
&emsp;&emsp;&emsp;d) By definition, a schedule is conflict serializable if it is equivalent to a serial<br>
&emsp;&emsp;&emsp;&emsp;&emsp;schedule.<br>
&emsp;&emsp;&emsp;e) In a system that uses strict two-phase locking, if a transaction aborts, it releases<br>
&emsp;&emsp;&emsp;&emsp;&emsp;all of its locks as soon as rollback is complete.<br>
&emsp;&emsp;&emsp;f) In a system that uses strict two-phase locking, a transaction that only performs<br>
&emsp;&emsp;&emsp;&emsp;&emsp;reads can never enter a deadlock cycle.

Consider the following sequence of actions from time steps 1 through 10. The meanings of<br>
actions are shown below:

&emsp;&emsp;R(A): the transaction reads tuple A                  W(A): the transaction writes tuple A<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;COM: the transaction commits


![Figure on page 4](figures/questions-p04-fig02.png)

&emsp;2\. **\[3 Points\]** Draw the dependency graph for this schedule. (**Figure is on Answer Sheet.**)

&emsp;3\. **\[2 Points\]** Which of the following would guarantee that the schedule is serializable?<br>
&emsp;&emsp;Consider each scenario independently. Mark the boxes for all true statement(s), or mark<br>
&emsp;&emsp;∅ if none are true.

&emsp;&emsp;&emsp;a) Remove T1’s write to A at time step 5.<br>
&emsp;&emsp;&emsp;b) Change the commit order (i.e., swap values in time-steps 8, 9, and 10)<br>
&emsp;&emsp;&emsp;c) T1 and T2 write the same value to A at time steps 5 and 7, respectively.<br>
&emsp;&emsp;&emsp;d) T1 writes a value to A that is one less than it read from A earlier; T2 writes a<br>
&emsp;&emsp;&emsp;&emsp;&emsp;value to A that is 2 times larger than it read from A earlier.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4


---

<a id="page-5"></a>
**Page 5**

Consider the following sequence of lock requests from time steps 1 through 6. Assume that the<br>
system uses **strict two-phase locking at only the tuple level**. None of the transactions<br>
commit or abort during the specified time period. The meanings of requests are shown below:

•    S(A): the transaction requests (but does not necessarily acquire) a shared lock on tuple A<br>
•    X(A): the transaction requests (but does not necessarily acquire) an exclusive lock on tuple A


![Figure on page 5](figures/questions-p05-fig03.png)

&emsp;4\. **\[3 Points\]** Draw the waits-for graph for the series of requests above. (**Figure is on the**<br>
&emsp;&emsp;**answer Sheet.**)

&emsp;5\. **\[1 Point\]** (True/False) There are no deadlocks in the sequence of lock requests.

&emsp;6\. **\[1 Point\]** (True/False) If T1 requests a shared lock on B at time-step 7 there are **no**<br>
&emsp;&emsp;**deadlocks.**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;This space is intentionally blank; exam continues on next page.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;5


---

<a id="page-6"></a>
**Page 6**

III.MULTIGRANULARITY LOCKING \[6 POINTS\]<br>
Consider the following sequence of actions from time steps 1 through 9. Assume that we are<br>
using strict two-phase locking with locks that can be acquired at the table, page, and tuple<br>
levels. Assume that at each time step, the transaction acquires the locks with minimal privilege<br>
required to complete the specified action.

Table Y contains pages A, B, and C. Page A contains tuples A1, …, A20. Page B contains tuples<br>
B1, …, B30. Page C contains tuples C1, …, C10. R(A) indicates that the transaction reads page A.<br>
W(A) indicates that the transaction writes page A. Italicized and underlined values indicate<br>
actions that were blocked because they could not acquire all of the necessary locks. Intention<br>
lock requests are not shown, but assume that the system follows multi-granularity strict two-<br>
phase locking. None of the transactions commit or abort during the specified time period.


![Figure on page 6](figures/questions-p06-fig04.png)

&emsp;1\. **\[2 points\]** For each transaction write down the **table level locks** it has acquired on<br>
&emsp;&emsp;**table Y** at the moment T4 is blocked during time step 9. For instance, if a transaction<br>
&emsp;&emsp;acquires an S lock on Y, write S(Y); if none write ∅.

&emsp;2\. **\[3 points\]** Suppose T2 commits at time step 10. Which locks do T1, T3, and T4 **acquire**<br>
&emsp;&emsp;after this happens? Again, use locks with **minimal privilege**. For example, to indicate<br>
&emsp;&emsp;that a transaction acquires an S lock on page A, use the notation S(A). **(**Hint: recall from<br>
&emsp;&emsp;Homework 4 that if multiple transactions are waiting to acquire a lock on a resource, we<br>
&emsp;&emsp;form a FIFO wait queue.)

&emsp;3\. **\[1 point\] (True or False)** Consider time step 9 in the chart above. If T4’s W(B3) at that<br>
&emsp;&emsp;time step had instead been R(A), then the action would **not** have been blocked.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;6


---

<a id="page-7"></a>
**Page 7**

IV. ARIES RECOVERY \[20 POINTS\]

&emsp;**1. \[2 Points\]** Suppose that you are forced to flush pages in the DPT to disk upon<br>
&emsp;&emsp;checkpointing. Which of the following cases are now guaranteed? **There is exactly one**<br>
&emsp;&emsp;**correct answer.**<br>
&emsp;&emsp;&emsp;a) We can skip one of the three phases (analysis/redo/undo) completely<br>
&emsp;&emsp;&emsp;b) We must start analysis from the beginning of the log<br>
&emsp;&emsp;&emsp;c) Redo can start at the checkpoint.<br>
&emsp;&emsp;&emsp;d) Redo must start from the beginning of the log<br>
&emsp;&emsp;&emsp;e) Undo can start at the checkpoint<br>
&emsp;&emsp;&emsp;f) Undo must run until the beginning of the log

&emsp;2\. **\[4 Points\]** Consider the following log, recovered after a crash. T1 and T2 are the only<br>
&emsp;&emsp;transactions.  All pages were flushed to disk at and including LSN 60, so the log record<br>
&emsp;&emsp;has been truncated to start at LSN 70.


![Figure on page 7](figures/questions-p07-fig05.png)

&emsp;&emsp;Assuming the buffer has **not** flushed any pages to disk after LSN 60, fill out the<br>
&emsp;&emsp;transaction table and dirty page table given on the answer sheet **as recorded in the**<br>
&emsp;&emsp;**end checkpoint record**. You may not need all rows, and may list the<br>
&emsp;&emsp;transactions/pages in any order.

&emsp;3\. **\[6 points\]** Now, fill out the transaction table and dirty page table on the answer sheet for<br>
&emsp;&emsp;the same log **after the analysis phase**. You may not need all rows.

&emsp;4\. **\[6 points\]** After recovery is complete, what records have been added to the log? You<br>
&emsp;&emsp;may not need all rows on the answer sheet. Be sure to follow the log record format we<br>
&emsp;&emsp;use above. (You may omit End records.)

&emsp;5\. **\[1 point\]** True/False: After recovery, both the Transaction Table and Dirty Page Table<br>
&emsp;&emsp;are empty.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;7


---

<a id="page-8"></a>
**Page 8**

&emsp;6\. **\[1 Points\]** Consider a slightly different scenario, in which the records at LSN 100 and<br>
&emsp;&emsp;110 are in opposite order (that is, the UPDATE occurs before the End Checkpoint). Of<br>
&emsp;&emsp;the following, choose the **single** most appropriate answer.<br>
&emsp;&emsp;&emsp;a) The DPT stored in the checkpoint must be different than in the original scenario.<br>
&emsp;&emsp;&emsp;b) The DPT stored in the checkpoint could be different than in the original scenario.<br>
&emsp;&emsp;&emsp;c) The DPT stored in the checkpoint must be the same as in the original scenario.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;This space is intentionally blank; exam continues on next page.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;8


---

<a id="page-9"></a>
**Page 9**

V. TWO PHASE COMMIT \[14 POINTS\]

&emsp;1\. **\[6 Points\]** Mark the boxes for all true statement(s), or mark ∅ if none are true.<br>
&emsp;&emsp;&emsp;a) Eventual consistency guarantees that if you read a copy from one replica, the<br>
&emsp;&emsp;&emsp;&emsp;&emsp;other replicas will eventually be consistent with what you read.<br>
&emsp;&emsp;&emsp;b) Two-phase commit (2PC) requires write-ahead logging, but not all log records<br>
&emsp;&emsp;&emsp;&emsp;&emsp;must be flushed to disk before their corresponding message is sent.<br>
&emsp;&emsp;&emsp;c) In 2PC, coordinators send prepare messages to participants. The coordinator<br>
&emsp;&emsp;&emsp;&emsp;&emsp;must write a log record when all prepare messages have been sent.<br>
&emsp;&emsp;&emsp;d) A global commit message cannot be sent before the coordinator has received a<br>
&emsp;&emsp;&emsp;&emsp;&emsp;vote from all participants.<br>
&emsp;&emsp;&emsp;e) A global abort message cannot be sent before the coordinator has received a<br>
&emsp;&emsp;&emsp;&emsp;&emsp;vote from all participants.<br>
&emsp;&emsp;&emsp;f) A participant machine that does not flush its prepare records to the log could<br>
&emsp;&emsp;&emsp;&emsp;&emsp;violate the durability property.

&emsp;2\. **\[2 Points\]** Suppose that you are a machine that has just recovered from a crash.  You<br>
&emsp;&emsp;discover a prepare record in your log for transaction T, and deduce that you are a<br>
&emsp;&emsp;participant. But you do not find a commit record. Under proper 2PC and logging<br>
&emsp;&emsp;protocols, mark the boxes for all true statement(s), or mark ∅ if none are true..<br>
&emsp;&emsp;&emsp;a) The coordinator must have received your vote.<br>
&emsp;&emsp;&emsp;b) You must determine if you need to commit or abort.

&emsp;3\. **\[3 Points\]** Given the scenario from the previous question, answer the following:<br>
&emsp;&emsp;&emsp;a) On the answer sheet, circle all of the 2PC log records that **another participant**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;could have already logged.<br>
&emsp;&emsp;&emsp;b) On the answer sheet, circle all of the 2PC log records that **the coordinator** could<br>
&emsp;&emsp;&emsp;&emsp;&emsp;have already logged.

&emsp;4\. **\[3 Points\]** A participant machine can unilaterally (without consulting other machines)<br>
&emsp;&emsp;choose to abort at any time before it takes what action? On the answer sheet, choose<br>
&emsp;&emsp;exactly one of the sentences provided (mark the circle by your choice) and fill in the<br>
&emsp;&emsp;blank in your chosen sentence with the correct word. Hint: Try to answer this question<br>
&emsp;&emsp;without looking at the options on the answer sheet, and then choose the option that fits<br>
&emsp;&emsp;your answer.

&emsp;&emsp;&emsp;&emsp;&emsp;This space is intentionally blank; exam continues on next page.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;9


---

<a id="page-10"></a>
**Page 10**

VI. SQL & LINEAR ALGEBRA \[11 PTS\]

In lecture we learned that matrix algebra can be cast as operation on tables.  Let's take a look<br>
linear algebra in SQL.

We have two d-dimensional sparse vectors (stored in row id, value form):

&emsp;&emsp;`CREATE TABLE` `x` `(``row` `INTEGER,` `value` `REAL)`

&emsp;&emsp;`CREATE TABLE` `y` `(``row` `INTEGER,` `value` `REAL)`

and two sparse matrices (stored in row id, col id, value form)

&emsp;&emsp;`CREATE TABLE` `A` `(``row` `INTEGER,` `col` `INTEGER,` `value` `REAL)`

&emsp;&emsp;`CREATE TABLE` `B` `(``row` `INTEGER,` `col` `INTEGER,` `value` `REAL)`

assume **A** is n by d and **B** is d by m.

&emsp;1\. **\[2 Point\]** On the answer sheet mark the letter corresponding to the SQL query that<br>
&emsp;&emsp;correctly computes the dot product<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Xd<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;x · y =   xiyi<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;i=1

&emsp;&emsp;of **x** and **y**. Assume they have compatible dimensions and **there is only one correct**<br>
&emsp;&emsp;**answer**.

&emsp;&emsp;&emsp;&emsp;a) `SELECT x.row AS row, x.value * y.value AS value`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`FROM x JOIN y`<br>
&emsp;&emsp;&emsp;&emsp;b) `SELECT SUM(x.value * y.value) AS value,`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`FROM x JOIN y ON x.row = y.row`<br>
&emsp;&emsp;&emsp;&emsp;c) `SELECT x.row, y.value, y.value`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`FROM x JOIN y ON x.row = y.row`<br>
&emsp;&emsp;&emsp;&emsp;d) `SELECT x.value * y.value`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`FROM x JOIN y ON x.row = y.row`

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;10


---

<a id="page-11"></a>
**Page 11**

&emsp;2\. **\[2 Points\]** Suppose we wanted to compute the elementwise sum of the vectors **x** and **y**<br>
&emsp;&emsp;using the SQL expression:

&emsp;&emsp;&emsp;&emsp;&emsp;`SELECT x.row AS row, sum(x.value + y.value) AS value`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`FROM x JOIN y`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`ON x.row = y.row`

&emsp;&emsp;Which of the following statements about this query are **true**?  Mark the boxes for all true<br>
&emsp;&emsp;statement(s), or mark ∅ if none are true.

&emsp;&emsp;&emsp;a) Some non-zero entries may be omitted from the final result.<br>
&emsp;&emsp;&emsp;b) The correct query should use LEFT OUTER JOIN<br>
&emsp;&emsp;&emsp;c) The correct query should use FULL OUTER JOIN<br>
&emsp;&emsp;&emsp;d) There is nothing wrong

&emsp;3\. **\[2 Points\]** Which of the following expressions computes the matrix vector product:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Xd<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;(Ax)i =   Aikxk<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;k=1<br>
&emsp;&emsp;of the matrix **A** with the vector **x**?  Assume **A** and **x** have compatible dimensions and<br>
&emsp;&emsp;**there is only one correct answer,**

&emsp;&emsp;&emsp;a) `SELECT A.row AS row, A.value * x.value AS value`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`FROM A JOIN x`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`ON A.row = x.row`<br>
&emsp;&emsp;&emsp;b) `SELECT A.row AS row, SUM(A.value * x.value) AS value`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`FROM A JOIN x`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`ON A.row = x.row`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`GROUP BY A.col`<br>
&emsp;&emsp;&emsp;c) `SELECT A.row AS row, SUM(A.value * x.value) AS value`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`FROM A JOIN x`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`ON A.col = x.row`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`GROUP BY A.row`<br>
&emsp;&emsp;&emsp;d) `SELECT x.row AS row, SUM(A.value * x.value) AS value`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`FROM A JOIN x`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`ON A.col = x.row`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`GROUP BY A.col`

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;11


---

<a id="page-12"></a>
**Page 12**

&emsp;4\. **\[5 Points\]** Fill in the blanks to complete the SQL implementation of matrix multiply<br>
&emsp;&emsp;between matrix **A** and **B** that is compute**:**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Xd<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;(AB)ij =   AikBkj<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;k=1<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`SELECT` `A.row` `AS row,` `B.col` `AS col,`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`(a)`           `AS value`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`FROM A JOIN B`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`ON`     `(b)`     `=`    `(c)`    `_`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`GROUP BY`     `(d)`    `,`    `(e)`   `_`

Using the following options (you may any one option multiple times):

&emsp;&emsp;&emsp;`1)` `A.row`<br>
&emsp;&emsp;&emsp;`2)` `B.row`<br>
&emsp;&emsp;&emsp;`3)` `A.col`<br>
&emsp;&emsp;&emsp;`4)` `B.col`<br>
&emsp;&emsp;&emsp;`5)` `A.value + B.value`<br>
&emsp;&emsp;&emsp;`6)` `A.value * B.value`<br>
&emsp;&emsp;&emsp;`7)` `sum(A.value + B.value)`<br>
&emsp;&emsp;&emsp;`8)` `sum(A.value * B.value)`

&emsp;&emsp;&emsp;&emsp;&emsp;This space is intentionally blank; exam continues on next page.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;12


---

<a id="page-13"></a>
**Page 13**

VII. SPARK \[15 PTS\]

&emsp;1\. **\[6 Points\]** Mark the boxes for all true statement(s), or mark ∅ if none are true..<br>
&emsp;&emsp;&emsp;a) In the following block of code we know that `a == 3 * b`:

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`rdd = sc.parallelize(range(1, 1000))`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`a = rdd.flatMap(lambda x: [0, 1, 2]).count()`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`b = rdd.map(lambda x: [0, 1, 2]).count()`

&emsp;&emsp;&emsp;b) `reduceByKey` and `reduce` both return an RDD.<br>
&emsp;&emsp;&emsp;c) A call to `filter` may result in partitions with no records.<br>
&emsp;&emsp;&emsp;d) The `mapPartitions` method takes a function from tuples to tuples<br>
&emsp;&emsp;&emsp;e) `count()` forces the operations on the rdd to be evaluated.<br>
&emsp;&emsp;&emsp;f) The following program will terminate

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`rdd = sc.parallelize(range(1, 1000))`

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`def loop_forever(x):`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`while true:`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`print “I am thinking”`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`return 42`

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`profound_thought = rdd.map(loop_forever)`

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`print “hello World”`

&emsp;&emsp;&emsp;&emsp;&emsp;This space is intentionally blank; exam continues on next page.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;13


---

<a id="page-14"></a>
**Page 14**

&emsp;2\. **\[5 pts\]** Given `rdd = sc.parallelize([1.0,2.0,3.0,4.0])`, compute the<br>
&emsp;&emsp;variance:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Xn<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;¯x = 1<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;xi<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;n<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;i=1<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Xn<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Var** = 1<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;(xi −¯x)2<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;n<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;i=1<br>
&emsp;&emsp;by completing the following program:

&emsp;&emsp;&emsp;&emsp;&emsp;`xbar = rdd.____``(a)``____ / ____``(b)``____`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`var = rdd.____``(c)``_____.____``(d)``____ / ____``(e)``_____`

For each letter in a blank, choose one of the following code snippets (you may use some<br>
snippets multiple times):

&emsp;&emsp;&emsp;&emsp;&emsp;`1.` `rdd.size()`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`2.` `rdd.count()`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`3.` `map(lambda x: x)`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`4.` `map(lambda x: (x – xbar) * (x – xbar))`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`5.` `mapPartitions(lambda x: (x – xbar) * (x – xbar))`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`6.` `reduce(lambda a, b: a + b)`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`7.` `reduceByKey(lambda a, b: a + b)`

&emsp;3\. **\[4 Point\]** A friend at a big web company sent you the following snippet of Spark code<br>
&emsp;&emsp;from the core of the search engine:

`data = [`<br>
`("http://hello.com", "hello world ohai"),`<br>
`("http://goodbye.com", "hello goodbye another day")`<br>
`]`<br>
`rdd = sc.parallelize(data)`<br>
`rdd = rdd.flatMap(lambda x: [(y, [x[0]]) for y in x[1].split(' ')])`<br>
`rdd.reduceByKey(lambda a, b: a + b).collect()`

&emsp;&emsp;and asked you “What does it return”.  **Choose one.**

&emsp;&emsp;&emsp;a. A page and the count of words in the page, e.g `("http://hello.com", 3)`<br>
&emsp;&emsp;&emsp;b. A page and the words with the frequency in that page, e.g.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`("http://hello.com", [("hello", 1), …])`<br>
&emsp;&emsp;&emsp;c. A word and the frequency of that word across pages, e.g. `("hello", 2)`<br>
&emsp;&emsp;&emsp;d. A word and then the list of pages that contain that word, e.g. `("hello",`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`["http://hello.com", "http://goodbye.com"])`

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;14


---

<a id="page-15"></a>
**Page 15**

VIII. ANALYTICS AND MACHINE LEARNING \[17 POINTS\]

1\) **\[3 Points\] Enterprise Data Infrastructure:** Mark the boxes for all true statement(s), or<br>
&emsp;mark ∅ if none are true..<br>
&emsp;a) A **schema-on-load** design implies that the schema is determined **when querying the**<br>
&emsp;&emsp;**data**.<br>
&emsp;b) Data-lakes typically adopt a **schema-on-read** design to provide **greater flexibility** and<br>
&emsp;&emsp;simplify data collection.<br>
&emsp;c) The **star schema** is a **normalized** representation of data in the data warehouse<br>
&emsp;d) **Rollup** is the process of viewing data at increasingly **finer** granularity.<br>
&emsp;e) In some situations storing the **messy or dirty raw data** can be **better than imposing a**<br>
&emsp;&emsp;**strict schema**.<br>
&emsp;f) A multidimensional **data cube** can in fact have more than 3 dimensions.

2\) **\[3 Points\] General Machine Learning**: Mark the boxes for all true statement(s), or mark ∅<br>
&emsp;if none are true.<br>
&emsp;a) In **supervised** machine learning **labeled data** is used to train a model.<br>
&emsp;b) **Classification models** would be a good candidate when trying to predict **the total**<br>
&emsp;&emsp;**amount of time** a user spends browsing a page.<br>
&emsp;c) The ultimate goal in machine learning is **to find a model** that best fits the **training** data.<br>
&emsp;d) The **k-means** algorithm is guaranteed **to converge** to the **optimal clustering**<br>
&emsp;e) The **bag-of-words** model encodes **text as a vector**.<br>
&emsp;f) A common form of **feature engineering** on **continuous** data is **one-hot-encoding**.

3\) **\[4 Points\] K-Means Assignments:** For the following data choose the center assignments<br>
&emsp;on the answer sheet for each of the points **1, 2, 3,** and **4**


![Figure on page 15](figures/questions-p15-fig06.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;15


---

<a id="page-16"></a>
**Page 16**

4\) **\[3 Points\] K-Means Cluster Centers:** For each of the cluster centers choose the letter on<br>
&emsp;the answer sheet corresponding to the new location of that center after updating the<br>
&emsp;assignments (one step of k-means).  If the center doesn’t move, choose DM (Doesn’t Move).


![Figure on page 16](figures/questions-p16-fig07.png)

5\) **\[2 Points\] The A-Res Algorithm:** Using the following table containing the random numbers<br>
&emsp;**u** and the calculated functions of **u,** mark the boxes of the **2 letters** would be selected using<br>
&emsp;the A-Res algorithm:


![Figure on page 16](figures/questions-p16-fig08.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;16


---

<a id="page-17"></a>
**Page 17**

6\) **\[2 Points\] Regression and Overfitting:** Consider the following plots of training data, and<br>
&emsp;functions fit to that data.


![Figure on page 17](figures/questions-p17-fig09.png)

&emsp;a) Choose the letter corresponding to the plot of **over-fitting**<br>
&emsp;b) Choose the letter corresponding to the plot of **under-fitting**

&emsp;&emsp;This space is intentionally blank; exam continues on next page.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;17


---

<a id="page-18"></a>
**Page 18**

IX. ER MODELING \[14 POINTS\]

&emsp;1\. **\[1 Points\]** True/False: Any ternary relationship is equivalent to some pair of binary<br>
&emsp;&emsp;relationships.<br>
&emsp;2\. **\[3 Points\]** For each of the following three diagrams, mark the circle by the **single** letter<br>
&emsp;&emsp;that corresponds to one of the following classifications of the relationship (read left-to-<br>
&emsp;&emsp;right):<br>
&emsp;&emsp;&emsp;a) Many to Many<br>
&emsp;&emsp;&emsp;b) One to Many<br>
&emsp;&emsp;&emsp;c) Many to One<br>
&emsp;&emsp;&emsp;d) One to One


![Figure on page 18](figures/questions-p18-fig10.png)

&emsp;&emsp;&emsp;a.


![Figure on page 18](figures/questions-p18-fig11.png)

&emsp;&emsp;&emsp;b.


![Figure on page 18](figures/questions-p18-fig12.png)

&emsp;&emsp;&emsp;c.

&emsp;&emsp;This space is intentionally blank; exam continues on next page.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;18


---

<a id="page-19"></a>
**Page 19**

&emsp;3\. **\[2 Points\]** Given the following ER diagram, which SQL CREATE TABLE statements<br>
&emsp;&emsp;below best captures the Student entity set and grade relationship set correctly?  **Choose**<br>
&emsp;&emsp;**exactly one.**  For each choice, you can assume TA is defined as:<br>
&emsp;&emsp;`CREATE TABLE TA(EmpNum integer PRIMARY KEY, Name text);`


![Figure on page 19](figures/questions-p19-fig13.png)

&emsp;&emsp;&emsp;a. `CREATE TABLE Student(SID integer PRIMARY KEY, Age integer,`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`Name text);`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`CREATE TABLE grade(SID integer REFERENCES Student NOT NULL,`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`EmpNum integer REFERENCES TA,`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`PNP char(2),`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`PRIMARY KEY (SID, EmpNum));`<br>
&emsp;&emsp;&emsp;b. `CREATE TABLE Student(SID integer PRIMARY KEY, Age integer,`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`Name text);`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`CREATE TABLE grade(SID integer REFERENCES Student NOT NULL,`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`EmpNum integer REFERENCES TA,`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`PNP char(2));`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`PRIMARY KEY (SID));`<br>
&emsp;&emsp;&emsp;c. `CREATE TABLE StGrade(SID integer,`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`EmpNum integer REFERENCES TA NOT NULL,`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`Age integer, Name text, PNP char(2),`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`PRIMARY KEY (SID, EmpNum));`<br>
&emsp;&emsp;&emsp;d. `CREATE TABLE StGrade(SID integer,`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`EmpNum integer REFERENCES TA NOT NULL,`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`Age integer, Name text, PNP char(2),`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`PRIMARY KEY (SID));`

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;19


---

<a id="page-20"></a>
**Page 20**

&emsp;4\. **\[8 Points\]** Please modify the edges on the ER diagram on the answer sheet to capture<br>
&emsp;&emsp;the following constraints.  If you draw any bold lines, make sure they are clearly different<br>
&emsp;&emsp;from the non-bold lines.<br>
&emsp;&emsp;&emsp;a) Each Donor can donate to multiple PACs but does not need to donate.<br>
&emsp;&emsp;&emsp;b) Each PAC can receive donations from multiple donors and must receive at least<br>
&emsp;&emsp;&emsp;&emsp;&emsp;1 donation.<br>
&emsp;&emsp;&emsp;c) Each Donor can be friends with multiple Politicians but does not need to be<br>
&emsp;&emsp;&emsp;&emsp;&emsp;friends with any.<br>
&emsp;&emsp;&emsp;d) Each Politician can be friends with multiple donors and needs to be friends with<br>
&emsp;&emsp;&emsp;&emsp;&emsp;at least 1 donor.<br>
&emsp;&emsp;&emsp;e) Each Donor can own multiple businesses but does not need to own any.<br>
&emsp;&emsp;&emsp;f) Each corporation must be owned by exactly 1 donor.<br>
&emsp;&emsp;&emsp;g) Each PAC can only run ads for 1 politician, but does not need to run any.<br>
&emsp;&emsp;&emsp;h) Each politician can receive ads from many PACs but does not need to receive<br>
&emsp;&emsp;&emsp;&emsp;&emsp;any.

&emsp;&emsp;&emsp;&emsp;&emsp;This space is intentionally blank; exam continues on next page.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;20


---

<a id="page-21"></a>
**Page 21**

X. FUNCTIONAL DEPENDENCIES AND NORMALIZATION \[15 POINTS\]

&emsp;1\. **\[3 Points\]** Check the boxes for all true statement(s), or check ∅ if none are true.<br>
&emsp;&emsp;&emsp;a) Suppose A is a set of attributes over relation scheme R. Then it must be the case<br>
&emsp;&emsp;&emsp;&emsp;&emsp;that: (A+)+ = A+.<br>
&emsp;&emsp;&emsp;b) Any 2-column relation must be in BCNF.<br>
&emsp;&emsp;&emsp;c) If A, B and C are attributes in table R with a functional dependency AB → C, then<br>
&emsp;&emsp;&emsp;&emsp;&emsp;A → C and B → C.

&emsp;2\. **\[4 Points\]** Consider the relation R(A, B, C, D), with functional dependency set<br>
&emsp;&emsp;`F = {AB`→`C, BC`→`D, CD`→`A, AD`→`B, C`→`BD}`<br>
&emsp;&emsp;Check the boxes for all true statement(s), or check ∅ if none are true.<br>
&emsp;&emsp;&emsp;a) C is a candidate key of R.<br>
&emsp;&emsp;&emsp;b) D is a candidate key of R.<br>
&emsp;&emsp;&emsp;c) AB is a candidate key of R.<br>
&emsp;&emsp;&emsp;d) R is in BCNF.

&emsp;3\. **\[4 Points\]** Suppose you are given a relation R(A,B,C,D), with FDs F = {B → C, D → A}.<br>
&emsp;&emsp;Consider a decomposition of R into BC and AD.  Check the boxes for all true<br>
&emsp;&emsp;statement(s), or check ∅ if none are true.<br>
&emsp;&emsp;&emsp;a) The decomposition is lossy.<br>
&emsp;&emsp;&emsp;b) One of BC and AD is not in BCNF.<br>
&emsp;&emsp;&emsp;c) The decomposition is not dependency preserving.<br>
&emsp;&emsp;&emsp;d) Neither BC nor AD has candidate keys.

&emsp;4\. **\[4 Points\]** Now consider R(A, B, C, D), decomposed into ACD and BC. Check the boxes<br>
&emsp;&emsp;for all true statement(s), or check ∅ if none are true.<br>
&emsp;&emsp;&emsp;a) The decomposition is lossless if C is a candidate key for ACD<br>
&emsp;&emsp;&emsp;b) The decomposition is lossless only if the rows of ACD and BC match up one-to-<br>
&emsp;&emsp;&emsp;&emsp;&emsp;one.<br>
&emsp;&emsp;&emsp;c) If the decomposition is lossy, the natural join of ACD and BC will be missing<br>
&emsp;&emsp;&emsp;&emsp;&emsp;tuples found in R.<br>
&emsp;&emsp;&emsp;d) If the decomposition is lossless, then both ACD and BC could have fewer rows<br>
&emsp;&emsp;&emsp;&emsp;&emsp;than R.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;21

