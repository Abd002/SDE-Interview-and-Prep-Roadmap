# MIT 6.824/6.5840 2013: Quiz 2: Official solutions

> Copied from the original: <https://pdos.csail.mit.edu/6.824/quizzes.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**


![Figure on page 1](figures/solutions-p01-fig01.png)

&emsp;&emsp;&emsp;&emsp;Department of Electrical Engineering and Computer Science<br>
&emsp;&emsp;MASSACHUSETTS INSTITUTE OF TECHNOLOGY

**6.824 Distributed System Engineering: Spring 2013**<br>
&emsp;&emsp;&emsp;&emsp;**Quiz II Solutions**


---

<a id="page-2"></a>
**Page 2**

6.824 Spring 2013, Quiz 2 Solutions   Page 2 of 10

**I**   **Lab 4**

Recall that Lab 4 shards, or partitions, the keys over a number of Paxos-replicated groups. Suppose<br>
that initially group G1 is serving shard S2. The shardmaster creates a new configuration in which<br>
G3 is responsible for S2. The servers in G3 learn about the new configuration via a Query RPC<br>
to the shardmaster before any servers in G1 learn about the new configuration. That is, there is a<br>
window of time during which **both** G1 and G3 believe that the latest known configuration makes<br>
them responsible for S2.

&emsp;**1. \[10 points\]:** Explain why at most one of G1 and G3 will serve client requests for S2.

**Answer:**   No server in G3 will start serving until it gets a complete copy of S1 from G1. No<br>
server in G1 will send S1 to G3 until G1 has an entry in its Paxos log indicating that the handoff<br>
is taking place. No server in G1 will return a successful reply to a client for a put or get on S1 if<br>
the put/get appears in the Paxos log after the handoff’s position in the log. The result is that, if G3<br>
could answer a client get/put on S1, all replicas in G1 will reject gets/puts on S1.


---

<a id="page-3"></a>
**Page 3**

6.824 Spring 2013, Quiz 2 Solutions   Page 3 of 10

**II**   **Bayou**

The Tasty Diner decides to implement its own reservation system using the Bayou distributed<br>
database. To keep the problem simple, assume that there are just ten seats in the diner (numbered 1<br>
to 10), and that each seat can be reserved just once per day, and that we’re concerned with a single<br>
day. The Tasty’s central computer runs the Bayou “primary replica.” The diner has several sales<br>
agents answering phone calls from hungry customers. Each sales agent’s laptop keeps a replica<br>
database. The laptops are ordinarily not connected to any network, but the agents can choose<br>
to perform anti-entropy exchanges between pairs of laptops or between a laptop and the primary<br>
replica. The laptops and primary replica do not have synchronized clocks.<br>
A Bayou “write” in this system consists of a dependency/merge procedure along with the cus-<br>
tomer’s name. When anti-entropy copies writes among replicas, it is the procedure and name that<br>
are copied, not the seat assignments. The procedure finds the lowest-numbered open seat and, if<br>
one is available, marks it as reserved for the customer. Here is the dependency/merge procedure:

merge\_procedure(char \*customer) {<br>
int s;<br>
for(s = 1; s \<= 10; s++){<br>
&emsp;if(seat s is not reserved){<br>
&emsp;&emsp;reserve seat s for customer;<br>
&emsp;&emsp;return;<br>
&emsp;}<br>
}<br>
/\* there are no seats left \*/<br>
}

An example call in a replica’s log could be merge procedure(“Smith”), which would result from<br>
an attempt to reserve a seat for customer Smith.<br>
The Tasty has three sales agents, Ack, Nack, and Sack, and they sit next to each other. Each agent<br>
has a laptop containing a database replica, so there are four replicas in total. Each laptop displays,<br>
for each seat number, the name of the customer who has reserved it.


---

<a id="page-4"></a>
**Page 4**

6.824 Spring 2013, Quiz 2 Solutions   Page 4 of 10

