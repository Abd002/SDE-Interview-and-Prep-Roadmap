# Cambridge Computer Science Tripos 2016, Paper 5, Question 8: Questions

> Copied from the original: <https://www.cl.cam.ac.uk/teaching/exams/pastpapers/y2016p5q8.pdf>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

**COMPUTER SCIENCE TRIPOS Part IB – 2016 – Paper 5**

**8**   **Concurrent and Distributed Systems (RNW)**

&emsp;History graphs record dependencies between individual atomic operations within<br>
&emsp;sequences of events associated with specific schedules of more complex transactions.

&emsp;(a) (i)   What do edges in a history graph represent?   \[1 mark\]

&emsp;&emsp;&emsp;(ii) What graph property holds if a bad schedule is present?   \[1 mark\]

&emsp;&emsp;&emsp;(iii) Which ACID properties may be violated by a bad schedule?   \[2 marks\]

&emsp;&emsp;&emsp;(iv) Define serial and serialisable executions. Explain whether (and if so, how)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;one is a superset of the other.   \[3 marks\]

&emsp;(b)   Two transactions, **T1** and **T2**, consist of operations on two objects, **A** and **B**:

&emsp;&emsp;&emsp;`T1:` `{`   `T2` `(v):` `{`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`a` `=` `A.getbalance();`   `A.debit(v);`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`b` `=` `B.getbalance();`   `B.credit(v);`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`return` `(a` `+` `b);`   `}`<br>
&emsp;&emsp;&emsp;`}`

&emsp;&emsp;&emsp;(i)   Explain how a dirty read might be experienced through concurrent<br>
&emsp;&emsp;&emsp;&emsp;&emsp;executions of **T1** and **T2**.   \[2 marks\]

&emsp;&emsp;&emsp;(ii) Draw and label a history graph illustrating this bad schedule.   \[2 marks\]

&emsp;(c)   A programmer designs a transaction system that uses history graphs to detect<br>
&emsp;&emsp;&emsp;bad schedules.   After an operation is performed, and before its containing<br>
&emsp;&emsp;&emsp;transaction is allowed to commit, the history graph is updated and a graph<br>
&emsp;&emsp;&emsp;analysis is run. If a bad schedule is detected, affected transactions will be aborted<br>
&emsp;&emsp;&emsp;and rolled back.

&emsp;&emsp;&emsp;(i)   Will this scheme always make progress? Explain your answer.   \[2 marks\]

&emsp;&emsp;&emsp;(ii) Time Stamp Ordering (TSO) will sometimes reject good schedules, which<br>
&emsp;&emsp;&emsp;&emsp;&emsp;could lead to unnecessary transaction aborts. Does the scheme described<br>
&emsp;&emsp;&emsp;&emsp;&emsp;here accept or reject more schedules than TSO? Explain why.   \[3 marks\]

&emsp;&emsp;&emsp;(iii) Explain one way in which this scheme may perform better than TSO.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Explain one way in which it may perform worse.   \[4 marks\]

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1

