# Berkeley CS162 Fall 2010: Midterm 1: Official solutions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;University of California, Berkeley<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;College of Engineering<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Computer Science Division  EECS<br>
&emsp;Fall 2010                    John Kubiatowicz<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Midterm I<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;SOLUTIONS<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;October 18th, 2010<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS162: Operating Systems and Systems Programming


![Figure on page 1](figures/solutions-p01-fig01.png)

General Information:<br>
This is a **closed book** exam.  You are allowed 2 pages of notes (both sides).  You may use a<br>
calculator. You have 3 hours to complete as much of the exam as possible. Make sure to read all of<br>
the questions first, as some of the questions are substantially more time consuming.<br>
Write all of your answers directly on this paper.  Make your answers as concise as possible. On<br>
programming questions, we will be looking for performance as well as correctness, so think through<br>
your answers carefully.  If there is something about the questions that you believe is open to<br>
interpretation, please ask us about it!


![Figure on page 1](figures/solutions-p01-fig02.png)

&emsp;Page 1/22


---

<a id="page-2"></a>
**Page 2**

CS 162 Fall 2010 Midterm I October 18th, 2010

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[ This page left for  \]

3.14159265358979323846264338327950288419716939937510582097494459230781640628620899

Page 2/22


---

<a id="page-3"></a>
**Page 3**

CS 162 Fall 2010 Midterm I October 18th, 2010


### Problem 1: True/False \[16 pts\]

Please EXPLAIN your answer in TWO SENTENCES OR LESS (Answers longer than this may not<br>
get credit!).  Also, answers without an explanation GET NO CREDIT.


### **Problem 1a\[2pts\]:** The size of an inverted page table grows with the size of the virtual address

space that it is supporting.


![Figure on page 3](figures/solutions-p03-fig03.png)

Explain: Since an inverted page table holds a hash on entries, it only needs to grow<br>
with the size of the physical address space.  Entries not found in the<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;inverted page table can be assumed to be invalid.


### **Problem 1b\[2pts\]:** The term “Core” in “Dump Core” refers to the interior of a machine, since


![Figure on page 3](figures/solutions-p03-fig04.png)

Explain: The term “Core” refers to “core memory”, a type of memory that uses<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;magnetic rings (cores) to store bits of information.


### **Problem 1c\[2pts\]:** Threads within the same process can share data with one another by passing

pointers to objects on their stacks.


![Figure on page 3](figures/solutions-p03-fig05.png)

&emsp;&emsp;True / False<br>
Explain: Since the threads in the same process share an address space, they can<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;all access the same memory (including each other’s stacks).


### **Problem 1d\[2pts\]:** Resource cycles always lead to deadlock.


![Figure on page 3](figures/solutions-p03-fig06.png)

Explain: No. If there are multiple equivalent resources, then a cycle could exist that<br>
wasn’t a deadlock: The reason is that some thread that wasn’t a part of the<br>
cycle could release a resource needed by a thread in the cycle, thereby<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;breaking the cycle.


### **Problem 1e\[2pts\]:** Anything that can be done with a monitor can also be done with semaphores.


![Figure on page 3](figures/solutions-p03-fig07.png)

&emsp;&emsp;True / False<br>
Explain: Since one can construct monitors using semaphores, one could<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;implement any monitor-based algorithm with semaphores by simply<br>
replacing the monitor implementation (i.e. locks and condition<br>
variables) with one using semaphores.

Page 3/22


---

<a id="page-4"></a>
**Page 4**

CS 162 Fall 2010 Midterm I October 18th, 2010


### **Problem 1f\[2pts\]: “**Hyperthreading” is a term used to describe systems with thousands of threads.


![Figure on page 4](figures/solutions-p04-fig08.png)

Explain: Hyperthreading refers to a hardware-multithreading technique that<br>
interleaves a small number of threads on a cycle-by-cycle basis to<br>
maximize the utilization of the processor pipeline.


### **Problem 1g\[2pts\]:** A Lottery Scheduler can be used to implement any other scheduling algorithm

by adjusting the number of tickets that each process holds.


![Figure on page 4](figures/solutions-p04-fig09.png)

Explain: A lottery scheduler cannot be used to implement strict priority scheduling.


