---
title: "Configure Webpack (TypeScript)"
---

If you are using TypeScript and prefer to use [Webpack](https://webpack.js.org/) to bundle your client-side app, then you will need to take a few additional steps.
But I think you will find that the rewards are worth it.

## Install Webpack and the TypeScript Loader

First, let's get the Webpack package and CLI installed.
We will also want the TypeScript loader:

```bash
npm i -D webpack webpack-cli ts-loader
```

If you haven't [installed TypeScript](../../setup-steps/install-typescript/) yet, be sure to do that as well.

## Configure the Server and Client Projects

Because we want both server and client code bases, we will have two separate projects.
That means two different `tsconfig.json` files.
The one at `src\server\tsconfig.json` is set up to build ES6 and use Common JS module format.
It also brings in the `@shared` alias so that we can have code running both in the client and on the server.

```json
{
    "compilerOptions": {
        "target": "es6",
        "module": "commonjs",
        "outDir": "../../dist",
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true,
        "paths": {
            "@shared/*": [
                "../shared/*"
            ]
        }
    },
    "exclude": [
        "**/*.test.ts"
    ]
}
```

To build the server using this configuration, run:

```bash
npx tsc --project src/server
```

The configuration file at `src/client/tsconfig.json` will target ES6 and use ES6 modules.
It also sets up support for React JSX.

```json
{
    "compilerOptions": {
        "target": "es6",
        "module": "es6",
        "outDir": "../../dist",
        "strict": true,
        "esModuleInterop": true,
        "moduleResolution": "node",
        "sourceMap": true,
        "jsx": "react",
        "paths": {
            "@shared/*": [
                "../shared/*"
            ]
        },
        "allowSyntheticDefaultImports": true,
        "allowJs": true
    },
    "lib": [
        "es2015"
    ]
}
```

We are going to be building the client-side code using WebPack.

## Configure Webpack

To get Webpack to compile your client-side code, you will need a `webpack.config.js`.
This one runs `ts-loader` in order to compile the client-side TypeScript.
It also sets up a couple of useful aliases.
First, it aliases `@shared` to the shared source folder.
And second, it aliases `jinaga` to the client-side bundle.

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // Inputs
    entry: {
        main: "./src/client/main.ts"
    },
    resolve: {
        extensions: [".js", ".ts"],
        alias: {
            "@shared": path.resolve(__dirname, "./src/shared"),
            "jinaga": "jinaga/dist/jinaga",
        }
    },

    // Processing
    mode: "production",
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/server/index.html",
            publicPath: "/scripts/",
            filename: "../server/[name].html",
        }),
    ],
    module: {
        rules: [{
            test: /\.ts$/,
            loader: "ts-loader",
            include: [
                path.resolve(__dirname, "./src/client"),
                path.resolve(__dirname, "./src/shared")
            ],
            exclude: [/node_modules/]
        }]
    },

    // Outputs
    output: {
        filename: "[name]-[contenthash].js",
        path: path.resolve(__dirname, "dist", "scripts"),
    },
};
```

You can build this with `npx webpack`.

## Reference the Jinaga Client-Side Bundle

Now that Webpack uses `jinaga` as an alias for the client-side bundle, you can just import it.
Here's a `src/client/main.ts` that imports and initializes Jinaga.

```typescript
import { JinagaBrowser } from "jinaga";

const j = JinagaBrowser.create({
    httpEndpoint: "/jinaga"
});

j.fact({
    type: "MyApplication.Visit",
    date: new Date()
});
```

## Configure a Build Script

To build both the client and server, combine the two commands from above into a single script.
Edit your `package.json` to set up the build script.

```json
{
    "scripts": {
        "build": "webpack && tsc --project src/server",
    },
}
```

This will produce a `scripts` folder in `dist`.
All of the server side code will be directly in `dist`.
This will change once the server-side code starts referencing shared files.
When that happens, then you will get a `server` and `shared` folder.
I like to create a simple `src/shared/model.ts` that I reference from the server side just to force this to happen early.
It will be important to get the relative paths to your scripts folder correct in `src/server/routes.ts`:

```typescript
import path from "path";
import express from "express";

export function configureRoutes(app: express.Express) {
    app.get("/", (req, res, next) => {
        res.sendFile(path.join(__dirname, "main.html"));
    });

    app.use('/scripts', express.static(
        path.join(__dirname, "..", "scripts"),
        { maxAge: "365d" }
    ));
}
```

Build with `npm run build` and run with `node dist/server`.
You might even want to set up the start script so that you can just run `npm start`.
Do that in `package.json`:

```json
{
    "scripts": {
        "build": "webpack && tsc --project src/server",
        "start": "node dist/server/index",
    },
}
```