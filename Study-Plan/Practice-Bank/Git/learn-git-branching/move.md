# Learn Git Branching: Moving and Staging Work

> Copied from <https://learngitbranching.js.org/> (MIT, by Peter Cottle and contributors; source https://github.com/pcottle/learnGitBranching). Questions and answers are the source's own; nothing was answered or rewritten here.


_Move commits around and choose exactly which file changes belong together_

## 1. Cherry-pick Intro

#### Moving Work Around

So far we've covered the basics of git -- committing, branching, and moving around in the source tree. Just these concepts are enough to leverage 90% of the power of git repositories and cover the main needs of developers.

That remaining 10%, however, can be quite useful during complex workflows (or when you've gotten yourself into a bind). The next concept we're going to cover is "moving work around" -- in other words, it's a way for developers to say "I want this work here and that work there" in precise, eloquent, flexible ways.

This may seem like a lot, but it's a simple concept.

#### Git Cherry-pick

The first command in this series is called `git cherry-pick`. It takes on the following form:

* `git cherry-pick <Commit1> <Commit2> <...>`

It's a very straightforward way of saying that you would like to copy a series of commits below your current location (`HEAD`). I personally love `cherry-pick` because there is very little magic involved and it's easy to understand.

Let's see a demo!

Here's a repository where we have some work in branch `side` that we want to copy to `main`. This could be accomplished through a rebase (which we have already learned), but let's see how cherry-pick performs.

`git cherry-pick C2 C4`

That's it! We wanted commits `C2` and `C4` and git plopped them down right below us. Simple as that!

To complete this level, simply copy some work from the three branches shown into main. You can see which commits we want by looking at the goal visualization.

<details><summary>Official hint</summary>

git cherry-pick followed by commit names!

</details>

<details><summary>Official solution</summary>

```bash
git cherry-pick C3 C4 C7
```

</details>

## 2. Interactive Rebase Intro

#### Git Interactive Rebase

Git cherry-pick is great when you know which commits you want (_and_ you know their corresponding hashes) -- it's hard to beat the simplicity it provides.

But what about the situation where you don't know what commits you want? Thankfully git has you covered there as well! We can use interactive rebasing for this -- it's the best way to review a series of commits you're about to rebase.

Let's dive into the details...

All interactive rebase means is that Git is using the `rebase` command with the `-i` option.

If you include this option, git will open up a UI to show you which commits are about to be copied below the target of the rebase. It also shows their commit hashes and messages, which is great for getting a bearing on what's what.

For "real" git, the UI window means opening up a file in a text editor like `vim`. For our purposes, I've built a small dialog window that behaves the same way.

When the interactive rebase dialog opens, you have the ability to do two things in our educational application:

* You can reorder commits simply by changing their order in the UI (via dragging and dropping with the mouse).
* You can choose to keep all commits or drop specific ones. When the dialog opens, each commit is set to be included by the `pick` button next to it being active. To drop a commit, toggle off its `pick` button.

*It is worth mentioning that in the real git interactive rebase you can do many more things like squashing (combining) commits, amending commit messages, and even editing the commits themselves. For our purposes though we will focus on these two operations above.*

Great! Let's see an example.

When you hit the button, an interactive rebase window will appear. Reorder some commits around (or feel free to unpick some) and see the result!

`git rebase -i HEAD~4 --aboveAll`

Boom! Git copied down commits in the exact same way you specified through the UI.

To finish this level, do an interactive rebase and achieve the order shown in the goal visualization. Remember you can always `undo` or `reset` to fix mistakes :D

<details><summary>Official hint</summary>

you can use either branches or relative refs (HEAD~) to specify the rebase target

</details>

<details><summary>Official solution</summary>

```bash
git rebase -i overHere --solution-ordering C3,C5,C4
```

</details>

## 3. The Staging Area

#### The Staging Area

So far in this learning experience, we have glossed over the idea of what exactly is involved in actually *making* a commit. You might know that they represent changes to a set of files, but there's actually a bit of process in choosing *which* file changes become *which* commits.

Git doesn't want to just automatically include all changed files in all commits -- that would be bad! It could include a change you don't want to make permanent, or even something secret like an API key that could leak into GitHub as part of your commit history.

Thus before a change to a file becomes part of a commit, it has to be specifically selected. Git has three zones for this: your **working directory** (where you edit), the **staging area** (a loading dock for what is in the next commit), and the **repository** (your permanent history).

You pick *exactly* what rides along in each commit with `git add`. That's how commits stay tidy, and you're never forced to commit everything at once.

*(For these levels, we will now show which files are part of what commits.)*

Run `git status` any time to see where things stand. Right now it shows two files you've edited but haven't staged:

```
Changes not staged for commit:
```
```
  modified:   app.js
```
```
  modified:   styles.css
```

Stage a single file with `git add app.js`, or grab everything at once with `git add .`. Once a file is staged, `git commit` seals it into a snapshot.

Got files you never want to commit, like secrets, logs, or build junk? List them in a `.gitignore` file and git will quietly leave them alone.

Your turn! Stage and commit your work **one file at a time**, so each commit stays focused:

* `git add app.js`, then `git commit`
* `git add styles.css`, then `git commit`

The filenames beside each goal commit show exactly where each change belongs. Two clean commits and the level is yours.

<details><summary>Official hint</summary>

Stage a file with `git add <file>`, then snapshot it with `git commit`. Do that twice, once per file.

</details>

<details><summary>Official solution</summary>

```bash
git add app.js
git commit
git add styles.css
git commit
```

</details>

## 4. Undoing with git restore

#### Undoing with `git restore`

Everybody makes a little mess sometimes. You stage a file you didn't mean to, or start an experiment you'd rather throw away. `git restore` is the modern, purpose-built undo button for your working directory and staging area.

It comes in two flavors:

* `git restore --staged <file>`: **unstage** a file (move it back out of the staging area, keeping your edits)
* `git restore <file>`: **discard** your edits to a file entirely (careful, this throws the changes away!)

*(These replace the older `git reset HEAD <file>` and `git checkout -- <file>` tricks. Same idea, much clearer names.)*

Here's the mess on your desk right now:

```
Changes to be committed:
```
```
  modified:   app.js
```
```
  modified:   secret.env
```

```
Changes not staged for commit:
  modified:   experiment.js
```

You want to commit `app.js`, but `secret.env` got staged early by accident (it should be a commit on top), so lets save that for later. Also the `experiment.js` changes did not work so lets throw that out entirely.

Tidy up, then commit:

* Unstage the secret: `git restore --staged secret.env`
* Discard the experiment: `git restore experiment.js`
* Commit what's left: `git commit`

That lands one clean commit, with only the work you meant to keep.

<details><summary>Official hint</summary>

Unstage with `git restore --staged secret.env`, throw away the experiment with `git restore experiment.js`, then `git commit`.

</details>

<details><summary>Official solution</summary>

```bash
git restore --staged secret.env
git restore experiment.js
git commit
```

</details>
