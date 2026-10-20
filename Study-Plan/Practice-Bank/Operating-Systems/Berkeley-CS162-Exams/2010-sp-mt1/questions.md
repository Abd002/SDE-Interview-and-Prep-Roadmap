# Berkeley CS162 Spring 2010: Midterm 1: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

Student Name: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_      SID: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**University of California at Berkeley**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**College of Engineering**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**Department of Electrical Engineering and Computer Science**

CS 162    I. Stoica<br>
Spring 2010

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;FIRST MIDTERM EXAMINATION<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Tuesday, March 9, 2010

INSTRUCTIONS—READ THEM NOW! This examination is CLOSED BOOK/CLOSED NOTES. There<br>
is no need for calculations, and so you will not require a calculator, Palm Pilot, laptop computer, or other<br>
calculation aid. Please put them away. You MAY use one 8.5” by 11” double-sided crib sheet, as densely<br>
packed with notes, formulas, and diagrams as you wish. The examination has been designed for 100<br>
minutes/100 points (1 point = 1 minute, so pace yourself accordingly). All work should be done on the<br>
attached pages.

In general, if something is unclear, write down your assumptions as part of your answer. If your<br>
assumptions are reasonable, we will endeavor to grade the question based on them. If necessary, of course,<br>
you may raise your hand, and a TA or the instructor will come to you. Please try not to disturb the students<br>
taking the examination around you.

We will post solutions to the examination as soon as possible, and will grade the examination as soon as<br>
practical, usually within a week. Requests for regrades should be submitted IN WRITING, explaining why<br>
you believe your answer was incorrectly graded, within ONE WEEK of the return of the examination in<br>
class. We try to be fair, and do realize that mistakes can be made during the regarding process. However,<br>
we are not sympathetic to arguments of the form “I got half the problem right, why did I get a quarter of the<br>
points?”

\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_     SID: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_<br>
(Signature)

\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_                 Discussion Section (Day/Time): \_\_\_\_\_\_\_\_<br>
(Name—Please Print!)


![Figure on page 1](figures/questions-p01-fig01.png)

CS 162 Midterm    Page 1     March 9, 2010; 3:30-6:30 PM


---

<a id="page-2"></a>
**Page 2**

Student Name: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_      SID: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_


### **Question 1. (20 points)**

**True or False** (12 points). Instructions: write “true” or “false” after each of the following<br>
statements (Please give one statement justification for each of your answers).<br>
&emsp;a.  (2 points) Each physical page belongs to only one process.

&emsp;b. (2 points) Every interrupt changes the CPU from user mode to kernel mode.

&emsp;c. (2 points) All Page Table entries will be invalid directly after a context switch between<br>
&emsp;&emsp;processes.

&emsp;d. (2 points) The CPU scheduling policy that minimizes average completion time can lead<br>
&emsp;&emsp;to starvation.

&emsp;e. (2 points) If there is only one CPU in the computer, then at most one process can be in<br>
&emsp;&emsp;the “running” state at any time.

&emsp;f. (2 points) The ”Shortest-Job-First” policy always results in the lowest average<br>
&emsp;&emsp;completion time in a batch system.

CS 162 Midterm    Page 2     March 9, 2010; 3:30-6:30 PM


---

<a id="page-3"></a>
**Page 3**

Student Name: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_      SID: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

**Multiple Choice, fill in the blank, short answer** (8 points). Instructions: Circle the correct<br>
option(s), or fill in the blanks below.<br>
&emsp;a. (2 points) Page Tables can be stored (circle all answers that apply):<br>
&emsp;&emsp;&emsp;a. In physical memory<br>
&emsp;&emsp;&emsp;b. In the L2 Cache<br>
&emsp;&emsp;&emsp;c. On the hard drive

&emsp;b. (2 points) Condition variables support the following 3 operations:<br>
&emsp;&emsp;&emsp;a. \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_<br>
&emsp;&emsp;&emsp;b. \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_<br>
&emsp;&emsp;&emsp;c. \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

