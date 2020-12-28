# API

## Acceptable value types

number, string, bool, configObject

```jsx
// TODO: add examples
```

## Rules

There are some rules which don't feel very React-y, but just like Hooks' rules, they are necessary, and worth getting used to. (Problems with hooks: https://dillonshook.com/a-critique-of-react-hooks/)

- No passing variables of objects. Even if it is ALL*CAPS, it must be an inline object literal. Note: this means wrappers for things like txt could be a little tricky. You can't have an `<AppText color={{*: 'red', 'hover': 'blue}} />`, for example.

Maybe above is why I should make a lib of util functions with examples for how projects could make their own primitives? That way you could hard-code fonts, for example.

## `View` props

### String/number

- `as` -> what DOM node will be used to represent this element (used primarily for semantic html)
- `top`: 'top',
- `right`: 'right',
- `bottom`: 'bottom',
- `left`: 'left',
- `width`: 'width',
- `maxWidth`: 'maxWidth',
- `minWidth`: 'minWidth',
- `height`: 'height',
- `maxHeight`: 'maxHeight',
- `minHeight`: 'minHeight',
- `flex`: 'flex',
- `grow`
- `wrap`: 'flexWrap',
- `shrink`: 'flexShrink',
- `basis`: 'flexBasis',
- `order`: 'order',
- `alignContent`: 'alignContent',
- `alignSelf`: 'alignSelf',
- `align`: 'alignItems',
- `justify`: 'justifyContent',
- `padding`: 'padding',
- `paddingTop`: 'paddingTop',
- `paddingRight`: 'paddingRight',
- `paddingBottom`: 'paddingBottom',
- `paddingLeft`: 'paddingLeft',
- `margin`: 'margin',
- `marginTop`: 'marginTop',
- `marginRight`: 'marginRight',
- `marginBottom`: 'marginBottom',
- `marginLeft`: 'marginLeft',
- `position`: 'position',
- `overflow`: 'overflow',
- `overflowX`: 'overflowX',
- `overflowY`: 'overflowY',
- `zIndex`: 'zIndex',

### Boolean

- `center` -> `align-items: center; justify-content: center;`
- `hidden` -> `display: none;`
- `inline` -> `display: inline-flex;`
- `fit` -> `height: 100%; width: 100%;`
- `absoluteFill` -> `position: absolute; top: 0; right: 0; bottom: 0; left: 0;`

## `Space` props

- `as` -> what DOM node will be used to represent this element (used primarily for semantic html)
- `size`

## `Text` props

### String/number

- `as` -> what DOM node will be used to represent this element (used primarily for semantic html)
- `align`: 'textAlign',
- `color`: 'color',
- `decoration`: 'textDecoration',
- `decorationColor`: 'textDecorationColor',
- `font`: 'fontFamily',
- `height`: 'lineHeight',
- `size`: 'fontSize',
- `spacing`: 'letterSpacing',
- `transform`: 'textTransform',
- `weight`: 'fontWeight',

### Boolean

- `antialiased`
- `italic` -> `font-style: italic;`
- `center` -> `text-align: center;`
- `bold` -> `font-weight: bold;`
- `uppercase` -> `text-transform: uppercase;`

## `pic` props

Not yet implemented

## `vid` props