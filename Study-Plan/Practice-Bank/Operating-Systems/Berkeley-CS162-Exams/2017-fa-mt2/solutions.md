# Berkeley CS162 Fall 2017: Midterm 2: Official solutions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

CS 162 Fall 2017, 2nd Midterm Exam                October 23, 2017

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;University of California, Berkeley<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;College of Engineering<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Computer Science Division – EECS<br>
Fall 2017                                Ion Stoica<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Second Midterm Exam**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;October 23, 2017<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS162 Operating Systems


![Figure on page 1](figures/solutions-p01-fig01.png)

General Information:<br>
This is a **closed book and one 2-sided handwritten note** examination. You have 80<br>
minutes to answer as many questions as possible.  The number in parentheses at the<br>
beginning of each question indicates the number of points for that question. You should<br>
read **all** of the questions before starting the exam, as some of the questions are<br>
substantially more time consuming.<br>
Write all of your answers directly on this paper.  **Make your answers as concise as possible.**<br>
If there is something in a question that you believe is open to interpretation, then please ask<br>
us about it!<br>
**Good Luck!!**


![Figure on page 1](figures/solutions-p01-fig02.png)

Page 1/10


---

<a id="page-2"></a>
**Page 2**

CS 162 Fall 2017, 2nd Midterm Exam                October 23, 2017

**P1** (24 points total) True/False and Why? **CIRCLE YOUR ANSWER**. For each<br>
question: 1 point for true/false correct, 2 points for explanation. An explanation cannot<br>
exceed 2 sentences.<br>
&emsp;a) Adding a TLB will always improve memory access latency.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?<br>
Any workload that doesn’t visit the same page twice within the TLB’s capacity (or less if<br>
N-way associative) will make the workload perform worse than not having a TLB. We<br>
also accepted answers explaining on single TLB misses, the added overhead of the TLB<br>
check would result in worse latency.

&emsp;b) Memory protection can be implemented without using an address translation<br>
&emsp;&emsp;mechanism.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?<br>
Each process can be associated a BaseAddr and a LimitAddr, and the CPU or OS can<br>
check every access of the process whether it falls between BaseAddr  and LimitAddr (see<br>
slide 15 in lecture 12).

&emsp;c) Segmentation does not change the value of the bits in the offset field of the virtual<br>
&emsp;&emsp;address when translating to a physical address.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?<br>
With segmentation we add base to virtual address, which can modify the offset (unlike in<br>
paging).

&emsp;d) Two distinct page tables can have the same page table entry despite existing in<br>
&emsp;&emsp;separate processes.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?<br>
This happens when processes share pages with each other.

Page 2/10


---

<a id="page-3"></a>
**Page 3**

CS 162 Fall 2017, 2nd Midterm Exam                October 23, 2017

&emsp;e) Priority scheduling can lead to starvation.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?<br>
Yes, if there are enough high priority threads, the lower priority threads will be denied<br>
the service for ever.

&emsp;f) Under demand paging, if we think of memory as a cache for disk, conflict misses<br>
&emsp;&emsp;are not possible.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?<br>
Any page can be placed anywhere in memory, making the “cache” fully-associative.

&emsp;g) Each syscall has its own unique entry in the interrupt vector in Pintos.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?<br>
All syscalls share the single interrupt 0x30, and are distinguished in the syscall handler<br>
by the syscall number passed as an argument.

&emsp;h) Priority donation is a method of preventing deadlocks.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?<br>
Priority donation prevents priority inversion, not deadlocks (it does not prevent circular<br>
wait).

Page 3/10


---

<a id="page-4"></a>
**Page 4**

CS 162 Fall 2017, 2nd Midterm Exam                October 23, 2017

**P2** (18 points) **Synch Art Online II – Lawyer's Rosario:** In the dining lawyers problem,<br>
four lawyers sit around a table, with IDs A-D from left to right. There is a chopstick<br>
between each lawyer, so that chopstick a is to the left of lawyer A, and so on. The<br>
chopsticks loop around (e.g. the right chopstick of lawyer D is chopstick a). Each lawyer<br>
thinks and then eats, repeatedly. To eat, each lawyer needs two chopsticks. Each lawyer<br>
can only reach the chopstick immediately to their left and right (e.g., lawyer A needs<br>
chopsticks a and b).


