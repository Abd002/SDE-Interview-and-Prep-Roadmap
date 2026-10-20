# Cambridge Computer Science Tripos 2019, Paper 5, Question 8: Questions

> Copied from the original: <https://www.cl.cam.ac.uk/teaching/exams/pastpapers/y2019p5q8.pdf>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

**COMPUTER SCIENCE TRIPOS Part IB – 2019 – Paper 5**

**8**   **Concurrent and Distributed Systems (avsm2)**

&emsp;(a) Programs with concurrency are vulnerable to classes of problems that are not<br>
&emsp;&emsp;&emsp;exhibited in single-threaded programs.

&emsp;&emsp;&emsp;(i)   Explain the concepts of deadlock and livelock in a multithreaded program.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[2 marks\]

&emsp;&emsp;&emsp;(ii) Explain the four conditions required for deadlock. A sentence explaining<br>
&emsp;&emsp;&emsp;&emsp;&emsp;each condition is sufficient.   \[4 marks\]

&emsp;(b)   Modern instruction set architectures provide instructions for performing atomic<br>
&emsp;&emsp;&emsp;operations over memory locations.

&emsp;&emsp;&emsp;(i)   One class of instructions are generically referred to as Compare And Swap<br>
&emsp;&emsp;&emsp;&emsp;&emsp;(CAS). Describe how the CAS instruction on the x86 architectures is used<br>
&emsp;&emsp;&emsp;&emsp;&emsp;to perform an atomic operation. Briefly explain how the instruction uses<br>
&emsp;&emsp;&emsp;&emsp;&emsp;the instruction operands when executed.   \[3 marks\]

&emsp;&emsp;&emsp;(ii) Databases often utilise a technique known as write-ahead logging to provide<br>
&emsp;&emsp;&emsp;&emsp;&emsp;durability guarantees. Describe how a disk-based transaction log might be<br>
&emsp;&emsp;&emsp;&emsp;&emsp;implemented, and what the atomic operation used in this technique is.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[3 marks\]

&emsp;(c)   The below snippet of C code uses `pthreads` for concurrent execution. It uses<br>
&emsp;&emsp;&emsp;a mutex `M` and a condition variable `C` to ensure that the `run` `critical` `code`<br>
&emsp;&emsp;&emsp;function only executes when the `condition` boolean is `true`.

&emsp;&emsp;&emsp;`L1:`   `pthread_mutex_lock(&M);`<br>
&emsp;&emsp;&emsp;`L2:`   `run_critical_code` `();`<br>
&emsp;&emsp;&emsp;`L3:`   `if` `(!condition)`<br>
&emsp;&emsp;&emsp;`L4:`   `pthread_cond_wait(&C,` `&M);`<br>
&emsp;&emsp;&emsp;`L5:`   `if` `(!condition)`<br>
&emsp;&emsp;&emsp;`L6:`   `pthread_cond_broadcast(&C);`<br>
&emsp;&emsp;&emsp;`L7:`   `pthread_mutex_lock(&M);`

&emsp;&emsp;&emsp;Unfortunately, there are four bugs in the code that prevent it from working<br>
&emsp;&emsp;&emsp;correctly.   List each of the four bugs and describe how each bug affects<br>
&emsp;&emsp;&emsp;programme execution. Write down a new version of the code snippet with the<br>
&emsp;&emsp;&emsp;four bugs corrected.   \[8 marks\]

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1

