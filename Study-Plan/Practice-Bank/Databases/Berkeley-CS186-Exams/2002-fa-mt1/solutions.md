# Berkeley CS186 Fall 2002: Midterm 1: Official solutions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/186>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**University of California, Berkeley**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**College of Engineering**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Computer Science Division – EECS**<br>
Fall  2002                                      Prof. Michael J. Franklin<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**MIDTERM AND SOLUTIONS**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS 186 Introduction to Database Systems

**NAME**: \_\_\_\_\_Norm L. Form\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_     **STUDENT ID:\_\_\_00000001\_\_\_\_\_**

`IMPORTANT:` `Circle` `the` `last` `two` `letters` `of` `your` `class` `account:`


![Figure on page 1](figures/solutions-p01-fig01.png)

`cs186` `a` `b` `c` `d` `e` `f` `g` `h` `i` `j` `k` `l` `m` `n` `o` `p` `q` `r` `s` `t` `u` `v` `w` `x` `y` `z`<br>
&emsp;&emsp;&emsp;`a` `b` `c` `d` `e` `f` `g` `h` `i` `j` `k` `l` `m` `n` `o` `p` `q` `r` `s` `t` `u` `v` `w` `x` `y` `z`

`DISCUSSION` `SECTION` `DAY` `&` `TIME:__Sun` `7:30am``TA` `NAME:` `_G` `something`<br>
General Information:<br>
This is a **closed book** examination – but you are allowed one 8.5” x 11” sheet of notes (double sided).<br>
You should try to answer as many questions as possible.  **Partial credit will be given**.  There are 100<br>
points in all.  You should read **all** of the questions before starting the exam, as some of the questions<br>
are substantially more time-consuming than others.<br>
Write all of your answers directly on this paper.  **Be sure to clearly indicate your final answer** for<br>
each question.  Also, be sure to state any assumptions that you are making in your answers.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**GOOD LUCK!!!**


![Figure on page 1](figures/solutions-p01-fig02.png)


---

<a id="page-2"></a>
**Page 2**

Name:\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_                  SID:\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_


### **Question 1 - Functional Dependencies \[5 parts, 20 points total\]:**

&emsp;**a) \[3  points\]** Your cousin, who is studying at a Bay Area university often noted for its sports<br>
&emsp;&emsp;programs, claims to have learned “Lance’s Axioms” for reasoning about Functional<br>
&emsp;&emsp;Dependencies.   He claims that one such axiom, is<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Reversitivity: if   “A  B” then “B  A”<br>
Give an example relation instance that proves that Reversitivity is invalid.  (for simplicity, use<br>
integers and/or single letters as your attribute values)


![Figure on page 2](figures/solutions-p02-fig03.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;•  need to show  a B value with 2 different A values<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;• If 2 A’s have same value, they must have same B value<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;• not necessary to show two tuples with same A value

&emsp;**b) \[4 points\]** After viewing your counterexample for part (a),  your cousin launches into a review<br>
&emsp;&emsp;of the final scores of the “Big Game” over the past decade.  He then claims that there is another<br>
&emsp;&emsp;axiom:       Kindatransitivity: if   “A  C”  and “AB  C” then “B  C”<br>
&emsp;&emsp;Give an example relation instance that proves that Kindatransitivity is invalid.


![Figure on page 2](figures/solutions-p02-fig04.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;• need to show  a B value with 2 different C values<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;• If 2 A’s have same value, they must have same C value<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;• if 2 ABs have same value, they must have same C value<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;• not necessary to show two tuples with same A value

&emsp;**c) \[5 points\]** It turns out however, that your cousin almost got it right.  In fact, there is a rule as<br>
&emsp;&emsp;follows:         Pseudotransitivity: if   “A  B”  and “BC  D” then “AC  D”<br>
&emsp;&emsp;Using Armstrong’s Axioms (not Lance’s) show that Pseudotransitivity is in fact valid (Be sure<br>
&emsp;to indicate which axiom you are using in each step).<br>
&emsp;&emsp;&emsp;• A  B given;<br>
&emsp;&emsp;&emsp;• BC  D given<br>
&emsp;&emsp;&emsp;• AC  BC  Augmentation of 1 with C<br>
&emsp;&emsp;&emsp;• AC  D  Transitivity of 3 and 2

