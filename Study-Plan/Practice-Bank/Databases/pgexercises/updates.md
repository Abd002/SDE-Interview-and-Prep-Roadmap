# PostgreSQL Exercises: updates

> Copied from <https://pgexercises.com/questions/updates/>. Questions and answers are the source's own; nothing was answered or rewritten here.


Schema: ![Database schema](images/7672af674514.svg)

## 1. Insert some data into a table

The club is adding a new facility - a spa. We need to add it into the facilities table. Use the following values:

- facid: 9, Name: 'Spa', membercost: 20, guestcost: 30, initialoutlay: 100000, monthlymaintenance: 800.

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
| 9 | Spa | 20 | 30 | 100000 | 800 |

</details>

<details><summary>Official hint</summary>

INSERT can be used to insert data into a table.

</details>

<details><summary>Official answer and discussion</summary>

```sql
insert into cd.facilities
    (facid, name, membercost, guestcost, initialoutlay, monthlymaintenance)
    values (9, 'Spa', 20, 30, 100000, 800);
```

INSERT INTO ... VALUES is the simplest way to insert data into a table. There's not a whole lot to discuss here: VALUES is used to construct a row of data, which the INSERT statement inserts into the table. It's a simple as that.

You can see that there's two sections in parentheses. The first is part of the INSERT statement, and specifies the columns that we're providing data for. The second is part of VALUES, and specifies the actual data we want to insert into each column.

If we're inserting data into every column of the table, as in this example, explicitly specifying the column names is optional. As long as you fill in data for all columns of the table, in the order they were defined when you created the table, you can do something like the following:

</details>

## 2. Insert multiple rows of data into a table

In the previous exercise, you learned how to add a facility. Now you're going to add multiple facilities in one command. Use the following values:

- facid: 9, Name: 'Spa', membercost: 20, guestcost: 30, initialoutlay: 100000, monthlymaintenance: 800.- facid: 10, Name: 'Squash Court 2', membercost: 3.5, guestcost: 17.5, initialoutlay: 5000, monthlymaintenance: 80.

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
| 9 | Spa | 20 | 30 | 100000 | 800 |
| 10 | Squash Court 2 | 3.5 | 17.5 | 5000 | 80 |

</details>

<details><summary>Official hint</summary>

VALUES can be used to generate more than one row.

</details>

<details><summary>Official answer and discussion</summary>

```sql
insert into cd.facilities
    (facid, name, membercost, guestcost, initialoutlay, monthlymaintenance)
    values
        (9, 'Spa', 20, 30, 100000, 800),
        (10, 'Squash Court 2', 3.5, 17.5, 5000, 80);
```

VALUES can be used to generate more than one row to insert into a table, as seen in this example. Hopefully it's clear what's going on here: the output of VALUES is a table, and that table is copied into cd.facilities, the table specified in the INSERT command.

While you'll most commonly see VALUES when inserting data, Postgres allows you to use VALUES wherever you might use a SELECT. This makes sense: the output of both commands is a table, it's just that VALUES is a bit more ergonomic when working with constant data.

Similarly, it's possible to use SELECT wherever you see a VALUES. This means that you can INSERT the results of a SELECT. For example:

</details>

## 3. Insert calculated data into a table

Let's try adding the spa to the facilities table again. This time, though, we want to automatically generate the value for the next facid, rather than specifying it as a constant. Use the following values for everything else:

- Name: 'Spa', membercost: 20, guestcost: 30, initialoutlay: 100000, monthlymaintenance: 800.

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
| 9 | Spa | 20 | 30 | 100000 | 800 |

</details>

<details><summary>Official hint</summary>

You can calculate data to insert using subqueries.

</details>

<details><summary>Official answer and discussion</summary>

```sql
insert into cd.facilities
    (facid, name, membercost, guestcost, initialoutlay, monthlymaintenance)
    select (select max(facid) from cd.facilities)+1, 'Spa', 20, 30, 100000, 800;
```

In the previous exercises we used VALUES to insert constant data into the facilities table. Here, though, we have a new requirement: a dynamically generated ID. This gives us a real quality of life improvement, as we don't have to manually work out what the current largest ID is: the SQL command does it for us.

Since the VALUES clause is only used to supply constant data, we need to replace it with a query instead. The SELECT statement is fairly simple: there's an inner subquery that works out the next facid based on the largest current id, and the rest is just constant data. The output of the statement is a row that we insert into the facilities table.

