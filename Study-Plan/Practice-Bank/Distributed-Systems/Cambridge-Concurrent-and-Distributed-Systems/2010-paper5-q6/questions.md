# Cambridge Computer Science Tripos 2010, Paper 5, Question 6: Questions

> Copied from the original: <https://www.cl.cam.ac.uk/teaching/exams/pastpapers/y2010p5q6.pdf>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

**2010 Paper 5 Question 6**

**Concurrent and Distributed Systems**

(a) When distributed systems are designed and engineered, certain fundamental<br>
&emsp;characteristics have to be taken into account, including:

&emsp;&emsp;&emsp;1\.   Concurrent execution of components.<br>
&emsp;&emsp;&emsp;2\.   Independent failure modes.<br>
&emsp;&emsp;&emsp;3\.   Communication delay.<br>
&emsp;&emsp;&emsp;4\.   No global time.

&emsp;In the light of these characteristics, discuss the monitoring of a widely<br>
&emsp;distributed industrial process with the following properties:

&emsp;Distributed monitoring computers analyse regions of the process. Each region<br>
&emsp;contains a number of sensors at identified locations and with the ability to<br>
&emsp;generate timestamps.   Some sensors monitor temperature, others monitor<br>
&emsp;pressure.

&emsp;If both temperature and pressure are found by a monitoring computer to be<br>
&emsp;above their defined thresholds in a given locality within its region it sends an<br>
&emsp;alarm signal to the process control centre, indicating the time and place of<br>
&emsp;the occurrence. The control centre initiates action to bring the values under<br>
&emsp;control.   \[10 marks\]

(b) The diagram below represents a process group that communicates by means<br>
&emsp;of multicast messages.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;time --\><br>
&emsp;&emsp;&emsp;&emsp;P1 (0000)


![Figure on page 1](figures/questions-p01-fig01.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;= message delivery software

&emsp;At each process-hosting node, message delivery software decides whether an<br>
&emsp;incoming message should be delivered to the process or buffered for later<br>
&emsp;delivery. This is achieved by the use of vector clocks.

&emsp;With reference to the example shown in the diagram, describe the vector clock<br>
&emsp;algorithm for delivery of messages in causal order.   \[10 marks\]

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1

