# PostgreSQL Exercises: joins

> Copied from <https://pgexercises.com/questions/joins/>. Questions and answers are the source's own; nothing was answered or rewritten here.


Schema: ![Database schema](images/7672af674514.svg)

## 1. Retrieve the start times of members' bookings

How can you produce a list of the start times for bookings by members named 'David Farrell'?

<details><summary>Expected results</summary>

| starttime |
| --- |
| 2012-09-18 09:00:00 |
| 2012-09-18 17:30:00 |
| 2012-09-18 13:30:00 |
| 2012-09-18 20:00:00 |
| 2012-09-19 09:30:00 |
| 2012-09-19 15:00:00 |
| 2012-09-19 12:00:00 |
| 2012-09-20 15:30:00 |
| 2012-09-20 11:30:00 |
| 2012-09-20 14:00:00 |
| 2012-09-21 10:30:00 |
| 2012-09-21 14:00:00 |
| 2012-09-22 08:30:00 |
| 2012-09-22 17:00:00 |
| 2012-09-23 08:30:00 |
| 2012-09-23 17:30:00 |
| 2012-09-23 19:00:00 |
| 2012-09-24 08:00:00 |
| 2012-09-24 16:30:00 |
| 2012-09-24 12:30:00 |
| 2012-09-25 15:30:00 |
| 2012-09-25 17:00:00 |
| 2012-09-26 13:00:00 |
| 2012-09-26 17:00:00 |
| 2012-09-27 08:00:00 |
| 2012-09-28 11:30:00 |
| 2012-09-28 09:30:00 |
| 2012-09-28 13:00:00 |
| 2012-09-29 16:00:00 |
| 2012-09-29 10:30:00 |
| 2012-09-29 13:30:00 |
| 2012-09-29 14:30:00 |
| 2012-09-29 17:30:00 |
| 2012-09-30 14:30:00 |

</details>

<details><summary>Official hint</summary>

Take a look at the documentation for INNER JOIN.

</details>

<details><summary>Official answer and discussion</summary>

```sql
select bks.starttime 
	from 
		cd.bookings bks
		inner join cd.members mems
			on mems.memid = bks.memid
	where 
		mems.firstname='David' 
		and mems.surname='Farrell';
```

The most commonly used kind of join is the INNER JOIN. What this does is combine two tables based on a join expression - in this case, for each member id in the members table, we're looking for matching values in the bookings table. Where we find a match, a row combining the values for each table is returned. Note that we've given each table an *alias* (bks and mems). This is used for two reasons: firstly, it's convenient, and secondly we might join to the same table several times, requiring us to distinguish between columns from each different time the table was joined in.

Let's ignore our select and where clauses for now, and focus on what the FROM statement produces. In all our previous examples, FROM has just been a simple table. What is it now? Another table! This time, it's produced as a composite of bookings and members. You can see a subset of the output of the join below:

</details>

## 2. Work out the start times of bookings for tennis courts

How can you produce a list of the start times for bookings for tennis courts, for the date '2012-09-21'? Return a list of start time and facility name pairings, ordered by the time.

<details><summary>Expected results</summary>

| start | name |
| --- | --- |
| 2012-09-21 08:00:00 | Tennis Court 1 |
| 2012-09-21 08:00:00 | Tennis Court 2 |
| 2012-09-21 09:30:00 | Tennis Court 1 |
| 2012-09-21 10:00:00 | Tennis Court 2 |
| 2012-09-21 11:30:00 | Tennis Court 2 |
| 2012-09-21 12:00:00 | Tennis Court 1 |
| 2012-09-21 13:30:00 | Tennis Court 1 |
| 2012-09-21 14:00:00 | Tennis Court 2 |
| 2012-09-21 15:30:00 | Tennis Court 1 |
| 2012-09-21 16:00:00 | Tennis Court 2 |
| 2012-09-21 17:00:00 | Tennis Court 1 |
| 2012-09-21 18:00:00 | Tennis Court 2 |

</details>

<details><summary>Official hint</summary>

This is another INNER JOIN. You may also want to think about using the IN or LIKE operators to limit the results you get back.

</details>

<details><summary>Official answer and discussion</summary>

