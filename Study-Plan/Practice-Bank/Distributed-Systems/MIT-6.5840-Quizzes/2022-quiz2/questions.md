# MIT 6.824/6.5840 2022: Quiz 2: Questions

> Copied from the original: <https://pdos.csail.mit.edu/6.824/quizzes.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**


![Figure on page 1](figures/questions-p01-fig01.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Department of Electrical Engineering and Computer Science<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;MASSACHUSETTS INSTITUTE OF TECHNOLOGY

&emsp;&emsp;&emsp;&emsp;**6.824 Distributed System Engineering: Spring 2022**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Exam II**

Write your name on this cover sheet. If you tear out any sheets, please write your name on them.<br>
You have 120 minutes to complete this exam.<br>
Some questions may be much harder than others. Read them all through first and attack them in<br>
the order that allows you to make the most progress. If you find a question ambiguous, write down<br>
any assumptions you make. Write neatly. In order to receive full credit you must answer each<br>
question as precisely as possible.<br>
You may use class notes, papers, and lab material. You may read them on your laptop, but you are<br>
not allowed to use any network. For example, you may not look at web sites or communicate with<br>
anyone.

**I (7)**   **II (14)**   **III (14)**   **IV (14)**   **V (14)**   **VI (7)**   **VII (7)**   **VIII (14)**   **IX (7)**   **X (2)**   **Total (100)**

**Name:**

**Submission Website E-Mail Address:**


---

<a id="page-2"></a>
**Page 2**

**I**   **Frangipani**

Consider the paper Frangipani: A Scalable Distributed File System, by Thekkath et al. Four users,<br>
α, β, γ, and δ, each with their own workstation, share a Frangipani file system. The file system<br>
appears under the pathname /f. The file system starts out containing no files and just the empty<br>
directory /f.<br>
At about the same time, α runs

cp /dev/null /f/a

and β runs

cp /f/a /f/b

and γ runs

cp /f/b /f/g

cp is a command that copies one file to another. If the source file doesn’t exist, cp prints an<br>
error message and does not create the destination file. /dev/null is an empty file, so the first<br>
command is a way to create a new file (/f/a) containing nothing.<br>
All the above commands complete and indicate that they were successful. There is no other activity,<br>
and no failures up to this point.<br>
Now the workstations of α, β, and γ crash!

&emsp;**1. \[7 points\]:** After the crashes, user δ looks at the Frangipani file system, /f, from her<br>
&emsp;workstation. What might δ see as the complete output of a directory listing of /f? Circle all<br>
&emsp;correct answers.

&emsp;&emsp;**A.** No files.<br>
&emsp;&emsp;**B.** /f/a<br>
&emsp;&emsp;**C.** /f/b<br>
&emsp;&emsp;**D.** /f/g<br>
&emsp;&emsp;**E.** /f/a /f/b


---

<a id="page-3"></a>
**Page 3**

**II**   **Spanner**

&emsp;**2. \[7 points\]:** Sections 4.1.4 and 4.2.2 of Spanner: Google’s Globally-Distributed Database<br>
&emsp;say that in many cases Spanner assigns a read-only transaction a timestamp of TT.now().latest.<br>
&emsp;What useful property does this choice of timestamp have? Circle the single best answer.<br>
&emsp;&emsp;**A.** This timestamp is guaranteed to be less than tsafe at every replica.<br>
&emsp;&emsp;**B.** This timestamp is guaranteed to be less than the timestamp of any concurrent read-write<br>
&emsp;&emsp;&emsp;transaction.<br>
&emsp;&emsp;**C.** This timestamp is guaranteed to be greater than the timestamp of any completed read-<br>
&emsp;&emsp;&emsp;/write transaction.<br>
&emsp;&emsp;**D.** None of the above.

&emsp;**3. \[7 points\]:** For a read-only transaction that reads multiple keys stored on different Paxos<br>
&emsp;groups, why wouldn’t it be correct to read the most up-to-date version of each of the keys?<br>
&emsp;Please briefly describe an execution in which the results would be incorrect.


---

<a id="page-4"></a>
**Page 4**

**III**   **FaRM**

Consider the FaRM execute/commit protocol in Figure 4 of No compromises: distributed transac-<br>
tions with consistency, availability, and performance.<br>
The following two transactions run on different computers that share a FaRM storage system:

T1:<br>
txCreate()   // start the transaction<br>
ox = txRead(x\_oid)   // read object x (an integer)<br>
txWrite(x\_oid, ox + 1) // write object x<br>
oy = txRead(y\_oid)   // read object y (an integer)<br>
oy = compute using ox and oy for a while<br>
txWrite(y\_oid, oy)   // write object y<br>
txCommit()   // start Figure 4’s commit phase

T2:<br>
txCreate()<br>
ox = txRead(x\_oid)<br>
oy = txRead(y\_oid)<br>
ok = txCommit()<br>
if ok:<br>
&emsp;print ox, oy

txRead() uses RDMA to read an object with a given object identifier into local memory. ox and<br>
oy are local variables. txWrite() buffers the written data, which is written to FaRM during the<br>
commit phase if the transaction commits. txCommit() returns true if the transaction committed<br>
successfully, and false if it aborted.<br>
Suppose T1 is in its Execute phase, and has just read object x. At this point, T2 starts executing,<br>
on a different computer. Nothing else is happening. There are no failures.


---

<a id="page-5"></a>
**Page 5**

**4. \[7 points\]:** Could T1 cause T2 to abort? Explain briefly how this could happen, or why<br>
it can’t happen.

**5. \[7 points\]:** Is it possible for T2 to successfully commit? Explain briefly how this could<br>
happen, or why it can’t happen.


---

<a id="page-6"></a>
**Page 6**

**IV**   **Spark**

The paper Resilient Distributed Datasets: A Fault-Tolerant Abstraction for In-Memory Cluster<br>
Computing by Zaharia et al. mentions a distinction between wide and narrow dependencies.

&emsp;**6. \[7 points\]:** Some kinds of dependencies, such as join, are sometimes wide and sometimes<br>
&emsp;narrow. Join is a transformation that brings together records from its two input RDDs that<br>
&emsp;share the same key (so a join’s inputs must be RDDs of key/value pairs). Circle the single<br>
&emsp;answer that best explains when join is wide versus narrow.

&emsp;&emsp;**A.** Join is narrow when executed lazily, and wide when forced to materialize by an action<br>
&emsp;&emsp;&emsp;such as collect().<br>
&emsp;&emsp;**B.** Join is narrow when its two input RDDs resulted from narrow dependencies, wide<br>
&emsp;&emsp;&emsp;otherwise.<br>
&emsp;&emsp;**C.** Join is narrow when both preceding RDDs are partitioned by key in the same way and<br>
&emsp;&emsp;&emsp;the join is joining on that key, wide otherwise.<br>
&emsp;&emsp;**D.** Join is narrow when the preceding RDD is persistent, wide otherwise.<br>
&emsp;&emsp;**E.** None of the above.

&emsp;**7. \[7 points\]:** Circle the true statements (there may be more than one).<br>
&emsp;&emsp;**A.** A wide dependency requires data to be moved across the network, while a narrow<br>
&emsp;&emsp;&emsp;dependency does not.<br>
&emsp;&emsp;**B.** A narrow dependency can be executed lazily, while a wide dependency must be exe-<br>
&emsp;&emsp;&emsp;cuted immediately.<br>
&emsp;&emsp;**C.** A narrow dependency requires input RDD data to be key/value pairs, while a wide<br>
&emsp;&emsp;&emsp;dependency’s input can be arbitrary records.<br>
&emsp;&emsp;**D.** A narrow dependency is likely to execute more slowly than a wide dependency.<br>
&emsp;&emsp;**E.** If a worker fails, narrow RDD partitions for which it was responsible may have to be<br>
&emsp;&emsp;&emsp;re-computed starting with the original inputs.


---

<a id="page-7"></a>
**Page 7**

**V**   **Memcached at Facebook**

Figure 1 of Scaling Memcache at Facebook by Nishtala et al. illustrates a straightforward way to<br>
use memcache as a cache for a database. The left-hand part of Figure 1 shows how an application<br>
reads data, and the right-hand part shows how an application writes data. For these questions,<br>
assume the application caches database records in memcache, with the same keys that the database<br>
uses.

&emsp;**8.**   **\[7 points\]:** Consider the scheme in Figure 1 **without leases** and without any of the<br>
&emsp;paper’s other improvements (without McSqueal, without McRouter). Why does Figure 1’s<br>
&emsp;write path do the memcache delete after the database UPDATE, rather than before? Circle<br>
&emsp;the single best answer.

&emsp;&emsp;**A.** This order guarantees that a read concurrent with a write of the same key won’t cause<br>
&emsp;&emsp;&emsp;stale data to be cached in memcache.<br>
&emsp;&emsp;**B.** This order prevents a read from seeing the old value after the UPDATE completes.<br>
&emsp;&emsp;**C.** Neither of the above.

&emsp;**9. \[7 points\]:** Now consider a design consisting of Figure 1 **with leases** (but without any<br>
&emsp;of the paper’s other mechanisms). In which situation(s) does the lease mechanism decrease<br>
&emsp;the likelihood of stale data being cached in memcached indefinitely, compared to Figure 1<br>
&emsp;alone? In all of these scenarios, the read’s get misses in memcache. Circle all of the correct<br>
&emsp;answers.

&emsp;&emsp;**A.** When there are two concurrent reads of the same record (but no writes).<br>
&emsp;&emsp;**B.** When the two steps of a write occur between steps 1 and 2 of a read of the same record.<br>
&emsp;&emsp;**C.** When the two steps of a write occur between steps 2 and 3 of a read of the same record.<br>
&emsp;&emsp;**D.** When the three steps of a read occur between steps 1 and 2 of a write to the same<br>
&emsp;&emsp;&emsp;record.<br>
&emsp;&emsp;**E.** None of the above.


---

<a id="page-8"></a>
**Page 8**

**VI**   **COPS**

Alyssa stores data in COPS (Don’t Settle for Eventual: Scalable Causal Consistency for Wide-<br>
Area Storage with COPS by Lloyd et al.). The COPS deployment has three replicas, in three<br>
data-centers. Alyssa runs code on three clients (C1, C2, and C3), each in a different data-center<br>
along with one of the COPS replicas. Alyssa is using COPS (not COPS-GT).<br>
Alyssa’s data consists of two key/value pairs: I1, whose value is a string, and I2, whose value is an<br>
integer. I1’s value starts out as the empty string, and I2’s value starts out as zero. Both key/value<br>
pairs start out identical at the three COPS replicas.<br>
At about the same time, each of Alyssa’s three clients runs some code that calls the COPS client<br>
library put and get functions. There’s no other activity, and no failures.

C1 runs this:<br>
put("I1", get("I1") + "X")   // append X to I1<br>
put("I2", get("I2") + 1)   // increment I2

C2 runs this:<br>
put("I1", get("I1") + "X")   // append X to I1<br>
put("I2", get("I2") + 1)   // increment I2

C3 runs this:<br>
print "I2=", get("I2")   // read I2 first<br>
print "I1=", get("I1")   // then I1

&emsp;**10. \[7 points\]:** What output could C3 print? Circle all of the correct answers.

&emsp;&emsp;**A.** I2=2 I1="XX"<br>
&emsp;&emsp;**B.** I2=2 I1="X"<br>
&emsp;&emsp;**C.** I2=2 I1=""<br>
&emsp;&emsp;**D.** I2=1 I1="XX"<br>
&emsp;&emsp;**E.** I2=1 I1=""<br>
&emsp;&emsp;**F.** I2=0 I1="XX"


---

<a id="page-9"></a>
**Page 9**

**VII**   **SUNDR**

Three client computers (C0, C1, and C2) share files on a SUNDR server. (Secure Untrusted Data<br>
Repository (SUNDR), by Li et al.). The SUNDR server starts out containing three files, x, y, and z,<br>
and their contents all start out as 0.<br>
Client C0 asks the SUNDR server to perform the following three writes, one at a time, waiting for<br>
each to complete before proceeding to the next:

C0: write "1" to file x<br>
C0: write "2" to file y<br>
C0: write "3" to file z

The SUNDR server returns a success indication for each of these writes, and C0 does not detect any<br>
problem. After C0 has completed its writes, C1 asks the SUNDR server to perform the following<br>
three writes, one at a time, waiting for each to complete before proceeding to the next:

C1: write "1" to file x<br>
C1: write "2" to file y<br>
C1: write "3" to file z

Again, the SUNDR server returns a success indication for each C1’s writes, and C1 does not<br>
detect any problem. After C1 has completed its writes, C2 asks the SUNDR server to perform the<br>
following three reads, one at a time, waiting for each to complete before proceeding to the next:

C2: read file x<br>
C2: read file y<br>
C2: read file z

The SUNDR server returns a success indication for each of these reads, and C2 does not detect any<br>
problem.<br>
The three clients only communicate with the SUNDR server; they don’t talk to each other. You can<br>
answer this question with reference to the paper’s straw-man protocol (Section 3.1), though that<br>
should not affect the answers.


---

<a id="page-10"></a>
**Page 10**

**11. \[7 points\]:** Which of the following could C2 see from its three reads?<br>
**A.** x=1 y=2 z=3<br>
**B.** x=0 y=2 z=3<br>
**C.** x=0 y=0 z=0<br>
**D.** x=1 y=0 z=0<br>
**E.** x=1 y=0 z=3<br>
**F.** x=1 y=1 z=1


---

<a id="page-11"></a>
**Page 11**

**VIII**   **Bitcoin and Ethereum**

Ben runs an online tulip shop where he accepts Bitcoin as payment, 1 BTC for 1 tulip (these are<br>
premium tulips). Upon seeing a payment transaction appear in the blockchain, Ben waits for 6<br>
additional blocks before treating the payment as valid and shipping tulips to the buyer by overnight<br>
Fedex.

&emsp;**12.**   **\[7 points\]:** Suppose an attacker owns 1 BTC, and the attacker gains control of 80%<br>
&emsp;of the Bitcoin network hash power for a period of 2 hours. Describe how this attacker could<br>
&emsp;cheat Ben’s store, such that on the next day, the attacker still has their 1 BTC and also has a<br>
&emsp;tulip.

Alyssa runs a virtual tulip shop implemented as an Ethereum smart contract. Her shop sells sells<br>
tulip “tokens” for 1 ETH (ETH is the Ethereum currency). A tulip token is a purely virtual item,<br>
whose ownership is represented in the state of Alyssa’s smart contract; no physical goods are<br>
involved. Here’s what Alyssa’s Ethereum tulip smart contract state and external method look like:

&emsp;// track how many tulip tokens each ETH address holds<br>
&emsp;private mapping (address =\> uint256) tulips;

&emsp;function buy() external payable {<br>
&emsp;&emsp;&emsp;require(msg.value \>= 1 eth); // sender has to transfer \>= 1 ETH<br>
&emsp;&emsp;&emsp;tulips\[msg.sender\]++; // sender gains a tulip token<br>
&emsp;}

&emsp;**13. \[7 points\]:** Suppose an attacker owns 1 ETH, and the attacker gains control of 80% of<br>
&emsp;the Ethereum network hash power for a period of 2 hours. Could the attacker cheat Alyssa’s<br>
&emsp;store, such that on the next day, the attacker still has their 1 ETH and also has a tulip token?<br>
&emsp;Why or why not?


---

<a id="page-12"></a>
**Page 12**

**IX**   **Lab 3**

Alyssa is working on reducing the read latency of her Lab 3 by allowing either a leader or a follower<br>
to respond to a Get() RPC, and to do so without putting the operation in the Raft log. Her plan is<br>
as follows:

**A.** Modify the Put() and PutAppend() RPC responses to return the Raft log index where the<br>
&emsp;operation committed.<br>
**B.** Modify the client Clerk module to track the latest log index received in a Put() or PutAp-<br>
&emsp;pend() RPC response, and pass the index as an additional lastPutIndex argument to the Get()<br>
&emsp;RPC request.<br>
**C.** Modify the server code to execute Get() requests with a given lastPutIndex as follows, on<br>
&emsp;either the leader or a follower:

&emsp;&emsp;(a) If the local replica has finished processing at least up through index lastPutIndex, then<br>
&emsp;&emsp;&emsp;read the data from the local replica’s state and return immediately.<br>
&emsp;&emsp;(b) Otherwise, wait until the command at lastPutIndex has been processed, and then read<br>
&emsp;&emsp;&emsp;the data from the local replica’s state.

&emsp;**14. \[7 points\]:** Alyssa claims that her design will order her Get() requests after previous<br>
&emsp;Put()/PutAppend() requests, and this will prevent stale reads. Is Alyssa’s modified design<br>
&emsp;correct — does her design still implement a linearizable key-value store? If yes, explain<br>
&emsp;why it’s correct. If not, give a scenario in which Alyssa’s design results in an execution that<br>
&emsp;violates linearizability.


---

<a id="page-13"></a>
**Page 13**

**X**   **6.824**

&emsp;**15. \[1 points\]:** Which lectures/papers should we **omit** in future years?<br>
&emsp;&emsp;**–** Distributed Transactions<br>
&emsp;&emsp;**–** Frangipani<br>
&emsp;&emsp;**–** Spanner<br>
&emsp;&emsp;**–** FaRM<br>
&emsp;&emsp;**–** Spark<br>
&emsp;&emsp;**–** Memcached at Facebook<br>
&emsp;&emsp;**–** COPS<br>
&emsp;&emsp;**–** SUNDR<br>
&emsp;&emsp;**–** Bitcoin<br>
&emsp;&emsp;**–** Blockstack<br>
&emsp;&emsp;**–** Ethereum

&emsp;**16. \[1 points\]:** Do you have any feedback for us about 6.824?

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;End of Exam II

