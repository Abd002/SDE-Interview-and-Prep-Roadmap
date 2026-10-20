# devops-exercises: ansible / solutions/update_upgrade_task.md

> Copied from <https://github.com/bregman-arie/devops-exercises/blob/master/topics/ansible/solutions/update_upgrade_task.md> (CC BY-NC-ND 3.0, by Arie Bregman and contributors). Questions and answers are the source's own; nothing was answered or rewritten here.

## Update and Upgrade apt packages task - Solution

```
- name: "update and upgrade apt packages."
  become: yes
  apt:
    upgrade: yes
    update_cache: yes
```
