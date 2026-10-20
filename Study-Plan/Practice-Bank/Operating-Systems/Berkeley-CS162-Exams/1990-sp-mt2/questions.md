# Berkeley CS162 Spring 1990: Midterm 2: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS162 Spring 1990, MT2<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**CS 162, Spring 1990**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Midterm #2**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Professor David Anderson**

**Problem #1 (10 points)**<br>
true/false<br>
-I/O buffering can increase CPU utilization.<br>
-The two "sides" of a UNIX pseudo-tty are equivelent.<br>
-Shortest CPU burst first process scheduling minimizes average turnaround time.<br>
-Sun NFS client caches are always consistent<br>
-Data can flow both up and down between adjacent protocol layers.

**Problem #2 (10 points)**<br>
a) List three input functions and one output function of the BSD UNIX line discipline in cooked mode<br>
b) Would system performance increase or decrease if line disciplines were moved from the kernel to the user<br>
level? Explain.

**Problem #3 (10 points)**<br>
a) What does it mean to say that access to a resource is "fair"?<br>
b) What is "aging"? Under what circumstances does aging provide fairness and why?<br>
c) The "fair share scheduler" used in some versions of UNIX provides a different kind of fairness. Describe<br>
as precisely as you can this notion of "fairness"?<br>
d) Describe, in words or in pseudocode, what the sending side of RMP does to deliver a client message.<br>
When should the client call (to send the message) return?<br>
e) Describe, in words or in pseudocode, what the receiving side of RMP does to handle an incoming<br>
datagram.<br>
f) Is RMP appropriate for wide-area networks? Explain.

**Problem #4 (15 points)**<br>
Not available

**Problem #5 (15 points)**<br>
Not available.

**Problem #6 (15 points)**<br>
Acne's computers use a BSD UNIX-based operating system. Noah Tall has complained that the following<br>
pair of calls run slower than they should:

fd = open("/a/b", O\_RDONLY, 0);<br>
read(fd, buf, l);

CS 162, Spring 1990 Midterm #2 Professor David Anderson   1


---

<a id="page-2"></a>
**Page 2**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS162 Spring 1990, MT2<br>
where /a/b is any existing file, and the buffer and inode caches are initially empty.

a) Explain to Noah why this is slow (tell him about all the disk operations that are needed.<br>
b) Propose a reasonable way to change the UNIX file system disk layout to reduce the number of disk<br>
operations in the above case.

**Problem #7 (25 points)**<br>
Your next assignment at Acne is to design a transport protocol. The "Reliable Message Protocol" (RMP) is


![Figure on page 2](figures/questions-p02-fig01.png)

RMP client messages may be larger than the 64KB limit on IP datagrams. RMP will be used across networks<br>
that can damage, lose, reorder, and delay packets.<br>
You're in charge of the data-transfer part of RMP; another group is handling connection establishment. For<br>
simplicity, you decide that RMP will use a "stop-and-wait" protocol (i.e., a send window siize of 1).

&emsp;**Posted by HKN (Electrical Engineering and Computer Science Honor Society)**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**University of California at Berkeley**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**If you have any questions about these online exams**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**please contact**  **examfile@hkn.eecs.berkeley.edu.**

Problem #6 (15 points)   2

