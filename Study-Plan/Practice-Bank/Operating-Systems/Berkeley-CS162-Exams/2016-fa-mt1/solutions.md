# Berkeley CS162 Fall 2016: Midterm 1: Official solutions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;University of California, Berkeley<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;College of Engineering<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Computer Science Division – EECS<br>
Fall 2016                                 Anthony D. Joseph<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Midterm Exam #1 Solutions**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;September 28, 2016<br>
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

Page 1/16


---

<a id="page-2"></a>
**Page 2**

CS 162 Fall 2016 Midterm Exam #1        September 28, 2016<br>
**Solutions NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**<br>
1.(21 points total) True/False and Why?<br>
&emsp;a.(8 points) True/False and Why? **CIRCLE YOUR ANSWER.**<br>
&emsp;&emsp;i)When a user program performs a system call, it must first put the system call<br>
&emsp;&emsp;&emsp;arguments onto the kernel stack and then run a special instruction to switch to<br>
&emsp;&emsp;&emsp;kernel mode.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**Why?**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**FALSE**. Arguments are put on the thread’s stack, not kernel stack. The<br>
&emsp;&emsp;&emsp;&emsp;&emsp;correct answer was worth 1 point and the justification was worth an<br>
&emsp;&emsp;&emsp;&emsp;&emsp;additional 1 point.

&emsp;&emsp;ii)On a system with a single processor core without hyperthreading, you can<br>
&emsp;&emsp;&emsp;speed up a single-threaded program by utilizing multiple threads.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**Why?**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**TRUE**. Hypertrhreading enables the overlap of I/O and computation. The<br>
&emsp;&emsp;&emsp;&emsp;&emsp;correct answer was worth 1 points and the justification was worth an<br>
&emsp;&emsp;&emsp;&emsp;&emsp;additional 1 point.

&emsp;&emsp;iii)When a user program successfully calls execv(), its process is replaced with<br>
&emsp;&emsp;&emsp;a new program. Everything about the old process is destroyed, including all of<br>
&emsp;&emsp;&emsp;the CPU registers, program counter, stack, heap, background threads, file<br>
&emsp;&emsp;&emsp;descriptors, and virtual address space.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE

Page 2/16


---

<a id="page-3"></a>
**Page 3**

CS 162 Fall 2016 Midterm Exam #1        September 28, 2016<br>
**Solutions NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**Why?**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**FALSE**. File descriptors are not destroyed by execv(). The correct<br>
&emsp;&emsp;&emsp;&emsp;&emsp;answer was worth 1 points and the justification was worth an additional 1<br>
&emsp;&emsp;&emsp;&emsp;&emsp;point.

&emsp;&emsp;iv)The only way a user thread can transfer control to kernel mode is through<br>
&emsp;&emsp;&emsp;syscalls, exceptions, and interrupts.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**Why?**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**TRUE**. For security, threads can only transfer to kernel mode through<br>
&emsp;&emsp;&emsp;&emsp;&emsp;voluntary syscalls, and involuntary exceptions and interrupts. The correct<br>
&emsp;&emsp;&emsp;&emsp;&emsp;answer was worth 1 points and the justification was worth an additional 1<br>
&emsp;&emsp;&emsp;&emsp;&emsp;point.

&emsp;b.(13 points) Short answer.<br>
&emsp;&emsp;i)(4 points) Briefly, in two to three sentences, explain how an Operating System<br>
&emsp;&emsp;&emsp;kernel uses dual mode operation to prevent user programs from overwriting<br>
&emsp;&emsp;&emsp;kernel data structures.<br>
&emsp;&emsp;&emsp;Dual mode operation combined with address translation prevents user<br>
&emsp;&emsp;&emsp;programs from overwriting kernel data structures by limiting the operations<br>
&emsp;&emsp;&emsp;that user programs can perform. In particular, they cannot execute the<br>
&emsp;&emsp;&emsp;privileged instructions that change address translation..

Page 3/16


---

<a id="page-4"></a>
**Page 4**

CS 162 Fall 2016 Midterm Exam #1        September 28, 2016<br>
**Solutions NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

