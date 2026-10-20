# Berkeley CS162 Fall 2007: Midterm 1: Official solutions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;University of California, Berkeley<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;College of Engineering<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Computer Science Division ⎯ EECS<br>
&emsp;Fall 2007                John Kubiatowicz<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Midterm I<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;SOLUTIONS<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;October 10th, 2007<br>
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

&emsp;Page 1/18


---

<a id="page-2"></a>
**Page 2**

CS 162 Fall 2007 Midterm Exam I        October 10, 2007

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[ This page left for π \]

&emsp;&emsp;&emsp;&emsp;3.141592653589793238462643383279502884197169399375105820974944

Page 2/18


---

<a id="page-3"></a>
**Page 3**

CS 162 Fall 2007 Midterm Exam I        October 10, 2007


### Problem 1: Short Answer \[15pts\]


### **Problem 1a\[2pts\]:** Name two ways in which processes on the same processor can communicate

with one another. If any of the techniques you name require hardware support, explain.<br>
&emsp;&emsp;1\) Shared memory. Typically requires hardware support for cache coherence and<br>
&emsp;&emsp;&emsp;translation mechanisms (page tables).<br>
&emsp;&emsp;2\) Message passing. Done through kernel, typically doesn’t require much hardware<br>
&emsp;&emsp;&emsp;support.<br>
&emsp;&emsp;3\) File System. Hardware support might include the disk, although this is necessary for<br>
&emsp;&emsp;&emsp;other uses as well.


### **Problem 1b\[2pts\]:** What is an interrupt? What is the function of an interrupt controller?

&emsp;&emsp;An interrupt is an electrical signal that causes the processor to stop the current execution<br>
&emsp;&emsp;and begin to execute interrupt handler code. The interrupt controller is a component<br>
&emsp;&emsp;between I/O devices and the processor that filters incoming interrupt signals on their way to<br>
&emsp;&emsp;the processor; among other things, it allows the operating system to mask out certain<br>
&emsp;&emsp;interrupts to enable the establishment of interrupt priority.


### **Problem 1c\[3pts\]:**  Suppose that we have a two-level page translation scheme with 4K-byte pages

and 4-byte page table entries (includes a valid bit, a couple permission bits, and a pointer to another<br>
page/table entry).  What is the format of a 32-bit virtual address?  Sketch out the format of a<br>
complete page table.<br>
**12 bits10 bits10 bits12 bits10 bits10 bits**    **10 bits**   **10 bits**   **12 bits**


![Figure on page 3](figures/solutions-p03-fig03.png)

Page 3/18


---

<a id="page-4"></a>
**Page 4**

CS 162 Fall 2007 Midterm Exam I        October 10, 2007


### **Problem 1d\[2pts\]:** Which company was the first to develop a workstation with a mouse and

overlapping windows?<br>
&emsp;&emsp;**Xerox (The Xerox PARC research lab)**


### **Problem 1e\[2pt\]:** What is a thread-join operation?

&emsp;&emsp;**A thread-join operation allows a thread to wait for another thread to finish. It puts the**<br>
&emsp;&emsp;**calling thread to sleep and wakes when the target thread exits.**


### **Problem 1f\[2pts\]: True or False:** When designing a multithreaded application, you must use

synchronization primitives to make sure that the threads do not overwrite each other’s registers.<br>
Explain.<br>
&emsp;&emsp;FALSE. The thread scheduler is responsible for making sure that each thread has its own<br>
&emsp;&emsp;set of register values (stored in the TLB). A TLB is never shared between threads.


### **Problem 1g\[2pts\]: True or False:** A system that provides segmentation without paging puts holes

in the physical address space, forcing the operating system to waste physical memory. Explain.<br>
&emsp;&emsp;FALSE. Segmentation potentially puts holes in the VIRTUAL space, but doesn’t require<br>
&emsp;&emsp;holds in the physical address space, since the segmentation mapping is free to use any<br>
&emsp;&emsp;contiguous blocks of memory.

Page 4/18


---

<a id="page-5"></a>
**Page 5**

CS 162 Fall 2007 Midterm Exam I        October 10, 2007


### Problem 2: Multithreading \[17 pts\]

Consider the following two threads, to be run concurrently in a shared memory (all variables are<br>
shared between the two threads):


![Figure on page 5](figures/solutions-p05-fig04.png)

