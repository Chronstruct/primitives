// const printAST = require('ast-pretty-print')
import * as t from 'babel-types'

export function buildDefaultCssProp(t, css) {
  return t.jSXAttribute(
    t.jSXIdentifier('css'),
    t.jSXExpressionContainer(
      t.templateLiteral(
        [
          t.templateElement({
            raw: css,
            cooked: css,
          })
        ],
        [],
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

export function buildClassNamePropFunction(t, cssObject) {
    const objectProperties =
        Object.keys(cssObject).map(key => {
            return t.objectProperty(
                    t.identifier(!isNaN(key) ? `@media screen and (min-width: ${key}px)` : key),
                    cssObject[key],
                )
            }
        )

    return t.jSXAttribute(
        t.jSXIdentifier('className'),
        t.jSXExpressionContainer(
            t.callExpression(
                t.identifier('css'),
                [
                    t.objectExpression(objectProperties)
                ]
            )
        )
    )
}

export function buildClassNameProp(t, css) {
    return t.jSXAttribute(
        t.jSXIdentifier('className'),
        t.jSXExpressionContainer(
            t.taggedTemplateExpression(
                t.identifier('css'),
                t.templateLiteral(
                    [
                        t.templateElement({
                            raw: css,
                            cooked: css,
                        })
                    ],
                    [],
                )
            )
        )
    )
}

export function addTemplateToTemplate(target, template) {
  if (template.expressions.length > 0) {
    if (target.expressions.length === target.quasis.length) {
      // safe to just push these
      target.expressions.push(...template.expressions)
      target.quasis.push(...template.quasis)
    }
    else {
      target.expressions.push(...template.expressions)

      // concate the first quasi, then push on the rest
      addStringToTemplate(target, template.quasis[0].value.raw)
      target.quasis.push(...template.quasis.slice(1))
    }
  }
  else {
    addStringToTemplate(target, template.quasis[0].value.raw)
  }
}

export function addStringToTemplate(template, str) {
  const last = template.quasis.length - 1

  template.quasis[last].value.raw = template.quasis[last].value.raw + str
  template.quasis[last].value.cooked = template.quasis[last].value.cooked + str
}

export function addQuasiToTemplate(template, quasi) {
  template.quasis.push(quasi)
}

export function addExpressionToTemplate(template, expression) {
  template.expressions.push(expression)
}

export function renameTag(node, defaultTag = 'div') {
  let tagName = defaultTag

  if (node.openingElement.attributes != null) {
    const name = node.openingElement.attributes.find(prop => {
      return prop.name && prop.name.name === 'as'
    })

    if (name !== undefined) {
      const val = name.value.value || name.value.expression.value

      if (val != null) {
        tagName = val
      }
      else {
        console.log('invalid `as` value. No variables allowed.')
      }
    }
  }

  node.openingElement.name.name = tagName

  if (node.closingElement) {
    node.closingElement.name.name = tagName
  }
}

export function addCssProperty(cssProperties, key, propValue) {
    if (t.isJSXExpressionContainer(propValue)) {
        const {expression} = propValue

        if (t.isObjectExpression(expression)) {
            expression.properties.forEach((property) => {
                //console.log(property)
                //TODO: handle when key is of type 'Identifier'

                // base case
                if (property.key.value === '') {
                    cssProperties[key] = property.value
                }
                // state that ISN'T already in cssProperties
                else if (!(property.key.value in cssProperties)) {
                    cssProperties[property.key.value] = t.objectExpression(
                        [
                            t.objectProperty(t.identifier(key), property.value),
                        ]
                    )
                }
                // state that IS already in cssProperties
                else if (property.key.value in cssProperties) {
                    cssProperties[property.key.value].properties.push(t.objectProperty(t.identifier(key), property.value))
                }
            })
        }
        else {
            cssProperties[key] = expression
        }
    }
    else if (t.isObjectExpression(propValue)) {
        propValue.properties.forEach((property) => {

            // base case
            if (property.key.value === '') {
                cssProperties[key] = property.value
            }
            // state that ISN'T already in cssProperties
            else if (!(property.key.value in cssProperties)) {
                cssProperties[property.key.value] = t.objectExpression(
                    [
                        t.objectProperty(t.identifier(key), property.value),
                    ]
                )
            }
            // state that IS already in cssProperties
            else if (property.key.value in cssProperties) {
                cssProperties[property.key.value].properties.push(t.objectProperty(t.identifier(key), property.value))
            }
        })
    }
    else {
        cssProperties[key] = propValue
    }
}

export function addCssProperties(cssProperties, propertiesToAdd) {
    Object.keys(propertiesToAdd).forEach(key => {
        addCssProperty(cssProperties, key, propertiesToAdd[key])
    })
}

export function addBooleanProperty(cssProperties, attribute, booleanProperties) {
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

export function addGrowProp(cssProperties, attribute) {
    const { value } = attribute

    if (value === null) {
        addCssProperty(cssProperties, 'flexGrow', t.numericLiteral(1))
    }
    else if (t.isJSXExpressionContainer(value)) {
        const { expression } = value

        if (t.isNumericLiteral(expression)) {
            addCssProperty(cssProperties, 'flexGrow', expression)
        }
        else if (t.isStringLiteral(expression)) {
            addCssProperty(cssProperties, 'flexGrow', expression)
        }
        else if (t.isIdentifier(expression)) {
            addCssProperty(cssProperties, 'flexGrow', expression)
        }
    }
    else if (t.isStringLiteral(value)) {
        addCssProperty(cssProperties, 'flexGrow', value)
    }
}
