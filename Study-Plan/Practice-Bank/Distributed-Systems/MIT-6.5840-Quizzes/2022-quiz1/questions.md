# MIT 6.824/6.5840 2022: Quiz 1: Questions

> Copied from the original: <https://pdos.csail.mit.edu/6.824/quizzes.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**


![Figure on page 1](figures/questions-p01-fig01.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Department of Electrical Engineering and Computer Science<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;MASSACHUSETTS INSTITUTE OF TECHNOLOGY

&emsp;&emsp;&emsp;&emsp;**6.824 Distributed System Engineering: Spring 2022**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Exam I**

Write your name on this cover sheet. If you tear out any sheets, please write your name on them.<br>
You have 80 minutes to complete this quiz.<br>
Some questions may be much harder than others. Read them all through first and attack them in<br>
the order that allows you to make the most progress. If you find a question ambiguous, write down<br>
any assumptions you make. Write neatly. In order to receive full credit you must answer each<br>
question as precisely as possible.<br>
You may use class notes, papers, and lab material. You may read them on your laptop, but you are<br>
not allowed to use any network. For example, you may not look at web sites or communicate with<br>
anyone.

&emsp;&emsp;&emsp;**I (7)**   **II (14)**   **III (14)**   **IV (35)**   **V (14)**   **VI (14)**   **VII (2)**   **Total (100)**

**Name:**<br>
**Submission Website E-Mail Address:**


---

<a id="page-2"></a>
**Page 2**

6.824 Spring 2022, Exam 1   Page 2 of 13

**I**   **MapReduce**

You’re writing a MapReduce-based application (a Map function and a Reduce function) that an-<br>
alyzes the way words are used in documents (the details of the analysis do not matter for this<br>
question). Each input document corresponds to a separate Map task. Your Reduce function needs<br>
to know the total number of times each word occurs in the total set of documents. You set up<br>
a database server that has a table mapping words to counts. You program your Map function to<br>
connect to that database over the network and tell it to increment the relevant count in the database<br>
for each word that Map sees in its input. You write your Reduce function to consult the database<br>
when it needs a word’s total count. You’re careful to reset the counts in the database to zero before<br>
starting a MapReduce job. You run only a single MapReduce job at a time.<br>
You find, to your surprise, that sometimes the counts that the Reduces read from the database are<br>
too high – higher than the total number of times a word actually appears.

&emsp;**1. \[7 points\]:** Explain what is going on.


---

<a id="page-3"></a>
**Page 3**

6.824 Spring 2022, Exam 1   Page 3 of 13

**II**   **GFS**

Consider the paper The Google File System by Ghemawat et al. Section 3.1 explains that the<br>
master grants each primary chunkserver a 60-second lease. The primary can act as primary during<br>
the lease time, but must stop when the lease expires. The master won’t assign a different server to<br>
be primary until after the lease has expired, but may do so immediately afterwards.<br>
The master starts counting the lease time when it sends the network message to the primary granting<br>
the lease. The primary starts counting the lease time when it receives that message. Assume for<br>
this question that the primary does not try to renew its lease.

&emsp;**2.**   **\[7 points\]:** Suppose the primary’s clock runs much faster than the master’s clock, so<br>
&emsp;that the primary thinks the lease expires many seconds before the master thinks it expires.<br>
&emsp;Briefly explain how the primary’s fast clock will cause a loss of performance.

&emsp;**3. \[7 points\]:** Suppose the network delays the lease grant message by ten seconds. For this<br>
&emsp;question, the master and primary clocks run at the same speed, and the network only delays<br>
&emsp;the lease grant message, but not other messages. Briefly explain how the delayed delivery of<br>
&emsp;the lease grant message could cause loss of correctness.


---

<a id="page-4"></a>
**Page 4**

6.824 Spring 2022, Exam 1   Page 4 of 13

**III**   **VMware FT**

The Design of a Practical System for Fault-Tolerant Virtual Machines, by Scales et al., says in<br>
Section 2.2 and Figure 2 that the Output Rule must be enforced for network packets sent to clients:<br>
before the Primary sends a packet to a client, it must wait until the Backup acknowledges that it<br>
has received all log entries up to that point. On the other hand, for operations such as modifying<br>
CPU registers or writing RAM, the Output Rule does not apply, and the Primary does not need to<br>
wait for the Backup.

&emsp;**4. \[7 points\]:** When the Primary tells the Backup about an output operation (as in Figure<br>
&emsp;2), does the Primary need to tell the Backup the content of the output? For example, when<br>
&emsp;the Primary is about to send a packet to a client, does it need to tell the Backup the content<br>
&emsp;of the packet? Explain your answer.


---

<a id="page-5"></a>
**Page 5**

6.824 Spring 2022, Exam 1   Page 5 of 13

A server replicated with VMware FT has an RPC handler with this code, intended to swap the<br>
content of two blocks stored in the Shared Disk:

SwapHandler():<br>
1\. read block 1 into buffer1<br>
2\. read block 2 into buffer2<br>
3\. write buffer2 to block 1<br>
4\. write buffer1 to block 2<br>
5\. respond "done" to the client

Block 1 starts out containing XX, and block 2 starts out containing YY. There’s only one client.<br>
The client sends a SwapHandler RPC request to the server, and (if the client doesn’t get a response)<br>
re-sends the request periodically until it gets a response. There are no other requests.

&emsp;**5. \[7 points\]:** If the Primary crashes after executing line 3, at that point the Shared Disk<br>
&emsp;will contain YY in both block 1 and block 2. After the Backup “goes live” and the client<br>
&emsp;receives a response, what will the Shared Disk end up containing in blocks 1 and 2? What is<br>
&emsp;the sequence of actions that leads to that outcome?


---

<a id="page-6"></a>
**Page 6**

6.824 Spring 2022, Exam 1   Page 6 of 13

**IV**   **Raft**

Refer to Ongaro and Ousterhout’s In Search of an Understandable Consensus Algorithm (Extended<br>
Version).

&emsp;**6.**   **\[7 points\]:** In the paper’s Figure 8, at time (b), S5’s last log entry has a term of 3. A<br>
&emsp;friend of yours suggests that the term in S5’s last log entry should instead be 2, since S5 got<br>
&emsp;votes only from S3 and S4 (and itself), and those servers all have 1 at the ends of their logs.<br>
&emsp;Explain what it is that forces S5 to be leader for term 3, and not term 2.

Suppose Figure 2’s RequestVote handling code were changed to omit lastLogIndex and lastLogTerm<br>
from the Arguments, and item 2 were changed to:

2\. If votedFor is candidateId,<br>
&emsp;or (votedFor is null and term \>= currentTerm),<br>
&emsp;grant vote.

&emsp;**7. \[7 points\]:** Explain why this change can cause two Raft peers to apply different entries<br>
&emsp;at the same index.


---

<a id="page-7"></a>
**Page 7**

6.824 Spring 2022, Exam 1   Page 7 of 13

Figure 13 describes a series of steps that the InstallSnapshot RPC handler must follow, including:

6\. If existing log entry has same index and term as snapshot’s last<br>
&emsp;included entry, retain log entries following it and reply

Recall that Raft’s safety guarantee is that if two servers commit an entry at a particular index, it<br>
must be the same entry.

&emsp;**8. \[7 points\]:** Consider what would happen if this step were omitted (i.e. we uncondition-<br>
&emsp;ally proceeded to step 7, discarding the entire log upon receiving an InstallSnapshot RPC).<br>
&emsp;Would this modified protocol violate Raft’s safety guarantees? If not, explain why not. If it<br>
&emsp;would, describe an execution of the protocol that results in an observable safety violation.


---

<a id="page-8"></a>
**Page 8**

6.824 Spring 2022, Exam 1   Page 8 of 13

Suppose that a correct Lab 2 implementation is running on a cluster of machines, and a cosmic ray<br>
flips some bits in the memory of the leader. This question asks about possible corruptions and how<br>
they affect Raft safety. Recall that Raft’s safety guarantee is that if two servers commit an entry at<br>
a particular index, it must be the same entry.

&emsp;**9.**   **\[7 points\]:** Consider the scenario where the cosmic ray flips bits in the ‘nextIndex\[\]‘<br>
&emsp;array, replacing some values with other arbitrary values. Assume that code handles out-of-<br>
&emsp;bounds values by clipping to the size of the log. Could an execution where this occurs result<br>
&emsp;in an observable safety violation? If not, explain why not. If it could, describe an execution<br>
&emsp;of the protocol that results in an observable safety violation.

&emsp;**10. \[7 points\]:** Now, consider a scenario where the cosmic ray flips bits in the ‘matchIn-<br>
&emsp;dex\[\]‘ array, replacing some values with other arbitrary values. Assume that the code handles<br>
&emsp;out-of-bounds values by clipping to the size of the log. Could an execution where this occurs<br>
&emsp;result in an observable safety violation? If not, explain why not. If it could, describe an<br>
&emsp;execution of the protocol that results in an observable safety violation.


---

<a id="page-9"></a>
**Page 9**

6.824 Spring 2022, Exam 1   Page 9 of 13

**V**   **ZooKeeper**

Ben Bitdiddle reads ZooKeeper: Wait-free coordination for Internet-scale systems by Hunt, Konar,<br>
Junqueira, and Reed, and decides to use ZooKeeper in a distributed system he’s building. Ben<br>
implements the paper’s Simple Locks (page 6) with the following code:

lock():<br>
1\. ok = create("/lock", EPHEMERAL)<br>
2\. if ok == true, return (lock is acquired)<br>
3\. if exists("/lock", watch=true) wait for watch event<br>
4\. goto 1

unlock():<br>
5\. delete("/lock", -1)

Client C1 calls lock(), which succeeds.<br>
Client C2 calls lock(), which blocks at line 3.<br>
Client C1 is running on Ben’s laptop. Ben puts his laptop to sleep; C1 stops executing and does not<br>
call unlock(). Ben goes off to eat lunch.<br>
Client C2 is still operating on a different computer, and can talk to the ZooKeeper service.

&emsp;**11. \[7 points\]:** C2 will be able to eventually aquire the lock even though C1 never unlocks<br>
&emsp;it. Explain how this happens.


---

<a id="page-10"></a>
**Page 10**

6.824 Spring 2022, Exam 1   Page 10 of 13

At this point C2 holds the lock.

&emsp;**12. \[7 points\]:** Suppose there is another client C3 that has called lock() and is waiting to<br>
&emsp;get the lock. Ben returns from lunch and opens up his laptop. C1 resumes execution, and<br>
&emsp;calls unlock(). C2 does not call unlock(). Will C3 now be able to acquire the lock? Explain<br>
&emsp;your answer.


---

<a id="page-11"></a>
**Page 11**

6.824 Spring 2022, Exam 1   Page 11 of 13

**VI**   **Chain Replication**

Zara Zoomer is storing a small amount of valuable data in a storage system that replicates data using<br>
the chain technique from Chain Replication for Supporting High Throughput and Availability by<br>
van Renesse and Schneider. Zara’s chain has five servers, as well as a replicated master that detects<br>
server failures and directs the recovery process. Each server sends a few heartbeat messages per<br>
second to the master, and the master declares a server dead if it doesn’t receive any heartbeats for<br>
ten seconds. The master has a large pool of idle servers it can use as replacements; after deciding a<br>
chain server is dead, it takes another second to re-configure the chain to eliminate the dead server,<br>
incorporate a new server (so that the chain length stays constant), and copy all the data to the new<br>
server. The master never itself suffers any failures.

&emsp;**13. \[7 points\]:** Zara’s system frequently imposes delays of up to eleven seconds on updates.<br>
&emsp;Zara feels this is not very fault-tolerant, and would like to reduce the frequency of these<br>
&emsp;delays. Should she increase the chain length from five to six? Or decrease it to four? Explain.


---

<a id="page-12"></a>
**Page 12**

6.824 Spring 2022, Exam 1   Page 12 of 13

Zara is upset at how much it costs to pay for the servers implementing the master service. She<br>
reasons that she could eliminate the master altogether, and use the following scheme instead. All<br>
the servers in a chain send the other servers periodic heartbeat messages. If the head is alive, it will<br>
monitor the heartbeats and tell the other servers how to re-configure if one dies. If the other servers<br>
stop getting heartbeats from the head, they will consider the second server to be in charge of the<br>
configuration, and so on.

&emsp;**14. \[7 points\]:** Explain what is wrong with Zara’s plan, and outline an example situation in<br>
&emsp;which it will yield incorrect (non-linearizable) results to clients.


---

<a id="page-13"></a>
**Page 13**

6.824 Spring 2022, Exam 1   Page 13 of 13

**VII**   **6.824**

&emsp;**15. \[0.66 points\]:** Which lectures/papers should we definitely keep for future years?<br>
&emsp;&emsp;**–** MapReduce<br>
&emsp;&emsp;**–** RPC, Threads, and Go<br>
&emsp;&emsp;**–** GFS<br>
&emsp;&emsp;**–** VMware FT<br>
&emsp;&emsp;**–** Raft<br>
&emsp;&emsp;**–** Debugging<br>
&emsp;&emsp;**–** Q+A on Lab 2A/2B<br>
&emsp;&emsp;**–** ZooKeeper<br>
&emsp;&emsp;**–** Chain Replication<br>
&emsp;&emsp;**–** Distributed Transactions

&emsp;**16. \[0.66 points\]:** Which lectures/papers should we omit?<br>
&emsp;&emsp;**–** MapReduce<br>
&emsp;&emsp;**–** RPC, Threads, and Go<br>
&emsp;&emsp;**–** GFS<br>
&emsp;&emsp;**–** VMware FT<br>
&emsp;&emsp;**–** Raft<br>
&emsp;&emsp;**–** Debugging<br>
&emsp;&emsp;**–** Q+A on Lab 2A/2B<br>
&emsp;&emsp;**–** ZooKeeper<br>
&emsp;&emsp;**–** Chain Replication<br>
&emsp;&emsp;**–** Distributed Transactions

&emsp;**17. \[0.66 points\]:** What can we do to improve the course?

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;End of Exam I

