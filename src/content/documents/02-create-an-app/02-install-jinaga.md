---
title: "Install Jinaga"
---

Let's install Jinaga so that we can get connected to the Replicator, by typing in VS Code's terminal window: 

```bash
npm install jinaga jinaga-react
```

Then create a file called `jinaga-config.ts` in the `src` directory and add the following code:

```typescript
import { JinagaBrowser } from "jinaga";

export const j = JinagaBrowser.create({
    httpEndpoint: "http://localhost:8080/jinaga"
});
```

That will create a Jinaga client for the browser that connects to the Replicator.
