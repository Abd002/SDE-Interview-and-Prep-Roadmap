# Berkeley CS162 Fall 2015: Midterm 1: Official solutions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;University of California, Berkeley<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;College of Engineering<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Computer Science Division  EECS<br>
&emsp;Fall 2015                John Kubiatowicz<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Midterm I<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;SOLUTIONS<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;October 14th, 2015<br>
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

sending a SIGINT signal to the program, which makes it quit.


![Figure on page 3](figures/solutions-p03-fig03.png)

&emsp;&emsp;True / False<br>
&emsp;&emsp;Explain: SIGINT is a vehicle for conveying a Ctrl-C requests from the terminal to<br>
&emsp;&emsp;the program.  Assuming that the SIGINT handler has not be redirected, this will cause the<br>
&emsp;&emsp;program to quit. Note: we would also take “False” if you explain that the SIGINT handler<br>
&emsp;&emsp;might have been redirected.


### **Problem 1b\[2pts\]:** The function `pthread_intr_disable()` is a crude but viable way for

user programs to implement an atomic section.


![Figure on page 3](figures/solutions-p03-fig04.png)

&emsp;&emsp;Explain: This function does not exist. However, you cannot disable interrupt at<br>
&emsp;&emsp;user level in any case.  A similarly-named routine (`pthread_setintr()`) simply<br>
&emsp;&emsp;disables the delivery of signals; it does not prevent multiple threads from executing<br>
&emsp;&emsp;concurrently—thus it could not be used to implement a critical section.


### **Problem 1c\[2pts\]:** If the banker's algorithm finds that it's safe to allocate a resource to an existing

thread, then all threads will eventually complete.


![Figure on page 3](figures/solutions-p03-fig05.png)

&emsp;&emsp;Explain: When the banker's algorithm finds that it's safe to allocate a resource, this<br>
&emsp;&emsp;simply means that threads could complete from a resource allocation standpoint. However,<br>
&emsp;&emsp;threads could still go into an infinite loop or otherwise fail to complete.


### **Problem 1d\[2pts\]:** The lottery scheduler can be utilized to implement strict priority scheduling.


![Figure on page 3](figures/solutions-p03-fig06.png)

&emsp;&emsp;Explain: Strict priority scheduling would require the ability to have high-priority<br>
&emsp;&emsp;threads that receive all CPU time – at the expense of lower priority threads.  The lottery<br>
&emsp;&emsp;scheduler will give some CPU time to every thread (except those which have zero tokens).


### **Problem 1e\[2pts\]:** Locks can be implemented using semaphores.


![Figure on page 3](figures/solutions-p03-fig07.png)

&emsp;&emsp;True / False<br>
Explain: Initializing a semaphore with the value “1” will cause it to behave like a<br>
lock.  Semi.P()  acquire() and Semi.V()  release().

Page 3/21


---

<a id="page-4"></a>
**Page 4**

CS 162 Fall 2015 Midterm Exam I        October 14th, 2015


### **Problem 1f\[2pts\]:** Two processes can share information by reading and writing from a shared

linked list.


![Figure on page 4](figures/solutions-p04-fig08.png)

&emsp;&emsp;True / False<br>
&emsp;&emsp;Explain: If a shared page is mapped into the same place in the address space of<br>
&emsp;&emsp;two processes, then they can share data structures that utilize pointers as long as they are<br>
&emsp;&emsp;stored in the shared page and pointers are to structures in the shared page.


### **Problem 1g\[2pts\]:** In Pintos, a kernel-level stack can grow as large as it needs to be to perform its

functions.


![Figure on page 4](figures/solutions-p04-fig09.png)

&emsp;&emsp;Explain: Stacks in the Pintos kernel must fit entirely into a 4K page.  In fact, they<br>
&emsp;&emsp;share  the 4K page with the corresponding Thread Control Block (TCB).


### **Problem 1h\[2pts\]:** Suppose that a shell program wants to execute another program and wait on its

result.  It does this by creating a thread, calling exec from within that thread, then waiting in the<br>
original thread.


![Figure on page 4](figures/solutions-p04-fig10.png)

&emsp;&emsp;Explain: The shell program must create a new process (not thread!) before calling<br>
&emsp;&emsp;exec() otherwise, the exec() call will terminate the existing process and start a new process<br>
&emsp;&emsp;– effectively terminating the shell.