&emsp;c. (2 points) Of the following items, circle those that are stored in the thread control block.<br>
&emsp;&emsp;&emsp;a. CPU registers<br>
&emsp;&emsp;&emsp;b. page table pointer<br>
&emsp;&emsp;&emsp;c. stack pointer<br>
&emsp;&emsp;&emsp;d. ready list<br>
&emsp;&emsp;&emsp;e. segment table<br>
&emsp;&emsp;&emsp;f. thread priority<br>
&emsp;&emsp;&emsp;g. program counter

&emsp;d. (2 points) Processes (or threads) can be in one of three states: **Running**, **Ready**, or<br>
&emsp;&emsp;**Waiting**. For each of the following examples, write down which state the process (or<br>
&emsp;&emsp;thread) is in:<br>
&emsp;&emsp;&emsp;a. Spin-waiting for a variable y to become zero. \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_<br>
&emsp;&emsp;&emsp;b. Having just completed an I/O, waiting to get scheduled again on the CPU.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_<br>
&emsp;&emsp;&emsp;c. Blocking on a condition variable for some other thread to signal it.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

CS 162 Midterm    Page 3     March 9, 2010; 3:30-6:30 PM


---

<a id="page-4"></a>
**Page 4**

Student Name: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_      SID: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_


### **Question 2.** Threads and Synchronization (20 points)

(a) (4 points) Give two reasons of why disabling interrupts can be a bad way to implement critical<br>
sections.

(b) (6 points) Assume you are given the CompareAndSwap atomic primitive defined (in C) as<br>
follows:

`bool CompareAndSwap(int* value, int from, int to) {`<br>
`if (*value == from) {`<br>
`*value = to;`<br>
`return true;`<br>
`}`<br>
`return false;`<br>
`}`

Consider the following implementation of lock acquire using CompareAndSwap:<br>
`void acquire() {`<br>
`while(!CompareAndSwap(&value, UNLOCKED, LOCKED));`<br>
`}`

&emsp;i) Give one reason why this implementation may not be efficient.

&emsp;ii) Without preemption, is this still a valid implementation of acquire()? Why? (Use no more<br>
&emsp;&emsp;than two sentences for your explanation.)

CS 162 Midterm    Page 4     March 9, 2010; 3:30-6:30 PM


---

<a id="page-5"></a>
**Page 5**

Student Name: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_      SID: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

(c) (8 points) Complete the following implementation of the P() and V() functions for a<br>
semaphore using condition variables using Mesa semantics.

`void P()  {`<br>
`lock.acquire();`

`value -= 1;`

`}`

`void V()  {`

`cond.wake();`

`lock.release();`<br>
`}`

(d) (2 points) How could you simplify your implementation if you were given condition variables<br>
that follow Hoare semantics instead of Mesa semantics? Use no more than two sentences to<br>
explain your answer.

CS 162 Midterm    Page 5     March 9, 2010; 3:30-6:30 PM


---

<a id="page-6"></a>
**Page 6**

Student Name: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_      SID: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_


### **Question 3.** Deadlock (20 points)

(a) (4 points) Name the four conditions under which deadlock occurs.

(b) Consider the resource allocation graph below consisting of four tasks (T1, T2, T3, and T4)<br>
and three resources (R1, R2, and R3). R1 has two instances while the other two resources have<br>
only one instance each. An arrow from a task to a resource denotes the fact that the task requests<br>
one instance of the resource, while an arrow from a resource to a task denotes the fact that the<br>
task holds an instance of the resource. Assume that resources cannot be preempted and tasks do<br>
not voluntary release resources before terminating.


![Figure on page 6](figures/questions-p06-fig02.png)

&emsp;i) (4 points) Are the tasks shown in the above resource graph deadlocked? If yes, explain<br>
&emsp;&emsp;&emsp;how each of the four deadlock conditions is satisfied. (Use one sentence per<br>
&emsp;&emsp;&emsp;condition.) If not, give a possible sequence in which the tasks execute.

