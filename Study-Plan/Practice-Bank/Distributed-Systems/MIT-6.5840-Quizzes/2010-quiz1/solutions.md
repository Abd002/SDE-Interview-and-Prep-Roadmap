# MIT 6.824/6.5840 2010: Quiz 1: Official solutions

> Copied from the original: <https://pdos.csail.mit.edu/6.824/quizzes.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**


![Figure on page 1](figures/solutions-p01-fig01.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Department of Electrical Engineering and Computer Science<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;MASSACHUSETTS INSTITUTE OF TECHNOLOGY

&emsp;&emsp;&emsp;&emsp;&emsp;**6.824 Distributed System Engineering: Spring 2010**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Quiz I Solutions**

&emsp;All problems are open-ended questions. In order to receive credit you must answer the question<br>
&emsp;as precisely as possible. You have 80 minutes to answer this quiz.<br>
&emsp;Write your name on this cover sheet AND at the bottom of each page of this booklet.<br>
&emsp;Some questions may be much harder than others. Read them all through first and attack them in<br>
&emsp;the order that allows you to make the most progress. If you find a question ambiguous, be sure<br>
&emsp;to write down any assumptions you make. Be neat. If we can’t understand your answer, we can’t<br>
&emsp;give you credit!

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**THIS IS AN OPEN BOOK, OPEN NOTES QUIZ.**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**I (xx/26)**   **II (xx/21)**   **III (xx/49)**   **IV (xx/4)**   **Total (xx/100)**

**Name:**


---

<a id="page-2"></a>
**Page 2**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Grade histogram for Quiz 1


![Figure on page 2](figures/solutions-p02-fig02.png)

6

5

4

3

2

1

0<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;96-100<br>
&emsp;&emsp;&emsp;91-9586-9081-8576-8071-7566-7061-6556-6051-5546-5041-4536-4031-3526-3021-2516-2011-15<br>
&emsp;6-10<br>
1-5

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;max   =   92<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;median   =   66<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;µ   =   66.0<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;σ   =   12.2


---

<a id="page-3"></a>
**Page 3**

6.824 SPRING 2010, Quiz 1   **Page 3 of 12**

**I**   **YFS**

Working on Lab 4, Ben Bitdiddle adds a create function to his YFS client; the function is responsible for<br>
creating files. Ben wants to use multiple YFS clients so he also adds locking to his YFS client code. He uses<br>
a lock per inode and wraps each YFS client function with a call to the lock client’s acquire and release<br>
passing the inode’s inum as the argument. Here are some excerpts from yfs client.cc (error checking code<br>
omitted):<br>
yfs\_client::inum yfs\_client::ilookup(inum di, std::string name)<br>
{<br>
std::string buf;<br>
yfs\_client::inum inum = 0;<br>
lc-\>acquire(di);<br>
ec-\>get(di, buf);<br>
... // parse buf and set inum if file found<br>
lc-\>release(di);<br>
return inum;<br>
}

int yfs\_client::create(inum di, std::string name, inum ci)<br>
{<br>
std::string buf;<br>
lc-\>acquire(di);<br>
lc-\>acquire(ci);<br>
ec-\>get(di, buf);<br>
... // add (name, ci) pair to buf<br>
ec-\>put(di, buf);<br>
ec-\>put(ci, "");<br>
lc-\>release(di);<br>
lc-\>release(ci);<br>
return OK;<br>
}

And from fuse.cc:<br>
yfs\_client::status fuseserver\_createhelper(fuse\_ino\_t parent,<br>
&emsp;const char \*name, mode\_t mode, struct fuse\_entry\_param \*e)<br>
{<br>
e-\>ino = yfs-\>ilookup(parent, name);<br>
if (e-\>ino == 0) {<br>
&emsp;e-\>ino = random() \| 0x80000000;<br>
&emsp;yfs-\>create(parent, name, e-\>ino);<br>
}<br>
getattr(e-\>ino, e-\>attr);<br>
e-\>attr\_timeout = 0.0;<br>
e-\>entry\_timeout = 0.0;<br>
return OK;<br>
}

**Name:**


---

<a id="page-4"></a>
**Page 4**

6.824 SPRING 2010, Quiz 1   **Page 4 of 12**

&emsp;**1. \[8 points\]:** To Ben’s surprise his implementation fails the standard tests given by the 6.824 staff.<br>
&emsp;Describe a test on which Ben’s program will fail? How can Ben fix his code to ensure that his code<br>
&emsp;passes the tests?<br>
&emsp;**Answer:** If multiple threads are concurrently creating the same file in the same directory then it<br>
&emsp;is possible for fuseserver createhelper to create multiple files with the same name in the<br>
&emsp;directory. The following interleaving of instructions demonstrates the problem:

&emsp;Thread 1   Thread 2<br>
&emsp;e-\>ino = yfs-\>ilookup(parent,<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;name);<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;e-\>ino = yfs-\>ilookup(parent, name);<br>
&emsp;e-\>ino == 0 so execute:<br>
&emsp;yfs-\>create(parent, name,<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;e-\>ino);<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;e-\>ino == 0 so execute:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;yfs-\>create(parent, name, e-\>ino);

&emsp;To fix this,**Answer:**Ben needs to make the calls to yfs client::ilookup and<br>
&emsp;yfs client::create atomic in fuseserver createhelper. One way to do this is to cre-<br>
&emsp;ate a yfs client::ilookup wo function that is exactly like yfs client::ilookup but does<br>
&emsp;not take out any locks and have yfs client::create check, while holding the di lock, if the<br>
&emsp;file exists using yfs client::ilookup wo.

**Name:**


---

<a id="page-5"></a>
**Page 5**

6.824 SPRING 2010, Quiz 1   **Page 5 of 12**

In another attempt at correctness, Ben modifies his code in yfs client.cc as follows:

yfs\_client::inum yfs\_client::ilookup(inum di, std::string name)<br>
{<br>
std::string buf;<br>
yfs\_client::inum inum = 0;<br>
lc-\>acquire(di);   // \<------------------ B<br>
ec-\>get(di, buf);<br>
... // parse buf and set inum if file found<br>
lc-\>release(di);<br>
return inum;<br>
}

int yfs\_client::create(inum di, std::string name, inum &ci)<br>
{<br>
std::string buf;<br>
lc-\>acquire(di);   // \<------------------ A<br>
ci = ilookup(di, name);<br>
if (ci == 0) {<br>
&emsp;lc-\>acquire(ci);<br>
&emsp;ci = random() \| 0x80000000;<br>
&emsp;ec-\>get(di, buf);<br>
&emsp;... // add (name, ci) pair to buf<br>
&emsp;ec-\>put(di, buf);<br>
&emsp;ec-\>put(ci, "");<br>
&emsp;lc-\>release(ci);<br>
}<br>
lc-\>release(di);<br>
return OK;<br>
}

And in fuse.cc:<br>
yfs\_client::status fuseserver\_createhelper(fuse\_ino\_t parent,<br>
&emsp;const char \*name, mode\_t mode, struct fuse\_entry\_param \*e)<br>
{<br>
yfs-\>create(parent, name, e-\>ino);<br>
getattr(e-\>ino, e-\>attr);<br>
e-\>attr\_timeout = 0.0;<br>
e-\>entry\_timeout = 0.0;<br>
return OK;<br>
}

**Name:**


---

<a id="page-6"></a>
**Page 6**

6.824 SPRING 2010, Quiz 1   **Page 6 of 12**

&emsp;**2. \[6 points\]:** To his surprise his code still does not work; his code fails to create a file. What is the<br>
&emsp;problem and how can he fix it?<br>
&emsp;**Answer:** The code will deadlock because a lock for di will be taken on the line labeled A and then<br>
&emsp;the call to ilookup will take out the lock for di again on the line labeled B.<br>
&emsp;One way to fix this is to create a yfs client::ilookup wo function that is exactly like<br>
&emsp;yfs client::ilookup but does not take out any locks and have yfs client::create call<br>
&emsp;yfs client::ilookup wo instead of yfs client::ilookup.

Now Ben wants to simplify YFS by expanding the extent protocol from get, put, and remove to read,<br>
write, truncate, create, lookup, etc. Every file system operation (i.e., each fuse operation) will be<br>
handled by the extent server. The YFS client will be a proxy for the extent server.

&emsp;**3. \[6 points\]:** What are the advantages of executing the file system operations on the extent server?<br>
&emsp;Which functions/features can he remove from YFS using this scheme?<br>
&emsp;**Answer:** Executing all the file system operations on one server means that there is no longer any need<br>
&emsp;to have a lock server and the YFS clients do not have to worry about making calls to the lock server.<br>
&emsp;The extent server can use Pthread mutexes to lock critical sections.

&emsp;**4. \[6 points\]:** What are disadvantages of moving the file system operations out of the YFS client<br>
&emsp;and into the extent server?<br>
&emsp;**Answer:** Since one single machine handles all file system requests from all clients, the system pro-<br>
&emsp;posed by Ben will not be scalable. Even though the number of clients can grow, the processing ca-<br>
&emsp;pacity of the single extent server will remain constant. Ben’s scheme does not exploit the processing<br>
&emsp;capacity of the client machines to execute file operations.

**Name:**


---

<a id="page-7"></a>
**Page 7**

6.824 SPRING 2010, Quiz 1   **Page 7 of 12**

**II**   **Short questions**

&emsp;**5.**   **\[7 points\]:** An invocation o1.f(o2) on an RMI object o1 takes another RMI object o2 as an<br>
&emsp;argument. The method f may invoke a method on o2. The server executing f, however, may not<br>
&emsp;have heard about o2 before. How does Java RMI arrange that f can invoke a method on o2? What<br>
&emsp;information is in o2’s handle? Why is that enough for the runtime to do its job?<br>
&emsp;**Answer:** A reference to o2 is passed to the server executing f. This reference contains the URI of<br>
&emsp;o2 which consists of the host machine identifier (IP address or host name) and the object ID. The<br>
&emsp;URI allows the server executing f to uniquely name and find where o2 resides. In addition, the JVM<br>
&emsp;provides dynamic code loading which allows stubs to be dynamically loaded into the runtime; the<br>
&emsp;server executing f need not know anything about o2 prior to executing f.

&emsp;**6.**   **\[7 points\]:** Both TreadMarks and Tra use version vectors to maintain consistency, but Ivy as<br>
&emsp;described in Section 3.1 of the paper doesn’t. What in Ivy’s design allows it to avoid using version<br>
&emsp;vectors?<br>
&emsp;**Answer:** Ivy has a central server (the manager) that handles and serializes all requests and all data<br>
&emsp;movement. For writes, the manager ensures that all readers of a pages respond to the invalidation<br>
&emsp;request and arranges the movement of data to the writer before allowing the write to proceed. When<br>
&emsp;the writer receives the data, it knows that it has received the most recent version and no checks<br>
&emsp;requiring version vectors are necessary.

&emsp;**7. \[7 points\]:** Bayou cannot guarantee the order in which writes are committed is consistent with<br>
&emsp;the tentative order indicated by their timestamps. Using the calendar application, give a scenario with<br>
&emsp;a few devices synchronizing with each other that shows the committed order being different from the<br>
&emsp;tentative order.<br>
&emsp;**Answer:** Three devices (A, B, and C) need to be used to create such a scenario. All three devices<br>
&emsp;choose to schedule an appointment for 10am with 11am and 12pm as alternatives. The conflict reso-<br>
&emsp;lution procedure for all three devices is to choose 11am if 10am is not available and 12pm if 11am is<br>
&emsp;not available. First, A synchronizes with B; the tentative order is A getting the 10am slot and B the<br>
&emsp;11am slot. Second, C synchronize with the primary and permanently gets the 10am slot. Finally, A<br>
&emsp;synchronizes with the master and the final order will be C with the 10am slot, A with the 11am slot<br>
&emsp;and B with the 12pm slot.

**Name:**


---

<a id="page-8"></a>
**Page 8**

6.824 SPRING 2010, Quiz 1   **Page 8 of 12**

**III**   **Locking and consistency**

Alice P. Hacker wants to understand consistency better and explores it with an application, namely a par-<br>
allel program for solving the traveling salesman problem (TSP). She starts with the following sequential C<br>
program with a standard branch-and-bound algorithm:

// matrix that records for each town the distance "dis" to "totown"<br>
struct dist {<br>
&emsp;&emsp;&emsp;int totown;<br>
&emsp;&emsp;&emsp;int dis;<br>
} distance\[NRTOWNS\]\[NRTOWNS\] =   {<br>
#include "g.h"<br>
};

int path\[NRTOWNS\];   // the path tsp is working on<br>
int best\_path\[NRTOWNS\];// the shortest path found so far<br>
int min = 10000;   // length of the shortest path

// l is the number of cities on path<br>
// len is the length of the path<br>
tsp(l,len)<br>
{<br>
&emsp;&emsp;&emsp;int e,me,i;

&emsp;&emsp;&emsp;if (len \>= min)   // prune?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;return;<br>
&emsp;&emsp;&emsp;if (l == NRTOWNS-1) {   // found a shorter path?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;min = len;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;for (i = 0; i \< NRTOWNS; i++) best\_path\[i\] = path\[i\];<br>
&emsp;&emsp;&emsp;} else {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;me = path\[l\];<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;for (i=0; i \< NRTOWNS; i++) {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;e = distance\[me\]\[i\].totown;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;if (!present(e,l)) {   // if e is not on path, branch<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;path\[l+1\] = e;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;tsp(l+1, len + distance\[me\]\[i\].dis);<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;}<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;}<br>
&emsp;&emsp;&emsp;}<br>
}

Alice runs the program by invoking tsp(0,0), which computes shortest path starting with city 0 (i.e.,<br>
path\[0\] is 0). In the first invocation of tsp, tsp extends the path through all neighbors of 0, and for<br>
each neighbor it invokes itself recursively. If the path has a length larger than the length of the best path<br>
found so far, an invocation returns and doesn’t explore that path further, pruning the search.

**Name:**


---

<a id="page-9"></a>
**Page 9**

6.824 SPRING 2010, Quiz 1   **Page 9 of 12**

She parallelizes the program for a cache-coherent shared-memory multiprocessor. The parallel program first<br>
creates many jobs, each job consists of a partial path with 4 different cities on it. Once the program is done<br>
creating jobs, each processor invokes the following procedure worker:

struct job {<br>
int path\[NRTOWNS\];<br>
} jobs\[NJOBS\]<br>
jobindex = 0;

worker() {<br>
int myj;<br>
while (jobindex \< NJOBS) {<br>
&emsp;myj = jobindex++;<br>
&emsp;path = jobs\[myj\].path   // copy the job’s partial path in my path<br>
&emsp;tsp(4, len(path))<br>
}<br>
}

Each worker repeatedly grabs the next uncompleted job and invokes tsp to try to extend the path to a<br>
complete path. Each processor has its own copy of path, but jobs, jobindex, min, and best path<br>
are globally shared variables.

&emsp;**8. \[7 points\]:** Rewrite the procedure worker with locks so that this program will work correctly.<br>
&emsp;**Answer:** Both the reading and the writing of jobindex must be protected. One way of doing that<br>
&emsp;is as follows:

&emsp;lock jobi\_lock;

&emsp;worker() {<br>
&emsp;&emsp;int myj;<br>
&emsp;&emsp;acquire(jobi\_lock);<br>
&emsp;&emsp;while (jobindex \< NJOBS) {<br>
&emsp;&emsp;&emsp;myj = jobindex++;<br>
&emsp;&emsp;&emsp;release(jobi\_lock);<br>
&emsp;&emsp;&emsp;path = jobs\[myj\].path   // copy the job’s partial path in my path<br>
&emsp;&emsp;&emsp;tsp(4, len(path))<br>
&emsp;&emsp;&emsp;acquire(jobi\_lock);<br>
&emsp;&emsp;}<br>
&emsp;&emsp;release(jobi\_lock);<br>
&emsp;}

**Name:**


---

<a id="page-10"></a>
**Page 10**

6.824 SPRING 2010, Quiz 1   **Page 10 of 12**

&emsp;**9. \[9 points\]:** Annotate/modify the procedure tsp on the previous page with read/write locks for the<br>
&emsp;shared variable min so that the parallel program will work correctly. (Read/write locks have an extra<br>
&emsp;argument for acquire that says whether to grab the lock in read mode or write mode. If the lock is<br>
&emsp;acquired in read mode, other processors can also acquire it in read mode, but a processor acquiring in<br>
&emsp;write mode will be delayed until all readers have released their lock.)<br>
&emsp;**Answer:** The reading and writing of min must be protected, but care must be taken when writing<br>
&emsp;min: min may only be written if the value being written is smaller than the original value of min. In<br>
&emsp;other words, the check of len \>= min and the write to min must be atomic. There are two ways<br>
&emsp;to accomplish this: 1) upgrading a read-write lock; or 2) rechecking. A holder of a read-write lock in<br>
&emsp;read mode can upgrade from read to write mode—a lock upgrade guarantees that no other thread is<br>
&emsp;holding the same lock in read mode and that no other thread had the lock in write mode between the<br>
&emsp;read and the upgrade. An alternative solution is to to recheck min before it is modified to make sure<br>
&emsp;it is still smaller than len. The code for the upgrade solution is as follows:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;acquire(min\_lock, READ);<br>
&emsp;&emsp;&emsp;&emsp;&emsp;if (len \>= min)   // prune?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;release(min\_lock):<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;return;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;if (l == NRTOWNS-1) {   // found a shorter path?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;acquire(min\_lock, WRITE); // This is the upgrade<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;min = len;<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;for (i = 0; i \< NRTOWNS; i++) best\_path\[i\] = path\[i\];<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;release(min\_lock);<br>
&emsp;&emsp;&emsp;&emsp;&emsp;} else {<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;release(min\_lock);

&emsp;**10. \[5 points\]:** Why is it better to use read/write locks instead of locks that don’t distinguish between<br>
&emsp;read and write modes? Will the TSP program run faster or slower with read/write locks and why?<br>
&emsp;**Answer:** A read/write lock allows multiple threads to execute read-only critical sections in parallel;<br>
&emsp;a regular lock would serialize the execution of all critical sections. TSP will run faster, because tsp<br>
&emsp;reads min much more often than writing it, and those reads can now proceed in parallel.

Assume that you annotated all shared variables (including, for example, best path) with locks and that<br>
the program functions correctly on a cache-coherent shared-memory multiprocessor.<br>
Alice notices that the Athena clusters are seldom used and together they have many more free processors<br>
than her shared-memory multiprocessor. She installs TreadMarks and runs the parallel program on it. She<br>
runs TreadMarks with lazy release consistency.

&emsp;**11. \[7 points\]:** Will the program compute the correct answer? (Briefly explain your answer.)<br>
&emsp;**Answer:** Yes, the program is appropriately labeled with locks. A properly labeled program on release-<br>
&emsp;consistent memory executes with the same behavior as on a sequentially-consistent memory.

**Name:**


---

<a id="page-11"></a>
**Page 11**

6.824 SPRING 2010, Quiz 1   **Page 11 of 12**

Alice observes that the performance on TreadMarks isn’t great, because each invocation of the procedure<br>
tsp must take out a lock to read min. To reduce this overhead, she changes the program as follows. He<br>
modifies the program to use two mins, one per processor (pmin) and one shared (min, as before). Before<br>
a worker invokes tsp, it copies the shared min into the per processor pmin. She modifies tsp to read the<br>
per processor pmin at the pruning line. Also, when tsp finds a shorter path, he modifies tsp to read the<br>
shared min and if the shared min is larger than pmin, he updates the shared min.

&emsp;**12. \[7 points\]:** Will the program compute the correct answer on TreadMarks? (Briefly explain your<br>
&emsp;answer.)<br>
&emsp;**Answer:** Yes, even though the program is not properly labeled. A processor may update min while<br>
&emsp;other processors may keep using pmin, which now contains a stale value. However, that doesn’t<br>
&emsp;result in incorrect behavior, because if a new path is found, a processor reads min again, and updates<br>
&emsp;it only if len is indeed smaller than min. In addition, no path will be pruned too early, because pmin<br>
&emsp;is always smaller or equal to min. So, the correct value of min will be computed.

&emsp;**13. \[7 points\]:** Will the program with the pmin hack run faster than the program without the hack<br>
&emsp;on TreadMarks? (Briefly explain your answer.)<br>
&emsp;**Answer:** Yes. A typical job will take out a lock only once, namely to read min at the beginning of<br>
&emsp;the job and update pmin. So, no locks are acquired during a job and all communication associated<br>
&emsp;with locks during a job is avoided. Only when min must be updated, will communication happen, but<br>
&emsp;that will happen seldom, because the bound is strictly decreasing and will decrease quickly initially.<br>
&emsp;A job may do a few extra recursions of tsp, but that should have a small effect on performance<br>
&emsp;for three reasons: there are many jobs and each job starts with an up-to-date version of min; min<br>
&emsp;changes infrequently (initially it will be updated a few times quickly, but then very infrequently); and<br>
&emsp;communication in a network of workstation is very expensive (i.e., it stalls the computation for many<br>
&emsp;cycles). The extra work is much less than the cycles saved by avoiding communication.

&emsp;**14. \[7 points\]:** Alice also runs the pmin version on TreadMarks with eager release consistency. Will<br>
&emsp;this version run faster or slower than with lazy release consistency? (Briefly explain your answer.)<br>
&emsp;**Answer:** The paper reports on this experiment and shows that eager is slightly faster (figure 9 shows<br>
&emsp;that eager achieves a higher speedup). As described in Section 5.2, the TSP in the paper uses the same<br>
&emsp;private minimum hack. The reason eager performs better is that 1) min is immediately updated on<br>
&emsp;all processors when it is changed on one processor (thereby resulting in more immediate pruning of<br>
&emsp;longer paths) and 2) the total communication is about the same for both eager and lazy (see figures<br>
&emsp;10, 11, and 12).

