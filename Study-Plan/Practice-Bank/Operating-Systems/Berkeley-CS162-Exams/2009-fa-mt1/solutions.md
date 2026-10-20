# Berkeley CS162 Fall 2009: Midterm 1: Official solutions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;University of California, Berkeley<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;College of Engineering<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Computer Science Division  EECS<br>
&emsp;Fall 2009                    John Kubiatowicz<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Midterm I<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;SOLUTIONS<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;October 19th, 2009<br>
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

&emsp;Page 1/20


---

<a id="page-2"></a>
**Page 2**

CS 162 Fall 2009 Midterm I October 19th, 2009

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[ This page left for  \]

3.14159265358979323846264338327950288419716939937510582097494459230781640628620899

Page 2/20


---

<a id="page-3"></a>
**Page 3**

CS 162 Fall 2009 Midterm I October 19th, 2009


### Problem 1: True/False \[20 pts\]

Please EXPLAIN your answer in TWO SENTENCES OR LESS (Answers longer than this may not<br>
get credit!).  Also, answers without an explanation GET NO CREDIT.


### **Problem 1a\[2pts\]:** Apple was the first company to develop mice and overlapping windows.


![Figure on page 3](figures/solutions-p03-fig03.png)

Explain: Xerox Parc was the first to develop Mice and Windows


### **Problem 1b\[2pts\]:** A direct mapped cache can sometimes have a higher hit rate than a fully

associative cache with an LRU replacement policy (on the same reference pattern).


![Figure on page 3](figures/solutions-p03-fig04.png)

&emsp;&emsp;True / False<br>
&emsp;&emsp;Explain: A pattern that repeatedly accesses (X+1) sequential memory addresses in<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;a cache with X memory lines will exhibit a higher hit rate in a direct<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;mapped cache than a fully associative cache with an LRU replacement<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;policy.


### **Problem 1c\[2pts\]:** Threads within the same process share the same heap and stack.


![Figure on page 3](figures/solutions-p03-fig05.png)

&emsp;&emsp;Explain: Each Thread must have its own stack – whether or not it shares a process<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;with another thread.


### **Problem 1d\[2pts\]:** A microkernel-style operating system uses multiple address spaces inside the

operating system – with components such as the file system, network stack, and device drivers all<br>
running at user level.


![Figure on page 3](figures/solutions-p03-fig06.png)

&emsp;&emsp;True / False<br>
&emsp;&emsp;Explain: By structuring the OS in this way, microkernels prevent different<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;components from being able to crash one another. Example: Mach


### **Problem 1e\[2pts\]:** An operating system that implements on-demand paging on a machine with

software TLB miss handling (such as MIPS) must use an inverted page table.


![Figure on page 3](figures/solutions-p03-fig07.png)

&emsp;&emsp;Explain: A machine with a software TLB can utilize any format of page table, since<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;the page table walk is handled in software.

Page 3/20


---

<a id="page-4"></a>
**Page 4**

CS 162 Fall 2009 Midterm I October 19th, 2009


### **Problem 1f\[2pts\]:** If the banker's algorithm finds that it's safe to allocate a resource to an existing

thread, then all threads will eventually complete.


![Figure on page 4](figures/solutions-p04-fig08.png)

&emsp;&emsp;Explain: The banker’s algorithm simply prevents resource-related deadlock. One of<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;the threads could still go into an infinite loop and fail to complete.


### **Problem 1g\[2pts\]:** The Nachos operating system uses Mesa-style condition variables for all

synchronization.


![Figure on page 4](figures/solutions-p04-fig09.png)

Explain: Nachos uses semaphores and interrupt enable/disable for some things.


### **Problem 1h\[2pts\]:** The lottery scheduler prevents CPU starvation by assigning at least one ticket to

each scheduled thread.


![Figure on page 4](figures/solutions-p04-fig10.png)

&emsp;&emsp;True / False<br>
&emsp;&emsp;Explain: By assigning at least one ticket to every thread, the lottery scheduler<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;makes sure that every thread gets at least some CPU time.


### **Problem 1i\[2pts\]:** Multicore chips (i.e. processor chips with more than one CPU on them) are only

here for the short term (next few years) until the transistor feature size reaches 10nm.


