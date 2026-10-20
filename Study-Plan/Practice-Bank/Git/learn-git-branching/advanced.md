# Learn Git Branching: Advanced Topics

> Copied from <https://learngitbranching.js.org/> (MIT, by Peter Cottle and contributors; source https://github.com/pcottle/learnGitBranching). Questions and answers are the source's own; nothing was answered or rewritten here.


_For the truly brave!_

## 1. Rebasing over 9000 times

##### Rebasing Multiple Branches

Man, we have a lot of branches going on here! Let's rebase all the work from these branches onto main.

Upper management is making this a bit trickier though -- they want the commits to all be in sequential order. So this means that our final tree should have `C7'` at the bottom, `C6'` above that, and so on, all in order.

One handy tip: `git rebase` can take a second argument. `git rebase main bugFix` checks out `bugFix` and rebases it onto `main` in one step -- a shorthand for `git checkout bugFix; git rebase main`.

If you mess up along the way, feel free to use `reset` to start over again. Be sure to check out our solution and see if you can do it in fewer commands!

<details><summary>Official hint</summary>

Remember, the most efficient way might be to only update main at the end...

</details>

<details><summary>Official solution</summary>

```bash
git rebase main bugFix
git rebase bugFix side
git rebase side another
git rebase another main
```

</details>

## 2. Multiple parents

##### Specifying Parents

Like the `~` modifier, the `^` modifier also accepts an optional number after it.

Rather than specifying the number of generations to go back (what `~` takes), the modifier on `^` specifies which parent reference to follow from a merge commit. Remember that merge commits have multiple parents, so the path to choose is ambiguous.

Git will normally follow the "first" parent upwards from a merge commit, but specifying a number with `^` changes this default behavior.

Enough talking, let's see it in action.

Here we have a merge commit. If we checkout `main^` without the modifier, we will follow the first parent after the merge commit. 

(*In our visuals, the first parent is positioned directly above the merge commit.*)

`git checkout main^`

Easy -- this is what we are all used to.

Now let's try specifying the second parent instead...

`git checkout main^2`

See? We followed the other parent upwards.

The `^` and `~` modifiers can make moving around a commit tree very powerful:

`git checkout HEAD~; git checkout HEAD^2; git checkout HEAD~2`

Lightning fast!

Even crazier, these modifiers can be chained together! Check this out:

`git checkout HEAD~^2~2`

The same movement as before, but all in one command.

##### Put it to practice

To complete this level, create a new branch at the specified destination.

Obviously it would be easy to specify the commit directly (with something like `C6`), but I challenge you to use the modifiers we talked about instead!

<details><summary>Official hint</summary>

Use `git branch bugWork` with a target commit to create the missing reference.

</details>

<details><summary>Official solution</summary>

```bash
git branch bugWork main^^2^
```

</details>

## 3. Branch Spaghetti

#### Branch Spaghetti

WOAHHHhhh Nelly! We have quite the goal to reach in this level.

Here we have `main` that is a few commits ahead of branches `one` `two` and `three`. For whatever reason, we need to update these three other branches with modified versions of the last few commits on main.

Branch `one` needs a re-ordering of those commits and an exclusion/drop of `C5`. Branch `two` just needs a pure reordering of the commits, and `three` only needs one commit transferred!

We will let you figure out how to solve this one -- make sure to check out our solution afterwards with `show solution`.

<details><summary>Official hint</summary>

Make sure to do everything in the proper order! Branch one first, then two, then three

</details>

<details><summary>Official solution</summary>

```bash
git checkout one
git cherry-pick C4 C3 C2
git checkout two
git cherry-pick C5 C4 C3 C2
git branch -f three C2
```

</details>
