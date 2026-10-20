# Berkeley CS162 Fall 2007: Midterm 2: Official solutions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;University of California, Berkeley<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;College of Engineering<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Computer Science Division ⎯ EECS<br>
&emsp;Fall 2007                John Kubiatowicz<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Midterm II<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;December 3rd, 2007<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS162: Operating Systems and Systems Programming


![Figure on page 1](figures/solutions-p01-fig01.png)

General Information:<br>
This is a **closed book** exam.  You are allowed 1 page of **hand-written** notes (both sides).  You<br>
have 3 hours to complete as much of the exam as possible. Make sure to read all of the questions<br>
first, as some of the questions are substantially more time consuming.<br>
Write all of your answers directly on this paper.  Make your answers as concise as possible. On<br>
programming questions, we will be looking for performance as well as correctness, so think through<br>
your answers carefully.  If there is something about the questions that you believe is open to<br>
interpretation, please ask us about it!


![Figure on page 1](figures/solutions-p01-fig02.png)

&emsp;Page 1/17


---

<a id="page-2"></a>
**Page 2**

CS 162 Fall 2007 Midterm Exam II December 3rd, 2007

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[ This page left for π \]

&emsp;&emsp;&emsp;&emsp;3.141592653589793238462643383279502884197169399375105820974944

Page 2/17


---

<a id="page-3"></a>
**Page 3**

CS 162 Fall 2007 Midterm Exam II December 3rd, 2007


### Problem 1: True/False \[20 pts\]

In the following, it is important that you EXPLAIN your answer in TWO SENTENCES OR LESS<br>
(Answers longer than this may not get credit!).  Also, answers without an explanation GET NO<br>
CREDIT.


### **Problem 1a\[2pts\]:**  The Clock Algorithm requires hardware support for a “use” bit in the PTE.


![Figure on page 3](figures/solutions-p03-fig03.png)

Explain: When a hardware use bit is not available, the PTEs can be set to invalid when<br>
they are unused, so that when the page is accessed, a trap will occur, and the operating system can set the<br>
use bit in software.


### **Problem 1b\[2pts\]:** The Aloha algorithm for broadcast networking permitted a new transmitter to

interrupt a message that was already partially transmitted.


![Figure on page 3](figures/solutions-p03-fig04.png)

&emsp;&emsp;True / False<br>
Explain: Yes, because Aloha sends blindly without checking to see if there are any ongoing<br>
communications (it relies on retransmissions after detecting garbled packets).


### **Problem 1c\[2pts\]:** Memory mapped I/O devices cannot be accessed by user-level threads.


![Figure on page 3](figures/solutions-p03-fig05.png)

Explain: Memory-mapped I/O is accomplished using load/store instructions to a special<br>
region of memory; a user-level thread can access this region if the user’s page table has a mapping for it.


### **Problem 1d\[2pts\]:**  It is possible to make Remote Procedure Calls (RPCs) with integer arguments

between clients that use big-endian integers and servers that use little-endian integers.


![Figure on page 3](figures/solutions-p03-fig06.png)

&emsp;&emsp;True / False<br>
Explain: The marshalling/unmarshalling code of RPC will automatically convert between<br>
network and host byte orders, thus accommodating any combination of host byte orders.


### **Problem 1e\[2pts\]:** A dictionary attack could be used against a publicly readable password file that

contains encrypted passwords.


![Figure on page 3](figures/solutions-p03-fig07.png)

&emsp;&emsp;True / False<br>
Explain: An attacker could encrypt every word in the dictionary and compare against the<br>
encrypted passwords stored in the publicly readable file. Note that the “encryption” used the UNIX<br>
password file acts as a one-way function.

Page 3/17


---

<a id="page-4"></a>
**Page 4**

CS 162 Fall 2007 Midterm Exam II December 3rd, 2007


### **Problem 1f\[2pts\]:** The rate of page faults in a virtual memory system can always be reduced by

adding more memory.


![Figure on page 4](figures/solutions-p04-fig08.png)

Explain: There are circumstances in which adding memory can actually increase the<br>
number of faults. Specifically: Belady’s anomaly can come into play for a FIFO replacement policy and<br>
certain access patterns.


### **Problem 1g\[2pts\]:** Compulsory misses in a cache can be reduced with prefetching.


![Figure on page 4](figures/solutions-p04-fig09.png)

&emsp;&emsp;True / False<br>
Explain: If the data is prefetched, it will already be in memory, so when that data is<br>
accessed the first time, there will not be a compulsory miss.


### **Problem 1h\[2pts\]:** A “memoryless” probability distribution provides a poor model for any real

sources of events.


