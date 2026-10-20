# Berkeley CS168 Spring 2025: Discussion 6: Official solutions

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
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;D400   A200<br>
&emsp;&emsp;&emsp;&emsp;&emsp;5<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;D200   X   A500<br>
&emsp;&emsp;&emsp;&emsp;&emsp;6<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;D500   A600<br>
&emsp;&emsp;&emsp;&emsp;&emsp;7<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;D600   A700<br>
&emsp;&emsp;&emsp;&emsp;&emsp;8<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;D700   X<br>
&emsp;&emsp;&emsp;&emsp;&emsp;9<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;D800   A700<br>
&emsp;&emsp;&emsp;&emsp;&emsp;10<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;D900   A700<br>
&emsp;&emsp;&emsp;&emsp;&emsp;11<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;D700   X   A1000<br>
&emsp;&emsp;&emsp;&emsp;&emsp;12<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;D1000   A1100<br>
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
&emsp;estimates that go into the Retransmission Timeout (RTO) remain constant during the events below.<br>
&emsp;2\*RTO + 5 RTT = 6.05 s<br>
&emsp;1\*RTT for 1, 1\*RTO before 5, 2\*RTT for 5-7, 1\*RTO before 11, 2\*RTT for 11-12<br>
&emsp;Note that we have 2\*RTT for 5-7 – not 3\*RTT. Because D500 and D600 are sent at practically the same<br>
&emsp;time, it takes  1 RTT from when we send D500 until we receive A700.<br>
&emsp;2   TCP Calculations<br>
&emsp;In this question, quantities will be measured in bytes unless explicitly mentioned otherwise.<br>
2.1   Suppose two hosts are about to open a TCP connection. The TCP headers used in the communication<br>
&emsp;are only 20 bytes long and regular (no-options) IPv4 is being used for Layer 3. If the MTU of the link is<br>
&emsp;1260 bytes, what is the MSS?<br>
&emsp;1220 bytes = 1260 bytes - 20 bytes (TCP) - 20 bytes (IP)<br>
2.2   When this connection starts, the sender starts with an ISN 19. The initial window for the sender is set<br>
&emsp;to 10 packets. Given the previously calculated MSS, what ACK does the sender receive as part of the<br>
&emsp;TCP handshake? After that, what is the first and last ACK the sender receives for this initial window?<br>
&emsp;(Assume no packets were lost or reordered).<br>
&emsp;The ACK as part of the TCP handshake will be 20, because the receiver is ACKing having received the ISN.<br>
&emsp;After that, the first ACK for real data sent by the sender will be 1240, which is the MSS (1220, calculated<br>
&emsp;in the last problem) + the current sequence number, which is 20. The last ACK will be 12220, which is<br>
&emsp;the next sequence number after all data is sent, 12200 + ISN = 12200 + 20 = 12220.<br>
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
&emsp;from when the packet was sent to when the ACK was received was 10msec. If the previous

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2


---

<a id="page-3"></a>
**Page 3**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Transmission Control Protocol    3

&emsp;Estimated\_Deviation was 50msec, and the previous Estimated\_RTT was 70msec, what is the new<br>
&emsp;Estimated\_Deviation (using β = 0.5)?<br>
&emsp;Estimated\_Deviation<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;= 0.5 × Estimated\_Deviation + 0.5 × \|Estimated\_RTT −Sample\_RTT\|<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;= 0.5 × 50 msec   + 0.5 × (70 msec   −10 msec)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;= 55 msec<br>
&emsp;(b) Still using the previous Estimated\_RTT of 70msec, What will the new Estimated\_RTT be (using<br>
&emsp;α = 0.5)?<br>
&emsp;Estimated\_RTT = 0.5 × 70 msec + 0.5 × 10msec = 40 msec<br>
&emsp;(c) Based on the previous two questions, what will the ETO be now (using **𝜅= 4**)?<br>
&emsp;ETO = 40 msec + 4 × 55 msec = 260 msec<br>
2.4   What is the maximum theoretical rate of data transfer for this window size if the Estimated\_RTT is<br>
&emsp;what was previously estimated?<br>
&emsp;Window\_Size (bytes) = Window\_Size (Packets) × 1220 bytes = 12200 bytes<br>
&emsp;sec = 305 KBps40𝑚sec = 305000 𝐵Bandwidth = 12200𝐵<br>
2.5   Assume 40msec is the Estimated\_RTT. If the lowest bandwidth across this connection is 76.25 MBps,<br>
&emsp;what is the smallest window that optimizes the question?<br>
&emsp;76.25×106𝐵    × 40 msec = 3.05 MB<br>
&emsp;&emsp;sec<br>
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

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3


---

<a id="page-4"></a>
**Page 4**

