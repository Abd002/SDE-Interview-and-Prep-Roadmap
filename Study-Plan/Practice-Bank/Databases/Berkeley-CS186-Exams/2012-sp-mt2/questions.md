# Berkeley CS186 Spring 2012: Midterm 2: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/186>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

**Midterm	  2,	  CS186**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Please	  put	  all	  answers	  on	  the	  answer	  sheets.**<br>
Prof.	  Hellerstein,	  Spring	  2012	  **Make	  sure	  your	  name	  is	  on	  each	  answer	  sheet!**<br>
**B+-­‐Trees**<br>
Assume	  we	  have	  the	  following	  B+	  Tree	  of	  order	  2	  in	  which	  each	  index	  node	  must<br>
have	  between	  2	  and	  4	  entries.	  	  The	  leaf	  nodes	  can	  only	  hold	  only	  2	  entries,	  however.<br>
The	  asterisk	  on	  data	  entries	  represents	  the	  fact	  that	  the	  leaf	  pages	  will	  store<br>
additional	  information.


![Figure on page 1](figures/questions-p01-fig01.png)

**1.	  \[2	  points\]	  On	  the	  answer	  sheet,	  list	  all	  nodes**	  that	  are	  accessed	  when	  you<br>
perform	  a	  lookup	  on	  the	  range	  “37-­‐65”.<br>
**2.	  \[4	  points\]**	  A	  row	  is	  inserted	  into	  your	  table	  with	  the	  indexed	  value	  “19”.	  We	  want<br>
you	  to	  **draw	  the	  B+	  tree	  after	  this	  insert**	  occurs.	  	  	  We	  have	  started	  drawing	  it	  for<br>
you	  **on	  the	  answer	  sheet**.	  	  For	  any	  node	  X	  that	  does	  not	  change,	  simply	  write	  down<br>
“Node	  X”	  (as	  we	  did	  for	  Node	  4).	  	  For	  any	  node	  that	  you	  do	  change,	  please	  fill	  it	  in<br>
completely.	  	  You	  do	  not	  need	  to	  assign	  node	  numbers	  to	  any	  nodes	  you	  generate.


![Figure on page 1](figures/questions-p01-fig02.png)

**3.**	  **\[1	  point\]**	  	  Consider	  the	  index	  page	  on	  the	  right.	  	  This<br>
is	  taken	  from	  a	  different	  B+-­‐tree,	  which	  can	  fit	  32	  bytes<br>
per	  index	  page.	  	  In	  this	  index,	  each	  character	  takes<br>
one	  byte	  and	  each	  pointer	  takes	  4	  bytes.<br>
marmot\]cat\]In	  the	  diagram	  **on	  the	  answer	  sheet,	  draw	  an**	  mink\]<br>
**alternative	  index	  page	  with	  prefix-­‐compressed	  index	  entries.**Where	  relevant,<br>
we	  have	  shown	  the	  top	  of	  the	  value-­‐range	  stored	  in	  the	  left-­‐hand	  subtree.<br>
**4.	  	  \[2	  points\]**	  	  Given	  your	  answer	  to	  part	  3,	  **write	  on	  the	  answer	  sheet**:<br>
a)	  the	  number	  of	  bytes	  occupied	  on	  your	  compressed	  page,	  and<br>
b)	  the	  maximum	  number	  of	  additional	  index	  entries	  we	  could	  fit	  in	  that	  page.


---

<a id="page-2"></a>
**Page 2**

**Information	  Retrieval**<br>
&emsp;**5. \[2	  points\]**	  Consider	  the	  keyword	  query	  “Berkeley	  Database	  Research”.	  	  We<br>
&emsp;&emsp;said	  in	  class	  that	  one	  could	  treat	  that	  query	  as	  a	  document,	  and	  compute	  a<br>
&emsp;&emsp;TF×IDF	  score	  for	  it.	  	  Now	  it	  is	  time	  to	  do	  so!	  	  Suppose	  we	  know	  that:<br>
&emsp;&emsp;&emsp;**a.** our	  corpus	  has	  109	  documents.<br>
&emsp;&emsp;&emsp;**b.** “berkeley”	  appears	  in	  105	  documents<br>
&emsp;&emsp;&emsp;**c.** “database”	  appears	  in	  104	  documents<br>
&emsp;&emsp;&emsp;**d.** “research”	  appears	  in	  103	  documents<br>
&emsp;&emsp;To	  help	  create	  the	  vector,	  **on	  the	  answer	  sheet	  please	  write	  down	  the**<br>
&emsp;&emsp;**(unnormalized!)	  TF×IDF	  score**	  for	  each	  of	  the	  3	  terms	  above.

