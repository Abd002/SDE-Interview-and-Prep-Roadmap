# Berkeley CS162 Fall 2014: Midterm 1: Official solutions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Computer Science 162, Fall 2014**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**David Culler**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**University of California, Berkeley**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Midterm 1**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**September 29, 2014**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Name

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;SID

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Login

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;TA Name

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Section Time

This is a closed book exam with one 2-sided page of notes permitted. It is intended to be a 50<br>
minute exam. You have 80 minutes to complete it. The number at the beginning of each question<br>
indicates the points for that question. Write all of your answers directly on this paper. Make<br>
your answers as concise as possible. If there is something in a question that you believe is open to<br>
interpretation, please raise your hand to request clarification. When told to open the exam, put<br>
your login on every page and check that you have them all. (Final page is for reference.)<br>
&emsp;By my signature below, I swear that this exam is my own work. I have not obtained answers or<br>
partial answers from anyone. Furthermore, if I am taking the exam early, I promise not to discuss<br>
it with anyone prior to completion of the regular exam, and otherwise I have not discussed it with<br>
anyone who took the early alternate exam.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;X \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Grade Table (for instructor use only)**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Question   Points   Score<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1   25<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2   25<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3   25<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4   25<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Total:   100


---

<a id="page-2"></a>
**Page 2**

Computer Science 162, Fall 2014   Midterm 1 - Page 2 of 16   September 29, 2014

1\. (25 points) **Operating Systems Concepts**<br>
&emsp;(a) (20 points) Choose **either** true or false for the below questions. You do not need to provide<br>
&emsp;&emsp;&emsp;justifications.<br>
&emsp;&emsp;&emsp;i. (2 points) A user program can request an operating system service by issuing a system<br>
&emsp;&emsp;&emsp;&emsp;call.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;√**True**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;⃝False<br>
&emsp;&emsp;&emsp;ii. (2 points) Threads in a single process are prevented by the operating system from<br>
&emsp;&emsp;&emsp;&emsp;accessing the stacks of other threads.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;⃝True<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;√**False**<br>
&emsp;&emsp;&emsp;iii. (2 points) A pintos kernel thread enters thread\_switch with interrupts disabled, so<br>
&emsp;&emsp;&emsp;&emsp;thread\_switch enables them before switching to the next thread.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;⃝True<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;√**False**<br>
&emsp;&emsp;&emsp;iv. (2 points) The scheduler places RUNNING threads on a queue according to a schedul-<br>
&emsp;&emsp;&emsp;&emsp;ing algorithm.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;⃝True<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;√**False**<br>
&emsp;&emsp;&emsp;v. (2 points) In operating systems like Unix, different operations are used for accessing<br>
&emsp;&emsp;&emsp;&emsp;files, transferring information through sockets, and communication between processes.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;⃝True<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;√**False**<br>
&emsp;&emsp;&emsp;vi. (2 points) In operating systems like Unix, different operations are used for setting file<br>
&emsp;&emsp;&emsp;&emsp;transfers and network communication.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;√**True**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;⃝False<br>
&emsp;&emsp;&emsp;vii. (2 points) Interrupt handlers can call pthread\_mutex\_lock because it is atomic.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;⃝True<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;√**False**<br>
&emsp;&emsp;&emsp;viii. (2 points) Disabling interrupts always protects a critical section of code.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;⃝True<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;√**False**<br>
&emsp;&emsp;&emsp;ix. (2 points) A successful call to fork() always returns twice - once in the child process<br>
&emsp;&emsp;&emsp;&emsp;and once in the parent process.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;√**True**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;⃝False<br>
&emsp;&emsp;&emsp;x. (2 points) Path resolution is implemented by the kernel.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;⃝True<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;√**False**


---

<a id="page-3"></a>
**Page 3**

Computer Science 162, Fall 2014   Midterm 1 - Page 3 of 16   September 29, 2014

