const printAST = require('ast-pretty-print')
import {buildClassNameProp, buildClassNamePropFunction} from "./utils";
import * as t from 'babel-types'

const {
  addTemplateToTemplate,
  addStringToTemplate,
  addQuasiToTemplate,
  addExpressionToTemplate,
  buildDefaultCssProp,
  renameTag,
} = require('./utils')

const propsToOmit = {
  as: true,
}

const propsToUse = {
  top: 'top',
  right: 'right',
  bottom: 'bottom',
  left: 'left',
  width: 'width',
  maxWidth: 'max-width',
  minWidth: 'min-width',
  height: 'height',
  maxHeight: 'max-height',
  minHeight: 'min-height',

  flex: 'flex',
  wrap: 'flex-wrap',
  // grow: 'flex-grow',
  shrink: 'flex-shrink',
  basis: 'flex-basis',
  order: 'order',
  alignContent: 'align-content',
  alignSelf: 'align-self',
  align: 'align-items',
  justify: 'justify-content',
  // alignVertical
  // alignHorizontal

  padding: 'padding',
  paddingTop: 'padding-top',
  paddingRight: 'padding-right',
  paddingBottom: 'padding-bottom',
  paddingLeft: 'padding-left',
  margin: 'margin',
  marginTop: 'margin-top',
  marginRight: 'margin-right',
  marginBottom: 'margin-bottom',
  marginLeft: 'margin-left',

  position: 'position',
  overflow: 'overflow',
  overflowX: 'overflow-x',
  overflowY: 'overflow-y',
  //WebkitOverflowScrolling
  zIndex: 'z-index',
}

const flexPropsToUse = {
  ...propsToUse,
  direction: 'flex-direction',
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
                    addCssProperty(cssProperties, property.key.name, property.value)
                })
            }
            else if (name === 'inlineStyle') {
                attribute.name.name = 'style'
                props.push(attribute)
            }
            else if (name in cssProps) {
                addCssProperty(cssProperties, name, attribute.value)
            }
            else if (name in booleanProps) {
                addBooleanProperty(cssProperties, attribute, booleanProps[name])
            }
            //else if (name === 'grow') {
            //addGrowProp(cssTemplate, attribute)
            //}
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

    function addCssProperty(cssProperties, key, propValue) {
        let value = propValue

        if (t.isJSXExpressionContainer(propValue)) {
            value = propValue.expression
        }

        //properties.push(t.objectProperty(t.identifier(key), value))
        cssProperties[key] = value
    }

    function addCssProperties(cssProperties, propertiesToAdd) {
        Object.keys(propertiesToAdd).forEach(key => {
            addCssProperty(cssProperties, key, propertiesToAdd[key])
        })
    }

    function addBooleanProperty(cssProperties, attribute, booleanProperties) {
        const { value } = attribute

        if (value === null) {
            addCssProperties(cssProperties, booleanProperties)
        }
        else if (t.isJSXExpressionContainer(value)) {
            const { expression } = value

            if (t.isBooleanLiteral(expression) && expression.value === true) {
                addCssProperties(cssProperties, booleanProperties)
            }
            /*
            else if (t.isIdentifier(expression)) {
                addExpressionToTemplate(cssTemplate, t.conditionalExpression(
                    t.binaryExpression(
                        '===',
                        t.identifier(expression.name),
                        t.booleanLiteral(true),
                    ),
                    t.stringLiteral(consequent),
                    t.stringLiteral(alternate),
                ))

                addQuasiToTemplate(cssTemplate, t.templateElement({raw: '', cooked: ''}))
            }
            */
        }
    }

  function addBooleanProp(cssTemplate, attribute, name, {consequent, alternate}) {
    const { value } = attribute

    if (value === null) {
      addStringToTemplate(cssTemplate, consequent)
    }
    else if (t.isJSXExpressionContainer(value)) {
      const { expression } = value

      if (t.isBooleanLiteral(expression) && expression.value === true) {
        addStringToTemplate(cssTemplate, consequent)
      }
      else if (t.isIdentifier(expression)) {
        addExpressionToTemplate(cssTemplate, t.conditionalExpression(
          t.binaryExpression(
            '===',
            t.identifier(expression.name),
            t.booleanLiteral(true),
          ),
          t.stringLiteral(consequent),
          t.stringLiteral(alternate),
        ))

        addQuasiToTemplate(cssTemplate, t.templateElement({raw: '', cooked: ''}))
      }
    }
  }

  function addGrowProp(cssTemplate, attribute) {
    const { value } = attribute

    if (value === null) {
      addStringToTemplate(cssTemplate, 'flex-grow: 1;')
    }
    else if (t.isJSXExpressionContainer(value)) {
      const { expression } = value

      if (t.isNumericLiteral(expression)) {
        addStringToTemplate(cssTemplate, `flex-grow: ${expression.extra.raw};`)
      }
      else if (t.isStringLiteral(expression)) {
        addStringToTemplate(cssTemplate, `flex-grow: ${expression.value};`)
      }
      else if (t.isIdentifier(expression)) {
        addStringToTemplate(cssTemplate, `flex-grow: `)
        addQuasiToTemplate(cssTemplate, t.templateElement({raw: ';', cooked: ';'}))
        addExpressionToTemplate(cssTemplate, t.identifier(expression.name))
      }
    }
    else if (t.isStringLiteral(value)) {
      addStringToTemplate(cssTemplate, `flex-grow: ${value.value};`)
    }
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
}
