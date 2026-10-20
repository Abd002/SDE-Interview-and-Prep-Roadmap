# devops-exercises: aws / exercises/snapshots/solution.md

> Copied from <https://github.com/bregman-arie/devops-exercises/blob/master/topics/aws/exercises/snapshots/solution.md> (CC BY-NC-ND 3.0, by Arie Bregman and contributors). Questions and answers are the source's own; nothing was answered or rewritten here.

## AWS EC2 - EBS Snapshots

### Requirements

EBS Volume

### Objectives

A. Create a snapshot of an EBS volume
B. Verify the snapshot was created
C. Move the data to another region
D. Create a volume out of it in a different AZ

### Solution

A.
1. Go to EC2 service
2. Click on "Volumes" under "Elastic Block Store"
3. Right click on the chosen volume -> Create snapshot
4. Insert a description and click on "Create Snapshot"

B.
1. Click on "Snapshots" under "Elastic Block Store"
2. You should see the snapshot you've created

C.
1. Select the snapshot and click on Actions -> Copy
2. Select a region to where the snapshot will be copied

D.
1. Select the snapshot and click on Actions -> Create volume
2. Choose a different AZ
3. Click on "Create Volume"
