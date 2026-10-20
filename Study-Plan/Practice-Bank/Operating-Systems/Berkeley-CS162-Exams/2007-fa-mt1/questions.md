# Berkeley CS162 Fall 2007: Midterm 1: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;University of California, Berkeley<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;College of Engineering<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Computer Science Division ⎯ EECS<br>
&emsp;Fall 2007                John Kubiatowicz<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Midterm I<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;October 10th, 2007<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS162: Operating Systems and Systems Programming


![Figure on page 1](figures/questions-p01-fig01.png)

General Information:<br>
This is a **closed book** exam.  You are allowed 1 page of **hand-written** notes (both sides).  You<br>
have 3 hours to complete as much of the exam as possible. Make sure to read all of the questions<br>
first, as some of the questions are substantially more time consuming.<br>
Write all of your answers directly on this paper.  Make your answers as concise as possible. On<br>
programming questions, we will be looking for performance as well as correctness, so think through<br>
your answers carefully.  If there is something about the questions that you believe is open to<br>
interpretation, please ask us about it!


![Figure on page 1](figures/questions-p01-fig02.png)

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

with one another. If any of the techniques you name require hardware support, explain.


### **Problem 1b\[2pts\]:** What is an interrupt? What is the function of an interrupt controller?


### **Problem 1c\[3pts\]:**  Suppose that we have a two-level page translation scheme with 4K-byte pages

and 4-byte page table entries (includes a valid bit, a couple permission bits, and a pointer to another<br>
page/table entry).  What is the format of a 32-bit virtual address?  Sketch out the format of a<br>
complete page table.

Page 3/18


---

<a id="page-4"></a>
**Page 4**

CS 162 Fall 2007 Midterm Exam I        October 10, 2007


### **Problem 1d\[2pts\]:** Which company was the first to develop a workstation with a mouse and

overlapping windows?


### **Problem 1e\[2pt\]:** What is a thread-join operation?


### **Problem 1f\[2pts\]: True or False:** When designing a multithreaded application, you must use

synchronization primitives to make sure that the threads do not overwrite each other’s registers.<br>
Explain.


### **Problem 1g\[2pts\]: True or False:** A system that provides segmentation without paging puts holes

in the physical address space, forcing the operating system to waste physical memory. Explain.

Page 4/18


---

<a id="page-5"></a>
**Page 5**

CS 162 Fall 2007 Midterm Exam I        October 10, 2007


### Problem 2: Multithreading \[17 pts\]

Consider the following two threads, to be run concurrently in a shared memory (all variables are<br>
shared between the two threads):


![Figure on page 5](figures/questions-p05-fig03.png)

Assume a single-processor system, that load and store are atomic, that x is initialized to 0 before<br>
either thread starts, and that x must be loaded into a register before being incremented (and stored<br>
back to memory afterwards).  The following questions consider the final value of x after both<br>
threads have completed.


### **Problem 2a\[2 pts\]:** Give a concise proof why `x≤15` when both threads have completed.


### **Problem 2b\[4 pts\]:** Give a concise proof why `x≠1` when both threads have completed.


### **Problem 2c\[3pts\]:** Suppose we replace ‘**x = x+2**’ in Thread B with an atomic double increment

operation **atomicIncr2(x)** that cannot be preempted while being executed.  What are all the possible<br>
final values of `x`?  Explain.

Page 5/18


---

<a id="page-6"></a>
**Page 6**

CS 162 Fall 2007 Midterm Exam I        October 10, 2007


### **Problem 2d\[3pts\]:** What needs to be saved and restored on a context switch between two threads in

the same process?  What if the two threads are in different processes?  Be explicit.


### **Problem 2e\[2pts\]:** Under what circumstances can a multithreaded program complete more quickly

than a non-multithreaded program? Keep in mind that multithreading has context-switch overhead<br>
associated with it.


### **Problem 2f\[3pts\]:** What is simultaneous multithreading (or “Hyperthreading”)?  Name two ways in

which this differs from the type of multithreading done by the operating system.

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
conditional wait statements to be wrapped in “while” loops (see 3b).

Page 7/18


---

<a id="page-8"></a>
**Page 8**

CS 162 Fall 2007 Midterm Exam I        October 10, 2007


### **Problem 3b\[2pts\]:** When programming with a Mesa-scheduled monitor, the programmer must

enclose all conditional wait operations with a while loop like this:

&emsp;`while (condition unsatisfied)`<br>
`C.Wait();`<br>
What might happen if they did not do this?  How might this happen?


### **Problem 3c\[2pts\]:** Explain why a Hoare-scheduled monitor allows the programmer to replace the

“while” statement in (3b) with an “if”.


### **Problem 3d\[3pts\]:** Assume that we implement a Hoare-scheduled monitor with semaphores.

Clearly, we will need one semaphore to implement mutual exclusion. Further, each condition<br>
variable will utilize a semaphore to hold its queue of sleeping threads. Give at least 3 reasons why<br>
the following implementation of wait() and signal() is incorrect:

&emsp;&emsp;`wait() { CVSemi.p(); }`<br>
&emsp;&emsp;`signal() {CVSemi.v(); }`

Page 8/18


---

<a id="page-9"></a>
**Page 9**

CS 162 Fall 2007 Midterm Exam I        October 10, 2007


### **Problem 3e\[3pts\]:** Explain why we need an additional semaphore to implement `signal()` under

