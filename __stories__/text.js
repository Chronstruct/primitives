import React from "react"
import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"
import { css } from "linaria"

storiesOf("text", module)
  .add("size", () => <text size={20}>Size 20px</text>)
  .add("uppercase", () => (
    <text size={16} uppercase>
      This is uppercase
    </text>
  ))
  .add("bold", () => (
    <text size={16} bold>
      This is bold
    </text>
  ))
