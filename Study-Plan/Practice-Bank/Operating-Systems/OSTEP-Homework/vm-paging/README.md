# OSTEP homework: vm-paging

> Copied from <https://github.com/remzi-arpacidusseau/ostep-homework/tree/master/vm-paging> (by Remzi and Andrea Arpaci-Dusseau). Questions and answers are the source's own; nothing was answered or rewritten here. The simulators in this folder are the answer key: run any command from the questions again with `-c` and the simulator prints the official answer.

## Homework questions from the book chapter

> From the chapter PDF <https://pages.cs.wisc.edu/~remzi/OSTEP/vm-paging.pdf>. Answer each one with the simulator, then add `-c` to see the official answer.

```text
Homework (Simulation)
   In this homework, you will use a simple program, which is known as
paging-linear-translate.py, to see if you understand how simple
virtual-to-physical address translation works with linear page tables. See
the README for details.

Questions
     1. Before doing any translations, let's use the simulator to study how
        linear page tables change size given different parameters. Compute
        the size of linear page tables as different parameters change. Some
        suggested inputs are below; by using the -v flag, you can see how
        many page-table entries are filled. First, to understand how linear
        page table size changes as the address space grows, run with these
        flags:
          • -P 1k -a 1m -p 512m -v -n 0
          • -P 1k -a 2m -p 512m -v -n 0
          • -P 1k -a 4m -p 512m -v -n 0
     2. Then, let's understand how linear page table size changes as page
        size grows. Before running any of these, try to think about the ex-
        pected trends. How should page-table size change as the address
        space grows? As the page size grows? Why not use big pages in
        general?
          • -P 1k -a 1m -p 512m -v -n 0
          • -P 2k -a 1m -p 512m -v -n 0
          • -P 4k -a 1m -p 512m -v -n 0
     3. Now let's do some translations. Start with some small examples,
        and change the number of pages that are allocated to the address
        space with the -u flag. What happens as you increase the percent-
        age of pages that are allocated in each address space?
          • -P 1k -a 16k -p 32k -v -u 0
          • -P 1k -a 16k -p 32k -v -u 25
          • -P 1k -a 16k -p 32k -v -u 50
          • -P 1k -a 16k -p 32k -v -u 75
          • -P 1k -a 16k -p 32k -v -u 100
     4. Now let's try some different random seeds, and some different (and
        sometimes quite crazy) address-space parameters, for variety. Which
        of these parameter combinations are unrealistic? Why?
          • -P 8     -a 32      -p 1024 -v -s 1

PAGING : I NTRODUCTION                                               15

       • -P 8k -a 32k -p 1m    -v -s 2
       • -P 1m -a 256m -p 512m -v -s 3
  5. Use the program to try out some other problems. Can you find the
     limits of where the program doesn't work anymore? For example,
     what happens if the address-space size is bigger than physical mem-
     ory?
```

### Answers printed by the official simulator

For every command the questions list, this is what `paging-linear-translate.py` prints with `-c` (compute the answer). Try each question first.

<details><summary>Simulator answer: <code>./paging-linear-translate.py -P 1k -a 1m -p 512m -v -n 0 -c</code></summary>

```text
ARG seed 0
ARG address space size 1m
ARG phys mem size 512m
ARG page size 1k
ARG verbose True
ARG addresses -1


The format of the page table is simple:
The high-order (left-most) bit is the VALID bit.
  If the bit is 1, the rest of the entry is the PFN.
  If the bit is 0, the page is not valid.
Use verbose mode (-v) if you want to print the VPN # by
each entry of the page table.

Page Table (from entry 0 down to the max size)
  [       0]  0x8006104a
  [       1]  0x00000000
  [       2]  0x00000000
  [       3]  0x80033d4e
  [       4]  0x80026d2f
  [       5]  0x00000000
  [       6]  0x800743d0
  [       7]  0x80024134
  [       8]  0x8004f26b
  [       9]  0x00000000
  [      10]  0x8007dcbe
  [      11]  0x800737a2
  [      12]  0x00000000
  [      13]  0x800730d2
  [      14]  0x8003c6f2
  [      15]  0x00000000
  [      16]  0x00000000
  [      17]  0x80074dd8
  [      18]  0x8003d0ea
  [      19]  0x8002157c
  [      20]  0x800463bc
  [      21]  0x00000000
  [      22]  0x800330ca
  [      23]  0x80055860
  [      24]  0x00000000
  [      25]  0x00000000
  [      26]  0x8001f387
  [      27]  0x00000000
  [      28]  0x8001874e
  [      29]  0x8001e8af
  [      30]  0x80066ce9
  [      31]  0x00000000
  [      32]  0x00000000
  [      33]  0x00000000
  [      34]  0x80077671
  [      35]  0x00000000
  [      36]  0x8005a709
  [      37]  0x80068407
  [      38]  0x8007b5f0
  [      39]  0x8004b370
  [      40]  0x00000000
  [      41]  0x80031447
  [      42]  0x80025298
  [      43]  0x00000000
  [      44]  0x00000000
  [      45]  0x800540d6
  [      46]  0x00000000
  [      47]  0x00000000
  [      48]  0x800703a0
  [      49]  0x8006bd5b
  [      50]  0x80076279
  [      51]  0x8003215f
  [      52]  0x8002347f
  [      53]  0x8006cbbf
  [      54]  0x8004b7e9
  [      55]  0x8004a337
  [      56]  0x00000000
  [      57]  0x8007f856
  [      58]  0x800658ba
  [      59]  0x00000000
  [      60]  0x8003e43c
  [      61]  0x8006c2b8
  [      62]  0x00000000
  [      63]  0x8000efe4
  [      64]  0x00000000
  [      65]  0x8002a908
  [      66]  0x8000ce0b
  [      67]  0x00000000
  [      68]  0x80005ca3
  [      69]  0x800747b6
  [      70]  0x800571d8
  [      71]  0x00000000
  [      72]  0x8004d9c7
  [      73]  0x80032132
  [      74]  0x00000000
  [      75]  0x80004a87
  [      76]  0x00000000
  [      77]  0x80017ad2
  [      78]  0x00000000
  [      79]  0x00000000
  [      80]  0x80077ee9
  [      81]  0x00000000
  [      82]  0x00000000
  [      83]  0x00000000
  [      84]  0x00000000
  [      85]  0x00000000
  [      86]  0x8002cd66
  [      87]  0x00000000
  [      88]  0x800050a5
  [      89]  0x00000000
  [      90]  0x80019847
  [      91]  0x00000000
  [      92]  0x8006b4e4
  [      93]  0x80015afb
  [      94]  0x8007bb7d
  [      95]  0x00000000
  [      96]  0x8006c36d
  [      97]  0x00000000
  [      98]  0x00000000
  [      99]  0x800389db
  [     100]  0x00000000
  [     101]  0x00000000
  [     102]  0x00000000
  [     103]  0x8004119c
  [     104]  0x00000000
  [     105]  0x00000000
  [     106]  0x800201e8
  [     107]  0x80001978
  [     108]  0x8002aff5
  [     109]  0x00000000
  [     110]  0x00000000
  [     111]  0x00000000
  [     112]  0x8002d15b
  [     113]  0x00000000
  [     114]  0x00000000
  [     115]  0x800511ea
  [     116]  0x8005b996
  [     117]  0x00000000
  [     118]  0x00000000
  [     119]  0x8000031f
  [     120]  0x00000000
  [     121]  0x00000000
  [     122]  0x00000000
  [     123]  0x80030778
  [     124]  0x80048b92
  [     125]  0x00000000
  [     126]  0x00000000
  [     127]  0x80035887
  [     128]  0x80005fce
  [     129]  0x00000000
  [     130]  0x00000000
  [     131]  0x00000000
  [     132]  0x8003e5eb
  [     133]  0x80060b3b
  [     134]  0x8003f4e7
  [     135]  0x00000000
  [     136]  0x00000000
  [     137]  0x80070008
  [     138]  0x80018106
  [     139]  0x80051090
  [     140]  0x00000000
  [     141]  0x8007e502
  [     142]  0x00000000
  [     143]  0x80028787
  [     144]  0x00000000
  [     145]  0x800004d4
  [     146]  0x80043a0d
  [     147]  0x00000000
  [     148]  0x00000000
  [     149]  0x8006fd3e
  [     150]  0x00000000
  [     151]  0x8000cd2b
  [     152]  0x80032c6f
  [     153]  0x00000000
  [     154]  0x00000000
  [     155]  0x00000000
  [     156]  0x8006e410
  [     157]  0x00000000
  [     158]  0x800534cd
  [     159]  0x00000000
  [     160]  0x80023a2e
  [     161]  0x00000000
  [     162]  0x00000000
  [     163]  0x80047783
  [     164]  0x800781ec
  [     165]  0x80005606
  [     166]  0x80059c50
  [     167]  0x8005b2e8
  [     168]  0x80051f02
  [     169]  0x00000000
  [     170]  0x8001a9aa
  [     171]  0x80001238
  [     172]  0x00000000
  [     173]  0x00000000
  [     174]  0x8005bf7c
  [     175]  0x00000000
  [     176]  0x80005462
  [     177]  0x00000000
  [     178]  0x800250f5
  [     179]  0x00000000
  [     180]  0x800258e5
  [     181]  0x00000000
  [     182]  0x00000000
  [     183]  0x00000000
  [     184]  0x00000000
  [     185]  0x80009120
  [     186]  0x00000000
  [     187]  0x00000000
  [     188]  0x00000000
  [     189]  0x00000000
  [     190]  0x8003cac2
  [     191]  0x8007cf51
  [     192]  0x00000000
  [     193]  0x00000000
  [     194]  0x8003698b
  [     195]  0x00000000
  [     196]  0x800727bb
  [     197]  0x80050391
  [     198]  0x00000000
  [     199]  0x80051c6c
  [     200]  0x00000000
  [     201]  0x00000000
  [     202]  0x80007d3f
  [     203]  0x00000000
  [     204]  0x00000000
  [     205]  0x8003969e
  [     206]  0x00000000
  [     207]  0x80056f36
  [     208]  0x00000000
  [     209]  0x00000000
  [     210]  0x8002165b
  [     211]  0x80037324
  [     212]  0x00000000
  [     213]  0x00000000
  [     214]  0x80059db4
  [     215]  0x80039ce6
  [     216]  0x8000f387
  [     217]  0x00000000
  [     218]  0x00000000
  [     219]  0x00000000
  [     220]  0x8001ba26
  [     221]  0x00000000
  [     222]  0x000
... (output cut; run it yourself for the rest)
```