CS 162 Midterm    Page 6     March 9, 2010; 3:30-6:30 PM


---

<a id="page-7"></a>
**Page 7**

Student Name: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_      SID: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

&emsp;ii) (4 points) Assume you are allowed to add an extra instance of either resource R1 or R2.<br>
&emsp;&emsp;&emsp;Are the tasks deadlocked in this case? If yes, explain how each of the four deadlock<br>
&emsp;&emsp;&emsp;conditions is satisfied. (Use one sentence per condition.) If not, give a possible<br>
&emsp;&emsp;&emsp;sequence in each the tasks execute.

(c) Consider the network below implementing wormhole routing between any two nodes. Each<br>
node is connected to six of its neighbors by two network links, one in each direction.<br>
Messages are routed from a source node to a destination node and can stretch through the network<br>
(i.e. consume links along the route from source to destination). Messages can cross inside nodes.<br>
Assume that no network link can service more than one message at a time, and that each message<br>
must consume a continuous set of channels (like a snake).<br>
Hint: You can think about a message as a train that spans multiple links (possible all the way<br>
from source to destination), and of each link as a one-way rail.


![Figure on page 7](figures/questions-p07-fig03.png)

CS 162 Midterm    Page 7     March 9, 2010; 3:30-6:30 PM


---

<a id="page-8"></a>
**Page 8**

Student Name: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_      SID: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

&emsp;i)  (4 points) Show a situation (with a drawing) in which messages are deadlocked and can<br>
&emsp;&emsp;&emsp;make no further progress. Explain how each of the four conditions of deadlock is<br>
&emsp;&emsp;&emsp;satisfied by your example.

&emsp;ii) (4 points) Define a routing policy that avoids deadlocks in the network of (i). Explain<br>
&emsp;&emsp;&emsp;using at most two sentences why your routing policy avoids deadlock.

CS 162 Midterm    Page 8     March 9, 2010; 3:30-6:30 PM


---

<a id="page-9"></a>
**Page 9**

Student Name: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_      SID: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_


### **Question 4.** CPU Scheduling (20 points)

Your boss asks you to pick a scheduling algorithm to run the following processes:<br>
&emsp;•<br>
&emsp;&emsp;P1, which requires 1 hour of CPU time to complete;<br>
&emsp;•<br>
&emsp;&emsp;P2, which requires 2 hours of CPU time to complete;<br>
&emsp;•<br>
&emsp;&emsp;P3, which requires 1 min of CPU time to complete;<br>
Assume all processes are ready at the same time.<br>
&emsp;a) (5 points) Assume you use First Come First Serve (FCFS) to schedule these processes.<br>
&emsp;&emsp;Which is the schedule with the largest average completion time? Which is the schedule<br>
&emsp;&emsp;with the smallest average completion times? Compute the average completion time in<br>
&emsp;&emsp;each case.

&emsp;b) (5 points) Assume you use Round-Robin with a time quanta (slice) of 100ms. What is the<br>
&emsp;&emsp;completion time of each job in this case? Assume that there is no context switch<br>
&emsp;&emsp;overhead.

CS 162 Midterm    Page 9     March 9, 2010; 3:30-6:30 PM


---

<a id="page-10"></a>
**Page 10**

Student Name: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_      SID: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

&emsp;c) (5 points) Now assume that P1 arrives at t=0, P2 arrives at time t=10min, and P3 at time<br>
&emsp;&emsp;t=20min. What will be the completion time of each process when using the Shortest<br>
&emsp;&emsp;Remaining Time First (SRTF)?

&emsp;d) (5 points) Assume now that P3 is performing an I/O operation every 10ms and that the<br>
&emsp;&emsp;I/O operation takes 40ms, but would still take 1 minute to run if it was the only process<br>
&emsp;&emsp;running. Assume that P1, P2, and P3 are submitted at the same time and you use Round-<br>
&emsp;&emsp;Robin scheduling (like in part (b)).<br>
&emsp;&emsp;&emsp;&emsp;&emsp;i)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;How long does it take P3 to complete if the time slice is 100ms?

