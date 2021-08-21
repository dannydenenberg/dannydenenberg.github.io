---
layout: post
title: My favorite way of telling if a number is odd or even
published: true
---

My uncle (a CS guy) once gave me an interesting puzzle: write a function to tell if a number is even or odd without using the modulus operator (e.g. "%").

At that time he had just given me ["Let's Talk Lisp"](https://images-na.ssl-images-amazon.com/images/I/31prZs8fkaL._SY298_BO1,204,203,200_.jpg), a book about the programming language [Lisp](https://en.wikipedia.org/wiki/Lisp_(programming_language)) and about recursive thinking in general.

Thus, my answer to his question was this:

```lisp
(defun odd (n) 
  (cond ((= n 1) t) ;; if n is 1
         (t (even (- n 1))))) ;; otherwise call even(n-1)

(defun even (n) 
  (cond ((= n 1) nil) ;; if n is 1, it's NOT even
         (t (odd (- n 1))))) ;; otherwise call odd(n-1)
```

Or, if TypeScript/JavaScript works better for you:

```typescript
function odd(n: number): boolean {
  if (n == 1) return true;
  return even(n - 1);
}

function even(n: number): boolean {
  if (n == 1) return false;
  return odd(n - 1);
}
```

Try it! If you call `odd(3)` it recursively bounces the function from one to the other and spits out `true`. Same with `even(4)` and `odd(9)` and `even(48938)`.

Kinda cool, thanks [Larry](http://larry.denenberg.com).