# Learn Git Branching: Introduction Sequence

> Copied from <https://learngitbranching.js.org/> (MIT, by Peter Cottle and contributors; source https://github.com/pcottle/learnGitBranching). Questions and answers are the source's own; nothing was answered or rewritten here.


_A nicely paced introduction to the majority of git commands_

## 1. Introduction to Git Commits

#### Git Commits
A commit in a git repository records a snapshot of all the (tracked) files in your directory. It's like a giant copy and paste, but even better!

Git wants to keep commits as lightweight as possible though, so it doesn't just blindly copy the entire directory every time you commit. It can (when possible) compress a commit as a set of changes, or a "delta", from one version of the repository to the next.

Git also maintains a history of which commits were made when. That's why most commits have ancestor commits above them -- we designate this with arrows in our visualization. Maintaining history is great for everyone working on the project!

It's a lot to take in, but for now you can think of commits as snapshots of the project. Commits are very lightweight and switching between them is wicked fast!

Let's see what this looks like in practice. On the right we have a visualization of a (small) git repository. There are two commits right now -- the first initial commit, `C0`, and one commit after that `C1` that might have some meaningful changes.

Hit the button below to make a new commit.

`git commit`

There we go! Awesome. We just made changes to the repository and saved them as a commit. The commit we just made has a parent, `C1`, which references which commit it was based off of.

Go ahead and try it out on your own! After this window closes, make two commits to complete the level.

<details><summary>Official hint</summary>

Just type in 'git commit' twice to finish!

</details>

<details><summary>Official solution</summary>

```bash
git commit
git commit
```

</details>

## 2. Branching in Git

#### Git Branches

Branches in Git are incredibly lightweight as well. They are simply pointers to a specific commit -- nothing more. This is why many Git enthusiasts chant the mantra:

```
branch early, and branch often
```

Because there is no storage / memory overhead with making many branches, it's easier to logically divide up your work than have big beefy branches.

When we start mixing branches and commits, we will see how these two features combine. For now though, just remember that a branch essentially says "I want to include the work of this commit and all parent commits."

Let's see what branches look like in practice.

Here we will create a new branch named `newImage`.

`git branch newImage`

There, that's all there is to branching! The branch `newImage` now refers to commit `C1`.

Let's try to put some work on this new branch. Hit the button below.

`git commit`

Oh no! The `main` branch moved but the `newImage` branch didn't! That's because we weren't "on" the new branch, which is why the asterisk (*) was on `main`.

Let's tell git we want to checkout the branch with

```
git checkout <name>
```

This will put us on the new branch before committing our changes.

`git checkout newImage; git commit`

There we go! Our changes were recorded on the new branch.

*Note: In Git version 2.23, a new command called `git switch` was introduced to eventually replace `git checkout`, 
which is somewhat overloaded (it does a bunch of different things depending on the arguments). The lessons here will still use 
`checkout` instead of `switch` because the `switch` command is still considered experimental and the syntax may change in the future. 
However you can still try out the new `switch` command in this application, and also 
<a href="https://git-scm.com/docs/git-switch" target="_blank">learn more here</a>.*

Ok! You are all ready to get branching. Once this window closes,
make a new branch named `bugFix` and switch to that branch.

By the way, here's a shortcut: if you want to create a new 
branch AND check it out at the same time, you can simply 
type `git checkout -b [yourbranchname]`.

<details><summary>Official hint</summary>

Make a new branch with "git branch <branch-name>" and check it out with "git checkout <branch-name>"

</details>

<details><summary>Official solution</summary>

```bash
git branch bugFix
git checkout bugFix
```

</details>

## 3. Merging in Git

#### Branches and Merging

Great! We now know how to commit and branch. Now we need to learn some kind of way of combining the work from two different branches together. This will allow us to branch off, develop a new feature, and then combine it back in.

The first method to combine work that we will examine is `git merge`. Merging in Git creates a special commit that has two unique parents. A commit with two parents essentially means "I want to include all the work from this parent over here and this one over here, *and* the set of all their parents."

It's easier with visuals, let's check it out in the next view.

Here we have two branches; each has one commit that's unique. This means that neither branch includes the entire set of "work" in the repository that we have done. Let's fix that with merge.

We will `merge` the branch `bugFix` into `main`.

`git merge bugFix`

Woah! See that? First of all, `main` now points to a commit that has two parents. If you follow the arrows up the commit tree from `main`, you will hit every commit along the way to the root. This means that `main` contains all the work in the repository now.

Also, see how the colors of the commits changed? To help with learning, I have included some color coordination. Each branch has a unique color. Each commit turns a color that is the blended combination of all the branches that contain that commit.

So here we see that the `main` branch color is blended into all the commits, but the `bugFix` color is not. Let's fix that...

Let's merge `main` into `bugFix`:

`git checkout bugFix; git merge main`

Since `bugFix` was an ancestor of `main`, git didn't have to do any work; it simply just moved `bugFix` to the same commit `main` was attached to.

Now all the commits are the same color, which means each branch contains all the work in the repository! Woohoo!

To complete this level, do the following steps:

* Make a new branch called `bugFix`
* Checkout the `bugFix` branch with `git checkout bugFix`
* Commit once
* Go back to `main` with `git checkout`
* Commit another time
* Merge the branch `bugFix` into `main` with `git merge`

*Remember, you can always re-display this dialog with "objective"!*

<details><summary>Official hint</summary>

Remember to commit in the order specified (bugFix before main)

</details>

<details><summary>Official solution</summary>

```bash
git checkout -b bugFix
git commit
git checkout main
git commit
git merge bugFix
```

</details>

## 4. Rebase Introduction

#### Git Rebase

The second way of combining work between branches is *rebasing.* Rebasing essentially takes a set of commits, "copies" them, and plops them down somewhere else.

While this sounds confusing, the advantage of rebasing is that it can be used to make a nice linear sequence of commits. The commit log / history of the repository will be a lot cleaner if only rebasing is allowed.

Let's see it in action...

Here we have two branches yet again; note that the bugFix branch is currently selected (note the asterisk)

We would like to move our work from bugFix directly onto the work from main. That way it would look like these two features were developed sequentially, when in reality they were developed in parallel.

Let's do that with the `git rebase` command.

`git rebase main`

Awesome! Now the work from our bugFix branch is stacked "on top of main", since it points to main. In our visualization though, it's shown below main since our commit trees flow downwards.

Note that the commit C3 still exists somewhere (it has a faded appearance in the tree), and C3' is the "copy" that we rebased onto main.

The only problem is that main hasn't been updated either, let's do that now...

Now we are checked out on the `main` branch. Let's go ahead and rebase onto `bugFix`...

`git rebase bugFix`

There! Since `main` was an ancestor of `bugFix`, git simply moved the `main` branch reference forward in history.

To complete this level, do the following

* Checkout a new branch named `bugFix`
* Commit once
* Go back to main and commit again
* Check out bugFix again and rebase onto main

Good luck!

<details><summary>Official hint</summary>

Make sure you commit from bugFix first

</details>

<details><summary>Official solution</summary>

```bash
git checkout -b bugFix
git commit
git checkout main
git commit
git checkout bugFix
git rebase main
```

</details>
