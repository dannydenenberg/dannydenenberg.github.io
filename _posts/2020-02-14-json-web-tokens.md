---
title: JSON Web Tokens in Express.js
permalink: jwt
---

This article is written on the applications of [JSON Web Tokens](https://jwt.io/) in a server-client relationship using Node.js and plain JavaScript. If you want to learn about the concepts behind JWT, I could not recommend [Mariano Calandra's Medium post](https://medium.com/swlh/why-do-we-need-the-json-web-token-jwt-in-the-modern-web-8490a7284482) more.

To install JSON Web Tokens in your project, run:

```bash
$ yarn add jsonwebtoken
```

And import it into your files like so:

```ts
const jwt = require("jsonwebtoken");
```

### Authenticating a token

There are many ways to go about implementing a JWT authentication system in an [Express.js](https://expressjs.com/) application. What suites me best, though, it to utilize Express' middleware functionality. How it works is when a request is made to a specific route, you can have the `(req, res)` variables sent to an intermediary function before the one specified in the `app.get((req, res) => {})`.

The piece of middleware is simply a function that takes parameters of `(req, res, next)`. The `req` is the sent request ([get, post, delete, use, etc.](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol)), the `res` is the response that can be sent back to the user in a multitude of ways (res.sendStatus(200), res.json(), etc), and `next` is a function that can be called to move the execution past the piece of middleware and into the actual `app.get` server response.

Here is the middleware function I wrote for my auth needs:

```js
function authenticateToken(req, res, next) {
  // Gather the jwt access token from the request header
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401) // if there isn't any token

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: any, user: any) => {
    console.log(err)
    if (err) return res.sendStatus(403)
    req.user = user
    next() // pass the execution off to whatever request the client intended
  })
}
```

An example request would look something like this:

```
GET https://mysite:4000/api/userOrders
Authorization: Bearer JWT_ACCESS_TOKEN
```

And, an example of a request that would use that piece of middleware would look like this:

```js
...
app.get('/api/userOrders', authenticateToken, (req, res) => {
  // executes after authenticateToken
  ...
})
...
```

### Generating a token

Backtracking slightly, we will now discuss how to actually generate and send a jwt token to the client.

To accomplish this (this being signing a token), you need to have 3 pieces of information:

1. The token secret
2. The piece of data to hash in the token
3. The token expire time

The **token secret** is simply a super long, super random string used to encrypt and decrypt the data. To generate this secret, I recommend using Node's `crypto` lib, like so:

```js
> require('crypto').randomBytes(64).toString('hex')
// '09f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611'
```

Now store this secret in the your project's .env file:

```bash
ACCESS_TOKEN_SECRET=7bc78545b1a3923cc1e1e19523fd5c3f20b409509...
```

To bring this token into a Node file and to use it, you have to use 'dotenv':

```js
const dotenv = require("dotenv");

// get config vars
dotenv.config();

// access config var
process.env.ACCESS_TOKEN_SECRET;
```

The **piece of data** that you hash in your token can be something as simple as a user ID or username, all the way up to a much more complex JS object. In either case, it should be an _identifier_ for a _specific user_.

The **token expire time** is a string, such as '1800s' that details how long until the token will be invalid.

So, here is my function for signing tokens:

```js
// username is in the form {username: "my cool username"}
function generateAccessToken(username) {
   // expires after half and hour (1800 seconds = 30 minutes)
  return jwt.sign(username, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '1800s' });
}
```

This can be sent back from a request to sign in or log in a user.

```js
app.post('/api/creteNewUser', (req, res) => {
  ...
  const token = generateAccessToken({ username: req.body.username });
  res.json(token);
  ...
});
```

### Client side token handling

When the client receives the token, they should store it in a cookie like so:

```js
...
// get token from fetch request
const token = await res.json(); 

// set token in cookie
document.cookie = `token=${token}` 
...
```

It that simple!

I will also put below some utility functions for retrieving and setting tokens in cookies effectively and using cookie expires times.

```js
// create a new cookie
function setCookie(cname, cvalue, exdays = 2000) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

// get the value of a cookie with a certain name
function getCookie(cname: string) {
  var name = cname + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
```
