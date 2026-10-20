# Berkeley CS162 Fall 2005: Midterm 1: Official solutions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;University of California, Berkeley<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;College of Engineering<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Computer Science Division ⎯ EECS<br>
&emsp;Fall 2005                John Kubiatowicz<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Midterm I<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;SOLUTIONS<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;October 12th, 2005<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS162: Operating Systems and Systems Programming


![Figure on page 1](figures/solutions-p01-fig01.png)

General Information:<br>
This is a **closed book** exam.  You are allowed 1 page of **hand-written** notes (both sides).  You<br>
have 3 hours to complete as much of the exam as possible. Make sure to read all of the questions<br>
first, as some of the questions are substantially more time consuming.<br>
Write all of your answers directly on this paper.  Make your answers as concise as possible. On<br>
programming questions, we will be looking for performance as well as correctness, so think through<br>
your answers carefully.  If there is something about the questions that you believe is open to<br>
interpretation, please ask us about it!


![Figure on page 1](figures/solutions-p01-fig02.png)

&emsp;Page 1/20


---

<a id="page-2"></a>
**Page 2**

CS 162 Fall 2005 Midterm Exam I        October 12, 2005

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[ This page left for π \]

&emsp;&emsp;&emsp;&emsp;3.141592653589793238462643383279502884197169399375105820974944

Page 2/20


---

<a id="page-3"></a>
**Page 3**

CS 162 Fall 2005 Midterm Exam I        October 12, 2005


### Problem 1: Short Answer


### **Problem 1a\[2pts\]:**  Suppose a thread is running in a critical section of code, meaning that it has

acquired all the locks through proper arbitration.  Can it get context switched? Why or why not?<br>
&emsp;Yes it can get context switched. Locks (especially user-level locks) are independent of the<br>
&emsp;scheduler. ( Note that threads running in the kernel with interrupts disabled would not get<br>
&emsp;context-switched. )<br>
&emsp;&emsp;Grading Scheme: One point for the correct answer and one point for the explanation


### **Problem 1b\[3pts\]:** What are some of the hardware differences between kernel mode and user

mode?  Name at least three.<br>
There are many differences.  They all involve protection.  Here are a few possible answers:<br>
&emsp;&emsp;1\) There is a bit in a control register that is different (say 0=kernel, 1=user).<br>
&emsp;&emsp;2\) Hardware access to devices is usually unavailable in user mode.<br>
&emsp;&emsp;3\) Some instructions are available only in kernel mode.<br>
&emsp;&emsp;4\) Modifications to the page tables are only possible in kernel mode.<br>
&emsp;&emsp;5\) The interrupt controller can only be modified in kernel mode.<br>
&emsp;&emsp;6\) Other hardware control registers (such as system time, timer control, etc) are available<br>
&emsp;&emsp;&emsp;only in kernel mode.<br>
&emsp;&emsp;7\) Kernel memory is not available to users in user mode.<br>
&emsp;&emsp;Grading Scheme:  One point for each of the three differences


### **Problem 1c\[3pts\]:** Name three ways in which the processor can transition from user mode to

kernel mode.  Can the user execute arbitrary code after transitioning?<br>
&emsp;&emsp;1\) The user program can execute a trap instruction (for a system call)<br>
&emsp;&emsp;2\) The user program can perform a synchronous exception (bad address, bad instruction,<br>
&emsp;&emsp;&emsp;etc)<br>
&emsp;&emsp;3\) The processor transitions into kernel mode when responding to an interrupt.<br>
&emsp;The user cannot execute arbitrary code because entry to kernel mode is through a restricted set<br>
&emsp;of routines in the kernel – not in the user’s program.<br>
&emsp;Grading Scheme: ½  points for each of the different methods and then 1½ points for saying<br>
&emsp;you couldn't run arbitrary code after you switch.


### **Problem 1d\[3pts\]:** What is a thread?  What is a process?  Describe how to create each of these.

&emsp;A thread is a piece of an executing program.  It  contains a program counter (PC), processor<br>
&emsp;registers and a stack. A process consists of one or more threads in an address space.<br>
&emsp;&emsp;Threads are created by allocating a new stack and TCB, initializing the registers in the TCB<br>
&emsp;properly (so that the thread will execute, for instance, the ThreadRoot function), then placing<br>
&emsp;the new TCB on the ready queue.<br>
&emsp;&emsp;A process is created by allocating a new PCB, address space descriptor/page tables, and a<br>
&emsp;new thread.  In UNIX, processes are created by a fork() system call which also creates a<br>
&emsp;complete copy of the parent process for the new (child) process.<br>
&emsp;&emsp;Grading Scheme: One point for what is a thread, one point for what is a process, and one<br>
&emsp;point for how to create each of these.

