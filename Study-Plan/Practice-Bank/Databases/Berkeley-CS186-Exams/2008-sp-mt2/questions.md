# Berkeley CS186 Spring 2008: Midterm 2: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/186>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Class Account: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;UNIVERSITY OF CALIFORNIA<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Department of EECS, Computer Science Division<br>
CS186                                 Bohannon/Cooper<br>
Spring 2008<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**Second Exam: Introduction to Database Systems**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**April 15, 2008**<br>
**Instructions:**<br>
&emsp;1\. Write your name on each page.<br>
&emsp;2\. Turn in your notes page with your test.<br>
&emsp;3\. There are 60 points total.<br>
&emsp;4\. Please read over the test and plan your time.  Best to skip and go back if<br>
&emsp;&emsp;you are stuck on a question. The points assigned to each question reflect<br>
&emsp;&emsp;our estimate of the time to answer that question, so use the point<br>
&emsp;&emsp;allocations to plan your time.

&emsp;**1. SQL (18 points)**<br>
Consider the following relations:<br>
ComicBooks(Title,PubDate,IssueNumber,Price)<br>
Publishers(Name,Address)<br>
PublishedBy(Title,PublisherName)<br>
Characters(Name,GoodOrEvil,Superpowers, Mentor)<br>
StarOf(CharacterName,BookTitle)<br>
AppearsIn(CharacterName,BookTitle,PubDate)<br>
&emsp;• Primary key of ComicBooks is (Title, Pubdate)<br>
&emsp;• Primary key of Publishers is (Name)<br>
&emsp;• Primary key of Characters is (Name)<br>
&emsp;• In PublishedBy, Title is a foreign key referencing ComicBooks(Title), and<br>
&emsp;&emsp;PublisherName is a foreign key referencing Publishers(Name)<br>
&emsp;• In Characters, Mentor is a foreign key referencing Characters(Name)<br>
&emsp;• In StarOf, CharacterName is a foreign key referencing Characters(Name), and<br>
&emsp;&emsp;BookTitle is a foreign key referencing ComicBooks(Title)<br>
&emsp;• In AppearsIn, (BookTitle,PubDate) is a foreign key referencing<br>
&emsp;&emsp;ComicBooks(Title,PubDate) and CharacterName is a foreign key referencing<br>
&emsp;&emsp;Characters(Name)<br>
In this question, excessively complex SQL will be penalized.


---

<a id="page-2"></a>
**Page 2**

a. Write a SQL query to find the issue number of all comic books with title “Superman”<br>
that “Superwoman” appears in.

b. Write a SQL query to find, for each character who appears in comic books with title<br>
“Batman” or “Dark Knight”, how many times they appeared altogether in those comic<br>
books.


---

<a id="page-3"></a>
**Page 3**

c. Write a SQL query to find the average price of issues of comic books published by<br>
each publisher, but counting only comic book titles that have at least 5 issues.

d. Write a SQL query to find all pairs of characters that have a common mentor. Be sure<br>
to exclude trivial pairs like (Superman,Superman).


---

<a id="page-4"></a>
**Page 4**

&emsp;&emsp;**2. Query processing (18 points)**<br>
Consider the following schema:<br>
LibraryBooks(ISBN, Title, Author, Branch)<br>
Patrons(CardNumber, Name, Address, City, State, ZipCode)<br>
CheckedOut(CardNumber, ISBN, DueDate)<br>
&emsp;&emsp;a. The DBMS optimizer is considering two plans for the following query:<br>
SELECT Title, Author, Name<br>
FROM LibraryBooks, Patrons, CheckedOut<br>
WHERE LibraryBooks.ISBN = CheckedOut.ISBN<br>
AND Patrons.CardNumber = CheckedOut.CardNumber<br>
AND Branch=’Central’<br>
AND DueDate\>Now;<br>
Assume “Now” is a special value that always evaluates to, well, now. The two plans are:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Plan A    Plan B


