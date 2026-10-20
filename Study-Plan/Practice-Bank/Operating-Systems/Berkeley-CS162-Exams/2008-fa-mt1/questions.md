# Berkeley CS162 Fall 2008: Midterm 1: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;University of California, Berkeley<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;College of Engineering<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Computer Science Division ⎯ EECS<br>
&emsp;Fall 2008                John Kubiatowicz<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Midterm I<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;October 15th, 2008<br>
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

&emsp;Page 1/21


---

<a id="page-2"></a>
**Page 2**

CS 162 Fall 2008 Midterm Exam I        October 15, 2008

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[ This page left for π \]

&emsp;&emsp;&emsp;&emsp;3.141592653589793238462643383279502884197169399375105820974944

Page 2/21


---

<a id="page-3"></a>
**Page 3**

CS 162 Fall 2008 Midterm Exam I        October 15, 2008


### Problem 1: Short Answer \[24pts\]


### **Problem 1a\[2pts\]:** Give at least two reasons why the following implementation of a condition

variable is incorrect (assume that MySemi is a semaphore initialized to 0):<br>
Wait()     { MySemi.P(); }<br>
Signal() { MySemi.V(); }


### **Problem 1b\[4pts\]:** What is the difference between Mesa and Hoare scheduling for monitors?

Include passing of locks between signaler and signalee, scheduling of CPU resources, and impact<br>
on programmer.


### **Problem 1c\[3pts\]:** The SRTF algorithm requires knowledge of the future. Why is that? Name two

ways to approximate the information required to implement this algorithm.


### **Problem 1d\[3pt\]:** What is priority donation? What sort of information must the OS track to allow it

to perform priority donation?

Page 3/21


---

<a id="page-4"></a>
**Page 4**

CS 162 Fall 2008 Midterm Exam I        October 15, 2008


![Figure on page 4](figures/questions-p04-fig03.png)


### **Problem 1e\[3pts\]:**  Above, we show the Readers-Writers example given in class.  It used two

condition variables, one for waiting readers and one for waiting writers. Suppose that all of the<br>
following requests arrive in very short order (while R1 and R2 are still executing):<br>
Incoming stream: R1 R2 W1 W2 R3 R4 R5 W3 R6 W4 W5 R7 R8 W6 R9<br>
In what order would the above code process the above requests? If you have a group of requests<br>
that are equivalent (unordered), indicate this clearly by surrounding them with braces ‘{}’.  You can<br>
assume that the wait queues for condition variables are FIFO in nature (i.e. signal() wakes up the<br>
oldest thread on the queue). Explain how you got your answer.

Page 4/21


---

<a id="page-5"></a>
**Page 5**

CS 162 Fall 2008 Midterm Exam I        October 15, 2008


### **Problem 1f\[4pts\]:**

Suppose that you were to redesign the code in (1e). What is the minimum number of condition<br>
variables that we would we need in order to handle the above requests in an order that guarantees<br>
that a read always returns the results of writes that have arrived before it but not after it? (Another<br>
way to say this is that the reads and writes occur in the order in which they arrive, while still<br>
allowing groups of reads that arrive together to occur simultaneously.) Provide a two or three<br>
sentence sketch of your scheme (do not try to write code!).


### **Problem 1g\[3pts\]:** What are exceptions? Name two different types of exceptions and give an

example of each type:


### **Problem 1h\[2pts\]:** What was the problem with the Therac-25? Your answer should involve one of

the topics of the class.

Page 5/21


---

<a id="page-6"></a>
**Page 6**

CS 162 Fall 2008 Midterm Exam I        October 15, 2008


### Problem 2: TRUE/FALSE \[12 pts\]

In the following, it is important that you EXPLAIN your answer in TWO SENTENCES OR LESS<br>
(Answers longer than this may not get credit!).  Also, answers without an explanation GET NO<br>
CREDIT.


### **Problem 2a\[2pts\]:**  The kernel on a multiprocessor can use the local disabling of interrupts (within

one CPU) to produce critical sections between the OSs on different CPUs.<br>
&emsp;&emsp;True / False<br>
Explain:


### **Problem 2b\[2pts\]:** When designing a multithreaded application, you must use synchronization

primitives to make sure that the threads do not overwrite each other’s registers.<br>
&emsp;&emsp;True / False<br>
Explain:


### **Problem 2c\[2pts\]:** A system that provides segmentation without paging can fragment the physical

address space, forcing the operating system to waste physical memory.<br>
&emsp;&emsp;True / False<br>
Explain:


### **Problem 2d\[2pts\]:** A user-level library implements each system call by first executing a “transition

