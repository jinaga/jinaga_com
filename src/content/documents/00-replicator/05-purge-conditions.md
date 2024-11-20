---
title: "Purge Conditions"
---

Jinaga typically does not permit deletions.
However, there is a way to purge data from a Jinaga replicator.
If you can prove that the data will have no effect on the results of any specification, then the runtime will purge it.
Purge conditions are how you provide that proof.

Before using this feature, consider backing up your data using the [export feature](../../exporting-facts/exporting-from-postgres/).

## Example: Contact List

Declare purge conditions when defining a model.
For example, consider a model that describes a contact list.

A list belongs to a user.
A list contains contacts.
A contact has a name and an email address.

```typescript
export class List {
  static Type = "CRM.List" as const;
  type = List.Type;

  constructor(
    public owner: User,
    public uuid: string
  ) { }
}

export class Contact {
  static Type = "CRM.Contact" as const;
  type = Contact.Type;

  constructor(
    public list: List,
    public createdAt: Date | string
  ) { }
}

export class Name {
  static Type = "CRM.Contact.Name" as const;
  type = Name.Type;

  constructor(
    public contact: Contact,
    public value: string,
    public prior: Name[]
  ) { }
}

export class Email {
  static Type = "CRM.Contact.Email" as const;
  type = Email.Type;

  constructor(
    public contact: Contact,
    public value: string,
    public prior: Email[]
  ) { }
}
```

Suppose we wanted to delete a contact from the list.
We could express that as a `Contact.Deleted` fact.

```typescript
export class ContactDeleted {
  static Type = "CRM.Contact.Deleted" as const;
  type = ContactDeleted.Type;

  constructor(
    public contact: Contact
  ) { }
}
```

### Build a Model

With all of the fact types defined, we can build a model that lets us write specifications.

```typescript
const model = buildModel(m => m
    .type(List, x => x
        .predecessor("owner", User)
    )
    .type(Contact, x => x
        .predecessor("list", List)
    )
    .type(ContactDeleted, x => x
        .predecessor("contact", Contact)
    )
    .type(Name, x => x
        .predecessor("contact", Contact)
        .predecessor("prior", Name)
    )
    .type(Email, x => x
        .predecessor("contact", Contact)
        .predecessor("prior", Email)
    )
);
```

### Write a Specification

To show all of the contacts in a list, we would write a specification.

```typescript
const contactsInList = model.given(List).match(list =>
    list.successors(Contact, contact => contact.list)
        .notExists(contact =>
            contact.successors(ContactDeleted, contactDeleted => contactDeleted.contact))
        .select(contact => ({
            contact,
            name: contact.successors(Name, name => name.contact)
                .notExists(name =>
                    name.successors(Name, next => next.prior)
                )
                .select(name => name.value),
            email: contact.successors(Email, email => email.contact)
                .notExists(email =>
                    email.successors(Email, next => next.prior)
                )
                .select(email => email.value)
        }));
);
```

Notice how the specification excludes contacts that have been deleted.
If all specifications did so, then we could safely purge information about deleted contacts from the replica.

### Declare Purge Conditions

To declare purge conditions, write a function that takes a `PurgeConditions` object and adds conditions to it.

```typescript
const purgeConditions = (p: PurgeConditions) => p
    .whenExists(model.given(Contact).match(contact =>
        contact.successors(ContactDeleted, contactDeleted => contactDeleted.contact)
    ));
```

Use that function when initializing the Jinaga replicator.

```typescript
const { handler, j } = JinagaServer.create({
    pgStore: process.env.JINAGA_POSTGRESQL ||
        'postgresql://appuser:apppw@localhost:5432/appdb'
    purgeConditions
});
```

The effect of this declaration is that when the application uses this jinaga replicator to query, watch, or subscribe to a specification, the runtime will verify that the purge conditions are included.
If a specification matches a `Contact` and does not include `notExists` for `ContactDeleted`, then the runtime will throw an exception.
This proves that no specification will return information about a deleted contact.

### Purge the Data

To purge the data, call the `purge` method on the Jinaga client.

```typescript
await j.purge();
```

This will remove all successors of `Contact` facts when a `ContactDeleted` fact exists for that contact.
The runtime must keep the `Contact` and the `ContactDeleted` facts to ensure that the replica doesn't later learn about the deleted contact.
But it can remove the `Name` and `Email` facts for that contact.