# MIT 6.824/6.5840 2025: Quiz 2: Official solutions

> Copied from the original: <https://pdos.csail.mit.edu/6.824/quizzes.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

6.5840 Spring 2025, Exam II   Page 1 of 18


![Figure on page 1](figures/solutions-p01-fig01.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Department of Electrical Engineering and Computer Science<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;MASSACHUSETTS INSTITUTE OF TECHNOLOGY

&emsp;&emsp;&emsp;**6.5840 Distributed System Engineering: Spring 2025**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Exam II**

Please write your name on the bottom of each page. You have 120 minutes to complete this exam.<br>
Some questions may be much harder than others. Read them all through first and attack them in<br>
the order that allows you to make the most progress. If you find a question ambiguous, write down<br>
any assumptions you make. Write neatly. In order to receive full credit you must answer each<br>
question as precisely as possible.<br>
You may use class notes, papers, and lab material. You may read them on your laptop, but you<br>
are not allowed to use any network. For example, you may not look at web sites, use ChatGPT, or<br>
communicate with anyone.<br>
The maximum number points available is 76.

**Gradescope E-Mail Address:**

&emsp;**Name:**


---

<a id="page-2"></a>
**Page 2**

6.5840 Spring 2025, Exam II   Page 2 of 18<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Grade statistics for Exam 2

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;max=   74.5<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;median   =   60.5<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;µ   =   58.95<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;σ   =   7.22

&emsp;**Name:**


---

<a id="page-3"></a>
**Page 3**

6.5840 Spring 2025, Exam II   Page 3 of 18

**I**   **FaRM**

Consider the following statements about FaRM as described in No compromises: distributed trans-<br>
actions with consistency, availability, and performance. For each statement, circle True or False.

&emsp;**1. \[8 points\]:**<br>
&emsp;**True / False** : Short leases are important for FaRM, because FaRM must reconfigure to<br>
&emsp;remove a failed replica of a region before FaRM can continue to use the region.

&emsp;**True / False** : For small messages RDMA performs 4× better than RPC because the CPU is<br>
&emsp;a performance bottleneck for RPCs.

&emsp;**True / False** : To obtain write locks FaRM uses RDMA writes so that the destination ma-<br>
&emsp;chine’s CPU doesn’t have to do any work on a lock request.

&emsp;**True / False** : For the TATP workload the median latency on the left end of the graph is 9 mi-<br>
&emsp;croseconds (see Figure 7), rather than the 19 microsecond mean commit latency mentioned<br>
&emsp;in Section 6.3, because not all operations update multiple rows.<br>
&emsp;**Answer:** 1. True, since FaRM uses primary-backup replication instead of Paxos/Raft and<br>
&emsp;all replicas of a chunk must be up for FaRM to be able to continue using the chunk. 2.<br>
&emsp;True; see Figure 3. False; in this case FaRM uses RDMA to implement RPC, which runs<br>
&emsp;locking code on the destination machine. 4. True; see description of TATP workload and the<br>
&emsp;explanation for the left-end of the graph.

&emsp;**Name:**


---

<a id="page-4"></a>
**Page 4**

6.5840 Spring 2025, Exam II   Page 4 of 18

**II**   **Chardonnay**

Answer these questions with reference to Chardonnay: Fast and General Datacenter Transactions<br>
for On-Disk Databases by Eldeeb et al.

&emsp;**2.**   **\[3 points\]:** Section 6.1 says that all of a read-write transaction’s writes are tagged<br>
&emsp;with a version containing the same epoch number. For example, if a read-write transaction<br>
&emsp;executes at around the time the Epoch Service changes the epoch from 20 to 21, either all the<br>
&emsp;transaction’s updated records should have a VID prefixed with 20, or all should be prefixed<br>
&emsp;with 21, but not a mix of the two. Explain briefly why having the same epoch number in all<br>
&emsp;the written items’ versions is important for correctness.<br>
&emsp;**Answer:** A read-only (snapshot) transaction must see record versions that, for every read-<br>
&emsp;write transaction, either reflect all of that read-write transaction’s writes, or none. Chardon-<br>
&emsp;nay’s strategy is for read-only transactions to read a snapshot as of the end of some epoch.<br>
&emsp;This only works if every read-write transaction’s writes appear all in the same epoch, and are<br>
&emsp;not spread over multiple epochs.

&emsp;**3.**   **\[3 points\]:** Section 6.1 describes how a transaction chooses a version ID (VID): it is<br>
&emsp;the current epoch, with a counter appended. Suppose, instead, that version IDs were just<br>
&emsp;the current epoch (with nothing appended). Briefly explain how this change could cause<br>
&emsp;snapshot reads to yield incorrect (non-serializable) values.<br>
&emsp;**Answer:** Read-only (snapshot) transactions would not be able to tell which version was the<br>
&emsp;last one in an epoch, and thus might read a mix of versions from early and late in the epoch.

&emsp;**4. \[3 points\]:** Section 8 says that the locks for a transaction are acquired one at a time using<br>
&emsp;a “chain” technique. It would be faster if the client sent out all the lock requests in parallel.<br>
&emsp;Briefly explain why sending a transaction’s lock request messages in parallel would be a bad<br>
&emsp;idea.<br>
&emsp;**Answer:** The purpose of acquiring the locks one at a time is to ensure that they are acquired<br>
&emsp;in a deadlock-avoiding order. Sending out the requests in parallel would not ensure that, and<br>
&emsp;could lead to deadlock.

&emsp;**Name:**


---

<a id="page-5"></a>
**Page 5**

6.5840 Spring 2025, Exam II   Page 5 of 18

**III**   **Grove**

Consider “Grove: a separation-logic library for verifying distributed systems” by Sharma et al. For<br>
each statement, circle True or False.

&emsp;**5. \[8 points\]:**<br>
&emsp;**True / False** : Because any replica in Grove can serve a Get request, Grove achieves higher<br>
&emsp;throughput for Get’s than for Put’s (see Figure 19), but sacrifices linearizability for Get’s.

&emsp;**True / False** : If a response to a Get is lost, the Grove exactlyonce library will resend the<br>
&emsp;Get, which the server executes again and the second response may contain a different value<br>
&emsp;than the first (but lost) response contained.

&emsp;**True / False** : If the Go code for vKV had a bug that caused a backup to lose the effect of a<br>
&emsp;Put after a crash, then Grove’s specification and proof would catch this bug.

&emsp;**True / False** : If the configservice had an infinite loop that caused Reconfigure to<br>
&emsp;never return, then this bug would be caught by Grove’s specification and proof.

**Answer:**   1. False; Grove doesn’t sacrifice linearizability for reads from backups. 2. True; for<br>
example, if a Put happened between the first and second Get (but it doesn’t matter for correctness).<br>
3\. True; that is a safety property that Grove’s specification and proof capture. False; Grove doesn’t<br>
prove liveness properties.

&emsp;**Name:**


---

<a id="page-6"></a>
**Page 6**

6.5840 Spring 2025, Exam II   Page 6 of 18

**IV**   **DynamoDB Transactions**

With respect to Distributed Transactions at Scale in Amazon DynamoDB by Idziorek et al., imagine<br>
that a read-only transaction (TransactGetItems) and a read-write transaction (TransactWriteItems)<br>
execute concurrently. The read-write transaction updates multiple items stored on different storage<br>
nodes; the read-only transaction reads the same set of items. Serializability requires that the read-<br>
only transaction see all of the items as they were before the read-write transaction, or all as they<br>
are after the read-write transaction (but not a mix of before and after).

&emsp;**6. \[5 points\]:** For the above scenario, which mechanisms help to ensure this all-before or<br>
&emsp;all-after property? Refer to the design as described in the paper’s Sections 2 and 3 (but not<br>
&emsp;Section 4). Circle all that apply.

&emsp;&emsp;**A.** The item.timestamp \< input.timestamp check in Listing 3.<br>
&emsp;&emsp;**B.** Multiple time-stamped versions stored for each key.<br>
&emsp;&emsp;**C.** Log sequence numbers (LSNs).<br>
&emsp;&emsp;**D.** Two-phase locking.<br>
&emsp;&emsp;**E.** item.ongoingTransactions

&emsp;**Answer: C** and **E** are correct. **A** is not correct because read-only transactions do not involve<br>
&emsp;the time-stamps. **B** is not correct because DynamoDB doesn’t store multiple versions of a<br>
&emsp;given record. **D** is not correct because read-only transactions don’t use two-phase locking.

&emsp;**Name:**


---

<a id="page-7"></a>
**Page 7**

6.5840 Spring 2025, Exam II   Page 7 of 18

**V**   **AWS Lambda**

Consider the paper, and guest lecture about, On-demand container loading in AWS Lambda by<br>
Brooker et al. For each of the following statements, indicate whether it is true or false.

&emsp;**7. \[8 points\]:**<br>
&emsp;**True / False** : AWS Lambda is attractive to customers because the customer can spawn many<br>
&emsp;lambdas in response to a load spike without having to provision machines in advance.

&emsp;**True / False** : Replication of chunks in the AZ-level cache is important to ensure that chunks<br>
&emsp;are not lost forever when a cache node fails.

&emsp;**True / False** : Erasure coding of cached chunks helps improve tail latency, because a worker<br>
&emsp;can reconstruct a chunk without having to download all stripes of the chunk.

&emsp;**True / False** : The convergent encryption scheme described in Section 3.1 helps protect<br>
&emsp;against an attacker who compromises a worker and attempts to read containers of any cus-<br>
&emsp;tomer.

**Answer:** 1. True; customers can spawn many Lambdas in response to a spike in load. 2. False;<br>
AWS Lambda replicates for low latency instead of durability. 3. True; erasure coding allows the<br>
client to reconstruct the data with a few stripes without having to wait for all stripes. 4. True; the<br>
goal is that a worker can access only the data that it needs to run the function sent to it, but because<br>
“any” is ambiguous we accepted False too.

&emsp;**Name:**


---

<a id="page-8"></a>
**Page 8**

6.5840 Spring 2025, Exam II   Page 8 of 18

**VI**   **Lab 4**

Ben Bitdiddle is implementing the rsm package from Lab 4. He uses a shared reply table to<br>
implement communication between the rsm’s Submit() method and the reader goroutine. The<br>
reply table maps a completed operation’s id to its reply from DoOp(). In addition, rsm contains<br>
a nextId field that is initialized to 0 and is incremented by 1 each time Submit() is called.<br>
His code takes the following steps:

**A.** The kvraft server calls rsm.Submit() with a client request req.<br>
**B.** Submit() increments rsm.nextId, packs the request into a new operation Op{id:<br>
&emsp;rsm.nextId, req:   req}, and calls rsm.rf.Start() with the Op. If rsm.rf.Start()<br>
&emsp;indicates that the current peer is the Raft leader, it then waits for the reply table to contain a<br>
&emsp;reply under the key Op.id (the one passed to Start()).<br>
**C.** When the rsm’s reader goroutine receives an ApplyMsg from the applyCh, it calls DoOp(),<br>
&emsp;then populates the reply table with the result from DoOp() under key Op.id.<br>
**D.** When Submit() sees the Op.id key in the reply table, it deletes the Op.id key/value<br>
&emsp;pair from the reply table and returns the corresponding reply.

Assume that all omitted parts of Ben’s design are correct.

&emsp;**8. \[5 points\]:** Ben notices that his implementation can result in incorrect behavior. Explain<br>
&emsp;why.<br>
&emsp;**Answer:**   Each peer will, when it is leader, assign operations IDs starting with ID zero.<br>
&emsp;Thus, if there is a change in leader, the new leader may assign IDs to new operations that are<br>
&emsp;the same as IDs being waited for by Submit()s in the old leader, but the operations are<br>
&emsp;different. So clients may receive responses for the wrong operations.

&emsp;**Name:**


---

<a id="page-9"></a>
**Page 9**

6.5840 Spring 2025, Exam II   Page 9 of 18

**VII**   **Ray**

Consider the following Ray program, which creates a sqrt task task for each number in the list<br>
mylist. The creation yields a DFut and the caller waits for the tasks to complete by calling get<br>
on each future. The code is as follows:

\# A call to sqrt\_task yields a DFut<br>
@ray.remote<br>
def sqrt\_task(n):<br>
\# sqrt is a python function, which returns the square root of its argument<br>
return sqrt(n)

@ray.remote<br>
def sum\_task(f):<br>
\# sum is a python function, which takes a future and returns the sum<br>
l = get(f)   # collect the list l<br>
return sum(l)   # return the sum of the numbers in list l

\# A call to sqrt\_list\_task yields a shared DFut<br>
@ray.remote<br>
def sqrt\_list\_task(n\_list):<br>
\# start tasks and collect futures<br>
l = \[ \]   # list holding DFuts<br>
for i in n\_list:   # iterate over list of numbers<br>
&emsp;l.append(sqrt\_task(i))

r = \[ \]<br>
for f in l:<br>
&emsp;r.append(get(f))   # collect the result

return r   # return a SharedDFut for r

\# invoke sqrt\_list\_task with a large list of numbers, sum, and print result<br>
f = sqrt\_list\_task(mylist)<br>
s = sum\_task(f)<br>
print(s)

&emsp;**Name:**


---

<a id="page-10"></a>
**Page 10**

6.5840 Spring 2025, Exam II   Page 10 of 18

Assume Ray behaves in the way described in Ownership: a distributed futures system for fine-<br>
grained tasks by Wang et al., and Ray is running on a cluster of computers.<br>
For each of the following statements, indicate whether it is true or false.

&emsp;**9. \[8 points\]:**<br>
&emsp;**True / False** : a Ray worker may start running sum task before sqrt list task has<br>
&emsp;finished

&emsp;**True / False** : the driver that invokes sum task receives the list with square-rooted numbers<br>
&emsp;from the worker that ran sqrt list task.

&emsp;**True / False** : the driver is the owner for each future that sqrt task returns.

&emsp;**True / False** : the driver is the owner for the shared future returned by sqrt list task.

**Answer:**   1.   True, since remote invocations are asynchronous.   2.   False; the worker run-<br>
ning sum task will fetch the data from the worker that ran sqrt list task. 3. False; the<br>
worker who runs sqrt list task is the owner of these futures; 4. True; the driver starts<br>
sqrt list task and is thus the owner.

&emsp;**Name:**


---

<a id="page-11"></a>
**Page 11**

6.5840 Spring 2025, Exam II   Page 11 of 18

**VIII**   **SUNDR**

Consider the straw-man design in the paper Secure Untrusted Data Repository (SUNDR) by Li et<br>
al.<br>
In the straw-man design, a client asks the server to append a “fetch” operation to the history after<br>
reading the history. Each client also remembers the most recent operation it has appended to<br>
the history. One reason for these mechanisms is to prevent the server from first showing some<br>
operations to the client, and then later hiding those operations.<br>
Suppose one modified the SUNDR straw-man protcol in three ways. First, eliminate “fetch” op-<br>
erations, so that the history only includes modify operations. Second, have each client remember<br>
the last entry in the most recent history the client obtained from the server; call this remembered<br>
entry ELAST. Third, each client checks that ELAST is present in the next history it obtains from<br>
the server. With these modifications, a client can still detect a situation in which the server first<br>
shows an operation to a client, and then omits that operation in a later history shown to the same<br>
client.

&emsp;**10.**   **\[5 points\]:** It turns out this modification is a bad idea. Explain briefly how this<br>
&emsp;modification would allow a malicious server to violate fork consistency.<br>
&emsp;**Answer:** Suppose the last two entries in the (correct) history are E1 followed by E2. When<br>
&emsp;client C1 asks for the history, the SUNDR server could return the history just through E1,<br>
&emsp;omitting E2. C1 would then remember E1 as its ELAST. This is a fork (and is allowed by fork<br>
&emsp;consistency) because C1 isn’t seeing the complete history. When C1 next asks the SUNDR<br>
&emsp;server for the history, the SUNDR server could return the complete history, including E2.<br>
&emsp;C1 would accept this history because ELAST (=E1) is present and all other checks pass<br>
&emsp;(e.g. E1’s and E2’s signatures over the preceding history will validate). At this point the<br>
&emsp;fork has been healed (since C1 sees the previously concealed E2); this is a violation of fork<br>
&emsp;consistency. Note that every entry (including whatever is in ELAST) has a signature over the<br>
&emsp;entire preceding history, and the client checks all of these signatures every time it obtains a<br>
&emsp;history from the SUNDR server, so the SUNDR server cannot successfully change anything<br>
&emsp;in the history before a client’s ELAST.

&emsp;**Name:**


---

<a id="page-12"></a>
**Page 12**

6.5840 Spring 2025, Exam II   Page 12 of 18

**IX**   **Bitcoin**

Bitcoin: A Peer-to-Peer Electronic Cash System, by Nakamoto, mentions in Section 4 that the<br>
cryptographic hash of a valid block must start with a certain number of zero bits. Assume that the<br>
hash algorithm is SHA-256, which returns a 256-bit hash.

&emsp;**11. \[3 points\]:** You are trying to mine a new block. The required number of zero bits is<br>
&emsp;seven. You set the block’s 32-bit nonce field to a random value, and compute the SHA-256<br>
&emsp;hash of the block. What’s the probability that the first seven bits of the hash are zeros? Circle<br>
&emsp;the one best answer.

&emsp;&emsp;**A.** 1/2<br>
&emsp;&emsp;**B.** 1/7<br>
&emsp;&emsp;**C.** 1/128<br>
&emsp;&emsp;**D.** 1/256<br>
&emsp;&emsp;**E.** 1/249<br>
&emsp;&emsp;**F.** 1/(232)

&emsp;**Answer: C** (1/128) is correct.

&emsp;**Name:**


---

<a id="page-13"></a>
**Page 13**

6.5840 Spring 2025, Exam II   Page 13 of 18

Ben runs a Bitcoin node. A few hours ago Ben’s node learned about block B747, which is a valid<br>
block. Ben sees a transaction T27 in B747 that pays some money to a certain public key, signed by<br>
the correct private key. Ben would like to steal the money involved in T27. He modifies his copy<br>
of block B747 so that the payee’s public key in T27 is Ben’s own public key. He doesn’t change<br>
anything else in B747. He modifies his Bitcoin node software to announce the block to other nodes<br>
as if it were a valid block.

&emsp;**12. \[3 points\]:** Which of the following will cause other Bitcoin nodes to decide that Ben’s<br>
&emsp;B747 is invalid? Circle all that apply.

&emsp;&emsp;**A.** The “Prev Hash” field in the next block in the chain doesn’t refer to Ben’s B747.<br>
&emsp;&emsp;**B.** Other peers will already know about the real B747.<br>
&emsp;&emsp;**C.** The “Prev Hash” field in Ben’s B747 isn’t valid.<br>
&emsp;&emsp;**D.** The hash of Ben’s B747 won’t start with enough zeroes.<br>
&emsp;&emsp;**E.** The signature in T27 in Ben’s B747 isn’t correct.

&emsp;**Answer: D** and **E** are correct. **A** and **B** are not correct: peers have to at least temporarily<br>
&emsp;accept otherwise-valid blocks with no successor because they might turn out to be the start<br>
&emsp;of a new winning fork. **C** is not correct because Ben didn’t modify the Prev Hash field, so it<br>
&emsp;continues to refer to the predecessor of the original B747. **D** is correct because modifying the<br>
&emsp;block will modify its cryptographic hash; the real B747’s hash started with enough zeroes,<br>
&emsp;but a modified B747 is fantastically unlikely to happen also to start with enough zeroes. **E** is<br>
&emsp;correct because the signature was correct for T27’s original payee public key, so the signature<br>
&emsp;won’t be correct with Ben as the payee.

Now Ben is designing a new crypto-currency system, identical to Bitcoin, except with a different<br>
agreement scheme to resolve forks in the block-chain: instead of the longest fork winning, nodes<br>
compute the hash of the last block in each fork, and the fork with the lowest last-block hash value<br>
wins. Ben reasons that all nodes will compute the same hashes, and thus all nodes will agree about<br>
which fork wins.

&emsp;**13. \[3 points\]:** Why is Ben’s fork-resolution idea a disaster? Explain briefly.<br>
&emsp;**Answer:**   In real Bitcoin, if an attacker wants to eliminate a transaction that occurs many<br>
&emsp;blocks in the past by creating a fork from before that transaction, the attacker has to sustain a<br>
&emsp;block mining rate faster than the main chain long enough to catch up, which requires compute<br>
&emsp;power believed to be too expensive for most attackers. But with Ben’s scheme, an attacker<br>
&emsp;only needs to mine a single block that happens to have a hash smaller than the corresponding<br>
&emsp;block in the main chain; then all nodes will switch to the attacker’s new short fork. The<br>
&emsp;attacker needs relatively little compute power to mine this single block.

&emsp;**Name:**


---

<a id="page-14"></a>
**Page 14**

6.5840 Spring 2025, Exam II   Page 14 of 18

**X**   **PBFT**

Consider the PBFT protocol as described in the paper Practical Byzantine Fault Tolerance by<br>
Castro and Liskov.<br>
For each of the following statements, indicate whether it is true or false.

&emsp;**14. \[6 points\]:**<br>
&emsp;**True / False** : Assume all replicas of a PBFT-replicated system are running the same software<br>
&emsp;and the software has a bug. If an attacker exploits this bug in all replicas to control each<br>
&emsp;replica, then the attacker can commit arbitrary operations in the log.

&emsp;**True / False** : If an attacker controls the primary of a PBFT-replicated system, then the<br>
&emsp;attacker can commit arbitrary operations in the log.

&emsp;**True / False** : Honest replicas must include in a VIEW-CHANGE the messages already<br>
&emsp;prepared so that a new primary cannot omit already-committed operations.<br>
&emsp;**Answer:** 1. True; PBFT doesn’t guarantee correctness if more than f machines are compro-<br>
&emsp;mised. 2. False; the attacker must control more than f machines to be able to compromise<br>
&emsp;PBFT; 3. True; see protocol description.

&emsp;**15. \[2 points\]:** If there are 10 machines in our system, and at most 2 machines are malicious,<br>
&emsp;how many REPLY messages does a client need to receive before it knows its operation was<br>
&emsp;executed? (Circle best answer)<br>
&emsp;&emsp;**A.** 1<br>
&emsp;&emsp;**B.** 3<br>
&emsp;&emsp;**C.** 4<br>
&emsp;&emsp;**D.** 6<br>
&emsp;&emsp;**E.** 7<br>
&emsp;**Answer:**   B: f+1, where f = 2; as stated in the paper, we only need to guarantee that one<br>
&emsp;honest replica voted REPLY.

&emsp;**Name:**


---

<a id="page-15"></a>
**Page 15**

6.5840 Spring 2025, Exam II   Page 15 of 18

**XI**   **6.5840**

&emsp;**16. \[1 points\]:** Which lectures/papers should we **omit** in future years?<br>
&emsp;&emsp;**–** FaRM **(4)**<br>
&emsp;&emsp;**–** Chardonnay **(11)**<br>
&emsp;&emsp;**–** Grove **(85)**<br>
&emsp;&emsp;**–** Memcache at Facebook **(7)**<br>
&emsp;&emsp;**–** DynamoDB **(25)**<br>
&emsp;&emsp;**–** AWS Lambda **(19)**<br>
&emsp;&emsp;**–** Ray **(14)**<br>
&emsp;&emsp;**–** SUNDR **(8)**<br>
&emsp;&emsp;**–** Bitcoin **(4)**<br>
&emsp;&emsp;**–** PBFT **(12)**

&emsp;**17. \[1 points\]:** Porcupine, the linearizability checker used in the labs, comes with a visu-<br>
&emsp;alizer that displays in a web browser the entire history of client and tester operations. Circle<br>
&emsp;the one closest to your experience with the visualizer.<br>
&emsp;&emsp;**–** I haven’t used it for debugging. **(10)**<br>
&emsp;&emsp;**–** I’ve tried using it, but it wasn’t helpful in my case. **(27)**<br>
&emsp;&emsp;**–** I’ve read the visualization, and it occasionally helped me identify the issue in my code.<br>
&emsp;&emsp;&emsp;**(78)**<br>
&emsp;&emsp;**–** I’ve read the visualization, and it often helped me identify the issue in my code. **(15)**<br>
&emsp;&emsp;**–** I’ve added my own annotations, and it enhanced my debugging experience. **(18)**<br>
&emsp;&emsp;**–** Other (please briefly describe your experience): **(3)**

&emsp;**18. \[1 points\]:** Do you have any feedback for us about 6.5840?

**Lectures and Notes.**

&emsp;• Easier-to-read/clearer lecture notes/slides (7)<br>
&emsp;• Lecture notes are helpful (1)

&emsp;**Name:**


---

<a id="page-16"></a>
**Page 16**

6.5840 Spring 2025, Exam II   Page 16 of 18

&emsp;• Recording lectures (4)<br>
&emsp;• Guest lectures interesting but lacking depth (1)<br>
&emsp;• Like Grove (1)<br>
&emsp;• Like Lambda lecture, less so about Dynamo (1)<br>
&emsp;• Love guest lectures (2)<br>
&emsp;• Some guest lecture notes or slides are missing (1)<br>
&emsp;• More notes for Lambda and Dynamo (1)<br>
&emsp;• Adding lecture reading group/recitation (2)<br>
&emsp;• Big picture example/tie everything together (2)

**Labs—Content and Design.**

&emsp;• Less cumulative/dependent labs (12)<br>
&emsp;• Labs more connected to lectures (2)<br>
&emsp;• More diversive labs (3)<br>
&emsp;• Bitcoin lab (1)<br>
&emsp;• Bring back Spark (1)<br>
&emsp;• Good Raft implementation at the end (1)<br>
&emsp;• Release Raft lab solution (so can build off lab 4/5 with correct Raft) (4)<br>
&emsp;• Less Raft (4)

**Labs—Debugging and Support.**

&emsp;• Better error messages for labs (1)<br>
&emsp;• Better debugging experience for lab 4 and 5 (1)<br>
&emsp;• Extra debugging tools (4)<br>
&emsp;• Ways to debug common bugs in labs (1)<br>
&emsp;• Annoying bugs in tester (1)

&emsp;**Name:**


---

<a id="page-17"></a>
**Page 17**

6.5840 Spring 2025, Exam II   Page 17 of 18

&emsp;• More help on catching up previous labs (1)

**Labs—Logistics.**

&emsp;• Lab for writing test cases for 5D (1)<br>
&emsp;• Clearly communicate how to do/submit 5D (1)<br>
&emsp;• Split lab 5B/C due date (1)<br>
&emsp;• Lab checkoffs (1)<br>
&emsp;• Solution after lab deadline (1)<br>
&emsp;• Extra credit for labs (2)<br>
&emsp;• Labs worth more points (1)

**TAs, OHs, and Support.**

&emsp;• More OHs (9)<br>
&emsp;• More TA per OHs (4)<br>
&emsp;• More TAs (6)<br>
&emsp;• More late hours (2)<br>
&emsp;• More support/bug fixes for WSL (1)<br>
&emsp;• Lab hour suggestions (1)

**Exams and Grading.**

&emsp;• Classroom not big enough for exams (1)<br>
&emsp;• No 9am exams (1)<br>
&emsp;• Less true/false exam questions (1)<br>
&emsp;• Less multiple-choice questions on exams (1)<br>
&emsp;• Exam too hard (2)

**Readings.**

&emsp;**Name:**


---

<a id="page-18"></a>
**Page 18**

6.5840 Spring 2025, Exam II   Page 18 of 18

&emsp;• Release answers to reading questions (1)<br>
&emsp;• Papers interesting but isolated (1)<br>
&emsp;• More background materials for reading (1)<br>
&emsp;• Some of the papers too dense (1)<br>
&emsp;• More visualizations for the readings (1)<br>
&emsp;• Weekly quizzes (1)<br>
&emsp;• Fewer papers (1)

**Topics and Content Requests.**

&emsp;• Would be useful to understand Paxos before learning Raft (1)<br>
&emsp;• More paper questions (1)<br>
&emsp;• More AI/LLM systems (1)<br>
&emsp;• Explain linearizability more (1)<br>
&emsp;• Practice problems (1)

**Miscellaneous.**

&emsp;• Final project guidelines more specific (1)<br>
&emsp;• Recitations (3)<br>
&emsp;• Custom Porcupine colors (1)<br>
&emsp;• More units (1)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;End of Exam II

&emsp;**Name:**

