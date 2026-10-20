# Berkeley CS162 Fall 1999: Midterm 1: Official solutions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;University of California, Berkeley<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;College of Engineering<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Computer Science Division – EECS<br>
Fall 1999                                     Anthony D. Joseph<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Midterm Exam #1 Solutions**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;September 29, 1999<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS162 Operating Systems


![Figure on page 1](figures/solutions-p01-fig01.png)

General Information:<br>
This is a **closed book** examination. You have two hours to answer as many questions as possible.<br>
The number in parentheses at the beginning of each question indicates the number of points given<br>
to the question; there are 100 points in all. You should read **all** of the questions before starting the<br>
exam, as some of the questions are substantially more time consuming.<br>
Write all of your answers directly on this paper.  Make your answers as concise as possible. If there<br>
is something in a question that you believe is open to interpretation, then please ask us about it!<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Good Luck!!**


![Figure on page 1](figures/solutions-p01-fig02.png)

Page 1/1


---

<a id="page-2"></a>
**Page 2**

CS 162 Fall 1999 Midterm Exam #1        September 29, 1999<br>
Solutions

1\. Threads – Good or bad? (12 points total):<br>
&emsp;a. (6 points) List two reasons why **overuse** of threads is bad (i.e., using too many<br>
&emsp;&emsp;threads for different tasks). Be explicit in your answers.<br>
&emsp;&emsp;i)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;3 points. “Threads are cheap, but they’re not free.” Too many threads will<br>
&emsp;&emsp;&emsp;&emsp;&emsp;cause a system to spend lots of time context switching and not doing useful<br>
&emsp;&emsp;&emsp;&emsp;&emsp;work.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Each thread requires memory for stack space and TCBs. Too many<br>
&emsp;&emsp;&emsp;&emsp;&emsp;threads and these memory uses will dominate overall memory use.<br>
&emsp;&emsp;ii)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;3 points. Having many threads makes synchronization more complicated<br>
&emsp;&emsp;&emsp;&emsp;&emsp;as you have more and more simultaneous tasks. Also, debugging is more<br>
&emsp;&emsp;&emsp;&emsp;&emsp;difficult due to non-deterministic and non-reproducible execution.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;We did not give credit for answers that were scheduling issues (e.g., too<br>
&emsp;&emsp;&emsp;&emsp;&emsp;many threads could cause starvation), since these issues also affect<br>
&emsp;&emsp;&emsp;&emsp;&emsp;processes.

&emsp;b. (6 points) List two reasons why threads are useful/important.<br>
&emsp;&emsp;i)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;3 points for each of two reasons. Many reasons, including:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;• More efficient operation: overlap I/O and computation<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;• Easier to share data between threads in the same address<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;space than between processes<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;• Modularity: A complex task can be decomposed into smaller<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;pieces<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;• Reduced latency on multiprocessors<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;• Faster to switch between threads than between processes<br>
&emsp;&emsp;&emsp;&emsp;&emsp;We did not give credit for saying that threads give you concurrency, since<br>
&emsp;&emsp;&emsp;&emsp;&emsp;processes also provide concurrency.<br>
&emsp;&emsp;ii)

Page 2/2


---

<a id="page-3"></a>
**Page 3**

CS 162 Fall 1999 Midterm Exam #1        September 29, 1999<br>
Solutions

2\. (15 points) For each of the following thread state transitions, say whether the transition<br>
&emsp;is legal **and** how the transition occurs or why it cannot. Assume Mesa-style monitors.<br>
&emsp;a. Change from thread state **BLOCKED** to thread state **RUNNING**.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;5 points, 3 for correct answer and 2 for justification. Illegal. Threads must<br>
&emsp;&emsp;&emsp;&emsp;&emsp;first be inserted into the ready queue (i.e., moved to the RUNNABLE state)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;before they can be executed (moved to the RUNNING state). With Mesa-<br>
&emsp;&emsp;&emsp;&emsp;&emsp;style monitors, threads are placed onto the ready queue, while with<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Hoare-style monitors, they are immediately given the CPU (moved to the<br>
&emsp;&emsp;&emsp;&emsp;&emsp;RUNNING state).

