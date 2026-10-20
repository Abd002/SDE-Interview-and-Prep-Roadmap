# MIT 6.824/6.5840 2010: Quiz 2: Official solutions

> Copied from the original: <https://pdos.csail.mit.edu/6.824/quizzes.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**


![Figure on page 1](figures/solutions-p01-fig01.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Department of Electrical Engineering and Computer Science<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;MASSACHUSETTS INSTITUTE OF TECHNOLOGY

&emsp;&emsp;&emsp;&emsp;&emsp;**6.824 Distributed System Engineering: Spring 2010**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Quiz II Solutions**

&emsp;All problems are open-ended questions. In order to receive credit you must answer the question as<br>
&emsp;precisely as possible. The quiz is designed to take 80 minutes, but you have two hours to complete<br>
&emsp;it.<br>
&emsp;Write your name on this cover sheet AND at the bottom of each page of this booklet.<br>
&emsp;Some questions may be much harder than others. Read them all through first and attack them in<br>
&emsp;the order that allows you to make the most progress. If you find a question ambiguous, be sure<br>
&emsp;to write down any assumptions you make. Be neat. If we can’t understand your answer, we can’t<br>
&emsp;give you credit!

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**THIS IS AN OPEN BOOK, OPEN NOTES QUIZ.**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**I (xx/36)**   **II (xx/14)**   **III (xx/48)**   **IV (xx/2)**   **Total (xx/100)**

**Name:**


---

<a id="page-2"></a>
**Page 2**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Grade histogram for Quiz 2

6


![Figure on page 2](figures/solutions-p02-fig02.png)

5

4

3

2

1

0<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;96-100<br>
&emsp;&emsp;&emsp;91-9586-9081-8576-8071-7566-7061-6556-6051-5546-5041-4536-4031-3526-3021-2516-2011-15<br>
&emsp;6-10<br>
1-5

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;max   =   92<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;median   =   75<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;µ   =   74.7<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;σ   =   9.9


---

<a id="page-3"></a>
**Page 3**

6.824 SPRING 2010, Quiz 2   **Page 3 of 13**

**I**   **YFS**

&emsp;**1. \[6 points\]:** Ben is working on Lab 6 and is having problems with his create function. Here it<br>
&emsp;is omitting error handling code:

&emsp;int yfs\_client::create(inum di, std::string name, int dir, inum &ci)<br>
&emsp;{<br>
&emsp;&emsp;std::string extent;<br>
&emsp;&emsp;lc-\>acquire(di);<br>
&emsp;&emsp;ci = ilookup(di, name);<br>
&emsp;&emsp;if (!ci) {<br>
&emsp;&emsp;&emsp;ci = random() & (˜0x80000000);<br>
&emsp;&emsp;&emsp;if (!dir)<br>
&emsp;&emsp;&emsp;&emsp;ci \|= 0x80000000;<br>
&emsp;&emsp;&emsp;ec-\>get(di, extent);<br>
&emsp;&emsp;&emsp;/\* add name and ci to extent \*/<br>
&emsp;&emsp;&emsp;ec-\>put(di, extent);<br>
&emsp;&emsp;&emsp;ec-\>put(ci, "");<br>
&emsp;&emsp;}<br>
&emsp;&emsp;lc-\>release(di);<br>
&emsp;&emsp;return OK;<br>
&emsp;}

&emsp;Ben’s code passed all test cases when he turned in Lab 5, but with his Lab 6 additions he can’t create<br>
&emsp;files correctly. Ben starts two yfs clients, yfs1 and yfs2, creates a file in yfs1 and verifies that it<br>
&emsp;is created correctly; however, he can’t open the file in yfs2. What is he doing wrong? Why did his<br>
&emsp;code work in Lab 5 and not in Lab 6?<br>
&emsp;**Answer:** Ben must add lc-\>acquire(ci) and lc-\>release(ci), so that on an invalidate for<br>
&emsp;lock ci the corresponding extent will be flushed.

**Name:**


---

<a id="page-4"></a>
**Page 4**

6.824 SPRING 2010, Quiz 2   **Page 4 of 13**

&emsp;**2. \[6 points\]:** Here is the heartbeat handler function that responds to a heartbeat RPC:

&emsp;paxos\_protocol::status<br>
&emsp;config::heartbeat(std::string m, unsigned vid, int &r)<br>
&emsp;{<br>
&emsp;&emsp;assert(pthread\_mutex\_lock(&cfg\_mutex)==0);<br>
&emsp;&emsp;int ret = paxos\_protocol::ERR;<br>
&emsp;&emsp;r = (int) myvid;<br>
&emsp;&emsp;printf("heartbeat from %s(%d) myvid %d\\n", m.c\_str(), vid, myvid);<br>
&emsp;&emsp;if (vid == myvid) {<br>
&emsp;&emsp;&emsp;ret = paxos\_protocol::OK;<br>
&emsp;&emsp;} else if (pro-\>isrunning()) {<br>
&emsp;&emsp;&emsp;assert (vid == myvid + 1 \|\| vid + 1 == myvid);<br>
&emsp;&emsp;&emsp;ret = paxos\_protocol::OK;<br>
&emsp;&emsp;} else {<br>
&emsp;&emsp;&emsp;ret = paxos\_protocol::ERR;<br>
&emsp;&emsp;}<br>
&emsp;&emsp;assert(pthread\_mutex\_unlock(&cfg\_mutex)==0);<br>
&emsp;&emsp;return ret;<br>
&emsp;}

&emsp;Below is a list of events triggered by node C trying to join. The starting view is 2 and contains A and<br>
&emsp;B where A is the primary;

&emsp;&emsp;**–** C asks A to join.<br>
&emsp;&emsp;**–** A starts Paxos to decide on view 3 with A,B,C in the view; A goes through the prepare and<br>
&emsp;&emsp;&emsp;accept phases.<br>
&emsp;&emsp;**–** In the decide phase, A sends a decidereq to itself and moves to view 3.<br>
&emsp;&emsp;**–** B’s heartbeat timer expires and the config code sends a heartbeat to A.<br>
&emsp;&emsp;**–** A sends a decidereq to B.<br>
&emsp;&emsp;**–** A receives the heartbeat from B and replies with   .<br>
&emsp;&emsp;**–** B receives the decidereq and moves to view 3.<br>
&emsp;&emsp;**–** B receives the response to the heartbeat from A.

&emsp;Fill in the blank, what will A’s heartbeat RPC handler (the function above) return? Circle the line of<br>
&emsp;code that assigns the return value to ret in the code above.<br>
&emsp;**Answer:** It will reply with OK, since A is running Paxos, and pro-\>isrunning() will return true.

**Name:**


---

<a id="page-5"></a>
**Page 5**

6.824 SPRING 2010, Quiz 2   **Page 5 of 13**

&emsp;**3. \[8 points\]:** The high load on athena.lcs.mit.edu this year has revealed a bug in the YFS provided<br>
&emsp;code. The problem is a race between the heartbeat RPC and the Paxos decide RPC. Below is a list of<br>
&emsp;events that leads to this race. The starting view is 2 and contains A and B where A is the primary;<br>
&emsp;node C is trying to join.

&emsp;&emsp;**–** C asks A to join.<br>
&emsp;&emsp;**–** A starts Paxos to decide on view 3 with A,B,C in the view; A goes through the prepare and<br>
&emsp;&emsp;&emsp;accept phases.<br>
&emsp;&emsp;**–** In the decide phase, A sends a decidereq to itself and moves to view 3.<br>
&emsp;&emsp;**–** A’s heartbeat timer expires and the config code sends a heartbeat to B.<br>
&emsp;&emsp;**–** A sends a decidereq to B.<br>
&emsp;&emsp;**–** B first receives the heartbeat and replies with ERR, since it is still in view number 2.<br>
&emsp;&emsp;**–** B then receives the decidereq and moves to view 3.<br>
&emsp;&emsp;**–** A receives the response to the heartbeat from B and starts Paxos again to remove B from view 3.

&emsp;How should the YFS code be changed to address this race so that B is not eliminated from the view?<br>
&emsp;**Answer:** A few different solutions are possible. For example, A can sends the decidereq to itself<br>
&emsp;last, avoiding the race. As another example, A can note that it is running the proposer and return OK<br>
&emsp;to B’s hearbeat in that case.

**Name:**


---

<a id="page-6"></a>
**Page 6**

6.824 SPRING 2010, Quiz 2   **Page 6 of 13**

&emsp;**4.**   **\[8 points\]:** Ben suggests eliminating sequence numbers in the YFS RSM protocol. He plans<br>
&emsp;to remove sequence numbers sent in the RPCs between the lock server primary and the lock server<br>
&emsp;backups. Give an argument why Ben’s proposed change is correct or incorrect.<br>
&emsp;**Answer:** The sequence numbers in the replication protocol between the primary and backups can be<br>
&emsp;eliminated, because the primary won’t send the next request to the backups until it has received results<br>
&emsp;from the backups for the current request.

&emsp;**Answer:** The sequence numbers on lock requests cannot be eliminated, because the backups may<br>
&emsp;have processed the lock request, but the client may not learn about the result because the primary<br>
&emsp;may fail before responding to the client. In that case, the client will retry and resend its request.<br>
&emsp;The replicated lock service must be able to detect that this request is a retry, so that it can respond<br>
&emsp;appropriately.

&emsp;**5. \[8 points\]:** After every view change, the YFS lock servers choose the primary according to these<br>
&emsp;rules: If the primary in the previous view is a member of the new view, then it will stay the primary.<br>
&emsp;Otherwise, the node with the lowest-numbered ID of the previous view will be the new primary. In<br>
&emsp;either case, the new primary will be a node from the previous view.<br>
&emsp;Ben proposes to simplify the rule so that the lock servers always choose the node with the smallest-<br>
&emsp;numbered ID as the primary. Give a scenario that shows why the simplified rule isn’t a good idea.<br>
&emsp;(Draw a timing diagram with a brief explanation.)<br>
&emsp;**Answer:** Assume 3 nodes, A, B, and C, with A being the lowest ID. A, B, and C are in a view<br>
&emsp;processing requests. A fails. B and C form a new view, and process new requests, resulting in a lock<br>
&emsp;table L. A rejoins, it will be the new primary and with B’s simple rule, B and C download A’s lock<br>
&emsp;state, losing the state of L.

**Name:**


---

<a id="page-7"></a>
**Page 7**

6.824 SPRING 2010, Quiz 2   **Page 7 of 13**

**II**   **Paxos in YFS**

Here are the proposer run and prepare functions omitting all error handling code:<br>
1   bool proposer::run(int instance, std::vector\<std::string\> c\_nodes,<br>
2   std::string newv) {<br>
3   std::vector\<std::string\> accepts, nodes;<br>
4   std::string v;<br>
5   bool r = false;<br>
6   pthread\_mutex\_lock(&pxs\_mutex);<br>
7   /\* call setn() and set any global state \*/<br>
8   v.clear();<br>
9   if (prepare(instance, accepts, c\_nodes, v)) {<br>
10   if (majority(c\_nodes, accepts)) {<br>
11   if (v.size() == 0)<br>
12   v = newv;<br>
13   nodes = accepts;<br>
14   accepts.clear();<br>
15   accept(instance, accepts, nodes, v);<br>
16   if (majority(c\_nodes, accepts)) {<br>
17   decide(instance, accepts, v);<br>
18   r = true;<br>
19   }<br>
20   }<br>
21   }<br>
22   pthread\_mutex\_unlock(&pxs\_mutex);<br>
23   return r;<br>
24 }<br>
25 bool proposer::prepare(unsigned instance, std::vector\<std::string\> &accepts,<br>
26   std::vector\<std::string\> nodes, std::string &v) {<br>
27   prop\_t highn;<br>
28   highn.n = 0;<br>
29   highn.m = me;<br>
30   for (unsigned i = 0; i \< nodes.size(); i++) {<br>
31   paxos\_protocol::preparearg a;<br>
32   paxos\_protocol::prepareres r;<br>
33   /\* setup argument a, zero out r \*/<br>
34   pthread\_mutex\_unlock(&pxs\_mutex);<br>
35   handle(nodes\[i\]).get\_rpcc()-\>call(paxos\_protocol::preparereq,<br>
36   me, a, r, rpcc::to(1000));<br>
37   pthread\_mutex\_lock(&pxs\_mutex);<br>
38   if (r.oldinstance \|\| !r.accept) {<br>
39   /\* handle old instance or not accepted \*/<br>
40   } else {<br>
41   accepts.push\_back(nodes\[i\]);<br>
42   if (r.n\_a \> highn) {<br>
43   highn = r.n\_a;<br>
44   v = r.v\_a;<br>
45   }<br>
46   }<br>
47   }<br>
48   return true;<br>
49 }

**Name:**


---

<a id="page-8"></a>
**Page 8**

6.824 SPRING 2010, Quiz 2   **Page 8 of 13**

&emsp;**6. \[6 points\]:** Ben removes lines 42 through 45; Alyssa thinks that this change is a bad idea. Give<br>
&emsp;a scenario that shows it is a bad idea to remove those lines of code. (Draw a timing diagram with a<br>
&emsp;brief explanation.)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Prepare<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;ABC<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Accept


![Figure on page 8](figures/solutions-p08-fig03.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Decide

&emsp;&emsp;&emsp;&emsp;&emsp;1

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2<br>
&emsp;**Answer:**<br>
&emsp;The scenario needs to include two proposing nodes. In the above diagram, node A proposes value v1<br>
&emsp;and C value v2. A proposes and sends accepts, and nodes A, B, C accept. A sends decides to A, B, C<br>
&emsp;but is partitioned and only A decides on v1 (marked as time 1 on the diagram). Now C proposes v2 to<br>
&emsp;A,B,C. B and C reply with v1 in their proposes reply messages, but node C ignores them and sends<br>
&emsp;accepts on v2; node B, C accept. C sends out decides to B, C (marked as time 2 on the diagram).<br>
&emsp;Now when the partition heals, A and C have decided on two different values.

**Name:**


---

<a id="page-9"></a>
**Page 9**

6.824 SPRING 2010, Quiz 2   **Page 9 of 13**

&emsp;**7. \[8 points\]:** Ben rethinks the situation and replaces lines 42 through 45 with these lines instead:<br>
&emsp;&emsp;&emsp;&emsp;if (r.n\_a.n \> 0)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;v = r.v\_a;<br>
&emsp;Give a scenario that shows that Paxos fails to meet its specification with Ben’s change. (Draw a<br>
&emsp;diagram showing the Paxos messages.)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;AB   C   D   E


![Figure on page 9](figures/solutions-p09-fig04.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Prepare<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Accept<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Decide

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;E,v2 committed

&emsp;&emsp;&emsp;&emsp;&emsp;A,v1<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;A,v1A,v1A,v1E,v2<br>
&emsp;**Answer:**<br>
&emsp;The scenario must again involve two concurrent proposers. With the change the protocol will not<br>
&emsp;stick to the highestest-numbered proposal. One proposer may chose a lowered-number proposal<br>
&emsp;while another proposer may chose a higher-numbered proposal. As a a result, proposers commit to<br>
&emsp;different values. The timing diagram illustrates an example.

**Name:**


---

<a id="page-10"></a>
**Page 10**

6.824 SPRING 2010, Quiz 2   **Page 10 of 13**

**III**   **Short paper questions**

&emsp;**8. \[6 points\]:** Consider the mailer system written for Argus as described on pages 398–400 of the<br>
&emsp;paper. Suppose Alyssa sends an email to a list (alyssa, bob, and charles), while at the same time a<br>
&emsp;system administrator is creating an account for charles (using add user). Given that mailboxes for<br>
&emsp;each user may be on different machines and Charles’s mailbox may exist or not, what are the possible<br>
&emsp;outcomes of who will receive Alyssa’s message? (Explain your answer briefly.)<br>
&emsp;**Answer:** The mailer will deliver to all three or none, because of the two-phase commit protocol and<br>
&emsp;the subactions that Argus uses.

&emsp;**9. \[6 points\]:** A local bank runs a hypervisor-based fault tolerant system as described by Bressoud<br>
&emsp;and Schneider. One night the cleaner trips over the cables in the machine room and accidentally<br>
&emsp;disconnects the primary from the backup (but both can still communicate with the shared disk). Does<br>
&emsp;the system keep operating correctly? (Explain your answer briefly.)<br>
&emsp;**Answer:** No. Because the communication is broken, the backup will assume the primary has failed,<br>
&emsp;and thus become a primary. Now the system runs with two primaries, both writing to the shared disk.

&emsp;**10. \[6 points\]:** The same cleaner trips over a wire in a Frangipanni system (as described by Thekkath<br>
&emsp;et al.) and partitions the network. Could more than one file server, in different partitions, successfully<br>
&emsp;acquire the same lock concurrently and perform updates? (Explain your answer briefly.)<br>
&emsp;**Answer:** No. Only the partition with the majority of the nodes will have a lock server that responds<br>
&emsp;to lock requests, and the server in that partition is able to acquire the lock. In addition, the system’s<br>
&emsp;use of leases on locks ensures that locks will be “released” after the lease time expires.

**Name:**


---

<a id="page-11"></a>
**Page 11**

6.824 SPRING 2010, Quiz 2   **Page 11 of 13**

&emsp;**11. \[6 points\]:** Given the protocol in the Chord paper, is lookup(k) guaranteed to return the IP<br>
&emsp;address of the node that stores k? (Explain your answer briefly.)<br>
&emsp;**Answer:** No. During stabilization, a node responsible for a key may not have that key yet. The<br>
&emsp;application is supposed to retry when a lookup fails.

&emsp;**12.**   **\[6 points\]:** Alyssa modifies the PBFT protocol described by Castro and Liskov as follows.<br>
&emsp;Instead of sending a set of 2f+1 responses to the client, she sends only f+1. Describe a scenario under<br>
&emsp;which Byzantine nodes can fool the client. (Explain your answer briefly.)<br>
&emsp;**Answer:** The paper describes a slightly different protocol than the lecture notes, but they boil down<br>
&emsp;to the same thing. With f+1 responses, the client cannot decide what the valid response is from the<br>
&emsp;f+1. The f faulty nodes can outvote the valid response.

&emsp;**13. \[6 points\]:** Alyssa adds a SUNDR-like feature to PBFT. Clients know the public keys of all other<br>
&emsp;clients that are using the system. A client signs the data before sending it to the PBFT RSM—you<br>
&emsp;may assume that clients are not compromised. After a client receives n responses from the RSM, the<br>
&emsp;client verifies the responses with the public key of the client. How many responses at minimum must<br>
&emsp;a client receive before the client knows it has received a correct response (i.e., meeting the specs of a<br>
&emsp;non-faulty replicated state machine)? (Explain your answer briefly.)<br>
&emsp;**Answer:** The client can verify which response has valid data (i.e., signed by another client.), but the<br>
&emsp;client must still receive 2f+1 responses to ensure that it can determine the order for responses.

**Name:**


---

<a id="page-12"></a>
**Page 12**

6.824 SPRING 2010, Quiz 2   **Page 12 of 13**

&emsp;**14. \[6 points\]:** Alyssa logs in to Yahoo!, updates her entry in the user database, and views her entry.<br>
&emsp;Sketch the application code for Alyssa’s update and read operations in terms of the primitives listed<br>
&emsp;in Section 2.2 of the PNUTS paper. The code must meet the user database specification described in<br>
&emsp;Section 4. (Sketch the pseudocode.)<br>
&emsp;**Answer:** Alyssa update to her profile:<br>
&emsp;v = write(profile)<br>
&emsp;read-critical(v, profile)

&emsp;**15. \[6 points\]:** Continuing from the previous question, describe a scenario under which Ben might<br>
&emsp;not see Alyssa’s change, even if he looks up Alyssa’s page after Alyssa made the change. (Draw a<br>
&emsp;timing diagram with a brief explanation.)<br>
&emsp;**Answer:** Ben’s code uses read-any(Alyssa’s profile). If Alyssa updates her profile, and if the network<br>
&emsp;between Ben and Alyssa partitions, any-read may read Alyssa’s profile from a storage node in Ben’s<br>
&emsp;partition that hasn’t been updated yet.

**Name:**


---

<a id="page-13"></a>
**Page 13**

6.824 SPRING 2010, Quiz 2   **Page 13 of 13**

**IV**   **6.824**

&emsp;**16. \[2 points\]:** Did you learn anything in 6.824? Please give a score on a scale from 0 (nothing) to<br>
&emsp;10 (more than I had hoped for), and briefly explain.<br>
&emsp;**Answer:** Thanks for taking the class! Enjoy the sumer.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;End of Quiz II

**Name:**

