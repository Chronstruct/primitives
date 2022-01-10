# Building Blocks

> !! This document is a work in progress !!

## Two primary types

Generic building blocks

Specific variants/impls. Copy/paste away, even if it is same composition of building blocks w/ a subtle tweak/diff

## Atom, Primitive, Element

Atom: what constitutes a `div` (block + inline)

- Everything normal (not iframe, canvas, etc) on the web boils down to the same thing that makes up the `div`: properties, event responder/hadler

Primitives: `span`, `div`, `input` (uses shadow dom)

- Level higher up is the default set of browser primitives, which are all essentially the same thing (as mentioned already), but with a preset value(s)/implementation applied.

Enhanced/modern Primitives: `view`, `txt`, `___stack`, `grid`

## From thinking in _boxes_ to thinking in _Primitives_

When building for the web, we think in boxes: span - inline box, div - full-width box.

This is where I should start with Constelation. Start with the standard box. Move in to how boxes can contain content (e.g. text), can have decorations (borders, backgrounds), transformations (rotate, flip, zoom) and can handle events (touch).

`txt`, then, is a `box` with text content. Crucially, though, it is more limited than a `box`, because it focusses on the text.

Maybe it'd be better to say that txt is a div with text content, since box is also constrained?

Thought about from title of https://css-tricks.com/think-without-boxes/

## Other ideas

Tags: Product, Development, Design (aka each role should be aware of this)

Primitives -> Elements -> Compositions -> Scenes

Elements: Hamed compositions of Primitives

Compositions: Named compositions of Elements and Primitives

Scenes: Named, top-level/navigable Compositions

"User interface elements"

- Input controls
- navigational components
- information
- container (e.g. accordion)

---

View is an Atom in that all primitives are a form of it. I.e. they all reduce down to something that can paint pixels, handle user interaction, and app events. Like elctrons, protons, neutrons

---

### Building blocks for constructing digital products

or "Primitives of digital products and experiences"

https://github.com/Chronstruct/primitives/issues/32

these concepts will help simplify (not to be confused with "make easier") the process of thinking through and building.

pixels and cartesian coordinates to construct whole page. Then let it change based on viewport (introduce state). Bring in programmatic/auto alignment (vs hard coding x/y/width/height).
https://www.smashingmagazine.com/2019/03/css-alignment/

Start with body of text. How was/is this created?

pixel -> shape -> text representations w/ fonts, sizes, and styles -> text blocks for wrapping and alignment

Now move on to a triangle.

Add interactivity from user.

Interactivity from system -> timeout to an animation.

Browser/site state: link shows purple if visited before.

Brings up browser abstractions. These should not be primitives, they should be capitalized.

Go through examples, breaking down widgets and defining then with these new primitives. Label them: "Breakdown: text example"

Responsive sizing. Changing based on media queries: https://github.com/Chronstruct/primitives/issues/6

Related:
https://css-tricks.com/understanding-event-emitters/

https://www.smashingmagazine.com/2019/03/svg-circle-decomposition-paths/ -> paths to circles

https://github.com/Chronstruct/primitives/issues/19
https://github.com/Chronstruct/primitives/issues/4
https://github.com/Chronstruct/primitives/issues/7
https://github.com/Chronstruct/primitives/issues/10
https://github.com/Chronstruct/primitives/issues/25
https://github.com/Chronstruct/primitives/issues/27

### Paint, Layouts, and Events

All things reduce to Paint, Layout, and Events

Or, painters, layout(ers), and event handlers (emitters and/or receivers). Any component on screen may be some combination of the 3.

events for user interaction, user client (device, viewport, etc), or notifications/code events.

event may affect paint. event may affect layout. event may affect nothing in the ui.

text block combines all paint and layout

text input combines paint, layout, and events

scrollview is just layout + events (though paint is implied by its childrens' paint)
