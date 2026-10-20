# Berkeley CS162 Spring 1992: Midterm 2: Official solutions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS162, Midterm #2, Spring/1992<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**CS162, Spring/1992**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Midterm #2**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Professor Thomas Anderson**

General Information:<br>
This is a **closed book** examination. You have 60 minutes to answer as many question as possible. The<br>
number in parentheses at the beginning of each question indicates the number of points given to the question;<br>
there are 60 points in all. Write **all** of your answers directly on this paper. **Make your anwers as concise as**<br>
**possible** (you needn't cover every available nano-acre with writing).

**Problem #1 (6 points)**<br>
For each of the following statements, indicate in one sentence whether the statement is true or false, and why.

(a) Binary semaphores are those that are used by no more than two threads.

**Answer:** False, binary semahpores contain two states 0 or 1.

(b) The Banker's algorithm is a way of preventing deadlock

**Answer:** True, no process is allowed into a section if deadlock is possible.

(c) A multi-level indexed file permits faster random access than a contiguously allocated file.

**Answer:** False, contiguous files may be easily jumped through, while the multi-level file must seek right<br>
blocks.

**Problem #2 (8 points)**<br>
For each of the following items, write a sentence definition:

(a) Atomic

**Answer:** An atomic function or command cannot be interrupted in between.

(b) Deadlock

**Answer:** A state where all threads are waiting for a resource held by another and nothing can therefore finish.

(c) Disk cylinder

**Answer:** The same track on all platters in a disk pack.

(d) Doubly indirect block

**Answer:** A block of pointers to blocks of pointers which in turn point to file blocks.

CS162, Spring/1992 Midterm #2 Professor Thomas Anderson   1


---

<a id="page-2"></a>
**Page 2**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS162, Midterm #2, Spring/1992<br>
**Problem #3 (8 points)**<br>
A thread can be in one of thre states: ready to run, running, or blocked. For each transition indicated below,<br>
identify under what circumstances it occurs:

(a) ready -\> running

**Answer:** Another thread is blocked, finishes, or yields to this thread.

(b) running -\> ready

**Answer:** Thread yields to another

(c) running -\> blocked

**Answer:** Thread has to wait on condition or lock.

(d) blocked -\> ready

**Answer:** Thread is signaled or lock is released. Condition is met.

**Problem #4 (8 points)**<br>
The Demos system employs a clever block group indexed scheme for file allocation on disk. State the<br>
principle advantage of this scheme compared to each of the following, and justify your answer:

(a) contiguous allocation

**Answer:** Easier to increase size, allocate another block.

(b) linked allocation

**Answer:** Easier to access randomly, use indexes

(c) a single-level index

**Answer:** Easier to handle big files, use BIGFILE condition and indirect block.

(d) a UNIX multi-level index

**Answer:** Fewer seeks, use bitmap.

**Problem #5**<br>
(a)

(b)

**Answer:**

void answerBegin() {<br>
speak.acquire;

Problem #3 (8 points)   2


---

<a id="page-3"></a>
**Page 3**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS162, Midterm #2, Spring/1992<br>
while(numQuestions == 0)<br>
questionAsked.wait;<br>
profSpeaking = 1;<br>
return; }

void AnswerDone() {<br>
numQuestions--;<br>
profDone.signal;<br>
profSpeaking = 0;<br>
speak.release; }

void QuestionStart() {<br>
speak.acquire;<br>
while(profSpeaking)<br>
profReady.wait;<br>
numQuestions++; }

void QuestionEnd() {<br>
questionAsked.signal;<br>
profDone.wait;<br>
profReady.signal;<br>
speak.release; }

(c) (2 points) Can a student "starve" in your solution, in other words, not have his/her question answered?<br>
Why or why not?

**Answer:** Yes, the same student recovers control after each question can ask innumerable questions.

**Problem #6 (10 points)**<br>
There are two ways to implement capabilities. What are they? Explain how they work.

**Answer:** The two ways to implement capabilities are tagged architecture and segregated architecture. In a<br>
tagged architecture, flags are set to designate which files a given user is "capable" of accessing. This flag, or<br>
tag, can only be set by the operating system. The users can modify the capabilities. In a segregated<br>
architecture, the user is isolated from the capabilities completely, and must rely on the operating system. The<br>
OS can use a capabilities list to keep track of files the user can have access to, and how much access i.e. a list<br>
of . This way, the user doesn't even have to see the files he's not allowed to access. You can also allow for<br>
complete mediation by checking the capability list for access privileges on every access attempt to the same<br>
file.<br>
.

**Problem #7 Extra Double Secret Bonus Question (2 points)**<br>
Of the two planets described in Ursula LeGuin's "The Dispossessed," which would you rather live on?

Problem #5   3


---

<a id="page-4"></a>
**Page 4**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS162, Midterm #2, Spring/1992<br>
&emsp;**Posted by HKN (Electrical Engineering and Computer Science Honor Society)**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**University of California at Berkeley**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**If you have any questions about these online exams**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**please contact mailto:examfile@hkn.eecs.berkeley.edu**

4Posted by HKN (Electrical Engineering and Computer Science Honor Society)University of California at BerkeleyIf yo

