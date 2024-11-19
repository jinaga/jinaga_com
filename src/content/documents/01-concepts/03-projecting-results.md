---
title: "Projecting Results"
---

A specification gives you all of the related facts.
But sometimes you want to transform those facts into a different shape.
You can do that with the `select` method.

```typescript
const postsInSite = model.given(Site).match(site =>
  site.successors(Post, post => post.site)
    .select(post => ({
      hash: j.hash(post),
      createdAt: post.createdAt
    }))
);
```

When you select the hash or a field of a fact, the resulting value is immutable.
That's because facts themselves are immutable.
If you want to project something that changes, you can select a sub-specification.
Use the `successors` method to find related facts, and then `select` again to shape them.

```typescript
const postsInSite = model.given(Site).match(site =>
  site.successors(Post, post => post.site)
    .select(post => ({
      hash: j.hash(post),
      createdAt: post.createdAt,
      titles: post.successors(PostTitle, title => title.post)
        .select(title => title.value)
    }))
);
```