```sql
select bks.starttime as start, facs.name as name
	from 
		cd.facilities facs
		inner join cd.bookings bks
			on facs.facid = bks.facid
	where 
		facs.name in ('Tennis Court 2','Tennis Court 1') and
		bks.starttime >= '2012-09-21' and
		bks.starttime < '2012-09-22'
order by bks.starttime;
```

This is another INNER JOIN query, although it has a fair bit more complexity in it! The FROM part of the query is easy - we're simply joining facilities and bookings tables together on the facid. This produces a table where, for each row in bookings, we've attached detailed information about the facility being booked.

On to the WHERE component of the query. The checks on starttime are fairly self explanatory - we're making sure that all the bookings start between the specified dates. Since we're only interested in tennis courts, we're also using the IN operator to tell the database system to only give us back facility IDs 0 or 1 - the IDs of the courts. There's other ways to express this: We could have used where facs.facid = 0 or facs.facid = 1, or even where facs.name like 'Tennis%'.

The rest is pretty simple: we SELECT the columns we're interested in, and ORDER BY the start time.

</details>

## 3. Produce a list of all members who have recommended another member

How can you output a list of all members who have recommended another member? Ensure that there are no duplicates in the list, and that results are ordered by (surname, firstname).

<details><summary>Expected results</summary>

| firstname | surname |
| --- | --- |
| Florence | Bader |
| Timothy | Baker |
| Gerald | Butters |
| Jemima | Farrell |
| Matthew | Genting |
| David | Jones |
| Janice | Joplette |
| Millicent | Purview |
| Tim | Rownam |
| Darren | Smith |
| Tracy | Smith |
| Ponder | Stibbons |
| Burton | Tracy |

</details>

<details><summary>Official hint</summary>

This is an INNER JOIN, just like the previous exercises.

</details>

<details><summary>Official answer and discussion</summary>

```sql
select distinct recs.firstname as firstname, recs.surname as surname
	from 
		cd.members mems
		inner join cd.members recs
			on recs.memid = mems.recommendedby
order by surname, firstname;
```

Here's a concept that some people find confusing: you can join a table to itself! This is really useful if you have columns that reference data in the same table, like we do with recommendedby in cd.members.

If you're having trouble visualising this, remember that this works just the same as any other inner join. Our join takes each row in members that has a recommendedby value, and looks in members again for the row which has a matching member id. It then generates an output row combining the two members entries. This looks like the diagram below:

</details>

## 4. Produce a list of all members, along with their recommender

How can you output a list of all members, including the individual who recommended them (if any)? Ensure that results are ordered by (surname, firstname).

<details><summary>Expected results</summary>

| memfname | memsname | recfname | recsname |
| --- | --- | --- | --- |
| Florence | Bader | Ponder | Stibbons |
| Anne | Baker | Ponder | Stibbons |
| Timothy | Baker | Jemima | Farrell |
| Tim | Boothe | Tim | Rownam |
| Gerald | Butters | Darren | Smith |
| Joan | Coplin | Timothy | Baker |
| Erica | Crumpet | Tracy | Smith |
| Nancy | Dare | Janice | Joplette |
| David | Farrell |  |  |
| Jemima | Farrell |  |  |
| GUEST | GUEST |  |  |
| Matthew | Genting | Gerald | Butters |
| John | Hunt | Millicent | Purview |
| David | Jones | Janice | Joplette |
| Douglas | Jones | David | Jones |
| Janice | Joplette | Darren | Smith |
| Anna | Mackenzie | Darren | Smith |
| Charles | Owen | Darren | Smith |
| David | Pinker | Jemima | Farrell |
| Millicent | Purview | Tracy | Smith |
| Tim | Rownam |  |  |
| Henrietta | Rumney | Matthew | Genting |
| Ramnaresh | Sarwin | Florence | Bader |
| Darren | Smith |  |  |
| Darren | Smith |  |  |
| Jack | Smith | Darren | Smith |
| Tracy | Smith |  |  |
| Ponder | Stibbons | Burton | Tracy |
| Burton | Tracy |  |  |
| Hyacinth | Tupperware |  |  |
| Henry | Worthington-Smyth | Tracy | Smith |

</details>

<details><summary>Official hint</summary>

Try investigating the LEFT OUTER JOIN.

</details>

<details><summary>Official answer and discussion</summary>

```sql
select mems.firstname as memfname, mems.surname as memsname, recs.firstname as recfname, recs.surname as recsname
	from 
		cd.members mems
		left outer join cd.members recs
			on recs.memid = mems.recommendedby
order by memsname, memfname;
```

