# Berkeley CS162 Summer 2019: Midterm 1: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;University of California, Berkeley<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;College of Engineering<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Computer Science Division: EECS<br>
Summer 2019   Jack Kolb<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Midterm I<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;July 18th, 2019<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS162: Operating Systems and Systems Programming

&emsp;&emsp;&emsp;&emsp;Your Name:<br>
&emsp;&emsp;SID AND 162 Login<br>
&emsp;&emsp;(e.g. s042):<br>
&emsp;&emsp;TA Name:<br>
&emsp;&emsp;Discussion Section<br>
&emsp;&emsp;Time:

General Information:<br>
This is a **closed book** exam. You are allowed 1 page of handwritten notes (both sides). You have<br>
two (2) hours to complete as much of the exam as possible. Make sure to read all of the questions<br>
first, as some of the questions are substantially more time consuming.<br>
Write all of your answers directly on this paper. Make your answers as concise as possible. On<br>
programming questions, we will be looking for performance as well as correctness, so think through<br>
your answers carefully. If there is something about the questions that you believe is open to<br>
interpretation, please ask us about it!

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Problem**    **Possible**    **Score**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1    22

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2    12

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3    16

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4    16

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;5    16

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Total    82

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 1/17


---

<a id="page-2"></a>
**Page 2**

CS 162 Summer 2019 Midterm   July 18th, 2019


### Problem 1: True/False \[22 pts\]

Please **explain** your answer in **two sentences or fewer** (Answers longer than this may not get<br>
credit!).  Also, answers without an explanation **get no credit**.


### **Problem 1a\[2pts\]:** The number of allocated kernel stacks is always equal to the number of allocated

userspace stacks.<br>
⬜ True  ⬜ False<br>
Explain:


### **Problem 1b\[2pts\]:** When using a simple “Base and Bound” scheme to enforce memory protection, the

CPU only sees virtual memory addresses.<br>
⬜ True  ⬜ False<br>
Explain:


### **Problem 1c\[2pts\]:** When fork returns a negative integer, an error has occurred that must be dealt with in

both the parent and child process.<br>
⬜ True  ⬜ False<br>
Explain:


### **Problem 1d\[2pts\]:** Switching between two threads within the same process is generally more efficient

than switching between two threads belonging to different processes.<br>
⬜ True  ⬜ False<br>
Explain:

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 2/17


---

<a id="page-3"></a>
**Page 3**

CS 162 Summer 2019 Midterm   July 18th, 2019


### **Problem 1e\[2pts\]:** The Linux Completely Fair Scheduler always gives a shorter time slice to lower

priority threads.<br>
⬜ True  ⬜ False<br>
Explain:


### **Problem 1f\[2pts\]:** When using an atomic operation like test&set to implement a lock, we must apply

the test&set operation to check the lock’s state (either BUSY or FREE) within a “spin loop.”<br>
⬜ True  ⬜ False<br>
Explain:


### **Problem 1g\[2pts\]:** Locks can prevent a thread from being preempted.

⬜ True  ⬜ False<br>
Explain:


### **Problem 1h\[2pts\]:** If the Banker’s algorithm blocks a request for a resource, then granting that request

would have caused the system to deadlock.<br>
⬜ True  ⬜ False<br>
Explain:


### **Problem 1i\[2pts\]:** Synchronization primitives in base Pintos are implemented with test&set.

⬜ True  ⬜ False<br>
Explain:

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 3/17


---

<a id="page-4"></a>
**Page 4**

CS 162 Summer 2019 Midterm   July 18th, 2019


### **Problem 1j\[2pts\]:** According to the End-to-End Principle, reliable transport should be implemented by the

two communications endpoints, not the network infrastructure.<br>
⬜ True  ⬜ False<br>
Explain:


### **Problem 1k\[2pts\]:** After a call to fork, stdin, stdout, and stderr are reset to their default states in

the child process.<br>
⬜ True  ⬜ False<br>
Explain:

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 4/17


---

<a id="page-5"></a>
**Page 5**

CS 162 Summer 2019 Midterm   July 18th, 2019


### Problem 2: Short Answer \[12 pts\]


### **Problem 2a\[3pts\]:** What is the Interrupt Vector Table and what role does it play in protecting the kernel?


### **Problem 2b\[3pts\]:** Why are device drivers divided into a top half and bottom half? What is each half

