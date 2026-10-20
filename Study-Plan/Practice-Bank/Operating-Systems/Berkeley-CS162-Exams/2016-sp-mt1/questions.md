# Berkeley CS162 Spring 2016: Midterm 1: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;University of California, Berkeley<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;College of Engineering<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Computer Science Division – EECS<br>
Spring 2016                                 Anthony D. Joseph<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Midterm Exam #1**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;March 9, 2016<br>
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

Page 1/10


---

<a id="page-2"></a>
**Page 2**

CS 162 Spring 2016 Midterm Exam #1        March 9, 2016<br>
**NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**<br>
1\. (18 points total) Short answer<br>
&emsp;a. (9 points) True/False and Why? **CIRCLE YOUR ANSWER.**<br>
&emsp;&emsp;i) If every thread acquires locks in the same order (for example, sema\_down(A);<br>
&emsp;&emsp;&emsp;sema\_down(X); sema\_down(Y)), deadlock cannot occur.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**Why?**

&emsp;&emsp;ii) It is safe to call sema\_up() or lock\_release() from an interrupt handler in<br>
&emsp;&emsp;&emsp;Pintos, because they cannot cause the current thread to sleep.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**Why?**

&emsp;&emsp;iii) The function getchar(), which reads a character from standard input, can<br>
&emsp;&emsp;&emsp;sometimes run without making any system calls.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**Why?**

Page 2/10


---

<a id="page-3"></a>
**Page 3**

CS 162 Spring 2016 Midterm Exam #1        March 9, 2016<br>
**NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**<br>
&emsp;b. (6 points) Kernels.<br>
&emsp;&emsp;i) Briefly, in two to three sentences, explain what a kernel panic is and why it<br>
&emsp;&emsp;&emsp;causes a system crash.

&emsp;&emsp;ii) Briefly, in two to three sentences, explain the two mechanisms used by the<br>
&emsp;&emsp;&emsp;Operating System kernel to prevent user programs from overwriting kernel<br>
&emsp;&emsp;&emsp;data structures.

&emsp;c. (3 points) Briefly, in two to three sentences, explain why the space shuttle failed to<br>
&emsp;&emsp;launch on April 10, 1981 – be specific but brief in your answer.

Page 3/10


---

<a id="page-4"></a>
**Page 4**

CS 162 Spring 2016 Midterm Exam #1        March 9, 2016<br>
**NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**<br>
2\.  (24 points total) Scheduling. Consider the following set of processes, with associated<br>
&emsp;processing times and priorities:


![Figure on page 4](figures/questions-p04-fig03.png)

&emsp;&emsp;For each scheduling algorithm, fill in the table with the process that is running on the<br>
&emsp;&emsp;CPU (for timeslice-based algorithms, assume a 1 unit timeslice). Notes:<br>
&emsp;&emsp;&emsp;•    A smaller priority number implies a higher priority.<br>
&emsp;&emsp;&emsp;•    For RR and Priority, assume that an arriving thread is run at the beginning of its<br>
&emsp;&emsp;&emsp;&emsp;&emsp;arrival time, if the scheduling policy allows it.<br>
&emsp;&emsp;&emsp;•    All of the processes arrive at time 0 in the order Process A, B, C, D, E.<br>
&emsp;&emsp;&emsp;•    Assume the currently running thread is not in the ready queue while it is running.<br>
&emsp;&emsp;&emsp;•    Turnaround time is defined as the time a process takes to complete after it arrives


![Figure on page 4](figures/questions-p04-fig04.png)

Page 4/10


---

<a id="page-5"></a>
**Page 5**

CS 162 Spring 2016 Midterm Exam #1        March 9, 2016<br>
**NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

3\. (27 points total) Synchronization<br>
&emsp;a. (5 points) Consider the following procedure written in C:<br>
&emsp;&emsp;**struct	  X**	  data;<br>
&emsp;&emsp;**struct	  X**	  `*`getX(**const	  char**	  key\[\])	  {<br>
&emsp;&emsp;computeDatafromKey(key,	  &data);<br>
&emsp;&emsp;//	  a	  value,	  based	  on	  key,	  is	  computed<br>
&emsp;&emsp;//	  	  and	  stored	  in	  data<br>
&emsp;&emsp;**return**	  &data;<br>
&emsp;&emsp;}<br>
&emsp;&emsp;i) (2 points) In a single-threaded program, one would call getX to obtain an item<br>
&emsp;&emsp;&emsp;of type struct X, based on the value of key. Briefly, in one or two sentences,<br>
&emsp;&emsp;&emsp;explain what problems would occur if one used getX in a multithreaded<br>
&emsp;&emsp;&emsp;program?

