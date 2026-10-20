# Berkeley CS162 Fall 2016: Midterm 1: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;University of California, Berkeley<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;College of Engineering<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Computer Science Division – EECS<br>
Fall 2016                                 Anthony D. Joseph<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Midterm Exam #1**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;September 28, 2016<br>
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

CS 162 Fall 2016 Midterm Exam #1        September 28, 2016<br>
**NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**<br>
1.(21 points total) True/False and Why?<br>
&emsp;a.(8 points) True/False and Why? **CIRCLE YOUR ANSWER.**<br>
&emsp;&emsp;i)When a user program performs a system call, it must first put the system call<br>
&emsp;&emsp;&emsp;arguments onto the kernel stack and then run a special instruction to switch to<br>
&emsp;&emsp;&emsp;kernel mode.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**Why?**

&emsp;&emsp;ii)On a system with a single processor core without hyperthreading, you can<br>
&emsp;&emsp;&emsp;speed up a single-threaded program by utilizing multiple threads.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**Why?**

&emsp;&emsp;iii)When a user program successfully calls execv(), its process is replaced with a<br>
&emsp;&emsp;&emsp;new program. Everything about the old process is destroyed, including all of<br>
&emsp;&emsp;&emsp;the CPU registers, program counter, stack, heap, background threads, file<br>
&emsp;&emsp;&emsp;descriptors, and virtual address space.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**Why?**

Page 2/12


---

<a id="page-3"></a>
**Page 3**

CS 162 Fall 2016 Midterm Exam #1        September 28, 2016<br>
**NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

&emsp;&emsp;iv)The only way a user thread can transfer control to kernel mode is through<br>
&emsp;&emsp;&emsp;syscalls, exceptions, and interrupts.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**Why?**

&emsp;b.(13 points) Short answer.<br>
&emsp;&emsp;i)(4 points) Briefly, in two to three sentences, explain how an Operating System<br>
&emsp;&emsp;&emsp;kernel uses dual mode operation to prevent user programs from overwriting<br>
&emsp;&emsp;&emsp;kernel data structures.

&emsp;&emsp;ii)(3 points) Briefly, in two to three sentences, explain the purpose of the while<br>
&emsp;&emsp;&emsp;loop in the context of Mesa-style condition variables.

Page 3/12


---

<a id="page-4"></a>
**Page 4**

CS 162 Fall 2016 Midterm Exam #1        September 28, 2016<br>
**NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**<br>
&emsp;&emsp;iii)(4 points) Briefly, in two to three sentences, explain the problems with the<br>
&emsp;&emsp;&emsp;Therac-25 – be specific but brief in your answer.

&emsp;&emsp;iv) (2 points) In a typical OS, one way that a thread can transition from the<br>
&emsp;&emsp;&emsp;‘running’ state to the ‘waiting/blocked’ state is to wait on acquiring a lock.<br>
&emsp;&emsp;&emsp;Other than calling sleep or using semaphores or monitors, what are **TWO**<br>
&emsp;&emsp;&emsp;other different types of ways that a thread can transition from the ‘running’<br>
&emsp;&emsp;&emsp;state to the ‘waiting/blocked’ state?

Page 4/12


---

<a id="page-5"></a>
**Page 5**

CS 162 Fall 2016 Midterm Exam #1        September 28, 2016<br>
**NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**<br>
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
&emsp;&emsp;system calls succed)?

&emsp;b.(5 points) If we removed the line pthread\_join(\*thread,  NULL), could the<br>
&emsp;&emsp;output change? If so, explicitly describe the way(s) it might differ.

Page 5/12


---

<a id="page-6"></a>
**Page 6**

CS 162 Fall 2016 Midterm Exam #1        September 28, 2016<br>
**NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**<br>
3.(19 points total) Finite Synchronized Queue using Monitors.<br>
&emsp;In lecture we implemented an Infinite Synchronized Queue using a monitor. In this<br>
&emsp;exam question you will implement a Finite Synchronized Queue (FSQ) using a<br>
&emsp;monitor. The FSQ has Last-In, First-Out semantics  (like a stack), a fixed maximum<br>
&emsp;capacity and supports three operations: CreateQueue(), AddToQueue(), and<br>
&emsp;RemoveFromQueue().<br>
&emsp;a.(6 points) What are the correctness constraints for the Finite Synchronized Queue?<br>
&emsp;&emsp;1.

