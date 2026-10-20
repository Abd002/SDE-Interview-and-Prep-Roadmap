# MIT 6.824/6.5840 2015: Quiz 1: Official solutions

> Copied from the original: <https://pdos.csail.mit.edu/6.824/quizzes.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**


![Figure on page 1](figures/solutions-p01-fig01.png)

&emsp;&emsp;&emsp;&emsp;Department of Electrical Engineering and Computer Science<br>
&emsp;&emsp;MASSACHUSETTS INSTITUTE OF TECHNOLOGY

**6.824 Distributed System Engineering: Spring 2015**<br>
&emsp;&emsp;&emsp;&emsp;**Exam I Solutions**


---

<a id="page-2"></a>
**Page 2**

6.824 Spring 2015, Exam 1 Solutions   Page 2 of 11

**I**   **Lab 2**

Ben Bungler wants to build a variant of Lab 2 that uses two backups instead of one.<br>
Ben modifies his view server so that it puts two backups into each view (if machines are available).<br>
Ben’s view server designates them backup1 and backup2. If only one backup machine is available,<br>
the view server makes it backup1. If the primary fails, the view server promotes backup1 to be<br>
the new primary. If backup1 dies or is promoted, the view server promotes backup2 (if any) to be<br>
backup1.<br>
Ben is worried that the primary’s network connection to the backups might be slow or unreliable.<br>
He reasons that it’s enough to have a copy of each operation at just one of the two backups, so<br>
he modifies his primary code to forward each operation at first to just backup1; if the RPC fails,<br>
then only in that case does the primary forward to backup2; if that RPC fails, the primary tries<br>
backup1 again; until the RPC to one of them succeeds. Ben knows that this design can’t tolerate<br>
two server failures, but his main focus is allowing the primary to continue quickly in the face of<br>
slow or unreliable connectivity to the backups.

&emsp;**1.**   **\[6 points\]:** Describe a scenario in which clients of Ben’s design will see a serious<br>
&emsp;consistency problem.<br>
&emsp;**Answer:** The client sends put(x,99) to the primary; the primary forwards the put only to<br>
&emsp;backup2; the primary fails and backup1 becomes the new primary; now a get(x) won’t return<br>
&emsp;99.

Ben realizes his design has a flaw. Here’s his plan for fixing it. If the primary dies, then before<br>
taking over as primary, backup1 will send its entire key/value database to backup2.

&emsp;**2. \[6 points\]:** Explain why Ben’s “fixed” design still doesn’t work.<br>
&emsp;**Answer:** The previous answer works here too.


---

<a id="page-3"></a>
**Page 3**

6.824 Spring 2015, Exam 1 Solutions   Page 3 of 11

**II**   **Lab 3**

Here’s a copy of the Paxos pseudo-code from Lab 3:

&emsp;&emsp;&emsp;--- Paxos Proposer ---

&emsp;&emsp;1 proposer(v):<br>
&emsp;&emsp;2   while not decided:<br>
&emsp;&emsp;2   choose n, unique and higher than any n seen so far<br>
&emsp;&emsp;3   send prepare(n) to all servers including self<br>
&emsp;&emsp;4   if prepare\_ok(n, na, va) from majority:<br>
&emsp;&emsp;5   v’ = va with highest na; choose own v otherwise<br>
&emsp;&emsp;6   send accept(n, v’) to all<br>
&emsp;&emsp;7   if accept\_ok(n) from majority:<br>
&emsp;&emsp;8   send decided(v’) to all

&emsp;&emsp;&emsp;--- Paxos Acceptor ---

&emsp;&emsp;9 acceptor state on each node (persistent):<br>
&emsp;10   np   --- highest prepare seen<br>
&emsp;11   na, va --- highest accept seen

&emsp;12 acceptor’s prepare(n) handler:<br>
&emsp;13   if n \> np<br>
&emsp;14   np = n<br>
&emsp;15   reply prepare\_ok(n, na, va)<br>
&emsp;16   else<br>
&emsp;17   reply prepare\_reject

&emsp;18 acceptor’s accept(n, v) handler:<br>
&emsp;19   if n \>= np<br>
&emsp;20   np = n<br>
&emsp;21   na = n<br>
&emsp;22   va = v<br>
&emsp;23   reply accept\_ok(n)<br>
&emsp;24   else<br>
&emsp;25   reply accept\_reject


---

<a id="page-4"></a>
**Page 4**

