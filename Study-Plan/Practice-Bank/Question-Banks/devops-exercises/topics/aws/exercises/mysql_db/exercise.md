# devops-exercises: aws / exercises/mysql_db/exercise.md

> Copied from <https://github.com/bregman-arie/devops-exercises/blob/master/topics/aws/exercises/mysql_db/exercise.md> (CC BY-NC-ND 3.0, by Arie Bregman and contributors). Questions and answers are the source's own; nothing was answered or rewritten here.

## AWS Databases - MySQL DB

### Objectives

1. Create a MySQL database with the following properties
  * Instance type: db.t2.micro
  * gp2 storage
  * Storage Auto scaling should be enabled and threshold should be set to 500 GiB
  * Public access should be enabled
  * Port should be set to 3306
  * DB name: 'db'
  * Backup retention: 10 days

2. Create read replica for the database you've created
