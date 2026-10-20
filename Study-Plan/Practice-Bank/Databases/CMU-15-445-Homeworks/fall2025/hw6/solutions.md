# CMU 15-445 Fall 2025: Homework 6: Official solutions

> Copied from the original: <https://15445.courses.cs.cmu.edu/fall2025/assignments.html>. Text and figures are taken from the PDF as is; nothing was answered or rewritten. The original PDF is in this folder.


---

<a id="page-1"></a>
**Page 1**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;CARNEGIE MELLON UNIVERSITY<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;COMPUTER SCIENCE DEPARTMENT<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;15-445/645 – DATABASE SYSTEMS (FALL 2025)<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;PROF. ANDY PAVLO

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #6 (by Will ) – Solutions<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Due: **Sunday December 7, 2025 @ 11:59pm**

**IMPORTANT:**<br>
&emsp;• Enter all of your answers into **Gradescope by 11:59pm on Sunday December 7, 2025**.<br>
&emsp;• **Plagiarism**: Homework may be discussed with other students, but all homework is to be<br>
&emsp;&emsp;completed **individually**.<br>
&emsp;• **You have to use this PDF for all of your answers.**<br>
For your information:<br>
&emsp;• Graded out of **100** points; **3** questions total<br>
&emsp;• Each part is all or nothing. There is no partial credit.<br>
&emsp;Revision : 2025/12/09 19:06

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Question   Points   Score<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;ARIES   48<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Logging and Recovery   32<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Distributed Databases   20<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Total:   100

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;1


---

<a id="page-2"></a>
**Page 2**

15-445/645 (Fall 2025)   Homework #6   Page 2 of 9


### **Question 1: ARIES . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . \[48 points\]**

&emsp;Consider the sequence of ARIES undo/redo log records with fuzzy checkpointing in Figure 1.<br>
&emsp;The transaction ids are T1, T2, T3, and T4. The object ids are A, B, C, D, and E. Each object<br>
&emsp;is stored in a separate page, and the page id for an object is the same as its object id.<br>
&emsp;**Reminder:** Recall the following information about the ARIES log record format:<br>
&emsp;&emsp;• The number at the start of each log record indicates the log sequence number (LSN).<br>
&emsp;&emsp;• Each record for a transaction write includes the LSN, the transaction id, the log record<br>
&emsp;&emsp;&emsp;type, and the previous LSN.<br>
&emsp;&emsp;• For updates, the record also includes the object id, the before-image (former value) of<br>
&emsp;&emsp;&emsp;the object and the after-image (new value) of the object, in that order.<br>
&emsp;&emsp;• Compensation log records contain the same information as update records and also the<br>
&emsp;&emsp;&emsp;`undoNextLSN` (i.e., the next LSN that needs to be undone).

