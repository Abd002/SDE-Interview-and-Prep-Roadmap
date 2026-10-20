# Cambridge Computer Science Tripos 2021, Paper 5, Question 7: Questions

> Copied from the original: <https://www.cl.cam.ac.uk/teaching/exams/pastpapers/y2021p5q7.pdf>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

**COMPUTER SCIENCE TRIPOS Part IB – 2021 – Paper 5**

**7**   **Concurrent and Distributed Systems (djg11)**

&emsp;(a) Explain what happens to the state space, the possible behaviours and the<br>
&emsp;&emsp;&emsp;reachable state space when two automata are coupled.   \[3 marks\]

&emsp;(b)   The Banker’s Algorithm can be viewed as a predicate over shared state. What<br>
&emsp;&emsp;&emsp;state does it operate over and does this include the program counter of the<br>
&emsp;&emsp;&emsp;participating threads? When does it return true or false?   \[6 marks\]

&emsp;(c)   What is the difference between strict and non-strict isolation in a transaction<br>
&emsp;&emsp;&emsp;processing system? What do both approaches ensure? Which can lead to a<br>
&emsp;&emsp;&emsp;transaction abort being forced by the system and why?   \[3 marks\]

&emsp;(d) “Increment and decrement operations are freely commutable” — what two<br>
&emsp;&emsp;&emsp;assumptions are required for this statement to hold?   Is it true that the<br>
&emsp;&emsp;&emsp;effects of transactions containing increment and decrement operations are always<br>
&emsp;&emsp;&emsp;serialisable?   \[3 marks\]

&emsp;(e) Customers interact with a transaction processing system over a web interface<br>
&emsp;&emsp;&emsp;but confirmations are also sent by email, such as ‘please collect from your local<br>
&emsp;&emsp;&emsp;branch’.

&emsp;&emsp;&emsp;Should the email message be generated before, during, or after the process of<br>
&emsp;&emsp;&emsp;committing the order transaction? What are the advantages and disadvantages<br>
&emsp;&emsp;&emsp;of different approaches? Fully justify at least two design decisions in terms of<br>
&emsp;&emsp;&emsp;system complexity and durability over a system crash.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[5 marks\]

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1

