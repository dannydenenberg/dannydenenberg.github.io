---
#layout: post
title: "How to contribute on GitHub"
permalink: contributing
layout: post
---

This guide assumes that you have a [Github](https://github.com/) account and [git installed](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) on your machine.

## Step 1: Fork

After you find a repo that looks cool, the first step is to fork it. A fork will create a copy of the repo under your account that you can modify, while maintaining a link to original (that's called the upstream repo).

![Forking](/assets/forking.png)

## Step 2: Clone

Now let's download the code to your local machine by cloning the fork.

```
git clone <your-fork-url.git>
```

You should now have a directory for your project that can be opened with your [preferred code editor](https://code.visualstudio.com/).

## Step 3: Branch

A git repo is just a big tree 🌳. You might have hundreds of people working on the same project and branches ensure that collaboration can happen without complete chaos. Changes on your branch are isolated from the work everybody else is doing.

```
git checkout -b my-cool-thing
```

At this point you can start making changes to the code.

## Step 4: Commit

When you are happy with the changes, you can stage the changes and commit the code.

```
git add .
git commit -m "🚀 I made this software better!"
```

## Step 5: Pull Request

A "pull request" is identical to a "git merge", but it is requested from an external source - you. In fact, it is called a "merge request" on other platforms, which I think is a better name, but I digress.

Let's push your branch to your fork.

```
git push origin my-cool-thing
```

When you go back to Github you should automatically see a button labeled **Create New Pull Request for my-cool-thing**. Go ahead and push that button. Add additional details as needed and it will show up in the list of PRs once submitted.

Many larger projects have their own "Contributor Guidelines" and may require you to sign a [CLA](https://en.wikipedia.org/wiki/Contributor_License_Agreement) before participating.
