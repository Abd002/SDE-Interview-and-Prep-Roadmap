# Berkeley CS162 Spring 2017: Midterm 1: Official solutions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

CS 162 Spring 2017, 1st Midterm Exam                                     February 27, 2017

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;University of California, Berkeley<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;College of Engineering<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Computer Science Division – EECS<br>
Spring 2017                                Ion Stoica<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**First Midterm Exam**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;February 27, 2017<br>
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

Page 1/13


---

<a id="page-2"></a>
**Page 2**

CS 162 Spring 2017, 1st Midterm Exam                                     February 27, 2017

**P1** (18 points total) True/False and Why? **CIRCLE YOUR ANSWER**. For each<br>
question: 1 point for true/false correct, 2 point for explanation. An explanation cannot<br>
exceed 2 sentences.<br>
&emsp;a) You can use a socket to communicate between two processes on the **same**<br>
&emsp;&emsp;machine.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?<br>
&emsp;&emsp;A socket is an interface for interprocess communication.  It is irrelevant if the two<br>
&emsp;&emsp;processes are on remote computers, or on the same one.

&emsp;b) If you wanted to close one thread in a multithreaded process, the best choice<br>
&emsp;&emsp;would be to call exit(0).<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?<br>
&emsp;&emsp;exit(0) will exit the entire process, which will also close all the other threads in<br>
&emsp;&emsp;the process.

&emsp;c) Incrementing an integer value can always be performed atomically.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?<br>
&emsp;&emsp;Increment requires a load, add, store that may be split.

Page 2/13


---

<a id="page-3"></a>
**Page 3**

CS 162 Spring 2017, 1st Midterm Exam                                     February 27, 2017

&emsp;d) Locks can be implemented by leveraging interrupts on single processor computers.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?<br>
&emsp;&emsp;Just disable interrupts before acquiring and releasing locks.

&emsp;e) Accessing a variable stored in a thread’s individual stack is always thread-safe.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?<br>
&emsp;&emsp;Could pass the address of this variable to another thread.

&emsp;f) Switching the order of two P() semaphore primitives can lead to deadlock (recall<br>
&emsp;&emsp;that sem.P() decrements semaphore value, “sem”, and blocks if it is 0).<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;Why?<br>
&emsp;&emsp;If one P() is used to acquire a lock, and another one to wait(), we can get deadlock<br>
&emsp;&emsp;if the  wait() happens in the critical section without releasing the lock (see slide 1,<br>
&emsp;&emsp;in lecture 9).

Page 3/13


---

<a id="page-4"></a>
**Page 4**

CS 162 Spring 2017, 1st Midterm Exam                                     February 27, 2017

**P2** (20 points) **C Programming and Sockets:** The code below implements a trivial echo<br>
server that reads arbitrary data into reqbuf from a client on consockfd socket descriptor,<br>
and then sends this data back to the client on the same socket descriptor (we ignore<br>
disconnections and other socket errors).

1 void server(int consockfd) {<br>
2   char reqbuf\[MAXREQ\];<br>
3   int n;<br>
4   while (1) {<br>
5      n = read(consockfd, reqbuf, MAXREQ); /\* Recv \*/<br>
6      n = write(consockfd, reqbuf, strlen(reqbuf)); /\* echo\*/<br>
7   }<br>
8 }<br>
Please recall that the last argument of read(), MAXREQ, is the maximum number of<br>
bytes it can read (usually the size of reqbuf), and it returns the number of bytes it reads,<br>
n, which can be smaller than MAXREQ.<br>
Please answer the following questions. Answering a question may require you to add,<br>
delete, or modify the code above. If that’s the case, please specify the # of the line being<br>
modified or deleted. If you need to add code, please specify the #’s of the lines between<br>
which the code needs to be added (e.g., “add code between lines #4 and #5”).<br>
&emsp;a) (6 points) Assume the client always sends strings, i.e., ‘\\0’ terminated sequence<br>
&emsp;&emsp;of characters. What can go wrong in the previous code? Provide a fix by<br>
&emsp;&emsp;specifying the changes to the above code.

