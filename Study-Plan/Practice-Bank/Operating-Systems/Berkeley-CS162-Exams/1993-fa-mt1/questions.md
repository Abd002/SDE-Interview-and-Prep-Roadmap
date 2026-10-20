# Berkeley CS162 Fall 1993: Midterm 1: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS162, Midterm #1, Fall/1993<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**CS162, Fall/1993**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Midterm 1**

**General Information**<br>
&nbsp &nbsp &nbsp This is a closed bok examination. You have 60 minutes to answer as many questions as<br>
possible. The number in parentheses at the beginning of each question indicates the number of points given to<br>
the question; there are 60 points in all. Write all of your answers directly on this paper. Make your answers as<br>
concise as possible (you needn't cover every available nano-acre with writing).<br>
&nbsp &nbsp &nbsp If there is something in a question you believe is open to interpretation, then please go<br>
ahead and interpret BUT state your assumptions in your answer.

**Problem #1: (6 points)**<br>
For each of the following statements, indicate in one sentence whether the statement is true or false, and why.

(a) &nbsp If a set of cooperating threads can correctly time-share one processor, then they will correctly<br>
execute on separate processors of a multiprocessor.

(b) &nbsp The CPU scheduling policy that minimizes average response time can never lead to starvation.

(c) &nbsp If a system employing only segmentation wants to enlarge an addresss space, it is always possible<br>
if the total amount of free memory is bigger than the requested enlargement.

**Problem #2: (8 points)**<br>
For each of the following items, write a one sentence definition.

(a) &nbsp Interrupt

(b) &nbsp Fully associative cache

(c) &nbsp Working set

(d) &nbsp Throughput

CS162, Fall/1993 Midterm 1professor (e.g., Professor J. Wawrzynek)   1


---

<a id="page-2"></a>
**Page 2**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS162, Midterm #1, Fall/1993

**Problem #3: (12 points)**<br>
(a) &nbsp What is the worst possible CPU scheduling algorithm - the one that yields the worst average<br>
response time? Assume that the algorithm must run a thread if there is one available, and that a context<br>
switch has zero overhead.

(b) &nbsp Can round robin ever be the worst possible CPU scheduling algorithm? If so, under what<br>
circumstances? If not, explain why not.

(c) &nbsp Can FIFO ever be the worst possible CPU scheduling algorithm? If so, under what circumstances?<br>
If not, explain why not.

**Problem #4: (10 points)**<br>
&nbsp &nbsp &nbsp Consider the clock algorithm for page replacement, being used in its simplest form<br>
("first-chance" replacement, where the clock is only advanced on a page fault, not in the background).<br>
Suppose that there are P pages of physical memory in the system and that over a particular interval of time F<br>
page faults have occurred.<br>
&nbsp &nbsp &nbsp Express the minimum and maximum number of times that the clock hand could<br>
possibly have been advancing during the time interval, as a function of P and F. (Don't worry about "off by<br>
one" errors, I'm just looking for the basic idea.)

**Problem #5: (24 points)**<br>
&nbsp &nbsp &nbsp you have been hired by your professor to be a grader for CS162. Below you will find<br>
some sample solutions to a concurrency assignment. For each poroposed solution, mark it either (i) "correct",<br>
if it has no flaws (ii) "incorrect", if it does not work, or (iii) "dangerous", if it sometimes works but<br>
sometimes doesn't. You may assume either Mesa-style or Hoare-style condition variables, but if it matters,<br>
you must say which one you are using.<br>
&nbsp &nbsp &nbsp If the solution is incorrect or dangerous, explain everything wrong with the solution,<br>
and add a **minimal** amount of code to correct the problem. (NOTE: don't just implement a completely<br>
different solution - use the code we provide as a base.)<br>
&nbsp &nbsp &nbsp Here is the sychronization problem: A particular river crossing is shared by both<br>
cannibals and missionaries. A boat is used to cross the river, but it only seats three people, and must always<br>
carry a full load. In order to guarantee the safety of the missionaries, you cannot put one missionary and two<br>
cannibals in the same boat (because the cannibals would gang up and eat the missionary), but all other<br>
combinations are legal. Two procedures are needed: MissionaryArrives and CannibalArrives , called by a<br>
missionary or cannibal when it arrives at the river bank. The procedures arrange the arriving missionaries and

Problem #2: (8 points)   2


---

<a id="page-3"></a>
**Page 3**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS162, Midterm #1, Fall/1993<br>
cannibals into safe boatloads; once the boat is full, one thread calls RowBoat and after the call ro RowBoat ,<br>
the three procedures then return. There should also be no undue waiting: missionaries and cannibals should<br>
not wait if there are enough of them for a safe boatload.

Here is one proposed solution:

`int numMissionaries = 0, numCannibals = 0;`<br>
`Lock *mutex;`<br>
`Condition *missWait, *canWiat;`

`void RowBoat(){ printf("Row, row, row your boat");}`

`void MissionaryArrives(){`<br>
`&nbsp mutex->Acquire();`<br>
`&nbsp if (numMissionaries==2){`<br>
`&nbsp &nbsp missWait->Signal();`<br>
`&nbsp &nbsp missWait->Signal();`<br>
`&nbsp &nbsp RowBoat();`<br>
`&nbsp else if (numMissionaries == 1 && numCannibals == 1){`<br>
`&nbsp &nbsp missWait->Signal();`<br>
`&nbsp &nbsp missWait->Signal();`<br>
`&nbsp &nbsp RowBoat();`<br>
`&nbsp } else {`<br>
`&nbsp &nbsp numMissionaries++;`<br>
`&nbsp &nbsp missionaryWiat->Wait(mutex);`<br>
`&nbsp &nbsp numMissionaries--;`<br>
`&nbsp }`<br>
`&nbsp mutex->Release();`<br>
`}`

`void CannibalArrives() {`<br>
`&nbsp mutex->Acquire();`<br>
`&nbsp if (numCannibals ==2) {`<br>
`&nbsp &nbsp cannWait->Signal();`<br>
`&nbsp &nbsp cannWait->Signal();`<br>
`&nbsp &nbsp RowBoat();`<br>
`&nbsp else if (numMissionaries == 2) {`<br>
`&nbsp &nbsp missWait->Signal();`<br>
`&nbsp &nbsp missWait->Signal();`<br>
`&nbsp &nbsp RowBoat();`<br>
`&nbsp } else {`<br>
`&nbsp &nbsp numCannibals++;`<br>
`&nbsp &nbsp cannWait->Wait(mutex);`<br>
`&nbsp &nbsp numCannibals--;`<br>
`&nbsp }`<br>
`&nbsp mutex->Release();`<br>
`}`

&nbsp &nbsp Here is another proposed solution (don't worry about the potential starvation due to the loop in<br>
PersonArrives - the scheduler causes lots of random timeslices!):

Problem #5: (24 points)   3


---

<a id="page-4"></a>
**Page 4**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS162, Midterm #1, Fall/1993

`Semaphore *boatCount = new Semaphore(3);`<br>
`int numMissionaries = 0, numCannibals = 0;`<br>
`Lock *boatLock;`<br>
`Condition *boatWait;`<br>
`bool success;`

`void RowBoat() { success = TRUE; }`<br>
`void MissionaryArrives() { PersonArrives(&numMissionariess); }`<br>
`void CannibalArrives() { PersonArrives(&numCannibals); }`

`void PersonArrives(int *numPeople) {`<br>
`&nbsp for(;;){`<br>
`&nbsp &nbsp boatCount->P();`<br>
`&nbsp &nbsp *numPeople++;`<br>
`&nbsp &nbsp if ((numMissionaries + numCannibals < 3) {`<br>
`&nbsp &nbsp &nbsp boatLock->Acquire();`<br>
`&nbsp &nbsp &nbsp boatWait->Wait(boatLock);`<br>
`&nbsp &nbsp } else {`<br>
`&nbsp &nbsp &nbsp if (!(numMissionaries == 1) && (numCannibals == 2))`<br>
`&nbsp &nbsp &nbsp &nbsp RowBoat();`<br>
`&nbsp &nbsp &nbsp else`<br>
`&nbsp &nbsp &nbsp &nbsp success = FALSE;`<br>
`&nbsp &nbsp &nbsp boatWait->Signal();`<br>
`&nbsp &nbsp &nbsp boatWait->Signal();`<br>
`&nbsp &nbsp }`<br>
`&nbsp &nbsp numPeople->P();`<br>
`&nbsp &nbsp boatCount->V();`<br>
`&nbsp &nbsp if (success)`<br>
`&nbsp &nbsp &nbsp return;`<br>
`&nbsp }`<br>
`}`

**Problem #6: Extra Credit (2 points)**<br>
Give an engineering estimate (to within a factor of 2 or so) of the number of barbers and hairdressers in the<br>
United States. Explain your method.

&emsp;**Posted by HKN (Electrical Engineering and Computer Science Honor Society)**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**University of California at Berkeley**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**If you have any questions about these online exams**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**please contact**  **examfile@hkn.eecs.berkeley.edu.**

Problem #6: Extra Credit (2 points)   4

