# MIT 6.824/6.5840 2013: Quiz 1: Official solutions

> Copied from the original: <https://pdos.csail.mit.edu/6.824/quizzes.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**


![Figure on page 1](figures/solutions-p01-fig01.png)

&emsp;&emsp;&emsp;&emsp;Department of Electrical Engineering and Computer Science<br>
&emsp;&emsp;MASSACHUSETTS INSTITUTE OF TECHNOLOGY

**6.824 Distributed System Engineering: Spring 2013**<br>
&emsp;&emsp;&emsp;&emsp;**Quiz I Solutions**


---

<a id="page-2"></a>
**Page 2**

6.824 Spring 2013, Quiz 1   Page 2 of 9

**I**   **Paxos**

Here is the Paxos pseudo-code:

proposer(v):<br>
while not decided:<br>
&emsp;choose n, unique and higher than any n seen so far<br>
&emsp;send prepare(n) to all servers including self<br>
&emsp;if prepare\_ok(n\_a, v\_a) from majority:<br>
&emsp;&emsp;v’ = v\_a with highest n\_a; choose own v otherwise<br>
&emsp;&emsp;send accept(n, v’) to all<br>
&emsp;&emsp;if accept\_ok(n) from majority:<br>
&emsp;&emsp;&emsp;send decided(v’) to all

acceptor’s state:<br>
n\_p (highest prepare seen)<br>
n\_a, v\_a (highest accept seen)

acceptor’s prepare(n) handler:<br>
if n \> n\_p<br>
&emsp;n\_p = n<br>
&emsp;reply prepare\_ok(n\_a, v\_a)<br>
else<br>
&emsp;reply prepare\_reject

acceptor’s accept(n, v) handler:<br>
if n \>= n\_p<br>
&emsp;n\_p = n<br>
&emsp;n\_a = n<br>
&emsp;v\_a = v<br>
&emsp;reply accept\_ok(n)<br>
else<br>
&emsp;reply accept\_reject


---

<a id="page-3"></a>
**Page 3**

6.824 Spring 2013, Quiz 1   Page 3 of 9

&emsp;**1.**   **\[5 points\]:** Explain why the “decide” phase of the Paxos protocol is not necessary:<br>
&emsp;explain why prepare and accept are sufficient for peers to discover the agreed-on value.

**Answer:** Any node that needs to find out the agreed value (if any) can start acting as a proposer.<br>
If a value has already been agreed on, it will end up reaching agreement again on that value.

&emsp;**2. \[10 points\]:** Suppose that all Paxos peers are alive and reachable and correctly executing<br>
&emsp;the pseudo-code, and that the network delivers all messages with low delay. Describe a<br>
&emsp;scenario in which two Paxos proposers start at the same time, but neither manages to reach<br>
&emsp;agreement after its first round of prepare and accept messages. Describe the messages sent in<br>
&emsp;your scenario, and the relevant details about the order in which the messages are sent and/or<br>
&emsp;received.

**Answer:**   Proposer P1 sends out prepares with n=1, and gets a full set of successful replies.<br>
Proposer P2 sends out prepares with n=2 and gets a full set of successful replies. P1 sends out its<br>
accepts, with n=1, and they are all rejected. P1 immediately starts the next round with n=3 and<br>
sends out prepares. Then P2’s accepts will be rejected. It would be better for P1 to sleep for a<br>
while before starting the next round.

**II**   **FDS**

&emsp;**3.**   **\[10 points\]:** Section 3.2 of the Flat Datacenter Storage (FDS) paper explains how<br>
&emsp;the system copes with the failure of a single tractserver. The metadata server deletes the<br>
&emsp;tractserver from each TLT row in which it appears, and replaces each such instance with a<br>
&emsp;randomly chosen live server. Suppose, instead, that the metadata server maintained a pool<br>
&emsp;of unused servers, and used one of these servers to replace the failed tractserver. How would<br>
&emsp;this affect total recovery time? Assume that the FDS system is idle except for the work<br>
&emsp;required to recover.

**Answer:**   It will increase recovery time. FDS needs to create a new copy of all the data stored<br>
on the failed server. Assuming two servers per TLT row, part of that data is stored on each server<br>
which shared a TLT row with the failed server. With the random scheme, each of those servers<br>
sends its fraction of the data to a (usually) different randomly selected server, so no server reads or<br>
writes more than a fraction of the data. With the suggested idle server scheme, all the reconstructed<br>
data has to be written to the disk on that one new server; disk throughput is likely the limiting<br>
resource, so the recovery will take much longer.


---

<a id="page-4"></a>
**Page 4**

6.824 Spring 2013, Quiz 1   Page 4 of 9

**III**   **Spanner**

