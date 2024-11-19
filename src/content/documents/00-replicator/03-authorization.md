---
title: "Authorization"
---

Securing your replicator is done via source code.
Add authorization and distribution rules to your model, and deploy to the replicator as a build step.

Write your authorization rules in the client.
These go with your model.
To better organize your code, collect the rules related to a small number of facts into a single function.
For example:

```typescript
export const projectAuthorization = (a: AuthorizationRules) => a
  .type(Project, p => p.creator)
  .type(ProjectName, n => n.project.creator)
  .type(ProjectName, n => n.project.successors(Invitation, invitation => invitation.project)
    .selectMany(invitation => invitation.successors(User, user => user))
  )
  ;
```

Then you can compose these functions into one central rule set.

```typescript
export const authorization = (a: AuthorizationRules) => a
  .with(userAuthorization)
  .with(projectAuthorization)
  .with(taskAuthorization)
  ;
```

Create a file called `output-authorization.ts` in your project.
Use the `describeAuthorizationRules` function to turn those rules into text.
Then upload them to your replicator.

The following code works with Node 18.

```typescript
import { describeAuthorizationRules } from "jinaga";
import { authorization, model } from "./model";

const postData = describeAuthorizationRules(model, authorization);
const url = process.argv[2];
const bearerToken = process.argv[3];

// POST the authorization rules to the replicator.
fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "text/plain",
    "Authorization": `Bearer ${bearerToken}`
  },
  body: postData
}).then(response => {
  if (response.status === 201) {
    console.log("Authorization rules updated.");
  } else {
    console.log(`Error updating authorization rules: ${response.status} ${response.statusText}`);
    process.exit(1);
  }
});
```

Finally, create an NPM script to compile and run that file.

```json
"scripts": {
  "deploy:authorization": "tsc ./src/output-authorization.ts --outDir ./deploy && node ./deploy/output-authorization.js"
}
```

To deploy authorization rules, pass the authorization endpoint and secret as command-line parameters.
As an application developer, you can do this by creating a private Bash script that contains your replicator endpoint and secret.
Do not check this script into source contol.

```bash
npm run deploy:authorization https://rep.jinaga.com/xxxxxxx/authorization yyyyyyy
```

On a CI/CD server, get the endpoint and secret from build parameters.