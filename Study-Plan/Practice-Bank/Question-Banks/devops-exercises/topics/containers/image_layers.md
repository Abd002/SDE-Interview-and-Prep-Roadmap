# devops-exercises: containers / image_layers.md

> Copied from <https://github.com/bregman-arie/devops-exercises/blob/master/topics/containers/image_layers.md> (CC BY-NC-ND 3.0, by Arie Bregman and contributors). Questions and answers are the source's own; nothing was answered or rewritten here.

## Layer by Layer

### Objective

Learn about image layers

### Requirements

Make sure Docker is installed on your system and the service is started

```
# Fedora/RHEL/CentOS
rpm -qa | grep docker
systemctl status docker
```

### Instructions

1. Write a Dockefile. Any Dockefile! :) (just make sure it's a valid one)
2. Build an image using the Dockerfile you've wrote
3. Which of the instructions you've used, created new layers and which added image metadata?
4. What ways are there to confirm your answer to the last question?
5. Can you reduce the size of the image you've created?
