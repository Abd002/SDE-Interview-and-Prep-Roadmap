# Cambridge Computer Science Tripos 2013, Paper 5, Question 8: Questions

> Copied from the original: <https://www.cl.cam.ac.uk/teaching/exams/pastpapers/y2013p5q8.pdf>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

**COMPUTER SCIENCE TRIPOS Part IB – 2013 – Paper 5**

**8**   **Concurrent and Distributed Systems (RNW)**

&emsp;(a) The ACID properties are often used to define transactional semantics.

&emsp;&emsp;&emsp;(i)   Define “atomicity” as used in the ACID context.   \[1 mark\]

&emsp;&emsp;&emsp;(ii) Define “durability” as used in the ACID context.   \[1 mark\]

&emsp;(b)   Write-ahead logging is a commonly used scheme to accomplish transactional<br>
&emsp;&emsp;&emsp;semantics when storing a database on a block storage device, such as a hard<br>
&emsp;&emsp;&emsp;disk.

&emsp;&emsp;&emsp;(i)   Under what circumstances,   during write-ahead log recovery,   can a<br>
&emsp;&emsp;&emsp;&emsp;&emsp;transaction in the UNDO list be moved to the REDO list?   \[2 marks\]

&emsp;&emsp;&emsp;(ii) Synchronously flushing commit records to disk is expensive. How can we<br>
&emsp;&emsp;&emsp;&emsp;&emsp;safely reduce synchronous I/O operations on a high-throughput system<br>
&emsp;&emsp;&emsp;&emsp;&emsp;without sacrificing ACID properties?   \[2 marks\]

&emsp;&emsp;&emsp;(iii) Describe two performance changes that might arise from using your solution<br>
&emsp;&emsp;&emsp;&emsp;&emsp;to part (b)(ii).   \[2 marks\]

&emsp;(c)   (i)   Transaction records in a write-ahead logging scheme contain five fields:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;⟨TransactionID, ObjID, Operation, OldValue, NewValue⟩, but storing the<br>
&emsp;&emsp;&emsp;&emsp;&emsp;complete old and new values can consume significant amounts of space. One<br>
&emsp;&emsp;&emsp;&emsp;&emsp;strategy that might be employed, for reversible operations being applied<br>
&emsp;&emsp;&emsp;&emsp;&emsp;to some data such as XOR by a constant, is to store only the constant<br>
&emsp;&emsp;&emsp;&emsp;&emsp;arguments, rather than the full before and after data.   What problems<br>
&emsp;&emsp;&emsp;&emsp;&emsp;might occur as a result of this design choice?   \[4 marks\]

&emsp;&emsp;&emsp;(ii) Write-ahead logging systems must know the actual on-disk sector size for<br>
&emsp;&emsp;&emsp;&emsp;&emsp;the write-ahead log to behave correctly. An errant disk vendor decides to<br>
&emsp;&emsp;&emsp;&emsp;&emsp;rebrand its 512-byte sector disks as 2K-sector disks, and adjusts the value<br>
&emsp;&emsp;&emsp;&emsp;&emsp;reported back to the database system.   How might this affect database<br>
&emsp;&emsp;&emsp;&emsp;&emsp;integrity?   \[4 marks\]

&emsp;&emsp;&emsp;(iii) Explain how a database vendor who is aware of the problem described in<br>
&emsp;&emsp;&emsp;&emsp;&emsp;part (c)(ii) mitigate this problem in software, and what limitations might<br>
&emsp;&emsp;&emsp;&emsp;&emsp;there be to this approach.   \[4 marks\]

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1