&emsp;&emsp;ii)(3 points) Briefly, in two to three sentences, explain the purpose of the while<br>
&emsp;&emsp;&emsp;loop in the context of Mesa-style condition variables.<br>
&emsp;&emsp;&emsp;With Mesa-style condition variables, the signaler simply places the signaled<br>
&emsp;&emsp;&emsp;thread on the ready queue. Since another thread could run before the signaled<br>
&emsp;&emsp;&emsp;thread and could change the condition that caused the signaled thread to<br>
&emsp;&emsp;&emsp;wait, the signaled thread must check the condition using a while loop.

&emsp;&emsp;iii)(4 points) Briefly, in two to three sentences, explain the problems with the<br>
&emsp;&emsp;&emsp;Therac-25 – be specific but brief in your answer.<br>
&emsp;&emsp;&emsp;Software errors caused the deaths and injuries of several patients. There were<br>
&emsp;&emsp;&emsp;a series of race conditions on shared variables and poor software design that<br>
&emsp;&emsp;&emsp;lead to the machine’s malfunction under certain conditions.

Page 4/16


---

<a id="page-5"></a>
**Page 5**

CS 162 Fall 2016 Midterm Exam #1        September 28, 2016<br>
**Solutions NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

&emsp;&emsp;iv) (2 points) In a typical OS, one way that a thread can transition from the<br>
&emsp;&emsp;&emsp;‘running’ state to the ‘waiting/blocked’ state is to wait on acquiring a lock.<br>
&emsp;&emsp;&emsp;Other than calling sleep or using semaphores or monitors, what are **TWO**<br>
&emsp;&emsp;&emsp;other different types of ways that a thread can transition from the ‘running’<br>
&emsp;&emsp;&emsp;state to the ‘waiting/blocked’ state?<br>
&emsp;&emsp;&emsp;By making an I/O call, or calling wait() on a child process

Page 5/16


---

<a id="page-6"></a>
**Page 6**

CS 162 Fall 2016 Midterm Exam #1        September 28, 2016<br>
**Solutions NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**<br>
2\. (11 points total) C Programming.<br>
&emsp;Consider the following C program:<br>
&emsp;int  thread\_count  =  0;

&emsp;void  \*thread\_start(void  \*arg)  {<br>
&emsp;thread\_count++;<br>
&emsp;if  (thread\_count  ==  3)  {<br>
&emsp;char  \*argv\[\]  =  {"/bin/ls",  NULL};<br>
&emsp;execv(\*argv,  argv);<br>
&emsp;}<br>
&emsp;printf("Thread:  %d\\n",  thread\_count);<br>
&emsp;return  NULL;<br>
&emsp;}

&emsp;int  main(int  argc,  char  \*argv\[\])  {<br>
&emsp;int  i;<br>
&emsp;for  (i  =  0;  i  \<  10;  i++)  {<br>
&emsp;pthread\_t  \*thread  =  malloc(sizeof(pthread\_t));<br>
&emsp;pthread\_create(thread,  NULL,  &thread\_start,  NULL);<br>
&emsp;pthread\_join(\*thread,  NULL);<br>
&emsp;}<br>
&emsp;return  0;<br>
&emsp;}<br>
&emsp;a.(6 points) When you run the program, what will be the output (assume that all<br>
&emsp;&emsp;system calls succeed)?<br>
&emsp;&emsp;The key part of this question is that exec will replace the current process, so no<br>
&emsp;&emsp;more threads will be created. The output will be:<br>
&emsp;&emsp;Thread:  1<br>
&emsp;&emsp;Thread:  2<br>
&emsp;&emsp;(contents  of  current  directory)

&emsp;b.(5 points) If we removed the line pthread\_join(\*thread,  NULL), could the<br>
&emsp;&emsp;output change? If so, explicitly describe the way(s) it might differ.<br>
&emsp;&emsp;Because the threads are created but aren’t waited for, they will execute in a non-<br>
&emsp;&emsp;deterministic order. So, we could get 0 or more printings of:<br>
&emsp;&emsp;Thread:  {1…10}<br>
&emsp;&emsp;(contents  of  current  directory  zero  or  one  times)

