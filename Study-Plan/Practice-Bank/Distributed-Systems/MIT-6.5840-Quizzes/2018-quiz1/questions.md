# MIT 6.824/6.5840 2018: Quiz 1: Questions

> Copied from the original: <https://pdos.csail.mit.edu/6.824/quizzes.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**


![Figure on page 1](figures/questions-p01-fig01.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Department of Electrical Engineering and Computer Science<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;MASSACHUSETTS INSTITUTE OF TECHNOLOGY

&emsp;&emsp;&emsp;&emsp;**6.824 Distributed System Engineering: Spring 2018**<br>
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

&emsp;**I (16)**   **II (16)**   **III (16)**   **IV (14)**   **V (7)**   **VI (14)**   **VII (14)**   **VIII (3)**   **Total (100)**

**Name:**<br>
**Kerberos ID:**


---

<a id="page-2"></a>
**Page 2**

6.824 Spring 2018, Exam 1   Page 2 of 16

**I**   **GFS**

Ben Bitdiddle notices that GFS (as described by Ghemawat et al.) replicates written data on **all**<br>
chunk servers holding replicas of the affected chunk. Inspired by Raft, Ben suggests reducing write<br>
latency by returning after the write has been replicated to a **majority** of replicas. Specifically, Ben<br>
suggests modifying the write flow in Figure 2 (§3.1) as follows:

**Step 1–3.** As before, with chain replication as per §3.2.<br>
**Step 4.** Once a majority of replicas has acknowledged receiving the data, the client sends a write<br>
&emsp;request to the primary. \[...\]<br>
**Step 5.** The primary forwards the write request to all secondary replicas. Each secondary replica<br>
&emsp;that has already received the data applies the mutations \[...\]; any replica that has not yet<br>
&emsp;received the data enqueues the write request (in volatile memory) and applies it as soon as<br>
&emsp;the data arrives.<br>
**Step 6.** The secondaries reply to the primary as soon as they have completed the operation.<br>
**Step 7.** The primary replies to the client once it receives an acknowledgment of success in step 6<br>
&emsp;from a majority of replicas. \[...\] The remaining replicas keep working to finish replicating<br>
&emsp;the write, retrying indefinitely on failure.

However, Ben’s classmate Alyssa P. Hacker points out that there might be a problem if a replica<br>
fails and restarts after the write has returned to the client in step 7, but before the chain replicated<br>
data reaches it. Ben believes that GFS’s stale replica detection (see §4.5) handles this situation<br>
correctly.

&emsp;**1. \[8 points\]:** Who is right? Explain your answer.


---

<a id="page-3"></a>
**Page 3**

6.824 Spring 2018, Exam 1   Page 3 of 16

Consider a Raft deployment (without snapshotting) in which each peer stores its persistent Raft<br>
state (the log, the current term, etc.) in GFS files. Each peer has its own set of files, including a file<br>
that stores the peer’s current log. Each Raft peer writes new log entries at the end of its existing log<br>
file. This question refers to GFS as described in the paper, not Ben’s modified GFS.

&emsp;**2.**   **\[8 points\]:** Is it necessary to use GFS’s “record append” mode when appending new<br>
&emsp;entries to the log file? Explain your answer.


---

<a id="page-4"></a>
**Page 4**

6.824 Spring 2018, Exam 1   Page 4 of 16

**II**   **VMware FT**

Consider the paper The Design of a Practical System for Fault-Tolerant Virtual Machines, by Scales<br>
et al.<br>
Suppose you are running MapReduce on a cluster of 100 computers. MapReduce has a mechanism<br>
to recover from failed workers. You could, in theory, replace MapReduce’s mechanism with use of<br>
VMware FT to replicate each worker.

&emsp;**3.**   **\[8**   **points\]:** Which makes more sense for coping with MapReduce worker failure,<br>
&emsp;MapReduce’s existing mechanism, or VMware FT? Explain why.


---

<a id="page-5"></a>
**Page 5**

6.824 Spring 2018, Exam 1   Page 5 of 16

The VMware FT paper says that the primary sends a copy of each received packet to the backup.<br>
Alyssa P. Hacker points out that one can configure network switches to send a copy of each packet<br>
addressed to the primary to the backup as well. Then, since the network is taking care of sending<br>
the backup a copy of the primary’s network traffic, the primary could be modified to no longer do<br>
so. Of course, one would configure the network switch to not make copies of the primary/backup<br>
“logging channel” traffic.

&emsp;**4.**   **\[8 points\]:** Explain why it’s critical that the primary send information about received<br>
&emsp;packets to the backup; that is, why it’s not sufficient for the network to send a copy of all the<br>
&emsp;primary’s packets to the backup.


---

<a id="page-6"></a>
**Page 6**

6.824 Spring 2018, Exam 1   Page 6 of 16

**III**   **Raft and Lab 2**

Ben Bitdiddle decides that, when the last log term of a Raft candidate and a follower are equal, it is<br>
safer if the follower only votes for the candidate if the candidate’s log is longer than the follower’s<br>
own, rather than if it is at least as long.<br>
He therefore modifies his RequestVote RPC handler to respond with voteGranted set to<br>
true only if either (a) the candidate has a higher last log entry term, or (b) the last log entry’s term<br>
is equal to the follower’s and the candidate has a longer log.

&emsp;**5. \[8 points\]:** Explain why Ben’s modification will break Raft.


---

<a id="page-7"></a>
**Page 7**

6.824 Spring 2018, Exam 1   Page 7 of 16

Alyssa P. Hacker’s Lab 2 Raft implementation has a long-running thread that runs periodic tasks:

&emsp;func (rf \*Raft) mainThread() {<br>
&emsp;&emsp;&emsp;for {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;rf.mu.Lock()<br>
&emsp;&emsp;&emsp;&emsp;&emsp;state := rf.state<br>
&emsp;&emsp;&emsp;&emsp;&emsp;rf.mu.Unlock()

&emsp;&emsp;&emsp;&emsp;&emsp;if state == Leader {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;if a heartbeat is needed {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;rf.sendAll()<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;}<br>
&emsp;&emsp;&emsp;&emsp;&emsp;} else if state == Follower {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;...<br>
&emsp;&emsp;&emsp;&emsp;&emsp;} else {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;...<br>
&emsp;&emsp;&emsp;&emsp;&emsp;}<br>
&emsp;&emsp;&emsp;&emsp;&emsp;// pause...<br>
&emsp;&emsp;&emsp;}<br>
&emsp;}

&emsp;func (rf \*Raft) sendAll() {<br>
&emsp;&emsp;&emsp;rf.mu.Lock()<br>
&emsp;&emsp;&emsp;defer rf.mu.Unlock()

&emsp;&emsp;&emsp;for i := 0; i \< len(rf.peers); i++ {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;if i == rf.me {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;continue<br>
&emsp;&emsp;&emsp;&emsp;&emsp;}<br>
&emsp;&emsp;&emsp;&emsp;&emsp;var args AppendEntriesArgs<br>
&emsp;&emsp;&emsp;&emsp;&emsp;args.Term = rf.currentTerm<br>
&emsp;&emsp;&emsp;&emsp;&emsp;// ...<br>
&emsp;&emsp;&emsp;&emsp;&emsp;go func(i int) {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;var reply AppendEntriesReply<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;ok := rf.sendAppendEntries(i, &args, &reply)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;rf.mu.Lock()<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;// handle the response...<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;rf.mu.Unlock()<br>
&emsp;&emsp;&emsp;&emsp;&emsp;}(i)<br>
&emsp;&emsp;&emsp;}<br>
&emsp;}


---

<a id="page-8"></a>
**Page 8**

6.824 Spring 2018, Exam 1   Page 8 of 16

Assume that code that is not shown is correct.

&emsp;**6. \[8 points\]:** Alyssa’s code has a bug. Describe a sequence of events that demonstrates a<br>
&emsp;violation of Figure 3’s State Machine Safety property, caused by the code above.


---

<a id="page-9"></a>
**Page 9**

6.824 Spring 2018, Exam 1   Page 9 of 16

**IV**   **ZooKeeper**

Ben Bitdiddle uses ZooKeeper (as described by Hunt et al.) to implement master failover for his<br>
distributed application. Each application instance acts as a ZooKeeper client, and each instance is<br>
willing to take over as master if there is no live master.<br>
Ben first manually creates a regular znode /app/master. The value of this znode is either<br>
“none” (if there is no master) or the ID of the application instance that is the current master.<br>
Each application instance does the following in order to learn who the master is, and perhaps to<br>
take over as master if needed:

**A.** Run getData("/app/master", watch) to find out who (if anyone) is the current<br>
&emsp;master, where watch is a notification handler.<br>
**B.** If the read returns an instance ID IM, and IM is not the current instance, the instance becomes<br>
&emsp;a backup with IM as master.<br>
**C.** If the result is “none”, the instance uses setData("/app/master", \<instance<br>
&emsp;ID\>, -1) to write its instance ID into the znode. If the write returns successfully, the<br>
&emsp;instance becomes the master; otherwise it starts again at step A.<br>
**D.** When watch triggers, it causes the instance to go to step A in order to try to become master.

&emsp;**7. \[7 points\]:** When testing his implementation, Ben notices that his system never chooses<br>
&emsp;a new master after the existing master fails, no matter how long he waits. Explain why.


---

<a id="page-10"></a>
**Page 10**

6.824 Spring 2018, Exam 1   Page 10 of 16

&emsp;**8. \[7 points\]:** Furthermore, Ben discovers that he sometimes ends up with several masters<br>
&emsp;(i.e., split brain). Explain why.


---

<a id="page-11"></a>
**Page 11**

6.824 Spring 2018, Exam 1   Page 11 of 16

**V**   **Linearizability**

Alyssa P. Hacker is writing an application that stores data in a key/value server. She uses a client-<br>
side library that provides get() and put() functions using RPC calls to the server. The library<br>
and key/value server together guarantee linearizable behavior at the level of library calls (that is,<br>
the operations that are linearizable are put() and get() function calls as executed by the appli-<br>
cation).<br>
Alyssa decides that, since put() does not return a value, there is no point in waiting for it to<br>
complete. She modifies the library so that put() returns immediately after starting a separate<br>
goroutine to send the request to the server.<br>
For this question you should assume that there are no computer crashes and no network problems.

&emsp;**9. \[7 points\]:** Will Alyssa’s modified library result in linearizable behavior? Explain why<br>
&emsp;or why not.


---

<a id="page-12"></a>
**Page 12**

6.824 Spring 2018, Exam 1   Page 12 of 16

**VI**   **Serializability**

Recall that correctness for transactions means that the results of executing a set of (possibly con-<br>
current) transactions must be serializable. The results are serializable if they are the same results<br>
one would obtain by executing the same set of transactions one at a time in some order. “Results”<br>
include both the final values of records in the database and the output (including printed output) of<br>
the transactions.<br>
A read-only transaction is one that only reads records from the database, and does not write any<br>
records.<br>
Ben Bitdiddle claims that read-only transactions do not need to use locks at all; they can just read<br>
the current values of records without worrying about whether other transactions might be writing<br>
them. As evidence, he provides this pair of transactions:

T1:   T2:<br>
begin\_transaction()   begin\_transaction()<br>
x = x + 1   print x, y, z<br>
end\_transaction()   end\_transaction()

Ben notes that it is correct for T2 to print either x’s value before T1’s increment of x, or after<br>
T1’s increment (corresponding to serializability orderings T2;T1 and T1;T2). That is, even without<br>
locking, T2 will produce only correct outputs.<br>
Assume that a read of a record that another transaction is writing yields either the old value, or the<br>
new value.

&emsp;**10.**   **\[7 points\]:** Write down a counter-example that shows that read-only transactions do<br>
&emsp;need locks.


---

<a id="page-13"></a>
**Page 13**

6.824 Spring 2018, Exam 1   Page 13 of 16

Ben is thinking about this transaction:

T3:<br>
begin\_transaction()<br>
x = x + 1<br>
print "y=", y<br>
end\_transaction()

Ben believes that there is no point in holding the lock on x while reading and printing y. He thinks<br>
it would be OK if a transaction always released each lock after its last use of the locked record.<br>
Thus, for T3, Ben thinks locking should happen like this:

T3:<br>
begin\_transaction()<br>
lock x<br>
x = x + 1<br>
unlock x<br>
lock y<br>
print "y=", y<br>
unlock y<br>
end\_transaction()

It turns out that Ben is wrong: his relaxation of two-phase locking can lead to non-serializable<br>
executions.

&emsp;**11. \[7 points\]:** Write down a transaction that could produce a non-serializable result if run<br>
&emsp;concurrently with Ben’s T3, if both transactions used Ben’s locking scheme. Write down the<br>
&emsp;non-serializable result as well as the transaction. Please assume that there are no failures, no<br>
&emsp;aborts, and no deadlocks.


---

<a id="page-14"></a>
**Page 14**

6.824 Spring 2018, Exam 1   Page 14 of 16

**VII**   **Two-Phase Commit**

A sharded database uses two-phase commit to ensure that either all shard servers commit their<br>
part of each transaction, or none of them do. A database client executing a transaction sends the<br>
transaction’s puts and gets to the shard servers, and then uses a transaction coordinator (TC) to<br>
execute two-phase commit for the transaction. As a reminder, the steps of two-phase commit are<br>
as follows:

**A.** The TC sends a PREPARE message to each participant (each shard server that is involved in<br>
&emsp;the transaction).<br>
**B.** Each participant replies with YES or NO, according to whether the participant is able to<br>
&emsp;commit.<br>
**C.** If all participants answer YES, the TC sends a COMMIT message to each participant. If any<br>
&emsp;participant answers NO, or if the TC times out while waiting for replies, the TC sends out<br>
&emsp;ABORT messages.<br>
**D.** If a participant receives a COMMIT message, it makes its part of the transaction’s updates<br>
&emsp;permanent, and releases locks. If a participant receives an ABORT message, it forgets about<br>
&emsp;the transaction’s updates, and releases locks.

Suppose a TC sends a COMMIT message to one of a transaction’s multiple participants, but the<br>
TC crashes before sending any more messages.

&emsp;**12. \[7 points\]:** Explain what the TC must do after it reboots.


---

<a id="page-15"></a>
**Page 15**

6.824 Spring 2018, Exam 1   Page 15 of 16

Now suppose a client has asked TC1 to run two-phase commit for a transaction. After a while the<br>
client has received no reply from TC1, and is unable to contact TC1.

&emsp;**13. \[7 points\]:** Explain why it would not be OK for the client to find a new coordinator,<br>
&emsp;TC2, and ask TC2 to run two-phase commit again for the transaction (starting with the PRE-<br>
&emsp;PARE messages). It is sufficient to supply an example scenario that leads to an incorrect<br>
&emsp;outcome.


---

<a id="page-16"></a>
**Page 16**

6.824 Spring 2018, Exam 1   Page 16 of 16

**VIII**   **6.824**

&emsp;**14. \[1 points\]:** What can we do to avoid needless Lab difficulties for future generations of<br>
&emsp;6.824 students?

&emsp;**15. \[1 points\]:** Which papers should we definitely keep (or add) for future years?

&emsp;**16. \[1 points\]:** Is there any paper we should delete?

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;End of Exam I

