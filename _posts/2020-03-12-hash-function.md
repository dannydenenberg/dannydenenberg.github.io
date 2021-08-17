---
layout: post
title: How hash functions work
permalink: how-hash-functions-work
published: true
---

A hash function is a way to **tell something where to go**.

Here is the function for reference:

!!h(k) \equiv k\ (\textrm{mod}\ m)!!

If you are confused about the $(\textrm{mod}\ m)$ part, I would recommend brushing up on [modular arithmetic](https://en.wikipedia.org/wiki/Modular_arithmetic). It's not bad at all!

Now, back to the function.

Let me define all of the variables for you. $h$ is the return value (think y=x). $k$ is the object, or 'thing' which the function is telling where to go (hence it is the input to the function). And $m$ is the modulus we are working in such that $0 \le h(k) \lt m$, making $h(k)$ the least positive residue of $k$ modulo $m$

Lets say we had some parking lot with 10 spaces.

| Space | Car |
| ----- | --- |
| 0     |
| 1     |
| 2     |
| 3     |
| 4     |
| 5     |
| 6     |
| 7     |
| 8     |
| 9     |

Currently there are no cars in the lot, but if I were to put one into spot 4 and 8, for example, it would look like this:

| Space | Car |
| ----- | --- |
| 0     |
| 1     |
| 2     |
| 3     |
| 4     | 🚙  |
| 5     |
| 6     |
| 7     |
| 8     | 🚖  |
| 9     |

Okay, in this situation, the parking lot owner, Sol, (somehow) knows that he won't ever have more than ten cars in his lot at the same time. Sol also wants to make it easy for people to know where to park and to know where their car is when they need to retrieve it.

Naturally 🙄, Sol uses a hash function to automate this process.

In his hash function, the output $h$ is the space to park in (0-9), $k$ is the license plate number of the car (in this world license plates are strictly numeric), and $m$ is the number of spaces (10)--thus, $h(k)$ will **always** output a number that corresponds to an actual space.

**Let's take Sol's lot out for a spin**. A car 🚍 pulls up with the license plate 20. Using our hash function, $h(k) \equiv k\ (\textrm{mod}\ m)$, we find $h(20)$ to be 0. So, Sol sends the car to space 0.

| Space | Car |
| ----- | --- |
| 0     | 🚍  |
| 1     |
| 2     |
| 3     |
| 4     |
| 5     |
| 6     |
| 7     |
| 8     |
| 9     |

Another car 🚙 with the license plate 478 pulls up. Sol tells him to go to spot 8. And another 🚔 with the plate 87263 goes to spot 3.

| Space | Car |
| ----- | --- |
| 0     | 🚍  |
| 1     |
| 2     |
| 3     | 🚔  |
| 4     |
| 5     |
| 6     |
| 7     |
| 8     | 🚙  |
| 9     |

Now, a car 🚕 pulls up with the license plate #9878. The hash function tells the car to go to space 8, but there is already a car there. This is called a **collision** (when a hash function assigns two different things to the same location).

## Collision resolution

How can Sol find a free spot available to the new car?

Well, if we were working with memory and not parking lots, one way to resolve the issue would be to create a **linked list** in the spot in memory where both cars go and simply search through that list every time a retrieval was needed or add to that list every time an input was needed.

However, we need to find a **free spot** for the car to go to.

Starting with the original hashing function $h_0(k)=h(k)$, we can define a sequence of spaces $h_1(k),h_2(k),....$. We attempt to place the car (or thing) $k$ at location $h_0(k)$. If this location is taken, we move one location up, $h_1(k)$. If this is taken, we move one more up $h_2(k)$, and so on.

The simplest way to represent this 'probing sequence' is like so:

!!h_j(k) \equiv h(k) +j\ (\textrm{mod}\ m), \quad \quad 0 \le h_j(k) \lt m!!

This places the thing $k$ as near as possible to the past location $h(k)$.

This, unfortunately can lead to difficulties, especially with larger possible locations (larger $m$ values). As more common $k$ items begin to get added to memory, the same possible locations are traced out by $h_j(k)$. This not only creates a concept called _clustering_, where many different items are placed right next to each other, it also can be computationally intensive for Sol or his computer to retrace through the same number of spaces each time simply because similar license plates are clustered together.

To avoid clustering, you can use a collision resolution policy called _double hashing_.

Using $0 \le h(k) \lt m$, where $m$ is prime, a second hashing function is derived:

!!g(k) \equiv k +1\ (\textrm{mod}\ m-2), \quad \quad 0 \lt g(k) \le m-2!!

In the above function, $(g(k),m)=1$. Our new probing sequence is thus

!!h_j(k) \equiv h(k) +j \cdot g(k)(\textrm{mod}\ m)!!

$j$ runs through the integers $0,1,2...,m-1$ and all possible locations are traced.

The most reasonable distribution of $g(k)$ values occurs when both $m$ and $m-1$ are prime (twin primes).

In addition to the recommended restrictions on the values of $m$ and $m-1$, m should not be a power of base $b$, where $k$ is represented as $k_b$ ($k$ is a number in base $b$), because $(\textrm{mod}\ m)$ would always return the last couple digits of the number and will cluster as $m$ continues to increase in size.
