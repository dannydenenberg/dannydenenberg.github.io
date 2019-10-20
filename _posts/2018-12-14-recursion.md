---
title: Recursive programming ✵
permalink: recursion
---

Let's begin with the definition of recursion: "A function is recursive if it is defined in terms of itself".

Or, in other words, a function is recursive if it calls itself.

The classic math example is the factorial function. The factorial of a number is the product of all whole numbers below it down to 1. This can also be restated as: the factorial of a number is itself multiplied with the factorial of itself minus one. The factorial of 0 is 1. The factorial function is denoted by an exclamation mark.

$0!=1  \\\ n!=n\times (n-1)!$

Here is the factorial function for the first 5 numbers (0, 1, 2, 3, 4):

$
3!=3\times (3-1)!=3\times 2 \\\
2!=2\times (2-1)!=2\times 1 \\\
1!=1\times (1-1)!=1\times 1 \\\
0!=1
$

So, because \\( 0!=1\\):

Recursive function have a **base case** and a **general case**. The base case typically returns a value but _always_ doesn't call the enclosed function. The general case calls the enclosed function (itself). Here is the previously discussed factorial function written in Typescript (so you can see the parameter and return types):

```typescript
function factorial(n: number): number {
  // base case: 0! = 1
  if (n == 0) return 1;

  // general case, uses a call to itself
  return n * factorial(n - 1);
}
```

And here is the factorial function programmed iteratively (with loops), not recursively:

```typescript
function factorial(n: number): number {
  let solution = 1;
  for (let i = n; i > 1; i--) {
    solution *= i;
  }
  return solution;
}
```

