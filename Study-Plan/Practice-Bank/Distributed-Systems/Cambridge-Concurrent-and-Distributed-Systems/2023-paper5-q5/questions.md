# Cambridge Computer Science Tripos 2023, Paper 5, Question 5: Questions

> Copied from the original: <https://www.cl.cam.ac.uk/teaching/exams/pastpapers/y2023p5q5.pdf>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

**COMPUTER SCIENCE TRIPOS Part IB – 2023 – Paper 5**

**5**   **Concurrent and Distributed Systems (tlh20)**

&emsp;A system is being designed to measure traffic flow into a city. Part of this system<br>
&emsp;is a set of monitoring nodes, each using sensors to detect when a vehicle passes the<br>
&emsp;monitoring node, and incrementing a per-node counter. The nodes communicate over<br>
&emsp;a network to provide a city-wide total.

&emsp;(a) Define each of the terms:

&emsp;&emsp;&emsp;(i)   Fair-loss network links.   \[1 mark\]

&emsp;&emsp;&emsp;(ii) Crash-recovery execution.   \[1 mark\]

&emsp;&emsp;&emsp;(iii) Asynchronous timing.   \[1 mark\]

&emsp;(b)   Consider a version of the system using quorum-based replication. There is a fixed<br>
&emsp;&emsp;&emsp;set of 5 nodes, meaning that each node holds a 5-tuple comprising the node’s<br>
&emsp;&emsp;&emsp;most recent values for each of the replicated counters. A node should be able to<br>
&emsp;&emsp;&emsp;operate if it can communicate with at least 2 other nodes. Describe how each<br>
&emsp;&emsp;&emsp;of the following operations can be implemented by sending messages between<br>
&emsp;&emsp;&emsp;nodes:

&emsp;&emsp;&emsp;(i)   A `setCount(n)` function to update the node’s local counter to `n` and to<br>
&emsp;&emsp;&emsp;&emsp;&emsp;replicate the change to a quorum.   \[5 marks\]

&emsp;&emsp;&emsp;(ii) A `getTotalCount()` function to return the total of the counters from all<br>
&emsp;&emsp;&emsp;&emsp;&emsp;of the nodes.   \[5 marks\]

&emsp;&emsp;&emsp;You should describe the messages sent and received by each node, along with<br>
&emsp;&emsp;&emsp;how a node updates its local 5-tuple with new information when it receives<br>
&emsp;&emsp;&emsp;messages, and how a node determines that the operation is complete.

&emsp;(c)   Does your system provide linearizable behaviour?   Either explain why your<br>
&emsp;&emsp;&emsp;system is linearizable, or provide an example showing a non-linearizable result.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[3 marks\]

&emsp;(d) Consider a second version of the system that provides strong eventual consistency<br>
&emsp;&emsp;&emsp;and allows the operations to always complete irrespective of the number of nodes<br>
&emsp;&emsp;&emsp;available for communication. Summarize the changes needed to provide this<br>
&emsp;&emsp;&emsp;behaviour.   \[4 marks\]

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1

