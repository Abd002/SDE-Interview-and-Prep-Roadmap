# PostgreSQL Exercises: aggregates

> Copied from <https://pgexercises.com/questions/aggregates/>. Questions and answers are the source's own; nothing was answered or rewritten here.


Schema: ![Database schema](images/7672af674514.svg)

## 1. Count the number of facilities

For our first foray into aggregates, we're going to stick to something simple. We want to know how many facilities exist - simply produce a total count.

<details><summary>Expected results</summary>

| count |
| --- |
| 9 |

</details>

<details><summary>Official hint</summary>

Try investigating the SQL COUNT function

</details>

<details><summary>Official answer and discussion</summary>

```sql
select count(*) from cd.facilities;
```

Aggregation starts out pretty simply! The SQL above selects everything from our facilities table, and then counts the number of rows in the result set. The count function has a variety of uses:

- COUNT(\*) simply returns the number of rows- COUNT(address) counts the number of non-null addresses in the result set.- Finally, COUNT(DISTINCT address) counts the number of *different* addresses in the facilities table.

The basic idea of an aggregate function is that it takes in a column of data, performs some function upon it, and outputs a *scalar* (single) value. There are a bunch more aggregation functions, including MAX, MIN, SUM, and AVG. These all do pretty much what you'd expect from their names :-).

One aspect of aggregate functions that people often find confusing is in queries like the below:

</details>

## 2. Count the number of expensive facilities

Produce a count of the number of facilities that have a cost to guests of 10 or more.

<details><summary>Expected results</summary>

| count |
| --- |
| 6 |

</details>

<details><summary>Official hint</summary>

You'll need to add a WHERE clause to the answer of the previous question.

</details>

<details><summary>Official answer and discussion</summary>

```sql
select count(*) from cd.facilities where guestcost >= 10;
```

This one is only a simple modification to the previous question: we need to weed out the inexpensive facilities. This is easy to do using a WHERE clause. Our aggregation can now only see the expensive facilities.

</details>

## 3. Count the number of recommendations each member makes.

Produce a count of the number of recommendations each member has made. Order by member ID.

<details><summary>Expected results</summary>

| recommendedby | count |
| --- | --- |
| 1 | 5 |
| 2 | 3 |
| 3 | 1 |
| 4 | 2 |
| 5 | 1 |
| 6 | 1 |
| 9 | 2 |
| 11 | 1 |
| 13 | 2 |
| 15 | 1 |
| 16 | 1 |
| 20 | 1 |
| 30 | 1 |

</details>

<details><summary>Official hint</summary>

Try investigating GROUP BY with your count this time. Don't forget to filter out null recommenders!

</details>

<details><summary>Official answer and discussion</summary>

```sql
select recommendedby, count(*) 
	from cd.members
	where recommendedby is not null
	group by recommendedby
order by recommendedby;
```

Previously, we've seen that aggregation functions are applied to a column of values, and convert them into an aggregated scalar value. This is useful, but we often find that we don't want just a single aggregated result: for example, instead of knowing the total amount of money the club has made this month, I might want to know how much money each different facility has made, or which times of day were most lucrative.

In order to support this kind of behaviour, SQL has the GROUP BY construct. What this does is batch the data together into groups, and run the aggregation function separately for each group. When you specify a GROUP BY, the database produces an aggregated value for each distinct value in the supplied columns. In this case, we're saying 'for each distinct value of recommendedby, get me the number of times that value appears'.

</details>

## 4. List the total slots booked per facility

Produce a list of the total number of slots booked per facility. For now, just produce an output table consisting of facility id and slots, sorted by facility id.

<details><summary>Expected results</summary>

| facid | Total Slots |
| --- | --- |
| 0 | 1320 |
| 1 | 1278 |
| 2 | 1209 |
| 3 | 830 |
| 4 | 1404 |
| 5 | 228 |
| 6 | 1104 |
| 7 | 908 |
| 8 | 911 |

</details>

<details><summary>Official hint</summary>

For this one you'll need to check out the SUM aggregate function.

</details>

<details><summary>Official answer and discussion</summary>

```sql
select facid, sum(slots) as "Total Slots"
	from cd.bookings
	group by facid
order by facid;
```

Other than the fact that we've introduced the SUM aggregate function, there's not a great deal to say about this exercise. For each distinct facility id, the SUM function adds together everything in the slots column.

</details>

## 5. List the total slots booked per facility in a given month

Produce a list of the total number of slots booked per facility in the month of September 2012. Produce an output table consisting of facility id and slots, sorted by the number of slots.

<details><summary>Expected results</summary>

| facid | Total Slots |
| --- | --- |
| 5 | 122 |
| 3 | 422 |
| 7 | 426 |
| 8 | 471 |
| 6 | 540 |
| 2 | 570 |
| 1 | 588 |
| 0 | 591 |
| 4 | 648 |

