# Berkeley CS162 Fall 2017: Midterm 3: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

CS 162 Fall 2017, 3rd Midterm Exam                November 29, 2017

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;University of California, Berkeley<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;College of Engineering<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Computer Science Division – EECS<br>
Fall 2017                                Ion Stoica<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Third Midterm Exam**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;November 29, 2017<br>
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

CS 162 Fall 2017, 3rd Midterm Exam                November 29, 2017

**P1** (20 points total) True/False and Why? **CIRCLE YOUR ANSWER**. For each question: 1<br>
point for true/false correct, 1 point for explanation. An explanation cannot exceed 2 sentences.<br>
&emsp;a) As the size of the read operations decreases the effective bandwidth of an SSD in bits/sec<br>
&emsp;&emsp;also decreases.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?

&emsp;b) File permissions are stored in the File Allocation Table in FAT32 filesystems.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?

&emsp;c) Finger tables are not necessary for the correctness of Chord (e.g. correct lookup of keys).<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?

&emsp;d) According to Little's Law, the number of customers/jobs in the system depends on the<br>
&emsp;&emsp;type of arrival distribution.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?

&emsp;e) On a remote procedure call, the client code must first marshal the arguments before<br>
&emsp;&emsp;passing them into the RPC, which then passes them to a client stub that handles sending<br>
&emsp;&emsp;them to the remote server.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?

Page 2/12


---

<a id="page-3"></a>
**Page 3**

CS 162 Fall 2017, 3rd Midterm Exam                November 29, 2017

&emsp;f) Storing inodes in the same cylinder group as their underlying files improves performance<br>
&emsp;&emsp;compared to storing them all in the outermost cylinders.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?

&emsp;g) According to the end-to-end principle presented in this class, there is sometimes a benefit<br>
&emsp;&emsp;to implementing functionality at a lower layer.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?

&emsp;h) “Best effort” packet delivery ensures that packets are delivered reliably and in-order.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?

&emsp;i) Log structured file systems generally perform much better on random writes than random<br>
&emsp;&emsp;reads.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?

&emsp;j) NTFS stores file data through fixed-size blocks organized into lists or trees in records in<br>
&emsp;&emsp;the Master File Table.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?

Page 3/12


---

<a id="page-4"></a>
**Page 4**

CS 162 Fall 2017, 3rd Midterm Exam                November 29, 2017

**P2** (16 points) **Short Answers:**<br>
a) (8 points) \[Anime Party Synchronization\] A party has two types of attendees: Rem fans and<br>
Emilia fans, and neither really likes each other. Each can try to enter, or can exit, at any time.<br>
However, any fan first checks in with a bouncer (your monitor synchronization) before entering<br>
the party. If an absolute majority of one type of fan exists inside the party, then the bouncer<br>
allows all majority fans in. Minority fans are only allowed to enter if they would not create a tie<br>
or flip the majority in the party, otherwise they are blocked outside. Example: if there were 5<br>
Rem fans in the party and they held majority, only up to 4 Emilia fans would be allowed in and<br>
the rest would block, while any number of Rem fans would be allowed in.<br>
Additional Notes:<br>
&emsp;• Blocked and exited fans outside the party do not count for determining majorities. In a tie<br>
&emsp;&emsp;there is no majority.<br>
&emsp;• Fans should never hang (e.g. as soon as the minority ties or become the majority in the<br>
&emsp;&emsp;party, their blocked friends should enter).<br>
&emsp;• Fans cannot be blocked from exiting or forced to exit.<br>
Implement this as a synchronization monitor using the following struct definition. Do not modify<br>
the struct or attempt to add lines of code beyond that provided. Inefficiency is acceptable, the<br>
priority is correctness:

typedef struct {<br>
struct lock lock; //lock.acquire(), lock.release()<br>
struct cv rem\_cv; //cv.wait(&lock), cv.signal(), cv.broadcast()<br>
struct cv emilia\_cv;<br>
int rem\_fans;<br>
int emilia\_fans;<br>
} party\_monitor;

rem\_fan\_enter(party\_monitor\* re) {<br>
re-\>lock.acquire();<br>
\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_<br>
&emsp;&emsp;\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_<br>
&emsp;&emsp;\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_<br>
re-\>lock.release();<br>
}<br>
rem\_fan\_exit(party\_monitor\* re) {<br>
re-\>lock.acquire();<br>
\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_<br>
&emsp;&emsp;\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_<br>
re-\>lock.release()<br>
}

