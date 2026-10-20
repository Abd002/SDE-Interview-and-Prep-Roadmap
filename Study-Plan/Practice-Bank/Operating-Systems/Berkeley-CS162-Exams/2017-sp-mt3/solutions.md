# Berkeley CS162 Spring 2017: Midterm 3: Official solutions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

CS 162 Spring 2017, 3rd Midterm Exam                                     April 24, 2017

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;University of California, Berkeley<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;College of Engineering<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Computer Science Division – EECS<br>
Spring 2017                                Ion Stoica<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Third Midterm Exam**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;April 24, 2017<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS162 Operating Systems


![Figure on page 1](figures/solutions-p01-fig01.png)

General Information:<br>
This is a **closed book and one 2-sided handwritten note** examination. You have 80 minutes to<br>
answer as many questions as possible.  The number in parentheses at the beginning of each<br>
question indicates the number of points for that question. You should read **all** of the questions<br>
before starting the exam, as some of the questions are substantially more time consuming.<br>
Write all of your answers directly on this paper.  **Make your answers as concise as possible.** If there<br>
is something in a question that you believe is open to interpretation, then please ask us about it!<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Good Luck!!**


![Figure on page 1](figures/solutions-p01-fig02.png)

Page 1/13


---

<a id="page-2"></a>
**Page 2**

CS 162 Spring 2017, 3rd Midterm Exam                                     April 24, 2017

**P1** (24 points total) True/False and Why? **CIRCLE YOUR ANSWER**. For each<br>
question: 1 point for true/false correct, 2 point for explanation. An explanation cannot<br>
exceed 2 sentences.

&emsp;a) When two processes mmap() the same region of a file, mmap() will always return<br>
&emsp;&emsp;the same set of virtual addresses to both processes, which represent a shared<br>
&emsp;&emsp;region of memory.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    **FALSE**<br>
&emsp;&emsp;Why?<br>
The virtual addresses are not necessarily the same, both sets will point to the same<br>
physical region.

&emsp;b) A TCP sender can overflow the receiver’s buffer.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    **FALSE**<br>
&emsp;&emsp;Why?<br>
Flow control will make sure the sender never sends more bytes than the receiver can<br>
store.

Page 2/13


---

<a id="page-3"></a>
**Page 3**

CS 162 Spring 2017, 3rd Midterm Exam                                     April 24, 2017

&emsp;c) It is not possible to develop an agreement protocol between two hosts (i.e., a<br>
&emsp;&emsp;protocol in which the two hosts agree to do something simultaneously) over an<br>
&emsp;&emsp;unreliable network?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**TRUE**                    FALSE<br>
&emsp;&emsp;Why?<br>
&emsp;Assume there exists a protocol, and assume N is the minimum number of message of<br>
&emsp;any such protocol. Since the sender of the last message cannot be sure whether the<br>
&emsp;message has been delivered, we can remove the message from the protocol, which<br>
&emsp;contradicts the fact that N is the smallest number of messages. This is the General’s<br>
&emsp;Paradox.

&emsp;d) Two-Phase Commit does not guarantee all ACID properties (Atomicity,<br>
&emsp;&emsp;Consistency, Isolation, and Durability).<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**TRUE**                    FALSE<br>
&emsp;&emsp;Why?<br>
Only has Atomicity and Durability.

&emsp;e) The end-to-end principle states that one should make the lower levels between the<br>
&emsp;&emsp;higher-level ends as reliable and secure as possible.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    **FALSE**<br>
&emsp;&emsp;Why?<br>
&emsp;&emsp;The E2E principle says the opposite.

&emsp;f) FAT provides slower sequential access to a file than Unix File System.

Page 3/13


---

<a id="page-4"></a>
**Page 4**

CS 162 Spring 2017, 3rd Midterm Exam                                     April 24, 2017

&emsp;&emsp;&emsp;&emsp;&emsp;**TRUE**                    FALSE<br>
&emsp;&emsp;Why?<br>
FAT needs to perform a disk access for every block to find the pointer to that block,<br>
while Unix File System gets the pointers to many blocks by reading an inode.

