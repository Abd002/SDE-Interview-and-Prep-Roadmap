# MIT 6.824/6.5840 2006: Quiz 1: Questions

> Copied from the original: <https://pdos.csail.mit.edu/6.824/quizzes.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**


![Figure on page 1](figures/questions-p01-fig01.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Department of Electrical Engineering and Computer Science<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;MASSACHUSETTS INSTITUTE OF TECHNOLOGY<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**6.824 Spring 2006**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Midterm Exam**

&emsp;Please write your name on this cover sheet and on any exam pages you detach from this sheet.<br>
&emsp;Some questions may be much harder than others. Read them all through first and attack them in<br>
&emsp;the order that allows you to make the most progress. If you find a question ambiguous, be sure<br>
&emsp;to write down any assumptions you make. Be neat. If we can’t understand your answer, we can’t<br>
&emsp;give you credit.<br>
&emsp;There’s a feedback form at the end of the exam which we’d like you to fill out if you have time.<br>
&emsp;You have 80 minutes to complete this exam.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**THIS IS AN OPEN BOOK, OPEN NOTES EXAM.**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Please do not write in the boxes below.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**1 (xx/15)**   **2 (xx/15)**   **3 (xx/40)**   **4 (xx/30)**   **Total (xx/100)**

**Name:**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1


---

<a id="page-2"></a>
**Page 2**

**I**   **Lab 5**

The server implementation of the NFS GETATTR RPC only needs to read blocks; it does not modify any<br>
blocks. Nevertheless in Lab 5 GETATTR needs to lock the relevant file handle.

&emsp;**1. \[5 points\]:**   Explain what would go wrong if GETATTR did not lock.

You’d like to make your Lab 5 file system continue to work even if one ccfs crashes (out of a set of ccfs’s<br>
serving the same file system). You just want to ensure that the other ccfs’s can successfully continue using<br>
the shared file system despite one ccfs crash. It’s OK if some sub-set of the last few NFS RPCs served by<br>
the crashed ccfs ”disappear” (you do not have to enforce any kind of Echo-like prefix rules). It’s clear that<br>
it will be a problem if a ccfs crashes while holding locks. You modify your lock server to use leases (as in<br>
the Echo file system) so that the lock server can take back a lease from a crashed ccfs after the lease expires.<br>
You also modify ccfs to re-acquire each lease it holds before the lease expires.

&emsp;**2.**   **\[10 points\]:**   Are these modification sufficient? If yes, briefly argue why; if no, describe a<br>
&emsp;specific situation that would cause trouble.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2


---

<a id="page-3"></a>
**Page 3**

**II**   **Java RMI**

The paper A Distributed Object Model for the Java System describes Java’s RMI RPC system. The pa-<br>
per mentions that a remote object’s server garbage-collects the object: when there are no local or remote<br>
references to an object, the server can discard the object and free its memory. Suppose that an RMI im-<br>
plementation implements garbage collection by keeping a single reference count in the server for each of<br>
its objects, holding the total number of references to the object, local and remote. Each client notifies an<br>
object’s server whenever the client creates or destroys a reference to the object. For example, at the end of<br>
this client code the acct object’s reference count in the server will be two (assuming no other clients have<br>
references to the object):

`acct` `=` `bank.lookupAccount("12345");`<br>
`acct1` `=` `acct;`

&emsp;**3. \[5 points\]:**   Explain a performance problem with the reference counting implementation outlined<br>
&emsp;above, and explain how to fix it.

If an RMI client crashes while holding one or more reference to an object, it should nevertheless be possible<br>
for the object’s server to eventually garbage-collect the object once no live clients have references to the<br>
object. It’s OK if the server garbage-collects an object referred to by a client that is alive but unreachable<br>
due to network failure.

&emsp;**4. \[10 points\]:**   Suppose an object’s server has noticed that a particular host has crashed. Explain<br>
&emsp;how the server could eventually garbage-collect the object despite the possibility that the host had<br>
&emsp;references to the object when it crashed. Explain any modifications you might need to make to the<br>
&emsp;design outlined above.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3


---

<a id="page-4"></a>
**Page 4**

**III**   **Porcupine**

&emsp;**5. \[10 points\]:**   Consider a performance experiment like the one in Figure 6 of the Porcupine paper,<br>
&emsp;but with all mail addressed to a single recipient. With this workload, roughly how many messages<br>
&emsp;per second would a 30-node non-replicated Porcupine system be able to handle with policy D1? With<br>
&emsp;D2? With D4? Explain your answers.

&emsp;**6. \[10 points\]:**   The R (random) line in Figure 6 is slightly higher than the D1 line. What Porcupine<br>
&emsp;design feature(s) does D1 involve that R does not? What does the graph imply about the value of<br>
&emsp;those feature(s)?

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4


---

<a id="page-5"></a>
**Page 5**

**7. \[10 points\]:**D2 has better performance in Figure 6 than D1. Why?

**8. \[10 points\]:**   Section 4.3 of the Porcupine paper says that Porcupine replicates entire fragments:<br>
the fragment list is really a set of pairs of nodes, and the two nodes in a pair each hold an identical<br>
copy of the relevant fragment. A simpler design might instead put each message in two different<br>
fragments. Then a user’s fragment list would be a set of nodes (rather than a set of node pairs), and<br>
when a new email message arrived, Porcupine would choose a fragment on each of two lightly loaded<br>
nodes and append the new message to both fragments. Why do you suppose Porcupine didn’t take<br>
this simpler approach? What are the advantages of having explicitly replicated fragments?

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;5


---

<a id="page-6"></a>
**Page 6**

**IV**   **Memory Consistency**

The Speedy Compute Cluster Corporation (SCCC) is designing a parallel computer called the SCC. The<br>
SCC is intended to run existing parallel applications that were originally written for an expensive computer<br>
with multiple CPUs and a single memory system shared among those CPUs. The parallel applications have<br>
many threads (one per CPU) that communicate intermediate results through the shared memory.<br>
The SCC will consist of a set of workstations connected by a LAN. Each workstation will have a com-<br>
plete copy of the shared memory in its local RAM. Each workstation’s operating system will intercept the<br>
local application thread’s loads and stores to memory, and execute a network protocol to keep the other<br>
workstations’ copy of the shared memory up to date.<br>
SCCC has hired you to help them understand how their memory protocol will affect their customers’ pro-<br>
grams. SCCC’s main customer spends all its time running this application:

`//` `these` `global` `variables` `are` `correctly` `initialized`<br>
`//` `in` `all` `CPUs’` `memories` `before` `any` `CPU` `starts`<br>
`//` `running` `the` `program:`<br>
`int` `done` `=` `0;`<br>
`int` `x` `=` `1;`<br>
`cpu0(){`<br>
`x` `=` `x` `+` `1;`<br>
`done` `=` `1;`<br>
`}`<br>
`cpu1(){`<br>
`while(done` `==` `0){`<br>
&emsp;`//` `do` `nothing...`<br>
`}`<br>
`x` `=` `x` `*` `3;`<br>
`printf("%dn",` `x);`   `//` `print` `x`<br>
`}`

Based on a student’s comment that they overheard while attending 6.824, SCCC’s engineers have arrived<br>
at the following design for their shared memory protocol. When an application reads from memory, the<br>
load proceeds immediately from the local RAM. When an application writes to memory, the operating<br>
system causes the application to pause, sends a WRITEMEM message containing the written value, the<br>
memory address, and the current real time to every workstation (including itself), waits for responses from<br>
all workstations (including itself), and then lets the application continue.<br>
Every workstation is always capable of receiving and processing a WRITEMEM message (perhaps in an<br>
interrupt). Each workstation processes incoming WRITEMEM messages one at a time. Each workstations<br>
maintains a timestamp on each application memory location in its RAM, containing the time in the WRITE-<br>
MEM message that last updated the memory location. A workstation only updates a memory location in<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;6


---

<a id="page-7"></a>
**Page 7**

response to a WRITEMEM if the time in the WRITEMEM is greater than the timestamp stored for the<br>
memory location. A workstation always replies to a WRITEMEM, even if it did not update. An application<br>
is never allowed to directly store into the local RAM; instead, each workstation’s local memory is only up-<br>
dated by WRITEMEM messages. You can assume that no two WRITEMEMs occur at precisely the same<br>
time (i.e. no two WRITEMEMs will have exactly the same timestamp). Each memory location’s timestamp<br>
is initialized to zero when the program starts; this is smaller than any node’s clock.

&emsp;**9. \[10 points\]:**   Assume all the workstations have exactly synchronized clocks; at any given instant,<br>
&emsp;they all yield the same timestamp. List the possible outputs (final values of x) of the application shown<br>
&emsp;above.

&emsp;**10.**   **\[10 points\]:**   Suppose that the workstation clocks do not agree on what time it is; some are<br>
&emsp;ahead, others are behind. List the possible outputs (final values of x) of the application shown above.

One of SCCC’s engineers suggests that programs will be more likely to run correctly with the follow-<br>
ing protocol addition. When a WRITEMEM arrives, a workstation should compare the timestamp in the<br>
WRITEMEM with the workstation’s clock; if the WRITEMEM’s timestamp is greater than the clock time,<br>
set the clock time to the WRITEMEM’s timestamp.

&emsp;**11.**   **\[10 points\]:**   Assuming this modification, list the possible outputs (final values of x) of the<br>
&emsp;application shown above.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;7


---

<a id="page-8"></a>
**Page 8**


![Page 8 (scanned)](figures/questions-p08-page.png)


---

<a id="page-9"></a>
**Page 9**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**6.824 Questionnaire**

We’d like to ask you for feedback to help us make the course better, both for the rest of this semester and in<br>
future years. Feel free to tear off this page and hand it in separately from the exam for anonymity.<br>
If you could change one thing about 6.824 to make it better, what would it be?

What’s your favorite aspect of 6.824? That is, what shouldn’t we change?

What could we do to make the paper discussions more informative and useful?

Any other suggestions about the labs, lectures, TA, choice of papers, or projects?

