# Berkeley CS186 Spring 2015: Midterm 2: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/186>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**


![Figure on page 1](figures/questions-p01-fig01.png)

**Midterm 2: CS186, Spring 2015**<br>
**Prof. J. Hellerstein**

You should receive a double-sided answer sheet and an 8-page exam.

Mark your name and login on both sides of the answer sheet, and in the blanks above.

For each question, **place only your final answer on the answer sheet**—do not show work or formulas<br>
there.

You may use the backs of the questions for scratch paper, but do not tear off any pages.

We will ask you to turn in your question sheets as well as your answers.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1


---

<a id="page-2"></a>
**Page 2**

**I. ER Diagrams \[18 points\]**

1\. \[4 points\] **True or False:**<br>
&emsp;a. ER diagrams are used to model the physical schema of a database.<br>
&emsp;b. An entity set E can be associated with a relationship set R more than once.<br>
&emsp;c. At most 2 distinct entity sets can be associated with any relationship set R.<br>
&emsp;d. A weak entity set must have total participation in its identifying relationship set.

Chancellor Dirks wants you to explain how a **relational database management system**, (e.g.<br>
Postgres) works. Dirks is familiar with reading ER diagrams, so we've created the diagram<br>
below, but it is missing a few edges.


![Figure on page 2](figures/questions-p02-fig02.png)

Answer questions 2 to 5 choosing the best option from the following multiple choice options:


