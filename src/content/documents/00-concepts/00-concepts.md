---
title: "Jinaga Concepts"
---

Jinaga is a data management framework for mobile, web, and distributed applications.
It is particularly good for offline-first applications and progressive web apps, where data is stored locally and synchronized with a server.
We call that server a *replicator*, but we'll get to that.

You're going to see a lot of code for creating and querying data.
Keep in mind that all of this code is running on the client.
You don't ever write server code, publish an API, or manage a database.

## Jinaga Client

A Jinaga client manages data in your application and connects to a replicator.
Create a client using a factory method.
For example, to store local state in IndexedDB, use this method:

```typescript
import { JinagaClient } from "jinaga";

const j = JinagaClient.create({
    httpEndpoint: "https://rep.jinaga.com/myreplicator",
    indexedDb: "my-application-state"
});
```

Or to use Jinaga in a unit test, use an in-memory store:

```typescript
import { JinagaTest } from "jinaga";

const testClient = JinagaTest.create({
  user: "--- TEST USER ---",
});
```

## Jinaga Replicator

A Jinaga replicator is a server that stores data and synchronizes it with clients.
You can host your own replicator, or use one of ours.

You don't write application code to run on a replicator.
Instead, you configure it with security rules so that it can safely manage your data.

Connect replicators together so that information can flow through your mesh.
At various points in your network, you may run applications that integrate with other systems or perform back-end tasks.
The replicators will make sure that the information they need flows to them, and that the results that they produce flow back to the clients.