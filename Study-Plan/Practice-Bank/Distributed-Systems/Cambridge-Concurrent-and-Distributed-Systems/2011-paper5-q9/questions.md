# Cambridge Computer Science Tripos 2011, Paper 5, Question 9: Questions

> Copied from the original: <https://www.cl.cam.ac.uk/teaching/exams/pastpapers/y2011p5q9.pdf>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

**2011 Paper 5 Question 9**

**Concurrent and Distributed Systems**

(a) We have considered four types of middleware:   remote procedure call,<br>
&emsp;object-oriented middleware, message-oriented middleware, and event-based<br>
&emsp;middleware.

&emsp;(i)   Each middleware has a core action, such as a remote procedure call or<br>
&emsp;&emsp;&emsp;a remote method invocation.   This entails data transfer that is either<br>
&emsp;&emsp;&emsp;unidirectional (out of or into the calling context) or bidirectional (in and<br>
&emsp;&emsp;&emsp;out). State which is used by each of the **four** types of middleware.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[4 marks\]

&emsp;(ii) Does each of these—uni- and bidirectional data transfer—have sufficient<br>
&emsp;&emsp;&emsp;expressive power for programming? Explain your answer.   \[2 marks\]

&emsp;(iii) One of the characteristics of distributed systems is that they lack global<br>
&emsp;&emsp;&emsp;time.   Given your answers above, what effect might this have on<br>
&emsp;&emsp;&emsp;middleware use?   \[4 marks\]

(b) (i)   What are causal and totally ordered message delivery?   \[2 marks\]

&emsp;(ii) Which does vector clocks provide?   \[1 mark\]

&emsp;(iii) The vector clock algorithm is a way of sharing state, ensuring that every<br>
&emsp;&emsp;&emsp;process knows what it needs to about how far the others have progressed.<br>
&emsp;&emsp;&emsp;Why is it critical that messages having vector timestamps are never lost?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[2 marks\]

(c)   (i)   Storage services can be stateful or stateless. Give **one** advantage and **one**<br>
&emsp;&emsp;&emsp;disadvantage of each.   \[2 marks\]

&emsp;(ii) If you were designing a service to support film production, which would<br>
&emsp;&emsp;&emsp;you use and why?   \[3 marks\]

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1

