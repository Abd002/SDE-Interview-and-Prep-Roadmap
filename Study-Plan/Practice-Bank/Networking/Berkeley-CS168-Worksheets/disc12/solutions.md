# Berkeley CS168 Spring 2025: Discussion 12: Official solutions

> Copied from the original: <https://sp25.cs168.io/>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;CS 168   Multicast and Collectives<br>
&emsp;Spring 2025<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Discussion 12

&emsp;1   True or False<br>
1.1   IP multicast is widely deployed across different domains for global Internet communication.<br>
&emsp;False: IP multicast is primarily used within a single domain, such as enterprise networks or ISPs, and is<br>
&emsp;rarely deployed across multiple autonomous systems due to challenges like scalability, billing disputes,<br>
&emsp;and inter-domain coordination required for protocols like PIM and MSDP.<br>
1.2   In the DVMRP protocol, the multicast forwarding table requires one entry per source, per multicast<br>
&emsp;group.<br>
&emsp;True: DVMRP builds a source-specific shortest-path tree for each (source, multicast group) pair, requir-<br>
&emsp;ing multicast forwarding table entries that specify the Reverse Path Forwarding (RPF) interface and<br>
&emsp;outgoing interfaces (children) for each pair, updated via flood-and-prune mechanisms.<br>
1.3   Core-Based Trees (CBT) guarantee that packets are forwarded along the least-cost paths to all group<br>
&emsp;members.<br>
&emsp;False: CBT uses a single shared tree per multicast group rooted at a core router, prioritizing scalability<br>
&emsp;over optimality. Paths depend on the core’s location and may be suboptimal compared to shortest unicast<br>
&emsp;paths, unlike source-specific trees in protocols like DVMRP.<br>
1.4   Overlay multicast requires routers to implement specialized multicast protocols, unlike IP multicast.<br>
&emsp;False: Overlay multicast operates at the application layer, with end hosts or proxy servers managing<br>
&emsp;multicast routing using unicast packets. Routers only need standard unicast protocols, unlike IP multi-<br>
&emsp;cast, which requires specialized protocols like PIM or DVMRP. Examples include P2P streaming or ALM<br>
&emsp;protocols like Narada.<br>
1.5   The AllReduce collective operation can be implemented efficiently using a ring topology, where each<br>
&emsp;node sends and receives data to/from its neighbors.<br>
&emsp;True: Ring-based AllReduce involves nodes exchanging partial sums in a logical ring, completing in<br>
&emsp;2(n-1) steps (reduce and broadcast phases) for n nodes. This reduces bandwidth compared to full-mesh<br>
&emsp;approaches, though performance depends on the logical ring’s mapping to the physical network. It is<br>
&emsp;widely used in MPI and AI training frameworks like Horovod.<br>
1.6   The stretch factor in overlay multicast measures the ratio of the overlay path cost to the underlay path<br>
&emsp;cost, with lower stretch indicating better performance.<br>
&emsp;True: The stretch factor is the ratio of the overlay path cost (latency or hops in the overlay tree) to the<br>
&emsp;underlay path cost (optimal unicast path). A lower stretch, closer to 1, indicates that the overlay topology<br>
&emsp;closely matches the underlay, reducing latency and improving packet forwarding performance.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1


---

<a id="page-2"></a>
**Page 2**

&emsp;2    Multicast and Collectives

1.7   Collective operations in AI training, such as Broadcast and Reduce, are unrelated and cannot be combined<br>
&emsp;to form other operations like AllReduce.<br>
&emsp;False: Broadcast and Reduce are complementary operations in collective communication. AllReduce<br>
&emsp;can be implemented as a Reduce phase (aggregating data, e.g., summing gradients) followed by a<br>
&emsp;Broadcast phase (distributing the result), commonly using tree-based algorithms in frameworks like MPI<br>
&emsp;or Horovod.<br>
&emsp;2   Multicast


![Figure on page 2](figures/solutions-p02-fig01.png)

