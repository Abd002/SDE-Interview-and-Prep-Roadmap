# Berkeley CS162 Spring 2008: Midterm 1: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;University of California, Berkeley<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;College of Engineering<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Computer Science Division – EECS<br>
Spring 2008                                     Anthony D. Joseph<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Midterm Exam**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;February 27, 2008<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS162 Operating Systems


![Figure on page 1](figures/questions-p01-fig01.png)

General Information:<br>
This is a **closed book and notes** examination. You have 90 minutes to answer as many questions<br>
as possible.  The number in parentheses at the beginning of each question indicates the number of<br>
points given to the question; there are 100 points in all. You should read **all** of the questions<br>
before starting the exam, as some of the questions are substantially more time consuming.<br>
Write all of your answers directly on this paper.  **Make your answers as concise as possible.** If there<br>
is something in a question that you believe is open to interpretation, then please ask us about it!<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Good Luck!!**


![Figure on page 1](figures/questions-p01-fig02.png)

Page 1/12


---

<a id="page-2"></a>
**Page 2**

CS 162 Spring 2008 Midterm Exam        February 27, 2008

1\. (33 points total) Short answer questions:<br>
&emsp;a. (4 points) True/False and Why?<br>
&emsp;&emsp;In the operating system environments that we’ve studied so far, an application<br>
&emsp;&emsp;programmer has to worry about deadlock occurring involving the CPU as a<br>
&emsp;&emsp;resource.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Why?

&emsp;b. (4 points) True/False and Why?<br>
&emsp;&emsp;In the operating system environments that we’ve studied so far (i.e., no virtual<br>
&emsp;&emsp;memory), the operating system has to worry about deadlock occurring involving<br>
&emsp;&emsp;physical memory as a resource.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Why?

&emsp;c.  (5 points) Disabling interrupts:<br>
&emsp;&emsp;i) (3 points) Give a two to three sentence description of how interrupts can be<br>
&emsp;&emsp;&emsp;used to implement critical sections.

&emsp;&emsp;ii) (2 points) Briefly (2-3 sentences) state the problems with implementing critical<br>
&emsp;&emsp;&emsp;sections using disabling of interrupts.

Page 2/12


---

<a id="page-3"></a>
**Page 3**

CS 162 Spring 2008 Midterm Exam        February 27, 2008

&emsp;d. (8 points) List the four requirements for deadlock.

&emsp;e. (4 points) Briefly explain why when using a Hoare semantic monitors it is<br>
&emsp;&emsp;sufficient to use “if” statements when checking state variables, while most OS<br>
&emsp;&emsp;monitor implementations require the use of “while” statements.

&emsp;f. (8 points) In lecture, we discussed using atomic instructions (e.g., test-and-set and<br>
&emsp;&emsp;swap) to implement spinlocks. With spinlocks, threads spin in a loop (busy<br>
&emsp;&emsp;waiting) until the lock is freed. We motivated the use of blocking locks and<br>
&emsp;&emsp;semaphores as an improvement over spinlocks because having threads spin can be<br>
&emsp;&emsp;very inefficient in terms of processor utilization. However, spinlocks are not<br>
&emsp;&emsp;always less efficient than blocking locks. In two to three sentences, briefly<br>
&emsp;&emsp;describe a scenario where spinlocks would be more efficient than blocking locks.

Page 3/12


---

<a id="page-4"></a>
**Page 4**

CS 162 Spring 2008 Midterm Exam        February 27, 2008

2\. (23 points total) Implementing and Using Synchronization Primitives.<br>
&emsp;a. (6 points) While working on the first project, one of your project partners proposes<br>
&emsp;&emsp;to use a modified version of Semaphore to implement the condition variable class<br>
&emsp;&emsp;as follows:<br>
&emsp;&emsp;`Semaphore.set(0);`        `// Initialize semaphore to 0`<br>
&emsp;&emsp;`Wait(Lock lock) {`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`Semaphore.P(lock); // Special semaphore that`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`// releases lock if it waits`<br>
&emsp;&emsp;`}`

&emsp;&emsp;`Signal() {`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`Semaphore.V();`<br>
&emsp;&emsp;`}`<br>
&emsp;&emsp;Decide whether you think their proposal will work or not, and briefly, in two to<br>
&emsp;&emsp;three sentences, explain your decision

Page 4/12


---

<a id="page-5"></a>
**Page 5**

CS 162 Spring 2008 Midterm Exam        February 27, 2008

&emsp;b. (9 points) Another one of your project partners proposes the opposite – to<br>
&emsp;&emsp;implement semaphores using an unmodified Mesa-style Monitor class. Show a<br>
&emsp;&emsp;possible implementation of a Semaphore class using monitors. You should<br>
&emsp;&emsp;provide the initialize(value), P(), and V() operations.

Page 5/12


---

<a id="page-6"></a>
**Page 6**

CS 162 Spring 2008 Midterm Exam        February 27, 2008

&emsp;c. (8 points) Nested Monitors.<br>
&emsp;&emsp;i) (5 points) In this question, we’ll consider the effects of nesting two monitors,<br>
&emsp;&emsp;&emsp;M1 and M2:<br>
&emsp;&emsp;&emsp;&emsp;&emsp; Inside the code in Monitor M1 that manipulates M1’s state variables,<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;there is a procedure call into Monitor M2<br>
&emsp;&emsp;&emsp;&emsp;&emsp; M2 then waits on one of its condition variables (releasing the lock for<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Monitor M2).<br>
&emsp;&emsp;&emsp;Assuming that M2 does not call any other monitors, including M1, are there<br>
&emsp;&emsp;&emsp;any problems with nesting monitors in this manner? Use a simple example to<br>
&emsp;&emsp;&emsp;explain your answer.

