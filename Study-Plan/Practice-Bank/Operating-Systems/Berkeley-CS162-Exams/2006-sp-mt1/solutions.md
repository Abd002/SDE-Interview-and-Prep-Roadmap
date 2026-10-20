# Berkeley CS162 Spring 2006: Midterm 1: Official solutions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;University of California, Berkeley<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;College of Engineering<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Computer Science Division – EECS<br>
Spring 2006                                     Anthony D. Joseph<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Midterm Exam Solutions**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;March 8, 2006<br>
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

Page 1/11


---

<a id="page-2"></a>
**Page 2**

CS 162 Spring 2006 Midterm Exam        March 8, 2006<br>
Solutions

1\. (21 points total) Short answer questions:<br>
&emsp;a. (4 points) True/False and Why?<br>
&emsp;&emsp;Lottery scheduling can be used to implement any other scheduling algorithm.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;TRUE                    FALSE<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Why?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**FALSE**. Lottery scheduling cannot implement strict priority scheduling,<br>
&emsp;&emsp;&emsp;&emsp;&emsp;FIFO, or real-time scheduling. The correct answer was worth 2 points<br>
&emsp;&emsp;&emsp;&emsp;&emsp;and the justification was worth an additional 2 points.

&emsp;b.  (5 points) Inverted Page Tables:<br>
&emsp;&emsp;i) (3 points) Give a two to three sentence description of an inverted page table.<br>
&emsp;&emsp;&emsp;An inverted page table uses a hash function to map virtual addresses to<br>
&emsp;&emsp;&emsp;physical addresses..

&emsp;&emsp;ii) (2 points) Briefly (2-3 sentences) state the problem it is intended to solve.<br>
&emsp;&emsp;&emsp;An inverted page table supports a large virtual address space while only<br>
&emsp;&emsp;&emsp;requiring a physical page table that is proportional in size to the available<br>
&emsp;&emsp;&emsp;physical memory (an forward page table would require physical memory<br>
&emsp;&emsp;&emsp;proportional to the size of virtual memory). We did not give credit for answers<br>
&emsp;&emsp;&emsp;that stated the only problem it solves is reducing the number of lookups to<br>
&emsp;&emsp;&emsp;memory.

&emsp;c. (4 points) Why would two processes want to use shared memory for<br>
&emsp;&emsp;communication instead of using message passing? Your answer should be brief<br>
&emsp;&emsp;(no more than 5 sentences).<br>
&emsp;&emsp;&emsp;Shared memory has **higher performance** because you **avoid the context**<br>
&emsp;&emsp;&emsp;**switch overhea**d of using message passing through the kernel. We gave full<br>
&emsp;&emsp;&emsp;credit only if your answer included both performance and context switch<br>
&emsp;&emsp;&emsp;overhead.

Page 2/11


---

<a id="page-3"></a>
**Page 3**

CS 162 Spring 2006 Midterm Exam        March 8, 2006<br>
Solutions

&emsp;d. (4 points) We say that the operating system is an “illusionist”. Name two illusions<br>
&emsp;&emsp;that it provides:<br>
&emsp;&emsp;i) (2 points) Illusion #1:<br>
&emsp;&emsp;&emsp;Any of the many illusions we’ve discussed were acceptable: exclusive access<br>
&emsp;&emsp;&emsp;to CPU, memory, disk or I/O devices; “infinite” memory; etc..

&emsp;&emsp;ii) (2 points) Illusion #2:<br>
&emsp;&emsp;&emsp;See above.

&emsp;e. (4 points) For system calls, we explained that arguments are sanity checked twice.<br>
&emsp;&emsp;i) (2 points) When is each check performed?<br>
&emsp;&emsp;&emsp;Before entering the kernel and after entering the kernel.

