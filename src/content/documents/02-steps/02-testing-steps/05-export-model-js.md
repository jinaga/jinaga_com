---
title: "Export the Model (JavaScript)"
---

We're having so much fun testing the app that we want to just keep going.
But the whole point of writing these tests is so that we can define a model.
We can use the model to create the UI and business logic for the app.
Let's take some of the specification functions we've written and move them to a model source file that can be used within the app.

## Exporting Specification Functions

Create a new file called `src/shared/model.js`.
Move the functions we've defined into that file.
Notice that to do that, we need to know what `j` is.
Before it was an instance of `Jinaga`, but now we'll define it as an alias for the `Jinaga` class itself.

```javascript
const { Jinaga: j, ensure } = require("jinaga");

function postsByAuthor(author) {
    return j.match({
        type: "Blog.Post",
        author
    });
}

function tagsForPost(post) {
    return j.match({
        type: "Blog.Post.Tags",
        post
    });
}

function tagValues(postTags) {
    ensure(postTags).has("tags");

    return j.match(postTags.tags);
}

module.exports = {
    postsByAuthor,
    tagsForPost,
    tagValues
};
```

Now that we've exported all of the functions, we can import them into the test.

```javascript
const { postsByAuthor, tagsForPost, tagValues } = require("./model");
```

## Exporting Fact Classes

In the tests, we've been creating facts as JSON literals.
But if we define a class, we can make it easier to create instances of a fact.
Setting the type as a prototype field makes it static.

```javascript
class User {
    constructor (
        publicKey
    ) {
        this.type = User.Type
        this.publicKey = publicKey
    }
}
User.Type = "Jinaga.User";

class Post {
    constructor (
        created,
        author
    ) {
        this.type = Post.Type;
        this.created = created;
        this.author = author;
    }
}
Post.Type = "Blog.Post";

module.exports = {
    User,
    Post
};
```

Then we can use the constructor to create instances.

```javascript
const person = await j.fact(
    new User("---Blog Creator---")
);

const post = await j.fact(
    new Post(new Date(), person)
);
```

And we can use the static type in template functions.

```javascript
function postsByAuthor(author) {
    return j.match({
        type: Post.Type,
        author
    });
}
```

We can even define the template functions on the class prototype to keep things organized.

```javascript
Post.byAuthor = function(author) {
    return j.match({
        type: Post.Type,
        author
    });
}
```

Then we can use that template function directly from the class.

```javascript
const posts = await j.query(person, j.for(Post.byAuthor));
```

Isn't that neater?