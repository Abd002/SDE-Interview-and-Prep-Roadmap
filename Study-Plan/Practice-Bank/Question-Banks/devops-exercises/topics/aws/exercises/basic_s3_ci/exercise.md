# devops-exercises: aws / exercises/basic_s3_ci/exercise.md

> Copied from <https://github.com/bregman-arie/devops-exercises/blob/master/topics/aws/exercises/basic_s3_ci/exercise.md> (CC BY-NC-ND 3.0, by Arie Bregman and contributors). Questions and answers are the source's own; nothing was answered or rewritten here.

# Basic CI with S3

## Objectives

1. Create a new S3 bucket
2. Add to the bucket index.html file and make it a static website
3. Create a GitHub repo and put the index.html there
4. Make sure to connect your AWS account to GitHub
5. Create a CI pipeline in AWS to publish the updated index.html from GitHub every time someone makes a change to the repo, to a specific branch
