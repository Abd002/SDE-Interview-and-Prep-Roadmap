# CMU 15-445 Spring 2025: Homework 1 (SQL): Official solutions

> Copied from the official solutions archive <https://15445.courses.cs.cmu.edu/spring2025/files/hw1-solutions.tar.gz>: one query file per question. Nothing was written here.

## q1_sample.duckdb.sql

```sql
-- List all artist types in alphabetical order.

select distinct(name) from artist_type order by name;
```

## q2_independence.duckdb.sql

```sql
-- Find all artists born on July 4th in the United States who ever
-- released music in language other than English. List them in
-- alphabetical order.

-- Hints: Only consider the artists with artist type Person. United
-- States is an area name. If a release is in [Multiple languages],
-- consider it as not English.

-- Output Format: ARTIST_NAME

select distinct a.name as artist_name
from artist a
    join artist_type atype on a.type = atype.id
    join area on a.area = area.id
    join artist_credit_name acn on a.id = acn.artist
    join artist_credit ac on acn.artist_credit = ac.id
    join release r on ac.id = r.artist_credit
    join language l on r.language = l.id
where atype.name = 'Person'
    and area.name = 'United States'
    and a.begin_date_month = 7
    and a.begin_date_day = 4
    and l.name != 'English'
order by artist_name asc;
```

## q3_collaboration.duckdb.sql

```sql
-- Find the ten latest collaborative releases. Only consider the releases
-- with valid release date. Order the results by release date from 
-- newest to oldest, and then by release name.

-- Details: A release is collaborative if two or more artists are involved
-- in. A date is valid if it has non-null values for the year, month, and
-- day. Format the release date in the result as YYYY-MM-DD, without 
-- adding leading zeros if the month or day is less than 10.

-- Hints: The artist_count field in artist_credit denotes the number
-- of artists involved in a release.

-- Output Format: RELEASE_DATE|RELEASE_NAME|ARTIST_COUNT

select distinct
    rinfo.date_year || '-' || rinfo.date_month || '-' || rinfo.date_day as release_date,
    r.name as release_name,
    ac.artist_count as artist_count
from release r
    join artist_credit ac on r.artist_credit = ac.id
    join release_info rinfo on r.id = rinfo.release
where ac.artist_count > 1
    and rinfo.date_year is not null
    and rinfo.date_month is not null
    and rinfo.date_day is not null
order by
    rinfo.date_year desc,
    rinfo.date_month desc,
    rinfo.date_day desc,
    r.name asc
limit 10;
```

## q4_longest_cd.duckdb.sql

```sql
-- List the releases with the longest names in each CD-based medium 
-- format. Sort the result alphabetically by medium format name, and 
-- then release name. If there is a tie, include them all in the result.

-- Details: A medium is considered CD-based if its format name contains
-- the word CD.

-- Output Format: FORMAT_NAME|RELEASE_NAME

select distinct mf.name as format_name,
    r.name as release_name
from medium_format mf
    join (
        select mf.id as format_id,
            max(length(r.name)) as max_len
        from medium_format mf
            join medium m on mf.id = m.format
            join release r on m.release = r.id
        where mf.name like '%CD%'
        group by mf.id
    ) mfmx on mf.id = mfmx.format_id
    join medium m on mf.id = m.format
    join release r on m.release = r.id
where length(r.name) = mfmx.max_len
order by mf.name asc,
    r.name asc;
```

## q5_early_christmas.duckdb.sql

