---
title: "Restore"
---

For completion, let's talk about restoring a deleted fact.
You do this by defining yet another successor.

```typescript
class ProjectRestored {
  static Type = "Construction.Project.Restored" as const;
  type = ProjectRestored.Type;

  constructor(public deleted: ProjectDeleted) {}
}

await j.fact(new ProjectRestored(projectADeleted));
```

Don't forget to include the `ProjectRestored` type in your model:

```typescript
const constructionModel = (b: ModelBuilder) => b
  .type(Project, m => m
    .predecessor("creator", User)
  )
  .type(ProjectDeleted, m => m
    .predecessor("project", Project)
  )
  .type(ProjectRestored, m => m
    .predecessor("deleted", ProjectDeleted)
  )
  ;
```

Again, you need to add this fact to the specification for it to have an effect.

```typescript
const projectsCreatedByUser = model.given(User).match(u =>
  u.successors(Project, p => p.creator)
    .notExists(p => p.successors(ProjectDeleted, d => d.project)
      .notExists(d => d.successors(ProjectRestored, r => r.deleted)))
);

const projects = await j.query(projectsCreatedByUser, user);
```

```dot
digraph {
    rankdir=BT
    node [shape=none]
    "Gs+Fo0xO04hUAteaPwrHZDmyovTwr7asnKsBrkRf3HE3M9nYIj4Sk7ZhR8YK5uMq1SMHPrQohtQNwo9B7whK0w==" [label=<<TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0"><TR><TD COLSPAN="2">Jinaga.User</TD></TR><TR><TD>publicKey</TD><TD>--- TEST USER ---</TD></TR></TABLE>>]
    "PYaXGGp+ksHg101LgyF/pB/OBQsixEhWZ9RDW9wxdwX/sVFWgyhpOZROgi4Gttdz1lWJ5Un0pJPJ5MvXEk1TCQ==" [label=<<TABLE BORDER="1" CELLBORDER="1" CELLSPACING="0"><TR><TD COLSPAN="2">Construction.Project</TD></TR><TR><TD>id</TD><TD>52eb9df8-7b1c-43d4-9...</TD></TR></TABLE>>]
    "PYaXGGp+ksHg101LgyF/pB/OBQsixEhWZ9RDW9wxdwX/sVFWgyhpOZROgi4Gttdz1lWJ5Un0pJPJ5MvXEk1TCQ==" -> "Gs+Fo0xO04hUAteaPwrHZDmyovTwr7asnKsBrkRf3HE3M9nYIj4Sk7ZhR8YK5uMq1SMHPrQohtQNwo9B7whK0w==" [label=" creator"]
    "JXOsjjaGesPuW0QF0qHlsoB4DN1JtH2zTz/Suq7xdg0rGawLZCUz6zsCLCWblCX5nRZBytRLx6Anbjjw7PQUoQ==" [label=<<TABLE BORDER="1" CELLBORDER="1" CELLSPACING="0"><TR><TD COLSPAN="2">Construction.Project</TD></TR><TR><TD>id</TD><TD>967202a9-1b33-442e-8...</TD></TR></TABLE>>]
    "JXOsjjaGesPuW0QF0qHlsoB4DN1JtH2zTz/Suq7xdg0rGawLZCUz6zsCLCWblCX5nRZBytRLx6Anbjjw7PQUoQ==" -> "Gs+Fo0xO04hUAteaPwrHZDmyovTwr7asnKsBrkRf3HE3M9nYIj4Sk7ZhR8YK5uMq1SMHPrQohtQNwo9B7whK0w==" [label=" creator"]
    "2WpNSOBnSkJQIM5FTovNhnTl0PSzEJKWejcdVYUdoi2Rbgl2astIMjf6WwU8/farGnt5fRU8TmdJhNkD+hE41Q==" [label=<<TABLE BORDER="1" CELLBORDER="1" CELLSPACING="0"><TR><TD COLSPAN="2">Construction.Project</TD></TR><TR><TD>id</TD><TD>36b8402a-6993-4f89-a...</TD></TR></TABLE>>]
    "2WpNSOBnSkJQIM5FTovNhnTl0PSzEJKWejcdVYUdoi2Rbgl2astIMjf6WwU8/farGnt5fRU8TmdJhNkD+hE41Q==" -> "Gs+Fo0xO04hUAteaPwrHZDmyovTwr7asnKsBrkRf3HE3M9nYIj4Sk7ZhR8YK5uMq1SMHPrQohtQNwo9B7whK0w==" [label=" creator"]
}
```

And it's back!

The query logic can be broken down as follows:
- Find all projects created by the user
- Exclude projects that have a `ProjectDeleted` successor
- Unless that deletion has a `ProjectRestored` successor (using nested `notExists`)

This creates a complete delete/restore cycle where deleted items can be brought back into the active set.