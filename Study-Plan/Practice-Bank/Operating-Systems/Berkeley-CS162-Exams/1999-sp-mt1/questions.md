# Berkeley CS162 Spring 1999: Midterm 1: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;University of California, Berkeley<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;College of Engineering<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Computer Science Division – EECS<br>
Spring 1999                                     Anthony D. Joseph<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Midterm Exam**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;March 3, 1999<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS162 Operating Systems


![Figure on page 1](figures/questions-p01-fig01.png)

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


![Figure on page 1](figures/questions-p01-fig02.png)

Page 1/1


---

<a id="page-2"></a>
**Page 2**

CS 162 Spring 1999 Midterm Exam        March 3, 1999

1\. Threads (13 points total):<br>
&emsp;a. (6 points) What state does a thread share with other threads in a process and what<br>
&emsp;&emsp;state is private/specific to a thread? Be explicit in your answer.

&emsp;&emsp;i) Contents of memory (global variables, heap)<br>
&emsp;&emsp;ii) I/O state (file system)<br>
&emsp;&emsp;iii) CPU registers (including, program counter)<br>
&emsp;&emsp;iv) Execution stack<br>
&emsp;b. (7 points) Draw a picture of the three states of a thread and label the transitions<br>
&emsp;&emsp;between the states:

2\. Context switching and CPU scheduling (24 points total):<br>
&emsp;a. (3 points) What state is saved on a context switch between threads?

&emsp;&emsp;CPU registers (including, program counter and stack pointer)<br>
&emsp;b. (6 points) List two reasons why Nachos disables interrupts when a thread/process sleeps,<br>
&emsp;&emsp;yields, or switches to a new thread/process?

Page 2/2


---

<a id="page-3"></a>
**Page 3**

CS 162 Spring 1999 Midterm Exam        March 3, 1999

Page 3/3


---

<a id="page-4"></a>
**Page 4**

CS 162 Spring 1999 Midterm Exam        March 3, 1999

&emsp;c. (15 points) Consider the following processes, arrival times, and CPU processing<br>
&emsp;&emsp;requirements:


![Figure on page 4](figures/questions-p04-fig03.png)

&emsp;For each of the following scheduling algorithms, fill in the table with the process that<br>
&emsp;is running on the CPU (for timeslice-based algorithms, assume a 1 unit timeslice):<br>
&emsp;For RR, assume that an arriving thread is scheduled to run at the beginning of its<br>
&emsp;arrival time.


![Figure on page 4](figures/questions-p04-fig04.png)

Page 4/4


---

<a id="page-5"></a>
**Page 5**

CS 162 Spring 1999 Midterm Exam        March 3, 1999

3\. Concurrency control (18 points total):<br>
&emsp;a. (6 points) Match the terms in column A with the most appropriate definition from<br>
&emsp;&emsp;column B.

&emsp;&emsp;&emsp;Column A    Column B<br>
&emsp;&emsp;&emsp;1\. Synchronization    a. Piece of code that only one<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;thread can execute at once<br>
&emsp;&emsp;&emsp;2\. Mutual exclusion    b. Ensuring that only one thread<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;does a particular thing at a time<br>
&emsp;&emsp;&emsp;3\. Critical section    c. Isolating program faults to an<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;address space<br>
&emsp;&emsp;&emsp;d. Using atomic operations to<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;ensure cooperation between<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;threads<br>
&emsp;&emsp;1.<br>
&emsp;&emsp;2.<br>
&emsp;&emsp;3.

Page 5/5


---

<a id="page-6"></a>
**Page 6**

CS 162 Spring 1999 Midterm Exam        March 3, 1999

&emsp;b. (12 points) For the following implementation of a banking application, say whether<br>
&emsp;&emsp;it either (i) works, (ii) doesn’t work, or (iii) is dangerous  that is, sometimes<br>
&emsp;&emsp;works and sometimes doesn’t.  If the implementation does not work or is<br>
&emsp;&emsp;dangerous, explain why (there maybe several errors) and show how to fix it so it<br>
&emsp;&emsp;does work. Note that `ThreadFork` does the obvious thing.

&emsp;&emsp;BankServer() {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;while (TRUE) {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;ReceiveRequest(&op, &acctId1, &acctId2, &amount);<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;if (op == transfer) ThreadFork(Transfer(acctId1, acctId2, amount));<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;else if …<br>
&emsp;&emsp;&emsp;&emsp;&emsp;}<br>
&emsp;&emsp;}<br>
&emsp;&emsp;Transfer(acctId1, acctId2, amount) {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;account\[acctId1\]-\>Lock();<br>
&emsp;&emsp;&emsp;&emsp;&emsp;acct1 = GetAccount(acctId1); /\* May involve disk I/O \*/<br>
&emsp;&emsp;&emsp;&emsp;&emsp;account\[acctId2\]-\>Lock();<br>
&emsp;&emsp;&emsp;&emsp;&emsp;acct2 = GetAccount(acctId2); /\* May involve disk I/O \*/<br>
&emsp;&emsp;&emsp;&emsp;&emsp;if (acct1-\>balance \< amount) return ERROR;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;acct1-\>balance -= amount; acct2-\>balance += amount;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;StoreAccount(acct1); /\* Involves disk I/O \*/<br>
&emsp;&emsp;&emsp;&emsp;&emsp;StoreAccount(acct2); /\* Involves disk I/O \*/<br>
&emsp;&emsp;&emsp;&emsp;&emsp;account\[acctId1\]-\>Unlock(); account\[acctId2\]-\>Unlock();<br>
&emsp;&emsp;&emsp;&emsp;&emsp;return OK;<br>
&emsp;&emsp;}

