# Cambridge Computer Science Tripos 2022, Paper 5, Question 5: Questions

> Copied from the original: <https://www.cl.cam.ac.uk/teaching/exams/pastpapers/y2022p5q5.pdf>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

**COMPUTER SCIENCE TRIPOS Part IB – 2022 – Paper 5**

**5**   **Concurrent and Distributed Systems (mk428)**

&emsp;You are designing Warbler, a social networking service in which users can post public<br>
&emsp;messages called chirps. A chirp may or may not be a reply to another chirp. Moreover,<br>
&emsp;one user can follow another user, which means subscribing to the messages they post.

&emsp;(a) Write pseudocode for three operations: (1) user u1 following user u2; (2) u1<br>
&emsp;&emsp;&emsp;unfollowing (ceasing to follow) u2; and (3) obtaining the current set of followers<br>
&emsp;&emsp;&emsp;of some user u. These operations must be fault-tolerant: you should store the<br>
&emsp;&emsp;&emsp;data on five servers, and the operations must be able to complete successfully as<br>
&emsp;&emsp;&emsp;long as any three or more servers are available. Your algorithm should ensure<br>
&emsp;&emsp;&emsp;read-after-write consistency.

&emsp;&emsp;&emsp;Assume an asynchronous system model with fair-loss network links and crash-<br>
&emsp;&emsp;&emsp;recovery faults. Write your algorithm in terms of messages sent over point-to-<br>
&emsp;&emsp;&emsp;point (unicast) links. You may assume that the user is already authenticated<br>
&emsp;&emsp;&emsp;(e.g. their password has been checked), and you may assume that users’ client<br>
&emsp;&emsp;&emsp;software can generate Lamport timestamps.

&emsp;&emsp;&emsp;Start by describing the nodes in the system, the structure of the data stored at<br>
&emsp;&emsp;&emsp;each node, and the form and purpose of messages exchanged by nodes. Then<br>
&emsp;&emsp;&emsp;give the pseudocode for the operations listed above.   \[12 marks\]

&emsp;(b)   When a user posts a chirp, it needs to be sent to all of that user’s followers.<br>
&emsp;&emsp;&emsp;Write pseudocode to do this, using the operation for getting a user’s followers<br>
&emsp;&emsp;&emsp;from part (a). Chirps must be delivered to a given recipient in the following<br>
&emsp;&emsp;&emsp;order: chirps posted by the same user should be delivered in the order they were<br>
&emsp;&emsp;&emsp;posted; and when one chirp is a reply to another, the reply should be delivered<br>
&emsp;&emsp;&emsp;after the chirp it is replying to.   Apart from these rules, the chirps may be<br>
&emsp;&emsp;&emsp;delivered in any order.   \[8 marks\]

&emsp;In both parts, in addition to the pseudocode, please also briefly explain and justify<br>
&emsp;the design of your algorithm, and specify any assumptions you are making.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1

