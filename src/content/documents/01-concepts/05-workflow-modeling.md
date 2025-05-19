---
title: "Workflow Modeling"
---

In Jinaga, you don’t store the *current* status of an object. You store the **events** that represent progress through a process. These events are immutable facts that don’t overwrite each other—they accumulate.

To determine the current state, you ask:
**What events have occurred—and which haven’t?**

---

### Modeling Task Workflow

Let’s say a task can be completed or blocked. We’ll represent each of those transitions with a fact.

```typescript
export class TaskCompleted {
  static Type = "Construction.Task.Completed" as const;
  public type = TaskCompleted.Type;

  constructor(
    public task: Task,
    public completedAt: Date
  ) { }
}

export class TaskBlocked {
  static Type = "Construction.Task.Blocked" as const;
  public type = TaskBlocked.Type;

  constructor(
    public task: Task,
    public reason: string,
    public blockedAt: Date
  ) { }
}
```

Each fact captures a **single decision** at a point in time:

* The task was completed at a specific date
* The task was blocked for a specific reason

These are not mutually exclusive—Jinaga can store both. You interpret “current state” by checking which facts exist.

---

### Registering the Facts

```typescript
export const constructionModel = (b: ModelBuilder) => b
  .type(Project)
  .type(Task, t => t
    .predecessor("project", Project))
  .type(TaskCompleted, c => c
    .predecessor("task", Task))
  .type(TaskBlocked, b => b
    .predecessor("task", Task));
```

---

### Specification: Tasks That Are Not Completed

```typescript
const openTasks = model.given(Project).match(project =>
  project.successors(Task, task => task.project)
    .notExists(task =>
      task.successors(TaskCompleted, c => c.task)
    )
    .select(task => ({
      hash: j.hash(task)
    }))
);
```

This returns all tasks for a project that do **not** have a `TaskCompleted` fact.

---

### Specification: Tasks That Are Blocked

```typescript
const blockedTasks = model.given(Project).match(project =>
  project.successors(Task, task => task.project)
    .exists(task =>
      task.successors(TaskBlocked, b => b.task)
    )
    .select(task => ({
      hash: j.hash(task)
    }))
);
```

This returns tasks with *at least one* blocking event—regardless of whether they’ve also been completed.

---

### Why This Works

Jinaga’s workflow modeling is based on:

* Recording decisions as discrete facts
* Avoiding shared mutable state
* Deriving “current” views by querying fact presence or absence

This lets you support offline edits, parallel changes, and full audit history—without race conditions or lost updates.