&emsp;**6. \[2	  points\]**	  Suppose	  you	  have	  a	  relation	  stored	  as	  a	  heap	  file	  F	  representing<br>
&emsp;&emsp;an	  inverted	  file	  with	  the	  following	  schema:<br>
&emsp;&emsp;`(docId,` //	  an	  integer	  	  ID	  representing	  this	  document<br>
&emsp;&emsp;`termID,` //	  an	  integer	  ID	  representing	  this	  term<br>
&emsp;&emsp;`position,` //	  the	  word	  offset	  of	  this	  term	  occurrence	  in	  the	  doc<br>
&emsp;&emsp;`surrounding_text,` //	  a	  snippet	  of	  text	  containing	  this	  term	  occurrence<br>
&emsp;&emsp;`DocTermRank` //	  the	  TFxIDF	  score`).`<br>
&emsp;&emsp;You	  will	  build	  a	  standard	  B+-­‐tree	  index	  with	  “posting	  list”	  entries	  in	  the<br>
&emsp;&emsp;leaves	  as	  we	  discussed	  in	  class.	  	  The	  search	  key	  of	  the	  index	  will	  contain	  all<br>
&emsp;&emsp;attributes	  except	  for	  `surrounding_text`.	  In	  order	  for	  the	  index	  to	  be<br>
&emsp;&emsp;clustered,	  what	  should	  be	  the	  (lexicographic)	  sort	  order	  of	  the	  file	  F?	  	  **Write**<br>
&emsp;&emsp;**the	  answer	  on	  the	  answer	  sheet.**

&emsp;**7. \[2	  points\]**	  Your	  mom	  tells	  you	  that	  the	  schema	  in	  part	  (2)	  is	  not	  in	  BCNF.<br>
&emsp;&emsp;What	  implicit	  functional	  dependency	  makes	  her	  say	  that?	  	  **Write	  your**<br>
&emsp;&emsp;**answer	  on	  the	  answer	  sheet.**

&emsp;**8. \[2	  points\]**	  In	  class	  we	  discussed	  the	  idea	  of	  a	  “spider	  trap”	  web	  service	  that<br>
&emsp;&emsp;could	  foil	  a	  web	  crawler	  by	  generating	  interlinked	  pages	  dynamically.	  	  For<br>
&emsp;&emsp;each	  of	  the	  following	  arguments,	  **mark	  T	  (true)	  or	  F	  (false)	  on	  the	  answer**<br>
&emsp;&emsp;**sheet**:<br>
&emsp;&emsp;&emsp;a. The	  spider	  trap	  can	  change	  the	  IDF	  scores	  of	  other	  pages.<br>
&emsp;&emsp;&emsp;b. Spider	  traps	  can	  increase	  the	  search	  frontier	  of	  the	  crawler.<br>
&emsp;&emsp;&emsp;c. The	  spider	  trap	  can	  attract	  lots	  of	  search	  hits	  by	  generating	  pages	  with<br>
&emsp;&emsp;&emsp;&emsp;&emsp;arbitrarily	  high	  IDF.


---

<a id="page-3"></a>
**Page 3**

**Buffer	  Management**<br>
It’s	  time	  to	  play	  buffer	  manager!	  For	  each	  of	  the	  following	  replacement	  policies,<br>
record	  the	  eviction	  for	  each	  access	  number	  (if	  any).	  Assume	  a	  **three	  page	  buffer**<br>
**pool**	  and	  remember	  to	  only	  record	  **evictions**	  in	  the	  frame	  number	  they	  occur.<br>
For	  example,	  if	  record	  Q	  is	  evicted	  during	  access	  number	  5	  and	  record	  R	  is	  evicted	  in<br>
access	  10,	  put	  Q	  in	  the	  box	  marked	  5	  and	  R	  in	  the	  box	  marked	  10.	  **Do	  not**	  place	  Q	  in<br>
box	  1	  and	  R	  in	  box	  2;	  you	  need	  to	  record	  the	  access	  number	  of	  the	  eviction.	  Some<br>
boxes	  may	  be	  left	  blank.


