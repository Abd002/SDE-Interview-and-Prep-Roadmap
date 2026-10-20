# Cambridge Computer Science Tripos 2024, Paper 5, Question 4: Questions

> Copied from the original: <https://www.cl.cam.ac.uk/teaching/exams/pastpapers/y2024p5q4.pdf>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

**COMPUTER SCIENCE TRIPOS Part IB – 2024 – Paper 5**

**4**   **Concurrent and Distributed Systems (djg11)**

&emsp;(a) A concurrency library provides a `signal` primitive for semaphores and a `notify`<br>
&emsp;&emsp;&emsp;primitive for condition variables. Explain what they have in common and how<br>
&emsp;&emsp;&emsp;they are different. Are they blocking primitives? Can they have no effect?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[4 marks\]

&emsp;(b)   A transaction processing system uses non-strict isolation.

&emsp;&emsp;&emsp;(i)   Without using an example, define the notion of serialisability of transac-<br>
&emsp;&emsp;&emsp;&emsp;&emsp;tions.   \[2 marks\]

&emsp;&emsp;&emsp;(ii) What is a conflict between two threads, and can conflicts be used to check<br>
&emsp;&emsp;&emsp;&emsp;&emsp;for serialisability?   \[2 marks\]

&emsp;&emsp;&emsp;(iii) What are the advantages and disadvantages of non-strict isolation?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[2 marks\]

&emsp;&emsp;&emsp;(iv) Can performance be enhanced when increment and decrement operations<br>
&emsp;&emsp;&emsp;&emsp;&emsp;are considered as composite operations?   Consider this in the context of<br>
&emsp;&emsp;&emsp;&emsp;&emsp;conflict analysis techniques.   \[2 marks\]

&emsp;&emsp;&emsp;(v) Give an example, not using increments or decrements, where simplistic<br>
&emsp;&emsp;&emsp;&emsp;&emsp;conflict analysis may report a problem that in reality is not a problem.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[2 marks\]

&emsp;(c)   Some code is replaced in an asynchronous, reliable message-passing language<br>
&emsp;&emsp;&emsp;that uses `channel_id!value` and `?channel_id` to communicate between user-<br>
&emsp;&emsp;&emsp;space threads. The whole system has now seized up. Sketch two possible code<br>
&emsp;&emsp;&emsp;fragments that may have caused the seizure, one due to deadlock, and one not<br>
&emsp;&emsp;&emsp;due to deadlock.   \[6 marks\]

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1

