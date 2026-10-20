# Cambridge Computer Science Tripos 2015, Paper 5, Question 8: Questions

> Copied from the original: <https://www.cl.cam.ac.uk/teaching/exams/pastpapers/y2015p5q8.pdf>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

**COMPUTER SCIENCE TRIPOS Part IB – 2015 – Paper 5**

**8**   **Concurrent and Distributed Systems (RNW)**

&emsp;(a) (i)   Define the term capability.   \[2 marks\]

&emsp;&emsp;&emsp;(ii) What two fields must RBAC-based ACL entries always contain? \[2 marks\]

&emsp;(b)   Network-Attached Secure Disks (NASD) utilise file managers and block servers.<br>
&emsp;&emsp;&emsp;File-manager RPCs exchange an authorised user ID, password, and object ID<br>
&emsp;&emsp;&emsp;for a keyed cryptographic capability granting block access: f(k, ObjID, rights).

&emsp;&emsp;&emsp;(i)   Describe the consequences of a user learning the value of key k.   \[2 marks\]

&emsp;&emsp;&emsp;(ii) Alice obtains a capability for object Oi. Bob then issues an RPC to the file<br>
&emsp;&emsp;&emsp;&emsp;&emsp;manager revoking Alice’s access to Oi. Describe what occurs when Alice<br>
&emsp;&emsp;&emsp;&emsp;&emsp;performs her next block-server read on Oi.   \[2 marks\]

&emsp;&emsp;&emsp;(iii) Explain why it might be desirable, from a security perspective, to add a<br>
&emsp;&emsp;&emsp;&emsp;&emsp;timeout field t, protected by the keyed hash, to the capability.   \[2 marks\]

&emsp;&emsp;&emsp;(iv) Developers extend NASD to support Quorum-replicated block servers.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;What new failure mode may arise during a Quorum block write, relative to<br>
&emsp;&emsp;&emsp;&emsp;&emsp;unmodified NASD capabilities, in adding capability timeouts?   \[2 marks\]

&emsp;(c)   The Andrew File System (AFS) is authenticated and encrypted using Kerberos;<br>
&emsp;&emsp;&emsp;ACLs expressing positive and negative rights for users and groups. Multiuser<br>
&emsp;&emsp;&emsp;AFS clients (e.g., UNIX servers) build a secure RPC connection for each local<br>
&emsp;&emsp;&emsp;user, authenticated with their Kerberos ticket, and issue RPCs (e.g., file **read**)<br>
&emsp;&emsp;&emsp;on their behalf only via their own connection. If no suitable Kerberos ticket is<br>
&emsp;&emsp;&emsp;available (e.g., the ticket has expired, the user has destroyed their ticket, or a<br>
&emsp;&emsp;&emsp;job is running unattended), then an insecure connection is used instead.

&emsp;&emsp;&emsp;(i)   The group system:anyuser holds the union of unauthenticated (anonymous)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;users and all authenticated users. Explain why an ACL granting read access<br>
&emsp;&emsp;&emsp;&emsp;&emsp;to system:anyuser via a positive entry, but denying read access to user rnw<br>
&emsp;&emsp;&emsp;&emsp;&emsp;via an overriding negative entry, might prove problematic.   \[2 marks\]

&emsp;&emsp;&emsp;(ii) Describe the consequences to AFS authentication and authorisation of a<br>
&emsp;&emsp;&emsp;&emsp;&emsp;malicious local user gaining root access on a multiuser client.   \[2 marks\]

&emsp;&emsp;&emsp;(iii) An AFS client uses the unauthenticated Network Time Protocol (NTP)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;to synchronise its clock with the AFS server. Attacker Mallory is able to<br>
&emsp;&emsp;&emsp;&emsp;&emsp;inspect, drop, and insert packets between the AFS client and server (e.g.,<br>
&emsp;&emsp;&emsp;&emsp;&emsp;by controlling a network switch). Describe an attack that allows Mallory<br>
&emsp;&emsp;&emsp;&emsp;&emsp;to inject malicious content into the client’s AFS cache, but that does not<br>
&emsp;&emsp;&emsp;&emsp;&emsp;allow Mallory to write content directly to the AFS server.   \[4 marks\]

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1

