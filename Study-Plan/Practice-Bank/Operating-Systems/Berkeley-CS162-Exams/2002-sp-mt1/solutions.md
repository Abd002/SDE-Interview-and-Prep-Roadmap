# Berkeley CS162 Spring 2002: Midterm 1: Official solutions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;University of California, Berkeley<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;College of Engineering<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Computer Science Division – EECS<br>
Spring 2002                                     Anthony D. Joseph<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Midterm Exam Solutions**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;March 13, 2002<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS162 Operating Systems


![Figure on page 1](figures/solutions-p01-fig01.png)

General Information:<br>
This is a **closed book and notes** examination. You have ninety minutes to answer as many<br>
questions as possible.  The number in parentheses at the beginning of each question indicates the<br>
number of points given to the question; there are 100 points in all. You should read **all** of the<br>
questions before starting the exam, as some of the questions are substantially more time<br>
consuming.<br>
Write all of your answers directly on this paper.  **Make your answers as concise as possible.** If there<br>
is something in a question that you believe is open to interpretation, then please ask us about it!<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Good Luck!!**


![Figure on page 1](figures/solutions-p01-fig02.png)

Page 1/10


---

<a id="page-2"></a>
**Page 2**

CS 162 Spring 2002 Midterm Exam        March 13, 2002<br>
Solutions<br>
1\. (20 points total) Short answer questions:<br>
&emsp;a. (8 points) What are the two main functions of an operating system?<br>
&emsp;&emsp;i)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;(a) Coordinator and traffic cop: Resource allocation and control.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;(b) Standard services.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;4 points for each. 2 points for partial answers.

&emsp;&emsp;ii)

&emsp;b. (12 points) Which of the following instructions should be allowed only in kernel<br>
&emsp;&emsp;mode? State whether it is or not (circle one) **and** why.<br>
&emsp;&emsp;i) Disable all interrupts.<br>
&emsp;&emsp;&emsp;**Kernel**                            **Kernel and User**<br>
&emsp;&emsp;&emsp;Why?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Kernel only, otherwise a user could take control of the machine.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;2 points for each answer and 2 points for reason.

&emsp;&emsp;ii) Read the time-of-day clock.<br>
&emsp;&emsp;&emsp;**Kernel**                            **Kernel and User**<br>
&emsp;&emsp;&emsp;Why?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Kernel and User, doesn’t affect anything because the operation is read-<br>
&emsp;&emsp;&emsp;&emsp;&emsp;only. We deducted 2 points if the answer did not mention the read-only<br>
&emsp;&emsp;&emsp;&emsp;&emsp;nature of the operation

&emsp;&emsp;iii) Set the time-of-day clock.<br>
&emsp;&emsp;&emsp;**Kernel**                            **Kernel and User**<br>
&emsp;&emsp;&emsp;Why?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Kernel only, could affect scheduling, other processes, and the kernel.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Several students mentioned changing their machine’s timezone, however,<br>
&emsp;&emsp;&emsp;&emsp;&emsp;the access should still be allowed only in the kernel and use a system call.

Page 2/10


---

<a id="page-3"></a>
**Page 3**

CS 162 Spring 2002 Midterm Exam        March 13, 2002<br>
Solutions

2\. (33 points total) CPU Scheduling.<br>
&emsp;a. (5 points) The CDC 6600 computers could handle up to 10 I/O processes<br>
&emsp;&emsp;simultaneously on a single CPU using an interesting form of round-robin<br>
&emsp;&emsp;scheduling called **processor sharing**. A context switch occurred after each<br>
&emsp;&emsp;instruction, so instruction 1 came from process 1, instruction 2 came from process<br>
&emsp;&emsp;2, etc. The context switching was done by special hardware, and the overhead was<br>
&emsp;&emsp;zero. If a process needed T seconds to complete in the absence of competition,<br>
&emsp;&emsp;what is the maximum amount of time it would need if processor sharing were<br>
&emsp;&emsp;used with N processes? Assume there are less than 10 processes waiting to run.

