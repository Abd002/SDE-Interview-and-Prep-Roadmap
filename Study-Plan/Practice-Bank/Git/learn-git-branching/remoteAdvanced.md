# Learn Git Branching: To Origin And Beyond -- Advanced Git Remotes!

> Copied from <https://learngitbranching.js.org/> (MIT, by Peter Cottle and contributors; source https://github.com/pcottle/learnGitBranching). Questions and answers are the source's own; nothing was answered or rewritten here.


_And you thought being a benevolent dictator would be fun..._

## 1. Push Main!

#### Merging feature branches

Now that you're comfortable with fetching, pulling, and pushing, let's put these skills to the test with a new workflow.

It's common for developers on big projects to do all their work on feature branches (off of `main`) and then integrate that work only once it's ready. This is similar to the previous lesson (where side branches get pushed to the remote), but here we introduce one more step.

Some developers only push and pull when on the `main` branch -- that way `main` always stays updated to what is on the remote (`o/main`).

So for this workflow we combine two things:

* integrating feature branch work onto `main`, and
* pushing and pulling from the remote

Let's see a refresher real quick of how to update `main` and push work.

`git pull --rebase; git push`

We executed two commands here that:

* rebased our work onto new commits from remote, and
* published our work to the remote

This level is pretty hefty -- here is the general outline to solve:

* There are three feature branches -- `side1` `side2` and `side3`
* We want to push each one of these features, in order, to the remote
* The remote has since been updated, so we will need to incorporate that work as well

:O intense! good luck, completing this level is a big step.

<details><summary>Official hint</summary>

Remember you can always use the undo or reset commands

</details>

<details><summary>Official solution</summary>

```bash
git fetch
git rebase o/main side1
git rebase side1 side2
git rebase side2 side3
git rebase side3 main
git push
```

</details>

## 2. Merging with remotes

#### Why not merge?

In order to push new updates to the remote, all you need to do is *incorporate* the latest changes from the remote. That means you can either rebase *or* merge in the remote branch (e.g. `o/main`).

So if you can do either method, why have the lessons focused on rebasing so far? Why is there no love for `merge` when working with remotes?

There's a lot of debate about the tradeoffs between merging and rebasing in the development community. Here are the general pros / cons of rebasing:

Pros:

* Rebasing makes your commit tree look very clean since everything is in a straight line

Cons:

* Rebasing modifies the (apparent) history of the commit tree.

For example, commit `C1` can be rebased *past* `C3`. It then appears that the work for `C1'` came after `C3` when in reality it was completed beforehand.

Some developers love to preserve history and thus prefer merging. Others (like myself) prefer having a clean commit tree and prefer rebasing. It all comes down to preferences :D

For this level, let's try to solve the previous level but with *merging* instead. It may get a bit hairy but it illustrates the point well.

<details><summary>Official hint</summary>

Pay attention to the goal tree!

</details>

<details><summary>Official solution</summary>

```bash
git checkout main
git pull
git merge side1
git merge side2
git merge side3
git push
```

</details>

## 3. Remote Tracking

##### Remote-Tracking branches

One thing that might have seemed "magical" about the last few lessons is that git knew the `main` branch was related to `o/main`. Sure these branches have similar names and it might make logical sense to connect the `main` branch on the remote to the local `main` branch, but this connection is demonstrated clearly in two scenarios:

* During a pull operation, commits are downloaded onto `o/main` and then *merged* into the `main` branch. The implied target of the merge is determined from this connection.
* During a push operation, work from the `main` branch was pushed onto the remote's `main` branch (which was then represented by `o/main` locally). The *destination* of the push is determined from the connection between `main` and `o/main`.

#### Remote tracking

Long story short, this connection between `main` and `o/main` is explained simply by the "remote tracking" property of branches. The `main` branch is set to track `o/main` -- this means there is an implied merge target and implied push destination for the `main` branch.

You may be wondering how this property got set on the `main` branch when you didn't run any commands to specify it. Well, when you clone a repository with git, this property is actually set for you automatically. 

During a clone, git creates a remote branch for every branch on the remote (aka branches like `o/main`). It then creates a local branch that tracks the currently active branch on the remote, which is `main` in most cases.

