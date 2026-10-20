# Berkeley CS162 Fall 1996: Midterm 1: Official solutions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**CS 162 Midterm Exam**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**March 1996**<br>
Note that exam total is out of 70, not out of 100.  Answers in italics.<br>
**Your Name: Ms. Perfect**<br>
**Your TA:**<br>
**Your Section:**<br>
General Information:<br>
This is a **closed book** examination. You have 90 minutes to answer<br>
as many questions as possible.  The number in parentheses at the<br>
beginning of each question indicates the number of points given to<br>
the question; there are **70**  points in all. Write all of your answers<br>
directly on this paper.  Make your answers as concise as possible<br>
(you needn't cover every available nano-acre with writing). If there<br>
is something in a question that you believe is open to interpretation,<br>
then please go ahead and interpret **but** state your assumptions in<br>
your answer.


### **Problem 1**: (5 points)

Of the following items, circle those that are stored in the thread<br>
control block.<br>
Answer: a, c, f, g<br>
(a) CPU registers<br>
(b) page table pointer<br>
(c) stack pointer<br>
(d) ready list<br>
(e) segment table<br>
(f) thread priority<br>
(g) program counter

1


---

<a id="page-2"></a>
**Page 2**


### **Problem 2**: (10 points)

Write down the sequence of context switches that would occur in<br>
Nachos if the “main” thread were to call the following code.  Assume<br>
that the CPU scheduler runs threads in FIFO order, with no time-<br>
slicing and all threads having the same priority.  The WillJoin flag is<br>
used to signify that the thread will be joined to by its parent.  For<br>
example,  “child2 =\> child1” would signify that child2 switches to<br>
child1.<br>
&emsp;&emsp;`void`<br>
&emsp;&emsp;`Thread::SelfTest2() {`<br>
&emsp;&emsp;`Thread *t1 = new Thread("child 1", WillJoin);`<br>
&emsp;&emsp;`Thread *t2 = new Thread("child 2", WillJoin);`<br>
&emsp;&emsp;`t1->Fork((VoidFunctionPtr) &Thread::Yield, t1);`<br>
&emsp;&emsp;`t2->Fork((VoidFunctionPtr) &Thread::Yield, t2);`<br>
&emsp;&emsp;`t2->Join();`<br>
&emsp;&emsp;`t1->Join();`<br>
&emsp;&emsp;`}`<br>
main -\> child1 -\> child2 -\> child1 -\> child2 -\> main<br>
(If you assumed an implementation of join that V’ed the child to<br>
ask it to finish itself, then there would be an additional couple<br>
switches at the end -- we didn’t take off for this..)<br>
Note that neither creating nor forking a thread switches to the child<br>
thread (assuming no preemptions occur)-- the parent keeps the CPU<br>
throughout, and just puts the child on the ready list.  In the above<br>
example, the children don’t start running until “main” calls join.<br>
Also note that when I fork the function Yield, when Yield runs, it will<br>
first call switch, then come back from switch, then the thread<br>
finishes.  A common error was to assume that once Yield called<br>
switch, it never came back.<br>
We gave some people half credit if we could deduce that you made<br>
only one of these errors.

2


---

<a id="page-3"></a>
**Page 3**


### **Problem 3**: (10 points)

For the following implementation of Thread::Join(), say whether it<br>
either (i) works, (ii) doesn’t work, or (iii) is dangerous -- that is,<br>
sometimes works and sometimes doesn’t.  If the implementation<br>
does not work or is dangerous, explain why and show how to fix it so<br>
it does work.<br>
You may assume parents always call Thread::Join() on their children<br>
threads; Thread::Join is a method on the child thread, not the parent.<br>
&emsp;&emsp;`class Thread {`<br>
&emsp;&emsp;`Semaphore *finished;`   `// synch parent and child`<br>
&emsp;&emsp;`Thread::Thread() {`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`finished = new Semaphore(0); // initial value = 0`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`// plus other standard stuff from the Nachos code`<br>
&emsp;&emsp;`}`<br>
&emsp;&emsp;`Thread::~Thread() {`<br>
&emsp;&emsp;`delete finished;`<br>
&emsp;&emsp;`// plus other standard stuff from the Nachos code`<br>
&emsp;&emsp;`}`<br>
&emsp;&emsp;`};`

&emsp;&emsp;`void`   `// called by parent to wait for child thread`<br>
&emsp;&emsp;`Thread::Join()`<br>
&emsp;&emsp;`{`<br>
&emsp;&emsp;`finished->P();`   `// wait for thread to finish`<br>
&emsp;&emsp;`}`

&emsp;&emsp;`void`   `// called by child thread when it is done`<br>
&emsp;&emsp;`Thread::Finish()`<br>
&emsp;&emsp;`{`<br>
&emsp;&emsp;`Thread *oldThread = kernel->currentThread;`<br>
&emsp;&emsp;`Thread *nextThread;`<br>
&emsp;&emsp;`(void) kernel->interrupt->SetLevel(IntOff);`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`// first turn interrupts off`<br>
&emsp;&emsp;`finished->V();`   `// then wake up parent`<br>
&emsp;&emsp;`delete this;`   `// deallocate current thread`<br>
`nextThread = kernel->scheduler->FindNextToRun());`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`// find the next thread to run`<br>
&emsp;&emsp;`kernel->currentThread = nextThread;`<br>
&emsp;&emsp;`SWITCH(oldThread, nextThread);`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`// context switch to it`<br>
&emsp;&emsp;`}`

3


---

<a id="page-4"></a>
**Page 4**

Answer to problem 3: This is dangerous.  There are actually 3 things<br>
wrong with the implementation:<br>
1\. if child finishes before parent gets to join, thread is deleted (along<br>
with semaphore used for synchronizing the parent and child).  So<br>
when parent calls join, it is referencing a deallocated data structure<br>
(and someone else may in the meantime have allocated it for some<br>
other purpose, overwriting the semaphore value).<br>
2\. regardless of whether the parent gets to join before or after the<br>
child finishes, the child deletes its thread while still running in the<br>
context of the thread.  This means the thread is still referencing its<br>
stack, even though the space for the stack may have been reallocated<br>
for some other purpose (and thus things like procedure call and<br>
return won’t work properly).<br>
3\. There is no guarantee in Thread::Finish that there is another<br>
thread to run; thus, FindNextToRun might return NULL.<br>
All three of these errors only show up sometimes, if exactly the right<br>
sequence of events occurs.  For example, using data that has been<br>
deleted is dangerous, since it will only show up if the memory<br>
allocator hands out that data region again.  You won’t get an error if<br>
the memory allocator hands out some other data region.)<br>
We were mainly looking for the first 2, so if you got both of those,<br>
and your fix worked, we gave you full credit.  The simplest fix is to<br>
move the “delete this” to the last line in Thread::Join().<br>
The most common error was noticing only one of the problems; we<br>
gave half credit if you came up with either of the first two problems.<br>
Among the other common errors: (1) using an extra semaphore to<br>
have the child thread wait until the parent called join.  This fixes #1,<br>
but not #2.  (2) saying that the problem was that interrupts were<br>
never reenabled -- in Nachos, as in other systems, the thread that<br>
wakes up after a SWITCH is responsible for reenabling interrupts.<br>
(3) not realizing that Join is an operation on the child thread, even<br>
though the parent thread is the one that calls Join -- both Join and<br>
Finish operate on the same object and thus use the same semaphore.

