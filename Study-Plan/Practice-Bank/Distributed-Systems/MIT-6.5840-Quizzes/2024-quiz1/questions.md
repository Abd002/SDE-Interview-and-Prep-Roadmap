# MIT 6.824/6.5840 2024: Quiz 1: Questions

> Copied from the original: <https://pdos.csail.mit.edu/6.824/quizzes.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**


![Figure on page 1](figures/questions-p01-fig01.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Department of Electrical Engineering and Computer Science<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;MASSACHUSETTS INSTITUTE OF TECHNOLOGY

&emsp;&emsp;&emsp;**6.5840 Distributed System Engineering: Spring 2024**<br>
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

6.5840 Spring 2024, Exam 1   Page 2 of 20

**I**   **MapReduce**

Have a look at Figure 3(a) in the paper MapReduce: Simplified Data Processing on Large Clusters<br>
by Dean and Ghemawat. The three graphs on the left show the rate of data movement over time<br>
for a MapReduce job that sorts a terabyte of data: the rate at which Maps read their input, the<br>
rate at which intermediate data is shuffled, and the rate at which Reduces write their output. For<br>
these questions you should assume that only this MapReduce job is using the servers and network,<br>
and that there are no failures. Many of the numbers below are derived from looking at the graphs,<br>
and are thus approximate; your reading of the graphs may be somewhat different from our’s; you<br>
should circle the answer that is closest to what you think is correct.

&emsp;**1.**   **\[6 points\]:** Roughly when is the first time at which the sort application’s Reduce()<br>
&emsp;function is called? Circle the best answer.<br>
&emsp;&emsp;**–** 0 seconds<br>
&emsp;&emsp;**–** 50 seconds<br>
&emsp;&emsp;**–** 150 seconds<br>
&emsp;&emsp;**–** 300 seconds

&emsp;**2. \[7 points\]:** Roughly how long does it take a single application Reduce function to sort its<br>
&emsp;share of the data (just the sort, not including either the shuffle or the writing of the output)?<br>
&emsp;Circle the best answer.<br>
&emsp;&emsp;**–** 10 seconds<br>
&emsp;&emsp;**–** 75 seconds<br>
&emsp;&emsp;**–** 200 seconds<br>
&emsp;&emsp;**–** 250 seconds<br>
&emsp;&emsp;**–** 650 seconds

&emsp;**Name:**


---

<a id="page-3"></a>
**Page 3**

6.5840 Spring 2024, Exam 1   Page 3 of 20

&emsp;**3. \[6 points\]:** Why are there two bumps in the Shuffle graph? That is, why does the Shuffle<br>
&emsp;graph go up and then down from time 20 to 200, remain at zero for 100 seconds, and then go<br>
&emsp;up and then down from time 300 to 600? Circle the best answer.<br>
&emsp;&emsp;**–** There are more Map tasks (M = 15,000) than there are machines.<br>
&emsp;&emsp;**–** There are more Reduce tasks (R = 4000) than there are machines.<br>
&emsp;&emsp;**–** There are more Map tasks than there are Reduce tasks.<br>
&emsp;&emsp;**–** The aggregate network throughput is smaller than the aggregate disk throughput.<br>
&emsp;&emsp;**–** The Map tasks consume more CPU time than the Reduce tasks.

&emsp;**4. \[7 points\]:** Why does the shuffle begin a long time before the Map phase has finished?<br>
&emsp;Circle the best answer.<br>
&emsp;&emsp;**–** There are more Map tasks (M = 15,000) than there are machines.<br>
&emsp;&emsp;**–** There are more Reduce tasks (R = 4000) than there are machines.<br>
&emsp;&emsp;**–** There are more Map tasks than there are Reduce tasks.<br>
&emsp;&emsp;**–** The aggregate network throughput is smaller than the aggregate disk throughput.<br>
&emsp;&emsp;**–** The Map tasks consume more CPU time than the Reduce tasks.

&emsp;**Name:**


---

<a id="page-4"></a>
**Page 4**

6.5840 Spring 2024, Exam 1   Page 4 of 20

**II**   **Linearizability**

These questions concern the material from Lecture 4, Consistency and Linearizability.<br>
You have a service whose state is a single string, and that exposes two RPC operations to clients:<br>
one operation appends the RPC argument to the state, and the other RPC operation returns the<br>
current state. The timelines below indicate the start time, end time, argument string, and reply string<br>
for each client operation. Ax indicates an append operation with argument x, and Ry indicates a<br>
read operation to which the server replied y. The vertical bars indicate the start and end times<br>
of each operation (the times at which the client sends the request, and receives the reply). The<br>
service’s state string starts out empty at the beginning of each history.<br>
For example,

C1: \|---Ax---\|<br>
C2:   \|---Ay---\|<br>
C3:   \|--Ryx--\|

means that client C1 sent an append RPC with “x” as the argument, C2 sent an append RPC with<br>
“y” as the argument, and C3 read the state and received the reply “yx”.

&emsp;**Name:**


---

<a id="page-5"></a>
**Page 5**

6.5840 Spring 2024, Exam 1   Page 5 of 20

Consider this history, in which the reply string sent to C4 has been omitted:

C1: \|---Ax---\|<br>
C2:   \|---Ay---\|<br>
C3:   \|---Az---\|<br>
C4:   \|--R?--\|

&emsp;**5. \[6 points\]:** Which values could C4’s read yield that are consistent with linearizability?<br>
&emsp;Circle all of the correct answers.<br>
&emsp;&emsp;**–** xzy<br>
&emsp;&emsp;**–** yxz<br>
&emsp;&emsp;**–** yzx<br>
&emsp;&emsp;**–** xy<br>
&emsp;&emsp;**–** xz<br>
&emsp;&emsp;**–** yx<br>
&emsp;&emsp;**–** zy

&emsp;**Name:**


---

<a id="page-6"></a>
**Page 6**

6.5840 Spring 2024, Exam 1   Page 6 of 20

Now look at this history:

C1: \|-------Ax-------\|<br>
C2:   \|---Ay---\|<br>
C3:   \|--Ry--\|<br>
C4:   \|----R?----\|

&emsp;**6. \[7 points\]:** Which values could C4’s read yield that are consistent with linearizability?<br>
&emsp;Circle all of the correct answers.<br>
&emsp;&emsp;**–** y<br>
&emsp;&emsp;**–** x<br>
&emsp;&emsp;**–** yx<br>
&emsp;&emsp;**–** xy

&emsp;**Name:**


---

<a id="page-7"></a>
**Page 7**

6.5840 Spring 2024, Exam 1   Page 7 of 20

**III**   **GFS and Raft**

After reading the GFS paper (The Google File System by Ghemawat et al.) and the Raft paper (On-<br>
garo and Ousterhout’s In Search of an Understandable Consensus Algorithm (Extended Version)),<br>
Ben replaces the GFS master with a new coordinator that uses Raft. The Raft-based coordinator<br>
provides the same functions as before but replicates the log of operations using 3 Raft peers. All<br>
other parts of GFS stay the same.<br>
Which of the following statements are true? (Circle all that apply)

&emsp;**7. \[6 points\]:**

&emsp;&emsp;**A.** The coordinator can continue operation in the presence of network partitions without<br>
&emsp;&emsp;&emsp;any additional monitoring infrastructure, if one partition with peers is able to achieve a<br>
&emsp;&emsp;&emsp;majority.<br>
&emsp;&emsp;**B.** The coordinator can continue operation correctly even if one of the 3 peers has failed<br>
&emsp;&emsp;&emsp;(and there are no other failures).<br>
&emsp;&emsp;**C.** None of the above are true

&emsp;**Name:**


---

<a id="page-8"></a>
**Page 8**

6.5840 Spring 2024, Exam 1   Page 8 of 20

Ben also considers using Raft for chunk replication. He runs many Raft clusters and has the GFS<br>
master assign chunks to a specific Raft cluster (i.e., each chunk is assigned to one Raft cluster,<br>
consisting of a leader and two followers). GFS clients submit write and append operations for a<br>
chunk to the leader of the Raft cluster for that chunk (i.e., Ben’s design doesn’t implement the<br>
separate data flow). The leader of the Raft cluster replicates write and append operation using the<br>
Raft library. All other parts of GFS (e.g., assigning leases to the leader, client caching locations<br>
of chunk servers, reading from the closest server, and so on) stay the same. (You can assume that<br>
chunk servers have enough disk space for operations to succeed.)<br>
Which of the following statements are true? (Circle all that apply)

&emsp;**8. \[7 points\]:**

&emsp;&emsp;**A.** Unlike the old design, Ben’s design can achieve linearizability for chunk operations.<br>
&emsp;&emsp;**B.** Unlike the old design, Ben’s design can continue operation despite the failure of one<br>
&emsp;&emsp;&emsp;chunk server.<br>
&emsp;&emsp;**C.** By using Raft, Ben’s design allows clients to perform more mutating chunk operations<br>
&emsp;&emsp;&emsp;per second than the old design.<br>
&emsp;&emsp;**D.** Raft’s snapshots allow a chunk server to catch up in a few seconds if has been down for<br>
&emsp;&emsp;&emsp;a long time (assuming the same network as in the GFS paper).<br>
&emsp;&emsp;**E.** None of the above are true

&emsp;**Name:**


---

<a id="page-9"></a>
**Page 9**

6.5840 Spring 2024, Exam 1   Page 9 of 20

**IV**   **Raft**

Consider the Raft paper (Ongaro and Ousterhout’s In Search of an Understandable Consensus<br>
Algorithm (Extended Version)). Ben wonders what the impact of network behavior is on Raft’s<br>
performance. Ben runs a Raft-replicated server that receives many client requests. If the network<br>
delivers AppendEntries RPCs in order, Ben’s Raft implementation is fast (i.e., completes many<br>
client requests per second). But, if the network delivers AppendEntries frequently out of order,<br>
Ben’s Raft implementation performs badly (i.e., completes fewer client requests per second). Using<br>
the rules in Figure 2 explain why this is the case.

&emsp;**9. \[6 points\]:**

&emsp;**Name:**


---

<a id="page-10"></a>
**Page 10**

6.5840 Spring 2024, Exam 1   Page 10 of 20

**V**   **Lab 3A-3C**

Alyssa is implementing Raft as in Lab 3A-3C. She implements advancing the commitIndex at the<br>
leader (i.e., last bullet of Leaders in Fig 2) as follows:

func (rf \*Raft) advanceCommit() {<br>
&emsp;start := rf.commitIndex + 1<br>
&emsp;if start \< rf.log.start() { // on restart start could be 1<br>
&emsp;&emsp;&emsp;start = rf.log.start()<br>
&emsp;}<br>
&emsp;for index := start; index \<= rf.log.lastindex(); index++ {<br>
&emsp;&emsp;&emsp;if rf.log.entry(index).Term != rf.currentTerm { // 5.4<br>
&emsp;&emsp;&emsp;&emsp;&emsp;continue   // \*\*\*<br>
&emsp;&emsp;&emsp;}<br>
&emsp;&emsp;&emsp;n := 1 // leader always matches<br>
&emsp;&emsp;&emsp;for i := 0; i \< len(rf.peers); i++ {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;if i != rf.me && rf.matchIndex\[i\] \>= index {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;n += 1<br>
&emsp;&emsp;&emsp;&emsp;&emsp;}<br>
&emsp;&emsp;&emsp;}<br>
&emsp;&emsp;&emsp;if n \> len(rf.peers)/2 { // a majority?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;DPrintf("%v: Commit %v\\n", rf.me, index)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;rf.commitIndex = index<br>
&emsp;&emsp;&emsp;}<br>
&emsp;}<br>
}

Assume that all omitted parts of Alyssa’s code are correct.

&emsp;**Name:**


---

<a id="page-11"></a>
**Page 11**

6.5840 Spring 2024, Exam 1   Page 11 of 20

Ben argues that the line marked with “\*\*\*” could be replaced by a break statement so that the loop<br>
terminates immediately.

&emsp;**10. \[7 points\]:** Explain what could go wrong if one adopted Ben’s proposal; please include<br>
&emsp;a specific sequence of events to illustrate your answer.

&emsp;**Name:**


---

<a id="page-12"></a>
**Page 12**

6.5840 Spring 2024, Exam 1   Page 12 of 20

**VI**   **More lab 3A-3C**

Alyssa is implementing Raft as in Lab 3A-3C. She implements the rule for conversion to follower<br>
in her AppendEntries RPC handler as shown below:

func (rf \*Raft) convertToFollower(term int) {<br>
&emsp;rf.state = Follower<br>
&emsp;rf.votedFor = -1<br>
&emsp;rf.currentTerm = term<br>
&emsp;rf.persist()

}

func (rf \*Raft) AppendEntries(args \*AppendEntriesArgs,<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;reply \*AppendEntriesReply) {<br>
&emsp;rf.mu.Lock()<br>
&emsp;defer rf.mu.Unlock()

&emsp;if args.Term \>= rf.currentTerm {

&emsp;&emsp;&emsp;rf.convertToFollower(args.Term)

&emsp;}

&emsp;...

}

Assume that all omitted parts of Alyssa’s code are correct.

&emsp;**Name:**


---

<a id="page-13"></a>
**Page 13**

6.5840 Spring 2024, Exam 1   Page 13 of 20

&emsp;**11.**   **\[6 points\]:** Describe a specific sequence of events that would cause Alyssa’s imple-<br>
&emsp;mentation to break the safety guarantees provided by Raft.

&emsp;**Name:**


---

<a id="page-14"></a>
**Page 14**

6.5840 Spring 2024, Exam 1   Page 14 of 20

**VII**   **ZooKeeper**

Refer to ZooKeeper: Wait-free coordination for Internet-scale systems by Hunt, Konar, Junqueira,<br>
and Reed, and to the notes for Lecture 9.<br>
The code fragments below are simplified versions of how something like GFS or MapReduce might<br>
use ZooKeeper to elect a coordinator, and for that coordinator to store state such as the assignments<br>
of GFS data to chunkservers.<br>
Suppose server S1 executes the following code to become elected and to then store coordinator<br>
state in /A and /B. Initially, znode /coord-lock does not exist, znode /A starts out containing A0,<br>
and znode /B starts out containing B0.

&emsp;s = openSession()<br>
&emsp;if create(s, "/coord-lock", data="S1", ephemeral=true) == true:<br>
&emsp;&emsp;&emsp;setData(s, "/A", "A1", version=-1)<br>
&emsp;&emsp;&emsp;setData(s, "/B", "B1", version=-1)

&emsp;**12. \[7 points\]:** Briefly explain why, for coordinator election, it makes sense that /coord-lock<br>
&emsp;should be an ephemeral znode rather than a regular znode.

&emsp;**Name:**


---

<a id="page-15"></a>
**Page 15**

6.5840 Spring 2024, Exam 1   Page 15 of 20

S1’s create() finishes and returns true to indicate success. But just after that, and before ZooKeeper<br>
has received S1’s setData() requests, ZooKeeper decides that S1 has failed, and ZooKeeper termi-<br>
nates S1’s session.<br>
After ZooKeeper terminates S1’s session, server S2 runs this to become coordinator:

&emsp;s = openSession()<br>
&emsp;if create(s, "/coord-lock", data="S2", ephemeral=true) == true:<br>
&emsp;&emsp;&emsp;setData(s, "/A", "A2", version=-1)<br>
&emsp;&emsp;&emsp;setData(s, "/B", "B2", version=-1)

However, S1 is actually still alive, and it proceeds to send the two setData() requests, and they<br>
arrive at ZooKeeper.<br>
Then client C1 reads /B and /A and sees B2 and A2, respectively.<br>
Now a different client, C2, reads /B, and then reads /A. Both reads succeed.

&emsp;**13. \[6 points\]:** Given the way ZooKeeper works, what can C2 observe? Circle all of the<br>
&emsp;possible read results.

&emsp;/B   /A<br>
&emsp;-------<br>
&emsp;B0   A0<br>
&emsp;B0   A1<br>
&emsp;B0   A2<br>
&emsp;B2   A0<br>
&emsp;B2   A1

&emsp;**Name:**


---

<a id="page-16"></a>
**Page 16**

6.5840 Spring 2024, Exam 1   Page 16 of 20

**VIII**   **Grove**

In the ApplyReadonly function in Figure 7, Ben decides to delete the check for s.waitForCommitted().<br>
The new code is as as follows:

func (s \*Server) ApplyReadonly(op) Result {<br>
&emsp;s.mutex.Lock()

&emsp;if s.leaseExpiry \> GetTimeRange().latest {<br>
&emsp;&emsp;&emsp;e := s.epoch<br>
&emsp;&emsp;&emsp;idx, res := s.stateLogger.LocalRead(op)<br>
&emsp;&emsp;&emsp;s.mutex.Unlock()<br>
&emsp;&emsp;&emsp;return res<br>
&emsp;} else {<br>
&emsp;&emsp;&emsp;s.mutex.Unlock()<br>
&emsp;&emsp;&emsp;return ErrRetry<br>
&emsp;}<br>
}

&emsp;**14. \[7 points\]:** Explain why this modification can result in non-linearizable reads.

&emsp;**Name:**


---

<a id="page-17"></a>
**Page 17**

6.5840 Spring 2024, Exam 1   Page 17 of 20

**IX**   **Distributed Transactions**

MouseGPT is designing a distributed transaction system using two-phase commit and two-phase<br>
locking, as discussed in Lecture 12 and Chapter 9 of the 6.033 reading. The goal is to provide seri-<br>
alizable results. The question arises of what should happen if a participant computer crashes while<br>
in the PREPARED state for a transaction. MouseGPT thinks that all-or-nothing atomicity would<br>
be satisfied if such a transaction were completely forgotten. So MouseGPT designs the system so<br>
that if a participant computer crashes and restarts while it is in the PREPARED state for a trans-<br>
action that it’s part of, the recovery software on that computer un-does any local modifications the<br>
interrupted transaction might have performed and releases its locks, and sends a network message<br>
to each other participant and to the TC to tell them to undo any changes made by the transaction<br>
and to release its locks.

&emsp;**15.**   **\[6 points\]:** Explain why MouseGPT’s plan would cause the system to produce non-<br>
&emsp;serializable (incorrect) results.

&emsp;**Name:**


---

<a id="page-18"></a>
**Page 18**

6.5840 Spring 2024, Exam 1   Page 18 of 20

**X**   **6.5840**

&emsp;**16. \[1 points\]:** Which lectures/papers should we definitely keep for future years?<br>
&emsp;&emsp;**–** MapReduce<br>
&emsp;&emsp;**–** RPC, Threads, and Go<br>
&emsp;&emsp;**–** Linearizability<br>
&emsp;&emsp;**–** GFS<br>
&emsp;&emsp;**–** Raft<br>
&emsp;&emsp;**–** ZooKeeper<br>
&emsp;&emsp;**–** Q+A on Lab 3A/3B<br>
&emsp;&emsp;**–** Grove<br>
&emsp;&emsp;**–** Transactions

&emsp;**Name:**


---

<a id="page-19"></a>
**Page 19**

6.5840 Spring 2024, Exam 1   Page 19 of 20

&emsp;**17. \[1 points\]:** Which lectures/papers should we omit?<br>
&emsp;&emsp;**–** MapReduce<br>
&emsp;&emsp;**–** RPC, Threads, and Go<br>
&emsp;&emsp;**–** Linearizability<br>
&emsp;&emsp;**–** GFS<br>
&emsp;&emsp;**–** Raft<br>
&emsp;&emsp;**–** ZooKeeper<br>
&emsp;&emsp;**–** Q+A on Lab 3A/3B<br>
&emsp;&emsp;**–** Grove<br>
&emsp;&emsp;**–** Transactions

&emsp;**Name:**


---

<a id="page-20"></a>
**Page 20**

6.5840 Spring 2024, Exam 1   Page 20 of 20

&emsp;**18. \[1 points\]:** What can we do to improve the course?

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;End of Exam I

&emsp;**Name:**

