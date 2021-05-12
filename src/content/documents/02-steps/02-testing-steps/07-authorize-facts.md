---
title: "Authorize Facts"
---

Adding facts have so far been wide open.
Anybody could do it.
But now we want to lock it down so that only certain people can create certain facts.

## Simulate a Logged In User

The first thing we need to do is simulate a user being logged in.
The tests will behave as if this user had authenticated.
We can pass that user to the `JinagaTest.create` function.

```javascript
beforeEach(() => {
    j = JinagaTest.create({
        user: new User("---Blog Creator---")
    });
});
```

Now when you call the `login` function, this is the user that you will get back.

```javascript
test("Blog creator is logged in", async () => {
    const { userFact: user } = await j.login();

    expect(user.publicKey).toBe("---Blog Creator---");
});
```

## Set Up Authorization Rules

The real reason for simulating a logged-in user is to test your authorization rules.
Create an authorization rules function in your `src/shared/model.js`.

```javascript
function authorize(a) {
    return (a
        .any(User.Type)
    );
}

module.exports = {
    authorize
};
```

And then import it and pass it into `JinagaTest.create`.

```javascript
const { authorize } = require("./model");

beforeEach(() => {
    j = JinagaTest.create({
        user: new User("---Blog Creator---"),
        authorization: authorize
    });
});
```

Watch in despair as all of your tests fail!
The user is no longer authorized to create any of those facts.
We will have to add authorization rules one-by-one.

## Authorize Facts

One at a time, make your tests pass by creating authorization rules.
I'll get you started.

An authorization rule uses a predicate, just like a query does.
The predicate returns the user who is authorized to create that fact.
For example, a `Post` can be created by its author.
This seems a bit redundant, but it's actually quite an important rule.
It prevents people from spoofing a post and pretending that it was authored by someone else.

We will first need a specification function that returns the author of a post.
Add this to the `Post` class.

```javascript
Post.author = function(post) {
    ensure(post).has("author");
    return j.match(post.author);
}
```

Then we can write the authorization rule.

```javascript
function authorize(a) {
    return (a
        .any(User.Type)
        .type(Post.Type, j.for(Post.author))
    );
}
```

Once you add this authorization rule, some of your tests will start passing.
Keep going and write authorization rules for the remainder of your tests.

## Hint

Are you sure you don't want to do it for yourself?
OK, here is the specification function you will need.

```javascript
PostTags.post = function(postTags) {
    ensure (postTags).has("post");
    return j.match(postTags.post);
}
```

Anybody should be able to create a tag.
But only the author of a post can put tags on it.

Are you sure you don't want to write those rules yourself?
It's pretty fun!

Well, OK.
Here you go.

```javascript
function authorize(a) {
    return (a
        .any(User.Type)
        .type(Post.Type, j.for(Post.author))
        .any(Tag.Type)
        .type(PostTags.Type, j.for(PostTags.post).then(Post.author))
    );
}
```

See?
That's not so bad.
And now all of the tests pass!

I love writing authorization rules for tests.
It puts the idea of security right up front where it belongs.