# Cambridge Computer Science Tripos 2013, Paper 5, Question 9: Questions

> Copied from the original: <https://www.cl.cam.ac.uk/teaching/exams/pastpapers/y2013p5q9.pdf>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

**COMPUTER SCIENCE TRIPOS Part IB – 2013 – Paper 5**

**9**   **Concurrent and Distributed Systems (RNW)**

&emsp;Sun’s Network File System (NFS) is the standard distributed file system used with<br>
&emsp;UNIX, and has gone through a progression of versions (2, 3, 4) that have gradually<br>
&emsp;improved performance and semantics.

&emsp;(a) Remote procedure call (RPC)

&emsp;&emsp;&emsp;(i)   Explain how Sun RPC handle byte order (endianness).   \[2 marks\]

&emsp;&emsp;&emsp;(ii) This approach may result in unnecessary work. State when this occurs and<br>
&emsp;&emsp;&emsp;&emsp;&emsp;how might this be avoided.   \[2 marks\]

&emsp;(b)   Network File System version 2 (NFSv2) and version 3 (NFSv3)

&emsp;&emsp;&emsp;(i)   A key design premise for NFS was that the server be “stateless” with respect<br>
&emsp;&emsp;&emsp;&emsp;&emsp;to the client. State what this means for distributed file locking in NFSv2<br>
&emsp;&emsp;&emsp;&emsp;&emsp;and NFSv3.   \[2 marks\]

&emsp;&emsp;&emsp;(ii) Another key design premise for NFSv2 was the “idempotence” of RPCs;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;what does this mean?   \[2 marks\]

&emsp;&emsp;&emsp;(iii) One key improvement in NFSv3 was the addition of the READDIRPLUS<br>
&emsp;&emsp;&emsp;&emsp;&emsp;RPC. Explain why did this helps performance.   \[4 marks\]

&emsp;&emsp;&emsp;(iv) NFSv3 implements what is termed “close-to-open consistency” for file data<br>
&emsp;&emsp;&emsp;&emsp;&emsp;caching: if client C1 writes to a file, closes the file, and client C2 now<br>
&emsp;&emsp;&emsp;&emsp;&emsp;opens the file for read, then it must see the results of all writes issued by<br>
&emsp;&emsp;&emsp;&emsp;&emsp;C1 prior to close. However, if C2 opens the file before C1 has closed it,<br>
&emsp;&emsp;&emsp;&emsp;&emsp;then C2 may see some, all, or none of the writes issued by C1 (and in<br>
&emsp;&emsp;&emsp;&emsp;&emsp;arbitrary order). Close-to-open consistency is achieved through careful use<br>
&emsp;&emsp;&emsp;&emsp;&emsp;of synchronous RPC semantics, combined with file timestamp information<br>
&emsp;&emsp;&emsp;&emsp;&emsp;piggybacked onto server replies on all RPCs that operate on files.

&emsp;&emsp;&emsp;&emsp;&emsp;Explain how close-to-open consistency allows performance to be improved.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[4 marks\]

&emsp;&emsp;&emsp;(v) NFSv3 adds a new RPC, ACCESS, allowing the client to delegate access<br>
&emsp;&emsp;&emsp;&emsp;&emsp;control checks at file-open time to the server, rather than performing them<br>
&emsp;&emsp;&emsp;&emsp;&emsp;on the client. This allows client and server security models to differ.

&emsp;&emsp;&emsp;&emsp;&emsp;Explain how this addition also helps implement close-to-open consistency<br>
&emsp;&emsp;&emsp;&emsp;&emsp;in the presence of read caching.   \[4 marks\]

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1