&emsp;&emsp;2.

&emsp;&emsp;3.

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
&emsp;&emsp;int  capacity;     /\*  max  size  of  queue  \*/

&emsp;}  FSQ;<br>
&emsp;We have implemented the CreateQueue(int  size) function for you. You may<br>
&emsp;assume that the head, length, capacity, and monitor components are initialized.

Page 6/12


---

<a id="page-7"></a>
**Page 7**

CS 162 Fall 2016 Midterm Exam #1        September 28, 2016<br>
**NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

&emsp;c.(5 points) Implement the AddToQueue() function. Feel free to use pseudocode for<br>
&emsp;&emsp;monitor operations.<br>
&emsp;void  AddToQueue(FSQ  \*queue,  Node  \*data)  {

&emsp;}<br>
&emsp;d.(5 points) Implement the RemoveFromQueue() function. Feel free to use<br>
&emsp;&emsp;pseudocode for monitor operations.<br>
&emsp;Node  \*RemoveFromQueue(FSQ  \*queue)  {

&emsp;}

Page 7/12


---

<a id="page-8"></a>
**Page 8**

CS 162 Fall 2016 Midterm Exam #1        September 28, 2016<br>
**NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**<br>
4.(22 points total) PintOS questions<br>
&emsp;a.(3 points) What is the maximum number of threads you can create in a user process<br>
&emsp;&emsp;in PintOS?

&emsp;b.(4 points) How does PintOS preempt the currently running thread in order to<br>
&emsp;&emsp;schedule a new thread to run, if the currently running thread never yields?

&emsp;c.(3 points) What is the purpose of the idle thread in PintOS? Note that simply saying<br>
&emsp;&emsp;“the idle thread is the thread that runs when the system is idle” is not an<br>
&emsp;&emsp;acceptable answer.

&emsp;d.(4 points) Briefly explain what happens when a timer interrupt occurs while<br>
&emsp;&emsp;interrupts are disabled in PintOS.

Page 8/12


---

<a id="page-9"></a>
**Page 9**

CS 162 Fall 2016 Midterm Exam #1        September 28, 2016<br>
**NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

&emsp;e.(4 points) How does struct  thread  \*switch\_threads  (struct  thread<br>
&emsp;&emsp;\*cur,  struct  thread  \*next) work for a thread that has just been created?

&emsp;f.(4 points) Consider the following code for the thread\_exit() function in PintOS:<br>
&emsp;&emsp;void  thread\_exit  (void)  {<br>
&emsp;&emsp;ASSERT  (!intr\_context  ());

&emsp;&emsp;#ifdef  USERPROG<br>
&emsp;&emsp;process\_exit  ();<br>
&emsp;&emsp;#endif

&emsp;&emsp;intr\_disable  ();<br>
&emsp;&emsp;list\_remove  (&thread\_current()-­‐\>allelem);<br>
&emsp;&emsp;thread\_current  ()-­‐\>status  =  THREAD\_DYING;<br>
&emsp;&emsp;schedule  ();<br>
&emsp;&emsp;NOT\_REACHED  ();<br>
&emsp;&emsp;}<br>
&emsp;&emsp;Briefly explain what NOT\_REACHED  ()  means and why this happens.

Page 9/12


---

<a id="page-10"></a>
**Page 10**

CS 162 Fall 2016 Midterm Exam #1        September 28, 2016<br>
**NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**<br>
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
&emsp;1.

&emsp;2.

&emsp;3.

&emsp;b. (6 points) Initialize the global variables:

Page 10/12


---

<a id="page-11"></a>
**Page 11**

CS 162 Fall 2016 Midterm Exam #1        September 28, 2016<br>
**NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**<br>
&emsp;c.(5 points) Implement the Santa() function:<br>
&emsp;&emsp;Santa()  {

&emsp;&emsp;}<br>
&emsp;d.(5 points) Implement the ReindeerComesHome() function:<br>
&emsp;&emsp;ReindeerComesHome()  {

&emsp;&emsp;}

Page 11/12


---

<a id="page-12"></a>
**Page 12**

CS 162 Fall 2016 Midterm Exam #1        September 28, 2016<br>
**NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**<br>
&emsp;e.(5 points) Implement the ElfRequestsHelp() function:<br>
&emsp;&emsp;ElfRequestsHelp()  {

&emsp;&emsp;}

Page 12/12