4


---

<a id="page-5"></a>
**Page 5**


### **Problem 4:** (10 points)

For the following implementation of **atomic transfer**, say whether<br>
it either (i) works, (ii) doesn’t work, or (iii) is dangerous -- that is,<br>
sometimes works and sometimes doesn’t.  If the implementation<br>
does not work or is dangerous, explain why and show how to fix it so<br>
it does work.<br>
The problem statement is as follows: The **atomic transfer** routine<br>
dequeues an item from one queue and enqueues it on another.  The<br>
transfer must appear to occur atomically: there should be no interval<br>
of time during which an external thread can determine that an item<br>
has been removed from one queue but not yet placed on another.  In<br>
addition, the implementation must be highly concurrent -- it must<br>
allow multiple transfers between unrelated queues to happen in<br>
parallel.  You may assume that queue1 and queue2 never refer to<br>
the same queue.

&emsp;&emsp;`void AtomicTransfer (Queue *queue1, *queue2) {`<br>
&emsp;&emsp;`Item thing; /* thing being transferred */`

&emsp;&emsp;`queue1->lock.Acquire();`<br>
&emsp;&emsp;`thing = queue1->Dequeue();`<br>
&emsp;&emsp;`if (thing != NULL) {`<br>
&emsp;&emsp;`queue2->lock.Acquire();`<br>
&emsp;&emsp;`queue2->Enqueue(thing);`<br>
&emsp;&emsp;`queue2->lock.Release();`<br>
&emsp;&emsp;`}`<br>
&emsp;&emsp;`queue1->lock.Release();`<br>
&emsp;&emsp;`}`<br>
This is dangerous, since it may (but does not always) lead to<br>
deadlock.  If one thread transfers from A to B, and another transfers<br>
from B to C and another from C to A, then you can get deadlock if<br>
they all acquire the lock on the first queue before any of them<br>
acquire the second.<br>
The best fix from the point of view of maximizing concurrency is to<br>
use resource ordering -- to acquire both locks at the beginning of the<br>
routine, lowest addressed queue first:

5


---

<a id="page-6"></a>
**Page 6**

&emsp;&emsp;`void AtomicTransfer (Queue *queue1, *queue2) {`<br>
&emsp;&emsp;`Item thing; /* thing being transferred */`

&emsp;&emsp;`if (queue1 < queue2) {`<br>
&emsp;&emsp;`queue1->lock.Acquire();`<br>
&emsp;&emsp;`queue2->lock.Acquire();`<br>
&emsp;&emsp;`} else { // queue2 < queue1`<br>
&emsp;&emsp;`queue2->lock.Acquire();`<br>
&emsp;&emsp;`queue1->lock.Acquire();`<br>
&emsp;&emsp;`}`<br>
&emsp;&emsp;`thing = queue1->Dequeue();`<br>
&emsp;&emsp;`if (thing != NULL) {`<br>
&emsp;&emsp;`queue2->Enqueue(thing);`<br>
&emsp;&emsp;`}`<br>
&emsp;&emsp;`// release order doesn’t matter`<br>
&emsp;&emsp;`queue1->lock.Release();`<br>
&emsp;&emsp;`queue2->lock.Release();`<br>
&emsp;&emsp;`}`<br>
Another fix is to use a global lock -- this is not highly concurrent so<br>
we gave only partial credit for it.  For example, you could put a<br>
global lock around the entire routine.  Another fix is to use a global<br>
lock just to acquire the two queue locks, then release the global lock<br>
before dequeueing and enqueueing -- this is an example of acquiring<br>
all resources at the beginning.  However, it is still not very<br>
concurrent: for example, if a thread needs to wait for one of the<br>
queue locks, then because it holds the global lock, no one else can<br>
make progress.<br>
A common error was to say that the original code did not provide an<br>
atomic transfer, because another thread can access queue2 after the<br>
item has been removed from queue1.  However, although the item<br>
has been removed from queue1 and not yet put on queue2, the<br>
external thread cannot observe this, since it can’t get a lock on<br>
queue1 -- it can’t tell if the item has been removed from queue1 or<br>
not.  So from the point of view of an external thread, the transfer is<br>
atomic -- the external thread sees the state of the world either as it<br>
was before the transfer was made, or after, but not partway through.

6


---

<a id="page-7"></a>
**Page 7**


### **Problem 5:** (15 points)