![Figure on page 3](figures/questions-p03-fig03.png)

**9.	  \[2.5	  points\]**	  Most	  Recently	  Used.	  (**Fill	  in	  the	  eviction	  history	  on	  answer	  sheet**).

**10.	  \[2.5	  points\]**	  	  Clock.	  	  (**Fill	  in	  the	  eviction	  history	  on	  answer	  sheet**).<br>
**Notes	  on	  10:	  As	  in	  Bunny	  #5…**assume	  a	  maximum	  reference	  count	  of	  one.	  Do	  not<br>
advance	  the	  clock	  hand	  when	  you	  access	  a	  page—only	  advance	  it	  when	  choosing	  a<br>
page	  to	  evict.	  Do	  **not**	  advance	  the	  clock	  hand	  after	  you	  replace	  a	  page,	  and	  assume<br>
each	  page	  is	  unpinned	  before	  the	  next	  access	  #.

For	  the	  next	  2	  questions,	  **mark	  T	  (true)	  or	  F	  (false)	  on	  the	  answer	  sheet**:<br>
**11.	  \[1	  point\]**	  	  Pages	  evicted	  from	  the	  buffer	  pool	  must	  be	  written	  back	  to	  disk.<br>
**12.	  \[1	  point\]**	  Sequential	  flooding	  occurs	  when	  **both**	  of	  the	  following	  hold:<br>
&emsp;&emsp;a.	  repeated	  sequential	  scans	  of	  a	  file	  and<br>
&emsp;&emsp;b.	  the	  number	  of	  unpinned	  buffer	  frames	  exceeds	  the	  number	  of	  file	  pages


---

<a id="page-4"></a>
**Page 4**

**Functional	  Dependencies.**<br>
Consider	  the	  relation:	  A	  B	  C	  D	  E<br>
with	  the	  functional	  dependencies	  F=	  {A	  →	  BC,	  B	  →	  A,	  DE	  →	  C,	  C	  →	  B,	  E	  →	  D	  }<br>
**13.\[2	  points\]**	  There	  is	  a	  unique	  minimal	  superkey.	  	  What	  is	  it?<br>
**Write	  your	  answer	  on	  the	  answer	  sheet.**

For	  the	  next	  2	  questions,	  **mark	  T	  (true)	  or	  F	  (false)	  on	  the	  answer	  sheet**:<br>
**14.	  	  \[2	  points\]**	  Consider	  the	  decomposition	  of	  the	  relation	  into	  two	  tables:	  ABED,	  EC<br>
a)	  	  **True/False:**	  This	  decomposition	  is	  in	  BCNF.

b)	  	  **True/False:**	  The	  decomposition	  is	  Lossless	  Join.

**15.	  	  \[2	  points\]**	  Consider	  the	  decomposition	  of	  the	  relation	  into	  two	  tables:	  ACDE,	  CB<br>
a)	  **True/False:**	  The	  decomposition	  is	  in	  BCNF.

b)	  **True/False:**	  The	  decomposition	  is	  Lossless	  Join.

**16.	  	  \[2	  points\]**	  Perform	  a	  BCNF	  decomposition	  of	  the	  relational	  A	  B	  C	  D	  E,<br>
considering	  the	  functional	  dependencies	  in	  F	  **from	  left	  to	  right**.	  	  **Show	  the	  final**<br>
**decomposed	  schema	  on	  the	  answer	  sheet.**


---

<a id="page-5"></a>
**Page 5**


![Figure on page 5](figures/questions-p05-fig04.png)

**ER	  Modeling**

&emsp;c) Bunny	  Overlords	  have	  cute	  qualities	  (such	  as	  fluffiness	  or	  cuddliness).<br>
&emsp;d) Minions	  also	  have	  cute	  qualities.<br>
The	  ER-­‐diagram	  above	  specifies	  the	  exact	  nature	  of	  the	  relationships.	  	  Please	  answer<br>
the	  following	  questions	  using	  the	  ER	  diagram	  and	  clarifications	  above.<br>
For	  the	  next	  2	  questions,	  **mark	  T	  (true)	  or	  F	  (false)	  on	  the	  answer	  sheet**:<br>
&emsp;**17. \[1	  point\]	  True	  /	  False**.	  A	  student	  may	  have	  their	  soul	  devoured	  by	  more<br>
&emsp;&emsp;than	  one	  Bunny	  Overlord.