### **Problem 1h\[2pts\]:** A MicroKernel can improve the resilience of a system against bugs in the OS.


![Figure on page 4](figures/solutions-p04-fig10.png)

&emsp;&emsp;True / False<br>
Explain: By isolating components of the system (such as file system, network stack,<br>
etc.) in their own address spaces, we gain resilience against bugs because<br>
buggy components are prevented from interfering with other components<br>
by the address-space isolation.

Page 4/22


---

<a id="page-5"></a>
**Page 5**

CS 162 Fall 2010 Midterm I October 18th, 2010


### Problem 2: Short Answer \[22pts\]


### **Problem 2a\[2pts\]:** What is priority donation and why is it important?

&emsp;Priority donation is the process of promoting the priority of lock holders to be equal to that of<br>
&emsp;the corresponding lock-waiters in order to prevent priority inversion (a situation in which a<br>
&emsp;high-priority process ends up waiting on a low-priority process). Priority donation helps to<br>
&emsp;avoid variety of bad situations that can arise from priority inversion such as livelocks or other<br>
&emsp;violations of resource usage that result from not adhering to the priority scheme.


### **Problem 2b\[3pts\]:** Name three ways in which the processor can transition from user mode to

kernel mode.  Can the user execute arbitrary code after transitioning?<br>
&emsp;Some examples include (you only need three):<br>
&emsp;(1) User executing a yield() system call<br>
&emsp;(2) User executing an arbitrary system call (such as for I/O)<br>
&emsp;(3) External interrupt (such as a timer interrupt)<br>
&emsp;(4) System fault (such as a divide-by-zero or memory error).<br>
&emsp;(5) Page Fault<br>
&emsp;No, the user is not able to execute arbitrary code, because all of the entrypoints to the kernel<br>
&emsp;are carefully enforced by the hardware. To say this another way, the hardware makes sure that<br>
&emsp;all transitions to kernel mode are accompanied by entry into a well-defined set of entry points.


### **Problem 2c\[2pts\]:** What happens when an interrupt occurs?  What does the interrupt controller do?

&emsp;Assuming that the interrupt is currently enabled, the hardware saves the PC, disables<br>
&emsp;interrupts, then jumps to an interrupt vector based on the type of interrupt. Typically, the<br>
&emsp;interrupt handler adjusts which interrupts are enabled and saves all registers (including the<br>
&emsp;stack pointer) before proceeding to service the interrupt. The interrupt controller provides an<br>
&emsp;interface that allows the kernel to control which interrupts are enabled.


### **Problem 2d\[2pts\]:** Explain how to fool the multi-level feedback scheduler’s heuristics into giving

a long-running task more CPU cycles.<br>
&emsp;The multi-level feedback scheduler uses the time between bursts (i.e. between I/O operations) to<br>
&emsp;distinguish between interactive and background tasks.  Long-running tasks are typically run at<br>
&emsp;lower priority. By inserting a bunch of I/O (say printfs) into the long-running task, one can fool<br>
&emsp;the multi-level feedback scheduler into thinking that the long-running tasks is actually<br>
&emsp;interactive and should be run at higher priority.

Page 5/22


---

<a id="page-6"></a>
**Page 6**

CS 162 Fall 2010 Midterm I October 18th, 2010


### **Problem 2e\[3pts\]:** What is the difference between Mesa and Hoare scheduling for monitors?

