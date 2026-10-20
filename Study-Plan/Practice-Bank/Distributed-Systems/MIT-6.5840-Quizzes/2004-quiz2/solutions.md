# MIT 6.824/6.5840 2004: Quiz 2: Official solutions

> Copied from the original: <https://pdos.csail.mit.edu/6.824/quizzes.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**


![Figure on page 1](figures/solutions-p01-fig01.png)

&emsp;&emsp;Department of Electrical Engineering and Computer Science<br>
MASSACHUSETTS INSTITUTE OF TECHNOLOGY<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**6.824 Spring 2004**<br>
&emsp;**Final Exam Solutions**

The average score was 84, the standard deviation was 6.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1


---

<a id="page-2"></a>
**Page 2**

**I**   **Short Questions**

&emsp;**1.**   **\[5 points\]:**   Consider the system described in the paper “Hypervisor-based Fault Tolerance.”<br>
&emsp;Suppose the primary fails due to a power failure, the backup takes over, and then power to the primary<br>
&emsp;is restored. You would like the primary to resume replicated execution so that the system could tolerate<br>
&emsp;a subsequent failure of the backup. Is this likely to be easy with hypervisor-based fault-tolerance?<br>
&emsp;Why or why not?<br>
&emsp;**It would be difficult to install the correct state on the old primary. The backup would have been**<br>
&emsp;**executing for a while, changing its memory, registers, disk etc. All of the backup’s state would**<br>
&emsp;**have to be transferred to the old primary. Alternately, the old primary could be started afresh,**<br>
&emsp;**and one could re-issue the entire history of operations over the life of the system.**

&emsp;**2.**   **\[5 points\]:**   The Coral paper (“Democratizing content publication with Coral”) mentions in<br>
&emsp;Sections 2.3 and 4.2 that Coral’s “sloppy” DHT can store multiple different values for each key. What<br>
&emsp;would break, or not work as well, if Coral’s DHT only stored one value for each key?<br>
&emsp;**CoralCDN uses the multiple key feature to allow it to associate multiple proxies with each URL**<br>
&emsp;**and with each IP address prefix. The choice provided by these multiple proxies helps CoralCDN**<br>
&emsp;**spread the load of serving cached pages, and allows it to choose a proxy that’s close to the client.**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2


---

<a id="page-3"></a>
**Page 3**

**II**   **Performance**

Samantha, a web site design consultant, is helping Acme Services build a web server system for on-line<br>
commerce. The system has three parts. A single load balancer routes each incoming HTTP request to<br>
a different front end server. Each front end server is in charge of generating personalized web pages for<br>
different visitors. The front end servers consult a back-end database server for information such as visitor<br>
preferences, shopping cart contents, and inventory levels.


![Figure on page 3](figures/solutions-p03-fig02.png)

The load balancer sends HTTP requests to the front ends in round-robin order. The front ends communicate<br>
with the database server using UDP RPCs. Each client HTTP request involves the front end sending just<br>
one RPC to the database server. The front ends do not re-send these RPCs; if the front end gets no response<br>
after 100 seconds, it sends an error message to the HTTP client.<br>
Each front end has a CPU fast enough to complete one client HTTP request per second. Since a front end<br>
may have to wait for the database server, each front end can keep track of many requests at the same time.<br>
Every time a front end receives a client HTTP request, it immediately issues an RPC to the database server.<br>
The front end can keep track of an unlimited number of client HTTP requests, and thus keep an unlimited<br>
number of RPCs in flight to the database server.<br>
The database server is fast enough to process three RPCs per second. The database server has an input queue<br>
that can contain 100 RPCs: if RPCs arrive faster than the server can process them, the RPCs are placed on<br>
this queue. If an RPC arrives when the queue is full, the database server simply discards the RPC. The<br>
database server serves queued RPCs in the order that they arrived.<br>
Samantha decides to measure the performance of this system. She collects lots of hosts to simulate clients,<br>
and sets up the clients so that she can control the total load (in HTTP requests issued per second) that the<br>
clients place on the server system. Samantha tests the system over a range of loads, measuring the number<br>
of client HTTP requests completed per second. Here is what she sees:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3


---

<a id="page-4"></a>
**Page 4**


![Figure on page 4](figures/solutions-p04-fig03.png)

