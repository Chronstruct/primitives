# Random notes

## For a presentation

```jsx
<div className="container">
  <nav className="navbar">
    <Link />
    <Link />
  </nav>

  <main className="main">
    <h1 className="section__heading">A Heading</h1>
    <p className="section__copy">Some body of text</p>
  </main>
</div>
```

Ask audience what they expect the web app to look like. Surprise them with a vertical navbar on the left side. Container is a flex-box row.

```jsx
<column>
  <row
    tag="nav"
    height={80}
    align="center"
  >
    <Link />
    <Link />
  </row>

  <column
    tag="main"
    center
  >
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
    <txt tag="p">Some body of text</txt>
  </column>
</column>
```

What if nav should be on top for phone? Introduce configuration objects for responsive styles.

`<flex direction={{ _: "column", MEDIUM_UP: "row" }}>`

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

As a developer, friction in reading or writing code is just about the worst. It is like playing a video game with a laggy internet connection, or talking to someone over a spotty connection. These property-based styles reduce friction in two ways:

##### Writing: No Naming

##### Reading: Locally reasoned

---

How do you know it isn't adding to the runtime cost? `yarn add -D`. That `-D` is excellent!

## For the readme

rapid-prototype production-ready code

---

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

Styles-as-props primitives to reduce developer friction without compromising UX.

s2d without sacrificing UX. Fixes the style problem. css is a really good thing, it is sent to the client as a separate type from js, and doesn't pay the js tax when the client interprets it.

---

These primitives have _meaining_

_Semantic html_ is necessary for users of screen readers and your SEO. They're important for

It better describes the intent and type of a tag. These primitives are _semantic_ for us **developers** (and still render as sematic html).

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

## [2 approaches to separating concerns](https://github.com/Chronstruct/primitives/issues/8)

Two approaches I can take with separating concerns. Either complete seperation, or some separation.

Lets build a green box that does something on click.

Complete Separation:
Put down a drop of green paint. Now, expand that paint to desired size by putting a box in it. Now, wrap that whole thing with an interact to make it interactive.

Or you could think of things as always filling space, and flex just being a container to stop it at certain points.

Some Separation:
Place a box down with desired size. All elements in dom have styles, and all elements in dom have interactability, so add you style and event objects to this box.

Something I really liked when learning and using React Native was the lack of a button component. Instead, you had a Touchable wrapping a Text component. Want a border and padding? Add it to the touchable. Same goes for a link: it is .a Touchable wrapping a Text component without a border, and without padding. Simple.

## [`box` thoughts](https://github.com/Chronstruct/primitives/issues/7)

Why box? It is 3 chars, like row and col. Nice to have this consistency for skimming.

Also easier to casually say than "flex". "Add a styled box" vs "add a styled flex".

Does not stand for a physical box, just a shortening for flexbox.

Why not box?
Conceptually, it just doesn't make sense to think of a circle or triangle being a styled box.

--

Use box or flex, no view. When wrapping one or less children, view was desired, but it is hard to justify keeping for learning the framework.

"\[flex\]box is in charge of all layouts. It can place children as a row or col. We have a row and col component for this shorthand, which primarily helps the developer know if they should read children as top-down or left-right."

--

"The geometry of a view is that of a rectangle. A view has a location, expressed as a pair of left and top coordinates, and two dimensions, expressed as a width and a height."

It is a good point, really. What if your view was a Triangle, how would you define its position? So, a primitive component may make sense, even when it is actually a triangle or circle.

--

`view` may be interacted with by user, takes up space (has a geometry), and may be styled (visual/cosmetic things).

`view` is **interactable**

--

Flutter uses Container -> Row, Column.

Decorated with BoxDecoration.

> The Container widget lets you create a rectangular visual element. A container can be decorated with a BoxDecoration, such as a background, a border, or a shadow. A Container can also have margins, padding, and constraints applied to its size. In addition, a Container can be transformed in three dimensional space using a matrix.

