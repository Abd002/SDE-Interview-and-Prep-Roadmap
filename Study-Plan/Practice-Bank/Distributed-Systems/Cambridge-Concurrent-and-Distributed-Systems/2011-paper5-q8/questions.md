# Cambridge Computer Science Tripos 2011, Paper 5, Question 8: Questions

> Copied from the original: <https://www.cl.cam.ac.uk/teaching/exams/pastpapers/y2011p5q8.pdf>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

**2011 Paper 5 Question 8**

**Concurrent and Distributed Systems**

(a) Consider a queue data structure, with the following interface:

&emsp;&emsp;&emsp;`interface` `Queue` `{`<br>
&emsp;&emsp;&emsp;&emsp;`void` `push(Object` `val);`<br>
&emsp;&emsp;&emsp;&emsp;`Object` `pop();`<br>
&emsp;&emsp;&emsp;`};`

&emsp;(i)   Write pseudocode for a semaphore-based implementation of `Queue`. Your<br>
&emsp;&emsp;&emsp;implementation should allow concurrent push and pop when it is safe to<br>
&emsp;&emsp;&emsp;do so, but not when it is unsafe. The queued data should be stored in an<br>
&emsp;&emsp;&emsp;array of fixed length n.   \[6 marks\]

&emsp;(ii) Explain the specific circumstances under which concurrent push and pop<br>
&emsp;&emsp;&emsp;is unsafe. Explain how your solution in part (i) addresses these.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[2 + 2 marks\]

(b) You decide to use this data structure to manage a service, where people around<br>
&emsp;the world push jobs of work to be done, and others pop jobs and do them.<br>
&emsp;(This is a description of Amazon’s Mechanical Turk.)

&emsp;This could be implemented as a centralised service, offered through Object-<br>
&emsp;Oriented Middleware.

&emsp;(i)   How can the Object-Oriented Middleware maximise the utilisation of this<br>
&emsp;&emsp;&emsp;service?   \[2 marks\]

&emsp;(ii) Object-Oriented Middleware makes the calls to push and pop look local.<br>
&emsp;&emsp;&emsp;Name **two** things that this hides from the programmer using the service<br>
&emsp;&emsp;&emsp;and say why each is a problem.   \[4 marks\]

&emsp;(iii) What aspects, that are not part of the middleware, might hinder<br>
&emsp;&emsp;&emsp;scalability in terms of the number of potential pushers and poppers?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[4 marks\]

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1

