---
title: "Concepts"
---

Jinaga is a stae-management framework for building web applications, especially Progressive Web Applications that persist data for use while offline.
When building an application with Jinaga, you perform three basic operations:

- Storing information
- Writing specifications
- Retrieving information

You store information whenever the user performs an action.
This saves the data in local storage, sends it to the server, and updates the user interface.

```typescript
const post = await j.fact({
    type: "Blog.Post",
    created: new Date(),
    blog,
    author: person
});
```

You write a specification to describe the shape of the information you want to retrieve.
A specification function matches a template, and applies conditions.

```typescript
function publishedPostsByAuthor(author) {
    return j.match({
        type: "Blog.Post",
        author
    }).suchThat(postIsPublished);
}
```

You retrieve information any time you need the application to answer a question.
It could be a query that you run just when you need the data.

```typescript
const titles = await j.query(person, j
    .for(publishedPostsByAuthor)
    .then(titlesForPost));
```

Or it could be watching to for changes so that you can update the UI.

```typescript
const watch = j.watch(post,
    j.for(titlesForPost),
    title => $("h2").text(title.value));
```