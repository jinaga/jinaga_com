---
title: "Upgrading the Container"
---

An image cannot be upgraded from under an existing container.
You will need to create a new replicator container and destroy the old one.
The following instructions will preserve your data during this process.

When you create your first replicator on Docker Desktop, it will automatically mount a volume for the Postgres database.
Docker Desktop will destroy that volume when you destroy the container.
The solution is to create a named volume, copy the data into it, and then mount the named volume into a new container.

## Prepare the Old Replicator

Begin by stopping and renaming your existing replicator.

```bash
docker stop my-replicator
docker rename my-replicator my-old-replicator
```

Then discover the name that Docker Desktop created for the managed volume.

```bash
docker inspect -f '{{ .Mounts }}' my-old-replicator
```

This will output something like this:

```
[{volume d656e6e25c8aad61cc3b0425939342e5e3ed80faf43b78b7c7fde670770b6da1 /var/lib/docker/volumes/d656e6e25c8aad61cc3b0425939342e5e3ed80faf43b78b7c7fde670770b6da1/_data /var/lib/postgresql/data local  true }]
```

The hexadecimal number that above starts with `d656` is the volume name.
You will need this later.

## Copy Data to a New Volume

Create a new named volume.

```bash
docker volume create my-replicator-db
```

Mount the old and new volume to a new container.
Run a command within that container to copy the contents of the old volume to the new one.
Use the volume name that you copied from the previous step.

```bash
docker pull ubuntu:latest
docker run --rm \
  -v d656e6e25c8aad61cc3b0425939342e5e3ed80faf43b78b7c7fde670770b6da1:/source \
  -v my-replicator-db:/dest \
  ubuntu:latest \
  bash -c "cp -R /source/* /dest/"
```

## Start a New Replicator

Finally, start a new replicator using the new volume

```bash
docker pull jinaga/jinaga-replicator:latest
docker create --name my-replicator \
  -p8080:8080 \
  -v my-replicator-db:/var/lib/postgresql/data \
  jinaga/jinaga-replicator
docker start my-replicator
```

Once you have tested your new replicator, you can delete the old one.
You can delete the old volume, or prune unmounted volumes to clean up.

```bash
docker rm my-old-replicator
docker volume rm d656e6e25c8aad61cc3b0425939342e5e3ed80faf43b78b7c7fde670770b6da1
```