![Figure on page 2](figures/questions-p02-fig03.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;A. partial participation, non-key


![Figure on page 2](figures/questions-p02-fig04.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;B. partial participation, key


![Figure on page 2](figures/questions-p02-fig05.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;C. total participation, non-key


![Figure on page 2](figures/questions-p02-fig06.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;D. total participation, key<br>
&emsp;&emsp;&emsp;&emsp;&emsp;E. none of the above

2\. \[2 point\] What is the correct edge between TableRow and Table?<br>
3\. \[2 point\] What is the correct edge between TableColumn and Table?<br>
4\. \[2 point\] What is the correct edge between Column and PrimaryKey?<br>
5\. \[2 point\] What is the correct edge between Table and PrimaryKey?

**ER to SQL**<br>
6\. \[6 points\] On your answer sheet, fill in the blanks to convert the **Row entity set**, and the<br>
**TableColumn relationship set** in the ER diagram above into SQL tables. You may not need all

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2


---

<a id="page-3"></a>
**Page 3**


![Page 3 (scanned)](figures/questions-p03-page.png)


---

<a id="page-4"></a>
**Page 4**

**II. FDs & Normalization \[16 points\]**

&emsp;1\. \[4 points\] Consider the attribute set R = ABCDEF and the functional dependency set<br>
&emsp;&emsp;F = {AD → B, A → E, C → E, DEF → A, F → D}. Find a candidate key of R.

&emsp;2\. \[6 points\] Given the attribute set R = ABCDEFGH and the functional dependency set<br>
&emsp;&emsp;F = {BC → GH, AD → E, A → H, E → BCF, G → H}, decompose R into BCNF by<br>
&emsp;&emsp;decomposing in the order of the given functional dependencies.

&emsp;3\. \[6 points\] Given the attribute set R = ABCDEF and the functional dependency set<br>
&emsp;&emsp;F = {B → D, E → F, D → E, D → B, F → BD}.<br>
&emsp;&emsp;&emsp;a. Is the decomposition ABDE, BCDF lossless?<br>
&emsp;&emsp;&emsp;b. If not, what functional dependency could you add to make it lossless?

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4


---

<a id="page-5"></a>
**Page 5**

**III. Transactions/CC \[17 points\]**


![Figure on page 5](figures/questions-p05-fig08.png)

&emsp;1\. \[4 points\] Consider the preceding schedule for three transactions. R indicates a read of a<br>
&emsp;&emsp;page, W indicates a write of a page, and COM indicates a commit.<br>
&emsp;&emsp;&emsp;a. Draw the arrows for the dependency graph for this schedule.<br>
&emsp;&emsp;&emsp;b. Is the schedule conflict serializable?

&emsp;2\. \[5 points\] Which of the following changes to the above schedule will result in a schedule<br>
&emsp;&emsp;that is possible using strict two-phase locking? (**Mark all that apply**)<br>
&emsp;&emsp;&emsp;A. Make T1 abort instead of commit<br>
&emsp;&emsp;&emsp;B. Make T2 abort instead of commit<br>
&emsp;&emsp;&emsp;C. Remove R(A) from T1 and T3<br>
&emsp;&emsp;&emsp;D. Remove T2 from the schedule<br>
&emsp;&emsp;&emsp;E. Make T3 write to a page D instead of page B


![Figure on page 5](figures/questions-p05-fig09.png)

&emsp;3\. \[3 points\] Consider the preceding schedule. A, B, and C are positive integers. Each<br>
&emsp;&emsp;transaction reads in two integers, adds them, and writes the result. Which of the<br>
&emsp;&emsp;following statements is/are true? (**Mark all that apply**)<br>
&emsp;&emsp;&emsp;A. The schedule avoids cascading aborts<br>
&emsp;&emsp;&emsp;B. The schedule is conflict serializable<br>
&emsp;&emsp;&emsp;C. The schedule is equivalent to some serial schedule


![Figure on page 5](figures/questions-p05-fig10.png)

&emsp;4\. \[5 points\] Assume that we are using strict two-phase locking, and the objects being<br>
&emsp;&emsp;locked are pages. RS indicates a request for a shared lock on a page, and RX indicates<br>
&emsp;&emsp;a request for an exclusive lock on a page. No transactions commit or abort during this<br>
&emsp;&emsp;time.<br>
&emsp;&emsp;&emsp;a. Draw the arrows for the waits-for graph at the end of this schedule.<br>
&emsp;&emsp;&emsp;b. Does the schedule lead to deadlock?

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;5


---

<a id="page-6"></a>
**Page 6**

**IV. Text Search \[14 points\]**

We have a search engine with a corpus containing **only** the documents<br>
Document ID 1: “A time to plant and a time to reap”<br>
Document ID 2: “Time for you and time for me”<br>
Document ID 3: “Time flies”

1a. \[2 points\] Given that the stemmed version of the word “flies” is the term “fly”, what is the TF-<br>
IDF of “fly” in document 3?

1b. \[2 points\] What is the TF-IDF of “time” in document 1?

2\. \[4 points\] We want to perform cosine similarity ranking on these documents, so we represent<br>
each document with a vector containing the TF-IDFs of different terms in our documents. Which<br>
of the following lists of terms would allow us to correctly compute cosine similarity? Assume that<br>
standard stop words include “a”, "and", "to", and "for". (**Mark all that apply**)<br>
&emsp;A. (“plant”, “you”, “fly”, “me”, “reap”, “time”)<br>
&emsp;B. (“time”, “plant”, “reap”, “you”, me”, “fly”)<br>
&emsp;C. (“time”, “plant”, “you”, “me”, “fly”)<br>
&emsp;D. (“plant”, “reap”, “you”, “me”, “fly”)

3\. \[4 points\] Suppose we issue our engine the query “plant OR fly”. In the spaces provided, write<br>
**only** the document IDs which are returned by this query, in order of relevance **as determined**<br>
**by cosine similarity**. (You may want to leave some spaces **blank**.) Break ties with smaller<br>
document IDs first, and then larger document IDs.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;6


---

<a id="page-7"></a>
**Page 7**

4a. \[2 point\] For this question, assume that we have a text index with the following schema:

`Files(docID text, content text)`<br>
`InvertedFile(word text, docID text)`<br>
`B+-tree Alternative 2 on Files`<br>
`B+-tree w/”postings list” at leaves on InvertedFile.word`


![Figure on page 7](figures/questions-p07-fig11.png)


![Figure on page 7](figures/questions-p07-fig12.png)

4b. \[2 points\] One of the following join algorithms would be ideal for evaluating the logical<br>
operator at the top of our query plan ⋈InvertedFile.docID=Files.docID.  Which one should we choose? (You<br>
can ignore issues of parallelism when answering this question, though they don’t really affect<br>
the answer.)

&emsp;A. Block Nested Loops join<br>
&emsp;B. Index Nested Loops join<br>
&emsp;C. Hash join<br>
&emsp;D. Sort Merge join

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;7


---

<a id="page-8"></a>
**Page 8**

**V. Query Optimization \[17 points\]**<br>
Suppose the “System R” assumptions about uniformity and independence from lecture hold.<br>
Assume that costs are estimated as a number of I/Os, without differentiating random and<br>
sequential I/O cost.

Consider the following relational schema and statistics:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`Students   (sid, name, age, gpa, year)`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`Courses    (cid, name, professor)`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`Enrollment (sid, cid, credits)`


![Figure on page 8](figures/questions-p08-fig13.png)

1\. Suppose we run the following query.  (`<>` is the SQL syntax for “not equals”).

`SELECT *`<br>
`FROM Courses`<br>
`WHERE name <> "CS 186"`<br>
`AND professor = "Hellerstein";`

a. \[2 points\] What is the selectivity of each conjunct in the WHERE clause?

b. \[2 points\] Which single table access plan would we choose?

A) Sequential/File Scan on Courses<br>
B) Sequential/File Scan on Enrollment<br>
C) Index scan of unclustered B+Tree on Courses.professor<br>
D) Index scan of clustered B+Tree on Enrollment.cid

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;8


---

<a id="page-9"></a>
**Page 9**

2\. \[6 points\] Suppose we run the following query. On the line labeled “considered”, mark the<br>
letters of all 2-table subplans that will be considered. On the line labeled “chosen”, mark the<br>
letters of all 2-table subplans that are chosen. Ignore interesting orders.

`SELECT *`<br>
`FROM Students S, Courses C, Enrollment E`<br>
`WHERE S.age > 40`<br>
`AND C.name LIKE "CS%"`<br>
`AND S.sid = E.sid`<br>
`AND E.cid = C.cid;`

