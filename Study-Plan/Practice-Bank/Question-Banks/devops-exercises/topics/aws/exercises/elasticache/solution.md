# devops-exercises: aws / exercises/elasticache/solution.md

> Copied from <https://github.com/bregman-arie/devops-exercises/blob/master/topics/aws/exercises/elasticache/solution.md> (CC BY-NC-ND 3.0, by Arie Bregman and contributors). Questions and answers are the source's own; nothing was answered or rewritten here.

## AWS ElastiCache

### Objectives

1. Create ElastiCache Redis
  * Instance type should be "cache.t2.micro"
  * Replicas should be 0

### Solution

#### Console

1. Go to ElastiCache service
2. Click on "Get Started Now"
3. Choose "Redis"
4. Insert a name and description
5. Choose "cache.t2.micro" an node type
6. Set number of replicas to 0
7. Create new subnet group
8. Click on "Create"