&emsp;&emsp;ii) (3 points) Suppose that the wait in M2 also releases the lock for Monitor M1.<br>
&emsp;&emsp;&emsp;Does your answer for part (i) change or not? Briefly explain your answer.

Page 6/12


---

<a id="page-7"></a>
**Page 7**

CS 162 Spring 2008 Midterm Exam        February 27, 2008

3\. (17 points total) Concurrency problem: Dining Graduate Students.<br>
&emsp;The Dining Graduate Students problem is as follows. Six graduate students are seated<br>
&emsp;around a table with a large deep dish pizza in the middle. Graduate students are very<br>
&emsp;refined and so they eat pizza with forks and knives. But they don’t have a lot of<br>
&emsp;money, so they have the utensils. There are three forks and three knives in a pile next<br>
&emsp;to the pizza. Each student uses the following algorithm to eat:<br>
&emsp;&emsp;&emsp;(1) Pick up a knife<br>
&emsp;&emsp;&emsp;(2) Pick a fork<br>
&emsp;&emsp;&emsp;(3) Cut out a slice of pizza and eat it<br>
&emsp;&emsp;&emsp;(4) Return the knife and fork to the pile<br>
&emsp;a. (4 points) Specify the correctness constraints. Be succinct and explicit in your<br>
&emsp;&emsp;answer.

&emsp;b. (5 points) Can deadlock ever occur? Explain your answer in terms of the<br>
&emsp;&emsp;conditions for deadlock to occur. If deadlock could occur, describe a reasonable<br>
&emsp;&emsp;deadlock avoidance algorithm. If deadlock cannot occur, explain why not.

Page 7/12


---

<a id="page-8"></a>
**Page 8**

CS 162 Spring 2008 Midterm Exam        February 27, 2008

&emsp;c. (8 points) Implement the `Dine()` method using only semaphores (your solution<br>
&emsp;&emsp;may not use locks, monitors, or other synchronization primitives). Create a<br>
&emsp;&emsp;method `Dine()`, which waits until a student has fork and knife and can eat, then<br>
&emsp;&emsp;calls `Eat()`, and then releases the utensils before returning. Your solution should<br>
&emsp;&emsp;allow multiple students to eat at the same time (as long as there are sufficient<br>
&emsp;&emsp;utensils in a pile in the middle of the table). Assume you are given the variables,<br>
&emsp;&emsp;`forks` and `knifes`, which each starts off initialized to the total number of forks<br>
&emsp;&emsp;and knives available, respectively. Based on your answer from part 3.b, your<br>
&emsp;&emsp;solution should avoid deadlock.

Page 8/12


---

<a id="page-9"></a>
**Page 9**

CS 162 Spring 2008 Midterm Exam        February 27, 2008

4\. (27 points total) Operating Systems.<br>
&emsp;a.  (6 points) What are the two roles of an Operating System. For each role, briefly<br>
&emsp;&emsp;(one to two sentences) explain the role.<br>
&emsp;&emsp;i)

&emsp;&emsp;ii)

&emsp;b. (5 points) What private (thread-private) and public (shared between cooperating<br>
&emsp;&emsp;threads) resources are allocated when a thread is created? How do they differ<br>
&emsp;&emsp;from those allocated when a process is created?

&emsp;c. (10 points) Draw the life cycle of a thread and label all the transitions:

Page 9/12


---

<a id="page-10"></a>
**Page 10**

CS 162 Spring 2008 Midterm Exam        February 27, 2008

&emsp;d. (6 points) We discussed the Therac-25 in lecture and in an assigned reading.<br>
&emsp;&emsp;i) What is the Therac-25, and how does it differ from the Therac-20?

&emsp;&emsp;ii) Explain the Therac-25’s problems and the underlying causes.

Page 10/12


---

<a id="page-11"></a>
**Page 11**

CS 162 Spring 2008 Midterm Exam        February 27, 2008

&emsp;No Credit – **Problem X** (000000000000 points)<br>
**A 2007 Darwin Award Runner Up**<br>
&emsp;&emsp;“Named in honor of Charles Darwin, the father of evolution, the Darwin Awards<br>
&emsp;&emsp;commemorate those who improve our gene pool by accidentally removing<br>
&emsp;&emsp;themselves from it.” (http://www.darwinawards.com/)

The Laptop Still Works!<br>
\[Confirmed True\]<br>
(26 February 2007, California) 29-year-old Oscar was driving on Highway 99 near Yuba<br>
City, when his Honda Accord crossed into oncoming traffic and collided with a Hummer.<br>
The occupants of the Hummer were not seriously injured. California Highway Patrol<br>
officers found Oscar’s laptop still running, and plugged into the car’s cigarette lighter.<br>
Investigators believe that he was using it when his car crossed the center line.<br>
“Driving is not a time to be practicing your multitasking skills,” remarked CHP<br>
spokesman Tom Marshall.<br>
Oscar is not alone. Last year, 510 California drivers were charged with reckless driving<br>
because they were using a TV, video, or computer monitor. A 2001 CHP study cites cell<br>
phone use as the top cause of crashes involving distracted drivers, followed by fiddling<br>
with music. “Anything that distracts you can kill you, whether it’s eating lunch or<br>
working on a computer,” an AAA spokesman said.<br>
Oscar was a computer tutor. Hopefully his fatal lesson will teach others to surf on the<br>
information superhighway, not the asphalt superhighway.

Page 11/12


---

<a id="page-12"></a>
**Page 12**

CS 162 Spring 2008 Midterm Exam        February 27, 2008

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**This page intentionally left blank**

Page 12/12

