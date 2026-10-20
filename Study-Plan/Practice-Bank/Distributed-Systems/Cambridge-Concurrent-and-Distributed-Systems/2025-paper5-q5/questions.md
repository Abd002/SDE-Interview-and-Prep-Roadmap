# Cambridge Computer Science Tripos 2025, Paper 5, Question 5: Questions

> Copied from the original: <https://www.cl.cam.ac.uk/teaching/exams/pastpapers/y2025p5q5.pdf>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

**COMPUTER SCIENCE TRIPOS Part IB – 2025 – Paper 5**

**5**   **Concurrent and Distributed Systems (mk428)**

&emsp;You are developing a service that sets up video calls between random pairs of<br>
&emsp;strangers. It works as follows: a user connects to a server when they want to talk<br>
&emsp;to someone. If another user is already connected to the same server and not already<br>
&emsp;talking to someone else, the server connects the two users to each other. If nobody<br>
&emsp;else on the same server is free, the user waits for the next user to connect.

&emsp;(a) Assume the server uses one thread per connected user to handle that user’s<br>
&emsp;&emsp;&emsp;connection. Outline (in words, not code) how you might implement a module<br>
&emsp;&emsp;&emsp;that determines which users to connect to each other. How will you ensure it is<br>
&emsp;&emsp;&emsp;thread-safe when multiple users connect concurrently?   \[4 marks\]

&emsp;(b)   Using Java’s monitor API (`synchronized`, `wait()`, `notify()`, `notifyAll()`),<br>
&emsp;&emsp;&emsp;write pseudocode for a class with a thread-safe method matchUser(u1) →u2<br>
&emsp;&emsp;&emsp;that takes a user object u1 and returns another user object u2. The return value<br>
&emsp;&emsp;&emsp;u2 must be the argument passed by another thread to the same method in a<br>
&emsp;&emsp;&emsp;call matchUser(u2) →u1, and that call must return u1. In other words, u1 and<br>
&emsp;&emsp;&emsp;u2 are two users whose video feeds will be linked together. You do not need to<br>
&emsp;&emsp;&emsp;write any pseudocode for the video handling. If no other user object is currently<br>
&emsp;&emsp;&emsp;available for matching, the method must block until another thread has called<br>
&emsp;&emsp;&emsp;matchUser().

&emsp;&emsp;&emsp;Briefly justify why your solution is correct, for example using comments in your<br>
&emsp;&emsp;&emsp;pseudocode. Details of syntax and Java APIs are not important; the pseudocode<br>
&emsp;&emsp;&emsp;just needs to be clear.   \[10 marks\]

&emsp;(c)   Java offers signal-and-continue semantics for its monitors. Explain what this<br>
&emsp;&emsp;&emsp;means, and how you ensure that the code you wrote for Part (b) is correct<br>
&emsp;&emsp;&emsp;under this semantics. Also, justify why you used `notify()` or `notifyAll()` in<br>
&emsp;&emsp;&emsp;your answer to Part (b).   \[6 marks\]

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1