responsible for?


### **Problem 2c\[3pts\]:** In Pintos, how would we allow a struct thread to be an element of two lists at the

same time?


### **Problem 2d\[3pts\]:** Does First-Come First-Served or Round-Robin scheduling have lower overhead?

Explain.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 5/17


---

<a id="page-6"></a>
**Page 6**

CS 162 Summer 2019 Midterm   July 18th, 2019


### Problem 3: Processes and Syscalls \[16 pts\]

Assume that we have the following two pieces of code (with all header files included):<br>
**write\_and\_print.c, compiled to the binary file write\_and\_print**<br>
/\* Takes a file descriptor (int) and a buffer (string) as input and<br>
writes the buffer into the provided file descriptor. **ALSO prints**<br>
**out the buffer to stdout**. \*/<br>
**main.c, compiled to the binary file main**<br>
int new\_fd = -1;

void signal\_handler(int sig) {<br>
dup2(new\_fd, STDOUT\_FILENO);<br>
}

int main() {<br>
int hello\_fd = open("greetings.txt", O\_WRONLY \| O\_CREAT \| O\_TRUNC);<br>
char \*child\_buf = "Child hello!";<br>
char \*parent\_buf = "Parent howdy!";<br>
/\* Assume char \*arguments\[\] is correctly formed with **./write\_and\_print**<br>
**hello\_fd**, and **child\_buf** as arguments \*/<br>
new\_fd = dup(STDOUT\_FILENO);<br>
dup2(hello\_fd, STDOUT\_FILENO);

struct sigaction sa;<br>
sa.sa\_flags = 0;<br>
sa.sa\_handler = &signal\_handler;<br>
sigemptyset(&sa.sa\_mask);<br>
sigaction(SIGTERM, &sa, NULL);

pid\_t pid = fork();<br>
if (pid == 0) {<br>
execv(arguments\[0\], arguments);<br>
kill(getppid(), SIGTERM);<br>
} else {<br>
kill(pid, SIGTERM);<br>
wait(NULL);<br>
dprintf(hello\_fd, "%s: %d\\n", parent\_buf, pid);<br>
printf("%s: %d\\n", parent\_buf, pid);<br>
}

return 0;<br>
}

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 6/17


---

<a id="page-7"></a>
**Page 7**

CS 162 Summer 2019 Midterm   July 18th, 2019

List all possible outputs of the main program in each row of the table below (where one row corresponds to<br>
one run of the program). You may not need all the tables provided. Assume that all system calls succeed<br>
EXCEPT that execv() may possibly fail and assume that the child’s PID is 162.

Standard Output    greetings.txt

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 7/17


---

<a id="page-8"></a>
**Page 8**

CS 162 Summer 2019 Midterm   July 18th, 2019


### Problem 4: DeadLockList \[16 pts\]

Thanos needs to collect all 6 Infinity Locks. He creates a new structure called a locklist to manage the<br>
locks he has acquired or still needs. Instead of just acquiring one lock, threads now have to acquire a series of<br>
locks to ‘lock’ the locklist structure. Think of this as needing a collection of resources before being able<br>
to perform your operations. For all questions, assume the locklist has already been initialized for you and<br>
that we cannot preempt locks.

#DEFINE NUM\_LOCKS 6<br>
struct locklist {<br>
&emsp;&emsp;lock my\_locks\[NUM\_LOCKS\];<br>
&emsp;&emsp;int magic;<br>
};


### **Problem 4a\[2pts\]:** If all locks are released one after another with no other operations between them, does

the sequence they are released in matter with respect to deadlock? (Short Answer)


### **Problem 4b\[2pts\]:** Does the lock release order matter with respect to performance? Explain. (Short Ans.)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 8/17


---

<a id="page-9"></a>
**Page 9**

CS 162 Summer 2019 Midterm   July 18th, 2019<br>
Thanos is now trying to decide in what order to lock the Infinity Locks in the locklist. Which of the<br>
following definitions of lock\_locklist can cause deadlock? Explain your answer for each selection. If<br>
deadlock is possible, please provide an acquisition ordering in your explanation.


### **Problem 4c\[2pts\]:** Lock acquisition code:

void lock\_locklist(struct locklist \*list) {<br>
&emsp;&emsp;int start = 0;<br>
&emsp;&emsp;for (int i = start; i \< NUM\_LOCKS; i++) {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;int index = i;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;lock\_acquire (list-\>my\_locks + index);<br>
&emsp;&emsp;}<br>
}<br>
⬜ Can Cause Deadlock      ⬜ Cannot Cause Deadlock<br>
Explain:


### **Problem 4d\[2pts\]:** Lock acquisition code:

void lock\_locklist(struct locklist \*list) {<br>
&emsp;&emsp;int start = getpid() % NUM\_LOCKS;<br>
&emsp;&emsp;for (int i = start; i \< start + NUM\_LOCKS; i++) {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;int index = i % NUM\_LOCKS;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;lock\_acquire (list-\>my\_locks + index);<br>
&emsp;&emsp;}<br>
}<br>
⬜ Can Cause Deadlock      ⬜ Cannot Cause Deadlock<br>
Explain:

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 9/17


---

<a id="page-10"></a>
**Page 10**

CS 162 Summer 2019 Midterm   July 18th, 2019


### **Problem 4e\[2pts\]:** Lock acquisition code:

void lock\_locklist(struct locklist \*list) {<br>
&emsp;&emsp;int start = NUM\_LOCKS - 1;<br>
&emsp;&emsp;for (int i = start; i \>= 0; i--) {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;int index = i;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;lock\_acquire (list-\>my\_locks + index);<br>
&emsp;&emsp;}<br>
}<br>
⬜ Can Cause Deadlock      ⬜ Cannot Cause Deadlock<br>
Explain:


### **Problem 4f\[2pts\]:** Lock acquisition code:

void lock\_locklist(struct locklist \*list) {<br>
&emsp;&emsp;int start = NUM\_LOCKS/2;<br>
&emsp;&emsp;for (int i = start; i \< start + NUM\_LOCKS; i++) {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;int index = i % NUM\_LOCKS;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;lock\_acquire (list-\>my\_locks + index);<br>
&emsp;&emsp;}<br>
}<br>
⬜ Can Cause Deadlock      ⬜ Cannot Cause Deadlock<br>
Explain:

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 10/17


---

<a id="page-11"></a>
**Page 11**

CS 162 Summer 2019 Midterm   July 18th, 2019<br>
Thinking about how much work it will take to lock the locklist structure, Thanos doesn’t always want to<br>
go through the trouble of acquiring all the Infinity Locks. He decides to create the following function to<br>
access the structure faster, acquiring just one lock and later releasing it. **Assume all other threads execute**<br>
**the code from problem 4c when using the locklist.**<br>
void snap(struct locklist \*list) {<br>
&emsp;&emsp;lock\_acquire (list-\>my\_locks + OFFSET);<br>
}


### **Problem 4g\[2pts\]:**  If OFFSET = 0, can snap cause deadlock to happen? If so, provide an example

execution order that leads to deadlock. If not, explain why deadlock is not possible. (Short Answer)


### **Problem 4h\[2pts\]:** If OFFSET = NUM\_LOCKS - 1, can snap cause deadlock to happen? If so, provide

an example execution order that leads to deadlock. If not, explain why deadlock is not possible. (Short<br>
Answer)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 11/17


---

<a id="page-12"></a>
**Page 12**

CS 162 Summer 2019 Midterm   July 18th, 2019


### Problem 5: Just One TCP Connection \[16 pts\]

Bob is trying to build a system which helps people process jobs. After learning about how sockets work in<br>
CS162, he wants to write a server program which listens on port 162 and takes jobs from clients. Each job is<br>
represented by the following data structure:

struct Job {<br>
int job\_number;<br>
char job\_details\[200\];<br>
int result;<br>
};

However, Bob thinks that having clients make a new connection for each job they want the server to process<br>
seems to be an inefficient design because it consumes resources unnecessarily.


### **Problem 5a\[2pts\]:** Briefly explain why establishing new connections consumes additional resources in

userspace.


### **Problem 5b\[2pts\]:** Briefly explain why establishing new connections consumes additional resources in the

OS kernel.

Bob comes up with a scheme where the server just needs to maintain, for each client, a single connection<br>
through which multiple jobs can be sent and through which processed jobs can be sent back. More<br>
specifically, each connection is managed by one thread and whenever a new job is received, a new thread is<br>
created to do the work in parallel and then send back the results via the same connection.<br>
Graphically, it looks like this:


![Figure on page 12](figures/questions-p12-fig01.png)