&emsp;&emsp;It will need NT seconds.<br>
&emsp;&emsp;Common minor errors (-2 points) included (N-1)T, and anything else that only<br>
&emsp;&emsp;changed the answer by a constant factor. All other values were given 0 points.

&emsp;b. (20 points) Five batch jobs A through E, arrive at a computer center at almost the<br>
&emsp;&emsp;same time. They have estimated running times of A:10, B:6, C:2, D:4, and E:8<br>
&emsp;&emsp;minutes. Their (externally determined) priorities are A:3, B:5, C:2, D:1, and E:4,<br>
&emsp;&emsp;respectively, with 5 being the highest priority. For each of the following<br>
&emsp;&emsp;scheduling algorithms, determine the mean process turnaround time (average<br>
&emsp;&emsp;response time). Ignore context switching overhead. **For partial credit, you**<br>
&emsp;&emsp;**should list the finishing times.**<br>
&emsp;&emsp;i) Round-Robin (the timeslice size is not important, so assume a timeslice of 1<br>
&emsp;&emsp;&emsp;millisecond).<br>
&emsp;&emsp;&emsp;During the first 10 minutes, each job gets 1/5 of the CPU. At the end of 10<br>
&emsp;&emsp;&emsp;minutes, C finishes. During the next 8 minutes, each job gets 1/4 of the CPU,<br>
&emsp;&emsp;&emsp;after which time D finishes. Then each of the three remaining jobs gets 1/3 of<br>
&emsp;&emsp;&emsp;the CPU for 6 minutes, until B finishes, and so on. The finishing times for the<br>
&emsp;&emsp;&emsp;five jobs are 10, 18, 24, 28, and 30, for an average of 22 minutes.<br>
&emsp;&emsp;&emsp;There were many varieties of incorrect answers for this one. The most<br>
&emsp;&emsp;&emsp;common mistake was to compute the TAT for round-robin with a time slice of<br>
&emsp;&emsp;&emsp;1 minute, instead of 1 millisecond. This resulted in 3 incorrect finishing times,<br>
&emsp;&emsp;&emsp;so 2 points of partial credit were awarded.<br>
&emsp;&emsp;&emsp;General part (b) grading info: If mean turnaround time was incorrect, 1 point<br>
&emsp;&emsp;&emsp;of partial credit was awarded for each correct finishing time, up to a total of 4<br>
&emsp;&emsp;&emsp;points (-1 for incorrect TAT).<br>
&emsp;&emsp;&emsp;-1 point for grievous arithmetic errors.<br>
&emsp;&emsp;&emsp;-1 point per section if all finishing times were off by 1.<br>
&emsp;&emsp;ii) Priority scheduling.<br>
&emsp;&emsp;&emsp;B is run first. After 6 minutes, it is finished. The other jobs finish at 14, 24, 26,<br>
&emsp;&emsp;&emsp;and 30, for an average of 20 minutes.

Page 3/10


---

<a id="page-4"></a>
**Page 4**

CS 162 Spring 2002 Midterm Exam        March 13, 2002<br>
Solutions

&emsp;&emsp;iii) First-come, First-served (run in order 10, 6, 2, 4, 8).<br>
&emsp;&emsp;&emsp;If the jobs run in the order A through E, they finish at 10, 16, 18, 22, and 30,<br>
&emsp;&emsp;&emsp;for an average of 19.2 minutes.

&emsp;&emsp;iv) Shortest Job First.<br>
&emsp;&emsp;&emsp;Finish times are 2, 6, 12, 20, and 30, for an average of 14 minutes.

