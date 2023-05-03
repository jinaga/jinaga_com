---
title: "Create React App"
---

Before using this walkthrough, please create a Jinaga [replicator](../../replicator/).
Initialize it using the [write endpoint](../../replicator/write/).
Jinaga.JS supports React and React Native.

## React

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

## React Native

The easiest way to start a React Native app is with [Expo](https://expo.io/).
If you are on Windows, be sure to run this command in PowerShell, *not* in WSL.

```bash
npx create-expo-app my-application -t expo-template-blank-typescript
```

Then change to that folder and open VS Code:

```bash
cd my-application
code .
```

In the original PowerShell window, run the app with `npm start`.
It's best to use the PowerShell window for this, because it will show a QR code that you will need to scan with your phone.