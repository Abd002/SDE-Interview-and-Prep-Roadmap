# devops-exercises: aws / exercises/register_domain/solution.md

> Copied from <https://github.com/bregman-arie/devops-exercises/blob/master/topics/aws/exercises/register_domain/solution.md> (CC BY-NC-ND 3.0, by Arie Bregman and contributors). Questions and answers are the source's own; nothing was answered or rewritten here.

## AWS Route 53 - Register Domain

### Objectives

Note: registering domain costs money. Don't do this exercise, unless you understand that you are going to register a domain and it's going to cost you money.

1. Register your own custom domain using AWS Route 53
2. What is the type of your domain?
3. How many records your domain has?

### Solution

1. Go to Route 53 service page
2. Click in the menu on "Registered Domains" under "Domains"
3. Click on "Register Domain"
4. Insert your domain
5. Check if it's available. If it is, add it to the cart 

Note: registering domain costs money. Don't click on "continue", unless you understand that you are going to register a domain and it's going to cost you money.

6. Click on "Continue" and fill in your contact information
7. Choose if you want to renew it in the future automatically. Accept the terms and click on "Complete Order"
8. Go to hosted zones and you should see there your newly registered domain

1. The domain type is "Public"

1. The domain has 2 DNS records: NS and SOA
