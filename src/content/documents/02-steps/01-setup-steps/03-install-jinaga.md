---
title: "Install Jinaga"
---

This assumes that you have [created a Node Application](../create-node-app/).

Jinaga is published as an NPM package.
To install it just run:

```bash
npm i jinaga
```

It is now in your `package.json` and downloaded to the `node_modules` folder.

The package contains two bundles.
One is for the server, and the other is for the client.
To get the most out of the library, you will need to use them together.

| Context          | File                               | Module Format |
| ---------------- | ---------------------------------- | ------------- |
| Server and Tests | node_modules/jinaga/dist/index.js  | CommonJS      |
| Client           | node_modules/jinaga/dist/jinaga.js | AMD           |

To use the library [in tests](../../testing-steps/write-some-tests-js/) or [on the server](../../server-side-steps/jinaga-server/), you can use `require` from a Node application.
To use it on the client, use an [AMD module loader like RequireJS](../../client-side-steps/load-with-requirejs/), or a [bundler like Webpack](../../client-side-steps/load-with-webpack-js/).