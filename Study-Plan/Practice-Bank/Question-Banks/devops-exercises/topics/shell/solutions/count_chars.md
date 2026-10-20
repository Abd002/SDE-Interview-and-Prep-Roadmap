# devops-exercises: shell / solutions/count_chars.md

> Copied from <https://github.com/bregman-arie/devops-exercises/blob/master/topics/shell/solutions/count_chars.md> (CC BY-NC-ND 3.0, by Arie Bregman and contributors). Questions and answers are the source's own; nothing was answered or rewritten here.

## Count Chars

### Objectives

1. Read input from the user until you get empty string
2. For each of the lines you read, count the number of characters and print it

### Constraints

1. You must use a while loop
2. Assume at least three lines of input

### Solution

```
#!/usr/bin/env bash

echo -n "Please insert your input: "

while read line; do
    echo -n "$line" | wc -c
    echo -n "Please insert your input: "
done
```
