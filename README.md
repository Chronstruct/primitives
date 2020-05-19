# Primitives

Semantic primitives for **developers** that improve DX without hurting UX.

- **Meaningful** tag names for humans
- **Property-based** styles reduce developer friction
- **Single-purpose** primitives, with focussed APIs
- **Uncompromising** user experience

Currently supported primitives: `box`, `row`, `column`, `flex`, `space`, `txt`

[Installation](docs/installation.md) | Guides | [API](docs/api.md) | FAQ

## Explanation

[Semantic html](https://developer.mozilla.org/en-US/docs/Web/HTML/Element) is necessary for screen readers and SEO, but does little for _human_ code readers (aka developers). These primitives **are** meaningful for developers and help us understand what will be rendered.

Replace unknown and assumption-based primitives:

```jsx
const MySection = () => (
  <section className="unknown">
    <h1 className="assumption">You think you know, but you have no idea</h1>
    <span>Where will this text go?<span>
  </section>
)
```

With locally reasonable, descriptive ones:

```jsx
const MySection = () => (
  <row
    tag="section"
    justify="space-between"
  >
    <txt
      tag="h1"
      size={10}
      font="Comic Sans"
      color="blue"
    >
      You think you know, and you're right!
    </txt>
    <txt>This text is in a row, so it'll appear right of the heading</txt>
  </row>
)
```

## How

There are a couple cool things about the primitives above that you may have not noticed:

- there are no imports
- the tags are lowercase, like a normal browser primitive (e.g. `<div>`, `<span>`, `<p>`)

This is made possible by a `babel-transform` (or a `webpack-loader`), and some added types if you're using Typescript. At compile time, `<insert name>` runs through and converts

```jsx
<box
  tag="main"
  height={20}
  width={300}
/>
```

into

```jsx
<main
  className={css`
    height: 20;
    width: 300;
  `}
/>
```

then, `linaria` can work its magic to extract static styles, to become something like

```jsx
<main className="lgh3ofh" />
```

## Benefits

#### Tag names are meaningful for developers

```jsx
<column>
  <row>
    <SomeComponent />
    <AnotherComponent />
  </row>

  <space size={32} />

  <txt>Some text</txt>
</column>
```

- See that `<column>` tag? That means you should read it's children top-down.
- See that `<row>` tag? That means you should read left-right.
- See that `<space/>` tag? It is only there to take up space.

#### Property-based styles reduce developer friction

```jsx
<txt
  tag="h1"
  font="cursive"
  size={36}
  height={40}
  spacing={0.2}
  color="red"
>
  A Heading
</txt>
```

Reduce _reading_ friction by being locally reasonable. I don't need to jump anywhere else in the code to understand what this code is. It isn't definied in some styles object above/below the `render()`, and it isn't defined in some external file (like `.css`).

Reduce _writing_ friction by avoiding naming completely (Is this thing a "container" or "wrapper"? Is this part of the block (BEM)? Or is it a new block?). This inline approach also enables easier extraction, for when it is time to refactor. Since everything is right here in the render, I can extract it easily. I won't need to remember to move its styles from elsewhere.

#### Single-purpose primitives, with a focussed APIs to support their intent

Since a `<div />` can do and be [anything](https://a.singlediv.com/), `<div className="someName" />`, which is really cool, but doesn't help us understand and write maintainable code.

`<txt />`, on the other hand, has first-class props (`size`, `height`, `color`, `font`, `spacing`) that ONLY relate to what it cares about: text. If you want to add non-text-related effects to it, like a background color, or click event, you'll have to use a second-class prop (`_style={{background: 'red}}`).

`<row />`, `<column />`, and `<flex />` are similar in that they only care about geometry/layout (for themselves and their children).

#### Uncompromising UX

These primtives were built with [linaria](https://github.com/callstack/linaria) in mind. With linaria, all static styles are extracted out to `.css`, which results in a faster [TTI](https://web.dev/interactive/) than if the styles were sent in the javascript (what runtime css-in-js solutions do).

```jsx
<box
  height={20}
  width={40}
  _style={{ background: "red" }}
/>

// becomes
<div className="..." />
```

Dynamic styles are still supported, though. When a variable is used for a value, it is added to the element's inline style.

```jsx
<box
  height={20}
  width={40}
  _style={{ background: props.color }}
/>

// becomes
<div
 className="..."
 style={{background: props.color}}
/>
```

In the future, the linaria dependence may be configured to use other libs.

## Inspirations

- [constelation/monorepo](https://github.com/constelation/monorepo)
- [jxnblk/rebass](https://github.com/jxnblk/rebass)
- [jxnblk/styled\-system](https://github.com/jxnblk/styled-system)
- [mrmartineau/design\-system\-utils](https://github.com/mrmartineau/design-system-utils)

## License

This project is licensed under the [MIT license](LICENSE).

### Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion by you, shall be licensed as MIT, without any additional terms or conditions.
