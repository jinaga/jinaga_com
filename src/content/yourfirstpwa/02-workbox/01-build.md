---
title: "Build"
---

There is no fancy command line tool to get started.
Instead, we'll just clone a repository.
Go back to your project home folder and clone the repo.
Then change directories into the repo and clean up the Git association so you can start fresh.

```bash
git clone https://github.com/michaellperry/starter-javascript-workbox-react.git workboxpwa
cd workboxpwa
rm -rf .git
npm install
```

Then you can build and run the solution.

```bash
npm run build
npm run dev
```

The application starts at http://localhost:8080.
