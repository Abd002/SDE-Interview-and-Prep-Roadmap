# Berkeley CS162 Summer 2019: Midterm 1: Official solutions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;University of California, Berkeley<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;College of Engineering<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Computer Science Division: EECS<br>
Summer 2019   Jack Kolb<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Midterm I SOLUTIONS<br>
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

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 1/19


---

<a id="page-2"></a>
**Page 2**

CS 162 Summer 2019 Midterm   July 18th, 2019


### Problem 1: True/False \[22 pts\]

Please **explain** your answer in **two sentences or fewer** (Answers longer than this may not get<br>
credit!).  Also, answers without an explanation **get no credit**.


### **Problem 1a\[2pts\]:** The number of allocated kernel stacks is always equal to the number of allocated

userspace stacks.<br>
⬜ True  X False<br>
Explain:<br>
If a process is running a user-level threading library, then there can be more stacks in userspace (one per<br>
user-level thread) than in the kernel (just on kernel thread for the process). Additionally, there are kernel<br>
threads that perform tasks entirely within the operating system and do not require a userspace stack.


### **Problem 1b\[2pts\]:** When using a simple “Base and Bound” scheme to enforce memory protection, the

CPU only sees virtual memory addresses.<br>
⬜ True  X False<br>
Explain:<br>
This depends on how the Base and Bound scheme is implemented. If memory addresses are translated at run<br>
time (adding the Base value to each address referenced before it is passed on to the memory controller), then<br>
the CPU does only see virtual memory addresses. However, if instead a program’s instructions are relocated<br>
at load time, then the CPU still uses physical addresses directly.


### **Problem 1c\[2pts\]:** When fork returns a negative integer, an error has occurred that must be dealt with in

both the parent and child process.<br>
⬜ True  X False<br>
Explain:<br>
When fork returns a negative integer, an error has occurred, but no child process is actually created.


### **Problem 1d\[2pts\]:** Switching between two threads within the same process is generally more efficient

than switching between two threads belonging to different processes.<br>
X True⬜ False<br>
Explain:<br>
Switching between two threads always requires changing the execution context (registers, stack pointer,<br>
program counter, etc.). For two threads belonging to different processes, the OS must also change the current<br>
address space, which incurs an additional cost.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 2/19


---

<a id="page-3"></a>
**Page 3**

CS 162 Summer 2019 Midterm   July 18th, 2019


### **Problem 1e\[2pts\]:** The Linux Completely Fair Scheduler always gives a shorter time slice to lower

priority threads.<br>
⬜ True  X False<br>
Explain:<br>
Imagine we have three threads t1, t2, and t3 with weights 17, 2, and 1, with a latency target of 10ms and a<br>
minimum granularity of 1ms.<br>
&emsp;1\.   t1 gets a time slice of 17/(17+ 2 + 1) \* 10 = 8.5 ms.<br>
&emsp;2\.   t2 gets a time slice of 2/(17 + 2 + 1) \* 10 = 1 ms.<br>
&emsp;3.t3 gets a time slice of 1/(17 + 2 + 1) \* 10 = 0.5ms **except** now the minimum granularity takes effect,<br>
&emsp;&emsp;and t3’s time slice becomes 1ms.


### **Problem 1f\[2pts\]:** When using an atomic operation like test&set to implement a lock, we must apply

the test&set operation to check the lock’s state (either BUSY or FREE) within a “spin loop.”<br>
⬜ True  X False<br>
Explain:<br>
This implementation would force the waiting thread to spin wait while the lock owner is in the critical<br>
section. Instead, we can use a guard variable in the lock’s implementation, as demonstrated in lecture. We<br>
use test&set within a loop to check the value of guard rather than the lock’s state. This means one thread<br>
will spin wait while any other thread is in the middle of acquire or release, but sleep on a queue while<br>
the lock’s owner is inside the critical section.


### **Problem 1g\[2pts\]:** Locks can prevent a thread from being preempted.

⬜ True  X False<br>
Explain:<br>
Locks do not prevent a thread from being preempted. Threads can be interrupted during a critical section.<br>
Locks only guarantee that the critical section is only entered by one thread at a time.


### **Problem 1h\[2pts\]:** If the Banker’s algorithm blocks a request for a resource, then granting that request

would have caused the system to deadlock.<br>
⬜ True  X False<br>
Explain:<br>
When the Banker’s algorithm blocks a request, the system would have entered an unsafe state in which<br>
deadlock is possible, but not certain.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 3/19