&emsp;g) Using quorum consensus a writer can return before the data has been written to all<br>
&emsp;&emsp;replicas.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**TRUE**                    FALSE<br>
&emsp;&emsp;Why?<br>
The writer returns after it hears form W replicas, where W is typically smaller than the<br>
total number of replicas, N.

&emsp;h) With consistent hashing (e.g., Chord) if a new node is added to a system<br>
&emsp;&emsp;consisting of N \> 1 nodes, this will lead to keys from every node to be moved<br>
&emsp;&emsp;around.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    **FALSE**<br>
&emsp;&emsp;Why?<br>
Let’s A be the new node. Only the keys of A’s successor will be moved to A.

**P2** (15 points) **Transactions.** Consider two variables A and B which are initialized to 1,<br>
and 2, respectively:

Page 4/13


---

<a id="page-5"></a>
**Page 5**

CS 162 Spring 2017, 3rd Midterm Exam                                     April 24, 2017


![Figure on page 5](figures/solutions-p05-fig03.png)

Consider the following two transactions being attempted on A and B:


![Figure on page 5](figures/solutions-p05-fig04.png)

For the following scenarios, list which ACID property was violated or “none” if the<br>
transactions obeyed ACID, explain your answer in 1 sentence:<br>
a) (3 points) Transaction 1 successfully committed, then the computer crashed after step 2<br>
(B=6) of transaction 2 (but before writing the commit record to the log).<br>
State after Recovery:


![Figure on page 5](figures/solutions-p05-fig05.png)

Correct ACID behavior. Txn 1 committed, txn 2 did not.

b) (3 points) The transactions were run on two threads (at the same time) and have both<br>
committed. Note: concurrent transactions may complete in any order. State which order<br>
your answer assumes (if any).<br>
State after Recovery:


![Figure on page 5](figures/solutions-p05-fig06.png)

Order (2, 1): Correct ACID behavior. Isolation only requires some serialized order (the<br>
outcome is as if one transaction ran to completion, then the next ran to completion),<br>
overwriting old commits is perfectly acceptable.<br>
Order (1, 2): Durability (or maybe isolation) was violated. Durability: The changes from<br>
the latest committed transaction were not reflected in the final state (most recent changes<br>
were lost). Isolation is possible if you assume that B logged its changes, then A ran to<br>
completion, then B committed.

Page 5/13


---

<a id="page-6"></a>
**Page 6**

CS 162 Spring 2017, 3rd Midterm Exam                                     April 24, 2017

c) (3 points) The transactions were run on two threads (at the same time) and have both<br>
committed. Note: concurrent transactions may complete in any order. State which order<br>
your answer assumes (if any).<br>
Final State:


![Figure on page 6](figures/solutions-p06-fig07.png)

Isolation was violated. A and B got interleaved. In this case, there was no total “order” so<br>
they may assume either order.

d) (3 points) **Transaction 1 successfully committed**, then the computer crashed during<br>
transaction 2 (before commit).<br>
State after Recovery:


![Figure on page 6](figures/solutions-p06-fig08.png)

Atomicity was violated. B was only partially performed.

e) (3 points) Both transactions committed (in order txn1,txn2), then the computer<br>
crashed.<br>
State after Recovery:


![Figure on page 6](figures/solutions-p06-fig09.png)

Durability was violated. Txn 2 was lost despite committing.

Page 6/13


---

<a id="page-7"></a>
**Page 7**

CS 162 Spring 2017, 3rd Midterm Exam                                     April 24, 2017

**P3** (12 points) **Synchronization**. Consider the following C program.

int thread\_count = 0;

void \*thread\_start(void \*arg) {<br>
thread\_count++;<br>
if (thread\_count == 3) {<br>
char \*argv\[\] = {"/bin/echo", “162 is the best!”, NULL};<br>
/\* Replace current process image with a new process image<br>
\* that runs program pointed by “\*argv” with arguments “argv” \*/<br>
execv(\*argv, argv);<br>
}<br>
printf("Thread: %d\\n", thread\_count);<br>
return NULL;<br>
}