</details>

<details><summary>Simulator answer: <code>./paging-linear-translate.py -P 1k -a 2m -p 512m -v -n 0 -c</code></summary>

```text
ARG seed 0
ARG address space size 2m
ARG phys mem size 512m
ARG page size 1k
ARG verbose True
ARG addresses -1


The format of the page table is simple:
The high-order (left-most) bit is the VALID bit.
  If the bit is 1, the rest of the entry is the PFN.
  If the bit is 0, the page is not valid.
Use verbose mode (-v) if you want to print the VPN # by
each entry of the page table.

Page Table (from entry 0 down to the max size)
  [       0]  0x8006104a
  [       1]  0x00000000
  [       2]  0x00000000
  [       3]  0x80033d4e
  [       4]  0x80026d2f
  [       5]  0x00000000
  [       6]  0x800743d0
  [       7]  0x80024134
  [       8]  0x8004f26b
  [       9]  0x00000000
  [      10]  0x8007dcbe
  [      11]  0x800737a2
  [      12]  0x00000000
  [      13]  0x800730d2
  [      14]  0x8003c6f2
  [      15]  0x00000000
  [      16]  0x00000000
  [      17]  0x80074dd8
  [      18]  0x8003d0ea
  [      19]  0x8002157c
  [      20]  0x800463bc
  [      21]  0x00000000
  [      22]  0x800330ca
  [      23]  0x80055860
  [      24]  0x00000000
  [      25]  0x00000000
  [      26]  0x8001f387
  [      27]  0x00000000
  [      28]  0x8001874e
  [      29]  0x8001e8af
  [      30]  0x80066ce9
  [      31]  0x00000000
  [      32]  0x00000000
  [      33]  0x00000000
  [      34]  0x80077671
  [      35]  0x00000000
  [      36]  0x8005a709
  [      37]  0x80068407
  [      38]  0x8007b5f0
  [      39]  0x8004b370
  [      40]  0x00000000
  [      41]  0x80031447
  [      42]  0x80025298
  [      43]  0x00000000
  [      44]  0x00000000
  [      45]  0x800540d6
  [      46]  0x00000000
  [      47]  0x00000000
  [      48]  0x800703a0
  [      49]  0x8006bd5b
  [      50]  0x80076279
  [      51]  0x8003215f
  [      52]  0x8002347f
  [      53]  0x8006cbbf
  [      54]  0x8004b7e9
  [      55]  0x8004a337
  [      56]  0x00000000
  [      57]  0x8007f856
  [      58]  0x800658ba
  [      59]  0x00000000
  [      60]  0x8003e43c
  [      61]  0x8006c2b8
  [      62]  0x00000000
  [      63]  0x8000efe4
  [      64]  0x00000000
  [      65]  0x8002a908
  [      66]  0x8000ce0b
  [      67]  0x00000000
  [      68]  0x80005ca3
  [      69]  0x800747b6
  [      70]  0x800571d8
  [      71]  0x00000000
  [      72]  0x8004d9c7
  [      73]  0x80032132
  [      74]  0x00000000
  [      75]  0x80004a87
  [      76]  0x00000000
  [      77]  0x80017ad2
  [      78]  0x00000000
  [      79]  0x00000000
  [      80]  0x80077ee9
  [      81]  0x00000000
  [      82]  0x00000000
  [      83]  0x00000000
  [      84]  0x00000000
  [      85]  0x00000000
  [      86]  0x8002cd66
  [      87]  0x00000000
  [      88]  0x800050a5
  [      89]  0x00000000
  [      90]  0x80019847
  [      91]  0x00000000
  [      92]  0x8006b4e4
  [      93]  0x80015afb
  [      94]  0x8007bb7d
  [      95]  0x00000000
  [      96]  0x8006c36d
  [      97]  0x00000000
  [      98]  0x00000000
  [      99]  0x800389db
  [     100]  0x00000000
  [     101]  0x00000000
  [     102]  0x00000000
  [     103]  0x8004119c
  [     104]  0x00000000
  [     105]  0x00000000
  [     106]  0x800201e8
  [     107]  0x80001978
  [     108]  0x8002aff5
  [     109]  0x00000000
  [     110]  0x00000000
  [     111]  0x00000000
  [     112]  0x8002d15b
  [     113]  0x00000000
  [     114]  0x00000000
  [     115]  0x800511ea
  [     116]  0x8005b996
  [     117]  0x00000000
  [     118]  0x00000000
  [     119]  0x8000031f
  [     120]  0x00000000
  [     121]  0x00000000
  [     122]  0x00000000
  [     123]  0x80030778
  [     124]  0x80048b92
  [     125]  0x00000000
  [     126]  0x00000000
  [     127]  0x80035887
  [     128]  0x80005fce
  [     129]  0x00000000
  [     130]  0x00000000
  [     131]  0x00000000
  [     132]  0x8003e5eb
  [     133]  0x80060b3b
  [     134]  0x8003f4e7
  [     135]  0x00000000
  [     136]  0x00000000
  [     137]  0x80070008
  [     138]  0x80018106
  [     139]  0x80051090
  [     140]  0x00000000
  [     141]  0x8007e502
  [     142]  0x00000000
  [     143]  0x80028787
  [     144]  0x00000000
  [     145]  0x800004d4
  [     146]  0x80043a0d
  [     147]  0x00000000
  [     148]  0x00000000
  [     149]  0x8006fd3e
  [     150]  0x00000000
  [     151]  0x8000cd2b
  [     152]  0x80032c6f
  [     153]  0x00000000
  [     154]  0x00000000
  [     155]  0x00000000
  [     156]  0x8006e410
  [     157]  0x00000000
  [     158]  0x800534cd
  [     159]  0x00000000
  [     160]  0x80023a2e
  [     161]  0x00000000
  [     162]  0x00000000
  [     163]  0x80047783
  [     164]  0x800781ec
  [     165]  0x80005606
  [     166]  0x80059c50
  [     167]  0x8005b2e8
  [     168]  0x80051f02
  [     169]  0x00000000
  [     170]  0x8001a9aa
  [     171]  0x80001238
  [     172]  0x00000000
  [     173]  0x00000000
  [     174]  0x8005bf7c
  [     175]  0x00000000
  [     176]  0x80005462
  [     177]  0x00000000
  [     178]  0x800250f5
  [     179]  0x00000000
  [     180]  0x800258e5
  [     181]  0x00000000
  [     182]  0x00000000
  [     183]  0x00000000
  [     184]  0x00000000
  [     185]  0x80009120
  [     186]  0x00000000
  [     187]  0x00000000
  [     188]  0x00000000
  [     189]  0x00000000
  [     190]  0x8003cac2
  [     191]  0x8007cf51
  [     192]  0x00000000
  [     193]  0x00000000
  [     194]  0x8003698b
  [     195]  0x00000000
  [     196]  0x800727bb
  [     197]  0x80050391
  [     198]  0x00000000
  [     199]  0x80051c6c
  [     200]  0x00000000
  [     201]  0x00000000
  [     202]  0x80007d3f
  [     203]  0x00000000
  [     204]  0x00000000
  [     205]  0x8003969e
  [     206]  0x00000000
  [     207]  0x80056f36
  [     208]  0x00000000
  [     209]  0x00000000
  [     210]  0x8002165b
  [     211]  0x80037324
  [     212]  0x00000000
  [     213]  0x00000000
  [     214]  0x80059db4
  [     215]  0x80039ce6
  [     216]  0x8000f387
  [     217]  0x00000000
  [     218]  0x00000000
  [     219]  0x00000000
  [     220]  0x8001ba26
  [     221]  0x00000000
  [     222]  0x000
... (output cut; run it yourself for the rest)
```

