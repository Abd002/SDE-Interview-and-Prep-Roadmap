# Berkeley CS162 Fall 2001: Midterm 2: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

Subject: CS162, 2001<br>
CS162, Fall, 2001<br>
Midterm 2, November 7, 2001 (Note this is a closed book and closed notes examination)<br>
&emsp;1\. Please show an implementation for P(S) and V(S), written as a monitor. (Such an<br>
&emsp;&emsp;implementation was shown in the Hoare article in the assigned readings.  Please<br>
&emsp;&emsp;write something similar.)  You may continue the answer on the back of the page.<br>
&emsp;&emsp;(14)

&emsp;2\. Assume a disk of 500 cylinders (numbered 0 to 449), the head currently at<br>
&emsp;&emsp;cylinder 50, having most recently read blocks at cylinders 40 and 50, and requests<br>
&emsp;&emsp;pending, in a queue in the following order, to read one block each from the<br>
&emsp;&emsp;following cylinders:<br>
&emsp;&emsp;85   123   48   275   15   480   306   22   5<br>
&emsp;&emsp;For each of the following disk arm scheduling algorithms, please give the<br>
&emsp;&emsp;sequence in which the blocks are read, and the total number of cylinders that the<br>
&emsp;&emsp;head moves. (Partial credit will be given only for obvious and trivial errors.) (12)<br>
&emsp;&emsp;FIFO, SSTF, SCAN, CSCAN

&emsp;3\. Define a “stack algorithm.”  For each of OPT, FIFO and LRU, prove which is or<br>
&emsp;&emsp;is not a stack algorithm. (14)

&emsp;4\. Describe and explain ALL of the complications and issues that arise if we are<br>
&emsp;&emsp;doing I/O in a computer system in which virtual memory is used.(12)

&emsp;5\. Given a standard Unix file system, such as was discussed in class, how many<br>
&emsp;&emsp;reads must be made to read all of a 64 Kbyte (65536 byte) file residing in /<br>
&emsp;&emsp;usr/home/cs162-aa/homework.txt? Assume a 1024 byte disk block, that only one<br>
&emsp;&emsp;block can be read at a time, that there are no symbolic links, and that all<br>
&emsp;&emsp;directories are their minimum size.  Please explain your answer.  Include ALL<br>
&emsp;&emsp;reads.  Assume no blocks in the disk cache.  Assume that each read only gets on<br>
&emsp;&emsp;“thing” at a time. (12)

&emsp;6\. For the following page reference string, please compute the number of pages<br>
&emsp;&emsp;faults when using FIFO, LRU, and OPT replacement, and for memory sizes of 3<br>
&emsp;&emsp;and 4 page frames, and enter the results in the table. (18)<br>
&emsp;&emsp;8  7  6  5  8  7  9  8  7  6  5  9


![Figure on page 1](figures/questions-p01-fig01.png)


---

<a id="page-2"></a>
**Page 2**

7\. Please select an answer and enter in the indicated space. (No credit left if blank.)<br>
&emsp;(18)<br>
&emsp;&emsp;i.   Which of these is a reasonable rotational speed for a magnetic disk?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;a) 100000 rpm<br>
&emsp;&emsp;&emsp;&emsp;&emsp;b) 10000 rps<br>
&emsp;&emsp;&emsp;&emsp;&emsp;c) 7200 rpm<br>
&emsp;&emsp;&emsp;&emsp;&emsp;d) 25000 rpm<br>
&emsp;&emsp;&emsp;&emsp;&emsp;e) 3600 rps<br>
&emsp;&emsp;ii.   Which of these is a reasonable price for a (cheap) 50 GB disk at<br>
&emsp;&emsp;&emsp;&emsp;&emsp;today’s prices?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;a) 500<br>
&emsp;&emsp;&emsp;&emsp;&emsp;b) 1000<br>
&emsp;&emsp;&emsp;&emsp;&emsp;c) 3000<br>
&emsp;&emsp;&emsp;&emsp;&emsp;d) 10<br>
&emsp;&emsp;&emsp;&emsp;&emsp;e) 30<br>
&emsp;&emsp;&emsp;&emsp;&emsp;f)   150<br>
&emsp;&emsp;iii.   Which of these is a reasonable media data rate for a modern high end<br>
&emsp;&emsp;&emsp;&emsp;&emsp;magnetic disk?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;a) 50 MB/sec<br>
&emsp;&emsp;&emsp;&emsp;&emsp;b) 500 MB/sec<br>
&emsp;&emsp;&emsp;&emsp;&emsp;c) 500 KB/sec<br>
&emsp;&emsp;&emsp;&emsp;&emsp;d) 3MB/sec<br>
&emsp;&emsp;&emsp;&emsp;&emsp;e) 10MB/sec<br>
&emsp;&emsp;iv.   Which of these would be a typical power consumption for a disk in a<br>
&emsp;&emsp;&emsp;&emsp;&emsp;desktop computer?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;a) 1000W<br>
&emsp;&emsp;&emsp;&emsp;&emsp;b) 10 KW<br>
&emsp;&emsp;&emsp;&emsp;&emsp;c) 100 KW<br>
&emsp;&emsp;&emsp;&emsp;&emsp;d) 1W<br>
&emsp;&emsp;&emsp;&emsp;&emsp;e) 10W<br>
&emsp;&emsp;&emsp;&emsp;&emsp;f)   100W<br>
&emsp;&emsp;v.   Which of these is a typical claimed (advertised) MTBF for a modern<br>
&emsp;&emsp;&emsp;&emsp;&emsp;disk?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;a) 5 years<br>
&emsp;&emsp;&emsp;&emsp;&emsp;b) 100 years<br>
&emsp;&emsp;&emsp;&emsp;&emsp;c) 1000 hours<br>
&emsp;&emsp;&emsp;&emsp;&emsp;d) 80000 hours<br>
&emsp;&emsp;&emsp;&emsp;&emsp;e) 300000 hours<br>
&emsp;&emsp;vi.   What is the approximate areal bit density of a standard 9-track tape,<br>
&emsp;&emsp;&emsp;&emsp;&emsp;using the highest density(bpsi = bits per square inch)?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;a) 100,000,000<br>
&emsp;&emsp;&emsp;&emsp;&emsp;b) 1,000,000,000<br>
&emsp;&emsp;&emsp;&emsp;&emsp;c) 100,000<br>
&emsp;&emsp;&emsp;&emsp;&emsp;d) 1,000,000<br>
&emsp;&emsp;&emsp;&emsp;&emsp;e) 10,000,000


---

<a id="page-3"></a>
**Page 3**

&emsp;&emsp;&emsp;vii.   A typical average seek time for a modern disk would be?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;a) 500 ms<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;b) 1 second<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;c) 5 microseconds<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;d) 500 microseconds<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;e) 5 ms<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;f)   50 ms<br>
&emsp;&emsp;&emsp;viii.   The standard block or sector size on a modern disk is:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;a) 2048 B<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;b) 4096 B<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;c) 16384 B<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;d) 64 B<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;e) 128 B<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;f)   256 B<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;g) 512 B<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;h) 1024 B<br>
&emsp;&emsp;&emsp;ix.   The approximate areal bit density of the highest capacity IBM<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Microdrive is approximately: (mb = megabits, si = square inch)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;a) 15 mb/si<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;b) 150 mb/si<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;c) 1500 mb/si<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;d) 15000 mb/si<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;e) 0.5mb/si<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;f)   1.5mb/si<br>
----------------------------------------------------------------------------------------------------------<br>
solutions to the last problem:<br>
c, f, d, e, e, c , e, g, o.

