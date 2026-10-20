# devops-exercises: aws / exercises/ebs_volume_creation/exercise.md

> Copied from <https://github.com/bregman-arie/devops-exercises/blob/master/topics/aws/exercises/ebs_volume_creation/exercise.md> (CC BY-NC-ND 3.0, by Arie Bregman and contributors). Questions and answers are the source's own; nothing was answered or rewritten here.

## AWS EC2 - EBS Volume Creation

### Requirements

One EC2 instance that you can get rid of :)

### Objectives

1. Create a volume in the same AZ as your instance, with the following properties:
  1. gp2 volume type
  2. 4 GiB size
2. Once created, attach it to your EC2 instance
3. Remove your EC2 instance. What happened to the EBS volumes attached to the EC2 instance?
