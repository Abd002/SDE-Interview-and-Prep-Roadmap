# Cambridge Computer Science Tripos 2014, Paper 5, Question 9: Questions

> Copied from the original: <https://www.cl.cam.ac.uk/teaching/exams/pastpapers/y2014p5q9.pdf>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

**COMPUTER SCIENCE TRIPOS Part IB – 2014 – Paper 5**

**9**   **Concurrent and Distributed Systems (RNW)**

&emsp;Java Remote Method Invocation (RMI) is a Remote Procedure Call (RPC) system<br>
&emsp;that allows invocation of methods on objects in remote Java Virtual Machines<br>
&emsp;(JVMs).

&emsp;(a) (i)   Describe what it means for a class to be labelled as serializable.   \[2 marks\]<br>
&emsp;&emsp;&emsp;(ii) Describe what it means for a class to be a remote class.   \[2 marks\]<br>
&emsp;&emsp;&emsp;(iii) Describe the function of RMI’s object registry.   \[2 marks\]<br>
&emsp;(b)   RPC implementations are unable to implement idealised exactly-once semantics,<br>
&emsp;&emsp;&emsp;instead providing all-or-nothing, at-most-once, or at-least-once semantics.<br>
&emsp;&emsp;&emsp;(i)   Describe the server-side state obligation for each of all-or-nothing, at-most-<br>
&emsp;&emsp;&emsp;&emsp;&emsp;once, and at-least-once semantics.   \[3 marks\]<br>
&emsp;&emsp;&emsp;(ii) Describe the classes of distributed filesystem RPCs in which it is safe to<br>
&emsp;&emsp;&emsp;&emsp;&emsp;use at-least-once instead of all-or-nothing semantics.   \[2 marks\]<br>
&emsp;&emsp;&emsp;(iii) A distributed filesystem stores object replicas on multiple servers for fault<br>
&emsp;&emsp;&emsp;&emsp;&emsp;tolerance. Successful reads must be made to at least Qr servers, and writes<br>
&emsp;&emsp;&emsp;&emsp;&emsp;must be made to at least Qw servers.   The client submits requests to<br>
&emsp;&emsp;&emsp;&emsp;&emsp;all servers simultaneously using a “MultiRPC”. Describe when MultiRPC<br>
&emsp;&emsp;&emsp;&emsp;&emsp;must resend (a) reads and (b) writes due to packet loss.   \[2 marks\]<br>
&emsp;(c)   Java is a garbage-collected language: when an object is unreachable, it will<br>
&emsp;&emsp;&emsp;be freed. Cycles can exist in which otherwise disconnected objects reference<br>
&emsp;&emsp;&emsp;one another, preventing reference counts from reaching zero. Cycle detection<br>
&emsp;&emsp;&emsp;addresses this problem: execution is suspended and the object-reference graph<br>
&emsp;&emsp;&emsp;is searched for memory that can be recovered. Distributed garbage collection<br>
&emsp;&emsp;&emsp;faces many of the same challenges: cycles may exist between objects on different<br>
&emsp;&emsp;&emsp;servers, which cannot be detected by local garbage collectors in individual JVMs.<br>
&emsp;&emsp;&emsp;(i)   How does RMI track distributed references to a local object that has been<br>
&emsp;&emsp;&emsp;&emsp;&emsp;exported to a remote client?   \[2 marks\]<br>
&emsp;&emsp;&emsp;(ii) A developer implements a distributed garbage collector (GC) for RMI. The<br>
&emsp;&emsp;&emsp;&emsp;&emsp;GC queries all nodes for graphs of local and remote references, identifying<br>
&emsp;&emsp;&emsp;&emsp;&emsp;disconnected cycles spanning multiple JVMs. JVMs are notified of remote<br>
&emsp;&emsp;&emsp;&emsp;&emsp;references that can be safely released to break cycles. Unfortunately, this<br>
&emsp;&emsp;&emsp;&emsp;&emsp;does not work: when the system is busy, live references get broken, causing<br>
&emsp;&emsp;&emsp;&emsp;&emsp;user-visible failures. Describe a scenario in which this algorithm, without<br>
&emsp;&emsp;&emsp;&emsp;&emsp;additional synchronisation, may lead to incorrectness.   \[5 marks\]

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1

