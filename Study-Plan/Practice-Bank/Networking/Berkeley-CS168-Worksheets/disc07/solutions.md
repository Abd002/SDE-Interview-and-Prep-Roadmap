# Berkeley CS168 Spring 2025: Discussion 7: Official solutions

> Copied from the original: <https://sp25.cs168.io/>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;CS 168   Congestion Control<br>
&emsp;Spring 2025<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Discussion 7

&emsp;1   True/False<br>
1.1   UDP uses congestion control.<br>
&emsp;False, TCP uses congestion control.<br>
1.2   Flow control slows down the sender when the network is congested.<br>
&emsp;False, flow control ensures the sender doesn’t overflow the receiver’s buffer.<br>
1.3   For TCP timer implementations, every time the sender receives an ACK for a previously unACKed packet,<br>
&emsp;it will recalculate ETO.<br>
&emsp;False, only clean samples are used. For example, ACKs on a packet that have been retransmitted are not<br>
&emsp;used since the sender cannot be sure which version the ACK is from.<br>
1.4   CWND (congestion window) is usually smaller than RWND (receiver window).<br>
&emsp;True.<br>
1.5   AIMD is the only “fair” option among MIMD, AIAD, MIAD, and AIMD.<br>
&emsp;True.<br>
&emsp;2   Impact of Fast Recovery<br>
&emsp;Consider a TCP connection, which is currently in Congestion Avoidance (AIMD):<br>
&emsp;• The last ACK sequence number was 101.<br>
&emsp;• The CWND size is 10 (in packets).<br>
&emsp;• The packets 101−110 were sent at t = 0, 0.1, …, 0.9 (sec), respectively.<br>
&emsp;• The packet 102 is lost only for its first transmission.<br>
&emsp;• RTT is 1 second.<br>
2.1   Without fast recovery:<br>
&emsp;• On new ACK, CWND += 1<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;⌊CWND⌋<br>
&emsp;• On triple dupACKs, SSTHRESH = ⌊CWND   ⌋, then CWND = SSTHRESH.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2<br>
&emsp;&emsp;Time (sec)   Receive ACK (due to)   CWND   Transmit Seq # (mark retransmits)<br>
&emsp;&emsp;&emsp;&emsp;10 = 10.1102 (101)1.010 + 1   111<br>
&emsp;&emsp;&emsp;&emsp;1.2   102 (103)   10.1   /<br>
&emsp;&emsp;&emsp;&emsp;1.3   102 (104)   10.1   /

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1


---

<a id="page-2"></a>
**Page 2**

&emsp;2    Congestion Control

&emsp;&emsp;Time (sec)   Receive ACK (due to)   CWND   Transmit Seq # (mark retransmits)<br>
&emsp;&emsp;&emsp;&emsp;1.4<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2 ⌋= 5102 (105)   ⌊10.1   102 (Rx)<br>
&emsp;&emsp;&emsp;&emsp;1.5<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;102 (106)   5   /<br>
&emsp;&emsp;&emsp;&emsp;1.6<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;102 (107)   5   /<br>
&emsp;&emsp;&emsp;&emsp;1.7<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;102 (108)   5   /<br>
&emsp;&emsp;&emsp;&emsp;1.8<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;102 (109)   5   /<br>
&emsp;&emsp;&emsp;&emsp;1.9<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;102 (110)   5   /<br>
&emsp;&emsp;&emsp;&emsp;2.0<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;102 (111)   5   /<br>
&emsp;&emsp;&emsp;&emsp;2.4<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;5 = 5.2112 (102)   5 + 1   112 - 116

