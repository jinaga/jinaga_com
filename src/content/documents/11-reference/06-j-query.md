---
title: "j.query"
---

Use the `j.query` function to run a specification and retrieve the results.

```typescript
const projectsForUser = model.given(User).match(user =>
  user.successors(Project, project => project.owner)
    .select(project => ({
      hash: j.hash(project),
      identifier: project.identifier
    }))
);

const projects = await j.query(projectsForUser, user);

// projects = [{
//   hash: "..."
//   identifier: "..."
// }, ...]
```

This asynchronous function returns an array of results.