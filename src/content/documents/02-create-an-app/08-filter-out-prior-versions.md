---
title: "Filter Out Prior Versions"
---

The reason that the app is displaying all versions of a post title is that we did not filter out the prior versions.
We can do that with an existential condition `notExists`.
We only want the `PostTitle` facts that are not the `prior` of another `PostTitle`.

```tsx
const postsInSite = model.given(Site).match(site =>
  site.successors(Post, post => post.site)
    .select(post => ({
      hash: j.hash(post),
      titles: post.successors(PostTitle, title => title.post)
        .notExists(title => title.successors(PostTitle, next => next.prior))
        .select(title => title.value)
    }))
);
```

Take a look at the app now.
You should see only the latest version of the post title.

![Latest version of each post title](./attachments/post-one-title.png)

That's how you'll build an app using Jinaga.
Build something awesome!