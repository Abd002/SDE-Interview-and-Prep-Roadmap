# Berkeley CS162 Spring 2008: Midterm 1: Official solutions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;University of California, Berkeley<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;College of Engineering<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Computer Science Division – EECS<br>
Spring 2008                                     Anthony D. Joseph<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Midterm Exam Solutions**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;February 27, 2008<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS162 Operating Systems


![Figure on page 1](figures/solutions-p01-fig01.png)

General Information:<br>
This is a **closed book and notes** examination. You have 90 minutes to answer as many questions<br>
as possible.  The number in parentheses at the beginning of each question indicates the number of<br>
points given to the question; there are 100 points in all. You should read **all** of the questions<br>
before starting the exam, as some of the questions are substantially more time consuming.<br>
Write all of your answers directly on this paper.  **Make your answers as concise as possible.** If there<br>
is something in a question that you believe is open to interpretation, then please ask us about it!<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Good Luck!!**


![Figure on page 1](figures/solutions-p01-fig02.png)

Page 1/18


---

<a id="page-2"></a>
**Page 2**

CS 162 Spring 2008 Midterm Exam        February 27, 2008<br>
Solutions

1\. (33 points total) Short answer questions:<br>
&emsp;a. (4 points) True/False and Why?<br>
&emsp;&emsp;In the operating system environments that we’ve studied so far, an application<br>
&emsp;&emsp;programmer has to worry about deadlock occurring involving the CPU as a<br>
&emsp;&emsp;resource.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Why?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**FALSE**. The CPU is easily preempted which eliminates one of the four<br>
&emsp;&emsp;&emsp;&emsp;&emsp;preconditions for deadlock. The correct answer was worth 2 pts and a<br>
&emsp;&emsp;&emsp;&emsp;&emsp;reasonable explanation that mentioned the OS preempting the CPU was 2<br>
&emsp;&emsp;&emsp;&emsp;&emsp;pts. Some students incorrectly said there was no waiting while holding the<br>
&emsp;&emsp;&emsp;&emsp;&emsp;CPU, but a program could busy wait to create a deadlock.

&emsp;b. (4 points) True/False and Why?<br>
&emsp;&emsp;In the operating system environments that we’ve studied so far (i.e., no virtual<br>
&emsp;&emsp;memory), the operating system has to worry about deadlock occurring involving<br>
&emsp;&emsp;physical memory as a resource.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Why?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**TRUE**. Physical memory cannot be preempted. Some students mistakenly<br>
&emsp;&emsp;&emsp;&emsp;&emsp;thought that the resource in question was a lock in memory, instead of<br>
&emsp;&emsp;&emsp;&emsp;&emsp;simply chunks of memory necessary for process execution. We gave full<br>
&emsp;&emsp;&emsp;&emsp;&emsp;credit for False answers that said as their justification that OSs we’ve<br>
&emsp;&emsp;&emsp;&emsp;&emsp;studied do not worry about deadlock and it is the application<br>
&emsp;&emsp;&emsp;&emsp;&emsp;programmers responsibility.

Page 2/18


---

<a id="page-3"></a>
**Page 3**

CS 162 Spring 2008 Midterm Exam        February 27, 2008<br>
Solutions<br>
&emsp;c.  (5 points) Disabling interrupts:<br>
&emsp;&emsp;i) (3 points) Give a two to three sentence description of how interrupts can be<br>
&emsp;&emsp;&emsp;used to implement critical sections.<br>
&emsp;&emsp;&emsp;Disabling interrupts prevents interrupts from involuntarily preempting the<br>
&emsp;&emsp;&emsp;current thread (2 pts). If the thread does not voluntarily give up control, it can<br>
&emsp;&emsp;&emsp;run the critical section to completion without interference (1 pt).<br>
&emsp;&emsp;&emsp;We only gave 1 pt for this problem if the answer described how the<br>
&emsp;&emsp;&emsp;implementation works with little other explanation about the effects of<br>
&emsp;&emsp;&emsp;disabling interrupts.

