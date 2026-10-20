# Berkeley CS162 Spring 2000: Midterm 1: Official solutions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**University of California, Berkeley**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**College of Engineering**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Computer Science Division – EECS**<br>
Spring 2000                                               Prof. Michael J. Franklin<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Midterm Exam #1**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**SOLUTIONS**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;February 28, 2000<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS 162 Operating Systems


![Figure on page 1](figures/solutions-p01-fig01.png)

General Information:<br>
This is a **closed book** examination.  You have 1 hour and 20 minutes to answer as many<br>
questions as possible.  Partial credit will be given.  There are 100 points in all.  You should read<br>
**all** of the questions before starting the exam, as some of the questions are substantially more<br>
time-consuming than others.<br>
Write all of your answers directly on this paper.  Be sure to **clearly indicate** your final answer<br>
for each question.  Also, be sure to state any assumptions that you are making in your answers.<br>
Please try to be as **concise as possible**.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**GOOD LUCK!!!**


![Figure on page 1](figures/solutions-p01-fig02.png)


---

<a id="page-2"></a>
**Page 2**

CS 162 Spring 2000, Midterm Exam #1           February 28, 2000


### **Question 1 \[ 3 parts, 20 points total\]:  Thread Basics**

(Assume Mesa-style monitors throughout unless explicitly stated otherwise)<br>
**a)  (4  points)**  Because personal computers were intended to be used by a single person at a<br>
time, early PC operating systems such as MSDOS provided only a single thread of control and a<br>
single address space.   Even assuming only one person uses the computer at a time, **briefly** state<br>
a problem or limitation resulting from this approach.

&emsp;&emsp;The two most popular correct answers were:<br>
&emsp;&emsp;1\. Can’t do more than one task at a time which means either users have to<br>
&emsp;&emsp;wait for one task to finish before working on another (e.g., can’t read email while<br>
&emsp;&emsp;printing) or resources would be used inefficiently (can’t overlap I/O and CPU).

&emsp;&emsp;2\. Single address space leads to protection problems --- user program can<br>
&emsp;&emsp;overwrite parts of the operating system.

&emsp;&emsp;Partial credit was given if no implication was stated.

**b)  (10 points)**  Given the three thread states: running, runnable (i.e., ready), and waiting, state<br>
which of the six possible thread transitions are allowed **and** give an example of why a thread<br>
would follow such a transition.

&emsp;&emsp;Runnable (Ready) à Running;    //Chosen to run by OS Scheduler<br>
&emsp;&emsp;Running à Runnable (Ready);    //Time-sliced out or called Yield()<br>
&emsp;&emsp;Runningà Waiting;     // Requests I/O, lock, or wait on another thread<br>
&emsp;&emsp;Waiting à Runnable (Ready)     //Event completion

&emsp;&emsp;1 point for each correct transition plus 1 point for each correct example.  1 Point<br>
&emsp;&emsp;each for not listing the two illegal transitions.<br>
**c)  (6 points)** What state information do you need to save/restore about threads when performing<br>
a context switch?<br>
&emsp;&emsp;Program Counter, Registers, and Stack (2 points each)<br>
&emsp;&emsp;-1 point if said “stack” instead of stack pointer; -2 points if listed both stack<br>
&emsp;&emsp;and SP; -2 points for additional unnecessary information (that does not need to<br>
&emsp;&emsp;be restored).

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 2 of 2


---

<a id="page-3"></a>
**Page 3**

CS 162 Spring 2000, Midterm Exam #1           February 28, 2000


### **Question 2 \[ 5 parts, 35 points total\]:  Synchronization**

**a)  (5 points)**  Consider the following implementation of Locks:

`Lock::Acquire() {disable_interrupts();}`<br>
`Lock::Release() {enable_interrupts();}`

