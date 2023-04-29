---
title: "Install Jinaga"
---

Let's install Jinaga so that we can get connected to the Replicator, by typing in VS Code's terminal window: 

```bash
npm install jinaga jinaga-react
```

Sign in to the [Jinaga portal](https://dev.jinaga.com) to create a new replicator.
Publish the replicator and copy the generated URL.
Create a new file called `.env` in the root of the project.
Define a variable called `REACT_APP_JINAGA_REPLICATOR_URL` and paste in the generated URL.

```
REACT_APP_JINAGA_REPLICATOR_URL=https://repdev.jinaga.com/xyz123....
```

Then create a file called `jinaga-config.ts` in the `src` directory and add the following code:

```typescript
import { JinagaBrowser } from "jinaga";

export const j = JinagaBrowser.create({
    httpEndpoint: process.env.REACT_APP_JINAGA_REPLICATOR_URL,
});
```

That will create a Jinaga client for the browser that connects to the Replicator.
