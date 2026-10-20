# Berkeley CS162 Fall 1991: Final: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS 162, Final, Fall 1991, Online Exam<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**CS 162, Fall 1991**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Final**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Professor A. Smith**<br>
The exam is closed book.  Any question for which you give no answer at all will receive 20% partial credit.

**Problem #1**<br>
One thing that adds security to the Unix password system is "salt."  Salt consists of two randomly generated<br>
characters, different for each user, which are stored in the /etc/passwd file for each file.  The Salt is used to<br>
determine which of 4096 variations of the password encryption algorithm are used to encrypt a given<br>
password.  What is the advantage of using "salt?".  Explain.  (15)

**Problem #2**<br>
Explain what an "intentions list" is, and how and why it is used. (15)

**Problem #3**<br>
When you log into Unix, it tells you when youlast logged on.  Why? (10)

**Problem #4**<br>
Define and explain what a stack algorithm is.  Why is it good?  If two algorithms are compared and one is not<br>
a stack algorithm and the other is, will one always give better (fewer page faults) results?  Why and why not?<br>
(17)

**Problem #5**<br>
Explain the purpose of a token in a ring network Why is there only one token?  (13)

**Problem #6**<br>
What are the functions that "open" and "close" perform? (16)

**Problem # 7**<br>
Describe and explain all of the problems that could occur if users could write directories directly.  Be precise<br>
and specific.

**Problem # 8**<br>
What is a polyalphabetic cipher?  How would you go about breaking it? (10)

**Problem #9**<br>
Explain the only perfect method of encryption, and why it is perfect.  What do we mean by perfect? (11)

**Problem # 10**

CS 162, Fall 1991 Final Professor A. Smith (e.g., Professor J. Wawrzynek)   1


---

<a id="page-2"></a>
**Page 2**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS 162, Final, Fall 1991, Online Exam<br>
True/False questions (27):

a: The "chmod" command in Unix is used to alter capabilities. \_\_\_\_\_\_\_

b: Files in Unix are contiguously allocated. \_\_\_\_\_\_\_\_

c. Deleting a directory deletes all files within that directory. \_\_\_\_\_\_\_\_

d. When a file is opened, its descriptor is kept in main memory. \_\_\_\_\_\_\_\_

e. Internally the OS refers to files by name. \_\_\_\_\_\_\_\_

f. Directories are stored on disk just like regular files. \_\_\_\_\_\_\_\_

g. If A has a symbolic link to B's file, (these are the only two links to the file) and B removes its hard link<br>
from the file, the link count of the file is decremented and the file still exists, but B no longer has access to it.<br>
\_\_\_\_\_\_\_\_

h. A Unix file descriptor must allocate at least 13 pointers, even if the file it points to has only 4 blocks.<br>
\_\_\_\_\_\_\_\_

i. Unix password files are world-readable. \_\_\_\_\_\_\_\_

**Problem # 11**<br>
We discussed two ways of comparing paging algorithms:  A curve of space vs. faults, and space-time<br>
product.  Define each, and explain which is better and why.  (15)

**Problem # 12**<br>
Explain (all of) the advantages and disadvantages of disk caching. (15)

**Problem # 13**

(a) What is the approximate length of time required for a full rotation on most hard disks? (6)<br>
(b) Suppose that youhave a new mythical disk called the dervish.  The rotation time is as in part a.  The seek<br>
time is 10 microsections/cylinder, and there are 100 cylinders.  I claim that disk scheduling algorithms such<br>
as SCAN and SSTF are no longer very good.  Why? What would be a good scheduling alogorithm for the<br>
dervish disk? (16)

&emsp;**Posted by HKN (Electrical Engineering and Computer Science Honor Society)**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**University of California at Berkeley**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**If you have any questions about these online exams**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**please contact examfile@hkn.eecs.berkeley.edu.**

Problem #2   2

