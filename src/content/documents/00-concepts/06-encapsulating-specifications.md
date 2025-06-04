---
title: "Encapsulating Specifications"
---

You can give a specification a name and attach it to a fact type.
Use the `Relation` type to define a property.

```csharp
[FactType("Construction.Project")]
public record Project(User creator, Guid id)
{
    public Relation<ProjectName> Names => Relation.Define(_ =>
        this.Successors().OfType<ProjectName>(n => n.project)
            .WhereCurrent((ProjectName next) => next.prior)
    );
}

var namesOfProject = Given<Project>.Match(p =>
    p.Names
);
```

Since the `Jinaga.User` type is defined in the Jinaga library, you need to use an extension member to add a relation to it.

```csharp
public static class UserExtensions
{
    extension(User user)
    {
        public Relation<Project> Projects => Relation.Define(_ =>
            user.Successors().OfType<Project>(p => p.creator)
                .WhereNotDeletedOrRestored((ProjectDeleted d) => d.project,
                    (ProjectRestored r) => r.deleted));
    }
}

var projectsCreatedByUser = Given<User>.Match(u =>
    u.Projects
);
```