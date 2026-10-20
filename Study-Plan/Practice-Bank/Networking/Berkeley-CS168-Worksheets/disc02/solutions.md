# Berkeley CS168 Spring 2025: Discussion 2: Official solutions

> Copied from the original: <https://sp25.cs168.io/>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;CS 168   Packets in Flight<br>
&emsp;Spring 2025<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Discussion 2

&emsp;Solutions last updated: February 03, 2025<br>
&emsp;1   True or False<br>
1.1   On a fast cross-continental link (~100Gbps), propagation delay usually dominates end-to-end packet<br>
&emsp;delay (Most messages are smaller than 100MB).<br>
&emsp;True. On a 100Gbps link, even a 100MB file download would only take 0.008 seconds to get on the<br>
&emsp;wire, compared to 0.02 seconds propagation delay from New York to London (in the best case). Most<br>
&emsp;communications (web page, emails) don’t come close to this size.<br>
1.2   On the same cross-continental link (~100Gbps), when transferring a 100GB file, propagation delay still<br>
&emsp;dominates end-to-end file delivery.<br>
&emsp;False. Sending a 100GB file over a 100Gbps link will have at least 8 seconds transmission delay.<br>
1.3   On-demand circuit-switching is adopted by the Internet.<br>
&emsp;False. Circuit-switching shares bandwidth through reservation. Packet-switching shares bandwidth on<br>
&emsp;demand. Packet-switching is adopted by the Internet.<br>
1.4   The aggregate (i.e., sum) of peaks is usually much larger than peak of aggregates in terms of bandwidth<br>
&emsp;usage.<br>
&emsp;True. Statistical multiplexing leverages this to use available scarce resources more effectively.<br>
1.5   Bursty traffic (i.e., when packet arrivals are not evenly spaced in time) always leads to queuing delays.<br>
&emsp;False. Queuing delay happens when arrival rate is larger than transmission rate (ignoring processing<br>
&emsp;delays). Bursty traffic does not necessarily imply arrival rate is larger than transmission rate. Queuing<br>
&emsp;delay depends on traffic patterns, router internals, and link properties.<br>
&emsp;2   End-to-End Delay<br>
&emsp;Consider the diagram below. Link 1 has length 𝐿1 m (where m stands for meters) and allows packets to<br>
&emsp;sec, while Link 2 has length 𝐿2 m but it only allows packets to be propagatedbe propagated at speed 𝑆1𝑚<br>
&emsp;sec (because the two links are made of different materials). Link 1 has transmission rate 𝑇1at speed 𝑆2   𝑚   bits<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;sec<br>
&emsp;sec .and Link 2 has transmission rate 𝑇2bits


