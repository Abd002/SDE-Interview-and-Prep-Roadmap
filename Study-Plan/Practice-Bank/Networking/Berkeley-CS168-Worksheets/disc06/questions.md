# Berkeley CS168 Spring 2025: Discussion 6: Questions

> Copied from the original: <https://sp25.cs168.io/>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;CS 168   Transmission Control Protocol<br>
&emsp;Spring 2025<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Discussion 6

&emsp;1   TCP in Action<br>
&emsp;Consider a sender sending 1000 B of data to a receiver over TCP. The sender sends packets of 100B, the<br>
&emsp;window size is 300B, and the ISN is 99 (so D100 is the first packet sent, then D200, and so on).<br>
&emsp;Remember, TCP uses a sliding window and retransmits the packet containing the next expected byte on<br>
&emsp;a timeout or, if TCP Fast Retransmit is enabled, when three duplicate acks are received. Assume here that<br>
&emsp;TCP Fast Retransmit is not enabled.<br>
&emsp;The link is flaky! The initial transmission of packets D200 and D700 get dropped.<br>
1.1   Fill in the below table with all packets sent by the sender until the receiver has received all packets and<br>
&emsp;the sender knows that. For simplicity, assume that packets (data and ACKs) arrive in order. You may or<br>
&emsp;may not need to fill in all lines.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Packet Data Offset   Sent on timeout   Dropped?   Cumulative ACK<br>
&emsp;&emsp;&emsp;&emsp;&emsp;1   D100   A200<br>
&emsp;&emsp;&emsp;&emsp;&emsp;2   D200   X<br>
&emsp;&emsp;&emsp;&emsp;&emsp;3   D300   A200<br>
&emsp;&emsp;&emsp;&emsp;&emsp;4<br>
&emsp;&emsp;&emsp;&emsp;&emsp;5<br>
&emsp;&emsp;&emsp;&emsp;&emsp;6<br>
&emsp;&emsp;&emsp;&emsp;&emsp;7<br>
&emsp;&emsp;&emsp;&emsp;&emsp;8<br>
&emsp;&emsp;&emsp;&emsp;&emsp;9<br>
&emsp;&emsp;&emsp;&emsp;&emsp;10<br>
&emsp;&emsp;&emsp;&emsp;&emsp;11<br>
&emsp;&emsp;&emsp;&emsp;&emsp;12<br>
&emsp;&emsp;&emsp;&emsp;&emsp;13<br>
&emsp;&emsp;&emsp;&emsp;&emsp;14

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1


---

<a id="page-2"></a>
**Page 2**

&emsp;2    Transmission Control Protocol

1.2   If the RTT of the link is 10ms and the timeout is initially 3 seconds, what is the total time needed for the<br>
&emsp;receiver to receive all packets and for the sender to know that?<br>
&emsp;Assume small packets (negligible transmission delay) and negligible processing time, and that the<br>
&emsp;estimates that go into the Retransmission Timeout (RTO) remain constant during the events below.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2


---

<a id="page-3"></a>
**Page 3**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Transmission Control Protocol    3<br>
&emsp;2   TCP Calculations<br>
&emsp;In this question, quantities will be measured in bytes unless explicitly mentioned otherwise.<br>
2.1   Suppose two hosts are about to open a TCP connection. The TCP headers used in the communication<br>
&emsp;are only 20 bytes long and regular (no-options) IPv4 is being used for Layer 3. If the MTU of the link is<br>
&emsp;1260 bytes, what is the MSS?

2.2   When this connection starts, the sender starts with an ISN 19. The initial window for the sender is set<br>
&emsp;to 10 packets. Given the previously calculated MSS, what ACK does the sender receive as part of the<br>
&emsp;TCP handshake? After that, what is the first and last ACK the sender receives for this initial window?<br>
&emsp;(Assume no packets were lost or reordered).

