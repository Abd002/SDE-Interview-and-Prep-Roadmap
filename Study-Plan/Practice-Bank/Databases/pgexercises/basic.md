# PostgreSQL Exercises: basic

> Copied from <https://pgexercises.com/questions/basic/>. Questions and answers are the source's own; nothing was answered or rewritten here.


Schema: ![Database schema](images/7672af674514.svg)

## 1. Retrieve everything from a table

How can you retrieve all the information from the cd.facilities table?

<details><summary>Expected results</summary>

| facid | name | membercost | guestcost | initialoutlay | monthlymaintenance |
| --- | --- | --- | --- | --- | --- |
| 0 | Tennis Court 1 | 5 | 25 | 10000 | 200 |
| 1 | Tennis Court 2 | 5 | 25 | 8000 | 200 |
| 2 | Badminton Court | 0 | 15.5 | 4000 | 50 |
| 3 | Table Tennis | 0 | 5 | 320 | 10 |
| 4 | Massage Room 1 | 35 | 80 | 4000 | 3000 |
| 5 | Massage Room 2 | 35 | 80 | 4000 | 3000 |
| 6 | Squash Court | 3.5 | 17.5 | 5000 | 80 |
| 7 | Snooker Table | 0 | 5 | 450 | 15 |
| 8 | Pool Table | 0 | 5 | 400 | 15 |

</details>

<details><summary>Official hint</summary>

select \*  can be used to retrieve all columns from a table.

</details>

<details><summary>Official answer and discussion</summary>

```sql
select * from cd.facilities;
```

The SELECT statement is the basic starting block for queries that read information out of the database. A minimal select statement is generally comprised of select [some set of columns] from [some table or group of tables].

In this case, we want all of the information from the facilities table. The from section is easy - we just need to specify the cd.facilities table. 'cd' is the table's schema - a term used for a logical grouping of related information in the database.

Next, we need to specify that we want all the columns. Conveniently, there's a shorthand for 'all columns' - \*. We can use this instead of laboriously specifying all the column names.

</details>

## 2. Retrieve specific columns from a table

You want to print out a list of all of the facilities and their cost to members. How would you retrieve a list of only facility names and costs?

<details><summary>Expected results</summary>

| name | membercost |
| --- | --- |
| Tennis Court 1 | 5 |
| Tennis Court 2 | 5 |
| Badminton Court | 0 |
| Table Tennis | 0 |
| Massage Room 1 | 35 |
| Massage Room 2 | 35 |
| Squash Court | 3.5 |
| Snooker Table | 0 |
| Pool Table | 0 |

</details>

<details><summary>Official hint</summary>

The select statement allows you to specify column names to retrieve.

</details>

<details><summary>Official answer and discussion</summary>

```sql
select name, membercost from cd.facilities;
```

For this question, we need to specify the columns that we want. We can do that with a simple comma-delimited list of column names specified to the select statement. All the database does is look at the columns available in the FROM clause, and return the ones we asked for, as illustrated below

![](../../assets/select.png "Specifying column names to a select statement")

Generally speaking, for non-throwaway queries it's considered desirable to specify the names of the columns you want in your queries rather than using \*. This is because your application might not be able to cope if more columns get added into the table.

</details>

## 3. Control which rows are retrieved

How can you produce a list of facilities that charge a fee to members?

<details><summary>Expected results</summary>

| facid | name | membercost | guestcost | initialoutlay | monthlymaintenance |
| --- | --- | --- | --- | --- | --- |
| 0 | Tennis Court 1 | 5 | 25 | 10000 | 200 |
| 1 | Tennis Court 2 | 5 | 25 | 8000 | 200 |
| 4 | Massage Room 1 | 35 | 80 | 4000 | 3000 |
| 5 | Massage Room 2 | 35 | 80 | 4000 | 3000 |
| 6 | Squash Court | 3.5 | 17.5 | 5000 | 80 |

</details>

<details><summary>Official hint</summary>

The WHERE clause allows you to filter the rows that you want to retrieve.

</details>

<details><summary>Official answer and discussion</summary>

```sql
select * from cd.facilities where membercost > 0;
```