### **Problem 1i\[2pts\]:** A network server in Linux works by calling `bind()` on a socket, and then

calling `listen()` on the socket in a loop to wait for new clients.


![Figure on page 4](figures/solutions-p04-fig11.png)

&emsp;&emsp;Explain: The server calls listen() only once, then accept() multiple times in a loop.

Page 4/21


---

<a id="page-5"></a>
**Page 5**

CS 162 Fall 2015 Midterm Exam I        October 14th, 2015


### Problem 2: Short Answer \[18pts\]


### **Problem 2a\[2pts\]:** How does a modern OS regain control of the CPU from a program stuck in an

infinite loop?<br>
&emsp;&emsp;Assuming that we are talking about a user-level program (or a kernel thread with interrupts<br>
&emsp;&emsp;enabled), the timer interrupt handler (triggered by the timer) will enter the scheduler and<br>
&emsp;&emsp;recover the CPU from a program that is stuck in an infinite loop.


### **Problem 2b\[2pts\]:** Is it possible for an interrupt handler (code triggered by a hardware interrupt) to

sleep while waiting for another event?  If so, explain how.  If not, explain why not.<br>
&emsp;&emsp;There are actually two possible answers to this question.  (1) “NO”: Strictly speaking, an<br>
&emsp;&emsp;interrupt handler must not sleep while waiting for another event, since it doesn’t have a<br>
&emsp;&emsp;thread-control block (context) to put onto a wait queue and is operating with interrupts<br>
&emsp;&emsp;disabled.  However, one could also answer (2) “YES”: an interrupt handler that wants to<br>
&emsp;&emsp;sleep must allocate a new kernel thread to finish its work, place the thread on a wait queue,<br>
&emsp;&emsp;then return from the interrupt (reenabling interrupts in the process).


### **Problem 2c\[2pts\]:** Why is it important for system calls to be vectored through the syscall table

(indexed by an integer syscall number) rather than allowing the user to specify a function address to<br>
be called by the kernel after it transitions to kernel mode?<br>
&emsp;&emsp;If the user were able to specify an arbitrary address for execution in the kernel, then they<br>
&emsp;&emsp;could bypass checking and find many ways to violate protection.  Consequently, the user<br>
&emsp;&emsp;must specify a syscall number during the execution of a system call.  The hardware then<br>
&emsp;&emsp;atomically raises the hardware level to “kernel level” while executing the system call from<br>
&emsp;&emsp;the specified entry point.


### **Problem 2d\[3pts\]:** Name two advantages and one disadvantage of implementing a threading

package at user level (e.g. “green threads”) rather than relying on thread scheduling from within the<br>
kernel.<br>
&emsp;&emsp;Advantages include: very fast context switch (all at user level, no system call), very low<br>
&emsp;&emsp;overhead thread fork, and user-configurable scheduling. One very important disadvantage<br>
&emsp;&emsp;is the fact that all threads will get put to sleep when any one thread enters into the kernel<br>
&emsp;&emsp;and blocks on I/O.

Page 5/21


---

<a id="page-6"></a>
**Page 6**

CS 162 Fall 2015 Midterm Exam I        October 14th, 2015


### **Problem 2e\[2pts\]:** List two reasons why overuse of threads is bad (i.e. using too many threads for

different tasks). Be explicit in your answers.<br>
&emsp;&emsp;There a number of possible answers (1) Too many threads scheduled simultaneously can<br>
&emsp;&emsp;lead to excessive context switch overhead. (2) Too many threads can lead to memory<br>
&emsp;&emsp;overutilization.  (3) Too many threads can cause excessive synchronization overhead (many<br>
&emsp;&emsp;locks to handle all the parallelism).


### **Problem 2f\[2pts\]:** What was the problem with the Therac-25? Your answer should involve one of

the topics of the class.<br>
&emsp;&emsp;The Therac-25 had a number of synchronization problems, including improper<br>
&emsp;&emsp;synchronization between the operator console and the turntable mechanism which caused<br>
&emsp;&emsp;patients to receive the wrong type and dosage of radiation


### **Problem 2g\[2pts\]:** Why is it possible for a web browser (such as Firefox) to have 2 different tabs

