---
title: "Projections"
---

You can combine specifications to create a *projection*.
This is how you will populate your user interface.

Start your specification as before, and then use the `Select` method to project the results through a new specification.

```csharp
var projectsWithNameCreatedByUser = Given<User>.Match(u =>
    u.Projects.Select(p =>
        new
        {
            ProjectId = p.id,
            Name = p.Names.Select(n => n.name)
        }
    )
);
```

Let's give names to the other projects so that we can see them.

```csharp
await j.Fact(new ProjectName(projectB, "Pinecrest School Expansion", []));
await j.Fact(new ProjectName(projectC, "Brookside Office Park Fit-Out", []));
```

And now we can use that projection to populate a user interface.

```csharp
var projections = await j.Query(projectsWithNamesCreatedByUser, user);

projections.Select(p => new
{
    p.ProjectId,
    Names = $"[ {string.Join(", ", p.Names)} ]"
}).AsTable()
```

| ProjectId | Names |
| --- | --- |
| 52eb9df8-7b1c-43d4-9cae-710066d54694 | [ "Rivercrest Remodel" ] |
| 967202a9-1b33-442e-820a-624e3a51716b | [ "Pinecrest School Expansion" ] |
| 36b8402a-6993-4f89-aa99-d1ed50ed25f0 | [ "Brookside Office Park Fit-Out" ] |