&emsp;**18. \[1	  point\]	  True	  /	  False**.	  A	  particular	  Bunny	  Overlord	  cannot	  have	  two<br>
&emsp;&emsp;minions	  with	  the	  same	  name.

&emsp;**19. \[1	  point\]	  Multiple	  Choice**.	  Consider	  a	  Bunny	  Overlord,	  Mipsy.	  	  Mipsy	  has	  the<br>
&emsp;&emsp;fewest	  possible	  cute	  qualities	  that	  a	  Bunny	  Overlord	  can	  have	  according	  to<br>
&emsp;&emsp;the	  ER	  diagram.	  Mark	  the	  most	  general	  correct	  answer	  on	  the	  answer	  sheet.<br>
&emsp;&emsp;a. Mipsy	  must	  have	  more	  cute	  qualities	  than	  some	  Minion.<br>
&emsp;&emsp;b. Mipsy	  must	  have	  more	  cute	  qualities	  than	  all	  Minions.<br>
&emsp;&emsp;c. Mipsy	  must	  have	  fewer	  cute	  qualities	  than	  some	  Minion.<br>
&emsp;&emsp;d. Mipsy	  must	  have	  fewer	  cute	  qualities	  than	  all	  Minions.<br>
&emsp;&emsp;e. None	  of	  the	  above.


---

<a id="page-6"></a>
**Page 6**

Now	  it’s	  your	  turn	  to	  design	  your	  own	  ER	  diagram,	  modeling	  the	  following<br>
relationship	  between	  Kitties,	  Puppies,	  Humans,	  and	  Pacts	  of	  Friendship.	  For	  this<br>
part,	  we	  recommend	  you	  draw	  the	  solution	  out	  in	  the	  diagrams	  provided.	  **In**<br>
**question	  20	  you	  will	  copy	  the	  whole	  thing	  over	  to	  the	  answer	  sheet**.	  Be	  sure


![Figure on page 6](figures/questions-p06-fig05.png)


---

<a id="page-7"></a>
**Page 7**

Name:	  Class	  Account:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;cs186-­‐\_\_\_\_\_\_\_\_\_\_\_\_

&emsp;&emsp;&emsp;**B+-­‐Trees**

&emsp;&emsp;&emsp;**1.	  List	  of	  nodes	  accessed:**


![Figure on page 7](figures/questions-p07-fig06.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**4a	  .	  #	  bytes	  occupied:**


![Figure on page 7](figures/questions-p07-fig07.png)

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**4b.	  	  #	  additional	  entries:**

&emsp;&emsp;&emsp;**Information	  Retrieval**<br>
&emsp;&emsp;&emsp;**5.	  	  berkeley:**	      	  	  	  	  **database:**	     	  	  	  	  **research:**

&emsp;&emsp;&emsp;**6.	  Sort	  order	  is:**

&emsp;&emsp;&emsp;**7.	  The	  FD	  is:**

&emsp;&emsp;&emsp;**8.	  	  a**	     **b**	  	  	  	  	  	  	  	  	     **c**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`◯` 	  T	  	  	  	  	  	  	  	  	  `◯` 	  F	  	     `◯` 	  T	  	  	  	  	  	  	  	  	  `◯` 	  F	  	     `◯` 	  T	  	  	  	  	  	  	  	  	  `◯` 	  F


---

<a id="page-8"></a>
**Page 8**

Name:	  Class	  Account:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;cs186-­‐\_\_\_\_\_\_\_\_\_\_\_\_

&emsp;&emsp;&emsp;**Buffer	  Management**<br>
&emsp;&emsp;&emsp;**9.	  	  MRU	  eviction	  history**


![Figure on page 8](figures/questions-p08-fig08.png)

&emsp;&emsp;&emsp;**10.	  	  Clock	  eviction	  history**


![Figure on page 8](figures/questions-p08-fig09.png)