Page 4/12


---

<a id="page-5"></a>
**Page 5**

CS 162 Fall 2017, 3rd Midterm Exam                November 29, 2017

emilia\_fan\_enter(party\_monitor\* re) {<br>
re-\>lock.acquire();<br>
\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_<br>
&emsp;&emsp;\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_<br>
&emsp;&emsp;\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_<br>
re-\>lock.release();<br>
}<br>
emilia\_fan\_exit(party\_monitor\* re) {<br>
re-\>lock.acquire();<br>
\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_<br>
&emsp;&emsp;\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_<br>
re-\>lock.release()<br>
}<br>
b) (8 points) \[Supply & Demand Paging\] Fill in the table below assuming the LRU and Clock<br>
page replacement policies. There are 4 frames of physical memory. The left column indicates the<br>
frame number, and each entry to the right contains the page that resides in the corresponding<br>
physical frame, after each memory reference (we have already filled in the row corresponding to<br>
accessing A). For clock, tick the hand first before checking the use bit on a fault. For readability<br>
purposes, **only fill in the table entries that have changed and leave unchanged entries blank**.


![Figure on page 5](figures/questions-p05-fig03.png)


![Figure on page 5](figures/questions-p05-fig04.png)

Page 5/12


---

<a id="page-6"></a>
**Page 6**

CS 162 Fall 2017, 3rd Midterm Exam                November 29, 2017

**P3** (12 points) **Filesystem Magica:** Madoka Kaname is building a filesystem for Project 3. She<br>
implements a thread-safe write-back cache. She also implements extensible files and directories<br>
using her modified inode definition. For thread safety, she makes sure that a thread grabs a<br>
corresponding per-inode lock when it extends a file, and when it reads or writes a directory.<br>
Madoka decides to implement a move syscall, which moves a file from directory to directory:

move(inode \*dir1, inode \*dir2, char \*filename) {<br>
lock\_acquire(dir1-\>lock);<br>
lock\_acquire(dir2-\>lock);  // Assume no deadlocks.<br>
struct dir\_entry entry;<br>
bool exists = lookup(dir1, filename, &entry);<br>
if (exists) {<br>
block\_sector\_t file\_inode\_sector = entry.sector;<br>
erase\_directory\_entry(dir1, entry);  // Writes to buffer cache.<br>
add\_directory\_entry(dir2, filename, file\_inode\_sector);  // Writes to<br>
buffer cache.<br>
}<br>
lock\_release(dir2-\>lock);<br>
lock\_release(dir1-\>lock);<br>
}

**A user program:**<br>
// Assume all syscalls succeed<br>
create(“/hello/world”, 12);<br>
mv(“/hello/world”, “/goodbye/world”); //enters move() through syscall<br>
printf(“done!”);<br>
&emsp;a) (4 points) To test her filesystem’s reliability, Madoka runs the above user program and<br>
&emsp;&emsp;pulls the power after seeing the “done!” message. She finds that neither /hello/ nor<br>
&emsp;&emsp;/goodbye/ have her file! What happened? (1 sentence)

&emsp;b) (4 points) By modifying the move function, how can Madoka make sure that at least one<br>
&emsp;&emsp;of the directories has a file named “world” after a crash? (1 sentence)

&emsp;c) (4 points) By modifying the filesystem design, how can Madoka make sure that exactly<br>
&emsp;&emsp;one of the directories has a file named “world” after a crash? (1 sentence)

Page 6/12


---

<a id="page-7"></a>
**Page 7**

CS 162 Fall 2017, 3rd Midterm Exam                November 29, 2017

**P4** (16 points) **No Game No Commit:** Consider the 2-phase commit protocol with a coordinator<br>
C and 3 workers W1, W2, W3. Assume:<br>
&emsp;• C communicates with W1, W2, W3 in parallel<br>
&emsp;• C timeout latency is 1s<br>
&emsp;• latency for sending/receiving messages from C to W1-W3, and for logging messages at<br>
&emsp;&emsp;W1-W3 are shown below (assume all other latencies are negligible):


![Figure on page 7](figures/questions-p07-fig05.png)


![Figure on page 7](figures/questions-p07-fig06.png)

&emsp;&emsp;&emsp;&emsp;&emsp;YES                     NO


![Figure on page 7](figures/questions-p07-fig07.png)

&emsp;&emsp;&emsp;&emsp;&emsp;YES                     NO


![Figure on page 7](figures/questions-p07-fig08.png)

