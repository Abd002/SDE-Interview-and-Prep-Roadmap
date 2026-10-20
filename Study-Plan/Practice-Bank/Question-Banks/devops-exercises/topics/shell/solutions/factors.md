# devops-exercises: shell / solutions/factors.md

> Copied from <https://github.com/bregman-arie/devops-exercises/blob/master/topics/shell/solutions/factors.md> (CC BY-NC-ND 3.0, by Arie Bregman and contributors). Questions and answers are the source's own; nothing was answered or rewritten here.

## Shell Scripting - Factors

### Objectives

Write a script that when given a number, will:

* Check if the number has 2 as factor, if yes it will print "one factor"
* Check if the number has 3 as factor, if yes it will print "one factor...actually two!"
* If none of them (2 and 3) is a factor, print the number itself

### Solution

```
#!/usr/bin/env bash

(( $1 % 2 )) || res="one factor"
(( $1 % 3 )) || res+="...actually two!"

echo ${res:-$1}
```