&emsp;&emsp;&emsp;&emsp;**LSN**   **RECORD**<br>
&emsp;&emsp;&emsp;&emsp;`1000`   `<T1,` `BEGIN,` `prevLSN=`∅`>`<br>
&emsp;&emsp;&emsp;&emsp;`1001`   `<T2,` `BEGIN,` `prevLSN=`∅`>`<br>
&emsp;&emsp;&emsp;&emsp;`1002`   `<T3,` `BEGIN,` `prevLSN=`∅`>`<br>
&emsp;&emsp;&emsp;&emsp;`1003`   `<T1,` `UPDATE,` `prevLSN=1000,` `A,` `1,` `2>`<br>
&emsp;&emsp;&emsp;&emsp;`1004`   `<T3,` `UPDATE,` `prevLSN=1002,` `C,` `1,` `2>`<br>
&emsp;&emsp;&emsp;&emsp;`1005`   `<T3,` `COMMIT,` `prevLSN=1004` `>`<br>
&emsp;&emsp;&emsp;&emsp;`1006`   `<``CHECKPOINT-BEGIN``>`<br>
&emsp;&emsp;&emsp;&emsp;`1007`   `<T1,` `UPDATE,` `prevLSN=1003,` `B,` `1,` `2>`<br>
&emsp;&emsp;&emsp;&emsp;`1008`   `<T4,` `BEGIN,` `prevLSN=`∅`>`<br>
&emsp;&emsp;&emsp;&emsp;`1009`   `<T4,` `UPDATE,` `prevLSN=1008,` `C,` `2,` `3>`<br>
&emsp;&emsp;&emsp;&emsp;`1010`   `<``CHECKPOINT-END``,` `DPT=`{`C`}`,` `ATT=`{`???`}`>`<br>
&emsp;&emsp;&emsp;&emsp;`1011`   `<T2,` `UPDATE,` `prevLSN=1001,` `D,` `1,` `2>`<br>
&emsp;&emsp;&emsp;&emsp;`1012`   `<T4,` `UPDATE,` `prevLSN=1009,` `E,` `1,` `2>`<br>
&emsp;&emsp;&emsp;&emsp;`1013`   `<T3,` `TXN-END,` `prevLSN=1005` `>`<br>
&emsp;&emsp;&emsp;&emsp;`1014`   `<``CHECKPOINT-BEGIN``>`<br>
&emsp;&emsp;&emsp;&emsp;`1015`   `<T1,` `UPDATE,` `prevLSN=1007,` `A,` `2,` `3>`<br>
&emsp;&emsp;&emsp;&emsp;`1016`   `<T4,` `UPDATE,` `prevLSN=1012,` `E,` `2,` `3>`<br>
&emsp;&emsp;&emsp;&emsp;`1017`   `<``CHECKPOINT-END``,` `DPT=`{`???`}`,` `ATT=`{`???`}`>`<br>
&emsp;&emsp;&emsp;&emsp;`1018`   `<T1,` `UPDATE,` `prevLSN=1015,` `A,` `3,` `4>`<br>
&emsp;&emsp;&emsp;&emsp;`1019`   `<T4,` `ABORT,` `prevLSN=1016` `>`<br>
&emsp;&emsp;&emsp;&emsp;`1020`   `<``CHECKPOINT-BEGIN``>`<br>
&emsp;&emsp;&emsp;&emsp;`1021`   `<T1,` `COMMIT,` `prevLSN=1018` `>`<br>
&emsp;&emsp;&emsp;&emsp;`1022`   `<T4,` `CLR,` `prevLSN=1019,` `E,` `3,` `2,` `undoNextLSN=1012` `>`<br>
&emsp;&emsp;&emsp;&emsp;`1023`   `<T1,` `TXN-END,` `prevLSN=1021` `>`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**CRASH!**

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Figure 1: ARIES Write-Ahead Log


### Question 1 continues...


---

<a id="page-3"></a>
**Page 3**

15-445/645 (Fall 2025)   Homework #6   Page 3 of 9