&emsp;**2.**   **\[5 points\]:** As our scenario opens, no seats are reserved. Then Agent Ack reserves<br>
&emsp;a seat for Neha, and then a seat for Robert. Then Agent Nack reserves a seat for Charles.<br>
&emsp;Then Agents Ack and Nack perform anti-entropy between their replicas. Their laptops now<br>
&emsp;display seat reservations; a possible display might be “1: Neha; 2: Robert; 3: Charles.”<br>
&emsp;Only the actions described above have occurred. Does Bayou (the complete system with all<br>
&emsp;mechanisms) guarantee that both laptops display the same assignments? Answer yes or no;<br>
&emsp;if yes, explain the specific mechanisms that enforce the guarantee; if no, explain specifically<br>
&emsp;what could cause them to differ.

**Answer:**   Yes. Since the laptops have performed anti-entropy, they have identical logs. Further-<br>
more, they will order their logs the same way, using Bayou’s timestamps. Thus when they replay<br>
the logs after anti-entropy, they will replay the operations in the same order, and get the same<br>
results.

&emsp;**3. \[5 points\]:** List all seat assignment displays that are possible.

**Answer:** There are three possible displays:

Neha Robert Charles<br>
Neha Charles Robert<br>
Charles Neha Robert

&emsp;**4. \[5 points\]:** Now Professor Strongly Consistent approaches the agents and demands to<br>
&emsp;be given seat 1. Agent Ack says “My laptop won’t let me do that.” Professor Consistent<br>
&emsp;won’t take that for an answer, and exclaims that surely Agent Sack can get him seat 1. Who<br>
&emsp;is right: Agent Ack? Professor Consistent? Both? Neither? And why?

**Answer:**   Both are right. Seat 1 is already assigned in Ack’s laptop’s database. However, seat 1<br>
is not assigned on Sack’s laptop. Thus Sack can tentatively assign seat 1 to the Professor. If Sack<br>
then performs anti-entropy with the primary replica, the assignment of seat 1 to the Professor will<br>
be irreversible.


---

<a id="page-5"></a>
**Page 5**

6.824 Spring 2013, Quiz 2 Solutions   Page 5 of 10

**III**   **Dynamo**

A Dynamo system is configured to use N=3 and W=3 (see Sections 4.5 and 4.6 in the paper).<br>
Suppose at time T1 all replicas of key “x” contain value “y”. The system operates until time T2<br>
arrives. No put()s or failures occur after T2. After T2, client C1 notices that it gets a different result<br>
from get(“x”) depending on whether it uses R=2 or R=3.

&emsp;**5. \[10 points\]:** Describe a specific sequence of events between T1 and T2 that would cause<br>
&emsp;this behavior.<br>
&emsp;**Answer:**   Suppose server S10 is responsible for key “x”, and that the servers after S10 on<br>
&emsp;the ring are S11, S12, S13, and S14. After T1, S10 and S11 are temporarily disconnected<br>
&emsp;from the network. A client executes put(“x”,”a”), which is sent to S12, S13, and S14. Just<br>
&emsp;before T2, S10 and S11 are re-connected to the network. Now a get(“x”) with R=2 will yield<br>
&emsp;the value “y”, while a get(“x”) with R=3 will yield “a”. The reason the latter get() won’t<br>
&emsp;yield “y” along with “a” is that the version vectors will reveal that “a” supersedes “y”.

**IV**   **Two-Phase Commit or Paxos?**

During the Argus lecture, the question came up of whether one could use Paxos instead of two-<br>
phase commit to provide atomic distributed commit. That is, instead of participant machines an-<br>
swering “yes” or “no” to a two-phase commit prepare message depending on whether they are<br>
willing to commit, the participants could propose “yes” or “no” in a Paxos agreement.

&emsp;**6. \[10 points\]:** Why doesn’t that work?

**Answer:**   Atomic commit is required to abort if any of the participants doesn’t want to commit.<br>
Paxos is free to choose any of the proposed values for agreement. So if some participants propose<br>
“yes” and some propose “no”, Paxos may choose “yes”, even though atomic commit requires the<br>
outcome to be “abort.”