to kernel mode” instruction. The library routine then calls an appropriate subroutine in the kernel.<br>
&emsp;&emsp;True / False<br>
Explain:


### **Problem 2e\[2pts\]:** The difference between processes and threads is purely historical.

&emsp;&emsp;True / False<br>
Explain:


### **Problem 2f\[2pts\]:** Round robin scheduling provides a latency improvement over FCFS scheduling

for interactive jobs.<br>
&emsp;&emsp;True / False<br>
Explain:

Page 6/21


---

<a id="page-7"></a>
**Page 7**

CS 162 Fall 2008 Midterm Exam I        October 15, 2008

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[ This page intentionally left blank \]

Page 7/21


---

<a id="page-8"></a>
**Page 8**

CS 162 Fall 2008 Midterm Exam I        October 15, 2008


### Problem 3: Atomic Synchronization Primitives \[25 pts\]

In class, we discussed a number of atomic hardware primitives that are available on modern<br>
architectures. In particular, we discussed “test and set” (TSET), SWAP, and “compare and swap”<br>
(CAS). They can be defined as follows (let “expr” be an expression, “&addr” be an address of a<br>
memory location, and “M\[addr\]” be the actual memory location at address addr):


![Figure on page 8](figures/questions-p08-fig04.png)

Both TSET and SWAP return values (from memory), whereas CAS returns either true or false.<br>
Note that our &addr notation is similar to a reference in c++, and means that the &addr argument<br>
must be something that can be stored into (an “lvalue”). For instance, TSET could be used to<br>
implement a spin-lock acquire as follows:<br>
&emsp;`int lock = 0; // lock is free`<br>
`// Later: acquire lock`<br>
`while (TSET(lock));`<br>
CAS is general enough as an atomic operation that it can be used to implement both TSET and<br>
SWAP. For instance, consider the following implementation of TSET with CAS:<br>
&emsp;`TSET(&addr) {`<br>
`int temp;`<br>
`do {`<br>
`temp = M[addr];`<br>
`} while (!CAS(addr,temp,1));`<br>
`return temp;`<br>
`}`


### **Problem 3a\[3pts\]:**

Show how to implement a spinlock acquire with a single while loop using CAS instead of TSET.<br>
You must only fill in the arguments to CAS below:<br>
`// Initialization`<br>
`int lock = 0; // Lock is free`

`// acquire lock`<br>
`while ( !CAS(           ,          ,         )`    `);`

Page 8/21


---

<a id="page-9"></a>
**Page 9**

CS 162 Fall 2008 Midterm Exam I        October 15, 2008


### **Problem 3b\[2pts\]:**

Show how SWAP can be implemented using CAS. Don’t forget the return value.

`SWAP(&addr, reg1) {`

`}`


### **Problem 3c\[3pts\]:**

With spinlocks, threads spin in a loop (busy waiting) until the lock is freed. In class we argued that<br>
spinlocks were a bad idea because they can waste a lot of processor cycles. The alternative is to put a<br>
waiting process to sleep while it is waiting for the lock (using a blocking lock). Contrary to what we<br>
implied in class, there are cases in which spinlocks would be more efficient than blocking locks. Give a<br>
circumstance in which this is true and explain why a spinlock is more efficient.

Page 9/21


---

<a id="page-10"></a>
**Page 10**

CS 162 Fall 2008 Midterm Exam I        October 15, 2008

An object such as a queue is considered “lock-free” if multiple processes can operate on this object<br>
simultaneously without requiring the use of locks, busy-waiting, or sleeping. In this problem, we<br>
are going to construct a lock-free FIFO queue using the atomic CAS operation. This queue needs<br>
both an `Enqueue` and `Dequeue` method.<br>
We are going to do this in a slightly different way than normally.  Rather than `Head` and `Tail`<br>
pointers, we are going to have “`PrevHead`” and `Tail` pointers.  `PrevHead` will point at the last<br>
object returned from the queue.  Thus, we can find the head of the queue (for dequeuing). If we<br>
don’t have to worry about simultaneous Enqueue or Dequeue operations, the code is<br>
straightforward (ignore the null-pointer exception for the Dequeue() operation for now):

`// Holding cell for an entry`<br>
`class QueueEntry {`<br>
`QueueEntry next = null;`<br>
`Object stored;`<br>
`QueueEntry(Object newobject) {`<br>
`stored = newobject;`<br>
`}`<br>
`}`<br>
`// The actual Queue (not yet lock free!)`<br>
`class Queue {`<br>
`QueueEntry prevHead = new QueueEntry(null);`<br>
`QueueEntry tail = prevHead;`<br>
`void Enqueue(Object newobject)  {`<br>
`QueueEntry newEntry = new QueueEntry(newobject);`<br>
`QueneEntry oldtail = tail;`<br>
`tail = newEntry;`<br>
`oldtail.next = newEntry;`<br>
`}`<br>
`Object Dequeue() {`<br>
`QueueEntry oldprevHead = prevHead;`<br>
`QueueEntry nextEntry = oldprevHead.next;`<br>
`prevHead = nextEntry;`<br>
`return nextEntry.stored;`<br>
`}`<br>
`}`


