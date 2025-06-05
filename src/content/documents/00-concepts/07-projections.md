---
title: "Projections"
---

You can combine specifications to create a *projection*.
This is how you will populate your user interface.

Start your specification as before, and then use the `select` method to project the results through a new specification.

```typescript
const projectsWithNamesCreatedByUser = model.given(User).match(u =>
  Project.by(u)
    .select(p => ({
      projectId: p.id,
      names: ProjectName.of(p)
        .select(n => n.value)
    }))
);
```

Let's give names to the other projects so that we can see them.

```typescript
await j.fact(new ProjectName(projectB, "Pinecrest School Expansion", []));
await j.fact(new ProjectName(projectC, "Brookside Office Park Fit-Out", []));
```

And now we can use that projection to populate a user interface.

```typescript
const projections = await j.query(projectsWithNamesCreatedByUser, user);

projections.forEach(p => {
  console.log(`${p.projectId}: [${p.names.join(", ")}]`);
});
```

| ProjectId | Names |
| --- | --- |
| 52eb9df8-7b1c-43d4-9cae-710066d54694 | [ "Rivercrest Remodel" ] |
| 967202a9-1b33-442e-820a-624e3a51716b | [ "Pinecrest School Expansion" ] |
| 36b8402a-6993-4f89-aa99-d1ed50ed25f0 | [ "Brookside Office Park Fit-Out" ] |