Assume a single-processor system, that load and store are atomic, that x is initialized to 0 before<br>
either thread starts, and that x must be loaded into a register before being incremented (and stored<br>
back to memory afterwards).  The following questions consider the final value of x after both<br>
threads have completed.


### **Problem 2a\[2 pts\]:** Give a concise proof why `x≤15` when both threads have completed.

&emsp;&emsp;Each x=x+1 statement can either do nothing (if erased by Thread B) or increase x by 1.<br>
&emsp;&emsp;Each x=x+2 statement can either do nothing (if erased by Thread A) or increase x by 2.<br>
&emsp;&emsp;Since there are 5 of each type, and since x starts at 0, x is ¥ 0 and x§ (5μ1)+(5μ2)=15


### **Problem 2b\[4 pts\]:** Give a concise proof why `x≠1` when both threads have completed.

&emsp;&emsp;Every store into x from either Thread A or B is ¥ 0, and once x becomes ¥ 0, it stays ¥ 0.<br>
&emsp;&emsp;The only way for x=1 is for the last x=x+1 statement in Thread A to load a zero and store a<br>
&emsp;&emsp;one. However, there are at least four stores from Thread A previous to the load for the last<br>
&emsp;&emsp;statement, meaning that it couldn’t have loaded a zero.


### **Problem 2c\[3pts\]:** Suppose we replace ‘**x = x+2**’ in Thread B with an atomic double increment

operation **atomicIncr2(x)** that cannot be preempted while being executed.  What are all the possible<br>
final values of `x`?  Explain.<br>
&emsp;&emsp;Final values are 5, 7, 9, 11, 13, or 15.  The x=x+2 statements can be “erased” by being<br>
&emsp;&emsp;between the load and store of an x=x+1 statement.  However, since the x=x+2 statements<br>
&emsp;&emsp;are atomic, the x=x+1 statements can never be “erased” because the load and store phases<br>
&emsp;&emsp;of x=x+2 cannot be separated. Thus, our final value is at least 5 (from Thread A) with from<br>
&emsp;&emsp;0 to 5 successful updates of x=x+2.

Page 5/18


---

<a id="page-6"></a>
**Page 6**

CS 162 Fall 2007 Midterm Exam I        October 10, 2007


### **Problem 2d\[3pts\]:** What needs to be saved and restored on a context switch between two threads in

the same process?  What if the two threads are in different processes?  Be explicit.<br>
&emsp;Need to save the processor registers, stack pointer, program counter into the TCB of the<br>
&emsp;thread that is no longer running.  Need to reload the same things from the TCB of the new<br>
&emsp;thread.<br>
&emsp;&emsp;When the threads are from different processes, need to not only save and restore what was<br>
&emsp;given above, but you also need to load the pointer for the top-level page-table of the new<br>
&emsp;address space.  You don’t need to save the old pointer, since this will not change and is<br>
&emsp;already stored in the PCB.


### **Problem 2e\[2pts\]:** Under what circumstances can a multithreaded program complete more quickly

than a non-multithreaded program? Keep in mind that multithreading has context-switch overhead<br>
associated with it.<br>
&emsp;&emsp;When there is a lot of blocking that may occur (such as for I/O) and parts of the program<br>
&emsp;&emsp;can still make progress while other parts are blocked.


### **Problem 2f\[3pts\]:** What is simultaneous multithreading (or “Hyperthreading”)?  Name two ways in

which this differs from the type of multithreading done by the operating system.<br>
&emsp;&emsp;Simultaneous multithreading utilizes spare issue slots in a superscalar processor to support<br>
&emsp;&emsp;multithreading. It allows multiple threads to be loaded into the processor simultaneously.<br>
&emsp;&emsp;Simultaneous multithreading differs from the type of multithreading done by the operating<br>
&emsp;&emsp;system in several ways: (1) the multiplexing is done in hardware rather than software, (2)<br>
&emsp;&emsp;the multiplexing can interleave threads on an instruction by instruction basis, whereas the<br>
&emsp;&emsp;operating system interleaves with a 10ms (or more) quantum (3) the overhead for switching<br>
&emsp;&emsp;between threads is a single cycle in simultaneous multithreading rather than many cycles in<br>
&emsp;&emsp;the operating system (4) simultaneous multithreading can only handle a small number of<br>
&emsp;&emsp;threads at a time, whereas the operating system can handle many threads.

Page 6/18


---

<a id="page-7"></a>
**Page 7**

CS 162 Fall 2007 Midterm Exam I        October 10, 2007