Page 3/20


---

<a id="page-4"></a>
**Page 4**

CS 162 Fall 2005 Midterm Exam I        October 12, 2005


### **Problem 1e\[3pts\]:**  Suppose that we have a two-level page translation scheme with 4K-byte

&emsp;pages and 4-byte page table entries (includes a valid bit, a couple permission bits, and a pointer<br>
&emsp;to another page/table entry).  What is the format of a 32-bit virtual address?  Sketch out the<br>
&emsp;format of a complete page table.<br>
**12 bits10 bits10 bits12 bits10 bits10 bits**    **10 bits**   **10 bits**   **12 bits**


![Figure on page 4](figures/solutions-p04-fig03.png)

&emsp;Grading Scheme: 1 point for the virtual address format (1/2 for \[L1 page index, L2 page index,<br>
&emsp;offset\] and 1/2 point for # bits = 10,10,12) , 1 point for picture of single level page table,<br>
&emsp;1 point for multiple page tables linked together correctly


### **Problem 1f\[2pts\]:** What needs to be saved and restored on a context switch between two threads in

the same process?  What if the two threads are in different processes?  Be explicit.<br>
&emsp;Need to save the processor registers, stack pointer, program counter into the TCB of the thread<br>
&emsp;that is no longer running.  Need to reload the same things from the TCB of the new thread.<br>
&emsp;&emsp;When the threads are from different processes, need to not only save and restore what was<br>
&emsp;given above, but you also need to load the pointer for the top-level page-table of the new<br>
&emsp;address space.  You don’t need to save the old pointer, since this will not change and is<br>
&emsp;already stored in the PCB.<br>
&emsp;&emsp;Grading Scheme: 1 point for within process save/restore registers, stack pointer and PC<br>
&emsp;separate processes 1/2 point for same as "within process" + 1/2 for also need to save/restore<br>
&emsp;virtual memory info (page table base register)


### **Problem 1g\[1pt\]:** What is a thread-join operation?

&emsp;Thread-join is issued by one thread when it wants to stop and wait for the termination of<br>
&emsp;another thread. On termination of the target thread, the original thread resumes execution.<br>
&emsp;&emsp;Grading Scheme: 1 point for this thread waits for the joined-to thread to finish

Page 4/20


---

<a id="page-5"></a>
**Page 5**

CS 162 Fall 2005 Midterm Exam I        October 12, 2005


### **Problem 1h\[3pts\]:** Name at least three ways in which context-switching can happen in a non-

&emsp;preemptive scheduler.<br>
&emsp;1\) The user code can execute a yield() system call.<br>
&emsp;2\) The user code can request an I/O operation.<br>
&emsp;3\) The user code can request a wait() operation for another thread (such as thread-join).<br>
&emsp;Grading Scheme: 1 point per correct answer.  People who said traps/exceptions got no points<br>
&emsp;unless they somehow mentioned that it could be possible for a process to get killed by the OS.<br>
&emsp;Thereby, the OS would context-switch to a new thread because the old process had been<br>
&emsp;killed.  In this special case weI gave ½ point because the old process isn't context-switching so<br>
&emsp;much as it just gets killed.


### **Problem 1i\[3pts\]:** Name three ways in which processes on the same processor can communicate

with one another. If any of the techniques you name require hardware support, explain.<br>
&emsp;1\) Shared memory.  This requires translation hardware (segments or page tables) in order to<br>
&emsp;&emsp;&emsp;map a shared piece of DRAM into two different address spaces.<br>
&emsp;2\) Message passing.  Doesn’t require hardware support.<br>
&emsp;3\) Through the file system.  Doesn’t require hardware support (other than the support that<br>
&emsp;&emsp;&emsp;was already there for the file system).<br>
&emsp;Grading Scheme: 1 point per correct answer.  If other answers were given they had to be<br>
&emsp;explained fully to get any kind of credit - for example, some students mentioned Unix pipes<br>
&emsp;and communication by stdin/stdout, but this had to be explained fully to get credit.


### **Problem 1j\[2pts\]:** What is an interrupt?  What happens when an interrupt occurs?  What is the

