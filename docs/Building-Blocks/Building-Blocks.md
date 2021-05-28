# Building Blocks

## Two primary types

Generic building blocks

Specific variants/impls. Copy/paste away, even if it is same composition of building blocks w/ a subtle tweak/diff

## Atom, Primitive, Element

Atom: what constitutes a `div` (block + inline)

- Everything normal (not iframe, canvas, etc) on the web boils down to the same thing that makes up the `div`: properties, event responder/hadler

Primitives: `span`, `div`, `input` (uses shadow dom)

- Level higher up is the default set of browser primitives, which are all essentially the same thing (as mentioned already), but with a preset value(s)/implementation applied.

Enhanced/modern Primitives: `view`, `txt`, `___stack`, `grid`