&emsp;**3. \[5 points\]:** Why does the performance curve stop rising at 3?<br>
&emsp;**The database server can only finish three RPCs per second. Since each client HTTP request**<br>
&emsp;**involves one RPC, only three of them can be completed per second.**

&emsp;**4. \[5 points\]:** When the input rate is 4 requests/second, the output rate is only 3 requests/second.<br>
&emsp;What happens to the extra request per second?<br>
&emsp;**The database server drops the extra RPCs because its input queue is full.**

Samantha’s employer, Henryk Acme, reviews her design and notices that the front ends do not re-send<br>
RPCs. Henryk demands that Samantha change the front ends so that they re-send an RPC if no response is<br>
received after five seconds. Samantha makes this change, but arranges that a front end re-sends an RPC at<br>
most once (for a total of two times at most). As before, a front end waits for 100 seconds after it sends the<br>
second RPC, then (if it still gets no response from the database server) the front end sends an error message<br>
to the HTTP client.<br>
Samantha re-runs her performance tests and sees this result:

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4


---

<a id="page-5"></a>
**Page 5**


![Figure on page 5](figures/solutions-p05-fig04.png)

**5. \[5 points\]:** Why does the completion rate drop after 3 requests/second, instead of staying flat at<br>
y=3 as in the previous graph?<br>
**As soon as the request rate hits 3 per second, the database server’s input RPC queue will be full**<br>
**most of the time. Since the queue has 100 entries, and each entry takes a third of a second to**<br>
**process, an RPC will stay on the queue for about 33 seconds. This is longer than the front end’s**<br>
**timeout period of 5 seconds, which means that the front ends will send every RPC twice. Thus**<br>
**the database server will waste time executing some RPCs twice, and complete fewer than three**<br>
**useful RPCs per second.**

**6. \[5 points\]:** Why does the completion rate level out at about 1.5 completions/second?<br>
**If the front end executes every RPC twice, it will complete only 1.5 useful RPCs per second.**<br>
**(Mike Walfish points out that the fraction of useful RPC completions will rise as the input load**<br>
**rises, since it’s unlikely that both transmissions of a given RPC will encounter a non-full queue.)**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;5


---

<a id="page-6"></a>
**Page 6**

**III**   **TreadMarks**

Look at the paper “TreadMarks: Distributed Shared Memory on Standard Workstations and Operating Sys-<br>
tems,” by Keleher et al. Suppose you are running the following parallel shared-memory program on three<br>
workstations, W1, W2, and W3.

`A1()` `{`<br>
`x` `=` `1;`<br>
`Acquire(L1);`<br>
`y` `=` `1;`<br>
`Release(L1);`<br>
`}`<br>
`A2()` `{`<br>
`Acquire(L1);`<br>
`z` `=` `y;`<br>
`Release(L1);`<br>
`}`<br>
`A3()` `{`<br>
`Acquire(L1);`<br>
`printf("x=%d` `y=%d` `z=%dn",` `x,` `y,` `z);`<br>
`Release(L1);`<br>
`}`

At about the same time, W1 executes `A1()`, W2 executes `A2()`, W3 executes `A3()`. The variables `x`,<br>
`y`, and `z` all start out containing zero. `Acquire()` and `Release()` are the functions that TreadMarks<br>
supplies to acquire and release locks. `L1` is the name of a lock. There are no failures, the network delivers<br>
all messages, and there is no other activity in the system.

&emsp;**7. \[5 points\]:**   Workstation W3 prints three numbers. Given TreadMark’s consistency algorithms,<br>
&emsp;only some outputs from W3 are possible. For each of the following outputs, write “yes” if it is a<br>
&emsp;possible output, and “no” if it is not.

&emsp;&emsp;&emsp;`x=0` `y=1` `z=1`   `No.` `x=0` `means` `A3` `executed` `before` `the` `y=1` `in` `A1.`<br>
&emsp;&emsp;&emsp;`x=1` `y=1` `z=0`   `Yes.` `A3` `executed` `after` `A1` `and` `before` `A2.`<br>
&emsp;&emsp;&emsp;`x=1` `y=0` `z=1`   `No.` `W2` `would` `have` `told` `W3` `about` `y=1` `as` `well` `as` `z=1.`

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;6


