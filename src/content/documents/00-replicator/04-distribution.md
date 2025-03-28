---
title: "Distribution"
---

Distribution rules determine which users are allowed to read which facts.
A distribution rule describes a specification, and the set of users who are permitted to ask for facts matching that specification.

Write distribution rules in the client.
Put them next to your model and your authorization rules.
Distribution rules will usually need a fully populated model.
Write them as a function taking a model, rather than using the partially defined model.
For example:

```typescript
const invitedUsers = (project: LabelOf<Project>) =>
  project.successors(Invitation, invitation => invitation.project)
    .selectMany(invitation => invitation.guest.predecessor());

export const projectDistribution = (model: Model) => (d: DistributionRules) => d
  // Share the project name with invited users.
  .share(model.given(Project).match(project =>
    project.successors(ProjectName, projectName => projectName.project)
      .notExists(projectName => projectName.successors(ProjectName, next => next.prior))
  ))
  .with(model.given(Project).match(project => invitedUsers(project)))

  // Share all project invitations with invited users.
  .share(model.given(Project).match(project =>
    project.successors(Invitation, invitation => invitation.project)
  ))
  .with(model.given(Project).match(project => invitedUsers(project)))

  // Share invitations with the user who was invited.
  .share(model.given(User).match(self =>
    self.successors(Invitation, invitation => invitation.user)
  ))
  .with(model.given(User).match(self =>
    self.predecessor()
  ));
```

Then you can compose functions from different parts of the application into one central rule set.

```typescript
export const distribution = (d: DistributionRules) => d
  .with(userDistribution(model))
  .with(projectDistribution(model))
  .with(taskDistribution(model))
  ;
```

Create a file called `output-distribution.ts` in your project.
Use the `describeDistributionRules` function to turn those rules into text.
Then upload them to your replicator.

The following code works with Node 18.

```typescript
import { describeDistributionRules } from "jinaga";
import { distribution } from "./model";

const postData = describeDistributionRules(distribution);
const url = process.argv[2];
const bearerToken = process.argv[3];

// POST the distribution rules to the replicator.
fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "text/plain",
    "Authorization": `Bearer ${bearerToken}`
  },
  body: postData
}).then(response => {
  if (response.status === 201) {
    console.log("Distribution rules updated.");
  } else {
    console.log(`Error updating distribution rules: ${response.status} ${response.statusText}`);
    process.exit(1);
  }
});
```

Finally, create an NPM script to compile and run that file.

```json
"scripts": {
  "deploy:distribution": "tsc ./src/output-distribution.ts --outDir ./deploy && node ./deploy/output-distribution.js"
}
```

To deploy the distribution rules, pass the distribution endpoint and secret as command-line parameters.
As an application developer, you can do this by creating a private Bash script that contains your replicator endpoint and secret.
Do not check this script into source control.

```bash
npm run deploy:distribution https://rep.jinaga.com/xxxxxxx/distribution yyyyyyy
```

On a CI/CD server, you can use environment variables to pass the endpoint and secret.
