# Cambridge Computer Science Tripos 2016, Paper 5, Question 9: Questions

> Copied from the original: <https://www.cl.cam.ac.uk/teaching/exams/pastpapers/y2016p5q9.pdf>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

**COMPUTER SCIENCE TRIPOS Part IB – 2016 – Paper 5**

**9**   **Concurrent and Distributed Systems (RNW)**

&emsp;Remote Procedure Call (RPC) allows procedures (functions, methods) to be<br>
&emsp;forwarded over the network, and is a fundamental building block of distributed<br>
&emsp;systems such as the Network File System (NFS).

&emsp;(a) Explain, with respect to a client, what it means for an RPC call to be:

&emsp;&emsp;&emsp;(i)   Synchronous   \[1 mark\]

&emsp;&emsp;&emsp;(ii) Asynchronous   \[1 mark\]

&emsp;&emsp;&emsp;(iii) Idempotent   \[1 mark\]

&emsp;(b)   Distributed-filesystem clients utilize different tradeoffs between performance and<br>
&emsp;&emsp;&emsp;consistency for operations on the directory namespace (e.g., file or directory<br>
&emsp;&emsp;&emsp;creation) versus those on file data itself. The following program creates and<br>
&emsp;&emsp;&emsp;opens a file `foo`, writes some data to it, and closes it, via NFSv3:

&emsp;&emsp;&emsp;`fd` `=` `open("foo",` `O_CREAT` `|` `O_RDWR,` `0755);`<br>
&emsp;&emsp;&emsp;`//` `POINT` `A`<br>
&emsp;&emsp;&emsp;`write(fd,` `data,` `sizeof(data));`<br>
&emsp;&emsp;&emsp;`//` `POINT` `B`<br>
&emsp;&emsp;&emsp;`close(fd);`<br>
&emsp;&emsp;&emsp;`//` `POINT` `C`

&emsp;&emsp;&emsp;For each of points A, B, and C in the program, discuss whether or not another<br>
&emsp;&emsp;&emsp;NFSv3 client is guaranteed to be able to see the results of each of `open` and (if<br>
&emsp;&emsp;&emsp;it has been called) `write`.   \[5 marks\]

&emsp;(c)   The developers of a new distributed filesystem use a persistent log to ensure<br>
&emsp;&emsp;&emsp;all-or-nothing retry semantics for filesystem operations. However, this comes<br>
&emsp;&emsp;&emsp;at a substantial performance cost.   Describe two circumstances under which<br>
&emsp;&emsp;&emsp;filesystem RPCs can be excluded from the log while maintaining correctness,<br>
&emsp;&emsp;&emsp;and give an example of each.   \[4 marks\]

&emsp;(d) The distributed filesystem’s persistent RPC log is maintained in a write-ahead<br>
&emsp;&emsp;&emsp;log stored in local disk blocks. Explain why large RPCs may require special care<br>
&emsp;&emsp;&emsp;in the server-side log implementation.   \[2 marks\]

&emsp;(e) RPC protocols and write-ahead logging both rely on unique ID numbers.<br>
&emsp;&emsp;&emsp;Explain why reusing client-generated RPC IDs for server log transaction IDs<br>
&emsp;&emsp;&emsp;could harm each of correctness, scalability, and security.   \[6 marks\]

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1

