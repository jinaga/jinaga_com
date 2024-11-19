---
title: "j.login"
---

Log the user in and return a fact that represents their identity.
This method is only valid in the browser.

```typescript
const { userFact, profile } = await j.login<User>();
```

## User

The type parameter will typically be the `User` class defined in Jinaga.
This class has a `publicKey` property that identifies the user.

```typescript
class User {
  static Type = "Jinaga.User";
  type = User.Type;

  constructor(
    public publicKey: string
  ) { }
}
```

## Profile

The `profile` object contains information about the user.
It will typically have a `displayName` property.

```typescript
interface Profile {
    displayName: string;
};
```

The exact behavior of the profile is determined by the authentication mechanism that the replicator uses.

## React

It is common in a React web application to define a component that wraps the `j.login` method.
The component is added to the top of the application hierarchy.
It will provide a hook that can be used to access the user fact.

The example below also updates the user's name if it has changed.
It queries for the user's name and compares it to the profile.
If the name has changed or the query returns multiple results, then a new `UserName` fact is created.

```tsx
import { User } from 'jinaga';
import React, { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { j } from '../jinaga-config';
import { model } from '../model';
import { UserName } from '../model/user';

interface UserContextValue {
  user: User | null;
  error: Error | null;
}

export const UserContext = createContext<UserContextValue>({
  user: null,
  error: null,
});

const namesOfUser = model.given(User).match(user =>
  user.successors(UserName, userName => userName.user)
);

export const UserProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { userFact, profile } = await j.login<User>();
      setUser(userFact);

      // Update the user's name if it has changed.
      const names = await j.query(namesOfUser, userFact);
      if (names.length !== 1 || names[0].value !== profile.displayName) {
        await j.fact(new UserName(userFact, profile.displayName, names));
      }
    };

    fetchUser().catch((err) => {
      setError(err);
    });
  }, [setUser, setError]);

  return (
    <UserContext.Provider value={{ user, error }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const { user, error } = React.useContext(UserContext);

  return { user, error };
}
```