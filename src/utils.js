"use strict"

// var printAST = require('ast-pretty-print')
var t = require("@babel/types")
var objectStylesToTemplate = require("./objectStylesToTemplate")

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
    } else if (key in keyAliases) {
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
      } else {
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
 * @param {Object} cssProperties
 * @param {string} key
 * @param {any} propValue
 * @return {any} className prop with styles
 */
function addCssProperty(cssProperties, key, propValue) {
  //   console.log("cssProperties", cssProperties)
  //   console.log("key", key)
  //   console.log("propValue", propValue)
  //   console.log(
  //     "propValue.expression.properties",
  //     propValue.expression.properties
  //   )

  if (t.isJSXExpressionContainer(propValue)) {
    var { expression } = propValue

    if (t.isObjectExpression(expression)) {
      expression.properties.forEach((property) => {
        //console.log(property)
        //TODO: handle when key is of type 'Identifier'

        // base case
        if (property.key.value === "") {
          cssProperties[key] = property.value
        }
        // state that ISN'T already in cssProperties
        else if (!(property.key.value in cssProperties)) {
          cssProperties[property.key.value] = t.objectExpression([
            t.objectProperty(t.identifier(key), property.value),
          ])
        }
        // state that IS already in cssProperties
        else if (property.key.value in cssProperties) {
          cssProperties[property.key.value].properties.push(
            t.objectProperty(t.identifier(key), property.value)
          )
        }
      })
    } else {
      cssProperties[key] = expression
    }
  } else if (t.isObjectExpression(propValue)) {
    propValue.properties.forEach((property) => {
      // base case
      if (property.key.value === "") {
        cssProperties[key] = property.value
      }
      // state that ISN'T already in cssProperties
      else if (!(property.key.value in cssProperties)) {
        cssProperties[property.key.value] = t.objectExpression([
          t.objectProperty(t.identifier(key), property.value),
        ])
      }
      // state that IS already in cssProperties
      else if (property.key.value in cssProperties) {
        cssProperties[property.key.value].properties.push(
          t.objectProperty(t.identifier(key), property.value)
        )
      }
    })
  } else {
    cssProperties[key] = propValue
  }
}

/**
 * @param {Object} cssProperties
 * @param {Object} propertiesToAdd
 * @return {any} className prop with styles
 */
function addCssProperties(cssProperties, propertiesToAdd) {
  //   console.log(propertiesToAdd)
  Object.keys(propertiesToAdd).forEach((key) => {
    // console.log(key)
    addCssProperty(cssProperties, key, propertiesToAdd[key])
  })
}

/**
 * @param {Object} cssProperties
 * @param {string} attribute
 * @param {Object} propertiesToAdd
 * @return {any} className prop with styles
 */
// todo: rename to addBooleanPropertySet
function addBooleanProperty(cssProperties, attribute, propertiesToAdd) {
  var { value } = attribute
  //   console.log("attribute", attribute)

  if (value === null) {
    addCssProperties(cssProperties, propertiesToAdd)
  } else if (t.isJSXExpressionContainer(value)) {
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

/**
 * @param {Object} cssProperties
 * @param {JSXAttribute} prop
 * @param {Object} propertiesToAdd
 * @return {any} className prop with styles
 */
// todo: rename to addBooleanProperty
function addGrowProp(cssProperties, prop) {
  var { value } = prop

  if (isBooleanProp(prop)) {
    addCssProperty(cssProperties, "flexGrow", t.numericLiteral(1))
  } else if (isStringProp(prop)) {
    addCssProperty(cssProperties, "flexGrow", value)
  } else if (isExpressionProp(prop)) {
    var { expression } = value

    // e.g. grow={1}
    if (t.isNumericLiteral(expression)) {
      addCssProperty(cssProperties, "flexGrow", expression)
    }
    // e.g. grow={"1"}
    else if (t.isStringLiteral(expression)) {
      addCssProperty(cssProperties, "flexGrow", expression)
    }
    // e.g. grow={someVar}
    else if (t.isIdentifier(expression)) {
      addCssProperty(cssProperties, "flexGrow", expression)
    }
  }
}

// e.g. bold
function isBooleanProp(prop) {
  return prop.value === null
}

// e.g. bold={_}
function isExpressionProp(prop) {
  return t.isJSXExpressionContainer(prop.value)
}

// e.g. bold="_"
function isStringProp(prop) {
  return t.isStringLiteral(prop.value)
}

exports.buildDefaultCssProp = buildDefaultCssProp
exports.buildClassNamePropFunction = buildClassNamePropFunction
exports.buildClassNameProp = buildClassNameProp
exports.addTemplateToTemplate = addTemplateToTemplate
exports.addStringToTemplate = addStringToTemplate
exports.addQuasiToTemplate = addQuasiToTemplate
exports.addExpressionToTemplate = addExpressionToTemplate
exports.renameTag = renameTag
exports.addCssProperty = addCssProperty
exports.addCssProperties = addCssProperties
exports.addBooleanProperty = addBooleanProperty
exports.addGrowProp = addGrowProp
