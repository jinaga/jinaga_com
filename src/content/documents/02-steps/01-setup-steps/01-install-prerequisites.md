---
title: "Install Prerequisites"
---

Jinaga requires [Node](https://nodejs.org).
In future steps, you will also need [PostgreSQL](https://www.postgresql.org/).
Find specific installation instructions for your platform, or follow these guidelines for common platforms.

## Choose your platform

[Node](https://nodejs.org) and [PostgreSQL](https://www.postgresql.org/) are available for multiple platforms:
- Linux (eg Ubuntu)
- On Linux via WSL (Windows Subsystem for Linux) = Linux embedded in Windows
- Windows
- Mac/OS

## Install Node

### On Linux (Ubuntu)
If you are installing [Node](https://nodejs.org) on Ubuntu, run these commands from the bash terminal:

```bash
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
```
### On Windows
If you are installing [Node](https://nodejs.org) on Windows, have a look at [nvm-windows](https://github.com/coreybutler/nvm-windows#node-version-manager-nvm-for-windows) first.  This tool allows you to install multiple Node-versions and to easily switch between them.

## Install PostgreSQL

To start, it's easiest to run [PostgreSQL](https://www.postgresql.org/) on the same system where [Node](https://nodejs.org) is running.


## Install your editor

Choose and install your favorite editor.  We love [VS Code](https://code.visualstudio.com/), which is free and runs on all the above mentioned platforms