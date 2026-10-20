# Berkeley CS186 Spring 2012: Final: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/186>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

**Final	  Exam,	  CS186,	  Spring	  2012**	  	  	  	  	  	  	  	  	  	  	  	  	  	  	  **Prof.	  Joe	  Hellerstein**

**Similarity	  Joins**<br>
Some	  of	  you	  may	  remember	  Homework	  5	  from	  a	  short	  while	  ago.	  This	  question	  is	  about	  ways	  we<br>
could	  improve	  the	  similarity	  join	  algorithm	  you	  implemented	  there.<br>
&emsp;1\. Recall	  from	  Homework	  4	  that	  we	  ensure	  that	  the	  list	  of	  trigrams	  for	  a	  given	  input	  string	  has<br>
&emsp;&emsp;at	  maximum	  1	  instance	  of	  each	  trigram.	  For	  example,	  the	  trigrams	  for	  “geegee”	  are	  \[“gee”,<br>
&emsp;&emsp;“eeg”,	  “ege”\]	  (excluding	  padding).	  We	  decide	  that	  we	  want	  to	  weight	  trigrams	  based	  on	  how<br>
&emsp;&emsp;frequently	  they	  appear	  in	  the	  original	  string,	  so	  our	  output	  for	  the	  above	  string	  would	  be,<br>
&emsp;&emsp;conceptually,	  \[“gee”:	  2,	  “eeg”:	  1,	  “ege”:	  1\].<br>
&emsp;&emsp;&emsp;a) **\[1	  pt\]**	  Here	  is	  the	  pseudocode	  for	  generate\_trigrams:

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1\.    def generate\_trigrams(input):<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2\.    trigrams = list()<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3\.        for word in input.split(“ “): # Split input into words<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4\.    # Add all trigrams for the given word to our list.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;5\.    trigrams += make\_trigrams(word)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;6\.        sort(trigrams)     # Sort the list of trigrams<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;7\.    unique(trigrams) # Remove duplicates<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;8\.    return trigrams<br>
&emsp;&emsp;&emsp;&emsp;&emsp;Which	  line	  should	  we	  replace	  with	  a	  call	  to	  “aggregate(trigrams)”,	  which	  aggregates<br>
&emsp;&emsp;&emsp;&emsp;&emsp;adjacent	  trigrams	  into	  the	  desired	  weighted	  list?<br>
&emsp;&emsp;&emsp;b) **\[1	  pt\]**	  Recall	  that	  our	  inverted	  index	  in	  HW5	  holds	  entries	  that	  contain	  information<br>
&emsp;&emsp;&emsp;&emsp;&emsp;about	  (MinimalTuple,	  NTrgms	  in	  the	  tuple,	  and	  a	  Trgm	  in	  the	  tuple).	  We	  have	  one<br>
&emsp;&emsp;&emsp;&emsp;&emsp;index	  entry	  for	  every	  trigram	  in	  every	  inner	  tuple.	  What	  is	  the	  lexicographic	  sorting<br>
&emsp;&emsp;&emsp;&emsp;&emsp;order	  for	  this	  index?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;A. (MinimalTuple,	  NTrgms,	  Trgm)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;B. (MinimalTuple,	  Trgm,	  NTrgms)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;C. (Trgm,	  MinimalTuple,	  NTrgms)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;D. (Trgm,	  NTrgms,	  MinimalTuple)

&emsp;&emsp;&emsp;c) **\[2	  pts\]**	  Now	  we	  want	  to	  add	  the	  “Weight”	  of	  the	  given	  Trgm	  into	  the	  index.	  We	  need<br>
&emsp;&emsp;&emsp;&emsp;&emsp;to	  decide	  where	  we	  should	  insert	  it	  into	  the	  lexicographic	  ordering	  from	  (b).	  	  Select<br>
&emsp;&emsp;&emsp;&emsp;&emsp;**all**valid	  positions	  for	  the	  “Weight”	  field	  in	  the	  lexicographic	  ordering	  (there	  may	  be<br>
&emsp;&emsp;&emsp;&emsp;&emsp;more	  than	  one	  valid	  answer—select	  all	  of	  them!)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;A. Index	  0	  –	  at	  the	  beginning<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;B. Index	  1	  –	  after	  the	  first	  key<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;C. Index	  2	  –	  after	  the	  second	  key<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;D. Index	  3	  –	  at	  the	  end


---

<a id="page-2"></a>
**Page 2**

