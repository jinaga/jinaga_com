---
title: Data Entry Controls
---

A common user interface pattern is to present a set of labeled controls for user input.
These often appear within a modal dialog.
Since React has uni-directional binding, the way it handles data entry controls is a little different than most other frameworks.
And with Jinaga's penchant for immutability in the mix, things get even stranger.

The Enter key is special in data entry.
Whereas Tab will switch from one input to the next, Enter will submit the entire form.
To make this work as expected in a Web application, we will use the `<form>` element.