### **Problem 5c\[2pts\]:** Bob approaches you for help with implementing his design. He’s done most of the

coding but left out some critical functions. You are required to fill in the missing lines below. Note that you<br>
might not need all the lines provided.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 12/17


---

<a id="page-13"></a>
**Page 13**

CS 162 Summer 2019 Midterm   July 18th, 2019

Assumptions:<br>
&emsp;1\.   When you call ssize\_t read(int fd, void \*buf, size\_t count), it always reads count<br>
&emsp;&emsp;bytes if there is data available. Otherwise, the call blocks.<br>
&emsp;2\.   When you call ssize\_t write(int fd, const void \*buf, size\_t count), it always<br>
&emsp;&emsp;writes count bytes successfully. You do not have to handle the case when read fails because of<br>
&emsp;&emsp;client disconnection.

&emsp;**1. struct Job {**<br>
&emsp;**2.   int job\_number;**<br>
&emsp;**3.   char job\_details\[200\];**<br>
&emsp;**4.   int result;**<br>
&emsp;**5. };**<br>
&emsp;**6.**<br>
&emsp;**7. struct Arg\_struct{**<br>
&emsp;**8.  Job \*job;**<br>
&emsp;**9.  int socket\_fd;**<br>
&emsp;**10. }**<br>
&emsp;**11.**<br>
&emsp;**12. void do\_work (Job \*job) {**<br>
&emsp;**13.  /\* This function does the work and set the result back into job \*/**<br>
&emsp;**14.  /\* This function is compute-intensive \*/**<br>
&emsp;**15. }**<br>
&emsp;**16.**<br>
&emsp;**17. void \*new\_conn(void \*arg) {**<br>
&emsp;**18.  /\* Handles a new client connection \*/**<br>
&emsp;**19.  struct  Job         \*new\_job;**<br>
&emsp;**20.  struct  Arg\_struct  \*new\_args;**<br>
&emsp;**21.  ssize\_t bytes\_read;**<br>
&emsp;**22.**<br>
&emsp;**23.  int**   **con\_sockfd = (int) arg;**<br>
&emsp;**24.  int pending\_jobs = 0;**<br>
&emsp;**25.  while (1) {**<br>
&emsp;**26.**<br>
&emsp;**27.    new\_job = \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**<br>
&emsp;**28.**<br>
&emsp;**29.    bytes\_read = \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**<br>
&emsp;**30.**<br>
&emsp;**31.    new\_args = \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**<br>
&emsp;**32.**<br>
&emsp;**33.    new\_args-\>job = new\_job;**<br>
&emsp;**34.    new\_args-\>socket\_fd = con\_sockfd;**<br>
&emsp;**35.    pthread\_create(&thread, NULL, process\_job, (void\*) new\_job);**<br>
&emsp;**36.  }**<br>
&emsp;**37. }**

**Code Continues on Next Page...**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 13/17


---

<a id="page-14"></a>
**Page 14**

CS 162 Summer 2019 Midterm   July 18th, 2019

&emsp;**38. void \*process\_job(void \*arg) {**<br>
&emsp;**39.  struct Arg\_struct \*new\_args = (struct Arg\_struct\*) arg;**<br>
&emsp;**40.**<br>
&emsp;**41.  /\* Do the work by calling do\_work() and send back response \*/**<br>
&emsp;**42.**<br>
&emsp;**43.  \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**<br>
&emsp;**44.**<br>
&emsp;**45.  \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**<br>
&emsp;**46.**<br>
&emsp;**47.  \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**<br>
&emsp;**48.**<br>
&emsp;**49.**<br>
&emsp;**50.  /\* Free resources \*/**<br>
&emsp;**51.**<br>
&emsp;**52.  \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**<br>
&emsp;**53.**<br>
&emsp;**54.  \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**<br>
&emsp;**55.**<br>
&emsp;**56. }**<br>
&emsp;**57.**<br>
&emsp;**58. /\* Code Segment in main() \*/**<br>
&emsp;**59. /\* Assume bind() and listen() have been called \*/**<br>
&emsp;**60.**<br>
&emsp;**61. while (1) {**<br>
&emsp;**62.  /\* When a new client connects \*/**<br>
&emsp;**63.**<br>
&emsp;**64.  con\_sockfd = \_\_\_\_\_\_\_\_\_(lstn\_sockfd, NULL, NULL);**<br>
&emsp;**65.  pthread\_create(&thread, NULL, new\_conn, (void\*) con\_sockfd);**<br>
&emsp;**66. }**<br>
&emsp;**67.**<br>
&emsp;**68. close(lstn\_sockfd);**

