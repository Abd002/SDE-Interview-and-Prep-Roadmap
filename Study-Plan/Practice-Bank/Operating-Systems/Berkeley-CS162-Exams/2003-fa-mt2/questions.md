# Berkeley CS162 Fall 2003: Midterm 2: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;UNIVERSITY OF CALIFORNIA<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;College of Engineering<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Department of Electrical Engineering<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;and Computer Sciences<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Computer Science Division

CS 162, Fall, 2003                            Prof. Alan Jay Smith<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Midterm 2, October 29, 2003

1\. Define and distinguish the principles of temporal and spatial locality.  Give two<br>
examples of how the principles of locality are exploited in a computer system.


---

<a id="page-2"></a>
**Page 2**

2\. Virtual Memory:<br>
In a computer with 32-bit virtual address (A virtual address specifies a byte number) we<br>
subdivide the virtual address into 4 pieces as follows: 8-bit, 4-bit, 8-bit, 12-bit.  We use a<br>
3-level page table, such that the first 8 bits are used to index the page table for the first<br>
level, 4 bits for the second level, 8 bits for the third level, and 12 bits for the byte within<br>
page.  Each page table entry is 48 bits, and contains a physical address (42 bits), 3<br>
protection bits, valid, reference and dirty bits.  Answer the following questions, showing<br>
how you reach the answer.  A simple number will not receive any credit.<br>
&emsp;a. What is the page size in such a system?  Explain your answers. (4)<br>
&emsp;b. How much memory is consumed by the page table, and how much is wasted by<br>
&emsp;&emsp;internal fragmentation for a process that has 64K of memory starting at address 0?<br>
&emsp;&emsp;(Don’t forget to include internal fragmentation in the page table.)  Assume that we<br>
&emsp;&emsp;don’t allocate any page tables that have no valid entries in them.  (6)<br>
&emsp;c. What is an inverted page table?  If you use a global (i.e. shared by all processes,<br>
&emsp;&emsp;with a process ID) inverted page table, and you want to ensure that the page table<br>
&emsp;&emsp;was never more than 50% full, and the physical memory size is 32 MB, how<br>
&emsp;&emsp;many entries does the page table have?  Why?


---

<a id="page-3"></a>
**Page 3**

3\. Disk Scheduling (24)<br>
Suppose you are given a disk with 5000 cylinders (numbered 0 – 4999).  Suppose also<br>
that the drive is currently servicing cylinder 143, and previously serviced cylinder 125.<br>
Requests to the following cylinders have been made to the disk in the following time<br>
sequence order and are all pending.  (I.e. they have not been done yet.)<br>
86, 1470, 913, 1774, 948, 1509, 1022, 1750, 130<br>
Consider the following disk arm scheduling algorithms: i) FCFS; ii) SSTF; iii) SCAN; iv)<br>
C-SCAN<br>
&emsp;a. For each of the above algorithms, what is the order in which the requests are<br>
&emsp;&emsp;serviced for the requests listed above? (8)<br>
&emsp;b. For each of the above algorithms, what is the order in which the requests are<br>
&emsp;&emsp;serviced for the requests listed above? (show work) (8)<br>
&emsp;c. In order to determine which is the “best” arm scheduling algorithm, (in general,<br>
&emsp;&emsp;not particularly for this problem), what would you consider? (List the factors, in<br>
&emsp;&emsp;their relative order of importance, and explain their relative importance.) (8)


---

<a id="page-4"></a>
**Page 4**

4\. What is the inode table? What is the process open file table? Why do we use both,<br>
rather than putting a copy of the inode in the open file table entry? (15)


---

<a id="page-5"></a>
**Page 5**

5\.  Page Replacement (18)<br>
Given the following reference string:<br>
5 4 3 2 5 4 6 5 4 3 2 6<br>
determine the number of page faults when there are 3 or 4 page frames, for each of LRU,<br>
OPT and FIFO replacement.<br>
Show your work.<br>
3    \|    4<br>
LRU<br>
FIFO<br>
OPT


---

<a id="page-6"></a>
**Page 6**

6\.  What is a stack algorithm? Prove that LRU is a stack algorithm.  Prove that FIFO is<br>
not a stack algorithm or prove that OPT is a stack algorithm (your choice). (15)