Include passing of locks between signaler and signalee, scheduling of CPU resources, and impact<br>
on the programmer.<br>
&emsp;For Mesa scheduling, the signaler keeps the lock and CPU, while the signaled thread is simply<br>
&emsp;put on the ready queue and will run at a later time. Further, a programmer with Mesa<br>
&emsp;scheduled monitors must recheck the condition after being awoken from a Wait() operation \[<br>
&emsp;i.e. they need a while loop around the execution of Wait(). For Hoare scheduling, the signaler<br>
&emsp;gives the lock and CPU to the signaled thread which begins running until it releases the lock, at<br>
&emsp;which point the signaler regains the lock and CPU. A programmer with Hoare scheduled<br>
&emsp;monitors does not need to recheck the condition after being awoken, since they know that the<br>
&emsp;code after the Wait() is executed immediately after the Signal() \[i.e. they do not need a while<br>
&emsp;loop around the execution of Wait()\].


### **Problem 2f\[2pts\]:** What needs to be saved and restored on a context switch between two threads in

the same process?  What if the two threads are in different processes?  Be explicit.<br>
&emsp;Need to save the processor registers, stack pointer, program counter into the TCB of the thread<br>
&emsp;that is no longer running. Need to reload the same things from the TCB of the new thread.<br>
&emsp;When the threads are from different processes, need to not only save and restore what was<br>
&emsp;given above, but you also need to load the pointer for the top-level page-table of the new<br>
&emsp;address space. You don’t need to save the old pointer, since this will not change and is<br>
&emsp;already stored in the PCB.


### **Problem 2g\[2pts\]:** List two reasons why overuse of threads is bad (i.e. using too many threads for

different tasks). Be explicit in your answers.<br>
&emsp;There are many reasons why overusing threads may be bad. For instance: (1) the overhead of<br>
&emsp;switching will become significant, (2) you would end up using a lot of memory for stacks, (3) the<br>
&emsp;threads may spend all of their time synchronizing on shared data structures (i.e. sleeping in<br>
&emsp;locks), (4) You may be more likely to introduce concurrency bugs with increased concurrency.


### **Problem 2h\[2pts\]:** As specified, the SRTF algorithm requires knowledge of the future. Name two

ways to approximate the information required to implement this algorithm.<br>
&emsp;(1) One can use the past to predict the future by building a model of burst time (e.g. a Kalmann<br>
&emsp;&emsp;filter or an exponential-averaging filter).<br>
&emsp;(2) One could build a scheduler structure (such as the multi-level scheduler) that attempts to<br>
&emsp;&emsp;sort threads into a small number of categories based on their past behavior and using these<br>
&emsp;&emsp;categories to subsequently assign processor time (i.e. schedule) these threads.

Page 6/22


---

<a id="page-7"></a>
**Page 7**

CS 162 Fall 2010 Midterm I October 18th, 2010


### **Problem 2i\[4pts\]:**

Here is a table of processes and their associated arrival and running times.


![Figure on page 7](figures/solutions-p07-fig11.png)

Show the scheduling order for these processes under 3 policies: First Come First Serve (FCFS),<br>
Shortest-Remaining-Time-First (SRTF), Round-Robin (RR) with timeslice quantum = 1. Assume<br>
that context switch overhead is 0 and that new processes are added to the **head** of the queue except<br>
for FCFS, where they are added to the tail.


![Figure on page 7](figures/solutions-p07-fig12.png)

Page 7/22


---

<a id="page-8"></a>
**Page 8**

CS 162 Fall 2010 Midterm I October 18th, 2010<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[ This page intentionally left blank \]

Page 8/22


---

<a id="page-9"></a>
**Page 9**

CS 162 Fall 2010 Midterm I October 18th, 2010


### Problem 3: Readers-Writers Access to Database \[20 pts\]


![Figure on page 9](figures/solutions-p09-fig13.png)


### **Problem 3a\[2pts\]:**  Above, we show the Readers-Writers example given in class.  It used two

condition variables, one for waiting readers and one for waiting writers. Suppose that all of the<br>
following requests arrive in very short order (while R1 and R2 are still executing):<br>
Incoming stream: R1 R2 W1 R3 W2 W3 R4 R5 R6 W4 R7 W5 W6 R8 R9 W7 R10<br>
In what order would the above code process the above requests? If you have a group of requests<br>
that are equivalent (unordered), indicate this clearly by surrounding them with braces ‘{}’.  You can<br>
assume that the wait queues for condition variables are FIFO in nature (i.e. signal() wakes up the<br>
oldest thread on the queue). Explain how you got your answer.<br>
&emsp;SOLN: Processed as follows: {R1 R2} W1W2 W3 W4 W5 W6 W7 { R3 R4 R5 R6 R7 R8 R9 R10}<br>
&emsp;Since this algorithm gives precedence to writes over reads, although the first two reads get to<br>
&emsp;execute together and right away, the remaining reads are deferred until each write is processed<br>
&emsp;(one at a time).  After all writes are finished, then the reads execute as a group.


