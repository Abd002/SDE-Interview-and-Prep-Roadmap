# Berkeley CS162 Fall 2015: Midterm 1: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;University of California, Berkeley<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;College of Engineering<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Computer Science Division  EECS<br>
&emsp;John Kubiatowicz<br>
&emsp;Fall 2015<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Midterm I<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;October 14th, 2015<br>
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

CS 162 Fall 2015 Midterm Exam I        October 14th, 2015

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[ This page left for  \]

&emsp;&emsp;&emsp;&emsp;3.141592653589793238462643383279502884197169399375105820974944

Page 2/21


---

<a id="page-3"></a>
**Page 3**

CS 162 Fall 2015 Midterm Exam I        October 14th, 2015


### Problem 1: TRUE/FALSE \[18 pts\]

In the following, it is important that you EXPLAIN your answer in TWO SENTENCES OR LESS<br>
(Answers longer than this may not get credit!).  Also, answers without an explanation GET NO<br>
CREDIT.


### **Problem 1a\[2pts\]:**  When you type Ctrl+C to quit a program in your terminal, you are actually

sending a SIGINT signal to the program, which makes it quit.<br>
&emsp;&emsp;True / False<br>
Explain:


### **Problem 1b\[2pts\]:** The function `pthread_intr_disable()` is a crude but viable way for

user programs to implement an atomic section.<br>
&emsp;&emsp;True / False<br>
Explain:


### **Problem 1c\[2pts\]:** If the banker's algorithm finds that it's safe to allocate a resource to an existing

thread, then all threads will eventually complete.<br>
&emsp;&emsp;True / False<br>
Explain:


### **Problem 1d\[2pts\]:** The lottery scheduler can be utilized to implement strict priority scheduling.

&emsp;&emsp;True / False<br>
Explain:


### **Problem 1e\[2pts\]:** Locks can be implemented using semaphores.

&emsp;&emsp;True / False<br>
Explain:

Page 3/21


---

<a id="page-4"></a>
**Page 4**

CS 162 Fall 2015 Midterm Exam I        October 14th, 2015


### **Problem 1f\[2pts\]:** Two processes can share information by reading and writing from a shared

linked list.<br>
&emsp;&emsp;True / False<br>
Explain:


### **Problem 1g\[2pts\]:** In Pintos, a kernel-level stack can grow as large as it needs to be to perform its

functions.<br>
&emsp;&emsp;True / False<br>
Explain:


### **Problem 1h\[2pts\]:** Suppose that a shell program wants to execute another program and wait on its

result.  It does this by creating a thread, calling exec from within that thread, then waiting in the<br>
original thread.<br>
&emsp;&emsp;True / False<br>
Explain:


### **Problem 1i\[2pts\]:** A network server in Linux works by calling `bind()` on a socket, and then

calling `listen()` on the socket in a loop to wait for new clients.<br>
&emsp;&emsp;True / False<br>
Explain:

Page 4/21


---

<a id="page-5"></a>
**Page 5**

CS 162 Fall 2015 Midterm Exam I        October 14th, 2015


### Problem 2: Short Answer \[18pts\]


### **Problem 2a\[2pts\]:** How does a modern OS regain control of the CPU from a program stuck in an

infinite loop?


### **Problem 2b\[2pts\]:** Is it possible for an interrupt handler (code triggered by a hardware interrupt) to

sleep while waiting for another event?  If so, explain how.  If not, explain why not.


### **Problem 2c\[2pts\]:** Why is it important for system calls to be vectored through the syscall table

(indexed by an integer syscall number) rather than allowing the user to specify a function address to<br>
be called by the kernel after it transitions to kernel mode?


### **Problem 2d\[3pts\]:** Name two advantages and one disadvantage of implementing a threading

package at user level (e.g. “green threads”) rather than relying on thread scheduling from within the<br>
kernel.

Page 5/21


---

<a id="page-6"></a>
**Page 6**

CS 162 Fall 2015 Midterm Exam I        October 14th, 2015


### **Problem 2e\[2pts\]:** List two reasons why overuse of threads is bad (i.e. using too many threads for

different tasks). Be explicit in your answers.


### **Problem 2f\[2pts\]:** What was the problem with the Therac-25? Your answer should involve one of

the topics of the class.


### **Problem 2g\[2pts\]:** Why is it possible for a web browser (such as Firefox) to have 2 different tabs

opened to the same website (at the same remote IP address and port) without mixing up content<br>
directed at each tab?


### **Problem 2h\[3pts\]:** What are some of the hardware differences between kernel mode and user

mode?  Name at least three.

Page 6/21


---

<a id="page-7"></a>
**Page 7**

CS 162 Fall 2015 Midterm Exam I        October 14th, 2015


### Problem 3: Boy-Girl Lock \[20pts\]

