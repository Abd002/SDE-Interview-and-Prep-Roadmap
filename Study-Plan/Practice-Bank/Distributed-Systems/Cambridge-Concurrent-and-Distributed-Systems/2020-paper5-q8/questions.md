# Cambridge Computer Science Tripos 2020, Paper 5, Question 8: Questions

> Copied from the original: <https://www.cl.cam.ac.uk/teaching/exams/pastpapers/y2020p5q8.pdf>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

**COMPUTER SCIENCE TRIPOS Part IB – 2020 – Paper 5**

**8**   **Concurrent and Distributed Systems (mk428)**

&emsp;(a) State the definition of the happens-before relation in a distributed system.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[2 marks\]

&emsp;(b)   Describe how to compute Lamport timestamps.   \[2 marks\]

&emsp;(c)   Lamport timestamps are often used to provide a total ordering on events in a<br>
&emsp;&emsp;&emsp;system with multiple communicating processes. State how this total order is<br>
&emsp;&emsp;&emsp;defined, and explain how this order relates to the happens-before relation.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[2 marks\]

&emsp;(d) Explain what is meant by FIFO broadcast and FIFO-total order broadcast in<br>
&emsp;&emsp;&emsp;the context of a process group.   \[2 marks\]

&emsp;(e) Give pseudocode for an algorithm that implements FIFO-total order broadcast<br>
&emsp;&emsp;&emsp;using Lamport clocks. You may assume that each process has a unique identifier,<br>
&emsp;&emsp;&emsp;and that the set of all process IDs in the group is known.   Further assume<br>
&emsp;&emsp;&emsp;that the underlying network provides reliable FIFO broadcast; that is, you may<br>
&emsp;&emsp;&emsp;use a function `sendFIFO(m)` that transmits message `m` to all processes in the<br>
&emsp;&emsp;&emsp;group. The function `deliverFIFO(m)` is invoked at each process (including the<br>
&emsp;&emsp;&emsp;sender) when message `m` is delivered at that process by the FIFO broadcast layer.<br>
&emsp;&emsp;&emsp;Your algorithm should call `deliverTotalOrder(m)` with messages `m` in strictly<br>
&emsp;&emsp;&emsp;monotonically increasing order of their Lamport timestamp.

&emsp;&emsp;&emsp;Use this outline to get started:

&emsp;&emsp;&emsp;`//` `Called` `by` `the` `user` `when` `they` `want` `to` `send` `a` `message`<br>
&emsp;&emsp;&emsp;`function` `totalOrderBroadcast(msg)` `{`<br>
&emsp;&emsp;&emsp;&emsp;`let` `m` `=` `...;` `//` `construct` `message` `to` `send` `by` `FIFO` `broadcast`<br>
&emsp;&emsp;&emsp;&emsp;`sendFIFO(m);` `//` `use` `underlying` `FIFO` `broadcast`<br>
&emsp;&emsp;&emsp;`}`

&emsp;&emsp;&emsp;`//` `Called` `by` `the` `FIFO` `broadcast` `layer` `when` `a` `message` `is` `received`<br>
&emsp;&emsp;&emsp;`function` `deliverFIFO(m)` `{`<br>
&emsp;&emsp;&emsp;&emsp;`//` `Figure` `out` `the` `total` `order...`<br>
&emsp;&emsp;&emsp;&emsp;`//` `then` `call` `deliverTotalOrder(...)` `as` `appropriate`<br>
&emsp;&emsp;&emsp;`}`

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[10 marks\]

&emsp;(f )   Briefly comment on the fault-tolerance properties of your algorithm in Part (e).<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[2 marks\]

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1