Once git clone is complete, you only have one local branch (so you aren't overwhelmed) but you can see all the different branches on the remote (if you happen to be very curious). It's the best of both worlds!

This also explains why you may see the following command output when cloning:

    local branch "main" set to track remote branch "o/main"

##### Can I specify this myself?

Yes you can! You can make any arbitrary branch track `o/main`, and if you do so, that branch will have the same implied push destination and merge target as `main`. This means you can run `git push` on a branch named `totallyNotMain` and have your work pushed to the `main` branch on the remote!

There are two ways to set this property. The first is to checkout a new branch by using a remote branch as the specified ref. Running

`git checkout -b totallyNotMain o/main`

Creates a new branch named `totallyNotMain` and sets it to track `o/main`.

Enough talking, let's see a demonstration! We will checkout a new branch named `foo` and set it to track `main` on the remote.

`git checkout -b foo o/main; git pull`

As you can see, we used the implied merge target of `o/main` to update the `foo` branch. Note how main doesn't get updated!!

This also applies for git push.

`git checkout -b foo o/main; git commit; git push`

Boom. We pushed our work to the `main` on the remote even though our branch was named something totally different.

##### Way #2

Another way to set remote tracking on a branch is to simply use the `git branch -u` option. Running

`git branch -u o/main foo`

will set the `foo` branch to track `o/main`. If `foo` is currently checked out you can even leave it off:

`git branch -u o/main`

Let's see this other way of specifying remote tracking real quick...

`git branch -u o/main foo; git commit; git push`

Same as before, just a more explicit command. Sweet!

Ok! For this level let's push work onto the `main` branch on remote while *not* checked out on `main` locally. You should instead create a branch named `side` which the goal diagram will show.

<details><summary>Official hint</summary>

Remember there are two ways to set remote tracking!

</details>

<details><summary>Official solution</summary>

```bash
git checkout -b side o/main
git commit
git pull --rebase
git push
```

</details>

## 4. Git push arguments

#### Push arguments

Great! Now that you know about remote tracking branches we can start to uncover some of the mystery behind how git push, fetch, and pull work. We're going to tackle one command at a time but the concepts between them are very similar.

First we'll look at `git push`. You learned in the remote tracking lesson that git figured out the remote *and* the branch to push to by looking at the properties of the currently checked out branch (the remote that it "tracks"). This is the behavior with no arguments specified, but git push can optionally take arguments in the form of:

`git push <remote> <place>`

What is a `<place>` parameter you say? We'll dive into the specifics soon, but first an example. Issuing the command:

`git push origin main`

translates to this in English:

*Go to the branch named "main" in my repository, grab all the commits, and then go to the branch "main" on the remote named "origin". Place whatever commits are missing on that branch and then tell me when you're done.*

By specifying `main` as the "place" argument, we told git where the commits will *come from* and where the commits *will go*. It's essentially the "place" or "location" to synchronize between the two repositories.

Keep in mind that since we told git everything it needs to know (by specifying both arguments), it totally ignores where we are checked out!

Let's see an example of specifying the arguments. Note the location where we are checked out in this example.

`git checkout C0; git push origin main`

There we go! `main` got updated on the remote since we specified those arguments.

What if we hadn't specified the arguments? What would happen?

`git checkout C0; git push`

The command fails (as you can see), since `HEAD` is not checked out on a remote-tracking branch.

Ok, for this level let's update both `foo` and `main` on the remote. The twist is that `git checkout` is disabled for this level!

*Note: The remote branches are labeled with `o/` prefixes because the full `origin/` label does not fit in our UI. Don't worry 
about this... simply use `origin` as the name of the remote like normal.*

<details><summary>Official hint</summary>

You can always look at the last slide of the dialog with "objective"

</details>

<details><summary>Official solution</summary>

```bash
git push origin main
git push origin foo
```

</details>

## 5. Git push arguments -- Expanded!

#### `<place>` argument details

Remember from the previous lesson that when we specified `main` as the place argument for git push, we specified both the *source* of where the commits would come from and the *destination* of where the commits would go.

You might then be wondering -- what if we wanted the source and destination to be different? What if you wanted to push commits from the `foo` branch locally onto the `bar` branch on remote?

Well unfortunately that's impossible in git... just kidding! Of course it's possible :)... git has tons and tons of flexibility (almost too much).

Let's see how in the next slide...

In order to specify both the source and the destination of `<place>`, simply join the two together with a colon:

`git push origin <source>:<destination>`

This is commonly referred to as a colon refspec. Refspec is just a fancy name for a location that git can figure out (like the branch `foo` or even just `HEAD~1`).

Once you are specifying both the source and destination independently, you can get quite fancy and precise with remote commands. Let's see a demo!

Remember, `source` is any location that git will understand:

`git push origin foo^:main`

Woah! That's a pretty trippy command but it makes sense -- git resolved `foo^` into a location, uploaded whatever commits that weren't present yet on the remote, and then updated destination.

What if the destination you want to push doesn't exist? No problem! Just give a branch name and git will create the branch on the remote for you.

`git push origin main:newBranch`

Sweet, that's pretty slick :D

For this level, try to get to the end goal state shown in the visualization, and remember the format of:

`<source>:<destination>`

<details><summary>Official hint</summary>

Remember you can admit defeat and type in "show solution" :P

</details>

<details><summary>Official solution</summary>

```bash
git push origin main^:foo
git push origin foo:main
```

</details>

## 6. Fetch arguments

#### Git fetch arguments

So we've just learned all about git push arguments, this cool `<place>` parameter, and even colon refspecs (`<source>:<destination>`). Can we use all this knowledge for `git fetch` as well?

You betcha! The arguments for `git fetch` are actually *very, very* similar to those for `git push`. It's the same type of concepts but just applied in the opposite direction (since now you are downloading commits rather than uploading).

Let's go over the concepts one at a time...

##### The `<place>` parameter

If you specify a place with git fetch like in the following command:

`git fetch origin foo`

Git will go to the `foo` branch on the remote, grab all the commits that aren't present locally, and then plop them down onto the `o/foo` branch locally.