</details>

<details><summary>Simulator answer: <code>./paging-linear-translate.py -P 1k -a 4m -p 512m -v -n 0 -c</code></summary>

```text
ARG seed 0
ARG address space size 4m
ARG phys mem size 512m
ARG page size 1k
ARG verbose True
ARG addresses -1


The format of the page table is simple:
The high-order (left-most) bit is the VALID bit.
  If the bit is 1, the rest of the entry is the PFN.
  If the bit is 0, the page is not valid.
Use verbose mode (-v) if you want to print the VPN # by
each entry of the page table.

Page Table (from entry 0 down to the max size)
  [       0]  0x8006104a
  [       1]  0x00000000
  [       2]  0x00000000
  [       3]  0x80033d4e
  [       4]  0x80026d2f
  [       5]  0x00000000
  [       6]  0x800743d0
  [       7]  0x80024134
  [       8]  0x8004f26b
  [       9]  0x00000000
  [      10]  0x8007dcbe
  [      11]  0x800737a2
  [      12]  0x00000000
  [      13]  0x800730d2
  [      14]  0x8003c6f2
  [      15]  0x00000000
  [      16]  0x00000000
  [      17]  0x80074dd8
  [      18]  0x8003d0ea
  [      19]  0x8002157c
  [      20]  0x800463bc
  [      21]  0x00000000
  [      22]  0x800330ca
  [      23]  0x80055860
  [      24]  0x00000000
  [      25]  0x00000000
  [      26]  0x8001f387
  [      27]  0x00000000
  [      28]  0x8001874e
  [      29]  0x8001e8af
  [      30]  0x80066ce9
  [      31]  0x00000000
  [      32]  0x00000000
  [      33]  0x00000000
  [      34]  0x80077671
  [      35]  0x00000000
  [      36]  0x8005a709
  [      37]  0x80068407
  [      38]  0x8007b5f0
  [      39]  0x8004b370
  [      40]  0x00000000
  [      41]  0x80031447
  [      42]  0x80025298
  [      43]  0x00000000
  [      44]  0x00000000
  [      45]  0x800540d6
  [      46]  0x00000000
  [      47]  0x00000000
  [      48]  0x800703a0
  [      49]  0x8006bd5b
  [      50]  0x80076279
  [      51]  0x8003215f
  [      52]  0x8002347f
  [      53]  0x8006cbbf
  [      54]  0x8004b7e9
  [      55]  0x8004a337
  [      56]  0x00000000
  [      57]  0x8007f856
  [      58]  0x800658ba
  [      59]  0x00000000
  [      60]  0x8003e43c
  [      61]  0x8006c2b8
  [      62]  0x00000000
  [      63]  0x8000efe4
  [      64]  0x00000000
  [      65]  0x8002a908
  [      66]  0x8000ce0b
  [      67]  0x00000000
  [      68]  0x80005ca3
  [      69]  0x800747b6
  [      70]  0x800571d8
  [      71]  0x00000000
  [      72]  0x8004d9c7
  [      73]  0x80032132
  [      74]  0x00000000
  [      75]  0x80004a87
  [      76]  0x00000000
  [      77]  0x80017ad2
  [      78]  0x00000000
  [      79]  0x00000000
  [      80]  0x80077ee9
  [      81]  0x00000000
  [      82]  0x00000000
  [      83]  0x00000000
  [      84]  0x00000000
  [      85]  0x00000000
  [      86]  0x8002cd66
  [      87]  0x00000000
  [      88]  0x800050a5
  [      89]  0x00000000
  [      90]  0x80019847
  [      91]  0x00000000
  [      92]  0x8006b4e4
  [      93]  0x80015afb
  [      94]  0x8007bb7d
  [      95]  0x00000000
  [      96]  0x8006c36d
  [      97]  0x00000000
  [      98]  0x00000000
  [      99]  0x800389db
  [     100]  0x00000000
  [     101]  0x00000000
  [     102]  0x00000000
  [     103]  0x8004119c
  [     104]  0x00000000
  [     105]  0x00000000
  [     106]  0x800201e8
  [     107]  0x80001978
  [     108]  0x8002aff5
  [     109]  0x00000000
  [     110]  0x00000000
  [     111]  0x00000000
  [     112]  0x8002d15b
  [     113]  0x00000000
  [     114]  0x00000000
  [     115]  0x800511ea
  [     116]  0x8005b996
  [     117]  0x00000000
  [     118]  0x00000000
  [     119]  0x8000031f
  [     120]  0x00000000
  [     121]  0x00000000
  [     122]  0x00000000
  [     123]  0x80030778
  [     124]  0x80048b92
  [     125]  0x00000000
  [     126]  0x00000000
  [     127]  0x80035887
  [     128]  0x80005fce
  [     129]  0x00000000
  [     130]  0x00000000
  [     131]  0x00000000
  [     132]  0x8003e5eb
  [     133]  0x80060b3b
  [     134]  0x8003f4e7
  [     135]  0x00000000
  [     136]  0x00000000
  [     137]  0x80070008
  [     138]  0x80018106
  [     139]  0x80051090
  [     140]  0x00000000
  [     141]  0x8007e502
  [     142]  0x00000000
  [     143]  0x80028787
  [     144]  0x00000000
  [     145]  0x800004d4
  [     146]  0x80043a0d
  [     147]  0x00000000
  [     148]  0x00000000
  [     149]  0x8006fd3e
  [     150]  0x00000000
  [     151]  0x8000cd2b
  [     152]  0x80032c6f
  [     153]  0x00000000
  [     154]  0x00000000
  [     155]  0x00000000
  [     156]  0x8006e410
  [     157]  0x00000000
  [     158]  0x800534cd
  [     159]  0x00000000
  [     160]  0x80023a2e
  [     161]  0x00000000
  [     162]  0x00000000
  [     163]  0x80047783
  [     164]  0x800781ec
  [     165]  0x80005606
  [     166]  0x80059c50
  [     167]  0x8005b2e8
  [     168]  0x80051f02
  [     169]  0x00000000
  [     170]  0x8001a9aa
  [     171]  0x80001238
  [     172]  0x00000000
  [     173]  0x00000000
  [     174]  0x8005bf7c
  [     175]  0x00000000
  [     176]  0x80005462
  [     177]  0x00000000
  [     178]  0x800250f5
  [     179]  0x00000000
  [     180]  0x800258e5
  [     181]  0x00000000
  [     182]  0x00000000
  [     183]  0x00000000
  [     184]  0x00000000
  [     185]  0x80009120
  [     186]  0x00000000
  [     187]  0x00000000
  [     188]  0x00000000
  [     189]  0x00000000
  [     190]  0x8003cac2
  [     191]  0x8007cf51
  [     192]  0x00000000
  [     193]  0x00000000
  [     194]  0x8003698b
  [     195]  0x00000000
  [     196]  0x800727bb
  [     197]  0x80050391
  [     198]  0x00000000
  [     199]  0x80051c6c
  [     200]  0x00000000
  [     201]  0x00000000
  [     202]  0x80007d3f
  [     203]  0x00000000
  [     204]  0x00000000
  [     205]  0x8003969e
  [     206]  0x00000000
  [     207]  0x80056f36
  [     208]  0x00000000
  [     209]  0x00000000
  [     210]  0x8002165b
  [     211]  0x80037324
  [     212]  0x00000000
  [     213]  0x00000000
  [     214]  0x80059db4
  [     215]  0x80039ce6
  [     216]  0x8000f387
  [     217]  0x00000000
  [     218]  0x00000000
  [     219]  0x00000000
  [     220]  0x8001ba26
  [     221]  0x00000000
  [     222]  0x000
... (output cut; run it yourself for the rest)
```

