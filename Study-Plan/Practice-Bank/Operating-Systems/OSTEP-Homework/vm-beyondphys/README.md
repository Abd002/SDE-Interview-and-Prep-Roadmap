# OSTEP homework: vm-beyondphys

> Copied from <https://github.com/remzi-arpacidusseau/ostep-homework/tree/master/vm-beyondphys> (by Remzi and Andrea Arpaci-Dusseau). Questions and answers are the source's own; nothing was answered or rewritten here. The simulators in this folder are the answer key: run any command from the questions again with `-c` and the simulator prints the official answer.

## Homework questions from the book chapter

> From the chapter PDF <https://pages.cs.wisc.edu/~remzi/OSTEP/vm-beyondphys.pdf>. Answer each one with the simulator, then add `-c` to see the official answer.

```text
Homework (Measurement)
   This homework introduces you to a new tool, vmstat, and how it can
be used to understand memory, CPU, and I/O usage. Read the associ-
ated README and examine the code in mem.c before proceeding to the
exercises and questions below.
Questions
     1. First, open two separate terminal connections to the same machine,
        so that you can easily run something in one window and the other.
        Now, in one window, run vmstat 1, which shows statistics about
        machine usage every second. Read the man page, the associated
        README, and any other information you need so that you can un-
        derstand its output. Leave this window running vmstat for the
        rest of the exercises below.
        Now, we will run the program mem.c but with very little memory
        usage. This can be accomplished by typing ./mem 1 (which uses
        only 1 MB of memory). How do the CPU usage statistics change
        when running mem? Do the numbers in the user time column
        make sense? How does this change when running more than one
        instance of mem at once?
     2. Let's now start looking at some of the memory statistics while run-
        ning mem. We'll focus on two columns: swpd (the amount of vir-
        tual memory used) and free (the amount of idle memory). Run
        ./mem 1024 (which allocates 1024 MB) and watch how these val-
        ues change. Then kill the running program (by typing control-c)
        and watch again how the values change. What do you notice about
        the values? In particular, how does the free column change when
        the program exits? Does the amount of free memory increase by the
        expected amount when mem exits?
     3. We'll next look at the swap columns (si and so), which indicate
        how much swapping is taking place to and from the disk. Of course,
        to activate these, you'll need to run mem with large amounts of
        memory. First, examine how much free memory is on your Linux
        system (for example, by typing cat /proc/meminfo; type man
        proc for details on the /proc file system and the types of informa-
        tion you can find there). One of the first entries in /proc/meminfo
        is the total amount of memory in your system. Let's assume it's
        something like 8 GB of memory; if so, start by running mem 4000
        (about 4 GB) and watching the swap in/out columns. Do they ever
        give non-zero values? Then, try with 5000, 6000, etc. What hap-
        pens to these values as the program enters the second loop (and
        beyond), as compared to the first loop? How much data (total)
        are swapped in and out during the second, third, and subsequent
        loops? (do the numbers make sense?)

B EYOND P HYSICAL M EMORY: M ECHANISMS                                 11

  4. Do the same experiments as above, but now watch the other statis-
     tics (such as CPU utilization, and block I/O statistics). How do they
     change when mem is running?
  5. Now let's examine performance. Pick an input for mem that com-
     fortably fits in memory (say 4000 if the amount of memory on the
     system is 8 GB). How long does loop 0 take (and subsequent loops
     1, 2, etc.)? Now pick a size comfortably beyond the size of memory
     (say 12000 again assuming 8 GB of memory). How long do the
     loops take here? How do the bandwidth numbers compare? How
     different is performance when constantly swapping versus fitting
     everything comfortably in memory? Can you make a graph, with
     the size of memory used by mem on the x-axis, and the bandwidth of
     accessing said memory on the y-axis? Finally, how does the perfor-
     mance of the first loop compare to that of subsequent loops, for both
     the case where everything fits in memory and where it doesn't?
  6. Swap space isn't infinite. You can use the tool swapon with the -s
     flag to see how much swap space is available. What happens if you
     try to run mem with increasingly large values, beyond what seems
     to be available in swap? At what point does the memory allocation
     fail?
  7. Finally, if you're advanced, you can configure your system to use
     different swap devices using swapon and swapoff. Read the man
     pages for details. If you have access to different hardware, see how
     the performance of swapping changes when swapping to a classic
     hard drive, a flash-based SSD, and even a RAID array. How much
     can swapping performance be improved via newer devices? How
     close can you get to in-memory performance?
```

## The simulator (README from the homework repository)


# Overview

In this homework, you'll be investigating swap performance with a simple
program found in `mem.c`. The program is really simple: it just allocates an
array of integers of a certain size, and then proceeds to loop through it
(repeatedly), incrementing each value in the array. 

Type `make` to build it (and look at the file `Makefile` for details about how
the build works).

Then, type `./mem` followed by a number to run it. The number is the size (in
MB) of the array. Thus, to run with a small array (size 1 MB):

```sh
prompt> ./mem 1
```

and to run with a larger array (size 1 GB):

```sh
prompt> ./mem 1024
```

The program prints out the time it takes to go through each loop as well as
the bandwidth (in MB/s). Bandwidth is particularly interesting to know as it
gives you a sense of how fast the system you're using can move through data;
on modern systems, this is likely in the GB/s range. 

Here is what the output looks like for a typical run:

```sh
prompt> ./mem 1000
allocating 1048576000 bytes (1000.00 MB)
  number of integers in array: 262144000
loop 0 in 448.11 ms (bandwidth: 2231.61 MB/s)
loop 1 in 345.38 ms (bandwidth: 2895.38 MB/s)
loop 2 in 345.18 ms (bandwidth: 2897.07 MB/s)
loop 3 in 345.23 ms (bandwidth: 2896.61 MB/s)
^C
prompt> 
```

The program first tells you how much memory it allocated (in bytes, MB, and in
the number of integers), and then starts looping through the array. The first
loop (in the example above) took 448 milliseconds; because the program
accessed the 1000 MB in just under half a second, the computed bandwidth is
(not surprisingly) just over 2000 MB/s. 

The program continues by doing the same thing over and over, for loops 1, 2,
etc. 

Important: to stop the program, you must kill it. This task is accomplished on
Linux (and all Unix-based systems) by typing control-C (^C) as shown above.

Note that when you run with small array sizes, each loop's performance numbers
won't be printed. For example:

```sh
prompt>  ./mem 1
allocating 1048576 bytes (1.00 MB)
  number of integers in array: 262144
loop 0 in 0.71 ms (bandwidth: 1414.61 MB/s)
loop 607 in 0.33 ms (bandwidth: 3039.35 MB/s)
loop 1215 in 0.33 ms (bandwidth: 3030.57 MB/s)
loop 1823 in 0.33 ms (bandwidth: 3039.35 MB/s)
^C
prompt> 
```

In this case, the program only prints out a sample of outputs, so as not to
flood the screen with too much output. 

The code itself is simple to understand. The first important part is a memory
allocation: 

```c
    // the big memory allocation happens here
    int *x = malloc(size_in_bytes);
```

Then, the main loop begins:

```c
    while (1) {
	x[i++] += 1; // main work of loop done here.
```


The rest is just timing and printing out information. See `mem.c` for details.

Much of the homework revolves around using the tool vmstat to monitor what is
happening with the system. Read the vmstat man page (type `man vmstat`) for
details on how it works, and what each column of output means.



