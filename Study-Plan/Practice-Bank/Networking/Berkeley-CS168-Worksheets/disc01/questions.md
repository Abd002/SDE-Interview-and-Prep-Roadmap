# Berkeley CS168 Spring 2025: Discussion 1: Questions

> Copied from the original: <https://sp25.cs168.io/>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

CS 168   Layers, Design, Traceroute<br>
Spring 2025<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Discussion 1

1   Internet Layers<br>
In this question, we’ll explore what headers are on the packet as it travels through different layers and<br>
protocols of the network. Consider the diagram below, which shows Host A sending a packet to Host B.<br>
Along the way, the packet is forwarded by intermediate routers R1 and R2.<br>
At each of the labeled time steps, fill in the boxes to describe which headers are attached to the payload.<br>
Not all boxes may be used. The headers at 𝑡= 2 are filled in for you as an example.


![Figure on page 1](figures/questions-p01-fig01.png)

t0   Payload

t1   Payload

t2   Ethernet   IP   TCP   HTTP   Payload

t3   Payload

t4   Payload

t5   Payload

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1


---

<a id="page-2"></a>
**Page 2**

2    Layers, Design, Traceroute<br>
2   Design Philosophy (Clark Paper)<br>
Today’s Internet architecture derives its core design principles from the ARPANET. The ARPANET was<br>
the first packet-switched network, developed by DARPA¹ in the 1970s and 1980s.<br>
The core design objectives of the ARPANET are described in the paper The design philosophy of the DARPA<br>
internet protocols (1988), by David Clark. Clark was a chief protocol architect for the Internet in the 1980s.<br>
Link to the paper: https://dl.acm.org/doi/10.1145/52325.52336<br>
According to the paper, the DARPA architecture has one fundamental goal, and several secondary goals:<br>
1\. Fundamental Goal: The Internet must offer an “effective” technique for multiplexed utilization of<br>
existing interconnected networks (e.g. autonomous systems).<br>
Specifically, the Internet should be a packet-switched communications facility that interconnects indi-<br>
vidual networks through packet switches called gateways, where such interconnection still preserves<br>
the individual networks as separately administrated, relatively autonomous entities.<br>
2\. Secondary Goal: Internet communication must continue despite loss of networks or gateways.<br>
3\. Secondary Goal: The Internet must support multiple types of communications service.<br>
4\. Secondary Goal: The Internet architecture must accommodate a variety of networks (e.g. autonomous<br>
systems).<br>
5\. Secondary Goal: The Internet architecture must permit distributed management of its resources.<br>
6\. Secondary Goal: The Internet architecture must be cost effective.<br>
7\. Secondary Goal: The Internet architecture must permit host attachment with a low level of effort.<br>
8\. Secondary Goal: The resources used in the Internet architecture must be accountable.

¹Defense Advanced Research Projects Agency

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2


---

<a id="page-3"></a>
**Page 3**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Layers, Design, Traceroute    3

&emsp;For each of the following proposals, determine whether it is in violation of the goals listed above. If a<br>
&emsp;proposal is in violation, also indicate which of the above goals the proposal violates.<br>
&emsp;Also, for subparts 2.2 and 2.4, determine whether the proposals violate the end-to-end principle.<br>
&emsp;Note: This question is open-ended, and our answers are subjective and open to debate.<br>
2.1   The routers of all Internet carriers must accommodate circuit switching.<br>
&emsp;Recall circuit switching: End hosts can reserve capacity in the network in advance.

2.2   When forwarding packets, all routers must also perform additional communication to ensure that the<br>
&emsp;packet is received by the next router.

2.3   All Internet carriers must routinely advertise the state of their network to a centralized network<br>
&emsp;controller. Carriers must rely solely on the controller for commands to update their state.

2.4   Due to abnormal radio interference at the Berkeley lab (LBNL), routers on LBNL’s network must<br>
&emsp;implement reliable delivery when forwarding packets.

2.5   To improve connection stability, the routers of all Internet carriers can only update their state during a<br>
&emsp;two-hour window of each day.

2.6   The Amazon network devises a more efficient mechanism for load-balancing network traffic. All the<br>
&emsp;routers in Amazon’s network subscribe to Amazon’s in-house network controller for updating their state.

2.7   The Stanford network blocks packets that it suspects are coming from the UC Berkeley network.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3


---

<a id="page-4"></a>
**Page 4**