While this works fine in our simple example, it's not how you would generally implement an incrementing ID in the real world. Postgres provides SERIAL types that are auto-filled with the next ID when you insert a row. As well as saving us effort, these types are also safer: unlike the answer given in this exercise, there's no need to worry about concurrent operations generating the same ID.

</details>

## 4. Update some existing data

We made a mistake when entering the data for the second tennis court. The initial outlay was 10000 rather than 8000: you need to alter the data to fix the error.

<details><summary>Expected results</summary>

| facid | name | membercost | guestcost | initialoutlay | monthlymaintenance |
| --- | --- | --- | --- | --- | --- |
| 0 | Tennis Court 1 | 5 | 25 | 10000 | 200 |
| 1 | Tennis Court 2 | 5 | 25 | 10000 | 200 |
| 2 | Badminton Court | 0 | 15.5 | 4000 | 50 |
| 3 | Table Tennis | 0 | 5 | 320 | 10 |
| 4 | Massage Room 1 | 35 | 80 | 4000 | 3000 |
| 5 | Massage Room 2 | 35 | 80 | 4000 | 3000 |
| 6 | Squash Court | 3.5 | 17.5 | 5000 | 80 |
| 7 | Snooker Table | 0 | 5 | 450 | 15 |
| 8 | Pool Table | 0 | 5 | 400 | 15 |

</details>

<details><summary>Official hint</summary>

You can alter existing data using the UPDATE statement.

</details>

<details><summary>Official answer and discussion</summary>

```sql
update cd.facilities
    set initialoutlay = 10000
    where facid = 1;
```

The UPDATE statement is used to alter existing data. If you're familiar with SELECT queries, it's pretty easy to read: the WHERE clause works in exactly the same fashion, allowing us to filter the set of rows we want to work with. These rows are then modified according to the specifications of the SET clause: in this case, setting the initial outlay.

The WHERE clause is extremely important. It's easy to get it wrong or even omit it, with disastrous results. Consider the following command:

</details>

## 5. Update multiple rows and columns at the same time

We want to increase the price of the tennis courts for both members and guests. Update the costs to be 6 for members, and 30 for guests.

<details><summary>Expected results</summary>

| facid | name | membercost | guestcost | initialoutlay | monthlymaintenance |
| --- | --- | --- | --- | --- | --- |
| 0 | Tennis Court 1 | 6 | 30 | 10000 | 200 |
| 1 | Tennis Court 2 | 6 | 30 | 8000 | 200 |
| 2 | Badminton Court | 0 | 15.5 | 4000 | 50 |
| 3 | Table Tennis | 0 | 5 | 320 | 10 |
| 4 | Massage Room 1 | 35 | 80 | 4000 | 3000 |
| 5 | Massage Room 2 | 35 | 80 | 4000 | 3000 |
| 6 | Squash Court | 3.5 | 17.5 | 5000 | 80 |
| 7 | Snooker Table | 0 | 5 | 450 | 15 |
| 8 | Pool Table | 0 | 5 | 400 | 15 |

</details>

<details><summary>Official hint</summary>

The SET clause can update multiple columns.

</details>

<details><summary>Official answer and discussion</summary>

```sql
update cd.facilities
    set
        membercost = 6,
        guestcost = 30
    where facid in (0,1);
```

The SET clause accepts a comma separated list of values that you want to update.

</details>

## 6. Update a row based on the contents of another row

We want to alter the price of the second tennis court so that it costs 10% more than the first one. Try to do this without using constant values for the prices, so that we can reuse the statement if we want to.

<details><summary>Expected results</summary>

| facid | name | membercost | guestcost | initialoutlay | monthlymaintenance |
| --- | --- | --- | --- | --- | --- |
| 0 | Tennis Court 1 | 5 | 25 | 10000 | 200 |
| 1 | Tennis Court 2 | 5.5 | 27.5 | 8000 | 200 |
| 2 | Badminton Court | 0 | 15.5 | 4000 | 50 |
| 3 | Table Tennis | 0 | 5 | 320 | 10 |
| 4 | Massage Room 1 | 35 | 80 | 4000 | 3000 |
| 5 | Massage Room 2 | 35 | 80 | 4000 | 3000 |
| 6 | Squash Court | 3.5 | 17.5 | 5000 | 80 |
| 7 | Snooker Table | 0 | 5 | 450 | 15 |
| 8 | Pool Table | 0 | 5 | 400 | 15 |

</details>

<details><summary>Official hint</summary>

Take a look at UPDATE FROM in the PostgreSQL documentation.

</details>

<details><summary>Official answer and discussion</summary>