6.824 Spring 2015, Exam 1 Solutions   Page 4 of 11

&emsp;**3. \[6 points\]:** Why must a proposer receive prepare ok from a majority before moving to<br>
&emsp;the accept phase?<br>
&emsp;**Answer:** The majority ensures that a new proposer is guaranteed to see any value that might<br>
&emsp;already have been agreed on (i.e. accepted by a majority).

Lab 3 solutions must exchange Done() values to allow peers to forget instances that no peer will<br>
need again. Unfortunately, if one peer is offline for an extended period of time, the Done() mech-<br>
anism will prevent any peers from forgetting instances. Ben Bitdiddle thinks he can do better than<br>
this.<br>
Ben wants his servers to be able to discard certain Put operations regardless of whether all servers<br>
are advancing Done(). He figures that, if a server applies one Put operation and then a second<br>
Put for the same key, the server can safely forget the first Put. Any peers asking for the old Put<br>
operation might as well skip it (treat it as a no-op), since they’ll see the later Put. Ben plans to<br>
modify his implementation so that a server discards a superseded Put by replacing it with a No-Op<br>
in his Paxos set of remembered instances. A No-Op takes less memory to store than a Put.

&emsp;**4. \[6 points\]:** Is Ben’s plan for forgetting Puts correct? Explain your answer.<br>
&emsp;**Answer:** Suppose we have a three-replica system with servers S1, S2, and S3. Suppose key<br>
&emsp;x starts out non-existent. Client C1 sends a put(x,1) to S1, which uses Paxos to add put(x,1)<br>
&emsp;to the log in slot 20. S2 doesn’t immediately see the accept message for slot 20. C1 then<br>
&emsp;sends a get(x) to S2, which proposes the get(x) for slot 21; agreement is reached for the<br>
&emsp;get(x) in slot 21 but S2 doesn’t know it yet. Server S1 receives a put(x,2), uses Paxos to add<br>
&emsp;the put(x,2) to the log in slot 22. Once servers S1 and S3 have processed the put(x,2), they<br>
&emsp;replace the put(x,1) in slot 20 with a no-op. Now S2 completes agreement for slot 20 and<br>
&emsp;sees the no-op, completes agreement for slot 21 and sees that slot 21 holds C1’s get(x), and<br>
&emsp;(because there is no put(x,1) before the get(x)) returns a “no such value” error to C1. C1<br>
&emsp;knows that can’t be right because it had previously completed a put(x,1).

Ben is having trouble answering the above question so he thinks about discarding Get operations<br>
instead. In his implementation a No-Op consumes less memory than a Get. Ben plans to modify<br>
his servers to replace each Get instance with a No-Op after it has been agreed to and executed.

&emsp;**5. \[6 points\]:** Is Ben’s plan for forgetting Gets correct? Explain your answer.<br>
&emsp;**Answer:** It’s correct. Unlike Puts, Gets don’t modify any client-visible state. Gets need to<br>
&emsp;be in the log in order to ensure that they see state after all previously applied updates, so<br>
&emsp;that (for example) a client never sees a Get reply that doesn’t reflect its own Puts, no matter<br>
&emsp;which server it talks to. It’s true that the Gets in the log may populate server duplicate RPC<br>
&emsp;tables, but this is not necessary: it’s OK for a server to handle a re-sent Get by treating it as<br>
&emsp;an entirely new operation.


---

<a id="page-5"></a>
**Page 5**

6.824 Spring 2015, Exam 1 Solutions   Page 5 of 11

In Paxos as implemented in Lab 3, servers lose state when they crash and therefore can’t re-join the<br>
Paxos group. Ben Bitdiddle thinks he can fix this by having recovering peers initialize themselves<br>
from a live peer by cloning the live peer’s state. (Note: the recovering peer doesn’t clone the live<br>
peer’s identity, just its Paxos state). This turns out not to work.

&emsp;**6. \[6 points\]:** Why doesn’t this work?<br>
&emsp;**Answer:** The recovering peer might have been part of a bare majority that agreed on a<br>
&emsp;particular value. If it copies state from a live peer that wasn’t part of that majority, that<br>
&emsp;would allow Paxos to agree to a different value for the same instance.


---

<a id="page-6"></a>
**Page 6**

6.824 Spring 2015, Exam 1 Solutions   Page 6 of 11

**III**   **Remus**