CS 186 Midterm     October 10, 2002        Page 2 of 13


---

<a id="page-3"></a>
**Page 3**

Name:\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_                  SID:\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_


### **Question 1 (continued)**

&emsp;**d) \[2 points\]** Why can’t you use an example relation instance to answer part “c”, as you did for<br>
&emsp;&emsp;parts “a” and “b” of this question? (be concise – i.e., one or two sentences is sufficient.)<br>
&emsp;&emsp;&emsp;Because F.D.s must hold across all legal instances of a relation, so showing one<br>
&emsp;&emsp;&emsp;example isn’t sufficient.

&emsp;**e) \[6 points\]**  Consider the relation schema **R = ABCDE** and the following functional<br>
&emsp;&emsp;dependencies on R:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**A**  **D**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**BC**  **E**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**D**  **AB**

&emsp;&emsp;**R** has two candidate keys.  What are they (circle your answer)?


![Figure on page 3](figures/solutions-p03-fig05.png)

CS 186 Midterm     October 10, 2002        Page 3 of 13


---

<a id="page-4"></a>
**Page 4**

Name:\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_                  SID:\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_


### **Question 2 – Normalization \[7 parts,  15 points total\]**

&emsp;Consider the relation schema **S = ABCD** and the following functional dependencies on **S**:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**A**  **BCD**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**B**  **C**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**CD**  **A**<br>
For each of the following short questions, be sure to briefly explain your answer.<br>
&emsp;**a) \[3 points\]**  **S** is not in BCNF, but is it in 3NF?  Explain your answer.<br>
&emsp;&emsp;&emsp;Yes, because CD and A are candidate keys.  B  C is okay because C is part of a<br>
&emsp;&emsp;&emsp;&emsp;&emsp;candidate key (CD).

&emsp;**b) \[2 points\]** Consider the decomposition of **S** into **S1** = ABC and **S2** = BCD.  Is this a valid<br>
&emsp;&emsp;decomposition into BCNF?  Explain.<br>
No, because B  C and B is not a candidate key (for either S1 and S2)

&emsp;**c) \[2 points\]** Is the decomposition of **S** into **S1** and **S2** lossless? Why or why not?<br>
No, because BC is the intersection and  BC is not a key for either S1 and S2

&emsp;**d) \[2 points\]** Is the decomposition of **S** into **S1** and **S2** dependency preserving? Why or why not?<br>
No, because CDA (or AC)  are lost

&emsp;**e) \[2 points\]** Consider the decomposition of **S** into **S3** = ABD and **S4** = BC.  Is this a valid<br>
&emsp;&emsp;decomposition into BCNF?  Explain.<br>
Yes, A is a key for ABD and B is a key for BC (also all 2 attr relns are in BCNF)

&emsp;**f) \[2 points\]** Is the decomposition of **S** into **S3** and **S4** lossless? Why or why not?<br>
Yes, Intersection is B and it is a key for BC

&emsp;**g) \[2 points\]** Is the decomposition of **S** into **S3** and **S4** dependency preserving? Why or why not?<br>
No, because CDA (or AC)  are lost ;

CS 186 Midterm     October 10, 2002        Page 4 of 13


---

<a id="page-5"></a>
**Page 5**

Name:\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_                  SID:\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_


### Question 3 – Formal Relational Languages \[5 parts,  20 points total\]

