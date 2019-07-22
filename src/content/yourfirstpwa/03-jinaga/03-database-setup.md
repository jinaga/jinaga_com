---
title: "Database Setup"
---

Now the application will try to save something to a database.
The database it uses is Postgres.
The default Postgres connection string is in `src/server/jinaga-config.ts`, or you can change it with the `JINAGA_POSTGRESQL` environment variable.
We are just going to change the default value in the source code.
Change the name of the database to `jinagapwa`, so that the whole connection string is `postgresql://dev:devpw@localhost:5432/jinagapwa`.
This will restart the application automatically.

Now you need to create that database.
Make sure you have [PostgreSQL](https://www.postgresql.org/download/) installed and running.
On MacOS, you can use homebrew:

```bash
brew install postgresql
```

On Windows, download and run the installer.

Then you can create the database and the application user:

```bash
echo "CREATE DATABASE jinagapwa;" | psql -h localhost -U postgres postgres
echo "CREATE USER dev WITH LOGIN ENCRYPTED PASSWORD 'devpw' VALID UNTIL 'infinity';" | psql -h localhost -U postgres jinagapw
```

Finally, create the database tables.

```bash
psql -h localhost -f node_modules/jinaga/setup.sql -U postgres jinagapwa
```

Now when you log in, you should see some action.
