# Berkeley CS162 Spring 1993: Midterm 1: Questions

> Copied from the original: <https://hkn.eecs.berkeley.edu/exams/course/cs/162>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CS      Midterm   Exam<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;erOctob   ,   		<br>
&emsp;ourY   Name:<br>
&emsp;.M.):Lecture   (A.M.   or   P<br>
General   Information:<br>
yerutesevouokoThis   is   a   closed   b   examination.   Y   ha   0   min   to   answ   as   man   questions<br>
heginningtheseserbumossible.as   p   The   n   in   paren   at   the   b   of   eac   question   indicates<br>
ritetsoinentsoinerbumthe   n   of   p   giv   to   the   question;   there   are   0   p   in   all.   W   all   of<br>
ouossibleersoureer.ersoury   answ   directly   on   this   pap   Mak   y   answ   as   concise   as   p   (y<br>
ailableveryervneedn't   co   ev   a   nano-acre   with   writing).<br>
&emsp;terpretation,eneelievouIf   there   is   something   in   a   question   that   y   b   is   op   to   in<br>
er.ourourterpretthen   please   go   ahead   and   in   BUT   state   y   assumptions   in   y   answ<br>
ts)oinProblem   :   (   p<br>
ttencets,winghorF   eac   of   the   follo   statemen   indicate   in   one   sen   whether   the   statemen<br>
.yis   true   or   false,   and   wh<br>
cessor,eratingop(a)   If   a   set   of   co   threads   can   correctly   time-share   one   pro   then   they<br>
&emsp;cessor.ultiprocessorswill   correctly   execute   on   separate   pro   of   a   m<br>
eronseeragevolicyheduling(b)   The   CPU   sc   p   that   minimizes   a   resp   time   can   nev<br>
&emsp;ation.lead   to   starv<br>
tsantationying(c)   If   a   system   emplo   only   segmen   w   to   enlarge   an   address   space,<br>
&emsp;tossibleysait   is   alw   p   if   the   total   amoun   of   free   memory   is   bigger   than   the<br>
&emsp;t.requested   enlargemen<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;


---

<a id="page-2"></a>
**Page 2**

ts)oinProblem   :   (   p<br>
tencewinghorF   eac   of   the   follo   items,   write   a   one   sen   denition:<br>
terrupt(a)   In<br>
heeciativully(b)   F   asso   cac<br>
orking(c)   W   set<br>
(d)   Throughput<br>
ts)oinProblem   :   (   p<br>
hedulingossibleorst(a)   What   is   the   w   p   CPU   sc   algorithm   {   the   one   that   yields   the<br>
&emsp;ustonseeragevorstw   a   resp   time?   Assume   that   the   algorithm   m   run   a   thread<br>
&emsp;erhead.vhtextailable,vif   there   is   one   a   and   that   a   con   switc   has   zero   o<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;


---

<a id="page-3"></a>
**Page 3**

t'd):Problem      (con<br>
hedulingossibleorsteer(b)   Can   round   robin   ev   b   the   w   p   CPU   sc   algorithm?   If   so,<br>
&emsp;yunder   what   circumstances?   If   not,   explain   wh   not.<br>
hedulingossibleorsteerO(c)   Can   FIF   ev   b   the   w   p   CPU   sc   algorithm?   If   so,   under<br>
&emsp;ywhat   circumstances?   If   not,   explain   wh   not.<br>
ts)oinProblem   :   (0   p<br>
eingt,kcConsider   the   clo   algorithm   for   page   replacemen   b   used   in   its   simplest   form<br>
ancedkct,hance"(\\rst-c   replacemen   where   the   clo   is   only   adv   on   a   page   fault,   not   in<br>
ysicalosekground).the   bac   Supp   that   there   are   P   pages   of   ph   memory   in   the   system<br>
ccurred.evaltervervand   that   o   a   particular   in   of   time   F   page   faults   ha   o<br>
&emsp;kcerbumumumExpress   the   minim   and   maxim   n   of   times   that   the   clo   hand   could<br>
al,tervancedeenevossiblyp   ha   b   adv   during   the   time   in   as   a   function   of   P   and   F.<br>
okingyoutorry(Don't   w   ab   \\o   b   one"   errors,   I'm   just   lo   for   the   basic   idea.)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;


---

<a id="page-4"></a>
**Page 4**

ts)oinProblem   :   (   p<br>
ouweouryeenevouY   ha   b   hired   b   y   professor   to   b   a   grader   for   CS   .   Belo   y   will<br>
osedhort.nd   some   sample   solutions   to   a   concurrency   assignmen   F   eac   prop   solution,<br>
ork,esws,mark   it   either   (i)   \\correct",   if   it   has   no   a   (ii)   \\incorrect",   if   it   do   not   w<br>
youesn't.orksor   (iii)   \\dangerous",   if   it   sometimes   w   but   sometimes   do   Y   ma   assume<br>
yustouariables,yleyleeither   Mesa-st   or   Hoare-st   condition   v   but   if   it   matters,   y   m   sa<br>
ouhwhic   one   y   are   using.<br>
&emsp;erythingIf   the   solution   is   incorrect   or   dangerous,   explain   ev   wrong   with   the<br>
detsolution,   and   add   a   minimal   amoun   of   co   to   correct   the   problem.   (NOTE:<br>
videedettdon't   just   implemen   a   completely   dieren   solution   {   use   the   co   w   pro   as   a<br>
base.)<br>
&emsp;yerhronizationHere   is   the   sync   problem:   A   particular   riv   crossing   is   shared   b<br>
er,oatothb   cannibals   and   missionaries.   A   b   is   used   to   cross   the   riv   but   it   only<br>
teeysausteople,seats   three   p   and   m   alw   carry   a   full   load.   In   order   to   guaran   the<br>
owouysafet   of   the   missionaries,   y   cannot   put   one   missionary   and   t   cannibals   in   the<br>
ouldecauseoatsame   b   (b   the   cannibals   w   gang   up   and   eat   the   missionary),   but   all<br>
rrivesceduresobinationsother   com   are   legal.   Tw   pro   are   needed:   MissionaryA   and<br>
eresyrrives,alACannib   called   b   a   missionary   or   cannibal   when   it   arriv   at   the   riv   bank.<br>
oatloads;toceduresThe   pro   arrange   the   arriving   missionaries   and   cannibals   in   safe   b<br>
at,owBoatowBooatonce   the   b   is   full,   one   thread   calls   R   and   after   the   call   to   R   the<br>
aiting:eceduresthree   pro   then   return.   There   should   also   b   no   undue   w   missionaries<br>
oatload.aitand   cannibals   should   not   w   if   there   are   enough   of   them   for   a   safe   b<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;


---

<a id="page-5"></a>
**Page 5**

&emsp;osedHere   is   one   prop   solution:<br>
int   numMissionaries   =   0,   numCannibals   =   0;<br>
Lock   \*mutex;<br>
Condition   \*missWait,   \*cannWait;<br>
void   RowBoat()   {printf("Row,   row,   row   your   boat");}<br>
void   MissionaryArrives()   {<br>
mutex-\>Acquire();<br>
if   (numMissionaries   ==   )   {<br>
&emsp;missWait-\>Signal();<br>
&emsp;missWait-\>Signal();<br>
&emsp;RowBoat();<br>
else   if   (numMissionaries   ==      &&   numCannibals   ==   )   {<br>
&emsp;missWait-\>Signal();<br>
&emsp;cannWait-\>Signal();<br>
&emsp;RowBoat();<br>
}   else   {<br>
&emsp;numMissionaries++;<br>
&emsp;missionaryWait-\>Wait(mutex);<br>
&emsp;numMissionaries--;<br>
}<br>
mutex-\>Release();<br>
}<br>
void   CannibalArrives()   {<br>
mutex-\>Acquire();<br>
if   (numCannibals   ==   )   {<br>
&emsp;cannWait-\>Signal();<br>
&emsp;cannWait-\>Signal();<br>
&emsp;RowBoat();<br>
else   if   (numMissionaries   ==   )   {<br>
&emsp;missWait-\>Signal();<br>
&emsp;missWait-\>Signal();<br>
&emsp;RowBoat();<br>
}   else   {<br>
&emsp;numCannibals++;<br>
&emsp;cannWait-\>Wait(mutex);<br>
&emsp;numCannibals--;<br>
}<br>
mutex-\>Release();<br>
}<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;


---

<a id="page-6"></a>
**Page 6**

&emsp;ationtialotenoutorryosedHere   is   another   prop   solution   (don't   w   ab   the   p   starv<br>
heduleresersonArrivopdue   to   the   lo   in   P   {   the   sc   causes   lots   of   random   timeslices!):<br>
Semaphore   \*boatCount   =   new   Sempahore();   //   initial   value   =   <br>
int   numMissionaries   =   0,   numCannibals   =   0;<br>
Lock   \*boatLock;<br>
Condition   \*boatWait;<br>
bool   success;<br>
void   RowBoat()   {   success   =   TRUE;}<br>
es);void   MissionaryArrives()   {   PersonArrives(&numMissionari   }<br>
bals);void   CannibalArrives()   {   PersonArrives(&numCanni   }<br>
void   PersonArrives(int   \*numPeople)   {<br>
for   (;;)   {<br>
&emsp;boatCount-\>P();<br>
&emsp;\*numPeople++;<br>
&emsp;if   ((numMissionaries   +   numCannibals)   \<   )   {<br>
&emsp;&emsp;boatLock-\>Acquire();<br>
&emsp;&emsp;boatWait-\>Wait(boatLock);<br>
&emsp;}   else   {<br>
&emsp;&emsp;if   (!(numMissionaries   ==   )   &&   (numCannibals   ==   ))<br>
&emsp;&emsp;&emsp;RowBoat();<br>
&emsp;&emsp;else<br>
&emsp;&emsp;&emsp;success   =   FALSE;<br>
&emsp;&emsp;boatWait-\>Signal();<br>
&emsp;&emsp;boatWait-\>Signal();<br>
&emsp;}<br>
&emsp;numPeople-\>P();<br>
&emsp;boatCount-\>V();<br>
&emsp;if   (success)<br>
&emsp;&emsp;return;<br>
}<br>
}<br>
ts)oinProblem   :   Extra   Credit   (   p<br>
erserbumeGiv   an   engineering   estimate   (to   within   a   factor   of      or   so)   of   the   n   of   barb<br>
d.ourand   hairdressers   in   the   United   States.   Explain   y   metho<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;

