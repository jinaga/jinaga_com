---
title: "Real-Time Updates"
---

To enable real-time updates in your Jinaga application, simply change the `useSpecification` hook to `useSubscription`.
This will maintain a persistent connection to the replicator and update the UI whenever new facts are created.

Here's how you can modify your existing code to use `useSubscription`:

```tsx
const { loading, data, error } = useSubscription(j, postsInSite, site);
```

That is it!
When a new post is created, the replicator will send the new post to the client, and it will appear on the user interface without needing to refresh the page.

## Testing Real-Time Updates

To test real-time updates, you can use the [`/write`](../../replicator/write/) endpoint to insert new facts into the replicator.
Create a new post and observe the updates in your app.

Edit the content of the HTTP POST to add a new post to the `qedcode.com` blog:

```specification
let site: Blog.Site = {
    domain: "qedcode.com"
}

let post: Blog.Post = {
    createdAt: "2024-11-24T11:43:42.037Z",
    site
}

let title: Blog.Post.Title = {
    post,
    value: "Real-Time Updates with Jinaga",
    prior: []
}
```

When you execute this request, you should see the new post appear in your app without needing to refresh the page.
Give it a try!
