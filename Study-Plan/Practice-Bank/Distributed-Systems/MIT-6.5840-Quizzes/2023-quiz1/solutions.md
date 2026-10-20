# MIT 6.824/6.5840 2023: Quiz 1: Official solutions

> Copied from the original: <https://pdos.csail.mit.edu/6.824/quizzes.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**


![Figure on page 1](figures/solutions-p01-fig01.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Department of Electrical Engineering and Computer Science<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;MASSACHUSETTS INSTITUTE OF TECHNOLOGY

&emsp;&emsp;&emsp;**6.5840 Distributed System Engineering: Spring 2023**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Exam I**

Write your name on this cover sheet. If you tear out any sheets, please write your name on them.<br>
You have 80 minutes to complete this quiz.<br>
Some questions may be much harder than others. Read them all through first and attack them in<br>
the order that allows you to make the most progress. If you find a question ambiguous, write down<br>
any assumptions you make. Write neatly. In order to receive full credit you must answer each<br>
question as precisely as possible.<br>
You may use class notes, papers, and lab material. You may read them on your laptop, but you<br>
are not allowed to use any network. For example, you may not look at web sites, use ChatGPT, or<br>
communicate with anyone.

&emsp;**I (5)**   **II (10)**   **III (5)**   **IV (10)**   **V (5)**   **VI (10)**   **VII (12)**   **VIII (3)**   **Total (60)**

**Name:**<br>
**Gradescope E-Mail Address:**


---

<a id="page-2"></a>
**Page 2**

Grade histogram for Exam 1

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;max   =   60<br>
&emsp;&emsp;&emsp;&emsp;&emsp;median   =   51<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;µ   =   50.35<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;σ   =   5.86


---

<a id="page-3"></a>
**Page 3**

6.5840 Spring 2023, Exam 1   Page 3 of 12

**I**   **MapReduce**

You have a small MapReduce computation whose Map phase produces the following six interme-<br>
diate key/value data items:

a/1<br>
c/2<br>
b/3<br>
c/4<br>
b/5<br>
b/6

R (the number of reduce tasks) is two, and the two reduce tasks are numbered zero and one. There<br>
are two single-core worker machines available to run reduces. It takes a worker machine one<br>
second to process each intermediate key/value pair, so if there were just one worker the Reduce<br>
phase would last six seconds.<br>
Section 3.1 of Dean and Ghemawat’s MapReduce paper discusses hashing the keys of intermediate<br>
data. The hash function takes an intermediate key as argument, and returns a number. Your job is<br>
to pick the hash function that will cause the reduce phase to take the shortest amount of wall-clock<br>
time for the above intermediate data. You do not have to worry about the behavior of the hash<br>
function in other situations. Circle the best answer.

&emsp;**1. \[5 points\]:**

&emsp;&emsp;**A.** a →0, b →0, c→0<br>
&emsp;&emsp;**B.** a →0, b →0, c→1<br>
&emsp;&emsp;**C.** a →0, b →1, c→0<br>
&emsp;&emsp;**D.** a →0, b →1, c→1<br>
&emsp;&emsp;**E.** All of the above choices result in the same amount of time.

**Answer:** Choice **C** (a →0, b →1, c→0). The hash function determines which of the two worker<br>
machines executes the reduce function for each key. With choice **C**, both workers process three<br>
intermediate items, so the reduce phase finishes in three seconds. With the other choices, one of<br>
the workers processes four or more items, so the reduce phase would take four or more seconds.


---

<a id="page-4"></a>
**Page 4**

6.5840 Spring 2023, Exam 1   Page 4 of 12

**II**   **GFS**

Consider the paper The Google File System by Ghemawat et al.

&emsp;**2. \[5 points\]:** Explain briefly how GFS ensures that there is at most one active primary for<br>
&emsp;a given chunk.

**Answer:** The master hands out a lease to a new primary only after the current lease has expired.

A GFS file starts out containing the single byte “a”. The file’s single chunk is replicated on three<br>
chunkservers. Client C1 opens the file and issues a write with offset zero and data “b” (i.e. C1 asks<br>
to replace the file’s content with “b”), and waits for the reply from GFS. After seeing the reply to<br>
the first write, C1 issues a write with offset zero and data “c”, and waits for the reply. At about the<br>
same time, client C2 runs three iterations of a loop that opens the file and reads it; C2 waits for the<br>
reply to each operation before starting the next. GFS replies with success to every one of C1’s and<br>
C2’s requests. There are no other client requests.

&emsp;**3. \[5 points\]:** What sequences of read results could C2 see? Circle either YES or NO for<br>
&emsp;each sequence below.

&emsp;&emsp;**A.** Sequence: a, a, a   YES   NO<br>
&emsp;&emsp;**B.** Sequence: a, b, a   YES   NO<br>
&emsp;&emsp;**C.** Sequence: a, c, a   YES   NO<br>
&emsp;&emsp;**D.** Sequence: c, b, a   YES   NO<br>
&emsp;&emsp;**E.** Sequence: c, b, b   YES   NO

**Answer:**   Sequences A, B, E are YES; the others are NO. Sequence A can occur if the primary<br>
executes all three of C2’s reads before C1’s first write. Sequence B can occur if the primary has<br>
applied C1’s first write to its own copy but before the primary has forwarded the write to the<br>
backups; then C2 sends its first read to a backup and gets “a”, sends its second read to the primary<br>
and gets “b”, and sends its third read to a backup and gets “a”. Sequence C cannot occur: if any<br>
replica has seen the write of “c”, that means the write of “b” has finished (and was successful,<br>
which means all replicas executed it), so no replica could still contain “a”. Sequence D cannot<br>
occur for the same reason. Sequence E can occur if the primary has applied C1’s second write to<br>
its own copy but before the primary has forwarded the write to the backups; then C2 sends its first<br>
read to the primary and gets “c”, sends its second read to a backup and gets “b”, and sends its third<br>
read to a backup and gets “b”.


---

<a id="page-5"></a>
**Page 5**

6.5840 Spring 2023, Exam 1   Page 5 of 12

**III**   **VMware FT**

The Design of a Practical System for Fault-Tolerant Virtual Machines, by Scales et al., says in<br>
Section 2.2 and Figure 2 that the Output Rule must be enforced for network packets sent to clients.<br>
Consider the following scenario with a primary, backup, one client, and an output instruction i<br>
telling the primary’s network card to send a TCP packet to the client. FT delays sending this packet<br>
until it receives an acknowledgment from the backup for i. The primary crashes either before or<br>
after receiving the backup’s acknowledgment and thus either sends or does not send the delayed<br>
packet. When the backup takes over it will first replay its log, which includes an entry for i. In<br>
replay mode the backup will not generate output, including for instruction i. Then, after replaying<br>
the log, the backup becomes the new primary.

&emsp;**4.**   **\[5 points\]:** Even though FT doesn’t send the TCP packet for i in replay mode, it is<br>
&emsp;possible for a client to receive the TCP packet twice. Explain how.

**Answer:** The network may drop the TCP acknowledgment from the client, which will cause the<br>
TCP software on the new primary to timeout and resend the TCP packet. The client has received<br>
the packet now twice: once from the old primary and once from the new primary.


---

<a id="page-6"></a>
**Page 6**

6.5840 Spring 2023, Exam 1   Page 6 of 12

**IV**   **Raft**

Refer to Ongaro and Ousterhout’s In Search of an Understandable Consensus Algorithm (Extended<br>
Version).<br>
Consider the following optimization for Raft: instead of calling persist() whenever the log<br>
changes in the AppendEntries RPC handler, the implementation calls persist() in a back-<br>
ground thread every 100ms to reduce the persistence overhead.

&emsp;**5. \[5 points\]:** Describe a sequence of events that would lead to the implementation com-<br>
&emsp;mitting two different entries at the same index.

**Answer:** Consider a three-node cluster.<br>
**1.** Server 1 as a leader sends AppendEntries RPC containing an entry X to Server 2 and 3.<br>
**2.** A network issue drops the RPC message to Server 3.<br>
**3.** Server 2 receives X from Server 1, appends X to its log, and replies positively.<br>
**4.** On receiving the reply from Server 2, Server 1 commits the entry by counting replicas.<br>
**5.** A network issue puts Server 1 on its own partition.<br>
**6.** Server 2 crashes before writing X to the stable storage.<br>
**7.** Server 2 recovers and together with Server 3 they elect Server 3 as a leader in a new term.<br>
**8.** Following the successful path of AppendEntires RPC, Server 2 and 3 commits entry Y at the<br>
&emsp;same index as X.

Alyssa hears about a new cool technology: persistent memory (e.g., Intel Optane). Persistent<br>
memory behaves like a DRAM memory but is nonvolatile: it retains its content in the event of a<br>
crash—that is, if a server reboots, the content of persistent memory contains the values from before<br>
the crash. Alyssa equips each server in the Raft cluster with persistent memory.

&emsp;**6. \[5 points\]:** Alyssa stores all the variables listed in Figure 2 in a Raft struct. Alyssa<br>
&emsp;modifies her Raft library to store this Raft struct in persistent memory at a well-known<br>
&emsp;address. She removes the persistor and the calls to it. When a server reboots, it sets the Raft<br>
&emsp;struct pointer to the well-known address, and initializes the volatile state to 0.<br>
&emsp;Alyssa notices that this implementation can result in incorrect behavior. Explain why.

**Answer:** Updates to persistent state aren’t atomic: On a RequestVote RPC, for example, the code<br>
may update currentTerm, crash before updating votedFor, reboot, and now incorrectly vote for<br>
a new leader in that term.


---

<a id="page-7"></a>
**Page 7**

6.5840 Spring 2023, Exam 1   Page 7 of 12

**V**   **Raft and ZooKeeper**

Refer to Ongaro and Ousterhout’s In Search of an Understandable Consensus Algorithm (Extended<br>
Version) and ZooKeeper: Wait-free coordination for Internet-scale systems by Hunt, Konar, Jun-<br>
queira, and Reed.<br>
Ben wants to simplify his Raft implementation, so he decides to use ZooKeeper for leader election<br>
instead of implementing it in Raft. He removes the RequestVote RPC and the votedFor state<br>
from his implementation. In his new version of Raft, when a server wants to become leader in<br>
term newTerm, instead of becoming a Candidate and sending RequestVoteRPCs, the server<br>
attempts to create() a regular znode with path /raftLeader/{newTerm} in ZooKeeper. If<br>
the create fails (which happens when the znode already exists), the Raft server does not become<br>
leader. Otherwise, if the create succeeds, the Raft server becomes leader in newTerm. The rest<br>
of the Raft implementation (e.g. what happens after a server becomes a leader) is unchanged from<br>
Ben’s initially correct version of Raft.

&emsp;**7. \[5 points\]:** Explain how this modification to Raft can result in incorrect behavior.

**Answer:**   The problem with removing the RequestVote RPC is that nothing else in Raft en-<br>
forces the election restriction. In this modified version, a leader could be elected that is not as up<br>
to date as its followers.<br>
Here’s an example execution with 3 servers A, B, C. Initially, C is partitioned away from A and<br>
B. Server A becomes leader in term 1 by creating the znode and then commits operation \[opx\]<br>
at index 1 by replicating it to server B. Then, server C is reconnected to A and B. It becomes a<br>
leader in term 2 by creating the znode /raftLeader/2. Now that it is leader, C puts a different<br>
client operation \[opy\] at index 1 in its log. C overwrites A and B’s log (because its entry is in a<br>
higher term) to eventually commit opy at index 1. This is inconsistent with opx being committed<br>
at index 1 by server A.


---

<a id="page-8"></a>
**Page 8**

6.5840 Spring 2023, Exam 1   Page 8 of 12

**VI**   **Linearizability**

These questions concern the material from Lecture 9, Consistency and Linearizability.<br>
A service’s state consists of just one value, a string. There are two operations: append to the string,<br>
and read the entire string. In history diagrams,

\|--Axyz--\|

means a client issued a request to append “xyz” to the string, and

\|--Rabxyz--\|

means a client issued a read, and the response was “abxyz”.

&emsp;**8. \[4 points\]:** The service’s string starts out empty. The only requests are those shown in<br>
&emsp;the following history. Is this history linearizable?

&emsp;\|----Ax----\| \|----Ab----\|<br>
&emsp;&emsp;&emsp;&emsp;&emsp;\|---Ay---\|<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\|---Ryxb---\|

**Answer:** Yes. The numbers below mark linearization points that are consistent with the results:

\|----Ax---2\| \|-3---Ab----\|<br>
&emsp;&emsp;&emsp;\|-1--Ay---\|<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\|-4--Ryxb---\|

&emsp;**9. \[4 points\]:** Again, the service’s string starts out empty, and there are no other requests<br>
&emsp;other than the ones shown in the following history. Which choices of XXX result in a lin-<br>
&emsp;earizable history? For each possibility, circle either YES or NO.

&emsp;&emsp;\|------Axy------\|<br>
&emsp;\|----Aab----\| \|----Aq----\|<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\|----RXXX----\|

&emsp;&emsp;**A.**   xyab   YES   NO<br>
&emsp;&emsp;**B.**   axbqy   YES   NO<br>
&emsp;&emsp;**C.**   abq   YES   NO<br>
&emsp;&emsp;**D.**   xyq   YES   NO<br>
**Answer: A** and **C** are YES, **B** and **D** are NO. **A** is possible if the serial order is Axy, Aab, Rxyab,<br>
Aq. **B** is not possible because any serial order of the operations must execute them one at a time, so<br>
while abxy and xyab are possible, axby (for example) is not. **C** corresponds to the serial order<br>
Aab, Aq, Rabq, Axy. **D** is not possible because Aab finishes before Aq starts, and thus Aab must<br>
occur before Aq in any legal serial order, but xyq does not have ab before the q.


---

<a id="page-9"></a>
**Page 9**

6.5840 Spring 2023, Exam 1   Page 9 of 12

**VII**   **ZooKeeper**

Refer to ZooKeeper: Wait-free coordination for Internet-scale systems by Hunt, Konar, Junqueira,<br>
and Reed.<br>
Alyssa has a ZooKeeper installation with three ZooKeeper replica servers (a leader and two fol-<br>
lowers). Alyssa runs the following two programs, M3 and M4, each on a separate client machine,<br>
starting them at about the same time.

M3:<br>
create("/m3", "c3po")<br>
if exists("/m4") == NO:<br>
&emsp;print "three"<br>
print "done"

M4:<br>
create("/m4", "r2d2")<br>
if exists("/m3") == NO:<br>
&emsp;print "four"<br>
print "done"

The create() and exists() calls invoke the ZooKeeper client library. The znodes involved,<br>
/m3 and /m4, start out not existing, and both create() calls succeed. The create() calls ask<br>
for normal znodes, not ephemeral. exists() has one of three results: it returns YES if the znode<br>
exists, NO if the znode does not exist, and it causes the program to immediately exit if there was<br>
an error (e.g., if ZooKeeper says it has terminated the session). The requests are all synchronous.<br>
There are no other client requests.

&emsp;**10. \[3 points\]:** Can Alyssa see both M3 print “three” and M4 print “four”?

**Answer:**   No. The ZooKeeper leader orders the two create()s in one order or the other, and all<br>
followers see them in that order. If M3 prints ”three”, then create(m3) must have been ordered first.<br>
That means all followers will see create(m3) and then create(m4). M4’s follower won’t process<br>
M4’s exists(m3) until after it has seen the ZooKeeper leader send M4’s preceding create(m4) (by<br>
the FIFO client ordering rule), and thus after it has seen M3’s create(m3), so M4’s exists will return<br>
YES, and it won’t print “four”.


---

<a id="page-10"></a>
**Page 10**

6.5840 Spring 2023, Exam 1   Page 10 of 12

&emsp;**11. \[3 points\]:** Is it possible for both programs to print just “done” alone?

**Answer:**   Yes. If ZooKeeper completely processes both create()s before either client sends its<br>
exists(), then both exists() will return YES, so neither “three” nor “four” will be printed.

Alyssa is experimenting with coordinator election using ZooKeeper. When she starts, no znodes<br>
exist on her ZooKeeper service (other than the root). Alyssa starts both these programs at about the<br>
same time on two different client machines:<br>
Machine M1 executes the following code in single session:

if create("/coordinator", ephemeral=true):<br>
&emsp;print "M1 won"<br>
&emsp;create("/m1", "xyzzy")<br>
&emsp;if exists("/m2") == YES:<br>
&emsp;&emsp;print "M1 sees M2"<br>
&emsp;while true:<br>
&emsp;&emsp;act as coordinator...<br>
else:<br>
&emsp;exit

Machine M2 executes the following code in a single session:

if create("/coordinator", ephemeral=true):<br>
&emsp;print "M2 won"<br>
&emsp;create("/m2", "xyzzy")<br>
&emsp;if exists("/m1") == YES:<br>
&emsp;&emsp;print "M2 sees M1"<br>
&emsp;while true:<br>
&emsp;&emsp;act as coordinator...<br>
else:<br>
&emsp;exit

There is no client activity other than these two programs.


---

<a id="page-11"></a>
**Page 11**

6.5840 Spring 2023, Exam 1   Page 11 of 12

&emsp;**12. \[3 points\]:** Could Alyssa see both “M1 won” and “M2 won”?

**Answer:** Yes. M1 could win the race to create /coordinator, print “M1 won”, and then fail, causing<br>
ZooKeeper to delete the ephemeral /coordinator. Then M2 could create /coordinator and print “M2<br>
won”.

&emsp;**13. \[3 points\]:** Could Alyssa see both “M1 sees M2” and “M2 sees M1”?

**Answer:**   No. Suppose M1 prints “M1 sees M2”. This can only happen if M2 had successfully<br>
created /coordinator first and then created /m2, but then ZooKeeper had terminated its session and<br>
deleted the ephemeral /coordinator, allowing M1 to successfully create it. If ZooKeeper terminated<br>
M2’s session before ZooKeeper executed M2’s exists(/m1), then M2 could not have seen exists()<br>
return YES, and could not have printed “M2 sees M1”. If ZooKeeper terminated M2’s session<br>
after ZooKeeper executed M2’s exists(/m1), then (since M1 at that point had not yet even created<br>
/coordinator) M2’s exists(/m1) must have returned NO, so M2 could not have printed “M2 sees<br>
M1”. Thus, if M1 prints “M1 sees M2”, M2 cannot print “M2 sees M1”.


---

<a id="page-12"></a>
**Page 12**

6.5840 Spring 2023, Exam 1   Page 12 of 12

**VIII**   **6.5840**

&emsp;**14. \[1 points\]:** Which lectures/papers should we definitely keep for future years?<br>
&emsp;&emsp;**–** MapReduce<br>
&emsp;&emsp;**–** RPC, Threads, and Go<br>
&emsp;&emsp;**–** GFS<br>
&emsp;&emsp;**–** VMware FT<br>
&emsp;&emsp;**–** Raft<br>
&emsp;&emsp;**–** Q+A on Lab 2A/2B<br>
&emsp;&emsp;**–** Linearizability testing<br>
&emsp;&emsp;**–** ZooKeeper<br>
&emsp;&emsp;**–** Chain Replication

**Answer:** Keep Raft, MapReduce, and GFS.<br>
&emsp;**15. \[1 points\]:** Which lectures/papers should we omit?<br>
&emsp;&emsp;**–** MapReduce<br>
&emsp;&emsp;**–** RPC, Threads, and Go<br>
&emsp;&emsp;**–** GFS<br>
&emsp;&emsp;**–** VMware FT<br>
&emsp;&emsp;**–** Raft<br>
&emsp;&emsp;**–** Q+A on Lab 2A/2B<br>
&emsp;&emsp;**–** Linearizability testing<br>
&emsp;&emsp;**–** ZooKeeper<br>
&emsp;&emsp;**–** Chain Replication

**Answer:** Get rid of Chain Replication.<br>
&emsp;**16. \[1 points\]:** What can we do to improve the course?

**Answer:** Better debugging tools for the labs.


---

<a id="page-13"></a>
**Page 13**

6.5840 Spring 2023, Exam 1   Page 13 of 12<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;End of Exam I

