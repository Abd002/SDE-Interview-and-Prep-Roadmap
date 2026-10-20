# OSTEP homework: cpu-intro

> Copied from <https://github.com/remzi-arpacidusseau/ostep-homework/tree/master/cpu-intro> (by Remzi and Andrea Arpaci-Dusseau). Questions and answers are the source's own; nothing was answered or rewritten here. The simulators in this folder are the answer key: run any command from the questions again with `-c` and the simulator prints the official answer.

## Homework questions from the book chapter

> From the chapter PDF <https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-intro.pdf>. Answer each one with the simulator, then add `-c` to see the official answer.

```text
Homework (Simulation)
   This program, process-run.py, allows you to see how process states
change as programs run and either use the CPU (e.g., perform an add
instruction) or do I/O (e.g., send a request to a disk and wait for it to
complete). See the README for details.

Questions
     1. Run process-run.py with the following flags: -l 5:100,5:100.
        What should the CPU utilization be (e.g., the percent of time the
        CPU is in use?) Why do you know this? Use the -c and -p flags to
        see if you were right.
     2. Now run with these flags: ./process-run.py -l 4:100,1:0.
        These flags specify one process with 4 instructions (all to use the
        CPU), and one that simply issues an I/O and waits for it to be done.
        How long does it take to complete both processes? Use -c and -p
        to find out if you were right.
     3. Switch the order of the processes: -l 1:0,4:100. What happens
        now? Does switching the order matter? Why? (As always, use -c
        and -p to see if you were right)
     4. We'll now explore some of the other flags. One important flag is
        -S, which determines how the system reacts when a process is-
        sues an I/O. With the flag set to SWITCH ON END, the system
        will NOT switch to another process while one is doing I/O, in-
        stead waiting until the process is completely finished. What hap-
        pens when you run the following two processes (-l 1:0,4:100
        -c -S SWITCH ON END), one doing I/O and the other doing CPU
        work?
     5. Now, run the same processes, but with the switching behavior set
        to switch to another process whenever one is WAITING for I/O (-l
        1:0,4:100 -c -S SWITCH ON IO). What happens now? Use -c
        and -p to confirm that you are right.
     6. One other important behavior is what to do when an I/O com-
        pletes. With -I IO RUN LATER, when an I/O completes, the pro-
        cess that issued it is not necessarily run right away; rather, what-
        ever was running at the time keeps running. What happens when
        you run this combination of processes? (./process-run.py -l
        3:0,5:100,5:100,5:100 -S SWITCH ON IO -c -p -I
        IO RUN LATER) Are system resources being effectively utilized?
     7. Now run the same processes, but with -I IO RUN IMMEDIATE set,
        which immediately runs the process that issued the I/O. How does
        this behavior differ? Why might running a process that just com-
        pleted an I/O again be a good idea?

T HE A BSTRACTION : T HE P ROCESS                                    13

  8. Now run with some randomly generated processes using flags -s
     1 -l 3:50,3:50 or -s 2 -l 3:50,3:50 or -s 3 -l 3:50,
     3:50. See if you can predict how the trace will turn out. What hap-
     pens when you use the flag -I IO RUN IMMEDIATE versus that
     flag -I IO RUN LATER? What happens when you use the flag -S
     SWITCH ON IO versus -S SWITCH ON END?
```

### Answers printed by the official simulator

For every command the questions list, this is what `process-run.py` prints with `-c` (compute the answer). Try each question first.

<details><summary>Simulator answer: <code>./process-run.py -l 4:100,1:0 -c</code></summary>

```text
Time        PID: 0        PID: 1           CPU           IOs
  1        RUN:cpu         READY             1          
  2        RUN:cpu         READY             1          
  3        RUN:cpu         READY             1          
  4        RUN:cpu         READY             1          
  5           DONE        RUN:io             1          
  6           DONE       BLOCKED                           1
  7           DONE       BLOCKED                           1
  8           DONE       BLOCKED                           1
  9           DONE       BLOCKED                           1
 10           DONE       BLOCKED                           1
 11*          DONE   RUN:io_done             1
```