&emsp;b. Change from thread state **RUNNING** to thread state **BLOCKED**.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;5 points, 3 for correct answer and 2 for justification. Legal. A thread that<br>
&emsp;&emsp;&emsp;&emsp;&emsp;sleeps, joins with another thread, or waits on I/O will transition from the<br>
&emsp;&emsp;&emsp;&emsp;&emsp;RUNNING state to the BLOCKED state.

&emsp;c. Change from thread state **RUNNABLE** to thread state **BLOCKED**.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;5 points, 3 for correct answer and 2 for justification. Illegal. A thread<br>
&emsp;&emsp;&emsp;&emsp;&emsp;can’t change from the RUNNABLE state to the BLOCKED state without<br>
&emsp;&emsp;&emsp;&emsp;&emsp;first being scheduled and taking an action that causes it to block (e.g., the<br>
&emsp;&emsp;&emsp;&emsp;&emsp;actions listed in b).

3\. (9 points) You're hired by AB Computers to improve the performance of their system.<br>
&emsp;They point out that their applications only use 10 of the CPU's 32 registers; so to<br>
&emsp;improve the performance of the applications, they suggest that you change the OS's<br>
&emsp;context switch routine so it only saves the 10 registers used by the applications.<br>
&emsp;Assume that you can correctly change the context switch routine. Is this a good or bad<br>
&emsp;idea? Why?<br>
&emsp;&emsp;This is a very bad idea (correct answer 3 points). Up to 6 points for justification.<br>
&emsp;&emsp;Examples: Long-term implications, such as problems with changes to<br>
&emsp;&emsp;applications or the use of future applications and the intermittent problems that<br>
&emsp;&emsp;will result; also, issues with legacy applications.<br>
&emsp;&emsp;We subtracted 3 points for justifications that only focused on the operating system<br>
&emsp;&emsp;and ignored the long-term issues.

Page 3/3


---

<a id="page-4"></a>
**Page 4**

CS 162 Fall 1999 Midterm Exam #1        September 29, 1999<br>
Solutions

4\. (24 points) Concurrency control:<br>
&emsp;You’ve been hired by the HAL computer company to review their code for a large<br>
&emsp;application. In the application you find the **atomic swap** procedure. Say whether it<br>
&emsp;either (i) works, (ii) doesn’t work, or (iii) is dangerous  that is, sometimes works and<br>
&emsp;sometimes doesn’t.  If the implementation does not work or is dangerous, explain why<br>
&emsp;(there may be several errors) and rewrite the code to fix it so it does work.<br>
&emsp;The problem statement is as follows: The **atomic swap** routine pops an item from each<br>
&emsp;of two stacks and pushes the items onto the opposite stack. If either stack does not<br>
&emsp;contain an item, the swap fails and the stacks are left as before the swap was attempted.<br>
&emsp;The swap must appear to occur atomically: there should be no interval of time during<br>
&emsp;which an external thread can determine that an item has been removed from one stack<br>
&emsp;but not yet pushed onto another one. In addition, the implementation must be highly<br>
&emsp;concurrent – it must allow multiple swaps between unrelated stacks to happen in<br>
&emsp;parallel.  You may assume that stack1 and stack2 never refer to the same stack.<br>
&emsp;&emsp;`void AtomicSwap (Stack *stack1, *stack2) {`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`Item thing1; /* First thing being transferred */`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`Item thing2; /* Second thing being transferred */`

&emsp;&emsp;&emsp;&emsp;&emsp;`stack1->lock.Acquire();`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`thing1 = stack1->Pop();`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`if (thing1 != NULL) {`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`stack2->lock.Acquire();`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`thing2 = stack2->Pop();`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`if (thing2 != NULL) {`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`stack2->Push(thing1);`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`stack1->Push(thing2);`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`stack2->lock.Release();`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`stack1->lock.Release();`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`}`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`}`<br>
&emsp;&emsp;`}`