### **Problem 3b\[2pts\]:**  Let us define the logical arrival order by the order in which threads first

acquire the monitor lock. Suppose that we wanted the results of reads and writes to the database to<br>
be the same as if they were processed one at a time – in their logical arrival order; for example,<br>
W1 W2 R1 R2 R3 W3 W4 R4 R5 R6 would be processed as W1 W2 {R1 R2 R3} W3 W4 {R4 R5 R6}<br>
regardless of the speed with which these requests arrive. Explain why the above algorithm does not<br>
satisfy this constraint.<br>
&emsp;Once it starts buffering items (i.e. putting requests to sleep on condition variables), the above<br>
&emsp;algorithm does not keep track of the arrival order.  Or, to say it another way, the above<br>
&emsp;algorithm loses all ordering between buffered reads and buffered writes. Thus, it cannot<br>
&emsp;guarantee that reads execute after earlier writes and before later writes (as defined by logical<br>
&emsp;arrival order) unless it never buffers items (in which case it is not really doing anything at all).

Page 9/22


---

<a id="page-10"></a>
**Page 10**

CS 162 Fall 2010 Midterm I October 18th, 2010

&emsp;Assume that our system uses Mesa scheduling and that condition variables have FIFO wait<br>
&emsp;queues.  Below is a sketch of a solution that uses only two condition variables and that does<br>
&emsp;return results as if requests were processed in logical arrival order.  Rather than separate<br>
&emsp;methods for Reader() and Writer(), we have a single method which takes a “NewType” variable<br>
&emsp;(0 for read, 1 for write):<br>
`1. Lock MonitorLock;`           `// Methods: acquire(),release()`<br>
`2. Condition waitQueue, onDeckQueue;// Methods: wait(),signal(),broadcast()`<br>
`3. int Queued = 0, onDeck = 0;   // Counts of sleeping threads`<br>
`4.` `/* Missing code */`<br>
`5. Accessor (int NewType) {`    `// type = 0 for read, 1 for write`<br>
`6.`     `/* Monitor to control entry so that one writer or multiple readers */`<br>
`7.`     `MonitorLock.acquire();`<br>
`8.`     `/* Missing wait condition */`<br>
`9.`     `{ Queued++;`<br>
`10.`         `waitQueue.wait();`<br>
`11.`         `Queued—;`<br>
`12.`     `}`<br>
`13.`     `/* Missing wait condition */`<br>
`14.`     `{` `onDeck++;`<br>
`15.`         `onDeckQueue.wait();`<br>
`16.`         `onDeck--;`<br>
`17.`     `}`<br>
`18.`     `/* Missing code */`<br>
`19.`      `MonitorLock.release();`<br>
`20.`     `// Perform actual data access`<br>
`21.`     `AccessDatabase(NewType);`<br>
`22.`     `/* Missing code */`<br>
`23. }`<br>
The `waitQueue` condition variable keeps unexamined requests in FIFO order.  The<br>
`onDeckQueue` keeps a single request that is currently incompatible with requests that are<br>
executing.  We want to allow as many parallel requests to the database as possible, subject to the<br>
constraint of obeying logical arrival order. Here, logical arrival order is defined by the order in<br>
which requests acquire the lock at line #7.


### **Problem 3c\[2pts\]:** What additional variable(s) (and initialization) do you need at Line #4? Hint:

think about what you need to describe the current set of threads accessing the database in parallel.<br>
Give explicit code to insert at Line #4 (can be more than one line of actual code).<br>
&emsp;We need to know which type of request is currently occurring and how many of these requests<br>
&emsp;are occurring in order to adhere to the Readers-Writers conditions (multiple reads or one write<br>
&emsp;at a time).  Although we can accomplish this requirement in multiple ways, the following works:<br>
&emsp;`int CurType = 0;`<br>
&emsp;`int NumAccessing = 0;`


### **Problem 3d\[2pts\]:** Explain why you might not want to use a “while()” statement in Line #8 –

despite the fact that the system has Mesa scheduling:<br>
&emsp;Because a while loop will potentially reorder requests on the `waitQueue` condition variable –<br>
&emsp;and we want to keep requests in their original logical arrival order. Thus whatever we do, we<br>
&emsp;do not want to execute `waitQueue.wait()`more than once per thread.