&emsp;(b) (5 points) Which of the following is true about Round Robin Scheduling? Select **all** the<br>
&emsp;&emsp;&emsp;choices that apply.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;⃝Cache performance is likely to improve relative to FCFS.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;⃝If no new threads are entering the system all threads will get a chance to run<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;in the cpu every QUANTA\*SECONDS\_PER\_TICK\*NUMTHREADS seconds. (Assuming<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;QUANTA is in ticks).<br>
&emsp;&emsp;&emsp;&emsp;&emsp;√**This is the default scheduler in Pintos**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;√**If quanta is constantly updated to become the # of cpu ticks since**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**boot, Round Robin becomes FIFO.**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;⃝If all threads in the system have the same priority, Priority Schedulers **must**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;behave like round robin.<br>
2\. (25 points) **Processes and Threads**<br>
&emsp;For the following consider the following nearly identical process based and thread based pro-<br>
&emsp;grams. For each question, answer YES or NO and provide a short, crisp explanation. **Assume**<br>
&emsp;**that functions will be well-behaved (e.g., malloc will succeed) and that printf() is**<br>
&emsp;**atomic.** (We will answer half the first part to provide an example.)


---

<a id="page-4"></a>
**Page 4**

Computer Science 162, Fall 2014   Midterm 1 - Page 4 of 16   September 29, 2014

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1   int i = 100;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2   char \*buf;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4   void   process () {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;5   pid\_t   pid;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;6   int status , rd;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;7   int j = 1;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;8   buf = strcpy(malloc (100) , "boring");<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;9   pid = fork ();<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;10   if (pid != 0) {   /\* parent \*/<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;11   printf("P␣Parent:␣j=%d\\n", j);<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;12   i = 162;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;13   j = 2;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;14   printf("P␣Parent:␣j=%d\\n", j);<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;15   printf("P␣Parent:␣%s\\n", buf );<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;16   j = 4;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;17   wait (& status );<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;18   } else {   /\* child \*/<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;19   printf("P␣Child:␣i=%d,␣j=%d\\n", i, j);<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;20   printf("P␣Child:␣i=%d,␣j=%d\\n", i, j);<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;21   j = 3;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;22   strcpy(buf , "cool");<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;23   exit (0);<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;24   }<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;25   }

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;,<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1   int i = 100;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2   char \*buf;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4   void \*tfun(void \*noarg) {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;5   int j = 0;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;6   printf("T␣Child:␣i=%d,␣j=%d\\n", i, j);<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;7   printf("T␣Child:␣i=%d,␣j=%d\\n", i, j);<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;8   j = 3;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;9   strcpy(buf , "cool");<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;10   pthread\_exit (NULL );<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;11   }<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;12<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;13   void   thread () {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;14   pthread\_t   tid;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;15   int j = 1;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;16   buf = strcpy(malloc (100) , "boring");<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;17   pthread\_create (&tid , NULL , tfun , NULL );<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;18   printf("T␣Parent:␣j=%d\\n", j);<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;19   i = 162;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;20   j = 2;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;21   printf("T␣Parent:␣j=%d\\n", j);<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;22   printf("T␣Parent:␣%s\\n", buf );<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;23   j = 4;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;24   pthread\_join (tid , NULL );<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;25   }

&emsp;(a) (5 points) Can the output of the process-based program ever include (meaning they appear<br>
&emsp;&emsp;&emsp;in this order, possibly with other output interleaved) the following? Why? (We are going<br>
&emsp;&emsp;&emsp;to answer this one for you!)<br>
&emsp;&emsp;&emsp;P Parent: j=1<br>
&emsp;&emsp;&emsp;P Child: i=100, j=1<br>
&emsp;&emsp;&emsp;P Parent: j=2

&emsp;&emsp;&emsp;YES. The child process may get switched in after the parent prints its initial value of<br>
&emsp;&emsp;&emsp;its stack variable j and the parent later switch back in. The child obtained a copy of<br>
&emsp;&emsp;&emsp;the parent’s stack and heap at the fork and it has changed neither when it first prints.


---

