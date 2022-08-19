---
title: "Write"
---

To store data, `POST` a request to `http://localhost:8080/jinaga/write`.
The body of the request should be raw text (`Content-Type: text/plain`).
It is expressed as the Jinaga fact language.

## Facts

All of the facts written in the request body will be inserted into the Replicator's database.
Give each fact a variable name, a type, and a set of fields.

```specification
let site: Blog.Site = {
    domain: "qedcode.com"
}
```

## Predecessors

You can use the variable to declare a predecessor of another fact.

```specification
let post: Blog.Post = {
    createdAt: "2022-08-16T15:23:13.231Z",
    site: site
}
```

If the predecessor has the same name as the variable, you can simplify it.

```specification
let post: Blog.Post = {
    createdAt: "2022-08-16T15:23:13.231Z",
    site
}
```

## Arrays

To define an array of predecessors, use square brackets.
You can supply empty square brackets for an empty array.

```specification
let title: Blog.Post.Title = {
    post,
    value: "Introducing Jinaga Replicator",
    prior: []
}
```

Or you can list any number of previously defined facts.

```specification
let title2: Blog.Post.Title = {
    post,
    value: "Introduction to the Jinaga Replicator",
    prior: [ title ]
}
```

You may not define predecessors inline.
Give each fact its own distinct variable name.