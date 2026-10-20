# Berkeley CS186 Fall 1998: Midterm 2: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/186>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS186<br>
CS186

Fall 1998

Midterm 2

J.Hellerstein

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Midterm Exam: Introduction to Database Systems**

This exam has four problems, for a total of 70 points. There are also 10 points of extra credit available. Each<br>
problem is made up of multiple questions. You should read through the exam quickly and plan your<br>
time-management accordingly. Before beginning to answer a question, be sure to read it carefully and to<br>
answer all parts of every question!

&emsp;**1. Cost Estimation**

Cage/Fish & Associates hires you to help keep track of their clients and cases. Theyre currently stored as 2<br>
relations (primary keys in **bold**)

`Clients(name,` `id``, birthday)`

`-5000 tuples, 50 bytes/tuple (2 tuples/page)`

`Cases(``caseid``, clientid, lawyer, courtdate)`

`-10,000 tuples, 2000 bytes/tuple, each attribute of the tupe is 500 bytes`<br>
`long. (2 tuples/page)`

Some additionaly notes on this schema:

&emsp;•   A page holds 4000 bytes<br>
&emsp;•   caseid has values ranging from 0 to 10,000<br>
&emsp;•   clientid has values ranging from 50 to 5050, and is a foreign key to Clients.<br>
&emsp;•   Unless stated otherwise, a B+Tree index is available on each of the primary keys.

&emsp;a. \[2 points\] Consider the following two queries:

&emsp;i. SELECT\* FROM Clients C WHERE C.birthday=4/25/77<br>
&emsp;ii. SELECT\* FROM Cases S WHERE S.lawyer=Georgia Thomas

&emsp;&emsp;Assume that the two queries return the same number of qualifying tuples. If youre building indexes on<br>
&emsp;&emsp;the selected attributed to speed up the queries, for which is a clustered index( as opposed to<br>
&emsp;&emsp;unclustered) more important, and why? Be sure to state any assumptions that you make.

&emsp;a. \[4 points\] Estimate the number of tuples that would pass the selection Cases.casesid = Cases.clientid.

&emsp;&emsp;What assumptions are you making in this approximation?

&emsp;b. \[9 points\] Assume that you have two indexes on Cases. The first is a clustered B+tree of height 2 on<br>
&emsp;&emsp;(lawyer, caseid), containing 201 pages (note that key compression makes this possible, even though

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1


---

<a id="page-2"></a>
**Page 2**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS186<br>
&emsp;&emsp;the keys themselves are 500 bytes long!). The second is an unclustered B+tree of height 2 on (caseid)<br>
&emsp;&emsp;containing 101 pages. Consider the query:

&emsp;&emsp;SELECT lawyer

&emsp;&emsp;FROM Cases

&emsp;&emsp;WHERE caseid \> 5000

&emsp;i. Using the clustered B+-tree, what is the cost of running this query?<br>
&emsp;ii. Using the unclustered B+tree, what is the cost of running this query?<br>
&emsp;iii. What would be the cost if you used the unclustered tree but sorted the rids of the matching tuples<br>
&emsp;&emsp;before fetching the tuples from the heap file? Assume that the rids fit in memory

**2) Query Processing**

Consider a system containing three join algorithms: (I) Block Nested Loops, (ii) Sort Merge and (iii) Hash<br>
Join.

