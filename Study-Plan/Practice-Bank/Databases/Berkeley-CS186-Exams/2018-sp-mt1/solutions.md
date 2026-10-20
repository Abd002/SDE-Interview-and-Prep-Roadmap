# Berkeley CS186 Spring 2018: Midterm 1: Official solutions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/186>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;CS 186/286 Spring 2018 Midterm 1<br>
• Do not turn this page until instructed to start the exam.<br>
• You should receive 1 single-sided answer sheet and a 18-page exam packet.<br>
• All answers should be written on the answer sheet. The exam packet will be collected but not graded.<br>
• You have 80 minutes to complete the midterm.<br>
• The midterm has 4 questions, each with multiple parts.<br>
• The midterm is worth a total of 75 points.<br>
• For each question, place only your final answer on the answer sheet; do not show work.<br>
• For multiple choice questions, please fill in the bubble or box completely, **do not mark the box with**<br>
**an X or checkmark**.<br>
• Use the blank spaces in your exam for scratch paper.<br>
• You are allowed **one** 8.5” × 11” double-sided page of notes.<br>
• No electronic devices are allowed.


---

<a id="page-2"></a>
**Page 2**

**1**   **SQL/Relational Algebra (28 points)**

For the following questions, we consider the following schema:

`CREATE` `TABLE` `Player(`<br>
`pid` `INTEGER` `PRIMARY` `KEY,`<br>
`name` `TEXT`<br>
`);`

`CREATE` `TABLE` `Relationship(`<br>
`pid1` `INTEGER` `REFERENCES` `Player(pid),`<br>
`pid2` `INTEGER` `REFERENCES` `Player(pid),`<br>
`type` `TEXT,`<br>
`time` `TIMESTAMP,`<br>
`PRIMARY` `KEY(pid1,` `pid2,` `time)`<br>
`);`<br>
Players may be part of a relationship (with the “type” being either “Friend” or “Enemy”) with other players.

A single row in the `Relationship` table represents the start of a relationship between two players. The most<br>
current relationship between players A and B is the row in Relationship with A, B, and the latest timestamp.

Consider the following relationships:

&emsp;At `2018-03-01` `11:40:00`:   At `2018-03-01` `11:50:00`:   At `2018-03-01` `12:00:00`:


![Figure on page 2](figures/solutions-p02-fig01.png)


![Figure on page 2](figures/solutions-p02-fig02.png)


![Figure on page 2](figures/solutions-p02-fig03.png)


![Figure on page 2](figures/solutions-p02-fig04.png)

&emsp;The corresponding tables are:

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Player   Relationship<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**pid**   **name**   **pid1**   **pid2**   **type**   **time**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1   Cat   1   2   Enemy   `2018-03-01` `11:40:00`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2   Dog   2   1   Enemy   `2018-03-01` `11:40:00`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3   Pig   2   3   Enemy   `2018-03-01` `11:50:00`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3   2   Enemy   `2018-03-01` `11:50:00`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2   3   Friend   `2018-03-01` `12:00:00`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3   2   Friend   `2018-03-01` `12:00:00`<br>
Relationships are always mutual: if there is a row with `pid1=3` and `pid2=4`, there will be a corresponding<br>
row with the same `type`/`time` and with `pid1=4` and `pid2=3`.

Assume that a player is never in a relationship with themself (Dog cannot be friends with Dog, and Cat<br>
cannot be enemies with Cat).

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 2 of 18


---

<a id="page-3"></a>
**Page 3**

1\. (4 points) We wish to find players that have started enemy relationships (with the same or with different<br>
players) at least 50 times. This could be between the same pair of players at least 50 times, or between<br>
at least 50 others, etc.<br>
Mark all of the following queries that do this.<br>
&emsp;&emsp;A.   `SELECT` `Player.*`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`FROM` `Player`<br>
&emsp;&emsp;&emsp;`INNER` `JOIN` `Relationship` `ON` `pid1` `=` `pid`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`WHERE` `type` `=` `‘Enemy’` `AND` `COUNT(*)` `>=` `50`<br>
&emsp;&emsp;&emsp;&emsp;`GROUP` `BY` `pid,` `name;`<br>
&emsp;&emsp;**B.**   `SELECT` `Player.*`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`FROM` `Player,` `Relationship`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`WHERE` `pid` `=` `pid1` `AND` `type` `=` `‘Enemy’`<br>
&emsp;&emsp;&emsp;&emsp;`GROUP` `BY` `pid,` `name`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`HAVING` `COUNT(*)` `>=` `50;`<br>
&emsp;&emsp;C.   `SELECT` `Player.*`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`FROM` `Player`<br>
&emsp;&emsp;&emsp;`INNER` `JOIN` `Relationship` `ON` `pid1` `=` `pid`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`WHERE` `COUNT(*)` `>=` `50;`<br>
&emsp;&emsp;&emsp;&emsp;`GROUP` `BY` `pid,` `name,` `type`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`HAVING` `type` `=` `‘Enemy’;`<br>
&emsp;&emsp;**D.**   `SELECT` `Player.*`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`FROM` `Player,` `Relationship`<br>
&emsp;&emsp;&emsp;`GROUP` `BY` `pid,` `pid1,` `type,` `name`<br>
&emsp;&emsp;&emsp;&emsp;`HAVING` `pid` `=` `pid1` `AND` `type` `=` `‘Enemy’` `AND` `COUNT(*)` `>=` `50;`

