const printAST = require('ast-pretty-print')
import {renameTag, addBooleanProperty, addCssProperty, addGrowProp, buildClassNameProp, buildClassNamePropFunction} from "./utils";
import * as t from 'babel-types'

const propsToOmit = {
  as: true,
}

const propsToUse = {
  top: 'top',
  right: 'right',
  bottom: 'bottom',
  left: 'left',
  width: 'width',
  maxWidth: 'maxWidth',
  minWidth: 'minWidth',
  height: 'height',
  maxHeight: 'maxHeight',
  minHeight: 'minHeight',

  flex: 'flex',
  wrap: 'flexWrap',
  // grow: 'flex-grow',
  shrink: 'flexShrink',
  basis: 'flexBasis',
  order: 'order',
  alignContent: 'alignContent',
  alignSelf: 'alignSelf',
  align: 'alignItems',
  justify: 'justifyContent',
  // alignVertical
  // alignHorizontal

  padding: 'padding',
  paddingTop: 'paddingTop',
  paddingRight: 'paddingRight',
  paddingBottom: 'paddingBottom',
  paddingLeft: 'paddingLeft',
  margin: 'margin',
  marginTop: 'marginTop',
  marginRight: 'marginRight',
  marginBottom: 'marginBottom',
  marginLeft: 'marginLeft',

  position: 'position',
  overflow: 'overflow',
  overflowX: 'overflowX',
  overflowY: 'overflowY',
  //WebkitOverflowScrolling
  zIndex: 'zIndex',
}

const flexPropsToUse = {
  ...propsToUse,
  direction: 'flexDirection',
}

const booleanProps = {
  center: {
      alignItems: t.stringLiteral('center'),
      justifyContent: t.stringLiteral('center'),
    //consequent: 'align-items: center;justify-content: center;',
    //alternate: '',
  },
  hidden: {
      display: t.stringLiteral('none'),
    //consequent: 'display: none;',
    //alternate: '',
  },
  inline: {
      display: t.stringLiteral('inline-flex'),
    //consequent: 'display: inline-flex;',
    //alternate: '',
  },
  fit: {
      height: t.stringLiteral('100%'),
      width: t.stringLiteral('100%'),
    //consequent: 'height: 100%;width: 100%;',
    //alternate: '',
  },
  absoluteFill: {
      position: t.stringLiteral('absolute'),
      top: t.numericLiteral(0),
      right: t.numericLiteral(0),
      bottom: t.numericLiteral(0),
      left: t.numericLiteral(0),
    //consequent: 'position: absolute;top: 0;right: 0;bottom: 0;left: 0;',
    //alternate: '',
  },
}

const defaultFlexCss = 'display: flex;flex-shrink: 0;align-content: flex-start;position: relative;'
const defaultColCss = 'display: flex;flex-direction: column;flex-shrink: 0;align-content: flex-start;position: relative;'
const defaultRowCss = 'display: flex;flex-direction: row;flex-shrink: 0;align-content: flex-start;position: relative;'

/*
const defaultFlex = t.objectExpression(
    [
        t.objectProperty(t.identifier('display'), t.stringLiteral('flex')),
        t.objectProperty(t.identifier('alignContent'), t.stringLiteral('flexStart')),
        t.objectProperty(t.identifier('position'), t.stringLiteral('relative')),
        t.objectProperty(t.identifier('flexShrink'), t.numericLiteral(0)),
    ]
)

const defaultCol = t.objectExpression(
    [
        t.objectProperty(t.identifier('display'), t.stringLiteral('flex')),
        t.objectProperty(t.identifier('flexDirection'), t.stringLiteral('column')),
        t.objectProperty(t.identifier('alignContent'), t.stringLiteral('flexStart')),
        t.objectProperty(t.identifier('position'), t.stringLiteral('relative')),
        t.objectProperty(t.identifier('flexShrink'), t.numericLiteral(0)),
    ]
)

const defaultRow = t.objectExpression(
    [
        t.objectProperty(t.identifier('display'), t.stringLiteral('flex')),
        t.objectProperty(t.identifier('flexDirection'), t.stringLiteral('row')),
        t.objectProperty(t.identifier('alignContent'), t.stringLiteral('flexStart')),
        t.objectProperty(t.identifier('position'), t.stringLiteral('relative')),
        t.objectProperty(t.identifier('flexShrink'), t.numericLiteral(0)),
    ]
)
*/

const defaultFlex = {
    'display': t.stringLiteral('flex'),
    'alignContent': t.stringLiteral('flex-start'),
    'position': t.stringLiteral('relative'),
    'flexShrink': t.numericLiteral(0),
}

const defaultCol = {
    'display': t.stringLiteral('flex'),
    'flexDirection': t.stringLiteral('column'),
    'alignContent': t.stringLiteral('flex-start'),
    'position': t.stringLiteral('relative'),
    'flexShrink': t.numericLiteral(0),
}

const defaultRow = {
    'display': t.stringLiteral('flex'),
    'flexDirection': t.stringLiteral('row'),
    'alignContent': t.stringLiteral('flex-start'),
    'position': t.stringLiteral('relative'),
    'flexShrink': t.numericLiteral(0),
}

export default function (node, tagName) {
  function buildProps(node, defaultCss, cssProps) {
    // const css = buildDefaultCssProp(t, defaultCss)
      const cssProperties = {...defaultCss}

      const props = []

      //const className = buildClassNamePropFunction(t, cssProperties)
      //className.value.expression.loc = node.loc

    //const cssProperties = className.value.expression.arguments[0].properties

    //const props = [className]

    if (node.openingElement.attributes != null) {
        node.openingElement.attributes.forEach(attribute => {
            if (!attribute.name) {
                return
            }

            const name = attribute.name.name

            if (name in propsToOmit) {
                return
            }
            else if (name === 'style') {
                attribute.value.expression.properties.forEach(property => {
                    addCssProperty(cssProperties, property.key.name, property.value, cssProps)
                })
            }
            else if (name === 'inlineStyle') {
                attribute.name.name = 'style'
                props.push(attribute)
            }
            else if (name in cssProps) {
                addCssProperty(cssProperties, cssProps[name], attribute.value, cssProps)
            }
            else if (name in booleanProps) {
                addBooleanProperty(cssProperties, attribute, booleanProps[name])
            }
            else if (name === 'grow') {
                addGrowProp(cssProperties, attribute)
            }
            else {
                props.push(attribute)
            }
        })
    }

      //console.log(cssProperties)

      const className = buildClassNamePropFunction(t, cssProperties)

      //console.log(className)
      className.value.expression.loc = node.loc

      //const cssProperties = className.value.expression.arguments[0].properties

      props.push(className)

    return props
  }


  if (tagName === 'view') {
    renameTag(node)
    node.openingElement.attributes = buildProps(node, defaultCol, propsToUse)
  }
  else if (tagName === 'col') {
    renameTag(node)
    node.openingElement.attributes = buildProps(node, defaultCol, propsToUse)
  }
  else if (tagName === 'row') {
    renameTag(node)
    node.openingElement.attributes = buildProps(node, defaultRow, propsToUse)
  }
  else if (tagName === 'flex') {
    renameTag(node)
    node.openingElement.attributes = buildProps(node, defaultFlex, flexPropsToUse)
  }
  else if (tagName === 'box') {
      renameTag(node)
      node.openingElement.attributes = buildProps(node, defaultFlex, flexPropsToUse)
  }
}
