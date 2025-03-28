---
title: "Distribution Rules"
---

Distribution rules are written in functions taking a `DistributionRules` object as a parameter.

```typescript
export const distribution = (r: DistributionRules) => r
    // rules...
```

### DistributionRules.share

Each rule describes what can be done with a specification.
Specifically, you share a specification with certain users.
Call the `share` method and pass in a specification.

```typescript
const distribution = (r: DistributionRules) => r
  .share(model.given(Blog).match(blog =>
    blog.successors(Post, post => post.blog)
      .exists(post => post.successors(Publish, publish => publish.post))
  )). // Then describe who to share it with
```

### ShareTarget.withEveryone

You can share a specification with everyone or with specific users.
If you share with everyone, then anybody can run that specification and see the results.

```typescript
export const distribution = (r: DistributionRules) => r
  // Everyone can see published posts
  .share(model.given(Blog).match(blog =>
    blog.successors(Post, post => post.blog)
      .exists(post => post.successors(Publish, publish => publish.post))
  )).withEveryone()
```

### ShareTarget.with

To control who can run the specification, share with specific users.
Call the `with` method and pass in a specification that selects the users.
The specification starts at the same givens as the specification you are sharing.

```typescript
export const distribution = (r: DistributionRules) => r
  // The creator can see all posts and comments
  .share(model.given(Blog).select(blog => ({
    posts: blog.successors(Post, post => post.blog),
    comments: blog.successors(Comment, comment => comment.post.blog)
  }))).with(model.given(Blog).match(blog =>
    blog.creator.predecessor()
  ))
  // A comment author can see their own comments on published posts
  .share(model.given(Blog, User).match((blog, author) =>
    blog.successors(Post, post => post.blog)
      .exists(post => post.successors(Publish, publish => publish.post))
      .selectMany(post => post.successors(Comment, comment => comment.post)
        .join(comment => comment.author, author)
      )
  )).with(model.given(Blog, User).select((blog, author) =>
    author
  ));
```

### DistributionRules.with

You can compose distribution functions using the `with` method.

```typescript
const otherDistributionFunction = (r: DistributionRules) => r
  // ...
  ;
const distribution = (r: DistributionRules) => r
  .with(otherDistributionFunction)
  ;
```
