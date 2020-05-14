# Primitives

css was built for a world of templates and pages, and it works really well in this setting. But today, we're writing and building with components.

In a perfect component-world, everything would by dynamic. Props are variables, after all, and we like to make style and layout adjustments based on these props. Buuut, the web is different from native: users have to "install" our app every visit to see it. CSS is an optimization. It allows us to extract configuration statically, then send it to the client in a more performant way than if it was sent as runtime code.

---

Wild West with its styles and div/spans that can be basically anything. No clear separation of responsibility, with css affecting layout as well as tags (multiple vectors/sources of truth). Good for pages, maybe, and able to get by with conventions like BEM, but feels off in a component world.

---

Property-based styles, using single-focussed primitives.

---

> Promises were invented, not discovered. The best primitives are discovered, because they are often neutral and we can’t argue against them.

https://staltz.com/promises-are-not-neutral-enough.html

---

naming is hard. it slows you down and interrupts your thought processes.

naming should not be done before the implementation. Build the thing, when it seems you should refactor it out, give it the name that it is likely already telling you.

---

What is wrong with loops vs functions like map, reduce, filter..?
Loops don’t give the reader any information about the kind of operation being performed

Same applies to divs vs row, col, flex.

--

Makes your react code more declarative.

---

Prop can be a value (static or dynamic), or a configuration object

---

s2d - Semantic to Developer

essentially, all boils down to div and View, or "something that paints pixels, may position and be positioned, and may react to events".

But if our code was composed entirely of divs (or Views) with many attributes to make img, scrollview, etc, it would be pretty rough to skim through.

---

Optimal ux AND dx.

Why does this exist?

- to reduce developer friction, and not compromise on UX
- less naming
- seperation of concerns
- static css sent as css (better perf for user)

A set of primitives focussed on DX, without sacrificing UX

Q: Why need a babel transform?

- originally for perf (see playbook's reconciler)
- needed for prop-based styles
- essentially enables a layer of known, but dynamic to the static extraction

for example, look at Space's implementation. All of these classnames were created, even if they were never used.:

```jsx
const SIZE_128_MEDIUM = css`
  @media ${MEDIUM} {
    flex-basis: 128px;
  }
`
const SIZE_144_MEDIUM = css`
  @media ${MEDIUM} {
    flex-basis: 144px;
  }
`
const sizesMedium = {
  "0": SIZE_0_MEDIUM,
  "8": SIZE_8_MEDIUM,
  "16": SIZE_16_MEDIUM,
  "24": SIZE_24_MEDIUM,
  "32": SIZE_32_MEDIUM,
  "48": SIZE_48_MEDIUM,
  "64": SIZE_64_MEDIUM,
  "96": SIZE_96_MEDIUM,
  "128": SIZE_128_MEDIUM,
  "144": SIZE_144_MEDIUM,
}
```

Using a transform allows for "dynamic, known' values: `size={{_: 16, [MEDIUM]: 128}}`. Only the styles that are used will be created.

---

When thinking about these components, it is best to picture them in a WYSIWYG editor (like the image at https://github.com/danscan/fractal). What are the essential pieces of this editor, and how would you convert them to code components?

- `View`, `ScrollView`, `Space`, `Text`, `Image`, and `Video` would exist on the left side as your palette
- `Style_`, `Event_`, `Animate_` would exist as tabs on the right side for editing properties of the palette components
- Future `Layer` would exist to coordinate `z-index`
- Future `Timeline` would exist to time/choreograph events

---

## What?

Styles-as-props primitives to reduce developer friction without compromising UX.

s2d without sacrificing UX. Fixes the style problem. css is a really good thing, it is sent to the client as a separate type from js, and doesn't pay the js tax when the client interprets it.

Custom semantic primitives for **developers**:

- `<view />`
- `<flex />`
- `<row />`
- `<column />`
- `<space />`
- `<txt />`

## Why?

_Seminatic_ html is great for users, screen readers, and SEO. It better describes the intent and type of a tag. These primitives are _semantic_ for us **developers**.

```jsx
<col
  as='main"'
  height={200}
  width={400}
>
  <view
    as="section"
    grow
    style={{
      backgroundColor: "red",
    }}
  />

  <row as="section">
    <view
      padding={20}
      marginTop={10}
      zIndex={100}
    />
    <view
      width="20%"
      minWidth={200}
    />
  </row>

  <space size={20} />
  <view
    as="footer"
    style={{
      backgroundColor: "blue",
    }}
  />
</col>
```

- See that `<col>` tag? That means you should read it's children top-down.
- See that `<row>` tag? That means you should instead read it left-right.
- See that `<space/>` tag? It is only there to take up space.

Of course, there are more benefits than just being semantic to developers, these primitives also give us streamlined APIS for dealing with `text`, `image`s, etc. And all of this is done in your `.js`, on the specific component as first-class `props`.

One last benefit to mention: _separation of concerns_. Layout components expose geometry-related styles as props. All cosmetic styles are added with the `styles` prop. These are all extracted out to static `.css` and auto-imported using [linaria](https://github.com/callstack/linaria). For dynamic styles, simply use `inlineStyles`.

## Getting started

`yarn add chronstruct-primitives`

Usage note: Requires [babel\-plugin\-object\-styles\-to\-template](https://github.com/satya164/babel-plugin-object-styles-to-template) and [linaria](https://github.com/callstack/linaria). See [starter](https://github.com/Chronstruct/static-starter/blob/master/.babelrc) for an example.

Also, if you'd like to auto-add `import {css} from 'linaria'`, use:

```js
["chronstruct-primitives", {
    "autoImport": true
}],
```

in `.babelrc` and use [this]() linaria fork.

# Dev Notes

### Testing

To run a single test, use `yarn test -t 'test name'`. e.g. `run test -t "chronstruct-primitives fixtures"` to run all babel-plugin-tester fixtures.

### Publish

`npm publish`. If errors with "You must be logged in to publish packages", then `npm login`.

### Other

- [Babel types · Babel](https://babeljs.io/docs/core-packages/babel-types)
- [AST explorer](https://astexplorer.net/)
- [babel\-plugin\-object\-styles\-to\-template/index\.js at master · satya164/babel\-plugin\-object\-styles\-to\-template](https://github.com/satya164/babel-plugin-object-styles-to-template/blob/master/index.js)
- [babel\-literal\-to\-ast/index\.js at master · izaakschroeder/babel\-literal\-to\-ast](https://github.com/izaakschroeder/babel-literal-to-ast/blob/master/src/index.js)

## Inspirations

- [constelation/monorepo: Mono repo for constelation's Components, functions, and CONSTANTS](https://github.com/constelation/monorepo)
- [jxnblk/rebass: Functional React UI component library, built with styled\-components](https://github.com/jxnblk/rebass)
- [jxnblk/styled\-system: Design system utilities for styled\-components and other css\-in\-js libraries](https://github.com/jxnblk/styled-system)
- [mrmartineau/design\-system\-utils: Design system framework for modern front\-end projects](https://github.com/mrmartineau/design-system-utils)
