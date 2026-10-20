# Berkeley CS162 Fall 2002: Midterm 1: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS162 Fall 2002 Midterm 1<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**CS 162 Fall 2002**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Professor Alan Jay Smith**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Midterm 1**


### **Problem 1:**

Assume that the job run time distribution in a system is as follows:

&emsp;run   probability<br>
&emsp;time   .1<br>
&emsp;8   .2<br>
&emsp;9   .4<br>
&emsp;10   .2<br>
&emsp;11   .1<br>
&emsp;12

Consider the following scheduling algorithms: round robin (Q=1), FCFS, SRPT, SET.

a. Predict the relative performance of these four algorithms for a system with the job run time distribution<br>
given above. Explain (and justify) your answer. (7)

b. Considering only the realizable algorithms among those listed above, either prove that one of the above<br>
realizable algorithms is optimal (among realizable algorithms) for this system, or design a new realizable<br>
scheduling algorithm for jobs in this system that outperforms all of the realizable algorithms considered in<br>
part (a), and justify (show/prove/argue convincingly) why it is better. (7)

c. Assume now that your system has two stages. In the first stage, each job is processed for some amount of<br>
time X(i) (X(i)


### **Problem 2:**

For the following two cases, please either show a complete safe sequence or prove that there isn't one (12)

Process   has-X   has-Y   max-needs-X   max-needs-Y<br>
&emsp;A   30   10   60   40<br>
&emsp;B   50   80   100   220<br>
&emsp;C   30   20   105   50<br>
&emsp;D   0   70   50   90

(a) available: X: 40 Y: 40<br>
(b) available: X: 40 Y: 35


### **Problem 3**

Interrupts, Traps, Exceptions:

a. What are traps? Give at least 2 examples and explain why they are traps. Why are traps necessary? (6)

b. What are interrupts? Give at least 2 examples and explain why they are interrupts. Why are interrupts<br>
useful? (6)

c. What are exceptions? (3)


### **Problem 4:**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1


---

<a id="page-2"></a>
**Page 2**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS162 Fall 2002 Midterm 1<br>
What are the tradeoffs between semaphores and monitors as process synchronization mechanisms? (15)


### **Problem 5:**

We defined "test and set" and "swap" instructions as mechanisms to help implement synchronization. Define<br>
each, and show how each can be used to implement a critical section. Why is "test and set" preferred to<br>
"swap?" (12)


### **Problem 6:**

One of the conditions for deadlock is a circuit in the resource request graph. Explain: (a) What the resource<br>
request graph is. (b) How this condition implies the other conditions for deadlock. (And be sure to tell us what<br>
those other conditions are.) (c) Therefore why this condition is necessary and sufficient for deadlock. (15)


### **Problem 7:**

What are all of the fields in a page table entry? What is each used for (except for the one that we didn't discuss<br>
in class)? (10)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2