Fred and Sally are using the Spanner storage system. They wonder how Spanner would behave with<br>
the code from Lecture 9 that we used to help decide if a storage system is sequentially consistent:

&emsp;x = 1   y = 1<br>
&emsp;if y == 0:   if x == 0:<br>
&emsp;&emsp;print yes   print yes

Fred and Sally translate this into Spanner client code as follows:

// Fred’s client:<br>
start a read/write transaction<br>
Write(key="x", value="1")<br>
end transaction<br>
start a snapshot read<br>
print Read(key="y")<br>
end

// Sally’s client:<br>
start a read/write transaction<br>
Write(key="y", value="1")<br>
end transaction<br>
start a snapshot read<br>
print Read(key="x")<br>
end

Keys “x” and “y” both start with value “0”. The two clients start executing their code at about the<br>
same time. Spanner executes all the operations successfully, and both clients get replies to all their<br>
Spanner requests. Spanner assigns the two read/write transactions (and the two Write()s) different<br>
timestamps.


---

<a id="page-5"></a>
**Page 5**

6.824 Spring 2013, Quiz 1   Page 5 of 9

For each of the following situations, indicate whether both clients **could** print “0”. For each, briefly<br>
explain your answer.

&emsp;**4. \[5 points\]:** Each client issues its snapshot read with client-provided timestamp equal to<br>
&emsp;TrueTime.Now().earliest at that client.

**Answer:**   Yes. TrueTime doesn’t guarantee anything about Now().earliest other than it is before<br>
the absolute time. Thus both “earliest” values might be before the timestamp Spanner assigns to<br>
either write, so both clients might read zero.

&emsp;**5. \[5 points\]:** Each client issues its snapshot read with client-provided timestamp equal to<br>
&emsp;TrueTime.Now().latest at that client.

**Answer:**   No. Spanner’s commit delay mechanism ensures that a write does not complete until<br>
the absolute time has passed. TrueTime guarantees that Now().latest is after the absolute time.<br>
So each client reads at a snapshot time after its write’s timestamp. Suppose Fred’s client reads<br>
y=0. That means Fred’s client’s Now().latest is less than Sally’s write’s timestamp; and also that<br>
Fred’s write’s timestamp is less than Sally’s write’s timestamp. That, finally, means Fred’s write’s<br>
timstamp is less than the snapshot time at which Sally will read, so Sally’s read is guaranteed to<br>
see x=1.

&emsp;**6. \[5 points\]:** Each client issues its snapshot read with client-provided timestamp equal to<br>
&emsp;the timestamp that Spanner assigned to that client’s Write.

**Answer:** No. The explanation is essentially the same as the previous question: if Fred reads y=0,<br>
his read and write must have timestamps before Sally’s write, and thus before Sally’s read, so Sally<br>
must read x=1.


---

<a id="page-6"></a>
**Page 6**

6.824 Spring 2013, Quiz 1   Page 6 of 9

**IV**   **Distributed Shared Memory**

Suppose we had a version of the system described in Li and Hudak’s Memory Coherence in Shared<br>
Virtual Memory Systems. Our system, called Byte-IVY, operates on pages that are just one byte<br>
long. This is possible because the computer we’re using has a hardware page size of just one byte:<br>
there is a distinct page table entry for each virtual address. Byte-IVY, just like IVY, has a manager<br>
for each page, but of course there are now many more pages.<br>
You should assume that Byte-IVY has no bugs. You can base your answer on any of the versions<br>
presented in the paper; which you choose should not affect your answer.

&emsp;**7.**   **\[10 points\]:** Would Byte-IVY benefit from the write diffs technique described in the<br>
&emsp;TreadMarks paper? Why or why not? If your answer is “yes”, describe a specific example<br>
&emsp;in which Byte-IVY would benefit from write diffs.

**Answer:**   No. With byte-sized pages, Byte-IVY eliminates the problem that a single-byte write<br>
causes an entire (larger) page of mostly-unmodified data to be sent over the network. So write diffs<br>
would not save any communication cost. Though if you assume bit-level write diffs, the answer is<br>
“yes.”

&emsp;**8.**   **\[10 points\]:** Would Byte-IVY benefit from TreadMarks’ Lazy Release Consistency?<br>
&emsp;Why or or why not? If your answer is “yes”, describe a specific example in which Byte-IVY<br>
&emsp;would benefit from LRC.

**Answer:**   No. Byte-IVY only sends modified data to machines that read that data, since IVY<br>
page transfers are driven by read faults. Thus, for properly locked code, Byte-IVY would send the<br>
minimum amount of data possible; there’s no room for LRC to reduce that. Perhaps LRC could<br>
help by eliminating IVY’s invalidate messages.


---

<a id="page-7"></a>
**Page 7**

6.824 Spring 2013, Quiz 1   Page 7 of 9

