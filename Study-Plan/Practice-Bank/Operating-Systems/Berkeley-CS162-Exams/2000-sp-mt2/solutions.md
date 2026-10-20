# Berkeley CS162 Spring 2000: Midterm 2: Official solutions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS 162, Midterm #2, Spring 2000, SOLUTIONS<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**CS 162, Spring 2000 (April 10, 2000) SOLUTIONS**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Midterm #2**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Prof. Michael J. Franklin**

General Information:<br>
This is a **closed book** examination. You have 1 hour and 20 minutes to answer as many questions as possible.<br>
Partial credit will be given. There are 100 points in all. You should read **all** of the questions before starting the<br>
exam, as some of the questions are substantially more time-consuming than others.

Write all of your answers directly on this paper. Be sure to **clearly indicate** your final answer for each<br>
question. Also, be sure to state any assumptions that you are making in your answers.

Please try to be as **concise as possible**.


![Figure on page 1](figures/solutions-p01-fig01.png)

**Problem #1 \[5 parts, 20 points total\]: CPU Scheduling**

a) (4 points) Assume that 3 processes all with requirements of 1 second of CPU time each and no I/O arrive<br>
at the same time. What will be the average response time (i.e., average time to completion) for the processes<br>
under FIFO scheduling?

ANSWER: 2 seconds, no partial credit

b) (4 points) Answer part "a" for Round Robin (RR) scheduling assuming a timeslice of 0.1 sec and no<br>
overhead for context switches (i.e., context switches are free).

ANSWER: 2.9 seconds, no partial credit

c) (4 points) Answer part "a" for Shortest Job Finish (SJF) scheduling.

ANSWER: 2 seconds, no partial credit

d) (4 points) Multilevel Feedback Queue Scheduling (MFQS) is a fairly good, general CPU scheduling<br>
algorithm, but as initially described in class, can lead to starvation under certain circumstances. Briefly<br>
describe how starvation can occur using MFQS and how to modify MFQS so that starvation can be avoided.

ANSWER: Long jobs on low-priority queues can starve if a continuous stream of short jobs keep the<br>
high-priority queues full. Soln: hold a lottery among the QUEUES, weighted in favor of short queues<br>
OR<br>
implement aging, so that jobs that remain on low-priority queues for a long time are promoted.

CS 162, Spring 2000 (April 10, 2000) SOLUTIONS Midterm #2 Prof. Michael J. Franklin   1


---

<a id="page-2"></a>
**Page 2**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS 162, Midterm #2, Spring 2000, SOLUTIONS<br>
2 pts for starvation explanation<br>
2 pts for correct solution

e) (4 points) What advantage is there in having different time-quantum (i.e. timeslice) sizes on different<br>
levels of the MFQS approach?

ANSWER:<br>
1\) different time quanta help differentiate between long and short jobs<br>
2\) for long jobs, short quanta mean unnecessary context switches (so different time quanta improve<br>
throughput)<br>
3\) Introduces more fairness<br>
The first two answers received full credit.<br>
Fairness received 2 points

**Problem #2 \[6 parts, 30 points total\]: Demand Paging**

a) (3 points) Consider a demand paging system that use 4 KByte pages. In such a system, does a Least<br>
Recently Used (LRU) page replacement policy exploring temporal locality? If so, then how? If not, why not?

ANSWER:<br>
Yes, LRU keeps recently used pages in memory and temporal locality says that these pages are likely to be<br>
accessed in the near future.<br>
1 point for yes + 2 points for a good justification (-1 point for a flaky or waffling answer).

b) (3 points) Consider a demand paging system that use 4 KByte pages. In such a system, does a Least<br>
Recently Used (LRU) page replacement policy exploit spatial locality? If so, then how? If not, why not?

ANSWER:<br>
Yes. It exploits temporal locality within a page by bringing in 4KBytes at a time and keeping the most<br>
recently accessed page in memory. Temporal locality says that other bytes in that page are likely to be<br>
accessed in the near future. (grading note: not all replacement policies support temporal locality even if large<br>
pages are used--for example, MRU does not exploit it.)<br>
1 point for yes + 2 points for a good justification (-1 point for a flaky or waffling answer).

c) (6 points) Consider a demand paging system with four physical memory frames and the following<br>
reference string over seven pages:<br>
1, 2, 3, 4, 2, 1, 5, 6, 2, 1, 2, 3, 7, 6 Assuming that memory starts empty, how many page faults will occur and<br>
what will be the final contents of memory under the FIFO page replacement policy? Circle your answers.

ANSWER:<br>
1,3,6,7 in memory and 11 page faults<br>
3 points for right memory contents and 3 points for right fault count.<br>
-2 if made a simple mistake in one of these, -3 or -4 if additional simple mistakes. -1 or -2 if you didn't follow<br>
directions and made have \[sic\] to hunt for your answer.

d) (6 points) Answer the problem of part "c" for the LRU policy. Recall that the reference string is: 1, 2, 3, 4,<br>
2, 1, 5, 6, 2, 1, 2, 3, 7, 6. Circle your answers.

ANSWER:<br>
2,3,6,7 in memory and 9 page faults