Consider  the following schema for the Australian Competitive Team Boomerang League.   The<br>
database tracks information about teams, players, and the outcomes of games they have played.  Each<br>
game consists of a “home” team and an “away” team.  The ACTBL requires that no games can end in<br>
a tie.  The winner of a game is (obviously) the team with the most points.  Assume that every team has<br>
played at least one game at home and at least one game away so far.  The schema is as follows<br>
(primary key for each relation is underlined):<br>
**TEAMS (TName, TCity)**<br>
**PLAYERS (PName, Team, Salary)** \[where Team is a foreign key referencing TEAMS\]<br>
**GAMES (HomeTm, AwayTm, Date, HomePts, AwayPts)**<br>
\[where HomeTm and AwayTm are foreign keys referencing TEAMS\]<br>
Express the following queries in the indicated query language.  Feel free to use the compound<br>
relational algebra operators, such as division:<br>
&emsp;**a) \[4 points\] (Relational Algebra):** List the player name and salary of each player who is on a<br>
&emsp;&emsp;team that has beaten the “Wombats”.<br>
&emsp;σpnamesalaryPlayersawayTmG,((((∏   ∏   )   <br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;=∧\<HomeTmWombatsHomePts''   AwayPts<br>
&emsp;σHomeTmG((∏   ))))<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;=∧\<AwayTmWombatsAwayPts'   HomePts

&emsp;**b) \[4 points\]**  Write the query for part “a” in **Relational Calculus:**<br>
&emsp;∃∈∃∈=∧\<TPPlayersGGHomeTmWombatsGHomePtsGAwayPts{\|(1(.1''.1.1<br>
&emsp;∧=GAwayTmPTeam.1.<br>
&emsp;∧=∧=TPNamePPnameTSalaryPSalary....))<br>
&emsp;∨<br>
&emsp;∃∈=GGamesGAwayTmWombats(2(.2''<br>
&emsp;∧\>GHomePtsGAwayPts.2.2<br>
&emsp;∧=GHomeTmPTeam.2.<br>
&emsp;∧=TPnamePPname..<br>
&emsp;∧=TSalaryPSalary..))}

CS 186 Midterm     October 10, 2002        Page 5 of 13


---

<a id="page-6"></a>
**Page 6**

Name:\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_                  SID:\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_


### **Question 3 (continued)**

Recall the schema:  **TEAMS (TName, TCity);   PLAYERS (PName, Team, Salary)**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**GAMES (HomeTm, AwayTm, Date, HomePts, AwayPts)**<br>
&emsp;**c) \[4 points\] (Relational Algebra):** List the names of all the teams who have won every game<br>
&emsp;&emsp;that they have played at home.<br>
σ−TNameTeamsHomeTmG()(∏   ∏   )<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\<HomePtsAwayPts

&emsp;**d) \[4 points\]** Write the query for part “c” in **Relational Calculus.**<br>
∀∈=⇒\>TGGamesTTNameGHomeTmGHomePtsGAwayPts{\|(....)}

&emsp;**e) \[4 points\] (Relational Calculus)** List the names of all the teams who have hosted games<br>
&emsp;&emsp;against every team from Sydney.<br>
∀∈=⇒TTTeamsTTCitySydney{\|1(.1''<br>
∃∈=∧=GGamesGAwayTmTTNameTNameGHomeTm(..1..))}

.

CS 186 Midterm     October 10, 2002        Page 6 of 13


---

<a id="page-7"></a>
**Page 7**

Name:\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_                  SID:\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_


### **Question 4 – SQL  \[6  parts,  25 points total\]**

Consider the schema from question 3:<br>
**TEAMS (TName, TCity)**<br>
**PLAYERS (PName, Team,  Salary)** \[where Team is a foreign key referencing TEAMS\]<br>
**GAMES (HomeTm, AwayTm, Date, HomePts, AwayPts)**<br>
\[where HomeTm and AwayTm are foreign keys referencing TEAMS\]<br>
Express the following queries in SQL.<br>
&emsp;**a) \[3 points\]** List the player name, team name, and salary of each player who is on a team that has<br>
&emsp;&emsp;beaten the “Koalas” while playing at home.  The list should not contain duplicates.<br>
SELECT Distinct P.PName, P.Team, P.Salary<br>
FROM Players P, Games G<br>
WHERE<br>
G.HomeTm = P.Team<br>
AND G.AwayTm  = ‘Koalas’<br>
AND G.HomePts \> G.AwayPts

&emsp;**b) \[3 points\]** List the names of all the teams who have won every game that they have played at<br>
&emsp;&emsp;home.<br>
SELECT T.TName<br>
FROM Teams T<br>
WHERE NOT EXISTS<br>
(SELECT \*<br>
FROM Games G<br>
WHERE G.HomeTm = T.Tname<br>
AND G.AwayPts \> G.HomePts)

CS 186 Midterm     October 10, 2002        Page 7 of 13


---

<a id="page-8"></a>
**Page 8**

Name:\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_                  SID:\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_


### **Question 4 – SQL ( continued)**