[Introduction to widgets \- Flutter](https://flutter.io/docs/development/ui/widgets-intro)

--

From above:

> Why not box? Conceptually, it just doesn't make sense to think of a circle or triangle being a styled box.

To be fair though, circle and triangle are made (when using divs) by starting with a box and morphing it.

Also, `box` could be the generic container, then `row` and `col` are subsets. `stack` is, too.

--

Layouts are also very much block based. If we had circles as the building block, taking a hand full of them would not nest nicely as a block out, they're radiate out, and you'd need something like radial coordinates (as some watches do).

--

> Most of the time you’ll find Flutter uses a RenderBox instead of another RenderObject. That’s because the people behind the project realised that a simple box layout protocol works very well to build performant UIs. Think of every widget placed in it’s own box which is calculated and then arranged with other pre-laid-out boxes.

[The Layer Cake – Flutter Community – Medium](https://medium.com/flutter-community/the-layer-cake-widgets-elements-renderobjects-7644c3142401)

## [Layout components separation](https://github.com/Chronstruct/primitives/issues/10)

Layout components' attribute are basically all the things that wouldn't change with themes.

"layout and appearance"

[The Benefits of Structuring CSS Around Appearance and Layout \| CSS\-Tricks](https://css-tricks.com/the-benefits-of-structuring-css-around-appearance-and-layout/)

> UIStackView is a **non-drawing** view, meaning that drawRect() is never called and its background color is ignored. If you desperately want a background color, consider placing the stack view inside another UIView and giving that view a background color.

[How to give a UIStackView a background color \- free Swift 5\.0 example code and tips](https://www.hackingwithswift.com/example-code/uikit/how-to-give-a-uistackview-a-background-color)

Flexbox better called "LinearLayout". Also better than UIStackView.

## [`frame` layout component?](https://github.com/Chronstruct/primitives/issues/16)

In the world of view, row, col, flex, what satisfies the use case of Android's Frame, which stacks all children in its bounds (children are absolute, top: 0, left: 0).

Maybe called `<stack />` instead

Flutter uses Stack: [Stack class \- widgets library \- Dart API](https://docs.flutter.io/flutter/widgets/Stack-class.html)

[FittedBox \(Flutter Widget of the Week\) \- YouTube](https://www.youtube.com/watch?v=T4Uehk3_wlY&feature=youtu.be) keeps inner children from painting outside of the box. Interesting idea.

SwiftUI calls this ZStack (stack in z axis)

## [grid](https://github.com/Chronstruct/primitives/issues/18)

Grid seems great for sites/pages.

Also actual grids (product walls). I.e actual unknown amount of items.

Seems like a necessary building component

--

https://www.youtube.com/watch?v=DCZdCKjnBCs

https://cssgrid.io/

http://www.gridcritters.com/

grid seems great for sites/pages. Also actual grids (product walls) -> unknown amount of items.

Difference between containing grid and it's items. Explicit vs implicit tracks.

Best way to size grid items is to span multiple grid spots. Similar to tables back in the day.

grid: slice up a view into tracks (rows, cols)

[CSS \{ In Real Life \} \| To Grid or to Flex?](https://css-irl.info/to-grid-or-to-flex/)

## [`<link>`](https://github.com/Chronstruct/primitives/issues/21)

Actually pretty complicated. More than just a `<text/>` with onclick.

Look in to [GoogleChromeLabs/quicklink: ⚡️Faster subsequent page\-loads by prefetching in\-viewport links during idle time](https://github.com/GoogleChromeLabs/quicklink)

[scaleapi/data\-prefetch\-link: Extends next\.js `<Link>` to allow invoking getInitialProps when prefetching a page](https://github.com/scaleapi/data-prefetch-link)

## [Don't think of it as css](https://github.com/Chronstruct/primitives/issues/26)

Good thread: https://twitter.com/necolas/status/1081250856404541440

> I don't want CSS in JavaScript. I want a far more reliable and powerful styling system in JavaScript so we can build the next generation of UIs on the web. It shouldn't leave HTML/CSS specialists behind but instead empower them to do things that weren't easy or possible before.

For example, `:hover` should not be in css. It is an event. I feel the same about media queries, for the most part.

## [Animation](https://github.com/Chronstruct/primitives/issues/34)

AnimationController used with animation values for timelines

"AnimationController" used by "TransitionDelegate" in ios

## [`<text />` flow affected by neighbors](https://github.com/Chronstruct/primitives/issues/22)

[An Introduction to CSS Shapes \| Codrops](https://tympanus.net/codrops/2018/11/29/an-introduction-to-css-shapes/?utm_source=ponyfoo+weekly&utm_medium=email&utm_campaign=145) shows this well. A reason to think of `<text />` as more than just content? The reason Flutter, for example, has Skia for 2d graphics, and other engine for text at the same low-level?

--

![](https://codropspz-tympanus.netdna-ssl.com/codrops/wp-content/uploads/2018/11/cssshapes_polygon1.jpg)

![](https://codropspz-tympanus.netdna-ssl.com/codrops/wp-content/uploads/2018/11/cssshapes_circle1.jpg)

## [`<text />` more than just paint/pixels ](https://github.com/Chronstruct/primitives/issues/24)

Text is a mix of pixels + layout because it flows. This is why it is special. It is a pattern that can repeat essentially. Just as if you repeated svg paths, it'd need more properties to know how/when it should wrap or not.

Thought about while looking at the text in https://www.hanselman.com/blog/EnjoySomeDOSGamesThisChristmasWithDOSBox.aspx

"Canvas", "Paint", and "TextBox" at lowest level of Dart:ui. Makes sense to call it textbox instead of text because that is really what it is. Handles wrapping and such.
https://medium.com/flutter-community/the-layer-cake-widgets-elements-renderobjects-7644c3142401

--

`<text>` is just a flexbox row with wrapping enabled.

--

text is composed of characters, which are rectangular drawings

--

Maybe `<text/>` should be renamed to `<textBox/>` or described as such. Since it is just a special `div`

Thought about when I saw name of https://textblock.io/

or `<textView>` or `<textBlock>`

--

Text -> Label, can have multilines, but explicitly defined
TextView -> scrollable

each has `selectable` attribute for allowing the selection of text.

In reality though, text is a row of character shapes, with logic built-in to wrap on whitespace (or not).

--

also, `baseline` is a consideration in text, as SF Symbols demonstrates
