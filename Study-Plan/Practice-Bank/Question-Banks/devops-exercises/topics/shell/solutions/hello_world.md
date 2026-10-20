# devops-exercises: shell / solutions/hello_world.md

> Copied from <https://github.com/bregman-arie/devops-exercises/blob/master/topics/shell/solutions/hello_world.md> (CC BY-NC-ND 3.0, by Arie Bregman and contributors). Questions and answers are the source's own; nothing was answered or rewritten here.

## Shell Scripting - Hello World

### Objectives

1. Define a variable with the string 'Hello World'
2. Print the value of the variable you've defined and redirect the output to the file "amazing_output.txt"

### Solution

```
#!/usr/bin/env bash

HW_STR="Hello World"
echo $HW_STR > amazing_output.txt
```
