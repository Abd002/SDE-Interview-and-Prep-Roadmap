# Berkeley CS162 Spring 2004: Midterm 1: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;University of California, Berkeley<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;College of Engineering<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Computer Science Division – EECS<br>
Spring 2004                                     Anthony D. Joseph<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Midterm Exam**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;March 18, 2004<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS162 Operating Systems


![Figure on page 1](figures/questions-p01-fig01.png)

General Information:<br>
This is a **closed book and notes** examination. You have 120 minutes to answer as many<br>
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

CS 162 Spring 2004 Midterm Exam        March 18, 2004

1\. (17 points total) Short answer questions:<br>
&emsp;a. (12 points) True/False and Why?<br>
&emsp;&emsp;i) (4 points) Because of the overhead of context switching, programs that use<br>
&emsp;&emsp;&emsp;threads will always take longer to execute than programs that do not use<br>
&emsp;&emsp;&emsp;threads.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Why?

&emsp;&emsp;ii) (4 points) Protection and isolation between applications and between<br>
&emsp;&emsp;&emsp;applications and the operating system can be provided without hardware<br>
&emsp;&emsp;&emsp;support.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Why?

&emsp;&emsp;iii) (4 points) After a UNIX fork operation, the parent and new child process are<br>
&emsp;&emsp;&emsp;identical in all respects.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Why?

&emsp;b. (5 points) Consider a system with a mixture of I/O bound processes and CPU<br>
&emsp;&emsp;bound processes<br>
&emsp;&emsp;i) (3 points) Explain how this mixture of processes maximizes system utilization:

&emsp;&emsp;ii) (2 points) Explain why this combination is more important in batch systems<br>
&emsp;&emsp;&emsp;than it is on most computers sitting around in our department:

Page 2/10


---

<a id="page-3"></a>
**Page 3**

CS 162 Spring 2004 Midterm Exam        March 18, 2004

2\. (16 points total) CPU Scheduling.<br>
&emsp;a. (6 points) 5 identical jobs are run once on a non-preemptive scheduler, and then<br>
&emsp;&emsp;again on a preemptive scheduler using a round robin scheduling discipline. The<br>
&emsp;&emsp;jobs are purely computational - they do almost no I/O. On the non-preemptive<br>
&emsp;&emsp;scheduler it takes 24 hours for all 5 of them to complete; on the preemptive one it<br>
&emsp;&emsp;takes 24 hours and 2 minutes for all 5 of them. If the time quantum of the<br>
&emsp;&emsp;preemptive scheduler is 0.05 sec (50 milliseconds), how long does a context switch<br>
&emsp;&emsp;take? (Show **all** your work; it’s OK to leave the answer in symbolic / long form).

&emsp;b. (4 points) Name 2 things that need to be saved on a context switch.

&emsp;c. (6 points) Suppose that a scheduling algorithm (at the level of short-term CPU<br>
&emsp;&emsp;scheduling) favors those processes that have used the least processor time in the<br>
&emsp;&emsp;recent past. Why will this algorithm favor I/O-bound processes and yet not<br>
&emsp;&emsp;permanently starve CPU-bound processes?

Page 3/10


---

<a id="page-4"></a>
**Page 4**

CS 162 Spring 2004 Midterm Exam        March 18, 2004

No Credit – **Problem X** (000000000000 points)<br>
The following is an excerpt from The Washington Post's Style Invitational invitation to<br>
readers to: take any word from the dictionary, alter it by adding, subtracting, or<br>
changing one letter, and supply a new definition.<br>
Here are this year's winners:<br>
1\. Reintarnation: Coming back to life as a hillbilly.<br>
2\. Bozone (n.): The substance surrounding stupid people that stops bright ideas from<br>
penetrating. The bozone layer, unfortunately, shows little sign of breaking down in the<br>
near future.<br>
3\. Giraffiti: Vandalism spray-painted very, very high.<br>
4\. Sarchasm: The gulf between the author of sarcastic wit and the person who doesn’t get<br>
it.<br>
5\. Inoculatte: To take coffee intravenously when you are running late.<br>
6\. Hipatitis: Terminal coolness.<br>
7\. Osteopornosis: A degenerate disease. (This one got extra credit.)<br>
8\.  Karmageddon: It's like, when everybody is sending off all these really bad vibes,<br>
right? And then, like, the Earth explodes and it's like, wow, a serious bummer.<br>
9\. Decafalon (n.): The grueling event of getting through the day consuming only things<br>
&emsp;that are good for you.<br>
10\. Glibido: All talk and no action.<br>
11\. Dopeler effect: The tendency of stupid ideas to seem smarter when they come at you<br>
&emsp;rapidly.<br>
12\. Arachnoleptic fit (n.): The frantic dance performed just after you’ve accidentally<br>
&emsp;walked through a spider web.<br>
13\. Beelzebug (n.): Satan in the form of a mosquito that gets into your bedroom at three<br>
&emsp;in the morning and cannot be cast out.<br>
And the pick of the literature:<br>
14\. Caterpallor (n.): The color you turn after finding half a grub in the fruit you’re eating.

Page 4/10


---

<a id="page-5"></a>
**Page 5**

CS 162 Spring 2004 Midterm Exam        March 18, 2004

