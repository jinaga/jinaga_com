---
title: "Authentication"
---

You can get an API key from your [Twitter Apps Dashboard](https://developer.twitter.com/en/apps).
Sign up for a developer account and create a new app.
Be sure to enable Sign In with Twitter.
Add a callback URL for `http://localhost:8080/auth/twitter/callback`.
If you plan to deploy to the cloud, you can also add a Netlify or Azurewebsites URL as well, using the same path.

Once you create your application, you will get a Consumer API Key and Consumer API Secret Key.
These will go into environment variables on your machine.
On a Mac, add these lines to '~/.bash_profile`:

```bash
export TWITTER_CONSUMER_KEY=xxxxxxxxxxxxxxxxxxxxxxxxx
export TWITTER_CONSUMER_SECRET=yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
```

On Windows, use System Settings to change environment variables.

Stop the application, close the terminal window, and restart it again for these changes to take effect.
You will be able to click the link and log in with any Twitter account (not just the developer account).
But, you will run into the next issue.
