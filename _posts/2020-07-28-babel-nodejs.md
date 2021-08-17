---
layout: post
title: How to use ES6 (and beyond) with node.js in 2020
# permalink: u
published: true
---

> 🏄‍♂️ **Updated for Babel 7 in July 2020!**

### Make an empty node project

Create an empty folder and go into it:  
`$ mkdir TestTestingTest && cd TestTestingTest`.

Then make sure you have [Yarn](https://yarnpkg.com/) or [NPM](https://www.npmjs.com/) as your package manager installed on your computer.

In the folder, run `$ yarn init` or `$ npm init` and answer the questions when prompted. 

### Dependencies

For the purposes of this tutorial, I will be making an express.js app using ES6 (and beyond) syntax.

Install the necessary modules:

- with **Yarn**: `$ yarn add @babel/cli @babel/core @babel/preset-env express rimraf`
- with **NPM**: `$ npm install --save @babel/cli @babel/core @babel/preset-env express rimraf`

### Configuration

Create a file in the root directory (of your node project) called `.babelrc`.

Put the following JSON into it:
```json
{
  "presets": ["@babel/preset-env"]
}
```

>^^ This simply specifies the version of JavaScript for babel to compile your code down to.

In the `package.json` file, add the following to the JSON object:

```json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "build": "rimraf COMPILED_CODE_HERE/ && babel ./MY_CODE_DIRECTORY --out-dir COMPILED_CODE_HERE/ --ignore ./node_modules,./.babelrc,./package.json,./npm-debug.log --copy-files",
  "start": "npm run build && node COMPILED_CODE_HERE/app.js"
}
```

>^^ This specifies build and start commands for the node project. On **build**, Babel, will compile all of your code in the `./MY_CODE_DIRECTORY` and place it in the `COMPILED_CODE_HERE` folder. 

> On **start**, the build command is run and then the entry point of your app is called. In this case, the entry point is `app.js`.

> What the **rimraf** dependency does is empty out the compiled code directory every time a new build is run.

### Let's test this puppy

To actually see if this works, let's write a quick server.

First, create and enter your code folder by running  
`$ mkdir MY_CODE_DIRECTORY && cd MY_CODE_DIRECTORY`.

Create the server file with `$ touch app.js`.

Put the following in that file:
```js
import express from 'express';
const app = express()

app.get('/', (req, res) => {
  res.send('here we are!')
})

app.listen(4040, () => {
  console.log('listening at http://localhost:4040')
})
```

As you may know, **line 1** of the code uses importing syntax from ES6 that is not currently supported in Node.js. We are counting on babel to compile this down to something node can understand!

Save the file and run `$ npm start`.

If you see `listening at http://localhost:4040` in your terminal, you're good to go.

If you look in your project you'll notice that the new `COMPILED_CODE_HERE` folder was created and in it is `app.js`.

Open that file and you should see that your ES6 import statement has been changed to something like this:
```js
"use strict"

var _express = _interopRequireDefault(require("express"));
var app = (0, _express["default"])();
```

That's how you can use cool new JavaScript syntax in node apps!

---

If you made it this far, you can stop reading now. The rest of the article shows how to use a specific cool plugin to enable **Typescript types in Babel** and how to hook up your project to **nodemon** for easy development.

### Example babel plugin

Babel has some great plugins such as being able to write types in your javascript code!

Behind the scenes, babel simply strips them away at compile-time, but they can be very useful to javascript code readability. 

To use this feature, install the plugin with:

`$ yarn add @babel/plugin-transform-flow-strip-types`  
or  
`$ npm install --save @babel/plugin-transform-flow-strip-types`

Now, add this to your babel config file `.babelrc`:
```json
"plugins": ["@babel/plugin-transform-flow-strip-types"]
```

That's it!

Now you can use types like `let a: string = 'hey'`.

### Faster reloading with nodemon

When you're developing the project, it becomes cumbersome to manually restart the server every time a change is made. **Nodemon** is a package that watches for changes and restarts your server for you!

To being, first install nodemon on your system and in your project:
```shell
$ yarn add nodemon
$ sudo npm install -g nodemon
```

Next, add the following **configuration** to your `package.json` object:
```json
"nodemonConfig": {
    "exec": "npm start",
    "watch": [
      "MY_CODE_DIRECTORY/*"
    ],
    "ignore": [
      "**/__tests__/**",
      "*.test.js",
      "*.spec.js"
    ]
  }
```

> ^^As the code states, this will **'watch'** for changes in the `MY_CODE_DIRECTORY` folder and **'execute'** the command `npm start` (as we have previously defined) when it sees that a change has been made.

Now, in your development, start by running `$ nodemon` in the root of your node project and edit/save any file in `MY_CODE_DIRECTORY`. 

You will see that the server is automatically restarted and your babel code is recompiled.

🎉