&emsp;&emsp;ii) (2 points) Briefly (2-3 sentences) state the problems with implementing critical<br>
&emsp;&emsp;&emsp;sections using disabling of interrupts.<br>
&emsp;&emsp;&emsp;We gave 2 pts for answers that mentioned any of the following – disabling<br>
&emsp;&emsp;&emsp;interrupts doesn’t work on a multiprocessor can’t be used by user-level<br>
&emsp;&emsp;&emsp;applications, could allow infinite loops, arbitrarily delay other processes, may<br>
&emsp;&emsp;&emsp;cause real-time systems to fail, and may cause interrupt buffer overflow.<br>
&emsp;&emsp;&emsp;We only gave 1 pt for answers that mentioned lesser issues – may lead to<br>
&emsp;&emsp;&emsp;unfair processor allocations, may cause other processes to wait a while,<br>
&emsp;&emsp;&emsp;disabling interrupts for a while is bad, and other issues that were either less<br>
&emsp;&emsp;&emsp;realistic or less well defined.

Page 3/18


---

<a id="page-4"></a>
**Page 4**

CS 162 Spring 2008 Midterm Exam        February 27, 2008<br>
Solutions

&emsp;d. (8 points) List the four requirements for deadlock.<br>
&emsp;&emsp;&emsp;Mutual exclusion, non-preemptable resources, hold and wait, circular chain<br>
&emsp;&emsp;&emsp;of waiting.<br>
&emsp;&emsp;&emsp;Each requirement was worth 2 points.

&emsp;e. (4 points) Briefly explain why when using a Hoare semantic monitors it is<br>
&emsp;&emsp;sufficient to use “if” statements when checking state variables, while most OS<br>
&emsp;&emsp;monitor implementations require the use of “while” statements.<br>
&emsp;&emsp;&emsp;With Hoare semantic monitors, the signaled thread is guaranteed to receive<br>
&emsp;&emsp;&emsp;the lock and control immediately, thus the recipient is guaranteed to be able<br>
&emsp;&emsp;&emsp;to proceed. Most OS monitor implementations only place the signaled thread<br>
&emsp;&emsp;&emsp;on the ready queue; thus, other threads may run (and access the critical<br>
&emsp;&emsp;&emsp;section) between the time that the thread is signaled and when it actually runs.<br>
&emsp;&emsp;&emsp;We deducted 1 pt for only saying something about Hoare and not comparing<br>
&emsp;&emsp;&emsp;to Mesa/OS monitors, or not emphasizing that another thread can change the<br>
&emsp;&emsp;&emsp;synchronization condition the initial thread slept on. If the answer was vague<br>
&emsp;&emsp;&emsp;and didn’t imply an understanding of the IfWhile issue, and was just a<br>
&emsp;&emsp;&emsp;definition of a Hoare monitor, then it we deducted 2 pts. Extraneous, vague,<br>
&emsp;&emsp;&emsp;or off-topic answers resulted in another 1 pt deduction.

Page 4/18


---

<a id="page-5"></a>
**Page 5**

CS 162 Spring 2008 Midterm Exam        February 27, 2008<br>
Solutions<br>
&emsp;f. (8 points) In lecture, we discussed using atomic instructions (e.g., test-and-set and<br>
&emsp;&emsp;swap) to implement spinlocks. With spinlocks, threads spin in a loop (busy<br>
&emsp;&emsp;waiting) until the lock is freed. We motivated the use of blocking locks and<br>
&emsp;&emsp;semaphores as an improvement over spinlocks because having threads spin can be<br>
&emsp;&emsp;very inefficient in terms of processor utilization. However, spinlocks are not<br>
&emsp;&emsp;always less efficient than blocking locks. In two to three sentences, briefly<br>
&emsp;&emsp;describe a scenario where spinlocks would be more efficient than blocking locks.<br>
&emsp;&emsp;&emsp;Spinlocks are more efficient when the critical sections are very short (e.g., one<br>
&emsp;&emsp;&emsp;or a few instructions that increment a shared variable), or when the critical<br>
&emsp;&emsp;&emsp;section is rarely contested (i.e., Acquire almost always will succeed).<br>
&emsp;&emsp;&emsp;Spinlocks are more efficient in these cases than, say, semaphores, because the<br>
&emsp;&emsp;&emsp;overhead to acquire the lock is incredibly low (one instruction). I also<br>
&emsp;&emsp;&emsp;accepted the multiprocessor answers from the book.<br>
&emsp;&emsp;&emsp;We deducted 2 points for not mentioning how spinlocks have less overhead<br>
&emsp;&emsp;&emsp;than other locks (like semaphore).<br>
&emsp;&emsp;&emsp;We deducted 4 points for not saying when to apply these spinlocks, or -2<br>
&emsp;&emsp;&emsp;points if it wasn’t clear how your explanation applied to the locking issue,<br>
&emsp;&emsp;&emsp;especially with respect to the “shortness” or “uncontestedness” of the lock.<br>
&emsp;&emsp;&emsp;Partial explanations that didn’t answer the question were a 6 point deduction.<br>
&emsp;&emsp;&emsp;Completely off-topic answers received no credit.

