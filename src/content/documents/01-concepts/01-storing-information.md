---
title: "Storing Information"
---

In Jinaga, information is stored in *facts*.
Facts are immutable.
That means that once you create one, you don't change it.
Instead, you just create more facts.

Create a simple top-level fact.

```typescript
class Site {
  static Type = "Blog.Site" as const;
  public type = Site.Type;

  constructor(
    public domain: string
  ) { }
}

const site = await j.fact(new Site('qedcode.com'));
```

[Try it](/examples/fact/single-fact)

Create a fact with a single predecessor.
Why is this called a predecessor?
Because it comes before.
We have to have a site before we can write a blog post.

```typescript
class Post {
  static Type = "Blog.Post" as const;
  public type = Post.Type;

  constructor(
    public createdAt: Date | string,
    public site: Site
  ) { }
}

const post = await j.fact(new Post(
  new Date(),     // Will be converted to an ISO string, such as "2018-12-23T22:46:02.487Z".
  site            // Site is the result of the previous j.fact.
));
```

[Try it](/examples/fact/single-predecessor)

You may be feeling that Jinaga facts are upside down.
Typically, a JSON object contains its children.
A site should contain its posts, not the other way around!
But a Jinaga fact contains its parent.
What's going on with that?

This all stems from the fact that Jinaga facts are *immutable*.
You cannot change a fact.
If a site contained an array of posts, then you would never be able to add another post.
And so the relationship has to be flipped.
A child knows its parent, because that parent relationship never changes.

To find all of the children of a fact, you need to write a query.
By the way, we call these children *successors*, as you will soon see.