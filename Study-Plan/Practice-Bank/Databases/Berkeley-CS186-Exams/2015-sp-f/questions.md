# Berkeley CS186 Spring 2015: Final: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/186>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**


![Figure on page 1](figures/questions-p01-fig01.png)


---

<a id="page-2"></a>
**Page 2**


![Figure on page 2](figures/questions-p02-fig02.png)


---

<a id="page-3"></a>
**Page 3**


![Figure on page 3](figures/questions-p03-fig03.png)


---

<a id="page-4"></a>
**Page 4**


![Figure on page 4](figures/questions-p04-fig04.png)


---

<a id="page-5"></a>
**Page 5**


![Figure on page 5](figures/questions-p05-fig05.png)


---

<a id="page-6"></a>
**Page 6**


![Figure on page 6](figures/questions-p06-fig06.png)


---

<a id="page-7"></a>
**Page 7**


![Figure on page 7](figures/questions-p07-fig07.png)


---

<a id="page-8"></a>
**Page 8**


![Figure on page 8](figures/questions-p08-fig08.png)


---

<a id="page-9"></a>
**Page 9**


![Figure on page 9](figures/questions-p09-fig09.png)


---

<a id="page-10"></a>
**Page 10**


![Figure on page 10](figures/questions-p10-fig10.png)


---

<a id="page-11"></a>
**Page 11**


![Figure on page 11](figures/questions-p11-fig11.png)


---

<a id="page-12"></a>
**Page 12**


![Figure on page 12](figures/questions-p12-fig12.png)


---

<a id="page-13"></a>
**Page 13**


![Figure on page 13](figures/questions-p13-fig13.png)


---

<a id="page-14"></a>
**Page 14**

Name:\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_    Class Login – person on left:\_\_\_\_\_\_\_\_\_<br>
Class Login (e.g. -aa): \_\_\_\_\_\_\_\_\_\_\_\_\_\_    Class Login – person on right:\_\_\_\_\_\_\_\_<br>
**I. Query Processing**    **III. Database Design**<br>
1\. \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ pages 1-3. Add to the diagram below.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4\. a. A / E / NMI<br>
2a. \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_I/Os<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;b. A / E / NMI<br>
2b. \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ tuples<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;c. A / E / NMI<br>
3a. #1 / #2<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;d. A / E / NMI<br>
3b. #1 / #2<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;5\. a / b / c / d<br>
3c. #1 / #2<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;6a. \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_<br>
3d. #1 / #2<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;6b. Yes / No \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_<br>
4\. i. / ii. / iii.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;7\. \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_<br>
5\. \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

**IV. Concurrency**


![Figure on page 14](figures/questions-p14-fig14.png)

**II. Indexing / Storage**


![Figure on page 14](figures/questions-p14-fig15.png)


![Figure on page 14](figures/questions-p14-fig16.png)

2a. S1 \_\_\_\_\_   S2 \_\_\_\_\_ S3 \_\_\_\_\_<br>
2b. S1 \_\_\_\_\_   S2 \_\_\_\_\_ S3 \_\_\_\_\_    3.  \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4\.  \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_


![Figure on page 14](figures/questions-p14-fig17.png)


---

<a id="page-15"></a>
**Page 15**

**V. Recovery**


![Figure on page 15](figures/questions-p15-fig18.png)


![Figure on page 15](figures/questions-p15-fig19.png)


![Figure on page 15](figures/questions-p15-fig20.png)

4.\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_


![Figure on page 15](figures/questions-p15-fig21.png)

6\.  A / B / C / D

**VI.  SQL**<br>
1\. `CREATE VIEW` `num_trips_by_month` `AS`    3a. `SELECT`  `T1.did`<br>
`SELECT` `EXTRACT(MONTH FROM`        `FROM`  `Trip AS T1`<br>
`______________) AS month,`        `WHERE`  `___________________________(`<br>
`_______________________ AS num_trips`    `SELECT` `_________________________`<br>
`FROM` `____________________`    `FROM`  `Trip AS T2`<br>
`GROUP BY` `month;`    `WHERE` `____________________________`<br>
`__________________________);`<br>
2\. `SELECT`  `month`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3b. Circle statements that apply:<br>
`FROM`  `num_trips_by_month NTM` `JOIN`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**A  /  B  /  C**<br>
`(``SELECT` `_____________ AS min_column`    3c.`SELECT`  `T.did`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`FROM`  `Trip as T`<br>
`FROM`  `__________________________`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`GROUP BY`  `_________________________`<br>
`) MIN_TABLE`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`HAVING`  `__________________________ ;`<br>
`ON` `_______________________________;`

4\. Circle the queries that produce the desired outcome:        A    B    C