&emsp;**Solution:** A is incorrect. It is an invalid query, since we are using an aggregate in the `WHERE` clause.<br>
&emsp;B is correct.<br>
&emsp;C is incorrect. It is an invalid query, since we are using an aggregate in the `WHERE` clause.<br>
&emsp;D is correct. We group based on `pid`, `pid1`, and `type`, and throw out groups where the player IDs<br>
&emsp;are unequal, where the type is not “Enemy”, or where the count is too small.<br>
&emsp;This question was graded as 4 independent true/false questions, each worth 0.5 points. That is, you<br>
&emsp;got 0.5 points for every correct choice that you selected and 0.5 points for every incorrect choice<br>
&emsp;that you did not select.

2\. (6 points) Now instead, we decide that we want to fetch the number of times each player has started an<br>
enemy relationship (if a player became enemies with the same player twice, count it twice). If a player<br>
has never started an enemy relationship, the count should be 0.<br>
Mark all of the following queries that do this.<br>
&emsp;&emsp;A.   `SELECT` `Player.*,` `COUNT(*)`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`FROM` `Player`<br>
&emsp;&emsp;&emsp;`LEFT` `JOIN` `Relationship` `ON` `pid1` `=` `pid`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`WHERE` `type` `=` `‘Enemy’`<br>
&emsp;&emsp;&emsp;&emsp;`GROUP` `BY` `pid,` `name;`<br>
&emsp;&emsp;B.   `SELECT` `Player.*,` `COUNT(pid1)`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`FROM` `Player`<br>
&emsp;&emsp;&emsp;`LEFT` `JOIN` `Relationship` `ON` `pid1` `=` `pid`<br>
&emsp;&emsp;&emsp;&emsp;`GROUP` `BY` `pid,` `name,` `type`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`HAVING` `type` `=` `‘Enemy’;`

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 3 of 18


---

<a id="page-4"></a>
**Page 4**

&emsp;**C.**   `SELECT` `Player.*,` `COUNT(pid1)`<br>
&emsp;&emsp;&emsp;&emsp;`FROM` `Player`<br>
&emsp;&emsp;`LEFT` `JOIN` `Relationship` `ON` `pid1` `=` `pid`<br>
&emsp;&emsp;&emsp;`WHERE` `type` `=` `’Enemy’` `OR` `type` `IS` `NULL`<br>
&emsp;&emsp;`GROUP` `BY` `pid,` `name;`<br>
&emsp;D.   `SELECT` `Player.*,` `COUNT(*)`<br>
&emsp;&emsp;&emsp;&emsp;`FROM` `Player`<br>
&emsp;&emsp;`LEFT` `JOIN` `Relationship` `ON` `pid1` `=` `pid`<br>
&emsp;&emsp;&emsp;`WHERE` `type` `=` `‘Enemy’` `OR` `type` `IS` `NULL`<br>
&emsp;&emsp;`GROUP` `BY` `pid,` `name;`

**Solution:** A is incorrect because players with only friend relationships will be matched to those<br>
rows, then entirely filtered out by the `WHERE` clause.<br>
B is incorrect because we match players with all relationships they started, group by type, then<br>
throw out groups with type not equal to “Enemy”, so players with no enemy relationships will be<br>
entirely filtered out.<br>
C is correct.<br>
D is incorrect because the `COUNT(*)` counts `NULL` values, so players with no enemy relationships will<br>
have a count of 1.<br>
This question was graded as 4 independent true/false questions, each worth 0.5 points. That is, you<br>
got 0.5 points for every correct choice that you selected and 0.5 points for every incorrect choice<br>
that you did not select.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 4 of 18


---

<a id="page-5"></a>
**Page 5**