</details>

<details><summary>Simulator answer: <code>./paging-linear-translate.py -P 2k -a 1m -p 512m -v -n 0 -c</code></summary>

```text
ARG seed 0
ARG address space size 1m
ARG phys mem size 512m
ARG page size 2k
ARG verbose True
ARG addresses -1


The format of the page table is simple:
The high-order (left-most) bit is the VALID bit.
  If the bit is 1, the rest of the entry is the PFN.
  If the bit is 0, the page is not valid.
Use verbose mode (-v) if you want to print the VPN # by
each entry of the page table.

Page Table (from entry 0 down to the max size)
  [       0]  0x80030825
  [       1]  0x00000000
  [       2]  0x00000000
  [       3]  0x80019ea7
  [       4]  0x80013697
  [       5]  0x00000000
  [       6]  0x8003a1e8
  [       7]  0x8001209a
  [       8]  0x80027935
  [       9]  0x00000000
  [      10]  0x8003ee5f
  [      11]  0x80039bd1
  [      12]  0x00000000
  [      13]  0x80039869
  [      14]  0x8001e379
  [      15]  0x00000000
  [      16]  0x00000000
  [      17]  0x8003a6ec
  [      18]  0x8001e875
  [      19]  0x80010abe
  [      20]  0x800231de
  [      21]  0x00000000
  [      22]  0x80019865
  [      23]  0x8002ac30
  [      24]  0x00000000
  [      25]  0x00000000
  [      26]  0x8000f9c3
  [      27]  0x00000000
  [      28]  0x8000c3a7
  [      29]  0x8000f457
  [      30]  0x80033674
  [      31]  0x00000000
  [      32]  0x00000000
  [      33]  0x00000000
  [      34]  0x8003bb38
  [      35]  0x00000000
  [      36]  0x8002d384
  [      37]  0x80034203
  [      38]  0x8003daf8
  [      39]  0x800259b8
  [      40]  0x00000000
  [      41]  0x80018a23
  [      42]  0x8001294c
  [      43]  0x00000000
  [      44]  0x00000000
  [      45]  0x8002a06b
  [      46]  0x00000000
  [      47]  0x00000000
  [      48]  0x800381d0
  [      49]  0x80035ead
  [      50]  0x8003b13c
  [      51]  0x800190af
  [      52]  0x80011a3f
  [      53]  0x800365df
  [      54]  0x80025bf4
  [      55]  0x8002519b
  [      56]  0x00000000
  [      57]  0x8003fc2b
  [      58]  0x80032c5d
  [      59]  0x00000000
  [      60]  0x8001f21e
  [      61]  0x8003615c
  [      62]  0x00000000
  [      63]  0x800077f2
  [      64]  0x00000000
  [      65]  0x80015484
  [      66]  0x80006705
  [      67]  0x00000000
  [      68]  0x80002e51
  [      69]  0x8003a3db
  [      70]  0x8002b8ec
  [      71]  0x00000000
  [      72]  0x80026ce3
  [      73]  0x80019099
  [      74]  0x00000000
  [      75]  0x80002543
  [      76]  0x00000000
  [      77]  0x8000bd69
  [      78]  0x00000000
  [      79]  0x00000000
  [      80]  0x8003bf74
  [      81]  0x00000000
  [      82]  0x00000000
  [      83]  0x00000000
  [      84]  0x00000000
  [      85]  0x00000000
  [      86]  0x800166b3
  [      87]  0x00000000
  [      88]  0x80002852
  [      89]  0x00000000
  [      90]  0x8000cc23
  [      91]  0x00000000
  [      92]  0x80035a72
  [      93]  0x8000ad7d
  [      94]  0x8003ddbe
  [      95]  0x00000000
  [      96]  0x800361b6
  [      97]  0x00000000
  [      98]  0x00000000
  [      99]  0x8001c4ed
  [     100]  0x00000000
  [     101]  0x00000000
  [     102]  0x00000000
  [     103]  0x800208ce
  [     104]  0x00000000
  [     105]  0x00000000
  [     106]  0x800100f4
  [     107]  0x80000cbc
  [     108]  0x800157fa
  [     109]  0x00000000
  [     110]  0x00000000
  [     111]  0x00000000
  [     112]  0x800168ad
  [     113]  0x00000000
  [     114]  0x00000000
  [     115]  0x800288f5
  [     116]  0x8002dccb
  [     117]  0x00000000
  [     118]  0x00000000
  [     119]  0x8000018f
  [     120]  0x00000000
  [     121]  0x00000000
  [     122]  0x00000000
  [     123]  0x800183bc
  [     124]  0x800245c9
  [     125]  0x00000000
  [     126]  0x00000000
  [     127]  0x8001ac43
  [     128]  0x80002fe7
  [     129]  0x00000000
  [     130]  0x00000000
  [     131]  0x00000000
  [     132]  0x8001f2f5
  [     133]  0x8003059d
  [     134]  0x8001fa73
  [     135]  0x00000000
  [     136]  0x00000000
  [     137]  0x80038004
  [     138]  0x8000c083
  [     139]  0x80028848
  [     140]  0x00000000
  [     141]  0x8003f281
  [     142]  0x00000000
  [     143]  0x800143c3
  [     144]  0x00000000
  [     145]  0x8000026a
  [     146]  0x80021d06
  [     147]  0x00000000
  [     148]  0x00000000
  [     149]  0x80037e9f
  [     150]  0x00000000
  [     151]  0x80006695
  [     152]  0x80019637
  [     153]  0x00000000
  [     154]  0x00000000
  [     155]  0x00000000
  [     156]  0x80037208
  [     157]  0x00000000
  [     158]  0x80029a66
  [     159]  0x00000000
  [     160]  0x80011d17
  [     161]  0x00000000
  [     162]  0x00000000
  [     163]  0x80023bc1
  [     164]  0x8003c0f6
  [     165]  0x80002b03
  [     166]  0x8002ce28
  [     167]  0x8002d974
  [     168]  0x80028f81
  [     169]  0x00000000
  [     170]  0x8000d4d5
  [     171]  0x8000091c
  [     172]  0x00000000
  [     173]  0x00000000
  [     174]  0x8002dfbe
  [     175]  0x00000000
  [     176]  0x80002a31
  [     177]  0x00000000
  [     178]  0x8001287a
  [     179]  0x00000000
  [     180]  0x80012c72
  [     181]  0x00000000
  [     182]  0x00000000
  [     183]  0x00000000
  [     184]  0x00000000
  [     185]  0x80004890
  [     186]  0x00000000
  [     187]  0x00000000
  [     188]  0x00000000
  [     189]  0x00000000
  [     190]  0x8001e561
  [     191]  0x8003e7a8
  [     192]  0x00000000
  [     193]  0x00000000
  [     194]  0x8001b4c5
  [     195]  0x00000000
  [     196]  0x800393dd
  [     197]  0x800281c8
  [     198]  0x00000000
  [     199]  0x80028e36
  [     200]  0x00000000
  [     201]  0x00000000
  [     202]  0x80003e9f
  [     203]  0x00000000
  [     204]  0x00000000
  [     205]  0x8001cb4f
  [     206]  0x00000000
  [     207]  0x8002b79b
  [     208]  0x00000000
  [     209]  0x00000000
  [     210]  0x80010b2d
  [     211]  0x8001b992
  [     212]  0x00000000
  [     213]  0x00000000
  [     214]  0x8002ceda
  [     215]  0x8001ce73
  [     216]  0x800079c3
  [     217]  0x00000000
  [     218]  0x00000000
  [     219]  0x00000000
  [     220]  0x8000dd13
  [     221]  0x00000000
  [     222]  0x000
... (output cut; run it yourself for the rest)
```