Problem #1 \[5 parts, 20 points total\]: CPU Scheduling   2


---

<a id="page-3"></a>
**Page 3**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS 162, Midterm #2, Spring 2000, SOLUTIONS<br>
Same grading as "c".

e) (6 points) Answer the problem of part "c" for the MIN (i.e., optimal) policy. Recall that the reference string<br>
is: 1, 2, 3, 4, 2, 1, 5, 6, 2, 1, 2, 3, 7, 6. Circle your answers.

ANSWER:<br>
Several valid answers for contents -- 6, plus any 3 of 1,2,3,7 was possible. 7 page faults.<br>
Same grading as "c".

f) (6 points) Suppose that you want to use a paging algorithm that requires a reference bit (such as clock or<br>
working set) for each frame but the hardware for which you are implementing your operating system does not<br>
provide one. Briefly describe how you could simulate one and state (in general terms) what the main costs of<br>
your approach would be.

ANSWER:<br>
The main idea here was to have the operation system maintain its own array of reference bits (that's the easy<br>
part) the tricky part is that the OS must somehow learn about the accesses made to pages. The best way to do<br>
this was to mark pages as invalid so that an access to the page causes a trap to the OS, which can do the<br>
bookkeeping (of course, the OS must keep extra information around to be able to tell which page table entries<br>
are truly invalid). The clock algorithm could reset the invalid bit when it checked an accessed page. The extra<br>
costs are additional traps to the OS just for normal references (depend on how fast your clock moves) and<br>
extra complexity in the OS.<br>
Grading: -4 if you didn't say how the OS could learn about accesses. Note that setting the page permission to<br>
read-only doesn't work here, because we want to trap on reads. -2 if you didn't say what the costs of your<br>
solution were, or your costs were wrong.

**Problem #3 \[3 parts, 20 points total\]: Caching -- Hungry Aliens Revisited**

(Use the following parameter values to answer the parts of this question. Clearly show your work in order to<br>
get partial credit.)


![Figure on page 3](figures/solutions-p03-fig02.png)

a) (6 points) Earth and Pluto -- Assume an alien has arrived on earth looking to eat his favorite type of Pasta<br>
(no need to worry about how many arms the alien has). He starts looking on Earth, if he can't find it there, he<br>
flies his space shit to Pluto where he knows they always have that kinda of pasta (in this case, if the pasta is<br>
not on Earth, it will take 2010 minutes for the Alien to get the pasta). On average, how long should it take for<br>
the Alien to find his pasta?

ANSWER:<br>
Ave. Access Time = L\_earth + (1-P\_Earth) \* L\_Pluto<br>
= 10 + (1 = 0.2) \* 2000<br>
= 1610 minutes<br>
6 points for correct solution<br>
5 points for correct formula but incorrect numerical answer

Problem #2 \[6 parts, 30 points total\]: Demand Paging   3


---

<a id="page-4"></a>
**Page 4**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS 162, Midterm #2, Spring 2000, SOLUTIONS<br>
2 points for incorrect solution (e.g. forgot L\_Earth is required regardless of hit or miss)<br>
0 otherwise

b) (6 points) Add the moon -- Now consider the case where the pasta may also be located on the moon<br>
(according to the probabilities and miss penalties shown above). In this case, how long should it take for the<br>
Alien to find his pasta (assuming he goes from Earth to the Moon, and then to Pluto if necessary)?

ANSWER:<br>
Ave. Access Time<br>
= L\_Earth + (1 - P\_Earth) \[L\_Moon + (1 - P\_Moon)(L\_Pluto)\]<br>
= 10 + (1 - 0.2)\[100 + (1 - 0.5)(2000)\]<br>
= 890 minutes<br>
6 points for correct solution<br>
5 points for correct formula but incorrect numerical answer<br>
2 points for incorrect solution (e.g. forgot L\_Earth is required regardless of hit or miss)<br>
0 otherwise

c) (8 points) For the problem in part "b" above, for what values (if any) of LMoon would it make sense for the<br>
Alien to skip searching the moon and go straight to Pluto?

ANSWER:<br>
The alien should skip the moon if the part from part b is larger than the answer from part a.<br>
That is:<br>
L\_earth + (1 - P\_Earth)\[L\_Moon + (1 - P\_Moon)(L\_Pluto)\] \> 1610<br>
10 + (1 - 0.2) \[L\_Moon + (1 - 0.5)(2000)\] \> 1610<br>
L\_Moon \> 1000 minutes<br>
8 points for correct solution<br>
-2 if you forgot or made an error with the \> or \>= sign<br>
-2 if you clearly set up the problem correctly but got the answer wrong due to error from previous part<br>
-6 if you didn't set up the problem correctly<br>
-2 if you solved for P\_Moon instead of L\_Moon

**Problem #4 \[3 parts, 20 points total\]: Address Translation**

a) (5 points) Suppose we have a 40-bit virtual address separated into an x-bit virtual page number and (40 - x)<br>
-bit page offset. Using basic single page table scheme, what is the maximum number of entries in the page<br>
table and what is the size of each page (in bytes)?

