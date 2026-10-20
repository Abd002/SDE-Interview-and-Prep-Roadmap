# devops-exercises: shell / solutions/basic_date.md

> Copied from <https://github.com/bregman-arie/devops-exercises/blob/master/topics/shell/solutions/basic_date.md> (CC BY-NC-ND 3.0, by Arie Bregman and contributors). Questions and answers are the source's own; nothing was answered or rewritten here.

## Basic Date

### Objectives

1. Write a script that will put the current date in a file called "the_date.txt"

### Solution

```
#!/usr/bin/env bash

echo $(date) > the_date.txt
```