2.3   TCP senders compute their retransmission timeout (Estimated\_Timeout, RTO) using exponentially-<br>
&emsp;weighted moving averages of measured round-trip times (Estimated\_RTT) and the deviations of those<br>
&emsp;RTT measurements (Estimated\_Deviation). Every time a new ACK is received, the sampled RTT of<br>
&emsp;that specific ACK (Sampled\_RTT) is used to perform an online update, by making the following three<br>
&emsp;calculations in order (where 𝛼, 𝛽, and 𝜅 are fixed TCP parameters):<br>
&emsp;Estimated\_Deviation = (1 −𝛽) × Estimated\_Deviation + 𝛽× \|Estimated\_RTT −Sample\_RTT\|<br>
&emsp;Estimated\_RTT = (1 −𝛼) × Estimated\_RTT + 𝛼× Sampled\_RTT<br>
&emsp;Estimated\_Timeout (RTO) = Estimated\_RTT + 𝜅× Estimated\_Deviation<br>
&emsp;Now, suppose that we are a sender and have received a new ACK, and want to perform one step of<br>
&emsp;RTO estimation. Let’s do each of the three calculations above in the following suparts. Assume that<br>
&emsp;connections have been open and that there are no dropped packets.<br>
&emsp;(a) The sender receives the current ACK and proceeds to update its various estimations. The time<br>
&emsp;from when the packet was sent to when the ACK was received was 10msec. If the previous<br>
&emsp;Estimated\_Deviation was 50msec, and the previous Estimated\_RTT was 70msec, what is the new<br>
&emsp;Estimated\_Deviation (using β = 0.5)?

&emsp;(b) Still using the previous Estimated\_RTT of 70msec, What will the new Estimated\_RTT be (using<br>
&emsp;α = 0.5)?

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3


---

<a id="page-4"></a>
**Page 4**

&emsp;4    Transmission Control Protocol

&emsp;(c) Based on the previous two questions, what will the ETO be now (using **𝜅= 4**)?

2.4   What is the maximum theoretical rate of data transfer for this window size if the Estimated\_RTT is<br>
&emsp;what was previously estimated?

2.5   Assume 40msec is the Estimated\_RTT. If the lowest bandwidth across this connection is 76.25 MBps,<br>
&emsp;what is the smallest window that optimizes the question?

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4


---

<a id="page-5"></a>
**Page 5**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Transmission Control Protocol    5<br>
&emsp;3   Reliable Transport<br>
3.1   Bob thinks that using ACKs on every packet is very wasteful and wants to design a transport protocol<br>
&emsp;that is reliable but uses very few ACKs. He comes up with a scheme that he believes provides reliability<br>
&emsp;but only sends at most log(𝑛) ACKs, where 𝑛 is the number of packets. The protocol is as follows:<br>
&emsp;• Let 𝑃𝑖 be the 𝑖{𝑡ℎ} packet. When the receiver sees any of the packets in the set:<br>
&emsp;&emsp;{𝑃{2𝑖} \| 1 ≤𝑖≤⌊log2 𝑛⌋} ∪{𝑃𝑛}<br>
&emsp;&emsp;it sends back an ACK for that packet.<br>
&emsp;• The sender will send packets (𝑃{2{𝑖−1}}, 𝑃{2𝑖}\] in order (𝑖 starts at 0), and wait for the last packet to be<br>
&emsp;&emsp;ACKed. If the sender does not hear back after some time, it sends this window of packets again until<br>
&emsp;&emsp;the last packet is ACKed. Then, 𝑖 is incremented and the next window of packets is sent. One can think<br>
&emsp;&emsp;of this as a window that starts at packet 1 with size 1. Whenever the last packet in a window is ACKed,<br>
&emsp;&emsp;the window size is doubled, and the sender moves to the next set of packets. This process repeats until<br>
&emsp;&emsp;𝑃𝑛 is ACKed.<br>
&emsp;(a) Is this transport protocol reliable? Why or why not?

&emsp;(b) If you said the protocol was not reliable, what is a modification that you could make in order to fix<br>
&emsp;that? Try to make the smallest change possible.

&emsp;(c) Given that the protocol is reliable (or it wasn’t and you apply your fix from the last part), does it<br>
&emsp;actually save any bandwidth? Why or why not?

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;5


---

<a id="page-6"></a>
**Page 6**

&emsp;6    Transmission Control Protocol

3.2   Alice thinks that Bob is onto something and wants to design a transport protocol that uses fewer ACKs.<br>
&emsp;She decides that we can cut the number of ACKs in half by only acknowledging according to the<br>
&emsp;following rules:<br>
&emsp;• Let 𝑃{2𝑖} be the 𝑖{𝑡ℎ} even packet. The receiver sends an ACK iff the receiver has received 𝑃{2𝑖} and<br>
&emsp;&emsp;𝑃{2𝑖+1}. Note that we count packet indexing at 0 for the first packet.<br>
&emsp;• The sender continues to send packets until all even packets have been ACKed.<br>
&emsp;(a) Is this transport protocol reliable? Why or why not?

&emsp;(b) Is there a modification to the protocol that you could make in order to fix it?

&emsp;(optional) Does this protocol actually reduce the number of ACKs sent? (Note: you won’t be tested on this)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;6

