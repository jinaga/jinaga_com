---
title: "Install React"
---

To use Jinaga with React, you will need to install a couple of React packages, and the Jinaga-React connector.
The connector currently works with React 16.

```bash
npm i react@16 react-dom@16 jinaga-react
```

If you are using TypeScript, you will also want to add the types for those React packages.
Jinaga was build with TypeScript, so it's all build in.

```bash
npm i -D @types/react@16 @types/react-dom@16
```

## Define an App Component

The entry point of the application will be a component.
Let's create a really simple one to make sure everything is set up correctly.
Add a file at `src/client/app.jsx` to just display a message.

```javascript
import * as React from "react";

export const App = ({}) => (
    <p>Hello, World! So glad you could make it.</p>
);
```

## Render the App Component

We'll need a place to render the `App` component on the page.
Open up `src/server/index.html` and add a `<div>` tag within the body.

```html
<html>
  <body>
    <div id="application-host"></div>
  </body>
</html>
```

Change `src/client/main.js` to `src/client/main.jsx`.
That extra `x` at the end tells the compiler that this file can contain HTML-like tags.
It's pretty cool.

Make the corresponding change in `webpack.config.js` so that it uses this entry point.

```javascript

```

Add some code to `src/client/main.jsx` to render the component in that `<div>`.

```javascript
import { App } from "./app";
import * as React from "react";
import * as ReactDOM from "react-dom";

ReactDOM.render(
    <App />,
    document.getElementById("application-host")
);
```