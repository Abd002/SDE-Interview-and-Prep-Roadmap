# Berkeley CS162 Fall 1994: Midterm 1: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS 162, MIDTERM 1, FALL 1994<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**CS 162**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**MIDTERM 1**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**FALL 1994**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Prof. Alan Jay Smith**

**You have until the end of class for this exam. The exam is closed book. All**<br>
**answers should be written on the exam paper. Anything that we can't read or**<br>
**understand won't get credit. Any question for which you give no answer at all**<br>
**will receive 25% partial credit. Please answer in standard English; illiterate or**<br>
**illegible answers to essay questions will lose credit. Please watch the front**<br>
**board for corrections and other informations. This exam has 6 questions on**<br>
**7 pages and is in two parts.**

**Problem #1**<br>
In a discrete event simulation (such as you did for assignment #1), explain how you compute (accurately) the<br>
mean number of customers in the system. Show a mathematical formula if that is necessary. (10)

**Problem #2**<br>
Define/explain the "exponential queue" scheduling algorithm. Explain the reasoning behind it - i.e. why<br>
should it work well? (12)

**Problem #3**<br>
Why is minimizing the variance of the flow time (var(f(i)) not the same as minimizing the variance of<br>
(f(i)/s(i))? What scheduling algorithm does the former? Which is preferable? Why? (13)

**Problem #4**<br>
What is the difference between a process and a thread? Define each. (10)

**Problem #5**<br>
List and explain the four requirements for deadlock. (12)

CS 162MIDTERM 1FALL 1994 Prof. Alan Jay Smith   1


---

<a id="page-2"></a>
**Page 2**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS 162, MIDTERM 1, FALL 1994<br>
**Problem #6**<br>
Show how the SWAP instruction (as defined in class) can be used to implement P() and V(). (This should be<br>
at the same level of detail as was used in class.) Why do we permit busy waiting in the implementation? (13)

**Problem #7**<br>
All the cs162 students are working very hard on their programming projects. Unfortunately, there are only N<br>
workstations they can use. When a student arrives at the lab, he/she sits down at an open workstation and<br>
starts working. If a student arrives at the lab and all the workstations are occupied, he/she waits, unless there<br>
are more than 10 students already waiting, in which case s/he leaves. When a student finishes his/her work,<br>
he/she will leave and if one or more students are waiting, one will sit down at the workstation. Write code to<br>
synchronize the student use of the workstations. You can use the variables & semaphores given below. Feel<br>
free to define and use additional variables and semaphores if you need them. (30)

binary semaphore Mutex = 1<br>
counting semaphore Terminals = N<br>
int NumSleeping = 0

&emsp;**Posted by HKN (Electrical Engineering and Computer Science Honor Society)**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**University of California at Berkeley**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**If you have any questions about these online exams**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**please contact**  **examfile@hkn.eecs.berkeley.edu.**

Problem #5   2

