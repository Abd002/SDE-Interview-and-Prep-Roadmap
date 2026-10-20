# Berkeley CS186 Spring 2015: Final: Official solutions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/186>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

**I. Query Execution / Optimization (Derek) \[16 pts\]**<br>
**\[2 pts\]**<br>
1\. (499^2) \* 500 (or 124500500) pages

**\[5 pts\]**<br>
2a. 15000 I/Os<br>
1 pt partial credit for 33000 I/Os (did not apply selectivity predicate)<br>
2b. 5000 tuples

**\[2 pts\]**<br>
3a. #2<br>
3b. #2<br>
3c. #2<br>
3d. #1<br>
½ pt partial credit per correct choice

**\[3 pts\]**<br>
4\. a., b.<br>
1 pt partial credit per correct marking

**\[4 pts\]**<br>
5\. a,b<br>
½ pt partial credit per correct marking

**II. Indexing/Storage (Jay) \[17 pts\]**

**\[5pts\]**<br>
1a. False<br>
1b. False<br>
1c. True<br>
1d. False<br>
1e. True

**\[2 point per answer\] = 12 pts**<br>
Replacement Policy<br>
&emsp;● S1:  B - MRU since sequential flooding<br>
&emsp;● S2:  A - LRU for temporal locality<br>
&emsp;● S3:  D  - if queries requests are random, then any of the policies will perform<br>
&emsp;&emsp;approximately equivalently

File Layout, Index:<br>
&emsp;● S1: D - SortedFile on date, no index


---

<a id="page-2"></a>
**Page 2**

&emsp;&emsp;&emsp;○ just do sequential scans on sorted file<br>
&emsp;● S2: B - HeapFile with Clustered B+ tree on userid<br>
&emsp;&emsp;&emsp;○ since this constitutes 60% of the data, and fairly write heavy, clustered B+ tree is<br>
&emsp;&emsp;&emsp;&emsp;better choice than SortedFile<br>
&emsp;&emsp;&emsp;○ partial credit for SortedFile on userid, No index<br>
&emsp;● S3: A - heapfile, Unclustered B+ tree on postid<br>
&emsp;&emsp;&emsp;○ use unclustered for point lookups, and no need for sorted file

**III. Database Design (Michelle)  \[18 pts\]**


![Figure on page 2](figures/solutions-p02-fig01.png)

&emsp;1.<br>
&emsp;&emsp;3.5 points: ½ pt for each edge, underlined key<br>
&emsp;2\. Questions, see diagram above for notation<br>
&emsp;&emsp;1.5 points: .5 for partial key, .5 for bolded entity, .5 for bolded reln<br>
&emsp;3\. Relation from student to itself or using aggregation<br>
&emsp;&emsp;2 points: 1 pts for making a new entity and a relationship<br>
&emsp;4\. a. A; b. E; c. NMI; d: E<br>
&emsp;5\. iv<br>
2 points: .5 for each<br>
&emsp;6\. a. NW, INS, NQTPR b. Yes; 3 pts<br>
&emsp;7\. INQ -\> RP, (or INQ -\> R, INQ -\> P), NQ -\> T, NQR -\> P; 4 pts

**IV. Concurrency (Vikram)  \[11.5pts\]**

&emsp;1\. 1 point each<br>
&emsp;&emsp;&emsp;a. False<br>
&emsp;&emsp;&emsp;b. False<br>
&emsp;&emsp;&emsp;c. True<br>
&emsp;&emsp;&emsp;d. False


---

<a id="page-3"></a>
**Page 3**

&emsp;&emsp;&emsp;e. True<br>
&emsp;2\. 1 point each<br>
&emsp;&emsp;&emsp;a. Yes<br>
&emsp;&emsp;&emsp;b. No<br>
&emsp;3\. T2, T3, T1, T4: 1 point each<br>
&emsp;4\. i, l

**V. Recovery (Varun) \[9 pts\]**

1.


![Figure on page 3](figures/solutions-p03-fig02.png)

2.


![Figure on page 3](figures/solutions-p03-fig03.png)