![Figure on page 4](figures/solutions-p04-fig10.png)

Explain: When events from many independent sources are combined together the result<br>
can often be well approximated by a memoryless distribution—even if the individual sources are not<br>
memoryless.


### **Problem 1i\[2pts\]:** Nonvolatile Ram (NVRAM) can improve the durability of a file system that

uses delayed writes.


![Figure on page 4](figures/solutions-p04-fig11.png)

&emsp;&emsp;True / False<br>
Explain: Data that has been buffered for delayed writes can be stored in NVRAM.  If a<br>
power failure occurs before the data is written out to disk, the data can be recovered from the NVRAM.


### **Problem 1j\[2pts\]:**  Because of the 32-bit IP-V4 address space, it is impossible for more than 232

computers to communicate over the internet.


![Figure on page 4](figures/solutions-p04-fig12.png)

Explain: Network Address Translation allows a single IP address to be used by several<br>
computers.

Page 4/17


---

<a id="page-5"></a>
**Page 5**

CS 162 Fall 2007 Midterm Exam II December 3rd, 2007


### Problem 2: Virtual Memory and Paging \[25pts\]

Consider a two-level memory management scheme on 22-bit virtual addresses using the following<br>
format for virtual addresses:


![Figure on page 5](figures/solutions-p05-fig13.png)

Virtual addresses are translated into 16-bit physical addresses of the following form:


![Figure on page 5](figures/solutions-p05-fig14.png)

Page table entries are 16 bits in the following format, stored in big-endian form in memory (i.e. the<br>
MSB is first byte in memory).<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Page Table Entry (PTE)**


![Figure on page 5](figures/solutions-p05-fig15.png)

Note that a virtual-physical translation can fail at any point if an incompatible PTE is encountered.<br>
Two types of errors can occur during translation: “invalid page” (page is not mapped at all) or<br>
“access violation” (page exists, but access was illegal).


### **Problem 2a\[2pts\]:** Can you give a logical reason why the designer might have made the virtual

page # fields 7 bits each?<br>
&emsp;With a 7 bit virtual page #, the size of each page table is equal to the size of one page of memory.<br>
&emsp;27 entries/table \* 2 bytes/entry = 28 bytes/table; each page is 28 bytes.<br>
&emsp;Grading: 2 points for recognizing that a page table fits exactly in one page; no other answer accepted.


### **Problem 2b\[2pts\]:** What is the maximum amount of physical memory addressable by this system?

Can you think of a way to increase the amount of available physical memory without altering the<br>
widths of the virtual addresses or PTEs?<br>
&emsp;16-bit byte-addressed physical addresses =\> 216 bytes of physical memory is addressable.<br>
&emsp;You can use the two zero bits in the page table entry to address a larger number of physical pages (210<br>
&emsp;physical pages). You can also increase the size of pages (by increasing offset width), or add registers for<br>
&emsp;segmentation.<br>
&emsp;Grading: 1 pt. for each part.


### **Problem 3c\[2pts\]:** How many total bits of storage will each entry of the TLB consume (including

the tag and/or other fields)? Explain.<br>
&emsp;Simplest answer: TLB valid bit, 14-bit VPN, 16-bit PTE = 29 bits<br>
&emsp;Alternate: TLB valid, 14-bit VPN, 8-bit PPN (1/2 pt. each) , dirty, used, write (1/2 pt. for all 3) = 26 bits.<br>
&emsp;We ignored kernel only and uncacheable bits.<br>
&emsp;Grading: -1 if you include 8-bit offset. -1 if you stated just “extra bits.” -1/2 if you included zero bits in<br>
&emsp;the PTE. If you said 16 bits for PTE, we also required you to explicitly state TLB valid bit.

Page 5/17


---

<a id="page-6"></a>
**Page 6**

CS 162 Fall 2007 Midterm Exam II December 3rd, 2007


### **Problem 2d\[4pts\]:**  The contents of physical memory are given on the next page. Assume that the

page-table base pointer = 0x2000, and that the CPU is in user-mode. Translate the following<br>
virtual addresses. If there is an error during translation, make sure to say what the error is.  Errors<br>
can be either “invalid page” or “access violation”.  Two answers are give. Hint: be careful to look<br>
at the virtual address format!


![Figure on page 6](figures/solutions-p06-fig16.png)


![Figure on page 6](figures/solutions-p06-fig17.png)

&emsp;Grading: 1pt each, no partial credit


### **Problem 2e\[6pts\]:** Consider the same multi-level memory management scheme. Once again,