&emsp;&emsp;ii) (2 points) Why is this redundancy important?<br>
&emsp;&emsp;&emsp;The first check is a sanity check of the arguments, the second check is for<br>
&emsp;&emsp;&emsp;security purposes to detect race conditions between the current thread and<br>
&emsp;&emsp;&emsp;other threads that attempt to maliciously modify the arguments (Time of<br>
&emsp;&emsp;&emsp;Check to Time of Use vulnerability). We only gave full credit for answers that<br>
&emsp;&emsp;&emsp;explicitly mentioned the race condition.

Page 3/11


---

<a id="page-4"></a>
**Page 4**

CS 162 Spring 2006 Midterm Exam        March 8, 2006<br>
Solutions<br>
2\. (54 points total) CPU Scheduling. Here is a table of processes and their associated<br>
&emsp;arrival and running times.


![Figure on page 4](figures/solutions-p04-fig03.png)

&emsp;a. (15 points) Show the scheduling order for these processes under First-In-First-Out<br>
&emsp;&emsp;(FIFO), Shortest-Job First (SJF), and Round-Robin (RR) with a quantum = 1 time<br>
&emsp;&emsp;unit. Assume that the context switch overhead is 0 and new processes are added<br>
&emsp;&emsp;to the **head** of the queue except for FIFO.


![Figure on page 4](figures/solutions-p04-fig04.png)

Page 4/11


---

<a id="page-5"></a>
**Page 5**

CS 162 Spring 2006 Midterm Exam        March 8, 2006<br>
Solutions<br>
&emsp;b. (18 points) For each process in each schedule above, indicate the queue wait time<br>
&emsp;&emsp;and turnaround time (TRT).


![Figure on page 5](figures/solutions-p05-fig05.png)

&emsp;&emsp;&emsp;&emsp;&emsp;The queue wait time is the total time a thread spends in the wait queue.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;The turnaround time is defined as the time a process takes to complete<br>
&emsp;&emsp;&emsp;&emsp;&emsp;after it arrives.<br>
&emsp;Part a) 5 points per column, part b) 3 points per row. We deducted one point per<br>
&emsp;error up to the maximum score for the column/row. We deducted one point for a<br>
&emsp;wrong overall arrival time.

Page 5/11


---

<a id="page-6"></a>
**Page 6**

CS 162 Spring 2006 Midterm Exam        March 8, 2006<br>
Solutions<br>
&emsp;c. (6 points) Approximate Shortest Remaining Time First.<br>
&emsp;&emsp;i) (3 points) How can you approximate Shortest Remaining Time First scheduling<br>
&emsp;&emsp;&emsp;without knowing how long a job takes ahead of time?<br>
&emsp;&emsp;&emsp;You can approximate it by looking at the past CPU burst behavior to predict<br>
&emsp;&emsp;&emsp;the future CPU burst behavior. Exceeding a quantum indicates the job is long<br>
&emsp;&emsp;&emsp;running, while yielding before the quantum indicates the job is short running.

&emsp;&emsp;ii) (3 points) How would you implement this approximation in a Lottery<br>
&emsp;&emsp;&emsp;Scheduler?<br>
&emsp;&emsp;&emsp;The basic solution is to take/give tickets based upon CPU usage. We gave full<br>
&emsp;&emsp;&emsp;credit for answers that explained how you give or take tickets in a quantum<br>
&emsp;&emsp;&emsp;period based on CPU usage, and starting with one ticket.

&emsp;d. (15 points) Scheduling Algorithm Pros and Cons. For each of the four algorithms<br>
&emsp;&emsp;discussed in class, list the pros and cons of the algorithm, and give one example<br>
&emsp;&emsp;situation where each algorithm would be a bad choice.<br>
&emsp;&emsp;i) (3 points) First-Come, First-Served.<br>
&emsp;&emsp;&emsp;(1) Pros:<br>
&emsp;&emsp;&emsp;The answers were the ones we talked about in class, or in the book. We gave<br>
&emsp;&emsp;&emsp;one point for each pro/con answer.<br>
&emsp;&emsp;&emsp;Easy to implement. Fair to all in order arrived.

