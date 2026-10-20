# CMU 15-445 Fall 2024: Homework 1 (SQL): Official solutions

> Copied from the official solutions archive <https://15445.courses.cs.cmu.edu/fall2024/files/hw1-sols.tar.gz>: one query file per question. Nothing was written here.

## q1_sample.duckdb.sql

```sql
-- List all medal types in alphabetical order.

select distinct(name) from medal_info order by name;
```

## q2_successful_coaches.duckdb.sql

```sql
-- Find all successful coaches who have won at least one medal. List them in descending order by medal number,
-- then by name alphabetically.
--
-- Details:  A medal is credited to a coach if it shares the same country and discipline with the coach, 
-- regardless of the gender or event. Consider to use `winner_code` of one medal to decide its country.
-- Output Format: COACH_NAME|MEDAL_NUMBER

with t as (
	select code, country_code from teams group by code, country_code
),
medal_country as (
select 
    t1.discipline, 
    case when t1.country_code is not null 
        then t1.country_code 
        else athletes.country_code end 
        as country_code
from 
    (select * from medals left join t on medals.winner_code = t.code) as t1 
    left join athletes on athletes.code = t1.winner_code)

select name as coach_name, count(*) as medal_number
from medal_country, coaches
where 
    medal_country.discipline = coaches.discipline 
    and coaches.country_code = medal_country.country_code
group by code, name
order by medal_number desc, coach_name;
```

## q3_Judo_athlete_medals.duckdb.sql

```sql
-- Find all athletes in Judo discipline, and also list the number of medals they have won. Sort output in 
-- descending order by medal number first, then by name alphabetically.
--
-- Details: The medals counted do not have to be from the Judo discipline, and also be sure to include any
-- medals won as part of a team. If an athlete doesn't appear in the `athletes` table, please ignore him/her.
-- Assume that if a team participates in a competition, all team members are competing.
-- Output Format: ATHLETE_NAME|MEDAL_NUMBER

with team_medals as (
    select 
        athletes_code, count(*) as num 
    from 
        medals, teams 
    where medals.winner_code = teams.code 
    group by athletes_code 
),
person_medals as (
    select athletes.code as athletes_code, count(*) as num 
    from medals, athletes 
    where medals.winner_code = athletes.code 
    group by athletes.code
)

select name as athlete_name, team_num + person_num as medals_number
from
    (select 
        code, name, 
        case when t1.num is not null then t1.num else 0 end as team_num, 
        case when person_medals.num is not null then person_medals.num else 0 end as person_num
    from 
        (select * 
            from (athletes left join team_medals on athletes.code = team_medals.athletes_code)
        ) as t1 
        left join person_medals on t1.code = person_medals.athletes_code
    where t1.disciplines like '%Judo%')
order by medals_number desc, athlete_name;
```

## q4_Athletics_venue_athletes.duckdb.sql

```sql
-- For all venues that have hosted `Athletics` discipline competitions, list all athletes who have competed
-- at these venues, and sort them by the distance from their nationality country to the country they 
-- represented in descending order, then by name alphabetically.
--
-- Details: The athletes can have any discipline and can compete as a team member or an individual in these
-- venues. The distance between two countries is calculated as the sum square of the difference between their
-- latitudes and longitudes. Only output athletes who have valid information. (i.e., the athletes appear in
-- the athletes table and have non-null latitudes and longitudes for both countries.) Assume that if a team
-- participates in a competition, all team members are competing.
-- Output Format: ATHLETE_NAME|REPRESENTED_COUNTRY_CODE|NATIONALITY_COUNTRY_CODE

with a as (
    select *
    from athletes
    where code in 
        (select distinct participant_code
        from 
            (select participant_code
            from results left join venues on results.venue = venues.venue 
            where venues.disciplines like '%Athletics%' and participant_type = 'Person'
            union
            select athletes_code as participant_code from teams where code in (
                select participant_code
                from results left join venues on results.venue = venues.venue 
                where venues.disciplines like '%Athletics%' and participant_type = 'Team')))
)

select 
    name as athlete_name, 
    country_code as represented_country_code, 
    nationality_code as nationality_country_code
from 
    (select t.*, countries.Latitude as nationality_latitude, countries.Longitude as nationality_longitude
    from 
        (select a.*, countries.Latitude as country_latitude, countries.Longitude as country_longitude 
        from a left join countries on a.country_code = countries.code) as t 
        left join countries on t.nationality_code = countries.code
    where nationality_latitude is not null 
          and nationality_longitude is not null 
          and country_latitude is not null 
          and country_longitude is not null)
order by 
    (country_latitude - nationality_latitude)^2 + (country_longitude - nationality_longitude)^2 desc, athlete_name;
```

