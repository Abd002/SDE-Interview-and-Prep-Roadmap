# MIT 6.824/6.5840 2023: Quiz 1: Questions

> Copied from the original: <https://pdos.csail.mit.edu/6.824/quizzes.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**


![Figure on page 1](figures/questions-p01-fig01.png)

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

6.5840 Spring 2023, Exam 1   Page 2 of 11

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


---

<a id="page-3"></a>
**Page 3**

6.5840 Spring 2023, Exam 1   Page 3 of 11

**II**   **GFS**

Consider the paper The Google File System by Ghemawat et al.

&emsp;**2. \[5 points\]:** Explain briefly how GFS ensures that there is at most one active primary for<br>
&emsp;a given chunk.

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


---

<a id="page-4"></a>
**Page 4**

6.5840 Spring 2023, Exam 1   Page 4 of 11

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


---

<a id="page-5"></a>
**Page 5**

6.5840 Spring 2023, Exam 1   Page 5 of 11

**IV**   **Raft**

Refer to Ongaro and Ousterhout’s In Search of an Understandable Consensus Algorithm (Extended<br>
Version).<br>
Consider the following optimization for Raft: instead of calling persist() whenever the log<br>
changes in the AppendEntries RPC handler, the implementation calls persist() in a back-<br>
ground thread every 100ms to reduce the persistence overhead.

&emsp;**5. \[5 points\]:** Describe a sequence of events that would lead to the implementation com-<br>
&emsp;mitting two different entries at the same index.

Alyssa hears about a new cool technology: persistent memory (e.g., Intel Optane). Persistent<br>
memory behaves like a DRAM memory but is nonvolatile: it retains its content in the event of a<br>
crash—that is, if a server reboots, the content of persistent memory contains the values from before<br>
the crash. Alyssa equips each server in the Raft cluster with persistent memory.

&emsp;**6. \[5 points\]:** Alyssa stores all the variables listed in Figure 2 in a Raft struct. Alyssa<br>
&emsp;modifies her Raft library to store this Raft struct in persistent memory at a well-known<br>
&emsp;address. She removes the persistor and the calls to it. When a server reboots, it sets the Raft<br>
&emsp;struct pointer to the well-known address, and initializes the volatile state to 0.<br>
&emsp;Alyssa notices that this implementation can result in incorrect behavior. Explain why.


---

<a id="page-6"></a>
**Page 6**

6.5840 Spring 2023, Exam 1   Page 6 of 11

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


---

<a id="page-7"></a>
**Page 7**

6.5840 Spring 2023, Exam 1   Page 7 of 11

**VI**   **Linearizability**

These questions concern the material from Lecture 9, Consistency and Linearizability.<br>
A service’s state consists of just one value, a string. There are two operations: append to the string,<br>
and read the entire string. In history diagrams,

\|--Axyz--\|

means a client issued a request to append “xyz” to the string, and

\|--Rabxyz--\|

means a client issued a read, and the response was “abxyz”.

&emsp;**8. \[4 points\]:** The service’s string starts out empty. The only requests are those shown in<br>
&emsp;the following history. Is this history linearizable?<br>
&emsp;\|----Ax----\| \|----Ab----\|<br>
&emsp;&emsp;&emsp;&emsp;&emsp;\|---Ay---\|<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\|---Ryxb---\|

&emsp;**9. \[4 points\]:** Again, the service’s string starts out empty, and there are no other requests<br>
&emsp;other than the ones shown in the following history. Which choices of XXX result in a lin-<br>
&emsp;earizable history? For each possibility, circle either YES or NO.<br>
&emsp;&emsp;\|------Axy------\|<br>
&emsp;\|----Aab----\| \|----Aq----\|<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\|----RXXX----\|

&emsp;&emsp;**A.**   xyab   YES   NO<br>
&emsp;&emsp;**B.**   axbqy   YES   NO<br>
&emsp;&emsp;**C.**   abq   YES   NO<br>
&emsp;&emsp;**D.**   xyq   YES   NO


---

<a id="page-8"></a>
**Page 8**

6.5840 Spring 2023, Exam 1   Page 8 of 11

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


---

<a id="page-9"></a>
**Page 9**

6.5840 Spring 2023, Exam 1   Page 9 of 11

&emsp;**11. \[3 points\]:** Is it possible for both programs to print just “done” alone?

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

<a id="page-10"></a>
**Page 10**

6.5840 Spring 2023, Exam 1   Page 10 of 11

&emsp;**12. \[3 points\]:** Could Alyssa see both “M1 won” and “M2 won”?

&emsp;**13. \[3 points\]:** Could Alyssa see both “M1 sees M2” and “M2 sees M1”?


---

<a id="page-11"></a>
**Page 11**

6.5840 Spring 2023, Exam 1   Page 11 of 11

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

&emsp;**16. \[1 points\]:** What can we do to improve the course?

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;End of Exam I

