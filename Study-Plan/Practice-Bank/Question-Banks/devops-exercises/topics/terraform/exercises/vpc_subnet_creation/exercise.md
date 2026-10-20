# devops-exercises: terraform / exercises/vpc_subnet_creation/exercise.md

> Copied from <https://github.com/bregman-arie/devops-exercises/blob/master/topics/terraform/exercises/vpc_subnet_creation/exercise.md> (CC BY-NC-ND 3.0, by Arie Bregman and contributors). Questions and answers are the source's own; nothing was answered or rewritten here.

# Creating Custom VPC and Subnets with Terraform

## Requirements
* An existing AWS account with permissions to create VPCs and subnets.
* Terraform installed on your local machine.
* AWS CLI configured with your credentials.


## Objectives
1. Create a custom VPC with a specified CIDR block.
    For example, you can use `10.0.0.0/16`.
2. Create two subnets within the VPC, each with a different CIDR block.
    For example, you can use `10.0.0.0/20` for the first subnet and `10.0.16.0/20` for the second subnet.

    Both subnets should be in different availability zones to ensure high availability.
3. Ensure that the VPC and subnets are tracked by Terraform.

## Solution
Click [here to view the solution](https://github.com/bregman-arie/devops-exercises/blob/master/topics/terraform/exercises/vpc_subnet_creation/solution.md)
