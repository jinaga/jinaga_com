---
title: "Declare a Component"
---

We'll declare a component to display a site.
Inside the `src` folder, create a folder called `components`.
Inside that folder, create a file called `SiteContainer.tsx`.

Let's create a simple component that displays the domain name of the site.

In React:

```tsx
import { Site } from '../model/blog';

interface SiteContainerProps {
  site: Site | null;
}

export function SiteContainer({ site }: SiteContainerProps) {
  return (
    <div>
      <h1>{site?.domain}</h1>
    </div>
  )
}
```

Or in React Native:

```tsx
import { Site } from '../model/blog';

interface SiteContainerProps {
  site: Site | null;
}

export function SiteContainer({ site }: SiteContainerProps) {
  return (
    <View>
      <Text>{site?.domain}</Text>
    </View>
  )
}
```

Now you can add this component to the app in `App.tsx`.

```tsx
import { SiteContainer } from './components/SiteContainer';

function App() {
  //...

  return (
    <div className="App">  // or <View>
      <SiteContainer site={site} />
    </div>
  );
}
```

Run the app and you'll see "qedcode.com" displayed on the page.
Horray!

![Site domain displayed in the container](./attachments/site-domain.png)

OK, so maybe that's not so exciting.
Wouldn't it be better to display the posts?
Let's do that.