Take a minute to go through both programs, find how they differ, and try to figure out how the recursive implementation works (that's how I first got my "Oh! I understand").

For now, we are going to backtrack (no pun intended) and take a look at a super simple function called `countDownFrom`. This function takes a positive integer as the parameter and counts down to 0 (exluding 0). So if you enter `countDownFrom(5)`, it will print:

```
5
4
3
2
1
```

Here is the iterative implementation (Javascript):

```javascript
function countDownFrom(n) {
  for (let i = n; i > 0; i--) {
    console.log(i);
  }
}
```

Pretty simple and straightforeward, right?!
Now let's take a look at the recursive solution:

```javascript
function countDownFrom(n) {
  // base case, if n is 0, end the function call
  if (n == 0) return;

  // general case.
  // print the number and make a call for n-1
  console.log(n);
  return countDownFrom(n - 1);
}
```

To figure out exactly how this function works, we will trace each call using a table. Here is a trace table for the call `countDownFrom(3)`:

| Call Number | Function Call    | Console Output | n = 0 |
| ----------- | ---------------- | -------------- | ----- |
| 1           | countDownFrom(3) | 3              | FALSE |
| 2           | countDownFrom(2) | 2              | FALSE |
| 3           | countDownFrom(1) | 1              | FALSE |
| 4           | countDownFrom(0) |                | TRUE  |

This tracing method also shows us the call stack after the function was executed. The call stack is a [Stack](<https://en.wikipedia.org/wiki/Stack_(abstract_data_type)>) (data structure) that function calls get pushed (added) on to after they are called. Stacks are a list of things that can be _pushed_ to or _popped_ from. A push adds something to the end of the list and a pop takes that last thing off. Picture a stack like a stack of plates. You can put one on top of the other, but you can't just take off the bottom one. You first have to take off the top ones or else the stack will collapse. So, because stacks have LIFO (Last In First Out) priority, the most recent function called will ALWAYS be the first to return a value (returning void/nothing counts as a return). When the functions in a recursive call begin to return values and get popped off of the call stack, it is called unwinding. So, the actual FULL (including unwinding) function trace for `countDownFrom(3)` would be:

| Call Number | Function Call    | Console Output | n = 0 |
| ----------- | ---------------- | -------------- | ----- |
| 1           | countDownFrom(3) | 3              | FALSE |
| 2           | countDownFrom(2) | 2              | FALSE |
| 3           | countDownFrom(1) | 1              | FALSE |
| 4           | countDownFrom(0) |                | TRUE  |
| (3)         | countDownFrom(1) |                | FALSE |
| (2)         | countDownFrom(2) |                | FALSE |
| (1)         | countDownFrom(3) |                | FALSE |

If you are interested, here is the trace table for the call `factorial(4)`:

| Call Number | Function Call | n = 0 | Result            | Return Value |
| ----------- | ------------- | ----- | ----------------- | ------------ |
| 1           | factorial(4)  | FALSE | 4 \* factorial(3) |              |
| 2           | factorial(3)  | FALSE | 3 \* factorial(2) |              |
| 3           | factorial(2)  | FALSE | 2 \* factorial(1) |              |
| 4           | factorial(1)  | FALSE | 1 \* factorial(0) |              |
| 5           | factorial(0)  | TRUE  | 1                 | 1            |
| (4)         | factorial(1)  | FALSE | 1 \* 1            | 1            |
| (3)         | factorial(2)  | FALSE | 2 \* 1            | 2            |
| (2)         | factorial(3)  | FALSE | 3 \* 2            | 6            |
| (3)         | factorial(4)  | FALSE | 4 \* 6            | 24           |

The last 5 rows represent the unwinding (call numbers in parenthesis). Row 5 is when the base case was reached (it returned 1 because the input was 0 and the factorial of 0 is 1).

## An Interesting Example

My uncle gave me an interesting problem one time: "create a function to tell if a number is even or odd without using the modulus operator". I came up with a set of functions that uses recursion to bounce a number back and forth until it reaches zero, then the function it lands on when it is at zero returns true or false (even or odd).

```typescript
function odd(n: number): boolean {
  if (n == 0) return false;
  return even(n - 1);
}

function even(n: number): boolean {
  if (n == 0) return true;
  return odd(n - 1);
}
```

If you call `odd(3)` it will return true. `odd(4)` returns false. `even(3)` returns false. `even(4)` returns true!

It's probably my favorite set of recursive functions because of its simplicity and sheer elegance. Implement it in whatever language you want. It works!

## Benefits and Drawbacks

When figuring out a solution to a math problem that is inherently recursive, the recursive solution is typically the simplest to implement. Recursive solutions are often more elegant and use less code than iterative solutions.

**Note:** ANY, yes ANY recursive program/function can be rewritten iteratively (although it is, at times, more difficult to find than the iterative algorithm).

The main drawback of recursion is its memory usage. It is a memory hog. Because recursion relies on function calls stored on the stack, a recursive solution is limited to an environment's largest possible stack size (how many functions it can hold in RAM). So, before implementing a solution recursively make sure that it will not have to deal with millions of function calls or else a `StackOverflow` error will be thrown. Sometimes you can get around this by implementing a more restrictive and selective base case so that more functions are returned early and get popped off of the stack (and thus out of memory) – but not always.

---

Here is one of **my favorite coding problems** with a nice recursive solution. Please note that it is a more advanced problem that requires several recursive helper functions to solve. **If I were you, I would go through some [Javabat](https://codingbat.com/java) recursive problems before I take a whack at this doozy**. I will include the code after the problem statement.

## Island on an Island

A satellite photograph displays a section of the South Pacific Ocean and various islands. Some islands contain lakes within the island, and some of these lakes have an island in that lake. Write a program to count the number of islands which have an island within that island’s lake. No island will touch the border of the photograph. No island will have more than one lake. No lake will have more than one island.

**Input:** This first line of the file contains two integers indicating the height and width of the map. The next height number of lines contain one row of data for the map represented as characters '~' for water and '\*' for land. No map is larger than 80 x 80.

Your goal is to output the number of islands which are surrounded by water within a bigger island. A square of land is connected to another square if they are adjacent in directions, north, east, south or west. (left, right, up, down)

**Output:** The number of islands contained within an island.

Sample Input:

```
20 30
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
~~~********~~~~~~~********~~~~
~~~~****~~~~~~~~~~**~~*~**~~~~
~~~~*~~~*~~~~~~~~~**~~~~**~~~~
~~~~*~~~*~~~~~~~~~********~~~~
~~~~~~~*~~~~~~~~~~~~~~~~~~~~~~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
~***~~~~~~**********~~~~~~~~~~
~*~*~~~~~~*~~~~~~~~*~~~~~~~~~~
~***~~~~~~*~~****~~*~~~~*****~
~~~~~~~~~~*~~*~~*~~*~~~~*~~~*~
~~******~~*~~~~~~~~*~~~~**~~*~
~~*~~~**~~**********~~~***~~*~
~~*~*~~*~~~~~~~~~~~~~~**~~~~*~
~~*~~~~*~~~~~~*********~~~*~*~
~~*~~***~~~~~~*~~~~~~~~~***~*~
~~*~~*~~~~~~~~***~~~~~~~~~~~*~
~~****~~~~~~~~~~*************~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
```

Sample Output: `3`.

And.....here is the code I used to solve the problem (JavaScript):

<iframe width="100%" height="300" src="//jsfiddle.net/denenberg/5nr6w4mg/embedded/js/dark" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>
