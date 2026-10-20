# Berkeley CS162 Spring 2003: Midterm 2: Official solutions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;University of California, Berkeley<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;College of Engineering<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Computer Science Division – EECS<br>
Spring 2003                                     Anthony D. Joseph<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Midterm Exam #2 Solutions**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;April 29, 2003<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS162 Operating Systems


![Figure on page 1](figures/solutions-p01-fig01.png)

General Information:<br>
This is a **closed book and notes** examination. You have two hours to answer as many questions<br>
as possible.  The number in parentheses at the beginning of each question indicates the number of<br>
points given to the question; there are 100 points in all. You should read **all** of the questions<br>
before starting the exam, as some of the questions are substantially more time consuming.<br>
Write all of your answers directly on this paper. **Make your answers as concise as possible.** If<br>
there is something in a question that you believe is open to interpretation, then please ask us about<br>
it!<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Good Luck!!**


![Figure on page 1](figures/solutions-p01-fig02.png)

Page 1/11


---

<a id="page-2"></a>
**Page 2**

CS 162 Spring 2003 Midterm Exam #2        April 29, 2003<br>
Solutions<br>
1\. (16 points total) Short answer questions:<br>
&emsp;a. (2 points) What UNIX structure is used to keep track of the sectors allocated to a<br>
&emsp;&emsp;given file?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;i-node, file header, or index block

&emsp;b. (2 points) What is the smallest addressable piece of data on a disk drive?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Disk sector or block

&emsp;c. (2 points) What is a persistent, named collection of data?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;File or directory

&emsp;d. (2 points) What is a piece of hardware that caches virtual page → physical page<br>
&emsp;&emsp;mappings?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Translation lookaside buffer or associative memory

&emsp;e. (8 points) Consider two processes P and Q that are communicating using<br>
&emsp;&emsp;mailboxes. From P → Q they use mailbox A, and from Q → P they use mailbox<br>
&emsp;&emsp;B. Assume both mailboxes are currently empty and the communication link<br>
&emsp;&emsp;between P and Q is reliable. If P now wants to determine that Q has terminated,<br>
&emsp;&emsp;what is the sequence of instructions that P should execute?<br>
&emsp;&emsp;You may only use the following blocking instructions: `send`, `reply`, `re-send`,<br>
&emsp;&emsp;`receive`, `deleteMailbox`, `createMailbox`, and `setAlarm`. Note that<br>
&emsp;&emsp;an alarm will interrupt a blocking instruction.<br>
&emsp;&emsp;`P`<br>
&emsp;&emsp;`send(A, msg);`<br>
&emsp;&emsp;`setAlarm(timeout);`<br>
&emsp;&emsp;`receive(B, msg);`<br>
&emsp;&emsp;`if timeout then Q has terminated`<br>
&emsp;&emsp;We awarded 2 points for each part of the solution. We took off 2 points if you had<br>
&emsp;&emsp;an infinite loop or placed the `setAlarm` after the `receive` statement.

Page 2/11


---

<a id="page-3"></a>
**Page 3**

CS 162 Spring 2003 Midterm Exam #2        April 29, 2003<br>
Solutions

2\.  (25 points total) Disk Drives and File Systems.<br>
&emsp;a. (6 points) Itsy Bitsy Machines Corporation develops a new disk drive that has a<br>
&emsp;&emsp;separate read/write head for each track and thus its disk heads don’t move. Which<br>
&emsp;&emsp;of the following file-system features are no longer important?<br>
&emsp;&emsp;State whether the feature is useful or not useful and **in 1 – 2 sentences** explain<br>
&emsp;&emsp;why or why not.<br>
&emsp;&emsp;i) Cylinder groups (e.g., Unix 4.2 BSD):<br>
&emsp;&emsp;&emsp;Not useful. The purpose of cylinder groups is to group data together so as to<br>
&emsp;&emsp;&emsp;reduce disk-head movement – minimize seeks. Since the disk heads don’t<br>
&emsp;&emsp;&emsp;move, cylinder groups aren’t useful.<br>
&emsp;&emsp;&emsp;The answer was worth 2 points and the explanation was worth 1 point.

&emsp;&emsp;ii) A bitmap free list (e.g., Unix 4.2 BSD)<br>
&emsp;&emsp;&emsp;Useful. This structure allows us to allocate space for contiguous regions of a<br>
&emsp;&emsp;&emsp;file in contiguous disk locations. This type of allocation then makes it possible<br>
&emsp;&emsp;&emsp;to read and write such regions in a single operation instead of multiple<br>
&emsp;&emsp;&emsp;operations (with seek and rotation gaps between them). Thus a bitmap free list<br>
&emsp;&emsp;&emsp;is still useful with our modified disk drive.<br>
&emsp;&emsp;&emsp;The answer was worth 2 points and the explanation was worth 1 point.

