---
title: "Create React App"
---

The easiest way to start is with [Create React App](https://create-react-app.dev/).

Run the following command in the WSL-terminal:

```bash
npx create-react-app my-application --template typescript
```

Here we used the TypeScript template, which is recommended for Jinaga.
If you prefer plain JavaScript, run the command without the `--template typescript` option.

The above command will create a folder called `my-application` in the current directory.
That folder will contain a brand new React application.  Change to that new folder and open VS Code:

```bash
cd my-application
code .
```

Next open the terminal window in VS Code and from there run the app with `npm start`.