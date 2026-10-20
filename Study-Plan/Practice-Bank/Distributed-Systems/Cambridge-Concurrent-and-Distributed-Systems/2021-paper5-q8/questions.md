# Cambridge Computer Science Tripos 2021, Paper 5, Question 8: Questions

> Copied from the original: <https://www.cl.cam.ac.uk/teaching/exams/pastpapers/y2021p5q8.pdf>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

**COMPUTER SCIENCE TRIPOS Part IB – 2021 – Paper 5**

**8**   **Concurrent and Distributed Systems (mk428)**

&emsp;You are developing a distributed system in which you want some task to be assigned<br>
&emsp;to exactly one node at any given time.   If that node crashes, the task must be<br>
&emsp;automatically reassigned to a different node, but you also want to ensure that there<br>
&emsp;are never two or more nodes executing the task at the same time.

&emsp;This is known as a lease. A lease is a concurrency primitive similar to a lock (only<br>
&emsp;one node may hold a lease at any time); the difference is that a lease times out if it<br>
&emsp;is not renewed for some time. After timing out, another node can acquire the lease.

&emsp;(a) Briefly summarise how leader election works in the Raft consensus algorithm,<br>
&emsp;&emsp;&emsp;and discuss the commonalities and differences between leader election and a<br>
&emsp;&emsp;&emsp;lease. (Focus only on leader election, and ignore the rest of the Raft algorithm.<br>
&emsp;&emsp;&emsp;Include the role of the term number in your explanation.)   \[5 marks\]

&emsp;(b)   In a partially-synchronous system with crash-recovery failures, is it possible to<br>
&emsp;&emsp;&emsp;guarantee that a lease is always held by exactly one node? Justify your answer.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[5 marks\]

&emsp;(c)   You are asked to design a lease algorithm for a system in which the set of nodes is<br>
&emsp;&emsp;&emsp;not known in advance, and may change over time. Can the Raft leader election<br>
&emsp;&emsp;&emsp;algorithm be used here? Why/why not?   \[2 marks\]

&emsp;(d) A colleague proposes the following lease algorithm:<br>
&emsp;&emsp;&emsp;&emsp; There are three servers, each storing a value that is initially null.<br>
&emsp;&emsp;&emsp;&emsp; Assume every client has a unique ID clientId̸ = null. Every 10 seconds,<br>
&emsp;&emsp;&emsp;&emsp;&emsp;each client that wants to acquire the lease, or currently holds the lease,<br>
&emsp;&emsp;&emsp;&emsp;&emsp;sends a request (acquire, clientId) to all three servers.<br>
&emsp;&emsp;&emsp;&emsp; When a server with current stored value v receives (acquire, n):<br>
&emsp;&emsp;&emsp;&emsp;&emsp;If v = null ∨v = n, or if its value was last set more than 30 seconds<br>
&emsp;&emsp;&emsp;&emsp;&emsp;ago, then it sets its value to n and replies true. This counts as “setting the<br>
&emsp;&emsp;&emsp;&emsp;&emsp;value”, even if the value does not change.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;If its value was last set to v̸ = n less than 30 seconds ago, it leaves its value<br>
&emsp;&emsp;&emsp;&emsp;&emsp;unchanged and replies false.<br>
&emsp;&emsp;&emsp;&emsp; If a client receives two or more true responses from the servers, it now holds<br>
&emsp;&emsp;&emsp;&emsp;&emsp;the lease, otherwise it does not hold the lease.

&emsp;&emsp;&emsp;Discuss the strengths and weaknesses of this algorithm. What faults does it<br>
&emsp;&emsp;&emsp;tolerate? What assumptions does it make for its correctness? How might the<br>
&emsp;&emsp;&emsp;algorithm be improved to avoid some assumptions or weaknesses?   \[8 marks\]

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1

