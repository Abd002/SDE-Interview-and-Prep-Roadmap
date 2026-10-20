# devops-exercises: aws / exercises/alb_multiple_target_groups/exercise.md

> Copied from <https://github.com/bregman-arie/devops-exercises/blob/master/topics/aws/exercises/alb_multiple_target_groups/exercise.md> (CC BY-NC-ND 3.0, by Arie Bregman and contributors). Questions and answers are the source's own; nothing was answered or rewritten here.

## AWS ELB - ALB Multiple Target Groups

### Requirements                   

Two EC2 instances with a simple web application that shows the web page with the string "Hey, it's a me, `<HOSTNAME>`!"
One EC2 instance with a simple web application that shows the web page with the string "Hey, it's only a test..." under the endpoint /test

### Objectives

1. Create an application load balancer for the two instances you have, with the following properties
  1. healthy threshold: 3
  2. unhealthy threshold: 3
  3. interval: 10 seconds
2. Create another target group for the third instance
  1. Traffic should be forwarded to this group based on the "/test" path
