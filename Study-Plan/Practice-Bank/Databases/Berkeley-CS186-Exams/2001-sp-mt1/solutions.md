# Berkeley CS186 Spring 2001: Midterm 1: Official solutions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/186>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**


### Question 1:

&emsp;a) 4 points.<br>
&emsp;&emsp;i. True, since the file is sorted on name<br>
&emsp;&emsp;ii. True, you can build a dense index on any file<br>
&emsp;&emsp;iii. False, the file is not sorted by phone<br>
&emsp;&emsp;iv. False, the file is not primarily sorted by eno<br>
&emsp;b) 2 points


![Figure on page 1](figures/solutions-p01-fig01.png)

&emsp;c) 5 points<br>
&emsp;&emsp;9 deletions


![Figure on page 1](figures/solutions-p01-fig02.png)

&emsp;e) 5 points<br>
&emsp;2 entries, Insertion of 2 entries into the second, third, or last will cause overflow,<br>
&emsp;which will then cause a split.<br>
&emsp;f)   5 points<br>
&emsp;2 entries, Insertion of 2 entries into the last bucket will cause a split. Since the global<br>
&emsp;== local depth, the global depth will increase by one.


---

<a id="page-2"></a>
**Page 2**


### Question 2:

&emsp;a) 18 points<br>
&emsp;&emsp;&emsp;i.   E<br>
&emsp;&emsp;&emsp;ii.   E<br>
&emsp;&emsp;&emsp;iii.   F<br>
&emsp;&emsp;&emsp;iv.   F<br>
&emsp;&emsp;&emsp;v.   A<br>
&emsp;&emsp;&emsp;vi.   B<br>
&emsp;b) Full credit was given to everyone ( 3 points )

&emsp;c) 4 points

&emsp;Πfilename, song( User **NATURAL JOIN** Has **NATURAL JOIN** Song) / Π speed (User)

&emsp;d) 5 points<br>
&emsp;&emsp;Solution 1:<br>
&emsp;&emsp;SELECT S.filename, S.title<br>
&emsp;&emsp;FROM Song S<br>
&emsp;&emsp;WHERE NOT EXISTS( SELECT \*<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;FROM User U1<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;WHERE NOT EXISTS ( SELECT \*<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;FROM Has H, User U2<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;WHERE U2.speed = U1.speed<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;AND H.name = U2.name<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;AND S.filename = H.filename<br>
&emsp;&emsp;Solution 2:<br>
&emsp;&emsp;SELECT S.filename, S.title<br>
&emsp;&emsp;FROM   Song S<br>
&emsp;&emsp;WHERE NOT EXISTS (   SELECT U1.speed<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;FROM User U1<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;EXCEPT<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;SELECT U2.speed<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;FROM Has H, User U2<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;WHERE H.filename = S.filename<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;AND   H.name = U2.name<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;)


---

<a id="page-3"></a>
**Page 3**


![Figure on page 3](figures/solutions-p03-fig03.png)


---

<a id="page-4"></a>
**Page 4**


### Question 4: Join Algorithms

&emsp;a) 5 points<br>
&emsp;&emsp;\[CARTS\] + \[CARTS\] \* \[ CONTENTS \] = 1,000 + 1,000 \* 5,000<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;= **5,001,000**<br>
b)<br>
\[CARTS\] + \[CONTENTS\] + (\[CARTS\] –1 ) \* ( \[CONTENTS\] – 999 )<br>
= 1,000 + 5,000 + ( 999 \* 4,001 )<br>
= 6000 + 4,001,000 – 4,001 = **4,002,999**<br>
c)<br>
\[ CONTENTS \] +   \[CONTENTS\] / 1,000    \* \[ CARTS \]<br>
&emsp;&emsp;= 5,000 + 5 \* 1,000 = 10,000<br>
d)<br>
1\. Hash Join, since √\[CARTS \] fits in memory ( 2 passes )<br>
2\. Sort-Merge Join, since √\[ CONTENTS \] Does not fit in memory ( 3 passes )<br>
3\. Block Nested Loops Join, 20 passes of CONTENTS !


---

<a id="page-5"></a>
**Page 5**


![Page 5 (scanned)](figures/solutions-p05-page.png)

