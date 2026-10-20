# MIT 6.824/6.5840 2024: Quiz 1: Official solutions

> Copied from the original: <https://pdos.csail.mit.edu/6.824/quizzes.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**


![Figure on page 1](figures/solutions-p01-fig01.png)

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

Grade histogram for Exam 1

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;max   =   98.25<br>
&emsp;&emsp;&emsp;&emsp;&emsp;median   =   81.25<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;µ   =   80.32<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;σ   =   9.72


---

<a id="page-3"></a>
**Page 3**

6.5840 Spring 2024, Exam 1   Page 3 of 21

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
&emsp;&emsp;**–** 300 seconds<br>
&emsp;**Answer:** The best answer is 150 seconds. No Reduce function can be called until every Map<br>
&emsp;function has finished; the top graph suggests that the Maps stop running around 150 seconds,<br>
&emsp;and the paper text mentions 200 seconds.

&emsp;**2. \[7 points\]:** Roughly how long does it take a single application Reduce function to sort its<br>
&emsp;share of the data (just the sort, not including either the shuffle or the writing of the output)?<br>
&emsp;Circle the best answer.<br>
&emsp;&emsp;**–** 10 seconds<br>
&emsp;&emsp;**–** 75 seconds<br>
&emsp;&emsp;**–** 200 seconds<br>
&emsp;&emsp;**–** 250 seconds<br>
&emsp;&emsp;**–** 650 seconds<br>
&emsp;**Answer:** This question is broken: the application Reduce function does not sort the data.<br>
&emsp;MapReduce’s reduce task framework does the sort, and (for this application) the application<br>
&emsp;Reduce function just returns its argument.

&emsp;**Name:**


---

<a id="page-4"></a>
**Page 4**

6.5840 Spring 2024, Exam 1   Page 4 of 21

&emsp;**3. \[6 points\]:** Why are there two bumps in the Shuffle graph? That is, why does the Shuffle<br>
&emsp;graph go up and then down from time 20 to 200, remain at zero for 100 seconds, and then go<br>
&emsp;up and then down from time 300 to 600? Circle the best answer.<br>
&emsp;&emsp;**–** There are more Map tasks (M = 15,000) than there are machines.<br>
&emsp;&emsp;**–** There are more Reduce tasks (R = 4000) than there are machines.<br>
&emsp;&emsp;**–** There are more Map tasks than there are Reduce tasks.<br>
&emsp;&emsp;**–** The aggregate network throughput is smaller than the aggregate disk throughput.<br>
&emsp;&emsp;**–** The Map tasks consume more CPU time than the Reduce tasks.<br>
&emsp;**Answer:** The best answer is the second one (more Reduce tasks than machines). Intermedi-<br>
&emsp;ate data can only be moved from Map machines to Reduce machines for Reduce tasks that<br>
&emsp;have been allocated to machines. There are only 1800 machines, so at first only 1800 of the<br>
&emsp;4000 Reduce tasks are assigned to machines, so only about 1800/4000ths of the shuffles can<br>
&emsp;happen at first. That’s the first bump. The second bump starts once the first set of Reduce<br>
&emsp;tasks finishes, moving intermediate data to the machines that will run the remaining Reduces.<br>
&emsp;**4. \[7 points\]:** Why does the shuffle begin a long time before the Map phase has finished?<br>
&emsp;Circle the best answer.<br>
&emsp;&emsp;**–** There are more Map tasks (M = 15,000) than there are machines.<br>
&emsp;&emsp;**–** There are more Reduce tasks (R = 4000) than there are machines.<br>
&emsp;&emsp;**–** There are more Map tasks than there are Reduce tasks.<br>
&emsp;&emsp;**–** The aggregate network throughput is smaller than the aggregate disk throughput.<br>
&emsp;&emsp;**–** The Map tasks consume more CPU time than the Reduce tasks.<br>
&emsp;**Answer:** The best answer is the first one (more Map tasks than machines). Shuffles can start<br>
&emsp;as soon as Map functions finish. The system runs 1800 Maps at a time; the first of these<br>
&emsp;finishes a long time before the last of the 15,000 Maps finishes at time 200.

&emsp;**Name:**


---

<a id="page-5"></a>
**Page 5**

6.5840 Spring 2024, Exam 1   Page 5 of 21

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

<a id="page-6"></a>
**Page 6**

6.5840 Spring 2024, Exam 1   Page 6 of 21

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
&emsp;&emsp;**–** zy<br>
&emsp;**Answer:** xzy, yxz, xy, and yx. The result C4 receives can’t start with z (since the Az starts<br>
&emsp;after the Ax finishes); if both x and z appear, x must come first; and it must include both x<br>
&emsp;and y (since Ax and Ay both finish before the C4’s read starts).

&emsp;**Name:**


---

<a id="page-7"></a>
**Page 7**

6.5840 Spring 2024, Exam 1   Page 7 of 21

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
&emsp;&emsp;**–** xy<br>
&emsp;**Answer:** y and yx. The fact that C3 read y, and that C3’s read finished before C4’s read<br>
&emsp;started, means that C4’s result must include y, and, if it includes x, the x must come after y.