&emsp;c. (8 points) Five jobs are waiting to be run. Their expected running times are 9, 6, 3,<br>
&emsp;&emsp;5, and X. In what order should they be run to minimize average response time?<br>
&emsp;&emsp;State the scheduling algorithm that should be used AND the order in which the<br>
&emsp;&emsp;jobs should be run.  (Your answer will depend on X).<br>
&emsp;&emsp;&emsp;Shortest job first is the way to minimize average response time (we also<br>
&emsp;&emsp;&emsp;accepted Shorted Remaining Time to Completion First).<br>
&emsp;&emsp;&emsp;0 \< X \<= 3: X, 3, 5, 6, 9.<br>
&emsp;&emsp;&emsp;3 \< X \<= 5: 3, X, 5, 6, 9.<br>
&emsp;&emsp;&emsp;5 \< X \<= 6: 3, 5, X, 6, 9.<br>
&emsp;&emsp;&emsp;6 \< X \<= 9: 3, 5, 6, X, 9.<br>
&emsp;&emsp;&emsp;X\> 9: X, 3, 5, 6, 9, X.<br>
&emsp;&emsp;&emsp;3 points for correct scheduling algorithm.<br>
&emsp;&emsp;&emsp;1 points for each correct range.<br>
&emsp;&emsp;&emsp;For the job orderings, accepted both an explicit list of the possible orderings,<br>
&emsp;&emsp;&emsp;as well as a general description of where to put X.<br>
&emsp;&emsp;&emsp;-1 point for descriptions that were judged too vague.<br>
&emsp;&emsp;&emsp;-1 point for each ordering omitted. This included not placing X between 5 and<br>
&emsp;&emsp;&emsp;6, since we don't specify that the running times must be integer values.<br>
&emsp;&emsp;&emsp;Answers stating that the scheduling algorithm used would change based on<br>
&emsp;&emsp;&emsp;the value of X were graded on a case-by-case basis. In general, if a solution<br>
&emsp;&emsp;&emsp;mentioned SJF, it received 2 points. Otherwise, 0 points were awarded.

Page 4/10


---

<a id="page-5"></a>
**Page 5**

CS 162 Spring 2002 Midterm Exam        March 13, 2002<br>
Solutions<br>
**No Credit – Problem X: (000000000000 points)**

The following is an excerpt from a Wall Street Journal article:<br>
1\. A man called the Canon help desk with a problem with his printer.  The tech asked him<br>
&emsp;if he was running it under “Windows.” The man responded, “No, my desk is next to<br>
&emsp;the door. But that is a good point. The woman sitting in the cubicle next to me is<br>
&emsp;under a window and her printer is working fine.”<br>
2\. An AST customer was asked to send a copy of her defective diskettes. A few days later<br>
&emsp;a letter arrived from the customer along with photocopies of the floppies.<br>
3\. A Dell customer called to say he couldn't get his computer to fax anything. After 40<br>
&emsp;minutes of troubleshooting, the technician discovered the man was trying to fax a<br>
&emsp;piece of paper by holding it in front of the monitor screen and hitting the “send” key.<br>
4\. A Dell technician received a call from a customer who was enraged because his<br>
&emsp;computer had told him he was “bad and an invalid.” The tech explained that the<br>
&emsp;computer's “bad command” and “invalid” response's shouldn't be taken personally.<br>
5\. A confused caller to IBM was having troubles printing documents. He told the<br>
&emsp;technician that the computer had said it “couldn’t find printer.”  The user had also<br>
&emsp;tried turning the computer screen to face the printer but that his computer still<br>
&emsp;couldn’t “see” the printer.<br>
6\. An exasperated caller to Dell Computer Tech Support couldn't get her new Dell<br>
&emsp;Computer to turn on. After ensuring the computer was plugged in, the technician<br>
&emsp;asked her what happened when she pushed the power button. Her response, “I pushed<br>
&emsp;and pushed on this foot pedal and nothing happens.” The “foot pedal” turned out to be<br>
&emsp;the computer's mouse.<br>
7\. Another customer called Compaq tech support to say his brand-new computer<br>
&emsp;wouldn’t work. He said he unpacked the unit, plugged it in and sat there for 20<br>
&emsp;minutes waiting for something to happen. When asked what happened when he<br>
&emsp;pressed the power switch, he asked, “What power switch?”<br>
8\. True story from a Novell NetWire Sysop:<br>
&emsp;Tech: “Hello, this Tech Support. How may I help you?”<br>
&emsp;Caller: “The cup holder on my PC is broken and I am within my warranty period.<br>
&emsp;&emsp;&emsp;How do I go about getting that fixed?”<br>
&emsp;Tech: “I’m sorry, but did you say a cup holder?”<br>
&emsp;Caller: “Yes, it’s attached to the front of my computer.”<br>
&emsp;Tech: “Please excuse me. If I seem a bit stumped, it’s because I am. Did you receive<br>
&emsp;&emsp;&emsp;this as part of a promotional at a trade show? How did you get this cup<br>
&emsp;&emsp;&emsp;holder? Does it have any trademark on it?”<br>
&emsp;Caller: It came with my computer. I don’t know anything about a promotional. It just<br>
&emsp;&emsp;&emsp;has ‘4X’ on it.”<br>
&emsp;At this point, the Tech Rep had to mute the caller because he couldn’t stand it. He<br>
&emsp;&emsp;&emsp;was laughing too hard. The caller had been using the load drawer of the CD-<br>
&emsp;&emsp;&emsp;ROM drive as a cup holder and snapped it off the drive.