Page 6/16


---

<a id="page-7"></a>
**Page 7**

CS 162 Fall 2016 Midterm Exam #1        September 28, 2016<br>
**Solutions NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**<br>
3.(19 points total) Finite Synchronized Queue using Monitors.<br>
&emsp;In lecture we implemented an Infinite Synchronized Queue using a monitor. In this<br>
&emsp;exam question you will implement a Finite Synchronized Queue (FSQ) using a<br>
&emsp;monitor. The FSQ has Last-In, First-Out semantics  (like a stack), a fixed maximum<br>
&emsp;capacity and supports three operations: CreateQueue(), AddToQueue(), and<br>
&emsp;RemoveFromQueue().<br>
&emsp;a.(6 points) What are the correctness constraints for the Finite Synchronized Queue?<br>
&emsp;&emsp;1\. If the queue is at capacity (full), then AddToQueue() must wait

&emsp;&emsp;2\. If the queue is empty, then RemoveFromQueue() must wait

&emsp;&emsp;3\. Only one thread may manipulate the queue at a time

&emsp;Each element of the FSQ is a node:<br>
&emsp;typedef  struct  {<br>
&emsp;&emsp;int  data;<br>
&emsp;&emsp;node  \*next;<br>
&emsp;}  Node;<br>
&emsp;b.(3 points) Modify the FSQ  struct to support a Finite Synchronized Queue.<br>
&emsp;&emsp;You may assume that you have struct types for the components of a monitor.<br>
&emsp;typedef  struct  {<br>
&emsp;&emsp;Node  \*head;     /\*  pointer  to  head  of  queue  \*/<br>
&emsp;&emsp;int  length;     /\*  number  of  nodes  in  queue  \*/<br>
&emsp;&emsp;int  capacity;     /\*  max  size  of  queue  \*/<br>
&emsp;&emsp;Lock  lock;<br>
&emsp;&emsp;Condition  dataAvailable;<br>
&emsp;&emsp;Condition  spaceAvailable;

Page 7/16


---

<a id="page-8"></a>
**Page 8**

CS 162 Fall 2016 Midterm Exam #1        September 28, 2016<br>
**Solutions NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

&emsp;}  FSQ;<br>
&emsp;We have implemented the CreateQueue(int  size) function for you. You may<br>
&emsp;assume that the head, length, capacity, and monitor components are initialized.<br>
&emsp;c.(5 points) Implement the AddToQueue() function. Feel free to use pseudocode for<br>
&emsp;&emsp;monitor operations.<br>
&emsp;void  AddToQueue(FSQ  \*queue,  Node  \*data)  {<br>
&emsp;&emsp;LockAcquire(&queue-­‐\>lock);<br>
&emsp;&emsp;while(queue-­‐\>length  ==  queue-­‐\>capacity)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;wait(&queue-­‐\>spaceAvailable,  &queue-­‐\>lock);<br>
&emsp;&emsp;data-­‐\>next  =  queue-­‐\>head;<br>
&emsp;&emsp;queue-­‐\>head  =  data;<br>
&emsp;&emsp;queue-­‐\>length++;<br>
&emsp;&emsp;signal(&queue-­‐\>dataAvailable);<br>
&emsp;LockRelease(&queue-­‐\>lock);

&emsp;}<br>
&emsp;d.(5 points) Implement the RemoveFromQueue() function. Feel free to use<br>
&emsp;&emsp;pseudocode for monitor operations.<br>
&emsp;Node  \*RemoveFromQueue(FSQ  \*queue)  {<br>
&emsp;&emsp;Node  \*data;<br>
&emsp;&emsp;LockAcquire(&queue-­‐\>lock);<br>
&emsp;&emsp;while(queue-­‐\>length  ==  0)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;wait(&queue-­‐\>dataAvailable,  &queue-­‐\>lock);<br>
&emsp;&emsp;data  =  queue-­‐\>head;<br>
&emsp;&emsp;queue-­‐\>head  =  data-­‐\>next;<br>
&emsp;&emsp;signal(&queue-­‐\>spaceAvailable);

Page 8/16


---

<a id="page-9"></a>
**Page 9**

CS 162 Fall 2016 Midterm Exam #1        September 28, 2016<br>
**Solutions NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**<br>
&emsp;LockRelease(&queue-­‐\>lock);<br>
&emsp;&emsp;return  data;

&emsp;}

