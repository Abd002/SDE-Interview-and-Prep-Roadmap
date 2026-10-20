# Berkeley CS162 Spring 2007: Midterm 1: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

CS 162, Spring, 2007<br>
Prof. Alan Jay Smith<br>
Midterm 1, Wednesday, February 28, 2007

&emsp;1\. Within the implementation of P & V, we used both Test and Set and Disable<br>
&emsp;&emsp;Interrupts. Why are both used? Is each necessary? Explain. (10)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1


---

<a id="page-2"></a>
**Page 2**

2\. In class, it was stated that the **SRPT** algorithm was optimal according to a<br>
&emsp;specific and well defined metric.

&emsp;&emsp;A. What is the SRPT algorithm and how does it work? (6)

&emsp;&emsp;B. By what metric is it optimal? (6)

&emsp;&emsp;C. Explain in some plausible manner (don’t try to give us any sort of<br>
&emsp;&emsp;&emsp;mathematical proof) why it is optimal according to the metric. (6)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2


---

<a id="page-3"></a>
**Page 3**

&emsp;&emsp;D. Consider now a more realistic system in which jobs need both memory<br>
&emsp;&emsp;&emsp;and CPU time; assume that the jobs allocated memory in one contiguous<br>
&emsp;&emsp;&emsp;region each. Is it optimal? Why or why not? If not, show an example. (6)

3\. Explain how virtual memory schemes serve to provide protection in a computer<br>
&emsp;system. (8)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3


---

<a id="page-4"></a>
**Page 4**

4\. Given the following processes and their resource allocations, use the banker’s<br>
&emsp;algorithm to determine if a deadlock is inevitable; show your calculations. The<br>
&emsp;system has 10 units of X and 15 units of Y. (12)<br>
&emsp;`Process     has_X    max_need_X    has_Y    max_need_Y`<br>
&emsp;`1          3          10          2           4`<br>
&emsp;`2          0           6          6           7`<br>
&emsp;`3          5           5          2           6`<br>
&emsp;`4          1           2          5           5`

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4


---

<a id="page-5"></a>
**Page 5**

5\. State and explain the four conditions for deadlock. (16)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;5


---

<a id="page-6"></a>
**Page 6**

6\. It was explained in class that a TB (translation buffer) need not be flushed during<br>
&emsp;a context switch if the process id (pid) is a part of our virtual address. Answer the<br>
&emsp;following questions for a system with a large, set associative, TB; a virtual<br>
&emsp;address of the form \<process id, segment, page, word\>; and a large enough<br>
&emsp;process id field so that a process id will never be reused.<br>
&emsp;&emsp;a) What are the advantages of using bits from the segment number as well as<br>
&emsp;&emsp;&emsp;the page number as indices into the TB? (7)

&emsp;&emsp;b) What would be the effect of using bits from the process id as well?<br>
&emsp;&emsp;&emsp;Consider both the case of high order pid bits, and low order pid bits. What<br>
&emsp;&emsp;&emsp;is your recommendation? (I.e. should we use such bits? If so, which bits?)<br>
&emsp;&emsp;&emsp;Explain. (9)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;6


---

<a id="page-7"></a>
**Page 7**

7\. Suppose that your program Zork calls a separately compiled procedure Biff at an<br>
&emsp;entry point called Snick. Explain why the reference within Zork to Snick needs<br>
&emsp;help from the linker/loader to work correctly. Explain (in as much detail as<br>
&emsp;necessary) what the linker/loader must do to make this work correctly. (Specify<br>
&emsp;any necessary information that must be provided in the load modules (i.e. the<br>
&emsp;compiler output) for Zork and Biff.) Discuss any necessary tables. (14)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;7