2.2   With fast recovery:<br>
&emsp;• On triple dupACKs, SSTHRESH = ⌊CWND   ⌋, then CWND = SSTHRESH + 3, enter fast recovery.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2<br>
&emsp;• In fast recovery, CWND += 1 on every dupACK.<br>
&emsp;• On new ACK, exit fast recovery, CWND = SSTHRESH.<br>
&emsp;&emsp;Time (sec)   Receive ACK (due to)   CWND   Transmit Seq # (mark retransmits)<br>
&emsp;&emsp;&emsp;&emsp;10 = 10.11.0   102 (101)   10 + 1   111<br>
&emsp;&emsp;&emsp;&emsp;1.2   102 (103)   10.1   /<br>
&emsp;&emsp;&emsp;&emsp;1.3   102 (104)   10.1   /<br>
&emsp;&emsp;&emsp;&emsp;1.4<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2 ⌋+ 3 = 8102 (105)   ⌊10.1   102 (Rx)<br>
&emsp;&emsp;&emsp;&emsp;1.5<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;102 (106)   9   /<br>
&emsp;&emsp;&emsp;&emsp;1.6<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;102 (107)   10   /<br>
&emsp;&emsp;&emsp;&emsp;1.7<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;102 (108)   11   112<br>
&emsp;&emsp;&emsp;&emsp;1.8<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;102 (109)   12   113<br>
&emsp;&emsp;&emsp;&emsp;1.9<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;102 (110)   13   114<br>
&emsp;&emsp;&emsp;&emsp;2.0<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;102 (111)   14   115<br>
&emsp;&emsp;&emsp;&emsp;2.4<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;112 (102)   SSTHRESH = 5   116

&emsp;Note: Three dupACKs = 1 regular ACK + 3 ACKs of a sequence number that have been ACKed before already,<br>
&emsp;so we retransmit on the 4th ACK of seq 102.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2


---

<a id="page-3"></a>
**Page 3**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Congestion Control    3<br>
&emsp;3   AIMD Throughput


![Figure on page 3](figures/solutions-p03-fig01.png)

&emsp;Consider a generalized version of AIMD, where:<br>
&emsp;• For every window of data ACK\_ed, the window size increases by a constant 𝐴.<br>
&emsp;• When the window size reaches 𝑊, a loss occurs, and the window size is multiplied by a constant 𝑀\< 1.<br>
&emsp;For simplicity, assume that 𝑊(1 −𝑀) is divisible by 𝐴. Thus, the window sizes will cycle through the<br>
&emsp;following: WM, WM + A, WM + 2A, … W. Let the RTT denote the packet round trip time. A graph of<br>
&emsp;window size versus time is referenced in the figure above.<br>
3.1   What is the average throughput? Express your answers in the number of packets, so we do not need to<br>
&emsp;consider MSS.<br>
&emsp;2× RTT = 𝑊(𝑀+1)Throughput = Average number of packets in flight    = (MW+𝑊)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;RTT   2× RTT<br>
3.2   Calculate the loss probability 𝑝, using 𝑊 and 𝑀.<br>
&emsp;We have one drop out of every 𝑊(1−𝑀)   × MW+𝑊    packets sent (the area of the shaded trapezoid in the<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;𝐴   2<br>
&emsp;plot). Thus, the loss probability is:<br>
&emsp;𝑝= =1   2𝐴<br>
&emsp;&emsp;&emsp;×MW +𝑊𝑊(1−𝑀)𝑊2(1−𝑀2)<br>
&emsp;&emsp;&emsp;&emsp;𝐴   2<br>
3.3   Derive the formula for throughput in part (a) when 𝑀= 0.5 and 𝐴= 1, using only 𝑝 and RTT.<br>
&emsp;Throughput = 𝑊(𝑀+1)   3𝑊<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2× RTT =<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4× RTT<br>
&emsp;0.75𝑊2 =𝑊2(1−𝑀2) =p = 2𝐴   2   8<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3𝑊2<br>
&emsp;3𝑝 from the loss probability 𝑝, and plug this into the throughput equation:We get 𝑊= √8<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3×√8<br>
&emsp;RTT =4× RTT = √3𝑝4× RTT =Throughput = RTT√33𝑊   9×8   1   1<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;16×3×𝑝   2𝑝

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3


---

<a id="page-4"></a>
**Page 4**

&emsp;4    Congestion Control<br>
&emsp;4   Domain Name System