ANSWER:<br>
2^x page table entries (2 points)<br>
2^(40-x) bytes per page (3 points)<br>
1 point for saying 2^(40-x) page table entries and 2^x bytes per page

b) (5 points) Briefly describe what an Inverted Page Table is. List one advantage and one disadvantage of<br>
Inverted tables compared to traditional page tables.

ANSWER:<br>
1 point for identifying that the inverted page table translates virtual page numbers for physical page numbers.<br>
1 point for acknowledging the importance of the process ID in looking up entries in an inverted page table.<br>
1 point for recalling that a hash table or other secondary index is always used to make look-ups more

Problem #3 \[3 parts, 20 points total\]: Caching -- Hungry Aliens Revisited   4


---

<a id="page-5"></a>
**Page 5**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS 162, Midterm #2, Spring 2000, SOLUTIONS<br>
efficient.<br>
1 point for identifying a valid advantage (e.g. fixed table size, global, never needs to be paged, handles sparse<br>
address spaces well). fast is NOT an advantage, because inverted page tables are being compared to<br>
traditional page tables, which are faster.<br>
1 point for identifying a valid disadvantage (e.g. slower, complex, difficult to implement in hardware, harder<br>
to map multiple virtual pages to a single physical page, need additional per-process tables, synchronization<br>
problems of using a global page table).

c) (10 points) Consider an architecture combining segmentation and page with 32-bit addresses divided into<br>
fields as follows:<br>
4-bit seg id 12 bit page number 16 bit offset into page


![Figure on page 5](figures/solutions-p05-fig03.png)

Given the contents of physical memory shown on the left \[bottom in the case of this html file\] and the<br>
segment table above, what is the physical address do the following virtual addresses map to (if a virtual<br>
address is invalid, stat why) (2 points a piece):<br>
0x00001234 =<br>
0x100001234 =<br>
0x11111234 =<br>
0x20021234 =<br>
0x30031234 =


![Figure on page 5](figures/solutions-p05-fig04.png)

Problem #4 \[3 parts, 20 points total\]: Address Translation   5


---

<a id="page-6"></a>
**Page 6**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS 162, Midterm #2, Spring 2000, SOLUTIONS<br>
...   ...

ANSWER:<br>
0x31234<br>
0x61234<br>
invalid - virtual page num. exceeds size of segment<br>
segment 2 does \[sic\] is not valid<br>
0x51234<br>
(valid: 2 points for right address;<br>
invalid: 1 pt for saying invalid; 1 pt for reason)

**Problem #5 \[2 parts, 10 points total\]: Disk Management**

a) (5 points) Compare the performance of the FAT structure used by MS-DOS (where file blocks are linked<br>
in an external structure) to that of the basic "linked allocation" techniqu (where file blocks are linked together<br>
via points in each block) in terms of sequential access and random access. Be sure to state any assumptions<br>
you are making in terms of what if anything is memory resident.

ANSWER:<br>
For random access, the FAT structure will have fewer number of I/Os than the basic linked allocation<br>
technique. For the FAT structure at most 2 I/Os are needed to find a random page. The basic linked allocation<br>
technique will require reading N-1 pages to access the Nth page.

For the sequential access, the basic linked allocation technique will have fewer number of I/O requests than<br>
the FAT structure. The basic linked allocation will follow the pointer on a page to find the next page. the<br>
FAT structure will need to access the FAT and the actual page for every page request.<br>
3 pts for random<br>
2 pts for sequential<br>
For sequential access, we also accept the assumption that FAT is in memory, so the FAT structure will have<br>
about the same number of I/O requests as the basic link allocation technique. But the assumption will have to<br>
be stated in the answer.

b) (5 points) The UNIX BSD 4.1 inode structure is intended to support both small files (e.g., several KBytes)<br>
and large files (e.g. up to some number of GBytes) efficiently. Briefly describe the mechanism employed to<br>
achieve this and state a potential problem of the approach for performance when accessing large files.

ANSWER:<br>
The file structure consists of a file header which contains 13 pointers. The first 10 pointers are pointing to<br>
actual data pages of the file. The 11th pointer is a singly linked pointer. It is a pointer to a page of 256<br>
pointers, which point to actual data pages. The 12th pointer is a doubly linked pointer and the 13th pointer is<br>
a triply linked pointer. Small files will utilized these first 10 points. Large files will need to use the 11th,<br>
12th, or possibly the 13 pointer.

so a potential performance problem with the large files is following the triply linked pointer before reading<br>
the actual data page. This requires extra I/Os for following links.

3 pts for getting the structure correct<br>
-1 for having some numbers wrong<br>
-1 for not describing the linked structure

Problem #5 \[2 parts, 10 points total\]: Disk Management   6


---

<a id="page-7"></a>
**Page 7**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS 162, Midterm #2, Spring 2000, SOLUTIONS

2 pts for a valid problem with large files

&emsp;**Posted by HKN (Electrical Engineering and Computer Science Honor Society)**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**University of California at Berkeley**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**If you have any questions about these online exams**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**please contact**  **examfile@hkn.eecs.berkeley.edu.**

7Posted by HKN (Electrical Engineering and Computer Science Honor Society) University of California at Berkeley If y

