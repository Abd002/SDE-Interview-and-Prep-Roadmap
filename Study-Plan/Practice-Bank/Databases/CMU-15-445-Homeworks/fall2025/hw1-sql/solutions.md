# CMU 15-445 Fall 2025: Homework 1 (SQL): Official solutions

> Copied from the official solutions archive <https://15445.courses.cs.cmu.edu/fall2025/files/hw1-sols.tar.gz>: one query file per question. Nothing was written here.

## q1_sample.duckdb.sql

```sql
select distinct division from divisions where active = 'Y' order by division;
```

## q2_hr.duckdb.sql

```sql
with schoolids as (
  -- Find all schoolID in state of PA
  select schoolID from schools where state = 'PA'
),
players as (
  -- Find all players who played for a PA school
  select distinct people.playerID, nameFirst, nameGiven, nameLast
  from people, collegeplaying, schoolids
  where collegeplaying.schoolID = schoolids.schoolID and collegeplaying.playerID = people.playerID
),
stats (playerID, max_hr_appearance) as (
  select playerID, max(HR)
  from appearances
  group by playerID 
)

select (nameFirst || ' (' || nameGiven || ') ' || nameLast) as name, max_hr_appearance
from players, stats
where players.playerID = stats.playerID
order by max_hr_appearance desc, nameFirst
limit 10;
```

## q3_mvp.duckdb.sql

```sql
select people.nameGiven, teamID, count(distinct awardsplayers.yearID) as distinct_years
 from people, awardsplayers, leagues, appearances
where
      -- Find awards given during active leagues after 1999
      awardsplayers.lgID = leagues.lgID and leagues.active = 'Y'
  and awardsplayers.yearID > 1999 
  and people.playerID = awardsplayers.playerID 
  and appearances.yearID = awardsplayers.yearID
  and appearances.lgID = leagues.lgID
  and appearances.playerID = awardsplayers.playerID
      -- Check G_batting is greater than average batting of all team player appearances after 1999
  and G_batting > (SELECT AVG(G_batting) FROM appearances a2 WHERE a2.yearID > 1999 and a2.teamID = appearances.teamID)
      -- Filter based on awardID
  and awardID IN ('Gold Glove')
group by nameGiven, teamID
order by distinct_years desc, people.nameGiven
limit 10
;
```

## q4_award.duckdb.sql

```sql
with aplayers as (
  -- find all triplets (leagueID, teamID, yearID)
  -- where the team from an active league has at least 5 players who won awards
  select leagues.lgID, teamID, awardsplayers.yearID
  from awardsplayers, leagues, appearances
  where awardsplayers.lgID = leagues.lgID and leagues.active = 'Y'
    and appearances.yearID = awardsplayers.yearID
    and appearances.lgID = leagues.lgID
    and appearances.playerID = awardsplayers.playerID
  group by leagues.lgID, teamID, awardsplayers.yearID
  having count(distinct awardsplayers.playerID) > 5
),
amanagers as (
  -- find all unique triplets (leagueID, teamID, yearID)
  -- where the team from an active league has a manager who won an award
  select distinct leagues.lgID, teamID, awardsmanagers.yearID
  from awardsmanagers, leagues, managers
  where awardsmanagers.lgID = leagues.lgID and leagues.active = 'Y'
    and managers.playerID = awardsmanagers.playerID
    and managers.yearID = awardsmanagers.yearID 
)

select league, name as team_name, count(distinct teams.yearID) as distinct_years
from leagues, teams, aplayers
where leagues.lgID = teams.lgID 
  -- First join gets (league, team, year) with at least 5 players who won awards
  and teams.teamID = aplayers.teamID
  and teams.yearID = aplayers.yearID
  and teams.lgID = aplayers.lgID
  -- Then we check in that same year, if the team manager has an award
  and exists (
	SELECT 1 FROM amanagers
         WHERE amanagers.lgID = teams.lgID and amanagers.teamID = teams.teamID and amanagers.yearID = teams.yearID
  )

-- Limit to the teams who have had the above event happen more than once.
group by league, name
having count(distinct teams.yearID) > 1
order by distinct_years desc, name
;
```

## q5_hof.duckdb.sql

```sql
SELECT hof_player.name AS hof_player_name,
       teammate.name AS earliest_teammate_name,
       teammate.yearID AS earliest_teammate_year
FROM (
    -- Get inducted players into hall of fame
    SELECT p.playerID, p.nameFirst || ' (' || p.nameGiven || ') ' || p.nameLast AS name
    FROM halloffame h
    JOIN people p ON h.playerID = p.playerID
    WHERE h.inducted = 'Y'
) AS hof_player
-- For each HOF player
JOIN LATERAL (
    SELECT a2.yearID, p2.playerID,
	  p2.nameFirst || ' (' || p2.nameGiven || ') ' || p2.nameLast AS name
    FROM appearances a1, appearances a2, people p2
      -- Find appearances a1 where the HOF player appeared
    WHERE a1.playerID = hof_player.playerID
      -- Find all appearances a2 of other players that overlap with HOF player
     AND a1.yearID = a2.yearID
     AND a1.teamID = a2.teamID
     AND a1.playerID <> a2.playerID
     AND a2.playerID = p2.playerID
    ORDER BY a2.yearID, name
    LIMIT 1
) AS teammate ON TRUE
ORDER BY hof_player.name, teammate.yearID
LIMIT 10;
```

## q6_upsert.duckdb.sql

```sql
insert into teams (yearID, lgID, teamID, attendance, teamRank)
select yearID, lgID, franchID, attendance, teamRank from teams
where yearID = 2024
on conflict do update set attendance = -1;
```
