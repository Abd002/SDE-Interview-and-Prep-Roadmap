# MIT 6.824/6.5840 2021: Quiz 1: Questions

> Copied from the original: <https://pdos.csail.mit.edu/6.824/quizzes.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

6.824 2021 Midterm Exam

This is a 90-minute exam. Please write down any assumptions you make. You are allowed to consult 6.824 papers, notes, and lab code. If you have questions, please<br>
ask them on Piazza in a private post to the staff, or ask in the Zoom chat if you are taking the exam during lecture time. Please don't collaborate or discuss the exam<br>
with anyone.<br>
In particular, please do not discuss the contents of the exam with anyone at all besides the course staff until at least 3:00 PM EDT on Friday, April 2nd, to allow<br>
students in other timezones to take the test.<br>
MapReduce

In lab 1, a worker in the MapReduce library doesn't hand out any reduce tasks until all map tasks have completed and have produced all their intermediate files. The<br>
implementation described in the "MapReduce" paper by Dean and Ghemawat allows reduce workers to start reading intermediate files before all map tasks have<br>
completed.<br>
A. Briefly describe the advantage of allowing reduce workers to start reading intermediate files early.<br>
B. Describe how you would modify your lab implementation to allow reading of intermediate files early, as Google's MapReduce library does, while maintaining<br>
correctness. (You don't have to write code, but sketch out a design in words. Keep your answer brief.)<br>
MapReduce (Lab)

Zara Zoom has implemented MapReduce for 6.824 Lab 1. Their worker code loops, and asks the coordinator for tasks using a GetTask RPC call. Their coordinator<br>
code to handle GetTask RPCs and assign tasks to workers is as follows:


![Figure on page 1](figures/questions-p01-fig01.png)

Zara also has their workers send FinishedTask RPCs to tell the coordinator when a particular map task has finished.


---

<a id="page-2"></a>
**Page 2**


![Figure on page 2](figures/questions-p02-fig02.png)

You can assume that all code not shown is correct.<br>
When testing their implementation, Zara notices that a job with map tasks numbered 0, 1, and 2 often fails.<br>
A. In some scenarios, some reduce workers cannot open intermediate file mr-1-x (where x is the Reduce task number). Explain a scenario that could cause this to<br>
occur.<br>
B. Briefly describe what Zara should do to fix this problem.<br>
GFS

Consider the paper "The Google File System" by Ghemawat et al.<br>
A. The GFS file system doesn't guarantee linearizability. Give an example of how the lack of linearizability complicates writing programs with GFS. That is, describe a<br>
feature that one must implement when using GFS that one wouldn't have to implement if GFS would have provided linearizability. Briefly explain your answers.<br>
B. Briefly explain why append operations are not allowed to span chunk boundaries.<br>
VMware FT

In VM-FT (as described by in the paper "Fault-Tolerant Virtual Machines" by Scales et al.), the backup lags behind the primary to ensure, for example, that network<br>
interrupts are delivered at exactly the same instruction at the backup as on the primary. Briefly explain what could go wrong if the backup delivered interrupts at a<br>
different instruction than the primary?<br>
Raft

Consider figure 7 of the Raft paper "In search of Understandable Consensus Algorithms (Extended Version)". The last follower (at the bottom of the figure) has term 3<br>
in its last index 11. Could there have been a scenario under which that follower's log had entries in indexes 12, 13, and 14 in figure 7? What terms could those entries<br>
have? (Briefly explain your answer.)<br>
Raft (Lab)

Rob Remote managed to get a correct Raft implementation through Lab 2C (persistence). He is interested in analyzing his correct system. Specifically, Rob wants to<br>
know how many times a particular value passed into Start() is sent over any of the servers' applyCh . Suppose he has 5 servers.<br>
After running for a while, the tester calls Start() with a command value 2 and returns isLeader=true and index=100 .<br>
Determine all possible values for the number of times command 2 is sent through an applyCh in the following cases (i.e., if a command is delivered once on each<br>
peer's applyCh , then the total number of times is 5). Briefly explain your answers.<br>
A. No failures of any kind<br>
B. Network partitions possible (but no crashes)<br>
C. Crashes possible (but no network partitions)<br>
Raft (Persistence)

While implementing Raft, Connie Consensus decided that instead of persisting the entire log, she would persist only committed entries. Connie claims that<br>
uncommitted entries could have been lost because of crashes or network issues so it's safe to ignore them until they've been committed. Does this change affect<br>
Raft's correctness? If so, provide a sequence of events that would lead to unsafe behavior. You can assume that the rest of Connie's implementation is correct.<br>
Zookeeper


---

<a id="page-3"></a>
**Page 3**

Consider Zookeeper, as described in the paper "ZooKeeper: Wait-free coordination for Internet-scale systems".<br>
A. Zookeeper's read throughput scales with the number of servers (e.g., see the red line in Figure 5). The Raft paper describes an optimization for read-only<br>
operations. Would that optimization allow Raft to scale read throughput with the number of peers as in Zookeeper? (Briefly explain your answer.)<br>
B. ZooKeeper performs all operations in FIFO client order. Consider the following sequence of operations starting in a state where f contains 0 (time goes down):


![Figure on page 3](figures/questions-p03-fig03.png)

For this example, briefly explain what could go wrong if ZooKeeper didn't guarantee FIFO client order. In particular, what values could the read of f by client 2 return?<br>
6.824

A. Which papers/lectures should we omit in future 6.824 years, because they are not useful or are too hard to understand?<br>
\[ \] MapReduce<br>
\[ \] Q&A Lecture MapReduce<br>
\[ \] GFS<br>
\[ \] VMware FT<br>
\[ \] Raft<br>
\[ \] ZooKeeper<br>
\[ \] Q&A Lecture Raft<br>
B. Which papers/lectures did you find most useful?<br>
\[ \] MapReduce<br>
\[ \] Q&A Lecture MapReduce<br>
\[ \] GFS<br>
\[ \] VMware FT<br>
\[ \] Raft<br>
\[ \] Q&A Lecture Raft<br>
\[ \] ZooKeeper<br>
C. What should we change about the course to make it better?

