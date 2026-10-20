# MIT 6.824/6.5840 2025: Quiz 1: Questions

> Copied from the original: <https://pdos.csail.mit.edu/6.824/quizzes.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**


![Figure on page 1](figures/questions-p01-fig01.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Department of Electrical Engineering and Computer Science<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;MASSACHUSETTS INSTITUTE OF TECHNOLOGY

&emsp;&emsp;&emsp;**6.5840 Distributed System Engineering: Spring 2025**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Exam I**

Please write your name on the bottom of each page. You have 80 minutes to complete this quiz.<br>
Some questions may be much harder than others. Read them all through first and attack them in<br>
the order that allows you to make the most progress. If you find a question ambiguous, write down<br>
any assumptions you make. Write neatly. In order to receive full credit you must answer each<br>
question as precisely as possible.<br>
You may use class notes, papers, and lab material. You may read them on your laptop, but you<br>
are not allowed to use any network. For example, you may not look at web sites, use ChatGPT, or<br>
communicate with anyone.

**Name:**<br>
**Gradescope E-Mail Address:**


---

<a id="page-2"></a>
**Page 2**

6.5840 Spring 2025, Exam 1   Page 2 of 17

**I**   **MapReduce**

The MapReduce paper (MapReduce: Simplified Data Processing on Large Clusters, by Dean and<br>
Ghemawat) says in Section 3.1 that the intermediate key space is partitioned among the R reduce<br>
tasks using hash(key) mod R.<br>
Thea is running the word-count MapReduce job (pseudo-code in the paper’s Section 2.1) on a<br>
cluster with 10 worker machines. M is 20 and R is 40. There are no failures, the network is<br>
reliable, no machines are slower than expected, and there is no competing work on any of the<br>
machines or networks involved. The Map input is divided into 20 pieces of 16 megabytes each.

&emsp;**1. \[5 points\]:** By mistake, the hash(key) function Thea is using with MapReduce always<br>
&emsp;returns 1. What effect will that have on the execution of the word-count job, compared to<br>
&emsp;using a well-behaved hash function? Circle the single best answer.<br>
&emsp;&emsp;**A.** the job will produce incorrect final output<br>
&emsp;&emsp;**B.** 10 times as much total CPU time will be needed for Reduce phase<br>
&emsp;&emsp;**C.** 10 times as much total wall-clock time will be needed for Reduce phase<br>
&emsp;&emsp;**D.** 40 times as much total CPU time will be needed for Reduce phase<br>
&emsp;&emsp;**E.** 40 times as much total wall-clock time will be needed for Reduce phase<br>
&emsp;&emsp;**F.** the job will never complete

&emsp;**Name:**


---

<a id="page-3"></a>
**Page 3**

6.5840 Spring 2025, Exam 1   Page 3 of 17

**II**   **VMware FT**

The paper The Design of a Practical System for Fault-Tolerant Virtual Machines by Scales et<br>
al. describes a method for avoiding split-brain using shared storage. Instead of using the shared<br>
storage’s test-and-set, Ben implements test-and-set using the kvsrv server from Lab 2 as follows:

func test-and-set(clnt \*tester.Clnt) bool {<br>
&emsp;val, version, err := clnt.Get("lock")<br>
&emsp;if err != rpc.OK {<br>
&emsp;&emsp;&emsp;return false<br>
&emsp;}<br>
&emsp;if val == "set" {<br>
&emsp;&emsp;return false<br>
&emsp;}<br>
&emsp;if err := clnt.Put("lock", "set", version); err == rpc.OK {<br>
&emsp;&emsp;return true<br>
&emsp;}<br>
&emsp;return false<br>
}

The clnt.Put and clnt.Get are RPCs that invoke the server’s Put and Get methods. You<br>
can assume that Ben has implemented the Put and Get methods correctly.<br>
The initial value of “lock” is the empty string.<br>
When the primary or the backup suspect that the other one has crashed, they invoke test-go-live,<br>
each with their own RPC client clnt:

func test-go-live() {<br>
&emsp;for true {<br>
&emsp;&emsp;&emsp;if test-and-set(clnt) {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;go-live()<br>
&emsp;&emsp;&emsp;&emsp;&emsp;return<br>
&emsp;&emsp;&emsp;}<br>
&emsp;}<br>
}

&emsp;**Name:**


---

<a id="page-4"></a>
**Page 4**

6.5840 Spring 2025, Exam 1   Page 4 of 17

The network may lose, delay, or duplicate a few messages, but most messages will be delivered.<br>
The computers (primary, backup, and kvsrv server) do not fail.

&emsp;**2. \[5 points\]:** What statements about Ben’s implementation are true? (Circle all that apply)<br>
&emsp;&emsp;**A.** Both the primary and backup may observe test-and-set returning true in test-go-live,<br>
&emsp;&emsp;&emsp;and “go live”, resulting in split brain<br>
&emsp;&emsp;**B.** The key/value server may never store “set” for the “lock” key<br>
&emsp;&emsp;**C.** The primary and backup may spin forever in test-go-live, retrying test-and-set,<br>
&emsp;&emsp;&emsp;because it may never return true<br>
&emsp;&emsp;**D.** If all RPCs succeed with no timeouts while running test-go-live, either the pri-<br>
&emsp;&emsp;&emsp;mary or the backup will observe true from test-and-set, but not both

&emsp;**Name:**


---

<a id="page-5"></a>
**Page 5**

6.5840 Spring 2025, Exam 1   Page 5 of 17

**III**   **Linearizability**

Alyssa is experimenting with a linearizable put/get key/value storage service. Unlike Lab 2, her<br>
key/value service has no versions; put calls look like put(key, value).<br>
Alyssa has two clients. Client C1 executes this:

t = get("x")<br>
put("x", t + 1)

At about the same time, client C2 executes this:

t = get("x")<br>
put("x", t \* 2)

Before either client starts, the value for key “x” in the storage system is 10. Both clients’ calls<br>
complete without error. There is no other activity involving the storage system, and there are no<br>
failures.<br>
Suppose the history of the execution, in the style of Lecture 4, with values omitted, looks like this:

C1: \|--Rx?--\|   \|--Wx?--\|<br>
C2: \|--Rx?--\|   \|--Wx?--\|

&emsp;**3. \[5 points\]:** After both clients have finished, what could the resulting value of x be in the<br>
&emsp;storage system? (Circle all that apply)<br>
&emsp;&emsp;**A.** 10<br>
&emsp;&emsp;**B.** 11<br>
&emsp;&emsp;**C.** 20<br>
&emsp;&emsp;**D.** 21<br>
&emsp;&emsp;**E.** 22

&emsp;**Name:**


---

<a id="page-6"></a>
**Page 6**

6.5840 Spring 2025, Exam 1   Page 6 of 17

Alyssa resets the value of “x” to 10, and re-runs the two client programs. This time, the execution<br>
history looks like this:

C1: \|--Rx?--\|   \|--Wx?--\|<br>
C2:   \|---Rx?---\|   \|--Wx?--\|

&emsp;**4. \[5 points\]:** After both clients have finished, what could the resulting value of x be in the<br>
&emsp;storage system? (Circle all that apply)<br>
&emsp;&emsp;**A.** 10<br>
&emsp;&emsp;**B.** 11<br>
&emsp;&emsp;**C.** 20<br>
&emsp;&emsp;**D.** 21<br>
&emsp;&emsp;**E.** 22

&emsp;**Name:**


---

<a id="page-7"></a>
**Page 7**

6.5840 Spring 2025, Exam 1   Page 7 of 17

**IV**   **GFS**

Consider GFS as described in The Google File System by Ghemawat et al.

&emsp;**5. \[5 points\]:** Which statements about GFS are true? (Circle all that apply)<br>
&emsp;&emsp;**A.** GFS ensures linearizability of client operations by allowing clients to read from chunk<br>
&emsp;&emsp;&emsp;replicas.<br>
&emsp;&emsp;**B.** The primary server of a chunk ensures that Append operations are executed exactly<br>
&emsp;&emsp;&emsp;once.<br>
&emsp;&emsp;**C.** A chunk server uses 64 Mbytes of disk space for each chunk.<br>
&emsp;&emsp;**D.** Leases help ensure that each chunk has only one primary.

&emsp;**Name:**


---

<a id="page-8"></a>
**Page 8**

6.5840 Spring 2025, Exam 1   Page 8 of 17

**V**   **Raft**

Refer to Ongaro and Ousterhout’s In Search of an Understandable Consensus Algorithm (Extended<br>
Version).

&emsp;**6. \[10 points\]:** Which statements about Raft are true? (Circle all that apply)<br>
&emsp;&emsp;**A.** If a follower receives an AppendEntries RPC from the leader and the follower’s term<br>
&emsp;&emsp;&emsp;matches the one in the RPC, then the prevLogIndex in the RPC must be equal to or<br>
&emsp;&emsp;&emsp;higher than the follower’s lastApplied<br>
&emsp;&emsp;**B.** Raft is optimized for the case that term switch happen frequently<br>
&emsp;&emsp;**C.** Raft guarantees that a leader in term t is leader in term t + 1<br>
&emsp;&emsp;**D.** If a leader sends the command in log index i on the apply channel, the leader must have<br>
&emsp;&emsp;&emsp;persisted log index i<br>
&emsp;&emsp;**E.** If a follower crashes in a term and quickly reboots, it remembers who it voted for before<br>
&emsp;&emsp;&emsp;the crash<br>
&emsp;&emsp;**F.** The leader’s matchIndex for a peer is always equal to or smaller than the leader’s<br>
&emsp;&emsp;&emsp;nextIndex for that peer.<br>
&emsp;&emsp;**G.** A candidate who becomes leader sends out AppendEntries to all followers to suppress<br>
&emsp;&emsp;&emsp;further elections<br>
&emsp;&emsp;**H.** If Raft doesn’t use snapshots, a crashed follower will send all committed log entries on<br>
&emsp;&emsp;&emsp;the apply channel after it reboots, even ones that it sent before the crash

&emsp;**Name:**


---

<a id="page-9"></a>
**Page 9**

6.5840 Spring 2025, Exam 1   Page 9 of 17

&emsp;**7. \[10 points\]:** Which of the following bugs causes a Raft implementation to violate the<br>
&emsp;safety properties listed in Figure 3? (Circle all that apply)<br>
&emsp;&emsp;**A.** A deadlock in a follower<br>
&emsp;&emsp;**B.** A follower who starts an election very quickly<br>
&emsp;&emsp;**C.** A partitioned leader who on rejoining updates its term to the new leader’s term and<br>
&emsp;&emsp;&emsp;sends AppendEntries for commands in its log with the new term<br>
&emsp;&emsp;**D.** A race condition in the follower’s implementation that causes two followers to send<br>
&emsp;&emsp;&emsp;different commands on the apply channel for log index i<br>
&emsp;&emsp;**E.** A candidate that forgets to vote for itself<br>
&emsp;&emsp;**F.** A follower who appends a log entry to its log even if the term in the AppendEntries is<br>
&emsp;&emsp;&emsp;smaller than its own and who then sends the log entry on the apply channel<br>
&emsp;&emsp;**G.** A follower that forgets to implement the rollback optimization presented at the end of<br>
&emsp;&emsp;&emsp;section 5.3<br>
&emsp;&emsp;**H.** A leader who always sends only one entry in an AppendEntries RPC to a follower

&emsp;**Name:**


---

<a id="page-10"></a>
**Page 10**

6.5840 Spring 2025, Exam 1   Page 10 of 17

**VI**   **Lab 3A-3C**

George is implementing Raft as in Lab 3A-3C. Eager to test his implementation, George runs a<br>
git pull to get the latest changes from the 6.5840 staff. The latest changes introduce a new test,<br>
TestMiniReElection, which tests whether Raft can re-elect a leader after a single network<br>
partition.

func TestMiniReElection(t \*testing.T) {<br>
servers := 3 // initialize three servers

...

// wait for a leader to be elected; get the leader’s index<br>
leader1 := ts.checkOneLeader()

ts.g.DisconnectAll(leader1) // disconnect leader1 from other servers

// wait for a new leader to be elected; get the leader’s index<br>
leader2 := ts.checkOneLeader() // \*\*\*<br>
}

ts.checkOneLeader() repeatedly polls only the connected servers until one of the connected<br>
servers returns that it is a leader. If it cannot find a leader within 5s, it returns a timeout error.<br>
Unfortunately, there is a bug in the Raft test infrastructure. When leader1 is disconnected,<br>
leader1 can still send RPCs to the other servers but not receive responses from the other servers.<br>
George runs TestMiniReElection, and finds that the test fails at the line marked with “\*\*\*”<br>
with the timeout error “expected one leader, got none”.

&emsp;**8.**   **\[5 points\]:** Assume George’s Raft implementation is completely correct, and that the<br>
&emsp;network is reliable. Briefly explain why the buggy test infrastructure causes George’s imple-<br>
&emsp;mentation to fail the new test.

&emsp;**Name:**


---

<a id="page-11"></a>
**Page 11**

6.5840 Spring 2025, Exam 1   Page 11 of 17

**VII**   **ZooKeeper**

Refer to ZooKeeper: Wait-free coordination for Internet-scale systems, by Hunt, Konar, Junqueira,<br>
and Reed, and to Lecture 9.<br>
Alyssa runs a ZooKeeper service with a ZooKeeper leader and multiple followers. Alyssa has three<br>
ZooKeeper client programs, P1, P2, and P3:

P1:<br>
&emsp;s = openSession()<br>
&emsp;if create(s, "/leader", "one", flags=ephemeral) == true:<br>
&emsp;&emsp;&emsp;print "P1 starting as leader"<br>
&emsp;&emsp;&emsp;\_, version = getData(s, "/x", watch=false)<br>
&emsp;&emsp;&emsp;setData(s, "/x", "one", version)<br>
&emsp;&emsp;&emsp;\_, version = getData(s, "/y", watch=false)<br>
&emsp;&emsp;&emsp;setData(s, "/y", "one", version)

P2:<br>
&emsp;s = openSession()<br>
&emsp;if create(s, "/leader", "two", flags=ephemeral) == true:<br>
&emsp;&emsp;&emsp;print "P2 starting as leader"<br>
&emsp;&emsp;&emsp;\_, version = getData(s, "/x", watch=false)<br>
&emsp;&emsp;&emsp;setData(s, "/x", "two", version)<br>
&emsp;&emsp;&emsp;\_, version = getData(s, "/y", watch=false)<br>
&emsp;&emsp;&emsp;setData(s, "/y", "two", version)<br>
&emsp;&emsp;&emsp;print "P2 done"

P3:<br>
&emsp;s = openSession()<br>
&emsp;sync(s, "/")<br>
&emsp;x = getData(s, "/x", watch=false)<br>
&emsp;y = getData(s, "/y", watch=false)<br>
&emsp;print x, y

Initially, znode “/leader” does not exist, znode “/x” exists and contains the string “empty”, and<br>
znode “/y” exists and also contains the string “empty”.<br>
The ZooKeeper calls in Alyssa’s code are all synchronous. The ZooKeeper client call create() is<br>
exclusive, returning false if the file already exists, and true if it was able to create the file. The<br>
programs might end up talking to different ZooKeeper followers.

&emsp;**Name:**


---

<a id="page-12"></a>
**Page 12**

6.5840 Spring 2025, Exam 1   Page 12 of 17

Alyssa starts P1, waits until she sees it print “P1 starting as leader”, then (on a different computer)<br>
starts P2. Just at this point in time, P1’s network connection starts to become slow and unreliable,<br>
so that sometimes it delivers packets, sometimes not. Alyssa sees that P2 prints “P2 starting as<br>
leader”, and after a little while “P2 done”. P2’s network connection is reliable and fast.<br>
After Alyssa sees “P2 done”, she runs P3.

&emsp;**9. \[5 points\]:** What output from P3 could Alyssa see? (Circle all that apply)<br>
&emsp;&emsp;**A.** one, one<br>
&emsp;&emsp;**B.** two, two<br>
&emsp;&emsp;**C.** one, two<br>
&emsp;&emsp;**D.** two, one

&emsp;**Name:**


---

<a id="page-13"></a>
**Page 13**

6.5840 Spring 2025, Exam 1   Page 13 of 17

**VIII**   **Distributed Transactions**

Alyssa has a database that supports serializable transactions. Records “x” and “y” both start out<br>
containing the value 1. Alyssa starts three transactions at the same time:

T1:<br>
BEGIN-X<br>
&emsp;temp1 = get("x")<br>
&emsp;temp2 = get("y")<br>
&emsp;put("x", temp1 + temp2)<br>
END-X

T2:<br>
BEGIN-X<br>
&emsp;temp1 = get("y")<br>
&emsp;put("x", temp1 \* 2)<br>
END-X

T3:<br>
BEGIN-X<br>
&emsp;put("y", 3)<br>
END-X

BEGIN-X marks the start of a transaction, and END-X marks the end. All three transactions<br>
commit and finish. There are no aborts, deadlocks, or failures. There is no other activity in the<br>
database.<br>
When Alyssa looks at record “x” in the database after the transactions complete, she sees the value<br>
5.

&emsp;**10. \[5 points\]:** Briefly explain how the value 5 could have resulted from these transactions.

&emsp;**Name:**


---

<a id="page-14"></a>
**Page 14**

6.5840 Spring 2025, Exam 1   Page 14 of 17

**IX**   **Spanner**

Refer to Spanner: Google’s Globally-Distributed Database, by Corbett et al.

&emsp;**11. \[5 points\]:** Suppose you only wanted to support read-write transactions (not read-only<br>
&emsp;and not snapshot reads). You want therefore to eliminate all of the Spanner mechanisms that<br>
&emsp;are not needed for read-write transactions. Which of these techniques can be eliminated?<br>
&emsp;(Circle all that apply)<br>
&emsp;&emsp;**A.** commit wait (Sections 4.1.2, 4.2.1)<br>
&emsp;&emsp;**B.** safe time (Section 4.1.3)<br>
&emsp;&emsp;**C.** deadlock avoidance (Section 4.2.1)<br>
&emsp;&emsp;**D.** assignment of timestamps to read/write transactions (Section 4.1.2)

&emsp;**Name:**


---

<a id="page-15"></a>
**Page 15**

6.5840 Spring 2025, Exam 1   Page 15 of 17

**X**   **6.5840**

&emsp;**12. \[1 points\]:** Which lectures/papers should we definitely keep for future years?<br>
&emsp;&emsp;**–** MapReduce 122<br>
&emsp;&emsp;**–** RPC, Threads, and Go 80<br>
&emsp;&emsp;**–** Primary-Backup Replication / VMware FT 64<br>
&emsp;&emsp;**–** Linearizability 84<br>
&emsp;&emsp;**–** Raft 125<br>
&emsp;&emsp;**–** GFS 85<br>
&emsp;&emsp;**–** ZooKeeper 79<br>
&emsp;&emsp;**–** Distributed Transactions 68<br>
&emsp;&emsp;**–** Q+A on Lab 3A/3B 50<br>
&emsp;&emsp;**–** Spanner 52

&emsp;**Name:**


---

<a id="page-16"></a>
**Page 16**

6.5840 Spring 2025, Exam 1   Page 16 of 17

&emsp;**13. \[1 points\]:** Which lectures/papers should we omit?<br>
&emsp;&emsp;**–** MapReduce 2<br>
&emsp;&emsp;**–** RPC, Threads, and Go 16<br>
&emsp;&emsp;**–** Primary-Backup Replication / VMware FT 29<br>
&emsp;&emsp;**–** Linearizability 18<br>
&emsp;&emsp;**–** Raft 1<br>
&emsp;&emsp;**–** GFS 14<br>
&emsp;&emsp;**–** ZooKeeper 19<br>
&emsp;&emsp;**–** Distributed Transactions 14<br>
&emsp;&emsp;**–** Q+A on Lab 3A/3B 49<br>
&emsp;&emsp;**–** Spanner 41

&emsp;**14. \[1 points\]:** What can we do to improve the course?

**Labs**   **Count**<br>
Better debugging tools   15<br>
Fine   12<br>
Implement things other than Raft   10<br>
More/better tests   9<br>
Better lab specs/common bugs   8<br>
More lab guidance   7<br>
Make labs independent/release lab solutions   7<br>
More time to do labs   5<br>
More time to learn Go/Go tutorials   5<br>
Shorter labs   2<br>
More system design practice   1<br>
Extra credit for labs   1<br>
More difficult labs   1

Continued on next page.

&emsp;**Name:**


---

<a id="page-17"></a>
**Page 17**

6.5840 Spring 2025, Exam 1   Page 17 of 17

**Lectures**   **Count**<br>
More context for papers   7<br>
More about distributed systems applications   5<br>
More code examples during lecture   4<br>
Better lecture note formatting   4<br>
Better FAQ   4<br>
Order lectures more logically   3<br>
More lecture QAs   3<br>
Eliminate lecture QAs   3<br>
Better lecture visualization tools   3<br>
Answers to lecture QAs   3<br>
Have lectures be different from the papers   2<br>
Be more engaging   2<br>
Focus on big ideas during lectures   2<br>
More guest lectures   1<br>
Free candies at lecture   1<br>
Misc   5

**Logistics**   **Count**<br>
More OH/more TAs during OH   22<br>
Record lectures   6<br>
Turn up the lecture audio   2<br>
Recitations   2<br>
Better support for projects   2<br>
Don’t use Gradescope   1<br>
Better website   1<br>
Weigh labs more   1<br>
Give out Go plushies   1<br>
More collaboration   1<br>
Professor OH   1

**Exams**   **Count**<br>
Review session   3<br>
Weight exams less   2<br>
More practice questions   1<br>
No exams   1<br>
Bigger midterm test room   1<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;End of Exam I

&emsp;**Name:**

