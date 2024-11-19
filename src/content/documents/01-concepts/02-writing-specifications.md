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
Given a starting point, the specification finds related facts.
Usually, you want to find successors.

```typescript
const postsInSite = model.given(Site).match(site =>
  site.successors(Post, post => post.site)
);
```

This specification finds all successors of type `Post` related to the predecessor `Site`.

Call the `j.query` method to retrieve the facts.

```typescript
const posts = await j.query(postsInSite, site);
```