The received string might not be null terminated which can result into sending garbage,<br>
as strlen(reqbuf) may exceed MAXREQ size in this case. The server might also crash as<br>
it might try to read from unallocated addresses.<br>
**Solution 1**:<br>
Between lines 4-5: memset(reqbuf, 0, MAXREQ);<br>
Line #5: n = read(consockfd, reqbuf, MAXREQ-1); /\* Recv \*/<br>
Line #6: n = write(consockfd, reqbuf, strlen(reqbuf) + 1); /\* Add NULL<br>
terminator \*/<br>
**Solution 2**:<br>
Line #6: n = write(consockfd, reqbuf, n);

Page 4/13


---

<a id="page-5"></a>
**Page 5**

CS 162 Spring 2017, 1st Midterm Exam                                     February 27, 2017

&emsp;b) (6 points) Assume the client sends a buffer that can contain ‘\\0’ characters. What<br>
&emsp;&emsp;can go wrong in the previous code? Provide a fix by specifying the changes to the<br>
&emsp;&emsp;above code.<br>
The problem is that if there is a ‘\\0’ character in the message, the server will not echo the<br>
characters beyond it.<br>
Line #6: n = write(consockfd, reqbuf, n); /\* echo\*/

&emsp;c) (8 points) Assume the server needs to exit when receiving the string “quit”. Re-<br>
&emsp;&emsp;write the server() code to implement this functionality.<br>
This solution finds “quit” anywhere in the message and works across messages, i.e., if<br>
one message ends with “qu”, and the next one starts with “it”, the server will exit.

void server(int consockfd) {<br>
char reqbuf\[MAXREQ\];<br>
int n;<br>
char \*q = “quit”;<br>
int k = 0;<br>
int i;<br>
while (1) {<br>
n = read(consockfd, reqbuf, MAXREQ); /\* Recv \*/<br>
for (i = 0; i \< n; i++) {<br>
if (q\[k\] == reqbuf\[i\]) {<br>
k++;<br>
if (strlen(q) == k) {<br>
// found “quit” matching; note this works across messages<br>
exit(0);<br>
}<br>
} else {<br>
// no match; re-initialize k = 0<br>
k = 0;<br>
}<br>
}<br>
n = write(consockfd, reqbuf, n); /\* echo\*/<br>
}<br>
}

Page 5/13


---

<a id="page-6"></a>
**Page 6**

CS 162 Spring 2017, 1st Midterm Exam                                     February 27, 2017

**P3** (22 points) **Producer/Consumer:** Consider the following code that implements<br>
a synchronized unbounded queue using monitors that we went over in lecture:

1\.  Lock lock;<br>
2\.  Condition dataready;<br>
3\.  Queue queue;

4\.  AddToQueue(item) {<br>
5\.    lock.Acquire();  // Get Lock<br>
6\.    queue.enqueue(item);  // Add item<br>
7\.    dataready.signal();  // Signal any waiters<br>
8\.    lock.Release();  // Release Lock<br>
9\.  }

10\. RemoveFromQueue() {<br>
11\.   lock.Acquire();  // Get Lock<br>
12\.   while (queue.isEmpty()) {<br>
13\.     dataready.wait(&lock); // If nothing, sleep<br>
14\.   }<br>
15\.   item = queue.dequeue();  // Get next item<br>
16\.   lock.Release();  // Release Lock<br>
17\.   return(item);<br>
18\. }<br>
Please answer the following questions.<br>
&emsp;a) (6 points) Assume that we have multiple producers running AddToQueue() and<br>
&emsp;&emsp;multiple consumers running RemoveFromQueue(). Do you need to make any<br>
&emsp;&emsp;changes to the code? If yes, specify the changes in the above code by indicating<br>
&emsp;&emsp;the line you need to modify, the line #’s between which you need to add new<br>
&emsp;&emsp;code, or the line # you need to delete. If not, use no more than two sentences to<br>
&emsp;&emsp;explain why.

