# devops-exercises: aws / exercises/route_53_failover/exercise.md

> Copied from <https://github.com/bregman-arie/devops-exercises/blob/master/topics/aws/exercises/route_53_failover/exercise.md> (CC BY-NC-ND 3.0, by Arie Bregman and contributors). Questions and answers are the source's own; nothing was answered or rewritten here.

## AWS Route 53 - Failover

### Requirements

A running EC2 web instance with an health check defined for it in Route 53

### Objectives

1. Create a failover record that will failover to another record if an health check isn't passing
  1. Make sure TTL is 30
  2. Associate the failover record with the health check you have