opened to the same website (at the same remote IP address and port) without mixing up content<br>
directed at each tab?<br>
&emsp;&emsp;Because a unique TCP/IP connection consists of a 5-tuple, namely \[source IP, source Port,<br>
&emsp;&emsp;destination IP, destination Port, and protocol\] (where the protocol is “6” for TCP/IP –<br>
&emsp;&emsp;which you didn’t need to know). Consequently, although the web browser might have many<br>
&emsp;&emsp;connections with the same source IP address, destination IP address and destination Port,<br>
&emsp;&emsp;they will all have unique source ports, allowing them to be unique.


### **Problem 2h\[3pts\]:** What are some of the hardware differences between kernel mode and user

mode?  Name at least three.<br>
&emsp;&emsp;There are a number of differences: (1) There is at least one status bit (the “kernel mode<br>
&emsp;&emsp;bit”) which changes between kernel mode and user mode.  In an x86 processor, there are 2<br>
&emsp;&emsp;bits which change (since there a 4 modes). (2) Additional kernel-mode instructions are<br>
&emsp;&emsp;available (such as those that modify the page table registers, those that enable and disable<br>
&emsp;&emsp;interrupts, etc). (3) Pages marked as kernel-mode in their PTEs are only available in kernel<br>
&emsp;&emsp;mode. (4) Control for I/O devices (such as the timer, interrupt controllers, and device<br>
&emsp;&emsp;controllers) are typically only available from kernel mode.

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
`int bglock_init(struct bglock *lock) {`<br>
`int result;`<br>
`lock->state = 0; // No lock holders of any type`<br>
`if (result = pthread_mutex_init(&(lock->lock), NULL))`<br>
`return result;  // Error`<br>
`result = pthread_cond_init(&(lock->wait_var), NULL);`<br>
`return result;`<br>
`}`


### **Problem 3b\[5pts\]:** Complete the following sketch for the lock function.  Think carefully about the

state of the lock; when you should wait, when you can grab the lock.<br>
`/* Grab a BG lock.`<br>
`*`<br>
`* Args: (pointer to a bglock, enum lock type)`<br>
`* Returns: 0 (lock acquired)`<br>
`*`         `non-zero (errno code from synchronization functions)`<br>
`*/`<br>
`int bglock_lock(struct bglock *lock, enum bglock_type type) {`<br>
`int dir = (type == BGLOCK_BOY)?1:-1;  // Direction`<br>
`int result;`<br>
`// Grab monitor lock`<br>
`if (result = pthread_mutex_lock(&(lock->lock)))`<br>
`return result; // error`<br>
`while (lock->state * dir < 0) {`<br>
`// Incompatible threads already have bglock, must sleep`<br>
`if (result=pthread_cond_wait(&(lock->wait_var),&(lock->lock)))`<br>
`return result; // error`<br>
`}`<br>
`lock->state += dir;  // register new bglock holder of this type`<br>
`// Release monitor lock`<br>
`result = pthread_mutex_unlock(&(lock->lock));`<br>
`return result;`<br>
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
`int bglock_unlock(struct bglock *lock) {`<br>
`int result;`<br>
`// Grab monitor lock`<br>
`if (result = pthread_mutex_lock(&(lock->lock)))`<br>
`return result; // error`<br>
`// one less bglock holder of this type`<br>
`lock->state -= (lock->state > 0)?1:-1;  // Direction`<br>
`// If returning to neutral status, signal any waiters`<br>
`if (lock->state == 0)`<br>
`if (result = pthread_cond_broadcast(&(lock->wait_var)))`<br>
`return result; // error`<br>
`// Release monitor lock`<br>
`result = pthread_mutex_unlock(&(lock->lock));`<br>
`return result;`<br>
`}`


### **Problem 3d\[2pts\]:** Consider a group of “nearly” simultaneous arrivals (i.e. they arrive in a period