![Figure on page 4](figures/solutions-p04-fig03.png)


![Figure on page 4](figures/solutions-p04-fig04.png)

&emsp;a) (5 points) Fill out the maximum chopstick allocation table (aka only the right,<br>
&emsp;&emsp;shaded half of the table). More precisely, for every lawyer indicate the chopsticks<br>
&emsp;&emsp;it needs to acquire in order to eat.<br>
&emsp;b) (5 points) Fill out the current chopstick allocation table (the left half of the table)<br>
&emsp;&emsp;so that we are in an unsafe state, that is, a state in which none of the lawyers can<br>
&emsp;&emsp;proceed, so all are starving. In addition, give a sequence of requests that will lead<br>
&emsp;&emsp;to the unsafe state you filled in in the table. Each request should be a pair of a<br>
&emsp;&emsp;lawyer and the requested chopstick.<br>
Lawyer A requests chopstick a  -\> Lawyer B requests chopstick b -\> Lawyer C requests<br>
chopstick c -\> Lawyer D requests chopstick d (aka everyone requests left, then right)<br>
ALTERNATIVELY:  Lawyer D requests chopstick a.  Lawyer C requests chopstick d.<br>
Lawyer B requests chopstick c.  Lawyer A requests chopstick b. (aka right, then left)<br>
The table is filled in for the left-\>right solution, the right-\>left solution for the table<br>
would be valid as well.

Page 4/10


---

<a id="page-5"></a>
**Page 5**

CS 162 Fall 2017, 2nd Midterm Exam                October 23, 2017

&emsp;c) (5 points) Consider the order of requests that led to the unsafe state at point (b),<br>
&emsp;&emsp;but now use the Banker algorithm to avoid getting into the unsafe state. Give the<br>
&emsp;&emsp;order in which the lawyers will finish eating.<br>
C → B → A → D<br>
Alternatively:<br>
B → C → D → A

&emsp;d) (3 points) Suppose we implemented each lawyer as a thread and we use a critical<br>
&emsp;&emsp;section for every chopstick (i.e., a chopstick can be picked or dropped only within<br>
&emsp;&emsp;its critical section).  Suppose we do not use the banker’s algorithm, and instead<br>
&emsp;&emsp;detect the deadlock and break it by abruptly “killing” a thread (lawyer). However,<br>
&emsp;&emsp;to our surprise this doesn’t break the deadlock. What happened?<br>
Chopstick acquisition is most likely implemented with a synchronization primitive.<br>
Shooting one of the lawyers will leave the system in an inconsistent state. For example, if<br>
chopsticks are implemented with semaphores, then the killed lawyer can’t up the<br>
semaphore that another lawyer is waiting on.

Page 5/10


---

<a id="page-6"></a>
**Page 6**

CS 162 Fall 2017, 2nd Midterm Exam                October 23, 2017

**P3** (18 points) **Address Translation for RAM (& Rem):** Suppose we have split our 64-<br>
bit Virtual Address Space as follows:


![Figure on page 6](figures/solutions-p06-fig05.png)

&emsp;a)  (2 points) How big is a page in this system?<br>
We have 12 offset bits, so a page can have 2^12 = 4K bytes.<br>
&emsp;b) (4 points) Assume that the page tables are divided into page-sized chunks (so that<br>
&emsp;&emsp;they can be paged to disk). How many PTEs are fit in a page table? What is the<br>
&emsp;&emsp;value of X?<br>
A PTE should contain one address, so its length is 8 bytes (64 bits). A page table has<br>
2^12/2^3 = 2^9= 512 entries.<br>
We also gave full points to the following alternative answer:<br>
If the PTE was assumed to be 7 bytes (as PPN = 52 bits) then X=2^12/7=10 (rounded up<br>
from 9.19), and the corresponding number of PTEs = 2^10=1024.<br>
&emsp;c) (3 points) What is the size of the segment index (Y)? How many segments can the<br>
&emsp;&emsp;system have?<br>
If answer to part b was X=9, then Y=64-12-4\*9=16 bits.<br>
number of segments=2^Y (2^16 = 64K)<br>
If answer to part b was X=10, then Y=64-12-4\*10=12<br>
number of segments=2^Y = 2^12 = 4KB<br>
&emsp;a)  (4 points) What would be the format of a PTE (page table entry)? Show the<br>
&emsp;&emsp;format of including bits required to support the clock algorithm for page<br>
&emsp;&emsp;replacement and copy-on-write optimizations, i.e., a dirty bit, a valid bit, and used<br>
&emsp;&emsp;bit. (Assume: 64-bit Physical Address space)<br>
We have 12-bit offset, so in a 64-bit physical address space, we will have<br>
2^64/2^12=2^52 pages. Hence, we will need 52 (64-12) bits to index one of those pages.