&emsp;&emsp;&emsp;(2) Cons:<br>
&emsp;&emsp;&emsp;Short jobs can be stuck behind long jobs – “convoy” effect.

&emsp;&emsp;&emsp;(3) Bad choice example:<br>
&emsp;&emsp;&emsp;One long job followed by a short job..

Page 6/11


---

<a id="page-7"></a>
**Page 7**

CS 162 Spring 2006 Midterm Exam        March 8, 2006<br>
Solutions<br>
&emsp;&emsp;ii) (3 points) Round Robin.<br>
&emsp;&emsp;&emsp;(1)  Pros:<br>
&emsp;&emsp;&emsp;Easy to implement. Good for short jobs (they don’t get stuck behind long<br>
&emsp;&emsp;&emsp;jobs)..

&emsp;&emsp;&emsp;(2) Cons:<br>
&emsp;&emsp;&emsp;Context switch times are a high overhead for long jobs. High TRT for equal<br>
&emsp;&emsp;&emsp;length jobs..<br>
&emsp;&emsp;&emsp;(3) Bad choice example:<br>
&emsp;&emsp;&emsp;Multiple equal length jobs..

&emsp;&emsp;iii) (3 points) Shortest Job First/Shortest Remaining Time First<br>
&emsp;&emsp;&emsp;(1) Pros:<br>
&emsp;&emsp;&emsp;Optimal algorithm (i.e., best response time). Saying just “optimal” was not<br>
&emsp;&emsp;&emsp;given points..<br>
&emsp;&emsp;&emsp;(2) Cons:<br>
&emsp;&emsp;&emsp;Long jobs are starved. Predicting the future is hard..

&emsp;&emsp;&emsp;(3) Bad choice example:<br>
&emsp;&emsp;&emsp;An example with long jobs being starved or programs doing extra I/O in order<br>
&emsp;&emsp;&emsp;to appear to have short CPU bursts.

&emsp;&emsp;iv) (3 points) Lottery<br>
&emsp;&emsp;&emsp;(1) Pros:<br>
&emsp;&emsp;&emsp;Lowest priority jobs not starved. Highest priority jobs prioritized over lower<br>
&emsp;&emsp;&emsp;priority jobs. Flexible (adaptable to behave as other algorithms).

&emsp;&emsp;&emsp;(2) Cons:<br>
&emsp;&emsp;&emsp;Hard to debug. Cannot exactly control or predict next job..<br>
&emsp;&emsp;&emsp;(3) Bad choice example:<br>
&emsp;&emsp;&emsp;Some example that shows necessity to tightly control what executes next,<br>
&emsp;&emsp;&emsp;which may make lottery worse than priority (given that it tries to improve on<br>
&emsp;&emsp;&emsp;priority). We didn’t give credit for simply making an argument about<br>
&emsp;&emsp;&emsp;overhead or approximation of RR when equal-sized jobs. The same applies to<br>
&emsp;&emsp;&emsp;iv) 2.

Page 7/11


---

<a id="page-8"></a>
**Page 8**