&emsp;b. (10 points) List the set of disk blocks that must be read into memory in order to<br>
&emsp;&emsp;read the file `/home/cs162/test.doc` in its entirety from a UNIX BSD 4.2<br>
&emsp;&emsp;filesystem. Assume the file is 15,234 bytes long and that disk blocks are 1,024<br>
&emsp;&emsp;bytes long. Assume that the directories in question all fit into a single disk block<br>
&emsp;&emsp;each. Note that this is not always true in reality.<br>
&emsp;&emsp;1\. Read in file header for root (always at fixed spot on disk).<br>
&emsp;&emsp;2\. Read in first data block for root (`/`).<br>
&emsp;&emsp;3\. Read in file header for `home`.<br>
&emsp;&emsp;4\. Read in first data block for `home`.<br>
&emsp;&emsp;5\. Read in file header for `cs162`.<br>
&emsp;&emsp;6\. Read in first data block for `cs162`.<br>
&emsp;&emsp;7\. Read in file header for `test.doc`.<br>
&emsp;&emsp;8\. Read in first data block for `test.doc`.<br>
&emsp;&emsp;9\. – 17. Read in second through 10th data blocks for `test.doc`.<br>
&emsp;&emsp;18\. Read in indirect block pointed to by the 11th entry in `test.doc`’s file header.<br>
&emsp;&emsp;19\. – 23. Read in 11th – 15th `test.doc` data blocks. The 15th data block is<br>
&emsp;&emsp;&emsp;partially full. An incorrect number of blocks cost 1 point, missing all data<br>
&emsp;&emsp;&emsp;blocks cost 3 points.<br>
&emsp;&emsp;Missing the read of an individual component cost 1 point, missing directories cost<br>
&emsp;&emsp;5 points.

Page 3/11


---

<a id="page-4"></a>
**Page 4**

CS 162 Spring 2003 Midterm Exam #2        April 29, 2003<br>
Solutions


### Problem 2 (cont’d)

&emsp;c.  (9 Points) Suppose a file system can have three disk allocation strategies,<br>
&emsp;&emsp;contiguous, linked, and indexed. We have just read the information for a file from<br>
&emsp;&emsp;its parent directory. For contiguous and linked allocation, this gives the address of<br>
&emsp;&emsp;the first block, and for indexed allocation this gives the address of the index<br>
&emsp;&emsp;block. Now we want to read the 10th data block into the memory. How many disk<br>
&emsp;&emsp;blocks (R) do we have to read for each of the allocation strategies? For partial<br>
&emsp;&emsp;credit, explicitly list which block(s) you have to read.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Contiguous allocation:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;R =<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1 block<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;We took off one point if you included reading a file header.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;For major errors, we deducted two points.

&emsp;&emsp;&emsp;&emsp;&emsp;Linked allocation:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;R =<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;10 blocks<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;We took off one point if you included reading a file header.

&emsp;&emsp;&emsp;&emsp;&emsp;Indexed allocation:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;R =<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2 blocks<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;We took off one point if you did not read the index block. We took<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;off two points if you assumed the index block was already in<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;memory.

Page 4/11


---

<a id="page-5"></a>
**Page 5**

CS 162 Spring 2003 Midterm Exam #2        April 29, 2003<br>
Solutions

3\.  (24 points total) Adding Links to a File System.<br>
&emsp;This design question asks you to consider adding links to a file system. **This is a**<br>
&emsp;**design question; you should not write code.**<br>
&emsp;The first set of questions is about adding **hard** links to the file system.<br>
&emsp;a.  (4 points) What changes would you make to the internals (directory, fileheader,<br>
&emsp;&emsp;free map, etc.) of the filesystem to support hard links?<br>
&emsp;&emsp;You would have to add a link count to the file header. No partial credit.

&emsp;b.  (5 points) How do the semantics of the `Remove` system call change, and how do<br>
&emsp;&emsp;you implement that change to `Remove` and any other affected system calls?<br>
&emsp;&emsp;`Remove` must decrement the link count (2 points) and check the on disk link<br>
&emsp;&emsp;count (3 points). No other system calls are affected and we deducted up to two<br>
&emsp;&emsp;points if you included other system calls.