Page 10/22


---

<a id="page-11"></a>
**Page 11**

CS 162 Fall 2010 Midterm I October 18th, 2010


### **Problem 3e\[2pts\]:** What is the missing code in Line #8?  Hint: it is a single “if” statement.

&emsp;If anyone in the system is waiting, then we want to wait so that we don’t get ahead of others (i.e.<br>
&emsp;so that we preserve the logical arrival order):<br>
&emsp;`if (Queued + onDeck > 0)`


### **Problem 3f\[2pts\]:** What is the missing code in Line #13?  This should be a single line of code.

&emsp;If the current request is incompatible with the set of executing requests, then we have to wait:<br>
&emsp;`while ((NumAccessing > 0) && (NewType == 1 || CurType == 1))`<br>
&emsp;You could also use an “if” here, but then you would need to conditionalize the<br>
&emsp;“onDeckQueue.signal()” statement in (3h).


### **Problem 3g\[2pts\]:** What is the missing code in Line #18?  You should not have more than three (3)

actual lines of code.<br>
&emsp;`NumAccessing++;`       `// Have another thread accessing the database`<br>
&emsp;`CurType = NewType;    // In case we are first of new group`<br>
&emsp;`waitQueue.signal();   // Wake up next thread (if they exist)`


### **Problem 3h\[3pts\]:** What is the missing code in Line #22?  You should not have more than five (5)

actual lines of code.<br>
&emsp;`MonitorLock.acquire();`<br>
&emsp;`NumAccessing--;`       `// One less accessing`<br>
&emsp;`onDeckQueue.signal(); // Wake up someone stalled on conflict`<br>
&emsp;`MonitorLock.release();`

&emsp;If you use an “if” in (3h), then need this instead of the above signaling<br>
&emsp;`if(NumAccessing ==0)`<br>
&emsp;`onDeckQueue.signal(); // Wake up someone stalled on conflict`


### **Problem 3i\[3pts\]:** Suppose that condition variables did not have FIFO ordered wait queues. What

changes would you have to make to your code?  Be explicit (you should not need more than 6 new<br>
or changed lines). Hint: consider assigning a sequentially increasing ID to each thread.<br>
&emsp;New variables to track sequential IDs added to Line #4:<br>
&emsp;`int HeadID = 0, TailID = 0;    //(NEW)`<br>
&emsp;New code for Line #8 (one new line, one changed line):<br>
&emsp;&emsp;`int MyCurrentID = TailID++;    //(NEW)Next logical ID to new request`<br>
&emsp;&emsp;`while (MyCurrentID != HeadID) //(CHANGED)`<br>
&emsp;Finally, code for Line #18 is slightly different (only added 1 line, changed 1 line):<br>
&emsp;&emsp;`NumAccessing++;`         `//(UNCHANGED LINE)`<br>
&emsp;&emsp;`CurType = NewType;`      `//(UNCHANGED LINE)`<br>
&emsp;&emsp;`HeadID++;`      `//(NEW) Next in-order thread can wake`<br>
&emsp;&emsp;`waitQueue.broadcast(); //(CHANGED) Wake up next thread in order`

Page 11/22


---

<a id="page-12"></a>
**Page 12**

CS 162 Fall 2010 Midterm I October 18th, 2010<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[ This page intentionally left blank \]

Page 12/22


---

<a id="page-13"></a>
**Page 13**

CS 162 Fall 2010 Midterm I October 18th, 2010


### Problem 4: Deadlock \[24pts\]


### **Problem 4a\[2pts\]:** Suppose that we utilize the Banker’s algorithm to determine whether or not to

grant resource requests to threads. The job of the Banker’s algorithm is to keep the system in a<br>
“SAFE” state. It denies resource requests by putting the requesting thread to sleep if granting the<br>
request would cause the system to enter an “UNSAFE” state, waking it only when the request could<br>
be granted safely. What is a SAFE state?<br>
&emsp;In a safe state, there is some ordering of the threads in the system such that threads can<br>
&emsp;complete, one after another without deadlocking and without requiring threads to give up<br>
&emsp;resources that they already have.


### **Problem 4b\[4pts\]:**


![Figure on page 13](figures/solutions-p13-fig14.png)

