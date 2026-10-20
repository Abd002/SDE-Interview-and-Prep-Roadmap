# OSTEP homework: file-lfs

> Copied from <https://github.com/remzi-arpacidusseau/ostep-homework/tree/master/file-lfs> (by Remzi and Andrea Arpaci-Dusseau). Questions and answers are the source's own; nothing was answered or rewritten here. The simulators in this folder are the answer key: run any command from the questions again with `-c` and the simulator prints the official answer.

## Homework questions from the book chapter

> From the chapter PDF <https://pages.cs.wisc.edu/~remzi/OSTEP/file-lfs.pdf>. Answer each one with the simulator, then add `-c` to see the official answer.

```text
Homework (Simulation)
   This section introduces lfs.py, a simple LFS simulator you can use
to understand better how an LFS-based file system works. Read the
README for details on how to run the simulator.

Questions
  1. Run ./lfs.py -n 3, perhaps varying the seed (-s). Can you fig-
     ure out which commands were run to generate the final file system
     contents? Can you tell which order those commands were issued?
     Finally, can you determine the liveness of each block in the final
     file system state? Use -o to show which commands were run, and
     -c to show the liveness of the final file system state. How much
     harder does the task become for you as you increase the number of
     commands issued (i.e., change -n 3 to -n 5)?
  2. If you find the above painful, you can help yourself a little bit by
     showing the set of updates caused by each specific command. To do
     so, run ./lfs.py -n 3 -i. Now see if it is easier to understand
     what each command must have been. Change the random seed to
     get different commands to interpret (e.g., -s 1, -s 2, -s 3, etc.).
  3. To further test your ability to figure out what updates are made to
     disk by each command, run the following: ./lfs.py -o -F -s
     100 (and perhaps a few other random seeds). This just shows a
     set of commands and does NOT show you the final state of the file
     system. Can you reason about what the final state of the file system
     must be?
  4. Now see if you can determine which files and directories are live
     after a number of file and directory operations. Run tt ./lfs.py
     -n 20 -s 1 and then examine the final file system state. Can you
     figure out which pathnames are valid? Run tt ./lfs.py -n 20
     -s 1 -c -v to see the results. Run with -o to see if your answers
     match up given the series of random commands. Use different ran-
     dom seeds to get more problems.
  5. Now let's issue some specific commands. First, let's create a file
     and write to it repeatedly. To do so, use the -L flag, which lets you
     specify specific commands to execute. Let's create the file ”/foo”
     and write to it four times:
     -L c,/foo:w,/foo,0,1:w,/foo,1,1:w,/foo,2,1:w,/foo,3,1
     -o. See if you can determine the liveness of the final file system
     state; use -c to check your answers.
  6. Now, let's do the same thing, but with a single write operation in-
     stead of four. Run ./lfs.py -o -L c,/foo:w,/foo,0,4 to
     create file ”/foo” and write 4 blocks with a single write operation.

       Compute the liveness again, and check if you are right with -c.
       What is the main difference between writing a file all at once (as
       we do here) versus doing it one block at a time (as above)? What
       does this tell you about the importance of buffering updates in main
       memory as the real LFS does?
     7. Let's do another specific example. First, run the following: ./lfs.py
        -L c,/foo:w,/foo,0,1. What does this set of commands do?
        Now, run ./lfs.py -L c,/foo:w,/foo,7,1. What does this
        set of commands do? How are the two different? What can you tell
        about the size field in the inode from these two sets of commands?
     8. Now let's look explicitly at file creation versus directory creation.
        Run simulations ./lfs.py -L c,/foo and ./lfs.py -L d,/foo
        to create a file and then a directory. What is similar about these runs,
        and what is different?
     9. The LFS simulator supports hard links as well. Run the following
        to study how they work:
        ./lfs.py -L c,/foo:l,/foo,/bar:l,/foo,/goo -o -i.
        What blocks are written out when a hard link is created? How is
        this similar to just creating a new file, and how is it different? How
        does the reference count field change as links are created?
 10. LFS makes many different policy decisions. We do not explore
     many of them here – perhaps something left for the future – but here
     is a simple one we do explore: the choice of inode number. First, run
     ./lfs.py -p c100 -n 10 -o -a s to show the usual behav-
     ior with the ”sequential” allocation policy, which tries to use free
     inode numbers nearest to zero. Then, change to a ”random” policy
     by running ./lfs.py -p c100 -n 10 -o -a r (the -p c100
     flag ensures 100 percent of the random operations are file creations).
     What on-disk differences does a random policy versus a sequential
     policy result in? What does this say about the importance of choos-
     ing inode numbers in a real LFS?
 11. One last thing we've been assuming is that the LFS simulator al-
     ways updates the checkpoint region after each update. In the real
     LFS, that isn't the case: it is updated periodically to avoid long
     seeks. Run ./lfs.py -N -i -o -s 1000 to see some opera-
     tions and the intermediate and final states of the file system when
     the checkpoint region isn't forced to disk. What would happen if
     the checkpoint region is never updated? What if it is updated peri-
     odically? Could you figure out how to recover the file system to the
     latest state by rolling forward in the log?
```

### Answers printed by the official simulator

For every command the questions list, this is what `lfs.py` prints with `-c` (compute the answer). Try each question first.

<details><summary>Simulator answer: <code>./lfs.py -n 3 -c</code></summary>

```text
INITIAL file system contents:
[   0 ] live checkpoint: 3 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[   1 ] live [.,0] [..,0] -- -- -- -- -- -- 
[   2 ] live type:dir size:1 refs:2 ptrs: 1 -- -- -- -- -- -- -- 
[   3 ] live chunk(imap): 2 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 

command? 
command? 
command? 

FINAL file system contents:
[   0 ] live checkpoint: 14 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[   1 ]      [.,0] [..,0] -- -- -- -- -- -- 
[   2 ]      type:dir size:1 refs:2 ptrs: 1 -- -- -- -- -- -- -- 
[   3 ]      chunk(imap): 2 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[   4 ]      [.,0] [..,0] [ku3,1] -- -- -- -- -- 
[   5 ]      type:dir size:1 refs:2 ptrs: 4 -- -- -- -- -- -- -- 
[   6 ]      type:reg size:0 refs:1 ptrs: -- -- -- -- -- -- -- -- 
[   7 ]      chunk(imap): 5 6 -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[   8 ] live z0z0z0z0z0z0z0z0z0z0z0z0z0z0z0z0
[   9 ] live type:reg size:8 refs:1 ptrs: -- -- -- -- -- -- -- 8 
[  10 ]      chunk(imap): 5 9 -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[  11 ] live [.,0] [..,0] [ku3,1] [qg9,2] -- -- -- -- 
[  12 ] live type:dir size:1 refs:2 ptrs: 11 -- -- -- -- -- -- -- 
[  13 ] live type:reg size:0 refs:1 ptrs: -- -- -- -- -- -- -- -- 
[  14 ] live chunk(imap): 12 9 13 -- -- -- -- -- -- -- -- -- -- -- -- --
```

</details>

<details><summary>Simulator answer: <code>./lfs.py -n 3 -i -c</code></summary>

