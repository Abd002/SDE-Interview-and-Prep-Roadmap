# devops-exercises: aws / exercises/credential_report/solution.md

> Copied from <https://github.com/bregman-arie/devops-exercises/blob/master/topics/aws/exercises/credential_report/solution.md> (CC BY-NC-ND 3.0, by Arie Bregman and contributors). Questions and answers are the source's own; nothing was answered or rewritten here.

## AWS - Credential Report

### Objectives

1. Create/Download a credential report
2. Answer the following questions based on the report:
  1. Are there users with MFA not activated?
  2. Are there users with password enabled that didn't 
3. Explain the use case for using the credential report

### Solution

1. Go to the AWS IAM service
2. Under "Access Reports" click on "Credential report"
3. Click on "Download Report" and open it once it's downloaded
4. Answer the questions in this exercises by inspecting the report

The credential report is useful to identify whether there any users who need assistance or attention in regards to their security. For example a user who didn't change his password for a long time and didn't activate MFA.
