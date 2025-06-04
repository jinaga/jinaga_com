---
title: "Restore"
---

For completion, let's talk about restoring a deleted fact.
You do this by defining yet another successor.

```csharp
[FactType("Construction.Project.Restored")]
public record ProjectRestored(ProjectDeleted deleted);

await j.Fact(new ProjectRestored(projectADeleted));
```

Again, you need to add this fact to the specification for it to have an effect.

```csharp
var projectsCreatedByUser = Given<User>.Match(u =>
    u.Successors().OfType<Project>(p => p.creator)
        .Where(p => !p.Successors().OfType<ProjectDeleted>(d => d.project).Any(
            d => !d.Successors().OfType<ProjectRestored>(r => r.deleted).Any()))
);

ImmutableList<Project> projects = await j.Query(projectsCreatedByUser, user);
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

### Pattern Extensions

Because these are such common patterns, Jinaga provides some shorthand extensions to make them easier to write.
You can find these in the `Jinaga.Patterns` namespace.

```csharp
using Jinaga.Patterns;

var projectsCreatedByUserWithoutRestore = Given<User>.Match(u =>
    u.Successors().OfType<Project>(p => p.creator)
        .WhereNotDeleted((ProjectDeleted d) => d.project)
);

var projectsCreatedByUserWithRestore = Given<User>.Match(u =>
    u.Successors().OfType<Project>(p => p.creator)
        .WhereNotDeletedOrRestored((ProjectDeleted d) => d.project,
            (ProjectRestored r) => r.deleted)
);
```