```text
INITIAL file system contents:
[   0 ] live checkpoint: 3 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[   1 ] live [.,0] [..,0] -- -- -- -- -- -- 
[   2 ] live type:dir size:1 refs:2 ptrs: 1 -- -- -- -- -- -- -- 
[   3 ] live chunk(imap): 2 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 

command? 

[   0 ] live checkpoint: 7 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
...
[   4 ] live [.,0] [..,0] [ku3,1] -- -- -- -- -- 
[   5 ] live type:dir size:1 refs:2 ptrs: 4 -- -- -- -- -- -- -- 
[   6 ] live type:reg size:0 refs:1 ptrs: -- -- -- -- -- -- -- -- 
[   7 ] live chunk(imap): 5 6 -- -- -- -- -- -- -- -- -- -- -- -- -- -- 


command? 

[   0 ] live checkpoint: 10 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
...
[   8 ] live z0z0z0z0z0z0z0z0z0z0z0z0z0z0z0z0
[   9 ] live type:reg size:8 refs:1 ptrs: -- -- -- -- -- -- -- 8 
[  10 ] live chunk(imap): 5 9 -- -- -- -- -- -- -- -- -- -- -- -- -- -- 


command? 

[   0 ] live checkpoint: 14 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
...
[  11 ] live [.,0] [..,0] [ku3,1] [qg9,2] -- -- -- -- 
[  12 ] live type:dir size:1 refs:2 ptrs: 11 -- -- -- -- -- -- -- 
[  13 ] live type:reg size:0 refs:1 ptrs: -- -- -- -- -- -- -- -- 
[  14 ] live chunk(imap): 12 9 13 -- -- -- -- -- -- -- -- -- -- -- -- -- 



FINAL file system contents:
[   0 ] live checkpoint: 14 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[   1 ]      [.,0] [..,0] -- -- -- -- -- -- 
[   2 ]      type:dir size:1 refs:2 ptrs: 1 -- -- -- -- -- -- -- 
[   3 ]      chunk(imap): 2 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[   4 ]      [.,0] [..,0] [ku3,1] -- -- -- -- -- 
[   5 ]      type:dir size:1 refs:2 ptrs: 4 -- -- -- -- -- -- -- 
[   6 ]      type:reg size:0 refs:1 ptrs: -- -- -- -- -- -- -- -- 
[   7 ]      chunk(imap): 5 6 -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[   8 ] live z0z0z0z0z0z0z0z0z0z0z0z0z0z0z0z0
[   9 ] live type:reg size:8 refs:1 ptrs: -- -- -- -- -- -- -- 8 
[  10 ]      chunk(imap): 5 9 -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[  11 ] live [.,0] [..,0] [ku3,1] [qg9,2] -- -- -- -- 
[  12 ] live type:dir size:1 refs:2 ptrs: 11 -- -- -- -- -- -- -- 
[  13 ] live type:reg size:0 refs:1 ptrs: -- -- -- -- -- -- -- -- 
[  14 ] live chunk(imap): 12 9 13 -- -- -- -- -- -- -- -- -- -- -- -- --
```

</details>

<details><summary>Simulator answer: <code>./lfs.py -o -F -s 100 -c</code></summary>

```text
INITIAL file system contents:
[   0 ] live checkpoint: 3 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[   1 ] live [.,0] [..,0] -- -- -- -- -- -- 
[   2 ] live type:dir size:1 refs:2 ptrs: 1 -- -- -- -- -- -- -- 
[   3 ] live chunk(imap): 2 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 

create file /us7 
write file  /us7 offset=4 size=0 
write file  /us7 offset=7 size=7
```

</details>

<details><summary>Simulator answer: <code>./lfs.py -n 20 -s 1 -c</code></summary>

```text
INITIAL file system contents:
[   0 ] live checkpoint: 3 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[   1 ] live [.,0] [..,0] -- -- -- -- -- -- 
[   2 ] live type:dir size:1 refs:2 ptrs: 1 -- -- -- -- -- -- -- 
[   3 ] live chunk(imap): 2 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 

command? 
command? 
command? 
command? 
command? 
command? 
command? 
command? 
command? 
command? 
command? 
command? 
command? 
command? 
command? 
command? 
command? 
command? 
command? 
command? 

FINAL file system contents:
[   0 ] live checkpoint: 99 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[   1 ]      [.,0] [..,0] -- -- -- -- -- -- 
[   2 ]      type:dir size:1 refs:2 ptrs: 1 -- -- -- -- -- -- -- 
[   3 ]      chunk(imap): 2 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[   4 ]      [.,0] [..,0] [tg4,1] -- -- -- -- -- 
[   5 ]      type:dir size:1 refs:2 ptrs: 4 -- -- -- -- -- -- -- 
[   6 ]      type:reg size:0 refs:1 ptrs: -- -- -- -- -- -- -- -- 
[   7 ]      chunk(imap): 5 6 -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[   8 ]      type:reg size:6 refs:1 ptrs: -- -- -- -- -- -- -- -- 
[   9 ]      chunk(imap): 5 8 -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[  10 ]      [.,0] [..,0] [tg4,1] [lt0,2] -- -- -- -- 
[  11 ]      type:dir size:1 refs:2 ptrs: 10 -- -- -- -- -- -- -- 
[  12 ]      type:reg size:0 refs:1 ptrs: -- -- -- -- -- -- -- -- 
[  13 ]      chunk(imap): 11 8 12 -- -- -- -- -- -- -- -- -- -- -- -- -- 
[  14 ]      n0n0n0n0n0n0n0n0n0n0n0n0n0n0n0n0
[  15 ]      y1y1y1y1y1y1y1y1y1y1y1y1y1y1y1y1
[  16 ]      p2p2p2p2p2p2p2p2p2p2p2p2p2p2p2p2
[  17 ]      l3l3l3l3l3l3l3l3l3l3l3l3l3l3l3l3
[  18 ]      h4h4h4h4h4h4h4h4h4h4h4h4h4h4h4h4
[  19 ]      o5o5o5o5o5o5o5o5o5o5o5o5o5o5o5o5
[  20 ]      y6y6y6y6y6y6y6y6y6y6y6y6y6y6y6y6
[  21 ]      type:reg size:8 refs:1 ptrs: -- 14 15 16 17 18 19 20 
[  22 ]      chunk(imap): 11 8 21 -- -- -- -- -- -- -- -- -- -- -- -- -- 
[  23 ]      [.,0] [..,0] [tg4,1] [lt0,2] [oy3,1] -- -- -- 
[  24 ]      type:dir size:1 refs:2 ptrs: 23 -- -- -- -- -- -- -- 
[  25 ]      type:reg size:6 refs:2 ptrs: -- -- -- -- -- -- -- -- 
[  26 ]      chunk(imap): 24 25 21 -- -- -- -- -- -- -- -- -- -- -- -- -- 
[  27 ]      [.,0] [..,0] [tg4,1] [lt0,2] [oy3,1] [af4,3] -- -- 
[  28 ]      type:dir size:1 refs:2 ptrs: 27 -- -- -- -- -- -- -- 
[  29 ]      type:reg size:0 refs:1 ptrs: -- -- -- -- -- -- -- -- 
[  30 ]      chunk(imap): 28 25 21 29 -- -- -- -- -- -- -- -- -- -- -- -- 
[  31 ]      a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0
[  32 ]      type:reg size:6 refs:2 ptrs: -- 31 -- -- -- -- -- -- 
[  33 ]      chunk(imap): 28 32 21 29 -- -- -- -- -- -- -- -- -- -- -- -- 
[  34 ] live u0u0u0u0u0u0u0u0u0u0u0u0u0u0u0u0
[  35 ]      v1v1v1v1v1v1v1v1v1v1v1v1v1v1v1v1
[  36 ]      x2x2x2x2x2x2x2x2x2x2x2x2x2x2x2x2
[  37 ]      t3t3t3t3t3t3t3t3t3t3t3t3t3t3t3t3
[  38 ]      v4v4v4v4v4v4v4v4v4v4v4v4v4v4v4v4
[  39 ]      n5n5n5n5n5n5n5n5n5n5n5n5n5n5n5n5
[  40 ]      type:reg size:8 refs:1 ptrs: 34 35 36 37 38 39 19 20 
[  41 ]      chunk(imap): 28 32 40 29 -- -- -- -- -- -- -- -- -- -- -- -- 
[  42 ]      o0o0o0o0o0o0o0o0o0o0o0o0o0o0o0o0
[  43 ]      l1l1l1l1l1l1l1l1l1l1l1l1l1l1l1l1
[  44 ]      b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2
[  45 ]      w3w3w3w3w3w3w3w3w3w3w3w3w3w3w3w3
[  46 ]      o4o4o4o4o4o4o4o4o4o4o4o4o4o4o4o4
[  47 ]      f5f5f5f5f5f5f5f5f5f5f5f5f5f5f5f5
[  48 ]      n6n6n6n6n6n6n6n6n6n6n6n6n6n6n6n6
[  49 ]      type:reg size:8 refs:2 ptrs: -- 42 43 44 45 46 47 48 
[  50 ]      chunk(imap): 28 49 40 29 -- -- -- -- -- -- -- -- -- -- -- -- 
[  51 ]      [.,0] [..,0] -- [lt0,2] [oy3,1] [af4,3] -- -- 
[  52 ]      type:dir size:1 refs:2 ptrs: 51 -- -- -- -- -- -- -- 
[  53 ]      type:reg size:8 refs:1 ptrs: -- 42 43 44 45 46 47 48 
[  54 ]      chunk(imap): 52 53 40 29 -- -- -- -- -- -- -- -- -- -- -- -- 
[  55 ]      m0m0m0m0m0m0m0m0m0m0m0m0m0m0m0m0
[  56 ]      j1j1j1j1j1j1j1j1j1j1j1j1j1j1j1j1
[  57 ]      i2i2i2i2i2i2i2i2i2i2i2i2i2i2i2i2
[  58 ]      type:reg size:8 refs:1 ptrs: -- -- -- -- -- 55 56 57 
[  59 ]      chunk(imap): 52 53 40 58 -- -- -- -- -- -- -- -- -- -- -- -- 
[  60 ] live a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0
[  61 ]      f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1
[  62 ]      type:reg size:8 refs:1 ptrs: -- -- -- -- -- 60 61 57 
[  63 ]      chunk(imap): 52 53 40 62 -- -- -- -- -- -- -- -- -- -- -- -- 
[  64 ] live e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0
[  65 ] live p1p1p1p1p1p1p1p1p1p1p1p1p1p1p1p1
[  66 ] live type:reg size:8 refs:1 ptrs: -- -- -- -- -- 60 64 65 
[  67 ]      chunk(imap): 52 53 40 66 -- -- -- -- -- -- -- -- -- -- -- -- 
[  68 ] live u0u0u0u0u0u0u0u0u0u0u0u0u0u0u0u0
[  69 ] live v1v1v1v1v1v1v1v1v1v1v1v1v1v1v1v1
[  70 ] live g2g2g2g2g2g2g2g2g2g2g2g2g2g2g2g2
[  71 ]      v3v3v3v3v3v3v3v3v3v3v3v3v3v3v3v3
[  72 ]      r4r4r4r4r4r4r4r4r4r4r4r4r4r4r4r4
[  73 ]      c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5
[  74 ]      type:reg size:8 refs:1 ptrs: 34 68 69 70 71 72 73 20 
[  75 ]      chunk(imap): 52 53 74 66 -- -- -- -- -- -- -- -- -- -- -- -- 
[  76 ] live a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0
[  77 ] live a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1
[  78 ] live t2t2t2t2t2t2t2t2t2t2t2t2t2t2t2t2
[  79 ] live g3g3g3g3g3g3g3g3g3g3g3g3g3g3g3g3
[  80 ] live type:reg size:8 refs:1 ptrs: 34 68 69 70 76 77 78 79 
[  81 ]      chunk(imap): 52 53 80 66 -- -- -- -- -- -- -- -- -- -- -- -- 
[  82 ]      [.,0] [..,0] [ln7,4] [lt0,2] [oy3,1] [af4,3] -- -- 
[  83 ]      [.,4] [..,0] -- -- -- -- -- -- 
[  84 ]      type:dir size:1 refs:3 ptrs: 82 -- -- -- -- -- -- -- 
[  85 ]      type:dir size:1 refs:2 ptrs: 83 -- -- -- -- -- -- -- 
[  86 ]      chunk(imap): 84 53 80 66 85 -- -- -- -- -- -- -- -- -- -- -- 
[  87 ]      type:reg size:8 refs:1 ptrs: -- 42 43 44 45 46 47 48 
[  88 ]      chunk(imap): 84 87 80 66 85 -- -- -- -- -- -- -- -- -- -- -- 
[  89 ]      [.,4] [..,0] [zp3,5] -- -- -- -- -- 
[  90 ]      type:dir size:1 refs:2 ptrs: 89 -- -- -- -- -- -- -- 
[  91 ] live type:reg size:0 refs:1 ptrs: -- -- -- -- -- -- -- -- 
[  92 ]      chunk(imap): 84 87 80 66 90 91 -- -- -- -- -- -- -- -- -- -- 
[  93 ]
... (output cut; run it yourself for the rest)
```

