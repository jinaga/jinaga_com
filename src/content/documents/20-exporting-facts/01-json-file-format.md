---
title: "JSON File Format"
---

The JSON file format is used in Jinaga to represent facts in a structured way. This format allows for easy serialization and deserialization of facts, making it suitable for exporting, importing, and sharing data.

## JSON Structure

A JSON file representing facts in Jinaga consists of an array of fact objects. Each fact object has the following structure:

```json
{
  "hash": "string",
  "type": "string",
  "predecessors": {
    "single": {
      "hash": "string",
      "type": "string"
    },
    "multiple": [
      {
        "hash": "string",
        "type": "string"
      },
      {
        "hash": "string",
        "type": "string"
      }
    ]
  },
  "fields": {
    "key": "value"
  }
}
```

### Example JSON Structure

Here is an example of a JSON file containing facts:

```json
[
  {
    "hash": "SV3Yseb0FJ/uQoL4IelHHbo1g4PZjnP4bx+aivMiiCkSTn2vSaNR6314KXL+PgO9lX9jmJzWoZABTRHjiFHWdQ==",
    "type": "Blog.Site",
    "predecessors": {},
    "fields": {
      "domain": "example.com"
    }
  },
  {
    "hash": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6",
    "type": "Blog.Post",
    "predecessors": {
      "site": {
        "hash": "SV3Yseb0FJ/uQoL4IelHHbo1g4PZjnP4bx+aivMiiCkSTn2vSaNR6314KXL+PgO9lX9jmJzWoZABTRHjiFHWdQ==",
        "type": "Blog.Site"
      }
    },
    "fields": {
      "createdAt": "2023-05-20T10:30:00Z"
    }
  },
  {
    "hash": "z6y5x4w3v2u1t0s9r8q7p6o5n4m3l2k1j0i9h8g7f6e5d4c3b2a1",
    "type": "Blog.Post.Title",
    "predecessors": {
      "post": {
        "hash": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6",
        "type": "Blog.Post"
      }
    },
    "fields": {
      "value": "My First Blog Post",
      "prior": []
    }
  }
]
```

## JSON Fields

Each fact object in the JSON file contains the following fields:

- `hash`: A unique identifier for the fact. This is a string that represents the hash of the fact.
- `type`: The type of the fact. This is a string that describes the fact's type.
- `predecessors`: An object containing references to predecessor facts. Each key in the object may contain either a single predecessor or an array of multiple predecessors.
  - `single`: A single predecessor fact. This is an object with `hash` and `type` fields.
  - `multiple`: An array of multiple predecessor facts. Each element in the array is an object with `hash` and `type` fields.
- `fields`: An object containing the fact's data fields. Each key in the object represents a field name, and the corresponding value represents the field's value.

By using this JSON file format, Jinaga can efficiently store, export, and import facts, making it easier to work with data in a structured and organized manner.

## Using jq for Processing

jq is a lightweight command-line JSON processor. You can pipe the output of `jinaga-export-postgres` to `jq` for further processing or formatting when using the JSON format:

1. Pretty-print the JSON:
   ```bash
   npx jinaga-export-postgres ... --format json | jq '.'
   ```

2. Count the number of facts:
   ```bash
   npx jinaga-export-postgres ... --format json | jq 'length'
   ```

3. Filter facts by type:
   ```bash
   npx jinaga-export-postgres ... --format json | jq '[.[] | select(.type == "YourFactType")]'
   ```

4. Find a fact by hash:
   ```bash
   npx jinaga-export-postgres ... --format json | jq '.[] | select(.hash == "YourFactHash")'
   ```

5. Extract specific fields:
   ```bash
   npx jinaga-export-postgres ... --format json | jq '[.[] | {hash: .hash, type: .type}]'
   ```

Remember to install `jq` (`sudo apt-get install jq` on Ubuntu or `brew install jq` on macOS) before using these commands.
