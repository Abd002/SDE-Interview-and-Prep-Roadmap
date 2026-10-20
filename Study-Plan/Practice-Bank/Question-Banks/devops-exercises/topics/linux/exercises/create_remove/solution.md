# devops-exercises: linux / exercises/create_remove/solution.md

> Copied from <https://github.com/bregman-arie/devops-exercises/blob/master/topics/linux/exercises/create_remove/solution.md> (CC BY-NC-ND 3.0, by Arie Bregman and contributors). Questions and answers are the source's own; nothing was answered or rewritten here.

# Create & Destroy

## Objectives

1. Create a file called `x`
2. Create a directory called `content`
3. Move `x` file to the `content` directory
4. Create a file inside the `content` directory called `y`
5. Create the following directory structure in `content` directory: `dir1/dir2/dir3`
6. Remove the content directory

## Solution

```
touch x
mkdir content
mv x content
touch content/y
mkdir -p content/dir1/dir2/dir3
rm -rf content
```
