# Berkeley CS162 Fall 1999: Midterm 2: Official solutions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;University of California, Berkeley<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;College of Engineering<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Computer Science Division – EECS<br>
Fall 1999                                     Anthony D. Joseph<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Midterm Exam #2 Solutions**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;November 10, 1999<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS162 Operating Systems


![Figure on page 1](figures/solutions-p01-fig01.png)

This is a **closed book** examination. You have two hours to answer as many questions as possible.<br>
The number in parentheses at the beginning of each question indicates the number of points given<br>
to the question; there are 100 points in all. You should read **all** of the questions before starting the<br>
exam, as some of the questions are substantially more time consuming.<br>
Write all of your answers directly on this paper.  Make your answers as concise as possible. If there<br>
is something in a question that you believe is open to interpretation, then please ask us about it!<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Good Luck!!**


![Figure on page 1](figures/solutions-p01-fig02.png)

Page 1/12


---

<a id="page-2"></a>
**Page 2**

CS 162 Fall 1999 Midterm Exam #2        November 10, 1999<br>
Solutions

1\. (12 points total) True / False and **Why**. Circle the correct answer and provide a **short**<br>
&emsp;reason for your answer:<br>
&emsp;a. Doubling the block size in the UNIX 4.2 BSD file system will exactly double the<br>
&emsp;&emsp;maximum file size.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;True         /        False<br>
&emsp;&emsp;Why:<br>
&emsp;&emsp;False. The size will more than double because the size of indirect, doubly indirect,<br>
&emsp;&emsp;and triply indirect blocks also doubles.<br>
&emsp;&emsp;The correct answer was worth 2 points. Good reasoning was worth 2 points.

&emsp;b. A direct mapped cache can sometimes have a higher hit rate than a fully associative<br>
&emsp;&emsp;cache with an LRU replacement policy (on the same reference pattern).<br>
&emsp;&emsp;&emsp;&emsp;&emsp;True         /        False<br>
&emsp;&emsp;Why:<br>
&emsp;&emsp;True. A direct mapped cache will do better than LRU on a pattern like<br>
&emsp;&emsp;ABCDEABCDE… if the cache size is one entry smaller than the total number of<br>
&emsp;&emsp;items in the pattern (e.g., four cache entries). LRU will miss on every access,<br>
&emsp;&emsp;while a direct mapped cache will only miss on the two entries that map to the<br>
&emsp;&emsp;same cache entry.

&emsp;c. Virtual memory address translation is useful even if the total size of virtual<br>
&emsp;&emsp;memory (summed over all programs) is guaranteed to be smaller than physical<br>
&emsp;&emsp;memory.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;True         /        False<br>
&emsp;&emsp;Why:<br>
&emsp;&emsp;True. It avoids the need to relocate programs when they are loaded and allows<br>
&emsp;&emsp;memory to be dynamically allocated. Also, provides protection and doesn’t<br>
&emsp;&emsp;require that each program’s addresses be contiguous.

Page 2/12


---

<a id="page-3"></a>
**Page 3**

CS 162 Fall 1999 Midterm Exam #2        November 10, 1999<br>
Solutions

2\. (28 points total) File system buffer cache management.<br>
&emsp;a. (12 points) Unix systems use a 30 second write-behind policy for file system data.<br>
&emsp;&emsp;List the advantages and disadvantages<br>
&emsp;&emsp;i) Name **two** advantages of this policy.<br>
&emsp;&emsp;&emsp;(1) Delaying writes allows multiple small writes to be batched together into a<br>
&emsp;&emsp;&emsp;&emsp;&emsp;larger, more efficient large write (also improves allocation)<br>
&emsp;&emsp;&emsp;(2) Temporary files that are created, read, then deleted may never be written<br>
&emsp;&emsp;&emsp;&emsp;&emsp;to disk.<br>
&emsp;&emsp;&emsp;(3) Write-behind doesn’t delay writes like write-through.<br>
&emsp;&emsp;&emsp;(4) Periodically writing data back is better than write-back (WB could lose<br>
&emsp;&emsp;&emsp;&emsp;&emsp;more data if the machine crashes).<br>
&emsp;&emsp;&emsp;Each answer was worth 4 points. Weak answers received 2 points.

