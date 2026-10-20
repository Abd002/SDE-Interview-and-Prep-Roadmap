# Cambridge Computer Science Tripos 2011, Paper 5, Question 7: Questions

> Copied from the original: <https://www.cl.cam.ac.uk/teaching/exams/pastpapers/y2011p5q7.pdf>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

**2011 Paper 5 Question 7**

**Concurrent and Distributed Systems**

Database   concurrency   control   enables   multiple   transactions   to   proceed<br>
simultaneously against a shared database.

(a) Give an example each of conflicting and non-conflicting operations on objects<br>
&emsp;in a database.   \[2 marks\]

(b) Explain how timestamp ordering (TSO) works, and how it responds to conflicts<br>
&emsp;between transactions.   \[4 marks\]

(c)   Explain cascading aborts, and use an example to show how they can occur<br>
&emsp;with TSO.   \[4 marks\]

(d) Why is TSO not subject to deadlock?   \[2 marks\]

(e) Explain why TSO distributes well, compared with two-phase locking.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[4 marks\]

(f )   Construct a workload that performs badly under TSO, and explain why it<br>
&emsp;does so. What could you do to improve its performance?   \[4 marks\]

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1