A **countermeasure** is a strategy by which a user (or an application)<br>
exploits the characteristics of the CPU scheduling policy to get as<br>
much of the CPU time as possible.  For example, if the CPU scheduler<br>
trusts users to give accurate estimates of how long each job will run<br>
so that it can give high priority to short jobs, then a countermeasure<br>
would be for the user to tell the system that the user’s jobs are<br>
always short (even if untrue).<br>
Devise a countermeasure strategy for each of the following CPU<br>
scheduling policies; your strategy should minimize an individual<br>
application’s response time (even if it hurts overall performance).<br>
You may assume perfect knowledge -- for example, your strategy<br>
can be based on which jobs will arrive in the future, where your<br>
application is in the queue and how long the jobs ahead of you will<br>
run before blocking.  Your strategy should also be robust -- it should<br>
work properly even if there are no other jobs in the system, or there<br>
are only short jobs, or only long running jobs, etc.  If no strategy will<br>
improve your application’s response time, then indicate that.<br>
Note that this question asked how you could improve a single job’s<br>
response time, not how you could improve average response time<br>
across all jobs.  Also note that the question is impractical in that it<br>
assumes you can have perfect knowledge; in practice,<br>
countermeasures are not as efficient as the ones described below.<br>
(a) last in first out<br>
If you assume LIFO is non-preemptive, then the best<br>
countermeasure is to insert your job onto the queue just before the<br>
currently running job finishes.  The problem with this is what if your<br>
job does I/O?  It would be hard to arrange for your I/O to complete<br>
just before another job finishes, which leads to the kill & restart<br>
approach outlined below.<br>
If you assume LIFO is preemptive, then if another thread preempts<br>
your job (and that thread will take a long time), then you can kill<br>
your job and restart it -- the restarted job will go on the front of the<br>
queue. Alternatively, you might have your job, right before it is<br>
preempted, create a copy of itself and kill the original.  If the copy<br>
does a brief Alarm::WaitUntil, it can leap over the arriving job back<br>
to the front of the line.

7


---

<a id="page-8"></a>
**Page 8**

(b) round robin, assuming jobs are always put at the end of the<br>
ready list when they become ready to run<br>
We gave full credit if you said no countermeasure possible.<br>
However, a few of you came up with clever solutions -- for instance,<br>
carving up your job into pieces, each of which runs for less than a<br>
time slice.<br>
(c) multilevel feedback queues, where jobs are always put on the<br>
highest priority queue when they become ready to run<br>
Similar to (a), one approach is, right before a higher priority job<br>
would preempt you, fork a job to run the remaining part of your job<br>
(or do a little bit of I/O at this point) This way, your job would<br>
always be high priority.  Many suggested always doing I/O right<br>
before getting time-sliced, but this is inefficient if you are the only<br>
runnable job -- remember multilevel feedback timeslices every job<br>
to drop its priority, even if there is no one else at that priority level.<br>
We gave a large share of credit for this.  Some simply said, do lots of<br>
I/O; again, that will work, but it is inefficient.<br>
As with (b), another possible countermeasure is carving up your job<br>
into pieces, each of which runs for less than the minimum time slice.

8


---

<a id="page-9"></a>
**Page 9**


### **Problem 6:** (20 points)

For the following implementations of the “H20” problem, say whether<br>
it either (i) works, (ii) doesn’t work, or (iii) is dangerous -- that is,<br>
sometimes works and sometimes doesn’t.  If the implementation<br>
does not work or is dangerous, explain why and show how to fix it so<br>
it does work.<br>
Here is the original problem description:  You've just been hired by<br>
Mother Nature to help her out with the chemical reaction to form<br>
water, which she doesn't seem to be able to get right due to<br>
synchronization problems.  The trick is to get two H atoms and one O<br>
atom all together at the same time.  The atoms are threads.  Each H<br>
atom invokes a procedure hReady  when it's ready to react, and each<br>
O atom invokes a procedure oReady  when it's ready.  For this<br>
problem, you are to write the code for hReady  and oReady.  The<br>
procedures must delay until there are at least two H atoms and one O<br>
atom present, and then one of the procedures must call the<br>
procedure makeWater  (which just prints out a debug message that<br>
water was made). After themakeWater  call, two instances of<br>
hReady  and one instance of oReady  should return.  Your solution<br>
must avoid starvation and busy-waiting.<br>
You may assume that the semaphore implementation enforces FIFO<br>
order for wakeups -- the thread waiting longest in P() always grabs<br>
the semaphore after a V().

9


---

<a id="page-10"></a>
**Page 10**