CS 162 Spring 2006 Midterm Exam        March 8, 2006<br>
Solutions<br>
No Credit – **Problem X** (000000000000 points)<br>
**The 2005 Ig Nobel Prize Winners**<br>
The 2005 Ig Nobel Prizes were awarded on Thursday October 6, 2005 at the 15th First Annual Ig Nobel<br>
Prize Ceremony, at Harvard's Sanders Theatre.<br>
AGRICULTURAL HISTORY: James Watson of Massey University, New Zealand, for his scholarly study,<br>
"The Significance of Mr. Richard Buckley’s Exploding Trousers."<br>
REFERENCE: "The Significance of Mr. Richard Buckley’s Exploding Trousers: Reflections on an Aspect<br>
of Technological Change in New Zealand Dairy -Farming between the World Wars," James Watson,<br>
Agricultural History, vol. 78, no. 3, Summer 2004, pp. 346-60.<br>
PHYSICS: John Mainstone and the late Thomas Parnell of the University of Queensland, Australia, for<br>
patiently conducting an experiment that began in the year 1927 – in which a glob of congealed black tar has<br>
been slowly, slowly dripping through a funnel, at a rate of approximately one drop every nine years.<br>
REFERENCE: "The Pitch Drop Experiment," R. Edgeworth, B.J. Dalton and T. Parnell, European Journal<br>
of Physics, 1984, pp. 198-200.<br>
MEDICINE: Gregg A. Miller of Oak Grove, Missouri, for inventing Neuticles – artificial replacement<br>
testicles for dogs, which are available in three sizes, and three degrees of firmness.<br>
REFERENCES: US Patent #5868140, and the book Going Going NUTS!, by Gregg A. Miller,<br>
PublishAmerica, 2004, ISBN 1413753167.<br>
LITERATURE: The Internet entrepreneurs of Nigeria, for creating and then using e-mail to distribute a<br>
bold series of short stories, thus introducing millions of readers to a cast of rich characters – General Sani<br>
Abacha, Mrs. Mariam Sanni Abacha, Barrister Jon A Mbeki Esq., and others -- each of whom requires just<br>
a small amount of expense money so as to obtain access to the great wealth to which they are entitled and<br>
which they would like to share with the kind person who assists them.<br>
PEACE: Claire Rind and Peter Simmons of Newcastle University, in the U.K., for electrically monitoring<br>
the activity of a brain cell in a locust while that locust was watching selected highlights from the movie<br>
"Star Wars."<br>
REFERENCE: "Orthopteran DCMD Neuron: A Reevaluation of Responses to Moving Objects. I. Selective<br>
Responses to Approaching Objects," F.C. Rind and P.J. Simmons, Journal of Neurophysiology, vol. 68, no.<br>
5, November 1992, pp. 1654-66.<br>
ECONOMICS: Gauri Nanda of the Massachusetts Institute of Technology, for inventing an alarm clock<br>
that runs away and hides, repeatedly, thus ensuring that people DO get out of bed, and thus theoretically<br>
adding many productive hours to the workday.<br>
CHEMISTRY: Edward Cussler of the University of Minnesota and Brian Gettelfinger of the University of<br>
Minnesota and the University of Wisconsin, for conducting a careful experiment to settle the longstanding<br>
scientific question: can people swim faster in syrup or in water?<br>
REFERENCE: "Will Humans Swim Faster or Slower in Syrup?" American Institute of Chemical Engineers<br>
NUTRITION: Dr. Yoshiro Nakamats of Tokyo, Japan, for photographing and retrospectively analyzing<br>
every meal he has consumed during a period of 34 years (and counting).<br>
FLUID DYNAMICS: Victor Benno Meyer-Rochow of International University Bremen, Germany and the<br>
University of Oulu , Finland; and Jozsef Gal of Loránd Eötvös University, Hungary, for using basic<br>
principles of physics to calculate the pressure that builds up inside a penguin, as detailed in their report<br>
"Pressures Produced When Penguins Pooh -- Calculations on Avian Defaecation."<br>
PUBLISHED IN: Polar Biology, vol. 27, 2003, pp. 56-8.

Page 8/11


---

<a id="page-9"></a>
**Page 9**

CS 162 Spring 2006 Midterm Exam        March 8, 2006<br>
Solutions

