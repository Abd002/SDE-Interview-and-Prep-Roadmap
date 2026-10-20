# devops-exercises: linux / exercises/navigation/solution.md

> Copied from <https://github.com/bregman-arie/devops-exercises/blob/master/topics/linux/exercises/navigation/solution.md> (CC BY-NC-ND 3.0, by Arie Bregman and contributors). Questions and answers are the source's own; nothing was answered or rewritten here.

# Navigation

## Requirements

1. Linux :)

## Objectives

1. Change directory to `/tmp`
2. Move to parent directory
3. Change directory to home directory
4. Move to parent directory
5. Move again to parent directory
   1. Where are you at? Verify with a command
6. Change to last visited directory

## Solution

```
cd /tmp
cd ..
cd ~
cd ..
cd ..
# root (/)
pwd
cd -
```