function of an interrupt controller?<br>
&emsp;An interrupt is an external signal.  When interrupt occurs and is enabled (which means that it<br>
&emsp;is not masked off and the primary interrupt bit in the processor is turned on), then the<br>
&emsp;processor will stop the current running code, save the PC, disable interrupts, and jump to an<br>
&emsp;appropriate interrupt handler.  The function of the interrupt controller is to provide some<br>
&emsp;control over which hardware interrupt signals are enabled and what their priority is.<br>
&emsp;Grading Scheme: ½ point for giving the correct definition of an interrupt.  1 point for what<br>
&emsp;happens when an interrupt occurs.  Credit was not given for saying a context switch occurs.<br>
&emsp;To get full credit, you should have also mentioned something about an interrupt handler.  ½<br>
&emsp;point for the correct definition of an interrupt controller.

Page 5/20


---

<a id="page-6"></a>
**Page 6**

CS 162 Fall 2005 Midterm Exam I        October 12, 2005

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[ This page intentionally left blank \]

Page 6/20


---

<a id="page-7"></a>
**Page 7**

CS 162 Fall 2005 Midterm Exam I        October 12, 2005


### Problem 2: Monitors


### **Problem 2a\[2pts\]:** What is a monitor?

A monitor is a synchronization mechanism (as well as a style of programming) that abstracts<br>
away protection and scheduling access to shared data through the use of a lock and zero or<br>
more condition variables.


### **Problem 2b\[5pts\]:** Provide Java class definitions for each of the components of a monitor.  Include

specifications for local data and methods (names and arguments, not implementation); method<br>
names should adhere to the interface defined in class.  Make sure to document each method by<br>
saying what it should do.  Be brief!  Hint: you should have two different object classes.

`Class Lock {`    `Class ConditionVar {`<br>
`ThreadQueue Q;`       `ThreadQueue Q;`<br>
`Acquire(); //fun to acquire lock`       `Sleep(Lock lock); /* sleep`<br>
`Release(); //fun to release lock`    `thread until someone wakes`<br>
`}`    `it up */`<br>
`Wake(); /* wake one sleeping`<br>
`thread */`<br>
`WakeAll(); /* wake all`<br>
`sleeping threads */`<br>
`}`<br>
`Also accepted:`<br>
`Wait(Lock lock);`<br>
`Signal();`<br>
`Broadcast();`<br>
1pt for each of the functions. A lot of students decided to give the usage for a monitor. If you had<br>
methods like “enqueue and dequeue or something like that we gave 1 point if it looked reasonable<br>
and you showed an understanding of monitors. An answer that used locks and condition variables<br>
properly (i.e. writing out enqueue and dequeue for a protected queue) got 2pts. We were very<br>
generous here even though we explicitly said give class definitions and not implementations!


### **Problem 2c\[2pts\]:** What is the difference between Mesa and Hoare scheduling for monitors?

In a mesa scheduling, the thread that is doing the signaling retains the lock after the signal is done.<br>
The signaled thread is just put on the ready queue. However, in Hoare scheduling the thread that is<br>
doing the signaling atomically transfers the lock to the signaling thread and it gets to start running<br>
right away. When the signalee is done running it gives the lock back to the signaler when it is done.<br>
One point for each. We took of 0.5 points if you neglected to mention the that the signalee gives the<br>
lock back. Most of the students in the class forgot this.

Page 7/20


---

<a id="page-8"></a>
**Page 8**

CS 162 Fall 2005 Midterm Exam I        October 12, 2005


### **Problem 2d\[8pts\]:**  In parallel programs (one multi-threaded process), a common design methodology

is to perform processing in sequential stages. All of the threads work independently during each stage,<br>
but they must synchronize at the end of each stage at a synchronization point called a barrier. If a<br>
thread reaches the barrier before all other threads have arrived, it waits.  When all threads reach the<br>
barrier, they are notified and can begin execution on the next phase of the computation.<br>
Example:<br>
While (true) {<br>
Compute stuff;<br>
BARRIER();<br>
Read other threads results;<br>
}<br>
There are three complications to barriers.  First, there is no master thread that controls the threads,<br>
waits for each of them to reach the barrier, and then tells them to restart. Instead, the threads must<br>
monitor themselves and determine when they should wait or proceed. Second, for many dynamic<br>
programs, the number of threads that will be created during the lifetime of the parallel program is<br>
unknown in advance, since a thread can spawn another thread, which will start in the same program<br>
stage as the thread that created it.  Third, a thread may end before the barrier.  In all cases, all threads<br>
must wait at the barrier for all other threads before anyone is allowed to proceed.<br>
Provide the pseudo-code for a monitor class called **Barrier** that enables this style of barrier<br>
synchronization.  Your solution must support creation of a new thread (an additional thread that needs<br>
to synchronize), termination of a thread (one less thread that needs to synchronize), waiting when a<br>
thread reaches the barrier early, and releasing waiting threads when the last thread reaches the barrier.<br>
Implement your solution using monitors. You should never busy-wait; threads waiting at a barrier<br>
should be sleeping.<br>
Your class must implement the following three methods: `threadCreated(), threadEnd(),`<br>
`and enterBarrier()`.  Think carefully about efficiency and avoid unnecessary looping.  Feel<br>
free to utilize space on the next page.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Solution: See next page