The FROM clause is used to build up a set of candidate rows to read results from. In our examples so far, this set of rows has simply been the contents of a table. In future we will explore joining, which allows us to create much more interesting candidates.

Once we've built up our set of candidate rows, the WHERE clause allows us to filter for the rows we're interested in - in this case, those with a membercost of more than zero. As you will see in later exercises, WHERE clauses can have multiple components combined with boolean logic - it's possible to, for instance, search for facilities with a cost greater than 0 and less than 10. The filtering action of the WHERE clause on the facilities table is illustrated below:

![](../../assets/whereclause.png "Action of a WHERE clause on a set of candidate rows")

</details>

## 4. Control which rows are retrieved - part 2

How can you produce a list of facilities that charge a fee to members, and that fee is less than 1/50th of the monthly maintenance cost? Return the facid, facility name, member cost, and monthly maintenance of the facilities in question.

<details><summary>Expected results</summary>

| facid | name | membercost | monthlymaintenance |
| --- | --- | --- | --- |
| 4 | Massage Room 1 | 35 | 3000 |
| 5 | Massage Room 2 | 35 | 3000 |

</details>

<details><summary>Official hint</summary>

The WHERE clause allows you to filter the rows that you want to retrieve.

</details>

<details><summary>Official answer and discussion</summary>

```sql
select facid, name, membercost, monthlymaintenance 
	from cd.facilities 
	where 
		membercost > 0 and 
		(membercost < monthlymaintenance/50.0);
```

The WHERE clause allows us to filter for the rows we're interested in - in this case, those with a membercost of more than zero, and less than 1/50th of the monthly maintenance cost. As you can see, the massage rooms are very expensive to run thanks to staffing costs!

When we want to test for two or more conditions, we use AND to combine them. We can, as you might expect, use OR to test whether either of a pair of conditions is true.

You might have noticed that this is our first query that combines a WHERE clause with selecting specific columns. You can see in the image below the effect of this: the intersection of the selected columns and the selected rows gives us the data to return. This may not seem too interesting now, but as we add in more complex operations like joins later, you'll see the simple elegance of this behaviour.

![](../../assets/whereandselect.png "Specifying column names to a select statement")

</details>

## 5. Basic string searches

How can you produce a list of all facilities with the word 'Tennis' in their name?

<details><summary>Expected results</summary>

| facid | name | membercost | guestcost | initialoutlay | monthlymaintenance |
| --- | --- | --- | --- | --- | --- |
| 0 | Tennis Court 1 | 5 | 25 | 10000 | 200 |
| 1 | Tennis Court 2 | 5 | 25 | 8000 | 200 |
| 3 | Table Tennis | 0 | 5 | 320 | 10 |

</details>

<details><summary>Official hint</summary>

Try looking up the SQL LIKE operator.

</details>

<details><summary>Official answer and discussion</summary>

```sql
select *
	from cd.facilities 
	where 
		name like '%Tennis%';
```

SQL's LIKE operator provides simple pattern matching on strings. It's pretty much universally implemented, and is nice and simple to use - it just takes a string with the % character matching any string, and \_ matching any single character. In this case, we're looking for names containing the word 'Tennis', so putting a % on either side fits the bill.

There's other ways to accomplish this task: Postgres supports regular expressions with the ~ operator, for example. Use whatever makes you feel comfortable, but do be aware that the LIKE operator is much more portable between systems.

</details>

## 6. Matching against multiple possible values

How can you retrieve the details of facilities with ID 1 and 5? Try to do it without using the OR operator.

<details><summary>Expected results</summary>

| facid | name | membercost | guestcost | initialoutlay | monthlymaintenance |
| --- | --- | --- | --- | --- | --- |
| 1 | Tennis Court 2 | 5 | 25 | 8000 | 200 |
| 5 | Massage Room 2 | 35 | 80 | 4000 | 3000 |

</details>

<details><summary>Official hint</summary>

Try looking up the SQL IN operator.

</details>

<details><summary>Official answer and discussion</summary>

```sql
select *
	from cd.facilities 
	where 
		facid in (1,5);
```

