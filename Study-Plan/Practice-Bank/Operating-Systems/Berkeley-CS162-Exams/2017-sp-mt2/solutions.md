# Berkeley CS162 Spring 2017: Midterm 2: Official solutions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

CS 162 Spring 2017, 2nd Midterm Exam                                     March 21, 2017

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;University of California, Berkeley<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;College of Engineering<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Computer Science Division – EECS<br>
Spring 2017                                Ion Stoica<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Second Midterm Exam**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;March 21, 2017<br>
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

Page 1/15


---

<a id="page-2"></a>
**Page 2**

CS 162 Spring 2017, 2nd Midterm Exam                                     March 21, 2017

**P1** (24 points total) True/False and Why? **CIRCLE YOUR ANSWER**. For each<br>
question: 1 point for true/false correct, 2 point for explanation. An explanation cannot<br>
exceed 2 sentences.

&emsp;a) A multilevel page table hierarchy will always take less storage space than a single<br>
&emsp;&emsp;level page table, given the same virtual address space size.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    **FALSE**<br>
&emsp;&emsp;Why?<br>
&emsp;&emsp;When all pages in the virtual memory are allocated, a single level page table will<br>
&emsp;&emsp;take less space, as all its PTEs will be used. While this will also be true in the case<br>
&emsp;&emsp;of a multilevel page table hierarchy, in this case you need additional storage for<br>
&emsp;&emsp;the page table at the first level.

&emsp;b) Forcing all threads to request resources in the same order (e.g., resource A before<br>
&emsp;&emsp;B, B before C, and so on) will prevent deadlock.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**TRUE**                    FALSE<br>
&emsp;&emsp;Why?

&emsp;&emsp;Imposing a strict order prevents a cycle.

Page 2/15


---

<a id="page-3"></a>
**Page 3**

CS 162 Spring 2017, 2nd Midterm Exam                                     March 21, 2017

&emsp;c) Increasing the size of a cache always decreases the number of total cache misses,<br>
&emsp;&emsp;all things held constant (replacement policy, workload, associativity).<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    **FALSE**<br>
&emsp;&emsp;Why?

&emsp;&emsp;Recall the Belady’s anomaly.

&emsp;d) Adding a TLB may make process context switching slower.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**TRUE**                    FALSE<br>
&emsp;&emsp;Why?

&emsp;&emsp;Each process has its own TLB. Thus, the process needs to flush the TLB on<br>
&emsp;&emsp;context switching which will lead to increasing the context switching time.

&emsp;e) It is not possible to share memory between two processes when using multiple-<br>
&emsp;&emsp;level page tables.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    **FALSE**<br>
&emsp;&emsp;Why?

Two PTEs in the page tables of the two processes can point to the same physical page.

Page 3/15


---

<a id="page-4"></a>
**Page 4**

CS 162 Spring 2017, 2nd Midterm Exam                                     March 21, 2017

&emsp;f) Round-robin scheduling has always a higher average response time than shortest-<br>
&emsp;&emsp;job-first.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    **FALSE**<br>
&emsp;&emsp;Why?<br>
&emsp;&emsp;If all jobs have the same size and quanta is larger than the job size, then both RR<br>
&emsp;&emsp;and SJF will have the same average response times.

&emsp;g) One way to respond to thrashing is to kill a process.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**TRUE**                    FALSE<br>
&emsp;&emsp;Why?<br>
&emsp;&emsp;Yes. By killing a process we free the memory and we give a chance to other<br>
&emsp;&emsp;processes to fit their working sets in memory.

&emsp;h) With uniprogramming, applications can access any physical address.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**TRUE**                    FALSE<br>
&emsp;&emsp;Why?<br>
&emsp;&emsp;In the case of uniporgramming there is a single application running on the<br>
&emsp;&emsp;machine and there is no memory protection.

Page 4/15


---

<a id="page-5"></a>
**Page 5**

CS 162 Spring 2017, 2nd Midterm Exam                                     March 21, 2017

