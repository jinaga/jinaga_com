---
title: "Concepts"
---

Jinaga is a state-management framework for building web and mobile applications.
When building an application with Jinaga, you perform three basic operations:

- Storing information
- Writing specifications
- Projecting results

You store information whenever the user performs an action.
This saves the data in local storage, sends it to the server, and updates the user interface.

```typescript
await j.fact(new Post(
  new Date(),
  site
));
```

You write a specification to describe the shape of the information you want to retrieve.
A specification function matches a template, and applies conditions.

```typescript
const postsInSite = model.given(Site).match(site =>
  site.successors(Post, post => post.site)
    .select(post => ({
      hash: j.hash(post),
      titles: site.successors(PostTitle, title => title.post)
        .select(title => title.value)
    }))
);
```

You retrieve information any time you need the application to answer a question.
It could be a query that you run just when you need the data.

```typescript
const posts = await j.query(postsInSite, site);
```

Or it could be watching to for changes so that you can update the UI.

```typescript
const { loading, data, error } = useSpecification(j, postsInSite, site);
```