# devops-exercises: cicd / remove_builds.md

> Copied from <https://github.com/bregman-arie/devops-exercises/blob/master/topics/cicd/remove_builds.md> (CC BY-NC-ND 3.0, by Arie Bregman and contributors). Questions and answers are the source's own; nothing was answered or rewritten here.

### Jenkins - Remove Jobs

#### Objective 

Learn how to write a Jenkins script that interacts with builds by removing builds older than X days.

#### Instructions

1. Pick up (or create) a job which has builds older than X days
2. Write a script to remove only the builds that are older than X days

#### Hints

X can be anything. For example, remove builds that are older than 3 days. Just make sure that you don't simply remove all the builds (since that's different from the objective).
