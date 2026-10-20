# Berkeley CS162 Spring 2006: Midterm 2: Official solutions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;University of California, Berkeley<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;College of Engineering<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Computer Science Division – EECS<br>
Spring 2006                                     Anthony D. Joseph<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Midterm #2 Exam Solutions**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;April 26, 2006<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS162 Operating Systems


![Figure on page 1](figures/solutions-p01-fig01.png)

General Information:<br>
This is a **closed book and notes** examination. You have 90 minutes to answer as many questions<br>
as possible.  The number in parentheses at the beginning of each question indicates the number of<br>
points given to the question; there are 100 points in all. You should read **all** of the questions<br>
before starting the exam, as some of the questions are substantially more time consuming.<br>
Write all of your answers directly on this paper.  **Make your answers as concise as possible.** If there<br>
is something in a question that you believe is open to interpretation, then please ask us about it!<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Good Luck!!**


![Figure on page 1](figures/solutions-p01-fig02.png)

Page 1/12


---

<a id="page-2"></a>
**Page 2**

CS 162 Spring 2006 Midterm #2 Exam        April 26, 2006<br>
Solutions

1\. (19 points total) Short answer questions:<br>
&emsp;a. (11 points) Translation Look-Aside Buffers:<br>
&emsp;&emsp;i)  (6 points) On a TLB miss in Nachos, what data structures should you check to<br>
&emsp;&emsp;&emsp;find a previously referenced page? List the data structures in the order that<br>
&emsp;&emsp;&emsp;they should be checked.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;First, you should check the Inverted Page Table, then the swap file, and<br>
&emsp;&emsp;&emsp;&emsp;&emsp;finally the application COFF file. Each correct answer was worth two<br>
&emsp;&emsp;&emsp;&emsp;&emsp;points. We subtracted one point for each incorrect answer or wrong order.

&emsp;&emsp;ii)  (3 points) Give a two to three sentence description of “precise exceptions”.<br>
&emsp;&emsp;&emsp;When a precise exception occurs, the Program Counter cleanly divides the<br>
&emsp;&emsp;&emsp;fully executed and non-executed instructions – there are no partially executed<br>
&emsp;&emsp;&emsp;instructions.

&emsp;&emsp;iii)  (2 points) Briefly (1-2 sentences) say why precise exceptions are nice to have.<br>
&emsp;&emsp;&emsp;With precise exceptions, there are no side effects or instructions for the<br>
&emsp;&emsp;&emsp;exception handler to undo or rollback, making the OS simpler.

Page 2/12


---

<a id="page-3"></a>
**Page 3**

CS 162 Spring 2006 Midterm #2 Exam        April 26, 2006<br>
Solutions<br>
&emsp;b. (4 points) Networking:<br>
&emsp;&emsp;i)  (2 points) The current version of IP uses 32-bit addresses. List one reason that<br>
&emsp;&emsp;&emsp;we cannot use all 232 addresses.<br>
&emsp;&emsp;&emsp;Two reasons: the hierarchical name allocation yields internal fragmentation<br>
&emsp;&emsp;&emsp;of network address space, and some of the address are reserved for private<br>
&emsp;&emsp;&emsp;networks or other purposes (e.g., x.y.z.0, 127.0.0.1, or localhost).

&emsp;&emsp;ii)  (2 points) List one reason why it would still be possible to connect more than<br>
&emsp;&emsp;&emsp;232 computers to the Internet.<br>
&emsp;&emsp;&emsp;Two reasons: Network Address Translation allows multiple computers to be<br>
&emsp;&emsp;&emsp;connected using a single IP address, and IP addresses can be time-shared<br>
&emsp;&emsp;&emsp;using the Dynamic Host Configuration Protocol.

&emsp;c. (4 points) Caching:<br>
&emsp;&emsp;i)  (2 points) What are the two types of locality exploited by caching?<br>
&emsp;&emsp;&emsp;Spatial locality and temporal locality.