&emsp;(a) Suppose the database started with a clean state (no active transactions and no dirty pages)<br>
&emsp;&emsp;&emsp;at the start of the log, a background thread periodically flushes dirty buffer pool pages to<br>
&emsp;&emsp;&emsp;reduce eviction and recovery costs, and a crash occurs after the log record `1010` is flushed<br>
&emsp;&emsp;&emsp;to disk.<br>
&emsp;&emsp;&emsp;i. **\[4 points\]** For **A**, which states are possibly stored on disk before recovery starts?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ `A=2`<br>
&emsp;&emsp;&emsp;&emsp;☐  `A=1`   ☐  `A=3`   ☐  Cannot be determined<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** Page A was not in the DPT. Hence `A=2`.<br>
&emsp;&emsp;&emsp;ii. **\[4 points\]** For **B**, which states are possibly stored on disk before recovery starts?<br>
&emsp;&emsp;&emsp;&emsp;☒ `B=1`   ☒ `B=2`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  Cannot be determined<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** Page B was not in the DPT, but there has been a change after the check-<br>
&emsp;&emsp;&emsp;&emsp;point starts. Hence `B=1` or `B=2`.<br>
&emsp;&emsp;&emsp;iii. **\[4 points\]** For **C**, which states are possibly stored on disk before recovery starts?<br>
&emsp;&emsp;&emsp;&emsp;☒ `C=1`   ☒ `C=2`   ☒ `C=3`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  Cannot be determined<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** Page C was in the DPT at LSN=10. Hence it can be any value.<br>
&emsp;&emsp;&emsp;iv. **\[4 points\]** Select the transactions that would be in the ATT at `1010`.<br>
&emsp;&emsp;&emsp;&emsp;☒ `T1`   ☒ `T2`   ☒ `T3`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  `T4`   ☐  Cannot be determined<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** `T4` has not started as of `1006`. `T3`’s TXN-END log has not been written<br>
&emsp;&emsp;&emsp;&emsp;yet so it is still in the ATT.<br>
&emsp;(b) Suppose the database started with a clean state (no active transactions and no dirty pages)<br>
&emsp;&emsp;&emsp;at the start of the log, a background thread periodically flushes dirty buffer pool pages to<br>
&emsp;&emsp;&emsp;reduce eviction and recovery costs, and a crash occurs after the log record `1017` is flushed<br>
&emsp;&emsp;&emsp;to disk.<br>
&emsp;&emsp;&emsp;i. **\[4 points\]** Select the transactions that would be in the ATT at `1017`.<br>
&emsp;&emsp;&emsp;&emsp;☒ `T1`   ☒ `T2`   ☒ `T4`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  `T3`   ☐  Cannot be determined<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** `T3`’s TXN-END log has been written so it is no longer in the ATT.<br>
&emsp;&emsp;&emsp;ii. **\[6 points\]** Select all possible values of DPT at `1017`.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ `B`   ☒ `C`   ☒ `D`   ☒ `E`   ☒ `B,` `C`   ☒ `C,` `D`   ☒ `D,` `E`<br>
&emsp;&emsp;&emsp;&emsp;☐  `A`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ `B,` `C,` `D`   ☒ `C,` `D,` `E`<br>
&emsp;&emsp;&emsp;&emsp;☐  `A,` `B,` `C`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ `B,` `C,` `D,` `E`<br>
&emsp;&emsp;&emsp;&emsp;☐  `A,` `B,` `C,` `D`   ☐  `A,` `C,` `D,` `E`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **Empty**<br>
&emsp;&emsp;&emsp;&emsp;☐  `A,` `B,` `C,` `D,` `E`<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** We know `A` was clean. `B,` `C,` `D,` `E` were dirtied between `1006` and `1014`.<br>
&emsp;&emsp;&emsp;&emsp;Since the system can flush dirty pages at any time, any subset of {`B,` `C,` `D,` `E`} is<br>
&emsp;&emsp;&emsp;&emsp;possible.<br>
&emsp;(c) Suppose the database started with a clean state (no active transactions and no dirty pages)<br>
&emsp;&emsp;&emsp;at the start of the log, a background thread periodically flushes dirty buffer pool pages to<br>
&emsp;&emsp;&emsp;reduce eviction and recovery costs, and a crash occurs after the log record `1023` is flushed<br>
&emsp;&emsp;&emsp;to disk. Assume that at `1017`, the DPT is **Empty**.


### Question 1 continues...


---

<a id="page-4"></a>
**Page 4**

15-445/645 (Fall 2025)   Homework #6   Page 4 of 9

