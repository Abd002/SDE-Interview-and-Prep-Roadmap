# Cambridge Computer Science Tripos 2013, Paper 5, Question 7: Questions

> Copied from the original: <https://www.cl.cam.ac.uk/teaching/exams/pastpapers/y2013p5q7.pdf>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

**COMPUTER SCIENCE TRIPOS Part IB – 2013 – Paper 5**

**7**   **Concurrent and Distributed Systems (RNW)**

&emsp;(a) Deadlock is a classic problem in concurrent systems.

&emsp;&emsp;&emsp;(i)   What are the four necessary conditions for deadlock?   \[4 marks\]

&emsp;&emsp;&emsp;(ii) Deadlock is often explained using the Dining Philosopher’s Problem. In<br>
&emsp;&emsp;&emsp;&emsp;&emsp;this pseudo-code, each fork is represented by a lock:

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`Lock` `forks[]` `=` `new` `Lock[5];`

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`//` `Code` `for` `each` `philosopher` `(i)`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`while` `(true)` `{`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`think();`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`lock(fork[i]);`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`lock(fork[(i` `+` `1)` `%` `5]);`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`eat();`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`unlock(fork[i]);`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`unlock(fork[(i` `+` `1)` `%` `5]);`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`}`

&emsp;&emsp;&emsp;&emsp;&emsp;Partial ordering is a common deadlock prevention scheme.   Describe<br>
&emsp;&emsp;&emsp;&emsp;&emsp;modifications to the above code, changing only array indices, such that<br>
&emsp;&emsp;&emsp;&emsp;&emsp;philosophers can be fed not only safely, but also deadlock-free, using a<br>
&emsp;&emsp;&emsp;&emsp;&emsp;partial order.   \[4 marks\]

&emsp;(b)   Priority inversion can occur when threads of differing priorities synchronise on<br>
&emsp;&emsp;&emsp;access to common resources – threads of greater priority may end up waiting on<br>
&emsp;&emsp;&emsp;threads of lesser priority, leading to undesirable realtime properties.

&emsp;&emsp;&emsp;(i)   Describe how this problem can be solved for mutexes using priority<br>
&emsp;&emsp;&emsp;&emsp;&emsp;inheritance.   \[2 marks\]

&emsp;&emsp;&emsp;(ii) Describe how priority inheritance would need to be modified to handle<br>
&emsp;&emsp;&emsp;&emsp;&emsp;reader-writer locks.   \[2 marks\]

&emsp;&emsp;&emsp;(iii) Priority inversion can also arise between two threads involved in process<br>
&emsp;&emsp;&emsp;&emsp;&emsp;synchronisation – for example, when one thread uses a semaphore to signal<br>
&emsp;&emsp;&emsp;&emsp;&emsp;completion of work. Why might implementing priority inversion be more<br>
&emsp;&emsp;&emsp;&emsp;&emsp;difficult with process synchronisation than with mutual exclusion?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[4 marks\]

&emsp;&emsp;&emsp;(iv) What could we do to solve the problem in (b)(iii)?   \[4 marks\]

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1

