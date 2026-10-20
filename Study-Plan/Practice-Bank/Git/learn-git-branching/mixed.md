# Learn Git Branching: A Mixed Bag

> Copied from <https://learngitbranching.js.org/> (MIT, by Peter Cottle and contributors; source https://github.com/pcottle/learnGitBranching). Questions and answers are the source's own; nothing was answered or rewritten here.


_A mixed bag of Git techniques, tricks, and tips_

## 1. Grabbing Just 1 Commit

#### Locally stacked commits

Here's a development situation that often happens: I'm trying to track down a bug but it is quite elusive. In order to aid in my detective work, I put in a few debug commands and a few print statements.

All of these debugging / print statements are in their own commits. Finally I track down the bug, fix it, and rejoice!

Only problem is that I now need to get my `bugFix` back into the `main` branch. If I simply fast-forwarded `main`, then `main` would get all my debug statements which is undesirable. There has to be another way...

We need to tell git to copy only one of the commits over. This is just like the levels earlier on moving work around -- we can use the same commands:

* `git rebase -i`
* `git cherry-pick`

To achieve this goal.

This is a later level so we will leave it up to you to decide which command you want to use, but in order to complete the level, make sure `main` receives the commit that `bugFix` references.

<details><summary>Official hint</summary>

Remember, interactive rebase or cherry-pick is your friend here

</details>

<details><summary>Official solution</summary>

```bash
git rebase -i main --solution-ordering C4
git rebase bugFix main
```

</details>

## 2. Juggling Commits

#### Juggling Commits

Here's another situation that happens quite commonly. You have some changes (`newImage`) and another set of changes (`caption`) that are related, so they are stacked on top of each other in your repository (aka one after another).

The tricky thing is that sometimes you need to make a small modification to an earlier commit. In this case, design wants us to change the dimensions of `newImage` slightly, even though that commit is way back in our history!!

We will overcome this difficulty by doing the following:

* We will re-order the commits so the one we want to change is on top with `git rebase -i`
* We will `git commit --amend` to make the slight modification
* Then we will re-order the commits back to how they were previously with `git rebase -i`
* Finally, we will move main to this updated part of the tree to finish the level (via the method of your choosing)

There are many ways to accomplish this overall goal (I see you eye-ing cherry-pick), and we will see more of them later, but for now let's focus on this technique.
Lastly, pay attention to the goal state here -- since we move the commits twice, they both get an apostrophe appended. One more apostrophe is added for the commit we amend, which gives us the final form of the tree 

That being said, I can compare levels now based on structure and relative apostrophe differences. As long as your tree's `main` branch has the same structure and relative apostrophe differences, I'll give full credit.

<details><summary>Official hint</summary>

The first command is git rebase -i HEAD~2

</details>

<details><summary>Official solution</summary>

```bash
git rebase -i HEAD~2 --solution-ordering C3,C2
git commit --amend
git rebase -i HEAD~2 --solution-ordering C2'',C3'
git rebase caption main
```

</details>

## 3. Juggling Commits #2

#### Juggling Commits #2

*If you haven't completed Juggling Commits #1 (the previous level), please do so before continuing*

As you saw in the last level, we used `rebase -i` to reorder the commits. Once the commit we wanted to change was on top, we could easily --amend it and re-order back to our preferred order.

The only issue here is that there is a lot of reordering going on, which can introduce rebase conflicts. Let's look at another method with `git cherry-pick`.

Remember that git cherry-pick will plop down a commit from anywhere in the tree onto HEAD (as long as that commit isn't an ancestor of HEAD).

Here's a small refresher demo:

`git cherry-pick C2`

Nice! Let's move on.

So in this level, let's accomplish the same objective of amending `C2` once but avoid using `rebase -i`. I'll leave it up to you to figure it out! :D

Remember, the exact number of apostrophe's (') on the commit are not important, only the relative differences. For example, I will give credit to a tree that matches the goal tree but has one extra apostrophe everywhere.

<details><summary>Official hint</summary>

Don't forget to forward main to the updated changes!

</details>

<details><summary>Official solution</summary>

```bash
git checkout main
git cherry-pick C2
git commit --amend
git cherry-pick C3
```

</details>

## 4. Git Tags

#### Git Tags

As you have learned from previous lessons, branches are easy to move around and often refer to different commits as work is completed on them. Branches are easily mutated, often temporary, and always changing.

If that's the case, you may be wondering if there's a way to *permanently* mark historical points in your project's history. For things like major releases and big merges, is there any way to mark these commits with something more permanent than a branch?

You bet there is! Git tags support this exact use case -- they (somewhat) permanently mark certain commits as "milestones" that you can then reference like a branch.

More importantly though, they never move as more commits are created. You can't "check out" a tag and then complete work on that tag -- tags exist as anchors in the commit tree that designate certain spots.

Let's see what tags look like in practice.

Let's try making a tag at `C1` which is our version 1 prototype.

`git tag v1 C1`

There! Quite easy. We named the tag `v1` and referenced the commit `C1` explicitly. If you leave the commit off, git will just use whatever `HEAD` is at.

For this level just create the tags in the goal visualization and then check `v1` out. Notice how you go into detached `HEAD` state -- this is because you can't commit directly onto the `v1` tag.

In the next level we'll examine a more interesting use case for tags.

<details><summary>Official hint</summary>

you can either check out the commit directly or simply checkout the tag!

</details>

<details><summary>Official solution</summary>

```bash
git tag v1 side~1
git tag v0 main~2
git checkout v1
```

</details>

## 5. Git Describe

##### Git Describe

Because tags serve as such great "anchors" in the codebase, git has a command to *describe* where you are relative to the closest "anchor" (aka tag). And that command is called `git describe`!

Git describe can help you get your bearings after you've moved many commits backwards or forwards in history; this can happen after you've completed a git bisect (a debugging search) or when sitting down at the computer of a coworker who just got back from vacation.

Git describe takes the form of:

`git describe <ref>`

Where `<ref>` is anything git can resolve into a commit. If you don't specify a ref, git just uses where you're checked out right now (`HEAD`).

The output of the command looks like:

`<tag>-<numCommits>-g<hash>`

Where `tag` is the closest ancestor tag in history, `numCommits` is how many commits away that tag is, and `<hash>` is the hash of the commit being described.

Let's look at a quick example. For this tree below:

`git tag v2 C3`

The command `git describe main` would output:

`v1-2-gC2`

Whereas `git describe side` would output:

`v2-1-gC4`

That's pretty much all there is to git describe! Try describing a few of the locations in this level to get a feel for the command.

Once you're ready, just go ahead and commit once to finish the level. We're giving you a freebie :P

<details><summary>Official hint</summary>

Just commit once on bugFix when you're ready to move on

</details>

<details><summary>Official solution</summary>

```bash
git commit
```

</details>
