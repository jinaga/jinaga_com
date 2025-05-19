---
title: "Authorization"
---

In Jinaga, authorization rules define who is allowed to create a particular type of fact. These rules are enforced automatically—on every device and by every replicator—so unauthorized users can’t insert facts, even when offline.

Authorization is expressed in terms of relationships between facts, not mutable roles or centralized permissions. This matches Jinaga’s causal model: users are allowed to take actions when there’s a path through existing facts that gives them that authority.

## Who Defines the Authorization?

Unlike traditional systems where you check a user’s role, in Jinaga you define who is authorized to create a fact by starting from that fact. That’s the key shift in thinking:

You don’t ask “what can this user do?”
You ask “who is allowed to create this kind of fact?”

This feels backwards at first—but it’s what makes decentralized collaboration possible.

## Anyone Can Introduce a User

Some facts should be widely creatable. For example, we want people to be able to talk about other users—such as when inviting them to a project.

```typescript
authorization.any(User);
```

This rule means that any authenticated user can create a User fact, not just their own.

## Introducing Project Administrators

Let’s model the idea of a user being authorized to act on a project. We introduce a new fact:

```typescript
export class ProjectAdmin {
  static Type = "Construction.Project.Admin" as const;
  public type = ProjectAdmin.Type;

  constructor(
    public project: Project,
    public administrator: User,
    public createdAt: Date | string
  ) { }
}
```

This fact says:

“This user was made an administrator of this project at this time.”

This fact is immutable. If you want to revoke access, you’ll add a separate ProjectAdminRevoked fact, which we’ll cover later.

## Only Administrators Can Create Tasks

Let’s say we want to authorize a Task only if the user is an admin of its project.

```typescript
authorization.type(Task, model.given(Task).match(task =>
  task.project
    .successors(ProjectAdmin, pa => pa.project)
    .selectMany(pa => pa.administrator.predecessor())
));
```

Let’s unpack this:

| Step | Meaning |
|------|---------|
| model.given(Task) | We’re authorizing the creation of a Task. |
| task.project | Follow the task’s link to its project. |
| .successors(ProjectAdmin, pa => pa.project) | From the project, find all ProjectAdmin facts. |
| .selectMany(pa => pa.administrator.predecessor()) | Extract each admin user from those facts. |

This rule says: “If a user is listed as an admin of the task’s project, they are allowed to create the task.”

## Only Administrators Can Describe a Task

Same logic applies for descriptions:

```typescript
authorization.type(TaskDescription, model.given(TaskDescription).match(description =>
  description.task.project
    .successors(ProjectAdmin, pa => pa.project)
    .selectMany(pa => pa.administrator.predecessor())
));
```

This authorizes only project admins to describe tasks in that project.

## Only Assigned Users Can Report Progress

We use an Assignment fact to track who is assigned to each task:

```typescript
export class Assignment {
  static Type = "Construction.Assignment" as const;
  public type = Assignment.Type;

  constructor(
    public task: Task,
    public assignee: User
  ) { }
}
```

Then authorize workflow actions (like completing or blocking a task) based on assignments:

```typescript
authorization.type(TaskCompleted, model.given(TaskCompleted).match(completed =>
  completed.task
    .successors(Assignment, a => a.task)
    .selectMany(a => a.assignee.predecessor())
));

authorization.type(TaskBlocked, model.given(TaskBlocked).match(blocked =>
  blocked.task
    .successors(Assignment, a => a.task)
    .selectMany(a => a.assignee.predecessor())
));
```

Each rule walks from the fact being created to the associated task, then to its assignments, and finally to the users who are authorized.

## Quick Recap: Reading Authorization Specifications

Authorization specifications follow a pattern:
1. Start from the fact being created (Task, TaskCompleted, etc.)
2. Follow predecessor links to facts like Project or Task
3. Follow successor links to find grants of permission (ProjectAdmin, Assignment)
4. Extract the user via .predecessor() and .selectMany(...)

The result is a list of users. If the current user is in that list, they’re allowed to create the fact.

With these rules in place:
- Only admins can define or describe tasks
- Only assigned users can mark tasks completed or blocked
- Everyone can create a User to support collaboration