Page 6/6


---

<a id="page-7"></a>
**Page 7**

CS 162 Spring 1999 Midterm Exam        March 3, 1999

&emsp;&emsp;Transfer is broken: Deadlock! I/O between lock acquires. Also, failure to release<br>
&emsp;&emsp;lock, when an error occurs. Solution: Compare acctIDs and change order of lock<br>
&emsp;&emsp;acquisition.<br>
&emsp;&emsp;`Transfer(acctId1, acctId2, amount) {`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`if (acct1 > acct2) {`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`account[acctId2]->Lock();`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`account[acctId1]->Lock();`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`} else {`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`account[acctId1]->Lock();`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`account[acctId2]->Lock();`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`}`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`acct1 = GetAccount(acctId1); /* May involve disk I/O */`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`acct2 = GetAccount(acctId2); /* May involve disk I/O */`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`if (acct1->balance < amount) {`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`account[acctId1]->Release();`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`account[acctId2]->Release();`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`return ERROR;`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`}`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`acct1->balance -= amount;`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`acct2->balance += amount;`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`StoreAccount(acct1); /* Involves disk I/O */`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`StoreAccount(acct2); /* Involves disk I/O */`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`account[acctId1]->Release();`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`account[acctId2]->Release();`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`return OK;`<br>
&emsp;&emsp;`}`<br>
4\. Memory management (30 points total):<br>
&emsp;a. (6 points) Consider a memory system with a cache access time of 100ns and a<br>
&emsp;&emsp;memory access time of 1200ns. If the effective access time is 10% greater than<br>
&emsp;&emsp;the cache access time, what is the hit ratio H? (fractional answers are OK)

&emsp;&emsp;&emsp;&emsp;&emsp;1.1 x T1 = T1 + (1-H)T2<br>
&emsp;&emsp;&emsp;&emsp;&emsp;(0.1)(100) = (1-H)(1200)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;H = 1190/1200

Page 7/7


---

<a id="page-8"></a>
**Page 8**

CS 162 Spring 1999 Midterm Exam        March 3, 1999

&emsp;b. (6 points) Assuming a page size of 4 KB and that page table entry takes 4 bytes,<br>
&emsp;&emsp;how many levels of page tables would be required to map a 32-bit address space<br>
&emsp;&emsp;if every page table fits into a single page? Be explicit in your explanation.<br>
&emsp;&emsp;Since each PTE is 4 bytes and each page contains 4KB, then a one-page page<br>
&emsp;&emsp;table would point to 1024 or 2^10 pages, addressing a total of 2^10 \* 2^12 =<br>
&emsp;&emsp;2^22 bytes. Continuing this process:


![Figure on page 8](figures/questions-p08-fig05.png)

Page 8/8


---

<a id="page-9"></a>
**Page 9**

CS 162 Spring 1999 Midterm Exam        March 3, 1999

&emsp;c. (18 points) Consider a multi-level memory management using the following virtual<br>
&emsp;&emsp;addresses:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Virtual seg #    Virtual Page #    Offset<br>
&emsp;&emsp;Each virtual address has 2 bits of virtual segment #, 8 bits of virtual page #, and<br>
&emsp;&emsp;12 bits of offset. Page table entries are 8 bits. All values are in hexadecimal.

&emsp;&emsp;Translate the following virtual addresses into physical addresses:


![Figure on page 9](figures/questions-p09-fig06.png)


![Figure on page 9](figures/questions-p09-fig07.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Segment Table**


![Figure on page 9](figures/questions-p09-fig08.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Physical Memory**


![Figure on page 9](figures/questions-p09-fig09.png)

Page 9/9


---

<a id="page-10"></a>
**Page 10**

CS 162 Spring 1999 Midterm Exam        March 3, 1999

5\. Design tradeoffs (15 points total):<br>
&emsp;A hardware designer asks for your input on the design of a new processor and<br>
&emsp;computer. You can spend $1500 dollars on the following components:


![Figure on page 10](figures/questions-p10-fig10.png)

&emsp;&emsp;The page size is fixed at 16KB. Assume you want to run 3 – 4 applications<br>
&emsp;&emsp;simultaneously. Each application has an overall maximum size of 64 MB and a<br>
&emsp;&emsp;working set size of 256KB. TLB entries do not have Process Identifiers. Discuss<br>
&emsp;&emsp;how you would divide the available funds across the various items to optimize<br>
&emsp;&emsp;performance.

Page 10/10