</details>

<details><summary>Simulator answer: <code>./paging-linear-translate.py -P 4k -a 1m -p 512m -v -n 0 -c</code></summary>

```text
ARG seed 0
ARG address space size 1m
ARG phys mem size 512m
ARG page size 4k
ARG verbose True
ARG addresses -1


The format of the page table is simple:
The high-order (left-most) bit is the VALID bit.
  If the bit is 1, the rest of the entry is the PFN.
  If the bit is 0, the page is not valid.
Use verbose mode (-v) if you want to print the VPN # by
each entry of the page table.

Page Table (from entry 0 down to the max size)
  [       0]  0x80018412
  [       1]  0x00000000
  [       2]  0x00000000
  [       3]  0x8000cf53
  [       4]  0x80009b4b
  [       5]  0x00000000
  [       6]  0x8001d0f4
  [       7]  0x8000904d
  [       8]  0x80013c9a
  [       9]  0x00000000
  [      10]  0x8001f72f
  [      11]  0x8001cde8
  [      12]  0x00000000
  [      13]  0x8001cc34
  [      14]  0x8000f1bc
  [      15]  0x00000000
  [      16]  0x00000000
  [      17]  0x8001d376
  [      18]  0x8000f43a
  [      19]  0x8000855f
  [      20]  0x800118ef
  [      21]  0x00000000
  [      22]  0x8000cc32
  [      23]  0x80015618
  [      24]  0x00000000
  [      25]  0x00000000
  [      26]  0x80007ce1
  [      27]  0x00000000
  [      28]  0x800061d3
  [      29]  0x80007a2b
  [      30]  0x80019b3a
  [      31]  0x00000000
  [      32]  0x00000000
  [      33]  0x00000000
  [      34]  0x8001dd9c
  [      35]  0x00000000
  [      36]  0x800169c2
  [      37]  0x8001a101
  [      38]  0x8001ed7c
  [      39]  0x80012cdc
  [      40]  0x00000000
  [      41]  0x8000c511
  [      42]  0x800094a6
  [      43]  0x00000000
  [      44]  0x00000000
  [      45]  0x80015035
  [      46]  0x00000000
  [      47]  0x00000000
  [      48]  0x8001c0e8
  [      49]  0x8001af56
  [      50]  0x8001d89e
  [      51]  0x8000c857
  [      52]  0x80008d1f
  [      53]  0x8001b2ef
  [      54]  0x80012dfa
  [      55]  0x800128cd
  [      56]  0x00000000
  [      57]  0x8001fe15
  [      58]  0x8001962e
  [      59]  0x00000000
  [      60]  0x8000f90f
  [      61]  0x8001b0ae
  [      62]  0x00000000
  [      63]  0x80003bf9
  [      64]  0x00000000
  [      65]  0x8000aa42
  [      66]  0x80003382
  [      67]  0x00000000
  [      68]  0x80001728
  [      69]  0x8001d1ed
  [      70]  0x80015c76
  [      71]  0x00000000
  [      72]  0x80013671
  [      73]  0x8000c84c
  [      74]  0x00000000
  [      75]  0x800012a1
  [      76]  0x00000000
  [      77]  0x80005eb4
  [      78]  0x00000000
  [      79]  0x00000000
  [      80]  0x8001dfba
  [      81]  0x00000000
  [      82]  0x00000000
  [      83]  0x00000000
  [      84]  0x00000000
  [      85]  0x00000000
  [      86]  0x8000b359
  [      87]  0x00000000
  [      88]  0x80001429
  [      89]  0x00000000
  [      90]  0x80006611
  [      91]  0x00000000
  [      92]  0x8001ad39
  [      93]  0x800056be
  [      94]  0x8001eedf
  [      95]  0x00000000
  [      96]  0x8001b0db
  [      97]  0x00000000
  [      98]  0x00000000
  [      99]  0x8000e276
  [     100]  0x00000000
  [     101]  0x00000000
  [     102]  0x00000000
  [     103]  0x80010467
  [     104]  0x00000000
  [     105]  0x00000000
  [     106]  0x8000807a
  [     107]  0x8000065e
  [     108]  0x8000abfd
  [     109]  0x00000000
  [     110]  0x00000000
  [     111]  0x00000000
  [     112]  0x8000b456
  [     113]  0x00000000
  [     114]  0x00000000
  [     115]  0x8001447a
  [     116]  0x80016e65
  [     117]  0x00000000
  [     118]  0x00000000
  [     119]  0x800000c7
  [     120]  0x00000000
  [     121]  0x00000000
  [     122]  0x00000000
  [     123]  0x8000c1de
  [     124]  0x800122e4
  [     125]  0x00000000
  [     126]  0x00000000
  [     127]  0x8000d621
  [     128]  0x800017f3
  [     129]  0x00000000
  [     130]  0x00000000
  [     131]  0x00000000
  [     132]  0x8000f97a
  [     133]  0x800182ce
  [     134]  0x8000fd39
  [     135]  0x00000000
  [     136]  0x00000000
  [     137]  0x8001c002
  [     138]  0x80006041
  [     139]  0x80014424
  [     140]  0x00000000
  [     141]  0x8001f940
  [     142]  0x00000000
  [     143]  0x8000a1e1
  [     144]  0x00000000
  [     145]  0x80000135
  [     146]  0x80010e83
  [     147]  0x00000000
  [     148]  0x00000000
  [     149]  0x8001bf4f
  [     150]  0x00000000
  [     151]  0x8000334a
  [     152]  0x8000cb1b
  [     153]  0x00000000
  [     154]  0x00000000
  [     155]  0x00000000
  [     156]  0x8001b904
  [     157]  0x00000000
  [     158]  0x80014d33
  [     159]  0x00000000
  [     160]  0x80008e8b
  [     161]  0x00000000
  [     162]  0x00000000
  [     163]  0x80011de0
  [     164]  0x8001e07b
  [     165]  0x80001581
  [     166]  0x80016714
  [     167]  0x80016cba
  [     168]  0x800147c0
  [     169]  0x00000000
  [     170]  0x80006a6a
  [     171]  0x8000048e
  [     172]  0x00000000
  [     173]  0x00000000
  [     174]  0x80016fdf
  [     175]  0x00000000
  [     176]  0x80001518
  [     177]  0x00000000
  [     178]  0x8000943d
  [     179]  0x00000000
  [     180]  0x80009639
  [     181]  0x00000000
  [     182]  0x00000000
  [     183]  0x00000000
  [     184]  0x00000000
  [     185]  0x80002448
  [     186]  0x00000000
  [     187]  0x00000000
  [     188]  0x00000000
  [     189]  0x00000000
  [     190]  0x8000f2b0
  [     191]  0x8001f3d4
  [     192]  0x00000000
  [     193]  0x00000000
  [     194]  0x8000da62
  [     195]  0x00000000
  [     196]  0x8001c9ee
  [     197]  0x800140e4
  [     198]  0x00000000
  [     199]  0x8001471b
  [     200]  0x00000000
  [     201]  0x00000000
  [     202]  0x80001f4f
  [     203]  0x00000000
  [     204]  0x00000000
  [     205]  0x8000e5a7
  [     206]  0x00000000
  [     207]  0x80015bcd
  [     208]  0x00000000
  [     209]  0x00000000
  [     210]  0x80008596
  [     211]  0x8000dcc9
  [     212]  0x00000000
  [     213]  0x00000000
  [     214]  0x8001676d
  [     215]  0x8000e739
  [     216]  0x80003ce1
  [     217]  0x00000000
  [     218]  0x00000000
  [     219]  0x00000000
  [     220]  0x80006e89
  [     221]  0x00000000
  [     222]  0x000
... (output cut; run it yourself for the rest)
```