2\. Let’s	  say	  that	  instead	  of	  storing	  the	  MinimalTuple	  in	  the	  index,	  we	  decide	  to	  store	  the	  RID<br>
&emsp;(“record	  id”)	  which	  is	  a	  field	  in	  the	  MinimalTuple	  that	  can	  uniquely	  identify	  every	  tuple	  in	  a<br>
&emsp;given	  table	  (i.e.,	  a	  primary	  key).<br>
&emsp;&emsp;a) **\[1	  pt\]**	  How	  does	  storing	  RID	  instead	  of	  MinimalTuple	  affect	  our	  memory	  usage	  in<br>
&emsp;&emsp;&emsp;general?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;A. It	  decreases	  our	  memory	  usage.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;B. It	  increases	  our	  memory	  usage.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;C. It	  does	  not	  change	  our	  memory	  usage.<br>
&emsp;&emsp;b) **\[1	  pt\]**	  Assuming	  the	  inverted	  index	  fits	  in	  memory,	  how	  does	  storing	  RID	  instead	  of<br>
&emsp;&emsp;&emsp;MinimalTuple	  affect	  the	  number	  of	  IOs	  during	  the	  join?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;A. It	  decreases	  the	  number	  of	  IOs.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;B. It	  increases	  the	  number	  of	  IOs.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;C. It	  does	  not	  change	  the	  number	  of	  IOs.<br>
&emsp;&emsp;c) **\[2	  pts\]**	  Assume	  the	  necessary	  changes	  have	  already	  been	  made	  to	  the	  inverted<br>
&emsp;&emsp;&emsp;index.	  How	  will	  replacing	  MinimalTuple	  with	  RID	  change	  the	  similarity	  join<br>
&emsp;&emsp;&emsp;algorithm?<br>
&emsp;&emsp;&emsp;On	  the	  answer	  sheet,	  mark	  **N**	  if	  it	  will	  “Not	  require	  a	  change”,	  mark	  **T**	  if	  it	  will	  require	  a<br>
&emsp;&emsp;&emsp;“Trivial	  change”	  (i.e.,	  just	  altering	  one	  line),	  or	  **C**	  if	  it	  will	  require	  a	  “Complicated<br>
&emsp;&emsp;&emsp;change”	  (adding	  actual	  logic	  to	  the	  code).<br>
&emsp;&emsp;&emsp;&emsp;&emsp;i.    Trigrammating	  the	  inner	  tuples.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;ii.    Storing	  the	  entries	  in	  the	  index.<br>
&emsp;&emsp;&emsp;&emsp;iii.    Finding	  the	  least	  tuple	  pointed	  to	  by	  all	  the	  outer	  trigrams.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;iv.    Concatenation	  of	  the	  tuples	  to	  be	  returned.


---

<a id="page-3"></a>
**Page 3**

**Logging	  and	  Recovery**<br>
After	  mastering	  the	  skills	  of	  CS186	  you	  manage	  to	  implement	  your	  own	  database.	  But	  oh	  no,	  a<br>
bunny	  chewed	  through	  the	  power	  cable	  on	  your	  server	  and	  everything	  crashed!	  When	  you	  boot<br>
back	  up	  you	  see	  the	  following	  log	  records	  and	  transaction	  and	  dirty	  page	  table	  that	  were	  created	  at<br>
the	  last	  checkpoint.

&emsp;Log<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Transaction	  Table


![Figure on page 3](figures/questions-p03-fig01.png)


![Figure on page 3](figures/questions-p03-fig02.png)


![Figure on page 3](figures/questions-p03-fig03.png)

&emsp;3\. **\[1	  pt\]**	  What	  is	  the	  undoNextLSN	  of	  the	     phase?<br>
&emsp;&emsp;CLR	  at	  90?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;7\. **\[2	  pt\]**	  What	  are	  the	  LSNs	  of	  log<br>
&emsp;4\. **\[2	  pts\]**	  Fill	  in	  the	  Transaction	  and	     records	  that	  are	  read	  in	  the	  undo<br>
&emsp;&emsp;Dirty	  Page	  Table	  at	  the	  end	  of	  the	     phase?<br>
&emsp;&emsp;analysis	  phase.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;8\. **\[4	  pts\]**	  Write	  down	  the	  log	  records<br>
&emsp;5\. **\[1	  pt\]**	  What	  log	  record	  will	  the	  redo	     that	  will	  be	  written,	  and	  label	  them<br>
&emsp;&emsp;phase	  start	  at?	     with	  the	  phase	  in	  which	  they’re<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;generated	  (A	  for	  Analysis,	  R	  for	  Redo,<br>
&emsp;6\. **\[2	  pt\]**	  What	  are	  the	  LSNs	  of	  log	     or	  U	  for	  Undo).	  	  For	  CLR’s,	  make	  sure<br>
&emsp;&emsp;records	  to	  be	  redone	  in	  the	  redo	     to	  add	  the	  undoNextLSN.


---

<a id="page-4"></a>
**Page 4**

**Concurrency	  Control**<br>
Consider	  the	  following	  schedule:


![Figure on page 4](figures/questions-p04-fig04.png)

TIME


![Figure on page 4](figures/questions-p04-fig05.png)