For partial credit, we accepted Aborting instead of Running for T3, because all transactions are<br>
essentially aborting during the UNDO phase.<br>
3.


![Figure on page 3](figures/solutions-p03-fig04.png)

4\. 20, 40, 50, 70, 80, 100, 120<br>
5.


![Figure on page 3](figures/solutions-p03-fig05.png)

6\. a, b. a is correct, because during the REDO phase of recovery, some UPDATE log records<br>
&emsp;that reflect writes that never made it to disk will be skipped. Similarly, b is correct, because<br>
&emsp;some CLR’s that reflect UNDO’s that never made it to disk will be skipped. c is incorrect<br>
&emsp;because no COMMIT log records are written during recovery. d is incorrect because even if<br>
&emsp;REDO begins at a later LSN, the system does not add any new transactions to the<br>
&emsp;transaction table during REDO.

**VI. SQL Anthony  \[15 pts\]**


---

<a id="page-4"></a>
**Page 4**

`Passenger``(`<br>
&emsp;&emsp;`pid (int),`<br>
&emsp;&emsp;`first_name (text) NOT NULL,`<br>
&emsp;&emsp;`last_name (text) NOT NULL`<br>
`)`

`Driver``(`<br>
&emsp;&emsp;`did (int),`<br>
&emsp;&emsp;`first_name (text) NOT NULL,`<br>
&emsp;&emsp;`last_name (text) NOT NULL`<br>
`)`

`Trip``(`<br>
&emsp;&emsp;`tid (int),`<br>
&emsp;&emsp;`pid (int references Passenger(pid) NOT NULL),`<br>
&emsp;&emsp;`did (int references Driver(did) NOT NULL),`<br>
&emsp;&emsp;`start_time (timestamp) NOT NULL,`<br>
&emsp;&emsp;`end_time (timestamp) NOT NULL,`<br>
&emsp;&emsp;`distance (decimal) NOT NULL,`<br>
&emsp;&emsp;`passenger_rating (decimal),`<br>
&emsp;&emsp;`driver_rating (decimal)`<br>
`)`

&emsp;&emsp;1\.    You hypothesize that some months of the year are more popular than others,<br>
&emsp;perhaps due to weather or special events like holidays. To assess this, you want to know<br>
&emsp;how many trips were completed in each month, independent of year.

`CREATE VIEW` `num_trips_by_month` `AS`<br>
`SELECT` `EXTRACT(MONTH FROM start_time) AS month,`<br>
&emsp;&emsp;&emsp;&emsp;`COUNT(*) AS num_trips`<br>
`FROM` `Trips`<br>
`GROUP BY` `EXTRACT(MONTH FROM start_time);`

Note: `EXTRACT(MONTH FROM _____)` is a PostgreSQL function that extracts the numeric<br>
month (e.g. January = 1) out of a timestamp or interval.

&emsp;2\. You want to prepare your staff next year to improve heavily on the poorest performing<br>
&emsp;&emsp;month(s) (independent of year). Which month(s) had the minimum number of trips? (Use<br>
&emsp;&emsp;the view created in Q1)

`SELECT`  `month`<br>
`FROM`  `num_trips_by_month NTM` `JOIN`<br>
&emsp;&emsp;&emsp;&emsp;`(`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`SELECT` `MIN(NTM_TMP.num_trips) AS min_column`


---

<a id="page-5"></a>
**Page 5**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`FROM`  `num_trips_by_month NTM_TMP;`<br>
&emsp;&emsp;&emsp;&emsp;`) MIN_TABLE`<br>
&emsp;&emsp;&emsp;&emsp;`ON` `NTM.num_trips = MIN_TABLE.min_column;`

&emsp;3\. a. Which drivers have a perfect 5.0 average rating from all their trips that received driver<br>
&emsp;&emsp;ratings? (Return just the unique `did`)

`SELECT`  `T1.did`<br>
`FROM`  `Trip AS T1`<br>
`WHERE`  `5.0 = ALL(`<br>
`SELECT` `T2.driver_rating`<br>
`FROM`  `Trip AS T2`<br>
`WHERE`  `T1.did = T2.did AND driver_rating <> NULL;`<br>
&emsp;&emsp;`);`