3\. (6 points) Now, instead of counting the number of times a player has become enemies with other players,<br>
we wish to find the last player(s) with whom each player has entered into a relationship. Omit players<br>
that have never started a relationship. If the player started a relationship with multiple players at the<br>
same time, return a row for each one.<br>
Mark all of the following queries that do this.<br>
&emsp;&emsp;A. `SELECT` `pid1,` `pid2`<br>
&emsp;&emsp;&emsp;&emsp;`FROM` `Relationship` `R1`<br>
&emsp;&emsp;&emsp;&emsp;`WHERE` `EXISTS` `(`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`SELECT` `1` `FROM` `Relationship` `R2`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`WHERE` `R1.pid1` `=` `R2.pid1`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`AND` `R1.time` `>` `R2.time`<br>
&emsp;&emsp;&emsp;&emsp;`);`<br>
&emsp;&emsp;**B.** `SELECT` `pid1,` `pid2`<br>
&emsp;&emsp;&emsp;&emsp;`FROM` `Relationship` `R1`<br>
&emsp;&emsp;&emsp;&emsp;`WHERE` `time` `IN` `(`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`SELECT` `MAX(R2.time)` `FROM` `Relationship` `R2`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`WHERE` `R1.pid1` `=` `R2.pid1`<br>
&emsp;&emsp;&emsp;&emsp;`);`<br>
&emsp;&emsp;**C.** `SELECT` `pid1,` `pid2`<br>
&emsp;&emsp;&emsp;&emsp;`FROM` `Relationship` `R1`<br>
&emsp;&emsp;&emsp;&emsp;`WHERE` `R1.time` `>=` `ALL` `(`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`SELECT` `R2.time` `FROM` `Relationship` `R2`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`WHERE` `R1.pid1` `=` `R2.pid1`<br>
&emsp;&emsp;&emsp;&emsp;`);`<br>
&emsp;&emsp;D. `SELECT` `pid1,` `pid2`<br>
&emsp;&emsp;&emsp;&emsp;`FROM` `Relationship` `R1`<br>
&emsp;&emsp;&emsp;&emsp;`WHERE` `time` `>=` `ALL` `(`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`SELECT` `MAX(R2.time)` `FROM` `Relationship` `R2`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`GROUP` `BY` `R2.pid1`<br>
&emsp;&emsp;&emsp;&emsp;`);`

&emsp;**Solution:** A is incorrect: relationships where there are any older relationships with `pid1` are se-<br>
&emsp;lected.<br>
&emsp;B is correct: the subquery fetches the time of the newest relationship with `pid1`, and then the main<br>
&emsp;query fetches the relationship(s) with `pid1` that starts at that time.<br>
&emsp;C is correct: the subquery fetches the time of all new relationships with `pid1`, then the main query<br>
&emsp;fetches the relationship(s) that start at a timestamp at least as large as all of these.<br>
&emsp;D is incorrect: the subquery fetches the time of the newest relationship for each player, so the<br>
&emsp;WHERE predicate filters out all relationships that were not created at that time.<br>
&emsp;This question was graded as 4 independent true/false questions, each worth 0.5 points. That is, you<br>
&emsp;got 0.5 points for every correct choice that you selected and 0.5 points for every incorrect choice<br>
&emsp;that you did not select.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 5 of 18


---

<a id="page-6"></a>
**Page 6**

4\. (8 points) We now wish to find enemies of enemies at the current time. That is, we wish to find players<br>
A and C, such that the latest relationship in our table between A and some third player B is “Enemy”,<br>
and the latest relationship between B and C is also “Enemy”.


![Figure on page 6](figures/solutions-p06-fig05.png)

