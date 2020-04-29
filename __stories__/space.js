import React from "react"
import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"
import { css } from "linaria"

storiesOf("space", module)
  .add("horizontal", () => (
    <row height={200} width={400}>
      <view
        grow
        style={{
          backgroundColor: "red",
        }}
      />
      <view
        grow
        style={{
          backgroundColor: "green",
        }}
      />
      <space size={20} />
      <view
        grow
        style={{
          backgroundColor: "blue",
        }}
      />
    </row>
  ))
  .add("vertical", () => (
    <col height={200} width={400}>
      <view
        grow
        style={{
          backgroundColor: "red",
        }}
      />
      <view
        grow
        style={{
          backgroundColor: "green",
        }}
      />
      <space size={20} />
      <view
        grow
        style={{
          backgroundColor: "blue",
        }}
      />
    </col>
  ))