much quicker than the time for any one thread that has successfully acquired the BGlock to get<br>
around    to    performing    `bglock_unlock()`).    Assume    that    they    enter    the<br>
`bglock_lock()`routine in this order:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;B1, B2, G1, G2, B3, G3, B4, B5, B6, B7<br>
How will they be grouped?  (Place braces, namely “{}” around requests that will hold the lock<br>
simultaneously).  This simple lock implementation (with a single state variable) is subject to<br>
starvation.  Explain.<br>
&emsp;&emsp;All of the boy requests will go first, followed by girl requests:<br>
&emsp;&emsp;{ B1, B2, B3, B4, B5, B6, B7 },  { G1, G2, G3 }<br>
&emsp;&emsp;This implementation experiences starvation because a series of waiting girl lock requests<br>
&emsp;&emsp;could be arbitrarily held off if there is a stream of boy requests (and vice-versa).

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
fields to accomplish the desired behavior.<br>
&emsp;&emsp;Here, we number phases starting from zero (with wraparound). We expand our state<br>
&emsp;&emsp;variable to queue of state variables.  Each incoming thread figures out which phase they are<br>
&emsp;&emsp;in and then optionally sleeps (if they are not in the current phase).  Our new bglock looks<br>
&emsp;&emsp;like this:<br>
&emsp;&emsp;&emsp;`struct bglock {`<br>
&emsp;&emsp;&emsp;`pthread_mutex_t lock;`<br>
`pthread_cond_t wait_var;`<br>
&emsp;&emsp;&emsp;`int headphase, tailphase;`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`int state[MAX_PHASES+1];`<br>
&emsp;&emsp;&emsp;`};`<br>
&emsp;&emsp;bglock\_init(): initialize lock and wait\_var; headphase=0; tailphase=0; state\[x\]=0 for all x;<br>
&emsp;&emsp;bglock\_lock(): if state\[tailphase\] doesn’t match request, increment tailphase (with wrapping<br>
&emsp;&emsp;– may have to sleep if already have MAX\_PHASES phases). In whatever case, increment<br>
&emsp;&emsp;state\[tailphase\] in correct direction (+1 or -1) depending on desired type of lock.  Save<br>
&emsp;&emsp;current tailphase as your phase. Then, wait on condition variable until headphase ==<br>
&emsp;&emsp;current tailphase.<br>
&emsp;&emsp;bglock\_unlock(): Decrement state\[headphase\] in correct direction (-1 or +1) depending on<br>
&emsp;&emsp;desired type of lock. If state\[headphase\]==0, check to see if headphase!=tailphase.  If so,<br>
&emsp;&emsp;headphase++, broadcast to wake up everyone on condition variable.<br>
&emsp;&emsp;Note that you can optimize wakeup behavior by adding a queue of condition variables as<br>
&emsp;&emsp;well, although this will increase the amount of state in the bglock.

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
from running (assume that there is no priority donation mechanism):<br>
&emsp;Priority inversion is a situation in which a lower-priority task is allowed to run over a higher-<br>
&emsp;priority task. Consider three tasks in priority order: T1, T2, and T3 (i.e. T1 is lowest, T3 is<br>
&emsp;highest).  Suppose that T1 grabs a lock, T2 starts running, then T3 tries to grab the lock (and<br>
&emsp;sleeps).  Here, T2 is effectively preventing T3 from running (since T2 is preventing T1 from<br>
&emsp;running, which is preventing T3 from running).  The result is priority inversion.


### **Problem 4b\[3pts\]:** How does the Linux CFS (“Completely Fair Scheduler”) scheduler decide

which thread to run next?  What aspect of its behavior is “fair”?  (You can ignore the presence of<br>
priorities or “nice” values in your answer):<br>
&emsp;The Linux CFS scheduler computes something called “virtual time” which is a scaled version of<br>
&emsp;real CPU time.  The scheduler attempts to make sure that every thread has an equal amount of<br>
&emsp;virtual time.  Thus, to decide which thread to run next, it simply picks the thread with the least<br>
&emsp;amount of accumulated virtual time. This behavior is considered “fair” because it attempts to<br>
&emsp;distribute the same total virtual time to every thread.


![Figure on page 12](figures/solutions-p12-fig12.png)


### **Problem 4c\[2pts\]:** Consider the above PintOS test that exercises your priority scheduler.   Assume