For a **single-processor system** state whether this implementation is: i) correct and reasonable<br>
(i.e., is a good way to do it), ii) incorrect (i.e., it may produce incorrect executions), or iii)<br>
dangerous (i.e., it may work but it could cause problems in practice).   **Briefly, but explicitly**<br>
**justify your answer.**<br>
&emsp;&emsp;2 pts if answered Incorrect or Dangerous.  3 pts for a good reason; some<br>
&emsp;&emsp;examples:<br>
&emsp;&emsp;&emsp;§ does not work for multiple locks (enable\_ints vs restore\_ints)<br>
&emsp;&emsp;&emsp;§ user program may not release for a long time.. effectively halts machine<br>
&emsp;&emsp;&emsp;§ does not maintain the "acquired" state of the lock across a context switch<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;(yield())

**b)  (5 points)** Answer the question in part “a” above, but this time for a **multi-processor system.**<br>
Again, briefly but explicitly justify your answer.

&emsp;&emsp;2 pts for Incorrect / Dangerous;    3 pts for a reason (any of the above, or:)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;does not block other processors from accessing the critical section  (if they<br>
&emsp;&emsp;&emsp;&emsp;&emsp;said this would halt all processors without EXPLICITLY stating that disable<br>
&emsp;&emsp;&emsp;&emsp;&emsp;interrupts affected every processor, they got no credit)

**c)  (10 points)** Consider the following two threads, to be run concurrently in a shared memory<br>
(all variables are shared between the two threads).


![Figure on page 3](figures/solutions-p03-fig03.png)

Assuming a single-processor system, that load and store are atomic,  that x is initialized to 0,  and<br>
that x must be loaded into a register before being incremented (and stored back to memory<br>
afterwards), what are **all the possible values** for x after both threads have completed?

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 3 of 3


---

<a id="page-4"></a>
**Page 4**

CS 162 Spring 2000, Midterm Exam #1           February 28, 2000

&emsp;&emsp;The correct answer is 2 through 10 inclusive.  Grading was assigned as follows:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4 pts for  2, 3, 4<br>
&emsp;&emsp;&emsp;&emsp;&emsp;2 pts for  5<br>
&emsp;&emsp;&emsp;&emsp;&emsp;3 pts for  6, 7, 8<br>
&emsp;&emsp;&emsp;&emsp;&emsp;1 pt  for  10<br>
&emsp;&emsp;&emsp;&emsp;&emsp;-1 pt for each extra number<br>
&emsp;&emsp;&emsp;&emsp;&emsp;-8 for listing all values, 1 through 10

**d)  (10 points)**  Show in pseudocode how to implement semaphores (just the P() and V()<br>
operations) using mesa-style monitors.<br>
Solution:<br>
P() {<br>
mutex.acquire();       //2 pts for correct acquire / release<br>
while (count == 0) {   //2 pts for while loop / cond. var.<br>
c.wait();<br>
}<br>
count--;               //1 pt for decrementing counter<br>
mutex.release();<br>
}<br>
V() {<br>
mutex.acquire();       //2 pts for correct acquire / releas<br>
count++;               //1 pt for incrementing counter<br>
c.signal();            //2 pts for signalling<br>
mutex.release();<br>
}

&emsp;No credit was given if monitors were not used as that was specifically<br>
&emsp;required in the question.  Any correct solution was given full credit.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 4 of 4


---

<a id="page-5"></a>
**Page 5**

CS 162 Spring 2000, Midterm Exam #1           February 28, 2000

**e)  (5 points)**  Recall that semaphores can be used to implement mutual exclusion or thread<br>
scheduling dependencies.   Show in pseudocode how  a semaphore can be used to implement the<br>
join operation on a thread.  Be sure to indicate the initial value of the semaphore.

`Thread::Thread() {`<br>
`…`<br>
`if (joinable) {`<br>
`______________   //``Your code goes here`<br>
`}`<br>
`…`<br>
`}`

`void Thread::Join() {`<br>
`ASSERT(joinable);`<br>
`____________   //``Your code goes here`<br>
`delete this;`<br>
`}`

`void Thread::Finish() {`<br>
`kernel->interrupt->SetLevel(IntOff);`<br>
`__________  //``Your code goes here`<br>
`if (joinable)`<br>
`Sleep(FALSE);`<br>
`else`<br>
`Sleep(TRUE);`<br>
`}`