Page 8/20


---

<a id="page-9"></a>
**Page 9**

CS 162 Fall 2005 Midterm Exam I        October 12, 2005

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[ This page intentionally left blank \]<br>
&emsp;&emsp;`Class Barrier() {`

&emsp;&emsp;`int numWaiting = 0;`    `// Initially, no one at barrier`<br>
&emsp;&emsp;`int numExpected = 0;`    `// Initially, no one expected`

&emsp;&emsp;`Lock L;`<br>
&emsp;&emsp;`ConditionVar CV;`

&emsp;&emsp;`threadCreated() {`<br>
&emsp;&emsp;`L.Acquire();`<br>
&emsp;&emsp;`numExpected++;`    `// Increase expected number`<br>
&emsp;&emsp;`L.Release();`<br>
&emsp;&emsp;`}`

&emsp;&emsp;`threadEnd() {`<br>
&emsp;&emsp;`L.Acquire();`<br>
&emsp;&emsp;`numExpected--;`    `// Decrease expected number`<br>
&emsp;&emsp;`if (numExpected == numWaiting) { // If we are last at barrier`<br>
&emsp;&emsp;`numWaiting=0;`    `// Reset barrier and wake threads`<br>
&emsp;&emsp;`CV.broadcast();`<br>
&emsp;&emsp;`}`<br>
&emsp;&emsp;`L.Release();`<br>
&emsp;&emsp;`}`

&emsp;&emsp;`enterBarrier() {`<br>
&emsp;&emsp;`L.Acquire();`<br>
&emsp;&emsp;`numWaiting++;`    `// We are one more waiter`<br>
&emsp;&emsp;`if (numExpected == numWaiting) { // If we are the last`<br>
&emsp;&emsp;`numWaiting = 0;`    `// Reset barrier and wake threads`<br>
&emsp;&emsp;&emsp;`CV.broadcast();`<br>
&emsp;&emsp;`} else {`<br>
&emsp;&emsp;`CV.sleep(L);`     `// Else, put us to sleep`<br>
&emsp;&emsp;`}`<br>
&emsp;&emsp;`L.Release()`<br>
&emsp;&emsp;`}`<br>
&emsp;&emsp;`}`<br>
Previous solutions said while loops were ok for the condition check in enter barrier. This is NOT true.<br>
While loops break the code from working with back-to-back barriers. And we took of 2 points.<br>
The points were taken off as follows:<br>
If you forgot to reset the numWaiting we took off a point since it wouldn’t work for back-to-back<br>
barriers (but it wasn’t a big mistake).<br>
If you forgot to make the check in threadEnd to broadcast we took off a point<br>
If your code didn’t work for multiple back-to-back barriers then we took of 2 points.<br>
If your code had bad synchronization (i.e. no locking or the use of interrupts) we took of 4 points.<br>
&emsp;If the solution was headed in the right direction but was obviously flawed we gave 1 to 2 points<br>
(depending on how much it was headed in the right direction and how clear your explanation was).

Page 9/20


---

<a id="page-10"></a>
**Page 10**

CS 162 Fall 2005 Midterm Exam I        October 12, 2005


### Problem 3: Lock-Free Queue

An object such as a queue is considered “lock-free” if multiple processes can operate on this object<br>
simultaneously without requiring the use of locks, busy-waiting, or sleeping. In this problem, we are<br>
going to construct a lock-free FIFO queue using an atomic “swap” operation. This queue needs both<br>
an `Enqueue` and `Dequeue` method.<br>
We are going to do this in a slightly different way than normally.  Rather than `Head` and `Tail`<br>
pointers, we are going to have “`PrevHead`” and `Tail` pointers.  `PrevHead` will point at the last<br>
object returned from the queue.  Thus, we can find the head of the queue (for dequing). Here are the<br>
basic class definitions (assuming that only one thread accesses the queue at a time):

`// Holding cell for an entry`<br>
`class QueueEntry {`<br>
`QueueEntry next = null;`<br>
`Object stored;`<br>
`int taken = 0;`

