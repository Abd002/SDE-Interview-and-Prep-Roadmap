# PostgreSQL Exercises: date

> Copied from <https://pgexercises.com/questions/date/>. Questions and answers are the source's own; nothing was answered or rewritten here.


Schema: ![Database schema](images/7672af674514.svg)

## 1. Produce a timestamp for 1 a.m. on the 31st of August 2012

Produce a timestamp for 1 a.m. on the 31st of August 2012.

<details><summary>Expected results</summary>

| timestamp |
| --- |
| 2012-08-31 01:00:00 |

</details>

<details><summary>Official hint</summary>

There's a bunch of ways to do this, but the easiest is probably to look at the TIMESTAMP keyword.

</details>

<details><summary>Official answer and discussion</summary>

```sql
select timestamp '2012-08-31 01:00:00';
```

Here's a pretty easy question to start off with! SQL has a bunch of different date and time types, which you can peruse at your leisure over at the excellent [Postgres documentation](http://www.postgresql.org/docs/current/static/datatype-datetime.html). These basically allow you to store dates, times, or timestamps (date+time).

The approved answer is the best way to create a timestamp under normal circumstances. You can also use casts to change a correctly formatted string into a timestamp, for example:

</details>

## 2. Subtract timestamps from each other

Find the result of subtracting the timestamp '2012-07-30 01:00:00' from the timestamp '2012-08-31 01:00:00'

<details><summary>Expected results</summary>

| interval |
| --- |
| 32 days |

</details>

<details><summary>Official hint</summary>

You can use the '-' symbol on timestamps

</details>

<details><summary>Official answer and discussion</summary>

```sql
select timestamp '2012-08-31 01:00:00' - timestamp '2012-07-30 01:00:00' as interval;
```

Subtracting timestamps produces an INTERVAL data type. INTERVALs are a special data type for representing the difference between two TIMESTAMP types. When subtracting timestamps, Postgres will typically give an interval in terms of days, hours, minutes, seconds, without venturing into months. This generally makes life easier, since months are of variable lengths.

One of the useful things about intervals, though, is the fact that they *can* encode months. Let's imagine that I want to schedule something to occur in exactly one month's time, regardless of the length of my month. To do this, I could use [timestamp] + interval '1 month'.

Intervals stand in contrast to SQL's treatment of DATE types. Dates don't use intervals - instead, subtracting two dates will return an integer representing the number of days between the two dates. You can also add integer values to dates. This is sometimes more convenient, depending on how much intelligence you require in the handling of your dates!

</details>

## 3. Generate a list of all the dates in October 2012

Produce a list of all the dates in October 2012. They can be output as a timestamp (with time set to midnight) or a date.

<details><summary>Expected results</summary>

| ts |
| --- |
| 2012-10-01 00:00:00 |
| 2012-10-02 00:00:00 |
| 2012-10-03 00:00:00 |
| 2012-10-04 00:00:00 |
| 2012-10-05 00:00:00 |
| 2012-10-06 00:00:00 |
| 2012-10-07 00:00:00 |
| 2012-10-08 00:00:00 |
| 2012-10-09 00:00:00 |
| 2012-10-10 00:00:00 |
| 2012-10-11 00:00:00 |
| 2012-10-12 00:00:00 |
| 2012-10-13 00:00:00 |
| 2012-10-14 00:00:00 |
| 2012-10-15 00:00:00 |
| 2012-10-16 00:00:00 |
| 2012-10-17 00:00:00 |
| 2012-10-18 00:00:00 |
| 2012-10-19 00:00:00 |
| 2012-10-20 00:00:00 |
| 2012-10-21 00:00:00 |
| 2012-10-22 00:00:00 |
| 2012-10-23 00:00:00 |
| 2012-10-24 00:00:00 |
| 2012-10-25 00:00:00 |
| 2012-10-26 00:00:00 |
| 2012-10-27 00:00:00 |
| 2012-10-28 00:00:00 |
| 2012-10-29 00:00:00 |
| 2012-10-30 00:00:00 |
| 2012-10-31 00:00:00 |

