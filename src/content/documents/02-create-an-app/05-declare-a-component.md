---
title: "Declare a Component"
---

We'll declare a component to display a site.
Create a folder called `components`.
Inside that folder, create a file called `SiteContainer.tsx`.

With Jinaga-React, you can create a specification that reads properties from a starting fact.
Define a specification that starts with the `Site` fact.

```typescript
import { field, jinagaContainer, mapProps, specificationFor } from "jinaga-react";

import { j } from "../jinaga-config";
import { Site } from "../model/site";

const siteSpecification = specificationFor(Site, {
  domain: field(d => d.domain)
});
```

So far we only have one property.
It is mapped to the `domain` field of the `Site` fact.

Now map that property to a React component.

```typescript
const siteMapping = mapProps(siteSpecification).to(({ domain }) => (
  <div>
    <h1>{domain}</h1>
  </div>
));
```

Finally, create a Jinaga container for that mapping.

```typescript
export default jinagaContainer(j, siteMapping);
```

Now you can add this component to the app in `App.tsx`.

```tsx
import SiteContainer from "./components/SiteContainer";

function App() {
  //...

  return (
    <div className="App">
      <SiteContainer fact={site} />
    </div>
  )
}
```
