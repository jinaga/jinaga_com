---
title: "Writing Templates"
---

A template function uses `j.match` to produce a *specification*.
It passes in a template, which is a JSON object describing the type and one predecessor of the desired facts.

```typescript
function postsByAuthor(author) {
    return j.match({
        type: "Blog.Post",
        author
    });
}
```

It can use `suchThat` to extend the specification with *predicates*.
These apply additional conditions to the template.

```typescript
function publishedPostsByAuthor(author) {
    return j.match({
        type: "Blog.Post",
        author
    }).suchThat(postIsPublished);
}
```

A conditional function uses `j.exists` or `j.notExists` to produce a *condition*.
Just like a template function, a conditional function passes in a template.
This template is a JSON object describing the type and one predecessor of facts to match.
The condition tests whether any facts match that template.

```typescript
function postIsPublished(post) {
    return j.exists({
        type: "Blog.Post.Publish",
        post
    });
}
```

You can combine templates and conditions to describe complex shapes.
This diagram illustrates the rules for defining a template function.

```pikchr
//========== COMMON SETUP ===============

scale = 1.0
$r = 0.2in
linerad = 0.75*$r  //rouding of lines
linewid = 0.15  //length of lines
Z:box invisible

//========== Template Function ====================

move down 200%
move left until even with Z.w
right

box "template function:" big bold fill 0x8dd3c7 fit thick
move down 100%
move left until even with Z.w
right

D:[
text "Function that returns a" italic
box "specification" italic bold fit fill 0xffffb3 with n at last.s
]
Border: box width D.width height D.height*1.3 at D.c



//========== Specification====================

move down 150%
move left until even with Z.w
right

box "specification:" big bold fill 0xffffb3 fit thick
move down 100%
move left until even with Z.w
right

circle wid 10%
arrow right 200%
oval "j.match" fit
arrow
oval "(" fit
arrow
box "template" italic fit
arrow
A:oval ")" fit

arrow 300%
arrow left 200% then down 75% then right 200% <-

box "predicate" bold italic fit fill 0xfb8072

arrow right 200%  then up 75% then left <-
arrow right 300%
B:circle wid 10%

line from A.e to B.w

//========== predicate ====================

move down 200%
move left until even with Z.w
right

box "predicate:" big bold fill 0xfb8072 fit thick
move down 125%
move left until even with Z.w
right

circle wid 10%
arrow right 200%

oval "." bold fit
arrow
oval "suchThat" fit
arrow
C:oval "(" fit

arrow right then up 60% then right
oval "j.not" fit
arrow
oval "(" fit
arrow

X:[
     text "Function that returns a" italic
     box "condition" italic bold fit fill 0xbebada with n at last.s
  ]
Border: box width X.width height X.height*1.3 at X.c

arrow
oval ")" fit
arrow right then down 60% then right

D:oval ")" fit

arrow right from C.e then down 60% then right until even with X.w

Y:[
     text "Function that returns a" italic
     box "condition" italic bold fit fill 0xbebada with n at last.s
  ]
Border: box width Y.width height Y.height*1.3 at Y.c

arrow left from D.w then down 60% then left until even with Y.e <-
right
arrow right 200% from D.e
circle wid 10%

//========== Condition ====================

move down 200%
move left until even with Z.w
right

box "condition:" big bold fill 0xbebada fit thick
move down 150%
move left until even with Z.w
right

A:circle wid 10%

arrow right 200% then down 35% then right
B:oval "j.notExists" fit
arrow right then up 35% then right

arrow right 200% from A.e then up 35% then right
oval "j.exists" fit
line right until even with B.e
arrow right then down 35% then right

oval "(" fit
arrow
box "template" italic fit
arrow
C:oval ")" fit

arrow 300%
arrow left 200% then down 75% then right 200% <-

box "predicate" bold italic fit fill 0xfb8072

arrow right 200%  then up 75% then left <-
arrow right 300%
D:circle wid 10%

line from C.e to D.w

```