Let's introduce another new concept: the LEFT OUTER JOIN. These are best explained by the way in which they differ from inner joins. Inner joins take a left and a right table, and look for matching rows based on a join condition (ON). When the condition is satisfied, a joined row is produced. A LEFT OUTER JOIN operates similarly, except that if a given row on the left hand table doesn't match anything, it still produces an output row. That output row consists of the left hand table row, and a bunch of NULLS in place of the right hand table row.

This is useful in situations like this question, where we want to produce output with optional data. We want the names of all members, and the name of their recommender *if that person exists*. You can't express that properly with an inner join.

As you may have guessed, there's other outer joins too. The RIGHT OUTER JOIN is much like the LEFT OUTER JOIN, except that the left hand side of the expression is the one that contains the optional data. The rarely-used FULL OUTER JOIN treats both sides of the expression as optional.

</details>

## 5. Produce a list of all members who have used a tennis court

How can you produce a list of all members who have used a tennis court? Include in your output the name of the court, and the name of the member formatted as a single column. Ensure no duplicate data, and order by the member name followed by the facility name.

<details><summary>Expected results</summary>

| member | facility |
| --- | --- |
| Anne Baker | Tennis Court 1 |
| Anne Baker | Tennis Court 2 |
| Burton Tracy | Tennis Court 1 |
| Burton Tracy | Tennis Court 2 |
| Charles Owen | Tennis Court 1 |
| Charles Owen | Tennis Court 2 |
| Darren Smith | Tennis Court 2 |
| David Farrell | Tennis Court 1 |
| David Farrell | Tennis Court 2 |
| David Jones | Tennis Court 1 |
| David Jones | Tennis Court 2 |
| David Pinker | Tennis Court 1 |
| Douglas Jones | Tennis Court 1 |
| Erica Crumpet | Tennis Court 1 |
| Florence Bader | Tennis Court 1 |
| Florence Bader | Tennis Court 2 |
| GUEST GUEST | Tennis Court 1 |
| GUEST GUEST | Tennis Court 2 |
| Gerald Butters | Tennis Court 1 |
| Gerald Butters | Tennis Court 2 |
| Henrietta Rumney | Tennis Court 2 |
| Jack Smith | Tennis Court 1 |
| Jack Smith | Tennis Court 2 |
| Janice Joplette | Tennis Court 1 |
| Janice Joplette | Tennis Court 2 |
| Jemima Farrell | Tennis Court 1 |
| Jemima Farrell | Tennis Court 2 |
| Joan Coplin | Tennis Court 1 |
| John Hunt | Tennis Court 1 |
| John Hunt | Tennis Court 2 |
| Matthew Genting | Tennis Court 1 |
| Millicent Purview | Tennis Court 2 |
| Nancy Dare | Tennis Court 1 |
| Nancy Dare | Tennis Court 2 |
| Ponder Stibbons | Tennis Court 1 |
| Ponder Stibbons | Tennis Court 2 |
| Ramnaresh Sarwin | Tennis Court 1 |
| Ramnaresh Sarwin | Tennis Court 2 |
| Tim Boothe | Tennis Court 1 |
| Tim Boothe | Tennis Court 2 |
| Tim Rownam | Tennis Court 1 |
| Tim Rownam | Tennis Court 2 |
| Timothy Baker | Tennis Court 1 |
| Timothy Baker | Tennis Court 2 |
| Tracy Smith | Tennis Court 1 |
| Tracy Smith | Tennis Court 2 |

</details>

<details><summary>Official hint</summary>

This answer requires multiple joins. To concatenate strings you can use the || operator.

</details>

<details><summary>Official answer and discussion</summary>

```sql
select distinct mems.firstname || ' ' || mems.surname as member, facs.name as facility
	from 
		cd.members mems
		inner join cd.bookings bks
			on mems.memid = bks.memid
		inner join cd.facilities facs
			on bks.facid = facs.facid
	where
		facs.name in ('Tennis Court 2','Tennis Court 1')
order by member, facility
```

This exercise is largely a more complex application of what you've learned in prior questions. It's also the first time we've used more than one join, which may be a little confusing for some. When reading join expressions, remember that a join is effectively a function that takes two tables, one labelled the left table, and the other the right. This is easy to visualise with just one join in the query, but a little more confusing with two.