`QueueEntry(Object newobject) {`<br>
`stored = newobject;`<br>
`}`<br>
`}`<br>
`// The actual Queue (not yet lock free!)`<br>
`class Queue {`<br>
`QueueEntry prevHead = new QueueEntry(null);`<br>
`QueueEntry tail = prevHead;`

`void Enqueue(Object newobject)  {`<br>
`QueueEntry newEntry = new QueueEntry(newobject);`<br>
`tail.next = newEntry;`<br>
`tail = newEntry;`<br>
`}`

`Object Dequeue() {`<br>
`QueueEntry nextEntry = prevHead.next;`<br>
`While ((nextEntry != null) && nextEntry.taken == 1) {`<br>
`nextEntry = nextEntry.next;`<br>
`}`<br>
`if (nextEntry == null) {`<br>
`return null;`<br>
`} else {`<br>
`nextEntry.taken = 1;`<br>
`prevHead = nextEntry;`<br>
`return nextEntry.stored;`<br>
`}`<br>
`}`<br>
`}`

Page 10/20


---

<a id="page-11"></a>
**Page 11**

CS 162 Fall 2005 Midterm Exam I        October 12, 2005


### **Problem 3a\[10pts\]:**

Suppose that we have an atomic swap instruction.  This instruction takes a local variable (register) and<br>
a memory location and swaps the contents.  Although Java doesn’t contain pointers, we might describe<br>
this as follows:<br>
O`bject AtomicSwap(variable addr, Object newValue) {`<br>
`object result = *addr``;`   `// get old object stored in addr`<br>
`*addr` `=` `newValue``;`        `// store new object into addr`<br>
`return result;`         `// Return old contents of addr`<br>
`}`<br>
With this primitive, we might build a test-and-set lock as follows:<br>
`int mylock = 0;`<br>
`// grab lock`<br>
`while (AtomicSwap(mylock,1) == 1);`<br>
`// got lock`<br>
Rewrite code for `Enqueue()`, using the `AtomicSwap()` operation, such that it will work for any number of<br>
simultaneous Enqueue and Dequeue operations.  You should never need to busy wait.  **Do not use locking (i.e.**<br>
**don’t use a test-and-set lock).** The solution is tricky but can be done in a few lines. We will be grading on<br>
conciseness. Hint: during simultaneous insertions, objects may be temporarily disconnected from the queue (i.e.<br>
the set of entries reachable by `nextEntry = nextEntry.next`  starting from `prevEntry`); but<br>
eventually the queue needs to be connected.<br>
Solution: One of the most important things about this solution is that it still has to work for single-<br>
threaded execution!!!! We were not very forgiving of solutions that produced loops and other<br>
anomalies when running single-threaded.<br>
The key to this solution is to atomically insert the new element at the tail of the list. What it<br>
means to be at the “tail of the list” is that new elements will be added after you. We need to make<br>
sure that the system presents a single insertion order within the queue (i.e. no reordering after<br>
insertion), since Dequeue operations are occurring in parallel with insertions. Technique: we use a<br>
single AtomicSwap to set our insertion order, then reconnect the queue afterwards using a single<br>
store operation.<br>
`void Enqueue(Object newobject)  {`<br>
&emsp;&emsp;&emsp;`QueueEntry newEntry = new QueueEntry(newobject);`<br>
&emsp;&emsp;&emsp;`QueueEntry oldTail = AtomicSwap(tail,newEntry);`<br>
&emsp;&emsp;&emsp;`oldTail.next = newEntry;`<br>
`}`<br>
Further explanation: After the swap, the new entry is not yet attached to the beginning of the list,<br>
but has become the new tail (and may get new items added to it). To reconnect the list, we merely<br>
need to store our identity into the next field of the old tail (the element that was the tail when we<br>
performed our swap). Until we reconnect the list, Dequeue() operations may free everything up to<br>
and including the oldTail.  However, they will go no further (since the next field of the oldTail is<br>
null up to the moment that the new element is added to the end).<br>
&emsp;&emsp;Sample grading constraints: Wrong AtomicSwap: -4, (although some close results got -2),<br>
Ignoring return from AtomicSwap: -3 (unless you were otherwise really close), Solution not<br>
working for single-threaded: discount up to -6, depending on circumstances. Tail not updated<br>
correctly: -3

Page 11/20


---

<a id="page-12"></a>
**Page 12**

CS 162 Fall 2005 Midterm Exam I        October 12, 2005


### **Problem 3b\[10pts\]:**