## q5_top5_rank_country_per_day.duckdb.sql

```sql
-- For each day, find the country with the highest number of appearances in the top 5 ranks (inclusive) of 
-- that day. For these countries, also list their population rank and GDP rank. Sort the output by date in 
-- ascending order.
--
-- Details: Only consider records from the `results` table where `rank` is not null when counting appearances.
-- Exclude days where all `rank` values are null from the output. In case of a tie in the number of
-- appearances, select the country that comes first alphabetically.  Keep the original format of the date.
-- Hint: Use the `result` table, and use the `participant_code` to get the corresponding country. If you cannot
-- get the country information for a record in the `result` table, ignore that record.
-- Output Format: DATE|COUNTRY_CODE|TOP5_APPEARANCES|GDP_RANK|POPULATION_RANK

with t as (
	select code, country_code from teams group by code, country_code
),
country_rank as (
select
    code,
    rank() over (order by "GDP ($ per capita)" desc) as gdp_rank,
    rank() over (ORDER BY "Population" desc) as population_rank
from
    countries
)

select 
    date, 
    country as country_code, 
    num as top5_appearances, 
    country_rank.gdp_rank as gdp_rank, 
    country_rank.population_rank as population_rank
from
    (select 
        *,
        row_number() over (partition by date order by num desc, country) as row_number
    from
        (select 
            date, 
            case when t1.country_code is not null then t1.country_code else athletes.country_code end as country, 
            count(*) as num
        from 
            (select * from results left join t on results.participant_code = t.code) 
            as t1 
            left join athletes on t1.participant_code = athletes.code
        where rank <= 5
        group by date, country)
    ) as t, country_rank
where row_number = 1 and country_rank.code = t.country
order by date;
```

## q6_big_progress_country_female_teams.duckdb.sql

```sql
-- List the five countries with the greatest improvement in the number of gold medals compared to the Tokyo
-- Olympics. For each of these five countries, list all their all-female teams. Sort the output first by
-- the increased number of gold medals in descending order, then by country code alphabetically, and last by
-- team code alphabetically.
--
-- Details: When calculating all-female teams, if the `athlete_code` in a record from the `teams` table is
-- not found in the `athletes` table, please ignore this record as if it doesn't exist.
-- Hints: You might find Lateral Joins in DuckDB useful: find out the 5 countries with largest progress first,
-- and then use lateral join to find their all-female reams.
-- Output Format: COUNTRY_CODE|INCREASED_GOLD_MEDAL_NUMBER|TEAM_CODE

with t as (
	select code, country_code from teams group by code, country_code
),
paris_medals as (
    select t2.country_code as country_code, count(t2.country_code) as medal_number 
    from
        (select 
            t1.medal_code, 
            case when t1.country_code is not null then t1.country_code else athletes.country_code end as country_code
        from 
            (select * from medals left join t on medals.winner_code = t.code) as t1 
            left join athletes on athletes.code = t1.winner_code
        ) as t2, 
        medal_info mi
    where t2.medal_code = mi.code and mi.name = 'Gold Medal'
    group by t2.country_code
    order by medal_number desc
)

select country as country_code, progress as increased_gold_medal_number, code as team_code
from (
    select 
        paris_medals.country_code as country, 
        paris_medals.medal_number - tokyo_medals.gold_medal as progress
    from tokyo_medals, paris_medals
    where paris_medals.country_code = tokyo_medals.country_code
    order by progress desc
    limit 5
) as countries, lateral (
    select teams.code as code
    from teams, athletes 
    where teams.athletes_code = athletes.code and teams.country_code = countries.country
    group by teams.code
    having sum(1 - gender) = 0
    )
order by progress desc, country, code;
```