</details>

<details><summary>Official hint</summary>

Take a look at Postgres' GENERATE\_SERIES function

</details>

<details><summary>Official answer and discussion</summary>

```sql
select generate_series(timestamp '2012-10-01', timestamp '2012-10-31', interval '1 day') as ts;
```

One of the best features of Postgres over other DBs is a simple function called GENERATE\_SERIES. This function allows you to generate a list of dates or numbers, specifying a start, an end, and an increment value. It's extremely useful for situations where you want to output, say, sales per day over the course of a month. A typical way to do that on a table containing a list of sales might be to use a SUM aggregation, grouping by the date and product type. Unfortunately, this approach has a flaw: if there are no sales for a given day, it won't show up! To make it work properly, you need to left join from a sequential list of timestamps to the aggregated data to fill in the blank spaces.

On other database systems, it's not uncommon to keep a 'calendar table' full of dates, with which you can perform these joins. Alternatively, on some systems you can write an analogue to generate\_series using recursive CTEs. Fortunately for us, Postgres makes our lives a lot easier!

</details>

## 4. Get the day of the month from a timestamp

Get the day of the month from the timestamp '2012-08-31' as an integer.

<details><summary>Expected results</summary>

| date\_part |
| --- |
| 31 |

</details>

<details><summary>Official hint</summary>

The easiest way to do this is with the EXTRACT function.

</details>

<details><summary>Official answer and discussion</summary>

```sql
select extract(day from timestamp '2012-08-31');
```

The EXTRACT function is used for getting sections of a timestamp or interval. You can get the value of any field in the timestamp as an integer.

</details>

## 5. Work out the number of seconds between timestamps

Work out the number of seconds between the timestamps '2012-08-31 01:00:00' and '2012-09-02 00:00:00'

<details><summary>Expected results</summary>

| date\_part |
| --- |
| 169200 |

</details>

<details><summary>Official hint</summary>

You can do this by extracting the epoch from the interval between two timestamps.

</details>

<details><summary>Official answer and discussion</summary>

```sql
select extract(epoch from (timestamp '2012-09-02 00:00:00' - '2012-08-31 01:00:00'));
```

The above answer is a Postgres-specific trick. Extracting the epoch converts an interval or timestamp into a number of seconds, or the number of seconds since epoch (January 1st, 1970) respectively. If you want the number of minutes, hours, etc you can just divide the number of seconds appropriately.

If you want to write more portable code, you will unfortunately find that you cannot use extract epoch. Instead you will need to use something like:

</details>

## 6. Work out the number of days in each month of 2012

For each month of the year in 2012, output the number of days in that month. Format the output as an integer column containing the month of the year, and a second column containing an interval data type.

<details><summary>Expected results</summary>

| month | length |
| --- | --- |
| 1 | 31 days |
| 2 | 29 days |
| 3 | 31 days |
| 4 | 30 days |
| 5 | 31 days |
| 6 | 30 days |
| 7 | 31 days |
| 8 | 31 days |
| 9 | 30 days |
| 10 | 31 days |
| 11 | 30 days |
| 12 | 31 days |

</details>

<details><summary>Official hint</summary>

Subtracting two timestamps will give you the interval you're looking for. You can use the EXTRACT function to get the month from a timestamp.

</details>

<details><summary>Official answer and discussion</summary>

```sql
select 	extract(month from cal.month) as month,
	(cal.month + interval '1 month') - cal.month as length
	from
	(
		select generate_series(timestamp '2012-01-01', timestamp '2012-12-01', interval '1 month') as month
	) cal
order by month;
```

This answer shows several of the concepts we've learned. We use the GENERATE\_SERIES function to produce a year's worth of timestamps, incrementing a month at a time. We then use the EXTRACT function to get the month number. Finally, we subtract each timestamp + 1 month from itself.

