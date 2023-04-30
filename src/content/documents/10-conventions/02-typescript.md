---
title: "TypeScript"
---

When using TypeScript, Jinaga can verify that specification functions are used correctly.
This works best when fact types are specified as classes.

Specify the type string as an upper-case static field, and use it to initialize a lower-case instance field.
Use the `as const` type decoration so that the `Type` static (and subsequent `type` field) are strictly typed rather than allowing any `string`.
Initialize all other fields by declaring them as `public` constructor parameters.
The body of the constructor should be empty.

```typescript
class Tag {
    static Type = "Blog.Tag" as const;
    type = Tag.Type;

    constructor(
        public name: string
    ) { }
}
```

A fact can then be created with the `new` operator.

```typescript
const tagReact = await j.fact(new Tag("React"));
```

## Date Fields

It is common to use a date as a uniquely identifying field of a fact.
But facts are converted into JSON, which does not directly support the `Date` type.
Those fields will be converted to strings.

When declaring a date field in a fact, give it the type `Date | string`. This will allow you to create the fact using `new Date()`, but yet read the field as a string.

```typescript
class Post {
    static Type = "Blog.Post" as const;
    type = Post.Type;

    constructor (
        public created: Date | string,
        public author: Author
    ) { }
}
```

Dates will be converted into strings using ISO-8601 format and the UTC time zone.
As a result, they are portable across time zones within an application, and sort lexically.