Page 5/18


---

<a id="page-6"></a>
**Page 6**

CS 162 Spring 2008 Midterm Exam        February 27, 2008<br>
Solutions<br>
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
&emsp;&emsp;three sentences, explain your decision<br>
&emsp;This will not work because Semaphores are commutative, while condition variables<br>
&emsp;are not. Semaphores have history (their counter), and repeated signal calls will<br>
&emsp;increment the counter, causing subsequent wait calls to proceed immediately.<br>
&emsp;Several students said that this implementation would not work because Wait() does<br>
&emsp;not reacquire the lock after P(lock) is returned. However, the re-acquisition of the<br>
&emsp;lock was implicit in the P(lock) function, just as the release of the lock was implicit as<br>
&emsp;well. No credit was given for this answer.<br>
&emsp;Other students claimed that the implementation wouldn’t work because to call<br>
&emsp;Signal() you first had to call Wait() and since the initial value of the Semaphore was<br>
&emsp;0, it would deadlock. However, it is not necessary that Wait() has to be called by a<br>
&emsp;thread in order to call Signal(). It is only necessary that you possess the lock to<br>
&emsp;execute either function. No credit was given for this answer.<br>
&emsp;Some students understood that the Signal() implementation was erroneous because it<br>
&emsp;incremented the Counter and changed the state of the Condition variable. However,<br>
&emsp;they failed to explicitly state why this was an issue – i.e., they didn't talk about<br>
&emsp;commutativity or how calling Signal() would let another thread that called Wait() to<br>
&emsp;immediately return from the call. We took off either 2 or 3 points depending on the<br>
&emsp;correctness and quality of the explanation.

Page 6/18


---

<a id="page-7"></a>
**Page 7**

CS 162 Spring 2008 Midterm Exam        February 27, 2008<br>
Solutions

&emsp;b. (9 points) Another one of your project partners proposes the opposite – to<br>
&emsp;&emsp;implement semaphores using an unmodified Mesa-style Monitor class. Show a<br>
&emsp;&emsp;possible implementation of a Semaphore class using monitors. You should<br>
&emsp;&emsp;provide the initialize(value), P(), and V() operations.<br>
&emsp;&emsp;`Semaphore {`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`int value;`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`Lock lock = FREE;`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`Condition cond = NULL;`

&emsp;&emsp;&emsp;&emsp;&emsp;`initialize(int initialvalue) {`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`if (initialvalue < 0) throw exception;`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`value = initialvalue;`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`}`

&emsp;&emsp;&emsp;&emsp;&emsp;`P() {`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`lock.acquire();`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`while (value == 0)`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`cond.wait(lock);`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`value--;`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`lock.release();`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`}`

&emsp;&emsp;&emsp;&emsp;&emsp;`V() {`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`lock.acquire();`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`if (++value == 1)`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`cond.signal();`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`lock.release();`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`}`

Page 7/18


---

<a id="page-8"></a>
**Page 8**

CS 162 Spring 2008 Midterm Exam        February 27, 2008<br>
Solutions