</details>

<details><summary>Official hint</summary>

You can restrict the data that goes into your aggregate functions using the WHERE clause.

</details>

<details><summary>Official answer and discussion</summary>

```sql
select facid, sum(slots) as "Total Slots"
	from cd.bookings
	where
		starttime >= '2012-09-01'
		and starttime < '2012-10-01'
	group by facid
order by sum(slots);
```

This is only a minor alteration of our previous example. Remember that aggregation happens after the WHERE clause is evaluated: we thus use the WHERE to restrict the data we aggregate over, and our aggregation only sees data from a single month.

</details>

## 6. List the total slots booked per facility per month

Produce a list of the total number of slots booked per facility per month in the year of 2012. Produce an output table consisting of facility id and slots, sorted by the id and month.

<details><summary>Expected results</summary>

| facid | month | Total Slots |
| --- | --- | --- |
| 0 | 7 | 270 |
| 0 | 8 | 459 |
| 0 | 9 | 591 |
| 1 | 7 | 207 |
| 1 | 8 | 483 |
| 1 | 9 | 588 |
| 2 | 7 | 180 |
| 2 | 8 | 459 |
| 2 | 9 | 570 |
| 3 | 7 | 104 |
| 3 | 8 | 304 |
| 3 | 9 | 422 |
| 4 | 7 | 264 |
| 4 | 8 | 492 |
| 4 | 9 | 648 |
| 5 | 7 | 24 |
| 5 | 8 | 82 |
| 5 | 9 | 122 |
| 6 | 7 | 164 |
| 6 | 8 | 400 |
| 6 | 9 | 540 |
| 7 | 7 | 156 |
| 7 | 8 | 326 |
| 7 | 9 | 426 |
| 8 | 7 | 117 |
| 8 | 8 | 322 |
| 8 | 9 | 471 |

</details>

<details><summary>Official hint</summary>

Take a look at the EXTRACT function.

</details>

<details><summary>Official answer and discussion</summary>

```sql
select facid, extract(month from starttime) as month, sum(slots) as "Total Slots"
	from cd.bookings
	where extract(year from starttime) = 2012
	group by facid, month
order by facid, month;
```

The main piece of new functionality in this question is the EXTRACT function. EXTRACT allows you to get individual components of a timestamp, like day, month, year, etc. We group by the output of this function to provide per-month values. An alternative, if we needed to distinguish between the same month in different years, is to make use of the DATE\_TRUNC function, which truncates a date to a given granularity. It's also worth noting that this is the first time we've truly made use of the ability to group by more than one column.

One thing worth considering with this answer: the use of the EXTRACT function in the WHERE clause has the potential to cause severe issues with performance on larger tables. If the timestamp column has a regular index on it, Postgres will not understand that it can use the index to speed up the query and will instead have to scan through the whole table. You've got a couple of options here:

- Consider creating an [expression-based index](https://www.postgresql.org/docs/current/indexes-expressional.html) on the timestamp column. With appropriately specified indexes Postgres can use indexes to speed up WHERE clauses containing function calls.- Alter the query to be a little more verbose, but use more standard comparisons, for example:

</details>

## 7. Find the count of members who have made at least one booking

Find the total number of members (including guests) who have made at least one booking.

<details><summary>Expected results</summary>

| count |
| --- |
| 30 |

</details>

<details><summary>Official hint</summary>

Take a look at COUNT DISTINCT

</details>

<details><summary>Official answer and discussion</summary>

```sql
select count(distinct memid) from cd.bookings
```

Your first instinct may be to go for a subquery here. Something like the below:

</details>

## 8. List facilities with more than 1000 slots booked

Produce a list of facilities with more than 1000 slots booked. Produce an output table consisting of facility id and slots, sorted by facility id.

<details><summary>Expected results</summary>

| facid | Total Slots |
| --- | --- |
| 0 | 1320 |
| 1 | 1278 |
| 2 | 1209 |
| 4 | 1404 |
| 6 | 1104 |

</details>

<details><summary>Official hint</summary>

Try investigating the HAVING clause.

</details>

<details><summary>Official answer and discussion</summary>

```sql
select facid, sum(slots) as "Total Slots"
        from cd.bookings
        group by facid
        having sum(slots) > 1000
        order by facid
```

It turns out that there's actually an SQL keyword designed to help with the filtering of output from aggregate functions. This keyword is HAVING.

The behaviour of HAVING is easily confused with that of WHERE. The best way to think about it is that in the context of a query with an aggregate function, WHERE is used to filter what data gets input into the aggregate function, while HAVING is used to filter the data once it is output from the function. Try experimenting to explore this difference!

</details>

## 9. Find the total revenue of each facility

Produce a list of facilities along with their total revenue. The output table should consist of facility name and revenue, sorted by revenue. Remember that there's a different cost for guests and members!

<details><summary>Expected results</summary>

| name | revenue |
| --- | --- |
| Table Tennis | 180 |
| Snooker Table | 240 |
| Pool Table | 270 |
| Badminton Court | 1906.5 |
| Squash Court | 13468.0 |
| Tennis Court 1 | 13860 |
| Tennis Court 2 | 14310 |
| Massage Room 2 | 15810 |
| Massage Room 1 | 72540 |

</details>

<details><summary>Official hint</summary>

Remember the CASE statement!

</details>

<details><summary>Official answer and discussion</summary>

```sql
select facs.name, sum(slots * case
			when memid = 0 then facs.guestcost
			else facs.membercost
		end) as revenue
	from cd.bookings bks
	inner join cd.facilities facs
		on bks.facid = facs.facid
	group by facs.name
order by revenue;
```

The only real complexity in this query is that guests (member ID 0) have a different cost to everyone else. We use a case statement to produce the cost for each session, and then sum each of those sessions, grouped by facility.

</details>

## 10. Find facilities with a total revenue less than 1000

Produce a list of facilities with a total revenue less than 1000. Produce an output table consisting of facility name and revenue, sorted by revenue. Remember that there's a different cost for guests and members!

<details><summary>Expected results</summary>

| name | revenue |
| --- | --- |
| Table Tennis | 180 |
| Snooker Table | 240 |
| Pool Table | 270 |

</details>

<details><summary>Official hint</summary>

You may find HAVING difficult to use here. Try a subquery instead. You'll probably also need a CASE statement.

</details>

<details><summary>Official answer and discussion</summary>

```sql
select name, revenue from (
	select facs.name, sum(case 
				when memid = 0 then slots * facs.guestcost
				else slots * membercost
			end) as revenue
		from cd.bookings bks
		inner join cd.facilities facs
			on bks.facid = facs.facid
		group by facs.name
	) as agg where revenue < 1000
order by revenue;
```

You may well have tried to use the HAVING keyword we introduced in an earlier exercise, producing something like below:

</details>

## 11. Output the facility id that has the highest number of slots booked

Output the facility id that has the highest number of slots booked. For bonus points, try a version without a LIMIT clause. This version will probably look messy!

<details><summary>Expected results</summary>

| facid | Total Slots |
| --- | --- |
| 4 | 1404 |

</details>

<details><summary>Official hint</summary>

Consider the use of the LIMIT keyword combined with ORDER BY. For the LIMIT-less version, you'll probably want to investigate the HAVING keyword. Be aware that the latter version is difficult!

</details>

<details><summary>Official answer and discussion</summary>

```sql
select facid, sum(slots) as "Total Slots"
	from cd.bookings
	group by facid
order by sum(slots) desc
LIMIT 1;
```

Let's start off with what's arguably the simplest way to do this: produce a list of facility IDs and the total number of slots used, order by the total number of slots used, and pick only the top result.

It's worth realising, though, that this method has a significant weakness. In the event of a tie, we will still only get one result! To get all the relevant results, we might try using the MAX aggregate function, something like below:

</details>

## 12. List the total slots booked per facility per month, part 2

Produce a list of the total number of slots booked per facility per month in the year of 2012. In this version, include output rows containing totals for all months per facility, and a total for all months for all facilities. The output table should consist of facility id, month and slots, sorted by the id and month. When calculating the aggregated values for all months and all facids, return null values in the month and facid columns.

<details><summary>Expected results</summary>

| facid | month | slots |
| --- | --- | --- |
| 0 | 7 | 270 |
| 0 | 8 | 459 |
| 0 | 9 | 591 |
| 0 |  | 1320 |
| 1 | 7 | 207 |
| 1 | 8 | 483 |
| 1 | 9 | 588 |
| 1 |  | 1278 |
| 2 | 7 | 180 |
| 2 | 8 | 459 |
| 2 | 9 | 570 |
| 2 |  | 1209 |
| 3 | 7 | 104 |
| 3 | 8 | 304 |
| 3 | 9 | 422 |
| 3 |  | 830 |
| 4 | 7 | 264 |
| 4 | 8 | 492 |
| 4 | 9 | 648 |
| 4 |  | 1404 |
| 5 | 7 | 24 |
| 5 | 8 | 82 |
| 5 | 9 | 122 |
| 5 |  | 228 |
| 6 | 7 | 164 |
| 6 | 8 | 400 |
| 6 | 9 | 540 |
| 6 |  | 1104 |
| 7 | 7 | 156 |
| 7 | 8 | 326 |
| 7 | 9 | 426 |
| 7 |  | 908 |
| 8 | 7 | 117 |
| 8 | 8 | 322 |
| 8 | 9 | 471 |
| 8 |  | 910 |
|  |  | 9191 |

</details>

<details><summary>Official hint</summary>

Look up Postgres' ROLLUP operator.

</details>

<details><summary>Official answer and discussion</summary>

```sql
select facid, extract(month from starttime) as month, sum(slots) as slots
	from cd.bookings
	where
		starttime >= '2012-01-01'
		and starttime < '2013-01-01'
	group by rollup(facid, month)
order by facid, month;
```

When we are doing data analysis, we sometimes want to perform multiple levels of aggregation to allow ourselves to 'zoom' in and out to different depths. In this case, we might be looking at each facility's overall usage, but then want to dive in to see how they've performed on a per-month basis. Using the SQL we know so far, it's quite cumbersome to produce a single query that does what we want - we effectively have to resort to concatenating multiple queries using UNION ALL:

</details>

## 13. List the total hours booked per named facility

Produce a list of the total number of *hours* booked per facility, remembering that a slot lasts half an hour. The output table should consist of the facility id, name, and hours booked, sorted by facility id. Try formatting the hours to two decimal places.

<details><summary>Expected results</summary>

| facid | name | Total Hours |
| --- | --- | --- |
| 0 | Tennis Court 1 | 660.00 |
| 1 | Tennis Court 2 | 639.00 |
| 2 | Badminton Court | 604.50 |
| 3 | Table Tennis | 415.00 |
| 4 | Massage Room 1 | 702.00 |
| 5 | Massage Room 2 | 114.00 |
| 6 | Squash Court | 552.00 |
| 7 | Snooker Table | 454.00 |
| 8 | Pool Table | 455.50 |

</details>

<details><summary>Official hint</summary>

Remember that in Postgres, dividing two integers together causes an integer division. Here you want a floating point division. For formatting the hours, take a look at the to\_char function, remembering to trim any leftover whitespace

</details>

<details><summary>Official answer and discussion</summary>

```sql
select facs.facid, facs.name,
	trim(to_char(sum(bks.slots)/2.0, '9999999999999999D99')) as "Total Hours"

	from cd.bookings bks
	inner join cd.facilities facs
		on facs.facid = bks.facid
	group by facs.facid, facs.name
order by facs.facid;
```

There's a few little pieces of interest in this question. Firstly, you can see that our aggregation works just fine when we join to another table on a 1:1 basis. Also note that we group by both facs.facid and facs.name. This is might seem odd: after all, since facid is the primary key of the facilities table, each facid has exactly one name, and grouping by both fields is the same as grouping by facid alone. In fact, you'll find that if you remove facs.name from the GROUP BY clause, the query works just fine: Postgres works out that this 1:1 mapping exists, and doesn't insist that we group by both columns.

Unfortunately, depending on which database system we use, validation might not be so smart, and may not realise that the mapping is strictly 1:1. That being the case, if there were multiple names for each facid and we hadn't grouped by name, the DBMS would have to choose between multiple (equally valid) choices for the name. Since this is invalid, the database system will insist that we group by both fields. In general, I recommend grouping by all columns you don't have an aggregate function on: this will ensure better cross-platform compatibility.

Next up is the division. Those of you familiar with MySQL may be aware that integer divisions are automatically cast to floats. Postgres is a little more traditional in this respect, and expects you to tell it if you want a floating point division. You can do that easily in this case by dividing by 2.0 rather than 2.

Finally, let's take a look at formatting. The TO\_CHAR function converts values to character strings. It takes a formatting string, which we specify as (up to) lots of numbers before the decimal place, decimal place, and two numbers after the decimal place. The output of this function can be prepended with a space, which is why we include the outer TRIM function.

</details>

## 14. List each member's first booking after September 1st 2012

Produce a list of each member name, id, and their first booking after September 1st 2012. Order by member ID.

<details><summary>Expected results</summary>

| surname | firstname | memid | starttime |
| --- | --- | --- | --- |
| GUEST | GUEST | 0 | 2012-09-01 08:00:00 |
| Smith | Darren | 1 | 2012-09-01 09:00:00 |
| Smith | Tracy | 2 | 2012-09-01 11:30:00 |
| Rownam | Tim | 3 | 2012-09-01 16:00:00 |
| Joplette | Janice | 4 | 2012-09-01 15:00:00 |
| Butters | Gerald | 5 | 2012-09-02 12:30:00 |
| Tracy | Burton | 6 | 2012-09-01 15:00:00 |
| Dare | Nancy | 7 | 2012-09-01 12:30:00 |
| Boothe | Tim | 8 | 2012-09-01 08:30:00 |
| Stibbons | Ponder | 9 | 2012-09-01 11:00:00 |
| Owen | Charles | 10 | 2012-09-01 11:00:00 |
| Jones | David | 11 | 2012-09-01 09:30:00 |
| Baker | Anne | 12 | 2012-09-01 14:30:00 |
| Farrell | Jemima | 13 | 2012-09-01 09:30:00 |
| Smith | Jack | 14 | 2012-09-01 11:00:00 |
| Bader | Florence | 15 | 2012-09-01 10:30:00 |
| Baker | Timothy | 16 | 2012-09-01 15:00:00 |
| Pinker | David | 17 | 2012-09-01 08:30:00 |
| Genting | Matthew | 20 | 2012-09-01 18:00:00 |
| Mackenzie | Anna | 21 | 2012-09-01 08:30:00 |
| Coplin | Joan | 22 | 2012-09-02 11:30:00 |
| Sarwin | Ramnaresh | 24 | 2012-09-04 11:00:00 |
| Jones | Douglas | 26 | 2012-09-08 13:00:00 |
| Rumney | Henrietta | 27 | 2012-09-16 13:30:00 |
| Farrell | David | 28 | 2012-09-18 09:00:00 |
| Worthington-Smyth | Henry | 29 | 2012-09-19 09:30:00 |
| Purview | Millicent | 30 | 2012-09-19 11:30:00 |
| Tupperware | Hyacinth | 33 | 2012-09-20 08:00:00 |
| Hunt | John | 35 | 2012-09-23 14:00:00 |
| Crumpet | Erica | 36 | 2012-09-27 11:30:00 |

</details>

<details><summary>Official hint</summary>

Take a look at the MIN aggregate function

</details>

<details><summary>Official answer and discussion</summary>

```sql
select mems.surname, mems.firstname, mems.memid, min(bks.starttime) as starttime
	from cd.bookings bks
	inner join cd.members mems on
		mems.memid = bks.memid
	where starttime >= '2012-09-01'
	group by mems.surname, mems.firstname, mems.memid
order by mems.memid;
```

This answer demonstrates the use of aggregate functions on dates. MIN works exactly as you'd expect, pulling out the lowest possible date in the result set. To make this work, we need to ensure that the result set only contains dates from September onwards. We do this using the WHERE clause.

You might typically use a query like this to find a customer's next booking. You can use this by replacing the date '2012-09-01' with the function now()

</details>

## 15. Produce a list of member names, with each row containing the total member count

Produce a list of member names, with each row containing the total member count. Order by join date, and include guest members.

<details><summary>Expected results</summary>

| count | firstname | surname |
| --- | --- | --- |
| 31 | GUEST | GUEST |
| 31 | Darren | Smith |
| 31 | Tracy | Smith |
| 31 | Tim | Rownam |
| 31 | Janice | Joplette |
| 31 | Gerald | Butters |
| 31 | Burton | Tracy |
| 31 | Nancy | Dare |
| 31 | Tim | Boothe |
| 31 | Ponder | Stibbons |
| 31 | Charles | Owen |
| 31 | David | Jones |
| 31 | Anne | Baker |
| 31 | Jemima | Farrell |
| 31 | Jack | Smith |
| 31 | Florence | Bader |
| 31 | Timothy | Baker |
| 31 | David | Pinker |
| 31 | Matthew | Genting |
| 31 | Anna | Mackenzie |
| 31 | Joan | Coplin |
| 31 | Ramnaresh | Sarwin |
| 31 | Douglas | Jones |
| 31 | Henrietta | Rumney |
| 31 | David | Farrell |
| 31 | Henry | Worthington-Smyth |
| 31 | Millicent | Purview |
| 31 | Hyacinth | Tupperware |
| 31 | John | Hunt |
| 31 | Erica | Crumpet |
| 31 | Darren | Smith |

</details>

<details><summary>Official hint</summary>

Read up on the COUNT window function.

</details>

<details><summary>Official answer and discussion</summary>

```sql
select count(*) over(), firstname, surname
	from cd.members
order by joindate
```

Using the knowledge we've built up so far, the most obvious answer to this is below. We use a subquery because otherwise SQL will require us to group by firstname and surname, producing a different result to what we're looking for.

</details>

## 16. Produce a numbered list of members

Produce a monotonically increasing numbered list of members (including guests), ordered by their date of joining. Remember that member IDs are not guaranteed to be sequential.

<details><summary>Expected results</summary>

| row\_number | firstname | surname |
| --- | --- | --- |
| 1 | GUEST | GUEST |
| 2 | Darren | Smith |
| 3 | Tracy | Smith |
| 4 | Tim | Rownam |
| 5 | Janice | Joplette |
| 6 | Gerald | Butters |
| 7 | Burton | Tracy |
| 8 | Nancy | Dare |
| 9 | Tim | Boothe |
| 10 | Ponder | Stibbons |
| 11 | Charles | Owen |
| 12 | David | Jones |
| 13 | Anne | Baker |
| 14 | Jemima | Farrell |
| 15 | Jack | Smith |
| 16 | Florence | Bader |
| 17 | Timothy | Baker |
| 18 | David | Pinker |
| 19 | Matthew | Genting |
| 20 | Anna | Mackenzie |
| 21 | Joan | Coplin |
| 22 | Ramnaresh | Sarwin |
| 23 | Douglas | Jones |
| 24 | Henrietta | Rumney |
| 25 | David | Farrell |
| 26 | Henry | Worthington-Smyth |
| 27 | Millicent | Purview |
| 28 | Hyacinth | Tupperware |
| 29 | John | Hunt |
| 30 | Erica | Crumpet |
| 31 | Darren | Smith |

</details>

<details><summary>Official hint</summary>

Read up on the ROW\_NUMBER window function.

</details>

<details><summary>Official answer and discussion</summary>

```sql
select row_number() over(order by joindate), firstname, surname
	from cd.members
order by joindate
```

This exercise is a simple bit of window function practise! You could just as easily use count(\*) over(order by joindate) here, so don't worry if you used that instead.

In this query, we don't define a partition, meaning that the partition is the entire dataset. Since we define an order for the window function, for any given row the window is: start of the dataset -> current row.

</details>

## 17. Output the facility id that has the highest number of slots booked, again

Output the facility id that has the highest number of slots booked. Ensure that in the event of a tie, all tieing results get output.

<details><summary>Expected results</summary>

| facid | total |
| --- | --- |
| 4 | 1404 |

</details>

<details><summary>Official hint</summary>

This one's a little bit tough. You'll need the RANK window function, and it's worth noting that it's possible to use an aggregate function inside the ORDER BY clause of a window function.

</details>

<details><summary>Official answer and discussion</summary>

```sql
select facid, total from (
	select facid, sum(slots) total, rank() over (order by sum(slots) desc) rank
        	from cd.bookings
		group by facid
	) as ranked
	where rank = 1
```

You may recall that this is a problem we've already solved in an earlier exercise. We came up with an answer something like below, which we then cut down using CTEs:

</details>

## 18. Rank members by (rounded) hours used

Produce a list of members (including guests), along with the number of hours they've booked in facilities, rounded to the nearest ten hours. Rank them by this rounded figure, producing output of first name, surname, rounded hours, rank. Sort by rank, surname, and first name.

<details><summary>Expected results</summary>

| firstname | surname | hours | rank |
| --- | --- | --- | --- |
| GUEST | GUEST | 1200 | 1 |
| Darren | Smith | 340 | 2 |
| Tim | Rownam | 330 | 3 |
| Tim | Boothe | 220 | 4 |
| Tracy | Smith | 220 | 4 |
| Gerald | Butters | 210 | 6 |
| Burton | Tracy | 180 | 7 |
| Charles | Owen | 170 | 8 |
| Janice | Joplette | 160 | 9 |
| Anne | Baker | 150 | 10 |
| Timothy | Baker | 150 | 10 |
| David | Jones | 150 | 10 |
| Nancy | Dare | 130 | 13 |
| Florence | Bader | 120 | 14 |
| Anna | Mackenzie | 120 | 14 |
| Ponder | Stibbons | 120 | 14 |
| Jack | Smith | 110 | 17 |
| Jemima | Farrell | 90 | 18 |
| David | Pinker | 80 | 19 |
| Ramnaresh | Sarwin | 80 | 19 |
| Matthew | Genting | 70 | 21 |
| Joan | Coplin | 50 | 22 |
| David | Farrell | 30 | 23 |
| Henry | Worthington-Smyth | 30 | 23 |
| John | Hunt | 20 | 25 |
| Douglas | Jones | 20 | 25 |
| Millicent | Purview | 20 | 25 |
| Henrietta | Rumney | 20 | 25 |
| Erica | Crumpet | 10 | 29 |
| Hyacinth | Tupperware | 10 | 29 |

</details>

<details><summary>Official hint</summary>

You'll need the RANK window function again. You can use integer arithmetic to accomplish rounding.

</details>

<details><summary>Official answer and discussion</summary>

```sql
select firstname, surname,
	((sum(bks.slots)+10)/20)*10 as hours,
	rank() over (order by ((sum(bks.slots)+10)/20)*10 desc) as rank

	from cd.bookings bks
	inner join cd.members mems
		on bks.memid = mems.memid
	group by mems.memid
order by rank, surname, firstname;
```

This answer isn't a great stretch over our previous exercise, although it does illustrate the function of RANK better. You can see that some of the clubgoers have an equal rounded number of hours booked in, and their rank is the same. If position 2 is shared between two members, the next one along gets position 4. There's a different function, DENSE\_RANK, that would assign that member position 3 instead.

It's worth noting the technique we use to do rounding here. Adding 5, dividing by 10, and multiplying by 10 has the effect (thanks to integer arithmetic cutting off fractions) of rounding a number to the nearest 10. In our case, because slots are half an hour, we need to add 10, divide by 20, and multiply by 10. One could certainly make the argument that we should do the slots -> hours conversion independently of the rounding, which would increase clarity.

Talking of clarity, this rounding malarky is starting to introduce a noticeable amount of code repetition. At this point it's a judgement call, but you may wish to factor it out using a subquery as below:

</details>

## 19. Find the top three revenue generating facilities

Produce a list of the top three revenue generating facilities (including ties). Output facility name and rank, sorted by rank and facility name.

<details><summary>Expected results</summary>

| name | rank |
| --- | --- |
| Massage Room 1 | 1 |
| Massage Room 2 | 2 |
| Tennis Court 2 | 3 |

</details>

<details><summary>Official hint</summary>

Yet another question based on the RANK window function! Remember the relative complexity of calculating the revenue of a facility, since you need to count for the different costs for the GUEST user..

</details>

<details><summary>Official answer and discussion</summary>

```sql
select name, rank from (
	select facs.name as name, rank() over (order by sum(case
				when memid = 0 then slots * facs.guestcost
				else slots * membercost
			end) desc) as rank
		from cd.bookings bks
		inner join cd.facilities facs
			on bks.facid = facs.facid
		group by facs.name
	) as subq
	where rank <= 3
order by rank;
```

This question doesn't introduce any new concepts, and is just intended to give you the opportunity to practise what you already know. We use the CASE statement to calculate the revenue for each slot, and aggregate that on a per-facility basis using SUM. We then use the RANK window function to produce a ranking, wrap it all up in a subquery, and extract everything with a rank less than or equal to 3.

</details>

## 20. Classify facilities by value

Classify facilities into equally sized groups of high, average, and low based on their revenue. Order by classification and facility name.

<details><summary>Expected results</summary>

| name | revenue |
| --- | --- |
| Massage Room 1 | high |
| Massage Room 2 | high |
| Tennis Court 2 | high |
| Badminton Court | average |
| Squash Court | average |
| Tennis Court 1 | average |
| Pool Table | low |
| Snooker Table | low |
| Table Tennis | low |

</details>

<details><summary>Official hint</summary>

Investigate the NTILE window function.

</details>

<details><summary>Official answer and discussion</summary>

```sql
select name, case when class=1 then 'high'
		when class=2 then 'average'
		else 'low'
		end revenue
	from (
		select facs.name as name, ntile(3) over (order by sum(case
				when memid = 0 then slots * facs.guestcost
				else slots * membercost
			end) desc) as class
		from cd.bookings bks
		inner join cd.facilities facs
			on bks.facid = facs.facid
		group by facs.name
	) as subq
order by class, name;
```

This exercise should mostly use familiar concepts, although we do introduce the NTILE window function. NTILE groups values into a passed-in number of groups, as evenly as possible. It outputs a number from 1->number of groups. We then use a CASE statement to turn that number into a label!

</details>

## 21. Calculate the payback time for each facility

Based on the 3 complete months of data so far, calculate the amount of time each facility will take to repay its cost of ownership. Remember to take into account ongoing monthly maintenance. Output facility name and payback time in months, order by facility name. Don't worry about differences in month lengths, we're only looking for a rough value here!

<details><summary>Expected results</summary>

| name | months |
| --- | --- |
| Badminton Court | 6.8317677198975235 |
| Massage Room 1 | 0.18885741265344664778 |
| Massage Room 2 | 1.7621145374449339 |
| Pool Table | 5.3333333333333333 |
| Snooker Table | 6.9230769230769231 |
| Squash Court | 1.1339582703356516 |
| Table Tennis | 6.4000000000000000 |
| Tennis Court 1 | 2.2624434389140271 |
| Tennis Court 2 | 1.7505470459518600 |

</details>

<details><summary>Official hint</summary>

There's no need to use window functions to solve this problem. Hard-code the number of months for an easy time, calculate them for a tougher one.

</details>

<details><summary>Official answer and discussion</summary>

```sql
select 	facs.name as name,
	facs.initialoutlay/((sum(case
			when memid = 0 then slots * facs.guestcost
			else slots * membercost
		end)/3) - facs.monthlymaintenance) as months
	from cd.bookings bks
	inner join cd.facilities facs
		on bks.facid = facs.facid
	group by facs.facid
order by name;
```

In contrast to all our recent exercises, there's no need to use window functions to solve this problem: it's just a bit of maths involving monthly revenue, initial outlay, and monthly maintenance. Again, for production code you might want to clarify what's going on a little here using a subquery (although since we've hard-coded the number of months, putting this into production is unlikely!). A tidied-up version might look like:

