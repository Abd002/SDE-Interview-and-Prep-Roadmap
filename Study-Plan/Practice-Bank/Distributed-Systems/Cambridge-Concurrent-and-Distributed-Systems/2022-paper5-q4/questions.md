# Cambridge Computer Science Tripos 2022, Paper 5, Question 4: Questions

> Copied from the original: <https://www.cl.cam.ac.uk/teaching/exams/pastpapers/y2022p5q4.pdf>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

**COMPUTER SCIENCE TRIPOS Part IB – 2022 – Paper 5**

**4**   **Concurrent and Distributed Systems (djg11)**

&emsp;(a) A shared resource is updated by one writer at a time but must support<br>
&emsp;&emsp;&emsp;concurrent readers. One or more locks are used to manage exclusion.

&emsp;&emsp;&emsp;(i)   What design choices exist regarding fairness?   \[2 marks\]

&emsp;&emsp;&emsp;(ii) Compare having two simple locks, respectively used for read and write<br>
&emsp;&emsp;&emsp;&emsp;&emsp;exclusion, with having a single, specialised locking primitive.   What<br>
&emsp;&emsp;&emsp;&emsp;&emsp;additional state transition(s) could the specialised lock support?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[4 marks\]

&emsp;&emsp;&emsp;(iii) If deadlock is to be avoided using a locking order, is a complete or partial<br>
&emsp;&emsp;&emsp;&emsp;&emsp;order needed?   \[2 marks\]

&emsp;&emsp;&emsp;(iv) How should the various transitions possible with the specialised lock<br>
&emsp;&emsp;&emsp;&emsp;&emsp;mentioned above be integrated into a lock ordering policy?   \[3 marks\]

&emsp;(b)   A mutex is acquired at the start of the body of a function.

&emsp;&emsp;&emsp;(i)   What can go wrong if the function is recursive?   \[1 mark\]

&emsp;&emsp;&emsp;(ii) To avoid the problem, a friend suggests that threading systems should allow<br>
&emsp;&emsp;&emsp;&emsp;&emsp;lock acquisitions to proceed if the lock is already held by the same piece of<br>
&emsp;&emsp;&emsp;&emsp;&emsp;code. Could something like this work and is it worthwhile?   \[3 marks\]

&emsp;(c)   The behaviours provided by a shared, global variable are to be emulated within<br>
&emsp;&emsp;&emsp;a message-passing system.

&emsp;&emsp;&emsp;(i)   Give pseudocode that provides the emulation.   \[2 marks\]

&emsp;&emsp;&emsp;(ii) Discuss whether emulation of locking primitives, such as semaphores, is<br>
&emsp;&emsp;&emsp;&emsp;&emsp;possible or would be worthwhile?   \[3 marks\]

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1