---

<a id="page-4"></a>
**Page 4**

CS 162 Summer 2019 Midterm   July 18th, 2019


### **Problem 1i\[2pts\]:** Synchronization primitives in base Pintos are implemented with test&set.

⬜ True  X False<br>
Explain:<br>
The synchronization primitives in synch.c are implemented by disabling interrupts.


### **Problem 1j\[2pts\]:** According to the End-to-End Principle, reliable transport should be implemented by the

two communications endpoints, not the network infrastructure.<br>
X True⬜ False<br>
Explain:<br>
The End-to-End Principle states that many features should be implemented by end hosts on a computer<br>
network, rather than built in to the network infrastructure itself. Reliable transport is a good example of such<br>
a feature, and we saw how TCP achieves this in lecture.


### **Problem 1k\[2pts\]:** After a call to fork, stdin, stdout, and stderr are reset to their default states in

the child process.<br>
⬜ True  X False<br>
Explain:<br>
A newly-forked child process inherits the file descriptors of its parents, including the descriptors for stdin,<br>
stdout, and stderr.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 4/19


---

<a id="page-5"></a>
**Page 5**

CS 162 Summer 2019 Midterm   July 18th, 2019


### Problem 2: Short Answer \[12 pts\]


### **Problem 2a\[3pts\]:** What is the Interrupt Vector Table and what role does it play in protecting the kernel?

The Interrupt Vector Table is a mapping from interrupt type (expressed as a number) to the proper handler<br>
for that interrupt (typically expressed as an address in memory to jump to). This ensures that we start<br>
executing kernel code only at predefined entry points.


### **Problem 2b\[3pts\]:** Why are device drivers divided into a top half and bottom half? What is each half

responsible for?<br>
Device drivers execute on two separate occasions. First, the top half is invoked by the kernel’s IO subsystem<br>
to issue a request to hardware, say to read or write data on a hard drive. Second, the bottom half is invoked<br>
by an interrupt handler, after the hardware has fulfilled the original request. The bottom half does the work<br>
required to copy data off of the device and back into kernel memory (this is usually not something we want<br>
to do within the interrupt handler itself).


### **Problem 2c\[3pts\]:** In Pintos, how would we allow a struct thread to be an element of two lists at the

same time?<br>
We can allow this by adding a second struct list\_elem member to struct thread.


### **Problem 2d\[3pts\]:** Does First-Come First-Served or Round-Robin scheduling have lower overhead?

Explain.<br>
First-come first-served scheduling has lower overhead because it will require fewer context switches<br>
between threads. Because FCFS is non-preemptive, a context switch will only occur when one thread<br>
terminates and the scheduler needs to pick a new thread to run. Round-Robin scheduling is preemptive and<br>
will context switch between threads whenever the running thread’s quantum has expired.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 5/19


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

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 6/19


---

<a id="page-7"></a>
**Page 7**

CS 162 Summer 2019 Midterm   July 18th, 2019

List all possible outputs of the main program in each row of the table below (where one row corresponds to<br>
one run of the program). You may not need all the tables provided. Assume that all system calls succeed<br>
EXCEPT that execv() may possibly fail and assume that the child’s PID is 162.

Standard Output    greetings.txt<br>
Parent howdy!: 162    Parent howdy!: 162

Child hello!    Child hello!<br>
Parent howdy!: 162<br>
Parent howdy!: 162

Child hello!<br>
Child hello!<br>
Parent howdy!: 162<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Parent howdy!: 162

Case 1: After the parent process forks, the child process fails to execv, prompting the child process to send a<br>
SIGTERM signal to the parent process. The parent process invokes signal\_handler() upon returning,<br>
restoring file descriptor 1 to stdout. The parent process then prints “Parent howdy!: 162” to both<br>
stdout and greetings.txt.<br>
Case 2: After the parent process forks, it continues execution and sends a SIGTERM signal to the child<br>
process. The parent process calls wait, context switching back to the child process. Upon executing, the<br>
child process invokes signal\_handler() and restores file descriptor 1 to stdout. Thus, the child process<br>
prints “Child hello!” to both stdout and greetings.txt. When the parent process returns from<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 7/19


---

<a id="page-8"></a>
**Page 8**

