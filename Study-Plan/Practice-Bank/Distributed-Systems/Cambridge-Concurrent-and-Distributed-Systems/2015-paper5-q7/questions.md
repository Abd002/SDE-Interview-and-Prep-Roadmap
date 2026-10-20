# Cambridge Computer Science Tripos 2015, Paper 5, Question 7: Questions

> Copied from the original: <https://www.cl.cam.ac.uk/teaching/exams/pastpapers/y2015p5q7.pdf>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

**COMPUTER SCIENCE TRIPOS Part IB – 2015 – Paper 5**

**7**   **Concurrent and Distributed Systems (RNW)**

&emsp;(a) (i)   Name the four necessary conditions for deadlock.   \[2 marks\]

&emsp;&emsp;&emsp;(ii) Which of these conditions is frequently precluded in operating-system kernel<br>
&emsp;&emsp;&emsp;&emsp;&emsp;designs in order to prevent deadlocks and why?   \[2 marks\]

&emsp;(b)   Deadlocks are not limited to locks; cycles of waiting on condition variables can<br>
&emsp;&emsp;&emsp;also lead to the “deadly embrace”.

&emsp;&emsp;&emsp;(i)   Explain why it might be more difficult to debug deadlocks involving<br>
&emsp;&emsp;&emsp;&emsp;&emsp;condition variables than those simply involving locks.   \[2 marks\]

&emsp;&emsp;&emsp;(ii) Briefly describe a condition-variable API change that might allow this<br>
&emsp;&emsp;&emsp;&emsp;&emsp;problem to be solved in some cases; explain why it cannot always help.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[2 marks\]

&emsp;(c)   FreeBSD’s WITNESS feature checks statically defined and dynamically discov-<br>
&emsp;&emsp;&emsp;ered lock orders.   Each time a lock is acquired, any previously undiscovered<br>
&emsp;&emsp;&emsp;graph edges involving lock types currently held by the thread and the newly<br>
&emsp;&emsp;&emsp;acquired lock type will be added to the graph. Cycle detection is performed,<br>
&emsp;&emsp;&emsp;and debug information is printed if a previously unreported cycle is discovered.

&emsp;&emsp;&emsp;(i)   Describe a common code structure in which programmers are likely to be<br>
&emsp;&emsp;&emsp;&emsp;&emsp;able to define a static order between two lock types.   \[2 marks\]

&emsp;&emsp;&emsp;(ii) Describe a common case in which programmers are likely to rely instead<br>
&emsp;&emsp;&emsp;&emsp;&emsp;on dynamic discovery of an order between two lock types.   \[2 marks\]

&emsp;&emsp;&emsp;(iii) Unlike the deadlock-detection algorithm presented in lecture, the WIT-<br>
&emsp;&emsp;&emsp;&emsp;&emsp;NESS algorithm does not remove edges when locks are released. Explain<br>
&emsp;&emsp;&emsp;&emsp;&emsp;why WITNESS’s behaviour might be more useful in practice.   \[2 marks\]

&emsp;&emsp;&emsp;(iv) WITNESS is subject to false positives: warnings can be emitted due to<br>
&emsp;&emsp;&emsp;&emsp;&emsp;legitimate cycles even though, by design, the cycle could never trigger an<br>
&emsp;&emsp;&emsp;&emsp;&emsp;actual deadlock. Describe a situation in which this might arise, and explain<br>
&emsp;&emsp;&emsp;&emsp;&emsp;why deadlock could never occur.   \[3 marks\]

&emsp;&emsp;&emsp;(v) WITNESS, as written, is intended to be used with mutexes and other<br>
&emsp;&emsp;&emsp;&emsp;&emsp;lock types providing mutual exclusion. A developer might na¨ıvely extend<br>
&emsp;&emsp;&emsp;&emsp;&emsp;WITNESS to support reader-writer locks (**rwlock**) by introducing graph<br>
&emsp;&emsp;&emsp;&emsp;&emsp;edges for both read and write acquires as it does for mutex acquires. Explain<br>
&emsp;&emsp;&emsp;&emsp;&emsp;why this might not always lead to the desired result.   \[3 marks\]

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1