&emsp;9\. **\[1	  pt\]**	  True/False:	  The	  above	  schedule	  is	  conflict	  serializable.<br>
&emsp;10\. **\[1	  pt\]**	  True/False:	  There	  is	  an	  edge	  from	  T2	  to	  T1	  in	  the	  dependency	  graph.<br>
&emsp;11\. **\[1	  pt\]**	  True/False:	  There	  is	  an	  edge	  from	  T1	  to	  T3	  in	  the	  dependency	  graph.<br>
&emsp;12\. **\[1	  pt\]**	  True/False:	  There	  is	  an	  edge	  from	  T3	  to	  T4	  in	  the	  dependency	  graph.<br>
&emsp;13\. **\[1	  pt\]**	  True/False:	  There	  is	  an	  edge	  from	  T3	  to	  T2	  in	  the	  dependency	  graph.<br>
Consider	  the	  sequence	  of	  operations	  in	  the	  box	  to	  the	  right:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1\) Lock	  X(C)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2\) Lock	  S(A)<br>
&emsp;14\. **\[1	  pt\]**	  Under	  two	  phase	  locking,	  what	  is	  the	  earliest	  step	  after	  which<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;3\) Read(C)<br>
&emsp;&emsp;we	  could	  release	  our	  lock	  on	  C?	  Your	  answer	  should	  be	  a	  number<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;4\) Write(C)<br>
&emsp;&emsp;(e.g.,	  after	  step	  “12”).<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;5\) Lock	  S(B)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;6\) Read(B)<br>
&emsp;15\. **\[1	  pt\]**	  Under	  strict	  two	  phase	  locking,	  what	  is	  the	  earliest	  step	  after<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;7\) Lock	  S(E)<br>
&emsp;&emsp;which	  we	  could	  release	  our	  lock	  on	  C?	  Your	  answer	  should	  again	  be	     8) Read(E)<br>
&emsp;&emsp;a	  number	  (e.g.,	  after	  step	  “12”).	  9) Read(A)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\<end	  of<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;transaction\><br>
&emsp;16\. **\[1	  pt\]**	  True/False:	  There	  are	  conflict	  serializable	  schedules	  that<br>
&emsp;&emsp;cannot	  occur	  under	  two	  phase	  locking.

&emsp;17\. **\[1	  pt\]**	  True/False:	  There	  are	  conflict	  serializable	  schedules	  that	  cannot	  occur	  under	  **strict**<br>
&emsp;&emsp;two	  phase	  locking.

&emsp;18\. **\[1	  pt\]**	  In	  the	  multi-­‐granularity	  locking	  protocol	  we	  discussed	  in	  class,	  if	  I	  hold	  an	  X	  lock	  on<br>
&emsp;&emsp;one	  page	  of	  a	  table,	  and	  an	  S	  lock	  on	  another	  page	  of	  the	  same	  table,	  what	  lock	  (if	  any)	  do	  I<br>
&emsp;&emsp;have	  on	  the	  table?


---

<a id="page-5"></a>
**Page 5**

**Query	  Processing	  and	  Optimization**<br>
Consider	  a	  student	  database	  schema	  as	  below,	  with	  primary	  keys	  underlined	  and	  foreign	  keys	  as<br>
listed:<br>
&emsp;&emsp;**STUDENTS**	  (sid,	  sname,	  street,	  city,	  age,	  gender)<br>
&emsp;&emsp;**REGISTERED**	  (sid,	  cid,	  credits)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;foreign	  key	  sid	  references	  STUDENTS<br>
&emsp;&emsp;&emsp;&emsp;&emsp;foreign	  key	  cid	  references	  COURSES<br>
&emsp;&emsp;**COURSES**	  (cid,	  cname,	  profname)<br>
Assume	  the	  following	  statistics:<br>
&emsp;•    The	  STUDENTS	  relation	  has	  10,000	  tuples	  spread	  evenly	  across	  500	  pages<br>
&emsp;• The	  REGISTERED	  relation	  has	  50,000	  tuples	  spread	  evenly	  across	  1,000	  pages<br>
&emsp;•    The	  COURSES	  relation	  has	  500	  tuples;	  40	  tuples	  of	  COURSES	  fit	  in	  each	  page<br>
&emsp;• NKeys(city)	  for	  STUDENTS	  is	  200	  (i.e.,	  there	  are	  200	  distinct	  values	  for	  city)<br>
&emsp;•    NKeys(age)	  for	  STUDENTS	  is	  80<br>
&emsp;• NKeys(gender)	  for	  STUDENTS	  is	  2<br>
&emsp;•    Low(age)	  for	  STUDENTS	  is	  10<br>
&emsp;• High(age)	  for	  STUDENTS	  is	  90<br>
&emsp;•    NKeys(gender)	  for	  STUDENTS	  is	  2<br>
&emsp;19\. **\[1	  pt\]**	  Consider	  a	  join	  of	  STUDENTS	  and	  REGISTERED.	  	  How	  many	  I/O’s	  will	  a	  Page-­‐Oriented<br>
&emsp;&emsp;Nested	  Loop	  Join	  take	  using	  STUDENTS	  as	  the	  outer	  relation?	  (You	  should	  ignore	  the	  cost	  of<br>
&emsp;&emsp;writing	  the	  final	  join	  answer	  out	  to	  disk.)<br>
&emsp;20\. **\[1	  pt\]**	  Again,	  consider	  joining	  STUDENTS	  and	  REGISTERED.	  	  Now	  assume	  that	  we	  have<br>
&emsp;&emsp;B=52	  memory	  pages	  available	  for	  the	  join.	  Using	  the	  Block	  (Chunk)	  Nested	  Loop	  Join	  with<br>
&emsp;&emsp;REGISTERED	  as	  the	  outer,	  how	  many	  I/O’s	  will	  be	  required?	  (You	  should	  ignore	  the	  cost	  of<br>
&emsp;&emsp;writing	  the	  final	  join	  answer	  out	  to	  disk.)<br>
&emsp;21\. **\[1	  pt\]**	  Consider	  the	  following	  query:

&emsp;&emsp;`SELECT gender, COUNT(*) FROM STUDENTS GROUP BY gender`<br>
&emsp;&emsp;Calculate	  the	  total	  number	  of	  I/O’s	  required	  to	  answer	  this	  query	  using	  Hybrid	  Hash-­‐based<br>
&emsp;&emsp;Grouping	  using	  the	  (\<Group	  Val,	  Trans	  Val\>)	  approach	  described	  during	  lecture.	  Assume<br>
&emsp;&emsp;that	  the	  final	  output	  does	  not	  need	  to	  be	  written	  to	  disk.


---

<a id="page-6"></a>
**Page 6**

Now	  consider	  the	  following	  indexes:<br>
&emsp;• **RegSC**	  is	  a	  clustered	  B+	  Tree	  defined	  on	  composite	  key	  \<sid,	  cid\>	  for	  REGISTERED<br>
&emsp;&emsp;&emsp;(NPages	  =	  39,000)<br>
&emsp;•    **StudC**	  is	  an	  unclustered	  B+	  Tree	  index	  is	  defined	  on	  the	  city	  attribute	  for	  STUDENTS<br>
&emsp;&emsp;(NPages	  =	  600)<br>
&emsp;• **StudA**	  is	  a	  clustered	  B+	  Tree	  index	  is	  defined	  on	  the	  age	  attribute	  for	  STUDENTS<br>
&emsp;&emsp;&emsp;(NPages	  =	  600)<br>
Each	  of	  the	  indexes	  is	  **Alternative	  2**	  and	  can	  be	  assumed	  to	  have	  a	  **height	  of	  3**	  (each	  root-­‐to-­‐leaf<br>
path	  is	  3	  pages).	  	  Also	  assume	  that	  for	  each	  index,	  50	  index	  entries	  fit	  in	  one	  index	  page<br>
For	  the	  next	  three	  questions,	  you	  need	  to	  fill	  in	  (a)	  the	  expected	  number	  of	  output	  tuples	  according<br>
to	  the	  System	  R	  approach,	  (b)	  an	  efficient	  method	  (file	  scan,	  index	  lookup,	  etc)	  for	  answering	  this<br>
query	  and	  the	  names	  of	  any	  indexes	  you	  are	  using,	  and	  (c)	  the	  number	  of	  disk	  accesses	  required.	  	  If<br>
you	  feel	  the	  need,	  you	  can	  write	  down	  any	  assumptions	  you	  are	  making	  in	  your	  answer	  (but	  be<br>
extremely	  brief!)<br>
&emsp;22\. **\[2	  pts\]**`SELECT * FROM REGISTERED WHERE cid = “CS186”;`<br>
&emsp;&emsp;&emsp;a) Estimated	  #	  Tuples	  in	  Answer:<br>
&emsp;&emsp;&emsp;b) Method	  and	  access	  path	  used:<br>
&emsp;&emsp;&emsp;c) Estimated	  #	  I/O’s	  required:<br>
&emsp;&emsp;&emsp;d) Assumptions:<br>
&emsp;23\. **\[2	  pts\]**	  `SELECT * FROM REGISTERED WHERE sid = “01234567”;`<br>
&emsp;&emsp;&emsp;a) Estimated	  #	  Tuples	  in	  Answer:<br>
&emsp;&emsp;&emsp;b) Method	  and	  access	  path	  used:<br>
&emsp;&emsp;&emsp;c) Estimated	  #	  I/O’s	  required:<br>
&emsp;&emsp;&emsp;d) Assumptions:<br>
&emsp;24\. **\[2	  pts\]**	  `SELECT * FROM STUDENTS WHERE city = ‘Berkeley’ AND age > 50;`<br>
&emsp;&emsp;&emsp;a) Estimated	  #	  Tuples	  in	  Answer:<br>
&emsp;&emsp;&emsp;b) Method	  and	  access	  path	  used:<br>
&emsp;&emsp;&emsp;c) Estimated	  #	  I/O’s	  required:<br>
&emsp;&emsp;&emsp;d) Assumptions:


---

<a id="page-7"></a>
**Page 7**