that no priority donation has been implemented.  What does it output to the terminal?   Is the output<br>
affected by priorities in any way?  Explain.<br>
&emsp;This code will output “162cab!”. This result is not affected by priorities (as long as all threads<br>
&emsp;running “func()” are higher priority than “main()”, since high-priority threads go to sleep<br>
&emsp;almost immediately after they start and are released in order by lines #15, #16, and !37.

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


![Figure on page 13](figures/solutions-p13-fig13.png)


### **Problem 4e\[2pts\]:**  What is printed according to the order of execution in (4d)?  Is the output

affected by priorities in any way?  Explain.<br>
&emsp;What is printed is: “162cba!”.  Yes, the output is affected by priorities in that thread “b” gets<br>
&emsp;to acquire lock “b” before thread “a” acquires lock “a”. The ordering of letters happens in<br>
&emsp;priority order.

Page 13/21


---

<a id="page-14"></a>
**Page 14**

CS 162 Fall 2015 Midterm Exam I        October 14th, 2015


### **Problem 4f\[4pts\]:**

Suppose that we have the following resources: A, B, C and threads T1, T2, T3, T4.  The total<br>
number of each resource is:


![Figure on page 14](figures/solutions-p14-fig14.png)

Further, assume that the processes have the following maximum requirements and current<br>
allocations:


![Figure on page 14](figures/solutions-p14-fig15.png)

Is the system in a safe state? If “yes”, show a non-blocking sequence of thread executions.<br>
Otherwise, provide a proof that the system is unsafe. Show your work and justify each step of your<br>
answer.<br>
&emsp;Answer: Yes, this system is in a safe state.


![Figure on page 14](figures/solutions-p14-fig16.png)

&emsp;To prove this, we first compute the currently free allocations:

&emsp;Further, we compute the number needed by each thread (Maximum – Current Allocation):


![Figure on page 14](figures/solutions-p14-fig17.png)

&emsp;Thus, we can see that a possible sequence is: T3, T2, T4, T1:


![Figure on page 14](figures/solutions-p14-fig18.png)

Page 14/21


---

<a id="page-15"></a>
**Page 15**

CS 162 Fall 2015 Midterm Exam I        October 14th, 2015


### **Problem 4g\[3pts\]:**

Assume that we start with a system in the state of (4f). Suppose that T1 asks for 2 more copies of<br>
resource A.  Can the system grant this if it wants to avoid deadlock? Explain.<br>
&emsp;No.  This cannot be granted.  Assume that T1 gets 2 more of A.<br>
&emsp;Then, our available allocation is:


![Figure on page 15](figures/solutions-p15-fig19.png)

&emsp;Then, looking at our needed allocations, we see:


![Figure on page 15](figures/solutions-p15-fig20.png)

&emsp;At this point, the available allocation is insufficient to start any of the threads, much less find a<br>
&emsp;safe sequence that finishes all of them.


### **Problem 4h\[2pts\]:** Assume that a set of threads (T1, T2, … Tn) contend for a set of non-

preemptable resources (R1, R2, … Rm) that may or may not be unique. Name at least two techniques<br>
to prevent this system from deadlocking:<br>
&emsp;We discussed several possible ways of preventing deadlock in class.  Possibilities include:<br>
&emsp;&emsp;1\) Pick a fixed order of allocation (say R1 then R2 then  … Rm). All threads should allocate<br>
&emsp;&emsp;&emsp;resources in this order.<br>
&emsp;&emsp;2\) Every thread should indicate which resources they want at the beginning of execution.<br>
&emsp;&emsp;&emsp;Then, the thread is not allowed to start until after the requested resources are all<br>
&emsp;&emsp;&emsp;available.<br>
&emsp;&emsp;3\) Use the Bankers algorithm on every allocation request to make sure that the system<br>
&emsp;&emsp;&emsp;stays in a safe state.

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


![Figure on page 17](figures/solutions-p17-fig21.png)

You can assume that Page Table Entries (PTEs) are 32-bits in size in the following format:


![Figure on page 17](figures/solutions-p17-fig22.png)