&emsp;**Name:**


---

<a id="page-8"></a>
**Page 8**

6.5840 Spring 2024, Exam 1   Page 8 of 21

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

&emsp;**Answer:** Both A and B are true; these are properties of Raft.

&emsp;**Name:**


---

<a id="page-9"></a>
**Page 9**

6.5840 Spring 2024, Exam 1   Page 9 of 21

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

**Answer:**   None of the above are true. **A** is false because the client’s cache that maps file names<br>
to chunk handles can yield stale results. **B** is false because the old design can continue despite one<br>
failure as well. **C** is false because Ben’s scheme moves data less efficiently (via the leader, rather<br>
than the separate data flow). **D** is false because the snapshot mechanism sends the leader’s entire<br>
database of chunks, which will likely take far longer than a few seconds.

&emsp;**Name:**


---

<a id="page-10"></a>
**Page 10**

6.5840 Spring 2024, Exam 1   Page 10 of 21

**IV**   **Raft**

Consider the Raft paper (Ongaro and Ousterhout’s In Search of an Understandable Consensus<br>
Algorithm (Extended Version)). Ben wonders what the impact of network behavior is on Raft’s<br>
performance. Ben runs a Raft-replicated server that receives many client requests. If the network<br>
delivers AppendEntries RPCs in order, Ben’s Raft implementation is fast (i.e., completes many<br>
client requests per second). But, if the network delivers AppendEntries frequently out of order,<br>
Ben’s Raft implementation performs badly (i.e., completes fewer client requests per second). Using<br>
the rules in Figure 2 explain why this is the case.

&emsp;**9. \[6 points\]:**

**Answer:**   This question is broken. Figure 2 implies that each AppendEntries should include all<br>
as-yet-unacknowledged log entries. So if there are two such RPCs outstanding, the one that was<br>
sent second contains a copy of all the log entries in the first. This means that, if the second RPC<br>
arrives first, it will be accepted. So it’s not clear why Ben would see any different performance due<br>
to out-of-order delivery.

&emsp;**Name:**


---

<a id="page-11"></a>
**Page 11**

6.5840 Spring 2024, Exam 1   Page 11 of 21

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

<a id="page-12"></a>
**Page 12**

6.5840 Spring 2024, Exam 1   Page 12 of 21

Ben argues that the line marked with “\*\*\*” could be replaced by a break statement so that the loop<br>
terminates immediately.

&emsp;**10. \[7 points\]:** Explain what could go wrong if one adopted Ben’s proposal; please include<br>
&emsp;a specific sequence of events to illustrate your answer.

**Answer:** If there’s a term mis-match, the leader won’t be able to commit any further log entries.<br>
The paper’s Figure 8e shows an example of such a scenario.

&emsp;**Name:**


---

<a id="page-13"></a>
**Page 13**

6.5840 Spring 2024, Exam 1   Page 13 of 21

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

<a id="page-14"></a>
**Page 14**

6.5840 Spring 2024, Exam 1   Page 14 of 21

&emsp;**11.**   **\[6 points\]:** Describe a specific sequence of events that would cause Alyssa’s imple-<br>
&emsp;mentation to break the safety guarantees provided by Raft.

**Answer:** The code shown can cause a peer to forget it has cast a vote for the current term. Suppose<br>
peer P1 has been elected for this term. The peers that elected it may forget that they voted for P1.<br>
Then some other peer P2 may become candidate for this term, and get votes from those forgetful<br>
peers, and become a second leader for the same term. This will lead to split brain.

&emsp;**Name:**


---

<a id="page-15"></a>
**Page 15**

6.5840 Spring 2024, Exam 1   Page 15 of 21

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

**Answer:** If a server is elected as coordinator, and then fails, ZooKeeper automatically deletes the<br>
ephemeral /coord-lock; now another server can create that file and become coordinator.

&emsp;**Name:**


---

<a id="page-16"></a>
**Page 16**

6.5840 Spring 2024, Exam 1   Page 16 of 21

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

&emsp;**Answer:**   B0 A0 and B0 A2 are the only possible results. B0 is possible because, in the<br>
&emsp;absence of other constraints, ZooKeeper can yield stale data to reads. A1 is never possible<br>
&emsp;because ZooKeeper terminated S1’s session before ZooKeeper receive S1’s setData()s, so<br>
&emsp;ZooKeeper ignore those setData()s. B2 A0 is not possible since, once ZooKeeper has re-<br>
&emsp;vealed a write to a client, the “Linearizable writes” guarantee in Section 2.3 implies that all<br>
&emsp;previous writes have been applied.

&emsp;**Name:**


---

<a id="page-17"></a>
**Page 17**

6.5840 Spring 2024, Exam 1   Page 17 of 21

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

&emsp;**14. \[7 points\]:** Explain why this modification can result in non-linearizable reads.<br>
&emsp;**Answer:** If a Grove backup server reveals an update without waiting to ensure it has been<br>
&emsp;committed, then it may reveal an uncommitted write. If the primary then fails, the backup<br>
&emsp;whose database is used to recover may not have recent uncommitted writes. So the write<br>
&emsp;may disappear, and other clients issuing strictly subsequent reads may not see that write.<br>
&emsp;That would not be linearizable.

