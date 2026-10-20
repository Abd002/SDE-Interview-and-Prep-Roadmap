# CMU 15-445 Spring 2025: Homework 1 (SQL): Questions

> Copied from <https://15445.courses.cs.cmu.edu/spring2025/homework1/>. Nothing was answered or rewritten.

## Overview

The first homework is to construct a set of SQL queries for analyzing a dataset that will be provided to you. For this, you will look into [MusicBrainz data](https://musicbrainz.org/doc/MusicBrainz_Database). This homework is an opportunity to: (1) learn basic and certain advanced SQL features, and (2) get familiar with using two full-featured DBMSs, [SQLite](https://www.sqlite.org) and [DuckDB](https://duckdb.org), that can be useful for you in the future.

This is a single-person project that will be completed individually (i.e., no groups).

- **Release Date:** Jan 15, 2025

- **Due Date:** Jan 29, 2025 @ 11:59pm

## Specification

The homework contains 10 questions in total and is graded out of 100 points. For each question, you will need to construct a SQL query that fetches the desired data. Your answer for each question should contain only one statement. For **Q2, Q3, Q4 you are required to use both SQLite and DuckDB**, and for the other questions you are free to use either. It will likely take you approximately 8-10 hours to complete the questions.

### Placeholder Folder

Create the placeholder submission folder with the empty SQL files that you will use for each question:

```
$ mkdir placeholder
$ cd placeholder
$ touch q1_sample.$DBMS.sql \
        q2_independence.duckdb.sql \
        q2_independence.sqlite.sql \
        q3_collaboration.duckdb.sql \
        q3_collaboration.sqlite.sql \
        q4_longest_cd.duckdb.sql \
        q4_longest_cd.sqlite.sql \
        q5_early_christmas.$DBMS.sql \
        q6_millennium.$DBMS.sql \
        q7_pso_friends.$DBMS.sql \
        q8_popular_language.$DBMS.sql \
        q9_retire_in_us.$DBMS.sql \
        q10_multinational.$DBMS.sql

$DBMS = duckdb or sqlite depending on which DBMS you answered that question with
```

After filling in the queries, you can compress the folder by running the following command:

```
$ zip -j submission.zip placeholder/*.sql
```

The `-j` flag lets you compress all the SQL queries in the zip file without path information. The grading scripts will **not** work correctly unless you do this.

## Instructions

   
- 
   Download the [database dump file](https://15445.courses.cs.cmu.edu/spring2025/files/musicbrainz-cmudb2025.db.gz):
   
```
$ wget https://15445.courses.cs.cmu.edu/spring2025/files/musicbrainz-cmudb2025.db.gz
```

   Check its MD5 checksum to ensure that you have correctly downloaded the file:
   
```
$ md5sum musicbrainz-cmudb2025.db.gz
e0c1d36c1ab4cf5b13afff520b4554a2  musicbrainz-cmudb2025.db.gz
```

   
- 
   Unzip the database from the provided database dump by running the following commands on your shell. Note that the database file be **865MB** after you decompress it.
   
```
$ gunzip musicbrainz-cmudb2025.db.gz
```

   We have prepared a sample of the original dataset for this assignment. Although this is not required to complete the assignment, the complete dataset is available by following the steps [here](https://musicbrainz.org/doc/MusicBrainz_Database).

Then follow the instructions below to install SQLite and DuckDB.

### SQLite

You will first need to install SQLite on your development machine.

    Make sure that you are using at least SQLite version 3.25! Older releases (prior to 2019) will 
    **not** support the SQL features that you need to complete this assignment.

- **Ubuntu Linux:** Please follow the [instructions](https://www.tutorialspoint.com/sqlite/sqlite_installation.htm).

- **Mac OS X:** On Mac OS Leopard or later, you don't have to! It comes pre-installed. You can upgrade it, if you absolutely need to, with [Homebrew](https://brew.sh).

Then follow these instructions to load the dataset:

   
- 
   Check if `sqlite3` is properly working by [following this tutorial](https://sqlite.org/cli.html#getting_started).

   
- 
   Check the contents of the database by running the `.tables` command on the SQLite terminal. You should see **15 tables**, and the output should look like this:
   
```
$ sqlite3 musicbrainz-cmudb2025.db
SQLite version 3.45.3
Enter ".help" for usage hints.
sqlite> .tables
area                artist_credit_name  medium              release_status
artist              artist_type         medium_format       work
artist_alias        gender              release             work_type
artist_credit       language            release_info
```

   
- 
   Check the indexes by running the `.indexes` command on the SQLite terminal. You should see **13 indexes**, and the output should look like this:
   
```
sqlite> .indexes
ix_artist_alias           ix_medium_format_id       ix_work_name            
ix_artist_area            ix_medium_release         ix_work_type            
ix_artist_credit_id       ix_release_artist_credit  ix_work_type_name       
ix_artist_credit_name     ix_release_id           
ix_artist_name            ix_release_info_release
```

   where the indexes are created by the following commands:
   
```
CREATE INDEX ix_artist_name ON artist (name);
CREATE INDEX ix_artist_area ON artist (area);
CREATE INDEX ix_artist_credit_name ON artist_credit_name (artist_credit);
CREATE INDEX ix_artist_credit_id ON artist_credit (id);
CREATE INDEX ix_artist_alias ON artist_alias(artist);
CREATE INDEX ix_work_name ON work (name);
CREATE INDEX ix_work_type ON work (type);
CREATE INDEX ix_work_type_name ON work_type (name);
CREATE INDEX ix_release_id ON release (id);
CREATE INDEX ix_release_artist_credit ON release (artist_credit);
CREATE INDEX ix_release_info_release ON release_info (release);
CREATE INDEX ix_medium_release ON medium (release);
CREATE INDEX ix_medium_format_id on medium_format (id);
```

### DuckDB

Please follow the [instructions](https://duckdb.org/docs/installation/) to install DuckDB for the command line environment.

   
- To load the dataset into DuckDB, we use the [SQLite Scanner](https://duckdb.org/docs/extensions/sqlite_scanner.html) extension in DuckDB. Install the extension on the DuckDB terminal:

```
$ duckdb                         
v1.1.3 19864453f7
Enter ".help" for usage hints.
Connected to a transient in-memory database.
Use ".open FILENAME" to reopen on a persistent database.
D INSTALL sqlite_scanner;
```

   
- Then, we open `musicbrainz-cmudb5.db` on the DuckDB terminal:

```
D .open musicbrainz-cmudb2025.db
```

   Alternatively, we can directly load the dataset when we start DuckDB:

```
$ duckdb musicbrainz-cmudb2025.db
v1.1.3 19864453f7
Enter ".help" for usage hints.
D
```

   
- 
   You can check the contents of the database by running the `.tables` command and the `.indexes` on the DuckDB terminal. You should see **15 tables** and **13 indexes**. The output should look like this:

```
D .tables
area                artist_credit_name  medium              release_status    
artist              artist_type         medium_format       work              
artist_alias        gender              release             work_type         
artist_credit       language            release_info
D .indexes
ix_artist_alias           ix_medium_format_id       ix_work_name            
ix_artist_area            ix_medium_release         ix_work_type            
ix_artist_credit_id       ix_release_artist_credit  ix_work_type_name       
ix_artist_credit_name     ix_release_id           
ix_artist_name            ix_release_info_release
```

### Check the schema

Get familiar with the schema (structure) of the tables (what attributes do they contain, what are the primary and foreign keys). Run the `.schema $TABLE_NAME` command on the `sqlite3` terminal for each table. The output should look like the example below for each table.

#### area

```
sqlite> .schema area
CREATE TABLE [area] (
   [id] INTEGER,
   [name] TEXT,
   [comment] TEXT
);
```

Contains details for an area. For example, this is a row from the table:

```
95339|Great Neck|village
```

For us, the important field is `name` (e.g., "Great Neck").

#### artist

```
sqlite> .schema artist
CREATE TABLE [artist] (
   [id] INTEGER,
   [name] TEXT,
   [begin_date_year] INTEGER,
   [begin_date_month] INTEGER,
   [begin_date_day] INTEGER,
   [end_date_year] INTEGER,
   [end_date_month] INTEGER,
   [end_date_day] INTEGER,
   [type] INTEGER,
   [area] INTEGER,
   [gender] INTEGER,
   [comment] TEXT
);
CREATE INDEX ix_artist_name ON artist (name);
CREATE INDEX ix_artist_area ON artist (area);
```

Contains details of an artist. For example, this is a row from the table:

```
519|Michael Jackson|1958|8|29|2009|6|25|1|222|1|"King of Pop"
```

For us, the important fields are `name` (e.g., "Michael Jackson") and `area` (e.g., 222).

#### artist_alias

```
sqlite> .schema artist_alias
CREATE TABLE [artist_alias] (
   [id] INTEGER,
   [artist] INTEGER,
   [name] TEXT
);
CREATE INDEX ix_artist_alias ON artist_alias(artist);
```

Contains alternate names for the artists. For example, this is a row from the table:

```
125604|916107|AOA
```

#### artist_credit

```
sqlite> .schema artist_credit
CREATE TABLE [artist_credit] (
   [id] INTEGER,
   [name] TEXT,
   [artist_count] INTEGER
);
CREATE INDEX ix_artist_credit_id ON artist_credit (id);
```

Contains lists of artists. For example, this is a row from the table:

```
966419|Bounty Killer feat. Beenie Man & Dennis Brown|3
```

#### artist_credit_name

```
sqlite> .schema artist_credit_name
CREATE TABLE [artist_credit_name] (
   [artist_credit] INTEGER,
   [position] INTEGER,
   [artist] INTEGER,
   [name] TEXT
);
CREATE INDEX ix_artist_credit_id ON artist_credit (id);
```

Contains mappings from artist credits to artists. For example, this is a row from the table:

```
966419|0|39320|Bounty Killer
```

#### artist_type

```
sqlite> .schema artist_type
CREATE TABLE [artist_type] (
   [id] INTEGER,
   [name] TEXT
);
```

Contains details of an artist type. For example, this is a row from the table:

```
1|Person
```

#### gender

```
sqlite> .schema gender
CREATE TABLE [gender] (
   [id] INTEGER,
   [name] TEXT,
   [description] TEXT
);
```

Contains details for a gender type. For example, this is a row from the table:

```
1|Male|NULL
```

#### language

```
sqlite> .schema language
CREATE TABLE [language] (
   [id] INTEGER,
   [name] TEXT
);
```

Contains details for a language type. For example, this is a row from the table:

```
120|English
```

#### medium

```
sqlite> .schema medium
CREATE TABLE [medium] (
   [id] INTEGER,
   [release] INTEGER,
   [position] INTEGER,
   [format] INTEGER,
   [name] TEXT
);
CREATE INDEX ix_medium_release ON medium (release);
```

Contains details for a medium. For example, this is a row from the table:

```
287750|287750|1|8|NULL
```

For us, the important fields are `release` (e.g., 287750) and `type` (e.g., 8).

#### medium_format

```
sqlite> .schema medium_format
CREATE TABLE [medium_format] (
   [id] INTEGER,
   [name] TEXT,
   [description] TEXT
);
CREATE INDEX ix_medium_format_id on medium_format (id);
```

Contains details for a medium format. For example, this is a row from the table:

```
1|CD|NULL
```

#### release

```
sqlite> .schema release
CREATE TABLE [release] (
   [id] INTEGER,
   [name] TEXT,
   [artist_credit] INTEGER,
   [status] INTEGER,
   [language] INTEGER,
   [comment] TEXT
);
CREATE INDEX ix_release_id ON release (id);
CREATE INDEX ix_release_artist_credit ON release (artist_credit);
```

The table contains music releases. For example, this is a row from the table:

```
1671523|Back to the Future, Part III: Original Motion Picture Soundtrack|21443|1|120|25th anniversary edition
```

#### release_info

```
sqlite> .schema release_info
CREATE TABLE [release_info] (
   [release] INTEGER,
   [area] INTEGER,
   [date_year] INTEGER,
   [date_month] INTEGER,
   [date_day] INTEGER
);
CREATE INDEX ix_release_info_release ON release_info (release);
```

The table contains the detailed information of a release. For example, this is a row from the table:

```
1966419|222|2017|1|13
```

#### release_status

```
sqlite> .schema release_status
CREATE TABLE [release_status] (
   [id] INTEGER,
   [name] TEXT,
   [description] TEXT
);
```

Contains the details of a release status. For example, this is a row from the table:

```
1|Official|Any release officially sanctioned by the artist and/or their record company. Most releases will fit into this category.
```

#### work

```
sqlite> .schema work
CREATE TABLE [work] (
   [id] INTEGER,
   [name] TEXT,
   [type] INTEGER,
   [comment] TEXT
);
CREATE INDEX ix_work_name ON work (name);
CREATE INDEX ix_work_type ON work (type);
```

Contains the details of a work. For example, this is a row from the table:

```
12446282|Thousand Miles Behind|17|NULL
```

#### work_type

```
sqlite> .schema work_type
CREATE TABLE [work_type] (
   [id] INTEGER,
   [name] TEXT,
   [description] TEXT
);
CREATE INDEX ix_work_type_name ON work_type (name);
```

Contains the details of a work type. For example, this is a row from the table:

```
14|Quartet|A quartet is a musical composition scored for four voices or instruments.
```

#### Sanity Check

Count the number of rows in the table

```
sqlite> select count(*) from artist;
1682989
```

The following figure illustrates the schema of these tables:

### Construct the SQL Queries

It's time to start constructing the SQL queries and put them into the placeholder files. You can start with using SQLite.

   
#### Q1 [0 points]

   

The purpose of this query is to make sure that the formatting of your output matches exactly the formatting of our auto-grading script.

   

**File:** q1_sample
   

**Details:**
   List all the artist types ordered alphabetically.

   

**Answer**: Here's the correct SQL query and expected output:
   
```
sqlite> select distinct(name) from artist_type order by name;
Character
Choir
Group
Orchestra
Other
Person
```

   

You should put this SQL query into the appropriate file (q1_sample.$DBMS.sql)
   in the submission directory (placeholder).

   
#### Q2 [10 points]

   

Find all artists in the `United States` born on July 4th who ever released music in language other than `English`. List them in alphabetical order.

   

**File:** q2_independence

   

**Hints:** Only consider the artists with artist type `Person`. `United States` is an area name. If a release is in `[Multiple languages]`, consider it as not `English`.

   

Your output should look like this:
   
```
ARTIST_NAME
```

   

Your first row should look like this:
   
```
Bill Withers
```

   
#### Q3 [10 points]

   

Find the ten latest collaborative releases. Only consider the releases with valid release date. Order the results by release date from newest to oldest, and then by release name alphabetically.

   

**File:** q3_collaboration

   

**Details:** A release is collaborative if two or more artists are involved in it. A date is valid if it has non-null values for the year, month, and day. Format the release date in the result as `YYYY-MM-DD`, without adding leading zeros if the month or day is less than `10`.

   

**Hints:** The `artist_count` field in `artist_credit` table denotes the number of artists involved in a release.

   

Your output should look like this:
   
```
RELEASE_DATE|RELEASE_NAME|ARTIST_COUNT
```

   

Your first row should look like this:
   
```
2020-12-7|2009-05-04: Nassau Veterans Memorial Coliseum, Uniondale, NY, USA|2

   Q4 [10 points]
   List the releases with the longest names in each CD-based medium format. Sort the result alphabetically by medium format name, and then release name. If there is a tie, include them all in the result.

   File: q4_longest_cd

   Details: A medium is considered CD-based if its format name contains the word CD.

   Your output should look like this:
   FORMAT_NAME|RELEASE_NAME
```

   

One of the rows in the output looks like the following:
   
```
DVDplus (CD side)|Metal Meets Classic Live
```

   **Note:** At this point you should have completed three queries (Q2/Q3/Q4) in SQLite. Construct the queries again in DuckDB and compare their performance. You can turn on timer in both systems by running the following command in the DBMS terminal:
   
```
sqlite> .timer on
```

   

After this question, you are free to choose either SQLite or DuckDB for the remaining questions.

   
#### Q5 [10 points]

   

Find the 11 artists who released most christmas songs. For each artist, list their oldest five releases in November with valid release date. Organize the results by the number of each artist's christmas songs, highest to lowest. If two artists released the same number of christmas songs, order them alphabetically. After that, organize the release name alphabetically, and finally by the release date, oldest to newest.

   

**File:** q5_early_christmas

   

**Details:** Only consider `Person` artists. A release is a christmas song if its name contains the word `christmas`, case-insensitively. When finding the 11 artists, if there's a tie, artists who comes first in alphabetical order takes the priority. A date is valid if it has non-null values for the year, month, and day. When counting the number of christmas songs, simply count the number of distinct release IDs. However, when finding the five oldest releases in November, releases with same name and date are considered the same. If some of the 11 artists wrote releases less than five in November, just include all of them. Format release date in the result as `YYYY-MM-DD`, without adding a leading zero if the month or day is less than `10`.

   

**Hints:** You might find [Lateral Joins](https://duckdb.org/docs/sql/query_syntax/from.html#lateral-joins) in DuckDB useful: find out the 11 artists first, and then use lateral join to find their oldest five releases.

   

Your output should look like this:
   
```
ARTIST_NAME|RELEASE_NAME|RELEASE_DATE
```

   

Your first row should look like this:
   
```
Bing Crosby|Bing Crosby at Christmas|2013-11-16
```

   
#### Q6 [10 points]

   

Find the artists in the `United States` whose last release and second last release were both in 1999. Order the result by artist name, last release name, and second last release name alphabetically.

   

**File:** q6_millennium

   

**Details:** If there are releases with identical names and dates by the same artist, treat them as a single release and avoid duplicate entries. Only consider releases with a valid date. A date is valid if it has non-null values for the year, month, and day. If two releases occurred on the same date, we consider the release with the name that comes first in alphabetical order as the first release.

   

Your output should look like this:
   
```
ARTIST_NAME|LAST_RELEASE_NAME|SECOND_LAST_RELEASE_NAME
```

   

Your first row should look like this:
   
```
1000 Clowns|Freelance Bubblehead|(Not The) Greatest Rapper
```

  

   
#### Q7 [10 points]

   

Find the ten youngest collaborators of the `Pittsburgh Symphony Orchestra`. Exclude the `Pittsburgh Symphony Orchestra` itself from the final result. Organize the result by the collaborator's begin date, youngest to oldest, and then alphabetical order on their names. Only consider the artists with valid `begin_date`.

   

File: q7_pso_friends

   

**Details:** An artist is considered a collaborator if they appear in the same artist credit. An artist is younger than another if they has later `begin_date`. A date is valid if it has non-null values for the year, month, and day. Format the begin date as `YYYY-MM-DD`, without adding a leading zero if the month or day is less than 10. Please always use the `name` field in the `artist` table when searching for a specific artist name.

   

Your output should look like this:
   
```
COLLABORATOR_NAME|BEGIN_DATE
```

   

Your first row should look like this:
   
```
Sunhae Im|1976-1-15
```

   
#### Q8 [10 points]

   

For each area, find the language with most releases from the artists in that area. Only include the areas where the most popular language has minimum of `5000` releases (inclusive). Arrange the results in descending order based on the release count (per language per area), and in alphabetical order by area name.

   

**File:** q8_popular_language

   

**Details:** When counting the number of releases, count the number of distinct release ids. If two areas have different ids with same names, treat them as the same area. When selecting the most popular language for each area, if there is a tie, choose the one which its language name comes first alphabetically. Note that we are interested in the area of artists, not the area of releases.

   

Your output should look like this:
   
```
AREA_NAME|LANGUAGE_NAME|RELEASE_COUNT
```

   

Your first row should look like this:
   
```
United States│English│499086
```

   
#### Q9 [15 points]

   

For each decade from 1950s to 2010s (inclusive), count the number of non-US artists who has a US release in the same decade with their retirement. Order the result by decade, from oldest to newest.

   

File: q9_retire_in_us

   

**Details:** Print the decade in a string format like `1950s`. Use `end_date_year` to decide the retirement year.

   

Your output should look like this:
   
```
DECADE|RELEASE_COUNT
```

   

Your first row should look like this:
   
```
1950s│20
```

   
#### Q10 [15 points]

   

Find all releases before 1950 (inclusive) created by artists from multiple areas. Exclude if at least one of its artists are from the `United States`. For each release, print the release name, year, the number of distinct areas where its artists are from, and the list of area names in alphabetical order, separated by commas. Order the result by the area count, highest to lowest, and then by the release year, oldest to newest, and then by the release name alphabetically.

   

File: q10_multinational

   

Your output should look like this:
   
```
RELEASE_NAME|RELEASE_YEAR|ARTIST_AREA_COUNT|ARTIST_AREA_NAMES
```

   

The first output row should look like this:
   
```
La violetta / A Chloe│1949│3│Austria,Estonia,Italy
```

  

## Grading Rubric

Each submission will be graded based on whether the SQL queries fetch the expected sets of tuples from the database. Only one statement is allowed in each SQL query. Note that your SQL queries will be auto-graded by comparing their outputs (i.e. tuple sets) to the correct outputs. For your queries, the **order** of the output columns is important; their names are not.

## Late Policy

See the [late policy](https://15445.courses.cs.cmu.edu/spring2025/syllabus.html#late-policy) in the syllabus.

## Submission

We use the Autograder from Gradescope for grading in order to provide you with immediate feedback. After completing the homework, you can submit your compressed folder `submission.zip` (only one file) to Gradescope:

- **[https://www.gradescope.com/courses/935004](https://www.gradescope.com/courses/935004)**

**Important:** Use the Gradescope course code announced on Piazza.

We will be comparing the output files using a function similar to `diff`. You can submit your answers as many times as you like. 

## Collaboration Policy

- Every student has to work individually on this assignment.

- Students are allowed to discuss high-level details about the project with others.

- Students are **not** allowed to copy the contents of a white-board after a group meeting with other students.

- Students are **not** allowed to copy the solutions from another colleague.

    
    **WARNING:** All of the code for this project must be your own. You may not copy source code from other students or other sources that you find on the web. Plagiarism **will not** be tolerated. See CMU's [Policy on Academic Integrity](http://www.cmu.edu/policies/documents/Academic%20Integrity.htm) for additional information.
