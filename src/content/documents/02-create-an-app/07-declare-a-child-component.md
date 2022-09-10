---
title: "Declare a Child Component"
---

Let's go through the same steps of creating a component, but this time for the `Post` fact.
Create a file in the `components` folder called `PostComponent.tsx`.
In that file, first create a specification for the `Post` fact.

```typescript
import { field, mapProps, specificationFor } from "jinaga-react";
import { j } from "../jinaga-config";
import { Post } from "../model/post";

const postSpecification = specificationFor(Post, {
  createdAt: field(d => d.createdAt)
});
```

Map the `createdAt` property to a React component.  But instead of building a container from that mapping, we just export it.

```typescript
export const postMapping = mapProps(postSpecification).to(({ createdAt }) => (
  <div>
    <h2>{createdAt as string}</h2>
  </div>
));
```

We're going to import it in `SiteContainer.tsx` and use it in the specification.

```typescript
import { postMapping } from "./PostComponent";
import { collection } from "jinaga-react";
import { Post } from "../model/post";

const siteSpecification = specificationFor(Site, {
  domain: field(d => d.domain),
  Posts: collection(j.for(Post.forSite), postMapping)
});
```

We gave this property a capitalized name so that we can use it as a React component.

```typescript
const siteMapping = mapProps(siteSpecification).to(({ domain, Posts }) => (
  <div>
    <h1>{domain}</h1>
    <Posts />
  </div>
));
```

So the full content of SiteContainer.tsx becomes:
```typescript
import { field, jinagaContainer, mapProps, specificationFor } from "jinaga-react";
import { collection } from "jinaga-react";
import { postMapping } from "./PostComponent";
import { Post } from "../model/post";
import { j } from "../jinaga-config";
import { Site } from "../model/site";

const siteSpecification = specificationFor(Site, {
    domain: field(d => d.domain),
    Posts: collection(j.for(Post.forSite), postMapping)
  });

  const siteMapping = mapProps(siteSpecification).to(({ domain, Posts }) => (
    <div>
      <h1>{domain}</h1>
      <Posts />
    </div>
  ));

  export default jinagaContainer(j, siteMapping);
```

Now the app renders all of the posts in the Replicator.
Give it a try.
Run the app and see all of the posts you [added to the Replicator](../../replicator/write/).
Change the `createdAt` field and add a new one.
Then refresh the page to see if it shows up.