### Problem 3: Hoare Scheduling \[25pts\]

Assume that you are programming a multiprocessor system using threads.  In class, we talked about<br>
two different synchronization primitives: Semaphores and Monitors.  In this problem, we are going<br>
to implement Monitors with Hoare scheduling by using Semaphores<br>
The interface for a Semaphore is as follows:<br>
`public class Semaphore {`<br>
`public Semaphore(int initialValue) {`<br>
`/* Create and return a semaphore with initial value: initialValue */`<br>
`…`<br>
`}`<br>
`public P() {`<br>
`/* Call P() on the semaphore */`<br>
`…`<br>
`}`<br>
`public V() {`<br>
`/* Call V() on the semaphore */`<br>
`}`<br>
`}`<br>
As we mentioned in class, a Monitor consists of a Lock and one or more Condition Variables. The<br>
interfaces for these two types of objects are as follows:

`public class Lock {`    `public class CondVar {`<br>
`public Lock() {`        `public CondVar(Lock lock) {`<br>
`/* Create new Lock */`            `/* Creates a condition variable`<br>
`…`                `associated with Lock lock. */`<br>
`}`                 `…`<br>
`}`<br>
`public void Acquire() {`        `public void Wait() {`<br>
`/* Acquire Lock */`            `/* Block on condition variable *’/`<br>
`…`             `…`<br>
`}`             `}`<br>
`public void Release() {`        `public void Signal() {`<br>
`/* Release Lock */`            `/* Wake one thread (if it exists) */`<br>
`…`             `…`<br>
`}`             `}`<br>
`}`             `}`


### **Problem 3a\[3pts\]:** What is the difference between Mesa and Hoare scheduling for monitors? Focus

your answer on what happens during the execution of Signal(). Hint: Mesa scheduling requires all<br>
conditional wait statements to be wrapped in “while” loops (see 3b).<br>
&emsp;&emsp;With Mesa scheduling, the signaling thread keeps the lock and CPU and puts the signaled<br>
&emsp;&emsp;thread on the ready queue for later execution. With Hoare scheduling, the signaling thread<br>
&emsp;&emsp;gives the lock and CPU to the signaled thread and sleeps. Later, when the signaled thread<br>
&emsp;&emsp;executes wait() or releases the lock, it returns the lock to the signaled thread and wakes it.<br>
&emsp;&emsp;Note that we didn’t give full credit for answers that said that the signaled thread runs<br>
&emsp;&emsp;immediately without also saying either that the signaling thread sleeps or that the signaling<br>
&emsp;&emsp;thread gives the CPU to the signaled thread.

Page 7/18


---

<a id="page-8"></a>
**Page 8**

CS 162 Fall 2007 Midterm Exam I        October 10, 2007


### **Problem 3b\[2pts\]:** When programming with a Mesa-scheduled monitor, the programmer must

enclose all conditional wait operations with a while loop like this:

&emsp;`while (condition unsatisfied)`<br>
`C.Wait();`<br>
What might happen if they did not do this?  How might this happen?<br>
&emsp;&emsp;If they only checked the condition once, then it is possible that the thread would exit wait()<br>
&emsp;&emsp;with the condition unsatisfied.  This might happen because a signaled thread is only placed<br>
&emsp;&emsp;on the ready queue, not run immediately; hence another thread could change the condition<br>
&emsp;&emsp;between the time that the signaled thread was placed on the ready queue and the time that it<br>
&emsp;&emsp;exited wait().<br>
&emsp;&emsp;Note that we did not give full credit if you didn’t mention an intervening thread changing<br>
&emsp;&emsp;the condition. We also did not give full credit to people who claimed that multiple threads<br>
&emsp;&emsp;would enter the critical section at the same time – this is not true.


### **Problem 3c\[2pts\]:** Explain why a Hoare-scheduled monitor allows the programmer to replace the

“while” statement in (3b) with an “if”.<br>
&emsp;&emsp;Since the signaled thread is run immediately after being signaled, there is no chance for<br>
&emsp;&emsp;another thread to change the condition before the first thread can deal with it.


### **Problem 3d\[3pts\]:** Assume that we implement a Hoare-scheduled monitor with semaphores.

Clearly, we will need one semaphore to implement mutual exclusion. Further, each condition<br>
variable will utilize a semaphore to hold its queue of sleeping threads. Give at least 3 reasons why<br>
the following implementation of wait() and signal() is incorrect:

&emsp;&emsp;`wait() { CVSemi.p(); }`<br>
&emsp;&emsp;`signal() {CVSemi.v(); }`<br>
&emsp;&emsp;There are many answers here.  A few are as follows:<br>
&emsp;&emsp;1\) calling of signal() when no waiting threads will cause subsequent call of wait() to exit<br>
&emsp;&emsp;&emsp;without waiting.<br>
&emsp;&emsp;2\) wait() neglects to release lock, hence causing deadlock.<br>
&emsp;&emsp;3\) Signal doesn’t put signaling thread to sleep<br>
&emsp;&emsp;4\) Wait does not wake sleeping signaler, if there is one<br>
&emsp;&emsp;We did not accept claims that there is no lock in the above implementation; the lock is<br>
&emsp;&emsp;implemented outside wait and signal.  We also did not accept comments that the lock was<br>
&emsp;&emsp;not properly acquired and released in wait() and signal(); the lock is acquired and released<br>
&emsp;&emsp;in code that surrounds the calling of wait and signal – not in the implementation of wait and<br>
&emsp;&emsp;signal.

Page 8/18


---

<a id="page-9"></a>
**Page 9**

CS 162 Fall 2007 Midterm Exam I        October 10, 2007


### **Problem 3e\[3pts\]:** Explain why we need an additional semaphore to implement `signal()` under

Hoare scheduling as you describe in problem (3a). Hint: when a waiting thread (T1) is signaled by<br>
another thread (T2), something special must happen immediately and something else must happen<br>
when this signaled thread either releases the monitor lock or executes `wait()`…<br>
&emsp;&emsp;We need an additional semaphore on which the signaler (T2) can sleep and which can be<br>
&emsp;&emsp;used to cause the signaler to wake up and continue later. People who didn’t explicitly<br>
&emsp;&emsp;mention that the signaler must sleep on this semaphore didn’t get full credit.


### **Problem 3f\[6pts\]:** Given your answer to (3e), show how to implement the Lock class for a Hoare-

scheduled monitor using Semaphores.  Let us call the additional semaphore from (3e) the SDefer<br>
semaphore. If if helps you think about the problem, you can assume that the SDefer.v() operation<br>
wakes up sleepers from SDefer.p() operations in Last-in-First-Out (LIFO) order, although this is<br>
not strictly necessary. Note that this semaphore (and possibly one other variable) may be referenced<br>
from within the condition variable implementation you will write in (3g).  However, these are not<br>
part of the public interface. In the following, make sure to implement the HoareLock(), Acquire(),<br>
and Release() methods. HoareLock() is the initialization method and should not be empty!  Hint:<br>
the Semaphore interface does not allow querying of the size of its waiting queue; you may need to<br>
track this yourself.  None of the methods should require more than five lines.<br>
`public class HoareLock {`<br>
`Semaphore SDefer = null;`<br>
`Semaphore SLock = null;`<br>
int deferredCount = 0;         /\* Count number of threads waiting on SDefer \*/

&emsp;`public HoareLock() {`<br>
&emsp;SDefer = new Semaphore(0);    /\* Used to put threads to sleep: all .p()’s sleep \*/<br>
SLock = new Semaphore(1);    /\* Used for mutual exclusion: only on .p() gets to run \*/<br>
`}`<br>
`public void Acquire() {`<br>
SLock.p();             /\* Acquire lock \*/<br>
`}`<br>
`public void Release() {`<br>
&emsp;&emsp;if (deferredCount \> 0) {<br>
deferredCount--;        /\* Decrement deferred count\*/<br>
SDefer.v();            /\* Signaler waiting, wake/pass lock\*/<br>
} else<br>
SLock.();            /\* No signaler waiting, unlock lock \*/<br>
`}`<br>
`}`<br>
Notes: People made the basic lock Acquire() and Release() very complex.  It is not. Also, many<br>
people tried to count number of waiters on the lock by executing things like “variable++” before<br>
SLock.p(). This is bad coding and suffers from the same problem mentioned in Prob 2. Note that we<br>
only release the actual lock in Release() if we are not giving it back to a deferred thread. Also, a<br>
number of people didn’t get the initial value correct for the “new Semaphore()” statements: these<br>
two semaphores are used for fundamentally different things and are thus initialized differently!<br>
Note that we need to count # threads sleeping on SDefer to decide whether to wake one or not<br>
during Release(). Also, notice that the “deferredCount--” statement could be in signal() \[next page\]<br>
instead; if here, however, it must be before SDefer.v() to avoid race condition (imagine that<br>
deferred thread runs immediately after SDefer.v() and runs until it executes “Release()”).