Page 9/16


---

<a id="page-10"></a>
**Page 10**

CS 162 Fall 2016 Midterm Exam #1        September 28, 2016<br>
**Solutions NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**<br>
4.(22 points total) PintOS questions<br>
&emsp;a.(3 points) What is the maximum number of threads you can create in a user process<br>
&emsp;&emsp;in PintOS?<br>
&emsp;&emsp;One; each process consists of a single thread

&emsp;b.(4 points) How does PintOS preempt the currently running thread in order to<br>
&emsp;&emsp;schedule a new thread to run, if the currently running thread never yields?<br>
&emsp;&emsp;Timer interrupts occur on each tick which lets the kernel preempt a thread that<br>
&emsp;&emsp;has been running too long.

&emsp;c.(3 points) What is the purpose of the idle thread in PintOS? Note that simply saying<br>
&emsp;&emsp;“the idle thread is the thread that runs when the system is idle” is not an<br>
&emsp;&emsp;acceptable answer.<br>
&emsp;&emsp;The idle thread is a placeholder thread so the kernel is always running some<br>
&emsp;&emsp;thread which allows scheduling logic to be implemented easily OR allows<br>
&emsp;&emsp;switch\_threads() to still work when there is no thread to switch from.

&emsp;d.(4 points) Briefly explain what happens when a timer interrupt occurs while<br>
&emsp;&emsp;interrupts are disabled in PintOS.<br>
&emsp;&emsp;When interrupts are disabled, timer interrupts will not trigger the corresponding<br>
&emsp;&emsp;interrupt handler. Because of this, threads running with interrupts disabled<br>
&emsp;&emsp;cannot be context switched. Thus, turning interrupts off allows us to create an<br>
&emsp;&emsp;atomic section in our code.

Page 10/16


---

<a id="page-11"></a>
**Page 11**

CS 162 Fall 2016 Midterm Exam #1        September 28, 2016<br>
**Solutions NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

&emsp;e.(4 points) How does struct  thread  \*switch\_threads  (struct  thread<br>
&emsp;&emsp;\*cur,  struct  thread  \*next) work for a thread that has just been created?<br>
&emsp;&emsp;Upon creation of the thread, the stack will be initialized with two dummy frames<br>
&emsp;&emsp;to make it seem like it has just been context switched away from. This includes the<br>
&emsp;&emsp;root frame for the function kernel\_thread and the frame for<br>
&emsp;&emsp;switch\_threads.<br>
&emsp;&emsp;The dummy frame for switch\_threads includes space for the registers that are<br>
&emsp;&emsp;normally saved on the stack when a context\_switch is performed.<br>
&emsp;&emsp;struct  switch\_threads\_frame<br>
&emsp;&emsp;{<br>
&emsp;&emsp;uint32\_t  edi;                              /\*    0:  Saved  %edi.  \*/<br>
&emsp;&emsp;uint32\_t  esi;                              /\*    4:  Saved  %esi.  \*/<br>
&emsp;&emsp;uint32\_t  ebp;                              /\*    8:  Saved  %ebp.  \*/<br>
&emsp;&emsp;uint32\_t  ebx;                              /\*  12:  Saved  %ebx.  \*/<br>
&emsp;&emsp;void  (\*eip)  (void);                  /\*  16:  Return  address.  \*/<br>
&emsp;&emsp;struct  thread  \*cur;                  /\*  20:  switch\_threads()'s<br>
&emsp;&emsp;CUR  argument.  \*/<br>
&emsp;&emsp;struct  thread  \*next;                /\*  24:  switch\_threads()'s<br>
&emsp;&emsp;NEXT  argument.  \*/<br>
&emsp;&emsp;};