In the diagram above, Cat and Rat are enemies of enemies, because Cat is an enemy of Dog, and Dog<br>
is an enemy of Rat.<br>
Mark all of the queries that fetch all current enemy of enemy pairs.<br>
&emsp;&emsp;A.   `SELECT` `r1.pid1,` `r2.pid2`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`FROM` `Relationship` `r1,` `Relationship` `r2,` `Relationship` `r3,` `Relationship` `r4`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`WHERE` `r1.pid2` `=` `r2.pid1` `AND` `r1.type` `=` `r2.type`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`AND` `r1.pid1` `=` `r3.pid1` `AND` `r1.pid2` `=` `r3.pid2` `AND` `r1.type` `=` `r3.type`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`AND` `r2.pid1` `=` `r4.pid1` `AND` `r2.pid2` `=` `r4.pid2` `AND` `r1.type` `=` `r4.type`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`AND` `r1.pid1` `<>` `r2.pid2` `AND` `r1.type` `=` `‘Enemy’`<br>
&emsp;&emsp;&emsp;`GROUP` `BY` `r1.pid1,` `r2.pid2,` `r1.time,` `r2.time`<br>
&emsp;&emsp;&emsp;&emsp;`HAVING` `MAX(r3.time)` `<=` `r1.time` `AND` `MAX(r4.time)` `<=` `r2.time;`<br>
&emsp;&emsp;B.   `SELECT` `r1.pid1,` `r2.pid2`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`FROM` `Relationship` `r1,` `Relationship` `r2,` `Relationship` `r3,` `Relationship` `r4`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`WHERE` `r1.pid1` `=` `r3.pid1` `AND` `r1.pid2` `=` `r3.pid2`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`AND` `r2.pid1` `=` `r4.pid1` `AND` `r2.pid2` `=` `r4.pid2`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`AND` `r1.pid1` `<>` `r2.pid2` `AND` `r1.type` `=` `‘Enemy‘` `AND` `r2.type` `=` `‘Enemy‘`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`AND` `r1.pid1` `<>` `r2.pid2` `AND` `r1.type` `=` `‘Enemy’`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`GROUP` `BY` `r1.pid1,` `r2.pid2,` `r1.time,` `r2.time`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`HAVING` `MAX(r3.time)` `<=` `r1.time` `AND` `MAX(r4.time)` `<=` `r2.time;`<br>
&emsp;&emsp;**C.**   `SELECT` `r1.pid1,` `r2.pid2`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`FROM` `Relationship` `r1,` `Relationship` `r2,` `Relationship` `r3,` `Relationship` `r4`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`WHERE` `r1.pid2` `=` `r2.pid1`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`AND` `r1.pid1` `=` `r3.pid1` `AND` `r1.pid2` `=` `r3.pid2`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`AND` `r2.pid1` `=` `r4.pid1` `AND` `r2.pid2` `=` `r4.pid2`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`AND` `r1.pid1` `<>` `r2.pid2` `AND` `r1.type` `=` `r2.type`<br>
&emsp;&emsp;&emsp;`GROUP` `BY` `r1.pid1,` `r2.pid2,` `r1.type,` `r1.time,` `r2.time`<br>
&emsp;&emsp;&emsp;&emsp;`HAVING` `MAX(r3.time)` `<=` `r1.time` `AND` `MAX(r4.time)` `<=` `r2.time` `AND` `r1.type` `=` `‘Enemy’;`<br>
&emsp;&emsp;D.   `SELECT` `r1.pid1,` `r2.pid1`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`FROM` `Relationship` `r1,` `Relationship` `r2,` `Relationship` `r3,` `Relationship` `r4`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`WHERE` `r1.pid2` `=` `r2.pid2`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`AND` `r1.pid1` `=` `r3.pid1` `AND` `r1.pid2` `=` `r3.pid2`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`AND` `r2.pid1` `=` `r4.pid1` `AND` `r2.pid2` `=` `r4.pid2`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`AND` `r1.pid1` `<>` `r2.pid1` `AND` `r3.type` `=` `r4.type`<br>
&emsp;&emsp;&emsp;`GROUP` `BY` `r1.pid1,` `r2.pid1,` `r3.type,` `r1.time,` `r2.time`<br>
&emsp;&emsp;&emsp;&emsp;`HAVING` `MAX(r3.time)` `<=` `r1.time` `AND` `MAX(r4.time)` `<=` `r2.time` `AND` `r3.type` `=` `‘Enemy’;`

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 6 of 18


---

<a id="page-7"></a>
**Page 7**

**Solution:** A is incorrect: the comparison of `MAX(r3.time)` `<=` `r1.time` and `MAX(r4.time)` `<=`<br>
`r2.time` are only checking the maximum over records whose type is ‘Enemy’; if the newest record<br>
in a relationship is ‘Friend’, but it was once ‘Enemy’, it will still be treated as ‘Enemy’.<br>
B is incorrect: there is no constraint that `r1.pid2` `=` `r2.pid1`, and therefore fails in the case where<br>
A is an enemy of B, A is a friend of C, B is a friend of D, and C is an enemy of D (the query will<br>
match (A, B) with (C, D), and say that A and D are enemies of enemies).<br>
C is correct, and works by letting `r3` and `r4` join in every relationship between the row selected in<br>
`r1` and `r2`, so that we can use aggregates.<br>
D is incorrect, because the constraint on the two relationships being ‘Enemy’ is applied on the<br>
records that we’re calculating the latest timestamp of, and not on the records that we’re actually<br>
selecting.<br>
This question was graded as 4 independent true/false questions, each worth 1 point. That is, you<br>
got 1 point for every correct choice that you selected and 1 point for every incorrect choice that you<br>
did not select.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 7 of 18


---

<a id="page-8"></a>
**Page 8**