Our second INNER JOIN in this query has a right hand side of cd.facilities. That's easy enough to grasp. The left hand side, however, is the table returned by joining cd.members to cd.bookings. It's important to emphasise this: the relational model is all about tables. The output of any join is another table. The output of a query is a table. Single columned lists are tables. Once you grasp that, you've grasped the fundamental beauty of the model.

As a final note, we do introduce one new thing here: the || operator is used to concatenate strings.

</details>

## 6. Produce a list of costly bookings

How can you produce a list of bookings on the day of 2012-09-14 which will cost the member (or guest) more than $30? Remember that guests have different costs to members (the listed costs are per half-hour 'slot'), and the guest user is always ID 0. Include in your output the name of the facility, the name of the member formatted as a single column, and the cost. Order by descending cost, and do not use any subqueries.

<details><summary>Expected results</summary>

| member | facility | cost |
| --- | --- | --- |
| GUEST GUEST | Massage Room 2 | 320 |
| GUEST GUEST | Massage Room 1 | 160 |
| GUEST GUEST | Massage Room 1 | 160 |
| GUEST GUEST | Massage Room 1 | 160 |
| GUEST GUEST | Tennis Court 2 | 150 |
| Jemima Farrell | Massage Room 1 | 140 |
| GUEST GUEST | Tennis Court 1 | 75 |
| GUEST GUEST | Tennis Court 2 | 75 |
| GUEST GUEST | Tennis Court 1 | 75 |
| Matthew Genting | Massage Room 1 | 70 |
| Florence Bader | Massage Room 2 | 70 |
| GUEST GUEST | Squash Court | 70.0 |
| Jemima Farrell | Massage Room 1 | 70 |
| Ponder Stibbons | Massage Room 1 | 70 |
| Burton Tracy | Massage Room 1 | 70 |
| Jack Smith | Massage Room 1 | 70 |
| GUEST GUEST | Squash Court | 35.0 |
| GUEST GUEST | Squash Court | 35.0 |

</details>

<details><summary>Official hint</summary>

As before, this answer requires multiple joins. It's more complex WHERE logic than you're used to, and will require a CASE statement in the column selections!

</details>

<details><summary>Official answer and discussion</summary>

```sql
select mems.firstname || ' ' || mems.surname as member, 
	facs.name as facility, 
	case 
		when mems.memid = 0 then
			bks.slots*facs.guestcost
		else
			bks.slots*facs.membercost
	end as cost
        from
                cd.members mems                
                inner join cd.bookings bks
                        on mems.memid = bks.memid
                inner join cd.facilities facs
                        on bks.facid = facs.facid
        where
		bks.starttime >= '2012-09-14' and 
		bks.starttime < '2012-09-15' and (
			(mems.memid = 0 and bks.slots*facs.guestcost > 30) or
			(mems.memid != 0 and bks.slots*facs.membercost > 30)
		)
order by cost desc;
```

This is a bit of a complicated one! While its more complex logic than we've used previously, there's not an awful lot to remark upon. The WHERE clause restricts our output to sufficiently costly rows on 2012-09-14, remembering to distinguish between guests and others. We then use a CASE statement in the column selections to output the correct cost for the member or guest.

</details>

## 7. Produce a list of all members, along with their recommender, using no joins.

How can you output a list of all members, including the individual who recommended them (if any), without using any joins? Ensure that there are no duplicates in the list, and that each firstname + surname pairing is formatted as a column and ordered.

<details><summary>Expected results</summary>

| member | recommender |
| --- | --- |
| Anna Mackenzie | Darren Smith |
| Anne Baker | Ponder Stibbons |
| Burton Tracy |  |
| Charles Owen | Darren Smith |
| Darren Smith |  |
| David Farrell |  |
| David Jones | Janice Joplette |
| David Pinker | Jemima Farrell |
| Douglas Jones | David Jones |
| Erica Crumpet | Tracy Smith |
| Florence Bader | Ponder Stibbons |
| GUEST GUEST |  |
| Gerald Butters | Darren Smith |
| Henrietta Rumney | Matthew Genting |
| Henry Worthington-Smyth | Tracy Smith |
| Hyacinth Tupperware |  |
| Jack Smith | Darren Smith |
| Janice Joplette | Darren Smith |
| Jemima Farrell |  |
| Joan Coplin | Timothy Baker |
| John Hunt | Millicent Purview |
| Matthew Genting | Gerald Butters |
| Millicent Purview | Tracy Smith |
| Nancy Dare | Janice Joplette |
| Ponder Stibbons | Burton Tracy |
| Ramnaresh Sarwin | Florence Bader |
| Tim Boothe | Tim Rownam |
| Tim Rownam |  |
| Timothy Baker | Jemima Farrell |
| Tracy Smith |  |

