# Primitives
Custom semantic primitives for **developers**:
- `<view />`
- `<flex />`
- `<row />`
- `<col />`
- `<space />`
- `<text />`

Usage note: Requires [babel\-plugin\-object\-styles\-to\-template](https://github.com/satya164/babel-plugin-object-styles-to-template) and [linaria](https://github.com/callstack/linaria). See [starter](https://github.com/Chronstruct/static-starter/blob/master/.babelrc) for an example.

Also, if you'd like to auto-add `import {css} from 'linaria'`, use:
```js
["chronstruct-primitives", {
    "autoImport": true
}],
```
in `.babelrc` and use [this]() linaria fork.

# API
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