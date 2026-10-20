# Cambridge Computer Science Tripos 2015, Paper 5, Question 9: Questions

> Copied from the original: <https://www.cl.cam.ac.uk/teaching/exams/pastpapers/y2015p5q9.pdf>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

**COMPUTER SCIENCE TRIPOS Part IB – 2015 – Paper 5**

**9**   **Concurrent and Distributed Systems (RNW)**<br>
&emsp;These questions relate to reliable multicast and distributed transactions. Answers<br>
&emsp;may include timelines of message transmissions/deliveries or transaction submis-<br>
&emsp;sions/commits.   For each event in the timeline, show a physical timestamp (T1,<br>
&emsp;T2, . . . ), process numbers (P1, P2, . . . ), operation (‘transmits’, ‘delivers’, ‘submits’,<br>
&emsp;‘commits’), and a numbered message (m1, m2, . . . ) or numbered transaction (x1, x2,<br>
&emsp;. . . ). For example, “T7: P1 transmits m4”. In this context define:<br>
&emsp;(a) (i)   FIFO ordering   \[1 mark\]<br>
&emsp;&emsp;&emsp;(ii) causal ordering   \[1 mark\]<br>
&emsp;&emsp;&emsp;(iii) total ordering   \[1 mark\]<br>
&emsp;&emsp;&emsp;(iv) strong consistency   \[1 mark\]<br>
&emsp;&emsp;&emsp;(v) weak consistency   \[1 mark\]<br>
&emsp;(b)   (i)   Does causal ordering imply total ordering? If so, explain why; if not, show<br>
&emsp;&emsp;&emsp;&emsp;&emsp;a counterexample, labelling and explaining the violating event.   \[2 marks\]<br>
&emsp;&emsp;&emsp;(ii) Does total ordering imply causal ordering? If so, explain why; if not, show<br>
&emsp;&emsp;&emsp;&emsp;&emsp;a counterexample, labelling and explaining the violating event.   \[2 marks\]<br>
&emsp;(c)   A replicated database is implemented using totally ordered reliable multicast.<br>
&emsp;&emsp;&emsp;Clients may submit transactions to any process in the group. When process<br>
&emsp;&emsp;&emsp;Px receives a new transaction xi from a client, it will multicast the transaction<br>
&emsp;&emsp;&emsp;to all processes, including itself. As xi is delivered by multicast, each process<br>
&emsp;&emsp;&emsp;submits the transaction to a local ACID database. Px returns the result (abort<br>
&emsp;&emsp;&emsp;or commit) to the client; other processes discard the transaction result.<br>
&emsp;&emsp;&emsp;(i)   This model works well if queries do not contain the SQL **time** keyword,<br>
&emsp;&emsp;&emsp;&emsp;&emsp;which is substituted with the current time when a transaction is evaluated.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Explain why using **time** might be a problem and describe a solution.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[4 marks\]<br>
&emsp;&emsp;&emsp;(ii) In the first release of the database, processes submit received multicast<br>
&emsp;&emsp;&emsp;&emsp;&emsp;transactions synchronously, one at a time, to the local database. In a later<br>
&emsp;&emsp;&emsp;&emsp;&emsp;version, to improve performance, processes are allowed to submit multiple<br>
&emsp;&emsp;&emsp;&emsp;&emsp;transactions at a time asynchronously to the local database. Why does this<br>
&emsp;&emsp;&emsp;&emsp;&emsp;fail to provide strong consistency for distributed transactions? Describe<br>
&emsp;&emsp;&emsp;&emsp;&emsp;a solution that might allow limited (but useful) local concurrency to be<br>
&emsp;&emsp;&emsp;&emsp;&emsp;supported.   \[3 marks\]<br>
&emsp;&emsp;&emsp;(iii) Describe changes to the design to support weak consistency, and describe<br>
&emsp;&emsp;&emsp;&emsp;&emsp;two reasons why this might improve performance.   \[4 marks\]

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1