CS 162 Summer 2019 Midterm   July 18th, 2019<br>
wait, it prints “Parent howdy!: 162” to greetings.txt twice because its file descriptor 1 never got<br>
restored to stdout.<br>
Case 3:After the parent process forks, the child process continues execution and writes “Child hello!”<br>
twice to greetings.txt. The child then exits, context switching back to the parent process. The parent<br>
process sends a SIGTERM signal to zombie child process, which has no effect because the child process is no<br>
longer running. The parent process calls wait, returning right away. The parent process then prints “Parent<br>
howdy!: 162” twice to greetings.txt.<br>
Common Mistakes:<br>
&emsp;●   Students would often mix the output of greetings.txt with the output of stdout.<br>
&emsp;●   Some students would print the parent process’s greeting before the child process’s greeting, but the<br>
&emsp;&emsp;wait call in the parent process prevents it from writing any output before the child process exits.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 8/19


---

<a id="page-9"></a>
**Page 9**

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

the sequence they are released in matter with respect to deadlock? (Short Answer)<br>
No. There is no situation where unlocking locks can lead to deadlock. The thread has ownership over the<br>
locks already and is not waiting on a lock it does not own.


### **Problem 4b\[2pts\]:** Does the lock release order matter with respect to performance? Explain. (Short Ans.)

Yes. Context switching is highly inefficient. If we unlock the locks in the same order we acquire them, there<br>
is the possibility that a different thread (also trying to lock the locklist structure) starts to acquire some of the<br>
locks before all are free. It would then partially acquire the locks in the locklist, but it wouldn’t be able to<br>
finish. We would have to switch back to unlock the rest, which is very inefficient. If we unlocked it in<br>
reverse order of acquisition, no threads will be unblocked before.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 9/19


---

<a id="page-10"></a>
**Page 10**

CS 162 Summer 2019 Midterm   July 18th, 2019

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
⬜ Can Cause Deadlock      X Cannot Cause Deadlock<br>
Explain:<br>
This cannot cause deadlock. The preference order for each thread is the same (acquiring lower indices first),<br>
so we will never cause deadlock.


### **Problem 4d\[2pts\]:** Lock acquisition code:

void lock\_locklist(struct locklist \*list) {<br>
&emsp;&emsp;int start = getpid() % NUM\_LOCKS;<br>
&emsp;&emsp;for (int i = start; i \< start + NUM\_LOCKS; i++) {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;int index = i % NUM\_LOCKS;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;lock\_acquire (list-\>my\_locks + index);<br>
&emsp;&emsp;}<br>
}<br>
X Can Cause Deadlock⬜ Cannot Cause Deadlock<br>
Explain:<br>
Example: thread 1 acquires lock 1, thread 2 acquires lock 2. Thread 1 blocks waiting for lock 2. Thread 2<br>
acquires locks 3-5, but blocks on acquiring lock 1.<br>
This can cause deadlock. The preference order for each thread is different, so we acquire locks in different<br>
orders and can end up with deadlock.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 10/19


---

<a id="page-11"></a>
**Page 11**

CS 162 Summer 2019 Midterm   July 18th, 2019


### **Problem 4e\[2pts\]:** Lock acquisition code:

void lock\_locklist(struct locklist \*list) {<br>
&emsp;&emsp;int start = NUM\_LOCKS - 1;<br>
&emsp;&emsp;for (int i = start; i \>= 0; i--) {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;int index = i;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;lock\_acquire (list-\>my\_locks + index);<br>
&emsp;&emsp;}<br>
}<br>
⬜ Can Cause Deadlock      X Cannot Cause Deadlock<br>
Explain:<br>
This cannot cause deadlock. The preference order for each thread is the same (acquiring higher indices first),<br>
so we will never cause deadlock.


### **Problem 4f\[2pts\]:** Lock acquisition code:

void lock\_locklist(struct locklist \*list) {<br>
&emsp;&emsp;int start = NUM\_LOCKS/2;<br>
&emsp;&emsp;for (int i = start; i \< start + NUM\_LOCKS; i++) {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;int index = i % NUM\_LOCKS;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;lock\_acquire (list-\>my\_locks + index);<br>
&emsp;&emsp;}<br>
}<br>
⬜ Can Cause Deadlock      X Cannot Cause Deadlock<br>
Explain:<br>
This cannot cause deadlock. The preference order for each thread is the same (starting from the middle<br>
indices first), so we will never cause deadlock.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 11/19


---

<a id="page-12"></a>
**Page 12**

