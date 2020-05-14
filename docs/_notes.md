# Random notes

These were once github Issues, now I'm pasting them here

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
