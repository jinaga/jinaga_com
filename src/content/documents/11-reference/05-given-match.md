---
title: "given.match"
---

Starting with a model, use the `given` and `match` functions to write a specification.
The specification can be used with `j.query`, `j.watch`, and `useSpecification` to retrieve results.

```typescript
const projectsForUser = model.given(User).match((user, facts) =>
  facts.ofType(Project)
    .join(project => project.owner, user)
    .notExists(project => facts.ofType(ProjectDeleted)
      .join(deleted => deleted.project, project))
    .select(project => ({
      hash: j.hash(project),
      identifier: project.identifier,
      names: facts.ofType(ProjectName)
        .join(name => name.project, project)
        .notExists(name => facts.ofType(ProjectName)
          .join(next => next.prior, name))
        .select(name => name.value)
    }))
  );
```

## Parameters

A specification takes one or more facts as parameters.
List the fact types in the `given` function.
The `match` function expects a callback that takes those facts as parameters.

```typescript
const tasksInProjectAssignedToUser = model.given(Project, User).match((project, user, facts) =>
  // ...
);
```

The last parameter of the `match` callback is the fact repository.

## Fact Repository

The fact repository has a method called `ofType` that takes a fact type as a parameter.
It returns a stream of facts of that type.

```typescript
const tasksInProjectAssignedToUser = model.given(Project, User).match((project, user, facts) =>
  facts.ofType(Task)
    // ...
);
```

## Join

Use the `join` method to filter the stream to only the facts related to a given fact.
The first parameter of `join` is a callback that returns a predecessor of the candidate fact.
The second parameter is the given fact or one of its predecessors.

To return successors, the first parameter should select a predecessor.

```typescript
const tasksInProjectAssignedToUser = model.given(Project, User).match((project, user, facts) =>
  facts.ofType(Task)
    .join(task => task.project, project)
    // ...
);
```

To return predecessors, the second parameter should select a predecessor.

```typescript
const companyOfProject = model.given(Project).match((project, facts) =>
  facts.ofType(Company)
    .join(company => company, project.company)
    // ...
);
```

Or to return siblings, both parameters should select a common predecessor.

```typescript
const otherProjectsInCompany = model.given(Project).match((project, facts) =>
  facts.ofType(Project)
    .join(other => other.company, project.company)
    // ...
);
```

## Exists and Not Exists

Use the `exists` method to filter the stream to only the facts that have a matching successor.
Pass a callback that takes the candidate fact.
The callback will use the fact repository to see if successors are present.

For example, to find all published posts, look for a successor of type `PostPublished`.

```typescript
const publishedPosts = model.given(Site).match((site, facts) =>
  facts.ofType(Post)
    .join(post => post.site, site)
    .exists(post => facts.ofType(PostPublished)
      .join(published => published.post, post))
    // ...
);
```

Use the `notExists` method to filter the stream to only the facts that do *not* have a matching successor.

### Deletion

It is common to use the `notExists` method to filter out deleted facts.

```typescript
const projectsForUser = model.given(User).match((user, facts) =>
  facts.ofType(Project)
    .join(project => project.owner, user)
    .notExists(project => facts.ofType(ProjectDeleted)
      .join(deleted => deleted.project, project))
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
const namesOfProject = model.given(Project).match((project, facts) =>
  facts.ofType(ProjectName)
    .join(name => name.project, project)
    .notExists(name => facts.ofType(ProjectName)
      .join(next => next.prior, name))
    // ...
);
```

The `exists` and `notExists` functions can only be called after `join`.
They cannot appear directly after `facts.ofType`.

```typescript
const projectsForUser = model.given(User).match((user, facts) =>
  facts.ofType(Project)
    .notExists(project => facts.ofType(ProjectDeleted)    // Incorrect.
      .join(deleted => deleted.project, project))
);
```

## Select Many

Use the `selectMany` function to bring in more facts from the fact repository.
Pass in a callback that takes a fact from the current stream.
Call `facts.ofType` to bring in more facts.

```typescript
const allProjectTasksForUser = model.given(User).match((user, facts) =>
  facts.ofType(Project)
    .join(project => project.owner, user)
    .selectMany(project => facts.ofType(Task)
      .join(task => task.project, project))
    // ...
);
```

## Select

Use the `select` function to project the results into your desired shape.
Pass in a callback that takes a fact from the current stream.
The callback can return results in a few specific ways.

### Field

To return the value of a field, access the field of a fact from a stream.

```typescript
const projectNames = model.given(Project).match((project, facts) =>
  facts.ofType(ProjectName)
    .join(name => name.project, project)
    .notExists(name => facts.ofType(ProjectName)
      .join(next => next.prior, name))
    .select(name => name.value)
);
```

### Hash

To return the hash of a fact, use the `j.hash` function.

```typescript
const projectHashes = model.given(Project).match((project, facts) =>
  facts.ofType(Project)
    .select(project => j.hash(project))
);
```

### Composite

To return a composite object, return an object from the callback.
You will usually do this inside of a `selectMany`, where you have given names to several stream facts.

```typescript
const projectHashesAndCompaniesForUser = model.given(User).match((user, facts) =>
  facts.ofType(Project)
    .join(project => project.owner, user)
    .selectMany(project => facts.ofType(Company)
      .join(company => company, project.company)
      .select(company => ({
        projectHash: j.hash(project),
        company: company
      }))
    )
);
```

The values of the properties of the returned object can be fields, hashes, facts, or sub-specifications.
If you want to return a predecessor fact in a property, please note that you must use the `selectMany` function to bring in that predecessor from the fact repository.
You cannot simply reference the predecessor while building the composite.

```typescript
const projectHashesAndCompaniesForUser = model.given(User).match((user, facts) =>
  facts.ofType(Project)
    .join(project => project.owner, user)
    .select(project => ({
      projectHash: j.hash(project),
      company: project.company      // Incorrect.
    }))
);
```

### Sub-Specification

Within a composite, you can call the `facts.ofType` function to begin a sub specification.
The sub specification will be evaluated for each fact in the current stream.
The result will be an array of those results.

```typescript
const projectHashesAndCompaniesForUser = model.given(User).match((user, facts) =>
  facts.ofType(Project)
    .join(project => project.owner, user)
    .select(project => ({
      projectHash: j.hash(project),
      names: facts.ofType(ProjectName)
        .join(name => name.project, project)
        .notExists(name => facts.ofType(ProjectName)
          .join(next => next.prior, name))
        .select(name => name.value)
    }))
);
```