&emsp;&emsp;also<br>
&emsp;&emsp;`SELECT`  `T1.did`<br>
`FROM`  `Trip AS T1`<br>
`WHERE`  `NOT EXISTS (`<br>
`SELECT` `*`<br>
`FROM`  `Trip AS T2`<br>
`WHERE`  `T1.did = T2.did AND driver_rating < 5.0;`

&emsp;&emsp;b. When executing this query, you find that this query runs very slowly. What about the<br>
&emsp;&emsp;structure of this query may cause it to execute so slowly?

&emsp;&emsp;&emsp;A. B. C.

&emsp;&emsp;c. You attempt re-writing this same query with the hope of speeding it up.

`SELECT`  `T.did`<br>
`FROM`  `Trip as T`<br>
`GROUP BY`  `T.did`<br>
`HAVING` `[AVG|MIN](T.driver_rating) = 5.0;`

&emsp;4\. You hypothesize that drivers and passengers with the same first name get along better<br>
&emsp;&emsp;(have better ratings) than drivers and passengers that don’t share any commonalities.


---

<a id="page-6"></a>
**Page 6**

Notice that the passenger and driver ratings can be NULL.

Select the queries that yield the desired result.

`SELECT` `SAME_NAME.rating AS same_name,`<br>
&emsp;&emsp;`DIFF_NAME.rating AS diff_name`<br>
`FROM (SELECT` `AVG(driver_rating) AS rating`<br>
&emsp;&emsp;`FROM`  `Passenger P, Driver D, Trip T`<br>
&emsp;&emsp;`WHERE`  `P.pid = T.pid AND D.did = T.did`<br>
&emsp;&emsp;&emsp;&emsp;`AND P.first_name = D.first_name) AS SAME_NAME,`<br>
&emsp;&emsp;&emsp;&emsp;`(SELECT` `AVG(driver_rating) AS rating`<br>
&emsp;&emsp;`FROM`  `Passenger P, Driver D, Trip T`<br>
&emsp;&emsp;`WHERE`  `P.pid = T.pid AND D.did = T.did`<br>
&emsp;&emsp;&emsp;&emsp;`AND P.first_name <> D.first_name) AS DIFF_NAME;`

&emsp;&emsp;`SELECT` `SAME_NAME.rating AS same_name,`<br>
&emsp;&emsp;`DIFF_NAME.rating AS diff_name`<br>
`FROM (SELECT` `(SUM(driver_rating) / COUNT(*)) AS rating`<br>
&emsp;&emsp;`FROM`  `Passenger P, Driver D, Trip T`<br>
&emsp;&emsp;`WHERE`  `P.pid = T.pid AND D.did = T.did`<br>
&emsp;&emsp;&emsp;&emsp;`AND P.first_name = D.first_name) AS SAME_NAME,`<br>
&emsp;&emsp;&emsp;&emsp;`(SELECT` `(SUM(driver_rating) / COUNT(*)) AS rating`<br>
&emsp;&emsp;`FROM`  `Passenger P, Driver D, Trip T`<br>
&emsp;&emsp;`WHERE`  `P.pid = T.pid AND D.did = T.did`<br>
&emsp;&emsp;&emsp;&emsp;`AND P.first_name <> D.first_name) AS DIFF_NAME;`

&emsp;&emsp;`SELECT`  `AVG(TS.driver_rating) AS same_name,`<br>
&emsp;&emsp;`AVG(TD.driver_rating) AS diff_name`<br>
`FROM`  `Passenger PS, Driver DS, Trip TS,`<br>
&emsp;&emsp;`Passenger PD, Driver DD, Trip TD`<br>
`WHERE` `PS.pid = TS.pid AND DS.did = TS.did AND`<br>
`PD.pid = TD.pid AND DD.did = TD.did AND`<br>
`PS.first_name = DS.first_name AND`


![Figure on page 6](figures/solutions-p06-fig06.png)

&emsp;&emsp;`PD.first_name <> DD.first_name;`

