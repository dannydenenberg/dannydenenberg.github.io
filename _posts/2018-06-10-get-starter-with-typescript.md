---
title: Typescript quickstart
permalink: get-started-typescript
---

Typescript is a programming language that compiles into JavaScript. This means that any valid JS (JavaScript) code is valid TS (Typescript). TS is a language for the developer. If you have every written a bunch of Javascript code and started to wonder, "hey, what was the type of that function parameter, again?", you understand.

Typescript is "JavaScript that scales" meaning it enforces types on all variables/return values, allows for interface use, and much much more. Typescript also implements some feature that are supposed to come to Javascript in the future.<!--more-->

## Getting Started

Typescript is a compiled language which means it needs a compiler. You will first need NodeJS installed (TS is almost always used with Node). Then type `npm i -g typescript` to install TS globally on your computer.
If typing `tsc -v` works and yields the version number of your TS installation, you're good to go!

## The Basics

All you really need to use Typescript is the compiler. So, create a new file called hello.ts and put this code in it:

```typescript
let mes = "Hello, TS 🌏😍";
console.log(`${mes}`);
```

As you can see, there is one difference here from vanilla JS – the :string type annotation after the message variable name. The general form for type annotations go like this: `let variableName: type`.

**Note:** The string type would have been inferred as the type without the annotation, just like in this case, let a = 9, the inerred type would be number.

Now to compile the TS file into JavaScript, run `tsc hello.ts`. This generates a new file called `hello.js` with the compiled JS code.

Let's run that: `node hello.js`. You should see in the console "Hello, TS ♥️".
To learn more about Typescript syntax and cool features, check out the handbook.

## Workflow with Node

Because TS is primarily used in NodeJS environments, it is important to know how they work together.

Create a new project with `npm init`.

Next, add the TS configure file with `tsc -init`. This creates a new file in the root of your project called `tsconfig.json`. In it are all sorts of configure variables that you can play with. All we are interested in for the time being is one called outDir. This is the folder that the compiled TS is put into. Find the line where it is defined, uncomment it, and assign it the value of `"./build"`.

Now, you can put your TS files anywhere and they will all be compiled into the `./build` directory with the command `tsc`.

Copy your `hello.ts` file into the root of your project and run tsc (just those 3 letters). Now in the build folder, there should be a hello.js file. You can run it with `node build/hello.js`.

This is the general workflow for creating TS files, compiling, and running them. Remember, you can name the `outDir` directory anything you want!

## Editors and @types

For editing Typescript, I would highly, highly recommend [Visual Studio Code](https://code.visualstudio.com/). It is the editor I use for almost everything. I used to use [Atom](https://atom.io/), but when I made the switch, I realized just how much better VSC is. It is SUPER fast ⚡️. Has thousands of amazing plugins. Runs on almost every platform.
For intellisense, VSC's default Typescript package works extremely well. But, when is comes to working with npm packages in Typescript, you will have to install the type definitions for the package (if they are available). Let's take express.js for example. The type definition package for express is `@types/express`. So, to get autocomplete, intellisense, etc. just install the package with `npm i @types/express`.

Without the type definitions installed, the packages have the type any by default.

A great website for finding type definitions for your favorite npm packages is [definitelytyped.org](https://definitelytyped.org). Click on the search and it will take you to TypeSearch where you can find your package's types and how to install them (it usually is @types/package). 
As an alternative, you could search on [Yarn's](https://yarnpkg.com/lang/en/) website for packages that start with "`@types`".
Have fun with TS ❤️.