</details>

<details><summary>Simulator answer: <code>./lfs.py -n 20 -s 1 -c -v to -c</code></summary>

```text
INITIAL file system contents:
[   0 ] live checkpoint: 3 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[   1 ] live [.,0] [..,0] -- -- -- -- -- -- 
[   2 ] live type:dir size:1 refs:2 ptrs: 1 -- -- -- -- -- -- -- 
[   3 ] live chunk(imap): 2 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 

command? 
command? 
command? 
command? 
command? 
command? 
command? 
command? 
command? 
command? 
command? 
command? 
command? 
command? 
command? 
command? 
command? 
command? 
command? 
command? 

FINAL file system contents:
[   0 ] live checkpoint: 99 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[   1 ]      [.,0] [..,0] -- -- -- -- -- -- 
[   2 ]      type:dir size:1 refs:2 ptrs: 1 -- -- -- -- -- -- -- 
[   3 ]      chunk(imap): 2 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[   4 ]      [.,0] [..,0] [tg4,1] -- -- -- -- -- 
[   5 ]      type:dir size:1 refs:2 ptrs: 4 -- -- -- -- -- -- -- 
[   6 ]      type:reg size:0 refs:1 ptrs: -- -- -- -- -- -- -- -- 
[   7 ]      chunk(imap): 5 6 -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[   8 ]      type:reg size:6 refs:1 ptrs: -- -- -- -- -- -- -- -- 
[   9 ]      chunk(imap): 5 8 -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[  10 ]      [.,0] [..,0] [tg4,1] [lt0,2] -- -- -- -- 
[  11 ]      type:dir size:1 refs:2 ptrs: 10 -- -- -- -- -- -- -- 
[  12 ]      type:reg size:0 refs:1 ptrs: -- -- -- -- -- -- -- -- 
[  13 ]      chunk(imap): 11 8 12 -- -- -- -- -- -- -- -- -- -- -- -- -- 
[  14 ]      n0n0n0n0n0n0n0n0n0n0n0n0n0n0n0n0
[  15 ]      y1y1y1y1y1y1y1y1y1y1y1y1y1y1y1y1
[  16 ]      p2p2p2p2p2p2p2p2p2p2p2p2p2p2p2p2
[  17 ]      l3l3l3l3l3l3l3l3l3l3l3l3l3l3l3l3
[  18 ]      h4h4h4h4h4h4h4h4h4h4h4h4h4h4h4h4
[  19 ]      o5o5o5o5o5o5o5o5o5o5o5o5o5o5o5o5
[  20 ]      y6y6y6y6y6y6y6y6y6y6y6y6y6y6y6y6
[  21 ]      type:reg size:8 refs:1 ptrs: -- 14 15 16 17 18 19 20 
[  22 ]      chunk(imap): 11 8 21 -- -- -- -- -- -- -- -- -- -- -- -- -- 
[  23 ]      [.,0] [..,0] [tg4,1] [lt0,2] [oy3,1] -- -- -- 
[  24 ]      type:dir size:1 refs:2 ptrs: 23 -- -- -- -- -- -- -- 
[  25 ]      type:reg size:6 refs:2 ptrs: -- -- -- -- -- -- -- -- 
[  26 ]      chunk(imap): 24 25 21 -- -- -- -- -- -- -- -- -- -- -- -- -- 
[  27 ]      [.,0] [..,0] [tg4,1] [lt0,2] [oy3,1] [af4,3] -- -- 
[  28 ]      type:dir size:1 refs:2 ptrs: 27 -- -- -- -- -- -- -- 
[  29 ]      type:reg size:0 refs:1 ptrs: -- -- -- -- -- -- -- -- 
[  30 ]      chunk(imap): 28 25 21 29 -- -- -- -- -- -- -- -- -- -- -- -- 
[  31 ]      a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0
[  32 ]      type:reg size:6 refs:2 ptrs: -- 31 -- -- -- -- -- -- 
[  33 ]      chunk(imap): 28 32 21 29 -- -- -- -- -- -- -- -- -- -- -- -- 
[  34 ] live u0u0u0u0u0u0u0u0u0u0u0u0u0u0u0u0
[  35 ]      v1v1v1v1v1v1v1v1v1v1v1v1v1v1v1v1
[  36 ]      x2x2x2x2x2x2x2x2x2x2x2x2x2x2x2x2
[  37 ]      t3t3t3t3t3t3t3t3t3t3t3t3t3t3t3t3
[  38 ]      v4v4v4v4v4v4v4v4v4v4v4v4v4v4v4v4
[  39 ]      n5n5n5n5n5n5n5n5n5n5n5n5n5n5n5n5
[  40 ]      type:reg size:8 refs:1 ptrs: 34 35 36 37 38 39 19 20 
[  41 ]      chunk(imap): 28 32 40 29 -- -- -- -- -- -- -- -- -- -- -- -- 
[  42 ]      o0o0o0o0o0o0o0o0o0o0o0o0o0o0o0o0
[  43 ]      l1l1l1l1l1l1l1l1l1l1l1l1l1l1l1l1
[  44 ]      b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2
[  45 ]      w3w3w3w3w3w3w3w3w3w3w3w3w3w3w3w3
[  46 ]      o4o4o4o4o4o4o4o4o4o4o4o4o4o4o4o4
[  47 ]      f5f5f5f5f5f5f5f5f5f5f5f5f5f5f5f5
[  48 ]      n6n6n6n6n6n6n6n6n6n6n6n6n6n6n6n6
[  49 ]      type:reg size:8 refs:2 ptrs: -- 42 43 44 45 46 47 48 
[  50 ]      chunk(imap): 28 49 40 29 -- -- -- -- -- -- -- -- -- -- -- -- 
[  51 ]      [.,0] [..,0] -- [lt0,2] [oy3,1] [af4,3] -- -- 
[  52 ]      type:dir size:1 refs:2 ptrs: 51 -- -- -- -- -- -- -- 
[  53 ]      type:reg size:8 refs:1 ptrs: -- 42 43 44 45 46 47 48 
[  54 ]      chunk(imap): 52 53 40 29 -- -- -- -- -- -- -- -- -- -- -- -- 
[  55 ]      m0m0m0m0m0m0m0m0m0m0m0m0m0m0m0m0
[  56 ]      j1j1j1j1j1j1j1j1j1j1j1j1j1j1j1j1
[  57 ]      i2i2i2i2i2i2i2i2i2i2i2i2i2i2i2i2
[  58 ]      type:reg size:8 refs:1 ptrs: -- -- -- -- -- 55 56 57 
[  59 ]      chunk(imap): 52 53 40 58 -- -- -- -- -- -- -- -- -- -- -- -- 
[  60 ] live a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0
[  61 ]      f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1
[  62 ]      type:reg size:8 refs:1 ptrs: -- -- -- -- -- 60 61 57 
[  63 ]      chunk(imap): 52 53 40 62 -- -- -- -- -- -- -- -- -- -- -- -- 
[  64 ] live e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0
[  65 ] live p1p1p1p1p1p1p1p1p1p1p1p1p1p1p1p1
[  66 ] live type:reg size:8 refs:1 ptrs: -- -- -- -- -- 60 64 65 
[  67 ]      chunk(imap): 52 53 40 66 -- -- -- -- -- -- -- -- -- -- -- -- 
[  68 ] live u0u0u0u0u0u0u0u0u0u0u0u0u0u0u0u0
[  69 ] live v1v1v1v1v1v1v1v1v1v1v1v1v1v1v1v1
[  70 ] live g2g2g2g2g2g2g2g2g2g2g2g2g2g2g2g2
[  71 ]      v3v3v3v3v3v3v3v3v3v3v3v3v3v3v3v3
[  72 ]      r4r4r4r4r4r4r4r4r4r4r4r4r4r4r4r4
[  73 ]      c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5
[  74 ]      type:reg size:8 refs:1 ptrs: 34 68 69 70 71 72 73 20 
[  75 ]      chunk(imap): 52 53 74 66 -- -- -- -- -- -- -- -- -- -- -- -- 
[  76 ] live a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0
[  77 ] live a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1
[  78 ] live t2t2t2t2t2t2t2t2t2t2t2t2t2t2t2t2
[  79 ] live g3g3g3g3g3g3g3g3g3g3g3g3g3g3g3g3
[  80 ] live type:reg size:8 refs:1 ptrs: 34 68 69 70 76 77 78 79 
[  81 ]      chunk(imap): 52 53 80 66 -- -- -- -- -- -- -- -- -- -- -- -- 
[  82 ]      [.,0] [..,0] [ln7,4] [lt0,2] [oy3,1] [af4,3] -- -- 
[  83 ]      [.,4] [..,0] -- -- -- -- -- -- 
[  84 ]      type:dir size:1 refs:3 ptrs: 82 -- -- -- -- -- -- -- 
[  85 ]      type:dir size:1 refs:2 ptrs: 83 -- -- -- -- -- -- -- 
[  86 ]      chunk(imap): 84 53 80 66 85 -- -- -- -- -- -- -- -- -- -- -- 
[  87 ]      type:reg size:8 refs:1 ptrs: -- 42 43 44 45 46 47 48 
[  88 ]      chunk(imap): 84 87 80 66 85 -- -- -- -- -- -- -- -- -- -- -- 
[  89 ]      [.,4] [..,0] [zp3,5] -- -- -- -- -- 
[  90 ]      type:dir size:1 refs:2 ptrs: 89 -- -- -- -- -- -- -- 
[  91 ] live type:reg size:0 refs:1 ptrs: -- -- -- -- -- -- -- -- 
[  92 ]      chunk(imap): 84 87 80 66 90 91 -- -- -- -- -- -- -- -- -- -- 
[  93 ]
... (output cut; run it yourself for the rest)
```

