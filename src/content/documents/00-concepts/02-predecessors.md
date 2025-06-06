---
title: "Predecessors"
---

When we defined the `Construction.Project` type, we used `Jinaga.User` as one of its properties.
That made it a *predecessor*.
In this case, the meaning of that predecessor relationship is that the user created the project.

Once you have predecessors, you can query for facts that are related to them.
These, as you might have guessed, are called *successors*.

Let's query for all projects that a user has created.

```csharp
// Create a couple more projects.
const projectB = await j.fact(new Project(user, crypto.randomUUID()));
const projectC = await j.fact(new Project(user, crypto.randomUUID()));

const projectsCreatedByUser = model.given(User).match(u =>
  u.successors(Project, p => p.creator)
);

const projects = await j.query(projectsCreatedByUser, user);
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

Let's break down that specification.
Start with the model that you built from all of your types.
Call `given` to specify the type of the parameter.
Then use `match` to write an expression that matches the facts you want.

The `successors` method finds all successors of the requested type related to the given predecessor.
Provide a lambda that shows how the successors relate to the predecessor.