---
layout: post
title: Strings in go (and what the heck utf-8 is)
---

> What's the f\*&@\$%∂ heck is up with strings in go??

Here's the clarification you need.

### Unicode and utf-8

Around 1960, [ASCII](https://en.wikipedia.org/wiki/ASCII), the American Standard Code for Information Interchange was released. It uses 7 bits to represent 2^7 or 128 characters. Among these were all english lower and upper case characters, punctuation, the ampersand, numbers, etc. Although this manner of storing textual data seemed to work fine, as computing and the internet began to grow, it was a challenge for other countries, in particular those who didn't use English regularly, to store their native language in files.

The solution to this issue was [Unicode](http://unicode.org/), which collected all of the characters in all of the languages of the world with accented letters, control codes, etc. and assigned each character a number or _Unicode code point_. In go, this number is called a `rune`.

As of March 2020, Unicode version 13 holds over 143,000 characters spanning 154 languages and scripts and symbol sets. In go, each `rune` is essentially an `int32` which is the standard data type for Unicode characters (you can literally write go code like this `var r rune = 1424`).

In memory, it is possible that you could represent a bunch of runes simply as a bunch of int32 values (known as utf-32 or ucs-4). But, often you won't need to have space for the entire 32-bit integer. You certainly won't if all you are dealing with are English characters.

**This is where utf-8 steps in.**

UTF-8 is a "variable-length encoding of Unicode code points as bytes"[^1]. Basically, it uses between 1 and 4 bytes to represent a rune. The most significant bits (also known as high-order bits, having the highest values, positioned on the left side of the number) dictate how many bytes follow. For example a high-order `0` means 7-bit (exactly like ASCII). A high-order `110` means 2 bytes (the second byte will begin with `10`). A high-order `1110` means 3 bytes, `11110` means 4.

```
0xxxxxxx                                | 0-127
110xxxxx 10xxxxxx                       | 128-2047
1110xxxx 10xxxxxx 10xxxxxx              | 2048-65535
11110xxx 10xxxxxx 10xxxxxx 10xxxxxx     | 65536-
```

### Working in go

In go, a string is an "immutable sequence of bytes". Strings in Go are almost always encoded in utf-8 encoding and the `len(s)` function returns the number of **bytes** in a string (not the number of characters). The indexing operator `s[i]` returns the ith _byte_ of `s`.

There is also a substring operator which returns a completely new string starting at the beginning index and ending one less than the end index:

```go
s := "Bathroom"
s[4:len(s)] // "room"
s[4:] // "room"
s[:4] // "Bath"
```

String concatenation can be performed with the `+` operator or with buffers as you will see in a bit.

```go
t := "Airport " + s + "'s aren't very fun."
```

Strings are immutable and thus attempting to reassign a specific byte or character doesn't work.

```go
s[0] = "b" // error on compile: cannot assign to s[0]
```

Coming from another more dynamic language such as python, ruby, or javascript, the immutability of strings might seem like an annoying nuisance, but it makes it super easy for the computer to copy strings. For example, the string `s` and the substring `s[4:]` can share the same underlying memory without worrying about it somehow changing. **No new memory must be allocated**.

### Runes and utf-8

So, as I said before, utf-8 is a variable-length encoding of characters--it takes 1 to 4 bytes to represent each character instead of each being 4. But, this variability **prevents** direct access to the n-th character of a string through indexing. However, go still uses them normally to encode strings because of their sweet advantages such as their compatibility with ASCII, ability to decode left to right, and easy searching for specific runes by just using their bytes.

Recall, the `len` function returns the number of bytes in a string, so it could get a bit confusing in this case:

```go
a := "浴"
len(a) // 3
```

To find the actual rune count in a string, rather than the number of bytes in the string, there are a couple ways of doing this.

```go
n := 0
for i := 0; i < len(a); {
  _, size := utf8.DecodeLastRuneInString(a[i:]) // jump forward
  i += size
  n++
}
n // 1 ✅

n = 0
for range a { // range iterates over runes in string
  n++
}
n // 1 ✅

utf8.RuneCountInString(a) // 1 ✅
```

Converting a `[]rune` to a utf-8 encoded string returns the unicode code points of the string.

```go
a := "浴室"
fmt.Printf("% x\n", a) // e6 b5 b4 e5 ae a4
r := []rune(a)
fmt.Printf("%x\n", r) // [6d74 5ba4]
```

Convert from `[]rune` to `string` using `string(r)`.

### Manipulating strings

The main packages to manipulate strings are `bytes`, `strings`, `strconv`, and `unicode` (some of which you have already seen).

Because of the immutability of strings, it can sometimes be useful to use `bytes.Buffer` which allows you to use a string buffer (a string that can grow as more is added).

```go
var buf bytes.Buffer
buf.WriteByte('a')
buf.WriteString("123abc")

var s string = buf.String()
```

The `strings` package has many useful utility functions. A few I have written below.

```go
func Contains(s, substr string) bool
func Count(s, sep string) int
func Fields(s string) []string
func HasPrefix(s, prefix string) bool
func Index(s, sep string) int
func Join(a []string, sep string) string
```

The `strconv` has functions for converting integer, floating-point, and boolean values into and out of string representations.

```go
a := 432
strconv.Itoa(a) // "432"
strconv.FormatInt(int64(a), 2) // "110110000"
strconv.Atoi("432") // 432
strconv.ParseInt("432", 10, 64) // base 10, up to 64 bits
```

The `unicode` package has functions like `IsDigit`, `IsUpper`, `IsLetter`, `ToUpper`, `ToLower`, `IsLower`, and many more run manipulation functions.

Phew! That was a lot.

---

[^1]: The Go Programming Language, by Donovan and Kernighan
