"use strict"

// var printAST = require('ast-pretty-print')
var t = require("@babel/types")
var objectStylesToTemplate = require("./objectStylesToTemplate")

/**
 * @typedef { import("@babel/types").JSXAttribute } JSXAttribute
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
 * @return {any} className prop with styles
 */
function buildClassNamePropFunction(t, cssObject, keyAliases) {
  var objectProperties = Object.keys(cssObject).map((key) => {
    var value = cssObject[key]

    if (!isNaN(key)) {
      key = `@media screen and (min-width: ${key}px)`
    }
    else if (key in keyAliases) {
      key = keyAliases[key]
    }

    return t.objectProperty(t.identifier(key), value)
  })

  return t.jSXAttribute(
    t.jSXIdentifier("className"),
    t.jSXExpressionContainer(
      objectStylesToTemplate(objectProperties)
      // t.callExpression(
      //     t.identifier('css'),
      //     [
      //         t.objectExpression(objectProperties)
      //     ]
      // )
    )
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
    }
    else {
      target.expressions = target.expressions.concat(
        template.expressions.slice(0)
      )

      // concate the first quasi, then push on the rest
      addStringToTemplate(target, template.quasis[0].value.raw)
      target.quasis = target.quasis.concat(template.quasis.slice(1))
    }
  }
  else {
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

function renameTag(node, defaultTag = "div") {
  let tagName = defaultTag

  if (node.openingElement.attributes != null) {
    var name = node.openingElement.attributes.find((prop) => {
      return prop.name && prop.name.name === "as"
    })

    if (name !== undefined) {
      var val = name.value.value || name.value.expression.value

      if (val != null) {
        tagName = val
      }
      else {
        console.log("invalid `as` value. No variables allowed.")
      }
    }
  }

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

      // IS already in cssProperties
      if (varSafeKey in cssObject) {
        // e.g. [HOVER]: { already: added; color: red; }
        cssObject[varSafeKey].properties.push(
          t.objectProperty(t.identifier(cssKey), value)
        )
      }
      // ISN'T already in cssProperties
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
      // IS already in cssProperties
      else if (key in cssObject) {
        // e.g. hover: { already: added; color: red; }
        cssObject[key].properties.push(
          t.objectProperty(t.identifier(cssKey), value)
        )
      }
      // ISN'T already in cssProperties
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
 * @param {Object} cssProperties
 * @param {string} key
 * @param {any} propValue
 * @return {any} className prop with styles
 */
function addCssProperty(cssProperties, key, propValue, valueMap) {
  //   console.log("cssProperties", cssProperties)
  //   console.log("key", key)
  //   console.log("propValue", propValue)

  if (t.isJSXExpressionContainer(propValue)) {
    var { expression } = propValue

    if (t.isObjectExpression(expression)) {
      addObjectValueToCSS(expression, cssProperties, key, valueMap)
    }
    else {
      cssProperties[key] = expression
    }
  }
  else if (t.isObjectExpression(propValue)) {
    addObjectValueToCSS(propValue, cssProperties, key, valueMap)
  }
  else {
    cssProperties[key] = propValue
  }
}

/**
 * @param {Object} cssProperties
 * @param {Object} propertiesToAdd
 * @return {any} className prop with styles
 */
function addCssProperties(cssProperties, propertiesToAdd) {
  Object.keys(propertiesToAdd).forEach((key) => {
    addCssProperty(cssProperties, key, propertiesToAdd[key])
  })
}

/**
 * @param {Object} cssProperties
 * @param {Types.JSXAttribute} jsxAttribute
 * @param {Object} propertiesToAdd
 * @return {any} className prop with styles
 */
function addBooleanPropertySet(cssProperties, jsxAttribute, propertiesToAdd) {
  var { value } = jsxAttribute
  //   console.log("attribute", attribute)

  if (isBooleanProp(jsxAttribute)) {
    addCssProperties(cssProperties, propertiesToAdd)
  }
  else if (t.isJSXExpressionContainer(value)) {
    var { expression } = value

    if (t.isBooleanLiteral(expression) && expression.value === true) {
      addCssProperties(cssProperties, propertiesToAdd)
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

// const defaultAddBooleanPropertyConfig = {
//   allowString: false,
//   allowNumber: false,
// }
/**
 * @param {Object} cssProperties
 * @param {JSXAttribute} jsxAttribute
 * @param {string} key - key to apply to cssProperties
 * @param {{true: any, false: any}} valueMap - used to convert from boolean values
 * @param {{allowString: boolean, allowNumber: boolean}} config - which non-boolean values are allowed
 * @return {void}
 */
function addBooleanProperty(
  cssProperties,
  jsxAttribute,
  key,
  valueMap,
  config
) {
  var { value } = jsxAttribute

  if (isBooleanProp(jsxAttribute)) {
    addCssProperty(cssProperties, key, valueMap[true])
  }
  // e.g. grow="1" (NOT SUPPORTED by default)
  else if (config && config.allowString && isStringProp(jsxAttribute)) {
    addCssProperty(cssProperties, key, value)
  }
  else if (isExpressionProp(jsxAttribute)) {
    var { expression } = value

    console.log("expression:", expression)

    // e.g. grow={1} (NOT SUPPORTED by default)
    if (config && config.allowNumber && t.isNumericLiteral(expression)) {
      addCssProperty(cssProperties, key, expression)
    }
    // e.g. grow={"1"} (NOT SUPPORTED by default)
    else if (config && config.allowString && t.isStringLiteral(expression)) {
      addCssProperty(cssProperties, key, expression)
    }
    // e.g. grow={someVar}
    else if (t.isIdentifier(expression)) {
      // TODO: check ALL_CAPS. send to inline if not.
      addCssProperty(cssProperties, key, expression)
    }
    // e.g. grow={true}
    else if (t.isBooleanLiteral(expression)) {
      addCssProperty(cssProperties, key, valueMap[expression.value])
    }
    // e.g. grow={{'': true, 'hover': false}}
    else if (t.isObjectExpression(expression)) {
      addCssProperty(cssProperties, key, expression, valueMap)
    }
    // e.g. grow={isTrue ? true : false}
    // e.g. grow={isTrue && true}
    else if (t.isConditionalExpression(expression)) {
      //todo: pass to inline styles
    }
    // todo: shrink={`${someVar}`}
    // todo: strink=
  }
}

/**
 * e.g. bold
 * @param {JSXAttribute} jsxAttribute
 * @return {boolean}
 */
function isBooleanProp(jsxAttribute) {
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

exports.buildDefaultCssProp = buildDefaultCssProp
exports.buildClassNamePropFunction = buildClassNamePropFunction
exports.buildClassNameProp = buildClassNameProp
exports.buildStyleProp = buildStyleProp
exports.addTemplateToTemplate = addTemplateToTemplate
exports.addStringToTemplate = addStringToTemplate
exports.addQuasiToTemplate = addQuasiToTemplate
exports.addExpressionToTemplate = addExpressionToTemplate
exports.renameTag = renameTag
exports.addCssProperty = addCssProperty
exports.addCssProperties = addCssProperties
exports.addBooleanPropertySet = addBooleanPropertySet
exports.addBooleanProperty = addBooleanProperty
