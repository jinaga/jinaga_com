---
title: "Match Successor Facts"
---

So far we're just displaying the domain of the site.
That's not too exciting.
We just told it what the domain is.
Let's read some posts from the Replicator and show those.

First we need to write a specification function that matches posts of a site.
Let's add this specification function to the `post.ts` file:

```typescript
import { j } from "../jinaga-config";
//...

export class Post {
  //...

  static forSite(site: Site) {
    return j.match<Post>({
      type: Post.Type,
      site
    });
  }
}
```

This specification function will match facts of type `Blog.Post` that have a `site` property that has the same value as the `site` parameter.
In other words, all of the posts on this site.

We can use this specification function to create a set of child components.