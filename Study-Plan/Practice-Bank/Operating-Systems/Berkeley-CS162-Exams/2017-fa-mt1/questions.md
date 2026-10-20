# Berkeley CS162 Fall 2017: Midterm 1: Questions

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


![Figure on page 1](figures/questions-p01-fig01.png)

General Information:<br>
This is a **closed book and one 2-sided handwritten note** examination. You have 80 minutes to<br>
answer as many questions as possible.  The number in parentheses at the beginning of each<br>
question indicates the number of points for that question. You should read **all** of the questions<br>
before starting the exam, as some of the questions are substantially more time consuming.<br>
Write all of your answers directly on this paper.  **Make your answers as concise as possible.** If there<br>
is something in a question that you believe is open to interpretation, then please ask us about it!<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Good Luck!!**


![Figure on page 1](figures/questions-p01-fig02.png)

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
&emsp;&emsp;Why?

&emsp;b) If one thread closes a file descriptor, then it will be closed for all threads in the<br>
&emsp;&emsp;system, regardless of the process they are belonging to.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?

&emsp;c) The only way a thread can modify another thread’s stack variable is if the thread<br>
&emsp;&emsp;is passed the address of that variable as an argument during creation.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?

Page 2/12


---

<a id="page-3"></a>
**Page 3**

CS 162 Fall 2017, 1st Exam         September 28, 2017

&emsp;d) A binary semaphore (i.e., a semaphore which can only take values 0 and 1; if the<br>
&emsp;&emsp;semaphore is 1 and you increment it, its value remains 1) is semantically<br>
&emsp;&emsp;equivalent to a lock.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?

&emsp;e) When you call fputs(string, outfile), the content of “string” is immediately<br>
&emsp;&emsp;written to “outfile” on disk.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?

&emsp;f) The function pthread\_yield() will always ensure that another thread gets to run.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?

&emsp;g) Hardware interrupts can be used to implement locks.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?

Page 3/12


---

<a id="page-4"></a>
**Page 4**

CS 162 Fall 2017, 1st Exam         September 28, 2017

&emsp;h) When a thread is performing an I/O operation, such as read(), the thread is busy-<br>
&emsp;&emsp;waiting until the operation completes.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?

&emsp;i) When a hardware interrupt occurs, the kernel enqueues the interrupt and serves it<br>
&emsp;&emsp;when the current running thread completes.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?

&emsp;j) With a monitor, the program can call wait() in the critical section on a condition<br>
&emsp;&emsp;variable associated to that monitor.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?

&emsp;k) Context switching between two threads belonging to the same process is less<br>
&emsp;&emsp;expensive than context switching between two threads belonging to two different<br>
&emsp;&emsp;processes.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?

Page 4/12


---

<a id="page-5"></a>
**Page 5**

CS 162 Fall 2017, 1st Exam         September 28, 2017

**P2** (22 points) **Re: Zero – Starting Life in Another Process:** Consider the following C<br>
program. Assume that all system calls succeed when possible.


![Figure on page 5](figures/questions-p05-fig03.png)

&emsp;a) (4 points) Including the original process, how many processes are created?<br>
&emsp;&emsp;Including the original thread, how many threads are created?

Page 5/12


---

<a id="page-6"></a>
**Page 6**

CS 162 Fall 2017, 1st Exam         September 28, 2017

&emsp;b) (6 points) Provide all possible outputs in standard output. If there are multiple<br>
&emsp;&emsp;possibilities, put each in its own box. You may not need all the boxes.


![Figure on page 6](figures/questions-p06-fig04.png)

&emsp;c) (4 points) Provide all possible contents of emilia.txt. If there are multiple<br>
&emsp;&emsp;possibilities, put each in its own box. You may not need all the boxes.


![Figure on page 6](figures/questions-p06-fig05.png)

&emsp;d) (4 points) Suppose we deleted line 28, how would the contents of emilia.txt<br>
&emsp;&emsp;change (if they do)?

&emsp;e) (4 points) What if, in addition to doing the change in part (d), we also move line<br>
&emsp;&emsp;12 (where we open the file descriptor) between lines 19 and 20? What would<br>
&emsp;&emsp;emilia.txt look like then?

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

void Initialize(int\* lock) {

}

void Acquire(int\* lock) {

}

void Release(int\* lock) {

}

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


![Figure on page 8](figures/questions-p08-fig06.png)

&emsp;c)  (4 points) Describe a scenario where a customer can get starved, i.e., get stuck<br>
&emsp;&emsp;waiting in the waiting room forever. Briefly outline a way to fix this.

Page 8/12


---

<a id="page-9"></a>
**Page 9**

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
9       if (some condition) break;<br>
10   }<br>
11 }


![Figure on page 9](figures/questions-p09-fig07.png)

&emsp;&emsp;Example: After line 1: close(sockfd)  # note this example might be incorrect


![Figure on page 9](figures/questions-p09-fig08.png)

Page 9/12


---

<a id="page-10"></a>
**Page 10**

CS 162 Fall 2017, 1st Exam         September 28, 2017

&emsp;int count = 0;<br>
&emsp;int status;<br>
&emsp;while (1) {<br>
&emsp;&emsp;while (count \> 2) {

&emsp;&emsp;}<br>
&emsp;&emsp;newsockfd = accept(sockfd, (struct sockaddr \*) &cli\_addr,<br>
&emsp;&clilen);<br>
&emsp;&emsp;count++;

&emsp;&emsp;if (fork() == 0) {

&emsp;} else {<br>
&emsp;\# do some communication<br>
&emsp;}<br>
&emsp;exit(0);<br>
&emsp;&emsp;} else {<br>
&emsp;&emsp;if (some condition) break;<br>
&emsp;&emsp;}<br>
&emsp;}


![Figure on page 10](figures/questions-p10-fig09.png)

&emsp;char reqbuf\[MAXREQ\];<br>
&emsp;while (1) {

&emsp;}


![Figure on page 10](figures/questions-p10-fig10.png)

Page 10/12


---

<a id="page-11"></a>
**Page 11**

CS 162 Fall 2017, 1st Exam         September 28, 2017

**P5** (15 points) **Back to Our Scheduled Programming:** Consider three processes P1, P2,<br>
and P3, being scheduled by a preemptive scheduler. Assume each process has a single<br>
kernel thread, and the context switching between two processes is 100 usec, while the<br>
time slice is 10ms.<br>
&emsp;a) (5 points) Assume that none of the processes perform I/O operations or waits for a<br>
&emsp;&emsp;signal, i.e., the kernel context switch a process only when its time slice expires<br>
&emsp;&emsp;(using the timer interrupt). What is the scheduling overhead of the system, i.e., the<br>
&emsp;&emsp;total context switching time over the total time the CPU is busy?

&emsp;b) (5 points) Assume that one process is performing an I/O every 1 ms after it is<br>
&emsp;&emsp;scheduled, and the scheduler is using round-robin. What is the scheduling<br>
&emsp;&emsp;overhead of the system now?

&emsp;c) (5 points) Now assume that all processes share a critical section that takes much<br>
&emsp;&emsp;longer than a times slice, and they use busy-waiting to implement mutual<br>
&emsp;&emsp;exclusion. Assume that at any given time there is one process in the critical<br>
&emsp;&emsp;section, and the scheduler is using the round-robin discipline. What is the<br>
&emsp;&emsp;percentage of time the CPU is doing useful work (the only useful work in this<br>
&emsp;&emsp;case is performed in the critical section.)

Page 11/12


---

<a id="page-12"></a>
**Page 12**

CS 162 Fall 2017, 1st Exam         September 28, 2017

Page 12/12

