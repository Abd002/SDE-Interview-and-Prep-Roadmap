# devops-exercises: aws / exercises/network_load_balancer/exercise.md

> Copied from <https://github.com/bregman-arie/devops-exercises/blob/master/topics/aws/exercises/network_load_balancer/exercise.md> (CC BY-NC-ND 3.0, by Arie Bregman and contributors). Questions and answers are the source's own; nothing was answered or rewritten here.

## AWS ELB - Network Load Balancer

### Requirements                   

Two running EC2 instances

### Objectives

1. Create a network load balancer 
  1. healthy threshold: 3
  2. unhealthy threshold: 3
  3. interval: 10 seconds
  4. Listener should be using TCP protocol on port 80
