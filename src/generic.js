"use strict"

// var printAST = require('ast-pretty-print')
var t = require("@babel/types")
var Utils = require("./utils")
var renameTag = Utils.renameTag,
  BASE_PROPS_TO_OMIT = Utils.BASE_PROPS_TO_OMIT,
  tagPrefixRegex = Utils.tagPrefixRegex,
  addBooleanProperty = Utils.addBooleanProperty,
  addCssProperty = Utils.addCssProperty,
  buildClassNamePropFunction = Utils.buildClassNamePropFunction,
  buildStyleProp = Utils.buildStyleProp,
  handleAnimate = Utils.handleAnimate

/**
 * @typedef { import("@babel/types").JSXAttribute } JSXAttribute
 * @typedef { import("@babel/types").JSXElement } JSXElement
 * @typedef { import("@babel/types").ObjectExpression } ObjectExpression
 */

var propsToOmit = {
  ...BASE_PROPS_TO_OMIT,
}

var cssProps = {}

var booleanProps = {}

var defaultCss = {}

/**
 * @param {JSXElement} node
 */
module.exports = function (node) {
  /**
   * @param {JSXElement} node
   */
  function buildProps(node) {
    var staticStyle = Object.assign({}, defaultCss)
    var dynamicStyle = {}
    var inlineStyleBabelProperties = []
    var props = []

    let otherClassNames

    if (node.openingElement.attributes.length > 0) {
      node.openingElement.attributes.forEach((attribute) => {
        // Spread props not supported
        if (t.isJSXSpreadAttribute(attribute)) {
          return
        }
        var name = attribute.name.name

        if (name in propsToOmit) {
          return
        } else if (name === "style" || name === "_style") {
          attribute.value.expression.properties.forEach((property) => {
            addCssProperty(
              staticStyle,
              dynamicStyle,
              property.key.name,
              property.value,
              cssProps
            )
          })
        } else if (name === "inlineStyle" || name === "_inlineStyle") {
          inlineStyleBabelProperties.push(
            ...attribute.value.expression.properties
          )
        } else if (name === "animate" || name === "_animate") {
          handleAnimate(staticStyle, dynamicStyle, attribute)
        } else if (name in cssProps) {
          addCssProperty(
            staticStyle,
            dynamicStyle,
            cssProps[name],
            attribute.value
          )
        } else if (name in booleanProps) {
          addBooleanProperty(
            staticStyle,
            dynamicStyle,
            attribute,
            booleanProps[name],
            {
              true: t.numericLiteral(1),
              false: t.numericLiteral(0),
            },
            { allowNumber: true }
          )
        } else if (tagPrefixRegex.test(name)) {
          attribute.name.name = name.replace(tagPrefixRegex, "")
          props.push(attribute)
        } else if (name === "className") {
          if (t.isJSXExpressionContainer(attribute.value)) {
            otherClassNames = attribute.value.expression
          } else if (t.isStringLiteral(attribute.value)) {
            otherClassNames = attribute.value
          }

          // Note: skip adding to props
        } else {
          props.push(attribute)
        }
      })
    }

    var classNameProp = buildClassNamePropFunction(
      t,
      staticStyle,
      cssProps,
      otherClassNames
    )
    classNameProp.value.expression.loc = node.loc
    props.push(classNameProp)

    // Add inline styles prop if there are styles to add
    if (
      Object.keys(dynamicStyle).length > 0 ||
      inlineStyleBabelProperties.length > 0
    ) {
      var styleProp = buildStyleProp(
        t,
        dynamicStyle,
        inlineStyleBabelProperties
      )
      styleProp.value.expression.loc = node.loc
      props.push(styleProp)
    }

    return props
  }

  renameTag(node)
  node.openingElement.attributes = buildProps(node)
}