Page 9/18


---

<a id="page-10"></a>
**Page 10**

CS 162 Fall 2007 Midterm Exam I        October 10, 2007


### **Problem 3g\[6pts\]:** Show how to implement the Condition Variable class for a Hoare-schedule

monitor using Semaphores (and your HoareLock class from 3f).  Be very careful to consider the<br>
semantics of signal() as discussed in your answers to (3a) and (3c).  Hint: consider what happens<br>
when (1) you signal without a waiting thread and (2) signal with a waiting thread. You may need to<br>
refer to methods and/or variables within the lock object. Also, remember that the Semaphore<br>
interface does not allow querying of the size of its waiting queue; you may need to track this<br>
yourself. None of the methods should require more than five lines.

&emsp;`public class HoareCondVar {`<br>
`Semaphore SCondVar = null;`<br>
HoareLock lock;    /\* Must save lock from initializer for use later \*/<br>
int waitCount = 0;    /\* Count of threads waiting on CV \*/

`public HoareCondVar(HoareLock lock) {`<br>
&emsp;SCondVar = new Semaphore(0);    /\* Used to put threads to sleep: all .p()’s sleep \*/<br>
this.lock = lock;<br>
`}`<br>
`public void Wait() {`<br>
&emsp;waitCount++;    /\* Keep track of number of waiters\*/<br>
lock.Release();    /\* Release lock or wake up signaler \*/<br>
SCondVar.p();    /\* Sleep on conditional variable \*/<br>
`}`<br>
`public void Signal() {`<br>
if (waitCount \> 0) {    /\* Waiter exists, do something \*/<br>
waitCount--;    /\* avoid race cond by decrementing count \*/<br>
lock.deferredCount++;    /\* indicate that signaler deferred. \*/<br>
SCondVar.v();    /\* Wake up waiter/transfer lock \*/<br>
Lock.SDefer.p();    /\* Defer signaler until woken \*/<br>
}<br>
`}`<br>
`}`

&emsp;Notes: Many people missed the fact that you need to preserve the incoming value of “lock”<br>
&emsp;from the initializer if you want to use it later.  Hence, the “this.lock=lock” statement. Make sure<br>
&emsp;to look at the initial value in the “new Semaphore()” statement for SCondVar; this value is used<br>
&emsp;because we are putting threads to sleep on that semaphore. Further, note that you must track<br>
&emsp;the number of waiting threads on SCondVar.v() to know whether or not signal() needs to wake<br>
&emsp;one up (same as the SDefer semaphore from the HoareLock implementation). Also, a number of<br>
&emsp;people didn’t understand the fact that we transfer the lock from signaler to signaled and back.<br>
&emsp;See definition in (3a). Doing this is simple: we don’t release the lock in signal(), rather just<br>
&emsp;wake up the waiter and put the signaler to sleep. Then the waiter wakes up with the lock<br>
&emsp;acquired. Further, when the waiter executes either Release() or wait(), we simply leave the lock<br>
&emsp;acquired for use by the signaler. Finally, notice that both the “waitCount--” and<br>
&emsp;lock.deferredCount++” ops must occur before SCondVar.v() in signal() to avoid race condition<br>
&emsp;(imagine that the SCondVar.v() causes waiter to start executing immediately and that the waiter<br>
&emsp;executes either Release() or Signal().); alternatively, “waitCount--” could be the last statement<br>
&emsp;of wait() without problem.

Page 10/18


---

<a id="page-11"></a>
**Page 11**

CS 162 Fall 2007 Midterm Exam I        October 10, 2007


### Problem 4: Deadlock \[25pts\]


### **Problem 4a\[3pts\]:** What is the difference between deadlock, livelock, and starvation?

&emsp;&emsp;Deadlock and Livelock are types of Starvation. Starvation is a lack of forward progress.<br>
&emsp;&emsp;Deadlock is a lack of forward progress that will never resolve because it involves a cyclic<br>
&emsp;&emsp;dependency. Livelock is a lack of forward progress that could go away – typically it<br>
&emsp;&emsp;involves higher priority jobs continually taking resources away from lower-priority jobs.


### **Problem 4b\[2pts\]:** Suppose a thread is running in a critical section of code, meaning that it has

