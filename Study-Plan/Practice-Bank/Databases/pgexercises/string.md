# PostgreSQL Exercises: string

> Copied from <https://pgexercises.com/questions/string/>. Questions and answers are the source's own; nothing was answered or rewritten here.


Schema: ![Database schema](images/7672af674514.svg)

## 1. Format the names of members

Output the names of all members, formatted as 'Surname, Firstname'

<details><summary>Expected results</summary>

| name |
| --- |
| GUEST, GUEST |
| Smith, Darren |
| Smith, Tracy |
| Rownam, Tim |
| Joplette, Janice |
| Butters, Gerald |
| Tracy, Burton |
| Dare, Nancy |
| Boothe, Tim |
| Stibbons, Ponder |
| Owen, Charles |
| Jones, David |
| Baker, Anne |
| Farrell, Jemima |
| Smith, Jack |
| Bader, Florence |
| Baker, Timothy |
| Pinker, David |
| Genting, Matthew |
| Mackenzie, Anna |
| Coplin, Joan |
| Sarwin, Ramnaresh |
| Jones, Douglas |
| Rumney, Henrietta |
| Farrell, David |
| Worthington-Smyth, Henry |
| Purview, Millicent |
| Tupperware, Hyacinth |
| Hunt, John |
| Crumpet, Erica |
| Smith, Darren |

</details>

<details><summary>Official hint</summary>

Use the || operator to concatenate strings

</details>

<details><summary>Official answer and discussion</summary>

```sql
select surname || ', ' || firstname as name from cd.members
```

Building strings in sql is similar to other languages, with the exception of the concatenation operator: ||. Some systems (like SQL Server) use +, but || is the SQL standard.

</details>

## 2. Find facilities by a name prefix

Find all facilities whose name begins with 'Tennis'. Retrieve all columns.

<details><summary>Expected results</summary>

| facid | name | membercost | guestcost | initialoutlay | monthlymaintenance |
| --- | --- | --- | --- | --- | --- |
| 0 | Tennis Court 1 | 5 | 25 | 10000 | 200 |
| 1 | Tennis Court 2 | 5 | 25 | 8000 | 200 |

</details>

<details><summary>Official hint</summary>

Use the LIKE operator.

</details>

<details><summary>Official answer and discussion</summary>

```sql
select * from cd.facilities where name like 'Tennis%';
```

The SQL LIKE operator is a highly standard way of searching for a string using basic matching. The % character matches any string, while \_ matches any single character.

