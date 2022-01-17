---
layout: post
title: Getting up and running with Flask and VENV
published: true
---

> Get started creating Flask apps with Python3 and venv.

This article assumes that you have python3 installed on your computer. If you don't already, please visit [https://www.python.org/downloads/](https://www.python.org/downloads/).

### Installing Flask

To begin, let's get our work enviorment set up.

We will be working inside a folder, so start by creating one and moving inside it:

```
$ mkdir my_project
$ cd my_project
```

Now, inside this folder, we want to create a 'virtual enviornment'. A virtual enviornment or 'venv' is a way to install packages and run programs without effecting the computer's files outside of a single folder. This way, we can also keep closer track of our dependencies (or libraries) and their versions. 

There are two steps needed to start working in a virtual enviornment in python.

**Step #1**: Create the enviornment folders

```
$ python3 -m venv venv
```

**Step #2**: Activate the enviornment 

```
$ . venv/bin/activate
```

After you have activated the enviornment, notice how your shell looks a bit different. It has, prefixed to the prompt, this string: "(venv)". This tells you that you are operating in the virtual enviornment. The packages we install will now be 'recorded' in the virtual enviornment *and only be accessible in that enviornment* as well.

Now, we can install Flask.

```
$ pip install Flask
```



