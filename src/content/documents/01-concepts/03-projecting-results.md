---
title: "Projecting Results"
---

A specification gives you the facts that match a set of conditions.
But sometimes you want to transform the facts into a different shape.
You can do that with the `select` method.

```typescript
const postsInSite = model.given(Site).match((site, facts) =>
  facts.ofType(Post)
    .join(post => post.site, site)
    .select(post => ({
      hash: j.hash(post),
      createdAt: post.createdAt
    }))
);
```

When you select the hash or a field of a fact, the resulting value is immutable.
That's because facts themselves are immutable.
If you want to project something that changes, you can select a sub-specification.

```typescript
const postsInSite = model.given(Site).match((site, facts) =>
  facts.ofType(Post)
    .join(post => post.site, site)
    .select(post => ({
      hash: j.hash(post),
      createdAt: post.createdAt,
      titles: facts.ofType(PostTitle)
        .join(title => title.post, post)
        .select(title => title.value)
    }))
);
```