# devops-exercises: git / solutions/commit_01_solution.md

> Copied from <https://github.com/bregman-arie/devops-exercises/blob/master/topics/git/solutions/commit_01_solution.md> (CC BY-NC-ND 3.0, by Arie Bregman and contributors). Questions and answers are the source's own; nothing was answered or rewritten here.

## Git Commit 01 - Solution

```
mkdir my_repo && cd my_repo
git init
echo "hello_commit" > file
git add file
git commit -a -m "It's my first commit. Exciting!"
git log
```