&emsp;Consider the network topology above for both parts of this question. Hosts are squares with capital letters,<br>
&emsp;routers are circles with lower case letters. Link cost is latency in seconds.<br>
&emsp;DVMRP<br>
&emsp;All parts of this section are cumulative. At the start, A and E are members of group 1.<br>
2.1   (a) A sends a multicast packet to Group 1. After all Non-Membership Reports (NMRs) have propagated,<br>
&emsp;&emsp;which links remain active (i.e., used for forwarding packets) in the source-specific multicast tree for<br>
&emsp;&emsp;(Source A, Group 1)?<br>
&emsp;&emsp;&emsp;A-a, a-e, e-E<br>
&emsp;(b) Suppose C adds itself to group 1. Immediately after this, who knows C joined group 1?<br>
&emsp;&emsp;&emsp;c. Only the first hop router is notified at first.<br>
&emsp;(c) E sends a message to group 1. Which links remain active for (Source E, Group 1)?<br>
&emsp;&emsp;&emsp;A-a, a-e, e-E, d-e, d-f, c-f, c-C<br>
&emsp;(d) B sends a message to group 1, is this possible?<br>
&emsp;&emsp;&emsp;Yes, non-members can send messages to a group.<br>
&emsp;(e) What is the route that the packet takes from B to E?<br>
&emsp;&emsp;&emsp;B-b-a-e-E

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2


---

<a id="page-3"></a>
**Page 3**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Multicast and Collectives    3

&emsp;(f) How long does it take for B’s message to reach all members of group 1?<br>
&emsp;&emsp;&emsp;7 seconds, the path to C (B-b-f-c-C) is the longest.<br>
&emsp;(g) Suppose that the pruning information expires. A, B, and D form a new group 2. A then sends messages<br>
&emsp;&emsp;to groups 1 and 2, B sends a message to group 2, and D sends a message to group 1. What state does<br>
&emsp;&emsp;router f have? (Give a list of (Source x, Group y)).<br>
&emsp;&emsp;&emsp;(A, 1), (D, 1)<br>
&emsp;(h) What message(s) took the longest to send?<br>
&emsp;&emsp;&emsp;𝐵→𝐷 took 7 seconds.<br>
&emsp;(i) What message(s) took the least time to send?<br>
&emsp;&emsp;&emsp;𝐴→𝐸 took only 3 seconds.<br>
&emsp;CBT<br>
&emsp;All parts of this section are cumulative, but independent from the previous section. a is the core<br>
&emsp;for group 1.<br>
2.2   (a) C decides to join group 1. What routers does its request go through?<br>
&emsp;&emsp;c, f, d, e, a<br>
&emsp;(b) D decides to join group 1. What routers does its request go through?<br>
&emsp;&emsp;None<br>
&emsp;(c) B sends a message to group 1. How long does it take to reach all members?<br>
&emsp;&emsp;8 seconds. 3 seconds to reach a from B, and then another 5 to reach C from a (reaching D only took<br>
&emsp;&emsp;4 seconds).<br>
&emsp;(d) C sends a message to group 1. How long does it take to reach all members?<br>
&emsp;&emsp;5 seconds. C → c → f → d → D.<br>
&emsp;(e) The link between A and a goes down, but no other changes in control plane state occur. Who can<br>
&emsp;&emsp;still send/receive messages to/from group 1, if any?<br>
&emsp;&emsp;B, C, D, E can send messages to Group 1. C, D can receive messages from Group 1. A Cannot send<br>
&emsp;&emsp;or receive.

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


![Figure on page 4](figures/solutions-p04-fig02.png)

