# MIT 6.824/6.5840 2011: Quiz 1: Official solutions

> Copied from the original: <https://pdos.csail.mit.edu/6.824/quizzes.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**


![Figure on page 1](figures/solutions-p01-fig01.png)

&emsp;&emsp;&emsp;&emsp;Department of Electrical Engineering and Computer Science<br>
&emsp;&emsp;MASSACHUSETTS INSTITUTE OF TECHNOLOGY

**6.824 Distributed System Engineering: Spring 2011**<br>
&emsp;&emsp;&emsp;&emsp;**Quiz I Solutions**


---

<a id="page-2"></a>
**Page 2**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Grade histogram for Quiz 1


![Figure on page 2](figures/solutions-p02-fig02.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;96-100<br>
&emsp;51-55   56-60   61-65   66-70   71-75   76-80   81-85   86-90   91-95

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;min   =   52<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;max=   100<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;median   =   82<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;average   =   82<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;σ   =   12


---

<a id="page-3"></a>
**Page 3**

6.824 Spring 2011, Quiz 1 Solutions   **Page 3 of 10**

**I**   **Distributed Shared Memory**

You are running the distributed shared memory system described in Memory Coherence in Shared Virtual<br>
Memory Systems, by Li and Hudak. You’re using the version described in Section 3.1.<br>
You’re writing simple lock-like code for mutual exclusion. On computer C1 you execute this program:

x = 1<br>
if(y == 0)<br>
&emsp;print "C1 won"

On computer C2 you execute:

y = 1<br>
if(x == 0)<br>
&emsp;print "C2 won"

You start the two programs at roughly the same time. Variables x and y start out with value zero. The<br>
compiler generates machine code that references x and y exactly as shown in the above source code—the<br>
compiler does not re-order variable references, or eliminate them, or reference variables except as implied<br>
by the source code. You should assume that the manager is on a third computer, separate from C1 and C2.<br>
Assume that the invalidate() function waits for acknowledgments indicating that all computers in the<br>
copy set have invalidated the page. Assume that x and y are on different pages.

&emsp;**1. \[9 points\]:** Which of the following outputs are possible?<br>
&emsp;&emsp;**A.** neither computer prints anything<br>
&emsp;&emsp;**B.** C1 prints “C1 won”, C2 prints nothing<br>
&emsp;&emsp;**C.** C1 prints nothing, C2 prints “C2 won”<br>
&emsp;&emsp;**D.** C1 prints “C1 won”, C2 prints “C2 won”

**Answer:** A, B, and C. D is not possible: if C2 prints “C2 won,” then its read of x came before C1’s write<br>
of X, and thus C2’s assignment to y came before C1’s read of y, so C1 should have seen y==1 instead of<br>
y==0. The “came before” reasoning depends on the distributed shared memory system invalidating readable<br>
copies of pages before it allows a write.


---

<a id="page-4"></a>
**Page 4**

6.824 Spring 2011, Quiz 1 Solutions   **Page 4 of 10**

&emsp;**2. \[9 points\]:** Suppose both x and y are on the same page, and that no other data is on that page.<br>
&emsp;You execute the programs, and see that afterwards C1 is the owner of the page, and that C2 is not in<br>
&emsp;the page’s copy set on the manager. Give an example execution in which that would happen.

**Answer:** C2’s program finishes before C1’s program starts.<br>
Now suppose that invalidate() does **not** wait for acknowledgements; it just sends a message to each<br>
computer in the copy set and returns. These messages are reliable; you can think of them as RPCs sent by a<br>
background thread.

&emsp;**3. \[9 points\]:** Which of the following outputs are possible, given that invalidate() does not<br>
&emsp;wait?

&emsp;&emsp;**A.** neither computer prints anything<br>
&emsp;&emsp;**B.** C1 prints “C1 won”, C2 prints nothing<br>
&emsp;&emsp;**C.** C1 prints nothing, C2 prints “C2 won”<br>
&emsp;&emsp;**D.** C1 prints “C1 won”, C2 prints “C2 won”

**Answer:** A, B, C, and D.


---

<a id="page-5"></a>
**Page 5**

6.824 Spring 2011, Quiz 1 Solutions   **Page 5 of 10**

**II**   **Logical Clocks**

Recall the logical clocks that Bayou uses to keep track of causality: to ensure that if write X could have<br>
influenced write Y, that write Y be ordered after X. Each node maintains a logical clock. A node advances<br>
its logical clock as time passes (perhaps incrementing every nanosecond). When node N1 sees an event<br>
from another node, marked as having occurred at logical time T, N1 advances its logical clock so that it is<br>
greater than T.<br>
Ben thinks that file synchronization protocols could use logical clocks instead of version vectors, for sim-<br>
plicity. See Section 3.1 of the Tra paper for a summary of version vectors. Ben suggests tagging each node’s<br>
copy of a file with the logical time at which it was last modified. If node N1 modifies its copy of the file, N1<br>
sets the file’s modification time to N1’s logical clock. When N1 synchronizes to N2, N2 accepts N1’s copy<br>
of the file if N1’s copy has a higher logical modification time than N2’s copy. In addition, N2 advances its<br>
own logical clock to ensure it is greater than the logical modification time of every file N1 sends it.

&emsp;**4.**   **\[9 points\]:** Describe a situation in which Ben’s logical clock scheme would produce better<br>
&emsp;behavior than using each node’s real-time clock.

**Answer:** If the real-time clocks on different nodes are not exactly synchronized, then file synchronization<br>
can allow an earlier update to overwrite a later update, even if the later update is derived from the earlier<br>
update. Logical clocks ensure that a later update that depends on an earlier update will always win.

&emsp;**5. \[9 points\]:** What crucial functionality of a file synchronizer is possible with version vectors but<br>
&emsp;not possible with Ben’s logical clocks?

**Answer:**   Logical clocks do not allow conflicting updates to be detected. Version vectors can detect con-<br>
flicting updates.


---

<a id="page-6"></a>
**Page 6**

6.824 Spring 2011, Quiz 1 Solutions   **Page 6 of 10**

**III**   **Bayou**

The Bayou paper says that, when two servers exchange Writes during anti-entropy, they tell each other<br>
about all the Writes they know of, so that the two servers end up with exactly the same set of Writes. See<br>
the left-hand column on page 3 of the paper.

&emsp;**6. \[9 points\]:** The above property of anti-entropy usually causes the primary server (Section 6) to<br>
&emsp;order committed Writes with the same order the Writes had when they were tentative—but not always.<br>
&emsp;Describe a situation in which the primary would commit Writes in an order that is different from the<br>
&emsp;tentative order seen on some servers.

**Answer:**   Server A produces a write time-stamped 10. Server B produces a write time-stamped 20. B<br>
synchronizes with C, then A synchronizes with C, so C orders A’s write first. Server B synchronizes with<br>
the primary. Server C synchronizes with the primary. Now C orders B’s write first, since it is commited<br>
while A’s write is not committed.

Suppose, instead, that anti-entropy only exchanged Writes generated by clients of the two servers performing<br>
anti-entropy. This might make each anti-entropy session complete faster. It would also make it harder for<br>
all servers to learn about a given Write, since a server could only learn about the Write by performing<br>
anti-entropy with the server that originated the Write, and not indirectly through other servers.

&emsp;**7.**   **\[9 points\]:** Describe a situation in which this change to anti-entropy would cause incorrect or<br>
&emsp;surprisingly counter-intuitive behavior in the meeting room scheduler application.

**Answer:** Server A generates a write time-stamped 1 asking for the meeting room at 11:00, 12:00, or 13:00.<br>
Server B generates a write time-stamped 2 asking for the same times. Server C generates a write time-<br>
stamped 3 asking for the same times. A synchronizes with B. B synchronizes with C. Now, even though B<br>
and C have synchronized, they disagree about the times of meetings B and C.


---

<a id="page-7"></a>
**Page 7**

6.824 Spring 2011, Quiz 1 Solutions   **Page 7 of 10**

Now suppose that Bayou anti-entropy behaves as described in the paper, but that a Write’s timestamp is \<ID<br>
of server, local time\> rather than \<local time, ID of server\>, and that all nodes or-<br>
der Writes by sorting by the “ID of server” part, and breaking ties by sorting on the “local time” part. Here’s<br>
an example of some writes in this new order:

\<"server1", 27730\> first write<br>
\<"server1", 27735\> second write<br>
\<"server2", 20339\> third write<br>
\<"server2", 30111\> fourth write

&emsp;**8. \[9 points\]:** Describe a situation in which this change to Write ordering would cause incorrect or<br>
&emsp;surprisingly counter-intuitive behavior in the meeting room scheduler application.

**Answer:**   Server B might generate a write and synchronize with all other nodes (except the primary). If<br>
server A then generates a write, all users will know that write was made later, but the system will order it<br>
before B’s write.


---

<a id="page-8"></a>
**Page 8**

6.824 Spring 2011, Quiz 1 Solutions   **Page 8 of 10**

**IV**   **Cedar FSD**

At the top of the right-hand column of page 158, the paper Reimplementing the Cedar File System Using<br>
Logging and Group Commit says “Any pages logged in this new third, but not logged in a later third, are<br>
written to the file name table by the logging code.” This quote is discussing the writing of modified file<br>
name table pages from the page cache to the disk. Assume that FSD marks a cached page as “clean” when<br>
writing it to the disk, and will not write it again unless it is subsequently modified in cache.

&emsp;**9. \[9 points\]:** Describe a specific scenario in which the quoted policy results in higher performance<br>
&emsp;than writing to disk every dirty cached page that is logged in the new third.

**Answer:** Suppose a program performs a long sequence of operations that modify the same file name table<br>
page over and over. It could be that the system could recycle the whole log many times, each time observing<br>
that the page was modified in a later third, and not have to write the cached page to disk until the very end.<br>
This argument doesn’t work for just two operations, since in that case only one write is needed anyway, after<br>
which the cached page will be clean.


---

<a id="page-9"></a>
**Page 9**

6.824 Spring 2011, Quiz 1 Solutions   **Page 9 of 10**

**V**   **Replicated Extent Server**

Alyssa makes a replicated extent server, intending eventually to use it to increase performance and fault-<br>
tolerance. She has two extent servers, both of which hold a complete set of extents. Clients can send puts<br>
and gets to either extent server. Each server sends any puts it receives to the other server. Here’s what some<br>
of her extent server code looks like:

get\_handler(k){<br>
ScopedLock mx(&m);<br>
if table contains k<br>
&emsp;return table\[k\]<br>
else<br>
&emsp;return an error<br>
}

put\_handler(k, v){<br>
ScopedLock mx(&m);<br>
table\[k\] = v;<br>
use RPC to call the other server’s put\_replica(k, v)<br>
}

put\_replica\_handler(k, v){<br>
ScopedLock mx(&m);<br>
table\[k\] = v;<br>
}

Alyssa observes that most of the time her replicated extent servers works fine, but sometimes they stop<br>
replying to RPCs.

&emsp;**10. \[9 points\]:** Explain the problem, and describe a specific scenario under which the problem might<br>
&emsp;arise.

**Answer:** The problem is deadlock. If two clients each send a put to a different server at the same time,<br>
each server’s put handler will acquire that server’s mutex. Then both servers will send a put replica<br>
to the other server, and the put replica handlers will wait forever for the mutexes.


---

<a id="page-10"></a>
**Page 10**

6.824 Spring 2011, Quiz 1 Solutions   **Page 10 of 10**

**VI**   **6.824**

&emsp;**11. \[4 points\]:** Describe the most memorable error you have made so far in one of the labs. (Provide<br>
&emsp;enough detail so that we can understand your answer.)<br>
&emsp;**Answer:**   Incorrect RPC parameter types. Mysterious STL (map/list/string) behavior. Deadlock.<br>
&emsp;Missing locks. Weird FUSE behavior.

We would like to hear your opinions about 6.824, so please answer the following two questions. (Any<br>
relevant answer will receive full credit!)

&emsp;**12. \[3 points\]:** What is the best aspect of 6.824?<br>
&emsp;**Answer:** The labs.

&emsp;**13. \[3 points\]:** What is the worst aspect of 6.824?<br>
&emsp;**Answer:** Poor FUSE documentation. This quiz. Badly written, dry, or old papers.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;End of Quiz I