&emsp;c. (3 points) What new system calls, if any, must be added to the system? Give the C<br>
&emsp;&emsp;language-style signature of any new calls, e.g., `int Open(char *file)`.<br>
&emsp;&emsp;List the signature and give a one sentence definition of each argument and return<br>
&emsp;&emsp;value.<br>
&emsp;&emsp;Add a `int Link(char *src, char *dest)` or `int Link(int`<br>
&emsp;&emsp;`inodeNumber, char *dest)` to create a new link to an existing file.

Page 5/11


---

<a id="page-6"></a>
**Page 6**

CS 162 Spring 2003 Midterm Exam #2        April 29, 2003<br>
Solutions


### Problem 3 (cont’d).

&emsp;This set of questions is about adding **soft** links to the file system. Soft links are also<br>
&emsp;called symbolic links.<br>
&emsp;d. (4 points) What changes would you make to the internals (directory, fileheader,<br>
&emsp;&emsp;free map, etc.) of the filesystem to support soft links?<br>
&emsp;&emsp;Add a new type of file to the directory or the file header (2 points), and store the<br>
&emsp;&emsp;soft link’s pathname in a file (2 points).

&emsp;e. (5 points) What existing system calls have to be modified and how to support soft<br>
&emsp;&emsp;links?<br>
&emsp;&emsp;`Open` needs to be changed to implement the recursive lookup implied by soft<br>
&emsp;&emsp;links (1 point). If the file being opened resolves to a soft link, `Open` must open<br>
&emsp;&emsp;the file pointed to by the soft link (3 points). The dereferencing operation should<br>
&emsp;&emsp;count the number of dereference operations to prevent an error from loops (1<br>
&emsp;&emsp;point). `Remove` must be modified in a minor way to remove soft links correctly.<br>
&emsp;&emsp;If you removed the target of a link (instead of the link), we deducted 2 points. If<br>
&emsp;&emsp;you said that system calls use file descriptors instead of names, we deducted 2<br>
&emsp;&emsp;points.

&emsp;f. (3 points) What new system calls, if any, must be added to the system? Give the C<br>
&emsp;&emsp;language-style signature of any new calls, e.g., `int Open(char *file)`.<br>
&emsp;&emsp;List the signature and give a one sentence definition of each argument and return<br>
&emsp;&emsp;value.<br>
&emsp;&emsp;Add a `int SymLink(char *src, char *dest)` to create a new<br>
&emsp;&emsp;symbolic link to an existing file. No partial credit.

Page 6/11


---

<a id="page-7"></a>
**Page 7**

CS 162 Spring 2003 Midterm Exam #2        April 29, 2003<br>
Solutions

4\.  (10 points total) Interactions between Operating System Components.<br>
&emsp;Generally we’ve talked about each operating system component in isolation. This<br>
&emsp;question asks you to think about ways in which they interoperate. For each pair of<br>
&emsp;systems below, **in four sentences or less**, give a specific way that they interact (or<br>
&emsp;that they could interact).<br>
&emsp;Writing that the file system and I/O system interact because they both use the disk is<br>
&emsp;not worth more than a point, and may be worth none. Writing that the file system and<br>
&emsp;I/O system interact when they determine the mapping from logical blocks → physical<br>
&emsp;blocks which impacts the size of file system structures, and the efficiency of the disk<br>
&emsp;usage because larger logical blocks imply more internal fragmentation on the disk is a<br>
&emsp;more complete answer.<br>
&emsp;a. (6 points) How does a demand paged, lazy-loaded virtual memory system and the<br>
&emsp;&emsp;file system interact?<br>
&emsp;&emsp;&emsp;The VM system may page executables directly from the file system, which<br>
&emsp;&emsp;&emsp;requires coordination to make sure that users cannot write to files being used<br>
&emsp;&emsp;&emsp;as backing store and that deletion of such files is disallowed or handled<br>
&emsp;&emsp;&emsp;properly. The advantage is that pages swapped from the file system do not<br>
&emsp;&emsp;&emsp;need to be copied to swap space.<br>
&emsp;&emsp;&emsp;Swap files can generally be put in the file system, but if so, the VM and file<br>
&emsp;&emsp;&emsp;systems need to coordinate such use (maybe with a quota system) to prevent<br>
&emsp;&emsp;&emsp;the swap files from running the file system out of room. Using the file system<br>
&emsp;&emsp;&emsp;interface simplifies the VM system, but adds per-swap file overhead.<br>
&emsp;&emsp;&emsp;In a system that allows memory mapped files, the two systems have to interact<br>
&emsp;&emsp;&emsp;closely to guarantee consistency between the file cache and the VM allocated<br>
&emsp;&emsp;&emsp;to a memory mapped file.<br>
&emsp;&emsp;&emsp;We subtracted 2 points for overly long answers. We gave credit for answers<br>
&emsp;&emsp;&emsp;that provided a higher level analysis of how you might change the block size<br>
&emsp;&emsp;&emsp;or use a different allocation policy.