Rewrite code for Dequeue() such that it will work for any number of simultaneous threads working at<br>
once.  **Again, do not use locking.** You should never need to busy wait. The solution is tricky but can<br>
be done by modifying a small number of lines. We will be grading on conciseness.  Hint: before<br>
grabbing a queue entry, make sure that you “take” it atomically. You are striving for correctness. If<br>
you can explain why it is ok, you can allow prevHead to get temporarily out of date, but try to avoid<br>
letting prevHead get too far behind the actual head of the list.<br>
Solution: Once again, your solution must work single-threaded!<br>
&emsp;Carefully compare the solution to the original: very little has changed! (other than the prevHead<br>
update code). The key here is walking down the list, starting at `prevHead.next` and trying to<br>
atomically set the taken variable to one. Only one lucky thread will get the privilege of setting the<br>
taken variable of a particular entry to 1 (as indicated by a return of zero from the AtomicSwap).<br>
Once we have succeeded in acquiring an entry, we can take our time actually using it.<br>
&emsp;Although we could set `prevHead=nextEntry` and be done with it, this would not guarantee<br>
that `prevHead` wasn’t set backwards by some parallel dequeueing thread. Note also that we have<br>
to be very careful not to set prevHead to null, since our queue interface assumes at least one entry<br>
always present. Our solution is to set the prevHead variable to be equal to the last QueueEntry with<br>
a taken value of 1. The important sequence is to first set prevHead, then check for additional entries.<br>
Given that ordering, we know that, when we stop setting prevHead, it is truly the most recent entry<br>
for a brief moment.<br>
&emsp;&emsp;`Object Dequeue() {`<br>
&emsp;&emsp;`QueueEntry nextEntry = prevHead.next;`<br>
&emsp;&emsp;`While ((nextEntry != null) && AtomicSwap(nextEntry.taken,1) == 1){`<br>
&emsp;&emsp;`nextEntry = nextEntry.next;`<br>
&emsp;&emsp;`}`<br>
&emsp;&emsp;`if (nextEntry == null) {`<br>
&emsp;&emsp;`return null;`<br>
&emsp;&emsp;`} else {`<br>
&emsp;&emsp;`Object stored = nextEntry.stored;`

&emsp;&emsp;`// Do our best to set prevHead to last taken entry`<br>
&emsp;&emsp;`// Order here is important (set prevHead, then check)`<br>
&emsp;&emsp;`do {`<br>
&emsp;&emsp;`prevHead = nextEntry;`<br>
&emsp;&emsp;`nextEntry = nextEntry.next;`<br>
&emsp;&emsp;`} until (nextEntry == null || nextEntry.taken == 0);`

&emsp;&emsp;`return stored;`<br>
&emsp;&emsp;`}`<br>
&emsp;&emsp;`}`<br>
Sample grading constraints: Wrong AtomicSwap: -4, (although some close results got -2), Ignoring<br>
return from AtomicSwap: -3 (unless you were otherwise really close), Solution not working for<br>
single-threaded: discount up to -6, depending on circumstances. Not getting the prevHead update as<br>
shown above: -1 (not really very bad).<br>
&emsp;&emsp;Several people mixed up types! They ignored the queueEntry type and assumed that the objects<br>
being    stored    on    the    queue    had    “.next”    elements.    Or,    they    did    something    like:<br>
`AtomicSwap(prevHead,nextEntry.stored)`: these two items are very different!<br>
Page 12/20


---

<a id="page-13"></a>
**Page 13**

CS 162 Fall 2005 Midterm Exam I        October 12, 2005


### Problem 4: Scheduling


### **Problem 4a\[2pts\]:**

Six jobs are waiting to be run. Their expected running times are 10, 8, 6, 3, 1, and X. In what order<br>
should they be run to minimize average completion time? State the scheduling algorithm that should<br>
be used AND the order in which the jobs should be run. (Your answer will depend on X).<br>
Shortest Job First or Shortest Remaining Processing Time<br>
X \<= 1       X, 1, 3, 6, 8, 10    Answers that mentioned something about scheduling X by<br>
1 \< X \<= 3    1, X, 3, 6, 8, 10    ordering the processes in ascending order by running times<br>
3 \< X \<= 6    1, 3, X, 6, 8, 10    were accepted.<br>
6 \< X \<= 8    1, 3, 6, X, 8, 10<br>
8 \< X \<= 10 1, 3, 6, 8, X, 10<br>
X \> 10     1, 3, 6, 8, 10, X


### **Problem 4b\[4pts\]:**