For the following problems, we use P to denote the Player table and R to denote the Relationship table.<br>
We additionally assume that for any pair of `pid`s (e.g. 1 and 2), there is at most one pair of rows in the<br>
Relationship table (with `pid1=1,` `pid2=2` and `pid1=2,` `pid2=1`). In other words, we are only storing the<br>
most current relationship.<br>
5\. (3 points) We wish to find the name of all players that are not enemies of enemies with any other player.<br>
&emsp;Mark all of the following relational algebra expressions that satisfy this query.<br>
&emsp;&emsp;&emsp;A. πname(σtype=‘Enemy′(P −πpid,name(P ▷◁πpid1,pid2,type(R) ▷◁ρpid1→pid(R)))<br>
&emsp;&emsp;&emsp;**B.** π**name**(P −π**pid**,**name**(σ**type**=‘Enemy′(P ▷◁π**pid1**,**pid2**,**type**(R) ▷◁ρ**pid1**→**pid**(R)))<br>
&emsp;&emsp;&emsp;C. πname(P) −πname(σtype=‘Enemy′(πpid1,pid2,type(P ▷◁R) ▷◁ρpid1→pid(R)))

&emsp;**Solution:** A is incorrect: the projection to `pid,` `name` means that the `type` column is already<br>
&emsp;filtered out by the time we process the selection.<br>
&emsp;B is correct: we match players with relationships of relationships containing them, where both<br>
&emsp;relationships are the same type (because we’re doing a natural join), and then filter to only enemy-<br>
&emsp;enemy relationships. This gets us all players that are in enemy of enemy relationships, so subtracting<br>
&emsp;this from `P` gets us all players that are not in such relationships.<br>
&emsp;C is incorrect: we perform the set difference on `name`s, not `pid`s, so we get the wrong output when<br>
&emsp;there are two players with the same name, one of whom is in an enemy of enemy relationship, and<br>
&emsp;the other of whom is not.<br>
&emsp;This question was graded as 3 independent true/false questions, each worth 0.5 points. That is, you<br>
&emsp;got 0.5 points for every correct choice that you selected and 0.5 points for every incorrect choice<br>
&emsp;that you did not select.

6\. (1 point) True or false: the two relational algebra expressions are equivalent (on all possible databases).<br>
&emsp;σtype=‘Enemy′(R) −(σtype=‘Enemy′(R) −σtime\<‘2018−01−01′(R))<br>
&emsp;σtime\<‘2018−01−01′ AND type=‘Enemy′(R)

&emsp;**Solution:** True, these expressions are equivalent.<br>
&emsp;Let A = σtype=‘Enemy′(R) and B = σtime\<‘2018−01−01′(R).<br>
&emsp;The first expression is A −(A −B) which is equivalent to A ∩B, but the intersection of A and B is<br>
&emsp;just a selection over R with both predicates.<br>
&emsp;This question was graded all or nothing. The correct answer received 1 point; every other answer<br>
&emsp;received 0 points.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 8 of 18


---

<a id="page-9"></a>
**Page 9**

**2**   **File Organization (6.5 points)**

**2.1**   **True and False**<br>
1\. (2.5 points) Specify correct choice(s) by filling in the corresponding box on the answer sheet.<br>
&emsp;&emsp;&emsp;**A. In order to interact with all hard disks, computers use an explicit API.**<br>
&emsp;&emsp;&emsp;B. Hard drives need to constantly re-organize the data stored on them (wear-levelling) to prevent<br>
&emsp;&emsp;&emsp;&emsp;failure.<br>
&emsp;&emsp;&emsp;C. For flash drives, read and writes are both equally fast since these drive use NAND technology<br>
&emsp;&emsp;&emsp;&emsp;instead of traditional spinning magnetic disks.<br>
&emsp;&emsp;&emsp;**D. Heap files are preferable to Sorted files when fast writes are required.**<br>
&emsp;&emsp;&emsp;E. For pages holding variable length records, the size of the slot directory never changes.

&emsp;**Solution:** A is directly from the lecture slides. B is false since wear-levelling only applies to flash<br>
&emsp;drives. C is false since writes are slower than reads for flash drives. D is true since Heap files do<br>
&emsp;no require extra IOs to maintain sorted order after an insert. E is false since the slot directly can<br>
&emsp;expand to accommodate extra records.

**2.2**   **Records and Pages**<br>
Consider the following relation:<br>
`CREATE` `TABLE` `Universities{`<br>
&emsp;&emsp;`name` `TEXT`<br>
&emsp;&emsp;`abbrev` `CHAR(3)`<br>
&emsp;&emsp;`addr` `TEXT`<br>
&emsp;&emsp;`zip` `CHAR(5)`<br>
&emsp;&emsp;`phone` `TEXT`<br>
&emsp;&emsp;`enrolled` `INTEGER`<br>
`}`<br>
1\. (1 point) How big, in bytes is the smallest possible record? Assume the record header takes up 4 bytes<br>
&emsp;and integers are 4 bytes long.

&emsp;**Solution:** 16 bytes. 4 bytes for the record header, 3 bytes for abbrev, 5 bytes for zip, 4 bytes for<br>
&emsp;enrolled. The TEXT fields can be empty so 0 bytes.

2\. (3 points) Assuming each record is 22 bytes long and we have access to 5 pages each of size 4KB (1KB<br>
&emsp;= 1024B) where each page has a footer containing 6 bytes of metadata (including the free space pointer)<br>
&emsp;as well as a slot directory, how many records can we fit on the 5 pages? Assume integers are 4 bytes<br>
&emsp;long . Assume that records cannot span multiple pages.

&emsp;**Solution:** 680 records. We first calculate how much space we have on each page. We have 1024\*4<br>
&emsp;= 4096 bytes with 4096 - 6 = 4090 bytes available after the page footer metadata is accounted for.<br>
&emsp;We also have each record taking up 22 + 4 + 4 = 30 bytes, after accounting for the slot directory<br>
&emsp;pointer and size value for each record. We then find how many records fit per page: floor(4090/30)<br>
&emsp;= 136 records. Therefore, we can fit a total of 5 \* 136 = 680 records on all 5 pages.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 9 of 18


---

<a id="page-10"></a>
**Page 10**

**3**   **Indices (20.5 points)**

For this section, remember that **the height of a one level tree is defined to be 0, the height of a**<br>
**tree with two levels is defined to be 1, and so on.**

**3.1**   **True and False**<br>
1\. (2.5 points) Specify correct choice(s) by filling in the corresponding box on the answer sheet.<br>
&emsp;&emsp;&emsp;A. The maximum fanout of a B+ tree is equal to 2d where d is its order.<br>
&emsp;&emsp;&emsp;B. When an insertion into a B+ tree causes a node to split, the height of the tree always increases.

&emsp;&emsp;&emsp;**C. As the number of keys in a B+ tree increases, IO cost for searches grows logarith-**<br>
&emsp;&emsp;&emsp;&emsp;**mically with the number of keys.**<br>
&emsp;&emsp;&emsp;D. Clustered and unclustered B+ trees provide the same performance benefits for all queries.<br>
&emsp;&emsp;&emsp;E. Bulkloading for B+ trees is efficient because we only keep the left most branch in memory for<br>
&emsp;&emsp;&emsp;&emsp;insertions and can disregard the rest of the tree.

&emsp;**Solution:** A is false since we know the fanout is equal to 2d+1 from lecture. B is false since the<br>
&emsp;height of a B+ tree only increases when the root splits. C is true from lecture. D is false since we’ve<br>
&emsp;seen how clustered indices can help reduce IO cost in range searches. E is false because we only<br>
&emsp;keep the right branch in memory, not the left.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 10 of 18


---

<a id="page-11"></a>
**Page 11**

2\. (4 points) For the B+ trees below, determine which of the trees are valid B+ trees based on the invariants<br>
we learned in class, and fill in its corresponding box on the answer sheet. Assume that there were no<br>
deletes. Note, we follow the right branch when the split key equals the search key.


![Figure on page 11](figures/solutions-p11-fig06.png)

&emsp;&emsp;A.


![Figure on page 11](figures/solutions-p11-fig07.png)

&emsp;&emsp;B.


![Figure on page 11](figures/solutions-p11-fig08.png)

&emsp;&emsp;C.


![Figure on page 11](figures/solutions-p11-fig09.png)

&emsp;&emsp;**D.**

&emsp;**Solution:** A is invalid because the right most leaf node is under-full. B is invalid because the 10<br>
&emsp;key is repeated in the root and the right inner node. C is invalid because the right inner node is<br>
&emsp;underfilled. D is the only valid tree since all invariants are fulfilled.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 11 of 18


---

<a id="page-12"></a>
**Page 12**

3\. (3 points) Suppose we have an initially empty, order d=1 B+ tree, and the following set of keys:

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3, 9, 8, 7, 2, 1, 5, 10, 12

&emsp;Which of the following are possible B+ trees after inserting all of the above elements in some order?<br>
&emsp;Again, we follow the right branch when the split key equals the search key. When splitting a node with<br>
&emsp;an odd number of keys, assume the new right node receives one more key than the original left node.


![Figure on page 12](figures/solutions-p12-fig10.png)

&emsp;&emsp;&emsp;**A.**


![Figure on page 12](figures/solutions-p12-fig11.png)

&emsp;&emsp;&emsp;B.


![Figure on page 12](figures/solutions-p12-fig12.png)

&emsp;&emsp;&emsp;**C.**

&emsp;**Solution:** A is an invalid B+ tree since the left most leaf node is not sorted. However this was<br>
&emsp;actually not intended on the staff’s part so either answer was accepted since all other invariants<br>
&emsp;hold. B is invalid because it is the result of a bulkload. Therefore, the right most node is not full<br>
&emsp;when it should be since the right leaf receives the extra key over the left node during a split. C is a<br>
&emsp;valid B+ tree.

**3.2**   **Short Answer**<br>
1\. (.5 points) What is the maximum fanout of an order x+1 B+ tree?

&emsp;**Solution:** 2x+3. This is a direct application of the fanout equation: F=2d+1 with d=x+1 value.<br>
&emsp;Here, F = 2(x+1)+1 = 2x+3

2\. (.5 points) What is the maximum number of keys an order 2 B+ tree with height 2 can store?

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 12 of 18


---

<a id="page-13"></a>
**Page 13**

&emsp;**Solution:** 100. An order of 2 means the fanout is 5. At height 0, there is one node. At height 1,<br>
&emsp;there are 1\*5 = 5 nodes. At height 2, there are 5\*5 = 25 nodes. Each node can store 4 keys. So<br>
&emsp;25\*4 = 100 keys.

3\. (.5 points) For a height 3 alternative 2 B+ tree, how many IOs are required for an equality search on<br>
the index key given that the index key is a primary key?

&emsp;**Solution:** 5 IOs. We need 4 IOs to traverse to a leaf page and 1 IO to go to the actual page in the<br>
&emsp;file since this is an alternative 2 B+ tree.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 13 of 18


---

<a id="page-14"></a>
**Page 14**

**3.3**   **Bulk Loading**<br>
What is the resulting B+ tree after bulk loading the following keys? Assume we are building an order d=1<br>
index with a minimum leaf node fill factor of 2/3. When splitting an inner node, perform the split the same<br>
way we did in the homework – with an internal node fill factor of 1/2.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3, 8, 5, 19, 20, 11, 7<br>
&emsp;Answer the questions below:<br>
1\. (.5 points) What is the height of the resulting B+ tree?

&emsp;**Solution:** 2.

2\. (.5 points) How many inner nodes are there in the resulting B+ tree?

&emsp;**Solution:** 3.

3\. (.5 points) How many leaf nodes are there in the resulting B+ tree?

&emsp;**Solution:** 4, from the diagram. We end up with full leaf nodes due to how bulkloading first checks<br>
&emsp;the fill factor, then inserts a key into the leaf. When the leaf node is half full, the fill factor is not<br>
&emsp;fulfilled so the leaf is filled to full capacity.

4\. (.5 points) What key(s) are in the leftmost leaf node? Separate keys with commas.

&emsp;**Solution:** 3, 5. Since leaf nodes are filled to full capacity.

5\. (.5 points) What key(s) are in the rightmost leaf node? Separate keys with commas.

&emsp;**Solution:** 20.

6\. (1 point) Write out the contents of the resulting B+ tree in a level-order traversal. Remember that a<br>
&emsp;level-order tree traversal enumerates the nodes of a tree one level at a time, and from left to right on<br>
&emsp;each level. That is, first the root, then the children of the root from left to right, and so on. Separate<br>
&emsp;keys with commas.

&emsp;**Solution:** 11, 7, 20, 3, 5, 7, 8, 11, 19, 20.

&emsp;**Solution:** The number of keys per leaf node is ceil(2\*2/3) = 2. We bulk load from left to right and<br>
&emsp;when we split an inner node, we copy half the keys into the left node and half into the new right<br>
&emsp;node and push up the middle key.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 14 of 18


---

<a id="page-15"></a>
**Page 15**


![Figure on page 15](figures/solutions-p15-fig13.png)

**Use the B+ tree below for the following questions:**


![Figure on page 15](figures/solutions-p15-fig14.png)

7\. (2 points) What is the maximum number of keys we can insert before changing the height of the tree?

&emsp;**Solution:** 15. We can insert 3, 4, 6, 7, 8, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28.

8\. (2 points) What is the minimum number of keys that we can insert to change the height of the tree?

&emsp;**Solution:** 7. We can insert 13, 15, 16, 17, 19, 20, 21.

9\. (2 points) How many total IOs are required to insert the keys 15, 16, 17? Remember that reading in a<br>
page into memory and writing the page back to disk counts as 2 IOs (1 read and 1 write). Additionally,<br>
assume each insert starts with an empty buffer pool.

&emsp;**Solution:** Total IOs = 3+3+5 = 11. 3 IOs for 15 and 16: for both, we read the root (1), then we<br>
&emsp;read the right most leaf node (1), lastly we write the right most leaf node (1). 5 IOs for 17: we read<br>
&emsp;the root (1), then we read the right most leaf node (1). We must split so we write the 2 split leaf<br>
&emsp;nodes to disk (2), we push up a key to the root so we must write the root back to disk (1).

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 15 of 18


---

<a id="page-16"></a>
**Page 16**

**4**   **Buffers/Sorting and Hashing (20 points)**

For any question that asks which pages are in the buffer pool at some point in time, please list the pages in<br>
**alphabetical order.**<br>
1\. (5 points) Assume we have 4 empty buffer frames and the following access pattern, in which pages are<br>
&emsp;immediately unpinned:

&emsp;A, C, D, F, D, C, B, C, A, E, C, D

&emsp;a) Which pages are in the buffer pool at the end if we use MRU cache policy?<br>
&emsp;b) How many cache hits will there be after MRU cache policy?<br>
&emsp;c) Which pages are in the buffer pool at the end if we use Clock cache policy?<br>
&emsp;d) How many cache hits will there be after Clock cache policy?<br>
&emsp;e) How many reference bits are set after Clock cache policy?

