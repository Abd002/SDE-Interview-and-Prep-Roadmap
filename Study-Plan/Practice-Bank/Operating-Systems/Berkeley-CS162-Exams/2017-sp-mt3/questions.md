# Berkeley CS162 Spring 2017: Midterm 3: Questions

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


![Figure on page 1](figures/questions-p01-fig01.png)

General Information:<br>
This is a **closed book and one 2-sided handwritten note** examination. You have 80 minutes to<br>
answer as many questions as possible.  The number in parentheses at the beginning of each<br>
question indicates the number of points for that question. You should read **all** of the questions<br>
before starting the exam, as some of the questions are substantially more time consuming.<br>
Write all of your answers directly on this paper.  **Make your answers as concise as possible.** If there<br>
is something in a question that you believe is open to interpretation, then please ask us about it!<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Good Luck!!**


![Figure on page 1](figures/questions-p01-fig02.png)

Page 1/12


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
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?

&emsp;b) A TCP sender can overflow the receiver’s buffer.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?

Page 2/12


---

<a id="page-3"></a>
**Page 3**

CS 162 Spring 2017, 3rd Midterm Exam                                     April 24, 2017

&emsp;c) A process can wait for all of its children with a single call to wait(&status).<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?

&emsp;d) Two-Phase Commit does not guarantee all ACID properties (Atomicity,<br>
&emsp;&emsp;Consistency, Isolation, and Durability).<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?

&emsp;e) The end-to-end principle states that one should make the lower levels between the<br>
&emsp;&emsp;higher-level ends as reliable and secure as possible.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?

Page 3/12


---

<a id="page-4"></a>
**Page 4**

CS 162 Spring 2017, 3rd Midterm Exam                                     April 24, 2017

&emsp;f) FAT provides slower sequential access to a file than Unix File System.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?

&emsp;g) Using quorum consensus a writer can return before the data has been written to all<br>
&emsp;&emsp;replicas.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?

&emsp;h) With consistent hashing (e.g., Chord) if a new node is added to a system<br>
&emsp;&emsp;consisting of N \> 1 nodes, this will lead to keys from every node to be moved<br>
&emsp;&emsp;around.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?

Page 4/12


---

<a id="page-5"></a>
**Page 5**

CS 162 Spring 2017, 3rd Midterm Exam                                     April 24, 2017

**P2** (15 points) **Transactions.** Consider two variables A and B which are initialized to 1,<br>
and 2, respectively:


![Figure on page 5](figures/questions-p05-fig03.png)

Consider the following two transactions being attempted on A and B:


![Figure on page 5](figures/questions-p05-fig04.png)

For the following scenarios, list which ACID property was violated or “none” if the<br>
transactions obeyed ACID, explain your answer in 1 sentence:<br>
a) (3 points) Transaction 1 successfully committed, then the computer crashed after step 2<br>
(B=6) of transaction 2 (but before writing the commit record to the log).<br>
State after Recovery:


![Figure on page 5](figures/questions-p05-fig05.png)

b) (3 points) The transactions were run on two threads (at the same time) and have both<br>
committed. Note: concurrent transactions may complete in any order. State which order<br>
your answer assumes (if any).<br>
State after Recovery:


![Figure on page 5](figures/questions-p05-fig06.png)

Page 5/12


---

<a id="page-6"></a>
**Page 6**

CS 162 Spring 2017, 3rd Midterm Exam                                     April 24, 2017

c) (3 points) The transactions were run on two threads (at the same time) and have both<br>
committed. Note: concurrent transactions may complete in any order. State which order<br>
your answer assumes (if any).<br>
Final State:


![Figure on page 6](figures/questions-p06-fig07.png)

d) (3 points) **Transaction 1 successfully committed**, then the computer crashed during<br>
transaction 2 (before commit).<br>
State after Recovery:


![Figure on page 6](figures/questions-p06-fig08.png)

e) (3 points) Both transactions committed (in order txn1,txn2), then the computer<br>
crashed.<br>
State after Recovery:


![Figure on page 6](figures/questions-p06-fig09.png)

Page 6/12


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

&emsp;&emsp;b) (4 points) Is the output deterministic? If yes, give a short explanation why. If<br>
&emsp;&emsp;&emsp;no, explain how to make the output deterministic.

Page 7/12


---

<a id="page-8"></a>
**Page 8**

CS 162 Spring 2017, 3rd Midterm Exam                                     April 24, 2017

