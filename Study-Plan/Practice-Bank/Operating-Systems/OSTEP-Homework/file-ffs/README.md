# OSTEP homework: file-ffs

> Copied from <https://github.com/remzi-arpacidusseau/ostep-homework/tree/master/file-ffs> (by Remzi and Andrea Arpaci-Dusseau). Questions and answers are the source's own; nothing was answered or rewritten here. The simulators in this folder are the answer key: run any command from the questions again with `-c` and the simulator prints the official answer.

## Homework questions from the book chapter

> From the chapter PDF <https://pages.cs.wisc.edu/~remzi/OSTEP/file-ffs.pdf>. Answer each one with the simulator, then add `-c` to see the official answer.

```text
Homework (Simulation)
   This section introduces ffs.py, a simple FFS simulator you can use
to understand better how FFS-based file and directory allocation work.
See the README for details on how to run the simulator.
Questions
     1. Examine the file in.largefile, and then run the simulator with flag -f
        in.largefile and -L 4. The latter sets the large-file exception to 4 blocks.
        What will the resulting allocation look like? Run with -c to check.
     2. Now run with -L 30. What do you expect to see? Once again, turn on -c
        to see if you were right. You can also use -S to see exactly which blocks
        were allocated to the file /a.
     3. Now we will compute some statistics about the file. The first is something
        we call filespan, which is the max distance between any two data blocks of
        the file or between the inode and any data block. Calculate the filespan of
        /a. Run ffs.py -f in.largefile -L 4 -T -c to see what it is. Do
        the same with -L 100. What difference do you expect in filespan as the
        large-file exception parameter changes from low values to high values?
     4. Now let's look at a new input file, in.manyfiles. How do you think the
        FFS policy will lay these files out across groups? (you can run with -v to
        see what files and directories are created, or just cat in.manyfiles). Run
        the simulator with -c to see if you were right.
     5. A metric to evaluate FFS is called dirspan. This metric calculates the spread
        of files within a particular directory, specifically the max distance between
        the inodes and data blocks of all files in the directory and the inode and data
        block of the directory itself. Run with in.manyfiles and the -T flag, and
        calculate the dirspan of the three directories. Run with -c to check. How
        good of a job does FFS do in minimizing dirspan?
     6. Now change the size of the inode table per group to 5 (-i 5). How do you
        think this will change the layout of the files? Run with -c to see if you were
        right. How does it affect the dirspan?
     7. Which group should FFS place inode of a new directory in? The default
        (simulator) policy looks for the group with the most free inodes. A different
        policy looks for a set of groups with the most free inodes. For example, if
        you run with -A 2, when allocating a new directory, the simulator will look
        at groups in pairs and pick the best pair for the allocation. Run ./ffs.py
        -f in.manyfiles -i 5 -A 2 -c to see how allocation changes with
        this strategy. How does it affect dirspan? Why might this policy be good?
     8. One last policy change we will explore relates to file fragmentation. Run
        ./ffs.py -f in.fragmented -v and see if you can predict how the
        files that remain are allocated. Run with -c to confirm your answer. What
        is interesting about the data layout of file /i? Why is it problematic?
     9. A new policy, which we call contiguous allocation (-C), tries to ensure that
        each file is allocated contiguously. Specifically, with -C n, the file system
        tries to ensure that n contiguous blocks are free within a group before al-
        locating a block. Run ./ffs.py -f in.fragmented -v -C 2 -c to
        see the difference. How does layout change as the parameter passed to -C
        increases? Finally, how does -C affect filespan and dirspan?
```

### Answers printed by the official simulator

For every command the questions list, this is what `ffs.py` prints with `-c` (compute the answer). Try each question first.

<details><summary>Simulator answer: <code>./ffs.py -f in.largefile -L 4 -T -c to -c</code></summary>

```text
num_groups:       10
inodes_per_group: 10
blocks_per_group: 30

free data blocks: 259 (of 300)
free inodes:      98 (of 100)

spread inodes?    False
spread data?      False
contig alloc:     1

     00000000000000000000 1111111111 2222222222
     01234567890123456789 0123456789 0123456789

group inodes    data
    0 /a-------- /aaaa----- ---------- ----------
    1 ---------- aaaa------ ---------- ----------
    2 ---------- aaaa------ ---------- ----------
    3 ---------- aaaa------ ---------- ----------
    4 ---------- aaaa------ ---------- ----------
    5 ---------- aaaa------ ---------- ----------
    6 ---------- aaaa------ ---------- ----------
    7 ---------- aaaa------ ---------- ----------
    8 ---------- aaaa------ ---------- ----------
    9 ---------- aaaa------ ---------- ----------

span: files
  file:         /a  filespan: 372
               avg  filespan: 372.00

span: directories
  dir:           /  dirspan: 373
               avg  dirspan: 373.00
```