&emsp;&emsp;&emsp;&emsp;&emsp;YES                     NO

Page 7/12


---

<a id="page-8"></a>
**Page 8**

CS 162 Fall 2017, 3rd Midterm Exam                November 29, 2017

**P5** (12 points) **CS168 Except Not Multiple Choice:** Consider a TCP connection, such that:<br>
&emsp;• the sender sends 1800 bytes worth of data;<br>
&emsp;• the receiver’s initial advertised window is 1000 bytes;<br>
&emsp;• the maximum packet size is 500 bytes;<br>
&emsp;• the receiving process consumes each packet p that contains in-sequence bytes right after<br>
&emsp;&emsp;the ack for p is sent (by the receiver), and before the receiver receives the next packet;<br>
&emsp;&emsp;note that if packet p does not contain in-sequence bytes (i.e., the previous packet has not<br>
&emsp;&emsp;been received) that receiving process does not consume p.<br>
&emsp;• the sender can send all data before the first ack is received, of course, modulo the size of<br>
&emsp;&emsp;the advertised window and of the sender window.<br>
&emsp;a) (4 points) Assume no packets are lost. Draw the time diagram of the packet delivery. For<br>
&emsp;&emsp;each packet indicates the bytes sent in that packet, and for each ack packet show the<br>
&emsp;&emsp;sequence number of the next expected byte, and the advertised window (denoted<br>
&emsp;&emsp;advWin).


![Figure on page 8](figures/questions-p08-fig09.png)

&emsp;b) (4 points) Assume now the 1st packet is lost and none of the other packets are lost<br>
&emsp;&emsp;afterwards.  Draw the time diagram of the packet delivery. For each packet indicates the<br>
&emsp;&emsp;bytes sent in that packet, and for each ack packet show the sequence number of the next<br>
&emsp;&emsp;expected byte, and the advertised window.

Page 8/12


---

<a id="page-9"></a>
**Page 9**

CS 162 Fall 2017, 3rd Midterm Exam                November 29, 2017


![Figure on page 9](figures/questions-p09-fig10.png)

&emsp;c) (4 points) Assume now that the advertised window is 1200 bytes, and the 1st and 2nd<br>
&emsp;&emsp;packets are received by the receiver in reverse order, i.e., the receiver gets 2nd packet<br>
&emsp;&emsp;before the 1st packet. No packets are lost, and no other packets or acks are reordered.<br>
&emsp;&emsp;Draw the time diagram of the packet delivery. For each packet indicates the bytes sent in<br>
&emsp;&emsp;that packet, and for each ack packet show the sequence number of the next expected byte,<br>
&emsp;&emsp;and the advertised window.


![Figure on page 9](figures/questions-p09-fig11.png)

Page 9/12


---

<a id="page-10"></a>
**Page 10**

CS 162 Fall 2017, 3rd Midterm Exam                November 29, 2017

**P6** (24 points) **Sword Art I/O:** You're excited to download the 1st episode of Sword Art Online<br>
(SAO) from Netflix. Your client (browser) connects with the master server in the nearest Netflix<br>
datacenter, which coordinates many worker servers. The workers store an unreplicated<br>
distributed key-value store mapping "TV Show Title" -\> video file.<br>
a) \[Queuing & Networking\] Assume all network links have 80 gigabits/second (10 gigabytes/s)<br>
&emsp;of bandwidth. The latency between you and any server in the datacenter is 100 ms, while the<br>
&emsp;latency between servers in the datacenter is 10 ms. Assume that all requests and responses<br>
&emsp;except for the video itself are negligible (~0 bytes) in size, and all arrivals & service times<br>
&emsp;are memoryless. The video is 1 gigabyte in size. Assume in parts i), ii), & iii) that the master<br>
&emsp;cached the video (no communication with workers).<br>
&emsp;&emsp;i.    (2 points) What is the network round trip time (from your sending the request to<br>
&emsp;&emsp;&emsp;getting the video), ignoring queueing and processing delays?

&emsp;ii.    (3 points) Assume the master has a service time of 10ms and 25 requests arrive per<br>
&emsp;&emsp;&emsp;second. Assuming steady state, what is the utilization, time spent in the queue, and<br>
&emsp;&emsp;&emsp;the length of the master’s queue?


![Figure on page 10](figures/questions-p10-fig12.png)

u

Tq

Lq

