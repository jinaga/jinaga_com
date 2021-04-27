---
title: "Creating Related Facts"
---

The whole idea of Jinaga is that you are capturing immutable facts related to one another.
These relationships are called "predecessors".
The first fact you create has no predecessors; it's the first!
But subsequent facts refer to their predecessors as fields.

## Singular Predecessor

Most of the time, the predecessor is a singular fact.
You simply set a field to the predecessor fact.
Think of this as a pointer or reference in an object-oriented language, or a foreign key if you are relationally inclined.

For example, to create a blog post that refers to its author as a predecessor, you can write this test:

```javascript
test("Can create a fact with a predecessor", async () => {
    const person = await j.fact({
        type: "Jinaga.User",
        publicKey: "---IF THIS WERE A REAL USER, THEIR PUBLIC KEY WOULD BE HERE---"
    });

    const post = await j.fact({
        type: "Blog.Post",
        created: new Date(),
        author: person
    });

    expect(post.author.publicKey).toBe("---IF THIS WERE A REAL USER, THEIR PUBLIC KEY WOULD BE HERE---");
});
```

## Multiple Predecessors

Sometimes a fact has multiple predecessors.
Represent this as an array of predecessor facts.
The array doesn't necessarily have to contain two or more facts.
It could be empty, or even have just one predecessor if it needs to.

As an example, you can add tags to a blog post.

```javascript
test("Can add several tags to a post", async () => {
    const person = await j.fact({
        type: "Jinaga.User",
        publicKey: "---IF THIS WERE A REAL USER, THEIR PUBLIC KEY WOULD BE HERE---"
    });

    const tag1 = await j.fact({
        type: "Blog.Tag",
        name: "Historical Modeling"
    });

    const tag2 = await j.fact({
        type: "Blog.Tag",
        name: "Math"
    });

    const tags = await j.fact({
        type: "Blog.Post.Tags",
        post: {
            type: "Blog.Post",
            author: person,
            title: "Idempotency"
        },
        tags: [ tag1, tag2 ]
    });

    expect(tags.tags[0].name).toBe("Historical Modeling");
    expect(tags.tags[1].name).toBe("Math");
});
```

Storing facts is great, but we really want to query them.