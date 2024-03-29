"use strict"

var printAST = require("ast-pretty-print")
var t = require("@babel/types")
var objectStylesToTemplate = require("./objectStylesToTemplate")

// from https://stackoverflow.com/questions/43224835
const allCapsRegex = /^[A-Z]+(?:_[A-Z]+)*$/
const tagPrefixRegex = /^\$-/

const BASE_PROPS_TO_OMIT = {
  $: true,
}

/**
 * @typedef { import("@babel/types").JSXAttribute } JSXAttribute
 * @typedef { import("@babel/types").JSXElement } JSXElement
 * @typedef { import("@babel/types").ObjectExpression } ObjectExpression
 */

function buildDefaultCssProp(t, css) {
  return t.jSXAttribute(
    t.jSXIdentifier("css"),
    t.jSXExpressionContainer(
      t.templateLiteral(
        [
          t.templateElement({
            raw: css,
            cooked: css,
          }),
        ],
        []
      )
    )
  )
}

/*
export function buildClassNamePropFunction(t, cssObject) {
    return t.jSXAttribute(
        t.jSXIdentifier('className'),
        t.jSXExpressionContainer(
            t.callExpression(
                t.identifier('css'),
                [
                    cssObject
                ]
            )
        )
    )
}

*/
/**
 * @param {babel.types} t
 * @param {Object} cssObject
 * @param {Object} keyAliases
 * @param {any} otherClassName
 * @return {any} className prop with styles
 */
function buildClassNamePropFunction(t, cssObject, keyAliases, otherClassName) {
  var objectProperties = Object.keys(cssObject).map((key) => {
    var value = cssObject[key]

    if (!isNaN(key)) {
      key = `@media screen and (min-width: ${key}px)`
    } else if (key in keyAliases) {
      key = keyAliases[key]
    }

    return t.objectProperty(t.identifier(key), value)
  })

  if (objectProperties.length === 0) {
    return undefined
  }

  const cssLiteral = objectStylesToTemplate(objectProperties)

  // Combine passed in className and cssLiteral
  if (otherClassName != null) {
    const quasis = []
    const expressions = []
    let text = ""

    const finalize = (expr, str) => {
      quasis.push(t.templateElement({ raw: text }))
      expressions.push(expr)
      text = str
    }

    if (t.isStringLiteral(otherClassName)) {
      text += `${otherClassName.value} `
    } else if (t.isExpression(otherClassName)) {
      finalize(otherClassName, " ")
    }

    finalize(cssLiteral, "")

    quasis.push(t.templateElement({ raw: `${text}` }))

    return t.jSXAttribute(
      t.jSXIdentifier("className"),
      t.jSXExpressionContainer(t.templateLiteral(quasis, expressions))
    )
  }

  // No user-passed in className, so
  return t.jSXAttribute(
    t.jSXIdentifier("className"),
    t.jSXExpressionContainer(cssLiteral)
  )
}

function buildClassNameProp(t, css) {
  return t.jSXAttribute(
    t.jSXIdentifier("className"),
    t.jSXExpressionContainer(
      t.taggedTemplateExpression(
        t.identifier("css"),
        t.templateLiteral(
          [
            t.templateElement({
              raw: css,
              cooked: css,
            }),
          ],
          []
        )
      )
    )
  )
}

function buildStyleProp(t, styleObject, styleBabelProperties) {
  var objectProperties = Object.keys(styleObject).map((key) => {
    return t.objectProperty(t.identifier(key), styleObject[key])
  })

  return t.jSXAttribute(
    t.jSXIdentifier("style"),
    t.jSXExpressionContainer(
      t.objectExpression([...objectProperties, ...styleBabelProperties])
    )
  )
}

function addTemplateToTemplate(target, template) {
  if (template.expressions.length > 0) {
    if (target.expressions.length === target.quasis.length) {
      // safe to just push these
      target.expressions = target.expressions.concat(
        template.expressions.slice(0)
      )
      target.quasis = target.quasis.concat(template.quasis.slice(0))
    } else {
      target.expressions = target.expressions.concat(
        template.expressions.slice(0)
      )

      // concate the first quasi, then push on the rest
      addStringToTemplate(target, template.quasis[0].value.raw)
      target.quasis = target.quasis.concat(template.quasis.slice(1))
    }
  } else {
    addStringToTemplate(target, template.quasis[0].value.raw)
  }
}