---

<a id="page-7"></a>
**Page 7**

Now consider this shared-memory TreadMarks program:

`B1()` `{`<br>
`x` `=` `1;`<br>
`printf("x=%d` `y=%dn",` `x,` `y);`<br>
`}`<br>
`B2()` `{`<br>
`y` `=` `1;`<br>
`printf("x=%d` `y=%dn",` `x,` `y);`<br>
`}`

Workstation W1 starts executing `B1()` at about the same time as workstation W2 starts executing `B2()`.<br>
`x` and `y` start out containing zero. There are no failures, the network delivers all messages, and there is no<br>
other activity in the system.

&emsp;**8. \[5 points\]:**   Is it possible for W1 to print “x=1 y=0” `and` for W2 to print “x=0 y=1”? Describe<br>
&emsp;how this might occur, or explain how TreadMarks prevents it from occurring.<br>
&emsp;**This could occur. Neither program acquired any locks, so neither will learn about the other’s**<br>
&emsp;**writes to variables.**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;7


---

<a id="page-8"></a>
**Page 8**

Finally, suppose you now run this shared-memory TreadMarks program:

`C1()` `{`<br>
`Acquire(L1);`<br>
`x` `=` `1;`<br>
`Release(L1);`<br>
`Acquire(L2);`<br>
`y` `=` `1;`<br>
`Release(L2);`<br>
`}`<br>
`C2()` `{`<br>
`Acquire(L1);`<br>
`printf("xa=%dn",` `x);`<br>
`x` `=` `2;`<br>
`Release(L1);`<br>
`}`<br>
`C3()` `{`<br>
`Acquire(L1);`<br>
`printf("xb=%dn",` `x);`<br>
`Release(L1);`<br>
`Acquire(L2);`<br>
`printf("y=%dn",` `y);`<br>
`printf("xc=%dn",` `x);`<br>
`Release(L2);`<br>
`}`

At about the same time, W1 starts executing `B1()`, W2 starts executing `B2()`, and W3 starts executing<br>
`B3()`. `x` and `y` start out containing zero. There are no failures, the network delivers all messages, and there<br>
is no other activity in the system.

&emsp;**9.**   **\[5 points\]:**   Suppose you run this parallel program and it prints “xa=1”, then “xb=2”, then<br>
&emsp;“y=1”. Is it possible for the next printout to be “xc=1”? Describe how this might occur, or explain<br>
&emsp;how TreadMarks prevents this from occurring.<br>
&emsp;**This could not occur. The xa=1 means that C2 acquired L1 after C1 set x=1; the xb=2 means**<br>
&emsp;**that C3 acquired L1 after C2 released it. Thus C2 would have sent C3 a version vector that**<br>
&emsp;**included C1’s assignment to x. C3 then knows when it acquires L2 from C1 that it already**<br>
&emsp;**knows about any writes C1 performed before C1 release L1, and thus C3 knows to ignore C1’s**<br>
&emsp;**write to x. Equivalently, the version vectors tell C3 to order C2’s write to x after C1’s write to x.**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;8


---

<a id="page-9"></a>
**Page 9**

**IV**   **Two-Phase Commit**

The figure below shows a successful execution of two-phase commit. The client asks the transaction man-<br>
ager (TM) to organize an atomic transaction involving servers A, B, and C. A transaction is atomic if either<br>
all three servers execute their part of the transaction, or none of them execute it. The TM sends prepare<br>
messages over the network to the three servers asking them if they are willing to perform the transaction.<br>
Each server that is willing (in this case all of them) sends a prepare-ok message to the TM. If the TM collects<br>
prepare-ok messages from all three servers, the TM sends a commit message to each server, and then sends<br>
a commit-done message to the client. A server executes the transaction when it receives a commit message.


![Figure on page 9](figures/solutions-p09-fig05.png)

