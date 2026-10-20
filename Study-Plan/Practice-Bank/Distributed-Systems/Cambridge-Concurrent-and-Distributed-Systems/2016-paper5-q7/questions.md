# Cambridge Computer Science Tripos 2016, Paper 5, Question 7: Questions

> Copied from the original: <https://www.cl.cam.ac.uk/teaching/exams/pastpapers/y2016p5q7.pdf>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

**COMPUTER SCIENCE TRIPOS Part IB – 2016 – Paper 5**

**7**   **Concurrent and Distributed Systems (RNW)**<br>
&emsp;This question is with respect to an operating system that supports multi-threaded<br>
&emsp;processes using the POSIX threads (`pthreads`) API. Assume that each call to `printf`<br>
&emsp;prints its output atomically, that thread scheduling is non-deterministic, and that<br>
&emsp;threads are allocated unique and sequential integer IDs starting with 0.<br>
&emsp;(a) Some program state is per-process, and some is per-thread. How many instances<br>
&emsp;&emsp;&emsp;of each of the following will a 2-thread process have: virtual address space,<br>
&emsp;&emsp;&emsp;executable program, register file, scheduling state (e.g., `RUN`, `SLEEP`), and stack?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[5 marks\]<br>
&emsp;(b)   A programmer adds `printf`s to a concurrent program to debug a race condition,<br>
&emsp;&emsp;&emsp;but the symptoms vanish. Explain why this might have happened.   \[2 marks\]<br>
&emsp;(c)   `thrprint` accepts as arguments the current thread’s unique ID and a debug<br>
&emsp;&emsp;&emsp;message to print.   If each thread calls `thrprint` exactly once on start, how<br>
&emsp;&emsp;&emsp;many possible interleavings are there with n threads?   \[2 marks\]<br>
&emsp;&emsp;&emsp;`void` `thrprint(int` `threadid,` `char` `*message)` `{`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`printf("Thread` `%d:` `%sn",` `threadid,` `message);`<br>
&emsp;&emsp;&emsp;`}`<br>
&emsp;(d) `ordered` `thrprint` attempts to print debug messages ordered by thread ID.<br>
&emsp;&emsp;&emsp;Describe three ways in which the synchronisation in this implementation is<br>
&emsp;&emsp;&emsp;incorrect, and provide a corrected pseudocode implementation.   \[6 marks\]<br>
&emsp;&emsp;&emsp;`int`   `next_thread_id` `=` `0;`   `//` `Next` `ID` `to` `print`<br>
&emsp;&emsp;&emsp;`pthread_mtx_t`   `ordering_mtx;`   `//` `Lock` `protecting` `next` `ID`<br>
&emsp;&emsp;&emsp;`pthread_cond_t` `ordering_cv;`   `//` `next_thread_id` `has` `changed`

&emsp;&emsp;&emsp;`void` `ordered_thrprint(int` `thread_id,` `char` `*message)` `{`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`pthread_mtx_lock(ordering_mtx);`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`if` `(thread_id` `!=` `next_thread_id)` `{`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`pthread_cond_wait(ordering_cv,` `ordering_mtx);`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`}`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`next_thread_id` `=` `next_thread_id` `+` `1;`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`pthread_mtx_unlock(ordering_mtx);`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`printf("Thread` `%d:` `%sn",` `thread_id,` `message);`<br>
&emsp;&emsp;&emsp;`}`<br>
&emsp;(e) This approach to implementing `ordered` `thrprint` suffers a substantial per-<br>
&emsp;&emsp;&emsp;formance problem:   if lower-numbered threads are slow in starting, then<br>
&emsp;&emsp;&emsp;higher-numbered threads will also be delayed. Describe an alternative strategy,<br>
&emsp;&emsp;&emsp;paying particular attention to synchronisation, that maintains ordered output<br>
&emsp;&emsp;&emsp;while allowing greater concurrency.   \[5 marks\]

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1