**P4** (16 points) **Queueing theory** Consider a system with a single queue and a single<br>
server. The arrival rate of the requests follows a Poisson process, and the service time is<br>
exponential distributed. Thus, the system implements an M/M/1 queue. Assume that:<br>
&emsp;•    The utilization U is 50%.<br>
&emsp;• The average service time Tser = ⅙ seconds.<br>
&emsp;a) (4 points) What is the average service rate µ and arrival rate ƛ?

&emsp;b) (4 points) What are the average time spent in the queue Tq and the response time?

&emsp;c) (4 points) What is the average length of the queue Lq?

&emsp;d) (4 points) Assume that we add an additional server with the same service time<br>
&emsp;&emsp;(Tser = ⅙ seconds) to help service our queue. What is the average time spent in<br>
&emsp;&emsp;the queue Tq and response time for the new system, assuming the same arrival rate<br>
&emsp;&emsp;as at point (a), and that requests are balanced equally across the two servers?

Page 8/12


---

<a id="page-9"></a>
**Page 9**

CS 162 Spring 2017, 3rd Midterm Exam                                     April 24, 2017

**P5:** (15 points) **Caching and storage**: You have been hired at a hot startup located in<br>
downtown Berkeley and you are tasked with building a key-value store backed by<br>
spinning disks. Each disk has the following performance:<br>
&emsp;•    Bandwidth: 100MB/s<br>
&emsp;•    Disk controller latency:  1ms<br>
&emsp;• Average rotational latency: 3ms<br>
&emsp;• Seek latency: 3ms<br>
In front of the backing store you have provisioned an in-memory caching layer. The<br>
performance of this layer is bounded by the capacity of the network, which is 100MB/s.<br>
Each access to the key-value requests translates into one access into the cache and, if<br>
there is a cache miss, to one access to one backing disk. Each access results in reading 1<br>
key-value of 100 KB, which is stored contiguously on the disk (i.e., on adjacent sectors.)<br>
Ignore the network and cache latency.<br>
&emsp;a) (5 points) Considering your workload hits the cache 50% of the time, what is the<br>
&emsp;&emsp;average service time (i.e., the time/latency to retrieve a key-value)?

&emsp;b) (5 points) What is the maximum number of requests (reads) per second that this<br>
&emsp;&emsp;system can handle?

&emsp;c) (5 points) Now consider that you decide to change your spinning disks with faster<br>
&emsp;&emsp;SSDs to achieve an average service time (i.e., the time/latency to retrieve a key-<br>
&emsp;&emsp;value) of 1.25ms. Assume that the SSD controller latency is 1ms, the same as the<br>
&emsp;&emsp;HDD controller latency. What is the bandwidth of the SSD?

Page 9/12


---

<a id="page-10"></a>
**Page 10**

CS 162 Spring 2017, 3rd Midterm Exam                                     April 24, 2017

**P6** (18 points) **TCP Flow Control.**<br>
Assume host S uses TCP to send 1000 bytes of data to host R. We make the following<br>
assumptions:<br>
&emsp;•    The maximum packet size is 300B.<br>
&emsp;•    Receiving buffer of R is 500B.<br>
&emsp;• The delay between the machines is much larger than the time it takes to S to send<br>
&emsp;&emsp;1KB, i.e, S could send 1KB faster than it takes to hear back an ack from R.<br>
&emsp;• R consumes the bytes as soon as it receives them (i.e., R’s OS sends data to<br>
&emsp;&emsp;receiving app as soon as it gets them.)<br>
a) (6 points) Assume no packet or acknowledgement is lost. Draw the packet diagram<br>
also indicating the bytes in R’s sending buffer and the bytes in S’s receiving buffer.  The<br>
first packet with the associated information is drawn for you.


![Figure on page 10](figures/questions-p10-fig10.png)

Page 10/12


---

<a id="page-11"></a>
**Page 11**

CS 162 Spring 2017, 3rd Midterm Exam                                     April 24, 2017

b) (6 points) Draw the packet diagram assuming the acknowledgement of the first packet<br>
is lost. No other packet or acknowledgement is lost.


![Figure on page 11](figures/questions-p11-fig11.png)

Page 11/12


---

<a id="page-12"></a>
**Page 12**

CS 162 Spring 2017, 3rd Midterm Exam                                     April 24, 2017

c) (6 points) Draw the packet diagram assuming the third packet from the sender is lost.<br>
No other packet or acknowledgement is lost.


![Figure on page 12](figures/questions-p12-fig12.png)

Page 12/12

