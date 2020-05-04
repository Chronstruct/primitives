"use strict"

// var printAST = require('ast-pretty-print')
var t = require("@babel/types")
var Utils = require("./utils")
var renameTag = Utils.renameTag,
  tagPrefixRegex = Utils.tagPrefixRegex,
  addBooleanPropertySet = Utils.addBooleanPropertySet,
  addCssProperty = Utils.addCssProperty,
  addBooleanProperty = Utils.addBooleanProperty,
  buildClassNamePropFunction = Utils.buildClassNamePropFunction,
  buildStyleProp = Utils.buildStyleProp

var propsToOmit = {
  tag: true,
}

var booleanProps = {
  center: {
    alignItems: t.stringLiteral("center"),
    justifyContent: t.stringLiteral("center"),
    //consequent: 'align-items: center;justify-content: center;',
    //alternate: '',
  },
  hidden: {
    display: t.stringLiteral("none"),
    //consequent: 'display: none;',
    //alternate: '',
  },
  inline: {
    display: t.stringLiteral("inline-flex"),
    //consequent: 'display: inline-flex;',
    //alternate: '',
  },
  fit: {
    height: t.stringLiteral("100%"),
    width: t.stringLiteral("100%"),
    //consequent: 'height: 100%;width: 100%;',
    //alternate: '',
  },
  absoluteFill: {
    position: t.stringLiteral("absolute"),
    top: t.numericLiteral(0),
    right: t.numericLiteral(0),
    bottom: t.numericLiteral(0),
    left: t.numericLiteral(0),
    //consequent: 'position: absolute;top: 0;right: 0;bottom: 0;left: 0;',
    //alternate: '',
  },
}

const propMap = {
  paddingVertical: ["paddingTop", "paddingBottom"],
  paddingHorizontal: ["paddingRight", "paddingLeft"],

  top: "top",
  right: "right",
  bottom: "bottom",
  left: "left",
  width: "width",
  maxWidth: "maxWidth",
  minWidth: "minWidth",
  height: "height",
  maxHeight: "maxHeight",
  minHeight: "minHeight",

  flex: "flex",
  wrap: "flexWrap",
  // grow: 'flex-grow',
  // shrink: "flexShrink",
  basis: "flexBasis",
  order: "order",
  alignContent: "alignContent",
  alignSelf: "alignSelf",
  align: "alignItems",
  justify: "justifyContent",
  // alignVertical
  // alignHorizontal

  padding: "padding",
  paddingTop: "paddingTop",
  paddingRight: "paddingRight",
  paddingBottom: "paddingBottom",
  paddingLeft: "paddingLeft",
  margin: "margin",
  marginTop: "marginTop",
  marginRight: "marginRight",
  marginBottom: "marginBottom",
  marginLeft: "marginLeft",

  position: "position",
  overflow: "overflow",
  overflowX: "overflowX",
  overflowY: "overflowY",
  //WebkitOverflowScrolling
  zIndex: "zIndex",
}

const flexPropMap = { ...propMap, direction: "flexDirection" }

// var defaultFlexCss =
//   "display: flex;flex-shrink: 0;align-content: flex-start;position: relative;"
// var defaultColCss =
//   "display: flex;flex-direction: column;flex-shrink: 0;align-content: flex-start;position: relative;"
// var defaultRowCss =
//   "display: flex;flex-direction: row;flex-shrink: 0;align-content: flex-start;position: relative;"

/*
var defaultFlex = t.objectExpression(
    [
        t.objectProperty(t.identifier('display'), t.stringLiteral('flex')),
        t.objectProperty(t.identifier('alignContent'), t.stringLiteral('flexStart')),
        t.objectProperty(t.identifier('position'), t.stringLiteral('relative')),
        t.objectProperty(t.identifier('flexShrink'), t.numericLiteral(0)),
    ]
)

var defaultCol = t.objectExpression(
    [
        t.objectProperty(t.identifier('display'), t.stringLiteral('flex')),
        t.objectProperty(t.identifier('flexDirection'), t.stringLiteral('column')),
        t.objectProperty(t.identifier('alignContent'), t.stringLiteral('flexStart')),
        t.objectProperty(t.identifier('position'), t.stringLiteral('relative')),
        t.objectProperty(t.identifier('flexShrink'), t.numericLiteral(0)),
    ]
)

var defaultRow = t.objectExpression(
    [
        t.objectProperty(t.identifier('display'), t.stringLiteral('flex')),
        t.objectProperty(t.identifier('flexDirection'), t.stringLiteral('row')),
        t.objectProperty(t.identifier('alignContent'), t.stringLiteral('flexStart')),
        t.objectProperty(t.identifier('position'), t.stringLiteral('relative')),
        t.objectProperty(t.identifier('flexShrink'), t.numericLiteral(0)),
    ]
)
*/