</details>

<details><summary>Simulator answer: <code>./paging-linear-translate.py -P 1k -a 16k -p 32k -v -u 0 -c</code></summary>

```text
ARG seed 0
ARG address space size 16k
ARG phys mem size 32k
ARG page size 1k
ARG verbose True
ARG addresses -1


The format of the page table is simple:
The high-order (left-most) bit is the VALID bit.
  If the bit is 1, the rest of the entry is the PFN.
  If the bit is 0, the page is not valid.
Use verbose mode (-v) if you want to print the VPN # by
each entry of the page table.

Page Table (from entry 0 down to the max size)
  [       0]  0x00000000
  [       1]  0x00000000
  [       2]  0x00000000
  [       3]  0x00000000
  [       4]  0x00000000
  [       5]  0x00000000
  [       6]  0x00000000
  [       7]  0x00000000
  [       8]  0x00000000
  [       9]  0x00000000
  [      10]  0x00000000
  [      11]  0x00000000
  [      12]  0x00000000
  [      13]  0x00000000
  [      14]  0x00000000
  [      15]  0x00000000

Virtual Address Trace
  VA 0x00003a39 (decimal:    14905) -->  Invalid (VPN 14 not valid)
  VA 0x00003ee5 (decimal:    16101) -->  Invalid (VPN 15 not valid)
  VA 0x000033da (decimal:    13274) -->  Invalid (VPN 12 not valid)
  VA 0x000039bd (decimal:    14781) -->  Invalid (VPN 14 not valid)
  VA 0x000013d9 (decimal:     5081) -->  Invalid (VPN 4 not valid)
```

</details>

<details><summary>Simulator answer: <code>./paging-linear-translate.py -P 1k -a 16k -p 32k -v -u 25 -c</code></summary>

```text
ARG seed 0
ARG address space size 16k
ARG phys mem size 32k
ARG page size 1k
ARG verbose True
ARG addresses -1


The format of the page table is simple:
The high-order (left-most) bit is the VALID bit.
  If the bit is 1, the rest of the entry is the PFN.
  If the bit is 0, the page is not valid.
Use verbose mode (-v) if you want to print the VPN # by
each entry of the page table.

Page Table (from entry 0 down to the max size)
  [       0]  0x80000018
  [       1]  0x00000000
  [       2]  0x00000000
  [       3]  0x00000000
  [       4]  0x00000000
  [       5]  0x80000009
  [       6]  0x00000000
  [       7]  0x00000000
  [       8]  0x80000010
  [       9]  0x00000000
  [      10]  0x80000013
  [      11]  0x00000000
  [      12]  0x8000001f
  [      13]  0x8000001c
  [      14]  0x00000000
  [      15]  0x00000000

Virtual Address Trace
  VA 0x00003986 (decimal:    14726) -->  Invalid (VPN 14 not valid)
  VA 0x00002bc6 (decimal:    11206) --> 00004fc6 (decimal    20422) [VPN 10]
  VA 0x00001e37 (decimal:     7735) -->  Invalid (VPN 7 not valid)
  VA 0x00000671 (decimal:     1649) -->  Invalid (VPN 1 not valid)
  VA 0x00001bc9 (decimal:     7113) -->  Invalid (VPN 6 not valid)
```

</details>

<details><summary>Simulator answer: <code>./paging-linear-translate.py -P 1k -a 16k -p 32k -v -u 50 -c</code></summary>

```text
ARG seed 0
ARG address space size 16k
ARG phys mem size 32k
ARG page size 1k
ARG verbose True
ARG addresses -1


The format of the page table is simple:
The high-order (left-most) bit is the VALID bit.
  If the bit is 1, the rest of the entry is the PFN.
  If the bit is 0, the page is not valid.
Use verbose mode (-v) if you want to print the VPN # by
each entry of the page table.

Page Table (from entry 0 down to the max size)
  [       0]  0x80000018
  [       1]  0x00000000
  [       2]  0x00000000
  [       3]  0x8000000c
  [       4]  0x80000009
  [       5]  0x00000000
  [       6]  0x8000001d
  [       7]  0x80000013
  [       8]  0x00000000
  [       9]  0x8000001f
  [      10]  0x8000001c
  [      11]  0x00000000
  [      12]  0x8000000f
  [      13]  0x00000000
  [      14]  0x00000000
  [      15]  0x80000008

Virtual Address Trace
  VA 0x00003385 (decimal:    13189) --> 00003f85 (decimal    16261) [VPN 12]
  VA 0x0000231d (decimal:     8989) -->  Invalid (VPN 8 not valid)
  VA 0x000000e6 (decimal:      230) --> 000060e6 (decimal    24806) [VPN 0]
  VA 0x00002e0f (decimal:    11791) -->  Invalid (VPN 11 not valid)
  VA 0x00001986 (decimal:     6534) --> 00007586 (decimal    30086) [VPN 6]
```

</details>

<details><summary>Simulator answer: <code>./paging-linear-translate.py -P 1k -a 16k -p 32k -v -u 75 -c</code></summary>

```text
ARG seed 0
ARG address space size 16k
ARG phys mem size 32k
ARG page size 1k
ARG verbose True
ARG addresses -1


The format of the page table is simple:
The high-order (left-most) bit is the VALID bit.
  If the bit is 1, the rest of the entry is the PFN.
  If the bit is 0, the page is not valid.
Use verbose mode (-v) if you want to print the VPN # by
each entry of the page table.

Page Table (from entry 0 down to the max size)
  [       0]  0x80000018
  [       1]  0x80000008
  [       2]  0x8000000c
  [       3]  0x80000009
  [       4]  0x80000012
  [       5]  0x80000010
  [       6]  0x8000001f
  [       7]  0x8000001c
  [       8]  0x80000017
  [       9]  0x80000015
  [      10]  0x80000003
  [      11]  0x80000013
  [      12]  0x8000001e
  [      13]  0x8000001b
  [      14]  0x80000019
  [      15]  0x80000000

Virtual Address Trace
  VA 0x00002e0f (decimal:    11791) --> 00004e0f (decimal    19983) [VPN 11]
  VA 0x00001986 (decimal:     6534) --> 00007d86 (decimal    32134) [VPN 6]
  VA 0x000034ca (decimal:    13514) --> 00006cca (decimal    27850) [VPN 13]
  VA 0x00002ac3 (decimal:    10947) --> 00000ec3 (decimal     3779) [VPN 10]
  VA 0x00000012 (decimal:       18) --> 00006012 (decimal    24594) [VPN 0]
```

</details>

<details><summary>Simulator answer: <code>./paging-linear-translate.py -P 1k -a 16k -p 32k -v -u 100 -c</code></summary>

```text
ARG seed 0
ARG address space size 16k
ARG phys mem size 32k
ARG page size 1k
ARG verbose True
ARG addresses -1


The format of the page table is simple:
The high-order (left-most) bit is the VALID bit.
  If the bit is 1, the rest of the entry is the PFN.
  If the bit is 0, the page is not valid.
Use verbose mode (-v) if you want to print the VPN # by
each entry of the page table.

Page Table (from entry 0 down to the max size)
  [       0]  0x80000018
  [       1]  0x80000008
  [       2]  0x8000000c
  [       3]  0x80000009
  [       4]  0x80000012
  [       5]  0x80000010
  [       6]  0x8000001f
  [       7]  0x8000001c
  [       8]  0x80000017
  [       9]  0x80000015
  [      10]  0x80000003
  [      11]  0x80000013
  [      12]  0x8000001e
  [      13]  0x8000001b
  [      14]  0x80000019
  [      15]  0x80000000

Virtual Address Trace
  VA 0x00002e0f (decimal:    11791) --> 00004e0f (decimal    19983) [VPN 11]
  VA 0x00001986 (decimal:     6534) --> 00007d86 (decimal    32134) [VPN 6]
  VA 0x000034ca (decimal:    13514) --> 00006cca (decimal    27850) [VPN 13]
  VA 0x00002ac3 (decimal:    10947) --> 00000ec3 (decimal     3779) [VPN 10]
  VA 0x00000012 (decimal:       18) --> 00006012 (decimal    24594) [VPN 0]
```

