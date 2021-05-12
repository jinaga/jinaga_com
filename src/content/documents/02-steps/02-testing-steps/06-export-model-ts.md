---
title: "Export the Model (TypeScript)"
---

If you are using TypeScript, exporting the model is an opportunity for you to nail the contract of your application.
A good solid model is a great foundation for every other part of your app.

## Define Classes

Create a new file called `src/shared/model.ts`.
We'll define a class for each kind of fact.

In the tests, we've been creating facts as JSON literals.
But if we define a class, we can make it easier to create instances of a fact.
Be sure to export each class.

Most of the fields of the class will be defined in the constructor.
The one exception is the type.
Define a capital `Type` as a static field, and use it to initialize a lower case `type` instance field.

Then define the remaining fields in the constructor.
Declare them as `public` to make them instance fields.

```typescript
export class User {
    static Type = "Jinaga.User";
    type = User.Type;

    constructor (
        public publicKey : string
    ) { }
}

export class Post {
    static Type = "Blog.Post";
    type = Post.Type;

    constructor (
        public created : Date | string,
        public author : User
    ) { }
}
```

Notice that we defined the type of `created` as either `Date` or `string`.
We expect the fact to be created with a date, but it will be converted to a string when it is serialized to JSON.

Now that we've exported all of the classes, we can import them into the test.

```javascript
import { User, Post } from "./model";
```

Then we can use the constructor to create instances.

```typescript
const person = await j.fact(
    new User("---Blog Creator---")
);

const post = await j.fact(
    new Post(new Date(), person)
);
```

So much cleaner.

## Exporting Specification Functions

Now that we have some classes, lets move those specification functions.
You'll have to choose a class as a host for each function.
Most of the time, the most natural class will be the type that it matches.
But sometimes, it will be the parameter type.
Look to see how you've named the function, and use the first noun as a guide.

Once you have identified a class, copy the specification function into it and declare it as static.

```typescript
export class Post {
    static Type = "Blog.Post";
    type = Post.Type;

    constructor (
        public created : Date | string,
        public author : User
    ) { }

    static byAuthor(author: Author) {
        return j.match(<Post>{
            type: Post.Type,
            author
        });
    }
}
```

Notice we made a couple of changes as we pasted it in.
First, we dropped the noun from the name.
That's already the class type!
Second, we declared the parameter type.
And third, we used the `Type` static field instead of the hard-coded string.

The fourth and most important change is that we defined a type cast for the JSON literal.
This helps your IDE to help you.
It will suggest the fields of the type.
It also cascades the type up through the specification function, so that the compiler can check that you are using it in the right context.

Notice that at first we get a compile error.
The compiler needs to know what `j` is.
Before it was an instance of `Jinaga`, but now we'll define it as an alias for the `Jinaga` class itself.

```typescript
import { Jinaga as j } from "jinaga";
```

Then you can use that template function directly from the class.

```javascript
const posts = await j.query(person, j.for(Post.byAuthor));
```

Isn't that neater?