&emsp;4    Layers, Design, Traceroute<br>
&emsp;3   A Gentle Intro to Traceroute<br>
&emsp;Traceroute is a utility that attempts to discover the intermediate routers on the network path between<br>
&emsp;you and a given destination host.<br>
&emsp;This problem provides a basic walkthrough of traceroute, and shows how traceroute exploits the TTL field<br>
&emsp;in IP packets, and the ICMP protocol.<br>
3.1   IP Time-to-Live: Layer 3 (IP) packets have a header field called Time-to-Live (TTL). When a packet is<br>
&emsp;first sent out of an end host, its TTL field is initialized to a high number (e.g. 64). Every time a packet is<br>
&emsp;forwarded by an intermediate router to the next-hop router, the TTL field is decremented by 1.<br>
&emsp;Why might having a TTL field be useful?<br>
&emsp;Hint: What if packets are mistakenly forwarded in a loop? What should routers do if the packet TTL is<br>
&emsp;decremented to 0?

3.2   ICMP: Network devices can use the Internet Control Message Protocol (ICMP) to communicate various<br>
&emsp;error messages and operational status messages. ICMP is built on top of IP.<br>
&emsp;For example, intermediate routers can send an ICMP-over-IP packet to an end host to indicate a network<br>
&emsp;error (e.g. “you tried to send a packet to an unreachable destination”).<br>
&emsp;ICMP packets consist of a header and a payload:<br>
&emsp;• The ICMP header has two fields (type and code) that indicate the status that the sender wants to<br>
&emsp;&emsp;communicate (e.g. “unreachable destination”, or “this is a response to an **echo** request”).<br>
&emsp;• The ICMP payload includes a copy of the IP header of the original packet that triggered the error, as<br>
&emsp;&emsp;well as the first 8 bytes of the original packet’s IP payload.<br>
&emsp;In the traceroute project, the original packets you send will be UDP-over-IP packets. You will receive<br>
&emsp;ICMP packets in response, and the ICMP payload will contain the original packet’s IPv4 and UDP headers.<br>
&emsp;Why do the ICMP packets you receive contain this specific payload?<br>
&emsp;In general, why might ICMP packets include a copy of the original packet’s header and part of the original<br>
&emsp;packet’s payload?

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4


---

<a id="page-5"></a>
**Page 5**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Layers, Design, Traceroute    5

3.3   ICMP Status Types: In the traceroute project, we are interested in two particular status types:<br>
&emsp;• Time Exceeded: Suppose an intermediate router receives a packet, decrements the TTL, and the<br>
&emsp;&emsp;resulting TTL is 0. The router drops the packet and sends an ICMP Time Exceeded response to the<br>
&emsp;&emsp;original sender of the packet.<br>
&emsp;• Destination Unreachable: Suppose an intermediate router receives a packet with an unknown<br>
&emsp;&emsp;destination (i.e. the router doesn’t know where the destination is). The router drops the packet and<br>
&emsp;&emsp;sends an ICMP Destination Unreachable response to the original sender of the packet.<br>
&emsp;• Destination Unreachable: Here’s another scenario where this type is used. Suppose a destination<br>
&emsp;&emsp;host receives a packet with a UDP destination port that the host is not listening on. The host drops the<br>
&emsp;&emsp;packet and sends an ICMP Destination Unreachable response to the original sender of the packet.<br>
&emsp;How do intermediate routers know who to send the ICMP packet to?<br>
&emsp;Hint: What header field should the router look at?

3.4   If an intermediate router generates an ICMP Time Exceeded response to a packet, what value does the<br>
&emsp;router set in the TTL field of the new ICMP-over-IP packet?<br>
&emsp;What is the value of the TTL set in the copy of the original packet’s IPv4 header (inside the ICMP<br>
&emsp;payload)?

&emsp;Motivating Traceroute: Now, let’s see how we can send UDP packets and leverage ICMP Time Exceeded<br>
&emsp;responses to reveal information about intermediate routers that are forwarding our packets.<br>
&emsp;Consider the following network topology. We are end host A, and we wish to perform traceroute to<br>
&emsp;discover the routers along the path to end host B.


![Figure on page 5](figures/questions-p05-fig02.png)

&emsp;For each outgoing UDP packet we send, describe the packet we will receive from other devices in the<br>
&emsp;network. Do we receive an ICMP-over-IP packet, a UDP-over-IP packet, or something else? What are the<br>
&emsp;header fields (e.g. source/destination IP, ICMP type) in the packet we receive?<br>
&emsp;For now, assume all routers work as intended, with no router or network errors (e.g. no packets are<br>
&emsp;dropped).

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;5


---

<a id="page-6"></a>
**Page 6**

&emsp;6    Layers, Design, Traceroute

