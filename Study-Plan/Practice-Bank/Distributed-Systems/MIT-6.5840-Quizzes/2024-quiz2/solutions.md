# MIT 6.824/6.5840 2024: Quiz 2: Official solutions

> Copied from the original: <https://pdos.csail.mit.edu/6.824/quizzes.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

6.5840 Spring 2024, Exam II   Page 1 of 19


![Figure on page 1](figures/solutions-p01-fig01.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Department of Electrical Engineering and Computer Science<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;MASSACHUSETTS INSTITUTE OF TECHNOLOGY

&emsp;&emsp;&emsp;**6.5840 Distributed System Engineering: Spring 2024**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Exam II**

Please write your name on the bottom of each page. You have 120 minutes to complete this exam.<br>
Some questions may be much harder than others. Read them all through first and attack them in<br>
the order that allows you to make the most progress. If you find a question ambiguous, write down<br>
any assumptions you make. Write neatly. In order to receive full credit you must answer each<br>
question as precisely as possible.<br>
You may use class notes, papers, and lab material. You may read them on your laptop, but you<br>
are not allowed to use any network. For example, you may not look at web sites, use ChatGPT, or<br>
communicate with anyone.<br>
The maximum number points available is 74.

**Gradescope E-Mail Address:**

&emsp;**Name:**


---

<a id="page-2"></a>
**Page 2**

6.5840 Spring 2024, Exam II   Page 2 of 19<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Grade statistics for Exam 2

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;max=   74<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;median   =   60<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;µ   =   59.61<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;σ   =   9.13

&emsp;**Name:**


---

<a id="page-3"></a>
**Page 3**

6.5840 Spring 2024, Exam II   Page 3 of 19

**I**   **Spanner**

The intelligent computer HAL is using Spanner (as described in Spanner: Google’s Globally-<br>
Distributed Database by Corbett et al.) to store data. HAL notes that read/write transactions<br>
are being slowed down by Spanner’s commit-wait mechanism (see Section 4.2.1). HAL disables<br>
commit-wait in his Spanner installation; as a result, everything works just as described in the paper<br>
except that the coordinator leader does not wait until the timestamp s is guaranteed to be in the<br>
past.<br>
HAL uses just these three transactions:

T1:<br>
X=1<br>
Y=1

T2:<br>
X=22<br>
Y=22

T3:<br>
print X, Y

Initially, database records X and Y both have value 0. X and Y are in different Spanner shards,<br>
managed by different Paxos groups. T1 and T2 are read/write transactions; T3 is a read-only<br>
transaction.<br>
HAL starts T1; waits for Spanner to say that T1 has completed; starts T2, waits for Spanner to say<br>
that T2 has completed; then starts T3 and observes T3’s output.

&emsp;**1.**   **\[5 points\]:** Which outputs from T3 are possible? (For each statement, circle True or<br>
&emsp;False.)<br>
&emsp;**True / False** : 22, 22<br>
&emsp;**True / False** : 1, 1<br>
&emsp;**True / False** : 1, 22<br>
&emsp;**True / False** : 0, 0<br>
&emsp;**Answer:** 22,22, 1,1, and 0,0 are all possible; 1,22 is not. Omitting commit-wait means that<br>
&emsp;either or both of T1 and T2 might commit with time-stamps later than the time-stamp that T3<br>
&emsp;chooses, so T3 might see the result of either T1 or T2, or neither. T3 can’t see 1,22 because<br>
&emsp;both T1 and T2 do both their writes at the same timestamp, so T3 will either see both writes<br>
&emsp;of one of the transactions, or neither.<br>
&emsp;**Name:**


---

<a id="page-4"></a>
**Page 4**

6.5840 Spring 2024, Exam II   Page 4 of 19

**II**   **Chardonnay**

Consider the paper Chardonnay: Fast and General Datacenter Transactions for On-Disk Databases,<br>
by Eldeeb et al.<br>
A read/write Chardonnay transaction reads database record A, then reads B, and then writes C. The<br>
system is busy with other read/write transactions at the same time, some of which might also use<br>
A, B, and/or C.

&emsp;**2. \[4 points\]:** In which situation will Chardonnay’s “dry run” mechanism yield the most<br>
&emsp;benefit? (Circle the single best answer.)<br>
&emsp;\* A is hot, B is cold.<br>
&emsp;\* A is cold, B is hot.<br>
&emsp;\* A is cold, B is cold.<br>
&emsp;\* A is hot, B is hot.

“Cold” means used rarely. “Hot” means used by many transactions.<br>
**Answer:**   Only the first answer (hot, cold) is correct. Chardonnay’s dry run mechanism helps<br>
avoid situations in which a transaction holds the lock for a record that other transactions need,<br>
while waiting to read a record from the disk. This situation arises when a read/write transaction<br>
uses a hot record followed by a cold record.

&emsp;**Name:**


---

<a id="page-5"></a>
**Page 5**

6.5840 Spring 2024, Exam II   Page 5 of 19

A system that uses Chardonnay issues just these three transactions:

T1:<br>
X=1

T2:<br>
Y=1

T3:<br>
print X, Y

Initially, both database records (X and Y) start out with value 0. X and Y are in different ranges. T1<br>
and T2 are read/write transactions. T3 is a read-only transaction (described in the paper’s Section<br>
6). T3 does not use the the waiting idea described in the last paragraph of Section 6.2.<br>
One client starts T1. After T1 completes, another client starts T2. After T2 completes, a third client<br>
runs T3.<br>
This version of Chardonnay has a bug somewhere in its code, causing T3 to print the incorrect<br>
output 0,1.

&emsp;**3. \[4 points\]:** Which of the following bugs is the most plausible explanation for T3 printing<br>
&emsp;0,1? Circle the single most correct answer.<br>
&emsp;\* The epoch server is stuck: it always returns the same epoch number, and never increases it.<br>
&emsp;\* The epoch server is incrementing too quickly: more than once per 10 milliseconds.<br>
&emsp;\* The epoch server is working correctly except it gave T2 an epoch that was too small.<br>
&emsp;\* The epoch server is working correctly except it gave T2 an epoch that was too large.<br>
&emsp;**Answer:**   The third answer is correct. 0,1 is not a correct output because serializability<br>
&emsp;requires that if T3 observes the results of T2, and T1 finished before T2 started, then T3 is<br>
&emsp;required to also see the results of T1. If the epoch server gives T2 an epoch that’s less than<br>
&emsp;T1’s epoch, and T3 and T1 run in the same epoch, then T3 will see T2’s Y=1 but not T1’s<br>
&emsp;X=1.

&emsp;**Name:**


---

<a id="page-6"></a>
**Page 6**

6.5840 Spring 2024, Exam II   Page 6 of 19

**III**   **FaRM**

Consider the following statements about FaRM as described in No compromises: distributed trans-<br>
actions with consistency, availability, and performance. For each statement, circle True or False.

&emsp;**4. \[8 points\]:**<br>
&emsp;**True / False** : Because FaRM uses primary-backup replication for a region (instead of<br>
&emsp;Paxos), FaRM must reconfigure to remove a failed replica before FaRM can continue to<br>
&emsp;use the region.

&emsp;**True / False** : FaRM can use short leases (10ms by default) because it has communication<br>
&emsp;and scheduling optimizations to renew leases quickly.

&emsp;**True / False** : A transaction that modifies only one object will never abort.

&emsp;**True / False** : Read-only transactions require only the validate step of the Commit phase in<br>
&emsp;Figure 4.

**Answer:**   True, True, False, True. The first statement is true because FaRM requires a response<br>
from all replicas, thus it must reconfigure to remove the failed replica before it can continue with<br>
the affected shard. The third statement is false because another transaction may modify the one<br>
object causing this transaction’s validation phase to fail (because the other transaction will have<br>
incremented the object’s version number).

&emsp;**Name:**


---

<a id="page-7"></a>
**Page 7**

6.5840 Spring 2024, Exam II   Page 7 of 19

**IV**   **Ray**

Consider the following Ray program, which creates a sqrt task task for each number in the list<br>
mylist. The creation yields a DFut and the caller waits for the tasks to complete by calling get<br>
on each future. The code is as follows:

\# A call to sqrt\_task yields a DFut<br>
@ray.remote<br>
def sqrt\_task(n):<br>
\# sqrt is a python function, which returns the square root of its argument<br>
return sqrt(n)

def sqrts0(n\_list):<br>
\# start tasks and collect futures<br>
l = \[ \]   # list holding DFuts<br>
for i in n\_list:   # iterate over list of numbers<br>
&emsp;l.append(sqrt\_task(i))

r = \[ \]<br>
for f in l:<br>
&emsp;r.append(get(f))   # collect the result

return r

print(sqrts0(mylist))   # invoke sqrts0 with a list of numbers and print result

Assume Ray behaves in the way described in Ownership: a distributed futures system for fine-<br>
grained tasks by Wang et al., and Ray is running on a cluster of computers.

&emsp;**5. \[4 points\]:**<br>
&emsp;Will the sqrt computations complete in the order that sqrts0 appends to r? (Briefly<br>
&emsp;explain your answer)

**Answer:** No. The sqrt tasks run concurrently with each other, and may finish in an arbitrary<br>
order. All that is guaranteed is that the task has finished executing (at least once) by the time<br>
get(f) returns.

&emsp;**Name:**


---

<a id="page-8"></a>
**Page 8**

6.5840 Spring 2024, Exam II   Page 8 of 19

Alyssa creates a function sqrts1 whose body is the same as sqrts0, but is declared as a remote<br>
task. She then modifies the program to invoke many sqrts1’s, each with a large distinct, non-<br>
overlapping slice of the number list. The code is as follows:

@ray.remote<br>
def sqrts1(n\_list):<br>
...<br>
\# same code as sqrts0<br>
...<br>
return r

f0 = sqrts1(mylist\[...\])<br>
f1 = sqrts1(mylist\[...\])<br>
f2 = sqrts1(mylist\[...\])<br>
...

print(get(f0))<br>
print(get(f1))<br>
...

&emsp;**6. \[4 points\]:**<br>
&emsp;Ben is worried that the above program creates so many sqrt tasks tasks that Ray will be<br>
&emsp;bottle-necked by managing the tasks and the futures they yield. Briefly explain why Ray can<br>
&emsp;manage many tasks in parallel for the above program?

**Answer:** The worker machine that invokes sqrts1(...) is the owner of the metadata for the<br>
value returned by each sqrts1 call. The many workers that execute sqrts1() each indepen-<br>
dently own the metadata for their sqrt task’s, resulting in no one machine being required to<br>
manage all the sqrt tasks.

&emsp;**Name:**


---

<a id="page-9"></a>
**Page 9**

6.5840 Spring 2024, Exam II   Page 9 of 19

**V**   **Memcache at Facebook**

Ben Bitdiddle runs a web site. Ben reads the paper Scaling Memcache at Facebook by Nishtala<br>
et al., and thinks that the design is too complex. So Ben decides to ignore the paper’s design: he<br>
doesn’t use leases, mcrouter, pools, etc. Ben uses only the mechanisms described below.<br>
Ben has just a single region, with some web servers, some memcache servers, and a single database<br>
server. Ben programs each of his web servers to use the following client code to read and write<br>
data:

read(k):<br>
if v = memcache\_get(k) succeeds<br>
&emsp;return v<br>
else<br>
&emsp;return database\_get(k)

write(k, v):<br>
database\_put(k, v)<br>
memcache\_put(k, v)

Note that read() does not insert anything into memcache, and note that write() always in-<br>
serts the new data into memcache, whether it was already cached or not. Ben knows this may be<br>
wasteful, since it may cause memcache to cache data that’s never read, but he doesn’t mind.

&emsp;**7. \[5 points\]:** Sadly, Ben sees that read()s sometimes return stale data for a long time<br>
&emsp;after the write() of a newer value has succeeded and returned. Explain how this could<br>
&emsp;happen.

**Answer:**   If there are concurrent writes by different clients to the same key, the calls to<br>
database put() may execute in a different order that the calls to memcache put(), so that<br>
memcache and the database end up with different values. This condition can persistent for a long<br>
time: until the next time a client writes the same key.

&emsp;**Name:**


---

<a id="page-10"></a>
**Page 10**

6.5840 Spring 2024, Exam II   Page 10 of 19

**VI**   **Lab 4**

Ben implements the RPC handlers and the applier in Lab 4 as follows. The RPC handlers for Get,<br>
Put, and Append take the following steps:

**A.** Submit a command to the Raft library via Start. The command includes the client ID,<br>
&emsp;request ID, operation type, and arguments.<br>
**B.** Loop to wait until the reply for that command to show up in the reply table, which maps from<br>
&emsp;client IDs to the replies of clients’ latest requests. Each reply contains the request ID and the<br>
&emsp;result to that request. If Raft’s leadership changes during the loop, return ErrWrongLeader.<br>
**C.** Return the result stored in the reply table.

The applier detail is irrelevant to this question and is shown on the next page.

&emsp;**8. \[4 points\]:**<br>
&emsp;Ben observes that Get does not modify the application state. He changes Get’s RPC han-<br>
&emsp;dler to read the key-value table and return immediately to the client the result. Does this<br>
&emsp;implementation preserve linearizability? (Briefly explain your answer.)

**Answer:**   No. Get could return a stale result if Raft the leadership changes. For instance, if<br>
a client submits an Append to the old leader and succeeds, and then submits a Get to the new<br>
leader, the Get result could miss the appended value if the new leader handles the Get before<br>
applying the Append.

&emsp;**Name:**


---

<a id="page-11"></a>
**Page 11**

6.5840 Spring 2024, Exam II   Page 11 of 19

The applier takes the following steps:

**D.** Read a command from the apply channel.<br>
**E.** De-duplicate the command with the reply table: if the request ID in the reply table for the<br>
&emsp;client is greater than or equal to that in the command, then skip the command.<br>
**F.** Apply the command and insert the result to the reply table.

&emsp;**9. \[4 points\]:**<br>
&emsp;Separately from the previous change, Ben modifies his implementation to perform de-duplication<br>
&emsp;early in the RPC handlers. Concretely, he removes **step E** in the applier, and adds an addi-<br>
&emsp;tional step at the start of the RPC handlers (i.e., before **step A**) as follows:

&emsp;If the request ID in the reply table for the client is greater than or equal to that in the RPC<br>
&emsp;arguments, return the result stored in the reply table.

&emsp;Does this implementation preserve linearizability? (Briefly explain your answer.)

**Answer:** No. An operation could be applied twice if the client re-sends it before the first RPC is<br>
applied.

&emsp;**Name:**


---

<a id="page-12"></a>
**Page 12**

6.5840 Spring 2024, Exam II   Page 12 of 19

**VII**   **AWS Lambda**

Consider the guest lecture about the paper On-demand container loading in AWS Lambda by<br>
Brooker et al. For each of the following statements, indicate whether it is true or false.

&emsp;**10. \[8 points\]:**<br>
&emsp;**True / False** : AWS Lambda is attractive to customers because it allows them to run cloud<br>
&emsp;computations without having to provision a machine.

&emsp;**True / False** : Many containers of AWS Lambda customers don’t contain unique chunks<br>
&emsp;because customers upload the same container multiple times.

&emsp;**True / False** : AWS Lambda may deduplicate popular chunks less than unpopular chunks.

&emsp;**True / False** : AWS Lambdas use LRU-K to ensure that if many infrequently-used Lambdas<br>
&emsp;are running at the same time, they don’t evict the chunks of frequently-used Lambdas.

**Answer:**   True, True, True, True. The third option is true because AWS does this to reduce the<br>
blast radius of popular chunks (see Section 3.3).

&emsp;**Name:**


---

<a id="page-13"></a>
**Page 13**

6.5840 Spring 2024, Exam II   Page 13 of 19

**VIII**   **Boki**

Consider Figure 6(a) in Boki: Stateful Serverless Computing with Shared Logs by Jia and Witchel.<br>
The left column describes how Boki makes the execution of a workflow of serverless functions<br>
with database side-effects exactly-once.<br>
Alyssa notices that if Boki reruns a workflow it will append a record to the workflow’s LogBook,<br>
even if an append of an earlier failed execution already logged the record. Alyssa proposes to<br>
change the pattern of append-read to read-append-read: that is, she modifies Boki to read before<br>
an append to see if the append already logged its record; if so, it uses the first value returned by the<br>
read and skips the subsequent append and read. (If not, Boki executes as before, doing an append<br>
followed by read.)<br>
For example, Alyssa changes write as follows:

def write(table, key, val):<br>
tag = hashLogTag(\[ID, STEP\])<br>
\# first read<br>
rec = logReadNext(tag: tag, minSeqnum: 0)<br>
\# if no record, then append and read again<br>
if rec == None:<br>
&emsp;&emsp;logAppend(\[tags: \[tag\], data: \[table, key, val\])<br>
&emsp;&emsp;rec = logReadNext(tag: tag, minSeqnum: 0)<br>
rawDBWRITE(...)   # same call as before<br>
STEP = STEP + 1

&emsp;**11. \[5 points\]:**<br>
&emsp;Alyssa runs one workflow on her modified Boki. The workflow crashes during its execution<br>
&emsp;and then restarts from the beginning and completes. With Alyssa’s modification will write<br>
&emsp;preserve exactly-once semantics? (Briefly explain your answer.)

It will preserve exactly-once semantics.**Answer:**In the case that logReadNext() re-<br>
turns something non-None initially, it will always return that same log record.   So even if<br>
write() did a logAppend(), the final logReadNext() would have the same value as the<br>
logReadNext() that is executed before logAppend().

&emsp;**Name:**


---

<a id="page-14"></a>
**Page 14**

6.5840 Spring 2024, Exam II   Page 14 of 19

**IX**   **SUNDR**

Consider the straw-man design in the paper Secure Untrusted Data Repository (SUNDR) by Li et<br>
al.<br>
Users A, B, and C share a SUNDR server. The server may be malicious, though the server does<br>
not know any of the private keys. User A creates a new file aaa in the SUNDR file system. After<br>
that, user B looks for file aaa, but does not see the file. After that, user C creates a new empty file<br>
ccc.<br>
There is no client activity other than what is described here. None of the stronger consistency ideas<br>
from the paper’s Section 3.2 are in use. All three users are honest and run correct SUNDR client<br>
software.<br>
All three users now use the ls command to check whether they can see file ccc. All three users’<br>
client SUNDR implementations report that the data they receive from SUNDR passes all validity<br>
checks. Nevertheless, a malicious SUNDR server can cause a number of different outcomes.

&emsp;**12.**   **\[6 points\]:** What combinations are possible for which users can see ccc? For each<br>
&emsp;statement, circle True if the SUNDR server could cause the indicated results, and False if<br>
&emsp;not.<br>
&emsp;**True / False** : All three users can see ccc.

&emsp;**True / False** : Only A and B can see ccc, but not C.<br>
&emsp;**True / False** : Only A and C can see ccc, but not B.<br>
&emsp;**True / False** : Only B and C can see ccc, but not A.<br>
&emsp;**True / False** : Only C can see ccc, but not A or B.<br>
&emsp;**True / False** : None of the users can see ccc.

**Answer:** The correct answers are A and C but not B, B and C but not A, and only C. We know that<br>
the server has forked A and B from the fact that B cannot see aaa. So A and B have seen different<br>
operation histories, and each has appended an operation to the history it saw, and remembered that<br>
operation. Thus, when C asks the server for the current history (before C creates ccc), the SUNDR<br>
server can show C A’s fork of the history, B’s fork, or perhaps the history as of before A’s creation<br>
of aaa. As a result, after C creates ccc, ccc will be visible to A (but not B), to B (but not A), and to<br>
C alone, respectively.

&emsp;**Name:**


---

<a id="page-15"></a>
**Page 15**

6.5840 Spring 2024, Exam II   Page 15 of 19

**X**   **PBFT**

Consider the PBFT protocol as described in the paper Practical Byzantine Fault Tolerance by<br>
Castro and Liskov.

&emsp;**13. \[5 points\]:**<br>
&emsp;PBFT chooses the primary for a view deterministically based on the view number. What<br>
&emsp;could go wrong if PBFT were to use Raft’s voting algorithm to select a primary for a view?<br>
&emsp;(Briefly explain your answer.)

&emsp;**Answer:** Raft’s voting algorithm does not result in a single leader-per-term under byzantine<br>
&emsp;faults. Consider a 7 node system with 2 Byzantine nodes. The nodes that vote for A for term<br>
&emsp;T are A, B, C, D, and allow A to conclude it is leader. The nodes that vote for D for term T<br>
&emsp;are E, F, G, D, and allow D to conclude it is leader. Of these, only D is Byzantine and has<br>
&emsp;equivocated by voting for both A and D. All the other nodes may vote this way while acting<br>
&emsp;non-byzantine. This results in two primaries for a single term and violates the assumptions<br>
&emsp;that the rest of pbft builds on.

&emsp;**Name:**


---

<a id="page-16"></a>
**Page 16**

6.5840 Spring 2024, Exam II   Page 16 of 19

**XI**   **Bitcoin**

Section 4 of Nakamoto’s Bitcoin paper explains that the difficulty of mining is determined by the<br>
number of required leading zeros in the SHA-256 hash of the block. The paper also says that<br>
Bitcoin automatically varies the difficulty of mining (the number of required leading zeros) by ob-<br>
serving the recent average rate of new block mining, relative to the target block every ten minutes;<br>
if blocks have been generated too quickly, the difficulty is increased; if too slowly, decreased. All<br>
honest Bitcoin peers use the same algorithm to determine the difficulty.<br>
Ben dreams of being able to buy tickets to the latest Taylor Swift concert. To obtain the money<br>
required, Ben has been running the Bitcoin peer software on his laptop, but he hasn’t been earn-<br>
ing mining rewards very quickly, because his laptop is only the winning miner very infrequently.<br>
Hoping to realize his dream faster, Ben modifies his copy of the Bitcoin peer software so that the<br>
difficulty determination algorithm always yields a low difficulty, with the result that his peer can<br>
mine new blocks very quickly, often before any other Bitcoin miner produces a given new block in<br>
the chain.

&emsp;**14.**   **\[5 points\]:** It turns out that Ben won’t actually earn any bitcoins with this scheme.<br>
&emsp;Explain why not.

**Answer:**   Bitcoin peers that run correct software will check that any proposed new block has a<br>
hash with the expected number of leading zeros. Those peers are running the correct difficulty-<br>
determining algorithm, so they will reject Ben’s blocks because their hashes have too few leading<br>
zeros.

&emsp;**Name:**


---

<a id="page-17"></a>
**Page 17**

6.5840 Spring 2024, Exam II   Page 17 of 19

**XII**   **6.5840**

&emsp;**15. \[1 points\]:** Which lectures/papers should we **omit** in future years?<br>
&emsp;&emsp;**–** Spanner **(3)**<br>
&emsp;&emsp;**–** Chardonnay **(22)**<br>
&emsp;&emsp;**–** FaRM **(8)**<br>
&emsp;&emsp;**–** DynamoDB **(7)**<br>
&emsp;&emsp;**–** Ray **(9)**<br>
&emsp;&emsp;**–** Memcache at Facebook **(3)**<br>
&emsp;&emsp;**–** AWS Lambda **(20)**<br>
&emsp;&emsp;**–** Boki **(62)**<br>
&emsp;&emsp;**–** SUNDR **(6)**<br>
&emsp;&emsp;**–** PBFT **(7)**<br>
&emsp;&emsp;**–** Bitcoin **(1)**

&emsp;**16. \[1 points\]:** Porcupine, the linearizability checker used in the labs, comes with a visu-<br>
&emsp;alizer that displays in a web browser the entire history of client operations, and highlights<br>
&emsp;non-linearizable errors, if any. Circle the one closest to your experience with the visualizer.<br>
&emsp;&emsp;**–** I don’t know its existence. **(46)**<br>
&emsp;&emsp;**–** I’ve used it, but it isn’t particularly helpful to me. **(25)**<br>
&emsp;&emsp;**–** I’ve used it, and sometimes I understand the result but sometimes don’t. **(19)**<br>
&emsp;&emsp;**–** I’ve used it, and it successfully explains to me why the result is non-linearizable. **(7)**<br>
&emsp;&emsp;**–** I’ve used it, and it significantly improves my debugging experience. **(2)**<br>
&emsp;&emsp;**–** Other (please briefly describe your experience): **(2)**

&emsp;**17. \[1 points\]:** Do you have any feedback for us about 6.5840?

&emsp;• (7) less dependence between labs, and want to see/use correct Raft for later labs<br>
&emsp;• (6) labs about systems/papers other than Raft (e.g. distributed transactions)<br>
&emsp;• (5) better class notes (e.g. slides)

&emsp;**Name:**


---

<a id="page-18"></a>
**Page 18**

6.5840 Spring 2024, Exam II   Page 18 of 19

&emsp;• (4) better debugging tools (e.g. logging, better visualization)<br>
&emsp;• (4) TA recitation/office hours for papers specifically + exam review<br>
&emsp;• (4) guidance on how to read papers/which parts of papers<br>
&emsp;• (4) stronger tests for earlier labs<br>
&emsp;• (4) clearer answers to lecture questions<br>
&emsp;• (2) more office hours<br>
&emsp;• (2) study fewer papers more deeply<br>
&emsp;• (3) examples or demos of real world systems<br>
&emsp;• (2) more lab instructions<br>
&emsp;• (2) liked emails answering pre-lecture questions<br>
&emsp;• extra lecture for lab 5<br>
&emsp;• want more fundamental lecture on formal verification<br>
&emsp;• lecture on CRDTs, seems like a big topic in distributed systems<br>
&emsp;• update sundr to a newer system<br>
&emsp;• ethereum paper get higher priority<br>
&emsp;• bring back ethereum<br>
&emsp;• want more time on BFT<br>
&emsp;• extra credit for lab challenge exercises<br>
&emsp;• skip lab 2<br>
&emsp;• want all labs due at end of semester, no late penalty<br>
&emsp;• want questions due night before instead of the minute before lecture<br>
&emsp;• survey students to determine how hard labs are<br>
&emsp;• find a better lecture question for bitcoin<br>
&emsp;• more grading weight on labs<br>
&emsp;• the amazon papers were a bit vague in describing precise system/algorithm

&emsp;**Name:**


---

<a id="page-19"></a>
**Page 19**

6.5840 Spring 2024, Exam II   Page 19 of 19

&emsp;• really liked guest AWS lectures<br>
&emsp;• more conceptual checks on new papers<br>
&emsp;• want more practice Qs for new paper

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;End of Exam II

&emsp;**Name:**

