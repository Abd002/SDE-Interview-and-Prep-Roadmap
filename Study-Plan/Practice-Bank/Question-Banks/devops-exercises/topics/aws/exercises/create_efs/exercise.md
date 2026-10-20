# devops-exercises: aws / exercises/create_efs/exercise.md

> Copied from <https://github.com/bregman-arie/devops-exercises/blob/master/topics/aws/exercises/create_efs/exercise.md> (CC BY-NC-ND 3.0, by Arie Bregman and contributors). Questions and answers are the source's own; nothing was answered or rewritten here.

## AWS - Create EFS
 
### Requirements

Two EC2 instances in different availability zones

### Objectives

1. Create an EFS with the following properties
  1. Set lifecycle management to 60 days
  2. The mode should match a use case of scaling to high levels of throughput and I/O operations per second
2. Mount the EFS in both of your EC2 instances