### **Problem 3d\[3pts\]:**

For this non-multithreaded code, draw the state of a queue with 2 queued items on it:

Page 10/21


---

<a id="page-11"></a>
**Page 11**

CS 162 Fall 2008 Midterm Exam I        October 15, 2008


### **Problem 3e\[3pts\]:**

For each of the following potential context switch points, state whether or not a context switch at that point<br>
could cause incorrect behavior of Enqueue(); Explain!<br>
`void Enqueue(Object newobject)  {`<br>
`1`    `QueueEntry newEntry = new QueueEntry(newobject);`


![Figure on page 11](figures/questions-p11-fig05.png)

`2`    `QueueEntry oldtail = tail;`<br>
`3`    `tail = newEntry;`<br>
`oldtail.next = newEntry;`<br>
`}`<br>
Point 1:

Point 2:

Point 3:


### **Problem 3f\[4pts\]:**

Rewrite code for `Enqueue()`, using the `CAS()` operation, such that it will work for any number of<br>
simultaneous Enqueue and Dequeue operations.  You should never need to busy wait.  **Do not use locking**<br>
**(i.e. don’t use a test-and-set lock).** The solution is tricky but can be done in a few lines. We will be grading<br>
on conciseness. Do not use more than one `CAS()` or more than 10 lines total (including the function<br>
declaration at the beginning).  Hint: wrap a do-while around vulnerable parts of the code identified above.<br>
`void Enqueue(Object newobject)  {`<br>
`QueueEntry newEntry = new QueueEntry(newobject);`<br>
`// Insert code here`

`}`

Page 11/21


---

<a id="page-12"></a>
**Page 12**

CS 162 Fall 2008 Midterm Exam I        October 15, 2008


### **Problem 3g\[3pts\]:**

For each of the following potential context switch points, state whether or not a context switch at that point<br>
could cause incorrect behavior of Dequeue(); Explain!

`Object Dequeue() {`<br>
`1`    `QueueEntry oldprevHead = prevHead;`


![Figure on page 12](figures/questions-p12-fig06.png)

`2`    `QueueEntry nextEntry = oldprevHead.next;`<br>
`3`    `prevHead = nextEntry;`<br>
`return nextEntry.stored;`<br>
`}`

Point 1:

Point 2:

Point 3:


### **Problem 3h\[4pts\]:**

Rewrite code for `Dequeue()`, using the `CAS()` operation, such that it will work for any number of<br>
simultaneous Enqueue and Dequeue operations.  You should never need to busy wait.  **Do not use locking**<br>
**(i.e. don’t use a test-and-set lock).** The solution can be done in a few lines. We will be grading on<br>
conciseness. Do not use more than one `CAS()` or more than 10 lines total (including the function declaration<br>
at the beginning).  Hint: wrap a do-while around vulnerable parts of the code identified above.<br>
&emsp;`Object Dequeue() {`<br>
`// Insert code here`

`}`

Page 12/21


---

<a id="page-13"></a>
**Page 13**

CS 162 Fall 2008 Midterm Exam I        October 15, 2008


### Problem 4: Deadlock\[21 pts\]


### **Problem 4a\[5pts\]:**


![Figure on page 13](figures/questions-p13-fig07.png)

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
can be arbitrarily long. Show a situation (with a drawing) in which messages are deadlocked and<br>
can make no further progress.  Explain how each of the four conditions of deadlock are satisfied by<br>
your example. Hint: Links are the limited resources in this example.


### **Problem 4b\[3pts\]:**

Define a routing policy that avoids deadlocks in the network of (4a). Name one of the four<br>
conditions that is no longer possible, given your routing policy. Explain.


### **Problem 4c\[3pts\]:**

Suppose that each router node contains sufficient queue space to hold complete messages (assume<br>
infinite space, if you like). Why is it impossible for deadlocks such as in (4a) to occur? Name one<br>
of  the four conditions that is no longer possible, given infinite queue space in the router. Explain.

Page 13/21


---

<a id="page-14"></a>
**Page 14**

CS 162 Fall 2008 Midterm Exam I        October 15, 2008


### **Problem 4d\[4pts\]:**

Suppose that we have the following resources: A, B, C and threads T1, T2, T3, T4.  The total<br>
number of each resource is:


![Figure on page 14](figures/questions-p14-fig08.png)

Further, assume that the processes have the following maximum requirements and current<br>
allocations:


![Figure on page 14](figures/questions-p14-fig09.png)

Is the system in a safe state? If “yes”, show a non-blocking sequence of thread executions.<br>
Otherwise, provide a proof that the system is unsafe. Show all steps, intermediate matrices, etc.

Page 14/21


---

<a id="page-15"></a>
**Page 15**

CS 162 Fall 2008 Midterm Exam I        October 15, 2008


### **Problem 4e\[3pts\]:**

Assume that we start with a system in the state of (4d). Suppose that T1 asks for 2 more copies of<br>
resource A.  Can the system grant this if it wants to avoid deadlock? Explain.


### **Problem 4f\[3pts\]:**

Assume that we start with a system in the state of (4d). What is the maximum number of additional<br>
copies of resources (A, B, and C) that T1 can be granted in a single request without risking<br>
deadlock? Explain.

Page 15/21


---

<a id="page-16"></a>
**Page 16**

CS 162 Fall 2008 Midterm Exam I        October 15, 2008

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[ This page intentionally left blank \]

Page 16/21


---

<a id="page-17"></a>
**Page 17**

CS 162 Fall 2008 Midterm Exam I        October 15, 2008


### Problem 5: Address Translation \[18 pts\]


### **Problem 5a\[3pts\]:**

Suppose we have a 32-bit processor (with 32-bit virtual addresses) and 8 KB pages. Assume that it<br>
can address up to 2 TB (terabytes) of DRAM; 1TB = 1024 GB = (1024)2 MB. Assume that we need<br>
4 permissions bits in each page table entry (PTE), namely Valid (V), Writable (W), Accessed (A),<br>
and Dirty (D). Show the format of a PTE, assuming that each page should be able to hold an integer<br>
number of PTEs. If you have extra bits in the PTE, you can mark them as “unused”. Explain.


### **Problem 5b\[5pts\]:**

Assume that we wish to build a two-level page table for the processor from (5a) in which each piece<br>
of the page table consumes exactly a page (no more, no less). We may end up wasting space as a<br>
result. Draw and label a figure showing how a virtual address gets mapped into a physical address.<br>
Show the format of the page table (complete with access checks), the virtual address, and physical<br>
address. Minimize pieces of the page table that consume less than a page (and thus waste space).

.

Page 17/21


---

<a id="page-18"></a>
**Page 18**

CS 162 Fall 2008 Midterm Exam I        October 15, 2008


### **Problem 5c\[3pts\]:**

Consider a multi-level memory management scheme using the following format for virtual<br>
addresses:


![Figure on page 18](figures/questions-p18-fig10.png)

Virtual addresses are translated into physical addresses of the following form:


![Figure on page 18](figures/questions-p18-fig11.png)

Page table entries (PTE) are 16 bits in the following format, stored in big-endian form in memory<br>
(i.e. the MSB is first byte in memory):


![Figure on page 18](figures/questions-p18-fig12.png)

1\) How big is a page? Explain.

2\) What is the maximum amount of virtual memory supported by this scheme? Explain

3\) What is the maximum amount of physical memory supported by this scheme? Explain


### **Problem 5d\[7pts\]:** Assume the memory translation scheme from (5c). Use the Segment Table and

Physical Memory table given on the next page to predict what will happen with the following<br>
load/store instructions. Addresses are virtual. The return value for a load is an 8-bit data value or an<br>
error, while the return value for a store is either “**ok**” or an error. If there is an error, make sure to<br>
say which error. Possibilities are: “**bad segment**” (invalid segment), “**segment overflow**” (address<br>
outside range of segment), or “**access violation**” (page invalid, or attempt to write a read only<br>
page).  A few answers are given:


![Figure on page 18](figures/questions-p18-fig13.png)


![Figure on page 18](figures/questions-p18-fig14.png)

Page 18/21


---

<a id="page-19"></a>
**Page 19**

&emsp;CS 162 Fall 2008 Midterm Exam I        October 15, 2008

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Segment Table (Max Segment=3)**


![Figure on page 19](figures/questions-p19-fig15.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Physical Memory**


![Figure on page 19](figures/questions-p19-fig16.png)

&emsp;Page 19/21


---

<a id="page-20"></a>
**Page 20**

CS 162 Fall 2008 Midterm Exam I        October 15, 2008

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[ This page intentionally left blank \]

Page 20/21


---

<a id="page-21"></a>
**Page 21**

CS 162 Fall 2008 Midterm Exam I        October 15, 2008

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[ This page left for scratch \]

Page 21/21