![Figure on page 4](figures/questions-p04-fig01.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Projection(Title,Author,Name)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Selection<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;(Branch=Central)


![Figure on page 4](figures/questions-p04-fig02.png)


---

<a id="page-5"></a>
**Page 5**

a.1 Assuming you have no statistics and know nothing about the contents of each<br>
relation, which plan is likely to cost less? Why?

a.2 Assume now that you have the following statistics:<br>
&emsp;• LibraryBooks contains 10,000,000 tuples<br>
&emsp;• There are 10 different values for the Branch attribute of LibraryBooks<br>
&emsp;• There are 100,000 Patrons tuples<br>
&emsp;• There are 100,000 CheckedOut tuples<br>
&emsp;• Only 5% of checked out books are overdue on average<br>
Is the same plan you chose in part a.1 likely to be the cheapest? Why or why not?

a.3 Is a real cost-based optimizer likely to choose one of these two plans? Why or why<br>
not?


---

<a id="page-6"></a>
**Page 6**

a.4 Two possible join orders for this query are ((LibraryBooks JOIN CheckedOut) JOIN<br>
Patrons) and (LibraryBooks JOIN (CheckedOut JOIN Patrons)). If we had excellent<br>
estimates of selectivity (but not necessarily of relation sizes), how would we use that<br>
information to decide between the two join orders?

b. We usually prefer to use pipelining when evaluating plans.<br>
b.1 What are two advantages to fully pipelined plans?

b.2 Can we use a sort-merge join in a fully pipelined plan? Why or why not?

c. Some optimizers only consider left-deep plans. What are the advantages and<br>
disadvantages of doing this?


---

<a id="page-7"></a>
**Page 7**

&emsp;**3. Functional dependencies and normalization (12 points)**<br>
a. Consider a relation with the following schema and functional dependencies:<br>
Tests(PatientID, DoctorID, TestDate, Type, Lab, Technician, Fee, ResultDate, Status);<br>
PatientID, DoctorID → TestDate<br>
PatientID, TestDate, Type → Lab<br>
Technician  → Lab<br>
Type  → Fee<br>
PatientID, TestDate, Type  → ResultDate, Status<br>
a.1 Is this relation in BCNF? Why or why not?

b. Consider a relation with the following schema and functional dependencies:<br>
AstronomicalObjects(MessierNumber, CommonName, Coordinates, Type, Distance,<br>
Galaxy)<br>
MessierNumber  → CommonName<br>
CommonName  → Coordinates, Type<br>
MessierNumber  → Distance<br>
CommonName  → MessierNumber, Galaxy<br>
b.1 What are the candidate keys for this relation? Also, give at least one superkey.


---

<a id="page-8"></a>
**Page 8**

b.2 Is this relation in BCNF? Is it in 3NF? Why or why not?

c. Consider a relation with the following schema and functional dependencies:<br>
Recipes(Title, Genre, PreparationTime, Author, EstimatedCost)<br>
Title → Genre<br>
Title, Author → PreparationTime, EstimatedCost<br>
c.1 Which attributes of the relation are prime? Why?

c.2 Is the relation in 3NF? Why or why not?


---

<a id="page-9"></a>
**Page 9**

d. Consider the following relation instance:


![Figure on page 9](figures/questions-p09-fig03.png)

d.1 What functional dependencies exist for this relation? What are the candidate keys of<br>
the relation?

&emsp;**4. Physical design (7 points)**<br>
Consider the following relation schema:<br>
UserProfiles(UserId, PasswordHash, RealName, ZipCode, Preferences, Avatar,<br>
LoginStatus) – PrimaryKey(UserID)<br>
Friends(UserId1, UserId2)<br>
Posts(UserId, Topic, Subject, Text, Date)<br>
The most frequent operations against this database are:<br>
i. Users log in, requiring a lookup of UserProfiles, at a rate of 1,000 per second<br>
ii. Users check to see the LoginStatus of their friends, requiring a join of Friends and<br>
&emsp;UserProfiles, at a rate of 10,000 per second<br>
iii. New users are added to UserProfiles, at a rate of 1 per second<br>
iv. Users enter new posts, inserting tuples into Posts, at a rate of 100 per second<br>
v. Users view the subjects of the posts for a topic on a given day, at the rate of 1,000<br>
&emsp;per second


---

<a id="page-10"></a>
**Page 10**

&emsp;a. If we only create one index for UserProfiles, what should the index be on? Why?<br>
&emsp;&emsp;Should it be clustering?

&emsp;b. Should we create an index for Posts? If so, what attribute or attributes should it be<br>
&emsp;&emsp;on? If multiple attributes, what order should they be in? If we should not create an<br>
&emsp;&emsp;index, why not?

&emsp;**5. Transactions (5 points)**<br>
An ACID transaction would permit the following situations (mark True or False for<br>
each):<br>
&emsp;a. \_\_\_\_\_ After a failure, an uncommitted transaction is rolled back and all of its<br>
&emsp;&emsp;effects are erased.<br>
&emsp;b. \_\_\_\_\_ After a failure, a committed transaction is rolled back and all of its effects<br>
&emsp;&emsp;are erased.<br>
&emsp;c. \_\_\_\_\_ Two transactions update the same tuple and then commit, and the effects of<br>
&emsp;&emsp;both transactions are visible afterwards.<br>
&emsp;d. \_\_\_\_\_ An unserializable schedule is executed.<br>
&emsp;e. \_\_\_\_\_ A transaction reads the same tuple twice without writing it in between and<br>
&emsp;&emsp;sees two different values.

