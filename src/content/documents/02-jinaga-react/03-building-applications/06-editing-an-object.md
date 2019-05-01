---
title: Editing an Object
---

When a user adds an object to a list, we'll show a modal dialog for them to initialize that object.
We want to reuse that same dialog when they edit the object.
This not only gives us less code to write, it also gives the user a more consistent experience.
Using the following guidelines, we can let the common things be common, and let the differences be different.

In a Jinaga application, modals have an additional benefit.
They freeze data at a certain moment in time.
Ordinarily the view will continue to update as new facts come in.
This might be the result of a subscription, or perhaps of the user's action on a different part of the page.
Either way, while live data is great for presentation, it is not good for editing.

When the user decides to edit some data, they will click a button.
At that moment, the current state of the object they are editing should be frozen.
Even if subscriptions are bringing in new data, the version that they see will be fixed.
Any changes they make will be applied to the version as they initially saw it.
This captures the user's intent: to change one version into another version.