&emsp;iii.    (3 points) SAO turns out to be very popular, and the arrival rate jumps to 162 requests<br>
&emsp;&emsp;&emsp;per second (service time is still 10ms). Assuming steady state, what is the utilization,<br>
&emsp;&emsp;&emsp;time spent in queue, and length of the master’s queue?


![Figure on page 10](figures/questions-p10-fig13.png)

u

Tq

Lq

Page 10/12


---

<a id="page-11"></a>
**Page 11**

CS 162 Fall 2017, 3rd Midterm Exam                November 29, 2017

&emsp;iv.    Assume the master no longer caches the video and you query the distributed key-<br>
&emsp;&emsp;&emsp;value store iteratively.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;α)  (1 point) What is the network round trip time, ignoring processing &<br>
&emsp;&emsp;&emsp;&emsp;&emsp;queuing delays?

&emsp;&emsp;&emsp;&emsp;&emsp;β)  (2 points) Consider the utilization, queuing time, & service time in part ii):<br>
&emsp;&emsp;&emsp;&emsp;&emsp;uold, Tq, Tser. In the master, express the new utilization unew in terms of uold and<br>
&emsp;&emsp;&emsp;&emsp;&emsp;compute the new queuing time Tnew in terms of Tq and/or Tser.


![Figure on page 11](figures/questions-p11-fig14.png)

&emsp;&emsp;&emsp;&emsp;&emsp;unew

&emsp;&emsp;&emsp;&emsp;&emsp;Tnew

&emsp;v.    Assume the master no longer caches the video and you query the distributed key-<br>
&emsp;&emsp;&emsp;value store recursively.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;α)  (1 point) What is the network round trip time, ignoring processing &<br>
&emsp;&emsp;&emsp;&emsp;&emsp;queuing delays?

&emsp;&emsp;&emsp;&emsp;&emsp;β)  (2 points) Consider the utilization, queuing time, & service time in part ii):<br>
&emsp;&emsp;&emsp;&emsp;&emsp;uold, Tq, Tser. In the master, express the new utilization unew in terms of uold and<br>
&emsp;&emsp;&emsp;&emsp;&emsp;compute the new queuing time Tnew in terms of Tq and/or Tser. Assume it takes<br>
&emsp;&emsp;&emsp;&emsp;&emsp;the same time to service either a client or a worker.


![Figure on page 11](figures/questions-p11-fig15.png)

&emsp;&emsp;&emsp;&emsp;&emsp;unew

&emsp;&emsp;&emsp;&emsp;&emsp;Tnew

&emsp;vi.    (2 points) You want to download your SAO episode as fast as possible. Do you prefer<br>
&emsp;&emsp;&emsp;recursive or iterative queries? Explain briefly in 1 sentence.

&emsp;vii.    (2 points) Suppose you now want to download all 50 episodes of SAO in a batch as<br>
&emsp;&emsp;&emsp;fast as possible rather than just 1 episode. Do you prefer recursive or iterative<br>
&emsp;&emsp;&emsp;queries? Explain briefly in 1 sentence.

Page 11/12


---

<a id="page-12"></a>
**Page 12**

CS 162 Fall 2017, 3rd Midterm Exam                November 29, 2017

b) \[Disk Latency\] Within a single worker server, a disk has the following characteristics:<br>
&emsp;• 1ms controller delay<br>
&emsp;• 1ms seek time<br>
&emsp;• 30000 rpm rotation speed<br>
&emsp;• 1 megabyte/s transfer rate<br>
&emsp;• 10 kilobyte sector size<br>
&emsp;&emsp;&emsp;i.    (3 points) Compute the average rotation time, transfer time, and average total time<br>
&emsp;&emsp;&emsp;&emsp;&emsp;to read 1 sector. Ignore queuing delay.


![Figure on page 12](figures/questions-p12-fig16.png)

Rotation

Transfer

Total

&emsp;&emsp;&emsp;ii.    Schedule the I/O operations using the following disk scheduling algorithms. The<br>
&emsp;&emsp;&emsp;&emsp;&emsp;arm is initially over cylinder 35. Assume SCAN and C-SCAN begin by traversing<br>
&emsp;&emsp;&emsp;&emsp;&emsp;ascending cylinder numbers, and ignore rotational delay. List the operations<br>
&emsp;&emsp;&emsp;&emsp;&emsp;scheduling order from left to right.


![Figure on page 12](figures/questions-p12-fig17.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;γ) (1 point) C-SCAN:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;C, D, E, F, A, B

Page 12/12