A correct P() implementation was worth 4 points. A correct V() implementation was<br>
worth 4 points. A correct initialize() implementation was worth 1 point.<br>
-1 for not checking if the value passed to initialize was less than 0.<br>
-1 for not explicitly stating that a lock is acquired/released or for not using the<br>
synchronized keyword in the method definitions. Any misuse of a lock (e.g., forgetting to<br>
acquire/release) also incurred -1.<br>
-2 for using a “while” instead of an “if” in P(). \[However, some people who used “if”<br>
kept an extra variable that kept track of the number of threads waiting in P() and only<br>
incremented the value of the semaphore if this variable was zero. This was acceptable\]<br>
-2 for releasing the lock and THEN trying to use a condition variable<br>
-2 for failing to call ConditionVar.Signal() in V()<br>
-2 for disabling/enabling interrupts instead of using locks.<br>
-2 if your semaphore did not work for corner cases. Some student’s implementations<br>
allowed P() to be executed twice without blocking, even if the initial value was 1.<br>
-2 if your P() always blocked, regardless of the value.<br>
-2 if, for some reason or another your V() call blocked.<br>
-2 if your V() or P() didn’t increment/decrement the value every time (unless you were<br>
one of the people who had a working implementation with “if”)<br>
-2 for any concurrency issues that existed even if locks were used.

Page 8/18


---

<a id="page-9"></a>
**Page 9**

CS 162 Spring 2008 Midterm Exam        February 27, 2008<br>
Solutions

&emsp;c. (8 points) Nested Monitors.<br>
&emsp;&emsp;i) (5 points) In this question, we’ll consider the effects of nesting two monitors,<br>
&emsp;&emsp;&emsp;M1 and M2:<br>
&emsp;&emsp;&emsp;&emsp;&emsp; Inside the code in Monitor M1 that manipulates M1’s state variables,<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;there is a procedure call into Monitor M2<br>
&emsp;&emsp;&emsp;&emsp;&emsp; M2 then waits on one of its condition variables (releasing the lock for<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Monitor M2).<br>
&emsp;&emsp;&emsp;Assuming that M2 does not call any other monitors, including M1, are there<br>
&emsp;&emsp;&emsp;any problems with nesting monitors in this manner? Use a simple example to<br>
&emsp;&emsp;&emsp;explain your answer.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Even though waiting in M2 releases M2’s lock, this situation can result in<br>
&emsp;&emsp;&emsp;&emsp;&emsp;deadlock as follows: a thread that calls from M1 to M2 will have to hold<br>
&emsp;&emsp;&emsp;&emsp;&emsp;the M1’s lock (since it is manipulating M1’s condition variables). If the<br>
&emsp;&emsp;&emsp;&emsp;&emsp;thread that will issue the signal on M2 executes in similar fashion (i.e.,<br>
&emsp;&emsp;&emsp;&emsp;&emsp;calling a function in M1 and then a signal function in M2), it will not be<br>
&emsp;&emsp;&emsp;&emsp;&emsp;able to complete the function in M1 (since the original thread still holds<br>
&emsp;&emsp;&emsp;&emsp;&emsp;the lock), and thus, it will not be able to signal the original thread in M2.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;-5 if you said there is no problem.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;-3 if you said that there is a problem, but do not give an appropriate<br>
&emsp;&emsp;&emsp;&emsp;&emsp;explanation. The following quotes are valid examples, but are not relevant<br>
&emsp;&emsp;&emsp;&emsp;&emsp;to the stated problem and as a result, no credit was given:<br>
&emsp;&emsp;&emsp;&emsp;&emsp; “M2 sleeps with M1’s lock meaning that M1 cannot proceed until M2<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;wakes up.”<br>
&emsp;&emsp;&emsp;&emsp;&emsp; “What if M2 sleeps with M1’s lock, and then another thread enters M2<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;and then attempts to acquire M1’s lock”

Page 9/18


---

<a id="page-10"></a>
**Page 10**

CS 162 Spring 2008 Midterm Exam        February 27, 2008<br>
Solutions

