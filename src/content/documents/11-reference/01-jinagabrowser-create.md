---
title: "JinagaBrowser.create"
---

Create an instance of Jinaga for use in a web browser.

```typescript
export const j = JinagaBrowser.create({
    httpEndpoint: process.env.REACT_APP_JINAGA_REPLICATOR_URL,
    wsEndpoint: process.env.REACT_APP_JINAGA_REPLICATOR_WS,
    indexedDb: 'dbname',
    httpTimeoutSeconds: 30,
    httpAuthenticationProvider: authenticationProvider
});
```

All parameters are optional.

## httpEndpoint

The URL of the Jinaga replicator.
If it is not provided, then the instance will not connect to an upstream replicator.

## wsEndpoint

The URL of the Jinaga replicator WebSocket.
If it is not provided, then the instance will not use web sockets to receive updates from the replicator.

## indexedDb

The name of the IndexedDB database to use for local storage.
If it is not provided, then the instance will not store facts locally.

## httpTimeoutSeconds

The number of seconds to wait for a response from the replicator before timing out.
If it is not provided, the default is 5 seconds.

## httpAuthenticationProvider

An object that provides the HTTP headers to use when connecting to the replicator.
If it is not provided, then the instance will not authenticate with the replicator.

The `httpAuthenticationProvider` object must implement the following interface.

```typescript
interface AuthenticationProvider {
    getHeaders(): Promise<{ [key: string]: string; }>;
    reauthenticate(): Promise<boolean>;
}
```

The `getHeaders` method returns the HTTP headers to use when connecting to the replicator.
The `reauthenticate` method gives the client a chance to refresh its token.

```typescript
class OpenIDConnectAuthenticationProvider implements AuthenticationProvider {
    async getHeaders(): Promise<{ [key: string]: string; }> {
        const token = await this.getBearerToken();
        return Promise.resolve({
            "Authorization": `Bearer ${token}`
        });
    }

    async reauthenticate(): Promise<boolean> {
        const succeeded = await this.refreshToken();
        return succeeded;
    }
}

const authenticationProvider = new OpenIDConnectAuthenticationProvider();
```
