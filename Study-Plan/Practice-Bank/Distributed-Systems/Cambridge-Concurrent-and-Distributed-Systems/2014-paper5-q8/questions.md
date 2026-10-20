# Cambridge Computer Science Tripos 2014, Paper 5, Question 8: Questions

> Copied from the original: <https://www.cl.cam.ac.uk/teaching/exams/pastpapers/y2014p5q8.pdf>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

**COMPUTER SCIENCE TRIPOS Part IB – 2014 – Paper 5**

**8**   **Concurrent and Distributed Systems (RNW)**

&emsp;(a) Monitors are a programming primitive linking data with two synchronization<br>
&emsp;&emsp;&emsp;types:   mutual exclusion and condition synchronisation.   Which is provided<br>
&emsp;&emsp;&emsp;implicitly; which is provided explicitly?   \[1 mark\]

&emsp;(b)   Describe two ways in which Monitors and Conditional Critical Regions differ.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[2 marks\]

&emsp;(c)   The object-oriented programming style encouraged by Monitors has many<br>
&emsp;&emsp;&emsp;benefits as the number of data types and locks increases in the system.

&emsp;&emsp;&emsp;(i)   Placing all data in a single Monitor may improve program correctness.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Explain why this might have undesirable performance effects.   \[1 mark\]

&emsp;&emsp;&emsp;(ii) One problem that can arise when using multiple locks is deadlock, which can<br>
&emsp;&emsp;&emsp;&emsp;&emsp;be prevented by imposing a partial order on locks. Describe the implications<br>
&emsp;&emsp;&emsp;&emsp;&emsp;this has for code structure when using Monitors.   \[2 marks\]

&emsp;&emsp;&emsp;(iii) Explain why Java’s Monitor feature does not necessarily impose this code<br>
&emsp;&emsp;&emsp;&emsp;&emsp;structure.   \[2 marks\]

&emsp;(d) Condition variables allow condition satisfaction to be signalled between threads.<br>
&emsp;&emsp;&emsp;Explain the difference between Hoare’s signal-and-wait and Mesa’s signal-and-<br>
&emsp;&emsp;&emsp;continue in terms of mutual exclusion and scheduling.   \[4 marks\]

&emsp;(e) Consider the (incorrect) pseudocode on the next page:

&emsp;&emsp;&emsp;(i)   Describe and justify minimal modifications to this code, referencing line<br>
&emsp;&emsp;&emsp;&emsp;&emsp;numbers, in order to make it correct in the presence of Hoare signal-and-wait<br>
&emsp;&emsp;&emsp;&emsp;&emsp;semantics.   \[4 marks\]

&emsp;&emsp;&emsp;(ii) Describe and justify minimal modifications to this code, referencing<br>
&emsp;&emsp;&emsp;&emsp;&emsp;line numbers, in order to make it correct in the presence of Mesa<br>
&emsp;&emsp;&emsp;&emsp;&emsp;signal-and-continue semantics.   \[4 marks\]

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**\[continued . . . \]**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1


---

<a id="page-2"></a>
**Page 2**

`1:`   `monitor` `ProducerConsumer` `{`<br>
`2:`   `int` `in,` `out,` `buf[N];`<br>
`3:`   `condition` `notfull,` `notempty;`<br>
`4:`<br>
`5:`   `procedure` `produce(item)` `{`<br>
`6:`   `if` `((in-out)` `==` `N)`<br>
`7:`   `wait(notfull);`<br>
`8:`   `buf[in` `%` `N]` `=` `item;`<br>
`9:`   `if` `((in-out)` `==` `0)`<br>
`10:`   `signal(notempty);`<br>
`11:`   `in` `=` `in` `+` `1;`<br>
`12:`   `}`<br>
`13:`<br>
`14:`   `procedure` `int` `consume()` `{`<br>
`15:`   `if` `((in-out)` `==` `0)`<br>
`16:`   `wait(notempty);`<br>
`17:`   `item` `=` `buf[out` `%` `N];`<br>
`18:`   `if` `((in-out)` `==` `N)`<br>
`19:`   `signal(notfull);`<br>
`20:`   `out` `=` `out` `+` `1;`<br>
`21:`   `}`<br>
`22:`<br>
`23:`   `/*` `init` `*/` `{` `in` `=` `out` `=` `0;` `}`<br>
`24:`   `}`

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2