function addStringToTemplate(template, str) {
  var last = template.quasis.length - 1

  template.quasis[last].value.raw = template.quasis[last].value.raw + str
  template.quasis[last].value.cooked = template.quasis[last].value.cooked + str
}

function addQuasiToTemplate(template, quasi) {
  template.quasis.push(quasi)
}

function addExpressionToTemplate(template, expression) {
  template.expressions.push(expression)
}

/**
 * @param {JSXElement} node
 * @param {string} defaultTag
 */
function renameTag(node, defaultTag = "div") {
  let tagName = defaultTag

  // Get the prop responsible for the tag
  const tagProp = node.openingElement.attributes
    .filter(t.isJSXAttribute)
    .find((prop) => {
      return prop.name.name === "$"
    })

  // Use the value of the prop...
  if (tagProp !== undefined) {
    const { value: tagValue } = tagProp

    if (t.isStringLiteral(tagValue)) {
      tagName = tagValue.value
    } else if (t.isJSXExpressionContainer(tagValue)) {
      if (t.isStringLiteral(tagValue.expression)) {
        tagName = tagValue.expression.value
      } else if (t.isIdentifier(tagValue.expression)) {
        // TODO return React.createElement() to handle case where identifier is lowercase
        // @see https://github.com/Chronstruct/primitives/issues/64
        tagName = tagValue.expression.name
      }
    }
  }

  // ...to overwrite the original element tags
  node.openingElement.name.name = tagName

  if (node.closingElement) {
    node.closingElement.name.name = tagName
  }
}

/**
 * @param {ObjectExpression} objectExpression
 * @param {Object} cssObject
 * @param {string} cssKey
 * @param {Object}
 * @return {void}
 */
function addObjectValueToCSS(objectExpression, cssObject, cssKey, valueMap) {
  objectExpression.properties.forEach((property) => {
    // Some values should be mapped to other values, like true => 1 for flex-grow/shrink
    const value =
      valueMap != null && property.value.value in valueMap
        ? valueMap[property.value.value]
        : property.value

    const key = t.isIdentifier(property.key)
      ? property.key.name
      : property.key.value

    // key is a variable. e.g. {[someVarKey]: value}
    if (property.computed) {
      // When key is a `var`, convert it to what Linaria will use: `${varName}`.
      // I'd rather use the variable to let objectStylesToTemplate() handle [varName] as the key, but I don't know how.
      const varSafeKey = `\${${property.key.name}}`

      // IS already in staticStyle
      if (varSafeKey in cssObject) {
        // e.g. [HOVER]: { already: added; color: red; }
        cssObject[varSafeKey].properties.push(
          t.objectProperty(t.identifier(cssKey), value)
        )
      }
      // ISN'T already in staticStyle
      else {
        // e.g. [HOVER]: { color: red; }
        cssObject[varSafeKey] = t.objectExpression([
          t.objectProperty(t.identifier(cssKey), value),
        ])
      }
    }
    // key is a literal (or identifier that should be interpretted as a literal)
    else {
      // default case
      if (key === "" || key === "_") {
        // e.g. color: red;
        cssObject[cssKey] = value
      }
      // IS already in staticStyle
      else if (key in cssObject) {
        // e.g. hover: { already: added; color: red; }
        cssObject[key].properties.push(
          t.objectProperty(t.identifier(cssKey), value)
        )
      }
      // ISN'T already in staticStyle
      else {
        // e.g. hover: { color: red; }
        cssObject[key] = t.objectExpression([
          t.objectProperty(t.identifier(cssKey), value),
        ])
      }
    }
  })
}

/**
 * @param {Object} staticStyle
 * @param {Object} dynamicStyle
 * @param {string} key
 * @param {any} propValue
 * @return {any} className prop with styles
 */