&emsp;&emsp;ii)  (2 points) Which kind of locality makes large cache lines a good idea, and<br>
&emsp;&emsp;&emsp;why?<br>
&emsp;&emsp;&emsp;Spatial locality makes large cache lines a good idea because it relies on<br>
&emsp;&emsp;&emsp;memory references being to regions near each other.

Page 3/12


---

<a id="page-4"></a>
**Page 4**

CS 162 Spring 2006 Midterm #2 Exam        April 26, 2006<br>
Solutions

2\. (36 points) File Systems and Disks.<br>
&emsp;a.  (8 points) Consider a file system with 2048 byte blocks and 32-bit disk and file<br>
&emsp;&emsp;block pointers. Each file has 12 direct pointers, a singly-indirect pointer, a<br>
&emsp;&emsp;doubly-indirect pointer, and a triply-indirect pointer.<br>
&emsp;&emsp;Express your answers in symbolic form for partial credit.<br>
&emsp;&emsp;i)  (4 points) How large of a disk can this file system support?<br>
&emsp;&emsp;&emsp;232 blocks x 211 bytes/block = 243 = 8 Terabytes.

&emsp;&emsp;ii)  (4 points) What is the maximum file size?<br>
&emsp;&emsp;&emsp;There are 512 pointers per block, so: 2048 x (12 + 512 + 5122 + 5123) = 238<br>
&emsp;&emsp;&emsp;\+ 229 + 220 + 24k = 256G + 513 M + 24 K. We gave subtracted 1 point each<br>
&emsp;&emsp;&emsp;if you did not include the 2K block size, the powers of 512 for indirect<br>
&emsp;&emsp;&emsp;pointers, or the overall multiplication

&emsp;b. (12 points) Disk requests come into the disk driver for cylinders: 10, 22, 20, 2, 40,<br>
&emsp;&emsp;6, and 38, in that order. The disk head is currently positioned over cylinder 20. A<br>
&emsp;&emsp;seek takes 6 milliseconds per cylinder moved. What is the sequence of reads and<br>
&emsp;&emsp;total seek time using each of the following algorithms?<br>
&emsp;&emsp;i)  (4 points) First-come, first-served:<br>
&emsp;&emsp;&emsp;10, 22, 20, 2, 40, 6, 38<br>
&emsp;&emsp;&emsp;10 + 12 + 2 + 18 + 38 + 34 +32 = 146 cylinders = 876 milliseconds.<br>
&emsp;&emsp;&emsp;We subtracted 1 point for missing the first reference (to 20), and 1 point for<br>
&emsp;&emsp;&emsp;not writing out the sequence of accesses.

Page 4/12


---

<a id="page-5"></a>
**Page 5**

CS 162 Spring 2006 Midterm #2 Exam        April 26, 2006<br>
Solutions

&emsp;&emsp;ii)  (4 points) Shortest Seek Time First:<br>
&emsp;&emsp;&emsp;20, 22, 10, 6, 2, 38, 40<br>
&emsp;&emsp;&emsp;0 + 2 + 12 + 4 + 4 + 36 + 2 = 60 cylinders = 360 milliseconds.

&emsp;&emsp;iii)  (4 points) SCAN (initially moving upwards):<br>
&emsp;&emsp;&emsp;20, 22, 38, 40, 10, 6, 2<br>
&emsp;&emsp;&emsp;0 + 2 + 16 + 2 + 30 + 4 + 4 = 58 cylinders = 348 milliseconds.

&emsp;c. (2 points) Briefly (2-3 sentences) state the difference between a hard link and a soft<br>
&emsp;&emsp;link.<br>
&emsp;&emsp;Hard links point to the same inode, while soft links simply list a directory entry.<br>
&emsp;&emsp;Hard links use reference counting. Soft links do not and may have problems with<br>
&emsp;&emsp;dangling references if the referenced file is moved or deleted. Soft links can span<br>
&emsp;&emsp;file systems, while hard links are limited to the same file system.

&emsp;d. (7 points) Read-ahead.<br>
&emsp;&emsp;i) (3 points) Give a brief (2-3 sentences) description of read-ahead.<br>
&emsp;&emsp;Prefetching subsequent blocks on the same cylinder when a request is received.<br>
&emsp;&emsp;We subtracted 1-2 points if your answer didn’t clearly state that subsequent<br>
&emsp;&emsp;blocks were read.