A boy-girl lock is a sort of generalized reader-writer lock: in a reader-writer lock there can be any<br>
number of readers or a single writer (but not both readers and writers at the same time), while in a<br>
boy-girl lock there can be any number of boys or any number of girls (but not both a boy and a girl<br>
at the same time).  Assume that we are going to implement this lock at user level utilizing pThread<br>
monitors (i.e pThread mutexes and condition variables). Note that the assumption here is that we<br>
will put threads to sleep when they attempt to acquire the lock as a Boy when it is already acquired<br>
by one or more Girls and vice-versa. You must implement the behavior using condition variable(s).<br>
Points will be deducted for any spin-waiting behavior.<br>
Some snippets from POSIX Thread manual pages showing function signatures are shown at end of<br>
this problem.  They may or may not be useful.<br>
Our first take at this lock is going to utilize the following structure and enumeration type:<br>
`/* The basic structure of a boy-girl lock */`<br>
`struct bglock {`<br>
`pthread_mutex_t lock;`<br>
`pthread_cond_t wait_var;`<br>
`// Simple state variable`<br>
`int state;`<br>
`};`<br>
`/* Enumeration to indicate type of requested lock */`<br>
`enum bglock_type {`<br>
`BGLOCK_BOY = 0;`<br>
`BGLOCK_GIRL = 1;`<br>
`};`<br>
`/* interface functions: return 0 on success, error code on failure */`<br>
`int bglock_init(struct bglock *lock);`<br>
`int bglock_lock(struct bglock *lock, enum bglock_type type);`<br>
`int bglock_unlock(struct bglock *lock);`

Note that the lock requestor specifies the type of lock that they want at the time that they make the<br>
request:<br>
`/* Request a Boy lock */`<br>
`if (bglock_lock(mylock, BGLOCK_BOY) {`<br>
`printf(“Lock request failed!”);`<br>
`exit(1);`<br>
`}`<br>
`/* . . . Code using lock . . . */`<br>
`/* Release your lock */`<br>
`bglock_unlock(mylock);`

Page 7/21


---

<a id="page-8"></a>
**Page 8**

CS 162 Fall 2015 Midterm Exam I        October 14th, 2015


### **Problem 3a\[3pts\]:** Complete the following sketch for the initialization function.  Note that

initialization should return zero on success and a non-zero error code on failure (e.g. return the<br>
failure code, if you encounter one, from the various synchronization functions). Hint: the state of<br>
the lock is more than just “acquired” or “free”.<br>
`/* Initialize the BG lock.`<br>
`*`<br>
`* Args: pointer to a bglock`<br>
`* Returns: 0 (success)`<br>
`*`         `non-zero (errno code from synchronization functions)`<br>
`*/`<br>
`int bglock_init(struct bglock *lock) {`

`}`


### **Problem 3b\[5pts\]:** Complete the following sketch for the lock function.  Think carefully about the

state of the lock; when you should wait, when you can grab the lock.<br>
`/* Grab a BG lock.`<br>
`*`<br>
`* Args: (pointer to a bglock, enum lock type)`<br>
`* Returns: 0 (lock acquired)`<br>
`*`         `non-zero (errno code from synchronization functions)`<br>
`*/`<br>
`int bglock_lock(struct bglock *lock, enum bglock_type type) {`

`}`

Page 8/21


---

<a id="page-9"></a>
**Page 9**

CS 162 Fall 2015 Midterm Exam I        October 14th, 2015


### **Problem 3c\[5pts\]:** Complete the following sketch for the unlock function.

`/* Release a BG lock.`<br>
`*`<br>
`* Args: pointer to a bglock`<br>
`* Returns: 0 (lock acquired)`<br>
`*`         `non-zero (errno code from synchronization functions)`<br>
`*/`<br>
`int bglock_unlock(struct bglock *lock) {`

`}`


### **Problem 3d\[2pts\]:** Consider a group of “nearly” simultaneous arrivals (i.e. they arrive in a period

much quicker than the time for any one thread that has successfully acquired the BGlock to get<br>
around    to    performing    `bglock_unlock()`).    Assume    that    they    enter    the<br>
`bglock_lock()`routine in this order:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;B1, B2, G1, G2, B3, G3, B4, B5, B6, B7<br>
How will they be grouped?  (Place braces, namely “{}” around requests that will hold the lock<br>
simultaneously).  This simple lock implementation (with a single state variable) is subject to<br>
starvation.  Explain.

Page 9/21


---

<a id="page-10"></a>
**Page 10**

CS 162 Fall 2015 Midterm Exam I        October 14th, 2015


### **Problem 3e\[5pts\]:** Suppose that we want to enforce fairness, such that Boy and Girl requests are

