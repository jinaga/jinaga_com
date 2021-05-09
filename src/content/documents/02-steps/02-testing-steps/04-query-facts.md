---
title: "Query Facts"
---

To query for related facts, you write a specification function.
The specification function matches facts of a certain type having specified predecessors.

## Query for Successors

To find successors, use `j.match` to identify the fields to match on.
You will always specify the `type` and one predecessor, which is usually the parameter.

```javascript
function postsByAuthor(author) {
    return j.match({
        type: "Blog.Post",
        author
    });
}
```

If you are using TypeScript, then specify a cast for the appropriate type.
The cast is erased during the compilation step, so you still have to specify the type as a string.
But this helps you verify that you are connecting your specification functions correctly.

```typescript
function postsByAuthor(author: Author) {
    return j.match(<Post>{
        type: "Blog.Post",
        author
    });
}
```

To run the query, use `j.query`.
Pass in the starting fact, and a preposition.
Create a preposition by passing the specification function to `j.for`.

```javascript
test("Can query for posts by author", async () => {
    const person = await j.fact({
        type: "Jinaga.User",
        publicKey: "---Blog Creator---"
    });

    await j.fact({
        type: "Blog.Post",
        created: new Date(),
        author: person
    });

    const posts = await j.query(person, j.for(postsByAuthor));

    expect(posts.length).toBe(1);
});
```

## Query for Predecessors

Sometimes you need to turn the corner and query for predecessors of a fact.
To do so, use the `ensure` function.
Import this function from `jinaga`:

```javascript
const { JinagaTest, ensure } = require("jinaga");
```

With this function, you can ensure that the parameter has a field.
Then you can use that field in a match.

Let's see an example.
First we will query down the graph for successors of the post.
These facts attach a collection of tags to a post.

```javascript
function tagsForPost(post) {
    return j.match({
        type: "Blog.Post.Tags",
        post
    });
}
```

Then we will turn the corner and query back up the graph.
We will get the predecessor tags themselves.
We must first ensure that the parameter has a field named `tags` so that we can match those tags.

```javascript
function tagValues(postTags) {
    ensure(postTags).has("tags");

    return j.match(postTags.tags);
}
```

To put those two template functions together, we combine `j.for` with `then`.

```javascript
const tags = await j.query(post, j.for(tagsForPost).then(tagValues));
```

When we run this combined query, it finds all tags that are associated with a given post.

```javascript
test("Can query for tags of posts", async () => {
    const tag1 = await j.fact({
        type: "Blog.Tag",
        name: "Historical Modeling"
    });

    const tag2 = await j.fact({
        type: "Blog.Tag",
        name: "Math"
    });

    const post = await j.fact({
        type: "Blog.Post",
        author: {
            type: "Jinaga.User",
            publicKey: "---"
        },
        title: "Idempotency"
    });

    await j.fact({
        type: "Blog.Post.Tags",
        post,
        tags: [ tag1, tag2 ]
    });

    const tags = await j.query(post, j.for(tagsForPost).then(tagValues));

    expect(tags.length).toBe(2);
    expect(tags[0].name).toBe("Historical Modeling");
    expect(tags[1].name).toBe("Math");
});
```