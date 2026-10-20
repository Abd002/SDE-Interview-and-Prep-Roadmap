# Berkeley CS162 Fall 2017: Midterm 1: Official solutions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

CS 162 Fall 2017, 1st Exam         September 28, 2017

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;University of California, Berkeley<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;College of Engineering<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Computer Science Division – EECS<br>
Fall 2017                                Ion Stoica<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**First Midterm Exam**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;September 28, 2017<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS162 Operating Systems


![Figure on page 1](figures/solutions-p01-fig01.png)

General Information:<br>
This is a **closed book and one 2-sided handwritten note** examination. You have 80 minutes to<br>
answer as many questions as possible.  The number in parentheses at the beginning of each<br>
question indicates the number of points for that question. You should read **all** of the questions<br>
before starting the exam, as some of the questions are substantially more time consuming.<br>
Write all of your answers directly on this paper.  **Make your answers as concise as possible.** If there<br>
is something in a question that you believe is open to interpretation, then please ask us about it!<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Good Luck!!**


![Figure on page 1](figures/solutions-p01-fig02.png)

Page 1/12


---

<a id="page-2"></a>
**Page 2**

CS 162 Fall 2017, 1st Exam         September 28, 2017

**P1** (22 points total) True/False and Why? **CIRCLE YOUR ANSWER**. For each<br>
question: 1 point for true/false correct, 1 point for explanation. An explanation cannot<br>
exceed 2 sentences.<br>
&emsp;a) The order in which you declare the members of struct thread in Pintos<br>
&emsp;&emsp;matters.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?<br>
The “magic” member has to be at the bottom of the struct (top memory-wise) in order to<br>
function properly as an anti-corruption measure.

&emsp;b) If one thread closes a file descriptor, then it will be closed for all threads in the<br>
&emsp;&emsp;system, regardless of the process they are belonging to.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?<br>
It will be closed for only the threads in the same process. This will not affect threads in<br>
another process.

&emsp;c) The only way a thread can modify another thread’s stack variable is if the thread<br>
&emsp;&emsp;is passed the address of that variable as an argument during creation.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?<br>
Threads in the same address space can access any memory address (example: a global<br>
pointer to a local stack variable)

Page 2/12


---

<a id="page-3"></a>
**Page 3**

CS 162 Fall 2017, 1st Exam         September 28, 2017

&emsp;d) A binary semaphore (i.e., a semaphore which can only take values 0 and 1; if the<br>
&emsp;&emsp;semaphore is 1 and you increment it, its value remains 1) is semantically<br>
&emsp;&emsp;equivalent to a lock.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?<br>
Initialize semaphore to 1. Then P() is equivalent to acquire() and V() with release().

&emsp;e) When you call fputs(string, outfile), the content of “string” is immediately<br>
&emsp;&emsp;written to “outfile” on disk.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?<br>
You need to call fflush() or close() to make sure “string” is written to “outfile” on disk.

&emsp;f) The function pthread\_yield() will always ensure that another thread gets to run.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?<br>
pthread\_yield() puts the calling thread on the ready queue. The scheduler picks the next<br>
thread to run from the ready queue and hence could pick the same thread to run again<br>
(e.g., if there are no other ready threads)

&emsp;g) Hardware interrupts can be used to implement locks.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?<br>
acquire() can be implemented by “disable interrupts” and release() by “enable interrupts”.<br>
We also gave full points to the following two answers:

Page 3/12


---

<a id="page-4"></a>
**Page 4**

CS 162 Fall 2017, 1st Exam         September 28, 2017

&emsp;• FALSE: In user mode you cannot disable/enable interrupts.<br>
&emsp;• FALSE: disable interrupts cannot be used for multi-processors. Note that this is<br>
&emsp;&emsp;not entirely correct (it’s just more expensive), but we gave benefit of doubt here.

&emsp;h) When a thread is performing an I/O operation, such as read(), the thread is busy-<br>
&emsp;&emsp;waiting until the operation completes.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?<br>
When waiting for an I/O operation to complete, the kernel puts the thread on the wait<br>
queue. Upen I/O completion, the kernel moves the thread on the ready queue.

