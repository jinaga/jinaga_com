---
title: "Initialize a Starting Point"
---

Now you can create a `Site` object as a starting point for your app.

```typescript
import { j } from "./jinaga-config";
import { Site } from "./model/blog";

async function makeSite() {
  const site = await j.fact(new Site("qedcode.com"));
  return site;
}
```

Add the state and effect to `App.tsx`:

```tsx
function App() {
  const [ site, setSite ] = React.useState<Site | null>(null);
  React.useEffect(() => {
    makeSite().then(setSite);
  }, [ setSite ]);

  // ...
}
```

The `makeSite()` function creates a `Site` object.
It adds it to the Jinaga instance `j`, which sends it to the Replicator.
Since we already added that particular site (`qedcode.com`) to the Replicator, it knows which fact we are talking about.

Then we set up a state variable to hold the `Site` object.
To begin with, the state variable is `null`.
We initialize it inside of the `useEffect()` hook.
The effect is only run once, when the component is first rendered.

We are going to use this starting point to initialize a component.
So let's declare that component now.