What is particularly “magic” about this configuration?  Make sure that your answer involves the<br>
size of the page table and explains why this configuration is helpful for an operating system<br>
attempting to deal with limited physical memory.<br>
&emsp;Each page is 4K in size (12-bit offset  212 bytes). Because the PTE is 4-bytes long and each<br>
&emsp;level of the page table has 1024 entries (i.e. 10-bit virtual page #), this means that each level of<br>
&emsp;the page table is 4K in size, i.e. exactly the same size as a page.  Thus the configuration is<br>
&emsp;“magic” because every level of the page table takes exactly one page.  This is helpful for an<br>
&emsp;operating system because it allows the OS to page out parts of the page table to disk.


### **Problem 5b\[2pts\]:** Modern processors nominally address 64-bits of address space both virtually

and physically (in reality they provide access to less, but ignore that for now).  Explain why the<br>
page table entries (PTEs) given in (5a) would have to be expanded from 4 bytes and justify how big<br>
they would it need to be.  Assume that pages are the same size and that the new PTE has similar<br>
control bits to the version given in (5a).<br>
&emsp;Since we are attempting to address 64-bits of physical DRAM and the page offset is 12-bits, this<br>
&emsp;leaves 52-bits of physical page # that will have to fit into the PTE.  The old PTE had only 20-<br>
&emsp;bits of space for  physical page #.  In fact, we need another 32-bits of offsetPTE needs 52-bits<br>
&emsp;of offset+12-bits of control bits (to be the same), yielding 64-bits of PTE, or 8-bytes.


### **Problem 5c\[2pts\]:** Assuming that we reserve 8-bytes for each PTE in the page table (whether or

not they need all 8 bytes), how would the virtual address be divided for a 64-bit address space?<br>
Make sure that your resulting scheme has a similar “magic” property as in (5a) and that all levels of<br>
the page table are the same size—with the exception of the top-level. How many levels of page<br>
table would this imply?  Explain your answer!<br>
&emsp;To have the same “magic” property, we would like each level of the page table to be the same<br>
&emsp;size as a page – so that the OS could page out individual parts of the page table.  Since a PTE is<br>
&emsp;8-bytes (3-bits in size), this means we need 12-3 = 9-bits of virtual page # at each level.  This<br>
&emsp;means that the virtual address needs to be divided into groupings of 9-bits (although the top<br>
&emsp;level be smaller, since we only have 64-bits):<br>
&emsp;\[7-bits\]\[9-bits\]\[9-bits\]\[9-bits\]\[9-bits\]\[9-bits\]\[12-bits offset\]<br>
&emsp;Thus, there are 6 levels of page table.

Page 17/21


---

<a id="page-18"></a>
**Page 18**

CS 162 Fall 2015 Midterm Exam I        October 14th, 2015


### **Problem 5d\[3pts\]:** Consider a multi-level memory management scheme using the following format

for virtual addresses, including 2 bits worth of segment ID and an 8-bit virtual page number:


![Figure on page 18](figures/solutions-p18-fig23.png)

Virtual addresses are translated into 16-bit physical addresses of the following form:


![Figure on page 18](figures/solutions-p18-fig24.png)

Page table entries (PTE) are 16 bits in the following format, stored in big-endian form in memory<br>
(i.e. the MSB is first byte in memory):


![Figure on page 18](figures/solutions-p18-fig25.png)

&emsp;2\) How big is a page? Explain.<br>
&emsp;A page is 28=256 bytes.<br>
2\) What is the maximum amount of physical memory supported by this scheme? Explain<br>
&emsp;Physical addresses have 16-bits  216=65536 bytes (i.e. 64K bytes)


### **Problem 5e\[10pts\]:** Using the scheme from (5d) and the Segment Table and Physical Memory

table on the next page, state what will happen with the following loads and stores. Addresses below<br>
are virtual, while base addresses in the segment table are physical. If you can translate the address,<br>
make sure to place it in the “Physical Address” column; otherwise state “**N/A**”.<br>
&emsp;The return value for a load is an 8-bit data value or an error, while the return value for a store is<br>
either “**ok**” or an error. If there is an error, say which error. Possibilities are: “**bad segment**”<br>
(invalid segment), “**segment overflow**” (address outside segment), or “**access violation**” (page<br>
invalid/attempt to write a read only page).  A few answers are given:


![Figure on page 18](figures/solutions-p18-fig26.png)

Page 18/21


---

<a id="page-19"></a>
**Page 19**

&emsp;CS 162 Fall 2015 Midterm Exam I        October 14th, 2015

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Segment Table (Segment limit = 3)**


![Figure on page 19](figures/solutions-p19-fig27.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Physical Memory**


![Figure on page 19](figures/solutions-p19-fig28.png)

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

