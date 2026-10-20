# Berkeley CS186 Spring 2014: Final: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/186>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**University of California, Berkeley**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;CS 186 Introduction to Databases, Spring 2014, Prof. Dan Olteanu<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**FINAL EXAM**

• This is a closed book examination   but you are allowed one 8.5” x 11” sheet of notes (double<br>
sided).<br>
• No cell phones/calculators/electronic devices of any sort are allowed.<br>
• Please display your student ID card.<br>
• You should answer as many questions as possible. You should read all of the questions before<br>
starting the exam, as some of the questions are substantially more time-consuming than others.<br>
• There are 100 points in total distributed over six questions.<br>
• Write all of your answers in the designated space provided with each question. We will be grading<br>
only answers written in the designated space.<br>
• You must put your CS 186 class account at the top of each page before you start the exam.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**GOOD LUCK!**


---

<a id="page-2"></a>
**Page 2**

CS186 class account:


### **Question 1.**\[Potpourri\]   Minimum points: 0. Maximum points: 20.

&emsp;**For each of the following statements below, each correct tick is worth 1 point,**<br>
&emsp;**each wrong tick is worth -1 point, and no tick is worth 0 points.**

&emsp;Tick the correct TRUE/FALSE boxes for each of the following statements.   **TRUE**   **FALSE**

&emsp;1\. An IX lock is compatible with an S lock.

&emsp;2\. Shared and Exclusive locks are features found in a<br>
&emsp;&emsp;Pessimistic Concurrency Control scheme.

&emsp;3\. Strict 2-Phase Locking avoids deadlocks but not cascading aborts.

&emsp;4\. Page-oriented and block nested-loops joins have a lower IO cost in<br>
&emsp;&emsp;case the larger relation is the inner relation.

&emsp;5\. Data entries in R-Trees are themselves regions.

&emsp;6\. Given B buffer page frames, External Merge Sort can sort a file of size<br>
&emsp;&emsp;B(B −1)5 in 6 passes.

&emsp;7\. It is always more IO efficient to push a selection operator through<br>
&emsp;&emsp;a join and perform the selection first on one of the join relations.

&emsp;8\. For a given query and cardinality estimates, the space of query plans<br>
&emsp;&emsp;inspected by the greedy approach is a strict subset of the space of query<br>
&emsp;&emsp;plans inspected by the dynamic programming approach (both approaches<br>
&emsp;&emsp;were introduced in class).

&emsp;9\. Suppose a transaction T1 writes a page A, then A is flushed to disk and<br>
&emsp;&emsp;T1 aborts without undoing its updates. This is a violation of the<br>
&emsp;&emsp;Consistency desideratum.

&emsp;10\. If a schedule is serializable, then it is also conflict serializable.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2


---

<a id="page-3"></a>
**Page 3**

CS186 class account:

&emsp;11\. Upon recovering in a FORCE/STEAL system, uncommitted transactions at<br>
&emsp;&emsp;the time of the crash may need to be undone.

&emsp;12\. Upon recovering in a NO FORCE/NO STEAL system, uncommitted<br>
&emsp;&emsp;transactions at the time of the crash may need to be undone.

&emsp;13\. BCNF decompositions are always lossless-join and dependency-preserving,<br>
&emsp;&emsp;while 3NF decompositions are not necessarily dependency-preserving.

&emsp;14\. There are cases where aggregations can be performed by index-only plans.

&emsp;15\. If we do not know the query workload and plenty of disk space is available,<br>
&emsp;&emsp;then it is always a good idea to create more indexes.

&emsp;16\. A clustered B+-tree index is preferable over a hash index if the query<br>
&emsp;&emsp;workload frequently contains range selections.

&emsp;17\. Conflict serializability is always guaranteed if the conflict graph is acyclic.

&emsp;18\. A correct implementation of concurrent transaction support has to rely on a<br>
&emsp;&emsp;form of locking such as read and write locks.

&emsp;19\. A join algorithm X is worst-case optimal if there is no join algorithm Y<br>
&emsp;&emsp;that performs asymptotically better than X for any given class of instances.

&emsp;20\. The Leapfrog Triejoin algorithm is an improvement of the multi-way<br>
&emsp;&emsp;standard sort-merge algorithm where the relation iterators may jump over<br>
&emsp;&emsp;(or leapfrog) several records at once.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3


