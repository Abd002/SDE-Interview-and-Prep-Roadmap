# Berkeley CS162 Spring 2003: Midterm 1: Official solutions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;University of California, Berkeley<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;College of Engineering<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Computer Science Division – EECS<br>
Spring 2003                                     Anthony D. Joseph<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Midterm Exam Solutions**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;March 13, 2003<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS162 Operating Systems


![Figure on page 1](figures/solutions-p01-fig01.png)

General Information:<br>
This is a **closed book and notes** examination. You have two hours to answer as many questions<br>
as possible.  The number in parentheses at the beginning of each question indicates the number of<br>
points given to the question; there are 100 points in all. You should read **all** of the questions<br>
before starting the exam, as some of the questions are substantially more time consuming.<br>
Write all of your answers directly on this paper. **Make your answers as concise as possible.** If<br>
there is something in a question that you believe is open to interpretation, then please ask us about<br>
it!<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Good Luck!!**


![Figure on page 1](figures/solutions-p01-fig02.png)

Page 1/12


---

<a id="page-2"></a>
**Page 2**

CS 162 Spring 2003 Midterm Exam        March 13, 2003<br>
Solutions

1\. (28 points total) Short answer questions:<br>
&emsp;a. (9 points) List any THREE major components of most modern operating systems<br>
&emsp;&emsp;(e.g., Unix , Solaris, WindowsNT, Windows2000, or WindowsXP) and briefly<br>
&emsp;&emsp;describe their role of each.<br>
&emsp;&emsp;i)<br>
&emsp;&emsp;3 points for each, 1 points for name and 2 points for role. Memory management,<br>
&emsp;&emsp;process management, file management, I/O system management, networking,<br>
&emsp;&emsp;scheduling, etc. No credit was given for OS functions (e.g., government).

&emsp;&emsp;ii)

&emsp;&emsp;iii)

&emsp;b. (9 points) Give a definition of a counting semaphore, and list and describe the valid<br>
&emsp;&emsp;operations.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;3 points for definition, 2 points for each operation. A counting semaphore<br>
&emsp;&emsp;&emsp;&emsp;&emsp;is a synchronization data structure that can be used to control or limit the<br>
&emsp;&emsp;&emsp;&emsp;&emsp;number of processes that can access to a critical region. There are three<br>
&emsp;&emsp;&emsp;&emsp;&emsp;operations that are allowed on a semaphore:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;1\. Setting the initial value of the semaphore (number of concurrent<br>
&emsp;&emsp;&emsp;&emsp;&emsp;accesses allowed).<br>
&emsp;&emsp;&emsp;&emsp;&emsp;2\. P() decrements the semaphore’s counter and either causes the process<br>
&emsp;&emsp;&emsp;&emsp;&emsp;to wait until the resource is available or allocates the process the<br>
&emsp;&emsp;&emsp;&emsp;&emsp;resource.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;3\. V() increments the semaphore’s counter, releasing a waiting process (if<br>
&emsp;&emsp;&emsp;&emsp;&emsp;any is waiting).

Page 2/12


---

<a id="page-3"></a>
**Page 3**

CS 162 Spring 2003 Midterm Exam        March 13, 2003<br>
Solutions

&emsp;c. (4 points) List the conditions for deadlock.<br>
&emsp;&emsp;1 point for each. Limited access, circular chain of requests, no preemption, and<br>
&emsp;&emsp;multiple independent requests (or “hold and wait”).

&emsp;d. (6 points) Provide definitions for internal and external fragmentation. Draw a<br>
&emsp;&emsp;picture show internal fragmentation in a pure paging system (not paged<br>
&emsp;&emsp;segmentation or segmented paging, but only paging). Draw a picture showing<br>
&emsp;&emsp;external fragmentation in a pure segmentation system.<br>
&emsp;&emsp;2 points for each definition, 1 point for each picture. Internal fragmentation:<br>
&emsp;&emsp;space inside allocated memory that is wasted, typically occurs in paging systems.<br>
&emsp;&emsp;External fragmentation: space outside of allocated memory that is too small to be<br>
&emsp;&emsp;used for another process, typically occurs in segmented systems.