&emsp;&emsp;ii) Name **one** disadvantage of this policy.<br>
&emsp;&emsp;&emsp;(1) A crash may cause data to be lost, leading to an inconsistent filesystem or<br>
&emsp;&emsp;&emsp;&emsp;&emsp;loss of user data.<br>
&emsp;&emsp;&emsp;Several people listed the disadvantage that temporary files that live for more<br>
&emsp;&emsp;&emsp;than 30 seconds are written to disk (versus write-back). This answer isn’t<br>
&emsp;&emsp;&emsp;really a big disadvantage (compared to the potential for filesystem corruption<br>
&emsp;&emsp;&emsp;after a crash).

Page 3/12


---

<a id="page-4"></a>
**Page 4**

CS 162 Fall 1999 Midterm Exam #2        November 10, 1999<br>
Solutions

&emsp;b. (14 points) Specify how you implement a write-behind policy. Assume a write-<br>
&emsp;&emsp;behind occurs every 30 seconds. Assume that a file is only opened by one process<br>
&emsp;&emsp;at a time. You do not have to show how you would modify the read operation.<br>
&emsp;&emsp;i) List the data structures, methods, or classes you would either use or modify:<br>
&emsp;&emsp;&emsp;Use a global `SyncList`, `writesPending`, (or alternatively, per-process<br>
&emsp;&emsp;&emsp;`SyncLists`) of `ToWrite` structures, containing : the ID of the open file, a<br>
&emsp;&emsp;&emsp;buffer for holding the data to be written, and an offset into the file (where the<br>
&emsp;&emsp;&emsp;data is to be written).<br>
&emsp;&emsp;&emsp;We graded solutions to (i) and (ii) by subtracting points for errors:<br>
&emsp;&emsp;&emsp;• Major errors subtracted 4 points each, up to –12 total. Examples: using a<br>
&emsp;&emsp;&emsp;&emsp;&emsp;thread per request (has a severe performance impact and could result in<br>
&emsp;&emsp;&emsp;&emsp;&emsp;out-of-order writes), missing locks/synchronization, explicitly using<br>
&emsp;&emsp;&emsp;&emsp;&emsp;interrupts to perform write-behind (can’t do I/O in an interrupt handler).<br>
&emsp;&emsp;&emsp;• Minor errors cost 2 points each, up to -6 total. Example, not defining data<br>
&emsp;&emsp;&emsp;&emsp;&emsp;structures, or failing to say how the kernel procedure for write-behind was<br>
&emsp;&emsp;&emsp;&emsp;&emsp;executed (many solutions relied on the procedure being called by an<br>
&emsp;&emsp;&emsp;&emsp;&emsp;interrupt handler). If interrupts were not explicitly used, we only counted<br>
&emsp;&emsp;&emsp;&emsp;&emsp;this as a minor error.<br>
&emsp;&emsp;&emsp;• For solutions slightly over the length limit, we subtracted 2 points; for<br>
&emsp;&emsp;&emsp;&emsp;&emsp;major overruns, 4 points; for extremely long solutions, 8 points.<br>
&emsp;&emsp;ii) Provide the algorithm for the policy in pseudocode form. Your solution should<br>
&emsp;&emsp;&emsp;take less than twenty lines of pseudocode. No optimizations are necessary,<br>
&emsp;&emsp;&emsp;however your solution should handle any synchronization issues. You can use<br>
&emsp;&emsp;&emsp;any Nachos functions that you would need (if they’re not standard, or are from<br>
&emsp;&emsp;&emsp;your own project phases, explain their operation).<br>
&emsp;&emsp;&emsp;Create a new kernel thread for write-behind that does the following:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`while (1) {`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`WaitUntil(30 seconds);`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`while (writesPending is not empty) {`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`dequeue ToWrite element`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`write buffer to file`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`free ToWrite element`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`}`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`}`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`Add to write procedure:`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`create ToWrite element`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`copy user data to buffer`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`fill in element fields`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`append to writesPending`

Page 4/12


---

<a id="page-5"></a>
**Page 5**

CS 162 Fall 1999 Midterm Exam #2        November 10, 1999<br>
Solutions<br>
(This page intentionally left blank)

Page 5/12


---

<a id="page-6"></a>
**Page 6**

CS 162 Fall 1999 Midterm Exam #2        November 10, 1999<br>
Solutions

3\. (15 points total) One of your friends has a little extra money to spare and has decided<br>
&emsp;to upgrade their HAL Junior HAL-Z4u computer.  The HAL Junior has a simple<br>
&emsp;paged virtual memory system (with no segments).  First you measure the system to<br>
&emsp;find out why it is running so slow. You discover the following values:


![Figure on page 6](figures/solutions-p06-fig03.png)

