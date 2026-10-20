# Berkeley CS162 Fall 2004: Midterm 2: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;UNIVERSITY OF C ALIFORNIA<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;College of Engineering<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Department of Electrical Engineering<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;and Computer Sciences<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Computer Science Division<br>
CS 162, FALL, 2004            Prof. Alan Jay Smith<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Midterm 2, Monday, November 8, 2004<br>
You have until the time announced for this exam. The exam is **closed book, closed notes, and no**<br>
**laptops, cellphones or programmable calculators.** All answers should be written on the exam<br>
paper; you may continue on the back of a page if necessary. Anything that we can't read or understand<br>
won't get credit. Any questions for which you give no answer at all will receive 25% partial credit.<br>
Please answer in standard English; illiterate or illegible answers to essay questions willlose credit. If<br>
we can't understand your answer, it is wrong. Partial credit will be given for “computation-type”<br>
problems only if youre errors are obvious to the grader; we are not going to spend significant time<br>
debugging your solution. Please watch the front board for corrections and other information. This<br>
exam has 7 questions on 7 pages. You should put your name on every page; every missing (name)<br>
entry will cost you one point.

1\. Is the throughput in an open system affected by the schedule algorithm, assuming that ρ\<1? How<br>
&emsp;about for a closed system? Why or why not (in both cases)? Why do we care if ρ is less than 1?<br>
&emsp;(10)


---

<a id="page-2"></a>
**Page 2**

2\. The Unix, file system file descriptor contains 15 pointers, which points to the first 12 file blocks,<br>
&emsp;and then to 3 subtrees, respectively 1, 2, and 3 levels deep. In Unix, all blocks are the same fixed<br>
&emsp;size – e.g. 4Kbytes. Consider the Twinkies file system, in which a file descriptor also contains 15<br>
&emsp;pointers. In Twinkies, each pointer points to a file system block, but the block size is variable –<br>
&emsp;blocks can be 1K, 4K, 16K, 64K, 256K and 1Mbytes. There are no indirect blocks, so the file may<br>
&emsp;consist of no more than 15 blocks. What are the advanatages and disadvantages of the Twinkies<br>
&emsp;design vs. the Unix design? Please consider both writing and reading small, medium and large size<br>
&emsp;files. Please consider and discuss everything relevant. (15)


---

<a id="page-3"></a>
**Page 3**

3\. a. Explain what a RAID-5 storage system is, and how it allows you to recover from the failure of a<br>
&emsp;single disk.  b. Discuss whether the disk failures can really be considered to be independent. (15)


---

<a id="page-4"></a>
**Page 4**

4\. What is thrashing? Why is it a problem? What is the working set paging algorithm and how is it<br>
&emsp;intended to combat the thrashing problem? (10)


---

<a id="page-5"></a>
**Page 5**

5\. Disk Scheduling<br>
Suppose you are given a disk with 5000 cylinders (numbered 0-4999). Suppose also that the drive is<br>
currently servicing cylinder 143, and previously serviced cylinder 125.

Requests to the following cylinders have been made to the disk in the following time sequence order<br>
and are all pending. (i.e. They have not been done yet.)

&emsp;&emsp;22  4789  3000  4790  1111  53  1115  2100  11  711  912  962<br>
Consider the following disk arm scheduling alogrithms: i) FCFS; ii) SSTF; iii) SCAN; iv) C-SCAN<br>
a. For each of the above algorithms, what is the order in which the requests are serviced for the<br>
requests listed above, and what is the total distance moved by the disk head (in cylinders). (show<br>
work) (12)

b. In order to determine which is the “best” arm scheduling algorithm, (in general, not particularly for<br>
this problem), what would you consider? (List the factors, in their relative order of importance, and<br>
explain their relative importance.) (8)


---

<a id="page-6"></a>
**Page 6**

6\. Page Replacement (18)<br>
Given the following refernece string:<br>
8    7    6    5    8    7   9    8    7    6    5    9<br>
determine the number of page faults when there are 3 or 4 page frames, for each of LRU, OPT, and<br>
FIFO replacement. Show your work.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**3**   **4**<br>
LRU<br>
FIFO<br>
OPT


---

<a id="page-7"></a>
**Page 7**

7\. We discussed 4 mechanisms to avoid having to allocate and keep in memory very large page<br>
&emsp;tables. (E.g. Assume a 20-bit page number. Then there are 2^20 page table entries. If each is 4-<br>
&emsp;bytes, then we would need to allocated 4Mbytes of real memory for each page table.) What are<br>
&emsp;these 4 mechanisms? Please explain each briefly. (16)

