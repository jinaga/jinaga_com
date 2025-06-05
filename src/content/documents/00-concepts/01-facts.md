---
title: "Facts"
---

The core unit of data in Jinaga is a *fact*.
A fact is an immutable record of an event, decision, or state change.
Let's start simple.
When the user logs into your application, that's a fact.

```typescript
const { userFact: user, profile } = await testClient.login<User>();
```

```dot
digraph {
    rankdir=BT
    node [shape=none]
    "Gs+Fo0xO04hUAteaPwrHZDmyovTwr7asnKsBrkRf3HE3M9nYIj4Sk7ZhR8YK5uMq1SMHPrQohtQNwo9B7whK0w==" [label=<<TABLE BORDER="1" CELLBORDER="1" CELLSPACING="0"><TR><TD COLSPAN="2">Jinaga.User</TD></TR><TR><TD>publicKey</TD><TD>--- TEST USER ---</TD></TR></TABLE>>]
}
```

Each fact has a type (`Jinaga.User` in this case) and a set of properties (`publicKey` for this example).

The `Jinaga.User` type is defined in the Jinaga library.
But, of course, you can define your own types.
Write a class with a static `Type` as the type name.
Declare a `type` instance variable initialized to that value.
Then declare a constructor taking all of the properties of the fact.

```typescript
class Project {
  static Type = "Construction.Project" as const;
  type = Project.Type;

  constructor(public creator: User, public id: string) {}
}
```

To create an instance of this fact, call `fact` on the Jinaga client.
This method is asynchronous because it will save the fact to the local store and notify the replicator to synchronize it with other clients.

```typescript
const projectA = await testClient.fact(new Project(user, crypto.randomUUID()));
```

```dot
digraph {
    rankdir=BT
    node [shape=none]
    "Gs+Fo0xO04hUAteaPwrHZDmyovTwr7asnKsBrkRf3HE3M9nYIj4Sk7ZhR8YK5uMq1SMHPrQohtQNwo9B7whK0w==" [label=<<TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0"><TR><TD COLSPAN="2">Jinaga.User</TD></TR><TR><TD>publicKey</TD><TD>--- TEST USER ---</TD></TR></TABLE>>]
    "PYaXGGp+ksHg101LgyF/pB/OBQsixEhWZ9RDW9wxdwX/sVFWgyhpOZROgi4Gttdz1lWJ5Un0pJPJ5MvXEk1TCQ==" [label=<<TABLE BORDER="1" CELLBORDER="1" CELLSPACING="0"><TR><TD COLSPAN="2">Construction.Project</TD></TR><TR><TD>id</TD><TD>52eb9df8-7b1c-43d4-9...</TD></TR></TABLE>>]
    "PYaXGGp+ksHg101LgyF/pB/OBQsixEhWZ9RDW9wxdwX/sVFWgyhpOZROgi4Gttdz1lWJ5Un0pJPJ5MvXEk1TCQ==" -> "Gs+Fo0xO04hUAteaPwrHZDmyovTwr7asnKsBrkRf3HE3M9nYIj4Sk7ZhR8YK5uMq1SMHPrQohtQNwo9B7whK0w==" [label=" creator"]
}
```

## Build a Model

Before you can use these fact types in an application, you have to build a model.
Start by adding all of your types to a model builder.

```typescript
const constructionModel = (b: ModelBuilder) => b
  .type(Project, m => m
    .predecessor("creator", User)
  )
  ;
```

Then you can compose a set of declarations into one model.

```typescript
const model = buildModel(b => b
  .with(constructionModel)
);
```