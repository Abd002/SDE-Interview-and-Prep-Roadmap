# MIT 6.824/6.5840 2025: Quiz 2: Questions

> Copied from the original: <https://pdos.csail.mit.edu/6.824/quizzes.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

6.5840 Spring 2025, Exam II   Page 1 of 14


![Figure on page 1](figures/questions-p01-fig01.png)

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

6.5840 Spring 2025, Exam II   Page 2 of 14

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
&emsp;in Section 6.3, because not all operations update multiple rows.

&emsp;**Name:**


---

<a id="page-3"></a>
**Page 3**

6.5840 Spring 2025, Exam II   Page 3 of 14

**II**   **Chardonnay**

Answer these questions with reference to Chardonnay: Fast and General Datacenter Transactions<br>
for On-Disk Databases by Eldeeb et al.

&emsp;**2.**   **\[3 points\]:** Section 6.1 says that all of a read-write transaction’s writes are tagged<br>
&emsp;with a version containing the same epoch number. For example, if a read-write transaction<br>
&emsp;executes at around the time the Epoch Service changes the epoch from 20 to 21, either all the<br>
&emsp;transaction’s updated records should have a VID prefixed with 20, or all should be prefixed<br>
&emsp;with 21, but not a mix of the two. Explain briefly why having the same epoch number in all<br>
&emsp;the written items’ versions is important for correctness.

&emsp;**3.**   **\[3 points\]:** Section 6.1 describes how a transaction chooses a version ID (VID): it is<br>
&emsp;the current epoch, with a counter appended. Suppose, instead, that version IDs were just<br>
&emsp;the current epoch (with nothing appended). Briefly explain how this change could cause<br>
&emsp;snapshot reads to yield incorrect (non-serializable) values.

&emsp;**4. \[3 points\]:** Section 8 says that the locks for a transaction are acquired one at a time using<br>
&emsp;a “chain” technique. It would be faster if the client sent out all the lock requests in parallel.<br>
&emsp;Briefly explain why sending a transaction’s lock request messages in parallel would be a bad<br>
&emsp;idea.

&emsp;**Name:**


---

<a id="page-4"></a>
**Page 4**

6.5840 Spring 2025, Exam II   Page 4 of 14

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

&emsp;**Name:**


---

<a id="page-5"></a>
**Page 5**

6.5840 Spring 2025, Exam II   Page 5 of 14

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

&emsp;**Name:**


---

<a id="page-6"></a>
**Page 6**

6.5840 Spring 2025, Exam II   Page 6 of 14

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

&emsp;**Name:**


---

<a id="page-7"></a>
**Page 7**

6.5840 Spring 2025, Exam II   Page 7 of 14

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
&emsp;why.

&emsp;**Name:**


---

<a id="page-8"></a>
**Page 8**

6.5840 Spring 2025, Exam II   Page 8 of 14

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

<a id="page-9"></a>
**Page 9**

6.5840 Spring 2025, Exam II   Page 9 of 14

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

&emsp;**Name:**


---

<a id="page-10"></a>
**Page 10**

6.5840 Spring 2025, Exam II   Page 10 of 14

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
&emsp;modification would allow a malicious server to violate fork consistency.

&emsp;**Name:**


---

<a id="page-11"></a>
**Page 11**

6.5840 Spring 2025, Exam II   Page 11 of 14

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

&emsp;**Name:**


---

<a id="page-12"></a>
**Page 12**

6.5840 Spring 2025, Exam II   Page 12 of 14

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

Now Ben is designing a new crypto-currency system, identical to Bitcoin, except with a different<br>
agreement scheme to resolve forks in the block-chain: instead of the longest fork winning, nodes<br>
compute the hash of the last block in each fork, and the fork with the lowest last-block hash value<br>
wins. Ben reasons that all nodes will compute the same hashes, and thus all nodes will agree about<br>
which fork wins.

&emsp;**13. \[3 points\]:** Why is Ben’s fork-resolution idea a disaster? Explain briefly.

&emsp;**Name:**


---

<a id="page-13"></a>
**Page 13**

6.5840 Spring 2025, Exam II   Page 13 of 14

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
&emsp;prepared so that a new primary cannot omit already-committed operations.

&emsp;**15. \[2 points\]:** If there are 10 machines in our system, and at most 2 machines are malicious,<br>
&emsp;how many REPLY messages does a client need to receive before it knows its operation was<br>
&emsp;executed? (Circle best answer)<br>
&emsp;&emsp;**A.** 1<br>
&emsp;&emsp;**B.** 3<br>
&emsp;&emsp;**C.** 4<br>
&emsp;&emsp;**D.** 6<br>
&emsp;&emsp;**E.** 7

&emsp;**Name:**


---

<a id="page-14"></a>
**Page 14**

6.5840 Spring 2025, Exam II   Page 14 of 14

**XI**   **6.5840**

&emsp;**16. \[1 points\]:** Which lectures/papers should we **omit** in future years?<br>
&emsp;&emsp;**–** FaRM<br>
&emsp;&emsp;**–** Chardonnay<br>
&emsp;&emsp;**–** Grove<br>
&emsp;&emsp;**–** Memcache at Facebook<br>
&emsp;&emsp;**–** DynamoDB<br>
&emsp;&emsp;**–** AWS Lambda<br>
&emsp;&emsp;**–** Ray<br>
&emsp;&emsp;**–** SUNDR<br>
&emsp;&emsp;**–** Bitcoin<br>
&emsp;&emsp;**–** PBFT

&emsp;**17. \[1 points\]:** Porcupine, the linearizability checker used in the labs, comes with a visu-<br>
&emsp;alizer that displays in a web browser the entire history of client and tester operations. Circle<br>
&emsp;the one closest to your experience with the visualizer.<br>
&emsp;&emsp;**–** I haven’t used it for debugging.<br>
&emsp;&emsp;**–** I’ve tried using it, but it wasn’t helpful in my case.<br>
&emsp;&emsp;**–** I’ve read the visualization, and it occasionally helped me identify the issue in my code.<br>
&emsp;&emsp;**–** I’ve read the visualization, and it often helped me identify the issue in my code.<br>
&emsp;&emsp;**–** I’ve added my own annotations, and it enhanced my debugging experience.<br>
&emsp;&emsp;**–** Other (please briefly describe your experience):

&emsp;**18. \[1 points\]:** Do you have any feedback for us about 6.5840?

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;End of Exam II

&emsp;**Name:**

