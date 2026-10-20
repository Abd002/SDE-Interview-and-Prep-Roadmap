# Berkeley CS162 Spring 1996: Midterm 1: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS 162, Midterm, Spring 1996<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**CS 162, Spring 1996**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Midterm**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Professor**

**Problem #1 (5 points)**<br>
Of the following items, circle those that are stored in the thread control block.<br>
(a) CPU registers<br>
(b) page table pointer<br>
(c) stack pointer<br>
(d) ready list<br>
(e) segment table<br>
(f) thread priority<br>
(g) program counter

**Problem #2 (10 points)**<br>
Write down the sequence of context switches that would occur in Nachos if the "main" thread were to call the<br>
following code. Assume that the CPU scheduler runs threads in FIFO order, with no time-slicing and all threads<br>
having the same priority. The WillJoin flag is used to signify that the thread will be joined to by its parent. For<br>
example, "child2 =\> child1" would signify that child2 switches to child1.

`void`<br>
`Thread::SelfTest2() {`<br>
`Thread *t1 = new Thread("child 1", WillJoin);`<br>
`Thread *t2 = new Thread("child 2", WillJoin);`

`t1->Fork((VoidFuncionPtr) &Thread::Yield, t1);`<br>
`t2->Fork((VoidFuncionPtr) &Thread::Yield, t2);`<br>
`t2->Join();`<br>
`t1->Join();`<br>
`}`

**Problem #3 (10 points)**<br>
For the following implementation of Thread::Join(), say whether it either (i) works, (ii) doesn't work, or (iii) is<br>
dangerous -- that is, sometimes works and sometimes doesn't. If the implementation does not work or is dangerous,<br>
explain why and show how to fix it so it does work. You may assume parents always call Thread::Join() on their<br>
children threads; Thead::Join is a method on the child thread, not the parent.

`class Thread {`<br>
`Semphore *finished;     // synch parent and child`

`Thread::Thread() {`<br>
`finished == new Semaphore(0);   // initial value = 0`<br>
`// plus other standard stuff from the Nachos code`

CS 162, Spring 1996 Midterm Professor   1


---

<a id="page-2"></a>
**Page 2**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS 162, Midterm, Spring 1996<br>
`}`

`Thread::~Thread() {`<br>
`delete finished;`<br>
`// plus other standard stuff from the Nachos code`<br>
`}`<br>
`};`

`void    // called by parent to wait for child thread`<br>
`Thread::Join()`<br>
`{`<br>
`finished->P();  // wait for thread to finish`<br>
`}`

`void    // called by child thread when it is done`<br>
`Thread::Finish()`<br>
`{`<br>
`Thread *oldThread = kernel->currentThread;`<br>
`Thread *nextThread;`

`(void) kernel->interrupt->SetLevel(IntOff);     // first turn i`<br>
`finished->V();  // then wake up parent`<br>
`delete this;    // deallocate current thread`<br>
`nextThread = kernel->scheduler->FindNextToRun());       // find`<br>
`kernel->currentThread = nextThread;`<br>
`SWITCH(oldThread, nextThread);  //context switch to it`<br>
`}`

**Problem #4 (10 points)**<br>
For the following implementation of atomic transfer, say whether it either (i) works, (ii) doesn't work, or (iii) is<br>
dangerous -- that is, sometimes works and sometimes doesn't. If the implementation does not work or is dangerous,<br>
explain why and show how to fix it so it does work. The problem statement is as follows: The atomic transfer routine<br>
dequeues an item from one queue and enqueues it on another. The transfer must appear to occur atomically: there<br>
should be no interval of time during which an external thread can determine that an item has been removed from one<br>
queue but not yet placed on another. In addition, the implementation must be highly concurrent -- it must allow<br>
multiple transfers between unrelated queues to happen in parallel. You may assume that queue1 and queue2 never<br>
refer to the same queue.

`void AtomicTransfer (Queue *queue1, *queue2) {`<br>
`Item thing;     // thing being transferred`

`queue1->lock.Acquire();`<br>
`thing = queue1->Dequeue();`<br>
`if (thing != NULL) {`<br>
`queue2->lock.Acquire();`<br>
`queue2->Enqueue(thing);`<br>
`queue2->lock.Release();`<br>
`}`

Problem #3 (10 points)   2


---

