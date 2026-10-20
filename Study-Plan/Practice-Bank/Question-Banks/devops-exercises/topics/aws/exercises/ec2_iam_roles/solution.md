# devops-exercises: aws / exercises/ec2_iam_roles/solution.md

> Copied from <https://github.com/bregman-arie/devops-exercises/blob/master/topics/aws/exercises/ec2_iam_roles/solution.md> (CC BY-NC-ND 3.0, by Arie Bregman and contributors). Questions and answers are the source's own; nothing was answered or rewritten here.

## AWS EC2 - IAM Roles
 
### Requirements
 
1. Running EC2 instance without any IAM roles (so you if you connect the instance and try to run AWS commands, it fails)
2. IAM role with "IAMReadOnlyAccess" policy
 
### Objectives

1. Attach a role (and if such role doesn't exists, create it) with "IAMReadOnlyAccess" policy to the EC2 instance
2. Verify you can run AWS commands in the instance
 
### Solution

#### Console

1. Go to EC2 service
2. Click on the instance to which you would like to attach the IAM role
3. Click on "Actions" -> "Security" -> "Modify IAM Role" 
4. Choose the IAM role with "IAMReadOnlyAccess" policy and click on "Save"
5. Running AWS commands now in the instance should work fine (e.g. `aws iam list-users`)
