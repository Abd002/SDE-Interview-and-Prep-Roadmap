# devops-exercises: linux / exercises/uniqe_count/solution.md

> Copied from <https://github.com/bregman-arie/devops-exercises/blob/master/topics/linux/exercises/uniqe_count/solution.md> (CC BY-NC-ND 3.0, by Arie Bregman and contributors). Questions and answers are the source's own; nothing was answered or rewritten here.

# Unique Count

## Objectives

In this directory you have a file with list of IP addresses called `ip_list`. Using the file, determine which IP address is the most recurring (listed the most times).

# Solution

`sort ip_list | cut -d' ' -f1 | uniq -c | sort -n | tail -1`