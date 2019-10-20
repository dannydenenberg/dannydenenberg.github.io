---
title: Taking the derivative of sigmoid
permalink: sigmoid-deriv
---

A comprehensive walk-through of taking the derivative of the sigmoid function.

One of the most frequently used activation functions in machine learning, or more specifically, neural networks is the sigmoid function. In the backpropagation step in training a neural network, you have to find the derivative of the loss function with respect to each weight in the network. To do this, you have to find the derivative of your activation function. This article aims to clear up any confusion about finding the derivative of the sigmoid function.<!--more-->

<p>To begin, here is the sigmoid function:</p>

<p>$\sigma(x)=\frac{1}{1+e^{-x}}$</p>

<p>For a test, take the sigmoid of 5 on your calculator. You should get 0.99330714907.</p>

<p>For the purposes of the derivative, this function can also be written as:</p>
<p>$\sigma(x)=(1+e^{-x})^{-1}$</p>

<h3 id="first-impressions">First Impressions</h3>

<p>The first thing I noticed about this function, is that it is a composition of functions. The first function being</p><p>$\sigma(x)=(m)^{-1}$</p>

<p>and the second being</p><p>$m=1+e^{-x}$</p><p>Recall that in Calculus, when there is a composition of functions, the derivative, is the first function with respect to the second multiplied by the second function with respect to the variable, in this case <em>x.</em> Like this:</p><p>$\frac{d\sigma}{dx}=\frac{d\sigma}{dm}\frac{dm}{dx}$</p><p>So, the derivative of the sigmoid with respect to <em>x</em> is the derivative of the sigmoid function with respect to <em>m</em> times the derivative of <em>m</em> with respect to <em>x</em>. You can think of this function composition rule as a kind of intermediate computation that results in the original derivative that you wanted by cross cancelation:</p><p>$\frac{d\sigma}{dx}=\frac{d\sigma}{\cancel{dm}}\frac{\cancel{dm}}{dx}=\frac{d\sigma}{dx}$</p><p>Now that we know the sigmoid function is a composition of functions, all we have to do to find the derivative, is:</p><ol><li>Find the derivative of the sigmoid function with respect to <em>m</em>, our intermediate value</li><li>Find the derivative of <em>m</em> with respect to <em>x</em></li><li>Multiply those values together</li></ol>

<h3 id="1-derivative-of-the-sigmoid-with-respect-to-m">1. Derivative of the sigmoid with respect to m</h3>

<p>Let’s look back to what the sigmoid function looks like with <em>m</em> as our intermediate value:</p><p>$\sigma(x)=(m)^{-1}$</p><p>To find the derivative of this with respect to <em>m</em> is fairly simple if we can remember the power rule:</p><p>$\frac{d(x^n)}{dx}=n\times x^{n-1}$</p><blockquote><em>The derivative of </em>x^n<em> is </em>n<em> times the derivative of </em>x<em> to the power of </em>n-1<em>.</em></blockquote><p>So,</p><p>$\frac{d(x^n)}{dx}=-1\times m^{-1-1}=-m^{-2}$</p><p>Now, if we substitute our original value of <em>m</em> back into the equation, we get</p><p>$-m^{-2}=-(1+e^{-x})^{-2}$</p><p>Finally,</p><p>$\frac{d\sigma}{dm}=-(1+e^{-x})^{-2}$</p><p>Yay! We completed step 1.</p>

<h3 id="2-find-the-derivative-of-m-with-respect-to-x">2. Find the derivative of m with respect to x</h3>
<p>Here’s m:</p><p>$m=1+e^{-x}$</p><p>To find the derivative, we have to find the derivative of each term with respect to <em>x. </em>The first term is easy:</p><p>$\frac{d(1)}{dx}=0$</p><p>The second term is a bit more complicated.</p><p>Let’s let</p><p>$y=e^u$</p><p>and</p><p>$u=-x$</p><p>We know that</p><p>$\frac{dy}{du}=e^u     \\      \frac{du}{dx}=-1$</p><p>If getting to <em>e^u </em>is not clear, please read <a href="https://www.themathpage.com/aCalc/exponential.htm">this</a>.</p><p>Now, using the chain rule once again,</p><p>$\frac{dy}{dx}=\frac{dy}{du}\frac{du}{dx}$</p><p>So, we just multiply those derivatives we just calculated to get the derivative with respect to <em>x:</em></p><p>$\frac{dy}{dx}=e^u \times (-1)=-e^u=-e^{-x}$</p><p>All in all for step 2,</p><p>$\frac{dm}{dx}=-e^{-x}$</p>

<h3 id="3-multiply-the-derivatives">3. Multiply the derivatives</h3>
<p>Recall, that once we found the two intermediate derivatives, we had to multiply them. So, here is a quick summary:</p><p>$\frac{d\sigma}{dx}=\frac{d\sigma}{dm}\frac{dm}{dx}$</p><p>$\frac{d\sigma}{dm}=-(1+e^{-x})^{-2}$</p><p>$\frac{dm}{dx}=-e^{-x}$</p><p>Now, if you remember how to multiply :), we can finally finish this!</p><p>$\frac{d\sigma}{dx}=-(1+e^{-x})^{-2} \times -e^{-x}=\frac{e^{-x}}{(1+e^{-x})^2}$</p><p>You can now take this value and use it as the derivation of the sigmoid function. An interesting thing occurs after you manipulate this result, though. It turns out that you can rewrite the derivative like this:</p><p>$\frac{d\sigma}{dx}=\sigma(x)(1-\sigma(x))$</p><p>The derivative of the sigmoid function is the sigmoid times 1 minus the sigmoid. Wow. I feel cheated. :)</p><p>If you even remotely enjoyed this article, keep learning about AI and deep learning! 👍

</p>