assume that the page-table base pointer = 0x2000 and that the CPU is in user-mode. Please return<br>
the results from the following load/store instructions.  Addresses are virtual. The return value for<br>
load is an 8-bit data value or an error, while the return value for a store is either “**ok**” or an error.<br>
For errors, please specify which type of error (either “invalid page” or “access violation”). When<br>
the result is not an error, indicate the new value for the PTE after the access is complete. The first<br>
two results are given:


![Figure on page 6](figures/solutions-p06-fig18.png)

&emsp;Note: keep in mind that we are accessing things at user-level.  This fact results in the “access<br>
&emsp;violation” for **Load\[0x41015\]**, for instance. Also, for **Store \[0x08310\]**, we accepted “access<br>
&emsp;violation,” which is the result if you look at the write bit in the top level page table.<br>
&emsp;Grading: ½ pt. each box for non-errors, 1 pt. each row if error.


### **Problem 2f\[2pts\]:** Suppose that there are two processes loaded on the ready queue. Process A has

page-table base pointer = 0x2000.  Process B has page-table base pointer = 0x2F00. Give the<br>
physical address of a data page that is shared read-write (RW) between processes A and B? Is this<br>
data page mapped at the same place in the virtual address spaces of the two processes?  Explain.<br>
&emsp;Page 0x51 (addresses 0x5100-0x51FF) are shared RW between the two processes.<br>
&emsp;The page is mapped at different places in the two address spaces, as they appear at different offsets into<br>
&emsp;the top level page tables.<br>
&emsp;Grading: 1 pt. for the correct page, ½ pt. for “No”, ½ pt. for explanation. Partial credit was given for<br>
&emsp;0x2800 (which is not a data page, but the second-level page table shared by the two processes.)

Page 6/17


---

<a id="page-7"></a>
**Page 7**

CS 162 Fall 2007 Midterm Exam II December 3rd, 2007

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Virtual Address Format**


![Figure on page 7](figures/solutions-p07-fig19.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Page Table Entry (PTE)**


![Figure on page 7](figures/solutions-p07-fig20.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Physical Memory**


![Figure on page 7](figures/solutions-p07-fig21.png)

Page 7/17


---

<a id="page-8"></a>
**Page 8**

CS 162 Fall 2007 Midterm Exam II December 3rd, 2007


### **Problem 2g\[4pts\]:** For the following problem, assume a hypothetical machine with 4 pages

of physical memory and 7 pages of virtual memory. Given the access pattern:<br>
&emsp;&emsp;`A B C D E F C A A F F G A B G D F F`<br>
Indicate in the following table which pages are mapped to which physical pages for each of the<br>
following policies.  Assume that a blank box matches the element to the left. We have given the<br>
FIFO policy as an example.


![Figure on page 8](figures/solutions-p08-fig22.png)

&emsp;For MIN, we accepted the final D in any of the first three pages.<br>
&emsp;Grading: 2 pts. each for MIN and LRU; -1 for each error.


### **Problem 2i\[3pts\]:** What is a precise exception and why would we want a software TLB fault to

generate a precise exception?<br>
&emsp;A precise exception is one where the state of the machine is preserved as if the program<br>
&emsp;executed up to the offending instruction. All previous instruction have completed, and the<br>
&emsp;offending instruction and all following instructions act as if they had not even started.<br>
&emsp;We would like the hardware to generate a precise exception on a software TLB fault because it<br>
&emsp;makes implementation of the fault handler easier. The fault handler simply restarts execution at<br>
&emsp;the offending instruction (easy).  It does not need to figure out the state of the system and<br>
&emsp;potentially rollback or complete execution (in software) of partially completed instructions.<br>
&emsp;Grading: 1.5 pt. for each part.

Page 8/17


---

<a id="page-9"></a>
**Page 9**

CS 162 Fall 2007 Midterm Exam II December 3rd, 2007


### Problem 3: File Systems \[20pts\]

Please keep your answers short (one or two sentences per question-mark). We may not give credit<br>
for long answers.


### **Problem 3a\[2pts\]:** What is spatial locality and which type of file access pattern exploits spatial

locality?<br>
&emsp;Spatial locality is accessing a location that is close to or next to recently accessed location.  Sequential<br>
&emsp;access of a file exploits spatial locality.<br>
&emsp;Grading: 1 point for definition and 1 point for access pattern.


### **Problem 3b\[2pts\]:** Which component of disk access time is the disk scheduling algorithm trying to

minimize?<br>
&emsp;The disk scheduling algorithm is attempting to minimize overall time wasted to moving the disk arm (i.e.<br>
&emsp;it optimizes seek time).<br>
&emsp;Grading: 2 point for seek time or 1 point for some reasonable explanation of another component.


### **Problem 3c\[3pts\]:** How does a Journaled file system improve the durability of data on disk? Give

two reasons why a journaled file system would have higher performance than a file system that<br>
forced every block to the disk immediately, while at the same time giving the same or better<br>
durability.<br>
&emsp;Journaled file systems keep a log of changes to the file system; this log is forced to disk so that if a crash<br>
&emsp;occurs the file system can recover all the transactions that haven’t been committed properly to the disk.<br>
&emsp;&emsp;1\) Since only modifications are forced to the log, the total traffic forced to disk might be a lot<br>
&emsp;&emsp;&emsp;smaller than if every modified block must be sent to disk.<br>
&emsp;&emsp;2\) The log has great spatial locality (written on a set of consecutive sectors. Consequently, it can<br>
&emsp;&emsp;&emsp;be forced to disk with little or no head  movement.<br>
&emsp;&emsp;3\) When the file system is actually updated, the scheduler can order requests for higher efficiency –<br>
&emsp;&emsp;&emsp;since the correctness depends on the log, not the order of updates to the rest of the disk.<br>
&emsp;Grading: 1 point for explanation of Journaled and 1 point each for reasons.


