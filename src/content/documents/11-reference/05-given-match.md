---
title: "given.match"
---

Starting with a model, use the `given` and `match` functions to write a specification.
The specification can be used with `j.query`, `j.watch`, and `useSpecification` to retrieve results.

```typescript
const projectsForUser = model.given(User).match(user =>
  user.successors(Project, project => project.owner)
    .notExists(project => project.successors(ProjectDeleted, deleted => deleted.project))
    .select(project => ({
      hash: j.hash(project),
      identifier: project.identifier,
      names: project.successors(ProjectName, name => name.project)
        .notExists(name => name.successors(ProjectName, next => next.prior))
        .select(name => name.value)
    }))
);
```

## Parameters

A specification takes one or more facts as parameters.
List the fact types in the `given` function.
The `match` function expects a callback that takes those facts as parameters.

```typescript
const tasksInProjectAssignedToUser = model.given(Project, User).match((project, user) =>
  // ...
);
```

## Successors

Use the `successors` method to produce a stream of related facts.
The first parameter of `successors` is the type of the successor you are looking for.
The second is a callback that takes a successor fact and shows how it is connected to the first.


```typescript
const tasksInProjectAssignedToUser = model.given(Project, User).match((project, user) =>
  user.successors(Task, task => task.project)
    // ...
);
```

Even though the method is called `successors`, it can be also used to return siblings.
Start from their common predecessor.

```typescript
const otherProjectsInCompany = model.given(Project).match(project =>
  project.company.successors(Project, other => other.company)
    // ...
);
```

## Predecessor

If instead of successors or siblings you want to produce a stream of predecessors, use the `predecessor` method.
Apply the method to the predecessor.

```typescript
const companyOfProject = model.given(Project).match(project =>
  project.company.predecessor()
    // ...
);
```

You can even use the `predecessor` method to get the fact itself.
This is necessary, for example, in a distribution rule where you want to match the user themselves.

```typescript
const distribution = (r: DistributionRules) => r
  .share(model.given(User).match(user =>
    user.successors(UserName, name => name.user)
      .notExists(name => name.successors(UserName, next => next.prior))
  )).with(user => user.predecessor())
```

## Exists and Not Exists

Use the `exists` method to filter the stream to only the facts that have a matching successor.
Pass a callback that takes the candidate fact.
The callback will use the fact repository to see if successors are present.

For example, to find all published posts, look for a successor of type `PostPublished`.

```typescript
const publishedPosts = model.given(Site).match(site =>
  site.successors(Post, post => post.site)
    .exists(post => post.successors(PostPublished, published => published.post))
    // ...
);
```

Use the `notExists` method to filter the stream to only the facts that do *not* have a matching successor.

### Deletion

It is common to use the `notExists` method to filter out deleted facts.

```typescript
const projectsForUser = model.given(User).match(user =>
  user.successors(Project, project => project.owner)
    .notExists(project => project.successors(ProjectDeleted, deleted => deleted.project))
    // ...
);
```

### Mutable Properties

It is also common to use `notExists` to simulate mutable properties.
Define a fact type for the property.
Give that fact an array of `prior` values.

```typescript
class ProjectName {
  static Type = 'Project.Name' as const;
  type = ProjectName.Type;

  constructor(
    public project: Project,
    public value: string,
    public prior: ProjectName[]
  ) { }
}
```

Then, to find the current value, filter out the facts that have a newer value.

```typescript
const namesOfProject = model.given(Project).match(project =>
  project.successors(ProjectName, name => name.project)
    .notExists(name => name.successors(ProjectName, next => next.prior))
    // ...
);
```

## Select Many

Use the `selectMany` function to bring in more facts.
Pass in a callback that takes a fact from the current stream.
Call `successors` to bring in more facts.

```typescript
const allProjectTasksForUser = model.given(User).match(user =>
  user.successors(Project, project => project.owner)
    .selectMany(project => project.successors(Task, task => task.project))
);
```

## Select

Use the `select` function to project the results into your desired shape.
Pass in a callback that takes a fact from the current stream.
The callback can return results in a few specific ways.

### Field

To return the value of a field, access the field of a fact from a stream.

```typescript
const projectNames = model.given(Project).match(project =>
  project.successors(ProjectName, name => name.project)
    .notExists(name => name.successors(ProjectName, next => next.prior))
    .select(name => name.value)
);
```

### Hash

To return the hash of a fact, use the `j.hash` function.

```typescript
const projectHashes = model.given(Project).match(project =>
  project.predecessor()
    .select(project => j.hash(project))
);
```

### Composite

To return a composite object, return an object from the callback.
You will usually do this inside of a `selectMany`, where you have given names to several stream facts.

```typescript
const projectHashesAndCompaniesForUser = model.given(User).match(user =>
  user.successors(Project, project => project.owner)
    .selectMany(project => project.company.successors(Company, company => company)
      .select(company => ({
        projectHash: j.hash(project),
        company: company
      }))
    )
);
```

The values of the properties of the returned object can be fields, hashes, facts, or sub-specifications.
They cannot be predecessors.
If you want to return a predecessor fact in a property, you must use the `selectMany` and `successors` functions as shown above.
You cannot simply reference the predecessor while building the composite.

```typescript
const projectHashesAndCompaniesForUser = model.given(User).match(user =>
  user.successors(Project, project => project.owner)
    .select(project => ({
      projectHash: j.hash(project),
      company: project.company      // Incorrect.
    }))
);
```

### Sub-Specification

Within a composite, you can call the `successors` function to begin a sub specification.
The sub specification will be evaluated for each fact in the current stream.
The result will be an array of those results.

```typescript
const projectHashesAndCompaniesForUser = model.given(User).match(user =>
  user.successors(Project, project => project.owner)
    .select(project => ({
      projectHash: j.hash(project),
      names: project.successors(ProjectName, name => name.project)
        .notExists(name => name.successors(ProjectName, next => next.prior))
        .select(name => name.value)
    }))
);
```