int main(int argc, char \*argv\[\]) {<br>
int i, status;<br>
for (i = 0; i \< 2; i++) {<br>
pid\_t pid = fork();<br>
if (pid != 0) {<br>
thread\_count++;<br>
wait(&status);<br>
}<br>
pthread\_t \*thread = malloc(sizeof(pthread\_t));<br>
/\* start new “thread”. The new thread starts execution by invoking<br>
\* “thread\_start()” with NULL arg. \*/<br>
pthread\_create(thread, NULL, &thread\_start, NULL);<br>
pthread\_join(\*thread, NULL);<br>
}<br>
return 0;<br>
}<br>
&emsp;&emsp;a) (8 points) Provide one possible output from this C program.


![Figure on page 7](figures/solutions-p07-fig10.png)

&emsp;&emsp;b) (4 points) Is the output deterministic? If yes, give a short explanation why. If<br>
&emsp;&emsp;&emsp;no, explain how to make the output deterministic.

Page 7/13


---

<a id="page-8"></a>
**Page 8**

CS 162 Spring 2017, 3rd Midterm Exam                                     April 24, 2017

&emsp;&emsp;Yes.  Each process is serialized by its wait, and each thread is serialized by<br>
pthread\_join.<br>
**P4** (16 points) **Queueing theory** Consider a system with a single queue and a single<br>
server. The arrival rate of the requests follows a Poisson process, and the service time is<br>
exponential distributed. Thus, the system implements an M/M/1 queue. Assume that:<br>
&emsp;• The utilization U is 50%.<br>
&emsp;• The average service time Tser = ⅙ seconds.<br>
&emsp;a) (4 points) What is the average service rate µ and arrival rate ƛ?<br>
&emsp;&emsp;Service rate μ is 1/Tser, so 6 jobs per second.<br>
&emsp;&emsp;Utilization, u = λ/μ, so λ = u \* μ = 3 jobs per second.<br>
λ

&emsp;a) (4 points) What are the average time spent in the queue Tq and the response time?<br>
&emsp;&emsp;Tq = Tser\*u / (1-u) = (1/6)\*(1/2)/(1-1/2) = ⅙ seconds.<br>
&emsp;&emsp;Tsys = Tq + Tser = ⅙ + ⅙ = ⅓ seconds.

&emsp;b) (4 points) What is the average length of the queue Lq?<br>
&emsp;&emsp;By little’s law, this is lambda \* Tq = 3 \* ⅙ = ½ jobs.

&emsp;c) (4 points) Assume that we add an additional server with the same service time<br>
&emsp;&emsp;(Tser = ⅙ seconds) to help service our queue. What is the average time spent in<br>
&emsp;&emsp;the queue Tq and response time for the new system, assuming the same arrival rate<br>
&emsp;&emsp;as at point (a), and that requests are balanced equally across the two servers?

&emsp;&emsp;u is now half because the requests are split over the two servers.<br>
&emsp;&emsp;Tq = Tser\*(u/(1-u)) = (1/6)\*(1/4)/(1-1/4) = 1/18 seconds.<br>
&emsp;&emsp;Tsys = Tq + Tser = 1/18 + 1/6 = 4/18 seconds.

Page 8/13


---

<a id="page-9"></a>
**Page 9**

CS 162 Spring 2017, 3rd Midterm Exam                                     April 24, 2017