&emsp;First missing statement (2 pts) is "sema = 0" / must initialize the semaphore<br>
&emsp;&emsp;&emsp;&emsp;&emsp;correctly<br>
Second missing statement (1.5 pts) is  "sema.P() / sema.wait()"<br>
Thirds missing statement (1.5 pts ) is "sema.V() / sema.signal()"

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 5 of 5


---

<a id="page-6"></a>
**Page 6**

CS 162 Spring 2000, Midterm Exam #1           February 28, 2000


### **Question 3 \[3 parts, 15 points total\]:  Using Semaphores**

In class we discussed a solution to the bounded-buffer problem for a Coke machine using three<br>
semaphores (mutex, emptyBuffers, and fullBuffers):


![Figure on page 6](figures/solutions-p06-fig04.png)

Given each of the following variations, say whether it is correct or incorrect.  If you say correct,<br>
**explain any of the advantages and disadvantages of the new code**.  If you say incorrect,<br>
**explain what could go wrong** (i.e., trace through an example where it does not behave<br>
properly).

&emsp;&emsp;The entire problem was worth 15 points Each of the 3 parts was out of 5 points:

&emsp;&emsp;5 points if for getting whether the code is correct/incorrect and with the<br>
&emsp;&emsp;appropriate justification/explanation.  3 points if for getting whether the code is<br>
&emsp;&emsp;correct/incorrect but without good explanation.   0 points otherwise.

**a)  (5 points)**


![Figure on page 6](figures/solutions-p06-fig05.png)

&emsp;&emsp;This code is incorrect.  It can lead to deadlock.  Consider the case where the<br>
&emsp;&emsp;coke machine is initially full.  Suppose a Producer comes and grabs the mutex<br>
&emsp;&emsp;and then waits for emptyBuffers.  A consumer then hangs on mutex and no one<br>
&emsp;&emsp;will ever consume a coke to empty a buffer.  An analogous example is the case

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 6 of 6


---

<a id="page-7"></a>
**Page 7**

CS 162 Spring 2000, Midterm Exam #1           February 28, 2000

&emsp;&emsp;where the coke machine is initially empty and a Consumer grabs the mutex and<br>
&emsp;&emsp;waits for fullBuffers.<br>
**b)  (5 points)**


![Figure on page 7](figures/solutions-p07-fig06.png)

&emsp;&emsp;&emsp;This code is incorrect.  It can lead to deadlock.  The problem is exactly as the<br>
&emsp;&emsp;&emsp;first case of deadlock mentioned in part a.  Consider the case where the coke<br>
&emsp;&emsp;&emsp;machine is initially full.  Suppose a Producer comes and grabs the mutex and<br>
&emsp;&emsp;&emsp;then waits for emptyBuffers.  A consumer then hangs on mutex and no one<br>
&emsp;&emsp;&emsp;will ever consume a coke to empty a buffer.

**c)  (5 points)**


![Figure on page 7](figures/solutions-p07-fig07.png)

&emsp;&emsp;&emsp;This code is correct.  As mentioned in lecture, this code allows more<br>
&emsp;&emsp;&emsp;concurrency which is the advantage to coding in this manner.  Since the<br>
&emsp;&emsp;&emsp;mutex immediately surrounds both the Producer and Consumer actions of<br>
&emsp;&emsp;&emsp;putting a coke and taking a code from the machine, if we release the mutex<br>
&emsp;&emsp;&emsp;quickly, we achieve better concurrency.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 7 of 7


---

<a id="page-8"></a>
**Page 8**

CS 162 Spring 2000, Midterm Exam #1           February 28, 2000


### **Question 4 \[3 parts, 15 points total\]:  Deadlock**

**a) (5 points)** Recall that there are four conditions that must hold in order for a deadlock to be<br>
possible.  Name one of these conditions that is always present when using synchronization<br>
primitives for **mutual exclusion** and **state why the condition must hold.**

&emsp;&emsp;&emsp;The limited access (mutual exclusion) condition must hold.  This is by definition<br>
&emsp;&emsp;&emsp;since limited access must be present for mutual exclusion to be achieved.

&emsp;&emsp;&emsp;&emsp;&emsp;2 points for a correct deadlock condition<br>
&emsp;&emsp;&emsp;&emsp;&emsp;3 additional points for a correct explanation<br>
&emsp;&emsp;&emsp;&emsp;&emsp;If you said no preemption, you only lost 1 point for the correct<br>
&emsp;&emsp;&emsp;&emsp;&emsp;deadlock condition.