Recall the schema:  **TEAMS (TName, TCity);   PLAYERS (PName, Team, Salary)**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**GAMES (HomeTm, AwayTm, Date, HomePts, AwayPts)**<br>
&emsp;**c) \[4 points\]** List the names of all the teams who have hosted games against every team from<br>
&emsp;&emsp;Sydney.<br>
SELECT Tname<br>
FROM Teams T<br>
WHERE NOT EXISTS((<br>
SELECT TName<br>
FROM Teams T2<br>
WHERE T2.TCity = ‘Sydney’)<br>
MINUS<br>
(SELECT AwayTM<br>
FROM Games G<br>
WHERE G.HomeTm = T.Tname))

&emsp;**d) \[4  points\]**  Print a list containing the team name, team city, number of players, and the total<br>
&emsp;&emsp;payroll (i.e., the sum of all the salaries), for each team that has more than 10 players.  Sort this<br>
&emsp;&emsp;list in decreasing order of total payroll.<br>
SELECT T.TName, T.TCity, COUNT(\*) as numPlayers, SUM(P.Salary) AS Payroll<br>
FROM TeamsT, Players P<br>
WHERE T.TName = P.Team<br>
GROUP BY TName, TCity<br>
HAVING numPlayers \> 10<br>
ORDER BY Payroll DESC

CS 186 Midterm     October 10, 2002        Page 8 of 13


---

<a id="page-9"></a>
**Page 9**

Name:\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_                  SID:\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_


### **Question 4 – SQL ( continued)**

Recall the schema:  **TEAMS (TName, TCity);   PLAYERS (PName, Team, Salary)**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**GAMES (HomeTm, AwayTm, Date, HomePts, AwayPts)**<br>
&emsp;**e) \[8  points\]**  Print the name of the team that has won the most home games. (Hint: you might<br>
&emsp;&emsp;find it easier if you use views).

CREATE VIEW HomeWins as<br>
SELECT HomeTm, COUNT(\*) as numWins<br>
FROM Games G<br>
WHERE G.HomePts \> G.AwayPts<br>
GROUP BY HomeTm

SELECT HomeTm<br>
FROM HomeWins H<br>
WHERE H.numWins = (SELECT MAX(numWins) FROM HomeWins)

&emsp;**f) \[ 3 points\]** Under what condition would “**TEAMS** LEFT OUTER JOIN **PLAYERS”** have<br>
&emsp;&emsp;higher cardinality (i.e., more tuples) than “**TEAMS** JOIN **PLAYERS**”?  (be concise – one<br>
&emsp;&emsp;sentence short sentence should suffice).<br>
If there are teams without players.

CS 186 Midterm     October 10, 2002        Page 9 of 13


---

<a id="page-10"></a>
**Page 10**

Name:\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_                  SID:\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_


### **Question 5 – Data Models \[ 4 parts, 20 total points\]**

&emsp;**b)  \[3  points\]** Draw an ER diagram for an ISA hierarchy in which there are at least two subtypes.<br>
&emsp;&emsp;Be sure that each of your entities has at least two attributes and indicate any keys.


![Figure on page 10](figures/solutions-p10-fig06.png)

&emsp;**c) \[ 4 points\]**  For the diagram you drew in the previous part, show two substantially different<br>
&emsp;&emsp;mappings of this into SQL DDL statements, and briefly describe the tradeoffs between these<br>
&emsp;&emsp;two.<br>
&emsp;1\) Requires joins to look at all accounts.<br>
&emsp;CREATE TABLE BankAccount(<br>
&emsp;AccountNum INTEGER PRIMARY KEY,<br>
&emsp;Balance FLOAT);

&emsp;CREATE TABLE SavingsAccount(<br>
&emsp;AccountNum INTEGER,<br>
&emsp;Interest FLOAT,<br>
&emsp;Date DATE,<br>
&emsp;PRIMARY KEY(AccountNum),<br>
&emsp;FOREIGN KEY (AccountNum) REFERENCES BankAccount);

CS 186 Midterm     October 10, 2002        Page 10 of 13


---

<a id="page-11"></a>
**Page 11**

Name:\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_                  SID:\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