</details>

<details><summary>Simulator answer: <code>./lfs.py -o -L c,/foo:w,/foo,0,4 -c</code></summary>

```text
INITIAL file system contents:
[   0 ] live checkpoint: 3 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[   1 ] live [.,0] [..,0] -- -- -- -- -- -- 
[   2 ] live type:dir size:1 refs:2 ptrs: 1 -- -- -- -- -- -- -- 
[   3 ] live chunk(imap): 2 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 

create file /foo 
write file  /foo offset=0 size=4 

FINAL file system contents:
[   0 ] live checkpoint: 13 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[   1 ]      [.,0] [..,0] -- -- -- -- -- -- 
[   2 ]      type:dir size:1 refs:2 ptrs: 1 -- -- -- -- -- -- -- 
[   3 ]      chunk(imap): 2 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[   4 ] live [.,0] [..,0] [foo,1] -- -- -- -- -- 
[   5 ] live type:dir size:1 refs:2 ptrs: 4 -- -- -- -- -- -- -- 
[   6 ]      type:reg size:0 refs:1 ptrs: -- -- -- -- -- -- -- -- 
[   7 ]      chunk(imap): 5 6 -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[   8 ] live v0v0v0v0v0v0v0v0v0v0v0v0v0v0v0v0
[   9 ] live t1t1t1t1t1t1t1t1t1t1t1t1t1t1t1t1
[  10 ] live k2k2k2k2k2k2k2k2k2k2k2k2k2k2k2k2
[  11 ] live g3g3g3g3g3g3g3g3g3g3g3g3g3g3g3g3
[  12 ] live type:reg size:4 refs:1 ptrs: 8 9 10 11 -- -- -- -- 
[  13 ] live chunk(imap): 5 12 -- -- -- -- -- -- -- -- -- -- -- -- -- --
```