```sql
update cd.facilities facs
    set
        membercost = (select membercost * 1.1 from cd.facilities where facid = 0),
        guestcost = (select guestcost * 1.1 from cd.facilities where facid = 0)
    where facs.facid = 1;
```

Updating columns based on calculated data is not too intrinsically difficult: we can do so pretty easily using subqueries. You can see this approach in our selected answer.

As the number of columns we want to update increases, standard SQL can start to get pretty awkward: you don't want to be specifying a separate subquery for each of 15 different column updates. Postgres provides a nonstandard extension to SQL called UPDATE...FROM that addresses this: it allows you to supply a FROM clause to generate values for use in the SET clause. Example below:

</details>

## 7. Delete all bookings

As part of a clearout of our database, we want to delete all bookings from the cd.bookings table. How can we accomplish this?

<details><summary>Expected results</summary>

| bookid | facid | memid | starttime | slots |
| --- | --- | --- | --- | --- |

</details>

<details><summary>Official hint</summary>

Take a look at the DELETE statement in the PostgreSQL docs.

</details>

<details><summary>Official answer and discussion</summary>

```sql
delete from cd.bookings;
```

The DELETE statement does what it says on the tin: deletes rows from the table. Here, we show the command in its simplest form, with no qualifiers. In this case, it deletes everything from the table. Obviously, you should be careful with your deletes and make sure they're always limited - we'll see how to do that in the next exercise.

An alternative to unqualified DELETEs is the following:

</details>

## 8. Delete a member from the cd.members table

We want to remove member 37, who has never made a booking, from our database. How can we achieve that?

<details><summary>Expected results</summary>

| memid | surname | firstname | address | zipcode | telephone | recommendedby | joindate |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | GUEST | GUEST | GUEST | 0 | (000) 000-0000 |  | 2012-07-01 00:00:00 |
| 1 | Smith | Darren | 8 Bloomsbury Close, Boston | 4321 | 555-555-5555 |  | 2012-07-02 12:02:05 |
| 2 | Smith | Tracy | 8 Bloomsbury Close, New York | 4321 | 555-555-5555 |  | 2012-07-02 12:08:23 |
| 3 | Rownam | Tim | 23 Highway Way, Boston | 23423 | (844) 693-0723 |  | 2012-07-03 09:32:15 |
| 4 | Joplette | Janice | 20 Crossing Road, New York | 234 | (833) 942-4710 | 1 | 2012-07-03 10:25:05 |
| 5 | Butters | Gerald | 1065 Huntingdon Avenue, Boston | 56754 | (844) 078-4130 | 1 | 2012-07-09 10:44:09 |
| 6 | Tracy | Burton | 3 Tunisia Drive, Boston | 45678 | (822) 354-9973 |  | 2012-07-15 08:52:55 |
| 7 | Dare | Nancy | 6 Hunting Lodge Way, Boston | 10383 | (833) 776-4001 | 4 | 2012-07-25 08:59:12 |
| 8 | Boothe | Tim | 3 Bloomsbury Close, Reading, 00234 | 234 | (811) 433-2547 | 3 | 2012-07-25 16:02:35 |
| 9 | Stibbons | Ponder | 5 Dragons Way, Winchester | 87630 | (833) 160-3900 | 6 | 2012-07-25 17:09:05 |
| 10 | Owen | Charles | 52 Cheshire Grove, Winchester, 28563 | 28563 | (855) 542-5251 | 1 | 2012-08-03 19:42:37 |
| 11 | Jones | David | 976 Gnats Close, Reading | 33862 | (844) 536-8036 | 4 | 2012-08-06 16:32:55 |
| 12 | Baker | Anne | 55 Powdery Street, Boston | 80743 | 844-076-5141 | 9 | 2012-08-10 14:23:22 |
| 13 | Farrell | Jemima | 103 Firth Avenue, North Reading | 57392 | (855) 016-0163 |  | 2012-08-10 14:28:01 |
| 14 | Smith | Jack | 252 Binkington Way, Boston | 69302 | (822) 163-3254 | 1 | 2012-08-10 16:22:05 |
| 15 | Bader | Florence | 264 Ursula Drive, Westford | 84923 | (833) 499-3527 | 9 | 2012-08-10 17:52:03 |
| 16 | Baker | Timothy | 329 James Street, Reading | 58393 | 833-941-0824 | 13 | 2012-08-15 10:34:25 |
| 17 | Pinker | David | 5 Impreza Road, Boston | 65332 | 811 409-6734 | 13 | 2012-08-16 11:32:47 |
| 20 | Genting | Matthew | 4 Nunnington Place, Wingfield, Boston | 52365 | (811) 972-1377 | 5 | 2012-08-19 14:55:55 |
| 21 | Mackenzie | Anna | 64 Perkington Lane, Reading | 64577 | (822) 661-2898 | 1 | 2012-08-26 09:32:05 |
| 22 | Coplin | Joan | 85 Bard Street, Bloomington, Boston | 43533 | (822) 499-2232 | 16 | 2012-08-29 08:32:41 |
| 24 | Sarwin | Ramnaresh | 12 Bullington Lane, Boston | 65464 | (822) 413-1470 | 15 | 2012-09-01 08:44:42 |
| 26 | Jones | Douglas | 976 Gnats Close, Reading | 11986 | 844 536-8036 | 11 | 2012-09-02 18:43:05 |
| 27 | Rumney | Henrietta | 3 Burkington Plaza, Boston | 78533 | (822) 989-8876 | 20 | 2012-09-05 08:42:35 |
| 28 | Farrell | David | 437 Granite Farm Road, Westford | 43532 | (855) 755-9876 |  | 2012-09-15 08:22:05 |
| 29 | Worthington-Smyth | Henry | 55 Jagbi Way, North Reading | 97676 | (855) 894-3758 | 2 | 2012-09-17 12:27:15 |
| 30 | Purview | Millicent | 641 Drudgery Close, Burnington, Boston | 34232 | (855) 941-9786 | 2 | 2012-09-18 19:04:01 |
| 33 | Tupperware | Hyacinth | 33 Cheerful Plaza, Drake Road, Westford | 68666 | (822) 665-5327 |  | 2012-09-18 19:32:05 |
| 35 | Hunt | John | 5 Bullington Lane, Boston | 54333 | (899) 720-6978 | 30 | 2012-09-19 11:32:45 |
| 36 | Crumpet | Erica | Crimson Road, North Reading | 75655 | (811) 732-4816 | 2 | 2012-09-22 08:36:38 |

