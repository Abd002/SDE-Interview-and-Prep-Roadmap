# devops-exercises: git / solutions/branch_01_solution.md

> Copied from <https://github.com/bregman-arie/devops-exercises/blob/master/topics/git/solutions/branch_01_solution.md> (CC BY-NC-ND 3.0, by Arie Bregman and contributors). Questions and answers are the source's own; nothing was answered or rewritten here.

## Branch 01 - Solution

```
cd some_repository
echo "master branch" > file1
git add file1
git commit -a -m "added file1"
git checkout -b dev
echo "dev branch" > file2
git add file2
git commit -a -m "added file2"
```

Verify:

```
git log (you should see two commits)
git checkout master
git log (you should see one commit)
```