</details>

## 22. Calculate a rolling average of total revenue

For each day in August 2012, calculate a rolling average of total revenue over the previous 15 days. Output should contain date and revenue columns, sorted by the date. Remember to account for the possibility of a day having zero revenue. This one's a bit tough, so don't be afraid to check out the hint!

<details><summary>Expected results</summary>

| date | revenue |
| --- | --- |
| 2012-08-01 | 1126.8333333333333333 |
| 2012-08-02 | 1153.0000000000000000 |
| 2012-08-03 | 1162.9000000000000000 |
| 2012-08-04 | 1177.3666666666666667 |
| 2012-08-05 | 1160.9333333333333333 |
| 2012-08-06 | 1185.4000000000000000 |
| 2012-08-07 | 1182.8666666666666667 |
| 2012-08-08 | 1172.6000000000000000 |
| 2012-08-09 | 1152.4666666666666667 |
| 2012-08-10 | 1175.0333333333333333 |
| 2012-08-11 | 1176.6333333333333333 |
| 2012-08-12 | 1195.6666666666666667 |
| 2012-08-13 | 1218.0000000000000000 |
| 2012-08-14 | 1247.4666666666666667 |
| 2012-08-15 | 1274.1000000000000000 |
| 2012-08-16 | 1281.2333333333333333 |
| 2012-08-17 | 1324.4666666666666667 |
| 2012-08-18 | 1373.7333333333333333 |
| 2012-08-19 | 1406.0666666666666667 |
| 2012-08-20 | 1427.0666666666666667 |
| 2012-08-21 | 1450.3333333333333333 |
| 2012-08-22 | 1539.7000000000000000 |
| 2012-08-23 | 1567.3000000000000000 |
| 2012-08-24 | 1592.3333333333333333 |
| 2012-08-25 | 1615.0333333333333333 |
| 2012-08-26 | 1631.2000000000000000 |
| 2012-08-27 | 1659.4333333333333333 |
| 2012-08-28 | 1687.0000000000000000 |
| 2012-08-29 | 1684.6333333333333333 |
| 2012-08-30 | 1657.9333333333333333 |
| 2012-08-31 | 1703.4000000000000000 |

