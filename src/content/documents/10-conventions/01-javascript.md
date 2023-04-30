---
title: "JavaScript"
---

The `class` feature of modern JavaScript offers a good way to group a fact constructor with a set of specification functions.
The type is added as a prototype field.

```javascript
class Tag {
    constructor(
        name
    ) {
        this.type = Tag.Type;
        this.name = name;
    }
}
Tag.Type = "Blog.Tag";
```

A fact can then be created with the `new` operator.

```javascript
const tagReact = await j.fact(new Tag("React"));
```
