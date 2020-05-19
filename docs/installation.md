## Installation

> !THIS IS CURRENTLY OUT OF DATE!

`yarn add -D chronstruct-primitives`

Usage note: Requires [linaria](https://github.com/callstack/linaria). See [starter](https://github.com/Chronstruct/static-starter/blob/master/.babelrc) for an example.

Also, if you'd like to auto-add `import {css} from 'linaria'`, use:

```js
["chronstruct-primitives", {
    "autoImport": true
}],
```

in `.babelrc`

### Typescript: reference types

Since this is global, and you have no reason to `import {} from chronstruct-primities` in your source code, create a `global.d.ts` file in your project with:

```ts
/// <reference types="chronstruct-primitives" />
```

Now, typescript should understand these primitives and not error.