<a id="page-3"></a>
**Page 3**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS 162, Midterm, Spring 1996<br>
`queue1->lock.Release();`<br>
`}`

**Problem #5 (15 points)**<br>
A countermeasure is a strategy by which a user (or an application) exploits the characteristics of the CPU scheduling<br>
policy to get as much of the CPU time as possible. For example, if the CPU scheduler trusts users to give accurate<br>
estimates of how long each job will run so that it can give high priority to short jobs, then a countermeasure would be<br>
for the user to tell the system that the user's jobs are always short (even if untrue). Devise a countermeasure strategy<br>
for each of the following CPU scheduling policies; your strategy should minimize an indvidual application's response<br>
time (even if it hurts overall performance). You may assume perfect knowledge -- for example, your strategy can be<br>
based on which jobs will arrive in the future, where your application is in the queue and how long the jobs ahead of<br>
you will run before blocking. Your strategy should also be robust -- it whould work properly even if there are no other<br>
jobs in the system, or there are only short jobs, or only long running jobs, etc. If no strategy will improve your<br>
application's response time, then indicate that.

(a) last in first out

(b) round robin, assuming jobs are always put at the end of the ready list when they become ready to run

(c) multilevel feedback queues, where jobs are always put on the highest priority queue when they become ready to<br>
run


### **Problem 6: (20 points)**

For the following implementations of the "H2O" problem, say whether it either (i) works, (ii) doesn't work, or (iii) is<br>
dangerous -- that is, sometimes works and sometimes doesn't. If the implementation does not work or is dangerous,<br>
explain why and show how to fix it so it does work. Here is the original problem description: You've just been hired<br>
by Mother Nature to help her out with the chemical reaction to form water, which she doesn't seem to be able to get<br>
right due to synchronization problems. The trick is to get two H atoms and one O atom all together at the same time.<br>
The atoms are threads. Each H atom invokes a procedure hReady when it's ready to react, and each O atom invokes a<br>
procedure oReady when it's ready. For this problem, you are to write the code for hReady and oReady. The procedures<br>
must delay until there are at least two H atoms and one O atom present, and then one of the procedures must call the<br>
procedure makeWater (which just prints out a debug message that water was made). After the makeWater call, two<br>
instances of hReady and one instance of oReady should return. Your solution must avoid starvation and busy-waiting.<br>
You may assume that the semaphore implementaion enforces FIFO order for wakeups -- the thread waiting longest in<br>
P() always grabs the semaphore after a V().

(a) Here is a proposed solution to the "H2O" problem:

`int numHudrogen = 0;`<br>
`Semaphore pair OfHydrogen(0);   // initially 0`<br>
`Semaphore oxygen(0);                    // initially 0`

`void hReady() {`<br>
`numHydrogen++;`<br>
`if ((numHydrogen % 2) == 0) {`<br>
`pairOfHydrogen->V();`<br>
Problem #4 (10 points)   3


---

<a id="page-4"></a>
**Page 4**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS 162, Midterm, Spring 1996<br>
`}`<br>
`oxygen->P();`<br>
`}`

`void oReady() {`<br>
`pairOfHydrogen->P();`<br>
`makeWater();`<br>
`oxygen->V();`<br>
`oxygen->V();`<br>
`}`

(b) Another proposed solution to the "H2O" problem:

`Semaphore hPresent(0);          // initially 0`<br>
`Semaphore waitForWater(0);      // initially 0`

`void hReady() {`<br>
`hPresent->V();`<br>
`waitForWater->P();`<br>
`}`

`void oReady() {`<br>
`hPresent->P();`<br>
`hPresent->P();`<br>
`makeWater();`<br>
`waitForWater->V();`<br>
`waitForWater->V();`<br>
`}`

**Extra Credit Question (2 points)**<br>
Which provides the best average response time when there are multiple servers (bank tellers, supermarket cash<br>
registers, airline ticket takers, etc.): a single FIFO queue or a FIFO queue per server? Why? Assume that you can't<br>
predict how long any customer is going to take at the server, and that once you pick a queue to wait in, you are stuck<br>
and can't change queues.

&emsp;**Posted by HKN (Electrical Engineering and Computer Science Honor Society)**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**University of California at Berkeley**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**If you have any questions about these online exams**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**please contact**  **examfile@hkn.eecs.berkeley.edu.**


### Problem 6: (20 points)   4

