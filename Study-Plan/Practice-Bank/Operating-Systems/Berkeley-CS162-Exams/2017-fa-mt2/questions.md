# Berkeley CS162 Fall 2017: Midterm 2: Questions

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

CS 162 Fall 2017, 2nd Midterm Exam                October 23, 2017

**P1** (24 points total) True/False and Why? **CIRCLE YOUR ANSWER**. For each<br>
question: 1 point for true/false correct, 2 points for explanation. An explanation cannot<br>
exceed 2 sentences.<br>
&emsp;a) Adding a TLB will always improve memory access latency.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?

&emsp;b) Memory protection can be implemented without using an address translation<br>
&emsp;&emsp;mechanism.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?

&emsp;c) Segmentation does not change the value of the bits in the offset field of the virtual<br>
&emsp;&emsp;address when translating to a physical address.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?

&emsp;d) Two distinct page tables can have the same page table entry despite existing in<br>
&emsp;&emsp;separate processes.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?

Page 2/10


---

<a id="page-3"></a>
**Page 3**

CS 162 Fall 2017, 2nd Midterm Exam                October 23, 2017

&emsp;e) Priority scheduling can lead to starvation.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?

&emsp;f) Under demand paging, if we think of memory as a cache for disk, conflict misses<br>
&emsp;&emsp;are not possible.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?

&emsp;g) Each syscall has its own unique entry in the interrupt vector in Pintos.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?

&emsp;h) Priority donation is a method of preventing deadlocks.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?

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


![Figure on page 4](figures/questions-p04-fig03.png)


![Figure on page 4](figures/questions-p04-fig04.png)

&emsp;a) (5 points) Fill out the maximum chopstick allocation table (aka only the right,<br>
&emsp;&emsp;shaded half of the table). More precisely, for every lawyer indicate the chopsticks<br>
&emsp;&emsp;it needs to acquire in order to eat.<br>
&emsp;b) (5 points) Fill out the current chopstick allocation table (the left half of the table)<br>
&emsp;&emsp;so that we are in an unsafe state, that is, a state in which none of the lawyers can<br>
&emsp;&emsp;proceed, so all are starving. In addition, give a sequence of requests that will lead<br>
&emsp;&emsp;to the unsafe state you filled in in the table. Each request should be a pair of a<br>
&emsp;&emsp;lawyer and the requested chopstick.

Page 4/10


---

<a id="page-5"></a>
**Page 5**

CS 162 Fall 2017, 2nd Midterm Exam                October 23, 2017

&emsp;c) (5 points) Consider the order of requests that led to the unsafe state at point (b),<br>
&emsp;&emsp;but now use the Banker algorithm to avoid getting into the unsafe state. Give the<br>
&emsp;&emsp;order in which the lawyers will finish eating.

&emsp;d) (3 points) Suppose we implemented each lawyer as a thread and we use a critical<br>
&emsp;&emsp;section for every chopstick (i.e., a chopstick can be picked or dropped only within<br>
&emsp;&emsp;its critical section).  Suppose we do not use the banker’s algorithm, and instead<br>
&emsp;&emsp;detect the deadlock and break it by abruptly “killing” a thread (lawyer). However,<br>
&emsp;&emsp;to our surprise this doesn’t break the deadlock. What happened?

Page 5/10


---

<a id="page-6"></a>
**Page 6**

CS 162 Fall 2017, 2nd Midterm Exam                October 23, 2017

**P3** (18 points) **Address Translation for RAM (& Rem):** Suppose we have split our 64-<br>
bit Virtual Address Space as follows:


![Figure on page 6](figures/questions-p06-fig05.png)

&emsp;a)  (2 points) How big is a page in this system?

&emsp;b) (4 points) Assume that the page tables are divided into page-sized chunks (so that<br>
&emsp;&emsp;they can be paged to disk). How many PTEs are fit in a page table? What is the<br>
&emsp;&emsp;value of X?

&emsp;c) (3 points) What is the size of the segment index (Y)? How many segments can the<br>
&emsp;&emsp;system have?

&emsp;d) (4 points) What would be the format of a PTE (page table entry)? Show the<br>
&emsp;&emsp;format of including bits required to support the clock algorithm for page<br>
&emsp;&emsp;replacement and copy-on-write optimizations, i.e., a dirty bit, a valid bit, and used<br>
&emsp;&emsp;bit. (Assume: 64-bit Physical Address space)

