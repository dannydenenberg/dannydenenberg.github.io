---
layout: post
title: Hey, end-to-end encryption really isn't that hard
permalink: end-to-end-nodejs
published: true
---

End-to-end encryption (**E2EE**) is "system of communication"[^1] in which anyone, save the client, cannot read plaintext[^d] versions of pieces of data. This is usually a measure taken by some chat or email service to prevent internet service providers or other unauthorized people from reading the plaintext versions of texts sent by users. Not even the server of the application has access to the key to decrypt messages and thus, all messages are stored on the database in encrypted form. 

> Basically, **E2EE** is a way to make sure the the only person reading messages is __the user__.

### First off, theoretical implementation

How would the structure of our E2EE chat[^2] app look? 

Well, an app like this will have three basic components to it: a front end, a server (back end), and a database. 

The **front end** displays to the user the login screen, the chat application features, and any other things in our app the user interacts with.

The **server** will receive all incoming messages, update the pages of all users in the chat with the new message (typically by emitting a new [socket](https://socket.io/) event), and store texts on the database. 

In our case, let's say that each separate chat will have a unique password associated with it. To enter the specific "chat room"[^3], all a user must do is supply the correct password to that room.

Now, for what our app must have to ensure **E2EE**.

**How are texts ENcrypted?** BEFORE being sent to the server, a text will be encrypted using the plaintext password for the unique chat room.

**How are texts DEcrypted?** Once the server sends the encrypted chat to a user, that user decrypts the message using the same key, the plaintext password.

The idea is that the password will be sent to the server in a hashed form and the messages will be sent in an encrypted form to prevent the server from even being able to decrypt the message using the password. This is because the password that the server has isn't the one that was used to encrypt the message, it is the hashed version. The message was encrypted using the **NON**-hashed version of the password (plaintext).

The **database** will store the hashed password and encrypted versions of texts ONLY. To tell if a password is correct, the client sends the hashed version of the password the user entered and compares it to the hashed version of the password stored in the database. If they match, the password entered by the user is correct[^a].

---

### Practical example in node.js
Now for the fun part 🎉.

The library for encrypting messages that I would recommend is [CryptoJS](https://github.com/brix/crypto-js). For quick use on the client side of things, I would simply use it's CDN (import the javascript of the library from another URL) and place the `script` tag in the head of my HTML page:

```html
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js"></script>
```

Then, I create two functions. One to encrypt data and one to decrypt data. It's simply a nice way to contain all of the library code into a separate helper function as to not mess up the rest of my code files with too much repetition (although I am weary to not over-engineer 🙄).

```js
function encrypt(message, key) {
  return CryptoJS.AES.encrypt(message, key).toString();
}

function decrypt(message, key) {
  return CryptoJS.AES.decrypt(message, key).toString(
    CryptoJS.enc.Utf8
  );
}

```

If you're interested in learning more about the [Advanced Encryption Standard](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard) (AES) that I'm using to encrypt messages, please click on [the link](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard). Otherwise, if you're like me, just continue knowing that it's safe to use.

Take a second to make sure the functions work:

```js
encrypt("hey", "k") // "U2FsdGVkX1/8cqiEoDGEdqilkazwgE98NucTZzFlDIo="
decrypt("U2FsdGVkX1/8cqiEoDGEdqilkazwgE98NucTZzFlDIo=", "k") // "hey"
```

Let's run through a quick example.

If you want to check that your helper functions work, simply use the property that `decrypt(encrypt(x)) = x`. In this example, the **message** will be `hey` and the **key** will be `secret`:

```js
decrypt(encrypt("hey","secret"),"secret") // "hey"
```

In other words, you are decrypting a message with the *same* key used to encrypt it. It works behind the same principles that $arccos(cos(x))=x$ is based on.

**Okay, back to what's going on systematically.**

Any passwords going to the server will be hashed BEFORE being sent, so I also usually develop yet another helper function for the purpose of clean, contained code:

```js
function hash(p) {
  return CryptoJS.SHA512(p).toString(CryptoJS.enc.Base64);
}
```

Take another second to check that this works too:

```js
hash("password")
// "sQnzu7wkTrgkQZF+0G1hi5AI3Qmzvv0bXgc5THBqi7mAsdd4Xll27ASbRt9fEyavWi6m0QP9B8lThf+rDKy8hg=="
```

> If a new chat room, account, or what-have-you is created, the password MUST be hashed **BEFORE** being sent to the server to ensure a secure E2EE standard. 

**So, what's the sequence of a user sending a new message like?**

1. User signs in and is authenticated as an authorized user.
2. User clicks "send" on their message.
3. The message text is encrypted with the key being the **plaintext** password to the chat room.
4. The message is sent to the server.
5. The server updates all users connected to the chat by sending them the ENCRYPTED message.
6. The users connect to the chat receive this new message and, because they are authenticated, use the key (being the plaintext password stored on their computers) to decrypt and show the message in *its* plaintext form.


All in all, E2EE isn't brain surgery. It's a relatively simple concept to grasp but has some very interesting consequences such as nearly unbreakable security. 

However, if you're thinking about implementing this in your own application, I would consider these **few drawbacks**: 

- Because the text stored on the database is encrypted, any server-side searching through text, text analysis, machine learning on text is impossible.
- If you are worried about content on your site, you cannot repress illegal or unacceptable content
- Targeted ads are harder to implement 

Anyway, take it as you will, it's a super cool topic with many many helpful applications that can lead to increased consumer privacy.

Have fun with E2EE!



---

### Footnotes

[^1]: Direct from [Wikipedia](https://en.wikipedia.org/wiki/End-to-end_encryption) (for lack of better terminology)

[^d]: Whenever I use the word **plaintext**, I am referring to the human readable form of the text. Like, the actual thing.

[^2]: Just using a chat app as an example. By the end of the post, it'll be clear how E2EE can be applied to your other fun projects 🎉!

[^3]: This will be our name for a group chat that anyone can enter with the password.

[^a]: Why? Because the hash of a string is always the same as another hash of the same string. Thus, the only time the hashes would differ would be if the plaintext passwords differed. 