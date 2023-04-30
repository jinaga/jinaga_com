---
title: "buildModel"
---

Outline a set of types that will represent facts in the application.
Define classes for facts using the [TypeScript Conventions](../../conventions/typescript/).
Then write a function that adds those types to a `ModelBuilder`.

```typescript
const blogModel = (b: ModelBuilder) => b
  .type(Site)
  .type(Post, m => m
    .predecessor("site", Site)
  )
;

const model = buildModel(b => b
  .with(blogModel)
);
```

## ModelBuilder.type

Pass a class to the `type` method of the `ModelBuilder`.
The `type` method returns the `ModelBuilder` so that you can chain calls.

The second parameter is optional.
If the fact class has no predecessors, then do not provide it.

```typescript
  .type(Site)
```

If the fact class has predecessors, then provide a function that specifies them.

```typescript
  .type(Post, m => m
    .predecessor("site", Site)
  )
```

## ModelBuilder.with

Compose type builder functions using the `with` method.
Pass a function that adds types to a `ModelBuilder`.

```typescript
  .with(blogModel)
```

## buildModel

Call `buildModel` to create a `Model` from the `ModelBuilder` functions.

```typescript
const model = buildModel(b => b
  .with(blogModel)
);
```