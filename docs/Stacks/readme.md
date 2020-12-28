# All about `stack`s

[WIP]

Why `stack` instead of `flex`?
- z axis is accounted for. Flexbox doesn't ahve an answer for this.

## `zStack`

Also called `z`, `<stack direction="z"/>`

```css
.original-element {
  position: relative;
}

.covering-element {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
```

from [CSS \{ In Real Life \} \| A Utility Class for Covering Elements](https://css-irl.info/a-utility-class-for-covering-elements/)

And/or affects `z-index`