Name and describe 4 different scheduling algorithms. What are the advantages and disadvantages of<br>
each?<br>
FCFC (FIFO) – The first process that arrives gets to run all the way to completion<br>
\+ Simple and quick to choose the next thread<br>
\+ Fair in the sense that jobs run in the order they arrived<br>
\- Long wait times for short jobs that get stuck behind long jobs<br>
\- Not fair for jobs that can finish very quickly but must wait a long time<br>
Round Robin – Scheduler rotates through all threads, allowing each to run for some time quantum<br>
\+ Fair because gives every thread a chance to run<br>
\- Potentially large overhead from frequent context switching<br>
\- Can result in large completion times, especially for threads with similar run times<br>
Shortest Job First – Scheduler runs the shortest job first, non-preemptive<br>
\+ Results in low average completion time<br>
\- Long jobs can et stuck behind short jobs<br>
\- Requires knowledge of the future, hard to predict<br>
Shortest Remaining Processing Time – Works like SJF, but preemptive<br>
+/- Same as SJF<br>
Priority Scheduler – Assign threads different priorities, run them in order of priority<br>
\+ Important threads get run first<br>
\- Low priority threads can starve<br>
Lottery Scheduler – Give threads tickets and hold a lottery to pick the next thread to run<br>
\+ Allows high priority threads to run quickly, but low priority threads still make progress<br>
\- More difficult to implement, may take longer to pick next thread than other algorithms<br>
You needed to have the description of the scheduler, one advantage, and one disadvantage to get full<br>
credit.

Page 13/20


---

<a id="page-14"></a>
**Page 14**

CS 162 Fall 2005 Midterm Exam I        October 12, 2005


### **Problem 4c\[3pts\]:**

Here is a table of processes and their associated running times. All of the processes arrive in numerical<br>
order at time 0.


![Figure on page 14](figures/solutions-p14-fig04.png)

Show the scheduling order for these processes under 3 policies: First Come First Serve (FCFS),<br>
Shortest-Remaining-Time-First (SRTF), Round-Robin (RR) with timeslice quantum = 1


![Figure on page 14](figures/solutions-p14-fig05.png)

Page 14/20


---

<a id="page-15"></a>
**Page 15**

CS 162 Fall 2005 Midterm Exam I        October 12, 2005


### **Problem 4d\[3pts\]:**

For each process in each schedule above, indicate the queue wait time and completion time (otherwise<br>
known as turnaround time, TRT).  Note that wait time is the total time spend waiting in queue (all the<br>
time in which the task is not running):


![Figure on page 15](figures/solutions-p15-fig06.png)


### **Problem 4e\[3pts\]:**

Suppose that the context-switch time is 0.5 units.  Assume that there is no context switch at time zero.<br>
Fill out this table again:


![Figure on page 15](figures/solutions-p15-fig07.png)


### **Problem 4f\[3pts\]:**

The SRTF algorithm requires knowledge of the future.  Why is that?  Name two ways to approximate<br>
the information required to implement this algorithm.<br>
SRTF needs to know the future so it can choose the thread with the shortest processing time as the next<br>
thread to run.  This can be approximated by having processes state what their approximate running<br>
times are when created.  Past behavior can also be used to approximate the future – CPU bursts,<br>
average running time for a process, etc.  Multi-level feedback queues can also be used to approximate<br>
the behavior of SRTF by penalizing threads that run a long time and rewarding threads that finish<br>
quickly.

Page 15/20


---

<a id="page-16"></a>
**Page 16**

CS 162 Fall 2005 Midterm Exam I        October 12, 2005

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[ This page intentionally left blank \]

Page 16/20


---

<a id="page-17"></a>
**Page 17**

CS 162 Fall 2005 Midterm Exam I        October 12, 2005


### Problem 5: Deadlock


### **Problem 5a\[2pts\]:**

List the conditions for deadlock.<br>
&emsp;**(½ point each)**<br>
&emsp;Hold & wait<br>
&emsp;Circular dependency/circular wait<br>
&emsp;No preemption of resources<br>
&emsp;Mutual exclusion


### **Problem 5b\[3pts\]:**

What are three methods of dealing with the possibility of deadlock?  Explain each method and its<br>
consequences to programmer of applications.<br>
&emsp;**(1 point each)**<br>
&emsp;Ignore it – do nothing about it.  Application programmers have to deal with deadlock or not care<br>
&emsp;if it happens<br>
&emsp;Prevent it – use Banker’s Algorithm and only allow allocations that cannot possibly lead to<br>
&emsp;deadlock.  Application programmer has to specify maximum possible resource needs<br>
&emsp;Detect it and recover – check dependency graph for cycles and kill a thread in the cycle.<br>
&emsp;Application programmer has to deal with their threads possibly getting killed.<br>
&emsp;**Many lost 1 point total for skipping all of the “consequences to the programmer of**<br>
&emsp;**applications”.**<br>
&emsp;**A common mistake was to say what the OS programmer had to do.**


