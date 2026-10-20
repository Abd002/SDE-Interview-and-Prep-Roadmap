# Cambridge Computer Science Tripos 2012, Paper 5, Question 8: Questions

> Copied from the original: <https://www.cl.cam.ac.uk/teaching/exams/pastpapers/y2012p5q8.pdf>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

**COMPUTER SCIENCE TRIPOS Part IB – 2012 – Paper 5**

**8**   **Concurrent and Distributed Systems (SMH)**

&emsp;(a) In the context of concurrent systems, what is a transaction?   \[1 mark\]

&emsp;(b)   Describe the ACID properties of transactions.   \[4 marks\]

&emsp;(c)   Compare and contrast strict and non-strict isolation.   \[2 marks\]

&emsp;(d) For each of the following, describe how it can be used to provide isolation and/or<br>
&emsp;&emsp;&emsp;strict isolation:

&emsp;&emsp;&emsp;(i)   2-Phase Locking (2PL)   \[3 marks\]

&emsp;&emsp;&emsp;(ii) Time-Stamp Ordering (TSO)   \[3 marks\]

&emsp;&emsp;&emsp;(iii) Optimistic Concurrency Control (OCC)   \[3 marks\]

&emsp;(e) A researcher suggests an isolation scheme that works as follows:

&emsp;&emsp;&emsp;(i)   Every object o has an associated version number, V (o).

&emsp;&emsp;&emsp;(ii) When executing, a transaction reads a copy of any object it wishes to access,<br>
&emsp;&emsp;&emsp;&emsp;&emsp;and remembers the version number.

&emsp;&emsp;&emsp;(iii) If the transaction wishes to modify an object, it modifies the copy rather<br>
&emsp;&emsp;&emsp;&emsp;&emsp;than the original.

&emsp;&emsp;&emsp;(iv) When complete, the transaction checks the versions of all objects it has<br>
&emsp;&emsp;&emsp;&emsp;&emsp;modified; if any are different, it aborts; otherwise it writes back the new<br>
&emsp;&emsp;&emsp;&emsp;&emsp;versions of all objects, incrementing their version numbers, and commits.

&emsp;&emsp;&emsp;Assuming that step (iv) occurs atomically, does this scheme ensure serializabil-<br>
&emsp;&emsp;&emsp;ity? Justify your answer.   \[4 marks\]

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1

