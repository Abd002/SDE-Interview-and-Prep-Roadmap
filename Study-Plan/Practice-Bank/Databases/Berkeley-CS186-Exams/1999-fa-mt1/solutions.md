# Berkeley CS186 Fall 1999: Midterm 1: Official solutions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/186>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Midterm 1 Solution Key


### **Question 1: Entity Relational Model**

a.  Answers needed to relate data independence to the SALESPERSON table, e.g. "if the data in the<br>
salesperson table is stored in a file system, and not in a relational DBMS, if we added a new field to the<br>
salesperson table the application would have to be aware of it.  But a relational database gives us data<br>
independence by providing a separation between the way the data is stored on the file and the way the<br>
application accesses it".<br>
b. Cardinality = 4; degree = 4<br>
c. Name the primary keys: Salesperson: Sid (region is also acceptable); Products Pid; Customers<br>
Cid; Orders \<cid, pid\>.  Quantity is NOT a primary key (point was taken off if you indicated it as a primary<br>
key)<br>
d. Orders has a foreign key Cid references customers, Pid references products. If you indicated that the<br>
Region attribute of Customers is a foreign key, referencing the Region key of Salesperson, that is also OK.<br>
e. The only connection between any of the Entities and Salespersons is the Region attribute, between<br>
Customers & Salespersons, so we are looking for a relationship ("services") between Customers &<br>
Salespersons. If you drew the Salesperson entity correctly, you got 4 points.  One more point if you<br>
underlined sid.   Then points were taken off for not having the right relationship, or not having it correctly<br>
drawn.   Below is one possible solution.


![Figure on page 1](figures/solutions-p01-fig01.png)


---

<a id="page-2"></a>
**Page 2**


### **Question 2**

a. Maximum rotational delay:<br>
1/7200 or 0.000139 sec<br>
We also take 99/100 \* 1/7200<br>
(1 point was taken off if you indicated the average rotational delay or (    \* 1/7200))<br>
Transfer rate:<br>
512 \* 100 \* 7200 bytes/sec.<br>
b. A slot directory is the on page data structure used to locate a variable length record on a page.<br>
(A fix length record can also use a slot directory, if you explain how, you get credit.)<br>
There is a \<record offset, record length\> pair per slot in the slot directory when used in a variable length<br>
record page.   In a fix length record page, each slot has a flag indicating whether a particular slot is used or<br>
free.<br>
Field offset refers to the offset from the beginning of a record, of a particular attribute (or field).<br>
For instance, given the following schema: (sid: integer, name: char(30), grade: integer).   The field offset of<br>
name should be 4 (since an int is 4 bytes.)     Similarly the field offset of  grade should be 34.  (Note on<br>
some implementations, fields in records are required to be word aligned so, you may actually get 36 as the<br>
field offset for grade.)<br>
c. LRU and MRU have the same performance, both result in 5 page I/Os for the given paging sequence.<br>
Some students forgot to count in the first 2 page accesses and put the number of I/Os for both algorithms as<br>
3\.  But we also accepted that answer.  If you only gave results to LRU or MRU, but did not show work, you<br>
may get only partial credit.<br>
d. The problem is quite ambiguous.  The ambiguity comes from two parts:<br>
1\. The job access pattern<br>
2\. The clock algorithm  (i.e. whether or not advance the clock hand after reading a page already in the<br>
buffer pool) – however, there would not have been any ambiguity had you followed the pseudo code for<br>
clock from the class homepage.<br>
We give full credit to anyone with a reasonable analysis.  Something we are particularly looking for is like:<br>
1\. With a page access pattern like: 2, 1, 2, 2, 2, 3, 2, 4, 2, 5, 2.  Then LRU would be best.  (If you showed<br>
that the simulation of the clock algorithm performed equal to (even outperformed) LRU, and you showed<br>
your work you also received credit.)<br>
2\. If you said the job access pattern was like: 2, 1, 2, 3, 4, 5, 2, 1, 2, 3, 4, 5.  Then MRU would be best.<br>
Partial credit is given to any attempt that makes more or less sense.


### **Question 3**

3.a1) Advantage of cluster index on sname: fast range search on sname field<br>
&emsp;&emsp;1.5pts<br>
a2) Disadvantage: Any other indices on Salesperson would have to be unclustered, so range search on<br>
those fields will be slow.  Also there was overhead in maintaining the clustered property.<br>
&emsp;&emsp;1.5pts<br>
a3) Nonclustered: When there is already a cluster index on SID or if range search on SID is more common<br>
&emsp;&emsp;2 pts


---

<a id="page-3"></a>
**Page 3**

b) Number of I/Os : 1 header/directory page + 20 buckets = 21 in Alternative 1<br>
&emsp;&emsp;&emsp;&emsp;&emsp;1 header/directory page + 20 buckets + 20 data pages = 41 in<br>
Alternative 2<br>
&emsp;&emsp;2 pts for correct answer<br>
&emsp;&emsp;3 pts for an explanation<br>
c) Using d = 2 and 1 data record per page, the tree has at least a root node and index nodes.<br>
&emsp;&emsp;2 pts for correct index<br>
&emsp;&emsp;2 pts for correct leaf<br>
&emsp;&emsp;1 pt for overall correctness<br>
Here is one possible Alternative 1 Solution:


![Figure on page 3](figures/solutions-p03-fig02.png)

In the above diagram, the leaves actually store the entire data record.   So for the first leaf, you actually<br>
have (Bob, 1, TX) \<cname, cid, region\><br>
Here is one possible Alternative 2 Solution<br>
Root Page


![Figure on page 3](figures/solutions-p03-fig03.png)