function addCssProperty(staticStyle, dynamicStyle, key, propValue, valueMap) {
  //   console.log("staticStyle", staticStyle)
  //   console.log("key", key)
  //   console.log("propValue", propValue)

  if (t.isJSXExpressionContainer(propValue)) {
    addCssProperty(
      staticStyle,
      dynamicStyle,
      key,
      propValue.expression,
      valueMap
    )
  }
  // e.g. grow={{_: true, hover: false}}
  else if (t.isObjectExpression(propValue)) {
    addObjectValueToCSS(propValue, staticStyle, key, valueMap)
  }
  // e.g. grow={someVar}
  else if (t.isIdentifier(propValue)) {
    // By convention, CONSTANT_VARS will be evaluated for static extraction
    if (allCapsRegex.test(propValue.name)) {
      staticStyle[key] = propValue
    }
    // All other vars will be added to dynamic styles
    else {
      dynamicStyle[key] = propValue
    }
  }
  // e.g. grow={isTrue ? true : false}
  else if (t.isConditionalExpression(propValue)) {
    const { test, consequent, alternate } = propValue

    if (t.isIdentifier(test) && allCapsRegex.test(test.name)) {
      const identifiers = []

      if (t.isIdentifier(consequent)) {
        identifiers.push(consequent)
      }

      if (t.isIdentifier(alternate)) {
        identifiers.push(alternate)
      }

      if (
        identifiers.every((expression) => allCapsRegex.test(expression.name))
      ) {
        staticStyle[key] = propValue
      } else {
        dynamicStyle[key] = propValue
      }
    } else {
      dynamicStyle[key] = propValue
    }
  }
  // e.g. grow={isTrue && true}
  else if (t.isLogicalExpression(propValue)) {
    const { left, right } = propValue
    const identifiers = []

    if (t.isIdentifier(left)) {
      identifiers.push(left)
    }

    if (t.isIdentifier(right)) {
      identifiers.push(right)
    }

    if (identifiers.every((expression) => allCapsRegex.test(expression.name))) {
      staticStyle[key] = propValue
    } else {
      dynamicStyle[key] = propValue
    }
  }
  // e.g. grow={`${someVar}`}
  else if (t.isTemplateLiteral(propValue)) {
    // e.g. height={`${HEIGHT_CONST}px`}
    if (
      propValue.expressions.every((expression) =>
        allCapsRegex.test(expression.name)
      )
    ) {
      staticStyle[key] = propValue
    } else {
      dynamicStyle[key] = propValue
    }
  }
  // e.g. grow={this.props.grow}
  else if (t.isMemberExpression(propValue)) {
    dynamicStyle[key] = propValue
  } else {
    staticStyle[key] = propValue
  }
}

/**
 * @param {Object} staticStyle
 * @param {Object} dynamicStyle
 * @param {Object} propertiesToAdd
 * @return {any} className prop with styles
 */
function addCssProperties(staticStyle, dynamicStyle, propertiesToAdd) {
  Object.keys(propertiesToAdd).forEach((key) => {
    addCssProperty(staticStyle, dynamicStyle, key, propertiesToAdd[key])
  })
}

/**
 * @param {Object} staticStyle
 * @param {Object} dynamicStyle
 * @param {Types.JSXAttribute} jsxAttribute
 * @param {Object} propertiesToAdd
 * @return {any} className prop with styles
 */
function addBooleanPropertySet(
  staticStyle,
  dynamicStyle,
  jsxAttribute,
  propertiesToAdd
) {
  var { value } = jsxAttribute
  //   console.log("attribute", attribute)

  if (isShorthandBooleanProp(jsxAttribute)) {
    addCssProperties(staticStyle, dynamicStyle, propertiesToAdd)
  } else if (t.isJSXExpressionContainer(value)) {
    var { expression } = value

    if (t.isBooleanLiteral(expression) && expression.value === true) {
      addCssProperties(staticStyle, dynamicStyle, propertiesToAdd)
    }
  }
}

// const defaultAddBooleanPropertyConfig = {
//   allowString: false,
//   allowNumber: false,
// }
/**
 * @param {Object} staticStyle
 * @param {Object} dynamicStyle
 * @param {JSXAttribute} jsxAttribute
 * @param {string} key - key to apply to staticStyle
 * @param {{true: any, false: any}} valueMap - used to convert from boolean values
 * @param {{allowString: boolean, allowNumber: boolean}} config - which non-boolean values are allowed
 * @return {void}
 */