**P5:** (15 points) **Caching and storage**: You have been hired at a hot startup located in<br>
downtown Berkeley and you are tasked with building a key-value store backed by<br>
spinning disks. Each disk has the following performance:<br>
&emsp;• Bandwidth: 100MB/s<br>
&emsp;• Disk controller latency:  1ms<br>
&emsp;• Average rotational latency: 3ms<br>
&emsp;• Seek latency: 3ms<br>
In front of the backing store you have provisioned an in-memory caching layer. The<br>
performance of this layer is bounded by the capacity of the network, which is 100MB/s.<br>
Each access to the key-value requests translates into one access into the cache and, if<br>
there is a cache miss, to one access to one backing disk. Each access results in reading 1<br>
key-value of 100 KB, which is stored contiguously on the disk (i.e., on adjacent sectors.)<br>
Ignore the network and cache latency.<br>
&emsp;a) (5 points) Considering your workload hits the cache 50% of the time, what is the<br>
&emsp;&emsp;average service time (i.e., the time/latency to retrieve a key-value)?<br>
Service time to read a key-value from disk =<br>
= controller latency + rotation latency + seek latency + transfer time<br>
= 1ms + 3ms + 3ms + 100KB/100MBps = 8ms<br>
Service time to read a key-value from cache: 100KB/100MBps  = 1ms<br>
Average service time = 0.5\*1ms + 0.5\*(8ms + 1ms) = 0.5 + 4.5 = 5ms.<br>
We gave partial credit for not including service time to read a key-value from cache.<br>
We also considered solutions that don’t account for cache updates as correct (average<br>
4.5ms).<br>
&emsp;b) (5 points) What is the maximum number of requests (reads) per second that this<br>
&emsp;&emsp;system can handle?<br>
Requests per second = 1s/5ms = 200 request/sec


![Figure on page 9](figures/solutions-p09-fig11.png)

&emsp;c) (5 points) Now consider that you decide to change your spinning disks with faster<br>
&emsp;&emsp;SSDs to achieve an average service time (i.e., the time/latency to retrieve a key-<br>
&emsp;&emsp;value) of 1.25ms. Assume that the SSD controller latency is 1ms, the same as the<br>
&emsp;&emsp;HDD controller latency. What is the bandwidth of the SSD?

Page 9/13


---

<a id="page-10"></a>
**Page 10**

CS 162 Spring 2017, 3rd Midterm Exam                                     April 24, 2017

Service time to read from SSD = (1ms + 100KB/X)<br>
Average service time = 0.5\*1ms + 0.5\*(1ms + 100KB/X) = 1.25ms =\><br>
1ms + 100 KB/X = 1.5ms =\> X = 200MB/s<br>
We gave partial credit to solutions that didn't include service time to read a key-value<br>
from cache.

**P6** (18 points) **TCP Flow Control.**<br>
Assume host S uses TCP to send 1000 bytes of data to host R. We make the following<br>
assumptions:<br>
&emsp;• The maximum packet size is 300B.<br>
&emsp;•    Maximum size of R’s receiving buffer is 500B.<br>
&emsp;•    The delay between the machines is much larger than the time it takes to S to send<br>
&emsp;&emsp;1KB, i.e, S could send 1KB faster than it takes to hear back an ack from R.<br>
&emsp;• R consumes the bytes as soon as it receives them (i.e., R’s OS sends data to<br>
&emsp;&emsp;receiving app as soon as it gets them.)<br>
a) (6 points) Assume no packet or acknowledgement is lost. Draw the packet diagram<br>
also indicating the bytes in R’s sending buffer and the bytes in S’s receiving buffer.  For<br>
the acknowledgements indicate both the sequence of next expected byte, and the<br>
advertised window.<br>
The first packet with the associated information is drawn for you.<br>
Initial advertised window (AdvWindow) is equal with the receiver buffer size which is<br>
500B. Also, while below we also show sender window (SendWin), there was **no** penalty<br>
for not showing it, as the problem didn’t ask for it.

Page 10/13


---

<a id="page-11"></a>
**Page 11**

CS 162 Spring 2017, 3rd Midterm Exam                                     April 24, 2017


![Figure on page 11](figures/solutions-p11-fig12.png)

b) (6 points) Draw the packet diagram assuming the acknowledgement of the first packet<br>
is lost. No other packet or acknowledgement is lost.

Page 11/13


---

<a id="page-12"></a>
**Page 12**

CS 162 Spring 2017, 3rd Midterm Exam                                     April 24, 2017


![Figure on page 12](figures/solutions-p12-fig13.png)

c) (6 points) Draw the packet diagram assuming the third packet from the sender is lost.<br>
No other packet or acknowledgement is lost.

Page 12/13


---

<a id="page-13"></a>
**Page 13**

CS 162 Spring 2017, 3rd Midterm Exam                                     April 24, 2017


![Figure on page 13](figures/solutions-p13-fig14.png)

Page 13/13

