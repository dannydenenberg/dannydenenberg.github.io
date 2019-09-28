---
layout: post
title: Univariate Linear Regression
permalink: univariate-linear-regression
---

# Univariate Linear Regression & ML Intro

In machine learning, there are two main algorithms to get your computer to act smart: __supervised__ and __unsupervised__ learning. 

In _supervised learning_, the computer is given data about the subject usually being inputs and outputs. The most common use of supervised learning is to classify objects. For example, I might give my computer a set of pictures of dogs and I want it to output 0 for Pekingese, 1 for Golden Retriever, and 2 for German Shepherd. To train this computer to recognize the dogs, I would give it millions of dog pictures with their respective numbers attached to each image. The computer would then learn, by the use of some ML algorithm, to associate <!--more-->pixel patterns with a certain breed of dog.

In _unsupervised learning_, the computer is given data that has no labels. An unsupervised learning algorithm has to find structure in structureless data. The most common tasks within unsupervised learning are clustering, representation learning, and density estimation. The following picture depicts the idea of __clustering__ in which the computer takes images of cartoons and _clusters_ them into their respective cartoon styles. 

![](https://i.snap.as/kbFXNqR.png)

 ---

Just an FYI, linear regression is a __supervised learning__ algorithm. Because of this, I will give some information about how some of the features of this algorithm will be represented mathematically.

In supervised learning and linear regression, you are always given a "training set" to teach ML algorithm how to classify new data.

Here are some variables and what they mean in context of training samples:

$m=$ number of training examples
$x=$ "input" variable/feature
$y=$ "output" variable/target
$(x,y)=$ one training sample (input, output)
$(x^i,y^i)=$ $i^{th}$ traning sample

DON'T WORRY (if you are worrying)! This will all make tons more sense in a bit.

Here is an example of how these variables can be used.

Let's say that you want to teach the computer to guess a house's price based on its size. Well, you would first have to give the algorithm a set of training samples that contain many different houses sizes and prices. Because we want to _give_ the computer a size and have it guess the price, the _size_ is the input and the _price_ is the output. Or, in math words, the _size_ is $x$ (input) and the _price_ is $y$ (output). Here is an example of what the training data would look like (please note that in reality, there would have to be many many more training samples to get accurate results):

| $i$ (training sample) | $x$ (size)    | $y$ (price)     |
|-----|--------|----------|
| $1$ | $1240$ | $145000$ |
| $2$ | $370$  | $68000$  |
| $3$ | $1130$ | $115000$ |
| $4$ | $860$  | $50000$  |
| $5$ | $1420$ | $137000$ |

Now let's match some variables to this data set. 

$m=5$ because there are $5$ training samples (denoted by $i$)
$x^3=1130$ because it is the 3rd row size 
$(x^4, y^4)=(860,50000)$ because it is the fourth row x and y values

Hopefully, that clears up some complexities with the math representations.

## Linear Regression

In _linear regression_, we use a training set to come up with an algorithm that creates a function "$h$" that maps $x$ to $y$. In the housing prices example, we need to use that data to come up with a function that maps the size of houses to their price ($x$ to $y$, inputs to outputs). 

The function that we are trying to develop looks like this:
$$ 
h \_\theta (x) = \theta \_0 + \theta \_1 x
$$

This should look fairly familiar, right? Doesn't it resemble a line in slope-intercept form? 

$$y=mx+b$$

That is because, linear regression is essentially the algorithm for finding the line of best fit for a set of data. Using the house data above, the graph below depicts the plotted training samples and the function (dotted line) that linear regression would produce for the data.

![](https://i.snap.as/fCXCxQ5.png)

Let's take a look at that representation of the function:

$$ 
h \_\theta (x) = \theta \_0 + \theta \_1 x
$$

The algorithm finds the values for $\theta \_ 0$ and $\theta \_ 1$ that best fit the inputs and output given to the algorithm. This is called _univariate_ linear regression because the $\theta$ parameters only go up to 1. The univariate linear regression algorithm is much simpler than the one for _multivariate_. The function that _multivariate_ linear regression produces, looks like this:

$$
h \_\theta (x\_1, x\_2, x\_3, ..., x\_n) = \theta \_0 + \theta \_1 x\_1 +\theta \_2 x\_2 +\theta \_3 x\_3 + ... + \theta \_n x\_n
$$

I plan to write an article on multivariate linear regression soon-ish.

This next piece of math I will show you is a way to find the average of the difference between the predicted values/outputs and the actual values/outputs. Given a numbers for $\theta \_0$ and $\theta \_1$ each, this function will essentially show us, how "wrong" the function ($h(x)$) is. Another way to say this is how bad of values were chosen for $\theta \_0$ and $\theta \_1$. Here is the expression:

$$
\frac{1}{2m} \sum \_{i=1} ^m (h \_\theta (x^i) - y^i)^2
$$

Let's break this down.

$m=$ # of training examples
$h \_\theta (x^i)=$ the predicted value. Remember, $h(x)$ is the function the algorithm is developing (the line of best fit), so the return value from that function is a "prediction".
$y^i=$ actual sample output.

__Here is the goal for this expression__: Find the numbers $\theta \_0$ and $\theta \_1$ such that the average of the sum of the predicted value ($h(x)$) minus the actual value is minimized (as small as possible).

This expression is called, the "cost function". It defines how much error their is in the parameter values we chose. The one defined above is known as the "squared error function". It is the most commonly used cost function for linear regression problems. Cost functions are typically denoted using $J$ as the name of the function.

## Univariate Linear Regression Review

<span style="text-decoration:underline">Hypothesis</span>
$$ 
h \_\theta (x) = \theta \_0 + \theta \_1 x
$$

<span style="text-decoration:underline">Parameters</span>
$$\theta \_0,\theta \_1$$

<span style="text-decoration:underline">Cost Function</span>
$$
J(\theta \_0,\theta \_1)=\frac{1}{2m} \sum \_{i=1} ^m (h \_\theta (x^i) - y^i)^2
$$

<span align="center" style="text-decoration:underline">Goal</span>

Minimize $J(\theta \_0,\theta \_1)$ by choosing the optimal values for $\theta \_0,\theta \_1$. This way, when a new $X$ value is inputed into the function $h(x)$, the returned value $Y$ will hopefully be an accurate pair to the inputed variable.

---

Please note that the cost function $J(\theta \_0,\theta \_1)$ for two variables can be visualized in a 3d plane looking something like this:

![](https://i.snap.as/0xJXBp8.png)

It looks like a mountain range! 

The hight of the mountain from 0 at any given point represents the squared error. The areas in the depiction that are high up represent parameter values that cause the squared error to be high. Likewise, valleys represent optimal parameter values because they make the squared error small in value.

Now that you know the function and parameters we are trying to optimize ($h(x)$) and the cost function that tells us how "wrong" we are (how much error there is), it is time to learn exactly HOW to optimize these parameters $\theta \_0$ and $\theta \_1$ such that the cost function is minimal (as close as possible to 0). The main algorithm to optimize these parameters and minimize the cost function result is called __Gradient Descent__ . If you look once more at the image above, the valleys are the parameter values that gradient descent finds. It can be compared to rolling a ball down a hill and the place where is comes to rest holds the optimal parameter values.

Well, that pretty much wraps this article up!

WAIT! Did you say you DID want to learn how the hell [gradient descent for linear regression works?!](https://write.as/dannydenenberg/gradient-descent-for-univariate-linear-regression)


