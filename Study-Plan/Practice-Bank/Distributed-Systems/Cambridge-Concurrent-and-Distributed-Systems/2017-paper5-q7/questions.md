# Cambridge Computer Science Tripos 2017, Paper 5, Question 7: Questions

> Copied from the original: <https://www.cl.cam.ac.uk/teaching/exams/pastpapers/y2017p5q7.pdf>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

**COMPUTER SCIENCE TRIPOS Part IB – 2017 – Paper 5**

**7**   **Concurrent and Distributed Systems (RNW)**

&emsp;SimplisticFS is an in-memory filesystem, implemented as a directed and (mostly)<br>
&emsp;acyclic graph in which nodes represent directories (which contain names and pointers<br>
&emsp;to other nodes, including a special entry named `‘‘..’’` that points back to its parent<br>
&emsp;node) or files (leaf nodes that contain data). The in-memory structure, with the<br>
&emsp;exception of `‘‘..’’` entries in directories, is therefore a tree. SimplisticFS does not<br>
&emsp;support hard links, and the `‘‘..’’` of the root node points back to itself. Path<br>
&emsp;lookups start at the root node, and pathnames with multiple segments, separated<br>
&emsp;by `‘‘/’’`, are implemented as lookup operations on successive nodes. For example,<br>
&emsp;opening `‘‘/foo/bar’’` will look up `‘‘foo’’` in the root, and then `‘‘bar’’` relative<br>
&emsp;to the `foo` node.

&emsp;Fine-grained locking adds a read-write lock to each node to ensure safe concurrent<br>
&emsp;access. Operations for reading a directory entry (e.g., to list the contents or look up<br>
&emsp;a child), or for reading file data will: acquire the node lock for read; perform the<br>
&emsp;operation; and then release it. Operations for mutating a directory entry, (e.g., to<br>
&emsp;add or remove a child node of a directory), or for modifying file data will: acquire its<br>
&emsp;lock for write; perform the operation; and then release it. The lock implementation<br>
&emsp;permits read recursion, write recursion, and race-free lock upgrades from read to<br>
&emsp;write by threads.

&emsp;(a) For (i) files and (ii) directories, explain, giving examples, how using a read-write<br>
&emsp;&emsp;&emsp;lock may improve performance compared to mutual exclusion.   \[4 marks\]

&emsp;(b)   The developers discover that compound operations, such as recursive path<br>
&emsp;&emsp;&emsp;lookup, suffer from race conditions.   They decide to adopt strict two-phase<br>
&emsp;&emsp;&emsp;locking across compound operations to resolve this problem.

&emsp;&emsp;&emsp;(i)   Define strict 2-phase locking and describe how to apply it.   \[4 marks\]

&emsp;&emsp;&emsp;(ii) Explain why deadlock cannot occur prior to this change.   \[2 marks\]

&emsp;&emsp;&emsp;(iii) The new strategy suffers deadlocks when files are removed under high load.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Given that removing a file requires a write lock on its parent directory, give<br>
&emsp;&emsp;&emsp;&emsp;&emsp;an example of how a deadlock might occur.   \[4 marks\]<br>
&emsp;(c)   Moving from a “giant lock” to this finer-grained model focused on files and<br>
&emsp;&emsp;&emsp;directories improves performance for some but not all workloads.<br>
&emsp;&emsp;&emsp;(i)   Describe and explain an example of a workload in which file-granularity<br>
&emsp;&emsp;&emsp;&emsp;&emsp;locking is unlikely to eliminate lock contention.   \[2 marks\]<br>
&emsp;&emsp;&emsp;(ii) Propose a more granular locking strategy to improve parallelism with<br>
&emsp;&emsp;&emsp;&emsp;&emsp;respect to (c)(i). Describe the potential performance benefit with respect<br>
&emsp;&emsp;&emsp;&emsp;&emsp;to that workload, and additional overhead that might be incurred.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[4 marks\]

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1