![Figure on page 4](figures/solutions-p04-fig11.png)

&emsp;&emsp;Explain: The issues that caused manufacturers to switch to multicore (too much<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;power dissipation, insufficient instruction-level parallelism) will not go<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;away anytime soon.


### **Problem 1j\[2pts\]:** Thread pools are a useful tool to help prevent the “Slashdot” effect from

crashing Web servers.


![Figure on page 4](figures/solutions-p04-fig12.png)

&emsp;&emsp;True / False<br>
&emsp;&emsp;Explain: Utilizing one thread/request in a web server is lower overhead than<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;utilizing one process/request.  By utilizing thread pools, a web server<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;limits the total number of threads executing at any given time, thus<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;preventing an overload (Slashdot effect) from exhausting resources by<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;launching an unbounded number of threads.<br>
Page 4/20


---

<a id="page-5"></a>
**Page 5**

CS 162 Fall 2009 Midterm I October 19th, 2009


### Problem 2: Synchronization \[18 pts\]


### **Problem 2a\[3pts\]:** Consider a Hash table with the following interface:

&emsp;`1. public class HashTable {`<br>
`2.`     `public void Put(int Key, int Value) {}`<br>
`3.`     `public int Get(int Key) {}      // Return 0 if no previous Put() on Key`<br>
`4.`     `public void Remove(int Key) {}  // No-op if no previous Put() on Key`<br>
`5. }`<br>
Assume that `Get()` must return the valid `Value` for any `Key` that has been written by previous<br>
`Put()` methods.  If a `Put()` method on a given `Key` is happening at the same time as a `Get()`<br>
method, then the `Get()` method may return an earlier `Value`. In our attempt to make the<br>
HashTable threadsafe (i.e. usable by multiple threads at the same time), we might decided to make<br>
all three methods “synchronized” methods (e.g. Java synchronized statements). Would this have<br>
negative performance implications?  Explain carefully (fully justify your answer; if the answer is<br>
“yes”, explain why you think you could get better threadsafe performance. If the answer is “no”,<br>
explain why this is the best threadsafe performance you could expect):<br>
&emsp;Yes. Hash tables are arranged as a series of buckets with linked lists of Key/Value pairs in each bucket.<br>
&emsp;Thus, at minimum, each hash bucket could be handled independently—even allowing simultaneous<br>
&emsp;writes to different hash buckets. A better solution would use a lock-free queue implementation to insert<br>
&emsp;new items at the beginning of hash buckets. In this implementation, readers and writers to the same hash<br>
&emsp;bucket would be able to proceed in parallel.  The only snag would be handling “Remove”. Although you<br>
&emsp;could do this in the lock-free fashion as well, it is tricky.  Simply storing a “0” in the link for the<br>
&emsp;removed Key will have the correct external behavior.


### **Problem 2b\[2pts\]:** Explain the difference in behavior between `Semaphore.V()` and

`CondVar.signal()` when no threads are waiting in the corresponding semaphore or condition<br>
variable:<br>
&emsp;Semaphore.V() will increment the semaphore.  Consequently, a subsequent Semaphore.P() will not wait.<br>
&emsp;In contrast, CondVar.signal() does nothing if no threads are waiting. Thus a subsequent CondVar.wait()<br>
&emsp;will always wait.


### **Problem 2c\[3pts\]:** Explain how **Nachos** is able to implement the correct semantics for

`CondVar.signal()` using `Semaphore.V()`. Be explicit and make sure to explain why the<br>
different of (2b) is not an issue here.<br>
&emsp;Nachos implements each condition variable as a queue of semaphores, each of which holds a single<br>
&emsp;sleeping thread. Consequently, executing CondVar.signal() when no threads are sleeping does nothing,<br>
&emsp;since it encounters an empty queue. When something is sleeping in the condition variable,<br>
&emsp;CondVar.signal() extracts a single semaphore, then executes a single Semaphore.V() to wake up one<br>
&emsp;thread.


### **Problem 2d\[2pts\]:** Give two reasons why this is a bad implementation for a lock:

&emsp;&emsp;`lock.acquire() { disable interrupts; }`<br>
&emsp;&emsp;`lock.release() { enable interrupts; }`<br>
&emsp;There are a number of reasons why this is a bad implementation for a lock.  (1) It prevents hardware<br>
&emsp;events from occurring during the critical section, (2) User programs cannot use this lock, (3) It doesn’t<br>
&emsp;work for data shared between different processors.

