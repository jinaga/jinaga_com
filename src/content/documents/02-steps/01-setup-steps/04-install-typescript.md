---
title: "Install TypeScript (optional)"
---

This assumes that you have [created a Node Application](../create-node-app/).

Jinaga works well with [TypeScript](https://www.typescriptlang.org/).
If you would rather use JavaScript, feel free to skip this step.
But if you prefer to use types, you'll need to set up a few extra things.

First, install TypeScript.

```bash
npm i -D typescript
```

Then you'll need to initialize the project.

```bash
npx tsc --init
```

This creates a new file called `tsconfig.json`.
Modify this file to add the `outDir` setting.

```json
{
    "compilerOptions": {
        "outDir": "dist"
    }
}
```

Then create a new script in `package.json` that runs `tsc`.

```json
"scripts": {
    "build": "tsc"
}
```

Create a TypeScript file in the `src` folder to compile.
For example, here's a simple `index.ts`:

```typescript
console.log("Hello!");
```

You can then build and run the file.

```bash
npm run build
node dist/index
```

If you like, you can add one more script called `start` that runs the app.

```json
"scripts": {
    "build": "tsc",
    "start": "node dist/index"
}
```

Run the app with:

```bash
npm start
```