divided into phases based on arrival time into the `bglock_lock()` routine.  Thus, for instance,<br>
an arrival stream of Boys and Girls such as this:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;B1, B2, G1, G2, G3, G4, B3, G5, B4, B5<br>
will get granted in groups such as this:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;{B1, B2}, {G1, G2, G3, G4}, {B3}, {G5}, {B4, B5}<br>
Explain what the minimum changes are that you would need to make to the `bglock` structure to<br>
meet these requirements and sketch out what you would do during `bglock_init()` and<br>
`bglock_lock()` and `bglock_unlock()` routines.  You do not need to write actual code, but<br>
should be explicit about what your `bglock` structure would look like and how you would use its<br>
fields to accomplish the desired behavior.

Page 10/21


---

<a id="page-11"></a>
**Page 11**

CS 162 Fall 2015 Midterm Exam I        October 14th, 2015

&emsp;&emsp;Assorted POSIX Thread Manual Snippits for Problem 3

`PTHREAD_MUTEX_DESTROY(3P): initialization/destruction of mutexes`<br>
`int pthread_mutex_destroy(pthread_mutex_t *mutex);`<br>
`int pthread_mutex_init(pthread_mutex_t *restrict mutex,`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`const pthread_mutexattr_t *restrict attr);`<br>
`pthread_mutex_t mutex = PTHREAD_MUTEX_INITIALIZER;`

`PTHREAD_MUTEX_LOCK(3P): use of mutex`<br>
`int pthread_mutex_lock(pthread_mutex_t *mutex);`<br>
`int pthread_mutex_trylock(pthread_mutex_t *mutex);`<br>
`int pthread_mutex_unlock(pthread_mutex_t *mutex);`

`PTHREAD_COND_DESTROY(3P): initialization/destruction of condition variables`<br>
`int pthread_cond_destroy(pthread_cond_t *cond);`<br>
`int pthread_cond_init(pthread_cond_t *restrict cond,`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`const pthread_condattr_t *restrict attr);`<br>
`pthread_cond_t cond = PTHREAD_COND_INITIALIZER;`

`PTHREAD_COND_TIMEDWAIT(3P): sleeping on condition variables`<br>
`int pthread_cond_timedwait(pthread_cond_t *restrict cond,`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`pthread_mutex_t *restrict mutex,`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`const struct timespec *restrict abstime);`<br>
&emsp;&emsp;&emsp;`int pthread_cond_wait(pthread_cond_t *restrict cond,`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`pthread_mutex_t *restrict mutex);`

`PTHREAD_COND_BROADCAST(3P): signaling of threads waiting on condition variables`<br>
`int pthread_cond_broadcast(pthread_cond_t *cond);`<br>
`int pthread_cond_signal(pthread_cond_t *cond);`

Page 11/21


---

<a id="page-12"></a>
**Page 12**

CS 162 Fall 2015 Midterm Exam I        October 14th, 2015


### Problem 4: Scheduling and Deadlock \[24 pts\]


### **Problem 4a\[3pts\]:** What is priority inversion and why is it an important problem? Present a

priority inversion scenario in which a lower priority process can prevent a higher-priority process<br>
from running (assume that there is no priority donation mechanism):


### **Problem 4b\[3pts\]:** How does the Linux CFS (“Completely Fair Scheduler”) scheduler decide

which thread to run next?  What aspect of its behavior is “fair”?  (You can ignore the presence of<br>
priorities or “nice” values in your answer):


![Figure on page 12](figures/questions-p12-fig03.png)


### **Problem 4c\[2pts\]:** Consider the above PintOS test that exercises your priority scheduler.   Assume

that no priority donation has been implemented.  What does it output to the terminal?   Is the output<br>
affected by priorities in any way?  Explain.

Page 12/21


---

<a id="page-13"></a>
**Page 13**

CS 162 Fall 2015 Midterm Exam I        October 14th, 2015


### **Problem 4d\[5pts\]:** Next, assume that the code from (4c) is executed utilizing priority donation.

Fill in the following table to detail execution.  This table includes 7 columns as following:<br>
1\) The current executing thread<br>
2\) Which line this thread was executing when it yielded<br>
3\) To which thread it yielded<br>
4-7) The priorities of each thread (N/A if a thread is not created or has exited)


![Figure on page 13](figures/questions-p13-fig04.png)


### **Problem 4e\[2pts\]:**  What is printed according to the order of execution in (4d)?  Is the output

affected by priorities in any way?  Explain.

Page 13/21


---

<a id="page-14"></a>
**Page 14**

CS 162 Fall 2015 Midterm Exam I        October 14th, 2015


### **Problem 4f\[4pts\]:**

Suppose that we have the following resources: A, B, C and threads T1, T2, T3, T4.  The total<br>
number of each resource is:


![Figure on page 14](figures/questions-p14-fig05.png)

Further, assume that the processes have the following maximum requirements and current<br>
allocations:


![Figure on page 14](figures/questions-p14-fig06.png)