&emsp;&emsp;&emsp;i. **\[2 points\]** Which LSN should be recorded in the DBMS’s MasterRecord, which<br>
&emsp;&emsp;&emsp;&emsp;records the first LSN to be analyzed for recovery?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ `1014`<br>
&emsp;&emsp;&emsp;&emsp;☐  `1006`   ☐  `1010`   ☐  `1017`   ☐  `1020`   ☐  None of the above<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** `1014`, the LSN for the last CHECKPOINT-BEGIN corresponding to an<br>
&emsp;&emsp;&emsp;&emsp;CHECKPOINT-END that has been flushed.<br>
&emsp;&emsp;&emsp;ii. **\[2 points\]** Which pages are definitely not dirty at the time the last WAL record was<br>
&emsp;&emsp;&emsp;&emsp;written?<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **B**   ☒ **C**   ☒ **D**<br>
&emsp;&emsp;&emsp;&emsp;☐  A   ☐  E   ☐  None of the above<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** Because pages for `B,` `C,` `D` not appear in the dirty page table in the<br>
&emsp;&emsp;&emsp;&emsp;CHECKPOINT-END record (LSN `1017`), we know that `B,` `C,` `D` were flushed at<br>
&emsp;&emsp;&emsp;&emsp;some point before that checkpoint completed. Because the pages were not written<br>
&emsp;&emsp;&emsp;&emsp;again later in the log, we know it was still not dirty at the time the WAL was last<br>
&emsp;&emsp;&emsp;&emsp;written.<br>
&emsp;&emsp;&emsp;iii. **\[2 points\]** Which pages are definitely dirty at the time the database crashed? Select<br>
&emsp;&emsp;&emsp;&emsp;all correct answers.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **None of the above**<br>
&emsp;&emsp;&emsp;&emsp;☐  A   ☐  B   ☐  C   ☐  D   ☐  E<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** Independent of the information in the WAL, the background thread that<br>
&emsp;&emsp;&emsp;&emsp;flushes dirty buffer pool pages could have flushed any (or all) buffer pool pages to<br>
&emsp;&emsp;&emsp;&emsp;disk before the crash. It’s possible that no buffer pool pages are dirty at the time of<br>
&emsp;&emsp;&emsp;&emsp;the crash.<br>
&emsp;&emsp;&emsp;iv. **\[2 points\]** Which pages are maybe dirty at the time the database crashed? Select all<br>
&emsp;&emsp;&emsp;&emsp;correct answers.<br>
&emsp;&emsp;&emsp;&emsp;☒ **A**   ☒ **E**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  B   ☐  C   ☐  D   ☐  None of the above<br>
&emsp;&emsp;&emsp;v. **\[2 points\]** Which log records will definitely be redone during the ARIES **REDO**<br>
&emsp;&emsp;&emsp;&emsp;phase? Select all correct answers.<br>
&emsp;&emsp;&emsp;&emsp;☐  `1003`   ☐  `1004`   ☐  `1007`   ☐  `1009`   ☐  `1011`   ☐  `1012`   ☐  `1015`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **None of the above**<br>
&emsp;&emsp;&emsp;&emsp;☐  `1016`   ☐  `1018`   ☐  `1022`<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** Analysis of the log will identify pages A and E as potentially dirty at the<br>
&emsp;&emsp;&emsp;&emsp;time of the crash. The DBMS will then read those pages from disk and inspect the<br>
&emsp;&emsp;&emsp;&emsp;`pageLSN` on each page to determine which log entries need to be redone. Because<br>
&emsp;&emsp;&emsp;&emsp;the background thread periodically flushes dirty buffer pool pages to disk, it’s pos-<br>
&emsp;&emsp;&emsp;&emsp;sible that all pages on disk include their last logged update. In that case, none of the<br>
&emsp;&emsp;&emsp;&emsp;logged updates will be redone.<br>
&emsp;&emsp;&emsp;vi. **\[2 points\]** Which log records will definitely not be redone during the ARIES **REDO**<br>
&emsp;&emsp;&emsp;&emsp;phase? Select all correct answers.<br>
&emsp;&emsp;&emsp;&emsp;☒ `1003`   ☒ `1004`   ☒ `1007`   ☒ `1009`   ☒ `1011`   ☒ `1012`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  `1015`<br>
&emsp;&emsp;&emsp;&emsp;☐  `1016`   ☐  `1018`   ☐  `1022`   ☐  None of the above<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** Because the DPT at `1017` is empty, we know that updates before `1014`<br>
&emsp;&emsp;&emsp;&emsp;must have been flushed before the checkpoint finished. Those updates will defi-<br>
&emsp;&emsp;&emsp;&emsp;nitely not be redone.


### Question 1 continues...


---

<a id="page-5"></a>
**Page 5**

15-445/645 (Fall 2025)   Homework #6   Page 5 of 9