<a id="page-5"></a>
**Page 5**

Computer Science 162, Fall 2014   Midterm 1 - Page 5 of 16   September 29, 2014

&emsp;&emsp;&emsp;Can the output of the thread-based program ever include the following? Why?<br>
&emsp;&emsp;&emsp;T Parent: j=1<br>
&emsp;&emsp;&emsp;T Child: i=100, j=1<br>
&emsp;&emsp;&emsp;T Parent: j=2

&emsp;&emsp;&emsp;**Solution:** No. The child thread has its own j on its stack, and this j only have value<br>
&emsp;&emsp;&emsp;0 when the child thread prints.

&emsp;(b) (10 points) (be careful) Can the output of the process-based program ever include the<br>
&emsp;&emsp;&emsp;following? Why?<br>
&emsp;&emsp;&emsp;P Parent: j=1<br>
&emsp;&emsp;&emsp;P Parent: j=2<br>
&emsp;&emsp;&emsp;P Child: i=100, j=1

&emsp;&emsp;&emsp;**Solution:** YES. The child process may get switched in after the parent process executes<br>
&emsp;&emsp;&emsp;lines 11-14. The child obtained a copy of the parent’s stack and heap at the fork and it<br>
&emsp;&emsp;&emsp;has changed neither when it first prints.

&emsp;&emsp;&emsp;Can the output of the thread-based program ever include the following? Why?<br>
&emsp;&emsp;&emsp;T Parent: j=1<br>
&emsp;&emsp;&emsp;T Parent: j=2<br>
&emsp;&emsp;&emsp;T Child: i=100, j=1

&emsp;&emsp;&emsp;**Solution:** NO. If the child is switched in after the parent reaches line 14, the value of<br>
&emsp;&emsp;&emsp;shared variable i must be 162. And also j in the child thread should be 0.

&emsp;(c) (10 points) Can the output of the process-based program ever include the following? Why?<br>
&emsp;&emsp;&emsp;P Parent: cool


---

<a id="page-6"></a>
**Page 6**

Computer Science 162, Fall 2014   Midterm 1 - Page 6 of 16   September 29, 2014

&emsp;&emsp;&emsp;**Solution:** NO. The parent process never changes the value of \*buf from what was set<br>
&emsp;&emsp;&emsp;in line 8. The child has its own copy of the heap.

&emsp;&emsp;&emsp;Can the output of the thread-based program ever include the following? Why?<br>
&emsp;&emsp;&emsp;T Parent: cool

&emsp;&emsp;&emsp;**Solution:** YES. The child thread could get switched in and execute line 11 before the<br>
&emsp;&emsp;&emsp;parent resumes to execute line 22.


---

<a id="page-7"></a>
**Page 7**

Computer Science 162, Fall 2014   Midterm 1 - Page 7 of 16   September 29, 2014

3\. (25 points) **Synchronized Objects**

&emsp;(a) (15 points) Assuming malloc is threadsafe, modify (by showing where code needs to be<br>
&emsp;&emsp;&emsp;inserted) the following unbounded stack abstraction to make ppush and ppop threadsafe<br>
&emsp;&emsp;&emsp;using pthreads operations. We have started it for you by adding the lock to the pdl struct.<br>
&emsp;&emsp;&emsp;(You do not need to eliminate the busy-wait. It only needs to be threadsafe, not highly<br>
&emsp;&emsp;&emsp;efficient. You may not need to fill every line indicated.)<br>
&emsp;(b) (10 points) Fill in dequeue to create a thread-safe function that waits until the stack is<br>
&emsp;&emsp;&emsp;non-empty, removes and item and returns it.<br>
&emsp;&emsp;&emsp;typedef struct item {<br>
&emsp;&emsp;&emsp;&emsp;struct item \*next;<br>
&emsp;&emsp;&emsp;&emsp;void \*val;<br>
&emsp;&emsp;&emsp;} item\_t;