CS 162 Summer 2019 Midterm   July 18th, 2019<br>
Thinking about how much work it will take to lock the locklist structure, Thanos doesn’t always want to<br>
go through the trouble of acquiring all the Infinity Locks. He decides to create the following function to<br>
access the structure faster, acquiring just one lock and later releasing it. **Assume all other threads execute**<br>
**the code from problem 4c when using the locklist.**<br>
void snap(struct locklist \*list) {<br>
&emsp;&emsp;lock\_acquire (list-\>my\_locks + OFFSET);<br>
}


### **Problem 4g\[2pts\]:**  If OFFSET = 0, can snap cause deadlock to happen? If so, provide an example

execution order that leads to deadlock. If not, explain why deadlock is not possible. (Short Answer)<br>
Deadlock is not possible. Since snap is only acquiring one lock, its order of preference will always be<br>
consistent with the other threads. This means having this function will not cause deadlock.


### **Problem 4h\[2pts\]:** If OFFSET = NUM\_LOCKS - 1, can snap cause deadlock to happen? If so, provide

an example execution order that leads to deadlock. If not, explain why deadlock is not possible. (Short<br>
Answer)<br>
Same as the previous answer.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 12/19


---

<a id="page-13"></a>
**Page 13**

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

For 5a and 5b, full points are awarded to answers which have demonstrated not only correct conceptual<br>
understandings but also clarity in the expression. Students need to both identify the resource constraints and<br>
then elaborate on why establishing new connections will consume that scarce resource.


### **Problem 5a\[2pts\]:** Briefly explain why establishing new connections consumes additional resources in

userspace.<br>
Acceptable answers include: More memory needed to manage the connection (e.g., int for the file<br>
descriptor), more userspace buffers to store contents sent to or received from each connection, and<br>
potentially more threads to work with connections concurrently, which consumes memory.

Common Mistakes:<br>
&emsp;1\.   Not clear about the scarce resource. e.g. Memory, CPU time, bandwidth, disk, ...<br>
&emsp;2\.   We do not consider the time taken to process a new user connection as a resource. You have to point<br>
&emsp;&emsp;out clearly that the CPU time is the scarce resource here<br>
&emsp;3.When talking about buffer, answers need to highlight that they are referring to userspace buffer<br>
&emsp;4\.   TCP state management (e.g. ACK, retries, seq number …) is in the kernel space<br>
&emsp;5\.   “because we need to establish sockets” is too vague


### **Problem 5b\[2pts\]:** Briefly explain why establishing new connections consumes additional resources in the

OS kernel.<br>
Acceptable answers include: More elements in the process’s file descriptor table, more elements in the<br>
OS-wide file description table, and more kernel buffers to store data sent to or received from the network<br>
interface card.

Common Mistakes:<br>
&emsp;1\.   Unclear about the scarce resource. e.g. Memory, CPU time, bandwidth, disk, ...<br>
&emsp;2\.   Discussions of an “inode table” are not relevant, as this is a network socket.<br>
&emsp;3\.   Statements like “the OS needs to do more work” do not specify a scarce resource<br>
&emsp;4\.   Some answers mentioned additional interrupts but did not specify where they would come from

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 13/19


---

<a id="page-14"></a>
**Page 14**

CS 162 Summer 2019 Midterm   July 18th, 2019

Bob comes up with a scheme where the server just needs to maintain, for each client, a single connection<br>
through which multiple jobs can be sent and through which processed jobs can be sent back. More<br>
specifically, each connection is managed by one thread and whenever a new job is received, a new thread is<br>
created to do the work in parallel and then send back the results via the same connection.<br>
Graphically, it looks like this:


![Figure on page 14](figures/solutions-p14-fig01.png)


### **Problem 5c\[2pts\]:** Bob approaches you for help with implementing his design. He’s done most of the

