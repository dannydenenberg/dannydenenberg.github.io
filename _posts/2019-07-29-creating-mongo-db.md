---
title: Mongo database+nodejs with a front end
permalink: creating-mongodb-nodejs
layout: post
---

> [Here](https://github.com/dannydenenberg/mongodb-users) is a link to all of the Node.js code for both parts (includes authentication and security features) if you want to jump right in (yes, I comment well).

If you are in the situation I was in when I first encountered this problem, you have a working front end (for me, it was a basic todo app) but you need to be able to store user data such as usernames, passwords, _todo list items_, etc.<!--more-->

## All About Databases

When it comes to storing data, luckily, there are many options such as MySQL, NoSQL, GraphQL, public storage on a server, a simple JSON file, or MongoDB.

> Okay, okay, back up. Did you say JSON file on a simple server? Easy! I could set that up with Node.js and express in an hour!

Ummm, let me think about it – No.

> Why not? Why should I use a database?

Well, there are many advantages to using a database over a JSON file or something similar. If you use a cloud hosting option, there is no need to worry about loss of data. Databases are optimized to store, search, and protect data. They will not let unauthorized users to write to your data. Data transactions are **atomic** meaning that either an entire read/write/update operation on a thread occurs, or nothing at all, which prevents corruption of data.

> Okay, fine. I'm convinced. I'll use a database. Which one?

There are many out there currently, but if you're looking for an easy-to-use, high performance, high availability database that could automatically scale in size depending on use, I would recommend MongoDB. MongoDB is a document-based database meaning that it stores data in JSON-like documents so it is super easy to work with data in it if you are already familiar with JavaScript objects or JSON:

![](https://i.snap.as/L2jZ6Yx.png)

MongoDB's query language is also powerful and easy to use. For example, this will find all users with a certain zip code:

```javascript
db.users.find({ "address.zip": "90404" });
```

## Setting Up Mongo

Let's get started setting up the MongoDB database.

To make it simple and easy, we are going to host our database in the cloud using [MongoDB's Atlas](https://www.mongodb.com/cloud/atlas). This takes away the pain of setting up the actual database and helps us with automatic scaling and not worrying about loss of data (like I said before).

1. Go to the MongoDB Atlas website, click "Start Free", and create an account.
2. Once you are inside the dashboard looking page, create a new project (name it anything you want).
3. Make sure you are inside the project (you should see a 'Clusters' tab on the left hand nav bar)
4. Create a new cluster. Leave **Global Cloud Configuration** with its default parameters. For **Cloud Provider & Region** select 'Google Cloud Platform' and for the region, find the one that says 'FREE TIER AVAILABLE' and choose that one (for me, it was Iowa).
5. In the "Cluster Tier" section make sure that **M0 Sandbox** is selected
6. In "Additional Settings" you can leave **Turn on Backups** _unchecked_.
7. In "Cluster Name", name it anything you want.

Nice! You have a working database. Just an FYI, it should take about 7-10 minutes for everything to get initialized and up and running properly.

## Database Access

To actually use a database, you have to have the proper access to the information. Because I am assuming there is just one person using this database, we are going to give one user full admin access to the information.

To do this, click on the tab in the side nav bar called "Database Access". In the upper right hand corner, click "Add New User". For the username and password, enter anything you want, but make sure the password is long and random (you don't want anybody being able to put information into the database other than yourself). For the **User Privileges** select "Read and Write to any database". Click 'Add the User'. Make sure you write down the credentials (username + password) you used for the user!

After you have created a user with read/write privileges, to actually connect to the database, you need to use a **MongoDB URI**. This is the web address for connecting to the data. The URI of a database is like the URL of a webpage. By convention, the MongoDB URI is as follows:

`mongodb://<user>:<password>@<host>:<port>/<databasename>`

For example, mine would be:

`mongodb+srv://danny:secretPassword123@vuecluster5u.gcp.mongodb.net/users`

**NOTE:** The final `/users` is called a collection in MongoDB idiom. It is a collection of documents (database entries).

To get your URI, click on the "Clusters" tab of your project and on your main cluster, click **Connect**. Select 'Connect Your Application'.

![](https://i.snap.as/AN9ygzu.png)

Then on 'Choose your driver version', set the driver to **Node.js** and the version to **2.2.12 or later**.

![](https://i.snap.as/6ikkw2V.png)

Your connection string (URI) should be under the drivers. To get your real working URI, replace the `<password>` with your user password, and the `/test` after the port number with a collection (database) name you want, eg: `/mydb`. There you go! You have your URI. Write it down or copy it in some form because you'll need it in a bit.

## Node.js Skeleton

In this section, we are going to set up the minimum Node.js needed to connect to your database (cluster) using the URI and to read/write to it as well.

To begin, set up a new Node project using npm (create a new directory and run `npm init` inside of it). If you don't already have Node.js installed, please [install it](https://nodejs.org/en/).

After your project is initialized, install the dependencies. For this project, all we are using is [Express.js](https://expressjs.com/) and **CORS**. If you don't already know, express is one of the most popular ways to create servers in Node. To install it, just run `npm i -s express` to install and save express. CORS (**C**ross **O**rigin **R**esource **S**haring) is a safety feature that we need to bypass to be able to access resources out of localhost (where we are running our server from). To install it, run `npm i -s cors`. Now create a new file in the root directory named `app.js` and put this code in it. I commented it heavily so you can understand what is going on:

<iframe width="100%" height="300" src="//jsfiddle.net/denenberg/5nr6w4mg/3/embedded/js/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

After you have read through, the code and know the gist (no pun intended) of what is happening, run the code in `app.js`. If you configured and installed everything correctly, you should see something almost identical to this:

![](https://i.snap.as/ChaGQj5.png)

Then, open a browser and travel to `http://localhost:4567` and you should see "Home sweet home".

![](https://i.snap.as/VEuNLaB.png)

**NOTE:** Opening a web page from a browser makes a `GET` request to a server which is one of the 3 HTTP requests (requests made to a server) we will use for our database:

1. `GET` requests fetch resources from a server
2. `POST` requests create resources on a server (database)
3. `PUT` requests update resources on a server

One more thing necessary to know before using our database, is express.js routing parameters. As of now, we are only responding to requests being sent on the base route "/". Let's say that we want to respond with user information when a `GET` request is sent with the username being the first route parameter. For example, if I want to get the information stored in the database about the user `'danny33'`, I want to be able to send a GET request to `https://myserver.com/danny33` to acquire that information.

To create a dynamic route parameter with express, you change the route to be a colon, and then the name of your parameter. Here is how the example above would look (responding to a GET req.):

```javascript
app.get("/:user", (req, res) => {
  console.log(`[GET REQUEST TO /${user}] Sending back information about the user ${user}`);
}
```

So, going to `localhost:4567/dooty` will give back

`"[GET REQUEST TO /dooty] Sending back information about the user dooty"`

This express route parameter will only work on the text after the first route slash `/`. So going to `localhost:4567/dooty/secondparam`will refuse to connect because we haven't written a response to the request `'/:first/:second'`.

Now, we are ready to look at how we can connect our MongoDB database to this Node.js and express server we have set up (FYI, this example will include dynamic path parameters). Before, I get to the code, we have to install the Mongo package for Node: `npm i -s mongodb`. Now you can read through the heavily commented code below to get a sense of how node.js contacts MongoDB for creating, updating, and receiving database documents.

NOTE: Before running this code below, you MUST replace the `const uri = ....` with your URI that you got in the section about [Database Access](#database-access).

<iframe width="100%" height="300" src="//jsfiddle.net/denenberg/5nr6w4mg/5/embedded/js/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

Run this code, by copying and pasting it into your `app.js` file in your node project (remember to replace the `uri` variable with yours) and running node `app.js` in your terminal.

## Testing the Code

To test this code, make sure your `app.js` is running, open up Chrome (or Firefox), click `CMD+OPTION+i` to open up the dev tools pane, and click on the 'console' tab to run some JavaScript.

First, let's test creating a new user by sending a `POST` request to our server. To send our requests, I will use the JavaScript [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) function.
Below, I am creating a new user named 'dan' with some properties which can be found in the body property of the fetch.

<iframe width="100%" height="300" src="//jsfiddle.net/denenberg/5nr6w4mg/6/embedded/js/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

Paste this code in the dev tools JavaScript console and click ENTER ↵ to run.

## What Just Happened?

When you pressed enter, the code sent a post request to your server (the intent was to create a new user with the username 'dan'). The server connected to your MongoDB Atlas Database using the URI and created a new document on your database with the `user` field "dan", the `eyeColor` field "blue", the `hairColor` field "brown", and the pass field "mypassword123".

So, theoretically, if everything ran correctly, you should see that user in your MongoDB atlas database online. To test this out, go to your project cluster and click on the "collections" button for the cluster.

![](https://i.snap.as/mRfqVqR.png)

You should be able to see your data there. Click on your collection name (whatever name you used as the last parameter in the URI -- `/databasename`. For me it was `/users`. The newly created user should be sitting right there!

![](https://i.snap.as/FjmGgBK.png)

To _get_ the data about a user, just put the URL for the user, `http://localhost:4567/dan`, into a browser and the data will be in the body of the site. Easy!

And all you have to do for updating the user data in the database, is update your `extraDataToStore` variable to hold the new user data and send the request as 'put':

<iframe width="100%" height="300" src="//jsfiddle.net/denenberg/5nr6w4mg/8/embedded/js/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

And that is how you can use client side JavaScript to interact with a database! Nice work!

From here you can customize the code to add different fields to your stored data and to show the data in some nice front end design.