</details>

<details><summary>Simulator answer: <code>./lfs.py -L c,/foo:w,/foo,0,1 -c</code></summary>

```text
INITIAL file system contents:
[   0 ] live checkpoint: 3 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[   1 ] live [.,0] [..,0] -- -- -- -- -- -- 
[   2 ] live type:dir size:1 refs:2 ptrs: 1 -- -- -- -- -- -- -- 
[   3 ] live chunk(imap): 2 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 

command? 
command? 

FINAL file system contents:
[   0 ] live checkpoint: 10 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[   1 ]      [.,0] [..,0] -- -- -- -- -- -- 
[   2 ]      type:dir size:1 refs:2 ptrs: 1 -- -- -- -- -- -- -- 
[   3 ]      chunk(imap): 2 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[   4 ] live [.,0] [..,0] [foo,1] -- -- -- -- -- 
[   5 ] live type:dir size:1 refs:2 ptrs: 4 -- -- -- -- -- -- -- 
[   6 ]      type:reg size:0 refs:1 ptrs: -- -- -- -- -- -- -- -- 
[   7 ]      chunk(imap): 5 6 -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[   8 ] live v0v0v0v0v0v0v0v0v0v0v0v0v0v0v0v0
[   9 ] live type:reg size:1 refs:1 ptrs: 8 -- -- -- -- -- -- -- 
[  10 ] live chunk(imap): 5 9 -- -- -- -- -- -- -- -- -- -- -- -- -- --
```

</details>

<details><summary>Simulator answer: <code>./lfs.py -L c,/foo:w,/foo,7,1 -c</code></summary>

```text
INITIAL file system contents:
[   0 ] live checkpoint: 3 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[   1 ] live [.,0] [..,0] -- -- -- -- -- -- 
[   2 ] live type:dir size:1 refs:2 ptrs: 1 -- -- -- -- -- -- -- 
[   3 ] live chunk(imap): 2 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 

command? 
command? 

FINAL file system contents:
[   0 ] live checkpoint: 10 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[   1 ]      [.,0] [..,0] -- -- -- -- -- -- 
[   2 ]      type:dir size:1 refs:2 ptrs: 1 -- -- -- -- -- -- -- 
[   3 ]      chunk(imap): 2 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[   4 ] live [.,0] [..,0] [foo,1] -- -- -- -- -- 
[   5 ] live type:dir size:1 refs:2 ptrs: 4 -- -- -- -- -- -- -- 
[   6 ]      type:reg size:0 refs:1 ptrs: -- -- -- -- -- -- -- -- 
[   7 ]      chunk(imap): 5 6 -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[   8 ] live v0v0v0v0v0v0v0v0v0v0v0v0v0v0v0v0
[   9 ] live type:reg size:8 refs:1 ptrs: -- -- -- -- -- -- -- 8 
[  10 ] live chunk(imap): 5 9 -- -- -- -- -- -- -- -- -- -- -- -- -- --
```

</details>

<details><summary>Simulator answer: <code>./lfs.py -L c,/foo -c</code></summary>

```text
INITIAL file system contents:
[   0 ] live checkpoint: 3 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[   1 ] live [.,0] [..,0] -- -- -- -- -- -- 
[   2 ] live type:dir size:1 refs:2 ptrs: 1 -- -- -- -- -- -- -- 
[   3 ] live chunk(imap): 2 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 

command? 

FINAL file system contents:
[   0 ] live checkpoint: 7 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[   1 ]      [.,0] [..,0] -- -- -- -- -- -- 
[   2 ]      type:dir size:1 refs:2 ptrs: 1 -- -- -- -- -- -- -- 
[   3 ]      chunk(imap): 2 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[   4 ] live [.,0] [..,0] [foo,1] -- -- -- -- -- 
[   5 ] live type:dir size:1 refs:2 ptrs: 4 -- -- -- -- -- -- -- 
[   6 ] live type:reg size:0 refs:1 ptrs: -- -- -- -- -- -- -- -- 
[   7 ] live chunk(imap): 5 6 -- -- -- -- -- -- -- -- -- -- -- -- -- --
```

</details>

<details><summary>Simulator answer: <code>./lfs.py -L d,/foo -c</code></summary>

```text
INITIAL file system contents:
[   0 ] live checkpoint: 3 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[   1 ] live [.,0] [..,0] -- -- -- -- -- -- 
[   2 ] live type:dir size:1 refs:2 ptrs: 1 -- -- -- -- -- -- -- 
[   3 ] live chunk(imap): 2 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 

command? 

FINAL file system contents:
[   0 ] live checkpoint: 8 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[   1 ]      [.,0] [..,0] -- -- -- -- -- -- 
[   2 ]      type:dir size:1 refs:2 ptrs: 1 -- -- -- -- -- -- -- 
[   3 ]      chunk(imap): 2 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[   4 ] live [.,0] [..,0] [foo,1] -- -- -- -- -- 
[   5 ] live [.,1] [..,0] -- -- -- -- -- -- 
[   6 ] live type:dir size:1 refs:3 ptrs: 4 -- -- -- -- -- -- -- 
[   7 ] live type:dir size:1 refs:2 ptrs: 5 -- -- -- -- -- -- -- 
[   8 ] live chunk(imap): 6 7 -- -- -- -- -- -- -- -- -- -- -- -- -- --
```

</details>

<details><summary>Simulator answer: <code>./lfs.py -L c,/foo:l,/foo,/bar:l,/foo,/goo -o -i -c</code></summary>

```text
INITIAL file system contents:
[   0 ] live checkpoint: 3 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[   1 ] live [.,0] [..,0] -- -- -- -- -- -- 
[   2 ] live type:dir size:1 refs:2 ptrs: 1 -- -- -- -- -- -- -- 
[   3 ] live chunk(imap): 2 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 

create file /foo 

[   0 ] live checkpoint: 7 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
...
[   4 ] live [.,0] [..,0] [foo,1] -- -- -- -- -- 
[   5 ] live type:dir size:1 refs:2 ptrs: 4 -- -- -- -- -- -- -- 
[   6 ] live type:reg size:0 refs:1 ptrs: -- -- -- -- -- -- -- -- 
[   7 ] live chunk(imap): 5 6 -- -- -- -- -- -- -- -- -- -- -- -- -- -- 


link file   /foo /bar 

[   0 ] live checkpoint: 11 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
...
[   8 ] live [.,0] [..,0] [foo,1] [bar,1] -- -- -- -- 
[   9 ] live type:dir size:1 refs:2 ptrs: 8 -- -- -- -- -- -- -- 
[  10 ] live type:reg size:0 refs:2 ptrs: -- -- -- -- -- -- -- -- 
[  11 ] live chunk(imap): 9 10 -- -- -- -- -- -- -- -- -- -- -- -- -- -- 


link file   /foo /goo 

[   0 ] live checkpoint: 15 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
...
[  12 ] live [.,0] [..,0] [foo,1] [bar,1] [goo,1] -- -- -- 
[  13 ] live type:dir size:1 refs:2 ptrs: 12 -- -- -- -- -- -- -- 
[  14 ] live type:reg size:0 refs:3 ptrs: -- -- -- -- -- -- -- -- 
[  15 ] live chunk(imap): 13 14 -- -- -- -- -- -- -- -- -- -- -- -- -- -- 



FINAL file system contents:
[   0 ] live checkpoint: 15 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[   1 ]      [.,0] [..,0] -- -- -- -- -- -- 
[   2 ]      type:dir size:1 refs:2 ptrs: 1 -- -- -- -- -- -- -- 
[   3 ]      chunk(imap): 2 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[   4 ]      [.,0] [..,0] [foo,1] -- -- -- -- -- 
[   5 ]      type:dir size:1 refs:2 ptrs: 4 -- -- -- -- -- -- -- 
[   6 ]      type:reg size:0 refs:1 ptrs: -- -- -- -- -- -- -- -- 
[   7 ]      chunk(imap): 5 6 -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[   8 ]      [.,0] [..,0] [foo,1] [bar,1] -- -- -- -- 
[   9 ]      type:dir size:1 refs:2 ptrs: 8 -- -- -- -- -- -- -- 
[  10 ]      type:reg size:0 refs:2 ptrs: -- -- -- -- -- -- -- -- 
[  11 ]      chunk(imap): 9 10 -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[  12 ] live [.,0] [..,0] [foo,1] [bar,1] [goo,1] -- -- -- 
[  13 ] live type:dir size:1 refs:2 ptrs: 12 -- -- -- -- -- -- -- 
[  14 ] live type:reg size:0 refs:3 ptrs: -- -- -- -- -- -- -- -- 
[  15 ] live chunk(imap): 13 14 -- -- -- -- -- -- -- -- -- -- -- -- -- --
```