If a server receives a prepare message and thinks it won’t be able to commit, it returns a prepare-abort<br>
message to the TM, and the TM sends abort messages to all the servers and an abort-done message to the<br>
client.<br>
For example, in a banking application, a transfer transaction might involve server A debiting account #1,<br>
server B crediting account #2, and server C appending an audit record to a file. When server A receives<br>
the prepare message, server A must check that the account #1 exists and contains enough money; if it does,<br>
server A sends a prepare-ok; if it does not, server A sends a prepare-abort. If server A send a prepare-ok,<br>
it must lock account #1 to ensure that it continues to contain enough money. If A then receives a commit<br>
message, it debits the account and then releases the lock. If A receives an abort from the TM, it just releases<br>
the lock.<br>
The tricky part about two-phase commit is how to handle server or TM failures. The immediate symptom<br>
of a server or TM failure will be that one or more hosts will block: they will wait indefinitely for a message<br>
from the failed host. For example, if server A fails before sending its prepare-ok message, then the TM<br>
will block waiting for that message. A host may block even if there are no host failures, for example if<br>
the network breaks or drops packets or delays packets. When possible the participants would like to avoid<br>
blocking forever. The general approach is to have each host impose a timeout on how long it is willing to<br>
wait for each message, and to take some action after a timeout in order to attempt to resolve the transaction<br>
(either committing or aborting it). In some cases this works, but in other cases the participants have to wait<br>
for the failed host to re-start.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;9


---

<a id="page-10"></a>
**Page 10**

For all of these questions you should assume that there is never any confusion about which transaction a<br>
message is part of (because the messages carry transaction IDs). You should also assume that all participants<br>
follow the protocol to the best of their ability.

&emsp;**10. \[5 points\]:**   Suppose that the TM has sent all the prepare messages but has not yet received a<br>
&emsp;prepare-ok (or prepare-abort) from server A. Would it be correct for the TM to abort the transaction<br>
&emsp;at this point, sending abort messages to the servers and an abort-done message to the client? Why or<br>
&emsp;why not?<br>
&emsp;**Yes. No server has executed the transaction since the TM hasn’t sent any commit messages yet.**<br>
&emsp;**Thus it’s still OK to abort.**

&emsp;**11.**   **\[5 points\]:**   Suppose again that the TM has sent all the prepare messages but has not yet<br>
&emsp;received a prepare-ok (or prepare-abort) from server A. Would it be correct for the TM to commit the<br>
&emsp;transaction at this point? Why or why not?<br>
&emsp;**No. Server A might be unable to execute the transaction. Perhaps server A sent a prepare-abort**<br>
&emsp;**that the network lost or delayed, or perhaps server A has crashed.**

&emsp;**12.**   **\[5 points\]:**   Suppose that server A has received the prepare, sent the prepare-ok, but has not<br>
&emsp;yet received a commit or abort message. Server A contacts server B and discovers that server B has<br>
&emsp;received a commit message. Would it be correct for server A to execute its part of the transaction at<br>
&emsp;this point, as if it too had received a commit message? Why or why not?<br>
&emsp;**Yes. The TM must have sent commit messages to all the servers, so it’s OK for server A to**<br>
&emsp;**pretend it received the message.**

&emsp;**13. \[5 points\]:** Suppose again that server A has received the prepare, sent the prepare-ok, but has<br>
&emsp;not yet received a commit or abort message. Server A contacts server B and discovers that server B<br>
&emsp;has also received the prepare, sent a prepare-ok, but has not yet received a commit or abort. Server<br>
&emsp;A cannot reach server C. It turns out that it’s not correct for A to either abort or commit in this case;<br>
&emsp;it must wait until it can contact the TM and find out whether the TM decided to abort or commit.<br>
&emsp;Describe two sequences of events that are consistent with A’s observations: one in which the TM<br>
&emsp;decides to commit the transaction, and another in which the TM decides to abort the transaction.<br>
&emsp;**Commit case: C sent a prepare-ok to the TM, the TM sent commit messages to the servers**<br>
&emsp;**and commit-done to the client, server C received the commit and executed, the network lost the**<br>
&emsp;**commit messages to the other two servers, then TM and C crash.**<br>
&emsp;**Abort case: C sent a prepare-abort to the TM, the TM sent abort messages to the servers and**<br>
&emsp;**abort-done to the client, the network lost the abort messages to the other two servers, then TM**<br>
&emsp;**and C crash.**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;10


---

<a id="page-11"></a>
**Page 11**