3.5   You send a UDP-over-IP packet with:<br>
&emsp;• Source IP = A<br>
&emsp;• Destination IP = B<br>
&emsp;• Source Port = 53201<br>
&emsp;• Destination Port = 33434<br>
&emsp;• TTL = 1

3.6   You send a UDP-over-IP packet with:<br>
&emsp;• Source IP = A<br>
&emsp;• Destination IP = B<br>
&emsp;• Source Port = 53201<br>
&emsp;• Destination Port = 33434<br>
&emsp;• TTL = 2

3.7   You send a UDP-over-IP packet with:<br>
&emsp;• Source IP = A<br>
&emsp;• Destination IP = B<br>
&emsp;• Source Port = 53201<br>
&emsp;• Destination Port = 33434<br>
&emsp;• TTL = 3

3.8   You send a UDP-over-IP packet with:<br>
&emsp;• Source IP = A<br>
&emsp;• Destination IP = B<br>
&emsp;• Source Port = 53201<br>
&emsp;• Destination Port = 33434<br>
&emsp;• TTL = 4

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;6


---

<a id="page-7"></a>
**Page 7**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Layers, Design, Traceroute    7

&emsp;You should have observed in the previous part that the packets we received in response to our outgoing<br>
&emsp;“probes” reveal the IP addresses of the intermediate routers along the path to B. This observation forms<br>
&emsp;the basis of traceroute’s design!<br>
&emsp;Here’s some high-level pseudocode for traceroute. It iterates through increasing TTL values, and sends 3<br>
&emsp;probes for each TTL. It then receives responses to the probes, and logs any relevant results.

**1**   **for ttl in range(1, 65):**<br>
**2**     **ttl\_result = \[\]  # empty set to log responses**<br>
**3**     **for \_ in range(3):**<br>
**4**       **send packet to dst\_ip with TTL=ttl**<br>
**5**       **wait for a corresponding valid/relevant response**<br>
**6**<br>
**7**       **if no valid/relevant response received:**<br>
**8**         **add an empty address to ttl\_result**<br>
**9**<br>
**10**       **if valid/relevant ICMP Time Exceeded response received:**<br>
**11**         **add source IP of that packet to ttl\_result**<br>
**12**<br>
**13**       **if valid/relevant ICMP Destination Unreachable received:**<br>
**14**         **add dst\_ip to ttl\_result**<br>
**15**         **exit outer loop**<br>
**16**<br>
**17**     **print ttl\_result  # responses to all probes at this TTL**<br>
&emsp;Consider running the pseudocode above on the network below.


![Figure on page 7](figures/questions-p07-fig03.png)

&emsp;You are host A, and you run traceroute with a destination of host B.<br>
&emsp;For now, assume all routers work as intended, with no router or network errors (e.g. no packets are<br>
&emsp;dropped), with the following exceptions:<br>
&emsp;• When R2 receives packets from A, it alternates between forwarding the packet to R3, forwarding the<br>
&emsp;packet to R5, and dropping the packet.<br>
&emsp;• R4 is configured to not send any ICMP responses.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;7


---

<a id="page-8"></a>
**Page 8**

&emsp;8    Layers, Design, Traceroute

3.9   In the table below, fill in the IP addresses discovered at each TTL. If no response is received for a specific<br>
&emsp;probe, write **\*** in the box.

&emsp;**TTL**Probe 1   Probe 2   Probe 3

&emsp;&emsp;1

&emsp;&emsp;2

&emsp;&emsp;3

&emsp;&emsp;4

&emsp;&emsp;5

&emsp;&emsp;6

&emsp;Note on network errors: In the above examples, we assumed that packets would never be delayed,<br>
&emsp;corrupted, or duplicated in-transit. In real life, these errors could happen.<br>
&emsp;In the traceroute project, your job is to ensure that when reporting results for TTL 𝑖, your code ignores<br>
&emsp;ICMP responses that were not generated in response to the probes sent at TTL 𝑖.<br>
&emsp;A question for you to consider: Traceroute probes and responses from earlier TTLs (i.e. TTL ≤𝑖−1) can<br>
&emsp;be delayed or duplicated. How can we check that each ICMP response we receive at TTL 𝑖 is actually<br>
&emsp;generated in response to probes sent at TTL 𝑖, and not in response to probes sent at earlier TTLs?<br>
&emsp;It is not sufficient to check if the entire ICMP payload is a duplicate of an earlier ICMP payload. It’s possible<br>
&emsp;that you send two duplicate probes, but receive two distinct ICMP responses. This could happen if, for<br>
&emsp;example, the probes are forwarded along different paths in the network. (Question for you to consider:<br>
&emsp;What header fields end up different in this case?)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;8

