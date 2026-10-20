# Berkeley CS162 Spring 1999: Midterm 1: Official solutions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;University of California, Berkeley<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;College of Engineering<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Computer Science Division – EECS<br>
Spring 1999        Anthony D. Joseph<br>
&emsp;&emsp;&emsp;&emsp;**Midterm Exam Solutions and Grading Guidelines**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;March 3, 1999<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS162 Operating Systems


![Figure on page 1](figures/solutions-p01-fig01.png)

General Information:<br>
This is a **closed book** examination. You have two hours to answer as many questions as possible.<br>
The number in parentheses at the beginning of each question indicates the number of points given<br>
to the question; there are 100 points in all. You should read **all** of the questions before starting the<br>
exam, as some of the questions are substantially more time consuming.<br>
Write all of your answers directly on this paper.  Make your answers as concise as possible (you<br>
needn't cover every available nano-acre with writing). If there is something in a question that you<br>
believe is open to interpretation, then please go ahead and interpret, **but** state your assumptions in<br>
your answer.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Good Luck!!**


![Figure on page 1](figures/solutions-p01-fig02.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 1/8


---

<a id="page-2"></a>
**Page 2**

CS 162 Spring 1999 Midterm Exam   March 3, 1999

1\. Threads (13 points total):<br>
&emsp;a. (6 points) What state does a thread share with other threads in a process and what<br>
&emsp;&emsp;state is private/specific to a thread? Be explicit in your answer.<br>
&emsp;&emsp;Shared state:<br>
&emsp;&emsp;&emsp;(1) Contents of memory (global variables, heap)<br>
&emsp;&emsp;&emsp;(2) I/O state (file system)<br>
&emsp;&emsp;Having both answers is worth 3 points. Having one answer is worth 2 points.<br>
&emsp;&emsp;Private state:<br>
&emsp;&emsp;&emsp;(1) CPU registers (including, program counter and stack pointer)<br>
&emsp;&emsp;&emsp;(2) Execution stack<br>
&emsp;&emsp;Having both answers is worth 3 points. Having one answer is worth 2 points.<br>
&emsp;b. (7 points) Draw a picture of the three states of a thread and label the transitions<br>
&emsp;&emsp;between the states:


![Figure on page 2](figures/solutions-p02-fig03.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;thread signal<br>
&emsp;&emsp;Each state and each arc is worth 1 point.<br>
2\. Context switching and CPU scheduling (24 points total):<br>
&emsp;a. (3 points) What state is saved on a context switch between threads?<br>
&emsp;&emsp;CPU registers, program counter, and stack pointer.<br>
&emsp;&emsp;Each answer is worth 1 point.<br>
&emsp;b. (6 points) List two reasons why Nachos disables interrupts when a thread/process sleeps,<br>
&emsp;&emsp;yields, or switches to a new thread/process?<br>
&emsp;&emsp;Interrupts are disabled for two reasons:<br>
&emsp;&emsp;&emsp;(1) To prevent context switching from occurring while registers are being<br>
&emsp;&emsp;&emsp;&emsp;&emsp;saved/restored.<br>
&emsp;&emsp;&emsp;(2) To enable a thread/process to add itself to a queue (e.g., a wait queue)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;without allowing another thread to interrupt the action.<br>
&emsp;&emsp;Each answer is worth 3 points. If the answer was not specific about the potential<br>
&emsp;&emsp;conflict that could occur, we deducted 1 point.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 2/8


---

<a id="page-3"></a>
**Page 3**

CS 162 Spring 1999 Midterm Exam   March 3, 1999

&emsp;c. (15 points) Consider the following processes, arrival times, and CPU processing<br>
&emsp;&emsp;requirements:


![Figure on page 3](figures/solutions-p03-fig04.png)

&emsp;For each of the following scheduling algorithms, fill in the table with the process that<br>
&emsp;is running on the CPU (for timeslice-based algorithms, assume a 1 unit timeslice):<br>
&emsp;For RR, assume that an arriving thread is scheduled to run at the beginning of its<br>
&emsp;arrival time.


![Figure on page 3](figures/solutions-p03-fig05.png)

&emsp;&emsp;Each column is worth 5 points: 3 for correctness of the schedule (we deducted<br>
&emsp;&emsp;1/2/3 points if you made minor/intermediate/major mistakes), and 2 for the<br>
&emsp;&emsp;average response time (1 point was deducted for minor errors).

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 3/8


---

<a id="page-4"></a>
**Page 4**

CS 162 Spring 1999 Midterm Exam   March 3, 1999

3\. Concurrency control (18 points total):<br>
&emsp;c. (6 points) Match the terms in column A with the most appropriate definition from<br>
&emsp;&emsp;column B.

&emsp;&emsp;&emsp;Column A   Column B<br>
&emsp;&emsp;&emsp;1\. Synchronization   a. Piece of code that only one<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;thread can execute at once<br>
&emsp;&emsp;&emsp;2\. Mutual exclusion   b. Ensuring that only one thread<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;does a particular thing at a time<br>
&emsp;&emsp;&emsp;3\. Critical section   c. Isolating program faults to an<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;address space<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;d. Using atomic operations to<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;ensure cooperation between<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;threads<br>
&emsp;&emsp;1\. d<br>
&emsp;&emsp;2\. b<br>
&emsp;&emsp;3\. a<br>
&emsp;&emsp;Each answer is worth 2 points.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 4/8


---

<a id="page-5"></a>
**Page 5**

CS 162 Spring 1999 Midterm Exam   March 3, 1999

&emsp;d. (12 points) For the following implementation of a banking application, say whether<br>
&emsp;&emsp;it either (i) works, (ii) doesn’t work, or (iii) is dangerous – that is, sometimes<br>
&emsp;&emsp;works and sometimes doesn’t.  If the implementation does not work or is<br>
&emsp;&emsp;dangerous, explain why (there maybe several errors) and show how to fix it so it<br>
&emsp;&emsp;does work. Note that `ThreadFork` does the obvious thing.<br>
&emsp;&emsp;`BankServer() {`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`while (TRUE) {`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`ReceiveRequest(&op, &acctId1, &acctId2, &amount);`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`if (op == transfer) ThreadFork(Transfer(acctId1, acctId2, amount));`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`else if …`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`}`<br>
&emsp;&emsp;`}`<br>
&emsp;&emsp;`Transfer(acctId1, acctId2, amount) {`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`account[acctId1]->Lock();`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`acct1 = GetAccount(acctId1); /* May involve disk I/O */`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`account[acctId2]->Lock();`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`acct2 = GetAccount(acctId2); /* May involve disk I/O */`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`if (acct1->balance < amount) return ERROR;`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`acct1->balance -= amount; acct2->balance += amount;`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`StoreAccount(acct1); /* Involves disk I/O */`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`StoreAccount(acct2); /* Involves disk I/O */`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`account[acctId1]->Unlock(); account[acctId2]->Unlock();`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`return OK;`<br>
&emsp;&emsp;`}`<br>
&emsp;&emsp;This implementation is (iii) dangerous, it will work sometimes (2 pts for this answer). Two<br>
&emsp;&emsp;problems: I/O may occur while the second account is being retrieved, leading to deadlock if there<br>
&emsp;&emsp;is a cycle of simultaneous transfers (A-\>B and B-\>A). Deadlock may also occur when an ERROR<br>
&emsp;&emsp;occurs, since the locks are not released (2 pts for describing each error). Solution: Acquire locks<br>
&emsp;&emsp;in the order of acctId values and release locks upon error. Each good solution is worth 3 pts. We<br>
&emsp;&emsp;deducted: 1 pt for solutions that used a global lock around the acquisition of both locks (it<br>
&emsp;&emsp;serializes the start of all transfers), 2 pts for solutions that used a global lock around the entire<br>
&emsp;&emsp;transfer (very inefficient). Adding a check to ensure that the acctId’s are not identical was worth 1<br>
&emsp;&emsp;pt of extra credit. No extra credit was given for performance improvements.<br>
&emsp;&emsp;`Transfer(acctId1, acctId2, amount) {`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`If (acctId1 > acctId2) {`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`account[acctId1]->Lock();`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`account[acctId2]->Lock();`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`} else {`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`account[acctId2]->Lock();`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`account[acctId1]->Lock();`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`}`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`acct1 = GetAccount(acctId1); /* May involve disk I/O */`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`acct2 = GetAccount(acctId2); /* May involve disk I/O */`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`if (acct1->balance < amount) {`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`account[acctId1]->Unlock(); account[acctId2]->Unlock();`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`return ERROR;`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`}`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`acct1->balance -= amount; acct2->balance += amount;`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`StoreAccount(acct1); /* Involves disk I/O */`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`StoreAccount(acct2); /* Involves disk I/O */`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`account[acctId1]->Unlock(); account[acctId2]->Unlock();`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`return OK;`<br>
&emsp;&emsp;`}`<br>
4\. Memory management (30 points total):<br>
&emsp;a. (6 points) Consider a memory system with a cache access time of 100ns and a<br>
&emsp;&emsp;memory access time of 1200ns. If the effective access time is 10% greater than<br>
&emsp;&emsp;the cache access time, what is the hit ratio H? (fractional answers are OK)<br>
&emsp;&emsp;Effective Access Time: Te = H % Tc + (1 – H)(Tm + Tc),<br>
&emsp;&emsp;&emsp;&emsp;&emsp;where Tc = 100ns, Te = 1.1 % Tc , and Tm = 1200ns.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 5/8


---

<a id="page-6"></a>
**Page 6**

CS 162 Spring 1999 Midterm Exam   March 3, 1999

&emsp;&emsp;Thus,    (1.1)(100) = 100H + (1 – H)(1200 + 100)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;110 = 100H + 1300 – 1300H<br>
&emsp;&emsp;&emsp;&emsp;&emsp;H = 119/120<br>
&emsp;We awarded 3 pts for the correct formula and 3 pts for the correct answer. Many<br>
&emsp;students missed the fact that the miss time includes **both** the memory access time and<br>
&emsp;the cache access time. If the formula was missing the cache access time, we deducted<br>
&emsp;two points – if the answer based upon this incorrect formula was correct, we did not<br>
&emsp;deduct any additional points.

&emsp;b. (6 points) Assuming a page size of 4 KB and that page table entry takes 4 bytes,<br>
&emsp;&emsp;how many levels of page tables would be required to map a 32-bit address space<br>
&emsp;&emsp;if every page table fits into a single page? Be explicit in your explanation.<br>
&emsp;&emsp;A 1-page page table contains 1024 or 210 PTEs, pointing to 210 pages (addressing<br>
&emsp;&emsp;a total of 210 % 212 = 222 bytes). Adding another level yields another 210 pages of<br>
&emsp;&emsp;page tables, addressing 210 % 210 % 212 = 232 bytes. So, we need 2 levels.<br>
&emsp;&emsp;The correct answer is worth 2 pts. Correct reasoning is worth up to 4 pts (1 pt for<br>
&emsp;&emsp;identifying that there are 210 PTEs per page, 1 pt for describing how page tables<br>
&emsp;&emsp;are nested, and 2 pts based upon the quality of the argument).<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;10 bit page   10 bit page   12 bit offset


![Figure on page 6](figures/solutions-p06-fig06.png)

&emsp;c. (18 points) Consider a multi-level memory management using the following virtual<br>
&emsp;&emsp;addresses:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Virtual seg #   Virtual Page #   Offset<br>
&emsp;&emsp;Each virtual address has 2 bits of virtual segment #, 8 bits of virtual page #, and<br>
&emsp;&emsp;12 bits of offset. Page table entries are 8 bits. All values are in hexadecimal.<br>
&emsp;&emsp;Translate the following virtual addresses into physical addresses:

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 6/8


---

<a id="page-7"></a>
**Page 7**

CS 162 Spring 1999 Midterm Exam   March 3, 1999


![Figure on page 7](figures/solutions-p07-fig07.png)


![Figure on page 7](figures/solutions-p07-fig08.png)

&emsp;&emsp;Each correct translation is worth 3 pts. For answers that listed a translation<br>
&emsp;&emsp;when it is invalid, we deducted 1 pt.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Segment Table**


![Figure on page 7](figures/solutions-p07-fig09.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Physical Memory**


![Figure on page 7](figures/solutions-p07-fig10.png)

5\. Design tradeoffs (15 points total):<br>
&emsp;A hardware designer asks for your input on the design of a new processor and<br>
&emsp;computer. You can spend $1500 dollars on the following components:


![Figure on page 7](figures/solutions-p07-fig11.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 7/8


---

<a id="page-8"></a>
**Page 8**

CS 162 Spring 1999 Midterm Exam   March 3, 1999


![Figure on page 8](figures/solutions-p08-fig12.png)

&emsp;&emsp;The page size is fixed at 16KB. Assume you want to run 3 – 4 applications<br>
&emsp;&emsp;simultaneously. Each application has an overall maximum size of 64 MB and a<br>
&emsp;&emsp;working set size of 256KB. TLB entries do not have Process Identifiers. Discuss<br>
&emsp;&emsp;how you would divide the available funds across the various items to optimize<br>
&emsp;&emsp;performance.<br>
&emsp;&emsp;We start with the disk. Since the disk is the slowest component of the system, we<br>
&emsp;&emsp;take the minimum size, 2048MB or $410, leaving us with $1,090. Since the TLB<br>
&emsp;&emsp;does not contain process identifiers, we only need the minimum number of entries<br>
&emsp;&emsp;to map the working set – 256KB / 16KB = 16 entries or $320, leaving us with<br>
&emsp;&emsp;$770. With the remaining money, we could buy 385 MB. However, we will only<br>
&emsp;&emsp;ever need to have 4 % 64MB = 256 MB of memory or $512. So, we could spend<br>
&emsp;&emsp;the leftover $258 on another 12 TLB entries ($240). Increasing the TLB by this<br>
&emsp;&emsp;amount will improve performance somewhat, since the working set will change<br>
&emsp;&emsp;over time. It does not make sense to increase the TLB any more, since that would<br>
&emsp;&emsp;require that we decrease the memory size below the requirements for the<br>
&emsp;&emsp;applications; a situation that will cause the system to start paging.<br>
&emsp;&emsp;We awarded 3 points per choice, based upon the reasonableness of the choices.<br>
&emsp;&emsp;We used the following table:


![Figure on page 8](figures/solutions-p08-fig13.png)

&emsp;&emsp;We awarded another 3 points if the TLB answer was based upon an analysis of<br>
&emsp;&emsp;the applications’ working set size (i.e., only 16 entries are necessary, since they<br>
&emsp;&emsp;will map the working set and the TLB does not include process identifiers).<br>
&emsp;&emsp;We awarded an additional three points based upon the overall reasonableness of<br>
&emsp;&emsp;the answer. For example, a system with a small amount of paging would lose a<br>
&emsp;&emsp;point, while a system with a significant amount of paging (e.g., only 128 MB of<br>
&emsp;&emsp;memory), would lose two points.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Page 8/8