```sql
-- Find the 11 artists who released most christmas songs. For each artist,
-- list their oldest five releases in November with valid release date.
-- Organize the results by the number of each artist's christmas songs, 
-- highest to lowest. If two artists wrote the same number of christmas 
-- songs, order them alphabetically. After that, organize the release 
-- name alphabetically, and finally by the release date, oldest to newest.

-- Details: Only consider Person artists. A release is a christmas song 
-- if its name contains the word christmas, case-insensitively. A date is
-- valid if it has non-null values for the year, month, and day. Releases
-- with different release id is considered as different songs. If some of 
-- the 11 artists wrote releases less than five in November, just include
-- all of them. Format release_date in the output as YYYY-MM-DD, without
-- adding a leading zero if the month or day is less than 10.

-- Hints: You might find Lateral Joins in DuckDB useful: find out the 11
-- artists first, and then use lateral join to find their oldest five
-- releases.

-- Output Format: ARTIST_NAME|RELEASE_NAME|RELEASE_DATE

select artist_name,
    release_name,
    release_year || '-' || release_month || '-' || release_day as release_date
from (
    select a.id as artist_id,
        a.name as artist_name,
        count(distinct r.id) as release_count
    from artist a
        join artist_type atype on a.type = atype.id
        join artist_credit_name acn on a.id = acn.artist
        join artist_credit ac on acn.artist_credit = ac.id
        join release r on ac.id = r.artist_credit
    where
        atype.name = 'Person'
        and lower(r.name) like '%christmas%'
    group by a.id,
        a.name
    order by release_count desc,
        a.name asc
    limit 11
) t1, lateral (
    select distinct r.name as release_name,
        rinfo.date_year as release_year,
        rinfo.date_month as release_month,
        rinfo.date_day as release_day
    from artist_credit_name acn
        join artist_credit ac on acn.artist_credit = ac.id
        join release r on ac.id = r.artist_credit
        join release_info rinfo on r.id = rinfo.release
    where acn.artist = t1.artist_id
        and rinfo.date_year is not null
        and rinfo.date_month = 11
        and rinfo.date_day is not null
    order by rinfo.date_year asc,
        rinfo.date_month asc,
        rinfo.date_day asc
    limit 5
) t2
order by t1.release_count desc,
    t1.artist_name asc,
    t2.release_name asc,
    t2.release_year asc,
    t2.release_month asc,
    t2.release_day asc;
```

## q6_millennium.duckdb.sql

```sql
-- Find the artists in the United States whose last release and second
-- last release were both in 1999. Order the result by artist name, last
-- release name, and second last release name alphabetically.

-- Details: If there are releases with identical names and dates by the 
-- same artist, treat them as a single release and avoid duplicate 
-- entries. Only consider releases with a valid date. A date is valid if
-- it has non-null values for the year, month, and day. If two releases 
-- occurred on the same date, we consider the release with the name that
-- comes first in alphabetical order as the first release.

-- Output Format: ARTIST_NAME|LAST_RELEASE_NAME|SECOND_LAST_RELEASE_NAME

with cte_two_last_releases as (
select artist_id,
    release_name,
    release_year,
    row_number() over (
        partition by artist_id 
        order by release_year desc, 
            release_month desc,
            release_day desc, 
            release_name desc
    ) as row_number
from (
    select distinct a.id as artist_id,
        r.name as release_name,
        rinfo.date_year as release_year,
        rinfo.date_month as release_month,
        rinfo.date_day as release_day
    from artist a
        join area on a.area = area.id
        join artist_credit_name acn on a.id = acn.artist
        join artist_credit ac on acn.artist_credit = ac.id
        join release r on ac.id = r.artist_credit
        join release_info rinfo on r.id = rinfo.release
    where area.name = 'United States'
        and rinfo.date_year is not null
        and rinfo.date_month is not null
        and rinfo.date_day is not null
)
), cte_last_release as (
    select * from cte_two_last_releases where row_number = 1
), cte_second_last_release as (
    select * from cte_two_last_releases where row_number = 2
)
select a.name as artist_name,
    lr1.release_name as last_release_name,
    lr2.release_name as second_last_release_name
from artist a
    join cte_last_release lr1 on a.id = lr1.artist_id
    join cte_second_last_release lr2 on a.id = lr2.artist_id
where lr1.release_year = 1999
    and lr2.release_year = 1999
order by artist_name asc,
    last_release_name asc,
    second_last_release_name asc;
```

## q7_pso_friends.duckdb.sql

```sql
-- Find the ten youngest collaborators of the Pittsburgh Symphony Orchestra.
-- Exclude the Pittsburgh Symphony Orchestra itself from the final result.
-- Organize the results by the collaborator's begin date, youngest to oldest,
-- and then alphabetical order on their names. Only consider the artists
-- with valid begin_date.

-- Details: An artist is considered a collaborator if they appear in the
-- same artist credit. An artist is younger than another if they has later
-- begin_date. A date is valid if it has non-null values for the year, 
-- month, and day. Format the begin date as YYYY-MM-DD, without adding a
-- leading zero if the month or day is less than 10. Please always use 
-- the name field in the artist table when searching for a specific 
-- artist name.

-- Output Format: COLLABORATOR_NAME|BEGIN_DATE

-- To future TAs: Don't remove the last line, because some students use the artist_credit.name field,
-- which leads in slightly different results.

select distinct a2.name as collaborator_name,
    a2.begin_date_year || '-' || a2.begin_date_month || '-' || a2.begin_date_day as begin_date
from artist a
    join artist_credit_name acn on a.id = acn.artist
    join artist_credit ac on acn.artist_credit = ac.id
    join artist_credit_name acn2 on ac.id = acn2.artist_credit
    join artist a2 on acn2.artist = a2.id
where
    a.name = 'Pittsburgh Symphony Orchestra'
    and acn2.artist <> a.id
    and a2.begin_date_year is not null
    and a2.begin_date_month is not null
    and a2.begin_date_day is not null
order by a2.begin_date_year desc,
    a2.begin_date_month desc,
    a2.begin_date_day desc,
    a2.name asc
limit 10;
```

