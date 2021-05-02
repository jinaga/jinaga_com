---
title: "Serving a Web Page"
---

The very first thing that your server needs to do is serve a web page.
We will do that using Express.
If you haven't already, install Express and a few other related packages.

```bash
npm i express body-parser
```

Start Express in a file called `src/server/index.js`.

```javascript
const express = require('express');
const http = require('http');
const { json } = require('body-parser');

const app = express();
const server = http.createServer(app);

app.set("port", process.env.PORT || 8080);
app.use(json());

server.listen(app.get("port"), () => {
    console.log(`  App is running at http://localhost:${app.get("port")} in ${app.get("env")} mode`);
    console.log("  Press CTRL-C to stop\n");
});
```

Start your app with `node src/server/index` and it will listen on port 8080.
But right now it doesn't serve any pages.
Do to that, define a route.
I like to do this in a separate file called `src/server/routes.js`.

```javascript
const path = require('path');

function configureRoutes(app) {
    app.get("/", (req, res, next) => {
        res.sendFile(path.join(__dirname, "index.html"));
    });
}

module.exports = { configureRoutes };
```

Include it in `index.js`:

```javascript
// Put this at the top.
const { configureRoutes } = require('./routes');

// Put this just before listen.
configureRoutes(app);
```

Create a landing page at `src/server/index.html`.

```html
<html>
    <head>

    </head>

    <body>
        <p>Welcome!</p>
    </body>

</html>
```

Now you can start the app and open it in the browser.