![Figure on page 4](figures/solutions-p04-fig02.png)

&emsp;A sandwich ordering website **www.order.sandwich.com** is accepting online orders for the next 𝑇<br>
&emsp;minutes. Consider the following setup of DNS servers, with annotated latencies between servers.<br>
&emsp;Assume that:<br>
&emsp;• The latency between your computer and the website’s server is 𝑡.<br>
&emsp;• Once you send an order for a sandwich, you must wait for a confirmation response from the website<br>
&emsp;&emsp;before issuing another.<br>
&emsp;• Your computer does not cache the website’s IP address.<br>
4.1   Your local DNS server doesn’t cache any information.<br>
&emsp;Your computer begins by issuing a DNS query for **www.order.sandwich.com** to its local DNS server,<br>
&emsp;which takes time 𝑎. Your local DNS server then iteratively queries the root DNS server, **.com**’s DNS<br>
&emsp;server, **.sandwich.com**’s DNS server, and **order.sandwich.com**’s DNS server, which takes time 2𝑏+<br>
&emsp;2𝑐+ 2𝑑+ 2𝑒. It then returns the result of the query to you, which takes time 𝑎.<br>
&emsp;After obtaining the IP address, your computer issues a sandwich request to **www.order.sandwich.**<br>
&emsp;**com**, which responds with an order confirmation, taking time 2𝑡.<br>
&emsp;The total time per sandwich order is: **2𝑎+ 2𝑏+ 2𝑐+ 2𝑑+ 2𝑒+ 2𝑡**<br>
&emsp;**2𝑎+2𝑏+2𝑐+2𝑑+2𝑒+2𝑡⌋**Thus, the total number of sandwiches that can be ordered in time 𝑇 is: **⌊**   **𝑇**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4


---

<a id="page-5"></a>
**Page 5**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Congestion Control    5

4.2   Your local DNS server caches responses, with a time-to-live 𝐿≥𝑇.<br>
&emsp;If 𝐿≥𝑇, once the result of the DNS query for **www.order.sandwich.com** is cached, it remains cached<br>
&emsp;in our local DNS server until the website’s server ultimately goes down.<br>
&emsp;• The first query takes the same amount of time as before: 2𝑎+ 2𝑏+ 2𝑐+ 2𝑑+ 2𝑒+ 2𝑡<br>
&emsp;• Subsequent queries take only **2𝑎+ 2𝑡**, since the local DNS server can now provide the IP imme-<br>
&emsp;&emsp;diately.<br>
&emsp;Thus, the total number of sandwiches we can order is:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;{1 + ⌊𝑇−(2𝑎+2𝑏+2𝑐+2𝑑+2𝑒+2𝑡)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;⌋if 𝑇≥2𝑎+ 2𝑏+ 2𝑐+ 2𝑑+ 2𝑒+ 2𝑡<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2𝑎+2𝑡<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;0 otherwise

4.3   Let 𝑇= 600 seconds and 𝑎= 𝑏= 𝑐= 𝑑= 𝑒= 𝑡= 1 second. Your local DNS server caches responses<br>
&emsp;with a finite TTL of 30 seconds.<br>
&emsp;When the first DNS query is made, the response gets cached in the local DNS server at:<br>
&emsp;𝑎+ 2𝑏+ 2𝑐+ 2𝑑+ 2𝑒= 9 seconds<br>
&emsp;This response remains cached for 30 seconds, expiring at time 39 seconds.<br>
&emsp;• The first order is completed at time: 12 seconds (9𝑠+ 𝑎+ 2𝑡)<br>
&emsp;• Additional orders can be placed from time 12 to 39, each taking 4 seconds (2𝑎+ 2𝑡).<br>
&emsp;• The number of orders made during this cached period is: ⌈39−12   ⌉= 7<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4<br>
&emsp;40 = 15• The pattern repeats every 40 seconds (𝑇= 600 allows for 15 cycles): 600<br>
&emsp;• Total sandwiches ordered: 15 × (7 + 1) = 120<br>
&emsp;Not bad!

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;5