## q8_popular_language.duckdb.sql

```sql
-- For each area, find the language with most releases from the artist in
-- that area. Only include the areas where the most popular language has 
-- minimum of 5000 releases. Arrange the results in descending order 
-- based on the release count (per language per area), and in alphabetical
-- order by area name.

-- Details: When counting the number of releases, count the number of 
-- distinct release ids. If two areas have different ids with same names,
-- treat them as the same area. Note that we are interested in the area
-- of artists, not the area of releases.

-- Output Format: AREA_NAME|LANGUAGE_NAME|RELEASE_COUNT

select area_name,
    language_name,
    release_count
from (
    select area_name,
        language_name,
        release_count,
        row_number() over (
            partition by area_name
            order by release_count desc,
                language_name asc) as row_number
    from (
        select distinct area.name as area_name,
            l.name as language_name,
            count(distinct r.id) as release_count
        from area
            join artist a on area.id = a.area
            join artist_credit_name acn on a.id = acn.artist
            join artist_credit ac on acn.artist_credit = ac.id
            join release r on ac.id = r.artist_credit
            join language l on r.language = l.id
        group by area_name,
            language_name
    )
)
where row_number = 1
    and release_count >= 5000
order by release_count desc,
    area_name asc;
```

## q9_retire_in_us.duckdb.sql

```sql
-- For each decade from 1950s to 2010s (inclusive), count the number of 
-- non-US artists who has a US release in the same decade with their 
-- retirement. Order the result by decade, from oldest to newest.

-- Details: Print the decade in a string format like "1950s". Use
-- end_date_year to decide the retirement year.

-- Output Format: DECADE|RELEASE_COUNT

with release_cte as (
    select distinct
        area.id as release_area_id,
        r.artist_credit as release_artist_credit,
        cast(rinfo.date_year // 10 * 10 as varchar) || 's' as release_decade
    from release r
        join release_info rinfo on r.id = rinfo.release
        join area on rinfo.area = area.id
    where
        rinfo.date_year >= 1950
        and rinfo.date_year <= 2019
        and area.name = 'United States'
)
select release_decade,
    count(distinct a.id) as artist_count
from release_cte r
    join artist_credit ac on r.release_artist_credit = ac.id
    join artist_credit_name acn on ac.id = acn.artist_credit
    join artist a on acn.artist = a.id
    join area on a.area = area.id
where a.area != release_area_id
    and cast(a.end_date_year // 10 * 10 as varchar) || 's' = release_decade
group by release_decade
order by release_decade asc;
```

## q10_multinational.duckdb.sql

```sql
-- Find all releases before 1950 (inclusive) created by artists from 
-- multiple areas. Exclude if at least one of its artists are from the 
-- United States. For each release, print the release name, year, the 
-- number of distinct areas where its artists are from, and the list of 
-- the area names in alphabetical order, separated by commas. Order the 
-- result by the area count, higest to lowest, and then by the release 
-- year, oldest to newest, and then by the release name alphabetically.

-- Output Format: RELEASE_NAME|RELEASE_YEAR|ARTIST_AREA_COUNT|ARTIST_AREA_NAMES

with multi_area_releases as (
    select *
    from (
        select release_id,
            count(distinct artist_area_name) as artist_area_count,
            group_concat(artist_area_name, ',' order by artist_area_name) as artist_area_names
        from (
            select distinct r.id as release_id,
                area.name as artist_area_name
            from release r
                join release_info rinfo on r.id = rinfo.release
                join artist_credit ac on r.artist_credit = ac.id
                join artist_credit_name acn on ac.id = acn.artist_credit
                join artist a on acn.artist = a.id
                join area on a.area = area.id
            where rinfo.date_year <= 1950
        )
        group by release_id
    )
    where artist_area_count > 1
)
select
    r.name as release_name,
    rinfo.date_year as release_year,
    artist_area_count,
    artist_area_names
from multi_area_releases mar
    join release r on mar.release_id = r.id
    join release_info rinfo on r.id = rinfo.release
where artist_area_names not like '%United States%'
order by artist_area_count desc,
    release_year,
    release_name;
```