Page 5/20


---

<a id="page-6"></a>
**Page 6**

CS 162 Fall 2009 Midterm I October 19th, 2009


### **Problem 2e\[8pts\]:** Suppose that we want a finite synchronized FIFO queue that can handle

&emsp;multiple simultaneous `enqueue()` and `dequeue()`operations.  Assume that `enqueue()` and<br>
&emsp;`dequeue()` are not allowed to busywait (but rather must sleep) when the queue is either full or<br>
&emsp;empty respectively. Here is a sketch of an implementation utilizing a circular buffer:<br>
`1. static final int QUEUESIZE=100;`<br>
`2. class FIFOQueue {`<br>
`3.`     `Lock FIFOLock=new Lock();`    `// Methods acquire() and release()`<br>
`4.`     `CondVar CV1=new CondVar(FIFOLock);// Methods wait(),signal(),broadcast()`<br>
`5.`     `CondVar CV2=new CondVar(FIFOLock);// Methods wait(),signal(),broadcast()`<br>
`6.`     `Object FIFO[QUEUESIZE];`     `// Finite circular queue of Objects`<br>
`7.`     `int head = 0, tail = 0;`     `// Start out “empty”`<br>
`8.`<br>
`9.`     `void Enqueue(Object newobject)  {`<br>
`10.`         `/* Enqueue Method. Spin until can enqueue */`<br>
`11.`     `}`<br>
`12.`     `Object Dequeue()  {`<br>
`13.`         `/* Dequeue Method. Spin until can dequeue */`<br>
`14.`     `}`<br>
`15. }`<br>
Implement the `Enqueue()` and `Dequeue()` methods using monitor synchronization. You should<br>
enqueue using the tail variable and dequeue at the head. Remember that spin waiting is not allowed.<br>
You should have no more than 10 lines for each method. Hint: make sure to account for wrapping<br>
of head and tail pointers and assume Mesa scheduling of the monitors.<br>
&emsp;&emsp;`void Enqueue(Object newobject)  {`<br>
`// ANSWER: Here is one implementation:`<br>
`FIFOLock.acquire();`<br>
`// While full (cannot add entry to queue), wait`<br>
`while ((tail+1)%QUEUESIZE == head)`<br>
`CV1.wait();`<br>
`FIFO[tail] = newobject;`         `// Add item to queue`<br>
`tail = (tail+1)%QUEUESIZE;`     `// Expose item to consumer`<br>
`CV2.signal();`             `// Wake a sleeping consumers`<br>
`FIFOLock.release();`

&emsp;&emsp;`}`<br>
&emsp;&emsp;`Object Dequeue()  {`<br>
`// ANSWER: Here is one implementation:`<br>
`Object result;`<br>
`FIFOLock.acquire();`<br>
`// While empty (cannot get entry from queue), wait`<br>
`while (head==tail)`<br>
`CV2.wait();`<br>
`result = FIFO[head];`         `// Get item from queue`<br>
`head = (head+1)%QUEUESIZE;`     `// Free up its slot`<br>
`CV1.signal();`             `// Wake a sleeping producer`<br>
`FIFOLock.release();`<br>
`return result;`

&emsp;&emsp;`}`<br>
Page 6/20


---

<a id="page-7"></a>
**Page 7**

CS 162 Fall 2009 Midterm I October 19th, 2009<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[ This page intentionally left blank \]

Page 7/20


---

<a id="page-8"></a>
**Page 8**

CS 162 Fall 2009 Midterm I October 19th, 2009


### Problem 3: Deadlock and the Cephalopod Banquet \[24pts\]


### **Problem 3a\[4pts\]:** Name and explain the four conditions for deadlock**:**

&emsp; Mutual exclusion – Only one thread at a time can hold a given resource<br>
&emsp; Hold and Wait – Thread holding at least one resource is waiting for another one<br>
&emsp; No Preemption – Resources are released only voluntarily by the thread holding the<br>
&emsp;&emsp;resource, after thread is finished with it<br>
&emsp; Circular Wait – There exists a set {T1, …, Tn} of waiting threads, with T1 waiting for a<br>
&emsp;&emsp;resource held by T2, T2 waiting for a resource held by T3, …, Tn waiting for a resource<br>
&emsp;&emsp;held by T1


