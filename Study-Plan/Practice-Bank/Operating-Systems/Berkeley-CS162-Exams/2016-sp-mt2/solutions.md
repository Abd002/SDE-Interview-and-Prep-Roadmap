# Berkeley CS162 Spring 2016: Midterm 2: Official solutions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;University of California, Berkeley<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;College of Engineering<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Computer Science Division – EECS<br>
Spring 2016                                 Anthony D. Joseph<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Midterm Exam #2 Solutions**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;April 20, 2016<br>
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

Page 1/14


---

<a id="page-2"></a>
**Page 2**

CS 162 Spring 2016 Midterm Exam #2        April 20, 2016<br>
**Solutions NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**<br>
1\. (12 points total) True/False and Why? **CIRCLE YOUR ANSWER AND WRITE**<br>
&emsp;**AN EXPLANATION (no credit will be given if no explanation is provided).**<br>
&emsp;a. In addition to greatly reducing the overall failure probability, moving from a single<br>
&emsp;&emsp;hard drive to using RAID 1 (mirroring) can also increase the throughput of small<br>
&emsp;&emsp;random reads.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**Why?**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**TRUE**. The small reads need only be sent to a single disk, so in theory, a<br>
&emsp;&emsp;&emsp;&emsp;&emsp;RAID-1 system can double small random read throughput. The correct<br>
&emsp;&emsp;&emsp;&emsp;&emsp;answer was worth 2 points and the justification was worth an additional 2<br>
&emsp;&emsp;&emsp;&emsp;&emsp;points.

&emsp;b. The TCP transport protocol provides a reliable, in-order bytestream abstraction.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**Why?**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**TRUE**. These are exactly the characteristics of TCP. The correct answer<br>
&emsp;&emsp;&emsp;&emsp;&emsp;was worth 1 point and the justification was worth an additional 2 points.

Page 2/14


---

<a id="page-3"></a>
**Page 3**

CS 162 Spring 2016 Midterm Exam #2        April 20, 2016<br>
**Solutions NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**<br>
&emsp;c. The Byzantine failure model allows arbitrary behavior by a faulty system<br>
&emsp;&emsp;component.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**Why?**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**TRUE**. That is the definition of the model. The correct answer was worth<br>
&emsp;&emsp;&emsp;&emsp;&emsp;2 point and the justification was worth an additional 2 points.

&emsp;d. Remote Procedure Calls provide identical semantics to local calls.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**Why?**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**FALSE**. RPCs can suffer from network/server failures, so the users need<br>
&emsp;&emsp;&emsp;&emsp;&emsp;to deal with this difference. The correct answer was worth 2 points and the<br>
&emsp;&emsp;&emsp;&emsp;&emsp;justification was worth an additional 2 points.

Page 3/14


---

<a id="page-4"></a>
**Page 4**

CS 162 Spring 2016 Midterm Exam #2        April 20, 2016<br>
**Solutions NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**<br>
2\. (26 points total) Memory and I/O.<br>
&emsp;a. (12 points) For each statement, **CIRCLE** the address translation scheme(s) for<br>
&emsp;&emsp;which the statement is true.<br>
&emsp;&emsp;i) (4 points) A process cannot directly read or write another process’ memory.<br>
&emsp;&emsp;&emsp;Assume there is no mmap() operation.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;No translation<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Base and Bound<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Segmentation<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Paging<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**Base and Bound, Segmentation,** and **Paging**.

&emsp;&emsp;ii) (4 points) External fragmentation may occur.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;No translation<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Base and Bound<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Segmentation<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Paging<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**Base and Bound** and **Segmentation**.

Page 4/14


---

<a id="page-5"></a>
**Page 5**

