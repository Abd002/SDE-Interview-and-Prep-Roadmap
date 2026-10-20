# Berkeley CS168 Spring 2025: Discussion 12: Questions

> Copied from the original: <https://sp25.cs168.io/>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;CS 168   Multicast and Collectives<br>
&emsp;Spring 2025<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Discussion 12

&emsp;1   True or False<br>
1.1   IP multicast is widely deployed across different domains for global Internet communication.

1.2   In the DVMRP protocol, the multicast forwarding table requires one entry per source, per multicast<br>
&emsp;group.

1.3   Core-Based Trees (CBT) guarantee that packets are forwarded along the least-cost paths to all group<br>
&emsp;members.

1.4   Overlay multicast requires routers to implement specialized multicast protocols, unlike IP multicast.

1.5   The AllReduce collective operation can be implemented efficiently using a ring topology, where each<br>
&emsp;node sends and receives data to/from its neighbors.

1.6   The stretch factor in overlay multicast measures the ratio of the overlay path cost to the underlay path<br>
&emsp;cost, with lower stretch indicating better performance.

1.7   Collective operations in AI training, such as Broadcast and Reduce, are unrelated and cannot be combined<br>
&emsp;to form other operations like AllReduce.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1


---

<a id="page-2"></a>
**Page 2**

&emsp;2    Multicast and Collectives<br>
&emsp;2   Multicast


![Figure on page 2](figures/questions-p02-fig01.png)

&emsp;Consider the network topology above for both parts of this question. Hosts are squares with capital letters,<br>
&emsp;routers are circles with lower case letters. Link cost is latency in seconds.<br>
&emsp;DVMRP<br>
&emsp;All parts of this section are cumulative. At the start, A and E are members of group 1.<br>
2.1   (a) A sends a multicast packet to Group 1. After all Non-Membership Reports (NMRs) have propagated,<br>
&emsp;&emsp;which links remain active (i.e., used for forwarding packets) in the source-specific multicast tree for<br>
&emsp;&emsp;(Source A, Group 1)?

&emsp;(b) Suppose C adds itself to group 1. Immediately after this, who knows C joined group 1?

&emsp;(c) E sends a message to group 1. Which links remain active for (Source E, Group 1)?

&emsp;(d) B sends a message to group 1, is this possible?

&emsp;(e) What is the route that the packet takes from B to E?

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2


---

<a id="page-3"></a>
**Page 3**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Multicast and Collectives    3

&emsp;(f) How long does it take for B’s message to reach all members of group 1?

&emsp;(g) Suppose that the pruning information expires. A, B, and D form a new group 2. A then sends messages<br>
&emsp;&emsp;to groups 1 and 2, B sends a message to group 2, and D sends a message to group 1. What state does<br>
&emsp;&emsp;router f have? (Give a list of (Source x, Group y)).

&emsp;(h) What message(s) took the longest to send?

&emsp;(i) What message(s) took the least time to send?

&emsp;CBT<br>
&emsp;All parts of this section are cumulative, but independent from the previous section. a is the core<br>
&emsp;for group 1.<br>
2.2   (a) C decides to join group 1. What routers does its request go through?

&emsp;(b) D decides to join group 1. What routers does its request go through?

&emsp;(c) B sends a message to group 1. How long does it take to reach all members?

&emsp;(d) C sends a message to group 1. How long does it take to reach all members?

&emsp;(e) The link between A and a goes down, but no other changes in control plane state occur. Who can<br>
&emsp;&emsp;still send/receive messages to/from group 1, if any?

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3


---

<a id="page-4"></a>
**Page 4**

&emsp;4    Multicast and Collectives<br>
&emsp;3   Collective<br>
&emsp;You are designing a distributed AI training system in a datacenter with 4 GPUs (nodes 1, 2, 3, 4) performing<br>
&emsp;collective operations. Each node holds a 4-element vector of data (total size 𝐷 bytes). The datacenter uses<br>
&emsp;a Clos topology, with nodes 1 and 2 in Rack A, and nodes 3 and 4 in Rack B, connected via a core switch.<br>
&emsp;Intra-rack links (e.g., 1↔2) have 1 hop (stretch = 1); inter-rack links (e.g., 1↔3) have 3 hops (stretch =<br>
&emsp;3). Assume intra-rack links have unlimited bandwidth, inter-rack links have a bandwidth capacity of 𝐵<br>
&emsp;bytes per time step, and nodes can send/receive on all links simultaneously unless otherwise specified.


![Figure on page 4](figures/questions-p04-fig02.png)