**Parallelism**<br>
Imagine	  that	  the	  CS186	  staff—5	  TAs	  and	  1	  Professor—has	  to	  grade	  300	  exams	  with	  6	  questions	  per<br>
exam.	  	  Each	  question	  was	  written	  by	  a	  different	  Member	  Of	  Staff	  (MOS),	  and	  must	  be	  graded	  by	  that<br>
MOS:	  no	  MOS	  can	  grade	  a	  question	  written	  by	  another	  MOS!<br>
**Circle	  Grading.**	  	  The	  staff	  sits	  in	  a	  circle	  to	  grade.	  	  Exams	  are	  partitioned	  into	  6	  random	  piles	  of	  50<br>
exams	  each,	  and	  each	  MOS	  gets	  one	  pile.	  	  The	  grading	  process	  works	  as	  follows:	  each	  staff	  member<br>
removes	  an	  exam	  from	  the	  top	  of	  their	  pile,	  works	  on	  it	  for	  exactly	  1	  minute	  and	  writes	  down	  a<br>
score	  for	  their	  question.	  	  They	  then	  instantly	  slide	  the	  exam	  to	  the	  bottom	  of	  the	  pile	  belonging	  to<br>
the	  MOS	  on	  their	  right.	  	  (Assume	  that	  remove	  and	  slide	  can	  happen	  concurrently	  and<br>
instantaneously).	  	  When	  a	  MOS	  sees	  an	  exam	  with	  their	  own	  question	  already	  scored,	  they	  finish.<br>
&emsp;25\. **\[1	  pt\]**	  How	  many	  minutes	  pass	  in	  the	  Circle	  Grading	  Scheme	  before	  the	  last	  MOS	  finishes?<br>
**FedEx	  Grading.**	  	  Imagine	  the	  following	  grading	  scheme.	  	  The	  professor	  leaves	  town	  to	  participate	  in<br>
a	  2-­‐day	  "research	  retreat"	  at	  Lake	  Tahoe.	  	  The	  5	  TAs	  go	  home	  to	  5	  different	  cities	  (none	  of	  them<br>
Berkeley)	  for	  summer	  break.	  	  The	  Professor	  tells	  each	  TA	  to	  take	  home	  60	  exams,	  use	  FedEx	  to	  pass<br>
the	  exams	  among	  them	  as	  needed,	  and	  then	  send	  the	  exams	  back	  to	  him	  in	  Berkeley.	  	  Assume	  that<br>
FedEx	  accepts	  packages	  until	  5PM,	  and	  delivers	  the	  next	  day	  by	  9AM	  for	  a	  fixed	  cost	  of	  $10	  per<br>
package,	  regardless	  of	  size.	  	  Assume	  also	  that	  TAs	  have	  nothing	  better	  to	  do	  on	  a	  summer	  day	  than<br>
grade	  exams,	  at	  the	  rate	  of	  exactly	  1	  question	  per	  exam	  per	  minute.	  	  Finally,	  recall	  that	  the	  final<br>
results	  have	  to	  arrive	  in	  Berkeley	  at	  the	  professor's	  office	  so	  he	  can	  grade	  his	  question	  at	  the	  end.<br>
&emsp;26\. **\[2	  pts\]**	  Consider	  optimizing	  the	  FedEx	  Grading	  Scheme	  to	  minimize	  time	  to<br>
&emsp;&emsp;completion.	  	  How	  many	  days	  does	  it	  take	  from	  the	  start	  until	  the	  Prof.	  gets	  the	  exams?<br>
&emsp;27\. **\[2	  pts\]**	  Now	  consider	  optimizing	  the	  Distributed	  Grading	  Scheme	  to	  minimize	  FedEx	  cost.<br>
&emsp;&emsp;How	  much	  money	  would	  be	  required	  to	  complete	  the	  grading	  process	  at	  minimum?<br>
&emsp;28\. **\[1	  pt\]**	  Is	  it	  possible	  to	  optimize	  both	  time-­‐to-­‐completion	  and	  FedEx	  cost?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;A. Yes,	  because	  the	  time-­‐optimal	  algorithm	  minimizes	  communication	  as	  well.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;B. Yes,	  in	  the	  average	  case	  analysis,	  but	  No	  in	  the	  worst	  case	  analysis.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;C. No,	  because	  of	  inherent	  tradeoffs	  between	  latency	  and	  bandwidth.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;D. No,	  because	  minimizing	  FedEx	  cost	  requires	  time	  to	  form	  bigger	  batches.<br>
**Sorting.**	  	  After	  grading,	  the	  exams	  must	  be	  sorted	  by	  (Lastname,	  Firstname).	  	  This	  will	  take	  time.<br>
Assuming	  the	  MOS	  are	  all	  in	  one	  place,	  there	  are	  two	  proposals	  for	  how	  to	  proceed:<br>
TED's	  PROPOSAL:	  “Let’s	  range-­‐partition	  by	  LastName.	  	  We	  create	  6	  "bins"	  of	  exams:	  one	  bin	  each<br>
for	  LastNames	  beginning	  with	  \[A-­‐D\],	  \[E-­‐H\],	  \[I-­‐L\],	  \[M-­‐P\],	  \[Q-­‐T\],	  and	  \[W-­‐Z\].	  	  In	  the	  first	  phase	  we<br>
shuffle—go	  through	  our	  subpiles	  and	  drop	  exams	  into	  the	  appropriate	  bins.	  	  In	  the	  second	  phase,<br>
each	  of	  us	  sorts	  one	  bin	  independently,	  and	  then	  we	  just	  concatenate	  the	  results”.<br>
JIM's	  PROPOSAL:	  “Let's	  each	  just	  sort	  the	  subpile	  we	  have.	  	  We	  can	  then	  merge	  our	  sorted	  runs”.<br>
Assume	  that	  shuffle	  and	  merge	  take	  the	  same	  amount	  of	  time,	  and	  concatenate	  takes	  zero<br>
time.	  	  Assume	  also	  that	  each	  MOS	  sorts	  at	  the	  same	  speed,	  O(nlogn)	  in	  the	  number	  of	  exams.<br>
&emsp;29\. **\[1	  pt\]**	  Which	  proposal	  is	  more	  efficient:	  Ted’s	  or	  Jim’s?	  	  Explain	  your	  answer	  in	  five	  words	  or<br>
&emsp;&emsp;less.	  	  (Over-­‐long	  answers	  may	  be	  penalized!)


