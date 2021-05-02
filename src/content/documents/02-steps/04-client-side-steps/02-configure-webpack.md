---
title: "Configure Webpack"
---

If you prefer to use [Webpack](https://webpack.js.org/) to bundle your client-side code, then this will get you stared.
This is the way that we prefer to write Jinaga applications.
These instructions work with Webpack 5.

## Install Webpack

Install the Webpack package and the CLI:

```bash
npm i -D webpack webpack-cli
```

If you followed the RequireJS step, you can remove that package.

```bash
npm remove requirejs
```

## Reference the Jinaga Client-Side Bundle

Now we can move the code in `src/client/index.js` out of the `define` function.
We can also start using `import` instead of `require`.

**IMPORTANT**: When using the `import` syntax, specify the client-side Jinaga bundle at `jinaga/dist/jinaga`.

```javascript
import { JinagaBrowser } from "jinaga/dist/jinaga";

const j = JinagaBrowser.create({
    httpEndpoint: "/jinaga"
});

j.fact({
    type: "MyApplication.Visit",
    date: new Date()
});
```

## Configure Webpack

We don't need `src/client/app.js`.
If you followed the RequireJS step, you can delete this file.

Instead, we will bundle the client app using Webpack.
The default expects the entrypoint to be at `src/index.js`, but we've split our client and server code into subfolders.
So we will need to create a new configuration file.

Create a file called `webpack.config.js`:

```javascript
const path = require('path');

module.exports = {
    // Inputs
    entry: {
        main: "./src/client/main.js"
    },

    // Processing
    mode: "production",

    // Outputs
    output: {
        filename: "[name]-[contenthash].js",
        path: path.resolve(__dirname, "dist", "scripts"),
    },
};
```

Then modify your `package.json` to run Webpack.

```json
"scripts": {
    "build": "webpack",
},
```

## Load the Bundle Into the Page

When you run `npm run build`, Webpack will produce a file in `dist\scripts`.
It's name will begin with `main-`, and the rest will be a hash.
This hash lets you cache the script indefinitely, as any change to the code will result in a brand new name.

The page needs to know the name of the bundle that was just produced.
We can inject that name in the form of a `<script>` tag using the `HtmlWebpack` plugin.
If you have followed the RequireJS step, then remove the line `<script data-main="scripts/app.js" src="scripts/require.js"></script>` from your `src/server/index.html`.
We'll have the plugin inject a script tag for us.

First, install the plugin:

```bash
npm i -D html-webpack-plugin
```

Then configure it inside your `webpack.config.js`:

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // Inputs
    entry: {
        main: "./src/client/main.js"
    },

    // Processing
    mode: "production",
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/server/index.html",
            publicPath: "/scripts/",
            filename: "../[name].html",
        }),
    ],

    // Outputs
    output: {
        filename: "[name]-[contenthash].js",
        path: path.resolve(__dirname, "dist", "scripts"),
    },
};
```

This will create a file in the `dist` folder called `main.html` that includes a script tag that will load `scripts/main-xxxx.js`.
Set up your `src/server/routes.js` so that it serves these files at the correct paths for the browser:

```javascript
const path = require('path');
const express = require('express');

function configureRoutes(app) {
    app.get("/", (req, res, next) => {
        res.sendFile(path.join(__dirname, "..", "..", "dist", "main.html"));
    });

    app.use('/scripts', express.static(path.join(__dirname, "..", "..", "dist", "scripts")));
}

module.exports = { configureRoutes };
```

Run the app with `node src/server/index` and open it in the browser.
Take a look at the Network tab in the developer tools.
You will see that it loads your bundle and saves a fact using the `/jinaga` endpoint.