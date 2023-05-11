---
title: "JinagaTest.create"
---

Create an instance of Jinaga for use in unit tests.

```typescript
var j: Jinaga;

beforeEach(() => {
  j = JinagaTest.create({
    authorization: authorization,
    user: new User("public key"),
    device: new Device("public key"),
    initial state: [
      fact1,
      fact2,
      ...
    ]
  });
});
```

All parameters are optional.

## authorization

A function that configures authorization rules.

```typescript
const authorization = (a: AuthorizationRules) => a
  .any(AnybodyCanCreate)
  .no(NobodyCanCreate)
  .type(PredecessorCanCreate, x => x.predecessor)
  .type(SiblingCanCreate, siblingSpecification)
  .with(otherAuthorizationFunction)
  ;

var j: Jinaga;

beforeEach(() => {
  j = JinagaTest.create({
    authorization: authorization
  });
});
```

Use this technique to test authorization rules.
Define a function that you will use on the server side or upload to a replicator.
Then use the same function in your unit tests in both positive and negative test scenarios.
Assert that `j.fact` throws an exception when the user is not authorized.

```typescript
it("should not allow anybody to create a fact", async () => {
  await expect(j.fact(new NobodyCanCreate())).rejects.toThrow();
});
```

For more information on building the authorization function, see [AuthorizationRules](../authorizationrules/).

## user

A fact representing the user to simulate being logged in.

```typescript
var j: Jinaga;

beforeEach(() => {
  j = JinagaTest.create({
    user: new User("public key")
  });
});

it("should be logged in", () => {
  const user = await j.login<User>();
  expect(j.publicKey).toEqual("public key");
});
```

This parameter is often combined with the `authorization` parameter.
Assert that the user is authorized to create a fact.

```typescript
it("should allow the user to create a fact with herself as predecessor", async () => {
  const user = await j.login<User>();
  await expect(j.fact(new PredecessorCanCreate(user))).resolves.not.toThrow();
});

it("should not allow the user to create a fact with another as predecessor", async () => {
  const otherUser = new User("other public key");
  await expect(j.fact(new PredecessorCanCreate(otherUser))).rejects.toThrow();
});
```

## device

A fact representing the device to simulate being local.

```typescript
var j: Jinaga;

beforeEach(() => {
  j = JinagaTest.create({
    device: new Device("public key")
  });
});

it("should be local device", () => {
  const device = await j.local<Device>();
  expect(j.publicKey).toEqual("public key");
});
```

Like users, devices can be authorized to create particular facts.
This is useful for building back-end services.
Combine this parameter with the `authorization` parameter to test authorization rules for those services.

## initial state

A list of facts to load into the Jinaga instance before running the test.

```typescript
const fact1 = new Fact1();
const fact2 = new Fact2(fact1);

var j: Jinaga;

beforeEach(() => {
  j = JinagaTest.create({
    initialState: [
      fact1,
      fact2
    ]
  });
});
```

Authorization rules are not evaluated for these facts.
This parameter is useful for initializing the state with facts that the logged-in user is not authorized to create.