---

<a id="page-8"></a>
**Page 8**

**SQL**<br>
It	  is	  almost	  time	  for	  the	  Summer	  Olympics,	  during	  which	  stressed-­‐out	  athletes	  get	  tested	  and	  scored<br>
while	  we	  sit	  on	  the	  couch.	  	  That	  will	  be	  nice.<br>
In	  this	  question	  we	  assume	  a	  very	  simple	  database	  for	  scoring	  athletes	  in	  their	  Olympic	  events,	  with<br>
primary	  keys	  underlined,	  and	  integrity	  constraints	  as	  noted:<br>
**Athletes**(sid	  integer,	  name	  text,	  country	  text)<br>
**Events**(eid	  integer,	  sid	  integer,	  score	  float,	  ename	  text)<br>
&emsp;&emsp;sid	  foreign	  key	  to	  Athletes.<br>
&emsp;&emsp;score	  ranges	  from	  0	  to	  10<br>
&emsp;&emsp;score	  NOT	  NULL<br>
&emsp;30\. **\[6	  pts\]**	  For	  each	  query	  (a)-­‐(f),	  write	  down	  the	  letter	  of	  the	  corresponding	  English<br>
&emsp;&emsp;description	  on	  the	  bottom	  (A)-­‐(F).	  	  Each	  query	  matches	  only	  one	  description,	  but	  it	  is<br>
&emsp;&emsp;possible	  for	  each	  description	  to	  correspond	  to	  multiple	  queries	  (or	  none!)

&emsp;`a)` `SELECT DISTINCT A.sid`    `d)` `SELECT A.sid`<br>
&emsp;&emsp;`FROM Athletes A, Events E`      `FROM Athletes A`<br>
&emsp;&emsp;`WHERE E.sid = A.sid`     `WHERE 1 >=`<br>
&emsp;&emsp;`AND E.score < 10;`        `(SELECT COUNT(*)`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`FROM Events E`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`WHERE E.sid = A.sid`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`AND E.score = 10);`<br>
&emsp;`b)` `SELECT A.sid`<br>
&emsp;&emsp;`FROM Athletes A` `e)` `SELECT DISTINCT A.sid`<br>
&emsp;&emsp;`WHERE A.sid NOT IN (`      `FROM Athletes A`<br>
&emsp;&emsp;`SELECT E.sid`     `WHERE A.sid NOT IN (`<br>
&emsp;&emsp;`FROM Events E`       `SELECT E.sid`<br>
&emsp;&emsp;`WHERE E.score < 10);`         `FROM Events E`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`WHERE E.score = 10);`<br>
&emsp;`c)` `SELECT DISTINCT A.sid`<br>
&emsp;&emsp;`FROM Athletes A, Events E` `f)` `SELECT A.sid`<br>
&emsp;&emsp;`WHERE E.score = 10;`      `FROM Athletes A, Events E`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`WHERE A.sid = E.sid`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`GROUP BY A.sid`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`HAVING AVG(E.score) = 10;`

&emsp;A. Athletes	  who	  got	  no	  10	  scores<br>
&emsp;B. Athletes	  who	  got	  at	  least	  one	  10	  score<br>
&emsp;C. Athletes	  who	  got	  at	  least	  one	  score	  less	  than	  10<br>
&emsp;D. Athletes	  who	  got	  “straight	  10’s”:	  i.e.,	  a	  10	  score	  in	  every	  event	  they	  competed	  in<br>
&emsp;E. Athletes	  who	  got	  at	  most	  one	  10	  score<br>
&emsp;F. Athletes	  who	  competed	  in	  every	  event.


---

<a id="page-9"></a>
**Page 9**