&emsp;&emsp;&emsp;typedef struct pdl {<br>
&emsp;&emsp;&emsp;&emsp;item\_t \*head;

&emsp;&emsp;&emsp;&emsp;-------------------------<br>
&emsp;&emsp;&emsp;} pdl\_t;

&emsp;&emsp;&emsp;pdl\_t \*new\_pdl() {<br>
&emsp;&emsp;&emsp;&emsp;pdl\_t \*s = malloc(sizeof(pdl\_t));<br>
&emsp;&emsp;&emsp;&emsp;s-\>head = NULL;<br>
&emsp;&emsp;&emsp;&emsp;pthread\_mutex\_init(&s-\>pdl\_lock, NULL);<br>
&emsp;&emsp;&emsp;&emsp;return s;<br>
&emsp;&emsp;&emsp;}

&emsp;&emsp;&emsp;void ppush (pdl\_t \*s, void \*val) {

&emsp;&emsp;&emsp;&emsp;\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_<br>
&emsp;&emsp;&emsp;&emsp;item\_t \*new\_item;

&emsp;&emsp;&emsp;&emsp;\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_<br>
&emsp;&emsp;&emsp;&emsp;new\_item = malloc(sizeof(item\_t));<br>
&emsp;&emsp;&emsp;&emsp;new\_item-\>val = val;<br>
&emsp;&emsp;&emsp;&emsp;new\_item-\>next = s-\>head;<br>
&emsp;&emsp;&emsp;&emsp;s-\>head = new\_item;

&emsp;&emsp;&emsp;&emsp;\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_<br>
&emsp;&emsp;&emsp;}


---

<a id="page-8"></a>
**Page 8**

Computer Science 162, Fall 2014   Midterm 1 - Page 8 of 16   September 29, 2014

&emsp;&emsp;&emsp;void \*ppop(pdl\_t \*s) {

&emsp;&emsp;&emsp;&emsp;\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_<br>
&emsp;&emsp;&emsp;&emsp;item\_t \*pop;<br>
&emsp;&emsp;&emsp;&emsp;pop = s-\>head;<br>
&emsp;&emsp;&emsp;&emsp;void \*res = NULL;<br>
&emsp;&emsp;&emsp;&emsp;if (pop) {

&emsp;&emsp;&emsp;&emsp;&emsp;\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

&emsp;&emsp;&emsp;&emsp;&emsp;res = pop-\>val;

&emsp;&emsp;&emsp;&emsp;&emsp;s-\>head = pop-\>next;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;free(pop);<br>
&emsp;&emsp;&emsp;&emsp;}

&emsp;&emsp;&emsp;&emsp;\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_<br>
&emsp;&emsp;&emsp;&emsp;return res;<br>
&emsp;&emsp;&emsp;}

&emsp;&emsp;&emsp;bool empty\_pdl(pdl\_t \*s) {<br>
&emsp;&emsp;&emsp;&emsp;return (s-\>head == NULL);<br>
&emsp;&emsp;&emsp;}

&emsp;&emsp;&emsp;void \*dequeue(pdl\_t \*s) {<br>
&emsp;&emsp;&emsp;&emsp;void \* res;

&emsp;&emsp;&emsp;&emsp;\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

&emsp;&emsp;&emsp;&emsp;\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

&emsp;&emsp;&emsp;&emsp;&emsp;pthread\_yield();<br>
&emsp;&emsp;&emsp;&emsp;\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

&emsp;&emsp;&emsp;&emsp;\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

&emsp;&emsp;&emsp;&emsp;return res;<br>
&emsp;&emsp;&emsp;}

&emsp;&emsp;&emsp;**Solution:**<br>
&emsp;&emsp;&emsp;typedef struct item {<br>
&emsp;&emsp;&emsp;&emsp;struct item \*next;<br>
&emsp;&emsp;&emsp;&emsp;void \*val;


---

<a id="page-9"></a>
**Page 9**

Computer Science 162, Fall 2014   Midterm 1 - Page 9 of 16   September 29, 2014

&emsp;&emsp;&emsp;} item\_t;