3\. (12 points total) Concurrency problem: Dining Philosophers.<br>
&emsp;The goal of this exercise is to implement a solution to the Dining Philosophers<br>
&emsp;problem using only semaphores (your solution may not use locks, monitors, or other<br>
&emsp;synchronization primitives). Create a method `Dine()`, which waits until a diner has<br>
&emsp;two chopsticks and can eat, then calls `Eat()`, and then releases the chopsticks before<br>
&emsp;returning. Your solution should allow multiple philosophers to eat at the same time<br>
&emsp;(as long as there are sufficient chopsticks in a pile in the middle of the table). Assume<br>
&emsp;you are given the variable, `chopsticks`, which starts off initialized to the total<br>
&emsp;number of chopsticks available. Your solution should avoid deadlock.<br>
&emsp;a. (4 points) Specify the correctness constraints. Be succinct and explicit in your<br>
&emsp;&emsp;answer.<br>
&emsp;&emsp;A diner waits for two chopsticks (4 points).<br>
&emsp;&emsp;We gave one point for some other type of related constraint (e.g., you can’t steal<br>
&emsp;&emsp;chopsticks, there’s one chopstick per diner, etc.) We subtracted one point for<br>
&emsp;&emsp;saying something that is implementation dependent or otherwise not a correctness<br>
&emsp;&emsp;constraint.<br>
&emsp;b. (8 points) Implement the `Dine()` method.<br>
&emsp;&emsp;The key insight is to set the initial value of the semaphore to half the number of<br>
&emsp;&emsp;chopsticks. Then, each P operation effectively grabs two chopsticks and each V<br>
&emsp;&emsp;operation relinquishes two chopsticks.<br>
&emsp;`Int chopsticks = N;`     `// Total number of chopsticks`<br>
&emsp;`Semaphore sticks = new Semaphore(floor(chopsticks/2));`<br>
&emsp;`Dine() {`<br>
&emsp;`sticks.P();`        `// This “acquires” two chopsticks`<br>
&emsp;`Eat();`<br>
&emsp;`sticks.V();`        `// This “releases” two chopsticks`<br>
&emsp;`}`<br>
&emsp;-8 pts: using other synchronization primitives (i.e., locks, CVs, interrupts)<br>
&emsp;-7 pts: didn’t enforce correctness constraint (need two chopsticks to eat).<br>
&emsp;-7 pts:  trying to use a semaphore in an illegal way (e.g., trying to check the value)<br>
&emsp;-6 pts: only one diner can eat at a time.<br>
&emsp;-5 pts: no call to Eat()<br>
&emsp;-5 pts: deadlock possible<br>
&emsp;-5 pts: busy waiting<br>
&emsp;-5 pts: solution fails if chopsticks is initially set to some value<br>
&emsp;-1 pt: extraneous/redundant semaphores<br>
&emsp;-1 pt: didn’t show initialization of semaphore value

Page 9/11


---

<a id="page-10"></a>
**Page 10**

CS 162 Spring 2006 Midterm Exam        March 8, 2006<br>
Solutions<br>
&emsp;&emsp;Another solution:<br>
&emsp;`Int chopsticks = N;`     `// Total number of chopsticks`<br>
&emsp;`Semaphore Lock = new Semaphore (1);    // mutex`<br>
&emsp;`Semaphore Sem1 = new Semaphore (chopsticsk);  // scheduling`<br>
&emsp;`Dine {`<br>
&emsp;`Lock.P();`        `// This “acquires” mutex`<br>
&emsp;`Sem1.P();`        `// This “acquires” one chopstick`<br>
&emsp;`Sem1.P();`        `// This “acquires” one chopstick`<br>
&emsp;`Lock.V();`        `// This “releases” mutex`<br>
&emsp;`Eat();`<br>
&emsp;`Sem1.V();`        `// This “releases” one chopstick`<br>
&emsp;`Sem1.V();`        `// This “releases” one chopstick`<br>
&emsp;`}`<br>
&emsp;&emsp;Yet another solution:<br>
&emsp;`Int chopsticks = N;`     `// Total number of chopsticks`<br>
&emsp;`Semaphore reach = new Semaphore (1);    // mutex`<br>
&emsp;`Semaphore waiting = new Semaphore (0);  // scheduling`<br>
&emsp;`Dine() {`<br>
&emsp;`reach.P();`        `// This “acquires” mutex`<br>
&emsp;`while (chopsticks < 2) {`<br>
&emsp;`reach.V();`        `// This “releases” mutex`<br>
&emsp;`wait.P();`        `// This “waits” on semaphore`<br>
&emsp;`reach.P();`        `// This “acquires” mutex`<br>
&emsp;`}`<br>
&emsp;`chopsticks -= 2;`<br>
&emsp;`reach.V();`        `// This “releases” mutex`<br>
&emsp;`Eat();`<br>
&emsp;`Reach.P();`        `// This “acquires” mutex`<br>
&emsp;`chopsticks += 2;`<br>
&emsp;`reach.V();`        `// This “releases” mutex`<br>
&emsp;`wait.V();`        `// This “wakes” waiters`<br>
&emsp;`}`