### **Problem 3d\[2pts\]:** Name at least two ways in which the buffer cache is used to improve

performance for file systems.<br>
&emsp;1\) Reads can be from cache instead of disk<br>
&emsp;2\) Allow delayed writes to disk, thereby permitting better disk scheduling an/or temporary files to be<br>
&emsp;&emsp;created and destroyed without even being written to disk.<br>
&emsp;3\) Used to cache kernel resources such as disk blocks and name translations

Page 9/17


---

<a id="page-10"></a>
**Page 10**

CS 162 Fall 2007 Midterm Exam II December 3rd, 2007


### **Problem 3e\[2pts\]:** The Fast File System (FFS) of Berkeley 4.2 Unix utilized “Skip Sector

Positioning” to improve performance. Explain what “Skip Sector Positioning” is and why this<br>
optimization may no longer be important.<br>
&emsp;Skip sector positioning placed successive sectors of a file on every other sector (or with multiple sectors<br>
&emsp;between). This helps to avoid the situation in which the processor must do so much work after reading<br>
&emsp;each sector that it misses the next sector and has to wait for a complete revolution. Modern disk<br>
&emsp;controllers have track buffers that  keep data from a complete track in memory, thereby eliminating the<br>
&emsp;need for sector interleaving


### **Problem 3f\[3pts\]:** The Network File System (NFS) uses a “stateless” protocol between clients and

servers. What does this mean? Name one advantage and one disadvantage of stateless filesystem<br>
protocols.<br>
&emsp;&emsp;All the requests to the NFS server are self-contained: they include all the arguments required for<br>
&emsp;&emsp;execution and do not assume that information is maintained between successive server requests.<br>
&emsp;&emsp;Advantage: Server can crash and restart transparently to the client.<br>
&emsp;&emsp;Disadvantage: Cannot track which clients are caching data, thus making it difficult to get clean<br>
&emsp;&emsp;caching semantics.<br>
&emsp;&emsp;Grading: 1 point for explanation, 1 for advantage and 1 for disadvantage.


### **Problem 3j\[6pts\]:** Suppose that a new disk technology provided access times that are of the same

order of magnitude as memory access times.  What, if anything, must be changed in the following<br>
three OS components to take advantage of the quicker access time?  If something doesn’t change,<br>
be very specific why it doesn’t change.  If it will change, contrast these changes with current<br>
implementation and be as specific as possible in your answers (i.e. identify what would change and<br>
why).<br>
&emsp;1\. **Process Scheduler**<br>
&emsp;&emsp;Scheduler deals with processes at task level with arrival and run times so while run time might<br>
&emsp;&emsp;change the scheduler does not need change.<br>
&emsp;2\. **Memory Management**<br>
&emsp;&emsp;Write through instead of write back since it’s cheaper to go to disk.  Less need to prefetch and<br>
&emsp;&emsp;instead save on the cost of getting unused memory location.  Do more on-demand paging instead of<br>
&emsp;&emsp;having to rely on predicting access pattern and missing.  Mainly, allows memory management to<br>
&emsp;&emsp;balance hit cost and miss cost instead of focusing on increasing hit rates only.<br>
&emsp;**3. Device Driver for the new disk**<br>
&emsp;&emsp;Use polling instead of interrupt for new disk device driver since it will be in heavy use due to lower<br>
&emsp;&emsp;access.  Or no change to the structure of the device driver from OS point of view.<br>
Grading: 2 points for good reasoning for change or no change with some modification if there is a change.<br>
1.5 points for good explanation of the choice to modify or not.  1 point for incomplete reasoning but in the<br>
right direction.

