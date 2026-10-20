# Berkeley CS162 Fall 2003: Midterm 1: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;fa-1.html<br>
CS162 Fall 2003<br>
Prof. Alan Jay Smith<br>
Midterm 1

1\.    Describe the differences between processes, programs, and threads. (As part of your answer, you should<br>
define each of these.) (12)<br>
2\.    For the following table of jobs, arrival times (NOT interarrival times), and service times, compute the<br>
completion times of each job and the average flow time under FCFS, SJF, and RR. For RR, Q = 1.0. Show<br>
your work. (15)

Job      \|      Arrival Time     \|   Service Time<br>
-----------------------------------------------------<br>
A       \|         0                    \|        10<br>
B       \|        2.1                  \|        8<br>
C       \|         5.2                 \|        3<br>
D      \|        11.3                \|        12

3\.    a. Explain why for scheduling CPU processes, SET is expected to have a lower mean flow time than RR<br>
which should have a lower mean flow time than FCFS. (8)<br>
b. Now consider the situation of a computer technician building PCs on a workbench. The components of<br>
each PC are specified in a parts list. (E.g. CPU board, memory SIMMS, power supply, 40GB disk, 80 GB<br>
disk , JAZ drive, …). The tech receives orders to build computers over time. He ships each computer when he<br>
finished it. He could schedule the assembly using SET, RR, FCFS. Which of these algorithms would give the<br>
best performance (minimum mean flow time)? Which would give the worst? Why? Explain. (8)<br>
c. Would it be possible to schedule the computer assembly (as in part (b)) using SRPT? Why or Why Not? If<br>
it is possible, how would SRPT perform relative to SET, RR and FCFS? (4)

4\.    Suppose process A will attempt to acquire resources R1, R2, R3 in that order, and process B will attempt<br>
to acquire resources R3 then R1. Draw a resource request graph illustrating the possible deadlock. What<br>
characteristic of this graph shows deadlock? Give an approach to prevent this from happening. (12)<br>
5\.    In this problem we attempt to deal with the “Too Much Milk” problem by providing two methods. Any<br>
thread calling buyMilkIfWeNeedIt() at any time should buy mil if and only if there is no milk. Any thread<br>
calling drinkMilkIfWeHaveIt() at any time should drink milk if and only if there is milk. It should never occur<br>
that buy\_milk() is called twice without an intervening call to drink\_milk, and vice versa. Determine what, if<br>
anything, is wrong with this solution. (please list and explain everything that you think is wrong) (12)

boolean gotmilk = false;<br>
Lock mutex = new Lock() ;

public buyMilkIfWeNeedIt()<br>
{<br>
if (gotmilk)<br>
return;<br>
mutex.acquire();<br>
buy\_milk( );<br>
gotmilk = true;<br>
mutex.release() ;<br>
}

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1


---

<a id="page-2"></a>
**Page 2**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;fa-1.html

public drinkMilkIfWeHaveIt ()<br>
{<br>
if (!gotmilk)<br>
return;<br>
mutex.acquire();<br>
drink\_milk();<br>
gotmilk = false;<br>
mutex.release();<br>
}

6\.    A computer system has a 36-bit virtual address space with a page size of 64 kilobytes. There are 4 bytes<br>
per page table entry. Each page table entry uses 1 bit for valid,  1 bit for “reference”, three bits for protection,<br>
1 bit for dirty, and the rest for the real page address.<br>
a)    How many pages are in the virtual address space? Explain (3)<br>
b)    What is the maximum size of addressable physical memory on this system? Explain. (3)<br>
c)    How large is the page table, assuming that it is one level and all entries are valid? Explain. (3)<br>
d)    Suppose the currently running process makes a call to load data from 36-bit virtual address x12345BEEF.<br>
Draw a picture of how this address is translated using paging and show how the actual data is found in<br>
physical memory. (8)

7\.    For the following two cases,  please either show a complete safe sequence or prove that there isn’t one<br>
(12):

Process     has-X        has-Y        max-needs-X        max-needs-Y<br>
A           30              10                    60                           40<br>
B           50              80                   100                         220<br>
C           30              20                   105                          50<br>
D            0               70                    50                           90

(a) available : X :    40      Y:    40<br>
(b) available:  X:     40      Y:    35

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2