var defaultFlex = {
  display: t.stringLiteral("flex"),
  alignContent: t.stringLiteral("flex-start"),
  position: t.stringLiteral("relative"),
  flexShrink: t.numericLiteral(0),
}

var defaultCol = {
  display: t.stringLiteral("flex"),
  flexDirection: t.stringLiteral("column"),
  alignContent: t.stringLiteral("flex-start"),
  position: t.stringLiteral("relative"),
  flexShrink: t.numericLiteral(0),
}

var defaultRow = {
  display: t.stringLiteral("flex"),
  flexDirection: t.stringLiteral("row"),
  alignContent: t.stringLiteral("flex-start"),
  position: t.stringLiteral("relative"),
  flexShrink: t.numericLiteral(0),
}

module.exports = function (node, tagName) {
  function buildProps(node, defaultCss, cssPropMap) {
    // var css = buildDefaultCssProp(t, defaultCss)
    var cssProperties = Object.assign({}, defaultCss)
    var inlineStyleObject = {}
    var inlineStyleBabelProperties = []
    var props = []
    let otherClassNames

    //var className = buildClassNamePropFunction(t, cssProperties)
    //className.value.expression.loc = node.loc

    //var cssProperties = className.value.expression.arguments[0].properties

    //var props = [className]

    if (node.openingElement.attributes != null) {
      node.openingElement.attributes.forEach((attribute) => {
        if (!attribute.name) {
          return
        }

        var name = attribute.name.name

        if (name in propsToOmit) {
          return
        }
        else if (name === "style") {
          attribute.value.expression.properties.forEach((property) => {
            addCssProperty(
              cssProperties,
              inlineStyleObject,
              property.key.name,
              property.value
            )
          })
        }
        else if (name === "inlineStyle") {
          inlineStyleBabelProperties.push(
            ...attribute.value.expression.properties
          )
        }
        else if (name in cssPropMap) {
          const mappedProperty = cssPropMap[name]

          if (Array.isArray(mappedProperty)) {
            mappedProperty.forEach((prop) => {
              addCssProperty(
                cssProperties,
                inlineStyleObject,
                prop,
                attribute.value
              )
            })
          }
          else {
            addCssProperty(
              cssProperties,
              inlineStyleObject,
              mappedProperty,
              attribute.value
            )
          }
        }
        else if (name in booleanProps) {
          addBooleanPropertySet(
            cssProperties,
            inlineStyleObject,
            attribute,
            booleanProps[name]
          )
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
            },
            { allowNumber: true }
          )
        }
        else if (name === "shrink") {
          addBooleanProperty(
            cssProperties,
            inlineStyleObject,
            attribute,
            "flexShrink",
            {
              true: t.numericLiteral(1),
              false: t.numericLiteral(0),
            },
            { allowNumber: true }
          )
        }
        else if (tagPrefixRegex.test(name)) {
          attribute.name.name = name.replace(tagPrefixRegex, "")
          props.push(attribute)
        }
        else if (name === "className") {
          if (t.isJSXExpressionContainer(attribute.value)) {
            otherClassNames = attribute.value.expression
          }
          else if (t.isStringLiteral(attribute.value)) {
            otherClassNames = attribute.value
          }

          // Note: skip adding to props
        }
        else {
          props.push(attribute)
        }
      })
    }

    var classNameProp = buildClassNamePropFunction(
      t,
      cssProperties,
      cssPropMap,
      otherClassNames
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

  if (tagName === "view" || tagName === "box" || tagName === "BOX") {
    renameTag(node)
    node.openingElement.attributes = buildProps(node, defaultFlex, flexPropMap)
  }
  else if (tagName === "col" || tagName === "v") {
    renameTag(node)
    node.openingElement.attributes = buildProps(node, defaultCol, propMap)
  }
  else if (tagName === "row" || tagName === "h") {
    renameTag(node)
    node.openingElement.attributes = buildProps(node, defaultRow, propMap)
  }
  else if (tagName === "flex" || tagName === "stack") {
    renameTag(node)
    node.openingElement.attributes = buildProps(node, defaultFlex, flexPropMap)
  }
}