&emsp;i) When a hardware interrupt occurs, the kernel enqueues the interrupt and serves it<br>
&emsp;&emsp;when the current running thread completes.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?<br>
On an interrupt the current running thread is switched out and the interrupt serviced.

&emsp;j) With a monitor, the program can call wait() in the critical section on a condition<br>
&emsp;&emsp;variable associated to that monitor.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?<br>
When calling wait, the thread is put on the wait queue and the lock is released.

&emsp;k) Context switching between two threads belonging to the same process is less<br>
&emsp;&emsp;expensive than context switching between two threads belonging to two different<br>
&emsp;&emsp;processes.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?<br>
In the later case, the kernel also needs to context switch the process address space state<br>
(i.e., translation), and the context switch will also result in more cache misses.

Page 4/12


---

<a id="page-5"></a>
**Page 5**

CS 162 Fall 2017, 1st Exam         September 28, 2017

**P2** (22 points) **Re: Zero – Starting Life in Another Process:** Consider the following C<br>
program. Assume that all system calls succeed when possible.


![Figure on page 5](figures/solutions-p05-fig03.png)

&emsp;a) (4 points) Including the original process, how many processes are created?<br>
&emsp;&emsp;Including the original thread, how many threads are created?<br>
3 Processes and 6 Threads

Page 5/12


---

<a id="page-6"></a>
**Page 6**

CS 162 Fall 2017, 1st Exam         September 28, 2017

&emsp;b) (6 points) Provide all possible outputs in standard output. If there are multiple<br>
&emsp;&emsp;possibilities, put each in its own box. You may not need all the boxes.


![Figure on page 6](figures/solutions-p06-fig04.png)

&emsp;c) (4 points) Provide all possible contents of emilia.txt. If there are multiple<br>
&emsp;&emsp;possibilities, put each in its own box. You may not need all the boxes.


![Figure on page 6](figures/solutions-p06-fig05.png)

&emsp;d) (4 points) Suppose we deleted line 28, how would the contents of emilia.txt<br>
&emsp;&emsp;change (if they do)?<br>
&emsp;All done!<br>
&emsp;All done!

&emsp;e) (4 points) What if, in addition to doing the change in part (d), we also move line<br>
&emsp;&emsp;12 (where we open the file descriptor) between lines 19 and 20? What would<br>
&emsp;&emsp;emilia.txt look like then?<br>
&emsp;All done! –or–  a blank file

Page 6/12


---

<a id="page-7"></a>
**Page 7**

CS 162 Fall 2017, 1st Exam         September 28, 2017

**P3** (20 points) **Synch Art Online – Ordinal Scale:**<br>
&emsp;a) (8 points) \[Spinlock using swap\] In lectures, you learnt how to implement locks<br>
&emsp;&emsp;using test & set. Your task here is to implement locks using the swap primitive.<br>
&emsp;&emsp;To recapitulate, swap has the following semantics, and is executed atomically:

void swap(int \*a, int \*b) {<br>
&emsp;&emsp;int temp = \*a;<br>
&emsp;&emsp;\*a = \*b;<br>
&emsp;&emsp;\*b = temp;<br>
}<br>
You have to implement Initialize, Acquire and Release for the lock operations. It is OK to<br>
busy wait.

void Initialize(int\* lock) {<br>
&emsp;&emsp;\*lock = 0;<br>
}

void Acquire(int\* lock) {<br>
&emsp;&emsp;int l = 1;<br>
&emsp;&emsp;do {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;swap(&l, lock);<br>
&emsp;&emsp;} while (l == 1);<br>
&emsp;&emsp;// Or<br>
&emsp;&emsp;// while(l == 1) {<br>
&emsp;&emsp;//      swap(&l, lock);<br>
&emsp;&emsp;// }<br>
}

void Release(int\* lock) {<br>
&emsp;&emsp;\*lock = 0;<br>
}