**Database	  Design**<br>
GSL	  (GOMTV	  Global	  Starcraft	  II	  League)	  three-­‐time	  champion	  Lim	  Jae	  Duk	  has	  contacted	  you	  to	  ask<br>
for	  help	  in	  normalizing	  the	  GSL's	  database	  of	  1v1	  Starcraft	  II	  matches.	  	  He	  provides	  you	  the<br>
following	  CREATE	  TABLE	  statement,	  as	  well	  as	  the	  following	  additional	  functional	  dependencies.<br>
**SQL	  CREATE	  TABLE	  Statement:**	     **Additional	  Functional	  Dependencies:**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;M	  →	  D<br>
`CREATE TABLE GSL`<br>
`(match_datetime timestamp, --` `D`    E	  →	  R<br>
`match_id, int PRIMARY KEY, --` `M`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;N1	  →	  G1	  ,	  C1<br>
`player1_name text,`        `--` `N``1`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;N2	  →	  G2	  ,	  C2<br>
`player2_name text,`        `--` `N``2`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;G1	  ,	  C1	  →	  N1<br>
`player1_gamertag text,`    `--` `G``1`<br>
`player2_gamertag text,`    `--` `G``2`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;G2	  ,	  C2	  →	  N2<br>
`player1_charid int,`     `--` `C``1`<br>
`player2_charid int,`     `--` `C``2`<br>
`commentator_name text,`    `--` `E`<br>
`commentator_rating int); --` `R`

&emsp;31\. **\[2	  pts\]**	  Decompose	  the	  above	  table	  into	  BCNF	  using	  the	  functional	  dependencies	  in	  order,<br>
&emsp;&emsp;considering	  the	  PRIMARY	  KEY	  as	  the	  first	  functional	  dependency.	  	  In	  your	  answer	  show<br>
&emsp;&emsp;only	  the	  tables	  that	  result	  from	  the	  decomposition.<br>
&emsp;32\. **\[1	  pt\]**	  True/False:	  This	  decomposition	  is	  lossless	  join.

&emsp;Lim	  Jae	  Duk	  has	  also	  requested	  an	  ER	  diagram	  of	  the	  decomposed	  table.	  	  He	  has	  translated	  the<br>
&emsp;above	  CREATE	  TABLE	  declaration	  and	  functional	  dependencies	  into	  ER-­‐diagram-­‐speak.	  	  He<br>
&emsp;provides	  you	  with	  the	  following	  translation:<br>
&emsp;•    Each	  match	  participates	  in	  the	  GSL	  relationship	  at	  most	  once,	  with	  2	  Players	  and	  1<br>
&emsp;&emsp;Commentator.<br>
&emsp;•    id	  determines	  datetime	  for	  Match.<br>
&emsp;•    A	  Commentator's	  name	  determines	  his	  or	  her	  rating.<br>
&emsp;•    A	  Player's	  name	  determines	  his	  or	  her	  Character's	  charid	  and	  gamertag,	  if	  that	  player	  has	  a<br>
&emsp;&emsp;Character.<br>
&emsp;•    A	  Character's	  gamertag	  and	  charid	  determines	  the	  name	  of	  the	  Player,	  if	  that	  Character	  has<br>
&emsp;&emsp;a	  Player.<br>
&emsp;33\. **\[4	  pts\]**	  Complete	  the	  ER	  diagram	  on	  the	  answer	  sheet	  to	  reflect	  the	  translation	  above.	  	  The<br>
&emsp;&emsp;only	  things	  you	  need	  to	  do	  are	  (i)	  add	  lines	  &	  arrows	  and	  (ii)	  add	  underlining	  to	  indicate<br>
&emsp;&emsp;primary	  keys.


---

<a id="page-10"></a>
**Page 10**

Name:	  Class	  Account:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;cs186-­‐\_\_\_\_\_\_\_\_\_\_\_\_

&emsp;&emsp;&emsp;**Similarity	  Joins**

&emsp;&emsp;&emsp;**1a.	  	  	  Line	  #\_\_\_\_\_\_\_\_\_\_\_\_\_\_**	     **1b.**	  	  (A-­‐D)**\_\_\_\_\_\_\_\_\_\_\_\_\_\_	   1c.**	  	  (A-­‐D)**\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

&emsp;&emsp;&emsp;**2a.**	  	  (A-­‐C)**\_\_\_\_\_\_\_\_\_\_\_\_**	     **2b.**	  	  (A-­‐C)**\_\_\_\_\_\_\_\_\_\_\_\_**	     **2c.**)	  	  **i.\_\_\_\_\_\_\_\_	  ii.	  .\_\_\_\_\_\_\_\_	  iii.	  \_\_\_\_\_\_\_\_\_	  iv.	  .\_\_\_\_\_\_\_**

&emsp;&emsp;&emsp;**Logging	  and	  Recovery**

&emsp;&emsp;&emsp;**3.	  undoNextLSN=\_\_\_\_\_\_\_\_\_\_\_\_\_\_**


![Figure on page 10](figures/questions-p10-fig06.png)

&emsp;&emsp;&emsp;**4.**


![Figure on page 10](figures/questions-p10-fig07.png)

&emsp;&emsp;&emsp;**5.	  	  LSN:	  \_\_\_\_\_\_\_\_\_\_\_\_\_\_**	     **6.	  	  LSNS:	  \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

&emsp;&emsp;&emsp;**7.	  	  LSNs:	  \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**


