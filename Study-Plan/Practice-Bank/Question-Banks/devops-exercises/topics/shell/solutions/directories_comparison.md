# devops-exercises: shell / solutions/directories_comparison.md

> Copied from <https://github.com/bregman-arie/devops-exercises/blob/master/topics/shell/solutions/directories_comparison.md> (CC BY-NC-ND 3.0, by Arie Bregman and contributors). Questions and answers are the source's own; nothing was answered or rewritten here.

## Directories Comparison

### Objectives

1. You are given two directories as arguments and the output should be any difference between the two directories

### Solution 1

Suppose the name of the bash script is ```dirdiff.sh```

```
#!/bin/bash

if test $# -ne 2
then
	echo -e "USAGE: ./dirdiff.sh directory1 directory2"
	exit 1
fi

# check for the checksums. 
# If both the checksums same, then both directories are same
if test `ls -1 $1 | sort | md5sum | awk -F "  " '{print $1}'` == `ls -1 $2 | sort | md5sum | awk -F "  " '{print $1}'`
then
	echo -e "No difference between the 2 directories"
	exit 0
fi

diff -q $1 $2
```

### Solution 2

With gnu find, you can use diff to compare directories recursively.

```shell
diff --recursive directory1 directory2
```