The obvious answer to this question is to use a WHERE clause that looks like where facid = 1 or facid = 5. An alternative that is easier with large numbers of possible matches is the IN operator. The IN operator takes a list of possible values, and matches them against (in this case) the facid. If one of the values matches, the where clause is true for that row, and the row is returned.

The IN operator is a good early demonstrator of the elegance of the relational model. The argument it takes is not just a list of values - it's actually a table with a single column. Since queries also return tables, if you create a query that returns a single column, you can feed those results into an IN operator. To give a toy example:

</details>

## 7. Classify results into buckets

How can you produce a list of facilities, with each labelled as 'cheap' or 'expensive' depending on if their monthly maintenance cost is more than $100? Return the name and monthly maintenance of the facilities in question.

<details><summary>Expected results</summary>

| name | cost |
| --- | --- |
| Tennis Court 1 | expensive |
| Tennis Court 2 | expensive |
| Badminton Court | cheap |
| Table Tennis | cheap |
| Massage Room 1 | expensive |
| Massage Room 2 | expensive |
| Squash Court | cheap |
| Snooker Table | cheap |
| Pool Table | cheap |

</details>

<details><summary>Official hint</summary>

Try looking up the SQL CASE statement.

</details>

<details><summary>Official answer and discussion</summary>

```sql
select name, 
	case when (monthlymaintenance > 100) then
		'expensive'
	else
		'cheap'
	end as cost
	from cd.facilities;
```

This exercise contains a few new concepts. The first is the fact that we're doing computation in the area of the query between SELECT and FROM. Previously we've only used this to select columns that we want to return, but you can put anything in here that will produce a single result per returned row - including subqueries.

The second new concept is the CASE statement itself. CASE is effectively like if/switch statements in other languages, with a form as shown in the query. To add a 'middling' option, we would simply insert another when...then section.

Finally, there's the AS operator. This is simply used to label columns or expressions, to make them display more nicely or to make them easier to reference when used as part of a subquery.

</details>

## 8. Working with dates

How can you produce a list of members who joined after the start of September 2012?
Return the memid, surname, firstname, and joindate of the members in question.

<details><summary>Expected results</summary>

| memid | surname | firstname | joindate |
| --- | --- | --- | --- |
| 24 | Sarwin | Ramnaresh | 2012-09-01 08:44:42 |
| 26 | Jones | Douglas | 2012-09-02 18:43:05 |
| 27 | Rumney | Henrietta | 2012-09-05 08:42:35 |
| 28 | Farrell | David | 2012-09-15 08:22:05 |
| 29 | Worthington-Smyth | Henry | 2012-09-17 12:27:15 |
| 30 | Purview | Millicent | 2012-09-18 19:04:01 |
| 33 | Tupperware | Hyacinth | 2012-09-18 19:32:05 |
| 35 | Hunt | John | 2012-09-19 11:32:45 |
| 36 | Crumpet | Erica | 2012-09-22 08:36:38 |
| 37 | Smith | Darren | 2012-09-26 18:08:45 |

</details>

<details><summary>Official hint</summary>

Look up the SQL timestamp format, and remember that you can compare dates much like you would integer values.

</details>

<details><summary>Official answer and discussion</summary>

```sql
select memid, surname, firstname, joindate 
	from cd.members
	where joindate >= '2012-09-01';
```

This is our first look at SQL timestamps. They're formatted in descending order of magnitude: YYYY-MM-DD HH:MM:SS.nnnnnn. We can compare them just like we might a unix timestamp, although getting the differences between dates is a little more involved (and powerful!). In this case, we've just specified the date portion of the timestamp. This gets automatically cast by postgres into the full timestamp 2012-09-01 00:00:00.

</details>

## 9. Removing duplicates, and ordering results

How can you produce an ordered list of the first 10 surnames in the members table? The list must not contain duplicates.

<details><summary>Expected results</summary>

| surname |
| --- |
| Bader |
| Baker |
| Boothe |
| Butters |
| Coplin |
| Crumpet |
| Dare |
| Farrell |
| GUEST |
| Genting |

</details>

<details><summary>Official hint</summary>

