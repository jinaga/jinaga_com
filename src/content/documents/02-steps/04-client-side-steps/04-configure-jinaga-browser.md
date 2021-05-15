---
title: "Configure Jinaga Browser"
---

The Jinaga object is available both on the server and in the browser.
That's the way that the two sides talk to each other.
Because each side has a different job, the configuration is specialized.

If you've just completed the Webpack steps, you have a main entry point that uses `JinagaBrowser` to create a Jinaga object.
It configures the HTTP endpoint of the server.

We will need the Jinaga object all over the application.
So go ahead and pull that part out of main and put it in a new file called `src/client/jinaga-config.js`.

```javascript
import { JinagaBrowser } from "jinaga";

export const j = JinagaBrowser.create({
    httpEndpoint: "/jinaga"
});
```

Import it where you need it.

```javascript
import { j } from "./jinaga-config";

j.fact({
    type: "MyApplication.Visit",
    date: new Date()
});
```