![Figure on page 10](figures/questions-p10-fig08.png)

&emsp;**8.**


---

<a id="page-11"></a>
**Page 11**

Name:	  Class	  Account:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;cs186-­‐\_\_\_\_\_\_\_\_\_\_\_\_<br>
&emsp;&emsp;&emsp;**Concurrency	  Control**<br>
&emsp;&emsp;&emsp;**9.**	     **10.**	     **11.**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`◯` 	  T	  	  	  	  	  	  	  	  	  `◯` 	  F	  	     `◯` 	  T	  	  	  	  	  	  	  	  	  `◯` 	  F	  	     `◯` 	  T	  	  	  	  	  	  	  	  	  `◯` 	  F<br>
&emsp;&emsp;&emsp;**12.**	     **13.**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`◯` 	  T	  	  	  	  	  	  	  	  	  `◯` 	  F	  	     `◯` 	  T	  	  	  	  	  	  	  	  	  `◯` 	  F

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`◯` 	  T	  	  	  	  	  	  	  	  	  `◯` 	  F<br>
&emsp;&emsp;&emsp;**14.	  	  After	  step	  	  \_\_\_\_\_\_\_\_\_\_\_\_\_\_**	     **15.	  	  After	  step	  	  \_\_\_\_\_\_\_\_\_\_\_\_\_\_**	   **16.**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`◯` 	  T	  	  	  	  	  	  	  	  	  `◯` 	  F<br>
&emsp;&emsp;&emsp;**17.**	  	  	     **18.	  	  Lock:	  \_\_\_\_\_\_\_\_\_\_\_\_\_\_**

&emsp;&emsp;&emsp;**Query	  Processing	  and	  Optimization**

&emsp;&emsp;&emsp;**19.	  	  \_\_\_\_\_\_\_\_\_\_\_\_\_\_	  I/Os**	      **20.	  	  	  	  	  \_\_\_\_\_\_\_\_\_\_\_\_\_\_	  I/Os**	     **21.	  \_\_\_\_\_\_\_\_\_\_\_\_\_\_	  I/Os**

&emsp;&emsp;&emsp;**22a.	  \_\_\_\_\_\_\_\_\_\_\_\_\_\_	  tuples**	     **22b.	  \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

&emsp;&emsp;&emsp;**22c.	  \_\_\_\_\_\_\_\_\_\_\_\_\_\_	  I/Os**

&emsp;&emsp;&emsp;**23a.	  \_\_\_\_\_\_\_\_\_\_\_\_\_\_	  tuples**	     **23b.	  \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

&emsp;&emsp;&emsp;**23c.	  \_\_\_\_\_\_\_\_\_\_\_\_\_\_	  I/Os**

&emsp;&emsp;&emsp;**24a.	  \_\_\_\_\_\_\_\_\_\_\_\_\_\_	  tuples**	     **24b.	  \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

&emsp;&emsp;&emsp;**24c.	  \_\_\_\_\_\_\_\_\_\_\_\_\_\_	  I/Os**


---

<a id="page-12"></a>
**Page 12**

Name:	  Class	  Account:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;cs186-­‐\_\_\_\_\_\_\_\_\_\_\_\_<br>
&emsp;&emsp;&emsp;**Parallelism**

&emsp;&emsp;&emsp;**25.	  \_\_\_\_\_\_\_\_\_\_\_\_\_\_	  minutes**	     **26.	  	  \_\_\_\_\_\_\_\_\_\_\_\_\_\_	  days**	   	     **27.	  $\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

&emsp;&emsp;&emsp;**28.	  \_\_\_\_\_\_\_\_\_\_\_\_\_\_**	     **29.**

&emsp;&emsp;&emsp;**SQL**

&emsp;&emsp;&emsp;**30a.**	  (A-­‐F)**\_\_\_\_\_\_\_\_\_\_\_\_\_\_**	  	     **30b.**	  (A-­‐F)**\_\_\_\_\_\_\_\_\_\_\_\_\_\_**	  	     **30c.**	  (A-­‐F)**\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

&emsp;&emsp;&emsp;**30d.**	  (A-­‐F)**\_\_\_\_\_\_\_\_\_\_\_\_\_\_**	  	     **30e.**	  (A-­‐F)**\_\_\_\_\_\_\_\_\_\_\_\_\_\_**	  	     **30f.**	  (A-­‐F)**\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

&emsp;&emsp;&emsp;**Database	  Design**

&emsp;&emsp;&emsp;**31.**

&emsp;&emsp;&emsp;**32.**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;`◯` 	  T	  	  	  	  	  	  	  	  	  `◯` 	  F


---

<a id="page-13"></a>
**Page 13**

Name:	  Class	  Account:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;cs186-­‐\_\_\_\_\_\_\_\_\_\_\_\_

&emsp;&emsp;&emsp;**33.**


![Figure on page 13](figures/questions-p13-fig09.png)


![Figure on page 13](figures/questions-p13-fig10.png)


![Figure on page 13](figures/questions-p13-fig11.png)


![Figure on page 13](figures/questions-p13-fig12.png)