coding but left out some critical functions. You are required to fill in the missing lines below. Note that you<br>
might not need all the lines provided.

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
&emsp;**12. void do\_work (struct Job \*job) {**<br>
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
&emsp;**24.  while (1) {**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 14/19


---

<a id="page-15"></a>
**Page 15**

CS 162 Summer 2019 Midterm   July 18th, 2019

&emsp;**25.**<br>
&emsp;**26.    new\_job = malloc(sizeof(struct Job));**<br>
&emsp;**27.**<br>
&emsp;**28.    bytes\_read = read(con\_sockfd, new\_job, sizeof(struct Job));**<br>
&emsp;**29.**<br>
&emsp;**30.    new\_args = malloc(sizeof(struct Arg\_struct));**<br>
&emsp;**31.**<br>
&emsp;**32.    new\_args-\>job = new\_job;**<br>
&emsp;**33.    new\_args-\>socket\_fd = con\_sockfd;**<br>
&emsp;**34.    pthread\_create(&thread, NULL, process\_job, (void\*) new\_args);**<br>
&emsp;**35.  }**<br>
&emsp;**36. }**<br>
&emsp;**37. void \*process\_job(void \*arg) {**<br>
&emsp;**38.  struct Arg\_struct \*new\_args = (struct Arg\_struct\*) arg;**<br>
&emsp;**39.**<br>
&emsp;**40.  /\* Do the work by calling do\_work() and send back response \*/**<br>
&emsp;**41.**<br>
&emsp;**42.**  **do\_work(new\_args-\>job);**<br>
&emsp;**43.**<br>
&emsp;**44.**  **write(new\_args-\>socket\_fd, new\_args-\>job, sizeof(struct Job));**<br>
&emsp;**45.**<br>
&emsp;**46.**<br>
&emsp;**47.**<br>
&emsp;**48.**<br>
&emsp;**49.  /\* Free resources \*/**<br>
&emsp;**50.**<br>
&emsp;**51.**  **free(new\_args-\>job);**<br>
&emsp;**52.**<br>
&emsp;**53.**  **free(new\_args);**<br>
&emsp;**54.**<br>
&emsp;**55. }**<br>
&emsp;**56.**<br>
&emsp;**57. /\* Code Segment in main() \*/**<br>
&emsp;**58. /\* Assume bind() and listen() have been called \*/**<br>
&emsp;**59.**<br>
&emsp;**60. while (1) {**<br>
&emsp;**61.  /\* When a new client connects \*/**<br>
&emsp;**62.**<br>
&emsp;**63.  con\_sockfd = accept(lstn\_sockfd, NULL, NULL);**<br>
&emsp;**64.  pthread\_create(&thread, NULL, new\_conn, (void\*) con\_sockfd);**<br>
&emsp;**65. }**<br>
&emsp;**66.**<br>
&emsp;**67. close(lstn\_sockfd);**

Common Mistakes:<br>
&emsp;1.For sizeof, the argument must be struct Job, not just Job.<br>
&emsp;2.Many answers did not read/write the whole struct. For example, job\_number is an important<br>
&emsp;&emsp;field to return to the client as well. Since the client is submitting jobs asynchronously, the client<br>
&emsp;&emsp;needs to generate a client-side id to keep track of the new jobs sent and completed jobs received. The<br>
&emsp;&emsp;idea of client-side ids is important in RPC calls.<br>
&emsp;3\.   Students should read clearly what each function reads and returns.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 15/19


---

<a id="page-16"></a>
**Page 16**

CS 162 Summer 2019 Midterm   July 18th, 2019

After you are done writing the program, you realize that it doesn’t work. Clients are receiving gibberish<br>
when they try to read each struct that is sent back. You show it to master systems programmer Jeff Dean,<br>
who sees two problems in the code that cause the program to fail.<br>
Firstly, the assumptions that read and write will always return count bytes do not hold. In fact, these sys<br>
calls often read/write fewer than count bytes before returning.


### **Problem 5d\[2pts\]:** Provide a reason why a write system call might write fewer than count bytes.

The write system call may be interrupted while in progress by a signal, in which case some of the requested<br>
bytes will not be written.<br>
Common Mistakes:<br>
&emsp;1.\\x00 does not stop the write call from continuing.<br>
&emsp;2.If the user buffer passed in as the argument for write is shorter than count, this could lead to<br>
&emsp;&emsp;access of an invalid portion of memory and cause the program to crash.


### **Problem 5e\[2pts\]:** To solve this problem, Bob proposes writing a new function with the signature:

&emsp;&emsp;&emsp;&emsp;&emsp;write\_bob(int fd, const void\* buf, size\_t count)<br>
write\_bob makes use of write syscall in its implementation and makes sure that it always writes count<br>
bytes before returns. Provide an implementation for write\_bob**:**<br>
Hint: If write returns 3, then 3 bytes are already written. You don't have to write them again.

void write\_bob(int fd, const void \*buf, size\_t count) {<br>
char \*buffer = (char\*) buf;<br>
/\* Your code below \*/<br>
while (bytes\_written \< count){<br>
bytes\_written += write(fd, buffer + bytes\_written, count – bytes\_written)<br>
}<br>
Common Mistakes:<br>
&emsp;1\.   Arithmetic on a void pointer is invalid. Therefore, buffer, instead of buf, should be used. To<br>
&emsp;&emsp;make things simpler, we cast the pointer for you on the first line as a hint.<br>
&emsp;2\.   Making the write call twice doesn’t guarantee successful writing of the full buffer. Even repeating<br>
&emsp;&emsp;write ten times may not work.<br>
&emsp;3\.   Do not write again whatever is already written.<br>
&emsp;4\.   This function returns void, so there is no need to return an integer.<br>
&emsp;5\.   fflush and fsync are not relevant in this context.<br>
Your temporary variable should use ssize\_t instead of int. Otherwise there could be a buffer overflow<br>
vulnerability.  However, we did not deduct points for this.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 16/19


---

<a id="page-17"></a>
**Page 17**

CS 162 Summer 2019 Midterm   July 18th, 2019


### **Problem 5f\[3pts\]:** Jeff Dean points out a new problem with the code, because the threads share the same

connection socket. Bob proposes solving this problem with a mutex lock. List between which of the lines<br>
above you need to add lock\_acquire() and lock\_release() with a global mutex to solve Jeff’s<br>
problem. For instance, if you needed a lock\_acquire() between lines 1 and 2, you would write (1, 2)<br>
under lock\_acquire() below. You may not need all six spaces.<br>
lock\_acquire()<br>
(\_\_\_\_\_43\_\_\_\_\_, \_\_\_\_\_44\_\_\_\_\_)                (\_\_\_\_\_\_\_\_\_\_, \_\_\_\_\_\_\_\_\_\_)                (\_\_\_\_\_\_\_\_\_\_, \_\_\_\_\_\_\_\_\_\_)<br>
lock\_release()<br>
(\_\_\_\_\_44\_\_\_\_\_, \_\_\_\_\_45\_\_\_\_\_)                (\_\_\_\_\_\_\_\_\_\_, \_\_\_\_\_\_\_\_\_\_)                (\_\_\_\_\_\_\_\_\_\_, \_\_\_\_\_\_\_\_\_\_)<br>
You must acquire a lock before the call to  write and release it after the write.<br>
We took away one point if any unnecessary locks were added. Locking around read is unnecessary since<br>
only a single thread is reading from that connection. This, however, is not true for write.


### **Problem 5g\[3pts\]:** Bob successfully builds the server above, but his computer is slow, and can only handle

up to 5 jobs being processed concurrently per connection. Jeff proposes a solution where a semaphore would<br>
block new jobs from being processed if 5 other jobs are already being processed, and only allow new jobs to<br>
start once an existing job is finished. Assume each thread has a semaphore initialized to 5 and that the line<br>
numbers are as originally (ignore the lock operations above). List between which lines you need to add<br>
sema\_up() and sema\_down() to allow only  up to 5 jobs to be concurrently processed per connection.<br>
sema\_down()<br>
(\_\_\_\_\_41\_\_\_\_\_, \_\_\_\_42\_\_\_\_\_\_)                (\_\_\_\_\_\_\_\_\_\_, \_\_\_\_\_\_\_\_\_\_)                (\_\_\_\_\_\_\_\_\_\_, \_\_\_\_\_\_\_\_\_\_)<br>
sema\_up()<br>
(\_\_\_\_\_42\_\_\_\_\_, \_\_\_\_\_43\_\_\_\_\_)                (\_\_\_\_\_\_\_\_\_\_, \_\_\_\_\_\_\_\_\_\_)                (\_\_\_\_\_\_\_\_\_\_, \_\_\_\_\_\_\_\_\_\_)<br>
Call sema\_up before do\_work and call sema\_down after do\_work.<br>
We took away one point if any unnecessary semaphores were added.  If the unnecessary semaphores have<br>
the potential to cause deadlock, the answer was not given any points.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 17/19


---

<a id="page-18"></a>
**Page 18**

CS 162 Summer 2019 Midterm   July 18th, 2019<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[Scratch Page: Do not put answers here!\]

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 18/19


---

<a id="page-19"></a>
**Page 19**

CS 162 Summer 2019 Midterm   July 18th, 2019<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[Scratch Page: Do not put answers here!\]

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 19/19

