# MIT 6.824/6.5840 2009: Quiz 1: Official solutions

> Copied from the original: <https://pdos.csail.mit.edu/6.824/quizzes.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**


![Figure on page 1](figures/solutions-p01-fig01.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Department of Electrical Engineering and Computer Science<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;MASSACHUSETTS INSTITUTE OF TECHNOLOGY<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**6.824 Distributed System Engineering: Spring 2009**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Quiz I Solutions**

&emsp;All problems are open-ended questions. In order to receive credit you must answer the question<br>
&emsp;as precisely as possible. You have 80 minutes to answer this quiz.<br>
&emsp;Write your name on this cover sheet AND at the bottom of each page of this booklet.<br>
&emsp;Some questions may be much harder than others. Read them all through first and attack them in<br>
&emsp;the order that allows you to make the most progress. If you find a question ambiguous, be sure<br>
&emsp;to write down any assumptions you make. Be neat. If we can’t understand your answer, we can’t<br>
&emsp;give you credit!<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**THIS IS AN OPEN BOOK, OPEN NOTES QUIZ.**

&emsp;&emsp;**I (xx/14)**   **II (xx/21)**   **III (xx/20)**   **IV (xx/21)**   **V (xx/14)**   **VI (xx/10)**   **Total (xx/100)**

**Name:**


---

<a id="page-2"></a>
**Page 2**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Grade histogram for Quiz 1

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

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;max   =   100<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;median   =   67<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;=   66.8<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;µ<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;=   16.2<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;σ


---

<a id="page-3"></a>
**Page 3**

6.824 SPRING 2009, Quiz 1 Solutions   **Page 3 of 11**<br>
**I**   **Remote procedure call**<br>
Ben Bitdiddle makes the following changes to your RPC client from lab 1:<br>
&emsp;Each time a request is retransmitted, he assigns it a new sequence number. His client remembers only<br>
&emsp;the most recent sequence number assigned to each RPC, and if a reply with an unknown sequence<br>
&emsp;number arrives, it is ignored. Additionally, the client automatically re-binds to the server if the server<br>
&emsp;crashes.<br>
Then Ben modifies your RPC server to ignore all RPCs with a sequence number less than or equal to the<br>
highest sequence number it received from the same client so far. For example, if it receives a request with<br>
sequence number 5 from client A, it will ignore any subsequent requests it receives from A with sequence<br>
numbers less than or equal to 5. Note that the RPC client’s retransmission code increases the timeout with<br>
each retransmission, so RPCs will eventually complete if the server is up.<br>
In the following problems, assume a single client with one thread, and no crashes. However, the network<br>
may drop, delay, duplicate, or reorder messages.

&emsp;**1. \[7 points\]:** Recall that the SETATTR operation changes a file’s length and updates the modifi-<br>
&emsp;cation time, then returns the file’s new attributes. Explain how the behavior of SETATTR could be<br>
&emsp;different with the at-least-once RPC package the staff provided for Lab 1 versus Ben’s RPC package.<br>
&emsp;The SETATTR RPC may be executed more than once with both packages. However, Ben’s package<br>
&emsp;guarantees that the value returned (and hence the modification time) corresponds to the last   execution.<br>
&emsp;For example, suppose the client does a SETATTR followed by a GETATTR on a file. If no other<br>
&emsp;clients modify the file, one might expect both calls to return the same modification time, which is what<br>
&emsp;will happen with Ben’s RPC package. With at-least-once RPC, however, SETATTR might return the<br>
&emsp;modification time from the first   of two executions of the call, in which case the subsequent GETATTR<br>
&emsp;will return a different modification time.

&emsp;**2. \[7 points\]:** Circle the FUSE operations below that can fail or produce incorrect results with Ben’s<br>
&emsp;RPC package, but work with your at-most-once RPC. Then underline one and describe what goes<br>
&emsp;wrong with that operation.<br>
&emsp;LOOKUP   READ   WRITE   MKDIR   REMOVE<br>
&emsp;MKDIR and REMOVE might fail with Ben’s package because it can cause duplicate requests to be<br>
&emsp;executed. When the server processes a duplicate REMOVE request, for example, it sees that the file<br>
&emsp;is already deleted and returns an error. LOOKUP, READ, and WRITE are idempotent and therefore<br>
&emsp;don’t have this problem.

**Name:**


---

<a id="page-4"></a>
**Page 4**

6.824 SPRING 2009, Quiz 1 Solutions   **Page 4 of 11**<br>
**II**   **Short questions: Tra, Bayou, and DryadLINQ**<br>
&emsp;**3.**   **\[7 points\]:** On Monday, Alyssa and Ben fully synchronize their filesystems using Tra. On<br>
&emsp;Tuesday, Alyssa makes some changes on her computer, and on Wednesday, Ben makes some changes<br>
&emsp;on his computer. Then they fully synchronize again, and Tra reports no conflicts. Ben remarks that<br>
&emsp;the results are different than they would be if they had performed the same operations on a shared<br>
&emsp;YFS server (with sequential consistency). Give a simple example of operations Alyssa and Ben might<br>
&emsp;have performed to lead to this situation, and briefly explain.<br>
&emsp;Here’s a simple example:<br>
&emsp;&emsp;&emsp;Alyssa: `cp` `x` `y`<br>
&emsp;&emsp;&emsp;Ben: `cp` `y` `x`<br>
&emsp;Suppose `x` originally contained `"foo"` and `y` originally contained `"bar"`. The result with sequential<br>
&emsp;consistency is `x="foo"` and `y="foo"`, but the result with Tra is `x="bar"` and `y="foo"`.<br>
&emsp;The key point is that Tra only tracks write-write conflicts, not read-write conflicts.<br>
&emsp;Some students found answers involving special cases with deletes, but it’s more complicated to con-<br>
&emsp;struct an example where Tra doesn’t report a conflict.

&emsp;**4. \[7 points\]:** Suppose that while David is disconnected from the network, he uses Bayou’s meeting<br>
&emsp;room scheduler application to reserve the Stata center playground for a 6.824 post-quiz party. MIT<br>
&emsp;Daycare reserves the playground for the same time slot, and neither of them specify alternative times.<br>
&emsp;Under what specific circumstances would David get a confirmed reservation for the playground?1<br>
&emsp;David gets a confirmed reservation if his update reaches the primary before any conflicting updates.

&emsp;**5. \[7 points\]:** Section 3.3 of the DryadLINQ paper gives DryadLINQ’s implementation of MapRe-<br>
&emsp;duce. Name an optimization in Dryad that the original MapReduce doesn’t have that might give Dryad<br>
&emsp;better performance than MapReduce for the word frequency counting program you sketched for the<br>
&emsp;reading response question. Briefly explain how the optimization helps for this program.<br>
&emsp;Valid answers include any of the dynamic optimizations performed by DryadLINQ, except for re-<br>
&emsp;executing slow processes. (MapReduce mainly performs static optimizations.)

1P.S. Daycare won’t let us use it—sorry.

**Name:**


---

<a id="page-5"></a>
**Page 5**

6.824 SPRING 2009, Quiz 1 Solutions   **Page 5 of 11**<br>
**III**   **Mutexes and condition variables**<br>
Cy D. Fect has implemented a simplified implementation of the lock server from Lab 1. In Cy’s version,<br>
there’s a fixed table of 1024 locks; locks are never added or removed. Each lock has an associated condition<br>
variable `cv` and a mutex `mutex`. There is also a `global`   `cv` and a `global`   `mutex` for the entire lock<br>
server. Furthermore, `acquire()` and `release()` only take a single argument and don’t return a value.<br>
`class` `lock_server` `{`<br>
`struct` `lock` `{`<br>
&emsp;`pthread_cond_t` `cv;`<br>
&emsp;`pthread_mutex_t` `mutex;`<br>
&emsp;`bool` `held;`<br>
`}` `locks[1024];`<br>
`pthread_cond_t` `global_cv;`<br>
`pthread_mutex_t` `global_mutex;`<br>
`public:`<br>
`lock_server();`   `//` `initializes` `everything` `appropriately`<br>
`void` `acquire(lock_protocol::lockid_t` `lid);`<br>
`void` `release(lock_protocol::lockid_t` `lid);`<br>
`}`<br>
Unfortunately, Cy is having trouble writing the `acquire()` and `release()` RPC handlers. For each<br>
of the following implementations, explain what problems can be caused by the incorrect use of mutexes or<br>
condition variables. If nothing can go wrong, simply write “CORRECT,” and if there are multiple problems,<br>
describing one is enough. Ignore efficiency and issues like handling errors due to lack of memory; focus on<br>
the correctness of the synchronization.<br>
The first one has been done for you to give you an example of the kind of answer we’re looking for. To save<br>
you time, the parts that vary from one question to the next have been highlighted; the other lines of code are<br>
identical in all of the problems.<br>
&emsp;`void` `lock_server::acquire(lock_protocol::lockid_t` `lid)` `{`<br>
&emsp;&emsp;&emsp;`pthread_mutex_lock(&global_mutex);`<br>
&emsp;&emsp;&emsp;`if` `(locks[lid].held)`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`pthread_cond_wait(``&global_cv``,` `&global_mutex``);`<br>
&emsp;&emsp;&emsp;`locks[lid].held` `=` `true;`<br>
&emsp;&emsp;&emsp;`pthread_mutex_unlock(&global_mutex);`<br>
&emsp;`}`<br>
&emsp;`void` `lock_server::release(lock_protocol::lockid_t` `lid)` `{`<br>
&emsp;&emsp;&emsp;`pthread_mutex_lock(&global_mutex);`<br>
&emsp;&emsp;&emsp;`locks[lid].held` `=` `false;`<br>
&emsp;&emsp;&emsp;`pthread_cond_broadcast(&global_cv);`<br>
&emsp;&emsp;&emsp;`pthread_mutex_unlock(&global_mutex);`<br>
&emsp;`}`<br>
&emsp;**ANSWER:**<br>
&emsp;&emsp;&emsp;INCORRECT<br>
&emsp;&emsp;&emsp;Thread A acquires lock 1.<br>
&emsp;&emsp;&emsp;Threads B and C try to acquire 1 and wait on global   cv.<br>
&emsp;&emsp;&emsp;Thread A releases lock 1 and broadcasts.<br>
&emsp;&emsp;&emsp;B and C both wake up, and both now think they own the lock.

**Name:**


---

<a id="page-6"></a>
**Page 6**

6.824 SPRING 2009, Quiz 1 Solutions   **Page 6 of 11**

&emsp;**6. \[5 points\]:**<br>
&emsp;`void` `lock_server::acquire(lock_protocol::lockid_t` `lid)` `{`<br>
&emsp;&emsp;&emsp;`pthread_mutex_lock(&global_mutex);`<br>
&emsp;&emsp;&emsp;`while` `(locks[lid].held)`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`pthread_cond_wait(``&global_cv``,` `&global_mutex``);`<br>
&emsp;&emsp;&emsp;`locks[lid].held` `=` `true;`<br>
&emsp;&emsp;&emsp;`pthread_mutex_unlock(&global_mutex);`<br>
&emsp;`}`<br>
&emsp;`void` `lock_server::release(lock_protocol::lockid_t` `lid)` `{`<br>
&emsp;&emsp;&emsp;`pthread_mutex_lock(&global_mutex);`<br>
&emsp;&emsp;&emsp;`locks[lid].held` `=` `false;`<br>
&emsp;&emsp;&emsp;`pthread_cond_signal(&global_cv);`<br>
&emsp;&emsp;&emsp;`pthread_mutex_unlock(&global_mutex);`<br>
&emsp;`}`<br>
&emsp;INCORRECT<br>
&emsp;Thread A waits for lock 1.<br>
&emsp;Thread B waits for lock 2.<br>
&emsp;Lock 1 is released, and thread B gets signaled, but sees lock 2 is still held and waits again.<br>
&emsp;Thread A continues to wait even though lock 1 is free.

&emsp;**7. \[5 points\]:**<br>
&emsp;`void` `lock_server::acquire(lock_protocol::lockid_t` `lid)` `{`<br>
&emsp;&emsp;&emsp;`pthread_mutex_lock(&global_mutex);`<br>
&emsp;&emsp;&emsp;`while` `(locks[lid].held)`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`pthread_cond_wait(``&global_cv``,` `&global_mutex``);`<br>
&emsp;&emsp;&emsp;`locks[lid].held` `=` `true;`<br>
&emsp;&emsp;&emsp;`pthread_mutex_unlock(&global_mutex);`<br>
&emsp;`}`<br>
&emsp;`void` `lock_server::release(lock_protocol::lockid_t` `lid)` `{`<br>
&emsp;&emsp;&emsp;`pthread_mutex_lock(&global_mutex);`<br>
&emsp;&emsp;&emsp;`locks[lid].held` `=` `false;`<br>
&emsp;&emsp;&emsp;`pthread_mutex_unlock(&global_mutex);`<br>
&emsp;&emsp;&emsp;`pthread_cond_broadcast(&global_cv);`<br>
&emsp;`}`<br>
&emsp;CORRECT<br>
&emsp;It’s fine to call `pthread`   `cond`   `broadcast()` after releasing the lock. This just means that any<br>
&emsp;waiters will wake up slightly later; the important part is that the setting and checking of the `held`<br>
&emsp;flag happens atomically. The example at the end of Section 5.3 of the threading paper does this, too.

**Name:**


---

<a id="page-7"></a>
**Page 7**

6.824 SPRING 2009, Quiz 1 Solutions   **Page 7 of 11**

&emsp;**8. \[5 points\]:**<br>
&emsp;`void` `lock_server::acquire(lock_protocol::lockid_t` `lid)` `{`<br>
&emsp;&emsp;&emsp;`pthread_mutex_lock(&global_mutex);`<br>
&emsp;&emsp;&emsp;`while` `(locks[lid].held)`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`pthread_cond_wait(``&locks[lid].cv``,` `&global_mutex``);`<br>
&emsp;&emsp;&emsp;`locks[lid].held` `=` `true;`<br>
&emsp;&emsp;&emsp;`pthread_mutex_unlock(&global_mutex);`<br>
&emsp;`}`<br>
&emsp;`void` `lock_server::release(lock_protocol::lockid_t` `lid)` `{`<br>
&emsp;&emsp;&emsp;`pthread_mutex_lock(&global_mutex);`<br>
&emsp;&emsp;&emsp;`locks[lid].held` `=` `false;`<br>
&emsp;&emsp;&emsp;`pthread_cond_signal(&locks[lid].cv);`<br>
&emsp;&emsp;&emsp;`pthread_mutex_unlock(&global_mutex);`<br>
&emsp;`}`<br>
&emsp;CORRECT<br>
&emsp;This is similar to question 6, except that there is one condition variable per lock. It’s okay to use<br>
&emsp;`pthread`   `cond`   `signal()` here because there’s no chance of waking the “wrong” waiter.

&emsp;**9. \[5 points\]:**<br>
&emsp;`void` `lock_server::acquire(lock_protocol::lockid_t` `lid)` `{`<br>
&emsp;&emsp;&emsp;`pthread_mutex_lock(&global_mutex);`<br>
&emsp;&emsp;&emsp;`pthread_mutex_lock(&locks[lid].mutex);`<br>
&emsp;&emsp;&emsp;`while` `(locks[lid].held)`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`pthread_cond_wait(``&locks[lid].cv``,` `&locks[lid].mutex``);`<br>
&emsp;&emsp;&emsp;`locks[lid].held` `=` `true;`<br>
&emsp;&emsp;&emsp;`pthread_mutex_unlock(&locks[lid].mutex);`<br>
&emsp;&emsp;&emsp;`pthread_mutex_unlock(&global_mutex);`<br>
&emsp;`}`<br>
&emsp;`void` `lock_server::release(lock_protocol::lockid_t` `lid)` `{`<br>
&emsp;&emsp;&emsp;`pthread_mutex_lock(&global_mutex);`<br>
&emsp;&emsp;&emsp;`locks[lid].held` `=` `false;`<br>
&emsp;&emsp;&emsp;`pthread_cond_broadcast(&locks[lid].cv);`<br>
&emsp;&emsp;&emsp;`pthread_mutex_unlock(&global_mutex);`<br>
&emsp;`}`<br>
&emsp;INCORRECT<br>
&emsp;The thread calling `acquire()` waits on `locks[lid].cv` while holding `global`   `mutex`, so<br>
&emsp;other `acquire()` and `release()` operations are unable to proceed and the system deadlocks.

**Name:**


---

<a id="page-8"></a>
**Page 8**

6.824 SPRING 2009, Quiz 1 Solutions   **Page 8 of 11**<br>
**IV**   **Entry consistency**<br>
Alice hears about a new consistency mode, called entry consistency. If a lock l protects shared data D, then<br>
entry consistency is defined as follows:<br>
&emsp;• An acquire of l on processor p is not allowed to complete until all updates to D before the last release<br>
&emsp;of l are visible at p.

&emsp;**10.**   **\[4 points\]:** Write some pseudocode for a simple program that would operate correctly with<br>
&emsp;sequential consistency but incorrectly with entry consistency. (Briefly explain your answer.)<br>
&emsp;One example:<br>
&emsp;&emsp;CPU 0:   CPU 1:<br>
&emsp;&emsp;`foo` `=` `42;`<br>
&emsp;&emsp;`foo`   `is`   `set` `=` `true;`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`while` `(!foo`   `is`   `set)`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`;`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`print` `foo;`<br>
&emsp;Any program that is correctly annotated with locks will work with entry consistency, so you had to<br>
&emsp;give an example that was not correctly annotated.

&emsp;**11. \[4 points\]:** Give an example program that might induce less communication under entry consis-<br>
&emsp;tency than lazy release consistency. (Briefly explain why.)<br>
&emsp;In the following example, we have to send the updates for both `x` and `y` from CPU 0 to CPU 1 in LRC,<br>
&emsp;whereas in entry consistency, we only have to send the updates for `y`.<br>
&emsp;&emsp;CPU 0:   CPU 1:<br>
&emsp;&emsp;`acquire(lx);`<br>
&emsp;&emsp;`x++;`<br>
&emsp;&emsp;`release(lx);`<br>
&emsp;&emsp;`acquire(ly);`<br>
&emsp;&emsp;`y++;`<br>
&emsp;&emsp;`release(ly);`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`acquire(ly);`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`y++;`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`release(ly);`

**Name:**


---

<a id="page-9"></a>
**Page 9**

6.824 SPRING 2009, Quiz 1 Solutions   **Page 9 of 11**

&emsp;**12. \[8 points\]:** Alice implements a protocol for entry consistency. Show the messages that Alice’s<br>
&emsp;protocol might send when a program acquires a lock. (Briefly explain how the protocol differs from<br>
&emsp;the one for lazy release consistency.)<br>
&emsp;The protocol is the same as LRC, except that there is a version vector per lock, and only   updates<br>
&emsp;associated with the lock being acquired are transferred.

It occurs to Alice that she could make a distinction in operations that update D and operations that only read<br>
D by using reader/writer locks. If two operations take out a read lock for the same critical section, then both<br>
operations can be executed in parallel. To take advantage of this, she defines reader/writer entry consistency.<br>
The parts that differ from plain entry consistency are underlined:

&emsp;• Before a lock l in write mode is granted to processor p, no other processor may hold l.<br>
&emsp;• An acquire of l on processor p in read or write mode   is not allowed to complete until all updates to D<br>
&emsp;before the last release of l in write mode   are visible at p.

&emsp;**13.**   **\[5 points\]:** Give a program that can induce less communication under reader/writer entry<br>
&emsp;consistency than under plain entry consistency, where all locks are treated as write locks. (Briefly<br>
&emsp;explain why this program introduces less communication.)<br>
&emsp;&emsp;CPU 0:   CPU 1:<br>
&emsp;&emsp;`acquire`   `write(lx);`<br>
&emsp;&emsp;`x++;`<br>
&emsp;&emsp;`release(lx);`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`acquire`   `read(lx);`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`z` `=` `x;`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`release(lx);`<br>
&emsp;&emsp;`acquire`   `read(lx);`<br>
&emsp;&emsp;`print(x);`<br>
&emsp;&emsp;`release(lx);`<br>
&emsp;This example can induce less communication in two ways. First, CPU 0 doesn’t need to send a vector<br>
&emsp;timestamp to CPU 1, since CPU 0 itself most recently released the lock in write mode. Second, CPU 1<br>
&emsp;doesn’t have to send the new value of `z` (which arguably should have been protected by a write lock<br>
&emsp;anyway.)<br>
&emsp;This optimization can be applied to LRC, too.

**Name:**


---

<a id="page-10"></a>
**Page 10**

6.824 SPRING 2009, Quiz 1 Solutions   **Page 10 of 11**<br>
**V**   **Logging with checkpoints**<br>
&emsp;**14. \[7 points\]:** In the Cedar system, the VAM updates are not recorded with write-ahead logging.<br>
&emsp;How is the content of the VAM recovered? After recovery, does the VAM have an accurate list of all<br>
&emsp;free disk blocks? (Briefly explain your answer.)<br>
&emsp;&emsp;The VAM is reconstructed from the file name table, and is accurate after recovery. (Blocks referenced<br>
&emsp;in the file name table are marked allocated, and all other blocks are marked free.)

&emsp;**15. \[7 points\]:** In FSD, creating a file might involve the following sequence of events:<br>
&emsp;&emsp;1\. An application calls `create(``filename``,` `file`   `contents``)`.<br>
&emsp;&emsp;2\. Cedar writes the data and leader pages to disk.<br>
&emsp;&emsp;3\. The `create` call returns `OK`.<br>
&emsp;&emsp;4\. Later, Cedar records the file name table changes in the log.<br>
&emsp;&emsp;5\. Cedar updates the file name table on disk.<br>
&emsp;&emsp;6\. The VAM is written to disk later when the system is idle.<br>
&emsp;Lem E. Tweakit thinks there is no need to write the data and leader pages synchronously, and modifies<br>
&emsp;Cedar so that creates result in the following sequence of events:<br>
&emsp;&emsp;1\. An application calls `create(``filename``,` `file`   `contents``)`.<br>
&emsp;&emsp;2\. The `create` call returns `OK`.<br>
&emsp;&emsp;3\. Cedar writes the data and leader pages to disk. **(changed)**<br>
&emsp;&emsp;4\. Later, Cedar records the file name table changes in the log.<br>
&emsp;&emsp;5\. Cedar updates the file name table on disk.<br>
&emsp;&emsp;6\. The VAM is written to disk later when the system is idle.<br>
&emsp;In Lem’s version of FSD, this order is always followed, the log is flushed just as frequently as before,<br>
&emsp;and everything else is the same. Give an example of what can go wrong with Lem’s modified FSD<br>
&emsp;that the original FSD handles correctly, or explain why Lem’s changes cause no new problems. Don’t<br>
&emsp;worry about concurrency, operations other than `create`, hardware failures, or bugs.<br>
&emsp;Lem’s changes don’t cause problems. A potential concern is that `create` returns `OK` before the data<br>
&emsp;and leaders are written, so if the system crashes before Step 3 in Lem’s version, the file won’t be there<br>
&emsp;after recovery. However, this can happen in the original FSD, too!<br>
&emsp;The key insight is that Step 4, where the log record is written, is the commit point in both versions.<br>
&emsp;That is, if there is a crash before Step 4, the file will not   be present after recovery; if there is a crash<br>
&emsp;after Step 4, then the file will   be present after recovery. (Identifying where the commit point is is a<br>
&emsp;good way to understand any system that provides atomic updates.)

**Name:**


---

<a id="page-11"></a>
**Page 11**

6.824 SPRING 2009, Quiz 1 Solutions   **Page 11 of 11**<br>
**VI**   **6.824**<br>
&emsp;**16. \[4 points\]:** Describe the most memorable error you have made so far in one of the labs. (Provide<br>
&emsp;enough detail so that we can understand your answer.)<br>
&emsp;&emsp;Most common answers:<br>
&emsp;&emsp;12   concurrency bugs (many of which were covered on the quiz!)<br>
&emsp;&emsp;8   miscellaneous issues with STL<br>
&emsp;&emsp;6   problems with FUSE

We would like to hear your opinions about 6.824, so please answer the following two questions. (Any<br>
relevant answer will receive full credit!)

&emsp;**17. \[3 points\]:** What is the best aspect of 6.824?<br>
&emsp;&emsp;Most common answers:<br>
&emsp;&emsp;31   labs<br>
&emsp;&emsp;6   papers

&emsp;**18. \[3 points\]:** What is the worst aspect of 6.824?<br>
&emsp;&emsp;Most common answers:<br>
&emsp;&emsp;11   issues with papers: too many (6), too old (2), other (3)<br>
&emsp;&emsp;11   issues with labs: too open-ended (3), not enough comments (3), C++ / STL / RPC (3), other (2)<br>
&emsp;&emsp;10   quiz

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;End of Quiz I

**Name:**