&emsp;&emsp;&emsp;typedef struct pdl {<br>
&emsp;&emsp;&emsp;&emsp;item\_t \*head;<br>
&emsp;&emsp;&emsp;&emsp;pthread\_mutex\_t pdl\_lock;<br>
&emsp;&emsp;&emsp;} pdl\_t;

&emsp;&emsp;&emsp;pdl\_t \*new\_pdl() {<br>
&emsp;&emsp;&emsp;&emsp;pdl\_t \*s = malloc(sizeof(pdl\_t));<br>
&emsp;&emsp;&emsp;&emsp;s-\>head = NULL;<br>
&emsp;&emsp;&emsp;&emsp;pthread\_mutex\_init(&s-\>pdl\_lock, NULL);<br>
&emsp;&emsp;&emsp;&emsp;return s;<br>
&emsp;&emsp;&emsp;}

&emsp;&emsp;&emsp;void ppush (pdl\_t \*s, void \*val) {<br>
&emsp;&emsp;&emsp;&emsp;pthread\_mutex\_lock(&s-\>pdl\_lock);<br>
&emsp;&emsp;&emsp;&emsp;item\_t \*new\_item;

&emsp;&emsp;&emsp;&emsp;new\_item = malloc(sizeof(item\_t));<br>
&emsp;&emsp;&emsp;&emsp;new\_item-\>val = val;<br>
&emsp;&emsp;&emsp;&emsp;new\_item-\>next = s-\>head;<br>
&emsp;&emsp;&emsp;&emsp;s-\>head = new\_item;

&emsp;&emsp;&emsp;&emsp;pthread\_mutex\_unlock(&s-\>pdl\_lock);<br>
&emsp;&emsp;&emsp;}

&emsp;&emsp;&emsp;void \*ppop(pdl\_t \*s) {<br>
&emsp;&emsp;&emsp;&emsp;item\_t \*pop;

&emsp;&emsp;&emsp;&emsp;pthread\_mutex\_lock(&s-\>pdl\_lock);<br>
&emsp;&emsp;&emsp;&emsp;pop = s-\>head;<br>
&emsp;&emsp;&emsp;&emsp;void \*res = NULL;<br>
&emsp;&emsp;&emsp;&emsp;if (pop) {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;res = pop-\>val;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;s-\>head = pop-\>next;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;free(pop);<br>
&emsp;&emsp;&emsp;&emsp;}<br>
&emsp;&emsp;&emsp;&emsp;pthread\_mutex\_unlock(&s-\>pdl\_lock);<br>
&emsp;&emsp;&emsp;&emsp;return res;<br>
&emsp;&emsp;&emsp;}

&emsp;&emsp;&emsp;bool empty\_pdl(pdl\_t \*s) {<br>
&emsp;&emsp;&emsp;return (s-\>head == NULL);<br>
&emsp;&emsp;&emsp;}


---

<a id="page-10"></a>
**Page 10**

Computer Science 162, Fall 2014   Midterm 1 - Page 10 of 16   September 29, 2014

&emsp;&emsp;&emsp;void \*dequeue(pdl\_t \*s) {<br>
&emsp;&emsp;&emsp;&emsp;void \* res;<br>
&emsp;&emsp;&emsp;&emsp;while ((res = ppop(s)) == NULL) {<br>
&emsp;&emsp;&emsp;&emsp;pthread\_yield()<br>
&emsp;&emsp;&emsp;&emsp;}<br>
&emsp;&emsp;&emsp;&emsp;return res;<br>
&emsp;&emsp;&emsp;}


---

<a id="page-11"></a>
**Page 11**

Computer Science 162, Fall 2014   Midterm 1 - Page 11 of 16   September 29, 2014

