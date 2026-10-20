# Berkeley CS162 Fall 1996: Midterm 1: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS 162, MIDTERM 1, FALL 1996<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**CS 162**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**MIDTERM 1**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**FALL 1996**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Prof. Alan Jay Smith**

**You have until the end of class for this exam. The exam is closed book. All**<br>
**answers should be written on the exam paper. Anything that we can't read or**<br>
**understand won't get credit. Any question for which you give no answer at all**<br>
**will receive 25% partial credit. Please answer in standard English; illiterate or**<br>
**illegible answers to essay questions will lose credit. Please watch the front**<br>
**board for corrections and other informations. This exam has 6 questions on**<br>
**7 pages and is in two parts.**

**Problem #1**<br>
The state of a system is as shown. (There are 3 processes, A, B and C. There are two resources.)

`process    Allocated   Max_need`

`A          10    15    30   20`

`B           0    30    40   75`

`C          20    10    30   35`

`available: 15    30`

Determine if this system is in a safe state. Show your work (12)

**Problem #2**<br>
Assume that the arrival times and run times of jobs are as follows:

`job   arrival-time     run-time`

CS 162MIDTERM 1FALL 1996 Prof. Alan Jay Smith   1


---

<a id="page-2"></a>
**Page 2**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS 162, MIDTERM 1, FALL 1996<br>
`A          0           5`

`B          0.5         3`

`C          1.5         0.5`

a. Show the sequence of executions and compute the mean flow time for the following scheduling algorithms<br>
(15):

i. FIFO

ii. SET (Q---\>0; i.e. processor sharing)

iii. SRPT

b. Now assume that the system is non-preemptive. You have future knowlege. What the schedule (of all<br>
possible schedules, not just the algorithms from part (a) that minimizes the mean flow time? (5)

c. Still assuming that the system is non-preemptive, and you have future knowlege, let there be two CPUs<br>
(processors). What is the schedule that minimizes the mean flow time now? Compute the mean flow time. (5)

d. Now assume that preemption is permitted, and that there are two processors. Show the schedule that<br>
minimizes the time to completion (i.e. until all jobs are done) (5)

**Problem #3**<br>
Suppose C is augmented with P,V, and Conditional-P. Conditional P tries to decrement the semaphore, if it is<br>
not legal (i.e. Sem = 0), then it returns FALSE, if it is legal, it does it and returns TRUE.

a) What is useful about Conditional-P? (6)

b) Can it be used to avoid deadlocks in all cases? (Why/Why not, be careful to state your assumption). (6)

**Problem #4**<br>
Assume a Coca-Cola machine exists. Assume there are many people who drink Coca-Cola and many people<br>
who stock the machine with Coca-Cola (21).<br>
Write functions for the 'Stockers' and the 'Drinkers', using P() and V().<br>
Properly synchronize your code so that only \*one\* stocker or drinker can have access to the coke machine at

Problem #2   2


---

<a id="page-3"></a>
**Page 3**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS 162, MIDTERM 1, FALL 1996<br>
a given time.

Correctness constraints:<br>
1\) Drinkers can only drink if there is a coke in the machine.<br>
2\) Stockers only stock the machine when it is completely empty.

Assume there are NUMCOKE number of coke slots in the machine.

Semaphore mutex = 1; Semaphore emptySem = 0; Semaphore fullSem = NUMCOKES;

**Problem #5**<br>
Under what circumstances is FIFO a better scheduling algorithm than SET? Explain (10).

**Problem #6**<br>
The following "solutions" to the deadlock problem were described in class. Explain the disadvantages to each<br>
(15):<br>
a. deadlock detection and recovery

b. make all processes obtain their resources in the same order

c. banker's algorithm

&emsp;**Posted by HKN (Electrical Engineering and Computer Science Honor Society)**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**University of California at Berkeley**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**If you have any questions about these online exams**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**please contact**  **examfile@hkn.eecs.berkeley.edu.**

Problem #4   3