---

<a id="page-6"></a>
**Page 6**

6.824 Spring 2013, Quiz 2 Solutions   Page 6 of 10

**V**   **Argus**

Consider the bank example in Figures 6 and 7 of Liskov’s 1988 Argus paper. Suppose the bank<br>
has three branches (B1, B2, and B3), each with its own computer running a branch guardian. The<br>
bank also has two front ends, F1 and F2, each running a front-end guardian. There are three bank<br>
accounts, A1, A2, and A3, which are located at branches B1, B2, and B3, respectively.<br>
Front-end guardian F1 starts a transfer topaction from account A1 to account A2 (see Figure 7).<br>
The withdraw() sub-action, sent to B1, succeeds. However, B2’s network connection is broken,<br>
and is never fixed, so that B2 never responds to the deposit() message from F1.<br>
Meanwhile, F2 starts a transfer topaction from A1 to A3. F2 starts this transfer after F1’s with-<br>
draw() from A1 has completed.<br>
All the accounts exist and have sufficient funds for the transfers.

&emsp;**7. \[10 points\]:** Will F2’s transfer topaction be able to complete and commit successfully?<br>
&emsp;If it possible for it to commit, explain what has to happen before it can commit. If it is not<br>
&emsp;possible for it to commit, explain why not.<br>
&emsp;**Answer:**   Yes, F2’s transfer will be able to commit. Initially F1’s transfer has account A1<br>
&emsp;locked, so F2 cannot proceed. After a while the RPC from F1 to B2 will time out and fail,<br>
&emsp;causing F1 to abort, which will release the lock on A1. Then F2 can proceed and commit.


---

<a id="page-7"></a>
**Page 7**

6.824 Spring 2013, Quiz 2 Solutions   Page 7 of 10

**VI**   **MapReduce**

Suppose you modify MapReduce so that when a worker finishes each Map task, the worker pushes<br>
each intermediate file generated by that task to the worker that will run the corresponding Reduce<br>
task, and then deletes the intermediate file to save disk space. Your new design will require changes<br>
to the way the manager assigns reduce tasks to workers. Keep in mind that a MapReduce compu-<br>
tation is divided into many more map and reduce tasks than there are worker machines (Section<br>
3.5).

&emsp;**8. \[8 points\]:** Explain why this change would interact badly with the way that MapReduce<br>
&emsp;load-balances tasks across workers.

**Answer:**   MapReduce as described in the paper balances the reduce work across workers by<br>
allocating reduce tasks to workers lazily, as previous reduce tasks finish. But this change requires<br>
that map tasks be able to determine the worker for each reduce task before any of the reduce tasks<br>
execute. That would require the system to assign reduce tasks to workers ahead of time, making<br>
load balance harder.

&emsp;**9. \[8 points\]:** Explain why this change would force MapReduce to do more work to recover<br>
&emsp;from a failed reduce worker.

**Answer:** If a reduce worker failed, the only copy of the intermediate files for the reduce tasks it<br>
was responsible for would be gone. Regenerating them would require re-executing map tasks; in<br>
general all map tasks might have to re-executed.


---

<a id="page-8"></a>
**Page 8**

6.824 Spring 2013, Quiz 2 Solutions   Page 8 of 10

**VII**   **Bitcoin**

John sells tee-shirts on his web store, and he accepts Bitcoin. John also runs a Bitcoin peer, located<br>
in his apartment; he checks only this peer to learn about transactions (for example, payments from<br>
his customers). For a while everything is fine: John’s peer hears new blocks and new transactions<br>
from the other peers in the Bitcoin system, and he successfully receives payments from his cus-<br>
tomers. One day John’s ISP (Internet service provider) is taken over by Dark Forces who wish<br>
to trick John into accepting invalid Bitcoin transactions. The Dark Forces have complete control<br>
over the packets that John’s Bitcoin peer exchanges with other Bitcoin peers; the Dark Forces can<br>
read these packets, modify the packets, and generate new IP packets that appear to be to/from other<br>
Bitcoin peers. The Dark Forces have no other special powers (for example, they cannot break<br>
cryptographic schemes, they have considerably less total CPU power than the rest of the Bitcoin<br>
network, and they can’t break into John’s computers).

