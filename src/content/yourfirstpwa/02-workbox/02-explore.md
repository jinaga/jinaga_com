---
title: "Explore"
---

The application is very welcoming.
Other than that, though, its behavior is mostly hidden.
We can explore it in the Chrome dev tools.
Open them up again (⌥ + ⌘ + I on a Mac, or F12 on Windows) and go to the *Application* tab.

## Precache

Under the *Cache* heading, expand *Cache Storage* and take a look at the two files in cache.
One is `index.html`, and the other is a JavaScript bundle.

![HTML and JavaScript in Cache Storage](./index-precache.png)

This is what Workbox does for us.
It pre-caches the assets used by our front-end application.
It then generates a service worker that serves them from cache when the browser requests them.

## Service Worker

The generated service worker is in service-worker.js.
You can inspect this file by first clicking on the *Service Worker* item in the sidebar, then clicking on the service.worker.js link.

![Open the service worker code file](./service-worker.png)

There are a few important parts of this file.
The first two parts use the `importScripts` function built into the browser.
This function plays the same role as the `<script>` tag in HTML, loading a JavaScript file into the sandbox so it can run.
The first line imports the Workbox runtime from a CDN.
You could serve it from your site, but this takes advantage of Google's caches.

```javascript
importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");
```

The second line imports a manifest.

```javascript
importScripts(
  "/scripts/precache-manifest.8c5c2c7cb2a8b7d6f6bef8d24aa4ecfc.js"
);
```

You can find that manifest file in the `dist` folder.
The contents look like this:

```javascript
self.__precacheManifest = (self.__precacheManifest || []).concat([
  {
    "revision": "1cfc8b99c615edfd463556ed301e6349",
    "url": "/index.html"
  },
  {
    "url": "/scripts/index-6ec404ee52828515bfc0.js"
  }
]);
```

This adds a couple of entries to the precache manifest.
The `index.html` file has a revision hash so that Workbox can put a cache-busting query string parameter on it.
The JavaScript file, however, has the hash built into filename, so it doesn't need a revision hash.

Now back to the service worker.
The next section adds an event listener that we will find useful soon.
We'll get back to that.

```javascript
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
```

Then finally, we use the precache manifest to call a Workbox function.

```javascript
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
```

The `precacheAndRoute` function fetches all of the assets from the server and puts them into *Cache Storage*.
It then intercepts all calls from the browser for those URLs, and serves them from the cache.

Now let's see how these HTML and JavaScript files came to be.
