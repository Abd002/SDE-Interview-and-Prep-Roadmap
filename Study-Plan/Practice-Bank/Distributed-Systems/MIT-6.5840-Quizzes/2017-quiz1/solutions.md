# MIT 6.824/6.5840 2017: Quiz 1: Official solutions

> Copied from the original: <https://pdos.csail.mit.edu/6.824/quizzes.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**


![Figure on page 1](figures/solutions-p01-fig01.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Department of Electrical Engineering and Computer Science<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;MASSACHUSETTS INSTITUTE OF TECHNOLOGY

&emsp;&emsp;&emsp;&emsp;**6.824 Distributed System Engineering: Spring 2017**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Exam I**

Write your name on this cover sheet. If you tear out any sheets, please write your name on them.<br>
You have 80 minutes to complete this quiz.<br>
Some questions may be much harder than others. Read them all through first and attack them in<br>
the order that allows you to make the most progress. If you find a question ambiguous, write down<br>
any assumptions you make. Write neatly. In order to receive full credit you must answer each<br>
question as precisely as possible.<br>
You may use class notes, papers, and lab material. You may read them on your laptop, but you are<br>
not allowed to use any network. For example, you may not look at web sites or communicate with<br>
anyone.

&emsp;&emsp;&emsp;**I (7)**   **II (32)**   **III (21)**   **IV (7)**   **V (22)**   **VI (8)**   **VII (3)**   **Total (100)**

**Name:**


---

<a id="page-2"></a>
**Page 2**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Grade histogram for Exam 1


![Figure on page 2](figures/solutions-p02-fig02.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;max   =   100<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;median   =   81<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;µ   =   80.6<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;σ   =   9.8


---

<a id="page-3"></a>
**Page 3**

6.824 Spring 2017, Exam 1   Page 3 of 14

**I**   **Lab 1**

Alyssa P. Hacker is writing a simplified version of the schedule function for the MapReduce<br>
lab. This function takes in an array of Tasks for a particular map or reduce phase and sends them<br>
to available workers. The function should return once all of the tasks in this phase have been<br>
completed.<br>
01 func schedule(tasks \[\]Task) {<br>
02   var mu sync.Mutex<br>
03   tasksRunning := 0<br>
04   for \_, task := range tasks {<br>
05   go func(task Task) {<br>
06   // Count this task as running.<br>
07   mu.Lock()<br>
08   tasksRunning++<br>
09   mu.Unlock()<br>
10<br>
11   // Get an available worker and let them run the task.<br>
12   worker := \<-registerChan<br>
13   call(worker, "Worker.DoTask", task)<br>
14<br>
15   // Indicate that this task has completed.<br>
16   mu.Lock()<br>
17   tasksRunning--<br>
18   mu.Unlock()<br>
19<br>
20   // Reregister the worker as available.<br>
21   registerChan \<- worker<br>
22   }(task)<br>
23   }<br>
24   // Wait for all the tasks to be done.<br>
25   for {<br>
26   mu.Lock()<br>
27   t := tasksRunning<br>
28   mu.Unlock()<br>
29   if t == 0 {<br>
30   break<br>
31   }<br>
32   }<br>
33   return<br>
34 }


---

<a id="page-4"></a>
**Page 4**

6.824 Spring 2017, Exam 1   Page 4 of 14

&emsp;**1.**   **\[7 points\]:** Alyssa notices that schedule sometimes returns before all of the tasks<br>
&emsp;have been finished, even without worker failures. Explain a sequence of events that could<br>
&emsp;cause schedule to return too early.<br>
&emsp;**Answer:** The check for t == 0 at line 29 could run before any of the task goroutines start, so<br>
&emsp;schedule() could return before the tasks finish.


---

<a id="page-5"></a>
**Page 5**

6.824 Spring 2017, Exam 1   Page 5 of 14

**II**   **Short reading questions**

&emsp;**2. \[8 points\]:** Chunk servers in GFS (as described by Ghemawat et al.) store the version<br>
&emsp;number of a chunk persistently on disk. How would GFS break if chunk servers stored the<br>
&emsp;version number of each chunk only in memory? Briefly explain your answer.<br>
&emsp;**Answer:** If chunkservers don’t store version numbers persistently, they will be lost after a<br>
&emsp;crash. After a reboot, the GFS master won’t be able to distinguish between up-to-date and<br>
&emsp;stale replicas, so it wouldn’t be able to do garbage collection properly.

&emsp;**3. \[8 points\]:** Does Spinnaker’s timeline consistency (as described in “Using Paxos to build<br>
&emsp;a scalable, consistent and highly available datastore” by Rao et al.) allow a client to read a<br>
&emsp;stale value? Specifically, can a client read an old value for a key after another client has<br>
&emsp;successfully put a new value for that key? If yes, explain how this can happen; if no, explain<br>
&emsp;why it can’t happen.<br>
&emsp;**Answer:** Timeline consistency allows clients to read stale values (a trade-off to get better<br>
&emsp;performance). Timeline consistent reads can be directed to any node in a cohort, and that<br>
&emsp;node doesn’t necessarily have the latest value, even if a majority of the nodes do.


---

<a id="page-6"></a>
**Page 6**

6.824 Spring 2017, Exam 1   Page 6 of 14

In VM-FT (as described (by Scales et al.), when a virtual machine tries to read the time-of-day<br>
clock, the hypervisor on the primary machine obtains control and reads the real hardware time-of-<br>
day clock. The hypervisor returns the read value to the virtual machine and forwards the read value<br>
to the hypervisor on the backup machine. The hypervisor on the backup returns the value read at<br>
the primary to its virtual machine when that virtual machine reads the time-of-day clock.

&emsp;**4.**   **\[8 points\]:** Ben observes that his backup machine has a hardware time-of-day clock<br>
&emsp;too, and he also sees that the time-of-day clocks on the primary and the backup are perfectly<br>
&emsp;synchronized – if you read them both at the same instant, they always return exactly the same<br>
&emsp;value. Ben proposes a simplified VM-FT design that avoids the communication between the<br>
&emsp;primary and the backup for the time-of-day clock. When the VM on the primary wants<br>
&emsp;to read the time-of-day, the hypervisor returns the value from its local clock, and doesn’t<br>
&emsp;forward the value to the backup. When the virtual machine on the backup wants to read the<br>
&emsp;time-of-day clock, the hypervisor on the backup reads its local time-of-day clock and returns<br>
&emsp;that value to its virtual machine. Even though the clocks on Ben’s machines are perfectly<br>
&emsp;synchronized, Ben observes that the virtual machine on the primary and the backup diverge<br>
&emsp;over time. Briefly explain why Ben’s design doesn’t work.<br>
&emsp;**Answer:** The VM-FT protocol has the backup lagging behind by at least one event so by<br>
&emsp;the time the backup would read the time-of-day clock, it would read a different value than<br>
&emsp;the primary. This different value may cause the VM on the backup to do something different<br>
&emsp;than the VM on the primary.


---

<a id="page-7"></a>
**Page 7**

6.824 Spring 2017, Exam 1   Page 7 of 14

&emsp;**5.**   **\[8 points\]:** Ben wants to add the following scheme for duplicate request detection<br>
&emsp;to ZooKeeper. His proposal is to modify Zookeeper to maintain a duplicate detection table,<br>
&emsp;replicated across the Zookeeper servers. Each client stamps each of its requests with a unique<br>
&emsp;ID. After Zab agrees on a request, and before a server executes it, the server indexes its table<br>
&emsp;with the request’s unique ID to see whether it has already executed the request. If there is<br>
&emsp;no entry for that unique ID, the server executes the request and stores the result in its table<br>
&emsp;under the unique ID. If the unique ID is present in the table, the server doesn’t execute the<br>
&emsp;request, and if it was the server that received the request from the client it sends the result<br>
&emsp;stored in the table as the response to the client. This design has a serious flaw – what is it?<br>
&emsp;(Briefly explain your answer.)<br>
&emsp;**Answer:** Ben’s protocol never deletes entries from the duplicate-detection table.   If a<br>
&emsp;ZooKeeper server runs for a long time and serves many requests, Ben’s scheme will cause it<br>
&emsp;to run out of memory.


---

<a id="page-8"></a>
**Page 8**

6.824 Spring 2017, Exam 1   Page 8 of 14

**III**   **Raft**

Answer each of these questions with reference to the Raft protocol described in the paper’s Figure<br>
2 (without membership change, without log compaction, and without Section 8).

&emsp;**6. \[7 points\]:** Suppose the leader waited for **all** servers (rather than just a majority) to have<br>
&emsp;matchIndex\[i\] \>= N before setting commitIndex to N (at the end of Rules for Servers).<br>
&emsp;What specific valuable property of Raft would this change break?<br>
&emsp;**Answer:** Raft would no longer be available (would no longer make progress) if there were<br>
&emsp;even a single crashed or unreachable server.

&emsp;**7.**   **\[7 points\]:** Suppose the leader immediately advanced commitIndex to its last log en-<br>
&emsp;try without waiting for responses to AppendEntries RPCs, and regardless of the values in<br>
&emsp;matchIndex. Describe a specific situation in which this change would lead to incorrect exe-<br>
&emsp;cution of the service being replicated by Raft.<br>
&emsp;**Answer:** If less than half of the followers received and accepted an AppendEntries RPC,<br>
&emsp;then the leader could commit an entry that could be lost during a subsequent leader change.<br>
&emsp;This might cause the original leader to respond positively to the client even though the re-<br>
&emsp;quest’s effects might disappear. In addition the leader would not be able to correctly convert<br>
&emsp;to follower, since its application state (e.g. k/v table) would reflect a non-existent operation.


---

<a id="page-9"></a>
**Page 9**

6.824 Spring 2017, Exam 1   Page 9 of 14

&emsp;**8. \[7 points\]:** There are five Raft servers. S1 is the leader in term 17. S1 and S2 become<br>
&emsp;isolated in a network partition. S3, S4, and S5 choose S3 as the leader for term 18. S3, S4,<br>
&emsp;and S5 commit and execute commands in term 18. S1 crashes and restarts, and S1 and S2<br>
&emsp;run many elections, so that their currentTerms are 50. S3 crashes but does not re-start, and an<br>
&emsp;instant later the network partition heals, so that S1, S2, S4, and S5 can communicate. Could<br>
&emsp;S1 become the next leader? How could that happen, or what prevents it from happening?<br>
&emsp;Your answer should refer to specific rules in the Raft paper, and explain how the rules apply<br>
&emsp;in this specific scenario.<br>
&emsp;**Answer:** No. S1 must get a vote from one of S4 and S5 to get an election majority, and both<br>
&emsp;S4 and S5 must be aware of operations committed in term 18, since they were both part of<br>
&emsp;S3’s bare majority. S1’s log must end with an entry no later than term 17, since it would not<br>
&emsp;have been able to win an election for any later term. By the leader election restriction rule,<br>
&emsp;S4 and S5 won’t vote for S1 since S4 and S5’s logs end with entries that have term 18.


---

<a id="page-10"></a>
**Page 10**

6.824 Spring 2017, Exam 1   Page 10 of 14

**IV**   **Lab 2**

Ben’s Raft is failing the Lab 2 tests, which say that log entries are appearing on the apply channel<br>
out of order. Here is the part of his code that sends on the apply channel. Ben’s implementation<br>
calls this function every time it updates the commit index. There is a single lock (Go mutex)<br>
protecting each Raft instance, and the calling code always holds the lock.

01\. func (rf \*Raft) applyToService() {<br>
02\.   for rf.commitIndex \> rf.lastApplied {<br>
03\.   entry := rf.log\[rf.lastApplied + 1\]<br>
04\.   msg := ApplyMsg {<br>
05\.   Index: rf.lastApplied + 1,<br>
06\.   Command: entry.Command,<br>
07\.   }<br>
08\.   rf.lastApplied++<br>
09\.   go func() { rf.applyCh \<- msg } ()<br>
10\.   }<br>
11\. }

&emsp;**9. \[7 points\]:** Explain Ben’s bug.<br>
&emsp;**Answer:** Ben is sending to rf.applyCh in a goroutine. If there are multiple such goroutines<br>
&emsp;running (which can happen when multiple goroutines are spawned in that loop in a single<br>
&emsp;call to applyToService), nothing prevents them from completing the sends out of the intended<br>
&emsp;order (there’s no explicit synchronization between the goroutines to ensure that happens).


---

<a id="page-11"></a>
**Page 11**

&emsp;6.824 Spring 2017, Exam 1   Page 11 of 14

&emsp;**V**   **Concurrency Control**

&emsp;Suppose you have a storage system that provides serializable transactions, and that can abort trans-<br>
&emsp;actions.<br>
&emsp;The database holds three objects, x, y, and z, with these initial values:

&emsp;x = 1<br>
&emsp;y = 2<br>
&emsp;z = 0

&emsp;Only two transactions execute, and they start at about the same time. This is what they do:

&emsp;T1:<br>
&emsp;&emsp;x=10<br>
&emsp;&emsp;y=20

&emsp;T2:<br>
&emsp;&emsp;temp = x + y<br>
&emsp;&emsp;z = temp

&emsp;&emsp;&emsp;**10. \[8 points\]:** Which final values are possible (after each transaction has either aborted or<br>
&emsp;&emsp;&emsp;finished committing and applying all updates)? Mark each of the following as “yes” or “no”.

a. **Yes** / **No** x=1 y=2 z=0 **Answer:** yes<br>
b. **Yes** / **No** x=1 y=2 z=30 **Answer:** no<br>
c. **Yes** / **No** x=1 y=20 z=21 **Answer:** no<br>
d. **Yes** / **No** x=10 y=20 z=3 **Answer:** yes<br>
e. **Yes** / **No** x=10 y=20 z=30 **Answer:** yes


---

<a id="page-12"></a>
**Page 12**

6.824 Spring 2017, Exam 1   Page 12 of 14

&emsp;**11. \[7 points\]:** Suppose T2 has just executed its first line, but has not tried to commit. If<br>
&emsp;the transaction system uses pessimistic two-phase locking, can the first line of T2 see x=10<br>
&emsp;and y=2? How, or why not?<br>
&emsp;**Answer:** No. If x is 10, but y still has its old value, then T1 must have started committing<br>
&emsp;but not finished. Two-phase locking requires that T1 hold all its locks until it completes the<br>
&emsp;commit. Thus T2 cannot acquire either lock, and thus can’t read either value.

&emsp;**12. \[7 points\]:** Suppose T2 has just executed its first line, but has not tried to commit. If<br>
&emsp;the transaction system uses optimistic concurrency control (e.g. FaRM), can the first line of<br>
&emsp;T2 see x=10 and y=2? How, or why not?<br>
&emsp;**Answer:** Yes. OCC allows T2 to read whatever values x and y have, even if T1 is executing<br>
&emsp;or committing and hasn’t finished. T1 might be in the middle of committing, and have<br>
&emsp;updated x but not y; this would cause T2 to see x=10 and y=2. However, T2 would not be<br>
&emsp;allowed to commit.


---

<a id="page-13"></a>
**Page 13**

6.824 Spring 2017, Exam 1   Page 13 of 14

**VI**   **FaRM**

Ben Bitdiddle reads the FaRM paper (“No compromises: distributed transactions with consistency,<br>
availability, and performance”). Ben thinks the Figure 4 commit protocol looks too much like two<br>
phase commit with pessimistic locking. He decides to get rid of the locks, and use only version<br>
numbers. His new commit protocol has no LOCK phase, but instead uses VALIDATE for written<br>
objects as well as read objects. Note that FaRM causes a transaction to first read every object that<br>
it writes (in order to fetch the version number).<br>
Here is Ben’s modified commit protocol:<br>
Phase 1, VALIDATE: The coordinator uses one-sided reads to re-fetch the version numbers of all<br>
objects used in the transaction, and aborts if any version has changed since the object was first read<br>
by the transaction. (The same as FaRM’s VALIDATE in Figure 4 / Section 4, but used for written<br>
objects too.)<br>
Phase 2, COMMIT BACKUP: The same as FaRM.<br>
Phase 3, COMMIT PRIMARY: The coordinator sends the primary the updated object contents in<br>
this message. The primary copies the new object content to the object’s location in memory and<br>
increments its version number.<br>
Phase 4, TRUNCATE: The same as FaRM, except that the backups don’t unlock.

&emsp;**13.**   **\[8 points\]:** Assume there are no computer or network failures. Describe a specific<br>
&emsp;situation in which transactions would yield incorrect results with Ben’s modified commit<br>
&emsp;protocol.<br>
&emsp;**Answer:** If there are two concurrent transactions that increment the same object, one of the<br>
&emsp;increments may be lost even though both transactions claim to commit successfully. They’ll<br>
&emsp;both read the same value (say 10) and version (say 100), then VALIDATE at the same time<br>
&emsp;and see the version is still 100, then both send COMMIT PRIMARY, both of which cause the<br>
&emsp;primary to set the object’s value to value 11. In this situation it’s the real FaRM protocol’s<br>
&emsp;exlusive lock that forces one of the transactions to abort.


---

<a id="page-14"></a>
**Page 14**

6.824 Spring 2017, Exam 1   Page 14 of 14

**VII**   **6.824**

&emsp;**14. \[1 points\]:** Lab 2 is challenging. If you ran into significant difficulties, what were they?<br>
&emsp;What can we do to avoid these difficulties for future generations of 6.824 students?

**Answer:** Debugging: 28x General (subtle bugs); 3x Logging; 2x Locking; 13x Test cases/testing;<br>
13x Tips on optimization/performance; 11x Not following details in fig2; 10x GO tips; 9x More<br>
time for labs; 7x Make Jon’s blog required reading; 5x Synchronization/concurrency; 5x Overall<br>
design; 5x More office hours; 4x Have Go guest lecture earlier; 3x Documentation; 3x Edge cases;<br>
3x Dependencies between labs; 3x Debugging tips; 2x Publish raft solution after due date; 2x More<br>
skeleton code; 1x Make lab 1 harder to prepare for lab 2; 1x Add implementation assignments for<br>
papers; 1x Need detailed instructions; 1x Suggested read: Colin Scott’s thesis on testing

&emsp;**15. \[1 points\]:** Which papers should we definitely keep for future years?

**Answer:**   94x Raft; 51x FaRM; 46x ZooKeeper; 38x MapReduce; 25x GFS; 16x VM-FT; 12x<br>
Spinnaker; 11x R\*<br>
Add: 2x Paxos; 1x On optimistic methods for concurrency control; 1x Ivy; 1x TxCache; 1x Algo-<br>
rand; 1x MaaT

&emsp;**16. \[1 points\]:** Is there any paper we should delete?

**Answer:**   33x R\*; 25x Spinnaker; 21x VM-FT; 10x FaRM; 7x MapReduce; 6x GFS; 6x<br>
ZooKeeper

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;End of Exam I

