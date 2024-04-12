---
title: "Install Jinaga"
---

Let's install Jinaga so that we can get connected to the Replicator, by typing in VS Code's terminal window: 

```bash
npm install jinaga jinaga-react
```

Sign in to the [Jinaga portal](https://app.jinaga.com) to create or access a replicator.
Publish the replicator and copy the generated URL.
Create a new file called `.env` in the root of the project.
Define a variable called `REACT_APP_JINAGA_REPLICATOR_URL` and paste in the generated URL.

```
REACT_APP_JINAGA_REPLICATOR_URL=https://rep.jinaga.com/xyz123....
```

Then create a file called `jinaga-config.ts` in the `src` directory.
Whether you are using React or React Native, add the following code:

```typescript
import { JinagaBrowser } from "jinaga";

export const j = JinagaBrowser.create({
    httpEndpoint: process.env.REACT_APP_JINAGA_REPLICATOR_URL,
});
```

That will create a Jinaga client for the browser or mobile app that connects to the Replicator.
