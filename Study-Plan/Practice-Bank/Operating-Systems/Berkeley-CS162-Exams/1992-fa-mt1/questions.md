# Berkeley CS162 Fall 1992: Midterm 1: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS 162, Midterm 1, Fall 1992<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**CS 162, Fall 1992**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Midterm 1**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Professor A. Smith**

**Problem #1**<br>
Explain the difference between a process and a thread. (10 points)

**Problem #2**<br>
This question is multiple choice. Please place your answers at the bottom.(22 points)

i. A typical rotation time for a magnetic disk is:<br>
A)1.5 ms B)15 ms C)15 microsec. D)5 ms

ii. A typical transfer rate for high performance reel to reel tape is:<br>
A)100KB/sec. B)500KB/sec. C)1.25KB/sec. D)4MB/sec.

iii. The width of an interrecord gap on reel to reel magnetic tape is approximately:<br>
A) 0.1 inch B) 0.6 inch C) 1.1 inches D) 3 inches E) 0.01 inch

iv. The read/write speed of an Exabyte tape is approximately:<br>
A) 10KB/sec. B) 50KB/sec. C) 200KB/sec. D) 1MB/sec. E) 5MB/sec.

v. A typical average seek time for a magnetic disk is:<br>
A) 1usec B) 15usec C) 1ms. D) 15ms.

vi. The maximum storage capacity of an IBM type cartridge tape is approximately:<br>
A) 10MB. B) 50MB. C) 200MB D) 1GB E) 5GB F) 10GB

vii. Writing a read/write optical disk takes X as long as reading it:<br>
A) the same: B) twice C) half D) ten times

viii. The record size for a line printer is:<br>
A) 80 bytes B) 120 bytes C) 132 bytes D) 144 bytes E) 212 bytes.

ix. A typical number of tracks per inch on the surface of a platter for a magnetic disk is:<br>
A) 10 B) 100 C) 1000 D) 10000 E) 100000

x. A typical tape speed for a high performance tape drive using reel to reel tape is:<br>
A) 7.5ips B) 50ips. C) 200ips. D) 500ips.

xi. The ratio of the capacity of a DAT tape to a 12'' reel to reel tape recorded at 1600bpi with maximum block<br>
size is roughly:<br>
A) 0.1 B) 1.0 C) 5.0 D) 10.0 E) 20.0 F) 50.0 G) 100.0

1 CS 162, Fall 1992course, semester/yearexam # Midterm 1 Professor A. Smithprofessor (e.g., Professor J. Wawrzynek)


---

<a id="page-2"></a>
**Page 2**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS 162, Midterm 1, Fall 1992<br>
**Problem #3**<br>
Assume that you have a page that consists of 16 words. The TLB is set associative with 2 sets and two<br>
elements/set; i.e. it is 2-way set associative and has a total size of 4. The TLB uses LRU replacement per set.<br>
Memory holds 4 pages. Assume that the virtual address is 20 bits long. The following is the sequence of<br>
memory addresses referenced (work addresses) in hexadecimal:

13A41 13A35 13A27 13A1A 13A4C 13A32 13A58 13A49 13A32 13A29 13A10 13A5F

For parts A,B and C of this question, give the number of page faults for the given page replacement<br>
algorithm. For part D, give the number of TLB misses. Show your work - you will not receive credit if your<br>
work is not shown, or if it does not show how you got your answer. (28 points)

A. LRU

B. FIFO

C. OPT (MIN)

D. TLB Misses

Problem #3   2


---

<a id="page-3"></a>
**Page 3**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS 162, Midterm 1, Fall 1992

**Problem #4**<br>
What are the particular difficulties in doing I/O when the operating system uses virtual memory and paging?<br>
(I.e. as compared to a system which only had real memory.) Be complete and explain. (10 points)

**Problem #5**<br>
Is the following a stack algorithm (why/why not; explain)? There are 26 pages and 3 page frames. Each page<br>
is assigned a letter a.z. A list is maintained as follows: Whenever a page fault occurs, the letter of the page is<br>
moved to the front of the list, and the remainder are sorted alphabetically.

**Problem #6**<br>
There are two ways to implement capabilities. What are they? Explain how they work (10 problems)

**Problem #7**<br>
What is the inference control problem? Give an example. Explain why it is such a difficult problem to solve.<br>
(10 problems)

&emsp;**Posted by HKN (Electrical Engineering and Computer Science Honor Society)**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**University of California at Berkeley**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**If you have any questions about these online exams**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**please contact**  **examfile@hkn.eecs.berkeley.edu.**

Problem #4   3