&emsp;&emsp;&emsp;vii. **\[2 points\]** Which log records will maybe be redone during the ARIES **REDO** phase?<br>
&emsp;&emsp;&emsp;&emsp;Select all correct answers.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ `1015`<br>
&emsp;&emsp;&emsp;&emsp;☐  `1003`   ☐  `1004`   ☐  `1007`   ☐  `1009`   ☐  `1011`   ☐  `1012`<br>
&emsp;&emsp;&emsp;&emsp;☒ `1016`   ☒ `1018`   ☒ `1022`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☐  None of the above<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** ARIES might need to REDO every log record except those identified<br>
&emsp;&emsp;&emsp;&emsp;above.<br>
&emsp;&emsp;viii. **\[4 points\]** Which transactions will be undone in the **UNDO** phase of ARIES? Select<br>
&emsp;&emsp;&emsp;&emsp;all correct answers.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **T2**   ☒ **T4**<br>
&emsp;&emsp;&emsp;&emsp;☐  T1   ☐  T3   ☐  None of the above<br>
&emsp;&emsp;&emsp;&emsp;**Solution:**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;• T1: Committed at `1021`.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;• T2: Not committed before crash, so DBMS has to undo.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;• T3: Committed at `1005`.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;• T4: Aborted at `1019`, so DBMS has to undo.<br>
&emsp;&emsp;&emsp;ix. **\[1 point\]** For Transaction **T1**, how many new CLR entries will the DBMS add to<br>
&emsp;&emsp;&emsp;&emsp;the WAL during ARIES recovery for each transaction? Do not count any CLR entries<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **0**<br>
&emsp;&emsp;&emsp;&emsp;that already exist in the WAL before the crash in your answer.   ☐  1   ☐  2<br>
&emsp;&emsp;&emsp;&emsp;☐  3<br>
&emsp;&emsp;&emsp;x. **\[1 point\]** For Transaction **T2**, how many new CLR entries will the DBMS add to<br>
&emsp;&emsp;&emsp;&emsp;the WAL during ARIES recovery for each transaction? Do not count any CLR entries<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **1**<br>
&emsp;&emsp;&emsp;&emsp;that already exist in the WAL before the crash in your answer.   ☐  0   ☐  2<br>
&emsp;&emsp;&emsp;&emsp;☐  3<br>
&emsp;&emsp;&emsp;xi. **\[1 point\]** For Transaction **T3**, how many new CLR entries will the DBMS add to<br>
&emsp;&emsp;&emsp;&emsp;the WAL during ARIES recovery for each transaction? Do not count any CLR entries<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **0**<br>
&emsp;&emsp;&emsp;&emsp;that already exist in the WAL before the crash in your answer.☐  1   ☐  2<br>
&emsp;&emsp;&emsp;&emsp;☐  3<br>
&emsp;&emsp;&emsp;xii. **\[1 point\]** For Transaction **T4**, how many new CLR entries will the DBMS add to<br>
&emsp;&emsp;&emsp;&emsp;the WAL during ARIES recovery for each transaction? Do not count any CLR entries<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;☒ **2**<br>
&emsp;&emsp;&emsp;&emsp;that already exist in the WAL before the crash in your answer.   ☐  0   ☐  1<br>
&emsp;&emsp;&emsp;&emsp;☐  3

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #6 continues...


---

<a id="page-6"></a>
**Page 6**

15-445/645 (Fall 2025)   Homework #6   Page 6 of 9


### **Question 2: Logging and Recovery . . . . . . . . . . . . . . . . . . . . . . . . . . . . \[32 points\]**