Hoare scheduling as you describe in problem (3a). Hint: when a waiting thread (T1) is signaled by<br>
another thread (T2), something special must happen immediately and something else must happen<br>
when this signaled thread either releases the monitor lock or executes `wait()`…


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
&emsp;&emsp;`Semaphore SLock = null;`

&emsp;`public HoareLock() {`

`}`<br>
`public void Acquire() {`

`}`<br>
`public void Release() {`

`}`<br>
`}`

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
`Semaphore SCondVar = null;`

`public HoareCondVar(HoareLock lock) {`

`}`<br>
`public void Wait() {`

`}`<br>
`public void Signal() {`

`}`<br>
&emsp;`}`

Page 10/18


---

<a id="page-11"></a>
**Page 11**

CS 162 Fall 2007 Midterm Exam I        October 10, 2007


### Problem 4: Deadlock \[25pts\]


### **Problem 4a\[3pts\]:** What is the difference between deadlock, livelock, and starvation?


### **Problem 4b\[2pts\]:** Suppose a thread is running in a critical section of code, meaning that it has

acquired all the locks through proper arbitration.  Can it get context switched? Why or why not?


### **Problem 4c\[3pts\]:** What is priority donation and why is it important? Under what circumstances

would an operating system need to implement priority donation?


### **Problem 4d\[3pts\]:** Does a cyclic dependency always lead to deadlock?  Explain

Page 11/18


---

<a id="page-12"></a>
**Page 12**

CS 162 Fall 2007 Midterm Exam I        October 10, 2007


### **Problem 4e\[8pts\]:** Consider a large table with multi-armed lawyers. In the center is a pile of

chopsticks.  In order to eat, a lawyer must have one chopstick in each hand. The lawyers are so busy<br>
talking that they can only grab one chopstick at a time. Design a BankerTable object using monitors<br>
that tracks resources via the Bankers algorithm. It should have public methods GrabOne() that<br>
allows a lawyer to grab one chopstick and ReleaseAll() that allows a lawyer to release all<br>
chopsticks that he. The GrabOne() method should put a lawyer to sleep if they cannot be granted a<br>
chopstick without potentially deadlocking the system. The ReleaseAll() method should wake up<br>
lawyers that can proceed. Assume a BankerCheck() method that takes a Lawer number, checks<br>
resources, and returns true if a given lawyer can be granted one new chopstick (you will implement<br>
this in 4g). Assume Mesa scheduling and that your condition variable has a broadcast() method. No<br>
method should have more than six (6) lines!

&emsp;`public class BankerTable {`<br>
`Lock lock = new Lock();`<br>
`Condition CV = new Condition(lock);`

`public BankerTable(int NumLawyers, int NumArms, int NumChopsticks) {`

`}`<br>
`public void GrabOne(int Lawyer) {`

`}`<br>
`public void ReleaseAll(int Lawyer) {`

`}`

Page 12/18


---

<a id="page-13"></a>
**Page 13**

CS 162 Fall 2007 Midterm Exam I        October 10, 2007


### **Problem 4f\[3pts\]:** In its general form, the Banker’s algorithm makes multiple passes through the

set of resource takers (think of the deadlock detection algorithm on which it is based). Explain why<br>
this particular application allows the BankerCheck method to implement the Banker’s algorithm by<br>
taking a single pass though the Lawyers’ allocations.


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
`*/`

`}`<br>
&emsp;`}`

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

why not?


### **Problem 5b\[2pts\]:** Can any of the three scheduling schemes (FCFS, SRTF, or RR) result in

starvation?  If so, how might you fix this?


### **Problem 5c\[2pts\]:** Suppose your notion of fairness was to give every thread in a multithreaded

system an equal portion of the CPU.  Could you do this with strictly user-level threads (every<br>
process has only one kernel thread but multiple user-level threads)?  Explain.


### **Problem 5d\[2pts\]:** Explain how to fool the multi-level feedback scheduler’s heuristics into giving

a long-running task more CPU cycles.

Page 15/18


---

<a id="page-16"></a>
**Page 16**

CS 162 Fall 2007 Midterm Exam I        October 10, 2007


### **Problem 5e\[5pts\]:**

Here is a table of processes and their associated arrival and running times.


![Figure on page 16](figures/questions-p16-fig04.png)

Show the scheduling order for these processes under 3 policies: First Come First Serve (FCFS),<br>
Shortest-Remaining-Time-First (SRTF), Round-Robin (RR) with timeslice quantum = 1. Assume<br>
that context switch overhead is 0 and that new RR processes are added to the **head** of the queue and<br>
new FCFS processes are added to the **tail** of the queue.


![Figure on page 16](figures/questions-p16-fig05.png)

Page 16/18


---

<a id="page-17"></a>
**Page 17**

CS 162 Fall 2007 Midterm Exam I        October 10, 2007


### **Problem 5f\[3pts\]:**

For each process in each schedule above, indicate the queue wait time.  Note that wait time is the<br>
total time spend waiting in queue (all the time in which the task is not running).


![Figure on page 17](figures/questions-p17-fig06.png)


### **Problem 5g\[2pts\]:**

Assume that we could have an oracle perform the best possible scheduling to reduce average wait<br>
time. What would be the optimal average wait time, and which of the above three schedulers would<br>
come closest to optimal?  Explain.

Page 17/18


---

<a id="page-18"></a>
**Page 18**

CS 162 Fall 2007 Midterm Exam I        October 10, 2007

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[ This page intentionally left blank \]

Page 18/18

