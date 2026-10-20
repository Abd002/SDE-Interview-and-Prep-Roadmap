# Berkeley CS186 Spring 2016: Final: Official solutions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/186>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Peter Perfect<br>
My Name: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_     My Class Login: cs186-\_\_ \_\_ \_\_

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2.<br>
I.Basics   **TID**   **Status**   **LastLSN**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1   Running   70<br>
&emsp;&emsp;&emsp;C   B   E   A<br>
&emsp;1\. \_\_\_\_ 2. \_\_\_\_ 3. \_\_\_\_ 4. \_\_\_\_<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2   Running   80<br>
&emsp;&emsp;&emsp;H   F   I<br>
&emsp;5\. \_\_\_\_ 6. \_\_\_\_ 7. \_\_\_\_<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**PID**   **recLSN**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3   70<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2   80<br>
II. Concurrency<br>
&emsp;1\. ⃞ a     ⃞ b     ⃞ c<br>
&emsp;&emsp;⃞ d     ⃞ e     ⃞ f     ⃞ ∅<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**TID**   **Status**   **LastLSN**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3.<br>
&emsp;2\. T1   T2   1   AborAng   140<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2   Commi7ng   150<br>
&emsp;&emsp;&emsp;&emsp;&emsp;T3   **PID**   **recLSN**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3   70<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2   80<br>
&emsp;3\. ⃞ a      ⃞ b      ⃞ c      ⃞ d      ⃞ ∅<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1110

&emsp;4.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;T1   T2<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**LSN**   **Record**   **prevLSN**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;T3   T4<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;160   CLR: T1 LSN 110 undoNextLSN: 70   140<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;170   CLR: T1 LSN 70 undoNextLSN: null   160<br>
&emsp;5\.   ◯ T          ◯  F<br>
&emsp;6\.   ◯ T          ◯  F<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;5\.   ◯ T          ◯  F<br>
III.  Multi granularity Locking<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;6\.   ◯ a       ◯ b       ◯ c<br>
&emsp;IS(Y)IX(Y)1. T1:\_\_\_\_\_\_ T2:\_\_\_\_\_\_<br>
&emsp;&emsp;T3:\_\_\_\_\_\_ T4:\_\_\_\_\_\_IS(Y)   IX(Y)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;V. Two Phase Commit<br>
&emsp;∅2. T1:\_\_\_\_\_\_ T3:\_\_\_\_\_\_<br>
&emsp;&emsp;&emsp;&emsp;IX(B)X(B\_3)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1\. ⃞ a     ⃞ b     ⃞ c<br>
&emsp;&emsp;T4:\_\_\_\_\_\_IX(B)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;⃞ d     ⃞ e     ⃞ f     ⃞ ∅<br>
&emsp;3\.   ◯ T          ◯  F<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2\. ⃞ a     ⃞ b    ⃞ ∅<br>
IV. ARIES Recovery<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3\. Circle all that apply<br>
&emsp;1\. ◯ a       ◯ b       ◯ c<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;a) PREPARE / COMMIT / ABORT<br>
&emsp;&emsp;◯ d       ◯ e       ◯ f<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;b) COMMIT / ABORT / END

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;21Page " of


---

<a id="page-2"></a>
**Page 2**

My Name: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_     My Class Login: cs186-\_\_ \_\_ \_\_<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4\. C1: ◯ A   ◯ B   ◯ C   ◯ D  ◯ DM<br>
&emsp;4\. Before it…<br>
&emsp;&emsp;◯  writes a \_\_\_\_\_\_\_\_\_ record<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;prepare        C2: ◯ A   ◯ B   ◯ C   ◯ D  ◯ DM<br>
&emsp;&emsp;◯  sends a \_\_\_\_\_\_\_\_\_ message<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;C3: ◯ A   ◯ B   ◯ C   ◯ D  ◯ DM<br>
&emsp;&emsp;◯  receives a \_\_\_\_\_\_\_ message<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;5\. ⃞ a     ⃞ b     ⃞ c<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;⃞ d     ⃞ e     ⃞ f     ⃞ ∅<br>
VI. SQL & LINEAR ALGEBRA<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;6\. a) ◯ A       ◯ B       ◯ C<br>
&emsp;◯ a       ◯ b       ◯ c       ◯ d<br>
1.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;b) ◯ A       ◯ B       ◯ C<br>
2\.  ⃞ a      ⃞ b      ⃞ c      ⃞ d      ⃞ ∅<br>
&emsp;◯ a       ◯ b       ◯ c       ◯ d<br>
3.


![Figure on page 2](figures/solutions-p02-fig01.png)

4\. (a) \_\_\_\_ (b) \_\_\_\_ (c) \_\_\_\_  8   3   2<br>
&emsp;(d) \_\_\_\_ (e) \_\_\_\_1   4

VII. Spark<br>
1\. ⃞ a     ⃞ b     ⃞ c<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;◯ a       ◯ b       ◯ c       ◯ d<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;c)<br>
&emsp;⃞ d     ⃞ e     ⃞ f     ⃞ ∅<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3\. ◯ a       ◯ b       ◯ c       ◯ d<br>
2\. (a) \_\_\_\_ (b) \_\_\_\_ (c) \_\_\_\_  6   2   4<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4\. Fill in the ER Diagram:<br>
&emsp;&emsp;&emsp;&emsp;6   2


![Figure on page 2](figures/solutions-p02-fig02.png)

&emsp;(d) \_\_\_\_ (e) \_\_\_\_<br>
3\. ◯ a       ◯ b       ◯ c       ◯ d

VIII. Analytics and ML<br>
1\. ⃞ a     ⃞ b     ⃞ c<br>
&emsp;**BUG**<br>
&emsp;⃞ d     ⃞ e     ⃞ f     ⃞ ∅<br>
2\. ⃞ a     ⃞ b     ⃞ c<br>
&emsp;⃞ d     ⃞ e     ⃞ f     ⃞ ∅<br>
3\. 1)    ◯ A       ◯ B       ◯ C<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;X. FDs & Normalization<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1\. ⃞ a      ⃞ b       ⃞ c       ⃞ d       ⃞ ∅<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**BUG**<br>
&emsp;2\)  ◯ A       ◯ B       ◯ C<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2\. ⃞ a      ⃞ b       ⃞ c       ⃞ d       ⃞ ∅<br>
&emsp;3\)  ◯ A       ◯ B       ◯ C<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3\. ⃞ a      ⃞ b       ⃞ c       ⃞ d       ⃞ ∅<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**BUG**<br>
&emsp;4\)  ◯ A       ◯ B       ◯ C<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4\. ⃞ a      ⃞ b       ⃞ c       ⃞ d       ⃞ ∅<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;22Page # of

