# Cambridge Computer Science Tripos 2012, Paper 5, Question 7: Questions

> Copied from the original: <https://www.cl.cam.ac.uk/teaching/exams/pastpapers/y2012p5q7.pdf>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

**COMPUTER SCIENCE TRIPOS Part IB – 2012 – Paper 5**

**7**   **Concurrent and Distributed Systems (SMH)**

&emsp;(a) What is the relationship between critical sections and mutual exclusion?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[2 marks\]

&emsp;(b)   Describe how mutual exclusion can be achieved using:

&emsp;&emsp;&emsp;(i)   Spinlocks   \[2 marks\]

&emsp;&emsp;&emsp;(ii) Semaphores   \[2 marks\]

&emsp;&emsp;&emsp;(iii) Event Counts and Sequencers   \[2 marks\]

&emsp;(c)   Describe the operation of a monitor. Be sure to explain how it supports mutual<br>
&emsp;&emsp;&emsp;exclusion and condition synchronization.   \[6 marks\]

&emsp;(d) Why are monitors used in preference to conditional critical regions?   \[2 marks\]

&emsp;(e) In an effort to promote diversity, the Master of Holy Rock College, Cambridge,<br>
&emsp;&emsp;&emsp;decides that the JCR must always hold at least one state school educated (SSE)<br>
&emsp;&emsp;&emsp;student for every three public school educated (PSE) students. Reasoning that<br>
&emsp;&emsp;&emsp;students are not very dissimilar from threads, he suggests the following entry<br>
&emsp;&emsp;&emsp;and exit routines be followed:

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`JCR` `=` `new` `Semaphore(0);`

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`/*` `for` `SSE` `threads` `*/`   `/*` `for` `PSE` `threads` `*/`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`enterRoom()` `{`   `enterRoom()` `{`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`signal(JCR,` `3);`   `wait(JCR);`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`}`   `}`

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`leaveRoom()` `{`   `leaveRoom()` `{`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`wait(JCR);`   `signal(JCR,` `1);`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`wait(JCR);`   `}`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`wait(JCR);`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`}`

&emsp;&emsp;&emsp;We can assume that undergraduates are smart enough not to try and enter the<br>
&emsp;&emsp;&emsp;JCR when it is full. Yet despite this, the Master’s solution does not work quite<br>
&emsp;&emsp;&emsp;as hoped! Describe what can go wrong, and suggest a fix.   \[4 marks\]

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1