**b)  (5 points)** Name one of the deadlock conditions that is **not** necessarily present when using<br>
synchronization primitives for mutual exclusion and describe a way that deadlock can be avoided<br>
by preventing that condition from occurring in a system where locks are the only resource that<br>
can deadlock.<br>
2 points for a correct deadlock condition<br>
3 additional points for a correct explanation

&emsp;&emsp;&emsp;Circular wait, hold and wait, and no preemption (assuming you didn't say this<br>
&emsp;&emsp;&emsp;for part a) were all correct answers.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;2 points for a correct deadlock condition<br>
&emsp;&emsp;&emsp;&emsp;&emsp;3 additional points for a correct explanation<br>
&emsp;&emsp;&emsp;&emsp;&emsp;For example, if you said circular wait, you could say that you use resource<br>
&emsp;&emsp;&emsp;&emsp;&emsp;ordering to prevent this circular wait condition.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 8 of 8


---

<a id="page-9"></a>
**Page 9**

CS 162 Spring 2000, Midterm Exam #1           February 28, 2000

**c)  (5  points) Dining Aliens --- CS 162 meets the X-files**

Consider a scenario where all philosophers have been mysteriously replaced by multi-armed<br>
beings from another planet. Initially there are m chopsticks in the middle of the table.   An alien<br>
must pick up n chopsticks (where n is specified by each alien as an argument and may change<br>
each time that alien has dinner) before it can eat.  After eating the alien puts the chopsticks back<br>
down.    Describe a rule for taking chopsticks that avoids deadlock but allows concurrency and<br>
allows aliens to acquire their chopsticks incrementally.

&emsp;&emsp;One answer is that we can use the modified Banker's Algorithm as presented in<br>
&emsp;&emsp;class.  The rule is that we can allocate the chopstick if the total number of<br>
&emsp;&emsp;chopsticks - those chopsticks in use \>= the number of chopsticks still needed by<br>
&emsp;&emsp;the alien.   In other words, if the number of chopsticks in the middle of the table is<br>
&emsp;&emsp;greater than or equal to the number of chopsticks an alien \*still\* needs, then the<br>
&emsp;&emsp;alien is granted a chopstick.<br>
&emsp;&emsp;Grading was done as follows:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;5 points for a plausible answer<br>
&emsp;&emsp;&emsp;&emsp;&emsp;3 if answer was incomplete/incorrect but had a glimmer of hope<br>
&emsp;&emsp;&emsp;&emsp;&emsp;1 not incremental solution, or any other attempt at a solution<br>
&emsp;&emsp;&emsp;&emsp;&emsp;0 no effort made

&emsp;&emsp;It is possible to score between these numbers if we felt your answer<br>
&emsp;&emsp;was in between two of these categories.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 9 of 9


---

<a id="page-10"></a>
**Page 10**

CS 162 Spring 2000, Midterm Exam #1           February 28, 2000


### **Question 5 \[2 part, 15 points total\]:  Atomicity**

**a) (10 points)** The original Nachos implementation of condition variables relies  on semaphores.<br>
Recall that one of the requirements of Condition::Wait is that it atomically release the lock and<br>
wait on the semaphore. Is the following implementation of condition variables correct? If so,<br>
explain why Wait is effectively atomic. If not, state the smallest change you could make to make<br>
it atomic.<br>
`class Condition {`<br>
`Lock* conditionLock;`<br>
`List<Semaphore*>* waitQueue;`<br>
`void Wait() {`<br>
`waiter = new Semaphore(0);`<br>
`waitQueue->Append(waiter);`<br>
`conditionLock->Release();`<br>
`waiter->P();`<br>
`conditionLock->Acquire();`<br>
`delete waiter;`<br>
`}`<br>
`void Signal() {`<br>
`if (!waitQueue->IsEmpty())`<br>
`waitQueue->RemoveFront()->V();`<br>
`}`<br>
`};`

