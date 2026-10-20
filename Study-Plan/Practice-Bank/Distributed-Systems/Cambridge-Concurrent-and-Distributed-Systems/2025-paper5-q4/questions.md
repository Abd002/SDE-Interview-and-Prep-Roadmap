# Cambridge Computer Science Tripos 2025, Paper 5, Question 4: Questions

> Copied from the original: <https://www.cl.cam.ac.uk/teaching/exams/pastpapers/y2025p5q4.pdf>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

**COMPUTER SCIENCE TRIPOS Part IB – 2025 – Paper 5**

**4**   **Concurrent and Distributed Systems (mk428)**

&emsp;You have been hired to create a supervision room booking system for Old Hall College,<br>
&emsp;Cambridge.   The system should allow supervisors to reserve rooms for particular<br>
&emsp;time slots, and it needs to ensure that there are no two bookings for overlapping<br>
&emsp;time periods for the same room, even when desperate supervisors are frantically and<br>
&emsp;concurrently trying to book the last available room.

&emsp;To ensure fault tolerance the system is required to have multiple replicas. It must<br>
&emsp;work in a partially synchronous system model with crash-recovery faults.

&emsp;(a) Your first thought is to represent each hourly time slot for each supervision room<br>
&emsp;&emsp;&emsp;as a separate register, with the value of the register indicating the supervisor<br>
&emsp;&emsp;&emsp;who has booked it (if any), and to use the algorithm by Attiya, Bar-Noy, and<br>
&emsp;&emsp;&emsp;Dolev (ABD algorithm) to replicate those registers. Assume that every time<br>
&emsp;&emsp;&emsp;slot begins on the hour and lasts for an hour, so there are no overlapping slots.<br>
&emsp;&emsp;&emsp;Explain briefly how the ABD algorithm works, and which consistency properties<br>
&emsp;&emsp;&emsp;such a room booking system would have. Pseudocode is not needed.   \[6 marks\]

&emsp;(b)   Your second idea is to instead use state machine replication (SMR). Give<br>
&emsp;&emsp;&emsp;pseudocode for a SMR-based supervision room database, and explain the pros<br>
&emsp;&emsp;&emsp;and cons of this approach compared to using ABD. You may assume that you<br>
&emsp;&emsp;&emsp;already have an implementation of total order broadcast.   \[6 marks\]

&emsp;(c)   Your third idea is to use two-phase commit (2PC) to coordinate writes to the<br>
&emsp;&emsp;&emsp;replicas. Explain how 2PC works, and how it compares to the previous two<br>
&emsp;&emsp;&emsp;approaches in the context of the room booking system.   \[6 marks\]

&emsp;(d) Which of the three approaches (ABD, SMR, 2PC) is best for this system? Briefly<br>
&emsp;&emsp;&emsp;explain why.   \[2 marks\]

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1

