# Berkeley CS162 Fall 2004: Midterm 1: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

**CS162 Fall 2004**    **Professor Alan Jay Smith**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Midterm 1, Monday, October 11, 2004**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;(Total Points Possible: 100)<br>
1\.   What's an inverted page table? What are the relationships between the size of the inverted<br>
&emsp;page table, the size of the virtual address space, and the size of the physical address space?<br>
&emsp;(14)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1/7


---

<a id="page-2"></a>
**Page 2**

2\.   Suppose that you have an architecture with a base register (for relocation) but no bounds<br>
&emsp;register. What is the advantage of this design relative to a system with no base register? What<br>
&emsp;is the disadvantage of this design relative to a system with both base and bounds registers?<br>
&emsp;(14)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2/7


---

<a id="page-3"></a>
**Page 3**

3\.   Assume a system with segmentation but no paging.  Assume that the system uses a segment<br>
&emsp;table.  Please show how a virtual address is used to make a memory reference.  (Be sure to<br>
&emsp;show all segment table entry fields and their uses, any necessary registers, comparators,<br>
&emsp;adders, etc.)<br>
&emsp;(15)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3/7


---

<a id="page-4"></a>
**Page 4**

4\.   For the following two cases, please either show a complete safe sequence or prove that there<br>
&emsp;isn't one:<br>
(12)

`Process      has-X       has-Y      max-needs-X    max-needs-Y`<br>
`A          35          10            65             40`<br>
`B          55          80           105            220`<br>
`C          35          20           110             50`<br>
`D           0          70            50             90`<br>
`(a)  available: X: 40   Y: 40`<br>
`(b)  available: X: 40   Y: 35`

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4/7


---

<a id="page-5"></a>
**Page 5**

5\.   Prove that Shortest Job First is optimal (minimum average time to completion, averaged over<br>
&emsp;all of the jobs) in a system which starts with exactly N jobs, each of whose run times are<br>
&emsp;known, and no which no further jobs arrive.<br>
&emsp;(16)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;5/7


---

<a id="page-6"></a>
**Page 6**

6\.   Suppose that you had to schedule jobs for a printer.  Assume that the system uses spooling -<br>
&emsp;i.e. print files are written to disk and then are printed without interruption after they are<br>
&emsp;complete.<br>
&emsp;(16)<br>
&emsp;(a) What's the optimal (realizable) algorithm that minimizes flow time, and why?<br>
&emsp;(b) Now suppose that you have 2 printers, and suppose that print job sizes are highly skewed.<br>
&emsp;&emsp;In order to provide good service to your users, how might you want to modify the<br>
&emsp;&emsp;scheduling algorithm you selected for part a? (Keep in mind the "real goal" of scheduling<br>
&emsp;&emsp;algorithms.)  Please explain and justify your answer.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;6/7


---

<a id="page-7"></a>
**Page 7**

7\.   Assume that we have atomic operations: \[increment value in memory, and then load the<br>
&emsp;result\] and \[decrement value in memory\].<br>
&emsp;The following "code" was given in lecture to obtain mutual exclusion for a critical section.<br>
&emsp;What's wrong with it? Please explain.<br>
&emsp;(13)

`Init: A = 0`<br>
`loop: {increment A in memory, load A},`<br>
`if A~=1, then {decrement A in memory}, go to loop`<br>
`critical section here`<br>
`{decrement memory location A}`

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;7/7