&emsp;&emsp;ii) (3 points) Suppose that the wait in M2 also releases the lock for Monitor M1.<br>
&emsp;&emsp;&emsp;Does your answer for part (i) change or not? Briefly explain your answer.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Deadlock is no longer a problem, however, this solution would violate<br>
&emsp;&emsp;&emsp;&emsp;&emsp;mutual exclusion for Monitor M1 and could result in an inconsistent state<br>
&emsp;&emsp;&emsp;&emsp;&emsp;for the data being protected by M1.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;-3 if you said there was no problem.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;-2 or -3 if you said there was the a problem, but didn’t give an appropriate<br>
&emsp;&emsp;&emsp;&emsp;&emsp;explanation.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;A common explanation was:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;“It is only a problem if M2 doesn’t reacquire M1’s lock as well<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;when it wakes up.”<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Unfortunately, it **is** a problem even if M2 did acquire M1’s lock upon<br>
&emsp;&emsp;&emsp;&emsp;&emsp;waking up. The reason is that if a thread is in M1’s critical code and a<br>
&emsp;&emsp;&emsp;&emsp;&emsp;call to a method causes the thread to lose its lock when it was not<br>
&emsp;&emsp;&emsp;&emsp;&emsp;expecting it, then would allow multiple threads to execute in M1’s critical<br>
&emsp;&emsp;&emsp;&emsp;&emsp;section. Depending on your explanation, you received either 1 point or<br>
&emsp;&emsp;&emsp;&emsp;&emsp;none at all.

Page 10/18


---

<a id="page-11"></a>
**Page 11**

CS 162 Spring 2008 Midterm Exam        February 27, 2008<br>
Solutions

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
&emsp;&emsp;answer.<br>
&emsp;&emsp;A graduate student waits for a knife and then a fork (4 points).<br>
&emsp;&emsp;We gave one point for some other type of related constraint (e.g., you can’t steal<br>
&emsp;&emsp;utensils, there’s one fork and one knife per diner, etc.)<br>
&emsp;&emsp;-1 for not stating a student must have both knife and fork before eating.<br>
&emsp;&emsp;-1 for not stating a student must pick up a knife before picking up a fork.<br>
&emsp;&emsp;-1 for saying any implementation-dependent details (i.e. thread, lock, and etc.)<br>
&emsp;&emsp;-1 for each statement that is wrong (i.e. only one student can eat at a time).

&emsp;b. (5 points) Can deadlock ever occur? Explain your answer in terms of the<br>
&emsp;&emsp;conditions for deadlock to occur. If deadlock could occur, describe a reasonable<br>
&emsp;&emsp;deadlock avoidance algorithm. If deadlock cannot occur, explain why not.<br>
&emsp;&emsp;&emsp;Deadlock cannot occur, since the students’ algorithm defines a partial<br>
&emsp;&emsp;&emsp;ordering for resource acquisition (knives, then forks), and the number of<br>
&emsp;&emsp;&emsp;knives and forks is equivalent, meaning that acquiring a knife guarantees that<br>
&emsp;&emsp;&emsp;a fork can be acquired. Thus, there is no circular waiting while holding,<br>
&emsp;&emsp;&emsp;which violates one of the four preconditions for deadlock to occur.<br>
&emsp;&emsp;&emsp;-5 for saying yes and not considering the order of picking up a knife before<br>
&emsp;&emsp;&emsp;fork.<br>
&emsp;&emsp;&emsp;-4 for saying yes, but acknowledging the picking order has some sort of effect.<br>
&emsp;&emsp;&emsp;-4 for saying no, but for wrong reasons (i.e., require picking up a knife and<br>
&emsp;&emsp;&emsp;fork atomically).<br>
&emsp;&emsp;&emsp;-2 for messing up the order (i.e., fork before knife).

Page 11/18


---

<a id="page-12"></a>
**Page 12**

CS 162 Spring 2008 Midterm Exam        February 27, 2008<br>
Solutions

&emsp;c. (8 points) Implement the `Dine()` method using only semaphores (your solution<br>
&emsp;&emsp;may not use locks, monitors, or other synchronization primitives). Create a<br>
&emsp;&emsp;method `Dine()`, which waits until a student has fork and knife and can eat, then<br>
&emsp;&emsp;calls `Eat()`, and then releases the utensils before returning. Your solution should<br>
&emsp;&emsp;allow multiple students to eat at the same time (as long as there are sufficient<br>
&emsp;&emsp;utensils in a pile in the middle of the table). Assume you are given the variables,<br>
&emsp;&emsp;`forks` and `knifes`, which each starts off initialized to the total number of forks<br>
&emsp;&emsp;and knives available, respectively. Based on your answer from part 3.b, your<br>
&emsp;&emsp;solution should avoid deadlock.<br>
&emsp;&emsp;The key insight is to set the initial value of the semaphore to the minimum of the<br>
&emsp;&emsp;total number of forks or knives. Then, each P operation effectively grabs a knife<br>
&emsp;&emsp;and fork and each V operation relinquishes a knife and fork.<br>
&emsp;`Semaphore pairs = new Semaphore(min(forks, knives));`