</details>

<details><summary>Simulator answer: <code>./lfs.py -p c100 -n 10 -o -a s -c</code></summary>

```text
INITIAL file system contents:
[   0 ] live checkpoint: 3 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[   1 ] live [.,0] [..,0] -- -- -- -- -- -- 
[   2 ] live type:dir size:1 refs:2 ptrs: 1 -- -- -- -- -- -- -- 
[   3 ] live chunk(imap): 2 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 

create file /kg5 
create file /hm5 
create file /ht6 
create file /zv9 
create file /xr4 
create file /px9 
create file /gu5 
create file /kv6 
create file /wg3 
create file /og9 

FINAL file system contents:
[   0 ] live checkpoint: 43 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[   1 ]      [.,0] [..,0] -- -- -- -- -- -- 
[   2 ]      type:dir size:1 refs:2 ptrs: 1 -- -- -- -- -- -- -- 
[   3 ]      chunk(imap): 2 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[   4 ]      [.,0] [..,0] [kg5,1] -- -- -- -- -- 
[   5 ]      type:dir size:1 refs:2 ptrs: 4 -- -- -- -- -- -- -- 
[   6 ] live type:reg size:0 refs:1 ptrs: -- -- -- -- -- -- -- -- 
[   7 ]      chunk(imap): 5 6 -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[   8 ]      [.,0] [..,0] [kg5,1] [hm5,2] -- -- -- -- 
[   9 ]      type:dir size:1 refs:2 ptrs: 8 -- -- -- -- -- -- -- 
[  10 ] live type:reg size:0 refs:1 ptrs: -- -- -- -- -- -- -- -- 
[  11 ]      chunk(imap): 9 6 10 -- -- -- -- -- -- -- -- -- -- -- -- -- 
[  12 ]      [.,0] [..,0] [kg5,1] [hm5,2] [ht6,3] -- -- -- 
[  13 ]      type:dir size:1 refs:2 ptrs: 12 -- -- -- -- -- -- -- 
[  14 ] live type:reg size:0 refs:1 ptrs: -- -- -- -- -- -- -- -- 
[  15 ]      chunk(imap): 13 6 10 14 -- -- -- -- -- -- -- -- -- -- -- -- 
[  16 ]      [.,0] [..,0] [kg5,1] [hm5,2] [ht6,3] [zv9,4] -- -- 
[  17 ]      type:dir size:1 refs:2 ptrs: 16 -- -- -- -- -- -- -- 
[  18 ] live type:reg size:0 refs:1 ptrs: -- -- -- -- -- -- -- -- 
[  19 ]      chunk(imap): 17 6 10 14 18 -- -- -- -- -- -- -- -- -- -- -- 
[  20 ]      [.,0] [..,0] [kg5,1] [hm5,2] [ht6,3] [zv9,4] [xr4,5] -- 
[  21 ]      type:dir size:1 refs:2 ptrs: 20 -- -- -- -- -- -- -- 
[  22 ] live type:reg size:0 refs:1 ptrs: -- -- -- -- -- -- -- -- 
[  23 ]      chunk(imap): 21 6 10 14 18 22 -- -- -- -- -- -- -- -- -- -- 
[  24 ] live [.,0] [..,0] [kg5,1] [hm5,2] [ht6,3] [zv9,4] [xr4,5] [px9,6] 
[  25 ]      type:dir size:1 refs:2 ptrs: 24 -- -- -- -- -- -- -- 
[  26 ] live type:reg size:0 refs:1 ptrs: -- -- -- -- -- -- -- -- 
[  27 ]      chunk(imap): 25 6 10 14 18 22 26 -- -- -- -- -- -- -- -- -- 
[  28 ]      [gu5,7] -- -- -- -- -- -- -- 
[  29 ]      type:dir size:2 refs:2 ptrs: 24 28 -- -- -- -- -- -- 
[  30 ] live type:reg size:0 refs:1 ptrs: -- -- -- -- -- -- -- -- 
[  31 ]      chunk(imap): 29 6 10 14 18 22 26 30 -- -- -- -- -- -- -- -- 
[  32 ]      [gu5,7] [kv6,8] -- -- -- -- -- -- 
[  33 ]      type:dir size:2 refs:2 ptrs: 24 32 -- -- -- -- -- -- 
[  34 ] live type:reg size:0 refs:1 ptrs: -- -- -- -- -- -- -- -- 
[  35 ]      chunk(imap): 33 6 10 14 18 22 26 30 34 -- -- -- -- -- -- -- 
[  36 ]      [gu5,7] [kv6,8] [wg3,9] -- -- -- -- -- 
[  37 ]      type:dir size:2 refs:2 ptrs: 24 36 -- -- -- -- -- -- 
[  38 ] live type:reg size:0 refs:1 ptrs: -- -- -- -- -- -- -- -- 
[  39 ]      chunk(imap): 37 6 10 14 18 22 26 30 34 38 -- -- -- -- -- -- 
[  40 ] live [gu5,7] [kv6,8] [wg3,9] [og9,10] -- -- -- -- 
[  41 ] live type:dir size:2 refs:2 ptrs: 24 40 -- -- -- -- -- -- 
[  42 ] live type:reg size:0 refs:1 ptrs: -- -- -- -- -- -- -- -- 
[  43 ] live chunk(imap): 41 6 10 14 18 22 26 30 34 38 42 -- -- -- -- --
```

</details>

<details><summary>Simulator answer: <code>./lfs.py -p c100 -n 10 -o -a r -c</code></summary>

