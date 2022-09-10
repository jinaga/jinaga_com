---
title: "Define a Model"
---

To work with the facts you [added to the Replicator](../../replicator/write/), you need to define a model.
The first kind of fact you added was a `Blog.Site`, which had a `domain` field.
Let's start there.

Create a folder called `model` in the `src` directory.
Inside the `model` folder, create a file called `site.ts`.
Add the following code:

```typescript
export class Site {
    static Type = "Blog.Site";
    public type = Site.Type;

    constructor(
        public domain: string
    ) { }
}
```

The next fact you added was a `Blog.Post`, which had a `createdAt` field.
It was related to a `site`.

Create a file called `post.ts` in the `model` folder.
Add the following code:

```typescript
import { Site } from "./site";

export class Post {
  static Type = "Blog.Post";
  public type = Post.Type;

  constructor(
    public createdAt: Date | string,
    public site: Site
  ) { }
}
```