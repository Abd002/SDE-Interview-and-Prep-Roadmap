# Berkeley CS168 Spring 2025: Discussion 11: Official solutions

> Copied from the original: <https://sp25.cs168.io/>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;CS 168   Host Networking<br>
&emsp;Spring 2025<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Discussion 11

&emsp;1   Multiple Choice<br>
1.1   Which of the following is true of datacenters?<br>
&emsp;(a) Many applications that run in datacenters have extreme performance requirements.<br>
&emsp;(b) The hardware cost of the network is more expensive than that of the compute.<br>
&emsp;(c) CPU cycles are especially important since a cloud provider may rent them to customers for additional<br>
&emsp;profit.<br>
&emsp;(d) Datacenter operators have full administrative control over their datacenters.<br>
&emsp;(a), (c), (d)<br>
1.2   Why would one use kernel bypass?<br>
&emsp;(a) To customize networking behavior<br>
&emsp;(b) To avoid making changes to kernel code<br>
&emsp;(c) For performance optimization<br>
&emsp;(d) To save money on hardware<br>
&emsp;(a), (b), (c)<br>
1.3   T/F: Stateless offloads are easier to implement since all information needed is contained in each individual<br>
&emsp;packet.<br>
&emsp;(a) True    (b) False<br>
&emsp;True<br>
1.4   T/F: NIC offloads can be easily changed.<br>
&emsp;(a) True    (b) False<br>
&emsp;False<br>
1.5   T/F: Segmentation offload is a stateless offload.<br>
&emsp;(a) True    (b) False<br>
&emsp;True<br>
1.6   Which of the following are true of congestion control signals?<br>
&emsp;(a) ECN contains more information than loss.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1


---

<a id="page-2"></a>
**Page 2**

&emsp;2    Host Networking

&emsp;(b) ECN contains more information than delay.<br>
&emsp;(c) Delay can be difficult to measure at high precision.<br>
&emsp;(d) Receive rate (bandwidth) contains more information than ECN.<br>
&emsp;(a), (c)<br>
1.7   Which of the following are true of QoS?<br>
&emsp;(a) It only matters when a link is at 100% utilization.<br>
&emsp;(b) Only one flow can be in each class.<br>
&emsp;(c) It is used to prioritize some types of traffic.<br>
&emsp;(d) The queue can enforce the policy with weighted fair queueing.<br>
&emsp;(a), (c), (d)<br>
&emsp;2   Software-Defined Networking<br>
&emsp;You are a chief network engineer at CS168DB, a company that specializes in databases. Currently, your<br>
&emsp;networking infrastructure still relies on hardware switches that converge on routing with various L2/L3<br>
&emsp;protocols. You have tens of thousands of servers that need to communicate with each other. As the chief<br>
&emsp;network engineer, you are thinking about making the switch to software-defined networking.<br>
2.1   What are your current control plane abstractions?<br>
&emsp;None!<br>
2.2   What are the required control plane’s abstractions if you make the switch to SDN?<br>
&emsp;There are three. The first is an abstraction of the forwarding model of switches, OpenFlow is an example.<br>
&emsp;The second is an abstraction of network state, in the form of a global network view via a Network<br>
&emsp;Operating System. The third abstraction is an abstraction of the specification for network behavior,<br>
&emsp;which is used to specify the goals of an operator on an abstract view of the network.<br>
2.3   What happens when a link goes down in your new SDN setup?<br>
&emsp;The software switches connected to the link will communicate the topology change to the controller.<br>
&emsp;The controller will then recompute routing state and disseminate that information to the routers.<br>
2.4   Is OpenFlow equivalent to SDN?<br>
&emsp;No.<br>
&emsp;3   Network Virtualization Offload<br>
&emsp;Suppose you are a cloud provider implementing network virtualization. You want to allow a single server<br>
&emsp;to host multiple VMs with potentially the same private IP addresses. In order for the servers hosting VMs<br>
&emsp;to know which VM to send a packet to if there are, the packets must have some sort of identifier other than

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2


---

<a id="page-3"></a>
**Page 3**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Host Networking    3

&emsp;the destination IP. Accordingly, you want to add a virtual network header to each packet to distinguish it<br>
&emsp;from other customer’s virtual networks.<br>
3.1   Why would you want to allow this addressing overlap?<br>
&emsp;For better scalability (not limited by the number of private IPs in how many VMs you can host) and so<br>
&emsp;that tenants do not have to worry about others’ address spaces.<br>
3.2   Where could you implement this functionality?<br>
&emsp;This can be done in the hypervisor/software switch or the NIC.<br>
3.3   Assume the setup below. What rules should your SDN controller program into S1 in order for the below<br>
&emsp;network to be routable? Fill in the table with the necessary match-action rules.


![Figure on page 3](figures/solutions-p03-fig01.png)

&emsp;Assume the packets in the underlay network look like the one below. The virtual network header has<br>
&emsp;one field, the ID, which has the name of the customer in it.


![Figure on page 3](figures/solutions-p03-fig02.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Header Field   Value   Action<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Virtual Network ID<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;A   Forward to VM 1<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Virtual Network ID   B   Forward to VM 2

3.4   What other functionality might you put in this MA table?<br>
&emsp;(a) Bandwidth limiting<br>
&emsp;(b) HTTP caching<br>
&emsp;(c) Access control<br>
&emsp;(d) Accounting<br>
&emsp;(a), (c), (d)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3


---

<a id="page-4"></a>
**Page 4**

&emsp;4    Host Networking<br>
&emsp;4   RDMA<br>
&emsp;Assume your application is about to use RDMA to transfer some data. In this question, we will walk<br>
&emsp;through the steps to complete the process. Assume that we will use the RDMA Send operation discussed<br>
&emsp;in lecture.<br>
4.1   First, what benefits come from using RDMA?<br>
&emsp;(a) Reduce complexity<br>
&emsp;(b) Better performance<br>
&emsp;(c) Save CPU cycles<br>
&emsp;(d) Faster design iteration<br>
&emsp;(b), (c)<br>
4.2   Which sides must register buffers before the transfer?<br>
&emsp;Both<br>
4.3   How does the sender application start the transfer?<br>
&emsp;It places a pointer to the memory to send in the send queue.<br>
4.4   Does the receiver have to do anything for the transfer to work? If so, what?<br>
&emsp;It must place a pointer to the buffer in the receive queue.<br>
4.5   Which component of each host creates a completion queue entry?<br>
&emsp;The NIC<br>
4.6   How does the application know that the transfer is complete?<br>
&emsp;It checks the completion queue.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4

