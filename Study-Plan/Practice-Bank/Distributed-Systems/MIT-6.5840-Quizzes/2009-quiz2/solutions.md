# MIT 6.824/6.5840 2009: Quiz 2: Official solutions

> Copied from the original: <https://pdos.csail.mit.edu/6.824/quizzes.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**


![Figure on page 1](figures/solutions-p01-fig01.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Department of Electrical Engineering and Computer Science<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;MASSACHUSETTS INSTITUTE OF TECHNOLOGY<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**6.824 Distributed System Engineering: Spring 2009**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Quiz II Solutions**

&emsp;All problems are open-ended questions. In order to receive credit you must answer the question as<br>
&emsp;precisely as possible. The quiz is designed to take 80 minutes, but you have two hours to complete<br>
&emsp;it. (If you finish early, we included some light additional reading.)<br>
&emsp;Write your name on this cover sheet AND at the bottom of each page of this booklet.<br>
&emsp;Some questions may be much harder than others. Read them all through first and attack them in<br>
&emsp;the order that allows you to make the most progress. If you find a question ambiguous, be sure<br>
&emsp;to write down any assumptions you make. Be neat. If we can’t understand your answer, we can’t<br>
&emsp;give you credit!<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**THIS IS AN OPEN BOOK, OPEN NOTES QUIZ.**

&emsp;&emsp;&emsp;&emsp;**I (xx/40)**   **II (xx/16)**   **III (xx/25)**   **IV (xx/12)**   **V (xx/7)**   **Total (xx/100)**

**Name:**


---

<a id="page-2"></a>
**Page 2**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Grade histogram for Quiz 2


![Figure on page 2](figures/solutions-p02-fig02.png)

10

9

8

7

6

5

4

3

2

1

0<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;96-100<br>
&emsp;&emsp;&emsp;91-9586-9081-8576-8071-7566-7061-6556-6051-5546-5041-4536-4031-3526-3021-2516-2011-15<br>
&emsp;&emsp;6-10<br>
1-5

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;max<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;=   99<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;median<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;=   81<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;µ   =   77.3<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;σ   =   11.3


---

<a id="page-3"></a>
**Page 3**

6.824 SPRING 2009, Quiz 2 Solutions   **Page 3 of 10**<br>
**I**   **Short Questions**<br>
&emsp;**1. \[8 points\]:** The Storm authors, tired of pesky researchers infiltrating their botnet, want to prevent<br>
&emsp;it from being subverted in the future. They propose two defenses to address the attacks used by the<br>
&emsp;Spamalytics authors, and hire you to evaluate their designs. (For the purposes of this problem, assume<br>
&emsp;that you have no scruples.) Assume that the Storm authors have a secure way to distribute keys to<br>
&emsp;proxies and workers.<br>
&emsp;Which of the following changes would address the attack described in the Spamalytics paper?   Circle<br>
&emsp;all   that   apply. For each proposal that won’t work, explain why not. If they both work, identify the one<br>
&emsp;you think is better (for the Storm authors) and give a specific argument why it is superior.<br>
&emsp;**(a)** Each master adds a MAC to messages for each proxy using a key it shares with that proxy. Each<br>
&emsp;proxy adds a MAC to messages for each worker using a key it shares with that worker. Proxies and<br>
&emsp;workers verify the MACs on messages they receive.<br>
&emsp;**(b)** The masters use their private keys to sign the tasks intended for each worker. Workers verify the<br>
&emsp;signatures on messages they receive.<br>
&emsp;Both changes address the attack described in the paper, wherein the researchers run the unmodified<br>
&emsp;proxy and only intercept and rewrite network traffic.<br>
&emsp;So which one is better? You could have argued that MACs are better because they solve the problem<br>
&emsp;and are much cheaper than signatures, which reduces the load on the master. Alternatively, you could<br>
&emsp;have argued that signatures are better because they would prevent more sophisticated attacks where<br>
&emsp;the proxies themselves are modified.

&emsp;**2. \[8 points\]:** After seeing the 6.824 Lab 9 demos, Ben Bitdiddle decides to implement his extent<br>
&emsp;service on top of Chord for better scalability. He implements Chord as described in the paper. He<br>
&emsp;uses the extent numbers as keys, and stores each extent at the Chord node that is responsible for the<br>
&emsp;extent’s key. He notices that when a new node is joining, `get`s sometimes fail and report that extents<br>
&emsp;are missing. Give a specific example to illustrate the problem, and describe a simple way to fix it.<br>
&emsp;Assume that there are no failures, network partitions, or multiple concurrent joins.<br>
&emsp;This can happen when a new node joins the ring but has not yet transferred the extents from its<br>
&emsp;successor. Several fixes are possible, but the simplest is probably the one suggested by the paper,<br>
&emsp;where clients retry periodically if Chord can’t find the requested extent.

**Name:**


---

<a id="page-4"></a>
**Page 4**

**Page 4 of 10**   6.824 Spring 2009, Quiz 2 Solutions

&emsp;**3. \[8 points\]:** Suppose we took a system that uses SUNDR and made it extra secure by replicating<br>
&emsp;the SUNDR server with BFT. In what ways does this provide stronger security than just using SUNDR<br>
&emsp;alone?<br>
&emsp;One answer is that if between 1 and f replicas are compromised, BFT + SUNDR provides sequential<br>
&emsp;consistency instead of fork consistency. Another possible answer is that BFT + SUNDR provides<br>
&emsp;availability when between 1 and f replicas are compromised, whereas with SUNDR alone, a single<br>
&emsp;compromised server can prevent clients from making progress.

&emsp;**4.**   **\[8 points\]:** Consider the application described in Example 1 in the PNUTS paper. Describe<br>
&emsp;how you would write this application with the PNUTS primitives (`read-any`, `read-critical`,<br>
&emsp;`read-latest`, `write`, and `test-and-set-write`.) You only need to discuss the two op-<br>
&emsp;erations in the example: publishing photos and updating the access control list. Explain why your<br>
&emsp;implementation would avoid the problem discussed in the example.<br>
&emsp;One possible solution:

&emsp;`(acl,` `photos)` `=` `read-any();`<br>
&emsp;`latest`   `version` `=` `write(acl` `-` `’mom’);`<br>
&emsp;`while` `(!test-and-set-write(latest`   `version,` `photos` `+` `new`   `photo))`<br>
&emsp;&emsp;`(latest`   `version,` `photos)` `=` `read-latest(photos);`

&emsp;This ensures that the ACL update is applied before the photo is published. Since PNUTS only guar-<br>
&emsp;antees per-row consistency, the photo list and the ACL must also be in the same row.

&emsp;**5.**   **\[8 points\]:** Ben is designing a new web browser, Chromium, and considering which features<br>
&emsp;to include to achieve world domination. After reading the Coral paper, he wonders if he could add<br>
&emsp;something to the browser to simplify the design of the Coral CDN and reduce latency for users.<br>
&emsp;Describe the additional functionality the web browser should have to achieve Ben’s goals, and explain<br>
&emsp;how it achieves them.<br>
&emsp;A good strategy is for the browser to do the measurement and proxy selection itself, rather than<br>
&emsp;relying on a layer of indirection (the resolver) to do it. This simplifies the resolver and results in more<br>
&emsp;accurate measurement; the system no longer needs the assumption that proxies that are close to the<br>
&emsp;resolver are close to the client. It also means that dnssrv does not need to verify that HTTP proxies<br>
&emsp;are live before returning them. (See the last paragraph of Section 3.1.)


---

<a id="page-5"></a>
**Page 5**

6.824 SPRING 2009, Quiz 2 Solutions   **Page 5 of 10**<br>
**II**   **Paxos**<br>
Recall the following snippets from the Paxos pseudocode in lab 7:

`if` `node` `receives` `prepare(instance,` `n):`<br>
&emsp;`if` `instance` `<=` `instance_h:`<br>
&emsp;&emsp;`return` `oldinstance(instance,` `values[instance])`<br>
`[...]`<br>
`if` `node` `gets` `accept(instance,` `n,` `v):`<br>
&emsp;`if` `instance` `<=` `instance_h:`<br>
&emsp;&emsp;`return` `oldinstance(instance,` `values[instance])`

&emsp;**6.\[8 points\]:** Many students noticed that the return type of `acceptreq()` was an integer and<br>
&emsp;couldn’t encode an `oldinstance` response. It was claimed on the mailing lists that it was okay<br>
&emsp;to simply reject the `accept` message in the above scenario instead of modifying the return type of<br>
&emsp;`acceptreq()` to return an `oldinstance` response. Explain why this modification is correct.<br>
&emsp;If a quorum of nodes are in a later view and reject the `accept` message, the leader will fail to get a<br>
&emsp;majority, abort, and try again starting from the prepare phase. When it sends out the new `prepare`s,<br>
&emsp;it will get an `oldinstance`response. (Even though it does not affect correctness, allowing `accept`<br>
&emsp;to return an `oldinstance` response might improve performance marginally.)

Recall the `rsm`   `tester`’s test 6, which kills the fourth server, then kills the primary after the accept phase<br>
of Paxos but before the decide phase. Finally, it restarts the fourth server.<br>
A student asked the following question on the discussion list:

&emsp;When I try test 6, nodes 2/3/4 all manage to agree on the view (2,3,4) in the end, but they don’t<br>
&emsp;first agree on the view originally proposed by the first node (that is, (1,2,3)), so the test fails. I<br>
&emsp;don’t see what’s wrong with what my implementation does – why should nodes 2/3/4 agree on<br>
&emsp;(1,2,3) before moving on to (2,3,4)?

&emsp;**7. \[8 points\]:** Provide a succinct answer to the student’s question:<br>
&emsp;Once an instance of Paxos has chosen a particular value, no other value should be chosen. Otherwise,<br>
&emsp;different nodes might disagree about the membership of the new view, which is exactly the problem<br>
&emsp;Paxos is designed to prevent. Hence, when the coordinator fails after a quorum has accepted the<br>
&emsp;value `(1,2,3)`, the new coordinator must commit `(1,2,3)`.

**Name:**


---

<a id="page-6"></a>
**Page 6**

**Page 6 of 10**   6.824 Spring 2009, Quiz 2 Solutions<br>
**III**   **Replicated State Machines**<br>
Lem E. Tweakitt completes all the 6.824 labs as suggested by the course staff. However, he isn’t sure why<br>
his lock service needs to add sequence numbers to `acquire` and `release` requests. He reasons that<br>
the RPC code already attaches sequence numbers to requests and provides at-most-once semantics, and it<br>
appears that the additional sequence numbers are redundant.<br>
&emsp;**8. \[8 points\]:** Use the timing diagram below to show what would go wrong if Lem omitted these<br>
&emsp;sequence numbers (and related code) from the lock service, and made no other changes. Assume that<br>
&emsp;the clients do not crash and failed replicas do not re-join.   Hint:   The   scenario   must   involve   two   clients.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;backup 2<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;primarybackup 1<br>
&emsp;&emsp;&emsp;&emsp;client 1   client 2


![Figure on page 6](figures/solutions-p06-fig03.png)

&emsp;The diagram illustrates a scenario where the primary sends the `acquire` operation to the backups,<br>
&emsp;then crashes before it can reply to the client. A view change occurs, and the client retries the request<br>
&emsp;on the new primary. However, the new primary’s state indicates that the lock is already held, so it<br>
&emsp;incorrectly replies with `RETRY`.<br>
&emsp;In principle, Lem could modify his lock server to address the above problem by looking at which client<br>
&emsp;sent the `acquire` request. However, it’s possible to construct a scenario where sequence numbers<br>
&emsp;are needed regardless. Suppose the `rsm`   `client` times out and retransmits a `release` request. The<br>
&emsp;original request is delayed by the network and delivered much later, after the lock has been acquired<br>
&emsp;again. This confuses the lock server into granting the lock to two different clients.


---

<a id="page-7"></a>
**Page 7**

6.824 SPRING 2009, Quiz 2 Solutions   **Page 7 of 10**

Lem observes that the extent service loses all its state if the extent server crashes. He modifies the extent<br>
service to keep its state on disk. When a `put` writes an extent, the extent service writes the modified extent<br>
to the disk before returning an `OK` response. For high availability, he replicates this extent service using his<br>
correctly working RSM code. As with the lock service, his extent service adds sequence numbers to `put`s<br>
and `get`s and handles duplicates appropriately.<br>
Since the extent service stores state on disk, Lem also wants the RSM to recover correctly after nodes fail<br>
and re-join the RSM. In particular, Lem wants to make it possible for all nodes of the RSM to fail, restart,<br>
re-join, and continue correctly when a majority of the nodes is back up.<br>
&emsp;**9. \[8 points\]:** Alyssa argues that the YFS RSM design is insufficient for correct recovery of Lem’s<br>
&emsp;service. She suggests that Lem should modify the extent service to write the view stamp (view #,<br>
&emsp;sequence #) of the last RSM operation on disk before acknowledging the operation to primary. The<br>
&emsp;primary writes the view stamp on disk before responding to a client. Use the timing diagram below to<br>
&emsp;construct a scenario that shows what might go wrong without Alyssa’s fix.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;backup 2<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;primarybackup 1<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;client 1


![Figure on page 7](figures/solutions-p07-fig04.png)

&emsp;The diagram illustrates a situation in which the initial view consists of the primary and backup 2. All<br>
&emsp;the replicas crash at a point where backup 2 has extent `0x1`. The two backups restart and recover,<br>
&emsp;and backup 1 becomes the new primary. However, the backups’ states differ: backup 2 has extent `0x1`<br>
&emsp;and backup 1 does not. Without knowing the last viewstamp each replica committed, it’s uncertain<br>
&emsp;which replica has the most up-to-date state. If the recovery procedure guesses wrong, then sequential<br>
&emsp;consistency is violated, as illustrated in the diagram.

**Name:**


---

<a id="page-8"></a>
**Page 8**

**Page 8 of 10**   6.824 Spring 2009, Quiz 2 Solutions

After implementing Alyssa’s suggestion, Lem observes that his RSM handles failures well. However, Lem’s<br>
na¨ıve recovery protocol (based on the Lab 8 framework) is inefficient when there are many extents because<br>
primary and backups transfer all the extents over the network to synchronize their state. For instance, in<br>
Lem’s system, if a node crashes and immediately re-joins, it will download all of the extents from the<br>
primary, even if most of the extents on the recovering node’s disk are already up to date.

&emsp;**10. \[9 points\]:** Ben Bitdiddle tells Lem that he may be able to speed up recovery in some cases by<br>
&emsp;using redo-only logs. Propose a design that uses redo logs for recovery. You may need to change both<br>
&emsp;the replication protocol and the recovery protocol.<br>
&emsp;The key challenge in this problem is that if a failure occurs, some of the backups may have received an<br>
&emsp;operation from the primary that will not commit. For instance, suppose extent `0x1` initially contains<br>
&emsp;`foo`, and a backup receives `put(0x1,` `"bar")` from the primary. It writes the new value to disk<br>
&emsp;and logs it, but becomes partitioned from the network before it can reply. The primary aborts the<br>
&emsp;operation and initiates a view change to remove the partitioned backup. The other replicas, which all<br>
&emsp;agree that extent `0x1` contains `foo`, continue to process requests. When the excluded backup rejoins,<br>
&emsp;its log and the contents of extent `0x1` will be inconsistent with the other replicas.<br>
&emsp;Replication protocol:   A simple solution to this problem is to use a two-phase replication protocol. The<br>
&emsp;backups log and acknowledge `invoke` requests, but not execute the operations right away. When the<br>
&emsp;primary replies to the client, it also multicasts a `commit` message to the backups, informing them<br>
&emsp;that they can execute the requests. (Since the replication protocol we use does not allow multiple<br>
&emsp;concurrent requests, the primary can implicitly tell the backups to commit request r when it sends<br>
&emsp;request r + 1.)<br>
&emsp;Recovery protocol:   Instead of doing full state transfer, nodes send only the needed log entries. A<br>
&emsp;backup that rejoins and is n operations behind needs the last n committed log entries. Additionally, if<br>
&emsp;the new primary logged an `invoke` in the old view, it should re-send the request in the new view and<br>
&emsp;ensure that the backups commit it (since a replica that failed in the old view might have committed it<br>
&emsp;already.)<br>
&emsp;An alternative solution is to have the primary ask the backups to checkpoint their logs periodically,<br>
&emsp;which effectively provides an “undo” mechanism. (To address the problem described above, the<br>
&emsp;checkpoint must cover up to the most recently committed   operation.) In recovery, nodes send log<br>
&emsp;entries as described above and roll forward from the most recent checkpoint.


---

<a id="page-9"></a>
**Page 9**

6.824 SPRING 2009, Quiz 2 Solutions   **Page 9 of 10**<br>
**IV**   **Byzantine Fault Tolerance**<br>
For each of the following changes to BFT, explain what can go wrong with the resulting protocol. If nothing<br>
can go wrong, explain why not. (Focus on correctness, not performance.)

&emsp;: Instead of having every replica broadcast pre-**11.**   **\[4 points\]:** Reducing the number of messages<br>
&emsp;pare and commit messages (O(n2) messages in total) as described in the paper, replicas send these<br>
&emsp;messages to the primary. The primary collects 2f + 1 `prepare` (or `commit`) messages and then<br>
&emsp;broadcasts a prepared (or committed) certificate to the replicas (O(n) messages in total).<br>
&emsp;This change is fine. BFT does not trust the network and signs all messages, so a malicious primary<br>
&emsp;can’t trick replicas into accepting bogus messages. The primary can try to prevent the replicas for<br>
&emsp;making progress, but the replicas will eventually notice this and request a view change.<br>
&emsp;This is the version of the protocol that was presented in lecture.

&emsp;: When replicas receive a `pre-prepare` for a read-only**12.**   **\[4 points\]:** Read-only optimization<br>
&emsp;request, they reply to the client immediately, and the client accepts f + 1 matching replies as the<br>
&emsp;answer.<br>
&emsp;This change sacrifices serializability. Of the f + 1 replies the client receives, up to f could be from<br>
&emsp;liars, and up to f could be from non-faulty replicas that are behind. For a concrete example, consider<br>
&emsp;the setup described in Question 13. Suppose A, B, and C commit request r1 from client 1, which<br>
&emsp;changes the value x from 1 to 2. Then client 2 sends request r2, which reads x. A lies and says that<br>
&emsp;x is 1, and D is behind and also says x is 1, so client 2 believes that x is still 1.<br>
&emsp;The paper describes a similar optimization, but points out that it is necessary to wait for 2f + 1<br>
&emsp;replies.

Suppose we have a BFT deployment with 4 replicas: A, B, C, and D. The malicious primary A, gets<br>
request r1 from client 1 and r2 from client 2.

&emsp;**13.**   **\[4 points\]:** A tries to get B and C to prepare request r1, and then tries to get D to prepare<br>
&emsp;request r2 with the same sequence number. Explain in one or two sentences sentence what feature of<br>
&emsp;BFT prevents the attack and how.<br>
&emsp;Replicas do not prepare requests unless 2f + 1 other replicas agree to the ordering proposed by the<br>
&emsp;primary.

**Name:**


---

<a id="page-10"></a>
**Page 10**

**Page 10 of 10**   6.824 Spring 2009, Quiz 2 Solutions<br>
**V**   **6.824**<br>
&emsp;**14. \[3 points\]:** Many have speculated that had the authors of AnalogicFS actually implemented their<br>
&emsp;system completely, they would have discovered that using lambda calculus to manage the lookaside<br>
&emsp;buffer is harder in practice than it looks on paper. Think back about all the labs you implemented.<br>
&emsp;What was the biggest challenge you faced and what made it difficult?<br>
&emsp;Most common answers:<br>
&emsp;&emsp;16   fault tolerance (labs 7 and 8)<br>
&emsp;&emsp;10   concurrency / distributed debugging<br>
&emsp;&emsp;1   implementing Paxos while on flight to Paris<br>
&emsp;&emsp;6   other

&emsp;**15.**   **\[4 points\]:** If you could change one thing in 6.824, what would it be? (If you think 6.824 is<br>
&emsp;perfect already, unbridled praise for the course staff is an acceptable answer.)<br>
&emsp;Most common answers:<br>
&emsp;&emsp;9   cleaner staff code<br>
&emsp;&emsp;4   more time/emphasis on the final project<br>
&emsp;&emsp;3   official answers to reading questions<br>
&emsp;&emsp;2   unbridled praise<br>
&emsp;&emsp;17   other

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;End of Quiz II