</details>

<details><summary>Official hint</summary>

Answering this question correctly requires the use of a *subquery*

</details>

<details><summary>Official answer and discussion</summary>

```sql
select distinct mems.firstname || ' ' ||  mems.surname as member,
	(select recs.firstname || ' ' || recs.surname as recommender 
		from cd.members recs 
		where recs.memid = mems.recommendedby
	)
	from 
		cd.members mems
order by member;
```

This exercise marks the introduction of subqueries. Subqueries are, as the name implies, queries within a query. They're commonly used with aggregates, to answer questions like 'get me all the details of the member who has spent the most hours on Tennis Court 1'.

In this case, we're simply using the subquery to emulate an outer join. For every value of member, the subquery is run once to find the name of the individual who recommended them (if any). A subquery that uses information from the outer query in this way (and thus has to be run for each row in the result set) is known as a *correlated subquery*.

</details>

## 8. Produce a list of costly bookings, using a subquery

The [Produce a list of costly bookings](./threejoin2.html) exercise contained some messy logic: we had to calculate the booking cost in both the WHERE clause and the CASE statement. Try to simplify this calculation using subqueries. For reference, the question was:

*How can you produce a list of bookings on the day of 2012-09-14 which will cost the member (or guest) more than $30? Remember that guests have different costs to members (the listed costs are per half-hour 'slot'), and the guest user is always ID 0. Include in your output the name of the facility, the name of the member formatted as a single column, and the cost. Order by descending cost.*

<details><summary>Expected results</summary>

| member | facility | cost |
| --- | --- | --- |
| GUEST GUEST | Massage Room 2 | 320 |
| GUEST GUEST | Massage Room 1 | 160 |
| GUEST GUEST | Massage Room 1 | 160 |
| GUEST GUEST | Massage Room 1 | 160 |
| GUEST GUEST | Tennis Court 2 | 150 |
| Jemima Farrell | Massage Room 1 | 140 |
| GUEST GUEST | Tennis Court 1 | 75 |
| GUEST GUEST | Tennis Court 2 | 75 |
| GUEST GUEST | Tennis Court 1 | 75 |
| Matthew Genting | Massage Room 1 | 70 |
| Florence Bader | Massage Room 2 | 70 |
| GUEST GUEST | Squash Court | 70.0 |
| Jemima Farrell | Massage Room 1 | 70 |
| Ponder Stibbons | Massage Room 1 | 70 |
| Burton Tracy | Massage Room 1 | 70 |
| Jack Smith | Massage Room 1 | 70 |
| GUEST GUEST | Squash Court | 35.0 |
| GUEST GUEST | Squash Court | 35.0 |

</details>

<details><summary>Official hint</summary>

Your answer will be similar to the referenced exercise. Use a subquery in the FROM clause to generate a result set that calculates the total cost of each booking. The outer query can then select the bookings it's interested in.

</details>

<details><summary>Official answer and discussion</summary>

```sql
select member, facility, cost from (
	select 
		mems.firstname || ' ' || mems.surname as member,
		facs.name as facility,
		case
			when mems.memid = 0 then
				bks.slots*facs.guestcost
			else
				bks.slots*facs.membercost
		end as cost
		from
			cd.members mems
			inner join cd.bookings bks
				on mems.memid = bks.memid
			inner join cd.facilities facs
				on bks.facid = facs.facid
		where
			bks.starttime >= '2012-09-14' and
			bks.starttime < '2012-09-15'
	) as bookings
	where cost > 30
order by cost desc;
```

This answer provides a mild simplification to the previous iteration: in the no-subquery version, we had to calculate the member or guest's cost in both the WHERE clause and the CASE statement. In our new version, we produce an inline query that calculates the total booking cost for us, allowing the outer query to simply select the bookings it's looking for. For reference, you may also see subqueries in the FROM clause referred to as *inline views*.

</details>
