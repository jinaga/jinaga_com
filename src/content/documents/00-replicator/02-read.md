---
title: "Read"
---

To read data, `POST` a request to `http://localhost:8080/jinaga/read`.
The body of the request should be raw text (`Content-Type: text/plain`).
It is expressed in the Jinaga specification language.

The Jinaga specification language lets you declare a set of input facts, a specification body, and projections.
The parts fit together like this:

```specification
let variable: Type = <fact>

(given: Type) {
    <specification body>
} => <projection>
```

The descriptions of those three parts appears below.

## Facts

The first part is a set of facts.
List these facts as you would for the `/jinaga/write` endpoint.
These facts won't be inserted.
Instead, they will be used as parameters to the specification.


You declare a fact as a JSON object.
Include the values of all the fields, and the predecessor facts.
Predecessors may be collected in an array.
Predecessors must be declared separately; you cannot inline a predecessor.

You may also give the hash of a known fact.
You can find the hash by performing a query and projecting the object using the # prefix.
To use the hash in a later query, prefix the base64 hash code with #.

```specification
let post: Blog.Post = #ONZGu5Uvdcdr...+igirQ==
```

The variable names must match the parameters to the specification.
Those facts are the starting point for the query.

## Specification Body

Once you have a starting point, you will want to look for related facts.
The specification body matches facts based on their relationship to the givens and to each other.

The body of a specification defines a list of unknowns.
Declare an unknown by name and type.
Then in square brackets, list conditions that relate the unknown to the givens.

```specification
comment: Blog.Comment [
    <conditions>
]
```

One kind of condition is a path.
Paths join the declared unknown to givens or previously declared unknowns.

```specification
comment->post: Blog.Post = post
```

The arrow indicates that we are following an edge up to a predecessor.
The name and type of that predecessor appear after the arrow.
You can use as many arrows as you need on both the left and right side.

Another type of condition is an existential.
It says whether it's looking for something to exist (`E`) or not exist (`!E`).
And then it declares another tuple.

```specification
E {
    approval: Blog.Comment.Approval [
        approval->comment: Blog.Comment = comment
    ]
}
```

A positive existential condition will be true if any tuple of facts match the unknowns.
A negative existential condition will match if none do.

## Projection

So far you have some facts that are used as givens, and a list of unknowns with conditions.
If you run this specification, you will see all of the tuples of facts that match these unknowns.
But you might want to reshape your results.

Projections turn tuples into meaningful results.
They can select fields or hashes of facts in the tuple.

```specification
=> {
    id = #comment
    createdAt = comment.createdAt
    post = #post
}
```

A projection can also run child specifications.
A child specification has its own list of unknowns.
It can even have its own projection.

```specification
from = {
    user: Jinaga.User [
        user = comment->from: Jinaga.User
    ]
    userName: Blog.User.Name [
        userName->user: Jinaga.User = user
        !E {
            next: Blog.User.Name [
                next->prior: Blog.User.Name = userName
            ]
        }
    ]
} => userName.value
```

This lets you build up a JSON structure containing just what you want.

## Example

Here is the complete example that we built:

```specification
let post: Blog.Post = #ONZGu5Uvdcdr...+igirQ==

(post: Blog.Post) {
    comment: Blog.Comment [
        comment->post: Blog.Post = post
        E {
            approval: Blog.Comment.Approval [
                approval->comment: Blog.Comment = comment
            ]
        }
    ]
} => {
    id = #comment
    createdAt = comment.createdAt
    post = #post
    from = {
        user: Jinaga.User [
            user = comment->from: Jinaga.User
        ]
        userName: Blog.User.Name [
            userName->user: Jinaga.User = user
            !E {
                next: Blog.User.Name [
                    next->prior: Blog.User.Name = userName
                ]
            }
        ]
    } => userName.value
}
```