### **Problem 5c\[3pts\]:**

Suppose that we have several processes and several resources.  Name three ways of preventing<br>
deadlock between these processes<br>
&emsp;**(1 point each)**<br>
&emsp;Atomically acquire all resources at the start of execution<br>
&emsp;Use the Banker’s Algorithm<br>
&emsp;Acquire all resources in a specified order<br>
&emsp;**Many other possible answers**

Page 17/20


---

<a id="page-18"></a>
**Page 18**

CS 162 Fall 2005 Midterm Exam I        October 12, 2005


### **Problem 5d\[5pts\]:**

Suppose that we have the following resources: A, B, C and threads T1, T2, T3, T4.  The total number<br>
of each resource is:


![Figure on page 18](figures/solutions-p18-fig08.png)

Further, assume that the processes have the following maximum requirements and current allocations:


![Figure on page 18](figures/solutions-p18-fig09.png)

Is the system potentially deadlocked (i.e. unsafe)?  In making this conclusion, you must show all your<br>
steps, intermediate matrices, etc.<br>
Solution: part of “showing the steps” involved producing intermediate matrices:<br>
&emsp;**(1 point)**    **(1 point)**<br>
&emsp;Available:    Need:


![Figure on page 18](figures/solutions-p18-fig10.png)


![Figure on page 18](figures/solutions-p18-fig11.png)

&emsp;**(1 point for “No”, 2 points for explanation)**<br>
&emsp;No.  Running the Banker’s Algorithm, we see that we can give T4 all the resources it might need<br>
&emsp;and run it to completion.  After T4, we do the same for T3, then T2, then T1<br>
&emsp;Available after running:


![Figure on page 18](figures/solutions-p18-fig12.png)

&emsp;Many other orderings are possible (T3 or T4 first, then basically any order after that)

Page 18/20


---

<a id="page-19"></a>
**Page 19**

CS 162 Fall 2005 Midterm Exam I        October 12, 2005


### **Problem 5e\[3pts\]:**

Assuming the allocations in (5d), suppose that T1 asks for 2 more copies of A.  Can the system<br>
grant this or not?  Explain.<br>
Solution:<br>
No, if we allocate two more A to T1, then    and T1’s new need is


![Figure on page 19](figures/solutions-p19-fig13.png)

the available resources are:


![Figure on page 19](figures/solutions-p19-fig14.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;(other threads’ needs are the same)

Because we need more B to guarantee that T1 can run, and we need more A to guarantee that<br>
T2, T3, or T4 can run, this is an unsafe state<br>
**(1 point for “No”)**<br>
**(1 point for T1’s new need vector or explanation of T1’s new need)**<br>
**(1 point for “No thread can meet it’s need now”)**<br>
**Alternate (mostly wrong) answer:**<br>
**(1 point for “Yes, because there are enough A available”)**


### **Problem 5f\[4pts\]:**

Assuming the allocations in (5d), what is the maximum number of additional copies of resources<br>
(A, B, and C) that T1 can be granted in a single request without risking deadlock? Explain.<br>
Solution: the following is the max possible:


![Figure on page 19](figures/solutions-p19-fig15.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;enough resources to run each of the other<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;threads in turn, therefore no deadlock can<br>
From 5e, we know that we cannot grant 2A.  occur.<br>
This is thus the max we might be able to **2 points for**


![Figure on page 19](figures/solutions-p19-fig16.png)

allocate (because only 1B and 1C are even<br>
available).  If we grant 1A, 1B, and 1C to T1,<br>
we can see the new need vector for T1 is    **-1 point for one number being off by one,**


![Figure on page 19](figures/solutions-p19-fig17.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**except**


![Figure on page 19](figures/solutions-p19-fig18.png)

And the new available resources vector is


![Figure on page 19](figures/solutions-p19-fig19.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**is -2 for just being the same as avail**<br>
This is enough resources to grant T3 its max **1 point for “We can run T3”**<br>
and run it to completion (thus freeing its **1 point for “After running T3, we have**<br>
resources).  After finishing T3, we have **enough resources to run the rest”**

Page 19/20


---

<a id="page-20"></a>
**Page 20**

CS 162 Fall 2005 Midterm Exam I        October 12, 2005

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**\[ This page intentionally left blank \]**

Page 20/20

