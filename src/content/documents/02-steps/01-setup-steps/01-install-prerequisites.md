---
title: "Install Prerequisites"
---

Jinaga requires [Node](https://nodejs.org).
In future steps, you will also need [PostgreSQL](https://www.postgresql.org/).
Find specific installation instructions for your platform, or follow these guidelines for common platforms.

## Node on Ubuntu

Node works best in Bash. Either use the Windows Subsystem for Linux, or use `nvm-windows` to install Node, or just use MacOS/Linux.
If you are installing Node on Ubuntu, run these commands:

```bash
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
```