3\. (27 points total) Concurrency problem: Implementing Semaphores.<br>
&emsp;You are programming on a multiprocessor system using threads. The system includes<br>
&emsp;monitors and condition variables, with the following classes and methods:<br>
&emsp;public class Monitor {     public class ConditionVariable {<br>
&emsp;&emsp;&emsp;public Monitor() {    public ConditionVariable(Monitor mon) {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;/\* Creates a new monitor \*/    /\* Creates a condition variable<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;…    associated with monitor mon \*/<br>
&emsp;&emsp;&emsp;}    …<br>
&emsp;&emsp;&emsp;}<br>
&emsp;&emsp;&emsp;public void Enter() {    public void Wait() {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;/\* Enters the monitor \*/    /\* Blocks on the condition variable \*/<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;…    …<br>
&emsp;&emsp;&emsp;}    }<br>
&emsp;&emsp;&emsp;public void Notify() {<br>
&emsp;&emsp;&emsp;public void Exit() {    /\* Wakes up one thread waiting on<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;/\* Exits the monitor \*/    cv, if there is such a thread \*/<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;…    …<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;}    }<br>
&emsp;}    public void Broadcast() {<br>
&emsp;/\* Wakes up all threads waiting on cv,<br>
&emsp;if there are such threads \*/<br>
&emsp;…<br>
&emsp;}<br>
&emsp;}<br>
&emsp;Provide an implementation of general semaphores using this system. In other words,<br>
&emsp;write the file Semaphore.java, implementing the following methods:<br>
&emsp;&emsp;public class  Semaphore {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;public Semaphore(int initialValue) {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;/\* Create and return a semaphore with initial value: initialValue\*/<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;…<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;}<br>
&emsp;&emsp;&emsp;&emsp;&emsp;public P() {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;/\* Call P() on the semaphore \*/<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;…<br>
&emsp;&emsp;&emsp;&emsp;&emsp;}<br>
&emsp;&emsp;&emsp;&emsp;&emsp;public V() {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;/\* Call V() on the semaphore \*/<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;…<br>
&emsp;&emsp;&emsp;&emsp;&emsp;}<br>
&emsp;&emsp;}<br>
&emsp;Write your solution on the following page.

Page 5/10


---

<a id="page-6"></a>
**Page 6**

CS 162 Spring 2004 Midterm Exam        March 18, 2004

3\. (continued) Concurrency problem: Implementing Semaphores.<br>
&emsp;**Write your solution here:**<br>
&emsp;&emsp;public class Semaphore {

Page 6/10


---

<a id="page-7"></a>
**Page 7**

CS 162 Spring 2004 Midterm Exam        March 18, 2004

4\. (22 points) Deadlock:<br>
A restaurant would like to serve four dinner parties, P1 through P4. The restaurant has<br>
a total of 8 plates and 12 bowls. Assume that each group of diners will stop eating and<br>
wait for the waiter to bring a requested item (plate or bowl) to the table when it is<br>
required. Assume that the diners don't mind waiting. The maximum request and<br>
current allocation tables are shown as follows:


![Figure on page 7](figures/questions-p07-fig03.png)


![Figure on page 7](figures/questions-p07-fig04.png)

&emsp;&emsp;a. (4 points) Determine the Need Matrix for plates and bowls.


![Figure on page 7](figures/questions-p07-fig05.png)

&emsp;&emsp;b. (7 points) Will the restaurant be able to feed all four parties successfully?<br>
&emsp;&emsp;&emsp;Clearly explain your answer – specifically, why no or why/how there is a safe<br>
&emsp;&emsp;&emsp;serving order.

Page 7/10


---

<a id="page-8"></a>
**Page 8**

CS 162 Spring 2004 Midterm Exam        March 18, 2004

4\. (continued) Deadlock<br>
&emsp;&emsp;c. (11 points) Assume a new dinner party, P5, comes to the restaurant at this<br>
&emsp;&emsp;&emsp;time. Their maximum needs are 5 plates and 3 bowls. Initially, the waiter<br>
&emsp;&emsp;&emsp;brings 2 plates to them. In order to be able to feed all five parties successfully,<br>
&emsp;&emsp;&emsp;the restaurant needs more plates.<br>
&emsp;&emsp;&emsp;&emsp;i.    (2 points) Determine the new Need Matrix for plates and bowls.


![Figure on page 8](figures/questions-p08-fig06.png)

&emsp;&emsp;&emsp;ii.    (6 points) At least how many plates would the restaurant need to add?

&emsp;&emsp;&emsp;iii.    (3 points) Show a safe serving sequence.

Page 8/10


---

<a id="page-9"></a>
**Page 9**

CS 162 Spring 2004 Midterm Exam        March 18, 2004

5\. (18 points) Paging:<br>
&emsp;Suppose you have a system with 32-bit pointers and 4 megabytes of physical memory<br>
&emsp;that is partitioned into 8192-byte pages. The system uses an Inverted Page Table<br>
&emsp;(IPT). Assume that there is no page sharing between processes.<br>
&emsp;a.  (8 points) Describe what page table entries should look like. Specifically, how<br>
&emsp;&emsp;many bits should be in each page table entry, and what are they for? Also, how<br>
&emsp;&emsp;many page table entries should there be in the page table?

&emsp;b. (5 points) Describe how an IPT is used to translate a virtual address into a<br>
&emsp;&emsp;physical address.

&emsp;c. (3 points) How can you make an IPT more efficient? Explain your solution and<br>
&emsp;&emsp;how it works in detail.

&emsp;d. (2 points) What effect, if any, does your solution in part (c) have on what happens<br>
&emsp;&emsp;on a context switch?

Page 9/10


---

<a id="page-10"></a>
**Page 10**

CS 162 Spring 2004 Midterm Exam        March 18, 2004

This page intentionally left blank as scratch space.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Do not write answers on this page**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Do not write answers on this page**

Page 10/10