Recall the Remus paper by Cully et al. Suppose there are two clients talking to a service. Client 1<br>
sends requests sequentially, waiting for a response from the service for each request before sending<br>
the next request. Client 2 sends many requests concurrently; that is, it sends a batch of requests to<br>
the server before waiting for any responses. The clients initially both send requests to a single non-<br>
replicated server. However, we decide to make the service more fault tolerant by replicating it with<br>
Remus. For these questions, there are no failures, the network adds no latency to communication,<br>
and the client CPU is infinitely fast.

&emsp;**7. \[6 points\]:** Which client will experience the bigger slowdown in throughput when we<br>
&emsp;upgrade to Remus? Briefly explain your answer.<br>
&emsp;**Answer:** Client 1. Before Remus, both clients could keep the service 100% busy. With<br>
&emsp;Remus, each client only receives replies to requests once per epoch. Consequently, Client 1<br>
&emsp;achieves a throughput of only 1 request per epoch, while Client 2 achieves throughput of n<br>
&emsp;requests per epoch, where n is the number of requests it can send concurrently.

Now calculate the average throughput that client 1 and client 2 can achieve. Throughput is the num-<br>
ber of requests acknowledged by the server per second. Client 2 keeps five requests concurrently<br>
outstanding. An epoch is 1 second long. The system pauses for 0.1 seconds to get the snapshot<br>
of its state and then takes another 0.1 seconds to transfer it to the backup. It takes 0.5 seconds for<br>
the backup to copy all of the changes to its buffer and ack back to the primary. Assume all other<br>
network and processing latencies are zero.

&emsp;**8. \[6 points\]:**<br>
&emsp;Your answer for client 1: **Answer:** 1 request / 1.1 second<br>
&emsp;Your answer for client 2: **Answer:** 5 requests / 1.1 second


---

<a id="page-7"></a>
**Page 7**

6.824 Spring 2015, Exam 1 Solutions   Page 7 of 11

**IV**   **Raft**

Consider the Raft replication system described in In Search of an Understandable Consensus Al-<br>
gorithm by Ongaro and Ousterhout. Suppose you have a five-server Raft system. Here’s the state<br>
of the servers’ logs. The notation T.N means the Nth log entry from term T. The servers are about<br>
to choose a new leader.

S1: 3.1 4.1<br>
S2: 3.1 3.2<br>
S3: 3.1 5.1<br>
S4: 3.1 5.1 5.2<br>
S5: 3.1

&emsp;**9. \[6 points\]:** Could any replica have already executed the operation in log entry 5.1? If<br>
&emsp;yes, explain how this could have happened. If no, explain why it could not have happened.<br>
&emsp;**Answer:** No. An operation cannot execute if it is not in a majority of logs.

&emsp;**10. \[6 points\]:** Could operation 3.2 be committed in the future? (Assume that the client<br>
&emsp;does **not** re-transmit the operation.) If yes, how could that happen? If no, why not?<br>
&emsp;**Answer:** No. 3.2 can only be committed if S2 becomes the next leader (since any other<br>
&emsp;leader will cause S2 to delete 3.2). S2 can’t become a leader because there is no majority in<br>
&emsp;which S2 has the most up-to-date log.

&emsp;**11. \[6 points\]:** Could operation 4.1 be committed in the future? (Assume that the client<br>
&emsp;does **not** re-transmit the operation.) If yes, how could that happen? If no, why not?<br>
&emsp;**Answer:** Yes. S1 can become the next leader with a majority from S1, S2, and S5.

&emsp;**12. \[6 points\]:** A classmate points out that read-only operations could be executed much<br>
&emsp;faster if the Raft leader alone executed them and sent the result back to the client, without<br>
&emsp;sending such operations to the followers. After all, read-only operations don’t modify the<br>
&emsp;state, so executing them on the followers is a no-op. Explain why this idea would lead to<br>
&emsp;incorrect behavior.<br>
&emsp;**Answer:** That would allow a leader in a network partition to continue to reply to client<br>
&emsp;requests even after a new leader is elected. The old leader might then serve stale data, since<br>
&emsp;it would not know about the latest write operations.


---

<a id="page-8"></a>
**Page 8**

6.824 Spring 2015, Exam 1 Solutions   Page 8 of 11

Imagine that you are using Raft to replicate a file server, so that the state being replicated is the<br>
file system stored on disk, and executing a client operation involves updating the file system on<br>
disk. Suppose a client operation has been committed to the Raft log in position 20. The leader has<br>
replied to the client, and the client never re-sends the request.

