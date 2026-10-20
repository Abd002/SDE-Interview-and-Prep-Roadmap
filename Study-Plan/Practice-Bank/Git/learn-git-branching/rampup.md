# Learn Git Branching: Ramping Up

> Copied from <https://learngitbranching.js.org/> (MIT, by Peter Cottle and contributors; source https://github.com/pcottle/learnGitBranching). Questions and answers are the source's own; nothing was answered or rewritten here.


_The next serving of 100% git awesomes-ness. Hope you're hungry_

## 1. Detach yo' HEAD

#### Moving around in Git

Before we get to some of the more advanced features of Git, it's important to understand different ways to move through the commit tree that represents your project.

Once you're comfortable moving around, your powers with other git commands will be amplified!

#### HEAD

First we have to talk about "HEAD". HEAD is the symbolic name for the currently checked out commit -- it's essentially what commit you're working on top of.

HEAD always points to the most recent commit which is reflected in the working tree. Most git commands which make changes to the working tree will start by changing HEAD.

Normally HEAD points to a branch name (like bugFix). When you commit, the status of bugFix is altered and this change is visible through HEAD.

Let's see this in action. Here we will reveal HEAD before and after a commit.

`git checkout C1; git checkout main; git commit; git checkout C2`

See! HEAD was hiding underneath our `main` branch all along.

##### Detaching HEAD

Detaching HEAD just means attaching it to a commit instead of a branch. This is what it looks like beforehand:

HEAD -> main -> C1


`git checkout C1`

And now it's

HEAD -> C1

To complete this level, let's detach HEAD from `bugFix` and attach it to the commit instead.

Specify this commit by its hash. The hash for each commit is displayed on the circle that represents the commit.

<details><summary>Official hint</summary>

Use the label (hash) on the commit for help!

</details>

<details><summary>Official solution</summary>

```bash
git checkout C4
```

</details>

## 2. Relative Refs (^)

#### Relative Refs

Moving around in Git by specifying commit hashes can get a bit tedious. In the real world you won't have a nice commit tree visualization next to your terminal, so you'll have to use `git log` to see hashes.

Furthermore, hashes are usually a lot longer in the real Git world as well. For instance, the hash of the commit that introduced the previous level is `fed2da64c0efc5293610bdd892f82a58e8cbc5d8`. Doesn't exactly roll off the tongue...

The upside is that Git is smart about hashes. It only requires you to specify enough characters of the hash until it uniquely identifies the commit. So I can type `fed2` instead of the long string above.

Like I said, specifying commits by their hash isn't the most convenient thing ever, which is why Git has relative refs. They are awesome!

With relative refs, you can start somewhere memorable (like the branch `bugFix` or `HEAD`) and work from there.

Relative commits are powerful, but we will introduce two simple ones here:

* Moving upwards one commit at a time with `^`
* Moving upwards a number of times with `~<num>`

Let's look at the Caret (^) operator first. Each time you append that to a ref name, you are telling Git to find the parent of the specified commit.

So saying `main^` is equivalent to "the first parent of `main`".

`main^^` is the grandparent (second-generation ancestor) of `main`

Let's check out the commit above main here.

`git checkout main^`

Boom! Done. Way easier than typing the commit hash.

You can also reference `HEAD` as a relative ref. Let's use that a couple of times to move upwards in the commit tree.

`git checkout C3; git checkout HEAD^; git checkout HEAD^; git checkout HEAD^`

Easy! We can travel backwards in time with `HEAD^`

To complete this level, check out the parent commit of `bugFix`. This will detach `HEAD`.

You can specify the hash if you want, but try using relative refs instead!

<details><summary>Official hint</summary>

Remember the Caret (^) operator!

</details>

<details><summary>Official solution</summary>

```bash
git checkout bugFix^
```

</details>

## 3. Relative Refs #2 (~)

##### The "~" operator

Say you want to move a lot of levels up in the commit tree. It might be tedious to type `^` several times, so Git also has the tilde (~) operator.


The tilde operator (optionally) takes in a trailing number that specifies the number of parents you would like to ascend. Let's see it in action.

Let's specify a number of commits back with `~`.

`git checkout HEAD~4`

Boom! So concise -- relative refs are great.

##### Branch forcing

You're an expert on relative refs now, so let's actually *use* them for something.

One of the most common ways I use relative refs is to move branches around. You can directly reassign a branch to a commit with the `-f` option. So something like:

`git branch -f main HEAD~3`

moves (by force) the main branch to three parents behind HEAD.

*Note: In a real git environment `git branch -f` command is not allowed for your current branch.*

Let's see that previous command in action.

`git branch -f main HEAD~3`

There we go! Relative refs gave us a concise way to refer to `C1` and branch forcing (`-f`) gave us a way to quickly move a branch to that location.

Now that you have seen relative refs and branch forcing in combination, let's use them to solve the next level.

To complete this level, move `HEAD`, `main`, and `bugFix` to their goal destinations shown.

<details><summary>Official hint</summary>

You'll need to use at least one direct reference (hash) to complete this level

</details>

<details><summary>Official solution</summary>

```bash
git branch -f main C6
git checkout HEAD~1
git branch -f bugFix HEAD~1
```

</details>

## 4. Reversing Changes in Git

#### Reversing Changes in Git

There are many ways to reverse changes in Git. And just like committing, reversing changes in Git has both a low-level component (staging individual files or chunks) and a high-level component (how the changes are actually reversed). Our application will focus on the latter.

There are two primary ways to undo changes in Git -- one is using `git reset` and the other is using `git revert`. We will look at each of these in the next dialog

#### Git Reset

`git reset` reverses changes by moving a branch reference backwards in time to an older commit. In this sense you can think of it as "rewriting history;" `git reset` will move a branch backwards as if the commit had never been made in the first place.

Let's see what that looks like:

`git reset HEAD~1`

Nice! Git moved the main branch reference back to `C1`; now our local repository is in a state as if `C2` had never happened.

#### Git Revert

While resetting works great for local branches on your own machine, its method of "rewriting history" doesn't work for remote branches that others are using.

In order to reverse changes and *share* those reversed changes with others, we need to use `git revert`. Let's see it in action.

`git revert HEAD^`

Weird, a new commit was added at the tip of the branch. That's because this new commit `C2'` introduces changes that exactly reverse the changes introduced by `C2`.

With reverting, you can push out your changes to share with others.

To complete this level, reverse the most recent commit on both `local` and `pushed`. You will revert two commits total (one per branch).

Keep in mind that `pushed` is a remote branch and `local` is a local branch -- that should help you choose your methods.

<details><summary>Official hint</summary>

Notice that revert and reset take different arguments.

</details>

<details><summary>Official solution</summary>

```bash
git reset HEAD~1
git checkout pushed
git revert HEAD
```

</details>