Page 3/12


---

<a id="page-4"></a>
**Page 4**

CS 162 Spring 2003 Midterm Exam        March 13, 2003<br>
Solutions<br>
2\.  (21 points total) Processor Scheduling. Here is a table of processes and their<br>
&emsp;associated running times. All of the processes arrive in numerical order at time 0.


![Figure on page 4](figures/solutions-p04-fig03.png)

&emsp;a. (9 points) Show the scheduling order for these processes under First-In-First-Out<br>
&emsp;&emsp;(FIFO), Shortest-Job First (SJF), and Round-Robin (RR) scheduling with a<br>
&emsp;&emsp;timeslice quantum = 1 time unit.


![Figure on page 4](figures/solutions-p04-fig04.png)

Page 4/12


---

<a id="page-5"></a>
**Page 5**

CS 162 Spring 2003 Midterm Exam        March 13, 2003<br>
Solutions<br>
&emsp;b. (12 points) For each process in each schedule above, indicate the queue wait time<br>
&emsp;&emsp;and turnaround time (TRT).


![Figure on page 5](figures/solutions-p05-fig05.png)

&emsp;&emsp;&emsp;&emsp;&emsp;The queue wait time is the total time a thread spends in the wait queue.<br>
&emsp;Part a) 3 points per column, part b) 2 points per row.<br>
3\. (12 points total) Two-level Virtual Memory. For each of the following two-level virtual<br>
&emsp;memory addressing schemes, explain, in one or two sentences, how the scheme works.


![Figure on page 5](figures/solutions-p05-fig06.png)

&emsp;&emsp;&emsp;3 points for each. 1 point for basic concept, -1 for minor errors, -1 for answers<br>
&emsp;&emsp;&emsp;that are too long. For top-level paging schemes, -1 point for no mention of<br>
&emsp;&emsp;&emsp;Page Table Base Register.


![Figure on page 5](figures/solutions-p05-fig07.png)

Page 5/12


---

<a id="page-6"></a>
**Page 6**

CS 162 Spring 2003 Midterm Exam        March 13, 2003<br>
Solutions


![Figure on page 6](figures/solutions-p06-fig08.png)


![Figure on page 6](figures/solutions-p06-fig09.png)

Page 6/12


---

<a id="page-7"></a>
**Page 7**

CS 162 Spring 2003 Midterm Exam        March 13, 2003<br>
Solutions

4\. (27 points total) Two-Level Page-based Virtual Addressing. Consider a 32-bit machine<br>
&emsp;with a multi-level virtual memory system with 32-bit pointers and 4096-byte pages<br>
&emsp;that supports two-levels of page tables. All Page Table Entries (PTEs) are 4 bytes.<br>
&emsp;a. (6 points) Show the complete format of a virtual address.<br>
&emsp;&emsp;Each address is broken up into three parts:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Page Level 1 – 10 bits    Page Level 2 – 10 bits    Offset – 12 bits<br>
&emsp;&emsp;1 point for each field, 1 point for correct bit length of each field.<br>
&emsp;&emsp;This is a multi-level scheme using two sets of page tables for **each** process: an<br>
&emsp;&emsp;“outer” one and an “inner” one. PL 1 is an index into the outer page table,<br>
&emsp;&emsp;containing PTE’s that contain pointers to the inner page table (which can be<br>
&emsp;&emsp;paged). In other words, the inner page table is broken up into pages that do not<br>
&emsp;&emsp;have to be stored contiguously.<br>
&emsp;&emsp;The PTE at outer \[PL 1\] contains a pointer to the PL 1th page in the inner page<br>
&emsp;&emsp;table. PL 2 is an index into the PL 1th page in the inner page table. PTE's are 4<br>
&emsp;&emsp;bytes, so there are 1,024 PTE's per page. Thus, PL 2 must be exactly 10 bits. The<br>
&emsp;&emsp;index at PL 2 points to the page that holds virtual addresses starting with PL 1<br>
&emsp;&emsp;PL 2. The particular byte is the dth byte in that page. Since pages are 4K bytes, d<br>
&emsp;&emsp;must be exactly 12 bits. Since d is 12 bits and PL 2 is 10 bits, PL 1 must be 10<br>
&emsp;&emsp;bits.

