---
title: "Writing Specifications"
---

Specifications are used to retrieve information.
They begin with a model.
The model describes the types of facts, and how they are related to each other.

```typescript
const model = buildModel(b => b
  .type(Site)
  .type(Post, m => m
    .predecessor("site", Site)
  )
);
```

The model is used to create a specification.
Given a starting point, the specification finds all facts that match a set of conditions.

```typescript
const postsInSite = model.given(Site).match((site, facts) =>
  facts.ofType(Post)
    .join(post => post.site, site)
);
```

Call the `j.query` method to retrieve the facts.

```typescript
const posts = await j.query(postsInSite, site);
```
