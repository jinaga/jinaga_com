---
title: "Retrieving Information"
---

Once you've written a specification function, you can retrieve facts matching that specification.
When you need those facts in a single snapshot, you will run a query.
But when you need to be continuously informed about those facts, then you will start a watch.

## Query

The function `j.query` returns facts matching a specification as an array.
The first parameter is a starting fact.
The second is a *preposition*, which you create by calling `j.for` with a specification function.

```typescript
const posts = await j.query(person, j.for(postsByAuthor));
```

[Try it](/examples/query/successors)

You can extend a preposition using `.then`.
This takes another specification function which continues where the previous one left off.

```typescript
const tags = await j.query(person, j
    .for(postsByAuthor)
    .then(tagsForPost));
```

[Try it](/examples/query/successors-of-successors)

## Watch

While `j.query` is done as soon as it returns the results, you might want to keep watching the results, for example to update a user interface.
Call `j.watch` and pass in two functions: the first is called when a fact is added, and the second when a fact is removed.

```typescript
const postWatch = j.watch(person,
    j.for(publishedPostsByAuthor),
    addPostToList,
    removePostFromList);

function addPostToList(post) {
    ...
    return postListItem;
}

function removePostFromList(postListItem) {
    ...
}
```

[Try it](/examples/watch/add-and-remove)

You can chain watches together to continue loading details within a list.

```typescript
const titleWatch = postWatch.watch(
    j.for(titlesForPost),
    setPostTitle);

function setPostTitle(postListItem, postTitle) {
    postListItem.text(postTitle.value);
}
```

When you are done, be sure to call `stop` on the top level.

```typescript
postWatch.stop();
```

This stops the entire tree of watches so that no further updates are attempted.

If you are using a front-end framework such as React, you will probably use an adapter like [Jinaga React](/documents/jinaga-react/) rather than creating watches directly.

```pikchr
//========== COMMON SETUP ===============

scale = 1.0
$r = 0.2in
linerad = 0.75*$r  //rouding of lines
linewid = 0.15  //length of lines
Z:box invisible

//========== Query ====================

move down 125%
move left until even with Z.w
right

box "query:" big bold fit thick
move down 100%
move left until even with Z.w
right

circle wid 10%
arrow right 200%
oval "j.query" fit
arrow
oval "(" fit
arrow
box "starterFact" italic fit
arrow
oval "," fit
arrow
box "preposition" bold italic fit fill 0x8dd3c7
arrow
oval ")" fit
arrow 200%
circle wid 10%

//========== Watch ====================

move down 175%
move left until even with Z.w
right

box "watch:" big bold fill 0xf0a1e6 fit thick
move down 100%
move left until even with Z.w
right

circle wid 10%
arrow right 200%
oval "j.watch" fit
arrow
oval "(" fit
arrow
box "starterFact" italic fit
arrow
oval "," fit
arrow
box "preposition" bold italic fit fill 0x8dd3c7
arrow
oval "," fit
arrow
box "resultAdded" italic fit
arrow
oval "," fit
arrow
box "resultRemoved" italic fit
arrow
oval ")" fit
arrow 200%
circle wid 10%

move down 100%
move left until even with Z.w
right

circle wid 10%
arrow right 200%
box "watch" bold italic fit fill 0xf0a1e6
arrow
oval ".watch" fit
arrow
oval "(" fit
arrow
box "preposition" bold italic fit fill 0x8dd3c7
arrow
oval "," fit
arrow
box "resultAdded" italic fit
arrow
oval "," fit
arrow
box "resultRemoved" italic fit
arrow
oval ")" fit
arrow 200%
circle wid 10%

//========== Preposition ====================

move down 200%
move left until even with Z.w
right

box "preposition:" big bold fill 0x8dd3c7 fit thick
move down 100%
move left until even with Z.w
right

circle wid 10%
arrow right 200%
A:oval "j.for" fit
arrow 200%
oval "(" fit
arrow

D:[
text "Function that returns a" italic
box "specification" italic bold fit fill 0xffffb3 with n at last.s
]
Border: box width D.width height D.height*1.3 at D.c

arrow
B:oval ")" fit
arrow 300%
circle wid 10%
arrow right from B.e then down then left
C: [text "then"
move -charwid
text " ." bold]
oval width C.width height C.height at C.center
arrow left 200%
arrow left until even with A.e + (0.15,0) then up then right
```