acquired all the locks through proper arbitration.  Can it get context switched? Why or why not?<br>
&emsp;&emsp;Yes. Grabbing a lock is different from disabling interrupts (and thus preventing context<br>
&emsp;&emsp;switching).  The important thing here is that the acquisition of the lock prevents other<br>
&emsp;&emsp;threads from running in the same critical section at the same time; it does not generically<br>
&emsp;&emsp;prevent other threads from running.


### **Problem 4c\[3pts\]:** What is priority donation and why is it important? Under what circumstances

would an operating system need to implement priority donation?<br>
&emsp;&emsp;Priority donation is the process of donating priority from a high priority job to a low<br>
&emsp;&emsp;priority job. When a high priority job sleeps waiting for a lock held by a low priority job,<br>
&emsp;&emsp;the high-priority job may be delayed behind a medium priority job, thus violating the<br>
&emsp;&emsp;priority scheduling. The only way to fix this is to temporarily raise priority of the low<br>
&emsp;&emsp;priority job to that of the waiting job; this is priority donation.


### **Problem 4d\[3pts\]:** Does a cyclic dependency always lead to deadlock?  Explain

&emsp;&emsp;No. The cycle dependency may only be temporary (eventually resolve itself).  Here is an<br>
&emsp;&emsp;example given in class that has a cyclic dependency by is not deadlocked:


![Figure on page 11](figures/solutions-p11-fig05.png)

Page 11/18


---

<a id="page-12"></a>
**Page 12**

CS 162 Fall 2007 Midterm Exam I        October 10, 2007


### **Problem 4e\[8pts\]:** Consider a large table with multi-armed lawyers. In the center is a pile

&emsp;&emsp;of chopsticks.  In order to eat, a lawyer must have one chopstick in each hand. The lawyers<br>
&emsp;&emsp;are so busy talking that they can only grab one chopstick at a time. Design a BankerTable<br>
&emsp;&emsp;object using monitors that tracks resources via the Bankers algorithm. It should have public<br>
&emsp;&emsp;methods GrabOne() that allows a lawyer to grab one chopstick and ReleaseAll() that allows<br>
&emsp;&emsp;a lawyer to release all chopsticks that he. The GrabOne() method should put a lawyer to<br>
&emsp;&emsp;sleep if they cannot be granted a chopstick without potentially deadlocking the system. The<br>
&emsp;&emsp;ReleaseAll() method should wake up lawyers that can proceed. Assume a BankerCheck()<br>
&emsp;&emsp;method that takes a Lawer number, checks resources, and returns true if a given lawyer can<br>
&emsp;&emsp;be granted one new chopstick (you will implement this in 4g). Assume Mesa scheduling and<br>
&emsp;&emsp;that your condition variable has a broadcast() method. No method should have more than<br>
&emsp;&emsp;six (6) lines!

&emsp;`public class BankerTable {`<br>
`Lock lock = new Lock();`<br>
`Condition CV = new Condition(lock);`<br>
&emsp;&emsp;int\[\] AllocTable;                /\* Keep track of allocations \*/<br>
&emsp;&emsp;int NumArms, NumChopsticks;                /\* Keep other info \*/

`public BankerTable(int NumLawyers, int NumArms, int NumChopsticks) {`<br>
&emsp;&emsp;&emsp;AllocTable = new int\[NumLawyers\];            /\* Array of allocations (init 0)\*/<br>
this.NumArms = NumArms;                /\* Remember # arms/lawyer \*/<br>
this.NumChopsticks = NumChopsticks;         /\* Remember # chopstocks/table \*/<br>
`}`<br>
`public void GrabOne(int Lawyer) {`<br>
&emsp;&emsp;&emsp;lock.Acquire();<br>
/\* Use banker algorithm to check whether allocation is ok \*/<br>
while (!BankerCheck(Lawyer))<br>
CV.wait();<br>
/\* Move one chopstick from table to lawyer \*/<br>
NumChopsticks--;<br>
AllocTable\[Lawyer\]++;<br>
Lock.Release();<br>
`}`<br>
`public void ReleaseAll(int Lawyer) {`<br>
&emsp;&emsp;&emsp;lock.Acquire();<br>
&emsp;&emsp;&emsp;NumChopsticks += AllocTable\[Lawyer\]; /\* Put chopsticks back on table\*/<br>
AllocTable\[Lawyer\] = 0;                /\* Lawyer has none left \*/<br>
lock.Release();<br>
`}`