</details>

<details><summary>Official hint</summary>

Take a look at the DELETE statement in the PostgreSQL docs.

</details>

<details><summary>Official answer and discussion</summary>

```sql
delete from cd.members where memid = 37;
```

This exercise is a small increment on our previous one. Instead of deleting all bookings, this time we want to be a bit more targeted, and delete a single member that has never made a booking. To do this, we simply have to add a WHERE clause to our command, specifying the member we want to delete. You can see the parallels with SELECT and UPDATE statements here.

There's one interesting wrinkle here. Try this command out, but substituting in member id 0 instead. This member has made many bookings, and you'll find that the delete fails with an error about a foreign key constraint violation. This is an important concept in relational databases, so let's explore a little further.

Foreign keys are a mechanism for defining relationships between columns of different tables. In our case we use them to specify that the memid column of the bookings table is related to the memid column of the members table. The relationship (or 'constraint') specifies that for a given booking, the member specified in the booking **must** exist in the members table. It's useful to have this guarantee enforced by the database: it means that code using the database can rely on the presence of the member. It's hard (even impossible) to enforce this at higher levels: concurrent operations can interfere and leave your database in a broken state.

PostgreSQL supports various different kinds of constraints that allow you to enforce structure upon your data. For more information on constraints, check out the PostgreSQL documentation on [foreign keys](https://www.postgresql.org/docs/current/static/ddl-constraints.html)

</details>

## 9. Delete based on a subquery

In our previous exercises, we deleted a specific member who had never made a booking. How can we make that more general, to delete all members who have never made a booking?

<details><summary>Expected results</summary>

| memid | surname | firstname | address | zipcode | telephone | recommendedby | joindate |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | GUEST | GUEST | GUEST | 0 | (000) 000-0000 |  | 2012-07-01 00:00:00 |
| 1 | Smith | Darren | 8 Bloomsbury Close, Boston | 4321 | 555-555-5555 |  | 2012-07-02 12:02:05 |
| 2 | Smith | Tracy | 8 Bloomsbury Close, New York | 4321 | 555-555-5555 |  | 2012-07-02 12:08:23 |
| 3 | Rownam | Tim | 23 Highway Way, Boston | 23423 | (844) 693-0723 |  | 2012-07-03 09:32:15 |
| 4 | Joplette | Janice | 20 Crossing Road, New York | 234 | (833) 942-4710 | 1 | 2012-07-03 10:25:05 |
| 5 | Butters | Gerald | 1065 Huntingdon Avenue, Boston | 56754 | (844) 078-4130 | 1 | 2012-07-09 10:44:09 |
| 6 | Tracy | Burton | 3 Tunisia Drive, Boston | 45678 | (822) 354-9973 |  | 2012-07-15 08:52:55 |
| 7 | Dare | Nancy | 6 Hunting Lodge Way, Boston | 10383 | (833) 776-4001 | 4 | 2012-07-25 08:59:12 |
| 8 | Boothe | Tim | 3 Bloomsbury Close, Reading, 00234 | 234 | (811) 433-2547 | 3 | 2012-07-25 16:02:35 |
| 9 | Stibbons | Ponder | 5 Dragons Way, Winchester | 87630 | (833) 160-3900 | 6 | 2012-07-25 17:09:05 |
| 10 | Owen | Charles | 52 Cheshire Grove, Winchester, 28563 | 28563 | (855) 542-5251 | 1 | 2012-08-03 19:42:37 |
| 11 | Jones | David | 976 Gnats Close, Reading | 33862 | (844) 536-8036 | 4 | 2012-08-06 16:32:55 |
| 12 | Baker | Anne | 55 Powdery Street, Boston | 80743 | 844-076-5141 | 9 | 2012-08-10 14:23:22 |
| 13 | Farrell | Jemima | 103 Firth Avenue, North Reading | 57392 | (855) 016-0163 |  | 2012-08-10 14:28:01 |
| 14 | Smith | Jack | 252 Binkington Way, Boston | 69302 | (822) 163-3254 | 1 | 2012-08-10 16:22:05 |
| 15 | Bader | Florence | 264 Ursula Drive, Westford | 84923 | (833) 499-3527 | 9 | 2012-08-10 17:52:03 |
| 16 | Baker | Timothy | 329 James Street, Reading | 58393 | 833-941-0824 | 13 | 2012-08-15 10:34:25 |
| 17 | Pinker | David | 5 Impreza Road, Boston | 65332 | 811 409-6734 | 13 | 2012-08-16 11:32:47 |
| 20 | Genting | Matthew | 4 Nunnington Place, Wingfield, Boston | 52365 | (811) 972-1377 | 5 | 2012-08-19 14:55:55 |
| 21 | Mackenzie | Anna | 64 Perkington Lane, Reading | 64577 | (822) 661-2898 | 1 | 2012-08-26 09:32:05 |
| 22 | Coplin | Joan | 85 Bard Street, Bloomington, Boston | 43533 | (822) 499-2232 | 16 | 2012-08-29 08:32:41 |
| 24 | Sarwin | Ramnaresh | 12 Bullington Lane, Boston | 65464 | (822) 413-1470 | 15 | 2012-09-01 08:44:42 |
| 26 | Jones | Douglas | 976 Gnats Close, Reading | 11986 | 844 536-8036 | 11 | 2012-09-02 18:43:05 |
| 27 | Rumney | Henrietta | 3 Burkington Plaza, Boston | 78533 | (822) 989-8876 | 20 | 2012-09-05 08:42:35 |
| 28 | Farrell | David | 437 Granite Farm Road, Westford | 43532 | (855) 755-9876 |  | 2012-09-15 08:22:05 |
| 29 | Worthington-Smyth | Henry | 55 Jagbi Way, North Reading | 97676 | (855) 894-3758 | 2 | 2012-09-17 12:27:15 |
| 30 | Purview | Millicent | 641 Drudgery Close, Burnington, Boston | 34232 | (855) 941-9786 | 2 | 2012-09-18 19:04:01 |
| 33 | Tupperware | Hyacinth | 33 Cheerful Plaza, Drake Road, Westford | 68666 | (822) 665-5327 |  | 2012-09-18 19:32:05 |
| 35 | Hunt | John | 5 Bullington Lane, Boston | 54333 | (899) 720-6978 | 30 | 2012-09-19 11:32:45 |
| 36 | Crumpet | Erica | Crimson Road, North Reading | 75655 | (811) 732-4816 | 2 | 2012-09-22 08:36:38 |

</details>

<details><summary>Official hint</summary>

You can delete based on the output of a subquery

</details>

<details><summary>Official answer and discussion</summary>

```sql
delete from cd.members where memid not in (select memid from cd.bookings);
```

We can use subqueries to determine whether a row should be deleted or not. There's a couple of standard ways to do this. In our featured answer, the subquery produces a list of all the different member ids in the cd.bookings table. If a row in the table isn't in the list generated by the subquery, it gets deleted.

An alternative is to use a *correlated subquery*. Where our previous example runs a large subquery once, the correlated approach instead specifies a smaller subqueryto run against every row.

</details>