&emsp;**13. \[6 points\]:** A follower crashes and re-starts. Could Raft give the operation in position<br>
&emsp;20 to the follower’s state machine for execution twice, once before the crash and once after?<br>
&emsp;That is, could the “apply log\[lastApplied\] to state machine” in the paper’s Figure 2 Rules for<br>
&emsp;Servers ever happen twice for the same log entry on the same replica? If yes, explain how<br>
&emsp;that could happen. If no, explain why it couldn’t happen.<br>
&emsp;**Answer:** Yes. Figure 2 says lastApplied is in volatile state, so the re-starting server won’t<br>
&emsp;know which operations it has already applied to its on-disk state.


---

<a id="page-9"></a>
**Page 9**

6.824 Spring 2015, Exam 1 Solutions   Page 9 of 11

**V**   **Treadmarks**

Consider the Treadmarks distributed shared memory system described in the paper by Keleher et<br>
al.

&emsp;**14.**   **\[6 points\]:** Describe a situation in which Treadmarks would move some memory<br>
&emsp;content from processor Px to processor Py even though the program on Py never uses that<br>
&emsp;memory.<br>
&emsp;**Answer:** Suppose variables v1 and v2 are on the same page. Px writes v1, acquires a lock,<br>
&emsp;writes v2, and releases the lock. Py acquires the lock, which will cause Py to mark the page<br>
&emsp;invalid. Py then reads v2. Py will now fetch all write differences for the page from Px, which<br>
&emsp;will include v1, even though Px isn’t reading v1.


---

<a id="page-10"></a>
**Page 10**

6.824 Spring 2015, Exam 1 Solutions   Page 10 of 11

Now suppose you are using Treadmarks for a parallel computation on three processors, P1, P2, and<br>
P3. Each runs the code indicated here:

P1:<br>
mu1.Lock()<br>
for(i = 0; i \< 100; i++)<br>
&emsp;x\[i\] = random()<br>
mu1.Unlock()

P2:<br>
mu2.Lock()<br>
for(j = 0; j \< 100; j++)<br>
&emsp;y\[j\] = random()<br>
mu2.Unlock()

P3:<br>
mu1.Lock()<br>
for(k = 0; k \< 100; k++)<br>
&emsp;x\[k\] = x\[k\] + 10<br>
mu1.Unlock()

x and y are arrays in shared memory managed by Treadmarks. x and y are in the same page of<br>
memory. i, j, and k are local to the processor that uses each (they are not shared). mu1 and mu2<br>
are locks managed by Treadmarks. random() returns a random number.

&emsp;**15.**   **\[6 points\]:** Suppose P1 acquires mu1 first, and then P3 acquires mu1. Treadmarks<br>
&emsp;will move the x array to P3. Explain how Treadmarks is able to move much less memory to<br>
&emsp;P3 than IVY would (IVY is the system described in Memory Coherence in Shared Virtual<br>
&emsp;Memory Systems by Li and Hudak).<br>
&emsp;**Answer:** Treadmarks will only copy the x array to P3. Treadmarks can do this because P1<br>
&emsp;and P2 can hold different versions of the same page, and because P3 knows (because of the<br>
&emsp;lock) that it only needs updates from P1. IVY keeps just one copy of the page (bouncing<br>
&emsp;between P1 and P2), so it sends the whole page to P3, including both x and y.


---

<a id="page-11"></a>
**Page 11**

6.824 Spring 2015, Exam 1 Solutions   Page 11 of 11

**VI**   **6.824**

&emsp;**16. \[5 points\]:** Which were the most and least interesting papers?<br>
&emsp;Most “interesting” votes: Raft, Paxos, Treadmarks, Harp, FDS.<br>
&emsp;Most “not interesting” votes: Ficus, IVY, MapReduce, Harp.

&emsp;**17. \[5 points\]:** How can we improve 6.824?<br>
&emsp;The most frequent answers:

&emsp;&emsp;**–** Lecture should answer each paper question.<br>
&emsp;&emsp;**–** Hand out a working Paxos after Lab 3A due date.<br>
&emsp;&emsp;**–** Document the lab tests.<br>
&emsp;&emsp;**–** Hold Go tutorial sessions.<br>
&emsp;&emsp;**–** Assign fewer papers.<br>
&emsp;&emsp;**–** Provide lab debugging tools.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;End of Exam I Solutions