### Problem 6 (a) Here is a proposed solution to the “H20” problem:

&emsp;&emsp;&emsp;&emsp;&emsp;`int numHydrogen = 0;`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`Semaphore pairOfHydrogen(0); // init 0`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`Semaphore oxygen(0);`   `// initially 0`

&emsp;&emsp;&emsp;&emsp;&emsp;`void hReady() {`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`numHydrogen++;`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`if ((numHydrogen % 2) == 0) {`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`pairOfHydrogen->V();`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`}`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`oxygen->P();`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`}`

&emsp;&emsp;&emsp;&emsp;&emsp;`void oReady() {`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`pairOfHydrogen->P();`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`makeWater();`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`oxygen->V();`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`oxygen->V();`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`}`<br>
This solution is dangerous.  Threads calling hReady() access shared<br>
data without holding a lock!  Many of you talked about what would<br>
happen if you got a timeslice after the increment and before the test,<br>
but remember that you can also get a timeslice in the middle of a C<br>
statement.  For example, you could have N threads both increment<br>
numHydrogen, and because they do so without a lock, the result<br>
could be 1 instead of N -- in other words, no water would be made<br>
regardless of how many H’s arrived.<br>
The solution is to put a lock acquire before the first line in hReady,<br>
and release before the Semaphore::P.  Some put the lock acquire after<br>
the increment, and that simply doesn’t work!

10


---

<a id="page-11"></a>
**Page 11**


### Problem 6 (b) Another proposed solution to the “H20” problem:

&emsp;&emsp;&emsp;&emsp;&emsp;Semaphore hPresent(0);   // initially 0<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Semaphore waitForWater(0); // initially 0

&emsp;&emsp;&emsp;&emsp;&emsp;`void hReady() {`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`hPresent->V();`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`waitForWater->P();`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`}`

&emsp;&emsp;&emsp;&emsp;&emsp;`void oReady() {`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`hPresent->P();`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`hPresent->P();`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`makeWater();`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`waitForWater->V();`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`waitForWater->V();`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`}`<br>
This is dangerous, since it may lead to starvation.  If two H’s arrive,<br>
then the value of the hPresent semaphore will be 2.  If two O’s<br>
arrive, then they can each decrement hPresent, before either can<br>
decrement it twice.  So no water is made, even though enough atoms<br>
have arrived.<br>
The fix is to put a lock acquire before the first line in oReady, and a<br>
lock release after the two semaphore:P’s.  This way, only one oxygen<br>
looks for waiting H’s at a time -- if there aren’t enough H’s for the<br>
first oxygen, there won’t be enough for any of the later oxygens<br>
either.

11


---

<a id="page-12"></a>
**Page 12**

**Extra Credit Question**: (2 points)<br>
Which provides the best average response time when there are<br>
multiple servers (bank tellers, supermarket cash registers, airline<br>
ticket takers, etc.): a single FIFO queue or a FIFO queue per server?<br>
Why?  Assume that you can’t predict how long any customer is going<br>
to take at the server, and that once you pick a queue to wait in, you<br>
are stuck and can’t change queues.<br>
A single queue is better.  Consider what happens if when you arrive,<br>
no one is waiting, but every server is busy.  You’d much rather wait<br>
in a single queue for the first server that becomes free, than have to<br>
commit to one of the queues -- it’s likely you would be waiting while<br>
there is a server free.  In queueing theory terms, multiple queues for<br>
multiple servers is not “work conserving” -- a server can be idle<br>
even though there are people/jobs waiting.  A single queue is always<br>
work conserving.<br>
There’s a much more rigorous mathematical proof of why single<br>
queues are better than multiple queues in Kleinrock, Queueing<br>
Theory, Volume 1, along with lots more useful stuff.  For instance, if<br>
you arrive at a random point in time at a bus stop, and the buses<br>
arrive at fixed intervals, then your average wait will be the half the<br>
inter-bus interval.  What happens if the buses arrive randomly, but<br>
with the same average inter-bus interval?  It turns out randomness<br>
hurts -- your average wait will always be longer than if the buses<br>
arrive at fixed intervals.

12