&emsp;&emsp;This routine is (iii) dangerous (correct answer worth 3 points) for three reasons<br>
&emsp;&emsp;(each reason is worth 3 points):<br>
&emsp;&emsp;&emsp;1\. Deadlock could occur because there is no resource ordering during lock acquisition.<br>
&emsp;&emsp;&emsp;2\. The routine fails to release the locks if either stack is empty.<br>
&emsp;&emsp;&emsp;3\. The routine does not leave stack1 unchanged if stack two is empty (it fails<br>
&emsp;&emsp;&emsp;&emsp;&emsp;to repush thing1).<br>
&emsp;&emsp;We subtracted 3 points if you claimed that the routine is not atomic – an outside<br>
&emsp;&emsp;application cannot see whether something has been removed from one stack and<br>
&emsp;&emsp;not yet pushed onto another stack (this includes the error that fails to repush

Page 4/4


---

<a id="page-5"></a>
**Page 5**

CS 162 Fall 1999 Midterm Exam #1        September 29, 1999<br>
Solutions<br>
&emsp;&emsp;thing1. It does not release the lock on stack1, so the error is not externally<br>
&emsp;&emsp;visible).

Page 5/5


---

<a id="page-6"></a>
**Page 6**

CS 162 Fall 1999 Midterm Exam #1        September 29, 1999<br>
Solutions<br>
(Additional space for question 4)<br>
&emsp;The code solution is worth 12 points total: 3 points for fixing each error and 3 points<br>
&emsp;for the overall implementation quality (if deadlock is fixed). We subtracted 6 points<br>
&emsp;for solutions that used a global lock (where the lock was held for the entire swap<br>
&emsp;routine) and subtracted 3 points for solutions that used a global lock around lock<br>
&emsp;acquisition (where the lock was only held while each lock was acquired).<br>
&emsp;&emsp;`void AtomicSwap (Stack *stack1, *stack2) {`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`Item thing1; /* First thing being transferred */`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`Item thing2; /* Second thing being transferred */`

&emsp;&emsp;&emsp;&emsp;&emsp;`if (stack1 > stack2) {`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`stack1->lock.Acquire();`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`stack2->lock.Acquire();`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`} else {`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`stack2->lock.Acquire();`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`stack1->lock.Acquire();`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`}`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`thing1 = stack1->Pop();`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`if (thing1 != NULL) {`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`thing2 = stack2->Pop();`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`if (thing2 != NULL) {`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`stack2->Push(thing1);`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`stack1->Push(thing2);`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`} else {`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`stack1->Push(thing1);`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`}`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`}`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`stack2->lock.Release();`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`stack1->lock.Release();`<br>
&emsp;&emsp;`}`

Page 6/6


---

<a id="page-7"></a>
**Page 7**

CS 162 Fall 1999 Midterm Exam #1        September 29, 1999<br>
Solutions

