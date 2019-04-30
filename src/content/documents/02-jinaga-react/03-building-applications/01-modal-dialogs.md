---
title: Modal Dialogs
---

Modal dialogs are often used to collect input from the user before performing an action.
They make it clear to the user that they must complete this input before proceeding.

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
