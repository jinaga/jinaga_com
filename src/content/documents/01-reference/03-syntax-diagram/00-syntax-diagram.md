---
title: 'Syntax diagram'
---

/*
Information about pikchr syntax:
- https://pikchr.org/home/doc/trunk/doc/userman.md
- https://pikchr.org/home/doc/trunk/doc/grammar.md

Online testing:
- https://pikchr.org/home/pikchrshow
*/


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


//========== Specification====================

move down 250%
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