### **Problem 3b\[2pts\]:** Suppose that we utilize the Banker’s algorithm to determine whether or not to

grant resource requests to threads. The job of the Banker’s algorithm is to keep the system in a<br>
“SAFE” state. It denies resource requests by putting the requesting thread to sleep if granting the<br>
request would cause the system to enter an “UNSAFE” state, waking it only when the request could<br>
be granted safely. What is a SAFE state?<br>
&emsp;In a safe state, there is some ordering of the threads in the system such that threads can<br>
&emsp;complete, one after another without deadlocking and without requiring threads to give up<br>
&emsp;resources that they already have.


### **Problem 3c\[3pts\]:** Explain how the Banker’s algorithm prevents deadlock by removing one or

more of the conditions of deadlock from (3a).  Be explicit.<br>
&emsp;This question is a bit of a trick question. The four conditions of deadlock from (3a) are<br>
&emsp;necessary but not sufficient. Thus, while the four conditions will continue to exist individually,<br>
&emsp;the Banker’s algorithm avoids exactly those configurations of the resource graph that exhibit<br>
&emsp;non-resolvable cycles consisting of all four of the deadlock conditions from (3a).<br>
&emsp;Those of you that said that the Banker’s algorithm will eliminate “circular waiting” or “hold<br>
&emsp;and wait” did not get full credit, since threads may still be put to sleep (by Banker’s algorithm)<br>
&emsp;while holding resources; since they will be woken up by the Banker’s algorithm when other<br>
&emsp;threads finally release their resources, the sleeping threads are effectively waiting on these<br>
&emsp;other threads. However, we did give credit to people who said that the Banker’s algorithm<br>
&emsp;prevents indefinite circular waiting or hold and wait (or some variant of this statement that<br>
&emsp;mentions the fact that the conditions do not persist indefinitely).

Page 8/20


---

<a id="page-9"></a>
**Page 9**

CS 162 Fall 2009 Midterm I October 19th, 2009


### **Problem 3d\[4pts\]:** Suppose that we wish to evaluate the current state of the system and declare

&emsp;whether or not it is in a SAFE state. In order to do this, we will need to keep explicit track of the<br>
&emsp;resources in the system.  In particular, if there were only two types of resource, we could<br>
&emsp;describe the state of the system with the following data structures:<br>
&emsp;`class FreeResources {`<br>
`int FreeResA, FreeResB; // Number of copies of resource that are free`<br>
`}`<br>
`/* Per-thread descriptor of thread resources */`<br>
`class ThreadResources {`<br>
`int MaxNeededA, MaxNeededB;`    `// Max number copies of resource needed`<br>
`int CurHeldA, CurHeldB;`      `// Current number resources held`<br>
`}`<br>
`ThreadResources[] ThreadRes;`<br>
Assume that FreeRes and ThreadRes have been initialized to reflect the current state of the system.<br>
Here is a sketch for how we could check for safety:

&emsp;`1. boolean IsSAFE(FreeResources FreeRes, ThreadResources[] ThreadRes) {`<br>
`2.`     `Int FreeA = FreeRes.FreeResA, FreeB = FreeRes.FreeResB;`<br>
`3.`     `boolean[] ThreadFinished = new boolean[ThreadRes.length];`<br>
`4.`     `int RemainingThreads = ThreadRes.length;`<br>
`5.`     `boolean finished = false;`<br>
`6.`     `while (!finished) {`<br>
`7.`         `finished = true;`<br>
`8.`         `for (int i = 0; i < ThreadRes.length; i++) {`<br>
`9.`             `if (!ThreadFinished[i]) {`<br>
`10.`             `/* Missing Code */`<br>
`11.`             `}`<br>
`12.`         `}`<br>
`13.`     `}`<br>
`14.`     `return (RemainingThreads == 0); /* SAFE if no threads left */`<br>
`15. }`<br>
Provide the missing Code at line 10.  **This code should have no more than 8 lines and should not**<br>
**alter the external variables (arguments).** Hint: work through the threads that can complete.<br>
Code for Line 10:<br>
`if ((ThreadRes[i].MaxNeededA – ThreadRes[i].CurHeldA) <= FreeA)&&`<br>
`(ThreadRes[i].MaxNeededB – ThreadRes[i].CurHeldB) <= FreeB)) {`<br>
`ThreadFinished[i] = true;`<br>
`finished = false;`<br>
`FreeA += ThreadRes[i].CurHeldA;`<br>
`FreeB += ThreadRes[i].CurHeldB;`<br>
`RemainingThreads -= 1;`<br>
`}`

