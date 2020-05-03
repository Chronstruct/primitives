"use strict"

// var printAST = require('ast-pretty-print')
var t = require("@babel/types")
var Utils = require("./utils")
var renameTag = Utils.renameTag,
  addBooleanPropertySet = Utils.addBooleanPropertySet,
  addCssProperty = Utils.addCssProperty,
  addBooleanProperty = Utils.addBooleanProperty,
  buildClassNamePropFunction = Utils.buildClassNamePropFunction,
  buildStyleProp = Utils.buildStyleProp

var propsToOmit = {
  as: true,
}

var cssPropertyMap = {
  align: "textAlign",
  color: "color",
  decoration: "textDecoration",
  decorationColor: "textDecorationColor",
  font: "fontFamily",
  height: "lineHeight",
  size: "fontSize",
  spacing: "letterSpacing",
  transform: "textTransform",
  weight: "fontWeight",
  // ellipsis
  // underline
}

var booleanProps = {
  antialiased: {
    webkitFontSmoothing: t.stringLiteral("antialiased"),
    mozOsxFontSmoothing: t.stringLiteral("grayscale"),
    //consequent: '-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;',
    //alternate: '',
  },
  italic: {
    fontStyle: t.stringLiteral("italic"),
    //consequent: 'font-style: italic;',
    //alternate: '',
  },
  center: {
    textAlign: t.stringLiteral("center"),
    //consequent: 'text-align: center;',
    //alternate: '',
  },
  bold: {
    fontWeight: t.stringLiteral("bold"),
    //consequent: 'font-weight: bold;',
    //alternate: '',
  },
  uppercase: {
    textTransform: t.stringLiteral("uppercase"),
    //consequent: 'text-transform: uppercase;',
    //alternate: '',
  },
}

// from https://bitsofco.de/the-new-system-font-stack/
//var defaultCss = 'font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen-Sans,Ubuntu,Cantarell,Helvetica Neue,sans-serif;'
var defaultCss = {
  fontFamily: t.stringLiteral(
    "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen-Sans,Ubuntu,Cantarell,Helvetica Neue,sans-serif"
  ),
}

module.exports = function (node) {
  function buildProps(node, defaultCss) {
    var cssProperties = Object.assign({}, defaultCss)
    var inlineStyleObject = {}
    var inlineStyleBabelProperties = []
    var props = []

    // var css = buildDefaultCssProp(t, defaultCss)
    //var className = buildClassNameProp(t, defaultCss)
    //className.value.expression.loc = node.loc
    //var cssTemplate = className.value.expression.quasi
    //var props = [className]

    if (node.openingElement.attributes != null) {
      node.openingElement.attributes.forEach((attribute) => {
        var name = attribute.name.name

        if (name in propsToOmit) {
          return
        }
        else if (name === "style") {
          attribute.value.expression.properties.forEach((property) => {
            addCssProperty(cssProperties, property.key.name, property.value)
          })
        }
        else if (name === "inlineStyle") {
          inlineStyleBabelProperties.push(
            ...attribute.value.expression.properties
          )
        }
        else if (name in cssPropertyMap) {
          addCssProperty(cssProperties, cssPropertyMap[name], attribute.value)
        }
        else if (name in booleanProps) {
          addBooleanPropertySet(cssProperties, attribute, booleanProps[name])
        }
        else if (name === "grow") {
          addBooleanProperty(
            cssProperties,
            inlineStyleObject,
            attribute,
            "flexGrow",
            {
              true: t.numericLiteral(1),
              false: t.numericLiteral(0),
            }
          )
        }
        else {
          props.push(attribute)
        }
      })
    }

    var classNameProp = buildClassNamePropFunction(
      t,
      cssProperties,
      cssPropertyMap
    )
    classNameProp.value.expression.loc = node.loc
    props.push(classNameProp)

    // Add inline styles prop if there are styles to add
    if (
      Object.keys(inlineStyleObject).length > 0 ||
      inlineStyleBabelProperties.length > 0
    ) {
      var styleProp = buildStyleProp(
        t,
        inlineStyleObject,
        inlineStyleBabelProperties
      )
      styleProp.value.expression.loc = node.loc
      props.push(styleProp)
    }

    return props
  }

  /*
  function addCssProp(cssTemplate, attribute, name) {
    var { value } = attribute

    if (t.isJSXExpressionContainer(value)) {
      var { expression } = value

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
    var { value } = attribute

    if (value === null) {
      addStringToTemplate(cssTemplate, consequent)
    }
    else if (t.isJSXExpressionContainer(value)) {
      var { expression } = value

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

  function addBooleanProperty(cssTemplate, attribute) {
    var { value } = attribute

    if (value === null) {
      addStringToTemplate(cssTemplate, 'flex-grow: 1;')
    }
    else if (t.isJSXExpressionContainer(value)) {
      var { expression } = value

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

  renameTag(node, "span")
  node.openingElement.attributes = buildProps(node, defaultCss)
}
