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

There are two files that you will need: one for the client and one for the server.
The server-side file is at `node_modules/jinaga/dist/index.js`, and the client is at `node_modules/jinaga/dist/jinaga.js`.
You can import them separately with the following imports.

To import the client:

```javascript
import { Jinaga } from "jinaga/dist/jinaga";
```

To import the server or a unit test:

```javascript
const { Jinaga } = require("jinaga");
```
