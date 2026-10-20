# PostgreSQL Exercises: recursive

> Copied from <https://pgexercises.com/questions/recursive/>. Questions and answers are the source's own; nothing was answered or rewritten here.


Schema: ![Database schema](images/7672af674514.svg)

## 1. Find the upward recommendation chain for member ID 27

Find the upward recommendation chain for member ID 27: that is, the member who recommended them, and the member who recommended that member, and so on. Return member ID, first name, and surname. Order by descending member id.

<details><summary>Expected results</summary>

| recommender | firstname | surname |
| --- | --- | --- |
| 20 | Matthew | Genting |
| 5 | Gerald | Butters |
| 1 | Darren | Smith |

</details>

<details><summary>Official hint</summary>

Read up on [WITH RECURSIVE](http://www.postgresql.org/docs/current/static/queries-with.html).

</details>

<details><summary>Official answer and discussion</summary>

```sql
with recursive recommenders(recommender) as (
	select recommendedby from cd.members where memid = 27
	union all
	select mems.recommendedby
		from recommenders recs
		inner join cd.members mems
			on mems.memid = recs.recommender
)
select recs.recommender, mems.firstname, mems.surname
	from recommenders recs
	inner join cd.members mems
		on recs.recommender = mems.memid
order by memid desc
```

WITH RECURSIVE is a fantastically useful piece of functionality that many developers are unaware of. It allows you to perform queries over hierarchies of data, which is very difficult by other means in SQL. Such scenarios often leave developers resorting to multiple round trips to the database system.

You've seen WITH before. The Common Table Expressions (CTEs) defined by WITH give you the ability to produce inline views over your data. This is normally just a syntactic convenience, but the RECURSIVE modifier adds the ability to join against results already produced to produce even more. A recursive WITH takes the basic form of:

</details>

## 2. Find the downward recommendation chain for member ID 1

Find the downward recommendation chain for member ID 1: that is, the members they recommended, the members those members recommended, and so on. Return member ID and name, and order by ascending member id.

<details><summary>Expected results</summary>

| memid | firstname | surname |
| --- | --- | --- |
| 4 | Janice | Joplette |
| 5 | Gerald | Butters |
| 7 | Nancy | Dare |
| 10 | Charles | Owen |
| 11 | David | Jones |
| 14 | Jack | Smith |
| 20 | Matthew | Genting |
| 21 | Anna | Mackenzie |
| 26 | Douglas | Jones |
| 27 | Henrietta | Rumney |

</details>

<details><summary>Official hint</summary>

Read up on [WITH RECURSIVE](http://www.postgresql.org/docs/current/static/queries-with.html).

</details>

<details><summary>Official answer and discussion</summary>

```sql
with recursive recommendeds(memid) as (
	select memid from cd.members where recommendedby = 1
	union all
	select mems.memid
		from recommendeds recs
		inner join cd.members mems
			on mems.recommendedby = recs.memid
)
select recs.memid, mems.firstname, mems.surname
	from recommendeds recs
	inner join cd.members mems
		on recs.memid = mems.memid
order by memid
```

This is a pretty minor variation on the previous question. The essential difference is that we're now heading in the opposite direction. One interesting point to note is that unlike the previous example, this CTE produces multiple rows per iteration, by virtue of the fact that we're heading down the recommendation tree (following all branches) rather than up it.

</details>

## 3. Produce a CTE that can return the upward recommendation chain for any member

Produce a CTE that can return the upward recommendation chain for any member. You should be able to select recommender from recommenders where member=x. Demonstrate it by getting the chains for members 12 and 22. Results table should have member and recommender, ordered by member ascending, recommender descending.

<details><summary>Expected results</summary>

| member | recommender | firstname | surname |
| --- | --- | --- | --- |
| 12 | 9 | Ponder | Stibbons |
| 12 | 6 | Burton | Tracy |
| 22 | 16 | Timothy | Baker |
| 22 | 13 | Jemima | Farrell |

</details>

<details><summary>Official hint</summary>

Your initial statement should return all the recommendedby and memid fields in the members table.

</details>

<details><summary>Official answer and discussion</summary>

```sql
with recursive recommenders(recommender, member) as (
	select recommendedby, memid
		from cd.members
	union all
	select mems.recommendedby, recs.member
		from recommenders recs
		inner join cd.members mems
			on mems.memid = recs.recommender
)
select recs.member member, recs.recommender, mems.firstname, mems.surname
	from recommenders recs
	inner join cd.members mems		
		on recs.recommender = mems.memid
	where recs.member = 22 or recs.member = 12
order by recs.member asc, recs.recommender desc
```

This question requires us to produce a CTE that can calculate the upward recommendation chain for any user. Most of the complexity of working out the answer is in realising that we now need our CTE to produce two columns: one to contain the member we're asking about, and another to contain the members in their recommendation tree. Essentially what we're doing is producing a table that flattens out the recommendation hierarchy.

Since we're looking to produce the chain for every user, our initial statement needs to select data for each user: their ID and who recommended them. Subsequently, we want to pass the member field through each iteration without changing it, while getting the next recommender. You can see that the recursive part of our statement hasn't really changed, except to pass through the 'member' field.

</details>