Notes:<br>
&emsp;\-    We gave full credit if 0/1 were replaced by any other integer, as long as they were consistent.<br>
&emsp;\-    We gave full credit if lock was initialized or released using swap.<br>
&emsp;\-    We gave partial credit for Acquire if it was close to either of the correct solutions.

Page 7/12


---

<a id="page-8"></a>
**Page 8**

CS 162 Fall 2017, 1st Exam         September 28, 2017

&emsp;b) (8 points) \[Sleeping Barber Problem\] A barber shop has one barber chair, and a<br>
&emsp;&emsp;waiting room with **N** chairs. The barber goes to sleep if there are no customers. If<br>
&emsp;&emsp;a customer arrives, and the barber chair along with all **N** chairs in the waiting<br>
&emsp;&emsp;room are occupied, he leaves the shop. Otherwise, the customer sits on the<br>
&emsp;&emsp;waiting room chair and waits. If the barber is asleep in his chair, the customer<br>
&emsp;&emsp;wakes up the barber.<br>
&emsp;&emsp;Consider that the barber and each of the customers are independent, concurrent<br>
&emsp;&emsp;threads. Fill in the following blanks to ensure that the barber and the customers<br>
&emsp;&emsp;are synchronized and deadlock free. Assume each semaphore has P() and V()<br>
&emsp;&emsp;functions available as semaphore.P() and semaphore.V():


![Figure on page 8](figures/solutions-p08-fig06.png)

Notes:<br>
&emsp;-<br>
&emsp;&emsp;We gave partial credit for (to varying extents, depending on the situation) if you had<br>
&emsp;&emsp;mixed up the P()/V() calls or customerReady/barberReady semaphores.<br>
&emsp;-<br>
&emsp;&emsp;We gave full credit for accessWaitRoomSeats.P() and accessWaitRoomSeats.V() if they<br>
&emsp;&emsp;were before and after the numberOfFreeWaitRoomSeats access/modification,<br>
&emsp;&emsp;respectively.

Page 8/12


---

<a id="page-9"></a>
**Page 9**

CS 162 Fall 2017, 1st Exam         September 28, 2017

&emsp;c)  (4 points) Describe a scenario where a customer can get starved, i.e., get stuck<br>
&emsp;&emsp;waiting in the waiting room forever. Briefly outline a way to fix this.<br>
&emsp;A customer may get starved when he is waiting on barberReady.P() and other<br>
customers keep coming in and getting served before him/her.<br>
&emsp;&emsp;One possible solution is to maintain a queue of waiting customers, and grant them<br>
access to getHairCut() in FIFO order.

Page 9/12


---

<a id="page-10"></a>
**Page 10**

CS 162 Fall 2017, 1st Exam         September 28, 2017

**P4** (21 points total) **Networking is an Important Skill!:** The code below implements a<br>
server that handles multiple connections. (We ignore disconnections and other socket<br>
errors, as well as fork() failure. You could also ignore those failures when answering the<br>
following questions.)

0  int pid = getpid()<br>
1  bind(sockfd, (struct sockaddr \*) &serv\_addr, sizeof(serv\_addr))<br>
2  listen(sockfd,5);<br>
3  while (1) {<br>
4    newsockfd = accept(sockfd, (struct sockaddr \*) &cli\_addr,<br>
&clilen);<br>
5    if (fork() == 0) {<br>
6       // do some communication;<br>
7       exit(0);<br>
8    } else {<br>
9      if (some condition) break;<br>
10   }<br>
11 }


![Figure on page 10](figures/solutions-p10-fig07.png)

&emsp;&emsp;Example: After line 1: close(sockfd)  # note this example might be incorrect<br>
After line 5: close(sockfd)<br>
After line 6: close(newsockfd)<br>
After line 8: close(newsockfd)<br>
After line 11: close(sockfd)  or do this at line9, before break;


![Figure on page 10](figures/solutions-p10-fig08.png)

Page 10/12


---

<a id="page-11"></a>
**Page 11**