After you are done writing the program, you realize that it doesn’t work. Clients are receiving gibberish<br>
when they try to read each struct that is sent back. You show it to master systems programmer Jeff Dean,<br>
who sees two problems in the code that cause the program to fail.<br>
Firstly, the assumptions that read and write will always return count bytes do not hold. In fact, these sys<br>
calls often read/write fewer than count bytes before returning.


### **Problem 5d\[2pts\]:** Provide a reason why a write system call might write fewer than count bytes.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 14/17


---

<a id="page-15"></a>
**Page 15**

CS 162 Summer 2019 Midterm   July 18th, 2019


### **Problem 5e\[2pts\]:** To solve this problem, Bob proposes writing a new function with the signature:

&emsp;&emsp;&emsp;&emsp;&emsp;write\_bob(int fd, const void\* buf, size\_t count)<br>
write\_bob makes use of write syscall in its implementation and makes sure that it always writes count<br>
bytes before returns. Provide an implementation for write\_bob**:**<br>
Hint: If write returns 3, then 3 bytes are already written. You don't have to write them again.

void write\_bob(int fd, const void \*buf, size\_t count) {<br>
char \*buffer = (char\*) buf;<br>
/\* Your code below \*/

}


### **Problem 5f\[3pts\]:** Jeff Dean points out a new problem with the code, because the threads share the same

connection socket. Bob proposes solving this problem with a mutex lock. List between which of the lines<br>
above you need to add lock\_acquire() and lock\_release() with a global mutex to solve Jeff’s<br>
problem. For instance, if you needed a lock\_acquire() between lines 1 and 2, you would write (1, 2)<br>
under lock\_acquire() below. You may not need all six spaces.<br>
lock\_acquire()

(\_\_\_\_\_\_\_\_\_\_, \_\_\_\_\_\_\_\_\_\_)                (\_\_\_\_\_\_\_\_\_\_, \_\_\_\_\_\_\_\_\_\_)                (\_\_\_\_\_\_\_\_\_\_, \_\_\_\_\_\_\_\_\_\_)

lock\_release()

(\_\_\_\_\_\_\_\_\_\_, \_\_\_\_\_\_\_\_\_\_)                (\_\_\_\_\_\_\_\_\_\_, \_\_\_\_\_\_\_\_\_\_)                (\_\_\_\_\_\_\_\_\_\_, \_\_\_\_\_\_\_\_\_\_)


### **Problem 5g\[3pts\]:** Bob successfully builds the server above, but his computer is slow, and can only handle

up to 5 jobs being processed concurrently per connection. Jeff proposes a solution where a semaphore would<br>
block new jobs from being processed if 5 other jobs are already being processed, and only allow new jobs to<br>
start once an existing job is finished. Assume each thread has a semaphore initialized to 5 and that the line<br>
numbers are as originally (ignore the lock operations above). List between which lines you need to add<br>
sema\_up() and sema\_down() to allow only  up to 5 jobs to be concurrently processed per connection.<br>
sema\_down()

(\_\_\_\_\_\_\_\_\_\_, \_\_\_\_\_\_\_\_\_\_)                (\_\_\_\_\_\_\_\_\_\_, \_\_\_\_\_\_\_\_\_\_)                (\_\_\_\_\_\_\_\_\_\_, \_\_\_\_\_\_\_\_\_\_)

sema\_up()<br>
(\_\_\_\_\_\_\_\_\_\_, \_\_\_\_\_\_\_\_\_\_)                (\_\_\_\_\_\_\_\_\_\_, \_\_\_\_\_\_\_\_\_\_)                (\_\_\_\_\_\_\_\_\_\_, \_\_\_\_\_\_\_\_\_\_)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 15/17


---

<a id="page-16"></a>
**Page 16**

CS 162 Summer 2019 Midterm   July 18th, 2019<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[Scratch Page: Do not put answers here!\]

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 16/17


---

<a id="page-17"></a>
**Page 17**

CS 162 Summer 2019 Midterm   July 18th, 2019<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[Scratch Page: Do not put answers here!\]

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 17/17