Page 12/18


---

<a id="page-13"></a>
**Page 13**

CS 162 Fall 2007 Midterm Exam I        October 10, 2007


### **Problem 4f\[3pts\]:** In its general form, the Banker’s algorithm makes multiple passes through the

set of resource takers (think of the deadlock detection algorithm on which it is based). Explain why<br>
this particular application allows the BankerCheck method to implement the Banker’s algorithm by<br>
taking a single pass though the Lawyers’ allocations.<br>
&emsp;The  Banker’s algorithm only needs a single pass because every resource taker has identical<br>
&emsp;properties: every Lawyer has the same maximum allocation.  As a result, if we can find a single<br>
&emsp;Lawyer that can finish, given the remaining resources, we know that all Lawyers can finish.<br>
&emsp;Reason: once that Lawyer finishes and returns their resources we know that there will be at<br>
&emsp;least NumArms chopsticks on the table – hence everyone else can potentially finish. Thus, we<br>
&emsp;don’t have to go through the exercise of returning resources and reexamining the remaining<br>
&emsp;Lawyers (as in the general specification of the Banker’s algorithm).


### **Problem 4g\[3pts\]:** Implement the BankerCheck method of the BankerTable Object. This method

should implement the Banker’s algorithm: return true if the given Lawyer can be granted one<br>
additional chopstick without taking the system out of a SAFE state. Do not blindly implement the<br>
Banker’s algorithm: this method only needs to have the same external behavior as the Banker’s<br>
algorithm for this application. This method can be written with as few as 7 lines.  We will give full<br>
credit for a solution that takes a single pass through the lawyers, partial credit for a working<br>
solution, and no credit for a solution with more than 10 lines. Note that this method is part of the<br>
BankerTable Object and thus has access to local variables of that object…

`boolean BankerCheck(int Lawyer) {`<br>
`/*`<br>
`* This method implements the bankers algorithm for the`<br>
`* multi-armed laywer problem. It should return true if the`<br>
`* given lawyer can be granted one chopstick.`<br>
`*/`<br>
&emsp;&emsp;&emsp;&emsp;int i;<br>
&emsp;&emsp;&emsp;&emsp;AllocTable\[Lawyer\]++;         /\* Hypothetically give chopstick to lawyer \*/<br>
&emsp;&emsp;&emsp;&emsp;for (i = 0; i \< AllocTable.length; i++)<br>
&emsp;&emsp;&emsp;&emsp;/\* Is current number on table (NumChopsticks-1)  enough to let Lawyer i eat? \*/<br>
&emsp;&emsp;&emsp;&emsp;if ((AllocTable\[i\] + (NumChopsticks - 1)) \>= NumArms)<br>
&emsp;&emsp;&emsp;&emsp;break;    /\* Yes! Break early \*/<br>
&emsp;&emsp;&emsp;&emsp;AllocTable\[Lawyer\]--;    /\* Take away hypothetical \*/<br>
&emsp;&emsp;&emsp;&emsp;Return (i \< AllocTable.length);    /\* Returns true if we broke at any time \*/<br>
`}`<br>
`}`<br>
&emsp;Notes: We don’t have to check for the case in which NumChopsticks == 0, since this would<br>
&emsp;mean that (NumChopsticks-1) == -1, and the “if” statement would be self correcting, assuming<br>
&emsp;no lawyer would have \> NumArms: the if statement would always fail – exactly what we would<br>
&emsp;want to do when NumChopsticks == 0.

Page 13/18


---

<a id="page-14"></a>
**Page 14**

CS 162 Fall 2007 Midterm Exam I        October 10, 2007

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**\[ This page intentionally left blank \]**

Page 14/18


---

<a id="page-15"></a>
**Page 15**

CS 162 Fall 2007 Midterm Exam I        October 10, 2007


### Problem 5: Scheduling \[18pts\]


### **Problem 5a\[2pts\]:** Can Lottery scheduling be used to provide strict priority scheduling?  Why or

why not?<br>
&emsp;&emsp;No. By definition, every thread in the lottery scheduler has at least one token and will thus<br>
&emsp;&emsp;get some of the CPU under all circumstances. In a strict priority scheduler, the higher<br>
&emsp;&emsp;priority threads get CPU cycles exclusively at the expense of  the low priority threads.


### **Problem 5b\[2pts\]:** Can any of the three scheduling schemes (FCFS, SRTF, or RR) result in

