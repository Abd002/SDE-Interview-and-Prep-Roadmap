# Cambridge Computer Science Tripos 2020, Paper 5, Question 7: Questions

> Copied from the original: <https://www.cl.cam.ac.uk/teaching/exams/pastpapers/y2020p5q7.pdf>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

**COMPUTER SCIENCE TRIPOS Part IB – 2020 – Paper 5**

**7**   **Concurrent and Distributed Systems (djg11)**

&emsp;(a) What are the distinguishing differences between a process and a thread? How<br>
&emsp;&emsp;&emsp;are they best mapped to processors?   \[4 marks\]

&emsp;(b)   (i)   What are the main features of a monitor in concurrency theory?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[2 marks\]

&emsp;&emsp;&emsp;(ii) How can a thread suspend itself inside a monitor? Use a state diagram or<br>
&emsp;&emsp;&emsp;&emsp;&emsp;flow chart to explain your answer.   \[5 marks\]

&emsp;(c)   Define priority inversion and give an example of a situation where it may occur.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[3 marks\]

&emsp;(d) Several threads split over several processes all write lines of text to one output<br>
&emsp;&emsp;&emsp;device. Characters from different lines must not be interleaved. The processes<br>
&emsp;&emsp;&emsp;have different priorities.   Outline the major software components (such as<br>
&emsp;&emsp;&emsp;processes, threads, buffers, locks and system calls) involved in this task and<br>
&emsp;&emsp;&emsp;how they interact. Identify the points where threads will block and examine<br>
&emsp;&emsp;&emsp;whether priority inversion is likely to happen.   \[6 marks\]

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1