The figure at the right illustrates a 2D mesh of network routers.<br>
Each router is connected to each of its neighbors by two<br>
network links (small arrows), one in each direction. Messages<br>
are routed from a source router to a destination router and can<br>
stretch through the network (i.e. consume links along the route<br>
from source to destination). Messages can cross inside routers.<br>
&emsp;Assume that no network link can service more than one<br>
message at a time, and that each message must consume a<br>
continuous set of channels (like a snake). Messages always<br>
make progress to the destination and never wrap back on<br>
themselves. The figure shows two messages (thick arrows).<br>
&emsp;Assume that each router or link has a very small amount of buffer space and that each message<br>
can be arbitrarily long. Show a simple situation (with a drawing) in which messages are deadlocked<br>
and can make no further progress.  Explain how each of the four conditions of deadlock are<br>
satisfied by your example. Hint: Links are the limited resources in this example.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Answer: The simplest deadlock example is a set of four messages in a


![Figure on page 13](figures/solutions-p13-fig15.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;loop (as shown in the figure at the left). Each message is blocked<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;attempting to make a counter-clockwise turn by a message utilizing the<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;target channel. Four conditions:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1\. Mutual Exclusion: Each channel held by one message at a time<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2\. Hold and Wait: messages hold channels while waiting to acquire<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;other channels<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3\. No preemption: Channels can not be preempted from messages<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;after they are acquired by them<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4\. Circular wait: We have a cycle of waiting here – four messages

Page 13/22


---

<a id="page-14"></a>
**Page 14**

CS 162 Fall 2010 Midterm I October 18th, 2010


### **Problem 4c\[3pts\]:**

Define a routing policy that avoids deadlocks in the network of (4b). Prove that deadlocks cannot<br>
happen when using this routing policy. Hint: assume that a deadlock occurs and show why that<br>
leads to a contradiction in the presence of your new routing policy.<br>
&emsp;Several answers are possible here.  The one given in class was to force messages to route in the<br>
&emsp;X direction first, then Y.  To prove that deadlocks cannot occur, assume that one did occur.<br>
&emsp;Then, such a deadlock would involve a cycle in messages.  However, such a cycle would involve<br>
&emsp;at least one message that routed from the Y direction to the X direction (in fact, at least 2 of<br>
&emsp;them).  Since we have disallowed such a route, this cycle cannot exist.  Thus, no deadlocks can<br>
&emsp;exist.


### **Problem 4d\[3pts\]:** Suppose that we wanted a less restrictive routing policy than your answer to

(4c).  Explain why the Banker’s algorithm is not well adapted to this routing problem.   What could<br>
you do that was similar in spirit to the Banker’s algorithm to prevent deadlock in networks such as<br>
(4b), while allowing arbitrary routing of messages?  Why is it unlikely that such an algorithm<br>
would be used in a real network?<br>
&emsp;The problem here is that the resource needs of a message depends on the current location of its<br>
&emsp;head, while the Banker’s algorithm requires declaration of resource needs prior to routing. The<br>
&emsp;Banker’s algorithm is so conservative that it would allow only a small number of messages to<br>
&emsp;be present in the network at the same time.<br>
&emsp;What one could do is to have each message request its next link from a deadlock-avoider that<br>
&emsp;checks inflight messages to see if they could still be drained from the network if the link request<br>
&emsp;were granted. Although this mechanism would be in the spirit of the Banker’s algorithm, it is<br>
&emsp;very expensive (requires essentially routing all messages to their destinations to decide whether<br>
&emsp;the system would deadlock).


### **Problem 4e\[2pts\]:** Is it possible for a system with a single monitor (i.e one lock with multiple

condition variables) to deadlock?  Explain.<br>
&emsp;Yes. The lock provides a guard on the condition variables, which could be involved in a circular<br>
&emsp;wait condition. The simplest way to see this situation is to construct two semaphores from one<br>
&emsp;monitor with two condition variables. For instance:<br>
&emsp;&emsp;`X.p()` `lock.acquire();`    `X.v()` `lock.acquire();`<br>
&emsp;`while (Xcount = 0)`        `Xcount++;`<br>
&emsp;`Xcondition.wait();`        `Xcondition.signal()`<br>
&emsp;`Xcount—;`        `lock.release();`<br>
&emsp;`lock.release();`<br>
&emsp;Same for semaphore Y.  Then, set up a circular wait condition:<br>
&emsp;Thread 1    Thread 2<br>
&emsp;X.p()    Y.p()<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;X.p()<br>
&emsp;Y.p()