&emsp;**Solution:**<br>
&emsp;a) CDEF<br>
&emsp;b) 5<br>
&emsp;c) ACDE<br>
&emsp;d) 4<br>
&emsp;e) 1

2\. (3 points) Assume we have 4 empty buffer frames and the following access pattern, in which pages are<br>
&emsp;immediately unpinned:

&emsp;A, B, C, D, E, A, B, C, D, E, A, B, C, D, E

&emsp;a) Which pages are in the buffer pool at the end if we use LRU cache policy?<br>
&emsp;b) How many cache hits will occur if we use LRU cache policy?<br>
&emsp;c) True or False: For any sequential access pattern and buffer size, LRU will always have a cache hit<br>
&emsp;rate strictly less than MRU.

&emsp;**Solution:**<br>
&emsp;a) BCDE<br>
&emsp;b) 0<br>
&emsp;c) False; LRU and MRU can have the same hit rate if the length of the access pattern is less than<br>
&emsp;the buffer size.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 16 of 18


---

<a id="page-17"></a>
**Page 17**

3\. (3 points) True or False:<br>
a) To finish the final pass of external hashing (conquer), we use a coarse-grained hash function, hr, that<br>
is different from the hash functions used in the previous passes.

&emsp;**Solution:** False. To finish the final pass of external hashing (conquer), we use a FINE-GRAINED<br>
&emsp;hash function, hr. This is subtle but important, this is the reason why the full partition must fit<br>
&emsp;in memory, and its the only way we guarantee that when a partition exits the conquer pass, it is<br>
&emsp;hashed. We covered this point during discussion section.