Look up the SQL keywords DISTINCT, ORDER BY, and LIMIT.

</details>

<details><summary>Official answer and discussion</summary>

```sql
select distinct surname 
	from cd.members
order by surname
limit 10;
```

There's three new concepts here, but they're all pretty simple.

- Specifying DISTINCT after SELECT removes duplicate rows from the result set. Note that this applies to *rows*: if row A has multiple columns, row B is only equal to it if the values in all columns are the same. As a general rule, don't use DISTINCT in a willy-nilly fashion - it's not free to remove duplicates from large query result sets, so do it as-needed.- Specifying ORDER BY (after the FROM and WHERE clauses, near the end of the query) allows results to be ordered by a column or set of columns (comma separated).- The LIMIT keyword allows you to limit the number of results retrieved. This is useful for getting results a page at a time, and can be combined with the OFFSET keyword to get following pages. This is the same approach used by MySQL and is very convenient - you may, unfortunately, find that this process is a little more complicated in other DBs.

</details>

## 10. Combining results from multiple queries

You, for some reason, want a combined list of all surnames and all facility names. Yes, this is a contrived example :-). Produce that list!

<details><summary>Expected results</summary>

| surname |
| --- |
| Tennis Court 2 |
| Worthington-Smyth |
| Badminton Court |
| Pinker |
| Dare |
| Bader |
| Mackenzie |
| Crumpet |
| Massage Room 1 |
| Squash Court |
| Tracy |
| Hunt |
| Tupperware |
| Smith |
| Butters |
| Rownam |
| Baker |
| Genting |
| Purview |
| Coplin |
| Massage Room 2 |
| Joplette |
| Stibbons |
| Rumney |
| Pool Table |
| Sarwin |
| Boothe |
| Farrell |
| Tennis Court 1 |
| Snooker Table |
| Owen |
| Table Tennis |
| GUEST |
| Jones |

</details>

<details><summary>Official hint</summary>

Look up the SQL keyword UNION

</details>

<details><summary>Official answer and discussion</summary>

```sql
select surname 
	from cd.members
union
select name
	from cd.facilities;
```

The UNION operator does what you might expect: combines the results of two SQL queries into a single table. The caveat is that both results from the two queries must have the same number of columns and compatible data types.

UNION removes duplicate rows, while UNION ALL does not. Use UNION ALL by default, unless you care about duplicate results.

</details>

## 11. Simple aggregation

You'd like to get the signup date of your last member. How can you retrieve this information?

<details><summary>Expected results</summary>

| latest |
| --- |
| 2012-09-26 18:08:45 |

</details>

<details><summary>Official hint</summary>

Look up the SQL aggregate function MAX

</details>

<details><summary>Official answer and discussion</summary>

```sql
select max(joindate) as latest
	from cd.members;
```

This is our first foray into SQL's aggregate functions. They're used to extract information about whole groups of rows, and allow us to easily ask questions like:

- What's the most expensive facility to maintain on a monthly basis?- Who has recommended the most new members?- How much time has each member spent at our facilities?

The MAX aggregate function here is very simple: it receives all the possible values for joindate, and outputs the one that's biggest. There's a lot more power to aggregate functions, which you will come across in future exercises.

</details>

## 12. More aggregation

You'd like to get the first and last name of the last member(s) who signed up - not just the date. How can you do that?

<details><summary>Expected results</summary>

| firstname | surname | joindate |
| --- | --- | --- |
| Darren | Smith | 2012-09-26 18:08:45 |

</details>

<details><summary>Official hint</summary>

You may find you need a subquery to get this done - although other methods exist!

</details>

<details><summary>Official answer and discussion</summary>

```sql
select firstname, surname, joindate
	from cd.members
	where joindate = 
		(select max(joindate) 
			from cd.members);
```

In the suggested approach above, you use a *subquery* to find out what the most recent joindate is. This subquery returns a *scalar* table - that is, a table with a single column and a single row. Since we have just a single value, we can substitute the subquery anywhere we might put a single constant value. In this case, we use it to complete the WHERE clause of a query to find a given member.

You might hope that you'd be able to do something like below:

</details>
