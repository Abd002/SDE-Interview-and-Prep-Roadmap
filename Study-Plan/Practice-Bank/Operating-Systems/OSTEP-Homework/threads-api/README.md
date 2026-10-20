# OSTEP homework: threads-api

> Copied from <https://github.com/remzi-arpacidusseau/ostep-homework/tree/master/threads-api> (by Remzi and Andrea Arpaci-Dusseau). Questions and answers are the source's own; nothing was answered or rewritten here. The simulators in this folder are the answer key: run any command from the questions again with `-c` and the simulator prints the official answer.

## Homework questions from the book chapter

> From the chapter PDF <https://pages.cs.wisc.edu/~remzi/OSTEP/threads-api.pdf>. Answer each one with the simulator, then add `-c` to see the official answer.

```text
Homework (Code)
   In this section, we'll write some simple multi-threaded programs and
use a specific tool, called helgrind, to find problems in these programs.
   Read the README in the homework download for details on how to
build the programs and run helgrind.

Questions
     1. First build main-race.c. Examine the code so you can see the
        (hopefully obvious) data race in the code. Now run helgrind (by
        typing valgrind --tool=helgrind main-race) to see how it
        reports the race. Does it point to the right lines of code? What other
        information does it give to you?
     2. What happens when you remove one of the offending lines of code?
        Now add a lock around one of the updates to the shared variable,
        and then around both. What does helgrind report in each of these
        cases?
     3. Now let's look at main-deadlock.c. Examine the code. This
        code has a problem known as deadlock (which we discuss in much
        more depth in a forthcoming chapter). Can you see what problem
        it might have?
     4. Now run helgrind on this code. What does helgrind report?
     5. Now run helgrind on main-deadlock-global.c. Examine
        the code; does it have the same problem that main-deadlock.c
        has? Should helgrind be reporting the same error? What does
        this tell you about tools like helgrind?
     6. Let's next look at main-signal.c. This code uses a variable (done)
        to signal that the child is done and that the parent can now continue.
        Why is this code inefficient? (what does the parent end up spend-
        ing its time doing, particularly if the child thread takes a long time
        to complete?)
     7. Now run helgrind on this program. What does it report? Is the
        code correct?
     8. Now look at a slightly modified version of the code, which is found
        in main-signal-cv.c. This version uses a condition variable to
        do the signaling (and associated lock). Why is this code preferred
        to the previous version? Is it correctness, or performance, or both?
     9. Once again run helgrind on main-signal-cv. Does it report
        any errors?
```

## The simulator (README from the homework repository)


# Overview

In this homework, you'll use a real tool on Linux to find problems in
multi-threaded code. The tool is called `helgrind` (available as part of the
valgrind suite of debugging tools).

See `http://valgrind.org/docs/manual/hg-manual.htm` for details about
the tool, including how to download and install it (if it's not
already on your Linux system).

You'll then look at a number of multi-threaded C programs to see how you can
use the tool to debug problematic threaded code.

First things first: download and install `valgrind` and the related `helgrind` tool. 

Then, type `make` to build all the different programs. Examine the `Makefile`
for more details on how that works.

Then, you have a few different C programs to look at:
- `main-race.c`: A simple race condition
- `main-deadlock.c`: A simple deadlock
- `main-deadlock-global.c`: A solution to the deadlock problem
- `main-signal.c`: A simple child/parent signaling example
- `main-signal-cv.c`: A more efficient signaling via condition variables
- `common_threads.h`: Header file with wrappers to make code check errors and be more readable

With these programs, you can now answer the questions in the textbook.




