# Berkeley CS168 Spring 2025: Discussion 8: Questions

> Copied from the original: <https://sp25.cs168.io/>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;CS 168   DNS, HTTP, Ethernet<br>
&emsp;Spring 2025<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Discussion 8<br>
&emsp;1   True/False<br>
1.1   Pipelined connections are frequently used in practice.

1.2   Hosts usually perform the iterative DNS resolution process themselves.

1.3   Every zone always has at least 2 name servers.

1.4   When looking up a root server, BGP will use unicast to find the correct root server.

1.5   A client can establish a TCP connection with a root server.

1.6   Most queries to DNS root servers are for nonexistent TLDs.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1


---

<a id="page-2"></a>
**Page 2**

&emsp;2<br>
&emsp;&emsp;&emsp;DNS, HTTP, Ethernet<br>
&emsp;2   Domain Name System


![Figure on page 2](figures/questions-p02-fig01.png)

&emsp;A sandwich ordering website **www.order.sandwich.com** is accepting online orders for the next 𝑇<br>
&emsp;minutes. Consider the following setup of DNS servers, with annotated latencies between servers.<br>
&emsp;Assume that:<br>
&emsp;• The latency between your computer and the website’s server is 𝑡.<br>
&emsp;• Once you send an order for a sandwich, you must wait for a confirmation response from the website<br>
&emsp;&emsp;before issuing another.<br>
&emsp;• Your computer does not cache the website’s IP address.<br>
2.1   Your local DNS server doesn’t cache any information.

2.2   Your local DNS server caches responses, with a time-to-live 𝐿≥𝑇.

2.3   Let 𝑇= 600 seconds and 𝑎= 𝑏= 𝑐= 𝑑= 𝑒= 𝑡= 1 second. Your local DNS server caches responses<br>
&emsp;with a finite TTL of 30 seconds.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2


---

<a id="page-3"></a>
**Page 3**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;DNS, HTTP, Ethernet    3<br>
&emsp;3   Performance<br>
&emsp;We want to download a webpage. We must first download the HTML (size 𝑃). This HTML includes URLs<br>
&emsp;for two embedded images of size 𝑀 which need to then be loaded. Assume the following:<br>
&emsp;• SYN, ACK, SYNACK, and HTTP request packets are small and take time 𝑧 to reach their destination in<br>
&emsp;&emsp;either direction.<br>
&emsp;• Each of our HTTP connections can achieve throughput 𝑇 for sending files and web pages across the<br>
&emsp;&emsp;network unless there are concurrent connections, in which case each connection’s throughput is divided<br>
&emsp;&emsp;by the number of concurrent connections.<br>
&emsp;• You never need to wait for TCP connections to terminate.<br>
&emsp;For each of the following scenarios, compute the total time to download the web page and both media files.<br>
3.1   Sequential requests with non-persistent TCP connections.

3.2   Concurrent requests with non-persistent TCP connections.

3.3   Sequential requests with a single persistent TCP connection.

3.4   Pipelined requests within a single persistent TCP connection.

3.5   We have been assuming that the throughput for sending media files is 𝑇 for a single connection, and<br>
&emsp;𝑇𝑛 for 𝑛 concurrent connections. Remember that the throughput for sending the media files depends on<br>
&emsp;both its transmission delay and propagation delay. So far we ignored this finer granularity division but<br>
&emsp;depending on the size of the media files, we can make more inferences about how fast we can send the<br>
&emsp;media files. If the media files are very small, what kind of delay would dominate the time it would take<br>
&emsp;to send them? What if the files are very large?

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3


---

<a id="page-4"></a>
**Page 4**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;DNS, HTTP, Ethernet    5<br>
&emsp;4   HTTP


![Figure on page 4](figures/questions-p04-fig02.png)

&emsp;Consider the (abstracted) network topology above. Hosts A and C are connected to HTTP proxies that<br>
&emsp;cache the results of the last two HTTP requests they’ve seen to improve performance. The proxy will<br>
&emsp;perform any TCP handshakes or teardowns with the client and server concurrently. That is, when it gets<br>
&emsp;a SYN from a client, it will respond and immediately send a SYN to the server, and similarly for other<br>
&emsp;messages.<br>
&emsp;As an example, let’s suppose that A sends a request to B. A sends a SYN to B, which is intercepted by the<br>
&emsp;proxy. The proxy sees the request is going to B, and initiates its own TCP handshake with B, all the while<br>
&emsp;completing the original, separate handshake with A. By the time this has completed, there will be 2 TCP<br>
&emsp;sessions: the first between A and the proxy, and the second between the proxy and B. When A sends a<br>
&emsp;request, the proxy will forward it to B if it is not cached, or respond if it is cached. A similar process to<br>
&emsp;the handshake is followed when A tears the connection down.<br>
&emsp;For the purposes of this problem, assume that the latency on each link is 𝐿, and the latency through the<br>
&emsp;internet is 𝐼. Processing delay at all points and packet size is assumed to be negligible (don’t consider<br>
&emsp;transmission and processing delay). Assume that TCP connections use the 3-message teardown, and that<br>
&emsp;no data is sent in ACK packets.<br>
&emsp;Suppose that Host A issues the following list of requests (in order):<br>
&emsp;• berkeley.edu to Host C<br>
&emsp;• eecs.berkeley.edu to Host C<br>
&emsp;• stanford.edu to Host B<br>
&emsp;• mit.edu to Host B<br>
&emsp;• stanford.edu to Host B<br>
&emsp;• berkeley.edu to Host C<br>
4.1   What is the total time to complete all requests if they are issued one at a time? That is, each completes<br>
&emsp;before the next is started with a separate TCP session (no need to wait for the session to be torn down).

4.2   What is the total time to complete all requests if they are performed concurrently such that everything<br>
&emsp;is done in parallel and there is no possibility for caching?

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;5

