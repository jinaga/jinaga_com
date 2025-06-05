---
title: "Read"
---

The `/read` endpoint lets you look at the data in your replicator.
It is not used in production.
Instead, it is a convenient way to view the data in your replicator for testing.

To read data, `POST` a request to `/read`.
The body of the request should be raw text (`Content-Type: text/plain`).
You can download an <a href="/Jinaga%20Blog%20Example.postman_collection.json" download>example Postman collection</a> and enter your own replicator URL.
Open the request called "Read blog posts".

The body is expressed in the Jinaga specification language.
The Jinaga specification language lets you declare a set of input facts, a specification body, and projections.
Here's an example specification:

```specification
let site: Blog.Site = {
    domain: "qedcode.com"
}

(site: Blog.Site) {
    post: Blog.Post [
        post->site: Blog.Site = site
        !E {
            deleted: Blog.Post.Deleted [
                deleted->post: Blog.Post = post
            ]
        }
    ]
} => {
    id = #post
    createdAt = post.createdAt
    titles = {
        title: Blog.Post.Title [
            title->post: Blog.Post = post
            !E {
                next: Blog.Post.Title [
                    next->prior: Blog.Post.Title = title
                ]
            }
        ]
    } => title.value
}
```

Let's go through this specification step by step.

## Facts

The first part is a set of facts.
List these facts as you would for the `/write` endpoint.
These facts won't be inserted.
Instead, they will be used as parameters to the specification.

You declare a fact as a JSON object.
Include the fields and predecessors.

```specification
let site: Blog.Site = {
    domain: "qedcode.com"
}
```

The variable names must match the parameters to the specification.
Those facts are the starting point for the query.

```specification
(site: Blog.Site) {
    <specification body>
}
```

## Specification Body

Once you have a starting point, you will want to look for related facts.
The specification body matches facts based on their relationship to the givens and to each other.

The body of a specification defines a list of unknowns.
Declare an unknown by name and type.
Then in square brackets, list conditions that relate the unknown to the givens.

```specification
post: Blog.Post [
    <conditions>
]
```

One kind of condition is a path.
Paths join the declared unknown to givens or previously declared unknowns.

```specification
post->site: Blog.Site = site
```

The arrow indicates that we are following an edge up to a predecessor.
The name and type of that predecessor appear after the arrow.
You can use as many arrows as you need on both the left and right side.

Another type of condition is an existential.
It says whether it's looking for something to exist (`E`) or not exist (`!E`).
And then it declares another tuple.

```specification
!E {
    deleted: Blog.Post.Deleted [
        deleted->post: Blog.Post = post
    ]
}
```

A positive existential condition will be true if any tuple of facts match the unknowns.
A negative existential condition will match if none do.

## Projection

So far you have some facts that are used as givens, and a list of unknowns with conditions.
If you run this specification, you will see all of the tuples of facts that match these unknowns.

```json
[
  {
    "post": {
      "createdAt": "2023-04-28T23:53:00Z"
    }
  }
]
```

But you might want to reshape your results.

Projections turn tuples into meaningful results.
They can select fields or hashes of facts in the tuple.

```specification
=> {
    id = #post
    createdAt = post.createdAt
}
```

This should now return the following:

```json
[
  {
    "id": "SV3Yseb0FJ/uQoL4IelHHbo1g4PZjnP4bx+aivMiiCkSTn2vSaNR6314KXL+PgO9lX9jmJzWoZABTRHjiFHWdQ==",
    "createdAt": "2023-04-28T23:53:00Z"
  }
]
```

A projection can also run child specifications.
A child specification has its own list of unknowns.
It can even have its own projection.

```specification
titles = {
    title: Blog.Post.Title [
        title->post: Blog.Post = post
        !E {
            next: Blog.Post.Title [
                next->prior: Blog.Post.Title = title
            ]
        }
    ]
} => title.value
```

Run it now and you will see these results:

```json
[
  {
    "id": "SV3Yseb0FJ/uQoL4IelHHbo1g4PZjnP4bx+aivMiiCkSTn2vSaNR6314KXL+PgO9lX9jmJzWoZABTRHjiFHWdQ==",
    "createdAt": "2023-04-28T23:53:00Z",
    "titles": [
      "Introduction to the Jinaga Replicator"
    ]
  }
]
```

This lets you build up a JSON structure containing just what you want.
