---
title: "Exporting from Postgres"
---

The `jinaga-export-postgres` command-line tool allows you to export data from a Jinaga PostgreSQL database.

## Installation

This package can be used directly via `npx` without installation, or you can install it globally using npm:

```bash
npm install -g jinaga-export-postgres
```

## Usage

To use the tool, run the following command:

```bash
npx jinaga-export-postgres --host <host> --port <port> --database <database> --user <user> --password <password> --format <format>
```

Replace the placeholders with your PostgreSQL database details:

- `<host>`: The hostname of your PostgreSQL server
- `<port>`: The port number of your PostgreSQL server
- `<database>`: The name of your Jinaga database
- `<user>`: The username for accessing the database
- `<password>`: The password for the specified user
- `<format>`: The output format. Must be either 'json' or 'factual'

Example:

```bash
npx jinaga-export-postgres --host localhost --port 5432 --database myjinagarecords --user myuser --password mypassword --format json
```

The tool will connect to the specified PostgreSQL database, check for the existence of the 'fact' table, and if it exists, export all facts from the table in the specified format.

### Writing to a File

To save the output to a file, you can use output redirection:

For JSON format:

```bash
npx jinaga-export-postgres --host localhost --port 5432 --database mydb --user myuser --password mypassword --format json > output.json
```

For Factual format:

```bash
npx jinaga-export-postgres --host localhost --port 5432 --database mydb --user myuser --password mypassword --format factual > output.fact
```