&emsp;**Name:**


---

<a id="page-18"></a>
**Page 18**

6.5840 Spring 2024, Exam 1   Page 18 of 21

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
&emsp;serializable (incorrect) results.<br>
&emsp;**Answer:**   The TC may have decided to commit the transaction, and sent out COMMIT<br>
&emsp;messages to the other participating workers, and they may have committed, and revealed<br>
&emsp;committed results to other transactions. At that point, there is no way to back out of the<br>
&emsp;transaction without violating serializability and atomicity.

&emsp;**Name:**


---

<a id="page-19"></a>
**Page 19**

6.5840 Spring 2024, Exam 1   Page 19 of 21

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

&emsp;&emsp;&emsp;**Lecture**   **Count**<br>
&emsp;&emsp;&emsp;MapReduce   76<br>
&emsp;&emsp;&emsp;RPC, Threads, and Go   50<br>
&emsp;&emsp;&emsp;Linearizability   64<br>
&emsp;&emsp;&emsp;GFS   60<br>
**Answer:**<br>
&emsp;&emsp;&emsp;Raft   93<br>
&emsp;&emsp;&emsp;ZooKeeper   55<br>
&emsp;&emsp;&emsp;Q+A on Lab 3A/3B   27<br>
&emsp;&emsp;&emsp;Grove   22<br>
&emsp;&emsp;&emsp;Transactions   48

&emsp;**Name:**


---

<a id="page-20"></a>
**Page 20**

6.5840 Spring 2024, Exam 1   Page 20 of 21

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

&emsp;&emsp;&emsp;**Lecture**   **Count**<br>
&emsp;&emsp;&emsp;MapReduce   5<br>
&emsp;&emsp;&emsp;RPC, Threads, and Go   13<br>
&emsp;&emsp;&emsp;Linearizability   10<br>
&emsp;&emsp;&emsp;GFS   7<br>
**Answer:**<br>
&emsp;&emsp;&emsp;Raft   0<br>
&emsp;&emsp;&emsp;ZooKeeper   9<br>
&emsp;&emsp;&emsp;Q+A on Lab 3A/3B   33<br>
&emsp;&emsp;&emsp;Grove   51<br>
&emsp;&emsp;&emsp;Transactions   7

&emsp;**Name:**


---

<a id="page-21"></a>
**Page 21**

6.5840 Spring 2024, Exam 1   Page 21 of 21

&emsp;**18. \[1 points\]:** What can we do to improve the course?

&emsp;&emsp;&emsp;**General feedback**   **Count**<br>
&emsp;&emsp;&emsp;Fine   8<br>
&emsp;&emsp;&emsp;More OH   7<br>
&emsp;&emsp;&emsp;Overview/motivation of all covered papers/systems   6<br>
&emsp;&emsp;&emsp;More visual diagrams   4<br>
&emsp;&emsp;&emsp;More on real-world and modern systems   4<br>
&emsp;&emsp;&emsp;Publish lecture question answers   4<br>
&emsp;&emsp;&emsp;More exercises on papers   3<br>
&emsp;&emsp;&emsp;More distributed systems theory   2<br>
&emsp;&emsp;&emsp;Raft lecture too close to 2A deadline   2<br>
&emsp;&emsp;&emsp;More responsive on Piazza   1<br>
&emsp;&emsp;&emsp;More lecture questions   1<br>
&emsp;&emsp;&emsp;More collaboration   1<br>
&emsp;&emsp;&emsp;Extra credit for project   1<br>
&emsp;&emsp;&emsp;More implementation details on papers   1<br>
&emsp;&emsp;&emsp;More support for Harvard students   1<br>
**Answer:**   Discuss other concurrency features (e.g. async/await)   1<br>
&emsp;&emsp;&emsp;Linearizability lecture earlier   1<br>
&emsp;&emsp;&emsp;Curate FAQs   1<br>
&emsp;&emsp;&emsp;Make pre-lecture quesitons optional   1

&emsp;&emsp;&emsp;**Lab-related feedback**   **Count**<br>
&emsp;&emsp;&emsp;Better debugging for labs   16<br>
&emsp;&emsp;&emsp;Less lab dependency   8<br>
&emsp;&emsp;&emsp;More lab QA/recitation   7<br>
&emsp;&emsp;&emsp;Stronger tests for labs   6<br>
&emsp;&emsp;&emsp;More tutorials/FAQ on Go   3<br>
&emsp;&emsp;&emsp;Clearer instruction on labs   2<br>
&emsp;&emsp;&emsp;Better windows support   2<br>
&emsp;&emsp;&emsp;Weight labs more in grading   2<br>
&emsp;&emsp;&emsp;Spread labs out across papers (instead of all being raft-based)   2<br>
&emsp;&emsp;&emsp;More specific lab difficulty labels   1<br>
&emsp;&emsp;&emsp;Post all labs at the start   1<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;End of Exam I

&emsp;**Name:**