starvation?  If so, how might you fix this?<br>
&emsp;&emsp;Yes.  The SRTF algorithm can result starvation of long tasks if short tasks keep arriving.<br>
&emsp;&emsp;The FCFS algorithm will result in starvation only if some thread runs forever. Finally, RR<br>
&emsp;&emsp;does not result in starvation, since all threads get some of the CPU. To fix SRTF, we might<br>
&emsp;&emsp;add some priority mechanism to make sure that threads that have waited for a long time<br>
&emsp;&emsp;without running get at least some of the CPU now and then (priority increments when<br>
&emsp;&emsp;threads don’t get to run). The multi-level scheduler is a good approximation to SRTF that<br>
&emsp;&emsp;can be designed to avoid starvation. (the result wouldn’t be quite SRTF any more).<br>
&emsp;&emsp;To fix FCFS, we would need to find some way of preempting threads that have run forever,<br>
&emsp;&emsp;possibly by giving some CPU to other threads.  Effectively, this would add elements of RR<br>
&emsp;&emsp;or multi-level scheduling into FCFS (it wouldn’t be quite FCFS any more).


### **Problem 5c\[2pts\]:** Suppose your notion of fairness was to give every thread in a multithreaded

system an equal portion of the CPU.  Could you do this with strictly user-level threads (every<br>
process has only one kernel thread but multiple user-level threads)?  Explain.<br>
&emsp;&emsp;We accepted two answers here (with justification!): (1) yes. In this case, since the total<br>
&emsp;&emsp;number of user-level threads are unknown to the kernel, we would need to introduce some<br>
&emsp;&emsp;sort of system call that allowed a process to tell the kernel how many user-level threads it<br>
&emsp;&emsp;was running. This would allow the kernel to adjust the fraction of CPU given to each<br>
&emsp;&emsp;process so that all user-level threads got an equal amount of the CPU. (2) no. Since the<br>
&emsp;&emsp;kernel doesn’t know how many user-level threads each process has, it can’t adjust priority<br>
&emsp;&emsp;accordingly. Note that, while answer (1) says how to fix this, it is subject to malicious<br>
&emsp;&emsp;manipulation by a user-level process, and hence may not be considered feasible from a<br>
&emsp;&emsp;security standpoint.


### **Problem 5d\[2pts\]:** Explain how to fool the multi-level feedback scheduler’s heuristics into giving

a long-running task more CPU cycles.<br>
&emsp;&emsp;By periodically doing I/O (such as a bunch of print statements), a given long-running<br>
&emsp;&emsp;process can keep its burst-length short and hence its priority high in the multi-level<br>
&emsp;&emsp;feedback scheduler.

Page 15/18


---

<a id="page-16"></a>
**Page 16**

CS 162 Fall 2007 Midterm Exam I        October 10, 2007


### **Problem 5e\[5pts\]:**

Here is a table of processes and their associated arrival and running times.


![Figure on page 16](figures/solutions-p16-fig06.png)

Show the scheduling order for these processes under 3 policies: First Come First Serve (FCFS),<br>
Shortest-Remaining-Time-First (SRTF), Round-Robin (RR) with timeslice quantum = 1. Assume<br>
that context switch overhead is 0 and that new RR processes are added to the **head** of the queue and<br>
new FCFS processes are added to the **tail** of the queue.


![Figure on page 16](figures/solutions-p16-fig07.png)

Page 16/18


---

<a id="page-17"></a>
**Page 17**

CS 162 Fall 2007 Midterm Exam I        October 10, 2007


### **Problem 5f\[3pts\]:**

For each process in each schedule above, indicate the queue wait time.  Note that wait time is the<br>
total time spend waiting in queue (all the time in which the task is not running).


![Figure on page 17](figures/solutions-p17-fig08.png)


### **Problem 5g\[2pts\]:**

Assume that we could have an oracle perform the best possible scheduling to reduce average wait<br>
time. What would be the optimal average wait time, and which of the above three schedulers would<br>
come closest to optimal?  Explain.<br>
&emsp;&emsp;Since SRTF is optimal, taking the future into account (i.e. as an oracle), just need to use the<br>
&emsp;&emsp;SRTF average.  Average wait time in this case would be: (1+7+0+0+1)/5 = 1.8

Page 17/18


---

<a id="page-18"></a>
**Page 18**

CS 162 Fall 2007 Midterm Exam I        October 10, 2007

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**\[ This page intentionally left blank \]**

Page 18/18

