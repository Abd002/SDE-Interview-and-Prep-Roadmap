# Berkeley CS168 Spring 2025: Discussion 10: Questions

> Copied from the original: <https://sp25.cs168.io/>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;CS 168   Datacenters & SDN<br>
&emsp;Spring 2025<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Discussion 10

&emsp;1   True/False<br>
1.1   Achieving low latency for small jobs (mice) is critical for datacenter networks.

1.2   Clos topology enables the use of commodity hardware in datacenter networks.

1.3   ECMP leads to reordering of packets in the same flow.

1.4   Over-subscription is the ratio of worst-case achievable aggregate bandwidth between end-hosts to total<br>
&emsp;bisection bandwidth.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1


---

<a id="page-2"></a>
**Page 2**

&emsp;2    Datacenters & SDN<br>
&emsp;2   STP


![Figure on page 2](figures/questions-p02-fig01.png)

&emsp;The diagram above shows a L2 network where all links have equal cost. We want to apply the Spanning<br>
&emsp;Tree Protocol. Choose the switch with the lowest alphabetical ID as the root, and when there are multiple<br>
&emsp;shortest paths to the root, choose the path that uses the neighbor switch with the lowest alphabetical ID.<br>
2.1   Let XY denote the link that connects switch(“X”) and switch(“Y”). List all links that are a part of the<br>
&emsp;spanning tree after the STP protocol converges.

2.2   Assume that at some point during STP, switch(“F”) believes that switch(“A”) is the root and switch(“D”)<br>
&emsp;believes that switch(“B”) is the root. Is it possible that switch(“C”) also believes that switch(“B”) is the<br>
&emsp;root?

2.3   After the STP protocol has converged, switch(“A”) and all links directly connected to switch(“A”) go<br>
&emsp;down. List all links that are a part of the new spanning tree after the STP protocol converges again.

2.4   switch(“A”) and all links connected to switch(“A”) finally come back up, and the STP protocol begins to<br>
&emsp;run again. However, switch(“F”) forgets to send any update messages to its neighbors. After the protocol<br>
&emsp;converges, does the resulting set of links form a valid spanning tree?

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2


---

<a id="page-3"></a>
**Page 3**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Datacenters & SDN    3<br>
&emsp;3   Clos-based Topology & ECMP


![Figure on page 3](figures/questions-p03-fig02.png)

&emsp;Given the datacenter network above:<br>
3.1   How many paths from an arbitrary server upward to an arbitrary root switch? Consider only minimal-<br>
&emsp;length paths.

3.2   How many paths can be set up between M1 to M3 in this topology? M1 to M5? Consider only minimal-<br>
&emsp;length paths.

3.3   How many of the M1 to M5 paths go through switch S2?

&emsp;Consider the same network topology in Q3. Assume all links have capacity 10 Gbps and ECMP<br>
&emsp;is used for multipath routing.<br>
3.4   What is the bisection bandwidth of this topology?

3.5   Assume ECMP makes the best possible hashing/load balancing. If switch S1 and S3 fail, what is the<br>
&emsp;available aggregate bandwidth from each four-server Pod to any other such Pod (a Pod contains four<br>
&emsp;servers closest to each other)?

3.6   Assume M1, M2 are sending flows to M5; and M3, M4 are sending flows to M6. TCP makes optimal use of<br>
&emsp;the available bandwidth and ECMP makes the worst possible hashing. What is the approximate average<br>
&emsp;data rate server M1 can send to server M5?

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3


---

<a id="page-4"></a>
**Page 4**

&emsp;4    Datacenters & SDN<br>
&emsp;4   Encapsulation


![Figure on page 4](figures/questions-p04-fig03.png)

4.1   If routing a packet from VM 1 to VM 6, what is the expected path?

4.2   What encapsulation and decapsulation should the servers/router on the path from VM 1 to VM 6 perform<br>
&emsp;(if any)? Fill in the following table with the destination address (both overlay and underlay) of the packets<br>
&emsp;at each step.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Server/Router   Adds/Deletes Header   Overlay Address   Underlay Address<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Server 1

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Router 1

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Server 4

4.3   How many destinations does Router 1 have to keep track of without encapsulation? How about with<br>
&emsp;encapsulation? Consider how this isolation impacts VM scalability in a data center!

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4

