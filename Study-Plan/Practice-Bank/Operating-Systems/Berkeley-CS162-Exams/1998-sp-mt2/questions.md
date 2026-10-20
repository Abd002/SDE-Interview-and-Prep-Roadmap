# Berkeley CS162 Spring 1998: Midterm 2: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS162, Midterm #2, Spring 1998<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**CS162, Spring 1998**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Midterm 2**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Professor Alan Smith**

**Problem #1**<br>
What is the relocation table? What is in it? How does the loader use it? (10)

**Problem #2**<br>
Suppose we have hardware that supports segmentation. Could we use it to support paging instead? Why or<br>
why not? (10)

**Problem #3**<br>
Could we do page replacement in main memory on a set associative basis? Why or why not? How would it<br>
work? What are the tradeoffs? (10)

**Problem #4**<br>
Given that the following cylinders have I/O requests pending, that the requests arrived in the order shown,<br>
that the disk head is currently at track 9, and that the last two requests serviced were on cylinders 8 and 9 (in<br>
that order), show the sequence in which the I/O requests are serviced (by listing their cylinder numbers) for<br>
each of the following scheduling algorithms. (12)<br>
4 19 20 2 10 21 7 1 26 3 9 11<br>
a) FIFO<br>
b) SSTF<br>
c) SCAN<br>
d) CSCAN

**Problem #5**<br>
Give the number of page faults for LRU, FIFO, OPT for the following reference string, for memories of size<br>
3 and 4. (no partial credit...) (14)<br>
5 4 3 2 5 4 6 5 4 3 2 6<br>
Also give the number of page faults if the working set parameter is 3.5.


![Figure on page 1](figures/questions-p01-fig01.png)

Working Set:

**Problem #6**<br>
The following questions are true/false. No partial credit will be given for missing answers. The questions you<br>
answer will be graded (right-wrong). (44)

\_\_\_a. According to the "fast file system for unix" paper, the randomization of disk blocks over the disk

CS162, Spring 1998 Midterm 2 Professor Alan Smith   1


---

<a id="page-2"></a>
**Page 2**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS162, Midterm #2, Spring 1998<br>
surface, as files were created and deleted, lead to a drop in read bandwidth by more than a factor of five,<br>
compared to a 'new' file system.<br>
\_\_\_b. A page frame is a fixed size portion of a process's address space.<br>
\_\_\_c. A page fault is a type of interrupt.<br>
\_\_\_d. Internal fragmentation is a problem for segmentation (as implemented without paging).<br>
\_\_\_e. The STBR points to the page table for a process.<br>
\_\_\_f. In the absence of paging, segments cannot exceed the physical memory size.<br>
\_\_\_g. A plausible MTBF for a disk is 30,000 days.<br>
\_\_\_h. In the absence of paging, the sum of the sizes of all segments cannot exceed the physical memory size.<br>
\_\_\_i. The 'memory map' is another name for the page table.<br>
\_\_\_j. Putting the user process page tables in the OS virtual memory avoids having to do a two step translation<br>
from virtual address to real address.<br>
\_\_\_k. When a page table is implemented as a hash table, it is called "an indirect page table".<br>
\_\_\_l. One solution to the problem of I/O buffers that span virtual addresses which map to non-contiguous<br>
page frames is to prevent those pages from being paged out during I/O.<br>
\_\_\_m. "ATC" and "DLAT" are synonyms for "TLB" (depending on which manufacturer we are considering.)<br>
\_\_\_n. The set in the TLB is typically selected using the high order virtual address bits.<br>
\_\_\_o. 'Working set restoration' is a page placement algorithm.<br>
\_\_\_p. MIN and LRU are both stack algorithms.<br>
\_\_\_q. The clock algorithm is also called "FINUFO".<br>
\_\_\_r. A plausible power dissipation for a disk is 3 watts.<br>
\_\_\_s. A compact disk can hold more data than a twelve inch reel of 9-track tape.<br>
\_\_\_t. There are current disks that spin at approximately 5000rps.<br>
\_\_\_u. A unix i-node has the file name in it.<br>
\_\_\_v. A unix i-node has a field showing the number of bytes in the file.

&emsp;**Posted by HKN (Electrical Engineering and Computer Science Honor Society)**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**University of California at Berkeley**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**If you have any questions about these online exams**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**please contact**  **examfile@hkn.eecs.berkeley.edu.**

Problem #6   2