&emsp;The Clos topology has nodes 1 and 2 in Rack A, nodes 3 and 4 in Rack B, connected via a core switch.<br>
&emsp;Intra-rack links have 1 hop (stretch = 1); inter-rack links have 3 hops (stretch = 3).<br>
&emsp;Part A: Full-Mesh AllReduce Analysis<br>
&emsp;Consider an AllReduce operation where each node computes the element-wise sum of all vectors and<br>
&emsp;receives the sum vector.<br>
3.1   (a) Explain why a full-mesh topology is suitable for AllReduce in AI training, and discuss its scalability<br>
&emsp;&emsp;limitations for large 𝑝.<br>
&emsp;&emsp;A full-mesh topology enables each node to send its vector directly to all other nodes simultaneously,<br>
&emsp;&emsp;minimizing latency to one time step, which is ideal for AI training’s predictable, high-bandwidth<br>
&emsp;&emsp;needs. However, it requires 𝑂(𝑝2) links, making it impractical for large 𝑝 due to high wiring<br>
&emsp;&emsp;complexity and resource demands.<br>
&emsp;(b) Calculate the total bandwidth and number of steps for a full-mesh AllReduce with 𝑝= 4. If inter-<br>
&emsp;&emsp;rack link bandwidth is limited to 𝐵= 𝐷 bytes per time step and intra-rack links have unlimited<br>
&emsp;&emsp;bandwidth, how many time steps are required?<br>
&emsp;&emsp;Each node sends its vector (𝐷 bytes) to 𝑝−1 = 3 other nodes, so each node sends 𝐷⋅3 bytes. With<br>
&emsp;&emsp;𝑝= 4, total bandwidth is 4 ⋅𝐷⋅3 = 12𝐷 bytes, completed in 1 step without bandwidth limits. With<br>
&emsp;&emsp;inter-rack link bandwidth limited to 𝐵= 𝐷 bytes per step and intra-rack links unlimited, each node<br>
&emsp;&emsp;sends to 1 intra-rack node (𝐷 bytes, 1 step) and 2 inter-rack nodes (𝐷 bytes each, 1 step each). Since<br>
&emsp;&emsp;nodes can send on all links simultaneously, the operation completes in 1 step.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4


---

<a id="page-5"></a>
**Page 5**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Multicast and Collectives    5

&emsp;Part B: Naive Ring AllReduce<br>
&emsp;Assume a naive ring-based AllReduce (e.g., Node 1 → Node 2 → Node 3 → Node 4 → Node 1).


![Figure on page 5](figures/solutions-p05-fig03.png)

&emsp;The ring topology connects nodes 1→2→3→4→1 in a closed loop.<br>
3.2   (a) How many steps are required for a naive ring AllReduce with 𝑝= 4? Describe the data exchange<br>
&emsp;&emsp;process.<br>
&emsp;&emsp;The naive ring AllReduce requires 2(𝑝−1) = 2(4 −1) = 6 steps. The process consists of two<br>
&emsp;&emsp;phases, each taking 𝑝−1 = 3 steps:<br>
&emsp;&emsp;• Reduction Phase (Steps 1–3): In each step, each node sends its current vector (𝐷 bytes) to its<br>
&emsp;&emsp;&emsp;neighbor (e.g., Node 1 sends to Node 2, Node 2 to Node 3, etc.) and receives a vector from its other<br>
&emsp;&emsp;&emsp;neighbor (e.g., Node 1 receives from Node 4). The received vector is added element-wise to the<br>
&emsp;&emsp;&emsp;node’s current vector. After 𝑝−1 = 3 steps, each node has computed the sum of all vectors (e.g.,<br>
&emsp;&emsp;&emsp;Node 1 has 𝑣1 + 𝑤1 + 𝑥1 + 𝑦1).<br>
&emsp;&emsp;• Distribution Phase (Steps 4–6): Each node now sends the computed sum to its neighbor in<br>
&emsp;&emsp;&emsp;the same manner. After another 𝑝−1 = 3 steps, all nodes have received the same final sum,<br>
&emsp;&emsp;&emsp;completing the AllReduce operation.<br>
&emsp;(b) Calculate the total bandwidth and bandwidth per node per step. If inter-rack links are limited to 𝐵=<br>
&emsp;&emsp;2 bytes per step, how does this affect the number of steps?𝐷<br>
&emsp;&emsp;Each node sends one vector (𝐷 bytes) per step. The full AllReduce takes 2(𝑝−1) = 6 steps with<br>
&emsp;&emsp;𝑝= 4 nodes, so the total bandwidth (bytes sent) is 4 ⋅𝐷⋅6 = 24𝐷 bytes (4 nodes send 𝐷 bytes each<br>
&emsp;&emsp;step for 6 steps). The bandwidth per node per step is 𝐷 bytes (sent only).<br>
&emsp;&emsp;2 bytes per step, sending 𝐷 bytes over an inter-rack link (e.g.,With inter-rack links limited to 𝐵= 𝐷<br>
&emsp;&emsp;2 = 2 steps. The ring has 2 intra-rack links (1→2, 3→4, 1 step each) and 2 inter-rack2→3) takes 𝐷<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;𝐷<br>
&emsp;&emsp;links (2→3, 4→1, 2 steps each). For one vector to traverse the ring once (one phase), the steps are:<br>
&emsp;&emsp;1 (1→2) + 2 (2→3) + 1 (3→4) + 2 (4→1) = 6 steps. Since the AllReduce has two phases (reduction<br>
&emsp;&emsp;and distribution), the total steps increase to 6 × 2 = 12 steps.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;5


