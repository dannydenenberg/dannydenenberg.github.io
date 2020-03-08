---
title: Securing your database
permalink: securing-db
layout: post
---

[Here](https://github.com/dannydenenberg/mongodb-users) is a link to all of the source code WITH authentication and hashing.

This article assumes knowledge of NodeJS, Express.js, MongoDB, and how all of those technologies interact programmatically. I wrote a [great article](https://denenberg.us/creating-and-connecting-a-mongodb-database-and-node-js-server-to-a-front-end) on that topic as well.

Let's start by taking a look at some code for a MongoDB database connection through Node.js and ExpressJS.<!--more-->

<iframe width="100%" height="300" src="//jsfiddle.net/denenberg/8da5kL1t/1/embedded/js/dark" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

It achieves the central goal for that article which was to be able to connect a front end to a Mongo database. It does this by allowing requests to be sent to a server which has the functionality to read, write, and update the database.

Well, now there is a new issue – we have users that each have their own unique information, but ANYONE who sends a get request to the server with a username of some user can acquire their information! That is SUPER unsafe. To combat this, most websites have a password field for each user (as I'm sure you know) which is kept private. This combination of public and private "keys" is a nice way for users to be able to connect with each other using their public usernames, but keep their info secure with a strong password.

Let's implement this in our NodeJS program by first adding a `pass` field to each user holding their unique password. This doesn't change any code so far on the server side, but let's use this idea to create a new user called `deb` with the password `1234` (I am using JavaScript to send the request to our server – make sure the server is running on port `4567`):

<iframe width="100%" height="300" src="//jsfiddle.net/denenberg/8da5kL1t/12/embedded/js/dark" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

Okay, to make sure the `fetch()` request worked, look at the data inside of your MongoDB cluster collections in Atlas.

Great. The user has a password, but we can still send a get request and get the information without using a password. To password-protect the user info, every time a get request is sent, a password should be sent along with it. The server will then compare the password sent in the get request with the password stored in the database associated with the user the get request was sent for. If they are equivalent, the server will send back the user information. Otherwise, it will send back some sort of an error code for the wrong password.

In short, in the express server's response to get requests, it should check that the sent password is correct before allowing the request to access the user's information.

To send a password along with the get request, we will use simple HTTP url request parameters. The GET request will look like this:

```
http://localhost:4567/username?pass=mypassword1
```

**One thing to note** is how to get the query parameters in Express.js (Node.js): `req.query.myparam`. Or, in our specific case, `req.query.pass` gives the password sent.

Here is some example code of how the request URL parameters can be used in a program (this is just the get request part). It will print out the password to the console when a get request is made with the `/user` and `?pass=__ fields`.

```javascript
app.get("/:user", (req, res) => {
  console.log(`Password: ${req.query.pass}`);
});
```

To test this, run the Node server. In the browser go to `localhost:4567/dan?pass=abc`. Switch back to the console and you should see the password printed there.

Now that we have URL parameters working, we need to not send back the user data in the response unless the password is correct. To do this, within the get request, we will get the password associated with the `/user`. If that is the same as the URL `pass` parameter, we send back the info on the user.

<iframe width="100%" height="300" src="//jsfiddle.net/denenberg/8da5kL1t/10/embedded/js/dark" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

To test this out, restart your server with updated code. Go to `localhost:4567/deb?pass=1234` in your browser. You should recieve deb's user id, etc. Try typing a different password and you will get the error message.

Okay, nice! You have now password protected all get requests to recieve data. There are, however, a couple of issues with this method, one of which is the fact that if your database is compromised, you will have leaked a piece of very sensitive information that users have trusted you with: their password (which is likely being reused on different sites). This is why, instead of being stored as they are, passwords are typically **hashed** using a _one way_ function.

The following section will go more in depth into hashing, why it is important, and how to use it to **securely** store data.

---

Hashing algorithms are one way functions. They take any string and turn it into a fixed-length "fingerprint" that is unable to be reversed. This means that if the data is compromised, the onlooker cannot get the user's passwords if they were hashed. At no point were they ever stored on the drive without being in their hashed form.

Websites using hashing typically have this workflow:

1. User creates an account
2. Their password is hashed and stored on the base
3. When the user attempts to log in, the hash of their entered password is compared to the has stored in the database
4. If the hashes match, the user can access the account. If not, a **generic** error message is sent back such as "Entered invalid credentials" so hackers can't trace the error to the username or password specifically.

```
hash("hello") = 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824
hash("hellu") = 3937f988aeb57b6fd75b9c71bf17b9658ec97823bab613df438389b0c896b724
hash("danny") = 668e2b73ac556a2f051304702da290160b29bad3392ddcc72074fefbee80c55a
```

**NOTE:** Only secure, or **cryptographic hash functions**, can be used for password hashing (SHA256, SHA512, RipeMD, WHIRLPOOL, etc.)

Sadly, just cryptographically hashing passwords does not ensure safety.

## Cracking Hashes

### Brute Force and Dictionary Attacks

The easiest way to decrypt a hash is just to guess the password. The way to do this is to guess the user password, hash the guess, and compare it to the hash of the actual password you are trying to solve. If the two hashes match, the unhashed version of the guess is the right password.

A **brute force** attack goes through every possible combination of characters given a certain length. Even though they will 100% _eventually_ crack any given password, it is difficult to use this method because of how computationally expensive it is. Some passwords that are even fairly short in length can take thousands of years (literally) to crack using brute force.

```
Trying aaa : failed
Trying aab : failed
Trying aac : failed
...
Trying acb : failed
Trying acc : success!
```

**Dictionary attacks** use a file containing commonly used words, phrases, or passwords that are likely to be a used password. There are [databases you can find](https://en.wikipedia.org/wiki/Wikipedia:10,000_most_common_passwords) that hold the top 100,000 (or however many) most commonly used passwords. The attack hashes these passwords and compares the hash to the password to crack. For cracking the average Joe Shmo, this is sometimes a good method to use and is certainly faster than using a brute force attack.

**Lookup tables** can improve cracking performance by pre-computing the hashes so when it comes time to guess the password, the program needs not spend compute time actually hashing the guesses.

In the next section, we will take a look at "salting" which makes these cracking methods impossible to use reliably.

## Salting

The reason lookup tables, dictionary attacks, and brute force attacks can work is because the passwords are hashed the same way each time. We can randomize the hash by prepending or appending a random string called a _salt_ to the passwords BEFORE hashing.

```
hash("hello") = 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824
hash("hello" + "jHjdbJShdiodb") = 6f7f167a978166ee23b32c9531ce5dc23ae8fc26e412045858d938d11470831f
```

The salt doesn't have to be secret because an attacker doesn't know what the salt will be and thus cannot make pre computed tables for it.

## The Dos and Don'ts of Salting

Don't:

- Reuse the same salt for each password hashed
- Use short salts
- Use wierd double hashes (ex: hash(hash(hash('mypass')))) in lou of a salt

Do:

- Generate random salts using a **Cryptographically Secure Pseudo-Random Number Generator** (CSPRNG)
- Generate a new random unique salt for _EACH_ password hashed
- Generate LONG salts

## Salting Workflow

Storing a Password:

1. Generate super long salt with a CSPRNG
2. Prepend the salt to the user password and hash it
3. Save the salt and the hash in the database

Checking a Password:

1. Get the salt and hash from the database
2. Prepend the salt to the submitted password and hash it
3. Compare the hashes. If they are equal, the password is correct

**NOTE:** Always always always hash on the server. Sometimes JavaScript isn't enabled. Also, no one else can access the server so it is ensured to be hashed (You can _also_ hash on the client side if you so choose)

And with that, you have learned the basics of securely hashing data. Now let's continue on with the (not-as-hashy parts of the) article.

## Our Hash Function

We will be using the SHA256 hashing function. How, exactly, hashing functions work is beyond the scope of this article, but if you are interested, see [this](https://en.wikipedia.org/wiki/Hash_function) and [this](https://gfredericks.com/blog/98).

First of all, install the dependency for our function: `npm i -s crypto`. Also, add the import to the top of the NodeJS file: `const crypto = require("crypto");`

Now add this code to the bottom of the NodeJS file. We will call the function `hash`.

```javascript
// hashes strings with sha256 for storing passwords
function hash(pwd) {
  return crypto
    .createHash("sha256")
    .update(pwd)
    .digest("base64");
}
```

## The Plan

There are 3 more feature we need to implement before I can call the database "secure".

1. Hash & salt passcodes for new users being stored in response to `post` requests
2. Use the salt to hash and check the passwords when a `get` request needs info
3. Use the salt to check passwords for updating info on the database in response to `put` requests.

Alrighty, let's get started!

## POST Request Security

Passwords need to be hashed and salted before being stored in the database.

Before I can give you the code, you have to install the dependency for generating Cryptographically Secure Pseudo-Random passwords. We will use a library called 'csprng'. Install it: `npm i -s csprng`. Also, add the import in the top of the NodeJS file: `const csprng = require('csprng');`

Here is the _well commented_ code for the server's response to POST requests. It uses the `hash()` function defined earlier.

**NOTE:** The user password is sent as the `pass` field in the body of the request (contrary to how it was sent before).

<iframe width="100%" height="300" src="//jsfiddle.net/denenberg/8da5kL1t/8/embedded/js/dark" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

## GET Request Security

Now to check if an entered passcode is correct, we have to get the stored salt and use that to hash the entered passcode to check against the stored one.

Here is the code for the GET request response.

<iframe width="100%" height="300" src="//jsfiddle.net/denenberg/8da5kL1t/5/embedded/js/dark" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

## PUT Request Security

When updating info in the database, like the GET request, a password must be submitted to make sure the user is the right person to update his data. Also like the GET request, we need to use the stored salt associated with the user to hash the entered password for hashing.

<iframe width="100%" height="300" src="//jsfiddle.net/denenberg/8da5kL1t/6/embedded/js/dark" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

**Congrats for getting through this article!! 🎉🥳**

Although I used a MongoDB database for storage and NodeJS for the server, the concepts covered here are applicable in ANY technology you may choose.

Have fun with your database!