**Name:**


---

<a id="page-12"></a>
**Page 12**

6.824 SPRING 2010, Quiz 1   **Page 12 of 12**

**IV**   **6.824**

&emsp;**15. \[2 points\]:** Describe the most memorable error you have made so far in one of the labs. (Provide<br>
&emsp;enough detail so that we can understand your answer.)<br>
&emsp;&emsp;Most common answers:

&emsp;&emsp;concurrency<br>
&emsp;&emsp;problems with FUSE<br>
&emsp;&emsp;problems with the RPC library; RPC library does not type check arguments

We would like to hear your opinions about 6.824, so please answer the following two questions. (Any<br>
relevant answer will receive full credit!)

&emsp;**16. \[1 points\]:** What is the best aspect of 6.824?<br>
&emsp;&emsp;Most common answers:

&emsp;&emsp;papers<br>
&emsp;&emsp;labs

&emsp;**17. \[1 points\]:** What is the worst aspect of 6.824?<br>
&emsp;&emsp;Most common answers:

&emsp;&emsp;FUSE<br>
&emsp;&emsp;distributed debugging<br>
&emsp;&emsp;questions at beginning of class<br>
&emsp;&emsp;some papers are old<br>
&emsp;&emsp;labs too open ended<br>
&emsp;&emsp;quiz

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;End of Quiz I

**Name:**

