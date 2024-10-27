---
title: "Exporting Facts"
---

To gain more control over the facts in a replica, Jinaga provides mechanisms for exporting facts as files. This allows you to back up your data, analyze it, or move it to other replicas.

- **Backup**: Regularly exporting facts can help you create backups of your data, ensuring that you have a copy in case of data loss or corruption.
- **Analysis**: Exporting facts allows you to analyze your data using external tools, such as data visualization or statistical analysis software.
- **Migration**: If you need to move your data to a different replica, you can export facts from one replica and import them into another.

## JSON File Format

The JSON file format is used to export facts in a structured JSON format. This format is useful for data interchange and analysis using JSON-compatible tools.

### Example JSON Structure

```json
[
  {
    "hash": "SV3Yseb0FJ/uQoL4IelHHbo1g4PZjnP4bx+aivMiiCkSTn2vSaNR6314KXL+PgO9lX9jmJzWoZABTRHjiFHWdQ==",
    "type": "Blog.Post",
    "predecessors": {
      "site": {
        "hash": "abc123",
        "type": "Blog.Site"
      }
    },
    "fields": {
      "createdAt": "2023-04-28T23:53:00Z"
    }
  }
]
```

### JSON Fields

- `hash`: A unique identifier for the fact
- `type`: The type of the fact
- `predecessors`: An object containing references to predecessor facts
  - Each key in the object may contain either a single predecessor or an array of multiple predecessors
- `fields`: An object containing the fact's data fields

## Factual File Format

The Factual file format is used to export facts in a JavaScript-like fact declaration format. This format is useful for importing facts back into a Jinaga application or for sharing facts with other Jinaga users.

### Example Factual Structure

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

### Factual Fields

- `<fact_id>`: A unique identifier for the fact
- `<fact_type>`: The type of the fact
- `<field_key>` and `<field_value>`: The fact's data fields
- `<predecessor_key>` and `<predecessor_fact_id>`: References to single predecessor facts
- `<predecessor_array_key>`: References to arrays of predecessor facts
