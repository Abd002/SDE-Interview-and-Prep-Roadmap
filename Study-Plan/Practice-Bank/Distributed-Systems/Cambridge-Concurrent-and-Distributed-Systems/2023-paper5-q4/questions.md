# Cambridge Computer Science Tripos 2023, Paper 5, Question 4: Questions

> Copied from the original: <https://www.cl.cam.ac.uk/teaching/exams/pastpapers/y2023p5q4.pdf>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

**COMPUTER SCIENCE TRIPOS Part IB – 2023 – Paper 5**

**4**   **Concurrent and Distributed Systems (djg11)**

&emsp;(a) A guarded resource needs to be locked in three different ways by readers,<br>
&emsp;&emsp;&emsp;moderators and writers. A thread will gain access to the resource in one of these<br>
&emsp;&emsp;&emsp;three ways, operate, and then relinquish access. At any instant, the resource<br>
&emsp;&emsp;&emsp;may be unlocked or held be any number of readers, or up to two moderators, or<br>
&emsp;&emsp;&emsp;at most one writer.

&emsp;&emsp;&emsp;(i)   Define some number of locks, mutexes and/or shared variables to manage<br>
&emsp;&emsp;&emsp;&emsp;&emsp;the system. Sketch the core of a state transition diagram.   \[5 marks\]

&emsp;&emsp;&emsp;(ii) Using a monitor approach, give pseudocode for these six methods:

&emsp;&emsp;&emsp;&emsp;&emsp;`start_write()`   `start_moderate()`   `start_read()`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[5 marks\]<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`end_write()`   `end_moderate()`   `end_read()`

&emsp;(b)   Very briefly describe two techniques for deadlock avoidance and one technique for<br>
&emsp;&emsp;&emsp;graceful deadlock recovery (i.e. not reboot). Describe two burdensome aspects<br>
&emsp;&emsp;&emsp;of deadlock recovery.   \[6 marks\]

&emsp;(c)   A system has T threads. These use 3 types of resource that each have 4 instances<br>
&emsp;&emsp;&emsp;provided. A deadlock avoidance system restricts resource acquisition. What<br>
&emsp;&emsp;&emsp;state space does the system potentially have before and after restriction?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[4 marks\]

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1

