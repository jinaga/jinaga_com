---
title: "Quick Example"
---

### Facts

A Jinaga data model is made of **facts**.
A fact is an immutable JavaScript object which has a `type` field.
Write a TypeScript or JavaScript class to help you create them.
Here's an example in TypeScript.

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

See that `Site` type?
That's another fact.
That's how facts are related to each other.

### Creating facts

Whenever the user does something, like create a blog post, your app creates a fact.
Use the function `j.fact` to do that.

```javascript
await j.fact(new Post(
  new Date(),
  site
));
```

Call the `j.fact` function within the browser or mobile app whenever you want to save something.
It will be sent to the server, where it will be stored.
You don't need a custom API.

### Finding facts

To find a set of facts, first write a **specification**.

```typescript
const postsInSite = model.given(Site).match((site, facts) =>
  facts.ofType(Post)
    .join(post => post.site, site)
    .select(post => ({
      hash: j.hash(post),
      titles: facts.ofType(PostTitle)
        .join(title => title.post, post)
        .select(title => title.value)
    }))
);
```

The specification finds all facts of a certain type related to the given starting point.
It then selects the fields you want to use.

The **query** method returns all facts matching the specification.

```typescript
const posts = await j.query(postsInSite, site);
```

Again, run this code in the browser or mobile client.
There is no need to set up an API to perform this query on the server.

### Displaying facts

A query is a one-time operation.
If you want to update the UI every time a post is created, call the `useSpecification` hook.

```typescript
const { loading, data, error } = useSpecification(j, postsInSite, site);
```

The `data` variable will contain the results of the query.
Render the results in your component.

```tsx
  return (
    <div>
      <h1>{site?.domain}</h1>
      { loading ? <p>Loading...</p> : null }
      { error ? <p>Error: {error.message}</p> : null }
      { data ? <ul>
        { data.map(post =>
          <li key={post.hash}>{post.titles.join(', ')}</li>
        ) }
      </ul> : null }
    </div>
  );
```

And with this, facts created by one user make their way to other users.
You didn't write a custom API.
You didn't set up a Web Socket listener.
You didn't define a custom database schema.

Jinaga synchronizes immutable facts from client, to server, and back again.
It persists them durably, transmits them reliably, and updates the view automatically.