4\. (25 points) **Operating System Implementation: Pintos**<br>
&emsp;You design a new scheduler, you call it TFS. The idea is relatively simple, if a thread makes it<br>
&emsp;to the end of a round robin scheduling quanta it sets its own priority to -1 times the number of<br>
&emsp;ticks it has **ever** spent in the cpu.<br>
&emsp;You may make the following assumptions in this problem.<br>
&emsp;&emsp;• Priority scheduling in Pintos is functioning properly,<br>
&emsp;&emsp;• Priority donation is not implemented.<br>
&emsp;&emsp;• Alarm is not implemented.<br>
&emsp;&emsp;• thread\_set\_priority is never called by the thread<br>
&emsp;&emsp;• You may ignore the limited set of priorities enforced by pintos (priority values may span<br>
&emsp;&emsp;&emsp;from INT\_MIN to INT\_MAX).<br>
&emsp;&emsp;i. (4 points) Below is the declaration of struct thread, what field(s) would we need to add<br>
&emsp;&emsp;&emsp;to make TFS possible. You may not need all the blanks.<br>
&emsp;&emsp;&emsp;struct thread<br>
&emsp;&emsp;&emsp;{<br>
&emsp;&emsp;&emsp;&emsp;/\* Owned by thread.c. \*/<br>
&emsp;&emsp;&emsp;&emsp;tid\_t tid;   /\* Thread identifier. \*/<br>
&emsp;&emsp;&emsp;&emsp;enum thread\_status status;   /\* Thread state. \*/<br>
&emsp;&emsp;&emsp;&emsp;char name\[16\];   /\* Name (for debugging purposes). \*/<br>
&emsp;&emsp;&emsp;&emsp;uint8\_t \*stack;   /\* Saved stack pointer. \*/<br>
&emsp;&emsp;&emsp;&emsp;int priority;   /\* Priority. \*/<br>
&emsp;&emsp;&emsp;&emsp;struct list\_elem allelem;   /\* List element for all threads list. \*/

&emsp;&emsp;&emsp;&emsp;/\* Shared between thread.c and synch.c. \*/<br>
&emsp;&emsp;&emsp;&emsp;struct list\_elem elem;   /\* List element. \*/

&emsp;&emsp;&emsp;#ifdef USERPROG<br>
&emsp;&emsp;&emsp;&emsp;/\* Owned by userprog/process.c. \*/<br>
&emsp;&emsp;&emsp;&emsp;uint32\_t \*pagedir;   /\* Page directory. \*/<br>
&emsp;&emsp;&emsp;#endif

&emsp;&emsp;&emsp;&emsp;\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_   /\* What goes here? \*/

&emsp;&emsp;&emsp;&emsp;\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_   /\* What goes here? \*/

&emsp;&emsp;&emsp;&emsp;\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_   /\* What goes here? \*/

&emsp;&emsp;&emsp;&emsp;/\* Owned by thread.c. \*/<br>
&emsp;&emsp;&emsp;&emsp;unsigned magic;   /\* Detects stack overflow. \*/<br>
&emsp;&emsp;&emsp;};

&emsp;&emsp;&emsp;**Solution:**<br>
&emsp;&emsp;&emsp;struct thread<br>
&emsp;&emsp;&emsp;&emsp;{


---

<a id="page-12"></a>
**Page 12**

Computer Science 162, Fall 2014   Midterm 1 - Page 12 of 16   September 29, 2014

&emsp;&emsp;&emsp;&emsp;&emsp;/\* Owned by thread.c. \*/<br>
&emsp;&emsp;&emsp;&emsp;&emsp;tid\_t tid;   /\* Thread identifier. \*/<br>
&emsp;&emsp;&emsp;&emsp;&emsp;enum thread\_status status;   /\* Thread state. \*/<br>
&emsp;&emsp;&emsp;&emsp;&emsp;char name\[16\];   /\* Name (for debugging purposes). \*/<br>
&emsp;&emsp;&emsp;&emsp;&emsp;uint8\_t \*stack;   /\* Saved stack pointer. \*/<br>
&emsp;&emsp;&emsp;&emsp;&emsp;int priority;   /\* Priority. \*/<br>
&emsp;&emsp;&emsp;&emsp;&emsp;struct list\_elem allelem;   /\* List element for all threads list. \*/

&emsp;&emsp;&emsp;&emsp;&emsp;/\* Shared between thread.c and synch.c. \*/<br>
&emsp;&emsp;&emsp;&emsp;&emsp;struct list\_elem elem;   /\* List element. \*/

&emsp;&emsp;&emsp;#ifdef USERPROG<br>
&emsp;&emsp;&emsp;&emsp;&emsp;/\* Owned by userprog/process.c. \*/<br>
&emsp;&emsp;&emsp;&emsp;&emsp;uint32\_t \*pagedir;   /\* Page directory. \*/<br>
&emsp;&emsp;&emsp;#endif

&emsp;&emsp;&emsp;&emsp;&emsp;int ticks\_in\_cpu;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;/\* Owned by thread.c. \*/<br>
&emsp;&emsp;&emsp;&emsp;&emsp;unsigned magic;   /\* Detects stack overflow. \*/<br>
&emsp;&emsp;&emsp;&emsp;};