&emsp;&emsp;&emsp;&emsp;&emsp;ii)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;What time slice length would minimize the completion time of P3?

CS 162 Midterm    Page 10     March 9, 2010; 3:30-6:30 PM


---

<a id="page-11"></a>
**Page 11**

Student Name: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_      SID: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_


### **Question 5.** Page Tables & TLBs (20 points)

Orange Inc hires you to design the virtual memory system for a new cell phone with 32-bit virtual<br>
and physical addresses, in which memory is allocated in 2 KB pages. Suppose that you decide to<br>
use a single-level page table, in which you also store three metadata bits for each page: Writable,<br>
Executable and Valid.

(a) (4 points) Answer the following questions, briefly explaining your solution:<br>
&emsp;i) How long, in bits, is a virtual page number?

&emsp;ii) How long, in bits, is a physical page number?

&emsp;iii) How long, in bits, is an offset within a page?

&emsp;iv) How much memory is needed to store the page table of each process?

(b) (4 points) Your manager asks you to consider using a multi-level page table in your design.<br>
Explain one advantage and one disadvantage of multi-level page tables over single-level page<br>
tables. (Use no more than four sentences in total.)

CS 162 Midterm    Page 11     March 9, 2010; 3:30-6:30 PM


---

<a id="page-12"></a>
**Page 12**

Student Name: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_      SID: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

(c) (12 points) In this question, you are asked to predict the results of a sequence of memory<br>
accesses on a machine with a single-level page table and a Translation Lookaside Buffer (TLB).<br>
Suppose that the machine has 20-bit virtual and physical addresses and 256-byte pages, and that<br>
the TLB is fully associative and holds 3 entries. The initial contents of the TLB and page table are<br>
shown on the next page. (For the page table, we show only a subset of the entries; assume that the<br>
ones not shown are not valid.)

**Initial TLB:**    **Page Table:**


![Figure on page 12](figures/questions-p12-fig04.png)

For each memory access in the sequence on the next page, write whether the TLB is hit, whether<br>
the access succeeds, and, if so, which physical address is accessed. Also show the state of the<br>
TLB after each access, assuming that TLB entries are replaced using a Least Recently Used<br>
(LRU) policy. Assume that the TLB is not updated if an invalid page is accessed.

CS 162 Midterm    Page 12     March 9, 2010; 3:30-6:30 PM


---

<a id="page-13"></a>
**Page 13**

Student Name: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_      SID: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_


![Figure on page 13](figures/questions-p13-fig05.png)

CS 162 Midterm    Page 13     March 9, 2010; 3:30-6:30 PM


---

<a id="page-14"></a>
**Page 14**

Student Name: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_      SID: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_


### **Question 6 (BONUS).** Thread Interleavings (5 points)

The following Java code implements insertion into a binary tree:<br>
`void insert(Node node, int value) {`<br>
`if (value <= node.value) {`<br>
`if (node.left == null) {`


![Figure on page 14](figures/questions-p14-fig06.png)

`node.left = new Node(value);`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`root`<br>
`} else {`<br>
`insert(node.left, value);`<br>
`}`<br>
`} else {`<br>
`if (node.right == null) {`<br>
`node.right = new Node(value);`<br>
`} else {`<br>
`insert(node.right, value);`<br>
`}`<br>
`}`<br>
`}`

Unfortunately, this implementation is not thread-safe. Suppose that we start with a binary tree<br>
containing the values 3, 5, and 7, organized as shown above, and that we have a reference `root`<br>
to the root node (the one containing 5). We then launch the two threads below, each of which tries<br>
to insert two values into the binary tree. What are the possible outcomes after both threads finish?<br>
Draw each possible resulting tree in a format like the starting tree above. (You may continue on<br>
the back of this page if necessary.)


![Figure on page 14](figures/questions-p14-fig07.png)

CS 162 Midterm    Page 14     March 9, 2010; 3:30-6:30 PM

