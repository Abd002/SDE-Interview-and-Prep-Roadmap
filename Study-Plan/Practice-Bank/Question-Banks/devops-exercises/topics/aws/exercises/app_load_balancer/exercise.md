# devops-exercises: aws / exercises/app_load_balancer/exercise.md

> Copied from <https://github.com/bregman-arie/devops-exercises/blob/master/topics/aws/exercises/app_load_balancer/exercise.md> (CC BY-NC-ND 3.0, by Arie Bregman and contributors). Questions and answers are the source's own; nothing was answered or rewritten here.

## AWS ELB - Application Load Balancer 

### Requirements                   

Two EC2 instances with a simple web application that shows the web page with the string "Hey, it's a me, `<HOSTNAME>`!"

### Objectives                     

1. Create an application load balancer for the two instances you have, with the following properties
  1. healthy threshold: 3
  2. unhealthy threshold: 3
  3. interval: 10 seconds
2. Verify load balancer is working  (= you get reply from both instances at different times)