---

<a id="page-6"></a>
**Page 6**

&emsp;6    Multicast and Collectives

&emsp;Part C: Optimized Ring vs. Tree-Based AllReduce<br>
&emsp;Compare naive ring, optimized ring, and tree-based AllReduce implementations for 𝑝= 16.<br>
3.3   (a) For an optimized ring AllReduce, describe how it differs from the naive ring and calculate its total<br>
&emsp;&emsp;bandwidth and steps for 𝑝= 16.<br>
&emsp;&emsp;The optimized ring performs Reduce-Scatter (each node gets one summed element) followed by<br>
&emsp;&emsp;AllGather (each node gets all summed elements), using 𝑝−1 = 15 steps per phase, totaling 2(𝑝−<br>
&emsp;&emsp;16 bytes per step, unlike the naive ring, which sends𝑝= 𝐷1) = 30 steps. Each node sends/receives 𝐷<br>
&emsp;&emsp;the entire vector (𝐷 bytes) per step over two phases (reduction and distribution, 2(𝑝−1) = 30<br>
&emsp;&emsp;8 bytes over both phases.16 ⋅2 = 15𝐷𝑝⋅2 = 15 ⋅𝐷steps). For 𝑝= 16, each node sends (𝑝−1) ⋅𝐷<br>
&emsp;&emsp;8 = 30𝐷 bytes, and steps are 2(𝑝−1) = 30 (15 for Reduce-8 ) = 16 ⋅15𝐷Total bandwidth is 𝑝⋅(15𝐷<br>
&emsp;&emsp;Scatter, 15 for AllGather).<br>
&emsp;(b) For a tree-based AllReduce, calculate the total bandwidth and steps for 𝑝= 16, assuming a balanced<br>
&emsp;&emsp;binary tree.<br>
&emsp;&emsp;In a tree-based AllReduce, leaf nodes send vectors up to the root, which computes the sum, then<br>
&emsp;&emsp;sends it down. For 𝑝= 16, a balanced binary tree has height log2(16) = 4. Each edge carries 𝐷<br>
&emsp;&emsp;bytes up and down, and there are 𝑝−1 = 15 edges, so total bandwidth is 2 ⋅(𝑝−1) ⋅𝐷= 2 ⋅15 ⋅<br>
&emsp;&emsp;𝐷= 30𝐷 bytes. Steps are 2 ⋅log2(𝑝) = 8 (4 up, 4 down).<br>
&emsp;(c) Compare the three implementations (naive ring, optimized ring, tree-based) for 𝑝= 16, discussing<br>
&emsp;&emsp;trade-offs for AI training.<br>
&emsp;&emsp;• Naive Ring: Bandwidth = 𝑝⋅2𝐷⋅2(𝑝−1) = 16 ⋅2𝐷⋅30 = 960𝐷 bytes, steps = 2(𝑝−1) = 30.<br>
&emsp;&emsp;&emsp;Simple but slow due to high bandwidth per step (2𝐷) and sequential exchanges.<br>
&emsp;&emsp;• Optimized Ring: Bandwidth = 30𝐷 bytes, steps = 30. More steps but lower bandwidth per step<br>
&emsp;&emsp;&emsp;16), better for bandwidth-constrained links and scalability.( 𝐷<br>
&emsp;&emsp;• Tree-Based: Bandwidth = 30𝐷 bytes, steps = 8. Fastest due to fewer steps, but the root can be a<br>
&emsp;&emsp;&emsp;bottleneck and tree construction may be complex.<br>
&emsp;&emsp;For AI training, tree-based is preferred for low latency (fewer steps), but optimized ring is better for<br>
&emsp;&emsp;scalability and fault tolerance in large systems due to lower bandwidth per step and no single point<br>
&emsp;&emsp;of failure.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;6


---

<a id="page-7"></a>
**Page 7**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Multicast and Collectives    7

&emsp;Part D: Overlay Topology Optimization<br>
&emsp;Optimize an overlay ring for AllReduce over the Clos network, with nodes A, B in Rack A, and C, D in<br>
&emsp;Rack B.


![Figure on page 7](figures/solutions-p07-fig04.png)

&emsp;Nodes A and B are in Rack A, nodes C and D are in Rack B, with intra-rack links (stretch = 1) and inter-<br>
&emsp;rack links (stretch = 3).<br>
3.4   (a) Propose an overlay ring topology by numbering nodes (A, B, C, D) as Nodes 1, 2, 3, 4 to minimize<br>
&emsp;&emsp;the average stretch factor. Calculate the stretch for each link and the average.<br>
&emsp;&emsp;Number nodes as: Node 1 = A, Node 2 = B, Node 3 = C, Node 4 = D, forming A→B→C→D→A.<br>
&emsp;&emsp;Stretches: A→B (1, intra-rack), B→C (3, inter-rack), C→D (1, intra-rack), D→A (3, inter-rack).<br>
&emsp;&emsp;Average stretch = 1+3+1+3   = 2.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4<br>
&emsp;(b) Consider two alternative topologies: (i) A→C→D→B→A, and (ii) A→C→B→D→A. Calculate<br>
&emsp;&emsp;their average stretches and compare to your proposed topology. If inter-rack links have bandwidth<br>
&emsp;&emsp;4 bytes per step, which topology minimizes total latency for an optimized ring AllReduce,𝐵= 𝐷<br>
&emsp;&emsp;assuming each hop adds 1 time unit of latency?<br>
&emsp;&emsp;• Alternative (i) A→C→D→B→A: Stretches: A→C (3, inter-rack), C→D (1, intra-rack), D→B<br>
&emsp;&emsp;&emsp;(3, inter-rack), B→A (1, intra-rack). Average = 3+1+3+1   = 2.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4<br>
&emsp;&emsp;• Alternative (ii) A→C→B→D→A: Stretches: A→C (3, inter-rack), C→B (3, inter-rack), B→D<br>
&emsp;&emsp;&emsp;(3, inter-rack), D→A (3, inter-rack). Average = 3+3+3+3   = 3.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4<br>
&emsp;&emsp;• Comparison: The proposed topology (A→B→C→D→A) and alternative (i) both have stretch<br>
&emsp;&emsp;&emsp;= 2, alternating intra- and inter-rack links, while alternative (ii) has higher stretch = 3, using only<br>
&emsp;&emsp;&emsp;inter-rack links, making it less efficient.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;7


---

<a id="page-8"></a>
**Page 8**

&emsp;8    Multicast and Collectives

&emsp;&emsp;• Latency Analysis: For an optimized ring AllReduce (𝑝= 4), total steps are 2 ⋅(𝑝−1) = 6 (3 for<br>
&emsp;&emsp;&emsp;4 bytes. With inter-rack bandwidth 𝐵=𝑝= 𝐷ReduceScatter, 3 for AllGather). Each step sends 𝐷<br>
&emsp;&emsp;&emsp;4 in 1 step (1 hop = 1 time unit), and inter-rack links send 𝐷4 , intra-rack links (unlimited) send 𝐷𝐷<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4<br>
&emsp;&emsp;&emsp;&emsp;𝐷<br>
&emsp;&emsp;&emsp;4in    4 = 1 step (3 hops = 3 time units). For A→B→C→D→A (links: intra, inter, intra, inter), steps<br>
&emsp;&emsp;&emsp;&emsp;𝐷<br>
&emsp;&emsp;&emsp;are: 1 (1 hop), 3 (3 hops), 1 (1 hop), 3 (3 hops), 1 (1 hop), 3 (3 hops), total latency = 1 + 3 + 1 + 3 +<br>
&emsp;&emsp;&emsp;1 + 3 = 12 time units. Alternative (i) has the same sequence (intra, inter, intra, inter), yielding<br>
&emsp;&emsp;&emsp;12 time units. Alternative (ii) (all inter-rack) has steps: 3, 3, 3, 3, 3, 3, total = 18 time units. The<br>
&emsp;&emsp;&emsp;proposed topology and alternative (i) minimize latency equally; the proposed topology is chosen<br>
&emsp;&emsp;&emsp;for its sequential ordering (A, B in Rack A; C, D in Rack B), simplifying configuration.<br>
&emsp;Part E: ReduceScatter Implementation<br>
&emsp;Consider a ReduceScatter operation, where each node receives one summed element of the AllReduce<br>
&emsp;output.<br>
3.5   (a) Explain how ReduceScatter differs from AllReduce and how it can be implemented using a naive ring<br>
&emsp;&emsp;for 𝑝= 4. Calculate the total bandwidth and steps.<br>
&emsp;&emsp;ReduceScatter sums each element across nodes, with node 𝑖 receiving the 𝑖th summed element,<br>
&emsp;&emsp;unlike AllReduce, where all nodes receive the full summed vector. For a naive ring (𝑝= 4), each<br>
&emsp;&emsp;node sends its entire vector (𝐷 bytes) to its neighbor in each of 𝑝−1 = 3 steps, accumulating the<br>
&emsp;&emsp;𝑖th element’s sum at node 𝑖. Total bandwidth = 𝐷⋅(𝑝−1) ⋅𝑝= 3 ⋅4 ⋅𝐷= 12𝐷 bytes (each of 4<br>
&emsp;&emsp;nodes sends 𝐷 bytes for 3 steps). Steps = 3.<br>
&emsp;(b) If you implement ReduceScatter using the optimized ring topology from Part D.1<br>
&emsp;&emsp;4 , calculate the total latency (in steps) and(A→B→C→D→A) with inter-rack bandwidth 𝐵= 𝐷<br>
&emsp;&emsp;compare to the naive ring.<br>
&emsp;&emsp;For an optimized ring ReduceScatter (𝑝= 4), only the ReduceScatter phase is needed (𝑝−1 = 3<br>
&emsp;&emsp;4 , intra-rack links (unlim-4 bytes per step. With inter-rack bandwidth 𝐵= 𝐷𝑝= 𝐷steps), sending 𝐷<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;𝐷<br>
&emsp;&emsp;4 in 4 in 1 step, and inter-rack links (e.g., B→C, D→A) send 𝐷ited) send 𝐷   4 = 1 step. The ring<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;𝐷<br>
&emsp;&emsp;(A→B→C→D→A) has 2 intra-rack (1→2, 3→4) and 1 inter-rack (2→3) links in 3 steps, yielding<br>
&emsp;&emsp;3 steps total. The naive ring also takes 3 steps but sends 𝐷 bytes per step, increasing congestion. The<br>
&emsp;&emsp;4 vs. 𝐷), reducing congestion inoptimized ring is more efficient due to lower bandwidth per step (𝐷<br>
&emsp;&emsp;bandwidth-constrained settings.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;8

