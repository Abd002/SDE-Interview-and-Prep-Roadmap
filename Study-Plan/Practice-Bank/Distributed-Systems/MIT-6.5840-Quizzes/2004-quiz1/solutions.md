# MIT 6.824/6.5840 2004: Quiz 1: Official solutions

> Copied from the original: <https://pdos.csail.mit.edu/6.824/quizzes.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**


![Figure on page 1](figures/solutions-p01-fig01.png)

&emsp;&emsp;Department of Electrical Engineering and Computer Science<br>
MASSACHUSETTS INSTITUTE OF TECHNOLOGY<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**6.824 Spring 2004**<br>
**Midterm Exam Answers**

The average score was 86, the standard deviation was 12.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1


---

<a id="page-2"></a>
**Page 2**

**I**   **Porcupine**

Consider the Porcupine e-mail server described in Manageability, availability and performance in Porcu-<br>
pine: a highly scalable, cluster-based mail service. The Porcupine User Map is a table that maps the hash<br>
of a user name to the identity of the server responsible for that user’s profile and fragment list. Porcupine<br>
uses code like this to find the host name of the server that is responsible for a user:

`int` `UserMapSize` `=` `20;`<br>
`String[]` `UserMap` `=` `new` `String[UserMapSize];`<br>
`//` `...`<br>
`String` `user2server(String` `username)` `{`<br>
`int` `h` `=` `username.hashCode();`<br>
`h` `=` `h` `%` `UserMap.length;` `//` `%` `is` `the` `modulo` `operator`<br>
`return` `UserMap[h];`<br>
`}`