![Figure on page 6](figures/solutions-p06-fig06.png)

&emsp;b) (5 points) If a user’s heap segment is completely full, how much space is taken up<br>
&emsp;&emsp;by the page tables for this segment? (It is fine if you just provide the numerical<br>
&emsp;&emsp;expression without calculating the final result.)?<br>
Number of pages taken by the page table across different levels<br>
=1 (top-level) + 2^X (second-level) + 2^X\*2^X (third-level) + 2^X\*2^X\*2^X (fourth-<br>
level)<br>
So, the page table for the heap segment in this case will occupy (1 + 2^X + 2^X\*2^X +<br>
2^X\*2^X\*2^X) pages)<br>
And the size of the heap segment will be<br>
= (number of pages in the corresponding page table) \* size of a page<br>
=  (1 + 2^X + 2^X\*2^X + 2^X\*2^X\*2^X) \* 2^12 bytes

Page 6/10


---

<a id="page-7"></a>
**Page 7**

CS 162 Fall 2017, 2nd Midterm Exam                October 23, 2017

**P4** (20 points total) **Caching – Bad Day at Work:** Your company designs caches for<br>
servers with 32-bit addresses. You are designing a 1KB cache with 32B blocks, and your<br>
hardware designer suggests a 64-way set associative cache.<br>
&emsp;a) (4 points) Why would 64-way set associativity not make sense for the cache?<br>
The total number of cache blocks is 1KB/32B = 32. Therefore it doesn’t make sense to<br>
have a 64-way set associative cache, since #cache blocks \< associativity. In fact, the<br>
cache will already be fully associative if you have 32-way set associativity.


![Figure on page 7](figures/solutions-p07-fig07.png)

MRU; with LRU, we would keep evicting entries earlier in the array, resulting in cache<br>
misses for repeated iterations. With MRU, we would evict entries later in the array,<br>
leaving most of the earlier array entries in the cache, resulting in better hit rates for<br>
repeated iterations.


![Figure on page 7](figures/solutions-p07-fig08.png)

The bug would not impact the correctness of end-to-end memory lookups, since tag<br>
mismatches in the cache be corrected by lookups to the memory.<br>
The bug would increase effective access time, since every access would result in a cache<br>
miss.

Page 7/10


---

<a id="page-8"></a>
**Page 8**

CS 162 Fall 2017, 2nd Midterm Exam                October 23, 2017


![Figure on page 8](figures/solutions-p08-fig09.png)

The bug would result in an incorrect lookup for a requested address whose tag matches<br>
N-1 bits but not all N bits with the tag corresponding to a cache entry.<br>
The bug would reduce effective access time, since it is now twice as likely to find entries<br>
in the cache due to partial (and potentially incorrect) tag matches.

&emsp;e) (4 points) Your hardware engineer fixes the bug in (d) but quite unsurprisingly,<br>
&emsp;&emsp;introduces yet another bug, where the cache randomly reads the valid bit of any<br>
&emsp;&emsp;cache entry as 0 with probability p. In other words, if a cache entry is valid, the<br>
&emsp;&emsp;cache will assume this entry is invalid with probability p. On the other hand, if the<br>
&emsp;&emsp;cache entry is invalid, the cache will correctly assume it is invalid. The memory<br>
&emsp;&emsp;access time is 40 ns, cache access time is 10ns, and probability of finding an entry<br>
&emsp;&emsp;in cache (before reading valid bit) is 0.9. If effective access time (after reading the<br>
&emsp;&emsp;valid bit) is 41 ns, what is the value of probability p?<br>
Cache hit rate = Probability of finding the entry in the cache \* Probability of reading<br>
valid bit as 1 = 0.9 \* (1-p) = 0.9 - 0.9p<br>
Cache miss rate = 1 - Cache hit rate = 0.1 + 0.9p<br>
Effective Access Time = (0.9 - 0.9p) \* 10 + (0.1 + 0.9p) \* (10 + 40) = 41<br>
=\> p = 0.75