</details>

<details><summary>Simulator answer: <code>./paging-linear-translate.py -P 8     -a 32      -p 1024 -v -s 1 -c</code></summary>

```text
ARG seed 1
ARG address space size 32
ARG phys mem size 1024
ARG page size 8
ARG verbose True
ARG addresses -1


The format of the page table is simple:
The high-order (left-most) bit is the VALID bit.
  If the bit is 1, the rest of the entry is the PFN.
  If the bit is 0, the page is not valid.
Use verbose mode (-v) if you want to print the VPN # by
each entry of the page table.

Page Table (from entry 0 down to the max size)
  [       0]  0x00000000
  [       1]  0x80000061
  [       2]  0x00000000
  [       3]  0x00000000

Virtual Address Trace
  VA 0x0000000e (decimal:       14) --> 0000030e (decimal      782) [VPN 1]
  VA 0x00000014 (decimal:       20) -->  Invalid (VPN 2 not valid)
  VA 0x00000019 (decimal:       25) -->  Invalid (VPN 3 not valid)
  VA 0x00000003 (decimal:        3) -->  Invalid (VPN 0 not valid)
  VA 0x00000000 (decimal:        0) -->  Invalid (VPN 0 not valid)
```

</details>

<details><summary>Simulator answer: <code>./paging-linear-translate.py -P 8k -a 32k -p 1m    -v -s 2 -c</code></summary>

```text
ARG seed 2
ARG address space size 32k
ARG phys mem size 1m
ARG page size 8k
ARG verbose True
ARG addresses -1


The format of the page table is simple:
The high-order (left-most) bit is the VALID bit.
  If the bit is 1, the rest of the entry is the PFN.
  If the bit is 0, the page is not valid.
Use verbose mode (-v) if you want to print the VPN # by
each entry of the page table.

Page Table (from entry 0 down to the max size)
  [       0]  0x80000079
  [       1]  0x00000000
  [       2]  0x00000000
  [       3]  0x8000005e

Virtual Address Trace
  VA 0x000055b9 (decimal:    21945) -->  Invalid (VPN 2 not valid)
  VA 0x00002771 (decimal:    10097) -->  Invalid (VPN 1 not valid)
  VA 0x00004d8f (decimal:    19855) -->  Invalid (VPN 2 not valid)
  VA 0x00004dab (decimal:    19883) -->  Invalid (VPN 2 not valid)
  VA 0x00004a64 (decimal:    19044) -->  Invalid (VPN 2 not valid)
```

</details>

<details><summary>Simulator answer: <code>./paging-linear-translate.py -P 1m -a 256m -p 512m -v -s 3 -c</code></summary>

```text
ARG seed 3
ARG address space size 256m
ARG phys mem size 512m
ARG page size 1m
ARG verbose True
ARG addresses -1


The format of the page table is simple:
The high-order (left-most) bit is the VALID bit.
  If the bit is 1, the rest of the entry is the PFN.
  If the bit is 0, the page is not valid.
Use verbose mode (-v) if you want to print the VPN # by
each entry of the page table.

Page Table (from entry 0 down to the max size)
  [       0]  0x00000000
  [       1]  0x800000bd
  [       2]  0x80000140
  [       3]  0x00000000
  [       4]  0x00000000
  [       5]  0x80000084
  [       6]  0x00000000
  [       7]  0x800000f0
  [       8]  0x800000f3
  [       9]  0x8000004d
  [      10]  0x800001bc
  [      11]  0x8000017b
  [      12]  0x80000020
  [      13]  0x8000012e
  [      14]  0x00000000
  [      15]  0x00000000
  [      16]  0x800000f2
  [      17]  0x800001c1
  [      18]  0x800001d7
  [      19]  0x00000000
  [      20]  0x800000e3
  [      21]  0x00000000
  [      22]  0x00000000
  [      23]  0x00000000
  [      24]  0x800000df
  [      25]  0x8000009a
  [      26]  0x800000c5
  [      27]  0x00000000
  [      28]  0x8000012b
  [      29]  0x8000015d
  [      30]  0x800001b6
  [      31]  0x80000157
  [      32]  0x00000000
  [      33]  0x800001ed
  [      34]  0x80000123
  [      35]  0x8000006c
  [      36]  0x80000125
  [      37]  0x00000000
  [      38]  0x00000000
  [      39]  0x800001fa
  [      40]  0x00000000
  [      41]  0x800000d2
  [      42]  0x00000000
  [      43]  0x00000000
  [      44]  0x800001be
  [      45]  0x00000000
  [      46]  0x80000017
  [      47]  0x800000a9
  [      48]  0x800001f6
  [      49]  0x800001ff
  [      50]  0x00000000
  [      51]  0x00000000
  [      52]  0x80000010
  [      53]  0x00000000
  [      54]  0x00000000
  [      55]  0x8000004f
  [      56]  0x00000000
  [      57]  0x800000a0
  [      58]  0x800001cb
  [      59]  0x00000000
  [      60]  0x00000000
  [      61]  0x80000149
  [      62]  0x8000011e
  [      63]  0x800001e1
  [      64]  0x800000dc
  [      65]  0x80000079
  [      66]  0x00000000
  [      67]  0x8000010a
  [      68]  0x80000005
  [      69]  0x00000000
  [      70]  0x8000000a
  [      71]  0x80000143
  [      72]  0x00000000
  [      73]  0x800000ee
  [      74]  0x800000b4
  [      75]  0x80000179
  [      76]  0x00000000
  [      77]  0x00000000
  [      78]  0x00000000
  [      79]  0x00000000
  [      80]  0x800000a3
  [      81]  0x00000000
  [      82]  0x00000000
  [      83]  0x00000000
  [      84]  0x80000099
  [      85]  0x00000000
  [      86]  0x8000000d
  [      87]  0x80000178
  [      88]  0x00000000
  [      89]  0x00000000
  [      90]  0x8000007a
  [      91]  0x00000000
  [      92]  0x00000000
  [      93]  0x80000034
  [      94]  0x00000000
  [      95]  0x00000000
  [      96]  0x800000e0
  [      97]  0x80000056
  [      98]  0x00000000
  [      99]  0x800001c5
  [     100]  0x00000000
  [     101]  0x00000000
  [     102]  0x00000000
  [     103]  0x80000061
  [     104]  0x800001ad
  [     105]  0x00000000
  [     106]  0x00000000
  [     107]  0x80000148
  [     108]  0x800000b0
  [     109]  0x00000000
  [     110]  0x00000000
  [     111]  0x8000008a
  [     112]  0x00000000
  [     113]  0x00000000
  [     114]  0x00000000
  [     115]  0x00000000
  [     116]  0x00000000
  [     117]  0x800001c2
  [     118]  0x800000de
  [     119]  0x800001da
  [     120]  0x00000000
  [     121]  0x800001ac
  [     122]  0x80000109
  [     123]  0x00000000
  [     124]  0x00000000
  [     125]  0x00000000
  [     126]  0x00000000
  [     127]  0x80000092
  [     128]  0x80000163
  [     129]  0x80000127
  [     130]  0x00000000
  [     131]  0x80000057
  [     132]  0x00000000
  [     133]  0x8000010c
  [     134]  0x00000000
  [     135]  0x80000139
  [     136]  0x00000000
  [     137]  0x00000000
  [     138]  0x800000f4
  [     139]  0x00000000
  [     140]  0x800001a2
  [     141]  0x00000000
  [     142]  0x800001a5
  [     143]  0x00000000
  [     144]  0x800001b9
  [     145]  0x00000000
  [     146]  0x00000000
  [     147]  0x00000000
  [     148]  0x800000d8
  [     149]  0x00000000
  [     150]  0x80000000
  [     151]  0x00000000
  [     152]  0x00000000
  [     153]  0x00000000
  [     154]  0x00000000
  [     155]  0x800001b5
  [     156]  0x00000000
  [     157]  0x800000a1
  [     158]  0x00000000
  [     159]  0x00000000
  [     160]  0x8000012c
  [     161]  0x00000000
  [     162]  0x00000000
  [     163]  0x00000000
  [     164]  0x00000000
  [     165]  0x8000016e
  [     166]  0x00000000
  [     167]  0x00000000
  [     168]  0x00000000
  [     169]  0x00000000
  [     170]  0x80000190
  [     171]  0x00000000
  [     172]  0x8000013e
  [     173]  0x00000000
  [     174]  0x00000000
  [     175]  0x00000000
  [     176]  0x800000d7
  [     177]  0x800000eb
  [     178]  0x00000000
  [     179]  0x00000000
  [     180]  0x00000000
  [     181]  0x00000000
  [     182]  0x800001df
  [     183]  0x00000000
  [     184]  0x80000194
  [     185]  0x00000000
  [     186]  0x00000000
  [     187]  0x00000000
  [     188]  0x80000153
  [     189]  0x80000195
  [     190]  0x80000177
  [     191]  0x80000002
  [     192]  0x00000000
  [     193]  0x80000016
  [     194]  0x00000000
  [     195]  0x00000000
  [     196]  0x8000005b
  [     197]  0x00000000
  [     198]  0x8000003e
  [     199]  0x80000158
  [     200]  0x800001e7
  [     201]  0x80000198
  [     202]  0x00000000
  [     203]  0x80000105
  [     204]  0x80000036
  [     205]  0x800001de
  [     206]  0x00000000
  [     207]  0x00000000
  [     208]  0x800001a7
  [     209]  0x00000000
  [     210]  0x00000000
  [     211]  0x00000000
  [     212]  0x80000181
  [     213]  0x00000000
  [     214]  0x00000000
  [     215]  0x00000000
  [     216]  0x00000000
  [     217]  0x00000000
  [     218]  0x00000000
  [     219]  0x800001f2
  [     220]  0x00000000
  [     221]  0x80000052
  [     222]  0x8
... (output cut; run it yourself for the rest)
```