&emsp;b. (6 points) Explain the steps the hardware takes in translating a virtual address to a<br>
&emsp;&emsp;physical address for this scheme (do not worry about supporting paging to disk).

&emsp;&emsp;See Problem 3a for the picture of the steps that are taken. The PTBR is used to<br>
&emsp;&emsp;locate the outer page table **in physical memory**. PL 1 is used to index into the<br>
&emsp;&emsp;outer page table. As above, the PTE at this index points to a page in the inner<br>
&emsp;&emsp;page table. PL 2 is used to index in this inner page table, and the PTE in the inner<br>
&emsp;&emsp;page table points to the physical page. Offset is a location on the physical page. If<br>
&emsp;&emsp;you didn’t mention the PTBR, we subtracted one point.<br>
&emsp;&emsp;Note that each PTE should have a valid bit and several protection bits – e.g.,<br>
&emsp;&emsp;read, write, execute, valid. The memory operation (load, store, load for execution)<br>
&emsp;&emsp;must agree with these bits in both sets of PTE's (inner and outer). Otherwise the<br>
&emsp;&emsp;hardware will generate an interrupt. If you didn’t mention the role of the valid bit<br>
&emsp;&emsp;or the protection bits, we subtracted one point for each missing role.<br>
&emsp;&emsp;If you missed a level, we subtracted one point for each level missed. If you<br>
&emsp;&emsp;included an incorrect step, we subtracted one point.

Page 7/12


---

<a id="page-8"></a>
**Page 8**

CS 162 Spring 2003 Midterm Exam        March 13, 2003<br>
Solutions

&emsp;c. (3 points) How many memory operations are required to read or write a single 32-<br>
&emsp;&emsp;bit word?<br>
&emsp;&emsp;Without extra hardware, performing a memory operation takes 3 actual memory<br>
&emsp;&emsp;operations: two page table lookups in addition to the desired memory operation.<br>
&emsp;&emsp;We did not award partial credit for this problem.

&emsp;d. (4 points) List the fields of a Page Table Entry (PTE).<br>
&emsp;&emsp;Each PTE will have a pointer to the proper page (two points) plus several bits –<br>
&emsp;&emsp;read, write, execute, (1 point for protection bits), and valid (one point). This<br>
&emsp;&emsp;information can all fit into 4 bytes, since if physical memory is 232 bytes, then 20<br>
&emsp;&emsp;bits will be needed to point to the proper page, leaving ample space (12 bits) for<br>
&emsp;&emsp;the information bits.<br>
&emsp;&emsp;If you didn't mention the valid and protection bits, then you lost 2 points. If you<br>
&emsp;&emsp;added incorrect fields, we subtracted one point for each incorrect field.

&emsp;e. (6 points) How much physical memory is needed for a process with one page of<br>
&emsp;&emsp;virtual memory?<br>
&emsp;&emsp;Three pages are needed: one for the outer page table, one for one page of the<br>
&emsp;&emsp;inner page table, and one for the process’ single page.<br>
&emsp;&emsp;Note that the inner page table does not need 4M (210 \* 4K), because the outer<br>
&emsp;&emsp;page table enables you to only have inner page table pages for those pages that<br>
&emsp;&emsp;are part of the process's virtual address space.<br>
&emsp;&emsp;For partially correct answers, we subtracted three points for the wrong total and<br>
&emsp;&emsp;one point for each incorrect page level. Answers that stated that only enough<br>
&emsp;&emsp;memory was needed for a PTE at the outer and inner levels (instead of an entire<br>
&emsp;&emsp;page), were penalized at least three points.

