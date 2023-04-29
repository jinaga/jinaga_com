---
title: "Define a Model"
---

To work with the facts you [added to the Replicator](../../replicator/write/), you need to define a model.
The first kind of fact you added was a `Blog.Site`, which had a `domain` field.
Let's start there.

Create a folder called `model` in the `src` directory.
Inside the `model` folder, create a file called `blog.ts`.
Add the following code:

```typescript
export class Site {
    static Type = "Blog.Site" as const;
    public type = Site.Type;

    constructor(
        public domain: string
    ) { }
}
```

The next fact you added was a `Blog.Post`, which had a `createdAt` field.
It was related to a `site`.
Let's add that to the `blog.ts` file.

```typescript
export class Post {
  static Type = "Blog.Post" as const;
  public type = Post.Type;

  constructor(
    public createdAt: Date | string,
    public site: Site
  ) { }
}
```

Finally, you added a `Blog.Post.Title` for the post.
Let's add that to the `blog.ts` file.

```typescript
export class PostTitle {
  static Type = "Blog.Post.Title" as const;
  public type = PostTitle.Type;

  constructor(
    public post: Post,
    public value: string,
    public prior: PostTitle[]
  ) { }
}
```

Now we need to tell Jinaga about these types.
At the bottom of the `blog.ts` file, add the following code.
You will import `ModelBuilder` from `jinaga`.

```typescript
export const blogModel = (b: ModelBuilder) => b
  .type(Site)
  .type(Post, m => m
    .predecessor("site", Site)
  )
  .type(PostTitle, m => m
    .predecessor("post", Post)
    .predecessor("prior", PostTitle)
  )
;
```

We'll eventually build our model from multiple files.
Right now, though, we only have the one.
We'll still make space to compose more.

Create a file called `index.ts` in the `model` folder.
Add the blog model to the composite model:

```typescript
import { buildModel } from "jinaga";
import { blogModel } from "./blog";

export const model = buildModel(b => b
  .with(blogModel)
);
```