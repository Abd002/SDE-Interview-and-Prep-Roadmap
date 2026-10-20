# Berkeley CS162 Spring 2016: Midterm 2: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;University of California, Berkeley<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;College of Engineering<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Computer Science Division – EECS<br>
Spring 2016                                 Anthony D. Joseph<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Midterm Exam #2**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;April 20, 2016<br>
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

Page 1/10


---

<a id="page-2"></a>
**Page 2**

CS 162 Spring 2016 Midterm Exam #2        April 20, 2016<br>
**NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**<br>
1\. (12 points total) True/False and Why? **CIRCLE YOUR ANSWER AND WRITE**<br>
&emsp;**AN EXPLANATION (no credit will be given if no explanation is provided).**<br>
&emsp;a. In addition to greatly reducing the overall failure probability, moving from a single<br>
&emsp;&emsp;hard drive to using RAID 1 (mirroring) can also increase the throughput of small<br>
&emsp;&emsp;random reads.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**Why?**

&emsp;b. The TCP transport protocol provides a reliable, in-order bytestream abstraction.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**Why?**

&emsp;c. The Byzantine failure model allows arbitrary behavior by a faulty system<br>
&emsp;&emsp;component.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**Why?**

&emsp;d. Remote Procedure Calls provide identical semantics to local calls.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**Why?**

Page 2/10


---

<a id="page-3"></a>
**Page 3**

CS 162 Spring 2016 Midterm Exam #2        April 20, 2016<br>
**NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**<br>
2\. (26 points total) Memory and I/O.<br>
&emsp;a. (12 points) For each statement, **CIRCLE** the address translation scheme(s) for<br>
&emsp;&emsp;which the statement is true.<br>
&emsp;&emsp;i) (4 points) A process cannot directly read or write another process’ memory.<br>
&emsp;&emsp;&emsp;Assume there is no mmap() operation.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;No translation<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Base and Bound<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Segmentation<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Paging

&emsp;&emsp;ii) (4 points) External fragmentation may occur.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;No translation<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Base and Bound<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Segmentation<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Paging

&emsp;&emsp;iii) (4 points) Part of the process’ stack could be swapped out to disk while the<br>
&emsp;&emsp;&emsp;process continues to execute using the rest of the stack. Assume the stack is<br>
&emsp;&emsp;&emsp;located in a typical location for the type of address translation in use.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;No translation<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Base and Bound<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Segmentation<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Paging

Page 3/10


---

<a id="page-4"></a>
**Page 4**

CS 162 Spring 2016 Midterm Exam #2        April 20, 2016<br>
**NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

&emsp;b. (10 points) Consider a system with the following specifications:<br>
&emsp;&emsp;• 46-bit virtual address space<br>
&emsp;&emsp;• Page size of 8 KBytes<br>
&emsp;&emsp;• Page table entry size of 4 Bytes<br>
&emsp;&emsp;• Every page table is required to fit into a single page<br>
&emsp;&emsp;How many levels of page tables would be required to map the entire virtual<br>
&emsp;&emsp;address space?<br>
&emsp;&emsp;In the space below, document the format of a virtual address under this translation<br>
&emsp;&emsp;scheme. Briefly explain your rationale.

&emsp;c. (4 points) Briefly explain, in four sentences or less, what is DMA **and** why DMA<br>
&emsp;&emsp;enables a system to more efficiently handle I/O devices.

Page 4/10


---

<a id="page-5"></a>
**Page 5**

&emsp;CS 162 Spring 2016 Midterm Exam #2        April 20, 2016<br>
&emsp;**NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**<br>
&emsp;3\.  (24 points total) Demand Paging.<br>
&emsp;&emsp;&emsp;a. (18 points) Consider a demand paging system with 3 pages of physical memory.<br>
&emsp;&emsp;&emsp;&emsp;When a page fault occurs, we use a page replacement algorithm to make space<br>
&emsp;&emsp;&emsp;&emsp;for the new page by evicting a page from memory. Using the FIFO, Clock<br>
&emsp;&emsp;&emsp;&emsp;Algorithm, and LRU page replacement algorithms, mark which pages will be in<br>
&emsp;&emsp;&emsp;&emsp;physical memory **after** each page request. The first 3 rows for each algorithm are<br>
&emsp;&emsp;&emsp;&emsp;pre-filled for you.