&emsp;`Dine() {`<br>
&emsp;`pairs.P();`         `// This “acquires” a knife and fork`<br>
&emsp;`Eat();`<br>
&emsp;`pairs.V();`         `// This “releases” a knife and fork`<br>
&emsp;`}`<br>
&emsp;-8 pts: using other synchronization primitives (i.e., locks, monitors, CVs, interrupts)<br>
&emsp;-7 pts: didn’t enforce correctness constraint (need knife and fork to eat).<br>
&emsp;-7 pts:  trying to use a semaphore in an illegal way (e.g., trying to check the value)<br>
&emsp;-7 pts:  non-working solutions (i.e. non-synchronized code).<br>
&emsp;-6 pts: only one graduate student can eat at a time.<br>
&emsp;-5 pts: no call to Eat()<br>
&emsp;-5 pts: deadlock possible<br>
&emsp;-5 pts: busy waiting<br>
&emsp;-5 pts: solution fails if pairs is initially set to some value<br>
&emsp;-2 pts: messing up the order (i.e., fork before knife).<br>
&emsp;-1 pts: missing semaphore initializations or values<br>
&emsp;-1 pts: incorrect semaphore init values (i.e., some people did “Semaphore<br>
utensilPairs(floor(fork, knife)/2)”)<br>
&emsp;-1 pt: extraneous/redundant semaphores<br>
&emsp;-1 pt: didn’t show initialization of semaphore value<br>
&emsp;-5 – 7 pts: incorrect use of semaphores. Many students defined integer variables to<br>
explicitly keep track of the number of available knives and forks, and used an “if” or<br>
“while” statement to look up the variable values – this solution is basically trying to<br>
implement condition variables using semaphore. Some solutions come close to<br>
successfully implement a working condition variable using semaphore. However, we took<br>
off points because this shows a lack of understanding of semaphores. In particular, a<br>
semaphore already provides these counters implicitly. We took off 5 to 7 points<br>
depending on how badly semaphores were misused.

Page 12/18


---

<a id="page-13"></a>
**Page 13**

CS 162 Spring 2008 Midterm Exam        February 27, 2008<br>
Solutions<br>
&emsp;&emsp;Another solution:<br>
&emsp;`Int forks`    `= N;`     `// Total number of forks`<br>
&emsp;`Int knives`    `= N;`     `// Total number of knives`<br>
&emsp;`Semaphore Lock = new Semaphore (1);    // mutex`<br>
&emsp;`Semaphore SemF = new Semaphore (forks);  // scheduling`<br>
&emsp;`Semaphore SemK = new Semaphore (knives);  // scheduling`<br>
&emsp;`Dine {`<br>
&emsp;`Lock.P();`        `// This “acquires” mutex`<br>
&emsp;`SemK.P();`        `// This “acquires” one knife`<br>
&emsp;`SemF.P();`        `// This “acquires” one fork`<br>
&emsp;`Lock.V();`        `// This “releases” mutex`<br>
&emsp;`Eat();`<br>
&emsp;`SemF.V();`        `// This “releases” one fork`<br>
&emsp;`SemK.V();`        `// This “releases” one knife`

&emsp;`}`

Page 13/18


---

<a id="page-14"></a>
**Page 14**

CS 162 Spring 2008 Midterm Exam        February 27, 2008<br>
Solutions

4\. (27 points total) Operating Systems.<br>
&emsp;a.  (6 points) What are the two roles of an Operating System. For each role, briefly<br>
&emsp;&emsp;(one to two sentences) explain the role.<br>
&emsp;&emsp;i)<br>
&emsp;&emsp;&emsp;Coordinator and Traffic Cop – The OS manages all resources, settles<br>
&emsp;&emsp;&emsp;conflicting requests for resources, and prevent errors and improper use of the<br>
&emsp;&emsp;&emsp;computer.

