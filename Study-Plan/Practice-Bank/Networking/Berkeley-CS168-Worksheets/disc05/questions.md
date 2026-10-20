# Berkeley CS168 Spring 2025: Discussion 5: Questions

> Copied from the original: <https://sp25.cs168.io/>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;CS 168   Border Gateway Protocol<br>
&emsp;Spring 2025<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Discussion 5

&emsp;1   True/False<br>
1.1   iBGP is used for intradomain routing.

1.2   Avoiding loops is one reason why BGP uses path vector.

1.3   BGP always advertises a shortest path.

1.4   BGP route advertisements use classless addressing.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1


---

<a id="page-2"></a>
**Page 2**

&emsp;2    Border Gateway Protocol<br>
&emsp;2   Interdomain vs Intradomain


![Figure on page 2](figures/questions-p02-fig01.png)

&emsp;Consider the four ASes in the diagram above. ASes Berkeley, Verizon, Stanford, and Comcast have border<br>
&emsp;routers B1, V1, S1, and C1 respectively, and internal routers B2, V2, S2, and C2 respectively.<br>
&emsp;Berkeley and Stanford both use Comcast’s and Verizon’s services. The (fake) cost metrics are 10/MB for<br>
&emsp;using Comcast’s bandwidth and 20/MB for using Verizon’s bandwidth.<br>
&emsp;Please answer the following questions with the assumption made in lecture: a border router establishes<br>
&emsp;iBGP sessions to all other routers within its AS.<br>
2.1   Which one of eBGP, iBGP, and IGP distributes externally learned routes internally, and which routers,<br>
&emsp;if any, speak it?

2.2   Which one of eBGP, iBGP, and IGP learns routes to external destinations, and which routers, if any,<br>
&emsp;speak it?

2.3   Which one of eBGP, iBGP, and IGP provides internal reachability, and which routers, if any, speak it?

2.4   Which AS would Berkeley use to reach Stanford, in terms of cost-effectiveness?

2.5   Given that Comcast now knows Berkeley and Stanford don’t get along with each other, it doesn’t<br>
&emsp;advertise its route of Berkeley to Stanford, or the other way around. However, Verizon remains neutral.<br>
&emsp;Which AS would Berkeley use to reach Stanford now?

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2


---

<a id="page-3"></a>
**Page 3**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Border Gateway Protocol    3<br>
&emsp;3   BGP<br>
&emsp;Consider the following configuration of autonomous systems and their relationships.


![Figure on page 3](figures/questions-p03-fig02.png)

&emsp;A square-triangle line indicates a provider-customer relationship, and a circle-circle line indicates a peer<br>
&emsp;relationship. We have two tier 1 providers (1 and 7).<br>
&emsp;Assume we are using the following selection and export rules for all ASes:<br>
&emsp;Selection: Prefer to send data through customers \> peers \> providers in order to minimize costs. Export:<br>
&emsp;To customers, advertise all paths. To all other ASes, advertise only paths to customers (and paths to your<br>
&emsp;own AS, of course).<br>
3.1   A user in AS 4 tries to send data to a friend in AS 5. What path (if any) would the data take to get to<br>
&emsp;the friend?

3.2   A user in AS 6 tries to send data to a friend in AS 5. What path (if any) would the data take to get to<br>
&emsp;the friend?

3.3   A user in AS 1 tries to send data to another user in AS 9. What path (if any) would the data take?

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3


---

<a id="page-4"></a>
**Page 4**

&emsp;4    Border Gateway Protocol


![Figure on page 4](figures/questions-p04-fig03.png)

&emsp;Now assume all autonomous systems are using the same selection policy but also adopting new export<br>
&emsp;rules because they are part of nation states in an information war. Autonomous systems ranging from 1<br>
&emsp;to 6 form a group of allies, and autonomous systems ranging from 7 to 10 form another group of allies:<br>
&emsp;Export:<br>
&emsp;(a) To a customer AS that is an ally, advertise all paths.<br>
&emsp;(b) To all other ASes that are allies, advertise only paths to customers.<br>
&emsp;(c) Advertise nothing to ASes that are not allies.<br>
3.4   A user in AS 6 tries to send data to their friend in AS 5. Will the friend receive the data?

3.5   Will a user in AS 9 be able to receive data from another in AS 1?

3.6   Imagine AS 10 set up a deal with AS 1 in which AS 1 is to act as a spy for AS 10′s alliance. AS 1 will<br>
&emsp;advertise all customer paths to AS 7. With this new agreement, AS 10 now wants to report its findings<br>
&emsp;to AS 5. Will the data be able to get from AS 10 to AS 5? If so, what path would the data take?

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4

