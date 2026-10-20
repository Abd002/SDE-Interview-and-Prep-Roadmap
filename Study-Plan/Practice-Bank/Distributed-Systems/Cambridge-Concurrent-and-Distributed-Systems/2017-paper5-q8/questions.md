# Cambridge Computer Science Tripos 2017, Paper 5, Question 8: Questions

> Copied from the original: <https://www.cl.cam.ac.uk/teaching/exams/pastpapers/y2017p5q8.pdf>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

**COMPUTER SCIENCE TRIPOS Part IB – 2017 – Paper 5**

**8**   **Concurrent and Distributed Systems (RNW)**

&emsp;The developers of FictionalOS have an implementation of the Network File System<br>
&emsp;version 3 (NFSv3) without support for distributed locking. As a result, applications<br>
&emsp;experience race conditions when operating concurrently on files in NFS. Rather than<br>
&emsp;using the hideously complex NFS distributed locking protocol, the OS developers<br>
&emsp;decide to develop their own simpler locking mechanism (“How hard can it be?”).<br>
&emsp;They add two new NFS remote procedure calls (RPCs) that can be used on file nodes<br>
&emsp;in NFS: `NFS_LOCK` and `NFS_UNLOCK`, which lock and unlock nodes, respectively. These<br>
&emsp;are implemented through simple atomic operations on the in-memory `node` data<br>
&emsp;structure representing a file on the NFS file server:

&emsp;&emsp;&emsp;`nfs_lock(node)` `{`   `nfs_unlock(node)` `{`<br>
&emsp;&emsp;&emsp;&emsp;`atomic` `{`   `atomic` `{`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`if` `(node->lock_held` `!=` `0)`   `node->lock_held` `=` `0;`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`return` `(FAILURE);`   `return` `(SUCCESS);`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`node->lock_held` `=` `1;`   `}`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`return` `(SUCCESS);`   `}`<br>
&emsp;&emsp;&emsp;&emsp;`}`<br>
&emsp;&emsp;&emsp;`}`

&emsp;SunRPC retransmission ensures reliable delivery when packets are lost. If a client<br>
&emsp;receives `FAILURE`, it will issue new RPCs each second until it receives `SUCCESS`.

&emsp;(a) Explain why, when server reboots, concurrent applications writing to files across<br>
&emsp;&emsp;&emsp;multiple nodes may suffer data races despite acquiring suitable locks, and<br>
&emsp;&emsp;&emsp;describe a solution to this problem.   \[4 marks\]

&emsp;(b)   (i)   Define at-least once RPC semantics.   \[1 mark\]

&emsp;&emsp;&emsp;(ii) Explain why at-least once RPC semantics may cause trouble for each of<br>
&emsp;&emsp;&emsp;&emsp;&emsp;the `NFS_LOCK` and `NFS_UNLOCK` RPCs.   \[4 marks\]

&emsp;(c)   Explain why the polling nature of the `NFS_LOCK` RPC, as described, makes it<br>
&emsp;&emsp;&emsp;difficult to implement reliable server-side deadlock detection.   \[4 marks\]

&emsp;(d) (i)   Define priority inheritance and explain what problem it solves.   \[2 marks\]

&emsp;&emsp;&emsp;(ii) Describe the changes to the `NFS_LOCK` and `NFS_UNLOCK` RPCs necessary<br>
&emsp;&emsp;&emsp;&emsp;&emsp;to implement priority inheritance. Include any new RPC arguments and<br>
&emsp;&emsp;&emsp;&emsp;&emsp;return values.   Explain the changes (and limitations) this imposes on<br>
&emsp;&emsp;&emsp;&emsp;&emsp;software implementations.   \[5 marks\]

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1