&emsp;&emsp;ii) (2 points) Briefly (2-3 sentences) state why read-ahead is useful.<br>
&emsp;&emsp;An application with spatial locality will read the prefetched data (1 pt), avoiding<br>
&emsp;&emsp;rotational delay and reducing the number of I/O operations (1 pt). We subtracted<br>
&emsp;&emsp;1 point if you didn’t explicitly state that there are fewer I/O operations.

Page 5/12


---

<a id="page-6"></a>
**Page 6**

CS 162 Spring 2006 Midterm #2 Exam        April 26, 2006<br>
Solutions

&emsp;&emsp;iii) (2 points) Briefly (2-3 sentences) state what happens if you read ahead too<br>
&emsp;&emsp;&emsp;much.<br>
&emsp;&emsp;&emsp;Other normal reads can be delayed by prefetching (1 pt), and prefetched data<br>
&emsp;&emsp;&emsp;may not be used (1 pt). Also, prefetching replaces blocks in the buffer cache<br>
&emsp;&emsp;&emsp;that may be being used, and some files are not sequential, so they won’t<br>
&emsp;&emsp;&emsp;benefit from prefetching.

&emsp;e. (7 points) RAID<br>
&emsp;&emsp;i)  (3 points) Give a brief (2-3 sentences) description of RAID 5.<br>
&emsp;&emsp;Redundant Array of Inexpensive Disks level 5 stripes(1 point) blocks of data<br>
&emsp;&emsp;across at least three drives (1 point) along with an interleaved XOR-based parity<br>
&emsp;&emsp;block for each stripe set (1 point).

&emsp;&emsp;ii)  (2 points) How many disk failures can RAID 5 tolerate without losing data?<br>
&emsp;&emsp;One.

&emsp;&emsp;iii)  (2 points) How would you reconstruct a failed disk?<br>
&emsp;&emsp;&emsp;Read blocks from the other drives (1 point) and use an XOR (1 point) of their<br>
&emsp;&emsp;&emsp;blocks to reconstruct the data.

Page 6/12


---

<a id="page-7"></a>
**Page 7**

CS 162 Spring 2006 Midterm #2 Exam        April 26, 2006<br>
Solutions

No Credit – **Problem X** (000000000000 points)<br>
**The importance of**


![Figure on page 7](figures/solutions-p07-fig03.png)

**synchronization… or You're**<br>
**first – after me (This Only**<br>
**Happens in New York City).**

**Race Condition**


![Figure on page 7](figures/solutions-p07-fig04.png)

Page 7/12


---

<a id="page-8"></a>
**Page 8**

CS 162 Spring 2006 Midterm #2 Exam        April 26, 2006<br>
Solutions

3\. (23 points total) Reliable Peer-to-Peer (P2P) File Sharing.<br>
&emsp;Two computers running a P2P application using TCP/IP for connections are<br>
&emsp;connected via a router (see below). To write data packets to the network, the P2P<br>
&emsp;application issues a system call, and the OS copies the data first to a kernel buffer and<br>
&emsp;then uses DMA to copy the data to the network controller board. Immediately after<br>
&emsp;receiving the data, the controller generates one or more packets and sends them.<br>
&emsp;The packets travel one hop to router RTR, which will in turn forward the packets to<br>
&emsp;their final destination. Assume that no packets will be lost, and assume that the<br>
&emsp;processing time at the router is negligible, and a router must wait for the entire<br>
&emsp;packet to arrive before forwarding it.<br>
&emsp;The receiving network controller uses DMA to copy the data it receives to memory,<br>
&emsp;and when the last bit arrives and is transferred, it interrupts the CPU. The OS copies<br>
&emsp;the data to the P2P application’s buffer in user space. After the copy completes, the<br>
&emsp;OS sends back a one-byte acknowledgement to the sending OS. For simplicity, you<br>
&emsp;may treat acknowledgements as if they are zero bytes long. Assume that a sender uses<br>
&emsp;a send window-based acknowledgement protocol.