&emsp;**10.**   **\[10 points\]:** Explain how the Dark Forces can use their control over John’s peer’s<br>
&emsp;network connection to trick John into accepting a payment that uses a Bitcoin that has already<br>
&emsp;been spent.

**Answer:** Suppose the Dark Forces own bitcoin B, and that the latest block known to John’s peer<br>
is BL100. The Dark Forces can transfer B to someone other than John, but only send that transfer<br>
to bitcoin peers other than John’s peer; the Dark Forces would hide all blocks after BL100 from<br>
John’s peer in order to conceal that transfer. Then the Dark Forces could create an alternate B101’<br>
containing a transfer of B to John; it might take a while for them to compute the required nonce, or<br>
require them to have many CPUs, though they don’t have to have as many as the legitimate Bitcoin<br>
network. The Dark Forces could generate further alternate blocks B102’, B103’, etc. containing<br>
subsequent real transactions, to prevent John from noticing anything wrong. This attack “forks”<br>
the block chain, with one fork visible in the main bitcoin peer network, and the other fork visible<br>
only to John.


---

<a id="page-9"></a>
**Page 9**

6.824 Spring 2013, Quiz 2 Solutions   Page 9 of 10

**VIII**   **Memcache at Facebook**

Ben is building a new social networking web site. He reads the Scaling Memcache at Facebook<br>
paper, thinks the paper’s design is much too complex, and invents a scheme which he believes will<br>
be simpler and faster. Ben’s scheme involves just one cluster of front end and memcached servers;<br>
there are no regions, and no other clusters. As in the paper, Ben stores the “real” data in a set of<br>
database (DB) servers, and caches data in memcached for speed. Unlike the paper, when one of<br>
Ben’s web servers needs to change some data, it first updates the data in the DB, and then writes<br>
the new data to memcached. That is, where the paper deletes the data from memcached (right half<br>
of Figure 1), Ben’s scheme updates the data in memcached. Ben’s DB servers do not send deletes<br>
to memcached (that is, Ben’s scheme does not have the McSqueal mechanism shown in Figure 6).<br>
Ben’s web servers read data just as described in the paper (see the left half of Figure 1).<br>
Think of a specific situation in which Ben’s scheme would serve stale data to a web server, but in<br>
which the paper’s design would serve fresh data.

&emsp;**11. \[8 points\]:** Describe the situation.

**Answer:** The following is for key “k”. Client C1 writes value “x” to the DB, then writes “x” to<br>
memcache. Client C2 writes the value “y” to the DB, then writes “y” to memcache. If C1 is slow<br>
with its write to memcache, the system will end up with “y” in the DB but “x” in memcache. This<br>
inconsistency won’t go away until the next time a client writes “k”.

&emsp;**12. \[8 points\]:** Explain why the paper’s design would serve fresh data in that situation.

**Answer:** With the paper’s design, C1 and C2 delete key “k” from memcache, rather than updating<br>
it. So if C1 is late with its delete, that may delete a valid value from memcache, but the next reader<br>
will see nothing in memcache and fetch the correct value “y” from the DB.


---

<a id="page-10"></a>
**Page 10**

6.824 Spring 2013, Quiz 2 Solutions   Page 10 of 10

**IX**   **6.824**

&emsp;**13. \[3 points\]:** How could we improve the 6.824 project experience? Should there be more<br>
&emsp;time for the project (and less for the labs)? Or would you prefer to see no project and more<br>
&emsp;labs?<br>
&emsp;**Answer:** Votes for more emphasis on projects: 9. Votes for more emphasis on labs: 25.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;End of Quiz II Solutions