Page 14/22


---

<a id="page-15"></a>
**Page 15**

CS 162 Fall 2010 Midterm I October 18th, 2010


### **Problem 4f\[4pts\]:**

Suppose that we have the following resources: A, B, C and threads T1, T2, T3, T4.  The total<br>
number of each resource is:


![Figure on page 15](figures/solutions-p15-fig16.png)

Further, assume that the processes have the following maximum requirements and current<br>
allocations:


![Figure on page 15](figures/solutions-p15-fig17.png)

Is the system in a safe state (as defined by the Banker’s algorithm)? If “yes”, show a non-blocking<br>
sequence of thread executions. Otherwise, provide a proof that the system is unsafe. Show all steps,<br>
intermediate matrices, etc.<br>
&emsp;Answer: Yes, this system is in a safe state.


![Figure on page 15](figures/solutions-p15-fig18.png)

&emsp;To prove this, we first compute the currently free allocations:

&emsp;Further, we compute the number needed by each thread (Maximum – Current Allocation):


![Figure on page 15](figures/solutions-p15-fig19.png)

&emsp;Thus, we can see that a possible sequence is: T3, T2, T4, T1:


![Figure on page 15](figures/solutions-p15-fig20.png)

Page 15/22


---

<a id="page-16"></a>
**Page 16**

CS 162 Fall 2010 Midterm I October 18th, 2010


### **Problem 4g\[3pts\]:**

Assume that we start with a system in the state of (4f). Suppose that T1 asks for 2 more copies of<br>
resource A.  Can the system grant this if it wants to avoid deadlock (i.e. will the result be a SAFE<br>
state)? Explain.<br>
&emsp;No.  This cannot be granted.  Assume that T1 gets 2 more of A.<br>
&emsp;Then, our available allocation is:


![Figure on page 16](figures/solutions-p16-fig21.png)

&emsp;Then, looking at our needed


![Figure on page 16](figures/solutions-p16-fig22.png)

&emsp;allocations, we see:

&emsp;At this point, the available allocation is insufficient to start any of the threads, much less find a<br>
&emsp;safe sequence that finishes all of them.


### **Problem 4h\[3pts\]:**

Assume that we start with a system in the state of (4f). What is the maximum number of additional<br>
copies of resources (A, B, and C) that T1 can be granted in a single request without risking<br>
deadlock? Explain.<br>
&emsp;We cannot ask for more than (A,B,C)=(2,1,1) since this is all that is available. However, the<br>
&emsp;previous problem showed that A must be \< 2. Further, note that the resources given to T1 are<br>
&emsp;tied up until the very end of the execution (look at sequence in 4f).<br>
&emsp;Thus, looking at our safe sequence from 4f, we can see that it can still work if it is missing one A<br>
&emsp;and one C. Just work through it with the first “Available Before” allocation of 1,1,0 instead of<br>
&emsp;2,1,1. However, it will not work if it is missing one more B (we would be unable to execute T4 in<br>
&emsp;the sequence), i.e. setting “Available Before” to 1,0,0 prevents the execution of T4.<br>
&emsp;Thus the maximum number of additional resources that can be requested by T1 is<br>
&emsp;(A,B,C)=(1,0,1)

Page 16/22


---

<a id="page-17"></a>
**Page 17**

CS 162 Fall 2010 Midterm I October 18th, 2010


### Problem 5: Virtual Memory \[18pts\]

Consider a two-level memory management scheme on 24-bit virtual addresses using the following<br>
format for virtual addresses:


![Figure on page 17](figures/solutions-p17-fig23.png)

Virtual addresses are translated into 16-bit physical addresses of the following form:


![Figure on page 17](figures/solutions-p17-fig24.png)

Page table entries are 16 bits in the following format, stored in big-endian form in memory (i.e. the<br>
MSB is first byte in memory).<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Page Table Entry (PTE)**