&emsp;&emsp;ii) (3 points) Rewrite getX to address the problem you mentioned in 3.a.i.<br>
&emsp;&emsp;&emsp;**struct	  X**	  \*getX(**const	  char**	  key\[\])	  {

&emsp;&emsp;`}`

Page 5/10


---

<a id="page-6"></a>
**Page 6**

CS 162 Spring 2016 Midterm Exam #1        March 9, 2016<br>
**NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**<br>
&emsp;b.  (15 points) Consider a multithreaded operating system that includes monitors and<br>
&emsp;&emsp;condition variables with the following primitives:<br>
&emsp;&emsp;mon\_t	  \*mon\_create()	     /\*	  Creates	  a	  new	  monitor	  \*/<br>
&emsp;&emsp;void	  mon\_lock(mon\_t	  \*m)	  /\*	  Acquires	  the	  monitor’s	  lock	  \*/<br>
&emsp;&emsp;void	  mon\_release(mon\_t	  \*m)	     /\*	  Releases	  the	  monitor’s	  lock	  \*/

&emsp;&emsp;cv\_t	  \*cv\_create(mon\_t	  \*m)	     /\*	  Creates	  a	  condition	  variable<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;associated	  with	  monitor	  m	  \*/<br>
&emsp;&emsp;void	  cv\_wait(cv\_t	  \*cv)	   /\*	  Blocks	  on	  the	  condition	  variable	  \*/<br>
&emsp;&emsp;void	  cv\_signal(cv\_t	  \*cv)	     /\*	  Wakes	  a	  thread	  waiting	  on	  cv	  \*/<br>
&emsp;&emsp;void	  cv\_broadcast(cv\_t	  \*cv)	  /\*	  Wakes	  all	  threads	  waiting	  on	  cv	  \*/<br>
&emsp;&emsp;Your task is to implement general purpose semaphores under this system.<br>
&emsp;&emsp;typedef	  struct	  {<br>
&emsp;&emsp;mon\_t	  \*m;<br>
&emsp;&emsp;cv\_t	  \*c;<br>
&emsp;&emsp;int	  value;<br>
&emsp;&emsp;}	  sema\_t;<br>
&emsp;&emsp;You may use these syscalls: malloc(), free(), sbrk(), open(), close(), read(), write()

&emsp;&emsp;sema\_t	  \*sema\_create(int	  initval)	  {

&emsp;&emsp;}

&emsp;&emsp;void	  sema\_down(sema\_t	  \*s)<br>
&emsp;&emsp;{

&emsp;&emsp;}

Page 6/10


---

<a id="page-7"></a>
**Page 7**

&emsp;CS 162 Spring 2016 Midterm Exam #1        March 9, 2016<br>
&emsp;**NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

&emsp;&emsp;&emsp;&emsp;void	  sema\_up(sema\_t	  \*s)<br>
&emsp;&emsp;&emsp;&emsp;{

&emsp;&emsp;&emsp;&emsp;}

&emsp;&emsp;&emsp;c. (7 points)  Consider the following three threads in a concurrent program that uses<br>
&emsp;&emsp;&emsp;&emsp;semaphores Sem1, Sem2, and Sem3.


![Figure on page 7](figures/questions-p07-fig05.png)

&emsp;&emsp;&emsp;&emsp;i) (4 points) Are there initial values that can be given to the semaphores so that<br>
&emsp;&emsp;&emsp;&emsp;&emsp;the threads cooperate to print a string that begins with 16216216216216? If<br>
&emsp;&emsp;&emsp;&emsp;&emsp;so, give the initial values (tell which value is to be used for which semaphore).

&emsp;&emsp;&emsp;&emsp;ii) (3 points) Suppose the initial values are Sem1=2, Sem2=6, Sem3=1. Is it<br>
&emsp;&emsp;&emsp;&emsp;&emsp;possible for the threads to cooperate to produce a string that begins with<br>
&emsp;&emsp;&emsp;&emsp;&emsp;1122622? Explain your answer.