5\. Concurrency problem (30 points total):<br>
&emsp;A particular river crossing is shared by both Linux Hackers and Microsoft employees.<br>
&emsp;A boat is used to cross the river, but it only seats **four** people, and must always carry<br>
&emsp;a full load.  In order to guarantee the safety of the hackers, you cannot put three<br>
&emsp;employees and one hacker in the same boat (because the employees would gang up<br>
&emsp;and convert the hacker).  Similarly, you cannot put three hackers in the same boat as<br>
&emsp;an employee (because the hackers would gang up and convert the employee).  All<br>
&emsp;other combinations are safe.<br>
&emsp;Two procedures are needed: HackerArrives and EmployeeArrives, called by a hacker<br>
&emsp;or employee when he/she arrives at the river bank.  The procedures arrange the<br>
&emsp;arriving hackers and employees into safe boatloads; once the boat is full, one thread<br>
&emsp;calls Rowboat and only after the call to Rowboat, the four threads representing the<br>
&emsp;people in the boat can return.<br>
&emsp;You can use either semaphores or condition variables to implement the solution.  Any<br>
&emsp;order is acceptable and there should be no busy-waiting and no undue waiting –<br>
&emsp;hackers and employees should not wait if there are enough of them for a safe<br>
&emsp;boatload. Your code should be clearly commented, in particular, you should comment<br>
&emsp;each semaphore or condition variable operation to specify how correctness<br>
&emsp;properties are preserved.<br>
&emsp;a. Specify the correctness properties for your solution:<br>
&emsp;&emsp;1\. People enter boats either based upon the number already in the boat<br>
&emsp;&emsp;&emsp;(resulting in undue waiting) or they enter the boat in groups of two or four.<br>
&emsp;&emsp;2\. The boat is launched when it contains four people (this action is done by one<br>
&emsp;&emsp;&emsp;of the people threads).<br>
&emsp;&emsp;3\. Only one person (or representative of two or four people) can check the state<br>
&emsp;&emsp;&emsp;of the boat (i.e., the number of people).<br>
&emsp;&emsp;We awarded five points for the correctness properties (a base of two points plus<br>
&emsp;&emsp;one point for each correctness property). We subtracted one point for each<br>
&emsp;&emsp;property that was a performance and not a correctness property (e.g., saying that<br>
&emsp;&emsp;there should not be undue waiting<br>
&emsp;b. Your solution:<br>
&emsp;&emsp;The solution is worth 25 points. An entirely wrong solution was awarded no<br>
&emsp;&emsp;points.<br>
&emsp;&emsp;• We subtracted 8 points if there were no comments, four points if the comments<br>
&emsp;&emsp;&emsp;were weak or useless.<br>
&emsp;&emsp;• For solutions that did not use semaphores or condition variables, we<br>
&emsp;&emsp;&emsp;subtracted 15 points.

Page 7/7


---

<a id="page-8"></a>
**Page 8**

CS 162 Fall 1999 Midterm Exam #1        September 29, 1999<br>
Solutions<br>
(Additional space for question 5)<br>
&emsp;&emsp;• We subtracted 2 points for each minor error, up to 8 points.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;• Not defining or initializing variables<br>
&emsp;&emsp;&emsp;&emsp;&emsp;• Gratuitous checks. For example, checking if the boat contained four<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;people, even if the condition is never visible to other threads.<br>
&emsp;&emsp;• We subtracted 4 points for each major error, up to 12 points:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;• Signaling/waiting outside a critical region (or using a semaphore inside one)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;• Busy waiting<br>
&emsp;&emsp;&emsp;&emsp;&emsp;• Failing to wait for Rowboat to be called before a thread returns<br>
&emsp;&emsp;&emsp;&emsp;&emsp;• A non-symmetric solution where the HackerArrives and<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;EmployeeArrives procedures were different<br>
&emsp;&emsp;&emsp;&emsp;&emsp;• Undue waiting caused by loading one person at a time instead of two<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;or four: loading one at a time is bad because you could have a string<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;of three hackers followed by a long string of employees, all of whom<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;would be forced to wait for another hacker. Loading two or four at a<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;time would avoid such a situation.<br>
&emsp;&emsp;int WH = 0, WE = 0;     // shared variables tracking waiting people<br>
&emsp;&emsp;Lock mutex = FREE;     // Lock to enforce correctness property<br>
&emsp;&emsp;Condition Hacker;        // Used to wait for enough people to cross river<br>
&emsp;&emsp;Condition Employee     // Same as Hacker<br>
&emsp;&emsp;void HackerArrives() {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;mutex-\>Acquire();    // Enter the critical section so we can check state vars<br>
&emsp;&emsp;&emsp;&emsp;&emsp;if (WH == 3) {    // We’ve already got three waiting hackers. Lets go!<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Hacker-\>signal(mutex);    // Wake three hackers (any three)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Hacker-\>signal(mutex);<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Hacker-\>signal(mutex);<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;WH –= 3;    // Decrement state vars (this must be done here, not later)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Rowboat();    // Cross the river<br>
&emsp;&emsp;&emsp;&emsp;&emsp;} else if ((WH \>= 1) && (WE \>= 2) {    // 1 other hacker, 2 employees<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Hacker-\>signal(mutex);    // Wake up one hacker, two employees<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Employee-\>signal(mutex);<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Employee-\>signal(mutex);<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;WH – –;    // Decrement state vars<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;WE –= 2;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Rowboat();<br>
&emsp;&emsp;&emsp;&emsp;&emsp;} else {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;WH++;    // Wait for more Hackers to arrive<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Hacker-\>wait(mutex);    // No need to check state vars<br>
&emsp;&emsp;&emsp;&emsp;&emsp;}<br>
&emsp;&emsp;&emsp;&emsp;&emsp;mutex-\>Release();    // Done with critical section<br>
&emsp;&emsp;}<br>
&emsp;&emsp;The solution for EmployeeArrives is symmetric.

Page 8/8


---

<a id="page-9"></a>
**Page 9**

CS 162 Fall 1999 Midterm Exam #1        September 29, 1999<br>
Solutions<br>
&emsp;&emsp;Although condition variables are the preferred mechanism for solving the problem,<br>
&emsp;&emsp;semaphores can also be used:<br>
&emsp;&emsp;Semaphore Hackers = 0;        // Start with zero hackers<br>
&emsp;&emsp;Semaphore Employees = 0;     // Start with zero employees<br>
&emsp;&emsp;int HackerCount = 0;         // Count of waiting hackers<br>
&emsp;&emsp;int EmployeeCount = 0;        // Count of waiting employees<br>
&emsp;&emsp;Semaphore Mutex = 1;        // Semaphore for critical region (checking counts)<br>
&emsp;&emsp;Semaphore Rowing =0;        // Semaphore to prevent riders from returning from<br>
&emsp;&emsp;//   Hacker/Employee Arrival call until Rowboat call<br>
&emsp;&emsp;void HackerArrives() {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Mutex.P();            // Acquire lock for rider variables<br>
&emsp;&emsp;&emsp;&emsp;&emsp;if (HackerCount == 3) {    // Three other waiting hackers<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;HackerCount –= 3;    // Decrement count of waiters<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Mutex.V();        // Release lock<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Hackers.V();     // Wake up three other waiting hackers<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Hackers.V();<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Hackers.V();<br>
&emsp;&emsp;&emsp;&emsp;&emsp;} else if ((HackerCount \>= 1) && (EmployeeCount \>=2)) {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;HackerCount –= 1    // Decrement count of waiters;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;EmployeeCount –= 2;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Mutex.V();        // Release lock<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Hackers.V();<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Employees.V();<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Employees.V();<br>
&emsp;&emsp;&emsp;&emsp;&emsp;} else {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;HackerCount += 1; // New waiting hacker<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Mutex.V();        // Release lock<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Hackers.P();     // Go to sleep until other riders arrive to fill boat<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Rowing.P();        // Wait for Rowboat, once we get in the boat<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;return;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;}<br>
&emsp;&emsp;&emsp;&emsp;&emsp;// Only the rider that fills the boat (didn’t sleep) makes it to this point<br>
&emsp;&emsp;&emsp;&emsp;&emsp;RowBoat();<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Rowing.V();            // Wake up waiting boat occupants<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Rowing.V();<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Rowing.V();<br>
&emsp;&emsp;}<br>
&emsp;&emsp;The solution for EmployeesArrive is symmetric.

Page 9/9


---

<a id="page-10"></a>
**Page 10**

CS 162 Fall 1999 Midterm Exam #1        September 29, 1999<br>
Solutions<br>
No Credit – Problem X: (000000000000 points)

&emsp;&emsp;Runner up for the 1999 Darwin Awards (don’t try this at home)<br>
In rural Carbon County, PA, a group of men were drinking beer and discharging firearms<br>
from the rear deck of a home owned by Irving Michaels, age 27. The men were firing at a<br>
raccoon that was wandering by, but the beer apparently impaired their aim and, despite<br>
the estimated 35 shots the group fired, the animal escaped into a 3 foot diameter drainage<br>
pipe some 100 feet away from Mr .Michaels’ deck.<br>
Determined to terminate the animal, Mr. Michaels retrieved a can of gasoline and poured<br>
some down the pipe, intending to smoke the animal out. After several unsuccessful<br>
attempts to ignite the fuel, Michaels emptied the entire 5-gallon fuel can down the pipe<br>
and tried to ignite it again, to no avail. Not one to admit defeat by wildlife, the<br>
determined Mr. Michaels proceeded to slide feet-first approximately 15 feet down the<br>
sloping pipe to toss the match.<br>
The subsequent rapidly expanding fireball propelled Mr. Michaels back the way he had<br>
come, although at a much higher rate of speed. He exited the angled pipe “like a Polaris<br>
missile leaves a submarine,” according to witness Joseph McFadden, 31. Mr. Michaels<br>
was launched directly over his own home, right over the heads of his astonished friends,<br>
onto his front lawn. In all, he traveled over 200 feet through the air. “There was a<br>
Doppler Effect to his scream as he flew over us,” McFadden reported, “followed by a<br>
loud thud.” Amazingly, he suffered only minor injuries. “It was actually pretty cool,”<br>
Michaels said, “Like when they shoot someone out of a cannon at the circus. I’d do it<br>
again if I was sure I wouldn’t get hurt.”

Page 10/10


---

<a id="page-11"></a>
**Page 11**

CS 162 Fall 1999 Midterm Exam #1        September 29, 1999<br>
Solutions<br>
6\. (10 points) Deadlock:<br>
Consider a computer system that runs 5000 jobs per month with no deadlock-prevention<br>
or deadlock-avoidance scheme. Deadlocks occur about twice a month, and the operator (a<br>
salaried employee) must terminate and rerun about 10 jobs per deadlock. The operator<br>
notices immediately when deadlock has occurred because their screen shows the<br>
computer’s running processes. Each job is worth about $2 (in CPU time), and the jobs<br>
terminated tend to be about half-done when they are aborted.<br>
A system programmer has estimated that a deadlock-avoidance algorithm (like the<br>
banker’s algorithm) could be installed in the system with an increase in the average<br>
execution time per job of about 10 percent. Since the machine currently has a 30 percent<br>
idle time, all 5000 jobs per month could still be run.<br>
Should the company install the algorithm? List the reasons why or why not.<br>
&emsp;&emsp;The answer to this question was subjective; as such, we looked for answers that<br>
&emsp;&emsp;showed that you thought through your decision.<br>
&emsp;&emsp;Arguments against the algorithm:<br>
&emsp;&emsp;&emsp;1\. The cost of deadlocks is:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;$2/job x 10 jobs x ½ complete = $20/month<br>
&emsp;&emsp;&emsp;&emsp;&emsp;versus the cost of additional CPU time used the deadlock-avoidance<br>
&emsp;&emsp;&emsp;&emsp;&emsp;algorithm:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;10% of 5000 jobs x $2/job = $1000/month<br>
&emsp;&emsp;&emsp;2\. There is less available idle time for future use when the deadlock-<br>
&emsp;&emsp;&emsp;&emsp;&emsp;avoidance algorithm is used.<br>
&emsp;&emsp;&emsp;3\. Finally, the algorithm delays the common case for only a few deadlocks.<br>
&emsp;&emsp;Arguments in favor of the algorithm:<br>
&emsp;&emsp;&emsp;1\. More reliable execution times (since no jobs are aborted and re-run).<br>
&emsp;&emsp;&emsp;2\. Less need for the operator (the operator could be assigned additional /<br>
&emsp;&emsp;&emsp;&emsp;&emsp;alternate tasks)<br>
&emsp;&emsp;&emsp;3\. Running more jobs in the future may result in more deadlocks.<br>
&emsp;&emsp;Overall, the arguments against the algorithm are strongest.<br>
&emsp;&emsp;We awarded 5 points if you provided a reasonable argument (e.g., providing an<br>
&emsp;&emsp;answer with a few of the listed arguments). We awarded more or less points based<br>
&emsp;&emsp;upon the number and strengths of your arguments.

Page 11/11


---

<a id="page-12"></a>
**Page 12**

CS 162 Fall 1999 Midterm Exam #1        September 29, 1999<br>
Solutions<br>
(This page intentionally left blank)

Page 12/12

