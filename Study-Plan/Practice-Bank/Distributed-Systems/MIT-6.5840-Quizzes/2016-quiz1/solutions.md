# MIT 6.824/6.5840 2016: Quiz 1: Official solutions

> Copied from the original: <https://pdos.csail.mit.edu/6.824/quizzes.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**


![Figure on page 1](figures/solutions-p01-fig01.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Department of Electrical Engineering and Computer Science<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;MASSACHUSETTS INSTITUTE OF TECHNOLOGY

&emsp;&emsp;&emsp;&emsp;**6.824 Distributed System Engineering: Spring 2016**<br>
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

&emsp;**I (14)**   **II (7)**   **III (7)**   **IV (21)**   **V (14)**   **VI (14)**   **VII (21)**   **VIII (2)**   **Total (100)**

**Name:**


---

<a id="page-2"></a>
**Page 2**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Grade histogram for Exam 1


![Figure on page 2](figures/solutions-p02-fig02.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;max   =   100<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;median   =   84<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;µ   =   82.4<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;σ   =   11.3


---

<a id="page-3"></a>
**Page 3**

6.824 Spring 2016, Exam 1   Page 3 of 17

**I**   **Lab 1**

Ben Bitdiddle is writing a simplified version of the schedule() function for the MapReduce lab. This<br>
function takes in an array of Tasks for a particular map or reduce phase and sends them to available<br>
workers. The function should return once all of the tasks in this phase have been completed.

1 func (mr \*Master) schedule(tasks \[\]Task) {<br>
2   done := 0<br>
3<br>
4   for \_, task := range tasks {<br>
5   go func(task Task) {<br>
6<br>
7   // Get an available worker and give them the task to run.<br>
8   worker = \<-mr.registerChannel<br>
9   call(worker, "Worker.DoTask", task)<br>
10<br>
11   // Tell the master this task is done.<br>
12   done++<br>
13<br>
14   // Reregister the worker as available.<br>
15   mr.registerChannel \<- worker<br>
16<br>
17   }(task)<br>
18   }<br>
19<br>
20   // Wait for all of the jobs to return.<br>
21   for {<br>
22   if done == len(tasks) {<br>
23   break<br>
24   }<br>
25   }<br>
26<br>
27   return<br>
28 }

Ben notices that schedule() sometimes never finishes. However, he can see from looking at the<br>
output files that the workers have completed all of the tasks in the phase.


---

<a id="page-4"></a>
**Page 4**

6.824 Spring 2016, Exam 1   Page 4 of 17

&emsp;**1. \[7 points\]:** Identify a race in Ben’s code that can cause schedule() to never return.

**Answer:** There is a race at line 12: if two threads update done concurrently, they increase by 1<br>
instead of 2. Read/writes of done must be protected under a lock.

After fixing the race in the previous question, Ben’s code passes all of the MapReduce tests. Now<br>
he hopes to make his implementation faster by returning an available worker to mr.registerChannel<br>
as soon as possible, that is, before incrementing done. He implements this by moving line 15 so<br>
it comes right after line 9. However, he notices that with this new plan schedule() never returns.

&emsp;**2. \[7 points\]:** Why does this happen?

**Answer:** For the last few tasks, no go routine will be reading from the register channel, so the sends<br>
will block, preventing done from being updated, which prevents schedule from returning.


---

<a id="page-5"></a>
**Page 5**

6.824 Spring 2016, Exam 1   Page 5 of 17

**II**   **GFS**

Alice uses GFS (as described by Ghemawat et al.) to store the output of her MapReduce job. One<br>
task of the MapReduce job uses a single write call to write MapReduce records to a pre-existing<br>
“out.txt” file. That is, her job overwrites “out.txt”, which was created by a previous run of her job<br>
(she doesn’t care about any of the old content). Unfortunately, the GFS write call returns an error.<br>
A check application runs on another machine while the MapReduce job is attempting to write.<br>
The check application opens “out.txt”, reads it, and closes the file. To Alice’s surprise the check<br>
application reads the bytes Alice’s MapReduce job tried to write to “out.txt”, even though the write<br>
reported an error to the MapReduce job. If she runs the check application again, however, it reads<br>
the old bytes.

&emsp;**3. \[7 points\]:** Describe a scenario in which this can happen.

**Answer:** Client 1 opens a file, receives a list of chunk servers, and starts writing records. Client<br>
2 also opens the file and receives a list of chunk servers. While client 1 is writing, the primary<br>
updates replica 1 for the chunk being written, but fails to update replica 2, perhaps due a network<br>
failure. Client 2 reads from replica 1 and reads the new bytes. The second read goes to replica 2<br>
(reads can go to any replica), and thus reads the old bytes.


---

<a id="page-6"></a>
**Page 6**

6.824 Spring 2016, Exam 1   Page 6 of 17

**III**   **VM-FT**

After reading the VM-FT paper (by Scales et al.), Ben explores running the GFS master on VM-FT.<br>
He reasons that, without modifying the existing GFS master code, he can avoid the master being<br>
a single point of failure. Unfortunately, he finds that replicating the master with VM-FT results in<br>
much slower performance than with an unreplicated master: even GFS operations that merely fetch<br>
data from the master take significantly longer with the master running on VM-FT.

&emsp;**4. \[7 points\]:** Explain what causes this decrease in performance.

**Answer:** The primary in VM-FT cannot respond to a client request (i.e., send a network packet)<br>
until the primary has received an acknowledgement from a backup for that event.


---

<a id="page-7"></a>
**Page 7**

6.824 Spring 2016, Exam 1   Page 7 of 17

**IV**   **Lab 2**

Ben is having trouble getting his Lab 2 to work. Here’s the part of his code that sends out Appen-<br>
dEntries RPCs when a server acts as leader:<br>
&emsp;&emsp;1 for {<br>
&emsp;&emsp;2   // ... omitted code that waits either for a new client<br>
&emsp;&emsp;3   // request or for a heartbeat interval.<br>
&emsp;&emsp;4<br>
&emsp;&emsp;5   for i, p := range rf.peers {<br>
&emsp;&emsp;6   if i == rf.me {<br>
&emsp;&emsp;7   continue<br>
&emsp;&emsp;8   }<br>
&emsp;&emsp;9   rf.mu.Lock()<br>
&emsp;10   if rf.state != LEADER {<br>
&emsp;11   rf.mu.Unlock()<br>
&emsp;12   break<br>
&emsp;13   }<br>
&emsp;14   n := rf.nextIndex\[i\]<br>
&emsp;15   args := AppendEntriesArgs{<br>
&emsp;16   // ...<br>
&emsp;17   Term: rf.currentTerm,<br>
&emsp;18   PrevLogIndex: n-1,<br>
&emsp;19   PrevLogTerm: rf.log\[n-1\].Term,<br>
&emsp;20   Entries: make(\[\]LogEntry, len(rf.log\[n:\])),<br>
&emsp;21   }<br>
&emsp;22   copy(args.Entries, rf.log\[n:\])<br>
&emsp;23   rf.mu.Unlock()<br>
&emsp;24<br>
&emsp;25   var reply AppendEntriesReply<br>
&emsp;26   ok := p.Call("Raft.AppendEntries", args, &reply)<br>
&emsp;27   if ok && reply.Success {<br>
&emsp;28   rf.mu.Lock()<br>
&emsp;29   rf.nextIndex\[i\] = len(rf.log)<br>
&emsp;30   rf.matchIndex\[i\] = rf.nextIndex\[i\] - 1<br>
&emsp;31   rf.mu.Unlock()<br>
&emsp;32   }<br>
&emsp;33   }<br>
&emsp;34   // update commitIndex based on rf.matchIndex<br>
&emsp;35   // ...<br>
&emsp;36 }


---

<a id="page-8"></a>
**Page 8**

6.824 Spring 2016, Exam 1   Page 8 of 17

&emsp;**5. \[7 points\]:** Ben’s implementation often fails tests because it commits too slowly. De-<br>
&emsp;scribe a change to his code that will speed it up significantly when there are many Raft<br>
&emsp;servers.

**Answer:** Send the RPCs asynchronously, and in parallel.

&emsp;**6.**   **\[7 points\]:** Ben discovers that his servers often commit different commands for the<br>
&emsp;same index in the log. He discovers that this happens when the winner of an election was the<br>
&emsp;leader in a previous term; in that situation the leader’s matchIndex entries sometimes contain<br>
&emsp;inexplicably large values shortly after the election, even though Ben’s implementation sets<br>
&emsp;nextIndex and matchIndex entries to zero when a server is elected leader. Explain how the<br>
&emsp;code above can cause what Ben sees.

**Answer:**   A delayed reply to an AppendEntries RPC may arrive after the re-election, causing<br>
matchIndex to be modified. The reply handling code should check that the term hasn’t changed.


---

<a id="page-9"></a>
**Page 9**

6.824 Spring 2016, Exam 1   Page 9 of 17

&emsp;**7. \[7 points\]:** After fixing the problem identified in the previous question, Ben finds that a<br>
&emsp;leader will sometimes commit a log entry that has not been accepted by a majority of servers.<br>
&emsp;He finds that this is because the leader sets matchIndex too high after hearing a response from<br>
&emsp;an AppendEntries RPC. Explain how Ben’s code for updating nextIndex and matchIndex is<br>
&emsp;wrong.

**Answer:** They should be updated to the log length as of when the AppendEntries was sent, not to<br>
the current log length.


---

<a id="page-10"></a>
**Page 10**

6.824 Spring 2016, Exam 1   Page 10 of 17

**V**   **Zookeeper**

In Zookeeper (as described by Hunt et al.), any server can respond to a read operation such as<br>
GetData. In lab 3, read operations such as Get are served by the Raft leader after committing<br>
the Get operation in Raft log. As a result, read operations in Zookeeper are fast and read operations<br>
in lab 3 are slow.

&emsp;**8. \[7 points\]:** What does Zookeeper sacrifice compared to lab 3 by allowing each server to<br>
&emsp;respond to a read operation? (Briefly explain your answer.)

**Answer:** ZooKeeper doesn’t provide linearizable Get operations.

A Zookeeper client C1 calls setData("z", 27) at server S1 to change the value of znode z<br>
to 27 from its previous value of 0. No further setData calls happen after that one call. Another<br>
client C2 calls getData("z") at server S1 and reads 27. Now S1 fails and client C2 switches to<br>
server S2.

&emsp;**9. \[7 points\]:** If client C2 calls getData("z") at server S2 does Zookeeper guarantee<br>
&emsp;that the client will observe 27 rather than 0? (Briefly explain your answer.)

**Answer:** Yes, Zookeeper will guarantee this thanks to the zxid included with all client requests. A<br>
Zookeeper server will ensure its state is at least as up to date as the client’s zxid before responding.


---

<a id="page-11"></a>
**Page 11**

6.824 Spring 2016, Exam 1   Page 11 of 17

**VI**   **FaRM**

You’re building a simple auction system using FaRM to store the bids (see the paper “No compro-<br>
mises: distributed transactions with consistency, availability, and performance”). Your application<br>
supports just one auction, with just two bidders. You store the two current bids in FaRM, in the<br>
bids\[\] array. Each user can bid any number of times with the bid() function, which returns a boolean<br>
indicating whether the bid is the highest so far. The function’s who argument is 0 or 1, and indi-<br>
cates which user is bidding. The return value from commit transaction() is true if the FaRM commit<br>
protocol committed the transaction, and false if it aborted.

// each user’s bid is a distinct FaRM object.<br>
type BidObject struct {<br>
value int<br>
// other stuff...<br>
}

// bids are initialized to zero.<br>
var bids \[2\]BidObject<br>
bids\[0\].value = 0<br>
bids\[1\].value = 0

bid(who, amount):<br>
start\_transaction()<br>
if amount \> bids\[0\].value && amount \> bids\[1\].value:<br>
&emsp;ret = true<br>
&emsp;bids\[who\].value = amount<br>
else:<br>
&emsp;ret = false<br>
if commit\_transaction():<br>
&emsp;return ret<br>
else:<br>
&emsp;return false

Each bids\[\] array element is a separate FaRM object, with its own FaRM lock and version number.


---

<a id="page-12"></a>
**Page 12**

6.824 Spring 2016, Exam 1   Page 12 of 17

&emsp;**10.**   **\[7 points\]:** Suppose the bids array starts out containing zeroes, and there are calls<br>
&emsp;to bid(0,10) and bid(1,20) on different machines at roughly the same time (and no other<br>
&emsp;activity). Could the bid(1,20) call return false? Explain your answer in terms of the commit<br>
&emsp;protocol in the paper’s Figure 4.

**Answer:** Yes. Both transactions read the initial values of the two bid objects. bid(0,10) commits<br>
first, changing the version number of bids\[0\]. bid(1,20) then tries to commit, but its VALIDATE<br>
for bids\[0\] sees that the version number has changed, so it aborts.

&emsp;**11. \[7 points\]:** You can view FaRM’s VALIDATE as an optimization of LOCK for objects<br>
&emsp;that a transaction only reads. Suppose FaRM didn’t have this optimization – suppose one<br>
&emsp;were to eliminate the VALIDATE phase from Figure 4, and instead use LOCK for objects<br>
&emsp;that are just read as well as for objects that are written. Explain why this would likely hurt<br>
&emsp;performance.

**Answer:** Two reasons. First, concurrent commits involving just reads of the same object would<br>
cause conflicts and aborts with LOCK, but proceed in parallel with VALIDATE. Second, VALI-<br>
DATE is implemented as a one-sided read, which is fast because the server CPU isn’t involved.<br>
LOCK is a true RPC that has to be executed by the server CPU, so it’s slower.


---

<a id="page-13"></a>
**Page 13**

6.824 Spring 2016, Exam 1   Page 13 of 17

**VII**   **TreadMarks**

Consider the following program with shared variables x and y:

int x = 0;<br>
int y = 0;

int f() {<br>
&emsp;x = 10;<br>
}

int g() {<br>
&emsp;y = 11;<br>
}

int p() {<br>
&emsp;print x, y<br>
}

This is the entire program.<br>
For these questions, please assume that the compiler generates instructions that preserve the pro-<br>
gram order of loads and stores on each processor.<br>
Now consider the following scenario with time running from left to right:

Processor 1:   f();

Processor 2:   g();

Processor 3:   p();


---

<a id="page-14"></a>
**Page 14**

6.824 Spring 2016, Exam 1   Page 14 of 17

&emsp;**12. \[7 points\]:** For a sequentially-consistent shared-memory system please list all possible<br>
&emsp;outputs from Processor 3. (The stores to x and y complete as indicated by the time line. For<br>
&emsp;example, by the time processor 2 updates y, x has been updated.)

**Answer:** 10, 11.

Consider the same program running on TreadMarks (as described by Keleher et al.):

&emsp;**13. \[7 points\]:** For TreadMarks please list all possible outputs from Processor 3.

**Answer:** 10, 0; 0, 11; and 10, 11.


---

<a id="page-15"></a>
**Page 15**

6.824 Spring 2016, Exam 1   Page 15 of 17

Consider the following slight modification: Processor 3 prints only x by calling px and Processor<br>
4 prints only y by calling py.

int x = 0;<br>
int y = 0;

int f() {<br>
&emsp;acquire(x\_lock); // answer<br>
&emsp;x = 10;<br>
&emsp;release(x\_lock); // answer<br>
}

int g() {<br>
&emsp;acquire(y\_lock); // answer<br>
&emsp;y = 11;<br>
&emsp;release(y\_lock); // answer<br>
}

int px() {<br>
&emsp;acquire(x\_lock); // answer<br>
&emsp;print x;<br>
&emsp;release(x\_lock); // answer<br>
}

int py() {<br>
&emsp;acquire(y\_lock); // answer<br>
&emsp;print y;<br>
&emsp;release(y\_lock); // answer<br>
}

Processor 1:   f();<br>
Processor 2:   g();<br>
Processor 3:   px();<br>
Processor 4:   py();


---

<a id="page-16"></a>
**Page 16**

6.824 Spring 2016, Exam 1   Page 16 of 17

&emsp;**14.**   **\[7 points\]:** Annotate f, g, px, and py in the above figure so that the program on<br>
&emsp;TreadMarks generates the same result as on a sequentially-consistent memory, but minimizes<br>
&emsp;communication overhead. (Briefly justify your annotations.)

**Answer:** See the lines marked “answer” added to the code above. The locks cause the readers to<br>
see the writes. Use of two different locks cause Processor 3 to only have to fetch the update to x,<br>
and Processor 4 to only have to fetch the update to y.


---

<a id="page-17"></a>
**Page 17**

6.824 Spring 2016, Exam 1   Page 17 of 17

**VIII**   **6.824**

&emsp;**15.**   **\[1 points\]:** Lab 2 turned out to be much harder than we anticipated. If you ran into<br>
&emsp;significant difficulties, what were they?

**Answer:** 16x Synchronization/concurrency; 13x Not following details in fig2; 8x No significant<br>
difficulties; 8x Overall design; 6x Too much code (all-or-nothing); 6x Edge cases; 5x Leader elec-<br>
tion; 4x Test cases/testing; 4x The optimization/performance; 3x Started too late; 2x Logs out of<br>
sync<br>
Debugging: 26x General (subtle bugs); 9x Locking; 7x Logging

&emsp;**16. \[0.5 points\]:** Which papers should we definitely keep for future years?

**Answer:** 60x Raft; 33x FaRM; 32x ZooKeeper; 26x GFS; 20x Bayou; 20x PNUTS; 17x Tread-<br>
Marks; 16x MapReduce; 10x Thor; 9x Dynamo; 4x VM-FT; 2x add Paxos; 1x add Spanner; 1x<br>
add FDS

&emsp;**17. \[0.5 points\]:** Is there any paper that you think we should delete?

**Answer:** 26x TreadMarks; 15x FaRM; 14x PNUTS; 13x Bayou; 11x VM-FT; 9x GFS; 9x MapRe-<br>
duce; 8x Thor; 1x ZooKeeper; 1x Dynamo

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;End of Exam I