Page 10/17


---

<a id="page-11"></a>
**Page 11**

CS 162 Fall 2007 Midterm Exam II December 3rd, 2007

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**\[ This page intentionally left blank \]**

Page 11/17


---

<a id="page-12"></a>
**Page 12**


![Figure on page 12](figures/solutions-p12-fig23.png)

CS 162 Fall 2007 Midterm Exam II December 3rd, 2007


### Problem 4: Network File Server \[35 pts\]


![Figure on page 12](figures/solutions-p12-fig24.png)

&emsp;The above figure illustrates a network in which one client interacts with a server to display<br>
video files. Each link is characterized by its Bandwidth, one-way Latency (for the first bit to arrive),<br>
and Maximum Transfer Unit (MTU) in bytes. All links are full-duplex (can handle traffic in both<br>
directions at full bandwidth). Each router is highly pipelined and will start forwarding a packet to<br>
an output port 1ms after it receives the first bit of the packet.  Assume that no packets will be lost.<br>
&emsp;Both the video player (on the client) and file server run at user level.  To display a video, the<br>
client opens a TCP connection to the server, sends multiple requests, then waits for the response.<br>
Assume that the time to setup the connection is negligible relative to the overall viewing time.<br>
&emsp;To send data over the network, a user-level process issues a write system call on a socket.  The<br>
OS will copy the data to a kernel buffer (inside the socket). Then, the TCP routines generate<br>
headers (by copying them from templates) and use DMA to copy the completed packet to the<br>
network controller. Immediately after receiving all of the data for a packet, the network controller<br>
sends it. Afterwards, it generates an interrupt (one per packet).<br>
&emsp;At the destination, the network controller DMAs the packet to memory, then interrupts the<br>
CPU. Subsequently, the TCP routines transmit an acknowledgement (ACK) back to the sender. For<br>
simplicity, you may treat ACKs as if they are zero bytes long. After sending an ACK, the OS copies<br>
the received data into user-level buffer of the receiving user-level process.<br>
&emsp;A user-level process reads data from the disk by executing a read() system call with a user-level<br>
buffer for the results. The OS splits read requests into chunks that consist of sequential blocks on<br>
the same track and that are 16 blocks or less in size.  It queues requests in the device driver request<br>
queue (DDRQ). Whenever the disk controller finishes reading a chunk of data into kernel memory,<br>
the controller generates an interrupt, causing the OS to dequeue the next request from the DDQ.<br>
The OS then copies data from kernel memory into the user’s buffer and returns from read().

Page 12/17


---

<a id="page-13"></a>
**Page 13**

CS 162 Fall 2007 Midterm Exam II December 3rd, 2007


### **Problem 4a\[3pts\]:** What is the maximum amount of data that the client or server can send in each

packet while avoiding fragmentation along the way?  Remember that the TCP+IP header is 40<br>
bytes. Explain.<br>
&emsp;&emsp;Since the minimum MTU along the path is 296, and the header is 40 bytes, the maximum amount of<br>
&emsp;&emsp;data that the client or server can send in each packet is 296-40 = 256 bytes.<br>
&emsp;&emsp;Grading:1pt for minimum  MTU, 1 pt for subtracting header, 1 for some explanation


### **Problem 4b\[2pts\]:** Explain how the client or server could automatically discover the answer to 4a:

&emsp;&emsp;The sending end starts with large packets with the “no fragment” flag set in the header and slowly<br>
&emsp;&emsp;reduces the size until packets start making it through without being dropped.<br>
&emsp;&emsp;Grading: 1 pt for plausible endpoint-generated query, 1 pt for mentioning no frag bit


### **Problem 4c\[2pts\]:** Under ideal circumstances (and ignoring interrupt and copying overheads and

window sizes), what is the maximum data bandwidth that could be sent from the server to the client<br>
without dropping packets, assuming that the server utilizes the mechanism in 4b? Explain.<br>
&emsp;&emsp;Assuming that we use the maximum packet size from 4a (i.e. 296) which contains 256 bytes of data<br>
&emsp;&emsp;in it, we can compute the fraction of the 3.7 Mbps that we have in the middle link as:  3.7 Mbps μ<br>
&emsp;&emsp;(256/296) = 3.2 Mbps<br>
&emsp;&emsp;Grading: 1pt identifying bottleneck bandwidth, 1 pt for scaling by correct fraction


### **Problem 4d\[3pts\]:** Assume that a maximal sized packet (as in 4a) is sent from the TCP send buffer