It's worth noting that subtracting two timestamps will always produce an interval in terms of days (or portions of a day). You won't just get an answer in terms of months or years, because the length of those time periods is variable.

</details>

## 7. Work out the number of days remaining in the month

For any given timestamp, work out the number of days remaining in the month. The current day should count as a whole day, regardless of the time. Use '2012-02-11 01:00:00' as an example timestamp for the purposes of making the answer. Format the output as a single interval value.

<details><summary>Expected results</summary>

| remaining |
| --- |
| 19 days |

</details>

<details><summary>Official hint</summary>

Take a look at the DATE\_TRUNC function

</details>

<details><summary>Official answer and discussion</summary>

```sql
select (date_trunc('month',ts.testts) + interval '1 month') 
		- date_trunc('day', ts.testts) as remaining
	from (select timestamp '2012-02-11 01:00:00' as testts) ts
```

The star of this particular show is the DATE\_TRUNC function. It does pretty much what you'd expect - truncates a date to a given minute, hour, day, month, and so on. The way we've solved this problem is to truncate our timestamp to find the month we're in, add a month to that, and subtract our timestamp. To ensure partial days get treated as whole days, the timestamp we subtract is truncated to the nearest day.

Note the way we've put the timestamp into a subquery. This isn't required, but it does mean you can give the timestamp a name, rather than having to list the literal repeatedly.

</details>

## 8. Work out the end time of bookings

Return a list of the start and end time of the last 10 bookings (ordered by the time at which they end, followed by the time at which they start) in the system.

<details><summary>Expected results</summary>

| starttime | endtime |
| --- | --- |
| 2013-01-01 15:30:00 | 2013-01-01 16:00:00 |
| 2012-09-30 19:30:00 | 2012-09-30 20:30:00 |
| 2012-09-30 19:00:00 | 2012-09-30 20:30:00 |
| 2012-09-30 19:30:00 | 2012-09-30 20:00:00 |
| 2012-09-30 19:00:00 | 2012-09-30 20:00:00 |
| 2012-09-30 19:00:00 | 2012-09-30 20:00:00 |
| 2012-09-30 18:30:00 | 2012-09-30 20:00:00 |
| 2012-09-30 18:30:00 | 2012-09-30 20:00:00 |
| 2012-09-30 19:00:00 | 2012-09-30 19:30:00 |
| 2012-09-30 18:30:00 | 2012-09-30 19:30:00 |

</details>

<details><summary>Official hint</summary>

You can multiply an interval by the number of slots in a booking.

</details>

<details><summary>Official answer and discussion</summary>

```sql
select starttime, starttime + slots*(interval '30 minutes') endtime
	from cd.bookings
	order by endtime desc, starttime desc
	limit 10
```

This question simply returns the start time for a booking, and a calculated end time which is equal to start time + (30 minutes \* slots). Note that it's perfectly okay to multiply intervals.

The other thing you'll notice is the use of order by and limit to get the last ten bookings. All this does is order the bookings by the (descending) time at which they end, and pick off the top ten.

</details>

## 9. Return a count of bookings for each month

Return a count of bookings for each month, sorted by month

<details><summary>Expected results</summary>

| month | count |
| --- | --- |
| 2012-07-01 00:00:00 | 658 |
| 2012-08-01 00:00:00 | 1472 |
| 2012-09-01 00:00:00 | 1913 |
| 2013-01-01 00:00:00 | 1 |

</details>

<details><summary>Official hint</summary>

You're probably going to want the date\_trunc function again.

</details>

<details><summary>Official answer and discussion</summary>

```sql
select date_trunc('month', starttime) as month, count(*)
	from cd.bookings
	group by month
	order by month
```

This one is a fairly simple reuse of concepts we've seen before. We simply count the number of bookings, and aggregate by the booking's start time, truncated to the month.

</details>

## 10. Work out the utilisation percentage for each facility by month

