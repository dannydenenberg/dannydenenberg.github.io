---
layout: post
title: Golang presentation tool usage
permalink: golang-present-tool
published: true
---

So, you want to create awesome presentations that look like this?

![](/goods/gopresentpic.png)

First make sure that you have the [Go programming language](https://go.dev/) installed on your system.

On a Mac, it's as easy as `brew install go`.

Next, set your GOPATH and make public the folder where your installed Go binaries will go:

```bash
$ GOPATH="/Users/danny/go" # public go path
$ PATH="$GOPATH/bin:$PATH" # binaries
```

Finally, install (by way of `go get ...`) the present binary to be able to locally run your presentations.

```bash
$ go get -u golang.org/x/tools/cmd/present
```

This command will install in your `$GOPATH/bin` folder, the executable binary that runs the presentations.

To check that the binary is working properly, type `present` as a command into your terminal and it should output something close to `2020/03/11 12:58:42 Open your web browser and visit http://127.0.0.1:3999`

And, if you open your web browser to that specified port (in this case `http://127.0.0.1:3999`), you should see a landing page like so:

![](/goods/presenthomepage.png)

This is a page displaying the brother folders from the one you ran the `present` command in.

Now, create a file in your current folder with the extension `.slide` and put at the top of the file, this information (of course, with your corresponding unique info):

```
Title of document
Subtitle of document
15:04 2 Jan 2006
Tags: foo, bar, baz
<blank line>
Author Name
Job title, Company
joe@example.com
http://url/
@twitter_name
```

**Note** that the date may be written without a time prepended. Also, multiple presenters may be specified, simply separate them by blank lines and then put their corresponding info.

Now, whenever you want to run your presentation, simply run the `present` command in the folder containing your `*.slide` file and select it on the webpage the present command sends you to.

After the specified presenters, each of the slides/sections are put separated by blank lines. Following is an example slide:

```
* Title of slide or section (must have asterisk)

Some Text

** Subsection

- bullets
- more bullets
- a bullet with

*** Sub-subsection

Some More text

  Preformatted text
  is indented (however you like)

Further Text, including invocations like:

.code x.go /^func main/,/^}/
.play y.go
.image image.jpg
.background image.jpg
.iframe http://foo
.link http://foo label
.html file.html
.caption _Gopher_ by [[https://www.instagram.com/reneefrench/][Renée French]]

Again, more text
```

The `.code` function injects source code from a file by injecting them as HTML-escaped `<pre>` blocks.
Any line in the program ending with the four characters `OMIT` is deleted from the source before inclusion. This makes injecting specific code snippets easy like so:

```
.code test.go /START OMIT/,/END OMIT/
```

With some example contents of `test.go`:

```go
coolFunction := boop()
// START OMIT
see_mee := great()
// END OMIT
```

And the slide only gets this:

```go
see_mee := great()
```

The information following a `.image` function can be a file path OR a url.

Parts of the file that begin with a `:` (colon) are presenter notes.

```
* Title of slide

Some Text

: Presenter notes (first paragraph)
: Presenter notes (subsequent paragraph(s))
```

For other cool features and functionality, visit the `present` [package homepage](https://pkg.go.dev/golang.org/x/tools/present?tab=doc).
