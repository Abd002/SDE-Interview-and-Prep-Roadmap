# Cambridge Computer Science Tripos 2026, Paper 5, Question 5: Questions

> Copied from the original: <https://www.cl.cam.ac.uk/teaching/exams/pastpapers/y2026p5q5.pdf>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

**COMPUTER SCIENCE TRIPOS Part IB – 2026 – Paper 5**

**5**   **Concurrent and Distributed Systems (mk428)**

&emsp;In a bank’s database, let a payment from one account (the source) to another (the<br>
&emsp;destination) be a transaction that first reads the balance of both accounts, aborting<br>
&emsp;if the payment amount is greater than the source account balance. If not aborted,<br>
&emsp;the transaction updates the source account balance to be the balance it previously<br>
&emsp;read minus the payment amount, updates the destination account balance to be the<br>
&emsp;previously read balance plus the payment amount, and then commits.

&emsp;(a) What is the purpose of strict two-phase locking (2PL) in a database, and how<br>
&emsp;&emsp;&emsp;does it work?   \[3 marks\]

&emsp;(b)   Assume the database uses strict 2PL with a multi-reader single-writer lock<br>
&emsp;&emsp;&emsp;for each account, which is acquired when the account is first accessed in a<br>
&emsp;&emsp;&emsp;transaction. Which problem could occur if there is a payment from account<br>
&emsp;&emsp;&emsp;A to account B, and concurrently another payment from account B to account<br>
&emsp;&emsp;&emsp;A? Draw a state machine diagram showing all the possible executions of these<br>
&emsp;&emsp;&emsp;two payments, assuming that each account balance read or update is an atomic<br>
&emsp;&emsp;&emsp;operation.   \[6 marks\]

&emsp;(c)   Your colleague suggests changing the payment transaction as follows. Instead<br>
&emsp;&emsp;&emsp;of accessing first the source and then the destination account, a payment<br>
&emsp;&emsp;&emsp;transaction should first read the balance of the account with the lower<br>
&emsp;&emsp;&emsp;account number, then read the balance of the account with the higher account<br>
&emsp;&emsp;&emsp;number, then update the lower-numbered account, and finally update the<br>
&emsp;&emsp;&emsp;higher-numbered account. Does this prevent the problem from Part (b)? Justify<br>
&emsp;&emsp;&emsp;your answer.   \[4 marks\]

&emsp;(d) As a consistency check, the bank wants to periodically read the balance of all<br>
&emsp;&emsp;&emsp;accounts and confirm that their sum equals the bank’s total holdings. Explain<br>
&emsp;&emsp;&emsp;what problems might occur in a database that uses strict 2PL.   \[2 marks\]

&emsp;(e) The bank is considering moving to a database that uses optimistic concurrency<br>
&emsp;&emsp;&emsp;control instead of 2PL. Explain what impact this is likely to have on the scenarios<br>
&emsp;&emsp;&emsp;from Parts (b), (c), and (d). What new problems might this introduce that do<br>
&emsp;&emsp;&emsp;not occur with 2PL?   \[5 marks\]

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1