---

<a id="page-13"></a>
**Page 13**

Computer Science 162, Fall 2014   Midterm 1 - Page 13 of 16   September 29, 2014

&emsp;ii. (8 points) A what is needed for thread\_tick() for TFS to work properly. You may not<br>
&emsp;&emsp;&emsp;need all the blanks.<br>
&emsp;&emsp;&emsp;void<br>
&emsp;&emsp;&emsp;thread\_tick (void)<br>
&emsp;&emsp;&emsp;{<br>
&emsp;&emsp;&emsp;struct thread \*t = thread\_current ();

&emsp;&emsp;&emsp;/\* Update statistics. \*/<br>
&emsp;&emsp;&emsp;if (t == idle\_thread)<br>
&emsp;&emsp;&emsp;&emsp;idle\_ticks++;<br>
&emsp;&emsp;&emsp;#ifdef USERPROG<br>
&emsp;&emsp;&emsp;else if (t-\>pagedir != NULL)<br>
&emsp;&emsp;&emsp;&emsp;user\_ticks++;<br>
&emsp;&emsp;&emsp;#endif<br>
&emsp;&emsp;&emsp;else<br>
&emsp;&emsp;&emsp;&emsp;kernel\_ticks++;

&emsp;&emsp;&emsp;\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_;

&emsp;&emsp;&emsp;\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_;<br>
&emsp;&emsp;&emsp;/\* Enforce preemption. \*/<br>
&emsp;&emsp;&emsp;if (++thread\_ticks \>= TIME\_SLICE) {<br>
&emsp;&emsp;&emsp;&emsp;intr\_yield\_on\_return ();

&emsp;&emsp;&emsp;&emsp;\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_;

&emsp;&emsp;&emsp;}

&emsp;&emsp;&emsp;}

&emsp;&emsp;&emsp;**Solution:**<br>
&emsp;&emsp;&emsp;void<br>
&emsp;&emsp;&emsp;thread\_tick (void)<br>
&emsp;&emsp;&emsp;{<br>
&emsp;&emsp;&emsp;&emsp;struct thread \*t = thread\_current ();


---

<a id="page-14"></a>
**Page 14**

Computer Science 162, Fall 2014   Midterm 1 - Page 14 of 16   September 29, 2014

&emsp;&emsp;&emsp;&emsp;/\* Update statistics. \*/<br>
&emsp;&emsp;&emsp;&emsp;if (t == idle\_thread)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;idle\_ticks++;<br>
&emsp;&emsp;&emsp;#ifdef USERPROG<br>
&emsp;&emsp;&emsp;&emsp;else if (t-\>pagedir != NULL)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;user\_ticks++;<br>
&emsp;&emsp;&emsp;#endif<br>
&emsp;&emsp;&emsp;&emsp;else<br>
&emsp;&emsp;&emsp;&emsp;&emsp;kernel\_ticks++;

&emsp;&emsp;&emsp;&emsp;t-\>ticks\_in\_cpu++;<br>
&emsp;&emsp;&emsp;&emsp;/\* Enforce preemption. \*/<br>
&emsp;&emsp;&emsp;&emsp;if (++thread\_ticks \>= TIME\_SLICE){<br>
&emsp;&emsp;&emsp;&emsp;&emsp;intr\_yield\_on\_return ();<br>
&emsp;&emsp;&emsp;&emsp;&emsp;thread\_set\_priority (-t-\>ticks\_in\_cpu);<br>
&emsp;&emsp;&emsp;&emsp;}

&emsp;&emsp;&emsp;}