&emsp;4    Transmission Control Protocol

&emsp;No, it is not reliable. If only the packets that are designated to be ACKed make it through, the receiver<br>
&emsp;will ACK them and the sender will happily accept that all the data was received, even though only log(𝑛)<br>
&emsp;packets actually made it through.<br>
&emsp;(b) If you said the protocol was not reliable, what is a modification that you could make in order to fix<br>
&emsp;that? Try to make the smallest change possible.<br>
&emsp;Simply change the ACKs from individual ACKs to cumulative ACKs that are only sent if the target<br>
&emsp;packet and all previous packets have been received.<br>
&emsp;(c) Given that the protocol is reliable (or it wasn’t and you apply your fix from the last part), does it<br>
&emsp;actually save any bandwidth? Why or why not?<br>
&emsp;Not at all. In fact, this protocol uses much more bandwidth. As the window size increases (exponen-<br>
&emsp;tially!), the odds that a packet is dropped also increase since there are more packets (more chances for<br>
&emsp;drops), and the large number of packets sent at once will almost certainly congest the network if a large<br>
&emsp;file is being sent. This means that entire windows will be resent constantly, wasting lots of bandwidth.<br>
&emsp;As an example, consider the transfer of a 1 GB file. The last 500 MB of the file will be sent as a single<br>
&emsp;window. Assume about 1 KB of data is sent per packet. Then the last window is 500,000 packets wide!<br>
&emsp;If even one of these packets is lost, then all 500,000 will be resent until every packet has been received.<br>
3.2   Alice thinks that Bob is onto something and wants to design a transport protocol that uses fewer ACKs.<br>
&emsp;She decides that we can cut the number of ACKs in half by only acknowledging according to the<br>
&emsp;following rules:<br>
&emsp;• Let 𝑃{2𝑖} be the 𝑖{𝑡ℎ} even packet. The receiver sends an ACK iff the receiver has received 𝑃{2𝑖} and<br>
&emsp;&emsp;𝑃{2𝑖+1}. Note that we count packet indexing at 0 for the first packet.<br>
&emsp;• The sender continues to send packets until all even packets have been ACKed.<br>
&emsp;(a) Is this transport protocol reliable? Why or why not?<br>
&emsp;No, it is not reliable. Consider sending an odd number of packets. The receiver will never acknowledge<br>
&emsp;the last packet since the sender won’t send another even packet.<br>
&emsp;(b) Is there a modification to the protocol that you could make in order to fix it?<br>
&emsp;Have the sender keep a count of the number of packets. If the count is odd, send a dummy packet with<br>
&emsp;no data.<br>
&emsp;(optional) Does this protocol actually reduce the number of ACKs sent? (Note: you won’t be tested on this)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4


---

<a id="page-5"></a>
**Page 5**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Transmission Control Protocol    5

Yes, for sufficiently low network loss conditions, in expectation, the number of transmissions for each<br>
packet in the even/odd scheme is always less than the number of transmissions in the 1-ACK-per-packet<br>
scheme, meaning the total number of ACKs sent is also always less.<br>
Proof: Let 𝑋 be the number of transmissions by ACKing every packet. Let 𝑌 be the number of<br>
transmissions by ACKing every even packet. Let 𝑝 be the probability that one packet is dropped.<br>
Claim: 𝔼\[𝑌\] \< 𝔼\[𝑋\] if and only if 𝑝\< .5<br>
We assume geometric distributions to model the probability of a given number of drops before a packet<br>
is successfully transmitted.<br>
When ACKing every packet: 𝑃(retry for packet 𝑖) = 𝑝. Therefore, 𝑋𝑖, the number of retries for packet<br>
𝑖, follows a geometric distribution.<br>
When ACKing only even packets: 𝑃(retry for packet 𝑖) = 1 −(1 −𝑝)2 (the probability that either or<br>
both of the packets in the pair are dropped). Therefore, 𝑌𝑖, the number of retries for packet 𝑖, follows a<br>
geometric distribution.<br>
{𝑖=0} 𝑋𝑖 and 𝑌= ∑{𝑛}Then: 𝑋= ∑{𝑛}<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;{𝑖=0} 𝑌𝑖<br>
𝐸\[𝑋\] = ∑{𝑛}   𝑛<br>
&emsp;&emsp;&emsp;{𝑖=0} 𝐸\[𝑋𝑖\] =<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1−𝑝<br>
{𝑖=0} 𝐸\[𝑌𝑖\] = 𝑛𝐸\[𝑌\] = ∑{𝑛}   1   𝑛<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2 ×   (1−𝑝)2 =<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2(1−𝑝)2<br>
Then, for all 𝑝\< 0.5, 𝐸\[𝑌\] \< 𝐸\[𝑋\]

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;5

