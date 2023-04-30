---
title: "j.fact"
---

Call `j.fact` to create a new fact.
This method is asynchronous.
It will be resolved when the fact has been persisted.
It returns the fact that was just created.

```typescript
fact<T>(
    prototype: T
): Promise<T>;
```

Creating a fact stores it locally, shares it upstream to the replicator, and updates active watches.

## Examples

Create a simple top-level fact.

```typescript
const tagReact = await j.fact({
    type: 'Blog.Tag',
    name: 'React'
});
```

[Try it](/examples/fact/single-fact)

Create a fact with a single predecessor.
Why is this called a predecessor?
Because it comes before.
We have to have a person before they can write a blog post.

```typescript
const post = await j.fact({
    type: 'Blog.Post',
    created: new Date(),    // Will be converted to an ISO string, such as '2018-12-23T22:46:02.487Z'.
    author: person          // Where person is the result of a previous j.fact.
});
```

[Try it](/examples/fact/single-predecessor)

Create a fact with multiple predecessors.
Just put them in an array.

```typescript
await j.fact({
    type: 'Blog.Post.Tags',
    post: post,
    tags: [tagReact, tagCss, tagMicroFrontends]
});
```

[Try it](/examples/fact/multiple-predecessors)

You can specify the predecessors inline.
The predecessor facts will be persisted first.
However, persistence is not guaranteed to be atomic.

```typescript
await j.fact({
    type: 'Blog.Post.Tags',
    post: {
        type: 'Blog.Post',
        created: new Date(),
        author: person
    },
    tags: [{
        type: 'Blog.Tag',
        name: 'React'
    }, {
        type: 'Blog.Tag',
        name: 'CSS'
    }, {
        type: 'Blog.Tag',
        name: 'Micro-Frontends'
    }]
});
```

[Try it](/examples/fact/all-at-once)
