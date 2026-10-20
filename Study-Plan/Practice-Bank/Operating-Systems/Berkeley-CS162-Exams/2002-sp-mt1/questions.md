# Berkeley CS162 Spring 2002: Midterm 1: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;University of California, Berkeley<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;College of Engineering<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Computer Science Division – EECS<br>
Spring 2002                                     Anthony D. Joseph<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Midterm Exam**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;March 13, 2002<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS162 Operating Systems


![Figure on page 1](figures/questions-p01-fig01.png)

General Information:<br>
This is a **closed book and notes** examination. You have ninety minutes to answer as many<br>
questions as possible.  The number in parentheses at the beginning of each question indicates the<br>
number of points given to the question; there are 100 points in all. You should read **all** of the<br>
questions before starting the exam, as some of the questions are substantially more time<br>
consuming.<br>
Write all of your answers directly on this paper.  **Make your answers as concise as possible.** If there<br>
is something in a question that you believe is open to interpretation, then please ask us about it!<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Good Luck!!**


![Figure on page 1](figures/questions-p01-fig02.png)

Page 1/10


---

<a id="page-2"></a>
**Page 2**

CS 162 Spring 2002 Midterm Exam        March 13, 2002

1\. (20 points total) Short answer questions:<br>
&emsp;a. (8 points) What are the two main functions of an operating system?<br>
&emsp;&emsp;i)

&emsp;&emsp;ii)

&emsp;b. (12 points) Which of the following instructions should be allowed only in kernel<br>
&emsp;&emsp;mode? State whether it is or not (circle one) **and** why.<br>
&emsp;&emsp;i) Disable all interrupts.<br>
&emsp;&emsp;&emsp;**Kernel**                            **Kernel and User**<br>
&emsp;&emsp;&emsp;Why?

&emsp;&emsp;ii) Read the time-of-day clock.<br>
&emsp;&emsp;&emsp;**Kernel**                            **Kernel and User**<br>
&emsp;&emsp;&emsp;Why?

&emsp;&emsp;iii) Set the time-of-day clock.<br>
&emsp;&emsp;&emsp;**Kernel**                            **Kernel and User**<br>
&emsp;&emsp;&emsp;Why?

Page 2/10


---

<a id="page-3"></a>
**Page 3**

CS 162 Spring 2002 Midterm Exam        March 13, 2002

2\. (33 points total) CPU Scheduling.<br>
&emsp;a. (5 points) The CDC 6600 computers could handle up to 10 I/O processes<br>
&emsp;&emsp;simultaneously on a single CPU using an interesting form of round-robin<br>
&emsp;&emsp;scheduling called **processor sharing**. A context switch occurred after each<br>
&emsp;&emsp;instruction, so instruction 1 came from process 1, instruction 2 came from process<br>
&emsp;&emsp;2, etc. The context switching was done by special hardware, and the overhead was<br>
&emsp;&emsp;zero. If a process needed T seconds to complete in the absence of competition,<br>
&emsp;&emsp;what is the maximum amount of time it would need if processor sharing were<br>
&emsp;&emsp;used with N processes? Assume there are less than 10 processes waiting to run.

&emsp;b. (20 points) Five batch jobs A through E, arrive at a computer center at almost the<br>
&emsp;&emsp;same time. They have estimated running times of A:10, B:6, C:2, D:4, and E:8<br>
&emsp;&emsp;minutes. Their (externally determined) priorities are A:3, B:5, C:2, D:1, and E:4,<br>
&emsp;&emsp;respectively, with 5 being the highest priority. For each of the following<br>
&emsp;&emsp;scheduling algorithms, determine the mean process turnaround time (average<br>
&emsp;&emsp;response time). Ignore context switching overhead. **For partial credit, you**<br>
&emsp;&emsp;**should list the finishing times.**<br>
&emsp;&emsp;i) Round-Robin (the timeslice size is not important, so assume a timeslice of 1<br>
&emsp;&emsp;&emsp;millisecond).

&emsp;&emsp;ii) Priority scheduling.

Page 3/10


---

<a id="page-4"></a>
**Page 4**

CS 162 Spring 2002 Midterm Exam        March 13, 2002

&emsp;&emsp;iii) First-come, First-served (run in order 10, 6, 2, 4, 8).

&emsp;&emsp;iv) Shortest Job First.

&emsp;c. (8 points) Five jobs are waiting to be run. Their expected running times are 9, 6, 3,<br>
&emsp;&emsp;5, and X. In what order should they be run to minimize average response time?<br>
&emsp;&emsp;State the scheduling algorithm that should be used AND the order in which the<br>
&emsp;&emsp;jobs should be run.  (Your answer will depend on X).

Page 4/10


---

<a id="page-5"></a>
**Page 5**

CS 162 Spring 2002 Midterm Exam        March 13, 2002

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

CS 162 Spring 2002 Midterm Exam        March 13, 2002

3\. (24 points total) Concurrency problem: Dining Philosophers.<br>
&emsp;The goal of this exercise is to implement a solution to the Dining Philosophers<br>
&emsp;problem using monitors instead of semaphores. Create a method `Dine()`, which<br>
&emsp;waits until a diner has two chopsticks and can eat, then calls `Eat()`, and then releases<br>
&emsp;the chopsticks before returning. Your solution should allow multiple philosophers to<br>
&emsp;eat at the same time (as long as there are sufficient chopsticks in a pile in the middle<br>
&emsp;of the table).<br>
&emsp;a. (4 points) Specify the correctness constraints. Be succinct and explicit in your<br>
&emsp;&emsp;answer.

&emsp;b. (20 points) Implement the `Dine()` method. Specify any state variables that you<br>
&emsp;&emsp;use:

Page 6/10


---

<a id="page-7"></a>
**Page 7**

CS 162 Spring 2002 Midterm Exam        March 13, 2002

This page intentionally left blank as scratch space.

Page 7/10


---

<a id="page-8"></a>
**Page 8**

CS 162 Spring 2002 Midterm Exam        March 13, 2002

4\. (10 points) Deadlock:<br>
Consider a system that starts with a total of 150 units of memory, which is then allocated<br>
to three processes as shown in the following table of processes, their maximum resource<br>
requirements, and their current allocations:


![Figure on page 8](figures/questions-p08-fig03.png)

Determine whether it would be safe to grant each of the following requests. If YES, give<br>
an execution order that could be guaranteed possible. If NO, show the resulting allocation<br>
table.<br>
a. (5 points) A fourth process arrives, with a maximum memory need of 60 and an<br>
&emsp;initial request for 25 units.

b. (5 points) Using the original table above, a fourth process arrives, with a maximum<br>
&emsp;memory need of 60 and an initial request for 35 units.

Page 8/10


---

<a id="page-9"></a>
**Page 9**

CS 162 Spring 2002 Midterm Exam        March 13, 2002

5\.  (13 points) Deadlock:<br>
a. (6 points) Three processes share four resource units that can be reserved and released<br>
&emsp;only one at a time. Each process needs a maximum of two units. Show that a<br>
&emsp;deadlock cannot occur.

b. (7 points) Evaluate the Banker’s algorithm for its usefulness in real life. Give at least<br>
&emsp;two reasons to justify your choice.

Page 9/10


---

<a id="page-10"></a>
**Page 10**

CS 162 Spring 2002 Midterm Exam        March 13, 2002

This page intentionally left blank as scratch space.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Do not write answers on this page**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Do not write answers on this page**

Page 10/10