of the server to the TCP receive buffer of the client. Compute the total roundtrip latency from the<br>
point at which the server invokes the device driver to send the packet until it receive the ACK via<br>
an interrupt. Hint: don’t forget the interrupt at the receiving side and the DMA mechanism into and<br>
out of the network.<br>
&emsp;Note that the fact that the router is pipelined (see description above) implies that the router begins<br>
&emsp;routing toward the output port even before it has received the complete packet.  This simplifies things so<br>
&emsp;that we only have to track latencies of packets through the router as 1ms. At the receiving side, we<br>
&emsp;technically need to wait for the packet to be completely received before we start DMAing it into kernel<br>
&emsp;memory.<br>
&emsp;Also, we said that the ACK is zero length.  If this is truly zero, then there is no header<br>
&emsp;generation/transmission latency.  Otherwise, we need to generate headers. There are two different<br>
&emsp;options here: Ack latency (zero) or Ack latency (header) here.<br>
&emsp;We translate to ms here. 10ns=10-5ms, 10μ = 10-2ms. 1Gps=1012bits/ms 100Mbps=1011bits/ms<br>
&emsp;Message latency =    \[Genheader+DMAkernel→network\]+\[Link2+Route2+Linkmiddle+Route1+Link1\]+<br>
\[Receiveserver+DMAnetwork→kernel+Intmessage\]<br>
=(40μ10-5ms+296μ10-5ms\] + \[1ms+1ms+96ms+1ms+1ms\]+<br>
\[(296μ8 bits)/(1011bits/ms)+296μ10-5ms+10-2ms\]  ≅ 100.02ms<br>
&emsp;Ack latency (zero) =    \[Link2+Route2+Linkmiddle+Route1+Link1\]+Intack = 100.01 ms<br>
&emsp;Ack latency(header)= \[Genheader+DMAkernel→network\]+Ack latency(zero)+<br>
\[Receiveclient+DMAnetwork→kernel\]<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;=\[40μ10-5ms+40μ10-5ms\]+100.01ms+<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[(40μ8)/(1012bits/ms)+40μ10-5ms\] ≅ 100.01ms<br>
&emsp;Total Answer ≅ 200.03ms<br>
&emsp;Grading: 1 point on right track, -2 for missing all network components, -1 point for missing components<br>
&emsp;of basic 200ms roundtrip, -½ for missing DMAs, -½ for missing ints, -½  for interrupt on send (not in<br>
&emsp;critical path), -½ for copy into kernel (already in TCP buffer), -½ math error

Page 13/17


---

<a id="page-14"></a>
**Page 14**

CS 162 Fall 2007 Midterm Exam II December 3rd, 2007


### **Problem 4e\[3pts\]:** What TCP window size is necessary to achieve the bandwidth of 4c without