&emsp;(a) **\[4 points\]** The STEAL policy means that the pages modified by a transaction could be<br>
&emsp;&emsp;&emsp;written to non-volatile storage before that transaction commits.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☒ **True**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  False<br>
&emsp;&emsp;&emsp;**Solution:** STEAL allows the DBMS to write uncommitted pages to disk.<br>
&emsp;(b) **\[4 points\]** In reference to recovery algorithms that use a write-ahead log (WAL). Under<br>
&emsp;&emsp;&emsp;NO-STEAL + FORCE policy, a DBMS will have to undo the changes of an aborted<br>
&emsp;&emsp;&emsp;transaction during recovery.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;**Solution:** The FORCE policy guarantees that all changes from committed transactions<br>
&emsp;&emsp;&emsp;are immediately written to disk, ensuring durability. It is the NO-STEAL policy that<br>
&emsp;&emsp;&emsp;prevents changes by uncommitted transactions from being written to disk, avoiding the<br>
&emsp;&emsp;&emsp;need for undo operations on disk for those transactions.<br>
&emsp;(c) **\[4 points\]** If the DBMS is using the STEAL and NO-FORCE policies, then a transaction<br>
&emsp;&emsp;&emsp;is considered committed if all of the data pages that it modified have been written to non-<br>
&emsp;&emsp;&emsp;volatile storage.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;**Solution:** Under STEAL + NO-FORCE, a txn is considered committed when all of the<br>
&emsp;&emsp;&emsp;WAL entries for the pages that it modified and the COMMIT record are flushed to disk.<br>
&emsp;(d) **\[4 points\]** If the DBMS uses the FORCE policy, it could potentially have to redo the<br>
&emsp;&emsp;&emsp;changes of previously committed transactions during recovery.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;**Solution:** If we flush all of the changes that a txn makes to disk atomically when it<br>
&emsp;&emsp;&emsp;commits, then we will not need to redo anything during recovery.<br>
&emsp;(e) **\[4 points\]** In ARIES, only transactions that commit will have an associated “TXN-<br>
&emsp;&emsp;&emsp;END” record in the log.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;**Solution:** Transactions will commit when the COMMIT log is written, TXN-END is an<br>
&emsp;&emsp;&emsp;optimization in the ARIES protocol that indicates it can be removed from the transaction<br>
&emsp;&emsp;&emsp;table.


### Question 2 continues...


---

<a id="page-7"></a>
**Page 7**

15-445/645 (Fall 2025)   Homework #6   Page 7 of 9

&emsp;(f) **\[4 points\]** Fuzzy checkpoints do not need to block the execution of all transactions while<br>
&emsp;&emsp;&emsp;a consistent snapshot is written to disk.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☒ **True**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  False<br>
&emsp;&emsp;&emsp;**Solution:** See motivation of checkpointing.<br>
&emsp;(g) **\[4 points\]** After the DBMS begins a non-blocking (i.e., fuzzy) checkpoint, the DBMS<br>
&emsp;&emsp;&emsp;cannot flush dirty pages to disk until the checkpoint ends to ensure correctness.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;**Solution:** False. Fuzzy checkpoint does not block the system from flushing dirty pages.<br>
&emsp;(h) **\[4 points\]** If the DBMS uses a physical logging scheme for its WAL, then it does not<br>
&emsp;&emsp;&emsp;need to maintain additional WAL records for updates to indexes.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;**Solution:** False. Physical logging records page-level changes to tuples. There still<br>
&emsp;&emsp;&emsp;needs to be separate log records for index updates. Only logical logging does not require<br>
&emsp;&emsp;&emsp;separate log records for indexes.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Homework #6 continues...


---

<a id="page-8"></a>
**Page 8**

15-445/645 (Fall 2025)   Homework #6   Page 8 of 9


### **Question 3: Distributed Databases . . . . . . . . . . . . . . . . . . . . . . . . . . . . \[20 points\]**