![Figure on page 5](figures/questions-p05-fig03.png)

&emsp;Page 5/10


---

<a id="page-6"></a>
**Page 6**

CS 162 Spring 2016 Midterm Exam #2        April 20, 2016<br>
**NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

&emsp;b. (4 points) When a page fault occurs and a page is evicted, what entries in which<br>
&emsp;&emsp;data structures must the OS invalidate?

&emsp;c. (2 points) In the Nth chance page replacement algorithm, explain the purpose of the<br>
&emsp;&emsp;parameter N. Consider the effects of a small or large N.

Page 6/10


---

<a id="page-7"></a>
**Page 7**

CS 162 Spring 2016 Midterm Exam #2        April 20, 2016<br>
**NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**<br>
4\.  (22 points total) Disks and File Systems.<br>
&emsp;a. (6 points) Name two performance-improving features that are provided by modern<br>
&emsp;&emsp;disk controllers. For each of the features you name, briefly explain the benefit<br>
&emsp;&emsp;consequences of a disk controller that does not provide that feature.<br>
&emsp;&emsp;i) Feature #1 – Benefits and consequences if it is not provided:

&emsp;&emsp;ii) Feature #2 – Benefits and consequences if it is not provided:

&emsp;b. (5 points) If a disk subsystem receives an average of 10 requests per second and<br>
&emsp;&emsp;each request has an average response time of 500ms, how many requests are in<br>
&emsp;&emsp;the subsystem on average? Explain your answer.

&emsp;c. (4 points) The FAT file system eliminates external fragmentation by allocating disk<br>
&emsp;&emsp;space in block-sized units. Considering that fact, briefly explain why<br>
&emsp;&emsp;defragmentation is still sometimes necessary.

Page 7/10


---

<a id="page-8"></a>
**Page 8**

CS 162 Spring 2016 Midterm Exam #2        April 20, 2016<br>
**NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**<br>
&emsp;d. (3 points) In the UNIX 4.2 BSD FFS, inodes have direct pointers, a singly indirect<br>
&emsp;&emsp;pointer, a doubly indirect pointer, and a triply indirect pointer. The maximum file<br>
&emsp;&emsp;size supported by this inode type is approximately the same as the maximum file<br>
&emsp;&emsp;size supported by an inode with only a triply indirect pointer. Briefly explain one<br>
&emsp;&emsp;disadvantage of an inode design that only uses a triply indirect pointer instead of a<br>
&emsp;&emsp;combination of pointers (other than the slightly reduced maximum file size).

&emsp;e. (4 points) Briefly, in one to three sentences, explain the purpose of the journal in a<br>
&emsp;&emsp;journaling file system?

Page 8/10


---

<a id="page-9"></a>
**Page 9**

CS 162 Spring 2016 Midterm Exam #2        April 20, 2016<br>
**NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**<br>
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

Page 9/10


---

<a id="page-10"></a>
**Page 10**

CS 162 Spring 2016 Midterm Exam #2        April 20, 2016<br>
**NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

static	  void<br>
syscall\_handler	  (struct	  intr\_frame	  \*f)<br>
{<br>
uint32\_t\*	  args	  =	  ((uint32\_t\*)	  f-­‐\>esp);

//	  Check	  if	  this	  is	  SYS\_FOO<br>
if	  (**\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**)	  {

//	  This	  will	  actually	  handle	  SYS\_FOO,<br>
//	  	  	  assuming	  arguments	  are	  valid<br>
handle\_foo(args,	  &f-­‐\>eax);<br>
}	  else	  {<br>
//	  Code	  for	  ALL	  other	  syscalls	  will	  go	  here.<br>
}<br>
}

Page 10/10

