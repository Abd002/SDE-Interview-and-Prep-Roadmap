# Berkeley CS168 Spring 2025: Discussion 7: Questions

> Copied from the original: <https://sp25.cs168.io/>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;CS 168   Congestion Control<br>
&emsp;Spring 2025<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Discussion 7

&emsp;1   True/False<br>
1.1   UDP uses congestion control.

1.2   Flow control slows down the sender when the network is congested.

1.3   For TCP timer implementations, every time the sender receives an ACK for a previously unACKed packet,<br>
&emsp;it will recalculate ETO.

1.4   CWND (congestion window) is usually smaller than RWND (receiver window).

1.5   AIMD is the only “fair” option among MIMD, AIAD, MIAD, and AIMD.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1


---

<a id="page-2"></a>
**Page 2**

&emsp;2    Congestion Control<br>
&emsp;2   Impact of Fast Recovery<br>
&emsp;Consider a TCP connection, which is currently in Congestion Avoidance (AIMD):<br>
&emsp;• The last ACK sequence number was 101.<br>
&emsp;• The CWND size is 10 (in packets).<br>
&emsp;• The packets 101−110 were sent at t = 0, 0.1, …, 0.9 (sec), respectively.<br>
&emsp;• The packet 102 is lost only for its first transmission.<br>
&emsp;• RTT is 1 second.<br>
2.1   Without fast recovery:<br>
&emsp;• On new ACK, CWND +=    1<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;⌊CWND⌋<br>
&emsp;• On triple dupACKs, SSTHRESH = ⌊CWND   ⌋, then CWND = SSTHRESH.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2<br>
&emsp;&emsp;Time (sec)   Receive ACK (due to)   CWND   Transmit Seq # (mark retransmits)<br>
&emsp;&emsp;&emsp;&emsp;10 = 10.11.0   102 (101)   10 + 1   111<br>
&emsp;&emsp;&emsp;&emsp;1.2   102 (103)   10.1   /<br>
&emsp;&emsp;&emsp;&emsp;1.3   102 (104)   10.1   /<br>
&emsp;&emsp;&emsp;&emsp;1.4<br>
&emsp;&emsp;&emsp;&emsp;1.5<br>
&emsp;&emsp;&emsp;&emsp;1.6<br>
&emsp;&emsp;&emsp;&emsp;1.7<br>
&emsp;&emsp;&emsp;&emsp;1.8<br>
&emsp;&emsp;&emsp;&emsp;1.9<br>
&emsp;&emsp;&emsp;&emsp;2.0<br>
&emsp;&emsp;&emsp;&emsp;2.4

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2


---

<a id="page-3"></a>
**Page 3**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Congestion Control    3

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
&emsp;&emsp;&emsp;&emsp;1.5<br>
&emsp;&emsp;&emsp;&emsp;1.6<br>
&emsp;&emsp;&emsp;&emsp;1.7<br>
&emsp;&emsp;&emsp;&emsp;1.8<br>
&emsp;&emsp;&emsp;&emsp;1.9<br>
&emsp;&emsp;&emsp;&emsp;2.0<br>
&emsp;&emsp;&emsp;&emsp;2.4

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3


---

<a id="page-4"></a>
**Page 4**

&emsp;4    Congestion Control<br>
&emsp;3   AIMD Throughput


![Figure on page 4](figures/questions-p04-fig01.png)

&emsp;Consider a generalized version of AIMD, where:<br>
&emsp;• For every window of data ACK\_ed, the window size increases by a constant 𝐴.<br>
&emsp;• When the window size reaches 𝑊, a loss occurs, and the window size is multiplied by a constant 𝑀\< 1.<br>
&emsp;For simplicity, assume that 𝑊(1 −𝑀) is divisible by 𝐴. Thus, the window sizes will cycle through the<br>
&emsp;following: WM, WM + A, WM + 2A, … W. Let the RTT denote the packet round trip time. A graph of<br>
&emsp;window size versus time is referenced in the figure above.<br>
3.1   What is the average throughput? Express your answers in the number of packets, so we do not need to<br>
&emsp;consider MSS.

3.2   Calculate the loss probability 𝑝, using 𝑊 and 𝑀.

3.3   Derive the formula for throughput in part (a) when 𝑀= 0.5 and 𝐴= 1, using only 𝑝 and RTT.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4


---

<a id="page-5"></a>
**Page 5**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Congestion Control    5<br>
&emsp;4   Domain Name System


![Figure on page 5](figures/questions-p05-fig02.png)

&emsp;A sandwich ordering website **www.order.sandwich.com** is accepting online orders for the next 𝑇<br>
&emsp;minutes. Consider the following setup of DNS servers, with annotated latencies between servers.<br>
&emsp;Assume that:<br>
&emsp;• The latency between your computer and the website’s server is 𝑡.<br>
&emsp;• Once you send an order for a sandwich, you must wait for a confirmation response from the website<br>
&emsp;&emsp;before issuing another.<br>
&emsp;• Your computer does not cache the website’s IP address.<br>
4.1   Your local DNS server doesn’t cache any information.

4.2   Your local DNS server caches responses, with a time-to-live 𝐿≥𝑇.

4.3   Let 𝑇= 600 seconds and 𝑎= 𝑏= 𝑐= 𝑑= 𝑒= 𝑡= 1 second. Your local DNS server caches responses<br>
&emsp;with a finite TTL of 30 seconds.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;5