Page 9/20


---

<a id="page-10"></a>
**Page 10**

CS 162 Fall 2009 Midterm I October 19th, 2009

**The Cephalopod Diners Problem:** Consider a large table with **identical** multi-even-armed<br>
cephalopods (e.g. octopuses). **In the center is a pile of forks and knives.**  Before eating, each diner<br>
must have an equal number of forks and knives, one in each arm (e.g. if octopuses are eating, they<br>
would each need four forks and four knives). The creatures are so busy talking that they can only<br>
grab one utensil at a time. They also grab utensils in a random order until they have enough utensils<br>
to eat. After they finish eating, they return all of their utensils at once. Diners are implemented as<br>
threads that ask for utensils and return them when finished. Consider the following sketch for a<br>
CephTable class to implement the Cephalopod Diners problem using **monitor synchronization:**<br>
&emsp;`1.` `class DinerUtensils {`<br>
&emsp;`2.`     `public int forks,knives;`          `// utensils held by creature`<br>
&emsp;`3. }`                     `// clearly forks+Knives <= NumArms`<br>
`4. public class CephTable {`<br>
`5.`     `Lock lock = new Lock();`            `// acquire(), release()`<br>
`6.`     `CondVar CV = new CondVar(lock);//wait(),signal(),broadcast();`<br>
`7.`     `public DinerUtensil[] Diners;`     `// Accounting: utensils for each diner`<br>
`8.`     `int NumArms;`            `// Number of arms for every diner`<br>
`9.`     `int IdleForks, IdleKnives;`         `// Number of forks/knives on table`<br>
`10.`<br>
`11.`     `public CephTable(int NumDiners, int NumArms, int Forks, int Knives){`<br>
`12.`         `Diners = new DinerUtensils[NumDiners]; // info about each Diner`<br>
`13.`         `This.NumArms = NumArms;`         `// Number of arms per Diner`<br>
`14.`         `This.IdleForks = Forks;`         `// Number Forks on table initially`<br>
`15.`         `This.IdleKnives = Knives;`     `// Number Knives on table initially`<br>
`16.`     `}`<br>
`17.`     `public void GrabUtensil(int CephalopodID, boolean WantFork) {`<br>
`18.`         `/* Try to grab a utensil from table */`<br>
`19.`     `}`<br>
`20.`     `public void DoneEating(int CephalopodID) {`<br>
`21.`         `/* Return all chopsticks to pile */`<br>
`22.`         `lock.acquire();`<br>
`23.`         `IdleForks += Diners[CephalopodID].forks;`<br>
`24.`         `IdleKnives += Diners[CephalopodID].knives;`<br>
`25.`         `Diners[CephalopodID].forks = 0;`<br>
`26.`         `Diners[CephalopodID].knives = 0;`<br>
`27.`         `CV.broadcast();`<br>
`28.`         `lock.release();`<br>
`29.`     `}`<br>
`30.`     `boolean CephCheck(int CephalopodID, int numforks, int numknives) {`<br>
`31.`         `/* See if ok to give dinner numforks forks and numknives knives. */`<br>
`32.`     `}`<br>
`33. }`


### **Problem 3e\[3pts\]:** In its general form, the Banker’s algorithm makes a decision about whether or

not to allow an allocation request by making multiple passes through the set of resource holders<br>
(threads). See, for instance, the fact that there are two loops in (3d) to determine safety. Explain<br>
why a Banker’s algorithm dedicated to the Cephalopod Diners problem, namely the CephCheck()<br>
routine, could operate with a single pass through the resources holders:<br>
&emsp;Since every diner (Cephalopod) at a given table has an identical number of arms (and thus resource<br>
&emsp;requirements), once the Banker’s algorithm has determined that a single Cephalopod can complete, then<br>
&emsp;we know that they all can complete \[simply put all of its resources back on the table, then there will be<br>
&emsp;enough on the table for anyone to complete\]. Thus, we need only a single pass through the diners to see<br>
&emsp;if any of them can complete.