b) De-duplicating a file using hashing is always more efficient than sorting in terms of I/O cost.

&emsp;**Solution:** False. The file could already be in sorted order, or the hash function could be bad.

c) Given any hashed file, there is some permutation of pages such that the resulting file is sorted.

&emsp;**Solution:** False. Proof: Consider a file with a single page that can fit 3 records: C, A, B. This file<br>
&emsp;is hashed, but there is no permutation of the 1 page that would sort it.

4\. (6 points) Suppose the size of a page is 4KB, and the size of the memory buffer is 320KB. We want to<br>
perform external sorting for a dataset. Answer the following questions given these configurations.<br>
a) What is the maximum size of the dataset (in KB) that can be sorted in one pass?

&emsp;**Solution:** In one pass, we can only sort the amount of memory we have, so 320 KB.

b) What is the maximum size of the dataset (in KB) that can be sorted in n passes for n \>= 1? (Use n<br>
in your solution)

&emsp;**Solution:** 320 ∗316n−1

c) If the size of the dataset is 800KB, how many disk I/O do we need to sort this dataset?

&emsp;**Solution:** 800 IOs. We can sort this in 2 passes since 800 KB is equal to 200 pages, and we can<br>
&emsp;sort up to B ∗(B −1) = 80 ∗79 pages in 2 passes. The total number of IOs is 2Np where N is the<br>
&emsp;size of the dataset (in pages) and p is the number of passes. 2 ∗(2 ∗N) = 4 ∗(200) = 800 IOs

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 17 of 18


