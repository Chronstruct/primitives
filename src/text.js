// const printAST = require('ast-pretty-print')
import {renameTag, addBooleanProperty, addCssProperty, addGrowProp, buildClassNameProp, buildClassNamePropFunction} from "./utils";
import * as t from 'babel-types'

const propsToOmit = {
  as: true,
}

const cssProps = {
  align: 'textAlign',
  color: 'color',
  decoration: 'textDecoration',
  decorationColor: 'textDecorationColor',
  font: 'fontFamily',
  height: 'lineHeight',
  size: 'fontSize',
  spacing: 'letterSpacing',
  transform: 'textTransform',
  weight: 'fontWeight',
  // ellipsis
  // underline

}

const booleanProps = {
  antialiased: {
      webkitFontSmoothing: t.stringLiteral('antialiased'),
      mozOsxFontSmoothing: t.stringLiteral('grayscale'),
    //consequent: '-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;',
    //alternate: '',
  },
  italic: {
      fontStyle: t.stringLiteral('italic'),
    //consequent: 'font-style: italic;',
    //alternate: '',
  },
  center: {
      textAlign: t.stringLiteral('center'),
    //consequent: 'text-align: center;',
    //alternate: '',
  },
  bold: {
      fontWeight: t.stringLiteral('bold'),
    //consequent: 'font-weight: bold;',
    //alternate: '',
  },
  uppercase: {
      textTransform: t.stringLiteral('uppercase'),
    //consequent: 'text-transform: uppercase;',
    //alternate: '',
  },
}

// from https://bitsofco.de/the-new-system-font-stack/
//const defaultCss = 'font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen-Sans,Ubuntu,Cantarell,Helvetica Neue,sans-serif;'
const defaultCss = {
    'fontFamily': t.stringLiteral('-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen-Sans,Ubuntu,Cantarell,Helvetica Neue,sans-serif'),
}

export default function (node) {
  function buildProps(node, defaultCss) {
      const cssProperties = {...defaultCss}

      const props = []

      // const css = buildDefaultCssProp(t, defaultCss)
      //const className = buildClassNameProp(t, defaultCss)
      //className.value.expression.loc = node.loc
      //const cssTemplate = className.value.expression.quasi
      //const props = [className]

    if (node.openingElement.attributes != null) {
        node.openingElement.attributes.forEach(attribute => {
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
                addCssProperty(cssProperties, cssProps[name], attribute.value)
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

      if (t.isNumericLiteral(expression)) {
        addStringToTemplate(cssTemplate, `${name}: ${expression.extra.raw};`)
      }
      else if (t.isStringLiteral(expression)) {
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
      else if (t.isBinaryExpression(expression)) {
        addStringToTemplate(cssTemplate, `${name}: `)
        addExpressionToTemplate(cssTemplate, expression)
        addQuasiToTemplate(cssTemplate, t.templateElement({raw: ';', cooked: ';'}))
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
  */

  renameTag(node, 'span')
  node.openingElement.attributes = buildProps(node, defaultCss)
}