&emsp;&emsp;ii)<br>
&emsp;&emsp;&emsp;Facilitator – The OS provides facilities that everyone needs, such as standard<br>
&emsp;&emsp;&emsp;libraries, windowing systems, etc., and helps make application programming<br>
&emsp;&emsp;&emsp;easier, faster, and less error-prone.<br>
&emsp;&emsp;&emsp;Also, OS as Illusionist, where the OS hides hardware constraints and gives the<br>
&emsp;&emsp;&emsp;illusion of a dedicated machine.<br>
&emsp;&emsp;&emsp;We deducted 1 to 3 points depending on how much the answer for part (ii)<br>
&emsp;&emsp;&emsp;overlapped the answer for part (i).

&emsp;b. (5 points) What private (thread-private) and public (shared between cooperating<br>
&emsp;&emsp;threads) resources are allocated when a thread is created? How do they differ<br>
&emsp;&emsp;from those allocated when a process is created?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;A thread is allocated a private Thread Control Block which holds a<br>
&emsp;&emsp;&emsp;&emsp;&emsp;register set, including Program Counter and Stack Pointer (for some<br>
&emsp;&emsp;&emsp;&emsp;&emsp;architectures, a Frame Pointer), and it is allocated memory for a stack.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;The thread is also has access to shared memory within an address space,<br>
&emsp;&emsp;&emsp;&emsp;&emsp;containing code, initialized data, uninitialized data (heap), and file<br>
&emsp;&emsp;&emsp;&emsp;&emsp;descriptors.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;A process is allocated a Process Control Block and an address space<br>
&emsp;&emsp;&emsp;&emsp;&emsp;containing code, initialized data, uninitialized data (heap), file<br>
&emsp;&emsp;&emsp;&emsp;&emsp;descriptors, and space for threads.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;We deducted ½ point for each error in how resources are shared or<br>
&emsp;&emsp;&emsp;&emsp;&emsp;allocated

Page 14/18


---

<a id="page-15"></a>
**Page 15**

CS 162 Spring 2008 Midterm Exam        February 27, 2008<br>
Solutions

&emsp;c. (10 points) Draw the life cycle of a thread and label all the transitions:


![Figure on page 15](figures/solutions-p15-fig03.png)

&emsp;&emsp;We deducted one point for each missing state or transition.

Page 15/18


---

<a id="page-16"></a>
**Page 16**

CS 162 Spring 2008 Midterm Exam        February 27, 2008<br>
Solutions

&emsp;d. (6 points) We discussed the Therac-25 in lecture and in an assigned reading.<br>
&emsp;&emsp;i) What is the Therac-25, and how does it differ from the Therac-20?<br>
&emsp;&emsp;&emsp;The Therac-25 is a machine for radiation therapy that produces electron<br>
&emsp;&emsp;&emsp;beam and X-ray radiation. It differs from the Therac-20 in that it uses only<br>
&emsp;&emsp;&emsp;software control and safety interlocks in the electron accelerator and electron<br>
&emsp;&emsp;&emsp;beam/X-ray production process, and software control of dosage. The Therac-<br>
&emsp;&emsp;&emsp;20 included hardware safety interlocks.

&emsp;&emsp;ii) Explain the Therac-25’s problems and the underlying causes.<br>
&emsp;&emsp;&emsp;Software errors caused the deaths and injuries of several patients. There were<br>
&emsp;&emsp;&emsp;a series of race conditions on shared variables and poor software design that<br>
&emsp;&emsp;&emsp;lead to the machine’s malfunction under certain conditions.

Page 16/18


---

<a id="page-17"></a>
**Page 17**

CS 162 Spring 2008 Midterm Exam        February 27, 2008<br>
Solutions<br>
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

Page 17/18


---

<a id="page-18"></a>
**Page 18**

CS 162 Spring 2008 Midterm Exam        February 27, 2008<br>
Solutions

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**This page intentionally left blank**

Page 18/18