CS 162 Spring 2016 Midterm Exam #2        April 20, 2016<br>
**Solutions NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**<br>
&emsp;&emsp;iii) (4 points) Part of the process’ stack could be swapped out to disk while the<br>
&emsp;&emsp;&emsp;process continues to execute using the rest of the stack. Assume the stack is<br>
&emsp;&emsp;&emsp;located in a typical location for the type of address translation in use.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;No translation<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Base and Bound<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Segmentation<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Paging<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**Paging**<br>
&emsp;b. (10 points) Consider a system with the following specifications:<br>
&emsp;&emsp;• 46-bit virtual address space<br>
&emsp;&emsp;• Page size of 8 KBytes<br>
&emsp;&emsp;• Page table entry size of 4 Bytes<br>
&emsp;&emsp;• Every page table is required to fit into a single page<br>
&emsp;&emsp;How many levels of page tables would be required to map the entire virtual<br>
&emsp;&emsp;address space?<br>
&emsp;&emsp;In the space below, document the format of a virtual address under this translation<br>
&emsp;&emsp;scheme. Briefly explain your rationale.<br>
&emsp;&emsp;A 1-page page table contains 2,048 or 211 PTEs (22 \*211 = 213 bytes), pointing to<br>
&emsp;&emsp;211 pages (addressing a total of 211 \* 213 = 224 bytes). Adding a second level<br>
&emsp;&emsp;yields another 211 pages of page tables, addressing 211 \* 211 \* 213 = 235 bytes.<br>
&emsp;&emsp;Adding a third level yields another 211 pages of page tables, addressing 211 \* 211 \*<br>
&emsp;&emsp;211 \* 213 = 246 bytes. So, we need **3 levels**.<br>
&emsp;&emsp;The correct answer is worth 3 pts. Correct reasoning is worth up to 7 pts (2 pts<br>
&emsp;&emsp;for identifying that there are 211 PTEs per page, 2 pts for describing how page<br>
&emsp;&emsp;tables are nested, and 3 pts based upon the quality of the argument):<br>
&emsp;&emsp;&emsp;&emsp;&emsp;11 bit page    11 bit page    11 bit page    13 bit offset

Page 5/14


---

<a id="page-6"></a>
**Page 6**

CS 162 Spring 2016 Midterm Exam #2        April 20, 2016<br>
**Solutions NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

&emsp;c. (4 points) Briefly explain, in four sentences or less, what is DMA **and** why DMA<br>
&emsp;&emsp;enables a system to more efficiently handle I/O devices.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;With DMA, the CPU does not have to be involved in the transfer of each<br>
&emsp;&emsp;&emsp;&emsp;&emsp;byte or word. It is only involved in the set up of the transfer.

Page 6/14


---

<a id="page-7"></a>
**Page 7**

&emsp;CS 162 Spring 2016 Midterm Exam #2        April 20, 2016<br>
&emsp;**Solutions NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**<br>
&emsp;3\.  (24 points total) Demand Paging.<br>
&emsp;&emsp;&emsp;a. (18 points) Consider a demand paging system with 3 pages of physical memory.<br>
&emsp;&emsp;&emsp;&emsp;When a page fault occurs, we use a page replacement algorithm to make space<br>
&emsp;&emsp;&emsp;&emsp;for the new page by evicting a page from memory. Using the FIFO, Clock<br>
&emsp;&emsp;&emsp;&emsp;Algorithm, and LRU page replacement algorithms, mark which pages will be in<br>
&emsp;&emsp;&emsp;&emsp;physical memory **after** each page request. The first 3 rows for each algorithm are<br>
&emsp;&emsp;&emsp;&emsp;pre-filled for you. For the clock algorithm, on a page fault the clock hand<br>
&emsp;&emsp;&emsp;&emsp;advances before performing any checks or actions.


![Figure on page 7](figures/solutions-p07-fig03.png)

&emsp;Page 7/14


---

<a id="page-8"></a>
**Page 8**

CS 162 Spring 2016 Midterm Exam #2        April 20, 2016<br>
**Solutions NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

&emsp;b. (4 points) When a page fault occurs and a page is evicted, what entries in which<br>
&emsp;&emsp;data structures must the OS invalidate?<br>
&emsp;&emsp;When a page fault occurs, the OS must invalidate the TLB entry and page table<br>
&emsp;&emsp;entry corresponding to the evicted page.

&emsp;c. (2 points) In the Nth chance page replacement algorithm, explain the purpose of the<br>
&emsp;&emsp;parameter N. Consider the effects of a small or large N.<br>
&emsp;&emsp;N enables the OS to approximate the behavior of an LRU algorithm by tracking<br>
&emsp;&emsp;approximately how long a page it is since a page was last referenced. A larger<br>
&emsp;&emsp;value of N will enable a more finer grain approximation of LRU.

Page 8/14


---

<a id="page-9"></a>
**Page 9**