![Figure on page 17](figures/solutions-p17-fig25.png)

Note that a virtual-physical translation can fail at any point if an incompatible PTE is encountered.<br>
Two types of errors can occur during translation: “invalid page” (page is not mapped at all) or<br>
“access violation” (page exists, but access was illegal).


### **Problem 5a\[2pts\]:** How big is a page? Explain.

&emsp;Pages are 256 bytes in size (2Offset) = (28).


### **Problem 5b\[2pts\]:** What is the largest size for a page table with this address space? We are asking

for the total size of both levels of the page table. Explain.<br>
&emsp;The largest page table would occur when there is a mapping for all pages in the address space.<br>
&emsp;All entries would be filled at both levels of the page table. In this double-level page table, there<br>
&emsp;will be 1 page-table chunk at the top level and 28 page-table chunks at the second level for a<br>
&emsp;total of 1+28 chunks.  Each chunk has 28×SizeOf(PTE) = 512 bytes. Thus, the total size of the<br>
&emsp;full page table is:  (1+28) × (512) = 131584.


### **Problem 5c\[3pts\]:** What does “TLB” stand for and what is its function?  How big would a TLB

entry be for this system?<br>
&emsp;“TLB” stands for Translation Lookahead Buffer. It serves as a cache for translations from the<br>
&emsp;page table. Each TLB entry would contain a virtual page # (16 bits), a PTE (16 bits), and a<br>
&emsp;valid bit (1 bit) for a total of 33 bits.  Since there are two zero bits in the PTE, one could argue<br>
&emsp;that the TLB entry only needs 31 bits.

Page 17/22


---

<a id="page-18"></a>
**Page 18**

CS 162 Fall 2010 Midterm I October 18th, 2010


### **Problem 5d\[3pts\]:** Sketch the format of the page-table for this multi-level virtual memory

management scheme. Illustrate the process of resolving an address as well as possible.<br>
We were looking for something like this:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Virtual Address


![Figure on page 18](figures/solutions-p18-fig26.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Physical Address


### **Problem 5e\[2pts\]:** What is “Copy on Write”?  How would you perform Copy on Write with the

Virtual Memory system discussed in this problem?<br>
&emsp;Copy on Write is a mechanism for making cheap copies of an address space by creating a<br>
&emsp;duplicate page table that points at the same physical pages as an existing page table. All PTEs<br>
&emsp;are marked as read-only, allowing any write to be caught; at the point of a write, the target<br>
&emsp;page can be copied so that each page table points at a unique copy.  As just mentioned, Copy<br>
&emsp;On Write is accomplished in this Virtual Memory system by setting the PTE to Read-Only so<br>
&emsp;that the target page can be copied at the first write.


### **Problem 5f\[6pts\]:** The contents of physical memory are given on the next page. Assume that the

page-table base pointer = 0x2000, and that the CPU is in user-mode. Please return the results from<br>
the following load/store instructions.  Addresses are virtual. The return value for load is an 8-bit<br>
data value or an error, while the return value for a store is either “**ok**” or an error. For errors, please<br>
specify which type of error (either “invalid page” or “access violation”).


![Figure on page 18](figures/solutions-p18-fig27.png)


![Figure on page 18](figures/solutions-p18-fig28.png)

Page 18/22


---

<a id="page-19"></a>
**Page 19**

CS 162 Fall 2010 Midterm I October 18th, 2010

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Virtual Address Format**


![Figure on page 19](figures/solutions-p19-fig29.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Page Table Entry (PTE)**


![Figure on page 19](figures/solutions-p19-fig30.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Physical Memory**


![Figure on page 19](figures/solutions-p19-fig31.png)

Page 19/22


---

<a id="page-20"></a>
**Page 20**

CS 162 Fall 2010 Midterm I October 18th, 2010

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[ This page intentionally left blank\]

Page 20/22


---

<a id="page-21"></a>
**Page 21**

CS 162 Fall 2010 Midterm I October 18th, 2010

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[Scratch Page: Do not put answers here!\]

Page 21/22


---

<a id="page-22"></a>
**Page 22**

CS 162 Fall 2010 Midterm I October 18th, 2010

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[Scratch Page: Do not put answers here!\]

Page 22/22

