---
title: "Factual File Format"
---

The Factual file format is a human-readable format used to represent facts in Jinaga. It is designed to be easy to read and write, making it suitable for manual editing and inspection.

## Structure

A Factual file consists of a series of fact declarations. Each fact is represented as a JavaScript-like object with the following structure:

```javascript
let f<fact_id>: <fact_type> = {
    <field_key>: <field_value>,
    ...
    <predecessor_key>: f<predecessor_fact_id>,
    <predecessor_array_key>: [f<predecessor_fact_id1>, f<predecessor_fact_id2>, ...],
    ...
}
```

- `<fact_id>`: A unique identifier for the fact
- `<fact_type>`: The type of the fact
- `<field_key>` and `<field_value>`: The fact's data fields
- `<predecessor_key>` and `<predecessor_fact_id>`: References to single predecessor facts
- `<predecessor_array_key>`: References to arrays of predecessor facts

## Example

Here is an example of a Factual file representing a blog site, a blog post, and the post's title:

```typescript
let f1: Blog.Site = {
    domain: "example.com"
}

let f2: Blog.Post = {
    createdAt: "2023-05-20T10:30:00Z",
    site: f1
}

let f3: Blog.Post.Title = {
    post: f2,
    value: "My First Blog Post",
    prior: []
}
```

## Fields

Each fact can have one or more fields. Fields are key-value pairs that store the data associated with the fact. The keys are strings, and the values can be of various types, such as strings, numbers, booleans, or dates.

### Example

In the example above, the `Blog.Site` fact has a `domain` field with the value `"example.com"`, and the `Blog.Post` fact has a `createdAt` field with the value `"2023-05-20T10:30:00Z"`.

## Predecessors

Predecessors are references to other facts that the current fact depends on. A fact can have single predecessors or arrays of predecessors.

### Single Predecessor

A single predecessor is a reference to one other fact. In the example above, the `Blog.Post` fact has a single predecessor `site` that references the `Blog.Site` fact.

### Array of Predecessors

An array of predecessors is a reference to multiple facts. In the example above, the `Blog.Post.Title` fact has an array of predecessors `prior` that is empty.

## Usage

The Factual file format is used in Jinaga for exporting and importing facts. It allows you to back up your data, analyze it, or move it to other replicas. You can manually edit Factual files to modify your data or create new facts.

This file format is compatible with the [/write](../../replicator/write/) endpoint. Post a Factual file to this endpoint to import the facts into a Jinaga replicator.