---

<a id="page-4"></a>
**Page 4**

CS186 class account:


### **Question 2.**\[Query Languages\]   Maximum points: 10.

&emsp;Consider the relational schemas Student(S), Course(C), Enrolls(S, C).

&emsp;1\. Write down an SQL query that returns, for each student present in the database, the student id<br>
&emsp;&emsp;S and the number of courses s/he is enrolled in. (Hint: this may mean that for some values of S<br>
&emsp;&emsp;the count is 0!)   (5 points)

&emsp;2\. Write down an SQL query that returns all pairs of students (S1, S2) such that S1 has taken (at<br>
&emsp;&emsp;least) all the courses that S2 has taken.   (5 points)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4


---

<a id="page-5"></a>
**Page 5**

CS186 class account:


### **Question 3.**\[Query Evaluation\]   Maximum points: 14.

&emsp;Consider the following three relations:

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;X(A, B, C)   Y(A, D)   Z(B, D)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;(1, 2, 4)   (1, 5)   (1, 1)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;(1, 2, 6)   (1, 7)   (1, 3)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;(1, 2, 7)   (2, 1)   (1, 7)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;(1, 3, 9)   (2, 3)   (2, 2)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;(1, 5, 8)   (2, 5)   (2, 3)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;(3, 1, 3)   (3, 1)   (2, 7)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;(3, 1, 7)   (3, 3)   (2, 8)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;(3, 8)   (3, 1)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;(3, 9)   (3, 7)

&emsp;1\. We want to evaluate the three-way natural join on these relations using the Leapfrog Triejoin<br>
&emsp;&emsp;algorithm with the join order (A,B,D,C). Draw the trie view of each relation. Write down the first<br>
&emsp;&emsp;four tuples in the result in the order they are produced. Indicate on your diagram the position of<br>
&emsp;&emsp;each trie-iterator when each of the first four tuples is emitted.   (8 points)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;5


---

<a id="page-6"></a>
**Page 6**


![Page 6 (scanned)](figures/questions-p06-page.png)


---

<a id="page-7"></a>
**Page 7**

CS186 class account:

&emsp;2\. Briefly describe an optimization that can be made to the basic block nested-loops join algorithm.<br>
&emsp;&emsp;Make sure to include when the optimization is useful and describe why the optimized algorithm<br>
&emsp;&emsp;can be more efficient.   (6 points)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;7


---

<a id="page-8"></a>
**Page 8**

CS186 class account:


### **Question 4.**\[Query Optimization\]   Maximum points: 20.

&emsp;Consider the three relations R(A,B), S(B,C) and T(C,D), where all attributes are integer attributes<br>
and each such integer attribute takes 5 bytes. Thus, each of the input tuples takes 10 bytes, but note<br>
that projections and joins produce tuples of different arity and thus different size. You have to take this<br>
into account. The page size is 1000 bytes and we assume for simplicity that all of this space can be used<br>
to store tuples (the page header does not take space). Assume 22 buffer pages.

&emsp;• Relation R has 100,000 tuples. Attribute B is the key of R. The domain of attribute A is integer<br>
&emsp;&emsp;values in the interval \[1, 1000\]. The domain values of attribute A are uniformly distributed among<br>
&emsp;&emsp;the tuples in R (i.e., each value is equally likely).<br>
&emsp;• Relation T has 100,000 tuples. Attribute C is the key of T. The domain of attribute D is integer<br>
&emsp;&emsp;values in the interval \[1, 1000\]. The values of attribute D are distributed among the tuples in T<br>
&emsp;&emsp;according to the following histogram (given in textual form):<br>
&emsp;&emsp;Value of T.D in interval \[1 .. 500\] : 20000 tuples.<br>
&emsp;&emsp;Value of T.D in interval \[501 .. 1000\] : 80000 tuples.<br>
&emsp;• Relation S consists of 1,000,000 tuples. Column B is the key of R referenced by foreign key B of<br>
&emsp;&emsp;S and column C is the key of T referenced by foreign key C of S.<br>
&emsp;• There are no index structures.

&emsp;Consider the following query:

&emsp;`SELECT` `*`<br>
&emsp;`FROM` `R,` `S,` `T`<br>
&emsp;`WHERE` `R.B` `=` `S.B` `and` `S.C` `=` `T.C` `AND` `R.A` `<=` `10` `AND` `T.D` `>` `100`<br>
&emsp;1\. Assume that you are using the System R style dynamic programming query optimization algorithm.<br>
&emsp;&emsp;Show in detail the plans that the System R query optimization algorithm produces after the first<br>
&emsp;&emsp;pass (i.e., “best” one relation plans). Explain why these plans are chosen over other plans. Clearly<br>
&emsp;&emsp;state any assumptions you make.   (3 points)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;8


---

<a id="page-9"></a>
**Page 9**

CS186 class account:

&emsp;2\. Choose the optimal query plan that the System R algorithm can find (with respect to I/O cost)<br>
&emsp;&emsp;assuming that the only join operator implemented in the system is block nested-loops join and no<br>
&emsp;&emsp;index structures are to be used. Assume that the query result does not have to be written to disk<br>
&emsp;&emsp;but is displayed on screen (which has no cost per se).<br>
&emsp;&emsp;Write down the optimal query plan as an operator tree where the outer loop input of each join<br>
&emsp;&emsp;is on the left side. Compute, for each node of the query plan, the size of its output in number<br>
&emsp;&emsp;of tuples and number of pages, plus the cost incurred at that node. In addition, state the overall<br>
&emsp;&emsp;cost. Write down all the formulas you use.   (12 points)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;9


---

<a id="page-10"></a>
**Page 10**

CS186 class account:

&emsp;3\. Now assume you are allowed to use any join operator implementation (block nested-loops join,<br>
&emsp;&emsp;sort-merge join, hash join; no index nested-loops join because you must not use indexes). Is there<br>
&emsp;&emsp;a better query plan that can be obtained by replacing the block nested-loops joins in the previous<br>
&emsp;&emsp;plan but leaving all else (in particular, the join order) equal? If yes, draw a better (not necessarily<br>
&emsp;&emsp;optimal) plan and calculate its cost. If no, argue why not.   (5 points)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;10


---

<a id="page-11"></a>
**Page 11**

CS186 class account:


### **Question 5.**\[Concurrency control and serializability\]   Maximum points: 16.

&emsp;Consider the following transaction schedule, where time increases from left to right:<br>
&emsp;T1:   R(A)   W(B)   Commit<br>
&emsp;T2:   R(B)   R(A)   Commit<br>
&emsp;T3:   R(B)   W(A)   Commit<br>
&emsp;1\. Draw the conflict graph for the above schedule. Is the schedule conflict serializable?   (4 points)

&emsp;2\. Explain when a schedule can be view serializable but not conflict serializable. Give a small example<br>
&emsp;&emsp;schedule that has this property.   (4 points)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;11


---

<a id="page-12"></a>
**Page 12**

CS186 class account:

&emsp;3\. Explain in no more than three sentences the main idea of optimistic concurrency control. (4 points)

&emsp;4\. Explain the ACID desiderata for transaction processing.   (4 points)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;12


---

<a id="page-13"></a>
**Page 13**

CS186 class account:


### **Question 6.**\[Database Design\]   Maximum points: 20.

&emsp;Consider the relation schema R(A, B, C, D, E, F, G) with functional dependencies<br>
&emsp;F = {AB →CF, CD →EA, E →ABC, B →F, C →D}.<br>
&emsp;1\. Compute a minimum cover of F.   (6 points)

&emsp;2\. Give all the candidate keys of R as inferred from F.   (6 points)

&emsp;3\. Is R in BCNF? Is R in 3NF? Explain your answer.   (4 points)

&emsp;4\. Consider the decomposition of R into R1(A, B, C, D, E, G) and R2(B, F). Is this decomposition<br>
&emsp;&emsp;(a) dependency-preserving, (b) lossless-join, (c) in 3NF, (d) in BCNF?   (4 points)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**End of Exam Paper.**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;13


---

<a id="page-14"></a>
**Page 14**

CS186 class account:

&emsp;**Extra Page for Scratch Work (to be discarded and not graded)**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;14


---

<a id="page-15"></a>
**Page 15**

CS186 class account:

&emsp;**Extra Page for Scratch Work (to be discarded and not graded)**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;15


---

<a id="page-16"></a>
**Page 16**

CS186 class account:

&emsp;**Extra Page for Scratch Work (to be discarded and not graded)**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;16