![Figure on page 8](figures/solutions-p08-fig05.png)

&emsp;System Parameters:<br>
&emsp;• Time to process an interrupt, Tint = 1.5 millisecond<br>
&emsp;• CPU cycle time, TCPU = 10 nanoseconds<br>
&emsp;• Packet size, Npkt = 1,000 bytes (ignore headers)<br>
&emsp;• Time to copy or DMA one byte, Tcopy = 1 microsecond<br>
&emsp;• Latency of a link, Tlink = 3 milliseconds<br>
&emsp;• Bandwidth of links, B = 8,000,000 bit/sec<br>
&emsp;• Send window Nwin = 1 packet<br>
&emsp;• Retransmission timeout, Tretran = 400 milliseconds<br>
&emsp;a.  (7 points) Compute Tpkt, the time to reliably send a single packet from a P2P<br>
&emsp;&emsp;application on computer 2 to a P2P application on computer 1 over a link with no<br>
&emsp;&emsp;losses.<br>
&emsp;&emsp;&emsp;Tpkt = (4 x Npkt x Tcopy) +  2 x Tint  +  4 x Tlink  + (8 x Npkt) / B<br>
&emsp;&emsp;&emsp;Each packet is  copied 4 times (user-level buffer to kernel buffer, kernel to<br>
&emsp;&emsp;&emsp;network card, network card to kernel, and kernel to user-level), which takes 4<br>
&emsp;&emsp;&emsp;ms (4 x Npkt x Tcopy). There are 2 interrupts (2 x Tint) for receiving the<br>
&emsp;&emsp;&emsp;packet/acknowledgement. Finally, the two-way transmission time is 14<br>
&emsp;&emsp;&emsp;milliseconds (6 ms between RTR and the sender, 1 ms each to receive the<br>
&emsp;&emsp;&emsp;packet at RTR and other host, and 6 ms between RTR and the other host) for a<br>
&emsp;&emsp;&emsp;total of 21 milliseconds per 1,000 bytes. We subtracted 1 pt each for math<br>
&emsp;&emsp;&emsp;errors and each mistake or extra term.

Page 8/12


---

<a id="page-9"></a>
**Page 9**

CS 162 Spring 2006 Midterm #2 Exam        April 26, 2006<br>
Solutions

&emsp;b.  (3 points) What is the maximum or peak rate at which one process can reliably<br>
&emsp;&emsp;send data to another process?<br>
&emsp;&emsp;&emsp;Tpkt = 21 milliseconds per 1,000 bytes. The maximum rate is N/Tpkt  = 47,619<br>
&emsp;&emsp;&emsp;byte/sec or 476,190 bit/sec.

&emsp;c. (4 points) In terms of Tpkt, how long does it take to reliably send an .mp3 file from<br>
&emsp;&emsp;computer 2 to computer 1 if the file is 4,000,000 bytes in size (assuming the links<br>
&emsp;&emsp;have no losses)?<br>
&emsp;&emsp;&emsp;4 million bytes equals 4,000 packets. So, T = (4,000 x Tpkt). At 21 milliseconds<br>
&emsp;&emsp;&emsp;per packet it will take 84 seconds.

Page 9/12


---

<a id="page-10"></a>
**Page 10**

CS 162 Spring 2006 Midterm #2 Exam        April 26, 2006<br>
Solutions

&emsp;d.  (5 points) If we use a send window of 40 outstanding packets instead, what is the<br>
&emsp;&emsp;maximum rate at which one process can reliably send data to another process<br>
&emsp;&emsp;(assuming the links have no losses)?<br>
&emsp;&emsp;&emsp;If we can have outstanding acks, then the sending rate is gated by the copying<br>
&emsp;&emsp;&emsp;overhead at the sender from user to kernel and then kernel to network card<br>
&emsp;&emsp;&emsp;(the receiver’s overhead is symmetric) = (2 x Npkt x Tcopy) or 2 milliseconds<br>
&emsp;&emsp;&emsp;per 1,000 bytes sent. This yields a peak data rate of 500,000 bytes/sec or<br>
&emsp;&emsp;&emsp;4,000,000 bit/sec. Now we need to compare the bandwidth delay product<br>
&emsp;&emsp;&emsp;using this rate to the send window, since it could be a potential bottleneck.<br>
&emsp;&emsp;&emsp;Using Tpkt  as the baseline, the bandwidth delay product is 21 milliseconds x<br>
&emsp;&emsp;&emsp;4,000,000 bit/sec or 84,000 bits. The sending window is 40 packets x 8 bits x<br>
&emsp;&emsp;&emsp;1,000 characters or 320,000 bits. So, the limiting factor is the copying<br>
&emsp;&emsp;&emsp;overhead, and not the sending window. The correct answer is 4,000,000<br>
&emsp;&emsp;&emsp;bit/sec.

