---
title: "Audit"
---

You finally have a PWA working the way you want it to.
But before you push it to production and tell everyone to download it, you might want to run a quick audit.
Open up the *Audits* tab in the browser, and scroll to the bottom of the form.
Click the *Run audits* button.

The screen will flash through your web page a few times.
When it's finished, you will have your results.

![Audit results from a Workbox application](./audit-results.png)

The performance is rubbish because we are running in development mode.
None of the JavaScript is minified.
But that's not what we're looking at right now.
Take a look at the PWA icon.
It has two little quarks in it.
We haven't earned the third quark, yet.
Click on it to scroll down for more details.

![Details about the PWA audit results](./pwa-details.png)

The first quark represents how *Fast and Reliable* the app is.
It's primarily measuring whether the application loads while it is offline.
To see this test fail, comment out the registration of the service worker from `register-service-worker.js`.

```javascript
// window.addEventListener('load', () => {
//   (async () => {
//     const registration = await navigator.serviceWorker.register('/service-worker.js');
//     console.log(`Registered service worker with scope ${registration.scope}.`);

//     listenForWaitingServiceWorker(registration, promptUserToRefresh(promptForRefresh));
//   })().catch(err => console.log(`Service worker registration failed: ${err}`));
// });
```

Then clear your audit results and run it again.
You will see that the dinosaur shows up during the test.
Without the service worker, the application can't respond while offline.
You will also see that we lost both quarks.

The second quark represents how *Installable* the app is.
We failed this test because we don't register a service worker.
Uncomment that code to get the service worker back, but now comment out the link to the manifest in `index.html`.

```html
<!-- <link rel="manifest" href="/manifest.json"> -->
```

Run the audits again.
The dinosaur is gone, but we still fail both of the tests.
The first one now fails because there is no `start_url`.
This is part of the manifest.

Uncomment the code so you can see your PWA passing again.
Well, at least mostly.
It fails the HTTPS redirection test, because we have that disabled in development mode.
If you deploy the project to [Netlify](https://netlify.com) or [Azure](https://azure.com), you will have a certificate and you will be using the production build.
It will redirect to HTTPS, and you will earn the third quark.
Incidentally, the performance will be much better as well, since it will be running minified JavaScript.
