---
title: "Encapsulating Specifications"
---

You can give a specification a name and attach it to a fact type.
This is a convenient pattern for making specifications more readable, composable, and reusable.

Define a static function on the target fact type.
Use the `LabelOf<T>` type decorator to take an input fact.
By convention, the name of the function should be a preposition, like `in`, `on`, `by`, or `of`.

```typescript
class ProjectName {
  static Type = "Construction.Project.Name" as const;
  type = ProjectName.Type;

  constructor(public project: Project, public value: string, public prior: ProjectName[]) {}

  static of(project: LabelOf<Project>) {
    return project.successors(ProjectName, name => name.project)
      .notExists(name => name.successors(ProjectName, next => next.prior));
  }
}
```

You can use this static function in place of the full specification.

```typescript
const namesOfProject = model.given(Project).match(project =>
  ProjectName.of(project)
);
```

For completeness, here is the encapsulated specification for the projects.

```typescript
class Project {
  static Type = "Construction.Project" as const;
  type = Project.Type;

  constructor(public creator: User, public id: string) {}

  static by(user: LabelOf<User>) {
    return user.successors(Project, p => p.creator)
      .notExists(p => p.successors(ProjectDeleted, d => d.project)
        .notExists(d => d.successors(ProjectRestored, r => r.deleted)));
  }
}
```

That's about to come in handy.