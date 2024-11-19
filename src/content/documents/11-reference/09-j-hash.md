---
title: "j.hash"
---

Compute a string that identifies a fact.

```typescript
const hash = j.hash(fact);
```

This method returns a base-64 encoded SHA-512 hash of a canonical string produced from the fact's fields and predecessors

## Examples

The hash is best used to stand in for the identity of a fact.
It is suitable for use as a key in a JavaScript dictionary.

```javascript
let messagesByHash = {};
for (const message of messages) {
    const hash = j.hash(message);
    messagesByHash[hash] = message;
}
```

You will also find it useful as a key for a React component.
Use the `j.hash` function inside of the specification to produce a hash for each fact.

```tsx
const projectsForUser = model.given(User).match(user =>
  user.successors(Project, project => project.owner)
    .select(project => ({
      hash: j.hash(project),
      identifier: project.identifier
    }))
);

export function ProjectsPage() {
  const user = useUser();
  const { loading, data, error } = useSpecification(j, projectsForUser, user);

  return (
    <div>
      {data && <ul>
        {data.map(project => (
          <li key={project.hash}>
            {project.identifier}
          </li>
        ))}
      </ul>}
    </div>
  );
}
```

Object comparison in JavaScript is by reference.
Jinaga does not guarantee that two instances of a fact will have the same reference.
The hash provides a much better method for identity comparison.

```javascript
if (otherUser !== thisUser) {
    // Not correct: two distinct objects could both represent the same fact.
}

if (otherUser.publicKey !== thisUser.publicKey) {
    // Sometimes correct: only suitable for facts with no predecessors and a distinguishing field.
}

if (j.hash(otherUser) !== j.hash(thisUser)) {
    // Preferred: this takes all fields and predecessors into account.
}
```

The hash does not include the fact's type.
In most use cases, you want to distinguish among several facts of the same type.
However, if your use case allows for multiple types, and they have similar shapes, you will want to combine the type with the hash.

```javascript
const key = `${fact.type}:${j.hash(fact)}`;
```