&emsp;f.(4 points) Consider the following code for the thread\_exit() function in PintOS:<br>
&emsp;&emsp;void  thread\_exit  (void)  {<br>
&emsp;&emsp;ASSERT  (!intr\_context  ());

&emsp;&emsp;#ifdef  USERPROG<br>
&emsp;&emsp;process\_exit  ();<br>
&emsp;&emsp;#endif

&emsp;&emsp;/\*  Remove  thread  from  all  threads  list,  set  our  status  to<br>
&emsp;&emsp;dying,  and  schedule  another  process.    That  process

Page 11/16


---

<a id="page-12"></a>
**Page 12**

CS 162 Fall 2016 Midterm Exam #1        September 28, 2016<br>
**Solutions NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**<br>
&emsp;&emsp;will  destroy  us  when  it  calls<br>
&emsp;&emsp;thread\_schedule\_tail()  \*/<br>
&emsp;&emsp;intr\_disable  ();<br>
&emsp;&emsp;list\_remove  (&thread\_current()-­‐\>allelem);<br>
&emsp;&emsp;thread\_current  ()-­‐\>status  =  THREAD\_DYING;<br>
&emsp;&emsp;schedule  ();<br>
&emsp;&emsp;NOT\_REACHED  ();<br>
&emsp;&emsp;}<br>
&emsp;&emsp;Briefly explain what NOT\_REACHED  ()  means and why this happens.<br>
&emsp;&emsp;NOT\_REACHED() panics the kernel when it is called, so the code should never<br>
&emsp;&emsp;reach that point. The reason why it should never reach that point is because<br>
&emsp;&emsp;schedule() will eventually remove the dying thread and clean up its memory so<br>
&emsp;&emsp;it can never be run again.

Page 12/16


---

<a id="page-13"></a>
**Page 13**

CS 162 Fall 2016 Midterm Exam #1        September 28, 2016<br>
**Solutions NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**<br>
5.(27 points total) Santa Claus problem (from Operating Systems: Internals and Design<br>
&emsp;Principles)<br>
&emsp;Santa Claus sleeps in his shop and can only be woken up by either:<br>
&emsp;&emsp;(1) all ten reindeer being back from their vacation or<br>
&emsp;&emsp;(2) some of the elves having difficulty making toys.<br>
&emsp;The elves can only wake Santa up when 5 of them have a problem. While Santa is<br>
&emsp;helping the 5 elves with their problems, any other elf who needs to meet Santa must<br>
&emsp;wait till the other 5 elves have been tended to first.<br>
&emsp;If Santa wakes up to 5 elves and all ten reindeer, Santa decides that the elves must<br>
&emsp;wait and focuses on getting his sled ready. The last (tenth) reindeer to arrive must get<br>
&emsp;Santa while the others wait before being harnessed to the sled. You can assume that<br>
&emsp;there are only ten reindeer, but you cannot make assumptions on the number of elves.<br>
&emsp;Assume Santa can call these methods: prepareSleigh(), helpElves()<br>
&emsp;Reindeer call getHitched() and Elves call getHelp() – both getHitched()<br>
&emsp;and getHelp() are thread safe, and can be called outside of critical sections.<br>
&emsp;&emsp;&emsp;&emsp;**You MUST implement the problem using semaphores.**<br>
&emsp;a.(6 points) What are the correctness constraints?<br>
&emsp;1\. After the 10th reindeer arrives, Santa must call prepareSleigh(), then all ten<br>
&emsp;reindeer must call getHitched()

&emsp;2\. After the 5th elf arrives, Santa must invoke helpElves(). All 5 elves should<br>
&emsp;invoke getHelp()

&emsp;3\. All 5 elves must invoke getHelp() before any other elves enter

&emsp;b. (6 points) Initialize the global variables:<br>
&emsp;int  num\_elves  =  0;     reindeerSem  =  Semaphore(0);<br>
&emsp;int  num\_reindeer  =  0;     elfSem  =  Semaphore(1);<br>
&emsp;santaSem  =  Semaphore(0);     lock  =  Semaphore(1);

Page 13/16


---

<a id="page-14"></a>
**Page 14**