Is the system in a safe state? If “yes”, show a non-blocking sequence of thread executions.<br>
Otherwise, provide a proof that the system is unsafe. Show your work and justify each step of your<br>
answer.

Page 14/21


---

<a id="page-15"></a>
**Page 15**

CS 162 Fall 2015 Midterm Exam I        October 14th, 2015


### **Problem 4g\[3pts\]:**

Assume that we start with a system in the state of (4f). Suppose that T1 asks for 2 more copies of<br>
resource A.  Can the system grant this if it wants to avoid deadlock? Explain.


### **Problem 4h\[2pts\]:** Assume that a set of threads (T1, T2, … Tn) contend for a set of non-

preemptable resources (R1, R2, … Rm) that may or may not be unique. Name at least two techniques<br>
to prevent this system from deadlocking:

Page 15/21


---

<a id="page-16"></a>
**Page 16**

CS 162 Fall 2015 Midterm Exam I        October 14th, 2015

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[ This page intentionally left blank \]

Page 16/21


---

<a id="page-17"></a>
**Page 17**

CS 162 Fall 2015 Midterm Exam I        October 14th, 2015


### Problem 5: Address Translation \[20 pts\]


### **Problem 5a\[3pts\]:** In class, we discussed the “magic” address format for a multi-level page table

on a 32-bit machine, namely one that divided the address as follows:


![Figure on page 17](figures/questions-p17-fig07.png)

You can assume that Page Table Entries (PTEs) are 32-bits in size in the following format:


![Figure on page 17](figures/questions-p17-fig08.png)

What is particularly “magic” about this configuration?  Make sure that your answer involves the<br>
size of the page table and explains why this configuration is helpful for an operating system<br>
attempting to deal with limited physical memory.


### **Problem 5b\[2pts\]:** Modern processors nominally address 64-bits of address space both virtually

and physically (in reality they provide access to less, but ignore that for now).  Explain why the<br>
page table entries (PTEs) given in (5a) would have to be expanded from 4 bytes and justify how big<br>
they would it need to be.  Assume that pages are the same size and that the new PTE has similar<br>
control bits to the version given in (5a).


### **Problem 5c\[2pts\]:** Assuming that we reserve 8-bytes for each PTE in the page table (whether or

not they need all 8 bytes), how would the virtual address be divided for a 64-bit address space?<br>
Make sure that your resulting scheme has a similar “magic” property as in (5a) and that all levels of<br>
the page table are the same size—with the exception of the top-level. How many levels of page<br>
table would this imply?  Explain your answer!

Page 17/21


---

<a id="page-18"></a>
**Page 18**

CS 162 Fall 2015 Midterm Exam I        October 14th, 2015


### **Problem 5d\[3pts\]:** Consider a multi-level memory management scheme using the following format

for virtual addresses, including 2 bits worth of segment ID and an 8-bit virtual page number:


![Figure on page 18](figures/questions-p18-fig09.png)

Virtual addresses are translated into 16-bit physical addresses of the following form:


![Figure on page 18](figures/questions-p18-fig10.png)

Page table entries (PTE) are 16 bits in the following format, stored in big-endian form in memory<br>
(i.e. the MSB is first byte in memory):


![Figure on page 18](figures/questions-p18-fig11.png)

1\) How big is a page? Explain.

2\) What is the maximum amount of physical memory supported by this scheme? Explain


### **Problem 5e\[10pts\]:** Using the scheme from (5d) and the Segment Table and Physical Memory

table on the next page, state what will happen with the following loads and stores. Addresses below<br>
are virtual, while base addresses in the segment table are physical. If you can translate the address,<br>
make sure to place it in the “Physical Address” column; otherwise state “**N/A**”.<br>
&emsp;The return value for a load is an 8-bit data value or an error, while the return value for a store is<br>
either “**ok**” or an error. If there is an error, say which error. Possibilities are: “**bad segment**”<br>
(invalid segment), “**segment overflow**” (address outside segment), or “**access violation**” (page<br>
invalid/attempt to write a read only page).  A few answers are given:


![Figure on page 18](figures/questions-p18-fig12.png)

Page 18/21


---

<a id="page-19"></a>
**Page 19**

&emsp;CS 162 Fall 2015 Midterm Exam I        October 14th, 2015

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Segment Table (Segment limit = 3)**


![Figure on page 19](figures/questions-p19-fig13.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Physical Memory**


![Figure on page 19](figures/questions-p19-fig14.png)

&emsp;Page 19/21


---

<a id="page-20"></a>
**Page 20**

CS 162 Fall 2015 Midterm Exam I        October 14th, 2015

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[ This page intentionally left blank \]

Page 20/21


---

<a id="page-21"></a>
**Page 21**

CS 162 Fall 2015 Midterm Exam I        October 14th, 2015

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[ This page left for scratch \]

Page 21/21