Page 10/20


---

<a id="page-11"></a>
**Page 11**

CS 162 Fall 2009 Midterm I October 19th, 2009


### **Problem 3f\[4pts\]:** Implement the CephCheck method of the CephTable Object, namely fill in code

for line 31 above. This method should implement the Banker’s algorithm: return true if the given<br>
Cephalopod can be granted ‘`numforks`’ forks and ‘`numknives`’ knives without taking the<br>
system out of a SAFE state. Do not blindly implement the Banker’s algorithm: this method only<br>
needs to have the same external behavior as the Banker’s algorithm for this application. Note that<br>
this method is part of the CephTable Object and thus has access to local variables of that object.<br>
**This code should not permanently alter the local variables of the CephTable Object (although it**<br>
**can do so temporarily).** Do not worry about making this routing threadsafe; it will be called with a<br>
lock held. We will give full credit for a solution that takes a single pass through the diners, partial<br>
credit for a working solution, and no credit for a solution with more than 15 lines. Hint: it is easier<br>
to first check the requesting Cephalopod, then the rest.<br>
Code for Line 31:<br>
`// First, check to see if we are asking for more utensils than on table.`<br>
`// Note: the loop at the bottom covers this check; however, we only gave`<br>
`// credit for omitting this check if you specifically mentioned how it works`<br>
`if (numforks > IdleForks || numknives > IdleKnives)`<br>
`return false;`<br>
`// Next check if current requesting Cephalopod can complete`<br>
`if ((NumArms/2 - Diners[CephalopodID].forks) <= IdleForks) &&`<br>
`(NumArms/2 – Diners[CephalopodID].knives) <= IdleKnives))`<br>
`return true;`<br>
`//Check every one else (wrong for current requester, but handled above)`<br>
`for (int loop = 0; loop < Diners.length; loop++)`<br>
`if ((NumArms/2 – Diners[loop].forks) <= IdleForks – numforks) &&`<br>
`(NumArms/2 – Diners[loop].knives) <= IdleKnives – numknives))`<br>
`return true;`<br>
`return false;`


### **Problem 3g\[4pts\]:** Implement the code for the GrabUtensil() routine, namely fill in code for line 18

above. Its behavior is that it should check to whether or not it is ok to grant the requested type of<br>
utensil to the caller and if not, sleep until it is ok. This code should call the CephCheck() routine as<br>
a subroutine and should be threadsafe namely, it should be able to deal with multiple threads<br>
accessing the state simultaneously. You should implement this routine as a monitor and assume<br>
Mesa scheduling. It is up to the Cephalopod to eat and subsequently call DoneEating(); you should<br>
not do that in GrabUtensil(). This routine can be written in 8 lines, but you can use up to 12:<br>
Code for Line 18:<br>
&emsp;`// Here is a 10 line version. Get 8 line version by inlining expressions`<br>
&emsp;`// for numforks and numknives`<br>
`int numforks = (WantFork?1:0);`<br>
`int numknives = (WantFork?0:1);`<br>
`lock.acquire()`<br>
`while (CephCheck(CephalopodID,  numforks, numknives))`<br>
`CV.wait();`<br>
`IdleForks -= numforks;`<br>
`IdleKnives -= numknives;`<br>
`Diners[CephalopodID].forks += numforks;`<br>
`Diners[CephalopodID].knives += numknives;`<br>
`lock.release();`<br>
Page 11/20


---

<a id="page-12"></a>
**Page 12**

CS 162 Fall 2009 Midterm I October 19th, 2009

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[ This page intentionally left blank \]

Page 12/20


---

<a id="page-13"></a>
**Page 13**

CS 162 Fall 2009 Midterm I October 19th, 2009


### Problem 4: Virtual Memory \[20 pts\]

Consider a multi-level memory management scheme with the following format for virtual<br>
addresses:


![Figure on page 13](figures/solutions-p13-fig13.png)

Virtual addresses are translated into physical addresses of the following form:


![Figure on page 13](figures/solutions-p13-fig14.png)

Page table entries (PTE) are 32 bits in the following format, stored in big-endian form in memory<br>
(i.e. the MSB is first byte in memory):


![Figure on page 13](figures/solutions-p13-fig15.png)

Here, “Valid” means that a translation is valid, “Writeable” means that the page is writeable, “User”<br>
means that the page is accessible by the User (rather than only by the Kernel). Note: the phrase<br>
“page table” in the following questions means the multi-level data structure that maps virtual<br>
addresses to physical addresses.


### **Problem 4a\[2pts\]:** How big is a page? Explain.

&emsp;Since the offset is 12 bits, then a page is 212=4096 bytes. You had to show an actual calculation and<br>
&emsp;mention the offset to get full credit.


### **Problem 4b\[2pts\]:** Suppose that we want an address space with one physical page at the top of the

address space and one physical page at the bottom of the address space. How big would the page<br>
table be (in bytes)? Explain.<br>
&emsp;The page table of interest has two non-null pointers for the first level, pointing at 2 second-level<br>
&emsp;elements of the page table. Each element is a page in size.  Thus, there are 3 pages = 3  4096 = 12288


### **Problem 4c\[2pts\]:** What is the maximum size of a page table (in bytes) for this scheme? Explain.

&emsp;The maximum page table size has an entry for every virtual address.  Thus -- all pointers non-null at the<br>
&emsp;top level, each of which points at a second-level element of the page table.  Thus, the total size of the<br>
&emsp;page table has 1 + 1024 = 1025 page table elements = 1025  4096 = 4198400 bytes.


### **Problem 4d\[2pts\]:** How big would each entry of a fully-associative TLB be for this management

scheme?  Explain.<br>
&emsp;Each entry of a fully-associative cache needs enough storage for (1) the cache tag and (2) the valid bit.<br>
&emsp;The tag for a TLB is the virtual page number, which is 20 bits. A valid bit is 1 bit. Thus, the simplest<br>
&emsp;correct answer for this question is 21 + 32 (size of PTE) = 53 bits. A slightly more sophisticated answer<br>
&emsp;would recognize that there are 4 bits in the PTE that are not needed by the hardware (bits 8-11). Thus,<br>
&emsp;one could say that there are 21 + 28 = 49 bits.

Page 13/20


---

<a id="page-14"></a>
**Page 14**

CS 162 Fall 2009 Midterm I October 19th, 2009


### **Problem 4e\[2pts\]:** Sketch the format of the page-table for the multi-level virtual memory

management scheme of (4a). Illustrate the process of resolving an address as well as possible.<br>
&emsp;We were looking for something like the following diagram:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Virtual AddressVirtual Address


![Figure on page 14](figures/solutions-p14-fig16.png)

Physical AddressPhysical Address


### **Problem 4f\[10pts\]:** Assume the memory translation scheme from (4a). Use the Physical Memory

table given on the next page to predict what will happen with the following load/store instructions.<br>
Assume that the base table pointer for the current **user level process** is `0x00200000.`<br>
Addresses are virtual. The return value for a load is an 8-bit data value or an error, while the return<br>
value for a store is either “**ok**” or an error. Possible errors are: **invalid, read-only, kernel-only.**<br>
Hint: Don’t forget that Hexidecimal digits contain 4 bits!


![Figure on page 14](figures/solutions-p14-fig17.png)


![Figure on page 14](figures/solutions-p14-fig18.png)

Page 14/20


---

<a id="page-15"></a>
**Page 15**

&emsp;CS 162 Fall 2009 Midterm I October 19th, 2009

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Physical Memory \[All Values are in Hexidecimal\]**


![Figure on page 15](figures/solutions-p15-fig19.png)

&emsp;Page 15/20


---

<a id="page-16"></a>
**Page 16**

CS 162 Fall 2009 Midterm I October 19th, 2009


### Problem 5: Scheduling \[18pts\]


### **Problem 5a\[2pts\]:** Give two ways in which to predict runtime in order to approximate SRTF:

&emsp;Two options that we gave in class were (1) use a predictive algorithm that uses past behavior to predict<br>
&emsp;the future (such as a weighted average of the previous prediction and the previous value), (2) use a<br>
&emsp;scheduling algorithm( such as a multi-level scheduler) that tries to separate short burst applications<br>
&emsp;from long burst applications and schedules the short-burst applications with higher priority.


