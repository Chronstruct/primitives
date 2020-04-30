const babel = require("@babel/core")
var t = require("@babel/types")
var Utils = require("../src/utils")

var renameTag = Utils.renameTag,
  addBooleanProperty = Utils.addBooleanProperty,
  addCssProperty = Utils.addCssProperty,
  buildClassNamePropFunction = Utils.buildClassNamePropFunction

it("addCssProperty with NumericLiteral", () => {
  var input = {}
  var key = "flexShrink"
  var value = t.numericLiteral(1)

  var expectedOutput = { [key]: value }

  addCssProperty(input, key, value)

  expect(input).toStrictEqual(expectedOutput)
})

it("addCssProperty with ObjectExpression", () => {
  // size={{'': 20, '@media screen and (min-width: 200px)': 200}}
  var input = {}
  var key = "size"
  var value = t.jsxExpressionContainer(
    t.objectExpression([
      t.objectProperty(t.stringLiteral(""), t.numericLiteral(20)),
      t.objectProperty(
        t.stringLiteral("@media screen and (min-width: 200px)"),
        t.numericLiteral(200)
      ),
    ])
  )

  /*
   {
     '@media screen and (min-width: 200px)': {
       size: 200
     },
     size: 20,
    }
   */
  var expectedOutput = {
    "@media screen and (min-width: 200px)": t.objectExpression([
      t.objectProperty(t.identifier("size"), t.numericLiteral(200)),
    ]),
    size: t.numericLiteral(20),
  }

  addCssProperty(input, key, value)

  expect(input).toStrictEqual(expectedOutput)
})

it("addBooleanProperty `center={true}`", () => {
  var input = {}
  var attribute = t.jsxAttribute(
    t.jsxIdentifier("center"),
    t.jsxExpressionContainer(t.booleanLiteral(true))
  )
  var propertiesToAdd = { someKey: t.numericLiteral(1) }

  addBooleanProperty(input, attribute, propertiesToAdd)

  expect(input).toStrictEqual(propertiesToAdd)
})

it("addBooleanProperty `center`", () => {
  var input = {}
  var attribute = t.jsxAttribute(t.jsxIdentifier("center"))
  var propertiesToAdd = { someKey: t.numericLiteral(1) }

  addBooleanProperty(input, attribute, propertiesToAdd)

  expect(input).toStrictEqual(propertiesToAdd)
})

// TODO - implement

// it("addBooleanProperty `center={Object}`", () => {
//   var input = {}
//   var attribute = t.jsxAttribute(
//     t.jsxIdentifier("center"),
//     t.objectExpression([t.objectProperty(t.identifier("hover"))])
//   )
//   var propertiesToAdd = { someKey: t.numericLiteral(1) }

//   /*
//    {
//      '@media screen and (min-width: 200px)': {
//        size: 200
//      },
//      size: 20,
//     }
//    */
//   var expectedOutput = {
//     "hover": t.objectExpression([
//       t.objectProperty(t.identifier("size"), t.numericLiteral(200)),
//     ]),
//     size: t.numericLiteral(20),
//   }

//   addBooleanProperty(input, attribute, propertiesToAdd)

//   expect(input).toStrictEqual(propertiesToAdd)
// })