&emsp;e) (5 points) If a user’s heap segment is completely full, how much space is taken up<br>
&emsp;&emsp;by the page tables for this segment? (It is fine if you just provide the numerical<br>
&emsp;&emsp;expression without calculating the final result.)?

Page 6/10


---

<a id="page-7"></a>
**Page 7**

CS 162 Fall 2017, 2nd Midterm Exam                October 23, 2017

**P4** (20 points total) **Caching – Bad Day at Work:** Your company designs caches for<br>
servers with 32-bit addresses. You are designing a 1KB cache with 32B blocks, and your<br>
hardware designer suggests a 64-way set associative cache.<br>
&emsp;a) (4 points) Why would 64-way set associativity not make sense for the cache?


![Figure on page 7](figures/questions-p07-fig06.png)


![Figure on page 7](figures/questions-p07-fig07.png)

Page 7/10


---

<a id="page-8"></a>
**Page 8**

CS 162 Fall 2017, 2nd Midterm Exam                October 23, 2017


![Figure on page 8](figures/questions-p08-fig08.png)

&emsp;e) (4 points) Your hardware engineer fixes the bug in (d) but quite unsurprisingly,<br>
&emsp;&emsp;introduces yet another bug, where the cache randomly reads the valid bit of any<br>
&emsp;&emsp;cache entry as 0 with probability p. In other words, if a cache entry is valid, the<br>
&emsp;&emsp;cache will assume this entry is invalid with probability p. On the other hand, if the<br>
&emsp;&emsp;cache entry is invalid, the cache will correctly assume it is invalid. The memory<br>
&emsp;&emsp;access time is 40 ns, cache access time is 10ns, and probability of finding an entry<br>
&emsp;&emsp;in cache (before reading valid bit) is 0.9. If effective access time (after reading the<br>
&emsp;&emsp;valid bit) is 41 ns, what is the value of probability p?

&emsp;f) (0 points) Would you fire your hardware engineer?

Page 8/10


---

<a id="page-9"></a>
**Page 9**

CS 162 Fall 2017, 2nd Midterm Exam                October 23, 2017

**P5** (20 points) **Real-Time Exam Scheduling:** Assume 3 threads with period (P) and<br>
computation time per period (C) defined as below:


![Figure on page 9](figures/questions-p09-fig09.png)

Assume all threads arrive at time 0.<br>
&emsp;a) (5 points) Fill out the table below according to the Earliest Deadline First<br>
&emsp;&emsp;scheduling algorithm.  As the name implies, EDF schedules the ready thread with<br>
&emsp;&emsp;the earliest deadline, where a thread is ready, if the requested computation, C, in<br>
&emsp;&emsp;the current period has not been satisfied yet. Fill out a box with an ‘X’ if the<br>
&emsp;&emsp;thread of that row is running at the time of the column. If two threads have the<br>
&emsp;&emsp;same deadline, break ties in numerical order i.e., T1 takes precedence before T2.<br>
&emsp;&emsp;A time slice is one time unit (the table below shows the first 15 time slices).<br>
&emsp;&emsp;Threads can only be preempted at time slice boundaries.


![Figure on page 9](figures/questions-p09-fig10.png)

&emsp;b) (1 point) Were any of the deadlines missed? If so, give the thread(s) and time<br>
&emsp;&emsp;period(s) during which the deadline was not met.

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


![Figure on page 10](figures/questions-p10-fig11.png)

&emsp;d) (1 point) Were any of the deadlines in the previous part missed? If so, give the<br>
&emsp;&emsp;thread(s) and time period(s) during which the deadline was not met.

&emsp;e) (5 points) Now consider Round-Robin (RR), where each thread is scheduled for a<br>
&emsp;&emsp;time slices in a round-robin fashion, T1, T2, T3, T1, T2, … If a thread is not<br>
&emsp;&emsp;ready (i.e., its request in a time period has been already satisfied), the thread is<br>
&emsp;&emsp;simply skipped and the next time slice is allocated to the next ready thread. Fill in<br>
&emsp;&emsp;the table below assuming the same threads as in (a).


![Figure on page 10](figures/questions-p10-fig12.png)

&emsp;f) (1 point) Were any of the deadlines in the previous part missed? If so, give the<br>
&emsp;&emsp;thread(s) and time period(s) during which the deadline was not met.

&emsp;g) (2 points) Assume the three tasks at A are running forever. Does EDF guarantee<br>
&emsp;&emsp;that all the deadlines will be always met? Why, or why not? No more than 2<br>
&emsp;&emsp;sentences.

Page 10/10