---

<a id="page-18"></a>
**Page 18**

5\. (3 points) We are given a table containing personal information of UC Berkeley students wish a size<br>
of 100,000 KB. Suppose we want to group students by their year of birth. We have 51 buffer pages<br>
available, and the size of each page is 100KB.<br>
a) How large will the average partition be as they enter the second phase of external hashing, in pages?

&emsp;**Solution:** a. N/(B-1) = (100,000KB/100KB)/50 = 20 pages

b) Assume that our table only contains information about undergraduates at UC Berkeley, and we would<br>
like to eliminate duplicate students using hashing. Rank the following hash functions from best to worst<br>
for accomplishing this task (in your answer, list the letters of the hash functions from left to right with<br>
the leftmost letter being the best hash function and the rightmost one being the worst). We consider a<br>
hash function with less collisions (different records ending up in the same bucket) to be “better”.<br>
&emsp;`CREATE` `TABLE` `Enrolled` `{`<br>
&emsp;&emsp;&emsp;`firstname` `TEXT,`<br>
&emsp;&emsp;&emsp;`lastname` `TEXT,`<br>
&emsp;&emsp;&emsp;`addr` `TEXT,`<br>
&emsp;&emsp;&emsp;`sid` `INTEGER,`<br>
&emsp;&emsp;&emsp;`gender` `CHAR(1),`<br>
&emsp;&emsp;&emsp;`year_of_birth` `INTEGER`<br>
&emsp;`}`<br>
&emsp;&emsp;A. h(record) = record.year of birth % 10<br>
&emsp;&emsp;B. h(record) = record.sid % 10<br>
&emsp;&emsp;C. h(record) = to int(record.gender) % 10<br>
&emsp;&emsp;D. h(record) = to int(record.firstname\[0\]) % 10

&emsp;**Solution:** h(record) = record.year of birth % 10: Rank 3, bad because most undergrads born in<br>
&emsp;4-5 year range<br>
&emsp;h(record) = record.sid % 10: Rank 1, best assuming SID are distributed evenly<br>
&emsp;h(record) = to int(record.gender) % 10: Rank 4, worst because most students are male or female<br>
&emsp;h(record) = to int(record.firstname\[0\]) % 10: Rank 2, slightly worse than SID because first letter<br>
&emsp;skewed. However, the first letter of first name is less skewed than year of birth<br>
&emsp;The correct answer (`BDAC`) received 2 points. Partial credit (of 1 point) was awarded to answers that<br>
&emsp;correctly identified the best hash function (B), or the worst hash function (C). Every other answer<br>
&emsp;received 0 points.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 18 of 18