&emsp;f. (2 points) What happens in the virtual memory subsystem on a context switch?<br>
&emsp;&emsp;On a context switch, the PTBR of the new process must be loaded.<br>
&emsp;&emsp;Note that it is not necessary to save the PTBR of the outgoing process as that does<br>
&emsp;&emsp;not change on a context switch, as it is already stored in the process’ control<br>
&emsp;&emsp;block. We did not give partial credit for answers that only saved the PTBR.

Page 8/12


---

<a id="page-9"></a>
**Page 9**

CS 162 Spring 2003 Midterm Exam        March 13, 2003<br>
Solutions<br>
&emsp;&emsp;No Credit – Problem X: (000000000000 points)

&emsp;&emsp;&emsp;&emsp;&emsp;**The Overwhelming Might of the US Military**

The following is the transcript of an actual radio conversation that took place in October<br>
1995, off the coast of England. The British Ministry of Defence recently released the<br>
transcript:

**British:** Calling unknown radar contact at position \*\*\*\*\*, please divert your course 15°<br>
&emsp;&emsp;&emsp;to the south to avoid a collision.<br>
**Americans:** Recommend you divert your course 15° to the north to avoid a collision.<br>
**British:** Negative. You will have to divert your course 15° to the south to avoid a<br>
&emsp;&emsp;&emsp;collision.<br>
**Americans:** This is the Captain of a US Navy ship. I say again, divert your course north.<br>
**British:** Negative, I say again. You will have to divert your course.<br>
**Americans:** This is the captain of the aircraft carrier USS Lincoln, the second largest<br>
&emsp;&emsp;&emsp;&emsp;ship in the United States' Atlantic Fleet. We are accompanied by numerous<br>
&emsp;&emsp;&emsp;&emsp;support vessels. I demand that you change your course 15° north. That's 15°<br>
&emsp;&emsp;&emsp;&emsp;north, or countermeasures will be undertaken to ensure the safety of this<br>
&emsp;&emsp;&emsp;&emsp;ship.<br>
**British:** This is a lighthouse. Your move …

We can only assume that the US ships adjusted their course south.

Page 9/12


---

<a id="page-10"></a>
**Page 10**

CS 162 Spring 2003 Midterm Exam        March 13, 2003<br>
Solutions