**P2** (20 points) **Demand Paging:** Consider the following sequence of page accesses:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;A, B, D, C, B, A, B, A<br>
&emsp;a) (10 points) Fill in the table below assuming the FIFO, LRU, and MIN page<br>
&emsp;&emsp;replacement policies. There are 3 frames of physical memory. The top row<br>
&emsp;&emsp;indicates the frame number, and each entry below contains the page that resides in<br>
&emsp;&emsp;the corresponding physical frame, after each memory reference (we have already<br>
&emsp;&emsp;filled in the row corresponding to accessing A). For readability purposes, **only fill**<br>
&emsp;&emsp;**in the table entries that have changed and leave unchanged entries blank.** If<br>
&emsp;&emsp;there are several pages that meet the replacement criteria, break ties using the<br>
&emsp;&emsp;lexicographical order, i.e., A takes priority over B, B over C, and C over D.


![Figure on page 5](figures/solutions-p05-fig03.png)

Page 5/15


---

<a id="page-6"></a>
**Page 6**

CS 162 Spring 2017, 2nd Midterm Exam                                     March 21, 2017

&emsp;b) (4 points) Give a sequence of page accesses in which LRU will generate a page<br>
&emsp;&emsp;fault on every access.<br>
&emsp;If the pattern was ABCDABCDABCD….. And there were only 3 pages in physical<br>
&emsp;memory, then you would get a page fault on every access.

&emsp;c) (3 points) Demand paging can be thought of as using main memory as a cache for<br>
&emsp;&emsp;disk. Fill in the properties of this cache:<br>
&emsp;&emsp;&emsp;a. Associativity: fully associative<br>
&emsp;&emsp;&emsp;b. Write-through/write-back? : write-back<br>
&emsp;&emsp;&emsp;c. Block Size (assume 32-bit addresses, 4-byte words, and 4KB pages) ? :<br>
&emsp;&emsp;&emsp;&emsp;&emsp;4KB, 1 page

&emsp;d) (3 points) The Nth chance replacement algorithm relies on a parameter N. Why<br>
&emsp;&emsp;might one choose a large N value? Why might one choose a small N value?<br>
&emsp;Choose a large N value for a better approximation of LRU. Choose a small N value<br>
&emsp;for efficiency; a large N value would take a long time to evict a page b/c many loops<br>
&emsp;required.

Page 6/15


---

<a id="page-7"></a>
**Page 7**

CS 162 Spring 2017, 2nd Midterm Exam                                     March 21, 2017

**P3** (20 points) **Caching:** Assume an 8KB cache with 32B blocks, on a machine that uses<br>
32-bit virtual and physical addresses.<br>
&emsp;a) (6 points) Specify the **size** and **name** of each field (i.e., cache tag, cache index,<br>
&emsp;&emsp;and byte select / offset) in the physical address for the following cache types:<br>
&emsp;&emsp;&emsp;a. Direct Mapped<br>
31                                                                                                                         0


![Figure on page 7](figures/solutions-p07-fig04.png)

31                                       12                                       4                                    0


![Figure on page 7](figures/solutions-p07-fig05.png)

&emsp;&emsp;&emsp;b. Fully associative<br>
31                                                                                                                         0


![Figure on page 7](figures/solutions-p07-fig06.png)

31                                                                                4                                    0


![Figure on page 7](figures/solutions-p07-fig07.png)

&emsp;&emsp;&emsp;c. Four-way associative<br>
31                                                                                                                         0


![Figure on page 7](figures/solutions-p07-fig08.png)

31                                       10                                       4                                    0


![Figure on page 7](figures/solutions-p07-fig09.png)

Page 7/15


---

<a id="page-8"></a>
**Page 8**

CS 162 Spring 2017, 2nd Midterm Exam                                     March 21, 2017

&emsp;b)  (11 points) You’ve finished implementing your cache, which ended up being a 2-<br>
&emsp;&emsp;Way Set Associative cache that uses an LRU replacement policy. To test it out,<br>
&emsp;&emsp;you try the following sequence of reads and writes:

&emsp;&emsp;read  from   0x705F3140<br>
&emsp;&emsp;write 0x1 to 0x705F3140<br>
&emsp;&emsp;write 0x2 to 0x705F3150<br>
&emsp;&emsp;write 0x2 to 0x705F3148<br>
&emsp;&emsp;write 0x3 to 0x707A2150<br>
&emsp;&emsp;write 0x3 to 0x035F2154<br>
&emsp;&emsp;read  from   0x705F3140<br>
&emsp;&emsp;Recall that caching happens at the block level, i.e., the unit of transfer between<br>
&emsp;&emsp;cache and main memory is one block. Also, assume that a write leads to caching<br>
&emsp;&emsp;the data, the same as a read. Initially, assume the cache is empty. Please answer<br>
&emsp;&emsp;the following questions:<br>
&emsp;&emsp;&emsp;a. (5 points) How many misses does the above access pattern exhibit?<br>
For a 2-way associative cache we have:<br>
31                                       11                                       4                                    0


![Figure on page 8](figures/solutions-p08-fig10.png)

These are the tag/index/offset for each address:<br>
0x705F3140: (tag = 0x705F3, index = 0xA, offset = 0x0)<br>
0x705F3150: (tag = 0x705F3, index = 0xA, offset = 0x10)<br>
0x705F3148: (tag = 0x705F3, index = 0xA, offset = 0x8)<br>
0x707A2150: (tag = 0x707A2, index = 0xA, offset = 0x10)<br>
0x035F2154: (tag = 0x035F2, index = 0xA, offset = 0x14)<br>
Since all addresses have the same index all accesses are in the same associative set.

read  from   0x705F3140 # cache block (tag = 0x705F3, index = 0xA)<br>
write 0x1 to 0x705F3140 # hit block (tag = 0x705F3, index = 0xA)<br>
write 0x2 to 0x705F3150 # hit block (tag = 0x705F3, index = 0xA)<br>
write 0x2 to 0x705F3148 # hit block (tag = 0x705F3, index = 0xA)<br>
write 0x3 to 0x707A2150 # cache block (tag = 0x707A2, index = 0xA)<br>
write 0x3 to 0x035F2154 # cache block (tag = 0x035F2, index = 0xA)<br>
\# evict block (tag = 0x705F3, index = 0xA)<br>
\# according to LRU policy<br>
read  from   0x705F3140 # cache block (tag = 0x705F3, index = 0xA)<br>
\# evict block (tag = 0x707A2, index = 0xA)<br>
\# according to LRU policy

Page 8/15


---

<a id="page-9"></a>
**Page 9**

CS 162 Spring 2017, 2nd Midterm Exam                                     March 21, 2017

Every “cache” is a miss, so we have **4 misses**.

&emsp;&emsp;&emsp;b. (3 points) Assume the cache is a write-through cache. How many writes<br>
&emsp;&emsp;&emsp;&emsp;&emsp;are taking place between cache an memory?

&emsp;&emsp;Every write results in writing to main memory, so we have **5 writes** to<br>
&emsp;&emsp;memory.

&emsp;&emsp;&emsp;c. (3 points) Assume that cache is a write-back cache. How many writes are<br>
&emsp;&emsp;&emsp;&emsp;&emsp;taking place between cache and memory?

&emsp;&emsp;The only times we write to memory is when we evict a dirty blocks, so in this<br>
&emsp;&emsp;case we have only **two writes** to memory.

&emsp;c) (4 points) Now consider that your system has 5ns of latency when accessing<br>
&emsp;&emsp;cache and 70ns when accessing main memory. What should your application’s<br>
&emsp;&emsp;average hit rate be in order to have an average memory access latency of 15ns?

&emsp;&emsp;Let HR be the hit rate 0 \<= HR \<= 1<br>
&emsp;&emsp;HR \* 5ns + (1-HR) \* 75ns  = 15ns<br>
&emsp;&emsp;5 \* HR + 75 - HR \* 75 = 15