&emsp;e. (4 points) If we use a send window of 40 outstanding packets instead, how long<br>
&emsp;&emsp;does it take to reliably send an .mp3 file from computer 2 to computer 1 if the file<br>
&emsp;&emsp;is 4,000,000 bytes in size (assuming the links have no losses)?<br>
&emsp;&emsp;&emsp;4 million bytes equals 4,000 packets, and at 2 milliseconds per packet it will<br>
&emsp;&emsp;&emsp;take 8 seconds. We gave partial credit for answers that were consistent with<br>
&emsp;&emsp;&emsp;part d, and subtract 1 pt each for minor errors or using Tpkt from part a. We<br>
&emsp;&emsp;&emsp;did not give credit for answers that were the same as part c.

Page 10/12


---

<a id="page-11"></a>
**Page 11**

CS 162 Spring 2006 Midterm #2 Exam        April 26, 2006<br>
Solutions

4\. (22 points total) Read-only Page Sharing.<br>
&emsp;To more efficiently use the physical memory allocated to processes, modern<br>
&emsp;operating systems share read-only pages of different running instances of the same<br>
&emsp;application (e.g., multiple Emacs processes). Your task is to implement this<br>
&emsp;functionality for Nachos – sharing of read-only COFF pages in Nachos memory.<br>
&emsp;Since we don’t have actual inodes in Nachos, it’s hard to have a real unique file<br>
&emsp;handle, so it is sufficient if your answer provides a file name.<br>
&emsp;a. (6 points) List the data structures that you would need to add to the kernel:<br>
&emsp;&emsp;We generally looked for data structures that mapped executable name to physical<br>
&emsp;&emsp;memory page number (ppn). Example: open\_execs: exec\_name-\>Coff\_Info<br>
&emsp;&emsp;object. Each Coff\_Info has file handle/process name, table mapping COFF pages<br>
&emsp;&emsp;to ppn.<br>
&emsp;&emsp;If the data structures were only partially sufficient, we subtracted 3 points.

&emsp;b. (4 points) Name all the place where would you have to update these data<br>
&emsp;&emsp;structures:<br>
&emsp;&emsp;When you page in/out COFF pages (3 pts) and when you load/unload an<br>
&emsp;&emsp;application (1 pt).

&emsp;c. (12 points) Design the function `load_coff_page()` that takes an executable<br>
&emsp;&emsp;name and virtual page number, and returns a physical page number if that COFF<br>
&emsp;&emsp;page is already in memory, or -1 if it must be loaded from disk.<br>
&emsp;&emsp;`int load_coff_page( String exec_name, int vpn ) {`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;coff\_info = open\_execs.get( exec\_name );<br>
&emsp;&emsp;&emsp;&emsp;&emsp;if (coff\_info == NULL)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;return -1;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;else<br>
&emsp;&emsp;&emsp;&emsp;&emsp;return coff\_info\[vpn\];<br>
&emsp;&emsp;}<br>
&emsp;&emsp;We subtracted 6 pts  if the answer missed a main point, 2 pts if the answer was<br>
&emsp;&emsp;inefficient, and 8 pts if the answer had major flaws.

Page 11/12


---

<a id="page-12"></a>
**Page 12**

CS 162 Spring 2006 Midterm #2 Exam        April 26, 2006<br>
Solutions

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**This page intentionally left blank**

Page 12/12

