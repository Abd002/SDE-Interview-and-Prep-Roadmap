# Berkeley CS186 Spring 2015: Midterm 2: Official solutions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/186>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**


![Figure on page 1](figures/solutions-p01-fig01.png)

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
&emsp;&emsp;False, they are used to model the logical schema. Physical schema refers to things like<br>
&emsp;&emsp;file and index layout.<br>
&emsp;b. An entity set E can be associated with a relationship set R more than once.<br>
True, for example a relationship Reports\_To which has the entity Employees<br>
participating twice, since Managers are also Employees.<br>
&emsp;c. At most 2 distinct entity sets can be associated with any relationship set R.<br>
&emsp;&emsp;False, for example, a ternary relationship “Covers” with participating entities Employees,<br>
&emsp;&emsp;Dependents, and Policies.<br>
&emsp;d. A weak entity set must have total participation in its identifying relationship set.<br>
&emsp;&emsp;True, by definition.

Chancellor Dirks wants you to explain how a **relational database management system**, (e.g.<br>
Postgres) works. Dirks is familiar with reading ER diagrams, so we've created the diagram<br>
below, but it is missing a few edges.


![Figure on page 2](figures/solutions-p02-fig02.png)

Answer questions 2 to 5 choosing the best option from the following multiple choice options:


![Figure on page 2](figures/solutions-p02-fig03.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;A. partial participation, non-key


![Figure on page 2](figures/solutions-p02-fig04.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;B. partial participation, key


![Figure on page 2](figures/solutions-p02-fig05.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;C. total participation, non-key


![Figure on page 2](figures/solutions-p02-fig06.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;D. total participation, key<br>
&emsp;&emsp;&emsp;&emsp;&emsp;E. none of the above

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2


---

<a id="page-3"></a>
**Page 3**

2\. \[2 point\] What is the correct edge between TableRow and Table?<br>
A - a table has 0 or more rows<br>
3\. \[2 point\] What is the correct edge between TableColumn and Table?<br>
C - a table has 1 or more columns<br>
4\. \[2 point\] What is the correct edge between Column and PrimaryKey?<br>
B - Each column participates in at most one primary key. There is at most one primary key,<br>
there may be none, and even if there is one not every column will be in it.<br>
5\. \[2 point\] What is the correct edge between Table and PrimaryKey?<br>
A - A table may have a primary key with 0 columns (meaning it doesn’t have a primary key), 1<br>
column, or many columns,  so the table can participate in the PrimaryKey relationship 0 or more<br>
times.

**ER to SQL**<br>
6\. \[6 points\] On your answer sheet, fill in the blanks to convert the **Row entity set**, and the<br>
**TableColumn relationship set** in the ER diagram above into SQL tables. You may not need all<br>
the blanks.

CREATE TABLE Row (<br>
rid INTEGER<br>
PRIMARY KEY (rid)<br>
);

CREATE TABLE TableColumn (<br>
tname STRING,<br>
cname STRING,<br>
col\_position INTEGER,

FOREIGN KEY (tname)<br>
REFERENCES Table<br>
FOREIGN KEY (cname)<br>
REFERENCES Column<br>
PRIMARY KEY (tname, cname)<br>
);

Our intended answer for the PRIMARY KEY of Table Column was (tname, cname) since we<br>
usually expect a column to be identified by the table it belongs to, e.g. Students.id.

However, since cname was shown to be a key for the Column entity, meaning that all column<br>
names are unique in this model, we also accepted cname and (cname, col\_position) as<br>
answers for the PRIMARY KEYs.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3


---

<a id="page-4"></a>
**Page 4**

To make our ER diagram more accurate for Chancellor Dirks to understand, a better choice<br>
would be to make Column a weak-entity of Table. It's a good exercise to think about what this<br>
would look like in the diagram and in SQL.

**II. FDs & Normalization \[16 points\]**

&emsp;1\. \[4 points\] Consider the attribute set R = ABCDEF and the functional dependency set<br>
&emsp;&emsp;F = {AD → B, A → E, C → E, DEF → A, F → D}. Find a candidate key of R.<br>
&emsp;&emsp;**FC**<br>
Notice that FC is not on the right-hand side of any of the given FDs. This means that<br>
any key of R must contain FC. Find the closure of FC to see that FC -\> R. Thus, FC is<br>
a candidate key. Any other key would be superkey, since a key must contain FC.

&emsp;2\. \[6 points\] Given the attribute set R = ABCDEFGH and the functional dependency set<br>
&emsp;&emsp;F = {BC → GH, AD → E, A → H, E → BCF, G → H}, decompose R into BCNF by<br>
&emsp;&emsp;decomposing in the order of the given functional dependencies.<br>
**ADE, BCEF, GH, BCG**<br>
BC -\> GH violates BCNF, decompose.<br>
Relations: ABCDEF BCGH<br>
AD -\> E does not violate BCNF because AD is a superkey, skip.<br>
A -\> H No relation contains AH, skip.<br>
E -\> BCF violates BCNF, decompose.<br>
Relations: ADE EBCF BCGH<br>
G -\> H violates BCNF, decompose.<br>
ADE EBCF BCG GH

&emsp;3\. \[6 points\] Given the attribute set R = ABCDEF and the functional dependency set<br>
&emsp;&emsp;F = {B → D, E → F, D → E, D → B, F → BD}.<br>
&emsp;&emsp;&emsp;a. Is the decomposition ABDE, BCDF lossless?<br>
&emsp;&emsp;&emsp;b. If not, what functional dependency could you add to make it lossless?<br>
a. **No**, it is lossy


![Figure on page 4](figures/solutions-p04-fig07.png)

For example some valid answers were: B -\> C, B -\> A, BEFD -\> AC, etc.


![Figure on page 4](figures/solutions-p04-fig08.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4


---

<a id="page-5"></a>
**Page 5**

**III. Transactions/CC \[17 points\]**


![Figure on page 5](figures/solutions-p05-fig09.png)

&emsp;1\. \[4 points\] Consider the preceding schedule for three transactions. R indicates a read of a<br>
&emsp;&emsp;page, W indicates a write of a page, and COM indicates a commit.<br>
&emsp;&emsp;&emsp;a. Draw the arrows for the dependency graph for this schedule.<br>
&emsp;&emsp;&emsp;b. Is the schedule conflict serializable?<br>
&emsp;&emsp;a. The dependency graph is shown below.


![Figure on page 5](figures/solutions-p05-fig10.png)

&emsp;&emsp;b. Yes, it is conflict serializable, because the dependency graph has no directed cycles.

&emsp;2\. \[5 points\] Which of the following changes to the above schedule will result in a schedule<br>
&emsp;&emsp;that is possible using strict two-phase locking? (**Mark all that apply**)<br>
&emsp;&emsp;&emsp;A. Make T1 abort instead of commit<br>
&emsp;&emsp;&emsp;B. Make T2 abort instead of commit<br>
&emsp;&emsp;&emsp;C. Remove R(A) from T1 and T3<br>
&emsp;&emsp;&emsp;D. Remove T2 from the schedule<br>
&emsp;&emsp;&emsp;E. Make T3 write to a page D instead of page B<br>
&emsp;&emsp;**C,D**<br>
&emsp;&emsp;A and B are incorrect because strict 2PL deals with acquisition of locks before a<br>
&emsp;&emsp;transaction commits or aborts. C is correct because if T1 and T3 do not acquire a shared<br>
&emsp;&emsp;lock to read page A, then T2 can acquire an exclusive lock to write page A before T1<br>
&emsp;&emsp;and T3 commit. Similarly, D is correct because if we remove T2 from the schedule, then<br>
&emsp;&emsp;no transaction needs an exclusive lock on page A. E is incorrect because T2 and T3 can<br>
&emsp;&emsp;already acquire an exclusive lock to write page B, and even if T3 writes to page D<br>
&emsp;&emsp;instead of page B, strict 2PL still prevents T2 from completing.


![Figure on page 5](figures/solutions-p05-fig11.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;5


---

<a id="page-6"></a>
**Page 6**

&emsp;3\. \[3 points\] Consider the preceding schedule. A, B, and C are positive integers. Each<br>
&emsp;&emsp;transaction reads in two integers, adds them, and writes the result. Which of the<br>
&emsp;&emsp;following statements is/are true? (**Mark all that apply**)<br>
&emsp;&emsp;&emsp;A. The schedule avoids cascading aborts<br>
&emsp;&emsp;&emsp;B. The schedule is conflict serializable<br>
&emsp;&emsp;&emsp;C. The schedule is equivalent to some serial schedule<br>
&emsp;&emsp;**A**<br>
&emsp;&emsp;A is correct because after each page is written, no transaction reads that page, so if any<br>
&emsp;&emsp;transaction aborts, then no other transactions need to abort. B is incorrect because in<br>
&emsp;&emsp;the dependency graph, there is an edge from T1 to T2 (A), and an edge from T2 to T1<br>
&emsp;&emsp;(B), so the graph has a directed cycle. C is incorrect because there is no way to<br>
&emsp;&emsp;interleave the reads and writes of the transactions and have the same outputs in<br>
&emsp;&emsp;integers A, B, and C.


![Figure on page 6](figures/solutions-p06-fig12.png)

&emsp;4\. \[5 points\] Assume that we are using strict two-phase locking, and the objects being<br>
&emsp;&emsp;locked are pages. RS indicates a request for a shared lock on a page, and RX indicates<br>
&emsp;&emsp;a request for an exclusive lock on a page. No transactions commit or abort during this<br>
&emsp;&emsp;time.<br>
&emsp;&emsp;&emsp;a. Draw the arrows for the waits-for graph at the end of this schedule.<br>
&emsp;&emsp;&emsp;b. Does the schedule lead to deadlock?<br>
&emsp;&emsp;a. The waits-for graph is shown below.


![Figure on page 6](figures/solutions-p06-fig13.png)

&emsp;&emsp;b. Yes, it leads to deadlock, because there is a cycle in the waits-for graph.

**IV. Text Search \[14 points\]**

We have a search engine with a corpus containing **only** the documents<br>
Document ID 1: “A time to plant and a time to reap”<br>
Document ID 2: “Time for you and time for me”<br>
Document ID 3: “Time flies”

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;6


---

<a id="page-7"></a>
**Page 7**

1a. \[2 points\] Given that the stemmed version of the word “flies” is the term “fly”, what is the TF-<br>
IDF of “fly” in document 3?

**1 log (3)**<br>
“fly” appears once (stemmed from “flies”) in document 3, so its TF is 1. It appears only in<br>
document 3, so its IDF is log (3/1) = log (3).

1b. \[2 points\] What is the TF-IDF of “time” in document 1?

**2 log (1)**<br>
“time” appears twice in document 1, so its TF is 2. It appears in three documents, so its IDF is<br>
log (3/3) = log (1).

2\. \[4 points\] We want to perform cosine similarity ranking on these documents, so we represent<br>
each document with a vector containing the TF-IDFs of different terms in our documents. Which<br>
of the following lists of terms would allow us to correctly compute cosine similarity? Assume that<br>
standard stop words include “a”, "and", "to", and "for". (**Mark all that apply**)<br>
&emsp;A. (“plant”, “you”, “fly”, “me”, “reap”, “time”)<br>
&emsp;B. (“time”, “plant”, “reap”, “you”, me”, “fly”)<br>
&emsp;C. (“time”, “plant”, “you”, “me”, “fly”)<br>
&emsp;D. (“plant”, “reap”, “you”, “me”, “fly”)

**A, B, D**<br>
All we care about when making cosine similarity vectors are the sets of terms themselves, so<br>
permuting the orderings of terms in a vector will not influence cosine similarity. (You may also<br>
observe that a dot product is agnostic to the ordering of terms in a vector.) After we remove stop<br>
words and perform stemming, lists A and B contain all the relevant terms that we would care<br>
about in some query against this corpus.<br>
Not all the terms need to be present, however. In fact, list D is sufficient for computing cosine<br>
similarity: with careful observation (question 1(b) is a hint) you could realize that since “time”<br>
showed up in every document, its TF-IDF would always be 0, and consequently “time” cannot<br>
affect the result of our cosine similarity ranking.<br>
List C was not a valid answer; the absence of “reap” would for example cause queries including<br>
that term to rank improperly.

3\. \[4 points\] Suppose we issue our engine the query “plant OR fly”. In the spaces provided, write<br>
**only** the document IDs which are returned by this query, in order of relevance **as determined**<br>
**by cosine similarity**. (You may want to leave some spaces **blank**.) Break ties with smaller<br>
document IDs first, and then larger document IDs.

**3, 1, \<blank\>**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;7


---

<a id="page-8"></a>
**Page 8**

First, observe that document 2 is never returned by our query: it contains neither the term<br>
“plant” nor the word “fly”.<br>
Now we can compute cosine similarity between the document “plant OR fly” and both<br>
documents 1 and 3. This would involve computing the TF-IDFs of each of the relevant terms in<br>
documents 1 and 3 and then normalizing the resulting vector, after which you would compute a<br>
dot product on these vectors with the query document.<br>
Instead of doing the math to find these vectors, you could also have noticed that “plant” and “fly”<br>
have the same TF-IDF in documents 1 and 3, but document 1 has another “important” term in it<br>
(“reap”) while “fly” is the only important term in document 3 (discounting “time” in either<br>
document). Then since “plant” and “fly” had the same TF-IDF, but document 1 was “longer”, the<br>
TF-IDF of “plant” would have been scaled by a smaller normalizing factor than “fly”.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;8


---

<a id="page-9"></a>
**Page 9**

4a. \[2 point\] For this question, assume that we have a text index with the following schema:

`Files(docID text, content text)`<br>
`InvertedFile(word text, docID text)`<br>
`B+-tree Alternative 2 on Files`<br>
`B+-tree w/”postings list” at leaves on InvertedFile.word`


![Figure on page 9](figures/solutions-p09-fig14.png)


![Figure on page 9](figures/solutions-p09-fig15.png)

4b. \[2 points\] One of the following join algorithms would be ideal for evaluating the logical<br>
operator at the top of our query plan ⋈InvertedFile.docID=Files.docID.  Which one should we choose? (You<br>
can ignore issues of parallelism when answering this question, though they don’t really affect<br>
the answer.)

&emsp;A. Block Nested Loops join<br>
&emsp;B. Index Nested Loops join

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;9


---

<a id="page-10"></a>
**Page 10**

&emsp;C. Hash join<br>
&emsp;D. Sort Merge join

**B**<br>
As specified above, and as is usual for text search engines, our Files relation is conveniently<br>
indexed (by a B+ tree). Index Nested Loops Join will work best in this scenario, streaming result<br>
document IDs against this index.

**V. Query Optimization \[17 points\]**<br>
Suppose the “System R” assumptions about uniformity and independence from lecture hold.<br>
Assume that costs are estimated as a number of I/Os, without differentiating random and<br>
sequential I/O cost.

Consider the following relational schema and statistics:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`Students   (sid, name, age, gpa, year)`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`Courses    (cid, name, professor)`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`Enrollment (sid, cid, credits)`


![Figure on page 10](figures/solutions-p10-fig16.png)

1\. Suppose we run the following query.  (`<>` is the SQL syntax for “not equals”).

`SELECT *`<br>
`FROM Courses`<br>
`WHERE name <> "CS 186"`<br>
`AND professor = "Hellerstein";`

a. \[2 points\] What is the selectivity of each conjunct in the WHERE clause?<br>
name: .995 (199/200)<br>
professor: .01 (1/100)

b. \[2 points\] Which single table access plan would we choose?

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;10


---

<a id="page-11"></a>
**Page 11**

A) Sequential/File Scan on Courses<br>
B) Sequential/File Scan on Enrollment<br>
C) Index scan of unclustered B+Tree on Courses.professor<br>
D) Index scan of clustered B+Tree on Enrollment.cid

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
C) S ⨝ E (400,000,000 IOs)    F) E ⨝ C (400,000 IOs)<br>
Considered: C, D, E, F<br>
Chosen: C, E

