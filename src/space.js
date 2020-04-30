"use strict"

// var printAST = require('ast-pretty-print')
var t = require("@babel/types")
var Utils = require("./utils")
var renameTag = Utils.renameTag,
  addBooleanProperty = Utils.addBooleanProperty,
  addCssProperty = Utils.addCssProperty,
  buildClassNamePropFunction = Utils.buildClassNamePropFunction

var propsToOmit = {
  as: true,
}

var cssProps = {
  size: "flexBasis",
  // grow: "flexGrow",
  // shrink: "flexShrink",
}

var booleanProps = {
  grow: {
    flexGrow: t.numericLiteral(1),
  },
  shrink: {
    flexShrink: t.numericLiteral(1),
  },
}

var defaultCss = {
  flexGrow: t.numericLiteral(0),
  flexShrink: t.numericLiteral(0),
}

module.exports = function (node) {
  function buildProps(node) {
    var cssProperties = Object.assign({}, defaultCss)

    var props = []

    if (node.openingElement.attributes != null) {
      node.openingElement.attributes.forEach((attribute) => {
        var name = attribute.name.name

        if (name in propsToOmit) {
          return
        } else if (name === "style") {
          attribute.value.expression.properties.forEach((property) => {
            addCssProperty(
              cssProperties,
              property.key.name,
              property.value,
              cssProps
            )
          })
        } else if (name in cssProps) {
          addCssProperty(
            cssProperties,
            cssProps[name],
            attribute.value,
            cssProps
          )
        } else if (name in booleanProps) {
          // console.log(`cssProperties: ${cssProperties}`)
          // console.log("attribute", attribute)
          // console.log("attribute.value.expression", attribute.value.expression)
          // console.log("booleanProperties", booleanProps[name])
          addBooleanProperty(cssProperties, attribute, booleanProps[name])
        } else {
          props.push(attribute)
        }
      })
    }

    var className = buildClassNamePropFunction(t, cssProperties, cssProps)

    //console.log(className)
    className.value.expression.loc = node.loc

    //var cssProperties = className.value.expression.arguments[0].properties

    props.push(className)

    return props
  }

  /*
  function addCssProp(cssTemplate, attribute, name) {
    var { value } = attribute

    if (t.isJSXExpressionContainer(value)) {
      var { expression } = value

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