&emsp;(a) Consider a database that has a two tables `R(a,b,c) S(a,d,e)`, where `S.a` is a foreign key<br>
&emsp;&emsp;&emsp;reference to `R.a`. Assume that `R` contains 100,000,000 tuples and `S` contains 1,000,000<br>
&emsp;&emsp;&emsp;tuples. Also assume that the size of a tuple in `R` is the same as a tuple in `S`.<br>
&emsp;&emsp;&emsp;Consider the following query:<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`SELECT` `*` `FROM` `R` `JOIN` `S` `ON` `R.a` `=` `S.a`<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`WHERE` `R.b` `BETWEEN` `1` `AND` `100;`<br>
&emsp;&emsp;&emsp;Answer the following questions about the best way to execute this query given the differ-<br>
&emsp;&emsp;&emsp;ent configurations in a distributed, shared-nothing DBMS with 10 nodes. You can assume<br>
&emsp;&emsp;&emsp;that the DBMS executes a local hash join at each node. You can also assume that it is<br>
&emsp;&emsp;&emsp;10× faster for a node to read data from its local disk than it is to retrieve data from another<br>
&emsp;&emsp;&emsp;node over the network. If a table is partitioned, then you can assume that each partition<br>
&emsp;&emsp;&emsp;contains the same number of tuples (i.e., the data is not skewed).<br>
&emsp;&emsp;&emsp;Consider the following database configuration:<br>
&emsp;&emsp;&emsp;• Table `R` is partitioned on `R.a`. Each partition fits in memory on a single node.<br>
&emsp;&emsp;&emsp;• Table `S` is replicated at every node. The entire table fits in memory on a single node.<br>
&emsp;&emsp;&emsp;i. **\[4 points\]** What is the most optimal join execution strategy for table `R`?<br>
&emsp;&emsp;&emsp;&emsp;☒ **Leave** `R` **as it exists on every node.**<br>
&emsp;&emsp;&emsp;&emsp;☐  Shuffle `R` on `R.a` to every node.<br>
&emsp;&emsp;&emsp;&emsp;☐  Shuffle `R` on `R.b` to every node.<br>
&emsp;&emsp;&emsp;&emsp;☐  Broadcast `R` to every node.<br>
&emsp;&emsp;&emsp;&emsp;☐  None of the above<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** Table R is partitioned on the join key, so there is no need to move it.<br>
&emsp;&emsp;&emsp;ii. **\[4 points\]** Given your choice for `R`, what is the most optimal join execution strategy<br>
&emsp;&emsp;&emsp;&emsp;for table `S`?<br>
&emsp;&emsp;&emsp;&emsp;☒ **Leave** `S` **as it exists on every node.**<br>
&emsp;&emsp;&emsp;&emsp;☐  Shuffle `S` on `S.a` to every node.<br>
&emsp;&emsp;&emsp;&emsp;☐  Shuffle `S` on `S.d` to every node.<br>
&emsp;&emsp;&emsp;&emsp;☐  Broadcast `S` to every node.<br>
&emsp;&emsp;&emsp;&emsp;☐  None of the above<br>
&emsp;&emsp;&emsp;&emsp;**Solution:** Table S is already replicated at each node, so the DBMS can just do the<br>
&emsp;&emsp;&emsp;&emsp;join on the local data at each partition.


### Question 3 continues...


---

<a id="page-9"></a>
**Page 9**

15-445/645 (Fall 2025)   Homework #6   Page 9 of 9

&emsp;(b) **\[4 points\]** A distributed DBMS can immediately commit a transaction under network<br>
&emsp;&emsp;&emsp;partitioning without any loss of data consistency.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  True<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☒ **False**<br>
&emsp;&emsp;&emsp;**Solution:** False. This is a violation of the CAP theorem.<br>
&emsp;(c) **\[4 points\]** A DBMS can use either the PAXOS or Two-Phase Commit protocols to sup-<br>
&emsp;&emsp;&emsp;port strong consistency for distributed transactions (i.e., transactions that modify data on<br>
&emsp;&emsp;&emsp;multiple nodes).<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☒ **True**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  False<br>
&emsp;&emsp;&emsp;**Solution:** 2PC is a degenerate case of Paxos, which is a consensus protocol for dis-<br>
&emsp;&emsp;&emsp;tributed transactions.<br>
&emsp;(d) **\[4 points\]** With consistent hashing, if a node fails, then only a subset and not all keys<br>
&emsp;&emsp;&emsp;will be reshuffled among the remaining nodes.<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☒ **True**<br>
&emsp;&emsp;&emsp;&emsp;&emsp;☐  False<br>
&emsp;&emsp;&emsp;**Solution:** See motivation of consistent hashing.

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;End of Homework #6