**V**   **CBCAST**

Three machines (M1, M2, and M3) use CBCAST to order messages, as described in Lecture 11.<br>
Recall that a CBCAST sender sends to all receivers. The CBCAST library at each receiver buffers<br>
incoming messages, and only delivers them to the application when it is correct to do so under<br>
causal consistency. The network never drops a packet.<br>
The application running on M1 uses CBCAST to send a message “X”. CBCAST on M2 receives the<br>
message and delivers it to the application. After the application on M2 sees “X”, it uses CBCAST<br>
to send “Y”. A little later the application on M1 sends message “Z”. All messages are eventually<br>
delivered to the the applications on M1, M2, and M3.

&emsp;**9. \[5 points\]:** CBCAST sends a vector clock value with each message. Write down a vector<br>
&emsp;clock value for each message that’s consistent with the above scenario.

&emsp;X:   \<1, 0, 0\><br>
&emsp;Y:   \<1, 1, 0\><br>
&emsp;Z:   \<2, 0, 0\> or \<2, 1, 0\>

&emsp;**10.**   **\[5 points\]:** The CBCAST library on M3 delivers the messages in some order to the<br>
&emsp;application on M3. Which of the following orders is possible? Circle the orders that are<br>
&emsp;possible; draw a line through the orders that are not possible.

&emsp;X Y Z -- possible<br>
&emsp;X Z Y -- possible<br>
&emsp;Y X Z -- impossible<br>
&emsp;Y Z X -- impossible<br>
&emsp;Z X Y -- impossible<br>
&emsp;Z Y X -- impossible


---

<a id="page-8"></a>
**Page 8**

6.824 Spring 2013, Quiz 1   Page 8 of 9

**VI**   **Labs**

Recall that Lab 2B (pbservice) involves a view server, a primary, and (when possible) a backup.<br>
Suppose there’s a view in which server S0 is the primary and S1 is the backup. S1 obtained a<br>
copy of S0’s complete state at the start of the view, and for a while S0 and S1 have been happily<br>
processing client requests.<br>
At some point S0 tries to forward a client request to S1, but S0’s RPC library returns an error<br>
indicating it received no reply from S1. S0 has not heard of any view change from the view server.

&emsp;**11.**   **\[5 points\]:** Would it be OK for S0 to execute the client request and return a success<br>
&emsp;indication to the client? Why or why not?

**Answer:** No. That would result in the primary and backup no longer being replicas. If S0 were<br>
later to crash, and S1 took over, it would have different data. Clients reading data at the time of the<br>
crash would see values change without any client having issued a Put.

&emsp;**12.**   **\[5 points\]:** Would it be OK for S0 to **not** execute the client request, and to return a<br>
&emsp;failure indication to the client? Why or why not?

**Answer:**   No. The network might have dropped the RPC reply after S1 executed the request.<br>
Again this would cause the two servers no longer to be replicas.<br>
For Lab 3B (kvpaxos), your 6.824 class-mate Robert doesn’t understand why the servers need to<br>
detect duplicate requests sent by the code in client.go. After all, he says, a duplicate Get is<br>
obviously harmless, and a duplicate Put just writes the same value twice, again clearly harmless.

&emsp;**13.**   **\[10 points\]:** Explain why duplicate client request detection is necessary in Lab 3B.<br>
&emsp;Describe how a duplicate client request could occur, and present a specific scenario in which<br>
&emsp;it would be harmful if not detected.

**Answer:** Client C1 might send Put(x,1) to server S1. S1 is having network problems so it cannot<br>
immediately execute the Put. Meanwhile C1’s Clerk times out and re-sends the Put to a different<br>
server, which does execute it. Client C2 does a Get(x) and sees the value 1; then C2 does a<br>
Put(x,2); then does Get(x) again and sees value 2. Finally S1 executes the original Put(x,1). The<br>
client application only made two calls to Clerk.Put(), but clients reading from the system see three<br>
changes to the value for x.


---

<a id="page-9"></a>
**Page 9**

6.824 Spring 2013, Quiz 1   Page 9 of 9

**VII**   **6.824**

&emsp;**14. \[5 points\]:** The labs are entirely new this year. Did you find them useful? How could<br>
&emsp;we improve them?<br>
&emsp;**Answer:**   Better documented test code. Better debugging support. More labs, on a wider<br>
&emsp;array of topics.

&emsp;**15. \[5 points\]:** What non-lab aspects of 6.824 would you most like to see changed?<br>
&emsp;**Answer:** Post answers to the paper questions. Include answers to questions raised in lecture<br>
&emsp;notes. Faster grading of labs. Reading guides for papers. Easier-to-read papers. Fewer<br>
&emsp;exams.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;End of Quiz I Solutions

