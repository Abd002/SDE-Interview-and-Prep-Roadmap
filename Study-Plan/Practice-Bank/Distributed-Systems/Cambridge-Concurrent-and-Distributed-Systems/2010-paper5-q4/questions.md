# Cambridge Computer Science Tripos 2010, Paper 5, Question 4: Questions

> Copied from the original: <https://www.cl.cam.ac.uk/teaching/exams/pastpapers/y2010p5q4.pdf>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

**2010 Paper 5 Question 4**

**Concurrent and Distributed Systems**

In an application, processes may be identified as “readers” or “writers” of a<br>
certain data object. Multiple-reader, single-writer access to this object must be<br>
implemented, with priority for writers over readers. Readers execute procedures<br>
startread and endread before and after reading.   Writers execute procedures<br>
startwrite and endwrite before and after writing one-at-a-time.

The following variables are used in an implementation of the algorithm:<br>
&emsp;&emsp;&emsp;ar   is the count of active readers<br>
&emsp;&emsp;&emsp;rr   is the count of reading readers<br>
&emsp;&emsp;&emsp;aw   is the count of active writers<br>
&emsp;&emsp;&emsp;ww   is the count of writing writers (who write one-at-a-time)

(a) In a semaphore implementation:

&emsp;For mutual exclusion:<br>
&emsp;SemCountGuard is a semaphore under which the above counts are read and<br>
&emsp;written.<br>
&emsp;SemWrite is for writers to wait on, in order to write one-at-a-time.<br>
&emsp;For condition synchronisation:<br>
&emsp;SemOKtoRead is for readers to wait until all writers have finished.<br>
&emsp;SemOKtoWrite is for writers to wait until currently reading readers have<br>
&emsp;finished.

&emsp;Discuss the following pseudocode for an attempted implementation of<br>
&emsp;startread:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;procedure startread ( )<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;wait(SemCountGuard);<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;ar := ar + 1;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;if aw \> 0 then wait(SemOKtoRead);<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;rr := rr + 1;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;signal(SemCountGuard)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;return<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[6 marks\]

(b) Using the above example, comment on the ease of monitor programming and<br>
&emsp;implementation, compared with semaphore programming. Assume a monitor<br>
&emsp;ReadersWriters defines condition variables OKtoRead andOKtoWrite.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[6 marks\]

(c)   Describe and comment on the Java approach to supporting mutual exclusion<br>
&emsp;and condition synchronisation.   \[4 marks\]

(d) Explain how active objects and guarded commands avoid some of the issues<br>
&emsp;arising in the above programs.   \[4 marks\]

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1