Page 9/15


---

<a id="page-10"></a>
**Page 10**

CS 162 Spring 2017, 2nd Midterm Exam                                     March 21, 2017

&emsp;&emsp;70 \* HR = 60<br>
&emsp;&emsp;HR = 60/70 ~ 86%

**P4** (22 points) **Address Translation:** Consider a computer with **16 bit** virtual and<br>
physical addresses. Address translation is implemented by a two-level scheme combining<br>
segmentation and paging. The page size is **256 bytes**.<br>
Virtual address format:


![Figure on page 10](figures/solutions-p10-fig11.png)

Segment table (Base Address specifies the address of the page table associated with the<br>
segment, and Limit specifies the total number of bytes in the segment):


![Figure on page 10](figures/solutions-p10-fig12.png)

Page Table start address: 0x4000


![Figure on page 10](figures/solutions-p10-fig13.png)

Page Table start address: 0x8000


![Figure on page 10](figures/solutions-p10-fig14.png)

Page Table start address: 0xC000


![Figure on page 10](figures/solutions-p10-fig15.png)

Page 10/15


---

<a id="page-11"></a>
**Page 11**

CS 162 Spring 2017, 2nd Midterm Exam                                     March 21, 2017


![Figure on page 11](figures/solutions-p11-fig16.png)


![Figure on page 11](figures/solutions-p11-fig17.png)


![Figure on page 11](figures/solutions-p11-fig18.png)


![Figure on page 11](figures/solutions-p11-fig19.png)

Page 11/15


---

<a id="page-12"></a>
**Page 12**

CS 162 Spring 2017, 2nd Midterm Exam                                     March 21, 2017


![Figure on page 12](figures/solutions-p12-fig20.png)


![Figure on page 12](figures/solutions-p12-fig21.png)


![Figure on page 12](figures/solutions-p12-fig22.png)

&emsp;&emsp;Since offset is 0x50 (i.e., 80), and the page size is 256 bytes, the 200-byte string<br>
&emsp;&emsp;doesn’t fit in the page, so we need to allocate an extra physical page.


![Figure on page 12](figures/solutions-p12-fig23.png)

Page 12/15


---

<a id="page-13"></a>
**Page 13**

CS 162 Spring 2017, 2nd Midterm Exam                                     March 21, 2017

**P5** (14 points) **Banker’s Algorithm:**<br>
&emsp;a) (6 points) Suppose that we have the following resources: A, B, C and threads T1,<br>
&emsp;&emsp;T2, T3, T4. The total number of instances for each resource is:


![Figure on page 13](figures/solutions-p13-fig24.png)

Further, assume that the threads have the following maximum requirements and current<br>
allocations:


![Figure on page 13](figures/solutions-p13-fig25.png)

Is the system in a safe state? If “yes”, show a non-blocking sequence of thread<br>
executions. Otherwise, provide a proof that the system is unsafe. Show your work and<br>
justify each step of your answer.<br>
Yes. A safe sequence is: T4 à T2 à T3 à T1

Page 13/15


---

<a id="page-14"></a>
**Page 14**

CS 162 Spring 2017, 2nd Midterm Exam                                     March 21, 2017

&emsp;b) (4 points) Repeat question (a) if the total number of B instances is 20 instead of<br>
&emsp;&emsp;21.<br>
&emsp;No, there is no safe sequence because no thread can satisfy its allocation for<br>
&emsp;resource B.

&emsp;c) (4 points) Give one reason using no more than two sentences of why you might<br>
&emsp;&emsp;decide **not** to use Banker’s algorithm to avoid deadlock.

&emsp;Banker’s algorithm is slow; needs to re-evaluate on every request. It is hard to<br>
&emsp;accurately quantify how many resources a system has or how much each process will<br>
&emsp;actually need.

Page 14/15


---

<a id="page-15"></a>
**Page 15**

CS 162 Spring 2017, 2nd Midterm Exam                                     March 21, 2017

Page 15/15

