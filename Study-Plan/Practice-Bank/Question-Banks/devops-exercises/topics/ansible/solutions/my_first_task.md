# devops-exercises: ansible / solutions/my_first_task.md

> Copied from <https://github.com/bregman-arie/devops-exercises/blob/master/topics/ansible/solutions/my_first_task.md> (CC BY-NC-ND 3.0, by Arie Bregman and contributors). Questions and answers are the source's own; nothing was answered or rewritten here.

## My First Task - Solution

```
- name: Create a new directory
  file:
    path: "/tmp/new_directory"
    state: directory
```
