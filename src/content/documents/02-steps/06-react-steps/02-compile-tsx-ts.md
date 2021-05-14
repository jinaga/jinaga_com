---
title: "Compile TSX (TypeScript)"
---

When you are using TypeScript, the embedded language that you use to write React code is called TSX.
This language looks like HTML tags, and sits right inside your TypeScript code.
The TypeScript compiler can already handle it.
You just need to set up Webpack to build it.

This step assumes that you have installed [Webpack](../../client-side-steps/load-with-webpack-ts/).

Open the `webpack.config.js` file and make the following changes.
First, add `".tsx"` to the recognized extensions.
I like to group my Webpack configurations.
This setting is in "Inputs".

Second, change the main entry point to `main.tsx`.
Rename the `main.ts` file to match.

And third, change the `ts-loader` rule so that it matches either `.ts` or `.tsx`.
The module declaration is in "Processing".

```javascript
module.exports = {
    // Inputs
    entry: {
        main: "./src/client/main.tsx"
    },
    resolve: {
        extensions: [".ts", ".tsx"],
        alias: {
            "@shared": path.resolve(__dirname, "./src/shared"),
            "jinaga": "jinaga/dist/jinaga",
        }
    },

    // Processing
    module: {
        rules: [{
            test: /\.tsx?$/,
            loader: "ts-loader",
            include: [
                path.resolve(__dirname, "./src/client"),
                path.resolve(__dirname, "./src/shared")
            ],
            exclude: [/node_modules/]
        }]
    },
};
```

You should be able to compile after these changes.
The results should be the same.
But now you are all set up to install React.