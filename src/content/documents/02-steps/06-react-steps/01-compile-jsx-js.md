---
title: "Compile JSX (JavaScript)"
---

To use React, you will be writing code in a language called "JSX".
This language is embedded within JavaScript, and looks like HTML tags.
The browser can't parse JSX, so you will need a compiler to turn it into regular JavaScript.
We are going to use the [Babel loader](https://webpack.js.org/loaders/babel-loader/).

This step assumes that you have installed [Webpack](../../client-side-steps/load-with-webpack-js/).

## Install NPM Packages

The Babel loader ships as a set of NPM packages.
Install the ones that you intend to use.

```bash
npm i -D babel-loader @babel/preset-react
```

## Configure Webpack

Webpack runs loaders like the Babel loader.
But you have to configure it.
Open `webpack.config.js` and make the following changes.

First, add `".jsx"` to the recognized extensions.
I like to group my Webpack configurations.
This setting is in "Inputs".

Second, change the main entry point to `main.jsx`.
Rename the `main.js` file to match.

And third, add the module description.
This one goes in "Processing".

```javascript
module.exports = {
    // Inputs
    entry: {
        main: "./src/client/main.jsx"
    },
    resolve: {
        extensions: [".js", ".jsx"],
        alias: {
            "@shared": path.resolve(__dirname, "./src/shared"),
            "jinaga": "jinaga/dist/jinaga",
        }
    },

    // Processing
    module: {
        rules: [{
            test: /\.js(x?)$/,
            loader: "babel-loader",
            include: [
                path.resolve(__dirname, "./src/client"),
                path.resolve(__dirname, "./src/shared")
            ],
            exclude: [/node_modules/],
            options: {
                presets: [ "@babel/preset-react" ]
            }
        }]
    },
};
```

You should be able to compile after these changes.
The results should be the same.
But now you are all set up to install React.