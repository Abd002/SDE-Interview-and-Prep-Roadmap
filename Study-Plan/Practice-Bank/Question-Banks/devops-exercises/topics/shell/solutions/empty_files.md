# devops-exercises: shell / solutions/empty_files.md

> Copied from <https://github.com/bregman-arie/devops-exercises/blob/master/topics/shell/solutions/empty_files.md> (CC BY-NC-ND 3.0, by Arie Bregman and contributors). Questions and answers are the source's own; nothing was answered or rewritten here.

## Empty Files

### Objectives

1. Write a script to remove all the empty files in a given directory (including nested directories)

### Solution

```
#! /bin/bash
for x in *
do
    if [ -s $x ]
    then
        continue
    else
        rm -rf $x
    fi
done
```