### **Problem 5b\[2pts\]:** What scheduling problem did the original Mars rover experience?  What were

the consequences of this problem?<br>
&emsp;The original Mars rover exhibited a priority inversion problem: A low-priority task grabbed a lock on<br>
&emsp;the bus; a high-priority task was forced to wait for the bus; further, a medium priority task prevented the<br>
&emsp;low-priority task from completing.  The result was that the high-priority task made no forward progress;<br>
&emsp;eventually, a timer went off, decided something was wrong, and rebooted the system. Consequently, the<br>
&emsp;system kept rebooting.


### **Problem 5c\[3pts\]:**

Five jobs are waiting to be run. Their expected running times are 10, 8, 3, 1, and X. In what order<br>
should they be run to minimize average completion time? State the scheduling algorithm that<br>
should be used AND the order in which the jobs should be run. HINT: Your answer will explicitly<br>
depend on X.<br>
&emsp;To minimize average completion time, we need to use SRTF.  The answer depends on X in the following<br>
&emsp;way:<br>
&emsp;`X, 1, 3, 8, 10`    `if X < 1`<br>
&emsp;`1, X, 3, 8, 10`  `if 1`   `X < 3`<br>
&emsp;`1, 3, X, 8, 10`  `if 3`   `X < 8`<br>
&emsp;`1, 3, 8, X, 10`  `if 8`   `X <10`<br>
&emsp;`1, 3, 8, 10, X`  `if 10`   `X`

Page 16/20


---

<a id="page-17"></a>
**Page 17**

CS 162 Fall 2009 Midterm I October 19th, 2009


### **Problem 5d\[5pts\]:**

Here is a table of processes and their associated arrival and running times.


![Figure on page 17](figures/solutions-p17-fig20.png)

Show the scheduling order for these processes under 3 policies: First Come First Serve (FCFS),<br>
Shortest-Remaining-Time-First (SRTF), Round-Robin (RR) with timeslice quantum = 1. Assume<br>
that context switch overhead is 0 and that new RR processes are added to the **head** of the queue and<br>
new FCFS processes are added to the **tail** of the queue.


![Figure on page 17](figures/solutions-p17-fig21.png)

Page 17/20


---

<a id="page-18"></a>
**Page 18**

CS 162 Fall 2009 Midterm I October 19th, 2009


### **Problem 5e\[3pts\]:** Can any of the three scheduling schemes (FCFS, SRTF, or RR) result in

starvation?  If so, how might you fix this?<br>
&emsp;Yes. SRTF continuously places short jobs in front of long jobs.  Consequently, it is possible for long jobs<br>
&emsp;to never get a chance to run.<br>
&emsp;You can fix this by utilizing an algorithm that guarantees that no thread is prevented from making<br>
&emsp;forward progress.  Example: use a lottery scheduler or a multi-level scheduler that gives a guaranteed<br>
&emsp;minimum amount of compute time to the lowest-priority (background) tasks.<br>
&emsp;Note that FCFS and RR don’t really experience starvation (although you might be able to make an<br>
&emsp;argument that RR has a problem if you always put new jobs at the front of the queue and short jobs<br>
&emsp;arrive faster than the quantum).


### **Problem 5f\[3pts\]:** Explain why a chess program running against another program on the same

machine might want to perform a lot of superfluous I/O operations.<br>
&emsp;By executing a lot of superfluous I/O, the chess program might be able to fool a scheduler into thinking<br>
&emsp;that the chess program is an interactive task that should get more compute cycles.  The net effect would<br>
&emsp;be that the program performing the superfluous I/O might be able to get more “thinking” done per unit<br>
&emsp;time that the one that didn’t perform extra I/O.

Page 18/20


---

<a id="page-19"></a>
**Page 19**

CS 162 Fall 2009 Midterm I October 19th, 2009

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[Scratch Page: Do not put answers here!\]

Page 19/20


---

<a id="page-20"></a>
**Page 20**

CS 162 Fall 2009 Midterm I October 19th, 2009

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[Scratch Page: Do not put answers here!\]

Page 20/20