&emsp;&emsp;This implementation is correct. Even if a context switch occurs after releasing the<br>
&emsp;&emsp;lock before waiting on the semaphore, the semaphore is already on the wait<br>
&emsp;&emsp;queue, so if a signal occurs,  the semaphore will be V()'d. Then when the waiting<br>
&emsp;&emsp;thread callsP(), it will not actually sleep; i.e. it still caught the signal.

&emsp;&emsp;4 points for saying correct. 6 points for good explanation. 2 points for explanation<br>
&emsp;&emsp;on the right track, but missing key points about the semaphore wait queue. 0<br>
&emsp;&emsp;points for explanations that do not talk about context switches between release()<br>
&emsp;&emsp;and P().  5 points for saying not atomic but placing 1 disable-ints/restore-ints pair<br>
&emsp;&emsp;in wait(); -1 point for each additional pair.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 10 of 10


---

<a id="page-11"></a>
**Page 11**

CS 162 Spring 2000, Midterm Exam #1           February 28, 2000

**b) (5 points)** Why is it dangerous to acquire a lock in an interrupt handler?

&emsp;&emsp;The key thing to note here is that interrupts can occur in ANY thread. When a<br>
&emsp;&emsp;processor receives an interrupt, and interrupts are enabled, the current thread<br>
&emsp;&emsp;makes a forced procedure call to the interrupt handler. If an interrupt handler<br>
&emsp;&emsp;blocks while trying to acquire a lock, it could be forcing a high priority thread to<br>
&emsp;&emsp;sleep waiting for a completely unrelated thread. Worse yet, the current thread<br>
&emsp;&emsp;might already hold the lock, in which case you get a single-thread deadlock.

&emsp;&emsp;A lot of people said waiting in interrupt handlers is bad. This is true, but waiting a<br>
&emsp;&emsp;bit isn't as bad as blocking an arbitrary thread. It just results in inefficiency, and<br>
&emsp;&emsp;perhaps makes the associated I/O device unusable. Note that disabling interrupts<br>
&emsp;&emsp;does NOT prevent context switches. For example, in Nachos, Thread::Sleep() is<br>
&emsp;&emsp;always called with interrupts disabled, but that doesn't stop it from giving up the<br>
&emsp;&emsp;processor to another thread. Also note that each thread tracks its own interrupt<br>
&emsp;&emsp;state, so that when it gets to run, it sets interrupts to the state it wants (this is<br>
&emsp;&emsp;done in Thread::Yield and in Semaphore::P and ::V,  for example). Disabling<br>
&emsp;&emsp;interrupts and context switching does not force the next thread to run with<br>
&emsp;&emsp;interrupts disabled<br>
&emsp;&emsp;5 points were given for the following kinds of answers:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;-lock already held =\> deadlock / could wait forever<br>
&emsp;&emsp;&emsp;&emsp;&emsp;-lock already held, handler sleeps =\> could get another instance of<br>
&emsp;&emsp;handler, atomicity lost

&emsp;&emsp;2 points for these:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;-lock already held, another interrupt happens, deadlock<br>
&emsp;&emsp;&emsp;&emsp;&emsp;-interrupts off =\> deadlock<br>
&emsp;&emsp;&emsp;&emsp;&emsp;-lock never gets released =\> deadlock<br>
&emsp;&emsp;&emsp;&emsp;&emsp;-lock already held =\> interrupt handler waits/gets put to sleep<br>
&emsp;&emsp;&emsp;&emsp;&emsp;-lock already held by current thread =\> defeats purpose of  interrupt<br>
&emsp;&emsp;handler

&emsp;&emsp;And no points for these (most of the class):<br>
&emsp;&emsp;&emsp;&emsp;&emsp;-might forget to release lock<br>
&emsp;&emsp;&emsp;&emsp;&emsp;-lock::acquire disables interrupts =\> interrupt handler stops<br>
&emsp;&emsp;&emsp;&emsp;&emsp;-lock already held and interrupts off =\> can't context switch<br>
&emsp;&emsp;&emsp;&emsp;&emsp;-lock already held, another interrupt might happen<br>
&emsp;&emsp;&emsp;&emsp;&emsp;-interrupts handled in kernel mode, security problem

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 11 of 11