&emsp;a. \[3 points\] For each of the join algorithms in the system, discuss how its performance is affected by<br>
&emsp;&emsp;skew in the data values of the join columns.<br>
&emsp;b. \[3 points\] For each of the join algorithms in the system, discuss how its performance is affected by<br>
&emsp;&emsp;making a major change in the size of only one input relation.<br>
&emsp;c. \[9 points\] Two relations R and S have sizes (in #pages) of M=500 and N=100, respectively. You are<br>
&emsp;&emsp;to perform an equijoin of R and S. Given B=12 buffers, how many I/Os would be required for each of<br>
&emsp;&emsp;the join algorithms in the system?

&emsp;**3. Query Optimization**

&emsp;a. \[6 points\] Assume you have a simple PC database system that contains only two join algorithms:<br>
&emsp;&emsp;simple nested-loops join, and index nested loops join. You have a database with the following schema<br>
&emsp;&emsp;(primary keys in **bold**):

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2


---

<a id="page-3"></a>
**Page 3**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS186<br>
`web_pages(``URL: text``, author: text, content:text, last_edited: date)`

`links(``from_URL: text, to_URL: text``, last_clicked: date)`

There is only one index, a B+tree on web\_pages.URL. Assuming the system uses a System-R style optimizer<br>
(i.e. the algorithm we learned in class), give three different query execution plans that it might produce for the<br>
following query. Each of your plans should have a different cost for a typical database (you need not write<br>
down the cost in your answer). Your answer can be three query plan trees, or three plans concisely described<br>
in English:

`SELECT URL, to_URL, last_clicked`

`FROM web_pages, links`

`WHERE URL = from_URL`

`AND author =` `Rasputin:`

•   \[9 points\] There are three parts of an SQL query that can cause a column ( or columns) to be considered an<br>
"interesting order". Briefly describe each of these, and for each one briefly explain why an ordered input can<br>
lower the cost of evaluating that part of the query.<br>
•   \[5 points\] Consider the following query:<br>
`SELECT *`

`FROM T`<br>
`WHERE W.URL =` `http://db.cs.berkeley.edu`

`AND EXISTS (SELECT *`

`FROM links L`

`WHERE L.last_clicked = w.last_edited);`

Describe in English 2 query plans for this query, and for each one describe how many times the links table is<br>
scanned.

•   **\[Extra Credit: 10 pts\]**<br>
Assume you have an SQL query of the following form:

`SELECT *`

`FROM T`

`WHERE EXISTS` `SubQuery1`

`AND EXISTS` `SubQuery2``;`

Assume that each subquery is correlated with T, and that there are no indexes in the system. Assum the<br>
optimizer has a built-in function call

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3


---

<a id="page-4"></a>
**Page 4**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS186<br>
`RF_Exists()` that can give an accurate reduction factor for an EXISTS clause. Given this information and what you know from<br>
class, can you describe how to choose the best plan for the query?

&emsp;**4. SQL**

A bookmaker (also known as a "bookie") is a person who takes bets on various sprting events. He determines<br>
odds on the outcome of these events, and collects and payrs off the bets made by others through him.

Bob is a bookie that doesnt really understand anything about sports or gambling; hence, he has a large<br>
customer base. His customer base is growing too large for him to handle his operation manually. Since he<br>
knows a little about databases, he decides to use a database to keep track of customer bets on sprting events,

Hoping eventually he will be able to bring his operation online.

He decides on the following schema for his initial database (primary keys are in **bold**, referential integrity to<br>
be enforced on all cross-table references):

`Customers(``c_id``: integer, name: string, loc: string, favorite_limb:`<br>
`string)`

This table contains the customers, their names, where they live, and their favorite limbs(if they cant pay their<br>
bets, Bob takes their favorite limb).

`Teams(``team_id``: integer, name: string, league: string, home: string)`

This table holds the teams Bob allows his customers to bet on. It contains name of the team, the league to<br>
which the team belongs, i.g. "NFL" or "NCAA", and the home location of the team.

`Games(``game_id``: integer, fav_team: integer, underdog_team: integer, date:,`<br>
`DATE, odds: float)`

This table holds the games Bob allows his customers to bet on. It contains a unique game\_id, the team\_id of<br>
the team from the Teams table favored to win (fav\_team), the team\_id of the opponent in the Teams table<br>
(underdog\_team), the date of the game, the odds for the game.

`Bets(``c_id``: integer, game_id: integer, pick: integer, betted_amount:`<br>
`float)`

This table contains the bets made by customers from the Customers table on specific games from the Games<br>
table. Each records the customers bet of an amount (betted\_amount) on a team they pick from the Teams table<br>
(pick).

The betting rules work as follows:

&emsp;•   Customers pay Bob the betted\_amount for each bet.<br>
&emsp;•   If a customoer bets on a game, and the team they betted for wins, and that team is the favorite team,<br>
&emsp;&emsp;then Bob gives the customer 2 times the betted\_amount.<br>
&emsp;•   If the customer bets on a game, and the team they betted for wins, and that team is the underdog, then<br>
&emsp;&emsp;Bob gives the customer betted\_amount + odds\*betted\_amount.<br>
&emsp;•   If the customer bets on a game, and the team they betted for loses, Bob keeps the betted\_amount.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4


---

<a id="page-5"></a>
**Page 5**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS186<br>
&emsp;•   **Note**

: the key of Bets is (c\_id, game\_id), so a customer can only bet once per game.

Assume there are no nulls in any tables of the database.

You need to help Bob figure out some of the SQL issues. Feel free to use views if they help you clarify your<br>
thinking (or Bobs)!

&emsp;a. \[4 points\] Write the SQL DLL for the Games table.<br>
&emsp;b. \[4 points\] Write an SQL query to find the names of teams that were picked to win in more than 50<br>
&emsp;&emsp;bets.<br>
&emsp;c. \[5 points\] Suppose that all the underdogs win. Write an SQL query to give they list of customers who<br>
&emsp;&emsp;lost all their bets. The list should contain customers names, locations, how much they owe, and their<br>
&emsp;&emsp;favorite limbs.<br>
&emsp;d. \[7 points\] Write an SQL integrity constraint that assures no team in the NFL league plays more than<br>
&emsp;&emsp;once a day.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;5

