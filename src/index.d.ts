// import type { PointerEventsProperty} from 'csstype'

type BooleanOnly = boolean | { [key: string]: boolean }
type StringOnly = string | { [key: string]: string }
type NumberOrString = number | string | { [key: string]: number | string }
type NumberOrBoolean = number | boolean | { [key: string]: number | boolean }

type StyleValue =
  | React.CSSProperties
  | { [key: string]: any }
  | { [key: string]: { [key: string]: any } }

type AnimateValue = {
  delay?: string
  duration?: string
  direction?: "normal" | "reverse" | "alternate" | "alternate-reverse"
  easing?: "ease" | "ease-in" | "ease-in-out" | "ease-out" | string
  repeat?: true | number
  persist?: "forwards" | "backwards" | "both" | "none"
  keyframes?: { [key: string]: { [key: string]: any } }
}

export interface PrimitiveProps {
  $?: string | React.Element
  hidden?: BooleanOnly
  children?: React.ReactNode
  key?: React.Key
  className?: string
}

export interface BoxProps extends PrimitiveProps {
  top?: NumberOrString
  right?: NumberOrString
  bottom?: NumberOrString
  left?: NumberOrString
  width?: NumberOrString
  maxWidth?: NumberOrString
  minWidth?: NumberOrString
  height?: NumberOrString
  maxHeight?: NumberOrString
  minHeight?: NumberOrString

  padding?: NumberOrString
  paddingTop?: NumberOrString
  paddingRight?: NumberOrString
  paddingBottom?: NumberOrString
  paddingLeft?: NumberOrString
  paddingVertical?: NumberOrString
  paddingHorizontal?: NumberOrString
  margin?: NumberOrString
  marginTop?: NumberOrString
  marginRight?: NumberOrString
  marginBottom?: NumberOrString
  marginLeft?: NumberOrString

  position?: "relative" | "fixed" | "static" | "absolute"
  // overflow: "overflow",
  // overflowX: "overflowX",
  // overflowY: "overflowY",
  // zIndex: "zIndex",

  grow?: NumberOrBoolean
  shrink?: NumberOrBoolean
  basis?: NumberOrString

  fit?: BooleanOnly
  absoluteFill?: BooleanOnly

  onMouseEnter?: Function
  onMouseLeave?: Function
  onClick?: Function

  // pointerEvents?: PointerEventsProperty
  pointerEvents?: "none" | "auto" | "inherit" | "initial" | "unset"

  style?: StyleValue
  _style?: StyleValue

  animate?: AnimateValue
  _animate?: AnimateValue
}

export interface StackBaseProps extends BoxProps {
  wrap?: "flexWrap"
  grow?: NumberOrBoolean
  shrink?: NumberOrBoolean
  basis?: NumberOrString
  order?: number
  alignContent?:
    | "stretch"
    | "center"
    | "start"
    | "end"
    | "space-between"
    | "space-around"
    | "space-evenly"
    | "baseline"
    | "first baseline"
    | "last baseline"
  alignSelf?:
    | "stretch"
    | "center"
    | "start"
    | "end"
    | "baseline"
    | "first baseline"
    | "last baseline"
  align?: "stretch" | "center" | "start" | "end"
  justify?:
    | "stretch"
    | "space-between"
    | "space-around"
    | "space-evenly"
    | "center"
    | "start"
    | "end"
  center?: BooleanOnly
  inline?: BooleanOnly
}

export interface StackProps extends StackBaseProps {
  direction: "row" | "column" //todo convert to v|h|z
}

export interface SpaceProps extends Omit<PrimitiveProps, "children"> {
  size?: NumberOrString
  grow?: NumberOrBoolean
  shrink?: NumberOrBoolean
}

export interface TextProps extends PrimitiveProps {
  size?: NumberOrString
  align?: StringOnly //TODO: 'center' | 'justify'
  color?: StringOnly
  decoration?: StringOnly //TODO
  decorationColor?: StringOnly
  font?: StringOnly
  height?: NumberOrString
  spacing?: NumberOrString
  transform?: "uppercase" | "capitalize" | "lowercase"
  weight?:
    | 100
    | 200
    | 300
    | 400
    | 500
    | 600
    | 700
    | 800
    | 900
    | "bold"
    | "normal"
    | "bolder"
  bold?: BooleanOnly
  center?: BooleanOnly
  antialiased?: BooleanOnly
  italic?: BooleanOnly
  uppercase?: BooleanOnly
  html?: BooleanOnly

  selectable?: boolean | "all" | "auto" | "text" | "none"
  pointerEvents?: "none" | "auto" | "inherit" | "initial" | "unset"

  style?: StyleValue
  _style?: StyleValue

  animate?: AnimateValue
  _animate?: AnimateValue
}

// from https://github.com/microsoft/TypeScript/issues/15449#issuecomment-385959396
declare global {
  namespace JSX {
    interface IntrinsicElements {
      space: SpaceProps

      v: StackBaseProps
      h: StackBaseProps
      z: StackBaseProps
      stack: StackProps

      flex: StackProps
      row: StackBaseProps
      column: StackBaseProps

      box: BoxProps

      txt: TextProps
    }
  }
}

// fixes "All files must be modules when the '--isolatedModules' flag is provided.ts(1208)"
// export {}