Let's see this in action (just as a refresher).

By specifying a place...

`git fetch origin foo`

We download only the commits from `foo` and place them on `o/foo`.

You might be wondering -- why did git plop those commits onto the `o/foo` remote branch rather than just plopping them onto my local `foo` branch? I thought the `<place>` parameter is a place that exists both locally and on the remote?

Well git makes a special exception in this case because you might have work on the `foo` branch that you don't want to mess up!! This ties into the earlier lesson on `git fetch` -- it doesn't update your local non-remote branches, it only downloads the commits (so you can inspect / merge them later).

"Well in that case, what happens if I explicitly define both the source and destination with `<source>:<destination>`?"

If you feel passionate enough to fetch commits *directly* onto a local branch, then yes you can specify that with a colon refspec. You can't fetch commits onto a branch that is checked out, but otherwise git will allow this.

Here is the only catch though -- `<source>` is now a place on the *remote* and `<destination>` is a *local* place to put those commits. It's the exact opposite of git push, and that makes sense since we are transferring data in the opposite direction!

That being said, developers rarely do this in practice. I'm introducing it mainly as a way to conceptualize how `fetch` and `push` are quite similar, just in opposite directions.

Let's see this craziness in action:

`git fetch origin C2:bar`

Wow! See, git resolved `C2` as a place on the origin and then downloaded those commits to `bar` (which was a local branch).

What if the destination doesn't exist before I run the command? Let's see the last slide but without `bar` existing beforehand.

`git fetch origin C2:bar`

See, it's JUST like git push. Git made the destination locally before fetching, just like git will make the destination on remote before pushing (if it doesn't exist).

No args?

If `git fetch` receives no arguments, it just downloads all the commits from the remote onto all the remote branches...

`git fetch`

Pretty simple, but worth going over just once.

Ok, enough talking! To finish this level, fetch just the specified commits in the goal visualization. Get fancy with those commands!

You will have to specify the source and destination for both fetch commands. Pay attention to the goal visualization since the IDs may be switched around!

<details><summary>Official hint</summary>

Pay attention how the commit ids may have swapped! You can read slides again with "help level"

</details>

<details><summary>Official solution</summary>

```bash
git fetch origin c3:foo
git fetch origin c6:main
git checkout foo
git merge main
```

</details>

## 7. Source of nothing

##### Oddities of `<source>`

Git abuses the `<source>` parameter in two weird ways. These two abuses come from the fact that you can technically specify "nothing" as a valid `source` for both git push and git fetch. The way you specify nothing is via an empty argument:

* `git push origin :side`
* `git fetch origin :bugFix`

Let's see what these do...

What does pushing "nothing" to a remote branch do? It deletes it!

`git push origin :foo`

There, we successfully deleted the `foo` branch on remote by pushing the concept of "nothing" to it. That kinda makes sense...

Finally, fetching "nothing" to a place locally actually makes a new branch.

`git fetch origin :bar`

Very odd / bizarre, but whatever. That's git for you!

This is a quick level -- just delete one remote branch and create a new branch with `git fetch` to finish!

<details><summary>Official hint</summary>

The branch command is disabled for this level so you'll have to use fetch!

</details>

<details><summary>Official solution</summary>

```bash
git push origin :foo
git fetch origin :bar
```

</details>

## 8. Pull arguments

#### Git pull arguments

Now that you know pretty much *everything* there is to know about arguments for `git fetch` and `git push`, there's almost really nothing left to cover for git pull :)

That's because git pull at the end of the day is *really* just shorthand for a fetch followed by merging in whatever was just fetched. You can think of it as running git fetch with the *same* arguments specified and then merging in *where* those commits ended up.

This applies even when you use crazy-complicated arguments as well. Let's see some examples:

Here are some equivalent commands in git:

`git pull  origin foo` is equal to:

`git fetch origin foo; git merge o/foo`

And...

`git pull  origin bar:bugFix` is equal to:

`git fetch origin bar:bugFix; git merge bugFix`

See? git pull is really just shorthand for fetch + merge, and all git pull cares about is where the commits ended up (the `destination` argument that it figures out during fetch).

Lets see a demo:

If we specify the place to fetch, everything happens as before with fetch but we merge in whatever was just fetched.

`git pull origin main`

See! by specifying `main` we downloaded commits onto `o/main` just as normal. Then we merged `o/main` to our currently checked out location which is *not* the local branch `main`. For this reason it can actually make sense to run git pull multiple times (with the same args) from different locations in order to update multiple branches.

Does it work with source and destination too? You bet! Let's see that:

`git pull origin main:foo`

Wow, that's a TON in one command. We created a new branch locally named `foo`, downloaded commits from remote's main onto that branch `foo`, and then merged that branch into our currently checked out branch `bar`. It's over 9000!!!

Ok to finish up, attain the state of the goal visualization. You'll need to download some commits, make some new branches, and merge those branches into other branches, but it shouldn't take many commands :P

<details><summary>Official hint</summary>

Remember that you can create new local branches with fetch/pull arguments

</details>

<details><summary>Official solution</summary>

```bash
git pull origin c3:foo
git pull origin c2:side
```

</details>
