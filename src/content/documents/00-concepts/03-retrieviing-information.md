---
title: "Retrieving Information"
---

Once you've written a template function, you can query for facts matching that template.
The function `j.query` returns the results as an array.
It takes a starting fact and a *preposition*.
Use `j.for` to start a preposition, passing in a template function.

```typescript
const posts = await j.query(person, j.for(postsByAuthor));
```

[Try it](/examples/query/successors)

You can extend a preposition using `.then`.
This take another template function which continues where the previous one left off.

```typescript
const tags = await j.query(person, j
    .for(postsByAuthor)
    .then(tagsForPost));
```

[Try it](/examples/query/successors-of-successors)

While `j.query` is done as soon as it returns the results, you might want to keep watching the results, for example to update a user interface.
Call `j.watch` and pass in two functions: the first is called when a fact is added, and the second when a fact is removed.

```typescript
const watch = j.watch(person,
    j.for(postsByAuthor).then(titlesForPost),
    addPostTitleToList,
    removePostTitleFromList);

function addPostTitleToList(postTitle) {
    ...
}

function removePostTitleFromList(postTitle) {
    ...
}
```

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

box "watch:" big bold fit thick
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