Page 5/10


---

<a id="page-6"></a>
**Page 6**

CS 162 Spring 2002 Midterm Exam        March 13, 2002<br>
Solutions

3\. (24 points total) Concurrency problem: Dining Philosophers.<br>
&emsp;The goal of this exercise is to implement a solution to the Dining Philosophers<br>
&emsp;problem using monitors instead of semaphores. Create a method `Dine()`, which<br>
&emsp;waits until a diner has two chopsticks and can eat, then calls `Eat()`, and then releases<br>
&emsp;the chopsticks before returning. Your solution should allow multiple philosophers to<br>
&emsp;eat at the same time (as long as there are sufficient chopsticks in a pile in the middle<br>
&emsp;of the table).<br>
&emsp;a. (4 points) Specify the correctness constraints. Be succinct and explicit in your<br>
&emsp;&emsp;answer.<br>
&emsp;&emsp;1\) A diner waits for two chopsticks.<br>
&emsp;&emsp;2\) Only one thread accesses shared state at a time<br>
&emsp;&emsp;2 points for each correct constraint.

&emsp;b. (20 points) Implement the `Dine()` method. Specify any state variables that you<br>
&emsp;&emsp;use:<br>
&emsp;`State variables:`<br>
&emsp;`chopsticks`    `Number of chopsticks left`    `Initial value N`<br>
&emsp;`Monitor: waitingP`<br>
&emsp;`Lock: lock`<br>
&emsp;`Dine() {`<br>
&emsp;`lock.acquire();`<br>
&emsp;`while (chopsticks < 2) {`<br>
&emsp;`waitingP.wait()`<br>
&emsp;`}`<br>
&emsp;`chopsticks -= 2;`<br>
&emsp;`lock.release();`<br>
&emsp;`Eat();`<br>
&emsp;`lock.acquire();`<br>
&emsp;`chopsticks +=2;`<br>
&emsp;`waitingP.broadcast(); or signal`<br>
&emsp;`lock.release();`<br>
&emsp;`}`

Page 6/10


---

<a id="page-7"></a>
**Page 7**