</details>

<details><summary>Official hint</summary>

You'll need to generate a list of days: check out GENERATE\_SERIES for that. You can then solve this problem using aggregate functions or window functions.

</details>

<details><summary>Official answer and discussion</summary>

```sql
select 	dategen.date,
	(
		-- correlated subquery that, for each day fed into it,
		-- finds the average revenue for the last 15 days
		select sum(case
			when memid = 0 then slots * facs.guestcost
			else slots * membercost
		end) as rev

		from cd.bookings bks
		inner join cd.facilities facs
			on bks.facid = facs.facid
		where bks.starttime > dategen.date - interval '14 days'
			and bks.starttime < dategen.date + interval '1 day'
	)/15 as revenue
	from
	(
		-- generates a list of days in august
		select 	cast(generate_series(timestamp '2012-08-01',
			'2012-08-31','1 day') as date) as date
	)  as dategen
order by dategen.date;
```

There's at least two equally good solutions to this question. I've put the simplest to write as the answer, but there's also a more flexible solution that uses window functions.

Let's look at the selected answer first. When I read SQL queries, I tend to read the SELECT part of the statement last - the FROM and WHERE parts tend to be more interesting. So, what do we have in our FROM? A call to the GENERATE\_SERIES function. This does pretty much what it says on the tin - generates a series of values. You can specify a start value, a stop value, and an increment. It works for integer types and dates - although, as you can see, we need to be explicit about what types are going into and out of the function. Try removing the casts, and seeing the result!

So, we've generated a timestamp for each day in August. Now, for each day, we need to generate our average. We can do this using a *correlated subquery*. If you remember, a correlated subquery is a subquery that uses values from the outer query. This means that it gets executed once for each result row in the outer query. This is in contrast to an uncorrelated subquery, which only has to be executed once.

If we look at our correlated subquery, we can see that it's correlated on the dategen.date field. It produces a sum of revenue for this day and the 14 days prior to it, and then divides that sum by 15. This produces the output we're looking for!

I mentioned that there's a window function-based solution for this problem as well - you can see it below. The approach we use for this is generating a list of revenue for each day, and then using window function aggregation over that list. The nice thing about this method is that once you have the per-day revenue, you can produce a wide range of results quite easily - you might, for example, want rolling averages for the previous month, 15 days, and 5 days. This is easy to do using this method, and rather harder using conventional aggregation.

</details>