&emsp;f) (0 points) Would you fire your hardware engineer?<br>
Think of their family. Have mercy.

Page 8/10


---

<a id="page-9"></a>
**Page 9**

CS 162 Fall 2017, 2nd Midterm Exam                October 23, 2017

**P5** (20 points) **Real-Time Exam Scheduling:** Assume 3 threads with period (P) and<br>
computation time per period (C) defined as below:


![Figure on page 9](figures/solutions-p09-fig10.png)

Assume all threads arrive at time 0.<br>
&emsp;a) (5 points) Fill out the table below according to the the Earliest Deadline First<br>
&emsp;&emsp;scheduling algorithm.  As the name implies, EDF schedules the ready thread with<br>
&emsp;&emsp;the earliest deadline, where a thread is ready, if the requested computation, C, in<br>
&emsp;&emsp;the current period has not been satisfied yet. Fill out a box with an ‘X’ if the<br>
&emsp;&emsp;thread of that row is running at the time of the column. If two threads have the<br>
&emsp;&emsp;same deadline, break ties in numerical order i.e., T1 takes precedence before T2.<br>
&emsp;&emsp;A time slice is one time unit (the table below shows the first 15 time slices).<br>
&emsp;&emsp;Threads can only be preempted at time slice boundaries.


![Figure on page 9](figures/solutions-p09-fig11.png)

&emsp;b) (1 point) Were any of the deadlines missed? If so, give the thread(s) and time<br>
&emsp;&emsp;period(s) during which the deadline was not met.<br>
&emsp;None were missed.

Page 9/10


---

<a id="page-10"></a>
**Page 10**

CS 162 Fall 2017, 2nd Midterm Exam                October 23, 2017

&emsp;c) (5 points) Now consider Rate Monotonic (RM), another real-time scheduler<br>
&emsp;&emsp;which always schedules the thread with the highest ratio C/P. In other words RM<br>
&emsp;&emsp;is a fixed priority scheduler where the priority of a thread is C/P, and highest<br>
&emsp;&emsp;priority thread are scheduled first, i.e., T1 is scheduled before T2 if C1/P1 \><br>
&emsp;&emsp;C2/P2.  Given the RM scheduler, fill in the table below assuming the same<br>
&emsp;&emsp;threads as in (a). Ties are again broken by the thread number with the lower<br>
&emsp;&emsp;number running first, and threads can be preempted at the time slice boundaries.


![Figure on page 10](figures/solutions-p10-fig12.png)

&emsp;d) (1 point) Were any of the deadlines in the previous part missed? If so, give the<br>
&emsp;&emsp;thread(s) and time period(s) during which the deadline was not met.<br>
&emsp;Yes. The deadlines of T3 were missed during every time period.

&emsp;e) (5 points) Now consider Round-Robin (RR), where each thread is scheduled for a<br>
&emsp;&emsp;time slices in a round-robin fashion, T1, T2, T3, T1, T2, … If a thread is not<br>
&emsp;&emsp;ready (i.e., its request in a time period has been already satisfied), the thread is<br>
&emsp;&emsp;simply skipped and the next time slice is allocated to the next ready thread. Fill in<br>
&emsp;&emsp;the table below assuming the same threads as in (a).


![Figure on page 10](figures/solutions-p10-fig13.png)

&emsp;f) (1 point) Were any of the deadlines in the previous part missed? If so, give the<br>
&emsp;&emsp;thread(s) and time period(s) during which the deadline was not met.<br>
T1 misses its 3rd period deadline in the time interval \[11, 15\].<br>
&emsp;g) (2 points) Assume the three tasks at A are running forever. Does EDF guarantee<br>
&emsp;&emsp;that all the deadlines will be always met? Why, or why not? No more than 2<br>
&emsp;&emsp;sentences.<br>
No. Consider time 3\*6\*5 = 90. By time 90 we need to schedule T1 18 times so we need<br>
2\*18 = 36 time slices, T2 15 times so we need 30 times slices, and T3 30 times so we<br>
need 30 time slices. Thus, to meet all their deadlines the threads need to run for a total of<br>
36+30+30 times slices during 90 time slices, which is impossible.

Page 10/10

