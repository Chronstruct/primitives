// const printAST = require('ast-pretty-print')
import {renameTag, addBooleanProperty, addCssProperty, addGrowProp, buildClassNameProp, buildClassNamePropFunction} from "./utils";
import * as t from 'babel-types'

const propsToOmit = {
  as: true,
}

const cssProps = {
  size: 'flexBasis',
}

const defaultCss = {flexGrow: t.numericLiteral(0), flexShrink: t.numericLiteral(0)}

export default function (node) {
  function buildProps(node) {
      const cssProperties = {...defaultCss}

      const props = []

    if (node.openingElement.attributes != null) {
        node.openingElement.attributes.forEach(attribute => {
            const name = attribute.name.name

            if (name in propsToOmit) {
                return
            }
            else if (name === 'style') {
                attribute.value.expression.properties.forEach(property => {
                    addCssProperty(cssProperties, property.key.name, property.value, cssProps)
                })
            }
            else if (name in cssProps) {
                addCssProperty(cssProperties, cssProps[name], attribute.value, cssProps)
            }
            else {
                props.push(attribute)
            }
        })
    }

      const className = buildClassNamePropFunction(t, cssProperties, cssProps)

      //console.log(className)
      className.value.expression.loc = node.loc

      //const cssProperties = className.value.expression.arguments[0].properties

      props.push(className)

      return props
  }

  /*
  function addCssProp(cssTemplate, attribute, name) {
    const { value } = attribute

    if (t.isJSXExpressionContainer(value)) {
      const { expression } = value

      // console.log(printAST(expression));

      if (t.isStringLiteral(expression)) {
        addStringToTemplate(cssTemplate, `${name}: ${expression.value};`)
      }
      else if (t.isIdentifier(expression)) {
        addStringToTemplate(cssTemplate, `${name}: `)
        addQuasiToTemplate(cssTemplate, t.templateElement({raw: ';', cooked: ';'}))
        addExpressionToTemplate(cssTemplate, t.identifier(expression.name))
      }
      else if (t.isTemplateLiteral(expression)) {
        expression.quasis[0].value.cooked = `${name}: ${expression.quasis[0].value.cooked}`
        expression.quasis[0].value.raw = `${name}: ${expression.quasis[0].value.raw}`
        addTemplateToTemplate(cssTemplate, expression)
        addStringToTemplate(cssTemplate, `;`)
      }
      else if (t.isConditionalExpression(expression)) {
        addStringToTemplate(cssTemplate, `${name}: `)
        addExpressionToTemplate(cssTemplate, expression)
        addQuasiToTemplate(cssTemplate, t.templateElement({raw: ';', cooked: ';'}))
      }

    }
    else if (t.isStringLiteral(value)) {
      addStringToTemplate(cssTemplate, `${name}: ${value.value};`)
    }
  }
  */

  renameTag(node)
  node.openingElement.attributes = buildProps(node)
}