&emsp;**points\]:\[101.**Suppose, by an amazing coincidence, all users’ names hashed to 13 modulo<br>
&emsp;UserMapSize. Compared to an even distribution of hashes, would this significantly reduce the rate at<br>
&emsp;which Porcupine could receive messages? Why or why not?<br>
&emsp;**Not significantly. It is true that one server would have to do all the lookups to find out where**<br>
&emsp;**users’ fragments and profiles were stored. But the load of storing and retrieving messages would**<br>
&emsp;**still be spread over all the servers. Figure 6 in the Porcupine paper shows that overall perfor-**<br>
&emsp;**mance is hardly affected by extreme imbalances in the hashing.**

Suppose that Porcupine didn’t have a User Map at all, but rather directly hashed the user name to decide<br>
which server to use. That is, suppose Porcupine numbered its N servers 0 through N-1 and used this code to<br>
decide which server was responsible for a user’s profile and fragment list:

`int` `user2server(String` `username)` `{`<br>
`int` `h` `=` `username.hashCode();`<br>
`int` `s` `=` `h` `%` `NServers;`<br>
`return` `s;`<br>
`}`

&emsp;**2. \[10 points\]:** Why might this scheme adversely affect Porcupine’s efficiency? Hint: think about<br>
&emsp;what would have to happen when a new server was added and NServers was increased.<br>
&emsp;**A new server would cause most of the user to server mappings to change, so that most fragment**<br>
&emsp;**lists and profiles would have to be copied from one server to another.**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2


---

<a id="page-3"></a>
**Page 3**

**II**   **Echo**

You’re using a workstation with files stored on an Echo file server, as described in A Coherent Distributed<br>
File Cache with Directory Write-Behind by Mann et al. Your workstation is named W1, your current<br>
directory is /d, and /d starts out with no files or subdirectories in it. You type commands which cause<br>
the following file system operations to occur, one at a time (this notation is the same as in Figures 4 through<br>
7 of the Echo paper):

`create(/d/f1)`<br>
`append(/d/f1,` `aa)`<br>
`create(/d/f2)`<br>
`append(/d/f2,` `bb)`<br>
`rename(/d/f2,` `/d/f3)`<br>
`append(/d/f3,` `cc)`<br>
`create(/d/f4)`<br>
`append(/d/f4,` `dd)`

You then read file f4 on W1 and observe that it contains “dd”. You stand up and leave, but as you walk away<br>
from the workstation you accidentally trip over W1’s power cord and unplug it, so it instantly stops. You<br>
walk over to workstation W2 (connected to the same Echo server) and look at the files in /d. During this<br>
whole time, no other user or process is modifying the file system, and there are no failures other than the<br>
crash of W1. The software has no bugs in it. Keeping in mind the guarantees stated in Section 3.1 of the<br>
Echo paper, answer the following questions about the possible states of the files in /d that you might see on<br>
W2.

&emsp;**3. \[2 points\]:** Is f4 guaranteed to exist (that is, to appear in the directory /d)? **No, since W1 might**<br>
&emsp;**not have written it from its write-back cache to the server before the crash.**

&emsp;**4. \[2 points\]:** If f4 exists, is f1 guaranteed to be non-empty? **No. Echo only guarantees ordering**<br>
&emsp;**for writes to the same object, and f1 and f4 are different objects.**

&emsp;**5. \[2 points\]:** If f4 exists, is f3 guaranteed to be non-empty? **Yes. The following individual orders**<br>
&emsp;**imply that Echo must send the contents of f2 to the server before sending the create of f4: the**<br>
&emsp;**rename “writes” f2 and must come after the append, and the create(/d/f4) “writes” /d and must**<br>
&emsp;**come after the rename.**

&emsp;**6. \[2 points\]:** Could f2 exist and contain exactly “bb”? **Yes. The workstation might have crashed**<br>
&emsp;**after it sent the append to the server, but before sending the rename.**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3


---

<a id="page-4"></a>
**Page 4**

&emsp;**\[2 points\]:7.**Could f2 exist and contain exactly “bbcc”? **No. Echo guarantees to send the**<br>
&emsp;**rename to the server before the append(/d/f3, cc): they both write f3, so Echo must order them.**<br>
Now suppose that you had been using an NFS server, as described in Design and Implementation of the Sun<br>
Network Filesystem, by Sandberg et al. You do all the same things, using a UNIX program that looks like<br>
this:

`fd1` `=` `creat("/d/f1",` `...);`<br>
`write(fd1,` `"aa",` `2);`<br>
`close(fd1);`<br>
`fd2` `=` `creat("/d/f2",` `...);`<br>
`write(fd2,` `"bb",` `2);`<br>
`close(fd2);`<br>
`rename("/d/f2",` `"/d/f3");`<br>
`fd3` `=` `open("/d/f3",` `...,` `O_APPEND);`<br>
`write(fd3,` `"cc");`<br>
`close(fd3);`<br>
`fd4` `=` `creat("/d/f4",` `...);`<br>
`write(fd4,` `"dd",` `2);`<br>
`close(fd4);`<br>
Again, you read f4 and observe that it contains “dd”, accidentally unplug W1’s power, and look at /d on W2.<br>
Based on the design and implementation described in the NFS paper, answer these questions about the state<br>
of the files in /d as seen on workstation W2.

&emsp;**8.**   **\[2 points\]:**   Is f4 guaranteed to exist? **Yes. The NFS paper does not mention any write-**<br>
&emsp;**behind or caching for directory modifications, so the client must send the CREATE RPC to the**<br>
&emsp;**server. Furthermore, the paper says that close() does not return until the server acknowledges**<br>
&emsp;**all WRITEs, and the WRITE RPCs cannot be issued until the CREATE has returned because**<br>
&emsp;**the WRITE needs to know the file handle.**

&emsp;**9. \[2 points\]:** If f4 exists, is f1 guaranteed to be non-empty? **Yes. The program doesn’t create f4**<br>
&emsp;**until close(fd1) returns, which guarantees that the server knows about the write to f1.**

&emsp;**10.**   **\[2 points\]:**   If f4 exists, is f3 guaranteed to be non-empty? **Yes, for the same reason as the**<br>
&emsp;**previous question.**

&emsp;**11. \[2 points\]:** Could f2 exist and contain exactly “bb”? **No. The fact that the program finished**<br>
&emsp;**means that the rename and write of “cc” completed.**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4


---

<a id="page-5"></a>
**Page 5**

&emsp;**12. \[2 points\]:** Could f2 exist and contain exactly “bbcc”? **No, for similar reasons as the previous**<br>
&emsp;**question.**

&emsp;**13.**   **\[8 points\]:**   Outline a simple scenario in which a client using Echo would likely experience<br>
&emsp;much better performance than a client using NFS.<br>
&emsp;**A single client that repeatedly opens, overwrites, and closes the same file. Creation and writing**<br>
&emsp;**of a series of distinct files probably doesn’t run much faster in Echo than in NFS because in the**<br>
&emsp;**end the Echo client does have to send the data to the server, though it is true that Echo avoids**<br>
&emsp;**stalling the application in each close().**

Now suppose that you had been using a workstation with a local disk using the FSD file system, as described<br>
in Reimplementing the Cedar File System Using Logging and Group Commit, by Hagmann. Note that FSD<br>
is a local disk file system; there is no network and no server. You perform the same operations as in the<br>
Echo scenario, including reading f4 and seeing that it contains “dd”, and then you accidentally unplug the<br>
workstation’s power cord. You’re very agile and the whole sequence takes only about half a second. You<br>
plug the workstation back in, it reboots, it runs the FSD recovery program, and you then look at the files in<br>
/d.

&emsp;**14. \[2 points\]:** Is f4 guaranteed to exist? **No. FSD might not have written that part of the the**<br>
&emsp;**in-memory log to disk yet.**

&emsp;**15.**   **\[2 points\]:**   If f4 exists, is f1 guaranteed to be non-empty? **Yes. FSD file data writes are**<br>
&emsp;**synchronous, so f1’s contents are guaranteed to be on the disk before the log records for the**<br>
&emsp;**creation of f1 or f4.**

&emsp;**16. \[2 points\]:** If f4 exists, is f3 guaranteed to be non-empty? **Yes, for much the same reason as**<br>
&emsp;**the previous question.**

&emsp;**17.**   **\[2 points\]:**   Could f2 exist and contain exactly “bb”? **No. f2 could still exist, because the**<br>
&emsp;**rename log entry might not have been written to disk before the crash. But since file data writes**<br>
&emsp;**are synchronous, the “cc” must have been written to disk, so if f2 (or f3) exists it must contain**<br>
&emsp;**“bbcc”.**

&emsp;**18. \[2 points\]:** Could f2 exist and contain exactly “bbcc”? **Yes.**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;5


---

<a id="page-6"></a>
**Page 6**

**19. \[2 points\]:**Could both f2 and f3 exist? **No. The paper explains that much of the point of**<br>
**using the log was to ensure atomic operations on the file name table.**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;6


---

<a id="page-7"></a>
**Page 7**

**III**   **Tamper-Evident Boot**

Alyssa P. Hacker operates the YETI@home project, a giant distributed Internet computation whose goal is<br>
to simulate the behavior of the hypothetical Yeti (a giant ape-like creature) in order to guess where on Earth<br>
it might be found. Alyssa’s basic approach is to divide her simulations into small pieces and farm them out<br>
to legions of Internet enthusiasts who are running her application on their home PCs. When a participating<br>
machine finishes its piece of the simulation, it reports its result back to Alyssa’s central server and fetches<br>
a new unit of work. Alyssa’s server keeps track of which participants perform the most work, and posts the<br>
names of winners on her web site.<br>
Sadly, Alyssa finds that some participants are cheating, apparently by modifying their copy of her software<br>
to return a random result to her server, without actually doing the computation. Alyssa has no way to<br>
check the correctness of the reported results, other than doing the computation herself, which would be too<br>
time-consuming.<br>
Alyssa searches the Computer Science research literature looking for a potential solution. She reads about<br>
XOM (in Architectural Support for Copy and Tamper Resistant Software), which seems like it might be able<br>
to solve her problem. However, no actual XOM hardware exists, the design seems complex enough that<br>
such hardware might be a long time coming, and besides Alyssa only needs to be able to detect whether her<br>
application has been tampered with; she doesn’t need copy protection. Furthermore, Alyssa doesn’t need a<br>
tremendously high level of security: she just wants to raise the level of effort required for a participant to<br>
send in a fake result.<br>
Alyssa invents what she calls “Tamper-Evident Boot.” She believes that it will help her solve her problem,<br>
and she thinks that her design will be easy to deploy because it involves no changes to existing PC CPUs<br>
and just a few simple additions to PC motherboard designs.<br>
Here’s Alyssa’s hardware architecture:

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`|-----|`   `|--` `ROM` `with` `boot` `code`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`|` `CPU` `|-------|`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`|-----|`   `|`   `|--` `DRAM,` `disk,` `network`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`|`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`|`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`|--` `Magic` `Register`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`|`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`|`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`|--------------|`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`|`   `Secure`   `|`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`|` `Co-processor` `|`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`|`   `|`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`|` `private` `key,` `|`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`|` `certificate`   `|`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`|--------------|`

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;7


---

<a id="page-8"></a>
**Page 8**

This is a component view of a motherboard. The CPU is an ordinary CPU chip, such as an Intel Pentium.<br>
The connection to the DRAM and boot ROM is an ordinary memory/device bus. Alyssa’s design adds two<br>
new devices to the motherboard, connected to the bus.<br>
The Magic Register holds 160 bits of data (the size of the output of a typical cryptographic hash), but the<br>
CPU can write it only once after each power cycle or reset. That is, the Magic Register contains a flag; the<br>
flag is cleared to zero after a reset or power cycle, the Magic Register sets the flag to one after a write, and<br>
the Magic Register ignores writes if the flag is already equal to one. The CPU can read the Magic Register<br>
at any time.<br>
The Secure Co-processor is a simple microprocessor chip that contains public-key algorithms, a private key,<br>
and a certificate. All of the Secure Co-processor’s code is in a read-only memory inside the co-processor<br>
chip. The private key is stored inside the co-processor in a way that’s difficult for anything but the co-<br>
processor’s software to read. The manufacturer gives every Secure Co-processor a unique private/public<br>
key pair and a certificate. The certificate is signed by the manufacturer’s private key, and includes the<br>
co-processor’s public key; we’ll assume that the manufacturer’s public key is well known.<br>
The Secure Co-processor supports just one operation: the CPU can send it some data over the device bus, and<br>
the Co-processor will return a copy of the data and and its certificate and the contents of the Magic Register,<br>
signed by the Secure Co-processor’s private key. That is, the Co-processor implements this function for the<br>
CPU:

`attest(data)` `{`<br>
`struct` `scp_msg` `scpm;`<br>
`scpm.cpu_data` `=` `data;`<br>
`scpm.register` `=` `Magic` `Register` `contents;`<br>
`scpm.cert` `=` `co-processor’s` `certificate;`<br>
`scpm.signature` `=` `Sign(scpm,` `co-processor’s` `private` `key);`<br>
`return` `scpm;`<br>
`}`

Alyssa’s intent is to persuade computer manufacturers like Dell to include her new hardware in every PC.<br>
She believes this hardware can solve a wide range of security problems at minimal expense.<br>
Alyssa is not trying to defend against attackers who modify the hardware or extract the private key from<br>
the co-processor. We’ll assume for all questions below that no-one has modified any hardware or stolen any<br>
private keys.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;8


---

<a id="page-9"></a>
**Page 9**

&emsp;**20. \[10 points\]:** Suppose that software running on a PC with Tamper-Evident Boot calls attest(“I’ve<br>
&emsp;correctly computed YETI@home result XYZ”) and sends the resulting signed message to Alyssa’s<br>
&emsp;server. The server observes that the signature on the message matches the public key in the certificate,<br>
&emsp;and that the manufacturer’s signature on the certificate is correct. On the basis of the contents of<br>
&emsp;the message and these signature checks, is it reasonable for Alyssa’s server to believe that XYZ is a<br>
&emsp;correct YETI@home result? Briefly outline why or why not.<br>
&emsp;**No. Any program running on Alyssa’s hardware might have produced this message and in-**<br>
&emsp;**cluded an incorrect result; there’s no reason to believe the creator of the message was her appli-**<br>
&emsp;**cation.**

&emsp;**21. \[10 points\]:** Is it reasonable for Alyssa’s server to believe that the message was generated by a<br>
&emsp;PC with Alyssa’s hardware? Briefly outline why or why not.<br>
&emsp;**Yes. Only a Secure Co-processor could produce a signature with a key certified by the manu-**<br>
&emsp;**facturer. (You have to believe that no-one has compromised any Secure Co-processors in order**<br>
&emsp;**to believe this, but we’re assuming no hardware attacks.)**

Here’s how Alyssa intends the hardware to be used to implement Tamper-Evident boot. Every motherboard<br>
comes with a read-only memory (ROM) that holds some boot code provided by the manufacturer. The CPU<br>
starts executing the instructions in this ROM after a power-cycle or reset. The job of the boot code is to read<br>
the operating system from the hard disk into main memory, and then jump into the operating system to start<br>
executing it. Alyssa’s boot ROM does one extra step before entering the operating system: it computes a<br>
cryptographic hash of the entire operating system it just loaded from the disk, and stores that hash into the<br>
Magic Register.<br>
Alyssa intends to modify the operating system software to provide a new os   attest() system call to applica-<br>
tions. os   attest() takes an argument with application-supplied data, and causes the Secure Co-processor to<br>
sign that data along with a cryptographic hash that the kernel computes over the application’s executable<br>
file:

`os_attest(data)` `{`<br>
`struct` `os_msg` `osm;`<br>
`osm.app_data` `=` `data;`<br>
`osm.app_hash` `=` `cryptographic_hash(application’s` `original` `executable` `file);`<br>
`return` `attest(osm);`<br>
`}`

The operating system would instruct the CPU hardware to prevent applications from using the attest() func-<br>
tionality of the Secure Co-processor device.<br>
When Alyssa’s server receives a message, it checks that scpm.cert is correctly signed by the manufacturer,<br>
that scpm.signature is correctly signed by the public key in the certificate, that scpm.register is the hash of<br>
an “approved operating system,” and that osm.app   hash is the hash of Alyssa’s application.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;9


---

<a id="page-10"></a>
**Page 10**

**22. \[10 points\]:** What are the key properties an operating system would have to have in order that<br>
it be reasonable for Alyssa’s server to consider an “approved operating system?”<br>
**If a given executable file’s hash appears in osm.app**   **hash, then the operating system should**<br>
**ensure that osm.app**   **data is from an undisturbed execution of that executable file. This is a**<br>
**pretty broad requirement, but example properties might include preventing applications from**<br>
**calling attest() directly and giving each application its own protected address space using virtual**<br>
**memory.**

**23.**   **\[10 points\]:**   Suppose that the Magic Register did not reject all but the first write after each<br>
reboot or reset; that is, suppose that it allowed any number of writes at any time. What new attacks<br>
would be easy to perform as a result of this change?<br>
**A non-approved operating system could write the hash of an approved operating system to the**<br>
**Magic Register, and then ask the Secure Co-processor to sign messages that claimed to be from**<br>
**“correct” executions of Alyssa’s application.**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;End of Exam

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;10


---

<a id="page-11"></a>
**Page 11**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**6.824 Questionnaire**

We’d like to ask you for feedback to help us make the course better, both for the rest of this semester and in<br>
future years. Feel free to tear off this page and hand it in separately from the exam for anonymity.<br>
If you could change one thing about 6.824 to make it better, what would it be?<br>
**Get the paper questions out on time.**<br>
What’s your favorite aspect of 6.824? That is, what shouldn’t we change?<br>
**The labs.**<br>
What could we do to make the paper discussions more informative and useful?<br>
**Introduce each paper, and cut off lengthy argument over uninteresting details.**<br>
Any other suggestions about the labs, lectures, TA, choice of papers, or projects?<br>
**Fewer disk file-system papers. Fewer Network Objects papers.**