&emsp;Page 7/10


---

<a id="page-8"></a>
**Page 8**

CS 162 Spring 2016 Midterm Exam #1        March 9, 2016<br>
**NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**<br>
4\. (19 points) Coding questions.<br>
&emsp;a. (13 points) We would like to implement the Unix utility, tee, which reads data<br>
&emsp;&emsp;from standard input and writes that data to standard output, as well as all of the<br>
&emsp;&emsp;files that are passed on the command line. For example, if you run the following<br>
&emsp;&emsp;command in bash:<br>
$	  echo	  "CS162	  is	  the	  best!"	  \|	  tee	  letter\_to\_mom.txt	  personal\_motto.txt<br>
&emsp;&emsp;Then, tee would print out “CS162	  is	  the	  best!” to the terminal (standard<br>
&emsp;&emsp;output), and it would also store “CS162	  is	  the	  best!” into a file named<br>
&emsp;&emsp;“letter\_to\_mom.txt” and a file named “personal\_motto.txt”.<br>
&emsp;&emsp;i) (7 points) We have started writing the code for you. Fill in the **blank spots** in<br>
&emsp;&emsp;&emsp;the following code:<br>
char	  buffer\[1024\];<br>
int	  main(int	  argc,	  char	  \*\*argv)	  {<br>
int	  files\[argc\];<br>
files\[0\]	  =	  **\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**;<br>
for	  (int	  i	  =	  1;	  i	  \<	  argc;	  i++)	  {<br>
files\[i\]	  =	  fileno(fopen(argv\[i\],	  "w"));<br>
}<br>
while	  (1)	  {<br>
int	  error	  =	  read(**\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**\_**\_\_\_\_**);<br>
if	  (error	  \<=	  0)	  break;<br>
for	  (int	  i	  =	  0;	  i	  \<	  argc;	  i++)	  {<br>
write(**\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**\_\_\_**\_\_\_\_\_\_\_\_\_\_\_**);<br>
}<br>
}<br>
return	  0;<br>
}<br>
&emsp;&emsp;ii) (2 points) What does this program do if we cannot open one of the destination<br>
&emsp;&emsp;&emsp;files?

Page 8/10


---

<a id="page-9"></a>
**Page 9**

CS 162 Spring 2016 Midterm Exam #1        March 9, 2016<br>
**NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

&emsp;&emsp;iii) (2 points) In our first for loop, what would change if we started the for loop at<br>
&emsp;&emsp;&emsp;i = 0?

&emsp;&emsp;iv) (2 points) What does this program do if the same destination file appears more<br>
&emsp;&emsp;&emsp;than once on the command line?

&emsp;b. (6 points) Pintos questions.<br>
&emsp;&emsp;i) (3 points) Will the Pintos implementation of semaphores work on a<br>
&emsp;&emsp;&emsp;multiprocessor machine? Explain why they will work, or explain how you<br>
&emsp;&emsp;&emsp;could fix them.

&emsp;&emsp;ii) (3 points) In Pintos, how does the thread\_current() function find the<br>
&emsp;&emsp;&emsp;address of the currently running thread’s TCB? (If you did not have access to<br>
&emsp;&emsp;&emsp;this function, how could you get the address of the current thread’s TCB?)

Page 9/10


---

<a id="page-10"></a>
**Page 10**

CS 162 Spring 2016 Midterm Exam #1        March 9, 2016<br>
**NAME: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**<br>
5\. (12 points total) Resource Allocation.<br>
&emsp;Suppose we have the following snapshot of a system with five processes (P1, P2, P3,<br>
&emsp;P4, P5) and 4 resources (R1, R2, R3, R4). There are no outstanding queued<br>
&emsp;unsatisfied requests.<br>
&emsp;**Current Allocation           Max Need              Still Needs**


![Figure on page 10](figures/questions-p10-fig06.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Currently Available Resources**


![Figure on page 10](figures/questions-p10-fig07.png)

&emsp;a. (8 points) Is this system currently in a SAFE, UNSAFE, or deadlocked state?<br>
&emsp;&emsp;Explain your answer and if possible, give an execution order.

&emsp;b. (4 points) If a request from process P2 arrives for (0, 4, 2, 0), can the request be<br>
&emsp;&emsp;granted immediately? Explain your answer and if possible, give an execution<br>
&emsp;&emsp;order.

Page 10/10