In the leaf level (2nd level in the above diagram) the data entries are \<Key, rid\>   (for simplicity, the rid is<br>
simply the page number of the page the actual data record is stored).  The data records are stored in a heap<br>
file as depicted in the third level.<br>
d) Advantage of Sparse index: index is smaller, easier to do range search.<br>
&emsp;&emsp;2.5 pts<br>
Disadvantage of Sparse: other indexes can’t be clustered.  Can’t do optimization in the index because<br>
the index doesn’t contain every record entry.<br>
&emsp;&emsp;2.5 pts


### **Question 4. Relational Algebra:**

A<br>
1\.  Cname             Cid         Region<br>
Lin   3   MA<br>
Lin   5   FL<br>
1 point was taken off if you had only 1 row.


---

<a id="page-4"></a>
**Page 4**

2\.  Cname             Pid<br>
Bob   152<br>
Harry    152<br>
Martha   831<br>
Martha   131<br>
Lin   255<br>
3\.  Cname<br>
Mary<br>
4\.  Cname<br>
Bob<br>
5\.    Name<br>
&emsp;Frances<br>
&emsp;Bob<br>
&emsp;Mary<br>
&emsp;Harry<br>
&emsp;Lin<br>
&emsp;Martha<br>
&emsp;1 point taken off if you had duplicates.<br>
B<br>
1.cname<br>
&emsp;&emsp;&emsp;&emsp;&emsp;region = “TX” (CUSTOMERS)<br>
2\.  cid ( ORDERS          orders.cid = products.cid  (    pname = ‘pcs’ PRODUCTS) )<br>
&emsp;&emsp;&emsp;&emsp;pname = ‘printers’ PRODUCTSproducts.pid = orders.pid ORDERS)<br>
3\.       sid ((((<br>
orders.cid = customers.cid CUSTOMERS)<br>
&emsp;&emsp;customers.region = salesperson.regionSALESPERSON)


### **Question 5. SQL**

a) List the names of the customers who have bought more than one item.<br>
`SELECT cname`<br>
`FROM customers`<br>
`WHERE cid IN (SELECT cid`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`FROM orders`<br>
&emsp;&emsp;`GROUP BY cid`<br>
&emsp;&emsp;`HAVING count(*) > 1)`<br>
Alternative:   `HAVING sum(quantity) > 1)`<br>
Other possible solutions<br>
`SELECT cname`<br>
`FROM customers c, orders o1, orders o2`<br>
`WHERE c.cid = o1.cid AND`<br>
`c.cid = o2.cid`<br>
`AND o1.pid <> o2.pid`


---

<a id="page-5"></a>
**Page 5**

`SELECT c.cname`<br>
`FROM customers c, (SELECT cid FROM orders`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`GROUP BY cid`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`HAVING count (*) > 1) as o`<br>
`WHERE c.cid = o.cid`

`SELECT cname`<br>
`FROM customers`<br>
`WHERE 1 < (SELECT count(*)`<br>
&emsp;&emsp;`FROM orders o`<br>
&emsp;&emsp;`WHERE c.cid = o.cid)`

e) List the names, pid, and price of all the products, whether or not the product has been ordered, but if it<br>
has been ordered display the cids of the customer who ordered it.<br>
Solution 1:<br>
`SELECT name, pid, price, cid`<br>
`FROM products LEFT OUTER JOIN orders`<br>
`ON products.pid = orders.pid            <<<< optional`<br>
Solution 2:<br>
`SELECT name, p.pid, price, cid`<br>
`FROM products p, orders o`<br>
`WHERE p.pid = o.pid`<br>
`UNION`<br>
`SELECT name, pid, price, NULL as cid`<br>
`FROM products p`<br>
`WHERE cid NOT IN (SELECT cid FROM orders)`<br>
Alternatives:  `WHERE NOT EXISTS (SELECT * FROM orders o WHERE o.pid = p.pid)`<br>
&emsp;&emsp;`WHERE cid <> ANY (SELECT cid FROM orders)`

f) List the names and cids of all customers, and, for those who have bought product, the total amount of<br>
money they owe for their purchases.<br>
Solution 1:<br>
`SELECT c.name, c.cid, total = sum(price * quantity)`<br>
`FROM customers c, orders o, products p`<br>
`WHERE c.cid = o.cid AND o.pid = p.pid`<br>
`GROUP BY c.name, c.cid`<br>
`UNION`<br>
`SELECT c.name, c.cid, totoal = NULL`<br>
`FROM customers c`<br>
`WHERE c.cid NOT IN (SELECT cid FROM orders)`<br>
Solution 2:<br>
`SELECT name, cid total = sum(price * quantity)`<br>
`FROM costomer LEFT OUTER JOIN (orders INNER JOIN products)`


---

<a id="page-6"></a>
**Page 6**

`GROUP BY cid`<br>
g) Find the sids of the salespeople for the regions where there are the most customers.<br>
`SELECT s.sid FROM salesperson`<br>
`WHERE region IN (SELECT region`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`FROM customers`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`GROUP BY region`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`HAVING count(*) >= ALL (SELECT count(*)`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`FROM customers`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`GROUP BY region)`<br>
Alternative: `HAVING count(*) = (SELECT max(cnt)`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`FROM (SELECT count(*) as cnt`<br>
`FROM customers`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`GROUP BY region)`<br>
h. Sname<br>
&emsp;Frances<br>
&emsp;Bob<br>
&emsp;Mary<br>
i.    Sid   Name<br>
74   Lin<br>
j.    Sid   Tsales<br>
25   $1400<br>
&emsp;89 $1020<br>
Points were taken off if you had 2 zero rows in your answer.<br>
k. Pname<br>
&emsp;Paper