Page 10/11


---

<a id="page-11"></a>
**Page 11**

CS 162 Spring 2006 Midterm Exam        March 8, 2006<br>
Solutions

4\. (13 points) Virtual Memory.<br>
The Lemon company has hired you to design the virtual memory system for their new<br>
line of desktop computers, the iniM caM. Each computer will have 32 bit virtual and<br>
physical addresses, and memory will be allocated in 2 KByte pages.<br>
&emsp;a. (4 points) For a single-level page table, how many bits will be used to index the<br>
&emsp;&emsp;page, and how many will be the offset within the page?<br>
&emsp;&emsp;i) (2 points) Number of bits for page number?<br>
&emsp;&emsp;&emsp;Using the answer of 11 bits from ii), the remainder is 32-11 = 21 bits.

&emsp;&emsp;ii) (2 points) Number of bits for offset within the page?<br>
&emsp;&emsp;&emsp;Each page is 2 Kbytes in size which equals 211 bits, so 11 bits are needed for<br>
&emsp;&emsp;&emsp;the offset.

&emsp;b. (5 points) Each page table entry will also include three bits for bookkeeping (Valid,<br>
&emsp;&emsp;Read, and Write bits).<br>
&emsp;&emsp;i) (2 points) How many bytes are required for each page table entry?<br>
&emsp;&emsp;&emsp;The page table entry contains the physical page number (21 bits) and the 3<br>
&emsp;&emsp;&emsp;bookkeeping bits, so the total size is 24 bits or 3 bytes. We deducted one point<br>
&emsp;&emsp;&emsp;for saying the PTE included virtual page numbers or for not converting the<br>
&emsp;&emsp;&emsp;value into bytes. We allowed the answer of 4 bytes only if you stated that PTEs<br>
&emsp;&emsp;&emsp;are word aligned and padded.

&emsp;&emsp;ii) (3 points) How much physical memory is required to store the table?<br>
&emsp;&emsp;&emsp;The table requires 3 x 221 bytes (6 Mbytes). For consistency, if we accepted<br>
&emsp;&emsp;&emsp;your answer of 4 bytes for part i), we expected an answer of 4 x 221 bytes (8<br>
&emsp;&emsp;&emsp;Mbytes).

&emsp;c. (4 points) If the iniM caM has 16 megabytes or less of physical memory, we can<br>
&emsp;&emsp;use 24 bit physical addresses (and still have 32 bit virtual addresses).  How large<br>
&emsp;&emsp;would each page table entry and the entire table be now?<br>
&emsp;&emsp;The PTE would now require 24-11 = 13 bits for the page portion, adding the 3<br>
&emsp;&emsp;bits for bookkeeping, yields a PTE of 16 bits or 2 bytes. The table will now be 2 x<br>
&emsp;&emsp;221 bytes (4 Mbytes). We did not accept answers that assumed the PTE would<br>
&emsp;&emsp;have 213 entries, since only an inverted table would have 213 entries, but it would<br>
&emsp;&emsp;have a larger PTE.

Page 11/11