**14. \[5 points\]:** Suppose again that server A has received the prepare, sent the prepare-ok, but has<br>
not yet received a commit or abort message. This time server A contacts both server B and server C<br>
and discovers that both of them have received the prepare, sent a prepare-ok, but have not yet received<br>
a commit or abort. Would it be correct for server A to execute its part of the transaction at this point,<br>
as if it too had received a commit message? Why or why not?<br>
**It would not be correct for A to execute the transaction. The TM might have timed out waiting**<br>
**for one of the prepare-ok messages and decided to abort. (The “too” is a typo.)**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;11


---

<a id="page-12"></a>
**Page 12**

**V**   **Frangipani**

Suppose you have a file service that uses the system described in “Frangipani: A Scalable Distributed File<br>
System” by Thekkath et al. You have four Frangipani servers, S1, S2, S3, and S4, as well as some clients<br>
and Petal servers. The Petal servers are separate computers.<br>
Suppose you start with two empty directories, “d1” and “d2”. The following sequence of events occurs:<br>
**A.** A client asks S1 to create a file “d1/a”, and S1 returns a successful reply.<br>
**B.** A client asks S1 to create a file “d2/b”, and S1 returns a successful reply.<br>
**C.** A client asks S2 to delete file “d2/b”, and S2 returns a successful reply.<br>
**D.** S1 stops executing unexpectedly, and does not reboot.<br>
**E.** S3 runs the recovery demon for S1, and recovery completes.<br>
There is no activity in the system except activity caused by these events, and there are no failures other than<br>
the crash of S1.

&emsp;**15. \[5 points\]:**   After recovery is complete, will file “d1/a” exist, not exist, or can you not predict?<br>
&emsp;Please explain your answer.<br>
&emsp;**It will exist. When S1 gave up the lock on d2/b to S2, S1 would have flushed its in-memory log**<br>
&emsp;**to Petal, including the log record describing the creation of d1/a. The recovery demon will see**<br>
&emsp;**that log record and re-execute the create.**

&emsp;**16. \[5 points\]:**   After recovery is complete, will file “d2/b” exist, not exist, or can you not predict?<br>
&emsp;Please explain your answer.<br>
&emsp;**d2/b will not exist. If S2 hasn’t given up its lock on d2 by the time that the recovery demon**<br>
&emsp;**finishes, then next time anyone looks at d2/b S2 will write its changes to d2 to Petal before giving**<br>
&emsp;**up the lock. These changes will override any changes to d2 made by the recovery demon. If S2**<br>
&emsp;**gave up its lock and wrote its changes to d2 before the recovery demon ran, then the recovery**<br>
&emsp;**demon will see that the version number for d2 in S1’s log is less than the version number for d2**<br>
&emsp;**that S2 wrote to Petal, and the recovery demon will ignore that log entry.**

&emsp;**17. \[5 points\]:**   Suppose (as would probably be the case) that S2 holds an exclusive lock on “d2”<br>
&emsp;when recovery starts. Does the recovery demon need to acquire the lock on “d2”? Why or why not?<br>
&emsp;**No, the recovery demon does not need to acquire the lock on d2. The version number mechanism**<br>
&emsp;**is sufficient for the recovery demon to decide which log records it can replay.**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;12


---

<a id="page-13"></a>
**Page 13**

**VI**   **Freenet**

A Freenet host (“Freenet: A Distributed Anonymous Information Storage and Retrieval System”) contains<br>
a routing table and a data store. Both are indexed by numeric keys. A routing table entry contains the IP<br>
address of a Freenet host, while a data store entry contains the data (file) associated with the corresponding<br>
key.<br>
Here are five Freenet nodes, each labeled with its routing table and data store. The keys are in decimal.


![Figure on page 13](figures/solutions-p13-fig06.png)

For example, host B’s routing table contains an entry with key 160 referring to host D, and B’s data store<br>
contains two files, one with key 24 and one with key 127.

&emsp;**18. \[5 points\]:** What sequence of hosts would be visited by a query from A for key 200? Assume a<br>
&emsp;hops-to-live limit of 20.<br>
&emsp;**A D E**

&emsp;**19. \[5 points\]:** What sequence of hosts would be visited by a query from A for key 127? Assume a<br>
&emsp;hops-to-live limit of 20.<br>
&emsp;**A C D C (D) E C (E) (D) (C) E (C) B. The parentheses mark nodes to which the query back-**<br>
&emsp;**tracks after failure.**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;13