5\. (12 points total) Concurrency problem: In parallel programs (one multi-threaded<br>
&emsp;process), a common design methodology is to perform processing in sequential<br>
&emsp;stages. All of the threads work independently during each stage, but they must<br>
&emsp;synchronize at the end of each stage at a synchronization point called a barrier. If a<br>
&emsp;thread reaches the barrier before all other threads have arrived, it waits. When all<br>
&emsp;threads reach the barrier, they are notified and can begin execution on the next phase<br>
&emsp;of the computation.<br>
&emsp;There are three complications to barriers. First, there is no master thread that controls<br>
&emsp;the threads, waits for each of them to reach the barrier, and then tells them to re-start.<br>
&emsp;Instead, the threads must monitor themselves and determine when they should wait or<br>
&emsp;proceed. Second, for many dynamic programs, the number of threads that will be<br>
&emsp;created during the lifetime of the parallel program is unknown in advance, since a<br>
&emsp;thread can spawn another thread, which will start in the same program stage as the<br>
&emsp;thread that created it. Third, a thread may end before the barrier. In all cases, all<br>
&emsp;threads must synchronize at the barrier before the processing is allowed to proceed to<br>
&emsp;the next phase.<br>
&emsp;a. (10 points) Provide the pseudo-code for a monitor class called `Barrier` that<br>
&emsp;&emsp;enables this style of barrier synchronization. Your solution must support creation<br>
&emsp;&emsp;of a new thread (an additional thread that needs to synchronize), termination of a<br>
&emsp;&emsp;thread (one less thread that needs to synchronize), waiting when a thread reaches<br>
&emsp;&emsp;the barrier early, and releasing waiting threads when the last thread reaches the<br>
&emsp;&emsp;barrier. Implement your solution using monitors (e.g., `wait()`, `signal()`, and<br>
&emsp;&emsp;`signalAll())`.<br>
&emsp;&emsp;Your class must implement the following three methods: `threadCreated`(),<br>
&emsp;&emsp;`threadEnd`(), `barrierReached`().<br>
&emsp;&emsp;Hint: this concept is very similar to Java `synchronized` objects.

Page 10/12


---

<a id="page-11"></a>
**Page 11**

CS 162 Spring 2003 Midterm Exam        March 13, 2003<br>
Solutions<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Class Barrier () {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;ConditionVar barrier; Lock lock = FREE;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Int numThreads = 0; Int numThreadsAtBarrier = 0;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;threadCreated() {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;lock.acquire();<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;numThreads ++<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;lock.release();<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;}<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;threadEnd() {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;lock.acquire();<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;numThreads--;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;if (numThreadsAtBarrier == numThreads) {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;numThreadsAtBarrier = 0;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;barrier.signalAll();<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;}<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;lock.release();<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;}<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;barrierReached() {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;lock.acquire();<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;numThreadsAtBarrier++;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;if (numThreadsAtBarrier \< numThreads) {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;barrier.wait();<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;} else {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;numThreadsAtBarrier = 0;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;barrier.signalAll();<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;}<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;lock.release();<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;}<br>
&emsp;&emsp;&emsp;&emsp;&emsp;}<br>
&emsp;&emsp;We subtracted points as follow:<br>
&emsp;&emsp;&emsp;•    Answers with semaphores received no credit<br>
&emsp;&emsp;&emsp;•    Answers without locks lost 5 points, incorrect lock use lost 1 point for<br>
&emsp;&emsp;&emsp;&emsp;&emsp;each error (max –5 points)<br>
&emsp;&emsp;&emsp;•    If your threadEnd procedure didn’t check the ending thread was the last<br>
&emsp;&emsp;&emsp;&emsp;&emsp;one not at the barrier, you lost 2 points<br>
&emsp;&emsp;&emsp;•    If you created a thread in threadCreatED, you lost 1 to 3 points<br>
&emsp;&emsp;&emsp;•    If threads could slip through your barrierReached, you lost 3 to 5 points<br>
&emsp;&emsp;&emsp;•    If not all threads were released after the barrier, you lost 4 points<br>
&emsp;&emsp;&emsp;•    Excessive thread wakeups (e.g., in threadEnd) cost you one point<br>
&emsp;&emsp;&emsp;•    Answers with indefinite waiting (never finishing the barrier) lost 5 points<br>
&emsp;&emsp;&emsp;•    Answers with busy waiting lost 5 points

Page 11/12


---

<a id="page-12"></a>
**Page 12**

CS 162 Spring 2003 Midterm Exam        March 13, 2003<br>
Solutions<br>
&emsp;b. (2 points) In your `barrierReached` method, which conditional statement (i.e.,<br>
&emsp;&emsp;`if`, or `while`) did you use and why?<br>
&emsp;&emsp;The correct choice for most solutions was an if statement. Using a while was an<br>
&emsp;&emsp;extra, unnecessary check for most solutions, thus we gave no credit or partial<br>
&emsp;&emsp;credit for answers based on using Mesa-style monitors. If you said you needed a<br>
&emsp;&emsp;while because new threads could be created while all threads were waiting at the<br>
&emsp;&emsp;barrier, we subtracted one point, as no new threads can be created by the threads<br>
&emsp;&emsp;(since they’re all waiting at the barrier).<br>
&emsp;&emsp;However some solutions that checked for all threads at the barrier in threadEnd<br>
&emsp;&emsp;required a while statement. We gave full credit in such cases.<br>
&emsp;&emsp;We gave no credit for stating that you used a while with Hoare-style monitors, as<br>
&emsp;&emsp;such monitors are extremely difficult to implement in practice.

Page 12/12