CS 162 Fall 2017, 1st Exam         September 28, 2017

&emsp;int count = 0;<br>
&emsp;int status;<br>
&emsp;while (1) {<br>
&emsp;&emsp;while (count \> 2) {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;if (wait(&status) \> 0)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;count--;<br>
&emsp;&emsp;}<br>
&emsp;&emsp;newsockfd = accept(sockfd, (struct sockaddr \*) &cli\_addr,<br>
&emsp;&clilen);<br>
&emsp;&emsp;count++;<br>
&emsp;\# An alternative solution could close socket here<br>
&emsp;&emsp;if (fork() == 0) {<br>
&emsp;&emsp;if (count == 3) {


![Figure on page 11](figures/solutions-p11-fig09.png)

} else {<br>
&emsp;\# do some communication<br>
&emsp;}<br>
&emsp;exit(0);<br>
&emsp;&emsp;} else {<br>
&emsp;&emsp;if (some condition) break;<br>
&emsp;&emsp;}<br>
&emsp;}


![Figure on page 11](figures/solutions-p11-fig10.png)

&emsp;char reqbuf\[MAXREQ\];<br>
&emsp;while (1) {<br>
&emsp;&emsp;\# an alternative should could read 1 char at a time<br>
&emsp;&emsp;n = read(newsockfd, reqbuf, MAXREQ);<br>
&emsp;&emsp;if (i = 0; i \< n; i++) {<br>
&emsp;&emsp;if(reqbuf\[i\] == ‘q’) {<br>
&emsp;&emsp;kill(pid,SIGHUP);<br>
&emsp;&emsp;}<br>
}<br>
&emsp;}


![Figure on page 11](figures/solutions-p11-fig11.png)

&emsp;No. The child processes will keep running.

Page 11/12


---

<a id="page-12"></a>
**Page 12**

CS 162 Fall 2017, 1st Exam         September 28, 2017

**P5** (15 points) **Back to Our Scheduled Programming:** Consider three processes P1, P2,<br>
and P3, being scheduled by a preemptive scheduler. Assume each process has a single<br>
kernel thread, and the context switching between two processes is 100 usec, while the<br>
time slice is 10ms.<br>
&emsp;a) (5 points) Assume that none of the processes perform I/O operations or waits for a<br>
&emsp;&emsp;signal, i.e., the kernel context switch a process only when its time slice expires<br>
&emsp;&emsp;(using the timer interrupt). What is the scheduling overhead of the system, i.e., the<br>
&emsp;&emsp;total context switching time over the total time the CPU is busy?<br>
&emsp;&emsp;The scheduler runs a process for 10ms,  and then spends 100usec to switch to<br>
&emsp;&emsp;another process. Thus, the overhead is:<br>
&emsp;&emsp;100usec/(10ms + 100usec) = 0.99%<br>
&emsp;b) (5 points) Assume that one process is performing an I/O every 1 ms after it is<br>
&emsp;&emsp;scheduled, and the scheduler is using round-robin. What is the scheduling<br>
&emsp;&emsp;overhead of the system now?<br>
&emsp;&emsp;300usec/(10ms + 10ms + 1ms + 300usec) ~= 1.4%

&emsp;c) (5 points) Now assume that all processes share a critical section that takes much<br>
&emsp;&emsp;longer than a times slice, and they use busy-waiting to implement mutual<br>
&emsp;&emsp;exclusion. Assume that at any given time there is one process in the critical<br>
&emsp;&emsp;section, and the scheduler is using the round-robin discipline. What is the<br>
&emsp;&emsp;percentage of time the CPU is doing useful work (the only useful work in this<br>
&emsp;&emsp;case is performed in the critical section.)<br>
&emsp;&emsp;For every 10ms of useful work performed by the process in the critical section,<br>
&emsp;&emsp;the other two processes waste 10ms busy waiting when they are scheduled. Thus,<br>
&emsp;&emsp;the percentage of useful work is<br>
&emsp;&emsp;10ms/30ms = 33%

Page 12/12