We don’t need to make any changes, as the code already handles multiple producers and<br>
consumers.

Page 6/13


---

<a id="page-7"></a>
**Page 7**

CS 162 Spring 2017, 1st Midterm Exam                                     February 27, 2017

&emsp;b) (10 points) Change the code to implement a bounded queue, i.e., make sure that<br>
&emsp;&emsp;the producer cannot write when the queue is full. Add your changes in the empty<br>
&emsp;&emsp;space of the code below.

**Solution 1 (assuming .isFull() primitive):**

1\.  Lock lock;<br>
2\.    Condition dataready;<br>
Condition queueready;<br>
3\.    Queue queue;

AddToQueue(item) {<br>
lock.Acquire();  // Get Lock<br>
while (queue.isFull()) {<br>
queueready.wait(&lock); // If nothing, sleep<br>
}<br>
queue.enqueue(item);  // Add item<br>
dataready.signal();  // Signal any waiters<br>
lock.Release();  // Release Lock<br>
}

RemoveFromQueue() {<br>
lock.Acquire();  // Get Lock<br>
while (queue.isEmpty()) {<br>
dataready.wait(&lock); // If nothing, sleep<br>
}<br>
item = queue.dequeue();  // Get next item<br>
queueready.signal();  // Signal any waiters<br>
lock.Release();  // Release Lock<br>
return(item);<br>
}

Page 7/13


---

<a id="page-8"></a>
**Page 8**

CS 162 Spring 2017, 1st Midterm Exam                                     February 27, 2017

**Solution 2:**

1\.  Lock lock;<br>
2\.    Condition dataready;<br>
Condition queueready;<br>
3\.    Queue queue;<br>
int queuesize = 0;

AddToQueue(item) {<br>
lock.Acquire();  // Get Lock<br>
while (queueuesize == N) {<br>
queueready.wait(&lock); // If nothing, sleep<br>
}<br>
queuesize++;<br>
queue.enqueue(item);  // Add item<br>
dataready.signal();  // Signal any waiters<br>
lock.Release();  // Release Lock<br>
}

RemoveFromQueue() {<br>
lock.Acquire();  // Get Lock<br>
while (queue.isEmpty()) {<br>
dataready.wait(&lock); // If nothing, sleep<br>
}<br>
item = queue.dequeue();  // Get next item<br>
queuesize--;<br>
queueready.signal();  // Signal any waiters<br>
lock.Release();  // Release Lock<br>
return(item);<br>
}

Page 8/13


---

<a id="page-9"></a>
**Page 9**

CS 162 Spring 2017, 1st Midterm Exam                                     February 27, 2017

&emsp;c) (6 points) Implement a new function, ReadFromQueue(), which uses the<br>
&emsp;&emsp;function “item = queue.read()” to read an item from the queue without<br>
&emsp;&emsp;removing it.

ReadFromQueue() {<br>
lock.Acquire();  // Get Lock<br>
while (queue.isEmpty()) {<br>
dataready.wait(&lock); // If nothing, sleep<br>
}<br>
item = queue.read();  // Get next item<br>
lock.Release();  // Release Lock<br>
return(item);<br>
}

Page 9/13


---

<a id="page-10"></a>
**Page 10**

CS 162 Spring 2017, 1st Midterm Exam                                     February 27, 2017

**P4** (14 points total) **CPU Scheduling:** Consider the following **single-threaded** processes,<br>
and their arrival times, CPU bursts and their priorities (a process with a higher priority<br>
number has priority over a process with lower priority number):


![Figure on page 10](figures/solutions-p10-fig03.png)