&emsp;The Clos topology has nodes 1 and 2 in Rack A, nodes 3 and 4 in Rack B, connected via a core switch.<br>
&emsp;Intra-rack links have 1 hop (stretch = 1); inter-rack links have 3 hops (stretch = 3).<br>
&emsp;Part A: Full-Mesh AllReduce Analysis<br>
&emsp;Consider an AllReduce operation where each node computes the element-wise sum of all vectors and<br>
&emsp;receives the sum vector.<br>
3.1   (a) Explain why a full-mesh topology is suitable for AllReduce in AI training, and discuss its scalability<br>
&emsp;&emsp;limitations for large 𝑝.

&emsp;(b) Calculate the total bandwidth and number of steps for a full-mesh AllReduce with 𝑝= 4. If inter-<br>
&emsp;&emsp;rack link bandwidth is limited to 𝐵= 𝐷 bytes per time step and intra-rack links have unlimited<br>
&emsp;&emsp;bandwidth, how many time steps are required?

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4


---

<a id="page-5"></a>
**Page 5**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Multicast and Collectives    5

&emsp;Part B: Naive Ring AllReduce<br>
&emsp;Assume a naive ring-based AllReduce (e.g., Node 1 → Node 2 → Node 3 → Node 4 → Node 1).


![Figure on page 5](figures/questions-p05-fig03.png)

&emsp;The ring topology connects nodes 1→2→3→4→1 in a closed loop.<br>
3.2   (a) How many steps are required for a naive ring AllReduce with 𝑝= 4? Describe the data exchange<br>
&emsp;&emsp;process.

&emsp;(b) Calculate the total bandwidth and bandwidth per node per step. If inter-rack links are limited to 𝐵=<br>
&emsp;&emsp;2 bytes per step, how does this affect the number of steps?𝐷

&emsp;Part C: Optimized Ring vs. Tree-Based AllReduce<br>
&emsp;Compare naive ring, optimized ring, and tree-based AllReduce implementations for 𝑝= 16.<br>
3.3   (a) For an optimized ring AllReduce, describe how it differs from the naive ring and calculate its total<br>
&emsp;&emsp;bandwidth and steps for 𝑝= 16.

&emsp;(b) For a tree-based AllReduce, calculate the total bandwidth and steps for 𝑝= 16, assuming a balanced<br>
&emsp;&emsp;binary tree.

&emsp;(c) Compare the three implementations (naive ring, optimized ring, tree-based) for 𝑝= 16, discussing<br>
&emsp;&emsp;trade-offs for AI training.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;5


---

<a id="page-6"></a>
**Page 6**

&emsp;6    Multicast and Collectives

&emsp;Part D: Overlay Topology Optimization<br>
&emsp;Optimize an overlay ring for AllReduce over the Clos network, with nodes A, B in Rack A, and C, D in<br>
&emsp;Rack B.


![Figure on page 6](figures/questions-p06-fig04.png)

&emsp;Nodes A and B are in Rack A, nodes C and D are in Rack B, with intra-rack links (stretch = 1) and inter-<br>
&emsp;rack links (stretch = 3).<br>
3.4   (a) Propose an overlay ring topology by numbering nodes (A, B, C, D) as Nodes 1, 2, 3, 4 to minimize<br>
&emsp;&emsp;the average stretch factor. Calculate the stretch for each link and the average.

&emsp;(b) Consider two alternative topologies: (i) A→C→D→B→A, and (ii) A→C→B→D→A. Calculate<br>
&emsp;&emsp;their average stretches and compare to your proposed topology. If inter-rack links have bandwidth<br>
&emsp;&emsp;4 bytes per step, which topology minimizes total latency for an optimized ring AllReduce,𝐵= 𝐷<br>
&emsp;&emsp;assuming each hop adds 1 time unit of latency?

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;6


---

<a id="page-7"></a>
**Page 7**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Multicast and Collectives    7

&emsp;Part E: ReduceScatter Implementation<br>
&emsp;Consider a ReduceScatter operation, where each node receives one summed element of the AllReduce<br>
&emsp;output.<br>
3.5   (a) Explain how ReduceScatter differs from AllReduce and how it can be implemented using a naive ring<br>
&emsp;&emsp;for 𝑝= 4. Calculate the total bandwidth and steps.

&emsp;(b) If you implement ReduceScatter using the optimized ring topology from Part D.1<br>
&emsp;&emsp;4 , calculate the total latency (in steps) and(A→B→C→D→A) with inter-rack bandwidth 𝐵= 𝐷<br>
&emsp;&emsp;compare to the naive ring.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;7