</details>

## The simulator (README from the homework repository)


# Overview

This program, called process-run.py, allows you to see how the state of a
process state changes as it runs on a CPU. As described in the chapter, 
processes can be in a few different states:

```sh
RUNNING - the process is using the CPU right now
READY   - the process could be using the CPU right now
          but (alas) some other process is
BLOCKED - the process is waiting on I/O
          (e.g., it issued a request to a disk)
DONE    - the process is finished executing
```

In this homework, we'll see how these process states change as a program
runs, and thus learn a little bit better how these things work.

To run the program and get its options, do this:

```sh
prompt> ./process-run.py -h
```

If this doesn't work, type `python` before the command, like this:

```sh
prompt> python process-run.py -h
```

What you should see is this:

```sh
Usage: process-run.py [options]

Options:
  -h, --help            show this help message and exit
  -s SEED, --seed=SEED  the random seed
  -l PROCESS_LIST, --processlist=PROCESS_LIST
                        a comma-separated list of processes to run, in the
                        form X1:Y1,X2:Y2,... where X is the number of
                        instructions that process should run, and Y the
                        chances (from 0 to 100) that an instruction will use
                        the CPU or issue an IO
  -L IO_LENGTH, --iolength=IO_LENGTH
                        how long an IO takes
  -S PROCESS_SWITCH_BEHAVIOR, --switch=PROCESS_SWITCH_BEHAVIOR
                        when to switch between processes: SWITCH_ON_IO,
                        SWITCH_ON_END
  -I IO_DONE_BEHAVIOR, --iodone=IO_DONE_BEHAVIOR
                        type of behavior when IO ends: IO_RUN_LATER,
                        IO_RUN_IMMEDIATE
  -c                    compute answers for me
  -p, --printstats      print statistics at end; only useful with -c flag
                        (otherwise stats are not printed)
```

The most important option to understand is the PROCESS_LIST (as specified by
the -l or --processlist flags) which specifies exactly what each running
program (or 'process') will do. A process consists of instructions, and each
instruction can just do one of two things: 
- use the CPU 
- issue an IO (and wait for it to complete)

When a process uses the CPU (and does no IO at all), it should simply
alternate between RUNNING on the CPU or being READY to run. For example, here
is a simple run that just has one program being run, and that program only
uses the CPU (it does no IO).

```sh
prompt> ./process-run.py -l 5:100 
Produce a trace of what would happen when you run these processes:
Process 0
  cpu
  cpu
  cpu
  cpu
  cpu

Important behaviors:
  System will switch when the current process is FINISHED or ISSUES AN IO
  After IOs, the process issuing the IO will run LATER (when it is its turn)

prompt> 
```

Here, the process we specified is "5:100" which means it should consist of 5
instructions, and the chances that each instruction is a CPU instruction are
100%. 

You can see what happens to the process by using the -c flag, which computes the
answers for you:

```sh
prompt> ./process-run.py -l 5:100 -c
Time     PID: 0        CPU        IOs
  1     RUN:cpu          1
  2     RUN:cpu          1
  3     RUN:cpu          1
  4     RUN:cpu          1
  5     RUN:cpu          1
```

This result is not too interesting: the process is simple in the RUN state and
then finishes, using the CPU the whole time and thus keeping the CPU busy the
entire run, and not doing any I/Os.

Let's make it slightly more complex by running two processes:

```sh
prompt> ./process-run.py -l 5:100,5:100
Produce a trace of what would happen when you run these processes:
Process 0
  cpu
  cpu
  cpu
  cpu
  cpu

Process 1
  cpu
  cpu
  cpu
  cpu
  cpu

Important behaviors:
  Scheduler will switch when the current process is FINISHED or ISSUES AN IO
  After IOs, the process issuing the IO will run LATER (when it is its turn)
```

In this case, two different processes run, each again just using the CPU. What
happens when the operating system runs them? Let's find out:

```sh
prompt> ./process-run.py -l 5:100,5:100 -c
Time     PID: 0     PID: 1        CPU        IOs
  1     RUN:cpu      READY          1
  2     RUN:cpu      READY          1
  3     RUN:cpu      READY          1
  4     RUN:cpu      READY          1
  5     RUN:cpu      READY          1
  6        DONE    RUN:cpu          1
  7        DONE    RUN:cpu          1
  8        DONE    RUN:cpu          1
  9        DONE    RUN:cpu          1
 10        DONE    RUN:cpu          1
```

As you can see above, first the process with "process ID" (or "PID") 0 runs,
while process 1 is READY to run but just waits until 0 is done. When 0 is
finished, it moves to the DONE state, while 1 runs. When 1 finishes, the trace
is done.

Let's look at one more example before getting to some questions. In this
example, the process just issues I/O requests. We specify here that I/Os take 5
time units to complete with the flag -L.

```sh
prompt> ./process-run.py -l 3:0 -L 5
Produce a trace of what would happen when you run these processes:
Process 0
  io
  io_done
  io
  io_done
  io
  io_done

Important behaviors:
  System will switch when the current process is FINISHED or ISSUES AN IO
  After IOs, the process issuing the IO will run LATER (when it is its turn)
```

What do you think the execution trace will look like? Let's find out:

```sh
prompt> ./process-run.py -l 3:0 -L 5 -c
Time    PID: 0       CPU       IOs
  1         RUN:io             1
  2        BLOCKED                           1
  3        BLOCKED                           1
  4        BLOCKED                           1
  5        BLOCKED                           1
  6        BLOCKED                           1
  7*   RUN:io_done             1
  8         RUN:io             1
  9        BLOCKED                           1
 10        BLOCKED                           1
 11        BLOCKED                           1
 12        BLOCKED                           1
 13        BLOCKED                           1
 14*   RUN:io_done             1
 15         RUN:io             1
 16        BLOCKED                           1
 17        BLOCKED                           1
 18        BLOCKED                           1
 19        BLOCKED                           1
 20        BLOCKED                           1
 21*   RUN:io_done             1
```

As you can see, the program just issues three I/Os. When each I/O is issued,
the process moves to a BLOCKED state, and while the device is busy servicing
the I/O, the CPU is idle.

To handle the completion of the I/O, one more CPU action takes place. Note
that a single instruction to handle I/O initiation and completion is not
particularly realistic, but just used here for simplicity.

Let's print some stats (run the same command as above, but with the -p flag)
to see some overall behaviors: 

```sh
Stats: Total Time 21
Stats: CPU Busy 6 (28.57%)
Stats: IO Busy  15 (71.43%)
```

As you can see, the trace took 21 clock ticks to run, but the CPU was
busy less than 30% of the time. The I/O device, on the other hand, was
quite busy. In general, we'd like to keep all the devices busy, as
that is a better use of resources.

There are a few other important flags:
```sh
  -s SEED, --seed=SEED  the random seed  
    this gives you way to create a bunch of different jobs randomly

  -L IO_LENGTH, --iolength=IO_LENGTH
    this determines how long IOs take to complete (default is 5 ticks)

  -S PROCESS_SWITCH_BEHAVIOR, --switch=PROCESS_SWITCH_BEHAVIOR
                        when to switch between processes: SWITCH_ON_IO, SWITCH_ON_END
    this determines when we switch to another process:
    - SWITCH_ON_IO, the system will switch when a process issues an IO
    - SWITCH_ON_END, the system will only switch when the current process is done 

  -I IO_DONE_BEHAVIOR, --iodone=IO_DONE_BEHAVIOR
                        type of behavior when IO ends: IO_RUN_LATER, IO_RUN_IMMEDIATE
    this determines when a process runs after it issues an IO:
    - IO_RUN_IMMEDIATE: switch to this process right now
    - IO_RUN_LATER: switch to this process when it is natural to 
      (e.g., depending on process-switching behavior)
```

Now go answer the questions at the back of the chapter to learn more, please.