Work out the utilisation percentage for each facility by month, sorted by name and month, rounded to 1 decimal place. Opening time is 8am, closing time is 8.30pm. You can treat every month as a full month, regardless of if there were some dates the club was not open.

<details><summary>Expected results</summary>

| name | month | utilisation |
| --- | --- | --- |
| Badminton Court | 2012-07-01 00:00:00 | 23.2 |
| Badminton Court | 2012-08-01 00:00:00 | 59.2 |
| Badminton Court | 2012-09-01 00:00:00 | 76.0 |
| Massage Room 1 | 2012-07-01 00:00:00 | 34.1 |
| Massage Room 1 | 2012-08-01 00:00:00 | 63.5 |
| Massage Room 1 | 2012-09-01 00:00:00 | 86.4 |
| Massage Room 2 | 2012-07-01 00:00:00 | 3.1 |
| Massage Room 2 | 2012-08-01 00:00:00 | 10.6 |
| Massage Room 2 | 2012-09-01 00:00:00 | 16.3 |
| Pool Table | 2012-07-01 00:00:00 | 15.1 |
| Pool Table | 2012-08-01 00:00:00 | 41.5 |
| Pool Table | 2012-09-01 00:00:00 | 62.8 |
| Pool Table | 2013-01-01 00:00:00 | 0.1 |
| Snooker Table | 2012-07-01 00:00:00 | 20.1 |
| Snooker Table | 2012-08-01 00:00:00 | 42.1 |
| Snooker Table | 2012-09-01 00:00:00 | 56.8 |
| Squash Court | 2012-07-01 00:00:00 | 21.2 |
| Squash Court | 2012-08-01 00:00:00 | 51.6 |
| Squash Court | 2012-09-01 00:00:00 | 72.0 |
| Table Tennis | 2012-07-01 00:00:00 | 13.4 |
| Table Tennis | 2012-08-01 00:00:00 | 39.2 |
| Table Tennis | 2012-09-01 00:00:00 | 56.3 |
| Tennis Court 1 | 2012-07-01 00:00:00 | 34.8 |
| Tennis Court 1 | 2012-08-01 00:00:00 | 59.2 |
| Tennis Court 1 | 2012-09-01 00:00:00 | 78.8 |
| Tennis Court 2 | 2012-07-01 00:00:00 | 26.7 |
| Tennis Court 2 | 2012-08-01 00:00:00 | 62.3 |
| Tennis Court 2 | 2012-09-01 00:00:00 | 78.4 |

</details>

<details><summary>Official hint</summary>

Remember different months have different lengths - you'll need to calculate the number of available slots in each month. You need to find a way to retrieve an *integer* (rather than interval) number of days for the length of the month.

</details>

<details><summary>Official answer and discussion</summary>

```sql
select name, month, 
	round((100*slots)/
		cast(
			25*(cast((month + interval '1 month') as date)
			- cast (month as date)) as numeric),1) as utilisation
	from  (
		select facs.name as name, date_trunc('month', starttime) as month, sum(slots) as slots
			from cd.bookings bks
			inner join cd.facilities facs
				on bks.facid = facs.facid
			group by facs.facid, month
	) as inn
order by name, month
```

The meat of this query (the inner subquery) is really quite simple: an aggregation to work out the total number of slots used per facility per month. If you've covered the rest of this section and the category on aggregates, you likely didn't find this bit too challenging.

This query does, unfortunately, have some other complexity in it: working out the number of days in each month. We can calculate the number of days between two months by subtracting two timestamps with a month between them. This, unfortunately, gives us back on interval datatype, which we can't use to do mathematics. In this case we've worked around that limitation by converting our timestamps into *dates* before subtracting. Subtracting date types gives us an integer number of days.

A alternative to this workaround is to convert the interval into an *epoch* value: that is, a number of seconds. To do this use EXTRACT(EPOCH FROM month)/(24\*60\*60). This is arguably a much nicer way to do things, but is much less portable to other database systems.

</details>