3\. \[3 points\] Now, mark the letters for all three-table access plans that would be considered, and<br>
write down the letter of the final query plan that would be chosen.  (Cost given are cumulative<br>
for the full query.  Again, ignore interesting orders in formulating your answer.)

A) E ⨝ (S ⨝ C) (3,900,000,000 IOs)    G) (S ⨝ E) ⨝ C (7,500,000,000 IOs)<br>
B) E ⨝ (C ⨝ S) (6,000,000,000 IOs)    H) (E ⨝ S) ⨝ C (8,000,000,000 IOs)<br>
C) (C ⨝ S) ⨝ E (5,000,000,000 IOs)    I) S ⨝ (C ⨝ E) (3,500,000,000 IOs)<br>
D) (S ⨝ C) ⨝ E (8,000,000,000 IOs)    J) S ⨝ (E ⨝ C) (6,000,000,000 IOs)<br>
E) C ⨝ (S ⨝ E) (7,000,000,000 IOs)    K) (C ⨝ E) ⨝ S (4,000,000,000 IOs)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;11


---

<a id="page-12"></a>
**Page 12**

F) C ⨝ (E ⨝ S) (9,000,000,000 IOs)    L) (E ⨝ C) ⨝ S (10,000,000,000 IOs)<br>
Considered: G, K<br>
Chosen: K

4\. \[4 points\]  **True or False:**<br>
&emsp;a. If we had considered interesting orders in the query of Question 3, it would have further<br>
&emsp;&emsp;pruned the number of plans chosen. False<br>
&emsp;b. In Question 3, it would be beneficial to consider interesting orders on C.name during<br>
&emsp;&emsp;optimization. False<br>
&emsp;c. In Question 3,  it would be beneficial to consider interesting orders on C.cid during<br>
&emsp;&emsp;optimization. True<br>
&emsp;d. A modern optimizer should consider “interesting hashes”, since the output of a hash-<br>
&emsp;&emsp;based operator (e.g. hash join) is organized in a way that would decrease the cost of<br>
&emsp;&emsp;performing a subsequent hash-based operator (e.g. group-by). True

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;12

