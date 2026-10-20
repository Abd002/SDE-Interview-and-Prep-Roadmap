# devops-exercises: kubernetes / exercises/labels_and_selectors/solution.md

> Copied from <https://github.com/bregman-arie/devops-exercises/blob/master/topics/kubernetes/exercises/labels_and_selectors/solution.md> (CC BY-NC-ND 3.0, by Arie Bregman and contributors). Questions and answers are the source's own; nothing was answered or rewritten here.

# Labels and Selectors 101

## Objectives

1. How to list all the Pods with the label "app=web"?
2. How to list all objects labeled as "env=staging"?
3. How to list all deployments from "env=prod" and "type=web"?

## Solution

`k get po -l app=web`
`k get all -l env=staging`
`k get deploy -l env=prod,type=web`