---

<a id="page-15"></a>
**Page 15**

Computer Science 162, Fall 2014   Midterm 1 - Page 15 of 16   September 29, 2014

&emsp;iii. (5 points) In a few short words, describe the overall behavior of this scheduler. How is it<br>
&emsp;&emsp;&emsp;different from regular round robin or FIFO scheduler.

&emsp;&emsp;&emsp;&emsp;**Solution:** It essentially penalizes threads for using up the time quanta, and gives<br>
&emsp;&emsp;&emsp;&emsp;them a lower priority. So instead of round robin which treats all the threads “fairly",<br>
&emsp;&emsp;&emsp;&emsp;this scheduler prefers threads that don’t spend a lot of time in the cpu.

&emsp;iv. (4 points) What could you do to "trick" this scheduler to giving a thread more cpu time.<br>
&emsp;&emsp;&emsp;(Hint: thread\_ticks is set to 0 every time the scheduler picks a new thread)

&emsp;&emsp;&emsp;&emsp;**Solution:** After first doing a lot of IO and spending very little time in the cpu,<br>
&emsp;&emsp;&emsp;&emsp;your priority in the cpu will be very high, and then you can just constantly keep<br>
&emsp;&emsp;&emsp;&emsp;yielding, which will reset thread\_ticks so your priority will never be lowered

&emsp;v. (4 points) What is a flaw in this scheduler when you have a steady state of threads being<br>
&emsp;&emsp;&emsp;created, and very little threads destroyed. (Hint: Think about what happens when the<br>
&emsp;&emsp;&emsp;scheduler has run for a really long time).

&emsp;&emsp;&emsp;&emsp;**Solution:** Since you are only keeping track of the number of ticks a thread spends<br>
&emsp;&emsp;&emsp;&emsp;in the cpu, older threads who have "lived" longer will not get to run till all the new<br>
&emsp;&emsp;&emsp;&emsp;threads have spent as much time in the cpu as them.


---

<a id="page-16"></a>
**Page 16**

Computer Science 162, Fall 2014   Midterm 1 - Page 16 of 16   September 29, 2014

/\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\* Pthreads \*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*/<br>
int pthread\_create(pthread\_t \*thread, const pthread\_attr\_t \*attr,<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;void \*(\*start\_routine) (void \*), void \*arg);<br>
int pthread\_join(pthread\_t thread, void \*\*retval);<br>
int pthread\_mutex\_init(pthread\_mutex\_t \*restrict mutex,<br>
&emsp;const pthread\_mutexattr\_t \*restrict attr);<br>
int pthread\_mutex\_lock(pthread\_mutex\_t \*mutex);<br>
int pthread\_mutex\_trylock(pthread\_mutex\_t \*mutex);<br>
int pthread\_mutex\_unlock(pthread\_mutex\_t \*mutex);<br>
int sem\_init(sem\_t \*sem, int pshared, unsigned int value);<br>
int sem\_post(sem\_t \*sem);<br>
int sem\_wait(sem\_t \*sem);<br>
int sem\_trywait(sem\_t \*sem);

/\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\* Strings & Processes \*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*/<br>
char \*strcpy(char \*dest, const char \*src);<br>
char \*strncpy(char \*dest, const char \*src, size\_t n);

pid\_t wait(int \*status);<br>
pid\_t waitpid(pid\_t pid, int \*status, int options);

/\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\* Pintos   \*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*/