&emsp;b. (4 points) How do the security system (e.g., file permissions) and the virtual<br>
&emsp;&emsp;memory system?<br>
&emsp;&emsp;This one’s deliberately tricky. If the OS allows memory mapping of files, the<br>
&emsp;&emsp;memory mapping interface has to respect file system permissions - potentially<br>
&emsp;&emsp;every time that the file is read or written. This is a potentially very complex<br>
&emsp;&emsp;interaction. Answers that discussed caching files and the need to keep permission<br>
&emsp;&emsp;bits correct were worth one point.

Page 7/11


---

<a id="page-8"></a>
**Page 8**

CS 162 Spring 2003 Midterm Exam #2        April 29, 2003<br>
Solutions<br>
No Credit – Problem X: (000000000000 points)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**The Story of Modern Math**

&emsp;&emsp;Found on the Internet:<br>
&emsp;&emsp;Mathematics in 1950:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**Question:** A logger sells a truckload of lumber for $100. His cost of<br>
&emsp;&emsp;&emsp;&emsp;&emsp;production is 4/5 of the price. What is his profit?<br>
&emsp;&emsp;Mathematics in 1960:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**Question:** A logger sells a truckload of lumber for $100. His cost of<br>
&emsp;&emsp;&emsp;&emsp;&emsp;production is 4/5 of the price, or $80. What is his profit?<br>
&emsp;&emsp;Mathematics in 1970:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**Question:** A logger exchanges a set “L” of lumber for a set “M” of<br>
&emsp;&emsp;&emsp;&emsp;&emsp;money. The cardinality of set “M” is 100. Each element is worth one<br>
&emsp;&emsp;&emsp;&emsp;&emsp;dollar. Make 100 dots representing the elements of the set “M.” Set “C,”<br>
&emsp;&emsp;&emsp;&emsp;&emsp;the cost of production, contains 20 fewer points than set “M.” Represent<br>
&emsp;&emsp;&emsp;&emsp;&emsp;set “C” as a subset of set “M” and answer the following question: What is<br>
&emsp;&emsp;&emsp;&emsp;&emsp;the cardinality of the set “P” of profits?<br>
&emsp;&emsp;Mathematics in 1980:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**Question:** A logger sells a truckload of lumber for $100. His cost of<br>
&emsp;&emsp;&emsp;&emsp;&emsp;production is $80 and his profit is $20. Your assignment: Underline the<br>
&emsp;&emsp;&emsp;&emsp;&emsp;number 20.<br>
&emsp;&emsp;Mathematics in 1990:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**Question:** By cutting down beautiful forest trees, the logger makes $20.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;What do you think of this way of making a living? Topic for class<br>
&emsp;&emsp;&emsp;&emsp;&emsp;participation after answering the question: How did the forest’s birds and<br>
&emsp;&emsp;&emsp;&emsp;&emsp;squirrels feel as the logger cut down the trees? There are no wrong<br>
&emsp;&emsp;&emsp;&emsp;&emsp;answers.<br>
&emsp;&emsp;Mathematics in 2002:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**Question:** A logger sells a truckload of lumber for $100. His cost of<br>
&emsp;&emsp;&emsp;&emsp;&emsp;production is $120. How does Arthur Andersen determine that the<br>
&emsp;&emsp;&emsp;&emsp;&emsp;logger’s profit margin is $60?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**Bonus points:** Explain how an Enron accountant can double this profit by<br>
&emsp;&emsp;&emsp;&emsp;&emsp;selling the lumber to an out-of-state friend, repurchasing it, and selling it<br>
&emsp;&emsp;&emsp;&emsp;&emsp;to the State of California.

Page 8/11


---

<a id="page-9"></a>
**Page 9**

CS 162 Spring 2003 Midterm Exam #2        April 29, 2003<br>
Solutions

