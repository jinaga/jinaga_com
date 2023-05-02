---
title: "j.watch"
---

If you are using React, you will call the `useSpecification` hook instead of directly using `j.watch`.

Call `j.watch` to run a specification and receive the results as they change.

```typescript
const projectsForUser = model.given(User).match((user, facts) =>
  facts.ofType(Project)
    .join(project => project.owner, user)
    .select(project => ({
      hash: j.hash(project),
      identifier: project.identifier
    })
  )
);

const projectWatch = j.watch(projectsForUser, user, (newProject) => {
  // Respond to a project being added to the result set.
  // newProject = {
  //   hash: "...",
  //   identifier: "..."
  // }
});
```

The callback will be called once for each result that is currently in the set.
Thereafter, it will be called whenever a result is added to the set.

## Observer

The `watch` function returns an `Observer<T>` object.

```typescript
interface Observer<T> {
  cached(): Promise<boolean>;
  loaded(): Promise<void>;
  stop(): Promise<void>;
}
```

The `cached` function returns a promise that resolves when the results are loaded from the local cache.
In the case of a web application using IndexedDB, this means that the results are loaded from the local database.
The promise will resolve to `true` if the cached results are fresh, or `false` if the results are stale.

The `loaded` function returns a promise that resolves when the results are loaded from the replicator.
When providing feedback to the user, you will typically wait for the `cached` promise to resolve before showing any feedback.
If `cached` resolves to `true`, you will immediately show the cached results.
However, if `cached` resolves to `false`, you will show a busy indicator.
Then you will wait for the `loaded` promise to resolve before displaying the results.
The `useSpecification` hook implements this pattern for you.

The `stop` function stops the observer.
The callback will no longer be called when facts are added to the result set.

## Results Removed

To be notified when a result is removed from the result set, return a function from the callback.
This will typically be used with a specification that has a `notExists` clause.

```typescript
const projectsForUser = model.given(User).match((user, facts) =>
  facts.ofType(Project)
    .join(project => project.owner, user)
    .notExists(project => facts.ofType(ProjectDeleted)
      .join(deleted => deleted.project, project)
    )
    .select(project => ({
      hash: j.hash(project),
      identifier: project.identifier
    })
  )
);

const projectWatch = j.watch(projectsForUser, user, (newProject) => {
  // Respond to a project being added to the result set.
  return () => {
    // Respond to that same project being removed from the result set.
  };
});
```

## Observable Collection

When the specification selects a property that is a sub-specification, the result will be an observable collection.
Ordinarily the result would be an array, but since we are using `j.watch`, we are interested in changes to that property.

An observable collection has an `onAdded` function that takes a callback.
The callback will be called for each child result added to the collection.

```typescript
const projectsForUser = model.given(User).match((user, facts) =>
  facts.ofType(Project)
    .join(project => project.owner, user)
    .select(project => ({
      hash: j.hash(project),
      names: facts.ofType(ProjectName)
        .join(name => name.project, project)
        .notExists(name => facts.ofType(ProjectName)
          .join(next => next.prior, name)
        )
        .select(name => name.value)
    })
  )
);

const projectWatch = j.watch(projectsForUser, user, (newProject) => {
  // Respond to a project being added to the result set.
  newProject.names.onAdded((name) => {
    // Respond to that project's name changing.
  });
});
```

The callback can return a function that will be called when the child result is removed from the collection.

## Asynchronous Callback

If the callback returns a promise, the observer will wait for the promise to resolve before calling the callback again.
This allows you to perform asynchronous operations such as updating a database, calling an API, or publishing a message.
This is typically done in a background process on a server or in a serverless function.

```typescript
const projectsToBeIndexed = model.given(Company).match((project, facts) =>
  facts.ofType(Project)
    .join(project => project.company, company)
    .notExists(project => facts.ofType(ProjectIndexed)
      .join(indexed => indexed.project, project)
    )
);

const projectWatch = j.watch(projectsToBeIndexed, company, async (project) => {
  await insertOrUpdateProjectIndex(project);
  await j.fact(new ProjectIndexed(project));
});
```

It is common for an asynchronous callback to finish by creating a fact using `j.fact`.
That fact should appear in the `notExists` clause of the specification.
This pattern ensures that the process can be restarted without re-processing results that have already been processed.