</details>

<details><summary>Simulator answer: <code>./ffs.py -f in.manyfiles -i 5 -A 2 -c to -c</code></summary>

```text
num_groups:       10
inodes_per_group: 5
blocks_per_group: 30

free data blocks: 245 (of 300)
free inodes:      22 (of 50)

spread inodes?    False
spread data?      False
contig alloc:     1

          0000000000 1111111111 2222222222
     012340123456789 0123456789 0123456789

group inodedata
    0 /abcd /aabbccdd- ---------- ----------
    1 efghi eeffgghhii ---------- ----------
    2 jlmno jlmno----- ---------- ----------
    3 pqrC- pqrCCC---- ---------- ----------
    4 tuvwx tuuuvvvwww xxx------- ----------
    5 yzAB- yyyzzzAAAB BB-------- ----------
    6 ----- ---------- ---------- ----------
    7 ----- ---------- ---------- ----------
    8 ----- ---------- ---------- ----------
    9 ----- ---------- ---------- ----------
```

</details>

<details><summary>Simulator answer: <code>./ffs.py -f in.fragmented -v and -c</code></summary>

```text
op create /a [size:1] ->success
op create /b [size:1] ->success
op create /c [size:1] ->success
op create /d [size:1] ->success
op create /e [size:1] ->success
op create /f [size:1] ->success
op create /g [size:1] ->success
op create /h [size:1] ->success
op delete /a ->success
op delete /c ->success
op delete /e ->success
op delete /g ->success
op create /i [size:8] ->success

num_groups:       10
inodes_per_group: 10
blocks_per_group: 30

free data blocks: 287 (of 300)
free inodes:      94 (of 100)

spread inodes?    False
spread data?      False
contig alloc:     1

     00000000000000000000 1111111111 2222222222
     01234567890123456789 0123456789 0123456789

group inodes    data
    0 /ib-d-f-h- /ibidifihi iii------- ----------
    1 ---------- ---------- ---------- ----------
    2 ---------- ---------- ---------- ----------
    3 ---------- ---------- ---------- ----------
    4 ---------- ---------- ---------- ----------
    5 ---------- ---------- ---------- ----------
    6 ---------- ---------- ---------- ----------
    7 ---------- ---------- ---------- ----------
    8 ---------- ---------- ---------- ----------
    9 ---------- ---------- ---------- ----------
```

</details>

<details><summary>Simulator answer: <code>./ffs.py -f in.fragmented -v -C 2 -c to -c</code></summary>

```text
op create /a [size:1] ->success
op create /b [size:1] ->success
op create /c [size:1] ->success
op create /d [size:1] ->success
op create /e [size:1] ->success
op create /f [size:1] ->success
op create /g [size:1] ->success
op create /h [size:1] ->success
op delete /a ->success
op delete /c ->success
op delete /e ->success
op delete /g ->success
op create /i [size:8] ->success

num_groups:       10
inodes_per_group: 10
blocks_per_group: 30

free data blocks: 287 (of 300)
free inodes:      94 (of 100)

spread inodes?    False
spread data?      False
contig alloc:     2

     00000000000000000000 1111111111 2222222222
     01234567890123456789 0123456789 0123456789

group inodes    data
    0 /ib-d-f-h- /-b-d-f-hi iiiiiii--- ----------
    1 ---------- ---------- ---------- ----------
    2 ---------- ---------- ---------- ----------
    3 ---------- ---------- ---------- ----------
    4 ---------- ---------- ---------- ----------
    5 ---------- ---------- ---------- ----------
    6 ---------- ---------- ---------- ----------
    7 ---------- ---------- ---------- ----------
    8 ---------- ---------- ---------- ----------
    9 ---------- ---------- ---------- ----------
```

</details>

## The simulator (README from the homework repository)


# Overview

This is the README for `ffs.py`, a simulator of FFS allocation policies. Use it
to study FFS behavior under different file and directory creation scenarios.

The tool is invoked by specifying a command file with the -f flag, which
consists of a series of file create, file delete, and directory create
operations. 

For example, run:

```sh
prompt> ./ffs.py -f in.example1 -c
```

to see the output from the first example in the chapter on how FFS based
allocation works. 

The file `in.example1` consists of the following commands:

```sh
dir /a
dir /b
file /a/c 2
file /a/d 2
file /a/e 2
file /b/f 2
```

This tells the simulator to create two directories (/a and /b) and four files
(/a/c, /a/d, /a/e, and /b/f). The root directory is created by default.