CS 162 Spring 2002 Midterm Exam        March 13, 2002<br>
Solutions<br>
This page intentionally left blank as scratch space.<br>
We gave zero credit for solutions based on semaphores or that did not use condition<br>
variables.<br>
We subtracted points for various mistakes as follows:<br>
&emsp;-3 points for unnecessary wait operations<br>
&emsp;-2 points for not releasing the lock<br>
&emsp;-8 points for code that may deadlock<br>
&emsp;-2 points for unreachable code<br>
&emsp;-4 points for too many copies of the same code<br>
&emsp;-5 points for busy waiting<br>
&emsp;-4 points for unclear usage of state variables<br>
&emsp;-6 points for not using chopsticks<br>
&emsp;-5 points for using chopsticks outside a lock<br>
&emsp;-2 points for holding the lock in Eat()<br>
&emsp;-3 points for incorrect while<br>
&emsp;-2 points for grabbing or releasing chopsticks<br>
&emsp;-2 points for signaling more than once<br>
&emsp;-3 points for signaling or waiting without holding lock<br>
&emsp;-5 points for no call to Eat()<br>
&emsp;-2 points for no signal<br>
&emsp;-3 points for signaling at the wrong time<br>
&emsp;-3 points for unnecessary lock.acquire() calls<br>
&emsp;-3 points for infinite loops<br>
&emsp;-4 points for mis-matched lock.acquire()<br>
&emsp;s<br>
&emsp;each answer and 2 points for reason. of two reasons.

Page 7/10


---

<a id="page-8"></a>
**Page 8**

CS 162 Spring 2002 Midterm Exam        March 13, 2002<br>
Solutions

4\. (10 points) Deadlock:<br>
Consider a system that starts with a total of 150 units of memory, which is then allocated<br>
to three processes as shown in the following table of processes, their maximum resource<br>
requirements, and their current allocations:


![Figure on page 8](figures/solutions-p08-fig03.png)

Determine whether it would be safe to grant each of the following requests. If YES, give<br>
an execution order that could be guaranteed possible. If NO, show the resulting allocation<br>
table.<br>
a. (5 points) A fourth process arrives, with a maximum memory need of 60 and an<br>
&emsp;initial request for 25 units.<br>
&emsp;YES, safe. 25 units will be left after the allocation for P4, so there is sufficient<br>
&emsp;memory to guarantee the termination of either P1 or P2. After that, the remaining<br>
&emsp;three jobs can be completed in any order.<br>
&emsp;2 points for correct answer, 3 points for correct logic and order

b. (5 points) Using the original table above, a fourth process arrives, with a maximum<br>
&emsp;memory need of 60 and an initial request for 35 units.<br>
&emsp;NO, unsafe. 15 units will be left after the allocation for P4, so there is insufficient<br>
&emsp;memory to guarantee the termination of any process.<br>
&emsp;2 points for correct answer, 3 points for correct logic.<br>
&emsp;For logic, we accepted the resulting allocation table AND saying that the available<br>
&emsp;resource is 15 or another CLEAR logical explanation.<br>
&emsp;-1 point if the table is present, but explanation is missing or available resources = 15<br>
&emsp;statement is missing.

Page 8/10


---

<a id="page-9"></a>
**Page 9**

CS 162 Spring 2002 Midterm Exam        March 13, 2002<br>
Solutions<br>
5\.  (13 points) Deadlock:<br>
a. (6 points) Three processes share four resource units that can be reserved and released<br>
&emsp;only one at a time. Each process needs a maximum of two units. Show that a<br>
&emsp;deadlock cannot occur.<br>
&emsp;Deadlock occurs if all resource units are reserved while one or more processes are<br>
&emsp;waiting indefinitely for more units. But, if all four units are reserved, at least one<br>
&emsp;process has acquired two units. Therefore that process will be able to complete its<br>
&emsp;work and release both units, thus enabling another process to continue.

b. (7 points) Evaluate the Banker’s algorithm for its usefulness in real life. Give at least<br>
&emsp;two reasons to justify your choice.<br>
&emsp;It is unrealistic: don’t know max demands in advance, number of processes can<br>
&emsp;change over time, number of resources can change over time (something can break).<br>
&emsp;Most OS’s ignore deadlock.<br>
&emsp;3 points for correct answer<br>
&emsp;2 points for each reason

Page 9/10


---

<a id="page-10"></a>
**Page 10**

CS 162 Spring 2002 Midterm Exam        March 13, 2002<br>
Solutions<br>
This page intentionally left blank as scratch space.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Do not write answers on this page**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Do not write answers on this page**

Page 10/10