CS 162 Spring 2016 Midterm Exam #2        April 20, 2016<br>
**Solutions NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**<br>
4\.  (22 points total) Disks and File Systems.<br>
&emsp;a. (6 points) Name two performance-improving features that are provided by modern<br>
&emsp;&emsp;disk controllers. For each of the features you name, briefly explain the benefits<br>
&emsp;&emsp;and consequences of a disk controller that does not provide that feature.<br>
&emsp;&emsp;i) Feature #1 – Benefits and consequences if it is not provided:<br>
&emsp;&emsp;&emsp;We decided to grade this question more leniently by interpreting<br>
&emsp;&emsp;&emsp;‘performance’ to be techniques/features that improve the performance of disk<br>
&emsp;&emsp;&emsp;operations OR reduce the complexity of the OS. Note that we did not accept<br>
&emsp;&emsp;&emsp;SMR as an answer because it somewhat reduces the performance of reads<br>
&emsp;&emsp;&emsp;(due to the high degree of ECC required) and it significantly reduces the<br>
&emsp;&emsp;&emsp;performance of writes (due to the need to write an entire shingled region<br>
&emsp;&emsp;&emsp;when writing a single block).<br>
&emsp;&emsp;&emsp;• Track buffer – Reads an entire track when a sector is requested. Pro:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;makes sequential reads faster. Con: without it OS has to implement read<br>
&emsp;&emsp;&emsp;&emsp;&emsp;ahead. Note that we did not accept answers that confused the OS buffer<br>
&emsp;&emsp;&emsp;&emsp;&emsp;cache with a disk track buffer.<br>
&emsp;&emsp;&emsp;• TRIM for SSD. Pro: improves performance of writes. Con: slow writes<br>
&emsp;&emsp;&emsp;&emsp;&emsp;due to need to erase before writing<br>
&emsp;&emsp;&emsp;• ECC for HDDs. Pro: can recover data from failing sector. Con: data loss<br>
&emsp;&emsp;&emsp;• Disk scheduling. Pro: higher performance due to reduced seek/rotational<br>
&emsp;&emsp;&emsp;&emsp;&emsp;latencies. Con: more seek/rotational latency overhead<br>
&emsp;&emsp;&emsp;• DMA support. Pro: higher performance due to reduced CPU overhead.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Con: higher CPU overhead.<br>
&emsp;&emsp;&emsp;• Sector interleaving/spanning or track skewing. Pro: higher performance<br>
&emsp;&emsp;&emsp;&emsp;&emsp;for sequential access due to reduced rotational latencies. Con: higher<br>
&emsp;&emsp;&emsp;&emsp;&emsp;rotational latencies.<br>
&emsp;&emsp;&emsp;• Remapping of defective sectors/slip sparing. Pro: enables Logical Block<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Addressing so the OS can view the disk as a linear sequence of blocks.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Con: without it OS, would have to manually keep track of failed sectors<br>
&emsp;&emsp;&emsp;&emsp;&emsp;and the locations of alternate sectors.<br>
&emsp;&emsp;&emsp;• Accelerometer for protection against drops. Pro: helps reduce damage by<br>
&emsp;&emsp;&emsp;&emsp;&emsp;moving head to spare track upon detection of a fall. Con: Damage to<br>
&emsp;&emsp;&emsp;&emsp;&emsp;HDD.<br>
&emsp;&emsp;&emsp;• RAID. Pro: helps protect against disk failure. Con: disk failure causes<br>
&emsp;&emsp;&emsp;&emsp;&emsp;data loss<br>
&emsp;&emsp;&emsp;• Disk buffers for writes. Pro: faster writes. Con: slower writes

&emsp;&emsp;ii) Feature #2 – Benefits and consequences if it is not provided:<br>
&emsp;&emsp;&emsp;See above.

Page 9/14


---

<a id="page-10"></a>
**Page 10**

CS 162 Spring 2016 Midterm Exam #2        April 20, 2016<br>
**Solutions NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

&emsp;b. (5 points) If a disk subsystem receives an average of 10 requests per second and<br>
&emsp;&emsp;each request has an average response time of 500ms, how many requests are in<br>
&emsp;&emsp;the subsystem on average? Explain your answer.<br>
&emsp;&emsp;&emsp;5\. We can apply Little’s Law: L = λW, where λ is the average arrival rate (10<br>
&emsp;&emsp;&emsp;requests per second) and W is the average response time (1/2 a second)

&emsp;c. (4 points) The FAT file system eliminates external fragmentation by allocating disk<br>
&emsp;&emsp;space in block-sized units. Considering that fact, briefly explain why<br>
&emsp;&emsp;defragmentation is still sometimes necessary.<br>
&emsp;&emsp;&emsp;The disk blocks allocated to a file may be scattered across the disk.

Page 10/14


---

<a id="page-11"></a>
**Page 11**