&emsp;CREATE TABLE CheckingAccount(<br>
&emsp;AccountNum INTEGER,<br>
&emsp;ChecksWritten INTEGER,<br>
&emsp;MinBalance FLOAT,<br>
&emsp;PRIMARY KEY(AccountNum),<br>
&emsp;FOREIGN KEY (AccountNum) REFERENCES BankAccount);

&emsp;2\) Requires selects to look at specific types of accounts.<br>
&emsp;CREATE TABLE Accounts(<br>
&emsp;AccountNum INTEGER PRIMARY KEY, Balance FLOAT,<br>
&emsp;Type INTEGER,<br>
&emsp;Interest FLOAT, Date DATE,<br>
ChecksWritten INTEGER, MinBalance FLOAT);


### **Question 5 (continued)**

&emsp;**d) \[ 3 points\]** Briefly describe how relational “views” could help make query writing easier for the<br>
&emsp;&emsp;tables that result from one of your ISA mappings (tell us which one you’re using!).  Write one<br>
&emsp;&emsp;(or more if you need it) SQL Create View statement(s) to demonstrate this.<br>
&emsp;Easier to examine specific types of accounts by writing<br>
&emsp;CREATE VIEW SavingsAccounts AS<br>
&emsp;SELECT \* FROM Accounts WHERE type = 1;<br>
&emsp;CREATE VIEW CheckingAccounts AS<br>
&emsp;SELECT \* FROM Accounts WHERE type = 2;

&emsp;**e)  \[10 points\]  D**raw the ER diagram that represents the schema on the next page.  Be sure that all<br>
&emsp;&emsp;constraints, attributes, and keys in the DDL are shown in your diagram.  NOTE you may find it<br>
&emsp;&emsp;helpful to remove the last page so you can see the schema while you are drawing.  You may also<br>
&emsp;&emsp;want to practice on a different sheet so that your final answer is readable by the graders. **Be**<br>
&emsp;&emsp;**sure that your regular and bold lines are clearly distinguishable from eachother.**

CS 186 Midterm     October 10, 2002        Page 11 of 13


---

<a id="page-12"></a>
**Page 12**

Name:\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_                  SID:\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_


![Figure on page 12](figures/solutions-p12-fig07.png)

CS 186 Midterm     October 10, 2002        Page 12 of 13


---

<a id="page-13"></a>
**Page 13**


### **Question 5 (continued) (REMOVE THIS PAGE IF YOU LIKE)**

&emsp;&emsp;&emsp;`CREATE` `TABLE` `Agent` `(`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`AgentName` `varchar(50)` `PRIMARY` `KEY,`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`FeePct` `float);`

&emsp;&emsp;&emsp;`CREATE` `TABLE` `Star` `(`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`StarName` `varchar(50)` `PRIMARY` `KEY,`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`Eyecolor` `varchar(10)`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`AgentName` `varchar(50)`   `NOT` `NULL,`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`FOREIGN` `KEY` `(AgentName)` `REFERENCES` `Agent);`

&emsp;&emsp;&emsp;`CREATE` `TABLE` `Movie` `(`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`Title` `varchar(50),`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`Year` `integer,`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`PRIMARY` `KEY` `(Title,` `Year));`

&emsp;&emsp;&emsp;`CREATE` `TABLE` `StuntPerson` `(`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`SPName` `varchar(50)` `PRIMARY` `KEY,`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`SkillLevel` `integer);`

&emsp;&emsp;&emsp;`CREATE` `TABLE` `ActsIn` `(`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`StarName` `varchar(50),`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`Title` `varchar(50),`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`Year` `integer,`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`PRIMARY` `KEY` `(StarName,` `Title,` `Year),`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`FOREIGN` `KEY` `(StarName)` `REFERENCES` `Star,`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`FOREIGN` `KEY` `(Title,` `Year)` `REFERENCES` `Movie);`

&emsp;&emsp;&emsp;`CREATE` `TABLE` `DoublesFor` `(`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`SPName` `varchar(50),`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`StarName` `varchar(50),`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`Title` `varchar(50),`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`Year` `integer,`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`PRIMARY` `KEY` `(SPName,` `StarName,` `Title,` `Year),`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`FOREIGN` `KEY` `(SPName)` `REFERENCES` `StuntPerson,`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`FOREIGN` `KEY` `(StarName,` `Title,` `Year)` `REFERENCES` `ActsIn);`