function addBooleanProperty(
  staticStyle,
  dynamicStyle,
  jsxAttribute,
  key,
  valueMap,
  config
) {
  var { value } = jsxAttribute

  // e.g. grow="1" (NOT SUPPORTED by default)
  if (isStringProp(jsxAttribute) && !(config && config.allowString)) {
    return
  } else if (isShorthandBooleanProp(jsxAttribute)) {
    addCssProperty(staticStyle, dynamicStyle, key, valueMap[true])
  } else if (isExpressionProp(jsxAttribute)) {
    var { expression } = value

    // console.log(expression)

    // e.g. grow={1} (NOT SUPPORTED by default)
    if (t.isNumericLiteral(expression) && !(config && config.allowNumber)) {
      return
    }
    // e.g. grow={"1"} (NOT SUPPORTED by default)
    else if (t.isStringLiteral(expression) && !(config && config.allowString)) {
      return
    }
    // e.g. grow={true}
    else if (t.isBooleanLiteral(expression)) {
      addCssProperty(staticStyle, dynamicStyle, key, valueMap[expression.value])
    }
    // e.g. grow={{'': true, 'hover': false}}
    else if (t.isObjectExpression(expression)) {
      addCssProperty(staticStyle, dynamicStyle, key, expression, valueMap)
    } else {
      addCssProperty(
        staticStyle,
        dynamicStyle,
        key,
        expression in valueMap ? valueMap[expression] : expression
      )
    }
  } else {
    addCssProperty(
      staticStyle,
      dynamicStyle,
      key,
      value in valueMap ? valueMap[value] : value
    )
  }
}

/**
 * e.g. bold
 * @param {JSXAttribute} jsxAttribute
 * @return {boolean}
 */
function isShorthandBooleanProp(jsxAttribute) {
  return jsxAttribute.value === null
}

/**
 * e.g. bold={_}
 * @param {JSXAttribute} jsxAttribute
 * @return {boolean}
 */
function isExpressionProp(jsxAttribute) {
  return t.isJSXExpressionContainer(jsxAttribute.value)
}

/**
 * e.g. bold="_"
 * @param {JSXAttribute} jsxAttribute
 * @return {boolean}
 */
function isStringProp(jsxAttribute) {
  return t.isStringLiteral(jsxAttribute.value)
}

/* ---------- ANIMATE ----------- */

const animatePropMap = {
  duration: "animationDuration",
  delay: "animationDelay",
  direction: "animationDirection",
  easing: "animationTimingFunction",
  persist: "animationFillMode",
  // repeat: "animationIterationCount",
}

let keyframeIdCounter = 0

/**
 * @param {Object} staticStyle
 * @param {Object} dynamicStyle
 * @param {Types.JSXAttribute} jsxAttribute
 * @return {any} className prop with styles
 */
function handleAnimate(staticStyle, dynamicStyle, jsxAttribute) {
  var { value } = jsxAttribute

  value.expression.properties.forEach((property) => {
    const { name } = property.key

    if (name in animatePropMap) {
      const mappedPropertyName = animatePropMap[name]

      addCssProperty(
        staticStyle,
        dynamicStyle,
        mappedPropertyName,
        property.value
      )
    } else if (name === "repeat") {
      const { value } = property

      // when repeat === true, set it to "infinite"
      if (t.isBooleanLiteral(value) && value.value === true) {
        staticStyle["animationIterationCount"] = t.stringLiteral("infinite")
      } else {
        addCssProperty(
          staticStyle,
          dynamicStyle,
          "animationIterationCount",
          property.value
        )
      }
    } else if (name === "keyframes") {
      const id = `kf${keyframeIdCounter++}`

      // add animation name
      addCssProperty(
        staticStyle,
        dynamicStyle,
        "animationName",
        t.stringLiteral(id)
      )

      // add keyframes
      staticStyle[`@keyframes ${id}`] = property.value
    }
  })
}

exports.BASE_PROPS_TO_OMIT = BASE_PROPS_TO_OMIT
exports.buildDefaultCssProp = buildDefaultCssProp
exports.buildClassNamePropFunction = buildClassNamePropFunction
exports.buildClassNameProp = buildClassNameProp
exports.buildStyleProp = buildStyleProp
exports.addTemplateToTemplate = addTemplateToTemplate
exports.addStringToTemplate = addStringToTemplate
exports.addQuasiToTemplate = addQuasiToTemplate
exports.addExpressionToTemplate = addExpressionToTemplate
exports.renameTag = renameTag
exports.tagPrefixRegex = tagPrefixRegex
exports.addCssProperty = addCssProperty
exports.addCssProperties = addCssProperties
exports.addBooleanPropertySet = addBooleanPropertySet
exports.addBooleanProperty = addBooleanProperty
exports.handleAnimate = handleAnimate
