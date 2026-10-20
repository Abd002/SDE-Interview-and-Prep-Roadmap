# Berkeley CS162 Fall 2001: Midterm 1: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;UNIVERSITY OF CALIFORNIA<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;College of Engineering<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Department of Electrical Engineering<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;and Computer Sciences<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Computer Science Division<br>
CS 162, Fall, 2001                                                                                 Prof. Alan Jay Smith<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Midterm 1, October 8, 2001<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Part I<br>
You have until the time announced for this exam.  The exam is **closed book and closed notes.**  All answers should be<br>
written on the exam paper.  Anything that we can’t read or understand won’t get credit.  Any question for which you give<br>
no answer at all will receive 25% partial credit.  Please answer in standard English; illiterate or illegible answers to<br>
essay questions will lose credit.  If we can’t understand your answer, it is wrong.  Partial credit will be given for “compu-<br>
tation-type” problems only if your errors are obvious to the grader; we are not going to spend significant time debugging<br>
your solution.  If necessary, you may continue on the back of a page.  Please watch the front board for corrections and<br>
other information.  This exam has 7 questions on 7 pages and is in two parts.  Answers may be continued on the back of<br>
a page.<br>
Name (**last**, first, middle):\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_<br>
Student ID #\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_  Code #\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_<br>
Class Account:\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_<br>
1\.  The discussion of a hashed (inverted) page table indicated that the size of the table was propor-<br>
tional to the size of main memory.  Why?  Do you also need a regular page table?  Why?  How large<br>
is the regular page table? (12)


---

<a id="page-2"></a>
**Page 2**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;-2-

Name (last, first, middle):\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_<br>
2\.  List and explain as many tradeoffs as you can between writing a program using:  (a) one process,<br>
(b) multiple processes, and (c) one process with threads, to solve a problem.  (12)


---

<a id="page-3"></a>
**Page 3**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;-3-

Name (last, first, middle):\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_<br>
3\. Suppose that you want to write to a location in memory, and you have a page fault.  List and<br>
explain all of the steps that have to be taken in order to make that memory reference.  Your answer<br>
should mention all of the following:  disk, page table, TLB, translator, scheduler, page table entry,<br>
etc.  (“etc.” means that there are other things you also need to mention.) (16)


---

<a id="page-4"></a>
**Page 4**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;-4-

Name (last, first, middle):\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_<br>
4\. You have processes 1...4 with arrival times and CPU processing requirements as shown.  For each<br>
of the following scheduling algorithms, show (in a table or diagram) at each time which process is<br>
running on the CPU.  Compute the average flow time over this set of jobs.  You may assume that<br>
there are no overhead costs. (16)

Process    Arrives        CPU time<br>
1    0    3<br>
2    2.1    1<br>
3    3.2    5<br>
4    4.3    2

a)  RR (quantum = 0.5)<br>
b)  SRPT<br>
c)  SJF<br>
d)  SET (quantum = 0.5)


---

<a id="page-5"></a>
**Page 5**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;-5-

Name (last, first, middle):\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_<br>
5\. For the following two cases, please either show a complete safe sequence or prove that there isn’t<br>
one (12):

Process       has-X      has-Y     max-needs-X       max-needs-Y<br>
A    10    20    75    50<br>
B    0    70    50    90<br>
C    30    10    60    40<br>
D    50    80    100    220

(a)    available: X:  40  Y: 40<br>
(b)    available: X:  40  Y: 35


---

<a id="page-6"></a>
**Page 6**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;-6-

Name (last, first, middle):\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_<br>
6\. The following algorithm, developed by Dekker, is the first  known correct software solution to the<br>
critical section problem for two processes.  The two processes, P0 and P1, share the following vari-<br>
ables:<br>
var flag: array \[0..1\] of boolean; (\*initially false\*)<br>
turn: 0..1;<br>
The following program is for process Pi (i=0 or 1), with Pj (j=0 or 1) being the other process:<br>
repeat<br>
flag\[i\]:=true;<br>
while flag\[j\]<br>
do if turn = j<br>
then begin<br>
flag\[i\]:=false;<br>
while turn=j do noop;<br>
flag\[i\]:=true;<br>
end;<br>
...<br>
critical section<br>
...<br>
turn:=j;<br>
flag\[i\]:=false;<br>
...<br>
remainder section<br>
...<br>
until false;<br>
Prove that the algorithm satisfies all three requirements (mutual exclusion, progress, bounded wait-<br>
ing) for the critical section problem. (16)


---

<a id="page-7"></a>
**Page 7**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;-7-

Name (last, first, middle):\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_<br>
7\. Explain what an open (queuing) system is and what a closed system is.  Does the scheduling<br>
algorithm affect the throughput in a closed system?  In an open system?  Does it affect the flow time<br>
in a closed system?  In an open system?  Please explain your answers. (16)

