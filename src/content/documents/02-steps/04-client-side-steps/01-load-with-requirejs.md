---
title: "Load with RequireJS"
---

The Jinaga package contains two bundles.
One is for the server-side, and the other is for the client side.
The client-side bundle is an AMD module, and is intended to be used with a module loader such as [Require.JS](https://requirejs.org/).

If you prefer to use a packager like [Webpack](https://webpack.js.org/), then follow the Webpack step [for JavaScript](../configure-webpack-js/) or [for TypeScript](../configure-webpack-ts/) instead.

First install Require.js.

```bash
npm i requirejs
```

Then you can write a client-side application using Jinaga.
For example, this `src/client/main.js` can get you started:

```javascript
define(function (require) {
    const { JinagaBrowser } = require("jinaga");
    const j = JinagaBrowser.create({
        httpEndpoint: "/jinaga"
    });

    j.fact({
        type: "MyApplication.Visit",
        date: new Date()
    });
});
```

Notice the `httpEndpoint` setting.
That connects the client to your server.

Pull it all together with a `src/client/app.js`:

```javascript
requirejs.config({
    baseUrl: 'scripts',
});

requirejs(['main']);
```

To get your application and Jinaga into the browser, serve the all of the JavaScript files from your app.
You can do this by adding routes to your `src/server/routes.js`:

```javascript
app.get("/scripts/app.js", (req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "client", "app.js"));
});

app.get("/scripts/main.js", (req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "client", "main.js"));
});

app.get("/scripts/require.js", (req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "..", "node_modules", "requirejs", "require.js"));
});

app.get("/scripts/jinaga.js", (req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "..", "node_modules", "jinaga", "dist", "jinaga.js"));
});
```

Then you can load your application from `src/server/index.html`:

```html
<script data-main="scripts/app.js" src="scripts/require.js"></script>
```