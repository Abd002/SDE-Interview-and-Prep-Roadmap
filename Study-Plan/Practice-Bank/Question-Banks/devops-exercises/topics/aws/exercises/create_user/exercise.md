# devops-exercises: aws / exercises/create_user/exercise.md

> Copied from <https://github.com/bregman-arie/devops-exercises/blob/master/topics/aws/exercises/create_user/exercise.md> (CC BY-NC-ND 3.0, by Arie Bregman and contributors). Questions and answers are the source's own; nothing was answered or rewritten here.

## IAM AWS - Create a User

### Objectives

As you probably know at this point, it's not recommended to work with the root account in AWS. For this reason you are going to create a new account which you'll use regularly as the admin account.

1. Create a user with password credentials
2. Add the newly created user to a group called "admin" and attach to it the policy called "Administrator Access"
3. Make sure the user has a tag called with the key `Role` and the value `DevOps`