The TLB is refilled automatically by the hardware on a miss (the TLB is only accessed<br>
once per reference).  The page tables are kept in physical memory, so looking up a page<br>
table entry incurs one memory access. Assume that the costs of the page replacement<br>
algorithm and updates to the page table are included in the Td measurement.<br>
&emsp;a. (10 points) What is the average memory access time (the time for an application<br>
&emsp;&emsp;program to do one memory reference) on the HAL Junior? Express your answer<br>
&emsp;&emsp;symbolically and compute the result to two significant digits. Show all steps of the<br>
&emsp;&emsp;computation.<br>
&emsp;&emsp;Time = Tt                               TLB access time<br>
&emsp;&emsp;\+ Tm                            Memory read time<br>
&emsp;&emsp;\+ Pt \* (Tm                          TLB fault (read entry)<br>
&emsp;&emsp;\+ Pp \* (Td                       Page fault (read page)<br>
&emsp;&emsp;\+ Pd \* Td))                    Write dirty page<br>
&emsp;&emsp;Time = 0 + 1us + 0.1 \* (1us + 0.0002 \* (10,000 + 0.5 \* 10,000))<br>
&emsp;&emsp;= 1 + 0.1 \* (1 + 0.0002 \* 15,000)<br>
&emsp;&emsp;= 1 + 0.1 \*3<br>
&emsp;&emsp;= 1.4 us<br>
&emsp;&emsp;Major errors (-3 points): Not including Tm, missing or extra terms (for more than<br>
&emsp;&emsp;two terms, we only took off –1 point per term.<br>
&emsp;&emsp;Minor errors (-2 points): Arithmetic errors, missing the Tt term.<br>
&emsp;&emsp;If the solution did not include a symbolic expression of the time and was<br>
&emsp;&emsp;incorrect, we did not award partial credit.

Page 6/12


---

<a id="page-7"></a>
**Page 7**

CS 162 Fall 1999 Midterm Exam #2        November 10, 1999<br>
Solutions

&emsp;b. (5 points) The HAL Junior price sheet looks like this:


![Figure on page 7](figures/solutions-p07-fig04.png)

&emsp;&emsp;Suppose your friend has $1000. Which components should they buy if they want<br>
&emsp;&emsp;to maximize the performance of their HAL Junior? State the reasoning behind<br>
&emsp;&emsp;your choices.<br>
&emsp;&emsp;TLB =\> 1 + 0.05 \* 4 =\> 1.2<br>
&emsp;&emsp;HDII =\> 1 + 0.1 \* 3.4 =\> 1.34<br>
&emsp;&emsp;Mem =\> 1 + 0.1 \* (1 + 0.0001 \* 15,000) =\> 1+ 0.1 \* 2.5 =\> 1.25<br>
&emsp;&emsp;TLB + Mem =\> 1.12<br>
&emsp;&emsp;TLB + HDII =\> 1.17<br>
&emsp;&emsp;HDII + Mem =\> 1.22<br>
&emsp;&emsp;All are good choices, but the best choice is to spend $500 on TLB and $500 on<br>
&emsp;&emsp;memory.<br>
&emsp;&emsp;Each correct choice was worth 2 points. A good argument was worth one point.

Page 7/12


---

<a id="page-8"></a>
**Page 8**

CS 162 Fall 1999 Midterm Exam #2        November 10, 1999<br>
Solutions

No Credit – Problem X: (000000000000 points)

The news is not very good for Bill Gates. On Friday, the judge in the antitrust trial of<br>
Microsoft ruled that the software company has monopoly power in PC operating systems<br>
and that it has used that power to crush potential threats from competitors.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;The Top 10 Things on Bill Gates's To-Do List<br>
&emsp;&emsp;10\. Change menacing cackle to more of a charming titter.<br>
&emsp;&emsp;9\. Stop payment on Satan's check.<br>
&emsp;&emsp;8\. Search JobOptions.com:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Field = "Technology"<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Salary \> $25 Billion<br>
&emsp;&emsp;7\. Put somebody else in charge temporarily; take the winter off and find Rosebud.<br>
&emsp;&emsp;6\. Push own "Start" button.  At prompt, choose "Shut Down" and then "Re-start<br>
&emsp;&emsp;Ego."<br>
&emsp;&emsp;5\. Create new corporate division in charge of sending flowers and candy to Sandy<br>
&emsp;&emsp;O'Connor.<br>
&emsp;&emsp;4\. Send message to mother ship:  "My job here is done."<br>
&emsp;&emsp;3\. Dedicate my life to finding the \*real\* monopolists.<br>
&emsp;&emsp;2\. See how quickly the government can prepare for the "11/10/99 Bug."<br>
&emsp;&emsp;1\. Halt global economy by taking all my money and going home.

Page 8/12


---

<a id="page-9"></a>
**Page 9**

CS 162 Fall 1999 Midterm Exam #2        November 10, 1999<br>
Solutions

4\. (12 points total) Consider a demand paging system, where a dedicated disk is used for<br>
&emsp;paging, and file system activity uses other disks. The measured utilizations of the<br>
&emsp;various system components, in terms of **time**, not space, are as follows:


![Figure on page 9](figures/solutions-p09-fig05.png)

&emsp;For each of the following changes, say what its most likely impact will be on CPU<br>
&emsp;utilization: (**+**)increase, (**0**) no effect, or (**–**)decrease, and **why**.<br>
&emsp;a. Get a larger capacity paging disk<br>
&emsp;**0**: No effect. The system has insufficient physical memory, causing to thrash<br>
&emsp;(saturating the paging disk in terms of I/O bandwidth).<br>
&emsp;Each answer was worth four points, 2 points for the correct choice and 2 points for a<br>
&emsp;good argument.

&emsp;b. Increase the degree of multiprogramming<br>
&emsp;–: Decrease. The system has insufficient physical memory, causing to thrash<br>
&emsp;(saturating the paging disk). Adding more programs will increase the amount of<br>
&emsp;paging, making the problem worse.

&emsp;c. Get more physical memory<br>
&emsp;**+**: Increase. Providing more physical memory will reduce the amount of paging.

Page 9/12


---

<a id="page-10"></a>
**Page 10**

CS 162 Fall 1999 Midterm Exam #2        November 10, 1999<br>
Solutions

5\. (15 points total) Virtual memory page replacement policies.<br>
&emsp;You are given a program that **repeatedly** scans through the elements of a very large<br>
&emsp;array in virtual memory. For example, if the array is 4 pages long, then its page<br>
&emsp;reference pattern is ABCDABCDABCD...<br>
&emsp;For each of the following page replacement algorithms, sketch a graph showing the<br>
&emsp;paging behavior. Assume that the program has been running for several iterations<br>
&emsp;through the array.<br>
&emsp;The y-axis of each graph is the number of page faults per referenced page, varying<br>
&emsp;from 0 to 1; the x-axis is the size of the array being scanned, varying from smaller<br>
&emsp;than physical memory to much larger than physical memory. **Label any interesting**<br>
&emsp;**points on the graph on both the x and y axes.**<br>
&emsp;a. **FIFO**


![Figure on page 10](figures/solutions-p10-fig06.png)

&emsp;b. **LRU**


![Figure on page 10](figures/solutions-p10-fig07.png)

Page 10/12


---

<a id="page-11"></a>
**Page 11**

CS 162 Fall 1999 Midterm Exam #2        November 10, 1999<br>
Solutions

&emsp;c. **MIN**


![Figure on page 11](figures/solutions-p11-fig08.png)

For FIFO and LRU, we subtracted two points if there was a significant slope to<br>
transition from 0 to 1. We also subtracted two points if the graph did not have a zero<br>
fault rate before the size of physical memory was reached (we specifically state that the<br>
program has been running for some time).<br>
For MIN, we subtracted two points if the graph was not asymptotic to 1 or if it did not<br>
have a zero fault rate before the size of physical memory was reached.

Page 11/12


---

<a id="page-12"></a>
**Page 12**

CS 162 Fall 1999 Midterm Exam #2        November 10, 1999<br>
Solutions

6\. (18 points total) Consider the following processes, arrival times, and CPU processing<br>
&emsp;requirements:


![Figure on page 12](figures/solutions-p12-fig09.png)

&emsp;For each of the following scheduling algorithms, fill in the table with the process that<br>
&emsp;is running on the CPU (for timeslice-based algorithms, assume a 1 unit timeslice).<br>
&emsp;For RR, assume that an arriving thread is run at the beginning of its arrival time.<br>
&emsp;All processes produce output only at the end of their execution.


![Figure on page 12](figures/solutions-p12-fig10.png)

&emsp;&emsp;Each column is worth 6 points: 4 for correctness of the schedule (we deducted<br>
&emsp;&emsp;1/2/3 points if you made minor/intermediate/major mistakes), and 2 for the<br>
&emsp;&emsp;average response time (1 point was deducted for minor errors).

Page 12/12