One point that's worth considering when you use LIKE is how it uses indexes. If you're using the 'C' [locale](http://www.postgresql.org/docs/current/static/locale.html), any LIKE string with a fixed beginning (as in our example here) can use an index. If you're using any other locale, LIKE will not use any index by default. See [here](http://www.postgresql.org/docs/current/static/indexes-opclass.html) for details on how to change that.

</details>

## 3. Perform a case-insensitive search

Perform a case-insensitive search to find all facilities whose name begins with 'tennis'. Retrieve all columns.

<details><summary>Expected results</summary>

| facid | name | membercost | guestcost | initialoutlay | monthlymaintenance |
| --- | --- | --- | --- | --- | --- |
| 0 | Tennis Court 1 | 5 | 25 | 10000 | 200 |
| 1 | Tennis Court 2 | 5 | 25 | 8000 | 200 |

</details>

<details><summary>Official hint</summary>

Use the UPPER function or the ILIKE operator.

</details>

<details><summary>Official answer and discussion</summary>

```sql
select * from cd.facilities where upper(name) like 'TENNIS%';
```

There's no direct operator for case-insensitive comparison in standard SQL. Fortunately, we can take a page from many other language's books, and simply force all values into upper case when we do our comparison. This renders case irrelevant, and gives us our result.

Alternatively, Postgres does provide the ILIKE operator, which performs case insensitive searches. This isn't standard SQL, but it's arguably more clear.

You should realise that running a function like UPPER over a column value prevents Postgres from making use of any indexes on the column (the same is true for ILIKE). Fortunately, Postgres has got your back: rather than simply creating indexes over columns, you can also create indexes over [expressions](http://www.postgresql.org/docs/current/static/indexes-expressional.html). If you created an index over UPPER(name), this query could use it quite happily.

</details>

## 4. Find telephone numbers with parentheses

You've noticed that the club's member table has telephone numbers with very inconsistent formatting. You'd like to find all the telephone numbers that contain parentheses, returning the member ID and telephone number sorted by member ID.

<details><summary>Expected results</summary>

| memid | telephone |
| --- | --- |
| 0 | (000) 000-0000 |
| 3 | (844) 693-0723 |
| 4 | (833) 942-4710 |
| 5 | (844) 078-4130 |
| 6 | (822) 354-9973 |
| 7 | (833) 776-4001 |
| 8 | (811) 433-2547 |
| 9 | (833) 160-3900 |
| 10 | (855) 542-5251 |
| 11 | (844) 536-8036 |
| 13 | (855) 016-0163 |
| 14 | (822) 163-3254 |
| 15 | (833) 499-3527 |
| 20 | (811) 972-1377 |
| 21 | (822) 661-2898 |
| 22 | (822) 499-2232 |
| 24 | (822) 413-1470 |
| 27 | (822) 989-8876 |
| 28 | (855) 755-9876 |
| 29 | (855) 894-3758 |
| 30 | (855) 941-9786 |
| 33 | (822) 665-5327 |
| 35 | (899) 720-6978 |
| 36 | (811) 732-4816 |
| 37 | (822) 577-3541 |

</details>

<details><summary>Official hint</summary>

Look up the ~ or SIMILAR TO operators in the Postgres docs.

</details>

<details><summary>Official answer and discussion</summary>

```sql
select memid, telephone from cd.members where telephone ~ '[()]';
```

We've chosen to answer this using regular expressions, although Postgres does provide other string functions like POSITION that would do the job at least as well. Postgres implements POSIX regular expression matching via the ~ operator. If you've used regular expressions before, the functionality of the operator will be very familiar to you.

As an alternative, you can use the SQL standard SIMILAR TO operator. The regular expressions for this have similarities to the POSIX standard, but a lot of differences as well. Some of the most notable differences are:

- As in the LIKE operator, SIMILAR TO uses the '\_' character to mean 'any character', and the '%' character to mean 'any string'.- A SIMILAR TO expression must match the whole string, not just a substring as in posix regular expressions. This means that you'll typically end up bracketing an expression in '%' characters.- The '.' character does not mean 'any character' in SIMILAR TO regexes: it's just a plain character.

The SIMILAR TO equivalent of the given answer is shown below:

</details>

## 5. Pad zip codes with leading zeroes

The zip codes in our example dataset have had leading zeroes removed from them by virtue of being stored as a numeric type. Retrieve all zip codes from the members table, padding any zip codes less than 5 characters long with leading zeroes. Order by the new zip code.

<details><summary>Expected results</summary>

| zip |
| --- |
| 00000 |
| 00234 |
| 00234 |
| 04321 |
| 04321 |
| 10383 |
| 11986 |
| 23423 |
| 28563 |
| 33862 |
| 34232 |
| 43532 |
| 43533 |
| 45678 |
| 52365 |
| 54333 |
| 56754 |
| 57392 |
| 58393 |
| 64577 |
| 65332 |
| 65464 |
| 66796 |
| 68666 |
| 69302 |
| 75655 |
| 78533 |
| 80743 |
| 84923 |
| 87630 |
| 97676 |

</details>

<details><summary>Official hint</summary>

Check out the LPAD function. You'll also need to cast the zipcode column to a character string.

</details>

<details><summary>Official answer and discussion</summary>

```sql
select lpad(cast(zipcode as char(5)),5,'0') zip from cd.members order by zip
```

Postgres' LPAD function is the star of this particular show. It does basically what you'd expect: allow us to produce a padded string. We need to remember to cast the zipcode to a string for it to be accepted by the LPAD function.

When inheriting an old database, It's not that unusual to find wonky decisions having been made over data types. You may wish to fix mistakes like these, but have a lot of code that would break if you changed datatypes. In that case, one option (depending on performance requirements) is to create a [view](http://www.postgresql.org/docs/current/static/sql-createview.html) over your table which presents the data in a fixed-up manner, and gradually migrate.

</details>

## 6. Count the number of members whose surname starts with each letter of the alphabet

You'd like to produce a count of how many members you have whose surname starts with each letter of the alphabet. Sort by the letter, and don't worry about printing out a letter if the count is 0.

<details><summary>Expected results</summary>

| letter | count |
| --- | --- |
| B | 5 |
| C | 2 |
| D | 1 |
| F | 2 |
| G | 2 |
| H | 1 |
| J | 3 |
| M | 1 |
| O | 1 |
| P | 2 |
| R | 2 |
| S | 6 |
| T | 2 |
| W | 1 |

</details>

<details><summary>Official hint</summary>

You'll need the SUBSTR function here, combined with some aggregation.

</details>

<details><summary>Official answer and discussion</summary>

```sql
select substr (mems.surname,1,1) as letter, count(*) as count 
    from cd.members mems
    group by letter
    order by letter
```

This exercise is fairly straightforward. You simply need to retrieve the first letter of the member's surname, and do some basic aggregation to achieve a count. We use the SUBSTR function here, but there's a variety of other ways you can achieve the same thing. The LEFT function, for example, returns you the first n characters from the left of the string. Alternatively, you could use the SUBSTRING function, which allows you to use regular expressions to extract a portion of the string.

One point worth noting: as you can see, string functions in SQL are based on 1-indexing, not the 0-indexing that you're probably used to. This will likely trip you up once or twice before you get used to it :-)

</details>

## 7. Clean up telephone numbers

The telephone numbers in the database are very inconsistently formatted. You'd like to print a list of member ids and numbers that have had '-','(',')', and ' ' characters removed. Order by member id.

<details><summary>Expected results</summary>

| memid | telephone |
| --- | --- |
| 0 | 0000000000 |
| 1 | 5555555555 |
| 2 | 5555555555 |
| 3 | 8446930723 |
| 4 | 8339424710 |
| 5 | 8440784130 |
| 6 | 8223549973 |
| 7 | 8337764001 |
| 8 | 8114332547 |
| 9 | 8331603900 |
| 10 | 8555425251 |
| 11 | 8445368036 |
| 12 | 8440765141 |
| 13 | 8550160163 |
| 14 | 8221633254 |
| 15 | 8334993527 |
| 16 | 8339410824 |
| 17 | 8114096734 |
| 20 | 8119721377 |
| 21 | 8226612898 |
| 22 | 8224992232 |
| 24 | 8224131470 |
| 26 | 8445368036 |
| 27 | 8229898876 |
| 28 | 8557559876 |
| 29 | 8558943758 |
| 30 | 8559419786 |
| 33 | 8226655327 |
| 35 | 8997206978 |
| 36 | 8117324816 |
| 37 | 8225773541 |

</details>

<details><summary>Official hint</summary>

Consider the TRANSLATE or REGEXP\_REPLACE functions.

</details>

<details><summary>Official answer and discussion</summary>

```sql
select memid, translate(telephone, '-() ', '') as telephone
    from cd.members
    order by memid;
```

The most direct solution is probably the TRANSLATE function, which can be used to replace characters in a string. You pass it three strings: the value you want altered, the characters to replace, and the characters you want them replaced with. In our case, we want all the characters deleted, so our third parameter is an empty string.

As is often the way with strings, we can also use regular expressions to solve our problem. The REGEXP\_REPLACE function provides what we're looking for: we simply pass a regex that matches all non-digit characters, and replace them with nothing, as shown below. The 'g' flag tells the function to replace as many instances of the pattern as it can find. This solution is perhaps more robust, as it cleans out more bad formatting.

</details>