CS 162 Spring 2016 Midterm Exam #2        April 20, 2016<br>
**Solutions NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**<br>
&emsp;d. (3 points) In the UNIX 4.2 BSD FFS, inodes have direct pointers, a singly indirect<br>
&emsp;&emsp;pointer, a doubly indirect pointer, and a triply indirect pointer. The maximum file<br>
&emsp;&emsp;size supported by this inode type is approximately the same as the maximum file<br>
&emsp;&emsp;size supported by an inode with only a triply indirect pointer. Briefly explain one<br>
&emsp;&emsp;disadvantage of an inode design that only uses a triply indirect pointer instead of a<br>
&emsp;&emsp;combination of pointers (other than the slightly reduced maximum file size).<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Every file access would require four additional disk reads.

&emsp;e. (4 points) Briefly, in one to three sentences, explain the purpose of the journal in a<br>
&emsp;&emsp;journaling file system?<br>
&emsp;&emsp;&emsp;The journal is used to store the intentions of the OS when making changes to<br>
&emsp;&emsp;&emsp;the file system structures (and the data in a full journaling file system). During<br>
&emsp;&emsp;&emsp;boot, the journal is used to redo(or complete) any incomplete operations<br>
&emsp;&emsp;&emsp;(operations that were in-progress at the time of an OS crash or power<br>
&emsp;&emsp;&emsp;failure).

Page 11/14


---

<a id="page-12"></a>
**Page 12**

CS 162 Spring 2016 Midterm Exam #2        April 20, 2016<br>
**Solutions NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**<br>
5\.  (16 points total) Pintos coding question: Verifying user pointers.<br>
&emsp;Your project group is tasked with implementing a new syscall for Pintos. This syscall<br>
&emsp;takes a linked list as one of its arguments, and your responsibility is to create a<br>
&emsp;function that checks the validity of the linked list, so the syscall handler can safely<br>
&emsp;dereference it. The value of head may be NULL, if the list is empty. This is function<br>
&emsp;signature of your syscall:

&emsp;&emsp;void	  foo(struct	  node	  \*head);<br>
&emsp;&emsp;We have also defined the structure of the node struct, as well as<br>
&emsp;&emsp;exit\_thread\_if\_invalid(), a function that will verify the validity of user-<br>
&emsp;&emsp;specified pointers.

&emsp;&emsp;struct	  node<br>
&emsp;&emsp;{<br>
&emsp;&emsp;int	  number;<br>
&emsp;&emsp;char	  buffer\[16\];<br>
&emsp;&emsp;struct	  node	  \*next;<br>
&emsp;&emsp;//	  If	  this	  is	  the	  last	  node,	  next	  =	  NULL<br>
&emsp;&emsp;};

&emsp;&emsp;/\*	  Checks	  that	  P	  to	  P+SIZE-­‐1	  is	  a	  valid	  user	  buffer.<br>
&emsp;&emsp;Kills	  the	  current	  thread	  if	  it	  is	  invalid.	  \*/<br>
&emsp;&emsp;void	  exit\_thread\_if\_invalid(void	  \*p,	  size\_t	  size);

&emsp;&emsp;uint32\_t	  SYS\_FOO	  =	  60;	  	  //	  The	  syscall	  number	  for	  foo()<br>
&emsp;&emsp;Fill in the syscall\_handler() function **on the next page** so that it safely<br>
&emsp;&emsp;handles the SYS\_FOO syscall.

Page 12/14


---

<a id="page-13"></a>
**Page 13**

CS 162 Spring 2016 Midterm Exam #2        April 20, 2016<br>
**Solutions NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

static	  void<br>
syscall\_handler	  (struct	  intr\_frame	  \*f)<br>
{<br>
uint32\_t\*	  args	  =	  ((uint32\_t\*)	  f-­‐\>esp);<br>
exit\_thread\_if\_invalid(args,	  4);

//	  Check	  if	  this	  is	  SYS\_FOO<br>
if	  (**\_**args\[0\]	  ==	  SYS\_FOO**\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**)	  {<br>
exit\_thread\_if\_invalid(&args\[1\],	  4);<br>
struct	  node	  \*head	  =	  args\[1\];<br>
while	  (head	  !=	  NULL)	  {<br>
exit\_thread\_if\_invalid(head,<br>
sizeof(struct	  node));<br>
head	  =	  head-­‐\>next;

Page 13/14


---

<a id="page-14"></a>
**Page 14**

CS 162 Spring 2016 Midterm Exam #2        April 20, 2016<br>
**Solutions NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**<br>
//	  This	  will	  actually	  handle	  SYS\_FOO,<br>
//	  	  	  assuming	  arguments	  are	  valid<br>
handle\_foo(args,	  &f-­‐\>eax);<br>
}	  else	  {<br>
//	  Code	  for	  ALL	  other	  syscalls	  will	  go	  here.<br>
}<br>
}

Page 14/14