A) S ⨝ C (200,000 IOs)    D) E ⨝ S (500,000,000 IOs)<br>
B) C ⨝ S (300,000 IOs)    E) C ⨝ E (300,000 IOs)<br>
C) S ⨝ E (400,000,000 IOs)    F) E ⨝ C (400,000 IOs)

3\. \[3 points\] Now, mark the letters for all three-table access plans that would be considered, and<br>
write down the letter of the final query plan that would be chosen.  (Cost given are cumulative<br>
for the full query.  Again, ignore interesting orders in formulating your answer.)

A) E ⨝ (S ⨝ C) (3,900,000,000 IOs)    G) (S ⨝ E) ⨝ C (7,500,000,000 IOs)<br>
B) E ⨝ (C ⨝ S) (6,000,000,000 IOs)    H) (E ⨝ S) ⨝ C (8,000,000,000 IOs)<br>
C) (C ⨝ S) ⨝ E (5,000,000,000 IOs)    I) S ⨝ (C ⨝ E) (3,500,000,000 IOs)<br>
D) (S ⨝ C) ⨝ E (8,000,000,000 IOs)    J) S ⨝ (E ⨝ C) (6,000,000,000 IOs)<br>
E) C ⨝ (S ⨝ E) (7,000,000,000 IOs)    K) (C ⨝ E) ⨝ S (4,000,000,000 IOs)<br>
F) C ⨝ (E ⨝ S) (9,000,000,000 IOs)    L) (E ⨝ C) ⨝ S (10,000,000,000 IOs)

4\. \[4 points\]  **True or False:**<br>
&emsp;a. If we had considered interesting orders in the query of Question 3, it would have further<br>
&emsp;&emsp;pruned the number of plans chosen.<br>
&emsp;b. In Question 3, it would be beneficial to consider interesting orders on C.name during<br>
&emsp;&emsp;optimization.<br>
&emsp;c. In Question 3,  it would be beneficial to consider interesting orders on C.cid during<br>
&emsp;&emsp;optimization.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;9


---

<a id="page-10"></a>
**Page 10**

d. A modern optimizer should consider “interesting hashes”, since the output of a hash-<br>
&emsp;based operator (e.g. hash join) is organized in a way that would decrease the cost of<br>
&emsp;performing a subsequent hash-based operator (e.g. group-by).

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;10


---

<a id="page-11"></a>
**Page 11**

Name:\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_    Class Login – person on your left:\_\_\_\_\_\_\_\_\_\_\_\_<br>
Class Login (e.g. cs186-aa): \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_    Class Login – person on your right:\_\_\_\_\_\_\_\_\_\_\_

I. ER Diagrams    II. FDs<br>
1a. True / False    1. \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_<br>
1b. True / False    2. \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_<br>
1c. True / False    3a. Yes  / No<br>
1d. True / False    3b. \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

2\. A / B / C / D / E<br>
3\. A / B / C / D / E<br>
4\. A / B / C / D / E<br>
5\. A / B / C / D / E    III. Transactions/CC<br>
&emsp;1a.


![Figure on page 11](figures/questions-p11-fig14.png)

6\. `CREATE TABLE Row (`<br>
`_____________________________`<br>
`_____________________________`<br>
`PRIMARY KEY (________________)`<br>
`);`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1b.  Yes    /    No<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2\. A / B / C / D / E<br>
&emsp;`CREATE TABLE TableColumn (`<br>
&emsp;`_______________________ STRING,` 3. A / B / C<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4a.<br>
`______________________________,`


![Figure on page 11](figures/questions-p11-fig15.png)

`col_position INTEGER,`

`FOREIGN KEY (_________________)`<br>
`REFERENCES Table`<br>
`FOREIGN KEY (_________________)`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4b. Yes    /    No<br>
`REFERENCES _______________`

`PRIMARY KEY (_________________)`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;.<br>
`);`


---

<a id="page-12"></a>
**Page 12**

IV. Text Search    V. Query Optimization<br>
1a. \_\_\_\_\_\_\_\_ log (\_\_\_\_\_\_\_\_\_\_\_)    1a. name: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_<br>
1b. \_\_\_\_\_\_\_\_ log (\_\_\_\_\_\_\_\_\_\_\_)    professor: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_<br>
2\. A / B / C / D    1b. A / B / C / D<br>
3\. \_\_\_\_\_\_\_, \_\_\_\_\_\_\_, \_\_\_\_\_\_\_,<br>
4a, i. \_\_\_\_\_\_\_\_\_\_\_    2.<br>
4a, ii. \_\_\_\_\_\_\_\_\_\_\_    Considered:<br>
4b. A / B / C / D    A / B / C / D / E / F

Chosen:<br>
A / B / C / D / E / F

3.<br>
Considered:<br>
A / B / C / D / E / F /<br>
G / H / I / J / K / L

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Final Plan:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4a. True / False<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4b. True / False<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4c. True / False<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4d. True / False

