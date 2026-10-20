# Cambridge Computer Science Tripos 2017, Paper 5, Question 9: Questions

> Copied from the original: <https://www.cl.cam.ac.uk/teaching/exams/pastpapers/y2017p5q9.pdf>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

**COMPUTER SCIENCE TRIPOS Part IB – 2017 – Paper 5**

**9**   **Concurrent and Distributed Systems (RNW)**<br>
&emsp;This pseudocode, executing in process Pj, employs buffering to impose ordering:<br>
&emsp;`receive(M` `from` `Pi)` `{`   `//` `Message` `M` `received` `from` `process` `Pi`<br>
&emsp;&emsp;`S` `=` `getSeq(M);`   `//` `Extract` `sequence` `number` `S`<br>
&emsp;&emsp;`if` `(S` `==` `nextSeq(Sji))` `{`   `//` `If` `S` `is` `the` `next` `sequence` `number:`<br>
&emsp;&emsp;&emsp;`deliver(M);`   `//`   `Deliver` `M` `to` `current` `process` `(Pj)`<br>
&emsp;&emsp;&emsp;`Sji` `=` `flush(HBQ,` `Sji);`   `//`   `Deliver` `backlog` `from` `HBQ;` `update` `Sji`<br>
&emsp;&emsp;`}` `else` `holdback(HBQ,` `M);`   `//` `Else:` `Hold` `back` `M` `for` `future` `delivery`<br>
&emsp;`}`<br>
&emsp;(a) Explain what ordering model(s) this pseudocode implements.   \[2 marks\]<br>
&emsp;(b)   Write pseudocode (with comments) for the following functions, to be used on<br>
&emsp;&emsp;&emsp;the sender (Pi) or receiver (Pj), which accept M (a message), and S (a sequence<br>
&emsp;&emsp;&emsp;number):   \[8 marks\]<br>
&emsp;&emsp;&emsp;Receiver   `receive` `reliably(M)`   Reliably receive M from Pi.<br>
&emsp;&emsp;&emsp;`send` `reliably(M)`Sender   Reliably send M to Pj.<br>
&emsp;&emsp;&emsp;`process` `ack(S)`Sender   Handle a received ACK for S from Pj.<br>
&emsp;&emsp;&emsp;Sender   `timeout(S,` `M)`   Process a timeout for S and M.<br>
&emsp;&emsp;&emsp;As needed, employ the following additional utility functions:<br>
&emsp;&emsp;&emsp;`drop(M)`Drop received M without delivering.<br>
&emsp;&emsp;&emsp;`setSeq(M,` `S)`   Set sequence number S on message M.<br>
&emsp;&emsp;&emsp;`transmit` `msg(M)`Transmit message M to Pj.<br>
&emsp;&emsp;&emsp;`transmit` `ack(S)`   Transmit an ACK with sequence number S to Pi.<br>
&emsp;&emsp;&emsp;`sched` `timeout(S,` `M)`Schedule `timeout(S,` `M)` to run in 5 ms.<br>
&emsp;&emsp;&emsp;`cancel` `timeout(S)`   If scheduled, cancel timeout for S.<br>
&emsp;(c)   Define the happens-before relationship.   \[2 marks\]<br>
&emsp;(d) The pseudocode above imposes ordering on pair-wise communications. Assum-<br>
&emsp;&emsp;&emsp;ing reordering but no message loss, write pseudocode (with comments) for the<br>
&emsp;&emsp;&emsp;following functions supporting causal ordering for group communications:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\[8 marks\]<br>
&emsp;&emsp;&emsp;`receive` `causally(M)`Receiver   Causally receive from the group.<br>
&emsp;&emsp;&emsp;`send` `causally(M)`Sender   Causally send to the group.<br>
&emsp;&emsp;&emsp;As needed, employ the following additional utility functions:<br>
&emsp;&emsp;&emsp;`getVec(M)`Retrieves the version vector from a message.<br>
&emsp;&emsp;&emsp;`setVec(M,` `V)`   Set vector V on message M.<br>
&emsp;&emsp;&emsp;`testVec(LV,` `RV)`Returns whether vector RV only differs from LV in<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;that it has exactly one entry one greater than the<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;corresponding entry in `LV`.<br>
&emsp;&emsp;&emsp;`updateVec(V)`   Returns V with the local vector entry incremented.<br>
&emsp;&emsp;&emsp;`transmit` `group(M)`Transmits message M to the entire group.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1