![Figure on page 1](figures/solutions-p01-fig01.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1


---

<a id="page-2"></a>
**Page 2**

&emsp;2    Packets in Flight

&emsp;Assuming nodes can send and receive bits at full rate and ignoring processing delay, consider the following<br>
&emsp;scenarios:<br>
2.1   How long would it take to send a packet of 500 Bytes from Node 𝐴 to Node 𝐵 given 𝑇1 = 10000, 𝐿1 =<br>
&emsp;100000, and 𝑆1 = 2.5 ∗108?<br>
&emsp;&emsp;The total time needed is the sum of the transmission delay to push the packet onto Link 1 and the<br>
&emsp;&emsp;propagation delay for the packet to travel from Node A to Node B.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;𝑡{total} = 𝑡{transmission} + 𝑡{propagation}<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;transmission rate of Link 1 + distance between A and Bpacket size<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;𝑡{total} =<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;propagation speed<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;𝑡{total} = 500𝐵∗8 𝑏<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\+ 100000𝑚<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;𝐵<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;10000 𝑏2.5 ∗108 𝑚<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;𝑠𝑠<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;𝑡{total} = 0.4𝑠+ 0.0004𝑠= 0.4004s<br>
&emsp;&emsp;Notice that transmission delay dominates more than 99.9% in this case.<br>
2.2   Compute RTT (round trip time) for a packet of 𝐵 Bytes sent from Node 𝐴 to Node 𝐶 (packet gets<br>
&emsp;transmitted back from Node 𝐶 immediately after Node 𝐶 receives it).<br>
&emsp;There is only one packet, so no need to worry about queuing delays. Consider the diagram below:


![Figure on page 2](figures/solutions-p02-fig02.png)

&emsp;Note the sequence of delays the packet experiences during its route from 𝐴 to 𝐶:<br>
&emsp;(a) Transmission delay to push the packet onto Link 1.<br>
&emsp;(b) Propagation delay as the packet travels from Node 𝐴 to Node 𝐵.<br>
&emsp;(c) Transmission delay to push the packet onto Link 2.<br>
&emsp;(d) Propagation delay as the packet travels from Node 𝐵 to Node 𝐶.<br>
&emsp;(e) Transmission delay to push the packet onto Link 2.<br>
&emsp;(f) Propagation delay as the packet travels from Node 𝐶 to Node 𝐵.<br>
&emsp;(g) Transmission delay to push the packet onto Link 1.<br>
&emsp;(h) Propagation delay as the packet travels from Node 𝐵 to Node 𝐴.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2


---

<a id="page-3"></a>
**Page 3**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Packets in Flight    3

&emsp;Summing these delays yields the total RTT:<br>
&emsp;&emsp;𝑆2 + 8𝐵𝑆2 + 8𝐵𝑆1 + 8𝐵8𝐵𝑇1 + 𝐿1   𝑇2 + 𝐿2   𝑇2 + 𝐿2   𝑇1 + 𝐿1<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;𝑆1

2.3   At time 0, Node 𝐴 sends packet 𝑃1 with 𝐷1 Bytes and then it sends another packet 𝑃2 with 𝐷2 Bytes<br>
&emsp;immediately after it pushes all bits of 𝑃1 onto Link 1. When will Node 𝐶 receive the last bit of 𝑃2?<br>
&emsp;There are two packets, so we might need to consider queueing delays.<br>
&emsp;There will be a queueing delay at Node 𝐵 if 𝑃2 arrives at 𝐵 before 𝑃1 is finished being pushed onto<br>
&emsp;Link 2.<br>
&emsp;𝑇1 secondsLet’s start by computing the time at which 𝑃1 finishes being pushed onto Link 2. 𝑃1 takes 8𝐷1<br>
&emsp;𝑇2 seconds to𝑆1 seconds to propagate from Node 𝐴 to Node 𝐵, and then 8𝐷1to be pushed onto Link 1, 𝐿1<br>
&emsp;be pushed onto Link 2. Hence 𝑃1 leaves Node 𝐵 at time:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;𝑆1 + 8𝐷1𝑇1 + 𝐿1𝑡1 = 8𝐷1<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;𝑇2<br>
&emsp;𝑇1 seconds for 𝑃1 to beNext, let’s figure out the time when 𝑃2 arrives at Node 𝐵. It first waits 8𝐷1<br>
&emsp;𝑇1 seconds of transmission delay to be pushed onto Linkcompletely pushed onto Link 1, then takes 8𝐷2<br>
&emsp;𝑆1 seconds of propagation delay to reach Node 𝐵. With this, we know1 itself, before finally needing 𝐿1<br>
&emsp;that 𝑃2 reaches Node 𝐵 at time:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;𝑇1 + 𝐿1𝑇1 + 8𝐷2𝑡2 = 8𝐷1<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;𝑆1<br>
&emsp;There’s queueing delay if 𝑡1 \> 𝑡2, and the length of the delay can be expressed as:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;𝑇2 - 8𝐷2𝑆1 ) = 8𝐷1𝑇1 + 𝐿1𝑇1 + 8𝐷2𝑇2 ) - (8𝐷1𝑆1 + 8𝐷1𝑇1 + 𝐿1𝑡1 - 𝑡2 = (8𝐷1<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;𝑇1<br>
&emsp;With this analysis in hand, we can express the time at which Node 𝐶 receives the last bit of 𝑃2 as<br>
&emsp;follows:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;𝑇2 + 𝐿2𝑇1 ), 0) + 8𝐷2𝑇2 −8𝐷2𝑆1 + max((8𝐷1𝑇1 + 𝐿1𝑇1 + 8𝐷2𝑡{total} = 8𝐷1<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;𝑆2<br>
&emsp;From left to right, the terms in this sum are:<br>
&emsp;(a) The transmission delay to push 𝑃1 onto Link 1.<br>
&emsp;(b) The transmission delay to push 𝑃2 onto Link 1.<br>
&emsp;(c) The propagation delay as 𝑃2 travels from Node 𝐴 to Node 𝐵.<br>
&emsp;(d) The queueing delay at Node 𝐵. Note that the use of the max operator allows us to express the two<br>
&emsp;&emsp;cases when there is and when there isn’t queueing delay compactly.<br>
&emsp;(e) The transmission delay to push 𝑃2 onto Link 2.<br>
&emsp;(f) The propagation delay as 𝑃2 travels from Node 𝐵 to Node 𝐶.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3


---

<a id="page-4"></a>
**Page 4**

&emsp;4    Packets in Flight

&emsp;Below is the time-graph of a packet in flight without queueing delay:


![Figure on page 4](figures/solutions-p04-fig03.png)

&emsp;And with queueing delay:


![Figure on page 4](figures/solutions-p04-fig04.png)

2.4   Find the variable relations that need to be satisfied in order to have no queueing delays for part (c).<br>
&emsp;From the analysis we conducted in part (c), we know there will be queueing delays if 𝑡1 \> 𝑡2, or 8𝐷1<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;𝑇2 \><br>
&emsp;𝑇1 After simplifying, we see the relation that must𝑇2 ≤8𝐷2𝑇1 . Hence, there are no queueing delays if: 8𝐷18𝐷2<br>
&emsp;be satisfied is:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;𝑇2 ≤𝐷2𝐷1<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;𝑇1

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4


---

<a id="page-5"></a>
**Page 5**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Packets in Flight    5<br>
&emsp;3   Statistical Multi-What?<br>
&emsp;Consider three flows (𝐹1, 𝐹2, 𝐹3) sending packets over a single link. The sending pattern of each flow is<br>
&emsp;described by how many packets it sends within each one-second interval; the table below shows these<br>
&emsp;numbers for the first ten intervals. A perfectly smooth (i.e., non-bursty) flow would send the same number<br>
&emsp;of packets in each interval, but our three flows are very bursty, with highly varying numbers of packets<br>
&emsp;in each interval:


![Figure on page 5](figures/solutions-p05-fig05.png)

3.1   What is the peak rate of 𝐹1? 𝐹2? 𝐹3? What is the sum of the peak rates?<br>
&emsp;The peak rate is the highest the flow gets throughout the whole period. The peak rate of 𝐹1 is 34, the<br>
&emsp;peak rate of 𝐹2 is 40, and the peak rate of 𝐹3 is 45.<br>
&emsp;The sum of their peaks is 34 + 40 + 45 = 119.<br>
3.2   Now consider all packets to be in the same aggregate flow. What is the peak rate of this aggregate flow?<br>
&emsp;Summing the flows together, we get the following values for an aggregate flow:


![Figure on page 5](figures/solutions-p05-fig06.png)

&emsp;The peak of the aggregate flow happens at 1s, where it is 52.<br>
3.3   Which is higher - the sum of the peaks, or the peak of the aggregate?<br>
&emsp;The sum of the peaks is 119, whereas the peak of the aggregate is 52, so the sum of the peaks is much<br>
&emsp;higher. This is the insight from Statistical Multiplexing! The peak of the aggregate can only be at most<br>
&emsp;the sum of the peaks, but that only happens in the case that all of the peaks happen at the same time.<br>
&emsp;This is very unlikely, so usually, the peak of the aggregate is much lower than the sum of the peaks.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;5