Please note:<br>
&emsp;• Priority scheduler is preemptive.<br>
&emsp;• Newly arrived processes are scheduled last for RR. When the RR quanta expires,<br>
&emsp;&emsp;the currently running thread is added at the end of to the ready list before any<br>
&emsp;&emsp;newly arriving threads.<br>
&emsp;• Break ties via priority in Shortest Remaining Time First (SRTF).<br>
&emsp;• If a process arrives at time x, they are ready to run at the beginning of time x.<br>
&emsp;• Ignore context switching overhead.<br>
&emsp;• The quanta for RR is 1 unit of time.<br>
&emsp;• Total turnaround time is the time a process takes to complete after it arrives.<br>
Given the above information please fill in the following table.


![Figure on page 10](figures/solutions-p10-fig04.png)

Page 10/13


---

<a id="page-11"></a>
**Page 11**

CS 162 Spring 2017, 1st Midterm Exam                                     February 27, 2017

**P5** (16 points) **Synchronization:** Next Saturday is the international day of Poker. As the<br>
owner of the largest poker website worldwide you expect a large number of games being<br>
played (and finishing) at any point in time in your website. Consider that players can play<br>
more than one game at a time and any two players can play against each other in more<br>
than one game simultaneously. For simplicity, we consider each game has exactly **two**<br>
players.<br>
The backend system of your poker website contains the following multi-threaded code.

queue     games\_finished\_queue;<br>
lock\_t    games\_finished\_lock;<br>
semaphore games\_to\_process\_sem;

typedef struct Game {<br>
....<br>
} Game;

typedef struct Player {<br>
lock\_t lock;<br>
uint64\_t n\_chips;<br>
uint64\_t unique\_id;<br>
} Player;

void finish\_game(Game\* game) {<br>
lock\_acquire(&games\_finished\_lock);<br>
enqueue(&games\_finished\_queue, game);<br>
lock\_release(&games\_finished\_lock);<br>
sema\_up(&games\_to\_process\_sem);<br>
}

void process\_finished\_games() {<br>
lock\_acquire(&games\_finished\_lock);<br>
sema\_down(&games\_to\_process\_sem);<br>
Game\* g = pop\_queue\_front(&games\_finished\_queue);<br>
move\_chips(g-\>player1, g-\>player2, g-\>n\_chips);<br>
lock\_release(&games\_finished\_lock);<br>
}

void move\_chips(Player\* player1, Player\* player2, uint64\_t n\_chips) {<br>
lock\_acquire(&player1-\>lock);<br>
lock\_acquire(&player2-\>lock);

player1-\>n\_chips -= n\_chips;<br>
player2-\>n\_chips += n\_chips;

lock\_release(&player2-\>lock);<br>
lock\_release(&player1-\>lock);<br>
}

Page 11/13


---

<a id="page-12"></a>
**Page 12**

CS 162 Spring 2017, 1st Midterm Exam                                     February 27, 2017

&emsp;a) (6 points) Identify two places in the code where deadlock can occur. If deadlock<br>
&emsp;&emsp;occurs, use no more than two sentences to explain why it occurs.<br>
First, in process\_finished\_games sema\_down can make thread wait on a critical<br>
section.<br>
Second, move\_chips can deadlock if two players play against each other<br>
simultaneously. This can lead to two concurrent calls with the same (but swapped)<br>
players/arguments.<br>
&emsp;&emsp;move\_chips(player1, player2, n1)<br>
&emsp;&emsp;move\_chips(player2, player1, n2)<br>
**Note: The second deadlock() assumes that move\_chips() is called from another**<br>
**function not shown in the code. Since this was unclear we gave full credit to people**<br>
**who did not identify this second deadlock.**<br>
&emsp;b) (10 points) Use the space bellow to change process\_finished\_games() and<br>
&emsp;&emsp;move\_chips () (or copy if correct) to ensure no deadlocks can occur. Explain<br>
&emsp;&emsp;succinctly why no deadlock can occur with the newly modified code. Note: a<br>
&emsp;&emsp;single lock at the beginning and end of move\_chips is not an accepted solution.

