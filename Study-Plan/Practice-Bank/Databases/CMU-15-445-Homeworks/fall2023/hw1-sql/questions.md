# CMU 15-445 Fall 2023: Homework 1 (SQL): Questions

> Copied from <https://15445.courses.cs.cmu.edu/fall2023/homework1/>. Nothing was answered or rewritten.

## Overview

The first homework is to construct a set of SQL queries for analyzing a dataset that will be provided to you. For this, you will look into [MusicBrainz data](https://musicbrainz.org/doc/MusicBrainz_Database). This homework is an opportunity to: (1) learn basic and certain advanced SQL features, and (2) get familiar with using two full-featured DBMSs, [SQLite](https://www.sqlite.org) and [DuckDB](https://duckdb.org), that can be useful for you in the future.

This is a single-person project that will be completed individually (i.e., no groups).

- **Release Date:** Aug 31, 2023

- **Due Date:** Sep 15, 2023 @ 11:59pm

## Specification

The homework contains 10 questions in total and is graded out of 100 points. For each question, you will need to construct a SQL query that fetches the desired data. For **Q2, Q3, Q4 you are required to use both SQLite and DuckDB**, and for the other questions you are free to use either. It will likely take you approximately 6-8 hours to complete the questions.

### Placeholder Folder

Create the placeholder submission folder with the empty SQL files that you will use for each question:

```
$ mkdir placeholder
$ cd placeholder
$ touch q1_sample.$DBMS.sql \
        q2_beatles_uk_releases.duckdb.sql \
        q2_beatles_uk_releases.sqlite.sql \
        q3_new_wine_in_old_bottles.duckdb.sql \
        q3_new_wine_in_old_bottles.sqlite.sql \
        q4_devil_in_the_details.duckdb.sql \
        q4_devil_in_the_details.sqlite.sql \
        q5_elvis_best_month.$DBMS.sql \
        q6_us_artist_groups_per_decade.$DBMS.sql \
        q7_pso_friends.$DBMS.sql \
        q8_john_not_john.$DBMS.sql \
        q9_music_in_the_world.$DBMS.sql \
        q10_latest_releases.$DBMS.sql

$DBMS = duckdb or sqlite depending on which DBMS you answered that question with
```

After filling in the queries, you can compress the folder by running the following command:

```
$ zip -j submission.zip placeholder/*.sql
```

The `-j` flag lets you compress all the SQL queries in the zip file without path information. The grading scripts will **not** work correctly unless you do this.

## Instructions

   
- 
   Download the [database dump file](https://15445.courses.cs.cmu.edu/fall2023/files/musicbrainz-cmudb2023.db.gz):
   
```
$ wget https://15445.courses.cs.cmu.edu/fall2023/files/musicbrainz-cmudb2023.db.gz
```

   Check its MD5 checksum to ensure that you have correctly downloaded the file:
   
```
$ md5sum musicbrainz-cmudb2023.db.gz
781dcc4049a1e85ad84061c0060c7801  musicbrainz-cmudb2023.db.gz
```

   
- 
   Unzip the database from the provided database dump by running the following commands on your shell. Note that the database file be **526MB** after you decompress it.
   
```
$ gunzip musicbrainz-cmudb2023.db.gz
```

   We have prepared a sample of the original dataset for this assignment. Although this is not required to complete the assignment, the complete dataset is available by following the steps [here](https://musicbrainz.org/doc/MusicBrainz_Database).

Then follow the instructions below to install SQLite and DuckDB.

### SQLite

You will first need to install SQLite on your development machine.

    Make sure that you are using at least SQLite version 3.25! Older releases (prior to 2019) will 
    **not** support the SQL features that you need to complete this assignment.

- **Ubuntu Linux:** Please follow the [instructions](https://www.tutorialspoint.com/sqlite/sqlite_installation.htm).

- **Mac OS X:** On Mac OS Leopard or later, you don't have to! It comes pre-installed. You can upgrade it, if you absolutely need to, with [Homebrew](https://brew.sh).

Then follow these instructions to load the database:

   
- 
   Check if `sqlite3` is properly working by [following this tutorial](https://sqlite.org/cli.html#getting_started).
s
   
- 
   Check the contents of the database by running the `.tables` command on the SQLite terminal. You should see **15 tables**, and the output should look like this:
   
```
$ sqlite3 musicbrainz-cmudb2023.db
SQLite version 3.32.3
Enter ".help" for usage hints.
sqlite> .tables
area                artist_credit_name  medium              release_status
artist              artist_type         medium_format       work
artist_alias        gender              release             work_type
artist_credit       language            release_info
```

   
- Create indices using the following commands in SQLite:
   
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

### Install DuckDB

Please follow the [instructions](https://duckdb.org/docs/archive/0.8.1/installation) to install DuckDB version 0.8.1 for the command line environment.

   
- To load the dataset into DuckDB, we use the [SQLite Scanner](https://duckdb.org/docs/extensions/sqlite_scanner.html) extension in DuckDB. First, create a new file `import.sql` and copy the following commands into it:

```
INSTALL sqlite_scanner;
LOAD sqlite_scanner;
CALL sqlite_attach('musicbrainz-cmudb2023.db');
PRAGMA show_tables;

ALTER VIEW area RENAME TO area_old;
CREATE TABLE area AS SELECT * FROM area_old;
DROP VIEW area_old;

ALTER VIEW artist RENAME TO artist_old;
CREATE TABLE artist AS SELECT * FROM artist_old;
DROP VIEW artist_old;

ALTER VIEW artist_alias RENAME TO artist_alias_old;
CREATE TABLE artist_alias AS SELECT * FROM artist_alias_old;
DROP VIEW artist_alias_old;

ALTER VIEW artist_credit RENAME TO artist_credit_old;
CREATE TABLE artist_credit AS SELECT * FROM artist_credit_old;
DROP VIEW artist_credit_old;

ALTER VIEW artist_credit_name RENAME TO artist_credit_name_old;
CREATE TABLE artist_credit_name AS SELECT * FROM artist_credit_name_old;
DROP VIEW artist_credit_name_old;

ALTER VIEW artist_type RENAME TO artist_type_old;
CREATE TABLE artist_type AS SELECT * FROM artist_type_old;
DROP VIEW artist_type_old;

ALTER VIEW gender RENAME TO gender_old;
CREATE TABLE gender AS SELECT * FROM gender_old;
DROP VIEW gender_old;

ALTER VIEW language RENAME TO language_old;
CREATE TABLE language AS SELECT * FROM language_old;
DROP VIEW language_old;

ALTER VIEW medium RENAME TO medium_old;
CREATE TABLE medium AS SELECT * FROM medium_old;
DROP VIEW medium_old;

ALTER VIEW medium_format RENAME TO medium_format_old;
CREATE TABLE medium_format AS SELECT * FROM medium_format_old;
DROP VIEW medium_format_old;

ALTER VIEW release RENAME TO release_old;
CREATE TABLE release AS SELECT * FROM release_old;
DROP VIEW release_old;

ALTER VIEW release_info RENAME TO release_info_old;
CREATE TABLE release_info AS SELECT * FROM release_info_old;
DROP VIEW release_info_old;

ALTER VIEW release_status RENAME TO release_status_old;
CREATE TABLE release_status AS SELECT * FROM release_status_old;
DROP VIEW release_status_old;

ALTER VIEW work RENAME TO work_old;
CREATE TABLE work AS SELECT * FROM work_old;
DROP VIEW work_old;

ALTER VIEW work_type RENAME TO work_type_old;
CREATE TABLE work_type AS SELECT * FROM work_type_old;
DROP VIEW work_type_old;

SELECT * from duckdb_tables();
```

- Then, we create a perisisent database and launch the DuckDB terminal on Ubuntu:

```
$ cat import.sql | ./duckdb musicbrainz-cmudb2023.duckdb
```

On Mac, run:

```
$ cat import.sql | duckdb musicbrainz-cmudb2023.duckdb
```

You should see an output like:

```
┌─────────┐
│ Success │
│ boolean │
├─────────┤
│ 0 rows  │
└─────────┘
┌────────────────────┐
│        name        │
│      varchar       │
├────────────────────┤
│ area               │
│ artist             │
│ artist_alias       │
│ artist_credit      │
│ artist_credit_name │
│ artist_type        │
│ gender             │
│ language           │
│ medium             │
│ medium_format      │
│ release            │
│ release_info       │
│ release_status     │
│ work               │
│ work_type          │
├────────────────────┤
│      15 rows       │
└────────────────────┘
```

followed by the list of the tables in DuckDB.

- 
You can double-check the contents of the database by running the `.tables` command in the DuckDB terminal. You should see **15 tables**, and the output should look like this:

```
D .tables
area                artist_credit_name  medium              release_status    
artist              artist_type         medium_format       work              
artist_alias        gender              release             work_type         
artist_credit       language            release_info
```

   
- If you ever close the connection to DuckDB terminal, your data will persist to disk. You can relaunch the the database by running the following command (on Ubuntu):

```
$ ./duckdb musicbrainz-cmudb2023.duckdb
```

Or on a Mac, relaunch with:

```
$ duckdb musicbrainz-cmudb2023.duckdb
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

   

File: q1_sample
   

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

   

Find all the `12" Vinyl` releases of the Beatles in the United Kingdoms up until the year they broke up.

   

File: q2_beatles_uk_releases
   

**Details:**
   List the release name and the release year. For multiple releases with the same name, you should pick the one with the earliest release year. You should order the results first by release year, then by release name.

   

**Hint:** `12" Vinyl` is a media format.

   

Your output should look like this:
   
```
RELEASE_NAME|RELEASE_YEAR
```

   

Your first row should look like this:
```
Please Please Me|1963
```

   
#### Q3 [10 points]

   

Find the ten newest release that has the medium format `Cassette`.

   

File: q3_new_wine_in_old_bottles
   

**Details:** Print the release name, the artist name, the year of release. You should sort the output by the release year, month, and day from newest to oldest, then by release name, artist name alphabetically.

   

Your output should look like this:
   
```
RELEASE_NAME|ARTIST_NAME|RELEASE_YEAR
```

   

Your first row should look like this:
   
```
Lesions of a Different Kind|Undeath|2020

   Q4 [10 points]
   Find works with the longest comment for each work type.

   File: q4_devil_in_the_details
   Details: List the work with the longest comment for each work type. If there is a tie, then all works with the longest comment should be returned. The final output should be sorted in ascending order by work type, then by work name alphabetically. Exclude works with empty (length 0) comments.

   Your output should look like this:
   WORK_TYPE|WORK_NAME|COMMENT_LENGTH|COMMENT
```

   

One of the rows in the output looks like the following:
   
```
Zarzuela|Mirentxu|17|original zarzuela
```

   **Note:** At this point you should have completed three queries (Q2/Q3/Q4) in SQLite. Construct the queries again in DuckDB and compare their performance. You can turn on timer in both systems by running the following command in the DBMS terminal:
   
```
sqlite> .timer on
```

   

After this question, you are free to choose either SQLite or DuckDB for the remaining questions.

   
#### Q5 [10 points]

   

Find the artist with top releases for each month.

   

File: q5_elvis_best_month
   

**Details:**  For each artist that is a `Person` and whose name starts with `Elvis`, find the month with the most releases. If there is a tie, then the earlier month should be chosen. The final output should be sorted in descending order by the number of releases, then by artist name alphabetically. Exclude releases where the month is not specified.

   

Your output should look like this:
   
```
ARTIST_NAME|RELEASE_MONTH|NUM_RELEASES
```

   

Your first row should look like this:
   
```
Elvis Presley|1|56
```

   
#### Q6 [10 points]

   

List the number of groups that were formed in the United States in each decades from 1900 to 2023.

   

File: q6_us_artist_groups_per_decade
   

**Details:**
   Print the decade in a fancier format by constructing a string that looks like this: `2000s`. Order the results by decade.

   

Your output should look like this:
   
```
DECADE|NUM_ARTIST_GROUP
```

   

Your first row should look like this:
   
```
1900s|6
```

   
#### Q7 [10 points]

   

List all the artists who have collaborated with Pittsburgh Symphony Orchestra.

   

File: q7_pso_friends
   

**Details:**
   Print the artist names in alphabetical order. An artist is considered a collaborator if they appear in the same artist credit. Please always use the `name` field in the `artist` table. The results should **not** include Pittsburgh Symphony Orchestra itself.

   
#### Q8 [10 points]

   

Find all Johns who don't have an alias that contains john.

   

File: q8_john_not_john
   

**Details:** Find all artists whose name ends with `John`. List the number of aliases they have and a comma separated string containing their aliases. The aliases should be concatenated alphabetically. Exclude the artists whose aliases contain the word `john` (upper case or lowercase). Also exclude the artists that do not have an alias. Order the results by the artist name alphabetically.

   

Your output should look like this:
   
```
ARTIST_NAME|NUM_ALIASES|COMMA_SEPARATED_LIST_OF_ALIASES
```

   

Your first row should look like this:
   
```
Anaïs St. John|1|Anaïs Brown
```

  

   
#### Q9 [15 points]

   

Compare and contrast the music market in 1950s and in 2010s. Find the languages with highest increase in market fraction.

   

File: q9_music_in_the_world
   

**Details:**
   List the language, its number of releases in 1950s, its number of releases in 2010s and the difference in market fraction. You should only list the languages whose market fraction has increased and round the result to the nearest thousandth. The market fraction can be calculated with number of releases in the language divided by the number of total releases in the corresponding decade. You should count releases in different areas as seperate releases.

   

Your output should look like this:
   
```
LANGUAGE|NUM_RELEASES_IN_1950S|NUM_RELEASES_IN_2010s|INCREASE
```

   

Your first row should look like this:
   
```
Japanese|21|57240|0.032
```

  

   
#### Q10 [15 points]

   

Find the latest three releases of male artists born in 1991 with exactly four artists appear in the credit. 

   

File: q10_latest_releases
   

**Details:** List the artist name, the release name, and the release year. You should order the output by artist name alphabetically, then by release date (year, month, day). Exclude artists with no release year. For a given release date (year, month, day), only output 1 entry per release. If a release has multiple release dates however, they should be considered as distinct entries.

   

**Hint:** You might find [Lateral Joins](https://duckdb.org/docs/sql/query_syntax/from.html#lateral-joins) in DuckDB useful.

   

Your output should look like this:
   
```
ARTIST_NAME|RELEASE_NAME|RELEASE_YEAR
```

   

Your first row should look like this:
   
```
Akim|Pa' olvidarte (Panamá remix)|2019
```

## Grading Rubric

Each submission will be graded based on whether the SQL queries fetch the expected sets of tuples from the database. Note that your SQL queries will be auto-graded by comparing their outputs (i.e. tuple sets) to the correct outputs. For your queries, the **order** of the output columns is important; their names are not.

## Late Policy

See the [late policy](https://15445.courses.cs.cmu.edu/fall2023/syllabus.html#late-policy) in the syllabus.

## Submission

We use the Autograder from Gradescope for grading in order to provide you with immediate feedback. After completing the homework, you can submit your compressed folder `submission.zip` (only one file) to Gradescope:

- **[https://www.gradescope.com/courses/579715](https://www.gradescope.com/courses/579715)**

**Important:** Use the Gradescope course code announced on Piazza.

We will be comparing the output files using a function similar to `diff`. You can submit your answers as many times as you like. 

## Collaboration Policy

- Every student has to work individually on this assignment.

- Students are allowed to discuss high-level details about the project with others.

- Students are **not** allowed to copy the contents of a white-board after a group meeting with other students.

- Students are **not** allowed to copy the solutions from another colleague.

    
    **WARNING:** All of the code for this project must be your own. You may not copy source code from other students or other sources that you find on the web. Plagiarism **will not** be tolerated. See CMU's [Policy on Academic Integrity](http://www.cmu.edu/policies/documents/Academic%20Integrity.htm) for additional information.