The output of the simulator is the location of the inodes and data blocks of
all extant files and directories. For example, from the run above, we would
end up seeing (with the -c flag on, to show you the results):

```sh
prompt> ./ffs.py -f in.example1 -c

num_groups:       10
inodes_per_group: 10
blocks_per_group: 30

free data blocks: 289 (of 300)
free inodes:      93 (of 100)

spread inodes?    False
spread data?      False
contig alloc:     1

      0000000000 0000000000 1111111111 2222222222
      0123456789 0123456789 0123456789 0123456789

group inodes     data
    0 /--------- /--------- ---------- ----------
    1 acde------ accddee--- ---------- ----------
    2 bf-------- bff------- ---------- ----------
    3 ---------- ---------- ---------- ----------
    4 ---------- ---------- ---------- ----------
    5 ---------- ---------- ---------- ----------
    6 ---------- ---------- ---------- ----------
    7 ---------- ---------- ---------- ----------
    8 ---------- ---------- ---------- ----------
    9 ---------- ---------- ---------- ----------

prompt>
```

This first part of the output shows us various parameters of the simulation,
from the number of FFS cylinder groups that are created, to some policy
details. But the main part of the output is the actual allocation map:

```sh
      0000000000 0000000000 1111111111 2222222222
      0123456789 0123456789 0123456789 0123456789

group inodes     data
    0 /--------- /--------- ---------- ----------
    1 acde------ accddee--- ---------- ----------
    2 bf-------- bff------- ---------- ----------
    3 ---------- ---------- ---------- ----------
    4 ---------- ---------- ---------- ----------
    5 ---------- ---------- ---------- ----------
    6 ---------- ---------- ---------- ----------
    7 ---------- ---------- ---------- ----------
    8 ---------- ---------- ---------- ----------
    9 ---------- ---------- ---------- ----------
```

For this instantiation, we have created a file system with 10 groups, each
with 10 inodes and 30 data blocks. Each group just shows the inodes and data
blocks, and how they are allocated. If they are free, a - is shown; otherwise,
a different symbol is shown per file.

If you want to see a mapping of the symbols to file names, you should use
the -M flag:

```sh
prompt> ./ffs.py -f in.example1 -c -M
```

You'll then see a table at the bottom of the output shows the meanings of each symbol:

```sh
symbol  inode#  filename     filetype
/            0  /            directory
a           10  /a           directory
c           11  /a/c           regular
d           12  /a/d           regular
e           13  /a/e           regular
b           20  /b           directory
f           21  /b/f           regular
```

Here, you can see the root directory is represented by the symbol /, the file
/a by the symbol a, and so forth.

Looking at the output, you can thus see a number of interesting things: 
- The root inode is in the first slot of the Group 0's piece of the inode table
- The root data block is found in the first allocated data block (Group 0)
- Directory /a was placed in Group 1, directory /b in Group 2
- The files (inodes and data) for each regular file are found in 
  the same group as their parent inodes (as per FFS)

The rest of the options let you play around with FFS and some minor
variants. They are:

```sh
prompt> ./ffs.py -h
Usage: ffs.py [options]

Options:
  -h, --help            show this help message and exit
  -s SEED, --seed=SEED  the random seed
  -n NUM_GROUPS, --num_groups=NUM_GROUPS
                        number of block groups
  -d BLOCKS_PER_GROUP, --datablocks_per_groups=BLOCKS_PER_GROUP
                        data blocks per group
  -i INODES_PER_GROUP, --inodes_per_group=INODES_PER_GROUP
                        inodes per group
  -L LARGE_FILE_EXCEPTION, --large_file_exception=LARGE_FILE_EXCEPTION
                        0:off, N>0:blocks in group before spreading file to
                        next group
  -f INPUT_FILE, --input_file=INPUT_FILE
                        command file
  -I, --spread_inodes   Instead of putting file inodes in parent dir group,
                        spread them evenly around all groups
  -D, --spread_data     Instead of putting data near inode,
                        spread them evenly around all groups
  -A ALLOCATE_FARAWAY, --allocate_faraway=ALLOCATE_FARAWAY
                        When picking a group, examine this many groups at a
                        time
  -C CONTIG_ALLOCATION_POLICY,
  --contig_allocation_policy=CONTIG_ALLOCATION_POLICY
                        number of contig free blocks needed to alloc
  -T, --show_spans      show file and directory spans
  -M, --show_symbol_map
                        show symbol map
  -B, --show_block_addresses
                        show block addresses alongside groups
  -S, --do_per_file_stats
                        print out detailed inode stats
  -v, --show_file_ops   print out detailed per-op success/failure
  -c, --compute         compute answers for me
```

We'll explore more of these options in the homework.