5\.  (25 points total) Network Performance.<br>
&emsp;a. (9 points) Consider a TCP network connection with a current window size for<br>
&emsp;&emsp;unacknowledged bytes of 1,000 bytes, over a cross-country link with a one-way<br>
&emsp;&emsp;latency of 50 milliseconds, and a link bandwidth of 100 Mbit/second. You may<br>
&emsp;&emsp;assume that no packets are lost for this particular problem, and that the size of an<br>
&emsp;&emsp;acknowledgement is essentially 0 bytes long.<br>
&emsp;&emsp;How long does it take TCP to transmit 100,000 bytes across the link? That is, how<br>
&emsp;&emsp;much time elapses from when the first byte is sent by the sender to when the<br>
&emsp;&emsp;sender knows that the receiver has received the last byte?<br>
&emsp;&emsp;A TCP transmission window size of 1000 implies that the sender can send 1000<br>
&emsp;&emsp;bytes before having to wait for an ACK message from the receiver that will allow<br>
&emsp;&emsp;it to continue sending again.<br>
&emsp;&emsp;Then the sequence of messages sent is:<br>
&emsp;&emsp;1\.  1000 bytes from sender to receiver: requires 50 ms for first byte to get there<br>
&emsp;&emsp;&emsp;and another 1000/(100 Mbps / 8 bytes/bit) secs for the rest of the 1000 bytes<br>
&emsp;&emsp;&emsp;to get there after that.<br>
&emsp;&emsp;2\.  ACK msg from receiver to sender: requires 50 ms to get there.<br>
&emsp;&emsp;3\.  To send 100,000 bytes will require 100 round trips of this kind.<br>
&emsp;&emsp;The total time required is:<br>
&emsp;&emsp;100 \* (2 \* 50 ms + 1000/(100,000,000/8)) = 100 \* (100 ms + 0.08 ms)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;= 10008 ms<br>
&emsp;&emsp;&emsp;&emsp;&emsp;= 10.008 seconds<br>
&emsp;&emsp;We subtracted 2 points for math errors and subtracted 3 points for each missing<br>
&emsp;&emsp;component of the total time.

Page 9/11


---

<a id="page-10"></a>
**Page 10**

CS 162 Spring 2003 Midterm Exam #2        April 29, 2003<br>
Solutions

&emsp;b. (6 points) Sketch a rough graph (“back of the envelope”) illustrating effective<br>
&emsp;&emsp;network bandwidth as a function of per-message CPU overhead. Indicate any<br>
&emsp;&emsp;important relative values.<br>
Effective BW


![Figure on page 10](figures/solutions-p10-fig03.png)

&emsp;Max<br>
&emsp;Link<br>
&emsp;BW

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Per-message CPU Overhead

&emsp;&emsp;We subtracted 2 points if you didn’t indicate the maximum link bandwidth. If your<br>
&emsp;&emsp;curve was close to the correct shape, we subtracted 2 points. If your curve was<br>
&emsp;&emsp;partially  incorrect (e.g., intersected the x-axis), we subtracted 4 points.<br>
&emsp;&emsp;Depending on the x-axis timescale, your graph could look like this:<br>
Effective BW


![Figure on page 10](figures/solutions-p10-fig04.png)

&emsp;Max<br>
&emsp;Link<br>
&emsp;BW

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Per-message CPU Overhead

Page 10/11


---

<a id="page-11"></a>
**Page 11**

CS 162 Spring 2003 Midterm Exam #2        April 29, 2003<br>
Solutions


### Problem 5 (cont’d)

&emsp;c. (6 points) Assume that the receiver can process incoming data at greater than 100<br>
&emsp;&emsp;Mbit/s, what is the optimal window size that the receiver should advertise?<br>
&emsp;&emsp;The optimal window size will keep the “pipe” full during the time it takes for the<br>
&emsp;&emsp;data to arrive at the receiver and the ACK to arrive back at the sender. Thus, the<br>
&emsp;&emsp;receiver should advertise the Bandwidth Delay Product:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;(2 x 50 milliseconds x100 Mbit/s) = 10 Mbits or 1.25 Mbytes.<br>
&emsp;&emsp;We subtracted 3 points for answers that used only the one way latency, and we<br>
&emsp;&emsp;subtracted 3 points for extra terms. For minor math errors, we subtracted 2<br>
&emsp;&emsp;points. Note that saying the window size should be infinite or 100 Mbits is<br>
&emsp;&emsp;incorrect, as that size would yield a sending rate of 1 Gbit/s (100 Mbits sent in 0.1<br>
&emsp;&emsp;seconds) leading to packets being dropped by the network or being queued by the<br>
&emsp;&emsp;sender’s network driver and then dropped when the queue overflow).

&emsp;d.  (4 points) If the link is shared by N pairs of senders and receivers, does your<br>
&emsp;&emsp;answer for part (c) change? If so, how? If not, why?<br>
&emsp;&emsp;To fairly share the link, the window size for each pair would be 1/N times the<br>
&emsp;&emsp;answer from (c). We subtracted 2 points if you said the answer changed but didn’t<br>
&emsp;&emsp;indicate the amount of change.

Page 11/11