void process\_finished\_games() {<br>
// acquire semaphore outside of critical section<br>
sema\_down(&games\_to\_process);<br>
lock\_acquire(&games\_finished);<br>
Game\* g = pop\_queue\_front(&games\_finished\_queue);<br>
move\_chips(g-\>player1, g-\>player2, g-\>n\_chips);<br>
lock\_release(games\_finished);<br>
}

void move\_chips(Player\* player1, Player\* player2, uint64\_t n\_chips) {<br>
// acquire locks in well defined order<br>
if (player1-\>unique\_id \< player2-\>unique\_id) {<br>
lock\_acquire(&player1-\>lock);<br>
lock\_acquire(&player2-\>lock);<br>
} else {<br>
lock\_acquire(&player2-\>lock);<br>
lock\_acquire(&player1-\>lock);<br>
}<br>
player1-\>n\_chips -= n\_chips;<br>
player2-\>n\_chips += n\_chips;

lock\_release(&player1-\>lock);<br>
lock\_release(&player2-\>lock);<br>
}<br>
**Note: We gave full credit to people who did not identify move\_chips() as a deadlock**<br>
**at (a) and who did not provide the fix here, again, due to confusing text.**

Page 12/13


---

<a id="page-13"></a>
**Page 13**

CS 162 Spring 2017, 1st Midterm Exam                                     February 27, 2017

**P6**. (10 points) **Syscalls:** Please answer the following questions.<br>
&emsp;a) (4 points) **Syscall dispatch**. Suppose there is a function “foo()” in kernel<br>
&emsp;&emsp;memory at address 0xA000 that requires full privileges to run. The kernel would<br>
&emsp;&emsp;like to allow userspace threads to use this function. How can the user thread cause<br>
&emsp;&emsp;foo() to run? For now, we assume that foo() takes no arguments and has no<br>
&emsp;&emsp;return value. (HINT: x86 provides an instruction "INT N" that sends interrupt #N<br>
&emsp;&emsp;to the CPU where N is between 0-255.)

&emsp;This isn’t the only right answer, but it is the simplest (the answers to part 2 would<br>
&emsp;also work here): The kernel would pick a free interrupt number (for concreteness,<br>
&emsp;let’s say “2”). It would then fill in “0xA000” into the IVT entry #2. The user would<br>
&emsp;cause interrupt 2 to enter the kernel. Finally, foo() would use the “return from<br>
&emsp;interrupt” instruction to return control to the user.

&emsp;b) \\ (4 points) **Syscall execution**. Suppose instead of just one function, we wanted to<br>
&emsp;&emsp;support an arbitrary number of system calls (potentially even thousands). Would<br>
&emsp;&emsp;your approach in part 1 still work? If not, what changes would you need to make?<br>
&emsp;The fundamental problem is that there are a limited number of interrupts. Writing Yes<br>
&emsp;or No was not worth any points unless you identified the correct reason. This is<br>
&emsp;because depending on your implementation either yes or no could be correct.<br>
&emsp;There could be several right answers to this.<br>
&emsp;(Fully correct) Similar to Linux: You pass the syscall number in a register (or on the<br>
&emsp;user stack) and then use a known interrupt. This interrupt handler then gets the<br>
&emsp;request number and looks up the function in a table.<br>
&emsp;Another accepted solution was to use a sequence of interrupts to determine an<br>
&emsp;appropriate syscall. (e.g. calling INT 1 then INT 2 then INT 3 corresponds to syscall<br>
&emsp;5000)

&emsp;c)  (3 points) **Pintos Kernel Stack.** In Pintos, would foo() use the user’s stack? If<br>
&emsp;&emsp;not, where does it keep its stack?

&emsp;In Pintos, the kernel does not use the user’s stack. Instead it reserves a portion of the<br>
&emsp;TCB for the associated kernel stack.

Page 13/13

