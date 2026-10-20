# devops-exercises: aws / exercises/health_checks/exercise.md

> Copied from <https://github.com/bregman-arie/devops-exercises/blob/master/topics/aws/exercises/health_checks/exercise.md> (CC BY-NC-ND 3.0, by Arie Bregman and contributors). Questions and answers are the source's own; nothing was answered or rewritten here.

## AWS Route 53 - Health Checks

## Requirements

3 web instances in different AZs.

## Objectives 

1. For each instance create a health checks with the following properties:
  1. Name it after the AZ where the instance resides
  2. Failure threshold should be 5

2. Edit the security group of one of your instances and remove HTTP rules.
  1. Did it change the status of the health check?