```text
INITIAL file system contents:
[   0 ] live checkpoint: 3 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[   1 ] live [.,0] [..,0] -- -- -- -- -- -- 
[   2 ] live type:dir size:1 refs:2 ptrs: 1 -- -- -- -- -- -- -- 
[   3 ] live chunk(imap): 2 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 

create file /kg5 
create file /hm5 
create file /ht6 
create file /zv9 
create file /xr4 
create file /px9 
create file /gu5 
create file /kv6 
create file /wg3 
create file /og9 

FINAL file system contents:
[   0 ] live checkpoint: 52 38 -- -- -- 23 -- 13 53 -- -- 48 8 -- 33 -- 
[   1 ]      [.,0] [..,0] -- -- -- -- -- -- 
[   2 ]      type:dir size:1 refs:2 ptrs: 1 -- -- -- -- -- -- -- 
[   3 ]      chunk(imap): 2 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[   4 ]      [.,0] [..,0] [kg5,205] -- -- -- -- -- 
[   5 ]      type:dir size:1 refs:2 ptrs: 4 -- -- -- -- -- -- -- 
[   6 ] live type:reg size:0 refs:1 ptrs: -- -- -- -- -- -- -- -- 
[   7 ]      chunk(imap): 5 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[   8 ] live chunk(imap): -- -- -- -- -- -- -- -- -- -- -- -- -- 6 -- -- 
[   9 ]      [.,0] [..,0] [kg5,205] [hm5,114] -- -- -- -- 
[  10 ]      type:dir size:1 refs:2 ptrs: 9 -- -- -- -- -- -- -- 
[  11 ] live type:reg size:0 refs:1 ptrs: -- -- -- -- -- -- -- -- 
[  12 ]      chunk(imap): 10 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[  13 ] live chunk(imap): -- -- 11 -- -- -- -- -- -- -- -- -- -- -- -- -- 
[  14 ]      [.,0] [..,0] [kg5,205] [hm5,114] [ht6,20] -- -- -- 
[  15 ]      type:dir size:1 refs:2 ptrs: 14 -- -- -- -- -- -- -- 
[  16 ] live type:reg size:0 refs:1 ptrs: -- -- -- -- -- -- -- -- 
[  17 ]      chunk(imap): 15 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[  18 ]      chunk(imap): -- -- -- -- 16 -- -- -- -- -- -- -- -- -- -- -- 
[  19 ]      [.,0] [..,0] [kg5,205] [hm5,114] [ht6,20] [zv9,81] -- -- 
[  20 ]      type:dir size:1 refs:2 ptrs: 19 -- -- -- -- -- -- -- 
[  21 ] live type:reg size:0 refs:1 ptrs: -- -- -- -- -- -- -- -- 
[  22 ]      chunk(imap): 20 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[  23 ] live chunk(imap): -- 21 -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[  24 ]      [.,0] [..,0] [kg5,205] [hm5,114] [ht6,20] [zv9,81] [xr4,130] -- 
[  25 ]      type:dir size:1 refs:2 ptrs: 24 -- -- -- -- -- -- -- 
[  26 ] live type:reg size:0 refs:1 ptrs: -- -- -- -- -- -- -- -- 
[  27 ]      chunk(imap): 25 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[  28 ]      chunk(imap): -- -- 26 -- -- -- -- -- -- -- -- -- -- -- -- -- 
[  29 ] live [.,0] [..,0] [kg5,205] [hm5,114] [ht6,20] [zv9,81] [xr4,130] [px9,238] 
[  30 ]      type:dir size:1 refs:2 ptrs: 29 -- -- -- -- -- -- -- 
[  31 ] live type:reg size:0 refs:1 ptrs: -- -- -- -- -- -- -- -- 
[  32 ]      chunk(imap): 30 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[  33 ] live chunk(imap): -- -- -- -- -- -- -- -- -- -- -- -- -- -- 31 -- 
[  34 ]      [gu5,27] -- -- -- -- -- -- -- 
[  35 ]      type:dir size:2 refs:2 ptrs: 29 34 -- -- -- -- -- -- 
[  36 ] live type:reg size:0 refs:1 ptrs: -- -- -- -- -- -- -- -- 
[  37 ]      chunk(imap): 35 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[  38 ] live chunk(imap): -- -- -- -- 16 -- -- -- -- -- -- 36 -- -- -- -- 
[  39 ]      [gu5,27] [kv6,141] -- -- -- -- -- -- 
[  40 ]      type:dir size:2 refs:2 ptrs: 29 39 -- -- -- -- -- -- 
[  41 ] live type:reg size:0 refs:1 ptrs: -- -- -- -- -- -- -- -- 
[  42 ]      chunk(imap): 40 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[  43 ]      chunk(imap): -- -- 26 -- -- -- -- -- -- -- -- -- -- 41 -- -- 
[  44 ]      [gu5,27] [kv6,141] [wg3,180] -- -- -- -- -- 
[  45 ]      type:dir size:2 refs:2 ptrs: 29 44 -- -- -- -- -- -- 
[  46 ] live type:reg size:0 refs:1 ptrs: -- -- -- -- -- -- -- -- 
[  47 ]      chunk(imap): 45 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[  48 ] live chunk(imap): -- -- -- -- 46 -- -- -- -- -- -- -- -- -- -- -- 
[  49 ] live [gu5,27] [kv6,141] [wg3,180] [og9,140] -- -- -- -- 
[  50 ] live type:dir size:2 refs:2 ptrs: 29 49 -- -- -- -- -- -- 
[  51 ] live type:reg size:0 refs:1 ptrs: -- -- -- -- -- -- -- -- 
[  52 ] live chunk(imap): 50 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[  53 ] live chunk(imap): -- -- 26 -- -- -- -- -- -- -- -- -- 51 41 -- --
```

</details>

<details><summary>Simulator answer: <code>./lfs.py -N -i -o -s 1000 -c</code></summary>

```text
INITIAL file system contents:
[   0 ] live checkpoint: 3 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[   1 ] live [.,0] [..,0] -- -- -- -- -- -- 
[   2 ] live type:dir size:1 refs:2 ptrs: 1 -- -- -- -- -- -- -- 
[   3 ] live chunk(imap): 2 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 

create dir  /jm5 

[   4 ] live [.,0] [..,0] [jm5,1] -- -- -- -- -- 
[   5 ] live [.,1] [..,0] -- -- -- -- -- -- 
[   6 ] live type:dir size:1 refs:3 ptrs: 4 -- -- -- -- -- -- -- 
[   7 ] live type:dir size:1 refs:2 ptrs: 5 -- -- -- -- -- -- -- 
[   8 ] live chunk(imap): 6 7 -- -- -- -- -- -- -- -- -- -- -- -- -- -- 


create file /jm5/jm2 

[   9 ] live [.,1] [..,0] [jm2,2] -- -- -- -- -- 
[  10 ] live type:dir size:1 refs:2 ptrs: 9 -- -- -- -- -- -- -- 
[  11 ] live type:reg size:0 refs:1 ptrs: -- -- -- -- -- -- -- -- 
[  12 ] live chunk(imap): 6 10 11 -- -- -- -- -- -- -- -- -- -- -- -- -- 


create dir  /lb9 

[  13 ] live [.,0] [..,0] [jm5,1] [lb9,3] -- -- -- -- 
[  14 ] live [.,3] [..,0] -- -- -- -- -- -- 
[  15 ] live type:dir size:1 refs:4 ptrs: 13 -- -- -- -- -- -- -- 
[  16 ] live type:dir size:1 refs:2 ptrs: 14 -- -- -- -- -- -- -- 
[  17 ] live chunk(imap): 15 10 11 16 -- -- -- -- -- -- -- -- -- -- -- -- 



FINAL file system contents:
[   0 ] live checkpoint: 3 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[   1 ]      [.,0] [..,0] -- -- -- -- -- -- 
[   2 ]      type:dir size:1 refs:2 ptrs: 1 -- -- -- -- -- -- -- 
[   3 ]      chunk(imap): 2 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[   4 ]      [.,0] [..,0] [jm5,1] -- -- -- -- -- 
[   5 ]      [.,1] [..,0] -- -- -- -- -- -- 
[   6 ]      type:dir size:1 refs:3 ptrs: 4 -- -- -- -- -- -- -- 
[   7 ]      type:dir size:1 refs:2 ptrs: 5 -- -- -- -- -- -- -- 
[   8 ]      chunk(imap): 6 7 -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
[   9 ] live [.,1] [..,0] [jm2,2] -- -- -- -- -- 
[  10 ] live type:dir size:1 refs:2 ptrs: 9 -- -- -- -- -- -- -- 
[  11 ] live type:reg size:0 refs:1 ptrs: -- -- -- -- -- -- -- -- 
[  12 ]      chunk(imap): 6 10 11 -- -- -- -- -- -- -- -- -- -- -- -- -- 
[  13 ] live [.,0] [..,0] [jm5,1] [lb9,3] -- -- -- -- 
[  14 ] live [.,3] [..,0] -- -- -- -- -- -- 
[  15 ] live type:dir size:1 refs:4 ptrs: 13 -- -- -- -- -- -- -- 
[  16 ] live type:dir size:1 refs:2 ptrs: 14 -- -- -- -- -- -- -- 
[  17 ] live chunk(imap): 15 10 11 16 -- -- -- -- -- -- -- -- -- -- -- --
```

