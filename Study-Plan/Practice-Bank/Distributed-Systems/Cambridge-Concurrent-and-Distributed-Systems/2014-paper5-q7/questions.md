# Cambridge Computer Science Tripos 2014, Paper 5, Question 7: Questions

> Copied from the original: <https://www.cl.cam.ac.uk/teaching/exams/pastpapers/y2014p5q7.pdf>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

**COMPUTER SCIENCE TRIPOS Part IB – 2014 – Paper 5**

**7**   **Concurrent and Distributed Systems (RNW)**

&emsp;Correct handling of time is critical to the correctness (and performance) of distributed<br>
&emsp;systems such as network file systems and databases.   Consider the following two<br>
&emsp;approaches.<br>
&emsp;(a) Physical clock synchronisation<br>
&emsp;&emsp;&emsp;(i)   Define clock skew and clock drift.   \[2 marks\]<br>
&emsp;&emsp;&emsp;(ii) A client running Cristian’s Algorithm observes a local clock time of<br>
&emsp;&emsp;&emsp;&emsp;&emsp;1399157100.00s at the start of its RPC, and 1399157100.10s at the end<br>
&emsp;&emsp;&emsp;&emsp;&emsp;of its RPC. The RPC returns a server timestamp of 1399157100.05s. What<br>
&emsp;&emsp;&emsp;&emsp;&emsp;client-server clock skew will the algorithm calculate? Justify your answer.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[2 marks\]<br>
&emsp;&emsp;&emsp;(iii) Using Cristian’s Algorithm as the underlying primitive, propose a time<br>
&emsp;&emsp;&emsp;&emsp;&emsp;synchronisation algorithm that measures and compensates for clock drift.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[2 marks\]<br>
&emsp;(b)   Distributed logical clocks<br>
&emsp;&emsp;&emsp;The make build tool relies on file-system timestamps to determine whether an<br>
&emsp;&emsp;&emsp;object file is older than a source file: if so, the object file is rebuilt; if not, then<br>
&emsp;&emsp;&emsp;a rebuild is avoided. However, it is common practice to store source code in<br>
&emsp;&emsp;&emsp;a distributed file system and object files in a local temporary directory. The<br>
&emsp;&emsp;&emsp;Network File System (NFS) stores file creation and modification times based on<br>
&emsp;&emsp;&emsp;the server clock, whereas the local file system uses a local clock.<br>
&emsp;&emsp;&emsp;(i)   Describe the two failure modes make may experience if client and server<br>
&emsp;&emsp;&emsp;&emsp;&emsp;clocks are out of sync.   \[2 marks\]<br>
&emsp;&emsp;&emsp;(ii) One solution is to use NTP to synchronise client and server clocks. Describe<br>
&emsp;&emsp;&emsp;&emsp;&emsp;two reasons why this might work poorly in practice.   \[2 marks\]<br>
&emsp;&emsp;&emsp;(iii) The NFS developers decide that Lamport Clocks may be able to solve the<br>
&emsp;&emsp;&emsp;&emsp;&emsp;problem, as they track the happens-before relationship. During a particular<br>
&emsp;&emsp;&emsp;&emsp;&emsp;run, make finds a source logical timestamp s is less than the object logical<br>
&emsp;&emsp;&emsp;&emsp;&emsp;timestamp o.   Explain why it is problematic to use Lamport Clocks to<br>
&emsp;&emsp;&emsp;&emsp;&emsp;conclude that the object file should not be recompiled.   \[4 marks\]<br>
&emsp;&emsp;&emsp;(iv) Explain why Vector Clocks might be more suitable than Lamport Clocks<br>
&emsp;&emsp;&emsp;&emsp;&emsp;for this problem.   \[2 marks\]<br>
&emsp;&emsp;&emsp;(v) Explain what a Vector-Clock-based make should do if there is no defined<br>
&emsp;&emsp;&emsp;&emsp;&emsp;happens-before relationship between source vector s and object vector o.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[4 marks\]

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1

