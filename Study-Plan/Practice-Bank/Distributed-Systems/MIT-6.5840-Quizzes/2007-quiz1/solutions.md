# MIT 6.824/6.5840 2007: Quiz 1: Official solutions

> Copied from the original: <https://pdos.csail.mit.edu/6.824/quizzes.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**


![Figure on page 1](figures/solutions-p01-fig01.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Department of Electrical Engineering and Computer Science<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;MASSACHUSETTS INSTITUTE OF TECHNOLOGY<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**6.824 Distributed System Engineering: Fall 2007**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Quiz I**

&emsp;All problems are open-ended questions. In order to receive credit you must answer the question<br>
&emsp;as precisely as possible. You have 80 minutes to answer this quiz.<br>
&emsp;Write your name on this cover sheet AND at the bottom of each page of this booklet.<br>
&emsp;Some questions may be much harder than others. Read them all through first and attack them in<br>
&emsp;the order that allows you to make the most progress. If you find a question ambiguous, be sure<br>
&emsp;to write down any assumptions you make. Be neat. If we can’t understand your answer, we can’t<br>
&emsp;give you credit!<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**THIS IS AN OPEN BOOK, OPEN NOTES QUIZ.**

**I (xx/25)**   **II (xx/10)**   **III (xx/10)**   **IV (xx/15)**   **V (xx/15)**   **VI (xx/15)**   **VII (xx/10)**   **Total (xx/100)**

**Name:**


---

<a id="page-2"></a>
**Page 2**


![Page 2 (scanned)](figures/solutions-p02-page.png)


---

<a id="page-3"></a>
**Page 3**

6.824 FALL 2007, Quiz 1   **Page 3 of 12**<br>
**I**   **Remote procedure call**

Ben finds writing programs with the YFS RPC library painful. After struggling with sequence numbers in<br>
lab 1 (lock server) and lab 5 (caching lock server), Ben wonders if he could get rid of sequence numbers<br>
(and the corresponding code) if the RPC library sends all RPCs over TCP instead of UDP. TCP is a reliable<br>
transport protocol that delivers packets to their destination even when the network may lose packets, and<br>
delivers all packets of a connection in order.<br>
Ben modifies lock client, server, and YFS RPC library as follows:

&emsp;• He removes the code that handles sequence numbers from client and server (i.e., the code to detect<br>
&emsp;out of order, duplicate, etc. messages);<br>
&emsp;• He removes his sequence numbers as arguments from `cl.call` calls (where `cl` is an `rpcc` object);<br>
&emsp;• He changes the implementation of `cl.call` to start a TCP connection to the destination, if no TCP<br>
&emsp;connection to the destination exists;<br>
&emsp;• `cl.call` sends the request over the TCP connection;<br>
&emsp;• He keeps the retransmission code so that the library retransmits after a second or so to recover from<br>
&emsp;potentially failed TCP connections (e.g., if the destination fails or there is long enough network par-<br>
&emsp;tition). The retry code will keep attempting to connect and set up a new TCP connection to the<br>
&emsp;destination until the source has received the RPC response from the server.

&emsp;**1. \[10 points\]:** Show a scenario in which the server sees a duplicate request for lock “a” from the<br>
&emsp;same client. (Draw a message time diagram. Use a time line for each client and server involves, and<br>
&emsp;show labeled arrows between the lines for each message.)<br>
&emsp;&emsp;Any situation is fine that involved a packet being delayed long enough in the network to cause YFS<br>
&emsp;RPC to start a new TCP connection and retransmit. The simplest, and most common, solution:


![Figure on page 3](figures/solutions-p03-fig03.png)

**Name:**


---

<a id="page-4"></a>
**Page 4**

6.824 FALL 2007, Quiz 1   **Page 4 of 12**

&emsp;**2. \[10 points\]:** Show a scenario in which the server gives lock “a” to two different clients, violating<br>
&emsp;the goal that only one client should have the lock at any time. (Draw a message time diagram.)<br>
&emsp;&emsp;The most straightforward solution is to have a delayed release reach the lock server after a second<br>
&emsp;acquire, falsely making the lock server think the client had released its lock, freeing it up for another<br>
&emsp;client. The network or the operating system must delay the original release long enough for YFS<br>
&emsp;to create a new TCP connection and resend the release. Note that the diagram below assumes a<br>
&emsp;non-caching lock server, though you can make it work with the caching lock server as well.


![Figure on page 4](figures/solutions-p04-fig04.png)

&emsp;**3. \[5 points\]:** Frustrated, Ben removes the retransmission code from the RPC library too, completely<br>
&emsp;relying on TCP for retransmission. But, now he observes that the client can get into a state where it<br>
&emsp;cannot successfully complete its RPC (i.e., it receives no response from the lock server). Show a<br>
&emsp;scenario that results in this behavior. (Draw a message time diagram.)<br>
&emsp;&emsp;Without RPC retries, any long network failure will cause TCP to give up and fail the connection,<br>
&emsp;returning -1 to the lock client’s call. For example:


![Figure on page 4](figures/solutions-p04-fig05.png)

**Name:**


---

<a id="page-5"></a>
**Page 5**

6.824 FALL 2007, Quiz 1   **Page 5 of 12**<br>
**II**   **Threads and mutexes**

Ben used fine-grain pthread locking in lab 5, but otherwise followed the instructions of the staff. After<br>
60 hours of debugging a concurrency hell, he throws away his fine-grained locking implementation and<br>
switches to very coarse-grain locking. The sketch of his new client code is as follows:

`//` `Release` `l,` `and` `send` `the` `lock` `to` `the` `server` `if` `the` `lock` `has` `been` `revoked`<br>
`release(lock` `l)`<br>
`{`<br>
`pthread_mutex_lock(&client_lock);`<br>
`...`<br>
`if` `(revoked[l])`<br>
&emsp;&emsp;`cl.call(server,` `RELEASE,` `...)`<br>
`...`<br>
`pthread_mutex_unlock(&client_lock);`<br>
`}`<br>
`//` `A` `revoke` `request` `from` `the` `lock` `server,` `which` `sets` `revoked` `for` `lock` `l`<br>
`revokereq(lock` `l)`<br>
`{`<br>
`pthread_mutex_lock(&client_lock);`<br>
`...`<br>
`revoked[l]` `=` `true;`   `//` `tell` `client` `that` `it` `should` `release` `lock` `l`<br>
`...`<br>
`pthread_mutex_unlock(&client_lock);`<br>
`}`<br>
The relevant server code is as follows:

`//` `A` `client` `asks` `for` `lock` `l`<br>
`acquirereq(lock` `l)`<br>
`{`<br>
`pthread_mutex_lock(&server_lock);`<br>
`...`<br>
`if` `(taken[l])`<br>
&emsp;`cl.call(holder_of_lock,` `REVOKE,` `...);`   `//` `tell` `holder` `to` `release` `lock` `l`<br>
`...`<br>
`taken[l]` `=` `true;`   `//` `a` `client` `has` `taken` `lock` `l`<br>
`...`<br>
`pthread_mutex_unlock(&server_lock);`<br>
`}`<br>
`//` `A` `client` `asks` `to` `release` `l`<br>
`releasereq(lock` `l)`<br>
`{`<br>
`pthread_mutex_lock(&server_lock);`<br>
`...`<br>
`taken[l]` `=` `false;`   `//` `client` `releases` `lock` `l`<br>
`...`<br>
`pthread_mutex_unlock(&server_lock);`<br>
`}`<br>
**Name:**


---

<a id="page-6"></a>
**Page 6**

6.824 FALL 2007, Quiz 1   **Page 6 of 12**

&emsp;**4. \[10 points\]:** Now the system deadlocks once in a while. Show a scenario that results in a deadlock.<br>
&emsp;(Draw a message time diagram.)<br>
&emsp;&emsp;There are a few ways by which the system can deadlock. One good way is for a release RPC and a<br>
&emsp;revoke RPC to cross paths. The server will be holding its lock waiting for the response for the revoke,<br>
&emsp;while the client will be holding its lock waiting for the response to the release. Neither will be able<br>
&emsp;to process the incoming RPC until it gets the response for its outstanding RPC (which will of course<br>
&emsp;never be processed).


![Figure on page 6](figures/solutions-p06-fig06.png)

**Name:**


---

<a id="page-7"></a>
**Page 7**

6.824 FALL 2007, Quiz 1   **Page 7 of 12**<br>
**III**   **Peer-to-peer: lookup**

The pseudocode for Chord’s join implementation, from figure 7 of the paper “Chord: a scalable peer-to-peer<br>
lookup service for Internet applications”, is as follows:

`n.join(n1)`<br>
`predecessor` `=` `nil;`<br>
`successor` `=` `n1.find_successor(n);`<br>
`n.stabilize()`<br>
`x` `=` `successor.predecessor;`<br>
`if` `(x` `in` `(n,` `successor))`<br>
&emsp;`successor` `=` `x;`<br>
`successor.notify(n);`<br>
`n.notify(n1)`<br>
`if` `(predecessor` `is` `nil` `or` `n1` `in` `(predecessor,` `n))`<br>
&emsp;`predecessor` `=` `n1;`

Ben observes that the Chord code for stabilization uses an indirect method to set the predecessor of a node,<br>
and proposes the following modifications to this pseudocode:

`n.joinnew(n1)`<br>
`successor` `=` `n1.find_successor(n)`<br>
`if` `(successor` `is` `not` `nil)`<br>
&emsp;`predecessor` `=` `successor.predecessor;`<br>
&emsp;`if` `(predecessor` `is` `not` `nil)`<br>
&emsp;&emsp;`predecessor.set_successor(n);`<br>
&emsp;`successor.set_predecessor(n);`

`joinnew` replaces the existing join implementation from the paper, and Ben removes `stabilize` and<br>
`notify`.

&emsp;**5. \[10 points\]:** Why is this change a bad one? (Give a brief explanation and a scenario that illustrates<br>
&emsp;your explanation.)<br>
&emsp;If nodes with close node IDs join at the same time, only one might appear in the succ ring. For<br>
&emsp;example, if a Chord ring consists of nodes 1 and 4, and nodes 2 and 3 join the ring concurrently, it’s<br>
&emsp;possible for both new nodes to have node 4 for a successor, and node 1 for a predecessor, and never<br>
&emsp;find out about each other. In addition, if node leave the system, the ring doesn’t repair because Ben<br>
&emsp;deleted stabilize.

**Name:**


---

<a id="page-8"></a>
**Page 8**

6.824 FALL 2007, Quiz 1   **Page 8 of 12**<br>
**IV**   **Peer-to-peer: data distribution**

&emsp;**6. \[5 points\]:** Explain briefly the purpose of Bittorrent’s choke algorithm.<br>
&emsp;To implement a tit-for-tat scheme so that nodes download at a rate proportional to their upload rate.

&emsp;**7.**   **\[10 points\]:** If there are a few high-upload peers and many low-upload peers, does Bittorrent<br>
&emsp;achieve the lowest total download time (across all peers)? If yes, give a brief argument why. If no,<br>
&emsp;give a modification to the Bittorrent protocol that is likely to reduce the total download time.<br>
&emsp;No. The choke algorithm will make it likely that high upload peers match up with other high upload<br>
&emsp;peers, and low upload peers with low upload peers. The high upload peers will finish quickly and then<br>
&emsp;are likely to leave the system. Several fixes are possible: incentive high upload peers to stay online,<br>
&emsp;remove penalty for low-upload nodes, etc.

**Name:**


---

<a id="page-9"></a>
**Page 9**

6.824 FALL 2007, Quiz 1   **Page 9 of 12**<br>
**V**   **Consistency**

Ben runs the following program on a computer with two processors and a single shared memory (with<br>
in-order execution of memory operations and no caches):

`processor` `0:`<br>
&emsp;`x` `=` `1;`<br>
&emsp;`if(y` `==` `0)`<br>
&emsp;&emsp;`critical` `section;`<br>
`processor` `1:`<br>
&emsp;`y` `=` `1;`<br>
&emsp;`if(x` `==` `0)`<br>
&emsp;&emsp;`critical` `section;`

On his computer at most one processor enters the critical section, as it should.

&emsp;**8. \[5 points\]:** Ben ports the program to the distributed shared memory (DSM) system described by<br>
&emsp;Li and Hudak in “Memory Coherence in Shared Virtual Memory Systems”. What consistency model<br>
&emsp;is implemented by DSM that makes this program work correctly? “Correctly” in this question means<br>
&emsp;if two computers share `x` and `y` through DSM only one computer enters `critical` `section`.<br>
&emsp;(Explain your answer briefly.)<br>
&emsp;DSM provides sequentially consistency. An implementation of a sequentially-consistent memory must<br>
&emsp;ensure that there is some total order for all concurrent read and write operations that is also consistent<br>
&emsp;with the order of the operations on a given processor. There is no total order that can result in<br>
&emsp;computer 0 and 1 both entering the critical section.

**Name:**


---

<a id="page-10"></a>
**Page 10**

6.824 FALL 2007, Quiz 1   **Page 10 of 12**

Ben modifies DSM slightly to get a bit more parallelism. The relevant portion of the pseudocode is the<br>
following fragment from section 3.2:

`Write` `fault` `handler:`<br>
`lock(ptable[p].lock);`<br>
`IF` `I` `am` `manager` `THEN` `BEGIN`<br>
&emsp;`receive` `page` `p` `from` `owner[p];`<br>
`ELSE`<br>
&emsp;`ask` `manager` `for` `write` `access` `to` `p;`<br>
`invalidate(p,` `ptable[p].copyset);`<br>
`ptable[p].access` `=` `write;`<br>
`ptable[p].copy_set` `=` `{};`<br>
`unlock(ptable[p].lock)`

Ben changes the implementation of `invalidate`. The implementation in the paper returns from the call<br>
to `invalidate` after it has received acknowledgements from all of the computers listed in `copyset`.<br>
Ben modifies `invalidate` to return as soon it has sent off the invalidation messages to all computers in<br>
`copyset`. His hope is to get better performance because the write fault handler doesn’t have to wait until<br>
the acknowledgements on the invalidate messages have been received.

&emsp;**9. \[10 points\]:** Does Ben’s program still run correctly? (Briefly explain.)<br>
&emsp;No. For example, consider the case that processor 0 and 1 have both a read-only copy of the pages<br>
&emsp;that contain x and y, and that x and y are on different pages. After processor 0 updates x, it may take a<br>
&emsp;long time before processor 1 finds out about the update and processor 0 doesn’t wait until processor<br>
&emsp;1 acknowledges that it has received the update. In the mean time processor 1 can get ownership of<br>
&emsp;the page that contains y, update y, and then read its out-of-date copy of the page that contains x. The<br>
&emsp;update of y might not arrive at processor 0 before it has read an out-of-date copy of the page that<br>
&emsp;contains y. Processor 0 will read 0 for x and processor 1 will 0 for y, and both will enter the critical<br>
&emsp;section.

**Name:**


---

<a id="page-11"></a>
**Page 11**

6.824 FALL 2007, Quiz 1   **Page 11 of 12**<br>
**VI**   **Caching in YFS**

When running YFS with the caching lock server and extent server (lab 6), an alert 6.824 student observes<br>
the following communication pattern often. When two clients are sharing the same file “f”, YFS transfers<br>
the extent for file “f” between the two clients through the extent server. That is, when client 1 has modified<br>
“f” and client 2 wants the file, client 1 writes the extent on the release of the lock for file “f” to the extent<br>
server. When client 2 receives the lock for file “f” from the lock server, it reads the extent for file “f” from<br>
the extent server. The extent for file f is transferred twice over the network, and when “f” is large, the student<br>
observes long delays before client 2 receives the extent for “f”.

&emsp;**10. \[15 points\]:** Describe a small, simple set of changes to the YFS protocols used in lab 6 so that<br>
&emsp;YFS transfers the extent for “f” only once over the network (i.e., directly from client 1 to 2). Your<br>
&emsp;modified protocol should pass all the tests for lab 6 and work under lossy conditions (i.e., the network<br>
&emsp;may lose packets). Make sure to specify the RPCs in your modified protocol, their arguments, and<br>
&emsp;their results.<br>
&emsp;&emsp;There were several possible correct solutions to this problem. One very simple one is to store **pointers**<br>
&emsp;to extents at the extent server, rather than the extents themselves. Thus, on a `dorelease()/flush()`,<br>
&emsp;the YFS server will `put()` its own hostname:port on the extent server, instead of the extent itself, and<br>
&emsp;keep the extent locally cached. Then a `get()` call from another client fetches the hostname:port,<br>
&emsp;and then uses a new RPC (say `get`   `cached`   `extent`) to retrieve the extent directly from the client.<br>
&emsp;Though this adds an extra round trip time, it doesn’t involve modifying the lock protocol. This assumes<br>
&emsp;clients never fail.

&emsp;&emsp;**–** `put(extentid`   `t` `id,` `int` `seqno,` `std::string` `&client)`<br>
&emsp;&emsp;**–** `get`   `cached`   `extent(extentid`   `t` `id,` `int` `&dummy)`<br>
&emsp;Note that the sequence number is necessary in the put to avoid a duplicated delayed packet in a lossy<br>
&emsp;network overwriting the put from a newer extent owner. The usual extent-locking convention ensures<br>
&emsp;that a `get()` always see the most recent writer’s hostname:port.<br>
&emsp;Another workable solution involves modifying the lock protocol to send extents directly to the new<br>
&emsp;lock owner as part of the `dorelease()/flush()` method. In this solution, the lock server adds<br>
&emsp;the hostname:port of the new lock holder in the `revoke()` RPC to the current lock holder. The cur-<br>
&emsp;rent lock holder must then remember this address, and pass it to `flush()` when the lock is released.<br>
&emsp;Then it sends a new RPC (say `put`   `cached`   `extent()`) to the new lock holder’s YFS server, which<br>
&emsp;must add the extent to its cache. After that RPC is complete, the current lock holder can release the<br>
&emsp;lock back to the lock server, which can grant it to the new lock holder. Once the new owner receives<br>
&emsp;the lock, it is guaranteed to have the current version of the extent in its cache. Note that there should<br>
&emsp;be a sequence number attached to the new RPC to avoid problems with delayed puts.

**Name:**


---

<a id="page-12"></a>
**Page 12**

6.824 FALL 2007, Quiz 1   **Page 12 of 12**<br>
**VII**   **6.824**

&emsp;**11. \[5 points\]:** Describe the most memorable error you have made so far in one of the labs. (Provide<br>
&emsp;enough detail so that we can understand your answer.)

We would like to hear your opinions about 6.824, so please answer the following two questions. (Any<br>
relevant answer will receive full credit!)

&emsp;**12. \[3 points\]:** What is the best aspect of 6.824?

&emsp;**13. \[2 points\]:** What is the worst aspect of 6.824?

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;End of Quiz I

**Name:**

