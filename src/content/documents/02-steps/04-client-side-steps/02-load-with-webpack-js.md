---
title: "Load with Webpack (JavaScript)"
---

If you prefer to use [Webpack](https://webpack.js.org/) to bundle your client-side code, then this will get you started.
We prefer bundling over a module loader, but the choice is yours.
These instructions work with Webpack 5.

## Install Webpack

Install the Webpack package and the CLI:

```bash
npm i -D webpack webpack-cli
```

## Configure Webpack

The Webpack configuration file should be in the root of the project, where the `package.json` file is found.
It should be called `webpack.config.js`.
Create this file now:

```javascript
const path = require('path');

module.exports = {
    // Inputs
    entry: {
        main: "./src/client/main.js"
    },
    resolve: {
        extensions: [".js"],
        alias: {
            "@shared": path.resolve(__dirname, "./src/shared"),
            "jinaga": "jinaga/dist/jinaga",
        }
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

This configuration expects to find the client-side code in the `src/client` folder.
It creates an alias so that any reference to "jinaga" brings in the client-side bundle.
It also creates an alias to `src/shared` for code that is shared between the client and the server.

Modify your `package.json` to run Webpack.

```json
{
    "scripts": {
        "build": "webpack",
    },
}
```

Run `npm run build` to build to the `dist` folder.

## Write the Client Code

Now we can import Jinaga and start coding the client.
Create a new file at `src/client/main.js`:

```javascript
import { JinagaBrowser } from "jinaga";

const j = JinagaBrowser.create({
    httpEndpoint: "/jinaga"
});

j.fact({
    type: "MyApplication.Visit",
    date: new Date()
});
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

    app.use('/scripts', express.static(
        path.join(__dirname, "..", "..", "dist", "scripts"),
        { maxAge: "365d" }
    ));
}

module.exports = { configureRoutes };
```

Run the app with `node src/server/index` and open it in the browser.
Take a look at the Network tab in the developer tools.
You will see that it loads your bundle and saves a fact using the `/jinaga` endpoint.