dropping packets in the network? Use simple constants and values that you computed for 4a-4d.<br>
Explain.  Make sure that you correct for units.<br>
&emsp;&emsp;What is needed here is the bandwidth-latency product, where the latency is the roundtrip latency.<br>
&emsp;&emsp;The result will be the total amount of data that needs to be “in the network” before reception of the<br>
&emsp;&emsp;first ACK. Here, the window size is in data bytes (not including header) so, we use the data<br>
&emsp;&emsp;bandwidth, not total bandwidth.  Also, we must correct for the fact that (4d) was computed in ms.<br>
&emsp;&emsp;Notice how all of the units cancel out properly! (we want bytes)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Window size  ≅ (4c)μ(4d)μ(10-3s/ms) / (8bits/byte)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;≅ (3.2μ106bit/s)μ(200.03ms)μ (10-3s/ms)μ (0.125 bytes/bit)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;≅ 80012 bytes<br>
&emsp;&emsp;Grading: -1 use incorrect bandwidth (unless consistent with 4c), -1 missed converting bits to bytes<br>
&emsp;&emsp;(unless give answer with units of “b,” which means bits, -1 for not following directions (using only<br>
&emsp;&emsp;values from 4a through 4d or simple constants).


### **Problem 4f\[6pts\]:** Suppose that video files are laid out in 64K (65536 bytes) chunks on the disk

(i.e. 64K in successive sectors on a track). Compute the overhead for reading such a 64K chunk<br>
from a random place on the disk.  Assume that the disk controller automatically DMAs the data to<br>
kernel memory in a fashion that is overlapped with reading it from the disk (so that you do not have<br>
to worry about DMA for this operation). After finishing, the controller generates an interrupt; the<br>
interrupt routine may submit another request to the controller (if one is queued on the DDRQ).<br>
Assume the disk parameters given above (repeated here):<br>
&emsp;• 750GB in size<br>
&emsp;• 10000 RPM, Data transfer rate of 50 Mbytes/s (50 × 106 bytes/sec)<br>
&emsp;• Average seek time of 4ms<br>
&emsp;• ATA Controller with 1ms controller initiation time<br>
&emsp;• A block size of 4Kbytes (4096 bytes)<br>
What is the total time to read 64K chunk from a random place on the disk into memory including<br>
the interrupt? Hint: there are 5 terms here including the interrupt!<br>
Timeserver = Timecontroller+Timeseek+Timerotate+Timetransfer+TimeInt<br>
= 1ms + 4ms +<br>
&emsp;&emsp;&emsp;&emsp;&emsp;½ \[ 60 s/min μ 1000 ms/s / 10000 rev/min \] +<br>
&emsp;&emsp;&emsp;&emsp;&emsp;65536 bytes / \[(50 × 106 bytes/sec) μ 0.001 sec/ms\] + 0.01 ms<br>
&emsp;&emsp;&emsp;&emsp;&emsp;= 8.01ms + 1.31ms = 9.32ms<br>
&emsp;&emsp;Grading: 1 pt for each of 5 terms, 1 pt for calculation (can lose if have a unit conversion problem,<br>
&emsp;&emsp;like forgetting to convert from sec to ms or something similar, other reasons).

Page 14/17


---

<a id="page-15"></a>
**Page 15**

CS 162 Fall 2007 Midterm Exam II December 3rd, 2007


### **Problem 4g\[3pts\]:** Now, assume that the video player works by sending requests for 64KB

(=65536 bytes) at a time to the video server.  Assuming that these requests are pipelined for<br>
maximum bandwidth, at what rate must it send these requests to achieve the bandwidth of 4c?<br>
Numreq/client = **(**3.2 μ 106 bits / sec μ 0.125 bytes/bit ) / 65536 bytes/req = 6.1 req/sec<br>
&emsp;&emsp;Grading: 1 pt if mostly on track, -1 pt for forgetting bits/byte conversion, -1 pt neglecting to use<br>
&emsp;&emsp;value from 4c.


### **Problem 4h\[4pts\]:** Compute the total processor overhead for satisfying a 64K request at the server.

Processor overhead includes (1) interrupts, (2) header generation overhead and (3) copying<br>
overhead.  Note that generating a byte of header is as expensive as copying.   Processor overhead<br>
does not include DMA or disk controller actions since these are overlapped with the CPU.  The data<br>
portion of a request message is 16 bytes.<br>
&emsp;We translate to ms here. 10ns=10-5ms, 10μ = 10-2ms. 1Gps=1012bits/ms 100Mbps=1011bits/ms<br>
&emsp;Overhead =  Request\[ Intrequest+Copyrequest\] +Disk\[Intdisk +Copyfilesystem→user\]+<br>
&emsp;Send\[Copyuser→socket + 256 μ Genheader +256μIntnetwork \]+ Acks\[256μIntnetwork\]<br>
=  Request\[10-2 + 16 μ 10-5 \] + Disk\[ 10-2 + 65536 μ 10-5\] +<br>
Send\[ 65536 μ 10-5 + 256 μ (40 μ 10-5) + 256μ10-2 \] +Acks \[256μ10-2 \]<br>
= 0.01016ms + 0.75536ms + 3.31776ms + 2.56ms = 6.6438ms ≅ 6.64ms<br>
&emsp;Since TCP might generate less than one ack/packet,  we can say that the result is at least \> 4.08ms (the<br>
&emsp;above number without the ACK interrupt term of 2.56ms).<br>
&emsp;Note: We don’t include the interrupt/header generation for the Ack to the request because Acks will<br>
&emsp;likely ride the data packets going back to the client.  We didn’t take off points if you included these.<br>
&emsp;Grading: we didn’t require the ack interrupts, although they are technically overhead. Roughly, we gave<br>
&emsp;1 point for Request overhead, 1 pt for Disk overhead (especially copy from kerne→user), 2 points for<br>
&emsp;Send, divided into 1 point for user→ kernel copy for send and 1 point for packet generation of headers<br>
&emsp;and packet interrupts.


### **Problem 4i\[4pts\]:** Suppose that we wanted to handle 300 clients each at a request rate as given in

(4g).  Assume that multiple clients connect through network resources that are independent up to<br>
router #2. Each client would have its own user-level process working on its behalf. How many disks<br>
would we need to handle this rate? What else would need to be upgraded to handle this rate?<br>
&emsp;Number of requests / sec that disk can handle: (1000 ms / s) / (9.32 ms / req) = 107.3 req/s<br>
&emsp;Number of clients/disk = (107.3 req/sec) / (6.1 req/s/client) = 17.6 clients<br>
&emsp;300 clients / 17.6 clients/disk = 17.05 disks ⇒ we need 18 disks to meet the full demand.<br>
&emsp;Would need to upgrade network:<br>
&emsp;300 clients μ 3.7 Mbps/client = 1.11μ109 bps \> 1Gbps!<br>
&emsp;Would need to upgrade processor:<br>
&emsp;&emsp;Since overhead/req = 6.64ms, 300clients μ 6.1req/client = 18300 req/s<br>
&emsp;&emsp;&emsp;&emsp;⇒ request rate would require .00664 μ 18300 = 121sec of processor time / sec!<br>
&emsp;Grading : 3 points for computing number of disks, 1 point for pointing out and justifying one upgrade.<br>
&emsp;-1 pt for wrong disk BW (like simply using 50MBps) ; -1pt for computation error ;<br>
&emsp;-½ point for naming an upgrade without giving justification ; Also, a couple of people said that<br>
&emsp;memory would need to be upgraded, however, the memory requirements of this application are<br>
&emsp;minimal – and you would have no way to know how much memory was there to start with.

Page 15/17


---

<a id="page-16"></a>
**Page 16**

CS 162 Fall 2007 Midterm Exam II December 3rd, 2007


### **Problem 4j\[5pts\]:** Returning to our single-disk server, assume that 15 clients connect through

&emsp;network resources that are independent up to router #2.  Each client has its own user-level<br>
&emsp;process working on its behalf. Assume that all 15 clients send requests at a rate of (4g). If the<br>
&emsp;disk response distribution can be described with C=1.5 and the aggregate network request rate<br>
&emsp;can be described as exponential, what is the average length of  the disk device driver request<br>
&emsp;queue (DDRQ)?  Hint: the service time for the disk is the time between requests to the disk<br>
&emsp;controller when the DDRQ is full. Possibly useful formulas include:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1   1<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;∑=∑=   (   )<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;=−=n   n   2<br>
&emsp;&emsp;TVariance:     TTMean Service: σ2   T<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;iserveri   server<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;nni   1   i   1<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1Cu⎞⎛⎛+   ⎞<br>
&emsp;&emsp;TT⎜⎟⎜⎟M/G/1 queue: =××   Little’s law:  Lq=λ × Tq<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;21u⎝⎠⎝qserver   −   ⎠

Solution: The important thing about solving this problem is figuring out what equations to<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;use and which numbers to plug in. Since we are looking at the DDRQ queue, the<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;service time is the time for one chunk (64KB) to be grabbed from the disk and to<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;generate an interrupt. This service time is exactly what we computed in (4f). The<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;processor overhead from (4h) is overlapped with these hardware-generated<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;numbers, so is not included.  Note that we can get average service time directly<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;from (4f), so don’t need to use the formula for “Mean Service” given above.<br>
The arrival rate (λ) includes 15 clients worth of requests, so is the result of<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;multiplying (4g) by 15.<br>
λ = Numclients μ Numreq/client = 15 × (4g) = 15 x 6.1req/sec = 91.5req/sec<br>
Timeserver = (4f) = 9.32ms/req (overhead from 4h is overlapped and not counted)<br>
u  = l μ Timeserver<br>
&emsp;&emsp;&emsp;&emsp;&emsp;= 91.5req/sec μ 9.32ms/req μ 0.001 s/ms ≅  0.853 (No UNITs!)<br>
Tq = (9.32ms/req μ 0.001s/ms) μ ½(1+1.5)μ\[0.853/(1-0.853)\]<br>
= 0.0676<br>
Lq = (15μ6.1)μ 0.0676 = 6.1854<br>
⇒ Average queue length = 6.1854

&emsp;&emsp;Grading: 1 point for identifying formulas that get you all the way to the answer; 1pt for λ;<br>
&emsp;&emsp;1pt for u; 1pt for Timeserver; 1 point for calculation.<br>
&emsp;&emsp;Note that we gave you credit for using numbers that you computed previously, even if they<br>
&emsp;&emsp;were incorrect. However, we gave -1pt if you computed a value for u that was \> 1 but didn’t<br>
&emsp;&emsp;say anything about it (i.e.  didn’t point out that you must have made a mistake).<br>
&emsp;&emsp;Also, you could use -1pt for failing to correct for units (i.e. ms/s etc).

Page 16/17


---

<a id="page-17"></a>
**Page 17**

CS 162 Fall 2007 Midterm Exam II December 3rd, 2007

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**\[ Scratch Page (feel free to remove) \]**

Page 17/17

