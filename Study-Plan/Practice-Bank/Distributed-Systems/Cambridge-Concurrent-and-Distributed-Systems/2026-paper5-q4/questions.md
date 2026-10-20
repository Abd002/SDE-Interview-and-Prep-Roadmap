# Cambridge Computer Science Tripos 2026, Paper 5, Question 4: Questions

> Copied from the original: <https://www.cl.cam.ac.uk/teaching/exams/pastpapers/y2026p5q4.pdf>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

**COMPUTER SCIENCE TRIPOS Part IB – 2026 – Paper 5**

**4**   **Concurrent and Distributed Systems (mk428)**

&emsp;(a) Describe briefly what is meant by consensus in distributed systems, and how it<br>
&emsp;&emsp;&emsp;relates to total order broadcast.   \[3 marks\]

&emsp;(b)   Define the five properties that a total order broadcast algorithm must specify.<br>
&emsp;&emsp;&emsp;For each property, state whether it is a safety or a liveness property.   \[5 marks\]

&emsp;(c)   Your colleague proposes implementing a total order broadcast system as follows.<br>
&emsp;&emsp;&emsp;A server keeps an in-memory array of references to messages, initialised with<br>
&emsp;&emsp;&emsp;nulls. When a client wants to broadcast a message, the client sends this message<br>
&emsp;&emsp;&emsp;over the network to the server. On receipt, a thread on the server performs<br>
&emsp;&emsp;&emsp;an atomic compare-and-swap operation that updates the first null array entry<br>
&emsp;&emsp;&emsp;to point at that message, provided that another thread has not concurrently<br>
&emsp;&emsp;&emsp;updated the same array entry. All clients then deliver messages from non-null<br>
&emsp;&emsp;&emsp;array entries in the order they appear in the array.

&emsp;&emsp;&emsp;Is this a correct total order broadcast algorithm according to your definition<br>
&emsp;&emsp;&emsp;from Part (b)? Justify your answer.   \[4 marks\]

&emsp;(d) How does the algorithm from Part (c) compare to Raft?   \[3 marks\]

&emsp;(e) Imagine you have a fault-tolerant counting service, which can be queried by<br>
&emsp;&emsp;&emsp;clients.   Every query atomically increments a counter and returns the new<br>
&emsp;&emsp;&emsp;counter value. Can this service be used to implement a total order broadcast<br>
&emsp;&emsp;&emsp;system according to your definition from Part (b)? If yes, explain how this is<br>
&emsp;&emsp;&emsp;done. If no, explain why it cannot be done.   \[3 marks\]

&emsp;(f )   In the scenario of Part (e), does it make a difference if you assume that there<br>
&emsp;&emsp;&emsp;are no more than two clients? Justify your answer.   \[2 marks\]

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1