</details>

## The simulator (README from the homework repository)


# Overview

This homework involves a simulator of the log-structured file system, LFS. 
The simulator simplifies the book chapter's LFS a bit, but hopefully leaves
enough in place in order to illustrate some of the important properties of
such a file system.

To get start, run the following:

```sh
prompt> ./lfs.py -n 1 -o
```

What you will see is as follows:

```sh
INITIAL file system contents:
[   0 ] live checkpoint: 3 -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
[   1 ] live [.,0] [..,0] -- -- -- -- -- --
[   2 ] live type:dir size:1 refs:2 ptrs: 1 -- -- -- -- -- -- --
[   3 ] live chunk(imap): 2 -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

create file /ku3

FINAL file system contents:
[   0 ]  ?   checkpoint: 7 -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
[   1 ]  ?   [.,0] [..,0] -- -- -- -- -- --
[   2 ]  ?   type:dir size:1 refs:2 ptrs: 1 -- -- -- -- -- -- --
[   3 ]  ?   chunk(imap): 2 -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
[   4 ]  ?   [.,0] [..,0] [ku3,1] -- -- -- -- --
[   5 ]  ?   type:dir size:1 refs:2 ptrs: 4 -- -- -- -- -- -- --
[   6 ]  ?   type:reg size:0 refs:1 ptrs: -- -- -- -- -- -- -- --
[   7 ]  ?   chunk(imap): 5 6 -- -- -- -- -- -- -- -- -- -- -- -- -- --
```

The output shows the initial file system state of an empty LFS, with a few
different blocks initialized. The first block (block 0) is the "checkpoint
region" of this LFS. For simplicity, this LFS only has one checkpoint region,
and it is always located at block address=0, and is always just the size
of a single block.

The contents of the checkpoint region are just disk addresses: locations
of chunks of the inode map. In this case, the checkpoint region has the
following contents:

```sh
checkpoint: 3 -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
```

Let's call the leftmost entry (marked with a 3 here) the 0th entry,
the next one the 1st, and the last one (because there are 16) the
15th entry. Thus, we can think of them as:

```sh
checkpoint: 3 -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
    entry:  0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15
```

This means that the first chunk of the inode map resides at disk address=3,
and that the rest of the inode map pieces have yet to be allocated (and 
hence are marked "--").

Let's now look at that chunk of the inode map ("imap" from now on). The
imap is just an array that tells you, for each inode number, its current
location on the disk. In the initial state shown above, we see this:

```sh
chunk(imap): 2 -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
```

These chunks also have (by default) 16 entries, and again we can think of
them as such:

```sh
chunk(imap): 2 -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
     entry:  0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15
```

Because each chunk of the imap has 16 entries, and because the checkpoint
region (CR) has 16 entries, we now know that the entire LFS has 16x16=256
inode numbers available for files. A small file system(!) but good enough
for our purposes.

We also now know that each chunk of the imap is responsible for a contiguous
group of inodes, and we know which ones depending on which entry in the CR
points to this chunk. Specifically, entry 0 of the CR points to a chunk of
the imap that has information about inode numbers 0...15; entry 1 of the CR
points to an imap chunk for inode numbers 16...31. 

In this specific example, we know the 0th entry of the CR points to block=3,
and in there, the 0th entry has a '2' in it. In our simulator, the root inode
is inode number=0, and thus this is the inode of the root directory of the 
file system. From the imap, we now know the location of inode number=0's
address is block=2. So let's look at block 2! We see: 

```sh
type:dir size:1 refs:2 ptrs: 1 -- -- -- -- -- -- --
```

This file metadata is a simplified inode, with file type (a directory), size
(1 block), reference count (how many directories it refers to, if this is a
directory), and some number of pointers to data blocks (in this case, one,
which points to block address=1). 

This finally leads us to the last bit of initial state, which is the contents 
of the directory. This directory only has one block in it (at address 1),
which has contents:

```sh
[.,0] [..,0] -- -- -- -- -- --
```

Herein lies an empty directory, with [name,inode number] pairs for itself
(".") and its parent (".."). In this special case (the root), the parent is
just itself, and both are inode number=0. Whew! We have now (hopefully)
understood the entire contents of the initial state of the file system.

What happens next in the default mode of the simulation is that one or more
operations are run against the file system, thus changing its state. In this
case, we know what the command because we had the simulator tell us via the 
"-o" flag (which shows each operation as it is run). That operation is:

```sh
create file /ku3
```

This means a file "ku3" was created in the root directory "/". To accomplish
this creation, a number of structures must be updated, which means that the
log was written to. You can see that four writes occur beyond the previous end
of the log (address=3), at blocks 4...7:

```sh
[.,0] [..,0] [ku3,1] -- -- -- -- --
type:dir size:1 refs:2 ptrs: 4 -- -- -- -- -- -- --
type:reg size:0 refs:1 ptrs: -- -- -- -- -- -- -- --
chunk(imap): 5 6 -- -- -- -- -- -- -- -- -- -- -- -- -- --
```

These updates reflect how this version of LFS writes to the disk to create a
file: 
- A directory block update to include "ku3" and its inode number (1) in the root directory
- An updated root inode which now refers to block 4 where the latest contents of this directory are found
- A new inode for the newly created file (note the type) 
- A new version of the first imap chunk which now tells us where both inode 0 and inode 1 are located

However, this does not (quite) reflect all that must change. Because the inode
map itself has changed, the checkpoint region must also reflect where the
latest chunk of the first piece of the inode map resides. Thus, the CR is also
updated: 

```sh
checkpoint: 7 -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
```

You might also have noticed one more thing in the output. In the initial file
system contents, there is a marker between the disk address and the contents
that says "live" for each entry, and in the final output there is a "?"
instead. This "?" is there so you can determine, for yourself, whether each
block is live or not. Start with the checkpoint region and see if you can
determine which group of blocks can be reached (and hence are live); all the
rest are thus dead and could be used again. 

To see if you are right, run again with `-c`:

```sh
prompt> ./lfs.py -n 1 -o -c

...
```

As you can now see, every time a structure is updated, garbage is left behind,
one of the main issues a non-update-in-place file system like LFS must deal
with. Fortunately, for you, we won't worry too much about garbage collection
in this simplified version of LFS.

You now have all the information you need to understand this version of LFS.

The other options, which let you play with various aspects of the simulator, include: 

```sh
prompt> ./lfs.py -h
Usage: lfs.py [options]

Options:
  -h, --help            show this help message and exit
  -s SEED, --seed=SEED  the random seed
  -N, --no_force        Do not force checkpoint writes after updates
  -D, --use_disk_cr     use disk (maybe old) version of checkpoint region
  -c, --compute         compute answers for me
  -o, --show_operations
                        print out operations as they occur
  -i, --show_intermediate
                        print out state changes as they occur
  -e, --show_return_codes
                        show error/return codes
  -n NUM_COMMANDS, --num_commands=NUM_COMMANDS
                        generate N random commands
  -p PERCENTAGES, --percentages=PERCENTAGES
                        percent chance of:
                        createfile,writefile,createdir,rmfile,linkfile,sync
                        (example is c30,w30,d10,r20,l10,s0)
  -a INODE_POLICY, --allocation_policy=INODE_POLICY
                        inode allocation policy: "r" for "random" or "s" for
                        "sequential"
  -L COMMAND_LIST, --command_list=COMMAND_LIST
                        command list in format:
                        "cmd1,arg1,...,argN:cmd2,arg1,...,argN:... where cmds
                        are:c:createfile, d:createdir, r:delete, w:write,
                        l:link, s:syncformat: c,filepath d,dirpath r,filepath
                        w,filepath,offset,numblks l,srcpath,dstpath s
```