CS 162 Fall 2016 Midterm Exam #1        September 28, 2016<br>
**Solutions NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**<br>
&emsp;c.(5 points) Implement the Santa() function:<br>
&emsp;&emsp;Santa()  {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;while(1)  {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;santaSem.P();<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;lock.P();<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;if  num\_reindeer  ==  10  {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;prepareSleigh();<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;reindeerSem.V();  //  do  this  10  times<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;num\_reindeer  -­‐=  10;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;}  else  if  (num\_elves  ==  5)  {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;helpElves();<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;}<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;lock.V();<br>
&emsp;&emsp;&emsp;&emsp;&emsp;}

&emsp;&emsp;}<br>
&emsp;&emsp;Santa either has to deal with all the reindeer arriving, or a group of elves who<br>
&emsp;&emsp;need help. If ten reindeer are waiting, Santa calls prepareSleigh() then signals<br>
&emsp;&emsp;reindeerSem 10 times so that the reindeer can invoke getHitched(). If elves are<br>
&emsp;&emsp;waiting, Santa just calls helpElves(). He doesn’t need to worry about<br>
&emsp;&emsp;decrementing any counter because the elves do that on their own on their way<br>
&emsp;&emsp;out.

Page 14/16


---

<a id="page-15"></a>
**Page 15**

CS 162 Fall 2016 Midterm Exam #1        September 28, 2016<br>
**Solutions NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**<br>
&emsp;d.(5 points) Implement the ReindeerComesHome() function:<br>
&emsp;&emsp;ReindeerComesHome()  {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;lock.P();<br>
&emsp;&emsp;&emsp;&emsp;&emsp;num\_reindeer  +=  1;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;if  (num\_reindeer  ==  10)  {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;santaSem.V();<br>
&emsp;&emsp;&emsp;&emsp;&emsp;}<br>
&emsp;&emsp;&emsp;&emsp;&emsp;lock.V();<br>
&emsp;&emsp;&emsp;&emsp;&emsp;reindeerSem.P();<br>
&emsp;&emsp;&emsp;&emsp;&emsp;getHitched();

&emsp;&emsp;}<br>
&emsp;&emsp;The 10th reindeer signals Santa then joins the other reindeer waiting on the<br>
&emsp;&emsp;reindeerSem. When Santa signals all the waiting reindeer, they execute<br>
&emsp;&emsp;getHitched().

Page 15/16


---

<a id="page-16"></a>
**Page 16**

CS 162 Fall 2016 Midterm Exam #1        September 28, 2016<br>
**Solutions NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**<br>
&emsp;e.(5 points) Implement the ElfRequestsHelp() function:<br>
&emsp;&emsp;ElfRequestsHelp()  {

&emsp;&emsp;&emsp;&emsp;&emsp;elfSem.P();<br>
&emsp;&emsp;&emsp;&emsp;&emsp;lock.P();<br>
&emsp;&emsp;&emsp;&emsp;&emsp;num\_elves  +=  1;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;if  (num\_elves  ==  5)  {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;santaSem.V();<br>
&emsp;&emsp;&emsp;&emsp;&emsp;}  else  {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;elfSem.V();<br>
&emsp;&emsp;&emsp;&emsp;&emsp;}<br>
&emsp;&emsp;&emsp;&emsp;&emsp;lock.V();<br>
&emsp;&emsp;&emsp;&emsp;&emsp;getHelp();<br>
&emsp;&emsp;&emsp;&emsp;&emsp;lock.P();<br>
&emsp;&emsp;&emsp;&emsp;&emsp;num\_elves  -­‐=  1;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;if  (num\_elves  ==  0)  {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;elfSem.V();<br>
&emsp;&emsp;&emsp;&emsp;&emsp;}<br>
&emsp;&emsp;&emsp;&emsp;&emsp;lock.V();

&emsp;&emsp;}<br>
&emsp;&emsp;The first four elves release the elfSem at the same time they release the lock, but<br>
&emsp;&emsp;the last elf holds the elfSem, which prevents other elves from entering until all<br>
&emsp;&emsp;three elves have invoked getHelp(). The last elf to leave releases the elfSem,<br>
&emsp;&emsp;which allows the next group of elves to enter to request help from Santa.

Page 16/16