</details>

## The simulator (README from the homework repository)


# Overview

In this homework, you will use a simple program, which is known as
paging-linear-translate.py, to see if you understand how simple
virtual-to-physical address translation works with linear page tables. To run
the program, remember to either type just the name of the program
(./paging-linear-translate.py) or possibly this (python
paging-linear-translate.py). When you run it with the -h (help) flag, you 
see:

```sh
prompt> ./paging-linear-translate.py -h
Usage: paging-linear-translate.py [options]

Options:
-h, --help              show this help message and exit
-s SEED, --seed=SEED    the random seed
-a ASIZE, --asize=ASIZE 
                        address space size (e.g., 16, 64k, ...)
-p PSIZE, --physmem=PSIZE
                        physical memory size (e.g., 16, 64k, ...)
-P PAGESIZE, --pagesize=PAGESIZE
                        page size (e.g., 4k, 8k, ...)
-n NUM, --addresses=NUM number of virtual addresses to generate
-u USED, --used=USED    percent of address space that is used
-v                      verbose mode
-c                      compute answers for me
```

First, run the program without any arguments:

```sh
prompt> ./paging-linear-translate.py 
ARG seed 0
ARG address space size 16k
ARG phys mem size 64k
ARG page size 4k
ARG verbose False

The format of the page table is simple:
The high-order (left-most) bit is the VALID bit.
  If the bit is 1, the rest of the entry is the PFN.
  If the bit is 0, the page is not valid.
Use verbose mode (-v) if you want to print the VPN # by
each entry of the page table.

Page Table (from entry 0 down to the max size)
   0x8000000c
   0x00000000
   0x00000000
   0x80000006

Virtual Address Trace
  VA  0: 0x00003229 (decimal:    12841) --> PA or invalid?
  VA  1: 0x00001369 (decimal:     4969) --> PA or invalid?
  VA  2: 0x00001e80 (decimal:     7808) --> PA or invalid?
  VA  3: 0x00002556 (decimal:     9558) --> PA or invalid?
  VA  4: 0x00003a1e (decimal:    14878) --> PA or invalid?
```

For each virtual address, write down the physical address it 
translates to OR write down that it is an out-of-bounds 
address (e.g., a segmentation fault).

As you can see, what the program provides for you is a page table for a
particular process (remember, in a real system with linear page tables, there
is one page table per process; here we just focus on one process, its address
space, and thus a single page table). The page table tells you, for each
virtual page number (VPN) of the address space, that the virtual page is
mapped to a particular physical frame number (PFN) and thus valid, or not
valid.

The format of the page-table entry is simple: the left-most (high-order) bit
is the valid bit; the remaining bits, if valid is 1, is the PFN. 

In the example above, the page table maps VPN 0 to PFN 0xc (decimal 12), VPN 3
to PFN 0x6 (decimal 6), and leaves the other two virtual pages, 1 and 2, as
not valid. 

Because the page table is a linear array, what is printed above is a replica
of what you would see in memory if you looked at the bits yourself. However,
it is sometimes easier to use this simulator if you run with the verbose flag
(-v); this flag also prints out the VPN (index) into the page table. From the
example above, run with the -v flag:

```sh
Page Table (from entry 0 down to the max size)
  [       0]   0x8000000c
  [       1]   0x00000000
  [       2]   0x00000000
  [       3]   0x80000006
```

Your job, then, is to use this page table to translate the virtual addresses
given to you in the trace to physical addresses. Let's look at the first one:
VA 0x3229. To translate this virtual address into a physical address, we first
have to break it up into its constituent components: a virtual page number and
an offset. We do this by noting down the size of the address space and the
page size. In this example, the address space is set to 16KB (a very small
address space) and the page size is 4KB. Thus, we know that there are 14 bits
in the virtual address, and that the offset is 12 bits, leaving 2 bits for the
VPN. Thus, with our address 0x3229, which is binary 11 0010 0010 1001, we know
the top two bits specify the VPN. Thus, 0x3229 is on virtual page 3 with an
offset of 0x229.

We next look in the page table to see if VPN 3 is valid and mapped to some
physical frame or invalid, and we see that it is indeed valid (the high bit is
1) and mapped to physical page 6. Thus, we can form our final physical address
by taking the physical page 6 and adding it onto the offset, as follows:
0x6000 (the physical page, shifted into the proper spot) OR 0x0229 (the
offset), yielding the final physical address: 0x6229. Thus, we can see that
virtual address 0x3229 translates to physical address 0x6229 in this example.

To see the rest of the solutions (after you have computed them yourself!),
just run with the -c flag (as always):

```sh
...
VA  0: 00003229 (decimal: 12841) --> 00006229 (25129) [VPN 3]
VA  1: 00001369 (decimal:  4969) --> Invalid (VPN 1 not valid)
VA  2: 00001e80 (decimal:  7808) --> Invalid (VPN 1 not valid)
VA  3: 00002556 (decimal:  9558) --> Invalid (VPN 2 not valid)
VA  4: 00003a1e (decimal: 14878) --> 00006a1e (27166) [VPN 3]
```

Of course, you can change many of these parameters to make more interesting
problems. Run the program with the -h flag to see what options there are:

* The -s flag changes the random seed and thus generates different page table values as well as different virtual addresses to translate.
* The -a flag changes the size of the address space.
* The -p flag changes the size of physical memory.
* The -P flag changes the size of a page.
* The -n flag can be used to generate more addresses to translate (instead of the default 5).
* The -u flag changes the fraction of mappings that are valid, from 0% (-u 0) up to 100% (-u 100). The default is 50, which means that roughly 1/2 of the pages in the virtual address space will be valid.
* The -v flag prints out the VPN numbers to make your life easier.




